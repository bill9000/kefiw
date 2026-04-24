import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Shield, Atom, Binary, Database, Eye, Fingerprint,
  Terminal, Wifi, Cloud, Lock, Bolt, Radar, Rocket, Satellite, Server, Globe,
  Activity, RotateCcw, Trophy,
} from 'lucide-react';

type IconKey = keyof typeof ICON_MAP;

const ICON_MAP = {
  cpu: Cpu, zap: Zap, shield: Shield, atom: Atom, binary: Binary, database: Database,
  eye: Eye, fingerprint: Fingerprint, terminal: Terminal, wifi: Wifi, cloud: Cloud, lock: Lock,
  bolt: Bolt, radar: Radar, rocket: Rocket, satellite: Satellite, server: Server, globe: Globe,
} as const;

const ICON_KEYS: IconKey[] = Object.keys(ICON_MAP) as IconKey[];

interface Tile {
  id: string;
  iconKey: IconKey;
  faceUp: boolean;
  matched: boolean;
  particle?: number;
}

type Size = 4 | 6;

const STORAGE = 'vibematch-stats-v1';
const COLOR_BG = '#000000';
const COLOR_PANEL = '#0a0a0a';
const COLOR_GRID = '#1a1a2e';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_CYAN_GLOW = '#67e8f9';
const COLOR_MAGENTA = '#e879f9';
const COLOR_MAGENTA_GLOW = '#f0abfc';
const COLOR_MATCH = '#4ade80';
const COLOR_MATCH_GLOW = '#86efac';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDeck(size: Size): Tile[] {
  const numPairs = (size * size) / 2;
  const chosen = shuffle([...ICON_KEYS]).slice(0, numPairs);
  const pool: Tile[] = [];
  chosen.forEach((k, i) => {
    pool.push({ id: `p${i}a`, iconKey: k, faceUp: false, matched: false });
    pool.push({ id: `p${i}b`, iconKey: k, faceUp: false, matched: false });
  });
  return shuffle(pool);
}

function formatTime(ms: number): string {
  const s = ms / 1000;
  return `${s.toFixed(1)}s`;
}

export default function VibeMatch() {
  const [size, setSize] = useState<Size>(4);
  const [tiles, setTiles] = useState<Tile[]>(() => buildDeck(4));
  const [firstFlip, setFirstFlip] = useState<number | null>(null);
  const [secondFlip, setSecondFlip] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [misses, setMisses] = useState(0);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [won, setWon] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [glitchIndices, setGlitchIndices] = useState<Set<number>>(new Set());
  const [particleBurst, setParticleBurst] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);
  const [fastest, setFastest] = useState<{ s4: number | null; s6: number | null; wins: number }>({ s4: null, s6: null, wins: 0 });
  const particleCounter = useRef(0);

  // Hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const s = JSON.parse(raw);
        setFastest({
          s4: typeof s.s4 === 'number' ? s.s4 : null,
          s6: typeof s.s6 === 'number' ? s.s6 : null,
          wins: s.wins || 0,
        });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE, JSON.stringify(fastest));
  }, [fastest, hydrated]);

  // Timer
  useEffect(() => {
    if (!startAt || won) return;
    const id = setInterval(() => setElapsed(Date.now() - startAt), 97);
    return () => clearInterval(id);
  }, [startAt, won]);

  // Evaluate a pair after the second flip
  useEffect(() => {
    if (firstFlip === null || secondFlip === null) return;
    const first = tiles[firstFlip];
    const second = tiles[secondFlip];
    if (!first || !second) return;
    const isMatch = first.iconKey === second.iconKey;
    const timer = setTimeout(() => {
      if (isMatch) {
        const burstId1 = ++particleCounter.current;
        const burstId2 = ++particleCounter.current;
        setParticleBurst((b) => ({ ...b, [first.id]: burstId1, [second.id]: burstId2 }));
        setTiles((ts) => ts.map((t, i) =>
          (i === firstFlip || i === secondFlip) ? { ...t, matched: true, faceUp: true } : t
        ));
        setTimeout(() => {
          setParticleBurst((b) => {
            const n = { ...b };
            delete n[first.id]; delete n[second.id];
            return n;
          });
        }, 900);
      } else {
        setTiles((ts) => ts.map((t, i) =>
          (i === firstFlip || i === secondFlip) ? { ...t, faceUp: false } : t
        ));
        setMisses((m) => m + 1);
      }
      setFirstFlip(null);
      setSecondFlip(null);
      setLocked(false);
    }, 520);
    return () => clearTimeout(timer);
  }, [firstFlip, secondFlip, tiles]);

  // Neural glitch — swap two hidden tiles every 8 misses
  useEffect(() => {
    if (misses === 0 || misses % 8 !== 0) return;
    const hiddenIdx = tiles
      .map((t, i) => (!t.matched && !t.faceUp ? i : -1))
      .filter((i) => i >= 0);
    if (hiddenIdx.length < 2) return;
    const picks = shuffle(hiddenIdx).slice(0, 2);
    const [a, b] = picks;
    setGlitching(true);
    setGlitchIndices(new Set(picks));
    const t1 = setTimeout(() => {
      setTiles((ts) => {
        const next = [...ts];
        [next[a], next[b]] = [next[b], next[a]];
        return next;
      });
    }, 220);
    const t2 = setTimeout(() => {
      setGlitching(false);
      setGlitchIndices(new Set());
    }, 820);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [misses]);

  // Win detection
  const matchedPairs = useMemo(() => tiles.filter((t) => t.matched).length / 2, [tiles]);
  const totalPairs = tiles.length / 2;
  const allMatched = tiles.length > 0 && matchedPairs === totalPairs;

  useEffect(() => {
    if (!allMatched || won) return;
    setWon(true);
    const finalMs = startAt ? Date.now() - startAt : elapsed;
    setElapsed(finalMs);
    const key = size === 4 ? 's4' : 's6';
    setFastest((prev) => {
      const prior = prev[key];
      const next = prior == null ? finalMs : Math.min(prior, finalMs);
      return { ...prev, [key]: next, wins: prev.wins + 1 };
    });
  }, [allMatched]);

  function flip(idx: number) {
    if (locked || won || glitching) return;
    const t = tiles[idx];
    if (!t || t.faceUp || t.matched) return;
    if (!startAt) setStartAt(Date.now());

    if (firstFlip === null) {
      setFirstFlip(idx);
      setTiles((ts) => ts.map((x, i) => (i === idx ? { ...x, faceUp: true } : x)));
      return;
    }
    if (secondFlip === null && firstFlip !== idx) {
      setSecondFlip(idx);
      setTiles((ts) => ts.map((x, i) => (i === idx ? { ...x, faceUp: true } : x)));
      setLocked(true);
      setAttempts((a) => a + 1);
    }
  }

  function newGame(nextSize?: Size) {
    const s = nextSize ?? size;
    setSize(s);
    setTiles(buildDeck(s));
    setFirstFlip(null);
    setSecondFlip(null);
    setLocked(false);
    setAttempts(0);
    setMisses(0);
    setStartAt(null);
    setElapsed(0);
    setWon(false);
    setGlitching(false);
    setGlitchIndices(new Set());
    setParticleBurst({});
  }

  const syncPct = Math.round((matchedPairs / totalPairs) * 100);
  const fastestForSize = size === 4 ? fastest.s4 : fastest.s6;
  const isNewBest = won && fastestForSize !== null && elapsed <= fastestForSize;

  return (
    <div style={{ padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_CYAN} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '.08em' }}>VIBE_MATCH // {size}×{size}</div>
            <div style={{ fontSize: 12, color: COLOR_DIM }}>Neural Synchrony — pair every node</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <div><span style={{ color: COLOR_DIM }}>FASTEST </span><span style={{ color: COLOR_MATCH, fontWeight: 700 }}>{fastestForSize == null ? '—' : formatTime(fastestForSize)}</span></div>
          <div><span style={{ color: COLOR_DIM }}>WINS </span><span style={{ color: COLOR_CYAN, fontWeight: 700 }}>{fastest.wins}</span></div>
        </div>
      </div>

      {/* HUD */}
      <div style={{ maxWidth: 520, margin: '0 auto 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <HudCell label="SYNC" value={`${syncPct}%`} color={COLOR_CYAN} />
        <HudCell label="ATTEMPTS" value={`${attempts}`} color={COLOR_MAGENTA} />
        <HudCell label="LATENCY" value={formatTime(elapsed)} color={COLOR_MATCH} />
      </div>

      {/* Sync bar */}
      <div style={{ maxWidth: 520, margin: '0 auto 14px' }}>
        <div style={{ height: 4, background: COLOR_GRID, borderRadius: 2, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${syncPct}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              background: syncPct === 100 ? COLOR_MATCH : COLOR_CYAN,
              boxShadow: `0 0 8px ${syncPct === 100 ? COLOR_MATCH_GLOW : COLOR_CYAN_GLOW}`,
            }}
          />
        </div>
      </div>

      {/* Grid */}
      <motion.div
        animate={glitching ? { x: [0, -5, 5, -4, 4, -2, 2, 0] } : { x: 0 }}
        transition={glitching ? { duration: 0.6 } : { duration: 0.1 }}
        style={{
          maxWidth: 520,
          margin: '0 auto 18px',
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: size === 4 ? 10 : 6,
          padding: size === 4 ? 12 : 8,
          background: COLOR_PANEL,
          border: `1px solid ${COLOR_GRID}`,
          borderRadius: 10,
          touchAction: 'manipulation',
        }}
      >
        {tiles.map((tile, i) => {
            const Icon = ICON_MAP[tile.iconKey];
            const showFront = tile.faceUp || tile.matched;
            const isGlitchTile = glitchIndices.has(i);
            const burstKey = particleBurst[tile.id];
            const frontColor = tile.matched ? COLOR_MATCH : (i % 2 === 0 ? COLOR_CYAN : COLOR_MAGENTA);
            const frontGlow = tile.matched ? COLOR_MATCH_GLOW : (i % 2 === 0 ? COLOR_CYAN_GLOW : COLOR_MAGENTA_GLOW);
            return (
              <motion.button
                key={`${i}-${tile.id}`}
                onClick={() => flip(i)}
                whileTap={{ scale: 0.95 }}
                animate={{
                  rotateY: showFront ? 180 : 0,
                  filter: isGlitchTile ? 'hue-rotate(180deg) contrast(1.4)' : 'none',
                }}
                transition={{ rotateY: { duration: 0.35 }, filter: { duration: 0.3 } }}
                style={{
                  position: 'relative',
                  aspectRatio: '1 / 1',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: tile.matched || tile.faceUp ? 'default' : 'pointer',
                  transformStyle: 'preserve-3d',
                  outline: 'none',
                }}
              >
                {/* Back */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: `linear-gradient(135deg, #0f172a, #1e1b4b)`,
                  border: `1px solid ${COLOR_GRID}`,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 0 12px rgba(34,211,238,0.05)',
                }}>
                  <svg width="60%" height="60%" viewBox="0 0 40 40" style={{ opacity: 0.6 }}>
                    <defs>
                      <radialGradient id={`bg-${tile.id}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={COLOR_CYAN} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={COLOR_CYAN} stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <circle cx="20" cy="20" r="18" fill={`url(#bg-${tile.id})`} />
                    <path d="M8 8 L20 32 L32 8" stroke={COLOR_CYAN} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85"/>
                  </svg>
                </div>
                {/* Front */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: '#05060b',
                  border: `2px solid ${frontColor}`,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 ${tile.matched ? 16 : 10}px ${frontGlow}55, inset 0 0 12px ${frontGlow}22`,
                }}>
                  {Icon && <Icon size={size === 4 ? 32 : 22} color={frontColor} strokeWidth={2} />}
                </div>
                {/* Particle burst */}
                {burstKey && <ParticleBurst color={frontGlow} keyId={burstKey} />}
              </motion.button>
            );
          })}
      </motion.div>

      {/* Glitch banner */}
      <AnimatePresence>
        {glitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.4, 1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: 520,
              margin: '0 auto 12px',
              padding: 8,
              textAlign: 'center',
              border: `1px dashed ${COLOR_MAGENTA}`,
              color: COLOR_MAGENTA,
              borderRadius: 6,
              letterSpacing: '.2em',
              fontSize: 12,
              fontWeight: 700,
            }}
          >⟡ NEURAL RE-INDEX ⟡ TWO NODES SWAPPED</motion.div>
        )}
      </AnimatePresence>

      {/* Win banner */}
      <AnimatePresence>
        {won && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              maxWidth: 520,
              margin: '0 auto 14px',
              padding: 14,
              textAlign: 'center',
              border: `1px solid ${COLOR_MATCH}`,
              background: 'rgba(74,222,128,0.07)',
              borderRadius: 8,
              color: COLOR_MATCH,
              fontWeight: 700,
              letterSpacing: '.1em',
              fontSize: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <Trophy size={16} />
              <span>100% SYNCHRONIZATION — {formatTime(elapsed)}</span>
              {isNewBest && <span style={{ color: COLOR_CYAN }}>· NEW BEST</span>}
            </div>
            <div style={{ fontSize: 11, color: COLOR_DIM, marginTop: 4, letterSpacing: '.08em' }}>
              {attempts} ATTEMPTS · {misses} MISSES · {Math.floor(misses / 8)} GLITCHES
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={() => newGame(4)} style={ctrlBtn(COLOR_CYAN, size === 4)}>4 × 4</button>
        <button onClick={() => newGame(6)} style={ctrlBtn(COLOR_MAGENTA, size === 6)}>6 × 6</button>
        <button onClick={() => newGame()} style={ctrlBtn(COLOR_MATCH, false)}>
          <RotateCcw size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />NEW GAME
        </button>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 }}>
        <div style={{ marginBottom: 4, color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em' }}>▸ BRIEF</div>
        Flip two nodes at a time. Matching icons stay online; mismatches flip back. Every 8 misses the system re-indexes — two hidden nodes swap positions. Lowest Neural Latency wins.
      </div>
    </div>
  );
}

function HudCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      padding: '8px 10px',
      border: `1px solid ${COLOR_GRID}`,
      borderRadius: 6,
      background: COLOR_PANEL,
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 10, color: COLOR_DIM, letterSpacing: '.16em' }}>{label}</div>
      <div style={{ fontSize: 18, color, fontWeight: 700, textShadow: `0 0 8px ${color}66` }}>{value}</div>
    </div>
  );
}

function ParticleBurst({ color, keyId }: { color: string; keyId: number }) {
  const particles = Array.from({ length: 8 }).map((_, i) => i);
  return (
    <div key={keyId} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}>
      {particles.map((i) => {
        const angle = (i / particles.length) * Math.PI * 2;
        const dx = Math.cos(angle) * 30;
        const dy = Math.sin(angle) * 30;
        return (
          <motion.span
            key={i}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: dx, y: dy, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: 6, height: 6,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 6px ${color}`,
              marginLeft: -3, marginTop: -3,
            }}
          />
        );
      })}
    </div>
  );
}

function ctrlBtn(color: string, active: boolean): React.CSSProperties {
  return {
    padding: '8px 14px',
    border: `1px solid ${color}`,
    background: active ? `${color}18` : 'transparent',
    color,
    borderRadius: 6,
    fontFamily: 'inherit',
    fontSize: 12,
    letterSpacing: '.08em',
    cursor: 'pointer',
    fontWeight: 700,
  };
}

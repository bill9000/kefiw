import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, CornerDownLeft, Shuffle, RefreshCw, Hexagon, Trophy, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'vibehex-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

const COLOR_BG = '#020617';
const COLOR_CORE = '#f59e0b';         // neon gold
const COLOR_CORE_GLOW = '#fbbf24';
const COLOR_OUTER = '#38bdf8';        // neon blue
const COLOR_OUTER_GLOW = '#7dd3fc';
const COLOR_INVALID = '#ef4444';

// 7-letter isograms (all letters unique). Each becomes a hive; center is chosen at random.
const PANGRAM_SEEDS = [
  'HANGOUT', 'BACKLOG', 'ANCHORS', 'DIALOGS', 'OUTBACK', 'MONARCH',
  'OBSCURE', 'DISPLAY', 'STADIUM', 'UPGRADE', 'COMPUTE', 'GAINFUL',
  'PROFITS', 'ACTIONS', 'FLAVORS', 'MINUTES', 'BRAINED', 'DESKTOP',
  'FORGIVE', 'PRODUCE', 'FLANKED', 'GLANCED', 'SKATING', 'TANGIER',
  'COUPLES', 'MARLINS', 'JUMBLED', 'CLIMBED', 'CLOTHES', 'NEARBYS',
  'POTSHER', 'TUMBLER',
];

type Hive = {
  center: string;
  outers: string[];
  letters: Set<string>;
  words: Set<string>;
  pangrams: Set<string>;
  total: number;
  totalWords: number;
  key: string;
};

type Stats = { totalScoreEver: number; vibeMasterHives: number };
const DEFAULT_STATS: Stats = { totalScoreEver: 0, vibeMasterHives: 0 };

const RANKS: { min: number; name: string }[] = [
  { min: 0.00, name: 'Novice' },
  { min: 0.02, name: 'Apprentice' },
  { min: 0.05, name: 'Initiate' },
  { min: 0.08, name: 'Explorer' },
  { min: 0.15, name: 'Adept' },
  { min: 0.25, name: 'Expert' },
  { min: 0.40, name: 'Master' },
  { min: 0.55, name: 'Guru' },
  { min: 0.70, name: 'Vibe Master' },
];

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

function buildHive(dict: Set<string>): Hive {
  const seeds = PANGRAM_SEEDS.filter((s) => new Set(s.split('')).size === 7);
  const seed = seeds[Math.floor(Math.random() * seeds.length)];
  const unique = [...new Set(seed.split(''))];
  const centerIdx = Math.floor(Math.random() * 7);
  const center = unique[centerIdx].toLowerCase();
  const outers = shuffle(unique.filter((_, i) => i !== centerIdx).map((c) => c.toLowerCase()));

  const letterSet = new Set(unique.map((c) => c.toLowerCase()));
  const words = new Set<string>();
  const pangrams = new Set<string>();

  for (const w of dict) {
    if (w.length < 4) continue;
    if (!w.includes(center)) continue;
    const unik = new Set<string>();
    let ok = true;
    for (let i = 0; i < w.length; i++) {
      const ch = w[i];
      if (!letterSet.has(ch)) { ok = false; break; }
      unik.add(ch);
    }
    if (!ok) continue;
    words.add(w);
    if (unik.size === 7) pangrams.add(w);
  }

  let total = 0;
  for (const w of words) {
    const base = w.length === 4 ? 1 : w.length;
    total += base + (pangrams.has(w) ? 7 : 0);
  }

  return {
    center: center.toUpperCase(),
    outers: outers.map((c) => c.toUpperCase()),
    letters: new Set([...letterSet].map((c) => c.toUpperCase())),
    words,
    pangrams,
    total,
    totalWords: words.size,
    key: (center + [...letterSet].filter((c) => c !== center).sort().join('')).toUpperCase(),
  };
}

function scoreWord(w: string, pangrams: Set<string>): number {
  const base = w.length === 4 ? 1 : w.length;
  return base + (pangrams.has(w) ? 7 : 0);
}

function loadStats(): Stats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const d = JSON.parse(raw);
    return { ...DEFAULT_STATS, ...d };
  } catch { return DEFAULT_STATS; }
}
function saveStats(s: Stats) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export default function VibeHex() {
  const [dict, setDict] = useState<Set<string> | null>(null);
  const [hive, setHive] = useState<Hive | null>(null);
  const [input, setInput] = useState('');
  const [found, setFound] = useState<string[]>([]);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  const [shakeId, setShakeId] = useState(0);
  const [shufflingTo, setShufflingTo] = useState(0);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [hydrated, setHydrated] = useState(false);

  // load dict
  useEffect(() => {
    let cancelled = false;
    fetch('/data/enable.txt')
      .then((r) => r.text())
      .then((t) => {
        if (cancelled) return;
        const s = new Set(t.split('\n').map((w) => w.trim().toLowerCase()).filter(Boolean));
        setDict(s);
      });
    return () => { cancelled = true; };
  }, []);

  // once dict ready, build a hive
  useEffect(() => {
    if (!dict || hive) return;
    setHive(buildHive(dict));
  }, [dict, hive]);

  useEffect(() => { setStats(loadStats()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveStats(stats); }, [stats, hydrated]);

  // load per-hive found words when hive changes
  useEffect(() => {
    if (!hive || !hydrated) return;
    try {
      const raw = localStorage.getItem(`vibehex-hive-${hive.key}`);
      if (raw) setFound(JSON.parse(raw));
      else setFound([]);
    } catch { setFound([]); }
  }, [hive, hydrated]);
  useEffect(() => {
    if (!hive || !hydrated) return;
    try { localStorage.setItem(`vibehex-hive-${hive.key}`, JSON.stringify(found)); } catch {}
  }, [found, hive, hydrated]);

  function flash(text: string, color: string) {
    setToast({ text, color });
    window.setTimeout(() => setToast(null), 1400);
  }

  function submit() {
    if (!hive) return;
    const w = input.toLowerCase();
    if (w.length < 4) { flash('Too short — min 4', COLOR_INVALID); triggerShake(); return; }
    if (!w.includes(hive.center.toLowerCase())) { flash('Missing core', COLOR_CORE); triggerShake(); return; }
    for (const ch of w) {
      if (!hive.letters.has(ch.toUpperCase())) { flash('Outside hive', COLOR_INVALID); triggerShake(); return; }
    }
    if (!hive.words.has(w)) { flash('Not in lexicon', '#94a3b8'); triggerShake(); return; }
    if (found.includes(w)) { flash('Already found', '#eab308'); triggerShake(); return; }
    const pts = scoreWord(w, hive.pangrams);
    const isPan = hive.pangrams.has(w);
    setFound((prev) => [w, ...prev]);
    setStats((s) => ({ ...s, totalScoreEver: s.totalScoreEver + pts }));
    flash(isPan ? `PANGRAM! +${pts}` : `+${pts}`, isPan ? COLOR_CORE_GLOW : COLOR_OUTER_GLOW);
    setInput('');
  }

  function triggerShake() { setShakeId((n) => n + 1); }

  function addChar(ch: string) {
    if (!hive) return;
    if (!hive.letters.has(ch.toUpperCase())) return;
    setInput((s) => s + ch.toLowerCase());
  }
  function delChar() { setInput((s) => s.slice(0, -1)); }
  function clear() { setInput(''); }

  function doShuffle() {
    if (!hive) return;
    setShufflingTo((n) => n + 1);
    // after animation, swap order
    window.setTimeout(() => {
      setHive((h) => h ? { ...h, outers: shuffle(h.outers) } : h);
    }, 360);
  }

  function newHive() {
    if (!dict) return;
    setHive(buildHive(dict));
    setInput('');
    setToast(null);
  }

  // keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (k === 'Enter') { e.preventDefault(); submit(); }
      else if (k === 'Backspace') { e.preventDefault(); delChar(); }
      else if (k === 'Escape') { e.preventDefault(); clear(); }
      else if (/^[a-zA-Z]$/.test(k)) { e.preventDefault(); addChar(k); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const score = found.reduce((acc, w) => acc + scoreWord(w, hive?.pangrams || new Set()), 0);
  const frac = hive && hive.total > 0 ? score / hive.total : 0;
  const rankIdx = RANKS.reduce((acc, r, i) => (frac >= r.min ? i : acc), 0);
  const rank = RANKS[rankIdx];
  const nextRank = RANKS[rankIdx + 1];
  const rankPct = Math.min(100, frac * 100);

  // track Vibe Master achievement
  useEffect(() => {
    if (!hive || !hydrated) return;
    if (frac >= 0.70) {
      setStats((s) => {
        const flagKey = `vmhit-${hive.key}`;
        try {
          if (localStorage.getItem(flagKey)) return s;
          localStorage.setItem(flagKey, '1');
        } catch {}
        return { ...s, vibeMasterHives: s.vibeMasterHives + 1 };
      });
    }
  }, [frac, hive, hydrated]);

  return (
    <div style={{ fontFamily: FONT_STACK, background: COLOR_BG }} className="w-full max-w-xl mx-auto px-4 pb-16">
      <style>{`
        @keyframes vh-coreglow { 0%, 100% { filter: drop-shadow(0 0 6px ${COLOR_CORE_GLOW}); } 50% { filter: drop-shadow(0 0 14px ${COLOR_CORE_GLOW}); } }
        @keyframes vh-shake { 0%, 100% { transform: translateX(0) } 20% { transform: translateX(-6px) } 40% { transform: translateX(6px) } 60% { transform: translateX(-4px) } 80% { transform: translateX(4px) } }
      `}</style>

      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Hexagon size={18} style={{ color: COLOR_CORE }} />
          <span className="tracking-[0.25em] text-sm uppercase" style={{ color: COLOR_OUTER }}>vibehex</span>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(125,211,252,0.85)' }}>
          <span className="flex items-center gap-1"><Trophy size={13} /> score {score}</span>
          <span style={{ color: COLOR_CORE_GLOW }}>{rank.name}</span>
        </div>
      </header>

      <div className="rounded-md border p-4" style={{ borderColor: 'rgba(56,189,248,0.3)' }}>
        {/* rank bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1" style={{ color: 'rgba(125,211,252,0.8)' }}>
            <span>{rank.name}</span>
            <span>{nextRank ? `→ ${nextRank.name} @ ${Math.round(nextRank.min * (hive?.total || 0))}` : 'max rank'}</span>
          </div>
          <div className="h-2 rounded-sm overflow-hidden" style={{ background: 'rgba(56,189,248,0.12)', border: '1px solid rgba(56,189,248,0.2)' }}>
            <motion.div
              className="h-full"
              style={{ background: `linear-gradient(90deg, ${COLOR_OUTER}, ${COLOR_CORE})`, boxShadow: `0 0 10px ${COLOR_CORE}` }}
              animate={{ width: `${rankPct}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
          </div>
        </div>

        {/* input strip */}
        <motion.div
          key={`input-${shakeId}`}
          animate={shakeId > 0 ? { x: [0, -6, 6, -4, 4, 0] } : {}}
          transition={{ duration: 0.45 }}
          className="min-h-[2.5rem] rounded-sm px-3 py-2 mb-3 flex items-center justify-center flex-wrap gap-0.5 text-xl font-bold tracking-widest"
          style={{ border: '1px solid rgba(56,189,248,0.35)', background: 'rgba(2,6,23,0.6)' }}
        >
          {input.length === 0 ? (
            <span className="text-xs font-normal tracking-widest" style={{ color: 'rgba(148,163,184,0.45)', textTransform: 'uppercase' }}>
              tap hex or type
            </span>
          ) : input.split('').map((ch, i) => {
            const upper = ch.toUpperCase();
            const inHive = hive?.letters.has(upper);
            const isCore = upper === hive?.center;
            const color = !inHive ? COLOR_INVALID : isCore ? COLOR_CORE_GLOW : COLOR_OUTER_GLOW;
            return (
              <span key={i} style={{ color, textShadow: `0 0 8px ${color}` }}>{upper}</span>
            );
          })}
        </motion.div>

        {/* honeycomb */}
        {hive ? <Honeycomb hive={hive} onLetter={addChar} shuffleSignal={shufflingTo} /> : (
          <div className="text-center py-12 text-xs uppercase tracking-widest" style={{ color: 'rgba(125,211,252,0.6)' }}>
            loading lexicon…
          </div>
        )}

        {/* controls */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <HexBtn label="DEL" icon={<Delete size={14} />} onClick={delChar} />
          <HexBtn label="SHUFFLE" icon={<Shuffle size={14} />} onClick={doShuffle} accent />
          <HexBtn label="ENTER" icon={<CornerDownLeft size={14} />} onClick={submit} primary />
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.text}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center text-xs uppercase tracking-widest"
              style={{ color: toast.color, textShadow: `0 0 8px ${toast.color}` }}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* found words */}
      {hive && (
        <div className="mt-4 rounded-md border p-3" style={{ borderColor: 'rgba(56,189,248,0.2)' }}>
          <div className="flex items-center justify-between mb-2 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(125,211,252,0.7)' }}>
            <span>found {found.length}/{hive.totalWords}</span>
            <span>pangrams {found.filter((w) => hive.pangrams.has(w)).length}/{hive.pangrams.size}</span>
          </div>
          <div className="max-h-40 overflow-y-auto flex flex-wrap gap-1.5">
            {found.length === 0 ? (
              <span className="text-xs" style={{ color: 'rgba(148,163,184,0.5)' }}>— no words yet —</span>
            ) : found.map((w) => {
              const isPan = hive.pangrams.has(w);
              const color = isPan ? COLOR_CORE_GLOW : COLOR_OUTER_GLOW;
              return (
                <span
                  key={w}
                  className="text-xs px-2 py-0.5 rounded-sm uppercase tracking-widest flex items-center gap-1"
                  style={{ color, border: `1px solid ${color}55`, background: `${color}10` }}
                >
                  {isPan && <Sparkles size={10} />}
                  {w}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.55)' }}>
        <span>hives mastered {stats.vibeMasterHives} · lifetime {stats.totalScoreEver}</span>
        <button
          onClick={newHive}
          disabled={!dict}
          className="flex items-center gap-1 px-3 py-1.5 rounded-sm"
          style={{ border: `1px solid rgba(56,189,248,0.4)`, color: COLOR_OUTER }}
        >
          <RefreshCw size={12} /> new hive
        </button>
      </div>
    </div>
  );
}

function HexBtn({ label, icon, onClick, primary, accent }: {
  label: string; icon: React.ReactNode; onClick: () => void; primary?: boolean; accent?: boolean;
}) {
  const border = primary ? COLOR_CORE : accent ? COLOR_OUTER : 'rgba(148,163,184,0.4)';
  const color = primary ? COLOR_CORE_GLOW : accent ? COLOR_OUTER_GLOW : 'rgba(148,163,184,0.9)';
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      onClick={onClick}
      className="h-10 rounded-sm flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest"
      style={{
        border: `1.5px solid ${border}`,
        color,
        background: `${border}14`,
        fontFamily: FONT_STACK,
      }}
    >
      {icon} {label}
    </motion.button>
  );
}

function Honeycomb({
  hive, onLetter, shuffleSignal,
}: {
  hive: Hive;
  onLetter: (ch: string) => void;
  shuffleSignal: number;
}) {
  // flat-top hex. size = side length.
  const size = 44;
  const sh = size * Math.sqrt(3) / 2;
  const width = size * 6;
  const height = sh * 4 + 8;
  const cx = size * 3;
  const cy = sh * 2;
  // 6 outer positions, flat-top layout (angles 0°, 60°, 120°, 180°, 240°, 300°; distance = sqrt(3)*size)
  const outerPos = [
    { x: cx + 1.5 * size, y: cy - sh },   // NE
    { x: cx + 1.5 * size, y: cy + sh },   // SE
    { x: cx, y: cy + 2 * sh },            // S
    { x: cx - 1.5 * size, y: cy + sh },   // SW
    { x: cx - 1.5 * size, y: cy - sh },   // NW
    { x: cx, y: cy - 2 * sh },            // N
  ];

  const hexPath = (cxv: number, cyv: number, s: number) => {
    const pts = [
      [cxv + s, cyv],
      [cxv + s / 2, cyv + sh],
      [cxv - s / 2, cyv + sh],
      [cxv - s, cyv],
      [cxv - s / 2, cyv - sh],
      [cxv + s / 2, cyv - sh],
    ];
    return pts.map((p) => p.join(',')).join(' ');
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {/* outer hexes — rotate the whole group on shuffle */}
      <motion.g
        key={shuffleSignal}
        initial={{ rotate: 0 }}
        animate={{ rotate: 60 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16, duration: 0.6 }}
        style={{ originX: `${cx}px`, originY: `${cy}px` }}
      >
        {hive.outers.map((letter, i) => {
          const pos = outerPos[i];
          return (
            <HexCell
              key={`o-${i}-${letter}`}
              cx={pos.x}
              cy={pos.y}
              size={size}
              sh={sh}
              letter={letter}
              points={hexPath(pos.x, pos.y, size)}
              color={COLOR_OUTER}
              glow={COLOR_OUTER_GLOW}
              onClick={() => onLetter(letter)}
              counterRotate
            />
          );
        })}
      </motion.g>
      {/* center */}
      <HexCell
        cx={cx}
        cy={cy}
        size={size}
        sh={sh}
        letter={hive.center}
        points={hexPath(cx, cy, size)}
        color={COLOR_CORE}
        glow={COLOR_CORE_GLOW}
        onClick={() => onLetter(hive.center)}
        isCore
      />
    </svg>
  );
}

function HexCell({
  cx, cy, size, sh: _sh, letter, points, color, glow, onClick, isCore, counterRotate,
}: {
  cx: number; cy: number; size: number; sh: number;
  letter: string; points: string; color: string; glow: string;
  onClick: () => void; isCore?: boolean; counterRotate?: boolean;
}) {
  const fontSize = size * 0.85;
  return (
    <motion.g
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      style={{ cursor: 'pointer', transformOrigin: `${cx}px ${cy}px` }}
    >
      <polygon
        points={points}
        fill={`${color}18`}
        stroke={color}
        strokeWidth={2}
        style={{
          filter: isCore ? `drop-shadow(0 0 10px ${glow})` : `drop-shadow(0 0 5px ${color}66)`,
          animation: isCore ? 'vh-coreglow 2.4s ease-in-out infinite' : undefined,
        }}
      />
      <motion.g
        animate={counterRotate ? { rotate: -60 } : { rotate: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 16, duration: 0.6 }}
        style={{ originX: `${cx}px`, originY: `${cy}px` }}
      >
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={fontSize}
          fontWeight={800}
          fill={glow}
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            textShadow: `0 0 8px ${glow}`,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          {letter}
        </text>
      </motion.g>
    </motion.g>
  );
}

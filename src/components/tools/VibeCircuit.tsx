import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, RotateCcw, Check } from 'lucide-react';

type Coord = [number, number];
type ColorKey = 'cyan' | 'magenta' | 'lime' | 'gold' | 'crimson';

interface Pair {
  color: ColorKey;
  a: Coord;
  b: Coord;
}
interface Level {
  id: string;
  cols: number;
  rows: number;
  pairs: Pair[];
}

const COLOR_SPEC: Record<ColorKey, { base: string; glow: string; label: string }> = {
  cyan:    { base: '#22d3ee', glow: '#67e8f9', label: 'Cyan' },
  magenta: { base: '#e879f9', glow: '#f0abfc', label: 'Magenta' },
  lime:    { base: '#a3e635', glow: '#bef264', label: 'Lime' },
  gold:    { base: '#facc15', glow: '#fde047', label: 'Gold' },
  crimson: { base: '#f43f5e', glow: '#fda4af', label: 'Crimson' },
};

const LEVELS: Level[] = [
  { id: 'L1', cols: 5, rows: 5, pairs: [
    { color: 'cyan',    a: [0, 0], b: [4, 4] },
    { color: 'magenta', a: [4, 0], b: [0, 4] },
    { color: 'lime',    a: [2, 2], b: [4, 2] },
  ]},
  { id: 'L2', cols: 5, rows: 5, pairs: [
    { color: 'cyan',    a: [0, 0], b: [2, 2] },
    { color: 'magenta', a: [4, 0], b: [0, 4] },
    { color: 'lime',    a: [4, 4], b: [4, 2] },
    { color: 'gold',    a: [1, 1], b: [3, 3] },
  ]},
  { id: 'L3', cols: 6, rows: 6, pairs: [
    { color: 'cyan',    a: [0, 0], b: [5, 5] },
    { color: 'magenta', a: [5, 0], b: [0, 5] },
    { color: 'lime',    a: [2, 2], b: [3, 3] },
    { color: 'gold',    a: [1, 4], b: [4, 1] },
  ]},
  { id: 'L4', cols: 6, rows: 6, pairs: [
    { color: 'cyan',    a: [0, 0], b: [5, 0] },
    { color: 'magenta', a: [0, 5], b: [5, 5] },
    { color: 'lime',    a: [1, 2], b: [4, 2] },
    { color: 'gold',    a: [1, 3], b: [4, 3] },
    { color: 'crimson', a: [0, 2], b: [0, 3] },
  ]},
  { id: 'L5', cols: 6, rows: 6, pairs: [
    { color: 'cyan',    a: [0, 0], b: [5, 4] },
    { color: 'magenta', a: [1, 1], b: [5, 5] },
    { color: 'lime',    a: [3, 1], b: [4, 5] },
    { color: 'gold',    a: [2, 2], b: [4, 4] },
    { color: 'crimson', a: [0, 5], b: [3, 0] },
  ]},
  { id: 'L6', cols: 6, rows: 6, pairs: [
    { color: 'cyan',    a: [0, 2], b: [3, 2] },
    { color: 'magenta', a: [1, 3], b: [3, 4] },
    { color: 'lime',    a: [2, 0], b: [5, 3] },
    { color: 'gold',    a: [4, 0], b: [4, 5] },
    { color: 'crimson', a: [2, 1], b: [5, 5] },
  ]},
];

const CELL = 64;
const STORAGE = 'vibecircuit-stats-v1';
const COLOR_BG = '#0f172a';
const COLOR_GRID = '#1e293b';
const COLOR_DOT = '#334155';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';

function coordEq(a: Coord, b: Coord) { return a[0] === b[0] && a[1] === b[1]; }
function isAdj(a: Coord, b: Coord) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1; }

export default function VibeCircuit() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [paths, setPaths] = useState<Partial<Record<ColorKey, Coord[]>>>({});
  const [dragging, setDragging] = useState<ColorKey | null>(null);
  const [circuitsOptimized, setCircuitsOptimized] = useState(0);
  const [perfectCount, setPerfectCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [countedConnect, setCountedConnect] = useState(false);
  const [countedPerfect, setCountedPerfect] = useState(false);

  const level = LEVELS[levelIndex];
  const { cols, rows, pairs } = level;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const s = JSON.parse(raw);
        setCircuitsOptimized(s.circuitsOptimized || 0);
        setPerfectCount(s.perfectCount || 0);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE, JSON.stringify({ circuitsOptimized, perfectCount }));
  }, [circuitsOptimized, perfectCount, hydrated]);

  useEffect(() => {
    setPaths({});
    setDragging(null);
    setCountedConnect(false);
    setCountedPerfect(false);
  }, [levelIndex]);

  function nodeAt(x: number, y: number): Pair | null {
    for (const p of pairs) {
      if ((p.a[0] === x && p.a[1] === y) || (p.b[0] === x && p.b[1] === y)) return p;
    }
    return null;
  }

  function pathIndexAt(pathsMap: Partial<Record<ColorKey, Coord[]>>, x: number, y: number): { color: ColorKey; index: number } | null {
    for (const [color, path] of Object.entries(pathsMap) as [ColorKey, Coord[] | undefined][]) {
      if (!path) continue;
      const idx = path.findIndex((c) => c[0] === x && c[1] === y);
      if (idx !== -1) return { color, index: idx };
    }
    return null;
  }

  const completedColors = useMemo(() => {
    const done = new Set<ColorKey>();
    for (const pair of pairs) {
      const path = paths[pair.color];
      if (!path || path.length < 2) continue;
      const first = path[0];
      const last = path[path.length - 1];
      const ok = (coordEq(first, pair.a) && coordEq(last, pair.b)) ||
                 (coordEq(first, pair.b) && coordEq(last, pair.a));
      if (ok) done.add(pair.color);
    }
    return done;
  }, [paths, pairs]);

  const allConnected = completedColors.size === pairs.length;
  const totalCells = cols * rows;
  const filledCells = useMemo(() => {
    let n = 0;
    for (const path of Object.values(paths)) if (path) n += path.length;
    return n;
  }, [paths]);
  const isPerfect = allConnected && filledCells === totalCells;

  useEffect(() => {
    if (allConnected && !countedConnect) {
      setCountedConnect(true);
      setCircuitsOptimized((n) => n + 1);
    }
  }, [allConnected, countedConnect]);

  useEffect(() => {
    if (isPerfect && !countedPerfect) {
      setCountedPerfect(true);
      setPerfectCount((n) => n + 1);
    }
  }, [isPerfect, countedPerfect]);

  const svgRef = useRef<SVGSVGElement>(null);

  function cellFromClient(cx: number, cy: number): Coord | null {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return null;
    const px = ((cx - rect.left) / rect.width) * (cols * CELL);
    const py = ((cy - rect.top) / rect.height) * (rows * CELL);
    const x = Math.floor(px / CELL);
    const y = Math.floor(py / CELL);
    if (x < 0 || x >= cols || y < 0 || y >= rows) return null;
    return [x, y];
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    const c = cellFromClient(e.clientX, e.clientY);
    if (!c) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
    const node = nodeAt(c[0], c[1]);
    if (node) {
      setPaths((p) => ({ ...p, [node.color]: [c] }));
      setDragging(node.color);
      return;
    }
    const inPath = pathIndexAt(paths, c[0], c[1]);
    if (inPath) {
      setPaths((p) => {
        const arr = p[inPath.color];
        if (!arr) return p;
        return { ...p, [inPath.color]: arr.slice(0, inPath.index + 1) };
      });
      setDragging(inPath.color);
    }
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!dragging) return;
    e.preventDefault();
    const c = cellFromClient(e.clientX, e.clientY);
    if (!c) return;

    setPaths((prev) => {
      const active = dragging;
      const path = prev[active] || [];
      if (path.length === 0) return prev;
      const last = path[path.length - 1];
      if (coordEq(last, c)) return prev;
      if (!isAdj(last, c)) return prev;

      const foreignNode = nodeAt(c[0], c[1]);
      if (foreignNode && foreignNode.color !== active) return prev;

      const pair = pairs.find((p) => p.color === active)!;
      const firstCell = path[0];
      const otherEnd: Coord = coordEq(firstCell, pair.a) ? pair.b : pair.a;
      const selfIdx = path.findIndex((cc) => coordEq(cc, c));

      if (coordEq(last, otherEnd) && selfIdx === -1) return prev;

      if (selfIdx !== -1) {
        return { ...prev, [active]: path.slice(0, selfIdx + 1) };
      }

      const next: Partial<Record<ColorKey, Coord[]>> = { ...prev };
      for (const [col, arr] of Object.entries(next) as [ColorKey, Coord[] | undefined][]) {
        if (!arr || col === active) continue;
        const idx = arr.findIndex((cc) => coordEq(cc, c));
        if (idx !== -1) next[col] = arr.slice(0, idx);
      }
      next[active] = [...path, c];
      return next;
    });
  }

  function onPointerUp() {
    setDragging(null);
  }

  function resetLevel() {
    setPaths({});
    setDragging(null);
    setCountedConnect(false);
    setCountedPerfect(false);
  }
  function prevLevel() { setLevelIndex((i) => Math.max(0, i - 1)); }
  function nextLevel() { setLevelIndex((i) => Math.min(LEVELS.length - 1, i + 1)); }

  const width = cols * CELL;
  const height = rows * CELL;

  return (
    <div style={{ padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Cpu size={22} color={COLOR_SPEC.cyan.base} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '.08em' }}>VIBE_CIRCUIT // {level.id}</div>
            <div style={{ fontSize: 12, color: COLOR_DIM }}>{cols}×{rows} — {pairs.length} net{pairs.length === 1 ? '' : 's'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          <div><span style={{ color: COLOR_DIM }}>OPTIMIZED </span><span style={{ color: COLOR_SPEC.gold.base, fontWeight: 700 }}>{circuitsOptimized}</span></div>
          <div><span style={{ color: COLOR_DIM }}>PERFECT </span><span style={{ color: COLOR_SPEC.lime.base, fontWeight: 700 }}>{perfectCount}</span></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0', touchAction: 'none' }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', maxWidth: 520, aspectRatio: `${cols} / ${rows}`, touchAction: 'none', userSelect: 'none', cursor: dragging ? 'grabbing' : 'crosshair' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          <rect x={0} y={0} width={width} height={height} fill={COLOR_BG} />
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * CELL} y1={0} x2={i * CELL} y2={height} stroke={COLOR_GRID} strokeWidth={1} />
          ))}
          {Array.from({ length: rows + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * CELL} x2={width} y2={i * CELL} stroke={COLOR_GRID} strokeWidth={1} />
          ))}
          {Array.from({ length: rows }).flatMap((_, y) =>
            Array.from({ length: cols }).map((__, x) => (
              <circle key={`d-${x}-${y}`} cx={x * CELL + CELL / 2} cy={y * CELL + CELL / 2} r={1.6} fill={COLOR_DOT} />
            ))
          )}

          {(Object.entries(paths) as [ColorKey, Coord[] | undefined][]).map(([color, path]) => {
            if (!path || path.length < 1) return null;
            const done = completedColors.has(color);
            const pts = path.map(([x, y]) => `${x * CELL + CELL / 2},${y * CELL + CELL / 2}`).join(' ');
            return (
              <g key={`line-${color}`}>
                <polyline
                  points={pts}
                  stroke={COLOR_SPEC[color].glow}
                  strokeWidth={CELL * 0.55}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={done ? 0.4 : 0.22}
                />
                <motion.polyline
                  points={pts}
                  stroke={COLOR_SPEC[color].base}
                  strokeWidth={CELL * 0.34}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  animate={done ? { opacity: [1, 0.55, 1] } : { opacity: 1 }}
                  transition={done ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : { duration: 0.2 }}
                />
              </g>
            );
          })}

          {pairs.flatMap((pair) =>
            [pair.a, pair.b].map((c, idx) => {
              const done = completedColors.has(pair.color);
              return (
                <g key={`node-${pair.color}-${idx}`}>
                  <circle
                    cx={c[0] * CELL + CELL / 2}
                    cy={c[1] * CELL + CELL / 2}
                    r={CELL * 0.44}
                    fill={COLOR_SPEC[pair.color].glow}
                    opacity={done ? 0.28 : 0.16}
                  />
                  <motion.circle
                    cx={c[0] * CELL + CELL / 2}
                    cy={c[1] * CELL + CELL / 2}
                    r={CELL * 0.3}
                    fill={COLOR_SPEC[pair.color].base}
                    animate={done ? { r: [CELL * 0.3, CELL * 0.34, CELL * 0.3] } : { r: CELL * 0.3 }}
                    transition={done ? { repeat: Infinity, duration: 1.6, ease: 'easeInOut' } : { duration: 0.2 }}
                  />
                  <circle
                    cx={c[0] * CELL + CELL / 2}
                    cy={c[1] * CELL + CELL / 2}
                    r={CELL * 0.12}
                    fill="#fff"
                    opacity={0.65}
                  />
                </g>
              );
            })
          )}
        </svg>
      </div>

      <AnimatePresence>
        {allConnected && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              textAlign: 'center',
              padding: 14,
              margin: '4px auto 16px',
              maxWidth: 520,
              border: `1px solid ${isPerfect ? COLOR_SPEC.lime.base : COLOR_SPEC.cyan.base}`,
              borderRadius: 8,
              background: isPerfect ? 'rgba(163,230,53,0.07)' : 'rgba(34,211,238,0.07)',
              color: isPerfect ? COLOR_SPEC.lime.base : COLOR_SPEC.cyan.base,
              fontWeight: 700,
              letterSpacing: '.1em',
              fontSize: 14,
            }}
          >
            {isPerfect ? '⟡ SYSTEM INITIALIZED — PERFECT VIBE ⟡' : '✓ CIRCUIT OPTIMIZED — ALL NETS CONNECTED'}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        {pairs.map((p) => {
          const done = completedColors.has(p.color);
          return (
            <div key={p.color} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px',
              border: `1px solid ${done ? COLOR_SPEC[p.color].base : COLOR_GRID}`,
              borderRadius: 6,
              fontSize: 12,
              opacity: done ? 1 : 0.65,
            }}>
              <span style={{
                display: 'inline-block',
                width: 10, height: 10, borderRadius: '50%',
                background: COLOR_SPEC[p.color].base,
                boxShadow: done ? `0 0 8px ${COLOR_SPEC[p.color].glow}` : 'none',
              }}/>
              <span style={{ color: done ? COLOR_SPEC[p.color].base : COLOR_DIM }}>{COLOR_SPEC[p.color].label}</span>
              {done && <Check size={12} color={COLOR_SPEC[p.color].base} />}
            </div>
          );
        })}
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto 16px' }}>
        <div style={{ fontSize: 11, color: COLOR_DIM, display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span>GRID FILL</span>
          <span>{filledCells}/{totalCells} ({Math.round((filledCells / totalCells) * 100)}%)</span>
        </div>
        <div style={{ height: 6, background: COLOR_GRID, borderRadius: 3, overflow: 'hidden' }}>
          <motion.div
            animate={{ width: `${(filledCells / totalCells) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: '100%',
              background: isPerfect ? COLOR_SPEC.lime.base : COLOR_SPEC.cyan.base,
              boxShadow: `0 0 8px ${isPerfect ? COLOR_SPEC.lime.glow : COLOR_SPEC.cyan.glow}`,
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
        <button onClick={prevLevel} disabled={levelIndex === 0} style={ctrlBtn(COLOR_DIM, levelIndex === 0)}>← PREV</button>
        <button onClick={resetLevel} style={ctrlBtn(COLOR_SPEC.crimson.base, false)}>
          <RotateCcw size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />RESET
        </button>
        <button onClick={nextLevel} disabled={levelIndex === LEVELS.length - 1} style={ctrlBtn(COLOR_SPEC.cyan.base, levelIndex === LEVELS.length - 1)}>NEXT →</button>
      </div>

      <div style={{ maxWidth: 520, margin: '0 auto', fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 }}>
        <div style={{ marginBottom: 4, color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em' }}>▸ BRIEF</div>
        Drag from one LED to its twin without crossing another net. Drag across an existing wire and it short-circuits — that color resets back to where you cut it. Connect every pair to optimize the circuit; fill every cell for a Perfect Vibe.
      </div>
    </div>
  );
}

function ctrlBtn(color: string, disabled: boolean): React.CSSProperties {
  return {
    padding: '8px 14px',
    border: `1px solid ${color}`,
    background: 'transparent',
    color,
    borderRadius: 6,
    fontFamily: 'inherit',
    fontSize: 12,
    letterSpacing: '.08em',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.35 : 1,
  };
}

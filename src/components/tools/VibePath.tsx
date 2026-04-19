import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Trophy, Cpu } from 'lucide-react';

type Pos = { r: number; c: number };
type WordDef = { word: string; cells: Pos[]; isSpangram?: boolean };
type PuzzleInstance = {
  hint: string;
  themeName: string;
  rows: number;
  cols: number;
  grid: string[][];
  words: WordDef[];
};

const STORAGE_KEY = 'vibepath-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

const COLOR_BG = '#020617';
const COLOR_GHOST = 'rgba(148, 163, 184, 0.7)';
const COLOR_FOUND = '#22d3ee';
const COLOR_SPANGRAM = '#f472b6';
const COLOR_DRAW = '#38bdf8';

// Cybernetics puzzle. Grid is 7 rows × 6 cols = 42 cells.
// Every cell is claimed by exactly one word. Spangram CYBERNETIC
// snakes top (0,0) → bottom (6,3), touching both sides.
const PUZZLE: PuzzleInstance = {
  hint: 'Wired minds & machine limbs.',
  themeName: 'Cybernetics',
  rows: 7,
  cols: 6,
  grid: [
    ['C', 'N', 'E', 'U', 'R', 'A'],
    ['Y', 'B', 'S', 'Y', 'S', 'L'],
    ['C', 'E', 'R', 'T', 'E', 'M'],
    ['O', 'D', 'N', 'E', 'C', 'H'],
    ['B', 'E', 'E', 'T', 'P', 'I'],
    ['L', 'Y', 'T', 'I', 'P', 'O'],
    ['I', 'N', 'K', 'C', 'T', 'R'],
  ],
  words: [
    { word: 'NEURAL', cells: [{ r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 1, c: 5 }] },
    { word: 'SYSTEM', cells: [{ r: 1, c: 4 }, { r: 1, c: 3 }, { r: 1, c: 2 }, { r: 2, c: 3 }, { r: 2, c: 4 }, { r: 2, c: 5 }] },
    { word: 'CODE', cells: [{ r: 2, c: 0 }, { r: 3, c: 0 }, { r: 3, c: 1 }, { r: 4, c: 1 }] },
    { word: 'LINK', cells: [{ r: 5, c: 0 }, { r: 6, c: 0 }, { r: 6, c: 1 }, { r: 6, c: 2 }] },
    { word: 'CHIP', cells: [{ r: 3, c: 4 }, { r: 3, c: 5 }, { r: 4, c: 5 }, { r: 4, c: 4 }] },
    { word: 'BYTE', cells: [{ r: 4, c: 0 }, { r: 5, c: 1 }, { r: 5, c: 2 }, { r: 4, c: 2 }] },
    { word: 'PORT', cells: [{ r: 5, c: 4 }, { r: 5, c: 5 }, { r: 6, c: 5 }, { r: 6, c: 4 }] },
    {
      word: 'CYBERNETIC',
      isSpangram: true,
      cells: [
        { r: 0, c: 0 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: 2, c: 1 }, { r: 2, c: 2 },
        { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 4, c: 3 }, { r: 5, c: 3 }, { r: 6, c: 3 },
      ],
    },
  ],
};

const SPANGRAM_WORD = PUZZLE.words.find((w) => w.isSpangram)!.word;

function key(p: Pos) { return `${p.r},${p.c}`; }

export default function VibePath() {
  const [path, setPath] = useState<Pos[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [override, setOverride] = useState(false);
  const [toast, setToast] = useState<{ text: string; color: string } | null>(null);
  const [neuralMaps, setNeuralMaps] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(56);

  const pathRef = useRef<Pos[]>([]);
  const foundRef = useRef<string[]>([]);
  const completedRef = useRef(false);
  useEffect(() => { pathRef.current = path; }, [path]);
  useEffect(() => { foundRef.current = found; }, [found]);

  // Load stats
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setNeuralMaps(d.neuralMaps ?? 0);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ neuralMaps })); } catch {}
  }, [neuralMaps, hydrated]);

  // Measure grid for cell size
  useEffect(() => {
    function measure() {
      if (!gridRef.current) return;
      const w = gridRef.current.offsetWidth;
      setCellSize(w / PUZZLE.cols);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (gridRef.current) ro.observe(gridRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const complete = found.length === PUZZLE.words.length;
  useEffect(() => {
    if (complete && hydrated && !completedRef.current) {
      completedRef.current = true;
      setNeuralMaps((n) => n + 1);
    }
  }, [complete, hydrated]);

  // Found cell lookup
  const foundCellMap = useMemo(() => {
    const m = new Map<string, 'spangram' | 'word'>();
    for (const w of PUZZLE.words) {
      if (!found.includes(w.word)) continue;
      for (const c of w.cells) m.set(key(c), w.isSpangram ? 'spangram' : 'word');
    }
    return m;
  }, [found]);
  const foundCellMapRef = useRef(foundCellMap);
  useEffect(() => { foundCellMapRef.current = foundCellMap; }, [foundCellMap]);

  function cellAt(clientX: number, clientY: number): Pos | null {
    const rect = gridRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x >= rect.width || y >= rect.height) return null;
    const c = Math.floor(x / cellSize);
    const r = Math.floor(y / cellSize);
    if (r < 0 || r >= PUZZLE.rows || c < 0 || c >= PUZZLE.cols) return null;
    // dead-zone so you don't accidentally hop to a neighbor on jitter
    const cx = c * cellSize + cellSize / 2;
    const cy = r * cellSize + cellSize / 2;
    const dx = x - cx, dy = y - cy;
    if (Math.sqrt(dx * dx + dy * dy) > cellSize * 0.42) return null;
    return { r, c };
  }

  function extend(pos: Pos) {
    setPath((prev) => {
      if (!prev.length) return prev;
      const last = prev[prev.length - 1];
      if (last.r === pos.r && last.c === pos.c) return prev;
      // backtrack
      if (prev.length >= 2) {
        const prev2 = prev[prev.length - 2];
        if (prev2.r === pos.r && prev2.c === pos.c) return prev.slice(0, -1);
      }
      if (prev.some((p) => p.r === pos.r && p.c === pos.c)) return prev;
      if (Math.abs(last.r - pos.r) > 1 || Math.abs(last.c - pos.c) > 1) return prev;
      if (foundCellMapRef.current.has(key(pos))) return prev;
      return [...prev, pos];
    });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (complete) return;
    const pos = cellAt(e.clientX, e.clientY);
    if (!pos) return;
    if (foundCellMapRef.current.has(key(pos))) return;
    e.preventDefault();
    setPath([pos]);
  }

  function commit() {
    const p = pathRef.current;
    if (!p.length) return;
    if (p.length < 3) { setPath([]); return; }
    const word = p.map((x) => PUZZLE.grid[x.r][x.c]).join('');
    const wordRev = [...word].reverse().join('');
    const match = PUZZLE.words.find((w) => {
      if (foundRef.current.includes(w.word)) return false;
      if (w.word !== word && w.word !== wordRev) return false;
      const pSet = new Set(p.map(key));
      if (pSet.size !== w.cells.length) return false;
      for (const c of w.cells) if (!pSet.has(key(c))) return false;
      return true;
    });
    if (match) {
      setFound((f) => [...f, match.word]);
      if (match.isSpangram) {
        setOverride(true);
        setToast({ text: `SYSTEM OVERRIDE — ${match.word}`, color: COLOR_SPANGRAM });
        window.setTimeout(() => setOverride(false), 1200);
      } else {
        setToast({ text: `✓ ${match.word}`, color: COLOR_FOUND });
      }
      window.setTimeout(() => setToast(null), 1600);
    } else if (word.length >= 3) {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    }
    setPath([]);
  }

  // Global listeners
  useEffect(() => {
    function onMove(e: PointerEvent) {
      if (!pathRef.current.length) return;
      e.preventDefault();
      const pos = cellAt(e.clientX, e.clientY);
      if (!pos) return;
      extend(pos);
    }
    function onUp() { if (pathRef.current.length) commit(); }
    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [cellSize]);

  function reset() {
    setPath([]); setFound([]); setShake(false); setOverride(false); setToast(null);
    completedRef.current = false;
  }

  // SVG path points
  const center = (r: number, c: number) => ({ x: c * cellSize + cellSize / 2, y: r * cellSize + cellSize / 2 });
  const currentPts = path.map((p) => center(p.r, p.c));
  const foundLines = PUZZLE.words
    .filter((w) => found.includes(w.word))
    .map((w) => ({
      pts: w.cells.map((c) => center(c.r, c.c)),
      isSpangram: !!w.isSpangram,
      word: w.word,
    }));

  const pathSet = useMemo(() => new Set(path.map(key)), [path]);

  return (
    <div style={{ fontFamily: FONT_STACK, background: COLOR_BG }} className="w-full max-w-[28rem] mx-auto px-4 pb-16">
      <style>{`
        @keyframes vp-pulse {
          0% { filter: brightness(1) saturate(1); transform: scale(1); }
          40% { filter: brightness(1.6) saturate(1.6) drop-shadow(0 0 22px rgba(244,114,182,0.9)); transform: scale(1.025); }
          100% { filter: brightness(1) saturate(1); transform: scale(1); }
        }
        @keyframes vp-scan {
          0% { transform: translateY(-100%) }
          100% { transform: translateY(100%) }
        }
        .vp-cell-found {
          text-shadow: 0 0 10px currentColor, 0 0 22px currentColor;
        }
      `}</style>

      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Cpu size={18} style={{ color: COLOR_FOUND }} />
          <span className="tracking-[0.25em] text-sm uppercase" style={{ color: COLOR_FOUND }}>vibepath</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(34,211,238,0.8)' }}>
          <Trophy size={13} /> maps synced {neuralMaps}
        </div>
      </header>

      <div
        className="rounded-md border p-4"
        style={{ borderColor: 'rgba(34,211,238,0.25)', background: 'rgba(2,6,23,0.9)' }}
      >
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'rgba(244,114,182,0.75)' }}>
          theme — {PUZZLE.themeName}
        </div>
        <div className="text-sm mb-3" style={{ color: 'rgba(226,232,240,0.9)' }}>{PUZZLE.hint}</div>

        <motion.div
          animate={
            override
              ? { scale: [1, 1.04, 1], filter: ['brightness(1)', 'brightness(1.6)', 'brightness(1)'] }
              : shake
              ? { x: [0, -8, 8, -6, 6, -2, 2, 0] }
              : { scale: 1, x: 0 }
          }
          transition={{ duration: override ? 1.0 : 0.45 }}
          className="relative select-none"
          style={{ touchAction: 'none', aspectRatio: `${PUZZLE.cols} / ${PUZZLE.rows}` }}
          ref={gridRef}
          onPointerDown={onPointerDown}
        >
          {/* cells */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${PUZZLE.cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${PUZZLE.rows}, minmax(0, 1fr))`,
            }}
          >
            {PUZZLE.grid.flatMap((row, r) =>
              row.map((ch, c) => {
                const k = `${r},${c}`;
                const foundKind = foundCellMap.get(k);
                const inPath = pathSet.has(k);
                const color = foundKind === 'spangram'
                  ? COLOR_SPANGRAM
                  : foundKind === 'word'
                  ? COLOR_FOUND
                  : inPath
                  ? COLOR_DRAW
                  : COLOR_GHOST;
                const weight = foundKind ? 800 : inPath ? 700 : 500;
                return (
                  <div
                    key={k}
                    className={`flex items-center justify-center ${foundKind ? 'vp-cell-found' : ''}`}
                    style={{ color, fontWeight: weight, fontSize: Math.max(14, cellSize * 0.42) }}
                  >
                    {ch}
                  </div>
                );
              })
            )}
          </div>

          {/* svg path overlay */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width="100%"
            height="100%"
            viewBox={`0 0 ${PUZZLE.cols * cellSize} ${PUZZLE.rows * cellSize}`}
            preserveAspectRatio="none"
          >
            {foundLines.map((fl) => {
              const stroke = fl.isSpangram ? COLOR_SPANGRAM : COLOR_FOUND;
              const pts = fl.pts.map((p) => `${p.x},${p.y}`).join(' ');
              return (
                <g key={fl.word}>
                  <polyline
                    points={pts}
                    stroke={stroke}
                    strokeOpacity={0.22}
                    strokeWidth={cellSize * 0.58}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <polyline
                    points={pts}
                    stroke={stroke}
                    strokeOpacity={0.95}
                    strokeWidth={Math.max(3, cellSize * 0.1)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </g>
              );
            })}

            {currentPts.length > 1 && (
              <>
                <polyline
                  points={currentPts.map((p) => `${p.x},${p.y}`).join(' ')}
                  stroke={COLOR_DRAW}
                  strokeOpacity={0.35}
                  strokeWidth={cellSize * 0.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <motion.polyline
                  initial={false}
                  animate={{ opacity: 1 }}
                  points={currentPts.map((p) => `${p.x},${p.y}`).join(' ')}
                  stroke={COLOR_DRAW}
                  strokeOpacity={0.95}
                  strokeWidth={Math.max(3, cellSize * 0.08)}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </>
            )}

            {/* endpoint dots */}
            {currentPts.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={cellSize * 0.14}
                fill={COLOR_DRAW}
                opacity={0.85}
              />
            ))}
          </svg>
        </motion.div>

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.text}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center text-xs uppercase tracking-widest"
              style={{ color: toast.color }}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* word list */}
        <div className="mt-4 grid grid-cols-4 gap-1.5 text-[10px] uppercase tracking-widest">
          {PUZZLE.words.map((w) => {
            const done = found.includes(w.word);
            const color = w.isSpangram ? COLOR_SPANGRAM : COLOR_FOUND;
            return (
              <div
                key={w.word}
                className="text-center py-1 rounded border"
                style={{
                  borderColor: done ? color : 'rgba(148,163,184,0.25)',
                  color: done ? color : 'rgba(148,163,184,0.7)',
                  background: done ? `${color}14` : 'transparent',
                  boxShadow: done ? `0 0 10px ${color}55` : 'none',
                }}
              >
                {w.isSpangram && <Sparkles size={10} className="inline -mt-1 mr-1" />}
                {done ? w.word : `${'•'.repeat(w.word.length)}`}
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 rounded-md border p-4 text-center"
            style={{ borderColor: COLOR_SPANGRAM, background: 'rgba(244,114,182,0.08)' }}
          >
            <div className="text-sm uppercase tracking-[0.25em]" style={{ color: COLOR_SPANGRAM }}>
              neural map synced
            </div>
            <div className="text-xs mt-1" style={{ color: 'rgba(226,232,240,0.8)' }}>
              Spangram: <span style={{ color: COLOR_SPANGRAM, fontWeight: 700 }}>{SPANGRAM_WORD}</span> · total synced {neuralMaps}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex items-center justify-between text-[11px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.7)' }}>
        <span>{found.length}/{PUZZLE.words.length} words · drag to connect</span>
        <button
          onClick={reset}
          className="flex items-center gap-1 px-3 py-1.5 rounded border"
          style={{ borderColor: 'rgba(34,211,238,0.4)', color: COLOR_FOUND }}
        >
          <RefreshCw size={12} /> reset
        </button>
      </div>
    </div>
  );
}

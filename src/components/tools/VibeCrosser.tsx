import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, Shuffle, Trophy, RefreshCw } from 'lucide-react';

type Dir = 'H' | 'V';
type Placement = { row: number; col: number; dir: Dir };
type Puzzle = {
  letters: string;
  words: string[];
  placements: Record<string, Placement>;
  rows: number;
  cols: number;
};

const PUZZLES: Puzzle[] = [
  {
    letters: 'SHIRT',
    words: ['SHIRT', 'HITS', 'STIR'],
    placements: {
      SHIRT: { row: 0, col: 0, dir: 'H' },
      HITS: { row: 0, col: 1, dir: 'V' },
      STIR: { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'CRANE',
    words: ['CRANE', 'RACE', 'CAR'],
    placements: {
      CRANE: { row: 0, col: 0, dir: 'H' },
      RACE: { row: 0, col: 1, dir: 'V' },
      CAR: { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'BRAIN',
    words: ['BRAIN', 'RAIN', 'BAR'],
    placements: {
      BRAIN: { row: 0, col: 0, dir: 'H' },
      RAIN: { row: 0, col: 1, dir: 'V' },
      BAR: { row: 0, col: 0, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
  {
    letters: 'STORM',
    words: ['STORM', 'ROT', 'MOST'],
    placements: {
      STORM: { row: 0, col: 0, dir: 'H' },
      ROT: { row: 0, col: 2, dir: 'V' },
      MOST: { row: 0, col: 4, dir: 'V' },
    },
    rows: 4,
    cols: 5,
  },
];

const HINT_COST = 20;
const STORAGE_KEY = 'vibecrosser-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

function cellsFor(word: string, p: Placement) {
  const out: Array<{ r: number; c: number; ch: string; idx: number }> = [];
  for (let i = 0; i < word.length; i++) {
    const r = p.dir === 'V' ? p.row + i : p.row;
    const c = p.dir === 'H' ? p.col + i : p.col;
    out.push({ r, c, ch: word[i], idx: i });
  }
  return out;
}

function buildGridMeta(puzzle: Puzzle): Array<Array<{ letter: string } | null>> {
  const grid = Array.from({ length: puzzle.rows }, () =>
    Array.from({ length: puzzle.cols }, () => null as { letter: string } | null)
  );
  for (const word of puzzle.words) {
    const p = puzzle.placements[word];
    for (const { r, c, ch } of cellsFor(word, p)) grid[r][c] = { letter: ch };
  }
  return grid;
}

type Flier = { id: string; ch: string; from: { x: number; y: number }; to: { x: number; y: number }; delay: number };
type Toast = { id: number; text: string; kind: 'win' | 'miss' | 'dim' };

export default function VibeCrosser() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx];
  const gridMeta = useMemo(() => buildGridMeta(puzzle), [puzzle]);

  const [wheelOrder, setWheelOrder] = useState<string[]>(() => puzzle.letters.split(''));
  const [foundWords, setFoundWords] = useState<Set<string>>(() => new Set());
  const [hintedCells, setHintedCells] = useState<Set<string>>(() => new Set());
  const [score, setScore] = useState(0);

  const [drawing, setDrawing] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const [fliers, setFliers] = useState<Flier[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [showComplete, setShowComplete] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.score === 'number') setScore(s.score);
      }
    } catch {}
  }, []);

  // Persist score
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ score }));
    } catch {}
  }, [score]);

  // Reset puzzle-local state when puzzle index changes
  useEffect(() => {
    setWheelOrder(puzzle.letters.split(''));
    setFoundWords(new Set());
    setHintedCells(new Set());
    setSelected([]);
    setDrawing(false);
    setPointer(null);
  }, [puzzleIdx]);

  const containerRef = useRef<HTMLDivElement>(null);
  const wheelSvgRef = useRef<SVGSVGElement>(null);
  const wheelLetterRefs = useRef<Record<number, SVGGElement | null>>({});
  const gridCellRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const WHEEL_SIZE = 320;
  const WHEEL_CX = WHEEL_SIZE / 2;
  const WHEEL_CY = WHEEL_SIZE / 2;
  const WHEEL_R = WHEEL_SIZE / 2 - 44;
  const LETTER_R = 28;
  const HIT_R = 34;

  const wheelLetterPositions = useMemo(() => {
    const n = wheelOrder.length;
    return wheelOrder.map((ch, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        ch,
        i,
        x: WHEEL_CX + WHEEL_R * Math.cos(angle),
        y: WHEEL_CY + WHEEL_R * Math.sin(angle),
      };
    });
  }, [wheelOrder]);

  const currentWord = selected.map((i) => wheelOrder[i]).join('');

  function svgPointFromEvent(e: React.PointerEvent) {
    const svg = wheelSvgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * WHEEL_SIZE,
      y: ((e.clientY - rect.top) / rect.height) * WHEEL_SIZE,
    };
  }

  function hitTestLetter(pt: { x: number; y: number }) {
    for (const p of wheelLetterPositions) {
      const dx = p.x - pt.x;
      const dy = p.y - pt.y;
      if (dx * dx + dy * dy <= HIT_R * HIT_R) return p.i;
    }
    return -1;
  }

  function onPointerDown(e: React.PointerEvent) {
    (e.currentTarget as any).setPointerCapture?.(e.pointerId);
    e.preventDefault();
    const pt = svgPointFromEvent(e);
    const hit = hitTestLetter(pt);
    if (hit >= 0) {
      setDrawing(true);
      setSelected([hit]);
      setPointer(pt);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drawing) return;
    e.preventDefault();
    const pt = svgPointFromEvent(e);
    setPointer(pt);
    const hit = hitTestLetter(pt);
    if (hit < 0) return;
    setSelected((sel) => {
      if (sel.length === 0) return [hit];
      const last = sel[sel.length - 1];
      if (hit === last) return sel;
      if (sel.length >= 2 && hit === sel[sel.length - 2]) return sel.slice(0, -1);
      if (sel.includes(hit)) return sel;
      return [...sel, hit];
    });
  }

  function onPointerUp() {
    if (!drawing) return;
    setDrawing(false);
    const word = selected.map((i) => wheelOrder[i]).join('');
    const chain = [...selected];
    processWord(word, chain);
    setSelected([]);
    setPointer(null);
  }

  function processWord(word: string, chain: number[]) {
    if (word.length < 3) return;
    if (puzzle.words.includes(word)) {
      if (foundWords.has(word)) {
        flashToast(`Already found ${word}`, 'dim');
        return;
      }
      const newFound = new Set(foundWords);
      newFound.add(word);
      setFoundWords(newFound);
      const points = word.length * 10;
      setScore((s) => s + points);
      flashToast(`+${points} ${word}`, 'win');
      triggerFlyIn(word, puzzle.placements[word], chain);
      if (newFound.size === puzzle.words.length) {
        setTimeout(() => setShowComplete(true), 900);
      }
    } else {
      flashToast(`${word} — not in puzzle`, 'miss');
    }
  }

  function flashToast(text: string, kind: Toast['kind']) {
    const id = Date.now();
    setToast({ id, text, kind });
    setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, 1200);
  }

  function triggerFlyIn(word: string, placement: Placement, chain: number[]) {
    const container = containerRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const cells = cellsFor(word, placement);
    const newFliers: Flier[] = [];
    cells.forEach((cell, i) => {
      const wheelNode = wheelLetterRefs.current[chain[i]];
      const gridNode = gridCellRefs.current[`${cell.r},${cell.c}`];
      if (!wheelNode || !gridNode) return;
      const wr = wheelNode.getBoundingClientRect();
      const gr = gridNode.getBoundingClientRect();
      newFliers.push({
        id: `${word}-${Date.now()}-${i}`,
        ch: cell.ch,
        from: { x: wr.left - cRect.left + wr.width / 2, y: wr.top - cRect.top + wr.height / 2 },
        to: { x: gr.left - cRect.left + gr.width / 2, y: gr.top - cRect.top + gr.height / 2 },
        delay: i * 0.07,
      });
    });
    if (!newFliers.length) return;
    setFliers((f) => [...f, ...newFliers]);
    const ids = new Set(newFliers.map((f) => f.id));
    setTimeout(() => {
      setFliers((f) => f.filter((x) => !ids.has(x.id)));
    }, 1400);
  }

  function shuffleWheel() {
    setWheelOrder((order) => {
      if (order.length < 2) return order;
      let attempt = order;
      for (let k = 0; k < 6; k++) {
        const arr = [...order];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        if (arr.join('') !== order.join('')) {
          attempt = arr;
          break;
        }
      }
      return attempt;
    });
  }

  function useHint() {
    if (score < HINT_COST) {
      flashToast(`Need ${HINT_COST} vibes`, 'miss');
      return;
    }
    const revealed = new Set<string>();
    foundWords.forEach((w) => {
      cellsFor(w, puzzle.placements[w]).forEach(({ r, c }) => revealed.add(`${r},${c}`));
    });
    const candidates: string[] = [];
    for (let r = 0; r < puzzle.rows; r++) {
      for (let c = 0; c < puzzle.cols; c++) {
        const k = `${r},${c}`;
        if (gridMeta[r][c] && !revealed.has(k) && !hintedCells.has(k)) candidates.push(k);
      }
    }
    if (!candidates.length) {
      flashToast('No hints available', 'dim');
      return;
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    setHintedCells((h) => {
      const n = new Set(h);
      n.add(pick);
      return n;
    });
    setScore((s) => s - HINT_COST);
    flashToast(`−${HINT_COST} hint`, 'dim');
  }

  function nextPuzzle() {
    setShowComplete(false);
    setPuzzleIdx((i) => (i + 1) % PUZZLES.length);
  }

  const revealedMap = useMemo(() => {
    const m = new Set<string>();
    foundWords.forEach((w) => {
      cellsFor(w, puzzle.placements[w]).forEach(({ r, c }) => m.add(`${r},${c}`));
    });
    hintedCells.forEach((k) => m.add(k));
    return m;
  }, [foundWords, hintedCells, puzzle]);

  const lineSegments = selected.map((i) => wheelLetterPositions[i]);
  const lineTail = (() => {
    const pts = lineSegments.map((p) => `${p.x},${p.y}`).join(' ');
    if (!pts) return '';
    if (pointer && drawing) return `${pts} ${pointer.x},${pointer.y}`;
    return pts;
  })();

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-xl border border-cyan-500/20"
      style={{
        background: '#020617',
        color: '#e0f2fe',
        minHeight: 760,
        fontFamily: FONT_STACK,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(34,211,238,0.08) 0px, rgba(34,211,238,0.08) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">VibeCrosser</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="text-cyan-300/70">
            PUZZLE <span className="text-cyan-200">{puzzleIdx + 1}</span>/{PUZZLES.length}
          </div>
          <div className="text-cyan-300/70">
            VIBES <span className="tabular-nums text-cyan-200">{score}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="relative flex justify-center py-4">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${puzzle.cols}, 44px)`,
            gridTemplateRows: `repeat(${puzzle.rows}, 44px)`,
            gap: 6,
          }}
        >
          {Array.from({ length: puzzle.rows }).flatMap((_, r) =>
            Array.from({ length: puzzle.cols }).map((_, c) => {
              const cell = gridMeta[r][c];
              const key = `${r},${c}`;
              if (!cell) return <div key={key} />;
              const revealed = revealedMap.has(key);
              return (
                <div
                  key={key}
                  ref={(el) => {
                    gridCellRefs.current[key] = el;
                  }}
                  className={`flex items-center justify-center rounded-sm border text-base font-bold transition-all duration-300 ${
                    revealed
                      ? 'border-cyan-400/70 bg-cyan-500/10 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.45)]'
                      : 'border-cyan-500/25 bg-slate-900/70 text-transparent'
                  }`}
                >
                  <span
                    style={{
                      opacity: revealed ? 1 : 0,
                      transition: 'opacity 0.25s ease-out 0.55s',
                    }}
                  >
                    {cell.letter}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Current word readout */}
      <div className="relative flex min-h-[40px] justify-center py-2">
        <div className="min-w-[140px] rounded border border-cyan-500/30 bg-slate-900/80 px-4 py-1 text-center text-lg tracking-[0.35em] text-cyan-200">
          {currentWord || '\u00A0'}
        </div>
      </div>

      {/* Controls */}
      <div className="relative flex items-center justify-center gap-3 py-2">
        <button
          onClick={useHint}
          className="flex items-center gap-1.5 rounded border border-cyan-500/30 bg-slate-900/80 px-3 py-1.5 text-xs uppercase tracking-widest text-cyan-200 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.4)]"
          title={`Reveal a letter (−${HINT_COST} vibes)`}
        >
          <Lightbulb size={14} /> Hint
        </button>
        <button
          onClick={shuffleWheel}
          className="flex items-center gap-1.5 rounded border border-cyan-500/30 bg-slate-900/80 px-3 py-1.5 text-xs uppercase tracking-widest text-cyan-200 hover:border-cyan-400 hover:shadow-[0_0_10px_rgba(34,211,238,0.4)]"
          title="Shuffle letters"
        >
          <Shuffle size={14} /> Shuffle
        </button>
        <button
          onClick={() => {
            setFoundWords(new Set());
            setHintedCells(new Set());
          }}
          className="flex items-center gap-1.5 rounded border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs uppercase tracking-widest text-slate-300 hover:border-slate-500"
          title="Restart this puzzle"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Target words (hidden until found) */}
      <div className="relative flex flex-wrap justify-center gap-2 px-4 py-2">
        {puzzle.words.map((w) => (
          <span
            key={w}
            className={`rounded border px-2 py-0.5 text-[11px] uppercase tracking-[0.35em] ${
              foundWords.has(w)
                ? 'border-cyan-400/60 bg-cyan-500/10 text-cyan-200'
                : 'border-slate-700 text-slate-600'
            }`}
          >
            {foundWords.has(w) ? w : '•'.repeat(w.length)}
          </span>
        ))}
      </div>

      {/* Wheel */}
      <div className="relative flex justify-center pt-3 pb-6">
        <svg
          ref={wheelSvgRef}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ touchAction: 'none', userSelect: 'none' }}
        >
          <defs>
            <radialGradient id="vcWheelBg">
              <stop offset="0%" stopColor="#0e1a30" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <filter id="vcNeonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx={WHEEL_CX}
            cy={WHEEL_CY}
            r={WHEEL_R + 28}
            fill="url(#vcWheelBg)"
            stroke="rgba(34,211,238,0.25)"
            strokeWidth="1"
          />
          <circle
            cx={WHEEL_CX}
            cy={WHEEL_CY}
            r={WHEEL_R + 12}
            fill="none"
            stroke="rgba(34,211,238,0.18)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />

          {lineTail && (
            <>
              <polyline
                points={lineTail}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="14"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.25"
                filter="url(#vcNeonGlow)"
              />
              <polyline
                points={lineTail}
                fill="none"
                stroke="#a5f3fc"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {lineSegments.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={4} fill="#a5f3fc" />
              ))}
            </>
          )}

          {wheelLetterPositions.map((p) => {
            const isSel = selected.includes(p.i);
            return (
              <g
                key={p.i}
                ref={(el) => {
                  wheelLetterRefs.current[p.i] = el;
                }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={LETTER_R}
                  fill={isSel ? '#0e7490' : '#0b1324'}
                  stroke={isSel ? '#67e8f9' : '#22d3ee'}
                  strokeWidth={isSel ? 3 : 1.5}
                  style={isSel ? { filter: 'drop-shadow(0 0 8px #22d3ee)' } : undefined}
                />
                <text
                  x={p.x}
                  y={p.y + 7}
                  textAnchor="middle"
                  fontFamily={FONT_STACK}
                  fontWeight="700"
                  fontSize="22"
                  fill={isSel ? '#ecfeff' : '#67e8f9'}
                  style={{ pointerEvents: 'none' }}
                >
                  {p.ch}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Fly-in overlay */}
      <AnimatePresence>
        {fliers.map((f) => (
          <motion.div
            key={f.id}
            initial={{ x: f.from.x, y: f.from.y, opacity: 0, scale: 1.25 }}
            animate={{
              x: f.to.x,
              y: f.to.y,
              opacity: [0, 1, 1, 0],
              scale: [1.25, 1, 1, 0.7],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: f.delay, times: [0, 0.18, 0.78, 1] }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            <div
              style={{
                transform: 'translate(-50%, -50%)',
                color: '#ecfeff',
                fontWeight: 800,
                fontSize: 22,
                fontFamily: FONT_STACK,
                textShadow: '0 0 10px #22d3ee, 0 0 22px #22d3ee',
              }}
            >
              {f.ch}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`absolute left-1/2 top-24 z-20 -translate-x-1/2 rounded border px-3 py-1 text-xs uppercase tracking-[0.3em] ${
              toast.kind === 'win'
                ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.5)]'
                : toast.kind === 'miss'
                ? 'border-rose-400/60 bg-rose-500/10 text-rose-200'
                : 'border-slate-600 bg-slate-800/80 text-slate-300'
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete modal */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-4 w-full max-w-sm rounded-lg border border-cyan-400 bg-slate-900 p-6 text-center shadow-[0_0_30px_rgba(34,211,238,0.5)]"
            >
              <Trophy size={40} className="mx-auto mb-2 text-cyan-300" />
              <div className="mb-1 text-xs uppercase tracking-[0.3em] text-cyan-400">Puzzle Cleared</div>
              <div className="mb-4 text-2xl font-bold text-cyan-100">
                +{puzzle.words.reduce((n, w) => n + w.length * 10, 0)} Vibes
              </div>
              <button
                onClick={nextPuzzle}
                className="w-full rounded border border-cyan-400 bg-cyan-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200 hover:bg-cyan-500/20"
              >
                Next Puzzle →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

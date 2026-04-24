import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { conflicts, generate, isComplete, type Board, type Difficulty } from '~/lib/sudoku';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

const DEFAULT_STORAGE_KEY = 'kefiw.sudoku.v1';
const BEST_KEY = 'kefiw.sudoku.best.';

// Module-level pool: keeps 1-2 pre-generated puzzles per difficulty so
// switching difficulty doesn't block on backtracking-solver re-runs.
type PoolEntry = { puzzle: Board; solution: Board };
const PUZZLE_POOL: Partial<Record<Difficulty, PoolEntry[]>> = {};
const POOL_TARGET = 2;
const warmingTimers = new Set<number>();

function warmPool(diff: Difficulty) {
  if ((PUZZLE_POOL[diff]?.length ?? 0) >= POOL_TARGET) return;
  const tid = window.setTimeout(() => {
    warmingTimers.delete(tid);
    if ((PUZZLE_POOL[diff]?.length ?? 0) >= POOL_TARGET) return;
    try {
      const item = generate(diff);
      PUZZLE_POOL[diff] = [...(PUZZLE_POOL[diff] ?? []), item];
    } catch { /* ignore generator failures */ }
    warmPool(diff);
  }, 0);
  warmingTimers.add(tid);
}

function takeFromPool(diff: Difficulty): PoolEntry {
  const pool = PUZZLE_POOL[diff];
  if (pool && pool.length > 0) {
    const item = pool.shift()!;
    warmPool(diff);
    return item;
  }
  const item = generate(diff);
  warmPool(diff);
  return item;
}

function loadBest(diff: Difficulty): number | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(BEST_KEY + diff);
  if (!v) return null;
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : null;
}

function saveBest(diff: Difficulty, ms: number) {
  try { localStorage.setItem(BEST_KEY + diff, String(ms)); } catch {}
}

function fmtTime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

const NEXT_DIFF: Record<Difficulty, Difficulty | null> = {
  easy: 'medium', medium: 'hard', hard: 'expert', expert: null,
};

interface Saved {
  difficulty: Difficulty;
  puzzle: Board;
  solution: Board;
  state: Board;
  started: number;
  mistakes?: number;
}

function loadSaved(key: string): Saved | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as Saved;
  } catch { return null; }
}

function saveState(key: string, s: Saved) {
  try { localStorage.setItem(key, JSON.stringify(s)); } catch {}
}

interface SudokuProps {
  lockedDifficulty?: Difficulty;
}

export default function Sudoku({ lockedDifficulty }: SudokuProps = {}) {
  const storageKey = lockedDifficulty ? `${DEFAULT_STORAGE_KEY}.${lockedDifficulty}` : DEFAULT_STORAGE_KEY;
  const [saved, setSaved] = useState<Saved | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [generating, setGenerating] = useState(false);
  const generatingRef = useRef(false);

  useEffect(() => {
    const s = loadSaved(storageKey);
    if (s && (!lockedDifficulty || s.difficulty === lockedDifficulty)) setSaved(s);
    else newGame(lockedDifficulty ?? 'easy', true);
    // warm up pool for all difficulties after first render
    (['easy','medium','hard','expert'] as Difficulty[]).forEach((d) => warmPool(d));
  }, [storageKey, lockedDifficulty]);

  const newGame = useCallback((diff: Difficulty, silent = false) => {
    if (generatingRef.current) return;
    if (!silent && saved && !isComplete(saved.state) && !confirm('Start a new game? Progress will be lost.')) return;
    generatingRef.current = true;
    setGenerating(true);
    // yield a frame so the "generating…" state paints before a possible
    // sync generate() blocks the main thread
    const run = () => {
      try {
        const { puzzle, solution } = takeFromPool(diff);
        const s: Saved = { difficulty: diff, puzzle, solution, state: [...puzzle], started: Date.now(), mistakes: 0 };
        saveState(storageKey, s);
        setSaved(s);
        setSel(null);
      } finally {
        generatingRef.current = false;
        setGenerating(false);
      }
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => setTimeout(run, 0));
    else setTimeout(run, 0);
  }, [saved, storageKey]);

  const restart = useCallback(() => {
    setSaved((prev) => {
      if (!prev) return prev;
      const next = { ...prev, state: [...prev.puzzle], mistakes: 0 };
      saveState(storageKey, next);
      return next;
    });
    setSel(null);
  }, [storageKey]);

  const setCell = useCallback((i: number, v: number) => {
    setSaved((prev) => {
      if (!prev) return prev;
      if (prev.puzzle[i] !== 0) return prev;
      const state = [...prev.state];
      const prevVal = state[i];
      state[i] = v;
      let mistakes = prev.mistakes ?? 0;
      if (v !== 0 && v !== prev.solution[i] && v !== prevVal) mistakes += 1;
      const next = { ...prev, state, mistakes };
      saveState(storageKey, next);
      return next;
    });
  }, [storageKey]);

  const complete = saved && isComplete(saved.state);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [prevBest, setPrevBest] = useState<number | null>(null);

  useEffect(() => {
    if (!saved) { setFinishedAt(null); return; }
    if (complete) {
      if (finishedAt === null) {
        const now = Date.now();
        setFinishedAt(now);
        const elapsed = now - saved.started;
        const prior = loadBest(saved.difficulty);
        setPrevBest(prior);
        if (prior === null || elapsed < prior) {
          saveBest(saved.difficulty, elapsed);
          setBest(elapsed);
        } else {
          setBest(prior);
        }
      }
    } else {
      setFinishedAt(null);
      setBest(loadBest(saved.difficulty));
      setPrevBest(null);
    }
  }, [complete, saved, finishedAt]);

  const badCells = useMemo(() => {
    if (!saved) return new Set<number>();
    const out = new Set<number>();
    for (let i = 0; i < 81; i++) {
      if (saved.state[i] !== 0) for (const c of conflicts(saved.state, i)) out.add(c);
    }
    return out;
  }, [saved]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (sel === null || !saved) return;
      if (e.key >= '1' && e.key <= '9') setCell(sel, Number(e.key));
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') setCell(sel, 0);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sel, saved, setCell]);

  if (!saved) return <div className="p-4 text-sm text-slate-500">Loading…</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-slate-200 bg-slate-50">
        <button
          type="button"
          onClick={() => setShowRules((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-slate-800"
          aria-expanded={showRules}
        >
          <span>How to play Sudoku {showRules ? '▾' : '▸'}</span>
          <span className="text-xs font-normal text-slate-500">{showRules ? 'hide' : 'rules & tips'}</span>
        </button>
        {showRules && (
          <div className="border-t border-slate-200 px-3 py-3 text-sm text-slate-700 space-y-2">
            <p><strong>The board:</strong> 9×9 grid divided into nine 3×3 boxes. Some cells start with digits (clues); the rest are blank.</p>
            <p><strong>Goal:</strong> fill every blank cell with a digit 1–9 so that:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Each <strong>row</strong> contains 1–9 exactly once.</li>
              <li>Each <strong>column</strong> contains 1–9 exactly once.</li>
              <li>Each <strong>3×3 box</strong> contains 1–9 exactly once.</li>
            </ul>
            <p><strong>Play:</strong> tap a blank cell, press 1–9 on the keypad or keyboard. Backspace/Delete clears. Conflicting cells highlight red — use that as a safety net, not as your strategy.</p>
            <p><strong>Start-here tactic:</strong> scan each digit 1→9 across the whole board; look for a row, column, or box that already has eight of that digit placed — the ninth is forced. Chase those forced placements until none remain, then move to candidate elimination.</p>
            <p className="text-xs text-slate-500">Every puzzle here has a unique solution — you never need to guess, though some expert boards require advanced techniques (pointing pairs, X-wing, XY-wing).</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!lockedDifficulty && (['easy','medium','hard','expert'] as Difficulty[]).map((d) => (
          <button key={d} onClick={() => newGame(d)} disabled={generating}
            className={`btn ${saved.difficulty===d ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'} disabled:opacity-50`}>
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
        {lockedDifficulty && (
          <span className="rounded bg-brand-600 px-3 py-1 text-sm font-semibold text-white">
            {lockedDifficulty[0].toUpperCase() + lockedDifficulty.slice(1)}
          </span>
        )}
        <button onClick={() => newGame(saved.difficulty)} disabled={generating} className="btn-ghost disabled:opacity-50">New puzzle</button>
        <button onClick={restart} className="btn-ghost">Restart</button>
        {generating && <span className="text-xs text-slate-500">generating…</span>}
      </div>

      <div className="mx-auto grid w-full max-w-md grid-cols-9 overflow-hidden rounded border-2 border-slate-800">
        {saved.state.map((v, i) => {
          const given = saved.puzzle[i] !== 0;
          const row = Math.floor(i / 9), col = i % 9;
          const isSel = sel === i;
          const isBad = badCells.has(i);
          const borderR = col % 3 === 2 && col !== 8 ? 'border-r-2 border-r-slate-800' : 'border-r border-r-slate-300';
          const borderB = row % 3 === 2 && row !== 8 ? 'border-b-2 border-b-slate-800' : 'border-b border-b-slate-300';
          return (
            <button key={i} onClick={() => setSel(i)}
              className={[
                'aspect-square flex items-center justify-center text-lg sm:text-xl font-semibold select-none',
                borderR, borderB,
                given ? 'text-slate-900 bg-slate-50' : 'text-brand-700',
                isSel ? 'bg-brand-100' : '',
                isBad ? 'bg-red-100 text-red-700' : '',
              ].join(' ')}
              aria-label={`cell row ${row + 1} column ${col + 1}`}>
              {v || ''}
            </button>
          );
        })}
      </div>

      <div className="mx-auto w-full max-w-md space-y-2">
        <div className="grid grid-cols-9 gap-1">
          {[1,2,3,4,5,6,7,8,9].map((n) => (
            <button key={n} onClick={() => sel !== null && setCell(sel, n)}
              className="min-h-[44px] rounded bg-slate-100 py-2 text-lg font-semibold hover:bg-slate-200 disabled:opacity-40"
              disabled={sel === null || saved.puzzle[sel] !== 0}>
              {n}
            </button>
          ))}
        </div>
        <button onClick={() => sel !== null && setCell(sel, 0)}
          className="w-full min-h-[44px] rounded bg-slate-100 py-2 text-sm font-semibold hover:bg-slate-200 disabled:opacity-40"
          disabled={sel === null || saved.puzzle[sel] !== 0}>
          Clear cell
        </button>
      </div>

      {complete && finishedAt !== null && (() => {
        const elapsed = finishedAt - saved.started;
        const isNewBest = prevBest === null || elapsed < prevBest;
        const diffLabel = saved.difficulty[0].toUpperCase() + saved.difficulty.slice(1);
        const next = NEXT_DIFF[saved.difficulty];
        const mistakes = saved.mistakes ?? 0;
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Solved ${diffLabel} in ${fmtTime(elapsed)}.` },
          {
            kind: 'stats',
            items: [
              { label: 'Difficulty', value: diffLabel },
              { label: 'Time', value: fmtTime(elapsed) },
              { label: 'Mistakes', value: String(mistakes) },
              { label: 'Best', value: fmtTime(best ?? elapsed) },
            ],
          },
          {
            kind: 'takeaway',
            text: isNewBest
              ? (prevBest === null
                ? `First ${diffLabel} solve — this is your best time.`
                : `New best! ${fmtTime(prevBest - elapsed)} faster than your previous ${fmtTime(prevBest)}.`)
              : `Your best ${diffLabel} is ${fmtTime(best ?? elapsed)} — ${fmtTime(elapsed - (best ?? elapsed))} slower today.`,
          },
          mistakes === 0 ? { kind: 'takeaway' as const, text: 'Clean solve — no mistakes.' } : null,
          {
            kind: 'nextStep',
            actions: [
              { href: '/games/daily-word/', label: 'Daily Word' },
              ...(next ? [{ href: '/games/sudoku/', label: `Try ${next[0].toUpperCase() + next.slice(1)}` }] : []),
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

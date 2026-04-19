import { useCallback, useEffect, useMemo, useState } from 'react';
import { conflicts, generate, isComplete, type Board, type Difficulty } from '~/lib/sudoku';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

const DEFAULT_STORAGE_KEY = 'kefiw.sudoku.v1';
const BEST_KEY = 'kefiw.sudoku.best.';

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

  useEffect(() => {
    const s = loadSaved(storageKey);
    if (s && (!lockedDifficulty || s.difficulty === lockedDifficulty)) setSaved(s);
    else newGame(lockedDifficulty ?? 'easy', true);
  }, [storageKey, lockedDifficulty]);

  const newGame = useCallback((diff: Difficulty, silent = false) => {
    if (!silent && saved && !isComplete(saved.state) && !confirm('Start a new game? Progress will be lost.')) return;
    const { puzzle, solution } = generate(diff);
    const s: Saved = { difficulty: diff, puzzle, solution, state: [...puzzle], started: Date.now(), mistakes: 0 };
    saveState(storageKey, s);
    setSaved(s);
    setSel(null);
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
      <div className="flex flex-wrap items-center gap-2">
        {!lockedDifficulty && (['easy','medium','hard','expert'] as Difficulty[]).map((d) => (
          <button key={d} onClick={() => newGame(d)}
            className={`btn ${saved.difficulty===d ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
        {lockedDifficulty && (
          <span className="rounded bg-brand-600 px-3 py-1 text-sm font-semibold text-white">
            {lockedDifficulty[0].toUpperCase() + lockedDifficulty.slice(1)}
          </span>
        )}
        <button onClick={() => newGame(saved.difficulty)} className="btn-ghost">New puzzle</button>
        <button onClick={restart} className="btn-ghost">Restart</button>
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

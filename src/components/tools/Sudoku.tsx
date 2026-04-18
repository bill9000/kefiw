import { useCallback, useEffect, useMemo, useState } from 'react';
import { conflicts, generate, isComplete, type Board, type Difficulty } from '~/lib/sudoku';

const STORAGE_KEY = 'kefiw.sudoku.v1';

interface Saved {
  difficulty: Difficulty;
  puzzle: Board;
  solution: Board;
  state: Board;
  started: number;
}

function loadSaved(): Saved | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Saved;
  } catch { return null; }
}

function saveState(s: Saved) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export default function Sudoku() {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [sel, setSel] = useState<number | null>(null);

  useEffect(() => {
    const s = loadSaved();
    if (s) setSaved(s);
    else newGame('easy', true);
  }, []);

  const newGame = useCallback((diff: Difficulty, silent = false) => {
    if (!silent && saved && !isComplete(saved.state) && !confirm('Start a new game? Progress will be lost.')) return;
    const { puzzle, solution } = generate(diff);
    const s: Saved = { difficulty: diff, puzzle, solution, state: [...puzzle], started: Date.now() };
    saveState(s);
    setSaved(s);
    setSel(null);
  }, [saved]);

  const restart = useCallback(() => {
    setSaved((prev) => {
      if (!prev) return prev;
      const next = { ...prev, state: [...prev.puzzle] };
      saveState(next);
      return next;
    });
    setSel(null);
  }, []);

  const setCell = useCallback((i: number, v: number) => {
    setSaved((prev) => {
      if (!prev) return prev;
      if (prev.puzzle[i] !== 0) return prev;
      const state = [...prev.state];
      state[i] = v;
      const next = { ...prev, state };
      saveState(next);
      return next;
    });
  }, []);

  const complete = saved && isComplete(saved.state);
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
        {(['easy','medium','hard','expert'] as Difficulty[]).map((d) => (
          <button key={d} onClick={() => newGame(d)}
            className={`btn ${saved.difficulty===d ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
            {d[0].toUpperCase() + d.slice(1)}
          </button>
        ))}
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

      {complete && (
        <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-900">
          <div className="text-lg font-semibold">Solved!</div>
          <div className="text-sm">Difficulty: {saved.difficulty}.</div>
        </div>
      )}
    </div>
  );
}

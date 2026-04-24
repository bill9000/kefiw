import { useEffect, useMemo, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import {
  generateSudoku,
  difficultyForDailyDate,
  isValidMove,
  isSolved,
  type SudokuPuzzle,
} from '~/lib/daily-sudoku';
import {
  getProgress,
  saveProgress,
  recordResult,
  type SudokuProgress,
} from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';

export default function SudokuGame() {
  const [dailyDate, setDailyDate] = useState('');
  const [puzzle, setPuzzle] = useState<SudokuPuzzle | null>(null);
  const [grid, setGrid] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [finishedAt, setFinishedAt] = useState<number | undefined>(undefined);
  const [now, setNow] = useState<number>(Date.now());
  const [errorCell, setErrorCell] = useState<number | null>(null);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const difficulty = difficultyForDailyDate(d);
    const p = generateSudoku(d, difficulty);
    setPuzzle(p);
    const saved = getProgress<SudokuProgress>(d, 'sudoku');
    if (saved) {
      setGrid([...saved.grid]);
      setStartedAt(saved.startedAt);
      setFinishedAt(saved.finishedAt);
    } else {
      setGrid([...p.puzzle]);
      setStartedAt(Date.now());
    }
  }, []);

  useEffect(() => {
    if (finishedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [finishedAt]);

  const elapsedSec = useMemo(() => {
    if (!startedAt) return 0;
    const end = finishedAt ?? now;
    return Math.floor((end - startedAt) / 1000);
  }, [startedAt, finishedAt, now]);

  const isFixed = (i: number) => puzzle !== null && puzzle.puzzle[i] !== 0;
  const finished = finishedAt !== undefined;

  function setCell(idx: number, digit: number) {
    if (!puzzle || finished) return;
    if (isFixed(idx)) return;
    if (digit !== 0 && !isValidMove(grid, idx, digit)) {
      setErrorCell(idx);
      setTimeout(() => setErrorCell(null), 400);
    }
    const next = [...grid];
    next[idx] = digit;
    setGrid(next);
    const solved = isSolved(next, puzzle.solution);
    const finishTime = solved ? Date.now() : undefined;
    if (solved) setFinishedAt(finishTime);
    const progress: SudokuProgress = {
      grid: next,
      startedAt,
      finishedAt: finishTime,
      finished: solved,
    };
    saveProgress(dailyDate, 'sudoku', progress);
    if (solved) {
      const timeSec = Math.floor(((finishTime ?? Date.now()) - startedAt) / 1000);
      const result = {
        gameId: 'sudoku' as const,
        solved: true,
        timeSec,
      };
      recordResult(dailyDate, result);
      void submitDailyScore(dailyDate, result);
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected === null || finished) return;
      if (/^[1-9]$/.test(e.key)) {
        setCell(selected, Number(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
        setCell(selected, 0);
      } else if (e.key === 'ArrowLeft') {
        setSelected((s) => (s !== null && s % 9 > 0 ? s - 1 : s));
      } else if (e.key === 'ArrowRight') {
        setSelected((s) => (s !== null && s % 9 < 8 ? s + 1 : s));
      } else if (e.key === 'ArrowUp') {
        setSelected((s) => (s !== null && s >= 9 ? s - 9 : s));
      } else if (e.key === 'ArrowDown') {
        setSelected((s) => (s !== null && s < 72 ? s + 9 : s));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!puzzle) {
    return <div className="mx-auto max-w-md rounded border border-slate-200 p-4 text-sm text-slate-500">Loading…</div>;
  }

  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;
  const selectedValue = selected !== null ? grid[selected] : 0;

  return (
    <div className="mx-auto max-w-md space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Difficulty</div>
          <div className="text-lg font-semibold capitalize">{puzzle.difficulty}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-500">Time</div>
          <div className="font-mono text-lg">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-9 gap-px rounded bg-slate-400 p-0.5">
        {grid.map((v, i) => {
          const row = Math.floor(i / 9);
          const col = i % 9;
          const fixed = isFixed(i);
          const isSel = selected === i;
          const sameValue = selectedValue !== 0 && v === selectedValue;
          const sameRowCol =
            selected !== null &&
            (Math.floor(selected / 9) === row || selected % 9 === col);
          const sameBox =
            selected !== null &&
            Math.floor(Math.floor(selected / 9) / 3) === Math.floor(row / 3) &&
            Math.floor((selected % 9) / 3) === Math.floor(col / 3);
          const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'border-r-2 border-r-slate-900' : '';
          const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'border-b-2 border-b-slate-900' : '';

          let bg = 'bg-white';
          if (errorCell === i) bg = 'bg-rose-300';
          else if (isSel) bg = 'bg-amber-200';
          else if (sameValue) bg = 'bg-amber-100';
          else if (sameRowCol || sameBox) bg = 'bg-slate-100';

          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`aspect-square text-xl font-semibold ${bg} ${borderRight} ${borderBottom} ${
                fixed ? 'text-slate-900' : 'text-brand-700'
              }`}
              disabled={finished}
            >
              {v === 0 ? '' : v}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-9 gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <button
            key={d}
            onClick={() => selected !== null && setCell(selected, d)}
            disabled={selected === null || finished || isFixed(selected ?? -1)}
            className="rounded bg-slate-200 py-2 text-lg font-semibold hover:bg-slate-300 disabled:opacity-40"
          >
            {d}
          </button>
        ))}
      </div>
      <button
        onClick={() => selected !== null && setCell(selected, 0)}
        disabled={selected === null || finished || isFixed(selected ?? -1)}
        className="w-full rounded bg-slate-200 py-2 text-sm font-semibold hover:bg-slate-300 disabled:opacity-40"
      >
        Clear cell
      </button>

      {finished && (
        <div className="rounded border border-emerald-300 bg-emerald-50 p-3 text-center text-sm">
          <div className="font-semibold text-emerald-900">
            Solved in {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <a href="/daily/" className="mt-2 inline-block text-xs text-brand-700 hover:underline">
            ← Back to Daily
          </a>
        </div>
      )}
    </div>
  );
}

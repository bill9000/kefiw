// Daily Mini Crosser — fill the grid cells from a given letter pool so the
// hidden words are formed. Accuracy = cells filled correctly / total cells.

import { useEffect, useMemo, useRef, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import { getVerbalPuzzle, verbalScore, type CrosserPuzzle } from '~/lib/daily-verbal-puzzles';
import { getProgress, saveProgress, recordResult, type VerbalProgress } from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';
import type { VerbalResult } from '~/lib/daily-scoring';

const GAME_ID = 'verbal-crosser' as const;

interface CrosserState {
  // `${row},${col}` -> letter
  cells: Record<string, string>;
}

// Build the ideal answer grid from placements.
function idealGrid(puzzle: CrosserPuzzle): Record<string, string> {
  const grid: Record<string, string> = {};
  for (const [word, place] of Object.entries(puzzle.placements)) {
    for (let i = 0; i < word.length; i++) {
      const r = place.dir === 'H' ? place.row : place.row + i;
      const c = place.dir === 'H' ? place.col + i : place.col;
      grid[`${r},${c}`] = word[i];
    }
  }
  return grid;
}

export default function VerbalCrosser(): JSX.Element {
  const [dailyDate, setDailyDate] = useState('');
  const [puzzle, setPuzzle] = useState<CrosserPuzzle | null>(null);
  const [state, setState] = useState<CrosserState>({ cells: {} });
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startRef = useRef<number>(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const p = getVerbalPuzzle(d, GAME_ID) as CrosserPuzzle | null;
    setPuzzle(p);
    const saved = getProgress<VerbalProgress>(d, GAME_ID);
    if (saved) {
      const s = saved.state as unknown as CrosserState;
      if (s?.cells) setState(s);
      if (saved.finishedAt) setFinished(true);
      startRef.current = saved.startedAt;
    } else {
      startRef.current = Date.now();
      saveProgress(d, GAME_ID, {
        startedAt: startRef.current,
        finished: false,
        state: { cells: {} },
      });
    }
  }, []);

  useEffect(() => {
    if (finished) return;
    const t = window.setInterval(() => {
      if (startRef.current) setElapsedSec(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => window.clearInterval(t);
  }, [finished]);

  const ideal = useMemo(() => (puzzle ? idealGrid(puzzle) : {}), [puzzle]);

  const activeCells = useMemo(() => Object.keys(ideal), [ideal]);

  const accuracy = useMemo(() => {
    if (!activeCells.length) return 0;
    const hits = activeCells.filter((k) => state.cells[k] === ideal[k]).length;
    return hits / activeCells.length;
  }, [activeCells, ideal, state.cells]);

  function persist(nextState: CrosserState, markFinished = false): void {
    saveProgress(dailyDate, GAME_ID, {
      startedAt: startRef.current,
      finished: markFinished,
      finishedAt: markFinished ? Date.now() : undefined,
      state: nextState as unknown as Record<string, unknown>,
    });
  }

  function placeLetter(letter: string): void {
    if (!selected || finished) return;
    const next: CrosserState = { cells: { ...state.cells, [selected]: letter } };
    setState(next);
    persist(next);
  }

  function clearCell(): void {
    if (!selected) return;
    const next: CrosserState = { cells: { ...state.cells } };
    delete next.cells[selected];
    setState(next);
    persist(next);
  }

  function finish(): void {
    if (!puzzle) return;
    const timeUsed = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const score = verbalScore(accuracy, timeUsed, puzzle.baselineSec);
    const result: VerbalResult = {
      gameId: GAME_ID,
      score,
      accuracy,
      timeSec: timeUsed,
      finished: true,
    };
    setFinished(true);
    setSubmitted(true);
    persist(state, true);
    recordResult(dailyDate, result);
    void submitDailyScore(dailyDate, result);
  }

  if (!puzzle) {
    return <div className="py-8 text-center text-slate-500">Loading today&rsquo;s Mini Crosser…</div>;
  }

  const { rows, cols, letters, words } = puzzle;
  const letterPool = letters.split('');

  return (
    <div className="mx-auto max-w-md">
      {!finished ? (
        <>
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              Cells <strong>{Object.keys(state.cells).length}</strong> / {activeCells.length}
            </span>
            <span className="font-mono">{elapsedSec}s</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mx-auto grid justify-center gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, maxWidth: `${cols * 48}px` }}>
              {Array.from({ length: rows * cols }).map((_, i) => {
                const r = Math.floor(i / cols);
                const c = i % cols;
                const key = `${r},${c}`;
                const isActive = activeCells.includes(key);
                const filled = state.cells[key];
                const isSel = selected === key;
                if (!isActive) {
                  return <div key={key} className="h-10 w-10 bg-slate-100" />;
                }
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelected(key)}
                    className={`h-10 w-10 rounded-sm border text-lg font-bold transition ${
                      isSel
                        ? 'border-brand-600 bg-brand-100 text-brand-900'
                        : 'border-slate-300 bg-white text-slate-900 hover:border-brand-400'
                    }`}
                  >
                    {filled ?? ''}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {selected ? 'Pick a letter for the selected cell' : 'Tap a cell above, then pick a letter.'}
              </div>
              <div className="flex flex-wrap justify-center gap-1">
                {letterPool.map((letter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={!selected}
                    onClick={() => placeLetter(letter)}
                    className="rounded border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {letter}
                  </button>
                ))}
              </div>
              {selected && state.cells[selected] && (
                <button type="button" onClick={clearCell} className="mt-2 text-xs text-rose-700 hover:underline">
                  Clear this cell
                </button>
              )}
            </div>

            <div className="mt-4 text-center text-xs text-slate-500">
              Hint: the grid holds {words.length} overlapping words, all built from the pool above.
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button type="button" onClick={finish} className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700">
              Submit — score me
            </button>
          </div>
        </>
      ) : (
        <SummaryCard
          title="Mini Crosser"
          accuracy={accuracy}
          words={words}
          timeSec={elapsedSec || Math.floor((Date.now() - startRef.current) / 1000)}
          baselineSec={puzzle.baselineSec}
          submitted={submitted}
        />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  accuracy,
  words,
  timeSec,
  baselineSec,
  submitted,
}: {
  title: string;
  accuracy: number;
  words: string[];
  timeSec: number;
  baselineSec: number;
  submitted: boolean;
}): JSX.Element {
  const score = verbalScore(accuracy, timeSec, baselineSec);
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-brand-700">{score}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Score / 1500</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{Math.round(accuracy * 100)}%</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Cells correct</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{timeSec}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Time · baseline {baselineSec}s</div>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Words</div>
        <p className="mt-1 font-mono text-xs">{words.join(' · ')}</p>
      </div>
      <p className="mt-4 text-sm text-slate-600">
        {score >= 450 ? 'Cleared — counts toward your Kefiw Verbal pipeline streak.' : 'Need 450 points to clear.'}
        {submitted && ' Submitted to the leaderboard.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href="/daily/verbal/" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Back to Kefiw Verbal
        </a>
        <a href="/daily/leaderboard/" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Today&rsquo;s leaderboard →
        </a>
      </div>
    </div>
  );
}

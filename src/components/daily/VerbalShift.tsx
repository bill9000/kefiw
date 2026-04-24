// Daily Letter Shift — type target words using one letter from each of the
// five columns (in column order). Accuracy = words formed / total target words.

import { useEffect, useMemo, useRef, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import { getVerbalPuzzle, verbalScore, type ShiftPuzzle } from '~/lib/daily-verbal-puzzles';
import { getProgress, saveProgress, recordResult, type VerbalProgress } from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';
import type { VerbalResult } from '~/lib/daily-scoring';

const GAME_ID = 'verbal-shift' as const;

interface ShiftState {
  found: string[]; // words matched so far
}

function matchesColumns(word: string, columns: string[][]): boolean {
  if (word.length !== columns.length) return false;
  for (let i = 0; i < columns.length; i++) {
    if (!columns[i].includes(word[i])) return false;
  }
  return true;
}

export default function VerbalShift(): JSX.Element {
  const [dailyDate, setDailyDate] = useState('');
  const [puzzle, setPuzzle] = useState<ShiftPuzzle | null>(null);
  const [state, setState] = useState<ShiftState>({ found: [] });
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState<{ kind: 'ok' | 'no' | 'dupe'; text: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startRef = useRef<number>(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const p = getVerbalPuzzle(d, GAME_ID) as ShiftPuzzle | null;
    setPuzzle(p);
    const saved = getProgress<VerbalProgress>(d, GAME_ID);
    if (saved) {
      const s = saved.state as unknown as ShiftState;
      if (s?.found) setState(s);
      if (saved.finishedAt) setFinished(true);
      startRef.current = saved.startedAt;
    } else {
      startRef.current = Date.now();
      saveProgress(d, GAME_ID, {
        startedAt: startRef.current,
        finished: false,
        state: { found: [] },
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

  const accuracy = useMemo(() => {
    if (!puzzle) return 0;
    return state.found.length / puzzle.words.length;
  }, [state.found, puzzle]);

  function persist(nextState: ShiftState, markFinished = false): void {
    saveProgress(dailyDate, GAME_ID, {
      startedAt: startRef.current,
      finished: markFinished,
      finishedAt: markFinished ? Date.now() : undefined,
      state: nextState as unknown as Record<string, unknown>,
    });
  }

  function flashMsg(kind: 'ok' | 'no' | 'dupe', text: string): void {
    setFlash({ kind, text });
    window.setTimeout(() => setFlash(null), 1200);
  }

  function submit(e: React.FormEvent): void {
    e.preventDefault();
    if (!puzzle || finished) return;
    const w = input.trim().toUpperCase();
    setInput('');
    if (!puzzle.words.includes(w)) {
      if (matchesColumns(w, puzzle.columns)) {
        flashMsg('no', 'Letters work but not a target word');
      } else {
        flashMsg('no', 'Letters don\'t align to the columns');
      }
      return;
    }
    if (state.found.includes(w)) {
      flashMsg('dupe', 'Already found');
      return;
    }
    const next: ShiftState = { found: [...state.found, w] };
    const isComplete = next.found.length === puzzle.words.length;
    setState(next);
    persist(next, isComplete);
    flashMsg('ok', `+${w}`);
    if (isComplete) finalize(next);
  }

  function finalize(finalState: ShiftState): void {
    if (!puzzle) return;
    const timeUsed = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const accFrac = finalState.found.length / puzzle.words.length;
    const score = verbalScore(accFrac, timeUsed, puzzle.baselineSec);
    const result: VerbalResult = {
      gameId: GAME_ID,
      score,
      accuracy: accFrac,
      timeSec: timeUsed,
      finished: true,
    };
    setFinished(true);
    setSubmitted(true);
    persist(finalState, true);
    recordResult(dailyDate, result);
    void submitDailyScore(dailyDate, result);
  }

  function giveUp(): void {
    finalize(state);
  }

  if (!puzzle) {
    return <div className="py-8 text-center text-slate-500">Loading today&rsquo;s Letter Shift…</div>;
  }

  return (
    <div className="mx-auto max-w-xl">
      {!finished ? (
        <>
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              Level: <strong>{puzzle.name}</strong> · Found <strong>{state.found.length}</strong> / {puzzle.words.length}
            </span>
            <span className="font-mono">{elapsedSec}s</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            {/* Column display */}
            <div className="mb-4 flex justify-center gap-2">
              {puzzle.columns.map((col, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  {col.map((letter, j) => (
                    <span
                      key={j}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-lg font-bold text-slate-900"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
              ))}
            </div>

            <form onSubmit={submit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                maxLength={puzzle.columns.length}
                autoFocus
                placeholder={`Type a ${puzzle.columns.length}-letter word…`}
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-base font-mono uppercase tracking-widest focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Submit
              </button>
            </form>

            {flash && (
              <div
                className={`mt-3 rounded-md px-3 py-2 text-center text-sm ${
                  flash.kind === 'ok'
                    ? 'bg-emerald-50 text-emerald-800'
                    : flash.kind === 'dupe'
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
                role="status"
                aria-live="polite"
              >
                {flash.text}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Found</div>
            {state.found.length === 0 ? (
              <div className="text-sm text-slate-400">None yet.</div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {state.found.map((w) => (
                  <span key={w} className="rounded bg-white px-2 py-1 text-xs font-mono text-slate-700 shadow-sm">
                    {w}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={giveUp}
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              I&rsquo;m done — score me
            </button>
          </div>
        </>
      ) : (
        <SummaryCard
          title={`Letter Shift · ${puzzle.name}`}
          accuracy={accuracy}
          found={state.found.length}
          total={puzzle.words.length}
          words={puzzle.words}
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
  found,
  total,
  words,
  timeSec,
  baselineSec,
  submitted,
}: {
  title: string;
  accuracy: number;
  found: number;
  total: number;
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
          <div className="text-2xl font-bold text-slate-900">{found} / {total}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Words</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{timeSec}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Time · baseline {baselineSec}s</div>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Target words</div>
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

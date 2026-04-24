// Generic daily math game — one React island, parameterised by gameId.
//
// Renders 10 seeded rounds. Each round: timer counts down from 15s, user
// either taps one of 5 MCQ buttons or types an exact answer. Score is
// accuracy × speed multiplier. Session total caps at 1500. Progress is
// persisted to localStorage so a reload resumes the same round.

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import {
  generateMathRounds,
  roundScore,
  ROUND_TIME_SEC,
  ROUNDS_PER_GAME,
  type MathRound,
  type RoundEntryMode,
} from '~/lib/daily-math-rounds';
import {
  getProgress,
  saveProgress,
  recordResult,
  type MathProgress,
  type MathRoundLog,
} from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';
import type { MathResult } from '~/lib/daily-scoring';

interface Props {
  gameId: MathResult['gameId'];
  title: string;
}

const STARTING_PROGRESS: MathProgress = {
  roundIndex: 0,
  totalScore: 0,
  totalTimeSec: 0,
  log: [],
  finished: false,
};

function formatNumber(n: number, decimals: number): string {
  if (Number.isInteger(n) && decimals === 0) return n.toString();
  return n.toFixed(decimals);
}

export default function MathGame({ gameId, title }: Props): JSX.Element {
  const [dailyDate, setDailyDate] = useState('');
  const [rounds, setRounds] = useState<MathRound[]>([]);
  const [progress, setProgress] = useState<MathProgress>(STARTING_PROGRESS);
  const [typedValue, setTypedValue] = useState('');
  const [showTyped, setShowTyped] = useState(false);
  const [timeUsed, setTimeUsed] = useState(0); // seconds used in current round
  const [flash, setFlash] = useState<null | { delta: number; correct: number }>(null);
  const tickRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  // --- Init on mount -------------------------------------------------------
  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const generated = generateMathRounds(d, gameId);
    setRounds(generated);
    const saved = getProgress<MathProgress>(d, gameId);
    if (saved) setProgress(saved);
  }, [gameId]);

  const currentRound: MathRound | undefined = rounds[progress.roundIndex];

  const clearTick = useCallback((): void => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  // --- Answer handler ------------------------------------------------------
  const handleSubmitAnswer = useCallback(
    (mode: RoundEntryMode, guess: number): void => {
      clearTick();
      if (!currentRound) return;
      const elapsed = Math.min(ROUND_TIME_SEC, (Date.now() - startRef.current) / 1000);
      const pts = Number.isFinite(guess) ? roundScore(mode, guess, currentRound.correct, elapsed) : 0;
      const log: MathRoundLog = {
        mode,
        guess: Number.isFinite(guess) ? guess : 0,
        correct: currentRound.correct,
        timeUsedSec: elapsed,
        roundScore: pts,
      };
      const nextIndex = progress.roundIndex + 1;
      const nextTotal = progress.totalScore + pts;
      const nextTime = progress.totalTimeSec + elapsed;
      const finished = nextIndex >= ROUNDS_PER_GAME;
      const next: MathProgress = {
        roundIndex: nextIndex,
        totalScore: nextTotal,
        totalTimeSec: nextTime,
        log: [...progress.log, log],
        finished,
      };
      setProgress(next);
      saveProgress(dailyDate, gameId, next);
      setFlash({ delta: pts, correct: currentRound.correct });
      window.setTimeout(() => setFlash(null), 900);
      if (finished) {
        const result: MathResult = {
          gameId,
          score: nextTotal,
          roundsCompleted: nextIndex,
          timeSec: Math.round(nextTime),
        };
        recordResult(dailyDate, result);
        void submitDailyScore(dailyDate, result);
      }
    },
    [clearTick, currentRound, dailyDate, gameId, progress]
  );

  // --- Per-round timer -----------------------------------------------------
  useEffect(() => {
    if (progress.finished || !currentRound) return;
    startRef.current = Date.now();
    setTimeUsed(0);
    setTypedValue('');
    setShowTyped(false);
    tickRef.current = window.setInterval(() => {
      const used = (Date.now() - startRef.current) / 1000;
      if (used >= ROUND_TIME_SEC) {
        handleSubmitAnswer('mcq', NaN); // forced timeout = 0 points
        return;
      }
      setTimeUsed(used);
    }, 100);
    return clearTick;
  }, [progress.roundIndex, progress.finished, currentRound, handleSubmitAnswer, clearTick]);

  const handleMcqTap = (choice: number): void => handleSubmitAnswer('mcq', choice);
  const handleTypedSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const n = parseFloat(typedValue.replace(',', '.'));
    if (Number.isNaN(n)) return;
    handleSubmitAnswer('typed', n);
  };

  // --- Render --------------------------------------------------------------
  if (!dailyDate || rounds.length === 0) {
    return <div className="py-8 text-center text-slate-500">Loading today&rsquo;s {title.toLowerCase()}…</div>;
  }

  if (progress.finished) {
    return <SessionSummary progress={progress} title={title} gameId={gameId} />;
  }

  if (!currentRound) return <div />;

  const timeLeft = Math.max(0, ROUND_TIME_SEC - timeUsed);
  const timePct = (timeLeft / ROUND_TIME_SEC) * 100;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
        <span>
          Round <strong>{progress.roundIndex + 1}</strong> / {ROUNDS_PER_GAME}
        </span>
        <span>
          Score <strong className="text-brand-700">{progress.totalScore}</strong> / 1500
        </span>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full transition-[width] duration-75 ease-linear ${
            timePct > 40 ? 'bg-brand-500' : timePct > 15 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${timePct}%` }}
          aria-hidden="true"
        />
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-center text-xl font-semibold leading-relaxed text-slate-900 sm:text-2xl">
          {currentRound.prompt}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {currentRound.choices.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => handleMcqTap(c)}
              className="rounded-md border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 transition hover:border-brand-500 hover:bg-brand-50"
            >
              {formatNumber(c, currentRound.decimals)}
              {currentRound.unit ? ` ${currentRound.unit}` : ''}
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          {!showTyped ? (
            <button
              type="button"
              onClick={() => setShowTyped(true)}
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              Type exact answer for bonus points →
            </button>
          ) : (
            <form onSubmit={handleTypedSubmit} className="flex gap-2">
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                placeholder="Your answer"
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-base focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Submit
              </button>
            </form>
          )}
          <p className="mt-2 text-xs text-slate-500">
            MCQ tap: up to 120 points. Typed exact: up to 150 points. Faster = higher multiplier.
          </p>
        </div>
      </div>

      {flash && (
        <div
          className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm text-slate-700"
          role="status"
          aria-live="polite"
        >
          {flash.delta > 0 ? `+${flash.delta}` : '0'} points · answer was{' '}
          <strong>{formatNumber(flash.correct, currentRound.decimals)}</strong>
          {currentRound.unit ? ` ${currentRound.unit}` : ''}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary view (shown after all 10 rounds)
// ---------------------------------------------------------------------------

function SessionSummary({
  progress,
  title,
  gameId,
}: {
  progress: MathProgress;
  title: string;
  gameId: string;
}): JSX.Element {
  const avgTime = progress.totalTimeSec / Math.max(1, progress.log.length);
  const cleared = progress.totalScore >= 300;
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title} — done for today</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-brand-700">{progress.totalScore}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Score / 1500</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{Math.round(progress.totalTimeSec)}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Total time</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{avgTime.toFixed(1)}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Avg / round</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">
        {cleared
          ? `You cleared ${title} today — it counts toward your Kefiw Math pipeline streak.`
          : `You need 300+ points to count as cleared. Try again tomorrow for a fresh set.`}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href="/daily/math/"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Back to Kefiw Math
        </a>
        <a
          href="/daily/leaderboard/"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Today&rsquo;s leaderboard →
        </a>
      </div>
      <details className="mt-6 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
        <summary className="cursor-pointer font-semibold text-slate-700">Round-by-round</summary>
        <ul className="mt-2 space-y-1 text-xs text-slate-600">
          {progress.log.map((r, i) => (
            <li key={i}>
              Round {i + 1}: {r.mode === 'typed' ? 'typed' : 'tap'} {r.guess} · answer {r.correct} ·{' '}
              {r.timeUsedSec.toFixed(1)}s · <strong>{r.roundScore} pts</strong>
            </li>
          ))}
        </ul>
      </details>
      <p className="mt-4 text-xs text-slate-500" data-gameid={gameId}>
        New puzzles at 4am ET.
      </p>
    </div>
  );
}

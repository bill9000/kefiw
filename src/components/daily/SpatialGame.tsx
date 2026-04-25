// Generic daily spatial game — 10 SVG-MCQ rounds per session. Same cadence
// as MathGame: 15-second round cap, accuracy (correct/wrong) × speed
// multiplier, max 1500/session.

import { useCallback, useEffect, useRef, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import {
  generateSpatialRounds,
  scoreSpatial,
  SPATIAL_ROUND_TIME_SEC,
  SPATIAL_ROUNDS_PER_GAME,
  type SpatialRound,
} from '~/lib/daily-spatial-rounds';
import {
  getProgress,
  saveProgress,
  recordResult,
  type SpatialProgress,
  type SpatialRoundLog,
} from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';
import type { SpatialResult } from '~/lib/daily-scoring';

interface Props {
  gameId: SpatialResult['gameId'];
  title: string;
}

const STARTING_PROGRESS: SpatialProgress = {
  roundIndex: 0,
  totalScore: 0,
  totalTimeSec: 0,
  log: [],
  finished: false,
};

export default function SpatialGame({ gameId, title }: Props): JSX.Element {
  const [dailyDate, setDailyDate] = useState('');
  const [rounds, setRounds] = useState<SpatialRound[]>([]);
  const [progress, setProgress] = useState<SpatialProgress>(STARTING_PROGRESS);
  const [timeUsed, setTimeUsed] = useState(0);
  const [flash, setFlash] = useState<null | { delta: number; correct: boolean }>(null);
  const tickRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const generated = generateSpatialRounds(d, gameId);
    setRounds(generated);
    const saved = getProgress<SpatialProgress>(d, gameId);
    if (saved) setProgress(saved);
  }, [gameId]);

  const currentRound: SpatialRound | undefined = rounds[progress.roundIndex];

  const clearTick = useCallback((): void => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const handleTap = useCallback(
    (chosenIndex: number): void => {
      clearTick();
      if (!currentRound) return;
      const elapsed = Math.min(SPATIAL_ROUND_TIME_SEC, (Date.now() - startRef.current) / 1000);
      const isCorrect = chosenIndex === currentRound.correctIndex;
      const pts = scoreSpatial(isCorrect, elapsed);
      const log: SpatialRoundLog = {
        chosenIndex,
        correctIndex: currentRound.correctIndex,
        timeUsedSec: elapsed,
        roundScore: pts,
      };
      const nextIndex = progress.roundIndex + 1;
      const nextTotal = progress.totalScore + pts;
      const nextTime = progress.totalTimeSec + elapsed;
      const finished = nextIndex >= SPATIAL_ROUNDS_PER_GAME;
      const next: SpatialProgress = {
        roundIndex: nextIndex,
        totalScore: nextTotal,
        totalTimeSec: nextTime,
        log: [...progress.log, log],
        finished,
      };
      setProgress(next);
      saveProgress(dailyDate, gameId, next);
      setFlash({ delta: pts, correct: isCorrect });
      window.setTimeout(() => setFlash(null), 700);
      if (finished) {
        const result: SpatialResult = {
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

  useEffect(() => {
    if (progress.finished || !currentRound) return;
    startRef.current = Date.now();
    setTimeUsed(0);
    tickRef.current = window.setInterval(() => {
      const used = (Date.now() - startRef.current) / 1000;
      if (used >= SPATIAL_ROUND_TIME_SEC) {
        handleTap(-1); // timeout = wrong
        return;
      }
      setTimeUsed(used);
    }, 100);
    return clearTick;
  }, [progress.roundIndex, progress.finished, currentRound, handleTap, clearTick]);

  if (!dailyDate || rounds.length === 0) {
    return <div className="py-8 text-center text-slate-500">Loading today&rsquo;s {title.toLowerCase()}…</div>;
  }
  if (progress.finished) return <SessionSummary progress={progress} title={title} />;
  if (!currentRound) return <div />;

  const timeLeft = Math.max(0, SPATIAL_ROUND_TIME_SEC - timeUsed);
  const timePct = (timeLeft / SPATIAL_ROUND_TIME_SEC) * 100;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
        <span>Round <strong>{progress.roundIndex + 1}</strong> / {SPATIAL_ROUNDS_PER_GAME}</span>
        <span>Score <strong className="text-brand-700">{progress.totalScore}</strong> / 1500</span>
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
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex justify-center">
          <div className="max-w-xs" dangerouslySetInnerHTML={{ __html: currentRound.promptSvg }} />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {currentRound.choicesSvg.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleTap(i)}
              className="flex items-center justify-center rounded-md border border-slate-300 bg-white p-2 transition hover:border-brand-500 hover:bg-brand-50"
              aria-label={`Choice ${i + 1}`}
              dangerouslySetInnerHTML={{ __html: s }}
            />
          ))}
        </div>
      </div>
      {flash && (
        <div
          className={`mt-3 rounded-md px-3 py-2 text-center text-sm ${
            flash.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}
          role="status"
          aria-live="polite"
        >
          {flash.correct ? `+${flash.delta} points` : 'Wrong — 0 points'}
        </div>
      )}
    </div>
  );
}

function SessionSummary({ progress, title }: { progress: SpatialProgress; title: string }): JSX.Element {
  const correct = progress.log.filter((r) => r.chosenIndex === r.correctIndex).length;
  const avgTime = progress.totalTimeSec / Math.max(1, progress.log.length);
  const cleared = progress.totalScore >= 450;
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title} — done for today</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-brand-700">{progress.totalScore}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Score / 1500</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{correct} / 10</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Correct</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{avgTime.toFixed(1)}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Avg / round</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">
        {cleared
          ? `Cleared ${title} for today — counts toward the Kefiw Spatial streak.`
          : 'Need 450+ points to clear for the streak. Try again tomorrow for a fresh set.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href="/daily/spatial/" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Back to Kefiw Spatial
        </a>
        <a href="/daily/leaderboard/" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Today&rsquo;s leaderboard →
        </a>
      </div>
    </div>
  );
}

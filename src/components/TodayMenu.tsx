// "What should I do today?" popover — triggered by clicking the "Kefiw"
// wordmark in the header. Works from any page. Shows per-pipeline status
// (cleared / partial / not started), streak numbers, and a resume CTA that
// deep-links to the first unfinished game in each pipeline.
//
// Data read-only from the same sources as DailyHub and SystemTray:
// - getDailyDate / getSecondsUntilRollover (daily-day)
// - getTodayResults (daily-state)
// - allActiveStreaks, isCleared (daily-scoring)
// - getActivePipelines (daily-pipelines)

import { useEffect, useMemo, useRef, useState } from 'react';
import { getActivePipelines, type DailyPipeline } from '~/data/daily-pipelines';
import { DAILY_GAMES, type DailyGame } from '~/data/daily-games';
import { getDailyDate, getSecondsUntilRollover } from '~/lib/daily-day';
import { getTodayResults, loadHistory } from '~/lib/daily-state';
import { allActiveStreaks, isCleared, type GameResult } from '~/lib/daily-scoring';

function fmtCountdown(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

// Map pipeline id to the URL stem where its game slugs live. Keep in sync
// with DailyHub.gameHref.
function pipelineHrefBase(pipelineId: string): string {
  if (pipelineId === 'core') return '/daily';
  return `/daily/${pipelineId}`;
}
function gameHref(pipelineId: string, gameSlug: string): string {
  return `${pipelineHrefBase(pipelineId)}/${gameSlug}/`;
}

interface PipelineSnapshot {
  pipeline: DailyPipeline;
  gamesCleared: number;
  totalGames: number;
  streak: number;
  firstUnfinished: DailyGame | null; // null if every game is cleared
}

function snapshotForPipeline(
  pipeline: DailyPipeline,
  todayResults: ReturnType<typeof getTodayResults>,
  streaks: Record<string, number>,
): PipelineSnapshot {
  let gamesCleared = 0;
  let firstUnfinished: DailyGame | null = null;
  for (const gameId of pipeline.games) {
    const game = DAILY_GAMES.find((g) => g.id === gameId);
    if (!game) continue;
    const result = todayResults?.games[gameId] as GameResult | undefined;
    const cleared = result ? isCleared(result) : false;
    if (cleared) gamesCleared += 1;
    else if (firstUnfinished === null) firstUnfinished = game;
  }
  return {
    pipeline,
    gamesCleared,
    totalGames: pipeline.games.length,
    streak: streaks[`pipeline:${pipeline.id}`] ?? 0,
    firstUnfinished,
  };
}

export default function TodayMenu(): JSX.Element {
  const [open, setOpen] = useState(false);
  const [dailyDate, setDailyDate] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [todayResults, setTodayResults] = useState<ReturnType<typeof getTodayResults>>(undefined);
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const rootRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // Tick while the menu is open — fresh countdown + in-case-they-just-finished.
  useEffect(() => {
    function refresh(): void {
      const d = getDailyDate();
      setDailyDate(d);
      setCountdown(getSecondsUntilRollover());
      setTodayResults(getTodayResults(d));
      setStreaks(allActiveStreaks(loadHistory(), d));
    }
    refresh();
    if (!open) return;
    const id = window.setInterval(refresh, 1000);
    return () => window.clearInterval(id);
  }, [open]);

  // Close on outside click + Escape.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent): void {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pipelines = useMemo(() => getActivePipelines(), []);
  const snapshots = useMemo(
    () => pipelines.map((p) => snapshotForPipeline(p, todayResults, streaks)),
    [pipelines, todayResults, streaks],
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-brand-700"
      >
        Kefiw
        <svg viewBox="0 0 10 6" width="8" height="6" aria-hidden="true" className="text-slate-500">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div
          role="menu"
          aria-label="Today's pipelines"
          className="absolute left-0 top-full z-50 mt-1 w-80 max-w-[90vw] rounded-lg border border-slate-200 bg-white p-3 shadow-xl"
        >
          <header className="flex items-baseline justify-between border-b border-slate-100 pb-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Today</div>
              <div className="text-sm font-semibold text-slate-900">{dailyDate || '—'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Next rollover</div>
              <div className="font-mono text-xs text-slate-700">{fmtCountdown(countdown)}</div>
            </div>
          </header>

          <ul className="mt-2 space-y-1.5">
            {snapshots.map(({ pipeline, gamesCleared, totalGames, streak, firstUnfinished }) => {
              const isComplete = gamesCleared === totalGames;
              const hubHref = `${pipelineHrefBase(pipeline.id)}/`;
              const resumeHref = firstUnfinished
                ? gameHref(pipeline.id, firstUnfinished.slug)
                : hubHref;
              const ctaLabel = isComplete
                ? 'Review →'
                : gamesCleared === 0
                  ? 'Play →'
                  : 'Finish →';
              return (
                <li key={pipeline.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-slate-50">
                  <a
                    href={hubHref}
                    className="min-w-0 flex-1 text-sm text-slate-900 no-underline"
                    onClick={() => setOpen(false)}
                  >
                    <div className="font-semibold">{pipeline.label}</div>
                    <div className="text-xs text-slate-600">
                      {isComplete
                        ? <span className="text-emerald-700">✓ all {totalGames} cleared</span>
                        : gamesCleared === 0
                          ? 'Not started'
                          : `${gamesCleared}/${totalGames} done`}
                      {streak > 0 && (
                        <span className="ml-2 text-amber-700">🔥 {streak}</span>
                      )}
                    </div>
                  </a>
                  <a
                    href={resumeHref}
                    onClick={() => setOpen(false)}
                    className={`whitespace-nowrap rounded px-2 py-1 text-xs font-semibold no-underline ${
                      isComplete
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-brand-600 text-white hover:bg-brand-700'
                    }`}
                  >
                    {ctaLabel}
                  </a>
                </li>
              );
            })}
          </ul>

          <footer className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
            <a href="/daily/" onClick={() => setOpen(false)} className="text-slate-600 hover:text-brand-700 hover:underline">
              All pipelines →
            </a>
            <a href="/daily/leaderboard/" onClick={() => setOpen(false)} className="text-slate-600 hover:text-brand-700 hover:underline">
              Leaderboard →
            </a>
          </footer>
        </div>
      )}
    </div>
  );
}

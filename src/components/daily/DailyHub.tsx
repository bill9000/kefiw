import { useEffect, useState } from 'react';
import type { DailyGame } from '~/data/daily-games';
import type { DailyPipeline } from '~/data/daily-pipelines';
import { getDailyDate, getSecondsUntilRollover } from '~/lib/daily-day';
import {
  loadHistory,
  getTodayResults,
  loadHandle,
  saveHandle,
} from '~/lib/daily-state';
import {
  allActiveStreaks,
  isCleared,
  type GameResult,
} from '~/lib/daily-scoring';
import { validateHandle, anonHandleFromHash, getDeviceHash } from '~/lib/daily-identity';

interface Props {
  pipelines: DailyPipeline[];
  games: DailyGame[];
}

function formatCountdown(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

function gameBadge(result: GameResult | undefined): { label: string; tone: 'cleared' | 'partial' | 'none' } {
  if (!result) return { label: 'Not played', tone: 'none' };
  if (isCleared(result)) {
    if (result.gameId === 'hunt') return { label: `Solved in ${result.guesses}`, tone: 'cleared' };
    if (result.gameId === 'hive') return { label: `${result.points} pts`, tone: 'cleared' };
    if (result.gameId === 'sudoku') return { label: `${result.timeSec}s`, tone: 'cleared' };
    // math-* and verbal-* both carry .score
    return { label: `${result.score} pts`, tone: 'cleared' };
  }
  if (result.gameId === 'hive') return { label: `${result.points} pts — keep going`, tone: 'partial' };
  if (result.gameId === 'hunt') return { label: 'Did not solve', tone: 'partial' };
  if ('score' in result) {
    const threshold = result.gameId.startsWith('math-') ? 300 : 450;
    return { label: `${result.score} pts — below ${threshold}`, tone: 'partial' };
  }
  return { label: 'Unsolved', tone: 'partial' };
}

function gameHref(pipelineId: string, gameSlug: string): string {
  // Pipelines route their games under a subpath; core lives at /daily/${slug}/.
  if (pipelineId === 'math') return `/daily/math/${gameSlug}/`;
  if (pipelineId === 'verbal') return `/daily/verbal/${gameSlug}/`;
  return `/daily/${gameSlug}/`;
}

export default function DailyHub({ pipelines, games }: Props) {
  const [dailyDate, setDailyDate] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [todayResults, setTodayResults] = useState<ReturnType<typeof getTodayResults>>(undefined);
  const [streaks, setStreaks] = useState<Record<string, number>>({});
  const [handle, setHandle] = useState<string>('');
  const [handleInput, setHandleInput] = useState<string>('');
  const [handleErr, setHandleErr] = useState<string | null>(null);
  const [anonName, setAnonName] = useState<string>('anon');
  const [editingHandle, setEditingHandle] = useState(false);

  useEffect(() => {
    const saved = loadHandle() ?? '';
    setHandle(saved);
    setHandleInput(saved);
    void getDeviceHash().then((h) => setAnonName(anonHandleFromHash(h)));
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = getDailyDate();
      setDailyDate(d);
      setCountdown(getSecondsUntilRollover());
      setTodayResults(getTodayResults(d));
      setStreaks(allActiveStreaks(loadHistory(), d));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  function saveHandleClick() {
    const v = validateHandle(handleInput);
    if (!v.ok) {
      setHandleErr(v.reason);
      return;
    }
    saveHandle(v.handle);
    setHandle(v.handle);
    setHandleErr(null);
    setEditingHandle(false);
  }

  if (!dailyDate) {
    return <div className="rounded border border-slate-200 p-4 text-sm text-slate-500">Loading today's puzzles…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Today's set</div>
          <div className="text-lg font-semibold text-slate-900">{dailyDate}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wide text-slate-500">Next rollover</div>
          <div className="font-mono text-sm text-slate-700">{formatCountdown(countdown)}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-slate-500">Leaderboard as</span>
          {editingHandle ? (
            <>
              <input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                className="rounded border border-slate-300 px-2 py-1 text-sm focus:border-brand-500 focus:outline-none"
                maxLength={24}
                placeholder="handle"
                autoFocus
              />
              <button
                onClick={saveHandleClick}
                className="rounded bg-brand-600 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-700"
              >
                Save
              </button>
              <button
                onClick={() => { setEditingHandle(false); setHandleInput(handle); setHandleErr(null); }}
                className="text-xs text-slate-500 hover:underline"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <span className="font-mono text-slate-900">{handle || anonName}</span>
              <button
                onClick={() => setEditingHandle(true)}
                className="text-xs text-brand-700 hover:underline"
              >
                {handle ? 'change' : 'pick one'}
              </button>
            </>
          )}
        </div>
        {handleErr && <span className="text-xs text-rose-700">{handleErr}</span>}
        {!handleErr && !editingHandle && (
          <span className="text-xs text-slate-500">No account. Handle saved only on this device.</span>
        )}
      </div>

      {pipelines.map((pipeline) => {
        const pipelineStreak = streaks[`pipeline:${pipeline.id}`] ?? 0;
        return (
          <section key={pipeline.id} aria-label={pipeline.label} className="rounded-lg border border-slate-200 p-4">
            <header className="mb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-semibold">{pipeline.label}</h2>
                <p className="text-sm text-slate-600">{pipeline.blurb}</p>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-wide text-slate-500">Pipeline streak</div>
                <div className="text-lg font-semibold text-brand-700">
                  {pipelineStreak} {pipelineStreak === 1 ? 'day' : 'days'}
                </div>
              </div>
            </header>

            <ul className="grid gap-3 sm:grid-cols-3">
              {pipeline.games.map((gid) => {
                const game = games.find((g) => g.id === gid);
                if (!game) return null;
                const result = todayResults?.games[gid];
                const badge = gameBadge(result);
                const streak = streaks[`game:${gid}`] ?? 0;
                return (
                  <li key={gid}>
                    <a
                      href={gameHref(pipeline.id, game.slug)}
                      className="block h-full rounded-md border border-slate-200 p-3 transition hover:border-brand-500 hover:bg-brand-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900">{game.name}</span>
                        <span
                          className={
                            badge.tone === 'cleared'
                              ? 'rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800'
                              : badge.tone === 'partial'
                              ? 'rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800'
                              : 'rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600'
                          }
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-slate-600">{game.blurb}</div>
                      <div className="mt-2 text-[11px] uppercase tracking-wide text-slate-500">
                        Streak: <span className="font-semibold text-slate-700">{streak}</span>
                      </div>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

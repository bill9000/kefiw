import { useEffect, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import { fetchLeaderboard, type LeaderboardRow } from '~/lib/daily-submit';
import { TIER_LABELS } from '~/lib/daily-hive-score';
import { loadHandle } from '~/lib/daily-state';
import { getDeviceHash, anonHandleFromHash } from '~/lib/daily-identity';

interface Props {
  gameId: 'hunt' | 'hive' | 'sudoku';
  limit?: number;
}

function formatTime(s: number | null): string {
  if (s === null) return '—';
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

function rowValue(gameId: Props['gameId'], r: LeaderboardRow): string {
  if (gameId === 'hunt') return r.guesses !== null ? `${r.guesses}/6` : '—';
  if (gameId === 'hive') {
    const tier = r.tier && TIER_LABELS[r.tier as keyof typeof TIER_LABELS];
    return `${r.points ?? 0} pts${tier ? ` · ${tier}` : ''}`;
  }
  return formatTime(r.time_sec);
}

export default function Leaderboard({ gameId, limit = 25 }: Props) {
  const [rows, setRows] = useState<LeaderboardRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [myHandle, setMyHandle] = useState<string>('');
  const [anonName, setAnonName] = useState<string>('');
  const [dailyDate, setDailyDate] = useState<string>('');

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    setMyHandle(loadHandle() ?? '');
    void getDeviceHash().then((h) => setAnonName(anonHandleFromHash(h)));
    fetchLeaderboard(d, gameId, limit)
      .then((data) => setRows(data))
      .catch((e) => setError(String(e)));
  }, [gameId, limit]);

  if (error) {
    return (
      <div className="rounded border border-rose-300 bg-rose-50 p-3 text-sm text-rose-800">
        Couldn't load leaderboard: {error}
      </div>
    );
  }

  if (rows === null) {
    return (
      <div className="rounded border border-slate-200 p-3 text-sm text-slate-500">
        Loading leaderboard…
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="rounded border border-slate-200 p-3 text-sm text-slate-600">
        No cleared results yet for {dailyDate}. Be the first.
      </div>
    );
  }

  const me = myHandle || anonName;

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <div className="text-sm font-semibold">Today's top {rows.length}</div>
        <div className="text-xs text-slate-500">{dailyDate}</div>
      </div>
      <ol className="divide-y divide-slate-100 text-sm">
        {rows.map((r, i) => {
          const rowHandle = r.handle || 'anon';
          const isMe = rowHandle === me;
          return (
            <li
              key={`${rowHandle}-${i}`}
              className={`flex items-center justify-between px-3 py-2 ${
                isMe ? 'bg-amber-50 font-semibold' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-6 text-right font-mono text-xs text-slate-500">
                  {i + 1}
                </span>
                <span className="font-mono">{rowHandle}</span>
                {isMe && (
                  <span className="rounded bg-amber-200 px-1.5 py-0.5 text-[10px] uppercase text-amber-900">
                    you
                  </span>
                )}
              </div>
              <div className="font-mono text-slate-700">{rowValue(gameId, r)}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

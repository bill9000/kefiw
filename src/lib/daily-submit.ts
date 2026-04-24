// Fire-and-forget leaderboard submission. Safe to call on every score
// update — failures are swallowed so the game never blocks on the network.
//
// Endpoint origin: same Worker that eats telemetry. If PUBLIC_WORKER_URL
// isn't set, submissions no-op (the games still work locally).

import type { GameResult } from './daily-scoring';
import { isCleared } from './daily-scoring';
import { getDeviceHash } from './daily-identity';
import { loadHandle } from './daily-state';

const WORKER_URL = (import.meta.env.PUBLIC_WORKER_URL as string | undefined) ?? '';

export async function submitDailyScore(
  dailyDate: string,
  result: GameResult
): Promise<void> {
  if (!WORKER_URL) return;
  try {
    const device_hash = await getDeviceHash();
    if (!device_hash) return;
    const handle = loadHandle() ?? null;
    const payload: Record<string, unknown> = {
      cleared: isCleared(result),
    };
    if (result.gameId === 'hunt') {
      payload.guesses = result.guesses;
    } else if (result.gameId === 'hive') {
      payload.points = result.points;
      payload.tier = result.tier;
    } else if (result.gameId === 'sudoku') {
      payload.time_sec = result.timeSec;
    }
    const body: Record<string, unknown> = {
      daily_date: dailyDate,
      game_id: result.gameId,
      device_hash,
      handle,
      ...payload,
    };
    await fetch(`${WORKER_URL}/daily/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Leaderboard is best-effort. Never interrupt local play.
  }
}

export async function submitDailyRun(
  dailyDate: string,
  pipelineId: string,
  cleared: boolean,
  streakDays: number
): Promise<void> {
  if (!WORKER_URL) return;
  try {
    const device_hash = await getDeviceHash();
    if (!device_hash) return;
    const handle = loadHandle() ?? null;
    await fetch(`${WORKER_URL}/daily/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        daily_date: dailyDate,
        pipeline_id: pipelineId,
        device_hash,
        handle,
        cleared,
        streak_days: streakDays,
      }),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}

export interface LeaderboardRow {
  handle: string | null;
  cleared: number;
  guesses: number | null;
  points: number | null;
  tier: string | null;
  time_sec: number | null;
  submitted_at: number;
}

export async function fetchLeaderboard(
  dailyDate: string,
  gameId: string,
  limit = 50
): Promise<LeaderboardRow[]> {
  if (!WORKER_URL) return [];
  try {
    const res = await fetch(
      `${WORKER_URL}/daily/leaderboard?date=${encodeURIComponent(dailyDate)}&game=${encodeURIComponent(gameId)}&limit=${limit}`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as { results?: LeaderboardRow[] };
    return data.results ?? [];
  } catch {
    return [];
  }
}

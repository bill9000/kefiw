// Cleared-predicates and streak math for Daily Kefiw.
//
// One source of truth for "did the user clear this game today?" Every other
// piece (streak tracker, leaderboard, SystemTray display, pipeline badge)
// reads from these helpers.
//
// Streak rules (locked 2026-04-20):
//   - Per-game streak: consecutive daily dates where game.cleared === true
//   - Pipeline streak: consecutive daily dates where EVERY game in the
//     pipeline was cleared that day
//   - Missing a day resets the streak to 0
//   - A day the user did not play at all also resets (no grace period)

import { isHiveCleared, type HiveTier } from './daily-hive-score';
import { getActivePipelines, getPipeline, type DailyPipeline } from '~/data/daily-pipelines';

export interface HuntResult {
  gameId: 'hunt';
  guesses: number;
  solved: boolean;
}

export interface HiveResult {
  gameId: 'hive';
  points: number;
  maxPoints: number;
  tier: HiveTier;
}

export interface SudokuResult {
  gameId: 'sudoku';
  solved: boolean;
  timeSec: number;
}

export type GameResult = HuntResult | HiveResult | SudokuResult;

export function isCleared(result: GameResult): boolean {
  switch (result.gameId) {
    case 'hunt':
      return result.solved;
    case 'hive':
      return isHiveCleared(result.tier);
    case 'sudoku':
      return result.solved;
  }
}

export interface DailyResults {
  dailyDate: string;
  games: Partial<Record<string, GameResult>>;
}

export function isPipelineClearedOn(
  day: DailyResults,
  pipeline: DailyPipeline
): boolean {
  for (const gameId of pipeline.games) {
    const result = day.games[gameId];
    if (!result || !isCleared(result)) return false;
  }
  return true;
}

export interface StreakHistory {
  [dailyDate: string]: DailyResults;
}

export function gameStreak(
  history: StreakHistory,
  gameId: string,
  today: string
): number {
  let streak = 0;
  let cursor = today;
  while (true) {
    const day = history[cursor];
    if (!day) break;
    const result = day.games[gameId];
    if (!result || !isCleared(result)) break;
    streak += 1;
    cursor = previousDay(cursor);
  }
  return streak;
}

export function pipelineStreak(
  history: StreakHistory,
  pipelineId: string,
  today: string
): number {
  const pipeline = getPipeline(pipelineId);
  if (!pipeline) return 0;
  let streak = 0;
  let cursor = today;
  while (true) {
    const day = history[cursor];
    if (!day) break;
    if (!isPipelineClearedOn(day, pipeline)) break;
    streak += 1;
    cursor = previousDay(cursor);
  }
  return streak;
}

export function allActiveStreaks(
  history: StreakHistory,
  today: string
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const pipeline of getActivePipelines()) {
    out[`pipeline:${pipeline.id}`] = pipelineStreak(history, pipeline.id, today);
    for (const gameId of pipeline.games) {
      const key = `game:${gameId}`;
      if (out[key] === undefined) {
        out[key] = gameStreak(history, gameId, today);
      }
    }
  }
  return out;
}

function previousDay(dailyDate: string): string {
  const [y, m, d] = dailyDate.split('-').map(Number);
  const prev = new Date(Date.UTC(y, m - 1, d - 1));
  return prev.toISOString().slice(0, 10);
}

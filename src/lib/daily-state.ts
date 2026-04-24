// LocalStorage helpers for today's game state + a rolling 60-day history.
//
// Storage shape (v1):
//   kfw.daily.v1 = {
//     history: { [dailyDate]: DailyResults },   // for streak math
//     progress: { [dailyDate]: ProgressByGame }, // in-flight UI state
//     handle?: string,                           // leaderboard display name
//   }
//
// Encryption + HMAC-signed score integrity is Φ7. For now: plain JSON.
// If you add fields, bump STORAGE_KEY and provide a migration.

import type { DailyResults, GameResult, StreakHistory } from './daily-scoring';

const STORAGE_KEY = 'kfw.daily.v1';
const HISTORY_WINDOW_DAYS = 60;

export interface HuntProgress {
  guesses: string[];
  finished: boolean;
}

export interface HiveProgress {
  foundWords: string[];
  points: number;
  finished: boolean;
}

export interface SudokuProgress {
  grid: number[];
  startedAt: number;
  finishedAt?: number;
  finished: boolean;
}

export type GameProgress = HuntProgress | HiveProgress | SudokuProgress;

interface ProgressByGame {
  [gameId: string]: GameProgress;
}

interface Store {
  history: StreakHistory;
  progress: Record<string, ProgressByGame>;
  handle?: string;
}

function emptyStore(): Store {
  return { history: {}, progress: {} };
}

function read(): Store {
  if (typeof localStorage === 'undefined') return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return emptyStore();
    return {
      history: parsed.history ?? {},
      progress: parsed.progress ?? {},
      handle: typeof parsed.handle === 'string' ? parsed.handle : undefined,
    };
  } catch {
    return emptyStore();
  }
}

function write(store: Store): void {
  if (typeof localStorage === 'undefined') return;
  pruneOldDays(store);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Quota exceeded or storage disabled — fail silent.
  }
}

function pruneOldDays(store: Store): void {
  const dates = Object.keys(store.history).sort();
  if (dates.length <= HISTORY_WINDOW_DAYS) return;
  const drop = dates.slice(0, dates.length - HISTORY_WINDOW_DAYS);
  for (const d of drop) {
    delete store.history[d];
    delete store.progress[d];
  }
}

export function loadHistory(): StreakHistory {
  return read().history;
}

export function loadHandle(): string | undefined {
  return read().handle;
}

export function saveHandle(handle: string): void {
  const store = read();
  store.handle = handle;
  write(store);
}

export function getProgress<T extends GameProgress>(
  dailyDate: string,
  gameId: string
): T | undefined {
  const store = read();
  return store.progress[dailyDate]?.[gameId] as T | undefined;
}

export function saveProgress(
  dailyDate: string,
  gameId: string,
  progress: GameProgress
): void {
  const store = read();
  if (!store.progress[dailyDate]) store.progress[dailyDate] = {};
  store.progress[dailyDate][gameId] = progress;
  write(store);
}

export function recordResult(
  dailyDate: string,
  result: GameResult
): DailyResults {
  const store = read();
  const day = store.history[dailyDate] ?? { dailyDate, games: {} };
  day.games[result.gameId] = result;
  store.history[dailyDate] = day;
  write(store);
  return day;
}

export function getTodayResults(dailyDate: string): DailyResults | undefined {
  return read().history[dailyDate];
}

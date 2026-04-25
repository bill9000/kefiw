// Daily pipeline config.
//
// A pipeline = an ordered list of game ids played together, counted as ONE
// combined streak. Reshuffle a pipeline by reordering its `games` array;
// swap a game by changing one id; retire a pipeline by setting active=false.
//
// Validation runs at module load — a pipeline referencing an unknown
// game id will throw, so broken configs fail fast at import time.

import { DAILY_GAMES } from './daily-games';

export interface DailyPipeline {
  id: string;
  label: string;
  blurb: string;
  games: string[];
  active: boolean;
}

export const DAILY_PIPELINES: DailyPipeline[] = [
  {
    id: 'core',
    label: 'Daily Kefiw',
    blurb: 'The core pipeline — one word, one letter, one grid.',
    games: ['hunt', 'hive', 'sudoku'],
    active: true,
  },
  {
    id: 'math',
    label: 'Kefiw Math',
    blurb: 'Five mental-math dashes. ~12 minutes. Trains arithmetic speed and proportional reasoning.',
    games: ['math-percent', 'math-discount', 'math-convert', 'math-tip', 'math-timedelta'],
    active: true,
  },
  {
    id: 'verbal',
    label: 'Kefiw Verbal',
    blurb: 'Five letter-and-word puzzles. One seeded puzzle per game. Trains working memory and letter-pattern recognition.',
    games: ['verbal-crypt', 'verbal-link', 'verbal-shift', 'verbal-crosser', 'verbal-twist'],
    active: true,
  },
  {
    id: 'spatial',
    label: 'Kefiw Spatial',
    blurb: 'Five visual-pattern dashes. Ten MCQ rounds per game. Trains spatial reasoning and visual pattern recognition.',
    games: ['spatial-circuit', 'spatial-drop', 'spatial-pair', 'spatial-hex', 'spatial-path'],
    active: true,
  },
];

export const PIPELINES_BY_ID: Record<string, DailyPipeline> = Object.fromEntries(
  DAILY_PIPELINES.map((p) => [p.id, p])
);

export function getPipeline(id: string): DailyPipeline | undefined {
  return PIPELINES_BY_ID[id];
}

export function getActivePipelines(): DailyPipeline[] {
  return DAILY_PIPELINES.filter((p) => p.active);
}

const validGameIds = new Set(DAILY_GAMES.map((g) => g.id));
for (const pipeline of DAILY_PIPELINES) {
  for (const gid of pipeline.games) {
    if (!validGameIds.has(gid)) {
      throw new Error(
        `[daily-pipelines] Pipeline "${pipeline.id}" references unknown game id "${gid}"`
      );
    }
  }
}

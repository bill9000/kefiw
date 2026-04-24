// Daily game registry.
//
// Each entry = ONE playable game that can appear in a pipeline.
// - Add a game: append an entry here.
// - Retire a game: remove the entry and any pipeline reference to its id.
//
// Game IDs are stable: they become part of the score key in the leaderboard,
// so do not reuse an id for a different game.

export type ScoreDirection = 'higher-is-better' | 'lower-is-better';
export type SeedKind = 'word-hunt' | 'letter-hive' | 'sudoku' | 'custom';

export interface DailyGame {
  id: string;
  name: string;
  slug: string;
  blurb: string;
  scoreDirection: ScoreDirection;
  maxScore: number;
  timeCapSec?: number;
  seedKind: SeedKind;
}

export const DAILY_GAMES: DailyGame[] = [
  {
    id: 'hunt',
    name: 'Five-Letter Hunt',
    slug: 'hunt',
    blurb: 'Crack the daily 5-letter word in six guesses.',
    scoreDirection: 'lower-is-better',
    maxScore: 6,
    seedKind: 'word-hunt',
  },
  {
    id: 'hive',
    name: 'Hive',
    slug: 'hive',
    blurb: 'Find every word using the seven daily letters. The center letter must appear.',
    scoreDirection: 'higher-is-better',
    maxScore: 100,
    seedKind: 'letter-hive',
  },
  {
    id: 'sudoku',
    name: 'Sudoku',
    slug: 'sudoku',
    blurb: 'Solve the daily 9×9 grid. Faster runs rank higher.',
    scoreDirection: 'lower-is-better',
    maxScore: 1800,
    timeCapSec: 1800,
    seedKind: 'sudoku',
  },
];

export const GAMES_BY_ID: Record<string, DailyGame> = Object.fromEntries(
  DAILY_GAMES.map((g) => [g.id, g])
);

export function getGame(id: string): DailyGame | undefined {
  return GAMES_BY_ID[id];
}

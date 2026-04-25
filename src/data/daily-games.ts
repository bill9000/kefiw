// Daily game registry.
//
// Each entry = ONE playable game that can appear in a pipeline.
// - Add a game: append an entry here.
// - Retire a game: remove the entry and any pipeline reference to its id.
//
// Game IDs are stable: they become part of the score key in the leaderboard,
// so do not reuse an id for a different game.

export type ScoreDirection = 'higher-is-better' | 'lower-is-better';
export type SeedKind = 'word-hunt' | 'letter-hive' | 'sudoku' | 'math-rounds' | 'verbal-puzzle' | 'spatial-rounds' | 'custom';

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
  // ---- Kefiw Math pipeline (10 rounds × 15s cap → 2.5 min per tool) --------
  {
    id: 'math-percent',
    name: 'Percent Dash',
    slug: 'percent',
    blurb: '10 quick "X% of Y" rounds. Tap the closest or type the exact.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'math-rounds',
  },
  {
    id: 'math-discount',
    name: 'Discount Duel',
    slug: 'discount',
    blurb: 'Stack coupons, cashback, and percent-offs. Guess the final price.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'math-rounds',
  },
  {
    id: 'math-convert',
    name: 'Convert Sprint',
    slug: 'convert',
    blurb: 'Miles to km, lbs to kg, °F to °C. Proportional reasoning, timed.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'math-rounds',
  },
  {
    id: 'math-tip',
    name: 'Tip Drill',
    slug: 'tip',
    blurb: 'Restaurant math at speed. 15%, 18%, 20% — what\'s the tip?',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'math-rounds',
  },
  {
    id: 'math-timedelta',
    name: 'Time Delta',
    slug: 'timedelta',
    blurb: 'Days between dates. Calendar math without counting on fingers.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'math-rounds',
  },
  // ---- Kefiw Verbal pipeline (1 puzzle per game, soft time penalty) --------
  {
    id: 'verbal-crypt',
    name: 'Cryptogram',
    slug: 'crypt',
    blurb: 'Decode today\'s substitution cipher. One letter at a time.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    seedKind: 'verbal-puzzle',
  },
  {
    id: 'verbal-link',
    name: 'Link Grid',
    slug: 'link',
    blurb: 'Group 16 tiles into 4 hidden categories. Four mistakes and it\'s over.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    seedKind: 'verbal-puzzle',
  },
  {
    id: 'verbal-shift',
    name: 'Letter Shift',
    slug: 'shift',
    blurb: 'Five columns of letters. Align them into real words.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    seedKind: 'verbal-puzzle',
  },
  {
    id: 'verbal-crosser',
    name: 'Mini Crosser',
    slug: 'crosser',
    blurb: 'Fill a small crossword from a handful of letters.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    seedKind: 'verbal-puzzle',
  },
  {
    id: 'verbal-twist',
    name: 'Word Twist',
    slug: 'twist',
    blurb: 'Find as many real words as you can from seven letters.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    seedKind: 'verbal-puzzle',
  },
  // ---- Kefiw Spatial pipeline (10 rounds × 15s cap → 2.5 min per tool) -----
  {
    id: 'spatial-circuit',
    name: 'Circuit Path',
    slug: 'circuit',
    blurb: 'Which cell completes the circuit? 10 quick pattern-recognition rounds.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'spatial-rounds',
  },
  {
    id: 'spatial-drop',
    name: 'Drop Stack',
    slug: 'drop',
    blurb: 'Which column has the lowest stack? Quick eye-measurement rounds.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'spatial-rounds',
  },
  {
    id: 'spatial-pair',
    name: 'Tile Pair',
    slug: 'pair',
    blurb: 'Match the target tile to its rotated twin. Mental-rotation practice.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'spatial-rounds',
  },
  {
    id: 'spatial-hex',
    name: 'Hex Fit',
    slug: 'hex',
    blurb: 'Which hex piece fits the gap? Shape-matching under time pressure.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'spatial-rounds',
  },
  {
    id: 'spatial-path',
    name: 'Path Length',
    slug: 'path',
    blurb: 'Which of four routes is shortest? Distance-estimation practice.',
    scoreDirection: 'higher-is-better',
    maxScore: 1500,
    timeCapSec: 150,
    seedKind: 'spatial-rounds',
  },
];

export const GAMES_BY_ID: Record<string, DailyGame> = Object.fromEntries(
  DAILY_GAMES.map((g) => [g.id, g])
);

export function getGame(id: string): DailyGame | undefined {
  return GAMES_BY_ID[id];
}

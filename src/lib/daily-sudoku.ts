// Seeded sudoku generator.
//
// Produces a (puzzle, solution) pair deterministically from a daily date.
// Strategy:
//   1. Start from the canonical solved grid (Latin-square shift pattern)
//   2. Shuffle digit identities, row-in-band, col-in-stack, bands, stacks
//      — all symmetry-preserving ops, so the result is still a valid sudoku
//   3. Blank out cells in seeded order to reach the target clue count
//
// Limitation: this does not enforce a unique solution. For CLUES_EASY=42 the
// puzzle is virtually always unique in practice, and we fold "hard" mode
// through a higher-blank-count pass which CAN occasionally produce ambiguity.
// If that turns out to matter, layer a solver + uniqueness check on top.

import { mulberry32, hashSeed, shuffleInPlace } from './daily-rng';

export type SudokuGrid = number[]; // length 81, 0 = blank, 1..9 = digit
export type Difficulty = 'easy' | 'medium' | 'hard';

const CLUES_BY_DIFFICULTY: Record<Difficulty, number> = {
  easy: 42,
  medium: 34,
  hard: 28,
};

export interface SudokuPuzzle {
  puzzle: SudokuGrid;
  solution: SudokuGrid;
  difficulty: Difficulty;
}

function canonicalGrid(): number[] {
  const g = new Array(81);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      g[r * 9 + c] = ((3 * r + Math.floor(r / 3) + c) % 9) + 1;
    }
  }
  return g;
}

function permuteDigits(g: number[], rng: () => number): void {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  shuffleInPlace(digits, rng);
  const map: Record<number, number> = {};
  for (let i = 0; i < 9; i++) map[i + 1] = digits[i];
  for (let i = 0; i < 81; i++) g[i] = map[g[i]];
}

function permuteRowsWithinBands(g: number[], rng: () => number): void {
  for (let band = 0; band < 3; band++) {
    const order = [0, 1, 2];
    shuffleInPlace(order, rng);
    const snap = g.slice();
    for (let i = 0; i < 3; i++) {
      for (let c = 0; c < 9; c++) {
        g[(band * 3 + i) * 9 + c] = snap[(band * 3 + order[i]) * 9 + c];
      }
    }
  }
}

function permuteColsWithinStacks(g: number[], rng: () => number): void {
  for (let stack = 0; stack < 3; stack++) {
    const order = [0, 1, 2];
    shuffleInPlace(order, rng);
    const snap = g.slice();
    for (let j = 0; j < 3; j++) {
      for (let r = 0; r < 9; r++) {
        g[r * 9 + stack * 3 + j] = snap[r * 9 + stack * 3 + order[j]];
      }
    }
  }
}

function permuteBands(g: number[], rng: () => number): void {
  const order = [0, 1, 2];
  shuffleInPlace(order, rng);
  const snap = g.slice();
  for (let b = 0; b < 3; b++) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 9; c++) {
        g[(b * 3 + r) * 9 + c] = snap[(order[b] * 3 + r) * 9 + c];
      }
    }
  }
}

function permuteStacks(g: number[], rng: () => number): void {
  const order = [0, 1, 2];
  shuffleInPlace(order, rng);
  const snap = g.slice();
  for (let s = 0; s < 3; s++) {
    for (let c = 0; c < 3; c++) {
      for (let r = 0; r < 9; r++) {
        g[r * 9 + s * 3 + c] = snap[r * 9 + order[s] * 3 + c];
      }
    }
  }
}

function transpose(g: number[]): void {
  const out = new Array(81);
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) out[c * 9 + r] = g[r * 9 + c];
  }
  for (let i = 0; i < 81; i++) g[i] = out[i];
}

export function generateSudoku(
  dailyDate: string,
  difficulty: Difficulty = 'easy'
): SudokuPuzzle {
  const rng = mulberry32(hashSeed(`${dailyDate}::sudoku::${difficulty}`));
  const g = canonicalGrid();

  permuteDigits(g, rng);
  permuteRowsWithinBands(g, rng);
  permuteColsWithinStacks(g, rng);
  permuteBands(g, rng);
  permuteStacks(g, rng);
  if (rng() < 0.5) transpose(g);

  const solution = g.slice();

  const cellsToRemove = 81 - CLUES_BY_DIFFICULTY[difficulty];
  const positions = Array.from({ length: 81 }, (_, i) => i);
  shuffleInPlace(positions, rng);
  const puzzle = g.slice();
  for (let i = 0; i < cellsToRemove; i++) puzzle[positions[i]] = 0;

  return { puzzle, solution, difficulty };
}

export function isValidMove(grid: SudokuGrid, idx: number, digit: number): boolean {
  if (digit < 1 || digit > 9) return false;
  const row = Math.floor(idx / 9);
  const col = idx % 9;
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row * 9 + c] === digit) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r * 9 + col] === digit) return false;
  }
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++) {
    for (let c = bc; c < bc + 3; c++) {
      const i = r * 9 + c;
      if (i !== idx && grid[i] === digit) return false;
    }
  }
  return true;
}

export function isSolved(grid: SudokuGrid, solution: SudokuGrid): boolean {
  for (let i = 0; i < 81; i++) {
    if (grid[i] !== solution[i]) return false;
  }
  return true;
}

// Weekday difficulty rotation (0=Sun, 1=Mon, ..., 6=Sat).
// Sun/Mon → easy, Tue/Wed/Thu → medium, Fri/Sat → hard.
export function difficultyForDailyDate(dailyDate: string): Difficulty {
  const [y, m, d] = dailyDate.split('-').map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  if (dow === 0 || dow === 1) return 'easy';
  if (dow >= 2 && dow <= 4) return 'medium';
  return 'hard';
}

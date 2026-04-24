// Seeded round generators for Kefiw Math pipeline games.
//
// Pure functions of (dailyDate, gameId). Same day + same game = same 10
// rounds for every player. No server round-trip, no curated data file.
//
// Each round has:
//   - prompt     — human-readable question ("What is 23% of 480?")
//   - correct    — the true numeric answer (may have decimals)
//   - choices    — 5 MCQ buttons spread around the correct value
//   - unit       — optional suffix for display ("°C", "km", "$", "days")
//   - decimals   — how many decimal places matter (rounding for typed answers)
//
// Scoring lives in daily-math-score.ts; this file only generates rounds.

import { rngFor, pickInt, shuffleInPlace } from './daily-rng';

export interface MathRound {
  prompt: string;
  correct: number;
  choices: number[];
  unit?: string;
  decimals: number;
}

export const ROUNDS_PER_GAME = 10;
export const ROUND_TIME_SEC = 15;
export const SESSION_TIME_SEC = 150;

// ---------------------------------------------------------------------------
// Distractor generator — shared across all five games.
// Spreads 4 distractors around `correct` at roughly ±10%, ±25%, ±50%, ±100%
// using signed offsets, then shuffles all 5 choices.
// ---------------------------------------------------------------------------

function makeChoices(correct: number, decimals: number, rng: () => number): number[] {
  const magnitudes = [0.10, 0.25, 0.50, 1.00];
  const distractors: number[] = [];
  for (const m of magnitudes) {
    const sign = rng() < 0.5 ? -1 : 1;
    const jitter = 1 + (rng() - 0.5) * 0.1; // ±5% wiggle so distractors don't look identical
    const raw = correct * (1 + sign * m * jitter);
    distractors.push(round(raw, decimals));
  }
  const seen = new Set<number>([correct]);
  const unique: number[] = [];
  for (const d of distractors) {
    if (!seen.has(d) && d !== 0) {
      seen.add(d);
      unique.push(d);
    }
  }
  // If collisions reduced below 4, fill with wider spreads
  let spread = 1.5;
  while (unique.length < 4) {
    const sign = rng() < 0.5 ? -1 : 1;
    const candidate = round(correct * (1 + sign * spread), decimals);
    if (!seen.has(candidate) && candidate !== 0) {
      seen.add(candidate);
      unique.push(candidate);
    }
    spread += 0.25;
    if (spread > 5) break; // safety
  }
  const choices = [correct, ...unique.slice(0, 4)];
  shuffleInPlace(choices, rng);
  return choices;
}

function round(n: number, decimals: number): number {
  const k = Math.pow(10, decimals);
  return Math.round(n * k) / k;
}

// ---------------------------------------------------------------------------
// 1. Percent Dash — "What is X% of Y?"
// ---------------------------------------------------------------------------

function percentRound(rng: () => number): MathRound {
  // X in {5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90}
  const pcts = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 90];
  const pct = pcts[pickInt(rng, 0, pcts.length)];
  // Y in 50..1000 in steps of 10
  const y = pickInt(rng, 5, 101) * 10;
  const correct = round((pct * y) / 100, 2);
  return {
    prompt: `What is ${pct}% of ${y}?`,
    correct,
    choices: makeChoices(correct, 2, rng),
    decimals: 2,
  };
}

// ---------------------------------------------------------------------------
// 2. Discount Duel — stack two discounts and guess the final price.
// ---------------------------------------------------------------------------

function discountRound(rng: () => number): MathRound {
  const original = pickInt(rng, 30, 500);
  const d1 = [10, 15, 20, 25, 30, 40, 50][pickInt(rng, 0, 7)];
  const d2 = [5, 10, 15, 20, 25][pickInt(rng, 0, 5)];
  const correct = round(original * (1 - d1 / 100) * (1 - d2 / 100), 2);
  return {
    prompt: `$${original} item, ${d1}% off then ${d2}% coupon. Final price?`,
    correct,
    choices: makeChoices(correct, 2, rng),
    unit: '$',
    decimals: 2,
  };
}

// ---------------------------------------------------------------------------
// 3. Convert Sprint — unit conversions across five domains.
// ---------------------------------------------------------------------------

type ConversionKind =
  | 'mi-km'
  | 'km-mi'
  | 'lb-kg'
  | 'kg-lb'
  | 'f-c'
  | 'c-f'
  | 'ft-m'
  | 'm-ft';

function convertRound(rng: () => number): MathRound {
  const kinds: ConversionKind[] = ['mi-km', 'km-mi', 'lb-kg', 'kg-lb', 'f-c', 'c-f', 'ft-m', 'm-ft'];
  const kind = kinds[pickInt(rng, 0, kinds.length)];
  switch (kind) {
    case 'mi-km': {
      const x = pickInt(rng, 5, 100);
      const correct = round(x * 1.609, 1);
      return { prompt: `${x} miles in km?`, correct, choices: makeChoices(correct, 1, rng), unit: 'km', decimals: 1 };
    }
    case 'km-mi': {
      const x = pickInt(rng, 5, 150);
      const correct = round(x / 1.609, 1);
      return { prompt: `${x} km in miles?`, correct, choices: makeChoices(correct, 1, rng), unit: 'mi', decimals: 1 };
    }
    case 'lb-kg': {
      const x = pickInt(rng, 5, 250);
      const correct = round(x * 0.4536, 1);
      return { prompt: `${x} lb in kg?`, correct, choices: makeChoices(correct, 1, rng), unit: 'kg', decimals: 1 };
    }
    case 'kg-lb': {
      const x = pickInt(rng, 5, 120);
      const correct = round(x / 0.4536, 1);
      return { prompt: `${x} kg in lb?`, correct, choices: makeChoices(correct, 1, rng), unit: 'lb', decimals: 1 };
    }
    case 'f-c': {
      const x = pickInt(rng, 0, 110);
      const correct = round((x - 32) * (5 / 9), 1);
      return { prompt: `${x}°F in °C?`, correct, choices: makeChoices(correct, 1, rng), unit: '°C', decimals: 1 };
    }
    case 'c-f': {
      const x = pickInt(rng, -10, 45);
      const correct = round(x * (9 / 5) + 32, 1);
      return { prompt: `${x}°C in °F?`, correct, choices: makeChoices(correct, 1, rng), unit: '°F', decimals: 1 };
    }
    case 'ft-m': {
      const x = pickInt(rng, 3, 100);
      const correct = round(x * 0.3048, 1);
      return { prompt: `${x} ft in meters?`, correct, choices: makeChoices(correct, 1, rng), unit: 'm', decimals: 1 };
    }
    case 'm-ft': {
      const x = pickInt(rng, 2, 50);
      const correct = round(x / 0.3048, 1);
      return { prompt: `${x} m in ft?`, correct, choices: makeChoices(correct, 1, rng), unit: 'ft', decimals: 1 };
    }
  }
}

// ---------------------------------------------------------------------------
// 4. Tip Drill — restaurant tip math.
// ---------------------------------------------------------------------------

function tipRound(rng: () => number): MathRound {
  const bill = pickInt(rng, 12, 160);
  const pct = [15, 18, 20, 22, 25][pickInt(rng, 0, 5)];
  // Alternate between "what's the tip?" and "what's the total with tip?"
  const totalMode = rng() < 0.5;
  if (totalMode) {
    const correct = round(bill * (1 + pct / 100), 2);
    return {
      prompt: `$${bill} bill, add a ${pct}% tip. Total?`,
      correct,
      choices: makeChoices(correct, 2, rng),
      unit: '$',
      decimals: 2,
    };
  }
  const correct = round((bill * pct) / 100, 2);
  return {
    prompt: `$${bill} bill. ${pct}% tip?`,
    correct,
    choices: makeChoices(correct, 2, rng),
    unit: '$',
    decimals: 2,
  };
}

// ---------------------------------------------------------------------------
// 5. Time Delta — days between two dates.
// ---------------------------------------------------------------------------

const MS_PER_DAY = 86_400_000;

function addDays(base: Date, days: number): Date {
  return new Date(base.getTime() + days * MS_PER_DAY);
}

function fmtDate(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function timeDeltaRound(rng: () => number): MathRound {
  // Anchor date: Jan 1 of a random year in 2020..2027
  const year = pickInt(rng, 2020, 2028);
  const anchor = new Date(Date.UTC(year, 0, 1));
  const a = addDays(anchor, pickInt(rng, 0, 200));
  const gap = pickInt(rng, 7, 365); // 1 week to 1 year
  const b = addDays(a, gap);
  const correct = gap;
  return {
    prompt: `Days between ${fmtDate(a)} and ${fmtDate(b)}?`,
    correct,
    choices: makeChoices(correct, 0, rng),
    unit: 'days',
    decimals: 0,
  };
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

const GENERATORS: Record<string, (rng: () => number) => MathRound> = {
  'math-percent': percentRound,
  'math-discount': discountRound,
  'math-convert': convertRound,
  'math-tip': tipRound,
  'math-timedelta': timeDeltaRound,
};

export function generateMathRounds(dailyDate: string, gameId: string): MathRound[] {
  const gen = GENERATORS[gameId];
  if (!gen) return [];
  const rng = rngFor(dailyDate, gameId);
  const rounds: MathRound[] = [];
  for (let i = 0; i < ROUNDS_PER_GAME; i++) {
    rounds.push(gen(rng));
  }
  return rounds;
}

// ---------------------------------------------------------------------------
// Scoring — accuracy + speed multiplier.
//
//   accuracy (MCQ)   : 80 / 60 / 40 / 20 / 0 by closeness bucket
//   accuracy (typed) : 100 − 2×%error, clamped [0, 100]
//   speed multiplier : 1.0 + (timeRemaining / roundTimeSec) × 0.5
//                      instant = ×1.5, used-all-time = ×1.0, timed-out = 0
//   final per round  : accuracy × speedMultiplier
//
// Max MCQ round = 80 × 1.5 = 120
// Max typed round = 100 × 1.5 = 150
// ---------------------------------------------------------------------------

export type RoundEntryMode = 'mcq' | 'typed';

export function scoreMcq(guess: number, correct: number): number {
  if (correct === 0) {
    return guess === 0 ? 80 : 0;
  }
  const err = Math.abs(guess - correct) / Math.abs(correct);
  if (err <= 0.05) return 80;
  if (err <= 0.25) return 60;
  if (err <= 0.50) return 40;
  if (err <= 1.00) return 20;
  return 0;
}

export function scoreTyped(guess: number, correct: number): number {
  if (correct === 0) {
    return guess === 0 ? 100 : 0;
  }
  const err = Math.abs(guess - correct) / Math.abs(correct);
  return Math.max(0, Math.round(100 - 200 * err));
}

export function speedMultiplier(timeUsedSec: number, capSec: number): number {
  if (timeUsedSec >= capSec) return 0;
  const remaining = Math.max(0, capSec - timeUsedSec);
  return 1.0 + (remaining / capSec) * 0.5;
}

export function roundScore(
  mode: RoundEntryMode,
  guess: number,
  correct: number,
  timeUsedSec: number,
  capSec: number = ROUND_TIME_SEC
): number {
  const accuracy = mode === 'mcq' ? scoreMcq(guess, correct) : scoreTyped(guess, correct);
  return Math.round(accuracy * speedMultiplier(timeUsedSec, capSec));
}

// Math game cleared when the user completes all 10 rounds *and* beats a low
// threshold — a grind-through-random-taps floor. Keeps streaks honest.
export const MATH_CLEAR_THRESHOLD = 300; // 20% of max 1500

export function isMathCleared(totalScore: number, roundsCompleted: number): boolean {
  return roundsCompleted >= ROUNDS_PER_GAME && totalScore >= MATH_CLEAR_THRESHOLD;
}

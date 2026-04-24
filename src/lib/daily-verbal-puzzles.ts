// Deterministic picker for the Kefiw Verbal pipeline. Every player on day N
// gets the exact same puzzle per game.
//
// Also contains the shared scoring function — soft time penalty (no hard cap):
//   finalScore = accuracyFraction × 1000 × timeMultiplier
//   timeMultiplier:
//     - at or below baseline:  1.5
//     - at 2× baseline:        1.0
//     - at 3× baseline:        0.5
//     - at 4× baseline:        0.3 (floor)
//
// Max per game = 1500 (parity with Math pipeline).

import { rngFor, shuffleInPlace } from './daily-rng';
import {
  CRYPT_QUOTES,
  LINK_PUZZLES,
  SHIFT_LEVELS,
  CROSSER_PUZZLES,
  TWIST_SEEDS,
  type CryptQuote,
  type LinkPuzzleDef,
  type ShiftLevel,
  type CrosserPuzzleDef,
} from '~/data/daily-verbal-pool';

// ---------------------------------------------------------------------------
// Puzzle types (what each component receives)
// ---------------------------------------------------------------------------

export interface CryptPuzzle {
  gameId: 'verbal-crypt';
  plaintext: string;             // original quote, uppercase
  author: string;
  ciphertext: string;            // after substitution
  mapping: Record<string, string>; // plaintext letter -> cipher letter
  baselineSec: number;           // competent-solver target time
}

export interface LinkPuzzle {
  gameId: 'verbal-link';
  title: string;
  // Full category data (used for marking solutions). The 16 tiles are shuffled
  // for display; the component can re-shuffle deterministically from the seed.
  categories: LinkPuzzleDef['categories'];
  tiles: { label: string; categoryKey: string }[];
  baselineSec: number;
}

export interface ShiftPuzzle {
  gameId: 'verbal-shift';
  name: string;
  columns: string[][];
  words: string[];
  baselineSec: number;
}

export interface CrosserPuzzle extends CrosserPuzzleDef {
  gameId: 'verbal-crosser';
  baselineSec: number;
}

export interface TwistPuzzle {
  gameId: 'verbal-twist';
  letters: string;   // 7 letters, uppercase
  baselineSec: number;
  // `validWords` is built client-side from the dictionary so we do not ship it
  // in the puzzle payload. The component loads daily-dict and filters.
}

export type VerbalPuzzle =
  | CryptPuzzle
  | LinkPuzzle
  | ShiftPuzzle
  | CrosserPuzzle
  | TwistPuzzle;

// ---------------------------------------------------------------------------
// Baselines (seconds) — tuned for a competent solver
// ---------------------------------------------------------------------------
const BASELINE_SEC: Record<string, number> = {
  'verbal-crypt': 240,
  'verbal-link': 180,
  'verbal-shift': 120,
  'verbal-crosser': 150,
  'verbal-twist': 180,
};

// ---------------------------------------------------------------------------
// Cryptogram — pick a quote and a permutation of A..Z
// ---------------------------------------------------------------------------

function buildCryptPuzzle(rng: () => number): CryptPuzzle {
  const q = CRYPT_QUOTES[Math.floor(rng() * CRYPT_QUOTES.length)] as CryptQuote;
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  // Fisher-Yates until no letter maps to itself (to ensure a real substitution)
  let shuffled = alphabet.slice();
  for (let attempts = 0; attempts < 10; attempts++) {
    shuffled = alphabet.slice();
    shuffleInPlace(shuffled, rng);
    let anyFixed = false;
    for (let i = 0; i < 26; i++) if (shuffled[i] === alphabet[i]) { anyFixed = true; break; }
    if (!anyFixed) break;
  }
  const mapping: Record<string, string> = {};
  alphabet.forEach((ch, i) => { mapping[ch] = shuffled[i]; });
  const ciphertext = (q.text + ' — ' + q.author)
    .split('')
    .map((ch) => (mapping[ch] ? mapping[ch] : ch))
    .join('');
  return {
    gameId: 'verbal-crypt',
    plaintext: q.text,
    author: q.author,
    ciphertext,
    mapping,
    baselineSec: BASELINE_SEC['verbal-crypt'],
  };
}

// ---------------------------------------------------------------------------
// Link — pick a puzzle and shuffle its 16 tiles
// ---------------------------------------------------------------------------

function buildLinkPuzzle(rng: () => number): LinkPuzzle {
  const p = LINK_PUZZLES[Math.floor(rng() * LINK_PUZZLES.length)];
  const tiles = p.categories.flatMap((cat) =>
    cat.items.map((label) => ({ label, categoryKey: cat.key }))
  );
  shuffleInPlace(tiles, rng);
  return {
    gameId: 'verbal-link',
    title: p.title,
    categories: p.categories,
    tiles,
    baselineSec: BASELINE_SEC['verbal-link'],
  };
}

// ---------------------------------------------------------------------------
// Letter shift — pick a level from the pool
// ---------------------------------------------------------------------------

function buildShiftPuzzle(rng: () => number): ShiftPuzzle {
  const l = SHIFT_LEVELS[Math.floor(rng() * SHIFT_LEVELS.length)] as ShiftLevel;
  return {
    gameId: 'verbal-shift',
    name: l.name,
    columns: l.columns.map((c) => c.slice()),
    words: l.words.slice(),
    baselineSec: BASELINE_SEC['verbal-shift'],
  };
}

// ---------------------------------------------------------------------------
// Mini crossword — pick a puzzle
// ---------------------------------------------------------------------------

function buildCrosserPuzzle(rng: () => number): CrosserPuzzle {
  const p = CROSSER_PUZZLES[Math.floor(rng() * CROSSER_PUZZLES.length)] as CrosserPuzzleDef;
  return { ...p, gameId: 'verbal-crosser', baselineSec: BASELINE_SEC['verbal-crosser'] };
}

// ---------------------------------------------------------------------------
// Twist — pick 7-letter seed
// ---------------------------------------------------------------------------

function buildTwistPuzzle(rng: () => number): TwistPuzzle {
  const letters = TWIST_SEEDS[Math.floor(rng() * TWIST_SEEDS.length)];
  return { gameId: 'verbal-twist', letters, baselineSec: BASELINE_SEC['verbal-twist'] };
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export function getVerbalPuzzle(dailyDate: string, gameId: string): VerbalPuzzle | null {
  const rng = rngFor(dailyDate, gameId);
  switch (gameId) {
    case 'verbal-crypt': return buildCryptPuzzle(rng);
    case 'verbal-link': return buildLinkPuzzle(rng);
    case 'verbal-shift': return buildShiftPuzzle(rng);
    case 'verbal-crosser': return buildCrosserPuzzle(rng);
    case 'verbal-twist': return buildTwistPuzzle(rng);
    default: return null;
  }
}

// ---------------------------------------------------------------------------
// Scoring — shared across all five verbal games.
// ---------------------------------------------------------------------------

export function verbalTimeMultiplier(timeUsedSec: number, baselineSec: number): number {
  if (timeUsedSec <= baselineSec) return 1.5;
  const ratio = timeUsedSec / baselineSec;
  // Linear decay from 1.5 at ratio=1 down to 0.3 floor.
  // 0.5 × (ratio − 1) keeps the knee at ratio=2 (→ 1.0).
  return Math.max(0.3, 1.5 - 0.5 * (ratio - 1));
}

// accuracy: fraction in [0, 1].  timeUsedSec: total solve time.
export function verbalScore(
  accuracy: number,
  timeUsedSec: number,
  baselineSec: number
): number {
  const clamped = Math.max(0, Math.min(1, accuracy));
  const base = clamped * 1000;
  const mult = verbalTimeMultiplier(timeUsedSec, baselineSec);
  return Math.round(base * mult);
}

// Verbal "cleared" threshold: 450 / 1500 (30%). Rewards a real attempt
// without letting a zero-accuracy grind count toward the streak.
export const VERBAL_CLEAR_THRESHOLD = 450;

export function isVerbalCleared(score: number): boolean {
  return score >= VERBAL_CLEAR_THRESHOLD;
}

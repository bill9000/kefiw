// NYT Spelling Bee scoring, reimplemented for Hive:
//   - Words must be ≥4 letters
//   - Must contain the center letter
//   - May only use letters in the set (center + 6 outer)
//   - 4-letter word = 1 point
//   - 5+ letter word = length - 3 points
//   - Pangram (uses all 7 letters) = base points + 7 bonus
//
// Tier thresholds follow the public NYT progression (Beginner → Queen Bee).
// Queen Bee = found every valid word.
//
// `isValidHiveWord` treats the dictionary as the source of truth for what
// counts as a word. Kefiw's dict lives in public/data/enable.txt (~172k
// entries) — pass that parsed into a Set to this module at runtime.

import type { HiveSet } from '~/data/daily-hive-sets';

export type HiveTier =
  | 'beginner'
  | 'goodStart'
  | 'movingUp'
  | 'good'
  | 'solid'
  | 'nice'
  | 'great'
  | 'amazing'
  | 'genius'
  | 'queenBee';

const TIER_FRACTIONS: Record<HiveTier, number> = {
  beginner: 0,
  goodStart: 0.02,
  movingUp: 0.05,
  good: 0.08,
  solid: 0.15,
  nice: 0.25,
  great: 0.4,
  amazing: 0.5,
  genius: 0.7,
  queenBee: 1.0,
};

export const TIER_LABELS: Record<HiveTier, string> = {
  beginner: 'Beginner',
  goodStart: 'Good Start',
  movingUp: 'Moving Up',
  good: 'Good',
  solid: 'Solid',
  nice: 'Nice',
  great: 'Great',
  amazing: 'Amazing',
  genius: 'Genius',
  queenBee: 'Queen Bee',
};

export const CLEARED_TIER: HiveTier = 'good';

export function isPangram(word: string, set: HiveSet): boolean {
  const letters = new Set(word.toUpperCase());
  for (const letter of [set.center, ...set.outer]) {
    if (!letters.has(letter)) return false;
  }
  return true;
}

export function wordPoints(word: string, set: HiveSet): number {
  const len = word.length;
  const base = len === 4 ? 1 : len - 3;
  return base + (isPangram(word, set) ? 7 : 0);
}

export function isValidHiveWord(
  word: string,
  set: HiveSet,
  dictionary: Set<string>
): boolean {
  const w = word.toUpperCase();
  if (w.length < 4) return false;
  if (!w.includes(set.center)) return false;
  const allowed = new Set([set.center, ...set.outer]);
  for (const ch of w) {
    if (!allowed.has(ch)) return false;
  }
  return dictionary.has(w.toLowerCase()) || dictionary.has(w);
}

export function allValidWords(set: HiveSet, dictionary: Iterable<string>): string[] {
  const out: string[] = [];
  const allowed = new Set([set.center, ...set.outer]);
  for (const raw of dictionary) {
    const upper = raw.toUpperCase();
    if (upper.length < 4) continue;
    if (!upper.includes(set.center)) continue;
    let ok = true;
    for (const ch of upper) {
      if (!allowed.has(ch)) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(upper);
  }
  return out;
}

export function maxPoints(set: HiveSet, dictionary: Iterable<string>): number {
  let total = 0;
  for (const word of allValidWords(set, dictionary)) {
    total += wordPoints(word, set);
  }
  return total;
}

export function tierForScore(points: number, maxPointsValue: number): HiveTier {
  if (maxPointsValue <= 0) return 'beginner';
  const frac = points / maxPointsValue;
  const order: HiveTier[] = [
    'queenBee',
    'genius',
    'amazing',
    'great',
    'nice',
    'solid',
    'good',
    'movingUp',
    'goodStart',
    'beginner',
  ];
  for (const tier of order) {
    if (frac >= TIER_FRACTIONS[tier]) return tier;
  }
  return 'beginner';
}

export function isHiveCleared(tier: HiveTier): boolean {
  const order: HiveTier[] = [
    'beginner',
    'goodStart',
    'movingUp',
    'good',
    'solid',
    'nice',
    'great',
    'amazing',
    'genius',
    'queenBee',
  ];
  return order.indexOf(tier) >= order.indexOf(CLEARED_TIER);
}

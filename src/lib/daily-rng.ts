// Seeded RNG for Daily Kefiw. Deterministic from (dailyDate, gameId) so
// every player gets the exact same puzzle on the exact same day.
//
// - hashSeed: FNV-1a 32-bit, turns a string into a seed
// - mulberry32: fast, tiny PRNG with good-enough distribution
// - rngFor(date, gameId): canonical entry point

export function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rngFor(dailyDate: string, gameId: string): () => number {
  return mulberry32(hashSeed(`${dailyDate}::${gameId}`));
}

export function shuffleInPlace<T>(arr: T[], rng: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function pickInt(rng: () => number, min: number, maxExclusive: number): number {
  return min + Math.floor(rng() * (maxExclusive - min));
}

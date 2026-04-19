import fs from 'node:fs';
import path from 'node:path';

let cache: string[] | null = null;

function load(): string[] {
  if (cache) return cache;
  const p = path.resolve(process.cwd(), 'public/data/enable.txt');
  const txt = fs.readFileSync(p, 'utf8');
  cache = txt
    .split(/\r?\n/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 0 && /^[a-z]+$/.test(w));
  return cache;
}

export function allWords(): string[] {
  return load();
}

export function wordsStartingWith(letter: string, length: number): string[] {
  const L = letter.toLowerCase();
  return load()
    .filter((w) => w.length === length && w.startsWith(L))
    .sort();
}

export function wordsEndingWith(suffix: string, length: number | null): string[] {
  const S = suffix.toLowerCase();
  return load()
    .filter((w) => w.endsWith(S) && (length == null || w.length === length))
    .sort();
}

export function wordsOfLength(length: number): string[] {
  return load()
    .filter((w) => w.length === length)
    .sort();
}

export function wordsContainingLetter(letter: string, minLen = 2, maxLen = 15): string[] {
  const L = letter.toLowerCase();
  return load()
    .filter((w) => w.length >= minLen && w.length <= maxLen && w.includes(L))
    .sort();
}

export function wordsContainingLetterAt(letter: string, length: number): string[] {
  const L = letter.toLowerCase();
  return load()
    .filter((w) => w.length === length && w.includes(L))
    .sort();
}

export function wordsStartingWithPrefix(prefix: string, minLen = 0, maxLen = 99): string[] {
  const P = prefix.toLowerCase();
  return load()
    .filter((w) => w.startsWith(P) && w.length >= Math.max(minLen, P.length + 1) && w.length <= maxLen)
    .sort();
}

export function wordsEndingWithSuffix(suffix: string, minLen = 0, maxLen = 99): string[] {
  const S = suffix.toLowerCase();
  return load()
    .filter((w) => w.endsWith(S) && w.length >= Math.max(minLen, S.length + 1) && w.length <= maxLen)
    .sort();
}

export function wordsWithQNoU(): string[] {
  return load()
    .filter((w) => {
      if (!w.includes('q')) return false;
      for (let i = 0; i < w.length; i++) {
        if (w[i] === 'q' && w[i + 1] === 'u') return false;
      }
      return true;
    })
    .sort();
}

export function wordsWithDoubleLetters(minLen = 3, maxLen = 8): string[] {
  return load()
    .filter((w) => {
      if (w.length < minLen || w.length > maxLen) return false;
      for (let i = 1; i < w.length; i++) {
        if (w[i] === w[i - 1]) return true;
      }
      return false;
    })
    .sort();
}

export function wordsWithNoVowels(minLen = 2, maxLen = 8): string[] {
  return load()
    .filter((w) => w.length >= minLen && w.length <= maxLen && !/[aeiou]/.test(w))
    .sort();
}

export function wordsWithAllFiveVowels(): string[] {
  return load()
    .filter((w) => /a/.test(w) && /e/.test(w) && /i/.test(w) && /o/.test(w) && /u/.test(w))
    .sort();
}

const SCRABBLE_SCORES: Record<string, number> = {
  a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8,
  k: 5, l: 1, m: 3, n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1,
  u: 1, v: 4, w: 4, x: 8, y: 4, z: 10,
};

export function scrabbleScore(word: string): number {
  let s = 0;
  for (const c of word) s += SCRABBLE_SCORES[c] ?? 0;
  return s;
}

export function highestScoringWords(opts: { minLen?: number; maxLen?: number; topN?: number } = {}): string[] {
  const { minLen = 5, maxLen = 8, topN = 500 } = opts;
  return load()
    .filter((w) => w.length >= minLen && w.length <= maxLen)
    .map((w) => ({ w, s: scrabbleScore(w) }))
    .sort((a, b) => b.s - a.s || a.w.localeCompare(b.w))
    .slice(0, topN)
    .map((x) => x.w);
}

export function shortHighScoringScrabbleWords(): string[] {
  return load()
    .filter((w) => w.length === 2 || w.length === 3)
    .map((w) => ({ w, s: scrabbleScore(w) }))
    .filter((x) => x.s >= 8)
    .sort((a, b) => b.s - a.s || a.w.localeCompare(b.w))
    .map((x) => x.w);
}

export function wordsContainingSubstring(sub: string, minLen = 0, maxLen = 99): string[] {
  const S = sub.toLowerCase();
  return load()
    .filter((w) => w.includes(S) && w.length >= Math.max(minLen, S.length) && w.length <= maxLen)
    .sort();
}

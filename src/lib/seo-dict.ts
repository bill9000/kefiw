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

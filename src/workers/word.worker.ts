import { SCRABBLE_VALUES, WWF_VALUES, canMakeFromRack, matchesPattern, rackFitDetails, sortedLetters, wordScore } from '../lib/dict';

let WORDS: string[] | null = null;
let BY_LEN: Map<number, string[]> | null = null;
let BY_SORTED: Map<string, string[]> | null = null;
let ENABLE_WORDS: string[] | null = null;
let ENABLE_BY_LEN: Map<number, string[]> | null = null;
let ENABLE_BY_SORTED: Map<string, string[]> | null = null;
let dictPromise: Promise<string[]> | null = null;
let enablePromise: Promise<string[]> | null = null;

type DictSource = 'fast' | 'full';

async function loadDict(): Promise<string[]> {
  if (WORDS) return WORDS;
  if (dictPromise) return dictPromise;
  dictPromise = (async () => {
    const res = await fetch('/data/dict.txt');
    if (!res.ok) throw new Error(`Dictionary fetch failed: ${res.status}`);
    const text = await res.text();
    WORDS = text.split(/\r?\n/).map((w) => w.trim().toLowerCase()).filter((w) => w.length > 0);
    return WORDS;
  })();
  return dictPromise;
}

async function loadEnable(): Promise<string[]> {
  if (ENABLE_WORDS) return ENABLE_WORDS;
  if (enablePromise) return enablePromise;
  enablePromise = (async () => {
    const res = await fetch('/data/enable.txt');
    if (!res.ok) throw new Error(`ENABLE fetch failed: ${res.status}`);
    const text = await res.text();
    const words = text.split(/\r?\n/).map((w) => w.trim().toLowerCase()).filter((w) => w.length > 0);
    ENABLE_WORDS = words;
    return words;
  })();
  return enablePromise;
}

async function loadFor(source: DictSource): Promise<string[]> {
  return source === 'fast' ? loadEnable() : loadDict();
}

function byLen(source: DictSource): Map<number, string[]> {
  if (source === 'fast') {
    if (ENABLE_BY_LEN) return ENABLE_BY_LEN;
    const m = new Map<number, string[]>();
    for (const w of ENABLE_WORDS!) {
      const arr = m.get(w.length);
      if (arr) arr.push(w); else m.set(w.length, [w]);
    }
    ENABLE_BY_LEN = m;
    return m;
  }
  if (BY_LEN) return BY_LEN;
  const m = new Map<number, string[]>();
  for (const w of WORDS!) {
    const arr = m.get(w.length);
    if (arr) arr.push(w); else m.set(w.length, [w]);
  }
  BY_LEN = m;
  return m;
}

function bySorted(source: DictSource): Map<string, string[]> {
  if (source === 'fast') {
    if (ENABLE_BY_SORTED) return ENABLE_BY_SORTED;
    const m = new Map<string, string[]>();
    for (const w of ENABLE_WORDS!) {
      const key = sortedLetters(w);
      const arr = m.get(key);
      if (arr) arr.push(w); else m.set(key, [w]);
    }
    ENABLE_BY_SORTED = m;
    return m;
  }
  if (BY_SORTED) return BY_SORTED;
  const m = new Map<string, string[]>();
  for (const w of WORDS!) {
    const key = sortedLetters(w);
    const arr = m.get(key);
    if (arr) arr.push(w); else m.set(key, [w]);
  }
  BY_SORTED = m;
  return m;
}

type Req =
  | { id: number; kind: 'ready' }
  | { id: number; kind: 'unscramble'; letters: string; minLen?: number; maxLen?: number; dictSource?: DictSource }
  | { id: number; kind: 'anagrams'; letters: string; exact: boolean; dictSource?: DictSource }
  | { id: number; kind: 'pattern'; pattern: string; dictSource?: DictSource }
  | { id: number; kind: 'startsWith'; prefix: string; minLen?: number; maxLen?: number; dictSource?: DictSource }
  | { id: number; kind: 'endsWith'; suffix: string; minLen?: number; maxLen?: number; dictSource?: DictSource }
  | { id: number; kind: 'contains'; sub: string; minLen?: number; maxLen?: number; dictSource?: DictSource }
  | { id: number; kind: 'rack'; rack: string; valueSet: 'scrabble' | 'wwf'; minLen?: number; maxLen?: number; limit?: number; dictSource?: DictSource; boardLetter?: string }
  | { id: number; kind: 'rhymes'; word: string; dictSource?: DictSource }
  | { id: number; kind: 'phraseAnagram'; letters: string; dictSource?: DictSource; minWordLen?: number; limit?: number }
  | { id: number; kind: 'nearAnagram'; letters: string; dictSource?: DictSource; minLen?: number };

// Check whether `subKey` (sorted-letter string) fits inside `wholeKey`.
// Both arguments are pre-sorted strings. O(n + m).
function subsetOfSortedKey(subKey: string, wholeKey: string): boolean {
  let i = 0, j = 0;
  while (i < subKey.length && j < wholeKey.length) {
    if (subKey[i] === wholeKey[j]) { i++; j++; }
    else if (subKey[i] > wholeKey[j]) j++;
    else return false;
  }
  return i === subKey.length;
}

// Return the complement of `subKey` inside `wholeKey` as a sorted-letter key.
// Assumes subsetOfSortedKey(subKey, wholeKey) is true.
function subtractSortedKey(subKey: string, wholeKey: string): string {
  const out: string[] = [];
  let i = 0, j = 0;
  while (j < wholeKey.length) {
    if (i < subKey.length && subKey[i] === wholeKey[j]) { i++; j++; }
    else { out.push(wholeKey[j]); j++; }
  }
  return out.join('');
}

function filterLen(words: string[], minLen?: number, maxLen?: number): string[] {
  if (!minLen && !maxLen) return words;
  return words.filter((w) => (!minLen || w.length >= minLen) && (!maxLen || w.length <= maxLen));
}

function unscrambleLetters(words: string[], letters: string, minLen = 2, maxLen = 15): string[] {
  const cleaned = letters.toLowerCase().replace(/[^a-z?]/g, '');
  const out: string[] = [];
  for (const w of words) {
    if (w.length < minLen || w.length > maxLen) continue;
    if (w.length > cleaned.length) continue;
    if (canMakeFromRack(w, cleaned)) out.push(w);
  }
  out.sort((a, b) => b.length - a.length || a.localeCompare(b));
  return out;
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const msg = e.data;
  const source: DictSource = (msg as { dictSource?: DictSource }).dictSource ?? 'full';
  try {
    const words = await loadFor(source);

    switch (msg.kind) {
      case 'ready': {
        reply(msg.id, { count: words.length });
        break;
      }
      case 'unscramble': {
        const results = unscrambleLetters(words, msg.letters, msg.minLen ?? 2, msg.maxLen ?? 15);
        reply(msg.id, { results });
        break;
      }
      case 'anagrams': {
        if (msg.exact) {
          const key = sortedLetters(msg.letters);
          const exact = (bySorted(source).get(key) ?? []).filter((w) => w !== msg.letters.toLowerCase());
          reply(msg.id, { results: exact });
        } else {
          const results = unscrambleLetters(words, msg.letters, 2, msg.letters.length);
          reply(msg.id, { results });
        }
        break;
      }
      case 'pattern': {
        const p = msg.pattern.toLowerCase();
        const same = byLen(source).get(p.length) ?? [];
        const results = same.filter((w) => matchesPattern(w, p));
        reply(msg.id, { results });
        break;
      }
      case 'startsWith': {
        const p = msg.prefix.toLowerCase();
        if (!p) { reply(msg.id, { results: [] }); break; }
        const filtered = filterLen(words, msg.minLen, msg.maxLen).filter((w) => w.startsWith(p));
        filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
        reply(msg.id, { results: filtered });
        break;
      }
      case 'endsWith': {
        const p = msg.suffix.toLowerCase();
        if (!p) { reply(msg.id, { results: [] }); break; }
        const filtered = filterLen(words, msg.minLen, msg.maxLen).filter((w) => w.endsWith(p));
        filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
        reply(msg.id, { results: filtered });
        break;
      }
      case 'contains': {
        const p = msg.sub.toLowerCase();
        if (!p) { reply(msg.id, { results: [] }); break; }
        const filtered = filterLen(words, msg.minLen, msg.maxLen).filter((w) => w.includes(p));
        filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
        reply(msg.id, { results: filtered });
        break;
      }
      case 'rack': {
        const rack = msg.rack;
        const boardLetter = (msg.boardLetter ?? '').toLowerCase().replace(/[^a-z]/g, '').slice(0, 1);
        const values = msg.valueSet === 'wwf' ? WWF_VALUES : SCRABBLE_VALUES;
        const usable = filterLen(words, msg.minLen ?? 2, msg.maxLen ?? 15);
        const matches: Array<{ word: string; score: number; blankPositions: number[] }> = [];
        const bingoBonus = msg.valueSet === 'wwf' ? 35 : 50;
        const rackCap = rack.length + (boardLetter ? 1 : 0);
        for (const w of usable) {
          if (w.length > rackCap) continue;
          let remainder = w;
          let boardOffset = -1;
          if (boardLetter) {
            const idx = w.indexOf(boardLetter);
            if (idx === -1) continue;
            remainder = w.slice(0, idx) + w.slice(idx + 1);
            boardOffset = idx;
          }
          const fit = rackFitDetails(remainder, rack);
          if (!fit.fits) continue;
          // Real Scrabble / WWF score blanks as 0.
          let score = wordScore(w, values);
          const lowerRem = remainder.toLowerCase();
          // Translate blank positions from the `remainder` string back into positions in `w`.
          const blankPositions: number[] = fit.blankPositions.map((p) =>
            boardOffset >= 0 && p >= boardOffset ? p + 1 : p,
          );
          for (const p of fit.blankPositions) score -= values[lowerRem[p]] ?? 0;
          if (remainder.length === 7) score += bingoBonus;
          matches.push({ word: w, score, blankPositions });
        }
        matches.sort((a, b) => b.score - a.score || b.word.length - a.word.length || a.word.localeCompare(b.word));
        reply(msg.id, { results: matches.slice(0, msg.limit ?? 500) });
        break;
      }
      case 'phraseAnagram': {
        // Find 2-word phrases whose combined letters match the input exactly.
        // Walks the sorted-key index once; for each key that could be the
        // first word, look up the complement. O(|index|) with O(1) lookups.
        const key = sortedLetters(msg.letters);
        const index = bySorted(source);
        const minWordLen = msg.minWordLen ?? 3;
        const limit = msg.limit ?? 200;
        const pairs: Array<[string, string]> = [];
        const seen = new Set<string>();
        for (const [k1, words1] of index) {
          if (k1.length < minWordLen) continue;
          if (k1.length > key.length - minWordLen) continue;
          if (!subsetOfSortedKey(k1, key)) continue;
          const k2 = subtractSortedKey(k1, key);
          const words2 = index.get(k2);
          if (!words2) continue;
          for (const w1 of words1) {
            for (const w2 of words2) {
              if (w1 === w2 && words1 === words2 && words1.length === 1) continue;
              // Canonical pair ordering so (cat, dog) and (dog, cat) dedupe.
              const pairKey = w1 < w2 ? `${w1}|${w2}` : `${w2}|${w1}`;
              if (seen.has(pairKey)) continue;
              seen.add(pairKey);
              pairs.push(w1 < w2 ? [w1, w2] : [w2, w1]);
              if (pairs.length >= limit) break;
            }
            if (pairs.length >= limit) break;
          }
          if (pairs.length >= limit) break;
        }
        pairs.sort((a, b) => (a[0].length + a[1].length) - (b[0].length + b[1].length) || a[0].localeCompare(b[0]));
        reply(msg.id, { results: pairs });
        break;
      }
      case 'nearAnagram': {
        // Words whose sorted key is one letter off from the input key:
        // either one letter removed OR one extra letter added.
        const key = sortedLetters(msg.letters);
        const minLen = msg.minLen ?? 3;
        const index = bySorted(source);
        const exactKey = key;
        const exactSet = new Set(index.get(exactKey) ?? []);
        const hits = new Map<string, { word: string; kind: 'one-less' | 'one-more' }>();
        // One letter removed — 26 delete variants (dedupe by key).
        const seenSubKeys = new Set<string>();
        for (let i = 0; i < key.length; i++) {
          const subKey = key.slice(0, i) + key.slice(i + 1);
          if (seenSubKeys.has(subKey)) continue;
          seenSubKeys.add(subKey);
          if (subKey.length < minLen) continue;
          const ws = index.get(subKey) ?? [];
          for (const w of ws) {
            if (!hits.has(w)) hits.set(w, { word: w, kind: 'one-less' });
          }
        }
        // One letter added — 26 letters × insertion points, dedupe by key.
        const seenSuperKeys = new Set<string>();
        for (let c = 97; c <= 122; c++) {
          const add = String.fromCharCode(c);
          const merged = (key + add).split('').sort().join('');
          if (seenSuperKeys.has(merged)) continue;
          seenSuperKeys.add(merged);
          const ws = index.get(merged) ?? [];
          for (const w of ws) {
            if (!hits.has(w) && !exactSet.has(w)) hits.set(w, { word: w, kind: 'one-more' });
          }
        }
        const results = Array.from(hits.values())
          .sort((a, b) => a.word.length - b.word.length || a.word.localeCompare(b.word));
        reply(msg.id, { results });
        break;
      }
      case 'rhymes': {
        const word = msg.word.toLowerCase().replace(/[^a-z]/g, '');
        if (!word) { reply(msg.id, { perfect: [], near: [] }); break; }
        const endings = [
          word.slice(-4),
          word.slice(-3),
          word.slice(-2),
        ].filter((x, i, arr) => x.length >= 2 && arr.indexOf(x) === i);
        const perfect: string[] = [];
        const near: string[] = [];
        for (const w of words) {
          if (w === word) continue;
          if (endings[0] && w.endsWith(endings[0])) perfect.push(w);
          else if (endings[1] && w.endsWith(endings[1])) near.push(w);
        }
        perfect.sort((a, b) => a.length - b.length || a.localeCompare(b));
        near.sort((a, b) => a.length - b.length || a.localeCompare(b));
        reply(msg.id, { perfect: perfect.slice(0, 200), near: near.slice(0, 200) });
        break;
      }
    }
  } catch (err) {
    reply(msg.id, { error: String(err) });
  }
};

function reply(id: number, payload: unknown) {
  (self as unknown as Worker).postMessage({ id, payload });
}

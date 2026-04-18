import { SCRABBLE_VALUES, WWF_VALUES, canMakeFromRack, matchesPattern, sortedLetters, wordScore } from '../lib/dict';

let WORDS: string[] | null = null;
let BY_LEN: Map<number, string[]> | null = null;
let BY_SORTED: Map<string, string[]> | null = null;
let ENABLE: Set<string> | null = null;
let enablePromise: Promise<Set<string>> | null = null;

async function loadDict(): Promise<string[]> {
  if (WORDS) return WORDS;
  const res = await fetch('/data/dict.txt');
  if (!res.ok) throw new Error(`Dictionary fetch failed: ${res.status}`);
  const text = await res.text();
  WORDS = text.split(/\r?\n/).map((w) => w.trim().toLowerCase()).filter((w) => w.length > 0);
  return WORDS;
}

async function loadEnable(): Promise<Set<string>> {
  if (ENABLE) return ENABLE;
  if (enablePromise) return enablePromise;
  enablePromise = (async () => {
    const res = await fetch('/data/enable.txt');
    if (!res.ok) throw new Error(`ENABLE fetch failed: ${res.status}`);
    const text = await res.text();
    const set = new Set<string>();
    for (const line of text.split(/\r?\n/)) {
      const w = line.trim().toLowerCase();
      if (w) set.add(w);
    }
    ENABLE = set;
    return set;
  })();
  return enablePromise;
}

function byLen(): Map<number, string[]> {
  if (BY_LEN) return BY_LEN;
  const m = new Map<number, string[]>();
  for (const w of WORDS!) {
    const arr = m.get(w.length);
    if (arr) arr.push(w); else m.set(w.length, [w]);
  }
  BY_LEN = m;
  return m;
}

function bySorted(): Map<string, string[]> {
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
  | { id: number; kind: 'unscramble'; letters: string; minLen?: number; maxLen?: number }
  | { id: number; kind: 'anagrams'; letters: string; exact: boolean }
  | { id: number; kind: 'pattern'; pattern: string }
  | { id: number; kind: 'startsWith'; prefix: string; minLen?: number; maxLen?: number }
  | { id: number; kind: 'endsWith'; suffix: string; minLen?: number; maxLen?: number }
  | { id: number; kind: 'contains'; sub: string; minLen?: number; maxLen?: number }
  | { id: number; kind: 'rack'; rack: string; valueSet: 'scrabble' | 'wwf'; minLen?: number; maxLen?: number; limit?: number; strict?: boolean }
  | { id: number; kind: 'rhymes'; word: string };

function filterLen(words: string[], minLen?: number, maxLen?: number): string[] {
  if (!minLen && !maxLen) return words;
  return words.filter((w) => (!minLen || w.length >= minLen) && (!maxLen || w.length <= maxLen));
}

function unscrambleLetters(letters: string, minLen = 2, maxLen = 15): string[] {
  const cleaned = letters.toLowerCase().replace(/[^a-z?]/g, '');
  const out: string[] = [];
  for (const w of WORDS!) {
    if (w.length < minLen || w.length > maxLen) continue;
    if (w.length > cleaned.length) continue;
    if (canMakeFromRack(w, cleaned)) out.push(w);
  }
  out.sort((a, b) => b.length - a.length || a.localeCompare(b));
  return out;
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const msg = e.data;
  try {
    await loadDict();

    switch (msg.kind) {
      case 'ready': {
        reply(msg.id, { count: WORDS!.length });
        break;
      }
      case 'unscramble': {
        const results = unscrambleLetters(msg.letters, msg.minLen ?? 2, msg.maxLen ?? 15);
        reply(msg.id, { results });
        break;
      }
      case 'anagrams': {
        if (msg.exact) {
          const key = sortedLetters(msg.letters);
          const exact = (bySorted().get(key) ?? []).filter((w) => w !== msg.letters.toLowerCase());
          reply(msg.id, { results: exact });
        } else {
          const results = unscrambleLetters(msg.letters, 2, msg.letters.length);
          reply(msg.id, { results });
        }
        break;
      }
      case 'pattern': {
        const p = msg.pattern.toLowerCase();
        const same = byLen().get(p.length) ?? [];
        const results = same.filter((w) => matchesPattern(w, p));
        reply(msg.id, { results });
        break;
      }
      case 'startsWith': {
        const p = msg.prefix.toLowerCase();
        if (!p) { reply(msg.id, { results: [] }); break; }
        const filtered = filterLen(WORDS!, msg.minLen, msg.maxLen).filter((w) => w.startsWith(p));
        filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
        reply(msg.id, { results: filtered });
        break;
      }
      case 'endsWith': {
        const p = msg.suffix.toLowerCase();
        if (!p) { reply(msg.id, { results: [] }); break; }
        const filtered = filterLen(WORDS!, msg.minLen, msg.maxLen).filter((w) => w.endsWith(p));
        filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
        reply(msg.id, { results: filtered });
        break;
      }
      case 'contains': {
        const p = msg.sub.toLowerCase();
        if (!p) { reply(msg.id, { results: [] }); break; }
        const filtered = filterLen(WORDS!, msg.minLen, msg.maxLen).filter((w) => w.includes(p));
        filtered.sort((a, b) => a.length - b.length || a.localeCompare(b));
        reply(msg.id, { results: filtered });
        break;
      }
      case 'rack': {
        const rack = msg.rack;
        const values = msg.valueSet === 'wwf' ? WWF_VALUES : SCRABBLE_VALUES;
        const enable = msg.strict ? await loadEnable() : null;
        const usable = filterLen(WORDS!, msg.minLen ?? 2, msg.maxLen ?? 15);
        const matches: Array<{ word: string; score: number }> = [];
        for (const w of usable) {
          if (w.length > rack.length) continue;
          if (enable && !enable.has(w)) continue;
          if (!canMakeFromRack(w, rack)) continue;
          let score = wordScore(w, values);
          if (w.length === 7) score += 50;
          matches.push({ word: w, score });
        }
        matches.sort((a, b) => b.score - a.score || b.word.length - a.word.length || a.word.localeCompare(b.word));
        reply(msg.id, { results: matches.slice(0, msg.limit ?? 500) });
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
        for (const w of WORDS!) {
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

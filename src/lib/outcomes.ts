import { SCRABBLE_VALUES, WWF_VALUES, wordScore } from './dict';
import { convert, type Unit, type UnitGroup } from './units';

export interface WordStats {
  count: number;
  shortest: string | null;
  longest: string | null;
  bestScrabble: { word: string; score: number } | null;
  bestWwf: { word: string; score: number } | null;
  bestShort: { word: string; score: number } | null;
  bestLong: { word: string; score: number } | null;
  mostCommonLength: number | null;
  byLength: Record<number, number>;
}

export function wordStats(words: string[]): WordStats {
  const byLength: Record<number, number> = {};
  let shortest: string | null = null;
  let longest: string | null = null;
  let bestS: { word: string; score: number } | null = null;
  let bestW: { word: string; score: number } | null = null;
  let bestShort: { word: string; score: number } | null = null;
  let bestLong: { word: string; score: number } | null = null;

  for (const w of words) {
    byLength[w.length] = (byLength[w.length] ?? 0) + 1;
    if (!shortest || w.length < shortest.length) shortest = w;
    if (!longest || w.length > longest.length) longest = w;
    const s = wordScore(w, SCRABBLE_VALUES);
    const wf = wordScore(w, WWF_VALUES);
    if (!bestS || s > bestS.score) bestS = { word: w, score: s };
    if (!bestW || wf > bestW.score) bestW = { word: w, score: wf };
    if (w.length <= 4) {
      if (!bestShort || s > bestShort.score) bestShort = { word: w, score: s };
    } else {
      if (!bestLong || s > bestLong.score) bestLong = { word: w, score: s };
    }
  }

  let mostCommon: number | null = null;
  let max = 0;
  for (const [lenStr, c] of Object.entries(byLength)) {
    if (c > max) { max = c; mostCommon = Number(lenStr); }
  }

  return {
    count: words.length,
    shortest, longest,
    bestScrabble: bestS, bestWwf: bestW,
    bestShort, bestLong,
    mostCommonLength: mostCommon,
    byLength,
  };
}

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  avgWordLength: number;
  avgWordsPerSentence: number;
  longestWord: string | null;
  readMinutes: number;
  speakMinutes: number;
}

export function textStats(text: string): TextStats {
  const chars = text.length;
  const charsNoSp = text.replace(/\s/g, '').length;
  const wordArr = text.match(/\b[\w'-]+\b/g) ?? [];
  const sentences = (text.match(/[.!?]+(?:\s|$)/g) ?? []).length || (text.trim() ? 1 : 0);
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length || (text.trim() ? 1 : 0);
  const lines = text.split('\n').length;
  const longestWord = wordArr.reduce<string | null>((a, b) => (!a || b.length > a.length ? b : a), null);
  const avgWordLength = wordArr.length ? wordArr.reduce((s, w) => s + w.length, 0) / wordArr.length : 0;
  const avgWordsPerSentence = sentences ? wordArr.length / sentences : 0;
  const readMinutes = wordArr.length / 238;
  const speakMinutes = wordArr.length / 150;
  return {
    characters: chars,
    charactersNoSpaces: charsNoSp,
    words: wordArr.length,
    sentences, paragraphs, lines,
    avgWordLength,
    avgWordsPerSentence,
    longestWord,
    readMinutes, speakMinutes,
  };
}

export function formatReadTime(minutes: number): string {
  if (minutes < 1) return 'under 1 minute';
  const m = Math.round(minutes);
  return `about ${m} minute${m === 1 ? '' : 's'}`;
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export function alphaFirstLast(words: string[], n = 5): { first: string[]; last: string[] } {
  const sorted = [...words].sort((a, b) => a.localeCompare(b));
  return {
    first: sorted.slice(0, n),
    last: sorted.slice(Math.max(0, sorted.length - n)).reverse(),
  };
}

export function countByLengthTopN(byLength: Record<number, number>, n = 4): { len: number; count: number }[] {
  return Object.entries(byLength)
    .map(([k, v]) => ({ len: Number(k), count: v }))
    .sort((a, b) => b.count - a.count || a.len - b.len)
    .slice(0, n);
}

export function bestShortPlay(words: string[], maxLen = 4): string | null {
  const shorts = words.filter((w) => w.length <= maxLen);
  if (shorts.length === 0) return null;
  return shorts[0];
}

const COMMON_EQUIVS: Record<string, string[]> = {
  LENGTH: ['m', 'ft', 'cm', 'in'],
  WEIGHT: ['kg', 'lb', 'g', 'oz'],
  TEMPERATURE: ['C', 'F', 'K'],
  AREA: ['m2', 'ft2', 'ac', 'ha'],
  VOLUME: ['l', 'gal', 'cup', 'ml'],
  SPEED: ['kph', 'mph', 'mps'],
  TIME: ['s', 'min', 'h', 'day'],
};

export function commonEquivalents(
  groupName: keyof typeof COMMON_EQUIVS,
  units: UnitGroup,
  value: number,
  from: Unit,
  excludeIds: string[],
  fmt: (n: number) => string,
): { id: string; label: string; value: string }[] {
  const ids = COMMON_EQUIVS[groupName] ?? [];
  return ids
    .filter((id) => units[id] && !excludeIds.includes(id))
    .slice(0, 2)
    .map((id) => {
      const u = units[id];
      return { id, label: u.label, value: fmt(convert(value, from, u)) };
    });
}

export function temperatureAnchor(celsius: number): string | null {
  const rounded = (n: number) => Math.abs(celsius - n);
  const anchors: { c: number; label: string; epsilon: number }[] = [
    { c: 0, label: 'around freezing (0°C / 32°F)', epsilon: 3 },
    { c: 20, label: 'room temperature (20°C / 68°F)', epsilon: 4 },
    { c: 37, label: 'body temperature (37°C / 98.6°F)', epsilon: 2 },
    { c: 100, label: 'boiling point of water (100°C / 212°F)', epsilon: 3 },
    { c: -40, label: 'extreme cold (−40°C = −40°F)', epsilon: 5 },
  ];
  const hit = anchors.find((a) => rounded(a.c) <= a.epsilon);
  return hit ? hit.label : null;
}

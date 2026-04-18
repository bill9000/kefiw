export function reverseChars(s: string): string {
  return Array.from(s).reverse().join('');
}
export function reverseWords(s: string): string {
  return s.split(/(\s+)/).reverse().join('');
}
export function reverseLines(s: string): string {
  return s.split('\n').reverse().join('\n');
}

export function toTitleCase(s: string): string {
  return s.toLowerCase().replace(/\b([a-z])/g, (_m, c) => c.toUpperCase());
}
export function toSentenceCase(s: string): string {
  const lower = s.toLowerCase();
  return lower.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (m) => m.toUpperCase());
}
export function toCamelCase(s: string): string {
  return s
    .trim()
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
}
export function toSnakeCase(s: string): string {
  return s.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean).map((w) => w.toLowerCase()).join('_');
}
export function toKebabCase(s: string): string {
  return s.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean).map((w) => w.toLowerCase()).join('-');
}
export function toConstantCase(s: string): string {
  return toSnakeCase(s).toUpperCase();
}

export function countWords(s: string): number {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}
export function countSentences(s: string): number {
  const m = s.match(/[^.!?]+[.!?]+/g);
  return m ? m.length : (s.trim() ? 1 : 0);
}
export function countParagraphs(s: string): number {
  return s.split(/\n\s*\n/).filter((p) => p.trim().length).length;
}
export function readingTimeMinutes(words: number): number {
  return words / 200;
}

export function letterFrequency(s: string): Record<string, number> {
  const freq: Record<string, number> = {};
  for (const ch of s) {
    const key = ch.toLowerCase();
    if (/[a-z0-9]/.test(key)) freq[key] = (freq[key] ?? 0) + 1;
  }
  return freq;
}

export function removeDuplicateLines(s: string, preserveOrder = true): string {
  const lines = s.split('\n').map((l) => l.replace(/\s+$/, ''));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const l of lines) {
    if (!seen.has(l)) {
      seen.add(l);
      out.push(l);
    }
  }
  return preserveOrder ? out.join('\n') : out.sort().join('\n');
}

export type SortMode = 'alpha-asc' | 'alpha-desc' | 'length-asc' | 'length-desc' | 'numeric-asc' | 'numeric-desc';
export function sortLines(s: string, mode: SortMode, caseSensitive = false): string {
  const lines = s.split('\n');
  const coll = (a: string, b: string) => (caseSensitive ? a.localeCompare(b) : a.toLowerCase().localeCompare(b.toLowerCase()));
  const sorted = [...lines];
  switch (mode) {
    case 'alpha-asc': sorted.sort(coll); break;
    case 'alpha-desc': sorted.sort((a, b) => coll(b, a)); break;
    case 'length-asc': sorted.sort((a, b) => a.length - b.length); break;
    case 'length-desc': sorted.sort((a, b) => b.length - a.length); break;
    case 'numeric-asc': sorted.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)); break;
    case 'numeric-desc': sorted.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0)); break;
  }
  return sorted.join('\n');
}

export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const matches = stripped.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

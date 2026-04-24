// ENABLE dictionary loader for client-side word validation.
//
// public/data/enable.txt is ~172k lowercase words, ~1.7 MB. We fetch it
// once per session, parse into a Set<string> (uppercase), and cache on
// window.__kfwDict so subsequent islands don't re-fetch.

const DICT_URL = '/data/enable.txt';

declare global {
  interface Window {
    __kfwDict?: Set<string>;
    __kfwDictPromise?: Promise<Set<string>>;
  }
}

export async function loadDict(): Promise<Set<string>> {
  if (typeof window === 'undefined') return new Set();
  if (window.__kfwDict) return window.__kfwDict;
  if (window.__kfwDictPromise) return window.__kfwDictPromise;

  window.__kfwDictPromise = (async () => {
    const res = await fetch(DICT_URL);
    if (!res.ok) throw new Error(`[daily-dict] fetch failed: ${res.status}`);
    const text = await res.text();
    const set = new Set<string>();
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (trimmed) set.add(trimmed.toUpperCase());
    }
    window.__kfwDict = set;
    return set;
  })();

  return window.__kfwDictPromise;
}

export function hasWord(dict: Set<string>, word: string): boolean {
  return dict.has(word.toUpperCase());
}

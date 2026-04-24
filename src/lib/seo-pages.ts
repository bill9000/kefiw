import { wordsStartingWith, wordsEndingWith, wordsContainingLetterAt, wordsContainingSubstring } from './seo-dict';

export const SEO_THRESHOLD = 25;
export const PREFIX_LENGTHS = [3, 4, 5, 6, 7, 8] as const;
export const SUFFIX_LENGTHS = [3, 4, 5, 6, 7, 8] as const;
export const CONTAINS_LENGTHS = [3, 4, 5, 6, 7, 8] as const;
export const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('') as readonly string[];
export const CURATED_SUFFIXES = ['ing', 'ed', 'er', 'ly', 'tion', 'ness', 'ment', 'able'] as const;
export const CURATED_DIGRAPHS = ['th', 'sh', 'ch', 'ph', 'ck', 'ng', 'wh', 'ea', 'ou', 'ie'] as const;

export type SeoFamily = 'prefix' | 'suffix' | 'curated-suffix' | 'contains' | 'curated-digraph';

export const FAMILY_THRESHOLDS: Record<SeoFamily, number> = {
  prefix: 25,
  suffix: 25,
  contains: 25,
  'curated-suffix': 10,
  'curated-digraph': 10,
};

export interface SeoPage {
  slug: string;
  family: SeoFamily;
  length: number | null;
  letter: string;
  title: string;
  h1: string;
  metaDescription: string;
  count: number;
  examples: string[];
  words: string[];
  longest: string;
  shortest: string | null;
  published: boolean;
  reason?: string;
}

function pickExamples(words: string[]): string[] {
  return words.slice(0, 5);
}

function prefixSlug(length: number, letter: string): string {
  return `${length}-letter-words-starting-with-${letter}`;
}

function suffixSlug(length: number, letter: string): string {
  return `${length}-letter-words-ending-with-${letter}`;
}

function curatedSlug(suffix: string): string {
  return `words-ending-with-${suffix}`;
}

function containsSlug(length: number, letter: string): string {
  return `${length}-letter-words-containing-${letter}`;
}

function digraphSlug(digraph: string): string {
  return `words-containing-${digraph}`;
}

function titleCase(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function buildPrefix(length: number, letter: string): SeoPage | null {
  const words = wordsStartingWith(letter, length);
  if (words.length < FAMILY_THRESHOLDS.prefix) return null;
  const upper = letter.toUpperCase();
  return {
    slug: prefixSlug(length, letter),
    family: 'prefix',
    length,
    letter,
    title: `${length}-Letter Words Starting With ${upper} — Kefiw`,
    h1: `${length}-Letter Words Starting With ${upper}`,
    metaDescription: `Every ${length}-letter word that starts with ${upper}. ${words.length} words from the Kefiw word list, sorted alphabetically.`,
    count: words.length,
    examples: pickExamples(words),
    words,
    longest: words[words.length - 1],
    shortest: null,
    published: true,
  };
}

function buildSuffix(length: number, letter: string): SeoPage | null {
  const words = wordsEndingWith(letter, length);
  if (words.length < FAMILY_THRESHOLDS.suffix) return null;
  const upper = letter.toUpperCase();
  return {
    slug: suffixSlug(length, letter),
    family: 'suffix',
    length,
    letter,
    title: `${length}-Letter Words Ending With ${upper} — Kefiw`,
    h1: `${length}-Letter Words Ending With ${upper}`,
    metaDescription: `Every ${length}-letter word that ends in ${upper}. ${words.length} words from the Kefiw word list, sorted alphabetically.`,
    count: words.length,
    examples: pickExamples(words),
    words,
    longest: words[words.length - 1],
    shortest: null,
    published: true,
  };
}

function buildContains(length: number, letter: string): SeoPage | null {
  const words = wordsContainingLetterAt(letter, length);
  if (words.length < FAMILY_THRESHOLDS.contains) return null;
  const upper = letter.toUpperCase();
  return {
    slug: containsSlug(length, letter),
    family: 'contains',
    length,
    letter,
    title: `${length}-Letter Words Containing ${upper} — Kefiw`,
    h1: `${length}-Letter Words Containing ${upper}`,
    metaDescription: `Every ${length}-letter word that contains the letter ${upper}. ${words.length} words from the Kefiw word list.`,
    count: words.length,
    examples: pickExamples(words),
    words,
    longest: words[words.length - 1],
    shortest: null,
    published: true,
  };
}

function buildCuratedDigraph(digraph: string): SeoPage | null {
  const words = wordsContainingSubstring(digraph, 2, 12);
  if (words.length < FAMILY_THRESHOLDS['curated-digraph']) return null;
  const short = [...words].sort((a, b) => a.length - b.length || a.localeCompare(b));
  const long = [...words].sort((a, b) => b.length - a.length || a.localeCompare(b));
  return {
    slug: digraphSlug(digraph),
    family: 'curated-digraph',
    length: null,
    letter: digraph,
    title: `Words Containing "${digraph.toUpperCase()}" — Kefiw`,
    h1: `Words Containing "${digraph.toUpperCase()}"`,
    metaDescription: `${words.length} English words containing the digraph "${digraph}". Sorted by length for Scrabble and crossword use.`,
    count: words.length,
    examples: short.slice(0, 5),
    words,
    longest: long[0],
    shortest: short[0],
    published: true,
  };
}

function buildCuratedSuffix(suffix: string): SeoPage | null {
  const words = wordsEndingWith(suffix, null);
  if (words.length < FAMILY_THRESHOLDS['curated-suffix']) return null;
  const short = [...words].sort((a, b) => a.length - b.length || a.localeCompare(b));
  const long = [...words].sort((a, b) => b.length - a.length || a.localeCompare(b));
  return {
    slug: curatedSlug(suffix),
    family: 'curated-suffix',
    length: null,
    letter: suffix,
    title: `Words Ending With ${titleCase(suffix)} — Kefiw`,
    h1: `Words Ending With "${suffix}"`,
    metaDescription: `${words.length} English words ending in "${suffix}". Sorted alphabetically, filterable by length.`,
    count: words.length,
    examples: short.slice(0, 5),
    words,
    longest: long[0],
    shortest: short[0],
    published: true,
  };
}

interface DroppedEntry {
  slug: string;
  family: SeoFamily;
  count: number;
}

let built: { pages: SeoPage[]; dropped: DroppedEntry[] } | null = null;

// Memoized — buildSeoPages is called by getStaticPaths() (word-tools/[slug].astro)
// AND by the sitemap generator. Without this cache each call rescans 172k words
// through ~486 filter passes. The page set is entirely deterministic from the
// word list + thresholds, so one computation is enough per build.
let __seoPagesCache: { pages: SeoPage[]; dropped: DroppedEntry[] } | null = null;

export function buildSeoPages(): { pages: SeoPage[]; dropped: DroppedEntry[] } {
  if (__seoPagesCache) return __seoPagesCache;
  const result = computeSeoPages();
  __seoPagesCache = result;
  return result;
}

function computeSeoPages(): { pages: SeoPage[]; dropped: DroppedEntry[] } {
  if (built) return built;
  const pages: SeoPage[] = [];
  const dropped: DroppedEntry[] = [];

  for (const length of PREFIX_LENGTHS) {
    for (const letter of LETTERS) {
      const page = buildPrefix(length, letter);
      if (page) pages.push(page);
      else {
        const count = wordsStartingWith(letter, length).length;
        dropped.push({ slug: prefixSlug(length, letter), family: 'prefix', count });
      }
    }
  }
  for (const length of SUFFIX_LENGTHS) {
    for (const letter of LETTERS) {
      const page = buildSuffix(length, letter);
      if (page) pages.push(page);
      else {
        const count = wordsEndingWith(letter, length).length;
        dropped.push({ slug: suffixSlug(length, letter), family: 'suffix', count });
      }
    }
  }
  for (const suffix of CURATED_SUFFIXES) {
    const page = buildCuratedSuffix(suffix);
    if (page) pages.push(page);
    else {
      const count = wordsEndingWith(suffix, null).length;
      dropped.push({ slug: curatedSlug(suffix), family: 'curated-suffix', count });
    }
  }
  for (const length of CONTAINS_LENGTHS) {
    for (const letter of LETTERS) {
      const page = buildContains(length, letter);
      if (page) pages.push(page);
      else {
        const count = wordsContainingLetterAt(letter, length).length;
        dropped.push({ slug: containsSlug(length, letter), family: 'contains', count });
      }
    }
  }
  for (const digraph of CURATED_DIGRAPHS) {
    const page = buildCuratedDigraph(digraph);
    if (page) pages.push(page);
    else {
      const count = wordsContainingSubstring(digraph, 2, 12).length;
      dropped.push({ slug: digraphSlug(digraph), family: 'curated-digraph', count });
    }
  }

  const seen = new Set<string>();
  for (const p of pages) {
    if (seen.has(p.slug)) throw new Error(`[seo-pages] Duplicate SEO slug: ${p.slug}`);
    seen.add(p.slug);
  }

  built = { pages, dropped };
  return built;
}

export function seoSlugSet(): Set<string> {
  return new Set(buildSeoPages().pages.map((p) => p.slug));
}

export function relatedSlugs(page: SeoPage): { href: string; label: string }[] {
  const { pages } = buildSeoPages();
  const set = new Set(pages.map((p) => p.slug));
  const links: { href: string; label: string }[] = [];

  if (page.family === 'prefix' && page.length != null) {
    const adjLengths = [page.length - 1, page.length + 1].filter((n) => n >= 3 && n <= 8);
    for (const n of adjLengths) {
      const s = `${n}-letter-words-starting-with-${page.letter}`;
      if (set.has(s)) links.push({ href: `/word-tools/${s}/`, label: `${n}-letter words starting with ${page.letter.toUpperCase()}` });
    }
    const letterIdx = LETTERS.indexOf(page.letter);
    const adjLetters = [LETTERS[letterIdx - 1], LETTERS[letterIdx + 1]].filter(Boolean) as string[];
    for (const L of adjLetters) {
      const s = `${page.length}-letter-words-starting-with-${L}`;
      if (set.has(s)) links.push({ href: `/word-tools/${s}/`, label: `${page.length}-letter words starting with ${L.toUpperCase()}` });
    }
    const companion = `${page.length}-letter-words-ending-with-${page.letter}`;
    if (set.has(companion)) links.push({ href: `/word-tools/${companion}/`, label: `${page.length}-letter words ending with ${page.letter.toUpperCase()}` });
  }

  if (page.family === 'suffix' && page.length != null) {
    const adjLengths = [page.length - 1, page.length + 1].filter((n) => n >= 3 && n <= 8);
    for (const n of adjLengths) {
      const s = `${n}-letter-words-ending-with-${page.letter}`;
      if (set.has(s)) links.push({ href: `/word-tools/${s}/`, label: `${n}-letter words ending with ${page.letter.toUpperCase()}` });
    }
    const letterIdx = LETTERS.indexOf(page.letter);
    const adjLetters = [LETTERS[letterIdx - 1], LETTERS[letterIdx + 1]].filter(Boolean) as string[];
    for (const L of adjLetters) {
      const s = `${page.length}-letter-words-ending-with-${L}`;
      if (set.has(s)) links.push({ href: `/word-tools/${s}/`, label: `${page.length}-letter words ending with ${L.toUpperCase()}` });
    }
    const companion = `${page.length}-letter-words-starting-with-${page.letter}`;
    if (set.has(companion)) links.push({ href: `/word-tools/${companion}/`, label: `${page.length}-letter words starting with ${page.letter.toUpperCase()}` });
  }

  if (page.family === 'curated-suffix') {
    for (const other of CURATED_SUFFIXES) {
      if (other === page.letter) continue;
      const s = `words-ending-with-${other}`;
      if (set.has(s)) links.push({ href: `/word-tools/${s}/`, label: `Words ending with "${other}"` });
    }
  }

  if (page.family === 'contains' && page.length != null) {
    const adjLengths = [page.length - 1, page.length + 1].filter((n) => n >= 3 && n <= 8);
    for (const n of adjLengths) {
      const s = `${n}-letter-words-containing-${page.letter}`;
      if (set.has(s)) links.push({ href: `/word-tools/${s}/`, label: `${n}-letter words containing ${page.letter.toUpperCase()}` });
    }
    const startSlug = `${page.length}-letter-words-starting-with-${page.letter}`;
    if (set.has(startSlug)) links.push({ href: `/word-tools/${startSlug}/`, label: `${page.length}-letter words starting with ${page.letter.toUpperCase()}` });
    const endSlug = `${page.length}-letter-words-ending-with-${page.letter}`;
    if (set.has(endSlug)) links.push({ href: `/word-tools/${endSlug}/`, label: `${page.length}-letter words ending with ${page.letter.toUpperCase()}` });
  }

  if (page.family === 'curated-digraph') {
    for (const other of CURATED_DIGRAPHS) {
      if (other === page.letter) continue;
      const s = `words-containing-${other}`;
      if (set.has(s)) links.push({ href: `/word-tools/${s}/`, label: `Words containing "${other}"` });
    }
  }

  links.push({ href: '/word-tools/word-finder/', label: 'Word Finder (interactive)' });
  if (page.family === 'prefix') {
    links.push({ href: '/word-tools/words-starting-with/', label: 'Words Starting With — custom prefix' });
  } else if (page.family === 'suffix' || page.family === 'curated-suffix') {
    links.push({ href: '/word-tools/words-ending-with/', label: 'Words Ending With — custom suffix' });
  } else {
    links.push({ href: '/word-tools/words-containing/', label: 'Words Containing — custom substring' });
  }
  return links;
}

export function buildFaq(page: SeoPage): { q: string; a: string }[] {
  if (page.family === 'prefix' && page.length != null) {
    const L = page.letter.toUpperCase();
    return [
      {
        q: `How many ${page.length}-letter words start with ${L}?`,
        a: `There are ${page.count} ${page.length}-letter words that start with ${L} in the Kefiw game word list (based on ENABLE).`,
      },
      {
        q: `What is a good Scrabble word starting with ${L} that is ${page.length} letters long?`,
        a: `Examples from this list include ${page.examples.join(', ')}. All entries are valid ENABLE-list plays; exact tournament legality varies by dictionary.`,
      },
      {
        q: `Are all of these words valid in Words With Friends?`,
        a: `Most are, but Words With Friends uses its own internal dictionary. Use the Kefiw Words With Friends Helper to confirm a specific play.`,
      },
    ];
  }
  if (page.family === 'suffix' && page.length != null) {
    const L = page.letter.toUpperCase();
    return [
      {
        q: `How many ${page.length}-letter words end in ${L}?`,
        a: `There are ${page.count} ${page.length}-letter words ending in ${L} in the Kefiw game word list.`,
      },
      {
        q: `What are some ${page.length}-letter words ending with ${L}?`,
        a: `Examples from this list include ${page.examples.join(', ')}.`,
      },
      {
        q: `Can I filter this list by starting letter too?`,
        a: `Yes — open the Word Finder and use Pattern mode (e.g. ?${'?'.repeat(page.length - 2)}${page.letter}) to combine length, starting letter, and ending letter in one query.`,
      },
    ];
  }
  if (page.family === 'contains' && page.length != null) {
    const L = page.letter.toUpperCase();
    return [
      {
        q: `How many ${page.length}-letter words contain ${L}?`,
        a: `There are ${page.count} ${page.length}-letter words containing ${L} in the Kefiw game word list.`,
      },
      {
        q: `What are some ${page.length}-letter words with ${L} in them?`,
        a: `Examples from this list include ${page.examples.join(', ')}.`,
      },
      {
        q: `How do I find ${page.length}-letter words with ${L} at a specific position?`,
        a: `Use the Word Finder with a pattern. For example, ${'?'.repeat(Math.max(0, page.length - 1))}${page.letter} pins ${L} at the end; ${page.letter}${'?'.repeat(Math.max(0, page.length - 1))} pins it at the start.`,
      },
    ];
  }
  if (page.family === 'curated-digraph') {
    const d = page.letter;
    return [
      {
        q: `How many English words contain "${d}"?`,
        a: `${page.count} words in the Kefiw game word list (2-12 letters) contain the digraph "${d}".`,
      },
      {
        q: `What are the shortest and longest "${d}" words?`,
        a: `Shortest: ${page.shortest ?? '(n/a)'}. Longest: ${page.longest}.`,
      },
      {
        q: `Is the "${d}" pair always pronounced the same?`,
        a: `No — English digraphs are pronounced differently in different words. This list is purely about the spelling.`,
      },
    ];
  }
  const s = page.letter;
  return [
    {
      q: `How many English words end in "${s}"?`,
      a: `${page.count} words in the Kefiw game word list end with the letters "${s}".`,
    },
    {
      q: `What are the shortest and longest words ending in "${s}"?`,
      a: `The shortest in this list is ${page.shortest ?? '(n/a)'}, and the longest is ${page.longest}.`,
    },
    {
      q: `Which ones are useful in Scrabble?`,
      a: `The short examples above (${page.examples.slice(0, 3).join(', ')}) are common plays. For high-scoring plays, check the Scrabble Helper with your rack.`,
    },
  ];
}

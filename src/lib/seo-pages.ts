import { wordsStartingWith, wordsEndingWith } from './seo-dict';

export const SEO_THRESHOLD = 25;
export const PREFIX_LENGTHS = [4, 5, 6] as const;
export const SUFFIX_LENGTHS = [4, 5, 6] as const;
export const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('') as readonly string[];
export const CURATED_SUFFIXES = ['ing', 'ed', 'er', 'ly', 'tion', 'ness', 'ment', 'able'] as const;

export type SeoFamily = 'prefix' | 'suffix' | 'curated-suffix';

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

function titleCase(w: string): string {
  return w.charAt(0).toUpperCase() + w.slice(1);
}

function buildPrefix(length: number, letter: string): SeoPage | null {
  const words = wordsStartingWith(letter, length);
  if (words.length < SEO_THRESHOLD) return null;
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
  };
}

function buildSuffix(length: number, letter: string): SeoPage | null {
  const words = wordsEndingWith(letter, length);
  if (words.length < SEO_THRESHOLD) return null;
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
  };
}

function buildCuratedSuffix(suffix: string): SeoPage | null {
  const words = wordsEndingWith(suffix, null);
  if (words.length < SEO_THRESHOLD) return null;
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
  };
}

interface DroppedEntry {
  slug: string;
  family: SeoFamily;
  count: number;
}

let built: { pages: SeoPage[]; dropped: DroppedEntry[] } | null = null;

export function buildSeoPages(): { pages: SeoPage[]; dropped: DroppedEntry[] } {
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
    const adjLengths = [page.length - 1, page.length + 1].filter((n) => n >= 4 && n <= 6);
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
    const adjLengths = [page.length - 1, page.length + 1].filter((n) => n >= 4 && n <= 6);
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

  links.push({ href: '/word-tools/word-finder/', label: 'Word Finder (interactive)' });
  if (page.family === 'prefix') {
    links.push({ href: '/word-tools/words-starting-with/', label: 'Words Starting With — custom prefix' });
  } else {
    links.push({ href: '/word-tools/words-ending-with/', label: 'Words Ending With — custom suffix' });
  }
  return links;
}

export function buildFaq(page: SeoPage): { q: string; a: string }[] {
  if (page.family === 'prefix' && page.length != null) {
    const L = page.letter.toUpperCase();
    return [
      {
        q: `How many ${page.length}-letter words start with ${L}?`,
        a: `There are ${page.count} ${page.length}-letter words that start with ${L} in the Kefiw fast word list (based on ENABLE).`,
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
        a: `There are ${page.count} ${page.length}-letter words ending in ${L} in the Kefiw fast word list.`,
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
  const s = page.letter;
  return [
    {
      q: `How many English words end in "${s}"?`,
      a: `${page.count} words in the Kefiw fast word list end with the letters "${s}".`,
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

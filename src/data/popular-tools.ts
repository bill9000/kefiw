import { TOOLS_BY_ID, CATEGORIES, toolHref, type ToolConfig } from './tools';

export type RankingMode =
  | 'fallback'
  | 'all-time'
  | 'today'
  | 'this-week'
  | 'editor-picks'
  | 'by-category';

export interface PopularToolEntry {
  id: string;
  outcomeLine: string;
}

export interface ResolvedPopularTool {
  tool: ToolConfig;
  href: string;
  categoryLabel: string;
  outcomeLine: string;
  rank: number;
}

export interface GetPopularOptions {
  mode?: RankingMode;
  limit?: number;
  category?: ToolConfig['category'];
}

export const POPULAR_TOOLS_FALLBACK: PopularToolEntry[] = [
  { id: 'word-unscrambler', outcomeLine: 'Paste your letters, get every real word they make.' },
  { id: 'word-finder', outcomeLine: 'Pattern-match with ? and * across the full dictionary.' },
  { id: 'scrabble-helper', outcomeLine: 'Highest-scoring plays from your rack, ranked instantly.' },
  { id: 'percentage-calculator', outcomeLine: 'Percent of, percent change, and mental-math checks in one place.' },
  { id: 'sudoku', outcomeLine: 'Clean, quick Sudoku — easy through expert, no mid-game popups.' },
];

export function getPopularTools(opts: GetPopularOptions = {}): ResolvedPopularTool[] {
  const { mode = 'fallback', limit = 5, category } = opts;

  const entries = resolveEntries(mode, category);
  return entries
    .map((e, i) => {
      const tool = TOOLS_BY_ID[e.id];
      if (!tool || tool.comingSoon) return null;
      return {
        tool,
        href: toolHref(tool),
        categoryLabel: CATEGORIES[tool.category].title,
        outcomeLine: e.outcomeLine,
        rank: i + 1,
      } satisfies ResolvedPopularTool;
    })
    .filter((x): x is ResolvedPopularTool => x !== null)
    .slice(0, limit);
}

function resolveEntries(mode: RankingMode, category?: ToolConfig['category']): PopularToolEntry[] {
  switch (mode) {
    case 'all-time':
    case 'today':
    case 'this-week':
      // Swap point: wire to Cloudflare Analytics / Worker / custom endpoint here.
      // When live data is unavailable or empty, fall through to the fallback list.
      return POPULAR_TOOLS_FALLBACK;
    case 'by-category':
      if (!category) return POPULAR_TOOLS_FALLBACK;
      return POPULAR_TOOLS_FALLBACK.filter((e) => TOOLS_BY_ID[e.id]?.category === category);
    case 'editor-picks':
    case 'fallback':
    default:
      return POPULAR_TOOLS_FALLBACK;
  }
}

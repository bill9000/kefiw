import type { FaqItem, ExampleBlock } from './tools';

export type ContentKind = 'word-list' | 'guide' | 'tool-variant' | 'hub';
export type ContentSection = 'word-tools' | 'guides' | 'calculators' | 'converters' | 'games' | 'health' | 'logic';
export type PageType = 'hub' | 'support' | 'list' | 'tool-variant';

export interface ContentCta {
  href: string;
  label: string;
}

export interface KeyStat {
  label: string;
  value: string;
}

export interface WhenToUseItem {
  toolId: string;
  note: string;
}

export interface ContentPageConfig {
  id: string;
  kind: ContentKind;
  section: ContentSection;
  slug: string;
  title: string;
  h1: string;
  subhead?: string;
  description: string;
  keywords: string[];
  intro: string;
  // word-list-specific
  buildWords?: () => string[];
  minWords?: number;
  listNote?: string;
  wordListHeading?: string;
  sortBy?: 'alpha' | 'length-asc' | 'length-desc' | 'score-desc' | 'preserve';
  flatList?: boolean;
  // editorial — typed sections (primary authoring path)
  outcomeLine?: string;
  howTo?: string[];
  examples?: ExampleBlock[];
  keyPoints?: string[];
  whenToUse?: WhenToUseItem[];
  faq: FaqItem[];
  // ULH-01 aligned — renders as System Brief on primary articles
  thresholds?: { cyan: string; gold: string; magenta: string };
  pivotLink?: { toolId: string; note: string };
  // SOP tone — Brutalist industrial styling for high-heat articles
  toneProfile?: 'sop' | 'default';
  formulaAnchor?: { caption: string; expression: string }; // rendered as JetBrains Mono code block
  logicalGates?: string[]; // ordered decision gates inside SOP shell
  // Inline live-context markers — tokens like {{lm:runway_months}} in typed fields get replaced
  liveMetrics?: Array<{
    token: string; // e.g. 'runway_months' — appears as {{lm:runway_months}} in typed text fields
    metric: 'runway_months' | 'survival_efficiency' | 'cognitive_load' | 'willpower_pct' | 'peptide_concentration_mg_ml' | 'peptide_waste_pct' | 'peptide_potency_pct' | 'peptide_lean_ratio_pct';
    fallback: string;
    decimals?: number;
    suffix?: string;
    prefix?: string;
  }>;
  // Contextual pivot switch — replaces static pivotLink when defined
  pivotSwitch?: {
    critical: { toolId: string; note: string };
    stable: { toolId: string; note: string };
    fallback: { toolId: string; note: string };
  };
  // cross-linking
  relatedIds?: string[];
  relatedLinks?: ContentCta[];
  primaryCta?: ContentCta;
  secondaryCtas?: ContentCta[];
  // cluster
  clusterId?: string;
  pageType?: PageType;
  // guide-specific
  guideCategory?: string;
  bodyHtml?: string; // escape hatch — use typed fields first
  // tool-variant-specific
  variantOfToolId?: string;
  variantProps?: Record<string, unknown>;
}

import { CLUSTER_A } from './content/cluster-a';
import { CLUSTER_E } from './content/cluster-e';
import { SUPPORT_SCRABBLE } from './content/support-scrabble';
import { SUPPORT_UNSCRAMBLE } from './content/support-unscramble';
import { SUPPORT_PATTERN } from './content/support-pattern';
import { SUPPORT_RHYME } from './content/support-rhyme';
import { SUPPORT_WORD_FAMILIES } from './content/support-word-families';
import { SUPPORT_TEXT_CLEANUP } from './content/support-text-cleanup';
import { SUPPORT_EVERYDAY_CALCULATORS } from './content/support-everyday-calculators';
import { SUPPORT_SHOPPING } from './content/support-shopping';
import { SUPPORT_DECISIONS } from './content/support-decisions';
import { SUPPORT_UNITS } from './content/support-units';
import { SUPPORT_DAILY } from './content/support-daily';
import { ARTICLES_WORD_GAMES } from './content/articles-word-games';
import { ARTICLES_WORD_DISCOVERY } from './content/articles-word-discovery';
import { ARTICLES_CALC_EVERYDAY } from './content/articles-calc-everyday';
import { ARTICLES_CALC_DECISIONS } from './content/articles-calc-decisions';
import { ARTICLES_TEXT_TIME } from './content/articles-text-time';
import { ARTICLES_CONVERTERS_GAMES } from './content/articles-converters-games';
import { ARTICLES_DECISIONS_SURVIVAL } from './content/articles-decisions-survival';
import { ARTICLES_DECISIONS_BUSINESS } from './content/articles-decisions-business';
import { ARTICLES_DECISIONS_CASH } from './content/articles-decisions-cash';
import { ARTICLES_DECISIONS_LIFE } from './content/articles-decisions-life';
import { ARTICLES_HEALTH_METABOLIC } from './content/articles-health-metabolic';
import { ARTICLES_HEALTH_PERFORMANCE } from './content/articles-health-performance';
import { ARTICLES_HEALTH_PEPTIDE_PREP } from './content/articles-health-peptide-prep';
import { ARTICLES_HEALTH_PEPTIDE_BIO } from './content/articles-health-peptide-bio';
import { ARTICLES_TRIAD_SCENARIOS } from './content/articles-triad-scenarios';
import { ARTICLES_VIBE_GAMES } from './content/articles-vibe-games';

export const CONTENT_PAGES: ContentPageConfig[] = [
  ...CLUSTER_A,
  ...CLUSTER_E,
  ...SUPPORT_SCRABBLE,
  ...SUPPORT_UNSCRAMBLE,
  ...SUPPORT_PATTERN,
  ...SUPPORT_RHYME,
  ...SUPPORT_WORD_FAMILIES,
  ...SUPPORT_TEXT_CLEANUP,
  ...SUPPORT_EVERYDAY_CALCULATORS,
  ...SUPPORT_SHOPPING,
  ...SUPPORT_DECISIONS,
  ...SUPPORT_UNITS,
  ...SUPPORT_DAILY,
  ...ARTICLES_WORD_GAMES,
  ...ARTICLES_WORD_DISCOVERY,
  ...ARTICLES_CALC_EVERYDAY,
  ...ARTICLES_CALC_DECISIONS,
  ...ARTICLES_TEXT_TIME,
  ...ARTICLES_CONVERTERS_GAMES,
  ...ARTICLES_DECISIONS_SURVIVAL,
  ...ARTICLES_DECISIONS_BUSINESS,
  ...ARTICLES_DECISIONS_CASH,
  ...ARTICLES_DECISIONS_LIFE,
  ...ARTICLES_HEALTH_METABOLIC,
  ...ARTICLES_HEALTH_PERFORMANCE,
  ...ARTICLES_HEALTH_PEPTIDE_PREP,
  ...ARTICLES_HEALTH_PEPTIDE_BIO,
  ...ARTICLES_TRIAD_SCENARIOS,
  ...ARTICLES_VIBE_GAMES,
];

export function contentHref(c: ContentPageConfig): string {
  switch (c.section) {
    case 'word-tools':
      return `/word-tools/${c.slug}/`;
    case 'guides':
      return `/guides/${c.slug}/`;
    case 'calculators':
      return `/calculators/${c.slug}/`;
    case 'converters':
      return `/converters/${c.slug}/`;
    case 'games':
      return `/games/${c.slug}/`;
    case 'health':
      return `/health/${c.slug}/`;
    case 'logic':
      return `/logic/${c.slug}/`;
  }
}

export function contentPageBySlug(section: ContentSection, slug: string): ContentPageConfig | undefined {
  return CONTENT_PAGES.find((c) => c.section === section && c.slug === slug);
}

export function contentPageById(id: string): ContentPageConfig | undefined {
  return CONTENT_PAGES.find((c) => c.id === id);
}

export const CATEGORY_LABEL: Record<ContentSection, string> = {
  'word-tools': 'Word Tools',
  guides: 'Guides',
  calculators: 'Calculators',
  converters: 'Converters',
  games: 'Games',
  health: 'Health',
  logic: 'Logic',
};

export function contentPagesBySection(section: ContentSection): ContentPageConfig[] {
  return CONTENT_PAGES.filter((c) => c.section === section);
}

export function contentPagesByKind(kind: ContentKind): ContentPageConfig[] {
  return CONTENT_PAGES.filter((c) => c.kind === kind);
}

export function contentPagesPublished(): ContentPageConfig[] {
  return CONTENT_PAGES.filter((c) => {
    if (c.kind !== 'word-list') return true;
    const words = c.buildWords?.() ?? [];
    const min = c.minWords ?? 10;
    return words.length >= min;
  });
}

function assertNoDuplicateSlugs(): void {
  const seen = new Set<string>();
  for (const c of CONTENT_PAGES) {
    const k = `${c.section}/${c.slug}`;
    if (seen.has(k)) throw new Error(`[content-pages] Duplicate slug: ${k}`);
    seen.add(k);
  }
}

assertNoDuplicateSlugs();

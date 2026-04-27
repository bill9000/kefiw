import type { FaqItem, ExampleBlock } from './tools';

export type ContentKind = 'word-list' | 'guide' | 'tool-variant' | 'hub';
export type ContentSection = 'word-tools' | 'guides' | 'calculators' | 'converters' | 'games' | 'health' | 'logic';
export type PageType = 'hub' | 'support' | 'list' | 'tool-variant';

export interface ContentCta {
  href: string;
  label: string;
}

export interface ContentImageAsset {
  // Repo-relative prompt source used to generate the guide image.
  promptPath?: string;
  // Repo-relative generated files kept beside the prompt for revision history.
  sourceImage?: string;
  sourceSocialImage?: string;
  // Public hero/card image paths, relative to /public.
  image?: string;
  socialImage?: string;
}

export interface KeyStat {
  label: string;
  value: string;
}

export type WhenToUseItem =
  | { toolId: string; note: string; articleId?: never }
  | { articleId: string; note: string; toolId?: never };

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
    metric: 'runway_months' | 'survival_efficiency' | 'cognitive_load' | 'willpower_pct' | 'reagent_concentration_mg_ml' | 'reagent_waste_pct' | 'reagent_potency_pct' | 'mass_loss_pct';
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
  // Writer-AI enrichment — rendered between intro/keypoints and FAQ on guide pages.
  // Contains markdown prose (H2 sections, paragraphs, inline links).
  longformMarkdown?: string;
  metaDescription?: string;
  // Google Discover / social hook — emitted as og:title + twitter:title only.
  // Formula: named topic + one emotion + one concrete promise, ~60–70 chars,
  // aligned to a real PAA query. Only set on substantial informative articles;
  // the SEO-optimized `title` still governs the <title> tag and search listings.
  discoverHeadline?: string;
  // Per-article hero image for Google Discover + social cards. Path relative
  // to /public (e.g. '/og/scrabble-blanks.jpg'). Minimum 1200px wide, ~16:9,
  // no text/logos/watermarks. Falls back to the site-wide /og-image.png.
  ogImage?: string;
  // Editable source + generated assets for the guide image. If filenames follow
  // docs/images/{slug}.md and /og/{slug}-social.png, this is filled by default
  // for content pages with a discoverHeadline.
  imageAsset?: ContentImageAsset;
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
import { ARTICLES_HEALTH_CLUSTER_GUIDES } from './content/articles-health-cluster-guides';
import { ARTICLES_TRIAD_SCENARIOS } from './content/articles-triad-scenarios';
import { ARTICLES_VIBE_GAMES } from './content/articles-vibe-games';
import { ARTICLES_BRAIN_GAMES } from './content/articles-brain-games';
import { ARTICLES_RELATIONSHIP_GAMES } from './content/articles-relationship-games';
import { ARTICLES_LOGIC_GUIDES } from './content/articles-logic-guides';
import { ARTICLES_CLUSTER_OVERVIEW_GUIDES } from './content/articles-cluster-overview-guides';

// Writer-AI V3 enhancement overrides (merged in at export time below).
import { SCRABBLE_ENHANCEMENTS } from './content/scrabble-enhancements';
import { TEXT_CLEANUP_ENHANCEMENTS } from './content/text-cleanup-enhancements';
import { UNSCRAMBLE_ENHANCEMENTS } from './content/unscramble-enhancements';
import { WORD_FAMILIES_ENHANCEMENTS } from './content/word-families-enhancements';
import {
  SCRABBLE_ARTICLE_PATCHES,
  SCRABBLE_NEW_GUIDES,
  type ArticlePatch,
} from './content/scrabble-docs-update';

const RAW_CONTENT_PAGES: ContentPageConfig[] = [
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
  ...ARTICLES_HEALTH_CLUSTER_GUIDES,
  ...ARTICLES_TRIAD_SCENARIOS,
  ...ARTICLES_VIBE_GAMES,
  ...ARTICLES_BRAIN_GAMES,
  ...ARTICLES_RELATIONSHIP_GAMES,
  ...ARTICLES_LOGIC_GUIDES,
  ...ARTICLES_CLUSTER_OVERVIEW_GUIDES,
];

const ENHANCEMENT_OVERRIDES: Record<string, Partial<ContentPageConfig>> = {
  ...SCRABBLE_ENHANCEMENTS,
  ...TEXT_CLEANUP_ENHANCEMENTS,
  ...UNSCRAMBLE_ENHANCEMENTS,
  ...WORD_FAMILIES_ENHANCEMENTS,
};

function withDefaultImageAsset(p: ContentPageConfig): ContentPageConfig {
  if (!p.discoverHeadline && !p.imageAsset) return p;
  return {
    ...p,
    imageAsset: {
      promptPath: `docs/images/${p.slug}.md`,
      sourceImage: `docs/images/${p.slug}.png`,
      sourceSocialImage: `docs/images/${p.slug}-social.png`,
      image: `/og/${p.slug}.png`,
      socialImage: `/og/${p.slug}-social.png`,
      ...(p.imageAsset ?? {}),
    },
  };
}

// Apply sparse append-style patches (new FAQs, longform sections, relatedIds)
// AFTER the V3 spread overrides so doc updates layer on top of V3 content.
function applyArticlePatch(base: ContentPageConfig, patch: ArticlePatch): ContentPageConfig {
  const faq = patch.appendFaq ? [...(base.faq ?? []), ...patch.appendFaq] : base.faq;
  const relatedSet = new Set([...(base.relatedIds ?? []), ...(patch.appendRelatedIds ?? [])]);
  const relatedIds = patch.appendRelatedIds ? Array.from(relatedSet) : base.relatedIds;
  const longformMarkdown = patch.appendLongform
    ? (base.longformMarkdown ?? '') + '\n' + patch.appendLongform
    : base.longformMarkdown;
  return { ...base, faq, relatedIds, longformMarkdown };
}

function guideFaqSupplements(page: ContentPageConfig): FaqItem[] {
  const topic = `${page.section} ${page.guideCategory ?? ''}`.toLowerCase();

  if (page.section === 'health') {
    return [
      {
        q: 'Is this health guide medical advice?',
        a: 'No, this health guide is educational context, not medical advice, diagnosis, treatment, or licensed clinical judgment. Use it to understand variables and vocabulary before a clinician conversation. If symptoms are urgent, severe, or changing quickly, use emergency services or a nurse line instead of a web guide.',
        faq_intent: 'trust',
      },
      {
        q: 'How should I use a health calculator safely?',
        a: 'Use a health calculator to organize questions and understand a measurement before acting on the result. Health outputs depend on assumptions, population averages, and self-reported inputs. Recheck units, timing, and context, then take anything high-risk, abnormal, or confusing to a qualified professional.',
        faq_intent: 'how-to',
      },
      {
        q: 'What input changes a health calculator result most?',
        a: 'The highest-leverage input is usually body size, time, intensity, concentration, or symptom severity. Small errors in those fields can move the output meaningfully. If the result seems surprising, change one input at a time and watch which assumption drives the swing.',
        faq_intent: 'edge-case',
      },
      {
        q: 'When should I not rely on a health guide?',
        a: 'Do not rely on a health guide when the situation is acute, legally sensitive, medically complex, or outside the stated assumptions. A guide can explain logic and rough ranges, but it cannot examine you, review labs, know your medication history, or replace professional care when stakes are high.',
        faq_intent: 'trust',
      },
      {
        q: 'Can health tools help track a trend over time?',
        a: 'Yes, health tools can help track direction when you use the same inputs and method consistently. Trend use is usually more reliable than obsessing over one isolated output. Keep notes on sleep, training, hydration, illness, and measurement conditions so changes are easier to interpret.',
        faq_intent: 'how-to',
      },
    ];
  }

  if (page.section === 'calculators' || page.section === 'converters' || topic.includes('calculator') || topic.includes('conversion')) {
    return [
      {
        q: 'How accurate are online calculators and converters?',
        a: 'Online calculators are only as accurate as the numbers, units, assumptions, and rounding choices you enter. Recheck the input values first, then compare the formula against your real situation. For legal, tax, medical, financial, or professional decisions, treat the result as a planning estimate, not advice.',
        faq_intent: 'trust',
      },
      {
        q: 'What inputs should I double-check first?',
        a: 'Double-check units, dates, percentages, decimal placement, and whether the input is before-tax, after-tax, gross, net, original, or final. Most calculator mistakes come from feeding the right formula the wrong base. If the result feels off, rebuild it from a simple worked example.',
        faq_intent: 'troubleshooting',
      },
      {
        q: 'Why do two calculators sometimes give different answers?',
        a: 'Two calculators may round at different steps, use different defaults, or interpret the same label differently. Percent, time, finance, and unit tools are especially sensitive to basis and rounding rules. Compare the formula, not just the final number, before deciding which result to trust.',
        faq_intent: 'comparison',
      },
      {
        q: 'Can I use a calculator for professional decisions?',
        a: 'Use calculators to estimate, compare, or check arithmetic, not as professional advice or a final authority. The tool cannot know contracts, local rules, safety requirements, tax treatment, medical context, or legal obligations unless those assumptions are explicitly built into the page. Verify high-stakes decisions independently.',
        faq_intent: 'trust',
      },
      {
        q: 'When should I calculate the answer manually instead?',
        a: 'Calculate manually when you need to audit the formula, teach the concept, or explain every step to someone else. The fastest workflow is often both: do a rough mental or written estimate first, then use the Kefiw calculator to catch arithmetic slips and rounding differences.',
        faq_intent: 'how-to',
      },
    ];
  }

  if (page.section === 'games' || topic.includes('game') || topic.includes('puzzle')) {
    return [
      {
        q: 'How do I use a puzzle helper without spoiling the game?',
        a: 'Use a puzzle helper after your own first attempt, not before every move or answer. Read the rules, try a round cold, then use the guide to understand misses, patterns, and better strategy. That keeps the puzzle fun while turning mistakes into practice.',
        faq_intent: 'how-to',
      },
      {
        q: 'What should I learn first in a new puzzle game?',
        a: 'Learn the rules, win condition, scoring, and one opening habit before chasing advanced tactics. Most players improve fastest by removing obvious mistakes: unclear turns, wasted guesses, ignored constraints, or overusing hints. Strategy only matters once the basic loop is automatic.',
        faq_intent: 'definition',
      },
      {
        q: 'Can a guide actually make me better at puzzles?',
        a: 'A guide can help if you use it to review decisions, not simply reveal answers. Short repeatable sessions build pattern memory, elimination skill, and confidence. Track what caused mistakes, then replay with one focus, such as openings, probability, constraints, or recovery after a bad guess.',
        faq_intent: 'how-to',
      },
      {
        q: 'Why am I still stuck after reading the rules?',
        a: 'You may understand the rule but not yet recognize the pattern quickly under pressure. Slow down, name the constraint out loud, and solve one smaller section first. If the game allows hints, use the smallest hint that changes your next decision instead of revealing the full answer.',
        faq_intent: 'troubleshooting',
      },
      {
        q: `Should I use helpers during a live game?`,
        a: `Use helpers only when they match the spirit and rules of the game you are playing. Solo practice, learning, and casual play are different from competitive or shared-score play. When other people are involved, agree on whether tools are allowed before the round starts.`,
        faq_intent: 'trust',
      },
    ];
  }

  if (page.section === 'logic' || topic.includes('finance') || topic.includes('business') || topic.includes('cash')) {
    return [
      {
        q: 'How should I use a decision framework in real life?',
        a: 'Use a decision framework to expose the tradeoff, not to outsource the decision. Write down the inputs, compare the output with your constraints, then ask what would change the answer. The strongest use is scenario testing: base case, conservative case, and failure case.',
        faq_intent: 'how-to',
      },
      {
        q: 'Is this financial, legal, or tax advice?',
        a: 'No, this is not legal, financial, tax, medical, or professional advice unless the page explicitly says that use case is supported. It organizes assumptions so you can inspect them. Verify high-stakes choices with qualified people who can review facts, contracts, regulations, and downside risk.',
        faq_intent: 'trust',
      },
      {
        q: 'What assumption matters most in a decision model?',
        a: 'The most important assumption is usually the one you are least certain about and most emotionally attached to. Change that input first. If the recommendation flips after a small change, the decision is fragile and needs more evidence before you treat the model as useful.',
        faq_intent: 'edge-case',
      },
      {
        q: 'Why does decision math feel stricter than intuition?',
        a: 'Decision math feels strict because it prices delay, opportunity cost, compounding, or error cost that intuition often ignores. That does not make the output automatically correct. It means the guide is forcing hidden assumptions into the open so you can challenge them directly.',
        faq_intent: 'comparison',
      },
      {
        q: 'When should I ignore a decision-model output?',
        a: 'Ignore or downgrade a model output when the inputs are guesses, the costs are irreversible, or the model excludes a constraint that dominates your situation. A useful result should survive conservative assumptions. If it only works under optimistic inputs, treat it as research prompt, not action.',
        faq_intent: 'trust',
      },
    ];
  }

  return [
    {
      q: 'How should I use this guide with a Kefiw tool?',
      a: 'Use the guide as the plan and the linked Kefiw tool as the check. Read the steps first, try the move manually, then use the tool to compare outputs, catch edge cases, and decide whether the result actually fits your task.',
      faq_intent: 'how-to',
    },
    {
      q: 'What mistake do tool guides help avoid?',
      a: 'Tool guides help avoid using a utility mechanically without understanding what you are trying to accomplish. Most word, writing, and text utilities are fast, but speed can hide context mistakes. Know whether you are solving a puzzle, cleaning copy, drafting a line, or checking a rule.',
      faq_intent: 'troubleshooting',
    },
    {
      q: 'Can a tool guide help me learn the skill?',
      a: 'A tool guide can help you learn if you pause before accepting the output and ask why it worked. Compare your first guess with the tool result, look for the rule or pattern, and repeat that review. Passive copying solves one task; active review builds the skill.',
      faq_intent: 'how-to',
    },
    {
      q: 'When should I not rely on a tool result?',
      a: 'Do not rely on a tool result when the final answer depends on style, pronunciation, game-specific rules, brand names, proper nouns, or private context. The guide and tool can narrow the work, but the final choice still needs a human check for meaning, tone, legality, or fit.',
      faq_intent: 'trust',
    },
    {
      q: `Why might the tool result differ from what I expected?`,
      a: `The result may differ because the tool follows a dictionary, pattern rule, unit rule, or text transform more literally than a person would. Check the accepted word list, wildcard pattern, casing rule, or input format. If needed, use the related guide to diagnose the mismatch.`,
      faq_intent: 'troubleshooting',
    },
  ];
}

const CLUSTER_HUB_LINKS: Record<string, ContentCta> = {
  scrabble: { href: '/word-tools/scrabble-word-help/', label: 'Scrabble & Word Game Help' },
  unscramble: { href: '/word-tools/unscramble-and-anagram-help/', label: 'Unscramble & Anagram Help' },
  pattern: { href: '/word-tools/pattern-and-puzzle-solvers/', label: 'Pattern & Puzzle Solvers' },
  rhyme: { href: '/word-tools/rhyme-and-syllable-help/', label: 'Rhyme & Syllable Help' },
  'word-families': { href: '/word-tools/word-families-and-patterns/', label: 'Word Families & Patterns' },
  'text-cleanup': { href: '/word-tools/text-cleanup-tools/', label: 'Text Cleanup Tools' },
  'everyday-calculators': { href: '/calculators/everyday-calculators/', label: 'Everyday Calculators' },
  shopping: { href: '/calculators/saving-and-spending-tools/', label: 'Saving & Spending Calculators' },
  units: { href: '/converters/unit-conversion-tools/', label: 'Unit Conversion Tools' },
  daily: { href: '/games/daily-challenges/', label: 'Daily Challenges' },
  'relationship-games': { href: '/games/relationship-games/', label: 'Relationship Games' },
  'bio-maintenance': { href: '/health/biological-maintenance/', label: 'Biological Maintenance' },
  'body-composition': { href: '/health/body-composition/', label: 'Body Composition & Health' },
  'structural-output': { href: '/health/structural-output/', label: 'Structural Output' },
  'bio-logistics': { href: '/health/bio-chemical-logistics/', label: 'Bio-Chemical Logistics' },
  'environmental-stressors': { href: '/health/environmental-stressors/', label: 'Environmental Stressors' },
  'cognitive-throughput': { href: '/logic/cognitive-throughput/', label: 'Cognitive Throughput' },
  'logistical-mobility': { href: '/logic/logistical-mobility/', label: 'Logistical Mobility' },
};

function guideRelatedSupplements(page: ContentPageConfig): ContentCta[] {
  const topic = `${page.section} ${page.guideCategory ?? ''} ${page.slug} ${page.title}`.toLowerCase();
  const clusterLink = page.clusterId ? CLUSTER_HUB_LINKS[page.clusterId] : undefined;
  const fallbackBySection: Record<ContentSection, ContentCta[]> = {
    'word-tools': [
      { href: '/word-tools/', label: 'All Word Tools' },
      { href: '/guides/', label: 'All Guides' },
    ],
    guides: [
      { href: '/guides/', label: 'All Guides' },
      { href: '/word-tools/', label: 'Word Tools' },
    ],
    calculators: [
      { href: '/calculators/', label: 'All Calculators' },
      CLUSTER_HUB_LINKS['everyday-calculators'],
    ],
    converters: [
      { href: '/converters/', label: 'All Converters' },
      CLUSTER_HUB_LINKS.units,
    ],
    games: [
      { href: '/games/', label: 'All Games' },
      CLUSTER_HUB_LINKS.daily,
    ],
    health: [
      { href: '/health/', label: 'All Health Tools' },
      CLUSTER_HUB_LINKS['bio-maintenance'],
    ],
    logic: [
      { href: '/logic/', label: 'All Logic Tools' },
      CLUSTER_HUB_LINKS['cognitive-throughput'],
    ],
  };

  const topicalLinks: ContentCta[] = [];
  if (topic.includes('scrabble') || topic.includes('word game')) topicalLinks.push(CLUSTER_HUB_LINKS.scrabble);
  if (topic.includes('unscrambl') || topic.includes('anagram')) topicalLinks.push(CLUSTER_HUB_LINKS.unscramble);
  if (topic.includes('wordle') || topic.includes('crossword') || topic.includes('hangman') || topic.includes('pattern')) topicalLinks.push(CLUSTER_HUB_LINKS.pattern);
  if (topic.includes('rhyme') || topic.includes('syllable') || topic.includes('haiku')) topicalLinks.push(CLUSTER_HUB_LINKS.rhyme);
  if (topic.includes('prefix') || topic.includes('suffix') || topic.includes('word famil')) topicalLinks.push(CLUSTER_HUB_LINKS['word-families']);
  if (topic.includes('text') || topic.includes('case') || topic.includes('line') || topic.includes('counter')) topicalLinks.push(CLUSTER_HUB_LINKS['text-cleanup']);
  if (topic.includes('discount') || topic.includes('tip') || topic.includes('shopping') || topic.includes('cash') || topic.includes('finance')) topicalLinks.push(CLUSTER_HUB_LINKS.shopping);
  if (topic.includes('percent') || topic.includes('date') || topic.includes('average') || topic.includes('math')) topicalLinks.push(CLUSTER_HUB_LINKS['everyday-calculators']);
  if (topic.includes('unit') || topic.includes('converter') || topic.includes('metric')) topicalLinks.push(CLUSTER_HUB_LINKS.units);
  if (topic.includes('daily') || topic.includes('sudoku') || topic.includes('puzzle')) topicalLinks.push(CLUSTER_HUB_LINKS.daily);
  if (topic.includes('relationship') || topic.includes('date night') || topic.includes('couple') || topic.includes('flirty')) topicalLinks.push(CLUSTER_HUB_LINKS['relationship-games']);
  if (topic.includes('cognitive') || topic.includes('focus') || topic.includes('decision fatigue')) topicalLinks.push(CLUSTER_HUB_LINKS['cognitive-throughput']);
  if (topic.includes('mobility') || topic.includes('subscription') || topic.includes('upskill') || topic.includes('geo')) topicalLinks.push(CLUSTER_HUB_LINKS['logistical-mobility']);

  return [
    ...(clusterLink ? [clusterLink] : []),
    ...topicalLinks,
    ...fallbackBySection[page.section],
  ];
}

function applyGuideQualitySupplements(page: ContentPageConfig): ContentPageConfig {
  if (page.kind !== 'guide') return page;
  const existingFaq = page.faq ?? [];
  const existingQuestions = new Set(existingFaq.map((item) => item.q.trim().toLowerCase()));
  const faqAdditions = existingFaq.length >= 5 ? [] : guideFaqSupplements(page)
    .filter((item) => !existingQuestions.has(item.q.trim().toLowerCase()))
    .slice(0, 5 - existingFaq.length);
  const relatedIds = page.relatedIds ?? [];
  const relatedLinks = page.relatedLinks ?? [];
  const relatedCount = relatedIds.length + relatedLinks.length;
  const existingRelatedHrefs = new Set(relatedLinks.map((link) => link.href));
  const existingRelatedLabels = new Set(relatedLinks.map((link) => link.label.trim().toLowerCase()));
  const relatedAdditions = relatedCount >= 2 ? [] : guideRelatedSupplements(page)
    .filter((link) => !existingRelatedHrefs.has(link.href))
    .filter((link) => !existingRelatedLabels.has(link.label.trim().toLowerCase()))
    .slice(0, 2 - relatedCount);

  if (!faqAdditions.length && !relatedAdditions.length) return page;
  return {
    ...page,
    faq: faqAdditions.length ? [...existingFaq, ...faqAdditions] : page.faq,
    relatedLinks: relatedAdditions.length ? [...relatedLinks, ...relatedAdditions] : page.relatedLinks,
  };
}

const mergedPages: ContentPageConfig[] = RAW_CONTENT_PAGES.map((p) => {
  const override = ENHANCEMENT_OVERRIDES[p.id];
  const afterOverride: ContentPageConfig = override ? { ...p, ...override } : p;
  const patch = SCRABBLE_ARTICLE_PATCHES[p.id];
  const afterPatch = patch ? applyArticlePatch(afterOverride, patch) : afterOverride;
  return applyGuideQualitySupplements(afterPatch);
}).map(withDefaultImageAsset);

export const CONTENT_PAGES: ContentPageConfig[] = [
  ...mergedPages,
  ...SCRABBLE_NEW_GUIDES.map(applyGuideQualitySupplements).map(withDefaultImageAsset),
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

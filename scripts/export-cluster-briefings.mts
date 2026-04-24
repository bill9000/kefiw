// Export one self-contained JSON briefing per cluster.
// Usage:
//   npx tsx scripts/export-cluster-briefings.mts              -> all clusters
//   npx tsx scripts/export-cluster-briefings.mts rhyme        -> single cluster
//
// Output: docs/article-briefings/<cluster-slug>.json
//
// The JSON is self-contained: writer AI never needs to read code.
// Writer fills `enhanced` + `longform_markdown` per article/tool, we re-import.

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import { CLUSTERS } from '../src/data/clusters.ts';
import { TOOLS } from '../src/data/tools.ts';
import { CONTENT_PAGES } from '../src/data/content-pages.ts';
import { TOOL_LOGIC } from '../src/data/tool-logic.ts';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '..', 'docs', 'article-briefings');

function wordCount(parts: Array<string | undefined>): number {
  return parts
    .filter((p): p is string => typeof p === 'string' && p.length > 0)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function toolToBrief(toolId: string) {
  const t = TOOLS.find((x) => x.id === toolId);
  if (!t) return { id: toolId, missing: true };
  const currentProse = [
    t.description,
    t.intro,
    ...(t.howTo ?? []),
    ...(t.examples?.map((e) => `${e.title}: ${e.body}`) ?? []),
    ...(t.faq?.map((f) => `${f.q} ${f.a}`) ?? []),
  ];
  const logic = TOOL_LOGIC[t.id] ?? null;
  return {
    id: t.id,
    slug: t.slug,
    category: t.category,
    url: `/${t.category}/${t.slug}/`,
    title: t.title,
    h1: t.h1,
    current_word_count: wordCount(currentProse),
    current: {
      description: t.description,
      keywords: t.keywords,
      intro: t.intro,
      outcomeLine: t.outcomeLine ?? null,
      howTo: t.howTo ?? [],
      examples: t.examples ?? [],
      faq: t.faq ?? [],
      relatedIds: t.relatedIds ?? [],
    },
    tool_logic: logic,
    _writer_note: logic
      ? 'tool_logic is verified from source code. Claim only what appears in content_guidance.claim_allowed; avoid anything in claim_forbidden.'
      : 'tool_logic not yet mapped for this tool. Describe it only from current.description / intro / examples. Do not claim specific algorithms, data sources, or UI filters that are not listed above.',
    enhanced: null,
    longform_markdown: null,
    notes_for_writer: [
      'Tool pages get a tight intro (60-100 words) + howTo + examples + FAQ.',
      'Do NOT write long-form prose on the tool page — that belongs in the linked articles.',
      'Expand the FAQ if it has fewer than 5 entries. Follow PAA rules.',
      'Respect tool_logic: do not invent filters, data sources, or behaviors not present in ui_fields / processing_steps.',
    ],
  };
}

function articleToBrief(id: string) {
  const a = CONTENT_PAGES.find((x) => x.id === id);
  if (!a) return { id, missing: true };
  const currentProse = [
    a.subhead,
    a.outcomeLine,
    a.description,
    a.intro,
    ...(a.keyPoints ?? []),
    ...(a.examples?.map((e) => `${e.title}: ${e.body}`) ?? []),
    ...(a.whenToUse?.map((w) => `${w.toolId}: ${w.note}`) ?? []),
    ...(a.faq?.map((f) => `${f.q} ${f.a}`) ?? []),
  ];
  const sectionPath: Record<string, string> = {
    'word-tools': '/word-tools',
    guides: '/guides',
    calculators: '/calculators',
    converters: '/converters',
    games: '/games',
    health: '/health',
    logic: '/logic',
  };
  return {
    id: a.id,
    slug: a.slug,
    kind: a.kind,
    pageType: a.pageType ?? null,
    section: a.section,
    url: `${sectionPath[a.section] ?? '/' + a.section}/${a.slug}/`,
    title: a.title,
    h1: a.h1,
    subhead: a.subhead ?? null,
    current_word_count: wordCount(currentProse),
    target_word_count: 1200,
    current: {
      description: a.description,
      keywords: a.keywords,
      outcomeLine: a.outcomeLine ?? null,
      intro: a.intro,
      keyPoints: a.keyPoints ?? [],
      examples: a.examples ?? [],
      whenToUse: a.whenToUse ?? [],
      faq: a.faq ?? [],
      relatedIds: a.relatedIds ?? [],
    },
    enhanced: null, // writer fills: partial or full override of `current` fields
    longform_markdown: null, // writer fills: 800-1200 word prose body rendered between intro and FAQ
    notes_for_writer: [
      'Keep the existing structured fields but tighten/expand as needed.',
      'Main expansion goes into longform_markdown as 4-6 H2 sections.',
      'Preserve every relatedId and toolId — those are internal links.',
    ],
  };
}

const FAQ_RULES = {
  format: 'People Also Ask (PAA) optimized',
  question_starters: ['How', 'Why', 'What', 'Is', 'Can', 'Does', 'Should', 'When'],
  rules: [
    'Each question must read like a real search query — not marketing-speak.',
    'First sentence of answer is a complete standalone 15-25 word definition/answer (Google quotes it directly).',
    'Full answer 40-60 words. Tight. Front-load the answer.',
    'Cover distinct intents: definition, comparison, edge-case, how-to, troubleshooting. Not 3 rewordings of the same angle.',
    'Include one target keyword in at least half the questions.',
    'Add a faq_intent tag per entry: "definition" | "comparison" | "edge-case" | "how-to" | "troubleshooting" | "cost" | "trust"',
  ],
  target_count: '5-7 entries per article, 4-6 per tool page',
};

const LONGFORM_RULES = {
  target_length: '800-1200 words of markdown prose',
  structure: [
    '## H2 section 1 — deeper "what is it" / definition with context',
    '## H2 section 2 — the mechanic / how it works (with one small example)',
    '## H2 section 3 — when to use vs when to avoid',
    '## H2 section 4 — worked example or walkthrough',
    '## H2 section 5 — pitfalls / common mistakes (optional)',
    '## H2 section 6 — tool-specific tips (link out to the tool)',
  ],
  tone: 'Concrete, useful, first-person-plural light. No filler. No "in conclusion". Short paragraphs.',
  links: [
    'Every time you mention a sibling tool in this cluster, link it with the exact URL from this brief (tools[].url).',
    'Every time you mention a sibling article, link it with the exact URL from this brief (articles[].url).',
    'Do not invent URLs or link to external competitors.',
  ],
  forbidden: [
    'Medical/legal/financial advice language ("you should", "we recommend") — use neutral framing.',
    'Em-dash overuse (max 2 per section).',
    'Generic SEO boilerplate ("in today\'s fast-paced world").',
  ],
};

function buildBrief(clusterSlug: string) {
  const c = CLUSTERS.find((x) => x.slug === clusterSlug);
  if (!c) throw new Error(`Unknown cluster: ${clusterSlug}`);

  const tools = c.featuredToolIds.map(toolToBrief);
  const articleIds = [...(c.featuredSupportIds ?? []), ...(c.featuredListIds ?? [])];
  const articles = articleIds.map(articleToBrief);

  const linkMap: Record<string, string[]> = {};
  for (const a of articles) {
    if ('current' in a && a.current) {
      linkMap[a.id] = a.current.relatedIds.filter((r: string) => {
        return tools.some((t) => 'id' in t && t.id === r) || articles.some((x) => x.id === r);
      });
    }
  }

  return {
    $schema_version: 1,
    exported_at: new Date().toISOString(),
    cluster: {
      slug: c.slug,
      section: c.section,
      hubSlug: c.hubSlug,
      url: `/${c.section}/${c.hubSlug}/`,
      title: c.title,
      h1: c.h1,
      subhead: c.subhead,
      intro: c.intro,
      description: c.description,
      keywords: c.keywords,
      faq: c.faq,
      relatedClusterSlugs: c.relatedClusterSlugs,
    },
    tools,
    articles,
    link_map: linkMap,
    enhancement_brief: {
      goal: 'Lift each article from short-form summary to authority-grade long-form. Target 1,200+ words per article while keeping the structured fields crisp.',
      per_article_outputs: [
        '1. Fill `enhanced` with any structured-field overrides (usually: tighter intro, expanded keyPoints, more examples, richer FAQ).',
        '2. Fill `longform_markdown` with 800-1200 word prose body (markdown, H2 sections only — no H1).',
        '3. Do not modify `current` — that is the baseline snapshot for diffing.',
        '4. Leave every id/slug/url untouched.',
      ],
      faq_rules: FAQ_RULES,
      longform_rules: LONGFORM_RULES,
      internal_linking: {
        rule: 'Use only URLs that appear in this JSON. Prefer linking to sibling tools/articles in THIS cluster over outbound links.',
        tool_urls: tools.filter((t) => 'url' in t).map((t) => ({ id: (t as any).id, url: (t as any).url })),
        article_urls: articles.filter((a) => 'url' in a).map((a) => ({ id: (a as any).id, url: (a as any).url })),
      },
      quality_gates: [
        'No fabricated facts — if uncertain, phrase as "in practice" or remove.',
        'Every H2 section earns its space — cut if it restates the intro.',
        'Zero AI-tells: "it is important to note", "in conclusion", "let us delve", "furthermore".',
      ],
    },
  };
}

// --- main ---
const targetSlug = process.argv[2];
const targets = targetSlug ? [targetSlug] : CLUSTERS.map((c) => c.slug);

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const slug of targets) {
  const brief = buildBrief(slug);
  // Convention: baseline export lives at {slug}-V2.json so the V3 enhanced
  // return from the writer (which arrives as {slug}-V3-enhanced.json) can
  // sit alongside it without name collision.
  const out = path.join(OUT_DIR, `${slug}-V2.json`);
  fs.writeFileSync(out, JSON.stringify(brief, null, 2) + '\n', 'utf8');
  const toolCount = brief.tools.length;
  const articleCount = brief.articles.length;
  const totalWc = brief.articles.reduce(
    (acc: number, a: any) => acc + (a.current_word_count ?? 0),
    0,
  );
  console.log(
    `[${slug}] tools=${toolCount} articles=${articleCount} total_wc=${totalWc} -> ${path.relative(process.cwd(), out)}`,
  );
}

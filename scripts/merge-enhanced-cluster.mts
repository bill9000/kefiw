// Merge a writer-AI V3-enhanced JSON briefing back into the data layer.
// Output: a single per-cluster override module (for articles) + a dump of
// tool overrides written to stdout for inline application, plus a
// writer-insights sidecar with serp_research / adsense_readiness / audit_notes.
//
// Usage:
//   npx tsx scripts/merge-enhanced-cluster.mts docs/article-briefings/scrabble-V3-enhanced.json scrabble

import fs from 'node:fs';
import path from 'node:path';

const [, , briefingPath, clusterSlug] = process.argv;
if (!briefingPath || !clusterSlug) {
  console.error('usage: npx tsx scripts/merge-enhanced-cluster.mts <v3-json> <cluster-slug>');
  process.exit(1);
}

const brief = JSON.parse(fs.readFileSync(briefingPath, 'utf8'));

// --- field mapping (writer snake_case → our camelCase) ---------------------
// Writer fields we consume for articles:
const ARTICLE_FIELDS: Record<string, string> = {
  description: 'description',
  meta_description: 'metaDescription',
  intro: 'intro',
  outcomeLine: 'outcomeLine',
  keyPoints: 'keyPoints',
  examples: 'examples',
  whenToUse: 'whenToUse',
  faq: 'faq',
  relatedIds: 'relatedIds',
  // title / h1 / subhead left untouched (writer preserved them)
};

// Writer fields we consume for tools. suggested_tool_enhancements is handled
// separately because the writer emits a structured object (existing_features_to_preserve,
// proposed_features[]) but our schema expects string[].
const TOOL_FIELDS: Record<string, string> = {
  description: 'description',
  meta_description: 'metaDescription',
  intro: 'intro',
  outcomeLine: 'outcomeLine',
  howTo: 'howTo',
  examples: 'examples',
  faq: 'faq',
  use_cases: 'useCases',
  common_mistakes: 'commonMistakes',
  limitations: 'limitations',
  keywords: 'keywords',
};

// Writer sometimes ships rich example objects ({ title, input, settings,
// expected_behavior, why_it_helps }) that don't match our ExampleBlock
// schema (just { title, body }). Fold the extra fields into `body`.
function adaptExamples(raw: unknown): unknown {
  if (!Array.isArray(raw)) return raw;
  return raw.map((ex) => {
    if (!ex || typeof ex !== 'object') return ex;
    const e = ex as Record<string, unknown>;
    // Already in schema — keep as-is.
    if (typeof e.body === 'string' && !e.input && !e.settings && !e.expected_behavior && !e.why_it_helps) {
      return { title: e.title, body: e.body };
    }
    const parts: string[] = [];
    if (typeof e.input === 'string' && e.input.trim()) parts.push(`Input: ${e.input}`);
    if (typeof e.settings === 'string' && e.settings.trim()) parts.push(`Settings: ${e.settings}`);
    if (typeof e.expected_behavior === 'string' && e.expected_behavior.trim()) parts.push(e.expected_behavior);
    if (typeof e.why_it_helps === 'string' && e.why_it_helps.trim()) parts.push(`Why it helps: ${e.why_it_helps}`);
    if (typeof e.body === 'string' && e.body.trim()) parts.unshift(e.body);
    return { title: typeof e.title === 'string' ? e.title : 'Example', body: parts.join(' · ') };
  });
}

function flattenSuggestedEnhancements(raw: unknown): string[] | undefined {
  if (!raw) return undefined;
  if (Array.isArray(raw)) {
    return raw.filter((x): x is string => typeof x === 'string');
  }
  if (typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const proposals = (obj.proposed_features ?? obj.proposed_features_ranked) as unknown;
    if (Array.isArray(proposals)) {
      return proposals
        .map((p) => {
          if (typeof p === 'string') return p;
          if (p && typeof p === 'object' && typeof (p as { feature?: unknown }).feature === 'string') {
            return (p as { feature: string }).feature;
          }
          return null;
        })
        .filter((x): x is string => !!x);
    }
  }
  return undefined;
}

function pickMapped(source: Record<string, unknown>, map: Record<string, string>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [writerKey, ourKey] of Object.entries(map)) {
    if (source[writerKey] !== undefined && source[writerKey] !== null) {
      out[ourKey] = ourKey === 'examples' ? adaptExamples(source[writerKey]) : source[writerKey];
    }
  }
  return out;
}

// --- build article overrides -----------------------------------------------
interface ArticleOverride extends Record<string, unknown> {
  longformMarkdown?: string;
}

const articleOverrides: Record<string, ArticleOverride> = {};
for (const a of brief.articles) {
  if (!a.enhanced && !a.longform_markdown) continue;
  const override: ArticleOverride = a.enhanced ? pickMapped(a.enhanced, ARTICLE_FIELDS) : {};
  if (a.longform_markdown) override.longformMarkdown = a.longform_markdown;
  articleOverrides[a.id] = override;
}

// --- build tool overrides --------------------------------------------------
const toolOverrides: Record<string, Record<string, unknown>> = {};
const toolNonSchemaNotes: Record<string, Record<string, unknown>> = {}; // user_scenarios, tips, internal_links, schema_suggestions
for (const t of brief.tools) {
  if (!t.enhanced) continue;
  const override = pickMapped(t.enhanced, TOOL_FIELDS);
  const flat = flattenSuggestedEnhancements(t.enhanced.suggested_tool_enhancements);
  if (flat && flat.length > 0) override.suggestedEnhancements = flat;
  toolOverrides[t.id] = override;
  const notes: Record<string, unknown> = {};
  for (const k of ['user_scenarios', 'tips', 'internal_links', 'schema_suggestions']) {
    if (t.enhanced[k]) notes[k] = t.enhanced[k];
  }
  // Preserve the rich structured enhancement proposals in the sidecar.
  if (t.enhanced.suggested_tool_enhancements) notes.suggested_tool_enhancements = t.enhanced.suggested_tool_enhancements;
  if (Object.keys(notes).length) toolNonSchemaNotes[t.id] = notes;
}

// --- write article overrides module ----------------------------------------
const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\//, '')), '..');
const overridesFile = path.join(repoRoot, 'src', 'data', 'content', `${clusterSlug}-enhancements.ts`);

const tsLiteral = (obj: unknown, indent = 0): string => {
  const pad = '  '.repeat(indent);
  const nextPad = '  '.repeat(indent + 1);
  if (obj === null) return 'null';
  if (typeof obj === 'string') {
    if (obj.includes('\n') || obj.length > 120) {
      // template literal — escape backticks and ${
      return '`' + obj.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${') + '`';
    }
    return JSON.stringify(obj);
  }
  if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    return '[\n' + obj.map((v) => nextPad + tsLiteral(v, indent + 1)).join(',\n') + ',\n' + pad + ']';
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    return '{\n' + entries.map(([k, v]) => {
      const key = /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : JSON.stringify(k);
      return nextPad + key + ': ' + tsLiteral(v, indent + 1);
    }).join(',\n') + ',\n' + pad + '}';
  }
  return JSON.stringify(obj);
};

const articleModule = `// Auto-generated from ${path.basename(briefingPath)}
// Writer-enhanced overrides for ${clusterSlug} cluster articles.
// Merged into CONTENT_PAGES at export time (see src/data/content-pages.ts).
// Do not edit by hand — regenerate with:
//   npx tsx scripts/merge-enhanced-cluster.mts docs/article-briefings/${clusterSlug}-V3-enhanced.json ${clusterSlug}

import type { ContentPageConfig } from '../content-pages';

export const ${clusterSlug.toUpperCase().replace(/-/g, '_')}_ENHANCEMENTS: Record<string, Partial<ContentPageConfig>> = ${tsLiteral(articleOverrides, 0)};
`;

fs.writeFileSync(overridesFile, articleModule, 'utf8');
console.log(`wrote ${path.relative(repoRoot, overridesFile)} (${Object.keys(articleOverrides).length} articles)`);

// --- write tool overrides module -------------------------------------------
const toolOverridesFile = path.join(repoRoot, 'src', 'data', `tools-${clusterSlug}-enhancements.ts`);
const toolModule = `// Auto-generated from ${path.basename(briefingPath)}
// Writer-enhanced overrides for ${clusterSlug} cluster tools.
// Merged into TOOLS at export time (see src/data/tools.ts).
// Do not edit by hand — regenerate with the same command used for articles.

import type { ToolConfig } from './tools';

export const ${clusterSlug.toUpperCase().replace(/-/g, '_')}_TOOL_ENHANCEMENTS: Record<string, Partial<ToolConfig>> = ${tsLiteral(toolOverrides, 0)};
`;

fs.writeFileSync(toolOverridesFile, toolModule, 'utf8');
console.log(`wrote ${path.relative(repoRoot, toolOverridesFile)} (${Object.keys(toolOverrides).length} tools)`);

// --- write writer-insights sidecar -----------------------------------------
const insightsFile = path.join(repoRoot, 'docs', 'writer-insights', `${clusterSlug}.json`);
fs.mkdirSync(path.dirname(insightsFile), { recursive: true });

const insights = {
  cluster_id: clusterSlug,
  enhanced_at: brief.exported_at?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
  source: `docs/article-briefings/${path.basename(briefingPath)}`,
  status_at_import: `${Object.keys(articleOverrides).length} articles and ${Object.keys(toolOverrides).length} tools merged via ${clusterSlug}-enhancements modules.`,
  serp_research: brief.serp_research ?? null,
  adsense_readiness: brief.adsense_readiness ?? null,
  audit_notes: brief.audit_notes ?? null,
  cluster_suggested_tool_enhancements: brief.cluster_suggested_tool_enhancements ?? null,
  tool_non_schema_writer_notes: toolNonSchemaNotes,
  writer_recommended_new_articles: brief.recommended_new_articles ?? null,
};

fs.writeFileSync(insightsFile, JSON.stringify(insights, null, 2) + '\n', 'utf8');
console.log(`wrote ${path.relative(repoRoot, insightsFile)}`);

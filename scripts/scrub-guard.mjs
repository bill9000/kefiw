#!/usr/bin/env node
// Strict Scrub guard — fails the build if AdSense-flagged terms leak
// into user-visible DOM of /health/reagent-*/ pages. Variable-name
// tokens inside <pre>/<code> formulaAnchor blocks are whitelisted.
//
// Exits 1 on any violation; exits 0 when clean.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const HEALTH_DIR = join(DIST, 'health');

// Flagged terms — matched case-insensitively against rendered text.
const FLAGGED = [
  { term: 'peptide', re: /peptide/gi },
  { term: 'sarcopenia', re: /sarcopenia/gi },
  { term: 'dose', re: /\bdose\b|\bdoses\b|\bdosing\b|\bdosage\b/gi },
  // Drug/compound brand names — AdSense policy-sensitive.
  { term: 'drug-brand', re: /\bsemaglutide\b|\btirzepatide\b|\bretatrutide\b|\bcagrilintide\b|\bBPC-?157\b|\bTB-?500\b|\bCJC-?1295\b|\bipamorelin\b|\btesamorelin\b|\bMOTS-?c\b|\bAOD-?9604\b|\bGHK-?Cu\b|\bmelanotan\b/gi },
  { term: 'glp-1', re: /\bGLP-1\b/gi },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

// Strip <pre>…</pre> and <code>…</code> blocks (formula-expression
// identifiers are allowed to contain flagged tokens as code names).
function stripCodeBlocks(html) {
  return html
    .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/gi, '')
    .replace(/<code\b[^>]*>[\s\S]*?<\/code>/gi, '');
}

// Strip HTML comments and script/style content.
function stripNonProse(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
}

const violations = [];

if (!statSync(HEALTH_DIR, { throwIfNoEntry: false })) {
  console.error(`[scrub-guard] ${HEALTH_DIR} not found — did the build run?`);
  process.exit(2);
}

const files = walk(HEALTH_DIR);

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const cleaned = stripCodeBlocks(stripNonProse(raw));
  for (const { term, re } of FLAGGED) {
    const hits = cleaned.match(re);
    if (hits && hits.length > 0) {
      violations.push({ file: relative(process.cwd(), file), term, count: hits.length });
    }
  }
}

if (violations.length === 0) {
  console.log(`[scrub-guard] ✓ ${files.length} /health/ pages clean.`);
  process.exit(0);
}

console.error('[scrub-guard] ✗ Strict scrub violations:');
for (const v of violations) {
  console.error(`  ${v.file} — "${v.term}" × ${v.count}`);
}
console.error(`[scrub-guard] ${violations.length} violation(s) — build rejected.`);
process.exit(1);

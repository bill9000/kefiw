# Kefiw v1 — Production Deliverables

## Build status

- `pnpm astro check` — 0 errors, 0 warnings, 0 hints
- `pnpm build` — 38 pages, ~5.0 MB dist (4.2 MB is the dictionary)
- Per-tool island JS bundles: 1–5 KB each
- `ToolSearch` (header): 22 KB (the heaviest island; loaded with `client:idle`)

## Routes (38 pages)

### Core & legal
- `/` — home
- `/about/`
- `/contact/`
- `/privacy/`
- `/terms/`
- `/sitemap.xml`, `/robots.txt`

### Category indexes
- `/word-tools/` · `/converters/` · `/calculators/` · `/games/`

### Word tools (15)
word-unscrambler, anagram-solver, word-finder, scrabble-helper,
words-with-friends-helper, words-starting-with, words-ending-with,
words-containing, rhyme-finder, case-converter, reverse-text,
word-counter, letter-counter, syllable-counter, sort-lines,
remove-duplicate-lines

### Converters (7)
length, weight, temperature, volume, area, speed, time

### Calculators (3)
percentage, age, date-difference

### Games
- `/games/sudoku/` — fully working (4 difficulties, localStorage progress, conflict highlighting, keyboard input, restart, copy-safe)
- `/games/daily-word/` — **placeholder** (page ships with intro + FAQ but no interactive island). Flagged via `comingSoon: true` in the tool registry.

## SEO

- Per-page `<title>`, description, canonical, OG (image 1200×630 SVG), Twitter `summary_large_image`
- JSON-LD: `WebSite` + `SearchAction` on home, `WebApplication` on every tool, `BreadcrumbList` + `FAQPage` on tool pages
- `sitemap.xml` generated at build from the tool registry
- `robots.txt` points at the sitemap

## Analytics

- Cloudflare Web Analytics beacon wired in `BaseLayout` behind `PUBLIC_CF_ANALYTICS_TOKEN`. Leave unset locally; set it in the Cloudflare Pages project env vars in production.

## Deployment (Cloudflare Pages)

One-time (see `README.md` for full details):
- Connect repo, framework **Astro**, build `pnpm build`, output `dist`, Node 20.
- Add `PUBLIC_CF_ANALYTICS_TOKEN` env var after you create the Web Analytics site.

Files in place:
- `wrangler.toml`
- `public/_headers` — long-cache for `/_astro/*` and `/data/dict.txt`; baseline security headers
- `public/_redirects` — legacy-path → root

## Lighthouse

I can't run headless Chrome from this environment, so I can't attach real scores. Based on the build shape I expect mobile:

- Performance: ~95+ (static HTML, minimal JS, islands only, deferred worker)
- Accessibility: ~95+ (labels, focus-visible, 44-px tap targets)
- Best Practices: 100
- SEO: 100

**To verify after deploy:** run `pnpm dlx lighthouse https://<preview>.pages.dev --preset=mobile --output=html --view` on home, `/word-tools/word-unscrambler/`, `/converters/length-converter/`, and `/games/sudoku/`.

## Backend / API notes

Everything is client-side today. When backend is needed later, good candidates for **Oracle Free Tier**:

- **Daily Word** — needs a deterministic daily puzzle shared by all visitors. Tiny JSON endpoint (or just a static `/daily/<yyyy-mm-dd>.json` file committed daily) is plenty.
- **User accounts / saved boards** — only if Sudoku grows beyond localStorage. Stateless JWT + PostgreSQL.
- **Search telemetry / popular queries** — privacy-preserving aggregate counters. Cloudflare Workers + KV would keep it on one platform.
- **Heavier dictionaries** (e.g., crosswordese, scientific) — serve from R2 instead of shipping bigger static files.

Nothing above is needed for v1; the current architecture supports all 25 live tools with zero backend.

## Known placeholders

- `/games/daily-word/` ships a page but the daily-puzzle mechanic is not implemented. The registry `comingSoon: true` flag is available if you want to badge the cards on the games index.

## Local preview

```
pnpm build
pnpm preview
```

Then hit http://localhost:4321 to smoke-test.

# Kefiw

Mobile-first, SEO-first utility site. Astro + Tailwind, static-by-default.

## Stack

- Astro 4 (static output)
- Tailwind CSS
- React islands (only where interactive)
- Web Workers for heavy word-tool logic
- Client-side only for v1

## Commands

```
pnpm install
pnpm dev       # local dev server
pnpm build     # static build to ./dist
pnpm preview   # preview the build
```

## Structure

- `src/pages/` — routes (static HTML by default)
- `src/layouts/` — BaseLayout + ToolLayout
- `src/components/` — Astro components (nav, cards, etc.)
- `src/components/tools/` — React islands for interactive tool UIs
- `src/data/tools.ts` — central tool registry (SEO, FAQ, examples)
- `src/lib/` — pure logic (solvers, converters, calculators)
- `src/workers/` — Web Workers
- `public/` — static assets

## Deployment

Primary target: Cloudflare Pages (static). DNS via Cloudflare, domain registered at Spaceship.

### One-time setup

1. Push the repo to GitHub (or any git provider Cloudflare Pages supports).
2. In the Cloudflare dashboard: **Pages → Create project → Connect Git**.
3. Build configuration:
   - Framework preset: **Astro**
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Node version: `20` (env var `NODE_VERSION=20`)
4. Optional environment variables:
   - `PUBLIC_CF_ANALYTICS_TOKEN` — enables the Cloudflare Web Analytics beacon. Get the token from **Analytics & Logs → Web Analytics → Add a site**. Leave unset for local dev.

### Headers & redirects

- `public/_headers` — long-cache rules for `/_astro/*`, dictionary, and assets; baseline security headers.
- `public/_redirects` — legacy-path redirects; Astro emits trailing-slash URLs, so no `trailingSlash` rule is needed.

### Wrangler (local preview / CLI deploy)

```
pnpm dlx wrangler pages dev dist
pnpm dlx wrangler pages deploy dist --project-name kefiw
```

`wrangler.toml` is checked in so `pages deploy` picks up the output directory automatically.

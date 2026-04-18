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

## Analytics events

`src/lib/analytics.ts` exposes a single `track(event, props)` helper. It is a
no-op by default — events are only delivered if `window.plausible`, `window.gtag`,
or `window.dataLayer` are present at runtime. When a provider is attached later,
these events will start firing automatically. Keep the names and payload shapes
below stable so dashboards don't break.

| Event            | Fired when                                                | Props                                   |
| ---------------- | --------------------------------------------------------- | --------------------------------------- |
| `mode_selected`  | User switches a tool's mode switch to a new value         | `tool: string`, `mode: string`          |
| `dict_toggled`   | User toggles the "Use word list" checkbox                 | `enabled: boolean`                      |
| `dict_loaded`    | Dictionary finishes loading for the first time per tool   | `source: 'fast' \| 'full'`, `ms: number` |
| `copy_result`    | User clicks a `CopyButton` and the copy succeeds          | `tool: string`, `count: number`         |

Tool IDs currently used in `tool` props: `unscrambler`, `anagram`, `word-finder`,
`rhymes`, `syllables`, `scrabble`, `wwf`.

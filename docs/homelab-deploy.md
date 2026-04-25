# Home Lab — deployment notes

## Subdomain redirect (one-time setup)

`homelab.kefiw.com` should 301 to `kefiw.com/homelab/` so both URLs resolve to the same canonical content with no duplicate-content split.

The redirect is handled by **Cloudflare Pages `_redirects`** (in `public/_redirects`) so the rule lives in the repo and deploys with the build. Wrangler does not manage Redirect Rules / Bulk Redirects directly — those are zone-level features. The Pages `_redirects` approach is cleaner because it's version-controlled.

### One-time dashboard step: attach the subdomain to the Pages project

Wrangler does not have a first-class CLI command for Pages custom domains, so this part is dashboard-only:

1. Cloudflare dashboard → **Workers & Pages** → select the kefiw Pages project.
2. **Custom domains** → **Set up a custom domain** → enter `homelab.kefiw.com`.
3. Cloudflare auto-creates the CNAME record on `kefiw.com`. Approve.
4. Wait until status shows **Active** (usually under a minute, can take up to a few minutes).

(API alternative if you want to script it: `POST /accounts/{account_id}/pages/projects/{project_name}/domains` with `{"name":"homelab.kefiw.com"}` — same effect, no wrangler subcommand wraps it as of wrangler 4.x.)

### The redirect rule itself

`public/_redirects` already contains:

```
https://homelab.kefiw.com/* https://kefiw.com/homelab/:splat 301!
```

This deploys with the next Pages build. No further action needed once the custom domain is attached.

### Verify

```bash
curl -sI https://homelab.kefiw.com/                       # → 301 Location: https://kefiw.com/homelab/
curl -sI https://homelab.kefiw.com/methodology/           # → 301 Location: https://kefiw.com/homelab/methodology/
curl -sI https://homelab.kefiw.com/roof-replacement-cost-calculator/?utm=test
# → 301 Location: https://kefiw.com/homelab/roof-replacement-cost-calculator/?utm=test
```

## Pages routing

Cloudflare Pages already serves `kefiw.com/*` from the main project. No additional deploy targets needed — `/homelab/` pages build with the rest of the site.

## After deploy: Search Console

1. In Google Search Console, the existing kefiw.com property already covers `/homelab/`. No new property needed.
2. Submit the sitemap entry once the deploy is live: `https://kefiw.com/sitemap.xml` (already lists the homelab routes).
3. Use **URL Inspection** for `/homelab/roof-replacement-cost-calculator/` to request indexing.

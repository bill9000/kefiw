# Home Lab — deployment notes

## Subdomain redirect (one-time setup)

`homelab.kefiw.com` should 301 to `kefiw.com/homelab/` so both URLs resolve to the same canonical content with no duplicate-content split.

### Cloudflare DNS

In the Cloudflare dashboard for `kefiw.com`:

1. **DNS → Records** → add a CNAME or A record for `homelab` pointing to the same target as `www` (or whatever the apex/Pages target is). Set proxy status to **Proxied** (orange cloud).

### Cloudflare Bulk Redirects (preferred — works at the edge, no DNS round-trip)

1. **Rules → Redirect Rules → Create rule** (or **Bulk Redirects** if using the list-based UI).
2. Name: `homelab subdomain to subdir`
3. When incoming requests match: **custom filter expression**
   ```
   (http.host eq "homelab.kefiw.com")
   ```
4. Then: **Static redirect**
   - Type: **301 (Permanent)**
   - URL: `concat("https://kefiw.com/homelab", http.request.uri.path)`
   - Preserve query string: **on**
5. Deploy.

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

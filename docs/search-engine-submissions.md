# Search Engine Submissions

## Bing Webmaster Tools

- Account login: LAB3_XVR@outlook.com
- Site: https://kefiw.com/
- Preferred setup path: import the verified site from Google Search Console.
- Sitemap to submit: https://kefiw.com/sitemap.xml

Initial Bing checks:

1. Import `kefiw.com` from Google Search Console.
2. Submit `https://kefiw.com/sitemap.xml` under Sitemaps.
3. Use URL Inspection on:
   - `https://kefiw.com/`
   - `https://kefiw.com/trust/`
   - `https://kefiw.com/word-tools/word-unscrambler/`
4. Request indexing for the homepage and a few key pages if Bing reports them as crawlable.

Do not store passwords, recovery codes, API tokens, or OAuth secrets in this file.

## IndexNow

- Key file: `https://kefiw.com/346e1fffd0b74c5fac0f1847009406b1.txt`
- Key location in repo: `public/346e1fffd0b74c5fac0f1847009406b1.txt`
- Submit script: `pnpm indexnow:submit https://kefiw.com/`
- Dry run: `pnpm indexnow:submit --dry-run https://kefiw.com/`

Submit changed, added, or deleted canonical URLs only. Use `https://kefiw.com/...`, not `www`.

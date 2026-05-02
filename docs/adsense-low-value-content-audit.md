# AdSense Low Value Content Audit

Date: 2026-05-02

## Context

Google's rejection was from before the latest functionality and copy changes, but the live site still matters because AdSense evaluates the deployed public version. This audit checked the live sitemap and current local source.

Google's relevant signals:

- Helpful content should provide original information, analysis, or substantial value compared with search results.
- The site should have a clear primary purpose and a good user experience.
- Scaled pages that provide little added value can be treated as low-quality even when generated pages are technically valid.
- Publisher policies evaluate everything present on the page, including ads, links, and user-facing content.

Sources:

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/essentials
- https://developers.google.com/search/docs/essentials/spam-policies
- https://support.google.com/adsense/answer/10008391

## Live Crawl Summary

Live sitemap: `https://kefiw.com/sitemap.xml`

- Sitemap fetched successfully.
- URLs submitted: 1,722.
- Submitted URLs returning 404: 15.
- Indexed pages under 250 visible words: 3.
- Live pages still showing ad-placeholder signals: many guide/care pages, likely because production has not caught up to the local ad-placeholder fix.
- Duplicate `<title>` values: none significant.
- Duplicate H1 clusters: present, mostly guide/playbook or calculator/guide pairs.

## Fixed Locally

### 1. Bad daily URLs in sitemap

The sitemap was still emitting old flat daily routes:

- `/daily/percent/`
- `/daily/discount/`
- `/daily/convert/`
- `/daily/tip/`
- `/daily/timedelta/`
- `/daily/crypt/`
- `/daily/link/`
- `/daily/shift/`
- `/daily/crosser/`
- `/daily/twist/`
- `/daily/circuit/`
- `/daily/drop/`
- `/daily/pair/`
- `/daily/hex/`
- `/daily/path/`

Those now live under:

- `/daily/math/.../`
- `/daily/verbal/.../`
- `/daily/spatial/.../`

Local fix: `src/pages/sitemap.xml.ts` now maps `DAILY_GAMES` by pipeline prefix instead of assuming every daily game is directly under `/daily/{slug}/`.

## High-Risk AdSense Findings

### 1. Too many mass-generated word-list pages are in the index

The live sitemap has 481 `word-tools` URLs. Many are pattern/list pages. They may be useful as tools, but for AdSense they can look like scaled search-target pages unless each has clear added value beyond a generated list.

Risk: Google may classify the site as a low-value utility/list site rather than a focused decision and cognitive boost publisher.

Recommended action before reapplying:

- Keep core tools indexed.
- Keep strong guide pages indexed.
- Temporarily noindex or remove from sitemap the bulk generated word-list pages that do not have strong editorial framing.
- Reintroduce only the pages with unique explanations, examples, use cases, and internal purpose.

Migration plan:

- Keep the real interactive language tools as the product surface.
- Stop treating generated word-list URLs as SEO inventory.
- Remove generated word-list URLs from the sitemap.
- Add `noindex` to generated word-list routes or canonicalize them to the main interactive finder page.
- Generate word lists in JavaScript on demand from user input, for example letter count, starts-with, ends-with, contains, and pattern filters.
- Keep only a small number of editorial word-pattern guides if they support the cognitive boost positioning.

### 2. AdSense placeholders were visible on live pages

Live crawl found placeholder/ad-slot signals across many guide and care pages. Current source appears fixed: placeholder strings are dev-only or absent from production markup. The deployed site should be checked after the next deployment.

Recommended action before reapplying:

- Deploy the current ad-placeholder fix.
- Re-crawl representative guide and care pages.
- Confirm no visible `Ad placeholder`, empty dashed boxes, or fake ad labels remain.

### 3. Submitted 404s in sitemap

The 15 old daily URLs returning 404 are a direct quality signal problem. This is fixed locally but needs deploy.

Recommended action before reapplying:

- Deploy sitemap fix.
- Resubmit sitemap in Search Console and Bing.
- Re-run IndexNow after deployment.

### 4. Thin daily playable pages

The live crawl found three indexed daily pages near 230 visible words:

- `/daily/hive/`
- `/daily/sudoku/`
- `/daily/hunt/`

These are usable apps, but AdSense may evaluate them as thin if the main value is JavaScript interaction with little crawlable explanation.

Recommended action before reapplying:

- Add crawlable explanatory sections: what the exercise trains, how scoring works, why it is part of Kefiw's cognitive boost routine, privacy/local storage notes, and links to related tracks.
- Or noindex daily playable pages until the editorial wrapper is stronger.

### 5. Duplicate page pairs may dilute quality

Examples from the live crawl:

- Care playbook pages and matching care guide pages with the same H1.
- Calculator pages and matching guide pages with the same H1.
- Property HVAC matrix page and matching guide page.

This is not automatically a violation, but if the content is substantially overlapping, it can look like duplicate templated content.

Recommended action:

- Make one URL the canonical decision/workflow page.
- Make the companion page either a distinct editorial guide or noindex it.
- Avoid two indexed pages that answer the same query with the same heading and similar body.

## Reapply Checklist

Before asking Google to review again:

1. Remove generated word-list pages from the built/indexed site footprint and move long-tail list generation into the interactive JavaScript tools.
2. Strengthen crawlable text on daily app pages.
3. Review duplicate guide/playbook/calculator pairs and canonicalize or noindex overlaps.
4. Restore or replace the missing Browser Use plugin runtime file `scripts/browser-client.mjs` so future in-app browser checks work again.
5. Keep homepage/nav positioning as decision and cognitive boost, not generic games/calculators.
6. Deploy sitemap, redirect, noindex, duplicate cleanup, and ad-placeholder fixes.
7. Confirm live sitemap has zero 404 URLs after deployment.

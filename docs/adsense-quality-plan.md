# AdSense Quality Improvement Plan

Date: 2026-05-02

## Goal

Move Kefiw from "technically acceptable" to "clearly useful and selective" for an AdSense review. The site should read like a decision and cognitive-boost publisher, not a mass utility directory with ads waiting to be filled.

## Current Critical Read

Kefiw is no longer a junk-page site after removing the generated word-list URL inventory and fixing the sitemap. The remaining risk is more subtle: some sections still look template-heavy, some tool wording assumes the user already understands the inputs, and AdSense code is still present even though ad placements are disabled visually.

## Plan

### 1. Disable AdSense code until approval

Status: todo

Live pages no longer show visible ad placeholders, but the AdSense loader still appears on every page. For a site that was already rejected for low-value content, that is an avoidable signal.

Actions:

- Disable `AdSenseScript` globally until Google approves the site.
- Keep ad disclosure pages, but make sure they describe future monetization clearly.
- Confirm live HTML has no `adsbygoogle`, `pagead2.googlesyndication`, `data-ad-slot`, `Ad placeholder`, or `No ad available` strings before resubmitting.

### 2. Plain-language wording pass for tools

Status: todo

Every tool page should answer these questions without the visitor needing technical context:

- What am I supposed to enter?
- Which fields are required?
- What does each field mean in normal language?
- What assumptions does the calculator make?
- What should I do with the result?

Review rule:

- If a field label is not self-explanatory, add helper text under the field.
- If the result uses shorthand, add a plain-English sentence beside it.
- If a control is advanced, explain when to use it.
- Avoid internal/geek wording such as "threshold", "multiplier", "gross", "decimal hrs", "pipeline", "delta", "effective", "coefficient", "arbitrage", "optimizer", or "scenario" unless the page immediately explains it.

Example issue from `/calculators/hours-calculator/`:

- "Daily overtime threshold (hours)" is accurate, but many users will not know whether this means legal overtime, company overtime, or "hours before overtime starts." Better label/helper: "Overtime starts after this many worked hours in one day. Use 8 if overtime begins after 8 hours."
- "Overtime multiplier" is geeky payroll language. Better helper: "1.5 means time-and-a-half. 2 means double time."
- "Gross" in the result card can be unclear. Better: "Time from start to end before subtracting breaks."
- "Decimal hrs" is compact but not human. Better: "Decimal hours for payroll, for example 8.50."
- "Add hourly rate and overtime" should say what happens: "Optional: estimate pay from an hourly rate."

### 3. Expand and separate similar pages

Status: todo

Pages with similar structure should not only swap nouns. They need different examples, explanations, internal links, and page shapes so Google can see distinct value.

Actions:

- Build up thin/similar pages to at least one strong use case, one worked example, one "when this result can mislead you" section, and one next-step link into a deeper guide.
- Vary page structure by topic. Do not use the same sequence of sections across every page in a cluster.
- Add topic-specific explanations, not generic calculator boilerplate.
- Point users into stronger guides when a simple tool is only the first step.
- Prioritize the most similar or thin clusters first:
  - daily pages
  - thin business guides under 400 words
  - similar property HVAC pages
  - scenarios/comparisons pages

### 4. Decide what should not be indexed yet

Status: todo

Some useful pages may still be too thin for AdSense review. If a page is mainly an interactive app with little crawlable explanation, either expand it or temporarily `noindex` it.

Actions:

- Review all indexable pages under 400 words.
- Expand pages that are strategically important.
- Temporarily noindex pages that are useful to users but weak as publisher content.
- Keep the sitemap focused on pages that demonstrate depth and purpose.

### 5. Final pre-submit crawl

Status: todo

Run a live crawl before asking for another review.

Pass conditions:

- No broken sitemap URLs.
- No generated word-list inventory in sitemap.
- No visible ad placeholders.
- No AdSense loader while pending approval.
- No duplicate titles.
- No duplicate meta descriptions in important pages.
- No indexable pages under the agreed quality threshold unless intentionally kept.
- Homepage and nav present Kefiw as decision tools and cognitive boost, not generic games/calculators.

# Site Trust Review Module

## Purpose

The `SITE / TRUST` module explains how Kefiw uses human review without turning trust labels into vague marketing. It gives visitors a direct path from a page-level review badge to the scope behind that badge.

This module exists so users can answer three questions quickly:

- Who reviewed this kind of page?
- What did that review actually cover?
- What should I still not assume from that label?

## Live public routes

The current trust surface lives on these routes:

- `/about-the-reviewers/`
- `/registered-nurse-review/`
- `/engineering-review/`
- `/scientific-review/`
- `/editorial-policy/`
- `/methodology/`
- `/sources/`
- `/health-disclaimer/`

The trust pages are linked from:

- the site footer
- the About page
- the shared authority panel rendered on tool and guide pages

## User jobs to be done

These pages are not abstract company prose. They exist because users are typically trying to do one of the following:

- decide whether a tool result is safe to rely on
- understand whether a page is exact, modeled, or heuristic
- see whether a health page is informational or individualized
- understand who owns formula correctness versus evidence framing
- confirm that a review label has a real process behind it

## Page responsibilities

### About the Reviewers

Trust hub. Explains the three review lanes and routes into detailed scope pages.

### Registered Nurse Review

Defines RN review as health-safety wording, escalation language, and scope control on health pages. Explicitly excludes diagnosis, prescribing, and clinician-patient relationships.

### Engineering Review

Defines engineering review as formula implementation, input handling, deterministic behavior, and technical correctness.

### Scientific Review

Defines scientific review as source quality, evidence framing, uncertainty, and limit statements.

### Editorial Policy

Explains how pages are written, what review labels mean, and how updates or corrections are handled.

### Methodology

Explains the product pattern: deterministic logic where possible, visible assumptions, examples, and explicit limits.

### Sources

Explains source families by page type instead of pretending every page shares one reference model.

### Health Disclaimer

Sets the boundary for health pages and makes clear that Kefiw is educational, not individualized care.

## Implementation map

Primary files:

- `src/pages/about-the-reviewers.astro`
- `src/pages/registered-nurse-review.astro`
- `src/pages/engineering-review.astro`
- `src/pages/scientific-review.astro`
- `src/pages/editorial-policy.astro`
- `src/pages/methodology.astro`
- `src/pages/sources.astro`
- `src/pages/health-disclaimer.astro`

Shared supporting files:

- `src/components/TrustNav.astro`
- `src/layouts/BaseLayout.astro`
- `src/components/Footer.astro`
- `src/pages/about.astro`

## Navigation model

`TrustNav.astro` is the local trust sub-navigation shared by all trust pages. It keeps these pages navigable as one cluster rather than a set of isolated legal-style documents.

The footer and About page provide sitewide discovery links so users do not need to already know the route names.

## Content stance

The module should stay narrow and literal:

- do not claim universal approval across the site
- do not imply that RN review means diagnosis or treatment
- do not imply that engineering review proves real-world truth beyond the model
- do not imply that scientific review means certainty

## Known follow-up work

The shared authority system is already wired into tool and guide layouts, but not yet into hub pages or word-list layouts. If the trust layer needs to appear on every public page family, extend it to:

- `src/layouts/HubLayout.astro`
- `src/layouts/WordListPageLayout.astro`

## Harness sync notes

The harness source for these trust pages is maintained in:

- `my-agents/KEF-Architect/planned-authority-roadmap.cjs`
- `my-agents/KEF-Architect/upsert-kefiw-authority-roadmap.cjs`

The roadmap should describe the live implementation, not the earlier planned-only state.

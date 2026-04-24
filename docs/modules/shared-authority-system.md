# Shared Authority System

## Purpose

The shared authority system is the reusable review-and-methodology layer shown on tool and guide pages. It translates broad trust claims into a page-family-specific panel.

It answers:

- who built the page logic
- which reviewer lanes apply
- what the review covers
- what the user should still treat as a limit
- where to read the deeper trust pages

## Core files

- `src/data/review.ts`
- `src/components/AuthorityPanel.astro`
- `src/layouts/ToolLayout.astro`
- `src/layouts/GuideLayout.astro`

## Review model

`src/data/review.ts` owns the public review mapping.

It defines:

- route constants for trust pages
- review-role metadata
- panel shape
- area-to-panel mapping

Current review areas:

- `word-tools`
- `games`
- `calculators`
- `converters`
- `finance`
- `logic`
- `health`
- `health-guide`
- fallback `guides`

## Mapping rules

### Play and language pages

Used for word tools, games, and generic guides.

Emphasis:

- search, scoring, or rule logic
- puzzle/writing strategy framing
- limits like dictionary gaps or pronunciation mismatches

### Decision math pages

Used for calculators, converters, finance, and logic pages.

Emphasis:

- formula choice
- inputs and units
- assumptions and rounding
- explicit non-advice boundary

### Health pages

Used for health tools and health-oriented guides.

Emphasis:

- formula logic and thresholds
- evidence framing and source limits
- RN review for safety wording and escalation language

## Layout integration

### Tool pages

`ToolLayout.astro` now:

- derives the page family from `tool.category`
- builds a review config with `reviewPanelForArea`
- renders `AuthorityPanel` before common-mistakes and FAQ sections
- renames the use-case section to `What users are actually trying to do`

### Guide pages

`GuideLayout.astro` now:

- derives review area from cluster section when available
- falls back to related tool categories when needed
- forces `health-guide` handling for health-cluster guides
- renders the same `AuthorityPanel` near the top of guide content

## Content expectations

The panel is intentionally operational rather than promotional.

It should always contain:

- a short intro describing the kind of page
- `Built by`
- `Reviewed by`
- `What the review covers`
- `Limits`
- links to trust/process pages

It should never imply:

- blanket approval of every claim on the site
- individualized legal, financial, medical, or professional guidance
- that review removes model uncertainty

## Current scope gap

The shared authority system does not yet render on:

- hub pages using `HubLayout.astro`
- word-list pages using `WordListPageLayout.astro`

If a future requirement says `all public pages` rather than `all tools and guides`, those layouts are the next integration points.

## Harness relationship

The authority system is cross-cutting. Harness page records for trust pages should reference:

- the trust routes themselves
- `src/data/review.ts`
- `src/components/AuthorityPanel.astro`
- `src/components/TrustNav.astro` where relevant

Existing tool and guide records may eventually need a bulk refresh if the authority panel becomes part of every page-level architect spec.

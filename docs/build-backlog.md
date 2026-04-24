# Build Backlog — features the articles describe that the code hasn't shipped yet

**Rule**: writer-generated articles in `src/data/content/` are the feature spec. If an article references a capability the tool UI doesn't have, that's a build target — do not soften the article to paper over the gap.

**Source of truth**: `docs/writer-insights/*.json` — the `suggested_tool_enhancements.proposed_features` / `proposed_upgrades` blocks. Articles quote from these.

## Audit date: 2026-04-23

### Major (multi-day rebuilds)

- [ ] **`scrabble-helper` — full-board placement + premium-square scoring**
  - Articles referencing: `cE-scrabble-board-solver-strategy`, `cE-scrabble-scoring`, scrabble-* support docs
  - Scope: 15×15 grid rendering, tile placement UI, cross-word validation, double-letter / triple-letter / double-word / triple-word square math, opening-bonus (center star), bingo +50 bonus
  - Currently: rack-helper only. Computes rack-based plays without board context.

- [ ] **`words-with-friends-helper` — full WWF board layout + premium squares**
  - Articles referencing: `cS-words-with-friends-scoring-differs`
  - Scope: WWF's 15×15 grid with its own bonus positions (DL/TL/DW/TW in different places than Scrabble), WWF tile values, 35-point bonus for using all 7 tiles
  - Currently: same rack-only helper as Scrabble with `valueSet="wwf"` — no board.

- [ ] **`anagram-solver` — phrase-anagram mode**
  - Articles referencing: unscramble cluster guides
  - Scope: multi-word input, partition letters into 2+ words from dictionary, rank by quality. Needs a new worker operation.

- [ ] **`anagram-solver` — near-anagram mode (one missing or extra letter)**
  - Articles referencing: unscramble cluster guides
  - Scope: show words that match `letters ± 1 letter`. Worker-side partial-match operation.

### Medium (few hours each)

- [ ] **`scrabble-helper` / `words-with-friends-helper` — rack leave notes**
  - Show hint like "AEINRT leave is worth ~35 equity, keep it together" when the user's rack after a play retains a high-value stem.
  - Needs a lookup table of common leaves + equity values.

- [ ] **`scrabble-helper` — official dictionary modes (TWL, SOWPODS, NWL)**
  - Licensing-dependent. Document which lists are used and any gaps. May be a disclaimer-only shipping item.

- [ ] **`words-with-friends-helper` — side-by-side Scrabble vs WWF score comparison**
  - Show both scores in the result list (already shown for individual plays, but not as a side-by-side "switch cost" comparison).

- [ ] **`word-finder` — show wildcard + fixed-letter counts beside examples**
  - When showing results, annotate each with how many `?` blanks + fixed positions it used.

- [ ] **`case-converter` — Unicode-aware tokenization for accented letters**
  - `café` should title-case cleanly; currently may split on the `é`. Use Unicode property escapes `\p{L}` for word boundaries.

- [ ] **`case-converter` — quick presets for tags / filenames / headings**
  - One-tap buttons that produce `my-tag`, `my_file_name`, `My Heading`.

- [ ] **`case-converter` — visual diff for changed characters**
  - Highlight modified characters in the output vs the input.

- [ ] **`reverse-text` — mirror-glyph generator as a separate mode**
  - Map each character to its Unicode mirror glyph (e.g. `a` → `ɐ`). Useful for novelty/display use. Label clearly as separate from reversal.

- [ ] **`sort-lines` — locale selection or explain current locale**
  - Currently uses browser locale implicitly. Expose a locale picker or at minimum surface which locale is being used.

- [ ] **`sort-lines` — sort-and-dedupe as an explicit output mode**
  - Instead of requiring user to chain Sort → Remove Duplicate Lines, offer a combined mode.

- [ ] **`sort-lines` — before/after preview for first changed lines**
  - Show the first 3 lines that moved, so the user sees the sort effect without scrolling.

- [ ] **`remove-duplicate-lines` — show removed duplicates with counts and line numbers**
  - "Line 5 duplicated line 2 · 'foo' (2 occurrences removed)".

- [ ] **`remove-duplicate-lines` — Unicode normalization (NFC) before matching**
  - Combining marks and precomposed forms should count as equal when `Unicode normalize` toggle is on.

- [ ] **`letter-counter` — optional charts for top letters**
  - Bar chart of top 10 letters. Needs a light chart lib or hand-rolled SVG.

- [ ] **`word-counter` — align word-count formula with Reading Time Calculator**
  - Tiny discrepancy between the two tools today. Either unify or document the difference in both tools.

### Minor (nice polish)

- [ ] **`reading-time-calculator` — display the formula note when word-count differs from Word Counter**
  - The small discrepancy has a legitimate reason (both tokenize slightly differently). Surface it.

- [ ] **`word-counter` — warn when only one very long word exists that may lack spaces**
  - Already does "no-spaces" check for text > 40 chars with ≤ 2 words. Could also flag specific very-long single words.

## How to use this file

- When picking up work on a tool, grep this file for the tool name.
- When shipping a feature, check the box (`- [x]`) and note the commit or PR.
- When a new writer-cluster V3 lands, re-audit and add new items.
- When a tool is deleted or re-scoped, strike the corresponding lines through.

## Where the articles actually describe these

Grep for specific feature names across `src/data/content/*-enhancements.ts` and the longform sections in `src/data/content/{cluster-a,cluster-e,support-*}.ts` to find the exact paragraphs. The writer-insights JSONs at `docs/writer-insights/*.json` hold the structured proposal data.

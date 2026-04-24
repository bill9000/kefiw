// Writer-AI doc-update pass on top of the V3 enhanced import.
// Adds: new H2 sections and FAQ entries to existing articles, three new guides,
// and tool-page relatedIds for the five support pillars (Scoring, Blanks,
// Dictionary, Board Solver, Fair Use).
//
// Merged AFTER src/data/content/scrabble-enhancements.ts so these specific
// append-style updates layer on top of the V3 content.

import type { ContentPageConfig } from '../content-pages';
import type { FaqItem } from '../tools';

export interface ArticlePatch {
  appendFaq?: FaqItem[];
  appendRelatedIds?: string[];
  appendLongform?: string;
}

// ---------------------------------------------------------------------------
// Existing-article append patches
// ---------------------------------------------------------------------------

export const SCRABBLE_ARTICLE_PATCHES: Record<string, ArticlePatch> = {
  'cE-scrabble-blanks': {
    appendFaq: [
      {
        q: 'How much is a blank tile worth in Scrabble?',
        a: 'A blank tile is worth zero points, even when it represents a high-value letter like Q, Z, J, or X. Its value comes from flexibility, not face value, because it can complete bingos, hooks, and hard-to-place words.',
        faq_intent: 'definition',
      },
      {
        q: 'Can a blank tile count as a 10-point letter?',
        a: 'No, a blank tile always scores zero points no matter which letter it represents. A blank used as Z may create the word ZA, but the blank itself still contributes zero to the score.',
        faq_intent: 'edge-case',
      },
      {
        q: 'Should I save a blank tile for a bingo?',
        a: 'Saving a blank for a bingo is often strong because blanks make 7-tile plays much easier to form. The best use depends on board position, rack balance, and whether an immediate high-scoring play is available.',
        faq_intent: 'how-to',
      },
    ],
    appendRelatedIds: [
      'scrabble-helper',
      'word-finder',
      'cE-scrabble-scoring',
      'cE-scrabble-bingo-strategy',
      'cE-scrabble-dictionaries-explained',
    ],
    appendLongform: `
## What a Scrabble Blank Does

A blank is a wildcard tile. You choose which letter it represents when you play it, and it locks in as that letter for the rest of the game. That flexibility is the whole point: a blank turns a half-finished rack into a bingo, rescues a stuck Q, or lets a common pattern play in a space no other tile can fit.

## How Blank Tiles Are Scored

A blank tile can represent any letter, but the blank itself scores 0 points. If a blank stands for Z in ZA, the Z is still worth 0 because the physical tile is blank. Word and letter multipliers still apply to the rest of the word, but a multiplier on the blank tile itself multiplies zero.

## How Kefiw Handles Blanks in Word Finder Results

When Kefiw shows a word made with a blank, the score reflects the blank as a zero-point tile. That means a word made with \`?\` may score lower than the same word made with the real letter tile. In the [Scrabble Word Finder](/word-tools/scrabble-helper/) and [Words With Friends Word Finder](/word-tools/words-with-friends-helper/), the letter a blank represents is rendered lowercase with a dotted underline so you can see which position was filled by a blank.

## When a Blank Is Worth Saving

Hold a blank when your rack is close to a bingo and a 7-tile play would win a lane that is still open. Also hold it when an awkward letter like Q, V, or two duplicate consonants is making your rack rigid — the blank becomes the vowel or the connector you are missing. If the board closes before a bingo forms, the blank loses its upside.

## When to Spend a Blank Early

Spend a blank early when a specific high-value square is about to be blocked, when no bingo combination is reachable, or when holding a blank is forcing you into bad turns. A 30-point play with a blank now can beat a 50-point bingo that never appears.

## Common Blank Tile Mistakes

Expecting a blank to double its represented value on a premium square is the most common misread. The word multiplier helps, but the blank's own tile score is zero, so a triple-letter under a blank does nothing. Second: stalling for too long. If the bag is drying up, play the blank. Third: forgetting that an opponent can challenge the word the blank forms — if the word is not valid, you lose the turn regardless of which letter the blank was meant to be. Use [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/) to decide when a play is safe.

## Related reading

- [Scrabble scoring explained](/guides/scrabble-scoring/)
- [Scrabble bingo strategy](/guides/scrabble-bingo-strategy/)
- [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/)`,
  },

  'cE-scrabble-scoring': {
    appendFaq: [
      {
        q: 'Do Scrabble bonus squares count for cross-words?',
        a: 'Yes, a newly covered bonus square can affect each word formed by that tile on the same turn. That includes the main word and any valid cross-word created by adjacent letters.',
        faq_intent: 'edge-case',
      },
      {
        q: 'When do Scrabble word multipliers apply?',
        a: 'Word multipliers apply after letter bonuses are added to the word\u2019s tile total. If a move covers more than one new word multiplier, those word multipliers stack for that word.',
        faq_intent: 'definition',
      },
      {
        q: 'Does a blank tile get multiplied on a premium square?',
        a: 'A blank tile can sit on a premium square, but its tile value remains zero. A word multiplier can still multiply the full word, but a letter multiplier on the blank itself adds nothing.',
        faq_intent: 'edge-case',
      },
    ],
    appendRelatedIds: [
      'scrabble-helper',
      'cE-scrabble-blanks',
      'cE-scrabble-board-solver-strategy',
      'cE-scrabble-bingo-strategy',
      'cS-best-2-letter-scrabble-words',
      'cS-best-3-letter-scrabble-words',
    ],
    appendLongform: `
## Scrabble Tile Values

Scrabble tile values run from 1 point for the most common letters (E, A, I, O, N, R, T, L, S, U) up to 10 points for Q and Z. Blanks score 0. Memorising the value map is the first scoring skill because every other rule builds on those base numbers.

## How Letter and Word Multipliers Work

Letter multipliers (double-letter, triple-letter) apply to the tile sitting on the square. Word multipliers (double-word, triple-word) multiply the summed tile value of the entire word that crosses the square. Letter multipliers always resolve first, then word multipliers. If a single move covers two word-multiplier squares at once, the multipliers stack — a triple-triple scores the whole word times nine.

## How Cross-Words Are Scored

A full move score is not just the main word. In real board scoring, every newly formed cross-word also scores, and any newly covered premium square applies to the word or words that use that tile. If your main word is 24 points and you create two cross-words worth 6 and 4, your move scores 34 — plus the 50-point bingo bonus if all seven rack tiles were used.

## How Blanks Affect the Score

Blank tiles score 0 regardless of which letter they represent. Word multipliers still multiply the rest of the word, but a letter multiplier under a blank adds nothing. When [Kefiw\u2019s Scrabble Word Finder](/word-tools/scrabble-helper/) shows a word made with a blank, the blank-covered letter is rendered lowercase with a dotted underline and the score already has the blank\u2019s value subtracted — see [how to use Scrabble blanks](/guides/scrabble-blanks/) for deeper coverage.

## How the 50-Point Bingo Bonus Works

Playing all seven tiles from your rack in a single turn earns a +50 bingo bonus on top of the main word score and any cross-words. The bingo bonus fires only when all seven rack tiles are consumed — a seven-letter word that plays through an existing board letter and uses six rack tiles is not a bingo. Words With Friends uses a smaller +35 bonus; see [how Words With Friends scoring differs](/guides/how-words-with-friends-scoring-differs/).

## How Board Solvers Score a Move

Premium squares count only when a tile is first placed on them. They do not keep multiplying later turns after the square is already covered. Kefiw\u2019s board-aware scoring should be treated differently from raw word scoring: raw word score adds tile values only, while board scoring includes premium squares, cross-words, blank values, and bingo bonuses. The [Scrabble Word Finder](/word-tools/scrabble-helper/) currently handles rack-level scoring with zero-value blanks and the bingo bonus; the [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/) guide walks through the extra work a full board solver does.

## Related reading

- [How to use Scrabble blanks](/guides/scrabble-blanks/)
- [Scrabble bingo strategy](/guides/scrabble-bingo-strategy/)
- [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/)
- [Best 2-letter Scrabble words](/guides/best-2-letter-scrabble-words/)
- [Best 3-letter Scrabble words](/guides/best-3-letter-scrabble-words/)`,
  },

  'cS-words-with-friends-scoring-differs': {
    appendFaq: [
      {
        q: 'Why does Words With Friends score differently from Scrabble?',
        a: 'Words With Friends uses its own tile values, board layout, and bingo bonus, so identical words can score differently. The best Scrabble move is not always the best Words With Friends move.',
        faq_intent: 'comparison',
      },
      {
        q: 'How much is a bingo worth in Words With Friends?',
        a: 'A Words With Friends bingo is worth 35 bonus points when all seven rack tiles are used. Scrabble uses a larger 50-point bonus, which changes the value of chasing bingos.',
        faq_intent: 'definition',
      },
      {
        q: 'Can I use a Scrabble word finder for Words With Friends?',
        a: 'A Scrabble word finder can suggest useful ideas, but it should not be used as the final WWF scorer. Tile values, bonus layout, and dictionary acceptance can all differ.',
        faq_intent: 'comparison',
      },
    ],
    appendRelatedIds: [
      'words-with-friends-helper',
      'scrabble-helper',
      'cE-scrabble-scoring',
      'cE-scrabble-blanks',
      'cE-scrabble-dictionaries-explained',
    ],
    appendLongform: `
## Scrabble and Words With Friends Use Different Tile Values

Words With Friends uses different tile values from Scrabble, so the same rack can produce a different best play. Consonants like B, C, F, H, M, and P all cost 4 points in WWF (vs. 3/4/4/3/3 in Scrabble). L, N, and U cost 2 (vs. 1/1/1). Y drops to 3 (from 4), and J climbs to 10 (from 8). Swap between the [Scrabble Word Finder](/word-tools/scrabble-helper/) and the [Words With Friends Word Finder](/word-tools/words-with-friends-helper/) when the game changes so the ranking matches the game rules.

## The Bingo Bonus Is Different

In Words With Friends, a 7-tile play earns a +35 bonus, not the +50 Scrabble bingo bonus. That smaller reward makes chasing a bingo slightly less valuable and raises the bar on trading away a strong immediate play to hunt for one.

## Blank Tiles Still Score Zero

Both games score blank tiles at zero points. Kefiw\u2019s WWF helper subtracts the blank\u2019s represented value from the displayed score and marks the blank position with a lowercase letter and dotted underline, matching the behaviour on the Scrabble side — see [how to use Scrabble blanks](/guides/scrabble-blanks/) for the full rule.

## Bonus Squares and Board Layout Change the Best Move

Words With Friends and Scrabble use different board layouts. Premium squares sit at different positions, and the triple-word squares are set farther from the corners in WWF. A word that lands on a double-word in Scrabble may not touch any premium square in WWF at all, so top plays often diverge between the two games even on the same rack.

## Dictionary Differences Matter

Dictionary badges matter because a word can be accepted in one game context and rejected in another. Treat the source label as part of the result, not a decoration. Kefiw\u2019s helpers use the public ENABLE1 word list — close to both games\u2019 dictionaries but not identical. For how to read and trust those labels, see [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/).

## When to Use the WWF Helper Instead of the Scrabble Helper

Use the WWF helper whenever your game is Words With Friends, even if the rack looks identical to a Scrabble rack you played earlier. Tile-value differences alone can flip the top play; add the smaller bingo bonus and a different board, and the \u201Cbest play\u201D answer often changes entirely.

## Related reading

- [Scrabble scoring explained](/guides/scrabble-scoring/)
- [How to use Scrabble blanks](/guides/scrabble-blanks/)
- [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/)`,
  },

  'cE-scrabble-bingo-strategy': {
    appendFaq: [
      {
        q: 'Does a Scrabble bingo have to be exactly 7 letters?',
        a: 'A Scrabble bingo uses all seven rack tiles, but the word on the board can be longer. If your seven tiles connect through existing letters, the completed word may have eight or more letters.',
        faq_intent: 'edge-case',
      },
      {
        q: 'How do I find bingo lanes on a Scrabble board?',
        a: 'Look for open rows or columns with one useful connecting letter and enough empty space around it. Then test common endings, stems, and hooks against your rack.',
        faq_intent: 'how-to',
      },
      {
        q: 'Should I always play a bingo when I find one?',
        a: 'A bingo is usually strong, but it is not automatically best in every position. Board danger, opponent access, endgame timing, and defensive value can make another move better.',
        faq_intent: 'edge-case',
      },
    ],
    appendRelatedIds: [
      'scrabble-helper',
      'word-finder',
      'cS-best-bingo-words',
      'cS-how-to-find-bingo-plays',
      'cE-scrabble-scoring',
      'cE-scrabble-board-solver-strategy',
    ],
    appendLongform: `
## What Counts as a Bingo

A bingo bonus is awarded when you use all 7 tiles from your rack. The final word may be longer than 7 letters if it connects through an existing board tile — the bonus depends on rack tiles consumed, not word length. In Scrabble the bingo is worth +50; in Words With Friends it is +35 (see [how Words With Friends scoring differs](/guides/how-words-with-friends-scoring-differs/)).

## Rack-Only Bingos vs Board-Connected Bingos

A rack-only bingo is a 7-letter word that you can drop into an empty row or column. A board-connected bingo uses some or all of your rack plus one existing board letter to form a longer word. Rack-only bingos are easier to spot; board-connected bingos need open lanes and the right connecting letter.

## How to Scan the Board for Bingo Lanes

Look for rows and columns with one exposed letter in the middle, empty space on both sides, and no premium-square traps that would give too much back to your opponent. Common connecting letters are S, E, R, A, N, T, L — the high-frequency consonants and vowels that show up in many word endings. The [Scrabble Word Finder](/word-tools/scrabble-helper/) accepts an optional \u201Cplays through\u201D board letter to filter its rack output.

## Using Hooks to Place a Bingo

A hook is a letter that extends an existing word at its start or end. Plurals (+S), -ED, -ING, and -ER all create hooks. When you scan for bingo lanes, check whether the word you are thinking about has a one-letter stub you can drop onto the board to form a cross-word — that cross-word lets the bingo connect where a straight rack play could not.

## When a Bingo Is Not the Best Move

The best bingo is not always the highest raw-score word. A slightly lower-scoring bingo can be better if it blocks a dangerous lane or avoids giving back an easy triple-word response. Scoring is only half the job; the other half is what the move does to the board for the next turn.

## Practicing With a Board-Aware Solver

A board-aware solver helps separate \u201Cthis rack can form a bingo word\u201D from \u201Cthis bingo can legally fit on the current board.\u201D Use a rack solver like [Scrabble Word Finder](/word-tools/scrabble-helper/) for candidates, then walk the candidates through an actual board yourself — or read the [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/) guide for how a fuller solver layer would compare moves.

## Related reading

- [Best bingo words in Scrabble](/guides/best-bingo-words-in-scrabble/)
- [How to find bingo plays](/guides/how-to-find-bingo-plays/)
- [Scrabble scoring explained](/guides/scrabble-scoring/)
- [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/)`,
  },

  'cA-2-letter-words': {
    appendFaq: [
      {
        q: 'Why are 2-letter Scrabble words so important?',
        a: 'Two-letter Scrabble words are important because they make parallel plays possible on crowded boards. They let short moves score through multiple connected words instead of only one main word.',
        faq_intent: 'definition',
      },
      {
        q: 'Are all 2-letter words valid in Words With Friends?',
        a: 'Not every 2-letter Scrabble word is guaranteed to match Words With Friends validity. Check the dictionary source or use the WWF helper before relying on a word in that game.',
        faq_intent: 'comparison',
      },
    ],
    appendRelatedIds: [
      'scrabble-helper',
      'words-with-friends-helper',
      'word-finder',
      'cS-best-2-letter-scrabble-words',
      'cE-scrabble-dictionaries-explained',
      'cE-how-to-use-scrabble-solver-fairly',
    ],
    appendLongform: `
## How to Use This Word List

This list shows words from the Kefiw word list and labels the source used for validation. Always check the dictionary badge before treating a word as valid for a specific game. Use the list for study, then move to the [Scrabble Word Finder](/word-tools/scrabble-helper/) or the [Words With Friends Word Finder](/word-tools/words-with-friends-helper/) when you need to check a real rack.

## What the Dictionary Badge Means

Kefiw\u2019s game-style tools default to the ENABLE1 public word list. That list overlaps heavily with tournament Scrabble (TWL) and Collins (SOWPODS) but is not identical to either. If a word is not accepted in your specific game, the source list is probably the reason. See [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/) for a full breakdown.

## Scores, Hooks, and Short-Word Value

Short words matter because they create parallel plays. A two-letter or three-letter word can score far more than its length suggests when it touches premium squares or forms multiple words. A 2-letter play with Q on a triple-letter and Z on a double-word often outscores a 6-letter straight play.

## How to Read Word Details

Open a word detail to see the word\u2019s score, source-list note, useful hooks, and a short meaning where available. The score shown is the raw tile total; on a live board, premium squares, cross-words, and bingo bonuses modify the final number — see [Scrabble scoring explained](/guides/scrabble-scoring/).

## Scrabble vs Words With Friends Validity

Scrabble and Words With Friends use different dictionaries. A 2-letter word that is legal in Scrabble may be rejected in WWF, and vice versa. Use the [Words With Friends Word Finder](/word-tools/words-with-friends-helper/) for WWF-specific validity, or flip dictionary modes where available.

## Practice Short Words by Tile

Group your practice by high-value tile: all 2-letter words containing Q, then Z, then X, then J, then V, then K. Learning the 2-letter list by tile lets you clear awkward racks in emergencies without wasting turns looking for longer plays. For the curated list of highest-impact short plays, see [best 2-letter Scrabble words](/guides/best-2-letter-scrabble-words/).

## Related reading

- [Best 2-letter Scrabble words](/guides/best-2-letter-scrabble-words/)
- [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/)
- [How to use a Scrabble solver fairly](/guides/how-to-use-a-scrabble-solver-fairly/)`,
  },

  'cA-words-with-q-no-u': {
    appendRelatedIds: ['cE-scrabble-q-without-u', 'cE-scrabble-dictionaries-explained', 'scrabble-helper'],
  },
  'cA-words-with-z': {
    appendRelatedIds: ['cS-best-words-with-z', 'cE-scrabble-dictionaries-explained', 'scrabble-helper'],
  },
  'cA-words-with-x': {
    appendRelatedIds: ['cS-best-words-with-x', 'cE-scrabble-dictionaries-explained', 'scrabble-helper'],
  },
  'cA-words-with-j': {
    appendRelatedIds: ['cS-best-words-with-j', 'cE-scrabble-dictionaries-explained', 'scrabble-helper'],
  },

  'cA-3-letter-words': {
    appendFaq: [
      {
        q: 'Why should I learn 3-letter Scrabble words?',
        a: 'Three-letter Scrabble words help you score in tight spaces while unloading awkward high-value tiles. They are especially useful for J, Q, X, and Z plays.',
        faq_intent: 'definition',
      },
      {
        q: 'How do 3-letter words help with hooks?',
        a: 'Three-letter words create hooks because they can extend or run parallel to existing board words. Learning common endings and plural forms makes more board spaces playable.',
        faq_intent: 'how-to',
      },
    ],
    appendRelatedIds: [
      'scrabble-helper',
      'words-with-friends-helper',
      'word-finder',
      'cS-best-3-letter-scrabble-words',
      'cE-scrabble-dictionaries-explained',
      'cE-scrabble-board-solver-strategy',
    ],
    appendLongform: `
## How to Use This Word List

This list shows words from the Kefiw word list and labels the source used for validation. Always check the dictionary badge before treating a word as valid for a specific game. Use the page for study and memory work, then switch to the [Scrabble Word Finder](/word-tools/scrabble-helper/) or [Words With Friends Word Finder](/word-tools/words-with-friends-helper/) when you have a real rack.

## What the Dictionary Badge Means

Kefiw\u2019s game-style tools use ENABLE1 as the default word list. It overlaps heavily with tournament Scrabble word lists but is not identical. For how to read source labels and when to trust them, see [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/).

## Scores, Hooks, and Short-Word Value

Short words matter because they create parallel plays. A two-letter or three-letter word can score far more than its length suggests when it touches premium squares or forms multiple words. Three-letter plays are especially useful for clearing J, Q, X, or Z without needing a longer lane.

## How to Read Word Details

Open a word detail to see the word\u2019s score, source-list note, useful hooks, and a short meaning where available. Scores are raw tile totals; premium squares, cross-words, and bingo bonuses apply on a live board — see [Scrabble scoring explained](/guides/scrabble-scoring/).

## Scrabble vs Words With Friends Validity

Not every 3-letter word is valid in both games. Use the game-specific helper to confirm, and watch for app-specific exceptions that the ENABLE1 list may not perfectly match.

## Practice Short Words by Tile

Group your practice by high-value tile: 3-letter words containing J, Q, X, Z first. Those are the emergency plays that unload a stuck rack. Then learn plurals and -ED / -ER forms of common 3-letter stems, because they become hooks on the board. For curated high-impact plays, see [best 3-letter Scrabble words](/guides/best-3-letter-scrabble-words/).

## Related reading

- [Best 3-letter Scrabble words](/guides/best-3-letter-scrabble-words/)
- [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/)
- [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/)`,
  },
};

// ---------------------------------------------------------------------------
// Three new guides
// ---------------------------------------------------------------------------

export const SCRABBLE_NEW_GUIDES: ContentPageConfig[] = [
  {
    id: 'cE-scrabble-dictionaries-explained',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'scrabble-dictionaries-explained',
    guideCategory: 'Scrabble',
    title: 'Scrabble Dictionaries Explained \u2014 ENABLE, NWL, Collins, and WWF',
    h1: 'Scrabble Dictionaries Explained',
    subhead: 'Why one tool says a word is valid and another rejects it.',
    description: 'ENABLE, NWL, Collins, and the Words With Friends list \u2014 what each one contains, how they differ, and how to read Kefiw\u2019s dictionary badges.',
    discoverHeadline: 'TWL or SOWPODS? The wrong Scrabble dictionary can cost the game',
    metaDescription: 'Understand Scrabble word-list differences \u2014 ENABLE, NWL, Collins, WWF \u2014 and how to read Kefiw dictionary badges before challenging a word.',
    keywords: ['scrabble dictionary', 'enable word list', 'nwl vs sowpods', 'words with friends dictionary', 'scrabble word list'],
    intro: 'Scrabble word lists are not one thing. Different publishers, regions, and games maintain separate accepted-word lists, and a word legal in one can be rejected in another. This guide explains what Kefiw uses, how the major lists compare, and when to challenge a word.',
    keyPoints: [
      'Kefiw\u2019s game-style tools default to the ENABLE1 public word list \u2014 not a tournament dictionary.',
      'Tournament Scrabble uses NWL (North America) or Collins (international).',
      'Words With Friends maintains its own list that overlaps with but differs from Scrabble lists.',
      'Dictionary badges on Kefiw tools show which source validated a result \u2014 read them before trusting a play.',
      'Challenge only after checking the dictionary your actual game uses.',
    ],
    examples: [
      { title: 'QI and ZA', body: 'Both are legal in ENABLE1, NWL, Collins, and WWF \u2014 universally accepted short plays.' },
      { title: 'DA', body: 'Legal in Collins and older word lists; not in NWL; variable in WWF depending on app version.' },
      { title: 'GROK', body: 'Added to tournament Scrabble dictionaries relatively recently. May be missing from older ENABLE1 builds.' },
      { title: 'Proper nouns', body: 'PARIS, SONY, NASA \u2014 rejected by every Scrabble and WWF list. Kefiw\u2019s lists also exclude them.' },
    ],
    whenToUse: [
      { toolId: 'scrabble-helper', note: 'Use for Scrabble plays; results come from ENABLE1 by default.' },
      { toolId: 'words-with-friends-helper', note: 'Use for WWF plays; tile values match the app even when the word list overlaps.' },
      { toolId: 'word-finder', note: 'Use to test a specific word against the word list directly.' },
      { articleId: 'cE-scrabble-scoring', note: 'Use when validity is clear but you need to know how the word scores on the board.' },
    ],
    relatedIds: [
      'scrabble-helper',
      'words-with-friends-helper',
      'word-finder',
      'cA-2-letter-words',
      'cA-3-letter-words',
      'cA-words-with-q-no-u',
    ],
    primaryCta: { href: '/word-tools/scrabble-helper/', label: 'Scrabble Word Finder' },
    faq: [
      { q: 'What dictionary does Kefiw use for Scrabble words?', a: 'Kefiw\u2019s game-style word tools use a public word list unless a page label says otherwise. Dictionary badges help show which source a result came from.', faq_intent: 'trust' },
      { q: 'Why is a word valid in one Scrabble dictionary but not another?', a: 'Scrabble dictionaries differ because regions, publishers, and games maintain separate accepted-word lists. A word can be playable in Collins but absent from another list.', faq_intent: 'comparison' },
      { q: 'Is ENABLE the same as the official Scrabble dictionary?', a: 'ENABLE is not the same as an official Scrabble tournament dictionary. It is a public word list that overlaps heavily with game word lists but is not identical.', faq_intent: 'trust' },
      { q: 'Should I challenge a word from a word finder?', a: 'Challenge only after checking the dictionary source used by your actual game. A solver result is useful, but the game\u2019s current dictionary decides validity.', faq_intent: 'how-to' },
      { q: 'Does Words With Friends use the same dictionary as Scrabble?', a: 'Words With Friends does not use exactly the same dictionary as Scrabble. Many words overlap, but app-specific accepted words and rejected words can differ.', faq_intent: 'comparison' },
    ],
    longformMarkdown: `## Why Scrabble Dictionaries Differ

Scrabble is older than any single word list. Over decades, publishers in North America, the UK, and the international tournament circuit each maintained their own accepted-word databases. Words With Friends, released in 2009, built its own list on top of that history. The result is a group of overlapping-but-different lists, each with its own editorial rules for slang, loanwords, inflections, and proper nouns.

## What ENABLE Means on Kefiw

Kefiw\u2019s [Scrabble Word Finder](/word-tools/scrabble-helper/), [Words With Friends Word Finder](/word-tools/words-with-friends-helper/), [Word Unscrambler](/word-tools/word-unscrambler/), and [Word Finder by Letters](/word-tools/word-finder/) all default to the ENABLE1 public-domain word list (~172,823 entries). ENABLE was built from several earlier lists and is used by Words With Friends and many casual-play word tools. It is not a tournament dictionary.

## NWL, Collins, and Words With Friends Compared

NWL (the NASPA Word List) is the tournament dictionary used in North America. Collins Scrabble Words (sometimes called SOWPODS) is the international tournament dictionary \u2014 it is larger than NWL because it absorbs both the North American list and additional British and Commonwealth words. Words With Friends uses its own Zynga-maintained list. In practice: a word accepted by Collins may or may not be in NWL; a word in NWL is usually in Collins; ENABLE1 sits mostly inside the intersection of both plus some casual additions.

## Why a Word Can Be Valid in One Game and Invalid in Another

Dictionaries drift. New slang gets admitted at different rates. Regional spellings (ORGANIZE vs ORGANISE) appear on one list and not another. Some lists include one-letter inflections (ED, ER, S) more aggressively than others. And games sometimes make their own exceptions for family-friendly gameplay. When a helper result fails in your game, the dictionary is usually the cause rather than a spelling error.

## How to Read Dictionary Badges in Kefiw Tools

Kefiw\u2019s mode switch between \u201CGame list\u201D (ENABLE1) and \u201CFull list\u201D (a broader English dictionary) is the current honest answer to \u201Cwhere did this word come from?\u201D Future builds may add finer-grained badges. For now, treat every result as ENABLE1-sourced unless the mode switch is set to Full list \u2014 and remember that Full list includes archaic, technical, and inflected words that no Scrabble or WWF game accepts.

## What to Do Before Challenging a Word

Check the dictionary your game actually uses. For a casual Scrabble app, that is usually NWL or ENABLE1. For the tournament Collins standard, look at Collins Scrabble Words directly. For Words With Friends, the game itself is the authority \u2014 if it accepts the word, the word is legal. A helper result is useful evidence for study, but the game decides the challenge.

## Related reading

- [Scrabble scoring explained](/guides/scrabble-scoring/)
- [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/)
- [How to use a Scrabble solver fairly](/guides/how-to-use-a-scrabble-solver-fairly/)`,
  },

  {
    id: 'cE-scrabble-board-solver-strategy',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'scrabble-board-solver-strategy',
    guideCategory: 'Scrabble',
    title: 'Scrabble Board Solver Strategy \u2014 Hooks, Cross-Words, and Premium Squares',
    h1: 'Scrabble Board Solver Strategy',
    subhead: 'How a board-aware solver differs from a rack solver, and how to read the moves it suggests.',
    description: 'A board-aware Scrabble solver adds placement, cross-words, and premium-square scoring to raw rack candidates. Learn how to read its suggestions.',
    discoverHeadline: 'The Scrabble solver move top players reject half the time',
    metaDescription: 'Learn how board-aware Scrabble solvers differ from rack helpers \u2014 how hooks, cross-words, premium squares, and defensive play change the best move.',
    keywords: ['scrabble board solver', 'scrabble move solver', 'scrabble hooks', 'scrabble premium squares', 'scrabble cross-words'],
    intro: 'A rack solver finds words from your tiles. A board solver also checks where those words can legally fit, how premium squares change the score, and what cross-words get created. This guide walks through the extra work a board-aware solver does and how to read its suggestions.',
    keyPoints: [
      'A rack solver returns candidate words; a board solver returns candidate moves.',
      'Hooks and cross-words expand the set of legal placements beyond simple rack play.',
      'Premium squares only fire on the turn a tile first covers them.',
      'The highest raw word score is not always the best move \u2014 board safety and future openings matter.',
      'Compare several top moves to learn strategy, rather than copying one.',
    ],
    examples: [
      { title: 'Hook creates a bingo lane', body: 'Adding S to an existing RETAIN makes RETAINS and frees the lane one square below for your 7-letter word.' },
      { title: 'Cross-word bonus', body: 'Placing a word so a new letter also forms a 2-letter cross-word often adds 10\u201330 points you would miss without the placement check.' },
      { title: 'Raw score vs board score', body: 'Raw word QUIZZES \u2248 34 points. On a triple-word with cross-words and a bingo, the actual move can score 100+.' },
      { title: 'Defensive move', body: 'A lower-scoring play that closes a triple-word lane can save more points than a higher-scoring play that opens one.' },
    ],
    whenToUse: [
      { toolId: 'scrabble-helper', note: 'Use for rack-level candidates with zero-value blank scoring and bingo bonus.' },
      { toolId: 'word-finder', note: 'Use to explore specific patterns, fills, or length constraints around a board square.' },
      { articleId: 'cE-scrabble-scoring', note: 'Use before a solver run so you understand why the returned score differs from raw tile values.' },
      { articleId: 'cE-scrabble-bingo-strategy', note: 'Use alongside a board solver when hunting for 7-tile plays.' },
    ],
    relatedIds: [
      'scrabble-helper',
      'cE-scrabble-scoring',
      'cE-scrabble-bingo-strategy',
      'cS-best-2-letter-scrabble-words',
      'cS-best-3-letter-scrabble-words',
    ],
    primaryCta: { href: '/word-tools/scrabble-helper/', label: 'Scrabble Word Finder' },
    faq: [
      { q: 'What is the difference between a rack solver and a board solver?', a: 'A rack solver finds words from your letters, while a board solver checks where those words can legally fit. Board solvers include placement, cross-words, and premium-square scoring.', faq_intent: 'comparison' },
      { q: 'How do hooks work in Scrabble?', a: 'Hooks are letters added to existing words to form new valid words. They let one move score in multiple directions and make short-word knowledge much more valuable.', faq_intent: 'definition' },
      { q: 'Why is the highest raw word not always the best move?', a: 'The highest raw word may miss premium squares, create weak defense, or fail to form valuable cross-words. Board position often matters more than tile total alone.', faq_intent: 'edge-case' },
      { q: 'Can a board solver help me learn Scrabble strategy?', a: 'A board solver can teach strategy when you compare its top moves instead of copying one result. Look at score, board safety, rack leave, and future openings.', faq_intent: 'how-to' },
      { q: 'Should I use a Scrabble board solver during a live game?', a: 'Use a board solver only when it fits the rules of your setting. It is best for study, post-game review, casual agreement, or solo practice.', faq_intent: 'trust' },
    ],
    longformMarkdown: `## What a Board Solver Adds Beyond a Rack Solver

A rack solver answers one question: given these seven tiles, what words can I spell? Kefiw\u2019s [Scrabble Word Finder](/word-tools/scrabble-helper/) is a rack solver. It ranks candidate words by raw tile value, applies zero-value blank scoring, and flags bingo candidates. What it does not answer is whether a specific candidate can legally sit on the current board, which cross-words it would form, or whether a premium square is available.

A board solver adds those answers. For each candidate word, it tries every legal placement on the board, computes the cross-words that would form, and applies premium-square multipliers \u2014 then sorts the full move list by final score, not raw word score. That is a much larger search space but a much more useful answer during a real game.

## How Hooks and Cross-Words Create Legal Moves

Hooks are letters added to existing words to form new valid words. Dropping an S on the end of RETAIN produces RETAINS. Adding H in front of OST produces HOST. Hooks let one move touch two words at once: the main word you place and the cross-word your tile completes. Without hooks, many board positions are playable only with exact-fit words.

Cross-words are the perpendicular words formed by a single newly placed tile. If you play STARE across row 8 and the R in STARE shares a column with an existing O above and T below, you have just formed the cross-word ROT for free. Board solvers track every cross-word and add its score to the move.

## Why Premium Squares Change the Best Play

Premium squares count only when a tile is first placed on them. They do not keep multiplying later turns after the square is already covered. A double-letter under a Q in your play is worth 20 points (Q=10, doubled); on the next turn, if a new tile uses the same square for a cross-word, the bonus does not fire again.

Two things follow. First, planning which premium squares you cover is part of scoring strategy, not just an accident. Second, opening a triple-word lane for an opponent can cost more than the move you just made scored. A board solver weighs both.

## How to Compare the Top Suggested Moves

When a solver offers several top moves, do not copy the top one blindly. Look at score, board safety, and what the rack leaves behind. A 34-point play that leaves you with a balanced rack (mix of vowels and consonants, nothing duplicated) is often stronger than a 38-point play that leaves you with IIOUU. The solver usually shows the top 5\u201310 moves \u2014 compare them.

## Defensive Board Solver Strategy

Defensive play is what separates a scoring rack from a winning game. Close triple-word lanes when your opponent is likely to reach them. Avoid dumping an S or a blank when a simpler play would do. A solver that ranks only by immediate score does not measure defensive value \u2014 you have to add that judgement yourself by scanning the top suggestions for the one that leaves fewer opportunities open.

## Practice Method: Solve First, Then Check

The most effective practice routine: find a move yourself, write down your expected score, then run the solver. Compare the move you chose to the top suggestion. Was the difference a missed hook? A better cross-word? A better rack leave? Repeating this loop teaches pattern recognition in a way that just copying solver output never does. See [how to use a Scrabble solver fairly](/guides/how-to-use-a-scrabble-solver-fairly/) for a longer practice routine.

## Related reading

- [Scrabble scoring explained](/guides/scrabble-scoring/)
- [Scrabble bingo strategy](/guides/scrabble-bingo-strategy/)
- [Best 2-letter Scrabble words](/guides/best-2-letter-scrabble-words/)
- [Best 3-letter Scrabble words](/guides/best-3-letter-scrabble-words/)`,
  },

  {
    id: 'cE-how-to-use-scrabble-solver-fairly',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'how-to-use-a-scrabble-solver-fairly',
    guideCategory: 'Scrabble',
    title: 'How to Use a Scrabble Solver Fairly \u2014 Practice, Study, and Casual Play',
    h1: 'How to Use a Scrabble Solver Fairly',
    subhead: 'When a word finder is a learning tool and when it crosses into cheating.',
    description: 'A Scrabble solver is a study tool when used after your own move. Here\u2019s how to practice with one, when to avoid it, and how to set fair rules for casual games.',
    discoverHeadline: 'When a Scrabble solver crosses the line into cheating',
    metaDescription: 'Learn fair ways to use a Scrabble word finder \u2014 for study, practice, and post-game review \u2014 and when a solver crosses into cheating during a live game.',
    keywords: ['scrabble solver ethics', 'scrabble cheating', 'scrabble practice', 'learn scrabble', 'scrabble study method'],
    intro: 'A Scrabble solver can teach strategy or it can undo a game. The difference is how and when you use it. This guide lays out fair uses, the practice routine that actually builds skill, and how to agree on solver rules in casual play.',
    keyPoints: [
      'Solvers are study tools when used after your own move, not before.',
      'Fair uses include post-game review, solo practice, and classroom study.',
      'Unfair uses include live competition without opponent consent.',
      'Comparing several solver suggestions teaches more than copying one.',
      'A clear agreement before a casual game prevents the tool from becoming an unfair edge.',
    ],
    examples: [
      { title: 'Study routine', body: 'Make your move on paper, write your expected score, then run the solver and compare.' },
      { title: 'Post-game review', body: 'After a loss, walk every turn through a solver and mark the moves where your choice and the top suggestion diverged by 10+ points.' },
      { title: 'Casual agreement', body: '\u201CEither of us can use a solver, but only after we have chosen our own move.\u201D Both players learn; no one has an information advantage.' },
      { title: 'Solo practice', body: 'Play both sides against yourself, using the solver on one side only, to explore positions you rarely see in real games.' },
    ],
    whenToUse: [
      { toolId: 'scrabble-helper', note: 'Use for rack-level candidate lookup during practice, then compare against your own move.' },
      { toolId: 'words-with-friends-helper', note: 'Use the same way for WWF; tile-value differences matter.' },
      { toolId: 'word-unscrambler', note: 'Use for anagram study and spotting useful stems.' },
      { toolId: 'word-finder', note: 'Use for pattern study around specific board squares or letter positions.' },
    ],
    relatedIds: [
      'scrabble-helper',
      'words-with-friends-helper',
      'word-unscrambler',
      'word-finder',
      'cE-scrabble-board-solver-strategy',
      'cE-scrabble-dictionaries-explained',
    ],
    primaryCta: { href: '/word-tools/scrabble-helper/', label: 'Scrabble Word Finder' },
    faq: [
      { q: 'Is using a Scrabble solver cheating?', a: 'Using a Scrabble solver is cheating only when it breaks the rules or expectations of the game being played. For study, review, and solo practice, it is a learning tool.', faq_intent: 'trust' },
      { q: 'How can I use a Scrabble solver to improve?', a: 'Use a Scrabble solver after making your own move, then compare alternatives. Focus on missed hooks, rack balance, premium-square use, and defensive consequences.', faq_intent: 'how-to' },
      { q: 'Should I use a word finder during a casual game?', a: 'Use a word finder during casual play only when all players agree. Clear expectations prevent the tool from turning a friendly game into an unfair advantage.', faq_intent: 'trust' },
      { q: 'Can beginners learn Scrabble faster with a solver?', a: 'Beginners can learn faster with a solver when they study the patterns behind results. The goal is to remember useful words, not depend on the tool forever.', faq_intent: 'how-to' },
      { q: 'What is the best way to practice without copying solver answers?', a: 'Make your own move first, write down your reasoning, then check the solver. Comparing your move with better options builds pattern recognition and board awareness.', faq_intent: 'how-to' },
    ],
    longformMarkdown: `## Is Using a Scrabble Solver Cheating?

Using a Scrabble solver is cheating only when it breaks the rules or expectations of the game being played. Tournament and rated online play both prohibit external lookup \u2014 using a solver there is cheating, full stop. In casual play, the answer depends on the agreement between players. In solo practice, against a bot, or during study, a solver is a learning tool like any reference book.

The misleading framing is \u201Csolvers are cheating tools.\u201D They are pattern-lookup tools. How they are used decides their status.

## Fair Uses: Study, Review, and Solo Practice

Three use cases are clearly fair. First: post-game review. Walk your finished game through a solver and note where your move diverged from the top suggestion by more than about 10 points. The pattern that caused the gap is usually the thing worth learning. Second: solo practice. Play both sides of a game, run the solver on one side, and look at positions you rarely hit in real games. Third: classroom and club study. Group practice with a solver is how many competitive players teach intermediates the short-word lists and common stems.

## When to Avoid Using a Solver

Live rated play. Tournament games. Timed online matches where opponents do not know you are using external help. And any situation where the agreement is \u201Cno external tools\u201D \u2014 even an unspoken agreement, in a family game that has always been played from memory. If in doubt, ask before the game starts.

## How to Learn From Solver Results

A solver rarely teaches by giving you one answer. It teaches by showing the several ways a position could go. For each top suggestion, ask: why is this better than my move? Was it a hook I missed? A premium square I did not see? A rack leave I should have preferred? Write down the answer in your own words. Over a few weeks, the repeated questions become pattern memory.

The [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/) guide has a longer walk-through of comparing top moves.

## A Practice Routine That Builds Skill

A four-step loop works for most players:

1. Set up a mid-game position.
2. Make your move without a solver. Write down the move and your expected score.
3. Run the solver and note the top three suggestions.
4. Circle the first place where you and the solver diverged. Spend two minutes understanding why.

Thirty minutes of this routine, three times a week, teaches more than an hour of unfocused play.

## Setting Rules for Casual Games

For casual play with friends or family, agree before the game starts. Three common rules:

- Nobody uses a solver at the table.
- Both players may use a solver, but only after they have chosen their own move first.
- Both players use solvers freely \u2014 the game becomes an exercise in comparison and explanation rather than memory recall.

Any of these is fair when all players agree. The failure mode is unspoken assumptions. Five minutes of agreement before the first move saves an argument later.

## Related reading

- [Scrabble board solver strategy](/guides/scrabble-board-solver-strategy/)
- [Scrabble dictionaries explained](/guides/scrabble-dictionaries-explained/)
- [Scrabble scoring explained](/guides/scrabble-scoring/)`,
  },
];

// ---------------------------------------------------------------------------
// Tool-page relatedIds additions (merged into TOOLS after V3 enhancements)
// ---------------------------------------------------------------------------

export const SCRABBLE_TOOL_RELATED_ADDITIONS: Record<string, string[]> = {
  'scrabble-helper': [
    'cE-scrabble-scoring',
    'cE-scrabble-blanks',
    'cE-scrabble-board-solver-strategy',
    'cE-scrabble-dictionaries-explained',
    'cE-how-to-use-scrabble-solver-fairly',
  ],
  'words-with-friends-helper': [
    'cS-words-with-friends-scoring-differs',
    'cE-scrabble-dictionaries-explained',
    'cE-scrabble-blanks',
    'cE-how-to-use-scrabble-solver-fairly',
  ],
  'word-unscrambler': [
    'cE-scrabble-dictionaries-explained',
    'cE-how-to-use-scrabble-solver-fairly',
    'word-finder',
  ],
  'word-finder': [
    'cE-scrabble-dictionaries-explained',
    'cE-scrabble-blanks',
    'cA-2-letter-words',
    'cA-3-letter-words',
  ],
};

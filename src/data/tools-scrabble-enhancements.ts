// Auto-generated from scrabble-V3-enhanced.json
// Writer-enhanced overrides for scrabble cluster tools.
// Merged into TOOLS at export time (see src/data/tools.ts).
// Do not edit by hand — regenerate with the same command used for articles.

import type { ToolConfig } from './tools';

export const SCRABBLE_TOOL_ENHANCEMENTS: Record<string, Partial<ToolConfig>> = {
  "scrabble-helper": {
    description: "Find playable Scrabble words from your rack, ranked by standard tile values and bingo potential.",
    metaDescription: `Enter Scrabble tiles, use ? for blanks, and see playable words ranked by score. Includes an optional through-letter filter and clear scoring caveats.`,
    intro: `Use the Scrabble Word Finder when you have a rack and need a fast shortlist of playable words. Enter up to 9 letters, add ? for blanks, and optionally require one board letter the word must pass through. Results are ranked by raw Scrabble score with the 7-tile bingo bonus applied, so you can quickly compare high-value plays before checking the real board.`,
    outcomeLine: "Your rack, optional through-letter, and a score-ranked list of playable Scrabble words.",
    howTo: [
      "Type the tiles from your rack. Use ? for each blank tile.",
      "Add one board letter only if every candidate must play through that letter.",
      "Switch between Scored mode for point ranking and Basic mode for alphabetical browsing.",
      "Review the top play, bingo count, and short-word options before choosing a move.",
      "Manually verify blank scoring, premium squares, and cross-words on the actual board.",
    ],
    examples: [
      {
        title: "Rack: AEINRST",
        body: "Shows classic bingo-stem words and ranks 7-tile candidates with the +50 bonus applied.",
      },
      {
        title: "Rack: QI?TARS with board letter A",
        body: "Filters to words containing A, using ? where needed, but does not model the rest of the board.",
      },
      {
        title: "Rack: ZAEIORT",
        body: "Surfaces short Z plays such as ZA alongside longer options so you can compare score versus leave.",
      },
    ],
    faq: [
      {
        q: "How does the Scrabble Word Finder choose the best play?",
        a: `It ranks playable words from your rack by Scrabble tile value, then length, then alphabetical order. The current tool checks whether each dictionary word can be made from your letters, supports ? as blanks, and can require one board letter to be used. It does not evaluate full board position or premium squares.`,
        faq_intent: "definition",
      },
      {
        q: "Can this Scrabble helper use blank tiles?",
        a: `Yes, the Scrabble helper accepts ? as a blank tile that can stand for any missing letter. One important scoring caveat remains: the current implementation scores blanks as if they were the represented letter, so blank-involved point totals can be too high compared with real Scrabble scoring.`,
        faq_intent: "edge-case",
      },
      {
        q: "Does this Scrabble word finder model double-word and triple-word squares?",
        a: `No, the current Scrabble word finder does not model premium squares, hooks, cross-words, or full board layout. It is best for finding candidate words from a rack, then checking the actual board manually. Use the optional board-letter field only when a word must play through one known letter.`,
        faq_intent: "trust",
      },
      {
        q: "What dictionary does the Kefiw Scrabble helper use?",
        a: `The helper uses the public-domain ENABLE1 word list as a practical game-word source. ENABLE1 is close enough for casual play and study, but it is not the same as every official tournament or app dictionary. Confirm unusual words before a challenge in a strict game.`,
        faq_intent: "trust",
      },
      {
        q: "When should I use the Scrabble helper instead of the Word Unscrambler?",
        a: `Use the Scrabble helper when score order matters and you want rack words ranked by Scrabble values. Use the Word Unscrambler when you want broader exploration by length, dictionary mode, and optional score display rather than a capped score-ranked list.`,
        faq_intent: "comparison",
      },
      {
        q: "Why are some obvious board plays missing?",
        a: `A word can be missing when it is not in ENABLE1, exceeds the rack and board-letter constraints, or needs board letters the tool cannot model. The helper only knows your rack and one optional through-letter. It cannot infer extra letters from adjacent words or open board lanes.`,
        faq_intent: "troubleshooting",
      },
    ],
    useCases: [
      "Finding the best rack-only Scrabble candidate before checking board placement.",
      "Studying high-scoring words from awkward racks with Q, Z, X, or J.",
      "Checking whether a blank creates a 7-tile bingo candidate.",
      "Practicing score awareness with raw tile values and bingo bonuses.",
    ],
    commonMistakes: [
      "Treating the ranked list as a full board solver.",
      "Forgetting that blank-involved scores can be overstated in the current implementation.",
      "Assuming every ENABLE1 word is accepted by every official app or tournament list.",
      "Choosing the top raw score without checking defense, leave, or premium-square exposure.",
    ],
    limitations: [
      "Uses ENABLE1, not a guaranteed official tournament or app dictionary.",
      "Scores blanks as the represented letter instead of zero, so some totals are estimates.",
      "Does not model premium squares, parallel plays, cross-checks, hooks, or full board geometry.",
      "Results are capped at 300 and filtered to words between 2 and 15 letters.",
      "Board-letter support treats one occurrence of one letter as already on the board.",
    ],
    suggestedEnhancements: [
      "Correct blank scoring to zero and display the substituted blank letter.",
      "Add full board placement with premium squares, cross-checks, hooks, and parallel words.",
      "Add dictionary-mode labels or toggles where licensing allows.",
      "Add explanations for unusual words on tap.",
      "Add export filters for length, score band, and contains high-value tile.",
    ],
  },
  "words-with-friends-helper": {
    description: "Find Words With Friends plays from your rack, scored with WWF-style tile values and bingo bonus.",
    metaDescription: `Enter Words With Friends tiles, use ? for blanks, and get playable words ranked by WWF score with an optional through-letter filter.`,
    intro: `Use the Words With Friends Word Finder when a Scrabble score list would mislead you. WWF changes several tile values and uses a +35 bingo bonus, so the best play can differ even with the same letters. Enter your rack, add ? blanks, optionally require one board letter, and compare ranked candidates before checking the live app board.`,
    outcomeLine: "Your rack scored for Words With Friends, not Scrabble.",
    howTo: [
      "Enter up to 9 rack letters. Use ? for blank tiles.",
      "Add one board letter if the word must pass through it.",
      "Review the top WWF score, bingo count, and short-word options.",
      "Use Basic mode for alphabetical browsing or Scored mode for score ranking.",
      "Verify blanks, board bonuses, and app dictionary acceptance before playing.",
    ],
    examples: [
      {
        title: "Rack: JUMBOES",
        body: "WWF values the J more heavily than Scrabble, so J-heavy plays can move up the list.",
      },
      {
        title: "Rack: QAT?ERS",
        body: "Shows Q-without-U options and possible 7-tile plays with the +35 WWF bingo bonus.",
      },
      {
        title: "Rack: ZENL?AR through E",
        body: "Requires E in every result while still using rack letters and blanks for the rest.",
      },
    ],
    faq: [
      {
        q: "How is the Words With Friends word finder different from the Scrabble helper?",
        a: `It uses Words With Friends tile values and the WWF-style bingo bonus instead of Scrabble scoring. The search behavior is similar, but the point totals and best-ranked plays can change because several letters have different values in WWF.`,
        faq_intent: "comparison",
      },
      {
        q: "Can I use ? blanks in the WWF helper?",
        a: `Yes, ? works as a blank tile that can represent any missing letter in a word. The same caveat applies here as in the Scrabble helper: the current implementation scores the represented blank letter at full value, while real WWF blanks score zero.`,
        faq_intent: "edge-case",
      },
      {
        q: "Does the WWF helper use the official Zynga dictionary?",
        a: `No, the helper uses ENABLE1 as a close public word-list proxy for casual Words With Friends play. That means most suggestions will feel familiar, but some app-valid slang may be missing and some ENABLE1 entries may not be accepted by the live game.`,
        faq_intent: "trust",
      },
      {
        q: "Why does the same rack score differently in Words With Friends?",
        a: `Words With Friends changes several tile values and uses a smaller bingo bonus than Scrabble. A rack with J, B, C, L, N, U, or Y can shift noticeably between games. Use the WWF helper for WWF games and the Scrabble helper for Scrabble games.`,
        faq_intent: "definition",
      },
      {
        q: "Can this Words With Friends helper find premium-square placements?",
        a: `No, it finds playable rack words and scores them by WWF tile values, not board position. Premium squares, parallel plays, and hooks must be checked in the app. Use the optional through-letter only when a word has to include one board letter.`,
        faq_intent: "trust",
      },
      {
        q: "When should I ignore the top WWF result?",
        a: `Ignore the top score when it opens a dangerous lane, spends a blank on a small play, or leaves a rack that cannot score next turn. The helper ranks word scores, but human board judgement still matters for defense, tempo, and tile leave.`,
        faq_intent: "how-to",
      },
    ],
    useCases: [
      "Comparing WWF scores when Scrabble values are not accurate.",
      "Practicing high-value WWF racks with J, Q, X, and Z.",
      "Finding a 7-tile candidate for the smaller WWF bingo bonus.",
      "Checking a through-letter idea before moving tiles in the app.",
    ],
    commonMistakes: [
      "Using Scrabble scores for a WWF board.",
      "Assuming ENABLE1 exactly matches the live app dictionary.",
      "Forgetting the tool does not see WWF premium-square layout.",
      "Treating a blank as high-value when the actual blank tile scores zero.",
    ],
    limitations: [
      "Uses ENABLE1 as a proxy, not the official Zynga Words With Friends dictionary.",
      "Scores blanks at represented-letter value instead of zero.",
      "Does not model premium squares, parallel plays, app-only board rules, or full placement legality.",
      "Results are capped at 300 and depend on one optional through-letter at most.",
      "Does not handle special WWF2 modes or player-specific app features.",
    ],
    suggestedEnhancements: [
      "Correct blank scoring to zero and display the substituted blank letter.",
      "Add full board placement with premium squares, cross-checks, hooks, and parallel words.",
      "Add a clearer dictionary disclaimer and optional WWF-specific word source if licensing permits.",
      "Add explanations for unusual words on tap.",
      "Add export filters for length, score band, and contains high-value tile.",
    ],
  },
  "word-unscrambler": {
    description: "Unscramble letters into buildable English words, with ? blanks and game/full dictionary modes.",
    metaDescription: `Paste letters into Kefiw Word Unscrambler to find words by length. Supports ? blanks, game and full lists, and optional Scrabble/WWF scores.`,
    intro: `Use the Word Unscrambler when the main problem is “what words can these letters make?” rather than “what is the highest scoring move?” It checks your letters against a game-focused or broader dictionary, groups results by length, and can show Scrabble and WWF scores when useful. It is ideal for puzzles, practice racks, and exploring unfamiliar letter combinations.`,
    outcomeLine: "Every word your letters can build, grouped by length and optionally scored.",
    howTo: [
      "Type or paste your letters into the input box.",
      "Add ? for any blank or unknown single letter.",
      "Choose Game list for word-game study or Full list for broader dictionary discovery.",
      "Set a minimum length when you only want longer answers.",
      "Turn on scores when comparing Scrabble and WWF value matters.",
    ],
    examples: [
      {
        title: "Letters: AEINRST",
        body: "Finds 7-letter anagrams plus shorter words, useful for bingo-stem practice.",
      },
      {
        title: "Letters: T?RACE",
        body: "Uses ? as one missing letter and returns words that can be made from the six tiles.",
      },
      {
        title: "Letters: QIIAAT",
        body: "Shows whether the rack has any short Q exits before you waste a turn.",
      },
    ],
    faq: [
      {
        q: "How does the Word Unscrambler find words from letters?",
        a: `It checks each dictionary word to see whether it can be built from your letters and any ? blanks. Results are sorted by length first, then alphabetically, so it is useful for finding long words, short dumps, and practice anagrams from the same rack.`,
        faq_intent: "definition",
      },
      {
        q: "Can the Word Unscrambler handle wildcard letters?",
        a: `Yes, a ? works as a single blank tile that can stand for exactly one missing letter. It is not a multi-letter wildcard, a regex symbol, or a phonetic guess. Add one ? for each unknown tile you want to cover.`,
        faq_intent: "edge-case",
      },
      {
        q: "What is the difference between Game list and Full list?",
        a: `Game list uses ENABLE1 for compact word-game-style results, while Full list uses a broader English dictionary. Game list is better for Scrabble-like study. Full list is better when you want obscure, technical, archaic, or inflected words for non-game puzzles.`,
        faq_intent: "comparison",
      },
      {
        q: "Why did the unscrambler show no long words?",
        a: `Your letters may not form any word at the selected minimum length, especially with repeated consonants or too many vowels. When the minimum length is above two, the tool can retry at two letters and show a fallback notice so you still get usable short plays.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does the Word Unscrambler show Scrabble scores?",
        a: `It can show Scrabble and Words With Friends scores when the score toggle is enabled. Treat blank-involved scores as estimates because the shared scoring helper currently counts blanks at face value rather than zero points.`,
        faq_intent: "how-to",
      },
      {
        q: "When should I use Word Finder instead of the Word Unscrambler?",
        a: `Use Word Finder when you need length bounds or a fixed positional pattern like A??LE. Use the Word Unscrambler when you simply want every word that can be built from the letters in front of you, grouped by length.`,
        faq_intent: "comparison",
      },
    ],
    useCases: [
      "Solving an anagram or word puzzle from a fixed pile of letters.",
      "Practicing Scrabble racks without focusing only on score.",
      "Finding short dumps from unbalanced vowel or consonant racks.",
      "Comparing Game list and Full list results for obscure forms.",
    ],
    commonMistakes: [
      "Expecting extra letters not present in the input to appear in results.",
      "Using Full list for a strict word game without checking game legality.",
      "Treating ? as a multi-character wildcard.",
      "Assuming optional scores account for zero-value blanks.",
    ],
    limitations: [
      "Does not add letters that are not in the input.",
      "Does not support positional patterns; use Word Finder for that.",
      "Full list may include words that are not valid in Scrabble or WWF.",
      "Neither dictionary mode intentionally includes proper nouns or acronyms.",
      "Very open racks can create large result sets.",
    ],
    suggestedEnhancements: [
      "Correct blank scoring to zero and display the substituted blank letter.",
      "Add result caps, lazy loading, and filters for large open racks.",
      "Show which input letters were used for each result.",
      "Add dictionary-mode labels or toggles where licensing allows.",
      "Add explanations for unusual words on tap.",
      "Add export filters for length, score band, and contains high-value tile.",
    ],
  },
  "word-finder": {
    description: "Find words from available letters or exact-length patterns with single-letter wildcards.",
    metaDescription: `Search words by letters or fixed pattern. Word Finder supports ? blanks in Letters mode and ?, _, . wildcards in Pattern mode.`,
    intro: `Use Word Finder when you know either the letters you can use or the exact shape a word must fit. Letters mode works like a controlled rack search with minimum and maximum length filters. Pattern mode is positional: a pattern such as C?A?E finds same-length words where the fixed letters stay fixed and each wildcard covers one character.`,
    outcomeLine: "Search by available letters or by exact fixed-length pattern.",
    howTo: [
      "Choose Letters mode for rack-style searches or Pattern mode for fixed positions.",
      "In Letters mode, enter available letters and ? blanks, then set min and max length.",
      "In Pattern mode, type fixed letters and use ?, _, or . for unknown single positions.",
      "Pick Game list or Full list depending on how broad you want the dictionary to be.",
      "Turn on scores only when Scrabble or WWF value helps compare results.",
    ],
    examples: [
      {
        title: "Letters: RSTLNE?",
        body: "Finds words buildable from the rack and groups them by length.",
      },
      {
        title: "Pattern: A??LE",
        body: "Finds five-letter words beginning with A and ending with LE.",
      },
      {
        title: "Pattern: .RA.E",
        body: "Treats . as one unknown character, not any number of characters.",
      },
    ],
    faq: [
      {
        q: "How does Word Finder by Letters work?",
        a: `It has two modes: Letters mode builds words from available letters, and Pattern mode matches exact positions. In Letters mode, ? can cover missing letters. In Pattern mode, ?, _, and . each match one unknown character in a fixed-length pattern.`,
        faq_intent: "definition",
      },
      {
        q: "Can Word Finder use * for any number of letters?",
        a: `No, the verified Pattern mode supports only single-character wildcards, not * or regex-style patterns. A five-character pattern returns five-letter words only. For prefix, suffix, or substring searches, use the dedicated sibling tools when those pages are available.`,
        faq_intent: "edge-case",
      },
      {
        q: "What is the difference between Letters mode and Pattern mode?",
        a: `Letters mode asks what words can be made from your available letters, while Pattern mode asks what words fit fixed positions. Use Letters mode for racks and anagrams. Use Pattern mode for crossword-style gaps such as C?A?E or Wordle-style known positions.`,
        faq_intent: "comparison",
      },
      {
        q: "Does Word Finder include proper nouns or abbreviations?",
        a: `No, the available word lists are general dictionary lists and do not intentionally include proper nouns, acronyms, or abbreviations. Full list mode may contain technical or archaic terms, but it still should not be treated as a named-entity search engine.`,
        faq_intent: "trust",
      },
      {
        q: "Why are Scrabble scores different when blanks are used?",
        a: `The optional score display shares the same blank-scoring limitation as the game helpers. It can show useful score comparisons, but if a ? represents a high-value letter, real Scrabble and WWF score that tile as zero.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "When should I use the Scrabble helper instead of Word Finder?",
        a: `Use the Scrabble helper when you want Scrabble-specific score ranking from a rack and optional through-letter. Use Word Finder when your main need is flexible letter search, exact-length patterns, dictionary mode switching, or studying words by length.`,
        faq_intent: "comparison",
      },
    ],
    useCases: [
      "Solving crossword-style gaps with known positions.",
      "Finding words from a letter set within a length range.",
      "Studying 5-, 6-, or 7-letter vocabulary by shape.",
      "Checking whether a rack has a specific word length available.",
    ],
    commonMistakes: [
      "Using * even though Pattern mode only supports single-character wildcards.",
      "Expecting Pattern mode to return words of different lengths.",
      "Using Letters mode when the real task is prefix, suffix, or substring matching.",
      "Treating score display as final when blanks are involved.",
    ],
    limitations: [
      "No * wildcard, regex, character classes, or multi-character wildcards.",
      "Pattern mode is exact length only.",
      "Letters mode has no must-include substring constraint.",
      "No premium-square or board-position modelling.",
      "Word lists exclude proper nouns, abbreviations, and acronyms as verified features.",
    ],
    suggestedEnhancements: [
      "Correct blank scoring to zero and display the substituted blank letter.",
      "Add prefix, suffix, contains, and must-include filters inside Word Finder.",
      "Add optional * wildcard for zero-or-more letters, clearly separated from exact-length Pattern mode.",
      "Add dictionary-mode labels or toggles where licensing allows.",
      "Add explanations for unusual words on tap.",
      "Add export filters for length, score band, and contains high-value tile.",
    ],
  },
};

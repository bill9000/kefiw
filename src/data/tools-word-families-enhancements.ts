// Auto-generated from word-families-V3-enhanced.json
// Writer-enhanced overrides for word-families cluster tools.
// Merged into TOOLS at export time (see src/data/tools.ts).
// Do not edit by hand — regenerate with the same command used for articles.

import type { ToolConfig } from './tools';

export const WORD_FAMILIES_TOOL_ENHANCEMENTS: Record<string, Partial<ToolConfig>> = {
  "words-starting-with": {
    description: "Find dictionary words that begin with a literal prefix, then narrow the results with minimum and maximum length filters.",
    metaDescription: `Find English dictionary words starting with any prefix. Filter by length, review counts and stats, and use related tools for endings or containing letters.`,
    intro: `Use Words Starting With when you know the first letters of a word and need a fast, spelling-based list. It helps with crossword crossings, word-game brainstorming, spelling lessons, vocabulary study, and writing prompts where a word must begin a certain way. The tool normalizes your prefix, searches a broad English dictionary in the browser, and sorts matches by length, then alphabetically. For exact game-dictionary validation, use a game-list tool instead of assuming every broad-dictionary result is playable.`,
    outcomeLine: "A length-filtered list of dictionary words whose first letters match your prefix exactly.",
    howTo: [
      "Enter the starting letters you want to match, such as UN, PRE, or ZY.",
      "Set the minimum and maximum length if your puzzle or writing task has a fixed size.",
      "Review the summary, length groups, shortest and longest words, and the first 500 displayed results.",
      "Switch to Words Ending With or Words Containing when the known letters are not at the beginning.",
    ],
    examples: [
      {
        title: "Crossword start: PRE",
        body: `Input: pre · Settings: Min length 5, max length 9 · Returns words that start with PRE, grouped by length, so short fill and longer candidates are easier to scan. · Why it helps: A known crossword beginning plus length limits usually removes most irrelevant words.`,
      },
      {
        title: "Writing prompt: UN",
        body: `Input: un · Settings: Min length 4, max length 12 · Shows broad-dictionary words beginning with UN for a negation or reversal theme. · Why it helps: The list can spark choices like undo, unlock, unable, or unhappy without claiming every result fits every style.`,
      },
      {
        title: "Rare beginning: ZY",
        body: `Input: zy · Settings: Default filters · Shows matching ZY words from the broad dictionary, with a count and length summary. · Why it helps: Rare starts are easier to inspect when the tool shows both count and length distribution.`,
      },
    ],
    faq: [
      {
        q: "How do I find words starting with specific letters?",
        a: `Type the starting letters into the prefix box and adjust the length filters if needed. The tool searches for words whose first characters exactly match your input, after stripping spaces and punctuation. Use the shortest and longest result cards to decide whether your length range is too broad.`,
        faq_intent: "how-to",
      },
      {
        q: "What is the difference between a prefix and words starting with letters?",
        a: `A prefix has meaning, while starting letters may be only a spelling pattern in practical word-search and vocabulary work. UN- is often a prefix meaning not or reverse, but ST- is usually just an opening letter cluster. This tool searches spelling, so it will return both meaningful prefixes and ordinary beginnings.`,
        faq_intent: "definition",
      },
      {
        q: "Can this tool find Scrabble-valid words starting with a prefix?",
        a: `This page uses a broad dictionary, not a guaranteed Scrabble tournament list in practical word-search and vocabulary work. Some results may be archaic, technical, inflected, or otherwise unsuitable for a specific game. For game-list filtering, use Word Finder in game-list mode or another verified game helper.`,
        faq_intent: "trust",
      },
      {
        q: "Why are some two-letter words missing from the results?",
        a: `The default minimum length is three, so two-letter matches are hidden unless you lower it. Change the Min filter to 2 when you need short crossword fill, hooks, or compact word-game plays. The setting is designed to keep ordinary searches readable.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does Words Starting With support wildcards or patterns?",
        a: `No, the prefix must be a literal sequence of letters in this tool's current verified behavior. The tool does not read regex, character classes, or multi-position patterns. Use Word Finder pattern mode when you know fixed positions and need single-character wildcards.`,
        faq_intent: "edge-case",
      },
    ],
    useCases: [
      "Crossword solving when the first letters are confirmed by crossings.",
      "Vocabulary lessons about common prefixes and initial clusters.",
      "Writing poems, names, slogans, or themed lists that need a specific beginning.",
      "Word-game brainstorming when a board opening favors a starting sequence.",
      "Researching how productive a beginning such as un-, re-, or pre- is.",
    ],
    commonMistakes: [
      "Assuming every beginning is a meaningful prefix.",
      "Using this tool for letters that appear in the middle or end of a word.",
      "Forgetting to lower the minimum length when two-letter matches matter.",
      "Treating broad-dictionary results as official game-list results.",
      "Expecting punctuation or spaces to create separate search terms.",
    ],
    limitations: [
      "Search is spelling-based, not meaning-based.",
      "Only literal prefixes are supported; no wildcards, regex, or character classes.",
      "The broad dictionary may include rare, archaic, technical, or inflected forms.",
      "Proper nouns, acronyms, abbreviations, and non-Latin scripts are not included.",
      "Only the first 500 results are displayed when the match count is larger.",
    ],
    suggestedEnhancements: [
      "Add a Game list vs Full dictionary toggle",
      "Add an optional starts-with plus contains filter",
      "Add a copy/export visible-results action",
      "Show a normalization warning when characters are stripped",
    ],
  },
  "words-ending-with": {
    description: "Find dictionary words that end with a literal suffix or final letter sequence, with length filters for tighter results.",
    metaDescription: `Find English dictionary words ending with any suffix or final letters. Filter by length, compare result stats, and use guides for suffix patterns.`,
    intro: `Use Words Ending With when the last letters matter: a crossword ending, a suffix lesson, a spelling pattern, or a writing line that needs a specific visual ending. The search is literal and spelling-based, so TION finds words ending in those letters, not words that sound alike. Results are filtered by length, sorted shortest first, and searched in the browser from a broad English dictionary. For sound-based rhyme work, pair this with a rhyme-specific tool rather than relying on spelling alone.`,
    outcomeLine: "A length-filtered list of dictionary words whose final letters match your suffix exactly.",
    howTo: [
      "Enter the ending letters you want to match, such as ING, TION, LY, or OUS.",
      "Set minimum and maximum length to match your puzzle, lesson, or writing constraint.",
      "Use the result count, shortest/longest cards, and length distribution to narrow the list.",
      "Use Words Containing or Word Finder when the letters are not fixed at the end.",
    ],
    examples: [
      {
        title: "Suffix lesson: TION",
        body: `Input: tion · Settings: Min length 5, max length 12 · Returns words that end in TION, grouped by length for easier classroom or vocabulary use. · Why it helps: A common noun-forming ending becomes easier to teach when examples are visible by length.`,
      },
      {
        title: "Crossword ending: ED",
        body: `Input: ed · Settings: Min length 4, max length 8 · Shows broad-dictionary words ending in ED while excluding very long candidates. · Why it helps: The length range can separate plausible crossword fill from oversized forms.`,
      },
      {
        title: "Writing pattern: LY",
        body: `Input: ly · Settings: Default filters · Finds words ending with LY, including many adverbs and other spelling matches. · Why it helps: The list can support a style check or word bank without claiming every LY word works the same way.`,
      },
    ],
    faq: [
      {
        q: "How do I find words ending with a suffix?",
        a: `Type the final letters into the suffix box and adjust the length filters when setting up a practical word search. The tool returns words whose ending characters exactly match your input after normalization. Use it for spelling endings such as -ing, -ed, -ly, -tion, or any literal final sequence.`,
        faq_intent: "how-to",
      },
      {
        q: "What is the difference between a suffix and a word ending?",
        a: `A suffix usually changes meaning or grammar, while an ending can be any final letters. TION is often a suffix-like ending, but not every final letter sequence is a meaningful suffix. This tool finds spellings, so you still need context for grammar.`,
        faq_intent: "definition",
      },
      {
        q: "Can Words Ending With find rhyming words?",
        a: `It can help brainstorm visual endings, but it does not find phonetic rhymes in practical word-search and vocabulary work. Words like rough and through share spelling patterns but sound different. Use a rhyme-focused tool when pronunciation, stress, and sound are the real goal.`,
        faq_intent: "comparison",
      },
      {
        q: "Why are two-letter ending matches not showing?",
        a: `The default minimum length is three, so two-letter words are hidden until you lower it. Set Min to 2 when your crossword, word-game hook, or short-fill search needs very short matches. The default keeps ordinary suffix searches less cluttered.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does the suffix tool support wildcards or regular expressions?",
        a: `No, the ending must be a literal sequence of letters in this tool's current verified behavior. The tool does not support regex, character classes, or star wildcards. Use Word Finder pattern mode when you need fixed positions with single-character wildcard slots.`,
        faq_intent: "edge-case",
      },
    ],
    useCases: [
      "Crossword solving when the final letters are known.",
      "Suffix lessons for -ing, -ed, -ly, -tion, -ness, and similar endings.",
      "Writing and poetry brainstorming when a line needs a visual ending pattern.",
      "Word-game practice for common endings that can extend a base word.",
      "Vocabulary research into productive English endings.",
    ],
    commonMistakes: [
      "Assuming same spelling means same sound.",
      "Using this page for internal letter sequences instead of final letters.",
      "Treating every ending as a grammatical suffix.",
      "Expecting official game-dictionary results from the broad dictionary.",
      "Leaving max length too high for a fixed crossword answer.",
    ],
    limitations: [
      "Search is spelling-based, not phonetic.",
      "No wildcard, regex, or character-class support.",
      "The broad dictionary may include rare, archaic, technical, or inflected forms.",
      "Proper nouns, acronyms, and abbreviations are not included.",
      "Only the first 500 displayed results are rendered when the match count is larger.",
    ],
    suggestedEnhancements: [
      "Add an optional Game list vs Full dictionary toggle",
      "Add an ending plus contains filter",
      "Add a spelling-vs-sound callout for rhyme searches",
      "Add common suffix chips such as ING, ED, LY, TION, NESS",
    ],
  },
  "words-containing": {
    description: "Find dictionary words that contain an exact contiguous letter sequence anywhere in the word, with length filters.",
    metaDescription: `Find English dictionary words containing a specific letter sequence. Filter by length, compare counts, and use related tools for prefixes or suffixes.`,
    intro: `Use Words Containing when you know a letter sequence appears somewhere in the word but not necessarily at the start or end. It is useful for crosswords, letter-cluster study, spelling patterns, word-game brainstorming, and vocabulary research. The search is exact and contiguous: QUA means Q followed by U followed by A in that order. It does not find separated letters, wildcard patterns, or anagrams; use Word Finder when your letters can appear in different positions.`,
    outcomeLine: "A length-filtered list of dictionary words containing your exact letter sequence anywhere.",
    howTo: [
      "Enter the contiguous letter sequence you want to find, such as QUA, EIGH, or STR.",
      "Adjust minimum and maximum length to match your puzzle or study goal.",
      "Review result counts, length groups, and shortest/longest matches before scanning the list.",
      "Use Words Starting With, Words Ending With, or Word Finder when the constraint is positional or anagram-based.",
    ],
    examples: [
      {
        title: "Letter cluster: QUA",
        body: `Input: qua · Settings: Default filters · Returns words containing the exact Q-U-A sequence in any position. · Why it helps: Useful when a crossword crossing or spelling pattern gives a rare contiguous cluster.`,
      },
      {
        title: "Spelling pattern: EIGH",
        body: `Input: eigh · Settings: Min length 5, max length 12 · Shows broad-dictionary words with EIGH together, grouped by length. · Why it helps: Helps students and writers compare tricky spelling patterns.`,
      },
      {
        title: "Middle letters: STR",
        body: `Input: str · Settings: Min length 6, max length 10 · Finds words where STR appears at the beginning, middle, or end. · Why it helps: Good for broad cluster research before using a stricter prefix or pattern tool.`,
      },
    ],
    faq: [
      {
        q: "How do I find words containing a letter sequence?",
        a: `Type the exact adjacent letters you want the word to contain when setting up a practical word search. The tool searches for that sequence anywhere in each word after normalizing the input. Add length filters when you know the answer size or want fewer results.`,
        faq_intent: "how-to",
      },
      {
        q: "What does contiguous letter sequence mean?",
        a: `Contiguous means the letters appear next to each other in the same order in practical word-search and vocabulary work. Searching QUA matches aqua and quaint because Q-U-A is adjacent. It does not match words where Q, U, and A are separated across the word.`,
        faq_intent: "definition",
      },
      {
        q: "Can this find words made from the letters I enter?",
        a: `No, this tool finds an exact substring, not an anagram or rack fit in this tool's current verified behavior. If your letters can be rearranged or do not need to stay adjacent, use Word Finder or Word Unscrambler-style tools instead. This distinction prevents misleading results.`,
        faq_intent: "comparison",
      },
      {
        q: "Why does my contains search return too many words?",
        a: `Short sequences can appear in many unrelated words, especially common pairs like IN or ER. Add another letter, tighten the length range, or switch to Words Starting With or Words Ending With if you know the position. Broader inputs naturally create broader lists.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does Words Containing support wildcards, regex, or letter sets?",
        a: `No, it only supports a literal adjacent substring search in this tool's current verified behavior. Wildcards, regex, character classes, and non-adjacent letter sets are outside this tool. Use Word Finder pattern mode for fixed-position blanks or Letters mode for rack-style searches.`,
        faq_intent: "edge-case",
      },
    ],
    useCases: [
      "Crossword solving when a middle crossing gives adjacent letters.",
      "Spelling lessons about clusters such as eigh, tion, str, or qua.",
      "Word-game brainstorming around a rare board sequence.",
      "Vocabulary research into letter patterns and word families.",
      "Writing word banks where a visible internal pattern matters.",
    ],
    commonMistakes: [
      "Entering separated letters and expecting anagrams.",
      "Expecting wildcard or regex syntax to work.",
      "Using contains search when the start or end is already known.",
      "Leaving the length range too broad for a fixed puzzle answer.",
      "Assuming broad-dictionary output is official game-list output.",
    ],
    limitations: [
      "The sequence must be adjacent and in order.",
      "No wildcards, regex, character classes, or separated letter matching.",
      "No position constraint inside this tool.",
      "The broad dictionary may include rare, technical, archaic, or inflected forms.",
      "Only the first 500 displayed results are rendered when the match count is larger.",
    ],
    suggestedEnhancements: [
      "Add explicit mode tabs for Contiguous sequence vs Any letters",
      "Add optional position filters: anywhere, starts, ends, middle",
      "Add a no-results troubleshooting card",
      "Add common cluster chips such as QUA, EIGH, STR, TION",
    ],
  },
  "word-finder": {
    description: "Find words from available letters or match a fixed-length pattern with single-character wildcards.",
    metaDescription: `Use Word Finder to search by letters or fixed patterns. Supports blanks, single-character wildcards, game/full lists, length filters, and score display.`,
    intro: `Use Word Finder when you have a rack of letters, a fixed puzzle pattern, or a word-game situation that needs more than a simple prefix or suffix search. Letters mode finds words that can be made from your available letters, including blanks. Pattern mode matches a fixed-length pattern where ?, _, or . stands for one unknown letter. You can choose a compact game list or a broader dictionary and optionally show Scrabble and Words With Friends scores. The tool does not model a board, premium squares, hooks, or regex-style patterns.`,
    outcomeLine: "Words that fit your available letters or fixed-length single-wildcard pattern.",
    howTo: [
      "Choose Letters mode when you have a rack or bag of available letters.",
      "Use ? in Letters mode for blank tiles and set min/max length as needed.",
      "Choose Pattern mode when each position is known or unknown, using ?, _, or . for one unknown letter.",
      "Choose Game list or Full list based on whether you want compact game-style output or broader vocabulary.",
      "Turn on scores when Scrabble and Words With Friends point values help you compare candidates.",
    ],
    examples: [
      {
        title: "Rack search: RSTLNE?",
        body: `Input: RSTLNE? · Returns words that can be built from those letters plus one blank, within the selected length range. · Why it helps: A rack-style search helps brainstorm plays without pretending to know the best board move.`,
      },
      {
        title: "Pattern search: C?A_E",
        body: `Input: C?A_E · Matches five-letter words where C is first, A is third, E is fifth, and the wildcard positions can be any letter. · Why it helps: Fixed-position puzzles become easier when each unknown slot is treated as exactly one letter.`,
      },
      {
        title: "Score comparison",
        body: `Input: QUIZ?? · Shows candidate words with inline Scrabble and Words With Friends scores. · Why it helps: Scores can guide practice, though board placement and premium squares still determine the real move value.`,
      },
    ],
    faq: [
      {
        q: "How does Word Finder find words from letters?",
        a: `Letters mode checks which dictionary words can be formed from your available letters in practical word-search and vocabulary work. It respects the selected length range and can use ? as blank tiles. Results are sorted by length in Letters mode, which helps you find longer candidates first.`,
        faq_intent: "how-to",
      },
      {
        q: "What is the difference between Letters mode and Pattern mode?",
        a: `Letters mode rearranges available letters, while Pattern mode matches fixed positions in practical word-search and vocabulary work. Use Letters for racks and anagrams; use Pattern for crosswords, Wordle-style blanks, or known letter slots. Pattern wildcards are single-character placeholders, not regex symbols.`,
        faq_intent: "comparison",
      },
      {
        q: "Can I use wildcards in Word Finder?",
        a: `Yes, but the wildcard behavior depends on the mode you choose when the rule and dictionary match. In Letters mode, ? represents a blank tile from your rack. In Pattern mode, ?, _, and . each match one unknown letter. Star wildcards and regex quantifiers are not supported.`,
        faq_intent: "edge-case",
      },
      {
        q: "Are Word Finder results valid for Scrabble or Words With Friends?",
        a: `Game list mode uses a compact word-game list, but board legality still depends on the game. The tool can show point values, yet it does not check board placement, hooks, premium squares, or tournament-specific dictionary changes. Treat it as a candidate finder.`,
        faq_intent: "trust",
      },
      {
        q: "Why did Pattern mode return no words?",
        a: `Pattern mode only checks words with the exact same length as your pattern in practical word-search and vocabulary work. A four-character pattern cannot match a five-letter word, and each wildcard covers exactly one letter. Check the pattern length, fixed letters, and selected dictionary list before assuming no word exists.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Should I use Word Finder or Words Containing?",
        a: `Use Word Finder when letters can move or positions are partly unknown for practical word study and puzzle work. Use Words Containing when you need an exact adjacent sequence inside a word. The tools answer different questions, so switching between them often solves a puzzle faster.`,
        faq_intent: "comparison",
      },
    ],
    useCases: [
      "Finding words from a Scrabble-style rack, including blanks.",
      "Solving fixed-position word patterns with unknown letters.",
      "Comparing Scrabble and Words With Friends point values for candidates.",
      "Checking possible crossword answers when length and some letters are known.",
      "Practicing anagram and pattern-recognition skills without modeling the board.",
    ],
    commonMistakes: [
      "Using Pattern mode with the wrong number of characters.",
      "Expecting * to work as a variable-length wildcard.",
      "Assuming point values include board bonuses.",
      "Using Letters mode when a fixed-position crossword pattern is needed.",
      "Expecting proper nouns, acronyms, slang, or board hooks.",
    ],
    limitations: [
      "Pattern wildcards are single-character only: ?, _, or .",
      "Star wildcards, regex quantifiers, and character classes are not supported.",
      "The tool does not model premium squares, board placement, hooks, or parallel plays.",
      "Proper nouns, acronyms, and abbreviations are not included.",
      "Letters mode does not provide a separate must-include constraint.",
    ],
    suggestedEnhancements: [
      "Add must-include and exclude-letter filters",
      "Add a board-aware helper as a separate advanced mode",
      "Add a wildcard legend beside the input",
      "Add copy/export for grouped results and scores",
      "Add mode-specific empty-state tips",
    ],
  },
};

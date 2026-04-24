// Auto-generated from unscramble-V3-enhanced.json
// Writer-enhanced overrides for unscramble cluster tools.
// Merged into TOOLS at export time (see src/data/tools.ts).
// Do not edit by hand — regenerate with the same command used for articles.

import type { ToolConfig } from './tools';

export const UNSCRAMBLE_TOOL_ENHANCEMENTS: Record<string, Partial<ToolConfig>> = {
  "word-unscrambler": {
    description: `Unscramble letters into valid English words using your exact rack, optional blank tiles, length filters, and a compact or full dictionary.`,
    metaDescription: `Unscramble letters into English words with blank tiles, length filters, dictionary choice, and optional Scrabble or WWF score display.`,
    intro: `Use the Word Unscrambler when you have a messy rack of letters and need to see every word those letters can make. Enter your letters, add ? for each blank tile, choose a minimum length, and scan the longest results first. The tool runs in your browser, supports a game-sized ENABLE1 list or a broader dictionary, and can show Scrabble and Words With Friends scores for comparison.`,
    outcomeLine: "Enter your letters and get every dictionary word those letters can spell, longest first.",
    howTo: [
      "Type only the letters you actually have. Keep duplicate letters because duplicate tiles matter.",
      "Add ? for each blank tile and choose Game list or Full list.",
      "Set a minimum length to hide tiny results when you need longer plays.",
      "Turn on scores when you want Scrabble and WWF point estimates beside each word.",
      "Scan the longest group first, then use short results for hooks, tile dumps, or tight boards.",
    ],
    examples: [
      {
        title: "Input: TEINGL",
        body: "A length-first scan surfaces longer options such as TINGLE before shorter words like LINE, LENT, GEL, and TEN.",
      },
      {
        title: "Input: AEI?NRT",
        body: "The ? acts as one blank tile, so the result set expands to words that can use A, E, I, N, R, T plus one extra letter.",
      },
      {
        title: "Input: QI??",
        body: "Blanks create many short options. Use a minimum length or score display to keep the list practical.",
      },
    ],
    faq: [
      {
        q: "How does a word unscrambler use my letters?",
        a: `A word unscrambler checks which dictionary words can be built from the exact letters you enter. Duplicate letters are counted separately, and each ? can stand for one missing letter. This makes it useful for Scrabble-style racks, word jumbles, and vocabulary practice.`,
        faq_intent: "definition",
      },
      {
        q: "Can I use blank tiles in the Word Unscrambler?",
        a: `Yes, type ? for each blank tile you want the Word Unscrambler to treat as any single letter. A blank expands the search a lot, so set a minimum length or use score display when the result list becomes too large.`,
        faq_intent: "how-to",
      },
      {
        q: "Why did the unscrambler return words I cannot play in Scrabble?",
        a: `The Full list can include broader English words that may not be valid in a specific game. Use Game list for casual Scrabble or Words With Friends style play, but remember Kefiw does not claim TWL, SOWPODS, or official tournament validation.`,
        faq_intent: "trust",
      },
      {
        q: "What should I do when there are too many unscrambler results?",
        a: `Narrow the list by increasing the minimum length or switching your goal from length to score. For a fixed pattern or known position, use Word Finder instead because positional clues reduce noise much faster than raw letter searches.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Is the highest score shown always the best play?",
        a: `No, score display estimates raw letter value and does not model the actual board. Premium squares, hooks, parallel words, and blank scoring can change the best play, so treat scores as a shortlist rather than final board advice.`,
        faq_intent: "edge-case",
      },
    ],
    useCases: [
      "Solve a scrambled-letter puzzle without manually testing every arrangement.",
      "Find long rack options before deciding whether a Scrabble or WWF bingo is realistic.",
      "Study unfamiliar short words that can rescue awkward racks.",
      "Compare Game list and Full list when a puzzle accepts broader English vocabulary.",
    ],
    commonMistakes: [
      "Dropping duplicate letters even though the rack contains them.",
      "Using Full list for a game that expects a narrower word list.",
      "Assuming ? can represent multiple letters instead of exactly one tile.",
      "Treating raw score display as final board scoring.",
    ],
    limitations: [
      "The tool does not find words requiring letters you did not enter.",
      "It does not support multi-character wildcards or regex-style patterns.",
      "It does not include proper nouns, acronyms, or tournament-certified word-list claims.",
      "Very open racks can create large result sets.",
      "When scores are shown, blank-substituted letters may be overvalued compared with real game scoring.",
    ],
  },
  "anagram-solver": {
    description: "Find exact same-letter anagrams or partial single-word matches from an English word or letter string.",
    metaDescription: `Find exact anagrams and partial single-word matches from your letters. Choose Game list or Full list and view optional Scrabble/WWF scores.`,
    intro: `Use the Anagram Solver when the puzzle asks for a rearrangement of letters, especially when every letter matters. Exact mode finds same-length single-word anagrams that use all letters and excludes the input word itself. Any-letters mode broadens the search to shorter words that can be built from the same letters. Spaces, digits, and punctuation are ignored, and this tool does not support blanks or multi-word phrase anagrams.`,
    outcomeLine: "Choose exact or partial mode and see the single-word anagrams your letters can make.",
    howTo: [
      "Enter the word or letters to rearrange.",
      "Choose All letters for exact same-length anagrams, or Any letters for shorter partial matches.",
      "Choose Game list for a compact game-style list or Full list for broader English vocabulary.",
      "Turn on scores if you want Scrabble and WWF point estimates beside results.",
      "Use Word Unscrambler instead when you need blanks.",
    ],
    examples: [
      {
        title: "Input: LISTEN, All letters",
        body: "Returns exact same-length options such as SILENT, ENLIST, INLETS, and TINSEL when they appear in the selected list.",
      },
      {
        title: "Input: STREAM, Any letters",
        body: "Returns six-letter rearrangements plus shorter words that can be built from the letters.",
      },
      {
        title: "Input: MOON STARER",
        body: "The tool strips spaces and treats the input as one letter string; it will not split the answer into a phrase.",
      },
    ],
    faq: [
      {
        q: "What is an anagram solver?",
        a: `An anagram solver finds words made by rearranging the letters you enter. Kefiw supports exact single-word anagrams and partial matches, but it does not split letters into multi-word phrases or support blank tiles in this tool.`,
        faq_intent: "definition",
      },
      {
        q: "Does the Anagram Solver use all letters?",
        a: `Yes in All letters mode, the Anagram Solver requires every letter to be used exactly once. In Any letters mode, it also shows shorter words that can be made from a subset of the same letters.`,
        faq_intent: "comparison",
      },
      {
        q: "Can I use ? as a blank in the Anagram Solver?",
        a: `No, this anagram tool does not support ? wildcard blanks. Use the Word Unscrambler or Word Finder when a puzzle gives you a blank tile or an unknown letter that can become anything.`,
        faq_intent: "edge-case",
      },
      {
        q: "Why did my phrase anagram not appear?",
        a: `Kefiw’s Anagram Solver returns single-word results, not phrase anagrams with spaces. It strips spaces before matching, so a phrase input becomes one long letter string and will only match same-length single dictionary words in exact mode.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Should I use Exact mode or Any letters mode?",
        a: `Use Exact mode when the puzzle requires every letter, and Any letters mode when shorter answers are acceptable. Exact mode is best for jumbles and clue anagrams; Any letters mode is better for exploring playable words from a rack.`,
        faq_intent: "how-to",
      },
    ],
    useCases: [
      "Solve a jumble where all letters must be used.",
      "Check whether a word has another same-letter form.",
      "Explore partial word possibilities from a confusing letter set.",
      "Compare exact anagrams with broader unscrambler results.",
    ],
    commonMistakes: [
      "Expecting phrase output even though the tool only returns single words.",
      "Typing ? for a blank, which this tool does not support.",
      "Using Any letters mode when the puzzle requires all letters.",
      "Forgetting that duplicate letters must be used in the same counts.",
    ],
    limitations: [
      "No blanks or wildcard characters.",
      "No multi-word phrase anagrams.",
      "No proper nouns, names, brands, or acronyms.",
      "No near-anagram or one-letter-off matching.",
      "Spaces and punctuation are stripped before matching.",
    ],
  },
  "word-finder": {
    description: "Find words by available letters or by a fixed pattern using single-character wildcards and length controls.",
    metaDescription: "Find words from letters or fixed patterns. Use ? blanks in Letters mode and ?, _, or . wildcards in Pattern mode.",
    intro: `Use Word Finder when a plain unscramble is too broad. Letters mode finds words that can be made from your available letters and optional ? blanks, with minimum and maximum length filters. Pattern mode finds exact-length words where known letters stay fixed and ?, _, or . stand for one unknown letter. This is the better tool for crossword-like clues, Wordle-style notes, hangman, and any puzzle where positions matter.`,
    outcomeLine: "Search by rack letters or by a fixed-position pattern with single-letter wildcards.",
    howTo: [
      "Choose Letters mode when you have a rack of letters and optional ? blanks.",
      "Choose Pattern mode when you know positions, such as C?T or ..ING.",
      "Set minimum and maximum length in Letters mode to match your puzzle.",
      "In Pattern mode, make the pattern exactly as long as the word you want.",
      "Turn on scores if you want Scrabble and WWF estimates beside results.",
    ],
    examples: [
      {
        title: "Letters mode: RSTLNE?",
        body: "Finds words that can be built from R, S, T, L, N, E plus one blank tile.",
      },
      {
        title: "Pattern mode: C?T",
        body: "Finds exact three-letter matches such as CAT, COT, and CUT when present in the selected list.",
      },
      {
        title: "Pattern mode: ..ING",
        body: "Finds exact five-letter words ending in ING because each dot is one unknown position.",
      },
    ],
    faq: [
      {
        q: "What is Word Finder by Letters?",
        a: `Word Finder by Letters searches for words from a rack or from a fixed pattern. Kefiw has two modes: Letters mode for available tiles and Pattern mode for exact-position clues using single-character wildcards.`,
        faq_intent: "definition",
      },
      {
        q: "Can I use * in the Word Finder pattern?",
        a: `No, Kefiw’s Pattern mode supports ?, _, and . as one-letter wildcards, not * or regex. A five-character pattern matches five-letter words only, so use one wildcard symbol for each unknown position.`,
        faq_intent: "edge-case",
      },
      {
        q: "When should I use Word Finder instead of Word Unscrambler?",
        a: `Use Word Finder when you know length limits or letter positions, and use Word Unscrambler for broad rack browsing. Pattern clues reduce results dramatically, which makes Word Finder better for crosswords, Wordle-style notes, and hangman.`,
        faq_intent: "comparison",
      },
      {
        q: "Why does Pattern mode ignore my length filter?",
        a: `Pattern mode uses the pattern length itself as the word length. If you type C?T, the tool looks for three-letter words; if you type C??T, it looks for four-letter words.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does Word Finder model a Scrabble board?",
        a: `No, Word Finder does not model premium squares, hooks, or adjacent board words. It can help find candidates from letters or patterns, but final board legality and scoring still depend on the actual game position.`,
        faq_intent: "trust",
      },
    ],
    useCases: [
      "Narrow a crossword or hangman answer from known letters.",
      "Find five-letter candidates for a Wordle-style puzzle note.",
      "Search a rack with length limits without reading every possible word.",
      "Check whether a known pattern has many possible endings.",
    ],
    commonMistakes: [
      "Typing * even though Kefiw does not support it.",
      "Using a pattern with the wrong number of characters.",
      "Expecting prefix, suffix, or substring filters that belong to separate tools.",
      "Expecting board-aware scoring or premium-square modelling.",
    ],
    limitations: [
      "Pattern wildcards are single-character only.",
      "No regex, character classes, or * wildcard.",
      "Pattern mode matches exact length only.",
      "Letters mode does not have must-include or excluded-letter filters.",
      "No proper nouns, acronyms, or board modelling.",
    ],
  },
  "scrabble-helper": {
    description: `Rank playable Scrabble-style words from your rack with standard tile values, optional blanks, and one optional plays-through board letter.`,
    metaDescription: "Find Scrabble-style words from your rack, rank by tile score, add ? blanks, and optionally require one board letter.",
    intro: `Use the Scrabble Word Finder when you want score-ranked candidates from your rack instead of a length-first word list. Enter up to nine letters, use ? for blanks, and optionally add one board letter the play must pass through. Kefiw uses the ENABLE1 list and standard Scrabble tile values, flags seven-tile bingo candidates, and runs in your browser. It does not model a full board, premium squares, hooks, or official tournament dictionaries.`,
    outcomeLine: "Enter a rack and get Scrabble-style word candidates ranked by point value.",
    howTo: [
      "Enter your rack letters, including duplicate tiles and ? blanks.",
      "Add one board letter only if every candidate must play through that letter.",
      "Use Scored mode to keep score-ranked order, or Basic mode for alphabetical browsing.",
      "Check bingo candidates when the result uses exactly seven rack tiles.",
      "Verify final legality and real score on the actual board before playing.",
    ],
    examples: [
      {
        title: "Rack: QUIZZES",
        body: `The helper ranks high-value candidates and flags seven-rack-tile bingo possibilities, but it does not place the word on a board.`,
      },
      {
        title: "Rack: AEINRST",
        body: "Balanced common letters often create many bingo candidates. Compare score, length, and the leave you create.",
      },
      {
        title: "Rack: A?ZONER, board letter: T",
        body: "The tool requires a T somewhere in the word and treats one instance as the board letter for rack-fit checking.",
      },
    ],
    faq: [
      {
        q: "How does the Scrabble Word Finder score words?",
        a: `It sums standard Scrabble tile values and adds a 50-point bonus when exactly seven rack tiles are used. The score is useful for ranking candidates, but it does not include premium board squares or adjacent-word scoring.`,
        faq_intent: "definition",
      },
      {
        q: "Does this Scrabble helper score blank tiles as zero?",
        a: `No, Kefiw’s current Scrabble helper overvalues blanks by scoring their represented letters at full value. Treat blank-involved scores as candidate estimates and manually subtract the substituted letter value for official-style scoring.`,
        faq_intent: "trust",
      },
      {
        q: "Can the Scrabble helper read my full board?",
        a: `No, the current Scrabble helper supports only one optional plays-through board letter. It does not model premium squares, hooks, parallel plays, cross-checks, or full-board legal placement.`,
        faq_intent: "edge-case",
      },
      {
        q: "What dictionary does the Scrabble helper use?",
        a: `The Scrabble helper uses the ENABLE1 word list, not TWL, NWL, SOWPODS, or CSW. It is practical for casual play and practice, but it should not be treated as a tournament word judge.`,
        faq_intent: "trust",
      },
      {
        q: "When should I use Scrabble Helper instead of Word Unscrambler?",
        a: `Use Scrabble Helper when score ranking is the main goal, and Word Unscrambler when you want a broader length-first word list. Scrabble Helper also supports one board letter constraint, which can narrow the rack search.`,
        faq_intent: "comparison",
      },
    ],
    useCases: [
      "Rank rack candidates by raw Scrabble-style tile score.",
      "Find possible seven-tile bingo candidates from a rack.",
      "Practice with one anchor letter from the board.",
      "Compare a high-scoring short play with a longer low-value word.",
    ],
    commonMistakes: [
      "Assuming the score includes double-word, triple-word, or adjacent-word points.",
      "Forgetting that blanks are currently displayed at full tile value.",
      "Using ENABLE1 output as official tournament validation.",
      "Entering a board letter and assuming the tool has checked the placement.",
    ],
    limitations: [
      "No full board model, premium squares, hooks, cross words, or parallel plays.",
      "Uses ENABLE1, not an official tournament dictionary.",
      "Blanks are overvalued in the displayed score.",
      "Results are capped at 300.",
      "Board-letter support handles one letter only.",
    ],
  },
  "words-with-friends-helper": {
    description: `Rank Words With Friends-style word candidates from your rack using WWF tile values, optional blanks, and one optional board letter.`,
    metaDescription: `Find Words With Friends-style plays from your letters, rank by WWF score, use ? blanks, and optionally require one board letter.`,
    intro: `Use the Words With Friends Word Finder when Scrabble scores are the wrong comparison. Enter your rack, add ? for blanks, and optionally require one board letter that the word must pass through. Kefiw ranks candidates with WWF tile values, adds the +35 seven-tile bonus, and uses ENABLE1 as a close casual proxy. It does not use the official Zynga dictionary, model the WWF board, or score blank tiles as zero yet.`,
    outcomeLine: "Enter a rack and get Words With Friends-style candidates ranked by WWF point value.",
    howTo: [
      "Enter your rack letters, keeping duplicates and using ? for blanks.",
      "Add one board letter only when every result must include that anchor.",
      "Use Scored mode to preserve WWF score order.",
      "Look for +35 bonus candidates when seven rack tiles are used.",
      "Check the actual WWF board and dictionary before relying on a final play.",
    ],
    examples: [
      {
        title: "Rack: SQUEEZE",
        body: "The helper ranks candidates using WWF values, where some letters differ from Scrabble values.",
      },
      {
        title: "Rack: AEIRST?",
        body: "A blank can unlock many seven-tile candidates, but the displayed score currently overvalues the blank letter.",
      },
      {
        title: "Rack: JOXENAS, board letter: R",
        body: "The helper requires R somewhere in each candidate and treats one R as the board letter.",
      },
    ],
    faq: [
      {
        q: "How is Words With Friends scoring different from Scrabble scoring?",
        a: `Words With Friends uses a different tile-value map and a 35-point seven-tile bonus. That means the best WWF candidate may differ from the best Scrabble candidate even when the rack letters are identical.`,
        faq_intent: "comparison",
      },
      {
        q: "Does this use the official Words With Friends dictionary?",
        a: `No, Kefiw uses ENABLE1 as a practical proxy for casual WWF-style search. The lists overlap heavily, but the tool should not be treated as official Zynga validation for live competitive play.`,
        faq_intent: "trust",
      },
      {
        q: "Do blank tiles score zero in the WWF helper?",
        a: `No, the current WWF helper scores blank-substituted letters at full tile value. Manually subtract the value of the represented letter when a candidate uses ? and you need a real-game score estimate.`,
        faq_intent: "edge-case",
      },
      {
        q: "Can this Words With Friends helper use the full board?",
        a: `No, the helper supports one optional plays-through board letter, not a full board. It does not model premium squares, parallel words, or the WWF board layout.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "When should I switch from WWF Helper to Scrabble Helper?",
        a: `Switch to Scrabble Helper when you are playing Scrabble or studying Scrabble tile values. The same rack can rank differently because tile values, bingo bonuses, boards, and word-list assumptions are not identical.`,
        faq_intent: "how-to",
      },
    ],
    useCases: [
      "Rank rack candidates using WWF values instead of Scrabble values.",
      "Practice high-value letter use in WWF-style games.",
      "Find candidates that include one board anchor letter.",
      "Compare seven-tile bonus opportunities in casual play.",
    ],
    commonMistakes: [
      "Assuming Scrabble tile values apply to WWF.",
      "Treating ENABLE1 as the official WWF dictionary.",
      "Forgetting blanks should score zero in the actual game.",
      "Expecting full-board premium-square scoring.",
    ],
    limitations: [
      "Uses ENABLE1 as a proxy, not the official Zynga WWF dictionary.",
      "No full WWF board or premium-square model.",
      "Blank-substituted letters are overvalued.",
      "One optional board letter only.",
      "Results are capped at 300.",
    ],
  },
};

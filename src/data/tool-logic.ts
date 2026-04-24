// Per-tool algorithm / data-source / UI ground truth.
// Populated incrementally, keyed by ToolConfig.id.
// Exporter merges this into cluster briefings so writer AIs never fabricate tech specifics.

export interface ToolLogic {
  input_type: string;
  output_type: string;
  processing_steps: string[];
  data_sources: string[];
  fallback_behavior: string;
  known_limitations: string[];
  ui_fields: {
    inputs: string[];
    filters: string[];
    outputs: string[];
  };
  // Optional hints for the writer AI to improve accuracy / disclaimers.
  content_guidance?: {
    claim_allowed: string[]; // things the tool genuinely does — writer may claim these
    claim_forbidden: string[]; // things the tool does NOT do — writer must not claim these
  };
}

export const TOOL_LOGIC: Record<string, ToolLogic> = {
  'rhyme-finder': {
    input_type: 'single English word (letters a-z; normalized to lowercase)',
    output_type: 'two arrays — perfect rhymes and near rhymes — each capped at 200 results, sorted by length then alphabetically',
    processing_steps: [
      'Normalize input: lowercase, strip non-letter characters.',
      'Derive three candidate endings: last 4, last 3, and last 2 letters of the input.',
      'Scan the ENABLE1 word list (~172k words) for every word ending in the last-4 suffix → perfect rhymes.',
      'Scan remaining words for those ending in the last-3 suffix → near rhymes.',
      'Sort each bucket by length ascending, then alphabetically.',
      'Truncate each bucket to 200 entries before returning.',
    ],
    data_sources: [
      'ENABLE1 public-domain English word list (~172,000 entries, `public/data/enable.txt`), loaded on first use via web worker.',
    ],
    fallback_behavior: 'No phonetic fallback. All matching is spelling-based. If the input has no letters, both buckets return empty.',
    known_limitations: [
      'Purely spelling-based — NOT phonetic. Words that look alike but sound different (e.g. "through" / "rough") will be matched as perfect rhymes despite not rhyming.',
      'Words that sound alike but are spelled differently (e.g. "eight" / "late") will not be matched.',
      'ENABLE1 does not include proper nouns, abbreviations, or profanity — so celebrity names, place names, and vulgar rhymes will never appear.',
      'No multi-word rhymes (e.g. "carry on" / "marathon").',
      'No dialect/accent handling. American-English spelling bias.',
      'Each bucket capped at 200 results; longer words with common endings may hit the cap.',
      'Stress patterns are ignored — "happy" (trochee) and "reply" (iamb) can both match "-y" endings regardless of where the stressed syllable falls.',
    ],
    ui_fields: {
      inputs: ['word (single-line text input, autofocused)'],
      filters: ['mode: Quick | Extended — Quick shows perfect only; Extended shows perfect + near'],
      outputs: [
        'Perfect rhymes chip list with count',
        'Near rhymes chip list with count (Extended only)',
        'Summary card: total rhyme count for the input',
        'Stats card: mode, perfect count, near count (Extended), shortest and longest rhyme',
        'Takeaway card: which bucket is strongest',
        'Next-step card with links to Syllable Counter and Haiku Checker',
        'Copy button per bucket (newline-joined list)',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Uses a large English word list',
        'Separates results into perfect and near rhymes',
        'Runs entirely in the browser (no server round-trip)',
        'Spelling-based matching using trailing letters',
      ],
      claim_forbidden: [
        'Phonetic / pronunciation-aware rhyme matching',
        'Includes celebrity or place names',
        'Handles multi-word rhyming phrases',
        'Respects stress patterns or meter',
        'Dialect-specific rhymes (e.g. British vs American)',
      ],
    },
  },

  'syllable-counter': {
    input_type: 'free text — single word, sentence, or paragraph',
    output_type: 'total syllable count across all words, plus per-word counts and per-line summary when multi-line',
    processing_steps: [
      'Split input on whitespace to get a word list.',
      'For each word: lowercase, strip non-letter characters.',
      'If the cleaned word is 3 letters or fewer, count = 1.',
      'Otherwise: strip trailing silent-e patterns and simple suffix endings.',
      'Strip a leading "y" if present.',
      'Count matches of the regex /[aeiouy]{1,2}/g — each vowel group = 1 syllable.',
      'If no vowel groups found, default to 1.',
      'Sum per-word counts for the total.',
      'Detect haiku shape automatically: total === 17 and exactly 3 non-empty lines.',
    ],
    data_sources: [
      'No dictionary. Pure regex / heuristic algorithm — `countSyllables()` in `src/lib/text.ts`.',
    ],
    fallback_behavior: 'Returns at least 1 syllable for any non-empty word, even when no vowel pattern is detected.',
    known_limitations: [
      'Approximately 95% accurate on common English words. Edge cases may disagree.',
      'No dictionary lookup — exceptions like "every" (EV-RY vs EV-ER-Y), "fire" (1 or 2), or "poem" (POHM vs PO-EM) are resolved by the regex, not pronunciation.',
      'Loanwords and proper nouns often miscount.',
      'Compound words may be under-counted if the heuristic collapses vowel groups across the seam.',
      'No dialect / stress awareness — British and American pronunciations treated identically.',
      'Non-letter characters (digits, symbols) are stripped, so "3D" becomes "d" → 1 syllable.',
    ],
    ui_fields: {
      inputs: ['text (multi-line textarea)'],
      filters: ['mode: Quick | Extended — Extended shows per-word chips in addition to the total'],
      outputs: [
        'Total syllable count (large numeric display in a card)',
        'Summary card: total + word count',
        'Stats card: words, syllables, avg syllables/word, longest word with count, shortest word with count',
        'Per-line comparison card (only shown when input has 2+ non-empty lines)',
        'Haiku-detection takeaway (when total === 17 and 3 non-empty lines)',
        'Per-word chips showing word + syllable count (Extended mode only)',
        'Next-step card with links to Rhyme Finder and Haiku Checker',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Counts syllables using a vowel-group heuristic',
        'Provides per-word and total counts',
        'Detects haiku-shaped input automatically',
        'Runs in the browser, no server call',
        'Accurate enough for songwriting and poetry on common English words',
      ],
      claim_forbidden: [
        'Uses a pronunciation or phonetic dictionary',
        'Guaranteed accuracy on names or loanwords',
        'Handles dialect / regional pronunciation',
        'Respects IPA stress marks',
      ],
    },
  },

  'haiku-checker': {
    input_type: '3 lines of text separated by newlines (pre-filled with an example haiku)',
    output_type: 'per-line syllable counts with pass/fail against the 5-7-5 target, plus overall pass/fail boolean',
    processing_steps: [
      'Split input by newline into raw lines.',
      'For each line: split on whitespace, sum `countSyllables()` across all words.',
      'Filter to non-empty lines (lines with at least one word).',
      'Check: non-empty lines count === 3 AND line 1 count === 5 AND line 2 count === 7 AND line 3 count === 5.',
      'Render each line with its count, its target, and a ✓ / over / under badge.',
    ],
    data_sources: [
      'Same heuristic `countSyllables()` from `src/lib/text.ts`. No dictionary.',
    ],
    fallback_behavior: 'Accepts fewer than 3 non-empty lines (shows partial validation). Extra lines beyond 3 are listed but have no target.',
    known_limitations: [
      'Inherits all limitations of the syllable counter (heuristic ~95% accurate).',
      'Only validates 5-7-5 shape. Does not detect kigo (seasonal word) or kireji (cutting word).',
      'Only supports English haiku. Does not support Japanese kana counting (onji vs syllables).',
      'Does not detect or suggest alternative forms (tanka 5-7-5-7-7, renga, senryu).',
      'Accepts any text on each line — no quality/meaning check.',
    ],
    ui_fields: {
      inputs: ['haiku text (3-line textarea, font-serif, pre-filled with example)'],
      filters: [],
      outputs: [
        'Per-line card with colored border (green = target met, red = off by any amount, amber = extra line beyond line 3)',
        'Per-line count vs target with ✓ / (over) / (under) annotation',
        'Summary card with "Valid haiku" or a diagnostic message',
        'Stats card: lines count, total syllables, current pattern (e.g. 5-7-5), target pattern',
        'Per-line comparison card with deltas',
        'Takeaway card: congrats + kigo/kireji note when valid, or corrective hint when not',
        'Next-step card with links to Syllable Counter and Rhyme Finder',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Validates the 5-7-5 syllable structure of English haiku',
        'Shows per-line counts with pass/fail indicators',
        'Works with any 3-line input (pre-filled with example)',
      ],
      claim_forbidden: [
        'Detects seasonal words (kigo) or cutting words (kireji)',
        'Supports Japanese kana / onji counting',
        'Validates tanka, renga, senryu, or other Japanese forms',
        'Evaluates poetic quality, imagery, or juxtaposition',
      ],
    },
  },

  'word-counter': {
    input_type: 'free text — any length, single or multi-line',
    output_type: 'multi-metric text statistics including word / character / sentence / paragraph counts and reading/speaking time estimates',
    processing_steps: [
      'Split input on whitespace for word count.',
      'Count characters including spaces, and again excluding spaces.',
      'Split on sentence-ending punctuation (. ! ?) to approximate sentence count.',
      'Split on blank-line gaps for paragraph count.',
      'Derive longest word by character length.',
      'Derive average word length (chars / words) and average words per sentence.',
      'Estimate reading time based on standard words-per-minute (WPM) reading speed.',
      'Estimate speaking time based on a slower WPM speaking-aloud rate.',
    ],
    data_sources: [
      'No dictionary. Pure string analysis — `textStats()` in `src/lib/outcomes.ts`.',
    ],
    fallback_behavior: 'Empty input returns zeros. Any non-space content yields at least 1 word.',
    known_limitations: [
      'Sentence detection is punctuation-based — abbreviations ("Dr.", "e.g.") and ellipses may inflate the count.',
      'Paragraph detection requires blank-line separators — single-line-break text counts as one paragraph.',
      'Reading / speaking times are estimates based on average-reader WPM, not personalized.',
      'No language detection — all text treated as English-ish for WPM.',
      'Non-Latin scripts (Chinese, Japanese, Thai) without explicit whitespace may undercount words.',
      'Longest word may include attached punctuation if not surrounded by whitespace.',
    ],
    ui_fields: {
      inputs: ['text (multi-line textarea, h-48 — tall by default)'],
      filters: [],
      outputs: [
        'Stat grid: Words, Characters, No spaces, Sentences, Paragraphs, Reading time (6-column responsive grid)',
        'Summary card: word count + reading time label',
        'Stats card: characters, characters-no-spaces, sentences, paragraphs, avg word length, avg words per sentence, longest word with length',
        'Takeaway: reading vs speaking-aloud time comparison',
        'Takeaway (conditional): readability hint when avg sentence > 20 words',
        'Next-step card with links to Syllable Counter and Reading Time Calculator',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Counts words, characters, sentences, paragraphs in any English text',
        'Estimates reading and speaking-aloud time',
        'Runs in the browser; text never leaves the device',
        'Flags long-sentence readability issues',
      ],
      claim_forbidden: [
        'Detects grammar, spelling, or style issues',
        'Works on non-whitespace-delimited languages (Chinese, Japanese)',
        'Provides per-reader personalized reading speed',
      ],
    },
  },

  'scrabble-helper': {
    input_type: 'rack of up to 9 letters (a-z plus `?` for blank tiles); optional single board letter the word must play through',
    output_type: 'ranked array of playable words with Scrabble scores, capped at 300 results, sorted by score descending then length descending then alphabetical',
    processing_steps: [
      'Normalize rack: lowercase, strip non-letter/non-`?` characters, truncate to 9 characters.',
      'Normalize board letter (if provided): lowercase, first letter only.',
      'Load the ENABLE1 word list (~172,823 words) on first use via web worker.',
      'Filter dictionary to words between 2 and 15 letters.',
      'For each candidate word: if a board letter is specified, require the word to contain it; remove one instance before rack-fit check.',
      'Check rack fit with `canMakeFromRack` — blanks (`?`) satisfy any missing letter.',
      'Score each playable word with `wordScore` using SCRABBLE_VALUES (standard tournament tile values).',
      'Add a +50 bingo bonus when the word uses exactly 7 tiles from the rack (i.e. `remainder.length === 7` after optional board-letter removal).',
      'Sort by score descending, then length descending, then alphabetically.',
      'Truncate to 300 results before returning.',
      'Client re-sorts to alphabetical in Basic mode; keeps score order in Scored mode.',
    ],
    data_sources: [
      'ENABLE1 public-domain English word list (~172,823 entries, `public/data/enable.txt`), loaded on first use via web worker.',
      'SCRABBLE_VALUES tile map in `src/lib/dict.ts` (Q/Z=10, J/X=8, K=5, F/H/V/W/Y=4, B/C/M/P=3, D/G=2, A/E/I/L/N/O/R/S/T/U=1).',
    ],
    fallback_behavior: 'Empty rack returns no results. No phonetic, morphological, or proper-noun fallback. Reset button clears rack and board letter together.',
    known_limitations: [
      'Blank tiles score 0 (standard Scrabble rules). Blank-covered letters are lowercased with a dotted underline in the results table so users can see which letter was produced by a `?`.',
      'Bingo bonus is awarded only when the word consumes 7 rack tiles. A 7-letter word that uses a board letter plus 6 rack tiles is not treated as a bingo, matching real play.',
      'Dictionary is ENABLE1, not TWL or SOWPODS. A handful of tournament-valid words (e.g. recent additions, SOWPODS-only entries) may not appear; a few ENABLE1 words are not TWL-legal.',
      'No board context beyond a single "plays through" letter. Does not model double-letter, triple-letter, double-word, triple-word premium squares, adjacent letters, hooks, or open-parallel plays.',
      'No proper nouns, abbreviations, or acronyms — ENABLE1 excludes them.',
      'Board-letter check accepts the first occurrence only; when the same letter repeats in the word, only one instance is treated as the board tile.',
      'Results capped at 300. Very open racks (e.g. lots of common letters) may hit the cap.',
    ],
    ui_fields: {
      inputs: [
        'rack (single-line text input, uppercase display, font-mono, maxLength 9, autofocused)',
        'board letter (single-character optional input, uppercase display, maxLength 1)',
      ],
      filters: [
        'mode: Basic | Scored — Basic sorts results alphabetically; Scored keeps the score-ranked order',
      ],
      outputs: [
        'Summary card: best play and its score',
        'Stats card: total plays, second-best play, score gap, bingo candidate count, best short play (≤4 letters), best long play (≥5)',
        'Takeaway card (conditional): bingo candidate count and +50 bonus reminder',
        'Takeaway card (conditional): board-letter constraint notice when set',
        'Results table: Word | Length | Score (Score column hidden in Basic mode)',
        'Copy-all button that dumps the result list (with or without scores depending on mode)',
        'Next-step card linking to WWF Helper and Word Unscrambler',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Ranks playable Scrabble words by point value using standard tournament tile values',
        'Supports blanks (`?`) in the rack',
        'Supports a single optional "plays through" board letter',
        'Flags 7-letter bingo candidates and adds the +50 bonus',
        'Runs entirely in the browser (no server round-trip)',
      ],
      claim_forbidden: [
        'Models the full board, premium squares, adjacent words, hooks, or parallel plays',
        'Scores blanks as 0 (as tournament rules require)',
        'Uses the TWL or SOWPODS tournament word list — it uses ENABLE1',
        'Includes proper nouns, abbreviations, or acronyms',
        'Respects recent dictionary updates beyond ENABLE1',
      ],
    },
  },

  'words-with-friends-helper': {
    input_type: 'rack of up to 9 letters (a-z plus `?` for blank tiles); optional single board letter the word must play through',
    output_type: 'ranked array of playable words with WWF scores, capped at 300 results, sorted by score descending then length descending then alphabetical',
    processing_steps: [
      'Normalize rack: lowercase, strip non-letter/non-`?` characters, truncate to 9 characters.',
      'Normalize board letter (if provided): lowercase, first letter only.',
      'Load the ENABLE1 word list (~172,823 words) on first use via web worker.',
      'Filter dictionary to words between 2 and 15 letters.',
      'For each candidate word: if a board letter is specified, require it in the word; remove one instance before rack-fit check.',
      'Check rack fit with `canMakeFromRack` — blanks (`?`) satisfy any missing letter.',
      'Score each playable word with `wordScore` using WWF_VALUES (Words With Friends tile distribution).',
      'Add a +35 bingo bonus (WWF standard) when the word uses exactly 7 tiles from the rack.',
      'Sort by score descending, then length descending, then alphabetically.',
      'Truncate to 300 results before returning.',
    ],
    data_sources: [
      'ENABLE1 public-domain English word list (~172,823 entries, `public/data/enable.txt`), shared with Scrabble Helper.',
      'WWF_VALUES tile map in `src/lib/dict.ts`. Differs from Scrabble: J=10 (vs 8), B/F/H/M/P=4 (vs 3/4/4/3/3), L=2 (vs 1), N=2 (vs 1), U=2 (vs 1), Y=3 (vs 4), C=4 (vs 3), G=3 (vs 2).',
    ],
    fallback_behavior: 'Empty rack returns no results. No phonetic, morphological, or proper-noun fallback. Reset clears rack and board letter together.',
    known_limitations: [
      'Blank tiles score 0 (standard WWF rules). Blank-covered letters are lowercased with a dotted underline in the results table so users can see which letter was produced by a `?`.',
      'Bingo bonus fires only when 7 rack tiles are consumed — a 7-letter word that uses a board letter plus 6 rack tiles is not flagged as bingo.',
      'No board context beyond a single "plays through" letter. Does not model WWF premium squares (triple-letter, triple-word, or the different square layout), hooks, or parallel plays.',
      'Uses the ENABLE1 dictionary as a reasonable proxy for the WWF dictionary — the two overlap heavily but are not identical. A handful of WWF-legal slang and informal words may be missing; a few ENABLE1 words may not be WWF-legal.',
      'No proper nouns, abbreviations, or acronyms.',
      'Board-letter check accepts the first occurrence only.',
      'Results capped at 300.',
    ],
    ui_fields: {
      inputs: [
        'rack (single-line text input, uppercase display, font-mono, maxLength 9, autofocused)',
        'board letter (single-character optional input, maxLength 1)',
      ],
      filters: [
        'mode: Basic | Scored — Basic sorts results alphabetically; Scored keeps the score-ranked order',
      ],
      outputs: [
        'Summary card: best play and its WWF score',
        'Stats card: total plays, second-best, score gap, bingo count, best short play (≤4), best long play (≥5)',
        'Takeaway card (conditional): bingo candidate count with +35 WWF bonus reminder',
        'Takeaway card (conditional): board-letter constraint notice when set',
        'Results table: Word | Length | Score (Score column hidden in Basic mode)',
        'Copy-all button',
        'Next-step card linking to Scrabble Helper and Word Unscrambler',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Ranks playable Words With Friends plays by point value using WWF tile values',
        'Supports blanks (`?`) in the rack',
        'Supports a single optional "plays through" board letter',
        'Flags 7-letter bingo candidates and adds the +35 WWF bonus',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Uses the official Zynga Words With Friends dictionary — it uses ENABLE1 as a close proxy',
        'Models the WWF board, premium squares, or parallel plays',
        'Scores blanks as 0 (as real WWF scoring does)',
        'Handles the WWF2 ruleset variants (Solo Challenge, Lightning Round) specifically',
        'Includes proper nouns, player names, or brand names',
      ],
    },
  },

  'word-unscrambler': {
    input_type: 'string of letters (a-z, plus `?` for blank/wildcard tiles)',
    output_type: 'array of every dictionary word that can be spelled from the input letters, sorted by length descending then alphabetical',
    processing_steps: [
      'Load the chosen word list on first use via web worker: Game list = ENABLE1 (~172,823 words) or Full list = dict.txt (~370,105 words).',
      'Normalize input: lowercase, strip non-letter/non-`?` characters.',
      'For each dictionary word within the min/max length range: use `canMakeFromRack` to check whether it can be built from the input letters (blanks satisfy any missing letter).',
      'Sort matches by length descending, then alphabetically.',
      'Fallback: if minLen > 2 produces zero matches, re-run with minLen = 2 and surface an amber "No words found at N+ letters" notice.',
      'Client optionally computes per-word Scrabble and WWF scores when the "Show scores" checkbox is enabled.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`, ~172,823 entries) — the "Game list" mode used for casual Scrabble/WWF play.',
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries) — the "Full list" mode that includes archaic, technical, and inflected forms.',
      'SCRABBLE_VALUES and WWF_VALUES for optional score display.',
    ],
    fallback_behavior: 'Empty input returns no results. If minLen > 2 yields nothing, automatically retries at minLen = 2 and displays a fallback banner. No phonetic or transliteration fallback.',
    known_limitations: [
      'Requires every letter of the candidate word to be spellable from the input (blanks cover gaps). Does not return anagrams that need extra letters.',
      'No result cap — very open letter sets ("aeinorst") can produce thousands of matches and slow the render.',
      'Full list includes archaic, technical, and inflected forms; some are not valid Scrabble/WWF plays.',
      'Neither list includes proper nouns, abbreviations, or acronyms.',
      'Wildcard handling is length-only — `?` represents one blank tile, not a multi-character wildcard.',
      'No pattern or positional matching — use Word Finder or Pattern Solver for those.',
      'When a blank (`?`) is in the rack, inline Scrabble / WWF scores subtract the value of the letter the blank represents (real-game zero-value blank scoring). Blank-covered letters are lowercased with a dotted underline in the result table.',
    ],
    ui_fields: {
      inputs: ['letters (single-line text input, font-mono, autofocused)'],
      filters: [
        'mode: Game list (ENABLE1) | Full list (dict.txt)',
        'min length: dropdown 2–7',
        'show scores: toggle for inline Scrabble + WWF scores',
      ],
      outputs: [
        'Amber fallback banner when min-length fallback fires',
        'Summary card: total word count',
        'Stats card: longest word, shortest word, best Scrabble play with score, best WWF play with score',
        'Comparison card: count by word length (top 4 lengths)',
        'Takeaway: best short play (≤4 letters) with Scrabble score',
        'Result list grouped by length (or flat when scores are shown)',
        'Copy button per result group',
        'Next-step card linking to Scrabble Helper and WWF Helper',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Finds every valid English word that can be spelled from the input letters',
        'Supports blank tiles (`?`)',
        'Offers a compact game list (ENABLE1) and a broader dictionary (dict.txt)',
        'Optionally shows Scrabble and WWF scores inline',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Finds only full-letter anagrams (use Anagram Solver for that)',
        'Supports multi-letter wildcards or positional patterns (use Word Finder / Pattern Solver)',
        'Includes proper nouns, slang, or acronyms',
        'Returns tournament-certified TWL/SOWPODS validity',
      ],
    },
  },

  'words-starting-with': {
    input_type: 'prefix string (a-z; non-letters and whitespace stripped, lowercased)',
    output_type: 'alphabetically-sorted array of every dictionary word whose initial characters match the prefix, filtered to min/max length bounds',
    processing_steps: [
      'Load the full English dictionary on first use via web worker — `dict.txt` (~370,105 words). (This tool does not expose the ENABLE1/full toggle; it always uses the full dictionary.)',
      'Normalize query: trim, lowercase, strip non-letter characters.',
      'Filter dictionary to the min/max length range.',
      'Keep only words where `w.startsWith(prefix)`.',
      'Sort by length ascending, then alphabetically.',
      'Client truncates the rendered list to the first 500 and shows a "Showing first 500 of N" notice when more exist.',
      'Debounce input by 130 ms before re-querying the worker.',
    ],
    data_sources: [
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries). No ENABLE1 fallback.',
    ],
    fallback_behavior: 'Empty prefix returns no results. No phonetic or fuzzy-match fallback. Whitespace and punctuation in the input are silently stripped.',
    known_limitations: [
      'Always uses the full dictionary (dict.txt), which includes archaic, technical, and inflected forms that may not be valid Scrabble/WWF plays.',
      'No game-list toggle — use Word Unscrambler if you need ENABLE1 output.',
      'No proper nouns, abbreviations, or acronyms.',
      'No pattern wildcards — prefix must be a literal string.',
      'Rendered list is capped at 500 even when more matches exist (the full count is shown, but only 500 are displayed).',
      'No diacritic or non-Latin-script support; non-letter characters are stripped without warning.',
      'Default min length is 3, so 2-letter matches are hidden unless the user lowers the Min filter.',
    ],
    ui_fields: {
      inputs: ['prefix (single-line text input, font-mono, autofocused, placeholder "e.g. ZY")'],
      filters: [
        'min length: dropdown 2–8 (default 3)',
        'max length: dropdown 5–15 (default 15)',
      ],
      outputs: [
        'Result list (length-grouped, first 500 displayed)',
        '"Showing first 500 of N" notice when results exceed 500',
        'Summary card: total count + echoed query',
        'Stats card: results count, shortest with length, longest with length, top length',
        'Alphabetical-range comparison: first 5 and last 5 alphabetically (when >5 results)',
        'Length-distribution comparison: count by length (top 4 lengths)',
        'Takeaway: most common length and longest word',
        'Next-step card linking to Words Ending With, Words Containing, and Word Unscrambler',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Finds every English word starting with the given prefix',
        'Supports min and max length filters',
        'Uses a broad English dictionary (370k+ entries)',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Uses the ENABLE1 game list',
        'Supports pattern wildcards or regex',
        'Includes proper nouns, abbreviations, or acronyms',
        'Guarantees Scrabble/WWF tournament validity',
        'Finds words that contain the prefix anywhere (that is Words Containing)',
      ],
    },
  },

  'words-ending-with': {
    input_type: 'suffix string (a-z; non-letters and whitespace stripped, lowercased)',
    output_type: 'alphabetically-sorted array of every dictionary word whose ending characters match the suffix, filtered to min/max length bounds',
    processing_steps: [
      'Load the full English dictionary on first use via web worker — `dict.txt` (~370,105 words). No ENABLE1/full toggle exposed.',
      'Normalize query: trim, lowercase, strip non-letter characters.',
      'Filter dictionary to the min/max length range.',
      'Keep only words where `w.endsWith(suffix)`.',
      'Sort by length ascending, then alphabetically.',
      'Client truncates the rendered list to the first 500 and shows a "Showing first 500 of N" notice when more exist.',
      'Debounce input by 130 ms.',
    ],
    data_sources: [
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries).',
    ],
    fallback_behavior: 'Empty suffix returns no results. Whitespace and punctuation silently stripped. No phonetic fallback (see Rhyme Finder for ending-based rhyme suggestions).',
    known_limitations: [
      'Always uses the full dictionary — includes archaic, technical, and inflected forms.',
      'No game-list (ENABLE1) toggle on this tool.',
      'No proper nouns, abbreviations, or acronyms.',
      'No wildcards — suffix is a literal string.',
      'Default min length is 3, so 2-letter matches are hidden unless the user lowers Min.',
      'Rendered list capped at 500.',
      'Spelling-based only — "through" and "rough" both end in -ough but sound different. Use Rhyme Finder if sound matters.',
    ],
    ui_fields: {
      inputs: ['suffix (single-line text input, font-mono, autofocused, placeholder "e.g. TION")'],
      filters: [
        'min length: dropdown 2–8 (default 3)',
        'max length: dropdown 5–15 (default 15)',
      ],
      outputs: [
        'Result list (length-grouped, first 500 displayed)',
        '"Showing first 500 of N" notice when results exceed 500',
        'Summary card: total count + echoed query',
        'Stats card: results count, shortest, longest, top length',
        'Alphabetical-range comparison: first 5 and last 5 (when >5 results)',
        'Length-distribution comparison',
        'Takeaway: most common length + longest',
        'Next-step card linking to Words Starting With, Words Containing, and Word Unscrambler',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Finds every English word ending with the given suffix',
        'Supports min and max length filters',
        'Useful for rhyme brainstorming alongside Rhyme Finder',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Finds phonetic rhymes (use Rhyme Finder)',
        'Supports wildcards or regex',
        'Includes proper nouns or acronyms',
        'Uses the ENABLE1 game list',
      ],
    },
  },

  'words-containing': {
    input_type: 'substring (a-z; non-letters and whitespace stripped, lowercased)',
    output_type: 'alphabetically-sorted array of every dictionary word that contains the substring anywhere, filtered to min/max length bounds',
    processing_steps: [
      'Load the full English dictionary on first use via web worker — `dict.txt` (~370,105 words). No ENABLE1/full toggle exposed.',
      'Normalize query: trim, lowercase, strip non-letter characters.',
      'Filter dictionary to the min/max length range.',
      'Keep only words where `w.includes(substring)`.',
      'Sort by length ascending, then alphabetically.',
      'Client truncates the rendered list to the first 500 with a "Showing first 500 of N" notice.',
      'Debounce input by 130 ms.',
    ],
    data_sources: [
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries).',
    ],
    fallback_behavior: 'Empty substring returns no results. Whitespace and punctuation silently stripped.',
    known_limitations: [
      'Substring must be contiguous — "QUA" matches words containing Q-U-A adjacent in that order, not Q and U and A anywhere.',
      'No wildcards, no regex, no letter-set matching (use Word Finder or Word Unscrambler for those).',
      'No position constraint — matches can appear at the start, middle, or end. Use Words Starting With or Words Ending With for positional matching.',
      'Always uses the full dictionary — archaic/technical/inflected words may appear.',
      'No proper nouns, abbreviations, or acronyms.',
      'Default min length is 3.',
      'Rendered list capped at 500 even when the total is much larger.',
    ],
    ui_fields: {
      inputs: ['substring (single-line text input, font-mono, autofocused, placeholder "e.g. QUA")'],
      filters: [
        'min length: dropdown 2–8 (default 3)',
        'max length: dropdown 5–15 (default 15)',
      ],
      outputs: [
        'Result list (length-grouped, first 500 displayed)',
        '"Showing first 500 of N" notice when results exceed 500',
        'Summary card: total count + echoed query',
        'Stats card: results, shortest, longest, top length',
        'Alphabetical-range comparison: first 5 / last 5 (when >5 results)',
        'Length-distribution comparison',
        'Takeaway: most common length + longest',
        'Next-step card linking to Words Starting With, Words Ending With, and Word Unscrambler',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Finds every English word containing the substring in any position',
        'Supports min and max length filters',
        'Good for crosswords, Scrabble bingo brainstorming, and letter-cluster research',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Finds words with letters anywhere (non-adjacent) — use Word Unscrambler',
        'Finds pattern or positional matches — use Word Finder',
        'Supports wildcards, regex, or character classes',
        'Includes proper nouns or acronyms',
        'Uses the ENABLE1 game list',
      ],
    },
  },

  'anagram-solver': {
    input_type: 'word or letter string (a-z; whitespace is stripped, non-letter characters ignored)',
    output_type: 'array of every valid English anagram of the input — either using ALL letters (exact mode) or ANY subset of the letters (partial mode); filtered to 3+ letters when possible, else 2-letter fallback',
    processing_steps: [
      'Load the chosen word list on first use: Game list = ENABLE1 (~172,823 words) or Full list = dict.txt (~370,105 words).',
      'Normalize input: strip whitespace; the worker also lowercases and strips non-letters via `sortedLetters`.',
      'Exact (All letters) mode: compute a sorted-letter key (e.g. "listen" → "eilnst"), look it up in the pre-built `bySorted` index, and return every word sharing that key — excluding the input itself (case-insensitive).',
      'Partial (Any letters) mode: run `unscrambleLetters` with minLen=2 and maxLen=input length — returns every dictionary word whose letters can all be covered by the input (rack-fit).',
      'Client filters results to length ≥ 3. If the filtered list is empty, fall back to the unfiltered (2+) results and display a "No 3+ letter matches" banner.',
      'Optional inline Scrabble + WWF scoring when toggled.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`, ~172,823 entries) — "Game list" mode.',
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries) — "Full list" mode.',
      'Pre-built `bySorted` index: Map<sortedLetterKey, string[]> built once per dictionary at first use.',
      'SCRABBLE_VALUES and WWF_VALUES for optional score display.',
    ],
    fallback_behavior: 'Empty input returns no results. If no 3+ letter matches exist, shows 2-letter results with an amber banner. No phonetic or fuzzy-match fallback.',
    known_limitations: [
      'Exact mode requires a same-length rearrangement only. "LISTEN → SILENT" works; "LISTEN → LINE" does not.',
      'Partial mode excludes the input word itself only in Exact mode — Partial may include the input if it is in the dictionary.',
      'Exact mode uses sorted-letter hashing, so it treats input as a multiset. Duplicates are preserved ("LLAMA" anagrams must also use two Ls).',
      'Blanks / wildcards (`?`) are NOT supported in this tool. Use Word Unscrambler or Word Finder for blank handling.',
      'Spaces are stripped before matching — "SILENT LISTEN" is treated as one 12-letter string, not two separate inputs.',
      'Punctuation and digits are silently dropped.',
      'No multi-word anagrams — the tool only finds single-word anagrams, never phrases like "ASTRONOMER → MOON STARER".',
      'Neither dictionary includes proper nouns, abbreviations, or acronyms.',
      'Score display overcounts when non-letter characters are in the input (they are dropped silently, not flagged).',
    ],
    ui_fields: {
      inputs: ['letters (single-line text input, font-mono, autofocused)'],
      filters: [
        'word list: Game list (ENABLE1) | Full list (dict.txt)',
        'mode toggle: All letters (exact anagram) | Any letters (partial anagram)',
        'show scores: toggle for inline Scrabble + WWF scores',
      ],
      outputs: [
        'Amber fallback banner when no 3+ letter matches',
        'Summary card: total anagram count with "anagram" (exact) or "match" (partial) wording',
        'Stats card: longest, shortest, best Scrabble play with score, best WWF play with score',
        'Comparison card: count by word length (top 4 lengths)',
        'Takeaway: best scoring anagram',
        'Result list grouped by length (or flat when scores are shown)',
        'Next-step card linking to Word Unscrambler and Scrabble Helper',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Finds exact (all-letter) anagrams of an English word',
        'Finds partial anagrams (sub-letter rearrangements) in Any-letters mode',
        'Offers a compact game list (ENABLE1) and a broader dictionary (dict.txt)',
        'Optionally displays Scrabble and WWF scores',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Finds multi-word anagrams or phrase anagrams',
        'Supports blanks or wildcards',
        'Handles proper nouns, names, or brand names',
        'Returns near-anagrams (off by one letter)',
        'Handles diacritics or non-Latin scripts',
      ],
    },
  },

  'letter-counter': {
    input_type: 'free text — any characters, any length',
    output_type: 'total character counts (with/without spaces), letter/digit/vowel/consonant/punctuation breakdown, and a per-key frequency list sorted by count descending',
    processing_steps: [
      'Compute raw characters: `text.length`.',
      'Compute characters-without-spaces: `text.replace(/\\s/g, "").length`.',
      'Build frequency via `letterFrequency(text)`: iterate each character, lowercase it, and increment the bucket only when the key matches `/[a-z0-9]/`. Non-ASCII characters (accented letters, emoji, ideographs) are silently excluded from the frequency map.',
      'Split frequency entries into letters (`/[a-z]/`) and digits (`/[0-9]/`), sort by count descending.',
      'Sum vowels across `a/e/i/o/u` keys; consonants = letter total − vowels.',
      'Punctuation count = `text.replace(/[a-zA-Z0-9\\s]/g, "").length` — this bucket therefore catches not just ASCII punctuation but also any non-ASCII character (emoji, em-dash, typographic quotes, accented letters).',
    ],
    data_sources: [
      'No dictionary. Pure string analysis — `letterFrequency()` in `src/lib/text.ts` plus inline arithmetic.',
    ],
    fallback_behavior: 'Empty input returns all zeros. No language detection.',
    known_limitations: [
      'Letter frequency is case-insensitive: "A" and "a" share one bucket.',
      'Only ASCII letters and digits populate the frequency chip list. Accented letters ("é", "ñ"), non-Latin scripts, and emoji are excluded from the Letters / Vowels / Consonants counts and fall into the Punct. bucket instead.',
      'The tool page\'s FAQ claim that "each emoji counts as one character" is true only for the Characters total. In the Letters/Digits/Vowels/Consonants breakdown emoji contributes zero; in the Punct. bucket it contributes one per code point (so a ZWJ family emoji 👨‍👩‍👧‍👦 adds 7 to Punct., not 1).',
      'Digits 0–9 are counted in Characters and in the digits bucket, but never in Letters/Vowels/Consonants.',
      'No bigram, trigram, or word-frequency analysis.',
      'No cryptogram-specific helpers (IoC, Kasiski, substitution mapping).',
    ],
    ui_fields: {
      inputs: ['text (multi-line textarea, h-36)'],
      filters: [],
      outputs: [
        'Stat grid: Characters, No spaces, Letters, Digits (4-column responsive)',
        'Frequency chip row: every letter/digit seen, shown as `x × N` sorted by count desc',
        'Summary card: letter count (plus digit and punctuation counts when nonzero)',
        'Stats card: Vowels, Consonants, Digits, Punct.',
        'Comparison card: top 3 letters (when >1 letter)',
        'Takeaway: vowel percentage + most common letter',
        'Next-step card linking to Word Counter and Case Converter',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Counts characters with and without spaces',
        'Breaks letters into vowels and consonants (a/e/i/o/u as vowels)',
        'Shows per-letter and per-digit frequency sorted by count',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Counts accented letters or emoji as letters — those end up in the Punct. bucket',
        'Performs cryptogram analysis (IoC, Kasiski, substitution solving)',
        'Distinguishes uppercase from lowercase in the frequency list',
        'Supports non-Latin scripts (Cyrillic, Greek, Arabic, CJK) in the letter breakdown',
        'Counts per-word or per-bigram frequency',
      ],
    },
  },

  'case-converter': {
    input_type: 'free text — any characters, any length',
    output_type: 'text converted to one of eight case styles (UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, CONSTANT_CASE), plus before/after character-length delta',
    processing_steps: [
      'upper / lower: native `toUpperCase()` / `toLowerCase()` — Unicode-aware via the JS engine.',
      'Title Case: lowercase the whole string, then uppercase any ASCII letter at a word boundary (`/\\b([a-z])/g`). Does not apply AP / Chicago small-word rules.',
      'Sentence case: lowercase the whole string, then uppercase the first letter at the start of the string or immediately after `.`, `!`, `?` + whitespace. Only matches ASCII letters.',
      'camel / snake / kebab / constant: `trim()`, split on any run of non-alphanumeric characters (`/[^a-zA-Z0-9]+/`), drop empty parts, lowercase each token (except camel\'s leading token), then join with empty string (camel) / `_` (snake) / `-` (kebab) / uppercased `_` join (constant).',
      'Computes `delta` = output length − input length for the summary.',
    ],
    data_sources: [
      'No dictionary. String transforms in `src/lib/text.ts`.',
    ],
    fallback_behavior: 'Empty input returns empty output. No error state.',
    known_limitations: [
      'Title Case uppercases every word — no style-guide small-word exceptions (a, an, the, of, in, on, etc.). An editorial Title Case that follows AP or Chicago rules requires a different tool.',
      'Title and Sentence case match ASCII letters only (`[a-z]`). Accented first letters ("über", "état") will not be capitalised.',
      'Sentence case resets only after `.`, `!`, `?` — not after `:` or forced line breaks, so lines after a newline stay lowercase unless the previous line ended with terminal punctuation.',
      'camel / snake / kebab / constant all split on non-alphanumeric runs. That means apostrophes, hyphens, and diacritic sequences are destroyed: "don\'t worry" → camel `dontWorry`; "co-op" → `coOp`; "café" → `cafe` only if your input was already ASCII — the accented letter is treated as non-alphanumeric and dropped.',
      'camelCase preserves the original casing of non-first characters inside each token (after lowercasing it manually). With an already camelCased input ("helloWorld") it will return `helloworld`.',
      'Kebab/snake/constant strip all trailing/leading punctuation; they cannot round-trip a Python-style `__dunder__` identifier.',
    ],
    ui_fields: {
      inputs: [
        'text (multi-line textarea, h-36)',
      ],
      filters: [
        'mode button group: UPPERCASE | lowercase | Title Case | Sentence case | camelCase | snake_case | kebab-case | CONSTANT_CASE (default: Title Case)',
      ],
      outputs: [
        'Read-only output textarea (h-36, bg-slate-50) with a Copy button',
        'Summary card: "Converted N characters to <mode>"',
        'Stats card: Characters, Words (regex-based), Lines, Δ length',
        'Takeaway: length change direction and magnitude (or "same length")',
        'Next-step card linking to Reverse Text and Word Counter',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Eight case styles in one click with a copy button',
        'Runs entirely in the browser',
        'Handles multi-line input',
        'Reports the character-length change after conversion',
      ],
      claim_forbidden: [
        'Applies AP, Chicago, APA, or any stylebook Title Case',
        'Preserves accented letters, apostrophes, or hyphens in camel/snake/kebab/constant modes — those are stripped by the non-alphanumeric split',
        'Respects existing camelCase boundaries (mixed-case input is lowercased first)',
        'Understands proper nouns or acronyms for Title Case',
      ],
    },
  },

  'reverse-text': {
    input_type: 'free text — any length, single or multi-line',
    output_type: 'reversed text in one of three modes: character order, word order (preserving whitespace), or line order',
    processing_steps: [
      'Characters mode: `Array.from(s).reverse().join("")` — iterates by Unicode code point, so most BMP emoji and surrogate pairs stay intact as individual glyphs. Code-point-level only.',
      'Words mode: `s.split(/(\\s+)/).reverse().join("")` — captures whitespace groups so spacing is preserved between reversed words.',
      'Lines mode: `s.split("\\n").reverse().join("\\n")` — split on LF only (not CRLF-aware).',
      'Detect palindrome in Characters mode: strip whitespace, lowercase both sides, compare — surfaces a takeaway card when equal and length > 1.',
    ],
    data_sources: [
      'No dictionary. `reverseChars` / `reverseWords` / `reverseLines` in `src/lib/text.ts`.',
    ],
    fallback_behavior: 'Empty input returns empty output. No error state.',
    known_limitations: [
      'Characters mode iterates by code point, not by grapheme cluster. Zero-width-joiner emoji sequences (👨‍👩‍👧‍👦 family, 🏳️‍🌈 flag), skin-tone modifiers, and regional-indicator flag pairs (🇺🇸 = U+1F1FA + U+1F1F8) are split on reversal and come out as different glyphs or invalid sequences.',
      'The tool page\'s FAQ claim that "multi-codepoint emoji (like flags) stay intact" is inaccurate — flags specifically DO break because they are two separate regional-indicator code points.',
      'No CRLF awareness in Lines mode: Windows-style `\\r\\n` line endings leave stray `\\r` characters attached to each reversed line.',
      'Words mode splits on any whitespace run, including tabs and multiple spaces — preserved exactly in the output, which may look surprising if the input has irregular spacing.',
      'Palindrome detection is Characters-mode only and ignores punctuation only via whitespace stripping — "A man, a plan, a canal: Panama" will not match because commas and colons remain.',
      'No Unicode normalization (NFC / NFD) — decomposed accented characters may split.',
    ],
    ui_fields: {
      inputs: ['text (multi-line textarea, h-36)'],
      filters: [
        'mode button group: Characters | Words | Lines (default: Characters)',
      ],
      outputs: [
        'Read-only output textarea with Copy button',
        'Summary card: "Reversed N <units>"',
        'Stats card: Characters, Words, Lines, Mode',
        'Takeaway (Characters mode only, conditional): "Palindrome — reads the same forwards and backwards"',
        'Next-step card linking to Case Converter and Sort Lines',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Reverses text by character, word, or line',
        'Preserves whitespace between words in Words mode',
        'Flags palindromes in Characters mode',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Preserves ZWJ emoji sequences, flag pairs, or skin-tone combinations intact',
        'Handles Windows (CRLF) line endings cleanly in Lines mode',
        'Ignores punctuation in palindrome detection',
        'Performs grapheme-cluster reversal (à la Intl.Segmenter)',
      ],
    },
  },

  'sort-lines': {
    input_type: 'free text split on `\\n` into lines',
    output_type: 'same lines sorted by one of six orderings, joined back with `\\n`',
    processing_steps: [
      'Split input on `\\n` — blank lines and whitespace-only lines are preserved as sort entries.',
      'Choose comparator based on mode:',
      '  alpha-asc / alpha-desc: `localeCompare` with the default browser locale; case-insensitive unless the Case-sensitive checkbox is on.',
      '  length-asc / length-desc: raw `line.length` (includes whitespace).',
      '  numeric-asc / numeric-desc: `parseFloat(line) || 0`. Non-numeric lines coerce to 0, so they cluster at the start of the ascending sort.',
      'Sort a copy of the lines array (non-destructive), then join with `\\n`.',
      'Client computes unique-line count and duplicate count from the sorted output (using the case-sensitivity toggle) and shows a "use Remove Duplicate Lines" takeaway when duplicates exist.',
    ],
    data_sources: [
      'No dictionary. `sortLines()` in `src/lib/text.ts`.',
    ],
    fallback_behavior: 'Empty input returns empty output. Invalid mode strings are ignored (no-op) — not reachable from the UI.',
    known_limitations: [
      'Numeric sort coerces non-numeric lines to 0. A list mixing "3 apples" (parses to 3), "oranges" (parses to 0), and "1.5" (parses to 1.5) will sort unpredictably relative to each other.',
      'Length sort counts whitespace characters — lines with trailing spaces may appear "longer" than their visible content.',
      'Alpha sort uses the browser\'s default locale; users in different locales may get slightly different orderings for diacritics and ligatures.',
      'Case-sensitivity toggle applies to alpha sort and to the duplicate-detection count, but not to length or numeric modes.',
      'No natural / version sort (item-2 before item-10) — Length or Numeric modes approximate this but are not true versionsort.',
      'Blank and whitespace-only lines are preserved; they cluster at the top of ascending alpha and near the bottom of length-desc output.',
    ],
    ui_fields: {
      inputs: ['text (multi-line font-mono textarea, h-48)'],
      filters: [
        'mode button group: A → Z | Z → A | Length ↑ | Length ↓ | Numeric ↑ | Numeric ↓ (default: A → Z)',
        'case-sensitive checkbox (default: off)',
      ],
      outputs: [
        'Read-only output textarea (font-mono, h-48) with Copy button',
        'Summary card: "Sorted N lines (<mode>)"',
        'Stats card: Lines, Unique, Duplicates, Case',
        'Comparison card: First 3 and Last 3 after sort (when >3 lines)',
        'Takeaway (conditional): "N duplicates remain — use Remove Duplicate Lines" or case-sensitivity note',
        'Next-step card linking to Remove Duplicate Lines and Reverse Text',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Six sort modes: alpha asc/desc, length asc/desc, numeric asc/desc',
        'Case-sensitive toggle for alpha sort and duplicate detection',
        'Preserves blank lines and trailing whitespace',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Natural / version-number sort (item-2 before item-10)',
        'Locale-neutral Unicode collation',
        'Drops blank or whitespace-only lines automatically',
        'Applies case sensitivity to length or numeric modes',
      ],
    },
  },

  'remove-duplicate-lines': {
    input_type: 'free text split on `\\n` into lines',
    output_type: 'deduped lines in original order (preserve) or sorted order, joined back with `\\n`',
    processing_steps: [
      'Split on `\\n`.',
      'For each line: strip trailing whitespace with `/\\s+$/` (leading whitespace is kept).',
      'Walk lines in order, using a `Set<string>` to track seen values. Keep the first occurrence only.',
      'If Preserve order is on: join the kept list with `\\n`.',
      'If Preserve order is off: `.sort()` the kept list with the default JS comparator (lexicographic, case-sensitive, code-point-based — NOT the `localeCompare` collator used by Sort Lines) before joining.',
      'Client reports in/out/removed/unique-rate stats on the result.',
    ],
    data_sources: [
      'No dictionary. `removeDuplicateLines()` in `src/lib/text.ts`.',
    ],
    fallback_behavior: 'Empty input returns empty output. No error state.',
    known_limitations: [
      'Comparison is case-SENSITIVE. "Apple" and "apple" are treated as distinct lines. Use Case Converter first if you need a case-insensitive dedupe.',
      'Only trailing whitespace is trimmed. Leading whitespace is preserved, so "  apple" and "apple" are treated as distinct.',
      'Whitespace-only lines are treated the same way as ordinary lines — two blank lines dedupe to one.',
      'Sort mode uses the default JS string comparator, not the locale-aware collator used in Sort Lines. Result order may differ from Sort Lines\' A→Z for diacritic and case edge cases.',
      'Does not normalize Unicode (NFC / NFD), so "café" (precomposed é) and "café" (e + combining acute) are treated as distinct lines even though they render identically.',
      'No fuzzy / near-duplicate detection — exact match on the trimmed line only.',
    ],
    ui_fields: {
      inputs: ['text (multi-line font-mono textarea, h-48)'],
      filters: [
        'Preserve original order checkbox (default: on — keeps first occurrence; off = sort uniques)',
      ],
      outputs: [
        '"N in → M out" summary label above the inputs',
        'Read-only output textarea (font-mono, h-48) with Copy button',
        'Summary card: "Removed N duplicates from M lines" (or "No duplicates found")',
        'Stats card: Input, Output, Removed, Unique rate (%)',
        'Takeaway: preserve-order note or sort-mode note',
        'Next-step card linking to Sort Lines and Word Counter',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Removes duplicate lines from a block of text',
        'Preserve-order toggle keeps the first occurrence; otherwise returns sorted uniques',
        'Trims trailing whitespace before comparing',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Case-insensitive dedupe',
        'Whitespace-normalized comparison (leading whitespace still matters)',
        'Unicode normalization before comparison',
        'Fuzzy / near-match dedupe (Levenshtein, Jaccard)',
        'Locale-aware sorting when the preserve-order toggle is off',
      ],
    },
  },

  'reading-time-calculator': {
    input_type: 'free text — any length',
    output_type: 'estimated silent reading time and speaking-aloud time at adjustable words-per-minute rates, plus word / character / paragraph counts',
    processing_steps: [
      'Count words via `countWords()`: trim the whole string, then split on `/\\s+/` and take the resulting array length. (Different from Word Counter, which uses a `/\\b[\\w\'-]+\\b/g` match.)',
      'Count characters: raw `text.length` (includes all whitespace).',
      'Count paragraphs: split on `/\\n\\s*\\n/`, trim each, filter empty.',
      'Compute read minutes = words / readWpm; speak minutes = words / speakWpm.',
      'Format results with `fmtMin()`: under 1 minute → rounded seconds (min 1 sec when > 0); between 1 and 60 minutes → `Xm Ys` or `X min` when even; 60+ minutes → `Xh Ym`.',
      'Render comparison at fixed 125 / 200 / 300 WPM reference rates regardless of the chosen readWpm.',
    ],
    data_sources: [
      'No dictionary. `countWords()` in `src/lib/text.ts`.',
    ],
    fallback_behavior: 'Empty input returns no time output (only the input textarea). No zero-word card.',
    known_limitations: [
      'Word-count formula differs from the Word Counter page: this tool uses whitespace split, Word Counter uses a word-character regex. For text with em-dashes, curly quotes, or joined punctuation the two counts can diverge by 1–2%.',
      'Reading-speed slider range is 100–500 WPM (default 200). Real adult silent reading is usually 200–300 WPM; the tool page\'s intro line claiming "238 WPM is a typical adult reading speed" contradicts the slider default of 200 — both are plausible but inconsistent.',
      'Speaking-speed slider range is 90–200 WPM (default 130). Real speaking pace varies by genre: audiobook narration 150–160 WPM, TED-talk pace 163 WPM, auctioneers 250+.',
      'No accounting for images, code blocks, tables, headings, or reader pauses at paragraph breaks.',
      'No language detection — whitespace split gives spurious counts for Chinese, Japanese, or Thai (no word boundaries).',
      'Does not persist slider settings (unlike Word Counter\'s WPM panel with `useToolSetting`).',
      'Comparison table always shows 125 / 200 / 300 WPM reference points, even if the user has the slider at an unrelated value — the takeaway message "every 200 words is about 1 minute at the default pace" is hardcoded and does not recompute.',
    ],
    ui_fields: {
      inputs: ['text (multi-line textarea, h-48)'],
      filters: [
        'reading pace slider (range 100–500 WPM, step 10, default 200) with tick labels "125 (slow) / 200 (avg) / 300 (fast)"',
        'speaking pace slider (range 90–200 WPM, step 5, default 130) with tick labels "90 (slow) / 130 (avg) / 180 (fast)"',
      ],
      outputs: [
        'Large emerald reading-time card + matching slate speaking-time card (two-column on wide screens)',
        'Summary card: word count + formatted read/speak estimates',
        'Stats card: Words, Characters, Paragraphs, Read, Speak',
        'Takeaway: hardcoded "every 200 words ≈ 1 minute" note',
        'Comparison card: reading time at fixed 125 / 200 / 300 WPM reference rates',
        'Next-step card linking to Word Counter and Syllable Counter',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Estimates silent reading time and speaking-aloud time for English text',
        'Adjustable WPM sliders for both reading and speaking',
        'Runs entirely in the browser',
        'Provides a fixed comparison across slow / average / fast reference rates',
      ],
      claim_forbidden: [
        'Personalised reading-speed measurement',
        'Genre-specific estimates (fiction vs. technical vs. poetry)',
        'Image / table / code-block time adjustments',
        'Works on languages without whitespace word boundaries (Chinese, Japanese, Thai)',
        'Uses the same word-count formula as Word Counter (whitespace split vs. regex differ for edge cases)',
        'Persists slider settings between visits',
      ],
    },
  },

  'pattern-solver': {
    input_type: 'pattern string mixing fixed letters (a-z) and `?` / `_` / `.` wildcards; length of the pattern determines word length',
    output_type: 'array of every dictionary word whose length matches the pattern length and whose non-wildcard positions match exactly',
    processing_steps: [
      'This page renders the same `WordFinder` component used by Word Finder and Crossword Solver; pattern matching runs through the worker\'s `pattern` handler.',
      'Load the chosen word list on first use: Game list = ENABLE1 (~172,823 words) or Full list = dict.txt (~370,105 words).',
      'Pattern length fixes candidate word length — the worker filters `byLen(source).get(p.length)` first, then calls `matchesPattern` per candidate.',
      '`matchesPattern` treats any position whose pattern char is `?`, `_`, or `.` as a wildcard; other positions must match exactly (case-insensitive).',
      'Results return in the source word-list order (effectively alphabetical from the dictionary file) — no explicit sort.',
      'Optional inline Scrabble + WWF scoring when toggled.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`, ~172,823 entries) — "Game list" mode.',
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries) — "Full list" mode.',
    ],
    fallback_behavior: 'Empty pattern returns no results. No phonetic fallback.',
    known_limitations: [
      'The underlying component defaults to "Letters" search mode (the setting is shared with Word Finder via `kefiw.word-finder.searchBy`). A first-time visitor must manually switch to Pattern mode to get pattern behaviour — typing a pattern while still in Letters mode will run an anagram-style search instead.',
      'Pattern wildcards are single-character only — no regex quantifiers, no character classes.',
      'No position-aware scoring or premium-square modelling.',
      'Neither word list includes proper nouns, abbreviations, or acronyms.',
      'No cross-pattern constraints (e.g. "word length 7 AND contains Q") — use Word Finder\'s Letters mode for set-based search.',
    ],
    ui_fields: {
      inputs: [
        'pattern (single-line text input, font-mono, autofocused)',
        'min/max length dropdowns (only active in Letters mode; hidden/ignored when using Pattern mode since pattern length is fixed)',
      ],
      filters: [
        'word list: Game list (ENABLE1) | Full list (dict.txt)',
        'search by: Letters | Pattern (shared setting with Word Finder — user must select Pattern explicitly for this page to behave as advertised)',
        'show scores: toggle for inline Scrabble + WWF scores',
      ],
      outputs: [
        'Summary card with match count and echoed pattern',
        'Stats card: mode, longest, shortest, best Scrabble, best WWF, wildcard count, fixed-char count',
        'Length-distribution comparison card',
        'Takeaway: most common result length',
        'Result list — flat when scores are on, length-grouped when off',
        'Next-step card linking to Words Starting With / Ending With / Containing',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Finds every English word whose length matches the pattern and whose non-wildcard letters match exactly',
        'Single-character wildcards (`?`, `_`, `.`)',
        'Offers ENABLE1 and dict.txt word lists',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Regex-style patterns (quantifiers, character classes, alternation)',
        'Length-variable patterns',
        'Cryptic crossword clue parsing',
        'Proper nouns, slang, or acronyms',
      ],
    },
  },

  'crossword-solver': {
    input_type: 'crossword pattern — fixed letters (a-z) plus `?` / `_` / `.` for unknown squares; pattern length equals word length',
    output_type: 'array of every dictionary word matching the positional pattern',
    processing_steps: [
      'Renders the shared `WordFinder` component (same as Word Finder and Pattern Solver). Matching logic is the worker\'s `pattern` handler.',
      'Load the chosen word list on first use: Game list = ENABLE1 or Full list = dict.txt.',
      'Pattern length fixes the candidate word length.',
      'For each same-length dictionary word, `matchesPattern` checks that every non-wildcard position matches exactly (case-insensitive).',
      'Wildcards: `?`, `_`, and `.` all accept any letter at that position.',
      'Results return in dictionary order (effectively alphabetical).',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`, ~172,823 entries) — "Game list" mode.',
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries) — "Full list" mode.',
    ],
    fallback_behavior: 'Empty pattern returns no results. No cryptic-clue parsing; no anagram fallback.',
    known_limitations: [
      'Cannot parse cryptic crossword clues — this is a positional pattern matcher only. Users still need to decode the clue themselves.',
      'Like Pattern Solver, the default search mode is "Letters" (shared setting with Word Finder via `kefiw.word-finder.searchBy`). A first-time visitor must switch to Pattern mode; otherwise typing a pattern runs an anagram-style search.',
      'Single-character wildcards only — no regex.',
      'Pattern length fixes the word length; cannot return longer or shorter matches.',
      'No intersection/crossing-letter constraints with neighbouring crossword entries — solves one slot at a time.',
      'Dict.txt may include archaic, technical, and inflected forms that a crossword editor would reject; flip to Game list (ENABLE1) for tighter tournament-style output.',
    ],
    ui_fields: {
      inputs: [
        'crossword pattern (single-line text input, font-mono, autofocused; wildcards `?`, `_`, `.` accepted)',
        'min/max length dropdowns (only meaningful in Letters mode)',
      ],
      filters: [
        'word list: Game list (ENABLE1) | Full list (dict.txt)',
        'search by: Letters | Pattern (shared setting with Word Finder)',
        'show scores: toggle for inline Scrabble + WWF scores',
      ],
      outputs: [
        'Summary card with match count and echoed pattern',
        'Stats card: mode, longest, shortest, best Scrabble/WWF, wildcard count, fixed-char count',
        'Length-distribution comparison card',
        'Takeaway: most common length',
        'Result list — flat with scores, length-grouped without',
        'Next-step card linking to Pattern Solver, Anagram Solver, and Word Unscrambler',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Finds every English word matching a fixed-length crossword pattern',
        'Single-character wildcards (`?`, `_`, `.`)',
        'Optional Scrabble / WWF scoring',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Parses cryptic crossword clues',
        'Uses crossing-letter or grid context from a full puzzle',
        'Supports regex patterns',
        'Includes proper nouns or abbreviations',
      ],
    },
  },

  'wordle-solver': {
    input_type: 'five-slot row where each slot has a letter (a-z) and a colour state (green = correct position, yellow = wrong position, empty = unused), plus a free-text list of gray (excluded) letters',
    output_type: 'array of every 5-letter candidate word satisfying all green, yellow, and excluded-letter constraints, in worker-returned order (effectively alphabetical)',
    processing_steps: [
      'Build a 5-character green pattern: for each slot that is green with a letter, use that letter; otherwise `?`.',
      'Send the pattern to the worker\'s `pattern` handler with `dictSource: "fast"` (ENABLE1).',
      'Collect yellow requirements: each yellow slot contributes `{ letter, notAt: slotIndex }`.',
      'Normalize the gray / excluded letters: lowercase, strip non-letters, then remove any letter that is already green or yellow (those cannot simultaneously be excluded).',
      'Client-side filter the pattern results: every yellow letter must appear in the candidate, but not at its slot index; no excluded letter may appear anywhere.',
      'No result cap. No debounce — recomputes synchronously on every slot/exclusion change.',
      'Compute a follow-up hint from the remaining candidate count (1 → "only one word", ≤5 → "pick a word that tests new letters", else → "eliminate common vowels/consonants").',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`, ~172,823 entries). Hardcoded — no Full-list toggle on this tool.',
    ],
    fallback_behavior: 'Empty slots produce the pattern `?????`, which matches every 5-letter ENABLE1 word; the candidate list loads as soon as the tool mounts. No alternative dictionary.',
    known_limitations: [
      'Fixed to five letters — cannot be used for non-standard Wordle variants (e.g. 4-letter mini, 6-letter, 7-letter Xordle).',
      'Uses ENABLE1 as a proxy for Wordle\'s accepted-guess list. ENABLE1 overlaps heavily with Wordle but is not identical: a handful of Wordle-legal words may be missing and a few ENABLE1 words may not be Wordle-legal.',
      'Does not model Wordle\'s "answer" list (the curated ~2,300 daily answers) — all 5-letter ENABLE1 entries are candidates, including obscure words that Wordle never uses as the day\'s answer.',
      'Duplicate-letter scoring nuance is respected only partly: a yellow letter requires at least one occurrence elsewhere, but the tool does not count exact duplicate letter counts. If the answer has two Es and your guess has three, all three will filter the same way.',
      'No "hard mode" enforcement (Wordle\'s rule that subsequent guesses must use known green/yellow letters).',
      'No guess-quality ranking beyond a text takeaway hint — does not suggest the optimal next guess by information gain.',
      'Does not include proper nouns, abbreviations, or recent dictionary additions beyond ENABLE1.',
    ],
    ui_fields: {
      inputs: [
        '5 letter slots (single-character inputs, uppercase display, font-mono, tap-to-cycle caption underneath each)',
        'gray/wrong letters (single-line text input, font-mono; accepts any number of letters)',
      ],
      filters: [
        'per-slot colour toggle: empty | green | yellow (cycles when the caption button below each slot is tapped; auto-sets to green when a letter is typed into an empty slot)',
      ],
      outputs: [
        'Summary card: candidate count',
        'Stats card: candidates, highest-scoring candidate (Scrabble value), green count, yellow count',
        'Takeaway card: strategy hint tuned to candidate-count buckets (1 / ≤5 / many)',
        'Result list of remaining candidates (worker order; no scores)',
        'Reset button (clears all slots + grays)',
        'Next-step card linking to 5-Letter Finder and Anagram Solver',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Narrows 5-letter Wordle candidates by green (correct position), yellow (wrong position), and gray (excluded) constraints',
        'Uses the ENABLE1 word list as a close proxy for Wordle\'s accepted-guess list',
        'Offers a candidate-count-tuned strategy hint',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Uses the official Wordle answer list or the NYT accepted-guess list verbatim',
        'Enforces Wordle hard-mode rules',
        'Ranks guesses by information gain or any solver algorithm',
        'Counts duplicate-letter frequencies exactly the way the real game does',
        'Supports Wordle variants (4-letter, 6-letter, multi-board)',
        'Includes proper nouns or dictionary additions beyond ENABLE1',
      ],
    },
  },

  'hangman-solver': {
    input_type: 'pattern with known letters and blanks (`?`, `_`, or `-` are all treated as unknown-letter wildcards), plus a free-text list of already-guessed-wrong letters',
    output_type: 'array of every same-length dictionary word matching the known letters and containing none of the wrong letters, plus a "best next guess" letter-frequency table',
    processing_steps: [
      'Normalize pattern: lowercase, strip non `a-z?_-` characters, then map `_` and `-` to `?`.',
      'Require pattern length ≥ 2; shorter patterns return no results.',
      'Send the cleaned pattern to the worker\'s `pattern` handler with `dictSource: "fast"` (ENABLE1).',
      'Client-side filter: drop any candidate containing any excluded letter.',
      'Compute best-next-letter frequency: for each candidate, take the unique letters that are not already revealed in the pattern and not excluded; count how many candidates contain each; return the top 6 with count and percentage.',
      'No debounce — recomputes on every pattern/exclusion change.',
      'No result cap.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`, ~172,823 entries). Hardcoded — no Full-list toggle.',
    ],
    fallback_behavior: 'Patterns shorter than 2 characters return no results. No alternative dictionary. No pattern-relaxation fallback.',
    known_limitations: [
      'Matches exact word length only — if the length of the hangman target is unknown, this tool cannot search across lengths.',
      'Best-next-letter heuristic maximises information about the remaining candidate set but does not account for the cost of a wrong guess (e.g. number of lives left).',
      'Does not weight candidates by frequency of use — all ENABLE1 words are equally likely as far as the solver is concerned.',
      'Proper nouns, names, abbreviations, and many recent slang terms are not in ENABLE1, so hangman games drawn from pop culture may have no matches.',
      'Wildcards collapse to `?` — there is no distinction between "known to not be E" and "blank"; if you need per-position negative constraints, use Wordle Solver instead.',
      'Hardcoded to the fast word list; users cannot switch to the broader dict.txt.',
    ],
    ui_fields: {
      inputs: [
        'pattern (single-line text input, font-mono, autofocused; `?`, `_`, or `-` accepted as blanks)',
        'wrong letters (single-line text input, font-mono)',
      ],
      filters: [],
      outputs: [
        'Summary card: candidate count with echoed pattern',
        'Best-next-guess comparison card: top 6 letters by frequency with percent and count',
        'Stats card: candidates, pattern length, wrong-letter count, highest-scoring candidate',
        'Takeaway card: "only one word fits" when 1 candidate, else top-frequency letter hint',
        'Result list of remaining candidates (worker order; no scores)',
        'Next-step card linking to Word Finder and Wordle Solver',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Matches hangman patterns with known letters and blanks',
        'Filters out candidates containing any already-missed letter',
        'Suggests the next letter to guess by frequency across remaining candidates',
        'Uses the ENABLE1 word list',
        'Runs entirely in the browser',
      ],
      claim_forbidden: [
        'Parses variable-length patterns',
        'Includes proper nouns, place names, or recent slang',
        'Optimises guesses for remaining lives or expected-loss minimisation',
        'Supports `?`-per-position negative constraints (use Wordle Solver for that)',
        'Offers a broader dictionary toggle',
      ],
    },
  },

  '5-letter-word-finder': {
    input_type: 'fixed 5-character pattern (letters a-z plus `?` / `_` / `.` wildcards), OR a letter rack in Letters mode',
    output_type: 'array of every dictionary word whose length is 5 and matches the pattern (Pattern mode), or every 5-letter word spellable from the rack (Letters mode)',
    processing_steps: [
      'Uses the shared `WordFinder` component with `lockedLength={5}` — the length selectors are hidden, and the input is capped at 5 characters.',
      'Default search mode when `lockedLength` is set is Pattern (unlike plain Word Finder / Pattern Solver / Crossword Solver, which default to Letters).',
      'Persists mode choice under its own storage key: `kefiw.word-finder-5.searchBy` — not shared with other finders.',
      'Load the chosen word list (ENABLE1 or dict.txt) on first use.',
      'Pattern mode: dispatch to the worker\'s `pattern` handler; only 5-letter words are candidates.',
      'Letters mode: dispatch to the worker\'s `unscramble` handler with min=max=5.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`, ~172,823 entries) — "Game list" mode.',
      'Broader English dictionary (`public/data/dict.txt`, ~370,105 entries) — "Full list" mode.',
    ],
    fallback_behavior: 'Empty input returns no results. No phonetic fallback.',
    known_limitations: [
      'Hard-locked to 5 letters — cannot find 4- or 6-letter words.',
      'Single-character wildcards only in Pattern mode.',
      'Letters mode respects blanks (`?`) but does not support per-position constraints — use Wordle Solver or Pattern mode for that.',
      'Not the Wordle accepted-guess list specifically — uses ENABLE1 / dict.txt.',
      'No proper nouns, abbreviations, or acronyms.',
    ],
    ui_fields: {
      inputs: [
        '5-character input (single-line, font-mono, autofocused, maxLength 5; pattern mode allows `?`/`_`/`.` wildcards)',
      ],
      filters: [
        'word list: Game list (ENABLE1) | Full list (dict.txt)',
        'search by: Letters | Pattern (persisted independently per length)',
        'show scores: toggle for inline Scrabble + WWF scores',
      ],
      outputs: [
        'Summary card with match count',
        'Stats card: mode, longest, shortest (always 5), best Scrabble, best WWF, wildcard count (Pattern mode)',
        'Length-distribution card (single-length in Pattern mode)',
        'Result list — flat with scores, length-grouped without',
        'Next-step card linking to Words Starting With / Ending With / Containing',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Wordle-style 5-letter pattern search with single-character wildcards',
        'Letter-rack search for 5-letter words you can spell',
        'Game list and full dictionary word lists',
        'Optional Scrabble/WWF scoring',
      ],
      claim_forbidden: [
        'Uses the official Wordle answer or accepted-guess list',
        'Enforces Wordle-specific constraints (greens/yellows/grays) — that is Wordle Solver',
        'Supports regex patterns',
        'Includes proper nouns, names, or abbreviations',
      ],
    },
  },

  '6-letter-word-finder': {
    input_type: 'fixed 6-character pattern with `?` / `_` / `.` wildcards, OR a letter rack in Letters mode',
    output_type: 'array of every dictionary word whose length is 6 and matches the pattern, or every 6-letter word spellable from the rack',
    processing_steps: [
      'Uses the shared `WordFinder` component with `lockedLength={6}`; length selectors hidden, input capped at 6 characters.',
      'Default mode is Pattern. Mode persists under `kefiw.word-finder-6.searchBy`.',
      'Load the chosen word list (ENABLE1 or dict.txt).',
      'Pattern mode calls the worker\'s `pattern` handler; Letters mode calls `unscramble` with min=max=6.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`).',
      'Broader English dictionary (`public/data/dict.txt`).',
    ],
    fallback_behavior: 'Empty input returns no results.',
    known_limitations: [
      'Hard-locked to 6 letters.',
      'Single-character wildcards only in Pattern mode.',
      'No position-constrained Letters mode.',
      'No proper nouns, abbreviations, or acronyms.',
    ],
    ui_fields: {
      inputs: ['6-character input (maxLength 6, font-mono, autofocused)'],
      filters: [
        'word list: Game list | Full list',
        'search by: Letters | Pattern (persisted per length)',
        'show scores toggle',
      ],
      outputs: [
        'Summary / stats / result list as with other WordFinder variants',
        'Next-step card linking to sibling prefix/suffix/substring finders',
      ],
    },
    content_guidance: {
      claim_allowed: [
        '6-letter pattern and letter-rack search',
        'Game list and full dictionary word lists',
        'Optional Scrabble/WWF scoring',
      ],
      claim_forbidden: [
        'Length-variable search — use Word Finder for that',
        'Regex patterns',
        'Proper nouns or abbreviations',
      ],
    },
  },

  '7-letter-word-finder': {
    input_type: 'fixed 7-character pattern with `?` / `_` / `.` wildcards, OR a letter rack in Letters mode',
    output_type: 'array of every dictionary word whose length is 7 and matches the pattern, or every 7-letter word spellable from the rack — the core use case is finding Scrabble bingo candidates',
    processing_steps: [
      'Uses the shared `WordFinder` component with `lockedLength={7}`; length selectors hidden, input capped at 7 characters.',
      'Default mode is Pattern. Mode persists under `kefiw.word-finder-7.searchBy`.',
      'Load the chosen word list (ENABLE1 or dict.txt).',
      'Pattern mode calls the worker\'s `pattern` handler; Letters mode calls `unscramble` with min=max=7.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`).',
      'Broader English dictionary (`public/data/dict.txt`).',
    ],
    fallback_behavior: 'Empty input returns no results.',
    known_limitations: [
      'Hard-locked to 7 letters.',
      'No Scrabble board context (hooks, premium squares, parallel plays) — this is a word-list filter, not a rack helper. Use Scrabble Helper for actual play ranking with the +50 bingo bonus.',
      'Single-character wildcards only in Pattern mode.',
      'No proper nouns, abbreviations, or acronyms.',
    ],
    ui_fields: {
      inputs: ['7-character input (maxLength 7, font-mono, autofocused)'],
      filters: [
        'word list: Game list | Full list',
        'search by: Letters | Pattern (persisted per length)',
        'show scores toggle',
      ],
      outputs: [
        'Summary / stats / result list as with other WordFinder variants; Scrabble/WWF best-score cells highlight bingo candidates when scores are on',
        'Next-step card linking to Scrabble Helper and Anagram Solver',
      ],
    },
    content_guidance: {
      claim_allowed: [
        '7-letter pattern and letter-rack search — the standard Scrabble bingo length',
        'Game list and full dictionary word lists',
        'Optional Scrabble/WWF scoring (though scores here do NOT include the +50 bingo bonus; that is applied only in Scrabble Helper)',
      ],
      claim_forbidden: [
        'Applies the Scrabble bingo bonus (+50) — this tool scores tiles only, not plays; use Scrabble Helper for bonus-aware ranking',
        'Models a Scrabble board or premium squares',
        'Regex patterns',
        'Proper nouns or abbreviations',
      ],
    },
  },

  'word-finder': {
    input_type: 'letters (a-z plus `?` for blanks) OR a fixed-length pattern (a-z plus `?`/`_`/`.` as wildcards)',
    output_type: 'array of dictionary words matching either the letter rack (with min/max length filters) or the positional pattern',
    processing_steps: [
      'Load the chosen word list on first use: Game list = ENABLE1 or Full list = dict.txt.',
      'If search mode is "Letters": strip whitespace, call the `unscramble` worker with minLen/maxLen — same rack-fit logic as Word Unscrambler but with separate length bounds.',
      'If search mode is "Pattern": pattern length fixes the candidate word length. For each dictionary word of that length, call `matchesPattern` — any position whose pattern char is `?`, `_`, or `.` accepts any letter; other positions must match exactly (case-insensitive).',
      'Letters mode sorts by length descending then alphabetically; Pattern mode returns in the source word-list order (effectively alphabetical from the dictionary file).',
      'Optional Scrabble + WWF score display when toggled.',
      'Lightweight variants (`5-letter-word-finder`, `6-letter-word-finder`, `7-letter-word-finder`) lock the pattern length to 5/6/7 and hide the min/max controls.',
    ],
    data_sources: [
      'ENABLE1 word list (`public/data/enable.txt`) — "Game list" mode.',
      'Broader English dictionary (`public/data/dict.txt`) — "Full list" mode.',
    ],
    fallback_behavior: 'Empty input returns no results. No automatic min-length fallback (unlike Word Unscrambler). No phonetic fallback.',
    known_limitations: [
      'Pattern mode matches exact-length candidates only — a 4-character pattern cannot match a 5-letter word.',
      'Pattern wildcards (`?`, `_`, `.`) are single-character only — no regex quantifiers, no character classes.',
      'Letters mode does not support a "must include these letters" constraint — use Words Containing for substring matching instead.',
      'No position-aware scoring, no premium-square modelling.',
      'Neither word list includes proper nouns, abbreviations, or acronyms.',
      'Does not deduplicate between the two word lists — switching mode refetches and rebuilds the index.',
    ],
    ui_fields: {
      inputs: [
        'letters or pattern (single-line text input, font-mono, autofocused; maxLength is locked on the 5/6/7-letter variants)',
        'min length: dropdown 2–8 (letters mode only; hidden on locked-length variants)',
        'max length: dropdown 5–15 (letters mode only; hidden on locked-length variants)',
      ],
      filters: [
        'word list: Game list (ENABLE1) | Full list (dict.txt)',
        'search by: Letters | Pattern',
        'show scores: toggle for inline Scrabble + WWF scores',
      ],
      outputs: [
        'Summary card: match count, with the pattern echoed when in Pattern mode',
        'Stats card: mode, longest, shortest, best Scrabble, best WWF; plus wildcard and fixed-char counts in Pattern mode',
        'Comparison card: count by word length (top 4 lengths)',
        'Takeaway (conditional): most common result length',
        'Result list — grouped by length when scores are off, flat when scores are on',
        'Next-step card linking to Words Starting With / Ending With / Containing',
      ],
    },
    content_guidance: {
      claim_allowed: [
        'Two search modes: Letters (anagram-style with min/max length) and Pattern (positional, fixed length)',
        'Accepts single-letter wildcards (`?`, `_`, `.`) in Pattern mode',
        'Supports blanks (`?`) in Letters mode',
        'Offers a compact game list (ENABLE1) and a broader dictionary (dict.txt)',
        'Runs entirely in the browser',
        'Powers the 5-, 6-, and 7-letter variants with the pattern length locked',
      ],
      claim_forbidden: [
        'Regex-style patterns (quantifiers, character classes)',
        'Prefix/suffix/substring search — those are separate tools',
        'Scrabble/WWF board modelling, premium squares, or hook plays',
        'Proper nouns, slang, or acronyms',
      ],
    },
  },
};

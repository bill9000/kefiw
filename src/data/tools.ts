export type ToolCategory = 'word-tools' | 'converters' | 'calculators' | 'games';

export interface FaqItem {
  q: string;
  a: string;
}

export interface ExampleBlock {
  title: string;
  body: string;
}

export interface ToolConfig {
  id: string;
  category: ToolCategory;
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  howTo: string[];
  examples: ExampleBlock[];
  faq: FaqItem[];
  relatedIds: string[];
  island?: string;
  usesWorker?: boolean;
  usesIndexedDB?: boolean;
  comingSoon?: boolean;
}

export const CATEGORIES: Record<ToolCategory, { title: string; slug: string; blurb: string }> = {
  'word-tools': {
    title: 'Word Tools',
    slug: 'word-tools',
    blurb: 'Unscramblers, anagram solvers, word finders, and text utilities — all running locally in your browser.',
  },
  converters: {
    title: 'Converters',
    slug: 'converters',
    blurb: 'Fast unit converters for length, weight, temperature, area, volume, speed, and time.',
  },
  calculators: {
    title: 'Calculators',
    slug: 'calculators',
    blurb: 'Percentage, age, and date-difference calculators with clean mobile-first input.',
  },
  games: {
    title: 'Games',
    slug: 'games',
    blurb: 'Lightweight browser games — Sudoku and daily puzzles. No ads in your face.',
  },
};

export const TOOLS: ToolConfig[] = [
  // ---------- WORD TOOLS ----------
  {
    id: 'word-unscrambler',
    category: 'word-tools',
    slug: 'word-unscrambler',
    title: 'Word Unscrambler — Kefiw',
    h1: 'Word Unscrambler',
    description: 'Unscramble letters into valid English words. Fast, free, runs entirely in your browser.',
    keywords: ['unscrambler', 'unscramble letters', 'word unscrambler', 'letter unscrambler'],
    intro: 'Paste a set of scrambled letters and get every valid English word you can build from them. Works offline, runs in your browser, and returns results in milliseconds.',
    howTo: [
      'Type or paste your scrambled letters into the input box.',
      'Click Unscramble (or just wait — the tool runs as you type).',
      'Results are grouped by length, longest first.',
      'Tap any word to copy it to your clipboard.',
    ],
    examples: [
      { title: 'Input: TEINGL', body: 'Returns: tingle, ingle, tile, tine, gent, gilt, lien, line, nite, tien, tile, gel, lie, ten…' },
      { title: 'Input: AEILNRT', body: 'Returns: retinal, latrine, ratline, reliant, trenail, entail, linter, rental…' },
    ],
    faq: [
      { q: 'Does this support wildcards?', a: 'Yes — use ? for a single blank tile. You can combine known letters with wildcards, e.g. "ca?t".' },
      { q: 'What dictionary is used?', a: 'An open-source English word list covering common Scrabble- and Words With Friends-valid words.' },
      { q: 'Does it work offline?', a: 'Yes. All processing runs locally in your browser. No server calls.' },
    ],
    relatedIds: ['anagram-solver', 'scrabble-helper', 'words-with-friends-helper', 'word-finder'],
    island: 'WordUnscrambler',
    usesWorker: true,
  },
  {
    id: 'anagram-solver',
    category: 'word-tools',
    slug: 'anagram-solver',
    title: 'Anagram Solver — Kefiw',
    h1: 'Anagram Solver',
    description: 'Find every anagram of your word or phrase. All-letter and partial anagrams, instantly.',
    keywords: ['anagram solver', 'anagram finder', 'anagrams of a word'],
    intro: 'Enter any word or phrase and get every valid anagram — both perfect rearrangements and partial matches using a subset of the letters.',
    howTo: [
      'Type any word or letters into the input.',
      'Toggle between "all letters" and "any letters" mode.',
      'Tap a result to copy it.',
    ],
    examples: [
      { title: 'All-letter anagrams of LISTEN', body: 'silent, enlist, inlets, tinsel' },
      { title: 'Partial anagrams of STREAM', body: 'master, maters, tamers, tears, rates, stare…' },
    ],
    faq: [
      { q: 'What is an anagram?', a: 'A rearrangement of the letters of a word or phrase to form another valid word or phrase.' },
      { q: 'Does spacing matter?', a: 'Spaces are stripped before matching. Only the letters are used.' },
    ],
    relatedIds: ['word-unscrambler', 'scrabble-helper', 'word-finder'],
    island: 'AnagramSolver',
    usesWorker: true,
  },
  {
    id: 'word-finder',
    category: 'word-tools',
    slug: 'word-finder',
    title: 'Word Finder by Letters — Kefiw',
    h1: 'Word Finder by Letters',
    description: 'Find words that can be made from a specific set of letters, with optional minimum and maximum length filters.',
    keywords: ['word finder', 'find words with letters', 'word maker'],
    intro: 'Enter the letters you have (including blanks as ?) and filter by word length. Useful for Scrabble, Words With Friends, and general word puzzles. For prefix, suffix, or substring searches, use the dedicated Words Starting With, Words Ending With, or Words Containing tools.',
    howTo: [
      'Enter your available letters (2–15 characters).',
      'Use ? for each blank tile.',
      'Optionally set a minimum and maximum word length.',
      'Tap any result to copy it.',
    ],
    examples: [
      { title: 'Input: RSTLNE?', body: 'Returns ELDEST, LETTERS, RELENTS, STERN…' },
    ],
    faq: [
      { q: 'How many blanks can I use?', a: 'Up to 2 — same as real Scrabble.' },
    ],
    relatedIds: ['scrabble-helper', 'words-with-friends-helper', 'word-unscrambler'],
    island: 'WordFinder',
    usesWorker: true,
  },
  {
    id: 'words-starting-with',
    category: 'word-tools',
    slug: 'words-starting-with',
    title: 'Words Starting With — Kefiw',
    h1: 'Words Starting With',
    description: 'Find every English word that starts with a given prefix. Filter by length.',
    keywords: ['words starting with', 'words that start with', 'prefix search'],
    intro: 'Enter a prefix and get every English word that begins with it. Useful for crossword puzzles, word games, and writing.',
    howTo: [
      'Type the letters you want words to start with.',
      'Optionally restrict by length.',
      'Results appear sorted by length, shortest first.',
    ],
    examples: [
      { title: 'Prefix: ZY', body: 'zygote, zymase, zymurgy, zydeco…' },
    ],
    faq: [
      { q: 'Is this case-sensitive?', a: 'No. Input and results are always lowercase.' },
    ],
    relatedIds: ['words-ending-with', 'words-containing', 'word-finder'],
    island: 'WordsStartingWith',
    usesWorker: true,
  },
  {
    id: 'words-ending-with',
    category: 'word-tools',
    slug: 'words-ending-with',
    title: 'Words Ending With — Kefiw',
    h1: 'Words Ending With',
    description: 'Find every English word that ends with a given suffix.',
    keywords: ['words ending with', 'words that end with', 'suffix search'],
    intro: 'Enter a suffix and get every English word that ends with it.',
    howTo: [
      'Type the ending letters.',
      'Optionally restrict by length.',
    ],
    examples: [
      { title: 'Suffix: TION', body: 'action, motion, nation, station, creation…' },
    ],
    faq: [
      { q: 'Why are some short words missing?', a: 'Very short matches (2 letters) are omitted by default for readability. Use the length filter to include them.' },
    ],
    relatedIds: ['words-starting-with', 'words-containing', 'word-finder'],
    island: 'WordsEndingWith',
    usesWorker: true,
  },
  {
    id: 'words-containing',
    category: 'word-tools',
    slug: 'words-containing',
    title: 'Words Containing Letters — Kefiw',
    h1: 'Words Containing',
    description: 'Find English words that contain a specific sequence of letters.',
    keywords: ['words containing', 'words with letters', 'infix search'],
    intro: 'Enter a sequence of letters and find every English word that contains it anywhere.',
    howTo: [
      'Type the substring you want to search for.',
      'Optionally restrict by length.',
    ],
    examples: [
      { title: 'Contains: QUA', body: 'aqua, equal, square, quantum, quaint, quart…' },
    ],
    faq: [
      { q: 'Can I combine prefix and suffix?', a: 'For now, use Words Starting With or Words Ending With separately. A combined pattern search is planned.' },
    ],
    relatedIds: ['words-starting-with', 'words-ending-with', 'word-finder'],
    island: 'WordsContaining',
    usesWorker: true,
  },
  {
    id: 'scrabble-helper',
    category: 'word-tools',
    slug: 'scrabble-helper',
    title: 'Scrabble Word Finder — Kefiw',
    h1: 'Scrabble Word Finder',
    description: 'Find the highest-scoring Scrabble words you can play with your tiles.',
    keywords: ['scrabble word finder', 'scrabble helper', 'scrabble cheat'],
    intro: 'Enter your rack (up to 7 letters, use ? for blanks) and get every playable Scrabble word, sorted by point value.',
    howTo: [
      'Enter your tiles. Use ? for blanks.',
      'Results are sorted by Scrabble score, highest first.',
      'Tap any word to copy it to your clipboard.',
    ],
    examples: [
      { title: 'Rack: QUIZZES', body: 'Top play: QUIZZES (34 points, uses all tiles for a 50-point bingo).' },
    ],
    faq: [
      { q: 'Are tile values exact?', a: 'Yes — standard tournament Scrabble tile values.' },
      { q: 'Does this include bingo bonus?', a: 'Yes, +50 if you use all 7 tiles.' },
    ],
    relatedIds: ['words-with-friends-helper', 'word-unscrambler', 'anagram-solver'],
    island: 'ScrabbleHelper',
    usesWorker: true,
  },
  {
    id: 'words-with-friends-helper',
    category: 'word-tools',
    slug: 'words-with-friends-helper',
    title: 'Words With Friends Word Finder — Kefiw',
    h1: 'Words With Friends Word Finder',
    description: 'Find the highest-scoring Words With Friends plays from your tiles.',
    keywords: ['words with friends', 'wwf word finder', 'wwf helper'],
    intro: 'Enter your rack and get every valid Words With Friends play, scored using WWF tile values.',
    howTo: [
      'Enter your tiles. Use ? for blanks.',
      'Results are sorted by WWF score.',
    ],
    examples: [
      { title: 'Rack: SQUEEZE', body: 'Top play: SQUEEZE (high-value Z and Q combo).' },
    ],
    faq: [
      { q: 'Are the tile values different from Scrabble?', a: 'Yes — Words With Friends uses its own tile distribution and values.' },
    ],
    relatedIds: ['scrabble-helper', 'word-unscrambler'],
    island: 'WwfHelper',
    usesWorker: true,
  },
  {
    id: 'rhyme-finder',
    category: 'word-tools',
    slug: 'rhyme-finder',
    title: 'Rhyme Finder — Kefiw',
    h1: 'Rhyme Finder',
    description: 'Find words that rhyme with your input. Useful for songwriting, poetry, and rap.',
    keywords: ['rhyme finder', 'rhymes with', 'rhyming dictionary'],
    intro: 'Enter any word and get a list of words that rhyme with it, grouped by perfect rhyme, near rhyme, and end-sound match.',
    howTo: [
      'Enter a single word.',
      'View perfect rhymes first, then near-rhymes.',
    ],
    examples: [
      { title: 'Rhymes with TIME', body: 'dime, lime, rhyme, prime, chime, climb, crime, sublime…' },
    ],
    faq: [
      { q: 'How are rhymes computed?', a: 'By matching the trailing phoneme pattern of each word. Perfect rhymes share the last stressed vowel and all following sounds.' },
    ],
    relatedIds: ['syllable-counter', 'words-ending-with'],
    island: 'RhymeFinder',
  },
  {
    id: 'syllable-counter',
    category: 'word-tools',
    slug: 'syllable-counter',
    title: 'Syllable Counter — Kefiw',
    h1: 'Syllable Counter',
    description: 'Count the syllables in any word or phrase. Useful for haiku, poetry, and writing.',
    keywords: ['syllable counter', 'count syllables', 'syllables in word'],
    intro: 'Type or paste a word, sentence, or paragraph and get an accurate syllable count per word and total.',
    howTo: [
      'Type or paste your text.',
      'View per-word and total syllable counts.',
    ],
    examples: [
      { title: 'Input: "kefiw dictionary"', body: 'kefiw (2) + dictionary (4) = 6 syllables' },
    ],
    faq: [
      { q: 'How accurate is it?', a: 'Uses a heuristic that is ~95% accurate on common English words. Rare or technical words may be off by one.' },
    ],
    relatedIds: ['word-counter', 'letter-counter', 'rhyme-finder'],
    island: 'SyllableCounter',
  },
  {
    id: 'letter-counter',
    category: 'word-tools',
    slug: 'letter-counter',
    title: 'Letter Counter — Kefiw',
    h1: 'Letter Counter',
    description: 'Count letters, characters (with and without spaces), and letter frequency in any text.',
    keywords: ['letter counter', 'character counter', 'letter frequency'],
    intro: 'Paste any text and instantly see character counts, letter frequency, and reading stats.',
    howTo: ['Paste text.', 'View stats in the output panel.'],
    examples: [{ title: 'Input: "Hello World"', body: 'Characters: 11 (10 without spaces). H:1, e:1, l:3, o:2, W:1, r:1, d:1.' }],
    faq: [
      { q: 'Are emoji counted?', a: 'Yes — each emoji counts as one character.' },
    ],
    relatedIds: ['word-counter', 'syllable-counter', 'case-converter'],
    island: 'LetterCounter',
  },
  {
    id: 'word-counter',
    category: 'word-tools',
    slug: 'word-counter',
    title: 'Word Counter — Kefiw',
    h1: 'Word Counter',
    description: 'Count words, sentences, paragraphs, and reading time in any text.',
    keywords: ['word counter', 'count words', 'word count tool'],
    intro: 'Paste any text and get word, sentence, paragraph, and reading-time stats instantly.',
    howTo: ['Paste your text.', 'Stats update as you type.'],
    examples: [{ title: 'Typical essay', body: '500 words ≈ 2.5 min read. 1500 words ≈ 7 min read.' }],
    faq: [
      { q: 'How is reading time calculated?', a: 'At 200 words per minute (average adult silent reading speed).' },
    ],
    relatedIds: ['letter-counter', 'syllable-counter', 'case-converter'],
    island: 'WordCounter',
  },
  {
    id: 'reverse-text',
    category: 'word-tools',
    slug: 'reverse-text',
    title: 'Reverse Text — Kefiw',
    h1: 'Reverse Text',
    description: 'Reverse any text character-by-character, word-by-word, or line-by-line.',
    keywords: ['reverse text', 'backwards text', 'flip text'],
    intro: 'Flip any text instantly. Choose between reversing characters, words, or lines.',
    howTo: ['Paste your text.', 'Choose mode: characters, words, or lines.'],
    examples: [{ title: 'Character reverse', body: '"hello world" → "dlrow olleh"' }],
    faq: [
      { q: 'Does it reverse emoji correctly?', a: 'Yes — multi-codepoint emoji (like flags) stay intact.' },
    ],
    relatedIds: ['case-converter', 'sort-lines', 'remove-duplicate-lines'],
    island: 'ReverseText',
  },
  {
    id: 'case-converter',
    category: 'word-tools',
    slug: 'case-converter',
    title: 'Case Converter — Kefiw',
    h1: 'Case Converter',
    description: 'Convert text between uppercase, lowercase, title case, sentence case, camelCase, and snake_case.',
    keywords: ['case converter', 'uppercase lowercase', 'title case', 'camel case converter'],
    intro: 'Switch text between a dozen case styles in a single click.',
    howTo: ['Paste your text.', 'Pick a case style.'],
    examples: [{ title: 'Hello World', body: 'UPPER: HELLO WORLD, lower: hello world, Title: Hello World, camel: helloWorld, snake: hello_world' }],
    faq: [
      { q: 'Which Title Case rules?', a: 'Capitalizes the first letter of each word. Does not apply stylebook exceptions.' },
    ],
    relatedIds: ['reverse-text', 'word-counter', 'letter-counter'],
    island: 'CaseConverter',
  },
  {
    id: 'remove-duplicate-lines',
    category: 'word-tools',
    slug: 'remove-duplicate-lines',
    title: 'Remove Duplicate Lines — Kefiw',
    h1: 'Remove Duplicate Lines',
    description: 'Remove duplicate lines from a list or block of text. Optionally preserve order.',
    keywords: ['remove duplicates', 'dedupe lines', 'unique lines'],
    intro: 'Paste any list and remove duplicate entries. Choose whether to preserve original order or sort the result.',
    howTo: ['Paste lines.', 'Toggle order-preserving or sorted output.'],
    examples: [{ title: '5 lines in, 3 unique out', body: 'Typical for cleaning scraped lists or logs.' }],
    faq: [
      { q: 'Is whitespace trimmed?', a: 'Yes — trailing whitespace per line is ignored when matching.' },
    ],
    relatedIds: ['sort-lines', 'reverse-text', 'case-converter'],
    island: 'RemoveDuplicateLines',
  },
  {
    id: 'sort-lines',
    category: 'word-tools',
    slug: 'sort-lines',
    title: 'Sort Lines Alphabetically — Kefiw',
    h1: 'Sort Lines',
    description: 'Sort lines or words alphabetically, numerically, by length, or reverse.',
    keywords: ['sort lines', 'alphabetical sort', 'sort words'],
    intro: 'Paste any list of lines or words and sort them alphabetically, numerically, by length, or in reverse.',
    howTo: ['Paste lines.', 'Pick a sort mode.'],
    examples: [{ title: 'Alphabetic', body: 'banana, apple, cherry → apple, banana, cherry' }],
    faq: [
      { q: 'Is the sort case-sensitive?', a: 'There is a toggle. Default is case-insensitive.' },
    ],
    relatedIds: ['remove-duplicate-lines', 'reverse-text'],
    island: 'SortLines',
  },

  // ---------- CONVERTERS ----------
  {
    id: 'length-converter',
    category: 'converters',
    slug: 'length-converter',
    title: 'Length Converter — Kefiw',
    h1: 'Length Converter',
    description: 'Convert between meters, feet, inches, miles, kilometers, yards, and more.',
    keywords: ['length converter', 'meters to feet', 'cm to inches'],
    intro: 'Instant conversion between every common unit of length. Works offline.',
    howTo: ['Enter a value.', 'Pick source and target units.'],
    examples: [{ title: '1 meter', body: '= 3.2808 feet = 39.37 inches = 100 cm' }],
    faq: [{ q: 'How many decimal places?', a: 'Six by default. Adjustable.' }],
    relatedIds: ['weight-converter', 'area-converter', 'volume-converter'],
    island: 'LengthConverter',
  },
  {
    id: 'weight-converter',
    category: 'converters',
    slug: 'weight-converter',
    title: 'Weight Converter — Kefiw',
    h1: 'Weight Converter',
    description: 'Convert between kilograms, pounds, ounces, grams, stones, and tons.',
    keywords: ['weight converter', 'kg to lbs', 'pounds to kilograms'],
    intro: 'Instant mass and weight conversion between every common unit.',
    howTo: ['Enter a value.', 'Pick source and target units.'],
    examples: [{ title: '1 kilogram', body: '= 2.2046 pounds = 35.274 ounces' }],
    faq: [{ q: 'Is stone supported?', a: 'Yes. 1 stone = 14 pounds = 6.35029 kg.' }],
    relatedIds: ['length-converter', 'volume-converter'],
    island: 'WeightConverter',
  },
  {
    id: 'temperature-converter',
    category: 'converters',
    slug: 'temperature-converter',
    title: 'Temperature Converter — Kefiw',
    h1: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit, Kelvin, and Rankine.',
    keywords: ['temperature converter', 'celsius to fahrenheit', 'f to c'],
    intro: 'Convert temperature between every common scale instantly.',
    howTo: ['Enter a value.', 'Pick source and target scales.'],
    examples: [{ title: '100 °C', body: '= 212 °F = 373.15 K' }],
    faq: [{ q: 'Is Rankine supported?', a: 'Yes.' }],
    relatedIds: ['length-converter', 'weight-converter'],
    island: 'TemperatureConverter',
  },
  {
    id: 'area-converter',
    category: 'converters',
    slug: 'area-converter',
    title: 'Area Converter — Kefiw',
    h1: 'Area Converter',
    description: 'Convert between square meters, square feet, acres, hectares, and more.',
    keywords: ['area converter', 'sq ft to sq m', 'acres to hectares'],
    intro: 'Convert between every common unit of area.',
    howTo: ['Enter a value.', 'Pick source and target units.'],
    examples: [{ title: '1 acre', body: '= 4046.86 m² = 43,560 sq ft = 0.4047 hectares' }],
    faq: [{ q: 'Are US and Imperial acres the same?', a: 'Yes, within 0.0000004 — so yes for practical purposes.' }],
    relatedIds: ['length-converter', 'volume-converter'],
    island: 'AreaConverter',
  },
  {
    id: 'volume-converter',
    category: 'converters',
    slug: 'volume-converter',
    title: 'Volume Converter — Kefiw',
    h1: 'Volume Converter',
    description: 'Convert between liters, gallons, cubic meters, milliliters, cups, pints, and more.',
    keywords: ['volume converter', 'liters to gallons', 'ml to oz'],
    intro: 'Convert between every common unit of volume.',
    howTo: ['Enter a value.', 'Pick source and target units.'],
    examples: [{ title: '1 gallon (US)', body: '= 3.7854 liters = 128 fl oz' }],
    faq: [{ q: 'US or UK gallons?', a: 'Both, selectable.' }],
    relatedIds: ['weight-converter', 'length-converter'],
    island: 'VolumeConverter',
  },
  {
    id: 'speed-converter',
    category: 'converters',
    slug: 'speed-converter',
    title: 'Speed Converter — Kefiw',
    h1: 'Speed Converter',
    description: 'Convert between km/h, mph, m/s, knots, and feet per second.',
    keywords: ['speed converter', 'kph to mph', 'knots to mph'],
    intro: 'Convert between every common unit of speed.',
    howTo: ['Enter a value.', 'Pick source and target units.'],
    examples: [{ title: '100 km/h', body: '= 62.14 mph = 27.78 m/s = 53.996 knots' }],
    faq: [{ q: 'What is a knot?', a: 'One nautical mile per hour. 1 knot = 1.852 km/h.' }],
    relatedIds: ['length-converter', 'time-converter'],
    island: 'SpeedConverter',
  },
  {
    id: 'time-converter',
    category: 'converters',
    slug: 'time-converter',
    title: 'Time Converter — Kefiw',
    h1: 'Time Converter',
    description: 'Convert between seconds, minutes, hours, days, weeks, months, and years.',
    keywords: ['time converter', 'seconds to minutes', 'days to hours'],
    intro: 'Convert between every common unit of time duration.',
    howTo: ['Enter a value.', 'Pick source and target units.'],
    examples: [{ title: '1 day', body: '= 24 hours = 1,440 minutes = 86,400 seconds' }],
    faq: [{ q: 'Do months use 30 days?', a: 'Months use the average 30.4375 days. For exact month math use the date-difference calculator.' }],
    relatedIds: ['date-difference-calculator', 'age-calculator'],
    island: 'TimeConverter',
  },

  // ---------- CALCULATORS ----------
  {
    id: 'percentage-calculator',
    category: 'calculators',
    slug: 'percentage-calculator',
    title: 'Percentage Calculator — Kefiw',
    h1: 'Percentage Calculator',
    description: 'Calculate percentages: what is X% of Y, X is what % of Y, and % change.',
    keywords: ['percentage calculator', 'percent of', 'percent change'],
    intro: 'Every common percentage calculation in one place.',
    howTo: ['Pick a calculation mode.', 'Enter the values.'],
    examples: [
      { title: 'What is 15% of 80?', body: '12' },
      { title: '20 is what % of 50?', body: '40%' },
      { title: 'Change from 100 to 125', body: '+25%' },
    ],
    faq: [{ q: 'Does it handle negative change?', a: 'Yes, returns a negative percent.' }],
    relatedIds: ['age-calculator', 'date-difference-calculator'],
    island: 'PercentageCalculator',
  },
  {
    id: 'age-calculator',
    category: 'calculators',
    slug: 'age-calculator',
    title: 'Age Calculator — Kefiw',
    h1: 'Age Calculator',
    description: 'Calculate exact age in years, months, days, hours, minutes, and seconds.',
    keywords: ['age calculator', 'how old am I', 'age in days'],
    intro: 'Enter a birthdate and get your exact age down to the second.',
    howTo: ['Enter birthdate.', 'Optionally enter a target date (default is today).'],
    examples: [{ title: 'Born 1990-01-15 on 2026-04-17', body: '36 years, 3 months, 2 days' }],
    faq: [{ q: 'Does it account for leap years?', a: 'Yes.' }],
    relatedIds: ['date-difference-calculator', 'percentage-calculator'],
    island: 'AgeCalculator',
  },
  {
    id: 'date-difference-calculator',
    category: 'calculators',
    slug: 'date-difference-calculator',
    title: 'Date Difference Calculator — Kefiw',
    h1: 'Date Difference Calculator',
    description: 'Calculate the difference between two dates in years, months, weeks, days, hours, minutes, and seconds.',
    keywords: ['date difference', 'days between dates', 'date calculator'],
    intro: 'Pick two dates and get the difference in every useful unit.',
    howTo: ['Enter start date.', 'Enter end date.'],
    examples: [{ title: '2026-01-01 to 2026-04-17', body: '106 days, ≈ 15 weeks, ≈ 3 months 16 days' }],
    faq: [{ q: 'Does it count the end date?', a: 'The total-days figure counts full days between the two dates; it does not include the end date itself.' }],
    relatedIds: ['age-calculator', 'time-converter'],
    island: 'DateDifferenceCalculator',
  },

  // ---------- GAMES ----------
  {
    id: 'sudoku',
    category: 'games',
    slug: 'sudoku',
    title: 'Sudoku — Kefiw',
    h1: 'Sudoku',
    description: 'Play Sudoku in your browser. Easy, medium, hard, and expert boards. Auto-save progress.',
    keywords: ['sudoku', 'play sudoku online', 'sudoku game'],
    intro: 'Classic Sudoku in your browser. No ads mid-game, no login, progress saved locally.',
    howTo: [
      'Pick a difficulty.',
      'Tap a cell to select it, then tap a number (or press 1–9).',
      'Your progress is saved in this browser automatically.',
    ],
    examples: [{ title: 'Difficulties', body: 'Easy (~36 clues), Medium (~30), Hard (~26), Expert (~22).' }],
    faq: [
      { q: 'Can I take notes?', a: 'Pencil marks are planned for a future version.' },
      { q: 'How is the board generated?', a: 'Standard backtracking solver with uniqueness-guaranteed generator.' },
    ],
    relatedIds: ['daily-word'],
    island: 'Sudoku',
  },
  {
    id: 'daily-word',
    category: 'games',
    slug: 'daily-word',
    title: 'Daily Word Game — Kefiw',
    h1: 'Daily Word Game',
    description: 'A new word puzzle every day. Coming soon.',
    keywords: ['daily word game', 'word puzzle', 'word of the day'],
    intro: 'A fresh word puzzle every day, seeded so everyone plays the same board. Launching soon.',
    howTo: ['Come back when launched.'],
    examples: [{ title: 'Planned', body: 'Same-puzzle-per-day mechanic, shareable grid results.' }],
    faq: [{ q: 'When does it launch?', a: 'Soon. Bookmark this page.' }],
    relatedIds: ['sudoku'],
    comingSoon: true,
  },
];

export const TOOLS_BY_ID: Record<string, ToolConfig> = Object.fromEntries(
  TOOLS.map((t) => [t.id, t]),
);

export function toolsByCategory(cat: ToolCategory): ToolConfig[] {
  return TOOLS.filter((t) => t.category === cat);
}

export function toolHref(tool: ToolConfig): string {
  return `/${tool.category}/${tool.slug}/`;
}

export function relatedTools(tool: ToolConfig): ToolConfig[] {
  return tool.relatedIds.map((id) => TOOLS_BY_ID[id]).filter(Boolean);
}

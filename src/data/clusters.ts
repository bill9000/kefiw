import type { FaqItem } from './tools';
import type { ContentSection } from './content-pages';

export interface ClusterStartLink {
  href: string;
  label: string;
  note?: string;
}

export interface ClusterConfig {
  slug: string; // 'scrabble'
  section: ContentSection; // section the hub lives under
  hubSlug: string; // slug of the hub page under that section
  title: string;
  h1: string;
  subhead: string;
  intro: string;
  description: string;
  keywords: string[];
  featuredToolIds: string[];
  featuredListIds: string[]; // content-page IDs (kind: 'word-list')
  featuredSupportIds: string[]; // content-page IDs (kind: 'guide')
  startHere: ClusterStartLink[];
  faq: FaqItem[];
  relatedClusterSlugs: string[];
}

export const CLUSTERS: ClusterConfig[] = [
  // ---------- PHASE A ----------
  {
    slug: 'scrabble',
    section: 'word-tools',
    hubSlug: 'scrabble-word-help',
    title: 'Scrabble & Word Game Help — Kefiw',
    h1: 'Scrabble & Word Game Help',
    subhead: 'Find, score, and play the right word faster.',
    intro: 'The Scrabble cluster pulls together every tool and list that helps you find high-scoring plays, remember the short words that clear racks, and understand how the scoring actually works. Pick the tool or list that matches your situation.',
    description: 'Tools, lists, and strategy guides for Scrabble and Words With Friends — rack solvers, high-scoring word lists, Q-without-U words, and scoring rules.',
    keywords: ['scrabble help', 'scrabble word finder', 'scrabble strategy', 'words with friends help'],
    featuredToolIds: ['scrabble-helper', 'words-with-friends-helper', 'word-unscrambler', 'word-finder'],
    featuredListIds: [
      'cA-2-letter-words',
      'cA-3-letter-words',
      'cA-words-with-q-no-u',
      'cA-words-with-z',
      'cA-words-with-x',
      'cA-words-with-j',
      'cA-highest-scoring-words',
      'cA-short-high-scoring',
    ],
    featuredSupportIds: [
      'cS-best-2-letter-scrabble-words',
      'cS-best-3-letter-scrabble-words',
      'cS-best-bingo-words',
      'cS-how-to-find-bingo-plays',
      'cS-best-words-with-z',
      'cS-best-words-with-x',
      'cS-best-words-with-j',
      'cS-words-with-friends-scoring-differs',
      'cE-scrabble-q-without-u',
      'cE-scrabble-blanks',
      'cE-scrabble-scoring',
      'cE-scrabble-bingo-strategy',
      'cE-scrabble-2-letter-mastery',
    ],
    startHere: [
      { href: '/word-tools/scrabble-helper/', label: 'Open Scrabble Helper', note: 'Enter your rack — get every playable word ranked by score.' },
      { href: '/word-tools/2-letter-words/', label: 'Memorise the 2-letter words', note: 'The single highest-leverage list in Scrabble.' },
      { href: '/guides/scrabble-scoring/', label: 'Read the scoring rules', note: '5 minutes — fixes most casual-player mistakes.' },
    ],
    faq: [
      { q: 'Which helper should I use — Scrabble or Words With Friends?', a: 'Use the one that matches the game you are playing — tile values differ enough that the high-score play is often different.' },
      { q: 'Are all these words tournament-legal?', a: 'Lists use the public-domain ENABLE1 word list — close to TWL/SOWPODS but not identical. Confirm unusual words in your game\'s dictionary before challenging.' },
      { q: 'Where do I start if I\'m new?', a: 'Memorise the 2-letter list, learn how the blank tile works, then read the scoring guide. Those three unlock most intermediate plays.' },
    ],
    relatedClusterSlugs: ['unscramble', 'pattern', 'word-families'],
  },
  {
    slug: 'unscramble',
    section: 'word-tools',
    hubSlug: 'unscramble-and-anagram-help',
    title: 'Unscramble & Anagram Help — Kefiw',
    h1: 'Unscramble & Anagram Help',
    subhead: 'Turn a bag of letters into every real word it can make.',
    intro: 'Word unscramblers and anagram solvers both reshuffle letters into real words — the differences matter when you have blanks, need phrase anagrams, or want to filter by length. This cluster pulls together the right tool plus the practical tricks that make solving faster.',
    description: 'Word unscrambler, anagram solver, and the strategy tips that make both faster — when to use which, how blanks work, how to find the longest word.',
    keywords: ['word unscrambler help', 'anagram solver help', 'unscramble letters strategy'],
    featuredToolIds: ['word-unscrambler', 'anagram-solver', 'word-finder', 'scrabble-helper', 'words-with-friends-helper'],
    featuredListIds: [
      'cA-2-letter-words',
      'cA-3-letter-words',
      'cA-highest-scoring-words',
    ],
    featuredSupportIds: [
      'cS-how-to-use-a-word-unscrambler',
      'cS-how-to-solve-anagrams-faster',
      'cS-unscrambler-vs-anagram-solver',
      'cS-blank-tiles-word-tools',
      'cS-longest-word-from-letters',
      'cS-highest-scoring-from-letters',
      'cS-best-short-words-from-letters',
      'cS-search-by-word-length',
      'cS-board-letters-with-rack',
      'cS-common-anagram-patterns',
    ],
    startHere: [
      { href: '/word-tools/word-unscrambler/', label: 'Open Word Unscrambler', note: 'Paste letters — get every word ordered by length.' },
      { href: '/guides/how-to-use-a-word-unscrambler/', label: 'Read the 3-step approach' },
      { href: '/word-tools/anagram-solver/', label: 'Try Anagram Solver', note: 'Use when you need every exact-letter rearrangement.' },
    ],
    faq: [
      { q: 'Do unscrambler and anagram solver do the same thing?', a: 'Close — the unscrambler returns any valid word that can be built from subsets of your letters, anagram solvers focus on using all letters. Use both when you\'re stuck.' },
      { q: 'Can I use blanks?', a: 'Yes. Use ? as a wildcard in either tool. Each ? can be any letter.' },
    ],
    relatedClusterSlugs: ['scrabble', 'pattern', 'word-families'],
  },
  {
    slug: 'pattern',
    section: 'word-tools',
    hubSlug: 'pattern-and-puzzle-solvers',
    title: 'Pattern & Puzzle Solvers — Kefiw',
    h1: 'Pattern & Puzzle Solvers',
    subhead: 'Find words that match a shape: Wordle, crossword, hangman, or any pattern.',
    intro: 'Most word puzzles reduce to the same problem — find words that match a pattern of known letters and blanks. This cluster pulls together the pattern tools and the logic tricks that make Wordle, crosswords, and hangman easier.',
    description: 'Word finder by pattern, Wordle solver, crossword solver, and hangman solver — plus guides to wildcard search, green/yellow/gray logic, and finding words by position.',
    keywords: ['word pattern solver', 'wordle solver', 'crossword solver', 'hangman helper'],
    featuredToolIds: ['word-finder', 'wordle-solver', 'crossword-solver', 'hangman-solver', 'pattern-solver', '5-letter-word-finder', '6-letter-word-finder', '7-letter-word-finder'],
    featuredListIds: [
      'cA-2-letter-words',
      'cA-3-letter-words',
      'cA-words-with-double-letters',
    ],
    featuredSupportIds: [
      'cS-wildcard-patterns-word-finder',
      'cS-5-letter-word-finder-guide',
      'cS-wordle-green-yellow-gray',
      'cS-crossword-pattern-logic',
      'cS-hangman-pattern-logic',
      'cS-5-letter-opening-strategy',
      'cS-common-5-letter-starts',
      'cS-common-5-letter-endings',
      'cS-repeated-letter-patterns',
      'cS-pattern-search-mistakes',
    ],
    startHere: [
      { href: '/word-tools/word-finder/', label: 'Open Word Finder', note: 'Use ? as a wildcard for any unknown letter.' },
      { href: '/guides/wildcard-patterns-in-word-finder/', label: 'Learn wildcard patterns', note: 'The one trick that makes every pattern tool faster.' },
      { href: '/word-tools/wordle-solver/', label: 'Wordle solver', note: 'Encode greens, yellows, grays — narrow the answer to a handful.' },
    ],
    faq: [
      { q: 'What\'s the difference between Word Finder and the solvers?', a: 'Word Finder takes a pattern (like c?t) and returns matches. The solvers encode game-specific logic (Wordle colours, crossword grids) on top of pattern search.' },
      { q: 'Can I use these during a live puzzle?', a: 'Yes — the tools run in your browser, no server round-trips. Instant answers.' },
    ],
    relatedClusterSlugs: ['scrabble', 'unscramble', 'word-families'],
  },
  {
    slug: 'rhyme',
    section: 'word-tools',
    hubSlug: 'rhyme-and-syllable-help',
    title: 'Rhyme & Syllable Help — Kefiw',
    h1: 'Rhyme & Syllable Help',
    subhead: 'Find rhymes, count syllables, and structure your lines.',
    intro: 'Rhyme Finder, Syllable Counter, and Haiku Checker solve the mechanical parts of poetry and lyrics so you can focus on the writing. This cluster explains how each tool works and when to pick one over another.',
    description: 'Rhyme finder, syllable counter, and haiku 5-7-5 checker — with guides to perfect vs near rhyme, syllable counting rules, and writing to a meter.',
    keywords: ['rhyme finder help', 'syllable counter help', 'haiku checker'],
    featuredToolIds: ['rhyme-finder', 'syllable-counter', 'haiku-checker', 'word-counter'],
    featuredListIds: [],
    featuredSupportIds: [
      'cE-rhyme-perfect-vs-near',
      'cE-syllables-counting-rules',
      'cS-how-to-use-rhyme-finder',
      'cS-count-syllables-in-a-line',
      'cS-how-to-write-a-haiku',
      'cS-why-words-look-like-rhymes',
    ],
    startHere: [
      { href: '/word-tools/rhyme-finder/', label: 'Open Rhyme Finder', note: 'Type a word — get perfect and near rhymes split out.' },
      { href: '/word-tools/syllable-counter/', label: 'Count syllables', note: 'Check a line before you commit to it.' },
      { href: '/word-tools/haiku-checker/', label: 'Check a haiku', note: 'Paste three lines — it verifies the 5-7-5 structure.' },
    ],
    faq: [
      { q: 'Is the rhyme finder phonetic?', a: 'It uses a combination of ending-letter patterns and a pronunciation dictionary — near rhymes fall back to pattern matching when the word isn\'t in the dictionary.' },
      { q: 'How accurate is the syllable counter?', a: 'About 95% on common English words. Edge cases (unusual names, loanwords) may need a manual check.' },
    ],
    relatedClusterSlugs: ['word-families', 'text-cleanup'],
  },

  // ---------- PHASE B ----------
  {
    slug: 'word-families',
    section: 'word-tools',
    hubSlug: 'word-families-and-patterns',
    title: 'Word Families & Patterns — Kefiw',
    h1: 'Word Families & Patterns',
    subhead: 'Find words by prefix, suffix, or letter shape.',
    intro: 'English words cluster into families by how they start, how they end, and which letters repeat. This cluster groups the prefix, suffix, and letter-shape lists alongside the interactive finders.',
    description: 'Prefix and suffix word lists (un-, re-, pre-, -ing, -ed, -tion, -ness, -able), plus double-letter, no-vowel, and all-vowel word pages.',
    keywords: ['word prefixes', 'word suffixes', 'word families', 'double-letter words'],
    featuredToolIds: ['words-starting-with', 'words-ending-with', 'words-containing', 'word-finder'],
    featuredListIds: [
      'cA-words-starting-with-un',
      'cA-words-starting-with-re',
      'cA-words-starting-with-pre',
      'cA-words-with-double-letters',
      'cA-words-with-no-vowels',
      'cA-words-with-all-vowels',
    ],
    featuredSupportIds: [
      'cS-what-prefixes-do',
      'cS-what-suffixes-do',
      'cS-common-english-endings',
      'cS-common-english-beginnings',
    ],
    startHere: [
      { href: '/word-tools/words-starting-with/', label: 'Words starting with…', note: 'Pick any prefix; get every match.' },
      { href: '/word-tools/words-ending-with/', label: 'Words ending with…', note: 'Same idea, for suffixes.' },
      { href: '/guides/what-prefixes-do/', label: 'How prefixes change meaning' },
    ],
    faq: [
      { q: 'Do prefixes always keep their meaning?', a: 'Mostly, but not always — "disease" doesn\'t mean "un-ease" in the modern sense. Treat the prefix list as a strong hint, not a rule.' },
      { q: 'Are these lists Scrabble-legal?', a: 'Drawn from the ENABLE1 list — close to TWL/SOWPODS but not identical. See the Scrabble hub for tournament-dictionary caveats.' },
    ],
    relatedClusterSlugs: ['scrabble', 'pattern', 'unscramble'],
  },
  {
    slug: 'text-cleanup',
    section: 'word-tools',
    hubSlug: 'text-cleanup-tools',
    title: 'Text Cleanup Tools — Kefiw',
    h1: 'Text Cleanup Tools',
    subhead: 'Count, sort, dedupe, and convert text fast.',
    intro: 'Everyday text chores: counting words, removing duplicate lines, converting case, reversing strings, sorting lists. This cluster collects the small utilities and explains when each is the right call.',
    description: 'Word counter, letter counter, case converter, reverse text, sort lines, remove duplicate lines, and related text utilities — plus guides for common cleanup workflows.',
    keywords: ['text cleanup tools', 'word counter', 'sort lines', 'remove duplicate lines'],
    featuredToolIds: ['word-counter', 'letter-counter', 'case-converter', 'reverse-text', 'sort-lines', 'remove-duplicate-lines', 'reading-time-calculator'],
    featuredListIds: [],
    featuredSupportIds: [
      'cS-remove-duplicate-lines-when',
      'cS-sort-lines-when',
      'cS-word-counter-vs-letter-counter',
      'cS-text-cleanup-workflows',
    ],
    startHere: [
      { href: '/word-tools/word-counter/', label: 'Word Counter', note: 'Instant word, character, and sentence counts.' },
      { href: '/word-tools/remove-duplicate-lines/', label: 'Remove duplicate lines', note: 'Paste a list; dupes go away.' },
      { href: '/word-tools/case-converter/', label: 'Case converter', note: 'UPPER, lower, Title, camelCase — one click.' },
    ],
    faq: [
      { q: 'Does any of this leave my browser?', a: 'No. Every text tool here runs locally — paste sensitive text safely.' },
      { q: 'Is there undo?', a: 'Tools are transforms — your input stays visible. Copy the output, keep the input around if you need to revert.' },
    ],
    relatedClusterSlugs: ['rhyme', 'everyday-calculators'],
  },
  {
    slug: 'everyday-calculators',
    section: 'calculators',
    hubSlug: 'everyday-calculators',
    title: 'Everyday Calculators — Kefiw',
    h1: 'Everyday Calculators',
    subhead: 'Percentages, dates, hours, averages — the quick ones.',
    intro: 'The calculators you reach for most: percentages, age and date difference, hours worked, simple averages. This cluster bundles them with short explainers for the common gotchas (e.g. why percent change isn\'t symmetric).',
    description: 'Percentage calculator, age calculator, date difference, average, and hours — plus short guides to the common mistakes and mental-math shortcuts.',
    keywords: ['percentage calculator', 'age calculator', 'date difference', 'hours calculator'],
    featuredToolIds: ['percentage-calculator', 'percent-of-calculator', 'percent-change-calculator', 'age-calculator', 'age-on-date-calculator', 'date-difference-calculator', 'hours-calculator', 'average-calculator'],
    featuredListIds: [],
    featuredSupportIds: [
      'cS-percentage-increase-how',
      'cS-percent-of-number-how',
      'cS-percent-mental-math',
      'cS-age-on-date-how',
      'cS-days-between-dates-how',
    ],
    startHere: [
      { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator', note: 'Three modes: of, is-what-%, change.' },
      { href: '/calculators/age-calculator/', label: 'Age Calculator' },
      { href: '/calculators/date-difference-calculator/', label: 'Date difference' },
    ],
    faq: [
      { q: 'Why isn\'t percent change symmetric?', a: '100 → 125 is +25%, but 125 → 100 is −20%. Percent change divides by the starting value, so the base changes when you reverse direction.' },
      { q: 'Is 10% off, then 10% off, the same as 20% off?', a: 'No. Two 10% discounts compound to 19% off. Stacked discounts are always worth less than the simple sum.' },
    ],
    relatedClusterSlugs: ['shopping', 'text-cleanup'],
  },

  // ---------- PHASE C ----------
  {
    slug: 'shopping',
    section: 'calculators',
    hubSlug: 'saving-and-spending-tools',
    title: 'Saving & Spending Calculators — Kefiw',
    h1: 'Saving & Spending Calculators',
    subhead: 'Discounts, tips, margins, break-even — the money-light tools.',
    intro: 'Calculators for small decisions: discount stacking, tip splits, markup vs margin, break-even. This cluster bundles them with short explainers for the traps (like stacked discounts compounding, or margin vs markup being different).',
    description: 'Discount calculator, tip calculator, markup/margin calculator, and break-even calculator, with short guides to stacked discounts, tip etiquette, and margin math.',
    keywords: ['discount calculator', 'tip calculator', 'break-even calculator', 'margin calculator'],
    featuredToolIds: ['horizon-point', 'runway-zero', 'shock-survival', 'crossover-calculator', 'leap-date', 'hire-vs-automate', 'value-floor', 'cloud-exit', 'minimum-viable-rate', 'sp500-check', 'tech-debt-interest', 'revenue-per-head', 'calorie-optimizer', 'gig-net-floor', 'bill-triage', 'vice-to-value', 'time-to-human', 'dopamine-minimum', 'trap-detector', 'burnout-monitor', 'bio-fuel', 'default-optimizer', 'asset-liquidator', 'social-latency', 'vimes-utility', 'time-poverty', 'liquid-value', 'stability-coefficient', 'mortgage-calculator', 'mortgage-extra-payment-calculator', 'savings-goal-calculator', 'discount-calculator', 'tip-calculator', 'markup-calculator', 'margin-calculator', 'markup-margin-calculator', 'break-even-calculator', 'percentage-calculator'],
    featuredListIds: [],
    featuredSupportIds: [
      'cS-horizon-point-basics',
      'cS-runway-zero-basics',
      'cS-shock-survival-basics',
      'cS-crossover-basics',
      'cS-leap-date-basics',
      'cS-hire-vs-automate-basics',
      'cS-value-floor-basics',
      'cS-cloud-exit-basics',
      'cS-minimum-viable-rate-basics',
      'cS-sp500-check-basics',
      'cS-tech-debt-interest-basics',
      'cS-revenue-per-head-basics',
      'cS-calorie-optimizer-basics',
      'cS-gig-net-floor-basics',
      'cS-bill-triage-basics',
      'cS-vice-to-value-basics',
      'cS-time-to-human-basics',
      'cS-dopamine-minimum-basics',
      'cS-trap-detector-basics',
      'cS-burnout-monitor-basics',
      'cS-bio-fuel-basics',
      'cS-default-optimizer-basics',
      'cS-asset-liquidator-basics',
      'cS-social-latency-basics',
      'cS-vimes-utility-basics',
      'cS-time-poverty-basics',
      'cS-liquid-value-basics',
      'cS-stability-coefficient-basics',
      'cS-how-discounts-stack',
      'cS-compare-two-discounts',
      'cS-when-to-tip',
      'cS-markup-vs-margin',
      'cS-break-even-basics',
    ],
    startHere: [
      { href: '/calculators/discount-calculator/', label: 'Discount calculator' },
      { href: '/calculators/tip-calculator/', label: 'Tip calculator' },
      { href: '/calculators/markup-margin-calculator/', label: 'Markup & margin' },
    ],
    faq: [
      { q: 'Do discounts stack linearly?', a: 'No — two 20%-off coupons give 36% off, not 40%. Each discount applies to the already-reduced price.' },
      { q: 'Is markup the same as margin?', a: 'No. Markup divides profit by cost; margin divides profit by price. Same profit, different denominator — so margin is always smaller.' },
    ],
    relatedClusterSlugs: ['everyday-calculators', 'units'],
  },
  {
    slug: 'units',
    section: 'converters',
    hubSlug: 'unit-conversion-tools',
    title: 'Unit Conversion Tools — Kefiw',
    h1: 'Unit Conversion Tools',
    subhead: 'Length, weight, temperature, volume, area, speed, time.',
    intro: 'The standard conversion toolbox with a clean mobile layout. Each tool below supports both directions and a full set of common units.',
    description: 'Unit converters for length, weight, temperature, volume, area, speed, and time — plus quick-reference guides for the most common conversions.',
    keywords: ['unit converters', 'length converter', 'weight converter', 'temperature converter'],
    featuredToolIds: ['length-converter', 'weight-converter', 'temperature-converter', 'volume-converter', 'area-converter', 'speed-converter', 'time-converter'],
    featuredListIds: [],
    featuredSupportIds: [
      'cS-common-length-conversions',
      'cS-fahrenheit-vs-celsius',
      'cS-liters-vs-gallons',
      'cS-mph-vs-kmh',
      'cS-metric-vs-imperial',
    ],
    startHere: [
      { href: '/converters/length-converter/', label: 'Length converter' },
      { href: '/converters/temperature-converter/', label: 'Temperature' },
      { href: '/converters/weight-converter/', label: 'Weight' },
    ],
    faq: [
      { q: 'Do these support fractional inputs?', a: 'Yes. Enter decimals or fractions (as decimals) and convert freely.' },
      { q: 'What\'s the rounding policy?', a: 'Results are displayed to 6 significant figures by default — enough precision for everyday use without noise.' },
    ],
    relatedClusterSlugs: ['everyday-calculators', 'shopping'],
  },
  {
    slug: 'daily',
    section: 'games',
    hubSlug: 'daily-challenges',
    title: 'Daily Challenges — Kefiw',
    h1: 'Daily Challenges',
    subhead: 'A new puzzle every day. Come back, keep your streak.',
    intro: 'Daily word and anagram puzzles refresh at 00:00 UTC. Sudoku difficulty rooms keep a separate saved board each. This cluster groups the repeat-visit pages and the strategy tips that help your scores over time.',
    description: 'Daily word, daily anagram, daily unscramble, and Sudoku difficulty rooms — plus short strategy guides for improving over time.',
    keywords: ['daily word game', 'daily anagram', 'sudoku difficulty', 'daily puzzle'],
    featuredToolIds: ['vibematch', 'vibecircuit', 'vibecrypt', 'vibehex', 'vibecontext', 'vibepath', 'vibecalc', 'vibepair', 'vibetwist', 'vibelink', 'vibeglobe', 'vibecrosser', 'vibedrop', 'vibeshift', 'vibecipher', 'daily-word', 'daily-anagram', 'daily-unscramble', 'sudoku', 'sudoku-easy', 'sudoku-medium', 'sudoku-hard', 'sudoku-expert'],
    featuredListIds: [],
    featuredSupportIds: [
      'cS-daily-word-how',
      'cS-daily-streak-tips',
      'cS-sudoku-difficulty-explained',
      'cS-beginner-sudoku-strategy',
    ],
    startHere: [
      { href: '/games/daily-word/', label: "Today's daily word", note: '5-letter anagram — new each day at 00:00 UTC.' },
      { href: '/games/sudoku-easy/', label: 'Sudoku (easy)', note: 'Separate board per difficulty.' },
      { href: '/games/daily-unscramble/', label: 'Daily unscramble', note: '7-letter version for harder daily play.' },
    ],
    faq: [
      { q: 'When does the daily puzzle reset?', a: '00:00 UTC. Everyone worldwide gets the same puzzle on the same date.' },
      { q: 'Do streaks survive across browsers?', a: 'Progress saves in the current browser only. Switching browsers or clearing site data starts over.' },
    ],
    relatedClusterSlugs: ['pattern', 'scrabble'],
  },

  // ---------- HEALTH ----------
  {
    slug: 'bio-maintenance',
    section: 'health',
    hubSlug: 'biological-maintenance',
    title: 'Biological Maintenance — Kefiw',
    h1: 'Biological Maintenance',
    subhead: 'Fuel floor, decay curves, sleep windows, red-flag routing.',
    intro: 'Four instruments for the baseline upkeep of a biological chassis: your resting energy cost, the pharmacokinetics of caffeine and alcohol, the 90-minute sleep cycle, and the red-flag router that decides ER vs urgent care vs home.',
    description: 'BMR/TDEE calculator, caffeine and alcohol half-life plot, 90-minute sleep-cycle timing, and a symptom-based triage router.',
    keywords: ['BMR calculator', 'TDEE calculator', 'caffeine half life', 'sleep cycle calculator', 'medical triage'],
    featuredToolIds: ['metabolic-floor', 'substance-decay', 'rem-sync', 'medical-triage'],
    featuredListIds: [],
    featuredSupportIds: [],
    startHere: [
      { href: '/health/metabolic-floor/', label: 'Metabolic Floor', note: 'Your BMR and TDEE — the starting point for every other calorie target.' },
      { href: '/health/rem-sync/', label: 'REM-Sync', note: 'Optimal bedtime or wake-time windows.' },
    ],
    faq: [
      { q: 'How accurate is BMR vs resting metabolic rate?', a: 'Mifflin-St Jeor is ±10% vs indirect calorimetry for a healthy adult. Lab RMR testing narrows the band if precision matters.' },
      { q: 'Is triage a medical decision?', a: 'No — it is a red-flag heuristic. When unsure, call the nurse line or emergency services. False-negative cost is orders of magnitude higher than false-positive cost.' },
    ],
    relatedClusterSlugs: ['body-composition', 'structural-output'],
  },
  {
    slug: 'body-composition',
    section: 'health',
    hubSlug: 'body-composition',
    title: 'Body Composition & Health Monitoring — Kefiw',
    h1: 'Body Composition & Health',
    subhead: 'Impairment math, chassis density, coolant load, cessation ladder.',
    intro: 'Four instruments for tracking the current physical state: estimated BAC after a drink count, body-fat % from tape measurements, daily hydration requirement, and the nicotine decay timeline after quitting.',
    description: 'Widmark BAC calculator, US Navy body-fat circumference method, hydration requirement by mass and activity, and cotinine cessation timeline.',
    keywords: ['BAC calculator', 'body fat calculator', 'hydration calculator', 'quit smoking timeline'],
    featuredToolIds: ['impairment-bac', 'structural-density', 'hydraulic-integrity', 'cessation-ladder'],
    featuredListIds: [],
    featuredSupportIds: [],
    startHere: [
      { href: '/health/impairment-bac/', label: 'Impairment Coefficient', note: 'Estimated BAC — not legal evidence.' },
      { href: '/health/hydraulic-integrity/', label: 'Hydraulic Integrity', note: 'Coolant load vs current intake.' },
    ],
    faq: [
      { q: 'Is BAC estimate legally defensible?', a: 'No. Widmark has documented ±30% error and is not admissible anywhere. Only breathalyzer or blood draw is evidence.' },
      { q: 'Why US Navy body-fat, not BMI?', a: 'BMI cannot tell muscle from fat. Circumference methods validate ±3-4% against DEXA — better for athletic or lean populations.' },
    ],
    relatedClusterSlugs: ['bio-maintenance', 'bio-logistics'],
  },
  {
    slug: 'structural-output',
    section: 'health',
    hubSlug: 'structural-output',
    title: 'Structural Output & Training Load — Kefiw',
    h1: 'Structural Output',
    subhead: '1RM, relative power, heart-rate zones, kinetic expenditure.',
    intro: 'Four instruments for training load and output: estimated one-rep maximum, Wilks relative-strength coefficient, Karvonen heart-rate zones, and MET-based calorie burn.',
    description: 'Brzycki 1RM, Wilks powerlifting coefficient, Karvonen training zones, and MET calorie expenditure from the Compendium of Physical Activities.',
    keywords: ['1RM calculator', 'Wilks calculator', 'heart rate zones', 'MET calculator'],
    featuredToolIds: ['max-load-capacity', 'strength-efficiency', 'heart-rate-zones', 'kinetic-expenditure'],
    featuredListIds: [],
    featuredSupportIds: [],
    startHere: [
      { href: '/health/max-load-capacity/', label: 'Max Load Capacity', note: 'Brzycki 1RM plus training zones.' },
      { href: '/health/heart-rate-zones/', label: 'Heart Rate Zones', note: 'Karvonen zones anchored to your resting HR.' },
    ],
    faq: [
      { q: 'Why Brzycki and not Epley?', a: 'Brzycki is most accurate in the 1–10 rep range; Epley holds up better at 10+. For 3–5 rep sets — the ergonomic sweet spot — Brzycki wins.' },
      { q: 'Why Karvonen over %HRmax?', a: 'Karvonen incorporates resting HR — a fit person\'s reserve is higher, so zones shift up. Better personalisation than flat %HRmax.' },
    ],
    relatedClusterSlugs: ['bio-logistics', 'bio-maintenance'],
  },
  {
    slug: 'bio-logistics',
    section: 'health',
    hubSlug: 'bio-chemical-logistics',
    title: 'Bio-Chemical Logistics — Kefiw',
    h1: 'Bio-Chemical Logistics',
    subhead: 'Fuel split, visceral incline, electrolyte loss, MPS bolus.',
    intro: 'Four instruments for the logistics of fuel and fluid: macronutrient split by goal, waist-to-height cardiometabolic risk flag, electrolyte loss through sweat, and the per-meal protein bolus that maximises muscle protein synthesis.',
    description: 'Macro calculator with protein floor, WHtR cardiometabolic risk, sweat-loss electrolyte replacement, and per-meal protein bolus for MPS.',
    keywords: ['macro calculator', 'waist to height ratio', 'electrolyte calculator', 'protein bolus'],
    featuredToolIds: ['fuel-partition', 'metabolic-incline', 'ion-balance', 'anabolic-trigger'],
    featuredListIds: [],
    featuredSupportIds: [],
    startHere: [
      { href: '/health/fuel-partition/', label: 'Fuel Partitioning', note: 'Daily macros by cut/maintain/bulk goal.' },
      { href: '/health/anabolic-trigger/', label: 'Anabolic Trigger', note: 'Per-meal bolus that saturates MPS.' },
    ],
    faq: [
      { q: 'Why waist-to-height and not BMI?', a: 'WHtR predicts visceral fat and cardiovascular risk across all populations (Ashwell 2012) — BMI fails for lean or muscular bodies.' },
      { q: 'Is 2 g/kg protein dangerous?', a: 'No evidence of renal harm in healthy adults below 3.5 g/kg. The daily range 1.6–2.2 g/kg is the current evidence-based target.' },
    ],
    relatedClusterSlugs: ['structural-output', 'body-composition'],
  },
  {
    slug: 'environmental-stressors',
    section: 'health',
    hubSlug: 'environmental-stressors',
    title: 'Environmental Stressors — Kefiw',
    h1: 'Environmental Stressors',
    subhead: 'UV, CO₂, heat, cold — four atmospheric loads that degrade performance.',
    intro: 'Four instruments for the external loads on a human chassis: UV burn time by skin type, indoor CO₂ vs cognitive performance, WBGT heat-stress index, and required clothing insulation in clo units.',
    description: 'UV burn-time by Fitzpatrick type and SPF, CO₂ cognitive-decline mapping, WBGT heat-stress index, and clothing clo calculator.',
    keywords: ['UV index calculator', 'CO2 calculator', 'WBGT calculator', 'clo calculator'],
    featuredToolIds: ['uv-exposure', 'co2-cognitive-tax', 'thermal-failure', 'insulation-logic'],
    featuredListIds: [],
    featuredSupportIds: [],
    startHere: [
      { href: '/health/thermal-failure/', label: 'Thermal Failure', note: 'WBGT — heat-stress threshold decision.' },
      { href: '/health/co2-cognitive-tax/', label: 'CO₂ Cognitive Tax', note: 'Indoor air and decision-making performance.' },
    ],
    faq: [
      { q: 'Why WBGT instead of heat index?', a: 'WBGT adds radiant load (globe temp), so it handles direct sun. Heat index is dry + humidity only. WBGT is the OSHA and ACGIH standard.' },
      { q: 'What is wet-bulb 35°C?', a: 'The absolute thermoregulatory limit — evaporation can no longer cool a healthy adult. Fatal within hours regardless of hydration or fitness.' },
    ],
    relatedClusterSlugs: ['bio-maintenance', 'structural-output'],
  },
  // ---------- LOGIC ----------
  {
    slug: 'cognitive-throughput',
    section: 'logic',
    hubSlug: 'cognitive-throughput',
    title: 'Cognitive Throughput — Kefiw',
    h1: 'Cognitive Throughput',
    subhead: 'System monitor for the brain — the four meters that govern what you can actually process in a day.',
    intro: 'Four deterministic instruments for the CPU behind your life: signal-to-noise on intake efficiency, task-switching tax on concurrent projects, decision-fatigue battery on willpower drain, and the focus-decay curve for deep work.',
    description: 'Signal-to-noise ratio, task-switching tax, decision fatigue, and deep-work focus decay — four closed-form calculators for the brain\'s operating layer.',
    keywords: ['cognitive throughput', 'decision fatigue calculator', 'task switching tax', 'focus horizon', 'attention management'],
    featuredToolIds: ['signal-to-noise', 'task-switching', 'decision-fatigue', 'focus-horizon'],
    featuredListIds: [],
    featuredSupportIds: [],
    startHere: [
      { href: '/logic/task-switching/', label: 'Task Switching Tax', note: 'The biggest hidden overhead in a knowledge-work day.' },
      { href: '/logic/focus-horizon/', label: 'Focus Horizon', note: 'How long you have left before quality collapses.' },
    ],
    faq: [
      { q: 'Are these scientifically validated?', a: 'They are deterministic models of well-documented heuristics. The shapes (geometric decay for switching, exponential for focus, linear drain for willpower) match research patterns; the exact coefficients are rules of thumb. Use as signal, not measurement.' },
      { q: 'Why an industrial aesthetic?', a: 'These tools model the machine layer of cognition — compute, overhead, bandwidth, throughput. A CPU-monitor visual is the right metaphor. Pastel wellness UIs hide the tradeoffs.' },
    ],
    relatedClusterSlugs: ['logistical-mobility'],
  },
  {
    slug: 'logistical-mobility',
    section: 'logic',
    hubSlug: 'logistical-mobility',
    title: 'Logistical Mobility & Lifecycle Logic — Kefiw',
    h1: 'Logistical Mobility & Lifecycle Logic',
    subhead: 'The big life-structure decisions — move, retrain, cut, reconnect — run through closed-form math.',
    intro: 'When to relocate (break-even on moving cost), when to retrain (payback including opportunity cost), when to purge subscriptions (lifetime cost compounds), and which relationships actually pay out (credit vs debit on a visual balance).',
    description: 'Geographic arbitrage, upskill ROI, subscription purge, and social utility — closed-form math for the major life-structure decisions.',
    keywords: ['geographic arbitrage', 'upskill ROI', 'subscription purge', 'social utility calculator', 'life decision calculators'],
    featuredToolIds: ['geo-arbitrage', 'upskill-payback', 'leak-detection', 'connection-check'],
    featuredListIds: [],
    featuredSupportIds: [],
    startHere: [
      { href: '/logic/leak-detection/', label: 'Subscription Purge', note: 'Fastest ROI — every cut pipes directly into Runway Zero.' },
      { href: '/logic/geo-arbitrage/', label: 'Geographic Arbitrage', note: 'Biggest multi-year lever when the math works.' },
    ],
    faq: [
      { q: 'Why pair these four tools?', a: 'Each addresses a different axis of life logistics — geography, skill, spending, people. Together they cover the big "am I in the right configuration" decisions without overlapping scopes.' },
      { q: 'How does this connect to the Decisions suite?', a: 'Subscription Purge pipes its monthly recovery into Runway Zero directly — cutting $50/mo extends your bankruptcy date by weeks. Upskill ROI complements Minimum Viable Rate. Geo Arbitrage pairs with Runway Zero for the "where should I live" calculation.' },
    ],
    relatedClusterSlugs: ['cognitive-throughput'],
  },
];

export const CLUSTERS_BY_SLUG: Record<string, ClusterConfig> = Object.fromEntries(
  CLUSTERS.map((c) => [c.slug, c]),
);

export function clusterHref(c: ClusterConfig): string {
  return `/${c.section}/${c.hubSlug}/`;
}

export function clustersBySection(section: ContentSection): ClusterConfig[] {
  return CLUSTERS.filter((c) => c.section === section);
}

function assertClusterShape(): void {
  const seenSlugs = new Set<string>();
  const seenHubs = new Set<string>();
  for (const c of CLUSTERS) {
    if (seenSlugs.has(c.slug)) throw new Error(`[clusters] duplicate cluster slug: ${c.slug}`);
    seenSlugs.add(c.slug);
    const hubKey = `${c.section}/${c.hubSlug}`;
    if (seenHubs.has(hubKey)) throw new Error(`[clusters] duplicate hub path: ${hubKey}`);
    seenHubs.add(hubKey);
    for (const rel of c.relatedClusterSlugs) {
      if (!CLUSTERS.some((x) => x.slug === rel)) {
        throw new Error(`[clusters] ${c.slug} relates to unknown cluster: ${rel}`);
      }
    }
  }
}

assertClusterShape();

import type { ContentPageConfig } from '../content-pages';

export const CLUSTER_E: ContentPageConfig[] = [
  {
    id: 'cE-scrabble-q-without-u',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'scrabble-q-without-u',
    guideCategory: 'Scrabble',
    title: 'Q Without U in Scrabble — Every Word Explained — Kefiw',
    h1: 'Q Without U in Scrabble',
    subhead: 'The complete list of Q-words that do not need a U, and why they exist',
    description: 'Why some Q-words do not need a U, which ones to memorise, and how to use them for emergency Scrabble plays.',
    keywords: ['q without u scrabble', 'q no u words', 'scrabble q words no u', 'qi qat faqir'],
    intro: 'Drawing a Q without a U is the classic Scrabble nightmare. This guide lists every legal Q-without-U word and explains why they exist.',
    faq: [
      { q: 'Is QI really a word?', a: 'Yes. QI is the Chinese concept of life energy and has been legal in Scrabble for decades. It is one of the highest-scoring 2-letter plays.' },
      { q: 'What about QATS and QOPHS?', a: 'Both are valid plurals of QAT (a plant chewed as a stimulant) and QOPH (a Hebrew letter).' },
      { q: 'Can I keep waiting for a U?', a: 'Only up to a point. If you are holding Q for more than two or three turns with no U in the bag, play a Q-no-U word to clear the tile.' },
    ],
    relatedIds: ['scrabble-helper', 'words-with-friends-helper'],
    relatedLinks: [
      { href: '/word-tools/words-with-q-no-u/', label: 'Full list: words with Q (no U)' },
      { href: '/word-tools/2-letter-words/', label: '2-Letter Words' },
    ],
    primaryCta: { href: '/word-tools/words-with-q-no-u/', label: 'See the full list' },
    secondaryCtas: [{ href: '/word-tools/scrabble-helper/', label: 'Scrabble Helper' }],
    bodyHtml: `
      <h2>Why do some Q-words not need a U?</h2>
      <p>English borrowed most of its Q-words from Latin and French, where Q is almost always followed by U. But a handful of Q-words came from other languages — Hebrew (<strong>QOPH</strong>), Arabic (<strong>QADI</strong>, <strong>FAQIR</strong>, <strong>QANAT</strong>), and Chinese (<strong>QI</strong>). In those languages Q serves as a standalone or pre-vowel consonant, and the words were adopted into English without a following U.</p>

      <h2>The must-memorise short ones</h2>
      <p>For Scrabble emergencies, learn these first:</p>
      <ul>
        <li><strong>QI</strong> — vital life energy; 11 points for 2 letters.</li>
        <li><strong>QAT</strong> — a plant whose leaves are chewed as a stimulant.</li>
        <li><strong>QIS</strong> — plural of QI.</li>
        <li><strong>QADI</strong> — a Muslim judge.</li>
        <li><strong>QOPH</strong> — the 19th letter of the Hebrew alphabet.</li>
      </ul>

      <h2>The longer ones worth knowing</h2>
      <ul>
        <li><strong>FAQIR</strong> (and FAQIRS) — an alternate spelling of fakir.</li>
        <li><strong>SHEQEL</strong> (and SHEQELS) — a unit of Israeli currency.</li>
        <li><strong>QANAT</strong> (and QANATS) — an underground water channel.</li>
        <li><strong>QINTAR</strong> — a monetary subdivision (note: Q followed by I, not U).</li>
      </ul>

      <h2>Using them in play</h2>
      <p>Q is worth 10 points in Scrabble. Played on a double-letter or triple-letter square, a 2-letter QI scores 21 or 31 base — before any word-multiplier. That is often a better return than waiting turns for a U.</p>

      <h2>Why this matters in Words With Friends</h2>
      <p>Words With Friends uses a slightly different dictionary, but the major Q-no-U words (QI, QAT, QADI, FAQIR, QOPH) are valid in both. Always confirm with the <a href="/word-tools/words-with-friends-helper/">Words With Friends Helper</a> before committing a play.</p>
    `,
  },

  {
    id: 'cE-scrabble-blanks',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'scrabble-blanks',
    guideCategory: 'Scrabble',
    title: 'How to Use Scrabble Blanks — Strategy Guide — Kefiw',
    h1: 'How to Use Scrabble Blanks',
    subhead: 'When to hold, when to play, and how to maximise the zero-point tile',
    description: 'Blank tiles score zero but can represent any letter. This guide covers when to play them for bingos, when to hold, and how to find the highest-value blank play.',
    keywords: ['scrabble blanks', 'blank tile strategy', 'scrabble blank tiles', 'how to use blanks'],
    intro: 'Blanks are the most valuable tiles in Scrabble despite scoring zero points themselves. This guide explains the strategy around them.',
    faq: [
      { q: 'How much is a blank worth?', a: 'Zero points on its own — but it often enables 50-100 point plays via bingos and word-multipliers.' },
      { q: 'Should I always hold blanks for a bingo?', a: 'Usually yes — the 50-point bonus for playing all 7 tiles is nearly always worth one or two turns of patience.' },
      { q: 'Can a blank be challenged?', a: 'No. Blanks are legally any letter the player declares at time of placement.' },
    ],
    relatedIds: ['scrabble-helper', 'word-finder', 'anagram-solver'],
    primaryCta: { href: '/word-tools/scrabble-helper/', label: 'Scrabble Helper' },
    bodyHtml: `
      <h2>The core rule</h2>
      <p>Every Scrabble game has exactly 2 blank tiles. When you play a blank, you declare which letter it represents, and that choice is locked for the rest of the game. The blank scores zero points regardless of which letter it represents.</p>

      <h2>When to hold a blank</h2>
      <p>The 50-point bingo bonus for using all 7 tiles in a single turn is worth 4-5 ordinary plays. If you have a blank, the odds of finding a bingo on any given turn go up dramatically — so holding the blank for one or two turns is usually correct.</p>
      <p>Signs to hold: your rack has 5 or 6 common letters (RSTLNE-style) plus the blank; you expect to draw more vowels; the board has an open line where a 7-letter play can land.</p>

      <h2>When to play a blank immediately</h2>
      <ul>
        <li>You have a guaranteed 40+ point play using Q, Z, or X on a triple-letter or triple-word.</li>
        <li>You are more than 50 points behind with fewer than 10 tiles in the bag.</li>
        <li>You have 3 or more turns of failed bingo hunts already.</li>
      </ul>

      <h2>Finding the best blank play</h2>
      <p>The Kefiw <a href="/word-tools/scrabble-helper/">Scrabble Helper</a> accepts ? as a blank on your rack and returns the highest-scoring play. Enter your actual tiles plus a ? for each blank — the helper evaluates every valid placement.</p>

      <h2>Common mistakes</h2>
      <ol>
        <li>Playing a blank on a 2-letter word for 5 points — almost always a waste.</li>
        <li>Using a blank to represent a high-value letter (J, Q, X, Z). The value is on the tile, not on the blank.</li>
        <li>Playing both blanks early for small scores and leaving yourself with no bingo potential.</li>
      </ol>
    `,
  },

  {
    id: 'cE-scrabble-scoring',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'scrabble-scoring',
    guideCategory: 'Scrabble',
    title: 'Scrabble Scoring Explained — Tile Values, Bonus Squares, Bingos — Kefiw',
    h1: 'Scrabble Scoring Explained',
    subhead: 'Tile values, bonus squares, multipliers, and the bingo bonus',
    description: 'How Scrabble scoring works, including tile values, double/triple letter squares, double/triple word squares, and the 50-point bingo bonus.',
    keywords: ['scrabble scoring', 'scrabble tile values', 'scrabble bonus squares', 'how scrabble scoring works'],
    intro: 'Scrabble scoring looks simple but has a few subtleties. Here is the full reference — tile values, bonus squares, and the 50-point bingo bonus.',
    faq: [
      { q: 'Does the bonus square affect cross-words?', a: 'Yes. Any bonus square you cover affects every word that uses a letter on that square.' },
      { q: 'Do letter bonuses multiply before or after word bonuses?', a: 'Letter bonuses are applied first, then the whole word score is multiplied by any word-multiplier covered.' },
      { q: 'What is the maximum single-play score?', a: 'OXYPHENBUTAZONE has a theoretical max of 1,778 points in a contrived but legal setup.' },
    ],
    relatedIds: ['scrabble-helper', 'word-finder'],
    primaryCta: { href: '/word-tools/scrabble-helper/', label: 'Scrabble Helper' },
    bodyHtml: `
      <h2>Tile values</h2>
      <p>Every tile has a fixed point value:</p>
      <ul>
        <li><strong>1 point</strong>: A, E, I, O, U, L, N, S, T, R</li>
        <li><strong>2 points</strong>: D, G</li>
        <li><strong>3 points</strong>: B, C, M, P</li>
        <li><strong>4 points</strong>: F, H, V, W, Y</li>
        <li><strong>5 points</strong>: K</li>
        <li><strong>8 points</strong>: J, X</li>
        <li><strong>10 points</strong>: Q, Z</li>
        <li><strong>0 points</strong>: Blank (?)</li>
      </ul>

      <h2>Bonus squares</h2>
      <p>The board has four kinds of bonus square:</p>
      <ul>
        <li><strong>Double Letter (DL)</strong> — doubles just that tile's value.</li>
        <li><strong>Triple Letter (TL)</strong> — triples just that tile's value.</li>
        <li><strong>Double Word (DW)</strong> — doubles the whole word's score.</li>
        <li><strong>Triple Word (TW)</strong> — triples the whole word's score.</li>
      </ul>
      <p>Bonus squares only apply the turn they are first covered. After that, they behave as normal squares.</p>

      <h2>The 50-point bingo bonus</h2>
      <p>Playing all 7 tiles in one turn earns a flat <strong>50-point bingo bonus</strong> on top of the word score. This bonus is the single biggest lever in Scrabble — a plain 7-letter word with no bonus squares still scores 50+ points, often more than 4 ordinary plays.</p>

      <h2>Calculating a real play</h2>
      <p>Example: you play QUIZ with the Q on a TL and the whole word across a DW.</p>
      <ol>
        <li>Q on TL: 10 × 3 = 30.</li>
        <li>U, I, Z: 1 + 1 + 10 = 12.</li>
        <li>Sum: 30 + 12 = 42.</li>
        <li>DW multiplier: 42 × 2 = 84.</li>
      </ol>
      <p>Use the <a href="/word-tools/scrabble-helper/">Scrabble Helper</a> to score any rack automatically.</p>
    `,
  },

  {
    id: 'cE-scrabble-bingo-strategy',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'scrabble-bingo-strategy',
    guideCategory: 'Scrabble',
    title: 'Scrabble Bingo Strategy — How to Find 7-Letter Plays — Kefiw',
    h1: 'Scrabble Bingo Strategy',
    subhead: 'Rack management, prefix-suffix hooks, and spotting 7-letter plays',
    description: 'How to find and play bingos — the 7-letter plays that earn a 50-point bonus. Covers rack balance, prefix/suffix thinking, and common bingo stems.',
    keywords: ['scrabble bingo', 'how to find bingos', '7 letter scrabble', 'scrabble bingo strategy'],
    intro: 'A bingo is worth 50 points on top of the word score — the single biggest edge in Scrabble. This guide covers the habits and patterns that make bingos reliable.',
    faq: [
      { q: 'How often should I expect a bingo?', a: 'Top club-level players average one bingo every 3-4 turns. Beginners average roughly zero. The gap is the biggest skill-rating lever.' },
      { q: 'Do bingos have to be 7 letters exactly?', a: 'Yes. Playing 8 letters (with a board-hook) also earns the bonus but is much rarer.' },
    ],
    relatedIds: ['scrabble-helper', 'word-finder', '7-letter-word-finder'],
    primaryCta: { href: '/word-tools/7-letter-word-finder/', label: '7-Letter Word Finder' },
    bodyHtml: `
      <h2>Rule 1: balance your rack</h2>
      <p>You cannot bingo from GGLMQZZ. A balanced rack (roughly 3-4 vowels + 3-4 consonants, with no more than one high-value tile) is prerequisite. If your rack drifts far from balance, swap — one bad turn is cheaper than three turns of failed bingo hunts.</p>

      <h2>Rule 2: keep bingo-prone letters</h2>
      <p>The letters R, S, T, L, N, E, I, A, D appear in more 7-letter words than any others. If you draw several, hold them. The mnemonic <strong>RSTLNE</strong> (vowel a) is the core — variants include TISANE, RETAIN, RATLINE, NASTIER.</p>

      <h2>Rule 3: know the common stems</h2>
      <p>A bingo stem is a 6-letter combination that bingoes with many single extra letters. Memorise:</p>
      <ul>
        <li><strong>SATIRE</strong> (+ D, N, R, S): SATIRED, SANTIER, ARTSIER, SERIATE.</li>
        <li><strong>RETINA</strong> (+ L, N, R, S): LATRINE, TRAINER, RETINAS, ANESTRI.</li>
        <li><strong>TISANE</strong> (+ many): TANSIES, SESTINA, SATIATE, TITANES.</li>
      </ul>

      <h2>Rule 4: use prefixes and suffixes</h2>
      <p>If you have four mid-value letters plus UN-, RE-, PRE-, -ING, -ED, -ER, or -TION, you are often a rearrangement away from a bingo. The Kefiw <a href="/word-tools/word-finder/">Word Finder</a> with your rack letters will find any bingo candidates instantly.</p>

      <h2>Rule 5: plan the landing spot</h2>
      <p>Even a great bingo word fails if it cannot land on the board. Scan the board for open lines of 7 squares with hookable letters at one end — those are bingo runways.</p>
    `,
  },

  {
    id: 'cE-wordle-strategy',
    clusterId: 'pattern',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'wordle-strategy',
    guideCategory: 'Wordle',
    title: 'Wordle Strategy Guide — Opener, Narrowing, Endgame — Kefiw',
    h1: 'Wordle Strategy Guide',
    subhead: 'Best openers, narrowing technique, and endgame decisions',
    description: 'How to win Wordle in fewer guesses — choose openers that maximise information, narrow candidates efficiently, and know when to sacrifice a turn.',
    keywords: ['wordle strategy', 'best wordle opener', 'wordle tips', 'how to win wordle'],
    intro: 'Wordle rewards information, not lucky guesses. This guide covers openers, narrowing, and endgame play.',
    faq: [
      { q: 'What is the mathematically best opener?', a: 'Information-theoretic analysis points to SALET, CRATE, or TRACE as top openers. Pick one and stick with it — consistency helps you learn second-guess reactions.' },
      { q: 'When should I sacrifice a guess to test letters?', a: 'If 6+ candidates remain and they share most letters, play a word that tests new letters even if it cannot be the answer.' },
    ],
    relatedIds: ['wordle-solver', '5-letter-word-finder'],
    primaryCta: { href: '/word-tools/wordle-solver/', label: 'Wordle Solver' },
    bodyHtml: `
      <h2>Opening move</h2>
      <p>Your first guess should cover the five most common letters in the Wordle answer list. Strong choices include:</p>
      <ul>
        <li><strong>SALET</strong> — often cited as the optimal opener by simulation.</li>
        <li><strong>CRATE</strong>, <strong>TRACE</strong>, <strong>SLATE</strong>, <strong>CRANE</strong> — all within 0.05 expected-guesses of optimal.</li>
      </ul>

      <h2>Second guess</h2>
      <p>After the first word, you usually know 1-3 letters. The second guess should:</p>
      <ol>
        <li>Confirm yellow letters in new positions.</li>
        <li>Test 4-5 new consonants and/or vowels.</li>
        <li>Not repeat any letters that came back gray.</li>
      </ol>
      <p>Common second-guess partners for SALET: CORNY, DOUBT, BIRDS, POUND.</p>

      <h2>Narrowing phase</h2>
      <p>Once you have 2-3 greens, the question shifts from "what letters" to "which of the remaining candidates". The <a href="/word-tools/wordle-solver/">Wordle Solver</a> shows the full candidate set — if only 2-3 remain, guess the correct answer. If 6+ remain and share most letters, sacrifice a turn on a word that distinguishes them.</p>

      <h2>Endgame</h2>
      <ul>
        <li>On guess 5 or 6, do not sacrifice — lock in your best candidate.</li>
        <li>Watch for near-identical candidates like SIGHT, TIGHT, LIGHT, FIGHT, RIGHT, NIGHT, MIGHT — a sacrifice word like FROND covers four of those initials.</li>
      </ul>

      <h2>Hard mode adjustments</h2>
      <p>In hard mode you must use every revealed hint in every subsequent guess. Sacrifice guesses are illegal — focus on high-information locked-in candidates.</p>
    `,
  },

  {
    id: 'cE-crossword-pattern-tips',
    clusterId: 'pattern',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'crossword-pattern-tips',
    guideCategory: 'Crosswords',
    title: 'Crossword Pattern Search Tips — Using Wildcards to Solve Clues — Kefiw',
    h1: 'Crossword Pattern Search Tips',
    subhead: 'How to use pattern search to unstick hard crosswords',
    description: 'Practical tips for using the pattern search to solve crosswords — letter positions, wildcards, and narrowing results.',
    keywords: ['crossword pattern search', 'crossword wildcard', 'crossword solver tips', 'pattern search crossword'],
    intro: 'Pattern search is the most powerful crossword-solving tool available. Here is how to use it without cheating yourself out of the puzzle.',
    faq: [
      { q: 'Is pattern search cheating?', a: 'That is for you to decide. Most solvers use it only after they have spent 20+ minutes stuck, and treat it as a learning aid.' },
      { q: 'What about enumeration patterns like (5,4)?', a: 'Pattern search only matches single-word patterns. For multi-word enumerations, solve each segment separately.' },
    ],
    relatedIds: ['crossword-solver', 'pattern-solver', 'word-finder'],
    primaryCta: { href: '/word-tools/crossword-solver/', label: 'Crossword Solver' },
    bodyHtml: `
      <h2>Use every letter you have</h2>
      <p>The more fixed letters in your pattern, the shorter the candidate list. If you have two letters in a 7-letter answer, you may see hundreds of candidates. Filling in one more crossing letter often cuts the list to 5-10.</p>

      <h2>Use the position, not just the letter</h2>
      <p>Type <code>??o?n</code>, not just <code>on</code>. The pattern solver matches exact word length plus exact letter position — this is far more specific than a letter-set search.</p>

      <h2>Distinguish the Word Finder from Crossword Solver</h2>
      <p>The <a href="/word-tools/word-finder/">Word Finder</a> defaults to letter-set (anagram-style) search. The <a href="/word-tools/crossword-solver/">Crossword Solver</a> defaults to pattern search. Use the right one for your need.</p>

      <h2>When no candidates match</h2>
      <ul>
        <li>Double-check the crossing letters — one wrong letter can eliminate every candidate.</li>
        <li>Try the Full dictionary toggle — some crossword answers are proper nouns or obscure terms not in the game list.</li>
        <li>Re-read the clue — if it looks like wordplay, the direct pattern may not match the definition.</li>
      </ul>
    `,
  },

  {
    id: 'cE-rhyme-perfect-vs-near',
    clusterId: 'rhyme',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'rhyme-perfect-vs-near',
    guideCategory: 'Poetry',
    title: 'Perfect Rhymes vs Near Rhymes — Explained — Kefiw',
    h1: 'Perfect Rhymes vs Near Rhymes',
    subhead: 'How poets and songwriters use different kinds of rhyme',
    description: 'The difference between perfect rhymes, slant rhymes, eye rhymes, and near rhymes — with examples from poetry and song.',
    keywords: ['perfect rhyme', 'near rhyme', 'slant rhyme', 'eye rhyme', 'rhyme types'],
    intro: 'Not every rhyme is a perfect rhyme. This guide walks through the main categories with examples.',
    faq: [
      { q: 'Is "love" / "move" a rhyme?', a: 'It is an eye rhyme — same spelling, different sound. In strict poetic terms it is not a rhyme at all, but it is used for visual effect.' },
      { q: 'Are near rhymes "cheating"?', a: 'No — many of the best songwriters and poets prefer near rhymes for freshness. Perfect rhyme can feel predictable.' },
    ],
    relatedIds: ['rhyme-finder', 'syllable-counter'],
    primaryCta: { href: '/word-tools/rhyme-finder/', label: 'Rhyme Finder' },
    bodyHtml: `
      <h2>Perfect rhyme</h2>
      <p>A perfect rhyme shares the final stressed vowel and every sound after it. Examples: CAT / HAT, LIGHT / FLIGHT, OCEAN / MOTION. Most nursery rhymes are built on perfect rhyme.</p>

      <h2>Slant (near) rhyme</h2>
      <p>A slant or near rhyme shares some but not all sounds — typically the ending consonants match but the vowels do not, or vice versa. Examples: HOME / HARM, SHAPE / SWEEP, WORLD / WAIT. Common in modern lyrics, hip-hop, and Emily Dickinson's poetry.</p>

      <h2>Eye rhyme</h2>
      <p>An eye rhyme shares spelling but not sound: LOVE / MOVE, COUGH / BOUGH, HEART / BEARD. Used for visual or deliberately jarring effect.</p>

      <h2>Assonance and consonance</h2>
      <ul>
        <li><strong>Assonance</strong>: shared vowel sounds (BREAK / FACE).</li>
        <li><strong>Consonance</strong>: shared consonant sounds (STROKE / LUCK).</li>
      </ul>

      <h2>Using the Rhyme Finder</h2>
      <p>The Kefiw <a href="/word-tools/rhyme-finder/">Rhyme Finder</a> returns two lists: <strong>perfect</strong> (last 4 characters match) and <strong>near</strong> (last 3 match). Use perfect for closed-form poetry; near for freer, more modern lyrics.</p>
    `,
  },

  {
    id: 'cE-syllables-counting-rules',
    clusterId: 'rhyme',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'syllables-counting-rules',
    guideCategory: 'Poetry',
    title: 'How to Count Syllables — Rules and Edge Cases — Kefiw',
    h1: 'How to Count Syllables',
    subhead: 'The rules and the tricky cases',
    description: 'Practical rules for counting syllables, plus common edge cases like silent e, diphthongs, and the -tion suffix.',
    keywords: ['count syllables', 'syllable rules', 'how to count syllables', 'syllable counting'],
    intro: 'Counting syllables sounds easy — a vowel per beat — but English has several traps. Here are the rules that cover 95% of cases.',
    faq: [
      { q: 'Why do different tools give different counts?', a: 'English syllable counting is approximate. Automated counters use heuristics; humans often disagree too, especially for compound words and proper nouns.' },
      { q: 'Does "fire" have 1 or 2 syllables?', a: 'Both are common. In fast speech it is 1 ("fyr"); in slower careful speech it is 2 ("fy-er"). Haiku counts usually treat it as 1.' },
    ],
    relatedIds: ['syllable-counter', 'haiku-checker', 'rhyme-finder'],
    primaryCta: { href: '/word-tools/syllable-counter/', label: 'Syllable Counter' },
    bodyHtml: `
      <h2>Rule 1: count the vowel sounds</h2>
      <p>A syllable is one vowel sound. Consonants cluster around it. <em>Cat</em> has one vowel sound (A). <em>Doctor</em> has two (DOC-TOR).</p>

      <h2>Rule 2: adjacent vowels that make one sound count once</h2>
      <p>Diphthongs and long-vowel combinations: BOAT has AE... wait, it has OA but they make one sound, so 1 syllable. Same for TREE (EE), BEAUTY (EAU is 1, Y is 1 = 2 total).</p>

      <h2>Rule 3: silent E at end is free</h2>
      <p>A final E that is not pronounced does not count: CAKE = 1 syllable, HOPE = 1, BEFORE = 2.</p>

      <h2>Rule 4: -le after a consonant adds a syllable</h2>
      <p>APPLE is 2 (AP-PLE), LITTLE is 2, BOTTLE is 2. The L is syllabic here — it acts as a vowel.</p>

      <h2>Rule 5: -tion, -sion, -cious count as one syllable</h2>
      <p>NATION = 2 (NA-TION). DECISION = 3 (DE-CI-SION). DELICIOUS = 3 (DE-LI-CIOUS).</p>

      <h2>Edge cases</h2>
      <ul>
        <li><strong>-ed endings</strong>: only add a syllable after T or D (VOTED = 2; WALKED = 1).</li>
        <li><strong>Compound words</strong>: count each component separately (BASEBALL = 2).</li>
        <li><strong>Y as vowel</strong>: at the end of a word Y usually is a vowel (HAPPY = 2, MYSTERY = 3).</li>
      </ul>
    `,
  },

  {
    id: 'cE-scrabble-2-letter-mastery',
    clusterId: 'scrabble',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'scrabble-2-letter-mastery',
    guideCategory: 'Scrabble',
    title: 'Mastering Scrabble 2-Letter Words — Kefiw',
    h1: 'Mastering 2-Letter Words',
    subhead: 'Why every competitive Scrabble player memorises all 100',
    description: 'The 2-letter Scrabble words — why they matter, how to learn them, and which ones beginners miss.',
    keywords: ['scrabble 2 letter words', 'two letter words scrabble', 'memorise 2 letter words', '2 letter word mastery'],
    intro: 'Mastering every valid 2-letter word is the fastest single way to raise a Scrabble rating. Here is why, and how to do it.',
    faq: [
      { q: 'How long does it take to memorise all 2-letter words?', a: 'About two hours of deliberate practice, or a week of playing 15 minutes a day with flashcards.' },
      { q: 'Are all 2-letter words valid in Words With Friends?', a: 'Most are, but WWF uses its own internal dictionary with a few differences. Verify with the Words With Friends Helper.' },
    ],
    relatedIds: ['scrabble-helper', 'word-finder'],
    relatedLinks: [{ href: '/word-tools/2-letter-words/', label: 'Full 2-letter word list' }],
    primaryCta: { href: '/word-tools/2-letter-words/', label: 'See all 2-letter words' },
    bodyHtml: `
      <h2>Why 2-letter words matter</h2>
      <p>Every Scrabble play forms the main word plus every perpendicular crossing-word it creates. When you play parallel to an existing word, each letter you place is also the start of a new 2-letter word alongside it. Knowing the valid pairs turns a 5-point play into a 20-point play.</p>

      <h2>How to memorise them</h2>
      <ol>
        <li>Print the full list and group by first letter.</li>
        <li>Study the quirky ones first — AA, AE, AI, OE, OI, QI, ZA.</li>
        <li>Practise with flashcards: see two letters, decide valid or not in under 2 seconds.</li>
        <li>Test yourself in play by actively looking for parallel 2-letter opportunities.</li>
      </ol>

      <h2>High-value 2-letter plays</h2>
      <ul>
        <li>QI — 11 points, highest base score.</li>
        <li>ZA — 11 points.</li>
        <li>XU — 9 points.</li>
        <li>XI — 9 points.</li>
        <li>JO — 9 points.</li>
      </ul>

      <h2>Vowel-only 2-letter words</h2>
      <p>When your rack is vowel-heavy, these save you: AA, AE, AI, OE, OI. All valid, all clear excess vowels.</p>

      <h2>Common beginner blind spots</h2>
      <ul>
        <li><strong>AA</strong> — rough lava.</li>
        <li><strong>AE</strong> — one (Scottish).</li>
        <li><strong>OD</strong> — a hypothetical force.</li>
        <li><strong>UT</strong> — the note sol-fa calls "do".</li>
        <li><strong>XU</strong> — a Vietnamese monetary unit.</li>
      </ul>
    `,
  },
];

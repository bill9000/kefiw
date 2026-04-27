import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_CLUSTER_OVERVIEW_GUIDES: ContentPageConfig[] = [
  {
    id: 'art-pattern-solver-overview',
    clusterId: 'pattern',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'word-pattern-solver-guide',
    guideCategory: 'Word tools',
    title: 'Word Pattern Solver Guide: Wordle, Crosswords, Hangman, and Blanks | Kefiw',
    h1: 'Word Pattern Solver Guide',
    subhead: 'Use known letters, blanks, exclusions, and length filters without turning the puzzle into noise.',
    discoverHeadline: 'The pattern-search trick that unsticks Wordle and crosswords fast',
    outcomeLine: 'Pattern solving works best when every known letter, blank, and exclusion is entered deliberately.',
    description: 'A practical guide to word pattern solvers for Wordle, crosswords, hangman, and wildcard searches, with examples, traps, and strategy.',
    metaDescription: 'Learn how to use word pattern solvers for Wordle, crosswords, hangman, and wildcard searches without wasting guesses.',
    keywords: ['word pattern solver', 'wordle solver guide', 'crossword pattern solver', 'hangman helper', 'wildcard word finder'],
    intro: 'A user opening a pattern solver is usually stuck with partial information. They may know a word length, a few fixed letters, a few letters that cannot appear, or a game-specific clue such as Wordle colors.',
    primaryCta: { href: '/word-tools/pattern-and-puzzle-solvers/', label: 'Open pattern hub' },
    secondaryCtas: [
      { href: '/word-tools/word-finder/', label: 'Word Finder' },
      { href: '/word-tools/wordle-solver/', label: 'Wordle Solver' },
      { href: '/word-tools/crossword-solver/', label: 'Crossword Solver' },
    ],
    keyPoints: [
      'Use a pattern solver when position matters more than anagram rearrangement.',
      'Question marks or blanks represent unknown positions, not optional letters.',
      'Wordle needs green, yellow, and gray logic; crosswords need fixed positions and clue sense.',
      'Hangman helpers work best when wrong guesses are entered as exclusions.',
      'The helper should narrow candidates, not remove every bit of puzzle challenge.',
    ],
    examples: [
      {
        title: 'Wordle pattern',
        body: 'A five-letter word with A fixed in position 2 and no S, T, or R should be entered as a positional search plus exclusions.',
      },
      {
        title: 'Crossword crossing',
        body: 'A crossword answer like C?A?? gets much stronger when clue sense and likely ending are considered with the pattern.',
      },
      {
        title: 'Hangman rescue',
        body: 'Known letters plus wrong guesses prevent the helper from returning words the game has already ruled out.',
      },
    ],
    whenToUse: [
      { toolId: 'word-finder', note: 'Use for general known-letter and wildcard pattern searches.' },
      { toolId: 'wordle-solver', note: 'Use when green, yellow, and gray feedback must be combined.' },
      { toolId: 'crossword-solver', note: 'Use when fixed letters and clue sense both matter.' },
      { toolId: 'hangman-solver', note: 'Use when wrong guesses need to be excluded from candidates.' },
    ],
    relatedIds: [
      'word-finder',
      'wordle-solver',
      'crossword-solver',
      'hangman-solver',
      'cS-wildcard-patterns-word-finder',
      'cS-wordle-green-yellow-gray',
      'cS-crossword-pattern-logic',
      'cS-hangman-pattern-logic',
    ],
    longformMarkdown: `## What the user is actually trying to do

Pattern tools solve a different problem from anagram tools. An anagram user has letters and wants rearrangements. A pattern user has positions and constraints. They may be solving Wordle, a crossword, hangman, a spelling puzzle, a word ladder, or a custom classroom clue. The task is to turn partial information into a smaller candidate list.

The [Word Finder](/word-tools/word-finder/) is the general tool. The [Wordle Solver](/word-tools/wordle-solver/) adds color feedback. The [Crossword Solver](/word-tools/crossword-solver/) is for crossing letters and clue sense. The [Hangman Solver](/word-tools/hangman-solver/) is for known letters plus wrong guesses.

The real skill is not pressing search. The skill is encoding the puzzle correctly. A missing exclusion can flood the result list. A misplaced yellow letter in Wordle can suggest impossible answers. A crossword pattern with no clue context can return words that fit the shape but make no sense.

## Rules and strategy angles

Opening strategy matters most in Wordle and similar games. Start with words that test common vowels and consonants rather than chasing a lucky answer. Pattern recognition matters in crosswords: endings such as -ING, -ED, -ER, and common prefixes can narrow a clue fast. Probability matters when many candidates remain; choose a guess that splits the list well instead of repeating the same known letters.

Elimination is the main engine. Every confirmed position, excluded letter, and wrong guess should remove candidates. Common traps include forgetting repeated letters, treating yellow Wordle letters as free anywhere, ignoring gray letters that can still appear if the same letter was also green or yellow, and using a wildcard when a length filter would be cleaner.

Advanced tactics include looking for candidate families, testing high-information letters, and separating search from final answer selection. The helper can produce candidates, but clue meaning, idiom, theme, and game state still choose the answer.

## Formula, inputs, and assumptions

The basic pattern formula is positional matching: a candidate word must have the requested length and match each fixed letter at the fixed position. Wildcards match any letter. Exclusions remove candidates containing ruled-out letters. Game-specific solvers add extra constraints.

Inputs are length, fixed letters, unknown positions, included letters, excluded letters, and sometimes misplaced letters. Assumptions include dictionary coverage and spelling. Kefiw word tools use broad word lists, so a game-specific dictionary may differ. For competitive or tournament play, confirm unusual words in the actual game dictionary.

## Worked example

Suppose a Wordle-style puzzle has five letters. The second letter is A. The word contains L but not in position 1. S, T, R, and E are excluded. A raw pattern search for ?A??? returns too many words. Adding L as included and S/T/R/E as excluded creates a much shorter list. If the remaining candidates split between endings, the next guess should test the letters that separate those endings.

For a crossword, the same pattern logic is not enough. A clue for "river animal" with O?T?? points toward one semantic field, while the same pattern under a clue about "sound" points elsewhere. Use the solver to narrow shape, then use the clue to choose meaning.

## Using helpers without removing the challenge

Use the helper after you have tried the puzzle, not before every guess. Enter only information the puzzle has earned. In Wordle, use the candidate list to choose a high-information guess rather than instantly selecting the likely answer. In crosswords, use it to break a deadlock, then return to clue solving.

The best practice routine is to solve manually for a few minutes, enter constraints, study why the top candidates survived, and then close the tool. Over time, the patterns become internal: common endings, repeated-letter traps, and high-value eliminations become easier to see.`,
    faq: [
      {
        q: 'How do I use a word pattern solver?',
        a: 'Use a word pattern solver by entering known letters in their exact positions and blanks for unknown positions. Add length, included letters, and excluded letters when the tool supports them. The cleaner the constraints, the cleaner the candidate list.',
        faq_intent: 'how-to',
      },
      {
        q: 'What is the difference between Word Finder and Wordle Solver?',
        a: 'Word Finder matches general letter patterns, while Wordle Solver understands green, yellow, and gray feedback. Use Word Finder for broad wildcard searches. Use Wordle Solver when the puzzle rules create color-based constraints that ordinary pattern matching cannot capture.',
        faq_intent: 'comparison',
      },
      {
        q: 'Why is my pattern search returning too many words?',
        a: 'A pattern search returns too many words when length, exclusions, included letters, or fixed positions are missing. Add every known constraint from the puzzle. If the list is still large, use clue meaning, common endings, or a high-information guess.',
        faq_intent: 'troubleshooting',
      },
      {
        q: 'Can a solver be wrong for a real game?',
        a: 'Yes, a solver can be wrong when the game dictionary differs from the tool dictionary. It can also return valid words that do not fit a clue or theme. For competitive games, always confirm unusual answers in the official game word list.',
        faq_intent: 'trust',
      },
      {
        q: 'Should I use a helper on every Wordle guess?',
        a: 'Use a helper sparingly if you want the puzzle to stay satisfying. Try manual elimination first, then use the solver when the candidate list is too large or confusing. Study why candidates survive instead of blindly taking the top result.',
        faq_intent: 'how-to',
      },
    ],
  },
  {
    id: 'art-everyday-calculators-overview',
    clusterId: 'everyday-calculators',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'everyday-calculators-guide',
    guideCategory: 'Calculators',
    title: 'Everyday Calculators Guide: Percent, Dates, Hours, Averages, and Mental Math | Kefiw',
    h1: 'Everyday Calculators Guide',
    subhead: 'Use quick calculators to check formulas, compare options, and practice estimating before the answer appears.',
    discoverHeadline: 'The everyday calculator checks that stop small math mistakes',
    outcomeLine: 'The best calculator use starts with an estimate, then checks the exact result.',
    description: 'Guide to everyday calculators for percentages, dates, hours, averages, fractions, ratios, and mental-math practice.',
    metaDescription: 'Use Kefiw everyday calculators to check percent math, dates, hours, averages, fractions, ratios, and mental math with examples.',
    keywords: ['everyday calculators', 'percentage calculator guide', 'date difference calculator', 'hours calculator', 'mental math practice'],
    intro: 'Most everyday calculator users are trying to avoid small manual mistakes. They may be checking a percentage, planning a date span, adding hours, comparing averages, or practicing mental estimation.',
    primaryCta: { href: '/calculators/everyday-calculators/', label: 'Open everyday calculators' },
    secondaryCtas: [
      { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
      { href: '/calculators/date-difference-calculator/', label: 'Date Difference' },
      { href: '/daily/math/', label: 'Daily Math' },
    ],
    keyPoints: [
      'Percent tools answer percent-of, percent-change, and is-what-percent questions.',
      'Date and age tools depend on inclusive vs exclusive counting assumptions.',
      'Hours tools need clear start, end, break, and overnight handling.',
      'Average tools should not be used when median or mode is the real question.',
      'Mental-math mode is strongest when the user estimates first and then checks.',
    ],
    examples: [
      {
        title: 'Percent change',
        body: 'Going from 80 to 100 is a 25 percent increase because the change is divided by the starting value.',
      },
      {
        title: 'Date span',
        body: 'A project from Monday to Friday can be four elapsed days or five calendar dates, depending on the question.',
      },
      {
        title: 'Mental math',
        body: 'Before calculating 18 percent of 240, estimate 10 percent plus 8 percent, then check the exact answer.',
      },
    ],
    whenToUse: [
      { toolId: 'percentage-calculator', note: 'Use for percent-of, is-what-percent, and percent-change questions.' },
      { toolId: 'date-difference-calculator', note: 'Use when elapsed days, weeks, or date spans need checking.' },
      { toolId: 'hours-calculator', note: 'Use for work sessions, breaks, overnight spans, and time totals.' },
      { articleId: 'art-bg-mental-math-calculators', note: 'Use when the goal is practicing estimates before checking exact results.' },
    ],
    relatedIds: [
      'percentage-calculator',
      'date-difference-calculator',
      'hours-calculator',
      'average-calculator',
      'art-bg-mental-math-calculators',
      'art-ce-percent-math-calculator-guide',
      'art-ce-mean-median-mode-guide',
    ],
    longformMarkdown: `## What the user is actually trying to do

Everyday calculators are not glamorous, but they answer questions people hit constantly: "What is 18 percent of this?" "How many days until then?" "How many hours did I work?" "What average do these numbers produce?" "Can I do this in my head before checking?"

The user may be planning a task, checking homework, validating a formula, comparing options, or avoiding manual arithmetic. The calculator should make the formula visible enough that the user learns the pattern rather than blindly copying the answer.

Kefiw also has a broader direction: every calculator can become a result-guessing game in game mode. That matters because estimation builds number sense. A user who guesses first, then checks, gets practice and feedback instead of passive answers. The [Daily Math](/daily/math/) pipeline already points in that direction.

## Formula families

Percentage calculators usually cover three formulas:

percent of number = number x percent / 100

is what percent = part / whole x 100

percent change = (new - old) / old x 100

Date calculators count elapsed time between dates. The key assumption is whether endpoints are included. Age calculators need birth date, target date, and calendar rules. Hours calculators need start time, end time, breaks, and overnight handling. Average calculators need the user to know whether mean, median, or mode answers the real question.

## Worked examples

Example 1: What is 18 percent of 240? Estimate first. Ten percent is 24. Five percent is 12. Three percent is 7.2. Together, 18 percent is 43.2. The calculator confirms it.

Example 2: A value rises from 80 to 100. The change is 20. Divide by the original 80, not the new 100. 20 / 80 = 0.25, so the increase is 25 percent. Reversing from 100 to 80 is a 20 percent decrease because the base changed.

Example 3: A shift runs 9:15am to 5:45pm with a 30-minute break. Total clock span is 8.5 hours. Subtract 0.5 hours and the worked time is 8.0 hours. If the shift crosses midnight, the calculator must treat the end time as the next day.

## Common mistakes

The biggest percent mistake is using the wrong base. Discounts, increases, decreases, and comparison percentages all depend on the denominator. The biggest date mistake is mixing elapsed days with calendar dates. The biggest average mistake is using mean when median better represents a skewed set.

Another mistake is skipping estimation. If a result is wildly wrong because a decimal was misplaced, an estimate catches it. Before pressing calculate, ask what size answer would make sense.

## When not to rely on everyday calculators

Do not use these pages for legal, tax, medical, financial, or professional decisions unless the specific tool and JSON support that use case. A generic percent calculator can check arithmetic, but it does not decide tax treatment, loan suitability, medication dosing, or legal deadlines.

The safe pattern is: estimate, calculate, sanity-check, then use qualified guidance when stakes require it.`,
    faq: [
      {
        q: 'How do I choose the right everyday calculator?',
        a: 'Choose the calculator that matches the question type, not just the numbers you have. Percent questions need a base, date questions need counting rules, hours questions need breaks, and average questions need the right measure of center.',
        faq_intent: 'how-to',
      },
      {
        q: 'Why is percent change not reversible?',
        a: 'Percent change is not reversible because the starting value changes when you reverse direction. Going from 80 to 100 is 25 percent up, but going from 100 to 80 is 20 percent down. The denominator controls the result.',
        faq_intent: 'definition',
      },
      {
        q: 'Can calculators help me improve mental math?',
        a: 'Calculators can improve mental math when you estimate first and then check the result. Passive calculator use only gives answers. Guessing first builds number sense, reveals formula mistakes, and makes the exact result easier to remember.',
        faq_intent: 'how-to',
      },
      {
        q: 'Should I use mean, median, or mode?',
        a: 'Use mean for a balanced numeric average, median when outliers distort the data, and mode when the most common value matters. An average calculator may compute the mean, but the real question may call for another measure.',
        faq_intent: 'comparison',
      },
      {
        q: 'Are everyday calculators professional advice?',
        a: 'No, everyday calculators check arithmetic and explain formulas but do not provide legal, medical, tax, financial, or professional advice. Use them for math verification and planning. For regulated or high-stakes decisions, verify with qualified sources.',
        faq_intent: 'trust',
      },
    ],
  },
  {
    id: 'art-shopping-calculators-overview',
    clusterId: 'shopping',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'shopping-calculators-guide',
    guideCategory: 'Calculators',
    title: 'Shopping Calculators Guide: Discounts, Tips, Margin, Break-Even, and Small Decisions | Kefiw',
    h1: 'Shopping Calculators Guide',
    subhead: 'Compare everyday money-light decisions without making financial-advice claims.',
    discoverHeadline: 'The shopping math traps that make a deal look better than it is',
    outcomeLine: 'Use shopping calculators to check arithmetic, compare options, and spot hidden bases.',
    description: 'Guide to shopping calculators for discounts, tips, markup, margin, break-even, and small recurring decisions.',
    metaDescription: 'Use Kefiw shopping calculators to compare discounts, tips, markup, margin, break-even, and small everyday decisions.',
    keywords: ['shopping calculators', 'discount calculator guide', 'tip calculator guide', 'markup margin calculator', 'break even calculator'],
    intro: 'Shopping calculators help users compare small decisions: a sale price, stacked discounts, tip split, markup, margin, break-even quantity, or recurring cost. The scope is arithmetic, not financial advice.',
    primaryCta: { href: '/calculators/saving-and-spending-tools/', label: 'Open shopping calculators' },
    secondaryCtas: [
      { href: '/calculators/discount-calculator/', label: 'Discount Calculator' },
      { href: '/calculators/tip-calculator/', label: 'Tip Calculator' },
      { href: '/calculators/markup-margin-calculator/', label: 'Markup & Margin' },
    ],
    keyPoints: [
      'Stacked discounts compound and are not added linearly.',
      'Tip totals need subtotal, tax assumption, service context, and split count.',
      'Markup divides profit by cost; margin divides profit by selling price.',
      'Break-even needs fixed cost, variable cost, and price per unit.',
      'Use these calculators for arithmetic checks, not financial, tax, or business advice.',
    ],
    examples: [
      {
        title: 'Stacked discount',
        body: 'Two 20 percent discounts produce 36 percent off, not 40 percent, because the second applies to the reduced price.',
      },
      {
        title: 'Tip split',
        body: 'A $96 subtotal with 20 percent tip is $19.20 tip before any split assumptions.',
      },
      {
        title: 'Margin vs markup',
        body: 'Buy for $60 and sell for $100: markup is 66.7 percent, margin is 40 percent.',
      },
    ],
    whenToUse: [
      { toolId: 'discount-calculator', note: 'Use for sale price, percent off, stacked discounts, and comparison shopping.' },
      { toolId: 'tip-calculator', note: 'Use for tip amount, total, and split math.' },
      { toolId: 'markup-margin-calculator', note: 'Use when cost, price, markup, and margin need to be separated.' },
      { toolId: 'break-even-calculator', note: 'Use to check simple fixed-cost and per-unit break-even arithmetic.' },
    ],
    relatedIds: [
      'discount-calculator',
      'tip-calculator',
      'markup-margin-calculator',
      'break-even-calculator',
      'cS-how-discounts-stack',
      'cS-markup-vs-margin',
      'art-lg-subscription-social-utility',
    ],
    longformMarkdown: `## What the user is actually trying to do

Shopping calculators answer small but frequent questions. A user may be checking whether a sale is real, comparing two offers, splitting a restaurant bill, setting a simple price, checking a margin, estimating break-even, or deciding whether a recurring charge is worth keeping.

The important boundary is scope. Kefiw can explain formulas and arithmetic. It should not present these pages as financial, tax, legal, investment, accounting, or business advice. A discount calculator can tell you the sale price. It cannot tell you whether buying the item is wise.

## Formulas and inputs

Discount formula:

sale price = original price x (1 - discount percent / 100)

Stacked discounts apply one after another. A 20 percent discount followed by another 20 percent discount gives original x 0.8 x 0.8 = 64 percent of original, or 36 percent off.

Tip formula:

tip = tip base x tip percent / 100

The tip base may be pre-tax or post-tax depending on local norms and user preference. The calculator should make that assumption clear.

Markup and margin differ:

markup = profit / cost

margin = profit / price

Break-even formula:

break-even units = fixed cost / (price per unit - variable cost per unit)

If price does not exceed variable cost, break-even cannot happen.

## Worked example

An item costs $120. It has 25 percent off, then another 10 percent off. First discount: $120 x 0.75 = $90. Second discount: $90 x 0.90 = $81. Total savings is $39, which is 32.5 percent off, not 35 percent.

A small seller buys an item for $60 and sells it for $100. Profit is $40. Markup is $40 / $60 = 66.7 percent. Margin is $40 / $100 = 40 percent. Confusing these can make a business decision look healthier than it is, even before overhead or tax questions.

## Common mistakes

The most common shopping mistake is adding percentages that should compound. The second is mixing bases: tip before tax vs after tax, margin vs markup, percent off vs percent remaining. The third is ignoring fixed costs in break-even math.

Another mistake is treating small numbers as too small to review. That is why the logic cluster includes [Subscription Purge](/logic/leak-detection/). Small recurring costs become large over years.

## When not to rely on the calculators

Do not use these tools to make regulated financial, tax, legal, accounting, lending, investment, or employment decisions. Use them for arithmetic and comparisons. If a decision affects taxes, contracts, credit, payroll, compliance, or business reporting, use qualified guidance.

The safest workflow is estimate, calculate, compare, then decide whether the decision is still low-stakes enough for calculator math alone.`,
    faq: [
      {
        q: 'How do stacked discounts work?',
        a: 'Stacked discounts apply one after another to the already-reduced price, so they do not add directly. Two 20 percent discounts leave 64 percent of the original price, which equals 36 percent off, not 40 percent off.',
        faq_intent: 'definition',
      },
      {
        q: 'What is the difference between markup and margin?',
        a: 'Markup divides profit by cost, while margin divides profit by selling price. The same sale can have a high markup and a lower margin because the denominator changes. Mixing them is one of the most common pricing mistakes.',
        faq_intent: 'comparison',
      },
      {
        q: 'Should tip be calculated before or after tax?',
        a: 'Tip base depends on local norms and personal preference, so check whether you are tipping pre-tax or post-tax. The calculator can handle the arithmetic either way. The important part is using the same assumption consistently when splitting totals.',
        faq_intent: 'edge-case',
      },
      {
        q: 'Can shopping calculators give financial advice?',
        a: 'No, shopping calculators only check arithmetic for discounts, tips, margins, and break-even comparisons. They do not provide tax, legal, accounting, investment, lending, or business advice. Use qualified guidance when the decision has regulated consequences.',
        faq_intent: 'trust',
      },
      {
        q: 'Why does break-even sometimes show no result?',
        a: 'Break-even shows no useful result when price per unit does not exceed variable cost per unit. In that case, every unit loses money before fixed costs are recovered. The formula exposes the problem instead of hiding it.',
        faq_intent: 'troubleshooting',
      },
    ],
  },
  {
    id: 'art-unit-conversion-overview',
    clusterId: 'units',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'unit-conversion-guide',
    guideCategory: 'Converters',
    title: 'Unit Conversion Guide: Length, Weight, Temperature, Area, Volume, Speed, and Time | Kefiw',
    h1: 'Unit Conversion Guide',
    subhead: 'Convert units carefully by checking direction, precision, and the real-world context.',
    discoverHeadline: 'The unit-conversion mistakes that make correct math wrong',
    outcomeLine: 'A conversion is only useful when the unit direction, rounding, and context are right.',
    description: 'Guide to unit converters for length, weight, temperature, area, volume, speed, and time, including formulas and common mistakes.',
    metaDescription: 'Use Kefiw unit converters for length, weight, temperature, area, volume, speed, and time with formulas, examples, and limits.',
    keywords: ['unit conversion guide', 'length converter', 'weight converter', 'temperature converter', 'metric imperial conversion'],
    intro: 'Unit conversion users are usually preparing a recipe, checking a measurement, comparing specs, planning travel, doing homework, or avoiding a costly copy-paste mistake.',
    primaryCta: { href: '/converters/unit-conversion-tools/', label: 'Open unit converters' },
    secondaryCtas: [
      { href: '/converters/length-converter/', label: 'Length Converter' },
      { href: '/converters/temperature-converter/', label: 'Temperature Converter' },
      { href: '/converters/weight-converter/', label: 'Weight Converter' },
    ],
    keyPoints: [
      'Multiplicative conversions use a factor, such as inches to centimeters.',
      'Temperature conversions use formulas with offsets, not only multiplication.',
      'Area and volume conversions square or cube the length factor.',
      'Rounding depends on context: recipe, construction, science, shipping, or homework.',
      'Converters check math, but they do not validate professional specifications.',
    ],
    examples: [
      {
        title: 'Length',
        body: '10 inches x 2.54 = 25.4 centimeters.',
      },
      {
        title: 'Temperature',
        body: '68 degrees Fahrenheit converts to (68 - 32) x 5 / 9 = 20 degrees Celsius.',
      },
      {
        title: 'Area',
        body: 'A square foot is 12 x 12 square inches, so area conversion is not the same as length conversion.',
      },
    ],
    whenToUse: [
      { toolId: 'length-converter', note: 'Use for distance, dimensions, height, and object measurements.' },
      { toolId: 'temperature-converter', note: 'Use when Fahrenheit, Celsius, or Kelvin formulas matter.' },
      { toolId: 'volume-converter', note: 'Use for cooking, liquids, containers, and capacity comparisons.' },
      { toolId: 'speed-converter', note: 'Use for travel, exercise pace, and speed comparisons.' },
    ],
    relatedIds: [
      'length-converter',
      'weight-converter',
      'temperature-converter',
      'volume-converter',
      'speed-converter',
      'cS-metric-vs-imperial',
      'cS-fahrenheit-vs-celsius',
      'art-cv-length-units-guide',
    ],
    longformMarkdown: `## What the user is actually trying to do

Unit converters solve practical mismatch. A recipe uses milliliters, a product page uses inches, a weather report uses Celsius, a road sign uses kilometers, a package uses pounds, or a homework problem mixes units. The user is trying to compare, plan, or submit something without a unit mistake.

The converter should make direction and assumptions clear. Converting 10 inches to centimeters is easy. Converting square inches to square centimeters, Fahrenheit to Celsius, or speed into pace requires more care. The number can be mathematically correct and still wrong for the job if rounding or context is wrong.

## Formula types

Most unit conversions are factor conversions:

target value = source value x conversion factor

Example: inches to centimeters uses 2.54. Ten inches becomes 25.4 centimeters.

Temperature is different because Fahrenheit and Celsius have different zero points:

C = (F - 32) x 5 / 9

F = C x 9 / 5 + 32

Area and volume also need care. A foot is 12 inches, but a square foot is 144 square inches. A cubic foot is 1,728 cubic inches. The factor is squared or cubed because the dimension is squared or cubed.

## Worked examples

Length: 2.5 meters to feet. One meter is about 3.28084 feet. 2.5 x 3.28084 = 8.2021 feet. For a casual room estimate, 8.2 feet may be enough. For a professional build, rounding rules depend on the spec.

Temperature: 68 F to C. Subtract 32 to get 36. Multiply by 5/9 to get 20 C. A converter prevents the common mistake of multiplying before subtracting.

Volume: 3 gallons to liters. One US gallon is about 3.78541 liters. 3 x 3.78541 = 11.35623 liters. The word US matters because imperial gallons are different.

## Common mistakes

The first mistake is reversing direction. Multiplying when you should divide can be hard to spot if you have no estimate. Always ask whether the target unit should be larger or smaller.

The second mistake is treating temperature like length. Fahrenheit to Celsius needs an offset. The third mistake is using a length factor for area or volume. The fourth is rounding too early. Round the final answer, not the intermediate value, unless the context explicitly requires it.

The fifth mistake is ignoring unit variants. US gallons and imperial gallons differ. Fluid ounces and weight ounces measure different things. Tons can mean short tons, long tons, or metric tonnes.

## When not to rely on a generic converter

Do not rely on a generic converter for engineering drawings, medical dosing, legal metrology, aviation, hazardous materials, payroll, taxes, or regulated specifications. The converter can check arithmetic, but official standards and professional context control high-stakes work.

For everyday use, the workflow is simple: estimate direction, convert, check rounding, and confirm the unit variant. If you want practice rather than just answers, use [Daily Math](/daily/math/) and try guessing conversions before checking.`,
    faq: [
      {
        q: 'How do I avoid unit conversion mistakes?',
        a: 'Avoid unit conversion mistakes by checking direction, unit variant, formula type, and rounding before using the result. Estimate first so obvious errors stand out. Temperature, area, volume, and gallon variants deserve extra attention.',
        faq_intent: 'how-to',
      },
      {
        q: 'Why is temperature conversion different?',
        a: 'Temperature conversion is different because Fahrenheit and Celsius have different zero points, not just different unit sizes. You must subtract or add the offset as part of the formula. Multiplying alone gives the wrong result.',
        faq_intent: 'definition',
      },
      {
        q: 'What rounding should I use for conversions?',
        a: 'Use rounding that matches the task: rough estimates can use fewer digits, while recipes, shipping, schoolwork, or specifications may need more. Avoid rounding intermediate steps too early because small errors can grow through later calculations.',
        faq_intent: 'how-to',
      },
      {
        q: 'Are US and imperial gallons the same?',
        a: 'No, US and imperial gallons are not the same, so volume conversions must use the correct variant. A converter should state which gallon it uses. This matters for recipes, fuel economy, containers, and international comparisons.',
        faq_intent: 'edge-case',
      },
      {
        q: 'Can I use converters for professional specifications?',
        a: 'Use generic converters only to check arithmetic, not to replace professional or regulated specifications. Engineering, medical, aviation, legal, hazardous-material, and compliance contexts may require official standards, controlled rounding, and qualified review.',
        faq_intent: 'trust',
      },
    ],
  },
];

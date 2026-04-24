// Auto-generated from text-cleanup-V3-enhanced.json
// Writer-enhanced overrides for text-cleanup cluster tools.
// Merged into TOOLS at export time (see src/data/tools.ts).
// Do not edit by hand — regenerate with the same command used for articles.

import type { ToolConfig } from './tools';

export const TEXT_CLEANUP_TOOL_ENHANCEMENTS: Record<string, Partial<ToolConfig>> = {
  "word-counter": {
    description: `Count words, characters, no-space characters, sentences, paragraphs, and estimated reading or speaking time in pasted text.`,
    metaDescription: `Count words, characters, sentences, paragraphs, and estimated reading or speaking time in your browser. Useful for limits, drafts, scripts, and posts.`,
    intro: `Use the Word Counter when a draft has a limit, a post needs trimming, or a script needs a rough timing check. Paste text to see words, characters with and without spaces, sentences, paragraphs, reading time, and speaking time. The tool is best for English-style text separated by spaces, and sentence counts are approximate because punctuation and abbreviations can vary.`,
    outcomeLine: "Check draft length, character limits, sentence density, and rough read-aloud timing before you submit or publish.",
    howTo: [
      "Paste or type your text into the textarea.",
      "Review the live word, character, sentence, paragraph, and time estimates.",
      "Compare characters with spaces and without spaces when a form uses a strict limit.",
      "Use the long-sentence hint as a quick readability signal, not as a grammar judgement.",
      "Copy your revised text after checking the updated counts.",
    ],
    examples: [
      {
        title: "Essay or assignment limit",
        body: "Paste a draft to see whether it is near a 500-word, 1,000-word, or 1,500-word target before editing.",
      },
      {
        title: "Article reading time",
        body: "Use the reading-time estimate to decide whether a post needs a shorter intro or clearer section breaks.",
      },
      {
        title: "Presentation script",
        body: "Use speaking time to check whether a script is likely to run long when read aloud.",
      },
    ],
    faq: [
      {
        q: "How does a word counter count words?",
        a: `A word counter usually counts each separated text chunk as one word after splitting on whitespace. This works well for English-style drafts, essays, and posts, but it can undercount languages that do not use spaces between words. Punctuation and hyphenation can also differ from another editor’s formula.`,
        faq_intent: "definition",
      },
      {
        q: "What is the difference between characters with spaces and without spaces?",
        a: `Characters with spaces include letters, punctuation, numbers, and blank spaces; characters without spaces remove whitespace from that total. Both counts matter because forms, social platforms, and metadata fields do not always use the same rule. Check the exact requirement before deciding which number to use.`,
        faq_intent: "comparison",
      },
      {
        q: "Can I use this word counter for essays, posts, and scripts?",
        a: `Yes, the word counter is useful for drafts where length, readability, or estimated timing matters. It can help with essays, blog posts, social captions, newsletters, and scripts. Treat the timing estimates as planning numbers, especially for speeches where pauses and delivery style change the result.`,
        faq_intent: "how-to",
      },
      {
        q: "Why is the sentence count different from my document editor?",
        a: `Sentence count can differ because this tool estimates sentence breaks from punctuation patterns, not a full grammar parser. Abbreviations, headings, ellipses, initials, and unusual punctuation can make one counter split text differently from another. Use the sentence count for a readability signal, not as an official measurement.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does the word counter keep my text private?",
        a: `The tool runs in the browser, so pasted text does not need a server round trip for counting. That makes it appropriate for routine draft checks. For highly sensitive text, still follow your own privacy rules and avoid pasting content anywhere unnecessarily.`,
        faq_intent: "trust",
      },
      {
        q: "Can the word counter handle Chinese, Japanese, or Thai text?",
        a: `The word count can be inaccurate for languages that do not separate words with spaces. The tool treats text as English-style whitespace-delimited writing, so non-whitespace-delimited scripts may look like far fewer words than expected. Character counts are usually more useful for those cases.`,
        faq_intent: "edge-case",
      },
    ],
    useCases: [
      "Check essay, application, or assignment length against a target.",
      "Trim a blog post, newsletter, product description, or social caption.",
      "Estimate article reading time before publishing.",
      "Estimate speaking time for scripts, talks, podcasts, or classroom presentations.",
      "Compare character counts with and without spaces for form fields.",
    ],
    commonMistakes: [
      "Treating estimated reading time as exact for every reader.",
      "Using sentence count as a formal grammar measure.",
      "Ignoring whether a character limit includes spaces.",
      "Expecting accurate word counts for languages without spaces between words.",
      "Comparing counts across tools without checking their word-count formulas.",
    ],
    limitations: [
      "Whitespace-based word counts are not ideal for Chinese, Japanese, Thai, and similar scripts.",
      "Sentence detection is approximate and punctuation-based.",
      "Paragraph count depends on blank-line separation.",
      "Reading and speaking times are estimates, not personalized measurements.",
      "Longest-word detection may include attached punctuation.",
    ],
  },
  "letter-counter": {
    description: `Count characters, no-space characters, ASCII letters, digits, vowels, consonants, punctuation, and letter or digit frequency.`,
    metaDescription: `Count characters, spaces, ASCII letters, digits, vowels, consonants, punctuation, and frequency in pasted text. Browser-side letter counter.`,
    intro: `Use the Letter Counter when character length and letter frequency matter more than total words. Paste text to see character counts with and without spaces, ASCII letter and digit totals, vowel and consonant counts, punctuation, and a sorted frequency list. The frequency breakdown is case-insensitive and focused on a-z letters plus 0-9 digits, so accented letters, emoji, and non-Latin scripts need careful interpretation.`,
    outcomeLine: "See character totals and the most common ASCII letters or digits in a block of text.",
    howTo: [
      "Paste or type text into the textarea.",
      "Review character counts with spaces and without spaces.",
      "Use the frequency chips to see which ASCII letters or digits appear most often.",
      "Check vowel, consonant, digit, and punctuation totals for quick structure clues.",
      "Switch to Word Counter when the main question is draft length rather than letter frequency.",
    ],
    examples: [
      {
        title: "Short phrase",
        body: "For “Hello World,” the tool shows total characters, no-space characters, and a case-insensitive frequency list.",
      },
      {
        title: "Game rack or puzzle clue",
        body: "Paste a small set of letters to see repeated vowels, consonants, or digits at a glance.",
      },
      {
        title: "Character-limited field",
        body: "Use characters with spaces when the field counts every visible blank; use no-space count only when the rule asks for it.",
      },
    ],
    faq: [
      {
        q: "What does a letter counter count?",
        a: `A letter counter counts character totals and breaks ASCII letters into frequency, vowels, and consonants. This tool also reports digits and punctuation. The frequency list is case-insensitive, so “A” and “a” share one bucket rather than appearing as separate letters.`,
        faq_intent: "definition",
      },
      {
        q: "How is letter frequency calculated?",
        a: `Letter frequency is calculated by counting each a-z letter and 0-9 digit after lowercasing the text. The list is then sorted by count so the most common entries appear first. Non-ASCII symbols do not become letter-frequency chips in the current implementation.`,
        faq_intent: "how-to",
      },
      {
        q: "Does the letter counter count uppercase and lowercase separately?",
        a: `No, uppercase and lowercase versions of the same ASCII letter are counted together in one frequency bucket. For example, “A,” “a,” and repeated mixed-case versions all increase the same “a” frequency. This is useful for frequency analysis but not for auditing capitalization patterns.`,
        faq_intent: "comparison",
      },
      {
        q: "Can the letter counter count emoji or accented letters as letters?",
        a: `Emoji, accented letters, and non-Latin scripts are not counted as letters in the frequency breakdown. They may still affect total character or punctuation-like buckets depending on how the browser represents the string. Use the totals carefully when text contains complex Unicode characters.`,
        faq_intent: "edge-case",
      },
      {
        q: "Why are letters lower than my total character count?",
        a: `The letter total can be lower because spaces, punctuation, digits, emoji, and non-ASCII characters are not ASCII letters. The total character count includes much more text structure than the a-z frequency list. This is expected for sentences, names with accents, and symbol-heavy text.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Is this letter counter private?",
        a: `The letter counter runs in the browser, so routine counting can happen without sending text to a server. That makes it useful for quick checks. For confidential work, still follow your organization’s rules about where sensitive text may be pasted.`,
        faq_intent: "trust",
      },
    ],
    useCases: [
      "Check character length for fields, captions, and snippets.",
      "Find the most common letters or digits in a short text sample.",
      "Review vowel/consonant balance for word games or classroom exercises.",
      "Inspect digit frequency in small plain-text lists.",
      "Compare letter count with word count when a requirement is ambiguous.",
    ],
    commonMistakes: [
      "Assuming accented letters are counted as ordinary letters.",
      "Expecting emoji to behave like one simple character in every output bucket.",
      "Using letter frequency as a full cryptogram-solving tool.",
      "Comparing uppercase and lowercase as separate categories.",
      "Treating punctuation count as only ASCII punctuation when non-ASCII symbols may fall there.",
    ],
    limitations: [
      "Frequency chips include only ASCII letters and digits.",
      "Accented letters, emoji, and non-Latin scripts are not treated as letters.",
      "No bigram, trigram, word-frequency, or cryptogram-specific analysis.",
      "Case is not preserved in the frequency list.",
      "Complex Unicode characters may count differently than users visually expect.",
    ],
  },
  "case-converter": {
    description: `Convert pasted text between uppercase, lowercase, Title Case, sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE.`,
    metaDescription: `Convert text to uppercase, lowercase, Title Case, sentence case, camelCase, snake_case, kebab-case, or CONSTANT_CASE in your browser.`,
    intro: `Use the Case Converter when text has the right words but the wrong capitalization or identifier style. Paste a phrase, headline, tag list, or code label, then choose one of eight modes. The tool is a fast string transformer, not a style-guide editor: Title Case capitalizes each word, sentence case is punctuation-based, and identifier modes split on non-alphanumeric characters.`,
    outcomeLine: "Switch text between common writing and code-style case formats without retyping it.",
    howTo: [
      "Paste or type text into the input area.",
      `Choose the case style: uppercase, lowercase, Title Case, sentence case, camelCase, snake_case, kebab-case, or CONSTANT_CASE.`,
      "Review the converted output and the length-change summary.",
      "Copy the result into your draft, list, filename, or code context.",
      "For formal headlines, review style-guide exceptions manually.",
    ],
    examples: [
      {
        title: "Headline cleanup",
        body: "“summer reading list” can become “Summer Reading List” for a simple title-style heading.",
      },
      {
        title: "Code identifier",
        body: "“Customer Status Label” can become “customerStatusLabel,” “customer_status_label,” or “customer-status-label.”",
      },
      {
        title: "List normalization",
        body: "Convert a pasted tag list to lowercase before sorting or deduping it.",
      },
    ],
    faq: [
      {
        q: "What case styles does the case converter support?",
        a: `The case converter supports eight modes: uppercase, lowercase, Title Case, sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE. Each mode transforms the pasted text immediately. The identifier modes are useful for labels, filenames, CSS-like tokens, and simple programming names.`,
        faq_intent: "definition",
      },
      {
        q: "Is the Title Case mode AP, Chicago, APA, or MLA style?",
        a: `No, the Title Case mode capitalizes the first letter of each word rather than applying stylebook exceptions. Small words such as “a,” “of,” and “the” are not automatically handled by AP or Chicago rules. Formal publication headlines still need manual review.`,
        faq_intent: "comparison",
      },
      {
        q: "How does camelCase or snake_case conversion work?",
        a: `Identifier-style conversion trims the text, splits it on non-alphanumeric runs, and joins the remaining tokens. That makes it fast for simple labels, but apostrophes, hyphens, and accented characters can be removed or changed in ways that do not round-trip the original text.`,
        faq_intent: "how-to",
      },
      {
        q: "Can the case converter handle multiple lines?",
        a: `Yes, the converter accepts multi-line input and returns converted output in the same page flow. Sentence case still depends on punctuation rather than every line break, so a new line may not automatically start with a capital letter unless punctuation creates a new sentence.`,
        faq_intent: "edge-case",
      },
      {
        q: "Why did punctuation, accents, or hyphens disappear?",
        a: `Punctuation and some non-ASCII characters can disappear in identifier modes such as camelCase, snake_case, kebab-case, and CONSTANT_CASE. Those modes split on non-alphanumeric characters, then rebuild a clean identifier. Use uppercase, lowercase, Title Case, or sentence case when preserving prose punctuation matters.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does this case converter keep my text private?",
        a: `The case conversion runs in the browser, so ordinary transformations do not need server processing. That keeps quick formatting tasks lightweight. Sensitive text still deserves caution, especially when browser extensions, shared devices, or workplace policies affect what can be pasted.`,
        faq_intent: "trust",
      },
    ],
    useCases: [
      "Fix all-caps or all-lowercase pasted text.",
      "Prepare simple headlines, labels, or section titles.",
      "Normalize tags before sorting or removing duplicates.",
      "Convert human-readable labels into camelCase, snake_case, kebab-case, or CONSTANT_CASE.",
      "Clean inconsistent capitalization in short lists.",
    ],
    commonMistakes: [
      "Expecting AP, Chicago, APA, or MLA title capitalization.",
      "Using identifier modes on prose that must preserve apostrophes or accents.",
      "Expecting sentence case to understand proper nouns and acronyms.",
      "Assuming camelCase will preserve existing camelCase boundaries.",
      "Forgetting to review formal names after automated conversion.",
    ],
    limitations: [
      "No AP, Chicago, APA, MLA, or other stylebook-specific title case.",
      "Title and sentence capitalization focus on ASCII first letters.",
      "Identifier modes split on non-alphanumeric characters and may drop accents, apostrophes, or hyphens.",
      "The tool does not understand proper nouns or acronyms.",
      "Existing camelCase boundaries are not preserved as separate words.",
    ],
  },
  "reverse-text": {
    description: "Reverse pasted text by character order, word order, or line order, with copyable output and a simple palindrome hint.",
    metaDescription: `Reverse text by characters, words, or lines in your browser. Preserve word spacing, flip line order, and copy the result quickly.`,
    intro: `Use Reverse Text when you need backwards text, a reversed word order, or a list flipped from bottom to top. Choose character, word, or line mode and copy the result. The tool performs simple string reversal, not visual mirror lettering. Character reversal is code-point based, so complex emoji, flags, skin-tone combinations, and zero-width-joiner sequences may not stay intact.`,
    outcomeLine: "Flip text by characters, words, or lines while keeping the original input visible.",
    howTo: [
      "Paste or type text into the input area.",
      "Choose Characters, Words, or Lines mode.",
      "Review the output and copy it when it matches the intended reversal.",
      "Use Words mode to reverse word order while preserving whitespace groups.",
      "Use Lines mode for lists, logs, or pasted rows.",
    ],
    examples: [
      {
        title: "Character reverse",
        body: "“hello world” becomes “dlrow olleh.”",
      },
      {
        title: "Word reverse",
        body: "“red blue green” becomes “green blue red,” while whitespace groups are preserved.",
      },
      {
        title: "Line reverse",
        body: "A list ordered first-to-last can be flipped so the last line appears first.",
      },
    ],
    faq: [
      {
        q: "What does a reverse text tool do?",
        a: `A reverse text tool flips text order by characters, words, or lines depending on the selected mode. Character mode creates backwards text, word mode reverses word order, and line mode flips a multi-line list from bottom to top.`,
        faq_intent: "definition",
      },
      {
        q: "What is the difference between reverse characters and reverse words?",
        a: `Reverse characters flips every character position, while reverse words keeps each word intact and changes word order. For example, character mode turns “hello world” into “dlrow olleh,” but word mode turns it into “world hello.” Choose based on whether words must stay readable.`,
        faq_intent: "comparison",
      },
      {
        q: "Is reversed text the same as mirror text?",
        a: `No, reversed text changes the order of characters, while mirror text uses special glyphs that look visually reflected. This tool creates backwards character order, word order, or line order. It does not replace letters with mirrored Unicode symbols.`,
        faq_intent: "comparison",
      },
      {
        q: "Can Reverse Text handle emoji correctly?",
        a: `Simple emoji may survive reversal, but complex emoji sequences can break or change appearance after character-order reversal. Flags, family emoji, skin-tone combinations, and zero-width-joiner sequences are made from multiple code points. Because this tool is not grapheme-cluster aware, review emoji-heavy output before copying.`,
        faq_intent: "edge-case",
      },
      {
        q: "Why do reversed lines look odd with Windows line endings?",
        a: `Line mode splits on line-feed characters, so Windows-style CRLF endings can leave carriage-return characters attached. Most ordinary pasted text still looks fine, but some technical files may show odd spacing or hidden characters after reversal. Normalizing line endings would be a useful future upgrade.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Does Reverse Text run in the browser?",
        a: `Yes, Reverse Text is a browser-side string operation for ordinary pasted text and quick text experiments. It does not need dictionaries, accounts, or external lookup. For sensitive text, keep the input visible while working and avoid copying results into untrusted places.`,
        faq_intent: "trust",
      },
    ],
    useCases: [
      "Create backwards text for puzzles, jokes, or hidden-message drafts.",
      "Reverse a list so the last item appears first.",
      "Change word order for quick writing experiments.",
      "Check simple palindromes in character mode.",
      "Teach basic string operations or list ordering concepts.",
    ],
    commonMistakes: [
      "Expecting mirrored glyphs instead of reversed character order.",
      "Assuming complex emoji or flags stay intact.",
      "Using line mode on CRLF-heavy technical files without reviewing output.",
      "Expecting palindrome detection to ignore punctuation.",
      "Using word mode when character-level backwards text is needed.",
    ],
    limitations: [
      "Character reversal is not grapheme-cluster aware.",
      "Flags, ZWJ emoji, and skin-tone sequences may break.",
      "Line mode is not fully CRLF-aware.",
      "Palindrome detection ignores whitespace but not all punctuation.",
      "The tool does not create visual mirror glyphs.",
    ],
  },
  "sort-lines": {
    description: `Sort pasted lines alphabetically, reverse alphabetically, by length, or numerically, with an optional case-sensitive alpha sort.`,
    metaDescription: `Sort lines A to Z, Z to A, by length, or numerically in your browser. Preserves blank lines and shows line, unique, and duplicate counts.`,
    intro: `Use Sort Lines when a pasted list is easier to scan in a consistent order. Paste one item per line, then choose A to Z, Z to A, length ascending, length descending, numeric ascending, or numeric descending. The case-sensitive option affects alphabetical sorting and duplicate-count reporting. The current tool does not perform true natural or version sorting, so item-10 and item-2 are not handled like file names.`,
    outcomeLine: "Reorder a pasted list by alphabet, length, or leading number while keeping the line contents intact.",
    howTo: [
      "Paste text with one item per line.",
      "Choose the sort mode: A to Z, Z to A, length, or numeric.",
      "Turn case-sensitive sorting on only when capitalization must affect alphabetical order.",
      "Review the first and last items after sorting.",
      "Use Remove Duplicate Lines if the stats show duplicates that need cleanup.",
    ],
    examples: [
      {
        title: "Alphabetical list",
        body: "“banana / apple / cherry” becomes “apple / banana / cherry” in A to Z mode.",
      },
      {
        title: "Length review",
        body: "Sort product names by length descending to inspect unusually long entries first.",
      },
      {
        title: "Numeric lines",
        body: "Lines beginning with numbers can be ordered by parseFloat-style numeric value; non-numeric lines behave like zero.",
      },
    ],
    faq: [
      {
        q: "How do I sort lines alphabetically?",
        a: `Paste one item per line and choose the A to Z mode for alphabetical sorting. The tool reorders the lines and leaves their text contents unchanged. Use Z to A when the reverse alphabetical order is easier for review.`,
        faq_intent: "how-to",
      },
      {
        q: "Is the line sorter case-sensitive?",
        a: `The line sorter is case-insensitive by default for alphabetical sorting, with a checkbox for case-sensitive comparisons. That toggle also affects duplicate-count reporting. It does not change length sorting or numeric sorting because those modes compare length or parsed numbers instead of letter case.`,
        faq_intent: "comparison",
      },
      {
        q: "Does Sort Lines remove blank lines?",
        a: `No, blank and whitespace-only lines are preserved as sort entries in the current Sort Lines tool. They may cluster near the top or bottom depending on the mode. Remove or edit blank lines manually before sorting if empty rows should not appear in the output.`,
        faq_intent: "edge-case",
      },
      {
        q: "How does numeric line sorting work?",
        a: `Numeric sorting uses the number parsed from the start of each line, and non-numeric lines behave like zero. This is helpful for simple numbered lists but not for mixed labels, versions, or file names. Review outputs that combine words and numbers.`,
        faq_intent: "definition",
      },
      {
        q: "Does Sort Lines support natural sort for file names?",
        a: `No, the current Sort Lines tool does not provide true natural or version-number sorting for mixed labels. Natural sort would place item-2 before item-10 by comparing numeric chunks. That is a high-priority product upgrade, but it is not an existing feature.`,
        faq_intent: "edge-case",
      },
      {
        q: "Why is alphabetical order different from another app?",
        a: `Alphabetical order can differ because the tool uses browser locale comparison in alpha modes, not one universal collation. Accents, ligatures, punctuation, and case tie-breaks may be handled differently from spreadsheets, code editors, or command-line tools. For ordinary English lists, results should feel familiar.`,
        faq_intent: "troubleshooting",
      },
    ],
    useCases: [
      "Alphabetize names, tags, labels, keywords, or short lists.",
      "Review the shortest or longest items in a word list.",
      "Sort simple numeric lines.",
      "Prepare a list before visual duplicate checking.",
      "Make copied rows easier to scan before importing or editing.",
    ],
    commonMistakes: [
      "Expecting true natural sort for item-2 and item-10.",
      "Assuming blank lines are removed automatically.",
      "Using numeric mode on mixed text without checking non-numeric lines.",
      "Expecting trailing spaces to be ignored in length sorting.",
      "Assuming case sensitivity applies to length or numeric modes.",
    ],
    limitations: [
      "No true natural/version sort.",
      "Blank and whitespace-only lines are preserved.",
      "Length mode counts whitespace characters.",
      "Numeric mode parses leading numbers and treats non-numeric lines as zero.",
      "Alpha sort depends on the browser’s default locale.",
    ],
  },
  "remove-duplicate-lines": {
    description: `Remove exact duplicate lines from pasted text, keeping the first occurrence and optionally preserving original order or sorting unique lines.`,
    metaDescription: `Remove exact duplicate lines from pasted text in your browser. Keep first occurrences, preserve order, or sort unique lines after dedupe.`,
    intro: `Use Remove Duplicate Lines when a pasted list has repeated rows and you only want one copy of each exact line. The tool trims trailing whitespace before comparing, keeps the first occurrence, and can preserve original order or sort the unique result. Matching is case-sensitive and leading whitespace still matters, so use Case Converter first when “Apple” and “apple” should collapse together.`,
    outcomeLine: "Dedupe a plain-text list by exact line match while keeping the input visible for review.",
    howTo: [
      "Paste one item per line into the input area.",
      "Leave Preserve original order on when the first occurrence should stay in place.",
      "Turn Preserve original order off when sorted unique output is preferred.",
      "Review the input, output, removed count, and unique rate.",
      "Use Case Converter first when case-insensitive dedupe is the goal.",
    ],
    examples: [
      {
        title: "Simple list dedupe",
        body: "“apple / banana / apple” becomes “apple / banana,” with the first apple kept.",
      },
      {
        title: "Trailing space cleanup",
        body: "“apple” and “apple ” match because trailing whitespace is stripped before comparison.",
      },
      {
        title: "Case-sensitive result",
        body: "“Apple” and “apple” remain separate lines unless you lowercase the list first.",
      },
    ],
    faq: [
      {
        q: "How do I remove duplicate lines from text?",
        a: `Paste one item per line, then copy the output after the duplicate-line remover keeps the first unique occurrence. The tool reports how many lines went in, how many came out, and how many duplicates were removed.`,
        faq_intent: "how-to",
      },
      {
        q: "Is Remove Duplicate Lines case-sensitive?",
        a: `Yes, the current Remove Duplicate Lines tool is case-sensitive, so capitalization changes matching behavior during comparisons. “Apple,” “apple,” and “APPLE” are treated as different lines. To approximate case-insensitive dedupe today, convert the list to lowercase with Case Converter before removing duplicate lines.`,
        faq_intent: "edge-case",
      },
      {
        q: "Does the duplicate line remover trim whitespace?",
        a: `The tool trims trailing whitespace before comparing lines, but it does not remove leading whitespace. That means “apple” and “apple ” match, while “ apple” and “apple” remain different. This distinction matters for indented lists and copied tables.`,
        faq_intent: "definition",
      },
      {
        q: "Does Remove Duplicate Lines keep the first or last copy?",
        a: `The tool keeps the first occurrence of each unique line and removes later exact matches. It does not currently offer a keep-last mode. Preserve-order mode keeps first occurrences in their original positions; sorted mode sorts the kept unique lines after dedupe.`,
        faq_intent: "comparison",
      },
      {
        q: "Can I sort unique lines after removing duplicates?",
        a: `Yes, turning off Preserve original order returns the kept unique lines in sorted order after dedupe. The sort uses the default JavaScript string comparator, which can differ from the Sort Lines tool for case and diacritic edge cases. Use it for quick sorted uniques, then review.`,
        faq_intent: "how-to",
      },
      {
        q: "Why did two identical-looking lines not dedupe?",
        a: `Two lines can look identical but differ by case, leading spaces, or Unicode composition under the hood. The current tool trims trailing whitespace only and does not normalize Unicode. Check capitalization, indentation, and accented characters when duplicates appear to remain.`,
        faq_intent: "troubleshooting",
      },
    ],
    useCases: [
      "Clean email lists, tag lists, keyword lists, or copied rows.",
      "Collapse repeated entries while keeping first-seen order.",
      "Create a sorted unique list from pasted text.",
      "Prepare import files where duplicate values cause clutter.",
      "Remove accidental repeats from notes, logs, or scraped text when repetition has no meaning.",
    ],
    commonMistakes: [
      "Expecting case-insensitive matching without normalizing case first.",
      "Assuming leading whitespace is ignored.",
      "Removing duplicates from logs where repeated lines indicate frequency.",
      "Expecting fuzzy or near-duplicate detection.",
      "Assuming sorted output uses the same collation as Sort Lines.",
    ],
    limitations: [
      "Matching is case-sensitive.",
      "Only trailing whitespace is trimmed before comparison.",
      "Leading whitespace and Unicode normalization differences still matter.",
      "No fuzzy, near-match, or Levenshtein-style dedupe.",
      "No keep-last or show-removed-lines mode in the current UI.",
    ],
  },
  "reading-time-calculator": {
    description: "Estimate silent reading time and speaking-aloud time from pasted text with adjustable reading and speaking WPM sliders.",
    metaDescription: `Estimate reading time and speaking time for pasted text. Adjust reading and speaking WPM, compare slow/average/fast reference rates, and plan drafts.`,
    intro: `Use the Reading Time Calculator when timing matters more than general text stats. Paste an article, email, script, or speech draft, then adjust reading and speaking words-per-minute sliders. The calculator estimates time from word count divided by WPM. It is a planning tool for English-style text, not a personalized reading-speed test and not a substitute for rehearsing a live script.`,
    outcomeLine: "Estimate how long text takes to read silently or speak aloud at adjustable WPM settings.",
    howTo: [
      "Paste the text you want to time.",
      "Adjust the reading WPM slider for silent reading pace.",
      "Adjust the speaking WPM slider for read-aloud pace.",
      "Compare the large read-time and speak-time cards.",
      "Use the fixed slow/average/fast comparison to understand how pace changes the result.",
    ],
    examples: [
      {
        title: "Article timing",
        body: "A 1,000-word article at 200 WPM is roughly a five-minute silent read.",
      },
      {
        title: "Speech draft",
        body: "A 650-word script at 130 WPM is roughly five minutes before pauses and audience interaction.",
      },
      {
        title: "Email review",
        body: "A long email can be checked for whether it reads like a quick note or a longer memo.",
      },
    ],
    faq: [
      {
        q: "How is reading time calculated?",
        a: `Reading time is calculated by dividing the counted words by the selected words-per-minute pace for the text. For example, 1,000 words at 200 WPM equals about five minutes. The tool formats the result into minutes and seconds for easier planning.`,
        faq_intent: "definition",
      },
      {
        q: "What WPM should I use for reading time?",
        a: `Use the slider value that best matches the audience and text difficulty rather than treating one WPM as universal. The default reading pace is a practical middle setting, while slower or faster values can model dense technical material, casual posts, or skim reading.`,
        faq_intent: "how-to",
      },
      {
        q: "Why is speaking time slower than reading time?",
        a: `Speaking time is slower because reading aloud includes breath, emphasis, pauses, and audience-friendly pacing between phrases. A script that reads quickly in silence can run longer when spoken. Rehearsal is still the best check for presentations, podcasts, and narrated videos.`,
        faq_intent: "comparison",
      },
      {
        q: "Why does this count differ from the Word Counter?",
        a: `Counts can differ because related tools may use different word-count formulas for edge-case punctuation and joined characters. For ordinary English prose, the numbers should be close. When exact counts matter, pick one tool as the source of truth and use it consistently.`,
        faq_intent: "troubleshooting",
      },
      {
        q: "Can the calculator estimate time for slides, images, or code blocks?",
        a: `No, the calculator estimates time from words and WPM only, not from media or layout elements. It does not add time for images, charts, code, tables, audience questions, or pauses between slides. Add a manual buffer when those elements are part of the final experience.`,
        faq_intent: "edge-case",
      },
      {
        q: "Does the reading time calculator keep my text private?",
        a: `The calculator works in the browser for ordinary pasted text and does not need a user account. That makes it convenient for draft timing. For confidential scripts or internal documents, continue following your own security and privacy rules.`,
        faq_intent: "trust",
      },
    ],
    useCases: [
      "Add a read-time estimate to a blog post or article.",
      "Plan a speech, podcast intro, narration, or presentation script.",
      "Estimate homework or study reading time.",
      "Check whether an email or memo is longer than intended.",
      "Compare how timing changes at slow, average, and fast paces.",
    ],
    commonMistakes: [
      "Treating estimated WPM as a guarantee for every reader.",
      "Forgetting pauses, slides, charts, and audience interaction.",
      "Using silent reading pace for spoken scripts.",
      "Comparing exact word counts across different formulas.",
      "Expecting accurate results for languages without spaces between words.",
    ],
    limitations: [
      "Words are counted from whitespace-delimited text.",
      "No timing adjustment for images, tables, code, or pauses.",
      "No personalized reading-speed measurement.",
      "No language detection for non-whitespace-delimited text.",
      "Slider settings are not described as persisted between visits.",
    ],
  },
};

import type { ContentPageConfig } from '../content-pages';

export const SUPPORT_RHYME: ContentPageConfig[] = [
  {
    id: 'cS-how-to-use-rhyme-finder',
    clusterId: 'rhyme',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'how-to-use-a-rhyme-finder',
    guideCategory: 'Rhyme and sound',
    title: 'How to Use a Rhyme Finder to Write Better Poems and Lyrics',
    h1: 'How to Use a Rhyme Finder',
    subhead: 'The three rhyme modes and when each one actually works in a song or poem.',
    outcomeLine: 'Pick the rhyme mode that matches the line, not the one that returns the most words.',
    description: 'Practical walkthrough of a rhyme finder — perfect vs. near vs. slant rhymes, syllable matching, and how to write lines that land.',
    discoverHeadline: 'The rhyme finder mode songwriters use to break writer’s block',
    metaDescription: 'Learn how to use a rhyme finder for poems, songs, and rap lyrics without forcing lines, losing meaning, or ignoring rhythm.',
    keywords: ['how to use rhyme finder', 'rhyme finder guide', 'perfect near slant rhyme'],
    intro: 'A rhyme finder is most useful after you know what the line is trying to say. It can open options, but the writer still chooses the word that fits the meaning, rhythm, and voice.',
    keyPoints: [
      'Start with the idea or image before searching for rhymes.',
      'Search the important landing word, not necessarily the first draft\u2019s last word.',
      'Treat spelling-based results as brainstorming and check them aloud.',
      'Choose meaning first, sound second, and cleverness last.',
      'Use syllable counting after choosing a rhyme so the line still moves naturally.',
    ],
    examples: [
      { title: 'Poem revision', body: 'Change "I feel sad in the rain" into a concrete image, then search rain only if that word still belongs at the line ending.' },
      { title: 'Song chorus', body: 'Use simple, clear matches when the listener needs to understand the hook immediately.' },
      { title: 'Rap draft', body: 'Use results to spark ending words, then build internal echoes and phrase-level sound patterns around them.' },
      { title: 'Greeting card', body: 'Pick a natural rhyme over a clever one. Warmth matters more than surprise.' },
    ],
    whenToUse: [
      { toolId: 'rhyme-finder', note: 'Use to brainstorm spelling-based ending matches and near matches.' },
      { toolId: 'syllable-counter', note: 'Use to compare line length after choosing a rhyme.' },
      { toolId: 'haiku-checker', note: 'Use instead when writing a 5-7-5 haiku, where rhyme is usually not the main goal.' },
    ],
    relatedIds: ['rhyme-finder', 'syllable-counter', 'haiku-checker', 'cE-rhyme-perfect-vs-near', 'cE-syllables-counting-rules', 'cS-how-to-write-a-rhyming-poem'],
    faq: [
      { q: 'How do I use a rhyme finder?', a: 'Write the idea first, choose the word that should land at the line ending, then search that word for rhyme options. Keep the result that supports the meaning and sounds natural aloud.', faq_intent: 'how-to' },
      { q: 'Why do rhyme finder results sometimes sound forced?', a: 'Results sound forced when the writer picks a rhyming word before shaping the sentence. A useful rhyme should support the line\u2019s meaning, not make the sentence sound twisted or unnatural.', faq_intent: 'troubleshooting' },
      { q: 'Should I use the first rhyme I find?', a: 'Not usually. The first rhyme is often obvious, and obvious can be either useful or flat. Test several options, then choose the word that creates the best image, tone, and rhythm.', faq_intent: 'how-to' },
      { q: 'Can a rhyme finder help me write a poem?', a: 'Yes, a rhyme finder can help with one part of poem writing: sound. A good poem also needs a subject, image, line breaks, rhythm, and revision, so use the tool as a draft helper.', faq_intent: 'trust' },
      { q: 'How do I avoid forced rhymes?', a: 'Avoid forced rhymes by writing the sentence naturally before choosing the rhyme. If the rhyming word makes the line awkward, change the landing word, use a near rhyme, or rewrite the couplet.', faq_intent: 'how-to' },
      { q: 'What should I do after finding a rhyme?', a: 'After finding a rhyme, place it inside the full line and read both lines aloud. Then check syllable count and rhythm so the rhyme lands cleanly instead of feeling pasted on.', faq_intent: 'how-to' },
    ],
    longformMarkdown: `## Start with the writing problem, not the tool

A rhyme finder is useful when a line is almost working. Maybe the first line of a couplet is strong, but the second line has no ending. Maybe a song chorus has the right emotion but no memorable hook. Maybe a rap verse needs more sound options. Maybe a classroom poem needs a rhyme scheme and the obvious words feel stale.

The tool solves one problem: it gives possible ending words. It does not decide the poem's subject, the line's image, the speaker's voice, or the rhythm. Those choices still belong to the writer.

That is why the best workflow starts before the search box. Ask what the line is trying to do. Is it naming an image? Turning a thought? Closing a joke? Making a chorus easy to remember? Once the job of the line is clear, a rhyme list becomes useful instead of random.

## Choose the right landing word

The last word of a line carries weight. Readers and listeners hear it as the landing point. Before searching, check whether the current last word is really the word that deserves that position.

Suppose the draft says:

I watched the rain fall outside my window.

If window is the line ending, the rhyme options may push the poem in a narrow direction. But maybe the real energy is rain. A small revision changes the search:

I watched the evening fill with rain.

Now rain becomes the landing word. The [Rhyme Finder](/word-tools/rhyme-finder/) can produce spelling-based ending matches and looser near matches. Those results might include words that point toward weather, memory, travel, or loss. The search is stronger because the line ending is stronger.

## Use results as a possibility list

Kefiw's current Rhyme Finder is spelling-based. It scans a large English word list and groups matches by trailing letter patterns. That makes it fast for brainstorming, but it is not a pronunciation dictionary. Some results may look like rhymes without sounding like rhymes.

This is not a reason to avoid the tool. It is a reason to use it correctly. Treat the results as a possibility list. Pull out words that create useful directions. Then say them aloud with the original line ending.

If the words share spelling but not sound, you have found an eye-rhyme risk. The guide on [why some words look like they rhyme](/guides/why-some-words-look-like-they-rhyme/) explains that problem in more detail. In short: English spelling is not a perfect map of pronunciation.

## Pick meaning before cleverness

A clever rhyme can still be a bad line. The strongest rhyme is the one that makes the poem say something sharper, clearer, or more surprising.

Take the ending rain. Plain may create a quiet scene. Train adds distance and movement. Again brings memory. Remain sounds reflective. Refrain points toward music. The "best" word depends on the poem's direction.

A forced rhyme usually appears when the writer chooses the rhyme first and invents a sentence to reach it. The grammar gets strange. The image becomes vague. The line says less than the previous draft. When that happens, the fix is not to search longer. The fix is to rewrite the thought.

A useful test: cover the rhyming word. Does the rest of the line still sound like something worth saying? If not, the rhyme is doing too much work.

## Match rhythm after choosing the rhyme

Rhyme and rhythm work together. A pair of words may rhyme, but the lines around them can still feel unbalanced. This happens when one line has many more syllables than the other or when the stresses fall awkwardly.

After choosing a rhyme, run the lines through the [Syllable Counter](/word-tools/syllable-counter/). The counts do not need to be identical, but they should make sense for the form. In a song, the line has to fit a melody. In a poem, it has to feel deliberate when read aloud. In rap, it has to sit inside the beat.

For a short rhyming couplet, similar line lengths often help the rhyme land. For a looser modern poem, uneven counts may be fine if the voice supports them. The tool gives numbers; the ear decides whether the numbers work.

## Use the tool differently for poems, songs, and rap

A poem often needs the rhyme to serve an image. If the line becomes abstract only to reach a rhyme, step back and find a more concrete word. A good poem usually benefits from detail: cup, window, gravel, moth, rain, shoe. Concrete nouns give the rhyme something to hold.

A song often needs clarity. The listener hears the line once, especially in a chorus. Simple perfect-sounding rhymes can work well there because they are easy to remember. In verses, looser rhymes may feel more conversational.

Rap often needs density and motion. One-word end rhymes are only the beginning. Use the rhyme list to spark words, then build internal echoes, repeated consonants, phrase rhymes, and rhythmic placement around the beat.

A greeting card or classroom poem usually needs warmth and readability. In that case, natural wording beats complexity.

## A simple poem-writing workflow

Start with one subject: a storm outside the window, a person leaving, a dog at the door, a summer street. Write one plain sentence about it. Then choose the word that deserves the line ending. Search that word in the [Rhyme Finder](/word-tools/rhyme-finder/). Pick three candidates that change the poem in different directions.

Write one possible next line for each candidate. Read all versions aloud. Keep the one where meaning, sound, and rhythm support each other. If none works, change the original line ending and search again.

A rhyme finder does not replace the poem. It gives the writer more doors to open. The craft is choosing which door leads somewhere worth going.

After you choose a few possible rhymes, the next step is shaping them into a poem that still sounds natural. For a full writing workflow, use the [guide to writing a rhyming poem](/guides/how-to-write-a-rhyming-poem/).`,
  },
  {
    id: 'cS-count-syllables-in-a-line',
    clusterId: 'rhyme',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'how-to-count-syllables-in-a-line',
    guideCategory: 'Rhyme and sound',
    title: 'How to Count Syllables in a Line for Poems, Lyrics, and Haiku',
    h1: 'How to Count Syllables in a Line',
    subhead: 'Clap, mark vowels, or use a tool — three methods that agree most of the time.',
    outcomeLine: 'One syllable per vowel sound, compound vowels count once — almost every line resolves by that rule.',
    description: 'Three methods to count syllables in a line of poetry or song lyrics, with examples and edge cases.',
    discoverHeadline: 'How to count syllables in a poem line without saying it aloud',
    metaDescription: 'Learn three practical ways to count syllables in a line, with examples for poems, song lyrics, haiku, rhythm, and common edge cases.',
    keywords: ['how to count syllables in a line', 'syllable counting', 'syllables in poetry'],
    intro: 'Counting syllables in a line helps writers hear whether a poem, lyric, or haiku is balanced. The goal is not only a number. The goal is to make the line sound intentional when spoken.',
    keyPoints: [
      'Count spoken beats, not vowel letters.',
      'Use the clap method when you need a quick ear check.',
      'Use the vowel-group method when you want to inspect the spelling.',
      'Use a tool when you need fast comparison across several lines.',
      'Resolve disagreements by reading the line aloud in the intended voice.',
    ],
    examples: [
      { title: 'Six-beat line', body: 'The cat sat on the mat = six one-syllable words.' },
      { title: 'Seven-beat image', body: 'The moon was low above the road = seven syllables in a natural reading.' },
      { title: 'Haiku line', body: 'old pond in moonlight can work as a five-syllable first line depending on pronunciation.' },
      { title: 'Lyric check', body: 'A line may need fewer words if the melody has fewer available beats.' },
    ],
    whenToUse: [
      { toolId: 'syllable-counter', note: 'Use for full-line and per-word counts.' },
      { toolId: 'haiku-checker', note: 'Use for a line-by-line 5-7-5 check.' },
      { toolId: 'rhyme-finder', note: 'Use after the line length feels right and you need a matching ending.' },
    ],
    relatedIds: ['syllable-counter', 'haiku-checker', 'rhyme-finder', 'cE-syllables-counting-rules', 'cS-how-to-write-a-haiku', 'cS-how-to-write-a-rhyming-poem'],
    faq: [
      { q: 'How do you count syllables in a line?', a: 'Read the line aloud and count each spoken beat, usually one beat per vowel sound. Then check tricky words separately because spelling, accent, and speed can change the final count.', faq_intent: 'how-to' },
      { q: 'What is the clap method for syllables?', a: 'The clap method means saying the line naturally and clapping once for each spoken beat. It works well for beginners because it follows sound rather than spelling.', faq_intent: 'definition' },
      { q: 'Why does line syllable count matter in poetry?', a: 'Syllable count affects rhythm, balance, and how strongly the end of a line lands. Matching or deliberately varying line length can make rhymes, haiku, and song lyrics feel more controlled.', faq_intent: 'definition' },
      { q: 'Should rhyming lines have the same syllable count?', a: 'Rhyming lines do not always need the same syllable count, but similar counts often make simple couplets and lyrics feel smoother. Uneven counts can work when the rhythm is intentional.', faq_intent: 'comparison' },
      { q: 'How many syllables should a haiku line have?', a: 'A classic English classroom haiku uses 5 syllables in line one, 7 in line two, and 5 in line three. Modern haiku may be looser, but 5-7-5 remains a common teaching pattern.', faq_intent: 'definition' },
      { q: 'What if my syllable count sounds different from the tool?', a: 'Use the count that matches your intended spoken version. Automated tools estimate patterns, but performance, accent, and word choice can make a human reading more appropriate for the final draft.', faq_intent: 'troubleshooting' },
    ],
    longformMarkdown: `## Why line syllables matter

A line of poetry or lyric is not just a sentence broken at a margin. It is a sound unit. The number of syllables affects how fast the line moves, how heavy it feels, and how strongly the last word lands.

This matters most when a form has a target. A haiku line may need 5 or 7 syllables. A song lyric may need to fit a melody. A rhyming couplet may sound smoother when the two lines have similar length. Even in free verse, syllable count can explain why one line feels rushed and another feels slow.

Counting does not make the poem good by itself. It gives the writer a way to diagnose rhythm. Once the problem is visible, revision becomes easier.

## Method one: the clap method

The clap method is the quickest ear-based method. Say the line naturally and clap once for each spoken beat. Do not over-pronounce the line just to make the count fit. The goal is to hear how the line would actually be spoken.

For example:

The cat sat on the mat

Each word has one syllable, so the line has six syllables. The claps are easy.

Now try:

The moon was low above the road

A natural reading gives: the / moon / was / low / a-bove / the / road. That is seven syllables. Above has two beats, even though it is one word.

The clap method is especially useful for beginners and for performance writing. If the poem will be spoken, sung, or rapped, the ear matters more than a spelling rule.

## Method two: mark the vowel sounds

The mark method starts from spelling but aims at sound. Underline or notice each vowel group, then decide whether that group creates a separate spoken beat. Queen has the vowel group ee, but it is one syllable. House has ou, but it is one syllable. Meadow has two syllables because the word is spoken mea-dow.

Silent e usually does not add a syllable. Make, hope, time, and name have one syllable. A final le ending may add one: table is ta-ble, and little is lit-tle.

This method is helpful when a line feels wrong but you do not know why. Mark each word, find the longest or trickiest one, and test whether replacing it fixes the rhythm.

## Method three: use a syllable counter

A tool is useful when you have several lines to compare. Paste the draft into the [Syllable Counter](/word-tools/syllable-counter/) and look at the total, per-line comparison, and per-word counts. In Extended mode, the per-word chips can reveal the word that is stretching the line.

This is especially helpful for revision. If a line is supposed to have seven syllables and the tool estimates nine, look for filler words first. Articles, extra adjectives, and explanation words are often easy to cut.

Tools are not final judges. Kefiw's Syllable Counter uses a vowel-group heuristic, not a pronunciation dictionary. It is fast and practical, but words such as fire, poem, every, and family may depend on pronunciation.

## Counting for poems and rhyme

In a rhyming poem, syllable count controls how the rhyme lands. A rhyme at the end of a short line feels different from the same rhyme at the end of a long line. If one line is compact and the next is crowded, the rhyme can feel late or forced.

Take a simple pair:

The moon was low, the road was wide
I kept your letter at my side

The lines have a similar pace. The rhyme of wide and side lands clearly because the rhythm supports it.

If the second line becomes much longer, the rhyme may still be correct but less satisfying. That is why the [Rhyme Finder](/word-tools/rhyme-finder/) and syllable checks work well together. Find a possible ending, then test the line that carries it.

Syllable count is one part of making a rhyming poem feel smooth. The [full poem-writing process](/guides/how-to-write-a-rhyming-poem/) also includes subject, image, rhyme scheme, and revision.

## Counting for songs and rap

Lyrics live inside time. A line that looks fine on the page may have too many syllables for the melody or beat. Sing the line, tap the pulse, and notice which words get squeezed. Those squeezed words often need to be cut or replaced.

Rap adds another layer because syllables can be placed quickly, stretched, compressed, or grouped into internal rhyme. A written syllable count is still useful, but delivery changes how the line feels. Count the draft, then perform it at speed.

For choruses, simpler counts often help. A listener should be able to catch the hook quickly. Verses can carry more variation.

## Counting for haiku

For the common English classroom haiku, the target is 5 syllables, then 7, then 5. Total syllables are not enough. A poem with 17 syllables can still miss the haiku shape if the line pattern is 6-6-5 or 4-8-5.

The [Haiku Checker](/word-tools/haiku-checker/) is built for that specific job. It compares each line to its target and shows which line is over or under.

After the count works, revise for image. A haiku that only explains an emotion can meet 5-7-5 and still feel weak. A concrete image usually carries more power than a statement about how the writer feels.

## What to do when counts disagree

Disagreement is normal. English has dialects, compressed speech, and words with more than one accepted pronunciation. If a tool gives one count and your ear gives another, read the line aloud at the pace you intend.

For strict assignments, use the count your teacher or style guide expects. For poems and lyrics, use the count that fits the performance. The number is a guide. The final test is whether the line sounds deliberate.`,
  },
  {
    id: 'cS-how-to-write-a-haiku',
    clusterId: 'rhyme',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'how-to-write-a-haiku',
    guideCategory: 'Rhyme and sound',
    title: 'How to Write a Haiku: Structure, Image, Season, and the 5-7-5 Trap',
    h1: 'How to Write a Haiku',
    subhead: 'The syllable pattern, the seasonal word, and why good haiku usually break at least one rule.',
    outcomeLine: 'Start with 5-7-5 syllables and a single concrete image — refine later.',
    description: 'A practical guide to writing a haiku in English — the 5-7-5 syllable structure, seasonal word (kigo), and the cut (kireji) concept.',
    discoverHeadline: 'The 5-7-5 haiku rule that kills most English attempts on sight',
    metaDescription: 'Learn how to write an English haiku with 5-7-5 structure, concrete imagery, seasonal reference, a cut or turn, and practical revision steps.',
    keywords: ['how to write a haiku', 'haiku structure', 'haiku syllables'],
    intro: 'A haiku is often taught as a three-line 5-7-5 poem, but the count is only the frame. A stronger haiku usually captures one concrete moment, often from nature, with a turn or contrast that lets the reader feel more than the poem explains.',
    keyPoints: [
      'A common English teaching pattern is 5 syllables, 7 syllables, 5 syllables.',
      'Traditional haiku often include a seasonal reference and a cut or turn.',
      'Concrete images usually work better than abstract feelings.',
      'A valid count does not guarantee a strong haiku.',
      'Revision often means cutting explanation and sharpening the image.',
    ],
    examples: [
      { title: 'Image-first draft', body: 'winter bus stop / one mitten fills with rain / before the light changes' },
      { title: 'Count-only mistake', body: 'I am very sad / because it is raining now / I miss summertime. The count may work, but the poem explains instead of showing.' },
      { title: 'Revision move', body: 'Replace "I am lonely" with a visible detail, such as one cup left beside the sink.' },
      { title: 'Tool use', body: 'Draft first, use the Haiku Checker for 5-7-5, then revise for image and contrast.' },
    ],
    whenToUse: [
      { toolId: 'haiku-checker', note: 'Use to validate the 5-7-5 line pattern.' },
      { toolId: 'syllable-counter', note: 'Use to inspect a single line or ambiguous word.' },
      { toolId: 'rhyme-finder', note: 'Use only for optional sound play, since haiku generally does not need rhyme.' },
    ],
    relatedIds: ['haiku-checker', 'syllable-counter', 'rhyme-finder', 'cS-count-syllables-in-a-line', 'cE-syllables-counting-rules'],
    faq: [
      { q: 'How do you write a haiku?', a: 'Write a haiku by choosing one concrete moment, shaping it into three short lines, and checking the 5-7-5 syllable pattern if that is your target. Then revise for image, contrast, and compression.', faq_intent: 'how-to' },
      { q: 'What is the structure of a haiku?', a: 'The common English haiku structure is three lines with 5, 7, and 5 syllables. Traditional haiku also often use seasonal reference, concrete imagery, and a cut or turn between two parts.', faq_intent: 'definition' },
      { q: 'Does a haiku have to be about nature?', a: 'Traditional haiku often focuses on nature or seasonal moments, but modern English haiku can also capture human scenes. The key is usually a concrete moment rather than an abstract explanation.', faq_intent: 'comparison' },
      { q: 'Do haiku have to rhyme?', a: 'Haiku usually does not rhyme, and forced end rhyme can distract from the image. Sound still matters, but it normally comes from rhythm, word choice, silence, and contrast rather than a rhyme scheme.', faq_intent: 'comparison' },
      { q: 'What makes a haiku good?', a: 'A good haiku usually presents a clear moment, sensory detail, and a turn that lets the reader feel the connection. The syllable count helps shape the poem, but image and compression carry the craft.', faq_intent: 'definition' },
      { q: 'Why is 5-7-5 called a trap?', a: 'The 5-7-5 trap happens when a writer adds filler only to hit the count. The poem may become technically valid but weaker because it explains too much or loses its sharp image.', faq_intent: 'troubleshooting' },
    ],
    longformMarkdown: `## What a haiku is in English

A haiku is often introduced as a three-line poem with 5 syllables in the first line, 7 in the second, and 5 in the third. That pattern is a useful starting point, especially in English classrooms. It gives the poem a small frame and forces the writer to compress.

But haiku is more than arithmetic. A strong haiku usually presents a concrete moment, often connected to nature or season, and lets the reader feel a relationship between two images. It does not explain everything. It leaves space.

That is the challenge. The count is easy to test. The craft is harder: choosing the right image, cutting away filler, and finding a turn that makes the poem open instead of merely ending.

## Start with one concrete moment

Begin with something visible, audible, or physical. A haiku works best when it gives the reader something to notice. Instead of starting with "I feel lonely," start with the object or scene that carries loneliness:

one cup by the sink
rainwater in the dog bowl
no car in the drive

That draft may not be polished, and the count may not be right yet, but it has concrete material. The reader can see the kitchen, the rain, and the empty driveway.

Good haiku subjects are often small: a leaf stuck to a shoe, a porch light in fog, a bee inside a bus window, the first mosquito of summer. The smallness is part of the power.

## Understand the 5-7-5 pattern

The common English teaching pattern is:

Line 1: 5 syllables
Line 2: 7 syllables
Line 3: 5 syllables

The [Haiku Checker](/word-tools/haiku-checker/) is built to test that exact structure. Paste three lines, and it shows whether each line hits its target. If line two has 8 syllables, the checker points you to the line that needs revision.

A 17-syllable total is not enough. The pattern matters line by line. A poem with 6, 6, and 5 syllables still totals 17, but it does not match 5-7-5.

At the same time, modern English-language haiku often bends the count. The tool enforces the traditional classroom target so the writer can know whether the draft matches that goal. Breaking the pattern is a craft choice, not an accident.

## Use season and contrast

Traditional haiku often includes a seasonal reference, sometimes called kigo. In English, this does not have to be a formal seasonal word. Snow, cherry blossom, cicada, heat lightning, school bus, pumpkin stem, and wet leaves can all suggest season.

A haiku also often contains a cut or turn. In Japanese poetics this is associated with kireji, but in English it may appear as punctuation, a line break, or a shift between two images. The turn lets the poem move.

For example:

empty playground
in the drinking fountain
one yellow leaf

The poem does not explain autumn, childhood, or absence. The images carry the feeling. The seasonal clue and the empty place work together.

## Avoid the 5-7-5 trap

The 5-7-5 trap happens when the writer treats the syllable count as the whole poem. To reach 5, 7, and 5, the draft fills with padding: very, really, so much, today, right now. The count becomes correct, but the poem gets weaker.

A count-only draft might say:

I am sad today
because the cold rain is here
winter makes me blue

The pattern may be close, but the poem tells the reader what to feel. A stronger revision uses image:

winter bus stop
rain darkens the paper bag
around my sandwich

This version gives the reader a scene. It does not need to announce sadness.

When a haiku line is short by one syllable, resist adding filler first. Look for a sharper image or a more precise noun. When a line is too long, cut explanation before cutting the image.

## Revise with syllables and sound

After drafting, use the [Syllable Counter](/word-tools/syllable-counter/) to inspect individual lines or confusing words. Words like fire, poem, and every can shift depending on pronunciation. If the count seems wrong, read the line aloud and decide how it will be spoken.

Haiku generally does not need rhyme. In fact, end rhyme can make such a short poem sound artificial. If you use the [Rhyme Finder](/word-tools/rhyme-finder/) for a haiku, use it lightly for sound play inside a line, not as a requirement.

Sound still matters. Repeated consonants, soft vowels, and line breaks can create music without formal rhyme. Read the poem aloud after the count is correct. Notice where the silence falls.

## A practical haiku workflow

First, choose a small moment. Second, write it plainly in three short lines. Third, remove explanation and replace it with sensory detail. Fourth, check the 5-7-5 pattern with the [Haiku Checker](/word-tools/haiku-checker/). Fifth, revise the image again.

The order matters. If you start with the count, you may write filler. If you start with the image, the count becomes a shaping tool.

A haiku is small, but it is not thin. The best versions feel as if the poem notices one thing so clearly that the reader notices more than the words say.`,
  },
  {
    id: 'cS-why-words-look-like-rhymes',
    clusterId: 'rhyme',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'why-some-words-look-like-they-rhyme',
    guideCategory: 'Rhyme and sound',
    title: 'Why Some Words Look Like They Rhyme: Eye Rhymes, False Rhymes, and English Spelling',
    h1: 'Why Some Words Look Like They Rhyme',
    subhead: 'Spelling rhymes, sound rhymes, and the gap between them.',
    outcomeLine: 'English spelling lies about pronunciation — trust your ear, not the page.',
    description: 'Why some words look like rhymes but are not — eye rhymes, dialect differences, and historical pronunciation shifts.',
    discoverHeadline: 'Why “move” and “love” look like rhymes but never actually are',
    metaDescription: 'Learn why some English words look like rhymes but do not sound alike, including eye rhymes, false rhymes, spelling traps, accents, and revision tips.',
    keywords: ['eye rhyme', 'words that look like rhymes', 'false rhyme english'],
    intro: 'English spelling often preserves history better than sound. That is why two words can share the same ending on the page but fail as spoken rhymes. These visual matches are useful to understand because a rhyme that looks right can still sound wrong.',
    keyPoints: [
      'Eye rhymes look similar but do not sound alike.',
      'English spelling has many endings with multiple pronunciations.',
      'Accent and dialect can change whether two words rhyme.',
      'A spelling-based rhyme finder can surface useful ideas but may also surface false rhymes.',
      'The safest test is reading the pair aloud in the voice you intend.',
    ],
    examples: [
      { title: 'Eye rhyme', body: 'love / move look similar, but the vowel sound differs.' },
      { title: 'OUGH trap', body: 'through, rough, though, cough, and bough share spelling patterns but not one pronunciation.' },
      { title: 'Accent-dependent rhyme', body: 'Some speakers merge words that other speakers keep separate, so a rhyme may work in one accent and not another.' },
      { title: 'Tool check', body: 'If a spelling-based result looks promising, say it with the original word before using it.' },
    ],
    whenToUse: [
      { toolId: 'rhyme-finder', note: 'Use for spelling-based brainstorming, then check sound by ear.' },
      { toolId: 'syllable-counter', note: 'Use after choosing a spoken rhyme to compare line length.' },
    ],
    relatedIds: ['rhyme-finder', 'syllable-counter', 'cE-rhyme-perfect-vs-near', 'cS-how-to-use-rhyme-finder', 'cS-how-to-write-a-rhyming-poem'],
    faq: [
      { q: 'What is an eye rhyme?', a: 'An eye rhyme is a pair of words that look like they rhyme because of spelling but do not sound alike when pronounced. Love and move are a common example.', faq_intent: 'definition' },
      { q: 'Why do some words look like they rhyme but do not?', a: 'Some words look like rhymes because English spelling does not always track modern pronunciation. Historical sound changes, borrowed words, and irregular spelling patterns leave many endings visually similar but phonetically different.', faq_intent: 'definition' },
      { q: 'Are eye rhymes acceptable in poems?', a: 'Eye rhymes can be acceptable when used deliberately, especially in page-based poetry. In songs, rap, and spoken poems, they often sound like failed rhymes unless the performance makes the choice clear.', faq_intent: 'comparison' },
      { q: 'How can I tell if two words really rhyme?', a: 'Say both words aloud and compare the stressed vowel and the sounds after it. If only the spelling matches, the pair may be an eye rhyme rather than a reliable spoken rhyme.', faq_intent: 'how-to' },
      { q: 'Can accents change whether words rhyme?', a: 'Yes. Accents can merge or separate vowel sounds, so a pair that rhymes for one speaker may not rhyme for another. For performance writing, use the pronunciation of the intended speaker.', faq_intent: 'edge-case' },
      { q: 'Why can a spelling-based rhyme finder return false rhymes?', a: 'A spelling-based rhyme finder matches written endings, so it can return words that share letters but not sounds. Use those results as brainstorming, then read the pair aloud before keeping it.', faq_intent: 'troubleshooting' },
    ],
    longformMarkdown: `## The page can fool the ear

Some words look like they should rhyme because their endings match on the page. Then we say them aloud and the rhyme disappears. That mismatch is common in English because spelling and pronunciation do not move together neatly.

An eye rhyme is a visual rhyme. The words appear to rhyme, but the sounds do not match. Love and move are a familiar example. The ending looks similar, but the vowel sound is different. Through and rough create the same problem. The letters suggest a connection that the ear does not hear.

This matters for poems, lyrics, and any tool that finds rhymes from spelling. A written list can produce useful ideas, but the final test is sound.

## Why English spelling creates false rhymes

English spelling reflects many layers of history. Some spellings preserve older pronunciations. Some words were borrowed from other languages. Some sound changes affected speech while the spelling stayed fixed. The result is a language where the same letter pattern can produce several sounds.

The ough family is the classic trap. Through, though, rough, cough, bough, and thought all contain ough, but they do not share one ending sound. A writer who matches only the letters may think the words belong together. A listener hears separate sounds.

Other endings create similar problems. Love and move share ove. Head and bead share ead. Ear can sound different in bear, hear, and heart. The page looks orderly; the voice is less predictable.

## Eye rhyme, near rhyme, and failed rhyme

An eye rhyme is not automatically a mistake. In page-based poetry, a poet may use a visual echo deliberately. Older poems may also contain pairs that once sounded closer or were accepted within the poet's accent.

Near rhyme is different. A near rhyme is a partial sound match. It works by ear even though it does not match perfectly. For example, a poet may use similar consonants, related vowels, or a shared final sound to create a softer echo. The guide to [perfect rhymes vs near rhymes](/guides/rhyme-perfect-vs-near/) covers these categories in more detail.

A failed rhyme happens when the poem seems to promise a sound match but the listener hears none. In songs and spoken poems, this is especially noticeable because the ear leads the experience. If a pair only works visually, it may not satisfy the listener.

## Accent and dialect can change the answer

Not every rhyme question has one universal answer. Accents affect vowels, r sounds, and word endings. Some speakers pronounce words as the same sound while others keep them separate. A rhyme that works in one accent may be only a near rhyme in another.

This is not a flaw in the poem. It is part of spoken language. Songwriters often write for their own pronunciation. A performer may bend a vowel to make a rhyme land. A regional poem may depend on the local sound.

When writing for performance, use the intended speaker's pronunciation. When writing for a broad audience, avoid pairs that depend on a very specific accent unless that is part of the voice.

## How tools fit into the problem

Kefiw's [Rhyme Finder](/word-tools/rhyme-finder/) is spelling-based. It scans a large English word list for matching endings and looser ending patterns. That makes it fast for brainstorming, but it also means it can return eye-rhyme risks.

This is different from a pronunciation-aware rhyme engine. A phonetic tool would compare sounds. A spelling-based tool compares letters. Both can be useful, but they should be described honestly.

The best workflow is to use the tool for ideas, then test the best candidates aloud. If a result looks right but sounds wrong, mark it as an eye rhyme and move on. If it sounds close but not exact, decide whether a near rhyme fits the tone.

## A practical test for real rhymes

Use a three-step test. First, say the original word naturally. Second, say the candidate word naturally. Third, compare the stressed vowel and the sounds after it. If they match clearly, the pair is close to a perfect rhyme. If they echo but do not match, it may be a near or slant rhyme. If they only look similar, it is an eye rhyme.

Now put the words inside the full lines. Sometimes two words rhyme in isolation but feel awkward in context because the rhythm does not support them. Use the [Syllable Counter](/word-tools/syllable-counter/) after choosing the pair to check whether the lines carry the rhyme with similar weight.

## How to revise an eye-rhyme problem

If a rhyme fails aloud, do not only search for another word. First ask whether the ending word should change. A stronger line ending may open better options.

For example, a line ending in love often pushes writers toward obvious or false choices. A revision might move the emotional word earlier and end on a concrete image instead: glove, door, rain, cup, light. Concrete endings often create better sound choices and stronger images.

If the poem is meant to be read silently, an eye rhyme can remain as a visual effect. If it is meant to be sung or spoken, choose the sound over the spelling. Rhyme belongs to the ear first.`,
  },
  {
    id: 'cS-how-to-write-a-rhyming-poem',
    clusterId: 'rhyme',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'how-to-write-a-rhyming-poem',
    guideCategory: 'Rhyme and sound',
    title: 'How to Write a Rhyming Poem — Rhyme, Rhythm, and Revision',
    h1: 'How to Write a Rhyming Poem',
    subhead: 'Build a poem from an idea, choose a rhyme scheme, match the rhythm, and revise forced rhymes.',
    description: 'Learn how to write a rhyming poem by choosing a subject, picking a rhyme scheme, using rhyme naturally, checking rhythm, and revising forced lines.',
    discoverHeadline: 'The rhyming poem formula that actually sounds natural out loud',
    metaDescription: 'Learn how to write a rhyming poem with simple steps for choosing a subject, picking a rhyme scheme, matching rhythm, and avoiding forced rhymes.',
    keywords: ['how to write a rhyming poem', 'rhyming poem', 'write a poem that rhymes', 'rhyme scheme', 'poetry writing tips'],
    intro: 'A rhyming poem is not just a list of words that sound alike. A good rhyming poem starts with an idea, builds a pattern, uses rhyme to support meaning, and checks rhythm so the lines feel natural when read aloud. A rhyme finder can help when you are stuck, but the best rhyme is the one that fits the poem\u2019s image, tone, and rhythm.',
    keyPoints: [
      'Start with the poem\u2019s subject or moment before searching for rhymes.',
      'Choose a simple rhyme scheme such as AABB, ABAB, ABCB, or occasional rhyme.',
      'Use rhyme to support the meaning, not to force a sentence into an awkward shape.',
      'Check syllable count and rhythm so matching lines feel balanced.',
      'Say possible rhymes aloud because spelling-based rhymes may not always sound right.',
      'Revise any line that exists only to reach the rhyme.',
    ],
    examples: [
      { title: 'Forced rhyme', body: 'I miss you every single day / I saw a bird that flew away. The rhyme works, but the second line does not add much meaning.' },
      { title: 'Stronger image-based rhyme', body: 'Your cup sits cold beside the sink / I leave it there and try not to think. The rhyme supports a concrete image and emotion.' },
      { title: 'Using a rhyme finder wisely', body: 'If your line ends with rain, possible rhymes like plain, train, remain, refrain, and pain each push the poem in a different direction.' },
    ],
    whenToUse: [
      { toolId: 'rhyme-finder', note: 'Use after you know the line ending you want to explore. Treat results as a starting list, then say candidates aloud.' },
      { toolId: 'syllable-counter', note: 'Use when two rhyming lines feel uneven. Similar syllable counts often make end rhymes land more smoothly.' },
    ],
    relatedIds: [
      'rhyme-finder',
      'syllable-counter',
      'cS-how-to-use-rhyme-finder',
      'cE-rhyme-perfect-vs-near',
      'cS-count-syllables-in-a-line',
      'cS-why-words-look-like-rhymes',
    ],
    primaryCta: { href: '/word-tools/rhyme-finder/', label: 'Rhyme Finder' },
    faq: [
      { q: 'How do you start a rhyming poem?', a: 'Start a rhyming poem by choosing one clear subject, moment, image, or feeling before looking for rhyming words. Once the idea is clear, choose a simple rhyme scheme such as AABB or ABAB. Then draft the lines in plain language before polishing the rhymes.', faq_intent: 'how-to' },
      { q: 'What is the easiest rhyme scheme for beginners?', a: 'The easiest rhyme scheme for beginners is usually AABB because each pair of lines rhymes directly. This pattern is simple to hear and easy to control. ABCB is also beginner-friendly because only the second and fourth lines need to rhyme.', faq_intent: 'definition' },
      { q: 'Why do rhyming poems sound forced?', a: 'Rhyming poems sound forced when the writer chooses the rhyme before the meaning of the line. The sentence may become awkward, vague, or unnecessary just to reach the rhyming word. Write the idea first, then choose a rhyme that supports it.', faq_intent: 'troubleshooting' },
      { q: 'Should every line in a poem rhyme?', a: 'Every line in a poem does not need to rhyme, even in a rhyming poem. Many poems rhyme every other line, only at stanza endings, or only at important moments. Too much rhyme can make a serious poem sound sing-song unless that effect is intentional.', faq_intent: 'comparison' },
      { q: 'How do you make a rhyming poem sound better?', a: 'Make a rhyming poem sound better by matching rhythm, using concrete images, and removing filler lines. Read the poem aloud to hear where the rhyme feels awkward. If a line only exists because it rhymes, rewrite the line or choose another rhyme.', faq_intent: 'how-to' },
      { q: 'Can a rhyme finder write a poem for you?', a: 'A rhyme finder can suggest possible ending words, but it does not decide the poem\u2019s meaning, rhythm, or images. Use it as a brainstorming tool after you know what the line should do. The writer still chooses the best rhyme and revises the poem.', faq_intent: 'trust' },
      { q: 'How do syllables affect a rhyming poem?', a: 'Syllables affect a rhyming poem because line length changes how strongly the rhyme lands. Rhyming lines do not need identical syllable counts, but they should feel balanced when spoken. Counting syllables helps catch lines that are too short, crowded, or uneven.', faq_intent: 'edge-case' },
    ],
    longformMarkdown: `## Start with the poem\u2019s job

A rhyming poem starts before the rhyme. First decide what the poem is trying to do. It might tell a small story, describe a memory, make someone laugh, express grief, celebrate a person, or turn one image into a feeling. The clearer the job, the easier it is to choose rhymes that belong.

A common beginner mistake is starting with a rhyming word and building the whole poem around it. That can work for playful verse, but it often creates forced lines. The sentence starts serving the rhyme instead of the poem. A stronger approach is to write the plain idea first.

For example, the rough idea might be:

I still expect you to walk through the door.

That line may not be polished, but it has a clear feeling. From there, you can decide which word should carry the line: "still," "expect," "walk," or "door." If "door" feels too obvious, revise the line before searching for rhymes. Maybe the real landing word is "hall," "rain," "cup," or "light." The end word matters because the rhyme will make readers notice it.

A [Rhyme Finder](/word-tools/rhyme-finder/) is most useful after you know the emotional direction of the line. It can give you options, but it cannot decide what the poem means.

## Pick a simple rhyme scheme

A rhyme scheme is the pattern of end rhymes in a poem. You can think of each ending sound as a letter. If lines one and two rhyme, they are A and A. If lines three and four rhyme with a different sound, they are B and B.

The easiest rhyme schemes are:

**AABB:** line 1 rhymes with line 2, and line 3 rhymes with line 4. This feels direct and musical. It works well for children\u2019s poems, comic poems, greeting cards, and simple songs.

**ABAB:** line 1 rhymes with line 3, and line 2 rhymes with line 4. This gives the poem more space because each rhyme has a line between it. It often feels more natural for storytelling.

**ABCB:** only lines 2 and 4 rhyme. This is useful when you want the poem to sound musical without making every line rhyme.

**Occasional rhyme:** the poem does not follow a strict pattern, but it uses rhyme at important moments. This can work well for modern poems and spoken-word pieces.

For a first rhyming poem, AABB or ABCB is usually easiest. The pattern gives you structure without making the poem too complicated.

## Write the idea first, then look for rhymes

Once you have a subject and a rhyme scheme, draft the poem in plain language. Do not worry about making every line rhyme immediately. Write what the poem needs to say, then choose which words deserve the strongest position at the end of a line.

Suppose you start with this plain line:

I watched the evening fill with rain.

Now the important ending word is "rain." A rhyme list might suggest words such as plain, train, again, remain, refrain, pain, lane, and stain. Each option changes the poem.

"Pain" makes the poem emotional. "Train" adds movement. "Remain" feels reflective. "Refrain" sounds musical. "Plain" may feel simple or quiet. The best rhyme is not always the cleverest one. It is the one that keeps the poem moving in the right direction.

Because the current rhyme tool is spelling-based, treat its results as a brainstorming list rather than a final pronunciation check. Some words that share letters may not sound like true rhymes, and some words that sound alike may be spelled differently. Say the pair aloud before using it. If the spelling looks right but the sound feels wrong, check the guide on [why some words look like they rhyme](/guides/why-some-words-look-like-they-rhyme/).

## Make rhythm support the rhyme

Rhyme works better when the rhythm feels balanced. Two lines do not need the exact same syllable count, but they should feel natural when read aloud. If one line is short and the next is crowded, the rhyme may land awkwardly even if the rhyming words are correct.

Compare these two lines:

The moon was low, the road was wide
I kept your letter at my side

The lines are close in length, and the rhyme lands cleanly. Now compare:

The moon was low, the road was wide
I kept your old handwritten letter folded carefully at my side

The rhyme is still there, but the second line is much longer. It may work in a song or spoken piece if the rhythm is intentional, but it no longer feels like a simple balanced couplet.

When a rhyme sounds clumsy, count the syllables in each line. The [Syllable Counter](/word-tools/syllable-counter/) can help you compare line lengths quickly. If the counts are far apart, revise by cutting filler words, choosing a shorter phrase, or moving the rhyme to a different word.

## Use images instead of explanations

Strong poems usually show more than they explain. A weak rhyming poem often tells the reader the emotion directly, then uses a rhyme to complete the thought.

For example:

I feel sad today
Because you went away

This is clear, but it is general. The reader understands the emotion, but there is no image to remember.

A more concrete version might be:

Your cup sits cold beside the sink
I leave it there and try not to think

The second version still uses rhyme, but it gives the reader an object, a place, and an action. The emotion comes through the image instead of being named directly.

When revising a rhyming poem, look for abstract words such as sadness, love, beauty, fear, hope, and loneliness. These words are not bad, but they often become stronger when paired with something concrete. Instead of "loneliness," show one chair pushed under the table. Instead of "hope," show a porch light left on.

## Avoid forced and cliché rhymes

A forced rhyme happens when the line bends unnaturally just to reach the rhyming word. The grammar may sound strange, the meaning may become vague, or the line may add nothing except the rhyme.

A quick test helps: cover the rhyming word and ask whether the line still matters. If the line only exists because it rhymes, rewrite it.

Cliché rhymes are not always wrong, but they need care. Common pairs such as love/above, heart/apart, night/light, day/away, and time/rhyme are easy to understand, but they can sound predictable if the surrounding language is also familiar. You can still use them when simplicity is the goal, especially in songs or children\u2019s poems. For a more original poem, look for a different ending word or use a near rhyme.

The guide to [perfect rhymes vs near rhymes](/guides/rhyme-perfect-vs-near/) can help you decide when a clean rhyme is useful and when a looser rhyme sounds more natural.

## Revise by reading aloud

A rhyming poem is meant to be heard, even when it is read silently. The final test is the ear. Read the poem aloud slowly. Mark any place where you stumble, rush, or change your natural pronunciation to make the rhyme work.

During revision, ask five questions:

- Does each line add meaning?
- Does the rhyme sound natural when spoken?
- Are the rhyming lines close enough in rhythm?
- Is there at least one concrete image?
- Would the poem still make sense without the rhyme?

If the answer to any question is no, revise the line before searching for more rhymes. A tool can help you find options, but revision is where the poem becomes yours.

A simple workflow is: write the idea, choose a pattern, draft the lines, search for rhymes, check syllables, read aloud, and revise. That process keeps the rhyme useful without letting it take over the poem.`,
  },
];

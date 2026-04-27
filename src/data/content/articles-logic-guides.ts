import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_LOGIC_GUIDES: ContentPageConfig[] = [
  {
    id: 'art-lg-cognitive-throughput-system',
    clusterId: 'cognitive-throughput',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'cognitive-throughput-guide',
    guideCategory: 'Logic',
    title: 'Cognitive Throughput Guide: Turn Attention Into Usable Output | Kefiw',
    h1: 'Cognitive Throughput Guide',
    subhead: 'A practical way to look at signal, switching, decisions, and focus before the workday collapses.',
    discoverHeadline: 'The hidden workday bottleneck that makes smart people feel slow',
    outcomeLine: 'Use the cognitive-throughput tools to spot where attention is leaking before blaming discipline.',
    description: 'A practical guide to cognitive throughput: signal-to-noise, task switching, decision fatigue, and focus horizon, with formulas, examples, and limits.',
    metaDescription: 'Learn how to use Kefiw cognitive-throughput calculators to model signal-to-noise, task switching, decision fatigue, and focus limits.',
    keywords: ['cognitive throughput', 'attention management', 'task switching cost', 'decision fatigue', 'focus calculator'],
    intro: 'Most people who open this cluster are not trying to diagnose a brain problem. They are trying to understand why a day full of information, meetings, tabs, messages, and small choices produced so little useful output.',
    primaryCta: { href: '/logic/cognitive-throughput/', label: 'Open the cognitive hub' },
    secondaryCtas: [
      { href: '/logic/signal-to-noise/', label: 'Signal-to-noise tool' },
      { href: '/logic/task-switching/', label: 'Task switching tool' },
      { href: '/logic/focus-horizon/', label: 'Focus horizon tool' },
    ],
    keyPoints: [
      'The goal is not to measure intelligence. The goal is to locate the bottleneck in a specific day.',
      'Signal-to-noise asks how much consumed information turns into useful decisions or actions.',
      'Task Switching Tax models the cost of too many concurrent contexts.',
      'Decision Fatigue treats small, medium, and heavy choices as withdrawals from the same daily battery.',
      'Focus Horizon estimates when a focused block is likely to fall below useful quality.',
    ],
    examples: [
      {
        title: 'Information-heavy day',
        body: 'A user reads newsletters, Slack, social feeds, and docs for three hours but makes only two decisions. Signal-to-Noise is the right first calculator.',
      },
      {
        title: 'Meeting-fragmented day',
        body: 'A user has six projects open and fifteen small interruptions. Task Switching Tax explains why the calendar looked open but the brain did not.',
      },
      {
        title: 'Late-day drift',
        body: 'A user can focus well at 9am but cannot review technical work at 4pm. Decision Fatigue and Focus Horizon separate choice load from session length.',
      },
    ],
    whenToUse: [
      { toolId: 'signal-to-noise', note: 'Use when the day felt busy but did not produce many decisions, notes, drafts, or resolved items.' },
      { toolId: 'task-switching', note: 'Use when too many projects, tabs, chats, or meetings split the same work block.' },
      { toolId: 'decision-fatigue', note: 'Use when late-day choices become sloppy even though the tasks are not technically difficult.' },
      { toolId: 'focus-horizon', note: 'Use before a deep-work block to choose a realistic session length and stop point.' },
    ],
    relatedIds: [
      'signal-to-noise',
      'task-switching',
      'decision-fatigue',
      'focus-horizon',
      'art-lg-task-switching-focus',
      'art-lg-decision-fatigue',
    ],
    longformMarkdown: `## What the user is actually trying to do

A cognitive-throughput calculator is useful when someone feels mentally busy but operationally stuck. The user may be a developer trying to finish one hard ticket, a manager moving between meetings, a student reading too much without retaining much, or a founder deciding which input stream deserves attention. They are not asking, "How smart am I?" They are asking, "Where did today's mental capacity go?"

That distinction matters. The Kefiw logic tools should not present themselves as clinical measures, medical screening, or productivity morality. They are simplified operating models. They turn messy workday conditions into numbers that are easy to reason about: how much signal survived the noise, how many contexts are active, how many decisions have been spent, and how much focus quality remains in the current block.

The research backdrop supports the direction, not every coefficient. Task switching has measurable performance costs; Rubinstein, Meyer, and Evans described executive-control stages involved in switching tasks. Sophie Leroy's work on attention residue explains why unfinished prior tasks can keep pulling mental resources after a switch. Decision-fatigue research is more debated than early popular accounts suggested, but reviews still describe choice overload and self-regulation costs as useful practical concepts. Treat these tools as planning heuristics, not lab-grade instruments.

References worth reading: [Rubinstein et al. on task switching](https://doi.org/10.1037/0096-1523.27.4.763), [Leroy on attention residue](https://doi.org/10.1016/j.obhdp.2009.04.002), and this open-access [decision fatigue conceptual analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC6119549/).

## The four meters in the cluster

[Signal-to-Noise](/logic/signal-to-noise/) starts with information intake. Its practical question is: of everything you consumed, how much became usable output? A high-noise day can feel productive because it involved reading, watching, replying, and checking. The output test is harsher. Did it produce a decision, a written summary, a shipped change, a saved reference, or a clear next action?

[Task Switching Tax](/logic/task-switching/) asks how many active contexts are competing. The tool uses a simple rule: each added context consumes part of the remaining capacity. That is not a clinical law. It is a deliberately blunt model that makes hidden overhead visible. If the estimate looks ugly, the answer is usually not "try harder." It is "batch, close, defer, or serialize."

[Decision Fatigue](/logic/decision-fatigue/) treats choices as withdrawals. Trivial choices are cheap, moderate choices cost more, and heavy choices cost much more. The value is not the exact battery percentage. The value is seeing that a day with hundreds of tiny preference calls can leave poor conditions for a genuinely important decision.

[Focus Horizon](/logic/focus-horizon/) models focus quality as decay over minutes. It helps choose a stop point before quality falls apart. A clean 45-minute block that ends with a saved note can beat a two-hour block that ends with rereading the same paragraph.

## Formula, inputs, and assumptions

Each calculator uses a simplified closed-form model. Signal-to-Noise compares useful outputs against information inputs. Task Switching Tax applies a context-overhead curve to available work time. Decision Fatigue weights choice counts by severity. Focus Horizon uses a decay curve over minutes to estimate when quality drops below a useful threshold.

The inputs are intentionally plain: hours, projects, decisions, interruption counts, useful outputs, and planned focus minutes. The assumptions are intentionally visible. These tools do not know sleep, medication, illness, neurodiversity, stress, or workplace politics. They also do not know whether one decision was emotionally loaded or routine. When the model conflicts with lived reality, trust reality and use the mismatch to improve your inputs.

Rounding should be read as direction, not precision. A 64 percent focus estimate is not meaningfully different from 67 percent. A 20 percent switching loss is different from a 60 percent switching loss. Use bands and trends.

## Worked example

Suppose a user starts with eight possible work hours. They have five active project contexts, three meetings, forty low-stakes messages, seven moderate decisions, and two heavy decisions. They also consumed two hours of articles, Slack threads, and docs, but only produced one shipped item and one clear decision.

The first pass through the cluster would be: Signal-to-Noise shows low conversion from input to output. Task Switching Tax shows the five-context day is expensive. Decision Fatigue warns that the two heavy decisions should not be made after the message storm. Focus Horizon suggests scheduling one protected 50-minute block for the hard task, not pretending the scattered afternoon is still deep-work time.

The actual intervention is simple: pick one project for the next block, write a parking-lot note for the other four, batch messages after the block, and move any irreversible decision to the morning. The tool did not do the work. It made the bottleneck visible enough to change the day.

## When not to rely on the tools

Do not use these calculators to label yourself, diagnose attention disorders, prove someone is lazy, or make employment decisions. Do not use them as a substitute for medical or mental-health care. If attention changes are sudden, severe, or impairing daily life, that belongs with a qualified clinician.

Also avoid overfitting. A workday is not a physics experiment. The best use is repeated lightweight logging: run the tools for several representative days, compare estimates with what actually happened, then adjust your routine. The goal is a better operating rhythm, not a perfect score.`,
    faq: [
      {
        q: 'What does cognitive throughput mean?',
        a: 'Cognitive throughput means how much useful output survives after information, switching, decisions, and focus limits take their cut. It is a practical workday concept, not a clinical measurement. Kefiw uses it to group tools that help users find the bottleneck between mental effort and completed action.',
        faq_intent: 'definition',
      },
      {
        q: 'How is cognitive throughput different from productivity?',
        a: 'Productivity usually measures completed work, while cognitive throughput looks at the mental conversion path before output appears. A person can be busy and still have poor throughput if noise, switching, or decision load consumes capacity. The tools help diagnose the leak before judging the result.',
        faq_intent: 'comparison',
      },
      {
        q: 'Can these tools tell me if I have an attention problem?',
        a: 'No, these tools are planning heuristics and cannot diagnose attention, memory, neurological, or mental-health conditions. They can show patterns in a workday, such as too many contexts or overloaded decisions. Sudden or serious attention changes should be discussed with a qualified clinician.',
        faq_intent: 'trust',
      },
      {
        q: 'Why does task switching feel worse than the calendar shows?',
        a: 'Task switching feels worse because unfinished work can keep pulling attention after the visible switch is over. Research on task switching and attention residue supports the idea that switching has real overhead. The calculator makes that invisible overhead explicit enough to plan around.',
        faq_intent: 'definition',
      },
      {
        q: 'Should I use all four cognitive tools every day?',
        a: 'Use all four only during a reset week; most days need just the tool matching the obvious bottleneck. If you are drowning in inputs, use Signal-to-Noise. If projects are colliding, use Task Switching. If choices feel hard, use Decision Fatigue. If a block is dragging, use Focus Horizon.',
        faq_intent: 'how-to',
      },
      {
        q: 'When should I not rely on cognitive-throughput scores?',
        a: 'Do not rely on scores when sleep, illness, acute stress, medication changes, or crisis conditions dominate the day. The calculators do not model those variables. Use them for ordinary planning and pattern recognition, not for medical claims, performance discipline, or high-stakes personal judgments.',
        faq_intent: 'edge-case',
      },
    ],
  },
  {
    id: 'art-lg-task-switching-focus',
    clusterId: 'cognitive-throughput',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'task-switching-focus-guide',
    guideCategory: 'Logic',
    title: 'Task Switching and Focus Horizon: Protect the Work Block | Kefiw',
    h1: 'Task Switching and Focus Horizon',
    subhead: 'How to estimate context overhead, choose a focus block, and stop before quality collapses.',
    discoverHeadline: 'The focus-block mistake that makes a full calendar useless',
    outcomeLine: 'The fastest focus improvement is often fewer active contexts, not longer sessions.',
    description: 'Guide to task switching and focus horizon calculators, including inputs, assumptions, limitations, and a worked planning example.',
    metaDescription: 'Use Kefiw Task Switching Tax and Focus Horizon to estimate context overhead, plan deep-work blocks, and avoid overlong low-quality sessions.',
    keywords: ['task switching', 'focus horizon', 'deep work calculator', 'context switching cost', 'attention residue'],
    intro: 'A user opening these tools is usually trying to protect one serious block of work from the rest of the day. The question is not whether focus matters. The question is how much overhead the current setup has already created.',
    primaryCta: { href: '/logic/task-switching/', label: 'Open Task Switching Tax' },
    secondaryCtas: [
      { href: '/logic/focus-horizon/', label: 'Open Focus Horizon' },
      { href: '/guides/cognitive-throughput-guide/', label: 'Read the cognitive overview' },
    ],
    keyPoints: [
      'Task Switching Tax models active contexts as overhead against available work time.',
      'Focus Horizon models quality decay inside one work block.',
      'The best intervention is usually to reduce context count before extending session length.',
      'A parked note lowers attention residue by giving unfinished work a safe holding place.',
      'Rounding is coarse; use the calculators to compare scenarios, not to claim exact minutes.',
    ],
    examples: [
      {
        title: 'Five contexts before lunch',
        body: 'A developer has bugs, review, incident follow-up, planning, and email all open. The tool shows why two free hours do not behave like two deep-work hours.',
      },
      {
        title: 'Ninety-minute ambition',
        body: 'A writer plans a 90-minute draft but fades after 55 minutes. Focus Horizon suggests a shorter block with a clear save point.',
      },
      {
        title: 'Meeting sandwich',
        body: 'A user has 30 minutes between calls and tries to start complex work. The better move is notes, review, or admin, not deep context loading.',
      },
    ],
    whenToUse: [
      { toolId: 'task-switching', note: 'Use before planning the day or when a supposedly open calendar still feels fragmented.' },
      { toolId: 'focus-horizon', note: 'Use when deciding whether a task needs 25, 45, 60, or 90 minutes of protected attention.' },
      { toolId: 'signal-to-noise', note: 'Use next if the block was protected but still did not convert into useful output.' },
    ],
    relatedIds: [
      'task-switching',
      'focus-horizon',
      'signal-to-noise',
      'art-lg-cognitive-throughput-system',
      'art-lg-decision-fatigue',
    ],
    longformMarkdown: `## What the user is trying to do

Task switching and focus planning usually start with a specific frustration: "I had enough hours, so why did nothing hard get done?" The answer is often that the calendar measured time but ignored context. A one-hour block after four unrelated switches is not the same as a one-hour block after a clean start. A 90-minute block with no written target is not the same as a 45-minute block with a defined finish line.

The [Task Switching Tax](/logic/task-switching/) calculator is for the first problem: too many active contexts. The [Focus Horizon](/logic/focus-horizon/) calculator is for the second: how long a single block can stay useful before quality drops. Used together, they answer a practical question: should you reduce the number of contexts, shorten the block, or move the task to a cleaner part of the day?

Research on task switching consistently shows performance costs when people move between task sets. The exact loss depends on task difficulty, preparation, similarity, and interruption timing. That is why the calculator should be read as scenario comparison, not a biological meter. The useful output is: "This plan with six contexts is worse than this plan with two."

## Formula and inputs

Task Switching Tax starts with available work hours and active contexts. It applies a context-overhead curve to estimate how much capacity remains. The current model deliberately exaggerates the shape enough to make tradeoffs visible: every additional context costs part of what remains. This is closer to a planning warning light than a stopwatch.

Focus Horizon starts with planned minutes and models quality decay over the session. The idea is simple: a hard block is not equally good from minute 1 to minute 120. Many users can do excellent work for 35 to 60 minutes, then continue occupying the chair while quality declines. The calculator helps choose a stop point and a reset rhythm.

Important inputs include number of concurrent projects, expected interruptions, meeting gaps, task difficulty, and planned focus minutes. Important assumptions include reasonable sleep, ordinary stress, and a task that can actually be done in one block. If the task is undefined, the model cannot rescue it.

## Worked example

Assume a product manager has six active contexts: roadmap, incident follow-up, hiring, analytics, customer messages, and a presentation. The calendar shows a two-hour gap. The instinct is to use that gap for the presentation. Task Switching Tax suggests the gap is already contaminated by high context count. The better first action is to close loops: write a parking note for incident follow-up, defer hiring messages, and capture the next analytics question.

After reducing active contexts from six to two, the user opens Focus Horizon. A 120-minute presentation block looks attractive but has a poor quality tail. The better plan is 50 minutes for outline, 10 minutes break, 45 minutes for slides, then stop with a saved next step. That plan gives two strong blocks instead of one long block that fades.

The output is not just a number. It is a revised schedule: protect one context, define the deliverable, choose a block length, and stop while the next action is still clear.

## Common mistakes

The first mistake is counting closed projects as active because they still feel emotionally open. The fix is a parking-lot note. If the next action is written somewhere trustworthy, the brain does not need to keep rehearsing it.

The second mistake is treating all switches as equal. Switching from one bug to a related code review is not the same as switching from a hard design document to an emotionally loaded HR decision. The model uses one curve, so users should adjust inputs conservatively when tasks are unrelated or high-stakes.

The third mistake is stretching blocks because a productivity book said long deep work is ideal. Long blocks are useful only when quality stays high. If the task is cognitively dense, a shorter block with a clean save can be superior.

## How to use the helper without outsourcing judgment

Run two or three scenarios rather than one. Compare six contexts vs. three. Compare 90 minutes vs. 45. Compare starting before messages vs. after messages. The difference between scenarios is more useful than any single score.

Then choose one behavioral change: close tabs, write a parking note, batch messages, move meetings together, or shorten the block. Re-run the calculator after the day and compare against what actually happened. Over a week, the pattern becomes obvious.`,
    faq: [
      {
        q: 'How many active contexts is too many?',
        a: 'More than three active contexts is often where switching overhead becomes obvious for complex knowledge work. The exact number depends on task similarity and urgency. The calculator is best used to compare your own scenarios, such as two active projects versus six active projects.',
        faq_intent: 'definition',
      },
      {
        q: 'Why does a 30-minute gap rarely work for deep focus?',
        a: 'A short gap often gets consumed by setup, prior-task residue, and the need to stop before momentum builds. Thirty minutes can work for review, notes, or admin. It is usually too short for complex work that requires loading a large mental model.',
        faq_intent: 'troubleshooting',
      },
      {
        q: 'Can a parking-lot note really reduce attention residue?',
        a: 'A parking-lot note can help because it gives unfinished work a trusted place to wait. It does not erase emotional stress or urgency, but it reduces the need to keep rehearsing the old task mentally while starting the next one.',
        faq_intent: 'how-to',
      },
      {
        q: 'Should I make focus blocks longer or shorter?',
        a: 'Make focus blocks as long as quality stays useful, not as long as your calendar allows. If output gets sloppy after 50 minutes, use shorter blocks with a written stop point. If quality holds for 90 minutes, longer blocks can make sense.',
        faq_intent: 'comparison',
      },
      {
        q: 'Does the Task Switching Tax calculator measure exact lost time?',
        a: 'No, it estimates overhead with a simplified curve so users can compare workday structures. Real losses vary by person, task type, sleep, stress, interruptions, and preparation. Treat the result as a planning signal, not an exact time audit.',
        faq_intent: 'trust',
      },
      {
        q: 'When should I use Focus Horizon instead of Task Switching Tax?',
        a: 'Use Focus Horizon when one work block is already protected and you need a realistic session length. Use Task Switching Tax when the whole day feels fragmented. If both are true, reduce contexts first, then plan the focus block.',
        faq_intent: 'how-to',
      },
    ],
  },
  {
    id: 'art-lg-decision-fatigue',
    clusterId: 'cognitive-throughput',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'decision-fatigue-workday-guide',
    guideCategory: 'Logic',
    title: 'Decision Fatigue Guide: Spend the Battery on the Right Choices | Kefiw',
    h1: 'Decision Fatigue Guide',
    subhead: 'Model choice load, protect heavy decisions, and stop pretending every choice costs the same.',
    discoverHeadline: 'The tiny choices that quietly drain your best decisions',
    outcomeLine: 'Decision fatigue work is about timing and batching, not blaming yourself for being tired.',
    description: 'Guide to the Decision Fatigue calculator: inputs, weighted choices, assumptions, worked examples, and safe limits.',
    metaDescription: 'Learn how to use Kefiw Decision Fatigue to estimate choice load, batch low-stakes decisions, and protect important decisions.',
    keywords: ['decision fatigue', 'choice overload', 'willpower battery', 'decision fatigue calculator', 'daily decision load'],
    intro: 'People usually reach for a decision-fatigue tool after a day where simple choices started feeling harder than they should. The useful move is not to dramatize the score. It is to protect the decisions that matter.',
    primaryCta: { href: '/logic/decision-fatigue/', label: 'Open Decision Fatigue' },
    secondaryCtas: [
      { href: '/logic/signal-to-noise/', label: 'Open Signal-to-Noise' },
      { href: '/guides/cognitive-throughput-guide/', label: 'Read cognitive overview' },
    ],
    keyPoints: [
      'Decision Fatigue weights trivial, moderate, and heavy choices differently.',
      'The formula is a heuristic for planning, not proof that self-control is a literal battery.',
      'Heavy decisions should usually happen before message storms, errands, and low-value choices.',
      'Batching routine choices preserves attention for irreversible or emotionally loaded choices.',
      'The safest interpretation is trend-based: what drains you repeatedly, not one isolated score.',
    ],
    examples: [
      {
        title: 'Low-stakes drain',
        body: 'A user spends the morning choosing small settings, replies, lunch, calendar changes, and purchases. The afternoon hiring decision now feels worse than expected.',
      },
      {
        title: 'Heavy decision first',
        body: 'A founder moves one strategic decision to the first work block and batches the small choices after lunch.',
      },
      {
        title: 'Noisy input problem',
        body: 'If decision count is low but fatigue is high, Signal-to-Noise may show that the real drain is information intake, not choices.',
      },
    ],
    whenToUse: [
      { toolId: 'decision-fatigue', note: 'Use when late-day choices feel worse than task difficulty predicts.' },
      { toolId: 'signal-to-noise', note: 'Use if the day involved heavy consumption but surprisingly few real decisions.' },
      { toolId: 'task-switching', note: 'Use if choices are scattered across unrelated contexts.' },
    ],
    relatedIds: [
      'decision-fatigue',
      'signal-to-noise',
      'task-switching',
      'art-lg-cognitive-throughput-system',
      'art-lg-task-switching-focus',
    ],
    longformMarkdown: `## What the user is trying to do

A decision-fatigue guide is for someone who suspects the day used up their judgment before the important decision arrived. The user may be deciding whether to accept a project, answer a tense message, buy a tool, approve a design, hire someone, make a health appointment, or choose a school plan. The common pattern is not laziness. It is that too many small choices have crowded the same mental lane.

The [Decision Fatigue](/logic/decision-fatigue/) calculator turns choice load into a visible estimate. Trivial decisions cost little. Moderate decisions cost more. Heavy decisions cost the most. This does not prove that self-control is literally a battery. The literature around ego depletion and decision fatigue has debate and replication concerns. Still, practical choice load is real enough for planning: many people make worse decisions when tired, rushed, emotionally loaded, or overwhelmed by options.

Use the calculator as a scheduling tool. If the heavy decision matters, do not place it after the worst choice storm of the day.

## Formula and inputs

The calculator asks for choice counts by weight. A trivial choice might be selecting an email label, choosing a routine lunch, or picking between two low-stakes options. A moderate choice might be prioritizing tasks, approving a draft, deciding a purchase under a small budget, or choosing a meeting response. A heavy choice might be irreversible, expensive, socially sensitive, or strategically important.

The model assigns heavier withdrawals to heavier choices and estimates remaining capacity. The exact weights are not a scientific law. They are a practical way to stop treating "choose socks" and "approve contract direction" as the same kind of decision.

Useful inputs are approximate counts, not perfect logs. The goal is to compare patterns: twenty small choices before 9am, six moderate choices before lunch, one heavy choice after a conflict. If a score looks high but the day felt easy, your choices were probably more routine than you marked. If the score looks low but the day felt awful, check sleep, stress, interruptions, and unresolved emotional load.

## Worked example

Assume a team lead has thirty trivial choices, eight moderate choices, and three heavy choices scheduled across one day. The heavy choices are compensation feedback, roadmap tradeoff, and whether to delay a launch. The tool shows a large drawdown if all of that happens after a morning of messages.

A better plan is to move one heavy choice into the first focused block, after a short written brief and before communication channels open. The second heavy choice gets a scheduled review with criteria. The third is deferred because the first two are enough for one day. Trivial choices are batched: email labels, meeting responses, and admin approvals happen after lunch.

The calculator did not decide what to do. It changed the order so the person is less likely to make the important call when tired and reactive.

## Common mistakes

The first mistake is counting only formal decisions. Many daily choices are hidden inside browsing, shopping, messaging, and interface work. Every "which tab, which reply, which option, which notification" decision can be small by itself and still expensive in volume.

The second mistake is letting option count explode. Five lunch options are fine. Fifty SaaS vendors, twenty browser tabs, and twelve open messages create comparison fatigue. If the choice matters, define criteria before looking at options. If it does not matter, use a default.

The third mistake is making emotional decisions after cognitive clutter. Social conflict, shame, fear, and urgency increase the cost. If the decision affects another person, write the actual question, wait if possible, and respond from criteria instead of mood.

## How to improve at the underlying activity

Build defaults for low-stakes choices. Same breakfast. Same first work block. Same triage rule for messages. Same template for recurring approvals. Defaults are not boring; they are capacity protection.

For heavy decisions, write the decision as a sentence. List two or three criteria before reviewing options. Decide what evidence would change your mind. If the answer is still unclear, the next action may be information gathering, not deciding.

Use [Signal-to-Noise](/logic/signal-to-noise/) when the problem is too much input, [Task Switching Tax](/logic/task-switching/) when choices are scattered across contexts, and [Focus Horizon](/logic/focus-horizon/) when the decision requires a focused review block.`,
    faq: [
      {
        q: 'What counts as a heavy decision?',
        a: 'A heavy decision is costly, irreversible, emotionally loaded, or likely to affect future options. Examples include hiring calls, major purchases, relationship conversations, launch delays, and strategy choices. The exact category depends on context, so mark conservatively when the consequence feels meaningful.',
        faq_intent: 'definition',
      },
      {
        q: 'How can I reduce decision fatigue quickly?',
        a: 'Reduce decision fatigue quickly by batching low-stakes choices and moving the highest-stakes choice earlier in the day. Defaults help even more: preset meals, message windows, task triage rules, and saved criteria. The goal is fewer fresh choices, not more willpower.',
        faq_intent: 'how-to',
      },
      {
        q: 'Is decision fatigue scientifically proven?',
        a: 'Decision fatigue is supported as a practical pattern, but some popular battery-style claims are debated. Kefiw treats it as a planning heuristic, not a clinical fact. The safest use is comparing your own days and protecting important choices when you know you are overloaded.',
        faq_intent: 'trust',
      },
      {
        q: 'Can too many options make decisions worse?',
        a: 'Too many options can make decisions slower and more stressful, especially when criteria are unclear. Narrow options by defining what matters first: price, time, risk, quality, or reversibility. The tool helps identify load, but criteria do the real cleanup.',
        faq_intent: 'definition',
      },
      {
        q: 'Should I delay important decisions when tired?',
        a: 'Delay important decisions when tired if the decision is reversible enough to wait and no real deadline forces action. If delay is impossible, reduce scope: write criteria, remove extra options, ask for one review, and document why you chose the path.',
        faq_intent: 'edge-case',
      },
      {
        q: 'When should I use Signal-to-Noise instead?',
        a: 'Use Signal-to-Noise when the problem is too much information rather than too many choices. A day of reading, scrolling, watching, and checking may exhaust attention while producing few decisions. In that case, improve input quality before optimizing decision count.',
        faq_intent: 'comparison',
      },
    ],
  },
  {
    id: 'art-lg-geo-arbitrage',
    clusterId: 'logistical-mobility',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'geographic-arbitrage-break-even-guide',
    guideCategory: 'Logic',
    title: 'Geographic Arbitrage Break-Even Guide: When a Move Pays Back | Kefiw',
    h1: 'Geographic Arbitrage Break-Even Guide',
    subhead: 'Use move cost, monthly gain, commute, and risk buffers before treating relocation as free savings.',
    discoverHeadline: 'The moving-cost math people forget before chasing cheaper rent',
    outcomeLine: 'A cheaper city only helps if monthly gain pays back the move before conditions change.',
    description: 'Guide to the Geographic Arbitrage calculator, including formula, inputs, assumptions, limitations, and worked relocation examples.',
    metaDescription: 'Use Kefiw Geographic Arbitrage to estimate moving break-even month from income, living costs, move cost, commute, and risk buffers.',
    keywords: ['geographic arbitrage', 'moving break even calculator', 'relocation math', 'cost of living move', 'migration horizon'],
    intro: 'Someone using a geographic-arbitrage calculator is usually comparing two life configurations. They may want lower rent, a better commute, a remote-work move, family proximity, or a city that makes their current income stretch further.',
    primaryCta: { href: '/logic/geo-arbitrage/', label: 'Open Geographic Arbitrage' },
    secondaryCtas: [
      { href: '/logic/leak-detection/', label: 'Open Subscription Purge' },
      { href: '/guides/upskill-roi-payback-guide/', label: 'Compare upskill payback' },
    ],
    keyPoints: [
      'Formula: break-even months = move cost / monthly net gain.',
      'Monthly gain should include income change, rent, taxes, transport, insurance, utilities, and commute cost.',
      'One-time move costs should include deposits, travel, furniture, overlap rent, fees, and lost work time.',
      'A fast break-even is not the same as a good decision; family, safety, schools, healthcare, and job risk still matter.',
      'Do not use the calculator as real-estate, tax, legal, or financial advice.',
    ],
    examples: [
      {
        title: 'Remote-worker move',
        body: 'Move costs $6,000. Monthly savings after rent, transport, and utilities is $900. Break-even is 6.7 months before risk buffer.',
      },
      {
        title: 'Cheap rent, worse commute',
        body: 'Rent drops $500, but commute and car costs rise $350. The true monthly gain is $150, not $500.',
      },
      {
        title: 'Higher-income move',
        body: 'A new city increases take-home pay by $1,200 but housing rises $700. Net gain is $500 before one-time costs.',
      },
    ],
    whenToUse: [
      { toolId: 'geo-arbitrage', note: 'Use when comparing current location against a possible move or remote-work relocation.' },
      { toolId: 'leak-detection', note: 'Use next if recurring subscriptions are part of the monthly-cost gap.' },
      { toolId: 'upskill-payback', note: 'Use if training or certification is the alternative to moving.' },
    ],
    relatedIds: [
      'geo-arbitrage',
      'leak-detection',
      'upskill-payback',
      'art-lg-upskill-payback',
      'art-lg-subscription-social-utility',
    ],
    longformMarkdown: `## What the user is actually trying to do

Geographic arbitrage sounds like a finance phrase, but the user need is practical: "Would my life work better somewhere else?" The person may be comparing rent, commute, taxes, climate, family support, job access, dating pool, schools, or healthcare. The [Geographic Arbitrage](/logic/geo-arbitrage/) tool only handles the arithmetic layer. It does not decide whether a place is right for a person.

The calculator is useful because move decisions hide one-time costs. Cheaper rent feels obvious, but deposits, overlap rent, moving trucks, furniture, car registration, time off work, travel, and setup costs can delay the payoff for months or years. The tool forces the decision into a break-even frame: how long before the monthly gain has paid back the move?

Use public context carefully. The U.S. Census Bureau explains that the American Community Survey includes commute questions such as travel time and means of transportation, which can inform location comparisons. BLS wage data can inform occupational context. Those sources help with assumptions, but your household numbers still control the calculator.

Useful references: [U.S. Census commuting guidance](https://www.census.gov/topics/employment/commuting/guidance/commuting.html) and [BLS Education Pays](https://www.bls.gov/careeroutlook/2025/data-on-display/education-pays.htm).

## Formula, inputs, and rounding

The core formula is:

break-even months = one-time move cost / monthly net gain

Monthly net gain is destination monthly position minus current monthly position. Current position might be take-home income minus rent, utilities, transport, insurance, childcare, and other recurring costs. Destination position uses the same categories after the move. The difference is the monthly gain or loss.

One-time move cost should include more than the obvious truck or flight. Add deposits, application fees, storage, furniture, utility setup, hotel nights, overlapping rent, lost work time, vehicle changes, and a buffer for surprises. Rounding should be conservative. If the tool returns 5.2 months, call it six or seven. A move rarely runs perfectly.

## Worked example

Suppose the current city has take-home income of $5,000 per month and recurring costs of $4,100, leaving $900. The destination keeps income at $5,000 because the job is remote, but recurring costs fall to $3,250, leaving $1,750. Monthly net gain is $850.

The move costs $7,500 after deposits, travel, mover, furniture, and lost time. Break-even is $7,500 / $850 = 8.8 months. A conservative interpretation is nine to eleven months. If the user expects to stay only six months, the move is not mathematically recovered. If they expect to stay three years, the move may be financially meaningful, assuming the job remains stable.

Now add a commute penalty. If the cheaper location adds $250 per month in fuel, parking, transit, or time cost, the monthly gain falls to $600. Break-even becomes 12.5 months. The move still may be worth it, but it is a different decision.

## Assumptions and limitations

The calculator assumes the user can estimate current and destination costs honestly. It does not know tax law, lease clauses, immigration rules, school quality, crime, medical access, climate risk, or emotional cost. It also cannot price being near family or away from a support system.

Do not treat a favorable break-even month as professional advice. Relocation may involve legal, tax, employment, immigration, real-estate, or financial questions. Those need qualified sources. Kefiw's role is to make the simple arithmetic visible before the user spends money.

## Common mistakes

The most common mistake is comparing rent alone. Rent can fall while transportation, insurance, utilities, or lost time rise. The second mistake is ignoring job risk. If remote work could end, the expected stay length changes. The third mistake is using best-case move costs. Deposits and overlap rent are not edge cases; they are common.

The better workflow is: estimate current monthly position, estimate destination monthly position, add one-time costs, add a buffer, calculate break-even, then decide whether non-math factors still support the move. If the move is really about career payback, use [Upskill ROI](/logic/upskill-payback/) as the alternative scenario. If the move is mostly about monthly cash leaks, run [Subscription Purge](/logic/leak-detection/) first.`,
    faq: [
      {
        q: 'How do I calculate if moving is worth it?',
        a: 'Calculate whether moving is worth it by dividing one-time move cost by monthly net gain after the move. Include rent, income, transport, utilities, deposits, setup costs, and lost work time. Then compare the break-even month against how long you realistically expect to stay.',
        faq_intent: 'how-to',
      },
      {
        q: 'What costs do people forget when moving?',
        a: 'People often forget overlap rent, deposits, furniture, utility setup, storage, travel, lost work time, vehicle costs, and local fees. These costs can turn a move that looks profitable in three months into one that takes a year to recover.',
        faq_intent: 'definition',
      },
      {
        q: 'Is geographic arbitrage just cheaper rent?',
        a: 'No, geographic arbitrage is the full difference between two life configurations, not only cheaper rent. Income, taxes, commute, insurance, utilities, childcare, job access, and support networks all affect whether the move improves the user position.',
        faq_intent: 'comparison',
      },
      {
        q: 'Can this calculator give relocation advice?',
        a: 'No, the calculator only estimates break-even arithmetic and does not provide legal, tax, real-estate, immigration, or financial advice. Use it to structure the math, then verify high-stakes details with qualified professionals and reliable local sources.',
        faq_intent: 'trust',
      },
      {
        q: 'When is a short break-even still a bad move?',
        a: 'A short break-even can still be a bad move when job risk, safety, healthcare, family needs, schools, or isolation outweigh the savings. The tool shows the money timeline. It cannot decide personal fit or quality of life.',
        faq_intent: 'edge-case',
      },
      {
        q: 'Should I include commute time in moving math?',
        a: 'Yes, include commute time when it changes the true cost of the destination. Fuel, transit, parking, maintenance, and lost hours can erase cheap rent. If time has high value for caregiving, study, or recovery, make that cost explicit.',
        faq_intent: 'how-to',
      },
    ],
  },
  {
    id: 'art-lg-upskill-payback',
    clusterId: 'logistical-mobility',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'upskill-roi-payback-guide',
    guideCategory: 'Logic',
    title: 'Upskill ROI Payback Guide: Course, Certificate, or Bootcamp Math | Kefiw',
    h1: 'Upskill ROI Payback Guide',
    subhead: 'Estimate how long a training investment takes to recover without pretending a course guarantees a raise.',
    discoverHeadline: 'The course-payback math to run before buying a credential',
    outcomeLine: 'Training only pays back if credible income gain beats cash cost plus study-time cost.',
    description: 'Guide to the Upskill ROI calculator, including formula, inputs, assumptions, limitations, and a worked payback example.',
    metaDescription: 'Use Kefiw Upskill ROI to estimate payback time for courses, certifications, bootcamps, and training, including opportunity cost.',
    keywords: ['upskill ROI', 'course payback calculator', 'bootcamp ROI', 'certification payback', 'training investment'],
    intro: 'A user opening Upskill ROI is usually not asking whether learning is good. They are asking whether a specific course, certificate, bootcamp, or credential is likely to recover its cost in a realistic timeframe.',
    primaryCta: { href: '/logic/upskill-payback/', label: 'Open Upskill ROI' },
    secondaryCtas: [
      { href: '/logic/geo-arbitrage/', label: 'Compare moving math' },
      { href: '/logic/leak-detection/', label: 'Open Subscription Purge' },
    ],
    keyPoints: [
      'Formula: payback months = total training cost / monthly income gain.',
      'Total cost should include tuition, fees, materials, time, unpaid hours, and delayed earning.',
      'Monthly gain should be probability-adjusted when the raise or job change is uncertain.',
      'BLS data can provide occupation context, but it cannot validate a specific course claim.',
      'Do not treat the calculator as career, financial, or education advice.',
    ],
    examples: [
      {
        title: 'Small certificate',
        body: 'A $900 course plus $600 time cost creates $1,500 total cost. If credible gain is $250 per month, payback is six months.',
      },
      {
        title: 'Bootcamp risk',
        body: 'A $12,000 bootcamp with uncertain placement should be probability-adjusted. A possible $1,500 monthly gain at 40 percent confidence is $600 expected gain.',
      },
      {
        title: 'Employer reimbursement',
        body: 'If an employer reimburses tuition but study time is real, the time cost still belongs in the payback calculation.',
      },
    ],
    whenToUse: [
      { toolId: 'upskill-payback', note: 'Use before buying a course, certification, bootcamp, exam, or formal training path.' },
      { toolId: 'geo-arbitrage', note: 'Use when location change is an alternative path to higher net income.' },
      { toolId: 'leak-detection', note: 'Use if cutting recurring expenses could fund the training without adding risk.' },
    ],
    relatedIds: [
      'upskill-payback',
      'geo-arbitrage',
      'leak-detection',
      'art-lg-geo-arbitrage',
      'art-lg-subscription-social-utility',
    ],
    longformMarkdown: `## What the user is actually trying to do

Upskilling is often sold emotionally: change your life, learn a future-proof skill, become employable, get unstuck. The user need is more concrete. They want to know whether a particular training investment can plausibly pay back. A $79 course, a $900 certification path, a $4,000 part-time program, and a $15,000 bootcamp are not the same decision.

The [Upskill ROI](/logic/upskill-payback/) calculator frames the decision as recovery time. It does not tell users which career to choose. It does not promise income. It does not verify a school's claims. It asks whether the expected monthly gain is large enough to recover the total cost within a timeframe the user can tolerate.

Public labor data can help create conservative assumptions. The Bureau of Labor Statistics publishes education and earnings summaries and occupational outlook data. Those sources describe broad labor-market patterns, not guarantees for one user or one course. Use them to challenge hype, not to outsource judgment.

Reference: [BLS Education Pays, 2024](https://www.bls.gov/careeroutlook/2025/data-on-display/education-pays.htm).

## Formula, inputs, and assumptions

The core formula is:

payback months = total training cost / expected monthly income gain

Total training cost includes tuition, exam fees, books, software, materials, travel, unpaid internship time, and the value of study hours. If the user could have worked paid hours instead, those hours are opportunity cost. If study happens during leisure time, the user may still want to count it because fatigue and family time are not free.

Expected monthly income gain should be conservative. A promised $20,000 salary jump is not the same as a guaranteed raise. If the user estimates a 50 percent chance of achieving a $1,000 monthly gain, the probability-adjusted gain is $500. That doubles the payback period and often reveals whether the offer still makes sense.

Rounding should be cautious. A 5.6-month payback is six or seven months. A 23-month payback should be treated as roughly two years. Precision beyond that is fake because job markets, employer needs, and personal follow-through all change.

## Worked example

A user considers a certification package. Tuition is $1,200. Exam fee is $250. Books and software are $150. Study time is 80 hours. If the user's time is valued at $20 per hour, time cost is $1,600. Total cost is $3,200.

The user believes the certification could support a $400 monthly raise within six months, but the outcome is not guaranteed. They estimate 70 percent confidence because the employer has rewarded similar credentials before. Expected monthly gain is $280.

Payback is $3,200 / $280 = 11.4 months. A conservative reading is one year after the raise materializes, not one year after signing up. If the raise may take six months, the calendar break-even is closer to seventeen or eighteen months from today.

That may still be a good investment, especially if the credential opens future options. The calculator simply prevents the user from treating the best-case headline as the base case.

## Common mistakes

The first mistake is ignoring study time. A cheap course that consumes 200 hours may be more expensive than a focused paid program. The second mistake is using the provider's salary claim as if it applies to every student. Ask what percentage of students get the outcome, how it is measured, and whether the data includes people who did not finish.

The third mistake is comparing training against doing nothing. Real alternatives include negotiating, changing jobs, moving, cutting expenses, building a portfolio, or taking a smaller credential first. Use [Geographic Arbitrage](/logic/geo-arbitrage/) for relocation math and [Subscription Purge](/logic/leak-detection/) if recurring costs could fund training without new debt.

## When not to rely on the tool

Do not rely on Upskill ROI for licensure rules, visa decisions, student loans, tax treatment, accreditation, or professional qualification requirements. Those are high-stakes details that need official sources or qualified advice.

Also do not use the tool to crush every learning decision. Some learning is exploratory, creative, or personally meaningful. The ROI calculator is for career-linked spending where payback matters. If the goal is joy, identity, or curiosity, use a smaller budget and a different standard.`,
    faq: [
      {
        q: 'How do I calculate ROI for a course?',
        a: 'Calculate course ROI by dividing total training cost by expected monthly income gain after completing it. Include tuition, fees, materials, software, exam costs, and study-time value. If the income gain is uncertain, probability-adjust it before calculating payback months.',
        faq_intent: 'how-to',
      },
      {
        q: 'What is a good payback period for upskilling?',
        a: 'A good payback period depends on risk, cash position, and how durable the skill is. Under six months is strong for modest training. One to two years may be reasonable for credible career shifts. Longer payback needs stronger evidence and lower personal risk.',
        faq_intent: 'definition',
      },
      {
        q: 'Should I count study hours as a cost?',
        a: 'Yes, count study hours when they replace paid work, recovery, caregiving, or another scarce resource. Even if no cash leaves your account, time cost can be the largest part of training. Ignoring it makes long courses look cheaper than they are.',
        faq_intent: 'how-to',
      },
      {
        q: 'Can this tool tell me which career to choose?',
        a: 'No, Upskill ROI compares training cost against expected payback and does not choose careers. Career decisions also depend on aptitude, job market, credentials, location, family needs, and risk tolerance. Use the tool for arithmetic, then verify the path separately.',
        faq_intent: 'trust',
      },
      {
        q: 'Is a bootcamp worth it?',
        a: 'A bootcamp may be worth it only if realistic income gain and placement probability recover the total cost fast enough. Use conservative inputs, count study time, ask for completion and placement definitions, and compare against cheaper portfolio or certificate alternatives.',
        faq_intent: 'comparison',
      },
      {
        q: 'When should I not buy a course yet?',
        a: 'Do not buy a course yet when the outcome is vague, the provider hides completion data, or you cannot name the job skill it proves. First define the target role, required evidence, expected monthly gain, and cheaper ways to test interest.',
        faq_intent: 'edge-case',
      },
    ],
  },
  {
    id: 'art-lg-subscription-social-utility',
    clusterId: 'logistical-mobility',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'subscription-purge-social-utility-guide',
    guideCategory: 'Logic',
    title: 'Subscription Purge and Social Utility: Clean Recurring Drains | Kefiw',
    h1: 'Subscription Purge and Social Utility',
    subhead: 'Two different leak checks: one for recurring payments, one for recurring relational drain.',
    discoverHeadline: 'The recurring leaks that drain money, time, and attention quietly',
    outcomeLine: 'Use the tools to find repeat drains, not to make irreversible life decisions from a score.',
    description: 'Guide to Subscription Purge and Social Utility tools, including formulas, inputs, assumptions, limits, and practical cleanup examples.',
    metaDescription: 'Use Kefiw Subscription Purge and Social Utility to review recurring payments and relationship energy patterns without overclaiming.',
    keywords: ['subscription purge', 'subscription cost calculator', 'social utility', 'relationship energy', 'recurring payment audit'],
    intro: 'A user opening this guide is usually dealing with repeat costs. One kind is obvious on a bank statement. The other shows up as repeated stress, conflict, obligation, or support imbalance.',
    primaryCta: { href: '/logic/leak-detection/', label: 'Open Subscription Purge' },
    secondaryCtas: [
      { href: '/logic/connection-check/', label: 'Open Social Utility' },
      { href: '/logic/geo-arbitrage/', label: 'Open Geographic Arbitrage' },
    ],
    keyPoints: [
      'Subscription Purge turns recurring charges into monthly, annual, and long-horizon cost.',
      'Social Utility is a reflection tool for recurring support and drain patterns, not a judgment engine.',
      'The shared idea is recurrence: small repeated costs become large when ignored.',
      'Subscription cleanup should verify cancellation rules and billing dates before assuming savings.',
      'Relationship scores should never replace conversation, context, safety, or professional help.',
    ],
    examples: [
      {
        title: 'Subscription leak',
        body: '$42 per month across forgotten apps looks small until the tool shows $504 per year and $5,040 over ten years before price changes.',
      },
      {
        title: 'Support imbalance',
        body: 'A user realizes one relationship includes repeated crisis support but little reciprocal care. Social Utility helps name the pattern before a conversation.',
      },
      {
        title: 'Move planning',
        body: 'Subscription cuts can increase monthly gain in Geographic Arbitrage by lowering the current cost base before comparing cities.',
      },
    ],
    whenToUse: [
      { toolId: 'leak-detection', note: 'Use when reviewing every recurring charge, trial, subscription, membership, or monthly service.' },
      { toolId: 'connection-check', note: 'Use when reflecting on a repeated relationship pattern, not during acute conflict or safety concerns.' },
      { toolId: 'geo-arbitrage', note: 'Use after recurring-cost cleanup if moving or location change is still on the table.' },
    ],
    relatedIds: [
      'leak-detection',
      'connection-check',
      'geo-arbitrage',
      'upskill-payback',
      'art-lg-geo-arbitrage',
      'art-lg-upskill-payback',
    ],
    longformMarkdown: `## What the user is actually trying to do

Subscription Purge and Social Utility look unrelated until you focus on recurrence. A subscription is a recurring financial drain. A draining relationship pattern is a recurring attention and emotional drain. Kefiw should keep those domains separate and honest: one is arithmetic on payments, the other is a reflection model for patterns between people.

The [Subscription Purge](/logic/leak-detection/) tool helps users list recurring charges and see their monthly, annual, and long-horizon cost. This is useful for trial cleanup, budget resets, app audits, family account reviews, and move planning. It is not financial advice. It simply makes repeated payments visible.

The [Social Utility](/logic/connection-check/) tool helps users weigh support, positive energy, conflict, obligation, and drain. It should not tell someone who to love, leave, date, hire, or trust. It is a mirror for patterns. If there is abuse, coercion, stalking, or safety risk, a calculator is the wrong tool.

Useful references: the CFPB has guidance on unwanted subscription fees and negative-option practices, and NIH/CDC resources discuss social connection as a health-related factor. See [CFPB subscription guidance](https://www.consumerfinance.gov/about-us/newsroom/cfpb-issues-guidance-to-root-out-tactics-which-charge-people-fees-for-subscriptions-they-dont-want/) and [NIH on social bonds](https://newsinhealth.nih.gov/2025/03/build-social-bonds-protect-health).

## Formula and inputs for Subscription Purge

The basic formula is simple:

annual cost = monthly cost x 12

long-horizon cost = monthly cost x 12 x years

The tool can also sum multiple subscriptions. The important input is not only price. Add billing frequency, renewal date, cancellation friction, whether someone else uses it, and whether it replaces a more expensive alternative. A $15 service used daily may be worth keeping. A $6 trial nobody remembers may be pure leak.

Rounding should be conservative. Prices change, taxes apply, and annual plans complicate monthly math. Treat the result as a review prompt: keep, cancel, downgrade, share, replace, or verify.

## Worked example: recurring payments

A user lists seven subscriptions: $9, $12, $15, $18, $6, $21, and $8 per month. Total monthly cost is $89. Annual cost is $1,068. Ten-year cost before price changes is $10,680. The number is not a moral judgment. It is visibility.

After review, the user keeps three services worth $51 per month, cancels two worth $18, downgrades one by $10, and pauses one worth $10. Monthly recovery is $38. That recovery can feed another calculator: it may improve a moving scenario in [Geographic Arbitrage](/logic/geo-arbitrage/) or fund a small training experiment in [Upskill ROI](/logic/upskill-payback/).

## Inputs and limits for Social Utility

Social Utility asks about recurring support and recurring drain. Useful inputs include whether the relationship provides practical help, emotional support, mutual joy, honest challenge, conflict, guilt, volatility, or one-sided obligation. The output is a pattern signal, not a verdict.

The limitations are important. A person can be going through a temporary crisis. A caregiver relationship can be draining and still morally important. A conflict can be repairable. A low score does not mean "cut them off." A high score does not mean "ignore red flags." Human relationships require context, conversation, boundaries, and sometimes professional support.

## Common mistakes

For subscriptions, the big mistake is cancelling before checking whether the service is shared, annual, bundled, or hard to replace. Another mistake is ignoring small charges because they feel embarrassing. The whole point of the tool is that small recurring costs become large over time.

For relationships, the big mistake is using a score to avoid a conversation. If the pattern is safe but disappointing, the next step may be a boundary, request, or honest talk. If the pattern is unsafe, the next step is safety planning and trusted human help, not a calculator.

## What to use next

After Subscription Purge, use [Geographic Arbitrage](/logic/geo-arbitrage/) if recurring savings change relocation math. Use [Upskill ROI](/logic/upskill-payback/) if recovered cash could fund training. After Social Utility, use the result as a note for reflection, not a decision command. The best outcome is clearer language for a pattern you already suspected.`,
    faq: [
      {
        q: 'How do I audit subscriptions quickly?',
        a: 'Audit subscriptions quickly by listing every recurring charge, billing frequency, renewal date, owner, and real usage. Then sort into keep, cancel, downgrade, pause, or verify. The Subscription Purge calculator helps total the monthly and annual cost before you decide.',
        faq_intent: 'how-to',
      },
      {
        q: 'Why do small subscriptions matter?',
        a: 'Small subscriptions matter because recurring charges compound quietly across months and years. A $9 monthly app is $108 per year and $1,080 over ten years before price increases. The tool makes the long-horizon cost visible enough to review honestly.',
        faq_intent: 'definition',
      },
      {
        q: 'Can Social Utility tell me to end a relationship?',
        a: 'No, Social Utility cannot tell you to end a relationship and should not replace context, safety, or conversation. It highlights recurring support and drain patterns. Serious conflict, coercion, abuse, or safety concerns require trusted human support and appropriate professional resources.',
        faq_intent: 'trust',
      },
      {
        q: 'What is the difference between a subscription leak and a useful service?',
        a: 'A subscription leak is recurring cost with little current value, while a useful service earns its place through real use. Frequency, replacement cost, shared access, and importance matter. A cheap unused service can be worse than an expensive service used daily.',
        faq_intent: 'comparison',
      },
      {
        q: 'Should I cancel annual subscriptions immediately?',
        a: 'Do not cancel annual subscriptions blindly; first check renewal dates, refund rules, shared use, and replacement needs. The best action may be turning off auto-renewal today, setting a reminder, or downgrading at the next billing cycle.',
        faq_intent: 'edge-case',
      },
      {
        q: 'When should I use Geographic Arbitrage after subscription cleanup?',
        a: 'Use Geographic Arbitrage after subscription cleanup when recurring savings change your monthly baseline. Lower monthly costs can shorten moving break-even, but they may also make staying viable. Run both scenarios before treating relocation as the only fix.',
        faq_intent: 'how-to',
      },
    ],
  },
];

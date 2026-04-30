import type { ContentPageConfig } from '../content-pages';

const SOURCE_CDC_CAREGIVER_SELF_CARE =
  '[CDC: Healthy Habits - Caring for Yourself When Caring for Another](https://www.cdc.gov/caregiving/caring-for-yourself/index.html)';
const SOURCE_CDC_CARE_PLAN =
  '[CDC: Steps for Creating and Maintaining a Care Plan](https://www.cdc.gov/caregiving/guidelines/index.html)';
const SOURCE_CDC_SLEEP =
  '[CDC: About Sleep](https://www.cdc.gov/sleep/about/index.html)';
const SOURCE_NHLBI_SLEEP =
  '[NHLBI: Sleep Deprivation and Deficiency](https://www.nhlbi.nih.gov/health/sleep-deprivation/health-effects)';
const SOURCE_NCCIH_RELAXATION =
  '[NCCIH: Relaxation Techniques](https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know)';
const SOURCE_988 =
  '[988 Suicide & Crisis Lifeline](https://988lifeline.org/talk-to-someone-now/)';
const SOURCE_MEDLINEPLUS_EMERGENCY =
  '[MedlinePlus: Recognizing medical emergencies](https://medlineplus.gov/ency/article/001927.htm)';
const SOURCE_MEDLINEPLUS_STROKE =
  '[NIH MedlinePlus Magazine: FAST - how to spot a stroke and know when to call 911](https://magazine.medlineplus.gov/multimedia/fast-how-to-spot-a-stroke-and-know-when-to-call-911)';
const SOURCE_MEDLINEPLUS_HEART =
  '[MedlinePlus: Heart attack](https://medlineplus.gov/heartattack.html)';
const SOURCE_MEDLINEPLUS_HEART_FIRST_AID =
  '[MedlinePlus: Heart attack first aid](https://medlineplus.gov/ency/article/000063.htm)';
const SOURCE_CDC_FALLS =
  '[CDC: Older adult falls data](https://www.cdc.gov/falls/data-research/index.html)';
const SOURCE_CDC_FALL_PREVENTION =
  '[CDC: Preventing falls and hip fractures](https://www.cdc.gov/falls/prevention/index.html)';
const SOURCE_CDC_HOME_SAFETY =
  '[CDC: Check for Safety - home fall prevention checklist](https://stacks.cdc.gov/view/cdc/11679)';
const SOURCE_ALZ_WANDERING =
  "[Alzheimer's Association: Wandering and dementia](https://www.alz.org/help-support/caregiving/safety/wandering)";
const SOURCE_ALZ_HOME_SAFETY =
  "[Alzheimer's Association: Home safety](https://www.alz.org/help-support/caregiving/safety/home-safety)";

const sharedWellbeingDisclaimer = `## Kefiw Wellbeing And Health-Adjacent Disclaimer

Kefiw provides educational care-planning tools and guides. This content does not diagnose medical or mental health conditions and does not replace professional medical care, therapy, emergency services, legal advice, financial advice, or insurance advice. If someone may be experiencing a medical emergency, call emergency services immediately. If you are in the U.S. and need mental health crisis support, call or text 988 or use 988 chat.

## Continue Planning With Kefiw

- [Use Stress Check-In](/care/stress-check-in/)
- [Try Mind Reset](/care/mind-reset/)
- [Try Sleep Reset](/care/sleep-reset/)
- [Check Sleep Timing](/care/sleep-timing/)
- [Use the Care Urgency Check](/health/medical-triage/)
- [Run the Care Needs Checklist](/care/care-needs-checklist/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withWellbeingFooter(body: string, reviewer: string, sources: string[]): string {
  return `${body}

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedWellbeingDisclaimer}`;
}

export const CARE_WELLBEING_HEALTH_GUIDE_OVERRIDES: Record<string, Partial<ContentPageConfig>> = {
  'art-care-caregiver-stress-guide': {
    slug: 'caregiver-stress-guide',
    title: 'Caregiver Stress Guide: Signs, Relief Steps, Boundaries, and Support | Kefiw',
    h1: 'Caregiver Stress Guide',
    description:
      'Learn how to recognize caregiver stress, reduce overload, ask for help, protect your health, and use Kefiw\'s Stress Check-In.',
    metaDescription:
      'Learn how to recognize caregiver stress, reduce overload, ask for help, protect your health, and use Kefiw\'s Stress Check-In.',
    primaryCta: { href: '/care/stress-check-in/', label: 'Use Stress Check-In' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/caregiver-burnout-guide/', label: 'Caregiver Burnout Guide' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Stress Builds Quietly

Caregiver stress often starts as a busy season. Then it becomes the default: interrupted sleep, constant calls, doctor appointments, medication questions, bills, family tension, transportation, and the feeling that you are always waiting for the next problem.

Caregiving can be meaningful and loving. It can also become physically and emotionally heavy. CDC caregiver guidance encourages caregivers to take breaks, ask for concrete help, tell their doctor they are caregiving, and use respite or support when possible.

## Plain-English Summary

Caregiver stress is the strain that builds when the demands of care exceed the caregiver's available time, energy, money, sleep, support, or emotional capacity.

The goal is not to eliminate stress completely. The goal is to notice when stress is becoming unsafe or unsustainable, then change the care plan before the caregiver becomes the backup system for everything.

## Common Signs Of Caregiver Stress

- Poor sleep.
- Irritability.
- Resentment.
- Guilt when resting.
- Trouble concentrating.
- Emotional numbness.
- Crying more often.
- Feeling trapped.
- Avoiding calls.
- Missing your own appointments.
- Eating poorly.
- Getting sick more often.
- Feeling like no one understands the workload.

## The Kefiw Stress Map

When a caregiver says, "I am stressed," Kefiw should help them identify which kind of stress it is.

### 1. Time Stress

There are too many care tasks and not enough hours.

### 2. Decision Stress

The caregiver is making too many choices without enough information.

### 3. Safety Stress

The loved one may be unsafe, and the caregiver feels responsible for preventing every bad outcome.

### 4. Money Stress

Care costs, missed work, supplies, transportation, and family contributions are unclear.

### 5. Family Stress

Siblings, spouses, or relatives disagree about what to do or who should help.

### 6. Emotional Stress

The caregiver is carrying fear, grief, guilt, anger, love, and responsibility all at once.

## What Families Often Miss

Caregiver stress is not always solved by a bath, a walk, or a motivational quote.

Sometimes stress is a signal that the care plan is underbuilt. A caregiver may not need "better self-care." They may need another person to own appointments, paid help for bathing, a medication system, respite care, a family budget, a home safety fix, a clear emergency plan, or a realistic conversation about assisted living, memory care, or more support.

## Kefiw Tip: Ask For A Block, Not Vague Help

Vague request:

"I need help."

Clear request:

"I need someone to cover Tuesdays from 3 to 6 p.m. for the next four weeks."

CDC suggests identifying a caregiving task or block of time where help is needed and using a shared calendar so others can schedule regular help. That turns sympathy into coverage.

## Family Script

"I am not saying I want to stop helping. I am saying the current plan depends on me absorbing too much. We need to divide the workload before stress turns into burnout."

## Red Flags

- You feel guilty whenever you rest.
- You are the only person who knows the care routine.
- You are sleeping poorly most nights.
- You are missing work or your own health appointments.
- You feel angry at the person you are caring for.
- You are making care mistakes because you are exhausted.
- You feel like the care plan would collapse if you took one day off.
- You are having thoughts of self-harm or feel unable to stay safe.

For immediate danger, call emergency services. For mental health crisis support in the U.S., the 988 Suicide & Crisis Lifeline is available by call, text, or chat.

## Checklist

- Name your top three stressors.
- Use the Stress Check-In.
- Track caregiving hours for one week.
- Identify one task to stop, one to share, and one to support with paid or outside help.
- Tell your doctor you are a caregiver.
- Ask family for a specific block of time.
- Schedule respite or backup coverage.
- Protect one recurring sleep window.
- Revisit the care plan if stress is becoming constant.`,
      'therapist, clinician, caregiver support specialist',
      [SOURCE_CDC_CAREGIVER_SELF_CARE, SOURCE_CDC_CARE_PLAN, SOURCE_988],
    ),
  },

  'art-care-mind-reset-caregivers': {
    slug: 'mind-reset-for-caregivers',
    title: 'Mind Reset for Caregivers: A Calm Step-by-Step Reset for Overwhelm | Kefiw',
    h1: 'Mind Reset Guide for Caregivers',
    description:
      'Use a short caregiver mind reset to slow racing thoughts, sort urgent from non-urgent, and choose the next smallest step.',
    metaDescription:
      'Use a short caregiver mind reset to slow racing thoughts, sort urgent from non-urgent, and choose the next smallest step.',
    primaryCta: { href: '/care/mind-reset/', label: 'Try Mind Reset' },
    relatedLinks: [
      { href: '/care/stress-check-in/', label: 'Stress Check-In' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## When Your Mind Gets Crowded

A caregiver's mind can get crowded fast. You may be thinking about a parent's fall risk, a missed medication, an unpaid bill, a sibling argument, a doctor's message, a facility invoice, and whether you are doing enough.

Mind Reset is not about pretending everything is fine. It is about slowing the moment down so you can choose the next safe step.

## Plain-English Summary

A mind reset helps users pause, regulate, sort the situation, and act on one next step instead of trying to solve the entire care situation at once.

Relaxation practices such as breathing, progressive muscle relaxation, and guided imagery are commonly used for stress management. Kefiw should present them as supportive techniques, not substitutes for medical care, therapy, emergency services, or professional mental health support.

## The Kefiw 5-Minute Mind Reset

### Step 1: Name The State

Say:

"I am overloaded."

or:

"I am scared."

or:

"I am trying to solve too many things at once."

Naming the state creates distance from it.

### Step 2: Lower The Body Alarm

Try one short reset:

- Unclench your jaw.
- Drop your shoulders.
- Put both feet on the floor.
- Take five slow breaths.
- Exhale longer than you inhale.
- Look around and name five things you can see.

The goal is not perfect calm. The goal is enough steadiness to think.

### Step 3: Separate Urgent From Non-Urgent

Ask:

- Is anyone in immediate danger? If yes, call emergency services.
- Does this need action today? If yes, choose the next step.
- Can this wait until tomorrow? If yes, write it down and stop mentally carrying it.

### Step 4: Choose The Next Smallest Step

Do not choose a life plan. Choose the next action.

Examples:

- Call the doctor.
- Text one sibling.
- Start the Care Needs Checklist.
- Schedule one facility tour.
- Refill the medication.
- Sleep for 30 minutes.
- Write down what happened.
- Use the Senior Care Cost Calculator.

### Step 5: Close The Loop

Say:

"I have chosen the next step. I do not have to solve the entire care situation right now."

## What Families Often Miss

Overwhelm often comes from mixing timelines.

A caregiver may be holding what happened yesterday, what must happen today, what might happen next month, and what could happen in two years. Mind Reset should help users separate: now, next, later, and not mine alone.

## Kefiw Tip: Use The One-Page Worry Sort

Make four columns:

| Now | Schedule | Delegate | Release |
| --- | --- | --- | --- |
| Safety issue | Appointment | Sibling task | Not controllable |
| Medication problem | Facility tour | Insurance call | Old argument |
| Urgent bill | Doctor follow-up | Grocery order | Perfect outcome |

This turns looping thoughts into a visible plan.

## Family Script

"I am overloaded right now, so I am going to pause before I make decisions. I need to sort what is urgent, what can wait, and what I need someone else to own."

## Red Flags

- You feel unable to calm down after the situation passes.
- You are panicking daily.
- You feel detached, numb, or hopeless.
- You cannot sleep for multiple nights.
- You are afraid you may harm yourself or someone else.
- You feel unsafe.

For mental health or suicidal crisis support in the U.S., call or text 988 or use 988 chat. For immediate physical danger, call emergency services.

## Checklist

- Name the feeling.
- Take five slow breaths.
- Check immediate safety.
- Sort the issue into now, schedule, delegate, or release.
- Choose one next step.
- Tell one trusted person what you need.
- Use Mind Reset again before a hard call or family conversation.`,
      'therapist, behavioral health clinician',
      [SOURCE_NCCIH_RELAXATION, SOURCE_988, SOURCE_CDC_CAREGIVER_SELF_CARE],
    ),
  },

  'art-care-sleep-guide-caregivers': {
    slug: 'sleep-guide-for-caregivers',
    title: 'Sleep Guide for Caregivers: Better Rest When Care Disrupts Your Nights | Kefiw',
    h1: 'Sleep Guide for Caregivers',
    description:
      'Learn practical sleep strategies for caregivers dealing with worry, nighttime care, irregular routines, and interrupted rest.',
    metaDescription:
      'Learn practical sleep strategies for caregivers dealing with worry, nighttime care, irregular routines, and interrupted rest.',
    primaryCta: { href: '/care/sleep-reset/', label: 'Try Sleep Reset' },
    relatedLinks: [
      { href: '/care/sleep-timing/', label: 'Sleep Timing' },
      { href: '/care/stress-check-in/', label: 'Stress Check-In' },
      { href: '/care/guides/how-to-sleep-when-worried-about-a-parent/', label: 'Sleep When Worried About a Parent' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Caregiving Can Turn Sleep Into A Negotiation

You may be listening for a parent to get up, waiting for a call from a facility, sleeping near your phone, replaying the day, or worrying about money, medication, falls, and whether the care plan is enough.

Good sleep advice often assumes your life is predictable. Caregiving often is not.

The goal is not a perfect sleep routine. The goal is a protected rest plan that works inside real caregiving constraints.

## Plain-English Summary

Caregivers need both sleep habits and coverage habits.

A bedtime routine helps. But if the caregiver is the only nighttime safety net, sleep will remain fragile.

CDC sleep guidance recommends consistent bed and wake times, a quiet and cool bedroom, turning off electronics before bedtime, avoiding large meals and alcohol before bed, avoiding caffeine later in the day, regular exercise, and healthy routines.

## The Kefiw Sleep Reset Frame

### 1. Stabilize Timing

Pick a realistic wake time first. Then choose a bedtime that gives enough opportunity for sleep.

Do not aim for perfection. Aim for repeatability.

### 2. Reduce Nighttime Decisions

Before bed, write:

- What is handled.
- What can wait.
- Who to call in an emergency.
- What you will do if a nighttime issue happens.

A written plan helps the brain stop rehearsing.

### 3. Protect The First Sleep Block

For many caregivers, the first sleep block is the most valuable.

Ask:

"Can someone else cover the first three hours after I go to bed?"

or:

"Can we set a facility call rule so I am not awakened for non-urgent updates?"

### 4. Plan For Interrupted Nights

If caregiving requires night waking, plan recovery:

- Short nap.
- Later start.
- No major decision first thing.
- Ask someone else to drive.
- Move non-urgent tasks.

### 5. Watch For Sleep Disorder Clues

Persistent trouble falling asleep, repeated waking, breathing pauses, heavy snoring, severe daytime sleepiness, or feeling unsafe because of exhaustion should prompt a conversation with a qualified health professional.

## What Families Often Miss

Caregiver sleep is a safety issue.

When caregivers are exhausted, they may miss medication details, drive while tired, snap during conversations, make rushed decisions, forget follow-up steps, or delay their own medical care.

Protecting sleep protects the care plan.

## Kefiw Tip: Create A Nighttime Call Rule

For facility or family calls, define:

- Call immediately: fall, hospital transfer, new serious symptoms, urgent safety issue.
- Text or message: routine update, supply question, non-urgent paperwork.
- Hold until morning: scheduling, minor preference issues, general updates.

This prevents every notification from becoming an emergency.

## Family Script

"I cannot be the only overnight safety net and still function during the day. We need a nighttime plan that separates urgent calls from things that can wait."

## Red Flags

- You are afraid to sleep.
- You wake repeatedly to check on someone.
- You drive while sleepy.
- You fall asleep during caregiving tasks.
- You have gone several nights with very little sleep.
- You are making mistakes because of exhaustion.
- You feel emotionally unstable from lack of sleep.

## Checklist

- Pick a realistic wake time.
- Turn off non-urgent notifications.
- Write a handled / tomorrow / emergency list before bed.
- Reduce caffeine in the afternoon or evening.
- Create a nighttime call rule.
- Ask for coverage for one protected sleep block.
- Use Sleep Reset or Sleep Timing.
- Talk with a clinician if sleep problems persist.`,
      'sleep clinician, behavioral health clinician',
      [SOURCE_CDC_SLEEP, SOURCE_NHLBI_SLEEP, SOURCE_CDC_CAREGIVER_SELF_CARE],
    ),
  },

  'art-care-sleep-worried-parent': {
    slug: 'how-to-sleep-when-worried-about-a-parent',
    title: 'How to Sleep When You Are Worried About a Parent | Kefiw',
    h1: 'How to Sleep When You Are Worried About a Parent',
    description:
      'Learn how to calm nighttime worry, create a parent safety plan, reduce checking, and protect sleep as a family caregiver.',
    metaDescription:
      'Learn how to calm nighttime worry, create a parent safety plan, reduce checking, and protect sleep as a family caregiver.',
    primaryCta: { href: '/care/sleep-reset/', label: 'Try Sleep Reset' },
    relatedLinks: [
      { href: '/care/sleep-timing/', label: 'Sleep Timing' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Home Safety Checklist' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Nighttime Worry Feels Different

During the day, you can make calls, check tasks, schedule appointments, or ask questions. At night, your mind may replay every risk: falls, confusion, medication, wandering, loneliness, driving, money, and whether you are missing something important.

The answer is not "just stop worrying." The answer is to give your brain a safety plan it can believe.

## Plain-English Summary

Worry often grows when there is no visible plan.

To sleep better, caregivers need to separate real safety risks, unfinished tasks, imagined worst-case scenarios, daytime decisions, and problems that require more care support.

## The Kefiw Nighttime Worry Plan

### Step 1: Write The Worry Exactly

Do not write:

"I am worried about Mom."

Write:

"I am worried Mom will fall walking to the bathroom at night."

Specific worries can be planned for. Vague worries loop.

### Step 2: Mark The Worry Type

Use one of four labels:

- Safety: could cause harm.
- Task: needs action.
- Emotion: grief, guilt, fear.
- Unknown: needs information.

### Step 3: Create A Night-Safe-Enough Plan

Examples:

- Bedside lamp.
- Clear walkway.
- Phone nearby.
- Fall alert device.
- Nighttime toileting plan.
- Facility call rule.
- Medication organizer.
- Door alarm for wandering risk.
- Neighbor or backup contact.
- Morning check-in time.

CDC notes that sleep quality can be affected by repeated waking and trouble falling asleep, and recommends habits such as a consistent schedule, a restful bedroom, reduced electronics before bed, and limiting caffeine later in the day.

### Step 4: Close The Mental Tab

Say:

"This is written down. The next action is scheduled. I am allowed to sleep."

## What Families Often Miss

Sometimes nighttime worry is not irrational. It is unassigned risk.

If you are worried every night about the same thing, ask:

"What support, tool, or decision would make this risk less dependent on my nervous system?"

Examples include more home care hours, medication management, bathroom safety changes, memory care evaluation, a caregiver rotation, a facility call protocol, or a fall prevention appointment.

## Kefiw Tip: Make A 3 A.M. Card

Write this on a card or phone note:

At 3 a.m., I do not solve the care plan. I check immediate safety. I write the concern down. I choose whether it is emergency, morning, or delegate. Then I return to rest.

This helps stop nighttime problem-solving from becoming a habit.

## Family Script

"I am not sleeping because I am carrying the nighttime risk alone. We need to decide what is truly urgent, what can wait until morning, and what support needs to be added."

## Red Flags

- You are sleeping with your phone in your hand every night.
- You check on your parent repeatedly even when there is no new information.
- You cannot fall asleep because the care plan feels unsafe.
- You wake in panic.
- You are driving or caregiving while exhausted.
- Your worry is making daily functioning difficult.

## Checklist

- Write the specific nighttime worry.
- Label it safety, task, emotion, or unknown.
- Create one safety action.
- Schedule one daytime follow-up.
- Set a morning check-in time.
- Reduce non-urgent nighttime notifications.
- Use Sleep Reset.
- Reassess the care plan if the same worry returns nightly.`,
      'therapist, sleep clinician, geriatric care manager',
      [SOURCE_CDC_SLEEP, SOURCE_NHLBI_SLEEP, SOURCE_CDC_HOME_SAFETY],
    ),
  },

  'art-care-decision-fatigue': {
    slug: 'decision-fatigue-caregiving',
    title: 'Decision Fatigue in Caregiving: How to Make Clearer Care Choices | Kefiw',
    h1: 'Decision Fatigue in Caregiving',
    description:
      'Learn how to reduce caregiver decision fatigue, sort urgent decisions, use rules, delegate choices, and avoid crisis-driven planning.',
    metaDescription:
      'Learn how to reduce caregiver decision fatigue, sort urgent decisions, use rules, delegate choices, and avoid crisis-driven planning.',
    primaryCta: { href: '/care/mind-reset/', label: 'Try Mind Reset' },
    relatedLinks: [
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Too Many Decisions, Too Little Recovery

Caregiving can become an endless stream of decisions.

Which doctor? Which medication question? Which bill? Which facility? Which sibling gets called? Which appointment matters most? Is this urgent? Should we tour assisted living? Is home care enough? Are we overreacting? Are we underreacting?

Eventually, even small choices feel heavy.

## Plain-English Summary

Decision fatigue happens when the caregiver has made too many decisions with too little rest, support, clarity, or authority.

The solution is not to "think harder." The solution is to reduce the number of decisions, create rules, delegate ownership, and separate urgent choices from important-but-not-immediate ones.

## The Kefiw Decision Ladder

Use this order.

### 1. Safety Decisions

Anything involving immediate danger, medical emergency symptoms, wandering, unsafe driving, fire risk, serious neglect, or caregiver safety.

### 2. Care Continuity Decisions

Medication, meals, hygiene, supervision, transportation, appointments, and caregiver coverage.

### 3. Money Decisions

Invoices, insurance, care costs, family contributions, benefits, and facility contracts.

### 4. Quality-Of-Life Decisions

Social connection, activities, preferences, routines, comfort, and dignity.

### 5. Optimization Decisions

Choosing between acceptable options, fine-tuning schedules, and comparing extras.

Caregiver fatigue worsens when optimization decisions are treated like safety decisions.

## What Families Often Miss

Not every decision deserves the same energy.

A caregiver may spend two hours choosing the perfect meal delivery service while avoiding the bigger question:

"Can Dad safely be alone overnight?"

Kefiw should help users move the most consequential decisions to the top.

## Kefiw Tip: Create Care Rules Before The Crisis

Examples:

- If there are two falls in 30 days, we reassess living alone.
- If medication is missed twice in a week, we add medication support.
- If home care reaches 30 hours per week, we compare assisted living.
- If the caregiver sleeps fewer than five hours for three nights, someone else covers the next night.
- If wandering happens once, we create a dementia safety plan immediately.

Rules reduce repeated debates.

## The Good Enough And Safe Standard

Families often search for the perfect answer. Care planning rarely offers perfect answers.

Use this standard:

Is this option safe enough, sustainable enough, and financially realistic enough for the next stage?

If yes, move forward and set a review date.

## Family Script

"I am too tired to keep reopening every decision. Let us create rules for when we revisit the care plan, so we are not relying on emotion during every crisis."

## Red Flags

- Every decision feels urgent.
- The caregiver is the only decision-maker.
- Family reopens the same issue repeatedly.
- No one has legal authority clearly documented.
- The caregiver cannot sleep because decisions are unfinished.
- The family delays important choices by debating small details.
- The care plan depends on wishful thinking.

## Checklist

- List open decisions.
- Mark each as safety, continuity, money, quality-of-life, or optimization.
- Decide what must happen today.
- Delegate at least one decision.
- Create one escalation rule.
- Set a review date.
- Use Mind Reset before major care calls.
- Use calculators to turn vague choices into numbers.`,
      'geriatric care manager, therapist, senior care advisor',
      [SOURCE_CDC_CARE_PLAN, SOURCE_NHLBI_SLEEP, SOURCE_CDC_CAREGIVER_SELF_CARE],
    ),
  },

  'art-care-caregiver-guilt': {
    slug: 'caregiver-guilt-guide',
    title: 'Caregiver Guilt Guide: How to Handle Guilt, Limits, and Hard Care Decisions | Kefiw',
    h1: 'Caregiver Guilt Guide',
    description:
      'Learn how caregiver guilt shows up, how to separate healthy responsibility from impossible expectations, and how to make kinder care decisions.',
    metaDescription:
      'Learn how caregiver guilt shows up, how to separate healthy responsibility from impossible expectations, and how to make kinder care decisions.',
    primaryCta: { href: '/care/mind-reset/', label: 'Try Mind Reset' },
    relatedLinks: [
      { href: '/care/stress-check-in/', label: 'Stress Check-In' },
      { href: '/care/guides/caregiver-boundaries/', label: 'Caregiver Boundaries' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Guilt Is Common, But Not Always Reliable

Caregiver guilt can appear after almost any decision.

You may feel guilty for not visiting more, feeling angry, hiring help, considering assisted living, not being able to fix everything, wanting rest, spending money, not spending enough money, or choosing safety over a parent's preference.

Guilt is common in caregiving, but it is not always a reliable guide.

## Plain-English Summary

Caregiver guilt should be sorted, not obeyed automatically.

Some guilt points to a real responsibility. Some guilt comes from impossible expectations, grief, family pressure, or the pain of watching someone decline.

## The Kefiw Guilt Sort

### 1. Responsibility Guilt

This guilt says:

"There is something I need to repair, clarify, or follow up on."

Action: apologize, correct, schedule, document, or ask for help.

### 2. Boundary Guilt

This guilt says:

"I feel bad because I am not available for everything."

Action: name the limit and build support.

### 3. Grief Guilt

This guilt says:

"I hate that things are changing."

Action: allow sadness without turning it into self-blame.

### 4. Impossible-Standard Guilt

This guilt says:

"If I were a better caregiver, no one would suffer."

Action: reject the standard. Caregiving does not give one person control over aging, illness, dementia, decline, cost, or family behavior.

## What Families Often Miss

Guilt often gets louder right before a necessary care change:

- Adding home care.
- Taking away car keys.
- Moving to assisted living.
- Choosing memory care.
- Setting visiting limits.
- Asking siblings to help.
- Spending a parent's money on care.
- Saying no to unsafe requests.

A decision can be painful and still be responsible.

## Kefiw Tip: Ask What You Would Tell A Friend

Caregivers are often kinder to others than to themselves.

Ask:

"If my best friend were making this same decision with the same facts, would I call them selfish?"

Usually, the answer is no.

## Family Script

"I feel guilty, but guilt is not the same as evidence that this is the wrong decision. Let us look at safety, sustainability, cost, and what support is actually available."

## Boundary Script

"I love you. I am not abandoning you. But I cannot safely be the only person responsible for this."

## Red Flags

- Guilt keeps you from sleeping.
- Guilt keeps you from asking for help.
- Guilt makes you ignore safety risks.
- Guilt makes one caregiver do everything.
- Family members use guilt to avoid contributing.
- You feel responsible for outcomes no one can control.
- You feel hopeless or unsafe.

For crisis support in the U.S., the 988 Lifeline offers free, confidential support by call, text, or chat.

## Checklist

- Name the guilty thought.
- Sort it: responsibility, boundary, grief, or impossible standard.
- Identify one action, if action is needed.
- Identify one limit, if the guilt is about boundaries.
- Share the care facts with one trusted person.
- Use Mind Reset before making a guilt-driven decision.
- Revisit the care plan if guilt is hiding real safety concerns.`,
      'therapist, caregiver support specialist',
      [SOURCE_CDC_CAREGIVER_SELF_CARE, SOURCE_988],
    ),
  },

  'art-care-set-boundaries': {
    slug: 'caregiver-boundaries',
    title: 'How to Set Boundaries as a Family Caregiver | Kefiw',
    h1: 'How to Set Boundaries as a Family Caregiver',
    description:
      'Learn practical caregiver boundary scripts, task limits, family rules, and ways to protect safety without abandoning a loved one.',
    metaDescription:
      'Learn practical caregiver boundary scripts, task limits, family rules, and ways to protect safety without abandoning a loved one.',
    guideCategory: 'Wellbeing Guides',
    primaryCta: { href: '/care/stress-check-in/', label: 'Use Stress Check-In' },
    relatedLinks: [
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/how-to-divide-caregiving-responsibilities/', label: 'Divide Caregiving Responsibilities' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## A Boundary Is Not Abandonment

A boundary is a clear statement of what you can do, what you cannot do, and what support must be added so care remains safe.

Caregivers often avoid boundaries because they fear sounding selfish. But without boundaries, one person can quietly become the entire care system.

## Plain-English Summary

A caregiver boundary should protect both people: the person receiving care and the person providing care.

CDC encourages caregivers to set reasonable expectations, delegate tasks, and take breaks. CDC also describes respite care as a way caregivers can step away from responsibilities for a period of time.

## The Kefiw Boundary Formula

Use this structure:

- Care: I care about you.
- Limit: I cannot safely keep doing this.
- Need: We need another support.
- Next step: Here is what I can do next.

Example:

"I care about you and want you safe. I cannot keep doing overnight care by myself. We need paid overnight help, a sibling rotation, or a different care setting. Tonight I can stay until 9 p.m., but I cannot stay all night."

## Types Of Caregiver Boundaries

### Time Boundaries

"I can come on Mondays and Thursdays. I cannot be available every day."

### Task Boundaries

"I can help schedule appointments. I cannot lift you safely."

### Emotional Boundaries

"I will talk about the care plan, but I will not stay on the phone if I am being yelled at."

### Money Boundaries

"I can contribute this amount monthly. I cannot pay open-ended expenses without a family budget."

### Emergency Boundaries

"If this is a safety emergency, we call emergency services. I cannot manage emergencies by text."

## What Families Often Miss

The boundary is not complete until there is a replacement plan.

Weak boundary:

"I cannot do this anymore."

Stronger boundary:

"I cannot do bathing transfers anymore because it is unsafe. We need home care for bathing twice a week, or we need to reassess the care setting."

## Kefiw Tip: Make A Cannot-Safely-Do List

Caregivers often say yes because each task seems small in isolation.

Write down tasks you cannot safely continue:

- Lifting.
- Overnight monitoring.
- Medication management.
- Driving after poor sleep.
- Managing aggressive behavior.
- Paying bills without authority.
- Missing work for every appointment.
- Being the only emergency contact.

This list becomes the basis for adding support.

## Family Script

"This is not about whether I love Mom. It is about whether the current plan is safe. I cannot keep being the backup for every gap."

## Red Flags

- You set a boundary, but no replacement plan is created.
- Family members shame you instead of assigning tasks.
- You keep doing unsafe lifting or transfers.
- You answer abusive calls because you feel guilty.
- You are the only person allowed to say yes or no.
- You pay care costs without a written budget.
- Your health is declining.

## Checklist

- Identify the task that needs a boundary.
- Explain the safety reason.
- Offer what you can still do.
- Name the support that must replace your role.
- Assign task ownership.
- Document the new plan.
- Revisit the boundary after two weeks.
- Use Stress Check-In if guilt or conflict spikes.`,
      'therapist, caregiver support specialist, geriatric care manager',
      [SOURCE_CDC_CAREGIVER_SELF_CARE, SOURCE_CDC_CARE_PLAN],
    ),
  },

  'art-care-urgent-medical-help': {
    slug: 'when-to-get-medical-help-for-loved-one',
    title: 'When to Get Medical Help for a Loved One: Routine, Prompt, or Emergency Care | Kefiw',
    h1: 'When to Get Medical Help for a Loved One',
    description:
      'Learn how to think about routine care, prompt care, and emergency symptoms for an older loved one without replacing medical advice.',
    metaDescription:
      'Learn how to think about routine care, prompt care, and emergency symptoms for an older loved one without replacing medical advice.',
    primaryCta: { href: '/health/medical-triage/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/medication-management-family-caregivers/', label: 'Medication Management Guide' },
      { href: '/care/guides/what-to-do-after-a-fall/', label: 'What To Do After a Fall' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## A Safety Guide, Not A Diagnosis

This guide should power Kefiw's Care Urgency Check.

It should not diagnose. It should help families slow down, observe clearly, and decide whether a concern seems appropriate for routine care, prompt care, or emergency help.

## Plain-English Summary

When you are unsure what to do, ask three questions:

- Could this be immediately life-threatening?
- Is there sudden change from the person's normal baseline?
- Would waiting create serious risk?

If the answer may be yes, seek urgent or emergency help.

## Emergency Signs

Call emergency services right away for symptoms such as stopped breathing, choking, head injury with passing out or confusion, neck or spine injury, severe chest pain or pressure, severe shortness of breath, seizure with delayed recovery, sudden inability to speak, see, walk, or move, sudden weakness or drooping on one side, uncontrolled bleeding, poisoning, swelling of the face or tongue, or any situation that seems immediately dangerous.

MedlinePlus lists emergency warning signs that include uncontrolled bleeding, breathing problems, change in mental status, chest pain or discomfort that lasts, coughing or vomiting blood, fainting, head or spine injury, inability to speak, severe pain, sudden dizziness or vision changes, poisoning, and swelling of the face, eyes, or tongue.

## Stroke Warning Signs

Stroke symptoms often happen quickly and can include sudden numbness or weakness, sudden confusion or trouble speaking, sudden vision trouble, sudden difficulty walking or loss of balance, or sudden severe headache with no known cause. NIH MedlinePlus guidance says to call 911 right away if stroke symptoms are present, even if they go away.

## Heart Attack Warning Signs

A heart attack is a medical emergency. Symptoms can include chest discomfort or pressure, shortness of breath, discomfort in the arm, back, shoulders, neck, jaw, or upper stomach, nausea, vomiting, dizziness, lightheadedness, cold sweat, unusual tiredness, or subtle symptoms in older adults. MedlinePlus says to call 911 if you think someone may be having a heart attack.

## The Kefiw Routine / Prompt / Emergency Frame

### Routine Care

Use routine care for non-urgent issues that are stable, mild, and not worsening.

Examples:

- Medication question without urgent symptoms.
- Mild ongoing sleep issue.
- Gradual appetite change.
- Non-urgent mobility concern.
- Routine follow-up.

### Prompt Care

Use prompt care when the issue is not clearly life-threatening but should not wait.

Examples:

- New confusion.
- New weakness.
- Worsening pain.
- New fall without obvious emergency signs.
- Fever in a frail older adult.
- Medication side effect concern.
- Sudden decline from baseline.

### Emergency Care

Use emergency care when symptoms may be life-threatening, sudden, severe, or dangerous.

## What Families Often Miss

Older adults may not show textbook symptoms.

A serious issue may appear as sudden confusion, new weakness, unusual fatigue, sudden behavior change, poor intake, falls, dizziness, shortness of breath, or new inability to walk.

Kefiw should encourage users to compare symptoms to the person's baseline.

## Kefiw Tip: Write The Baseline Sentence

Before calling a clinician, write:

"Normally, she can ____. Today, she cannot ____."

Example:

"Normally, Dad walks to the bathroom with a cane. Today, he cannot stand without help."

That sentence helps clinicians understand the change.

## Family Script

"I am not asking you to diagnose this over the phone. I need help deciding whether this change from baseline needs routine care, same-day care, urgent care, or emergency care."

## Red Flags

- The family debates instead of calling emergency services.
- A loved one minimizes severe symptoms.
- New confusion is dismissed as "just aging."
- Chest pain or shortness of breath is watched at home.
- Stroke-like symptoms are waited out.
- A fall with head injury or confusion is not evaluated.
- The caregiver is unsure but afraid of overreacting.

## Checklist

- Check immediate danger.
- Compare to baseline.
- Write down symptoms and timing.
- List medications and recent changes.
- Decide routine, prompt, or emergency.
- Call emergency services for severe or sudden symptoms.
- Call the clinician for non-emergency but concerning changes.
- Use the Care Urgency Check as an educational guide, not a diagnosis.`,
      'clinician, emergency medicine clinician, nurse reviewer',
      [
        SOURCE_MEDLINEPLUS_EMERGENCY,
        SOURCE_MEDLINEPLUS_STROKE,
        SOURCE_MEDLINEPLUS_HEART,
        SOURCE_MEDLINEPLUS_HEART_FIRST_AID,
      ],
    ),
  },

  'art-care-after-a-fall': {
    slug: 'what-to-do-after-a-fall',
    title: 'What to Do After a Fall: A Safety Guide for Families and Caregivers | Kefiw',
    h1: 'What to Do After a Fall',
    description:
      'Learn what to do after an older adult falls, when to call emergency services, what to document, and how to reduce future fall risk.',
    metaDescription:
      'Learn what to do after an older adult falls, when to call emergency services, what to document, and how to reduce future fall risk.',
    primaryCta: { href: '/health/medical-triage/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Home Safety Checklist' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## A Fall Is Information

A fall is not just an event. It may reveal a change in balance, medication side effects, weakness, vision problems, home hazards, dehydration, confusion, or care needs that have increased.

CDC says falls are a major threat to older adult independence, and its fall data page notes that more than one in four adults age 65 and older report falling each year.

## Plain-English Summary

After a fall, the first priority is immediate safety.

The second priority is figuring out why the fall happened.

The third priority is changing the care plan so the same risk is not left uncovered.

## Immediate Steps After A Fall

### Step 1: Pause

Do not rush the person up. Take a moment to assess breathing, pain, awareness, and whether moving could make an injury worse.

### Step 2: Check For Emergency Signs

Call emergency services if there is:

- Loss of consciousness.
- Confusion.
- Head injury.
- Neck or spine injury.
- Severe pain.
- Trouble breathing.
- Chest pain.
- Heavy bleeding.
- Possible broken bone.
- Inability to move normally.
- Stroke-like symptoms.
- Any situation that feels unsafe.

MedlinePlus lists head or spine injury, change in mental status, chest pain, severe shortness of breath, uncontrolled bleeding, and sudden inability to speak, see, walk, or move as emergency warning signs.

### Step 3: Do Not Move The Person If Serious Injury Is Possible

If there is severe pain, suspected fracture, head or neck injury, confusion, or loss of consciousness, wait for emergency help unless the location itself is dangerous.

### Step 4: If No Emergency Signs, Help Carefully

If the person is alert, not seriously hurt, and can move safely, help them slowly and carefully. Avoid lifting in a way that injures the caregiver.

### Step 5: Document What Happened

Write:

- Time.
- Location.
- What they were doing.
- Footwear.
- Lighting.
- Assistive device.
- Medication changes.
- Dizziness.
- Pain.
- Whether they hit their head.
- Whether they could get up.
- Any new confusion or weakness.

## What Families Often Miss

The fall is not over when the person stands up.

Families should ask:

"What made this fall possible?"

Was it the rug? Poor lighting? Weakness? Medication? Rushing to the bathroom? Confusion? Shoes? Dehydration? Missing grab bars? Not using a walker? Trying to hide a decline?

## Kefiw Tip: Create A 72-Hour Fall Watch

For the next 72 hours, watch for:

- New pain.
- Confusion.
- Sleepiness.
- Dizziness.
- Weakness.
- Headache.
- Vomiting.
- Trouble walking.
- Fear of moving.
- New behavior changes.

Seek medical guidance if anything changes or feels concerning.

## Family Script

"Even if you feel okay, we need to understand why this happened. The goal is not to blame you. The goal is to prevent the next fall."

## Red Flags

- The person falls more than once.
- The person hides falls.
- The caregiver cannot safely help them up.
- The fall happened at night or in the bathroom.
- There is new confusion.
- The person hit their head.
- The person is on blood thinners or has high injury risk.
- The home setup has not changed after the fall.

## Checklist

- Check immediate danger.
- Call emergency services if serious symptoms are present.
- Do not rush the person up.
- Document what happened.
- Notify the clinician if appropriate.
- Review medications with a clinician or pharmacist.
- Check vision, footwear, lighting, rugs, bathroom safety, and assistive devices.
- Use the Home Safety Checklist.
- Reassess care needs after any repeated fall.`,
      'clinician, physical therapist, geriatric care manager',
      [SOURCE_CDC_FALLS, SOURCE_CDC_FALL_PREVENTION, SOURCE_MEDLINEPLUS_EMERGENCY, SOURCE_CDC_HOME_SAFETY],
    ),
  },

  'art-care-home-safety-checklist': {
    slug: 'home-safety-checklist-older-adults',
    title: 'Home Safety Checklist for Older Adults: Falls, Lighting, Bathroom Safety, and Care Risks | Kefiw',
    h1: 'Home Safety Checklist for Older Adults',
    description:
      'Use this home safety checklist to identify fall hazards, bathroom risks, lighting problems, medication concerns, and care needs for an older adult.',
    metaDescription:
      'Use this home safety checklist to identify fall hazards, bathroom risks, lighting problems, medication concerns, and care needs for an older adult.',
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/home-care-cost-calculator/', label: 'Home Care Cost Calculator' },
      { href: '/health/medical-triage/', label: 'Care Urgency Check' },
      { href: '/care/guides/aging-in-place-guide/', label: 'Aging in Place Guide' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Familiar Does Not Always Mean Safe

A home can feel familiar and still become unsafe.

Small hazards matter: a loose rug, a dim hallway, a slippery shower, a missing handrail, a cluttered floor, a high shelf, or a nighttime bathroom path.

CDC's home fall-prevention checklist highlights practical fixes such as removing or securing throw rugs, improving lighting, using non-slip mats or strips in tubs and showers, and installing grab bars.

## Plain-English Summary

A home safety check is not about criticizing the home. It is about noticing where the environment no longer matches the person's mobility, vision, strength, memory, balance, or care needs.

## The Kefiw Room-By-Room Safety Scan

### Entryway

Check:

- Uneven steps.
- Loose railings.
- Poor lighting.
- No place to sit.
- Slippery surfaces.
- Hard-to-open locks.
- Clutter near the door.

### Living Room

Check:

- Loose rugs.
- Low furniture.
- Extension cords.
- Cluttered pathways.
- Poor lighting.
- Unstable chairs.
- Pets underfoot.

### Kitchen

Check:

- Frequently used items stored too high.
- Stove left on.
- Expired food.
- Poor lighting.
- Slippery floor.
- Heavy items stored overhead.
- Confusing medication storage.

### Bedroom

Check:

- Bed too high or low.
- No night light.
- Unsafe path to bathroom.
- Loose slippers.
- Phone out of reach.
- No emergency contact visible.
- Clutter around the bed.

### Bathroom

Check:

- No grab bars.
- Slippery tub or shower.
- Low toilet.
- No shower chair.
- Poor lighting.
- Loose bath mats.
- Hard-to-reach toiletries.

### Stairs And Hallways

Check:

- Missing handrails.
- Items on stairs.
- Loose carpet.
- Poor lighting.
- No contrast on stair edges.
- No rail on both sides.

### Medication And Emergency Setup

Check:

- Current medication list.
- Emergency contacts.
- Medical alert system if needed.
- Phone access.
- Backup key.
- Fire and carbon monoxide detectors.
- Exit plan.

## What Families Often Miss

Home safety is not one-and-done.

Recheck after a fall, hospitalization, new medication, vision change, dementia progression, new walker or wheelchair, new nighttime confusion, or caregiver burnout.

## Kefiw Tip: Walk The Nighttime Path

Do the home safety scan at night.

Start where the person sleeps. Walk to the bathroom, kitchen, and exit.

Ask:

- Is the path lit?
- Are rugs secure?
- Is the walker reachable?
- Are shoes safe?
- Can the person call for help?
- Is there anything they grab that is not stable?

Many falls happen when the house is dark, the person is tired, and the caregiver is asleep.

## Family Script

"We are not saying you cannot live here. We are trying to make the house match what you need now, so you can stay safer for longer."

## Red Flags

- Repeated falls.
- Walking furniture-to-furniture.
- Bathroom fear.
- Spoiled food.
- Stove safety concerns.
- Wandering or exit-seeking.
- Medications scattered around the home.
- No emergency contact system.
- The caregiver feels unsafe leaving the person alone.

## Checklist

- Remove loose rugs or secure them.
- Clear pathways.
- Improve lighting.
- Add night lights.
- Install grab bars.
- Add non-slip shower surface.
- Consider a shower chair.
- Keep frequently used items within easy reach.
- Review medication storage.
- Add emergency contacts.
- Recheck after any major health change.`,
      'occupational therapist, physical therapist, geriatric care manager',
      [SOURCE_CDC_HOME_SAFETY, SOURCE_CDC_FALL_PREVENTION, SOURCE_ALZ_HOME_SAFETY],
    ),
  },

  'art-care-dementia-wandering': {
    slug: 'dementia-wandering-safety',
    title: 'Dementia Wandering and Safety Guide for Families | Kefiw',
    h1: 'Dementia Wandering and Safety Guide',
    description:
      'Learn warning signs of wandering, how to reduce risk, prepare a response plan, and support safety for a loved one with dementia.',
    metaDescription:
      'Learn warning signs of wandering, how to reduce risk, prepare a response plan, and support safety for a loved one with dementia.',
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/memory-care-cost-calculator/', label: 'Memory Care Cost Calculator' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/guides/memory-care-guide-for-families/', label: 'Memory Care Guide' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Wandering Is A Safety Signal

Wandering can be terrifying for families.

A loved one may say they are "going home" while already at home. They may try to go to work, look for someone from the past, follow an old routine, or become restless and leave without understanding the risk.

The Alzheimer's Association says wandering or becoming lost can happen at any stage of dementia, and six in ten people living with dementia will wander at least once.

## Plain-English Summary

Wandering is not misbehavior.

It may be a sign of confusion, unmet need, old routine, distress, boredom, pain, fear, overstimulation, or disorientation.

The family's job is not only to lock doors. It is to understand the pattern and build a safety plan.

## Warning Signs

The Alzheimer's Association lists warning signs such as returning later than usual from a regular walk or drive, forgetting how to get to familiar places, talking about former obligations, wanting to "go home," pacing, difficulty locating familiar rooms, asking for people from the past, or starting tasks without completing them.

## The Kefiw Wandering Pattern Log

Track:

- Time of day.
- Location.
- Trigger.
- What the person said.
- What they seemed to need.
- Weather.
- Hunger, thirst, pain, bathroom need.
- Noise or overstimulation.
- Sleep quality.
- Whether they were looking for someone or somewhere.
- What calmed them.

Patterns matter.

Someone who wanders at 4 p.m. may need a different plan than someone who tries to leave at 2 a.m.

## Safety Plan

Consider:

- Door alarms.
- Secured exits appropriate to the setting.
- ID bracelet or wearable ID.
- Recent photo.
- Neighbor awareness.
- Local emergency contact plan.
- Safe walking routine.
- Remove visual exit cues where appropriate.
- Keep keys out of sight.
- Avoid leaving the person alone if unsafe.
- Consider memory care evaluation if risk exceeds home safety capacity.

## What Families Often Miss

A wandering plan should include prevention and response.

Prevention asks:

"What reduces the urge to leave?"

Response asks:

"What do we do immediately if they are missing?"

Both are needed.

## Kefiw Tip: Answer The Emotion, Not Only The Words

If a person says, "I need to go home," arguing may increase distress.

Try:

"You want to feel safe and familiar. Let us sit together for a minute, and you can tell me about home."

Then redirect gently.

The goal is not to win the factual argument. The goal is to reduce distress and danger.

## Family Script

"This is not just a door problem. We need to understand when wandering happens, what triggers it, how to reduce risk, and what our response plan is if it happens again."

## Red Flags

- Wandering has already happened once.
- The person is unsafe alone.
- Nighttime exit-seeking occurs.
- The caregiver sleeps lightly because they are afraid the person will leave.
- The home cannot be secured safely.
- The person becomes agitated when redirected.
- Neighbors or police have already been involved.
- Family members minimize the risk.

## Checklist

- Document wandering signs.
- Track patterns.
- Create a response plan.
- Keep recent photo available.
- Add ID information.
- Inform trusted neighbors if appropriate.
- Secure exits safely.
- Remove car keys if driving is unsafe.
- Address hunger, pain, bathroom needs, boredom, and overstimulation.
- Reassess care setting if wandering risk cannot be safely managed.`,
      'dementia care specialist, clinician, geriatric care manager',
      [SOURCE_ALZ_WANDERING, SOURCE_ALZ_HOME_SAFETY, SOURCE_CDC_CARE_PLAN],
    ),
  },

  'art-care-respite-care-guide': {
    slug: 'respite-care-guide',
    title: 'Respite Care Guide: Short-Term Relief for Family Caregivers | Kefiw',
    h1: 'Respite Care Guide for Caregiver Relief',
    description:
      'Learn what respite care is, when caregivers need it, how to plan it, and how to ask family or paid providers for short-term relief.',
    metaDescription:
      'Learn what respite care is, when caregivers need it, how to plan it, and how to ask family or paid providers for short-term relief.',
    guideCategory: 'Wellbeing Guides',
    primaryCta: { href: '/care/caregiver-hours-calculator/', label: 'Calculate Caregiver Hours' },
    relatedLinks: [
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/stress-check-in/', label: 'Stress Check-In' },
      { href: '/care/sleep-reset/', label: 'Sleep Reset' },
    ],
    longformMarkdown: withWellbeingFooter(
      `## Respite Is Not A Luxury

Respite care is planned relief that keeps caregiving from becoming dependent on one person's exhaustion.

CDC describes respite care as time off from caregiving responsibilities and lists support options such as family or friends, nonprofit groups, government agencies, in-home services, adult day care, and short-term nursing home care.

## Plain-English Summary

Respite care means someone else temporarily covers care so the primary caregiver can step away.

It may be provided by family, friends, paid caregivers, adult day programs, respite facilities, home care agencies, community programs, VA programs, or aging-service programs in some cases.

## When Respite Is Needed

Respite may be needed when:

- The caregiver is sleeping poorly.
- The caregiver has no time off.
- Care needs are increasing.
- The caregiver is missing work.
- The caregiver is getting sick.
- The caregiver feels resentful or numb.
- The care recipient cannot safely be left alone.
- Family conflict is rising.
- The caregiver has no emergency backup.

## The Kefiw Respite Planning Rule

Do not wait until the caregiver says:

"I cannot do this anymore."

Plan respite when the caregiver says:

"I can keep going, but only if this changes."

## Types Of Respite

### Micro-Respite

Short breaks: one hour, one errand, one meal, one walk.

### Weekly Respite

A predictable block every week.

### Overnight Respite

Critical when sleep is the caregiver's biggest risk.

### Crisis Respite

Short-term support after hospitalization, falls, behavioral changes, or caregiver illness.

### Transition Respite

Used while the family compares home care, assisted living, memory care, or nursing home options.

## What Families Often Miss

Respite works best when it is scheduled, not begged for.

A caregiver should not have to prove they are collapsing before help arrives.

## Kefiw Tip: Create A Respite Menu

List options by effort level:

- Easy: family covers two hours, grocery delivery, friend check-in.
- Moderate: adult day program, home care shift, weekly sibling visit.
- Bigger: overnight respite, short-term facility stay, rotating family schedule.

This gives families options instead of one all-or-nothing request.

## Family Script

"I need respite to keep caregiving safe. This is not a vacation from responsibility. It is part of the care plan."

## Red Flags

- The caregiver has no regular break.
- The caregiver cannot leave the house.
- The caregiver has not slept normally in weeks.
- The caregiver delays medical care for themselves.
- The care recipient is unsafe with only one caregiver.
- Family members praise the caregiver but do not relieve them.
- Respite is treated as optional.

## Checklist

- Identify what respite should protect: sleep, work, health, emotional reset, errands.
- Choose micro, weekly, overnight, crisis, or transition respite.
- List who can provide coverage.
- Write care instructions.
- Prepare medication and emergency contacts.
- Schedule respite before burnout.
- Add respite to the family care budget.
- Review after the first respite block.`,
      'caregiver support specialist, geriatric care manager',
      [SOURCE_CDC_CAREGIVER_SELF_CARE, SOURCE_CDC_CARE_PLAN],
    ),
  },
};

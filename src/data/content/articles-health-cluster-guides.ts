import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_HEALTH_CLUSTER_GUIDES: ContentPageConfig[] = [
  {
    id: 'art-health-biological-maintenance-overview',
    clusterId: 'bio-maintenance',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'biological-maintenance-guide',
    guideCategory: 'Health',
    title: 'Biological Maintenance Guide: Calories, Sleep, Stimulants, and Triage | Kefiw',
    h1: 'Biological Maintenance Guide',
    subhead: 'Use baseline calculators for everyday planning without turning them into diagnosis or medical advice.',
    discoverHeadline: 'The daily body-maintenance numbers worth checking before guessing',
    outcomeLine: 'Maintenance tools are best for planning ranges, not for diagnosing problems.',
    description: 'A practical guide to Kefiw biological-maintenance tools: BMR/TDEE, caffeine and alcohol decay, sleep-cycle timing, and symptom triage limits.',
    metaDescription: 'Use Kefiw biological-maintenance calculators for BMR/TDEE, caffeine and alcohol timing, sleep windows, and triage routing with clear limits.',
    keywords: ['biological maintenance', 'BMR TDEE calculator', 'caffeine sleep timing', 'sleep cycle calculator', 'symptom triage tool'],
    intro: 'The biological-maintenance cluster is for users trying to make ordinary daily decisions: how much energy a body likely uses, whether late caffeine may affect sleep, when a sleep window might land, and when symptoms deserve higher-level care.',
    primaryCta: { href: '/health/biological-maintenance/', label: 'Open Biological Maintenance' },
    secondaryCtas: [
      { href: '/health/metabolic-floor/', label: 'Metabolic Floor' },
      { href: '/health/substance-decay/', label: 'Substance Decay' },
      { href: '/health/rem-sync/', label: 'REM-Sync' },
    ],
    keyPoints: [
      'Metabolic Floor estimates BMR and TDEE as a starting range, not a prescription.',
      'Substance Decay helps visualize caffeine and alcohol timing, but individual clearance varies.',
      'REM-Sync is a bedtime planning aid and cannot diagnose sleep disorders.',
      'Medical Triage is a red-flag routing helper, not a nurse, clinician, or emergency service.',
      'Use conservative interpretation when the cost of being wrong is high.',
    ],
    examples: [
      {
        title: 'Late coffee planning',
        body: 'A user with an 11pm target bedtime checks whether a 3pm coffee leaves meaningful caffeine near sleep time.',
      },
      {
        title: 'Calorie estimate reset',
        body: 'A user recalculates TDEE after a body-weight change and treats the result as a starting point to compare with real trend data.',
      },
      {
        title: 'Triage uncertainty',
        body: 'A user with possible red flags should choose higher-level care or a nurse line rather than trying to optimize the score.',
      },
    ],
    whenToUse: [
      { toolId: 'metabolic-floor', note: 'Use when you need a first-pass estimate of resting and total daily energy use.' },
      { toolId: 'substance-decay', note: 'Use when caffeine, alcohol, or timing may affect sleep or next-day readiness.' },
      { toolId: 'rem-sync', note: 'Use to plan possible wake or bedtime windows around 90-minute cycles.' },
      { toolId: 'medical-triage', note: 'Use only as a conservative red-flag router when deciding whether to seek higher-level care.' },
    ],
    relatedIds: [
      'metabolic-floor',
      'substance-decay',
      'rem-sync',
      'medical-triage',
      'art-hm-metabolic-floor-guide',
      'art-hm-sleep-cycle-timing-guide',
      'art-hm-symptom-triage-guide',
    ],
    longformMarkdown: `## What the user is actually trying to do

Users do not open maintenance calculators because they want trivia. They want a practical answer for today: "How many calories is a reasonable starting estimate?" "Is this coffee too late?" "What bedtime gives me a cleaner wake-up?" "Is this symptom pattern something I should escalate?"

Those are different tasks, but they share one principle: the tool can structure the decision, not replace judgment. The [Metabolic Floor](/health/metabolic-floor/) tool estimates BMR and TDEE. The [Substance Decay](/health/substance-decay/) tool visualizes timing. [REM-Sync](/health/rem-sync/) helps plan sleep windows. [Medical Triage](/health/medical-triage/) is a conservative red-flag router.

The right tone is modest. A calculator can help a user avoid random guessing, but it should never imply diagnosis, treatment, or individualized medical advice. CDC sleep guidance, for example, emphasizes habits such as avoiding caffeine in the afternoon or evening, but exact sensitivity still varies by person. NIDDK's Body Weight Planner is a good reminder that energy models are estimates and can be wrong for individual metabolism or activity.

References: [CDC sleep basics](https://www.cdc.gov/sleep/about/index.html) and [NIDDK Body Weight Planner](https://www.niddk.nih.gov/bwp).

## Formula, inputs, and assumptions

Metabolic Floor starts with body stats and an activity multiplier. BMR estimates resting energy needs; TDEE multiplies that baseline by activity. The assumption is that the user resembles the population behind the equation. Very muscular bodies, very low activity, endocrine disorders, pregnancy, illness, and aggressive dieting can all shift reality away from the estimate.

Substance Decay uses timing models. Caffeine is commonly modeled with half-life logic; alcohol clearance is often treated as a slow average elimination process. The inputs are dose and time. The limitations are genetics, sex, liver health, medications, pregnancy, tolerance, food timing, and drink-size accuracy.

REM-Sync uses the common 90-minute sleep-cycle planning heuristic. The input is target wake time or bedtime. The limitation is that real sleep cycles vary, sleep latency varies, and sleep quality depends on more than cycle math.

Medical Triage uses red-flag routing. The most important assumption is conservative safety: when uncertainty is high and the potential downside is severe, escalate.

## Worked example

A user wants to wake at 6:30am, had a 200 mg coffee at 2:30pm, and is estimating calories after returning to exercise. A practical flow is:

1. Use Metabolic Floor to estimate a starting TDEE.
2. Use Substance Decay to see whether meaningful caffeine may remain near bedtime.
3. Use REM-Sync to pick a target bedtime window.
4. If symptoms are involved, use Medical Triage only as a conservative pointer, not as permission to ignore red flags.

If the caffeine curve suggests a high residual at 10:30pm, the user can move caffeine earlier tomorrow. If the TDEE estimate misses real weight trends after several weeks, the estimate gets adjusted. If triage shows uncertainty around red flags, the user should contact appropriate care rather than trying to tune inputs.

## Common mistakes

The first mistake is treating estimates as orders. A TDEE number is not a diet plan. It is a baseline to compare against observed trends. The second mistake is assuming sleep-cycle math fixes poor sleep hygiene. A clean 90-minute window cannot undo late stimulants, alcohol, stress, noise, or inconsistent sleep.

The third mistake is using triage tools to talk yourself out of care. The safe interpretation is the opposite: if the tool or the user is unsure, escalate.`,
    faq: [
      {
        q: 'How accurate are body maintenance estimates?',
        a: 'A biological-maintenance calculator is usually useful as a starting estimate, not an exact personal measurement. BMR, caffeine clearance, sleep timing, and triage routing all depend on individual factors. Use the result to plan conservatively and compare with real-world outcomes.',
        faq_intent: 'trust',
      },
      {
        q: 'What should I use first in this health cluster?',
        a: 'Start with the tool matching the immediate decision: Metabolic Floor for calorie range, Substance Decay for timing, REM-Sync for sleep windows, and Medical Triage for conservative routing. Do not run every tool unless the situation genuinely involves multiple decisions.',
        faq_intent: 'how-to',
      },
      {
        q: 'Can REM-Sync diagnose sleep problems?',
        a: 'No, REM-Sync only estimates possible sleep-cycle windows and cannot diagnose insomnia, sleep apnea, circadian disorders, or fatigue causes. If sleep problems are persistent, severe, or impair daily life, use qualified healthcare guidance rather than a timing calculator.',
        faq_intent: 'trust',
      },
      {
        q: 'Why does caffeine timing vary by person?',
        a: 'Caffeine timing varies because metabolism, genetics, dose, pregnancy, medications, liver function, and sensitivity differ across people. A decay curve can show why afternoon caffeine may matter, but the user should calibrate with actual sleep response.',
        faq_intent: 'definition',
      },
      {
        q: 'Should Medical Triage replace a nurse line?',
        a: 'No, Medical Triage should not replace a nurse line, clinician, emergency service, or local health guidance. It is a conservative red-flag helper. If the answer matters urgently or symptoms are severe, choose human medical support.',
        faq_intent: 'trust',
      },
    ],
  },
  {
    id: 'art-health-body-composition-overview',
    clusterId: 'body-composition',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'body-composition-monitoring-guide',
    guideCategory: 'Health',
    title: 'Body Composition Monitoring Guide: BAC, Body Fat, Hydration, and Nicotine | Kefiw',
    h1: 'Body Composition Monitoring Guide',
    subhead: 'Use body-state calculators as rough monitors, not legal evidence or medical diagnosis.',
    discoverHeadline: 'The body-state estimates people overtrust when stakes are high',
    outcomeLine: 'The higher the consequence, the less you should rely on an estimate alone.',
    description: 'Guide to body-composition and health-monitoring calculators: BAC, body-fat percentage, hydration, and nicotine cessation timeline.',
    metaDescription: 'Use Kefiw body-composition tools for BAC estimates, body-fat circumference, hydration needs, and nicotine timelines with clear limitations.',
    keywords: ['body composition calculator', 'BAC calculator limits', 'body fat percentage guide', 'hydration calculator', 'nicotine cessation timeline'],
    intro: 'This cluster helps users estimate current body-state signals: possible BAC, circumference-based body-fat percentage, hydration requirement, and nicotine cessation timing. Each can be useful, and each can be misused.',
    primaryCta: { href: '/health/body-composition/', label: 'Open Body Composition' },
    secondaryCtas: [
      { href: '/health/impairment-bac/', label: 'Impairment Coefficient' },
      { href: '/health/structural-density/', label: 'Structural Density' },
      { href: '/health/hydraulic-integrity/', label: 'Hydraulic Integrity' },
    ],
    keyPoints: [
      'BAC estimates are never legal proof or permission to drive.',
      'Circumference body-fat formulas are rough trend tools, not DEXA scans.',
      'Hydration calculators estimate intake needs but cannot diagnose dehydration or electrolyte disorders.',
      'Nicotine timelines are educational and do not replace cessation support.',
      'Use trend and safety framing rather than single-number certainty.',
    ],
    examples: [
      {
        title: 'BAC estimate',
        body: 'A user checks a drink timeline and sees uncertainty. The safe action is not driving, not arguing with the estimate.',
      },
      {
        title: 'Body-fat trend',
        body: 'A user repeats tape measurements monthly under the same conditions instead of reacting to one noisy reading.',
      },
      {
        title: 'Hydration planning',
        body: 'A user raises fluid planning for heat and activity but knows symptoms or medical conditions require human care.',
      },
    ],
    whenToUse: [
      { toolId: 'impairment-bac', note: 'Use for educational drink-timing estimation only, never for legal or driving clearance.' },
      { toolId: 'structural-density', note: 'Use for repeatable circumference-based body-fat trend tracking.' },
      { toolId: 'hydraulic-integrity', note: 'Use for rough hydration planning around body size, activity, and environment.' },
      { toolId: 'cessation-ladder', note: 'Use to understand nicotine timeline stages and plan support, not to manage withdrawal medically.' },
    ],
    relatedIds: [
      'impairment-bac',
      'structural-density',
      'hydraulic-integrity',
      'cessation-ladder',
      'art-hm-widmark-bac-explained',
      'art-hm-body-fat-percentage-guide',
      'art-hm-hydration-requirement-guide',
      'art-hm-nicotine-cessation-timeline',
    ],
    longformMarkdown: `## What the user is actually trying to do

Body-state tools attract users who want a number for something that feels uncertain: "Am I still impaired?" "Is my body-fat trend moving?" "How much water should I plan for?" "What happens after quitting nicotine?" The risk is that a simple calculator can feel more authoritative than it deserves.

Kefiw should make the estimates useful while keeping the claims modest. [Impairment Coefficient](/health/impairment-bac/) is not a breathalyzer. [Structural Density](/health/structural-density/) is not medical imaging. [Hydraulic Integrity](/health/hydraulic-integrity/) is not a dehydration diagnosis. [Cessation Ladder](/health/cessation-ladder/) is not addiction treatment.

Official public-health sources reinforce this restraint. CDC describes BMI and waist measures as screening tools rather than complete individual assessments. The National Academies water-intake references are population guidance, not a personal hydration guarantee.

References: [CDC BMI and weight assessment](https://www.cdc.gov/healthyweight/assessing/index.html), [CDC healthy weight and waist circumference](https://www.cdc.gov/diabetes/living-with/healthy-weight.html), and [National Academies DRI for water and electrolytes](https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-electrolytes-and-water).

## Formula, inputs, and assumptions

BAC estimates commonly use drink count, body mass, sex-related distribution constants, time, and average elimination assumptions. The limitation is obvious: actual impairment depends on drink size, pour strength, food, medications, tolerance, body composition, liver function, and time accuracy. If the consequence is driving, work safety, legal exposure, or injury, the calculator is not enough.

Body-fat circumference methods use tape measurements as proxies. They are useful because they are cheap and repeatable. They are limited because tape placement, posture, hydration, bloating, muscle distribution, and formula population all affect results.

Hydration tools estimate needs from mass, activity, heat, and sweat logic. They cannot see sodium status, kidney conditions, heart conditions, medications, illness, or heat injury. Nicotine timeline tools estimate common phases, but withdrawal and relapse risk vary widely.

## Worked example

A user wants to track a body recomposition plan. They take waist, neck, and hip measurements monthly, under the same morning conditions. Structural Density gives a trend. Hydraulic Integrity helps plan water around workouts. Metabolic Floor from the maintenance cluster gives a rough calorie baseline. The useful signal is not one body-fat percentage; it is the direction across repeated measurements.

Another user enters drink timing into Impairment Coefficient. The result suggests possible residual BAC, but the key output is the warning: estimates are not clearance. If there is any meaningful uncertainty, the safe choice is not driving or doing safety-sensitive work.

## Common mistakes

The first mistake is treating a rough body-fat reading as identity. Circumference formulas can be useful for trend, but they are not moral feedback and not a complete health picture.

The second mistake is using hydration math after symptoms already appear. Dizziness, confusion, fainting, heat illness signs, or severe vomiting need appropriate care. The calculator is for planning intake, not deciding whether an emergency is real.

The third mistake is turning nicotine timelines into willpower theater. Quitting is easier with support, planning, and evidence-based resources. A timeline can help normalize phases, but support matters more than a graphic.

## What to use next

If the user is setting calorie targets, connect to [Metabolic Floor](/health/metabolic-floor/). If the user is training, connect to [Structural Output](/health/structural-output/). If heat, sun, or air quality matter, connect to [Environmental Stressors](/health/environmental-stressors/).`,
    faq: [
      {
        q: 'Can a BAC calculator tell me if I can drive?',
        a: 'No, a BAC calculator cannot tell you if you can legally or safely drive. Drink estimates can be wrong because pours, body factors, food, time, and metabolism vary. Use safe transportation when impairment is possible.',
        faq_intent: 'trust',
      },
      {
        q: 'How should I use body-fat percentage estimates?',
        a: 'Use body-fat percentage estimates as repeatable trend signals, not exact truth. Measure under the same conditions, compare monthly, and avoid overreacting to one reading. Clinical or athletic decisions need more reliable measurement and qualified guidance.',
        faq_intent: 'how-to',
      },
      {
        q: 'Why can hydration calculators be wrong?',
        a: 'Hydration calculators can be wrong because sweat rate, heat, humidity, sodium loss, medications, illness, kidney function, and activity intensity vary widely. Use them for planning, but take symptoms and medical conditions more seriously than the estimate.',
        faq_intent: 'definition',
      },
      {
        q: 'Is the nicotine cessation timeline medical advice?',
        a: 'No, the nicotine cessation timeline is educational and should not replace cessation counseling, medication guidance, quitlines, or clinician support. It can help users understand common stages, but nicotine dependence and withdrawal vary by person.',
        faq_intent: 'trust',
      },
      {
        q: 'When should I not rely on body-state tools?',
        a: 'Do not rely on body-state tools when legal, safety, emergency, pregnancy, illness, or medication questions are involved. The calculators are rough planning aids. High-stakes situations need official tests, qualified professionals, or emergency support.',
        faq_intent: 'edge-case',
      },
    ],
  },
  {
    id: 'art-health-structural-output-overview',
    clusterId: 'structural-output',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'training-load-output-guide',
    guideCategory: 'Health',
    title: 'Training Load and Structural Output Guide: Strength, Zones, and METs | Kefiw',
    h1: 'Training Load and Structural Output Guide',
    subhead: 'Estimate output, compare sessions, and choose training ranges without pretending formulas replace coaching.',
    discoverHeadline: 'The training numbers that help without pretending to be a coach',
    outcomeLine: 'Training calculators are strongest when they set ranges and expose assumptions.',
    description: 'Guide to structural-output tools: 1RM estimates, Wilks strength comparison, heart-rate zones, and MET calorie expenditure.',
    metaDescription: 'Use Kefiw structural-output calculators for 1RM, Wilks, heart-rate zones, and MET calories with clear assumptions and limits.',
    keywords: ['1RM calculator guide', 'heart rate zones guide', 'MET calorie calculator', 'Wilks calculator', 'training load'],
    intro: 'The structural-output cluster is for users trying to translate performance into planning numbers: a safer 1RM estimate, a relative-strength score, a heart-rate zone, or an activity calorie estimate.',
    primaryCta: { href: '/health/structural-output/', label: 'Open Structural Output' },
    secondaryCtas: [
      { href: '/health/max-load-capacity/', label: 'Max Load Capacity' },
      { href: '/health/heart-rate-zones/', label: 'Heart Rate Zones' },
      { href: '/health/kinetic-expenditure/', label: 'Kinetic Expenditure' },
    ],
    keyPoints: [
      '1RM estimates are safest when based on clean reps in a reasonable rep range.',
      'Wilks-style scores compare relative strength, but federation standards and formulas differ.',
      'Heart-rate zones are useful for aerobic training, less useful for judging strength-training quality.',
      'MET calorie estimates are activity averages and can be very wrong for individuals.',
      'Use the tools for ranges, comparisons, and programming conversations, not medical clearance.',
    ],
    examples: [
      {
        title: 'Strength block planning',
        body: 'A lifter uses a five-rep set to estimate training loads without testing a true max.',
      },
      {
        title: 'Zone confusion',
        body: 'A beginner checks heart-rate zones but also learns that strength sessions are not judged mainly by heart rate.',
      },
      {
        title: 'Activity calories',
        body: 'A user estimates hiking energy cost but treats the MET result as a rough range rather than a precise burn.',
      },
    ],
    whenToUse: [
      { toolId: 'max-load-capacity', note: 'Use to estimate 1RM and training loads from clean submax reps.' },
      { toolId: 'strength-efficiency', note: 'Use to compare relative lifting output across bodyweights.' },
      { toolId: 'heart-rate-zones', note: 'Use to set aerobic intensity ranges from heart-rate assumptions.' },
      { toolId: 'kinetic-expenditure', note: 'Use to estimate activity energy expenditure from MET values and duration.' },
    ],
    relatedIds: [
      'max-load-capacity',
      'strength-efficiency',
      'heart-rate-zones',
      'kinetic-expenditure',
      'art-hp-brzycki-1rm-guide',
      'art-hp-wilks-coefficient-guide',
      'art-hp-karvonen-heart-rate-zones',
      'art-hp-met-calorie-burn-guide',
    ],
    longformMarkdown: `## What the user is actually trying to do

Training calculators are usually opened with a specific question: "What weight should I use?" "How strong is this for my bodyweight?" "Which heart-rate zone am I in?" "How much energy did this activity probably cost?" Those questions are practical, but the answers are estimates.

The [Max Load Capacity](/health/max-load-capacity/) tool estimates one-rep max from submax reps. [Strength Efficiency](/health/strength-efficiency/) compares relative strength. [Heart Rate Zones](/health/heart-rate-zones/) turns heart data into intensity bands. [Kinetic Expenditure](/health/kinetic-expenditure/) estimates energy cost from MET values.

CDC physical-activity guidance explains intensity through heart rate and breathing changes, and federal activity guidelines give broad weekly targets. Those are useful anchors, but they do not individualize training. A coach, clinician, or qualified professional may be needed for injury, disease, return-to-play, pregnancy, or high-performance programming.

References: [CDC measuring physical activity intensity](https://www.cdc.gov/physical-activity-basics/measuring/index.html) and [CDC activity guidelines](https://www.cdc.gov/physical-activity-basics/guidelines/index.html).

## Formula, inputs, and assumptions

1RM formulas use lifted weight and repetitions to estimate a theoretical maximum. The assumption is that reps were clean, the exercise fits the formula, the rep range is reasonable, and fatigue did not distort the set. Above moderate reps, endurance and technique noise increase.

Wilks-style tools use bodyweight and lifted total to estimate relative strength. The limitation is that formulas vary, federations change standards, and age, sex category, equipment, and competition rules matter.

Heart-rate zones use maximum heart rate or heart-rate reserve assumptions. Wrist sensors, stress, heat, caffeine, dehydration, and medications can change readings. Zones are more useful for aerobic work than for judging heavy lifting, where muscular force and rest intervals matter more.

MET estimates multiply body mass, duration, and activity intensity. MET tables are population averages. Terrain, efficiency, load carried, fitness, heat, and technique can all change true expenditure.

## Worked example

A user bench presses 135 pounds for eight clean reps. Max Load Capacity estimates a 1RM and suggests training loads. The user does not need to test a risky heavy single. They use the estimate to choose a moderate training range and retest in several weeks.

The same user starts cycling for conditioning. Heart Rate Zones gives a target range for moderate work. Kinetic Expenditure estimates energy cost for a 45-minute ride. If the ride was in heat, with hills, or with unusual fatigue, the user treats the calorie estimate as rough.

The pattern is: use formulas to plan, use body response to adjust, and use qualified guidance for injury or medical concerns.

## Common mistakes

The first mistake is using ugly reps in a 1RM estimate. If the last rep involved partial range or form breakdown, the input is not clean. The second mistake is treating watch calories as exact. A MET estimate and a wearable estimate can both be useful and both wrong.

The third mistake is chasing heart-rate zones during strength work. A hard squat set can have a modest average heart rate because the work is short and rest periods are long. That does not mean the session was easy.

## What to use next

If training output affects nutrition, use [Bio-Chemical Logistics](/health/bio-chemical-logistics/) for macros, electrolytes, and protein bolus planning. If heat or environment affects training, use [Environmental Stressors](/health/environmental-stressors/) before the session.`,
    faq: [
      {
        q: 'How reliable is a one-rep max estimate?',
        a: 'A one-rep max calculator is most useful when reps are clean, submaximal, and within the formula range. It becomes less reliable with high reps, poor form, unusual lifts, fatigue, or injury history. Treat the result as a training estimate.',
        faq_intent: 'trust',
      },
      {
        q: 'Should heart-rate zones guide strength training?',
        a: 'Heart-rate zones should not be the main guide for strength training because lifting quality depends on load, reps, form, rest, and progression. Zones are better for aerobic intensity. Strength sessions can feel hard while average heart rate remains modest.',
        faq_intent: 'comparison',
      },
      {
        q: 'Why do MET calorie estimates differ from my watch?',
        a: 'MET calorie estimates differ from watches because each uses different assumptions about intensity, body size, heart rate, efficiency, and movement. Both are estimates. Use them to compare activities and trends, not to eat back exact calories.',
        faq_intent: 'troubleshooting',
      },
      {
        q: 'Can Wilks compare every lifter fairly?',
        a: 'Wilks can compare relative strength better than raw totals, but it is still a formula with category limits. Age, sex category, equipment, federation rules, bodyweight extremes, and lift standards all affect interpretation. Use it as context, not identity.',
        faq_intent: 'trust',
      },
      {
        q: 'When should I not use training calculators?',
        a: 'Do not use training calculators for medical clearance, injury rehab, pregnancy exercise decisions, return-to-play, or symptoms such as chest pain or fainting. Those cases need qualified guidance. Calculators are for ordinary planning and comparison.',
        faq_intent: 'edge-case',
      },
    ],
  },
  {
    id: 'art-health-bio-logistics-overview',
    clusterId: 'bio-logistics',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'macro-hydration-protein-logistics-guide',
    guideCategory: 'Health',
    title: 'Bio-Chemical Logistics Guide: Macros, Waist-to-Height, Sweat, and Protein | Kefiw',
    h1: 'Bio-Chemical Logistics Guide',
    subhead: 'Plan fuel and fluid logistics with formulas, then adjust from real-world response.',
    discoverHeadline: 'The fuel-and-fluid planning mistakes that make health math brittle',
    outcomeLine: 'Macro, electrolyte, and protein tools work best as planning rails, not rigid prescriptions.',
    description: 'Guide to bio-chemical logistics tools: macro split, waist-to-height ratio, sweat-loss electrolytes, and per-meal protein bolus.',
    metaDescription: 'Use Kefiw bio-logistics tools for macro splits, waist-to-height ratio, sweat-loss electrolytes, and protein bolus planning with clear limits.',
    keywords: ['macro calculator guide', 'waist to height ratio', 'electrolyte calculator', 'protein bolus guide', 'sweat loss calculator'],
    intro: 'Bio-chemical logistics is the planning layer after basic body estimates: how to split fuel, what waist-to-height may signal, how much sweat loss matters, and whether protein is distributed well across meals.',
    primaryCta: { href: '/health/bio-chemical-logistics/', label: 'Open Bio-Chemical Logistics' },
    secondaryCtas: [
      { href: '/health/fuel-partition/', label: 'Fuel Partitioning' },
      { href: '/health/ion-balance/', label: 'Ion Balance' },
      { href: '/health/anabolic-trigger/', label: 'Anabolic Trigger' },
    ],
    keyPoints: [
      'Macro calculators depend on the calorie target they receive.',
      'Waist-to-height ratio is a screening signal, not a diagnosis.',
      'Sweat-loss tools help planning but cannot see sodium concentration or medical conditions.',
      'Protein bolus estimates are useful for meal distribution, especially around training.',
      'Nutrition tools should avoid treatment claims unless the use case explicitly supports them.',
    ],
    examples: [
      {
        title: 'Macro planning',
        body: 'A user gets TDEE from Metabolic Floor, then uses Fuel Partitioning to translate calories into protein, fat, and carbohydrate grams.',
      },
      {
        title: 'Hot workout',
        body: 'A user weighs before and after training and uses Ion Balance to estimate fluid and electrolyte replacement range.',
      },
      {
        title: 'Protein distribution',
        body: 'A lifter sees that all daily protein is crammed into dinner and uses Anabolic Trigger to spread meals more evenly.',
      },
    ],
    whenToUse: [
      { toolId: 'fuel-partition', note: 'Use after estimating calorie target and goal direction.' },
      { toolId: 'metabolic-incline', note: 'Use as a waist-to-height screening signal, not a diagnosis.' },
      { toolId: 'ion-balance', note: 'Use after sweat-heavy activity to plan replacement ranges.' },
      { toolId: 'anabolic-trigger', note: 'Use to distribute protein across meals around training or recovery goals.' },
    ],
    relatedIds: [
      'fuel-partition',
      'metabolic-incline',
      'ion-balance',
      'anabolic-trigger',
      'art-hp-macro-split-guide',
      'art-hp-waist-to-height-ratio-guide',
      'art-hp-electrolyte-sweat-loss-guide',
      'art-hp-protein-bolus-mps-guide',
    ],
    longformMarkdown: `## What the user is actually trying to do

The bio-logistics tools are for users who already have a rough baseline and now want to plan implementation. They may be trying to cut, maintain, gain, train in heat, spread protein across meals, or understand why waist size matters beyond body weight.

The [Fuel Partitioning](/health/fuel-partition/) tool translates a calorie target into macros. [Metabolic Incline](/health/metabolic-incline/) uses waist-to-height ratio as a screening-style signal. [Ion Balance](/health/ion-balance/) estimates sweat-related replacement needs. [Anabolic Trigger](/health/anabolic-trigger/) estimates per-meal protein bolus logic.

Dietary guidance is broad because people differ. The Dietary Guidelines for Americans provide population-level dietary-pattern guidance. Sports nutrition research can inform protein distribution for training, but individual medical conditions, kidney disease, eating disorders, pregnancy, and clinician-directed diets are outside calculator scope.

References: [Dietary Guidelines for Americans](https://www.dietaryguidelines.gov/about-dietary-guidelines/previous-editions/2020-dietary-guidelines), [ISSN protein and exercise position stand](https://pubmed.ncbi.nlm.nih.gov/28642676-international-society-of-sports-nutrition-position-stand-protein-and-exercise/), and [National Academies water and electrolyte DRIs](https://www.nationalacademies.org/our-work/dietary-reference-intakes-for-electrolytes-and-water).

## Formula, inputs, and assumptions

Macro tools start with calories. Protein, fat, and carbohydrate targets are then allocated by rule. The biggest hidden dependency is the calorie estimate. If TDEE is wrong, the macro split can be mathematically clean and still miss reality.

Waist-to-height ratio divides waist circumference by height. It is attractive because it is simple and captures central-body-size information that scale weight can miss. But it is still a screening signal, not a diagnosis or complete risk model.

Sweat tools use body mass change, activity, duration, and replacement assumptions. The challenge is sodium: two people can lose similar fluid volumes with very different sodium concentrations. Heat acclimation, clothing, humidity, intensity, and medications also matter.

Protein bolus tools use body size, training context, and meal distribution assumptions. They are planning aids for ordinary users, not treatment guidance.

## Worked example

A user estimates TDEE at 2,400 calories. Fuel Partitioning sets a moderate protein target, a fat floor, and carbohydrate remainder. The user trains outdoors in heat and weighs 1.2 pounds less after the session. Ion Balance estimates replacement range. At dinner, they notice most daily protein is loaded into one meal, so Anabolic Trigger suggests spreading protein across breakfast, lunch, and dinner.

The practical result is a plan: target calories, macro rails, replacement after heavy sweating, and a better protein distribution. The user still watches real outcomes: weight trend, training performance, thirst, digestion, and recovery.

## Common mistakes

The first mistake is treating macro grams as medicine. For healthy users, macros can guide planning, but food quality, adherence, culture, budget, and health conditions matter. The second mistake is ignoring heat and sweat until after symptoms. Hydration logistics should happen before the session.

The third mistake is using waist-to-height ratio as a verdict. It is a useful signal to discuss with broader context, not a full assessment of health.

## What to use next

If the user needs a calorie starting point, send them to [Metabolic Floor](/health/metabolic-floor/). If the question is training output, connect to [Structural Output](/health/structural-output/). If heat, UV, or air quality are involved, connect to [Environmental Stressors](/health/environmental-stressors/).`,
    faq: [
      {
        q: 'How do macro calculators decide grams?',
        a: 'Macro calculators convert a calorie target into protein, fat, and carbohydrate grams using selected rules. The result depends heavily on the starting calorie estimate and goal. If the calorie target is wrong, the macro split can also miss.',
        faq_intent: 'definition',
      },
      {
        q: 'Is waist-to-height ratio a diagnosis?',
        a: 'No, waist-to-height ratio is a screening-style body-size signal and not a diagnosis. It can add context beyond scale weight, but health risk depends on many factors. Use it for awareness and discussion, not self-diagnosis.',
        faq_intent: 'trust',
      },
      {
        q: 'When do I need an electrolyte calculator?',
        a: 'Use an electrolyte calculator after sweat-heavy training, hot work, long events, or repeated sessions where fluid loss matters. It is less useful for ordinary short activity. Symptoms, illness, medical conditions, and heat stress require appropriate care.',
        faq_intent: 'how-to',
      },
      {
        q: 'Can protein bolus tools replace diet advice?',
        a: 'No, protein bolus tools cannot replace diet advice for medical conditions, kidney disease, pregnancy, eating disorders, or clinician-directed diets. They are ordinary planning aids for distributing protein across meals, especially around training.',
        faq_intent: 'trust',
      },
      {
        q: 'Should I use macros or calories first?',
        a: 'Use calories first because macro grams are built from the calorie target. Once the calorie target is reasonable, macros help distribute protein, fat, and carbohydrate. Then real-world trend data should adjust the plan.',
        faq_intent: 'comparison',
      },
    ],
  },
  {
    id: 'art-health-environmental-stressors-overview',
    clusterId: 'environmental-stressors',
    pageType: 'support',
    kind: 'guide',
    section: 'guides',
    slug: 'environmental-stressors-performance-guide',
    guideCategory: 'Health',
    title: 'Environmental Stressors Guide: UV, CO2, Heat, and Cold | Kefiw',
    h1: 'Environmental Stressors Guide',
    subhead: 'Estimate outside loads before they quietly degrade comfort, safety, and performance.',
    discoverHeadline: 'The environmental loads that make a normal day feel harder',
    outcomeLine: 'Environment tools are most useful before exposure, not after symptoms appear.',
    description: 'Guide to environmental-stressor tools: UV exposure, indoor CO2 cognitive tax, WBGT heat stress, and clothing insulation.',
    metaDescription: 'Use Kefiw environmental-stressor calculators for UV exposure, CO2, WBGT heat stress, and clothing insulation with safety limits.',
    keywords: ['environmental stressors', 'WBGT heat stress', 'UV exposure calculator', 'CO2 cognition', 'clo insulation'],
    intro: 'The environmental-stressors cluster is for users who suspect the room, weather, sun, heat, or cold is part of the problem. These tools help estimate exposure before the user relies on willpower.',
    primaryCta: { href: '/health/environmental-stressors/', label: 'Open Environmental Stressors' },
    secondaryCtas: [
      { href: '/health/uv-exposure/', label: 'UV Exposure' },
      { href: '/health/co2-cognitive-tax/', label: 'CO2 Cognitive Tax' },
      { href: '/health/thermal-failure/', label: 'Thermal Failure' },
    ],
    keyPoints: [
      'UV tools help plan exposure, but sunscreen, shade, clothing, and skin factors still matter.',
      'CO2 estimates can flag ventilation concerns but do not measure every indoor-air risk.',
      'WBGT is a stronger heat-stress signal than air temperature alone.',
      'Clo insulation planning helps clothing decisions but cannot guarantee comfort or safety.',
      'When heat illness, respiratory symptoms, or cold injury signs appear, stop relying on calculators.',
    ],
    examples: [
      {
        title: 'Outdoor work',
        body: 'A user checks WBGT-style heat load before scheduling strenuous outdoor work.',
      },
      {
        title: 'Stuffy meeting room',
        body: 'A team suspects high CO2 after long meetings feel dull and foggy, then uses the tool as a prompt to improve ventilation.',
      },
      {
        title: 'Sun exposure',
        body: 'A user estimates burn timing but still treats shade, clothing, and sunscreen as the real protective actions.',
      },
    ],
    whenToUse: [
      { toolId: 'uv-exposure', note: 'Use before outdoor sun exposure to estimate risk windows and protective planning.' },
      { toolId: 'co2-cognitive-tax', note: 'Use when indoor air feels stale and attention or comfort may be affected.' },
      { toolId: 'thermal-failure', note: 'Use before heat exposure, training, outdoor work, or events in hot conditions.' },
      { toolId: 'insulation-logic', note: 'Use for clothing insulation planning in cold or variable conditions.' },
    ],
    relatedIds: [
      'uv-exposure',
      'co2-cognitive-tax',
      'thermal-failure',
      'insulation-logic',
      'art-hm-indoor-co2-cognition-guide',
      'art-hm-wbgt-heat-stress-guide',
      'art-hm-clo-insulation-guide',
    ],
    longformMarkdown: `## What the user is actually trying to do

Environmental tools are for people who notice that performance is not only internal. A hot job site, high sun, stale room, cold commute, or poorly chosen clothing layer can change how a normal task feels. The user is trying to plan exposure before the environment becomes the bottleneck.

[UV Exposure](/health/uv-exposure/) estimates sun-related timing. [CO2 Cognitive Tax](/health/co2-cognitive-tax/) gives a ventilation-related signal. [Thermal Failure](/health/thermal-failure/) focuses on heat stress. [Insulation Logic](/health/insulation-logic/) helps think through clothing insulation.

OSHA and NIOSH materials emphasize that heat illness is preventable and that WBGT is used for heat-hazard assessment because it captures more than air temperature. CDC/NIOSH also emphasizes risk reduction through acclimatization, hydration, training, and reducing exposure. Those sources support conservative planning, not false certainty.

References: [OSHA heat exposure overview](https://www.osha.gov/heat-exposure), [OSHA heat hazard recognition](https://www.osha.gov/heat-exposure/hazards), and [CDC/NIOSH heat stress](https://www.cdc.gov/niosh/heat-stress/about/).

## Formula, inputs, and assumptions

UV tools depend on UV index, skin assumptions, exposure time, and protection factors. Real risk depends on clouds, reflection, altitude, medications, skin type, sunscreen application, sweating, clothing, and shade.

CO2 tools use concentration as a ventilation proxy. CO2 is not the only indoor-air issue. Particulates, VOCs, humidity, allergens, and infection risk are separate problems. Still, high CO2 can be a practical signal that ventilation deserves attention.

Heat-stress tools are strongest when they consider WBGT-style inputs rather than temperature alone. Air temperature, humidity, radiant heat, wind, workload, clothing, acclimatization, and rest cycles all affect risk.

Clo insulation tools estimate clothing warmth. They cannot know wet clothing, wind leaks, individual cold tolerance, circulation, fatigue, or exposure duration perfectly.

## Worked example

A user plans a two-hour outdoor training session. Air temperature looks tolerable, but humidity and sun are high. Thermal Failure suggests a higher heat-stress load than temperature alone implied. The user moves the session earlier, lowers intensity, adds rest, and checks hydration logistics with [Ion Balance](/health/ion-balance/).

Another user notices a conference room feels stale after long meetings. CO2 Cognitive Tax does not prove cognitive harm in that specific room, but it gives a reason to open ventilation, shorten meetings, or measure CO2 directly.

## Common mistakes

The first mistake is reacting after symptoms. Heat illness, cold injury, faintness, confusion, respiratory symptoms, or severe discomfort are not calculator moments. They are stop-and-seek-appropriate-help moments.

The second mistake is trusting one environmental number. UV index without exposure time is incomplete. Temperature without humidity and sun is incomplete. CO2 without other indoor-air context is incomplete.

The third mistake is assuming fitness removes environmental risk. Fit people can still overheat, burn, become dehydrated, or lose performance in poor air.

## What to use next

For sweat-heavy conditions, use [Ion Balance](/health/ion-balance/). For training output under environmental load, use [Structural Output](/health/structural-output/). For sleep disruption from heat, stimulants, or alcohol, use [Biological Maintenance](/health/biological-maintenance/).`,
    faq: [
      {
        q: 'Why use WBGT instead of temperature?',
        a: 'WBGT is useful because heat stress depends on humidity, radiant heat, wind, and workload, not air temperature alone. OSHA notes WBGT use for heat-hazard assessment. Temperature alone can underestimate risk in sun or humid conditions.',
        faq_intent: 'definition',
      },
      {
        q: 'Can a UV calculator prevent sunburn?',
        a: 'No calculator can prevent sunburn by itself; it can only estimate exposure risk and timing. Real protection comes from shade, clothing, sunscreen, timing, and reapplication. Skin type, medication, altitude, reflection, and sweating can change risk.',
        faq_intent: 'trust',
      },
      {
        q: 'Does high CO2 prove a room is unsafe?',
        a: 'High CO2 does not prove every indoor-air risk, but it can indicate poor ventilation and a need to investigate. CO2 is a useful signal, not a complete air-quality diagnosis. Other pollutants and infection risks require separate assessment.',
        faq_intent: 'trust',
      },
      {
        q: 'When should I stop using environmental calculators?',
        a: 'Stop using environmental calculators when symptoms, safety risks, or emergency conditions appear. Confusion, fainting, heat illness signs, breathing problems, severe cold exposure, or rapidly changing weather need immediate practical action and appropriate help.',
        faq_intent: 'edge-case',
      },
      {
        q: 'How do I use environmental tools before training?',
        a: 'Use environmental tools before training by checking heat, sun, air, and clothing conditions, then adjusting time, intensity, rest, hydration, and protection. The goal is not a perfect score. It is a safer plan before exposure starts.',
        faq_intent: 'how-to',
      },
    ],
  },
];

import type { ContentPageConfig } from '../content-pages';

const PLAYBOOK_CATEGORY = 'Care Playbooks';

const sharedPlaybookDisclaimer = `## Important limit

Kefiw playbooks are educational care-planning aids. They help families organize observations, calls, documentation, and next steps. They do not provide medical, legal, tax, financial, insurance, Medicare, Medicaid, benefits, or emergency advice. If someone may be in immediate danger or experiencing a medical emergency, call emergency services now.`;

interface PlaybookLink {
  label: string;
  href: string;
}

interface CarePlaybook {
  slug: string;
  id: string;
  title: string;
  description: string;
  intro: string;
  today: string[];
  week: string[];
  document: string[];
  call: string[];
  calculator: PlaybookLink;
  worksheet: PlaybookLink;
  escalate: string[];
  script: string;
  related: PlaybookLink[];
}

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function playbookBody(playbook: CarePlaybook): string {
  return `## What to do today

${list(playbook.today)}

## What to do this week

${list(playbook.week)}

## What to document

${list(playbook.document)}

## Who to call

${list(playbook.call)}

## Which Kefiw calculator to use

[${playbook.calculator.label}](${playbook.calculator.href})

Use the calculator to turn the situation into a clearer number, workload, or comparison. Do not use it as a professional determination.

## Which worksheet to print

[${playbook.worksheet.label}](${playbook.worksheet.href})

Print it before the family meeting, provider call, tour, appointment, or insurance conversation.

## When to escalate

${list(playbook.escalate)}

## Family script

"${playbook.script}"

## Care review date

Review this plan again in 30 days, or sooner if there is a fall, hospitalization, medication change, wandering incident, caregiver burnout, major cost increase, facility concern, or failed backup plan.

${sharedPlaybookDisclaimer}`;
}

function makePlaybook(playbook: CarePlaybook): ContentPageConfig {
  return {
    id: playbook.id,
    kind: 'guide',
    section: 'guides',
    guideCategory: PLAYBOOK_CATEGORY,
    slug: playbook.slug,
    title: `${playbook.title} | Kefiw Care Playbook`,
    h1: playbook.title,
    description: playbook.description,
    metaDescription: playbook.description,
    keywords: ['care playbook', 'senior care planning', 'family caregiver checklist', playbook.title.toLowerCase()],
    intro: playbook.intro,
    outcomeLine: 'A short action plan for what to do today, this week, and when to escalate.',
    primaryCta: { href: playbook.calculator.href, label: `Use ${playbook.calculator.label}` },
    secondaryCtas: [{ href: playbook.worksheet.href, label: `Print ${playbook.worksheet.label}` }],
    keyPoints: [
      'Start with safety, baseline change, and who owns the next call.',
      'Document facts while they are fresh: dates, names, symptoms, costs, and unresolved risks.',
      'Escalate when the plan depends on luck, one exhausted caregiver, or missing professional input.',
    ],
    longformMarkdown: playbookBody(playbook),
    relatedLinks: playbook.related,
    faq: [
      {
        q: 'How is a care playbook different from a guide?',
        a: 'A guide explains a topic. A playbook is shorter and action-oriented: what to do today, what to do this week, what to document, who to call, and when to escalate.',
      },
      {
        q: 'Can this playbook replace a clinician, attorney, insurer, or emergency service?',
        a: 'No. Use it to organize the next step and prepare better questions. Confirm medical, legal, insurance, tax, benefits, and emergency decisions with qualified sources.',
      },
    ],
  };
}

const playbooks: CarePlaybook[] = [
  {
    slug: 'parent-fall-what-now',
    id: 'art-care-playbook-parent-fall',
    title: 'My Parent Had a Fall - What Now?',
    description: 'Use this fall playbook to check immediate safety, document what happened, call the right people, review home risks, and reassess care needs.',
    intro: 'A fall should trigger more than a quick cleanup. Families need to check immediate danger, write down the facts, notify the right people, and decide whether the care plan still fits.',
    today: [
      'Check for immediate danger, serious injury, head impact, new confusion, severe pain, or inability to walk.',
      'Call emergency services if the fall may be serious or you are unsure.',
      'Write down the time, location, activity, footwear, lighting, symptoms, medication changes, and whether there was injury.',
      'Make the walking path safer before the next bathroom trip, meal, or bedtime routine.',
      'Tell the primary caregiver or family point person what happened.',
    ],
    week: [
      'Call the clinician if there was injury, repeated falls, dizziness, new weakness, medication change, or concern about baseline change.',
      'Review medications with a clinician or pharmacist if dizziness, sleepiness, confusion, or balance changed.',
      'Check the bathroom, bed path, stairs, rugs, lighting, footwear, and mobility device placement.',
      'Reassess whether more supervision, home care, adult day care, or facility support is needed.',
    ],
    document: [
      'Fall date, time, and location.',
      'What was happening right before the fall.',
      'Symptoms before and after the fall.',
      'Injuries, head impact, and whether emergency help was called.',
      'Follow-up calls, names, instructions, and care-plan changes.',
    ],
    call: [
      'Emergency services for immediate danger or serious symptoms.',
      'Primary care clinician, urgent care, or nurse line for medical follow-up.',
      'Pharmacist or prescriber if medication changes may be related.',
      'Home care agency, facility nurse, or family care lead if the fall happened under a care plan.',
    ],
    calculator: { label: 'Care Urgency Check', href: '/health/medical-triage/' },
    worksheet: { label: 'Fall and Near-Fall Log', href: '/care/guides/fall-near-fall-log/' },
    escalate: [
      'There is head injury, loss of consciousness, severe pain, new confusion, new weakness, chest discomfort, shortness of breath, or inability to walk.',
      'Falls repeat or near-falls are becoming common.',
      'The caregiver cannot safely help after a fall.',
      'The home setup cannot be made safe enough for current mobility needs.',
    ],
    script: 'Normally, they can move from the chair to the bathroom. Today they fell near the hallway at 7 p.m. and seem more unsteady. What level of care should we seek?',
    related: [
      { label: 'Fall Prevention Daily Routine', href: '/care/guides/fall-prevention-daily-routine/' },
      { label: 'Home Safety Checklist', href: '/care/guides/home-safety-checklist-for-older-adults/' },
      { label: 'Mobility, Transfers, and Walking Safety', href: '/care/guides/mobility-transfers-walking-safety/' },
    ],
  },
  {
    slug: 'hospital-discharge-coming-questions',
    id: 'art-care-playbook-hospital-discharge',
    title: 'Hospital Discharge Is Coming - What Should We Ask?',
    description: 'Use this hospital discharge playbook to plan the first night, medication changes, equipment, home care, rehab, coverage, and backup options.',
    intro: 'Hospital discharge can move faster than a family is ready for. This playbook helps families ask about the first night, medication changes, equipment, follow-up, cost, and what happens if home is not safe.',
    today: [
      'Ask where the person is expected to go: home, rehab, skilled nursing, assisted living, or another setting.',
      'Ask what exactly must happen during the first night after discharge.',
      'Ask for the updated medication list and what changed from before admission.',
      'Confirm equipment, oxygen, wound supplies, walker, commode, or home health orders before leaving.',
      'Ask who the family calls after hours if the plan fails.',
    ],
    week: [
      'Schedule follow-up appointments and transportation.',
      'Confirm home care, family shifts, meals, bathroom access, and medication setup.',
      'If rehab is recommended, ask about therapy goals, expected length of stay, coverage notices, and private-pay rate.',
      'Build a 72-hour care plan, then reassess needs after the person is home or settled.',
    ],
    document: [
      'Discharge destination and expected arrival time.',
      'Medication changes, stopped medications, new prescriptions, and refill plan.',
      'Equipment ordered, delivery status, and who owns setup.',
      'Warning signs, after-hours number, and follow-up appointments.',
      'Coverage, copays, private-pay rates, and notices received.',
    ],
    call: [
      'Hospital discharge planner or case manager.',
      'Primary care clinician or specialist office.',
      'Pharmacy for medication reconciliation and availability.',
      'Home health, home care agency, rehab, or facility admissions contact.',
    ],
    calculator: { label: 'Care Needs Checklist', href: '/care/care-needs-checklist/' },
    worksheet: { label: 'Care Needs Green / Yellow / Red Worksheet', href: '/care/guides/care-needs-green-yellow-red-worksheet/' },
    escalate: [
      'The person cannot safely toilet, transfer, eat, take medication, or be supervised at the discharge destination.',
      'Medication changes are unclear or prescriptions are unavailable.',
      'Required equipment will not arrive before the person does.',
      'The family is told to handle skilled tasks without training.',
    ],
    script: 'We are not refusing discharge. We are asking for a safe discharge plan. What care is required for the first night, who provides it, and what should we do if the plan fails?',
    related: [
      { label: 'Hospital to Home, Rehab, or Facility Transition Guide', href: '/care/guides/hospital-to-home-rehab-facility-transition/' },
      { label: 'Short-Term Rehab vs. Long-Term Care', href: '/care/guides/short-term-rehab-vs-long-term-care/' },
      { label: 'Nursing Home Cost Calculator', href: '/care/nursing-home-cost-calculator/' },
    ],
  },
  {
    slug: 'home-care-getting-too-expensive',
    id: 'art-care-playbook-home-care-expensive',
    title: 'Home Care Is Getting Too Expensive',
    description: 'Use this playbook to compare home care hours, adult day care, respite, assisted living, memory care, family workload, and backup coverage.',
    intro: 'Home care can be affordable at a few hours a week and unrealistic when supervision rises. This playbook helps families compare the whole plan, not just the hourly rate.',
    today: [
      'Write the current hourly rate, weekly hours, minimum shifts, weekend rates, and backup fees.',
      'Count unpaid family hours, including supervision and overnight worry.',
      'Identify which hours are safety-critical and which are convenience or household support.',
      'Check whether adult day care, respite, family task ownership, or schedule redesign could reduce pressure safely.',
    ],
    week: [
      'Run home care, caregiver hours, and assisted living scenarios side by side.',
      'Ask the agency what schedule changes would reduce cost without creating unsafe gaps.',
      'Tour one assisted living or memory care option if hours are rising quickly.',
      'Set a review trigger, such as home care reaching 40 hours per week or nighttime supervision becoming necessary.',
    ],
    document: [
      'Current weekly paid hours and total monthly cost.',
      'Unpaid family hours and who covers uncovered time.',
      'Missed shifts, callouts, late arrivals, and backup costs.',
      'Care tasks that still fail despite paid care.',
      'Comparison of home care, adult day care, assisted living, and memory care.',
    ],
    call: [
      'Home care agency supervisor.',
      'Adult day care program.',
      'Area Agency on Aging or Eldercare Locator.',
      'Assisted living or memory care communities for sample invoices.',
    ],
    calculator: { label: 'Home Care Cost Calculator', href: '/care/home-care-cost-calculator/' },
    worksheet: { label: 'Family Care Budget Worksheet', href: '/care/guides/family-care-budget-worksheet/' },
    escalate: [
      'The person cannot be alone safely during uncovered hours.',
      'Family caregivers are still constantly on call.',
      'Paid care costs exceed facility options but safety is still fragile.',
      'Dementia, transfers, toileting, or nighttime needs are beyond the current home plan.',
    ],
    script: 'The hourly rate is only one part of the decision. We need to compare the full weekly schedule, family hours, backup plan, and whether home is still safe.',
    related: [
      { label: 'Home Care Cost Guide', href: '/care/guides/home-care-cost-guide/' },
      { label: 'Adult Day Care Guide', href: '/care/guides/adult-day-care-guide/' },
      { label: 'Assisted Living Cost Calculator', href: '/care/assisted-living-cost-calculator/' },
    ],
  },
  {
    slug: 'sibling-wont-help-caregiving',
    id: 'art-care-playbook-sibling-wont-help',
    title: 'A Sibling Won\'t Help',
    description: 'Use this family care playbook to turn resentment into task ownership, money and time splits, scripts, documentation, and a review date.',
    intro: 'When one sibling will not help, the first move is not another vague plea. The family needs facts, a task list, a money/time split, and a clear ask.',
    today: [
      'Write down what you are doing now: hours, tasks, costs, calls, transportation, and emergencies.',
      'Separate emotional frustration from specific unmet tasks.',
      'Choose three tasks that could be owned by someone else.',
      'Ask for one specific action instead of general help.',
    ],
    week: [
      'Hold a short family meeting with an agenda.',
      'Use a task ownership table with owner, backup, due date, and communication rhythm.',
      'Discuss money and time together, not as separate conflicts.',
      'Set a review date so promises are checked.',
    ],
    document: [
      'Current caregiver hours and tasks.',
      'Out-of-pocket costs and reimbursements.',
      'Task owner, backup owner, deadline, and status.',
      'Family decisions, unresolved conflicts, and next review date.',
    ],
    call: [
      'Sibling or family decision-maker.',
      'Care manager, counselor, mediator, or elder law attorney if conflict blocks care.',
      'Local caregiver support organization for coaching or respite ideas.',
    ],
    calculator: { label: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/' },
    worksheet: { label: 'Family Meeting Agenda and Notes Template', href: '/care/guides/family-care-meeting-agenda-template/' },
    escalate: [
      'The care plan depends on one person who is no longer safe or sustainable.',
      'Money is being handled without authority or transparency.',
      'Family conflict is delaying urgent care, safe housing, medication, or supervision.',
      'The older adult may be neglected because no one owns the task.',
    ],
    script: 'I need us to stop saying everyone will help and decide who owns which tasks. I can keep doing some care, but I cannot be the backup for everything.',
    related: [
      { label: 'How to Talk to Siblings About Sharing Care Costs', href: '/care/guides/how-to-talk-to-siblings-about-sharing-care-costs/' },
      { label: 'Caregiver Hours Tracking Sheet', href: '/care/guides/caregiver-hours-tracking-sheet/' },
      { label: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/' },
    ],
  },
  {
    slug: 'mom-refuses-help',
    id: 'art-care-playbook-mom-refuses-help',
    title: 'Mom Refuses Help',
    description: 'Use this refusal-of-care playbook for small-step support, dignity scripts, safety thresholds, care documentation, and escalation planning.',
    intro: 'Refusal of help is often about control, fear, dignity, pain, timing, or confusion. This playbook helps families start smaller while still naming safety limits.',
    today: [
      'Pause the argument and identify what the refusal may be protecting: control, privacy, fear, pain, fatigue, or confusion.',
      'Shrink the task: wash face before shower, laundry help before home care, one appointment before a big plan.',
      'Offer two real choices inside a needed boundary.',
      'Write down what was refused, what worked, and whether safety was affected.',
    ],
    week: [
      'Try the support at a better time of day.',
      'Ask a clinician about sudden refusal, new confusion, pain, depression, medication effects, or infection concerns.',
      'Use a trusted person to introduce outside help if family conflict is part of the refusal.',
      'Define the safety threshold that would require more support even if the person dislikes it.',
    ],
    document: [
      'What help was refused and why it seemed distressing.',
      'Time of day, setting, people present, wording used, and smaller steps tried.',
      'Safety consequences such as missed medication, no bathing, falls, spoiled food, wandering, or missed appointments.',
      'Professional guidance received.',
    ],
    call: [
      'Primary clinician if refusal is sudden, dangerous, or tied to new symptoms.',
      'Home care agency or geriatric care manager for a gentler introduction plan.',
      'Emergency services if refusal creates immediate danger.',
    ],
    calculator: { label: 'Care Needs Checklist', href: '/care/care-needs-checklist/' },
    worksheet: { label: 'Care Needs Green / Yellow / Red Worksheet', href: '/care/guides/care-needs-green-yellow-red-worksheet/' },
    escalate: [
      'Refusal creates immediate danger or serious medical risk.',
      'Medication, food, fluids, toileting, hygiene, or supervision repeatedly fail.',
      'Dementia or delirium may be affecting judgment.',
      'The caregiver is using force or being harmed.',
    ],
    script: 'I do not want to fight with you. I want to understand what feels wrong about this and find a safer way to do it.',
    related: [
      { label: 'Refusal of Care and Resistance Guide', href: '/care/guides/refusal-of-care-resistance/' },
      { label: 'Talk to a Parent About Needing More Help', href: '/care/guides/how-to-talk-to-a-parent-about-needing-more-help/' },
      { label: 'Dementia Daily Routine Guide', href: '/care/guides/dementia-daily-routine/' },
    ],
  },
  {
    slug: 'dementia-safety-getting-worse',
    id: 'art-care-playbook-dementia-safety',
    title: 'Dementia Safety Is Getting Worse',
    description: 'Use this dementia safety playbook to respond to wandering, nighttime risk, refusal of care, caregiver limits, and memory care comparison.',
    intro: 'Dementia safety changes can arrive as small patterns: doors opened, stove left on, nighttime pacing, missed medication, or a caregiver who never sleeps. This playbook helps families decide when home needs more support.',
    today: [
      'Identify the specific safety problem: wandering, stove risk, nighttime confusion, falls, refusal, medication, driving, or being unsafe alone.',
      'Remove immediate hazards and create a no-alone rule for the riskiest time if needed.',
      'Write down the baseline change and the last three concerning events.',
      'Tell the backup caregiver or family point person that the risk level changed.',
    ],
    week: [
      'Ask a clinician about sudden or rapidly worsening confusion.',
      'Build a wandering and nighttime safety plan.',
      'Compare home supervision hours with adult day care, respite, assisted living, and memory care.',
      'Tour memory care before a crisis if wandering, nighttime risk, or caregiver collapse is emerging.',
    ],
    document: [
      'Incidents with date, time, trigger, location, and response.',
      'Unsafe moments that happened when no one was watching.',
      'Caregiver sleep loss and uncovered supervision hours.',
      'Costs of home care, adult day care, respite, and memory care.',
    ],
    call: [
      'Clinician for sudden change, medication review, pain, infection, dehydration, or sleep disruption concerns.',
      'Dementia care specialist, geriatric care manager, or Alzheimer\'s support organization.',
      'Memory care communities for dementia-specific staffing, wandering, and discharge questions.',
    ],
    calculator: { label: 'Memory Care Cost Calculator', href: '/care/memory-care-cost-calculator/' },
    worksheet: { label: 'Memory Care Evaluation Scorecard', href: '/care/guides/memory-care-evaluation-scorecard/' },
    escalate: [
      'Wandering, exit-seeking, unsafe driving, stove risk, aggression, or nighttime risk cannot be managed safely.',
      'Caregiver sleep or health is failing.',
      'The person cannot be left alone but no reliable supervision exists.',
      'Behavior changed suddenly or medical symptoms are present.',
    ],
    script: 'We are not saying home has failed. We are saying dementia safety has changed, and the plan needs more supervision before the next emergency.',
    related: [
      { label: 'Dementia Wandering and Safety Guide', href: '/care/guides/dementia-wandering-and-safety-guide/' },
      { label: 'Sundowning and Evening Confusion Guide', href: '/care/guides/sundowning-evening-confusion/' },
      { label: 'Memory Care Cost Guide', href: '/care/guides/memory-care-cost-guide/' },
    ],
  },
  {
    slug: 'choose-facility-this-week',
    id: 'art-care-playbook-choose-facility-week',
    title: 'We Need to Choose a Facility This Week',
    description: 'Use this facility decision playbook to compare care fit, tour findings, sample invoices, red flags, contracts, and family decision rules.',
    intro: 'Facility decisions are often rushed after a hospitalization or care crisis. This playbook keeps the family focused on care fit, cost clarity, red flags, and what must be written down before admission.',
    today: [
      'List must-cover care needs: transfers, toileting, medication, memory safety, wandering, meals, overnight support, and communication.',
      'Choose which setting you are actually comparing: assisted living, memory care, nursing home, or rehab.',
      'Ask each facility for a sample invoice, current fee schedule, discharge policy, and contract documents.',
      'Use the same scorecard for every tour.',
    ],
    week: [
      'Tour during a real routine if possible, such as meal time or late afternoon.',
      'Ask hard-day scenario questions, not only brochure questions.',
      'Review contract language before signing, especially responsible-party, discharge, rate increase, and arbitration terms.',
      'Choose a review date after move-in to check care plan accuracy and invoice surprises.',
    ],
    document: [
      'Tour date, contact person, base rate, care fees, medication fees, move-in fee, and sample invoice.',
      'Staff answers to care needs, emergency process, family communication, and discharge threshold.',
      'Red flags, verbal promises, and written follow-up.',
      'Contract questions for attorney or advisor.',
    ],
    call: [
      'Facility admissions and nurse or care director.',
      'Long-Term Care Ombudsman for rights and complaint-process context.',
      'Elder law attorney for contract questions.',
      'Clinician or discharge planner if this follows hospitalization.',
    ],
    calculator: { label: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/' },
    worksheet: { label: 'Senior Care Decision Worksheet', href: '/care/guides/senior-care-decision-worksheet/' },
    escalate: [
      'The facility cannot explain what care needs it cannot support.',
      'Pricing, medication fees, discharge rules, or sample invoice are unclear.',
      'The move is being pressured before the family understands safety and cost.',
      'The contract assigns family payment responsibility in a way no one understands.',
    ],
    script: 'We need to compare full monthly cost, care fit, discharge rules, and family communication. We cannot choose from the lobby tour alone.',
    related: [
      { label: 'Assisted Living Tour Scorecard', href: '/care/guides/assisted-living-tour-scorecard/' },
      { label: 'Nursing Home Visit Scorecard', href: '/care/guides/nursing-home-visit-scorecard/' },
      { label: 'Facility Contract Checklist', href: '/care/guides/care-facility-contract-checklist/' },
    ],
  },
  {
    slug: 'caregiver-burning-out-playbook',
    id: 'art-care-playbook-caregiver-burning-out',
    title: 'Caregiver Is Burning Out',
    description: 'Use this caregiver burnout playbook to stop unsafe overload, share tasks, add support, set boundaries, and reassess the care plan.',
    intro: 'Burnout is not only a feeling. It is a care-plan signal. If one person is exhausted, making mistakes, missing sleep, or unable to continue safely, the plan needs more support.',
    today: [
      'Name the unsafe part of the current plan: sleep, transfers, medication, supervision, money, work, or emotional overload.',
      'Ask for one concrete task to be taken off your plate this week.',
      'Protect one recovery block, even if it requires respite, family coverage, or paid help.',
      'If you feel unsafe or may harm yourself or someone else, seek emergency or crisis support immediately.',
    ],
    week: [
      'Track caregiving hours for seven days, including supervision and paperwork.',
      'Hold a family meeting focused on task ownership, not encouragement.',
      'Add respite, adult day care, home care, facility comparison, or a care manager if the workload is too large.',
      'Set a review trigger for when the current living situation must be reassessed.',
    ],
    document: [
      'Hours by task and time of day.',
      'Sleep disruption, missed work, health impact, mistakes, and unsafe caregiving moments.',
      'Tasks that can be delegated and tasks that require professional help.',
      'Support added and whether it actually reduced workload.',
    ],
    call: [
      'Trusted family member with a specific task ask.',
      'Respite provider, adult day care, home care agency, or Area Agency on Aging.',
      'Clinician or therapist if stress, depression, anxiety, sleep loss, or unsafe thoughts are present.',
      '988 in the U.S. for mental health crisis support.',
    ],
    calculator: { label: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/' },
    worksheet: { label: 'Caregiver Stress and Burnout Self-Check', href: '/care/guides/caregiver-stress-burnout-self-check/' },
    escalate: [
      'You feel unsafe, emotionally numb, out of control, or afraid you may harm yourself or someone else.',
      'You have not slept for multiple nights.',
      'Care mistakes are becoming dangerous.',
      'The family refuses help but the care plan depends on you alone.',
    ],
    script: 'This is not about me needing encouragement. The current care plan is affecting my health and safety, so we need to change the plan.',
    related: [
      { label: 'Caregiver Burnout Guide', href: '/care/guides/caregiver-burnout-guide/' },
      { label: 'Family Meeting Agenda Template', href: '/care/guides/family-care-meeting-agenda-template/' },
      { label: 'Mind Reset', href: '/tracks/mind-reset/' },
    ],
  },
  {
    slug: 'medicare-open-enrollment-review-playbook',
    id: 'art-care-playbook-medicare-open-enrollment',
    title: 'Medicare Open Enrollment Review',
    description: 'Use this Medicare open enrollment playbook to review doctors, drugs, pharmacies, total cost, prior authorization, plan red flags, and paperwork burden.',
    intro: 'Medicare plan review should start with must-haves, not ads. This playbook helps families verify doctors, drugs, pharmacies, total annual cost, bad-year risk, and caregiver manageability.',
    today: [
      'Make the must-have list: doctors, specialists, hospital, prescriptions, pharmacy, travel needs, and budget limit.',
      'Gather current plan cards, medication list, premium notices, and pharmacy information.',
      'List what changed this year: income, drugs, doctors, diagnoses, travel, pharmacy, or care location.',
      'Do not choose based on premium alone.',
    ],
    week: [
      'Compare plans by must-have fit first, then total cost.',
      'Check prescription coverage, pharmacy pricing, prior authorization, step therapy, and refill rules.',
      'Review out-of-pocket maximum, referrals, networks, and travel coverage.',
      'Call Medicare, SHIP, the plan, or a licensed professional for details before acting.',
    ],
    document: [
      'Plans compared and date checked.',
      'Doctor, hospital, drug, and pharmacy results.',
      'Estimated annual drug cost and bad-year cost.',
      'Prior authorization, referral, and caregiver paperwork concerns.',
      'Names, dates, confirmation numbers, and screenshots where appropriate.',
    ],
    call: [
      'Medicare or SHIP for unbiased counseling.',
      'Current and prospective plans for network and drug coverage confirmation.',
      'Doctor offices and pharmacies for participation and practical access questions.',
      'Licensed insurance professional if using one.',
    ],
    calculator: { label: 'Medicare Cost Planner', href: '/care/medicare-cost-planner/' },
    worksheet: { label: 'Medicare Plan Comparison Worksheet', href: '/care/guides/medicare-plan-comparison-worksheet/' },
    escalate: [
      'A must-have doctor, drug, hospital, or pharmacy is not covered.',
      'Bad-year cost is unaffordable.',
      'Plan rules are too complex for the user or caregiver to manage.',
      'Marketing claims conflict with written plan information.',
    ],
    script: 'Let us eliminate bad-fit plans before choosing the best plan. Doctors, drugs, pharmacy, total cost, and plan rules matter more than ads or premium alone.',
    related: [
      { label: 'How to Compare Medicare Plans', href: '/care/guides/how-to-compare-medicare-plans-without-getting-overwhelmed/' },
      { label: 'Part D Estimate', href: '/care/part-d-estimate/' },
      { label: 'Medicare Cost Calculator Limitations', href: '/care/guides/calculator-limitations/' },
    ],
  },
  {
    slug: 'long-term-care-insurance-claim-starter',
    id: 'art-care-playbook-ltc-insurance-claim-starter',
    title: 'Long-Term Care Insurance Claim Starter',
    description: 'Use this LTC insurance claim starter to review policy triggers, request a claim packet, track elimination period rules, and document care.',
    intro: 'A long-term care insurance policy is useful only if the family understands what triggers benefits, what documentation is required, and who pays during the waiting period.',
    today: [
      'Find the policy, declarations page, claim contact, and current premium status.',
      'Ask the insurer for the claim packet before hiring around the policy.',
      'Confirm benefit trigger, elimination period, covered care settings, provider requirements, and plan-of-care rules.',
      'Start documenting ADL help, cognitive impairment, care hours, invoices, and provider notes.',
    ],
    week: [
      'Compare monthly care cost with monthly policy benefit and family gap.',
      'Clarify whether the elimination period uses calendar days or service days.',
      'Ask whether home care, assisted living, memory care, nursing home, adult day care, respite, or family caregiving is covered.',
      'Set one person to own claim paperwork and a backup for missed deadlines.',
    ],
    document: [
      'Policy number, insurer, claim contact, and call reference numbers.',
      'Benefit trigger and who certifies eligibility.',
      'Elimination period rules and who pays during that period.',
      'Invoices, care notes, ADL records, cognitive documentation, and plan-of-care requirements.',
      'Denied or delayed items and appeal deadlines.',
    ],
    call: [
      'Long-term care insurer claim department.',
      'Care provider billing or records office.',
      'Clinician or care manager for plan-of-care and functional documentation.',
      'Licensed insurance professional or elder law attorney if claim issues arise.',
    ],
    calculator: { label: 'Long-Term Care Insurance Calculator', href: '/care/long-term-care-insurance-calculator/' },
    worksheet: { label: 'Long-Term Care Insurance Policy Review Worksheet', href: '/care/guides/long-term-care-insurance-policy-review-worksheet/' },
    escalate: [
      'The family is paying for care before understanding provider requirements.',
      'The elimination period is misunderstood.',
      'The insurer requests documentation the provider is not producing.',
      'A denial, delay, or coverage dispute affects care affordability.',
    ],
    script: 'We need the claim packet and written requirements before we build the care plan around this policy. What exactly must be documented for benefits to start?',
    related: [
      { label: 'Long-Term Care Insurance Guide', href: '/care/guides/long-term-care-insurance-guide/' },
      { label: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/' },
      { label: 'Calculator Limitations', href: '/care/guides/calculator-limitations/' },
    ],
  },
];

export const CARE_PLAYBOOK_NEW_GUIDES: ContentPageConfig[] = playbooks.map(makePlaybook);

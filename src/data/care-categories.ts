import {
  VERTICAL_CALCULATORS_BY_SLUG,
  verticalCalculatorHref,
  type VerticalCalculatorPage,
} from '~/data/vertical-calculators';

export interface CareCategoryCard {
  title: string;
  href: string;
  text: string;
  eyebrow?: string;
}

export interface CareCategorySection {
  title: string;
  body: string;
  bullets?: string[];
  cards?: CareCategoryCard[];
}

export interface CareCategoryPage {
  slug: string;
  label: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  primaryCta?: CareCategoryCard;
  secondaryCta?: CareCategoryCard;
  cards: CareCategoryCard[];
  sections: CareCategorySection[];
}

function careHref(slug: string): string {
  return `/care/${slug}/`;
}

function careTool(slug: string): VerticalCalculatorPage {
  const page = VERTICAL_CALCULATORS_BY_SLUG[`care/${slug}`];
  if (!page) throw new Error(`Missing care calculator page: ${slug}`);
  return page;
}

function toolCard(slug: string, text?: string, eyebrow = 'Calculator'): CareCategoryCard {
  const page = careTool(slug);
  return {
    title: page.h1,
    href: verticalCalculatorHref(page),
    text: text ?? page.summary,
    eyebrow,
  };
}

function linkCard(title: string, href: string, text: string, eyebrow = 'Guide'): CareCategoryCard {
  return { title, href, text, eyebrow };
}

export function careCategoryHref(slug: string): string {
  return careHref(slug);
}

export const CARE_CATEGORIES: CareCategoryPage[] = [
  {
    slug: 'lab',
    label: 'Care Lab',
    title: 'Care Lab: Care Calculators and Planning Tools | Kefiw',
    h1: 'Care Lab',
    description: 'Explore calculators and check-ins for senior care costs, caregiving hours, Medicare, insurance, sleep, stress, and care planning.',
    keywords: ['care lab', 'care calculators', 'senior care planning tools', 'caregiving calculators'],
    intro:
      'Care Lab brings Kefiw care tools into one place. Start with a cost estimate, check care needs, calculate caregiving hours, or choose a guided track when the family needs more structure.',
    primaryCta: linkCard('Start Here Intake', '/care/start/', 'Answer a few questions and get the recommended calculator, worksheet, playbook, or care track.', 'Start'),
    secondaryCta: linkCard('Family Care Plan Summary', '/care/family-care-plan-summary/', 'Build a printable family summary from care needs, costs, risks, owners, and next steps.', 'Summary'),
    cards: [
      linkCard('Start Here Intake', '/care/start/', 'Route falls, discharge, memory, cost, caregiver burnout, Medicare, and facility decisions to the right next step.', 'Start'),
      linkCard('Family Care Plan Summary', '/care/family-care-plan-summary/', 'Create a shareable and printable summary for family meetings, providers, tours, and advisors.', 'Summary'),
      linkCard('Care Calculators', careHref('senior-care'), 'Estimate care costs, family workload, Medicare, insurance, and care budgets.', 'Tools'),
      linkCard('Wellbeing Tools', careHref('wellbeing'), 'Use short reset tools for stress, sleep, emotional overload, and care urgency questions.', 'Tools'),
      linkCard('Care Tracks', '/tracks/#care-tracks', 'Follow guided paths for senior care, mind reset, and sleep reset.', 'Tracks'),
    ],
    sections: [
      {
        title: 'Start here',
        body: 'Pick the situation before the tool. A family comparing assisted living needs a different path than a caregiver who is sleep-deprived or a Medicare user comparing premium exposure.',
        cards: [
          linkCard('I do not know where to start', '/care/start/', 'Answer six questions and get a recommended path with a calculator, worksheet, playbook, and care track.', 'Start'),
          linkCard('I need to estimate care costs', careHref('senior-care'), 'Compare home care, assisted living, memory care, nursing home, and family budget pressure.', 'Start'),
          linkCard('I need to understand caregiving workload', careHref('caregiving'), 'Turn meals, bathing, medication reminders, transportation, supervision, and coordination into hours.', 'Start'),
          linkCard('I need help with Medicare or insurance costs', careHref('medicare'), 'Separate premiums, deductibles, IRMAA, drug costs, and plan gaps before making calls.', 'Start'),
        ],
      },
    ],
  },
  {
    slug: 'senior-care',
    label: 'Senior Care Costs',
    title: 'Senior Care Cost Calculators | Kefiw',
    h1: 'Senior Care Cost Calculators',
    description: 'Estimate the cost of assisted living, nursing home care, memory care, home care, and total senior care.',
    keywords: ['senior care cost calculator', 'assisted living cost calculator', 'nursing home cost calculator', 'memory care cost calculator', 'home care cost calculator'],
    intro:
      'Senior care decisions often come with emotional pressure and unclear pricing. These tools help families compare care settings, estimate monthly costs, and prepare for the tradeoffs of different care options.',
    primaryCta: toolCard('senior-care-cost-calculator', 'Estimate monthly and annual care costs across common care settings.', 'Start'),
    secondaryCta: linkCard('Plan Senior Care Track', '/tracks/plan-senior-care/', 'Move from care needs to costs, workload, Medicare, and a family plan.', 'Track'),
    cards: [
      toolCard('senior-care-cost-calculator', 'Estimate total monthly and annual senior care cost based on care setting, support needs, and family help.'),
      toolCard('assisted-living-cost-calculator', 'Estimate base rent, care levels, medication support, supplies, and likely add-on fees.'),
      toolCard('nursing-home-cost-calculator', 'Estimate nursing home cost and separate skilled-care assumptions from longer-term custodial planning.'),
      toolCard('memory-care-cost-calculator', 'Estimate memory care cost for dementia, supervision, and specialized support needs.'),
      toolCard('home-care-cost-calculator', 'Estimate in-home care cost based on hourly support, weekly schedule, supplies, and backup care.'),
      toolCard('family-care-budget-calculator', 'Combine paid care, family time, transportation, supplies, and insurance offsets.'),
    ],
    sections: [
      {
        title: 'What families usually miss',
        body: 'The base monthly price is rarely the whole care plan. Medication management, care levels, incontinence supplies, transportation, move-in fees, supervision, respite, and family time can change the real budget.',
        bullets: [
          'Ask each provider what is included in the base rate and what triggers a higher care level.',
          'Separate medical coverage questions from custodial care questions.',
          'Re-run the numbers after falls, hospitalizations, wandering, medication mistakes, or caregiver burnout.',
        ],
      },
    ],
  },
  {
    slug: 'caregiving',
    label: 'Caregiving',
    title: 'Caregiving Planning Tools | Kefiw',
    h1: 'Caregiving Planning Tools',
    description: 'Estimate caregiver hours, family care budgets, care needs, and ways to reduce avoidable care costs.',
    keywords: ['caregiver hours calculator', 'family care budget calculator', 'care needs checklist', 'reduce senior care cost'],
    intro:
      'Family caregiving includes unpaid time, emotional labor, transportation, medication reminders, home tasks, and financial coordination. These tools make the invisible workload visible.',
    primaryCta: toolCard('caregiver-hours-calculator', 'Estimate weekly caregiving time across daily care, supervision, transportation, and coordination.', 'Start'),
    secondaryCta: toolCard('care-cost-reduction-planner', 'Find cost pressure relief without ignoring safety, quality, or burnout.', 'Planner'),
    cards: [
      toolCard('caregiver-hours-calculator', 'Estimate weekly caregiving time across meals, bathing, transportation, errands, medication reminders, supervision, and household tasks.'),
      toolCard('family-care-budget-calculator', 'Build a shared family care budget with paid care, supplies, home changes, transportation, and unpaid time.'),
      toolCard('care-cost-reduction-planner', 'Identify ways to reduce care costs without ignoring safety, quality, or caregiver burnout.'),
      toolCard('care-needs-checklist', 'Review daily living needs, mobility, memory, medication, safety, nutrition, and social support.'),
      toolCard('foreign-caregiver-options', 'Understand household employment, eligibility, immigration, wage, and compliance questions before assuming foreign caregiver savings.'),
    ],
    sections: [
      {
        title: 'Care plans should include the caregiver',
        body: 'A plan that only prices the person receiving care is incomplete. It also needs respite, backup coverage, overnight safety, transportation, family availability, and the caregiver energy required to keep the plan working.',
        bullets: [
          'Do not count every available family hour as reliable care capacity.',
          'Use adult day care, respite, benefits screening, equipment, and schedule design before cutting safety coverage.',
          'Treat foreign-caregiver ideas as a compliance question first, not a shortcut.',
        ],
      },
    ],
  },
  {
    slug: 'medicare',
    label: 'Medicare',
    title: 'Medicare Cost Calculators | Kefiw',
    h1: 'Medicare Cost Calculators',
    description: 'Estimate Medicare premiums, IRMAA exposure, Part B costs, and Part D drug coverage considerations.',
    keywords: ['medicare cost calculator', 'medicare irmaa calculator', 'part b premium calculator', 'part d estimate'],
    intro:
      'Medicare decisions can affect monthly premiums, out-of-pocket costs, prescription drug expenses, and family planning. These tools help users estimate costs and understand what to ask before choosing coverage.',
    primaryCta: toolCard('medicare-cost-planner', 'Build a Medicare-related monthly budget from premiums, supplements, drugs, and uncovered costs.', 'Start'),
    secondaryCta: toolCard('medicare-irmaa-calculator', 'Estimate Part B and Part D income-related premium add-ons.', 'Planner'),
    cards: [
      toolCard('medicare-cost-planner', 'Estimate Medicare-related monthly costs, including premiums, deductibles, supplemental coverage, and expected out-of-pocket expenses.'),
      toolCard('medicare-irmaa-calculator', 'Estimate whether income-related monthly adjustment amounts may affect Part B or Part D costs.'),
      toolCard('part-b-premium-calculator', 'Estimate standard and income-adjusted Part B premium, deductible, and coinsurance exposure.'),
      toolCard('part-d-estimate', 'Estimate Part D premium, drug cost, deductible, and possible late enrollment penalty scenarios.'),
    ],
    sections: [
      {
        title: 'Separate coverage from care planning',
        body: 'Medicare can be central to health costs, but it does not make every senior care cost disappear. Families should separate medical coverage, prescription coverage, supplemental coverage, and long-term custodial care.',
        bullets: [
          'Part B and Part D income adjustments use income thresholds and a lookback year.',
          'Part D cost depends on the plan, drugs, pharmacy, coverage stage, and Extra Help status.',
          'Confirm details with Medicare, Social Security, plan documents, or a qualified advisor before acting.',
        ],
      },
    ],
  },
  {
    slug: 'insurance',
    label: 'Insurance',
    title: 'Insurance Planning Tools | Kefiw',
    h1: 'Insurance Planning Tools',
    description: 'Estimate health insurance costs, HSA/FSA planning opportunities, and long-term care insurance considerations.',
    keywords: ['health insurance cost calculator', 'hsa fsa calculator', 'long term care insurance calculator'],
    intro:
      'Insurance can reduce some costs, but it can also create confusion around premiums, deductibles, copays, coinsurance, covered services, and exclusions. These tools organize the financial side of care before decisions get expensive.',
    primaryCta: toolCard('health-insurance-cost-calculator', 'Estimate annual health insurance cost from premiums and realistic out-of-pocket exposure.', 'Start'),
    secondaryCta: toolCard('long-term-care-insurance-calculator', 'Estimate policy benefit gaps before relying on long-term care coverage.', 'Planner'),
    cards: [
      toolCard('hsa-fsa-calculator', 'Estimate how much to set aside for eligible expenses and compare HSA/FSA planning considerations.'),
      toolCard('health-insurance-cost-calculator', 'Estimate total health insurance cost, including premiums, deductible exposure, copays, coinsurance, and out-of-pocket maximum.'),
      toolCard('long-term-care-insurance-calculator', 'Estimate how long-term care insurance may offset care costs and where coverage gaps may remain.'),
    ],
    sections: [
      {
        title: 'Premium is not the whole insurance decision',
        body: 'The useful comparison is total exposure: premium, deductible, copays, coinsurance, out-of-pocket maximum, excluded services, network, drug coverage, and benefit limits.',
        bullets: [
          'Use HSA/FSA tools to plan eligible expenses, not to decide eligibility by themselves.',
          'Use long-term care insurance estimates to find gaps, elimination-period cash needs, and benefit exhaustion risk.',
          'Read actual plan and policy language before relying on a calculator result.',
        ],
      },
    ],
  },
  {
    slug: 'wellbeing',
    label: 'Wellbeing',
    title: 'Caregiver Wellbeing Tools | Kefiw',
    h1: 'Caregiver Wellbeing Tools',
    description: 'Short reset tools for stress, sleep, emotional overload, and care-related urgency questions.',
    keywords: ['caregiver wellbeing tools', 'mind reset tool', 'sleep reset tool', 'stress check in', 'care urgency check'],
    intro:
      'Caregiving can affect sleep, stress, focus, and emotional resilience. Kefiw wellbeing tools help users pause, reset, and decide what to do next without turning reflection into diagnosis.',
    primaryCta: linkCard('Mind Reset', '/tracks/mind-reset/', 'A short guided reset for racing thoughts, overwhelm, decision fatigue, or emotional overload.', 'Track'),
    secondaryCta: linkCard('Sleep Reset', '/tracks/sleep-reset/', 'Build a practical sleep recovery plan for disrupted nights and caregiving stress.', 'Track'),
    cards: [
      linkCard('Mind Reset', '/tracks/mind-reset/', 'A short guided reset for racing thoughts, overwhelm, decision fatigue, or emotional overload.', 'Track'),
      linkCard('Sleep Reset', '/tracks/sleep-reset/', 'A guided sleep recovery path for caregivers dealing with irregular nights, worry, or disrupted routines.', 'Track'),
      linkCard('Sleep Timing', '/health/rem-sync/', 'Find a better bedtime, wake time, or nap window based on schedule and sleep goal.', 'Tool'),
      linkCard('Stress Check-In', '/logic/decision-fatigue/', 'Quickly assess current stress load and choose a practical next step.', 'Tool'),
      linkCard('Care Urgency Check', '/health/medical-triage/', 'Educational guidance for thinking through routine, prompt, or emergency care questions.', 'Tool'),
    ],
    sections: [
      {
        title: 'Safety boundary',
        body: 'Wellbeing tools are for education, reflection, and habit planning. They do not diagnose conditions, treat symptoms, or replace professional care.',
        bullets: [
          'If someone may be having a medical emergency, call emergency services immediately.',
          'If someone may hurt themselves or someone else, or feels in immediate danger, call emergency services. In the U.S., call or text 988 for the Suicide & Crisis Lifeline.',
          'Use the tools to organize the next step, not to delay urgent care.',
        ],
      },
    ],
  },
  {
    slug: 'guides',
    label: 'Care Guides',
    title: 'Care Guides for Families and Caregivers | Kefiw',
    h1: 'Care Guides',
    description: 'Plain-English guides for senior care, caregiving, Medicare, insurance, health planning, and caregiver wellbeing.',
    keywords: ['care guides', 'senior care guides', 'caregiving guides', 'medicare guides', 'health disclaimer'],
    intro:
      'Care guides are organized around stressful family decisions: what to do next, what care may cost, what Medicare may not cover, what questions to ask, and what red flags to notice before a bad care decision gets expensive.',
    primaryCta: linkCard('Plan Senior Care for a Parent', '/care/guides/how-to-plan-senior-care-for-a-parent/', 'Start with the flagship guide for care needs, costs, family roles, and next steps.', 'Start'),
    secondaryCta: linkCard('All Guides', '/guides/', 'Browse the full guide library by decision category.', 'Guides'),
    cards: [
      linkCard('Care Playbooks', '/care/playbooks/', 'Short action plans for falls, discharge, cost pressure, sibling conflict, refusal of care, dementia safety, facilities, burnout, Medicare review, and LTC claims.', 'Playbook'),
      linkCard('Start Here Guided Intake', '/care/start/', 'Answer a few questions and get routed to the most useful calculator, worksheet, playbook, guide, or care track.', 'Start'),
      linkCard('Family Care Plan Summary', '/care/family-care-plan-summary/', 'Create a printable/shareable summary with risks, costs, caregiver hours, documents, task owners, and next steps.', 'Summary'),
      linkCard('Compare Care Settings', '/care/guides/home-care-vs-assisted-living-vs-memory-care-vs-nursing-home/', 'Choose between home care, assisted living, memory care, and nursing home care from needs first.', 'Guide'),
      linkCard('What Medicare Covers', '/care/guides/what-medicare-does-and-does-not-cover-for-senior-care/', 'Separate skilled care from long-term custodial care before the budget collapses.', 'Guide'),
      linkCard('Senior Care Cost Guide', '/care/guides/senior-care-cost-guide/', 'Understand base rates, add-on fees, move-in fees, private pay, insurance gaps, and family workload.', 'Guide'),
      linkCard('Caregiver Hours Guide', '/care/guides/caregiver-hours-guide/', 'Count direct care, supervision, transportation, coordination, and emotional labor honestly.', 'Guide'),
      linkCard('Assisted Living Questions', '/care/guides/questions-to-ask-assisted-living-community/', 'Bring a pricing, staffing, care-level, medication, discharge, and rate-increase checklist to tours.', 'Checklist'),
      linkCard('Nursing Home Questions', '/care/guides/questions-to-ask-a-nursing-home/', 'Ask about staffing, inspections, rehab, care plans, falls, pressure injuries, and discharge planning.', 'Checklist'),
      linkCard('Daily Care & Safety', '/care/guides/daily-care-routine-aging-parent/', 'Build daily routines for meals, medication, bathing, toileting, mobility, dementia behaviors, fall prevention, and caregiver notes.', 'Routine'),
      linkCard('Worksheets & Templates', '/care/guides/senior-care-decision-worksheet/', 'Use printable decision worksheets, scorecards, logs, comparison sheets, and family meeting templates.', 'Worksheet'),
      linkCard('Trust & Governance', '/care/guides/review-board/', 'Review Kefiw care standards for expert review, sourcing, safety, disclaimers, corrections, accessibility, privacy, and AI-assisted content.', 'Trust'),
      linkCard('Medicare Costs 2026', '/care/guides/medicare-costs-2026-guide/', 'Plan with current Part B, Part D, IRMAA, premium, deductible, and drug-cost assumptions.', 'Guide'),
      linkCard('Long-Term Care Insurance', '/care/guides/long-term-care-insurance-guide/', 'Review benefit triggers, elimination periods, inflation protection, exclusions, and claim gaps.', 'Guide'),
      linkCard('Caregiver Burnout', '/care/guides/caregiver-burnout-guide/', 'Treat burnout as a care-plan warning light, not a personal failure.', 'Guide'),
      linkCard('Checklists & Scripts', '/care/guides/how-to-talk-to-a-parent-about-needing-more-help/', 'Use dignity-preserving scripts for help, siblings, boundaries, memory changes, and assisted living.', 'Scripts'),
      linkCard('Local Resources & Rights', '/care/guides/find-local-senior-care-resources/', 'Find local agencies, ombudsman programs, resident rights, complaint paths, and emergency documents.', 'Resources'),
      linkCard('Legal & Planning Documents', '/care/guides/legal-documents-family-caregivers/', 'Understand advance directives, health care proxy, financial POA, HIPAA access, payee rules, guardianship, and document storage.', 'Legal'),
      linkCard('Family Decision Support', '/care/guides/managing-someone-elses-money/', 'Document money handling, personal care agreements, caregiver reimbursements, and shared family records before conflict starts.', 'Records'),
      linkCard('Health Disclaimer', '/health-disclaimer/', 'Clear medical, financial, legal, insurance, and planning limits for Care content.', 'Trust'),
    ],
    sections: [
      {
        title: 'How to use Care guides',
        body: 'Use guides to ask better questions after running a calculator. The guide should explain what the number means, what assumptions are fragile, and what a family should verify before acting.',
        bullets: [
          'Cost estimates are not provider quotes.',
          'Medicare and insurance information can change and should be confirmed with official sources or plan documents.',
          'Health and wellbeing tools should never delay urgent medical care.',
        ],
      },
    ],
  },
];

export const CARE_CATEGORIES_BY_SLUG = CARE_CATEGORIES.reduce<Record<string, CareCategoryPage>>((acc, category) => {
  acc[category.slug] = category;
  return acc;
}, {});

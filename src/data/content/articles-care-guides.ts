import type { ContentPageConfig } from '../content-pages';

interface CareSource {
  label: string;
  href: string;
}

interface CareGuideSpec {
  id: string;
  slug: string;
  category: string;
  title: string;
  h1: string;
  subhead: string;
  description: string;
  keywords: string[];
  intro: string;
  outcomeLine: string;
  decisionMoment: string;
  familiesMiss: string[];
  questions: string[];
  redFlags: string[];
  costFactors: string[];
  script: string;
  checklist: string[];
  primaryCta: { href: string; label: string };
  relatedLinks: Array<{ href: string; label: string }>;
  sources: CareSource[];
  faq: Array<{ q: string; a: string; faq_intent?: string }>;
  relatedIds?: string[];
}

interface DeepGuideLayer {
  whoFor: string;
  stepByStep: string[];
  kefiwTips: string[];
  smallTests?: string[];
  calculatorConnections: string[];
  professionalReview: string;
  reviewerNotes: string[];
}

const SOURCE_MEDICARE_LTC: CareSource = {
  label: 'Medicare long-term care coverage',
  href: 'https://www.medicare.gov/coverage/long-term-care',
};

const SOURCE_MEDICARE_NOT_COVERED: CareSource = {
  label: 'Medicare services not covered by Original Medicare',
  href: 'https://www.medicare.gov/providers-services/original-medicare/not-covered',
};

const SOURCE_MEDICARE_SNF: CareSource = {
  label: 'Medicare skilled nursing facility care',
  href: 'https://www.medicare.gov/what-medicare-covers/what-part-a-covers/medicare-part-a-coverage-skilled-nursing-facility-care',
};

const SOURCE_MEDICARE_COSTS: CareSource = {
  label: 'Medicare 2026 costs',
  href: 'https://www.medicare.gov/basics/costs/medicare-costs',
};

const SOURCE_CMS_PART_B_2026: CareSource = {
  label: 'CMS 2026 Medicare Parts A and B premiums and deductibles',
  href: 'https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles',
};

const SOURCE_PART_D_COSTS_2026: CareSource = {
  label: 'Medicare 2026 Part D drug coverage costs',
  href: 'https://www.medicare.gov/drug-coverage-part-d/costs-for-medicare-drug-coverage',
};

const SOURCE_NURSING_HOME_GUIDE: CareSource = {
  label: 'Medicare guide to choosing a nursing home',
  href: 'https://www.medicare.gov/publications/02174-your-guide-to-choosing-a-nursing-home',
};

const SOURCE_CARE_COMPARE: CareSource = {
  label: 'Medicare Care Compare',
  href: 'https://www.medicare.gov/care-compare/',
};

const SOURCE_ACL_CAREGIVERS: CareSource = {
  label: 'ACL Power of Caregivers fact sheet',
  href: 'https://acl.gov/sites/default/files/2025-11/power-of-caregivers-fact-sheet-acl.pdf',
};

const SOURCE_ELDERCARE: CareSource = {
  label: 'ACL Eldercare Locator',
  href: 'https://eldercare.acl.gov/',
};

const SOURCE_OMBUDSMAN: CareSource = {
  label: 'ACL Long-Term Care Ombudsman Program',
  href: 'https://acl.gov/programs/Protecting-Rights-and-Preventing-Abuse/Long-term-Care-Ombudsman-Program',
};

const SOURCE_MEDICAID_LTSS: CareSource = {
  label: 'Medicaid long-term services and supports',
  href: 'https://www.medicaid.gov/medicaid/long-term-services-supports',
};

const SOURCE_MEDICAID_HCBS: CareSource = {
  label: 'Medicaid home and community-based services',
  href: 'https://www.medicaid.gov/medicaid/home-community-based-services',
};

const SOURCE_IRS_HSA_2026: CareSource = {
  label: 'IRS 2026 HSA limits',
  href: 'https://www.irs.gov/pub/irs-drop/rp-25-19.pdf',
};

const SOURCE_IRS_FSA_2026: CareSource = {
  label: 'IRS 2026 health FSA limit',
  href: 'https://www.irs.gov/pub/irs-drop/rp-25-32.pdf',
};

const SOURCE_MEDIGAP_COVERAGE: CareSource = {
  label: 'Medicare Medigap coverage',
  href: 'https://www.medicare.gov/health-drug-plans/medigap/basics/coverage',
};

const SOURCE_ALZ_HOME_SAFETY: CareSource = {
  label: 'Alzheimer Association home safety',
  href: 'https://www.alz.org/help-support/caregiving/safety/home-safety',
};

function list(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function sourceList(sources: CareSource[]): string {
  return sources.map((source) => `- [${source.label}](${source.href})`).join('\n');
}

function optionalListSection(title: string, items?: string[]): string {
  if (!items?.length) return '';
  return `
## ${title}

${list(items)}
`;
}

const CARE_DEEP_DIVES: Record<string, DeepGuideLayer> = {
  'how-to-plan-senior-care-for-a-parent': {
    whoFor:
      'Families who are worried about a parent, spouse, or older loved one and need to move from vague concern to a practical care plan without rushing straight to a facility decision.',
    stepByStep: [
      'Start with what changed. Write down falls, missed medication, unsafe driving, spoiled food, unpaid bills, hygiene changes, isolation, wandering, or caregiver strain.',
      'Separate immediate safety from planning. If someone is unsafe tonight, solve tonight first. Then build the longer plan.',
      'Map care needs before naming a care setting. List bathing, dressing, meals, medication, mobility, memory, transportation, supervision, finances, and emergency response.',
      'Count family capacity honestly. Good intentions are not the same as reliable morning, evening, overnight, transport, and backup coverage.',
      'Price more than one scenario. Compare home care, adult day care, assisted living, memory care, and nursing home exposure using the same care needs.',
      'Name the failure point. Decide what would force a plan review: two falls, wandering, missed medication, caregiver illness, or a hospital discharge.',
      'Turn the plan into assignments. Every critical task needs an owner and a backup.',
    ],
    kefiwTips: [
      'Use a 7-day care log before a family meeting. Families argue less when the workload is visible.',
      'Do not ask "facility or home" first. Ask "what care needs to be present for the next seven days to be safe?"',
      'Create a "care escalation rule" in writing, such as: if Dad falls twice in 30 days, we re-run the care plan.',
      'When a parent resists help, frame support as protecting independence, not replacing it.',
    ],
    smallTests: [
      'Try a two-week home care trial for the riskiest time of day.',
      'Have the parent tour one community only as a comparison, not as a commitment.',
      'Ask each sibling to own one recurring task for 30 days, then review whether the plan is real.',
    ],
    calculatorConnections: [
      'Run Care Needs Checklist first to identify the care tasks.',
      'Run Caregiver Hours to expose unpaid family workload.',
      'Run Senior Care Cost to compare home care, assisted living, memory care, and nursing home scenarios.',
      'Use the Plan Senior Care Track when the family needs an ordered path instead of separate articles.',
    ],
    professionalReview:
      'Talk to a clinician for sudden functional, medication, mobility, or memory changes; an elder law attorney for Medicaid, legal documents, or facility-contract questions; and a qualified insurance or benefits professional before relying on coverage assumptions.',
    reviewerNotes: [
      'Reviewed as educational care-planning content with safety boundary language.',
      'This guide should not diagnose cognitive decline, determine legal capacity, or give Medicaid or insurance advice.',
    ],
  },
  'home-care-vs-assisted-living-vs-memory-care-vs-nursing-home': {
    whoFor:
      'Families comparing care settings and trying to understand whether home care, assisted living, memory care, or nursing home care is the safest and most sustainable next step.',
    stepByStep: [
      'List the hardest care day, not the average day. Include nights, bathrooms, medication, confusion, falls, and transportation.',
      'Test home care first on hours and backup. Home care works well for limited or scheduled support, but it can become fragile when supervision is constant.',
      'Test assisted living on care levels. Ask whether the community can handle two-person transfers, frequent nighttime help, advanced dementia behaviors, wandering, or complex medication needs.',
      'Test memory care on supervision and behavior response. The question is not whether doors lock; it is how staff redirect, engage, and protect residents.',
      'Test nursing home care on medical and physical support needs. Ask whether the issue is skilled rehab, long-term custodial care, or both.',
      'Compare family burden beside monthly cost. A cheaper plan that consumes one caregiver may not be cheaper in practice.',
    ],
    kefiwTips: [
      'Use a two-column comparison: monthly cash cost and family burden. The best plan is safe enough, sustainable enough, and financially realistic.',
      'If home care reaches daily split shifts or overnight supervision, compare it against assisted living or memory care without guilt.',
      'Ask every provider what they cannot support. The answer tells you more than a list of amenities.',
      'Price the next stage, not just today. Care rarely gets cheaper after falls, memory changes, or hospital discharge.',
    ],
    smallTests: [
      'Call a community during business hours and again in the evening to compare responsiveness.',
      'Tour during a meal to see staffing rhythm, resident engagement, and whether people seem rushed.',
      'Ask a home care agency what happens if the caregiver calls out at 6 a.m.',
    ],
    calculatorConnections: [
      'Use Senior Care Cost for side-by-side setting estimates.',
      'Use Home Care Cost before assuming staying home is cheaper.',
      'Use Assisted Living Cost and Memory Care Cost when facility base rates hide care-level add-ons.',
      'Use Caregiver Hours to price the family burden column.',
    ],
    professionalReview:
      'Talk to a clinician or care manager when safety, dementia behaviors, mobility, or medication support are changing. Talk to an elder law or benefits professional before choosing a setting based on Medicaid or contract assumptions.',
    reviewerNotes: [
      'Reviewed for care-setting decision support and non-diagnostic language.',
      'Care setting fit depends on local provider quality, staffing, payer source, and the person current needs.',
    ],
  },
  'what-medicare-does-and-does-not-cover-for-senior-care': {
    whoFor:
      'Families who are planning senior care and need to separate Medicare health coverage from long-term custodial care costs.',
    stepByStep: [
      'Name the service. Is it hospital care, doctor care, prescription drugs, skilled nursing, home health, custodial help, assisted living, memory care, or room and board?',
      'Ask which Medicare part or plan is expected to pay. Do not accept "Medicare covers it" without the benefit, condition, and expected duration.',
      'Separate skilled care from custodial care. Skilled care may be covered in specific situations; long-term help with daily living is usually a separate payment problem.',
      'Ask what happens when coverage ends. Families need the private-pay or Medicaid plan before the end date surprises them.',
      'Price the uncovered version. If Medicare does not pay, what is the monthly cost and who pays it?',
    ],
    kefiwTips: [
      'The most useful question is: "Covered for what service, under which condition, and for how long?"',
      'If the need is mostly bathing, dressing, meals, supervision, transportation, or memory support, build a non-Medicare payment plan.',
      'For hospital-to-rehab transitions, ask for the private-pay daily rate before admission.',
      'Do not let a Medicare conversation delay Medicaid, long-term care insurance, VA, or family-budget planning when long-term care is likely.',
    ],
    smallTests: [
      'Ask the provider to write the expected payer source and coverage end trigger.',
      'Call the plan or Medicare resource with the exact service name and setting.',
      'Run the Senior Care Cost Calculator once with no Medicare offset so the family sees the backup number.',
    ],
    calculatorConnections: [
      'Use Medicare Cost Planner for premiums, deductibles, drug coverage, and supplemental coverage questions.',
      'Use Senior Care Cost for long-term care scenarios that Medicare may not cover.',
      'Use Long-Term Care Insurance Calculator if a policy may offset uncovered care.',
      'Use Plan Senior Care Track when coverage and setting decisions are tangled.',
    ],
    professionalReview:
      'Confirm coverage with Medicare, the plan, the provider billing office, or a qualified benefits advisor. Use an elder law attorney for Medicaid eligibility, spend-down, estate recovery, or facility-payment questions.',
    reviewerNotes: [
      'Reviewed for Medicare coverage boundaries and educational language.',
      'Medicare rules, plan rules, and annual cost amounts can change; verify current year sources before acting.',
    ],
  },
  'senior-care-cost-guide': {
    whoFor:
      'Families trying to understand what senior care actually costs after base rates, add-ons, supplies, transportation, family labor, and coverage gaps are included.',
    stepByStep: [
      'Build a monthly care budget, not just a provider quote.',
      'Put base costs and add-ons on separate lines: rent, care level, medication management, supplies, transportation, meals, laundry, and move-in fees.',
      'Add family workload. Transportation, coordination, supervision, and missed work are part of the real cost.',
      'Add coverage assumptions only after verifying them. Medicare, Medicaid, long-term care insurance, VA benefits, and private insurance have different rules.',
      'Run conservative, expected, and crisis scenarios. A safe plan should survive a fall, a hospitalization, or caregiver illness.',
    ],
    kefiwTips: [
      'Ask facilities for a sample monthly invoice, not just a brochure rate.',
      'Ask home care agencies for the weekly bill using the schedule you actually need, including minimum shifts and weekends.',
      'Price one level of decline. If the current plan only works while everything stays perfect, it is fragile.',
      'Keep a "costs we forgot" line for supplies, parking, pharmacy delivery, clothing, repairs, and travel.',
    ],
    smallTests: [
      'Compare three quotes using the same care needs list.',
      'Ask each provider: "What are the three most common reasons this monthly bill increases?"',
      'Run the same calculator twice: one with family help included and one replacing that help with paid care.',
    ],
    calculatorConnections: [
      'Use Senior Care Cost for the full scenario.',
      'Use Assisted Living, Memory Care, Nursing Home, and Home Care calculators for setting-specific assumptions.',
      'Use Family Care Budget when siblings or multiple payer sources are involved.',
      'Use Caregiver Hours to make unpaid support visible.',
    ],
    professionalReview:
      'Talk to a benefits professional, elder law attorney, insurance professional, or facility billing office when the plan depends on Medicaid, insurance, VA benefits, facility contracts, or public benefits.',
    reviewerNotes: [
      'Reviewed for cost-planning structure and coverage caveats.',
      'Cost estimates are planning estimates, not provider quotes or benefit determinations.',
    ],
  },
  'caregiver-hours-guide': {
    whoFor:
      'Family caregivers and siblings who need to understand how much unpaid care is really happening each week.',
    stepByStep: [
      'Track one normal week and one hard week if possible.',
      'Count direct care: bathing, dressing, toileting, meals, transfers, and medication reminders.',
      'Count indirect care: calls, scheduling, bills, pharmacy, insurance, cleaning, supplies, and family updates.',
      'Count supervision and on-call time separately. Supervision can be the main workload even when tasks look small.',
      'Mark tasks by owner and backup. A task with no backup is a risk.',
      'Convert hours into replacement cost so the family can compare unpaid care to paid support.',
    ],
    kefiwTips: [
      'Do not ask siblings whether the workload is "a lot." Show the hour map.',
      'Track waiting-room time and driving time. It often explains why the week feels gone.',
      'Use categories: hands-on, transport, coordination, supervision, household, emotional support, and emergency time.',
      'If nighttime worry prevents sleep, count that as care burden even if no task was completed.',
    ],
    smallTests: [
      'Track care in 15-minute blocks for seven days.',
      'Have each family member own one recurring task for two weeks and see what remains uncovered.',
      'Replace one high-stress task with paid help for a trial week.',
    ],
    calculatorConnections: [
      'Use Caregiver Hours to calculate weekly and monthly workload.',
      'Use Family Care Budget to compare unpaid time against paid care.',
      'Use Care Cost Reduction Planner to find lower-risk ways to reduce hours.',
      'Use Mind Reset or Sleep Reset when stress is blocking the next decision.',
    ],
    professionalReview:
      'Talk to a clinician or care manager when the hour count reveals unsafe supervision, repeated falls, medication errors, wandering, or caregiver exhaustion.',
    reviewerNotes: [
      'Reviewed for caregiver workload framing and burnout safety language.',
      'This guide counts workload; it does not diagnose caregiver burnout or determine care eligibility.',
    ],
  },
  'family-care-budget-guide': {
    whoFor:
      'Families who need to decide how care costs, unpaid labor, reimbursements, and responsibilities will be shared.',
    stepByStep: [
      'Separate money, time, decisions, and emotional support before discussing fairness.',
      'List fixed monthly care costs, variable costs, and surprise costs.',
      'List unpaid labor by person and task.',
      'Decide what gets reimbursed and what needs receipts.',
      'Create a 90-day budget, then a decline scenario.',
      'Assign one person to maintain the budget and one backup to review it.',
    ],
    kefiwTips: [
      'Families fight when money, time, and authority are mixed together. Put them in separate columns.',
      'Do not ask "can everyone help more?" Ask "who owns transportation every Tuesday?"',
      'Use receipts and a shared folder before suspicion starts.',
      'If one sibling has less money but more time, document that contribution too.',
    ],
    smallTests: [
      'Run one month as a transparent shared budget before changing long-term arrangements.',
      'Assign each sibling one recurring cost or task, then review whether it happened.',
      'Add a respite line item and see if it prevents a larger care failure.',
    ],
    calculatorConnections: [
      'Use Family Care Budget for shared cost planning.',
      'Use Caregiver Hours to value unpaid time.',
      'Use Senior Care Cost to compare care-setting scenarios.',
      'Use Plan Senior Care Track to turn the budget into next steps.',
    ],
    professionalReview:
      'Talk to an elder law attorney or tax professional before large transfers, shared ownership decisions, Medicaid planning, or reimbursement arrangements that affect benefits or taxes.',
    reviewerNotes: [
      'Reviewed for family-budget planning and professional-boundary language.',
      'This guide does not provide legal, tax, Medicaid, or financial advice.',
    ],
  },
  'how-to-choose-an-assisted-living-community': {
    whoFor:
      'Families comparing assisted living communities for someone who needs daily support but may not need nursing home-level care.',
    stepByStep: [
      'Clarify care needs before touring. Bring ADLs, medication, mobility, memory, nighttime help, and fall history.',
      'Compare care fit before amenities. A beautiful lobby does not prove the community can handle the hard parts.',
      'Ask how care levels are assessed, priced, reassessed, and disputed.',
      'Tour at a revealing time, such as meals, late afternoon, or shift change.',
      'Ask about medication support, falls, nighttime staffing, family communication, and discharge rules.',
      'Review the contract before deposit. Watch for fees, refund rules, rate increases, and discharge language.',
    ],
    kefiwTips: [
      'Ask for a sample invoice from a resident with similar care needs.',
      'Ask "what needs can you not support?" A confident, specific answer is a good sign.',
      'Call once after business hours to see how the community responds when sales staff are not driving the conversation.',
      'Ask what happened the last time a resident needed more care after move-in.',
    ],
    smallTests: [
      'Tour during a meal and watch staff pace, resident engagement, cleanliness, and whether people are rushed.',
      'Send a follow-up question by email and notice how clear and fast the answer is.',
      'Ask for the last two annual rate increase ranges.',
    ],
    calculatorConnections: [
      'Use Assisted Living Cost to model base rent plus care levels and medication fees.',
      'Use Care Needs Checklist before touring.',
      'Use Senior Care Cost to compare assisted living against home care or memory care.',
      'Use Plan Senior Care Track if family roles and budget are unresolved.',
    ],
    professionalReview:
      'Use a senior care advisor, geriatric care manager, or clinician for care-fit questions. Use an elder law attorney for contract, Medicaid, arbitration, or discharge-rule concerns.',
    reviewerNotes: [
      'Reviewed for practical tour questions, care-fit framing, and non-clinical boundaries.',
      'Facility quality and licensing rules vary by state and provider.',
    ],
  },
  'how-to-choose-a-nursing-home': {
    whoFor:
      'Families comparing nursing homes for short-term rehab, skilled nursing, or longer-term care after hospitalization or decline.',
    stepByStep: [
      'Clarify the purpose: short-term skilled rehab, long-term custodial care, or both.',
      'Check Care Compare, but do not stop at the star rating.',
      'Ask about staffing by shift, weekend coverage, care-plan meetings, falls, pressure injuries, infection control, and family communication.',
      'Ask how therapy goals are set and what happens if progress slows.',
      'Ask the private-pay daily rate before skilled coverage ends.',
      'Tour or call with the person actual risks: mobility, wounds, medications, behavior, feeding, or supervision.',
    ],
    kefiwTips: [
      'Ask how family concerns are documented and escalated. A facility that cannot explain this may be hard to work with later.',
      'Observe call lights, meal help, resident positioning, odors, and whether staff make eye contact with residents.',
      'Ask about the last common reason residents transfer back to the hospital.',
      'If placement is rushed, write down what still needs verification after admission.',
    ],
    smallTests: [
      'Call the nursing station or admissions contact with one specific care-plan question and notice answer quality.',
      'Ask to see a sample care-plan meeting agenda.',
      'Compare weekday and weekend staffing answers.',
    ],
    calculatorConnections: [
      'Use Nursing Home Cost to estimate skilled and longer-term cost exposure.',
      'Use Medicare Cost Planner for premium and coverage context.',
      'Use Senior Care Transition Guide after hospitalization.',
      'Use Family Care Budget if private pay or family contributions are likely.',
    ],
    professionalReview:
      'Confirm coverage with Medicare, the plan, or the facility billing office. Talk to a clinician about skilled needs and an elder law attorney for Medicaid or admission agreement concerns.',
    reviewerNotes: [
      'Reviewed for nursing home selection support and Medicare/custodial-care boundaries.',
      'Star ratings are useful signals, not a substitute for matching facility capability to the person needs.',
    ],
  },
  'memory-care-guide-for-families': {
    whoFor:
      'Families caring for someone with dementia, Alzheimer disease, wandering risk, confusion, unsafe routines, or caregiver overload.',
    stepByStep: [
      'Start with safety patterns: wandering, stove use, medication, falls, aggression, nighttime wakefulness, and getting lost.',
      'Ask what level of supervision is needed across the full day and night.',
      'Compare home safety, adult day care, home care, assisted living, and memory care against the hardest symptoms.',
      'Evaluate memory care on staff training, engagement, redirection, exit safety, medication support, and behavior response.',
      'Ask what behaviors lead to extra fees, hospital transfer, or discharge.',
      'Build a caregiver support plan even after placement, because transition can be emotionally heavy.',
    ],
    kefiwTips: [
      'A locked door is not a dementia care plan. Ask how staff redirect fear, exit-seeking, refusal, or agitation.',
      'Tour during late afternoon if possible, when symptoms may be more visible.',
      'Ask what activities are offered for residents who cannot follow group instructions.',
      'Ask the community to describe a recent hard behavior day and how staff handled it.',
    ],
    smallTests: [
      'Bring three real examples of hard days and ask how the provider would respond.',
      'Walk the unit and look for safe wandering paths, outdoor access, and staff engagement.',
      'Ask how the family is notified after falls, medication changes, or behavior changes.',
    ],
    calculatorConnections: [
      'Use Memory Care Cost to include supervision, medication, supplies, and add-ons.',
      'Use Care Needs Checklist to document memory and safety changes.',
      'Use Caregiver Hours to measure supervision burden.',
      'Use Mind Reset or Sleep Reset if caregiver stress is driving the decision.',
    ],
    professionalReview:
      'Talk to a clinician for sudden memory or behavior changes, medication concerns, wandering danger, falls, or safety risks. Use care professionals for setting fit and elder law support for contracts or benefits.',
    reviewerNotes: [
      'Reviewed for dementia-safety framing and non-diagnostic language.',
      'This guide helps families organize observations and questions; it does not diagnose dementia or prescribe care.',
    ],
  },
  'medicare-costs-2026-guide': {
    whoFor:
      'Medicare users, adult children, and caregivers planning 2026 premiums, deductibles, drug costs, IRMAA, and senior-care coverage assumptions.',
    stepByStep: [
      'Start with the fixed known costs for the year, including standard Part B premium and deductible.',
      'Add plan-specific costs: Medicare Advantage, Medigap, Part D, pharmacy, drug tier, and expected care use.',
      'Check IRMAA if income is near a threshold or changed after retirement, asset sales, Roth conversions, or business income.',
      'Run a normal-use year and a high-use year.',
      'Separate Medicare medical costs from long-term custodial care costs.',
      'Set an annual review reminder because plan rules and costs can change.',
    ],
    kefiwTips: [
      'Compare annual risk, not just monthly premium.',
      'For Part D, use exact drug name, dose, quantity, and pharmacy. Similar-looking drug plans can price the same medication differently.',
      'For Medicare Advantage, check doctors, hospitals, prior authorization, travel, and out-of-pocket maximum before extras.',
      'For IRMAA, look at income timing and life-changing event appeal concepts before assuming the bill is permanent.',
    ],
    smallTests: [
      'Run Medicare Cost Planner with normal use and high use.',
      'Run Part D Estimate with current pharmacy and one alternative pharmacy.',
      'Run IRMAA before large taxable events if income timing is flexible.',
    ],
    calculatorConnections: [
      'Use Medicare Cost Planner for total monthly and annual planning.',
      'Use Part B Premium Calculator for standard and income-adjusted premium exposure.',
      'Use Medicare IRMAA Calculator when income may trigger adjustments.',
      'Use Part D Estimate for drug-plan cost exposure.',
    ],
    professionalReview:
      'Confirm plan details with Medicare, Social Security, plan documents, a qualified Medicare advisor, or the insurer. Use a tax professional for income timing questions.',
    reviewerNotes: [
      'Reviewed with annual-source framing and 2026 Medicare cost caveats.',
      'Medicare costs and plan details can change annually and vary by plan, income, pharmacy, location, and coverage path.',
    ],
  },
  'long-term-care-insurance-guide': {
    whoFor:
      'Families reviewing an existing long-term care insurance policy or deciding whether a policy meaningfully offsets future care costs.',
    stepByStep: [
      'Find the actual policy, not only a summary sheet.',
      'Identify benefit triggers. Ask what must happen before the policy pays.',
      'Check eligible care settings: home care, assisted living, memory care, nursing home, adult day care, or respite.',
      'Calculate the elimination-period cash gap.',
      'Compare daily or monthly benefit to local care cost.',
      'Check benefit duration, inflation protection, exclusions, premium increases, and claim documentation.',
      'Run a covered-cost and uncovered-gap scenario.',
    ],
    kefiwTips: [
      'Ask for the claims packet before care starts if possible. It shows what documentation the insurer will actually require.',
      'A policy with a strong benefit can still leave a large gap if local care costs are higher.',
      'Do not count the benefit during the elimination period unless the policy says how that period is satisfied.',
      'Ask whether benefits reimburse expenses or pay cash. That changes paperwork and cash-flow planning.',
    ],
    smallTests: [
      'Call the insurer with one example care setting and ask whether it would qualify.',
      'Compare the policy benefit against three local care quotes.',
      'Run the calculator once with premium increases and once without to see affordability risk.',
    ],
    calculatorConnections: [
      'Use Long-Term Care Insurance Calculator to estimate covered and uncovered amounts.',
      'Use Senior Care Cost to estimate local care costs before applying policy benefits.',
      'Use Family Care Budget for elimination-period and family contribution planning.',
      'Use How Families Pay for Long-Term Care when insurance is only one layer.',
    ],
    professionalReview:
      'Talk to the insurer, a licensed insurance professional, or a financial advisor before buying, canceling, reducing, or relying on a policy. Use legal advice for Medicaid and asset-planning interactions.',
    reviewerNotes: [
      'Reviewed for insurance-planning language and benefit-limit caveats.',
      'This guide does not determine coverage, claim eligibility, or whether a policy is suitable for a specific person.',
    ],
  },
  'caregiver-burnout-guide': {
    whoFor:
      'Family caregivers who are exhausted, resentful, isolated, sleep-deprived, missing work, or worried they cannot keep providing care safely.',
    stepByStep: [
      'Treat burnout as a care-plan signal, not a personal failure.',
      'Check immediate safety first: self-harm thoughts, harm to others, medical danger, unsafe supervision, or inability to provide basic care.',
      'List the tasks that have no backup.',
      'Separate what can be delegated, paid for, delayed, simplified, or stopped.',
      'Schedule respite as a calendar item, not a vague promise.',
      'Hold a family meeting with hours, tasks, and costs visible.',
      'Use professional support when stress, sleep loss, depression, anxiety, or safety concerns are escalating.',
    ],
    kefiwTips: [
      'The sentence "I am fine" is not data. Sleep, missed work, health symptoms, resentment, and isolation are data.',
      'Ask for one recurring task, not general help.',
      'If the caregiver is on call every night, the family does not have a sleep plan.',
      'A reset tool can calm the moment, but burnout usually requires changing the workload.',
    ],
    smallTests: [
      'Remove one task for one week and see whether the caregiver stabilizes.',
      'Schedule one respite block before the next family meeting.',
      'Have a non-primary caregiver handle all calls for one day to expose hidden workload.',
    ],
    calculatorConnections: [
      'Use Caregiver Hours to show the actual workload.',
      'Use Family Care Budget to decide what support can be paid for.',
      'Use Care Cost Reduction Planner to lower cost without cutting safety.',
      'Use Mind Reset and Sleep Reset for immediate stabilization.',
    ],
    professionalReview:
      'Use emergency services or crisis support immediately if anyone may be in danger. Talk to a clinician or mental health professional for severe stress, depression, panic, sleep loss, substance use, or thoughts of harm.',
    reviewerNotes: [
      'Reviewed with caregiver safety, crisis, and non-diagnostic boundaries.',
      'This guide supports planning and reflection; it does not diagnose burnout, depression, anxiety, or any medical condition.',
    ],
  },
};

function longform(spec: CareGuideSpec): string {
  const deep = CARE_DEEP_DIVES[spec.slug];
  return `## Plain-English Summary

${spec.outcomeLine}

${deep ? `## Who This Guide Is For

${deep.whoFor}

` : ''}## When This Matters

${spec.decisionMoment}

## What Families Often Miss

${list(spec.familiesMiss)}

${optionalListSection('Step-By-Step Advice', deep?.stepByStep)}
${optionalListSection('Original Kefiw Tips', deep?.kefiwTips)}
${optionalListSection('Small Tests Before Making A Decision', deep?.smallTests)}
## Questions To Ask

${list(spec.questions)}

## Red Flags

${list(spec.redFlags)}

## Cost Or Coverage Traps

${list(spec.costFactors)}

## Family Conversation Script

${spec.script}

## Checklist

${list(spec.checklist)}

## What To Do Next

Run the linked Kefiw calculator first, then use this guide as the family discussion checklist. If the result depends on Medicare, Medicaid, insurance, facility contracts, legal documents, medication safety, or urgent symptoms, verify with the right professional before acting.

${optionalListSection('Related Calculator And Track Connections', deep?.calculatorConnections)}
## When To Talk To A Professional

${deep?.professionalReview ?? 'Talk to the appropriate professional when the decision depends on medical symptoms, safety, facility contracts, Medicaid, Medicare, insurance benefits, taxes, legal documents, or a large financial commitment.'}

## Reviewer Notes

${deep ? list(deep.reviewerNotes) : '- Reviewed as educational planning content with care, safety, and professional-boundary language.\n- This guide helps organize questions and next steps; it does not replace qualified professional advice.'}

## Review And Source Notes

Last source check: April 29, 2026.

This guide is educational planning content. It does not provide medical, legal, financial, insurance, benefits, tax, or facility-contract advice. Care needs, eligibility, benefits, plan rules, and local costs vary.

Sources:

${sourceList(spec.sources)}
`;
}

function careGuide(spec: CareGuideSpec): ContentPageConfig {
  return {
    id: spec.id,
    kind: 'guide',
    section: 'guides',
    slug: spec.slug,
    guideCategory: spec.category,
    title: spec.title,
    h1: spec.h1,
    subhead: spec.subhead,
    description: spec.description,
    metaDescription: spec.description,
    keywords: spec.keywords,
    intro: spec.intro,
    outcomeLine: spec.outcomeLine,
    longformMarkdown: longform(spec),
    primaryCta: spec.primaryCta,
    secondaryCtas: [
      { href: '/care/guides/', label: 'Care Guides' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    relatedLinks: spec.relatedLinks,
    relatedIds: spec.relatedIds,
    faq: spec.faq,
  };
}

export const ARTICLES_CARE_GUIDES: ContentPageConfig[] = [
  careGuide({
    id: 'art-care-plan-parent',
    slug: 'how-to-plan-senior-care-for-a-parent',
    category: 'Senior Care Guides',
    title: 'How to Plan Senior Care for a Parent | Kefiw',
    h1: 'How to Plan Senior Care for a Parent',
    subhead: 'A calm path from concern to care needs, cost, family roles, and next steps.',
    description: 'Plan senior care for a parent by mapping care needs, safety risks, costs, family workload, Medicare limits, and next steps.',
    keywords: ['how to plan senior care for a parent', 'senior care planning guide', 'elder care planning checklist'],
    intro: 'Senior care planning usually starts with worry, not a spreadsheet. This guide turns the worry into a sequence: what changed, what help is needed, what it may cost, who can help, and what must happen next.',
    outcomeLine: 'Start with the parent problem, not the facility type: safety, daily needs, memory, mobility, medication, meals, money, and caregiver capacity determine the next move.',
    decisionMoment: 'Use this when a parent is starting to miss meals, medications, bills, hygiene, appointments, or safety cues, or when a hospital discharge forces the family to decide quickly.',
    familiesMiss: [
      'The first decision is not "home or facility"; it is whether the current plan is safe for the next week.',
      'Family availability is often overestimated because people count goodwill instead of actual weekly hours.',
      'Medicare may help with skilled care in limited situations, but it does not solve long-term custodial care planning.',
      'A parent can need help and still deserve dignity, choice, and a slower conversation when safety allows.',
    ],
    questions: [
      'What changed in the last 30, 60, and 90 days?',
      'Which daily tasks are unsafe without help?',
      'Who can reliably cover mornings, evenings, nights, transportation, medication, and emergencies?',
      'What monthly budget is possible before selling assets or applying for public benefits?',
      'What would make the current plan fail suddenly?',
    ],
    redFlags: [
      'Falls, wandering, stove incidents, medication mistakes, missed meals, or unsafe driving.',
      'A caregiver sleeping poorly, missing work, or feeling trapped.',
      'A discharge planner, salesperson, or family member pushing a decision without showing costs and care needs.',
    ],
    costFactors: [
      'Paid care hours, facility base rates, care-level add-ons, supplies, medication support, transportation, home modifications, and respite.',
      'Unpaid family time, missed work, travel, legal documents, and emergency backup.',
      'Medicare, Medicaid, VA benefits, long-term care insurance, private pay, and family contributions.',
    ],
    script: '"We are not trying to take over. We are trying to make sure the plan still fits what is happening now. Let us write down what feels hard, what feels unsafe, and what help would protect your independence instead of waiting for a crisis."',
    checklist: [
      'Run the Care Needs Checklist.',
      'Estimate home care, assisted living, memory care, and nursing home scenarios.',
      'Calculate family caregiving hours.',
      'Build a family care budget.',
      'List documents, medications, doctors, insurance, emergency contacts, and facility preferences.',
      'Choose one next conversation and one backup plan.',
    ],
    primaryCta: { href: '/tracks/plan-senior-care/', label: 'Start Senior Care Track' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
    ],
    sources: [SOURCE_MEDICARE_LTC, SOURCE_ACL_CAREGIVERS, SOURCE_ELDERCARE],
    faq: [
      { q: 'What is the first step in planning senior care for a parent?', a: 'Start by writing down the safety and daily-care problems, then estimate the workload and cost. Do not start with a facility tour until the family understands what level of help is actually needed.', faq_intent: 'how-to' },
      { q: 'Should we wait until a parent agrees to every detail?', a: 'If there is no immediate danger, a slower dignity-preserving conversation is better. If there are urgent safety risks, the family may need medical, legal, or emergency guidance sooner.', faq_intent: 'edge-case' },
      { q: 'Does Medicare pay for long-term senior care?', a: 'Medicare says it does not pay for long-term care, including most custodial care. Skilled care after hospitalization is a separate, limited coverage question.', faq_intent: 'trust' },
    ],
  }),
  careGuide({
    id: 'art-care-setting-comparison',
    slug: 'home-care-vs-assisted-living-vs-memory-care-vs-nursing-home',
    category: 'Senior Care Guides',
    title: 'Home Care vs Assisted Living vs Memory Care vs Nursing Home | Kefiw',
    h1: 'Home Care vs Assisted Living vs Memory Care vs Nursing Home',
    subhead: 'Choose the care setting by needs, supervision, safety, cost, and caregiver load.',
    description: 'Compare home care, assisted living, memory care, and nursing home options for senior care planning.',
    keywords: ['home care vs assisted living', 'assisted living vs memory care', 'memory care vs nursing home', 'senior care options'],
    intro: 'Families often compare settings by price first. That is understandable, but the better first question is what kind of help must be reliable every day.',
    outcomeLine: 'The right care setting is the lowest-restriction option that can safely cover daily needs, supervision, medication, mobility, meals, and backup care.',
    decisionMoment: 'Use this when the family is deciding whether to keep care at home, tour assisted living, look for memory care, or consider a nursing home after a health change.',
    familiesMiss: [
      'Home care can be cheaper at low hours and more expensive at high hours.',
      'Assisted living base rent may not include the care level the person actually needs.',
      'Memory care is not just assisted living with a locked door; staffing, behavior support, and supervision matter.',
      'Nursing home care can mean short-term skilled rehab or longer-term custodial care, which are different payment and planning problems.',
    ],
    questions: [
      'How many hours per day does someone need another person available?',
      'Is memory loss causing safety risk, wandering, medication errors, or unsafe cooking?',
      'Can family cover nights, weekends, transportation, and sick-day backup?',
      'Which setting can handle the next likely decline, not just today?',
    ],
    redFlags: [
      'A setting says "we can handle that" without explaining staffing, care levels, or discharge rules.',
      'The care plan depends on one exhausted relative.',
      'A person with wandering or unsafe judgment is left alone because the hourly care budget ran out.',
    ],
    costFactors: [
      'Home care: hourly rate, minimum shifts, overnight coverage, agency fees, private caregiver payroll, supplies, and backup.',
      'Assisted living: rent, care levels, medication management, community fees, transportation, supplies, and rate increases.',
      'Memory care: secured environment, supervision, dementia-trained staff, behavior support, and activities.',
      'Nursing home: skilled care versus custodial care, insurance coverage, Medicaid eligibility, and private-pay exposure.',
    ],
    script: '"Let us compare the care need before we compare buildings. What support has to be there every day, what support can family provide, and what happens if the plan fails at night or on a weekend?"',
    checklist: [
      'Run the Senior Care Cost Calculator for each setting.',
      'Run the Caregiver Hours Calculator for the home-care scenario.',
      'Ask each facility for a written fee sheet and discharge policy.',
      'Identify the backup plan for nights, falls, wandering, and medication mistakes.',
    ],
    primaryCta: { href: '/care/senior-care-cost-calculator/', label: 'Compare Care Costs' },
    relatedLinks: [
      { href: '/care/home-care-cost-calculator/', label: 'Home Care Cost Calculator' },
      { href: '/care/assisted-living-cost-calculator/', label: 'Assisted Living Cost Calculator' },
      { href: '/care/memory-care-cost-calculator/', label: 'Memory Care Cost Calculator' },
      { href: '/care/nursing-home-cost-calculator/', label: 'Nursing Home Cost Calculator' },
    ],
    sources: [SOURCE_MEDICARE_LTC, SOURCE_MEDICARE_SNF, SOURCE_ALZ_HOME_SAFETY],
    faq: [
      { q: 'Is home care always cheaper than assisted living?', a: 'No. Home care can be cheaper when paid hours are low, but it can become more expensive than facility care when coverage approaches daily or overnight support.', faq_intent: 'comparison' },
      { q: 'When does memory care become different from assisted living?', a: 'Memory care becomes relevant when dementia creates supervision, wandering, behavior, medication, or safety needs that ordinary assisted living cannot reliably manage.', faq_intent: 'definition' },
      { q: 'Is nursing home care the same as skilled rehab?', a: 'No. Skilled nursing after a qualifying medical event and long-term custodial nursing home care are different situations with different coverage rules.', faq_intent: 'trust' },
    ],
  }),
  careGuide({
    id: 'art-care-medicare-coverage',
    slug: 'what-medicare-does-and-does-not-cover-for-senior-care',
    category: 'Medicare Guides',
    title: 'What Medicare Does and Does Not Cover for Senior Care | Kefiw',
    h1: 'What Medicare Does and Does Not Cover for Senior Care',
    subhead: 'The key distinction is medical/skilled care versus long-term custodial help.',
    description: 'Understand Medicare senior care coverage limits, skilled nursing facility rules, custodial care gaps, and long-term care planning questions.',
    keywords: ['does medicare cover senior care', 'medicare long term care coverage', 'does medicare cover assisted living', 'medicare nursing home coverage'],
    intro: 'A lot of family care planning goes wrong because everyone assumes Medicare means long-term care is covered. Medicare is important, but it is not a blank check for assisted living, memory care, home care, or custodial nursing home care.',
    outcomeLine: 'Medicare may cover medically necessary skilled care in limited circumstances, but Medicare says it does not pay for long-term care and users may pay all costs for non-covered services.',
    decisionMoment: 'Use this before promising a parent that Medicare will pay for assisted living, memory care, long-term nursing home care, or daily custodial help.',
    familiesMiss: [
      'Skilled nursing facility care and long-term nursing home care are not the same thing.',
      'Medigap helps with some Original Medicare cost-sharing, but it generally does not cover long-term care.',
      'Medicare Advantage may offer extra benefits, but plan rules, networks, prior authorization, and benefit limits matter.',
      'Medicaid can be central to long-term services and supports, but eligibility and rules are state-specific.',
    ],
    questions: [
      'Is the need skilled medical care or help with activities of daily living?',
      'Is there a qualifying hospital stay or a covered skilled need?',
      'What exactly does the plan document say?',
      'What costs remain if Medicare does not cover the care?',
      'Should Medicaid, VA benefits, long-term care insurance, or private pay be evaluated?',
    ],
    redFlags: [
      'Someone says "Medicare will pay" without naming the covered service, duration, and conditions.',
      'A facility or agency uses Medicare language to distract from private-pay custodial costs.',
      'The family delays Medicaid or insurance planning because they assume Medicare will handle it.',
    ],
    costFactors: [
      'Part A skilled nursing facility cost-sharing and duration limits.',
      'Part B premiums, deductibles, and coinsurance.',
      'Part D drug plan costs.',
      'Uncovered custodial care, assisted living, memory care, transportation, and personal-care help.',
    ],
    script: '"Before we count on Medicare, let us ask whether this is skilled medical care or long-term daily help. If it is daily help, we need a payment plan that does not depend on Medicare covering something it usually does not cover."',
    checklist: [
      'Ask the provider what Medicare billing code or benefit they are relying on.',
      'Ask how long coverage may last and what event ends it.',
      'Ask what costs start when coverage stops.',
      'Run the Medicare Cost Planner and a senior care cost calculator.',
      'Check Medicaid, VA, long-term care insurance, and local benefits if long-term care is likely.',
    ],
    primaryCta: { href: '/care/medicare-cost-planner/', label: 'Estimate Medicare Costs' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/long-term-care-insurance-calculator/', label: 'Long-Term Care Insurance Calculator' },
      { href: '/guides/medicare-costs-2026-guide/', label: 'Medicare Costs Guide for 2026' },
    ],
    sources: [SOURCE_MEDICARE_LTC, SOURCE_MEDICARE_NOT_COVERED, SOURCE_MEDICARE_SNF, SOURCE_MEDIGAP_COVERAGE, SOURCE_MEDICAID_LTSS],
    faq: [
      { q: 'Does Medicare pay for assisted living?', a: 'Medicare generally does not pay for long-term custodial care. Some medical services may be covered separately, but room, board, and personal-care support usually need another payment plan.', faq_intent: 'trust' },
      { q: 'Does Medicare pay for a nursing home?', a: 'Medicare Part A can cover skilled nursing facility care for a limited time under specific conditions, but it does not cover long-term or custodial nursing home care.', faq_intent: 'trust' },
      { q: 'What pays for long-term care if Medicare does not?', a: 'Families often use private pay, Medicaid if eligible, VA benefits, long-term care insurance, state/local programs, and family contributions. Rules vary by state and plan.', faq_intent: 'definition' },
    ],
  }),
  careGuide({
    id: 'art-care-senior-cost-guide',
    slug: 'senior-care-cost-guide',
    category: 'Senior Care Guides',
    title: 'Senior Care Cost Guide: What Families Actually Pay For | Kefiw',
    h1: 'Senior Care Cost Guide',
    subhead: 'Base rates are only the first line. Add-ons, supplies, transport, care levels, and family time change the real cost.',
    description: 'Understand senior care cost drivers: home care hours, assisted living fees, memory care add-ons, nursing home exposure, supplies, transportation, Medicaid, and insurance gaps.',
    keywords: ['senior care cost guide', 'what families pay for senior care', 'assisted living fees', 'memory care costs'],
    intro: 'Senior care quotes can look cleaner than they are. Families need a line-item view before comparing options.',
    outcomeLine: 'The real care budget is monthly care cost plus add-ons, supplies, transport, move-in fees, family workload, and the cost of the backup plan.',
    decisionMoment: 'Use this before signing a facility agreement, starting home care, or deciding how siblings will split care expenses.',
    familiesMiss: [
      'Facility base rates may not include the care level, medication management, incontinence supplies, or memory support needed.',
      'Home care quotes may hide minimum hours, cancellation rules, overtime, holiday rates, and backup coverage.',
      'Family time has a cost even when no money changes hands.',
      'Benefits screening should happen before the family spends down in a panic.',
    ],
    questions: [
      'What is included in the base rate?',
      'What triggers care-level increases?',
      'Are medication management, transportation, laundry, supplies, and escort services extra?',
      'How often can rates change?',
      'What happens when needs exceed what this provider can handle?',
    ],
    redFlags: [
      'No written fee sheet.',
      'A tour price that changes after assessment without clear explanation.',
      'Pressure to sign before the family sees care-level fees and discharge rules.',
      'No backup plan for caregiver absences or facility staffing shortages.',
    ],
    costFactors: [
      'Care setting, location, hours, staffing, supervision, memory support, mobility, medication support, supplies, transportation, and respite.',
      'Move-in fees, deposits, assessment fees, rate increases, agency minimums, payroll duties, and contract terms.',
      'Private pay, Medicaid, VA benefits, long-term care insurance, and family reimbursement rules.',
    ],
    script: '"We need the full monthly cost, not the brochure price. Please show us what is included, what is extra, what changes after assessment, and what the bill looks like if care needs increase."',
    checklist: [
      'Run separate care-setting scenarios.',
      'Ask for a written fee sheet.',
      'Add supplies, transportation, medication management, and family time.',
      'Check benefits and insurance before committing.',
      'Set a review date for 30 days after care starts.',
    ],
    primaryCta: { href: '/care/senior-care-cost-calculator/', label: 'Run Senior Care Cost Calculator' },
    relatedLinks: [
      { href: '/care/home-care-cost-calculator/', label: 'Home Care Cost Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/care-cost-reduction-planner/', label: 'Care Cost Reduction Planner' },
    ],
    sources: [SOURCE_MEDICARE_LTC, SOURCE_MEDICAID_LTSS, SOURCE_MEDICAID_HCBS],
    faq: [
      { q: 'Why do senior care prices change after assessment?', a: 'Providers may price care levels after reviewing mobility, bathing, dressing, medication, memory, incontinence, and supervision needs. Ask for the assessment rubric before signing.', faq_intent: 'definition' },
      { q: 'Should families split care costs equally?', a: 'Equal is not always fair. Families should compare income, available time, travel burden, prior support, legal duties, and what the parent can pay.', faq_intent: 'edge-case' },
      { q: 'What is the biggest hidden senior care cost?', a: 'The biggest hidden cost is often supervision: nights, weekends, wandering risk, medication support, and backup coverage when the planned caregiver is unavailable.', faq_intent: 'comparison' },
    ],
  }),
  careGuide({
    id: 'art-caregiver-hours-guide',
    slug: 'caregiver-hours-guide',
    category: 'Caregiving Guides',
    title: 'Caregiver Hours Guide: How Much Time Caregiving Really Takes | Kefiw',
    h1: 'Caregiver Hours Guide',
    subhead: 'Caregiving includes direct care, supervision, transportation, coordination, and emotional load.',
    description: 'Estimate caregiving hours and understand what counts as caregiving work, from ADLs and IADLs to supervision and care coordination.',
    keywords: ['caregiver hours guide', 'how much time does caregiving take', 'what counts as caregiving'],
    intro: 'Caregiving is usually undercounted because families count only hands-on care. The real workload also includes watching, waiting, calling, driving, scheduling, worrying, and cleaning up after problems.',
    outcomeLine: 'If you do not count supervision and coordination, the family care plan will look easier than it is.',
    decisionMoment: 'Use this when siblings disagree about workload, when a caregiver is burning out, or when deciding how many paid-care hours are needed.',
    familiesMiss: [
      'Transportation, phone calls, pharmacy runs, and paperwork are care work.',
      'Supervision can consume time even when no task is happening.',
      'The ACL summarized 2025 caregiving data showing 63 million family caregivers, an average of 27 hours per week, and 24% providing more than 40 hours weekly.',
      'Complex medical and nursing tasks may fall on families without enough training.',
    ],
    questions: [
      'How many hours are hands-on care?',
      'How many hours are supervision or being on call?',
      'Who handles medication, appointments, bills, groceries, and transportation?',
      'What tasks can be assigned, paid for, or removed?',
      'What happens when the main caregiver gets sick?',
    ],
    redFlags: [
      'One person is covering nights and days.',
      'Care work is described as "just checking in" even though it happens every day.',
      'The caregiver is missing work, sleep, meals, medical care, or social contact.',
    ],
    costFactors: [
      'Paid-care replacement rate for family hours.',
      'Transportation, meals, supplies, missed work, and respite.',
      'Higher-cost hours such as overnight, weekend, holiday, and short-notice care.',
    ],
    script: '"Let us list the care tasks by week instead of arguing about who is doing enough. We can then divide tasks, pay for some hours, and protect the person doing the most."',
    checklist: [
      'Track one ordinary week in 15-minute blocks.',
      'Separate direct care, supervision, transport, admin, and emotional support.',
      'Assign owners for recurring tasks.',
      'Add respite before the caregiver is in crisis.',
      'Recalculate after hospitalizations, falls, or memory changes.',
    ],
    primaryCta: { href: '/care/caregiver-hours-calculator/', label: 'Calculate Caregiver Hours' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/guides/caregiver-burnout-guide/', label: 'Caregiver Burnout Guide' },
    ],
    relatedIds: ['medical-triage'],
    sources: [SOURCE_ACL_CAREGIVERS, SOURCE_ELDERCARE],
    faq: [
      { q: 'What counts as caregiving hours?', a: 'Count hands-on care, supervision, medication reminders, transportation, errands, meals, housework, appointment planning, family coordination, and care-related paperwork.', faq_intent: 'definition' },
      { q: 'Should emotional support count as caregiving?', a: 'Yes, if it is recurring, necessary, and affects the caregiver schedule or stress. Emotional support is often invisible but can be one of the largest burdens.', faq_intent: 'definition' },
      { q: 'When should family caregiving be replaced by paid help?', a: 'Paid help should be considered when safety needs exceed family availability, when burnout is visible, or when the caregiver is sacrificing work, sleep, health, or basic stability.', faq_intent: 'edge-case' },
    ],
  }),
  careGuide({
    id: 'art-family-care-budget-guide',
    slug: 'family-care-budget-guide',
    category: 'Caregiving Guides',
    title: 'Family Care Budget Guide | Kefiw',
    h1: 'Family Care Budget Guide',
    subhead: 'Turn care costs into a family plan instead of a quiet resentment machine.',
    description: 'Build a family care budget that includes paid care, unpaid time, reimbursements, shared costs, benefits, and backup care.',
    keywords: ['family care budget guide', 'how to split senior care costs', 'caregiving budget'],
    intro: 'A care budget is not just a math sheet. It is the family agreement that decides who pays, who gives time, who gets reimbursed, and what happens when the plan changes.',
    outcomeLine: 'A fair care budget counts money, time, travel, risk, and responsibility.',
    decisionMoment: 'Use this before one sibling starts paying alone, before the main caregiver starts resenting everyone, or before family expenses become informal and impossible to audit.',
    familiesMiss: [
      'The person giving time may be contributing as much as the person writing checks.',
      'Small recurring expenses become major over months.',
      'Reimbursements need receipts and agreement before conflict starts.',
      'The parent assets, benefits, and legal authority should be clear before siblings improvise.',
    ],
    questions: [
      'What does the parent pay directly?',
      'Which expenses are shared by family?',
      'Who gets reimbursed, from what account, and how often?',
      'Who tracks receipts and decisions?',
      'What is the monthly maximum before the plan must change?',
    ],
    redFlags: [
      'One person controls information and expenses.',
      'No one knows the monthly burn rate.',
      'Family members argue about fairness without writing down time and money.',
      'Reimbursements happen from a parent account without documentation.',
    ],
    costFactors: [
      'Paid care, housing, facility fees, supplies, transportation, medications, home changes, insurance, legal documents, and respite.',
      'Unpaid family hours, lost work, travel, and emergency coverage.',
      'Medicaid, VA, local aging programs, long-term care insurance, and tax/payroll implications.',
    ],
    script: '"Let us separate what Mom pays, what family pays, and what family does. Then we can decide what is fair with the facts in front of us instead of guessing who is sacrificing more."',
    checklist: [
      'List monthly paid-care and facility costs.',
      'List family-paid expenses.',
      'Put unpaid hours into the budget as a visible contribution.',
      'Agree on reimbursement rules.',
      'Review the budget monthly for the first three months.',
    ],
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/care-cost-reduction-planner/', label: 'Care Cost Reduction Planner' },
      { href: '/guides/caregiver-hours-guide/', label: 'Caregiver Hours Guide' },
    ],
    sources: [SOURCE_ACL_CAREGIVERS, SOURCE_MEDICAID_LTSS],
    faq: [
      { q: 'How should siblings split senior care costs?', a: 'Start by listing parent resources, paid costs, and unpaid time. A fair split may account for income, availability, distance, existing caregiving hours, and legal duties.', faq_intent: 'how-to' },
      { q: 'Should unpaid caregiving time be valued in the budget?', a: 'Yes. Even if no one is paid, visible hours help the family understand workload and compare paid-care alternatives.', faq_intent: 'definition' },
      { q: 'What should be documented?', a: 'Document major decisions, receipts, reimbursements, care agreements, family contributions, and who has authority to spend parent funds.', faq_intent: 'how-to' },
    ],
  }),
  careGuide({
    id: 'art-assisted-living-choice',
    slug: 'how-to-choose-an-assisted-living-community',
    category: 'Senior Care Guides',
    title: 'How to Choose an Assisted Living Community | Kefiw',
    h1: 'How to Choose an Assisted Living Community',
    subhead: 'Tour for care reality, not lobby polish.',
    description: 'Choose an assisted living community by checking care levels, staffing, pricing, medication support, contracts, red flags, and family communication.',
    keywords: ['how to choose assisted living', 'assisted living questions to ask', 'assisted living red flags'],
    intro: 'Assisted living tours can feel reassuring because the lobby is clean and the salesperson is kind. The decision should be based on care level fit, staffing, fee clarity, safety, and how the community handles decline.',
    outcomeLine: 'The best assisted living tour answers what happens on a bad day, not just what lunch looks like on a good day.',
    decisionMoment: 'Use this before touring communities, comparing two finalists, or signing an assisted living agreement.',
    familiesMiss: [
      'Care level fees can change the monthly cost more than the apartment price.',
      'Medication management, escorts, incontinence, laundry, transportation, and meals may have separate rules.',
      'Discharge rules matter because residents can be asked to leave when needs exceed the community scope.',
      'Staff response time and family communication matter more than decor.',
    ],
    questions: [
      'What is included in the base rate?',
      'How are care levels assessed and priced?',
      'Who handles medications and what does it cost?',
      'What staffing is available overnight?',
      'What situations trigger transfer or discharge?',
      'How are falls, infections, behavior changes, and hospital returns communicated?',
    ],
    redFlags: [
      'Vague pricing or refusal to share a fee sheet.',
      'Pressure to sign during the tour.',
      'No clear answer about overnight staffing or medication errors.',
      'Residents appear unattended, call lights go unanswered, or staff avoid family questions.',
    ],
    costFactors: [
      'Apartment rent, care level, medication management, move-in/community fee, supplies, transportation, rate increases, and private aides.',
      'Potential future move to memory care or nursing home.',
      'Family time for appointments, advocacy, and care-plan meetings.',
    ],
    script: '"We like the community, but we need to understand the care plan. Please show us the fee schedule, care-level triggers, medication policy, overnight staffing, and discharge rules before we talk about move-in dates."',
    checklist: [
      'Tour at least once outside the most polished hours.',
      'Ask for a written fee sheet and sample contract.',
      'Ask how care plans are updated.',
      'Ask residents/families about response time and communication.',
      'Compare the estimate with the Assisted Living Cost Calculator.',
    ],
    primaryCta: { href: '/care/assisted-living-cost-calculator/', label: 'Estimate Assisted Living Cost' },
    relatedLinks: [
      { href: '/guides/home-care-vs-assisted-living-vs-memory-care-vs-nursing-home/', label: 'Care Setting Comparison' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/', label: 'Care Guides' },
    ],
    sources: [SOURCE_OMBUDSMAN, SOURCE_ELDERCARE],
    faq: [
      { q: 'What should I ask assisted living before signing?', a: 'Ask about care-level pricing, medication management, staffing, rate increases, discharge rules, fees, family communication, and what happens when needs increase.', faq_intent: 'how-to' },
      { q: 'Is assisted living medical care?', a: 'Assisted living is usually residential support with personal care, meals, and assistance. It is not the same as a hospital or skilled nursing facility.', faq_intent: 'definition' },
      { q: 'What is the biggest assisted living red flag?', a: 'The biggest red flag is unclear pricing combined with unclear care-level or discharge rules. Families need to know what happens when care needs rise.', faq_intent: 'edge-case' },
    ],
  }),
  careGuide({
    id: 'art-nursing-home-choice',
    slug: 'how-to-choose-a-nursing-home',
    category: 'Senior Care Guides',
    title: 'How to Choose a Nursing Home | Kefiw',
    h1: 'How to Choose a Nursing Home',
    subhead: 'Use ratings as a starting point, then inspect staffing, care plans, communication, and safety.',
    description: 'Choose a nursing home by using Medicare Care Compare, inspections, staffing, quality measures, tours, questions, and red flags.',
    keywords: ['how to choose a nursing home', 'nursing home checklist', 'nursing home red flags', 'Care Compare nursing home'],
    intro: 'Nursing home decisions are often rushed after hospitalization. A rating can narrow the list, but it cannot replace walking the unit, asking hard questions, and understanding what kind of care is needed.',
    outcomeLine: 'Do not choose by stars alone. Use Care Compare, then verify staffing, inspections, care planning, food, communication, fall response, and family access.',
    decisionMoment: 'Use this when comparing skilled nursing rehab, long-term nursing home placement, or a facility after hospital discharge.',
    familiesMiss: [
      'Medicare Care Compare is useful, but ratings are only one signal.',
      'Short-term rehab and long-term custodial placement can feel similar physically but have different goals and payment rules.',
      'Staffing patterns on weekends and nights may matter more than the tour hour.',
      'Family communication and care-plan meetings are part of quality.',
    ],
    questions: [
      'What is the care goal: rehab, long-term care, memory support, wound care, or end-of-life comfort?',
      'What did recent inspections find?',
      'How is staffing on nights and weekends?',
      'How are falls, pressure injuries, infections, medication changes, and hospital transfers handled?',
      'Who calls family when something changes?',
    ],
    redFlags: [
      'Strong odor, unanswered call lights, residents calling for help without response, or rushed tours.',
      'Staff cannot explain care plans or family communication.',
      'Inspection issues are dismissed instead of explained.',
      'The facility avoids discussing falls, pressure injuries, staffing, or discharge planning.',
    ],
    costFactors: [
      'Skilled coverage periods, private-pay daily rate, Medicaid eligibility, therapy, medications, supplies, personal items, and transport.',
      'Potential cost when Medicare coverage ends or skilled need no longer qualifies.',
      'Family travel and advocacy time.',
    ],
    script: '"We saw the rating, but we also need to understand the unit. Can you show us staffing patterns, recent inspection reports, care-plan process, fall prevention, and who contacts family after a change?"',
    checklist: [
      'Check Medicare Care Compare.',
      'Read inspection findings, not just the star rating.',
      'Tour the specific unit.',
      'Ask about staffing and care-plan meetings.',
      'Clarify payment after skilled coverage ends.',
      'Know how to contact the ombudsman or state agency if concerns arise.',
    ],
    primaryCta: { href: '/care/nursing-home-cost-calculator/', label: 'Estimate Nursing Home Cost' },
    relatedLinks: [
      { href: '/guides/what-medicare-does-and-does-not-cover-for-senior-care/', label: 'Medicare Coverage Guide' },
      { href: '/care/medicare-cost-planner/', label: 'Medicare Cost Planner' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
    ],
    sources: [SOURCE_NURSING_HOME_GUIDE, SOURCE_CARE_COMPARE, SOURCE_MEDICARE_SNF, SOURCE_OMBUDSMAN],
    faq: [
      { q: 'Should I trust nursing home star ratings?', a: 'Use star ratings as a starting point, not the final decision. Read inspections, check staffing, tour the unit, and ask how the facility handles the specific care need.', faq_intent: 'trust' },
      { q: 'What is the difference between skilled nursing and long-term nursing home care?', a: 'Skilled nursing is medical or rehab care under specific conditions. Long-term custodial nursing home care is ongoing help with daily needs and usually requires a different payment plan.', faq_intent: 'definition' },
      { q: 'Who helps with nursing home complaints?', a: 'State Long-Term Care Ombudsman programs work to resolve problems related to health, safety, welfare, and rights in long-term care facilities.', faq_intent: 'how-to' },
    ],
  }),
  careGuide({
    id: 'art-memory-care-families',
    slug: 'memory-care-guide-for-families',
    category: 'Senior Care Guides',
    title: 'Memory Care Guide for Families | Kefiw',
    h1: 'Memory Care Guide for Families',
    subhead: 'Memory care decisions turn on supervision, safety, behavior support, and caregiver capacity.',
    description: 'Understand memory care planning for dementia, Alzheimer disease, wandering risk, supervision, behavior support, and family caregiving burden.',
    keywords: ['memory care guide', 'dementia care guide', 'memory care families', 'when is memory care needed'],
    intro: 'Memory care decisions are hard because the person may still have many good moments. The care plan should be based on predictable safety, not the best hour of the week.',
    outcomeLine: 'Memory care becomes relevant when memory changes create safety, supervision, medication, wandering, hygiene, nutrition, or behavior needs that ordinary support cannot reliably cover.',
    decisionMoment: 'Use this when dementia, Alzheimer disease, or cognitive change is making home care, assisted living, or family supervision unreliable.',
    familiesMiss: [
      'A loved one can sound convincing and still be unsafe alone.',
      'Wandering risk, stove use, medication errors, and inability to call for help are safety issues, not personality flaws.',
      'Behavior support and staff training matter as much as locked doors.',
      'Family caregivers often minimize risk because the decision feels disloyal.',
    ],
    questions: [
      'Can the person safely be alone for any period?',
      'Are they eating, bathing, taking medications, and using appliances safely?',
      'Are there wandering, exit-seeking, agitation, or night-time risks?',
      'What dementia-specific staff training does the community provide?',
      'How does the community handle behavior changes without over-sedating or isolating residents?',
    ],
    redFlags: [
      'Unsafe exits, poor supervision, or activities that do not match cognitive level.',
      'Staff cannot explain behavior response or dementia training.',
      'Family is relying on cameras or check-ins when hands-on supervision is needed.',
      'Medication changes are used as the only behavior plan.',
    ],
    costFactors: [
      'Memory care base rate, care-level add-ons, medication management, supplies, behavior support, transportation, and private sitters.',
      'Home safety modifications, adult day programs, respite, and overnight supervision if staying home.',
      'Future transitions if care needs exceed the community scope.',
    ],
    script: '"This is not about taking away independence. It is about matching the support to what the disease is doing now. Let us look at the safety risks and choose the least restrictive plan that still protects you."',
    checklist: [
      'Document safety incidents and near misses.',
      'Run the Memory Care Cost Calculator.',
      'Ask communities about wandering prevention, staff training, behavior plans, and family updates.',
      'Plan respite and caregiver support.',
      'Review legal documents and emergency contacts.',
    ],
    primaryCta: { href: '/care/memory-care-cost-calculator/', label: 'Estimate Memory Care Cost' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/guides/home-care-vs-assisted-living-vs-memory-care-vs-nursing-home/', label: 'Care Setting Comparison' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
    ],
    sources: [SOURCE_ALZ_HOME_SAFETY, SOURCE_ACL_CAREGIVERS],
    faq: [
      { q: 'When is memory care needed?', a: 'Memory care may be needed when cognitive changes create safety, wandering, supervision, medication, hygiene, nutrition, or behavior needs that family or ordinary assisted living cannot reliably cover.', faq_intent: 'definition' },
      { q: 'Is a locked unit enough?', a: 'No. Safe memory care also needs trained staff, meaningful activities, behavior support, communication with family, and careful medication practices.', faq_intent: 'trust' },
      { q: 'Can someone with dementia stay at home?', a: 'Sometimes, if supervision, safety, medication, meals, transportation, respite, and backup care are reliable. The home plan should be reassessed as needs change.', faq_intent: 'edge-case' },
    ],
  }),
  careGuide({
    id: 'art-medicare-costs-2026',
    slug: 'medicare-costs-2026-guide',
    category: 'Medicare Guides',
    title: 'Medicare Costs Guide for 2026 | Kefiw',
    h1: 'Medicare Costs Guide for 2026',
    subhead: 'Part B, Part D, IRMAA, deductibles, supplements, and out-of-pocket planning.',
    description: 'Understand 2026 Medicare costs including Part B premium, Part B deductible, Part D deductible, Part D out-of-pocket cap, IRMAA, Medigap, and Medicare Advantage planning.',
    keywords: ['Medicare costs 2026', 'Part B premium 2026', 'Part D deductible 2026', 'Medicare cost guide'],
    intro: 'Medicare cost planning needs annual upkeep. For 2026, the key defaults include the standard Part B premium, Part B deductible, Part D deductible ceiling, and Part D covered-drug out-of-pocket threshold.',
    outcomeLine: 'For 2026, CMS lists the standard Part B premium at $202.90 and the Part B deductible at $283; Medicare says Part D deductibles cannot exceed $615 and covered Part D out-of-pocket drug costs reach catastrophic coverage at $2,100.',
    decisionMoment: 'Use this during Medicare enrollment, annual plan review, retirement income planning, or when a family is estimating monthly care costs.',
    familiesMiss: [
      'Original Medicare does not have a simple annual out-of-pocket maximum unless supplemental coverage applies.',
      'Part D drug costs depend heavily on the exact plan, pharmacy, drug list, and prior authorization rules.',
      'IRMAA can add to both Part B and Part D for higher-income households.',
      'Long-term custodial care is a separate planning problem from Medicare premiums.',
    ],
    questions: [
      'What is the monthly Part B premium and any IRMAA add-on?',
      'What are Part D premium, deductible, drug costs, and pharmacy restrictions?',
      'Is the person using Original Medicare plus Medigap or Medicare Advantage?',
      'Which doctors, hospitals, drugs, and pharmacies must stay covered?',
      'What care costs are outside Medicare entirely?',
    ],
    redFlags: [
      'Choosing a plan because the premium is low without checking drugs and providers.',
      'Ignoring IRMAA before a large taxable income year.',
      'Assuming Medicare pays for assisted living or long-term custodial care.',
    ],
    costFactors: [
      'Part B premium, Part B deductible, Part B coinsurance, Part D premium, Part D deductible, drug out-of-pocket costs, Medigap premium, Medicare Advantage maximums, and dental/vision/hearing.',
      'IRMAA, late enrollment penalties, provider networks, prior authorization, and uncovered services.',
    ],
    script: '"Let us separate fixed Medicare premiums from variable costs. Then we can check doctors, drugs, pharmacy, IRMAA, and what Medicare does not cover before choosing a plan."',
    checklist: [
      'Run the Medicare Cost Planner.',
      'Run the IRMAA Calculator if income is above or near thresholds.',
      'Check every medication against the Part D plan.',
      'Compare doctor and hospital access.',
      'Add long-term care costs outside Medicare.',
    ],
    primaryCta: { href: '/care/medicare-cost-planner/', label: 'Run Medicare Cost Planner' },
    relatedLinks: [
      { href: '/care/medicare-irmaa-calculator/', label: 'Medicare IRMAA Calculator' },
      { href: '/care/part-b-premium-calculator/', label: 'Part B Premium Calculator' },
      { href: '/care/part-d-estimate/', label: 'Part D Estimate' },
    ],
    sources: [SOURCE_CMS_PART_B_2026, SOURCE_MEDICARE_COSTS, SOURCE_PART_D_COSTS_2026, SOURCE_MEDICARE_LTC],
    faq: [
      { q: 'What is the standard Medicare Part B premium for 2026?', a: 'CMS lists the 2026 standard monthly Part B premium as $202.90. Higher-income households may pay IRMAA in addition to the standard premium.', faq_intent: 'definition' },
      { q: 'What is the Medicare Part B deductible for 2026?', a: 'CMS lists the 2026 annual Part B deductible as $283.', faq_intent: 'definition' },
      { q: 'What is the maximum Part D deductible in 2026?', a: 'Medicare says no Medicare drug plan may have a deductible above $615 in 2026, and some plans have no deductible.', faq_intent: 'definition' },
    ],
  }),
  careGuide({
    id: 'art-medicare-irmaa-guide',
    slug: 'medicare-irmaa-guide',
    category: 'Medicare Guides',
    title: 'Medicare IRMAA Guide | Kefiw',
    h1: 'Medicare IRMAA Guide',
    subhead: 'Understand income lookback, Part B and Part D surcharges, appeals, and planning questions.',
    description: 'Learn how Medicare IRMAA can affect Part B and Part D premiums, including income lookback, MAGI, life-changing events, appeals, and planning questions.',
    keywords: ['Medicare IRMAA guide', 'IRMAA appeal', 'Medicare income related monthly adjustment amount', 'Part B IRMAA'],
    intro: 'IRMAA is easy to miss because the premium change may arrive after the income event. A Roth conversion, home sale, investment gain, or retirement transition can affect Medicare premium exposure.',
    outcomeLine: 'IRMAA is an income-related monthly adjustment amount that can apply to Medicare Part B and Part D premiums; it depends on income information Medicare/Social Security uses, not just this month income.',
    decisionMoment: 'Use this before a large taxable income event or when a Social Security IRMAA notice arrives.',
    familiesMiss: [
      'The income year used for IRMAA may lag the premium year.',
      'Part B and Part D can both have income-related add-ons.',
      'Some life-changing events may support an appeal or adjustment, but the calculator cannot decide that.',
      'Avoiding IRMAA should not automatically override better tax, retirement, or estate planning.',
    ],
    questions: [
      'Which tax year is Medicare using?',
      'Is modified adjusted gross income near a threshold?',
      'Was there a life-changing event such as retirement, marriage change, or income loss?',
      'Does the income event save more elsewhere than it costs in IRMAA?',
    ],
    redFlags: [
      'A plan assumes income will stay low after a one-time event without checking the lookback.',
      'Someone tries to avoid IRMAA in a way that creates a larger tax or investment problem.',
      'A household ignores a Social Security IRMAA notice deadline.',
    ],
    costFactors: [
      'Part B add-on, Part D add-on, duration of surcharge, tax impact of income event, and opportunity cost of delaying income.',
      'Professional planning cost if retirement income, Roth conversion, or capital gains are involved.',
    ],
    script: '"Before we panic about the premium, let us identify the income year, the threshold, whether this is one-time income, and whether an appeal or professional tax planning question applies."',
    checklist: [
      'Run the Medicare IRMAA Calculator.',
      'Check the income year on the notice.',
      'List one-time income events.',
      'Ask whether a life-changing event form or appeal applies.',
      'Coordinate with tax and financial planning before reversing a strategy only because of IRMAA.',
    ],
    primaryCta: { href: '/care/medicare-irmaa-calculator/', label: 'Run IRMAA Calculator' },
    relatedLinks: [
      { href: '/care/medicare-cost-planner/', label: 'Medicare Cost Planner' },
      { href: '/guides/medicare-costs-2026-guide/', label: 'Medicare Costs Guide for 2026' },
      { href: '/care/part-d-estimate/', label: 'Part D Estimate' },
    ],
    sources: [SOURCE_CMS_PART_B_2026, SOURCE_MEDICARE_COSTS],
    faq: [
      { q: 'What does IRMAA apply to?', a: 'IRMAA can apply to Medicare Part B and Part D premium amounts for higher-income households.', faq_intent: 'definition' },
      { q: 'Can IRMAA be appealed?', a: 'Some people may have appeal or reconsideration options, especially after certain life-changing events. Confirm the process with Social Security or Medicare materials.', faq_intent: 'how-to' },
      { q: 'Should I avoid income just to avoid IRMAA?', a: 'Not automatically. Compare the premium impact against tax, retirement, investment, and cash-flow consequences.', faq_intent: 'edge-case' },
    ],
  }),
  careGuide({
    id: 'art-part-d-drug-cost-guide',
    slug: 'part-d-drug-cost-guide',
    category: 'Medicare Guides',
    title: 'Part D Drug Cost Guide | Kefiw',
    h1: 'Part D Drug Cost Guide',
    subhead: 'Premium, deductible, formulary, pharmacy, prior authorization, and the 2026 covered-drug cap.',
    description: 'Understand Medicare Part D drug costs for 2026, including premiums, deductible, formulary, pharmacy networks, prior authorization, late enrollment penalty, and out-of-pocket cap.',
    keywords: ['Part D drug cost guide', 'Medicare Part D 2026 deductible', 'Medicare drug plan costs', 'Part D late enrollment penalty'],
    intro: 'Part D is where a low premium can hide an expensive drug list. The plan needs to fit the actual prescriptions, pharmacy, restrictions, and income situation.',
    outcomeLine: 'In 2026, Medicare says no Part D deductible may exceed $615, and covered Part D out-of-pocket drug costs reach catastrophic coverage at $2,100.',
    decisionMoment: 'Use this during Medicare open enrollment, after a new expensive medication, or when a parent changes pharmacy or plan.',
    familiesMiss: [
      'A drug can be covered but still expensive because of tier, pharmacy, deductible, or prior authorization.',
      'The cheapest premium plan can be costly if it handles a key medication badly.',
      'The Part D late enrollment penalty can stick if someone goes too long without creditable coverage.',
      'Extra Help can change the cost picture for eligible users.',
    ],
    questions: [
      'Are every current medication, dose, and pharmacy in the plan comparison?',
      'Does the plan require prior authorization, step therapy, or quantity limits?',
      'What happens if one expensive drug changes tier?',
      'Is there a late enrollment penalty risk?',
      'Does Extra Help apply?',
    ],
    redFlags: [
      'Choosing by premium without entering drugs.',
      'Ignoring preferred pharmacies.',
      'Missing a prior authorization or step therapy restriction.',
      'Assuming last year plan is still best.',
    ],
    costFactors: [
      'Monthly premium, deductible, drug tier, coinsurance/copay, pharmacy, coverage stage, Extra Help, IRMAA, and late enrollment penalty.',
      'Drug changes during the year and whether alternatives are acceptable to the prescriber.',
    ],
    script: '"Before choosing the plan, let us enter the actual medications and pharmacy. A lower premium does not help if one required drug becomes expensive or restricted."',
    checklist: [
      'Make a current medication list.',
      'Run the Part D Estimate.',
      'Check deductible, tiers, restrictions, and pharmacy.',
      'Check IRMAA and late enrollment penalty issues.',
      'Recheck every year during open enrollment.',
    ],
    primaryCta: { href: '/care/part-d-estimate/', label: 'Run Part D Estimate' },
    relatedLinks: [
      { href: '/care/medicare-cost-planner/', label: 'Medicare Cost Planner' },
      { href: '/care/medicare-irmaa-calculator/', label: 'Medicare IRMAA Calculator' },
      { href: '/guides/medicare-costs-2026-guide/', label: 'Medicare Costs Guide for 2026' },
    ],
    sources: [SOURCE_PART_D_COSTS_2026, SOURCE_MEDICARE_COSTS],
    faq: [
      { q: 'What is the Part D deductible limit for 2026?', a: 'Medicare says no Medicare drug plan may have a deductible above $615 in 2026.', faq_intent: 'definition' },
      { q: 'What is the 2026 Part D out-of-pocket threshold?', a: 'Medicare says covered Part D out-of-pocket drug costs reach catastrophic coverage at $2,100 in 2026.', faq_intent: 'definition' },
      { q: 'Why do Part D costs change by pharmacy?', a: 'Plan pharmacy networks, preferred pricing, negotiated rates, and drug tiers can change what the user pays at different pharmacies.', faq_intent: 'comparison' },
    ],
  }),
  careGuide({
    id: 'art-hsa-fsa-family-care',
    slug: 'hsa-vs-fsa-guide-for-family-care-expenses',
    category: 'Insurance & Payment Guides',
    title: 'HSA vs FSA Guide for Family Care Expenses | Kefiw',
    h1: 'HSA vs FSA Guide for Family Care Expenses',
    subhead: 'Use tax-preferred accounts carefully. Eligibility, employer rules, and expense type matter.',
    description: 'Compare HSA and FSA planning for family care expenses, including 2026 HSA limits, health FSA limits, eligibility, coordination, and expense questions.',
    keywords: ['HSA vs FSA guide', 'HSA family care expenses', 'FSA medical expenses', '2026 HSA limits'],
    intro: 'HSA and FSA planning can help with predictable medical expenses, but the rules are not a general caregiving reimbursement account.',
    outcomeLine: 'For 2026, IRS guidance lists HSA contribution limits of $4,400 for self-only HDHP coverage and $8,750 for family HDHP coverage; IRS guidance also lists a $3,400 health FSA salary-reduction limit.',
    decisionMoment: 'Use this during benefits enrollment, before setting contribution amounts, or before assuming a care expense is eligible.',
    familiesMiss: [
      'HSA eligibility depends on qualifying HDHP coverage and other coverage rules.',
      'A general-purpose health FSA can interfere with HSA eligibility in some situations.',
      'Health FSA rules are employer-plan specific and often use-it-or-lose-it with limited carryover rules.',
      'Caregiving expenses are not automatically eligible medical expenses.',
    ],
    questions: [
      'Is the person HSA eligible for the whole period?',
      'Does the employer offer a general-purpose or limited-purpose FSA?',
      'Which expected expenses are qualified medical expenses?',
      'What happens to unused FSA funds?',
      'Who is the expense for and who can reimburse it?',
    ],
    redFlags: [
      'Contributing to an HSA without checking eligibility.',
      'Using HSA/FSA money for general family support that is not a qualified expense.',
      'Overfunding an FSA without predictable eligible expenses.',
      'Ignoring employer plan documents.',
    ],
    costFactors: [
      'Contribution amount, expected eligible expenses, income/payroll tax rate, carryover rules, employer contributions, and reimbursement timing.',
      'Whether care costs are medical expenses or general living/custodial support.',
    ],
    script: '"Let us separate medical expenses from general caregiving expenses before choosing the contribution. We should confirm eligibility and plan rules instead of treating the account like a general care fund."',
    checklist: [
      'Run the HSA/FSA Calculator.',
      'Check HDHP and HSA eligibility.',
      'Read employer FSA rules.',
      'List predictable qualified expenses.',
      'Do not rely on the calculator alone for eligible-expense treatment.',
    ],
    primaryCta: { href: '/care/hsa-fsa-calculator/', label: 'Run HSA / FSA Calculator' },
    relatedLinks: [
      { href: '/care/health-insurance-cost-calculator/', label: 'Health Insurance Cost Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/insurance/', label: 'Insurance Planning Tools' },
    ],
    sources: [SOURCE_IRS_HSA_2026, SOURCE_IRS_FSA_2026],
    faq: [
      { q: 'Can I use an HSA for caregiving expenses?', a: 'Only if the expense qualifies under HSA medical-expense rules. General caregiving, housing, or family support is not automatically eligible.', faq_intent: 'trust' },
      { q: 'What are the 2026 HSA contribution limits?', a: 'IRS guidance lists 2026 HSA limits of $4,400 for self-only HDHP coverage and $8,750 for family HDHP coverage, before any applicable catch-up contribution.', faq_intent: 'definition' },
      { q: 'What is the 2026 health FSA limit?', a: 'IRS guidance lists the 2026 health FSA salary-reduction limit at $3,400.', faq_intent: 'definition' },
    ],
  }),
  careGuide({
    id: 'art-long-term-care-insurance-guide',
    slug: 'long-term-care-insurance-guide',
    category: 'Insurance & Payment Guides',
    title: 'Long-Term Care Insurance Guide | Kefiw',
    h1: 'Long-Term Care Insurance Guide',
    subhead: 'Daily benefit, elimination period, inflation protection, triggers, exclusions, and premium risk.',
    description: 'Understand long-term care insurance policy value, benefit triggers, elimination periods, daily benefits, inflation protection, exclusions, claims, and coverage gaps.',
    keywords: ['long term care insurance guide', 'is long term care insurance worth it', 'long term care insurance benefits'],
    intro: 'Long-term care insurance can help, but families need to know what the policy actually pays, when it starts, how long it lasts, and what remains uncovered.',
    outcomeLine: 'A long-term care policy is useful only if the benefit, trigger, duration, inflation protection, and claims process match the care need.',
    decisionMoment: 'Use this when reviewing an existing policy, comparing policies, or deciding whether a policy meaningfully offsets senior care costs.',
    familiesMiss: [
      'The elimination period can require substantial cash before benefits begin.',
      'The daily or monthly benefit may be far below current care costs.',
      'Inflation protection matters when care may be years away.',
      'Policy triggers, exclusions, and documentation rules control claims.',
    ],
    questions: [
      'What triggers benefits?',
      'How long is the elimination period and how is it counted?',
      'What is the daily or monthly benefit?',
      'How long does the benefit last?',
      'Is there inflation protection?',
      'What care settings are covered or excluded?',
    ],
    redFlags: [
      'A family assumes the policy covers all care costs.',
      'No one has read the claim trigger language.',
      'Premium increases threaten affordability.',
      'The policy benefit is not compared against current local care costs.',
    ],
    costFactors: [
      'Premiums, benefit amount, elimination period, benefit duration, inflation protection, care setting, claim documentation, and uncovered gap.',
      'The cost of waiting during the elimination period.',
    ],
    script: '"Before we count this policy as the payment plan, let us calculate the monthly benefit, the elimination-period cash need, how long benefits last, and what costs remain uncovered."',
    checklist: [
      'Run the Long-Term Care Insurance Calculator.',
      'Find policy schedule pages.',
      'Identify benefit triggers and elimination period.',
      'Compare benefit to local care costs.',
      'Call the insurer before care starts if a claim may be near.',
    ],
    primaryCta: { href: '/care/long-term-care-insurance-calculator/', label: 'Run LTC Insurance Calculator' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/guides/what-medicare-does-and-does-not-cover-for-senior-care/', label: 'Medicare Coverage Guide' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
    ],
    sources: [SOURCE_MEDICARE_LTC, SOURCE_MEDIGAP_COVERAGE],
    faq: [
      { q: 'Does long-term care insurance cover all senior care?', a: 'Not necessarily. Coverage depends on the policy benefit, trigger, elimination period, setting, exclusions, and claim approval.', faq_intent: 'trust' },
      { q: 'What is an elimination period?', a: 'It is the waiting period before benefits begin. The family may need to pay care costs during that period.', faq_intent: 'definition' },
      { q: 'Is long-term care insurance worth it?', a: 'It depends on premiums, benefit design, health, assets, family risk tolerance, care costs, and alternatives. A calculator can show gaps but cannot provide personalized financial advice.', faq_intent: 'comparison' },
    ],
  }),
  careGuide({
    id: 'art-caregiver-burnout-guide',
    slug: 'caregiver-burnout-guide',
    category: 'Wellbeing Guides',
    title: 'Caregiver Burnout Guide | Kefiw',
    h1: 'Caregiver Burnout Guide',
    subhead: 'Burnout is not a character flaw. It is a care-plan warning light.',
    description: 'Recognize caregiver burnout signs, causes, next steps, and how to use caregiver workload, stress, mind reset, and sleep tools safely.',
    keywords: ['caregiver burnout guide', 'caregiver stress signs', 'family caregiver burnout', 'caregiver boundaries'],
    intro: 'Caregiver burnout often appears after the family has normalized an impossible workload. The fix is not just a pep talk; the care plan needs more support, fewer hidden tasks, and better boundaries.',
    outcomeLine: 'Burnout means the care plan is consuming more capacity than the caregiver can safely provide.',
    decisionMoment: 'Use this when the caregiver is sleep-deprived, resentful, isolated, missing work, having health symptoms, or feeling emotionally numb.',
    familiesMiss: [
      'A burned-out caregiver may still look competent from the outside.',
      'Resentment can be a signal that the plan is unfair or unsafe.',
      'Sleep loss changes judgment, patience, and health.',
      'Stress tools help with the moment, but the workload still needs to change.',
    ],
    questions: [
      'How many hours of care happen each week?',
      'What tasks can be reassigned, paid for, delayed, or deleted?',
      'What respite is scheduled, not merely promised?',
      'Who is the backup if the caregiver gets sick?',
      'Is urgent medical, mental health, or crisis support needed?',
    ],
    redFlags: [
      'Sleeping poorly most nights.',
      'Feeling trapped, numb, angry, or hopeless.',
      'Missing personal medical care.',
      'Using alcohol, substances, or avoidance to cope.',
      'Thoughts of self-harm or harming someone else. In immediate danger, call emergency services; in the U.S., call or text 988 for crisis support.',
    ],
    costFactors: [
      'Respite care, adult day care, paid home care, family travel, missed work, counseling, and health costs.',
      'The cost of not intervening: caregiver illness, job loss, unsafe care, or emergency placement.',
    ],
    script: '"I can keep helping, but I cannot be the whole care system. We need to list the tasks, add backup, and decide what gets paid for or reassigned before this becomes unsafe for both of us."',
    checklist: [
      'Run the Caregiver Hours Calculator.',
      'Choose one task to remove this week.',
      'Schedule respite or backup coverage.',
      'Use Mind Reset or Sleep Reset for immediate grounding.',
      'Escalate to medical, mental health, or emergency help if safety is at risk.',
    ],
    primaryCta: { href: '/care/caregiver-hours-calculator/', label: 'Calculate Caregiver Hours' },
    relatedLinks: [
      { href: '/tracks/mind-reset/', label: 'Mind Reset Track' },
      { href: '/tracks/sleep-reset/', label: 'Sleep Reset Track' },
      { href: '/care/care-cost-reduction-planner/', label: 'Care Cost Reduction Planner' },
    ],
    relatedIds: ['rem-sync', 'medical-triage'],
    sources: [SOURCE_ACL_CAREGIVERS, SOURCE_ELDERCARE],
    faq: [
      { q: 'What are caregiver burnout signs?', a: 'Common signs include sleep loss, resentment, isolation, missed work, emotional numbness, health decline, irritability, and feeling trapped.', faq_intent: 'definition' },
      { q: 'Can a reset tool fix burnout?', a: 'A reset tool can help in the moment, but burnout usually requires changing workload, support, respite, boundaries, or paid-care coverage.', faq_intent: 'trust' },
      { q: 'When is caregiver stress urgent?', a: 'If someone may hurt themselves or someone else, feels in immediate danger, or cannot keep the care recipient safe, use emergency services or crisis support immediately.', faq_intent: 'trust' },
    ],
  }),
  careGuide({
    id: 'art-care-needs-checklist-guide',
    slug: 'care-needs-checklist-guide',
    category: 'Caregiving Guides',
    title: 'Care Needs Checklist Guide | Kefiw',
    h1: 'Care Needs Checklist Guide',
    subhead: 'ADLs, IADLs, safety, memory, mobility, medications, meals, transport, finances, and supervision.',
    description: 'Use a care needs checklist to review activities of daily living, household tasks, safety, memory, mobility, medications, meals, transportation, finances, and supervision needs.',
    keywords: ['care needs checklist', 'ADL IADL checklist', 'senior care needs checklist', 'care assessment checklist'],
    intro: 'A checklist helps families stop arguing from impressions. It turns vague worry into observable needs and gives professionals clearer information.',
    outcomeLine: 'A care needs checklist should document what help is needed, how often, who provides it, and what risk appears if it is missed.',
    decisionMoment: 'Use this before touring care settings, hiring home care, building a family schedule, or talking to a clinician after a change.',
    familiesMiss: [
      'ADLs and IADLs are different but both matter.',
      'Supervision can be the main need even when direct care tasks look small.',
      'Safety incidents and near misses count, not just injuries.',
      'Medication and money problems often appear before families admit care is changing.',
    ],
    questions: [
      'Can the person bathe, dress, toilet, transfer, eat, and move safely?',
      'Can they manage meals, medication, transportation, bills, and appointments?',
      'Are memory changes affecting judgment or safety?',
      'How often does help need to be present?',
      'What happens if help is delayed?',
    ],
    redFlags: [
      'Falls, wandering, stove incidents, missed medications, spoiled food, unpaid bills, or isolation.',
      'A person saying "I am fine" while records, home conditions, or incidents show otherwise.',
      'No one knows who is responsible for medication and appointments.',
    ],
    costFactors: [
      'Direct care hours, supervision hours, transportation, meal support, medication management, home modifications, and caregiver coordination.',
      'Paid care replacement cost for tasks family cannot cover reliably.',
    ],
    script: '"Let us write down what is happening without blaming anyone. If a task is hard or unsafe, it goes on the list so we can plan support instead of waiting for a crisis."',
    checklist: [
      'Review ADLs and IADLs.',
      'Document memory, safety, mobility, and medication issues.',
      'List who currently helps and how often.',
      'Identify tasks with no backup.',
      'Use the checklist to run cost and hours calculators.',
    ],
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    sources: [SOURCE_MEDICARE_LTC, SOURCE_ACL_CAREGIVERS, SOURCE_ALZ_HOME_SAFETY],
    faq: [
      { q: 'What are ADLs?', a: 'ADLs are basic daily activities such as bathing, dressing, toileting, transferring, eating, and mobility.', faq_intent: 'definition' },
      { q: 'What are IADLs?', a: 'IADLs are household and independent-living tasks such as meals, transportation, medication management, shopping, appointments, bills, and housekeeping.', faq_intent: 'definition' },
      { q: 'How often should care needs be reassessed?', a: 'Reassess after falls, hospitalizations, medication errors, memory changes, caregiver burnout, or any major change in function.', faq_intent: 'how-to' },
    ],
  }),
];

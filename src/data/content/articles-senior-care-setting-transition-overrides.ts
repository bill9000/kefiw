import type { ContentPageConfig } from '../content-pages';

const SOURCE_NIA_LONG_TERM_CARE =
  '[NIA: Long-term care basics](https://www.nia.nih.gov/health/caregiving/what-long-term-care)';
const SOURCE_NIA_ADVANCE_CARE_LTC =
  '[NIA: Advance care planning, long-term care section](https://order.nia.nih.gov/sites/default/files/2023-04/nia-advance-care-planning.pdf)';
const SOURCE_NIA_AGING_IN_PLACE =
  '[NIA: Aging in place](https://www.nia.nih.gov/health/aging-place/aging-place-growing-older-home)';
const SOURCE_NIA_HOME_SERVICES =
  '[NIA: Services for older adults living at home](https://www.nia.nih.gov/health/caregiving/services-older-adults-living-home)';
const SOURCE_NIA_ALZHEIMERS_CARE =
  "[NIA: Caring for a person with Alzheimer's disease](https://order.nia.nih.gov/sites/default/files/2024-03/caring-for-a-Person-with-alzheimers-disease.pdf)";
const SOURCE_MEDICARE_LTC =
  '[Medicare: Long-term care coverage](https://www.medicare.gov/coverage/long-term-care)';
const SOURCE_MEDICARE_NURSING_HOME =
  '[Medicare: Nursing homes](https://www.medicare.gov/providers-services/original-medicare/nursing-homes)';
const SOURCE_MEDICARE_2026_COSTS =
  '[Medicare: 2026 Medicare costs](https://www.medicare.gov/publications/11579-medicare-costs.pdf?ftag=YHF4eb9d17)';
const SOURCE_CARESCOUT_COST_OF_CARE =
  '[CareScout: 2025 Cost of Care Survey](https://www.carescout.com/cost-of-care)';
const SOURCE_CARESCOUT_DATA_TABLES =
  '[CareScout: 2025 national and state median cost tables](https://assets.carescout.com/x/8fcb50422f/282102.pdf)';
const SOURCE_FCA_DISCHARGE =
  '[Family Caregiver Alliance: Hospital discharge planning](https://www.caregiver.org/resource/hospital-discharge-planning-guide-families-and-caregivers/)';
const SOURCE_FCA_HOME_HELP =
  '[Family Caregiver Alliance: Hiring in-home help](https://www.caregiver.org/resource/hiring-home-help/)';

const sharedSettingDisclaimer = `## Kefiw Senior Care Setting Disclaimer

Kefiw provides educational care-planning tools and guides. This content does not replace medical, legal, financial, tax, insurance, Medicare, Medicaid, or professional care advice. Care needs, costs, coverage, facility policies, provider availability, and eligibility rules vary by person, plan, provider, location, and year. For urgent medical concerns or immediate danger, call emergency services.

## Continue Planning With Kefiw

- [Run the Care Needs Checklist](/care/care-needs-checklist/)
- [Estimate senior care cost](/care/senior-care-cost-calculator/)
- [Calculate caregiver hours](/care/caregiver-hours-calculator/)
- [Build a family care budget](/care/family-care-budget-calculator/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withSettingFooter(body: string, reviewer: string, sources: string[]): string {
  return `${body}

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedSettingDisclaimer}`;
}

const faq = (q: string, a: string, faq_intent = 'how-to') => ({ q, a, faq_intent });

function newGuide(config: ContentPageConfig): ContentPageConfig {
  return config;
}

export const CARE_SETTING_TRANSITION_NEW_GUIDES: ContentPageConfig[] = [
  newGuide({
    id: 'art-care-home-care-guide-families',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Senior Care Guides',
    slug: 'home-care-guide-for-families',
    title: 'Home Care Guide for Families: Services, Costs, Questions, and Red Flags | Kefiw',
    h1: 'Home Care Guide for Families',
    description:
      'Learn how home care works, what services may be included, what families should ask, how costs are calculated, and when home care may not be enough.',
    metaDescription:
      'Learn how home care works, what services may be included, what families should ask, how costs are calculated, and when home care may not be enough.',
    keywords: ['home care guide for families', 'home care services', 'in-home care questions'],
    intro:
      'Home care can make it possible for an older adult to stay home with more support, but the family has to define the care need before buying hours.',
    outcomeLine:
      'A home care plan works when services, schedule, backup coverage, communication, and cost are specific enough to match the actual risk.',
    faq: [
      faq('What services can home care provide?', 'Home care may include bathing, dressing, toileting, meals, light housekeeping, laundry, errands, transportation, companionship, medication reminders, supervision, dementia support, and caregiver respite.'),
      faq('When is home care not enough?', 'Home care may not be enough when the person needs frequent overnight supervision, unsafe dementia behaviors are increasing, care is near-continuous, transfers are unsafe for one caregiver, or family remains constantly on call.'),
      faq('Should families hire an agency or a private caregiver?', 'Agency care may offer screening, scheduling, payroll handling, supervision, and backup coverage. Private hiring may offer more control or lower hourly cost, but the family may own screening, payroll, taxes, liability, scheduling, and backup.'),
    ],
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/guides/questions-to-ask-home-care-agency/', label: 'Questions to Ask a Home Care Agency' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

Home care may help with:

- Bathing.
- Dressing.
- Toileting.
- Meals.
- Light housekeeping.
- Laundry.
- Errands.
- Transportation.
- Companionship.
- Medication reminders.
- Supervision.
- Dementia support.
- Respite for family caregivers.

NIA describes services for older adults at home as including personal care, household help, meals, transportation, and adult day care options depending on need. Family Caregiver Alliance also recommends assessing personal care, household care, health care, and emotional care before hiring help.

## Home Care May Work Well When

Home care may fit when:

- The home is reasonably safe.
- Care needs are part-time or predictable.
- Family can cover gaps.
- The person accepts help.
- Supervision needs are limited or covered.
- Transportation and meals can be handled.
- There is backup for missed shifts.

## Home Care May Not Be Enough When

Home care may become difficult when:

- The person needs frequent overnight supervision.
- Dementia creates wandering or unsafe behavior.
- Care needs become near-continuous.
- Transfers require more help than one caregiver can safely provide.
- The person refuses caregivers.
- Family caregivers remain constantly on call.
- Paid hours become more expensive than residential care.

## Cost Basics

CareScout's 2025 Cost of Care data lists the national median hourly rate for a non-medical caregiver at $35 per hour. At 44 hours per week over 52 weeks, that equals $80,080 annually.

This is why the number of weekly hours matters more than the hourly rate alone.

## Kefiw Tip: Calculate The Home Care Tipping Point

Compare:

- 10 hours per week.
- 20 hours per week.
- 40 hours per week.
- Overnight help.
- Seven-day support.
- Backup coverage.

Then compare that to assisted living or memory care. Home care may be affordable at 10 hours per week and unrealistic at 60 hours per week.

## Agency Vs. Private Caregiver

Agency care may offer:

- Screening.
- Scheduling.
- Backup coverage.
- Payroll handling.
- Supervision.
- Replacement caregiver options.

Private caregiver hiring may offer:

- More control.
- Potentially lower cost.
- More direct relationship.

But it may also require the family to handle screening, payroll, taxes, liability, scheduling, backup, and supervision. Family Caregiver Alliance notes that agencies may handle screening, payroll, taxes, and substitute workers, while private hiring leaves many employer responsibilities with the family.

## Questions To Ask

- What tasks are needed?
- How many hours per week?
- Is care needed overnight?
- What happens if the caregiver calls out?
- Can the caregiver help with transfers safely?
- Can the caregiver support dementia needs?
- Who updates the family?
- Are care notes provided?
- What tasks are outside scope?
- What would make home care no longer enough?

## Family Script

"We are not just buying hours. We need to know whether home care can reliably cover the actual risks: bathing, meals, medication, transportation, supervision, and backup."

## Red Flags

- No backup plan.
- No written care plan.
- Unclear caregiver screening.
- Unclear pricing.
- Caregivers are expected to do medical tasks outside scope.
- Family workload does not decrease.
- The person is still unsafe alone.
- Home care is added but no one updates the care plan.

## Checklist

- List care tasks.
- Estimate weekly hours.
- Choose agency or private caregiver approach.
- Ask about backup coverage.
- Ask about caregiver training.
- Confirm pricing and minimum shifts.
- Create emergency instructions.
- Track first two weeks carefully.
- Recalculate cost monthly.
- Reassess if care needs rise.

## Related Kefiw Tools

- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'home care professional or geriatric care manager',
      [SOURCE_NIA_HOME_SERVICES, SOURCE_CARESCOUT_COST_OF_CARE, SOURCE_FCA_HOME_HELP],
    ),
  }),
  newGuide({
    id: 'art-care-short-term-rehab-vs-long-term-care',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Senior Care Guides',
    slug: 'short-term-rehab-vs-long-term-care',
    title: 'Short-Term Rehab vs. Long-Term Care: What Families Need to Know | Kefiw',
    h1: 'Short-Term Rehab vs. Long-Term Care',
    description:
      'Understand the difference between short-term rehab and long-term care, including goals, Medicare coverage, custodial care, discharge planning, and family costs.',
    metaDescription:
      'Understand the difference between short-term rehab and long-term care, including goals, Medicare coverage, custodial care, discharge planning, and family costs.',
    keywords: ['short-term rehab vs long-term care', 'skilled nursing vs custodial care', 'rehab after hospitalization'],
    intro:
      'Families often hear "nursing facility" and assume one type of care. Short-term rehab and long-term care answer different questions.',
    outcomeLine:
      'Rehab asks whether the person can recover function; long-term care asks what ongoing support is needed for safety and dignity.',
    faq: [
      faq('What is short-term rehab?', 'Short-term rehab is usually focused on recovery after hospitalization, illness, surgery, or injury and may include therapy, skilled nursing, wound care, and discharge planning.'),
      faq('What is long-term care?', 'Long-term care is ongoing help with daily living, supervision, dementia support, mobility, meals, medication routines, and residential or home-based support when a person cannot safely manage alone.'),
      faq('Does Medicare pay for long-term care?', 'Medicare may cover skilled nursing facility care only for a limited time under specific conditions. Medicare does not pay indefinitely for long-term custodial care.'),
    ],
    primaryCta: { href: '/care/medicare-cost-calculator/', label: 'Estimate Medicare Costs' },
    relatedLinks: [
      { href: '/care/guides/nursing-home-cost-guide/', label: 'Nursing Home Cost Guide' },
      { href: '/care/nursing-home-cost-calculator/', label: 'Nursing Home Cost Calculator' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

Short-term rehab asks:

Can this person regain enough function to return home or move to a lower level of care?

Long-term care asks:

What ongoing support does this person need to live safely and with dignity?

## Short-Term Rehab May Include

- Physical therapy.
- Occupational therapy.
- Speech therapy.
- Skilled nursing.
- Wound care.
- Recovery after surgery, illness, fall, or hospitalization.
- Discharge planning.

## Long-Term Care May Include

- Bathing.
- Dressing.
- Toileting.
- Eating.
- Mobility help.
- Supervision.
- Dementia support.
- Medication support.
- Meals.
- Ongoing residential care.

## Medicare Issue

Medicare may cover skilled nursing facility care only under specific conditions and for a limited time. For covered skilled nursing facility care in 2026, Medicare lists $0 per day for days 1-20, $217 per day for days 21-100, and all costs after day 100 in a benefit period.

That does not mean Medicare pays indefinitely for long-term custodial care. Medicare also says most nursing home care is custodial care and that Original Medicare does not cover custodial care if it is the only care needed.

## What Families Often Miss

Rehab can reveal that long-term care is needed.

A family may expect:

"Mom will do rehab and go home."

But after two weeks, the team may say:

"She still needs help with transfers, toileting, medication, and supervision."

That is when the family needs a long-term care plan.

## Kefiw Tip: Ask For The Home Readiness Test

Before discharge from rehab, ask:

- Can they toilet safely?
- Can they transfer safely?
- Can they manage stairs?
- Can they prepare food?
- Can they take medications correctly?
- Can they be alone?
- What equipment is needed?
- How many caregiver hours are required?
- What would make home unsafe?

## Family Script

"We understand rehab is focused on recovery. We also need to know what support will still be required if recovery is incomplete."

## Red Flags

- Family assumes rehab means full recovery.
- No one explains coverage timeline.
- Discharge planning starts too late.
- Home is assumed safe without assessment.
- Caregiver availability is not considered.
- Therapy goals are unclear.
- The family does not know the private-pay rate.

## Checklist

- Clarify whether the stay is rehab or long-term care.
- Ask about therapy goals.
- Ask about expected discharge date.
- Ask about Medicare coverage.
- Ask about daily costs.
- Ask what help is still needed.
- Ask whether home is realistic.
- Estimate caregiver hours.
- Compare home care, assisted living, memory care, or nursing home options.

## Related Kefiw Tools

- [Nursing Home Cost Calculator](/care/nursing-home-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)`,
      'Medicare specialist, clinician, or discharge planner',
      [SOURCE_MEDICARE_2026_COSTS, SOURCE_MEDICARE_NURSING_HOME, SOURCE_MEDICARE_LTC, SOURCE_FCA_DISCHARGE],
    ),
  }),
];

export const CARE_SETTING_TRANSITION_GUIDE_OVERRIDES: Record<string, Partial<ContentPageConfig>> = {
  'art-care-what-is-long-term-care': {
    title: 'What Is Long-Term Care? A Family Guide to Daily Care, Costs, and Planning | Kefiw',
    h1: 'What Is Long-Term Care?',
    description:
      'Learn what long-term care means, what services it may include, who provides it, what families often misunderstand, and how to plan for costs.',
    metaDescription:
      'Learn what long-term care means, what services it may include, who provides it, what families often misunderstand, and how to plan for costs.',
    keywords: ['what is long-term care', 'long-term care guide', 'daily care costs planning'],
    intro:
      'Long-term care is not one place, one service, or one bill. It is ongoing support when daily life becomes hard or unsafe to manage alone.',
    outcomeLine:
      'Name the daily care, supervision, and safety needs before comparing home care, assisted living, memory care, nursing home care, or family support.',
    faq: [
      faq('What does long-term care mean?', 'Long-term care usually means ongoing support with daily living, safety, supervision, meals, mobility, memory support, transportation, or family caregiving, not just medical treatment.', 'definition'),
      faq('Where can long-term care happen?', 'Long-term care can happen at home, in a family home, through adult day care, in assisted living, in memory care, in a nursing home, or through a mixed plan using family and paid support.', 'definition'),
      faq('Does Medicare pay for long-term daily care?', 'Medicare says it does not pay for most long-term care services, including non-covered care in a nursing home or in the community. Families should verify coverage before assuming payment.'),
    ],
    primaryCta: { href: '/care/senior-care-cost-calculator/', label: 'Estimate Senior Care Cost' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/care-needs-checklist-guide/', label: 'Care Needs Checklist Guide' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

Long-term care usually means help with daily living, not just medical treatment.

It may include:

- Bathing.
- Dressing.
- Toileting.
- Eating.
- Walking.
- Transferring.
- Medication reminders.
- Meals.
- Transportation.
- Supervision.
- Memory support.
- Home safety.
- Care coordination.
- Emotional support.
- Family caregiving.

The National Institute on Aging describes long-term care as services that help people live as independently and safely as possible when they can no longer perform everyday activities on their own.

## The Kefiw Distinction: Care Vs. Medical Care

Families often confuse these two:

Medical care treats health conditions.

Examples: doctor visits, hospital care, physical therapy, wound care, medication prescribing.

Long-term care supports daily functioning and safety.

Examples: bathing, meals, supervision, toileting help, memory support, transportation, home care, facility care.

Some services overlap, but the payment rules may be very different.

That is why a family should ask:

"Is this medical care, daily living support, supervision, or a mix?"

## Where Long-Term Care Can Happen

Long-term care may happen in:

- The person's home.
- A family member's home.
- Adult day care.
- Assisted living.
- Memory care.
- Nursing home care.
- Continuing care communities.
- Short-term rehab after hospitalization.
- A mixed plan using family help and paid services.

## What Families Often Miss

Families often wait until long-term care looks like a crisis.

But long-term care often starts quietly:

- A daughter starts doing groceries.
- A spouse starts managing medications.
- A son starts driving to appointments.
- A sibling handles bills.
- Someone checks the stove every night.
- A caregiver starts sleeping lightly.

That is already care.

## Kefiw Tip: Name The Care Before You Price It

Before comparing costs, write down the type of care needed:

- Hands-on help.
- Supervision.
- Transportation.
- Medication support.
- Memory safety.
- Household support.
- Medical coordination.
- Overnight help.

If the family does not name the care correctly, they may choose the wrong setting or underestimate cost.

## Family Script

"Before we choose home care, assisted living, memory care, or nursing home care, let's write down what kind of help is actually needed every day and what risks are not covered."

## Red Flags

- The family says "just a little help" but one person is providing daily care.
- Supervision is not counted.
- Memory issues are treated as normal forgetfulness without safety review.
- The care plan depends on one unpaid caregiver.
- Costs are compared before needs are defined.
- Medicare is assumed to cover long-term daily care.

## Checklist

- List daily living needs.
- List safety risks.
- List supervision needs.
- List family caregiving hours.
- List paid care options.
- Estimate monthly cost.
- Identify what insurance may or may not cover.
- Create an escalation rule.
- Reassess after falls, hospitalizations, medication errors, wandering, or caregiver burnout.

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)`,
      'geriatric care manager, clinician, or senior care advisor',
      [SOURCE_NIA_LONG_TERM_CARE, SOURCE_NIA_ADVANCE_CARE_LTC, SOURCE_MEDICARE_LTC],
    ),
  },
  'art-care-when-time-for-senior-care': {
    title: 'When Is It Time for Senior Care? Signs Families Should Watch For | Kefiw',
    h1: 'When Is It Time for Senior Care?',
    description:
      'Learn the signs that an aging parent may need more help, including falls, missed medications, unsafe home conditions, memory changes, isolation, and caregiver strain.',
    metaDescription:
      'Learn the signs that an aging parent may need more help, including falls, missed medications, unsafe home conditions, memory changes, isolation, and caregiver strain.',
    keywords: ['when is it time for senior care', 'signs aging parent needs help', 'senior care warning signs'],
    intro:
      'Families rarely get one clear signal that senior care is needed. More often, there is a pattern of small failures that should trigger planning.',
    outcomeLine:
      'It may be time for more care when daily life, safety, health routines, memory, mobility, nutrition, or caregiver capacity are no longer reliable without support.',
    faq: [
      faq('What are signs a parent may need senior care?', 'Falls, missed medications, unsafe cooking, spoiled food, unpaid bills, isolation, memory changes, wandering, unsafe driving, poor hygiene, and caregiver exhaustion can all be planning signals.'),
      faq('Can someone be mostly independent and still need care?', 'Yes. Independence is not all-or-nothing. A person may manage some tasks well while needing support with medication, bathing, transportation, memory safety, meals, or supervision.'),
      faq('What is the Kefiw three-event rule?', 'If three concerning events happen in 30 to 60 days, reassess the care plan instead of explaining each event away separately.'),
    ],
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

It may be time for more senior care when daily life, safety, health routines, memory, mobility, nutrition, or caregiver capacity are no longer reliable without support.

## Signs Related To Safety

Watch for:

- Falls.
- Near-falls.
- Trouble getting up from chairs.
- Unsafe stairs.
- Poor lighting.
- Bathroom slips.
- Burns or unsafe cooking.
- Wandering.
- Getting lost.
- Unsafe driving.
- Leaving doors unlocked.
- Not using mobility aids.

## Signs Related To Health Routines

Watch for:

- Missed medications.
- Duplicate medications.
- Confusion about prescriptions.
- Missed appointments.
- Unexplained weight loss.
- Poor hydration.
- Untreated pain.
- Worsening chronic conditions.
- Frequent emergency visits.
- Recent hospitalization.

## Signs Related To Daily Living

Watch for:

- Difficulty bathing.
- Wearing the same clothes repeatedly.
- Laundry piling up.
- Spoiled food.
- Missed meals.
- Unpaid bills.
- House becoming unsafe or cluttered.
- Pet care slipping.
- Poor hygiene.
- Trouble toileting.

## Signs Related To Memory And Judgment

Watch for:

- Repeated questions.
- Getting lost in familiar places.
- New paranoia.
- Financial mistakes.
- Falling for scams.
- Leaving appliances on.
- Nighttime confusion.
- Calling family repeatedly in distress.
- Trouble following familiar routines.

## Signs Related To The Caregiver

Watch for:

- One person is always on call.
- The caregiver is sleeping poorly.
- The caregiver is missing work.
- The caregiver is resentful or numb.
- Family members argue about who helps.
- No one has backup coverage.
- The care plan fails if one person gets sick.

## What Families Often Miss

A parent can be "mostly independent" and still need care.

Independence is not all-or-nothing. A person may manage some tasks well and be unsafe with others.

The most important question is:

"Which specific tasks are failing?"

## Kefiw Tip: Use A Three-Event Rule

Do not wait for one dramatic crisis.

If three concerning events happen in 30-60 days, reassess the care plan.

Examples:

- Two falls and one missed medication.
- One wandering incident, one stove incident, one unpaid bill.
- One hospitalization, one caregiver breakdown, one missed appointment.

Patterns matter more than excuses.

## Family Script

"We are not saying everything is unsafe. We are saying a few things have changed, and we need to add support before the next problem becomes bigger."

## Red Flags

- Family explains away every event separately.
- A parent refuses help but cannot safely manage.
- The caregiver is the hidden safety net.
- Safety depends on luck.
- No one knows what would trigger a change.
- Care decisions are delayed because everyone fears the conversation.

## Checklist

- Write down recent incidents.
- Identify which daily tasks are failing.
- Estimate caregiver hours.
- Complete a care needs checklist.
- Check home safety.
- Review medications.
- Compare home care and facility options.
- Create an escalation rule.
- Choose one support to add this week.

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'geriatric care manager or clinician',
      [SOURCE_NIA_LONG_TERM_CARE, SOURCE_NIA_ADVANCE_CARE_LTC, SOURCE_FCA_HOME_HELP],
    ),
  },
  'art-care-aging-in-place-guide': {
    title: 'Aging in Place Guide: How to Help an Older Adult Stay Home Safely | Kefiw',
    h1: 'Aging in Place Guide',
    description:
      'Learn how to plan aging in place with home safety, personal care, transportation, meals, medication support, caregiver coverage, and cost planning.',
    metaDescription:
      'Learn how to plan aging in place with home safety, personal care, transportation, meals, medication support, caregiver coverage, and cost planning.',
    keywords: ['aging in place guide', 'help parent stay home safely', 'aging in place checklist'],
    intro:
      'Aging in place means staying at home as care needs change. It works only when the home, support system, budget, and caregiver capacity match the actual needs.',
    outcomeLine:
      'Aging in place is a care plan, not just a preference to stay home.',
    faq: [
      faq('What does aging in place require?', 'Aging in place may require home safety changes, personal care, meals, transportation, medication support, emergency planning, paid home care, family caregiving, and backup coverage.'),
      faq('When does aging in place become risky?', 'It becomes risky when falls repeat, medications are unreliable, wandering or nighttime confusion appears, home care hours rise quickly, or the family has no backup caregiver.'),
      faq('What should families price before choosing home?', 'Price the normal week and the backup plan: caregiver illness, missed shifts, overnight needs, falls, dementia progression, and the possibility that the person cannot be alone.'),
    ],
    primaryCta: { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Use Home Safety Checklist' },
    relatedLinks: [
      { href: '/care/home-care-cost-calculator/', label: 'Home Care Cost Calculator' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/emergency-planning-older-adult-living-alone/', label: 'Emergency Planning For Living Alone' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

Aging in place is not simply "staying home."

It is a care plan that may include:

- Home safety changes.
- Personal care support.
- Meal support.
- Transportation.
- Medication support.
- Social connection.
- Emergency planning.
- Family caregiving.
- Paid home care.
- Backup coverage.

NIA describes home-based care as health, personal, and other support services that help people stay at home and live as independently as possible.

## The Kefiw Aging-In-Place Test

Aging in place is more realistic when five things are true.

### 1. The Home Can Be Made Safer

Check:

- Stairs.
- Bathroom.
- Lighting.
- Rugs.
- Entryways.
- Kitchen safety.
- Bedroom-to-bathroom path.
- Emergency access.
- Space for walker or wheelchair.

### 2. The Person Can Call For Help

Check:

- Phone access.
- Emergency button.
- Wearable alert.
- Neighbor support.
- Backup contact.
- No-answer rule.

### 3. Care Tasks Are Covered

Check:

- Bathing.
- Dressing.
- Toileting.
- Meals.
- Medication.
- Transportation.
- Housekeeping.
- Supervision.
- Nighttime needs.

### 4. The Caregiver Can Sustain The Workload

Ask:

- Who is doing unpaid care?
- How many hours per week?
- What happens if that person gets sick?
- Is sleep protected?
- Is respite scheduled?

### 5. Costs Are Realistic

Include:

- Home care.
- Home modifications.
- Medical equipment.
- Transportation.
- Supplies.
- Meals.
- Emergency response systems.
- Backup care.
- Lost work time.

## What Families Often Miss

Aging in place can be the most comfortable option emotionally and the least stable option operationally.

The home may feel safe because it is familiar, but familiarity does not prevent falls, medication errors, wandering, loneliness, or caregiver burnout.

## Kefiw Tip: Price The Backup Plan, Not Just The Normal Week

Families often price home care as if every week goes smoothly.

Also estimate:

- What if the caregiver gets sick?
- What if home care cancels?
- What if care is needed overnight?
- What if there is a fall?
- What if dementia symptoms increase?
- What if the person cannot be alone?

A home plan without backup is fragile.

## Questions To Ask

- Can the person be alone safely?
- What hours of the day are riskiest?
- What help is needed with bathing or toileting?
- Is medication reliable?
- Is food reliable?
- Is transportation reliable?
- Is there nighttime risk?
- Who is the backup caregiver?
- What would make home no longer safe enough?

## Family Script

"Staying home is the goal if we can make it safe and sustainable. Let's list what support the home would need before we assume it can work."

## Red Flags

- The caregiver is the only backup.
- The person falls repeatedly.
- Medication is unreliable.
- The person wanders or gets lost.
- Nighttime care is unsafe.
- Home care hours are rising quickly.
- The family avoids discussing assisted living because it feels painful.
- The person says they are fine, but the home shows otherwise.

## Checklist

- Complete home safety review.
- Add bathroom safety supports.
- Improve lighting.
- Create medication system.
- Create meal plan.
- Create transportation plan.
- Add emergency contact sheet.
- Set no-answer rule.
- Estimate home care cost.
- Estimate caregiver hours.
- Create escalation rule.

## Related Kefiw Tools

- [Home Safety Checklist](/care/guides/home-safety-checklist-older-adults/)
- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)`,
      'occupational therapist, geriatric care manager, or clinician',
      [SOURCE_NIA_AGING_IN_PLACE, SOURCE_NIA_HOME_SERVICES, SOURCE_FCA_HOME_HELP],
    ),
  },
  'art-care-adult-day-care-guide': {
    title: 'Adult Day Care Guide: Costs, Services, Benefits, and Questions | Kefiw',
    h1: 'Adult Day Care Guide',
    description:
      'Learn how adult day care works, what services may be included, how it helps caregivers, what it may cost, and what families should ask before enrolling.',
    metaDescription:
      'Learn how adult day care works, what services may be included, how it helps caregivers, what it may cost, and what families should ask before enrolling.',
    keywords: ['adult day care guide', 'adult day care costs', 'adult day services questions'],
    intro:
      'Adult day care can provide structure, meals, activities, supervision, social connection, and predictable caregiver relief during the day.',
    outcomeLine:
      'Adult day care can be a middle option when daytime support is needed but 24-hour facility care is not.',
    faq: [
      faq('What is adult day care?', 'Adult day care is daytime support outside the home that may include supervision, meals, social activity, personal care support, and basic health services depending on the program.'),
      faq('How much does adult day care cost?', 'CareScout reported a 2025 national median adult day health care rate of $95 per day, or $24,700 annually based on five days per week. Local costs vary.'),
      faq('When is adult day care not enough?', 'It may not fit when the person needs overnight care, has severe behavior needs the program cannot support, lacks safe transportation, cannot tolerate the setting, or requires medical complexity beyond the program capacity.'),
    ],
    primaryCta: { href: '/care/caregiver-hours-calculator/', label: 'Calculate Caregiver Hours' },
    relatedLinks: [
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/respite-care-guide/', label: 'Respite Care Guide' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

Adult day care is daytime support outside the home.

It may be useful when someone:

- Needs supervision during work hours.
- Is lonely or isolated.
- Needs structured routine.
- Has mild to moderate memory issues.
- Needs caregiver relief.
- Benefits from meals, activities, and social engagement.
- Does not need 24-hour facility care.

NIA notes that adult day care centers may offer social activities, exercise, meals, personal care, and basic health care services.

## Cost Basics

CareScout reported a 2025 national median adult day health care rate of $95 per day, or $24,700 annually based on five days per week. CareScout also describes adult day health care as one of the more affordable long-term care options compared with many residential or high-hour home care plans.

## Adult Day Care May Fit When

It may work well when:

- The person can safely return home at night.
- The caregiver needs daytime relief.
- Transportation can be arranged.
- The person enjoys or tolerates group settings.
- The care need is predictable.
- The program can support mobility, toileting, or memory needs.

## Adult Day Care May Not Be Enough When

It may not fit when:

- The person needs overnight care.
- The person has severe behavior needs the program cannot support.
- Transportation is unsafe or unavailable.
- The person cannot tolerate the setting.
- The caregiver needs 24-hour relief.
- Medical complexity exceeds the program's capacity.

## What Families Often Miss

Adult day care is not only for the person receiving care.

It is also a caregiver support tool. It may allow the caregiver to work, sleep, attend appointments, run errands, or simply rest without worrying every minute.

## Kefiw Tip: Use Adult Day Care As A Transition Test

Adult day care can help families test:

- Does the person accept structured support?
- Does social activity improve mood?
- Does the caregiver function better with predictable relief?
- Are memory or behavior needs more significant than expected?
- Does daytime support reduce evening stress?

This can inform whether home care, assisted living, or memory care should be considered.

## Questions To Ask

- What services are provided?
- Is transportation available?
- Are meals included?
- Can the program support dementia?
- Can staff help with toileting?
- Can staff help with mobility?
- What happens if the person refuses to attend?
- What are the hours?
- What does it cost per day?
- Is financial assistance available?
- What happens in a medical emergency?

## Family Script

"This does not have to mean moving out of the home. Adult day care may give you daytime routine and give the caregiver a reliable break."

## Red Flags

- Transportation is unclear.
- Staff cannot support the person's care needs.
- The program cannot explain emergency procedures.
- Activities are not appropriate for the person's abilities.
- The person is distressed every visit and no adjustment plan exists.
- The caregiver still has no relief.
- Costs are unclear.

## Checklist

- Identify daytime supervision needs.
- Ask about transportation.
- Visit during program hours.
- Ask about meals.
- Ask about dementia support.
- Ask about mobility and toileting help.
- Ask about cost and funding options.
- Try a short schedule first.
- Track caregiver relief.
- Reassess after one month.

## Related Kefiw Tools

- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'adult day services professional or geriatric care manager',
      [SOURCE_NIA_HOME_SERVICES, SOURCE_CARESCOUT_COST_OF_CARE, SOURCE_CARESCOUT_DATA_TABLES],
    ),
  },
  'art-care-assisted-living-cost-guide': {
    title: 'Assisted Living Cost Guide: Monthly Rates, Care Fees, and Hidden Costs | Kefiw',
    h1: 'Assisted Living Cost Guide',
    description:
      'Learn what assisted living may cost, what is included, what costs extra, and how families can compare base rates, care levels, move-in fees, and monthly invoices.',
    metaDescription:
      'Learn what assisted living may cost, what is included, what costs extra, and how families can compare base rates, care levels, move-in fees, and monthly invoices.',
    keywords: ['assisted living cost guide', 'assisted living monthly rate', 'assisted living hidden costs'],
    intro:
      'Assisted living cost is rarely just the base monthly rate. The final bill may include care levels, medication support, supplies, transportation, laundry, and move-in fees.',
    outcomeLine:
      'The useful comparison is the projected full monthly bill for the loved one, not the brochure base rate.',
    faq: [
      faq('What is the national median assisted living cost?', 'CareScout 2025 data lists the national median assisted living community cost at $6,200 per month, or $74,400 annually. Local prices and fees vary.'),
      faq('What can cost extra in assisted living?', 'Common add-ons include bathing help, dressing help, toileting help, medication management, incontinence care, laundry, supplies, transportation, special diets, higher care levels, and memory care.'),
      faq('What should families ask before comparing communities?', 'Ask for the current fee schedule, a sample invoice, and a care-level explanation. Then ask what the monthly bill would be for someone with the specific care needs listed.'),
    ],
    primaryCta: { href: '/care/assisted-living-cost-calculator/', label: 'Estimate Assisted Living Cost' },
    relatedLinks: [
      { href: '/care/guides/questions-to-ask-assisted-living-community/', label: 'Questions to Ask Assisted Living' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

To estimate assisted living cost, compare:

- Base monthly rate.
- Care-level fees.
- Medication management.
- Move-in or community fee.
- Supplies.
- Transportation.
- Laundry.
- Incontinence support.
- Special diets.
- Rate increases.
- Memory care transition cost.
- Discharge or transfer costs.

CareScout's 2025 Cost of Care data lists the national median assisted living community cost at $6,200 per month, or $74,400 annually.

## What Is Usually In The Base Rate?

This varies, but may include:

- Apartment or room.
- Meals.
- Basic housekeeping.
- Utilities.
- Activities.
- Some transportation.
- General supervision.
- Common areas.

Do not assume. Ask for the written fee schedule.

## What May Cost Extra?

Common add-ons include:

- Bathing help.
- Dressing help.
- Toileting help.
- Mobility support.
- Medication management.
- Incontinence care.
- Escort to meals.
- Special diets.
- Laundry.
- Supplies.
- Transportation.
- Higher care level.
- Memory care.

## The Kefiw Invoice Test

Ask for three things:

- Current fee schedule.
- Sample invoice.
- Care-level explanation.

Then ask:

"What would this cost for someone with these exact needs?"

Bring the care needs list.

## What Families Often Miss

Families compare base rates and then feel blindsided by the real invoice.

A community with a lower base rate may be more expensive after care fees. A community with a higher base rate may include more services. The only useful comparison is the projected full monthly bill.

## Kefiw Tip: Ask For Increase Triggers

Ask:

"What are the three most common reasons a resident's bill increases after move-in?"

This reveals whether costs rise because of care needs, annual rate changes, medication support, incontinence, staffing, or memory care transition.

## Questions To Ask

- What is included in the base rate?
- What costs extra?
- How are care levels assessed?
- How often are care levels reassessed?
- What is the move-in fee?
- Are medication services extra?
- Are supplies extra?
- Are transportation and laundry extra?
- How often do rates increase?
- What would cause discharge or transfer?
- Can we see a sample invoice?

## Family Script

"We are not trying to compare brochure prices. We need the expected monthly bill for our loved one's actual care needs."

## Red Flags

- Only base rate is discussed.
- Care-level pricing is vague.
- Sample invoice is refused.
- Move-in fees appear late.
- Discharge rules are unclear.
- Medication fees are not explained.
- Verbal promises are not written.

## Checklist

- Ask for base rate.
- Ask for care fees.
- Ask for sample invoice.
- Ask about annual increases.
- Ask about move-in fee.
- Ask about medication support.
- Ask about supplies.
- Ask about transportation.
- Ask about discharge policy.
- Compare full monthly cost across communities.

## Related Kefiw Tools

- [Assisted Living Cost Calculator](/care/assisted-living-cost-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'senior care advisor or elder law attorney for contract-related sections',
      [SOURCE_CARESCOUT_COST_OF_CARE, SOURCE_CARESCOUT_DATA_TABLES, SOURCE_MEDICARE_LTC],
    ),
  },
  'art-care-memory-care-cost-guide': {
    title: 'Memory Care Cost Guide: Dementia Care Fees, Safety, and Family Planning | Kefiw',
    h1: 'Memory Care Cost Guide',
    description:
      'Learn what may drive memory care costs, what families should ask, what services may be included, and how to compare memory care with home supervision.',
    metaDescription:
      'Learn what may drive memory care costs, what families should ask, what services may be included, and how to compare memory care with home supervision.',
    keywords: ['memory care cost guide', 'dementia care fees', 'memory care vs home supervision'],
    intro:
      'Memory care often costs more than standard assisted living because dementia care may require supervision, structure, staff training, safety planning, behavior support, and secure environments.',
    outcomeLine:
      'The cost question is what dementia-related support is included and what still costs extra.',
    faq: [
      faq('Why does memory care often cost more?', 'Memory care may cost more because dementia care can require more supervision, structure, staff training, wandering prevention, behavior support, secure environments, and adapted activities.'),
      faq('What can increase memory care costs?', 'Costs may rise with wandering, exit-seeking, refusal of care, incontinence, nighttime confusion, fall risk, two-person transfers, aggression, distress behaviors, or medication complexity.'),
      faq('How should families compare memory care with home care?', 'Compare memory care with the real cost of home supervision, including paid hours, family supervision hours, overnight risk, safety devices, adult day care, respite, caregiver sleep loss, and emergency risk.'),
    ],
    primaryCta: { href: '/care/memory-care-cost-calculator/', label: 'Estimate Memory Care Cost' },
    relatedLinks: [
      { href: '/care/guides/dementia-wandering-safety/', label: 'Dementia Wandering Guide' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

Memory care cost may include:

- Room and board.
- Meals.
- Dementia-trained staff.
- Secure environment.
- Supervision.
- Behavior support.
- Medication support.
- Activities adapted for dementia.
- Wandering prevention.
- Personal care.
- Nighttime support.
- Higher care levels.

NIA notes that some assisted living facilities have special Alzheimer units with staff who check on and care for people with dementia.

## What May Drive Cost Higher?

Memory care costs may rise because of:

- Wandering.
- Exit-seeking.
- Frequent redirection.
- Refusal of care.
- Incontinence.
- Bathing resistance.
- Nighttime confusion.
- Fall risk.
- Two-person transfers.
- Aggression or distress behaviors.
- Medication complexity.

## What Families Often Miss

Families may compare memory care to assisted living without comparing supervision.

A standard assisted living community may look cheaper, but if it cannot safely support wandering, nighttime confusion, or behavior changes, it may not be the right setting.

Home care may also look cheaper until the person needs supervision many hours per day or overnight.

## Kefiw Tip: Compare Memory Care Vs. Home Supervision

Estimate:

- Home care hours.
- Family supervision hours.
- Overnight risk.
- Door alarms or safety devices.
- Adult day care.
- Respite.
- Caregiver sleep loss.
- Emergency risk.

Then compare with memory care.

The monthly bill is only one part of the decision. Safety and caregiver sustainability matter too.

## Questions To Ask

- What is the base memory care cost?
- What services are included?
- What costs extra?
- How are dementia care levels assessed?
- What happens if wandering increases?
- What happens if behavior changes?
- Is medication management included?
- What nighttime staffing exists?
- What would trigger discharge?
- Can we see a sample invoice?

## Family Script

"We need to understand not just the memory care price, but how the community supports wandering, confusion, refusal of care, nighttime needs, and family communication."

## Red Flags

- The community cannot explain dementia-specific fees.
- Wandering prevention is vague.
- Staff training is unclear.
- Medication support costs are not explained.
- Behavior-related discharge rules are unclear.
- The family is told not to worry about future needs.
- The activity calendar looks good but residents are not engaged.

## Checklist

- List dementia-related risks.
- Ask about memory care base cost.
- Ask about care-level fees.
- Ask about medication fees.
- Ask about nighttime support.
- Ask about wandering prevention.
- Ask about behavior support.
- Ask about discharge rules.
- Compare home supervision cost.
- Reassess after wandering, falls, hospitalization, or caregiver burnout.

## Related Kefiw Tools

- [Memory Care Cost Calculator](/care/memory-care-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)`,
      'dementia care specialist, clinician, or geriatric care manager',
      [SOURCE_NIA_ALZHEIMERS_CARE, SOURCE_MEDICARE_LTC],
    ),
  },
  'art-care-nursing-home-cost-guide': {
    title: 'Nursing Home Cost Guide: Private Pay, Medicare, Medicaid, and Care Costs | Kefiw',
    h1: 'Nursing Home Cost Guide',
    description:
      'Learn what nursing home care may cost, how skilled nursing differs from custodial care, what Medicare may cover, and what families should ask before admission.',
    metaDescription:
      'Learn what nursing home care may cost, how skilled nursing differs from custodial care, what Medicare may cover, and what families should ask before admission.',
    keywords: ['nursing home cost guide', 'nursing home private pay', 'Medicare nursing home cost'],
    intro:
      'Nursing home cost depends on the type of stay. A short-term skilled nursing stay after hospitalization is different from a long-term custodial nursing home stay.',
    outcomeLine:
      'Families need to separate skilled care, custodial care, Medicare timing, Medicaid relevance, and the private-pay rate before admission.',
    faq: [
      faq('What is the national median nursing home cost?', 'CareScout 2025 data lists national median nursing home costs at $315 per day for a semi-private room, or $114,975 annually, and $355 per day for a private room, or $129,575 annually.'),
      faq('What are Medicare skilled nursing facility costs in 2026?', 'For covered skilled nursing facility care in 2026, Medicare lists $0 per day for days 1-20, $217 per day for days 21-100, and all costs after day 100 in a benefit period.'),
      faq('What should families ask before nursing home admission?', 'Ask whether the stay is skilled or custodial, what Medicare coverage is expected, the private-pay rate, whether Medicaid is accepted, what services cost extra, and what happens when coverage changes.'),
    ],
    primaryCta: { href: '/care/nursing-home-cost-calculator/', label: 'Estimate Nursing Home Cost' },
    relatedLinks: [
      { href: '/care/medicare-cost-calculator/', label: 'Medicare Cost Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/short-term-rehab-vs-long-term-care/', label: 'Short-Term Rehab vs. Long-Term Care' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

To understand nursing home cost, ask:

- Is this short-term skilled care?
- Is this long-term custodial care?
- Is Medicare involved?
- Is Medicaid relevant?
- What is the private-pay rate?
- What services are included?
- What happens when coverage ends?

CareScout's 2025 data lists national median nursing home costs at $315 per day for a semi-private room, or $114,975 annually, and $355 per day for a private room, or $129,575 annually.

## Skilled Nursing Vs. Long-Term Custodial Care

Skilled nursing care may involve rehabilitation, nursing, or therapy after a qualifying medical event.

Custodial care means help with daily living, such as bathing, dressing, toileting, eating, and supervision.

This distinction matters because Medicare coverage is limited and rule-based. Medicare says most nursing home care is custodial care, and Original Medicare does not cover custodial care if it is the only care needed.

## Medicare Skilled Nursing Costs

For covered skilled nursing facility care in 2026, Medicare lists:

- Days 1-20: $0 per day.
- Days 21-100: $217 per day.
- Days 101 and beyond: the patient pays all costs.

Medicare's 2026 cost fact sheet lists these amounts for each benefit period.

## What Families Often Miss

A nursing home may start as a rehab stay and become a long-term care conversation.

Families should ask from day one:

"What happens if Medicare-covered skilled care ends and my loved one still cannot safely return home?"

## Kefiw Tip: Ask For The Coverage End Plan

Before admission, ask:

- What is the private-pay rate?
- Does the facility accept Medicaid?
- What happens if Medicaid is pending?
- What happens after skilled care ends?
- How will the family be notified?
- Who explains appeal rights?
- What discharge options exist?

## Questions To Ask

- Is this a skilled stay or custodial stay?
- What Medicare coverage is expected?
- What are the daily costs after coverage changes?
- What is the private-pay rate?
- Does the facility accept Medicaid?
- What services are included?
- What services cost extra?
- How are therapy goals tracked?
- What would make discharge unsafe?
- Who helps with discharge planning?

## Family Script

"We need to understand the cost path: what is covered now, what may change, what the private-pay rate is, and what happens if long-term care is needed."

## Red Flags

- No one explains when Medicare coverage may end.
- The family does not know the private-pay rate.
- Skilled care and custodial care are used interchangeably.
- Medicaid acceptance is unclear.
- Discharge planning starts too late.
- Family is told not to worry about costs until after admission.
- The care plan assumes home will work without checking caregiver capacity.

## Checklist

- Confirm skilled vs. custodial status.
- Ask about Medicare coverage.
- Ask about daily cost.
- Ask about private-pay rate.
- Ask about Medicaid acceptance.
- Ask about coverage notices.
- Ask about therapy goals.
- Ask about discharge plan.
- Build a long-term payment plan.
- Save all notices.

## Related Kefiw Tools

- [Nursing Home Cost Calculator](/care/nursing-home-cost-calculator/)
- [Medicare Cost Calculator](/care/medicare-cost-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'Medicare specialist, elder law attorney, or nursing home quality expert',
      [SOURCE_CARESCOUT_COST_OF_CARE, SOURCE_CARESCOUT_DATA_TABLES, SOURCE_MEDICARE_2026_COSTS, SOURCE_MEDICARE_NURSING_HOME],
    ),
  },
  'art-care-home-care-cost-guide': {
    title: 'Home Care Cost Guide: Hourly Rates, Weekly Hours, and Family Workload | Kefiw',
    h1: 'Home Care Cost Guide',
    description:
      'Learn how home care costs are calculated, what drives the total bill, how to compare agency and private care, and when home care may become more expensive than facility care.',
    metaDescription:
      'Learn how home care costs are calculated, what drives the total bill, how to compare agency and private care, and when home care may become more expensive than facility care.',
    keywords: ['home care cost guide', 'home care hourly rates', 'weekly home care cost'],
    intro:
      'Home care cost is driven by two numbers: hourly rate and number of hours. Families often focus on the hourly rate, but the weekly schedule usually decides affordability.',
    outcomeLine:
      'The real home care cost includes paid hours and the unpaid family hours that remain.',
    faq: [
      faq('What is the national median home care hourly rate?', 'CareScout 2025 data lists the national median hourly rate for non-medical caregiver services at $35 per hour, or $80,080 annually when assuming 44 hours per week over 52 weeks.'),
      faq('What drives home care cost?', 'Home care cost depends on the hourly rate, minimum shifts, days per week, weekends, holidays, overnight care, live-in care, agency vs. private caregiver, transportation, care complexity, backup coverage, and family caregiving hours.'),
      faq('Why should families price uncovered hours?', 'If paid home care covers 20 hours per week, 148 hours remain. Families need to know who is responsible for the hours not covered by paid care.'),
    ],
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/home-care-guide-for-families/', label: 'Home Care Guide for Families' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

Home care cost depends on:

- Hourly rate.
- Minimum shift length.
- Number of days per week.
- Weekend rates.
- Holiday rates.
- Overnight care.
- Live-in care.
- Agency vs. private caregiver.
- Transportation.
- Care complexity.
- Backup coverage.
- Family caregiving hours.

CareScout's 2025 data lists the national median hourly rate for non-medical caregiver services at $35 per hour, with annual cost of $80,080 when assuming 44 hours per week over 52 weeks.

## The Kefiw Home Care Cost Scenarios

Estimate several versions.

### Light Support

Examples: 6-10 hours per week.

Used for errands, meals, laundry, companionship, or bathing support.

### Moderate Support

Examples: 15-30 hours per week.

Used for regular personal care, transportation, meals, and caregiver relief.

### Heavy Support

Examples: 40 or more hours per week.

Used when the person needs daily help or cannot safely manage long periods alone.

### Overnight Or 24-Hour Support

Used when nighttime risk, dementia, falls, toileting, or supervision needs are high.

This is often where cost rises quickly.

## What Families Often Miss

Home care does not automatically remove family workload.

Even with paid care, family may still handle:

- Scheduling.
- Backup coverage.
- Doctor visits.
- Medication oversight.
- Bills.
- Supplies.
- Nighttime issues.
- Family communication.
- Emergencies.

So the real cost comparison should include paid hours and unpaid family hours.

## Kefiw Tip: Price The Uncovered Hours

If home care covers 20 hours per week, there are still 148 hours in the week.

Ask:

"Who is responsible for the hours not covered by paid care?"

This is especially important for dementia, fall risk, and nighttime care.

## Questions To Ask

- What is the hourly rate?
- What is the minimum shift?
- Are weekends or holidays more expensive?
- Is overnight care priced differently?
- What happens if a caregiver calls out?
- Are care notes included?
- Are transportation costs extra?
- What tasks are not allowed?
- How often can rates change?
- How many unpaid family hours remain?

## Family Script

"The hourly rate helps, but we need to estimate the full weekly schedule and the hours family still has to cover."

## Red Flags

- Family calculates cost using too few hours.
- No backup coverage is priced.
- Nighttime care is ignored.
- Dementia supervision is underestimated.
- The caregiver is still on call constantly.
- The agency's minimum shifts are not considered.
- Private caregiver payroll and tax questions are ignored.

## Checklist

- Estimate weekly care hours.
- Confirm hourly rate.
- Confirm minimum shift.
- Add weekend and holiday rates.
- Add transportation.
- Add supplies.
- Add backup care.
- Add family caregiving hours.
- Compare to assisted living or memory care when hours rise.
- Recalculate after major changes.

## Related Kefiw Tools

- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'home care professional, financial planner, or geriatric care manager',
      [SOURCE_CARESCOUT_COST_OF_CARE, SOURCE_CARESCOUT_DATA_TABLES, SOURCE_FCA_HOME_HELP],
    ),
  },
  'art-care-hospital-transition-guide': {
    slug: 'hospital-to-home-rehab-facility-transition',
    title: 'Hospital to Home, Rehab, or Facility: A Discharge Planning Guide for Families | Kefiw',
    h1: 'Hospital to Home, Rehab, or Facility Transition Guide',
    description:
      'Learn how families can prepare for hospital discharge, compare home, rehab, and facility options, ask better questions, and avoid unsafe transitions.',
    metaDescription:
      'Learn how families can prepare for hospital discharge, compare home, rehab, and facility options, ask better questions, and avoid unsafe transitions.',
    keywords: ['hospital to home rehab facility transition', 'hospital discharge planning family', 'senior care transition guide'],
    intro:
      'Hospital discharge can feel rushed. A loved one may be medically stable enough to leave the hospital but not strong, safe, or supported enough to return to normal life.',
    outcomeLine:
      'A discharge plan should answer where the person is going, who provides care, what changed, what is covered, and what happens if the plan fails.',
    faq: [
      faq('What should a hospital discharge plan include?', 'It should cover destination, care needs, medications, equipment, warning signs, follow-up appointments, coverage, family tasks, and what to do if the first plan fails.'),
      faq('What are common discharge paths?', 'Common paths are home, short-term rehab or skilled nursing facility, and long-term facility care when ongoing supervision or support is needed.'),
      faq('What should families ask before discharge?', 'Ask what changed medically, what medications changed, what equipment is needed, whether home health is ordered, what caregiver training is needed, what warning signs matter, who to call after hours, and what costs to expect.'),
    ],
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/home-care-cost-calculator/', label: 'Home Care Cost Calculator' },
      { href: '/care/nursing-home-cost-calculator/', label: 'Nursing Home Cost Calculator' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

A discharge plan should answer:

- Where is the person going?
- What care is needed?
- Who will provide it?
- What medications changed?
- What equipment is needed?
- What warning signs should trigger a call?
- What follow-up appointments are scheduled?
- What will insurance or Medicare cover?
- What will the family pay?
- What happens if the plan fails?

Family Caregiver Alliance says the transition after hospitalization, whether to home, short-term rehab, or a residential nursing facility, is critical to the health and well-being of the person receiving care.

## The Three Common Discharge Paths

### 1. Home

Home may work if:

- The person can move safely or has support.
- Medication changes are clear.
- Meals are covered.
- Bathroom needs are manageable.
- Home care or family support is ready.
- Follow-up appointments are scheduled.
- Equipment is delivered before arrival.

### 2. Short-Term Rehab Or Skilled Nursing Facility

Rehab may be considered when the person needs therapy, skilled nursing, or recovery support before returning home.

Ask about Medicare coverage, therapy goals, expected stay length, daily cost after coverage changes, and what happens if returning home is not realistic.

### 3. Long-Term Facility Care

Long-term care may become relevant if the person cannot safely return home, needs ongoing supervision, has increased dementia needs, or family caregiving is no longer sustainable.

## What Families Often Miss

A person can be discharged while the family is not ready.

Families should not leave the hospital without understanding:

- Medication changes.
- Follow-up appointments.
- Mobility limits.
- Fall risk.
- Diet instructions.
- Wound care.
- Equipment needs.
- Home health orders.
- Caregiver tasks.
- Warning signs.
- Who to call after hours.

Family Caregiver Alliance's discharge planning guide emphasizes that discharge planning should clarify the patient's condition and capabilities, review medications, and help families select a facility when discharge is to rehab or nursing care.

## Kefiw Tip: Ask The First Night Question

Before discharge, ask:

"What exactly needs to happen during the first night after discharge?"

This reveals gaps:

- Can they get to the bathroom?
- Who helps with medication?
- Is the walker there?
- Is oxygen set up?
- Is the caregiver trained?
- Is food available?
- Who answers questions at 10 p.m.?

If the first night is unsafe, the discharge plan is not ready.

## Questions To Ask Before Discharge

- What changed medically?
- What medications changed?
- What symptoms should make us call?
- Who do we call after hours?
- What equipment is needed?
- Has equipment been delivered?
- Is home health ordered?
- Does the caregiver need training?
- Can the person safely toilet, transfer, and eat?
- What follow-up appointments are scheduled?
- What costs should we expect?
- What happens if home does not work?

## Family Script

"We are not refusing discharge. We are asking for a safe discharge plan. We need to know what care is required, who will provide it, what equipment is needed, and what to do if the plan fails."

## Red Flags

- Medication changes are unclear.
- No one trains the caregiver.
- Equipment is not delivered.
- The family does not know warning signs.
- Follow-up appointments are not scheduled.
- The person cannot safely transfer or toilet.
- Home care is assumed but not arranged.
- The family is told to figure it out at home.
- Cost and coverage changes are not explained.

## Checklist

- Confirm destination.
- Confirm medication list.
- Confirm follow-up appointments.
- Confirm equipment.
- Confirm home care or facility placement.
- Confirm caregiver training.
- Confirm warning signs.
- Confirm after-hours number.
- Confirm coverage and cost.
- Prepare the first 72 hours.
- Reassess care needs after discharge.

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Nursing Home Cost Calculator](/care/nursing-home-cost-calculator/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'clinician, discharge planner, geriatric care manager, or Medicare specialist',
      [SOURCE_FCA_DISCHARGE, SOURCE_MEDICARE_2026_COSTS, SOURCE_MEDICARE_NURSING_HOME],
    ),
  },
  'art-care-needs-checklist-guide': {
    title: 'Care Needs Checklist: How to Assess Daily Support, Safety, and Family Workload | Kefiw',
    h1: 'Care Needs Checklist Guide',
    description:
      'Use this care needs checklist guide to assess daily living, mobility, memory, medication, safety, meals, transportation, supervision, and caregiver workload.',
    metaDescription:
      'Use this care needs checklist guide to assess daily living, mobility, memory, medication, safety, meals, transportation, supervision, and caregiver workload.',
    keywords: ['care needs checklist guide', 'senior care needs checklist', 'assess caregiver workload'],
    intro:
      'A care needs checklist helps families move from vague concern to specific planning.',
    outcomeLine:
      'The checklist should identify what is covered, what is fragile, what is unsafe, and who owns the next step.',
    faq: [
      faq('What should a care needs checklist include?', 'It should cover activities of daily living, household support, medication, health routines, mobility, falls, memory, judgment, supervision, family workload, and cost or coverage gaps.'),
      faq('How should families mark care needs?', 'Mark each need green if covered and stable, yellow if covered but fragile, and red if unsafe, uncovered, or unsustainable.'),
      faq('When should care needs be reassessed?', 'Reassess after falls, hospitalizations, medication mistakes, memory changes, wandering, caregiver burnout, or any major change in function or safety.'),
    ],
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withSettingFooter(
      `## Plain-English Summary

A care needs checklist should cover:

- Daily living.
- Mobility.
- Memory.
- Medication.
- Meals.
- Home safety.
- Transportation.
- Medical care.
- Emotional support.
- Supervision.
- Family workload.
- Cost and coverage gaps.

## The Kefiw Care Needs Categories

### 1. Activities Of Daily Living

Check:

- Bathing.
- Dressing.
- Toileting.
- Eating.
- Grooming.
- Walking.
- Transfers.

### 2. Household Support

Check:

- Meals.
- Groceries.
- Laundry.
- Cleaning.
- Trash.
- Home repairs.
- Pet care.

### 3. Medication And Health Routines

Check:

- Medication list.
- Pill setup.
- Missed doses.
- Doctor appointments.
- Lab follow-up.
- Medical equipment.
- New symptoms.

### 4. Mobility And Falls

Check:

- Falls.
- Near falls.
- Stairs.
- Walker or cane use.
- Bathroom safety.
- Getting in and out of bed.
- Getting in and out of car.

### 5. Memory And Judgment

Check:

- Getting lost.
- Repeated questions.
- Stove safety.
- Bills.
- Scams.
- Driving.
- Wandering.
- Nighttime confusion.

### 6. Supervision

Check:

- Can the person be alone?
- For how long?
- What time of day is riskiest?
- Is overnight supervision needed?
- Who covers the uncovered hours?

### 7. Family Workload

Check:

- Who is doing care now?
- How many hours?
- Who is backup?
- What is unsafe for family?
- What is causing burnout?

## What Families Often Miss

A checklist should not only describe needs. It should trigger decisions.

For each item, ask:

- Is this safe?
- Who owns it?
- How often does it happen?
- What happens if it is missed?
- Is paid help needed?
- Is this a sign the care setting should change?

## Kefiw Tip: Mark Each Need As Green, Yellow, Or Red

Green: covered and stable.

Yellow: covered but fragile.

Red: unsafe, uncovered, or unsustainable.

Example:

- Meals: yellow - daughter handles them, but only when she can visit.
- Medication: red - missed twice this week.
- Transportation: green - son owns appointments.
- Supervision: red - unsafe alone after dinner.

This turns a checklist into a care plan.

## Family Script

"Let's not debate care settings yet. First, let's mark which needs are covered, which are fragile, and which are unsafe."

## Red Flags

- Many needs are marked yellow but the family says things are fine.
- One caregiver covers most red items.
- Supervision is not counted.
- Memory risks are minimized.
- Medication mistakes are repeated.
- Falls happen without care plan changes.
- No one owns the next step.

## Checklist

- Complete ADL review.
- Complete medication review.
- Complete home safety review.
- Complete memory and judgment review.
- Complete transportation review.
- Complete supervision review.
- Complete caregiver workload review.
- Mark green, yellow, red.
- Assign owners.
- Choose one calculator or care track next.

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'geriatric care manager, clinician, or occupational therapist',
      [SOURCE_NIA_LONG_TERM_CARE, SOURCE_NIA_ADVANCE_CARE_LTC, SOURCE_FCA_HOME_HELP],
    ),
  },
};

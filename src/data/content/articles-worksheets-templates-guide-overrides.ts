import type { ContentPageConfig } from '../content-pages';

const SOURCE_CDC_CARE_PLAN =
  '[CDC: Steps for creating and maintaining a care plan](https://www.cdc.gov/caregiving/guidelines/index.html)';
const SOURCE_CDC_STEADI =
  '[CDC STEADI: Older adult fall prevention](https://www.cdc.gov/steadi/index.html)';
const SOURCE_FDA_MEDICATION_SAFETY =
  '[FDA: 5 medication safety tips for older adults](https://www.fda.gov/consumers/consumer-updates/5-medication-safety-tips-older-adults)';
const SOURCE_MEDICARE_COMPARE_OPTIONS =
  '[Medicare: Compare Original Medicare and Medicare Advantage](https://www.medicare.gov/index.php/what-medicare-covers/your-medicare-coverage-choices/consider-these-7-things-when-choosing-coverage?linkId=63549287)';
const SOURCE_MEDICARE_ADVANTAGE_TYPES =
  '[Medicare: Compare types of Medicare Advantage Plans](https://www.medicare.gov/health-drug-plans/health-plans/your-health-plan-options/compare)';
const SOURCE_MEDICARE_DRUG_RULES =
  '[Medicare: Drug plan rules](https://www.medicare.gov/health-drug-plans/part-d/what-plans-cover/plan-rules)';
const SOURCE_MEDICARE_PHARMACIES =
  '[Medicare: What pharmacies can I use?](https://www.medicare.gov/health-drug-plans/part-d/what-plans-cover/pharmacies)';
const SOURCE_ACL_LTC_BENEFITS =
  '[ACL: Receiving long-term care insurance benefits](https://acl.gov/ltc/costs-and-who-pays/what-is-long-term-care-insurance/receiving-long-term-care-insurance-benefits)';
const SOURCE_NIA_WORKSHEETS =
  '[NIH MedlinePlus Magazine: Caregiving worksheets from NIA](https://magazine.medlineplus.gov/article/caregiving-101-worksheets-resources-and-suggestions-from-the-national-institute-on-aging)';
const SOURCE_988_LIFELINE =
  '[988 Lifeline: Call, text, or chat](https://988lifeline.org/)';

const WORKSHEET_CATEGORY = 'Worksheets & Templates';

const sharedWorksheetDisclaimer = `## Kefiw Worksheet Disclaimer

Kefiw provides educational care-planning tools, worksheets, and guides. These materials are designed to help families organize information and prepare better questions. They do not replace medical, legal, financial, tax, insurance, employment, benefits, or professional care advice. Care needs, costs, coverage, provider quality, eligibility, and legal requirements vary by person, plan, provider, state, and situation. For urgent medical concerns or immediate danger, call emergency services.

## Continue Planning With Kefiw

- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
- [Run the Care Needs Checklist](/care/care-needs-checklist/)
- [Estimate senior care costs](/care/senior-care-cost-calculator/)
- [Calculate caregiver hours](/care/caregiver-hours-calculator/)
- [Build a family care budget](/care/family-care-budget-calculator/)
- [Review daily care routines](/care/guides/daily-care-routine-aging-parent/)
`;

function withWorksheetFooter(body: string, reviewer: string, sources: string[]): string {
  return `${body}

## Reusable Product Asset Uses

This worksheet should eventually support:

- Printable PDF.
- Saveable worksheet.
- Calculator result add-on.
- Care Track step.
- Family summary export.
- Email or share version.
- Bring-this-to-a-tour version when relevant.
- Use-before-a-family-meeting version when relevant.

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedWorksheetDisclaimer}`;
}

const faq = (q: string, a: string, faq_intent = 'how-to') => ({ q, a, faq_intent });

function worksheetGuide(config: {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  outcomeLine: string;
  primaryCta: { href: string; label: string };
  relatedLinks: { href: string; label: string }[];
  reviewer: string;
  sources: string[];
  body: string;
  faq?: Array<{ q: string; a: string; faq_intent?: string }>;
}): ContentPageConfig {
  return {
    id: `art-care-${config.slug}`,
    kind: 'guide',
    section: 'guides',
    guideCategory: WORKSHEET_CATEGORY,
    slug: config.slug,
    title: `${config.title} | Kefiw`,
    h1: config.h1,
    description: config.description,
    metaDescription: config.description,
    keywords: config.keywords,
    intro: config.intro,
    outcomeLine: config.outcomeLine,
    faq:
      config.faq ??
      [
        faq('How should families use this worksheet?', 'Use it before a care decision, appointment, tour, provider interview, or family conversation so the discussion starts with facts instead of memory and stress.'),
        faq('Is this worksheet professional advice?', 'No. It organizes information and prepares better questions, but medical, legal, financial, tax, insurance, benefits, employment, and care decisions should be confirmed with qualified professionals.'),
        faq('Should this be printed or saved?', 'Both can help. A printed copy is useful during tours or family meetings, while a saved copy helps the family update the plan after care needs, costs, or safety risks change.'),
      ],
    primaryCta: config.primaryCta,
    relatedLinks: config.relatedLinks,
    longformMarkdown: withWorksheetFooter(config.body, config.reviewer, config.sources),
  };
}

export const CARE_WORKSHEETS_TEMPLATES_NEW_GUIDES: ContentPageConfig[] = [
  worksheetGuide({
    slug: 'senior-care-decision-worksheet',
    title: 'Senior Care Decision Worksheet for Families',
    h1: 'Senior Care Decision Worksheet',
    description:
      'Use this senior care decision worksheet to compare safety, cost, care needs, family workload, and next steps before choosing home care, assisted living, memory care, or nursing home care.',
    keywords: ['senior care decision worksheet', 'senior care planning worksheet', 'care options comparison worksheet'],
    intro:
      'A senior care decision usually feels emotional because it is emotional. This worksheet gives the family a clearer way to compare options.',
    outcomeLine:
      'Use it to separate care needs, safety gaps, family workload, cost, and the next smallest decision before choosing a care setting.',
    primaryCta: { href: '/tracks/plan-senior-care/', label: 'Start Plan Senior Care' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
    ],
    reviewer: 'geriatric care manager, senior care advisor',
    sources: [SOURCE_CDC_CARE_PLAN, SOURCE_NIA_WORKSHEETS],
    body: `## When To Use This Worksheet

Use this when a family is deciding between:

- Staying home with family support.
- Adding paid home care.
- Trying adult day care.
- Moving to assisted living.
- Considering memory care.
- Considering nursing home care.
- Reassessing after a fall, hospitalization, or caregiver burnout.

## Section 1: Current Care Snapshot

| Question | Answer |
| --- | --- |
| Who needs care? | |
| Current living situation | |
| Primary caregiver | |
| Backup caregiver | |
| Main safety concern | |
| Main cost concern | |
| Main family conflict or worry | |
| Most recent triggering event | |

## Section 2: Care Needs

Mark each item:

- Green = covered and stable.
- Yellow = covered but fragile.
- Red = unsafe, uncovered, or unsustainable.

| Care need | Green | Yellow | Red | Notes |
| --- | --- | --- | --- | --- |
| Bathing | | | | |
| Dressing | | | | |
| Toileting | | | | |
| Meals | | | | |
| Medication | | | | |
| Transportation | | | | |
| Housekeeping | | | | |
| Mobility | | | | |
| Falls | | | | |
| Memory | | | | |
| Wandering | | | | |
| Nighttime safety | | | | |
| Supervision | | | | |
| Family caregiver capacity | | | | |

## Section 3: Option Comparison

| Option | Monthly cost | Family hours/week | Safety fit | Backup plan | Biggest risk |
| --- | --- | --- | --- | --- | --- |
| Stay home, family care | | | | | |
| Home care | | | | | |
| Adult day care | | | | | |
| Assisted living | | | | | |
| Memory care | | | | | |
| Nursing home | | | | | |

## Kefiw Tip

Do not choose the option with the lowest cost first. Choose the option that does not fail on safety, backup coverage, or caregiver sustainability.

A plan that is cheap but depends on one exhausted caregiver is not actually cheap.

## Family Discussion Prompt

"Let's compare these options by safety, cost, and workload, not by guilt, fear, or what we hoped would be true."

## Decision Rule

Write the family's care rule:

"If ______ happens, we will reassess the care plan."

Examples:

- If there are two falls in 30 days.
- If medication is missed twice in one week.
- If the caregiver sleeps fewer than five hours for three nights.
- If home care reaches 40 hours per week.
- If wandering occurs.
`,
  }),
  worksheetGuide({
    slug: 'care-needs-green-yellow-red-worksheet',
    title: 'Care Needs Worksheet: Green, Yellow, and Red Care Risks',
    h1: 'Care Needs Green / Yellow / Red Worksheet',
    description:
      'Use this care needs worksheet to identify which care tasks are stable, fragile, or unsafe before changing a care plan.',
    keywords: ['care needs worksheet', 'green yellow red care risks', 'senior care needs checklist'],
    intro:
      'Families often say things are mostly okay. This worksheet helps show whether each care task is stable, fragile, or unsafe.',
    outcomeLine:
      'Use the green, yellow, and red ratings to decide what to keep, where to add backup, and what needs near-term action.',
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
    ],
    reviewer: 'geriatric care manager, clinician',
    sources: [SOURCE_CDC_CARE_PLAN, SOURCE_NIA_WORKSHEETS],
    body: `## How To Use It

Use this rating system:

- Green: covered and stable.
- Yellow: covered, but only because someone is stretching.
- Red: unsafe, uncovered, or no longer sustainable.

## Worksheet

| Care area | Green | Yellow | Red | Who owns it? | Backup? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Bathing | | | | | | |
| Dressing | | | | | | |
| Toileting | | | | | | |
| Incontinence care | | | | | | |
| Meals | | | | | | |
| Hydration | | | | | | |
| Medication setup | | | | | | |
| Medication reminders | | | | | | |
| Doctor appointments | | | | | | |
| Transportation | | | | | | |
| Groceries | | | | | | |
| Laundry | | | | | | |
| Cleaning | | | | | | |
| Mobility | | | | | | |
| Transfers | | | | | | |
| Fall risk | | | | | | |
| Nighttime safety | | | | | | |
| Memory safety | | | | | | |
| Wandering risk | | | | | | |
| Bills and finances | | | | | | |
| Family communication | | | | | | |
| Caregiver sleep | | | | | | |
| Caregiver health | | | | | | |

## Kefiw Tip

Yellow items are the hidden danger zone.

Green is stable. Red is urgent. Yellow is where families get fooled.

A yellow task may look covered, but only because someone is quietly overfunctioning. Meals are yellow if one daughter cooks every day but is exhausted and has no backup.

## What To Do Next

If an item is green, keep the routine.

If an item is yellow, assign backup or add support.

If an item is red, choose a near-term action:

- Call a clinician.
- Add paid help.
- Change home setup.
- Reassign the task.
- Use a calculator.
- Start a care track.
- Reassess living situation.

## Family Script

"We do not need to label the whole situation as good or bad. Let's mark each care area so we can see where the plan is stable, fragile, or unsafe."
`,
  }),
  worksheetGuide({
    slug: 'assisted-living-tour-scorecard',
    title: 'Assisted Living Tour Scorecard',
    h1: 'Assisted Living Tour Scorecard',
    description:
      'Use this assisted living tour scorecard to compare communities by care fit, fees, staffing, safety, daily life, communication, and red flags.',
    keywords: ['assisted living tour scorecard', 'assisted living comparison sheet', 'assisted living checklist'],
    intro:
      'An assisted living tour can feel warm and reassuring, but families need to compare more than the lobby.',
    outcomeLine:
      'Use this scorecard to compare communities based on care fit, fees, staffing, medication support, discharge clarity, and real-life trust.',
    primaryCta: { href: '/care/assisted-living-cost-calculator/', label: 'Estimate Assisted Living Cost' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/questions-to-ask-assisted-living-community/', label: 'Questions to Ask Assisted Living' },
    ],
    reviewer: 'senior care advisor, elder law attorney for contract-related sections',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## How To Score

Use a 1-5 score.

| Score | Meaning |
| --- | --- |
| 1 | Major concern |
| 2 | Weak or unclear |
| 3 | Acceptable but needs follow-up |
| 4 | Strong |
| 5 | Excellent fit |

## Community Information

| Field | Notes |
| --- | --- |
| Community name | |
| Address | |
| Contact person | |
| Date toured | |
| Base monthly rate | |
| Estimated care fees | |
| Move-in/community fee | |
| Medication fee | |
| Total estimated monthly cost | |

## Scorecard

| Category | Score | Notes |
| --- | --- | --- |
| Care needs fit | | |
| Staff responsiveness | | |
| Medication support | | |
| Fall response | | |
| Nighttime coverage | | |
| Care-level pricing clarity | | |
| Sample invoice provided | | |
| Discharge policy clarity | | |
| Resident engagement | | |
| Meal experience | | |
| Cleanliness | | |
| Family communication | | |
| Transportation support | | |
| Memory care transition option | | |
| Contract transparency | | |
| Overall trust level | | |

## Questions To Answer After The Tour

- Did staff answer specific questions clearly?
- Did the community explain what care needs they cannot support?
- Did we see residents during normal daily life?
- Did the community provide a sample invoice?
- Did the verbal explanation match written materials?
- Did anything feel rushed, hidden, or overly polished?
- Would this community still fit if care needs increase?

## Kefiw Tip

Tour during a meal or late afternoon if possible. Communities reveal more during real routines than during a polished morning tour.

## Red Flag Notes

| Red flag | Details |
| --- | --- |
| Vague fees | |
| Pressure to sign | |
| Unclear discharge rules | |
| Staff seemed rushed | |
| Residents seemed unattended | |
| Medication support unclear | |
| Other | |

## Final Comparison Question

"Would we trust this community on a difficult day, not just on a good tour day?"
`,
  }),
  worksheetGuide({
    slug: 'nursing-home-visit-scorecard',
    title: 'Nursing Home Visit Scorecard',
    h1: 'Nursing Home Visit Scorecard',
    description:
      'Use this nursing home visit scorecard to compare staffing, communication, care planning, resident dignity, safety, Medicare/Medicaid, and discharge planning.',
    keywords: ['nursing home visit scorecard', 'nursing home comparison worksheet', 'nursing home checklist'],
    intro:
      'Nursing home decisions are often rushed, especially after a hospitalization. This scorecard helps families compare care quality, communication, safety, and fit.',
    outcomeLine:
      'Use it to document what you observe, what the facility says, and whether the care plan still makes sense after coverage or needs change.',
    primaryCta: { href: '/care/nursing-home-cost-calculator/', label: 'Estimate Nursing Home Cost' },
    relatedLinks: [
      { href: '/care/medicare-cost-planner/', label: 'Medicare Cost Planner' },
      { href: '/care/guides/questions-to-ask-a-nursing-home/', label: 'Questions to Ask Nursing Home' },
    ],
    reviewer: 'clinician, nursing home quality expert',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## Facility Information

| Field | Notes |
| --- | --- |
| Facility name | |
| Address | |
| Contact person | |
| Date visited | |
| Medicare-certified? | |
| Medicaid-certified? | |
| Short-term rehab? | |
| Long-term care? | |
| Private-pay rate | |
| Medicaid accepted? | |

## Scorecard

Use 1-5.

| Category | Score | Notes |
| --- | --- | --- |
| Cleanliness | | |
| Resident dignity | | |
| Staff communication | | |
| Staff appeared responsive | | |
| Call light response observed | | |
| Mealtime support | | |
| Fall prevention process | | |
| Pressure injury prevention | | |
| Medication communication | | |
| Care plan meeting process | | |
| Therapy communication, if rehab | | |
| Discharge planning | | |
| Family involvement | | |
| Dementia support | | |
| Medicare/Medicaid explanation | | |
| Overall trust level | | |

## Observe Quietly

During the visit, notice:

- Do staff speak respectfully?
- Are residents positioned comfortably?
- Are people left unattended in distress?
- Are meals supported?
- Are hallways clear?
- Are call lights answered?
- Does the environment feel calm or chaotic?
- Are family questions welcomed?

## Kefiw Tip

Ask the same question to two people:

"Who should our family call if we have a concern after admission?"

If the answers conflict, communication may be weak.

## Coverage And Cost Questions

| Question | Answer |
| --- | --- |
| What is covered now? | |
| What could change coverage? | |
| What is the daily private-pay rate? | |
| What happens if Medicare-covered care ends? | |
| Does the facility accept Medicaid? | |
| What happens if Medicaid is pending? | |

## Red Flag Notes

| Red flag | Details |
| --- | --- |
| Poor response to residents | |
| Strong odors | |
| Staff seemed dismissive | |
| No clear care plan process | |
| Family involvement discouraged | |
| Discharge plan unclear | |
| Coverage explanation unclear | |
| Other | |

## Final Comparison Question

"Would this facility communicate clearly if something changed at 9 p.m. on a weekend?"
`,
  }),
  worksheetGuide({
    slug: 'memory-care-evaluation-scorecard',
    title: 'Memory Care Evaluation Scorecard',
    h1: 'Memory Care Evaluation Scorecard',
    description:
      'Use this memory care evaluation scorecard to compare dementia training, wandering prevention, behavior support, routine, safety, costs, and family communication.',
    keywords: ['memory care evaluation scorecard', 'memory care comparison worksheet', 'dementia care scorecard'],
    intro:
      'Memory care should be evaluated differently from standard assisted living. A secure door is not enough.',
    outcomeLine:
      'Use this scorecard to compare dementia-specific communication, wandering prevention, behavior support, routine, dignity, and family involvement.',
    primaryCta: { href: '/care/memory-care-cost-calculator/', label: 'Estimate Memory Care Cost' },
    relatedLinks: [
      { href: '/care/guides/dementia-wandering-safety/', label: 'Dementia Wandering Guide' },
      { href: '/care/guides/memory-care-red-flags/', label: 'Memory Care Red Flags' },
    ],
    reviewer: 'dementia care specialist, clinician',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## Community Information

| Field | Notes |
| --- | --- |
| Community name | |
| Contact person | |
| Date toured | |
| Base memory care rate | |
| Estimated care-level fees | |
| Medication fee | |
| Total estimated monthly cost | |
| Discharge policy provided? | |

## Scorecard

Use 1-5.

| Category | Score | Notes |
| --- | --- | --- |
| Dementia-specific staff training | | |
| Staff communication style | | |
| Wandering prevention | | |
| Exit safety | | |
| Behavior support | | |
| Refusal-of-care approach | | |
| Sundowning support | | |
| Nighttime coverage | | |
| Medication support | | |
| Mealtime support | | |
| Activities matched to cognition | | |
| Calm environment | | |
| Outdoor safety | | |
| Family communication | | |
| Care plan process | | |
| Discharge policy clarity | | |
| Cost transparency | | |
| Overall trust level | | |

## Hard-Day Scenario Test

Ask the community:

"What happens if my loved one refuses a shower, says they need to go home, becomes angry, and tries to leave?"

Rate the answer:

| Element | Yes / No | Notes |
| --- | --- | --- |
| Calm response described | | |
| Non-drug strategies mentioned | | |
| Staff training explained | | |
| Family communication explained | | |
| Documentation explained | | |
| Discharge threshold explained | | |

## Kefiw Tip

Do not only ask whether wandering is prevented. Ask how the community reduces distress before someone tries to leave.

## Red Flag Notes

| Red flag | Details |
| --- | --- |
| Staff described residents as difficult | |
| Wandering plan vague | |
| Medication discussed as first response | |
| Activities not adapted | |
| No clear family updates | |
| Discharge rules vague | |
| Other | |

## Final Comparison Question

"Does this community understand dementia behavior as communication, or do they treat it as a problem to control?"
`,
  }),
  worksheetGuide({
    slug: 'home-care-agency-comparison-sheet',
    title: 'Home Care Agency Comparison Sheet',
    h1: 'Home Care Agency Comparison Sheet',
    description:
      'Compare home care agencies by hourly rate, minimum shifts, caregiver screening, backup coverage, supervision, care notes, dementia support, and family communication.',
    keywords: ['home care agency comparison sheet', 'home care agency worksheet', 'compare home care agencies'],
    intro:
      'Home care is not just about the hourly rate. Backup coverage, communication, supervision, and caregiver fit can change the real value.',
    outcomeLine:
      'Use this sheet to compare cost, reliability, scope, training, backup coverage, and the first two weeks of real performance.',
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/questions-to-ask-home-care-agency/', label: 'Questions to Ask Home Care Agency' },
    ],
    reviewer: 'home care professional, geriatric care manager',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## Agency Comparison

| Field | Agency A | Agency B | Agency C |
| --- | --- | --- | --- |
| Agency name | | | |
| Contact person | | | |
| Hourly rate | | | |
| Minimum shift | | | |
| Weekend rate | | | |
| Holiday rate | | | |
| Overnight rate | | | |
| Transportation fee | | | |
| Cancellation policy | | | |
| Backup caregiver policy | | | |
| Caregiver screening | | | |
| Training | | | |
| Dementia experience | | | |
| Transfer support | | | |
| Medication reminder policy | | | |
| Care notes provided? | | | |
| Supervisor check-ins | | | |
| After-hours contact | | | |
| Start date availability | | | |
| Overall confidence | | | |

## The Backup Coverage Test

Ask every agency:

"What happens if the scheduled caregiver calls out at 6 a.m.?"

Record the answer exactly.

| Agency | Backup answer | Confidence level |
| --- | --- | --- |
| A | | |
| B | | |
| C | | |

## Kefiw Tip

The best home care agency is not the one that promises the most. It is the one that explains its limits clearly.

Trust the agency that says:

"Here is what we can do, here is what we cannot do, and here is when you would need a higher level of care."

## First Two Weeks Review

After care begins, score:

| Question | Yes / No | Notes |
| --- | --- | --- |
| Caregiver arrives on time | | |
| Tasks are completed | | |
| Caregiver treats loved one respectfully | | |
| Agency responds quickly | | |
| Care notes are useful | | |
| Family workload decreases | | |
| Loved one accepts caregiver | | |
| Schedule is reliable | | |

## Red Flags

- No clear backup plan.
- No written care plan.
- No supervisor contact.
- Unclear rates.
- Caregiver scope is vague.
- Communication is poor before hiring.
- The agency cannot explain what happens if needs increase.
`,
  }),
  worksheetGuide({
    slug: 'private-caregiver-interview-worksheet',
    title: 'Private Caregiver Interview Worksheet',
    h1: 'Private Caregiver Interview Worksheet',
    description:
      'Use this private caregiver interview worksheet to compare experience, references, duties, schedule, pay, safety skills, documentation, and backup plans.',
    keywords: ['private caregiver interview worksheet', 'caregiver interview questions', 'hire private caregiver checklist'],
    intro:
      'Hiring a private caregiver can be personal and flexible, but it also requires structure. Define the job before interviewing anyone.',
    outcomeLine:
      'Use this worksheet to compare experience, safety judgment, duties, schedule, pay expectations, references, and documentation habits.',
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/questions-to-ask-private-caregiver/', label: 'Questions to Ask Private Caregiver' },
    ],
    reviewer: 'elder law attorney, employment/tax professional, geriatric care manager',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## Job Snapshot

| Field | Answer |
| --- | --- |
| Care recipient | |
| Care location | |
| Days needed | |
| Hours needed | |
| Main tasks | |
| Mobility needs | |
| Dementia needs | |
| Toileting/incontinence needs | |
| Transportation needed? | |
| Pets in home? | |
| Start date | |
| Budget | |

## Interview Questions: Experience

| Question | Notes |
| --- | --- |
| What caregiving experience do you have? | |
| Have you cared for someone with similar needs? | |
| Do you have dementia care experience? | |
| Are you comfortable with bathing and toileting support? | |
| Are you comfortable with transfers or mobility support? | |
| What tasks are you not comfortable doing? | |

## Interview Questions: Safety

| Question | Notes |
| --- | --- |
| What would you do after a fall? | |
| What would you do if the person refused care? | |
| What would you do if they seemed suddenly confused? | |
| What would you do if they became angry or afraid? | |
| Are you CPR or first-aid trained? | |
| Can you document care notes? | |

## Schedule And Backup

| Question | Notes |
| --- | --- |
| What days and hours are you available? | |
| Are you available on weekends? | |
| What happens if you are sick? | |
| How much notice do you need for changes? | |
| Do you have reliable transportation? | |

## Pay And Documentation

| Question | Notes |
| --- | --- |
| What is your rate? | |
| How do you expect to be paid? | |
| Are you willing to use a written agreement? | |
| How should mileage or expenses be handled? | |
| Are you willing to track hours and tasks? | |

## Reference Check

| Reference | Relationship | Phone/email | Notes |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## Kefiw Tip

Do not ask only whether the caregiver is nice. Ask whether the caregiver is reliable under stress.

A good caregiver should be able to explain what they do when someone falls, refuses care, becomes confused, or needs urgent help.

## Red Flags

- No references.
- Avoids written agreement.
- Vague experience.
- Overpromises medical tasks.
- No backup plan.
- Poor boundaries around money.
- Unwilling to document care.
- Family hires too quickly because they are desperate.
`,
  }),
  worksheetGuide({
    slug: 'medicare-plan-comparison-worksheet',
    title: 'Medicare Plan Comparison Worksheet',
    h1: 'Medicare Plan Comparison Worksheet',
    description:
      'Compare Medicare plans by doctors, hospitals, prescriptions, pharmacies, premiums, deductibles, out-of-pocket costs, prior authorization, and travel needs.',
    keywords: ['medicare plan comparison worksheet', 'compare Medicare plans worksheet', 'Medicare plan checklist'],
    intro:
      'Medicare plan comparison gets overwhelming when families compare everything at once. This worksheet uses must-haves first, then cost.',
    outcomeLine:
      'Use it to eliminate bad-fit plans before comparing premiums, drug costs, out-of-pocket exposure, network rules, and caregiver workload.',
    primaryCta: { href: '/care/medicare-cost-planner/', label: 'Use Medicare Cost Planner' },
    relatedLinks: [
      { href: '/care/part-d-estimate/', label: 'Part D Estimate' },
      { href: '/care/medicare-irmaa-calculator/', label: 'Medicare IRMAA Calculator' },
    ],
    reviewer: 'Medicare specialist, licensed insurance professional',
    sources: [
      SOURCE_MEDICARE_COMPARE_OPTIONS,
      SOURCE_MEDICARE_ADVANTAGE_TYPES,
      SOURCE_MEDICARE_DRUG_RULES,
      SOURCE_MEDICARE_PHARMACIES,
    ],
    body: `## Step 1: Must-Have List

| Must-have item | Details |
| --- | --- |
| Primary doctor | |
| Specialists | |
| Preferred hospital | |
| Prescriptions | |
| Pharmacy | |
| Travel needs | |
| Budget limit | |
| Caregiver manageability concerns | |

## Step 2: Plan Comparison

| Category | Plan A | Plan B | Plan C |
| --- | --- | --- | --- |
| Plan name | | | |
| Plan type | | | |
| Monthly premium | | | |
| Deductible | | | |
| Out-of-pocket maximum | | | |
| Primary doctor covered? | | | |
| Specialists covered? | | | |
| Preferred hospital covered? | | | |
| Prescriptions covered? | | | |
| Preferred pharmacy? | | | |
| Prior authorization concerns | | | |
| Referral requirements | | | |
| Travel coverage | | | |
| Estimated annual drug cost | | | |
| Estimated bad-year cost | | | |
| Caregiver paperwork burden | | | |
| Overall fit | | | |

## Step 3: Drug Check

| Drug | Dose | Plan A | Plan B | Plan C | Prior auth / step therapy? |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
| | | | | | |
| | | | | | |

## Kefiw Tip

Eliminate bad-fit plans before choosing the best plan.

A plan fails if:

- Key doctors are not covered.
- Important drugs are not covered.
- Hospital access is poor.
- Bad-year cost is unaffordable.
- Rules are too hard for the user or caregiver to manage.

## Family Script

"Let's not choose based on ads or premium alone. We need to verify doctors, prescriptions, hospitals, pharmacy, total cost, and plan rules."

## Red Flags

- Premium is the only comparison.
- Doctor network is assumed.
- Drug list is not checked.
- Pharmacy pricing is ignored.
- Travel needs are ignored.
- Prior authorization is not reviewed.
- Caregiver workload is ignored.
`,
  }),
  worksheetGuide({
    slug: 'long-term-care-insurance-policy-review-worksheet',
    title: 'Long-Term Care Insurance Policy Review Worksheet',
    h1: 'Long-Term Care Insurance Policy Review Worksheet',
    description:
      'Review a long-term care insurance policy by benefit trigger, elimination period, covered care settings, daily benefit, inflation protection, claims requirements, and uncovered gaps.',
    keywords: ['long-term care insurance policy review worksheet', 'LTC insurance worksheet', 'long-term care insurance claim checklist'],
    intro:
      'A long-term care insurance policy should be reviewed before the family builds a care plan around it.',
    outcomeLine:
      'Use this worksheet to clarify what the policy may pay, when benefits start, what settings are covered, and what gap remains.',
    primaryCta: { href: '/care/long-term-care-insurance-calculator/', label: 'Estimate LTC Insurance Gap' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
    ],
    reviewer: 'licensed insurance professional, elder law attorney for claim disputes',
    sources: [SOURCE_ACL_LTC_BENEFITS],
    body: `## Policy Snapshot

| Field | Answer |
| --- | --- |
| Insurance company | |
| Policy number | |
| Policyholder | |
| Claim contact | |
| Current benefit amount | |
| Daily/monthly benefit | |
| Lifetime maximum / pool | |
| Inflation protection | |
| Elimination period | |
| Reimbursement or cash benefit? | |
| Premium status | |

## Benefit Trigger Review

| Question | Answer |
| --- | --- |
| How many ADLs must require help? | |
| Does cognitive impairment qualify? | |
| Who certifies eligibility? | |
| Is a plan of care required? | |
| How often is reassessment required? | |

## Covered Setting Review

| Care setting | Covered? | Conditions / notes |
| --- | --- | --- |
| Home care | | |
| Assisted living | | |
| Memory care | | |
| Nursing home | | |
| Adult day care | | |
| Respite care | | |
| Family caregiver | | |

## Elimination Period Review

| Question | Answer |
| --- | --- |
| Number of days | |
| Calendar days or service days? | |
| Must paid care be received? | |
| Applies once or per claim? | |
| Who pays during waiting period? | |

## Uncovered Gap Estimate

| Item | Amount |
| --- | --- |
| Monthly care cost | |
| Monthly policy benefit | |
| Monthly family gap | |
| Estimated elimination-period cost | |
| Estimated benefit duration | |

## Kefiw Tip

Ask the insurer for the claim packet before care begins. This helps the family avoid hiring a provider who does not meet the policy's requirements.

## Red Flags

- Only brochure is available.
- Policy copy is missing.
- Elimination period is misunderstood.
- Provider requirements are unclear.
- Covered care settings are assumed.
- Benefit is far below local care cost.
- Invoices do not meet claim requirements.
`,
  }),
  worksheetGuide({
    slug: 'family-care-budget-worksheet',
    title: 'Family Care Budget Worksheet',
    h1: 'Family Care Budget Worksheet',
    description:
      'Build a family care budget that includes paid care, supplies, transportation, insurance, family contributions, unpaid caregiving hours, and emergency costs.',
    keywords: ['family care budget worksheet', 'senior care budget worksheet', 'caregiving cost worksheet'],
    intro:
      'A family care budget should make costs visible before resentment builds.',
    outcomeLine:
      'Use this worksheet to include paid costs, unpaid care, shared expenses, family contributions, and backup planning.',
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
    ],
    reviewer: 'financial planner, elder law attorney',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## Monthly Care Budget

| Category | Monthly cost | Who pays? | Notes |
| --- | --- | --- | --- |
| Rent / mortgage | | | |
| Assisted living / facility care | | | |
| Home care | | | |
| Adult day care | | | |
| Respite care | | | |
| Medication | | | |
| Medical copays | | | |
| Insurance premiums | | | |
| Transportation | | | |
| Groceries / meals | | | |
| Incontinence supplies | | | |
| Personal care supplies | | | |
| Home modifications | | | |
| Legal / financial help | | | |
| Emergency fund | | | |
| Other | | | |

## Income And Payment Sources

| Source | Monthly amount | Notes |
| --- | --- | --- |
| Social Security | | |
| Pension | | |
| Retirement withdrawals | | |
| Savings | | |
| Long-term care insurance | | |
| Medicaid | | |
| VA benefits | | |
| Family contributions | | |
| Other | | |

## Family Contribution Table

| Person | Money/month | Hours/week | Owned task | Backup role |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |
| | | | | |

## Unpaid Care Estimate

| Caregiver | Hours/week | Main tasks | Sustainability concern |
| --- | --- | --- | --- |
| | | | |
| | | | |
| | | | |

## Kefiw Tip

Add a caregiver support line to the budget.

That may include respite, transportation help, backup care, or home care for the hardest task. A budget that ignores caregiver relief is incomplete.

## Family Script

"This budget is not about blaming anyone. It is about seeing the real cost: money, time, and risk, so we can make a plan."

## Red Flags

- One person pays silently.
- One person provides unpaid care silently.
- Siblings debate cost without seeing numbers.
- No emergency fund exists.
- Medicare is assumed to cover long-term care.
- Family contributions are vague.
- No one tracks receipts.
`,
  }),
  worksheetGuide({
    slug: 'caregiver-hours-tracking-sheet',
    title: 'Caregiver Hours Tracking Sheet',
    h1: 'Caregiver Hours Tracking Sheet',
    description:
      'Track caregiving hours across personal care, meals, transportation, supervision, medication, appointments, household tasks, and emotional support.',
    keywords: ['caregiver hours tracking sheet', 'caregiving hours worksheet', 'caregiver time log'],
    intro:
      'Caregiving hours are often underestimated because families count only visible tasks.',
    outcomeLine:
      'Use this tracking sheet for two weeks to capture direct care, supervision, coordination, emotional support, and family workload.',
    primaryCta: { href: '/care/caregiver-hours-calculator/', label: 'Calculate Caregiver Hours' },
    relatedLinks: [
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/caregiver-stress-burnout-self-check/', label: 'Caregiver Stress Self-Check' },
    ],
    reviewer: 'caregiver support specialist, geriatric care manager',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## How To Use It

Track for two weeks.

Do not aim for perfection. Aim for honesty.

## Daily Tracking

| Date | Task | Time spent | Category | Notes |
| --- | --- | --- | --- | --- |
| | Personal care | | | |
| | Meals | | | |
| | Medication | | | |
| | Transportation | | | |
| | Appointments | | | |
| | Household | | | |
| | Supervision | | | |
| | Emotional support | | | |
| | Admin / paperwork | | | |
| | Family coordination | | | |

## Weekly Summary

| Category | Hours/week |
| --- | --- |
| Personal care | |
| Meals | |
| Medication | |
| Transportation | |
| Appointments | |
| Household tasks | |
| Supervision | |
| Emotional support | |
| Admin / paperwork | |
| Family coordination | |
| Total hours | |

## Sustainability Check

| Question | Answer |
| --- | --- |
| Which task takes the most time? | |
| Which task causes the most stress? | |
| Which task is unsafe for family? | |
| Which task could be delegated? | |
| Which task needs paid help? | |
| What happens if the main caregiver is unavailable? | |

## Kefiw Tip

Track supervision separately.

A caregiver may say, "I didn't do anything for three hours." But if the person could not safely be left alone, that time counts.

## Family Script

"We need to count the full care workload, including supervision, calls, paperwork, and emotional support, so we can divide it more fairly."

## Red Flags

- One caregiver exceeds 30-40 hours weekly without support.
- Supervision is not counted.
- Caregiver sleep is disrupted.
- Work hours are affected.
- No backup exists.
- Family members underestimate invisible work.
`,
  }),
  worksheetGuide({
    slug: 'caregiver-stress-burnout-self-check',
    title: 'Caregiver Stress and Burnout Self-Check',
    h1: 'Caregiver Stress and Burnout Self-Check',
    description:
      'Use this caregiver stress and burnout self-check to identify overload, sleep disruption, resentment, isolation, unsafe caregiving, and support needs.',
    keywords: ['caregiver stress self check', 'caregiver burnout worksheet', 'caregiver stress checklist'],
    intro:
      'This self-check is not a diagnosis. It is a signal tool for noticing when stress is becoming unsustainable.',
    outcomeLine:
      'Use it to identify overload, missing backup, sleep disruption, resentment, isolation, and unsafe caregiving pressure.',
    primaryCta: { href: '/logic/decision-fatigue/', label: 'Use Stress Check-In' },
    relatedLinks: [
      { href: '/tracks/mind-reset/', label: 'Mind Reset' },
      { href: '/tracks/sleep-reset/', label: 'Sleep Reset' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
    ],
    reviewer: 'therapist, clinician, caregiver support specialist',
    sources: [SOURCE_CDC_CARE_PLAN, SOURCE_988_LIFELINE],
    body: `## Rate Each Item

Use:

| Score | Meaning |
| --- | --- |
| 0 | Not true |
| 1 | Sometimes true |
| 2 | Often true |
| 3 | Very true |

## Self-Check

| Statement | Score |
| --- | --- |
| I feel exhausted most days. | |
| My sleep is disrupted by caregiving. | |
| I feel guilty when I rest. | |
| I feel resentful or angry more often. | |
| I am missing work or personal responsibilities. | |
| I am skipping my own health care. | |
| I feel like the care plan depends on me alone. | |
| I do not have reliable backup. | |
| I worry constantly about safety. | |
| I feel emotionally numb. | |
| I am making mistakes because I am tired. | |
| I feel isolated from friends or normal life. | |
| I feel pressure from family but not enough help. | |
| I cannot keep doing the current care plan. | |

## Score Reflection

This is not a clinical scale. Use the total as a conversation starter.

| Pattern | Suggested next step |
| --- | --- |
| Low but rising | Add one support before stress grows |
| Moderate | Track hours, ask for task ownership, add respite |
| High | Reassess care plan urgently; involve family or professionals |
| Unsafe thoughts or immediate danger | Contact emergency or crisis support immediately |

## Kefiw Tip

Burnout is not solved only by rest. Sometimes burnout means the care plan is too thin.

Ask:

"What support would make this care plan safer for both of us?"

## Support Planner

| Need | Possible support |
| --- | --- |
| Sleep | Overnight backup, call rule, respite |
| Time | Family task ownership, home care |
| Money | Family budget, benefits review |
| Safety | Care needs reassessment, home safety review |
| Emotion | Therapy, support group, Mind Reset |
| Backup | Local care team, emergency plan |

## Family Script

"This self-check shows the current care plan is affecting my health. I need us to change the plan, not just encourage me to be stronger."

## Red Flags

- You feel unsafe.
- You are having thoughts of self-harm.
- You are afraid you may harm someone else.
- You have not slept for multiple nights.
- You are making dangerous care mistakes.
- You feel unable to continue safely.

For immediate danger, call emergency services. For mental health crisis support in the U.S., call or text 988.
`,
  }),
  worksheetGuide({
    slug: 'medication-list-change-log-template',
    title: 'Medication List and Change Log Template for Caregivers',
    h1: 'Medication List and Change Log Template',
    description:
      'Use this medication list and change log to track prescriptions, over-the-counter medicines, supplements, allergies, prescribers, timing, and recent changes.',
    keywords: ['medication list template caregiver', 'medication change log', 'caregiver medication worksheet'],
    intro:
      'A medication list should be current, portable, and easy for a doctor, pharmacist, emergency responder, or backup caregiver to understand.',
    outcomeLine:
      'Use this template to track current medications, OTC products, supplements, allergies, medication changes, and refills.',
    primaryCta: { href: '/care/guides/medication-routine-safety/', label: 'Review Medication Routine Guide' },
    relatedLinks: [
      { href: '/care/guides/caregiver-emergency-binder/', label: 'Caregiver Emergency Binder' },
      { href: '/health/medical-triage/', label: 'Care Urgency Check' },
    ],
    reviewer: 'pharmacist, clinician',
    sources: [SOURCE_FDA_MEDICATION_SAFETY],
    body: `## Current Medication List

| Medication | Dose | Time | Reason | Prescriber | Pharmacy | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |
| | | | | | | |
| | | | | | | |

## Over-The-Counter Medicines And Supplements

| Item | Dose | Frequency | Reason | Notes |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |
| | | | | |

## Allergies And Reactions

| Allergy | Reaction | Severity / notes |
| --- | --- | --- |
| | | |
| | | |

## Medication Change Log

| Date | Medication | Change | Who changed it? | Why? | What to watch | Follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |
| | | | | | | |

## Refill Tracker

| Medication | Refill due | Pharmacy | Who owns refill? | Backup |
| --- | --- | --- | --- | --- |
| | | | | |
| | | | | |

## Kefiw Tip

Add a last verified date at the top of the list.

A medication list without a date can be dangerous because no one knows whether it is current.

## Questions To Ask At Appointments

- Is this list accurate?
- Are any medications duplicates?
- Are any no longer needed?
- Could any cause dizziness, confusion, sleepiness, constipation, or falls?
- Are there interactions with OTC medicines or supplements?
- Can refills be synchronized?
- Can timing be simplified?

## Red Flags

- More than one medication list exists.
- Old bottles are still in the home.
- No one tracks supplements.
- A new symptom appeared after a medication change.
- The caregiver is unsure whether a dose was taken.
- Refills run out unexpectedly.
`,
  }),
  worksheetGuide({
    slug: 'fall-near-fall-log',
    title: 'Fall and Near-Fall Log for Older Adults',
    h1: 'Fall and Near-Fall Log',
    description:
      'Track falls and near-falls with date, time, location, activity, symptoms, injuries, medication changes, and follow-up actions.',
    keywords: ['fall log older adults', 'near fall log', 'fall tracking sheet caregiver'],
    intro:
      'A fall log helps families and clinicians see patterns. A near-fall matters too.',
    outcomeLine:
      'Use it to record where falls happen, what changed, whether injury occurred, who was notified, and what the follow-up action is.',
    primaryCta: { href: '/health/medical-triage/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Home Safety Checklist' },
      { href: '/care/guides/what-to-do-after-a-fall/', label: 'What to Do After a Fall' },
    ],
    reviewer: 'clinician, physical therapist, occupational therapist',
    sources: [SOURCE_CDC_STEADI],
    body: `## Fall / Near-Fall Entry

| Field | Notes |
| --- | --- |
| Date and time | |
| Fall or near-fall? | |
| Location | |
| What was happening? | |
| Footwear | |
| Lighting | |
| Assistive device used? | |
| Dizziness? | |
| Pain? | |
| Confusion? | |
| Medication change recently? | |
| Injury? | |
| Hit head? | |
| Emergency help called? | |
| Clinician notified? | |
| Follow-up action | |

## Pattern Review

After each month, ask:

| Question | Answer |
| --- | --- |
| Same time of day? | |
| Same location? | |
| Same activity? | |
| Medication connection? | |
| Bathroom connection? | |
| Nighttime connection? | |
| Footwear or lighting issue? | |
| Care plan change needed? | |

## Kefiw Tip

Track near-falls as seriously as falls.

A person grabbing the wall three times in one week is not "nothing happened." It is a warning.

## Family Script

"We are not tracking falls to blame anyone. We are tracking them to find patterns and prevent the next one."

## Red Flags

- Falls repeat.
- Falls are hidden.
- Head injury occurs.
- Confusion follows a fall.
- The person is on blood thinners or has high injury risk.
- Bathroom falls occur.
- Nighttime falls occur.
- Caregiver cannot safely help after a fall.
`,
  }),
  worksheetGuide({
    slug: 'daily-care-log-template',
    title: 'Daily Care Log Template for Family Caregivers',
    h1: 'Daily Care Log Template',
    description:
      'Use this daily care log to track meals, medication, mood, mobility, bathroom patterns, safety issues, appointments, and caregiver notes.',
    keywords: ['daily care log template', 'caregiver daily log', 'family caregiver notes template'],
    intro:
      'A daily care log should take three minutes, not thirty. The goal is to capture changes, not write a diary.',
    outcomeLine:
      'Use this template to track meals, fluids, medication, mood, bathroom notes, mobility, safety, appointments, and follow-up.',
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/guides/caregiver-daily-check-in-log/', label: 'Caregiver Daily Check-In Guide' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
    ],
    reviewer: 'geriatric care manager, clinician',
    sources: [SOURCE_CDC_CARE_PLAN],
    body: `## Daily Log

| Field | Notes |
| --- | --- |
| Date | |
| Caregiver | |
| Time covered | |
| Meals | |
| Fluids | |
| Medication taken? | |
| Mood | |
| Confusion or behavior changes | |
| Pain or discomfort | |
| Bathroom notes | |
| Mobility notes | |
| Falls or near-falls | |
| Appointments | |
| What went well | |
| What needs follow-up | |
| Who was notified | |

## Weekly Summary

| Category | Pattern noticed |
| --- | --- |
| Meals | |
| Medication | |
| Mood | |
| Memory | |
| Mobility | |
| Bathroom | |
| Sleep | |
| Safety | |
| Caregiver workload | |
| Next step | |

## Kefiw Tip

Track exceptions, not everything.

Useful:

"Refused dinner. More confused after 5 p.m. Nearly fell in bathroom."

Less useful:

"Had an okay day."

## Family Update Template

"This week: medication reliable, meals inconsistent, two near-falls in bathroom, worse confusion after dinner, caregiver stress high. Suggested next step: bathroom safety review and evening support."

## Red Flags

- Medication uncertainty repeats.
- Meals are missed.
- Falls or near-falls appear.
- Confusion increases.
- Bathroom issues worsen.
- Family receives updates only after emergencies.
- Log is too detailed and caregivers stop using it.
`,
  }),
  worksheetGuide({
    slug: 'family-care-meeting-agenda-template',
    title: 'Family Care Meeting Agenda Template',
    h1: 'Family Care Meeting Agenda and Notes Template',
    description:
      'Use this family care meeting agenda to discuss senior care needs, costs, caregiver workload, task ownership, risks, decisions, and next steps.',
    keywords: ['family care meeting agenda template', 'caregiving family meeting worksheet', 'senior care family agenda'],
    intro:
      'Family care meetings go better when they have a structure. Without an agenda, the conversation can become vague promises or old resentment.',
    outcomeLine:
      'Use this agenda to keep the meeting focused on what changed, what is unsafe, what is unsustainable, who owns tasks, and when to review.',
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/guides/talk-to-siblings-sharing-care-costs/', label: 'Talk to Siblings About Costs' },
    ],
    reviewer: 'caregiver support specialist, therapist, geriatric care manager',
    sources: [SOURCE_CDC_CARE_PLAN, SOURCE_NIA_WORKSHEETS],
    body: `## Meeting Goal

Write the purpose:

"The goal of this meeting is to decide what support is needed next and who owns each task."

## Agenda

| Time | Topic | Notes |
| --- | --- | --- |
| 5 min | What changed? | |
| 10 min | Current care needs | |
| 10 min | Safety concerns | |
| 10 min | Caregiver workload | |
| 10 min | Costs and budget | |
| 10 min | Options | |
| 10 min | Task ownership | |
| 5 min | Next steps and review date | |

## Current Facts

| Item | Notes |
| --- | --- |
| Recent incidents | |
| Care needs | |
| Current caregiver hours | |
| Current monthly cost | |
| Insurance / Medicare / Medicaid questions | |
| Biggest safety risk | |
| Biggest caregiver risk | |

## Task Ownership Table

| Task | Owner | Backup | Due date / rhythm |
| --- | --- | --- | --- |
| Medication refills | | | |
| Appointments | | | |
| Transportation | | | |
| Groceries / meals | | | |
| Bills | | | |
| Facility or agency calls | | | |
| Family updates | | | |
| Respite | | | |

## Decision Log

| Decision | Owner | Deadline | Follow-up |
| --- | --- | --- | --- |
| | | | |
| | | | |

## Kefiw Tip

End every family meeting with three things:

- Who owns what.
- What happens next.
- When the plan will be reviewed.

Without those, the meeting was only a conversation.

## Family Script

"Let's focus on the current care plan, not every old family issue. We need to decide what is unsafe, what is unsustainable, and who owns the next steps."

## Red Flags

- The meeting ends with vague promises.
- One person is assigned everything.
- No backup is assigned.
- Money is discussed without numbers.
- Caregiver hours are dismissed.
- The parent's needs are discussed without their preferences when they can participate.
- No review date is set.
`,
  }),
];

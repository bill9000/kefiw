import type { ContentPageConfig } from '../content-pages';

const SOURCE_AARP_ASSISTED_LIVING_CHECKLIST =
  '[AARP: Assisted Living Checklist](https://assets.aarp.org/www.aarp.org_/articles/learn/sidebars/3-checklist.htm)';
const SOURCE_AARP_ASSISTED_LIVING =
  '[AARP: Assisted Living - What Caregivers Need to Know](https://www.aarp.org/caregiving/basics/assisted-living-options/)';
const SOURCE_MEDICARE_NURSING_HOME_CHECKLIST =
  '[Medicare: Nursing Home Checklist](https://www.medicare.gov/publications/12130nursing-home-checklist508.pdf?linkit_matcher=1)';
const SOURCE_MEDICARE_CARE_COMPARE =
  '[Medicare: Care Compare](https://www.medicare.gov/care-compare/)';
const SOURCE_CMS_NURSING_HOME_RIGHTS =
  '[CMS: Nursing Home Residents Rights and Quality of Care](https://www.cms.gov/about-cms/what-we-do/nursing-homes/patients-caregivers/rights-quality-care)';
const SOURCE_ACL_OMBUDSMAN =
  '[ACL: Long-Term Care Ombudsman Program](https://acl.gov/programs/Protecting-Rights-and-Preventing-Abuse/Long-term-Care-Ombudsman-Program)';
const SOURCE_ALZ_CHOOSING_CARE =
  "[Alzheimer's Association: Choosing Care Providers](https://www.alz.org/Help-Support/Caregiving/Care-Options/Choosing-Care-Providers)";
const SOURCE_ALZ_COMMUNICATION =
  "[Alzheimer's Association: Communication](https://www.alz.org/Help-Support/Caregiving/Daily-Care/Communications)";
const SOURCE_ALZ_WANDERING =
  "[Alzheimer's Association: Wandering and Dementia](https://www.alz.org/help-support/caregiving/safety/wandering)";
const SOURCE_NIA_CAREGIVER_WORKSHEETS =
  '[NIH MedlinePlus Magazine: Caregiving Worksheets from NIA](https://magazine.medlineplus.gov/article/caregiving-101-worksheets-resources-and-suggestions-from-the-national-institute-on-aging)';
const SOURCE_FCA_HIRING_HOME_HELP =
  '[Family Caregiver Alliance: Hiring In-Home Help](https://www.biav.net/wp-content/uploads/2022/02/CA-09-Hiring-In-Home-Help-Fam-Caregiver-Alliance-2018.1002.pdf)';
const SOURCE_IRS_HOUSEHOLD_EMPLOYER =
  '[IRS Publication 926: Household Employer Tax Guide](https://www.irs.gov/publications/p926)';
const SOURCE_IRS_FAMILY_CAREGIVERS =
  '[IRS: Family Caregivers and Self-Employment Tax](https://www.irs.gov/businesses/small-businesses-self-employed/family-caregivers-and-self-employment-tax)';
const SOURCE_DOL_DIRECT_CARE =
  '[U.S. Department of Labor: Domestic Service Final Rule FAQs](https://www.dol.gov/agencies/whd/direct-care/faq?lang=en)';
const SOURCE_MEDICARE_MARKETING_RULES =
  '[Medicare: Plan Marketing Rules](https://www.medicare.gov/health-drug-plans/health-plans/your-coverage-options/plan-marketing-rules)';
const SOURCE_CMS_AGENT_COMPENSATION =
  '[CMS: Agent Broker Compensation](https://www.cms.gov/medicare/health-drug-plans/managed-care-marketing/medicare-marketing-guidelines/agent-broker-compensation)';
const SOURCE_MEDICARE_FRAUD =
  '[Medicare: Reporting Medicare Fraud and Abuse](https://www.medicare.gov/fraud?linkId=120718754)';
const SOURCE_ACL_LTC_INSURANCE =
  '[ACL: Receiving Long-Term Care Insurance Benefits](https://acl.gov/ltc/costs-and-who-pays/what-is-long-term-care-insurance/receiving-long-term-care-insurance-benefits)';
const SOURCE_MEDICARE_LTC =
  '[Medicare: Long-Term Care Coverage](https://www.medicare.gov/coverage/long-term-care)';
const SOURCE_MEDICARE_COMPARE_OPTIONS =
  '[Medicare: Compare Original Medicare and Medicare Advantage](https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage)';
const SOURCE_NIA_TALKING_WITH_DOCTOR =
  '[NIA: Talking With Your Doctor](https://order.nia.nih.gov/sites/default/files/2021-06/talking-with-your-doctor.pdf)';
const SOURCE_MEDLINEPLUS_EMERGENCY =
  '[MedlinePlus: Recognizing Medical Emergencies](https://medlineplus.gov/ency/article/001927.htm)';

const sharedChecklistDisclaimer = `## Kefiw Checklist And Script Disclaimer

Kefiw provides educational care-planning tools and guides. This content does not replace medical, legal, financial, tax, insurance, employment, or professional care advice. Care needs, coverage rules, resident rights, facility policies, licensing, employment rules, and insurance details vary by person, provider, plan, state, and year. For urgent medical concerns or immediate danger, call emergency services.

## Continue Planning With Kefiw

- [Run the Care Needs Checklist](/care/care-needs-checklist/)
- [Estimate senior care cost](/care/senior-care-cost-calculator/)
- [Calculate caregiver hours](/care/caregiver-hours-calculator/)
- [Build a family care budget](/care/family-care-budget-calculator/)
- [Use Mind Reset before a hard conversation](/care/mind-reset/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withChecklistFooter(body: string, reviewer: string, sources: string[]): string {
  return `${body}

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedChecklistDisclaimer}`;
}

export const CARE_CHECKLISTS_SCRIPTS_GUIDE_OVERRIDES: Record<string, Partial<ContentPageConfig>> = {
  'art-care-questions-assisted-living': {
    slug: 'questions-to-ask-assisted-living-community',
    title: 'Questions to Ask an Assisted Living Community Before You Choose | Kefiw',
    h1: 'Questions to Ask an Assisted Living Community',
    description:
      'Use these assisted living questions to compare care levels, fees, medication support, staffing, discharge rules, and family communication.',
    metaDescription:
      'Use these assisted living questions to compare care levels, fees, medication support, staffing, discharge rules, and family communication.',
    primaryCta: { href: '/care/assisted-living-cost-calculator/', label: 'Estimate Assisted Living Cost' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/assisted-living-red-flags/', label: 'Assisted Living Red Flags' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Why These Questions Matter

An assisted living tour can be warm, polished, and reassuring. That is useful, but it is not enough.

The real test is not whether the lobby looks nice. The real test is whether the community can support your loved one on a hard day: after a fall, during confusion, when care needs increase, when medication changes, or when the family has a concern.

AARP's assisted living checklist emphasizes reviewing fees, services, admission and discharge policies, care plans, billing, and what happens if needs or finances change.

## The Kefiw Approach

Do not ask only:

"Is this a good community?"

Ask:

"What happens when care gets harder?"

That question reveals more than amenities.

## Questions About Care Fit

Ask:

- Based on our loved one's needs, what care level would you assign?
- What needs can you support well?
- What needs can you not support?
- What happens if my loved one needs help transferring?
- What happens if they need help overnight?
- What happens after a fall?
- What happens if memory issues increase?
- Do you have memory care on-site?
- What situations would require a move-out or transfer?

Kefiw tip: Bring a written care needs list. Do not describe your loved one as "mostly independent." Say what actually happens: missed meds, falls, bathing help, nighttime confusion, incontinence, unsafe cooking, or loneliness.

## Questions About Cost

Ask:

- What is the base monthly rate?
- What is included in the base rate?
- What costs extra?
- How are care levels priced?
- How often are residents reassessed?
- What are the most common reasons a monthly bill increases?
- Is medication management extra?
- Are incontinence supplies extra?
- Are transportation, laundry, special diets, or activities extra?
- Is there a move-in fee or community fee?
- Can we see a sample invoice?

Kefiw tip: Ask for a sample invoice for a resident with similar needs. A rate sheet shows pricing theory. An invoice shows billing reality.

## Questions About Medication Support

Ask:

- Who manages medications?
- Are staff trained to assist with medications?
- How are missed doses handled?
- How are medication changes communicated to family?
- What happens if a resident refuses medication?
- Is there a medication management fee?
- Does the community coordinate with pharmacies?

## Questions About Staffing

Ask:

- How is staffing different during the day, evening, and overnight?
- Who responds when a resident presses a call button?
- How do you handle call-button response times?
- Do residents usually have consistent staff?
- What training do staff receive for dementia, falls, transfers, and difficult behaviors?
- How do you cover staff callouts?

## Questions About Daily Life

Ask:

- What does a normal weekday look like?
- What does a weekend look like?
- Can we visit during a meal?
- How do you help residents who isolate?
- How do you handle special diets?
- How do residents get to appointments?
- Can residents choose their own doctors, therapists, or pharmacies?

## Questions About Family Communication

Ask:

- Who is our main contact after move-in?
- How often are care plans updated?
- How are family concerns documented?
- How quickly should we expect a response?
- What changes trigger a family call?
- How are falls, medication changes, or behavior changes reported?

## The One Question That Reveals The Most

Ask:

"Can you walk us through the last time a resident's needs increased and how the community handled it?"

Listen for specifics. A strong answer includes reassessment, family communication, care plan changes, pricing clarity, and limits of care.

## Red Flags

- The community gives vague answers about fees.
- The discharge policy is unclear.
- Staff cannot explain care-level pricing.
- The tour avoids resident care areas.
- You are pressured to sign quickly.
- The verbal promises are not in writing.
- Nobody can explain what happens when care needs increase.

## Family Script

"We like what we have seen, but before we decide, we need to understand the real monthly cost, the care limits, what could trigger discharge, and how you communicate when something changes."

## Related Kefiw Tools

- [Assisted Living Cost Calculator](/care/assisted-living-cost-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'senior care advisor, geriatric care manager, elder law attorney for contract sections',
      [SOURCE_AARP_ASSISTED_LIVING_CHECKLIST, SOURCE_AARP_ASSISTED_LIVING],
    ),
  },

  'art-care-questions-nursing-home': {
    slug: 'questions-to-ask-a-nursing-home',
    title: 'Questions to Ask a Nursing Home Before Admission | Kefiw',
    h1: 'Questions to Ask a Nursing Home',
    description:
      'Use these nursing home questions to compare staffing, care plans, fall response, inspections, resident rights, family communication, and discharge planning.',
    metaDescription:
      'Use these nursing home questions to compare staffing, care plans, fall response, inspections, resident rights, family communication, and discharge planning.',
    primaryCta: { href: '/care/nursing-home-cost-calculator/', label: 'Estimate Nursing Home Cost' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/nursing-home-red-flags/', label: 'Nursing Home Red Flags' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Ask More Than "Is There A Bed?"

A nursing home decision is often made under pressure: after a hospitalization, a fall, a rehab recommendation, or a sudden decline.

That pressure makes it easy to focus only on bed availability. Families should also ask about care planning, staffing, communication, safety, resident rights, and what happens when Medicare coverage changes.

Medicare's nursing home checklist recommends asking whether a nursing home is Medicare- and Medicaid-certified, whether staff have specialized dementia training, whether there are openings, and whether the location is close enough for family visits. Medicare also encourages touring and watching for slow responses, strong odors, residents calling out, and safety risks such as unsupervised wandering.

## Questions About Basic Fit

Ask:

- Is the nursing home Medicare-certified?
- Is it Medicaid-certified?
- Is there an available bed?
- What types of residents do you care for best?
- Do you provide short-term rehab, long-term care, or both?
- Do you support residents living with dementia?
- Can family visit easily and often?

## Questions About Care Planning

Ask:

- How is the care plan created?
- Can the resident and family participate?
- When is the first care plan meeting?
- Who attends care plan meetings?
- How are goals set?
- How are changes documented?
- How are family concerns handled?
- What happens if the resident declines?

CMS explains that residents in Medicare- or Medicaid-certified nursing homes have rights and protections under federal and state law to help ensure they get needed care and services.

## Questions About Staffing

Ask:

- Who is on duty during the day?
- Who is on duty overnight?
- Is an RN on-site?
- How are call lights monitored?
- What is the usual response time?
- How do you cover staff shortages?
- How often do agency staff work here?
- How are new staff trained?

## Questions About Falls And Injuries

Ask:

- How do you assess fall risk?
- What happens after a fall?
- How quickly is family notified?
- How are repeat falls reviewed?
- How do you prevent pressure injuries?
- How are wounds tracked?
- What changes trigger a doctor call?

## Questions About Medication And Medical Communication

Ask:

- Who manages medications?
- How are medication changes communicated?
- How are side effects monitored?
- Who contacts the family after a hospital transfer?
- How are doctor visits coordinated?
- How are therapy updates shared?

## Questions About Medicare, Medicaid, And Private Pay

Ask:

- What is the private-pay rate?
- What happens when Medicare-covered skilled care ends?
- Does the facility accept Medicaid?
- What happens if Medicaid is pending?
- What services are included in the daily rate?
- What services cost extra?
- Who explains coverage notices?

## The Kefiw Second-Visit Rule

Tour once officially. Then visit again at a different time if possible.

Best times to learn more:

- Mealtime.
- Early evening.
- Weekend.
- Shift change.

Watch how residents are treated when no one is performing for the tour.

## Red Flags

- Residents call out without response.
- Staff seem unable to answer basic care questions.
- Odors are strong or persistent.
- The facility discourages family involvement.
- Care plan meetings are vague.
- Discharge planning is unclear.
- No one can explain what happens when Medicare coverage ends.

## Family Script

"We need to understand what daily care looks like here, not just admission. Can you explain care planning, fall response, family updates, staffing, and what happens if Medicare coverage ends?"

## Related Kefiw Tools

- [Nursing Home Cost Calculator](/care/nursing-home-cost-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'clinician, nursing home quality expert, long-term care ombudsman-informed reviewer',
      [SOURCE_MEDICARE_NURSING_HOME_CHECKLIST, SOURCE_CMS_NURSING_HOME_RIGHTS, SOURCE_MEDICARE_CARE_COMPARE],
    ),
  },

  'art-care-questions-memory-care': {
    slug: 'questions-to-ask-memory-care-community',
    title: 'Questions to Ask a Memory Care Community | Kefiw',
    h1: 'Questions to Ask a Memory Care Community',
    description:
      'Use these memory care questions to compare dementia training, wandering prevention, behavior support, safety, activities, medication support, and discharge rules.',
    metaDescription:
      'Use these memory care questions to compare dementia training, wandering prevention, behavior support, safety, activities, medication support, and discharge rules.',
    primaryCta: { href: '/care/memory-care-cost-calculator/', label: 'Estimate Memory Care Cost' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/guides/memory-care-red-flags/', label: 'Memory Care Red Flags' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Memory Care Is More Than A Secured Door

Good memory care should understand confusion, fear, wandering, refusal of care, nighttime changes, agitation, routines, dignity, and family communication.

The Alzheimer's Association says the first step in choosing a care provider is assessing the current needs of the person with dementia and, when possible, involving the person living with dementia in care decisions.

## Questions About Dementia Care Philosophy

Ask:

- How do you describe your dementia care approach?
- How do you preserve dignity and independence?
- How do you respond when a resident says, "I want to go home"?
- How do you handle refusal of bathing, dressing, or medication?
- How do you reduce distress before it escalates?
- How do you avoid treating dementia symptoms as "bad behavior"?

## Questions About Staff Training

Ask:

- What dementia-specific training do staff receive?
- How often is training updated?
- Are staff trained in wandering, agitation, sundowning, communication, and redirection?
- Are staff trained to avoid arguing or correcting?
- How do you coach new staff?
- Are residents assigned consistent caregivers?

The Alzheimer's Association recommends asking one question at a time, using yes/no questions when helpful, avoiding arguing, and offering clear step-by-step communication.

## Questions About Wandering And Exit-Seeking

Ask:

- How do you prevent wandering?
- What happens if someone tries to leave?
- What technology or checks are used?
- Are outdoor spaces secure?
- How often do residents get supervised movement or walking opportunities?
- How do you communicate wandering incidents to families?

## Questions About Behavior Support

Ask:

- What happens if a resident becomes agitated?
- What happens if a resident is physically aggressive?
- What happens if a resident refuses care?
- How are triggers documented?
- How are families involved in behavior planning?
- When would behavior lead to discharge?

## Questions About Activities And Routine

Ask:

- How are activities adapted by stage of dementia?
- Are activities meaningful or mostly decorative?
- How do you engage residents who do not join groups?
- How do you support residents who pace?
- How do you handle mealtime confusion?
- What does evening routine look like?

## Questions About Cost And Discharge

Ask:

- What is the monthly base cost?
- What care fees are added?
- What services cost extra?
- What would make the bill increase?
- What would require transfer or discharge?
- Can we see a sample invoice?
- Can we see the discharge policy in writing?

## Kefiw's Best Question

Ask:

"Can you walk us through a hard day?"

Example:

"My mom refuses a shower, says she needs to go home, becomes angry, and tries to leave. What happens next?"

A strong community can answer this calmly and specifically.

## Red Flags

- Staff talk about residents as problems.
- Wandering prevention is vague.
- The community relies too heavily on medication language.
- There is no clear behavior plan.
- Activities do not match cognitive ability.
- Families are not included in care planning.
- Discharge rules are unclear.

## Family Script

"We are not only looking for safety. We are looking for a place that understands fear, confusion, dignity, and behavior changes. Can you show us how your team handles a difficult day?"

## Related Kefiw Tools

- [Memory Care Cost Calculator](/care/memory-care-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'dementia care specialist, clinician, geriatric care manager',
      [SOURCE_ALZ_CHOOSING_CARE, SOURCE_ALZ_COMMUNICATION, SOURCE_ALZ_WANDERING],
    ),
  },

  'art-care-questions-home-care-agency': {
    slug: 'questions-to-ask-home-care-agency',
    title: 'Questions to Ask a Home Care Agency Before Hiring | Kefiw',
    h1: 'Questions to Ask a Home Care Agency',
    description:
      'Use these home care agency questions to compare caregiver screening, training, backup coverage, pricing, supervision, scheduling, and family communication.',
    metaDescription:
      'Use these home care agency questions to compare caregiver screening, training, backup coverage, pricing, supervision, scheduling, and family communication.',
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/home-care-agency-red-flags/', label: 'Home Care Agency Red Flags' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Reliability Matters As Much As Rate

Home care can help an older adult stay at home longer, but the quality of the arrangement depends on the details.

The most important question is not only:

"What is your hourly rate?"

The better question is:

"Can your agency reliably cover the care this person actually needs?"

NIA caregiver worksheets and Family Caregiver Alliance hiring guidance both emphasize defining needs and responsibilities before bringing help into the home.

## Questions About Services

Ask:

- What services do you provide?
- What services do you not provide?
- Do caregivers help with bathing, dressing, toileting, transfers, meals, transportation, errands, and light housekeeping?
- Can caregivers support dementia-related needs?
- Can caregivers provide overnight care?
- What tasks require a licensed professional instead?

## Questions About Caregiver Screening

Ask:

- How do you screen caregivers?
- Are background checks required?
- Are references checked?
- Are caregivers employees or contractors?
- Are caregivers bonded and insured?
- What training is required?
- What disqualifies someone from working with your agency?

## Questions About Matching

Ask:

- How do you match caregivers to clients?
- Can we meet the caregiver before the first shift?
- What happens if the match is not good?
- Can we request consistency?
- How do you handle personality, language, culture, pet, or dementia-care needs?

## Questions About Backup Coverage

Ask:

- What happens if the caregiver calls out?
- How quickly can backup be sent?
- Who notifies the family?
- Is backup guaranteed?
- What happens during weather emergencies?
- What happens during holidays?

Kefiw tip: This may be the most important question. A cheap hourly rate does not help if nobody comes when the assigned caregiver is sick.

## Questions About Scheduling And Cost

Ask:

- What is the hourly rate?
- Is there a minimum number of hours per shift?
- Are rates higher for weekends, nights, or holidays?
- Is there a cancellation fee?
- How is billing handled?
- Are care notes included?
- What happens if care needs increase?

## Questions About Supervision

Ask:

- Who supervises caregivers?
- How often does a supervisor check in?
- How are care plans updated?
- How are concerns handled?
- How are family updates shared?
- Who is the after-hours contact?

## The Kefiw First-Two-Weeks Test

After hiring, track:

- Did the caregiver arrive on time?
- Were tasks completed?
- Did the caregiver treat the person with respect?
- Were care notes useful?
- Did the agency communicate well?
- Did the older adult feel comfortable?
- Did family workload actually decrease?

## Red Flags

- No backup plan.
- Vague screening process.
- Unclear pricing.
- No written care plan.
- The agency cannot explain what caregivers may and may not do.
- Communication is poor before hiring.
- Family concerns are minimized.
- Caregivers are inconsistent without explanation.

## Family Script

"We are not just buying hours. We need reliable coverage, a clear care plan, backup support, and communication when something changes."

## Related Kefiw Tools

- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'home care agency professional, geriatric care manager',
      [SOURCE_NIA_CAREGIVER_WORKSHEETS, SOURCE_FCA_HIRING_HOME_HELP],
    ),
  },

  'art-care-questions-private-caregiver': {
    slug: 'questions-to-ask-private-caregiver',
    title: 'Questions to Ask Before Hiring a Private Caregiver | Kefiw',
    h1: 'Questions to Ask Before Hiring a Private Caregiver',
    description:
      'Use these questions before hiring a private caregiver, including duties, references, training, backup coverage, taxes, liability, scheduling, and emergency plans.',
    metaDescription:
      'Use these questions before hiring a private caregiver, including duties, references, training, backup coverage, taxes, liability, scheduling, and emergency plans.',
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/questions-to-ask-home-care-agency/', label: 'Questions to Ask a Home Care Agency' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Private Care Can Add Control And Responsibility

Hiring a private caregiver may offer more control and sometimes lower hourly cost than an agency. It may also create more responsibility for the family.

With a private caregiver, the family may need to think about screening, taxes, payroll, liability, supervision, backup coverage, scheduling, and what happens if the caregiver becomes unavailable.

This guide is educational and should not be treated as legal, tax, or employment advice. IRS Publication 926 explains that families may have household-employer tax responsibilities when they hire someone to do household work and control what work is done and how it is done.

## Questions About Experience

Ask:

- What kind of care have you provided before?
- Have you cared for someone with similar needs?
- Do you have experience with dementia?
- Do you have experience with transfers, bathing, toileting, incontinence, or mobility support?
- What tasks are you comfortable doing?
- What tasks are you not comfortable doing?

## Questions About References And Screening

Ask:

- Can you provide references?
- Can we verify prior caregiving work?
- Are you willing to complete a background check where legally appropriate?
- Do you have relevant certifications?
- Are you CPR or first-aid trained?
- Are you legally authorized to work?

## Questions About Duties

Ask:

- Will you help with bathing?
- Will you help with toileting?
- Will you prepare meals?
- Will you do light housekeeping?
- Will you drive?
- Will you help with medications only as allowed?
- Will you document care notes?
- Will you communicate with family?

## Questions About Schedule

Ask:

- What days and hours are you available?
- Are you available evenings, weekends, or holidays?
- What notice do you need for schedule changes?
- What happens if you are sick?
- Do you have reliable transportation?
- Can you work the same schedule every week?

## Questions About Money And Employment

Ask:

- What is your hourly rate?
- How do you expect to be paid?
- Are taxes being handled correctly?
- Is overtime relevant?
- Will there be a written agreement?
- What expenses are reimbursed?
- Who provides supplies?
- Who handles mileage?

Kefiw tip: Do not create a vague cash arrangement. A private caregiver relationship should be documented clearly. Families should speak with a tax or employment professional when needed.

## Questions About Safety

Ask:

- What would you do if my parent fell?
- What would you do if they refused care?
- What would you do if they seemed confused or suddenly weaker?
- What would you do if they became angry or fearful?
- Who do you call first in an emergency?
- What information do you need before starting?

## The Kefiw Job-Description-Before-Interview Rule

Do not interview before writing the job.

Include:

- Days.
- Hours.
- Tasks.
- Mobility needs.
- Dementia needs.
- Transportation.
- Household tasks.
- Documentation.
- Emergency contacts.
- Pay process.
- Backup expectations.

A clear job description protects both the caregiver and the family.

## Red Flags

- No references.
- Unclear work history.
- Resistance to written agreements.
- Unwillingness to document care.
- Unclear backup plan.
- Overpromising medical tasks.
- Poor boundaries around money.
- Family hires quickly because they are desperate.

## Family Script

"We want this to work well for everyone, so we need a written schedule, task list, pay process, emergency plan, and backup plan before care begins."

## Related Kefiw Tools

- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'elder law attorney, employment/tax professional, geriatric care manager',
      [SOURCE_FCA_HIRING_HOME_HELP, SOURCE_IRS_HOUSEHOLD_EMPLOYER, SOURCE_IRS_FAMILY_CAREGIVERS, SOURCE_DOL_DIRECT_CARE],
    ),
  },

  'art-care-questions-medicare-agent': {
    slug: 'questions-to-ask-medicare-broker-agent',
    title: 'Questions to Ask a Medicare Broker or Agent | Kefiw',
    h1: 'Questions to Ask a Medicare Broker or Agent',
    description:
      'Use these questions before working with a Medicare broker or agent, including licensing, plan options, commissions, networks, prescriptions, costs, and red flags.',
    metaDescription:
      'Use these questions before working with a Medicare broker or agent, including licensing, plan options, commissions, networks, prescriptions, costs, and red flags.',
    primaryCta: { href: '/care/medicare-cost-planner/', label: 'Estimate Medicare Costs' },
    relatedLinks: [
      { href: '/care/part-d-estimator/', label: 'Part D Estimate' },
      { href: '/care/medicare-irmaa-calculator/', label: 'Medicare IRMAA Calculator' },
      { href: '/care/guides/medicare-plan-red-flags/', label: 'Medicare Plan Red Flags' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Know Who The Agent Represents

A Medicare broker or agent can be helpful, but families should understand what the agent represents, which plans they can sell, how they are paid, and whether they are comparing the full set of options.

Medicare says independent agents and brokers selling plans must be licensed by the state, and CMS explains that agents and brokers must complete Medicare training and follow Medicare marketing rules. Medicare also explains how to report suspected fraud or misleading activity.

## Questions About Licensing And Scope

Ask:

- Are you licensed in this state?
- Which companies do you represent?
- Do you sell all plans available in my area or only some?
- Are there plans you cannot sell?
- Are you captive, independent, or connected to one company?
- Can you show me how to verify your license?

## Questions About Compensation

Ask:

- Are you paid by insurance companies?
- Are you paid differently depending on the plan?
- Do you receive commissions, bonuses, or other compensation?
- Does your compensation affect which plans you show?

Kefiw tip: A good advisor should not be offended by compensation questions.

## Questions About Plan Comparison

Ask:

- Did you check my doctors?
- Did you check my hospitals?
- Did you check my prescriptions?
- Did you check pharmacy pricing?
- Did you compare total yearly cost, not just premium?
- Did you check the out-of-pocket maximum?
- Did you review prior authorization?
- Did you explain what changes year to year?

## Questions About Medicare Advantage

Ask:

- Are my doctors in network?
- Are my hospitals in network?
- What happens out of network?
- Is prior authorization required for common services?
- What is the annual out-of-pocket maximum?
- Are my medications covered?
- What happens if I travel or move?

## Questions About Original Medicare And Medigap

Ask:

- Should I consider Original Medicare with Medigap?
- Am I in my Medigap Open Enrollment Period?
- Could underwriting apply later?
- What happens if I leave Medigap?
- Do I need a separate Part D plan?
- What costs are not covered?

## Questions About Part D

Ask:

- Are all medications covered?
- What tier is each medication?
- Are prior authorization, step therapy, or quantity limits required?
- Which pharmacies are preferred?
- What are estimated annual drug costs?

## Red Flags

- The agent pressures you to enroll quickly.
- The agent focuses only on premium.
- Your doctor and drug list are not checked.
- You are told a plan is "free" without cost explanation.
- The agent cannot explain compensation.
- You are discouraged from contacting SHIP or Medicare.
- The agent asks for unnecessary personal information too early.
- The plan sounds too good to be true.

## Family Script

"Before we enroll, we need to verify doctors, hospitals, prescriptions, pharmacy costs, prior authorization, total yearly cost, and your relationship to the plans you are recommending."

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part D Estimate](/care/part-d-estimator/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)`,
      'Medicare specialist, licensed insurance professional',
      [SOURCE_MEDICARE_MARKETING_RULES, SOURCE_CMS_AGENT_COMPENSATION, SOURCE_MEDICARE_FRAUD, SOURCE_MEDICARE_COMPARE_OPTIONS],
    ),
  },

  'art-care-questions-ltc-insurance': {
    slug: 'questions-to-ask-long-term-care-insurance',
    title: 'Questions to Ask About Long-Term Care Insurance | Kefiw',
    h1: 'Questions to Ask About Long-Term Care Insurance',
    description:
      'Use these questions to understand long-term care insurance benefit triggers, elimination periods, daily benefits, inflation protection, exclusions, and claims.',
    metaDescription:
      'Use these questions to understand long-term care insurance benefit triggers, elimination periods, daily benefits, inflation protection, exclusions, and claims.',
    primaryCta: { href: '/care/long-term-care-insurance-calculator/', label: 'Estimate LTC Insurance Gap' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/long-term-care-insurance-claims-guide/', label: 'LTC Insurance Claims Guide' },
    ],
    longformMarkdown: withChecklistFooter(
      `## A Policy Is Not The Same As An Approved Claim

Long-term care insurance is not useful just because a policy exists. It is useful when the family understands what triggers benefits, when benefits start, what care settings qualify, how much the policy pays, and what documentation is required.

ACL explains that long-term care insurance benefits usually depend on meeting a benefit trigger and satisfying an elimination period. Benefit triggers are often based on needing help with Activities of Daily Living or having cognitive impairment.

## Questions About Benefit Triggers

Ask:

- What triggers benefits?
- How many ADLs must the person need help with?
- Does cognitive impairment qualify?
- Who performs the assessment?
- Does a doctor need to certify the need?
- Is a plan of care required?
- How often is eligibility reassessed?

## Questions About Elimination Period

Ask:

- What is the elimination period?
- Is it 30, 60, 90, or another number of days?
- Does it count calendar days or service days?
- Do paid services have to be received for days to count?
- What costs must the family pay during this period?
- Does the elimination period apply once or every claim period?

ACL describes the elimination period as the time that must pass after a benefit trigger occurs before payment begins, similar to a deductible measured in time; some policies require paid care during that period.

## Questions About Covered Care Settings

Ask:

- Does the policy cover home care?
- Does it cover assisted living?
- Does it cover memory care?
- Does it cover nursing home care?
- Does it cover adult day care?
- Does it cover respite?
- Are family caregivers covered?
- Does the care provider need to be licensed?

## Questions About Benefit Amount

Ask:

- What is the daily or monthly benefit?
- Has inflation protection increased the benefit?
- Is there a lifetime maximum?
- How long could the policy pay at today's care cost?
- Does it reimburse actual expenses or pay cash?
- What happens if the care cost exceeds the benefit?

## Questions About Claims

Ask:

- How do we start a claim?
- What forms are required?
- What invoices are required?
- What provider documentation is required?
- How long does approval usually take?
- What are common reasons claims are delayed?
- What is the appeal process?

## Kefiw Tip: Calculate The Uncovered Gap

Do not ask only:

"Will the policy pay?"

Ask:

"How much will the policy pay compared with the actual monthly cost?"

Example:

- Memory care cost: $8,500/month.
- Policy benefit: $4,500/month.
- Family gap: $4,000/month.

That gap is the real planning number.

## Red Flags

- The family has only a brochure, not the policy.
- Nobody knows the elimination period.
- Nobody knows whether home care or memory care qualifies.
- The benefit amount is far below local care cost.
- Claims paperwork is delayed.
- Provider requirements are unclear.
- The policy excludes the setting being considered.

## Family Script

"Before we build the care plan around this policy, we need to know the benefit trigger, elimination period, covered settings, provider rules, monthly benefit, and documentation requirements."

## Related Kefiw Tools

- [Long-Term Care Insurance Calculator](/care/long-term-care-insurance-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'licensed insurance professional, elder law attorney for claim disputes',
      [SOURCE_ACL_LTC_INSURANCE, SOURCE_MEDICARE_LTC],
    ),
  },

  'art-care-assisted-living-red-flags': {
    slug: 'assisted-living-red-flags',
    title: 'Assisted Living Red Flags Families Should Watch For | Kefiw',
    h1: 'Assisted Living Red Flags Families Should Watch For',
    description:
      'Learn assisted living warning signs around pricing, staffing, discharge rules, resident care, communication, contracts, and pressure tactics.',
    metaDescription:
      'Learn assisted living warning signs around pricing, staffing, discharge rules, resident care, communication, contracts, and pressure tactics.',
    primaryCta: { href: '/care/assisted-living-cost-calculator/', label: 'Estimate Assisted Living Cost' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/facility-contract-checklist/', label: 'Facility Contract Checklist' },
      { href: '/care/guides/questions-to-ask-assisted-living-community/', label: 'Assisted Living Questions' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Red Flags Are Often Small

Assisted living red flags are not always dramatic. Sometimes the warning sign is a vague answer, a rushed contract, a fee that is not written down, or a staff member who seems too busy to notice residents.

## Pricing Red Flags

Watch for:

- Only the base rate is discussed.
- Care-level fees are vague.
- Medication fees are unclear.
- A sample invoice is refused.
- Rate increases are not explained.
- Move-in fees or community fees appear late.
- Verbal promises are not reflected in the contract.

Kefiw move: Ask, "What are the three most common reasons a resident's bill increases after move-in?"

## Care Red Flags

Watch for:

- Staff cannot explain what care needs they cannot support.
- Fall response is vague.
- Nighttime coverage is unclear.
- Medication support is described casually.
- Dementia needs are minimized.
- The community says "we can handle everything," which is rarely true.

## Resident-Life Red Flags

Watch for:

- Residents sitting unattended for long periods.
- Residents appear disengaged or distressed.
- Call buttons or requests seem ignored.
- Meals feel rushed.
- Staff do not greet residents by name.
- The community feels staged only for the tour.

## Contract Red Flags

Watch for:

- Discharge rules are broad or unclear.
- The family is discouraged from taking the contract home.
- Fees are spread across multiple documents.
- Policies referenced in the contract are not provided.
- You are told, "Do not worry about that section."

AARP assisted living guidance emphasizes understanding all fees, service levels, policies, and what happens if needs or finances change, and getting unclear points clarified in writing before signing.

## Communication Red Flags

Watch for:

- No clear primary family contact.
- Slow responses before admission.
- Concerns are brushed aside.
- Care plan updates are vague.
- The family is told about problems only after they become serious.

## Family Script

"We are noticing some unclear areas around fees, discharge rules, and care limits. Before we move forward, we need those answers in writing."

## Related Kefiw Tools

- [Assisted Living Cost Calculator](/care/assisted-living-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'senior care advisor, elder law attorney',
      [SOURCE_AARP_ASSISTED_LIVING, SOURCE_AARP_ASSISTED_LIVING_CHECKLIST],
    ),
  },

  'art-care-nursing-home-red-flags': {
    slug: 'nursing-home-red-flags',
    title: 'Nursing Home Red Flags: What Families Should Watch For | Kefiw',
    h1: 'Nursing Home Red Flags',
    description:
      'Learn nursing home red flags around staffing, odors, call lights, resident dignity, care plans, falls, communication, and discharge planning.',
    metaDescription:
      'Learn nursing home red flags around staffing, odors, call lights, resident dignity, care plans, falls, communication, and discharge planning.',
    primaryCta: { href: '/care/nursing-home-cost-calculator/', label: 'Estimate Nursing Home Cost' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/questions-to-ask-a-nursing-home/', label: 'Nursing Home Questions' },
      { href: '/care/guides/how-to-choose-a-nursing-home/', label: 'How to Choose a Nursing Home' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Watch During Tours And Ordinary Visits

Nursing home red flags can appear during the tour, admission process, care plan meeting, or everyday visits.

Medicare recommends checking nursing homes carefully and using a checklist for each facility visited. CMS states that nursing home residents have rights and protections under federal and state law to help ensure they receive needed care and services.

## Tour Red Flags

Watch for:

- Strong odors that are not explained.
- Residents calling out without response.
- Call lights unanswered.
- Residents appear poorly positioned or uncomfortable.
- Hallways are cluttered.
- Staff seem rushed or dismissive.
- The tour avoids certain units.

## Staffing Red Flags

Watch for:

- No clear answer about overnight staffing.
- High use of temporary staff without explanation.
- Staff do not know residents' names.
- Family is told staffing questions are inappropriate.
- No one explains who is responsible for care decisions.

## Care Plan Red Flags

Watch for:

- No clear care plan process.
- Family is not invited to participate.
- Concerns are not documented.
- Falls happen without review.
- Medication changes are not communicated.
- Discharge planning is vague.

## Dignity Red Flags

Watch for:

- Staff talk over residents.
- Residents are ignored during conversations.
- Residents look unclean or uncomfortable.
- Privacy is not respected.
- Choices about meals, routines, or activities are dismissed.

CMS resident rights materials explain that residents in certified nursing homes have rights and protections, including dignity, respect, and quality care.

## Complaint Red Flags

Watch for:

- Families are discouraged from contacting an ombudsman.
- Complaints are minimized.
- Staff blame the resident.
- The facility becomes defensive when asked about inspections.
- You are told not to put concerns in writing.

ACL explains that Long-Term Care Ombudsman programs work to resolve problems related to health, safety, welfare, and rights in long-term care facilities.

## Family Script

"We want to address this early. Can you document our concern, tell us who is responsible for follow-up, and explain when we should expect an update?"

## Related Kefiw Tools

- [Nursing Home Cost Calculator](/care/nursing-home-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'clinician, ombudsman-informed reviewer, nursing home quality expert',
      [SOURCE_MEDICARE_NURSING_HOME_CHECKLIST, SOURCE_CMS_NURSING_HOME_RIGHTS, SOURCE_ACL_OMBUDSMAN],
    ),
  },

  'art-care-memory-care-red-flags': {
    slug: 'memory-care-red-flags',
    title: 'Memory Care Red Flags Families Should Watch For | Kefiw',
    h1: 'Memory Care Red Flags',
    description:
      'Learn memory care warning signs related to dementia training, wandering prevention, dignity, behavior response, medication, activities, and discharge rules.',
    metaDescription:
      'Learn memory care warning signs related to dementia training, wandering prevention, dignity, behavior response, medication, activities, and discharge rules.',
    primaryCta: { href: '/care/memory-care-cost-calculator/', label: 'Estimate Memory Care Cost' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/dementia-wandering-safety/', label: 'Dementia Wandering Guide' },
      { href: '/care/guides/questions-to-ask-memory-care-community/', label: 'Memory Care Questions' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Security Alone Is Not Memory Care

Memory care should be calm, structured, respectful, and dementia-aware.

A secured door is not enough. Families should look for how the community responds to confusion, fear, wandering, refusal of care, agitation, and distress.

## Staff-Language Red Flags

Watch for:

- Staff call residents "difficult" or "bad."
- Dementia behavior is treated as intentional misbehavior.
- Staff correct or argue with residents.
- Residents are talked about as if they are not present.
- The team cannot explain redirection.

The Alzheimer's Association recommends avoiding arguing with a person living with dementia and using simple, supportive communication.

## Wandering Red Flags

Watch for:

- Wandering prevention is only described as "the unit is locked."
- Staff cannot explain what triggers exit-seeking.
- There is no missing-person plan.
- Outdoor spaces are unsafe or unavailable.
- Families are not notified after wandering incidents.

## Behavior-Support Red Flags

Watch for:

- Medication is the first or only answer to agitation.
- Staff cannot describe non-drug calming strategies.
- No one tracks behavior triggers.
- Refusal of care is handled with pressure instead of patience.
- The community cannot explain when behavior would lead to discharge.

## Activity Red Flags

Watch for:

- Activities are not adapted to cognitive ability.
- Residents sit without engagement for long periods.
- The activity calendar looks impressive but does not match residents' actual participation.
- There is little structure during late afternoon or evening.

## Family-Communication Red Flags

Watch for:

- No clear care plan meeting schedule.
- Families are not asked about routines, triggers, or comfort strategies.
- Changes in behavior are reported late.
- The discharge policy is vague.
- Cost increases are not explained.

## Kefiw Move: Ask For The Hard-Day Answer

Ask:

"What happens when my loved one refuses care, becomes agitated, and tries to leave?"

If the answer is vague, that is the red flag.

## Family Script

"We need to understand how your team responds to distress, not just how the unit is secured. Can you walk us through your behavior and wandering plan?"

## Related Kefiw Tools

- [Memory Care Cost Calculator](/care/memory-care-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'dementia care specialist, clinician',
      [SOURCE_ALZ_COMMUNICATION, SOURCE_ALZ_WANDERING, SOURCE_ALZ_CHOOSING_CARE],
    ),
  },

  'art-care-home-care-agency-red-flags': {
    slug: 'home-care-agency-red-flags',
    title: 'Home Care Agency Red Flags Before Hiring | Kefiw',
    h1: 'Home Care Agency Red Flags',
    description:
      'Learn home care agency warning signs around caregiver screening, backup coverage, scheduling, pricing, supervision, documentation, and communication.',
    metaDescription:
      'Learn home care agency warning signs around caregiver screening, backup coverage, scheduling, pricing, supervision, documentation, and communication.',
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/questions-to-ask-home-care-agency/', label: 'Home Care Agency Questions' },
    ],
    longformMarkdown: withChecklistFooter(
      `## A Weak Agency Can Add Work

A home care agency can reduce family workload. A weak agency can create more stress than it solves.

The biggest risks are unreliable coverage, unclear pricing, poor caregiver matching, weak supervision, and no backup plan.

## Coverage Red Flags

Watch for:

- No clear backup plan.
- The agency cannot explain what happens after a caregiver callout.
- Scheduling is inconsistent.
- The family is notified of missed shifts too late.
- Weekend or holiday coverage is vague.

## Screening Red Flags

Watch for:

- Background checks are not clearly explained.
- Training requirements are vague.
- The agency cannot explain caregiver qualifications.
- Caregivers are sent without matching needs.
- Dementia experience is assumed but not verified.

## Pricing Red Flags

Watch for:

- Hourly rates are clear, but minimum shifts are hidden.
- Weekend, holiday, or overnight rates are unclear.
- Cancellation fees are not explained.
- Billing statements are hard to understand.
- The agency avoids putting fees in writing.

## Supervision Red Flags

Watch for:

- No supervisor checks in.
- Care plans are not updated.
- Care notes are missing or vague.
- Family concerns do not reach management.
- No one reviews whether tasks are actually completed.

## Scope Red Flags

Watch for:

- Caregivers are expected to perform medical tasks outside their role.
- The agency cannot explain what caregivers may and may not do.
- Medication assistance rules are vague.
- Transfer needs are accepted without safety review.

## Kefiw Move: Test Communication Before Hiring

Before signing, call or message with a practical question:

"If the caregiver calls out at 6 a.m., what happens?"

How the agency answers before you hire often predicts how it will respond after you hire.

## Family Script

"Reliability matters as much as hourly cost. We need written answers about backup coverage, caregiver screening, supervision, care notes, and what happens when care needs change."

## Related Kefiw Tools

- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)`,
      'home care professional, geriatric care manager',
      [SOURCE_NIA_CAREGIVER_WORKSHEETS, SOURCE_FCA_HIRING_HOME_HELP],
    ),
  },

  'art-care-medicare-plan-red-flags': {
    slug: 'medicare-plan-red-flags',
    title: 'Medicare Plan Red Flags Before You Enroll | Kefiw',
    h1: 'Medicare Plan Red Flags',
    description:
      'Learn Medicare red flags around low premiums, missing drug checks, narrow networks, prior authorization, agent pressure, misleading claims, and plan switching.',
    metaDescription:
      'Learn Medicare red flags around low premiums, missing drug checks, narrow networks, prior authorization, agent pressure, misleading claims, and plan switching.',
    primaryCta: { href: '/care/medicare-cost-planner/', label: 'Estimate Medicare Costs' },
    relatedLinks: [
      { href: '/care/part-d-estimator/', label: 'Part D Estimate' },
      { href: '/care/medicare-irmaa-calculator/', label: 'Medicare IRMAA Calculator' },
      { href: '/care/guides/medicare-open-enrollment-checklist/', label: 'Medicare Open Enrollment Checklist' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Attractive Does Not Always Mean Good Fit

A Medicare plan can look attractive and still be a poor fit.

The most common red flag is choosing a plan based on one appealing feature while ignoring doctors, prescriptions, hospitals, prior authorization, total yearly cost, or long-term care assumptions.

## Sales Red Flags

Watch for:

- Pressure to enroll immediately.
- "Free" language without explaining costs.
- Claims that sound too broad.
- An agent who will not explain compensation.
- An agent who discourages you from calling Medicare or SHIP.
- Unsolicited contact that asks for sensitive information.

Medicare plan marketing rules say independent agents and brokers selling plans must be licensed by the state. Medicare also warns people to protect Medicare and Social Security numbers and report suspected fraud.

## Cost Red Flags

Watch for:

- Only monthly premium is compared.
- Deductibles are ignored.
- Copays are ignored.
- Coinsurance is ignored.
- Out-of-pocket maximum is ignored.
- Part D drug costs are not calculated.
- IRMAA is not considered.

## Network Red Flags

Watch for:

- Doctor network is assumed, not verified.
- Hospital network is not checked.
- Specialist access is not checked.
- Travel needs are ignored.
- Moving plans are ignored.
- Out-of-network rules are unclear.

## Prescription Red Flags

Watch for:

- Drug list is not reviewed.
- Dosages are not entered.
- Pharmacy pricing is not checked.
- Prior authorization is ignored.
- Step therapy is ignored.
- A drug covered last year is assumed to be covered next year.

## Long-Term Care Red Flag

The biggest senior care mistake:

"This Medicare plan will solve long-term care costs."

Medicare says Medicare and most health insurance, including Medigap, do not pay for long-term care services in a nursing home or in the community, and people pay 100% for non-covered services including most long-term care.

## Family Script

"Before enrolling, we need to verify doctors, hospitals, prescriptions, pharmacy costs, out-of-pocket risk, prior authorization, travel needs, and whether this plan affects our senior care assumptions."

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part D Estimate](/care/part-d-estimator/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)`,
      'Medicare specialist, licensed insurance professional',
      [SOURCE_MEDICARE_MARKETING_RULES, SOURCE_MEDICARE_FRAUD, SOURCE_MEDICARE_LTC, SOURCE_MEDICARE_COMPARE_OPTIONS],
    ),
  },

  'art-care-talk-parent-help': {
    slug: 'talk-to-parent-about-needing-help',
    title: 'How to Talk to a Parent About Needing More Help | Kefiw',
    h1: 'How to Talk to a Parent About Needing More Help',
    description:
      'Use practical scripts to talk with an aging parent about home care, safety, independence, driving, falls, memory changes, and daily support.',
    metaDescription:
      'Use practical scripts to talk with an aging parent about home care, safety, independence, driving, falls, memory changes, and daily support.',
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Home Safety Checklist' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/mind-reset/', label: 'Mind Reset' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Why This Conversation Is Hard

This conversation is hard because the parent may hear:

"You are losing control."

Even when the adult child means:

"I want you to be safe."

The goal is not to win the conversation in one sitting. The goal is to reduce defensiveness, protect dignity, and take one safer next step.

## The Kefiw Conversation Frame

Start with:

- Respect: "You have handled your life for a long time."
- Observation: "I noticed the stove was left on twice."
- Shared goal: "I want you to stay safe at home as long as possible."
- Small next step: "Can we try grocery delivery for one month?"

## Avoid These Openings

Avoid:

- "You cannot live like this."
- "You are not safe."
- "You have to accept help."
- "We already decided."
- "You are being stubborn."

These may be true in moments, but they usually create resistance.

## Try These Instead

### For Home Care

"I know you value privacy. I am not suggesting someone take over your life. I am asking whether we can try two hours of help with laundry and groceries so the house is easier to manage."

### For Falls

"I am not blaming you for falling. I am worried the house is not supporting you the way it used to. Can we look at lighting, bathroom safety, and whether extra help would make things easier?"

### For Medication

"This is a lot for anyone to track. Would you be open to a pill organizer or pharmacy packaging so you do not have to remember every detail?"

### For Driving

"This is not about taking away your independence. It is about finding ways for you to get where you want to go without everyone worrying about safety."

### For Assisted Living

"Touring does not mean deciding. It just means we understand options before there is an emergency."

## Kefiw Tip: Use Trial Language

A trial is easier than a verdict.

Say:

"Let us try this for four weeks."

not:

"This is how things have to be now."

## Red Flags

- The parent's refusal creates immediate danger.
- A spouse caregiver is being harmed or exhausted.
- The parent is unsafe with medication, driving, fire, or wandering.
- The family keeps waiting for a crisis.
- Everyone avoids the topic because the parent gets angry.

## Closing Script

"We do not have to decide everything today. But we do need to take one step that makes this safer."

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Home Safety Checklist](/care/guides/home-safety-checklist-older-adults/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'geriatric care manager, therapist, clinician for safety topics',
      [SOURCE_NIA_CAREGIVER_WORKSHEETS, SOURCE_NIA_TALKING_WITH_DOCTOR],
    ),
  },

  'art-care-talk-siblings-costs': {
    slug: 'talk-to-siblings-sharing-care-costs',
    title: 'How to Talk to Siblings About Sharing Care Costs | Kefiw',
    h1: 'How to Talk to Siblings About Sharing Care Costs',
    description:
      'Use scripts and planning steps to talk with siblings about senior care costs, unpaid caregiving, family budgets, fairness, and shared responsibilities.',
    metaDescription:
      'Use scripts and planning steps to talk with siblings about senior care costs, unpaid caregiving, family budgets, fairness, and shared responsibilities.',
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/guides/how-to-divide-caregiving-responsibilities/', label: 'Divide Caregiving Responsibilities' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Cost Conversations Often Become Family History Conversations

One sibling feels they do everything. Another feels judged. Another has less money. Another lives far away. Someone has power of attorney. Someone thinks the parent should spend less. Someone thinks the parent needs more care now.

The first move is to separate money, time, decisions, and backup.

## Start With The Facts

Before asking for money, gather:

- Current monthly care costs.
- Expected future costs.
- Parent income.
- Parent savings.
- Insurance or long-term care policy.
- Medicare or Medicaid assumptions.
- Unpaid caregiving hours.
- Transportation costs.
- Supplies.
- One-time expenses.

## The Kefiw Fairness Rule

Fair does not always mean equal.

A sibling may contribute:

- Money.
- Time.
- Transportation.
- Paperwork.
- Research.
- Facility visits.
- Insurance calls.
- Emergency backup.
- Respite coverage.

The key is making the contribution visible.

## Opening Script

"I want us to look at the full care picture before anyone reacts. This includes Mom's income, care costs, unpaid hours, supplies, transportation, and what each of us can realistically contribute."

## Script When Siblings Have Unequal Income

"I am not assuming everyone can pay the same amount. But we need to be honest about what money is needed and what non-money responsibilities each person can own."

## Script When One Sibling Gives Advice But No Help

"I am open to ideas, but we also need task ownership. Can you take responsibility for one recurring part of the plan?"

## Script When A Sibling Lives Far Away

"You may not be able to drive to appointments, but could you own insurance calls, bill tracking, facility research, or the family update notes?"

## Kefiw Tip: Create A Visible Contribution Table

| Person | Money | Time | Admin | Backup |
| --- | --- | --- | --- | --- |
| Sibling A | $ | Hours | Task | Backup role |
| Sibling B | $ | Hours | Task | Backup role |

This turns resentment into information.

## Red Flags

- One person pays silently.
- One person provides all care silently.
- Nobody knows what the parent can afford.
- Siblings argue before seeing numbers.
- Family members confuse control with contribution.
- There is no written reimbursement plan.
- One person has financial authority but no transparency.

## Closing Script

"We may not divide this equally, but we need to divide it intentionally."

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)`,
      'financial planner, elder law attorney for authority and reimbursement issues',
      [SOURCE_NIA_CAREGIVER_WORKSHEETS, SOURCE_IRS_HOUSEHOLD_EMPLOYER],
    ),
  },

  'art-care-tell-parent-assisted-living': {
    slug: 'tell-parent-assisted-living-may-be-needed',
    title: 'How to Tell a Parent Assisted Living May Be Needed | Kefiw',
    h1: 'How to Tell a Parent Assisted Living May Be Needed',
    description:
      'Use compassionate scripts to discuss assisted living with a parent while protecting dignity, independence, safety, and family relationships.',
    metaDescription:
      'Use compassionate scripts to discuss assisted living with a parent while protecting dignity, independence, safety, and family relationships.',
    primaryCta: { href: '/care/assisted-living-cost-calculator/', label: 'Estimate Assisted Living Cost' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/guides/home-care-vs-assisted-living-vs-memory-care-vs-nursing-home/', label: 'Compare Care Settings' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Start With The Care Plan, Not The Building

Telling a parent assisted living may be needed can feel like betrayal.

But the conversation does not have to begin with:

"You have to move."

It can begin with:

"The current plan is no longer keeping you safe enough."

## The Kefiw Conversation Order

Do not start with the facility. Start with the facts.

- What has changed?
- What is unsafe?
- What is unsustainable?
- What options exist?
- What can be tried first?
- What would trigger a move?

## Script For Opening The Conversation

"I know home matters to you. I also know the last few months have been harder. We need to talk about what support would keep you safe and what options we should understand before there is a crisis."

## Script When The Parent Says, "I Am Not Leaving My Home"

"I hear that. We are not deciding everything today. But we do need to look at whether the current setup is still safe, and what would have to change for you to stay here."

## Script When Assisted Living Is The Safer Option

"This is not because you failed. It is because your needs changed. Assisted living may give you more support, more routine, and less risk than trying to patch everything together at home."

## Script When Family Caregivers Are Exhausted

"We love you, and we are still here. But family care alone is no longer enough. We need a plan that does not depend on one person being available all the time."

## Kefiw Tip: Tour Before Crisis

Say:

"Touring is not committing. Touring gives us information."

Families who tour before a crisis often have more choice, less panic, and better questions.

## What To Avoid

Avoid:

- Threats.
- Surprise interventions.
- "We already picked a place."
- Using one fall as the only argument.
- Comparing the parent to someone else.
- Making the conversation only about cost.

## Red Flags

- The parent is unsafe alone.
- Home care hours are approaching or exceeding assisted living cost.
- The primary caregiver is burning out.
- Medication, meals, hygiene, or falls are worsening.
- The family has no backup plan.
- A move is discussed only after hospitalization.

## Closing Script

"Let us agree on what would make home no longer safe enough. If those things happen, we revisit assisted living together."

## Related Kefiw Tools

- [Assisted Living Cost Calculator](/care/assisted-living-cost-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'geriatric care manager, therapist',
      [SOURCE_NIA_CAREGIVER_WORKSHEETS, SOURCE_AARP_ASSISTED_LIVING],
    ),
  },

  'art-care-discuss-memory-changes': {
    slug: 'discuss-memory-changes-with-loved-one',
    title: 'How to Discuss Memory Changes With a Loved One | Kefiw',
    h1: 'How to Discuss Memory Changes With a Loved One',
    description:
      'Use gentle scripts to talk about memory changes, doctor visits, safety concerns, dementia evaluation, and family support.',
    metaDescription:
      'Use gentle scripts to talk about memory changes, doctor visits, safety concerns, dementia evaluation, and family support.',
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/memory-care-cost-calculator/', label: 'Memory Care Cost Calculator' },
      { href: '/health/medical-triage/', label: 'Care Urgency Check' },
      { href: '/care/guides/memory-care-guide-for-families/', label: 'Memory Care Guide' },
    ],
    longformMarkdown: withChecklistFooter(
      `## Do Not Diagnose At The Kitchen Table

Memory conversations can feel threatening because they touch identity, independence, fear, and control.

The goal is not to diagnose your loved one at the kitchen table. The goal is to describe what you have noticed, reduce shame, and encourage a professional evaluation when appropriate.

NIA materials on talking with a doctor emphasize preparing questions, bringing up problems the doctor may not ask about, and speaking up when instructions are unclear.

## Start With Observations, Not Labels

Avoid:

"You have dementia."

Try:

"I noticed you got lost driving home from the store twice this month."

Avoid:

"You are not thinking clearly."

Try:

"I noticed bills are piling up, and that is unusual for you."

## The Kefiw Memory Conversation Formula

Use:

Specific observation + concern + next step

Example:

"You missed two medication doses this week, and that worries me because those medicines matter. Can we bring this up with your doctor?"

## Script For A Doctor Visit

"This may be nothing, but we have noticed a few changes in memory, driving, medication, and bills. We would like to talk with the doctor and understand what could be causing it."

## Script When The Person Gets Defensive

"I am not trying to label you. I am trying to understand what changed so we can support you early."

## Script When The Person Denies Everything

"I hear that you feel fine. I am not asking you to agree with every concern. I am asking if we can bring the examples to the doctor and get another perspective."

## Script For Dementia-Sensitive Communication

"Let us take this one step at a time."

The Alzheimer's Association recommends asking one question at a time, using yes/no questions when helpful, avoiding criticizing or arguing, and offering clear step-by-step instructions.

## What To Document

Track:

- Missed medications.
- Getting lost.
- Repeated questions.
- Unpaid bills.
- Spoiled food.
- Unsafe cooking.
- New paranoia.
- Personality changes.
- Falls.
- Driving concerns.
- Missed appointments.
- New difficulty with familiar tasks.

## Kefiw Tip: Bring Examples, Not Conclusions

A doctor can work with:

"Three missed medications, two driving incidents, one unpaid utility bill."

That is more useful than:

"Something is wrong."

## Red Flags

- Getting lost in familiar places.
- Leaving stove or appliances on.
- Medication mistakes.
- Unsafe driving.
- Falling for scams.
- Wandering.
- Sudden confusion.
- Major change from baseline.
- A caregiver is afraid to leave the person alone.

Sudden confusion or sudden major change should be treated as a medical concern, not assumed to be normal aging.

## Closing Script

"We do not have to solve this today. Let us write down what we have noticed and ask the doctor what should be checked."

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Memory Care Cost Calculator](/care/memory-care-cost-calculator/)
- [Care Urgency Check](/health/medical-triage/)`,
      'clinician, dementia care specialist, geriatric care manager',
      [SOURCE_NIA_TALKING_WITH_DOCTOR, SOURCE_ALZ_COMMUNICATION, SOURCE_MEDLINEPLUS_EMERGENCY],
    ),
  },
};

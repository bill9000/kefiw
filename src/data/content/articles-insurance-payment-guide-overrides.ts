import type { ContentPageConfig } from '../content-pages';

const SOURCE_HEALTHCARE_TOTAL_COSTS =
  '[HealthCare.gov: Your total costs for health care](https://www.healthcare.gov/choose-a-plan/your-total-costs/)';
const SOURCE_HEALTHCARE_OOP_MAX =
  '[HealthCare.gov: 2026 out-of-pocket maximum](https://www.healthcare.gov/glossary/out-of-pocket-maximum-limit/)';
const SOURCE_IRS_HSA_2026 =
  '[IRS: 2026 HSA and HDHP limits](https://www.irs.gov/irb/2025-21_IRB)';
const SOURCE_IRS_FSA_2026 =
  '[IRS: 2026 health FSA limit](https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill)';
const SOURCE_IRS_P15B =
  '[IRS Publication 15-B: 2026 dependent care assistance limit](https://www.irs.gov/publications/p15b)';
const SOURCE_IRS_P502 =
  '[IRS Publication 502: Medical and dental expenses](https://www.irs.gov/publications/p502)';
const SOURCE_IRS_P969 =
  '[IRS Publication 969: HSAs and other tax-favored health plans](https://www.irs.gov/publications/p969)';
const SOURCE_IRS_DEPENDENT_CARE =
  '[IRS Topic 602: Child and Dependent Care Credit](https://www.irs.gov/taxtopics/tc602)';
const SOURCE_MEDICAID_LTSS =
  '[Medicaid.gov: Long-term services and supports](https://www.medicaid.gov/medicaid/long-term-services-supports)';
const SOURCE_MEDICAID_HCBS =
  '[Medicaid.gov: Home and community-based services](https://www.medicaid.gov/medicaid/home-community-based-services)';
const SOURCE_MEDICAID_HCBS_1915C =
  '[Medicaid.gov: 1915(c) HCBS waivers](https://www.medicaid.gov/medicaid/home-community-based-services/home-community-based-services-authorities/home-community-based-services-1915c)';
const SOURCE_MEDICAID_ESTATE_RECOVERY =
  '[Medicaid.gov: Estate recovery](https://www.medicaid.gov/medicaid/eligibility-policy/estate-recovery)';
const SOURCE_ACL_LTC_INSURANCE_CLAIMS =
  '[ACL: Receiving long-term care insurance benefits](https://acl.gov/ltc/costs-and-who-pays/what-is-long-term-care-insurance/receiving-long-term-care-insurance-benefits)';
const SOURCE_VA_AID_ATTENDANCE =
  '[VA: Aid and Attendance benefits and Housebound allowance](https://www.va.gov/pension/aid-attendance-housebound/)';
const SOURCE_VA_LONG_TERM_CARE =
  '[VA: Nursing homes, assisted living, and home health care](https://www.va.gov/health-care/about-va-health-benefits/long-term-care/)';
const SOURCE_CFPB_NURSING_HOME_DEBT =
  '[CFPB: Caregivers and nursing home debt](https://www.consumerfinance.gov/consumer-tools/educator-tools/resources-for-older-adults/know-your-rights-caregivers-and-nursing-home-debt/)';

const sharedPaymentDisclaimer = `## Kefiw Insurance And Payment Disclaimer

Kefiw provides educational care-planning tools and guides. This content does not provide legal, tax, financial, insurance, Medicaid, VA, or medical advice. Rules, eligibility, covered services, tax treatment, account limits, provider participation, and benefits vary by person, state, employer, plan, policy, and year. Confirm details with the appropriate agency, insurer, employer, tax professional, elder law attorney, licensed insurance professional, or qualified advisor.

## Continue Planning With Kefiw

- [Build a family care budget](/care/family-care-budget-calculator/)
- [Estimate senior care cost](/care/senior-care-cost-calculator/)
- [Use the HSA / FSA Calculator](/care/hsa-fsa-calculator/)
- [Estimate health insurance cost](/care/health-insurance-cost-calculator/)
- [Estimate long-term care insurance gaps](/care/long-term-care-insurance-calculator/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withPaymentFooter(
  body: string,
  reviewer: string,
  sources: string[],
  options: { appliesTo2026?: boolean } = {},
): string {
  const applies = options.appliesTo2026
    ? `## Applies To 2026

Applies to 2026 limits, account rules, Marketplace out-of-pocket caps, or tax-related planning details where stated. Review annually before open enrollment, benefits enrollment, and tax filing.

`
    : '';

  return `${applies}${body}

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedPaymentDisclaimer}`;
}

export const CARE_INSURANCE_PAYMENT_NEW_GUIDES: ContentPageConfig[] = [
  {
    id: 'art-care-va-benefits-senior-care-basics',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Insurance & Payment Guides',
    slug: 'va-benefits-senior-care-basics',
    title: 'VA Benefits and Senior Care: Aid and Attendance, Housebound Benefits, and Care Costs | Kefiw',
    h1: 'VA Benefits and Senior Care Basics',
    description:
      'Learn how VA Aid and Attendance or Housebound benefits may help eligible veterans and survivors with senior care costs.',
    metaDescription:
      'Learn how VA Aid and Attendance or Housebound benefits may help eligible veterans and survivors with senior care costs.',
    keywords: ['VA benefits senior care', 'Aid and Attendance senior care', 'Housebound benefits care costs'],
    intro:
      'Some families overlook VA benefits when planning senior care. For eligible veterans and survivors, pension-related benefits may help support care needs.',
    outcomeLine:
      'VA Aid and Attendance and Housebound benefits are added pension benefits, not automatic care coverage.',
    faq: [
      {
        q: 'Do all veterans qualify for Aid and Attendance?',
        a: 'No. VA Aid and Attendance is tied to VA pension eligibility plus care-need requirements. Families should confirm service, pension, income, net worth, and medical documentation rules through VA or accredited help.',
        faq_intent: 'trust',
      },
      {
        q: 'Can someone receive Aid and Attendance and Housebound benefits at the same time?',
        a: 'VA states that Aid and Attendance and Housebound benefits cannot be received at the same time.',
        faq_intent: 'definition',
      },
      {
        q: 'What should families gather before applying?',
        a: 'Start with service history, discharge details, pension eligibility information, income and net worth details, care expense records, ADL documentation, and medical examiner forms requested by VA.',
        faq_intent: 'how-to',
      },
    ],
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/how-families-pay-for-long-term-care/', label: 'How Families Pay for Long-Term Care' },
    ],
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

VA Aid and Attendance and Housebound benefits are not automatic senior care benefits. They are added monthly payments for qualified veterans and survivors who already meet VA pension-related requirements and have qualifying care needs.

VA says Aid and Attendance or Housebound benefits provide monthly payments added to a monthly VA pension for qualified veterans and survivors. A person may be eligible for Aid and Attendance if they receive VA pension and need another person to help with daily activities like bathing, feeding, and dressing; are bedridden; are in a nursing home due to loss of mental or physical abilities; or meet VA eyesight criteria. VA also says Aid and Attendance and Housebound benefits cannot be received at the same time.

## What VA Benefits May Help With

VA long-term care materials explain that veterans may be able to get long-term care services in settings such as nursing homes, assisted living centers, adult day health centers, or at home. Some services may be covered under VA health benefits, while other services may require Medicaid, Medicare, private insurance, or private pay.

For family planning, the cautious wording is "may help." Do not treat VA benefits as guaranteed coverage until eligibility, application, documentation, and payment amount are confirmed.

## What Families Often Miss

Families often miss three things:

- The veteran or survivor must first meet VA pension-related eligibility rules.
- Medical need alone is not enough.
- The application requires documentation.

VA says a medical examiner must fill out the examination information section for Aid and Attendance or Housebound applications. If the person is in a nursing home, VA also requires a Request for Nursing Home Information form.

## Kefiw Tip: Create The VA Eligibility Snapshot

Before applying, gather:

- Service history.
- Discharge status.
- Wartime service information.
- Marital status.
- Income.
- Net worth.
- Medical expenses.
- Care setting.
- Need for help with activities of daily living.
- Physician or medical examiner documentation.
- Nursing home or facility documentation if relevant.

This snapshot prevents the family from arguing over whether VA benefits "should" apply before checking the actual rules.

## Family Script

"Before we assume VA benefits do or do not apply, let us check whether there is wartime service, pension eligibility, care need documentation, and whether Aid and Attendance or Housebound benefits may fit."

## Red Flags

- The family assumes all veterans qualify.
- The family assumes no veterans qualify.
- No one checks surviving spouse eligibility.
- Medical expenses are not documented.
- Caregiver help with daily activities is not documented.
- The application is submitted without medical examiner information.
- The family pays an advisor before checking accreditation or fee rules.
- Aid and Attendance and Housebound are confused.

## Checklist

- Confirm veteran or survivor status.
- Confirm VA pension eligibility.
- Review Aid and Attendance criteria.
- Review Housebound criteria.
- Document ADL help needs.
- Document care expenses.
- Gather medical examiner information.
- Gather nursing home form if needed.
- Use official VA application channels or accredited help.
- Add expected VA timing to the care payment map.`,
      'VA-accredited representative, elder law attorney, or benefits specialist',
      [SOURCE_VA_AID_ATTENDANCE, SOURCE_VA_LONG_TERM_CARE],
    ),
  },
];

export const CARE_INSURANCE_PAYMENT_GUIDE_OVERRIDES: Record<string, Partial<ContentPageConfig>> = {
  'art-care-pay-for-long-term-care': {
    title: 'How Families Pay for Long-Term Care: Private Pay, Medicaid, Insurance, and Family Support | Kefiw',
    h1: 'How Families Pay for Long-Term Care',
    metaDescription:
      'Learn the main ways families pay for long-term care, including savings, income, Medicaid, long-term care insurance, VA benefits, home equity, and family contributions.',
    relatedLinks: [
      { href: '/care/guides/medicaid-long-term-care-basics/', label: 'Medicaid and Long-Term Care Basics' },
      { href: '/care/guides/va-benefits-senior-care-basics/', label: 'VA Benefits and Senior Care Basics' },
      { href: '/care/guides/long-term-care-insurance-claims-guide/', label: 'LTC Insurance Claims Guide' },
    ],
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

Long-term care is usually not paid for by one source. Families often build a patchwork.

That patchwork may include income, savings, home equity, Medicaid, long-term care insurance, VA benefits, family contributions, community programs, and unpaid caregiving time.

The mistake families make is looking for one answer too late. A better approach is to create a care payment map before the care need becomes urgent.

Medicaid is especially important because Medicaid.gov describes Medicaid as the primary payer across the nation for long-term care services, including services across institutional settings and home and community-based long-term services and supports.

## The Kefiw Care Payment Map

Use five columns:

| Source | What it may pay for | What it may not pay for | Timing | Who verifies it |
|---|---|---|---|---|
| Parent income | Monthly care bills | Large gaps | Now | Family or financial advisor |
| Savings | Private-pay care | Long-term sustainability | Now | Family or advisor |
| Long-term care insurance | Covered care services | Exclusions, waiting periods | Claim-based | Insurer |
| Medicaid | Eligible long-term care services | State-specific limits | Eligibility-based | Medicaid or elder law attorney |
| VA benefits | Added pension support for eligible veterans or survivors | Not automatic; eligibility required | Application-based | VA or accredited representative |

The key question is not only, "Do we have money?" The better question is:

"Which source pays which bill, when, under what rules?"

## What Families Often Miss

Families often compare care costs without checking payment timing.

Example: a parent may have long-term care insurance, but the policy may have an elimination period before benefits start. A parent may eventually qualify for Medicaid, but eligibility and covered services vary by state. A veteran may qualify for Aid and Attendance, but the benefit is not automatic.

The payment plan needs a bridge strategy.

## Kefiw Tip: Build The 90-Day Bridge

Before choosing a facility or home care schedule, ask:

"How will we pay for the first 90 days?"

This matters because families may be waiting for insurance claims, Medicaid decisions, VA paperwork, home sale proceeds, or sibling contributions.

The bridge plan should include:

- First month's care cost.
- Deposits or move-in fees.
- Medication and supply costs.
- Transportation.
- Backup care.
- Legal or application costs.
- Family reimbursement rules.

## Family Script

"Let us not argue yet about who pays. First, let us list every possible payment source, what it can pay for, when it starts, and what gap remains."

## Questions To Ask

- What care is needed now?
- What care may be needed in six months?
- What does monthly income cover?
- What savings are available?
- Is there long-term care insurance?
- Could Medicaid become relevant?
- Could VA benefits apply?
- Is home equity part of the plan?
- Who has legal authority to access funds?
- What is the 90-day payment bridge?

## Red Flags

- The family assumes Medicare will pay for long-term care.
- A facility quote is accepted before payment sources are verified.
- No one has read the long-term care insurance policy.
- The family waits to ask about Medicaid until savings are nearly gone.
- One sibling is paying bills without a written reimbursement plan.
- No one knows who has power of attorney.
- The care plan depends on unpaid family care that has not been agreed to.

## Checklist

- Estimate monthly care cost.
- Estimate annual care cost.
- List all income sources.
- List available savings.
- Locate long-term care insurance policies.
- Check VA benefit possibilities.
- Check Medicaid relevance with state-specific help.
- Confirm who has financial authority.
- Create a 90-day payment bridge.
- Build a written family care budget.

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Long-Term Care Insurance Calculator](/care/long-term-care-insurance-calculator/)`,
      'elder law attorney, financial planner, Medicaid specialist, or licensed insurance professional',
      [SOURCE_MEDICAID_LTSS, SOURCE_VA_AID_ATTENDANCE, SOURCE_ACL_LTC_INSURANCE_CLAIMS],
    ),
  },
  'art-care-health-insurance-cost-guide': {
    title: 'Health Insurance Cost Guide: Premiums, Deductibles, Copays, Coinsurance, and Out-of-Pocket Maximums | Kefiw',
    h1: 'Health Insurance Cost Guide',
    metaDescription:
      'Understand total health insurance cost, including premiums, deductibles, copays, coinsurance, out-of-pocket maximums, networks, and uncovered services.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

Health insurance cost is more than the monthly premium.

A low-premium plan can still be expensive if the deductible is high, the network is narrow, prescriptions cost more, or the person needs frequent care.

HealthCare.gov describes total health care costs as the premium plus deductible plus out-of-pocket costs plus copayments or coinsurance. It also notes that deductibles, copayments, and coinsurance can add a lot to total yearly costs, sometimes more than the plan premium.

## What To Compare

To estimate health insurance cost, compare:

- Premium.
- Deductible.
- Copays.
- Coinsurance.
- Out-of-pocket maximum.
- Prescription costs.
- Network access.
- Out-of-network exposure.
- Services not covered by the plan.

For 2026 Marketplace plans, HealthCare.gov says the out-of-pocket limit cannot be more than $10,600 for an individual and $21,200 for a family. That limit does not include premiums, non-covered services, out-of-network care, or costs above allowed amounts.

## The Kefiw Total-Cost Formula

Use this formula:

Annual premium + expected care costs + expected drug costs + likely uncovered costs + bad-year risk = real plan cost

Do not compare plans by premium alone.

## What Families Often Miss

Families often forget that the out-of-pocket maximum does not include everything.

It may not include:

- Monthly premiums.
- Out-of-network care.
- Services the plan does not cover.
- Costs above allowed amounts.
- Non-medical caregiving costs.
- Long-term custodial care.
- Assisted living or room and board.

This matters for family care planning because health insurance may help with medical care, but it may not solve the care budget.

## Kefiw Tip: Compare The Normal Year And The Bad Year

Create two estimates.

Normal year:

- Premiums.
- Routine visits.
- Prescriptions.
- Expected labs.
- Therapy.
- Minor urgent care.

Bad year:

- Hospitalization.
- Imaging.
- Surgery.
- Specialists.
- Expensive medications.
- Rehab.
- High coinsurance.
- Reaching the out-of-pocket maximum.

The best plan is not always the cheapest plan in a normal year. It is the plan whose risk your family can survive in a bad year.

## Questions To Ask

- Are current doctors in network?
- Are preferred hospitals in network?
- Are prescriptions covered?
- What is the deductible?
- Does the deductible apply to prescriptions?
- What are copays?
- What is the coinsurance?
- What is the out-of-pocket maximum?
- What services are not covered?
- What happens out of network?

## Red Flags

- Choosing a plan only by monthly premium.
- Not checking doctors.
- Not checking prescriptions.
- Ignoring out-of-network rules.
- Assuming all care counts toward the out-of-pocket maximum.
- Ignoring prior authorization.
- Ignoring family caregiving costs that insurance does not cover.

## Checklist

- Calculate annual premium.
- Add expected visits.
- Add expected prescriptions.
- Add deductible exposure.
- Add copays.
- Add coinsurance.
- Check out-of-pocket maximum.
- Check network.
- Check prior authorization.
- Check uncovered services.
- Use Kefiw's Health Insurance Cost Calculator.

## Related Kefiw Tools

- [Health Insurance Cost Calculator](/care/health-insurance-cost-calculator/)
- [HSA / FSA Calculator](/care/hsa-fsa-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'licensed health insurance professional',
      [SOURCE_HEALTHCARE_TOTAL_COSTS, SOURCE_HEALTHCARE_OOP_MAX],
      { appliesTo2026: true },
    ),
  },
  'art-care-hsa-guide': {
    slug: 'hsa-guide-care-expenses',
    title: 'HSA Guide for Care Expenses: 2026 Limits, Eligible Expenses, and Family Planning | Kefiw',
    h1: 'HSA Guide for Care Expenses',
    metaDescription:
      'Learn how Health Savings Accounts work, 2026 HSA limits, eligible medical expenses, Medicare premium rules, and how families can use HSAs in care planning.',
    relatedLinks: [
      { href: '/care/guides/use-hsa-fsa-for-caregiving-expenses/', label: 'HSA/FSA Caregiving Expenses' },
      { href: '/care/guides/fsa-guide-family-care-expenses/', label: 'FSA Guide for Family Care Expenses' },
    ],
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

A Health Savings Account, or HSA, can be a powerful care-planning tool because unused money can generally stay in the account year after year.

But an HSA is not a general caregiving account. It has eligibility rules, contribution limits, and qualified medical expense rules.

For 2026, IRS guidance lists HSA contribution limits of $4,400 for self-only HDHP coverage and $8,750 for family HDHP coverage. The IRS also defines a 2026 high-deductible health plan as having an annual deductible of at least $1,700 for self-only coverage or $3,400 for family coverage, with annual out-of-pocket expenses not exceeding $8,500 for self-only coverage or $17,000 for family coverage, excluding premiums.

## What Families Can Use An HSA For

Depending on the expense and the person's tax situation, HSA funds may help with:

- Medical bills.
- Dental and vision expenses.
- Prescriptions.
- Some medical equipment.
- Certain long-term care insurance premiums.
- Certain Medicare premiums after age 65.
- Qualified long-term care services when they meet IRS rules.

IRS Publication 969 explains that HSA distributions can be tax-free when used for qualified medical expenses. Publication 969 also explains that some insurance premiums may qualify, including long-term care insurance, COBRA-type continuation coverage, health coverage while receiving unemployment compensation, and Medicare or other health coverage after age 65, excluding Medigap premiums.

## What Families Often Miss

Families often think:

"My parent has care expenses, so I can use my HSA."

The real question is:

"Is this a qualified medical expense for me, my spouse, or someone who qualifies under the tax rules?"

That is a tax-specific question.

## Kefiw Tip: Create An HSA Do-Not-Guess List

Before using HSA money for a caregiving-related expense, flag these for professional review:

- Home care.
- Assisted living.
- Memory care.
- Nursing home bills.
- Long-term care insurance premiums.
- Home modifications.
- Transportation.
- Incontinence supplies.
- Family caregiver payments.
- Expenses for someone who may not be a tax dependent.

This prevents accidental nonqualified withdrawals.

## Withdrawal Warning

IRS Publication 969 explains that HSA distributions not used for qualified medical expenses are included in income and may be subject to an additional 20% tax, with exceptions after disability, age 65, or death.

## Family Script

"Before we use HSA funds for this care expense, let us confirm whether the expense is qualified, whether the person qualifies under the tax rules, and whether we need documentation."

## Red Flags

- Using HSA money for general household help.
- Using HSA money for a relative who does not qualify under tax rules.
- Paying insurance premiums that are not HSA-eligible.
- Forgetting to save receipts.
- Assuming all long-term care costs qualify.
- Using HSA funds before the HSA was established.
- Double-counting expenses already reimbursed by insurance.

## Checklist

- Confirm HSA eligibility.
- Confirm 2026 contribution limit.
- Confirm the person receiving care qualifies under HSA rules.
- Confirm the expense is qualified.
- Save receipts.
- Save plan-of-care documents if relevant.
- Track reimbursements.
- Avoid double-dipping.
- Ask a tax professional for unclear expenses.
- Use Kefiw's HSA / FSA Calculator.

## Related Kefiw Tools

- [HSA / FSA Calculator](/care/hsa-fsa-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Long-Term Care Insurance Calculator](/care/long-term-care-insurance-calculator/)`,
      'tax professional, benefits specialist, or financial planner',
      [SOURCE_IRS_HSA_2026, SOURCE_IRS_P969, SOURCE_IRS_P502],
      { appliesTo2026: true },
    ),
  },
  'art-care-fsa-guide': {
    slug: 'fsa-guide-family-care-expenses',
    title: 'FSA Guide for Family Care Expenses: Health FSAs, Dependent Care FSAs, and 2026 Limits | Kefiw',
    h1: 'FSA Guide for Family Care Expenses',
    metaDescription:
      'Understand health FSAs, dependent care FSAs, 2026 contribution limits, eligible expenses, and how to plan family care spending.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

Flexible Spending Accounts can help families set aside pre-tax money for certain expenses, but the word "FSA" can mean different things.

The two most important versions for Kefiw users are:

- Health FSA: for eligible medical expenses.
- Dependent Care FSA: for qualifying care expenses that allow someone to work or look for work.

They are not interchangeable.

For 2026, the IRS lists the health FSA salary-reduction limit as $3,400, with a maximum carryover of $680 if the employer's cafeteria plan permits carryover. IRS Publication 15-B says the dependent care assistance exclusion limit for 2026 is $7,500, or $3,750 for married filing separately.

## The Kefiw FSA Split

Use this rule:

Health FSA = medical care.

Examples may include copays, prescriptions, dental, vision, medical equipment, and some qualified care-related medical expenses.

Dependent Care FSA = care so you can work.

Examples may include qualifying care for an eligible child or qualifying adult dependent so the employee and spouse, if filing jointly, can work or look for work.

The IRS says the Child and Dependent Care Credit may apply when someone pays qualified expenses for the care of a qualifying individual so they and their spouse, if filing jointly, can work or look for work. Qualifying persons can include a disabled spouse or dependent of any age who is incapable of self-care and lives with the taxpayer for more than half the year.

## What Families Often Miss

Families often confuse:

- Health FSA.
- Dependent Care FSA.
- HSA.
- HRA.
- Child and Dependent Care Credit.

Kefiw should avoid saying "covered" until the user identifies which account they have and whose expense it is.

## Kefiw Tip: Build The FSA Use-It-On-Purpose Plan

Before electing an FSA amount, estimate predictable expenses:

- Regular copays.
- Prescriptions.
- Dental or vision costs.
- Therapy.
- Medical equipment.
- Known dependent care costs.
- Recurring adult day care or qualifying care expenses.
- Expected procedures.

Then separate:

- Certain expenses: already scheduled or recurring.
- Likely expenses: predictable but not guaranteed.
- Unclear expenses: need HR or tax review before election.

## Family Script

"Let us not choose an FSA amount based on hope. Let us list predictable expenses, verify eligibility, and avoid putting money into an account unless we know how we will use it."

## Red Flags

- Using a health FSA for dependent care expenses.
- Using a dependent care FSA for medical expenses.
- Choosing the maximum contribution without an expense plan.
- Assuming a parent's care qualifies automatically.
- Forgetting employer-specific rules.
- Missing claim deadlines.
- Forgetting to save receipts.
- Confusing FSA eligibility with tax deduction eligibility.

## Checklist

- Confirm whether the account is a health FSA or dependent care FSA.
- Confirm 2026 limit.
- Confirm employer rules.
- Confirm eligible expenses.
- Estimate predictable costs.
- Save receipts.
- Track deadlines.
- Ask HR before uncertain claims.
- Ask a tax professional for complex family situations.
- Use Kefiw's HSA / FSA Calculator.

## Related Kefiw Tools

- [HSA / FSA Calculator](/care/hsa-fsa-calculator/)
- [Health Insurance Cost Calculator](/care/health-insurance-cost-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'tax professional, benefits specialist, or HR benefits expert',
      [SOURCE_IRS_FSA_2026, SOURCE_IRS_P15B, SOURCE_IRS_DEPENDENT_CARE, SOURCE_IRS_P502],
      { appliesTo2026: true },
    ),
  },
  'art-care-hsa-fsa-caregiving-expenses': {
    slug: 'use-hsa-fsa-for-caregiving-expenses',
    title: 'Can I Use HSA or FSA Money for Caregiving Expenses? | Kefiw',
    h1: 'Can I Use HSA or FSA Money for Caregiving Expenses?',
    metaDescription:
      'Learn which caregiving expenses may qualify for HSA or FSA use, which usually do not, and what documentation families should keep.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

Sometimes yes. Sometimes no.

That is the honest answer.

Whether an HSA or FSA can be used for a caregiving-related expense depends on:

- The type of account.
- The relationship to the person receiving care.
- Whether the person qualifies under tax rules.
- Whether the expense is medical care or general household support.
- Whether the expense is reimbursed by insurance.
- Whether documentation exists.

IRS rules can allow certain medical, long-term care, nursing-type, and transportation expenses to count as medical expenses. But general caregiving, household help, ordinary living expenses, and family convenience costs may not qualify.

## Expenses Worth Checking

These may be eligible in some situations:

- Nursing services.
- Qualified long-term care services.
- Medical transportation.
- Certain home care tied to nursing-type services.
- Certain long-term care insurance premiums.
- Medical equipment.
- Wheelchairs.
- Hearing aids.
- Dental and vision care.
- Prescription drugs.
- Some home modifications for medical needs.

IRS Publication 502 says qualified long-term care services may be included as medical expenses when they are required by a chronically ill individual and provided under a plan of care prescribed by a licensed health care practitioner.

Publication 502 also says wages paid for nursing services may be included as medical expenses, even if the services are not performed by a nurse, as long as the services are generally of a kind performed by a nurse, such as giving medication, changing dressings, bathing, or grooming related to the patient's condition.

## Expenses That Often Do Not Qualify

These often create problems:

- General household help.
- Ordinary meals.
- Rent or room and board not tied to medical care rules.
- Companion care without medical or qualified long-term care basis.
- General wellness items.
- Unclear family caregiver payments.
- Expenses for someone who does not qualify under tax rules.
- Expenses already reimbursed by insurance.

IRS Publication 502 says household help is generally not includible as a medical expense, although certain nursing-type services and certain maintenance or personal care services for qualified long-term care may be included.

## The Kefiw Three-Question Test

Before using HSA or FSA money, ask:

1. Who is the expense for?

Does the person qualify under account and tax rules?

2. What is the expense really for?

Medical care, qualified long-term care, dependent care, household convenience, or general support?

3. What documentation supports it?

Receipt, invoice, doctor note, plan of care, care provider invoice, insurer explanation, or employer benefits guidance?

## Kefiw Tip: Separate Care From Comfort

Many caregiving expenses are valuable but not tax-advantaged.

Example:

- A grab bar may qualify if it is for medical accessibility.
- A general bathroom remodel may not fully qualify.
- Nursing-type services may qualify.
- Routine housekeeping may not.
- Transportation primarily for medical care may qualify.
- Social transportation may not.

This distinction should be built into how families use Kefiw's HSA / FSA Calculator.

## Family Script

"This may be a real care expense, but that does not automatically make it HSA- or FSA-eligible. Let us classify it before we pay."

## Red Flags

- Using tax-advantaged money for vague invoices.
- No care plan for long-term care services.
- No receipt.
- No medical reason documented.
- No confirmation that the person qualifies.
- Paying a family caregiver without tax or benefits guidance.
- Assuming assisted living or home care is automatically eligible.
- Double-paying with insurance and HSA/FSA funds.

## Checklist

- Identify the account type.
- Identify who received care.
- Confirm tax relationship.
- Classify the expense.
- Check IRS guidance.
- Ask HR or the account administrator.
- Save receipts.
- Save medical documentation.
- Save plan-of-care documents.
- Ask a tax professional for unclear expenses.

## Related Kefiw Tools

- [HSA / FSA Calculator](/care/hsa-fsa-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)`,
      'tax professional or benefits specialist',
      [SOURCE_IRS_P502, SOURCE_IRS_P969, SOURCE_IRS_DEPENDENT_CARE],
      { appliesTo2026: true },
    ),
  },
  'art-care-medicaid-ltss-basics': {
    slug: 'medicaid-long-term-care-basics',
    title: 'Medicaid and Long-Term Care Basics for Families | Kefiw',
    h1: 'Medicaid and Long-Term Care Basics',
    metaDescription:
      'Understand how Medicaid may help pay for long-term care, why rules vary by state, what eligibility means, and what families should ask before applying.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

Medicaid is one of the most important long-term care payment sources in the United States, but it is also one of the most misunderstood.

Medicaid is not simply "free nursing home care." It is a joint federal-state program with eligibility rules, covered services, financial rules, estate recovery rules, and state-specific differences.

Medicaid.gov says Medicaid is the primary payer across the nation for long-term care services and supports, including institutional care and home and community-based long-term services and supports.

## What Medicaid May Cover

Depending on the state and eligibility category, Medicaid may help with:

- Nursing facility care.
- Home and community-based services.
- Personal care.
- Case management.
- Some home health services.
- Services that help people remain in the community.
- Services for people who need a nursing-facility level of care.

Covered services vary by state, waiver, program, and eligibility group.

## What Families Often Miss

Families often wait too long to learn the rules.

That can create problems with:

- Asset transfers.
- Spend-down.
- Documentation.
- Estate recovery.
- Spousal protections.
- Home ownership.
- Application timing.
- Facility selection.
- Medicaid acceptance.

## Kefiw Tip: Prepare The Medicaid Document Box Early

Do not wait until the application is urgent.

Start gathering:

- Bank statements.
- Income records.
- Insurance policies.
- Property records.
- Trust documents.
- Retirement accounts.
- Medical records.
- Care needs documentation.
- Marriage documents.
- Funeral or burial contracts.
- Long-term care insurance policy.
- Power of attorney documents.

## Application Timing Note

Medicaid rules can include retroactive coverage concepts, state-specific application rules, and provider participation rules. This does not mean every bill will be covered. Families should confirm state rules and provider participation before relying on Medicaid for a specific service or facility.

## Family Script

"Before we spend assets or move money, we need state-specific Medicaid advice. A well-intended transfer could create eligibility problems."

## Red Flags

- Giving away assets without legal advice.
- Assuming rules are the same in every state.
- Waiting until savings are nearly gone.
- Not asking whether the facility accepts Medicaid.
- Not keeping financial records.
- Confusing Medicare and Medicaid.
- Ignoring estate recovery.
- Applying without understanding spousal rules.

## Checklist

- Identify state Medicaid program.
- Confirm functional eligibility requirements.
- Confirm financial eligibility rules.
- Gather financial records if long-term care Medicaid may apply.
- Ask whether the provider accepts Medicaid.
- Ask about Medicaid pending status.
- Review estate recovery.
- Speak with an elder law attorney before transfers.
- Build a private-pay-to-Medicaid transition plan if needed.

## Related Kefiw Tools

- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'elder law attorney or Medicaid specialist',
      [SOURCE_MEDICAID_LTSS, SOURCE_MEDICAID_ESTATE_RECOVERY],
    ),
  },
  'art-care-medicaid-hcbs': {
    slug: 'medicaid-home-community-based-services',
    title: 'Medicaid Home and Community-Based Services: HCBS Guide for Families | Kefiw',
    h1: 'Medicaid Home and Community-Based Services Guide',
    metaDescription:
      'Learn how Medicaid home and community-based services may help older adults receive care at home or in the community instead of an institution.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

Many families assume Medicaid long-term care means a nursing home.

That is not always true.

Medicaid Home and Community-Based Services, often called HCBS, may help eligible people receive services at home or in community settings rather than in an institution.

Medicaid.gov says HCBS provide opportunities for Medicaid beneficiaries to receive services in their own homes or communities rather than institutions or other isolated settings.

## What HCBS May Include

Depending on the program, HCBS may include:

- Personal care.
- Homemaker support.
- Adult day services.
- Respite.
- Case management.
- Home modifications.
- Transportation.
- Supported employment.
- Caregiver support.
- Services tied to a person-centered care plan.

Under 1915(c) waivers, Medicaid.gov says states can develop HCBS waivers within broad federal guidelines for people who prefer long-term care services and supports in their home or community rather than in an institution.

## What Families Often Miss

HCBS is not automatic.

Families need to ask:

- Is there a waiver?
- Is there a waitlist?
- What population does the waiver serve?
- Is a nursing-facility level of care required?
- What services are covered?
- Can family caregivers be paid?
- Which providers participate?
- How are hours approved?
- What happens if needs increase?

## Kefiw Tip: Ask For The Service Menu And The Hour Rule

Families often hear "home care is covered" and assume enough hours will be approved.

Ask two separate questions:

"Which services are covered?"

and

"How are hours approved or limited?"

A program may cover personal care, but not enough hours to replace full-time family supervision.

## Family Script

"We want to understand whether Medicaid can support care at home, not just in a facility. What HCBS programs exist in this state, what services do they cover, and is there a waitlist?"

## Red Flags

- The family assumes HCBS will cover all home care needs.
- No one asks about waitlists.
- No one asks about hour limits.
- The care plan requires 24/7 supervision but only part-time support is available.
- Family caregivers assume they can be paid without checking rules.
- The person's needs exceed what HCBS can safely support.
- The home is unsafe but no home modification plan exists.

## Checklist

- Identify state HCBS programs.
- Check eligibility requirements.
- Ask about waitlists.
- Ask which services are covered.
- Ask how hours are determined.
- Ask whether family caregivers can be paid.
- Ask about provider availability.
- Ask about respite.
- Ask about reassessment.
- Build a backup plan if HCBS is delayed or insufficient.

## Related Kefiw Tools

- [Home Care Cost Calculator](/care/home-care-cost-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'Medicaid specialist, aging services professional, or geriatric care manager',
      [SOURCE_MEDICAID_HCBS, SOURCE_MEDICAID_HCBS_1915C],
    ),
  },
  'art-care-medicaid-look-back': {
    slug: 'medicaid-look-back-period',
    title: 'Medicaid Look-Back Period Guide: Asset Transfers, Penalties, and Family Planning | Kefiw',
    h1: 'Medicaid Look-Back Period Guide',
    metaDescription:
      'Understand the Medicaid look-back period, why asset transfers can create penalties, and why families should get legal advice before moving money or property.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

The Medicaid look-back period is one of the most important reasons families should not move money casually when long-term care may be needed.

A well-intended gift, transfer, or retitling of property can create eligibility problems later.

The look-back period is not about judging the family's intentions. It is about whether assets were transferred for less than fair market value before applying for Medicaid long-term care.

If problematic transfers occurred, Medicaid eligibility for long-term care payment may be delayed.

## What Families Often Miss

Families often think:

"Mom gave us money before she needed care, so it should be fine."

The question is not only why the transfer happened. The question is how Medicaid treats it under state rules.

This is why Kefiw should never give DIY asset-transfer advice.

## The Kefiw Do-Not-Move-Money-First Rule

Before transferring, gifting, retitling, selling below market value, adding someone to a deed, moving money into a trust, or paying family members, ask an elder law attorney.

This is especially important for:

- Home transfers.
- Large gifts.
- Paying family caregivers.
- Loans to relatives.
- Trusts.
- Selling assets below market value.
- Moving money between accounts.
- Prepaying expenses.
- Giving a car or property to family.

## Estate Recovery Note

Medicaid estate recovery is also part of long-term care planning. Medicaid.gov says state Medicaid programs must recover certain Medicaid benefits paid on behalf of a Medicaid enrollee. For individuals age 55 or older, states are required to seek recovery from the estate for nursing facility services, home and community-based services, and related hospital and prescription drug services, with certain protections and hardship procedures.

## Family Script

"Before anyone moves money or changes ownership, we need elder law advice. A transfer that feels simple today could create a Medicaid penalty later."

## Questions To Ask An Elder Law Attorney

- How does the look-back period work in this state?
- Which transfers are risky?
- How are gifts treated?
- How are caregiver payments treated?
- How should family loans be documented?
- How is the home treated?
- What spousal protections apply?
- What estate recovery rules apply?
- What records should we keep?
- What should we avoid doing right now?

## Red Flags

- A family member says "just give the house to the kids."
- Money is moved without documentation.
- A caregiver is paid informally.
- Assets are sold below fair market value.
- A trust is created without Medicaid-specific legal advice.
- The family relies on advice from another state.
- Nobody understands estate recovery.
- The Medicaid application is started without financial records.

## Checklist

- Do not transfer assets casually.
- Gather financial records.
- Document all gifts and transfers.
- Document any caregiver payments.
- Review home ownership.
- Review trusts.
- Review spousal protections.
- Review estate recovery.
- Speak with an elder law attorney.
- Build a lawful, state-specific plan.

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'elder law attorney',
      [SOURCE_MEDICAID_LTSS, SOURCE_MEDICAID_ESTATE_RECOVERY],
    ),
  },
  'art-care-ltc-insurance-claims': {
    title: 'Long-Term Care Insurance Claims Guide: How to Start, Document, and Avoid Delays | Kefiw',
    h1: 'Long-Term Care Insurance Claims Guide',
    metaDescription:
      'Learn how to start a long-term care insurance claim, understand benefit triggers, elimination periods, documentation, provider rules, and common claim delays.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

Having long-term care insurance is not the same as having an approved claim.

The claim process often requires documentation, assessment, proof of benefit triggers, provider invoices, and careful tracking through the elimination period.

A long-term care insurance claim usually needs four things:

- Proof that the benefit trigger is met.
- A care plan or assessment.
- Proof that the care provider qualifies under the policy.
- Documentation of costs and dates.

ACL explains that long-term care insurance benefit triggers are criteria used to determine eligibility for benefits, usually defined around Activities of Daily Living or cognitive impairment. Most policies pay when someone needs help with two or more of six ADLs or has cognitive impairment.

## Step 1: Request The Claim Packet

Ask the insurer for:

- Claim forms.
- Benefit summary.
- Policy copy.
- Elimination period rules.
- Provider requirements.
- Plan-of-care requirements.
- Assessment process.
- Invoice requirements.
- Contact person.
- Appeal or dispute process.

## Step 2: Confirm The Benefit Trigger

Common triggers include needing help with Activities of Daily Living or having cognitive impairment. Ask who must certify the trigger, what documentation is required, and whether the insurer sends an assessor.

## Step 3: Understand The Elimination Period

ACL says the elimination period is the time that must pass after a benefit trigger occurs before services are paid, and that it works like a deductible measured in time. Many policies use 30-, 60-, or 90-day elimination periods.

## Kefiw Tip: Ask Calendar Days Or Service Days

This is a major claims detail.

A 90-day calendar elimination period is different from a 90-service-day elimination period.

Ask:

"Does a day count if care was needed, or only if paid covered services were received?"

## What Families Often Miss

Families often start care, then learn later that:

- The provider does not qualify.
- The invoices are not detailed enough.
- The elimination period was not satisfied.
- The care plan was missing.
- Cognitive impairment documentation was incomplete.
- The policy pays reimbursement, not cash.
- The benefit cap is lower than the actual care cost.

## Family Script

"Before we start care based on this policy, please confirm in writing what triggers benefits, which providers qualify, how the elimination period is counted, and exactly what invoices must show."

## Red Flags

- The family has only a brochure, not the policy.
- No one knows the benefit trigger.
- No one knows the elimination period.
- The care provider is hired before eligibility is confirmed.
- Invoices do not list dates, services, or provider details.
- The policy benefit is lower than local care cost.
- The claim contact changes repeatedly.
- The family does not document phone calls.

## Claim Tracking Checklist

- Get full policy.
- Request current benefit summary.
- Request claim packet.
- Confirm benefit trigger.
- Confirm elimination period.
- Confirm provider requirements.
- Confirm care setting eligibility.
- Confirm invoice requirements.
- Track every call.
- Save every invoice.
- Save care notes.
- Estimate uncovered gap.
- Ask about appeal process if denied.

## Related Kefiw Tools

- [Long-Term Care Insurance Calculator](/care/long-term-care-insurance-calculator/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'licensed insurance professional, elder law attorney for dispute sections',
      [SOURCE_ACL_LTC_INSURANCE_CLAIMS],
    ),
  },
  'art-care-facility-contract-checklist': {
    slug: 'facility-contract-checklist',
    guideCategory: 'Insurance & Payment Guides',
    title: 'Facility Contract Checklist for Assisted Living, Memory Care, and Nursing Homes | Kefiw',
    h1: 'Facility Contract Checklist',
    metaDescription:
      'Learn what families should review before signing a senior care facility contract, including fees, discharge rules, rate increases, liability language, and resident rights.',
    longformMarkdown: withPaymentFooter(
      `## Plain-English Summary

A senior care contract is not just paperwork.

It can define what the family pays, what services are included, when rates can rise, what happens when care needs increase, and whether a resident may be discharged or transferred.

Before signing a facility contract, families should understand:

- Total cost.
- Included services.
- Extra fees.
- Rate increases.
- Care level changes.
- Medication fees.
- Discharge or transfer rules.
- Family liability language.
- Refund policy.
- Arbitration clause.
- Resident rights.
- Complaint process.

For nursing homes, the Consumer Financial Protection Bureau warns that nursing homes should not make a caregiver personally responsible for a loved one's bill as a condition of admission or continued stay. CFPB highlights contract terms such as "responsible party" and "joint and several liability" as words to watch carefully.

## The Kefiw Contract Review Frame

Review the contract in five passes.

### Pass 1: Money

Look for:

- Base rate.
- Care-level fee.
- Medication fee.
- Move-in or community fee.
- Supply fees.
- Transportation fees.
- Rate increase policy.
- Refunds.
- Deposits.
- Late fees.
- Private-pay requirements.

### Pass 2: Care

Look for:

- What services are included.
- What services cost extra.
- What care needs the facility cannot support.
- How care levels are reassessed.
- How falls are handled.
- How medication support works.
- How family is notified of changes.

### Pass 3: Exit Rules

Look for:

- Discharge policy.
- Transfer rules.
- Notice requirements.
- What happens after hospitalization.
- Behavior-related discharge rules.
- Memory care transfer rules.
- Medicaid transition rules, if applicable.

### Pass 4: Liability

Look for:

- Responsible party language.
- Personal guarantee language.
- Joint and several liability.
- Third-party payment obligations.
- Collection language.

### Pass 5: Rights And Complaints

Ask how resident rights are explained, how complaints are documented, and which outside agencies can help if concerns are not resolved.

## Kefiw Tip: Ask For A Contract-To-Invoice Walkthrough

Before signing, ask:

"Can you show us where every possible monthly charge appears in the contract and what it would look like on a sample invoice?"

This catches gaps between the sales conversation and the legal document.

## Family Script

"We are not trying to slow the process down. We need to understand what we are signing, what could make the bill increase, what could lead to discharge, and whether any family member is being asked to take personal financial responsibility."

## Red Flags

- Verbal promises are not in the contract.
- Rate increase rules are vague.
- Discharge policy is broad or unclear.
- Medication fees are not explained.
- Care level pricing is not attached.
- Arbitration language is not understood.
- A family member is pressured to sign as responsible party.
- Refunds are unclear.
- The family is told not to have an attorney review it.

## Checklist

- Ask for a complete contract.
- Ask for fee schedule.
- Ask for sample invoice.
- Ask for care-level policy.
- Ask for discharge policy.
- Ask for rate increase policy.
- Ask for refund policy.
- Review responsible party language.
- Review arbitration clause.
- Confirm Medicaid policy if relevant.
- Confirm resident rights information.
- Locate long-term care ombudsman.
- Have an elder law attorney review before signing when possible.

## Related Kefiw Tools

- [Assisted Living Cost Calculator](/care/assisted-living-cost-calculator/)
- [Memory Care Cost Calculator](/care/memory-care-cost-calculator/)
- [Nursing Home Cost Calculator](/care/nursing-home-cost-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'elder law attorney, senior care advisor, or long-term care ombudsman-informed reviewer',
      [SOURCE_CFPB_NURSING_HOME_DEBT],
    ),
  },
};

import type { ContentPageConfig } from '../content-pages';

const SOURCE_CMS_PART_B_2026 =
  '[CMS: 2026 Medicare Parts A & B premiums and deductibles](https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles)';
const SOURCE_MEDICARE_COSTS =
  '[Medicare.gov: Medicare costs](https://www.medicare.gov/basics/costs/medicare-costs)';
const SOURCE_MEDICARE_COMPARE =
  '[Medicare.gov: Compare Original Medicare and Medicare Advantage](https://www.medicare.gov/basics/get-started-with-medicare/get-more-coverage/your-coverage-options/compare-original-medicare-medicare-advantage)';
const SOURCE_PART_D_COSTS =
  '[Medicare.gov: Part D drug coverage costs](https://www.medicare.gov/health-drug-plans/part-d/basics/costs)';
const SOURCE_MEDIGAP_COVERAGE =
  '[Medicare.gov: What Medigap covers](https://www.medicare.gov/health-drug-plans/medigap/basics/coverage)';
const SOURCE_MEDIGAP_BUY =
  '[Medicare.gov: Medigap Open Enrollment Period](https://www.medicare.gov/health-drug-plans/medigap/ready-to-buy)';
const SOURCE_MEDICARE_LTC =
  '[Medicare.gov: Long-term care coverage](https://www.medicare.gov/coverage/long-term-care)';
const SOURCE_MEDICARE_NURSING_HOME =
  '[Medicare.gov: Nursing home and custodial care](https://www.medicare.gov/coverage/nursing-home-care)';
const SOURCE_SSA_IRMAA =
  '[SSA: Request to lower IRMAA](https://www.ssa.gov/medicare/lower-irmaa)';
const SOURCE_SHIP = '[SHIP: Free Medicare counseling](https://www.shiphelp.org/)';
const SOURCE_EXTRA_HELP =
  '[Medicare.gov: Extra Help with drug costs](https://www.medicare.gov/basics/costs/help/drug-costs)';
const SOURCE_AVOID_PENALTIES =
  '[Medicare.gov: Avoid late enrollment penalties](https://www.medicare.gov/basics/costs/medicare-costs/avoid-penalties)';

const sharedMedicareDisclaimer = `## Kefiw Medicare Disclaimer

Kefiw provides educational care-planning tools and guides. Medicare costs, coverage rules, plan networks, drug formularies, premiums, penalties, enrollment windows, and eligibility rules can change and may vary by person, plan, location, income, and timing. This content does not replace guidance from Medicare, Social Security, SHIP, a licensed insurance professional, tax professional, legal professional, or medical professional.

## Continue Planning With Kefiw

- [Use the Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Run the Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)
- [Estimate Part B premium exposure](/care/part-b-premium-calculator/)
- [Estimate Part D drug costs](/care/part-d-estimate/)
- [Estimate senior care cost](/care/senior-care-cost-calculator/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withMedicareFooter(body: string, reviewer: string, sources: string[]): string {
  return `## Applies To 2026

Applies to 2026 Medicare costs and rules. Review annually before Medicare Open Enrollment and again after CMS, Medicare.gov, and Social Security publish new annual cost updates.

${body}

## Before Choosing Coverage

Check the practical details before comparing plan marketing:

- Doctors.
- Hospitals.
- Prescriptions.
- Pharmacy.
- Premiums.
- Deductibles.
- Copays.
- Coinsurance.
- Out-of-pocket maximum.
- IRMAA.
- Travel.
- Long-term care assumptions.

## Ask For Unbiased Help

For free personalized Medicare counseling, contact a local State Health Insurance Assistance Program, or SHIP. SHIPs are not connected to insurance companies or health plans.

## Calculator Connection

Not sure what this means for the budget? Use the Medicare Cost Calculator, Medicare IRMAA Calculator, Part B Premium Calculator, or Part D Estimate to turn coverage details into a clearer monthly and yearly cost picture.

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedMedicareDisclaimer}`;
}

export const CARE_MEDICARE_GUIDE_OVERRIDES: Record<string, Partial<ContentPageConfig>> = {
  'art-care-medicare-basics': {
    slug: 'medicare-basics',
    title: 'Medicare Basics: Parts A, B, C, D, and Medigap Explained | Kefiw',
    h1: 'Medicare Basics: Parts A, B, C, D, and Medigap',
    metaDescription:
      'Understand the main parts of Medicare, including Original Medicare, Medicare Advantage, Part D drug coverage, and Medigap.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Medicare can feel confusing because people use one word, "Medicare," to describe several different kinds of coverage.

The cleanest version is:

- Original Medicare is Parts A and B.
- Part D is prescription drug coverage.
- Medicare Advantage is another way to receive Medicare benefits through a Medicare-approved private plan.
- Medigap helps pay some out-of-pocket costs in Original Medicare.

Medicare is not one plan. It is a system of choices. Most families need to decide which coverage path fits the person's doctors, prescriptions, hospitals, budget, travel, and appetite for plan rules.

## Part A: Hospital Insurance

Part A generally helps with hospital-related care, skilled nursing facility care under specific conditions, hospice, and some home health care.

Many people do not pay a Part A premium because of work history, but Part A can still have deductibles and cost-sharing. For 2026, CMS lists the Part A inpatient hospital deductible at $1,736 per benefit period and skilled nursing facility coinsurance of $217 per day for days 21 through 100.

Kefiw tip: do not treat "no Part A premium" as "no Part A cost." A hospitalization or skilled nursing stay can still create cost-sharing and follow-up planning questions.

## Part B: Medical Insurance

Part B helps cover doctor services, outpatient care, certain home health services, durable medical equipment, and many preventive services.

For 2026, CMS lists the standard monthly Part B premium as $202.90 and the annual Part B deductible as $283. Higher-income beneficiaries may pay more through IRMAA.

## Part D: Prescription Drug Coverage

Part D helps cover prescription drugs. It can be purchased as a separate Medicare drug plan with Original Medicare or included in many Medicare Advantage plans.

For 2026, Medicare says no Medicare drug plan may have a deductible above $615. Medicare also says covered Part D out-of-pocket drug spending reaches catastrophic coverage at $2,100 in 2026, after which users owe no out-of-pocket costs for covered Part D drugs for the rest of the calendar year.

The practical mistake is choosing a Part D plan by premium only. The right comparison uses the exact medication name, dose, quantity, pharmacy, and plan rules.

## Medicare Advantage: Part C

Medicare Advantage is not a supplement to Original Medicare. It is another way to receive Medicare coverage through a Medicare-approved private plan. Plans usually include Part A and Part B, often include Part D, and may use provider networks, prior authorization, referrals, and plan-specific cost-sharing.

Medicare Advantage can be a fit when the person's doctors and hospitals are in network, the plan's drug coverage fits, the out-of-pocket maximum feels acceptable, and the family is comfortable managing plan rules.

## Medigap

Medigap is supplemental insurance sold by private companies to help pay some out-of-pocket costs in Original Medicare, such as copayments, coinsurance, and deductibles. Medigap is not Medicare Advantage, and people generally cannot have both at the same time.

Medigap policies are standardized by plan letter in most states, so the same letter has the same basic benefits even though premiums and service may differ by company. Massachusetts, Minnesota, and Wisconsin use different standardization.

## What Families Often Miss

Families often ask, "Which Medicare plan is best?"

The stronger question is:

"Best for what: doctors, prescriptions, travel, lower premium, predictable cost, fewer network rules, or long-term care planning?"

The answer can change when a person moves, changes prescriptions, develops a serious condition, or starts relying on a caregiver to manage paperwork.

## Kefiw Tip: Make A Medicare One-Page Snapshot

Before comparing coverage, create a one-page snapshot:

- Current coverage.
- Monthly premium.
- Doctors.
- Hospitals.
- Prescriptions.
- Pharmacies.
- Expected procedures.
- Travel needs.
- Maximum out-of-pocket exposure.
- Long-term care assumptions.

This prevents plan shopping based only on ads, phone calls, or a single premium number.

## Family Script

"Before we choose a plan, let us write down the doctors, prescriptions, pharmacy, hospital preferences, travel needs, and worst-case cost exposure. Then we can compare coverage against real life."

## Red Flags

- Choosing a plan only because the premium is low.
- Not checking prescriptions.
- Not checking doctor networks.
- Confusing Medicare Advantage with Medigap.
- Assuming Medicare pays for long-term custodial care.
- Ignoring income-related premium adjustments.
- Missing enrollment deadlines.

## Checklist

- Confirm whether the person has Original Medicare or Medicare Advantage.
- Confirm Part A and Part B status.
- List all prescriptions.
- Check whether Part D is needed.
- Compare doctor and hospital access.
- Compare total yearly costs.
- Review Medigap timing if using Original Medicare.
- Check whether IRMAA may apply.
- Save all plan documents.
- Review coverage every year.

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part D Estimate](/care/part-d-estimate/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)`,
      'Medicare specialist or licensed insurance professional',
      [
        SOURCE_MEDICARE_COMPARE,
        SOURCE_CMS_PART_B_2026,
        SOURCE_MEDICARE_COSTS,
        SOURCE_PART_D_COSTS,
        SOURCE_MEDIGAP_COVERAGE,
      ],
    ),
  },
  'art-care-original-medicare-vs-advantage': {
    title: 'Original Medicare vs Medicare Advantage: How to Compare the Choice | Kefiw',
    h1: 'Original Medicare vs Medicare Advantage',
    metaDescription:
      'Compare Original Medicare and Medicare Advantage by doctors, hospitals, costs, networks, prescriptions, travel, Medigap, and family care needs.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Choosing between Original Medicare and Medicare Advantage is one of the biggest Medicare decisions because it changes how the person accesses care.

Original Medicare usually offers broader provider flexibility. Medicare Advantage usually uses plan networks and plan rules, but includes a yearly limit on what the user pays for covered Medicare services.

Neither option is automatically better. The better fit depends on doctors, prescriptions, hospitals, travel, budget, local networks, health needs, and the family's tolerance for plan administration.

## Original Medicare May Fit Better When

Original Medicare may be a strong fit when someone:

- Wants broad doctor and hospital access.
- Travels often within the U.S.
- Sees specialists in different health systems.
- Wants fewer network restrictions.
- Plans to buy Medigap if eligible and affordable.
- Wants separate Part D drug coverage.

The main planning issue is cost exposure. Original Medicare does not have a built-in yearly out-of-pocket maximum unless the person has supplemental coverage such as Medigap, employer retiree coverage, Medicaid, or another payer arrangement.

## Medicare Advantage May Fit Better When

Medicare Advantage may be a strong fit when someone:

- Wants one bundled plan.
- Is comfortable with a provider network.
- Has doctors and hospitals that are in network.
- Wants a plan with an annual out-of-pocket maximum for covered Medicare services.
- Wants benefits some plans may offer beyond Original Medicare.
- Is willing to check plan rules every year.

The main planning issue is friction. Networks, prior authorization, referrals, pharmacy rules, and year-to-year changes can all affect the real experience.

## The Friction Cost

Families often compare the monthly premium and forget the friction cost.

Friction cost includes:

- Prior authorization.
- Referral rules.
- Network limits.
- Pharmacy rules.
- Drug formulary changes.
- Travel limits.
- Out-of-network surprises.
- Time spent calling the plan.

A plan can be financially attractive and still become hard for a caregiver to manage.

## Kefiw Tip: Compare The Good Year And The Bad Year

Compare both scenarios:

- Good year: premiums, routine visits, prescriptions.
- Bad year: hospitalization, specialists, imaging, therapy, expensive drugs, out-of-pocket maximum, prior authorization, travel needs.

The best plan is not only the one that looks cheapest when nothing goes wrong.

## Questions To Ask

- Are all current doctors in network?
- Are preferred hospitals in network?
- Are prescriptions covered?
- Which pharmacies are preferred?
- Is prior authorization common for needed care?
- What is the annual out-of-pocket maximum?
- What happens when traveling?
- Can Medigap be used?
- How often do plan benefits change?
- What happens if the person moves?

## Family Script

"Let us not choose based only on the premium. Let us compare doctor access, drug costs, plan rules, travel, and what happens in a bad health year."

## Red Flags

- The plan is chosen after one sales call.
- Doctors are assumed to be in network but not verified.
- Prescriptions are not checked.
- The person travels often but chooses a narrow local network.
- The family ignores prior authorization.
- Someone drops Medigap without understanding future re-entry risks.
- Extra benefits distract from core medical access.

## Checklist

- List doctors and specialists.
- List hospitals.
- List prescriptions.
- Check pharmacies.
- Compare premiums.
- Compare deductibles.
- Compare copays and coinsurance.
- Compare out-of-pocket maximums.
- Review prior authorization.
- Review travel coverage.
- Review annually during Open Enrollment.

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part D Estimate](/care/part-d-estimate/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'Medicare specialist or licensed insurance professional',
      [SOURCE_MEDICARE_COMPARE, SOURCE_MEDICARE_COSTS, SOURCE_MEDIGAP_COVERAGE],
    ),
  },
  'art-care-part-b-premiums-guide': {
    slug: 'medicare-part-b-premiums',
    title: 'Medicare Part B Premiums 2026: Standard Premium, Deductible, and Penalties | Kefiw',
    h1: 'Medicare Part B Premiums Guide',
    metaDescription:
      'Understand the 2026 Medicare Part B premium, deductible, income adjustments, late enrollment penalties, and planning questions.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Part B is one of the most important Medicare costs because many people pay it every month, whether or not they use Part B services.

For 2026, CMS says the standard monthly Part B premium is $202.90 and the annual Part B deductible is $283.

Most people pay the standard premium, but some people pay more because of income. Some people may also owe late enrollment penalties if they delay Part B without qualifying coverage.

## What Part B Helps Cover

Part B helps cover physician services, outpatient hospital services, certain home health services, durable medical equipment, preventive services, and other medical services not covered by Part A.

That makes Part B bigger than "doctor visits." It can affect specialist care, outpatient procedures, durable medical equipment, therapy-related services, preventive care, and later coverage choices.

## What Part B Costs Include In 2026

For 2026 planning, include:

- Monthly premium: $202.90 standard premium, or higher depending on income.
- Annual deductible: $283.
- General coinsurance: often 20% of the Medicare-approved amount for many covered Part B services after the deductible when the provider accepts assignment.
- Possible IRMAA: higher-income beneficiaries may pay an income-related monthly adjustment amount.

Kefiw tip: do not stop at the premium. A family budget should include deductible, coinsurance, supplemental coverage, expected outpatient care, and possible income-related adjustments.

## The Income Adjustment Issue

Higher-income Medicare beneficiaries may pay more for Part B through IRMAA, the income-related monthly adjustment amount.

IRMAA can surprise people because the income year used for the premium year may lag by two years. A person who retired recently, sold a home, took a large IRA withdrawal, had a capital gain, or converted to a Roth IRA may see a premium impact later.

## The Late Enrollment Penalty Issue

Part B timing can be risky. Medicare says the Part B late enrollment penalty is generally an extra 10% for each full 12-month period someone could have had Part B but did not, unless they qualify for a Special Enrollment Period or another exception.

This is where families should be careful with employer coverage, retiree coverage, COBRA, Veterans benefits, marketplace coverage, and spouse coverage. The right question is not just "Do you have insurance?"

The better question is:

"Does this coverage let you delay Part B without a penalty or coverage gap?"

That question deserves confirmation from Medicare, Social Security, an employer benefits office, SHIP, or a qualified professional.

## What Families Often Miss

A person may say, "I do not go to the doctor much, so Part B does not matter."

But Part B is not only about today's visits. It may matter for future outpatient care, specialists, durable medical equipment, preventive services, and whether other Medicare coverage choices are available later.

## Kefiw Tip: Ask Whether Coverage Is Active Employer Coverage

Many Part B timing mistakes happen because people confuse retiree coverage, COBRA, marketplace coverage, or Veterans benefits with active employer coverage.

Before delaying Part B, ask:

- Is this active employer coverage?
- Whose employer is providing it?
- How does Medicare coordinate with it?
- Will it protect against a Part B penalty?
- Will it protect against a coverage gap?

## Questions To Ask

- What is the current Part B status?
- Is the person already enrolled?
- Is the Part B premium being deducted from Social Security?
- Could IRMAA apply?
- Is there active employer coverage?
- Is there a Special Enrollment Period?
- Could a late enrollment penalty apply?
- Is the person planning to choose Medigap or Medicare Advantage?
- Does the person understand the annual deductible and coinsurance?

## Family Script

"Before we delay or change anything, let us confirm whether this coverage actually protects against a Part B penalty or coverage gap."

## Red Flags

- Delaying Part B without confirming rules.
- Assuming any insurance lets someone delay Part B.
- Ignoring IRMAA.
- Ignoring the 20% coinsurance exposure.
- Not knowing whether premiums are being paid.
- Missing mail from Social Security or Medicare.
- Treating Part B as optional without considering future health changes.

## Checklist

- Confirm Part B enrollment.
- Confirm monthly premium.
- Confirm whether IRMAA applies.
- Confirm payment method.
- Review deductible and coinsurance.
- Check for late enrollment penalty risk.
- Verify Special Enrollment Period eligibility if delaying.
- Save Medicare and Social Security notices.
- Use the Part B Premium Calculator.

## Related Kefiw Tools

- [Part B Premium Calculator](/care/part-b-premium-calculator/)
- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)`,
      'Medicare specialist or licensed insurance professional',
      [SOURCE_CMS_PART_B_2026, SOURCE_MEDICARE_COSTS, SOURCE_AVOID_PENALTIES],
    ),
  },
  'art-medicare-irmaa-guide': {
    title: 'Medicare IRMAA Guide 2026: Income-Related Premium Adjustments Explained | Kefiw',
    h1: 'Medicare IRMAA Guide',
    metaDescription:
      'Learn how Medicare IRMAA works, why income from two years ago matters, how Part B and Part D premiums can increase, and when to request a reduction.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

IRMAA stands for Income-Related Monthly Adjustment Amount.

It is an extra amount some higher-income Medicare beneficiaries pay for Part B and Part D. It is not a separate plan. It is an added premium amount based on income.

IRMAA can surprise people because it is usually based on older income. For example, 2026 IRMAA is generally tied to income from the 2024 tax return.

That means a person who recently retired may receive a Medicare premium notice based on income they no longer earn.

## Where IRMAA Can Apply

IRMAA can apply to:

- Part B.
- Part D.

Social Security sends IRMAA notices when it determines an income-related adjustment applies. The person may see the adjustment on a Social Security notice, Medicare premium bill, or payment deduction.

## Why Families Should Care

IRMAA can change the true cost of Medicare.

A person may compare plan premiums and think Medicare costs are settled, but IRMAA may sit on top of those plan costs. For Part D, Medicare says the 2026 national base beneficiary premium is $38.99, which is used for certain penalty and income-related calculations.

## Life-Changing Events

If income has dropped because of a life-changing event, the person may be able to ask Social Security to lower IRMAA.

SSA lists life-changing events such as marriage, divorce, death of a spouse, work stoppage, work reduction, loss of income-producing property, loss of pension income, and employer settlement payment. SSA uses Form SSA-44 for many IRMAA reduction requests after life-changing events.

Kefiw should frame this carefully: the calculator can flag a planning question, but Social Security decides whether a reduction applies.

## What Families Often Miss

IRMAA is not just a Medicare issue. It is also an income-planning issue.

Income sources that may affect modified adjusted gross income can include wages, investment income, taxable retirement withdrawals, capital gains, business income, and other taxable income. Kefiw should avoid giving tax advice, but it can encourage users to coordinate with a tax professional before large income events.

## Kefiw Tip: Watch The One-Time Income Spike

A home sale, Roth conversion, large IRA withdrawal, capital gain, severance payment, or business sale may increase Medicare premiums later.

Before creating a large taxable income event, ask a tax professional whether it could affect Medicare premiums two years later.

The right planning question is not always "How do I avoid IRMAA?" It is "Does the tax, retirement, estate, or cash-flow benefit outweigh the Medicare premium impact?"

## Questions To Ask

- Did the person receive an IRMAA notice?
- Which tax year is being used?
- Did income drop because of retirement, divorce, death of a spouse, or another life-changing event?
- Could Form SSA-44 apply?
- Does IRMAA affect both Part B and Part D?
- Is the family planning a large taxable event?
- Should a tax professional review the situation?

## Family Script

"This premium may be based on income from two years ago. If income has changed because of retirement or another life event, let us check whether there is a way to request a lower IRMAA."

## Red Flags

- Ignoring Social Security IRMAA mail.
- Assuming IRMAA is a plan error.
- Forgetting that Part D can also have IRMAA.
- Missing the two-year income lookback.
- Making large taxable withdrawals without considering Medicare premium impact.
- Not appealing after a legitimate life-changing event.
- Treating tax planning and Medicare planning as separate conversations.

## Checklist

- Review the IRMAA notice.
- Identify the tax year used.
- Compare current income with prior income.
- Check for life-changing events.
- Gather documentation.
- Review SSA-44 if applicable.
- Ask a tax professional before large income events.
- Use the Medicare IRMAA Calculator.
- Save all notices and submissions.

## Related Kefiw Tools

- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)
- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part B Premium Calculator](/care/part-b-premium-calculator/)`,
      'Medicare specialist, tax professional, or licensed insurance professional',
      [SOURCE_SSA_IRMAA, SOURCE_CMS_PART_B_2026, SOURCE_MEDICARE_COSTS],
    ),
  },
  'art-care-medicare-part-d-guide': {
    title: 'Medicare Part D Guide 2026: Drug Costs, Deductibles, Formularies, and Penalties | Kefiw',
    h1: 'Medicare Part D Guide',
    metaDescription:
      'Understand Medicare Part D prescription drug coverage, 2026 deductible limits, out-of-pocket cap, formularies, pharmacy networks, Extra Help, and late penalties.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Part D is Medicare prescription drug coverage.

It can be added as a separate drug plan with Original Medicare, or it may be included in a Medicare Advantage plan with drug coverage. Part D plans are offered by private insurance companies that follow Medicare rules.

Do not choose Part D by premium alone. Choose Part D by checking exact medications, drug tiers, deductible, copays or coinsurance, preferred pharmacies, prior authorization, quantity limits, step therapy, and annual out-of-pocket exposure.

## 2026 Part D Cost Basics

For 2026, Medicare says no Medicare drug plan may have a deductible above $615, and some plans have no deductible.

Medicare also says covered Part D drug out-of-pocket spending reaches catastrophic coverage at $2,100 in 2026, after which users owe no out-of-pocket costs for covered Part D drugs for the rest of the calendar year.

Those numbers help frame the year, but the actual plan experience still depends on the formulary, pharmacy, drug tiers, restrictions, premiums, and the person's medication list.

## Why Formularies Matter

A formulary is the plan's covered drug list.

Two plans with similar premiums can treat the same drug very differently. A drug may be:

- Covered.
- Not covered.
- On a higher tier.
- Subject to prior authorization.
- Subject to step therapy.
- Limited by quantity rules.
- Cheaper at one pharmacy than another.

## The Pharmacy Mistake

Families often check whether the drug is covered but forget to check the pharmacy.

Preferred pharmacy pricing can matter. A plan may cost less at one pharmacy and more at another.

Kefiw tip: compare the same medication list at the pharmacies the person actually uses, plus one backup pharmacy.

## Late Enrollment Penalty

Medicare says the Part D late enrollment penalty can apply when someone does not join a Medicare drug plan when first eligible and goes 63 days or more without creditable drug coverage.

For 2026, Medicare lists the national base beneficiary premium as $38.99. The penalty is generally 1% of that base premium multiplied by the number of full uncovered months, rounded according to Medicare rules, and added to the monthly drug plan premium.

## Extra Help

Extra Help is a Medicare program for people with limited income and resources that helps pay Part D premiums, deductibles, coinsurance, and other drug costs. People who qualify for Extra Help generally do not pay a Part D late enrollment penalty while they have Extra Help.

## What Families Often Miss

Part D should be reviewed every year.

A plan that worked last year may not work this year because:

- Premiums change.
- Deductibles change.
- Formularies change.
- Drug tiers change.
- Pharmacies change.
- Prior authorization rules change.
- The person's medications change.

## Family Script

"Let us not assume last year's drug plan is still the best fit. We need to run the actual medication list, dosage, pharmacy, and plan rules again."

## Questions To Ask

- Are all prescriptions covered?
- What tier is each drug on?
- Is there a deductible?
- Does the deductible apply to this drug?
- Which pharmacies are preferred?
- Is prior authorization required?
- Is step therapy required?
- Are quantity limits applied?
- Could Extra Help apply?
- Could a late enrollment penalty apply?

## Red Flags

- Choosing the plan with the lowest premium without checking drugs.
- Not entering exact medication names and dosages.
- Ignoring preferred pharmacy pricing.
- Missing prior authorization.
- Assuming a drug is covered because it was covered last year.
- Forgetting Part D IRMAA.
- Going without creditable drug coverage.

## Checklist

- List all prescriptions.
- Include dosage and frequency.
- Add preferred pharmacies.
- Check formulary.
- Check deductible.
- Check drug tier.
- Check prior authorization.
- Check step therapy.
- Check quantity limits.
- Review Extra Help eligibility.
- Review annually during Open Enrollment.
- Use the Part D Estimate.

## Related Kefiw Tools

- [Part D Estimate](/care/part-d-estimate/)
- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)`,
      'Medicare specialist, pharmacist, or licensed insurance professional',
      [SOURCE_PART_D_COSTS, SOURCE_EXTRA_HELP, SOURCE_AVOID_PENALTIES],
    ),
  },
  'art-care-medigap-guide': {
    title: 'Medigap Guide: Medicare Supplement Insurance Explained | Kefiw',
    h1: 'Medigap Guide',
    metaDescription:
      'Learn how Medigap works with Original Medicare, what standardized plans mean, when to buy, and what families should ask before choosing a policy.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Medigap is Medicare Supplement Insurance.

It helps pay some out-of-pocket costs in Original Medicare, such as copayments, coinsurance, and deductibles. It is extra insurance sold by private companies.

Medigap is not Medicare Advantage. Medigap works with Original Medicare. Medicare Advantage is a different way to receive Medicare benefits. A person generally cannot have both at the same time.

## What Medigap Can Help With

Medigap plans can help cover the user's share of costs for services covered by Original Medicare, including some copayments, coinsurance, and deductibles depending on the plan letter.

Some Medigap policies may include foreign travel emergency benefits. Medigap policies sold after 2005 do not include prescription drug coverage, so many people with Original Medicare and Medigap also need separate Part D coverage.

Medigap generally does not cover long-term care, dental care, vision care, hearing aids, glasses, or private-duty nursing.

## What Standardized Plans Mean

Medicare says Medigap policies are standardized, and policies with the same letter generally offer the same basic benefits regardless of which company sells the policy. Massachusetts, Minnesota, and Wisconsin work differently.

That means Plan G from one company has the same basic benefits as Plan G from another company, although premiums, rate history, customer service, discounts, and underwriting practices may differ.

## Why Timing Matters

The federal Medigap Open Enrollment Period is a one-time six-month period that starts the first month someone has Medicare Part B and is 65 or older.

During this period, insurers cannot refuse to sell available Medigap policies or use medical underwriting to deny coverage because of pre-existing health problems. After this period, a person may have fewer options, may pay more, or may be denied a policy unless guaranteed issue rights or state protections apply.

## What Families Often Miss

Families often think Medicare Open Enrollment and Medigap Open Enrollment are the same.

They are not.

Medicare Open Enrollment happens each year. Medigap Open Enrollment is generally a one-time window tied to Part B and age 65. This distinction can be very important when someone is choosing between Original Medicare plus Medigap and Medicare Advantage.

## Kefiw Tip: Compare Same-Letter Plans

Do not compare Plan G from one company to Plan N from another and assume the price difference is only company pricing.

Compare:

- Plan G to Plan G.
- Plan N to Plan N.
- Same benefits, different companies, different premiums.

Then evaluate price, rate history, customer service, household discounts, underwriting rules, and state-specific protections.

## Questions To Ask

- Which Medigap plan letter fits the person's needs?
- Is the person inside the Medigap Open Enrollment Period?
- Could underwriting apply?
- What is the monthly premium?
- How often can premiums increase?
- What rating method is used?
- Does the policy include foreign travel emergency coverage?
- Are household discounts available?
- What state protections apply?
- Would Medicare Advantage be a better or worse fit?

## Family Script

"Before switching away from Medigap or missing the enrollment window, let us understand whether we could get back into a similar policy later."

## Red Flags

- Confusing Medigap with Medicare Advantage.
- Dropping Medigap without understanding re-entry risk.
- Missing the one-time Medigap Open Enrollment Period.
- Comparing different plan letters as if benefits are identical.
- Buying only by premium.
- Ignoring state-specific protections.
- Assuming Medigap covers long-term care.

## Checklist

- Confirm Original Medicare enrollment.
- Confirm Part B start date.
- Identify Medigap Open Enrollment timing.
- Compare same-letter plans.
- Compare premiums.
- Ask about rate increases.
- Ask about underwriting.
- Check state rules.
- Review whether Part D is needed separately.
- Save policy documents.

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part B Premium Calculator](/care/part-b-premium-calculator/)`,
      'Medicare specialist or licensed insurance professional',
      [SOURCE_MEDIGAP_COVERAGE, SOURCE_MEDIGAP_BUY, SOURCE_MEDICARE_COMPARE],
    ),
  },
  'art-care-medicare-open-enrollment': {
    title: 'Medicare Open Enrollment Checklist: What to Review Each Year | Kefiw',
    h1: 'Medicare Open Enrollment Checklist',
    metaDescription:
      'Use this Medicare Open Enrollment checklist to review plans, prescriptions, doctors, pharmacies, costs, benefits, and coverage changes.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Medicare Open Enrollment is the yearly time to review coverage and make changes.

Medicare Open Enrollment generally runs from October 15 through December 7, with changes effective January 1 if the plan receives the request by December 7.

Open Enrollment is not just for switching plans. It is for checking whether the current plan still works.

A plan can change. A person's health can change. Prescriptions can change. Doctors can leave networks. Pharmacies can change pricing. Benefits can shift.

## What To Review

### 1. Current Coverage

Write down:

- Original Medicare or Medicare Advantage.
- Part D plan.
- Medigap policy if applicable.
- Premiums.
- Deductibles.
- Copays.
- Coinsurance.
- Out-of-pocket maximum.
- Drug costs.

### 2. Doctors And Hospitals

Check:

- Primary doctor.
- Specialists.
- Preferred hospitals.
- Therapy providers.
- Home health providers.
- Pharmacies.
- Durable medical equipment suppliers.

### 3. Prescriptions

Check:

- Exact drug names.
- Dosages.
- Frequency.
- Drug tiers.
- Prior authorization.
- Step therapy.
- Quantity limits.
- Preferred pharmacy pricing.

### 4. Expected Care Next Year

Ask:

- Is surgery expected?
- Are specialist visits increasing?
- Are new medications likely?
- Is therapy needed?
- Is home health possible?
- Is a move possible?
- Is long-term care being considered?

### 5. Cost Exposure

Compare:

- Monthly premiums.
- Annual deductibles.
- Drug costs.
- Copays.
- Coinsurance.
- Out-of-pocket maximum.
- Non-covered services.
- Travel-related risk.

## Kefiw Tip: Review The Annual Notice Of Change First

Do not shop blindly. First ask:

"What changed in my current plan?"

Then decide whether the change matters. A small premium change may be less important than a drug tier change, provider network change, pharmacy change, or new prior authorization rule.

## A Calmer Fall Timeline

- September: collect plan notices and update medication list.
- October: compare options.
- November: verify doctors, drugs, pharmacies, and expected costs.
- By December 7: submit any change if switching plans.

Waiting until the last week creates pressure and makes it easier to accept a sales pitch without checking the facts.

## Questions To Ask

- What changed in the current plan?
- Are doctors still in network?
- Are drugs still covered?
- Did pharmacy pricing change?
- Did the premium change?
- Did the deductible change?
- Did copays change?
- Did prior authorization rules change?
- Is the out-of-pocket maximum different?
- Would SHIP counseling help?

## Family Script

"Before we keep this plan by default, let us check whether anything changed: doctors, drugs, pharmacy, prior authorization, premiums, and the bad-year cost."

## Red Flags

- Staying in a plan because it worked last year.
- Comparing premiums only.
- Not checking prescriptions.
- Not checking providers.
- Waiting until the last week.
- Relying only on advertisements.
- Assuming extra benefits matter more than core medical access.
- Ignoring travel or moving plans.

## Checklist

- Review Annual Notice of Change.
- Update medication list.
- Check doctors.
- Check hospitals.
- Check pharmacies.
- Compare premiums.
- Compare deductibles.
- Compare drug costs.
- Compare out-of-pocket maximums.
- Check prior authorization.
- Ask SHIP or a qualified professional for help if needed.
- Submit changes by December 7 if changing plans.

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part D Estimate](/care/part-d-estimate/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)`,
      'Medicare specialist or licensed insurance professional',
      [SOURCE_MEDICARE_COMPARE, SOURCE_PART_D_COSTS, SOURCE_SHIP],
    ),
  },
  'art-care-compare-medicare-plans': {
    slug: 'how-to-compare-medicare-plans',
    title: 'How to Compare Medicare Plans Without Getting Overwhelmed | Kefiw',
    h1: 'How to Compare Medicare Plans Without Getting Overwhelmed',
    metaDescription:
      'Learn a calmer way to compare Medicare plans using doctors, prescriptions, pharmacies, costs, networks, travel, and worst-case scenarios.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Medicare plan comparison can feel like trying to solve a puzzle while someone is reading the rules out loud.

The trick is to stop comparing everything at once.

Instead, compare plans in the order that matters most:

- Doctors.
- Prescriptions.
- Hospitals.
- Total cost.
- Plan rules.
- Travel.
- Worst-case year.

A Medicare plan is not good in the abstract. It is good if it works for the person's actual doctors, drugs, budget, location, and health risks.

## The Kefiw 7-Pass Comparison Method

### Pass 1: Doctor Access

Ask:

- Is the primary care doctor covered?
- Are specialists covered?
- Are preferred hospitals covered?
- Is a referral needed?
- Is out-of-network care allowed?

### Pass 2: Prescription Fit

Ask:

- Are all drugs covered?
- What tier is each drug?
- Is prior authorization required?
- Is step therapy required?
- Is there a preferred pharmacy?

### Pass 3: Hospital And Specialist Risk

Ask:

- Where would the person want to go in a serious illness?
- Are those hospitals in network?
- Are major specialist groups covered?
- If the person has a known condition, are the relevant specialists accessible?

### Pass 4: Monthly Cost

Include:

- Part B premium.
- Plan premium.
- Part D premium if separate.
- Medigap premium if applicable.
- IRMAA if applicable.

### Pass 5: Bad-Year Cost

Include:

- Deductibles.
- Copays.
- Coinsurance.
- Drug costs.
- Out-of-pocket maximum.
- Non-covered services.

### Pass 6: Plan Friction

Ask:

- How often is prior authorization needed?
- Are referrals required?
- Are networks narrow?
- Does the person travel?
- Can the family manage the plan rules?

### Pass 7: Support

Ask:

- Who helps the person understand notices?
- Who reviews coverage annually?
- Who handles appeals?
- Would SHIP counseling help?

## Kefiw Tip: Eliminate Bad-Fit Plans First

Do not try to pick the best plan immediately.

First remove plans that fail:

- Doctor access.
- Prescription coverage.
- Hospital access.
- Affordable worst-case cost.
- Travel needs.
- Caregiver manageability.

The final choice is easier after bad fits are removed.

## What Families Often Miss

The person using the plan may not be the person managing the plan.

A caregiver may need to handle:

- Prior authorization calls.
- Pharmacy problems.
- Claims questions.
- Appeals.
- Provider searches.
- Plan notices.

A plan with more rules can create more caregiver workload.

## Family Script

"Let us compare these plans against real life, not the brochure. The plan has to work for the doctors, prescriptions, pharmacy, budget, and the person who will manage the paperwork."

## Red Flags

- Plan chosen from an advertisement.
- Doctors not verified.
- Drug list not checked.
- Only monthly premium compared.
- Pharmacy ignored.
- Out-of-pocket maximum ignored.
- Caregiver workload ignored.
- SHIP or professional help skipped when the decision is confusing.

## Checklist

- Make a doctor list.
- Make a prescription list.
- Choose preferred pharmacies.
- List hospitals.
- Compare plan premiums.
- Compare drug costs.
- Compare total yearly risk.
- Check prior authorization.
- Check travel coverage.
- Check caregiver manageability.
- Ask for unbiased help if needed.

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Part D Estimate](/care/part-d-estimate/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)`,
      'Medicare specialist or licensed insurance professional',
      [SOURCE_MEDICARE_COMPARE, SOURCE_MEDICARE_COSTS, SOURCE_PART_D_COSTS, SOURCE_SHIP],
    ),
  },
  'art-care-medicare-long-term-care': {
    slug: 'medicare-and-long-term-care',
    title: 'Medicare and Long-Term Care: What Families Need to Know | Kefiw',
    h1: 'Medicare and Long-Term Care Guide',
    metaDescription:
      'Learn why Medicare usually does not cover long-term custodial care, how skilled care differs from daily care, and how families can plan senior care costs.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Medicare is often misunderstood during senior care planning.

Families may assume that because a parent has Medicare, assisted living, home care, memory care, or a long-term nursing home stay will be covered.

That assumption can be financially dangerous.

Medicare may help with medical care. Long-term care is ongoing help with daily life. Those are not the same thing.

## The Skilled Care Vs Custodial Care Distinction

This is the key concept.

Skilled care may involve medical or rehabilitative care after an illness, injury, hospitalization, or qualifying medical need.

Custodial care means help with activities of daily living, such as bathing, dressing, eating, toileting, and supervision.

Medicare says most nursing home care is custodial care, and Original Medicare does not cover custodial care if it is the only care needed.

## What Medicare Generally Does Not Pay For

Medicare states that Medicare and most health insurance, including Medigap, do not pay for long-term care services in a nursing home or in the community. Medicare also states that people pay 100% for non-covered services, including most long-term care.

That means families should not treat Medicare as the payment plan for:

- Assisted living room and board.
- Long-term memory care.
- Ongoing custodial nursing home care.
- Long-term personal care at home.
- Non-medical supervision.
- Home-delivered meals as long-term care.
- Transportation as long-term care.

## The Short-Term Stay Trap

A short-term covered stay can create a false sense of security.

Example:

A parent goes from hospital to skilled nursing rehab. The family sees Medicare involved and assumes the nursing home will stay covered.

But once skilled care ends, the payment situation may change.

Kefiw tip: ask every facility or discharge planner:

"What is the plan when Medicare-covered skilled care ends?"

## What Families Often Miss

Families often hear "nursing home" and think one payment rule applies.

The more useful questions are:

- Why is the person in the facility?
- Is the care skilled, custodial, or both?
- What Medicare benefit is being used?
- What documentation is required?
- How long might coverage last?
- What happens when coverage ends?

## Payment Sources To Discuss Separately

Because Medicare usually should not be treated as the long-term care funding plan, families may need to discuss:

- Income and savings.
- Family contributions.
- Long-term care insurance.
- Medicaid eligibility.
- VA benefits.
- Home equity.
- Lower-cost care mixes.
- Adult day care or respite.
- Caregiver workload and unpaid labor.

Kefiw should keep this educational and encourage professional review because Medicaid, tax, estate, and legal rules can vary by state and situation.

## Questions To Ask

- Is this skilled care or custodial care?
- What Medicare benefit is being used?
- What conditions must be met?
- How long might coverage last?
- What happens when coverage ends?
- What will the daily or monthly private-pay rate be?
- Is Medicaid planning relevant?
- Is long-term care insurance available?
- What does the family need to pay now?
- What is the backup plan?

## Family Script

"We need to separate medical coverage from long-term daily care. What is Medicare covering now, and what will we owe if this becomes custodial care?"

## Red Flags

- Someone says "Medicare covers nursing homes" without explaining limits.
- No one explains what happens after skilled care ends.
- Assisted living is presented as Medicare-covered.
- The family has no long-term payment plan.
- The caregiver assumes a facility stay will be covered indefinitely.
- Medicaid or long-term care insurance is discussed too late.

## Checklist

- Identify whether care is skilled or custodial.
- Ask what Medicare benefit applies.
- Ask how long coverage may last.
- Ask what happens when coverage ends.
- Estimate private-pay costs.
- Check long-term care insurance.
- Review Medicaid eligibility with qualified help if needed.
- Use the Senior Care Cost Calculator.
- Build a family care budget.

## Related Kefiw Tools

- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)
- [Nursing Home Cost Calculator](/care/nursing-home-cost-calculator/)
- [Long-Term Care Insurance Calculator](/care/long-term-care-insurance-calculator/)
- [Medicare Cost Calculator](/care/medicare-cost-planner/)`,
      'Medicare specialist, elder law attorney, or geriatric care manager',
      [SOURCE_MEDICARE_LTC, SOURCE_MEDICARE_NURSING_HOME, SOURCE_MEDICARE_COSTS],
    ),
  },
  'art-care-medicare-mistakes': {
    slug: 'medicare-mistakes-senior-care',
    title: 'Medicare Mistakes Families Make When Planning Senior Care | Kefiw',
    h1: 'Medicare Mistakes Families Make When Planning Senior Care',
    metaDescription:
      'Avoid common Medicare mistakes around long-term care, Part D drugs, Medicare Advantage networks, Medigap timing, IRMAA, and annual plan review.',
    longformMarkdown: withMedicareFooter(
      `## Plain-English Summary

Most Medicare mistakes do not happen because families are careless.

They happen because families are overwhelmed, rushed, or relying on assumptions that sound reasonable but are wrong.

This guide highlights the Medicare mistakes Kefiw should help families catch before they become expensive.

## Mistake 1: Assuming Medicare Pays For Long-Term Care

This is the biggest mistake.

Medicare says it does not pay for long-term care and that Medicare and most health insurance, including Medigap, do not pay for long-term care services in a nursing home or in the community.

Kefiw correction: build a separate long-term care payment plan.

## Mistake 2: Confusing Skilled Care With Custodial Care

A short-term skilled nursing or rehab stay may be very different from long-term custodial care.

Medicare says most nursing home care is custodial care and that Original Medicare does not cover custodial care if that is the only care needed.

Kefiw correction: ask whether care is skilled, custodial, or both.

## Mistake 3: Choosing A Plan By Premium Only

A low premium can hide higher copays, drug costs, prior authorization issues, narrow networks, or higher bad-year exposure.

Kefiw correction: compare total yearly risk, not only the premium.

## Mistake 4: Not Checking Prescriptions Every Year

Part D plan details can change, and medication lists can change.

For 2026, Medicare says no Part D deductible may exceed $615 and covered Part D drug out-of-pocket costs reach catastrophic coverage at $2,100. But actual premiums, formularies, pharmacies, and cost-sharing still vary by plan.

Kefiw correction: run the exact medication list every year.

## Mistake 5: Ignoring IRMAA

Higher-income beneficiaries may pay extra for Part B and Part D based on income from two years ago.

Kefiw correction: check IRMAA before assuming Medicare cost.

## Mistake 6: Missing Medigap Timing

The federal Medigap Open Enrollment Period is generally a one-time six-month period that starts the first month someone has Part B and is 65 or older.

After that period, people may face fewer options, higher costs, or denial unless protections apply.

Kefiw correction: treat Medigap timing as a major planning checkpoint.

## Mistake 7: Not Using Unbiased Help

Medicare decisions can be confusing, especially when sales pressure is involved.

SHIP programs provide free Medicare counseling and are not connected to insurance companies or health plans.

Kefiw correction: encourage users to use SHIP or qualified professional help when decisions are complex.

## Kefiw Tip: Create A Medicare Assumptions List

Before making a care decision, write every assumption:

- Medicare will pay for rehab.
- Medicare will pay for nursing home care.
- The drug plan still covers all prescriptions.
- The doctor is still in network.
- The premium is the main cost.
- Medigap can be bought later.
- A plan ad explains the full cost.

Then verify each one.

## Questions To Ask

- Is the care skilled or custodial?
- What Medicare benefit applies?
- How long might coverage last?
- What plan rules affect doctors and drugs?
- What is the private-pay backup plan?
- Could IRMAA affect premiums?
- Are we inside or outside a Medigap timing window?
- Should SHIP or a qualified professional review this?

## Family Script

"Let us not make a care decision based on assumptions. We need to confirm what Medicare covers, what it does not cover, what the plan rules are, and what we would owe if care becomes long-term."

## Red Flags

- Medicare is treated as the long-term care plan.
- The family does not know whether coverage is Original Medicare or Medicare Advantage.
- Drug costs are not checked.
- Network access is assumed.
- IRMAA is ignored.
- Medigap timing is missed.
- No one reads Medicare notices.
- A crisis forces a rushed plan change.

## Checklist

- Confirm current Medicare coverage.
- Confirm whether care is skilled or custodial.
- Check long-term care coverage assumptions.
- Review Part D drugs.
- Review doctor networks.
- Check IRMAA exposure.
- Check Medigap timing.
- Compare total yearly costs.
- Use SHIP or qualified professional help if needed.
- Review every year during Open Enrollment.

## Related Kefiw Tools

- [Medicare Cost Calculator](/care/medicare-cost-planner/)
- [Medicare IRMAA Calculator](/care/medicare-irmaa-calculator/)
- [Part D Estimate](/care/part-d-estimate/)
- [Senior Care Cost Calculator](/care/senior-care-cost-calculator/)`,
      'Medicare specialist, licensed insurance professional, or elder law attorney for long-term care planning notes',
      [
        SOURCE_MEDICARE_LTC,
        SOURCE_MEDICARE_NURSING_HOME,
        SOURCE_MEDICARE_COMPARE,
        SOURCE_PART_D_COSTS,
        SOURCE_CMS_PART_B_2026,
        SOURCE_MEDIGAP_BUY,
        SOURCE_SHIP,
      ],
    ),
  },
};

import type { ContentPageConfig } from '../content-pages';

const SOURCE_MEDLINE_EVALUATING =
  '[MedlinePlus: Evaluating health information](https://medlineplus.gov/evaluatinghealthinformation.html)';
const SOURCE_MEDLINE_ONLINE_TRUST =
  '[MedlinePlus: Online health information - what can you trust?](https://medlineplus.gov/ency/patientinstructions/000869.htm)';
const SOURCE_988_LIFELINE =
  '[988 Lifeline: Get help now](https://988lifeline.org/talk-to-someone-now/)';
const SOURCE_988_TEXT =
  '[988 Lifeline: Texting the 988 Lifeline](https://988lifeline.org/faq/texting-the-988-lifeline/)';
const SOURCE_FTC_ENDORSEMENTS =
  "[FTC: Endorsement Guides - what people are asking](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides)";
const SOURCE_FTC_REVIEWS =
  '[FTC: Endorsements, influencers, and reviews](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews)';
const SOURCE_WCAG_22 =
  '[W3C: Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/)';

const TRUST_CATEGORY = 'Trust & Governance';

const sharedTrustDisclaimer = `## Care Hub Trust Footer

Kefiw provides educational care-planning tools and guides. Content is designed to help families organize decisions, estimate costs, prepare questions, and identify next steps. Kefiw does not replace medical, legal, tax, financial, insurance, Medicare, Medicaid, or emergency guidance. For urgent medical concerns or immediate danger, call emergency services.

## Care Trust Pages

- [Kefiw Review Board](/care/guides/review-board/)
- [Editorial Standards](/care/guides/editorial-standards/)
- [Source and Citation Policy](/care/guides/source-policy/)
- [Health Disclaimer](/care/guides/health-disclaimer/)
- [Care Urgency Safety](/care/guides/care-urgency-safety/)
- [Financial, Legal, Medicare, and Insurance Disclaimer](/care/guides/financial-legal-insurance-disclaimer/)
- [Calculator Limitations](/care/guides/calculator-limitations/)
- [Corrections and Feedback Policy](/care/guides/corrections-policy/)
- [Advertising, Affiliate, and Conflict Disclosure](/care/guides/affiliate-disclosure/)
- [AI Assistance and Human Review Policy](/care/guides/ai-human-review-policy/)
- [Accessibility and Plain-Language Commitment](/care/guides/accessibility-plain-language/)
- [Privacy and Sensitive Care Data Notice](/care/guides/privacy-care-data-notice/)
`;

function withTrustFooter(body: string, sources: string[] = []): string {
  return `${body}

## How This Page Is Maintained

- Written for family caregivers and care decision-makers.
- Reviewed for clarity, safety, and practical usefulness.
- Updated when Medicare, insurance, tax, legal, or care guidance changes.
- Includes sources or reviewer notes where appropriate.
- Designed to support, not replace, qualified professional advice.

${sources.length > 0 ? `## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

` : ''}Last reviewed: April 29, 2026.

${sharedTrustDisclaimer}`;
}

const faq = (q: string, a: string, faq_intent = 'how-to') => ({ q, a, faq_intent });

function trustPage(config: {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  outcomeLine: string;
  body: string;
  sources?: string[];
  primaryCta?: { href: string; label: string };
  relatedLinks?: { href: string; label: string }[];
  faq?: Array<{ q: string; a: string; faq_intent?: string }>;
}): ContentPageConfig {
  return {
    id: `art-care-${config.slug}`,
    kind: 'guide',
    section: 'guides',
    guideCategory: TRUST_CATEGORY,
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
        faq('What are Kefiw trust pages for?', 'They explain how Kefiw scopes, sources, reviews, limits, corrects, and maintains care content so families can understand what the site can and cannot do.', 'definition'),
        faq('Do these policies replace professional advice?', 'No. They make Kefiw limits visible. Medical, legal, tax, financial, Medicare, Medicaid, insurance, and emergency questions should be confirmed with qualified professionals or official sources.'),
        faq('How often should these policies be reviewed?', 'They should be reviewed when Kefiw changes product behavior or editorial workflow, and at least annually for source, safety, review, and calculator standards.'),
      ],
    primaryCta: config.primaryCta ?? { href: '/care/guides/', label: 'Browse Care Guides' },
    relatedLinks: config.relatedLinks ?? [
      { href: '/care/guides/source-policy/', label: 'Source Policy' },
      { href: '/care/guides/corrections-policy/', label: 'Corrections Policy' },
      { href: '/care/guides/health-disclaimer/', label: 'Health Disclaimer' },
    ],
    longformMarkdown: withTrustFooter(config.body, config.sources ?? []),
  };
}

export const CARE_TRUST_GOVERNANCE_NEW_GUIDES: ContentPageConfig[] = [
  trustPage({
    slug: 'review-board',
    title: 'Kefiw Review Board: How Care, Health, Medicare, and Insurance Content Is Reviewed',
    h1: 'Kefiw Review Board',
    description:
      'Learn how Kefiw reviews care, health, Medicare, insurance, wellbeing, and calculator content for clarity, accuracy, safety, and usefulness.',
    keywords: ['Kefiw review board', 'care content review', 'health content review process'],
    intro:
      'Kefiw Care Hub is designed for families making stressful care decisions, so content must be clear, careful, practical, and responsibly reviewed.',
    outcomeLine:
      'The Review Board helps match care content to the right safety, source, and professional review standard.',
    relatedLinks: [
      { href: '/care/guides/editorial-standards/', label: 'Editorial Standards' },
      { href: '/care/guides/ai-human-review-policy/', label: 'AI and Human Review Policy' },
      { href: '/care/guides/source-policy/', label: 'Source Policy' },
    ],
    body: `## What The Review Board Does

The Review Board helps Kefiw evaluate:

- Whether care advice is practical and realistic.
- Whether health-adjacent content avoids diagnosis or treatment claims.
- Whether Medicare, insurance, and cost content is clearly sourced.
- Whether calculators explain assumptions and limitations.
- Whether safety language is strong enough for urgent or medical situations.
- Whether family scripts, checklists, and red flags are responsible.
- Whether content uses plain language and avoids unnecessary jargon.

## Who May Review Kefiw Content

Depending on the topic, reviewers may include:

- Clinicians.
- Pharmacists.
- Geriatric care managers.
- Senior care advisors.
- Dementia care specialists.
- Licensed insurance professionals.
- Medicare specialists.
- Elder law attorneys.
- Financial planners.
- Tax professionals.
- Benefits specialists.
- Caregiver support specialists.
- Behavioral health professionals.
- Accessibility or plain-language reviewers.

Not every reviewer reviews every page. Kefiw should match the reviewer to the risk and subject matter.

## Review By Topic

| Content type | Suggested reviewer |
| --- | --- |
| Medical urgency, falls, medications | Clinician, pharmacist, nurse, emergency-care reviewer |
| Dementia, wandering, refusal of care | Dementia care specialist, clinician, geriatric care manager |
| Medicare, Part D, IRMAA | Medicare specialist, licensed insurance professional |
| Long-term care insurance | Licensed insurance professional |
| Medicaid, POA, guardianship, contracts | Elder law attorney |
| HSA, FSA, caregiver payments | Tax professional, benefits specialist |
| Caregiver burnout, stress, guilt | Therapist, behavioral health clinician, caregiver support specialist |
| Home safety, transfers, bathing | Occupational therapist, physical therapist, clinician |
| Cost calculators | Financial planner, care-cost subject matter expert |

## What Review Does Not Mean

Review does not mean Kefiw is providing:

- Medical diagnosis.
- Medical treatment.
- Legal advice.
- Tax advice.
- Financial advice.
- Insurance advice.
- A doctor-patient relationship.
- An attorney-client relationship.
- A fiduciary or advisory relationship.

Kefiw content helps families prepare better questions and organize decisions. It does not replace qualified professional guidance.

## Reviewer Note Template

Use this on reviewed pages:

| Field | Example |
| --- | --- |
| Reviewed for Kefiw by | Reviewer name, credentials |
| Reviewer focus | Clinical accuracy / Medicare clarity / legal scope / caregiver practicality |
| Last reviewed | Month Day, Year |
| Next scheduled review | Month Year or annual update cycle |

## Kefiw Tip

The best review system is visible. Users should not have to guess whether a guide is current, who reviewed it, or what kind of expertise was applied.
`,
  }),
  trustPage({
    slug: 'editorial-standards',
    title: 'Kefiw Editorial Standards for Care Guides and Calculators',
    h1: 'Kefiw Editorial Standards',
    description:
      "Learn Kefiw's editorial standards for human-curated care content, including clarity, safety, sourcing, expert review, calculator transparency, and family usefulness.",
    keywords: ['Kefiw editorial standards', 'care guide editorial policy', 'care content quality standards'],
    intro:
      'Kefiw creates care content for families who may be overwhelmed, tired, worried, or making decisions under pressure.',
    outcomeLine:
      'The editorial standard is to be clear enough for a tired caregiver, careful enough for high-stakes decisions, and practical enough to use today.',
    relatedLinks: [
      { href: '/care/guides/review-board/', label: 'Review Board' },
      { href: '/care/guides/source-policy/', label: 'Source Policy' },
      { href: '/care/guides/accessibility-plain-language/', label: 'Accessibility and Plain Language' },
    ],
    body: `## Our Content Principles

### 1. Plain Language First

We explain care, Medicare, insurance, legal, and health-adjacent topics without unnecessary jargon.

When technical terms are needed, we define them.

### 2. Decision Support, Not Generic Information

A Kefiw guide should help users decide what to do next.

Every guide should answer:

- What is happening?
- Why does it matter?
- What do families often miss?
- What should they ask?
- What are the red flags?
- What tool or checklist should they use next?

### 3. Human-Curated Advice

Kefiw content should include practical details grounded in real family care situations:

- Questions to ask.
- Family scripts.
- Red flags.
- Cost traps.
- Small tests.
- Worksheets.
- Escalation rules.
- What families often miss sections.

### 4. Safety Before Confidence

If a topic could involve medical risk, elder abuse, exploitation, legal authority, insurance coverage, or financial loss, Kefiw should be careful, not overconfident.

### 5. Transparent Limitations

Every calculator, checklist, and guide should explain what it can and cannot do.

### 6. Useful Next Steps

A guide should never leave users with only information. It should guide them toward a calculator, checklist, care track, professional question, or family conversation.

## Required Modules For Care Guides

Every major guide should include:

- Plain-English summary.
- Who this is for.
- What families often miss.
- Kefiw tip.
- Questions to ask.
- Red flags.
- Checklist.
- Related tools.
- Related guides.
- Professional review note.
- Disclaimer block.
- Last reviewed date.

## Kefiw Content Quality Test

Before publishing, ask:

- Would a real caregiver find this useful?
- Does this reduce confusion?
- Does this avoid unsafe overstatement?
- Does this include practical questions?
- Does this include next steps?
- Is the source quality appropriate?
- Is the professional scope clear?
- Is the date current where timing matters?

## Voice Standard

Kefiw should sound calm, practical, protective, human, plainspoken, and nonjudgmental.

Kefiw should not sound salesy, alarmist, coldly clinical, legally evasive, overconfident, or like generic SEO filler.
`,
  }),
  trustPage({
    slug: 'source-policy',
    title: 'Kefiw Source and Citation Policy',
    h1: 'Kefiw Source and Citation Policy',
    description:
      'Learn how Kefiw selects, verifies, cites, reviews, and updates sources for care, health, Medicare, insurance, and financial planning content.',
    keywords: ['Kefiw source policy', 'care content citation policy', 'health information source standards'],
    intro:
      'Kefiw uses sources to help families understand care decisions, not to overwhelm them.',
    outcomeLine:
      'Good sources matter because care decisions often involve health, money, safety, insurance, legal documents, and family responsibility.',
    sources: [SOURCE_MEDLINE_EVALUATING, SOURCE_MEDLINE_ONLINE_TRUST],
    relatedLinks: [
      { href: '/care/guides/review-board/', label: 'Review Board' },
      { href: '/care/guides/corrections-policy/', label: 'Corrections Policy' },
      { href: '/care/guides/calculator-limitations/', label: 'Calculator Limitations' },
    ],
    body: `## Why Source Quality Matters

MedlinePlus explains that health information is easy to find, but reliable health information takes effort to evaluate. It recommends asking questions before trusting information, discussing health information with a provider before relying on it, checking who runs a site, understanding the site's purpose, looking for review processes, and checking whether content is up to date.

## Preferred Source Types

Kefiw should prioritize:

- Federal government sources.
- State agency sources when state-specific.
- Medicare.gov and CMS.
- Medicaid.gov.
- Social Security Administration.
- IRS.
- VA.
- National Institutes of Health.
- MedlinePlus.
- CDC.
- Administration for Community Living.
- Established medical nonprofits.
- Professional associations.
- Peer-reviewed research where appropriate.
- Direct insurer, plan, or provider documents for plan-specific content.

## Source Hierarchy

Use this hierarchy:

1. Primary source where possible.
2. Government or official agency source for rules, benefits, limits, eligibility, and deadlines.
3. Professional organization for general clinical or care guidance.
4. Peer-reviewed research for evidence-based claims.
5. Expert reviewer input for practical interpretation.
6. Consumer-facing summaries only when primary sources are unavailable or too technical.

## Topics Requiring Current Source Review

These should be reviewed at least annually or whenever rules change:

- Medicare premiums.
- Part B deductible.
- Part D deductible and out-of-pocket rules.
- IRMAA brackets.
- HSA limits.
- FSA limits.
- Medicaid rules.
- VA benefits.
- Marketplace insurance limits.
- State care regulations.
- Tax-related caregiver guidance.
- Facility complaint and reporting processes.

## Citation Rules

Kefiw should cite sources when content includes:

- Specific dollar amounts.
- Coverage rules.
- Eligibility rules.
- Deadlines.
- Statistics.
- Medical safety claims.
- Government program rules.
- Legal or tax process descriptions.
- Claims about professional standards.

## What Kefiw Should Avoid

Avoid:

- Unsourced statistics.
- Outdated Medicare or IRS amounts.
- Broad claims based on a single anecdote.
- Promotional sources for neutral explanations.
- Facility or agency marketing as the only source.
- Medical content without clinical review.
- Legal or tax claims without professional review.

## Kefiw Source Note Template

Sources used: Official government, professional, or expert-reviewed sources were used to support coverage rules, safety guidance, cost figures, or eligibility information. Kefiw also uses expert review to ensure guidance is practical and appropriately scoped.
`,
  }),
  trustPage({
    slug: 'health-disclaimer',
    title: 'Kefiw Health Disclaimer',
    h1: 'Kefiw Health Disclaimer',
    description:
      "Read Kefiw's health disclaimer for educational care, wellbeing, urgency, sleep, stress, caregiver, and medical-adjacent content.",
    keywords: ['Kefiw health disclaimer', 'care urgency disclaimer', 'caregiver health content disclaimer'],
    intro:
      'Kefiw provides educational care-planning tools, guides, checklists, and calculators.',
    outcomeLine:
      'Kefiw does not provide diagnosis, treatment, emergency services, therapy, or a substitute for professional clinical judgment.',
    sources: [SOURCE_988_LIFELINE, SOURCE_988_TEXT],
    relatedLinks: [
      { href: '/care/guides/care-urgency-safety/', label: 'Care Urgency Safety' },
      { href: '/care/guides/financial-legal-insurance-disclaimer/', label: 'Financial and Legal Disclaimer' },
      { href: '/care/guides/calculator-limitations/', label: 'Calculator Limitations' },
    ],
    body: `## What Kefiw Health Content Can Do

Kefiw health-adjacent content can help users:

- Organize care observations.
- Track symptoms or changes.
- Prepare questions for clinicians.
- Think through urgency categories.
- Notice caregiver stress.
- Build safer routines.
- Understand general care planning concepts.
- Decide when to seek professional help.

## What Kefiw Health Content Cannot Do

Kefiw cannot:

- Diagnose a condition.
- Rule out an emergency.
- Tell a user whether a symptom is safe.
- Prescribe treatment.
- Adjust medications.
- Replace a doctor, nurse, pharmacist, therapist, or emergency professional.
- Interpret a user's full medical history.
- Guarantee outcomes.

## Emergency Language

If someone may be experiencing a medical emergency, call local emergency services immediately.

Do not use Kefiw tools, calculators, guides, or checklists as a substitute for emergency care.

## Mental Health Crisis Language

If someone in the U.S. is experiencing emotional distress, suicidal thoughts, substance-use crisis, or mental health crisis, the 988 Suicide & Crisis Lifeline can be reached by call, text, or chat. 988 Lifeline materials describe the service as confidential and available 24 hours a day, 7 days a week.

## Care Urgency Tools

Kefiw's Care Urgency Check is educational.

It may help users organize observations and decide whether a concern seems routine, prompt, urgent, or emergency-level. It does not diagnose, triage clinically, or replace medical judgment.

## Medication Content

Medication content is educational only. Users should not start, stop, combine, or change medications based on Kefiw content. Medication questions should be discussed with a qualified clinician or pharmacist.

## Sleep, Stress, And Wellbeing Content

Kefiw wellbeing tools may support reflection, grounding, planning, and routines. They do not replace mental health care, therapy, medical evaluation, or emergency support.

## Bottom-Line Disclaimer

Kefiw helps users organize care decisions. It does not replace qualified medical care.
`,
  }),
  trustPage({
    slug: 'care-urgency-safety',
    title: 'Care Urgency Check Safety Information',
    h1: 'Care Urgency Check Safety Information',
    description:
      "Understand how Kefiw's Care Urgency Check works, what it can and cannot do, and when users should seek emergency or professional medical help.",
    keywords: ['care urgency safety', 'care urgency check disclaimer', 'medical triage safety information'],
    intro:
      'Kefiw Care Urgency Check is designed to help families slow down, observe clearly, and decide what kind of help may be needed.',
    outcomeLine:
      'The tool is educational decision support, not a medical triage service.',
    primaryCta: { href: '/health/medical-triage/', label: 'Open Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/health-disclaimer/', label: 'Health Disclaimer' },
      { href: '/care/guides/what-to-do-after-a-fall/', label: 'What to Do After a Fall' },
      { href: '/care/guides/when-to-get-medical-help-for-an-aging-parent/', label: 'When to Get Medical Help' },
    ],
    body: `## What The Tool Helps With

The Care Urgency Check can help users:

- Compare a change to the person's normal baseline.
- Write down what happened.
- Identify whether the concern sounds routine, prompt, urgent, or emergency-level.
- Prepare a clearer call to a clinician.
- Decide when not to wait.

## What The Tool Does Not Do

It does not:

- Diagnose.
- Rule out serious illness.
- Replace emergency services.
- Replace medical triage.
- Read vital signs.
- Review a full medical record.
- Guarantee that waiting is safe.
- Tell users not to seek care.

## Required Emergency Banner

Use this at the top of the tool:

If someone may be experiencing a medical emergency, call emergency services now. Do not use this tool instead of emergency care.

## Baseline Prompt

Every urgency tool should ask:

"What is normal for this person, and what changed?"

This is often more useful than asking only about symptoms.

## Kefiw Tip

For older adults, the first sign of a serious problem may be a change from baseline:

- New confusion.
- New weakness.
- New trouble walking.
- New shortness of breath.
- New chest discomfort.
- New fall.
- New inability to eat or drink.
- New behavior change.

Kefiw should not diagnose those changes. It should encourage appropriate professional help.

## Call Script

"Normally, they can ____. Today, they cannot ____. This started at ____. These are the symptoms we noticed: ____. These medications changed recently: ____. What level of care should we seek?"

## Tool Result Language

Avoid:

"You are safe to wait."

Use:

"Based on what you entered, this may be appropriate to discuss with a clinician soon. If symptoms worsen, feel severe, or you are unsure, seek urgent or emergency help."

## Professional Review

Recommended reviewer:

- Emergency medicine clinician.
- Nurse reviewer.
- Geriatric clinician.
- Patient safety reviewer.
`,
  }),
  trustPage({
    slug: 'financial-legal-insurance-disclaimer',
    title: 'Kefiw Financial, Legal, Medicare, and Insurance Disclaimer',
    h1: 'Financial, Legal, Medicare, and Insurance Disclaimer',
    description:
      "Read Kefiw's disclaimer for Medicare, insurance, Medicaid, legal documents, taxes, caregiver payments, and financial planning content.",
    keywords: ['Kefiw financial disclaimer', 'Kefiw legal disclaimer', 'Medicare insurance disclaimer'],
    intro:
      'Kefiw provides educational planning content.',
    outcomeLine:
      'Kefiw helps users prepare. Qualified professionals help users decide and act.',
    relatedLinks: [
      { href: '/care/guides/calculator-limitations/', label: 'Calculator Limitations' },
      { href: '/care/guides/source-policy/', label: 'Source Policy' },
      { href: '/care/guides/legal-documents-family-caregivers/', label: 'Legal Documents Guide' },
    ],
    body: `## What Kefiw Does Not Provide

Kefiw does not provide:

- Legal advice.
- Tax advice.
- Financial advice.
- Investment advice.
- Fiduciary advice.
- Medicaid planning advice.
- Medicare enrollment advice.
- Insurance sales advice.
- Personalized benefit recommendations.

## What Kefiw Can Help With

Kefiw can help users:

- Estimate possible costs.
- Organize questions.
- Compare care scenarios.
- Understand common terms.
- Track family responsibilities.
- Prepare for conversations with professionals.
- Identify possible planning gaps.

## What Kefiw Cannot Do

Kefiw cannot:

- Determine eligibility for benefits.
- Tell users which plan to buy.
- Interpret a full insurance policy.
- Give tax advice.
- Create legal documents.
- Replace an attorney.
- Replace a licensed insurance professional.
- Replace a financial planner.
- Guarantee cost estimates.
- Confirm Medicaid eligibility.
- Confirm IRS treatment of expenses.
- Confirm VA benefit eligibility.

## Medicare And Insurance Note

Medicare and insurance rules can vary by:

- Year.
- Plan.
- Location.
- Income.
- Enrollment timing.
- Provider network.
- Pharmacy.
- Drug list.
- Health needs.
- Coverage type.

Users should confirm details with Medicare, Social Security, SHIP, insurers, licensed insurance professionals, employers, tax professionals, attorneys, or other qualified advisors.

## Legal Document Note

Power of attorney, health care proxy, advance directive, guardianship, Medicaid, contract, and caregiver payment rules vary by state and situation.

Users should consult a qualified attorney for legal questions.

## Tax Note

HSA, FSA, caregiver payment, reimbursement, deduction, and dependent-care questions can have tax consequences. Users should consult a qualified tax professional.

## Bottom-Line Disclaimer

Kefiw helps users prepare. Qualified professionals help users decide and act.
`,
  }),
  trustPage({
    slug: 'calculator-limitations',
    title: 'Kefiw Calculator Limitations and Estimate Policy',
    h1: 'Kefiw Calculator Limitations and Estimate Policy',
    description:
      'Learn how Kefiw calculators estimate care costs, Medicare costs, caregiver hours, insurance expenses, and family care budgets, and what their limitations are.',
    keywords: ['Kefiw calculator limitations', 'care calculator estimate policy', 'senior care calculator disclaimer'],
    intro:
      'Kefiw calculators are designed to make care planning clearer.',
    outcomeLine:
      'Calculators provide estimates, not guarantees.',
    relatedLinks: [
      { href: '/care/senior-care-cost-calculator/', label: 'Senior Care Cost Calculator' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/financial-legal-insurance-disclaimer/', label: 'Financial and Legal Disclaimer' },
    ],
    body: `## What Calculators Can Do

Kefiw calculators can help users:

- Compare scenarios.
- See cost drivers.
- Estimate monthly and annual costs.
- Estimate caregiving workload.
- Identify gaps.
- Prepare family conversations.
- Ask providers better questions.
- Understand how one input changes the result.

## What Calculators Cannot Do

They cannot:

- Guarantee actual cost.
- Confirm eligibility.
- Replace quotes from providers.
- Replace Medicare, Medicaid, IRS, or insurer guidance.
- Predict future health changes.
- Confirm plan coverage.
- Confirm facility billing.
- Account for every state, plan, provider, or family situation.
- Replace professional advice.

## Required Calculator Result Disclaimer

Use this on every result page:

This estimate is for educational planning only. Actual costs may vary based on location, provider, care needs, plan terms, income, eligibility, family support, market rates, and future changes. Confirm details with providers, insurers, Medicare, Medicaid, tax professionals, legal professionals, or qualified advisors as appropriate.

## Calculator Transparency Requirements

Every calculator should show:

- Main inputs used.
- Key assumptions.
- Data year.
- Whether results are monthly, annual, or scenario-based.
- What is included.
- What is excluded.
- Last updated date.
- Suggested next step.

## Example: Senior Care Cost Calculator Assumptions

Show users whether the estimate includes:

- Base facility cost.
- Care-level fees.
- Home care hours.
- Medication support.
- Transportation.
- Supplies.
- Family caregiving hours.
- Insurance or Medicare assumptions.
- One-time fees.

## Example: Caregiver Hours Calculator Assumptions

Show users whether the estimate includes:

- Direct care.
- Supervision.
- Transportation.
- Meal support.
- Medication support.
- Emotional support.
- Paperwork.
- Family coordination.
- Nighttime care.

## Kefiw Tip

A good calculator does not only produce a number. It should explain what might make the number wrong.

For example:

"This estimate may be low if overnight supervision, memory care, two-person transfers, or medication management fees are needed."
`,
  }),
  trustPage({
    slug: 'corrections-policy',
    title: 'Kefiw Corrections and Feedback Policy',
    h1: 'Kefiw Corrections and Feedback Policy',
    description:
      'Learn how Kefiw handles corrections, updates, user feedback, outdated information, and content quality concerns.',
    keywords: ['Kefiw corrections policy', 'care content feedback', 'outdated information corrections'],
    intro:
      'Care content must be maintained.',
    outcomeLine:
      'Kefiw welcomes corrections, feedback, and update requests because care, Medicare, insurance, tax, legal, and benefit information can change.',
    primaryCta: { href: '/contact/', label: 'Contact Kefiw' },
    relatedLinks: [
      { href: '/care/guides/source-policy/', label: 'Source Policy' },
      { href: '/care/guides/review-board/', label: 'Review Board' },
      { href: '/care/guides/editorial-standards/', label: 'Editorial Standards' },
    ],
    body: `## What Users Can Report

Users can report:

- Outdated information.
- Broken links.
- Incorrect cost figures.
- Medicare or insurance changes.
- Unclear wording.
- Safety concerns.
- Missing disclaimer language.
- Accessibility issues.
- Calculator assumptions that need clarification.
- Source concerns.
- Professional review concerns.

## How Kefiw Should Handle Corrections

Use this process:

1. Log the issue.
2. Identify the affected page or tool.
3. Classify the risk.
4. Check sources.
5. Ask a reviewer when needed.
6. Update the content.
7. Add or revise the last reviewed date.
8. Record what changed.

## Correction Priority Levels

| Level | Examples | Target action |
| --- | --- | --- |
| Critical | Unsafe medical wording, emergency guidance issue, major legal or coverage error | Immediate review |
| High | Medicare amount, IRS limit, Medicaid process, insurance eligibility, calculator issue | Prompt review |
| Medium | Unclear wording, missing source, outdated non-critical guide | Scheduled update |
| Low | Typo, formatting, non-substantive issue | Routine update |

## Public Correction Note Template

Use when an important page changes:

Correction note: This page was updated on [date] to clarify [issue]. The update does not replace professional advice and users should confirm details with qualified sources.

## Kefiw Tip

Do not hide meaningful corrections. A visible correction note builds trust.

## Feedback Prompt

Add this at the bottom of guides:

See something that looks outdated, unclear, or incomplete? Tell Kefiw so we can review it.
`,
  }),
  trustPage({
    slug: 'affiliate-disclosure',
    title: 'Kefiw Advertising, Affiliate, and Conflict of Interest Disclosure',
    h1: 'Kefiw Advertising, Affiliate, and Conflict of Interest Disclosure',
    description:
      'Learn how Kefiw handles advertising, affiliate relationships, sponsored content, product recommendations, reviewer independence, and conflicts of interest.',
    keywords: ['Kefiw affiliate disclosure', 'advertising disclosure', 'care content conflict of interest'],
    intro:
      'Users should know whether money influences what they see.',
    outcomeLine:
      'Kefiw should clearly separate editorial guidance from advertising, sponsored content, affiliate relationships, referral relationships, or commercial partnerships.',
    sources: [SOURCE_FTC_ENDORSEMENTS, SOURCE_FTC_REVIEWS],
    relatedLinks: [
      { href: '/care/guides/editorial-standards/', label: 'Editorial Standards' },
      { href: '/care/guides/review-board/', label: 'Review Board' },
      { href: '/care/guides/corrections-policy/', label: 'Corrections Policy' },
    ],
    body: `## FTC Context

The FTC's endorsement guidance emphasizes that context matters and points advertisers, influencers, bloggers, and others to endorsement guidance, including principles and examples around disclosures and consumer understanding.

## Kefiw Editorial Independence Standard

Kefiw care guidance should not recommend a care provider, insurance plan, product, or service solely because of a commercial relationship.

If Kefiw receives compensation from a link, referral, sponsorship, or partner, that relationship should be disclosed clearly.

## Required Disclosure Language

Use this near relevant content:

Kefiw may receive compensation from some links, referrals, or partnerships. Compensation does not determine our educational guidance, care checklists, red flags, or calculator assumptions. When a page includes a paid relationship, sponsored placement, or affiliate link, we identify it clearly.

## Sponsored Content Rule

Sponsored content should be labeled as sponsored.

Sponsored content should not be presented as independent editorial guidance.

## Reviewer Conflict Rule

Reviewers should disclose relevant conflicts, such as:

- Employment by a provider.
- Insurance sales relationship.
- Referral arrangement.
- Paid partnership.
- Financial interest.
- Product or service affiliation.

## Provider Directory Rule

If Kefiw later offers provider listings, the listing should clearly distinguish:

- Paid placement.
- Sponsored listing.
- Editorially selected resource.
- User-submitted resource.
- Government or nonprofit resource.

## Kefiw Tip

Disclosure should appear before the user acts, not buried after the recommendation.
`,
  }),
  trustPage({
    slug: 'ai-human-review-policy',
    title: 'Kefiw AI Assistance and Human Review Policy',
    h1: 'Kefiw AI Assistance and Human Review Policy',
    description:
      'Learn how Kefiw uses AI assistance, human review, expert review, and editorial oversight for care guides, calculators, checklists, and planning tools.',
    keywords: ['Kefiw AI policy', 'AI human review policy', 'care content human review'],
    intro:
      'Kefiw may use AI-assisted tools to help organize, draft, summarize, or improve care content.',
    outcomeLine:
      'Care content should not be published on AI output alone when it involves health, Medicare, insurance, legal, tax, safety, or financial decisions.',
    relatedLinks: [
      { href: '/care/guides/review-board/', label: 'Review Board' },
      { href: '/care/guides/editorial-standards/', label: 'Editorial Standards' },
      { href: '/care/guides/source-policy/', label: 'Source Policy' },
    ],
    body: `## What AI May Help With

AI may help Kefiw:

- Draft outlines.
- Summarize source material.
- Generate checklist structures.
- Improve plain language.
- Create family scripts.
- Identify content gaps.
- Organize calculator explanations.
- Suggest internal links.
- Draft scenario examples.

## What Requires Human Review

Human review should be required for:

- Medical or urgent-care language.
- Medication guidance.
- Fall safety.
- Dementia safety.
- Mental health crisis language.
- Medicare rules.
- Insurance rules.
- Medicaid guidance.
- Legal document explanations.
- Tax-sensitive content.
- Calculator assumptions.
- Cost figures.
- Disclaimers.
- Red flags.
- Any content that may influence a high-stakes decision.

## What Requires Expert Review

Expert review should be required for:

- Medical safety.
- Medication content.
- Legal authority.
- Medicaid look-back.
- Insurance policy interpretation.
- Medicare plan comparison.
- Tax treatment.
- Facility contract language.
- Care urgency tool logic.
- Mental health crisis safety.

## AI-Use Disclosure Template

Use this internally or publicly if desired:

Kefiw may use AI-assisted drafting and organization tools. Content is reviewed, edited, and maintained by humans, with expert review applied to higher-risk health, legal, insurance, Medicare, financial, and safety topics.

## Kefiw Tip

AI can help draft content quickly. It should not be the final authority on care decisions.
`,
  }),
  trustPage({
    slug: 'accessibility-plain-language',
    title: 'Kefiw Accessibility and Plain-Language Commitment',
    h1: 'Kefiw Accessibility and Plain-Language Commitment',
    description:
      'Learn how Kefiw makes care content easier to read, navigate, understand, print, and use for caregivers, older adults, and families.',
    keywords: ['Kefiw accessibility commitment', 'plain language care guides', 'caregiver accessibility'],
    intro:
      'Kefiw is built for people who may be tired, stressed, grieving, rushed, or caring for someone while trying to make a complicated decision.',
    outcomeLine:
      'Accessibility is not an extra feature. It is part of care.',
    sources: [SOURCE_WCAG_22],
    relatedLinks: [
      { href: '/care/guides/editorial-standards/', label: 'Editorial Standards' },
      { href: '/care/guides/corrections-policy/', label: 'Corrections Policy' },
      { href: '/care/guides/privacy-care-data-notice/', label: 'Privacy and Care Data Notice' },
    ],
    body: `## Accessibility Context

WCAG 2.2 covers recommendations for making web content more accessible to people with disabilities. W3C notes that accessibility includes visual, auditory, physical, speech, cognitive, language, learning, neurological, and other needs, and that following the guidelines often improves usability for users in general.

## Plain-Language Standards

Kefiw should use:

- Short paragraphs.
- Clear headings.
- Simple sentences.
- Defined terms.
- Plain-English summaries.
- Scannable checklists.
- Step-by-step instructions.
- Real examples.
- Scripts users can say out loud.
- Avoidance of unnecessary jargon.

## Accessibility Standards

Kefiw should aim for:

- Keyboard-friendly navigation.
- Screen reader compatibility.
- Clear heading structure.
- Alt text for meaningful images.
- High color contrast.
- Visible focus states.
- Large enough touch targets.
- Descriptive link text.
- Form labels.
- Error messages that explain what to fix.
- Print-friendly worksheets.
- Avoidance of color-only meaning.

## Caregiver Usability Standards

Kefiw should assume users may be:

- Reading on a phone in a hospital.
- Printing a worksheet before a tour.
- Sharing a guide with siblings.
- Using the site late at night.
- Looking for one answer quickly.
- Navigating while emotionally overwhelmed.

## Kefiw Tip

A caregiver should be able to understand the next step in 30 seconds.

Every major page should include:

- What this is.
- Who it helps.
- What to do next.
- When to get professional help.
- Related tool.

## Accessibility Feedback Prompt

Having trouble using this page, form, calculator, or worksheet? Tell Kefiw so we can review and improve it.
`,
  }),
  trustPage({
    slug: 'privacy-care-data-notice',
    title: 'Kefiw Privacy and Sensitive Care Data Notice for Care Tools',
    h1: 'Kefiw Privacy and Sensitive Care Data Notice',
    description:
      'Learn what types of sensitive care information users may enter into Kefiw tools and how families should think about privacy, sharing, and printed care summaries.',
    keywords: ['Kefiw care privacy notice', 'sensitive care data', 'care worksheet privacy'],
    intro:
      'Care planning can involve sensitive information.',
    outcomeLine:
      'Users should think carefully about what they enter, save, print, or share.',
    relatedLinks: [
      { href: '/privacy/', label: 'Kefiw Privacy Policy' },
      { href: '/care/guides/accessibility-plain-language/', label: 'Accessibility and Plain Language' },
      { href: '/care/guides/corrections-policy/', label: 'Corrections Policy' },
    ],
    body: `## Information Users May Enter

Kefiw care tools may involve:

- Care needs.
- Cost estimates.
- Family caregiver hours.
- Medicare or insurance details.
- Medication-related notes.
- Facility comparisons.
- Emergency contacts.
- Family budget information.
- Legal document tracking.
- Stress or sleep reflections.
- Care urgency observations.

## User Responsibility Reminder

Users should avoid entering unnecessary sensitive details.

For example:

- Use initials instead of full names when possible.
- Avoid entering full account numbers.
- Avoid uploading legal documents unless the product specifically supports secure handling.
- Avoid sharing private summaries with people who do not need them.
- Keep printed worksheets secure.

## Family Sharing Note

A care summary may be helpful for siblings, doctors, attorneys, insurers, or care providers.

But not everyone needs every detail.

Use the Kefiw privacy split:

| Share level | Examples |
| --- | --- |
| Share broadly | Task list, appointment schedule, general care plan |
| Share carefully | Medication list, diagnoses, financial estimates |
| Share only with authorized people | Legal documents, account details, insurance claims, sensitive health notes |

## Printed Worksheet Warning

Printed care worksheets can contain sensitive information.

Users should:

- Store them securely.
- Avoid leaving them in public places.
- Shred outdated copies when needed.
- Keep emergency information accessible only to appropriate helpers.
- Separate emergency-access information from private financial or legal records.

## Kefiw Tip

Use three folders:

- Emergency folder: medication, allergies, contacts, doctors.
- Care folder: routines, tasks, schedules, notes.
- Private folder: legal, financial, account, and sensitive documents.

Do not put everything in one folder if not everyone should see everything.

## Disclaimer

This page is not a full privacy policy. Kefiw should maintain a separate legal privacy policy that explains data collection, storage, use, sharing, security, user rights, and retention.
`,
  }),
];

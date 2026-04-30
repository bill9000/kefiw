import type { ContentPageConfig } from '../content-pages';

const SOURCE_NIA_AFFAIRS =
  '[NIA: Getting your affairs in order checklist](https://www.nia.nih.gov/health/advance-care-planning/getting-your-affairs-order-checklist-documents-prepare-future)';
const SOURCE_NIA_ADVANCE_CARE =
  '[NIA: Advance Care Planning conversation guide](https://order.nia.nih.gov/sites/default/files/2023-04/nia-advance-care-planning.pdf)';
const SOURCE_NIA_PROXY_WORKSHEET =
  '[NIA: Choose a health care proxy worksheet](https://www.nia.nih.gov/sites/default/files/2023-08/choose-health-care-proxy-worksheet.pdf)';
const SOURCE_MEDLINE_ADVANCE_DIRECTIVES =
  '[MedlinePlus: Advance directives](https://medlineplus.gov/advancedirectives.html)';
const SOURCE_MEDLINE_HEALTH_CARE_AGENTS =
  '[MedlinePlus: Health care agents](https://medlineplus.gov/ency/patientinstructions/000469.htm)';
const SOURCE_CFPB_MSEM =
  "[CFPB: Managing someone else's money](https://www.consumerfinance.gov/consumer-tools/managing-someone-elses-money/)";
const SOURCE_CFPB_GUARDIAN_PROPERTY =
  '[CFPB: What is a guardian of property?](https://www.consumerfinance.gov/ask-cfpb/what-is-a-guardian-of-property-en-1773/)';
const SOURCE_HHS_HIPAA_FAMILY =
  '[HHS: HIPAA and family members or friends](https://www.hhs.gov/hipaa/for-individuals/family-members-friends/index.html)';
const SOURCE_HHS_HIPAA_PERSONAL_REP =
  '[HHS: HIPAA personal representatives](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/personal-representatives/index.html)';
const SOURCE_HHS_HIPAA_ACCESS =
  '[HHS: When family members may access PHI](https://www.hhs.gov/hipaa/for-professionals/faq/2069/under-hipaa-when-can-a-family-member/index.html)';
const SOURCE_SSA_REP_PAYEE_BENEFICIARY =
  '[SSA: Representative payee FAQ for beneficiaries](https://www.ssa.gov/payee/faqbene.htm?tl=0%2C4%2C12%2C13)';
const SOURCE_SSA_REP_PAYEE =
  '[SSA: Representative payee FAQ](https://www.ssa.gov/payee/faqrep.htm?tl=8%2C10)';
const SOURCE_SSA_ADVANCE_DESIGNATION =
  '[SSA: Advance designation of representative payee](https://www.ssa.gov/payee/advance_designation.htm)';
const SOURCE_ACL_GUARDIANSHIP_ALTERNATIVES =
  '[ACL: Alternatives to guardianship](https://acl.gov/programs/empowering-advocacy/alternatives-guardianship)';
const SOURCE_ABA_GUARDIANSHIP =
  '[ABA: Guardianship and conservatorship resources](https://www.americanbar.org/groups/law_aging/resources/guardianship_law_practice/)';
const SOURCE_ABA_GUARDIAN_DECISIONS =
  '[ABA: Statutory provisions for guardians ad litem](https://www.americanbar.org/groups/law_aging/publications/bifocal/vol--39/issue-6--july-august-2018-/statutory-provisions-for-guardians-ad-litem/)';
const SOURCE_NAELA =
  '[NAELA: National Academy of Elder Law Attorneys](https://www.naela.org/)';
const SOURCE_FCA_PERSONAL_CARE =
  '[Family Caregiver Alliance: Personal care agreements](https://www.caregiver.org/resource/personal-care-agreements/)';
const SOURCE_IRS_FAMILY_CAREGIVERS =
  '[IRS: Family caregivers and self-employment tax](https://www.irs.gov/businesses/small-businesses-self-employed/family-caregivers-and-self-employment-tax)';
const SOURCE_IRS_PUB_926 =
  "[IRS Publication 926: 2026 Household Employer's Tax Guide](https://www.irs.gov/publications/p926)";

const LEGAL_CATEGORY = 'Legal & Planning Documents';
const FAMILY_CATEGORY = 'Family Decision Support';

const sharedLegalPlanningDisclaimer = `## Kefiw Legal And Planning Disclaimer

Kefiw provides educational care-planning tools and guides. This content does not provide legal, tax, financial, insurance, employment, benefits, medical, or emergency advice. Legal documents, authority rules, signing requirements, Medicaid rules, tax treatment, benefits processes, and privacy rules vary by state, agency, provider, plan, institution, and situation. Confirm details with an elder law attorney, estate planning attorney, tax professional, financial professional, benefits agency, health care provider, or other qualified advisor.

## Continue Planning With Kefiw

- [Build a caregiver emergency binder](/care/guides/caregiver-emergency-binder/)
- [Run the Care Needs Checklist](/care/care-needs-checklist/)
- [Build a family care budget](/care/family-care-budget-calculator/)
- [Review the Facility Contract Checklist](/care/guides/facility-contract-checklist/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withLegalPlanningFooter(body: string, reviewer: string, sources: string[]): string {
  return `${body}

## State-Specific Warning

Rules vary by state. Use this guide to prepare better questions, then confirm the details with a qualified professional or the relevant agency before acting.

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedLegalPlanningDisclaimer}`;
}

const faq = (q: string, a: string, faq_intent = 'how-to') => ({ q, a, faq_intent });

export const CARE_LEGAL_PLANNING_NEW_GUIDES: ContentPageConfig[] = [
  {
    id: 'art-care-legal-documents-family-caregivers',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'legal-documents-family-caregivers',
    title: 'Legal Documents Every Family Caregiver Should Know | Kefiw',
    h1: 'Legal Documents Every Family Caregiver Should Know',
    description:
      'Learn the key legal and planning documents family caregivers should understand, including advance directives, health care proxy, power of attorney, HIPAA releases, wills, trusts, and emergency records.',
    metaDescription:
      'Learn the key legal and planning documents family caregivers should understand, including advance directives, health care proxy, power of attorney, HIPAA releases, wills, trusts, and emergency records.',
    keywords: ['legal documents family caregivers', 'caregiver legal documents', 'elder care documents checklist'],
    intro:
      'Family caregiving often starts with practical help. Then someone asks who is legally allowed to decide, access information, or pay bills.',
    outcomeLine:
      'Caregiving documents should clarify health decisions, money authority, information access, benefits, emergency records, and family reimbursement before a crisis.',
    faq: [
      faq('What legal documents should family caregivers know?', 'Start with health care proxy or medical power of attorney, advance directive or living will, durable financial power of attorney, HIPAA releases, wills or trusts, benefits records, insurance records, emergency sheets, and reimbursement records.', 'definition'),
      faq('Does being an adult child automatically give legal authority?', 'Not always. A caregiver may still need documents or agency authorization before doctors, banks, insurers, facilities, Social Security, or benefit programs will share information or accept instructions.'),
      faq('What is the difference between access and authority?', 'Access means someone can receive information. Decision authority means someone can make decisions. Money authority means someone can manage funds. Benefit authority may require a separate agency process.'),
    ],
    primaryCta: { href: '/care/guides/caregiver-emergency-binder/', label: 'Build Emergency Binder' },
    relatedLinks: [
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

Family caregivers should understand these document categories:

- Health care decision documents.
- Financial authority documents.
- Medical information access forms.
- Estate planning documents.
- Insurance and benefits records.
- Emergency care records.
- Caregiving agreements and reimbursement records.

The National Institute on Aging recommends organizing important papers ahead of time, including advance directives, financial records, insurance information, wills, trusts, and other documents that may be needed in a medical or caregiving situation.

## The Kefiw Document Map

Use four columns:

| Need | Document | Who needs access | Where it lives |
|---|---|---|---|
| Medical decisions | Health care proxy / medical POA | Health decision-maker | Emergency binder |
| End-of-life preferences | Advance directive / living will | Doctors, proxy, family | Medical file |
| Money decisions | Durable financial POA | Financial agent | Secure file |
| Medical info sharing | HIPAA release / personal representative docs | Caregiver, proxy | Provider portals |
| Estate matters | Will / trust | Executor / trustee | Attorney / safe storage |
| Benefits | Medicare, Medicaid, VA, Social Security | Benefits manager | Care binder |
| Daily care | Medication list, doctors, emergency sheet | Care team | Easy-access copy |

## What Families Often Miss

Families often assume being the adult child, spouse, or primary caregiver automatically gives them authority.

Sometimes it does not.

- A doctor may not share full information.
- A bank may not allow bill payment.
- An insurer may not discuss claims.
- A facility may need written authorization.
- Social Security may require its own representative payee process.

Authority should be confirmed before the crisis.

## Kefiw Tip: Separate Access From Decision Authority

These are not the same.

- Access means someone can receive information.
- Decision authority means someone can make decisions.
- Money authority means someone can manage funds.
- Benefit authority may require a separate agency process.

One document rarely solves everything.

## Family Script

"We are not doing this because we expect the worst. We are doing it so no one has to guess who can make decisions, access records, or pay bills if something changes."

## Red Flags

- Only one person knows where documents are.
- No one knows who has financial authority.
- The health care proxy has never been told they were chosen.
- The caregiver cannot access medication or doctor information.
- The family assumes a power of attorney covers Social Security.
- Documents are outdated after divorce, death, remarriage, or relocation.
- The care plan depends on authority no one has confirmed.

## Checklist

- Locate advance directive.
- Locate health care proxy or medical POA.
- Locate financial POA.
- Confirm HIPAA access or medical information permissions.
- Locate will, trust, or estate planning documents.
- Locate insurance cards and policies.
- Locate Medicare, Medicaid, VA, and Social Security records.
- Create one-page emergency sheet.
- Store originals safely.
- Give copies to the right people.
- Review documents after major life changes.

## Related Kefiw Tools

- [Caregiver Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Care Needs Checklist](/care/care-needs-checklist/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'elder law attorney, estate planning attorney, or geriatric care manager',
      [SOURCE_NIA_AFFAIRS, SOURCE_NIA_ADVANCE_CARE, SOURCE_CFPB_MSEM, SOURCE_HHS_HIPAA_FAMILY, SOURCE_SSA_REP_PAYEE],
    ),
  },
  {
    id: 'art-care-health-care-proxy-medical-poa',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'health-care-proxy-medical-power-of-attorney',
    title: 'Health Care Proxy and Medical Power of Attorney Guide | Kefiw',
    h1: 'Health Care Proxy and Medical Power of Attorney Guide',
    description:
      'Learn how a health care proxy or medical power of attorney works, who to choose, what to discuss, and how families can avoid confusion during medical decisions.',
    metaDescription:
      'Learn how a health care proxy or medical power of attorney works, who to choose, what to discuss, and how families can avoid confusion during medical decisions.',
    keywords: ['health care proxy guide', 'medical power of attorney', 'choose health care proxy'],
    intro:
      'A health care proxy names someone to make medical decisions if a person cannot make or communicate those decisions.',
    outcomeLine:
      'The best proxy is the person who can understand the person\'s wishes, ask clear medical questions, communicate with family, and stay steady under pressure.',
    faq: [
      faq('What is a health care proxy?', 'A health care proxy, also called a medical power of attorney or health care agent in some places, is someone chosen to make health decisions if the person cannot decide or communicate.', 'definition'),
      faq('Who should be chosen as health care proxy?', 'Choose someone who understands the person\'s values, can talk to doctors, can handle family pressure, is available in an emergency, and will make the person\'s decision rather than their own preference.'),
      faq('Is naming a proxy enough?', 'No. The proxy needs a conversation about values, quality of life, treatment preferences, fears, tradeoffs, and who else should be consulted.'),
    ],
    primaryCta: { href: '/care/guides/caregiver-emergency-binder/', label: 'Add Proxy To Emergency Binder' },
    relatedLinks: [
      { href: '/care/guides/advance-directive-living-will/', label: 'Advance Directive Guide' },
      { href: '/health/medical-triage/', label: 'Care Urgency Check' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

A health care proxy is not just a name on a form.

It is a person who may need to make hard decisions under pressure, often with incomplete information and emotional family dynamics.

MedlinePlus explains that a durable power of attorney for health care names a health care proxy, which is someone trusted to make health decisions if the person is unable to do so.

## Who Should Be Chosen?

Look for someone who:

- Can stay calm under pressure.
- Understands the person's values.
- Is willing to ask doctors direct questions.
- Can communicate with family.
- Can handle disagreement.
- Is available in an emergency.
- Will make the person's decision, not their own preference.

NIA's proxy worksheet asks practical questions about whether the proxy can talk comfortably about wishes, honor those wishes, handle conflicting opinions, ask providers questions, and stand up for the person.

## What Families Often Miss

Naming a proxy is not enough.

The proxy needs a conversation.

Discuss:

- What quality of life means.
- What treatments would or would not be wanted.
- What scares the person most.
- What tradeoffs they would accept.
- Whether they want aggressive treatment in certain situations.
- Who else should be consulted.
- How family conflict should be handled.

## Kefiw Tip: Choose A Proxy And A Family Explainer

Sometimes the best decision-maker is not the best communicator.

A proxy may make the decision, while another family member helps explain the reasoning to siblings or relatives.

This can reduce conflict.

## Questions To Ask Before Naming A Proxy

- Would I trust this person in a crisis?
- Can they separate my wishes from their own?
- Can they talk to doctors confidently?
- Can they handle family pressure?
- Do they know my values?
- Are they willing to serve?
- Do they have a backup?
- Do they know where the documents are?

## Family Script

"I am choosing you because I trust you to make the decision I would make, not because I expect you to know everything. I want us to talk through what matters to me before there is a crisis."

## Red Flags

- The proxy has not agreed to serve.
- The proxy does not know the person's wishes.
- Multiple family members believe they are in charge.
- The named proxy lives far away and no backup is named.
- The proxy avoids medical conversations.
- The document is not accepted because it is outdated or incomplete.
- The family waits until the person lacks capacity to discuss wishes.

## Checklist

- Choose primary proxy.
- Choose backup proxy.
- Confirm they are willing.
- Discuss values and wishes.
- Complete state-appropriate document.
- Give copies to proxy, doctors, hospital, and trusted family.
- Add copy to emergency binder.
- Review after major diagnosis, relocation, death, divorce, or family change.

## Related Kefiw Tools

- [Caregiver Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Care Urgency Check](/health/medical-triage/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'elder law attorney, clinician, or advance care planning specialist',
      [SOURCE_MEDLINE_ADVANCE_DIRECTIVES, SOURCE_MEDLINE_HEALTH_CARE_AGENTS, SOURCE_NIA_PROXY_WORKSHEET, SOURCE_NIA_ADVANCE_CARE],
    ),
  },
  {
    id: 'art-care-advance-directive-living-will',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'advance-directive-living-will',
    title: 'Advance Directive and Living Will Guide for Families | Kefiw',
    h1: 'Advance Directive and Living Will Guide',
    description:
      'Understand advance directives and living wills, how they guide care when someone cannot speak for themselves, and what families should discuss before a crisis.',
    metaDescription:
      'Understand advance directives and living wills, how they guide care when someone cannot speak for themselves, and what families should discuss before a crisis.',
    keywords: ['advance directive guide', 'living will guide', 'advance care planning family'],
    intro:
      'An advance directive helps tell doctors and family what kind of medical care a person would want if they cannot speak for themselves.',
    outcomeLine:
      'An advance directive is not about giving up care. It is about giving guidance before family members are forced to guess.',
    faq: [
      faq('What is an advance directive?', 'An advance directive is a legal planning document that gives instructions about future medical care or names someone to make decisions if the person cannot communicate.', 'definition'),
      faq('What is the difference between a living will and health care proxy?', 'A living will describes care preferences. A health care proxy or medical power of attorney names the person who makes decisions.'),
      faq('Why should families discuss the document?', 'A signed form may use broad phrases that are hard to interpret. A values conversation helps the proxy apply the document in real situations.'),
    ],
    primaryCta: { href: '/health/medical-triage/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/health-care-proxy-medical-power-of-attorney/', label: 'Health Care Proxy Guide' },
      { href: '/care/guides/caregiver-emergency-binder/', label: 'Emergency Binder' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

An advance directive is not about giving up care.

It is about giving guidance.

It can help families answer:

- Who should speak for me?
- What treatments would I want?
- What treatments would I not want?
- What does comfort mean to me?
- What outcomes would I consider unacceptable?
- What values should guide decisions?

NIA explains that common advance directives include a living will and a durable power of attorney for health care. A living will describes how a person wants to be treated if they are dying or permanently unconscious and cannot decide; a durable power of attorney for health care names a decision-maker.

## Living Will Vs. Health Care Proxy

Living will: describes care preferences.

Health care proxy / medical POA: names the person who makes decisions.

Both matter because written instructions cannot predict every medical situation, and a proxy without guidance may feel lost.

## What Families Often Miss

Many people complete the document but skip the conversation.

That creates a problem.

A form may say "no extraordinary measures," but family may not know what that means in a real situation.

Translate vague wishes into examples.

Instead of:

"I do not want to be kept alive on machines."

Ask:

- What if the treatment might help you recover?
- What if recovery is unlikely?
- What if you could not recognize family?
- What if you needed long-term tube feeding or ventilation?

## Kefiw Tip: Write A Values Note

Add a plain-language note to the legal document.

Example:

"What matters most to me is being able to recognize my family, communicate pain or comfort, and not spend my final days in a setting where treatment only prolongs suffering."

This helps the proxy interpret the document.

## Questions To Discuss

- What does quality of life mean?
- What abilities matter most?
- What fears should guide decisions?
- Who should make decisions?
- Who should not make decisions?
- What religious, cultural, or personal values matter?
- What care would be wanted if recovery were likely?
- What care would not be wanted if recovery were unlikely?
- Where should copies be stored?

## Family Script

"This conversation is not about being negative. It is about making sure the people who love you are not forced to guess during the hardest moment."

## Red Flags

- The document is signed but no one has read it.
- The named proxy does not know they are named.
- Family members disagree about what the person wanted.
- The document is locked away and unavailable.
- Wishes are vague.
- The form was completed years ago before major health changes.
- The person moved to another state and has not reviewed requirements.

## Checklist

- Complete advance directive.
- Name health care proxy.
- Name backup proxy.
- Discuss values.
- Give copies to proxy and doctors.
- Add to medical portal if possible.
- Add to emergency binder.
- Review after major health or family changes.
- Revisit every few years.

## Related Kefiw Tools

- [Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Care Urgency Check](/health/medical-triage/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'elder law attorney, clinician, or advance care planning specialist',
      [SOURCE_NIA_ADVANCE_CARE, SOURCE_MEDLINE_ADVANCE_DIRECTIVES, SOURCE_MEDLINE_HEALTH_CARE_AGENTS],
    ),
  },
  {
    id: 'art-care-durable-financial-power-of-attorney',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'durable-financial-power-of-attorney',
    title: 'Durable Financial Power of Attorney Guide for Family Caregivers | Kefiw',
    h1: 'Durable Financial Power of Attorney Guide',
    description:
      'Learn how durable financial power of attorney works, what an agent may manage, what families should document, and why authority should be confirmed before a crisis.',
    metaDescription:
      'Learn how durable financial power of attorney works, what an agent may manage, what families should document, and why authority should be confirmed before a crisis.',
    keywords: ['durable financial power of attorney', 'financial POA caregiver', 'power of attorney paying bills'],
    intro:
      'A durable financial power of attorney can allow someone to act on another person\'s financial behalf, depending on the document and state law.',
    outcomeLine:
      'Families should confirm what the POA authorizes and what banks, insurers, facilities, and benefits agencies require before care bills become urgent.',
    faq: [
      faq('What can a financial power of attorney help with?', 'It may help a trusted agent pay bills, manage bank accounts, handle insurance payments, sign certain documents, manage property, coordinate care payments, and work with financial institutions.'),
      faq('Is a financial POA accepted everywhere automatically?', 'No. Institutions may review the document, require their own forms, or have separate authorization processes. Social Security uses a representative payee process.'),
      faq('What should a financial POA agent document?', 'The agent should keep funds separate, save receipts, track bills, document care expenses, keep monthly summaries, and stay within the authority granted by the document and law.'),
    ],
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/guides/managing-someone-elses-money/', label: "Managing Someone Else's Money" },
      { href: '/care/guides/facility-contract-checklist/', label: 'Facility Contract Checklist' },
      { href: '/care/guides/caregiver-emergency-binder/', label: 'Emergency Binder' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

A financial power of attorney can help a trusted person manage financial tasks such as:

- Paying bills.
- Managing bank accounts.
- Handling insurance payments.
- Signing certain documents.
- Managing property.
- Coordinating care payments.
- Working with financial institutions.

The exact authority depends on the document, state law, and what institutions accept.

The CFPB provides guides for people managing someone else's money, including agents under a power of attorney, guardians, trustees, and government fiduciaries.

## What Families Often Miss

A financial POA is not automatically accepted everywhere.

- A bank may require its own review.
- An insurer may need authorization.
- A facility may need proof of authority.
- Social Security uses its own representative payee process.
- The agent may have duties to act in the person's best interest.

## The Kefiw Financial Authority Map

| Task | Who can do it? | Document needed | Confirmed? |
|---|---|---|---|
| Pay bills | Agent | Financial POA | Yes/no |
| Talk to insurer | Agent/caregiver | POA or authorization | Yes/no |
| Access bank | Agent | Bank-approved POA | Yes/no |
| Manage Social Security | Representative payee | SSA appointment | Yes/no |
| Sign facility documents | Authorized agent | POA / contract review | Yes/no |
| Sell property | Agent / trustee | Specific legal authority | Yes/no |

## Kefiw Tip: Test The POA Before The Crisis

Do not wait until a hospital discharge or facility bill.

Call banks, insurers, and key institutions while the person is still able to participate and ask:

"What do you require to recognize this power of attorney?"

This prevents delays later.

## Questions To Ask An Attorney

- Is the POA durable?
- When does it take effect?
- What powers are included?
- What powers are excluded?
- Can the agent make gifts?
- Can the agent handle real estate?
- Can the agent work with benefits?
- Are backups named?
- Does the state require witnesses or notarization?
- Should banks review it now?

## Family Script

"We need to make sure the person paying bills has legal authority and clear records, so care expenses do not become confused or disputed later."

## Red Flags

- The financial agent is not trusted by the family.
- The agent mixes their own money with the older adult's money.
- Receipts are not kept.
- The agent uses funds for themselves.
- The POA is outdated.
- No backup agent is named.
- The family assumes POA covers Social Security benefits.
- The POA is locked away and unavailable when needed.

## Checklist

- Locate financial POA.
- Confirm it is durable if needed.
- Confirm primary and backup agents.
- Review powers with attorney.
- Confirm bank acceptance.
- Confirm insurance and facility requirements.
- Keep separate accounts and records.
- Save receipts.
- Prepare monthly expense summary.
- Review after relocation, divorce, death, or major health change.

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Caregiver Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Facility Contract Checklist](/care/guides/facility-contract-checklist/)`,
      'elder law attorney or financial planner',
      [SOURCE_CFPB_MSEM, SOURCE_CFPB_GUARDIAN_PROPERTY, SOURCE_SSA_REP_PAYEE],
    ),
  },
  {
    id: 'art-care-hipaa-release-caregivers',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'hipaa-release-caregivers',
    title: 'HIPAA Release and Medical Information Sharing for Family Caregivers | Kefiw',
    h1: 'HIPAA Release and Medical Information Sharing Guide',
    description:
      'Learn how HIPAA affects family caregivers, when providers may share information, what a personal representative is, and why families should plan access before a crisis.',
    metaDescription:
      'Learn how HIPAA affects family caregivers, when providers may share information, what a personal representative is, and why families should plan access before a crisis.',
    keywords: ['HIPAA release caregivers', 'medical information sharing family caregiver', 'HIPAA personal representative'],
    intro:
      'Family caregivers often assume doctors, hospitals, pharmacies, and insurers will automatically share information with them. Sometimes they can, and sometimes they need permission or proof of authority.',
    outcomeLine:
      'Plan medical information access before appointments, hospital discharge, pharmacy questions, and portal messages become urgent.',
    faq: [
      faq('Does HIPAA require providers to share information with family?', 'HHS says HIPAA does not require a provider or health plan to share information with family or friends unless they are personal representatives, though relevant sharing may be allowed in certain situations.'),
      faq('What is a HIPAA personal representative?', 'A personal representative is someone authorized under state or other applicable law to act for the person in health care decisions, and HHS says they generally stand in the shoes of the individual for relevant HIPAA rights.'),
      faq('Is HIPAA access the same as decision authority?', 'No. A caregiver may be allowed to receive limited relevant information without having authority to make medical decisions.'),
    ],
    primaryCta: { href: '/care/guides/medication-management-family-caregivers/', label: 'Review Medication Management' },
    relatedLinks: [
      { href: '/care/guides/caregiver-emergency-binder/', label: 'Emergency Binder' },
      { href: '/health/medical-triage/', label: 'Care Urgency Check' },
      { href: '/care/guides/health-care-proxy-medical-power-of-attorney/', label: 'Health Care Proxy Guide' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

A HIPAA release or medical information authorization can help a caregiver receive health information.

A health care proxy or personal representative may have broader rights when legally authorized.

But access depends on the role, the document, the provider, and state law.

HHS explains that the HIPAA Privacy Rule does not require a provider or health plan to share information with family or friends unless they are the person's personal representative. HHS also says providers may share relevant information with family or friends in certain situations if the patient agrees, does not object, or the provider uses professional judgment.

## Personal Representative Vs. Involved Caregiver

HHS says a personal representative generally stands in the shoes of the individual and may exercise the person's rights under HIPAA, including access to protected health information relevant to that role. State law helps determine who has authority.

An involved caregiver may be allowed to receive limited relevant information, but that is not the same as full legal authority.

## What Families Often Miss

A caregiver can be doing all the work and still lack access.

They may drive to appointments, manage medications, and pay for supplies, but still be blocked from:

- Portal messages.
- Test results.
- Hospital updates.
- Insurance claims.
- Medication details.
- Discharge instructions.

Access should be planned before the crisis.

## Kefiw Tip: Create A Medical Access List

For each provider, write:

| Provider | Who can receive info? | Form completed? | Portal access? |
|---|---|---|---|
| Primary doctor | Daughter | Yes/no | Yes/no |
| Hospital | Health proxy | Yes/no | Yes/no |
| Pharmacy | Caregiver | Yes/no | Yes/no |
| Medicare plan | Agent | Yes/no | Yes/no |
| Home care agency | Family contact | Yes/no | Yes/no |

## Questions To Ask Providers

- What form allows family access?
- Can more than one person be listed?
- Does the form expire?
- Can the caregiver access the portal?
- Can the caregiver receive discharge instructions?
- Can the caregiver talk to the nurse line?
- What does the health care proxy need to provide?
- What is needed after hospitalization?
- What happens if the patient cannot communicate?

## Family Script

"I am helping with medications, appointments, and follow-up. What authorization do we need so I can receive the information necessary to help safely?"

## Red Flags

- Caregiver attends appointments but gets no written instructions.
- Multiple family members assume they can access records.
- The patient's preferences are not documented.
- No one has portal access.
- Hospital discharge happens without the caregiver receiving instructions.
- The family confuses HIPAA access with decision authority.
- Providers have outdated contacts.

## Checklist

- Ask each provider about HIPAA authorization.
- List approved caregivers.
- Confirm portal access.
- Confirm pharmacy permissions.
- Confirm hospital contact rules.
- Confirm insurance plan permissions.
- Keep copies in emergency binder.
- Update after provider, insurance, or caregiver changes.

## Related Kefiw Tools

- [Medication Management Guide](/care/guides/medication-management-family-caregivers/)
- [Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Care Urgency Check](/health/medical-triage/)`,
      'health care privacy professional, elder law attorney, or clinician',
      [SOURCE_HHS_HIPAA_FAMILY, SOURCE_HHS_HIPAA_PERSONAL_REP, SOURCE_HHS_HIPAA_ACCESS],
    ),
  },
  {
    id: 'art-care-managing-someone-elses-money',
    kind: 'guide',
    section: 'guides',
    guideCategory: FAMILY_CATEGORY,
    slug: 'managing-someone-elses-money',
    title: "Managing Someone Else's Money as a Family Caregiver | Kefiw",
    h1: "Managing Someone Else's Money Guide",
    description:
      "Learn practical rules for managing an aging parent's money, including records, separate accounts, receipts, bills, authority, and family transparency.",
    metaDescription:
      "Learn practical rules for managing an aging parent's money, including records, separate accounts, receipts, bills, authority, and family transparency.",
    keywords: ['managing someone else money caregiver', 'financial caregiver records', 'aging parent money management'],
    intro:
      'Managing someone else\'s money is a caregiving role, but it is also a trust role.',
    outcomeLine:
      'The practical rule is simple: separate, document, explain.',
    faq: [
      faq('What is the main rule for managing someone else\'s money?', 'Use the money for that person\'s benefit, keep records, avoid conflicts, keep funds separate, and stay within your legal authority.'),
      faq('Why does transparency matter?', 'Financial caregiving can create suspicion even when the caregiver is honest. Monthly summaries and receipts protect the caregiver, the care recipient, and the family.'),
      faq('What should go in a money decision log?', 'For major expenses, record the date, amount, purpose, approval, funds used, receipt location, and whether the expense is one-time or recurring.'),
    ],
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/guides/medicaid-look-back-period/', label: 'Medicaid Look-Back Guide' },
      { href: '/care/guides/caregiver-reimbursement-expense-tracking/', label: 'Caregiver Reimbursement Guide' },
      { href: '/care/guides/durable-financial-power-of-attorney/', label: 'Financial POA Guide' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

If you manage someone else's money, your job is to use the money for that person's benefit, keep records, avoid conflicts, and stay within your legal authority.

The practical rule is:

Separate, document, explain.

The CFPB's Managing Someone Else's Money guides are designed for people in fiduciary roles such as agents under a power of attorney, guardians, trustees, and government fiduciaries.

## The Kefiw Money Management Rules

### 1. Keep Funds Separate

Do not mix the older adult's money with your own.

### 2. Keep Receipts

Save invoices, bank records, care receipts, mileage records, insurance notices, and facility statements.

### 3. Document Decisions

Write down why major expenses were paid.

### 4. Avoid Cash Confusion

Cash is hard to track. Use traceable payments when possible.

### 5. Share Summaries

If appropriate, share monthly summaries with trusted family or authorized people.

### 6. Do Not Self-Pay Casually

If a caregiver is being paid, use a written agreement and professional guidance.

### 7. Watch For Exploitation

Track unusual withdrawals, new friends with money access, sudden account changes, and unpaid bills.

## What Families Often Miss

Financial caregiving can create suspicion even when the caregiver is honest.

Transparency protects everyone.

A monthly summary can prevent sibling conflict:

- Income received.
- Care bills paid.
- Supplies.
- Transportation.
- Reimbursements.
- Facility costs.
- Remaining balance.
- Upcoming expenses.

## Kefiw Tip: Create A Money Decision Log

For any expense over a set amount, write:

- Date.
- Amount.
- Purpose.
- Who approved it.
- Which funds were used.
- Receipt location.
- Whether it was one-time or recurring.

This makes later Medicaid, tax, family, or legal reviews easier.

## Family Script

"Because I am handling money, I want records to be clear. I will track income, bills, care expenses, reimbursements, and receipts so there is no confusion later."

## Red Flags

- Money is moved without explanation.
- The caregiver uses the older adult's account for personal purchases.
- Receipts are missing.
- A sibling controls money but refuses transparency.
- Bills go unpaid despite available funds.
- New people gain access to accounts.
- The older adult is pressured to sign financial documents.
- Large gifts are made while Medicaid may become relevant.

## Checklist

- Confirm legal authority.
- Keep accounts separate.
- Save receipts.
- Track bills and reimbursements.
- Create monthly summary.
- Avoid undocumented caregiver payments.
- Watch for scams.
- Review Medicaid implications before transfers.
- Ask an elder law attorney or financial professional for complex issues.

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Caregiver Reimbursement Guide](/care/guides/caregiver-reimbursement-expense-tracking/)
- [Medicaid Look-Back Guide](/care/guides/medicaid-look-back-period/)`,
      'elder law attorney, financial planner, or fiduciary specialist',
      [SOURCE_CFPB_MSEM, SOURCE_CFPB_GUARDIAN_PROPERTY, SOURCE_SSA_REP_PAYEE],
    ),
  },
  {
    id: 'art-care-social-security-representative-payee',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'social-security-representative-payee',
    title: 'Social Security Representative Payee Guide for Family Caregivers | Kefiw',
    h1: 'Social Security Representative Payee Guide',
    description:
      'Learn what a Social Security representative payee is, why power of attorney is not enough for Social Security benefits, and how advance designation can help families plan.',
    metaDescription:
      'Learn what a Social Security representative payee is, why power of attorney is not enough for Social Security benefits, and how advance designation can help families plan.',
    keywords: ['Social Security representative payee', 'representative payee caregiver', 'power of attorney Social Security benefits'],
    intro:
      'A financial power of attorney does not automatically let someone manage another person\'s Social Security benefits.',
    outcomeLine:
      'Social Security authority is separate. A representative payee must apply and be appointed by Social Security.',
    faq: [
      faq('Is power of attorney enough for Social Security benefits?', 'No. Social Security says power of attorney, authorized representative status, or a joint bank account is not the same as being a representative payee.'),
      faq('What does a representative payee do?', 'A representative payee receives Social Security or SSI payments for someone who cannot manage them, uses the benefits for that person\'s needs, saves unused benefits properly, and keeps records.'),
      faq('What is advance designation?', 'SSA says advance designation lets a capable adult or emancipated minor name up to three people who could serve as representative payee if the need arises later. It is not an immediate appointment.'),
    ],
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/guides/managing-someone-elses-money/', label: "Managing Someone Else's Money" },
      { href: '/care/guides/caregiver-emergency-binder/', label: 'Emergency Binder' },
      { href: '/care/guides/durable-financial-power-of-attorney/', label: 'Financial POA Guide' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

A representative payee is a person or organization appointed by Social Security to manage Social Security or SSI payments for someone who cannot manage them.

Social Security says being an authorized representative, having power of attorney, or sharing a joint bank account is not the same as being a representative payee and does not give legal authority to negotiate and manage Social Security or SSI benefits. A person must apply and be appointed by Social Security.

## What A Representative Payee Does

A representative payee must use benefits for the beneficiary's needs.

Social Security says a payee's main duties are to use benefits for current and future needs, save benefits not needed for current needs, keep records, and provide accounting when requested.

Those needs can include:

- Food.
- Shelter.
- Clothing.
- Medical care.
- Personal comfort items.

## Advance Designation

Social Security allows advance designation, which lets a person name up to three people who could serve as representative payee if the need arises.

This does not appoint a payee immediately, but it gives Social Security trusted names to consider later.

SSA says advance designation is optional, can be updated or withdrawn, and is not power of attorney.

## What Families Often Miss

A family may have:

- Durable financial POA.
- Joint bank account.
- Health care proxy.
- Facility paperwork.

But still not have authority over Social Security benefits.

Kefiw should clearly teach:

Social Security authority is separate.

## Kefiw Tip: Add Social Security To The Authority Map

For each older adult, record:

- Social Security online account status.
- Whether advance designation is completed.
- Potential payees.
- Benefit amount.
- Direct deposit account.
- Who receives mail.
- Who knows how to report changes.
- Whether a payee may be needed.

## Family Script

"Power of attorney may help with many financial tasks, but Social Security has its own representative payee process. Let's plan for that before it becomes urgent."

## Red Flags

- A caregiver assumes POA covers Social Security.
- Benefit mail is ignored.
- Direct deposit changes are unclear.
- A person with dementia is still expected to manage benefits alone.
- Funds are used for someone other than the beneficiary.
- No one knows how benefits are being spent.
- A payee is needed but no one has applied.

## Checklist

- Confirm who manages Social Security benefits now.
- Learn whether representative payee may be needed.
- Consider advance designation.
- Save Social Security contact information.
- Keep benefit payments separate and traceable.
- Use benefits for the beneficiary's needs.
- Report required changes.
- Keep records.

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Managing Someone Else's Money Guide](/care/guides/managing-someone-elses-money/)
- [Emergency Binder](/care/guides/caregiver-emergency-binder/)`,
      'elder law attorney, benefits specialist, or fiduciary specialist',
      [SOURCE_SSA_REP_PAYEE_BENEFICIARY, SOURCE_SSA_REP_PAYEE, SOURCE_SSA_ADVANCE_DESIGNATION],
    ),
  },
  {
    id: 'art-care-guardianship-conservatorship-basics',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'guardianship-conservatorship-basics',
    title: 'Guardianship and Conservatorship Basics for Families | Kefiw',
    h1: 'Guardianship and Conservatorship Basics',
    description:
      'Learn what guardianship and conservatorship mean, when families may consider them, why they are serious legal steps, and what alternatives may exist.',
    metaDescription:
      'Learn what guardianship and conservatorship mean, when families may consider them, why they are serious legal steps, and what alternatives may exist.',
    keywords: ['guardianship conservatorship basics', 'elder guardianship guide', 'alternatives to guardianship'],
    intro:
      'Guardianship and conservatorship are serious legal steps that may limit a person\'s rights and independence.',
    outcomeLine:
      'Before pursuing guardianship, identify the exact decision that cannot be made and ask whether a less restrictive option can work.',
    faq: [
      faq('What is guardianship?', 'Terminology varies by state, but guardianship generally means a court gives someone authority to make personal, health, living, or other decisions for a person who cannot make them safely.'),
      faq('What is conservatorship?', 'In many states, a conservator manages money or property, though some states use guardianship and conservatorship terms differently.'),
      faq('Should guardianship be the first tool?', 'No. ACL highlights alternatives because guardianship can reduce self-determination. Families should explore less restrictive options with state-specific legal advice.'),
    ],
    primaryCta: { href: '/care/guides/adult-protective-services-guide/', label: 'Review APS Guide' },
    relatedLinks: [
      { href: '/care/guides/how-to-choose-elder-law-attorney/', label: 'Choose an Elder Law Attorney' },
      { href: '/care/guides/managing-someone-elses-money/', label: "Managing Someone Else's Money" },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

Guardianship or conservatorship may give someone court-authorized decision-making power.

Terminology varies by state, but generally:

- A guardian may make personal, health, or living decisions.
- A conservator may manage money or property.
- Some states use the terms differently.

Kefiw should always tell users to get state-specific legal advice.

The American Bar Association describes guardianships as giving one person power to make decisions for someone whom the court determines needs protection. ACL notes that guardianship can be limited or full and that any guardianship limits the person's self-determination and ability to make choices.

## When Families May Consider It

Families may consider guardianship or conservatorship when:

- A person lacks decision-making capacity.
- No valid POA or health care proxy exists.
- The person is unsafe and refuses needed help.
- Financial exploitation is happening.
- Bills, care, or medical decisions cannot be managed.
- A facility, hospital, or agency requires legal authority.
- Family members disagree and no decision-maker is clear.

## What Families Often Miss

Guardianship should not be the first tool if less restrictive options work.

Alternatives may include:

- Supported decision-making.
- Health care proxy.
- Financial POA.
- Representative payee.
- Trust.
- Convenience account.
- Case management.
- Family care agreement.
- Limited guardianship.

ACL specifically highlights alternatives to guardianship because guardianship can reduce self-determination.

## Kefiw Tip: Ask What Exact Decision Cannot Be Made

Before pursuing guardianship, write the problem clearly.

Weak:

"Mom cannot manage."

Better:

"Mom cannot understand or pay bills, has no financial POA, utilities are being shut off, and funds are at risk."

Or:

"Dad refuses urgent medical care because of dementia-related lack of insight, and no health care proxy is available."

Specific problems help an attorney identify the least restrictive solution.

## Questions To Ask An Attorney

- Is guardianship necessary?
- Is conservatorship necessary?
- Are less restrictive options available?
- Can authority be limited?
- What rights would the person lose?
- What reporting is required?
- Who can petition?
- How long does the process take?
- What does it cost?
- How can the person's preferences still be honored?

## Family Script

"We are not trying to take over. We are trying to understand what authority is needed, whether there is a less restrictive option, and how to protect dignity and safety."

## Red Flags

- Family wants guardianship because the person is making choices they dislike, not because capacity is impaired.
- Less restrictive options were not explored.
- The person's preferences are ignored.
- Guardianship is used to control family conflict.
- No attorney has reviewed state-specific rules.
- Financial exploitation is suspected but not reported.
- The proposed guardian has conflicts of interest.

## Checklist

- Identify the exact decision problem.
- Confirm whether POA or proxy exists.
- Explore less restrictive options.
- Document safety or financial risks.
- Consult elder law attorney.
- Consider limited authority where possible.
- Protect the person's dignity and preferences.
- Keep records if appointed.
- Reassess whether authority remains necessary.

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Adult Protective Services Guide](/care/guides/adult-protective-services-guide/)
- [Managing Someone Else's Money Guide](/care/guides/managing-someone-elses-money/)`,
      'elder law attorney, guardianship attorney, or disability rights-informed reviewer',
      [SOURCE_ACL_GUARDIANSHIP_ALTERNATIVES, SOURCE_ABA_GUARDIANSHIP, SOURCE_ABA_GUARDIAN_DECISIONS, SOURCE_CFPB_GUARDIAN_PROPERTY],
    ),
  },
  {
    id: 'art-care-how-to-choose-elder-law-attorney',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'how-to-choose-elder-law-attorney',
    title: 'How to Choose an Elder Law Attorney for Senior Care Planning | Kefiw',
    h1: 'How to Choose an Elder Law Attorney',
    description:
      'Learn when to consult an elder law attorney, what questions to ask, what documents to bring, and how families can prepare for Medicaid, POA, guardianship, and care contracts.',
    metaDescription:
      'Learn when to consult an elder law attorney, what questions to ask, what documents to bring, and how families can prepare for Medicaid, POA, guardianship, and care contracts.',
    keywords: ['choose elder law attorney', 'elder law attorney questions', 'senior care legal planning attorney'],
    intro:
      'An elder law attorney can help connect care needs, decision authority, payment planning, facility contracts, and family responsibilities.',
    outcomeLine:
      'Bring a one-page care snapshot so the legal advice is tied to the actual care situation.',
    faq: [
      faq('When should families call an elder law attorney?', 'Consider calling when Medicaid may become relevant, care costs are rising, a caregiver may be paid, POA is missing, guardianship may be needed, facility contracts are confusing, money is being managed, or exploitation is suspected.'),
      faq('What should families bring to an elder law consultation?', 'Bring existing legal documents, a care needs summary, care costs, income and asset overview, insurance policies, family decision-maker names, urgent risks, and top questions.'),
      faq('What questions should families ask the attorney?', 'Ask whether they focus on elder law, handle Medicaid planning, review facility contracts, draft caregiver agreements, handle guardianship, coordinate with care managers, and how fees work.'),
    ],
    primaryCta: { href: '/care/guides/medicaid-look-back-period/', label: 'Review Medicaid Look-Back Guide' },
    relatedLinks: [
      { href: '/care/guides/facility-contract-checklist/', label: 'Facility Contract Checklist' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/guardianship-conservatorship-basics/', label: 'Guardianship Basics' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

A family may need an elder law attorney when care decisions involve legal authority, long-term care payment, Medicaid, asset protection, facility contracts, family caregiver payment, guardianship, or unclear decision-making rights.

The National Academy of Elder Law Attorneys says it is dedicated to improving the quality of legal services provided to older adults and people with disabilities.

## When To Call An Elder Law Attorney

Consider calling when:

- Medicaid may become relevant.
- Long-term care costs are rising.
- A caregiver may be paid.
- Power of attorney is missing or outdated.
- A parent refuses care but may lack capacity.
- Guardianship may be needed.
- A facility contract is confusing.
- A family member is managing money.
- There are sibling disputes over care or funds.
- There may be financial exploitation.
- The family is considering asset transfers.

## What Families Often Miss

Families often call an attorney after the money, documents, or facility contract problem has already become urgent.

Earlier advice can prevent expensive mistakes.

For example:

- A poorly documented caregiver payment may create conflict.
- A casual asset transfer may affect Medicaid planning.
- A missing POA may force guardianship.
- A facility contract may include confusing responsible-party language.

## Kefiw Tip: Bring A One-Page Care Snapshot

Before the consultation, prepare:

- Parent's age and living situation.
- Diagnoses and care needs.
- Current care cost.
- Income sources.
- Assets overview.
- Insurance policies.
- Existing legal documents.
- Family decision-makers.
- Urgent risks.
- Top three questions.

This makes the appointment more productive.

## Questions To Ask The Attorney

- Do you focus on elder law?
- Do you handle Medicaid planning?
- Do you review facility contracts?
- Do you draft caregiver agreements?
- Do you handle guardianship?
- Do you coordinate with financial planners or care managers?
- What is your fee structure?
- What documents should we bring?
- What should we avoid doing before legal review?
- What state-specific issues should we know?

## Red Flags

- The attorney gives one-size-fits-all advice.
- Medicaid advice is vague.
- Fees are unclear.
- The attorney does not ask about care needs.
- The attorney focuses only on documents, not the care situation.
- The family is encouraged to transfer assets without understanding risks.
- The attorney does not explain tradeoffs.

## Family Script

"We need legal guidance that connects the documents, care needs, payment plan, and family responsibilities - not just a form."

## Checklist

- Identify legal issue.
- Gather current documents.
- Gather financial overview.
- Gather care cost estimates.
- List family decision-makers.
- Write top three questions.
- Ask about elder law experience.
- Ask about fees.
- Ask what not to do before planning.
- Save written next steps.

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Medicaid Look-Back Guide](/care/guides/medicaid-look-back-period/)
- [Facility Contract Checklist](/care/guides/facility-contract-checklist/)`,
      'elder law attorney',
      [SOURCE_NAELA, SOURCE_ACL_GUARDIANSHIP_ALTERNATIVES, SOURCE_FCA_PERSONAL_CARE, SOURCE_CFPB_MSEM],
    ),
  },
  {
    id: 'art-care-personal-care-agreement-family-caregiver',
    kind: 'guide',
    section: 'guides',
    guideCategory: FAMILY_CATEGORY,
    slug: 'personal-care-agreement-family-caregiver',
    title: 'Personal Care Agreement Guide for Paying a Family Caregiver | Kefiw',
    h1: 'Personal Care Agreement and Paying a Family Caregiver Guide',
    description:
      'Learn how personal care agreements can help families document paid caregiving, define duties, reduce conflict, and avoid tax or Medicaid mistakes.',
    metaDescription:
      'Learn how personal care agreements can help families document paid caregiving, define duties, reduce conflict, and avoid tax or Medicaid mistakes.',
    keywords: ['personal care agreement family caregiver', 'paying a family caregiver agreement', 'caregiver contract guide'],
    intro:
      'Paying a family caregiver can be fair, necessary, and practical. It can also create conflict, tax issues, Medicaid questions, and confusion if it is not documented clearly.',
    outcomeLine:
      'A personal care agreement should connect payment to future services, actual work, reasonable rates, clear records, and professional review when needed.',
    faq: [
      faq('What is a personal care agreement?', 'It is a written agreement between the person receiving care and the caregiver that defines services, schedule, pay, reimbursement, records, changes, and signatures.'),
      faq('Why does a written agreement matter?', 'It can reduce sibling conflict, document legitimate care payments, protect the caregiver and care recipient, and avoid treating payments as vague gifts.'),
      faq('What is the 2026 household employee threshold?', 'IRS Publication 926 says Social Security and Medicare taxes apply to cash wages of $3,000 or more paid to a household worker in 2026, with exceptions and details that require tax review.'),
    ],
    primaryCta: { href: '/care/caregiver-hours-calculator/', label: 'Calculate Caregiver Hours' },
    relatedLinks: [
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/medicaid-look-back-period/', label: 'Medicaid Look-Back Guide' },
      { href: '/care/guides/caregiver-reimbursement-expense-tracking/', label: 'Caregiver Reimbursement Guide' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

A personal care agreement is a written agreement between the person receiving care and the caregiver.

It should describe:

- Services provided.
- Schedule.
- Pay rate.
- Payment timing.
- Start date.
- Recordkeeping.
- Reimbursement.
- Changes or termination.
- Signatures.
- Professional review when needed.

Family Caregiver Alliance explains that a formal agreement among family members can provide a way to compensate a caregiver who makes significant sacrifices, such as giving up work or employment benefits, to provide care.

## Why It Matters

A written agreement can help:

- Reduce sibling conflict.
- Clarify expectations.
- Document legitimate care payments.
- Protect the caregiver's time.
- Protect the care recipient's funds.
- Support Medicaid, tax, or legal review.
- Avoid treating payments as vague gifts.

## Tax Warning

The IRS says family caregivers who are not employees must still report compensation as income on Form 1040 or 1040-SR and may need to pay self-employment tax depending on the facts and circumstances.

IRS Publication 926 also explains household employer tax rules and says Social Security and Medicare taxes apply to cash wages of $3,000 or more paid to a household worker in 2026.

Kefiw should not give tax classification advice. Ask a tax professional.

## What Families Often Miss

Families often start paying a caregiver informally because everyone agrees at the beginning.

Then the situation changes.

- A sibling questions the amount.
- Medicaid becomes relevant.
- The caregiver reduces work hours.
- The care recipient declines.
- The agreement was never written.
- Receipts and hours were not tracked.

## Kefiw Tip: Use Fair Market Plus Actual Work

A personal care agreement should not be a disguised gift.

It should connect payment to actual services, actual hours, and a reasonable local rate.

Document:

- Tasks.
- Dates.
- Hours.
- Rate.
- Payments.
- Receipts.
- Notes.

## Questions To Include In The Agreement

- Who is receiving care?
- Who is providing care?
- What tasks are included?
- What tasks are excluded?
- Where is care provided?
- What days and hours?
- What rate?
- How often is payment made?
- Are expenses reimbursed?
- How are records kept?
- Who can change the agreement?
- How does the agreement end?

## Family Script

"This agreement is not about making care cold or transactional. It is about protecting the caregiver, the care recipient, and the family from misunderstandings."

## Red Flags

- Caregiver is paid cash without records.
- No written duties.
- No hourly or service records.
- Payments are backdated.
- Rate is far above local care rates.
- Siblings are not informed.
- Medicaid may become relevant and no attorney has reviewed the arrangement.
- Tax reporting is ignored.

## Checklist

- Define care tasks.
- Set schedule.
- Set rate.
- Set payment method.
- Track hours.
- Save receipts.
- Include reimbursement rules.
- Review with elder law attorney.
- Review tax treatment with tax professional.
- Revisit when care needs change.

## Related Kefiw Tools

- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Medicaid Look-Back Guide](/care/guides/medicaid-look-back-period/)`,
      'elder law attorney, tax professional, or financial planner',
      [SOURCE_FCA_PERSONAL_CARE, SOURCE_IRS_FAMILY_CAREGIVERS, SOURCE_IRS_PUB_926],
    ),
  },
  {
    id: 'art-care-caregiver-reimbursement-expense-tracking',
    kind: 'guide',
    section: 'guides',
    guideCategory: FAMILY_CATEGORY,
    slug: 'caregiver-reimbursement-expense-tracking',
    title: 'Caregiver Reimbursement and Expense Tracking Guide | Kefiw',
    h1: 'Caregiver Reimbursement and Expense Tracking Guide',
    description:
      'Learn how family caregivers can track expenses, mileage, supplies, receipts, reimbursements, shared budgets, and family payment transparency.',
    metaDescription:
      'Learn how family caregivers can track expenses, mileage, supplies, receipts, reimbursements, shared budgets, and family payment transparency.',
    keywords: ['caregiver reimbursement tracking', 'caregiver expense tracker', 'family care receipts mileage'],
    intro:
      'Family caregivers often pay for small things that become large things.',
    outcomeLine:
      'Expense tracking is not petty. It shows the real cost of care and prevents one person from quietly subsidizing the whole plan.',
    faq: [
      faq('What should caregivers track for reimbursement?', 'Track who paid, what was purchased, why it was needed, whether it should be reimbursed, which fund should pay, whether it is recurring, and where the receipt lives.'),
      faq('What expense categories should families use?', 'Use categories such as medical, medication, supplies, transportation, meals, groceries, home safety, home care, facility costs, legal planning, insurance, emergency travel, caregiver support, and reimbursement status.'),
      faq('How often should family reimbursements happen?', 'Pick a rhythm, such as uploading receipts weekly and paying approved reimbursements monthly, so expenses do not become awkward one-off requests.'),
    ],
    primaryCta: { href: '/care/family-care-budget-calculator/', label: 'Build Family Care Budget' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/managing-someone-elses-money/', label: "Managing Someone Else's Money Guide" },
      { href: '/care/guides/personal-care-agreement-family-caregiver/', label: 'Personal Care Agreement Guide' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

Caregiver reimbursement tracking helps families see:

- Who paid.
- What was purchased.
- Why it was needed.
- Whether it should be reimbursed.
- Which fund should pay.
- Whether the cost is recurring.
- Whether the care budget needs updating.

## The Kefiw Expense Categories

Track expenses by category:

- Medical.
- Medication.
- Supplies.
- Transportation.
- Meals and groceries.
- Home safety.
- Home care.
- Facility costs.
- Legal or financial planning.
- Insurance.
- Emergency travel.
- Caregiver support.
- Reimbursed / not reimbursed.

## What Families Often Miss

Small expenses create emotional weight.

A caregiver may not resent one pharmacy run. They may resent being the only person paying for every pharmacy run for six months.

Tracking is not petty. It is clarity.

## Kefiw Tip: Use The Receipt Rhythm

Set one weekly rhythm:

- Upload receipts every Sunday.
- Label each expense.
- Mark reimbursable or family contribution.
- Pay reimbursements monthly.
- Review recurring costs.

This avoids awkward one-off requests.

## Reimbursement Rules To Set As A Family

Decide:

- Which expenses are reimbursable?
- Who approves expenses over a certain amount?
- Which account pays?
- How often reimbursements happen?
- What receipts are required?
- How mileage is handled?
- What happens if a sibling pays directly?
- What expenses are considered gifts?

## Family Script

"I am not trying to nickel-and-dime care. I am trying to make sure we can see the real cost and reimburse people fairly."

## Red Flags

- One person pays for everything.
- Receipts are not saved.
- Reimbursements are made from the parent's money without authority.
- Siblings disagree because no one sees the same records.
- Expenses are mixed with personal spending.
- Large expenses are paid without family discussion.
- Medicaid or tax issues may apply and no professional has reviewed the records.

## Checklist

- Create expense tracker.
- Save receipts.
- Separate personal and care expenses.
- Set reimbursement rules.
- Set spending approval threshold.
- Track mileage.
- Review monthly.
- Connect expenses to Family Care Budget.
- Ask a professional about tax, Medicaid, or legal questions.

## Related Kefiw Tools

- [Family Care Budget Calculator](/care/family-care-budget-calculator/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Managing Someone Else's Money Guide](/care/guides/managing-someone-elses-money/)`,
      'financial planner, tax professional, or elder law attorney',
      [SOURCE_CFPB_MSEM, SOURCE_FCA_PERSONAL_CARE, SOURCE_IRS_FAMILY_CAREGIVERS],
    ),
  },
  {
    id: 'art-care-document-storage-access-update-checklist',
    kind: 'guide',
    section: 'guides',
    guideCategory: LEGAL_CATEGORY,
    slug: 'document-storage-access-update-checklist',
    title: 'Document Storage Checklist for Family Caregivers | Kefiw',
    h1: 'Document Storage, Access, and Update Checklist',
    description:
      'Learn how to organize, store, share, and update caregiving documents, including medical records, legal papers, insurance cards, care plans, passwords, and emergency contacts.',
    metaDescription:
      'Learn how to organize, store, share, and update caregiving documents, including medical records, legal papers, insurance cards, care plans, passwords, and emergency contacts.',
    keywords: ['document storage checklist caregivers', 'caregiver document organizer', 'emergency binder documents'],
    intro:
      'A document is only useful if the right person can find it at the right time.',
    outcomeLine:
      'A good document system has emergency access, care access, and secure access layers.',
    faq: [
      faq('What are the three layers of a caregiver document system?', 'Emergency access includes immediate medical and contact information. Care access includes care plans and daily records. Secure access includes sensitive legal, financial, and password information.'),
      faq('Should every family member have every document?', 'No. The right people need the right access. Originals and sensitive documents should be secure, while emergency information should be easy to find.'),
      faq('When should caregiving documents be updated?', 'Update after new diagnoses, medication changes, hospitalization, falls, moves, new caregivers, insurance changes, legal documents, or changes in decision-maker.'),
    ],
    primaryCta: { href: '/care/guides/caregiver-emergency-binder/', label: 'Build Emergency Binder' },
    relatedLinks: [
      { href: '/care/guides/medication-management-family-caregivers/', label: 'Medication Management Guide' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/legal-documents-family-caregivers/', label: 'Legal Documents Guide' },
    ],
    longformMarkdown: withLegalPlanningFooter(
      `## Plain-English Summary

A good document system has three layers:

- Emergency access: what someone needs immediately.
- Care access: what caregivers need to manage daily care.
- Secure access: sensitive legal, financial, and password information.

NIA recommends getting important papers organized before a medical emergency and keeping documents in a safe, accessible place.

## Layer 1: Emergency Access

Keep easy access to:

- One-page emergency sheet.
- Medication list.
- Allergies.
- Diagnoses.
- Emergency contacts.
- Doctor and pharmacy list.
- Insurance cards.
- Preferred hospital.
- Health care proxy contact.
- Home access instructions.

## Layer 2: Care Access

Keep organized:

- Care plan.
- Appointment notes.
- Medication change log.
- Provider contacts.
- Home care agency contacts.
- Facility contacts.
- Caregiver schedule.
- Expense tracker.
- Transportation plan.
- Fall history.
- Care needs checklist.

## Layer 3: Secure Access

Store securely:

- Financial POA.
- Health care proxy.
- Advance directive.
- Will and trust location.
- Bank and insurance records.
- Property records.
- Tax documents.
- Password instructions.
- Long-term care insurance policy.
- Medicaid or VA benefit records.

## Kefiw Tip: Make A Where The Original Is Page

Do not put every original in a binder.

Instead, create a page that says:

- Original will: attorney office / safe.
- Original POA: safe / file cabinet.
- Advance directive: hospital portal and home binder.
- Insurance policy: digital folder.
- Password document: secure manager.
- Deed: safe deposit box / county record.

This prevents lost originals and unsafe over-sharing.

## Update Triggers

Update the document system after:

- New diagnosis.
- Medication change.
- Hospitalization.
- Fall.
- Move.
- New caregiver.
- Insurance change.
- Medicare plan change.
- Death of spouse.
- Divorce.
- Remarriage.
- New bank or account.
- New legal document.
- Change in decision-maker.

## What Families Often Miss

Digital access matters too.

A caregiver may have the paper copy but not the portal login, pharmacy app, insurance portal, Medicare account, facility family portal, or password manager instructions.

Kefiw should encourage secure, lawful access rather than shared passwords where inappropriate.

## Family Script

"We do not need everyone to have every private document. But the right people need the right access before an emergency."

## Red Flags

- Documents are in one person's house and no one else knows where.
- Originals are missing.
- Copies are outdated.
- Passwords are stored unsafely.
- Caregivers lack emergency medication information.
- Legal documents are not shared with the people named in them.
- Hospital or facility admissions happen without insurance and authority documents.

## Checklist

- Create emergency sheet.
- Create medication list.
- Create provider list.
- Create document location page.
- Store originals securely.
- Give copies to appropriate people.
- Add health care proxy and advance directive to medical records.
- Organize insurance and benefit records.
- Protect passwords securely.
- Review every six months.
- Update after major changes.

## Related Kefiw Tools

- [Caregiver Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Medication Management Guide](/care/guides/medication-management-family-caregivers/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'elder law attorney, clinician, or privacy/security professional',
      [SOURCE_NIA_AFFAIRS, SOURCE_NIA_ADVANCE_CARE, SOURCE_HHS_HIPAA_FAMILY],
    ),
  },
];

import type { ContentPageConfig } from '../content-pages';

const SOURCE_ELDERCARE_LOCATOR =
  '[Eldercare Locator: Find help in your community](https://eldercare.acl.gov/)';
const SOURCE_ACL_LOCAL_SERVICES =
  '[ACL: Finding local services](https://acl.gov/ltc/basic-needs/finding-local-services)';
const SOURCE_ACL_ADRC =
  '[ACL: Aging and Disability Resource Centers](https://acl.gov/programs/aging-and-disability-networks/aging-and-disability-resource-centers)';
const SOURCE_ACL_OMBUDSMAN =
  '[ACL: Long-Term Care Ombudsman Program](https://acl.gov/programs/Protecting-Rights-and-Preventing-Abuse/Long-term-Care-Ombudsman-Program)';
const SOURCE_ACL_OMBUDSMAN_FAQ =
  '[ACL: Long-Term Care Ombudsman FAQ](https://acl.gov/programs/long-term-care-ombudsman/long-term-care-ombudsman-faq)';
const SOURCE_CMS_RESIDENT_RIGHTS =
  "[CMS: Nursing Home Residents' Rights and Quality of Care](https://www.cms.gov/about-cms/what-we-do/nursing-homes/patients-caregivers/rights-quality-care)";
const SOURCE_CMS_RIGHTS_PDF =
  "[CMS: Your Rights and Protections as a Nursing Home Resident](https://downloads.cms.gov/medicare/Your_Resident_Rights_and_Protections_section.pdf)";
const SOURCE_CONSUMER_VOICE_RIGHTS =
  "[Consumer Voice: Nursing Home Residents' Rights](https://theconsumervoice.org/wp-content/uploads/2025/08/CV_ResRightsFactSheet.pdf)";
const SOURCE_MEDICARE_COMPLAINTS =
  '[Medicare: Filing a complaint](https://www.medicare.gov/providers-services/claims-appeals-complaints/complaints)';
const SOURCE_CMS_BFCC_QIO =
  '[CMS: Beneficiary and Family Centered Care QIOs](https://www.cms.gov/medicare/quality/quality-improvement-organizations/family-centered-care)';
const SOURCE_ACL_APS =
  '[ACL: Supporting Adult Protective Services](https://acl.gov/programs/elder-justice/supporting-adult-protective-services)';
const SOURCE_ACL_SUSPECT_ABUSE =
  '[ACL: What if I suspect abuse, neglect, or exploitation?](https://acl.gov/programs/protection-and-advocacy-systems/what-if-i-suspect-abuse-neglect-or-exploitation)';
const SOURCE_ACL_APS_RULE =
  '[ACL: Federal regulations for APS programs](https://acl.gov/APSrule)';
const SOURCE_NCEA_IDENTIFY_ABUSE =
  '[National Center on Elder Abuse: Identify abuse](https://ncea.usc.edu/identify-abuse/)';
const SOURCE_DOJ_ELDER_ABUSE_FLAGS =
  '[U.S. Department of Justice: Red flags of elder abuse](https://www.justice.gov/elderjustice/red-flags-elder-abuse)';
const SOURCE_READY_OLDER_ADULTS =
  '[Ready.gov: Older adults emergency preparedness](https://www.ready.gov/older-adults)';
const SOURCE_REDCROSS_OLDER_ADULTS =
  '[American Red Cross: Emergency preparedness for older adults](https://www.redcross.org/get-help/how-to-prepare-for-emergencies/older-adults.html)';

const sharedLocalRightsDisclaimer = `## Kefiw Local Resources And Rights Disclaimer

Kefiw provides educational care-planning tools and guides. This content does not provide medical, legal, financial, insurance, tax, employment, or emergency advice. Rights, reporting rules, complaint processes, facility regulations, APS procedures, and available services vary by state, provider, plan, and situation. If someone may be in immediate danger or experiencing a medical emergency, call emergency services immediately.

## Continue Planning With Kefiw

- [Run the Care Needs Checklist](/care/care-needs-checklist/)
- [Use the Care Urgency Check](/health/medical-triage/)
- [Build a family care budget](/care/family-care-budget-calculator/)
- [Create a caregiver emergency binder](/care/guides/caregiver-emergency-binder/)
- [Review facility contract questions](/care/guides/facility-contract-checklist/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withLocalRightsFooter(body: string, reviewer: string, sources: string[]): string {
  return `${body}

## State-Aware Module To Add Later

When location is available, Kefiw should show state and local links for the Area Agency on Aging, SHIP, Long-Term Care Ombudsman, APS reporting, state survey agency, Medicaid office, insurance department, legal aid, and caregiver respite resources.

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedLocalRightsDisclaimer}`;
}

export const CARE_LOCAL_RESOURCES_RIGHTS_NEW_GUIDES: ContentPageConfig[] = [
  {
    id: 'art-care-build-local-care-team',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Local Resources & Rights',
    slug: 'build-local-care-team',
    title: 'How to Build a Local Care Team for an Aging Parent | Kefiw',
    h1: 'How to Build a Local Care Team',
    description:
      'Learn how to build a practical local care team with family, neighbors, doctors, home care, pharmacy, aging services, and emergency contacts.',
    metaDescription:
      'Learn how to build a practical local care team with family, neighbors, doctors, home care, pharmacy, aging services, and emergency contacts.',
    keywords: ['build local care team', 'aging parent care team', 'senior care local contacts'],
    intro:
      'A care plan should not depend on one heroic person. A strong plan names the people and organizations who know their role before something goes wrong.',
    outcomeLine:
      'A local care team works when every important role has an owner, a backup, and a written contact path.',
    faq: [
      {
        q: 'Who should be on a local care team?',
        a: 'Start with the older adult, primary caregiver, backup caregiver, local contact, doctor, pharmacist, home care or facility contact, and local aging resource contacts such as the Area Agency on Aging, ombudsman, or APS when relevant.',
        faq_intent: 'definition',
      },
      {
        q: 'Does every helper need to provide hands-on care?',
        a: 'No. A local care team can include people who own transportation, medical notes, family updates, paperwork, emergency access, or local resource calls.',
        faq_intent: 'how-to',
      },
      {
        q: 'How often should a care team list be reviewed?',
        a: 'Review it at least every three months and after falls, hospitalizations, home care changes, facility moves, or caregiver burnout.',
        faq_intent: 'how-to',
      },
    ],
    primaryCta: { href: '/care/guides/caregiver-emergency-binder/', label: 'Build Emergency Binder' },
    relatedLinks: [
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/find-local-senior-care-resources/', label: 'Find Local Resources' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

A local care team is the group of people and services that help an older adult stay safe, supported, and connected.

It may include:

- The older adult.
- Primary caregiver.
- Backup caregiver.
- Local family.
- Long-distance family.
- Neighbor.
- Primary care doctor.
- Pharmacist.
- Home care agency.
- Facility contact.
- Area Agency on Aging.
- Ombudsman.
- APS or emergency contacts when needed.

## The Kefiw Care Team Roles Model

Do not start by asking, "Who can help?"

Start by asking, "What roles must be covered?"

Role 1: Daily support owner

Handles meals, hygiene, errands, transportation, or check-ins.

Role 2: Medical coordination owner

Tracks appointments, medication list, doctor messages, and follow-up.

Role 3: Money and paperwork owner

Tracks bills, insurance, receipts, benefits, and legal documents.

Role 4: Emergency responder

Knows who to call, where documents are, and how to enter the home.

Role 5: Backup caregiver

Steps in when the primary caregiver is sick, away, or overloaded.

Role 6: Local resource connector

Knows local programs, transportation, meals, respite, and ombudsman contacts.

## What Families Often Miss

Families often list helpers but do not assign roles.

A neighbor who says "call me anytime" is kind, but not a care plan.

A stronger version is:

"Could you be the person we call if Mom does not answer her phone and someone needs to check the porch or knock on the door?"

Specific roles prevent confusion.

## Kefiw Tip: Create A First 3 Calls List

For each common problem, decide the first three calls.

- Fall without obvious emergency signs: caregiver, doctor or nurse line, family backup.
- Possible emergency: 911, primary caregiver, hospital contact.
- Missed home care shift: agency supervisor, backup caregiver, family coordinator.
- Facility concern: nurse or unit manager, administrator, ombudsman if unresolved.
- Possible abuse or exploitation: emergency services if immediate danger, APS, trusted decision-maker.

Ready.gov recommends that older adults assess needs, create a plan, and engage a support network. The American Red Cross also encourages older adults to build a personal support network for emergency check-ins and assistance.

## Family Script

"We do not need everyone to do everything. We need each person to own one role so the care plan does not collapse when one person is unavailable."

## Red Flags

- Only one person knows the medication list.
- Only one person has keys or access.
- Only one person receives facility calls.
- No one local can check the home.
- Family members are listed as helpers but have no assigned tasks.
- The backup plan is "call me if you need anything."
- The emergency plan lives in someone's memory, not in writing.

## Checklist

- Name the primary caregiver.
- Name the backup caregiver.
- Name the medical coordinator.
- Name the paperwork coordinator.
- Name the local emergency contact.
- Add neighbor or nearby helper if appropriate.
- Save doctor, pharmacy, home care, facility, and hospital contacts.
- Save Eldercare Locator and local aging agency information.
- Save ombudsman and APS information.
- Review the team list every three months.

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Caregiver Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Plan Senior Care Track](/tracks/plan-senior-care/)`,
      'geriatric care manager or caregiver support specialist',
      [SOURCE_ELDERCARE_LOCATOR, SOURCE_READY_OLDER_ADULTS, SOURCE_REDCROSS_OLDER_ADULTS],
    ),
  },
  {
    id: 'art-care-adult-protective-services-guide',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Local Resources & Rights',
    slug: 'adult-protective-services-guide',
    title: 'Adult Protective Services Guide: When to Call APS | Kefiw',
    h1: 'Adult Protective Services Guide',
    description:
      'Learn when families may need to contact Adult Protective Services for suspected elder abuse, neglect, self-neglect, or financial exploitation.',
    metaDescription:
      'Learn when families may need to contact Adult Protective Services for suspected elder abuse, neglect, self-neglect, or financial exploitation.',
    keywords: ['Adult Protective Services guide', 'when to call APS', 'elder abuse APS reporting'],
    intro:
      'Adult Protective Services is one of the most important resources families should know about before something goes wrong.',
    outcomeLine:
      'APS is generally for suspected abuse, neglect, self-neglect, or financial exploitation; immediate danger still goes to emergency services first.',
    faq: [
      {
        q: 'Is APS the same as the ombudsman?',
        a: 'No. APS generally responds to abuse, neglect, self-neglect, or exploitation concerns involving vulnerable adults. Ombudsman programs focus on residents of long-term care facilities and resident rights.',
        faq_intent: 'comparison',
      },
      {
        q: 'Do families need proof before calling APS?',
        a: 'Families usually report suspected facts and patterns, not courtroom proof. APS decides how to screen or assess the report under state procedures.',
        faq_intent: 'trust',
      },
      {
        q: 'What if someone is in immediate danger?',
        a: 'Call emergency services first if there is immediate danger, violence, urgent medical risk, or a situation that cannot safely wait.',
        faq_intent: 'safety',
      },
    ],
    primaryCta: { href: '/health/medical-triage/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/emergency-contact-plan-aging-parent/', label: 'Emergency Contact Plan' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/elder-abuse-neglect-financial-exploitation-warning-signs/', label: 'Elder Abuse Warning Signs' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

Adult Protective Services, often called APS, is not the same as an ombudsman, a doctor, or the police. APS generally responds to reports involving abuse, neglect, self-neglect, or financial exploitation of older adults or adults with disabilities.

ACL describes APS as a state and local social services program for older adults and adults with disabilities who need assistance because of abuse, neglect, self-neglect, or financial exploitation. APS receives and responds to adult maltreatment reports and works with clients and other professionals to maximize safety and independence.

Call APS when you suspect:

- Abuse.
- Neglect.
- Self-neglect.
- Financial exploitation.
- Unsafe living conditions.
- A vulnerable adult cannot meet basic needs.
- A caregiver may be harming, exploiting, or neglecting someone.
- The person is at risk and family cannot resolve it safely.

Call emergency services first if there is immediate danger.

## What APS May Respond To

Examples:

- An older adult is not receiving food, medication, hygiene, or basic care.
- A caregiver is threatening, hitting, isolating, or exploiting the person.
- Someone is taking money, property, or benefits.
- The person is living in unsafe conditions and cannot protect themselves.
- A person with cognitive impairment is at serious risk and refuses needed help.
- There is suspected abandonment.

## What Families Often Miss

APS is not only for obvious abuse.

Self-neglect can also matter. A person may be unsafe because they cannot meet their own basic needs, even if no one else is harming them.

Families should not wait until they have proof beyond doubt. APS is designed to receive reports and assess concerns.

## Kefiw Tip: Report Facts, Not Conclusions

Instead of saying:

"My uncle is being exploited."

Say:

"My uncle has dementia, $12,000 was withdrawn from his account in two weeks, a new person has access to his debit card, and he cannot explain the transactions."

Instead of saying:

"She is neglected."

Say:

"She has no food in the refrigerator, has missed medication for five days, has untreated wounds, and her caregiver has not been reachable."

Facts help APS triage.

## Reporting Access Note

ACL's final APS rule requires APS programs to provide at least two ways for reports of adult maltreatment and self-neglect to be made 24 hours per day, seven days per week, with at least one online method.

## Family Script

"I am not asking APS to decide based on my opinion. I am reporting specific facts that suggest abuse, neglect, self-neglect, or exploitation may be happening."

## Red Flags

- The older adult is isolated from family or friends.
- A caregiver blocks access.
- Money disappears.
- Bills go unpaid despite available funds.
- The person is dirty, hungry, injured, or without medication.
- A caregiver threatens the person.
- The person is afraid to speak in front of someone.
- Unsafe living conditions are worsening.
- The family argues about whether it is "bad enough" to report.

## Checklist

- Call emergency services if immediate danger exists.
- Identify the state APS reporting route.
- Write down facts.
- Include dates, names, injuries, missing funds, unsafe conditions, and witnesses.
- Report suspected abuse, neglect, self-neglect, or exploitation.
- Save the report confirmation if available.
- Continue documenting.
- Contact the ombudsman too if the person lives in a long-term care facility.
- Contact legal, medical, or law enforcement support when appropriate.

## Related Kefiw Tools

- [Care Urgency Check](/health/medical-triage/)
- [Care Needs Checklist](/care/care-needs-checklist/)
- [Emergency Contact Plan](/care/guides/emergency-contact-plan-aging-parent/)`,
      'APS professional, elder law attorney, or clinician for injury and safety language',
      [SOURCE_ACL_APS, SOURCE_ACL_SUSPECT_ABUSE, SOURCE_ACL_APS_RULE],
    ),
  },
  {
    id: 'art-care-elder-abuse-warning-signs',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Local Resources & Rights',
    slug: 'elder-abuse-neglect-financial-exploitation-warning-signs',
    title: 'Elder Abuse, Neglect, and Financial Exploitation Warning Signs | Kefiw',
    h1: 'Elder Abuse, Neglect, and Financial Exploitation Warning Signs',
    description:
      'Learn warning signs of elder abuse, neglect, self-neglect, and financial exploitation, and what families can do next.',
    metaDescription:
      'Learn warning signs of elder abuse, neglect, self-neglect, and financial exploitation, and what families can do next.',
    keywords: ['elder abuse warning signs', 'financial exploitation older adult', 'elder neglect signs'],
    intro:
      'Elder abuse is not always obvious. It may look like fear, isolation, unpaid bills, unexplained bruises, missing medication, or sudden bank changes.',
    outcomeLine:
      'Warning signs should trigger safety checks, documentation, and the right reporting path, especially when several signs appear together.',
    faq: [
      {
        q: 'What should families do if there is immediate danger?',
        a: 'Call emergency services immediately. Do not wait for a family meeting, facility response, or routine complaint process when someone may be in immediate danger.',
        faq_intent: 'safety',
      },
      {
        q: 'Who handles suspected elder abuse or exploitation?',
        a: 'In the U.S., suspected abuse, neglect, self-neglect, or financial exploitation is generally reported to APS or the appropriate state or local reporting agency. Facility resident concerns may also involve an ombudsman or state survey agency.',
        faq_intent: 'how-to',
      },
      {
        q: 'Should families confront a suspected abuser?',
        a: 'Not if confrontation could increase risk. Focus on safety, documentation, and the appropriate reporting channel.',
        faq_intent: 'safety',
      },
    ],
    primaryCta: { href: '/health/medical-triage/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/adult-protective-services-guide/', label: 'APS Guide' },
      { href: '/care/guides/emergency-contact-plan-aging-parent/', label: 'Emergency Contact Plan' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

Elder abuse and neglect warning signs should be taken seriously, especially when several signs appear together or the older adult is isolated, dependent, cognitively impaired, or afraid.

If there is immediate danger, call emergency services.

If abuse, neglect, self-neglect, or financial exploitation is suspected, contact APS or the appropriate state or local reporting agency.

The National Center on Elder Abuse provides abuse-identification resources, and the U.S. Department of Justice lists red flags families can watch for.

## Physical Abuse Warning Signs

Watch for:

- Unexplained bruises, cuts, burns, or injuries.
- Repeated injuries.
- Fear around a caregiver.
- Delay in getting medical care.
- Conflicting explanations.
- Injuries inconsistent with the story.
- Restraint marks.

## Neglect Warning Signs

Watch for:

- Poor hygiene.
- Untreated wounds.
- Missed medications.
- Dehydration.
- Malnutrition.
- Unsafe living conditions.
- Dirty clothing or bedding.
- Lack of needed glasses, hearing aids, walker, dentures, or medical supplies.
- Caregiver unavailable or dismissive.

## Self-Neglect Warning Signs

Watch for:

- Spoiled food.
- No food.
- Hoarding or unsafe clutter.
- Utilities shut off.
- Missed medications.
- Poor hygiene.
- Unsafe driving.
- Inability to manage money.
- Unsafe cooking.
- Repeated falls without follow-up.

## Emotional Abuse Warning Signs

Watch for:

- Fear.
- Withdrawal.
- Sudden depression or anxiety.
- Caregiver intimidation.
- Humiliation.
- Isolation from family.
- Threats.
- Unusual silence around one person.

## Financial Exploitation Warning Signs

Watch for:

- Missing money.
- Sudden account changes.
- New "friends" with access to money.
- Unpaid bills despite funds.
- Unusual withdrawals.
- Changes to wills, deeds, beneficiaries, or powers of attorney.
- Missing valuables.
- Pressure to sign documents.
- Someone using the older adult's card, home, or benefits.

## Kefiw Tip: Look For The Pattern, Not One Clue

One bruise may have an innocent explanation.

A bruise plus fear plus isolation plus delayed care plus a controlling caregiver is different.

Use the pattern test:

"Is this a single concern, or a pattern that affects safety, dignity, care, or money?"

## Family Script

"I am worried because we are seeing a pattern: [specific facts]. We need to check safety, document what is happening, and contact the right resource."

## Red Flags

- Someone prevents private conversation with the older adult.
- The older adult seems afraid of a caregiver.
- The caregiver controls money and refuses transparency.
- Injuries are unexplained.
- Basic needs are not being met.
- The older adult is isolated.
- The family is told to stay away.
- The older adult's story changes when another person enters the room.

## Checklist

- Check immediate safety.
- Speak privately with the older adult if safe.
- Document facts and dates.
- Take photos only when appropriate, safe, and allowed.
- Save financial records or notices.
- Contact APS for suspected abuse, neglect, self-neglect, or exploitation.
- Contact the ombudsman if the person lives in long-term care.
- Contact emergency services if danger is immediate.
- Avoid confronting a suspected abuser if it could increase risk.

## Related Kefiw Tools

- [Care Urgency Check](/health/medical-triage/)
- [Emergency Contact Plan](/care/guides/emergency-contact-plan-aging-parent/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'APS professional, elder law attorney, or clinician',
      [SOURCE_NCEA_IDENTIFY_ABUSE, SOURCE_DOJ_ELDER_ABUSE_FLAGS, SOURCE_ACL_SUSPECT_ABUSE],
    ),
  },
  {
    id: 'art-care-facility-complaint-log',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Local Resources & Rights',
    slug: 'care-facility-complaint-log',
    title: 'Care Facility Complaint Log: How to Document Concerns Clearly | Kefiw',
    h1: 'Care Facility Complaint Log and Documentation Guide',
    description:
      'Learn how to document concerns about a nursing home, assisted living, memory care, or home care provider with dates, facts, photos, contacts, and follow-up.',
    metaDescription:
      'Learn how to document concerns about a nursing home, assisted living, memory care, or home care provider with dates, facts, photos, contacts, and follow-up.',
    keywords: ['care facility complaint log', 'nursing home complaint documentation', 'assisted living complaint log'],
    intro:
      'When something feels wrong in a care facility, the most effective complaint is usually calm, specific, dated, and tied to what needs to change.',
    outcomeLine:
      'A complaint log turns a vague concern into a factual pattern, a clear request, and a trackable follow-up plan.',
    faq: [
      {
        q: 'What should a complaint log include?',
        a: 'Include date, time, location, what happened, resident impact, people involved, evidence, who was notified, the response, follow-up date, and status.',
        faq_intent: 'how-to',
      },
      {
        q: 'When should a complaint be escalated?',
        a: 'Escalate when a concern repeats, the facility does not respond, safety is at risk, a resident fears retaliation, discharge is threatened, or abuse, neglect, or exploitation is suspected.',
        faq_intent: 'how-to',
      },
      {
        q: 'Can families use photos?',
        a: 'Photos may help when appropriate, safe, and allowed. Families should respect privacy, facility rules, and legal limits.',
        faq_intent: 'edge-case',
      },
    ],
    primaryCta: { href: '/care/guides/nursing-home-red-flags/', label: 'Review Nursing Home Red Flags' },
    relatedLinks: [
      { href: '/care/guides/assisted-living-red-flags/', label: 'Assisted Living Red Flags' },
      { href: '/care/guides/report-care-facility-concerns/', label: 'Report Facility Concerns' },
      { href: '/care/guides/long-term-care-ombudsman/', label: 'Long-Term Care Ombudsman Guide' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

A complaint log is a simple record of care concerns, responses, and follow-up.

It should capture:

- What happened.
- When it happened.
- Who was involved.
- Who was notified.
- What response was given.
- What outcome is needed.
- Whether the issue was resolved.

## The Kefiw Complaint Log Format

Use this structure:

| Field | What to write |
| --- | --- |
| Date/time | When the issue happened |
| Location | Room, dining area, bathroom, hallway, unit |
| Concern | What happened, in plain facts |
| Resident impact | Injury, missed care, distress, risk, cost |
| People involved | Staff names, witnesses, family |
| Evidence | Photos, notes, invoices, messages |
| Reported to | Nurse, manager, administrator, agency |
| Response | What they said or did |
| Follow-up date | When they promised response |
| Status | Open, improved, unresolved, escalated |

## Kefiw Tip: Separate Facts, Feelings, And Requests

Facts:

"Dad waited 42 minutes after pressing the call button on April 12 at 8:10 p.m."

Feelings:

"We are worried and frustrated."

Request:

"Please explain the response-time process and what will change to prevent this."

All three matter, but facts and requests drive action.

## What Families Often Miss

A single complaint may be dismissed as a misunderstanding.

A documented pattern is harder to ignore.

Patterns might include:

- Repeated medication delays.
- Repeated unanswered call lights.
- Repeated hygiene concerns.
- Repeated unexplained billing.
- Repeated falls.
- Repeated meal problems.
- Repeated family communication failures.

## When To Escalate

Escalate when:

- The same concern repeats.
- The facility does not respond.
- The resident is afraid.
- Safety is at risk.
- A discharge threat is made.
- Abuse, neglect, or exploitation is suspected.
- The family receives only verbal promises.
- The care plan is not updated.

For nursing home complaints, Medicare says people can file with the state survey agency and can call 1-800-MEDICARE to get state survey agency contact information.

## Family Script

"We are documenting this so we can be accurate, not adversarial. Here are the dates, what happened, who was notified, and what we are asking to be changed."

## Red Flags

- Staff refuse to document concerns.
- The issue repeats after verbal promises.
- You are told not to write things down.
- The resident fears retaliation.
- The facility changes the story.
- The family cannot get names, dates, or written follow-up.
- The complaint is serious but treated casually.

## Checklist

- Record facts immediately.
- Use dates and times.
- Avoid exaggeration.
- Save messages and invoices.
- Take photos only when appropriate.
- Ask for written follow-up.
- Track unresolved items.
- Escalate to ombudsman, state survey agency, APS, or emergency services when appropriate.
- Keep copies in the care binder.

## Related Kefiw Tools

- [Facility Contract Checklist](/care/guides/facility-contract-checklist/)
- [Nursing Home Red Flags](/care/guides/nursing-home-red-flags/)
- [Assisted Living Red Flags](/care/guides/assisted-living-red-flags/)`,
      'ombudsman-informed reviewer or elder law attorney',
      [SOURCE_MEDICARE_COMPLAINTS, SOURCE_ACL_OMBUDSMAN, SOURCE_CMS_RESIDENT_RIGHTS],
    ),
  },
  {
    id: 'art-care-emergency-planning-living-alone',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Local Resources & Rights',
    slug: 'emergency-planning-older-adult-living-alone',
    title: 'Emergency Planning for an Older Adult Living Alone | Kefiw',
    h1: 'Emergency Planning for an Older Adult Living Alone',
    description:
      'Build an emergency plan for an older adult living alone, including check-ins, falls, medications, home access, power outages, transportation, and local backup.',
    metaDescription:
      'Build an emergency plan for an older adult living alone, including check-ins, falls, medications, home access, power outages, transportation, and local backup.',
    keywords: ['older adult living alone emergency plan', 'senior living alone safety plan', 'no answer rule aging parent'],
    intro:
      'Living alone can be safe for some older adults, but safety depends on the person, the home, the health risks, and the backup plan.',
    outcomeLine:
      'Living alone needs a practical backup plan for falls, no-answer situations, medication issues, power outages, and sudden health changes.',
    faq: [
      {
        q: 'What is a no-answer rule?',
        a: 'A no-answer rule is a written sequence for what to do when an older adult does not respond at the expected time, including when to call again, who checks locally, and when to request emergency help.',
        faq_intent: 'definition',
      },
      {
        q: 'What should be planned for 72 hours?',
        a: 'Plan medication, food, water, heat or cooling, charged phone, flashlight, mobility device, emergency contacts, and backup help.',
        faq_intent: 'how-to',
      },
      {
        q: 'When should living alone be reassessed?',
        a: 'Reassess after any fall, hospitalization, sudden confusion, wandering, missed medication pattern, unsafe cooking, or caregiver sleep loss from worry.',
        faq_intent: 'how-to',
      },
    ],
    primaryCta: { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Use Home Safety Checklist' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/health/medical-triage/', label: 'Care Urgency Check' },
      { href: '/care/guides/emergency-contact-plan-aging-parent/', label: 'Emergency Contact Plan' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

The question is not only:

"Can they live alone?"

The better question is:

"What would happen if something went wrong at 2 a.m., during bad weather, after a fall, or when the primary caregiver is unavailable?"

An emergency plan for an older adult living alone should cover:

- Falls.
- Medication issues.
- No-answer situations.
- Power outages.
- Wandering risk.
- Severe weather.
- Missed meals.
- Transportation failure.
- Sudden confusion.
- Home care callouts.
- Hospital transfers.

## The Kefiw Living-Alone Safety Test

### 1. Can They Call For Help?

Check:

- Phone within reach.
- Emergency button.
- Wearable alert.
- Voice assistant.
- Neighbor check-in.
- Backup plan if phone dies.

### 2. Can Someone Get In?

Check:

- Key safe.
- Trusted neighbor.
- Family key.
- Door code.
- Fire department access policy if relevant.

### 3. Can They Manage Essentials For 72 Hours?

Check:

- Medication.
- Food.
- Water.
- Heat or cooling.
- Charged phone.
- Flashlight.
- Mobility device.
- Emergency contacts.

Ready.gov advises older adults to assess needs, create a plan, and engage a support network. It also recommends that at least one person in the support network have an extra key, know where emergency supplies are, and know how to use lifesaving equipment or administer medicine if needed.

### 4. Can Risks Be Detected?

Check:

- Daily check-in.
- Missed-call rule.
- Medication system.
- Fall alert.
- Door sensor if wandering risk exists.
- Utility alerts.
- Bank alerts if exploitation is a concern.

### 5. Can Family Respond Without Panic?

Decide:

- Who checks first.
- Who calls emergency services.
- Who contacts the doctor.
- Who updates family.
- Who stays overnight if needed.

## Kefiw Tip: Create A No-Answer Rule

A no-answer rule prevents hours of uncertainty.

Example:

"If Mom does not answer by 10 a.m., call again in 15 minutes. If no answer, call the neighbor. If the neighbor cannot confirm safety within 30 minutes, call the local non-emergency line or emergency services depending on concern level."

Make the rule specific.

## Living-Alone Red Flags

- Repeated falls.
- Wandering or getting lost.
- Unsafe cooking.
- Missed medications.
- Spoiled food.
- Unpaid bills.
- No local backup.
- No way to call for help.
- Caregiver cannot sleep because they worry every night.
- The person cannot explain what they would do in an emergency.

## Family Script

"We are not saying you cannot live alone. We are saying that living alone needs a backup plan. Let us make sure help can reach you if something happens."

## Checklist

- Create daily check-in rhythm.
- Add no-answer rule.
- Add home access plan.
- Add emergency contact sheet.
- Add medication list.
- Add fall response plan.
- Add severe weather plan.
- Add backup transportation.
- Add local helper.
- Reassess after any fall, hospitalization, confusion, or missed medication pattern.

## Related Kefiw Tools

- [Home Safety Checklist](/care/guides/home-safety-checklist-older-adults/)
- [Care Needs Checklist](/care/care-needs-checklist/)
- [Care Urgency Check](/health/medical-triage/)`,
      'geriatric care manager, occupational therapist, or clinician',
      [SOURCE_READY_OLDER_ADULTS, SOURCE_REDCROSS_OLDER_ADULTS, SOURCE_ELDERCARE_LOCATOR],
    ),
  },
  {
    id: 'art-care-escalate-concern-without-burning-bridges',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Local Resources & Rights',
    slug: 'escalate-care-concern-without-burning-bridges',
    title: 'How to Escalate a Care Concern Without Burning Bridges | Kefiw',
    h1: 'How to Escalate a Care Concern Without Burning Bridges',
    description:
      'Learn how to raise care concerns clearly, document issues, request action, and escalate to the right person without starting unnecessary conflict.',
    metaDescription:
      'Learn how to raise care concerns clearly, document issues, request action, and escalate to the right person without starting unnecessary conflict.',
    keywords: ['escalate care concern', 'raise care facility concern', 'care complaint script'],
    intro:
      'Families often wait too long to raise concerns because they do not want to seem difficult. A better approach is early, specific, documented, and calm.',
    outcomeLine:
      'Escalation means moving the concern to the right person with the right facts and a clear request.',
    faq: [
      {
        q: 'What is the best first escalation step?',
        a: 'Start with the closest responsible person when it is safe: caregiver supervisor, nurse, unit manager, billing office, care plan coordinator, or administrator depending on the issue.',
        faq_intent: 'how-to',
      },
      {
        q: 'When should a concern leave the facility level?',
        a: 'Escalate outside the facility when the problem repeats, safety is at risk, documentation is refused, the resident fears retaliation, or the issue involves rights, abuse, neglect, exploitation, or unsafe discharge.',
        faq_intent: 'how-to',
      },
      {
        q: 'What is the simplest script?',
        a: 'Use observation, impact, request, and deadline: say what happened, why it matters, what you need changed, and when you expect follow-up.',
        faq_intent: 'how-to',
      },
    ],
    primaryCta: { href: '/care/guides/care-facility-complaint-log/', label: 'Use Complaint Log' },
    relatedLinks: [
      { href: '/care/guides/long-term-care-ombudsman/', label: 'Ombudsman Guide' },
      { href: '/care/guides/nursing-home-red-flags/', label: 'Nursing Home Red Flags' },
      { href: '/care/guides/assisted-living-red-flags/', label: 'Assisted Living Red Flags' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

Escalation does not have to mean conflict.

It means moving the concern to the right person with the right facts and a clear request.

## The Kefiw Escalation Formula

Use:

Observation + impact + request + deadline

Example:

"On Monday and Wednesday, Mom's medication was not given at the scheduled time. She became anxious and missed dinner. Please review what happened, update us by Friday, and explain how this will be prevented."

## Step 1: Start With The Closest Responsible Person

Examples:

- Home care issue: caregiver supervisor.
- Nursing issue: nurse or unit manager.
- Billing issue: billing office.
- Care plan issue: social worker or care plan coordinator.
- Facility-wide issue: administrator.
- Rights or unresolved concern: ombudsman.
- Regulatory nursing home complaint: state survey agency.
- Abuse, neglect, exploitation: APS or emergency services if immediate danger.

## Step 2: Make The Concern Specific

Weak:

"The care is bad."

Strong:

"Dad has had three missed showers in two weeks, and no one documented why."

## Step 3: Ask For A Plan, Not Only An Apology

Ask:

- What happened?
- What will change?
- Who owns the fix?
- When will we hear back?
- How will this be documented?
- How will we know it is resolved?

## Step 4: Escalate If The Pattern Continues

A repeated issue is not just a complaint. It is a care plan failure.

Escalate when:

- The concern repeats.
- The resident is harmed or at risk.
- The family gets only verbal reassurance.
- The response is defensive.
- The facility refuses documentation.
- The resident is afraid.
- The issue involves rights, abuse, neglect, exploitation, or unsafe discharge.

ACL says ombudsman programs work to resolve problems related to health, safety, welfare, and rights in long-term care facilities. Medicare also provides complaint routes for quality-of-care and nursing home concerns.

## Kefiw Tip: Use "We Want To Resolve This Here"

Open with:

"We want to resolve this at the facility level if possible."

This signals cooperation while still making clear that the family is prepared to escalate if needed.

## Family Script

"We want to keep this constructive. We are documenting the issue, asking for a clear plan, and setting a follow-up date. If it is not resolved, we will ask the ombudsman or appropriate agency for help."

## Red Flags

- You are told to stop documenting.
- You are told not to contact outside resources.
- A resident is threatened or shamed.
- Concerns are dismissed as family anxiety.
- The care plan is not updated.
- The same issue repeats.
- Immediate danger is treated as a routine issue.

## Checklist

- Write the facts.
- Identify the correct contact.
- Make a clear request.
- Ask for a follow-up date.
- Confirm in writing.
- Track whether the issue repeats.
- Escalate to ombudsman, state survey agency, APS, Medicare complaint route, or emergency services when appropriate.

## Related Kefiw Tools

- [Care Facility Complaint Log](/care/guides/care-facility-complaint-log/)
- [Nursing Home Red Flags](/care/guides/nursing-home-red-flags/)
- [Assisted Living Red Flags](/care/guides/assisted-living-red-flags/)`,
      'ombudsman-informed reviewer or elder law attorney',
      [SOURCE_ACL_OMBUDSMAN, SOURCE_MEDICARE_COMPLAINTS, SOURCE_CMS_RESIDENT_RIGHTS],
    ),
  },
  {
    id: 'art-care-who-to-call-care-concern',
    kind: 'guide',
    section: 'guides',
    guideCategory: 'Local Resources & Rights',
    slug: 'who-to-call-care-concern',
    title: 'Who to Call for a Senior Care Concern | Kefiw',
    h1: 'Who to Call for a Senior Care Concern',
    description:
      'Learn who to call for common senior care concerns, including the doctor, facility, ombudsman, APS, emergency services, Medicare, or the state survey agency.',
    metaDescription:
      'Learn who to call for common senior care concerns, including the doctor, facility, ombudsman, APS, emergency services, Medicare, or the state survey agency.',
    keywords: ['who to call senior care concern', 'doctor facility ombudsman APS 911 Medicare', 'senior care escalation guide'],
    intro:
      'When something goes wrong, families often lose time asking who they are supposed to call. This guide gives users a simple decision framework.',
    outcomeLine:
      'The right contact depends on whether the concern is immediate danger, medical change, facility care, resident rights, abuse, Medicare, or billing.',
    faq: [
      {
        q: 'Who should be called for immediate danger?',
        a: 'Call emergency services for immediate danger, severe injury, severe breathing trouble, stroke-like symptoms, unconsciousness, active violence, or threats of harm.',
        faq_intent: 'safety',
      },
      {
        q: 'Who handles resident rights concerns?',
        a: 'The facility may handle the first response, but unresolved resident rights concerns often belong with the long-term care ombudsman. Serious nursing home regulatory issues may also involve the state survey agency.',
        faq_intent: 'how-to',
      },
      {
        q: 'What if the family is unsure?',
        a: 'Use the two-call rule: call the person or agency closest to the problem and call the protection or oversight resource when safety, rights, abuse, or unresolved care is involved.',
        faq_intent: 'how-to',
      },
    ],
    primaryCta: { href: '/health/medical-triage/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/report-care-facility-concerns/', label: 'Report Facility Concerns' },
      { href: '/care/guides/care-facility-complaint-log/', label: 'Complaint Log' },
      { href: '/care/guides/emergency-contact-plan-aging-parent/', label: 'Emergency Contact Plan' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

The right contact depends on the type of concern:

- Immediate danger: emergency services.
- Medical change: doctor, nurse line, urgent care, or emergency services depending on severity.
- Facility care issue: facility care team first, then ombudsman or state agency if unresolved.
- Resident rights issue: ombudsman.
- Abuse, neglect, self-neglect, exploitation: APS or emergency services if immediate danger.
- Medicare quality or coverage issue: Medicare complaint, appeal, BFCC-QIO, or 1-800-MEDICARE.
- Billing or legal issue: facility billing office, insurer, legal professional, or state agency depending on the issue.

Medicare says people with concerns about quality of care or other services can file a complaint. If someone needs to file a claim, appeal, or complaint on a beneficiary's behalf, Medicare may need authorization to discuss personal health information with that person.

## Call Emergency Services When

Call emergency services for:

- Immediate danger.
- Severe injury.
- Severe chest pain.
- Severe breathing trouble.
- Stroke-like symptoms.
- Unconsciousness.
- Active violence.
- Serious fall with head injury or confusion.
- Threat of harm.
- Any situation that cannot safely wait.

## Call The Doctor Or Nurse Line When

Call for:

- New but non-emergency symptoms.
- Medication side effects.
- Worsening weakness.
- New confusion that is not clearly an emergency.
- Recent falls without emergency signs.
- Appetite or weight changes.
- Pain.
- Care plan changes.
- Questions after hospital discharge.

## Call The Facility When

Call for:

- Missed care.
- Care plan concerns.
- Meal concerns.
- Hygiene concerns.
- Medication timing issues.
- Family communication.
- Billing questions.
- Staff concerns.
- Non-emergency resident needs.

## Call The Ombudsman When

Call for:

- Resident rights concerns.
- Repeated unresolved facility problems.
- Discharge threats.
- Dignity or quality-of-life issues.
- Resident fear of retaliation.
- Family blocked from reasonable communication.
- Need for help communicating with the facility.

ACL says ombudsman programs resolve problems related to health, safety, welfare, and rights of long-term care residents.

## Call APS When

Call for suspected:

- Abuse.
- Neglect.
- Self-neglect.
- Financial exploitation.
- Unsafe living conditions.
- Caregiver harm.
- Vulnerable adult unable to meet basic needs.

ACL says APS receives and responds to reports of adult maltreatment in all states.

## Call Medicare Or The State Survey Agency When

Call for:

- Nursing home regulatory complaints.
- Quality-of-care complaints.
- Medicare appeals.
- Medicare plan problems.
- Home health complaints.
- Coverage disputes.

Medicare says people can call 1-800-MEDICARE to get state survey agency contact information when filing quality-of-care complaints. CMS says BFCC-QIOs can receive quality-of-care concerns for Medicare-covered services.

## The Kefiw Two-Call Rule

If you are unsure, make two calls:

1. Call the person or agency closest to the problem.
2. Call the protection or oversight resource.

Examples:

- Facility fall concern: call facility nurse and ombudsman if unresolved.
- Suspected exploitation: call APS and bank or fraud support.
- Nursing home unsafe care: call facility administrator and state survey agency.
- Medicare discharge problem: call plan or BFCC-QIO route and Medicare.

## Family Script

"We are trying to contact the right resource. This concern involves [medical change / facility care / resident rights / possible neglect / Medicare coverage]. Can you confirm whether your office handles this or who should?"

## Checklist

- Identify immediate danger.
- Identify concern type.
- Call the closest responsible person.
- Document the call.
- Ask for next step.
- Ask who else should be notified.
- Escalate if unresolved or unsafe.
- Save all names, dates, and reference numbers.

## Related Kefiw Tools

- [Care Urgency Check](/health/medical-triage/)
- [Complaint Log](/care/guides/care-facility-complaint-log/)
- [Emergency Contact Plan](/care/guides/emergency-contact-plan-aging-parent/)`,
      'clinician, ombudsman-informed reviewer, elder law attorney, or Medicare specialist',
      [SOURCE_MEDICARE_COMPLAINTS, SOURCE_ACL_OMBUDSMAN, SOURCE_ACL_APS, SOURCE_CMS_BFCC_QIO],
    ),
  },
];

export const CARE_LOCAL_RESOURCES_RIGHTS_GUIDE_OVERRIDES: Record<string, Partial<ContentPageConfig>> = {
  'art-care-find-local-resources': {
    slug: 'find-local-senior-care-resources',
    title: 'How to Find Local Senior Care Resources for an Aging Parent | Kefiw',
    h1: 'How to Find Local Senior Care Resources',
    description:
      'Learn how to find local senior care resources, including Area Agencies on Aging, transportation, meals, respite, home care, caregiver support, and benefits help.',
    metaDescription:
      'Learn how to find local senior care resources, including Area Agencies on Aging, transportation, meals, respite, home care, caregiver support, and benefits help.',
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
      { href: '/care/guides/build-local-care-team/', label: 'Build a Local Care Team' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Why Local Resources Matter

Families often start senior care planning by searching online for facilities or home care agencies. That can help, but it should not be the only step.

Many communities have local aging resources that can help with meals, transportation, caregiver support, benefits counseling, respite, home modifications, adult day services, and long-term care referrals.

In the U.S., the Eldercare Locator is a public service of the Administration for Community Living that connects older adults and families with services in their community. It can be reached online, by chat, or by phone or text at 1-800-677-1116.

## Plain-English Summary

Local senior care resources are the community-based supports that help older adults and caregivers before, during, or after a major care decision.

They may include:

- Area Agencies on Aging.
- Aging and Disability Resource Centers.
- Meals programs.
- Transportation.
- Respite care.
- Caregiver training.
- Home modification referrals.
- Adult day programs.
- Benefits counseling.
- Medicaid help.
- Medicare counseling through SHIP.
- Long-term care ombudsman programs.
- Legal aid referrals.
- Adult Protective Services.

ACL notes that the Eldercare Locator connects older adults and caregivers with trusted local resources. ACL's local services page also points families toward tools such as Eldercare Locator, nursing home comparison information, home health information, SHIP programs, state insurance divisions, and Medicaid offices.

## The Kefiw Local Resource Map

Instead of searching randomly, build a resource map with five lanes.

### Lane 1: Daily Living Support

Look for:

- Meals.
- Grocery support.
- Transportation.
- Home safety help.
- Housekeeping support.
- Utility or housing assistance.

### Lane 2: Caregiver Relief

Look for:

- Respite programs.
- Adult day care.
- Caregiver education.
- Support groups.
- Family caregiver grants.
- Volunteer programs.

### Lane 3: Health And Benefits Navigation

Look for:

- SHIP Medicare counseling.
- Medicaid offices.
- Veterans benefits help.
- Prescription assistance.
- Insurance counseling.

### Lane 4: Rights And Complaints

Look for:

- Long-Term Care Ombudsman.
- State survey agency.
- Adult Protective Services.
- Legal aid.
- Resident rights resources.

### Lane 5: Emergency Backup

Look for:

- Local emergency contacts.
- Non-emergency police number.
- Fire department lift-assist policy if applicable.
- Hospital preference.
- Crisis line.
- Neighbor or family backup.

## What Families Often Miss

Families often search for paid care first and free or community-based supports last.

A better order is:

1. Identify the care need.
2. Check local resources.
3. Estimate family workload.
4. Estimate paid care cost.
5. Fill the gaps.

Sometimes a meal program, transportation service, adult day program, respite grant, or caregiver training can delay or reduce paid care needs.

## Kefiw Tip: Make One Local Support Call Before Buying Services

Before hiring home care or choosing a facility, contact a local aging resource and ask:

"What services exist in this county for an older adult who needs help with meals, transportation, caregiver respite, home safety, and long-term care planning?"

This does not replace paid care, but it may reveal options families would not otherwise find.

## Questions To Ask Local Resource Agencies

- What services are available in this county?
- Are there waitlists?
- Are services income-based?
- Are there caregiver respite programs?
- Is transportation available for medical visits?
- Are meal services available?
- Is there adult day care nearby?
- Can someone help with Medicare or Medicaid questions?
- Who handles facility complaints?
- Who should we call for suspected abuse, neglect, or exploitation?

## Red Flags

- The family relies only on facility sales teams for advice.
- No one checks local aging resources.
- The caregiver is burning out while respite options are unexplored.
- The family assumes no help exists because one program had a waitlist.
- The family does not know the local ombudsman, APS office, or state survey agency.

## Checklist

- Contact Eldercare Locator.
- Identify the local Area Agency on Aging.
- Find the local SHIP program.
- Find the Long-Term Care Ombudsman.
- Identify APS reporting information.
- Find transportation resources.
- Find meal resources.
- Ask about respite.
- Ask about caregiver support.
- Save all local numbers in the emergency binder.

## Related Kefiw Tools

- [Care Needs Checklist](/care/care-needs-checklist/)
- [Caregiver Hours Calculator](/care/caregiver-hours-calculator/)
- [Family Care Budget Calculator](/care/family-care-budget-calculator/)`,
      'aging services professional or geriatric care manager',
      [SOURCE_ELDERCARE_LOCATOR, SOURCE_ACL_LOCAL_SERVICES, SOURCE_ACL_ADRC],
    ),
  },
  'art-care-ltc-ombudsman': {
    slug: 'long-term-care-ombudsman',
    title: 'What Is a Long-Term Care Ombudsman? | Kefiw',
    h1: 'What Is a Long-Term Care Ombudsman?',
    description:
      'Learn how long-term care ombudsmen help residents and families with concerns about nursing homes, assisted living, board and care homes, and resident rights.',
    metaDescription:
      'Learn how long-term care ombudsmen help residents and families with concerns about nursing homes, assisted living, board and care homes, and resident rights.',
    primaryCta: { href: '/care/guides/facility-contract-checklist/', label: 'Review Facility Contract Checklist' },
    relatedLinks: [
      { href: '/care/guides/nursing-home-red-flags/', label: 'Nursing Home Red Flags' },
      { href: '/care/guides/report-care-facility-concerns/', label: 'Report Facility Concerns' },
      { href: '/care/guides/resident-rights-long-term-care/', label: 'Resident Rights Guide' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

A Long-Term Care Ombudsman is an advocate for people who live in long-term care facilities.

Families should know this resource before a crisis. An ombudsman can help residents and families understand rights, raise concerns, resolve problems, and navigate facility issues.

ACL says state Long-Term Care Ombudsman programs work to resolve problems related to the health, safety, welfare, and rights of people living in long-term care facilities, including nursing homes, board and care homes, assisted living facilities, and other residential care communities.

Ombudsman programs operate in all states, the District of Columbia, Puerto Rico, and Guam.

## What An Ombudsman May Help With

They may help with concerns about:

- Poor care.
- Discharge threats.
- Resident rights.
- Food or hygiene concerns.
- Medication concerns.
- Family communication.
- Dignity and respect.
- Abuse, neglect, or mistreatment concerns.
- Facility rules.
- Care plans.
- Access to services.

## What An Ombudsman Can Do

An ombudsman may:

- Listen to resident and family concerns.
- Help identify the problem.
- Explain resident rights.
- Help communicate with the facility.
- Work to resolve complaints.
- Help residents access services.
- Advocate for residents' interests.
- Refer to other agencies when needed.

ACL lists ombudsman duties that include identifying, investigating, and resolving complaints made by or on behalf of residents; providing information about long-term services and supports; and representing residents' interests before government agencies.

## What Families Often Miss

Families often wait too long to call the ombudsman.

They may think:

"We should only call if things are terrible."

But the better use is:

"We are worried this issue is not being resolved. Can you help us understand our options and rights?"

## Kefiw Tip: Call Before The Relationship Breaks

The ombudsman can be especially helpful when the family wants to resolve a concern without immediately turning it into a formal regulatory complaint.

Good moments to call:

- The facility is not responding.
- A discharge threat is made.
- The resident's rights seem unclear.
- A care plan issue keeps repeating.
- A family feels intimidated.
- The resident is afraid to speak up.
- The facility says something that does not sound right.

## Questions To Ask An Ombudsman

- Is this a resident rights issue?
- How should we document the concern?
- Who should we speak with first at the facility?
- Should we request a care plan meeting?
- Is this something for the state survey agency?
- Is this something for APS?
- What should we do if the facility threatens discharge?
- Can you help us communicate with the facility?

## Family Script

"We are trying to resolve a concern about care and communication. We want to understand the resident's rights, the right next step, and whether this should involve the facility, ombudsman, state agency, or APS."

## Red Flags

- The facility discourages you from calling the ombudsman.
- A resident is afraid of retaliation.
- Discharge is threatened verbally.
- Concerns are ignored or minimized.
- The facility refuses to document the issue.
- Family members are blocked from reasonable communication.
- The resident's dignity, safety, or rights appear at risk.

## Checklist

- Find the state Long-Term Care Ombudsman.
- Save the contact in the emergency binder.
- Document the concern.
- Ask the resident what they want when possible.
- Contact the facility contact first when safe and appropriate.
- Contact the ombudsman if unresolved or rights-related.
- Escalate to the state survey agency or APS when needed.

## Related Kefiw Tools

- [Facility Contract Checklist](/care/guides/facility-contract-checklist/)
- [Nursing Home Red Flags](/care/guides/nursing-home-red-flags/)
- [Assisted Living Red Flags](/care/guides/assisted-living-red-flags/)`,
      'long-term care ombudsman-informed reviewer or elder law attorney',
      [SOURCE_ACL_OMBUDSMAN, SOURCE_ACL_OMBUDSMAN_FAQ, SOURCE_CMS_RESIDENT_RIGHTS],
    ),
  },
  'art-care-resident-rights': {
    slug: 'resident-rights-long-term-care',
    title: 'Resident Rights in Nursing Homes and Long-Term Care Facilities | Kefiw',
    h1: 'Resident Rights in Long-Term Care Facilities',
    description:
      'Learn key resident rights in long-term care facilities, including dignity, information, care participation, privacy, complaints, visits, and discharge protections.',
    metaDescription:
      'Learn key resident rights in long-term care facilities, including dignity, information, care participation, privacy, complaints, visits, and discharge protections.',
    primaryCta: { href: '/care/guides/facility-contract-checklist/', label: 'Review Facility Contract Checklist' },
    relatedLinks: [
      { href: '/care/guides/care-facility-complaint-log/', label: 'Care Facility Complaint Log' },
      { href: '/care/guides/long-term-care-ombudsman/', label: 'Long-Term Care Ombudsman' },
      { href: '/care/guides/nursing-home-red-flags/', label: 'Nursing Home Red Flags' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

Moving into a nursing home, assisted living community, memory care community, or board and care home does not mean a person gives up their rights.

CMS says residents in Medicare- and Medicaid-certified nursing homes have rights and protections under federal and state law to make sure they receive the care and services they need. Consumer Voice notes that nursing homes participating in Medicare and Medicaid must meet federal residents' rights requirements, while some states also have resident-rights laws or regulations for assisted living, adult care homes, and other settings.

Resident rights are protections around dignity, safety, information, choices, care participation, privacy, visits, complaints, and transfers or discharges.

They help answer questions like:

- Can the resident complain?
- Can the family ask questions?
- Can the resident participate in care planning?
- Can the facility discharge someone suddenly?
- Does the resident have a right to dignity and privacy?
- Can the resident choose visitors?
- Can the resident know what services cost?

## Rights Families Should Know

### Right To Dignity And Respect

The resident should be treated as a person, not a task.

Watch for tone, privacy, clothing, hygiene, positioning, and whether staff speak to the resident directly.

### Right To Information

Residents have the right to know about services, charges, facility rules, and rights. Consumer Voice summarizes the right to be fully informed of available services and charges, facility rules, state ombudsman and survey agency contact information, survey reports, and information in a language the resident understands.

### Right To Participate In Care

Residents should be involved in assessment, care planning, treatment, and discharge planning as appropriate. Families or representatives may also be involved when authorized or appropriate.

### Right To Complain

Residents have the right to raise grievances without fear of retaliation, complain to the ombudsman program, and file complaints with the state survey agency.

### Right To Privacy

Residents have privacy rights around communication, personal care, medical matters, personal affairs, and financial affairs.

### Right To Visits

Residents generally have the right to visits from people they choose, and also the right to refuse visitors.

### Transfer And Discharge Protections

Residents have protections around transfer and discharge, including reasons, notice, appeal rights, and safe discharge planning. Consumer Voice summarizes transfer and discharge rights, including a right to 30-day written notice in many cases and the right to appeal.

## What Families Often Miss

A resident right is not just a legal concept. It is a practical conversation tool.

Instead of saying:

"This feels wrong."

Say:

"We want to understand how the resident's right to participate in care planning is being handled."

That language often changes the conversation.

## Kefiw Tip: Turn Concerns Into Rights-Based Questions

Concern:

"No one tells us anything."

Rights-based question:

"How are residents and representatives informed of changes in condition, services, care plans, and charges?"

Concern:

"They want Mom out."

Rights-based question:

"Can you provide the written discharge notice, reason, appeal information, proposed location, and ombudsman contact?"

## Family Script

"We want to resolve this constructively. Can you explain which resident rights apply here and how the facility is documenting the plan?"

## Red Flags

- The facility discourages complaints.
- The resident fears retaliation.
- Family concerns are not documented.
- A discharge is threatened verbally.
- Care plan meetings exclude the resident or representative without explanation.
- Fees change without clear notice.
- Staff speak disrespectfully or ignore dignity.
- The family is told not to contact the ombudsman.

## Checklist

- Ask for written resident rights.
- Ask for the care plan.
- Ask for fee and service information.
- Ask for ombudsman contact information.
- Document concerns.
- Request a care plan meeting.
- File a grievance with the facility if appropriate.
- Contact the ombudsman if unresolved.
- Contact the state survey agency for serious or unresolved nursing home issues.
- Contact APS or emergency services for abuse, neglect, exploitation, or immediate danger.

## Related Kefiw Tools

- [Facility Contract Checklist](/care/guides/facility-contract-checklist/)
- [Care Facility Complaint Log](/care/guides/care-facility-complaint-log/)
- [Assisted Living Red Flags](/care/guides/assisted-living-red-flags/)`,
      'elder law attorney or ombudsman-informed reviewer',
      [SOURCE_CMS_RESIDENT_RIGHTS, SOURCE_CMS_RIGHTS_PDF, SOURCE_CONSUMER_VOICE_RIGHTS, SOURCE_ACL_OMBUDSMAN],
    ),
  },
  'art-care-report-facility-concerns': {
    slug: 'report-care-facility-concerns',
    title: 'How to Report Concerns About a Nursing Home, Assisted Living, or Care Facility | Kefiw',
    h1: 'How to Report Concerns About a Care Facility',
    description:
      'Learn how to report concerns about care, safety, abuse, neglect, discharge, resident rights, staffing, or billing in a long-term care facility.',
    metaDescription:
      'Learn how to report concerns about care, safety, abuse, neglect, discharge, resident rights, staffing, or billing in a long-term care facility.',
    primaryCta: { href: '/care/guides/care-facility-complaint-log/', label: 'Use Complaint Log' },
    relatedLinks: [
      { href: '/care/guides/long-term-care-ombudsman/', label: 'Long-Term Care Ombudsman Guide' },
      { href: '/care/guides/nursing-home-red-flags/', label: 'Nursing Home Red Flags' },
      { href: '/care/guides/assisted-living-red-flags/', label: 'Assisted Living Red Flags' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

Families often hesitate to report concerns because they do not want to make things worse.

That hesitation is understandable. But when safety, dignity, care quality, abuse, neglect, exploitation, or resident rights are involved, families need a clear escalation path.

CMS links nursing home residents and families to resources on reporting and resolving nursing home problems. Medicare says quality-of-care complaints can include issues such as drug errors, inappropriate treatment, being sent home without clear care instructions, and not getting treatment after abnormal test results.

The right reporting path depends on the problem.

Some concerns start with the facility.
Some go to the ombudsman.
Some go to the state survey agency.
Some go to APS.
Some require emergency services.

## Step 1: Decide Whether There Is Immediate Danger

Call emergency services if someone is in immediate danger, has urgent medical symptoms, is being harmed, or may be at serious risk right now.

Do not wait for a facility meeting when immediate safety is at risk.

## Step 2: Document The Concern

Write:

- Date and time.
- Resident name.
- Location.
- What happened.
- Who was involved.
- Witnesses.
- Photos if appropriate and allowed.
- Symptoms or injuries.
- Who was notified.
- What response was given.
- What outcome is needed.

## Step 3: Start With The Facility When Appropriate

For non-emergency concerns, contact:

- Nurse or direct care lead.
- Unit manager.
- Director of nursing.
- Administrator.
- Social worker.
- Billing office if financial.
- Care plan team.

Ask for documentation and a follow-up date.

## Step 4: Contact The Ombudsman

Contact the Long-Term Care Ombudsman when the issue involves resident rights, quality of life, communication, dignity, discharge concerns, unresolved facility complaints, or a resident who needs advocacy. ACL says ombudsman programs resolve problems related to health, safety, welfare, and rights in long-term care facilities.

## Step 5: Contact The State Survey Agency

For nursing home care complaints, Medicare says people can file with the state survey agency and can call 1-800-MEDICARE to get state survey agency contact information.

## Step 6: Contact APS When Abuse, Neglect, Self-Neglect, Or Exploitation May Be Involved

ACL describes APS as a state and local social services program serving older adults and adults with disabilities who need assistance because of abuse, neglect, self-neglect, or financial exploitation.

## The Kefiw Escalation Ladder

Use this ladder:

- Immediate danger: emergency services.
- Care concern but not immediate danger: facility contact.
- Resident rights or unresolved facility issue: ombudsman.
- Nursing home regulatory complaint: state survey agency.
- Abuse, neglect, self-neglect, exploitation: APS.
- Medicare quality-of-care complaint: BFCC-QIO or Medicare complaint route.
- Billing or legal dispute: qualified legal or insurance professional.

## Family Script

"We want to resolve this quickly and clearly. Please document our concern, tell us who is responsible for follow-up, and give us a written response or care plan update by [date]."

## Red Flags

- The facility refuses to document the concern.
- You are told not to contact the ombudsman.
- The resident fears retaliation.
- A serious injury is minimized.
- The same problem repeats after multiple reports.
- Staff blame the resident instead of reviewing care.
- The family cannot get a written explanation.
- Immediate safety concerns are treated as routine complaints.

## Checklist

- Check immediate danger.
- Document the concern.
- Speak with the right facility contact.
- Ask for a written follow-up.
- Contact the ombudsman if unresolved or rights-related.
- Contact the state survey agency for nursing home regulatory issues.
- Contact APS for abuse, neglect, self-neglect, or exploitation.
- Save all notes, photos, emails, and names.
- Update the care plan after resolution.

## Related Kefiw Tools

- [Care Facility Complaint Log](/care/guides/care-facility-complaint-log/)
- [Long-Term Care Ombudsman Guide](/care/guides/long-term-care-ombudsman/)
- [Resident Rights Guide](/care/guides/resident-rights-long-term-care/)`,
      'ombudsman-informed reviewer, elder law attorney, or clinician for safety-related sections',
      [SOURCE_CMS_RESIDENT_RIGHTS, SOURCE_MEDICARE_COMPLAINTS, SOURCE_ACL_OMBUDSMAN, SOURCE_ACL_APS],
    ),
  },
  'art-care-emergency-contacts-documents': {
    slug: 'emergency-contact-plan-aging-parent',
    title: 'Emergency Contact Plan for an Aging Parent | Kefiw',
    h1: 'Emergency Contact Plan for an Aging Parent',
    description:
      'Create an emergency contact plan for an aging parent, including family contacts, doctors, medications, hospital preferences, facility contacts, and backup caregivers.',
    metaDescription:
      'Create an emergency contact plan for an aging parent, including family contacts, doctors, medications, hospital preferences, facility contacts, and backup caregivers.',
    primaryCta: { href: '/care/guides/caregiver-emergency-binder/', label: 'Build Emergency Binder' },
    relatedLinks: [
      { href: '/care/guides/medication-management-family-caregivers/', label: 'Medication Management Guide' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/guides/build-local-care-team/', label: 'Build Local Care Team' },
    ],
    longformMarkdown: withLocalRightsFooter(
      `## Plain-English Summary

An emergency contact plan should be simple enough to use when everyone is scared.

The goal is not to create a perfect binder. The goal is to make sure the first person on the scene knows who to call, what matters medically, where documents are, and what the backup plan is.

An emergency contact plan answers six questions:

- Who should be called first?
- Who has decision-making authority?
- What medical information matters immediately?
- Where should the person be taken if needed?
- Who can enter the home or meet responders?
- Who updates the rest of the family?

Ready.gov and the American Red Cross both emphasize support networks, emergency information, supplies, and plans for medical needs or powered medical devices.

## The Kefiw One-Page Emergency Sheet

Put this at the front of the emergency binder and on the refrigerator if appropriate.

Include:

- Full name.
- Date of birth.
- Address.
- Primary language.
- Emergency contacts.
- Primary caregiver.
- Backup caregiver.
- Health care proxy or decision-maker.
- Primary doctor.
- Pharmacy.
- Preferred hospital.
- Allergies.
- Current medications.
- Major diagnoses.
- Mobility needs.
- Dementia or communication needs.
- Code status or advance directive location, if applicable.
- Pet care instructions.
- Home access instructions.

## The First Call / Second Call / Third Call Rule

For each situation, choose the order.

- Medical emergency: emergency services, primary caregiver, health care proxy.
- Facility issue: facility nurse or manager, primary caregiver, ombudsman if unresolved.
- Missed home care shift: agency supervisor, backup caregiver, family coordinator.
- No answer from parent: local contact, primary caregiver, emergency welfare check if needed.
- Suspected abuse or exploitation: emergency services if immediate danger, APS, trusted decision-maker.

## What Families Often Miss

Families list contacts but not roles.

A contact list is not enough. Each contact should have a job.

Example:

- Anna: health care decisions.
- David: finances and insurance.
- Maria: local check-in.
- James: family updates.
- Neighbor: door access if parent does not answer.
- Home care agency: shift coverage.

## Kefiw Tip: Add A Do Not Call First Note

Sometimes the wrong first call creates confusion.

Examples:

- Do not call the long-distance sibling first if a local person needs to unlock the door.
- Do not call the family group chat first if emergency services are needed.
- Do not call a facility salesperson about care complaints; call the care lead or administrator.

## Family Script

"This plan is not about expecting something bad. It is about making sure that if something happens, no one has to guess who to call or what information matters."

## Red Flags

- Only one person has the doctor list.
- Only one person knows medication details.
- No one knows who has legal authority.
- No one local can access the home.
- Facility or home care agency contacts are missing.
- Family members argue during emergencies because roles are unclear.
- Emergency responders would not have basic medical information.

## Checklist

- Create one-page emergency sheet.
- Add medication list.
- Add allergies.
- Add diagnoses.
- Add emergency contacts.
- Add decision-maker information.
- Add doctor and pharmacy contacts.
- Add hospital preference.
- Add home access plan.
- Add facility or agency contacts.
- Review every six months.

## Related Kefiw Tools

- [Caregiver Emergency Binder](/care/guides/caregiver-emergency-binder/)
- [Medication Management Guide](/care/guides/medication-management-family-caregivers/)
- [Care Needs Checklist](/care/care-needs-checklist/)`,
      'geriatric care manager or clinician',
      [SOURCE_READY_OLDER_ADULTS, SOURCE_REDCROSS_OLDER_ADULTS, SOURCE_ELDERCARE_LOCATOR],
    ),
  },
};

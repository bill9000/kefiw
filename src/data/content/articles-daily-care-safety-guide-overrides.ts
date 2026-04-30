import type { ContentPageConfig } from '../content-pages';

const SOURCE_CDC_CAREGIVING_DAILY_TASKS =
  '[CDC: Dementia caregiving as a public health strategy](https://www.cdc.gov/caregiving/php/public-health-strategy/index.html)';
const SOURCE_CDC_CARE_PLAN =
  '[CDC: Steps for creating and maintaining a care plan](https://www.cdc.gov/caregiving/guidelines/index.html)';
const SOURCE_CDC_CAREGIVER_FALLS =
  '[CDC: Information for caregivers](https://www.cdc.gov/still-going-strong/caregivers/index.html)';
const SOURCE_CDC_FALL_RESOURCES =
  '[CDC: Fall prevention resources](https://www.cdc.gov/falls/communication-resources/index.html)';
const SOURCE_CDC_STEADI_RX =
  '[CDC STEADI-Rx: Pharmacy care and medication-related fall risk](https://www.cdc.gov/steadi/hcp/clinical-resources/pharmacy-care.html)';
const SOURCE_FDA_MEDICATION_SAFETY =
  '[FDA: 5 medication safety tips for older adults](https://www.fda.gov/consumers/consumer-updates/5-medication-safety-tips-older-adults)';
const SOURCE_NIA_ALZ_CARE =
  "[NIA: Caring for a person with Alzheimer's disease](https://order.nia.nih.gov/sites/default/files/2024-03/caring-for-a-Person-with-alzheimers-disease.pdf)";
const SOURCE_ALZ_DAILY_CARE =
  "[Alzheimer's Association: Daily care](https://www.alz.org/help-support/caregiving/daily-care)";
const SOURCE_ALZ_DAILY_CARE_PLAN =
  "[Alzheimer's Association: Daily care plan](https://www.alz.org/help-support/caregiving/daily-care/daily-care-plan)";
const SOURCE_ALZ_BATHING =
  "[Alzheimer's Association: Bathing](https://www.alz.org/help-support/caregiving/daily-care/bathing)";
const SOURCE_ALZ_DRESSING_GROOMING =
  "[Alzheimer's Association: Dressing and grooming](https://www.alz.org/help-support/caregiving/daily-care/dressing-grooming)";
const SOURCE_ALZ_COMMUNICATION =
  "[Alzheimer's Association: Communication and Alzheimer's](https://www.alz.org/help-support/caregiving/daily-care/communications)";
const SOURCE_ALZ_SUNDOWNING =
  "[Alzheimer's Association: Sleep issues and sundowning](https://www.alz.org/help-support/caregiving/stages-behaviors/sleep-issues-sundowning)";
const SOURCE_MEDLINE_NUTRITION =
  '[MedlinePlus: Nutrition for older adults](https://medlineplus.gov/nutritionforolderadults.html)';
const SOURCE_MEDLINE_SWALLOWING =
  '[MedlinePlus: Swallowing problems](https://medlineplus.gov/ency/patientinstructions/000065.htm)';
const SOURCE_MEDLINE_DYSPHAGIA =
  '[MedlinePlus: Dysphagia tests](https://medlineplus.gov/lab-tests/dysphagia-tests/)';
const SOURCE_MEDLINE_CONSTIPATION =
  '[MedlinePlus: Constipation self-care](https://medlineplus.gov/ency/patientinstructions/000120.htm)';
const SOURCE_MEDLINE_DEHYDRATION =
  '[MedlinePlus: Dehydration](https://medlineplus.gov/ency/article/000982.htm)';

const DAILY_CARE_CATEGORY = 'Daily Care & Safety';

const sharedDailyCareDisclaimer = `## Kefiw Daily Care And Safety Disclaimer

Kefiw provides educational care-planning tools and guides. This content does not diagnose medical conditions, prescribe treatment, replace medical care, or replace legal, financial, insurance, tax, or professional caregiving advice. Care routines, symptoms, medications, diet, mobility, dementia behaviors, toileting, hydration, and safety needs vary by person. For urgent medical concerns, sudden changes, severe symptoms, suspected abuse, or immediate danger, call emergency services or contact a qualified professional.

## Continue Planning With Kefiw

- [Run the Care Needs Checklist](/care/care-needs-checklist/)
- [Calculate caregiver hours](/care/caregiver-hours-calculator/)
- [Use the Care Urgency Check](/care/care-urgency-check/)
- [Use the Home Safety Checklist](/care/guides/home-safety-checklist-older-adults/)
- [Review Medication Management](/care/guides/medication-management-family-caregivers/)
- [Start the Plan Senior Care Track](/tracks/plan-senior-care/)
`;

function withDailyCareFooter(body: string, reviewer: string, sources: string[]): string {
  return `${body}

## Product Modules To Connect Later

- Daily Care Log
- Medication Change Log
- Fall / Near-Fall Log
- Bathroom Pattern Log
- Mealtime Tracker
- Dementia Trigger Tracker
- Care Refusal Pattern Tracker
- Weekly Family Update Summary

## Professional Review

Recommended reviewer: ${reviewer}

## Sources To Verify

${sources.map((source) => `- ${source}`).join('\n')}

Last reviewed: April 29, 2026.

${sharedDailyCareDisclaimer}`;
}

const faq = (q: string, a: string, faq_intent = 'how-to') => ({ q, a, faq_intent });

export const CARE_DAILY_SAFETY_NEW_GUIDES: ContentPageConfig[] = [
  {
    id: 'art-care-daily-care-routine-aging-parent',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'daily-care-routine-aging-parent',
    title: 'Daily Care Routine for an Aging Parent: A Practical Family Guide | Kefiw',
    h1: 'Daily Care Routine Guide for an Aging Parent',
    description:
      'Build a daily care routine for an aging parent, including meals, medication, bathing, mobility, safety checks, appointments, supervision, and caregiver notes.',
    metaDescription:
      'Build a daily care routine for an aging parent, including meals, medication, bathing, mobility, safety checks, appointments, supervision, and caregiver notes.',
    keywords: ['daily care routine aging parent', 'caregiver daily routine', 'elder care daily checklist'],
    intro:
      'A daily care routine should make life easier, not stricter. The goal is to make the important things happen reliably without turning the home into a hospital.',
    outcomeLine:
      'A useful routine covers meals, medication, hygiene, movement, safety, rest, social connection, supervision, and caregiver communication.',
    faq: [
      faq('What should a daily care routine include?', 'Start with meals, fluids, medication, hygiene, dressing, bathroom needs, movement, fall risk, appointments, rest, social connection, and caregiver notes.', 'definition'),
      faq('How detailed should the routine be?', 'Detailed enough that another caregiver can follow it, but not so detailed that it becomes impossible to maintain. Focus on the tasks that affect safety, health, comfort, and communication.'),
      faq('When should a routine be updated?', 'Review it after falls, hospitalization, medication changes, worsening confusion, missed meals, new toileting issues, or caregiver burnout.'),
    ],
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/guides/caregiver-daily-check-in-log/', label: 'Caregiver Daily Log Guide' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

A daily care routine helps the family answer:

- What needs to happen every day?
- Who is responsible?
- What time of day is hardest?
- What needs supervision?
- What should be written down?
- What should trigger a care plan change?

CDC describes caregivers as helping with critical daily tasks such as grocery shopping, paying bills, bathing, dressing, and managing medicines. A daily routine turns those tasks into a practical care rhythm.

## The Kefiw Daily Care Rhythm

### Morning

Check:

- Wake-up time.
- Bathroom needs.
- Hygiene.
- Dressing.
- Breakfast.
- Morning medications.
- Pain, dizziness, confusion, or mood.
- Mobility and fall risk.
- Appointment plan.

### Midday

Check:

- Lunch.
- Hydration.
- Movement.
- Social connection.
- Errands or appointments.
- Rest break.
- Medication if scheduled.
- Home safety.

### Evening

Check:

- Dinner.
- Evening medication.
- Bathing or hygiene routine.
- Confusion or sundowning.
- Bathroom path.
- Sleep preparation.
- Next-day plan.

### Overnight

Check:

- Fall risk.
- Bathroom needs.
- Wandering risk.
- Phone or alert device.
- Night lighting.
- Caregiver sleep protection.

## What Families Often Miss

A care routine should be built around the person's hardest time of day.

Some people are strongest in the morning. Some become anxious in the late afternoon. Some are unsafe overnight. Some resist bathing when rushed. Some eat better earlier in the day.

Do not design the routine around convenience alone. Design it around the person's pattern.

## Kefiw Tip: Find The Care Bottleneck

Every routine has one weak point.

Examples:

- Medication is reliable, but meals are not.
- Meals are fine, but bathing causes conflict.
- Daytime is fine, but evenings are unsafe.
- Home care helps, but no one covers weekends.
- Family visits happen, but no one writes down changes.

Fix the bottleneck first. Do not rebuild the whole routine if one part is failing.

## Family Script

"Let's stop treating each day like a new emergency. We need a simple routine that covers meals, medication, hygiene, movement, safety, and who gets updated."

## Red Flags

- No one knows whether medications were taken.
- Meals are skipped or inconsistent.
- Bathing is avoided for long periods.
- Falls or near-falls are increasing.
- The caregiver is guessing instead of tracking.
- Evening confusion is worsening.
- The person cannot be alone safely but is left alone.
- Family members receive updates only after a crisis.

## Checklist

- Write the morning routine.
- Write the midday routine.
- Write the evening routine.
- Write the overnight safety plan.
- Assign task owners.
- Add medication checks.
- Add meal and hydration checks.
- Add movement and fall checks.
- Add caregiver notes.
- Review the routine weekly.
- Reassess after falls, hospitalizations, medication changes, or worsening confusion.`,
      'geriatric care manager, occupational therapist, clinician',
      [SOURCE_CDC_CAREGIVING_DAILY_TASKS, SOURCE_CDC_CARE_PLAN],
    ),
  },
  {
    id: 'art-care-bathing-dressing-grooming-support',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'bathing-dressing-grooming-support',
    title: 'Bathing, Dressing, and Grooming Support for Older Adults | Kefiw',
    h1: 'Bathing, Dressing, and Grooming Support Guide',
    description:
      'Learn how caregivers can support bathing, dressing, and grooming with dignity, safety, privacy, dementia-aware communication, and fall prevention.',
    metaDescription:
      'Learn how caregivers can support bathing, dressing, and grooming with dignity, safety, privacy, dementia-aware communication, and fall prevention.',
    keywords: ['bathing dressing grooming older adults', 'personal care support caregiver', 'dementia bathing refusal'],
    intro:
      'Bathing, dressing, and grooming are privacy tasks, dignity tasks, identity tasks, and safety tasks.',
    outcomeLine:
      'Personal care support should protect safety, privacy, dignity, warmth, choice, routine, caregiver body safety, and the person\'s identity.',
    faq: [
      faq('Why might an older adult resist bathing or dressing?', 'Resistance may come from fear of falling, embarrassment, pain, confusion, cold, fatigue, loss of control, or not understanding what is happening.', 'definition'),
      faq('How can caregivers preserve dignity during personal care?', 'Prepare first, offer simple choices, explain each step, give privacy when safe, help only where needed, and restore comfort afterward.'),
      faq('When should family ask for help with bathing?', 'Ask for professional help when the bathroom is unsafe, transfers are difficult, distress is high, skin issues appear, or the caregiver feels forced into physical struggle.'),
    ],
    primaryCta: { href: '/care/home-care-cost-calculator/', label: 'Estimate Home Care Cost' },
    relatedLinks: [
      { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Home Safety Checklist' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

Good personal care support protects:

- Safety.
- Privacy.
- Dignity.
- Warmth.
- Choice.
- Routine.
- Caregiver body safety.
- The person's identity and preferences.

NIA notes that the ability to perform daily tasks such as bathing, dressing, and eating can change when a person has Alzheimer's disease. The same dignity-first logic is useful across many care situations.

## The Kefiw Dignity-First Approach

Before helping, ask:

- What can the person still do alone?
- What part of the task feels embarrassing?
- What part feels unsafe?
- What time of day works best?
- What clothing is easiest?
- What choices can the person still make?

The goal is not to take over. The goal is to support only what needs support.

## Bathing Support

Make bathing easier by preparing first:

- Warm the bathroom.
- Set out towels and clothing.
- Use non-slip surfaces.
- Add grab bars if appropriate.
- Use a shower chair if needed.
- Keep soap, shampoo, and washcloth within reach.
- Avoid rushing.
- Explain each step.
- Offer privacy where safe.
- Use a handheld shower if helpful.

## Dressing Support

Make dressing easier by:

- Offering two outfit choices instead of an open closet.
- Choosing easy closures.
- Avoiding tight sleeves or difficult buttons.
- Dressing the weaker or more painful side first.
- Keeping favorite clothing visible.
- Laying clothing out in order.
- Using adaptive clothing when needed.

## Grooming Support

Support:

- Brushing teeth.
- Denture care.
- Hair care.
- Shaving.
- Nail care.
- Skin checks.
- Deodorant.
- Clean glasses and hearing aids.

Grooming often improves mood because it helps the person feel like themselves.

## What Families Often Miss

Refusal may mean the task is too big.

Instead of saying, "You need a bath," try, "Let's wash your face and hands first." Then ask whether they would like to change their shirt.

Small steps reduce resistance.

## Kefiw Tip: Use The Privacy Sandwich

Give privacy before the task. Provide help only where needed during the task. Restore dignity after the task.

Example:

"I'll step outside while you undress. I'll come back when you're ready so I can help you step safely into the shower."

## Dementia-Aware Script

"You're safe. I'll go slowly. We're just going to wash up and get comfortable."

The Alzheimer's Association emphasizes patience, clear communication, simple choices, and avoiding rushed routines in dementia personal care.

## Red Flags

- Bathing is avoided for weeks.
- The person is afraid of the bathroom.
- The caregiver is lifting or transferring unsafely.
- The person becomes highly distressed.
- Skin breakdown, odor, or infection concerns appear.
- The bathroom is slippery or poorly lit.
- Dementia-related confusion makes the routine unsafe.
- The caregiver feels forced to physically struggle with the person.

## Checklist

- Prepare bathroom before starting.
- Keep the room warm.
- Use non-slip safety supports.
- Offer simple choices.
- Preserve privacy.
- Break task into steps.
- Avoid arguing.
- Track refusal patterns.
- Ask for professional help if bathing becomes unsafe.
- Consider home care support for bathing if family care is too stressful.`,
      'occupational therapist, clinician, dementia care specialist',
      [SOURCE_NIA_ALZ_CARE, SOURCE_ALZ_BATHING, SOURCE_ALZ_DRESSING_GROOMING, SOURCE_ALZ_COMMUNICATION],
    ),
  },
  {
    id: 'art-care-toileting-incontinence-care',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'toileting-incontinence-care',
    title: 'Toileting and Incontinence Care for Family Caregivers | Kefiw',
    h1: 'Toileting and Incontinence Care Guide',
    description:
      'Learn practical ways to support toileting and incontinence care with dignity, safety, routines, supplies, bathroom setup, and professional guidance.',
    metaDescription:
      'Learn practical ways to support toileting and incontinence care with dignity, safety, routines, supplies, bathroom setup, and professional guidance.',
    keywords: ['toileting incontinence care caregiver', 'older adult bathroom routine', 'incontinence dignity caregiver'],
    intro:
      'Toileting care is one of the most sensitive caregiving tasks because it touches dignity, sleep, skin health, fall risk, and caregiver strain.',
    outcomeLine:
      'A toileting plan should protect dignity, skin and hygiene, bathroom safety, caregiver body safety, and timely medical follow-up when symptoms change.',
    faq: [
      faq('What should caregivers track for toileting problems?', 'Track accident timing, fluids, medication timing, mobility barriers, constipation, nighttime urgency, confusion, clothing difficulty, fear of falling, and signs of pain or infection.'),
      faq('Is incontinence only a laundry issue?', 'No. It can affect shame, withdrawal, odor, skin breakdown, sleep loss, fall risk, caregiver stress, and whether home care remains sustainable.'),
      faq('When should new incontinence be discussed with a clinician?', 'Discuss new, sudden, painful, worsening, fever-related, blood-related, or confusion-related incontinence with a health professional.'),
    ],
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Home Safety Checklist' },
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

Toileting support should protect three things:

- Dignity.
- Skin and hygiene.
- Safety.

A person may need help getting to the toilet, cleaning up, changing products, managing clothing, washing hands, or following a toileting schedule.

## The Kefiw Toileting Routine

Start with a pattern log.

Track:

- Time of accidents.
- Fluid timing.
- Medication timing.
- Bathroom access.
- Mobility barriers.
- Constipation.
- Nighttime urgency.
- Confusion.
- Clothing difficulty.
- Fear of falling.
- Signs of pain or infection.

Patterns can reveal practical fixes.

## Common Toileting Barriers

### Mobility

The bathroom is too far, the toilet is too low, or transfers are difficult.

### Clothing

Buttons, belts, tight pants, or compression garments slow the person down.

### Memory

The person may not recognize the urge, find the bathroom, or remember the steps.

### Fear

The person may fear falling, being exposed, or being rushed.

### Constipation

Constipation can make toileting more difficult and may worsen discomfort or accidents.

### Nighttime Risk

Bathroom trips at night can increase fall risk.

## Kefiw Tip: Fix The Path Before Blaming The Person

Before assuming the person waits too long, check:

- Is the bathroom easy to find?
- Is the path lit?
- Is the toilet height safe?
- Are grab bars present?
- Is clothing easy to remove?
- Is the walker close by?
- Is there enough time?
- Is the caregiver rushing?

## Supplies To Consider

Depending on need:

- Disposable briefs or pads.
- Waterproof mattress cover.
- Skin barrier cream.
- Gloves.
- Wipes.
- Extra clothing.
- Bedside commode.
- Urinal.
- Raised toilet seat.
- Grab bars.
- Night lights.
- Laundry plan.

## What Families Often Miss

Incontinence is not only a laundry issue. It can cause shame, withdrawal, odor concerns, skin breakdown, caregiver stress, nighttime sleep loss, and facility placement pressure.

It should be discussed with a health professional, especially when new, worsening, painful, or associated with confusion, fever, blood, constipation, or major change.

## Family Script

"This is not your fault, and we do not need to be embarrassed. Let's make the bathroom easier, the routine more predictable, and talk with the doctor about what might be causing the change."

## Red Flags

- New or sudden incontinence.
- Pain, burning, fever, blood, or new confusion.
- Skin breakdown.
- Repeated nighttime falls.
- The caregiver cannot safely transfer the person.
- The person hides accidents.
- The home smells strongly of urine despite cleaning.
- Family avoids discussing it because it feels embarrassing.

## Checklist

- Track toileting patterns.
- Improve bathroom path lighting.
- Check toilet height.
- Add grab bars if appropriate.
- Simplify clothing.
- Stock supplies.
- Protect mattress and chair surfaces.
- Watch skin condition.
- Talk with a health professional about new or worsening symptoms.
- Add paid help if toileting support becomes unsafe or exhausting.`,
      'clinician, occupational therapist, continence nurse',
      [SOURCE_ALZ_DAILY_CARE, SOURCE_MEDLINE_CONSTIPATION, SOURCE_MEDLINE_DEHYDRATION],
    ),
  },
  {
    id: 'art-care-eating-drinking-mealtime-support',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'eating-drinking-mealtime-support',
    title: 'Eating, Drinking, and Mealtime Support for Older Adults | Kefiw',
    h1: 'Eating, Drinking, and Mealtime Support Guide',
    description:
      'Learn how caregivers can support meals, hydration, appetite, swallowing safety, dementia-related mealtime issues, and nutrition routines.',
    metaDescription:
      'Learn how caregivers can support meals, hydration, appetite, swallowing safety, dementia-related mealtime issues, and nutrition routines.',
    keywords: ['mealtime support older adults', 'caregiver nutrition hydration', 'dementia eating support'],
    intro:
      'Meals are routine, comfort, independence, medication timing, hydration, social connection, and safety.',
    outcomeLine:
      'Mealtime support should check intake, food access, eating ability, swallowing safety, meal timing, hydration, and whether someone actually ate.',
    faq: [
      faq('What should caregivers track at meals?', 'Track what was eaten and drunk, whether food was accessible, whether chewing or swallowing was safe, and which time of day appetite is best.'),
      faq('Does a full refrigerator mean someone is eating?', 'No. Check expired food, unopened meal deliveries, weight changes, difficulty using appliances, trouble opening packages, dental pain, swallowing concerns, and whether the person forgets to eat.'),
      faq('When are swallowing problems a red flag?', 'Coughing during meals, choking, wet voice, unexplained weight loss, trouble eating or drinking enough, recurrent pneumonia, or inability to swallow should prompt medical guidance.'),
    ],
    primaryCta: { href: '/care/guides/caregiver-daily-check-in-log/', label: 'Use Daily Log Guide' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/care/family-care-budget-calculator/', label: 'Family Care Budget Calculator' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

Mealtime support helps answer:

- Is the person eating enough?
- Is the person drinking enough?
- Can they prepare food safely?
- Can they chew and swallow safely?
- Do they need help opening containers or cutting food?
- Does memory loss affect meals?
- Are meals tied to medication timing?

MedlinePlus notes that older adults may need fewer calories while still needing enough nutrients, and that some older adults need more protein.

## The Kefiw Mealtime Check

Track four things:

### 1. Intake

What did the person actually eat and drink?

### 2. Access

Was food available, visible, affordable, and easy to prepare?

### 3. Ability

Could the person chew, swallow, use utensils, open containers, and sit upright?

### 4. Pattern

Is appetite better at breakfast, lunch, dinner, or snacks?

## What Families Often Miss

A full refrigerator does not mean the person is eating.

Check:

- Expired food.
- Unopened meal deliveries.
- Weight changes.
- Empty snack wrappers but no real meals.
- Difficulty using stove or microwave.
- Trouble opening packages.
- Dental pain.
- Swallowing concerns.
- Forgetting to eat.
- Depression or loneliness.

## Kefiw Tip: Use The Visible Meal System

For someone with mild memory or motivation problems:

- Put one ready-to-eat meal at eye level.
- Label it with the day and time.
- Use clear containers.
- Keep simple snacks visible.
- Use a whiteboard: "Lunch is in the fridge: chicken soup."
- Ask a caregiver to verify eaten meals, not just delivered meals.

## Swallowing Safety Note

Difficulty swallowing, or dysphagia, can make it hard to eat or drink enough. MedlinePlus describes dysphagia as the feeling that food or liquid is stuck in the throat or before entering the stomach.

Seek medical guidance for coughing during meals, choking, wet voice after swallowing, unexplained weight loss, recurrent pneumonia, or trouble eating and drinking enough. If food is stuck in the airway and the person is having trouble breathing, call emergency services.

## Dementia Mealtime Support

Try:

- Reduce noise.
- Serve one plate at a time.
- Use contrasting plate colors if helpful.
- Offer finger foods.
- Give simple cues.
- Avoid arguing.
- Sit with the person.
- Keep meal times consistent.
- Watch for fatigue.

## Family Script

"We are not trying to control what you eat. We want to make meals easier, safer, and more predictable so you have enough energy and do not have to struggle."

## Red Flags

- Unexplained weight loss.
- Dehydration concerns.
- Coughing or choking during meals.
- Food left untouched.
- Expired food in the fridge.
- Stove safety concerns.
- Difficulty swallowing.
- New confusion around meals.
- The person forgets whether they ate.
- Caregiver cannot reliably monitor meals.

## Checklist

- Track meals for one week.
- Track fluids.
- Check refrigerator and pantry.
- Simplify meal preparation.
- Add meal delivery if needed.
- Add social meals if isolation affects eating.
- Watch for swallowing problems.
- Ask a clinician about weight loss, choking, or hydration concerns.
- Connect meals to medication schedule.
- Reassess if appetite or weight changes.`,
      'clinician, registered dietitian, speech-language pathologist for swallowing sections',
      [SOURCE_MEDLINE_NUTRITION, SOURCE_MEDLINE_SWALLOWING, SOURCE_MEDLINE_DYSPHAGIA, SOURCE_ALZ_DAILY_CARE],
    ),
  },
  {
    id: 'art-care-medication-routine-safety',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'medication-routine-safety',
    title: 'Medication Routine and Safety Guide for Family Caregivers | Kefiw',
    h1: 'Medication Routine and Safety Guide',
    description:
      'Build a safer medication routine with updated medication lists, reminders, pharmacy coordination, side-effect tracking, and caregiver backup.',
    metaDescription:
      'Build a safer medication routine with updated medication lists, reminders, pharmacy coordination, side-effect tracking, and caregiver backup.',
    keywords: ['medication routine caregiver', 'medication safety older adults', 'caregiver medication list'],
    intro:
      'Medication routines can become complicated fast when there are multiple doctors, pharmacies, supplements, old bottles, and hospital discharge changes.',
    outcomeLine:
      'A medication routine should define what is taken, when, why, who prescribed it, who sets it up, who confirms it, and what changes or side effects need follow-up.',
    faq: [
      faq('What belongs on a medication list?', 'Include name, dose, time, reason, prescriber, pharmacy, start date, recent changes, allergies, over-the-counter drugs, vitamins, and supplements.'),
      faq('What is the biggest medication safety mistake families make?', 'Many families keep multiple lists, old bottles, duplicate prescriptions, and unclear discharge instructions instead of one current list and one change log.'),
      faq('Should caregivers stop a medication if it seems to cause side effects?', 'No. Do not stop or change medications without qualified guidance. Call the prescriber, pharmacist, nurse line, or emergency services depending on urgency.'),
    ],
    primaryCta: { href: '/care/guides/medication-management-family-caregivers/', label: 'Medication Management Guide' },
    relatedLinks: [
      { href: '/care/guides/caregiver-emergency-binder/', label: 'Caregiver Emergency Binder' },
      { href: '/care/care-urgency-check/', label: 'Care Urgency Check' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

A medication routine should answer:

- What is taken?
- When is it taken?
- Why is it taken?
- Who prescribed it?
- Who sets it up?
- Who confirms it was taken?
- What side effects should be watched?
- Who is called if something changes?

The FDA recommends that older adults keep a medication list that includes prescription drugs, over-the-counter medicines, vitamins, and supplements. It also notes that some side effects can mimic other health problems, such as memory problems, dizziness, or sleepiness.

## The Kefiw Medication Routine

### Step 1: Create One Current Medication List

Include:

- Name.
- Dose.
- Time.
- Reason.
- Prescriber.
- Pharmacy.
- Start date.
- Recent changes.
- Allergies.
- OTC drugs.
- Vitamins.
- Supplements.

### Step 2: Create One Setup System

Options:

- Pill organizer.
- Pharmacy packaging.
- Medication chart.
- Reminder app.
- Caregiver confirmation.
- Locked medication box if needed.

### Step 3: Create One Change Log

Track:

- Date.
- Medication changed.
- Who changed it.
- Why.
- What to watch.
- Follow-up date.

### Step 4: Create One Backup Process

If the primary caregiver is unavailable, who knows the routine?

## What Families Often Miss

Medication safety is not only about remembering pills.

It is also about:

- Duplicate medications.
- Old prescriptions.
- Drug interactions.
- Side effects.
- Pharmacy delays.
- Medication changes after hospitalization.
- Different doctors not seeing the full list.
- Caregiver uncertainty.
- The person taking medications from old bottles.

CDC's STEADI-Rx resources emphasize medication review as part of reducing fall risk because some medications can affect balance, thinking, alertness, and reaction time.

## Kefiw Tip: Use A Brown Bag Plus Photo Review

Before an appointment:

- Put every medication bottle, supplement, and OTC product in a bag, or photograph each label.
- Bring the current list.
- Bring the change log.
- Ask: "Could any of these contribute to dizziness, confusion, sleepiness, constipation, or falls?"

Do not stop or change medications without professional guidance.

## Family Script

"We want to review the full medication picture, including prescriptions, supplements, and over-the-counter products, because we are seeing changes in dizziness, confusion, sleep, or falls."

## Red Flags

- Multiple medication lists exist.
- Old medications remain in use.
- The person cannot explain what they take.
- New confusion, dizziness, sleepiness, or falls appear after medication changes.
- Several doctors prescribe without one shared list.
- The caregiver is unsure whether medication was taken.
- Refills run out unexpectedly.
- Hospital discharge medication changes are unclear.

## Checklist

- Create one medication list.
- Include OTC drugs and supplements.
- Set up reminder or packaging system.
- Track medication changes.
- Keep pharmacy contact visible.
- Ask about side effects.
- Review after hospitalization.
- Review after falls or confusion.
- Share list with backup caregiver.
- Never stop or change medication without qualified guidance.`,
      'pharmacist, clinician',
      [SOURCE_FDA_MEDICATION_SAFETY, SOURCE_CDC_STEADI_RX, SOURCE_CDC_CARE_PLAN],
    ),
  },
  {
    id: 'art-care-mobility-transfers-walking-safety',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'mobility-transfers-walking-safety',
    title: 'Mobility, Transfers, and Walking Safety for Family Caregivers | Kefiw',
    h1: 'Mobility, Transfers, and Walking Safety Guide',
    description:
      'Learn how families can think about walking, transfers, assistive devices, fall risk, caregiver body safety, and when to ask for professional help.',
    metaDescription:
      'Learn how families can think about walking, transfers, assistive devices, fall risk, caregiver body safety, and when to ask for professional help.',
    keywords: ['mobility transfers caregiver', 'walking safety older adult', 'caregiver transfer safety'],
    intro:
      'Mobility support is one of the clearest places where love can become unsafe if a caregiver is lifting, pulling, or rushing.',
    outcomeLine:
      'The core question is whether the caregiver can help the person move safely without unsafe lifting. If not, the plan needs professional review.',
    faq: [
      faq('What counts as mobility support?', 'Mobility support includes standing from a chair, getting out of bed, walking, stairs, bathroom trips, car transfers, assistive device use, and transfers to a toilet, bed, or shower chair.', 'definition'),
      faq('What should family watch during mobility?', 'Watch for furniture-walking, trouble standing, shuffling, near-falls, dizziness, new weakness, leaning, fear of walking, or trouble using a cane or walker.'),
      faq('When should a caregiver stop helping and ask for help?', 'Stop when the caregiver has to lift, pull, catch, or support more weight than is safe. Ask for PT, OT, clinician, or paid-care support.'),
    ],
    primaryCta: { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Use Home Safety Checklist' },
    relatedLinks: [
      { href: '/care/caregiver-hours-calculator/', label: 'Caregiver Hours Calculator' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

Mobility support includes:

- Standing from a chair.
- Getting out of bed.
- Walking.
- Using stairs.
- Getting to the bathroom.
- Getting in and out of a car.
- Using a cane, walker, or wheelchair.
- Transferring to a toilet, shower chair, or bed.

## The Kefiw Mobility Safety Question

Before helping someone move, ask:

"Can I help this person move safely without lifting them?"

If the answer is no, stop and get professional guidance.

Family caregivers should not be forced into unsafe lifting.

## Common Mobility Warning Signs

Watch for:

- Furniture-walking.
- Reaching for walls.
- Trouble standing.
- Shuffling.
- Near-falls.
- Dizziness.
- New weakness.
- Leaning.
- Fear of walking.
- Difficulty using stairs.
- Trouble getting in and out of bed.
- Trouble getting on and off the toilet.
- Refusing to use a walker or cane.

## What Families Often Miss

A person may be mobile in one setting and unsafe in another.

They may walk well in the hallway but struggle:

- At night.
- In the bathroom.
- On carpet.
- On stairs.
- In parking lots.
- When tired.
- When carrying something.
- After medication.
- After illness.

Mobility should be assessed in the actual daily routine, not only when everyone is watching.

## Kefiw Tip: Watch The First Three Steps

Many mobility risks appear in the first three steps after standing.

Watch for:

- Dizziness.
- Swaying.
- Grabbing.
- Freezing.
- Rushing.
- Confusion.
- Trouble finding the walker.

A pause after standing can reduce risk.

## Assistive Device Note

A cane or walker only helps if it is the right device, adjusted correctly, used consistently, and available where needed.

Ask a physical therapist or qualified clinician if:

- The device seems too high or low.
- The person abandons it.
- The person trips over it.
- The person still falls.
- The person uses furniture instead.

## Family Script

"I want to help you move, but I do not want either of us hurt. Let's ask for a physical therapy or safety review before I keep lifting or pulling."

## Red Flags

- The caregiver lifts under the arms.
- The person falls more than once.
- Transfers require two people but only one is available.
- Bathroom transfers are unsafe.
- The person is dizzy when standing.
- The person refuses a needed walker or cane.
- The caregiver has back pain from helping.
- Mobility worsened suddenly.

Sudden weakness, sudden inability to walk, severe dizziness, chest pain, stroke-like symptoms, or serious injury should be treated as urgent or emergency concerns.

## Checklist

- Watch standing from chair.
- Watch walking path.
- Check bathroom transfers.
- Check bed transfers.
- Check stairs.
- Check car transfers.
- Keep assistive device nearby.
- Remove trip hazards.
- Ask for PT/OT evaluation when needed.
- Add paid help if transfers are unsafe for family.`,
      'physical therapist, occupational therapist, clinician',
      [SOURCE_CDC_CAREGIVER_FALLS, SOURCE_CDC_FALL_RESOURCES],
    ),
  },
  {
    id: 'art-care-fall-prevention-daily-routine',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'fall-prevention-daily-routine',
    title: 'Fall Prevention Daily Routine for Older Adults and Caregivers | Kefiw',
    h1: 'Fall Prevention Daily Routine Guide',
    description:
      'Use a daily fall prevention routine to check lighting, medications, footwear, bathroom safety, mobility, hydration, and supervision needs.',
    metaDescription:
      'Use a daily fall prevention routine to check lighting, medications, footwear, bathroom safety, mobility, hydration, and supervision needs.',
    keywords: ['fall prevention daily routine', 'older adult fall prevention caregiver', 'daily fall risk checklist'],
    intro:
      'Fall prevention is not one grab bar or one walker. It is a daily routine that notices risk before the fall happens.',
    outcomeLine:
      'A daily fall scan checks footwear, lighting, walking paths, medication effects, dizziness, hydration, assistive device use, transitions, and nighttime risk.',
    faq: [
      faq('What should a daily fall prevention routine check?', 'Check footwear, lighting, walking paths, bathroom safety, medication effects, dizziness, hydration, meals, assistive devices, nighttime path, and supervision needs.'),
      faq('Where do many falls happen?', 'Many falls happen during transitions: getting out of bed, standing from a chair, going to the bathroom, turning, rushing, carrying items, or walking in dim light.'),
      faq('When should falls be escalated?', 'Escalate after repeated falls, head injury, new confusion, dizziness, injury, hidden falls, medication changes, or when a caregiver cannot safely help after a fall.'),
    ],
    primaryCta: { href: '/care/care-urgency-check/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/home-safety-checklist-older-adults/', label: 'Home Safety Checklist' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

A fall prevention routine checks:

- Feet and footwear.
- Lighting.
- Walking path.
- Bathroom safety.
- Medication effects.
- Dizziness.
- Hydration and meals.
- Assistive device use.
- Strength and balance.
- Nighttime risk.
- Supervision needs.

CDC's STEADI resources are designed to help prevent older adult falls and include clinical tools such as medication review and fall-risk screening.

## The Kefiw Daily Fall Scan

### Morning

Ask:

- Did the person sleep poorly?
- Are they dizzy?
- Are they wearing safe shoes?
- Is the walker or cane within reach?
- Are medications causing sleepiness?
- Is the path clear?

### Midday

Ask:

- Has the person eaten and had fluids?
- Are they tired?
- Are they rushing?
- Is the bathroom path clear?
- Are cords or clutter creating risk?

### Evening

Ask:

- Is confusion worse?
- Are lights on?
- Is the bedroom-to-bathroom path safe?
- Is the phone or alert device nearby?
- Are rugs secure?

## What Families Often Miss

Falls often happen during transitions:

- Getting out of bed.
- Standing from a chair.
- Going to the bathroom.
- Turning.
- Carrying items.
- Rushing to answer the phone.
- Walking in dim light.
- Getting into a car.

Focus on transitions, not only walking.

## Kefiw Tip: Create A No-Rushing Rule

Many falls happen when a person hurries.

Use:

"Pause, stand, breathe, then step."

Put it on a small sign near the bed or favorite chair if helpful.

## Medication And Fall Risk

Medication changes, dizziness, sleepiness, confusion, and blood pressure changes can affect fall risk. FDA advises asking a health professional whether new problems such as memory difficulty, dizziness, or sleepiness could be caused by medications.

## Family Script

"We are not trying to limit you. We are trying to make the risky moments safer: standing up, walking to the bathroom, using stairs, and moving at night."

## Red Flags

- Falls or near-falls are increasing.
- The person hides falls.
- The person is dizzy on standing.
- The person walks without a needed device.
- The bathroom is unsafe.
- Nighttime confusion or toileting creates risk.
- Medication changes happened before falls.
- The caregiver cannot safely help after a fall.

## Checklist

- Clear walking paths.
- Improve lighting.
- Check footwear.
- Keep mobility device nearby.
- Add bathroom supports.
- Review medications with a clinician or pharmacist.
- Track falls and near-falls.
- Avoid rushing.
- Check nighttime path.
- Ask for PT/OT review if risk increases.`,
      'physical therapist, occupational therapist, clinician, pharmacist',
      [SOURCE_CDC_STEADI_RX, SOURCE_CDC_FALL_RESOURCES, SOURCE_FDA_MEDICATION_SAFETY],
    ),
  },
  {
    id: 'art-care-dementia-daily-routine',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'dementia-daily-routine',
    title: 'Dementia Daily Routine Guide for Families | Kefiw',
    h1: 'Dementia Daily Routine Guide',
    description:
      'Learn how to build a dementia-aware daily routine with calm transitions, familiar cues, meals, hygiene, movement, safety, and caregiver notes.',
    metaDescription:
      'Learn how to build a dementia-aware daily routine with calm transitions, familiar cues, meals, hygiene, movement, safety, and caregiver notes.',
    keywords: ['dementia daily routine', 'Alzheimer daily care plan', 'dementia caregiver routine'],
    intro:
      'A dementia routine should reduce decisions, surprises, and distress by letting rhythm, cues, and environment do more of the work.',
    outcomeLine:
      'A dementia-aware routine should be predictable, calm, flexible, visual, simple, safety-aware, and built around the person\'s best time of day.',
    faq: [
      faq('What makes a dementia routine different?', 'It should not rely on memory. It uses familiar order, short phrases, visual cues, simple choices, and calm transitions.'),
      faq('Should family remind the person that they already discussed something?', 'Usually not. Instead of saying, "Remember," use cues, routine order, visual placement, and repeated calm phrases.'),
      faq('When should the dementia routine be reassessed?', 'Reassess after wandering, repeated care refusal, worsening evening confusion, falls, medication problems, sleep disruption, or caregiver burnout.'),
    ],
    primaryCta: { href: '/care/memory-care-cost-calculator/', label: 'Estimate Memory Care Cost' },
    relatedLinks: [
      { href: '/care/guides/dementia-wandering-safety/', label: 'Dementia Wandering Guide' },
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

A dementia daily routine should be:

- Predictable.
- Calm.
- Flexible.
- Visual.
- Simple.
- Safety-aware.
- Built around the person's best time of day.

The Alzheimer's Association provides daily care guidance for bathing, dressing, grooming, dental care, communication, activities, and care planning for people living with Alzheimer's or another dementia.

## The Kefiw Dementia Routine Structure

### Morning: Anchor The Day

Use:

- Same wake routine.
- Open curtains.
- Bathroom.
- Wash face.
- Simple clothing choices.
- Breakfast.
- Medication.
- Short walk or movement.
- Calm explanation of the day.

### Afternoon: Reduce Drift

Use:

- Familiar activity.
- Meal or snack.
- Rest period.
- Music, sorting, folding, photo review, or simple task.
- Avoid overstimulation.
- Watch for late-day anxiety.

### Evening: Lower The Demand

Use:

- Simple dinner.
- Lower noise.
- Softer lighting.
- Calm hygiene.
- Bathroom before bed.
- Familiar bedtime cues.
- Reduce complicated conversations.

## What Families Often Miss

A dementia routine should not rely on memory.

Do not say:

"Remember, we talked about this."

Use cues:

- Notes.
- Photos.
- Labels.
- Routine order.
- Repeated calm phrases.
- Visual placement.
- Familiar objects.

## Kefiw Tip: Use Same Words, Same Order

When a task causes distress, use the same short phrase every time.

Example:

"Bathroom, wash hands, clean shirt, breakfast."

Do not explain too much. Repetition can feel safer than logic.

## Communication Note

The Alzheimer's Association says Alzheimer's and other dementias gradually reduce communication ability, and that communication requires patience, understanding, and good listening skills.

## Family Script

"We are going to make the day simpler, not because you are doing anything wrong, but because the routine should do more of the work."

## Red Flags

- Every day feels improvised.
- The person becomes distressed during transitions.
- Bathing, meals, or medication repeatedly fail.
- Wandering or exit-seeking appears.
- The caregiver relies on arguing or correcting.
- Evening confusion is worsening.
- The person cannot be left safely alone.
- Family members use different routines and create confusion.

## Checklist

- Identify best time of day.
- Build morning anchor.
- Simplify clothing and meals.
- Add visual cues.
- Reduce late-day demands.
- Use short repeated phrases.
- Track triggers.
- Create wandering safety plan if needed.
- Add caregiver backup.
- Reassess after behavior changes.`,
      'dementia care specialist, clinician, geriatric care manager',
      [SOURCE_ALZ_DAILY_CARE, SOURCE_ALZ_DAILY_CARE_PLAN, SOURCE_ALZ_COMMUNICATION, SOURCE_NIA_ALZ_CARE],
    ),
  },
  {
    id: 'art-care-sundowning-evening-confusion',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'sundowning-evening-confusion',
    title: 'Sundowning and Evening Confusion Guide for Dementia Caregivers | Kefiw',
    h1: 'Sundowning and Evening Confusion Guide',
    description:
      'Learn how families can respond to late-day confusion, agitation, restlessness, wandering risk, and caregiver stress in dementia care.',
    metaDescription:
      'Learn how families can respond to late-day confusion, agitation, restlessness, wandering risk, and caregiver stress in dementia care.',
    keywords: ['sundowning evening confusion', 'dementia evening agitation caregiver', 'late day confusion dementia'],
    intro:
      'Evenings can become the hardest part of dementia caregiving when confusion, anxiety, pacing, suspicion, or exit-seeking increase.',
    outcomeLine:
      'Evening confusion should be approached by checking triggers and lowering the evening demand before the hardest time arrives.',
    faq: [
      faq('What is sundowning?', 'Sundowning is increased confusion or dementia-related behavior that may happen from dusk through night. It can include anxiety, agitation, pacing, disorientation, or sleep disruption.', 'definition'),
      faq('Should families assume every evening change is dementia?', 'No. Pain, infection, medication effects, hunger, dehydration, constipation, fatigue, poor sleep, overstimulation, or environmental change can worsen confusion.'),
      faq('What should families do before evening confusion starts?', 'Create a 4 p.m. plan: offer snack and fluids, turn on lights, reduce noise, check bathroom needs, start a familiar activity, and avoid new decisions.'),
    ],
    primaryCta: { href: '/care/mind-reset/', label: 'Try Mind Reset' },
    relatedLinks: [
      { href: '/care/stress-check-in/', label: 'Stress Check-In' },
      { href: '/care/guides/dementia-daily-routine/', label: 'Dementia Daily Routine' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

Evening confusion should be approached with two questions:

- What might be triggering distress?
- How can the evening routine become calmer and safer?

The Alzheimer's Association describes sundowning as increased confusion that people living with Alzheimer's and dementia may experience from dusk through night, with symptoms that can include sleep difficulty, anxiety, agitation, hallucinations, pacing, and disorientation.

## The Kefiw Evening Scan

Before responding to behavior, check:

- Hunger.
- Thirst.
- Pain.
- Bathroom need.
- Constipation.
- Fatigue.
- Too much noise.
- Too much clutter.
- Shadows or poor lighting.
- Medication timing.
- Missed nap.
- Change in routine.
- Loneliness.
- Fear.

## Create A Low-Demand Evening

Try:

- Serve dinner before the hardest time.
- Reduce noise.
- Close curtains before reflections appear.
- Turn on lights before dusk.
- Avoid complicated questions.
- Use calm music.
- Offer a familiar activity.
- Keep walking path safe.
- Use bathroom before bed.
- Prepare the caregiver's backup plan.

## What Families Often Miss

The caregiver's tone can become part of the environment.

If the caregiver is panicked, rushed, or argumentative, the person may become more distressed.

This is not blame. It is a reminder that caregivers need support too.

## Kefiw Tip: Make A 4 p.m. Plan

If evenings are hard, start before evening.

At 4 p.m.:

- Offer snack and fluids.
- Turn on lights.
- Reduce noise.
- Start familiar activity.
- Check bathroom.
- Prepare dinner.
- Avoid new decisions.
- Put shoes, coat, keys, or exit cues out of sight if exit-seeking occurs.

## Script When Someone Says "I Want To Go Home"

"You want to feel safe. Tell me about home."

Then redirect:

"Let's sit together and have some tea first."

Avoid arguing about whether they are already home.

## Red Flags

- New sudden confusion.
- Evening confusion worsens quickly.
- Fever, pain, urinary symptoms, dehydration, or medication changes are present.
- Wandering or exit-seeking begins.
- The caregiver cannot keep the person safe.
- Aggression or threats occur.
- The person is not sleeping.
- The family is relying on locked doors without a broader safety plan.

## Checklist

- Track time and triggers.
- Check hunger, thirst, pain, bathroom, and fatigue.
- Turn on lights before dusk.
- Reduce noise.
- Simplify evening routine.
- Use calm repeated phrases.
- Create wandering safety plan.
- Tell the clinician about sudden or worsening changes.
- Add respite if evenings are overwhelming.`,
      'dementia care specialist, clinician, therapist',
      [SOURCE_ALZ_SUNDOWNING, SOURCE_ALZ_COMMUNICATION, SOURCE_MEDLINE_DEHYDRATION],
    ),
  },
  {
    id: 'art-care-refusal-of-care-resistance',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'refusal-of-care-resistance',
    title: 'Refusal of Care Guide: What to Do When an Older Adult Resists Help | Kefiw',
    h1: 'Refusal of Care and Resistance Guide',
    description:
      'Learn how to respond when an older adult refuses bathing, medication, meals, home care, toileting, appointments, or safety support.',
    metaDescription:
      'Learn how to respond when an older adult refuses bathing, medication, meals, home care, toileting, appointments, or safety support.',
    keywords: ['refusal of care older adult', 'caregiver resistance help', 'dementia refuses care'],
    intro:
      'Refusal of care is frustrating, but the first question should be what the refusal is protecting, not how to force compliance.',
    outcomeLine:
      'Refusal may protect control, privacy, dignity, comfort, routine, fear, identity, pain, confusion, or a wish not to be a burden.',
    faq: [
      faq('What can refusal of care mean?', 'It may mean fear, poor timing, confusing communication, an uncomfortable environment, pain, fatigue, infection, medication effects, or loss of control.', 'definition'),
      faq('How should caregivers respond to refusal?', 'Pause, reduce the task size, offer limited real choices, change timing or environment, use calm repeated phrases, and track patterns.'),
      faq('When is refusal of care a red flag?', 'It is a red flag when refusal creates immediate danger, involves high-risk medications, food or fluid refusal, urgent medical care, sudden behavior change, force, or caregiver harm.'),
    ],
    primaryCta: { href: '/care/care-needs-checklist/', label: 'Run Care Needs Checklist' },
    relatedLinks: [
      { href: '/care/mind-reset/', label: 'Mind Reset' },
      { href: '/care/guides/talk-to-parent-about-needing-help/', label: 'Talk To Parent About Help' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

Refusal may protect:

- Control.
- Privacy.
- Dignity.
- Comfort.
- Routine.
- Fear.
- Identity.
- Pain.
- Confusion.
- A wish not to be a burden.

That does not mean every refusal can be accepted. It means the response should begin with curiosity, not force.

## The Kefiw Refusal Detective

Ask:

### Is It Fear?

Fear of falling, pain, embarrassment, strangers, or losing control.

### Is It Timing?

Too early, too late, too rushed, or too tired.

### Is It Communication?

Too many words, too many choices, arguing, or correcting.

### Is It Environment?

Cold bathroom, noisy room, poor lighting, or too many people.

### Is It Physical?

Pain, constipation, hunger, dizziness, fatigue, infection, or medication side effect.

### Is It Identity?

The person feels treated like a patient instead of a person.

## Try Smaller Steps

Instead of:

"You need a shower."

Try:

"Let's wash your hands."

Then:

"Would you like a warm towel?"

Instead of:

"You have to take your medicine."

Try:

"Here is your morning pill with orange juice."

Instead of:

"You need home care."

Try:

"Let's have someone help with laundry this Friday."

## Dementia-Aware Communication

The Alzheimer's Association recommends patience, listening, avoiding arguing or correcting, and using clear communication with people living with dementia.

## Kefiw Tip: Offer Choice Inside The Boundary

Boundary:

"We need to get cleaned up."

Choice:

"Would you like to wash at the sink or use the shower chair?"

Boundary:

"We need medication support."

Choice:

"Would you like pills with water or applesauce, if allowed by the medication instructions?"

Do not offer choices that are not real.

## What Families Often Miss

Resistance often gets worse when the caregiver tries to win.

Winning the argument may lose the care task.

A better goal is:

Lower distress enough for the next safe step.

## Family Script

"I do not want to fight with you. I want to understand what feels wrong about this and find a safer way to do it."

## Red Flags

- Refusal creates immediate danger.
- Medication refusal involves high-risk medications.
- The person refuses food or fluids.
- The person refuses urgent medical care.
- Refusal is new or sudden.
- The caregiver uses physical force.
- The caregiver is being harmed.
- Dementia or delirium may be affecting judgment.

For urgent danger or serious symptoms, seek emergency or professional medical help.

## Checklist

- Pause before arguing.
- Identify what the refusal may be protecting.
- Reduce the task size.
- Offer limited real choices.
- Change timing.
- Change environment.
- Use calm repeated phrasing.
- Track refusal patterns.
- Ask a clinician about sudden or dangerous refusal.
- Add professional support if family care becomes unsafe.`,
      'dementia care specialist, clinician, therapist',
      [SOURCE_ALZ_COMMUNICATION, SOURCE_ALZ_BATHING, SOURCE_FDA_MEDICATION_SAFETY],
    ),
  },
  {
    id: 'art-care-constipation-hydration-bathroom-patterns',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'constipation-hydration-bathroom-patterns',
    title: 'Constipation, Hydration, and Bathroom Patterns in Older Adult Care | Kefiw',
    h1: 'Constipation, Hydration, and Bathroom Pattern Guide',
    description:
      'Learn how caregivers can track constipation, hydration, bathroom routines, appetite, medication changes, and warning signs without replacing medical care.',
    metaDescription:
      'Learn how caregivers can track constipation, hydration, bathroom routines, appetite, medication changes, and warning signs without replacing medical care.',
    keywords: ['constipation hydration older adult care', 'bathroom pattern log caregiver', 'dehydration constipation caregiver'],
    intro:
      'Bathroom patterns are care information because constipation, hydration, appetite, medication changes, pain, and mobility can affect the whole day.',
    outcomeLine:
      'Caregivers should not diagnose bathroom issues, but they can track patterns that help the medical team see what changed.',
    faq: [
      faq('What should a bathroom pattern log include?', 'Record bowel movements, fluid intake, appetite, medication changes, pain, mobility, toileting accidents, confusion, sleep, and new symptoms.'),
      faq('Can constipation look like behavior?', 'Yes. Discomfort may show up as irritability, restlessness, lower appetite, confusion, resistance to toileting, poor sleep, or accidents.'),
      faq('When should bathroom changes be escalated?', 'Ask for medical guidance for new or severe constipation, blood, severe abdominal pain, vomiting, fever, new confusion, dehydration concerns, inability to eat or drink, ongoing diarrhea, repeated accidents, or major change from baseline.'),
    ],
    primaryCta: { href: '/care/care-urgency-check/', label: 'Use Care Urgency Check' },
    relatedLinks: [
      { href: '/care/guides/toileting-incontinence-care/', label: 'Toileting and Incontinence Guide' },
      { href: '/care/guides/medication-routine-safety/', label: 'Medication Routine Guide' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

Caregivers should not diagnose bathroom issues, but they can track patterns and help the medical team see what is changing.

Track:

- Bowel movements.
- Fluid intake.
- Appetite.
- Medication changes.
- Pain.
- Mobility.
- Toileting accidents.
- Confusion.
- Sleep.
- New symptoms.

## The Kefiw Bathroom Pattern Log

Record:

- Date and time.
- Bowel movement: yes/no.
- Stool pattern if the clinician asks.
- Pain or straining.
- Fluid intake.
- Fiber-rich foods.
- Walking or movement.
- New medications.
- Laxatives or stool softeners if prescribed.
- Accidents.
- New confusion or discomfort.

MedlinePlus notes that constipation can occur when someone does not get enough fiber, water, or exercise, and that it is important to drink enough water when adding fiber.

## What Families Often Miss

Constipation can look like behavior.

A person may become:

- Irritable.
- Restless.
- Uncomfortable.
- Less hungry.
- More confused.
- Resistant to toileting.
- Unable to sleep.
- More likely to have accidents.

Do not assume the person is being difficult. Check the pattern.

## Hydration Support

Try:

- Keep water visible.
- Offer small amounts often.
- Use preferred cups.
- Offer fluids with meals and medications.
- Include soups, smoothies, fruit, or other fluid-containing foods when appropriate.
- Watch for medical fluid restrictions.

Some people have conditions such as heart failure or kidney disease that require individualized fluid guidance. Always follow the care team's instructions.

## Kefiw Tip: Use Paired Hydration

Pair fluids with existing routines:

- Wake up: water.
- Medication: water.
- Meal: drink.
- Bathroom trip: small drink afterward if appropriate.
- TV show: favorite beverage.
- Bedtime: only if safe and not worsening nighttime toileting.

Pairing works better than telling someone to drink more.

## When To Call A Clinician

Ask for medical guidance if there is:

- New or severe constipation.
- Blood.
- Severe abdominal pain.
- Vomiting.
- Fever.
- New confusion.
- Dehydration concerns.
- Inability to eat or drink.
- Sudden change after medication.
- Ongoing diarrhea.
- Repeated accidents.
- Major change from baseline.

## Family Script

"We are not trying to make bathroom issues embarrassing. We are tracking patterns because changes in fluids, constipation, medication, and toileting can affect the whole care plan."

## Red Flags

- No one knows the bathroom pattern.
- Constipation is treated casually despite discomfort.
- Fluids are low because the person fears accidents.
- Toileting accidents increase suddenly.
- Bathroom trips cause falls.
- The caregiver gives OTC remedies without checking medication interactions or care instructions.
- New confusion appears with bathroom or hydration changes.

## Checklist

- Track bathroom pattern.
- Track fluids.
- Track appetite.
- Track pain or straining.
- Track medication changes.
- Improve bathroom access.
- Ask about constipation at medical visits.
- Follow clinician guidance for laxatives, stool softeners, or diet changes.
- Watch for urgent symptoms.
- Update care plan if toileting affects safety.`,
      'clinician, nurse, registered dietitian',
      [SOURCE_MEDLINE_CONSTIPATION, SOURCE_MEDLINE_DEHYDRATION, SOURCE_MEDLINE_NUTRITION],
    ),
  },
  {
    id: 'art-care-caregiver-daily-check-in-log',
    kind: 'guide',
    section: 'guides',
    guideCategory: DAILY_CARE_CATEGORY,
    slug: 'caregiver-daily-check-in-log',
    title: 'Caregiver Daily Check-In Log: What to Track Each Day | Kefiw',
    h1: 'Caregiver Daily Check-In Log Guide',
    description:
      'Learn what caregivers should track daily, including meals, medication, mood, mobility, bathroom patterns, safety, sleep, appointments, and concerns.',
    metaDescription:
      'Learn what caregivers should track daily, including meals, medication, mood, mobility, bathroom patterns, safety, sleep, appointments, and concerns.',
    keywords: ['caregiver daily log', 'daily check in log caregiver', 'elder care daily notes'],
    intro:
      'A caregiver daily log should not become another burden. It should capture just enough information to notice patterns, update family, and help professionals understand what changed.',
    outcomeLine:
      'The best daily log is short, repeatable, useful, and focused on exceptions, safety, changes, and follow-up.',
    faq: [
      faq('What should a caregiver daily log track?', 'Track meals, fluids, medication, mood, confusion, mobility, falls or near-falls, bathroom patterns, sleep, pain, appointments, concerns, and next steps.'),
      faq('How long should a daily log take?', 'Aim for about three minutes. Track exceptions, changes, unsafe moments, what failed, what worked, and who was notified.'),
      faq('Who can use a caregiver daily log?', 'It can help doctors, home care agencies, facility staff, siblings, long-distance caregivers, insurance documentation, claims, and care planning.'),
    ],
    primaryCta: { href: '/care/caregiver-hours-calculator/', label: 'Calculate Caregiver Hours' },
    relatedLinks: [
      { href: '/care/care-needs-checklist/', label: 'Care Needs Checklist' },
      { href: '/tracks/plan-senior-care/', label: 'Plan Senior Care Track' },
    ],
    longformMarkdown: withDailyCareFooter(
      `## Plain-English Summary

A caregiver daily check-in log helps track:

- Meals.
- Fluids.
- Medication.
- Mood.
- Confusion.
- Mobility.
- Falls or near-falls.
- Bathroom patterns.
- Sleep.
- Pain.
- Appointments.
- Caregiver concerns.
- Next steps.

CDC says care plans can help keep important caregiving information in one place, organize needs, and support consistent care when caregivers change.

## The Kefiw 3-Minute Daily Log

### Basics

- Date.
- Caregiver name.
- Time covered.
- Location.

### Body

- Ate enough? yes/no/unclear.
- Drank enough? yes/no/unclear.
- Medications taken? yes/no/unclear.
- Pain or discomfort? yes/no/notes.
- Bathroom concerns? yes/no/notes.

### Mind And Mood

- Mood: calm / anxious / sad / angry / confused / sleepy.
- Memory or behavior change?
- Any unusual symptoms?

### Mobility And Safety

- Falls?
- Near-falls?
- Dizziness?
- Walker or cane used?
- Unsafe moments?

### Care Notes

- What went well?
- What was hard?
- What needs follow-up?
- Who was notified?

## What Families Often Miss

The log is not only for the caregiver.

It helps:

- Doctors.
- Home care agencies.
- Facility staff.
- Siblings.
- Long-distance caregivers.
- Medicare or insurance claim documentation.
- Long-term care insurance claims.
- Care plan decisions.

## Kefiw Tip: Track Exceptions, Not Every Detail

Do not write a novel.

Focus on:

- What changed.
- What failed.
- What was unsafe.
- What needs follow-up.
- What worked.

Example:

"Ate breakfast and lunch. Refused dinner. More confused after 5 p.m. Nearly fell walking to bathroom. Medication taken. Daughter notified."

That is enough to guide action.

## Family Update Template

Send weekly:

"This week: meals mostly okay, medication reliable, two near-falls in bathroom, worse confusion after dinner, bathing refused twice, caregiver stress high. Recommended next step: bathroom safety review and evening support."

## Red Flags

- No one writes down falls or near-falls.
- Medication uncertainty is repeated.
- Family members disagree because no one has facts.
- Doctors receive vague updates.
- Long-term care insurance claims lack documentation.
- Facility or agency concerns are not tracked.
- Caregiver notes are too detailed and unsustainable.

## Checklist

- Use one shared log.
- Keep it short.
- Track meals, fluids, medication, mood, mobility, bathroom, and safety.
- Record falls and near-falls.
- Record care refusals.
- Record who was notified.
- Review weekly.
- Use patterns to update the care plan.
- Stop tracking items that no one uses.`,
      'geriatric care manager, clinician, caregiver support specialist',
      [SOURCE_CDC_CARE_PLAN, SOURCE_CDC_CAREGIVING_DAILY_TASKS],
    ),
  },
];

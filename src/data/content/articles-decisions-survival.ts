import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_DECISIONS_SURVIVAL: ContentPageConfig[] = [
  // ============================================================
  // RUNWAY ZERO — 3 articles
  // ============================================================
  {
    id: 'art-ds-what-is-runway-zero',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-runway-zero',
    guideCategory: 'Finance & Survival',
    title: 'What Runway Zero Calculates — Your Cash Bankruptcy Date | Kefiw',
    h1: 'What Runway Zero Calculates',
    subhead: 'The exact month cash hits zero at today\'s burn and revenue.',
    outcomeLine: 'Runway Zero answers one question: at current pace, how many months until the bank account is empty?',
    description: 'Runway Zero projects cash balance month-by-month using Cash ÷ (Burn − Revenue). Crisis mode zeroes revenue to model worst-case shock.',
    keywords: ['what is runway', 'cash runway meaning', 'how to calculate runway', 'startup runway calculator', 'bankruptcy date'],
    toneProfile: 'sop',
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'Runway = Cash ÷ (Burn − Revenue)\nCrisis Mode: Runway = Cash ÷ Burn  // revenue forced to 0\nZero Date = today + Runway months',
    },
    logicalGates: [
      'Sum every outflow that clears the bank each month; label total Burn.',
      'Net revenue only — subtract refunds, chargebacks, processor fees before entering.',
      'Divide Cash by (Burn − Revenue). Negative denominator means indefinite; stop.',
      'Run Crisis mode: force revenue to zero; accept that number as the real floor.',
      'If runway < 6 months, cut burn tonight. If < 3, triage bills before anything else.',
    ],
    liveMetrics: [
      { token: 'runway', metric: 'runway_months', fallback: 'runway not calculated', decimals: 1, suffix: ' months' },
    ],
    intro: 'Runway is the months before cash runs out. Runway Zero takes three numbers — cash on hand, monthly burn, monthly revenue — and projects the exact month the balance crosses zero. Crisis mode forces revenue to zero and exposes the worst-case floor. Your current reading: {{lm:runway}}.',
    keyPoints: [
      'Formula: Runway = Cash ÷ (Burn − Revenue). Revenue ≥ burn → runway is indefinite.',
      'Burn is every outflow: salaries, rent, infrastructure, contractors, taxes. If it leaves the bank monthly, include it.',
      'Crisis mode forces revenue to $0. Use it for customer-concentration and market-shock scenarios. Current projection: {{lm:runway}}.',
      'Inputs persist in localStorage on this device. Nothing leaves the browser.',
      'Zero Date is the month projection crosses below zero — the bankruptcy date at current trajectory.',
    ],
    examples: [
      { title: '$250k cash, $65k burn, $22k revenue', body: 'Net burn $43k/month. Runway ≈ 5.8 months ({{lm:runway}} live). Zero date lands roughly 6 months out.' },
      { title: 'Same numbers, Crisis mode on', body: 'Revenue drops to $0. Runway collapses to ~3.8 months ($250k ÷ $65k).' },
      { title: '$100k cash, $10k burn, $15k revenue', body: 'Net positive $5k/month. No Zero Date — runway is indefinite at this pace.' },
    ],
    whenToUse: [
      { toolId: 'runway-zero', note: 'Any time cash position changes materially: new fundraise, big bill, revenue swing, or layoff decision.' },
    ],
    relatedIds: ['runway-zero', 'art-ds-when-to-check-runway', 'art-ds-runway-mistakes'],
    faq: [
      { q: 'Is runway the same as break-even?', a: 'No. Runway is "how long until cash runs out at current burn". Break-even is "at what volume do revenues cover fixed costs". A business can have long runway and no break-even path — or short runway with a clear break-even coming.' },
      { q: 'Should I subtract taxes from revenue?', a: 'Use net revenue (after refunds, chargebacks, payment processor fees). Put quarterly tax payments on the burn side in the month they hit.' },
      { q: 'What counts as "indefinite"?', a: 'Revenue ≥ burn for the current month. The calculator marks it Indefinite — but real businesses should still stress-test with Crisis mode, since indefinite assumes today\'s revenue holds forever.' },
    ],
    thresholds: {
      cyan: 'Runway over 18 months — raise from strength, hire patiently.',
      gold: 'Runway 6-18 months — fundraise window open; cut burn or accelerate revenue.',
      magenta: 'Runway under 6 months — already late; cut deep or accept any terms available.',
    },
    pivotLink: {
      toolId: 'shock-survival',
      note: 'Runway known — now stress-test against a one-time shock expense.',
    },
    pivotSwitch: {
      critical: { toolId: 'bill-triage', note: 'Runway under 3 months. Ranked bill triage buys you weeks; run it tonight.' },
      stable: { toolId: 'leap-date', note: 'Runway clears. Use the surplus to set the Leap Date for the next move.' },
      fallback: { toolId: 'shock-survival', note: 'Stress-test the runway: if income halves, what survives?' },
    },
  },
  {
    id: 'art-ds-when-to-check-runway',
    kind: 'guide',
    section: 'guides',
    slug: 'when-to-check-your-runway',
    guideCategory: 'Finance & Survival',
    title: 'When to Check Your Cash Runway — 6 Triggers | Kefiw',
    h1: 'When to Check Your Cash Runway',
    subhead: 'Six specific moments when recalculating runway changes your next move.',
    outcomeLine: 'Runway is not a dashboard metric — it\'s a trigger-based check. These six moments mean recompute now.',
    description: 'Six situations where runway math changes your decision: fundraise timing, layoffs, big contracts, losing a customer, shock expenses, and hiring plans.',
    keywords: ['when to calculate runway', 'runway triggers', 'cash runway review', 'startup cash management', 'when to cut burn'],
    intro: 'Nobody checks runway weekly. That\'s fine — the number only matters when a decision is pending. But when these six triggers fire, recalculate before you move. Getting them wrong by a month or two is the difference between raising from strength and raising in panic.',
    keyPoints: [
      'Before any raise: you need to know how many months of oxygen you\'re negotiating from. 18+ months means patient money; 6 months means whatever terms you can get.',
      'Before a hire: add the fully-loaded cost (salary + benefits + overhead) to burn and see how much runway it costs you. A $120k hire at 30% loading is ~$13k/month.',
      'After losing a customer: subtract the lost revenue and see if the new Zero Date still fits your plan. Sometimes one departure changes the whole fundraise timeline.',
      'After signing a big contract: model the cash timing — when does the money actually arrive vs. when do you need it? Signed ≠ collected.',
      'Before any shock expense (legal settlement, equipment failure, tax bill): run Crisis mode to see the floor, not just the happy path.',
      'Quarterly regardless: drift is real. Even without a trigger, quarterly runway math catches the slow creep of cost growth.',
    ],
    examples: [
      { title: 'Fundraise timing', body: '12 months runway means a 6-month fundraise window. 6 months runway means you\'re already late. Knowing which bucket you\'re in changes who you pitch and how.' },
      { title: 'Big hire decision', body: 'Adding one senior engineer at $180k loaded cost is $15k/mo — at current burn that\'s potentially 2 months of runway. Is the hire worth 2 months of oxygen?' },
      { title: 'Customer loss shock', body: 'A $20k/month customer leaves. If your revenue was $60k, you lost a third. Recompute — the Zero Date likely moved forward by 3-4 months.' },
    ],
    whenToUse: [
      { toolId: 'runway-zero', note: 'At every trigger above. Save the snapshot — it informs the next decision.' },
      { toolId: 'shock-survival', note: 'When the trigger is a shock expense, stress-test specifically.' },
    ],
    relatedIds: ['runway-zero', 'shock-survival', 'art-ds-what-is-runway-zero', 'art-ds-runway-mistakes'],
    faq: [
      { q: 'How often is too often?', a: 'Weekly runway checks are anxiety, not management. Monthly max, tied to actual cash movement. Daily is a sign something is wrong with the underlying business.' },
      { q: 'Does revenue growth save the runway?', a: 'Only if cash-in-hand grows faster than cash-out-the-door. Fast-growing businesses often have worse runway because growth consumes working capital. Watch cash, not revenue.' },
    ],
  },
  {
    id: 'art-ds-runway-mistakes',
    kind: 'guide',
    section: 'guides',
    slug: 'runway-calculation-mistakes',
    guideCategory: 'Finance & Survival',
    title: 'Six Runway Calculation Mistakes That Cost You Months | Kefiw',
    h1: 'Six Runway Calculation Mistakes',
    subhead: 'The common errors that make runway look longer than it actually is.',
    outcomeLine: 'Runway errors almost always run in one direction — more optimistic than reality. Here are the six to fix first.',
    description: 'Common runway calculation mistakes: ignoring quarterly taxes, counting unpaid invoices as revenue, forgetting annual contracts, and using gross revenue.',
    keywords: ['runway calculation mistakes', 'cash runway errors', 'burn rate mistakes', 'runway planning', 'startup cash mistakes'],
    intro: 'Runway math seems simple — cash ÷ net burn — until you\'re wrong by 3 months and a quarterly tax bill lands. The mistakes below all push the Zero Date later than reality. Fixing them costs nothing and surfaces time you didn\'t know you were losing.',
    keyPoints: [
      'Counting booked revenue as cash. Signed contracts and sent invoices are not money in the bank. Use collected revenue only — or model the aging gap explicitly.',
      'Forgetting quarterly and annual lumps. Estimated taxes, annual SaaS renewals, insurance premiums, and audit fees don\'t appear in monthly averages. Amortize them into burn.',
      'Using gross instead of net revenue. Payment processor fees (2-3%), chargebacks, refunds, and platform cuts reduce the number. For SaaS, especially, NET is what funds the runway.',
      'Ignoring customer concentration. If one customer is 40% of revenue, the "normal" runway calculation is a lie — your real runway is the Crisis-mode number, weighted by their renewal probability.',
      'Assuming flat burn. Burn grows silently: tool upgrades, seat additions, cost-of-living raises, AWS bills. Last quarter\'s burn is usually 5-10% below this quarter\'s.',
      'Not modeling payroll timing. If payroll lands on the 15th and rent on the 1st, mid-month cash can be dangerously low even if month-end looks fine. The Zero Date might be earlier than the monthly model shows.',
    ],
    examples: [
      { title: 'The invoice gap', body: '$40k "revenue" in month 3 → $40k collected in month 5. If runway planning assumes month-3 cash, you\'re 60 days off.' },
      { title: 'The quarterly tax', body: 'Monthly burn looks like $50k. Q4 estimated tax adds $30k in December. Runway at December looks fine; January might not.' },
      { title: 'The flat-burn lie', body: 'Baseline set in January: $45k burn. By July: $52k burn (silent tool adds, raises, AWS creep). Runway projected from January is already 2 months too long.' },
    ],
    whenToUse: [
      { toolId: 'runway-zero', note: 'Input NET revenue and TRUE burn after amortizing lumpy costs.' },
      { toolId: 'leak-detection', note: 'Use Subscription Purge to surface the silent monthly creep in tool costs.' },
    ],
    relatedIds: ['runway-zero', 'leak-detection', 'art-ds-what-is-runway-zero', 'art-ds-when-to-check-runway'],
    faq: [
      { q: 'Should I include founder salary in burn?', a: 'Yes, at market rate. Deferred-salary math distorts runway — it looks longer than it is, and the deferred liability compounds when you raise.' },
      { q: 'Can I use projected revenue growth?', a: 'Not for runway math. Projections are a separate model; runway uses current reality. If you want to show projected runway, label it clearly — never confuse the two.' },
    ],
  },
];

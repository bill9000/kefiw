import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_TRIAD_SCENARIOS: ContentPageConfig[] = [
  // ============================================================
  // RUNWAY-ZERO SCENARIOS (3)
  // ============================================================
  {
    id: 'art-scen-runway-after-layoff',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'runway-after-layoff',
    guideCategory: 'Scenarios · Runway Zero',
    toneProfile: 'sop',
    title: 'Runway Zero After a Corporate Layoff — Severance, UI, and the 90-Day Window | Kefiw',
    h1: 'Runway Zero After a Corporate Layoff',
    subhead: 'Mid-level engineer, 12 weeks severance, 6 months UI — how long does the math actually hold?',
    outcomeLine: 'Recompute runway with and without unemployment insurance and mark the 90-day hand-off where severance ends.',
    description: 'Worked example: 38-yo engineer with 12 weeks severance, $2,400/mo UI, $22k emergency fund, $4,100/mo burn. Runway math both with and without UI counted.',
    keywords: ['runway after layoff', 'severance runway math', 'unemployment runway', 'tech layoff cash plan', 'engineer laid off runway'],
    intro: 'Subject: 38-year-old mid-level software engineer, laid off in a 12% workforce cut. Severance: 12 weeks at $6,000 net/mo ($18,000 total). Unemployment: approved at $2,400/mo for 6 months. Emergency fund: $22,000. Monthly burn: $4,100. Runway reading: {{lm:runway}}.',
    keyPoints: [
      'Severance is finite cash — add it to the numerator. UI is monthly income — subtract it from the burn denominator.',
      'Week 12 is the cliff. Severance stops, UI continues — recompute runway the day severance ends.',
      'Current reading: {{lm:runway}}. Below 6 months triggers the cash pivot before the severance cliff, not after.',
      'Do not count UI past its 26-week cap. Treat month 7 onward as emergency fund only.',
      'Every week of delayed offer acceptance = one week of fund drain. Measure offers against the fund curve, not ego.',
    ],
    examples: [
      {
        title: 'Runway WITHOUT UI (worst case)',
        body: 'Cash available = $18,000 severance + $22,000 fund = $40,000. Burn = $4,100/mo. Runway = 40000 / 4100 = 9.76 months. Severance covers weeks 1-12; fund covers the rest.',
      },
      {
        title: 'Runway WITH UI folded into burn',
        body: 'Net burn = $4,100 − $2,400 = $1,700/mo during UI eligibility. Months 1-3 (severance + UI): fund untouched. Months 4-6: fund drains at $1,700/mo = $5,100. Months 7+: fund drains at $4,100/mo from remaining $16,900 = 4.1 months. Total: 10.1 months.',
      },
      {
        title: 'The 90-day decision',
        body: 'At day 90, severance ends. If no offer signed, the burn rate jumps from net-zero to $1,700/mo. Pre-commit the cash pivot (downgrade COBRA, pause 401k match replacement, freeze subscriptions) before the cliff, not after.',
      },
    ],
    whenToUse: [
      { toolId: 'runway-zero', note: 'Enter severance as cash, UI as income offset. Recompute at week 12 and week 26.' },
    ],
    relatedIds: ['runway-zero', 'shock-survival', 'bill-triage'],
    faq: [
      {
        q: 'Should I delay filing UI to save benefit weeks?',
        a: 'No. File the week you are separated. Benefit weeks are calendar-bounded; delaying filing burns them. Severance reduces weekly UI in some states — check the offset rule before deciding, but always file.',
      },
      {
        q: 'Does severance count as income for UI?',
        a: 'State-dependent. Roughly half of US states count lump-sum severance as wages and delay UI start. Half treat it as post-separation pay and allow immediate UI. Read the determination letter, then rerun the math.',
      },
      {
        q: 'When do I accept a below-market offer?',
        a: 'When fund runway without UI drops below 3 months. Above that, negotiate. Below it, the math stops being about comp and starts being about cliff avoidance.',
      },
    ],
    thresholds: {
      cyan: 'Runway above 9 months with UI counted — negotiate, interview selectively, protect fund.',
      gold: 'Runway 4–9 months — widen offer aperture, cut two largest discretionary line items.',
      magenta: 'Runway below 4 months — accept next viable offer, trigger bill triage, stop fund bleed.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'cash_available = severance_total + emergency_fund\nnet_burn_with_UI = monthly_burn − UI_monthly\nrunway_no_UI = cash_available / monthly_burn\nrunway_with_UI = (severance_months) + (fund / net_burn_with_UI)\ncliff_date = today + severance_weeks',
    },
    logicalGates: [
      'Confirm severance schedule (lump sum vs payroll continuation) and UI determination letter.',
      'Compute runway both with and without UI. The gap is the UI-extension value.',
      'Mark cliff_date = severance_weeks from today. Calendar the recompute.',
      'If runway_no_UI below 6 months, begin bill triage now, not at the cliff.',
      'At runway {{lm:runway}}, apply threshold band to decide offer acceptance aperture.',
    ],
    liveMetrics: [
      { token: 'runway', metric: 'runway_months', fallback: 'runway unset', decimals: 1, suffix: ' months' },
    ],
    pivotSwitch: {
      critical: { toolId: 'bill-triage', note: 'Below 4 months. Triage fixed costs this week, accept next viable offer.' },
      stable: { toolId: 'crossover-calculator', note: 'Above 9 months. Evaluate total comp of pending offers against prior role.' },
      fallback: { toolId: 'shock-survival', note: 'Baseline survival efficiency against the new burn number.' },
    },
  },

  {
    id: 'art-scen-runway-freelancer-gap',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'runway-freelancer-between-contracts',
    guideCategory: 'Scenarios · Runway Zero',
    toneProfile: 'sop',
    title: 'Runway Zero for a Freelancer Between Contracts | Kefiw',
    h1: 'Runway Zero for a Freelancer Between Contracts',
    subhead: 'Contractor, $14k in checking, quarterly tax due in 5 weeks, pipeline 6–10 weeks out.',
    outcomeLine: 'Subtract pending tax from usable cash before computing runway, then decide whether a below-floor gig buys time or debt.',
    description: 'Freelancer scenario: $14k cash, $3,200/mo burn, $2,800 quarterly tax due in 5 weeks, next contract 6-10 weeks out. Real runway after tax earmark.',
    keywords: ['freelancer runway', 'between contracts cash', 'freelance quarterly tax', 'contractor gap runway', 'freelancer minimum viable rate'],
    intro: 'Subject: independent contractor, two-year track record, last contract ended Friday. Checking balance: $14,000. Monthly burn: $3,200. Quarterly estimated tax due in 5 weeks: $2,800. Pipeline: two prospects, earliest start 6 weeks, latest 10 weeks. Current runway: {{lm:runway}}.',
    keyPoints: [
      'Pending tax is not runway. Earmark it before dividing — otherwise the IRS eats next month.',
      'Freelancer runway is the min of pipeline-delivery-date and cash-depletion-date.',
      'Current reading: {{lm:runway}}. A below-MVR gig is only worth taking if it buys more days than it costs in opportunity.',
      'Do not raise rates on the current prospect to cover the gap. Rate negotiations that smell like desperation fail.',
      'A 4-week gap is survivable on $14k. An 8-week gap plus tax is not.',
    ],
    examples: [
      {
        title: 'Usable cash after tax earmark',
        body: 'Gross cash $14,000 − $2,800 tax = $11,200 usable. Burn $3,200/mo = 3.5 months runway on paper. But tax is due in 5 weeks, so real horizon is: 5 weeks at $3,200/mo = $3,700 spent, then $2,800 tax hit, then $7,500 left / $3,200 = 2.3 more months. Total: 3.5 months — same answer, different calendar shape.',
      },
      {
        title: 'Pipeline-lower-bound gap',
        body: 'Earliest contract start: 6 weeks. Invoice net-30 after that. First cash lands at week 10. Runway required: 10 weeks × $3,200/mo = $8,000 + $2,800 tax = $10,800. Margin over $11,200 usable: $400. Functionally zero.',
      },
      {
        title: 'Below-MVR gig decision',
        body: 'MVR is $95/hr. Gig offer: $60/hr × 40hr/wk for 3 weeks = $7,200 gross, ~$5,500 after SE tax. Buys 1.7 months of runway and pushes pipeline follow-up from slack to distracted. Accept only if pipeline slips past week 10.',
      },
    ],
    whenToUse: [
      { toolId: 'runway-zero', note: 'Subtract tax earmark from cash before entering — not after.' },
    ],
    relatedIds: ['runway-zero', 'minimum-viable-rate', 'shock-survival'],
    faq: [
      {
        q: 'Should I pay the quarterly tax late to preserve runway?',
        a: 'No. Underpayment penalty + interest runs ~8% annualized plus a 0.5%/mo penalty. Cheaper to take a short 0% APR credit line for burn than skip the tax payment and compound fees.',
      },
      {
        q: 'How do I price a rush gig without signaling desperation?',
        a: 'Quote MVR flat and add a rush multiplier (1.25–1.5×) with a finish date. Desperate pricing is discounting; confident pricing is charging more for speed.',
      },
    ],
    thresholds: {
      cyan: 'Runway above 4 months after tax earmark and pipeline lower bound — negotiate normally.',
      gold: 'Runway 2–4 months — accept pipeline prospect at posted rate, defer below-MVR gig.',
      magenta: 'Runway below 2 months — take the below-MVR gig, triage subscriptions, compress tax earmark.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'usable_cash = checking − pending_tax\nrunway_cash = usable_cash / monthly_burn\npipeline_weeks = earliest_start + invoice_net_terms\nruntime = min(runway_cash, pipeline_weeks × burn_weekly)',
    },
    logicalGates: [
      'Earmark pending tax in a second account or ledger column. Out of sight, out of burn.',
      'Map pipeline earliest/latest start and net terms onto the calendar.',
      'Compute runway as min(cash_horizon, pipeline_cash_arrival).',
      'If runway {{lm:runway}} is below 2 months, price below-MVR gig against opportunity cost of follow-up.',
      'Re-run at each pipeline status change (yes/no/slip), not weekly.',
    ],
    liveMetrics: [
      { token: 'runway', metric: 'runway_months', fallback: 'runway unset', decimals: 1, suffix: ' months' },
    ],
    pivotSwitch: {
      critical: { toolId: 'minimum-viable-rate', note: 'Below 2 months. Recompute MVR honestly, accept gigs at or above it, below only if gap is structural.' },
      stable: { toolId: 'crossover-calculator', note: 'Above 4 months. Use the slack to evaluate W-2 vs freelance cross-over before the next gap.' },
      fallback: { toolId: 'bill-triage', note: 'Trim two largest discretionary lines immediately; they buy days the gig cannot.' },
    },
  },

  {
    id: 'art-scen-runway-founder-burn',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'runway-zero-founder-burn',
    guideCategory: 'Scenarios · Runway Zero',
    toneProfile: 'sop',
    title: 'Runway Zero for a Founder Burning Seed | Kefiw',
    h1: 'Runway Zero for a Founder Burning Seed',
    subhead: 'Solo technical founder, two ledgers, one life — company runway vs personal runway.',
    outcomeLine: 'Compute both runways separately. Whichever hits zero first is the real clock.',
    description: 'Founder scenario: $40k cofounder loan, $9k/mo company burn, 10 months to MRR. Personal side: $8k savings, $2,400/mo burn. Dual-ledger math.',
    keywords: ['founder runway', 'startup runway math', 'personal runway founder', 'seed burn calculator', 'solo founder cash'],
    intro: 'Subject: solo technical founder, 14 months post-incorporation. Company: $40,000 outstanding cofounder loan, $9,000/mo burn (AWS $1,600, contractor $5,500, tooling $900, legal/admin $1,000). MRR trajectory: meaningful revenue projected in 10 months. Personal: $8,000 savings, $2,400/mo burn. Founder salary: zero. Runway reading: {{lm:runway}}.',
    keyPoints: [
      'Two ledgers, two runways. A healthy company runway with a dying personal runway is still game-over.',
      'Personal runway dies first in nearly every solo-founder timeline. The MRR date does not care.',
      'Current reading: {{lm:runway}} — this is personal, not company. Company is the separate sheet.',
      'Every month of contractor spend directly trades against founder salary capacity. Price the trade.',
      'Raising a bridge or pausing the contractor are not equivalent — the bridge preserves momentum, the pause preserves personal runway.',
    ],
    examples: [
      {
        title: 'Company runway',
        body: 'Loan balance $40,000. Burn $9,000/mo. Runway = 40000 / 9000 = 4.44 months. MRR target is 10 months out. Gap: 5.6 months of funding that does not exist yet.',
      },
      {
        title: 'Personal runway',
        body: 'Savings $8,000. Personal burn $2,400/mo. Runway = 8000 / 2400 = 3.33 months. Personal hits zero a month before the company does, at month 3.3.',
      },
      {
        title: 'Pause-contractor reallocation',
        body: 'Pause $5,500/mo contractor. Company burn drops to $3,500/mo. Company runway extends to 40000 / 3500 = 11.4 months — clears the MRR target. Founder moves contractor workload onto self. Personal runway still 3.3 months unless founder draws $2,400/mo salary from remaining loan balance: after 3 months of salary ($7,200), loan remaining = $32,800, company burn $3,500 + $2,400 salary = $5,900/mo, company runway from there = 32800 / 5900 = 5.6 months. Total horizon = 3 + 5.6 = 8.6 months. Still short of MRR by ~1.4 months.',
      },
    ],
    whenToUse: [
      { toolId: 'runway-zero', note: 'Run twice — once for the company cap table, once for the household.' },
    ],
    relatedIds: ['runway-zero', 'tech-debt-interest', 'leap-date'],
    faq: [
      {
        q: 'Should I take a part-time consulting gig to extend personal runway?',
        a: 'Yes if it adds 2+ months and costs less than 30% of weekly founder time. Below that ratio, the focus loss kills MRR timeline more than the cash saves personal runway.',
      },
      {
        q: 'Is the cofounder loan real runway or phantom runway?',
        a: 'Real until loan terms force repayment. Check the note. If convertible-on-raise, it is runway; if demand-note on fixed date, subtract from runway on that date.',
      },
      {
        q: 'When do I shut it down?',
        a: 'When personal runway falls below 2 months AND no bridge is closable within 4 weeks. Below that combo, preserving personal cash beats preserving company optionality.',
      },
    ],
    thresholds: {
      cyan: 'Both runways above 6 months — execute, do not re-optimize burn weekly.',
      gold: 'Either runway 3–6 months — cut the largest variable cost, draw minimum founder salary.',
      magenta: 'Either runway below 3 months — pause contractor, close bridge in 4 weeks, or plan shutdown.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'company_runway = loan_balance / company_burn\npersonal_runway = savings / personal_burn\nreal_runway = min(company_runway, personal_runway)\nif founder_salary > 0:\n  company_burn += founder_salary\n  personal_burn -= founder_salary',
    },
    logicalGates: [
      'Separate company ledger from personal ledger. No netting.',
      'Compute company_runway and personal_runway independently.',
      'real_runway = min of the two. That is the clock.',
      'At runway {{lm:runway}}, compare to MRR target date. Gap = amount of bridge or cut required.',
      'If gap > 3 months and no bridge path, run the shutdown math before month 2.',
    ],
    liveMetrics: [
      { token: 'runway', metric: 'runway_months', fallback: 'runway unset', decimals: 1, suffix: ' months' },
    ],
    pivotSwitch: {
      critical: { toolId: 'bill-triage', note: 'Either runway below 3 months. Pause contractor, triage personal bills, close bridge or exit.' },
      stable: { toolId: 'leap-date', note: 'Both above 6 months. Set the MRR leap date and protect focus.' },
      fallback: { toolId: 'tech-debt-interest', note: 'Price the tech debt accrued by pausing contractor work — pay-later always costs more.' },
    },
  },

  // ============================================================
  // DECISION-FATIGUE SCENARIOS (3)
  // ============================================================
  {
    id: 'art-scen-fatigue-job-search',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'decision-fatigue-job-search',
    guideCategory: 'Scenarios · Decision Fatigue',
    toneProfile: 'sop',
    title: 'Decision Fatigue During a Job Search | Kefiw',
    h1: 'Decision Fatigue During a Job Search',
    subhead: 'Six weeks unemployed, four active interviews, twenty micro-decisions before noon.',
    outcomeLine: 'Cap consequential decisions at three per day. Batch the rest. The pipeline survives; the judgment stays intact.',
    description: 'Worked example: unemployed 6 weeks, 4 active interview loops, 20+ daily micro-decisions. The 3-decision-per-day rule for keeping pattern recognition intact.',
    keywords: ['decision fatigue job search', 'interview fatigue', 'unemployed decision fatigue', 'job search cognitive load', '3 decisions per day'],
    intro: 'Subject: candidate 6 weeks into active job search. Four concurrent interview loops at different stages. Daily inbox: 3 recruiter InMails, 2 take-home reminders, 1 scheduling ping, 12+ job posts to triage. Estimated micro-decisions before noon: 20. Current cognitive load: {{lm:load}}.',
    keyPoints: [
      'Judgment is a depleting resource. Hour 9 decisions are measurably worse than hour 2 decisions.',
      'Cap consequential decisions (apply / decline / counter / accept / withdraw) at 3 per day. Queue the rest.',
      'Load reading {{lm:load}} — if high, defer the 3pm salary negotiation to tomorrow 10am.',
      'Recruiter replies, scheduling confirmations, and JD skims are not consequential. Batch to one window.',
      'Pattern-recognition failure shows up as "every offer looks the same." That is the signal to stop deciding for 24 hours.',
    ],
    examples: [
      {
        title: 'Pre-commit the 3 decisions',
        body: 'Sunday evening: list the 3 decisions that must close by Friday. Example: (1) counter offer A by Tue, (2) accept or decline take-home B by Wed, (3) reply to recruiter C with salary range by Thu. Everything else is tactical, not strategic. Protect those three from the noise.',
      },
      {
        title: 'Batch recruiter responses',
        body: '11 new InMails Monday. Rather than 11 decisions across the week, batch to one 45-min block Tuesday 10am: reply-yes to 3, reply-no to 6, archive 2. One decision window, eleven outcomes.',
      },
      {
        title: 'The pattern-failure signal',
        body: 'Thursday 4pm: offers A, B, C all feel "fine." Comp within 8%, culture signals ambiguous, next step all "talk to team." That is fatigue, not indifference. Stop. Resume decision-making Friday 10am after sleep.',
      },
    ],
    whenToUse: [
      { toolId: 'decision-fatigue', note: 'Log load at start of day, again at 3pm. If load shifts from nominal to high, suspend consequential decisions.' },
    ],
    relatedIds: ['decision-fatigue', 'leap-date', 'burnout-monitor'],
    faq: [
      {
        q: 'What if a recruiter demands a same-day answer?',
        a: 'Ninety percent of "same-day" demands are not real. Reply: "I can answer by 10am tomorrow after review." The 10% that are real are recruiters you should not be negotiating with under pressure anyway.',
      },
      {
        q: 'Does this cost me offers?',
        a: 'Rarely. Offers lost to a 24-hour deliberation delay are offers that would not have closed well. Offers lost to fatigue-driven wrong answers are invisible — you never know you took the worse one.',
      },
    ],
    thresholds: {
      cyan: 'Load nominal, 3-decision cap intact — sustain current pace.',
      gold: 'Load rising, more than 3 consequential decisions in queue — batch tactical items, compress low-value interviews.',
      magenta: 'Load high, pattern recognition degraded — suspend consequential decisions for 24 hours.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'daily_decisions = consequential + tactical + micro\ncap: consequential ≤ 3\nbatch_window = 1 block/day for tactical\nif load == high AND queue > cap: defer to next 10am\npattern_recognition_score = offers_distinguished / offers_reviewed',
    },
    logicalGates: [
      'Sunday evening: list the week\'s 3 consequential decisions per day, max 15 for the week.',
      'Morning: confirm today\'s 3. Refuse to exceed.',
      'Batch all tactical items (replies, scheduling, JD triage) to one window.',
      'At 3pm check load {{lm:load}}. If high, queue remaining decisions for tomorrow.',
      'If two days in a row return pattern-recognition failure, pause the search for 48 hours.',
    ],
    liveMetrics: [
      { token: 'load', metric: 'cognitive_load', fallback: 'load unmeasured' },
    ],
    pivotSwitch: {
      critical: { toolId: 'burnout-monitor', note: 'Load high two days running. Switch from search execution to recovery for 48 hours.' },
      stable: { toolId: 'leap-date', note: 'Load nominal. Set the decision date for the top-of-funnel offer.' },
      fallback: { toolId: 'runway-zero', note: 'Runway context decides the aggressiveness of the 3-decision queue.' },
    },
  },

  {
    id: 'art-scen-fatigue-solo-parent',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'decision-fatigue-solo-parent',
    guideCategory: 'Scenarios · Decision Fatigue',
    toneProfile: 'sop',
    title: 'Decision Fatigue for a Solo Parent | Kefiw',
    h1: 'Decision Fatigue for a Solo Parent',
    subhead: 'Two kids under ten, eighty micro-decisions before 9am, 3pm crash on schedule.',
    outcomeLine: 'Pre-commit weekday protocols on Sunday. Rotate four of them. Stop deciding each morning.',
    description: 'Worked example: solo parent, 2 kids under 10, ~80 micro-decisions before 9am, 3pm willpower crash. Sunday pre-commit plus 4-protocol rotation.',
    keywords: ['solo parent decision fatigue', 'single parent cognitive load', 'morning routine decision fatigue', 'parent 3pm crash', 'pre-commit parenting'],
    intro: 'Subject: solo parent, two children (ages 8 and 6), full-time work-from-home. Pre-9am decisions counted across one week: 76, 84, 79, 82, 77 — mean 80. Willpower crash logged daily between 2:45pm and 3:15pm. Load reading: {{lm:load}}.',
    keyPoints: [
      'Eighty decisions before 9am does not mean 80 hard decisions — it means 80 willpower draws. The tank empties anyway.',
      'Pre-commit the weekly menu Sunday. Four rotating protocols beats choosing each day.',
      'Load reading {{lm:load}} — the 3pm crash is predictable, so plan the easy block there, not the hard one.',
      'Kids do not need variety; they need predictability. Rotation satisfies parent boredom, not child need.',
      'Laundry, lunches, and pickup routes are protocol candidates. Birthday gifts and doctor calls are not.',
    ],
    examples: [
      {
        title: 'Sunday 20-minute pre-commit',
        body: 'Sunday 7pm: (1) menu for Mon–Fri dinners locked (protocols A–D on rotation, Friday = pizza), (2) lunches packed and in fridge, (3) clothes for Monday laid out, (4) morning route and drop-off order confirmed. Monday morning decisions: 80 → 22.',
      },
      {
        title: '4-protocol dinner rotation',
        body: 'Protocol A: pasta + jar sauce + frozen peas. B: rice + rotisserie chicken + cucumber. C: breakfast-for-dinner. D: taco bowls. Sunday picks ordering only. No dinner decisions Mon–Thu. Kids complain once, adapt in two weeks.',
      },
      {
        title: 'The 3pm reserve',
        body: 'Crash window is 2:45pm–3:15pm daily. Schedule: snack in the fridge pre-made, screen time approved, no homework push. Hard conversations and doctor calls get moved to 10am, not 3pm. Willpower budget respected rather than fought.',
      },
    ],
    whenToUse: [
      { toolId: 'decision-fatigue', note: 'Log load at 8am, noon, 3pm for one week. The curve argues for itself.' },
    ],
    relatedIds: ['decision-fatigue', 'burnout-monitor', 'bio-fuel'],
    faq: [
      {
        q: 'What about kid preferences — do they get a vote?',
        a: 'Weekend only. Weekdays run protocols; weekends include one kid-choice meal each. Negotiated choice is more expensive than unilateral protocol on a Tuesday at 7am — save it for Saturday.',
      },
      {
        q: 'Does this work if both kids have different schedules?',
        a: 'Better. More schedule constraint means fewer real options, which means protocols are more natural fit. Map the constraint grid on Sunday — most "hard" weekday choices collapse to one viable answer.',
      },
    ],
    thresholds: {
      cyan: 'Load nominal, Sunday pre-commit held — sustain rotation.',
      gold: 'Load rising mid-week, protocols slipping — collapse one evening to Protocol D and rebuild Sunday.',
      magenta: 'Load high, 3pm crash bleeding into 5pm — pull in outside support (grandparent, babysitter, friend) for one afternoon.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'morning_decisions = pre_commit(Sunday) + variable(Monday)\nif pre_commit > 50 items: variable < 25\nprotocol_rotation = 4 options / 5 weekdays\ncrash_window = 14:45 – 15:15\nhard_conversations ∉ crash_window',
    },
    logicalGates: [
      'Sunday evening: pre-commit menu, lunches, clothes, routes for the week.',
      'Monday–Thursday: execute protocol. No re-deciding.',
      'At load {{lm:load}}, route hard conversations to pre-crash (10am), not post-crash.',
      'Friday: freestyle allowed, but pre-commit dinner (default: pizza).',
      'Saturday review: which protocol failed? Rotate it out, swap in a spare.',
    ],
    liveMetrics: [
      { token: 'load', metric: 'cognitive_load', fallback: 'load unmeasured' },
    ],
    pivotSwitch: {
      critical: { toolId: 'burnout-monitor', note: 'Crash window expanding past 5pm two days in a row — recovery, not optimization.' },
      stable: { toolId: 'bio-fuel', note: 'Load nominal. Convert protocol savings into bio-fuel planning for the next week.' },
      fallback: { toolId: 'vimes-utility', note: 'Per-use protocol choices (shoes, lunchboxes, bags) benefit from Vimes math over a year.' },
    },
  },

  {
    id: 'art-scen-fatigue-oncall-engineer',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'decision-fatigue-oncall-engineer',
    guideCategory: 'Scenarios · Decision Fatigue',
    toneProfile: 'sop',
    title: 'Decision Fatigue on an Engineering On-Call Rotation | Kefiw',
    h1: 'Decision Fatigue on an On-Call Rotation',
    subhead: 'Staff engineer, 2am page, 40 minutes into prod debugging — judgment inverts by minute 45.',
    outcomeLine: 'Adrenaline + sleep debt flip reasoning. The rule: never deploy at 3am without a rollback script and a second set of eyes.',
    description: 'Worked example: staff engineer paged at 2am, 40 min into debugging prod. Sleep-debt + adrenaline inversion. The 3am deploy rule and rollback discipline.',
    keywords: ['oncall decision fatigue', 'engineering 3am deploy', 'sleep debt debugging', 'production incident fatigue', 'staff engineer oncall'],
    intro: 'Subject: staff engineer, primary on-call for payment systems. Paged 2:04am Thursday — latency spike, p99 from 120ms to 2,400ms. Forty minutes in, three hypotheses tested, none conclusive. Sleep: 4h20m. Adrenaline: saturating. Load reading: {{lm:load}}.',
    keyPoints: [
      'Adrenaline is not alertness. It narrows attention while inverting risk-assessment.',
      'Minute 45 of an incident at 2am is worse than minute 5. Judgment has cost, not value, at that point.',
      'Load {{lm:load}} — if high, every deploy needs a rollback script and a second on-call named.',
      'Mitigation beats root cause at 3am. Revert, rollback, feature-flag off. Investigate at 10am.',
      '"I think I see it" is the phrase that precedes the outage that outlasts the original.',
    ],
    examples: [
      {
        title: 'The mitigation-first rule',
        body: '2:44am: hypothesis 3 suggests a recent deploy caused the spike. Rather than debug forward, revert. `git revert <sha>` + deploy = 4 minutes. p99 recovers to 140ms by 2:52am. Root cause investigated at 10:30am with rested eyes, second engineer, proper logs.',
      },
      {
        title: 'The rollback-script requirement',
        body: '3:15am hotfix needed. Draft: (1) commit on branch with revert SHA documented, (2) rollback command in the same PR description, (3) second on-call paged to review before deploy. Adds 8 minutes to MTTR. Prevents 8 hours of cascading deploys next morning.',
      },
      {
        title: 'The inversion signal',
        body: '"Let me just tweak this one thing and redeploy." At 2:58am this sentence has a 60% chance of extending the incident. At 10:58am it has a 10% chance. Same engineer, same code — rest state, not skill, is the variable.',
      },
    ],
    whenToUse: [
      { toolId: 'decision-fatigue', note: 'Log load at page start and at 30-minute marks during incident. Escalate at first "high" reading.' },
    ],
    relatedIds: ['decision-fatigue', 'burnout-monitor', 'tech-debt-interest'],
    faq: [
      {
        q: 'What if the incident legitimately requires a forward fix?',
        a: 'Rare. "Requires forward fix" usually means "I do not have a rollback path" — which is an infra gap to close the next business day. At 3am, feature-flag off or revert; forward fix belongs in daylight with a second engineer.',
      },
      {
        q: 'Do I wake the second on-call for every deploy?',
        a: 'For every production write-path deploy between 11pm and 6am, yes. The cost is 10 minutes of their sleep. The cost of not doing it is a second outage built on top of the first, which costs hours for everyone.',
      },
      {
        q: 'How do I know my judgment has inverted?',
        a: 'Signals: skipped a step of your runbook, argued against a teammate who suggested rollback, opened a third terminal tab. Any two of three = stop, rollback, escalate, sleep.',
      },
    ],
    thresholds: {
      cyan: 'Load nominal, incident under 30 min — continue with normal deploy checklist.',
      gold: 'Load rising or incident 30–60 min — mitigation-first, second on-call named before any deploy.',
      magenta: 'Load high or incident past 60 min at 3am — rollback only, no forward fix, investigate in daylight.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'judgment_quality = f(sleep_hours, minutes_in_incident, adrenaline)\ndeploy_allowed = (rollback_script_exists) AND (second_engineer_acked) AND (mitigation_only OR load < high)\nif load == high AND clock ∈ [23:00, 06:00]: forward_fix_denied',
    },
    logicalGates: [
      'At page start: log load, sleep hours, time.',
      'At minute 30: re-check load {{lm:load}}. If high, name second on-call.',
      'Before any deploy: confirm rollback script exists, second engineer acked, mitigation is the target not root cause.',
      'Between 23:00 and 06:00: forward fixes denied unless load nominal AND incident under 30 min.',
      'Post-incident 10am: re-investigate root cause with rest and witnesses.',
    ],
    liveMetrics: [
      { token: 'load', metric: 'cognitive_load', fallback: 'load unmeasured' },
    ],
    pivotSwitch: {
      critical: { toolId: 'burnout-monitor', note: 'Third incident this rotation. Rotation hand-off required; recovery precedes competence.' },
      stable: { toolId: 'tech-debt-interest', note: 'Incident cleared. Price the tech debt that produced the page; schedule payoff in daylight.' },
      fallback: { toolId: 'leap-date', note: 'Plan the post-mortem and fix-ship date; do not leave it open.' },
    },
  },

  // ============================================================
  // BIO-FUEL SCENARIOS (3)
  // ============================================================
  {
    id: 'art-scen-biofuel-snap-month',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'bio-fuel-snap-month',
    guideCategory: 'Scenarios · Bio-Fuel',
    toneProfile: 'sop',
    title: 'Bio-Fuel on a $291 SNAP Month | Kefiw',
    h1: 'Bio-Fuel on a $291 SNAP Month',
    subhead: 'Single adult, $291 benefit, 30 days, 60,000 kcal minimum — per-dollar yield is the whole game.',
    outcomeLine: 'Hit the kcal floor at ~$210 using rice, oats, peanut butter; $81 remaining funds produce and protein variety.',
    description: 'Worked example: single adult SNAP $291/mo, target 60,000 kcal over 30 days. Per-$ kcal yield table and how to hit floor with $81 left for variety.',
    keywords: ['snap food budget math', 'bio fuel snap', 'cheap calories per dollar', 'food stamps 291 month', 'survival grocery plan'],
    intro: 'Subject: single adult receiving $291/mo SNAP benefit (US max for household of 1, FY26). Target: 60,000 kcal over 30 days (2,000 kcal/day × 30). Fridge and pantry start empty. Current survival efficiency: {{lm:eff}}.',
    keyPoints: [
      'Benefit is fixed; calendar is fixed. Per-dollar kcal yield is the only lever.',
      'Staples carry the floor. Rice, oats, peanut butter, dried beans produce 650–1,500 kcal/$. Everything else is variety tax.',
      'Efficiency reading {{lm:eff}} — if low, the cart is over-indexed on produce or protein; rebalance to staples.',
      'Hit the 60,000 kcal floor first, then spend the residual $81 on nutrition quality (eggs, frozen vegetables, canned tuna).',
      'Do not buy in bulk at Costco with SNAP math alone — per-dollar is similar to discount grocers, and the $60 membership ≈ 90,000 kcal of rice.',
    ],
    examples: [
      {
        title: 'Per-$ yield table',
        body: 'Rice, long grain: $0.50/lb, 1,600 kcal/lb → 3,200 kcal/$. Rolled oats: $1.00/lb, 1,680 kcal/lb → 1,680 kcal/$. Peanut butter: $2.50/lb, 2,600 kcal/lb → 1,040 kcal/$. Dried black beans: $1.20/lb, 1,550 kcal/lb → 1,290 kcal/$. Eggs: $0.20/ea, 70 kcal → 350 kcal/$. Pasta: $0.90/lb, 1,630 kcal/lb → 1,810 kcal/$.',
      },
      {
        title: 'Floor build — $210 budget',
        body: '20 lb rice ($10) = 32,000 kcal. 10 lb oats ($10) = 16,800 kcal. 4 lb peanut butter ($10) = 10,400 kcal. 5 lb dried black beans ($6) = 7,750 kcal. 10 lb pasta ($9) = 16,300 kcal. Subtotal $45 cart, 83,250 kcal. Well over 60k floor — so shift to add oil ($4/32oz = 7,840 kcal), canned tomatoes ($8), canned tuna ($12), 24 eggs ($5), frozen broccoli ($6), onions ($3), garlic ($2), spices ($5), total $90. Actually cleared floor at $90; the rest funds real variety.',
      },
      {
        title: 'Residual $200 variety budget',
        body: 'With floor locked at ~$90, residual is $200. Allocate: fresh produce $50, dairy (milk, yogurt, cheese) $40, more protein (ground turkey, chicken thighs, frozen fish) $70, fruit $20, coffee/tea $10, treats $10. Month runs 30 days with variety, not 20 days of rice.',
      },
    ],
    whenToUse: [
      { toolId: 'bio-fuel', note: 'Lock the kcal floor first, then layer variety. Re-run on day 15 to verify pantry burn rate.' },
    ],
    relatedIds: ['bio-fuel', 'calorie-optimizer', 'metabolic-floor'],
    faq: [
      {
        q: 'Does SNAP cover hot food or prepared items?',
        a: 'No. SNAP excludes hot prepared food and restaurant meals (outside Restaurant Meals Program pilots). Plan cart around cold groceries you will cook; $2 on a ready rotisserie chicken is not SNAP-eligible even though the raw chicken next to it is.',
      },
      {
        q: 'Should I buy ethnic-grocery staples for better yield?',
        a: 'Yes. 20 lb rice at an Asian grocer often runs $12–15 vs $18–22 at a chain. Dried beans, lentils, and spices follow the same pattern. Per-dollar yield can jump 20–30% with one cart shift.',
      },
    ],
    thresholds: {
      cyan: 'Floor hit by day 8 of shopping with $80+ residual — scale variety and protein.',
      gold: 'Floor hit at $200–240 — variety budget compressed, plan mid-month top-up.',
      magenta: 'Floor not hit by $280 — cart is over-indexed on meat/produce; rebuild around rice/oats/PB.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'kcal_floor = 2000 × 30 = 60,000\nkcal_per_$ = food_kcal / food_$\ncart_total_kcal = Σ(item_kcal)\nresidual_$ = benefit_$ − floor_$\nif cart_total_kcal < 60000: rebalance toward staples',
    },
    logicalGates: [
      'Compute kcal floor (2000 × 30 for one adult, scale for household).',
      'Build the staple cart first: rice, oats, peanut butter, beans, pasta, oil.',
      'Verify cart total kcal ≥ floor before adding variety.',
      'At efficiency {{lm:eff}}, if low, cut produce and meat until staples dominate.',
      'Residual spend on nutrition quality — eggs, frozen vegetables, canned fish.',
    ],
    liveMetrics: [
      { token: 'eff', metric: 'survival_efficiency', fallback: 'efficiency unset', decimals: 0, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'calorie-optimizer', note: 'Efficiency below 30%. Re-rank per-item kcal/$ and swap bottom three.' },
      stable: { toolId: 'metabolic-floor', note: 'Floor cleared. Confirm TDEE target — 2,000 kcal may be low for active days.' },
      fallback: { toolId: 'bill-triage', note: 'If SNAP alone cannot clear floor, the upstream issue is cash, not groceries.' },
    },
  },

  {
    id: 'art-scen-biofuel-marathon',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'bio-fuel-marathon-block',
    guideCategory: 'Scenarios · Bio-Fuel',
    toneProfile: 'sop',
    title: 'Bio-Fuel During a Marathon Training Block | Kefiw',
    h1: 'Bio-Fuel During a Marathon Training Block',
    subhead: '68kg runner, 70-mile peak week, 3,200–3,800 kcal/day — the grocery horizon is weekly, not daily.',
    outcomeLine: 'A 4-week block demands ~100,000 kcal with protein floor. Ramen-only blocks break the runner by week 3.',
    description: 'Worked example: 68kg runner, 70mi peak, daily expenditure 3,200-3,800 kcal, 4-week block = 100k+ kcal. Grocery horizon and protein floor.',
    keywords: ['marathon training calories', 'runner food budget', 'bio fuel marathon', '100k calorie month', 'marathon protein floor'],
    intro: 'Subject: 68kg runner, 24 weeks into a 26-week marathon cycle. Peak week: 70 miles running + 2 strength sessions. Daily energy expenditure range: 3,200 kcal (recovery day) to 3,800 kcal (long run day). Block = 4 weeks to race day. Survival efficiency reading: {{lm:eff}}.',
    keyPoints: [
      'Running under-fueled does not make you lighter; it makes you injured.',
      'Total block demand: ~100,000 kcal with 90+ g protein/day floor.',
      'Efficiency reading {{lm:eff}} — if low, the cart is protein-deficient even if kcal targets are hit.',
      'Grocery horizon is weekly. A 25,000 kcal week cannot be bought Sunday without a plan.',
      '"Just ramen and rice" is the injury pipeline. Protein deficit shows up as a calf strain in week 3, not a weight gain.',
    ],
    examples: [
      {
        title: 'Weekly kcal + protein target',
        body: 'Average week: 3,500 kcal/day × 7 = 24,500 kcal/week. Protein floor: 1.6 g/kg × 68 = 109 g/day × 7 = 763 g/week. Equivalent: 2.5 lb chicken breast, 18 eggs, 2 lb Greek yogurt, 1 lb beans, 1 lb peanut butter, plus training-day carb loads.',
      },
      {
        title: 'Ramen-only failure mode',
        body: 'Ramen (3-pack) = 1,140 kcal, 27 g protein, $1.50. Runner eats 4 packs/day = 4,560 kcal, 108 g protein on paper. Protein is low-quality (mostly gluten), sodium 8,000+ mg/day, fiber near zero. Week 2: calf tightness. Week 3: micro-tear during long run. Block abandoned, race missed.',
      },
      {
        title: '4-week grocery horizon',
        body: 'Target: 100,000 kcal + 3,000 g protein over 28 days. Weekly spend at mid-range grocery prices: ~$120 (4 lb oats $4, 3 lb rice $3, 24 eggs $6, 2 lb chicken $10, 2 lb ground turkey $10, 2 lb peanut butter $6, 4 lb Greek yogurt $12, 2 lb pasta $3, 2 cans tuna $4, fruits/vegetables $35, bread $5, oil/butter $5, misc $17). Block total: $480. Add $40/wk fueling gels and electrolyte — $640 all-in.',
      },
    ],
    whenToUse: [
      { toolId: 'bio-fuel', note: 'Plan weekly grocery horizon, not daily. Recompute at mileage step-ups (e.g. 50→60→70).' },
    ],
    relatedIds: ['bio-fuel', 'fuel-partition', 'metabolic-floor'],
    faq: [
      {
        q: 'Do I need gels and sports drinks?',
        a: 'On runs over 90 minutes, yes — 30–60 g carb/hour. Under 90 minutes, water and a pre-run meal are sufficient. Gels are about GI tolerance as much as energy; practice in training, not race day.',
      },
      {
        q: 'Is 1.6 g/kg protein enough?',
        a: 'For recovery, yes. For simultaneous strength gains, push to 1.8–2.0 g/kg. Runners recovering from injury can hold at 1.4 g/kg without loss. Never below 1.2 g/kg during a block.',
      },
    ],
    thresholds: {
      cyan: 'Weekly kcal hit with protein floor ≥ 1.6 g/kg — training stimulus converts to adaptation.',
      gold: 'Kcal hit but protein 1.2–1.6 g/kg — monitor for soreness lingering past 48 hours.',
      magenta: 'Protein below 1.2 g/kg or kcal deficit — injury risk rising weekly; pause mileage build.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'daily_need = BMR + (run_kcal × miles) + strength_kcal\nweekly_need = Σ(daily_need) across 7 days\nprotein_floor_g = 1.6 × body_weight_kg\nblock_total = weekly_need × 4\ngrocery_horizon = weekly_need, bought Sunday',
    },
    logicalGates: [
      'Compute daily kcal per training phase (recovery / medium / long).',
      'Sum weekly need. Multiply by 4 for block total.',
      'Protein floor = 1.6 × body_weight_kg. Budget protein sources before carbs.',
      'At efficiency {{lm:eff}}, if low, rebalance toward whole proteins and away from refined carbs.',
      'Grocery horizon weekly — Sunday cart, no mid-week top-ups except produce and dairy.',
    ],
    liveMetrics: [
      { token: 'eff', metric: 'survival_efficiency', fallback: 'efficiency unset', decimals: 0, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'metabolic-floor', note: 'Protein below floor. Recompute BMR+TDEE and set protein target before next long run.' },
      stable: { toolId: 'fuel-partition', note: 'Kcal and protein clear. Partition carb vs fat around training windows.' },
      fallback: { toolId: 'calorie-optimizer', note: 'Cart cost running high — rank per-item kcal/$ to swap expensive low-yield items.' },
    },
  },

  {
    id: 'art-scen-biofuel-night-shift',
    kind: 'guide',
    section: 'guides',
    pageType: 'support',
    slug: 'bio-fuel-night-shift',
    guideCategory: 'Scenarios · Bio-Fuel',
    toneProfile: 'sop',
    title: 'Bio-Fuel for a Night-Shift Worker | Kefiw',
    h1: 'Bio-Fuel for a Night-Shift Worker',
    subhead: 'Nurse, three 12-hour nights, inverted circadian cycle — store trips align to the 3pm window.',
    outcomeLine: 'Plan seven days of uptime around the post-sleep 3pm window, not per-meal optimization.',
    description: 'Worked example: nurse on 3x12hr nights (7pm-7am). Eating on inverted cycle, 2 meals + 1 night-lunch pattern. Weekly horizon, 3pm store trip.',
    keywords: ['night shift food', 'nurse meal planning', 'inverted circadian eating', 'bio fuel night shift', 'shift worker grocery'],
    intro: 'Subject: nurse working three 12-hour night shifts per week, 7pm–7am. Post-shift sleep: 9am–3pm. Eating pattern: pre-shift dinner (5pm), mid-shift "night-lunch" (~1am), post-sleep breakfast (3:30pm). Off days revert toward daytime. Current efficiency: {{lm:eff}}.',
    keyPoints: [
      'Per-meal optimization is noise. Weekly horizon is signal — 7 days of uptime beats any single night-lunch.',
      'Store trip aligns to post-sleep 3pm window, not morning. Morning is sleep; evening is pre-shift; 3pm is the only real errand window.',
      'Efficiency reading {{lm:eff}} — low readings usually mean the mid-shift meal is vending-machine default, not planned.',
      'Inverted circadian fights metabolism. Eating pattern that minimizes 2am sugar crashes beats any kcal target hit at 3am.',
      'Off days: eat toward daytime, not toward shift. Do not "pre-load" Sunday for Monday night — body clock will not cash the check.',
    ],
    examples: [
      {
        title: 'Weekly horizon, 3 shift days',
        body: '3 shifts = 3 × (dinner + night-lunch + post-sleep breakfast) = 9 shift meals. 4 off-days × 3 = 12 day meals. Total 21 meals/week. Sunday 3pm shop for all of them, with 3 batch-cookable containers for night-lunch.',
      },
      {
        title: 'Night-lunch that holds',
        body: 'Bad: vending chips + soda = 600 kcal, crash at 4am. Good: pre-packed rice + chicken + vegetables = 650 kcal, sustained. Batch-cook Sunday 4pm, pack three for the week. Cost: $12 ingredients vs $18/wk vending. Crash eliminated.',
      },
      {
        title: 'Off-day drift',
        body: 'Friday off, last shift Thursday night. Body clock fights realignment until Saturday evening. Do not force breakfast at 7am Friday — eat at 3pm as usual, dinner at 8pm, bed at midnight. Normalize Saturday, not Friday.',
      },
    ],
    whenToUse: [
      { toolId: 'bio-fuel', note: 'Plan 7 days at the 3pm post-sleep window. Batch-cook once weekly.' },
    ],
    relatedIds: ['bio-fuel', 'calorie-optimizer', 'fuel-partition'],
    faq: [
      {
        q: 'Should I fast during shifts?',
        a: 'Most shift nurses cannot. A 12-hour night with patient care cannot be powered by an 8pm last meal; cognitive errors rise. Time-restricted eating compressed to pre-shift + night-lunch (4–6 hour window) works better than straight fasting.',
      },
      {
        q: 'Does coffee count against the meal plan?',
        a: 'Caffeine does not, but caffeine-delivered calories do. A sugary energy drink is 200 kcal of near-zero nutrition. Black coffee, tea, or a protein + espresso drink preserves the kcal budget for real food.',
      },
      {
        q: 'What about the off-shift weekend — do I eat normally?',
        a: 'Shift toward daytime gradually. Saturday breakfast by 10am, dinner by 7pm, bed by 11pm. Sunday mostly daytime. Don\'t expect full normalization in 48 hours — three-on/four-off cycles never fully resolve circadian stress.',
      },
    ],
    thresholds: {
      cyan: 'Batch cook Sunday, three night-lunches packed, weekly horizon planned — efficiency sustained.',
      gold: 'Two of three night-lunches packed, one vending default — efficiency drifting; rebuild next Sunday.',
      magenta: 'No batch cook, nightly vending default — mid-shift crashes rising, error risk up.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression:
        'weekly_meals = (shift_days × 3) + (off_days × 3)\nshop_window = post_sleep (≈ 3pm)\nbatch_cook_target = shift_days night_lunches\nkcal_budget = 2000-2400/day × 7\nhorizon_days = 7',
    },
    logicalGates: [
      'List the week: shift days × 3 meals, off days × 3 meals.',
      'Schedule one shop window — post-sleep 3pm.',
      'Batch-cook night-lunches on Sunday for the week.',
      'At efficiency {{lm:eff}}, if low, audit whether mid-shift meal is planned or defaulted.',
      'Off days: shift eating toward daytime by Saturday, not Friday.',
    ],
    liveMetrics: [
      { token: 'eff', metric: 'survival_efficiency', fallback: 'efficiency unset', decimals: 0, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'calorie-optimizer', note: 'Vending-default weeks. Per-item ranking forces honest substitution at next grocery trip.' },
      stable: { toolId: 'fuel-partition', note: 'Weekly plan holding. Partition carb-protein-fat across pre-shift vs mid-shift meals.' },
      fallback: { toolId: 'metabolic-floor', note: 'If efficiency stays low across cycles, TDEE target may be miscalibrated for shift work.' },
    },
  },
];

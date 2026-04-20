import type { FaqItem } from './tools';

export interface DecisionClusterStartLink {
  href: string;
  label: string;
  note?: string;
}

export interface DecisionCluster {
  slug: string;
  letter: string;
  pillar: string;
  title: string;
  h1: string;
  subhead: string;
  intro: string;
  description: string;
  keywords: string[];
  toolIds: string[];
  supportIds: string[];
  startHere: DecisionClusterStartLink[];
  faq: FaqItem[];
}

export const DECISION_CLUSTERS: DecisionCluster[] = [
  {
    slug: 'solopreneur-health-check',
    letter: 'A',
    pillar: 'Strategic Capital',
    title: 'Solopreneur Health Check — Deterministic Financial Triage | Kefiw',
    h1: 'Solopreneur Health Check',
    subhead: 'Can the side-hustle carry the salary yet? Run the four numbers that decide.',
    intro:
      'Four deterministic calculators check whether a solo business can replace a salary without breaking. The Leap Date tells you when side-income safely covers the W-2 cost. Minimum Viable Rate sets the per-hour floor that keeps the lights on. Hire vs Automate decides when labor should be bought instead of rented. Runway Zero anchors the whole thing to an exact bankruptcy date if growth stalls.',
    description:
      'A four-tool deterministic audit for solopreneurs: Leap Date, Minimum Viable Rate, Hire vs Automate, and Runway Zero — closed-form math that decides whether a side-hustle can replace a salary.',
    keywords: [
      'solopreneur calculator',
      'side hustle to full time',
      'minimum viable rate',
      'runway calculator',
      'leap date calculator',
      'hire vs automate',
    ],
    toolIds: ['leap-date', 'minimum-viable-rate', 'hire-vs-automate', 'runway-zero'],
    supportIds: [
      'cS-leap-date-basics',
      'cS-minimum-viable-rate-basics',
      'cS-hire-vs-automate-basics',
      'cS-runway-zero-basics',
    ],
    startHere: [
      { href: '/calculators/leap-date/', label: 'Leap Date', note: 'The month side-income safely replaces your salary.' },
      { href: '/calculators/minimum-viable-rate/', label: 'Minimum Viable Rate', note: 'The hourly floor that covers overhead and taxes.' },
      { href: '/calculators/hire-vs-automate/', label: 'Hire vs Automate', note: 'Labor cost vs SaaS cost — where the line sits today.' },
      { href: '/calculators/runway-zero/', label: 'Runway Zero', note: 'The exact date cash hits zero at current burn.' },
    ],
    faq: [
      {
        q: 'Why these four tools together?',
        a: 'Leap Date tells you if you can start. Minimum Viable Rate tells you what to charge. Hire vs Automate tells you when to stop doing the work yourself. Runway Zero tells you how long you have if the plan breaks. Together they cover the full go/no-go for a solo business.',
      },
      {
        q: 'Do these assume US tax brackets?',
        a: 'Minimum Viable Rate asks for an effective tax rate as an input — plug in whatever reflects your jurisdiction. The other three are currency-agnostic.',
      },
    ],
  },
  {
    slug: 'poverty-trap-exit-map',
    letter: 'B',
    pillar: 'Scarcity Triage',
    title: 'Poverty Trap Exit-Map — Scarcity Triage Calculators | Kefiw',
    h1: 'Poverty Trap Exit-Map',
    subhead: 'Four calculators for the week when cash is shorter than the month.',
    intro:
      'When money runs out before the bills do, the choices compress. Bio-Fuel Efficiency ranks groceries by calories per dollar so survival is cheap. Bill Triage prioritizes which payment gets the last dollar. Trap Detector exposes the true APR on payday and pawn loans before you sign. Vimes Utility Threshold calculates whether the cheap boots are actually cheaper over five years — the boots-theory tax made explicit.',
    description:
      'Four deterministic calculators for scarcity: calorie-per-dollar food ranking, bill triage priority, payday-loan APR exposure, and Vimes boots-theory cost-per-day math.',
    keywords: [
      'poverty calculator',
      'bill priority calculator',
      'payday loan apr',
      'boots theory calculator',
      'cheapest calories per dollar',
      'scarcity math',
    ],
    toolIds: ['bio-fuel', 'bill-triage', 'trap-detector', 'vimes-utility'],
    supportIds: [
      'cS-bio-fuel-basics',
      'cS-bill-triage-basics',
      'cS-trap-detector-basics',
      'cS-vimes-utility-basics',
    ],
    startHere: [
      { href: '/calculators/bill-triage/', label: 'Bill Triage', note: 'Which bill gets the last dollar this week.' },
      { href: '/calculators/trap-detector/', label: 'Trap Detector', note: 'True APR on any pawn or payday loan before you sign.' },
      { href: '/calculators/bio-fuel/', label: 'Bio-Fuel Efficiency', note: 'Calories per dollar — ranked.' },
      { href: '/calculators/vimes-utility/', label: 'Vimes Utility', note: 'Cheap replacements vs one good pair — over five years.' },
    ],
    faq: [
      {
        q: 'Are these tools judging cheap food or loans?',
        a: 'No. They expose the math so the user can decide with full information. The output is a number, not advice.',
      },
      {
        q: 'Is the APR the Trap Detector shows the same as the stated APR?',
        a: 'No — stated APR is often hidden behind fees and short repayment windows. The Trap Detector annualizes the total cost, which is usually several times the headline rate for sub-$500 loans.',
      },
    ],
  },
  {
    slug: 'developer-efficiency-audit',
    letter: 'C',
    pillar: 'Operational Scaling',
    title: 'Developer Efficiency Audit — Builder Suite Calculators | Kefiw',
    h1: 'Developer Efficiency Audit',
    subhead: 'Four calculators that separate infrastructure cost from infrastructure theatre.',
    intro:
      'Every technical choice compounds. Cloud Exit answers whether self-hosted hardware beats managed services over a realistic horizon. Tech Debt Interest quantifies the ongoing tax that short-term hacks cost long-term. The Crossover finds the exact month a subscription becomes more expensive than a lifetime purchase. Value Floor defines the hourly rate below which DIY costs more than outsourcing. Together they audit where engineering time and infrastructure money actually go.',
    description:
      'Four deterministic calculators for engineering cost: Cloud Exit, Tech Debt Interest, Crossover, and Value Floor — closed-form math for build-vs-buy, self-host-vs-managed, and the true cost of hacks.',
    keywords: [
      'cloud cost calculator',
      'tech debt calculator',
      'subscription vs lifetime',
      'value floor calculator',
      'build vs buy',
      'self hosting roi',
    ],
    toolIds: ['cloud-exit', 'tech-debt-interest', 'crossover-calculator', 'value-floor'],
    supportIds: [
      'cS-cloud-exit-basics',
      'cS-tech-debt-interest-basics',
      'cS-crossover-basics',
      'cS-value-floor-basics',
    ],
    startHere: [
      { href: '/calculators/cloud-exit/', label: 'Cloud Exit', note: 'Self-host break-even month vs managed services.' },
      { href: '/calculators/tech-debt-interest/', label: 'Tech Debt Interest', note: 'Compounding cost of the hack you shipped last quarter.' },
      { href: '/calculators/crossover-calculator/', label: 'Crossover', note: 'Subscription vs lifetime — the exact month one beats the other.' },
      { href: '/calculators/value-floor/', label: 'Value Floor', note: 'Below what hourly rate does DIY actively cost you money.' },
    ],
    faq: [
      {
        q: 'Why four tools instead of one build-vs-buy calculator?',
        a: 'Each answers a different question. Cloud Exit is about infrastructure. Tech Debt Interest is about shipped code. Crossover is about software licensing. Value Floor is about personal time. Merging them loses the structural differences in each decision.',
      },
      {
        q: 'Do these account for opportunity cost?',
        a: 'Yes — Cloud Exit and Value Floor both take a hurdle rate as input. Set it to your expected return on deployed capital and the math reflects that.',
      },
    ],
  },
  {
    slug: 'existential-maintenance-log',
    letter: 'D',
    pillar: 'Biological Maintenance',
    title: 'Existential Maintenance Log — Human Capital Calculators | Kefiw',
    h1: 'Existential Maintenance Log',
    subhead: 'Four calculators for the costs that don\'t show up on the bank statement.',
    intro:
      'Sleep, social connection, mental bandwidth, and living arrangement are capital costs the accounting books ignore. Social Latency Engine scores the energy tax of a hangout against its connection payoff. Burnout Monitor maps sleep hours to cognitive output, exposing the point where lost sleep costs more than the work produced. Stability Coefficient computes the sanity premium of living alone vs with roommates in hard rent percentages. Dopamine Minimum finds the single task most likely to break a low-energy fog. Human capital shows up on the balance sheet whether you account for it or not.',
    description:
      'Four deterministic calculators for human capital: Social Latency, Burnout Monitor, Stability Coefficient, and Dopamine Minimum — closed-form math for social ROI, sleep cost, rent premium, and low-energy task selection.',
    keywords: [
      'social roi calculator',
      'burnout calculator',
      'sleep cost calculator',
      'rent alone vs roommate',
      'human capital calculator',
      'dopamine task calculator',
    ],
    toolIds: ['social-latency', 'burnout-monitor', 'stability-coefficient', 'dopamine-minimum'],
    supportIds: [
      'cS-social-latency-basics',
      'cS-burnout-monitor-basics',
      'cS-stability-coefficient-basics',
      'cS-dopamine-minimum-basics',
    ],
    startHere: [
      { href: '/calculators/social-latency/', label: 'Social Latency', note: 'Energy tax of social connection, scored.' },
      { href: '/calculators/burnout-monitor/', label: 'Burnout Monitor', note: 'Where lost sleep costs more than extra work produces.' },
      { href: '/calculators/stability-coefficient/', label: 'Stability Coefficient', note: 'The sanity premium of living alone.' },
      { href: '/calculators/dopamine-minimum/', label: 'Dopamine Minimum', note: 'The single task most likely to break the fog.' },
    ],
    faq: [
      {
        q: 'Why quantify mental and social state at all?',
        a: 'Because untracked costs compound silently. Naming the premium on living alone as a dollar figure, or the cost of six-hour nights as a cognitive multiplier, forces the tradeoff into the same frame as rent and salary.',
      },
      {
        q: 'Are these tools prescriptive?',
        a: 'No. The output is numerical — a multiplier, a ratio, a rank. The decision stays with the user.',
      },
    ],
  },
];

export const DECISION_CLUSTERS_BY_SLUG: Record<string, DecisionCluster> = Object.fromEntries(
  DECISION_CLUSTERS.map((c) => [c.slug, c]),
);

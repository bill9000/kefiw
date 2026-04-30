export interface CloudSaasRouteCard {
  situation: string;
  href: string;
  label: string;
}

export interface CloudSaasContentSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface CloudSaasContentPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  promise: string;
  keywords: string[];
  primaryCalculator?: string;
  calculatorLinks: CloudSaasRouteCard[];
  sections: CloudSaasContentSection[];
}

export const cloudSaasSituationRoutes: CloudSaasRouteCard[] = [
  { situation: 'What are we spending on software?', label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/' },
  { situation: 'Which seats are wasted?', label: 'Seat Cost Calculator', href: '/business/seat-cost-calculator/' },
  { situation: 'Which tools should we cancel?', label: 'SaaS Renewal Risk Calculator', href: '/business/saas-renewal-risk-calculator/' },
  { situation: 'Do we have duplicate tools?', label: 'Duplicate Tool Audit', href: '/business/duplicate-tool-audit/' },
  { situation: 'Is this AI tool worth it?', label: 'AI Tool ROI Calculator', href: '/business/ai-tool-roi-calculator/' },
  { situation: 'Is software saving time or adding work?', label: 'Software ROI / Tech Debt Interest', href: '/business/software-roi-calculator/' },
  { situation: 'What happens if usage doubles?', label: 'Cloud Bill Shock Simulator', href: '/business/cloud-bill-shock-simulator/' },
  { situation: 'What does each customer cost us?', label: 'Cloud Unit Economics Calculator', href: '/business/cloud-unit-economics-calculator/' },
  { situation: 'Should we leave this cloud/provider?', label: 'Cloud Exit Calculator', href: '/business/cloud-exit-calculator/' },
  { situation: 'Is lifetime cheaper than subscription?', label: 'Subscription vs Lifetime Crossover', href: '/business/subscription-vs-lifetime-crossover-calculator/' },
  { situation: 'Are commitments helping or trapping us?', label: 'Cloud Commitment Risk Calculator', href: '/business/cloud-commitment-risk-calculator/' },
  { situation: 'Who owns each tool?', label: 'Software Stack Ownership Scorecard', href: '/business/software-stack-ownership-scorecard/' },
];

export const cloudSaasTrackCards: CloudSaasRouteCard[] = [
  { situation: 'Clean Up Software Spend', label: 'Score the stack', href: '/business/software-spend-health-score/' },
  { situation: 'Audit SaaS Seats', label: 'Find inactive access', href: '/business/seat-cost-calculator/' },
  { situation: 'Measure AI ROI', label: 'Count review time', href: '/business/ai-tool-roi-calculator/' },
  { situation: 'Stress-Test Cloud Growth', label: 'Model bill shock', href: '/business/cloud-bill-shock-simulator/' },
  { situation: 'Review Renewals', label: 'Check action windows', href: '/business/saas-renewal-risk-calculator/' },
  { situation: 'Decide Whether to Exit Cloud', label: 'Model migration cost', href: '/business/cloud-exit-calculator/' },
  { situation: 'Compare Subscription vs Lifetime', label: 'Find crossover risk', href: '/business/subscription-vs-lifetime-crossover-calculator/' },
];

export const cloudSaasGuidePages: CloudSaasContentPage[] = [
  {
    slug: 'how-to-run-saas-cost-audit',
    title: 'How to Run a SaaS Cost Audit Without Becoming the Tool Police | Kefiw',
    description: 'Audit software spend by owners, seats, renewals, usage, duplicates, and workflow value without turning the process into blame.',
    h1: 'How to Run a SaaS Cost Audit',
    tagline: 'Find what you use, what you forgot, and what renews next.',
    promise: 'Turn a messy software stack into owners, renewal dates, keep/cut decisions, and cleanup actions.',
    keywords: ['SaaS cost audit', 'software subscription cost calculator', 'SaaS spend audit calculator'],
    primaryCalculator: '/business/software-spend-health-score/',
    calculatorLinks: [
      { situation: 'Score stack health', label: 'Software Spend Health Score', href: '/business/software-spend-health-score/' },
      { situation: 'Inventory spend', label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Most teams start by asking which tools to cancel. The better question is which tools have owners, renewal dates, usage evidence, and a clear workflow.' },
      { heading: 'The better move', body: 'Build a tool list, assign owners, separate active seats from paid seats, flag duplicate categories, and review cancellation windows before renewals close.' },
    ],
  },
  {
    slug: 'unused-saas-seats',
    title: 'Unused SaaS Seats Calculator and Cleanup Guide | Kefiw',
    description: 'Find inactive software seats, admin seats, contractor seats, and renewal constraints before assuming savings are immediately available.',
    h1: 'Unused SaaS Seats',
    tagline: 'Unused seats still get paid.',
    promise: 'Estimate seat waste without pretending every unused seat can be cancelled immediately.',
    keywords: ['unused SaaS seats calculator', 'software seat cost calculator', 'inactive software users cost'],
    primaryCalculator: '/business/seat-cost-calculator/',
    calculatorLinks: [
      { situation: 'Estimate wasted seats', label: 'Seat Cost Calculator', href: '/business/seat-cost-calculator/' },
      { situation: 'Assign ownership', label: 'Tool Owner Template', href: '/business/cloud-saas/templates/tool-owner-assignment-template/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A seat can be inactive while the contract is still active. Minimum seats, admin needs, annual terms, and true-down rules can block immediate savings.' },
      { heading: 'The better move', body: 'Review inactive, admin, contractor, and over-permissioned seats before renewal. Treat the output as exposure until contract terms confirm savings.' },
    ],
  },
  {
    slug: 'what-if-every-tool-raises-prices',
    title: 'What If Every Tool Raises Prices 10 Percent? | Kefiw',
    description: 'Stress-test SaaS spend against renewal increases, annual contracts, usage charges, and ownerless tools.',
    h1: 'What If Every Tool Raises Prices?',
    tagline: 'Price creep becomes overhead when nobody owns the stack.',
    promise: 'Show how many small increases can become a fixed-cost layer.',
    keywords: ['SaaS price increase calculator', 'software renewal cost calculator', 'what if every tool raises prices'],
    primaryCalculator: '/business/saas-cost-calculator/',
    calculatorLinks: [
      { situation: 'Stress-test stack cost', label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/' },
      { situation: 'Review renewals', label: 'SaaS Renewal Risk', href: '/business/saas-renewal-risk-calculator/' },
    ],
    sections: [
      { heading: 'The issue', body: 'A single price increase may be manageable. A stack-wide increase can change break-even, owner pay, and hiring capacity.' },
      { heading: 'The better move', body: 'Model a price increase before renewal season and decide which tools are keep, downgrade, consolidate, or cancel candidates.' },
    ],
  },
  {
    slug: 'tool-sprawl-is-ownership-problem',
    title: 'Tool Sprawl Is Usually an Ownership Problem | Kefiw',
    description: 'Understand why ownerless tools keep billing, fragment workflows, create access risk, and become hard to remove.',
    h1: 'Tool Sprawl Is Usually an Ownership Problem',
    tagline: 'Nobody owns it, but the business still pays for it.',
    promise: 'Explain why every tool needs a business owner, renewal owner, data owner, and exit plan.',
    keywords: ['SaaS ownership checklist', 'software tool owner', 'SaaS governance small business'],
    primaryCalculator: '/business/software-stack-ownership-scorecard/',
    calculatorLinks: [
      { situation: 'Score ownership', label: 'Ownership Scorecard', href: '/business/software-stack-ownership-scorecard/' },
      { situation: 'Assign owners', label: 'Tool Owner Template', href: '/business/cloud-saas/templates/tool-owner-assignment-template/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Teams often treat software as neutral if the bill is small. But ownerless tools can hold data, control workflow, auto-renew, and create security or offboarding gaps.' },
      { heading: 'The better move', body: 'Give every tool a business owner, technical owner, budget owner, renewal owner, data owner, and review cadence.' },
    ],
  },
  {
    slug: 'ai-roi-review-time',
    title: 'What If AI Saves Time but Adds Review Work? | Kefiw',
    description: 'Calculate AI ROI after prompt work, review time, correction time, adoption, security review, and workflow change.',
    h1: 'What If AI Saves Time but Adds Review Work?',
    tagline: 'Counting saved time before review time is fake ROI.',
    promise: 'Help teams separate demo savings from real workflow economics.',
    keywords: ['AI saves time but adds review work', 'AI review time cost', 'AI automation ROI small business'],
    primaryCalculator: '/business/ai-tool-roi-calculator/',
    calculatorLinks: [
      { situation: 'Measure ROI', label: 'AI Tool ROI Calculator', href: '/business/ai-tool-roi-calculator/' },
      { situation: 'Estimate API cost', label: 'AI Token Cost Calculator', href: '/business/ai-token-cost-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'AI demos usually count the generated output and skip the checking, policy, security, correction, adoption, and workflow redesign required in real work.' },
      { heading: 'The better move', body: 'Count gross time saved, then subtract prompt/setup time, review time, correction time, escalation, and the cost of the tool or API.' },
    ],
  },
  {
    slug: 'how-to-measure-ai-tool-roi',
    title: 'How to Measure AI Tool ROI Without Trusting Demo Math | Kefiw',
    description: 'Measure AI ROI with adoption, review time, error risk, model cost, training, and whether the workflow actually changes.',
    h1: 'How to Measure AI Tool ROI',
    tagline: 'AI ROI is not real until the workflow changes.',
    promise: 'Create a measured AI pilot instead of assuming the subscription pays for itself.',
    keywords: ['AI tool ROI calculator', 'AI automation ROI calculator', 'AI tool payback calculator'],
    primaryCalculator: '/business/ai-tool-roi-calculator/',
    calculatorLinks: [
      { situation: 'Run AI ROI', label: 'AI Tool ROI Calculator', href: '/business/ai-tool-roi-calculator/' },
      { situation: 'Use a worksheet', label: 'AI ROI Worksheet', href: '/business/cloud-saas/templates/ai-roi-worksheet/' },
    ],
    sections: [
      { heading: 'The method', body: 'Define the task, count manual time, measure AI-assisted time, include review and correction, then discount by adoption.' },
      { heading: 'The decision', body: 'Scale the tool only if it changes the workflow, reduces net work, and keeps quality risk inside the business tolerance.' },
    ],
  },
  {
    slug: 'cloud-bill-shock',
    title: 'Cloud Bill Shock: Model the Surprise Before the Invoice | Kefiw',
    description: 'Stress-test cloud cost against traffic, storage, data transfer, logging, AI/API usage, support plans, and commitments.',
    h1: 'Cloud Bill Shock',
    tagline: 'The invoice is where product decisions become visible.',
    promise: 'Show which product and architecture assumptions could create a cost spike.',
    keywords: ['cloud bill shock calculator', 'cloud cost spike calculator', 'why did my cloud bill increase'],
    primaryCalculator: '/business/cloud-bill-shock-simulator/',
    calculatorLinks: [
      { situation: 'Simulate shock', label: 'Cloud Bill Shock Simulator', href: '/business/cloud-bill-shock-simulator/' },
      { situation: 'Review the bill', label: 'Cloud Cost Review Agenda', href: '/business/cloud-saas/templates/cloud-cost-review-agenda/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A cloud spike is rarely one line item. Traffic, logging, storage retention, AI calls, data transfer, support plans, and alerts can stack into one invoice.' },
      { heading: 'The better move', body: 'Stress-test growth categories before launch, then assign owners for alerts, commitments, retention policies, and unit economics.' },
    ],
  },
  {
    slug: 'cloud-cost-per-customer',
    title: 'Cloud Cost Per Customer Calculator Guide | Kefiw',
    description: 'Estimate cloud cost per customer, user, transaction, tenant, API call, case, or AI assist.',
    h1: 'Cloud Cost Per Customer',
    tagline: 'Know what each customer costs to serve.',
    promise: 'Connect cloud spend to unit economics instead of treating the bill as one total.',
    keywords: ['cloud cost per customer calculator', 'cloud unit economics calculator', 'cost to serve SaaS customer'],
    primaryCalculator: '/business/cloud-unit-economics-calculator/',
    calculatorLinks: [
      { situation: 'Calculate unit cost', label: 'Cloud Unit Economics', href: '/business/cloud-unit-economics-calculator/' },
      { situation: 'Model growth shock', label: 'Cloud Bill Shock', href: '/business/cloud-bill-shock-simulator/' },
    ],
    sections: [
      { heading: 'The issue', body: 'Revenue can grow while margin weakens if cost-to-serve grows faster than customer revenue.' },
      { heading: 'The better move', body: 'Track cost per customer, transaction, tenant, API call, or AI assist and compare it with revenue and gross margin.' },
    ],
  },
  {
    slug: 'cloud-optimization-vs-cloud-exit',
    title: 'Cloud Optimization vs Cloud Exit | Kefiw',
    description: 'Compare staying and optimizing against cloud exit after migration labor, commitments, data transfer, downtime, and retraining.',
    h1: 'Cloud Optimization vs Cloud Exit',
    tagline: 'Leaving has a price too.',
    promise: 'Separate frustration with the bill from a real migration case.',
    keywords: ['cloud optimization vs cloud exit', 'cloud exit cost calculator', 'cloud migration payback calculator'],
    primaryCalculator: '/business/cloud-exit-calculator/',
    calculatorLinks: [
      { situation: 'Model exit cost', label: 'Cloud Exit Calculator', href: '/business/cloud-exit-calculator/' },
      { situation: 'Check commitments', label: 'Cloud Commitment Risk', href: '/business/cloud-commitment-risk-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Cloud exit debates often skip migration labor, parallel environments, retraining, downtime, refactoring, remaining commitments, and the new operating model.' },
      { heading: 'The better move', body: 'Compare optimize-first savings with migration payback. If the exit case only works by ignoring labor and risk, it is not ready.' },
    ],
  },
  {
    slug: 'lifetime-deal-trap',
    title: 'Lifetime Deal Trap Calculator Guide | Kefiw',
    description: 'Evaluate lifetime software deals against usage risk, support, updates, vendor risk, workflow fit, and prepaid clutter.',
    h1: 'Lifetime Deals Feel Safe but Can Create Stack Clutter',
    tagline: 'Lifetime deals feel safe until the workflow changes.',
    promise: 'Show why prepaid software is not savings unless the tool stays useful long enough.',
    keywords: ['lifetime deal calculator', 'lifetime software deal worth it', 'software lifetime license trap'],
    primaryCalculator: '/business/subscription-vs-lifetime-crossover-calculator/',
    calculatorLinks: [
      { situation: 'Compare pricing', label: 'Subscription Crossover', href: '/business/subscription-vs-lifetime-crossover-calculator/' },
      { situation: 'Audit stack clutter', label: 'Software Spend Health', href: '/business/software-spend-health-score/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A lifetime deal for an unproven workflow is not savings. It is prepaid stack clutter with vendor, support, and update risk.' },
      { heading: 'The better move', body: 'Model the crossover month, then ask whether the workflow, vendor, support, updates, and data portability are likely to hold that long.' },
    ],
  },
  {
    slug: 'subscription-vs-lifetime-license',
    title: 'Subscription vs Lifetime License Calculator Guide | Kefiw',
    description: 'Compare monthly, annual, lifetime, and one-time software prices with usage duration, price increases, cancellation value, and vendor risk.',
    h1: 'Subscription vs Lifetime License',
    tagline: 'Know when monthly becomes more expensive than commitment.',
    promise: 'Compare price with flexibility, workflow risk, support, and updates.',
    keywords: ['subscription vs lifetime license calculator', 'monthly vs lifetime software cost', 'annual vs monthly software calculator'],
    primaryCalculator: '/business/subscription-vs-lifetime-crossover-calculator/',
    calculatorLinks: [
      { situation: 'Run crossover', label: 'Subscription Crossover', href: '/business/subscription-vs-lifetime-crossover-calculator/' },
      { situation: 'Check ownership', label: 'Ownership Scorecard', href: '/business/software-stack-ownership-scorecard/' },
    ],
    sections: [
      { heading: 'The comparison', body: 'Break-even month is only the first number. Flexibility, updates, support, data export, vendor risk, and whether the tool remains useful all matter.' },
      { heading: 'The better move', body: 'Use monthly while the workflow is unproven. Consider annual or lifetime only when the tool has ownership, adoption, and a real exit plan.' },
    ],
  },
  {
    slug: 'software-roi-without-demo-math',
    title: 'Software ROI Without Demo Math | Kefiw',
    description: 'Measure software ROI after adoption, review time, maintenance, switching cost, integration burden, and old workflow removal.',
    h1: 'Software ROI Without Demo Math',
    tagline: 'Measure the tool, not the sales pitch.',
    promise: 'Estimate whether a tool makes the business lighter or just creates another system to manage.',
    keywords: ['software ROI calculator', 'SaaS ROI calculator', 'tool saves time calculator'],
    primaryCalculator: '/business/software-roi-calculator/',
    calculatorLinks: [
      { situation: 'Measure ROI', label: 'Software ROI Calculator', href: '/business/software-roi-calculator/' },
      { situation: 'Score stack health', label: 'Software Spend Health', href: '/business/software-spend-health-score/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Demo math counts ideal time saved and ignores adoption, review, training, maintenance, switching cost, and the old workflow that might remain.' },
      { heading: 'The better move', body: 'Count the work that actually disappears, subtract new review and ownership work, and avoid annual commitments until adoption is proven.' },
    ],
  },
  {
    slug: 'leaving-cloud-is-not-free',
    title: 'Leaving the Cloud Is Not Free Just Because the Bill Is Too High | Kefiw',
    description: 'Understand migration labor, refactoring, downtime, parallel run, retraining, commitments, and operating-model cost before cloud exit.',
    h1: 'Leaving the Cloud Is Not Free',
    tagline: 'Cloud exit is not a cancellation button.',
    promise: 'Help teams model the full cost of leaving before treating the bill as the only problem.',
    keywords: ['cloud exit cost', 'cloud repatriation cost', 'moving off cloud cost'],
    primaryCalculator: '/business/cloud-exit-calculator/',
    calculatorLinks: [
      { situation: 'Estimate exit cost', label: 'Cloud Exit Calculator', href: '/business/cloud-exit-calculator/' },
      { situation: 'Write a memo', label: 'Cloud Exit Decision Memo', href: '/business/cloud-saas/templates/cloud-exit-decision-memo/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Leaving can reduce some run-rate cost, but migration labor, refactoring, downtime, parallel systems, retraining, contracts, and new operations still need a budget.' },
      { heading: 'The better move', body: 'Write the exit case as a memo with current cost, migration work, commitments, risk, payback, and the operating model after the move.' },
    ],
  },
];

export const cloudSaasTemplatePages: CloudSaasContentPage[] = [
  {
    slug: 'saas-audit-worksheet',
    title: 'SaaS Audit Worksheet | Kefiw',
    description: 'Inventory software tools by owner, team, cost, renewal date, seats, duplicate tools, workflow, and keep/cut decision.',
    h1: 'SaaS Audit Worksheet',
    tagline: 'Find what you use, what you forgot, and what renews next.',
    promise: 'Create a lightweight software inventory before renewals and seat waste become invisible.',
    keywords: ['SaaS audit worksheet', 'SaaS spend audit template', 'software subscription audit'],
    primaryCalculator: '/business/saas-cost-calculator/',
    calculatorLinks: [
      { situation: 'Estimate spend', label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/' },
      { situation: 'Score health', label: 'Software Spend Health', href: '/business/software-spend-health-score/' },
    ],
    sections: [
      {
        heading: 'Worksheet fields',
        body: 'Capture each tool in one place before making keep, cut, consolidate, downgrade, or review decisions.',
        bullets: ['Tool', 'Category', 'Owner', 'Team', 'Monthly cost', 'Annual cost', 'Billing cycle', 'Renewal date', 'Cancellation deadline', 'Seats purchased', 'Seats active', 'Duplicate tools', 'Workflow supported', 'Keep / cut / consolidate / downgrade / review', 'Notes'],
      },
    ],
  },
  {
    slug: 'saas-renewal-calendar',
    title: 'SaaS Renewal Calendar Template | Kefiw',
    description: 'Track renewal dates, cancellation notice deadlines, owners, annual cost, usage status, and action dates.',
    h1: 'SaaS Renewal Calendar Template',
    tagline: 'Review the tool before the contract reviews you.',
    promise: 'Turn renewal risk into a dated action list.',
    keywords: ['SaaS renewal calendar', 'software renewal tracker', 'software cancellation window tracker'],
    primaryCalculator: '/business/saas-renewal-risk-calculator/',
    calculatorLinks: [
      { situation: 'Check risk', label: 'SaaS Renewal Risk', href: '/business/saas-renewal-risk-calculator/' },
      { situation: 'Assign owners', label: 'Tool Owner Template', href: '/business/cloud-saas/templates/tool-owner-assignment-template/' },
    ],
    sections: [
      {
        heading: 'Calendar fields',
        body: 'The renewal date is not enough. Capture the action date that comes before cancellation or negotiation windows close.',
        bullets: ['Tool name', 'Renewal date', 'Cancellation notice deadline', 'Owner', 'Annual cost', 'Usage status', 'Expected price increase', 'Action date', 'Review outcome'],
      },
    ],
  },
  {
    slug: 'ai-roi-worksheet',
    title: 'AI Tool ROI Worksheet | Kefiw',
    description: 'Count manual time, AI-assisted time, prompt time, review time, correction time, adoption, tool cost, and workflow change.',
    h1: 'AI Tool ROI Worksheet',
    tagline: 'Count review time before calling it savings.',
    promise: 'Structure an AI pilot around measured work instead of demo claims.',
    keywords: ['AI ROI worksheet', 'AI tool ROI template', 'AI review time calculator'],
    primaryCalculator: '/business/ai-tool-roi-calculator/',
    calculatorLinks: [
      { situation: 'Run ROI', label: 'AI Tool ROI Calculator', href: '/business/ai-tool-roi-calculator/' },
      { situation: 'Estimate API cost', label: 'AI Token Cost Calculator', href: '/business/ai-token-cost-calculator/' },
    ],
    sections: [
      {
        heading: 'Worksheet fields',
        body: 'Use this before scaling an AI subscription, workflow, or API feature.',
        bullets: ['Task', 'Current manual time', 'AI-assisted time', 'Prompt/setup time', 'Review time', 'Correction time', 'Error risk', 'Adoption rate', 'Tool/API cost', 'Workflow change required', 'Decision: keep, test, scale, pause'],
      },
    ],
  },
  {
    slug: 'cloud-cost-review-agenda',
    title: 'Cloud Cost Review Meeting Agenda | Kefiw',
    description: 'Review cloud spend by service, workload, customer, cost changes, idle resources, transfer, storage, logging, AI/API usage, commitments, and owners.',
    h1: 'Cloud Cost Review Meeting Agenda',
    tagline: 'Turn the bill into engineering decisions.',
    promise: 'Move cloud review from invoice surprise to specific workload decisions.',
    keywords: ['cloud cost review agenda', 'cloud cost review meeting', 'FinOps meeting agenda'],
    primaryCalculator: '/business/cloud-cost-calculator/',
    calculatorLinks: [
      { situation: 'Model cost', label: 'Cloud Cost Calculator', href: '/business/cloud-cost-calculator/' },
      { situation: 'Stress-test growth', label: 'Cloud Bill Shock', href: '/business/cloud-bill-shock-simulator/' },
    ],
    sections: [
      {
        heading: 'Agenda',
        body: 'Use this when the bill changes or before a feature launch that may change cost-to-serve.',
        bullets: ['Spend by service', 'Spend by product/customer/workload', 'Top 5 cost changes', 'Idle resources', 'Data-transfer changes', 'Storage/logging growth', 'AI/API usage', 'Commitment coverage', 'Cost per customer/user/transaction', 'Next actions and owners'],
      },
    ],
  },
  {
    slug: 'tool-owner-assignment-template',
    title: 'Software Tool Owner Assignment Template | Kefiw',
    description: 'Assign business, technical, budget, renewal, data, workflow, access, and exit-plan ownership for each software tool.',
    h1: 'Software Tool Owner Assignment Template',
    tagline: 'Give every tool a person, a purpose, and a renewal decision.',
    promise: 'Make ownership visible before the stack becomes permanent overhead.',
    keywords: ['tool owner assignment template', 'SaaS owner checklist', 'software renewal owner'],
    primaryCalculator: '/business/software-stack-ownership-scorecard/',
    calculatorLinks: [
      { situation: 'Score ownership', label: 'Ownership Scorecard', href: '/business/software-stack-ownership-scorecard/' },
      { situation: 'Review renewals', label: 'SaaS Renewal Risk', href: '/business/saas-renewal-risk-calculator/' },
    ],
    sections: [
      {
        heading: 'Ownership fields',
        body: 'Ownerless tools are not neutral. Give each one a decision-maker and a review cadence.',
        bullets: ['Business owner', 'Technical owner', 'Budget owner', 'Renewal owner', 'Data owner', 'Workflow owner', 'Access/offboarding owner', 'Review cadence', 'Exit plan'],
      },
    ],
  },
  {
    slug: 'cloud-exit-decision-memo',
    title: 'Cloud Exit Decision Memo | Kefiw',
    description: 'Document the cloud-exit case with current cost, projected savings, migration work, data transfer, commitments, downtime, retraining, operating model, and payback.',
    h1: 'Cloud Exit Decision Memo',
    tagline: 'Separate frustration from a real migration case.',
    promise: 'Turn cloud-exit debate into a structured decision memo.',
    keywords: ['cloud exit decision memo', 'cloud repatriation cost template', 'cloud migration payback'],
    primaryCalculator: '/business/cloud-exit-calculator/',
    calculatorLinks: [
      { situation: 'Run exit estimate', label: 'Cloud Exit Calculator', href: '/business/cloud-exit-calculator/' },
      { situation: 'Check commitments', label: 'Cloud Commitment Risk', href: '/business/cloud-commitment-risk-calculator/' },
    ],
    sections: [
      {
        heading: 'Memo sections',
        body: 'Use the memo when the team is considering migration, repatriation, or major provider change.',
        bullets: ['Why we are considering exit', 'Current monthly cost', 'Projected savings', 'Migration work', 'Data-transfer issues', 'Contracts/commitments', 'Downtime risk', 'Retraining needs', 'New operating model', 'Payback period', 'Recommendation'],
      },
    ],
  },
];

export function cloudSaasGuideHref(page: Pick<CloudSaasContentPage, 'slug'>): string {
  return `/business/cloud-saas/guides/${page.slug}/`;
}

export function cloudSaasTemplateHref(page: Pick<CloudSaasContentPage, 'slug'>): string {
  return `/business/cloud-saas/templates/${page.slug}/`;
}

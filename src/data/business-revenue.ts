export interface RevenueRouteCard {
  situation: string;
  href: string;
  label: string;
}

export interface RevenueContentSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface RevenueContentPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  promise: string;
  keywords: string[];
  primaryCalculator?: string;
  calculatorLinks: RevenueRouteCard[];
  sections: RevenueContentSection[];
}

export const revenueSituationRoutes: RevenueRouteCard[] = [
  { situation: 'How much revenue will we make?', label: 'Revenue Forecast Calculator', href: '/business/revenue-forecast-calculator/' },
  { situation: 'How fragile is this forecast?', label: 'Revenue Fragility Score', href: '/business/revenue-fragility-score/' },
  { situation: 'What if one big client leaves?', label: 'Client Concentration Risk Calculator', href: '/business/client-concentration-risk-calculator/' },
  { situation: 'How many leads do we need?', label: 'Sales Target Calculator', href: '/business/sales-target-calculator/' },
  { situation: 'Is our pipeline real enough?', label: 'Sales Pipeline Reality Check', href: '/business/sales-pipeline-reality-check/' },
  { situation: 'What if customers churn?', label: 'Churn Calculator', href: '/business/churn-calculator/' },
  { situation: 'How much revenue do we need to replace churn?', label: 'Churn Replacement Calculator', href: '/business/churn-replacement-calculator/' },
  { situation: 'How should we price a subscription?', label: 'Subscription Pricing Calculator', href: '/business/subscription-pricing-calculator/' },
  { situation: 'What if payments arrive late?', label: 'Payment Delay Impact Calculator', href: '/business/payment-delay-impact-calculator/' },
  { situation: 'How long can we survive a bad month?', label: 'Small Business Cash Runway Calculator', href: '/business/small-business-cash-runway-calculator/' },
  { situation: 'Does growth improve profit?', label: 'Operating Leverage Calculator', href: '/business/operating-leverage-calculator/' },
  { situation: 'Are retainers actually stable?', label: 'Retainer Stability Calculator', href: '/business/retainer-stability-calculator/' },
];

export const revenueTrackCards: RevenueRouteCard[] = [
  { situation: 'Build a Realistic Forecast', label: 'Forecast revenue, then stress-test it', href: '/business/revenue-forecast-calculator/' },
  { situation: 'Hit a Sales Target', label: 'Back into leads, calls, and proposals', href: '/business/sales-target-calculator/' },
  { situation: 'Reduce Client Concentration', label: 'Model one-client loss before spending', href: '/business/client-concentration-risk-calculator/' },
  { situation: 'Fix Churn Before Chasing Growth', label: 'Separate replacement from growth', href: '/business/churn-replacement-calculator/' },
  { situation: 'Price a Subscription', label: 'Count churn, support, and payback', href: '/business/subscription-pricing-calculator/' },
  { situation: 'Improve Cash Timing', label: 'Check runway and late-payment drag', href: '/business/payment-delay-impact-calculator/' },
  { situation: 'Check Whether Growth Improves Profit', label: 'Model leverage and capacity', href: '/business/operating-leverage-calculator/' },
];

export const revenueGuidePages: RevenueContentPage[] = [
  {
    slug: 'what-if-one-big-client-leaves',
    title: 'What If One Big Client Leaves? | Kefiw',
    description: 'Stress-test revenue, profit, cash runway, replacement time, and owner workload before one client becomes the business model.',
    h1: 'What If One Big Client Leaves?',
    tagline: 'One great client can become one giant risk.',
    promise: 'Help operators see how client concentration distorts confidence, hiring decisions, and spending plans.',
    keywords: ['what if one big client leaves', 'client concentration risk', 'biggest client risk'],
    primaryCalculator: '/business/client-concentration-risk-calculator/',
    calculatorLinks: [
      { situation: 'Measure concentration', label: 'Client Concentration Risk', href: '/business/client-concentration-risk-calculator/' },
      { situation: 'Check runway after loss', label: 'Cash Runway Calculator', href: '/business/small-business-cash-runway-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A large client can feel like safety because the invoice is real. But if one relationship controls hiring, owner pay, or payroll confidence, revenue is less diversified than it feels.' },
      { heading: 'The better move', body: 'Model largest-client loss, replacement months, profit at risk, payment timing, and the sales target needed to replace the account before adding fixed costs.' },
    ],
  },
  {
    slug: 'booked-revenue-vs-collected-cash',
    title: 'Booked Revenue vs Collected Cash | Kefiw',
    description: 'Understand why promised work, booked revenue, invoiced revenue, and collected cash can tell very different business stories.',
    h1: 'Booked Revenue vs Collected Cash',
    tagline: 'Revenue does not help until cash arrives.',
    promise: 'Explain the difference between promised work, booked revenue, invoiced revenue, and collected cash.',
    keywords: ['booked revenue vs collected cash', 'revenue vs cash flow', 'invoiced revenue not paid'],
    primaryCalculator: '/business/revenue-forecast-calculator/',
    calculatorLinks: [
      { situation: 'Forecast collected cash', label: 'Revenue Forecast Calculator', href: '/business/revenue-forecast-calculator/' },
      { situation: 'Model late invoices', label: 'Payment Delay Impact', href: '/business/payment-delay-impact-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Forecasts often treat revenue as cash. Real operators wait on approvals, invoices, terms, late payments, deposits, and collections.' },
      { heading: 'The better move', body: 'Separate expected revenue, committed revenue, booked revenue, invoiced revenue, collected cash, and at-risk revenue before hiring or spending.' },
    ],
  },
  {
    slug: 'how-to-forecast-revenue-with-irregular-clients',
    title: 'How to Forecast Revenue With Irregular Clients | Kefiw',
    description: 'Build a forecast for project work, retainers, seasonal demand, one-off clients, delayed starts, and uneven payment timing.',
    h1: 'How to Forecast Revenue With Irregular Clients',
    tagline: 'Irregular revenue needs scenarios, not one clean line.',
    promise: 'Turn uneven clients and projects into conservative, expected, and aggressive revenue plans.',
    keywords: ['forecast revenue with irregular clients', 'consultant revenue forecast calculator', 'freelance income forecast calculator'],
    primaryCalculator: '/business/revenue-forecast-calculator/',
    calculatorLinks: [
      { situation: 'Build the forecast', label: 'Revenue Forecast Calculator', href: '/business/revenue-forecast-calculator/' },
      { situation: 'Check fragility', label: 'Revenue Fragility Score', href: '/business/revenue-fragility-score/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Irregular revenue gets averaged until it looks calmer than it is. That hides slow months, late starts, client loss, and collection delay.' },
      { heading: 'The better move', body: 'Use trailing revenue, known contracts, realistic close rates, client-loss scenarios, payment timing, and cash runway to build the forecast.' },
    ],
  },
  {
    slug: 'a-forecast-is-not-a-promise',
    title: 'A Forecast Is Not a Promise | Kefiw',
    description: 'Use a revenue forecast as a stress test for close rate, churn, payment timing, client concentration, and delivery capacity.',
    h1: 'A Forecast Is Not a Promise',
    tagline: 'The useful forecast shows what could break.',
    promise: 'Show why revenue forecasts fail when they ignore timing, churn, pipeline quality, and client concentration.',
    keywords: ['revenue forecast mistake', 'small business forecast wrong', 'forecast vs actual revenue'],
    primaryCalculator: '/business/revenue-fragility-score/',
    calculatorLinks: [
      { situation: 'Score forecast fragility', label: 'Revenue Fragility Score', href: '/business/revenue-fragility-score/' },
      { situation: 'Check sales assumptions', label: 'Sales Pipeline Reality Check', href: '/business/sales-pipeline-reality-check/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A forecast becomes dangerous when it is treated like committed money instead of a set of assumptions that need to be tested.' },
      { heading: 'The better move', body: 'Run conservative, expected, and aggressive versions. Then identify the weakest assumption before making spending, hiring, or tax-reserve decisions.' },
    ],
  },
  {
    slug: 'how-many-leads-to-hit-revenue-goal',
    title: 'How Many Leads Do I Need to Hit a Revenue Goal? | Kefiw',
    description: 'Translate a revenue target into leads, calls, proposals, closes, average deal size, and sales-cycle timing.',
    h1: 'How Many Leads Do I Need?',
    tagline: 'More leads is lazy advice.',
    promise: 'Convert a revenue goal into actual funnel activity and delivery capacity.',
    keywords: ['how many leads to hit revenue goal', 'sales target calculator small business', 'revenue goal to leads calculator'],
    primaryCalculator: '/business/sales-target-calculator/',
    calculatorLinks: [
      { situation: 'Back into lead count', label: 'Sales Target Calculator', href: '/business/sales-target-calculator/' },
      { situation: 'Validate pipeline', label: 'Sales Pipeline Reality Check', href: '/business/sales-pipeline-reality-check/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A sales goal can sound reasonable until the lead count, proposal count, sales cycle, and delivery capacity are made visible.' },
      { heading: 'The better move', body: 'Work backward from the revenue gap through deal size, proposal close rate, call rate, lead qualification, and timing.' },
    ],
  },
  {
    slug: 'what-if-my-close-rate-drops',
    title: 'What If My Close Rate Drops? | Kefiw',
    description: 'Stress-test a sales target when close rate weakens, proposals slow, sales cycle stretches, or average deal size changes.',
    h1: 'What If My Close Rate Drops?',
    tagline: 'A small conversion drop can create a big lead gap.',
    promise: 'Show how weaker close rates change lead requirements, pipeline coverage, and revenue timing.',
    keywords: ['what if my close rate drops', 'proposal close rate calculator', 'sales pipeline calculator small business'],
    primaryCalculator: '/business/sales-target-calculator/',
    calculatorLinks: [
      { situation: 'Stress-test target', label: 'Sales Target Calculator', href: '/business/sales-target-calculator/' },
      { situation: 'Review pipeline quality', label: 'Pipeline Reality Check', href: '/business/sales-pipeline-reality-check/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Operators often keep the same revenue target after close rate changes. That silently increases the required leads, calls, and proposals.' },
      { heading: 'The better move', body: 'Run the target with lower close rate, smaller deal size, and longer sales cycle before deciding the team only needs to push harder.' },
    ],
  },
  {
    slug: 'why-your-sales-pipeline-is-overstated',
    title: 'Why Your Sales Pipeline Is Probably Overstated | Kefiw',
    description: 'Find pipeline inflation caused by stale deals, no next step, weak budget confirmation, guessed close dates, and unknown payment timing.',
    h1: 'Why Your Sales Pipeline Is Probably Overstated',
    tagline: 'A deal without a next step is not pipeline.',
    promise: 'Explain why pipeline should be weighted by qualification, timing, decision-maker access, and next action.',
    keywords: ['sales pipeline mistake', 'weighted pipeline calculator', 'sales forecast pipeline'],
    primaryCalculator: '/business/sales-pipeline-reality-check/',
    calculatorLinks: [
      { situation: 'Score pipeline quality', label: 'Sales Pipeline Reality Check', href: '/business/sales-pipeline-reality-check/' },
      { situation: 'Use review template', label: 'Pipeline Review Template', href: '/business/revenue/templates/sales-pipeline-review-template/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Pipeline inflation makes the owner feel like revenue is coming. But stale, vague, or no-next-step deals do not support payroll or spending.' },
      { heading: 'The better move', body: 'Separate listed pipeline from realistic pipeline by checking budget, decision-maker, need, next action, close date, start date, and payment date.' },
    ],
  },
  {
    slug: 'new-sales-are-not-growth-if-they-replace-churn',
    title: 'New Sales Are Not Growth If They Only Replace Churn | Kefiw',
    description: 'Separate replacement revenue from actual growth so acquisition does not hide weak retention.',
    h1: 'New Sales Are Not Growth If They Only Replace Churn',
    tagline: 'New sales can hide a leaking business.',
    promise: 'Show how acquisition can mask churn, replacement revenue, and weak retention.',
    keywords: ['new sales replacing churn', 'churn hiding growth problem', 'churn replacement revenue'],
    primaryCalculator: '/business/churn-replacement-calculator/',
    calculatorLinks: [
      { situation: 'Calculate replacement revenue', label: 'Churn Replacement Calculator', href: '/business/churn-replacement-calculator/' },
      { situation: 'Find churn leak', label: 'Churn Calculator', href: '/business/churn-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A month can show new sales and still not show real growth if those sales replace canceled customers, failed payments, downgrades, or lost retainers.' },
      { heading: 'The better move', body: 'Track gross lost revenue, expansion, recovery, replacement deals, and growth revenue separately.' },
    ],
  },
  {
    slug: 'why-recurring-revenue-is-not-automatically-stable',
    title: 'Why Recurring Revenue Is Not Automatically Stable | Kefiw',
    description: 'Understand why subscriptions, retainers, memberships, and recurring services can still be fragile.',
    h1: 'Why Recurring Revenue Is Not Automatically Stable',
    tagline: 'Recurring billing is not the same as recurring value.',
    promise: 'Explain why subscriptions, retainers, and memberships can still be fragile if usage, renewal, value, or support economics are weak.',
    keywords: ['recurring revenue not stable', 'retainer churn', 'subscription churn problem'],
    primaryCalculator: '/business/subscription-pricing-calculator/',
    calculatorLinks: [
      { situation: 'Price subscription economics', label: 'Subscription Pricing Calculator', href: '/business/subscription-pricing-calculator/' },
      { situation: 'Check retainer stability', label: 'Retainer Stability Calculator', href: '/business/retainer-stability-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Monthly billing can hide churn, over-servicing, weak usage, generous discounts, failed payments, and support costs.' },
      { heading: 'The better move', body: 'Check retention, value, usage, support cost, payment failure, annual discount, renewal risk, and replacement revenue before calling the model stable.' },
    ],
  },
  {
    slug: 'what-if-clients-pay-late',
    title: 'What If Clients Pay 30 Days Late? | Kefiw',
    description: 'Model the cash-flow impact of late invoices, net terms, deposits, reminders, payroll timing, and owner pay.',
    h1: 'What If Clients Pay Late?',
    tagline: 'Late revenue is not the same as revenue.',
    promise: 'Show how payment delay can break otherwise profitable work.',
    keywords: ['late payment cash flow calculator', 'what if clients pay late', 'net 30 cash flow calculator'],
    primaryCalculator: '/business/payment-delay-impact-calculator/',
    calculatorLinks: [
      { situation: 'Model late-payment drag', label: 'Payment Delay Impact', href: '/business/payment-delay-impact-calculator/' },
      { situation: 'Use follow-up script', label: 'Late Invoice Follow-Up Script', href: '/business/revenue/templates/late-invoice-follow-up-script/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A profitable invoice can still create cash strain when terms, approvals, payment delays, and collections move slower than payroll or tax reserve.' },
      { heading: 'The better move', body: 'Model late-payment exposure, then adjust deposits, terms, reminders, and concentration before delivery starts.' },
    ],
  },
  {
    slug: 'revenue-growth-but-no-profit',
    title: 'Revenue Growth but No Profit | Kefiw',
    description: 'Diagnose why revenue can rise while profit stays flat because delivery, support, payroll, software, or owner workload rises too.',
    h1: 'Revenue Growth but No Profit',
    tagline: 'Revenue can grow while profit stays flat.',
    promise: 'Find whether growth is improving margin or just adding cost, complexity, and capacity pressure.',
    keywords: ['revenue growth but no profit', 'revenue up profit down', 'operating leverage small business'],
    primaryCalculator: '/business/operating-leverage-calculator/',
    calculatorLinks: [
      { situation: 'Model leverage', label: 'Operating Leverage Calculator', href: '/business/operating-leverage-calculator/' },
      { situation: 'Check profit floor', label: 'Profit Calculator', href: '/business/profit-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Growth feels like proof until costs, capacity, support, software, contractors, payroll, and owner time rise alongside it.' },
      { heading: 'The better move', body: 'Compare current profit with the growth scenario after variable cost, fixed cost, capacity investment, and cash timing.' },
    ],
  },
  {
    slug: 'growth-makes-the-business-heavier',
    title: 'Growth Makes the Business Heavier | Kefiw',
    description: 'Understand why growth can make operations louder, margins thinner, and owner time worse if capacity and costs rise first.',
    h1: 'Growth Makes the Business Heavier',
    tagline: 'Bigger is not automatically lighter.',
    promise: 'Show why growth can reduce profit if delivery cost, support, hiring, software, or owner workload rises faster than revenue.',
    keywords: ['growth makes business worse', 'revenue growth but no profit', 'growth makes profit worse calculator'],
    primaryCalculator: '/business/operating-leverage-calculator/',
    calculatorLinks: [
      { situation: 'Test growth quality', label: 'Operating Leverage Calculator', href: '/business/operating-leverage-calculator/' },
      { situation: 'Check runway first', label: 'Cash Runway Calculator', href: '/business/small-business-cash-runway-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A business can grow revenue and still become harder to run if every new dollar requires more coordination, support, tools, hiring, or owner attention.' },
      { heading: 'The better move', body: 'Use growth-quality math: margin, fixed costs, variable costs, cash timing, capacity, owner time, and churn before celebrating top-line growth.' },
    ],
  },
];

export const revenueTemplatePages: RevenueContentPage[] = [
  {
    slug: 'revenue-forecast-worksheet',
    title: 'Revenue Forecast Worksheet for Small Businesses | Kefiw',
    description: 'A worksheet for current revenue, expected deals, close rate, churn, client concentration, payment timing, risk, and next action.',
    h1: 'Revenue Forecast Worksheet',
    tagline: 'Forecast the money, then test what could break it.',
    promise: 'Organize forecast inputs, scenarios, main risk, and next action.',
    keywords: ['revenue forecast worksheet', 'small business revenue forecast template'],
    primaryCalculator: '/business/revenue-forecast-calculator/',
    calculatorLinks: [{ situation: 'Run the forecast', label: 'Revenue Forecast Calculator', href: '/business/revenue-forecast-calculator/' }],
    sections: [
      { heading: 'Fields', body: 'Current monthly revenue, recurring revenue, project revenue, expected new deals, average deal size, close rate, sales cycle, expected churn, largest client revenue, payment terms, collection delay, conservative forecast, expected forecast, aggressive forecast, main risk, next action.' },
    ],
  },
  {
    slug: 'client-concentration-tracker',
    title: 'Client Concentration Tracker | Kefiw',
    description: 'Track client revenue, margin, payment terms, renewal dates, replacement time, owner dependency, risk level, and next action.',
    h1: 'Client Concentration Tracker',
    tagline: 'Know when one client becomes too important.',
    promise: 'Track top-client risk before it drives hiring, spending, or panic.',
    keywords: ['client concentration tracker', 'client concentration risk template'],
    primaryCalculator: '/business/client-concentration-risk-calculator/',
    calculatorLinks: [{ situation: 'Measure concentration', label: 'Client Concentration Risk', href: '/business/client-concentration-risk-calculator/' }],
    sections: [
      { heading: 'Fields', body: 'Client, monthly revenue, annual revenue, gross margin, payment terms, renewal date, replacement time, owner dependency, risk level, action.' },
    ],
  },
  {
    slug: 'sales-pipeline-review-template',
    title: 'Sales Pipeline Review Template | Kefiw',
    description: 'Review deal value, stage, decision-maker, budget, next step, last activity, close date, payment date, probability, risk, and next action.',
    h1: 'Sales Pipeline Review Template',
    tagline: 'Do not forecast deals that have gone quiet.',
    promise: 'Remove stale, vague, and no-next-step deals from the revenue forecast.',
    keywords: ['sales pipeline review template', 'pipeline review template small business'],
    primaryCalculator: '/business/sales-pipeline-reality-check/',
    calculatorLinks: [{ situation: 'Score pipeline', label: 'Sales Pipeline Reality Check', href: '/business/sales-pipeline-reality-check/' }],
    sections: [
      { heading: 'Fields', body: 'Deal, value, stage, decision-maker confirmed, budget confirmed, next step scheduled, last activity date, expected close date, expected payment date, close probability, risk, next action.' },
    ],
  },
  {
    slug: 'payment-terms-script',
    title: 'Payment Terms Script for Small Businesses | Kefiw',
    description: 'A clear script for deposits, remaining balance, due date, and payment expectations before cash flow becomes emotional.',
    h1: 'Payment Terms Script',
    tagline: 'Protect cash without sounding defensive.',
    promise: 'Set payment expectations before delivery starts.',
    keywords: ['payment terms script', 'deposit request script small business'],
    primaryCalculator: '/business/payment-delay-impact-calculator/',
    calculatorLinks: [{ situation: 'Model payment delay', label: 'Payment Delay Impact', href: '/business/payment-delay-impact-calculator/' }],
    sections: [
      { heading: 'Example', body: 'For this project, I require a deposit of [amount or percentage] to reserve the work and start the engagement. The remaining balance is due [terms]. This keeps the schedule clear, protects both sides, and prevents the project from depending on delayed payment after delivery.' },
    ],
  },
  {
    slug: 'late-invoice-follow-up-script',
    title: 'Late Invoice Follow-Up Script | Kefiw',
    description: 'A direct but calm late-invoice follow-up message for small businesses, freelancers, consultants, and agencies.',
    h1: 'Late Invoice Follow-Up Script',
    tagline: 'Be direct before cash flow becomes emotional.',
    promise: 'Follow up on late payment without turning the message into an argument.',
    keywords: ['late invoice follow up script', 'late payment email template'],
    primaryCalculator: '/business/payment-delay-impact-calculator/',
    calculatorLinks: [{ situation: 'Check cash impact', label: 'Payment Delay Impact', href: '/business/payment-delay-impact-calculator/' }],
    sections: [
      { heading: 'Example', body: 'Hi [Name], just checking in on invoice [number], which was due on [date]. Could you confirm when payment is scheduled? If there is anything needed from my side to process it, please let me know. Thanks, [Name].' },
    ],
  },
  {
    slug: 'lost-client-postmortem-template',
    title: 'Lost Client Postmortem Template | Kefiw',
    description: 'Turn lost revenue into better assumptions by reviewing warning signs, renewal timing, usage, pricing, service, relationship, and replacement revenue.',
    h1: 'Lost Client Postmortem Template',
    tagline: 'Turn lost revenue into better assumptions.',
    promise: 'Use client loss to improve the next forecast instead of only replacing the revenue.',
    keywords: ['lost client postmortem template', 'client churn postmortem'],
    primaryCalculator: '/business/churn-replacement-calculator/',
    calculatorLinks: [{ situation: 'Calculate replacement need', label: 'Churn Replacement Calculator', href: '/business/churn-replacement-calculator/' }],
    sections: [
      { heading: 'Sections', body: 'Why the client left, warning signs, renewal date missed, usage/value issue, pricing issue, service issue, relationship issue, replacement revenue needed, process change, forecast update.' },
    ],
  },
  {
    slug: 'retainer-renewal-review-template',
    title: 'Retainer Renewal Review Template | Kefiw',
    description: 'Review work completed, outcomes, utilization, over-servicing, client goals, renewal risk, price change, scope change, and next 90-day plan.',
    h1: 'Retainer Renewal Review Template',
    tagline: 'Renew the value, not just the invoice.',
    promise: 'Prepare retainer renewals with scope, outcomes, utilization, and pricing visible.',
    keywords: ['retainer renewal review template', 'retainer renewal checklist'],
    primaryCalculator: '/business/retainer-stability-calculator/',
    calculatorLinks: [{ situation: 'Check retainer stability', label: 'Retainer Stability Calculator', href: '/business/retainer-stability-calculator/' }],
    sections: [
      { heading: 'Sections', body: 'Work completed, outcomes delivered, utilization, over-servicing, client goals, renewal risk, price change, scope change, next 90-day plan.' },
    ],
  },
];

export function revenueGuideHref(page: Pick<RevenueContentPage, 'slug'>): string {
  return `/business/revenue/guides/${page.slug}/`;
}

export function revenueTemplateHref(page: Pick<RevenueContentPage, 'slug'>): string {
  return `/business/revenue/templates/${page.slug}/`;
}

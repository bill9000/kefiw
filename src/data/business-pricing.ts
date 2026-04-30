export interface PricingRouteCard {
  situation: string;
  href: string;
  label: string;
}

export interface PricingContentSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface PricingContentPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  promise: string;
  keywords: string[];
  primaryCalculator?: string;
  calculatorLinks: PricingRouteCard[];
  sections: PricingContentSection[];
}

export const pricingSituationRoutes: PricingRouteCard[] = [
  { situation: 'I do not know what hourly rate to charge.', label: 'Minimum Viable Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/' },
  { situation: 'My price feels high, but I am still not making enough.', label: 'Rate + Scope Creep', href: '/business/scope-creep-cost-calculator/' },
  { situation: 'I need to know if a discount is safe.', label: 'Discount Damage', href: '/business/discount-damage-calculator/' },
  { situation: 'I am busy but not profitable.', label: 'Profit + Client Profitability', href: '/business/client-profitability-calculator/' },
  { situation: 'I need a walk-away number.', label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/' },
  { situation: 'I am choosing hourly vs project vs retainer.', label: 'Pricing Model Comparison', href: '/business/pricing-model-comparison/' },
  { situation: 'I need to raise prices.', label: 'Price Increase Planner', href: '/business/price-increase-planner/' },
  { situation: 'I need to know how many clients cover costs.', label: 'Break-Even Calculator', href: '/business/break-even-calculator/' },
  { situation: 'I sell products or marked-up services.', label: 'Markup & Margin', href: '/business/markup-margin-calculator/' },
];

export const pricingTrackCards: PricingRouteCard[] = [
  { situation: 'Price My First Offer', label: 'Start with rate floor', href: '/business/minimum-viable-freelance-rate-calculator/' },
  { situation: 'Raise My Rates', label: 'Plan the increase', href: '/business/price-increase-planner/' },
  { situation: 'Fix a Low-Margin Client', label: 'Check client profitability', href: '/business/client-profitability-calculator/' },
  { situation: 'Stop Scope Creep', label: 'Count unpaid work', href: '/business/scope-creep-cost-calculator/' },
  { situation: 'Choose a Pricing Model', label: 'Compare models', href: '/business/pricing-model-comparison/' },
  { situation: 'Make Retainers Work', label: 'Set boundaries', href: '/business/pricing/guides/retainer-pricing-without-unlimited-access/' },
];

export const pricingGuidePages: PricingContentPage[] = [
  {
    slug: 'billable-hours-mistake',
    title: 'The Billable-Hours Mistake: Forty Working Hours Is Not Forty Billable Hours | Kefiw',
    description: 'See why freelance rates collapse when sales, admin, revisions, meetings, and downtime are ignored.',
    h1: 'The Billable-Hours Mistake',
    tagline: 'Forty working hours is not forty billable hours.',
    promise: 'Show why freelance rates collapse when sales, admin, revisions, meetings, and downtime are ignored.',
    keywords: ['freelance billable hours', 'how many hours can freelancers bill', 'billable hours vs working hours', 'freelance rate billable hours'],
    primaryCalculator: '/business/minimum-viable-freelance-rate-calculator/',
    calculatorLinks: [
      { situation: 'Find your rate floor', label: 'Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/' },
      { situation: 'Count project overrun', label: 'Scope Creep Cost', href: '/business/scope-creep-cost-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'A freelancer can work 40 hours and bill 20. The missing 20 hours still have to be funded by the rate.',
        bullets: ['Sales calls and proposals', 'Admin and bookkeeping', 'Client messages and meetings', 'Revisions and support', 'Slow weeks and unpaid time off'],
      },
      {
        heading: 'The better move',
        body: 'Price from annual billable capacity, not from a full-time employee comparison. If the floor feels high, fix utilization, scope, or offer structure before cutting the rate.',
      },
    ],
  },
  {
    slug: 'discount-mistake',
    title: 'The Discount Mistake: How Discounts Reduce Profit | Kefiw',
    description: 'Understand how discounts reduce profit, increase required volume, and can train clients to question price.',
    h1: 'The Discount Mistake',
    tagline: 'The client sees savings. You feel margin loss.',
    promise: 'Explain how discounts reduce profit, increase required volume, and can train clients to question price.',
    keywords: ['how discounts affect profit', 'should I offer client discounts', 'discount margin mistake', 'discount vs payment plan'],
    primaryCalculator: '/business/discount-damage-calculator/',
    calculatorLinks: [
      { situation: 'Test a discount', label: 'Discount Damage', href: '/business/discount-damage-calculator/' },
      { situation: 'Refuse without fighting', label: 'Discount Refusal Script', href: '/business/pricing/templates/discount-refusal-script/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Discounts are taken from revenue, but they usually land in profit. The work rarely gets 20 percent easier because the price dropped 20 percent.',
      },
      {
        heading: 'The better move',
        body: 'Offer a smaller scope, payment plan, delayed start, or removed support before discounting the same work.',
      },
    ],
  },
  {
    slug: 'retainer-pricing-without-unlimited-access',
    title: 'Retainer Pricing Without Selling Unlimited Access | Kefiw',
    description: 'Price retainers without turning availability, responsiveness, and emotional labor into free work.',
    h1: 'Retainer Pricing Without Selling Unlimited Access',
    tagline: 'A retainer is not unlimited access.',
    promise: 'Help service providers price retainers without selling availability, responsiveness, or emotional labor for free.',
    keywords: ['retainer pricing mistake', 'how to price a retainer', 'retainer scope creep', 'project vs retainer'],
    primaryCalculator: '/business/pricing-model-comparison/',
    calculatorLinks: [
      { situation: 'Choose a model', label: 'Pricing Model Comparison', href: '/business/pricing-model-comparison/' },
      { situation: 'Check client profitability', label: 'Client Profitability', href: '/business/client-profitability-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'A retainer becomes weak when the client buys priority, availability, support, and ambiguity for one flat fee.',
        bullets: ['Define response times', 'Cap meetings and support', 'Separate projects from access', 'Set rollover or expiration rules'],
      },
      {
        heading: 'The better move',
        body: 'Price the retainer around a defined capacity, outcome, or service rhythm. Anything outside that rhythm needs a change-order path.',
      },
    ],
  },
  {
    slug: 'scope-creep-mistake',
    title: 'The Scope Creep Mistake: Small Asks Become Unpaid Work | Kefiw',
    description: 'Show how extra revisions, meetings, and support reduce effective hourly rate.',
    h1: 'The Scope Creep Mistake',
    tagline: 'Small asks become unpaid work when nobody counts them.',
    promise: 'Show how extra revisions, meetings, and support reduce effective hourly rate.',
    keywords: ['scope creep cost', 'unpaid revisions client', 'how to prevent scope creep', 'client keeps asking for changes'],
    primaryCalculator: '/business/scope-creep-cost-calculator/',
    calculatorLinks: [
      { situation: 'Count creep', label: 'Scope Creep Cost', href: '/business/scope-creep-cost-calculator/' },
      { situation: 'Reply to the client', label: 'Scope Creep Response', href: '/business/pricing/templates/scope-creep-response-template/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Scope creep often looks like being helpful. It becomes expensive when help becomes the normal way the work expands.',
      },
      {
        heading: 'The better move',
        body: 'Define deliverables, revision rounds, communication expectations, and change-order pricing before the project starts.',
      },
    ],
  },
  {
    slug: 'busy-but-not-profitable',
    title: 'Busy but Not Profitable: Why Revenue Does Not Become Profit | Kefiw',
    description: 'Explain why revenue, profit, cash flow, and owner pay are not the same thing.',
    h1: 'Busy but Not Profitable',
    tagline: 'A full calendar can hide a weak business.',
    promise: 'Explain why revenue, profit, cash flow, and owner pay are not the same thing.',
    keywords: ['busy but not profitable', 'business revenue but no profit', 'why am I working so much but making little', 'small business profit problem'],
    primaryCalculator: '/business/profit-calculator/',
    calculatorLinks: [
      { situation: 'See whole-business profit', label: 'Profit Calculator', href: '/business/profit-calculator/' },
      { situation: 'Find draining clients', label: 'Client Profitability', href: '/business/client-profitability-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'A business can be busy because every project requires too much support, too many meetings, too many revisions, and too little margin.',
      },
      {
        heading: 'The better move',
        body: 'Rank work by retained profit after owner pay, delivery time, support burden, payment delay, and tax reserve.',
      },
    ],
  },
  {
    slug: 'why-your-freelance-rate-feels-high',
    title: 'Why Your Freelance Rate Feels High but Take-Home Feels Low | Kefiw',
    description: 'Understand why taxes, expenses, unpaid time, and utilization make a sustainable freelance rate feel uncomfortable.',
    h1: 'Why Your Freelance Rate Feels High',
    tagline: 'The client sees the hour. You fund the business around it.',
    promise: 'Show why the rate can feel high while take-home still feels low.',
    keywords: ['why does my freelance rate feel too high', 'freelance rate take home low', 'freelance pricing hidden costs'],
    primaryCalculator: '/business/minimum-viable-freelance-rate-calculator/',
    calculatorLinks: [
      { situation: 'Run the floor', label: 'Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/' },
      { situation: 'Count expenses', label: 'Expense Budget', href: '/business/business-expense-budget-calculator/' },
    ],
    sections: [
      { heading: 'The hidden math', body: 'The rate funds taxes, software, admin, proposals, client communication, time off, slow months, and risk.' },
      { heading: 'The better move', body: 'Do not lower the rate until you know whether utilization, scope, or expenses are the real issue.' },
    ],
  },
  {
    slug: 'what-if-i-only-bill-20-hours',
    title: 'What If I Only Bill 20 Hours a Week? | Kefiw',
    description: 'Model the pricing reality of low billable utilization for freelancers, consultants, and solo operators.',
    h1: 'What If I Only Bill 20 Hours a Week?',
    tagline: 'Low utilization requires a higher rate, not shame.',
    promise: 'Turn part-time billable capacity into a sustainable price floor.',
    keywords: ['freelance rate if I only bill 20 hours', 'consultant billing 20 hours a week', 'freelance utilization pricing'],
    primaryCalculator: '/business/minimum-viable-freelance-rate-calculator/',
    calculatorLinks: [
      { situation: 'Set utilization', label: 'Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/' },
      { situation: 'Check break-even', label: 'Break-Even', href: '/business/break-even-calculator/' },
    ],
    sections: [
      { heading: 'The constraint', body: 'If only half the week is billable, each billable hour funds more of the business.' },
      { heading: 'The better move', body: 'Improve paid utilization, package work, reduce unpaid admin, or narrow scope before lowering price.' },
    ],
  },
  {
    slug: 'how-discounts-hurt-profit',
    title: 'How Much Does a 20% Discount Hurt Profit? | Kefiw',
    description: 'Calculate why a discount can remove far more than 20 percent of profit.',
    h1: 'How Discounts Hurt Profit',
    tagline: 'A 20 percent discount can erase most of the margin.',
    promise: 'Show the extra volume required to recover from a discounted price.',
    keywords: ['how much does a 20 discount hurt profit', 'discount profit calculator', 'discount margin math'],
    primaryCalculator: '/business/discount-damage-calculator/',
    calculatorLinks: [
      { situation: 'Run discount math', label: 'Discount Damage', href: '/business/discount-damage-calculator/' },
      { situation: 'Check margin', label: 'Markup & Margin', href: '/business/markup-margin-calculator/' },
    ],
    sections: [
      { heading: 'The margin problem', body: 'When cost stays the same, the discount comes out of the profit dollars left after cost.' },
      { heading: 'The better move', body: 'Use smaller scope, delayed timing, or payment terms before cutting the same deliverable.' },
    ],
  },
  {
    slug: 'discount-vs-payment-plan',
    title: 'Discount vs Payment Plan: Which Hurts Less? | Kefiw',
    description: 'Compare whether a client budget problem is better solved with scope, terms, or price reduction.',
    h1: 'Discount vs Payment Plan',
    tagline: 'Budget pressure is not always a price problem.',
    promise: 'Show when payment timing can solve friction without reducing price.',
    keywords: ['discount vs payment plan', 'client wants discount payment plan', 'discount alternative for clients'],
    primaryCalculator: '/business/discount-damage-calculator/',
    calculatorLinks: [
      { situation: 'Test the discount', label: 'Discount Damage', href: '/business/discount-damage-calculator/' },
      { situation: 'Find the floor', label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/' },
    ],
    sections: [
      { heading: 'The decision', body: 'If the client values the full scope but has timing friction, a payment plan may protect margin better than a discount.' },
      { heading: 'The boundary', body: 'Payment plans still need collection rules, deposits, milestones, and pause rights.' },
    ],
  },
  {
    slug: 'hourly-vs-project-vs-retainer',
    title: 'Hourly vs Project vs Retainer Pricing | Kefiw',
    description: 'Compare pricing models based on scope clarity, repeatability, support, and delivery risk.',
    h1: 'Hourly vs Project vs Retainer Pricing',
    tagline: 'The best model is the one that matches the work.',
    promise: 'Compare common service pricing models without pretending one model is always more mature.',
    keywords: ['hourly vs project pricing', 'project vs retainer pricing', 'freelance pricing models'],
    primaryCalculator: '/business/pricing-model-comparison/',
    calculatorLinks: [
      { situation: 'Compare models', label: 'Pricing Model Comparison', href: '/business/pricing-model-comparison/' },
      { situation: 'Find the floor', label: 'Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/' },
    ],
    sections: [
      { heading: 'The comparison', body: 'Hourly fits uncertainty. Project fits clear deliverables. Retainer fits recurring access or capacity with boundaries.' },
      { heading: 'The better move', body: 'Choose the model after checking scope clarity, revision risk, support, and effective hourly floor.' },
    ],
  },
  {
    slug: 'client-profitability-guide',
    title: 'How to Identify Your Least Profitable Clients | Kefiw',
    description: 'Find which clients are quietly costly after support, meetings, revisions, discounts, and payment delay.',
    h1: 'How to Identify Your Least Profitable Clients',
    tagline: 'Revenue rank is not profit rank.',
    promise: 'Sort clients by profit after attention, complexity, delay, and support burden.',
    keywords: ['least profitable clients', 'low margin clients', 'client profitability guide', 'which clients are profitable'],
    primaryCalculator: '/business/client-profitability-calculator/',
    calculatorLinks: [
      { situation: 'Score a client', label: 'Client Profitability', href: '/business/client-profitability-calculator/' },
      { situation: 'Plan a price increase', label: 'Price Increase Planner', href: '/business/price-increase-planner/' },
    ],
    sections: [
      { heading: 'The signal', body: 'Low-margin clients usually show up as meeting load, support load, payment delay, vague scope, or constant exceptions.' },
      { heading: 'The better move', body: 'Raise, rescope, systematize, or exit based on profit and concentration risk.' },
    ],
  },
];

export const pricingTemplatePages: PricingContentPage[] = [
  {
    slug: 'price-increase-email-template',
    title: 'Price Increase Email Template for Freelancers and Small Businesses | Kefiw',
    description: 'Use clear price-increase email scripts for existing clients, retainers, project clients, annual renewals, and expanded scope.',
    h1: 'Price Increase Email Template',
    tagline: 'Raise prices without overexplaining.',
    promise: 'Use concise scripts for price increases without turning the message into an apology.',
    keywords: ['price increase email template', 'raising freelance rates email', 'client price increase script'],
    primaryCalculator: '/business/price-increase-planner/',
    calculatorLinks: [
      { situation: 'Plan the increase first', label: 'Price Increase Planner', href: '/business/price-increase-planner/' },
      { situation: 'Find low-margin clients', label: 'Client Profitability', href: '/business/client-profitability-calculator/' },
    ],
    sections: [
      {
        heading: 'Base script',
        body: 'Subject: Updated pricing for [service]\n\nHi [Name],\n\nI wanted to let you know that my pricing for [service] will be updated to [new price] starting [date].\n\nThis reflects the current scope of the work, the level of support included, and the time required to continue delivering it well.\n\nNothing changes immediately. Your current rate will stay in place through [date], and I am happy to confirm the updated scope before the new rate begins.\n\nBest,\n[Name]',
      },
      {
        heading: 'Versions to adapt',
        body: 'Use the same structure for existing clients, retainer renewals, project clients, annual renewals, cost increases, expanded scope, or premium repositioning.',
      },
    ],
  },
  {
    slug: 'discount-refusal-script',
    title: 'How to Say No to a Discount Without Sounding Defensive | Kefiw',
    description: 'Use scripts that protect the price by reducing scope instead of arguing with the client.',
    h1: 'Discount Refusal Script',
    tagline: 'Protect the price without turning the conversation into a fight.',
    promise: 'Use a scope-based response when a client asks for a discount.',
    keywords: ['how to say no to a discount', 'client wants discount script', 'discount refusal script'],
    primaryCalculator: '/business/discount-damage-calculator/',
    calculatorLinks: [
      { situation: 'Calculate damage', label: 'Discount Damage', href: '/business/discount-damage-calculator/' },
      { situation: 'Find floor', label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/' },
    ],
    sections: [
      {
        heading: 'Base script',
        body: 'I understand the budget constraint. Rather than discounting the full scope, I would suggest reducing the scope so the price and deliverables stay aligned.\n\nAt [price], I can include [reduced scope].\nAt the original scope, the price would remain [original price].',
      },
      {
        heading: 'Why it works',
        body: 'The script keeps the client problem visible without teaching them that the same scope has two prices.',
      },
    ],
  },
  {
    slug: 'scope-creep-response-template',
    title: 'Scope Creep Response Template | Kefiw',
    description: 'Use a clear response when a client asks for work outside the priced scope.',
    h1: 'Scope Creep Response Template',
    tagline: 'Be helpful without making unpaid work normal.',
    promise: 'Respond to extra requests without turning every small ask into free work.',
    keywords: ['scope creep response template', 'client asks for extra work script', 'change order response template'],
    primaryCalculator: '/business/scope-creep-cost-calculator/',
    calculatorLinks: [
      { situation: 'Count creep', label: 'Scope Creep Cost', href: '/business/scope-creep-cost-calculator/' },
      { situation: 'Check price floor', label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/' },
    ],
    sections: [
      {
        heading: 'Base script',
        body: 'That request makes sense, but it falls outside the scope we priced.\n\nI can add it as a separate change for [price], or we can swap it with [existing deliverable] to keep the project inside the original budget.',
      },
      {
        heading: 'Boundary note',
        body: 'The point is not to be rigid. The point is to keep price, scope, and delivery effort aligned.',
      },
    ],
  },
  {
    slug: 'walk-away-price-worksheet',
    title: 'Walk-Away Price Worksheet | Kefiw',
    description: 'Document your minimum acceptable price, healthy price, premium price, rescope options, and reasons not to accept below floor.',
    h1: 'Walk-Away Price Worksheet',
    tagline: 'Know the number before the negotiation starts.',
    promise: 'Write down the floor, rescope options, strategic exceptions, and red flags before negotiating.',
    keywords: ['walk away price worksheet', 'minimum project price worksheet', 'price floor worksheet freelancer'],
    primaryCalculator: '/business/walk-away-price-calculator/',
    calculatorLinks: [
      { situation: 'Run the floor', label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/' },
      { situation: 'Choose model', label: 'Pricing Model Comparison', href: '/business/pricing-model-comparison/' },
    ],
    sections: [
      {
        heading: 'Worksheet sections',
        body: 'Fill in minimum acceptable price, healthy price, premium price, scope reduction options, reasons to accept below floor, reasons not to accept below floor, client red flags, and opportunity cost.',
      },
      {
        heading: 'Negotiation rule',
        body: 'If the client budget is below the floor, change scope, timing, support, or terms before changing price.',
      },
    ],
  },
  {
    slug: 'project-pricing-scope-template',
    title: 'Project Pricing Scope Template | Kefiw',
    description: 'Define deliverables, revision limits, meetings, response time, support, exclusions, and change-order rules before quoting project work.',
    h1: 'Project Pricing Scope Template',
    tagline: 'Clear scope is margin protection.',
    promise: 'Use a scope checklist before fixed-price project work becomes open-ended.',
    keywords: ['project pricing scope template', 'revision limit template', 'scope of work pricing template'],
    primaryCalculator: '/business/scope-creep-cost-calculator/',
    calculatorLinks: [
      { situation: 'Stress-test scope', label: 'Scope Creep Cost', href: '/business/scope-creep-cost-calculator/' },
      { situation: 'Score the price', label: 'Pricing Confidence Score', href: '/business/pricing-confidence-score-calculator/' },
    ],
    sections: [
      {
        heading: 'Checklist',
        body: 'Define deliverables, included rounds, meeting cadence, response time, support window, excluded work, client responsibilities, payment milestones, and change-order pricing.',
      },
      {
        heading: 'Use it when',
        body: 'Use this before any fixed-price project, retainer renewal, or discounted scope.',
      },
    ],
  },
];

export function pricingGuideHref(pageOrSlug: PricingContentPage | string): string {
  const slug = typeof pageOrSlug === 'string' ? pageOrSlug : pageOrSlug.slug;
  return `/business/pricing/guides/${slug}/`;
}

export function pricingTemplateHref(pageOrSlug: PricingContentPage | string): string {
  const slug = typeof pageOrSlug === 'string' ? pageOrSlug : pageOrSlug.slug;
  return `/business/pricing/templates/${slug}/`;
}

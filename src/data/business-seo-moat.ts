import { cloudSaasGuideHref, cloudSaasGuidePages, cloudSaasTemplateHref, cloudSaasTemplatePages } from './business-cloud-saas';
import { hiringGuideHref, hiringGuidePages, hiringTemplateHref, hiringTemplatePages } from './business-hiring';
import { pricingGuideHref, pricingGuidePages, pricingTemplateHref, pricingTemplatePages } from './business-pricing';
import { revenueGuideHref, revenueGuidePages, revenueTemplateHref, revenueTemplatePages } from './business-revenue';
import { taxGuideHref, taxGuidePages, taxTemplateHref, taxTemplatePages } from './business-tax';

export interface BusinessHubItem {
  title: string;
  href: string;
  tagline?: string;
  promise?: string;
  primaryCalculator?: string;
}

export interface BusinessSectionInventory {
  id: string;
  label: string;
  tagline: string;
  guides: BusinessHubItem[];
  templates: BusinessHubItem[];
}

function guideItem(page: { h1: string; tagline: string; promise: string; primaryCalculator?: string }, href: string): BusinessHubItem {
  return {
    title: page.h1,
    href,
    tagline: page.tagline,
    promise: page.promise,
    primaryCalculator: page.primaryCalculator,
  };
}

export const businessSectionInventories: BusinessSectionInventory[] = [
  {
    id: 'pricing',
    label: 'Pricing',
    tagline: 'Price the work so the work can survive.',
    guides: pricingGuidePages.map((page) => guideItem(page, pricingGuideHref(page))),
    templates: pricingTemplatePages.map((page) => guideItem(page, pricingTemplateHref(page))),
  },
  {
    id: 'hiring',
    label: 'Hiring',
    tagline: 'Do not hire your way into a heavier business.',
    guides: hiringGuidePages.map((page) => guideItem(page, hiringGuideHref(page))),
    templates: hiringTemplatePages.map((page) => guideItem(page, hiringTemplateHref(page))),
  },
  {
    id: 'tax',
    label: 'Tax',
    tagline: 'Know what is not really yours yet.',
    guides: taxGuidePages.map((page) => guideItem(page, taxGuideHref(page))),
    templates: taxTemplatePages.map((page) => guideItem(page, taxTemplateHref(page))),
  },
  {
    id: 'revenue',
    label: 'Revenue',
    tagline: 'Make revenue feel less imaginary.',
    guides: revenueGuidePages.map((page) => guideItem(page, revenueGuideHref(page))),
    templates: revenueTemplatePages.map((page) => guideItem(page, revenueTemplateHref(page))),
  },
  {
    id: 'cloud-saas',
    label: 'Cloud, SaaS, and AI',
    tagline: 'Your tools are part of payroll now.',
    guides: cloudSaasGuidePages.map((page) => guideItem(page, cloudSaasGuideHref(page))),
    templates: cloudSaasTemplatePages.map((page) => guideItem(page, cloudSaasTemplateHref(page))),
  },
];

export const moatPageTypes = [
  { type: 'Calculator pages', purpose: 'Capture calculator intent, produce a result, expose assumptions, link to guides and templates, and monetize after value.' },
  { type: 'What-if pages', purpose: 'Capture anxious scenario searches where the user is close to action.' },
  { type: 'Mistake pages', purpose: 'Explain why a number feels wrong and name the hidden cost or fragile assumption.' },
  { type: 'Threshold pages', purpose: 'Target when-is-it-worth-it decisions around hiring, S-corp, software, cloud, pricing, and client concentration.' },
  { type: 'Comparison pages', purpose: 'Resolve decision conflict with hidden costs, fit criteria, calculator CTAs, and what most advice leaves out.' },
  { type: 'Scorecard pages', purpose: 'Build branded diagnostic concepts such as Hiring Readiness Score, Revenue Fragility Score, and Software Spend Health Score.' },
  { type: 'Template pages', purpose: 'Turn calculator results into emails, worksheets, checklists, scripts, and decision memos.' },
  { type: 'Persona pages', purpose: 'Help users self-identify by role and start with the first three numbers that matter.' },
  { type: 'Methodology and trust pages', purpose: 'Explain source discipline, editorial rules, monetization boundaries, and publishing gates.' },
];

export const seoOpportunityFactors = [
  { factor: 'Decision intensity', question: 'Is the user about to make a money decision?' },
  { factor: 'Emotional specificity', question: 'Does the query reveal stress, risk, doubt, or urgency?' },
  { factor: 'Calculator fit', question: 'Can an interactive tool answer this better than an article?' },
  { factor: 'Giant gap', question: 'Are big sites covering the term generically but not emotionally or operationally?' },
  { factor: 'Monetization fit', question: 'Does the problem naturally connect to useful tools or services?' },
  { factor: 'Trust risk', question: 'Does the page need source verification or careful wording?' },
  { factor: 'Repeat usefulness', question: 'Would a user come back to this tool more than once?' },
];

export const highestValueMoatPages = [
  {
    section: 'Pricing',
    pages: ['Why Your Freelance Rate Feels High', 'What If I Only Bill 20 Hours a Week?', 'How Much Does a 20% Discount Hurt Profit?', 'Scope Creep Cost Calculator', 'Walk-Away Price Calculator', 'Busy but Not Profitable', 'Retainer Pricing Without Selling Unlimited Access', 'How to Say No to a Discount Without Sounding Defensive'],
  },
  {
    section: 'Hiring',
    pages: ['Founder Overwhelm Is Not a Job Description', 'Salary Is Only the First Line', 'First 90-Day Hire Cost Calculator', 'Should I Hire or Automate?', 'The Work You Should Delete Before Hiring', 'Contractor Trial Before Hiring', 'What If Revenue Drops After Hiring?', 'Hiring Readiness Score'],
  },
  {
    section: 'Tax',
    pages: ['How Much Should I Set Aside for Taxes as a Freelancer?', 'What If I Missed a Quarterly Tax Payment?', 'Dangerous Deduction Checker', 'Mixed-Use Expense Checker', 'S-Corp Worth It at $80k, $100k, or $150k', 'S-Corp Savings After Payroll Costs', 'Reasonable Salary Planner for Solo Consultants', 'S-Corp Not Worth It Yet'],
  },
  {
    section: 'Revenue',
    pages: ['Revenue Fragility Score', 'What If One Big Client Leaves?', 'Booked Revenue vs Collected Cash', 'Sales Pipeline Reality Check', 'Churn Replacement Calculator', 'Payment Delay Impact Calculator', 'Small Business Cash Runway Calculator', 'Growth Makes the Business Heavier'],
  },
  {
    section: 'Cloud, SaaS, and AI',
    pages: ['AI ROI Is Not Real Until the Workflow Changes', 'What If AI Saves Time but Adds Review Work?', 'Unused SaaS Seats Calculator', 'SaaS Renewal Risk Calculator', 'Duplicate Tool Audit', 'Cloud Bill Shock Simulator', 'Cloud Cost Per Customer Calculator', 'Lifetime Deal Trap Calculator'],
  },
];

export const templateCategories = [
  {
    category: 'Scripts',
    items: [
      { title: 'Price Increase Email', href: '/business/pricing/templates/price-increase-email-template/' },
      { title: 'Discount Refusal Script', href: '/business/pricing/templates/discount-refusal-script/' },
      { title: 'Scope Creep Response', href: '/business/pricing/templates/scope-creep-response-template/' },
      { title: 'Payment Terms Script', href: '/business/revenue/templates/payment-terms-script/' },
      { title: 'Late Invoice Follow-Up', href: '/business/revenue/templates/late-invoice-follow-up-script/' },
    ],
  },
  {
    category: 'Checklists',
    items: [
      { title: 'Weekly Tax Reserve Checklist', href: '/business/tax/templates/weekly-tax-reserve-checklist/' },
      { title: 'Quarterly Tax Review Checklist', href: '/business/tax/templates/quarterly-tax-review-checklist/' },
      { title: 'S-Corp Readiness Checklist', href: '/business/tax/templates/s-corp-readiness-checklist/' },
      { title: 'SaaS Renewal Calendar', href: '/business/cloud-saas/templates/saas-renewal-calendar/' },
      { title: 'First Employee Role Definition', href: '/business/hiring/templates/first-employee-role-definition-template/' },
    ],
  },
  {
    category: 'Worksheets',
    items: [
      { title: 'Revenue Forecast Worksheet', href: '/business/revenue/templates/revenue-forecast-worksheet/' },
      { title: 'Walk-Away Price Worksheet', href: '/business/pricing/templates/walk-away-price-worksheet/' },
      { title: 'AI ROI Worksheet', href: '/business/cloud-saas/templates/ai-roi-worksheet/' },
      { title: 'SaaS Audit Worksheet', href: '/business/cloud-saas/templates/saas-audit-worksheet/' },
      { title: 'Contractor Trial Project Brief', href: '/business/hiring/templates/contractor-trial-project-brief/' },
    ],
  },
  {
    category: 'Decision memos',
    items: [
      { title: 'Not Ready to Hire Yet Memo', href: '/business/hiring/templates/not-ready-to-hire-yet-memo/' },
      { title: 'Cloud Exit Decision Memo', href: '/business/cloud-saas/templates/cloud-exit-decision-memo/' },
      { title: 'CPA Question List', href: '/business/tax/templates/questions-to-ask-cpa-after-s-corp-calculator/' },
      { title: 'Lost Client Postmortem', href: '/business/revenue/templates/lost-client-postmortem-template/' },
      { title: 'Tool Owner Assignment', href: '/business/cloud-saas/templates/tool-owner-assignment-template/' },
    ],
  },
];

export const adviceLeavesOutSections = [
  {
    section: 'Pricing',
    ideas: ['Clients only see billable work, not the business around it.', 'Discounts come out of profit first.', 'Retainers can become unpaid availability.', 'Scope creep is often boundary failure plus unclear pricing.'],
  },
  {
    section: 'Hiring',
    ideas: ['Founder overwhelm is not a job description.', 'Salary is only the first line.', 'Hiring adds management work before it removes work.', 'Automation can make bad work permanent.'],
  },
  {
    section: 'Tax',
    ideas: ['Gross revenue is not take-home pay.', 'Deductions are only useful if records support them.', 'Quarterly taxes are a cash habit, not just a deadline.', 'S-corp savings are only savings after admin.'],
  },
  {
    section: 'Revenue',
    ideas: ['Forecasts are not promises.', 'Booked revenue is not collected cash.', 'New sales are not growth if they only replace churn.', 'One great client can become one giant risk.'],
  },
  {
    section: 'Cloud/SaaS',
    ideas: ['Tools are part of payroll now.', 'AI ROI is not real until workflow changes.', 'Cloud bills are product decisions wearing finance clothes.', 'Lifetime deals can become prepaid clutter.'],
  },
];

export const monetizationBySection = [
  {
    section: 'Pricing',
    problems: ['Invoices and payment collection', 'Scope creep', 'Time disappears into admin', 'Profit is unclear', 'Client profitability unclear'],
    recommendations: ['invoicing/payment software', 'proposal or contract tools', 'time-tracking tools', 'bookkeeping/accounting software', 'reporting dashboards'],
  },
  {
    section: 'Hiring',
    problems: ['Payroll burden', 'Contractor trial', 'Role/process unclear', 'Hiring workflow', 'Automation alternative'],
    recommendations: ['payroll provider', 'contractor payment platform', 'SOP/process documentation tools', 'ATS/recruiting software', 'workflow automation tools'],
  },
  {
    section: 'Tax',
    problems: ['Tax reserve messy', 'Receipts missing', 'Quarterly workflow weak', 'S-corp possible', 'Needs professional review'],
    recommendations: ['bookkeeping/tax planning software', 'receipt tracking', 'accounting software', 'payroll provider', 'CPA/accountant marketplace'],
  },
  {
    section: 'Revenue',
    problems: ['Pipeline vague', 'Invoices paid late', 'Churn unclear', 'Forecast messy', 'Client health unclear'],
    recommendations: ['CRM', 'payment/invoicing tools', 'subscription analytics', 'planning/FP&A software', 'customer success tools'],
  },
  {
    section: 'Cloud/SaaS',
    problems: ['SaaS inventory messy', 'Seats unused', 'Renewals missed', 'Cloud unpredictable', 'AI API cost growing'],
    recommendations: ['SaaS management', 'license management', 'procurement/contract management', 'FinOps/cloud cost tools', 'AI observability/usage tracking'],
  },
];

export const publishingGate = [
  'Clear user decision',
  'Calculator, scorecard, template, or strong guide purpose',
  'Emotional tagline',
  'Practical promise',
  'What most advice leaves out',
  'Visible assumptions',
  'Result interpretation or next action',
  'Internal links to tools, guides, templates, and tracks',
  'Monetization after value',
  'Disclosure if affiliate or sponsored content appears',
  'Source pack for tax, payroll, worker-classification, cloud, SaaS, and AI pricing claims',
  'No fake certainty',
  'No unsupported legal, tax, payroll, or filing conclusion',
  'No fake reviews, fake ratings, or invented testimonials',
  'No thin programmatic content',
];

export const structuredDataRules = [
  'Use BreadcrumbList where breadcrumbs are visible.',
  'Use Article or BlogPosting for substantial guide pages.',
  'Use SoftwareApplication only when the calculator/tool page genuinely fits the type.',
  'Use Product only for real product pages, not generic affiliate mentions.',
  'Use Review only for real review content that complies with review policies.',
  'Do not mark up hidden content, fake ratings, generated testimonials, or user-specific calculator outputs as static facts.',
  'Write FAQs for usefulness; do not rely on FAQ rich results for most Business pages.',
];

export const programmaticSeoGuardrails = [
  'Publish scenario pages only when the scenario changes the decision logic.',
  'Require unique default assumptions, examples, common traps, templates, and related calculators.',
  'Avoid city/state/job-title scaled pages unless the page has verified local or role-specific logic.',
  'Avoid state tax pages unless state-specific rules and source checks are implemented.',
  'No query-parameter result pages should be indexed as standalone content.',
];

export const measurementGroups = [
  {
    group: 'SEO metrics',
    metrics: ['impressions by section', 'clicks by section', 'calculator query growth', 'non-branded query growth', 'branded query growth for Kefiw concepts', 'internal link click-through', 'template rankings', 'track rankings'],
  },
  {
    group: 'Product metrics',
    metrics: ['calculator starts', 'calculator completions', 'result shares', 'template downloads or copies', 'track starts', 'track completions', 'return users', 'saved reports', 'email capture from templates'],
  },
  {
    group: 'Monetization metrics',
    metrics: ['affiliate click-through after calculator result', 'conversion by problem category', 'revenue per section', 'revenue per calculator', 'template conversion', 'sponsored placement performance', 'trust signals after monetization'],
  },
  {
    group: 'Trust metrics',
    metrics: ['pages with source packs', 'pages with expired source checks', 'pages with stale year references', 'pages with user corrections', 'pages needing legal, tax, payroll, or cloud-pricing review'],
  },
];

export const rolloutPlan = [
  {
    phase: 'Days 1-15: Upgrade the foundation',
    work: ['Business Methodology', 'Editorial Policy', 'Monetization and Affiliate Policy', 'Tax Source Verification Policy', 'Template Hub', 'Business Guides Hub', 'Business Tracks Hub', 'Calculator verdicts and source notes'],
  },
  {
    phase: 'Days 16-35: Build first moat pages',
    work: ['Why Your Freelance Rate Feels High', 'Scope Creep Cost Calculator', 'Founder Overwhelm Is Not a Job Description', 'Salary Is Only the First Line', 'What If I Missed a Quarterly Tax Payment?', 'What If One Big Client Leaves?', 'AI ROI Is Not Real Until the Workflow Changes'],
  },
  {
    phase: 'Days 36-55: Build templates and scripts',
    work: ['Price Increase Email Template', 'Discount Refusal Script', 'Scope Creep Response Template', 'Weekly Tax Reserve Checklist', 'First Employee Role Definition Template', 'Revenue Forecast Worksheet', 'SaaS Audit Worksheet', 'AI ROI Worksheet'],
  },
  {
    phase: 'Days 56-75: Build diagnostic scorecards',
    work: ['Freelance Readiness Score', 'Pricing Confidence Score', 'Hiring Readiness Score', 'Tax Reserve Health Score', 'Software Spend Health Score', 'Revenue Fragility Score', 'Business Breathing Room Score'],
  },
  {
    phase: 'Days 76-90: Build tracks and monetization depth',
    work: ['Start Freelancing', 'Price My Work', 'Hire My First Employee', 'Plan My Tax Reserve', 'Clean Up Software Spend', 'Stress-Test Revenue', 'Problem-category monetization blocks', 'Disclosure language near recommendations'],
  },
];

export const sourceReferences = [
  { label: 'Google people-first content guidance', href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
  { label: 'Google crawlable links guidance', href: 'https://developers.google.com/search/docs/crawling-indexing/links-crawlable' },
  { label: 'Google spam policies', href: 'https://developers.google.com/search/docs/essentials/spam-policies' },
  { label: 'Google structured data guidelines', href: 'https://developers.google.com/search/docs/appearance/structured-data/sd-policies' },
  { label: 'Google FAQ structured data guidance', href: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage' },
  { label: 'FTC Endorsement Guides FAQ', href: 'https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides' },
  { label: 'FTC consumer review rule announcement', href: 'https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials' },
  { label: 'Google Search Console branded queries filter', href: 'https://developers.google.com/search/blog/2025/11/search-console-branded-filter' },
];

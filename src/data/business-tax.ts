export interface TaxRouteCard {
  situation: string;
  href: string;
  label: string;
}

export interface TaxContentSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface TaxContentPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  promise: string;
  keywords: string[];
  primaryCalculator?: string;
  calculatorLinks: TaxRouteCard[];
  sections: TaxContentSection[];
}

export const taxSituationRoutes: TaxRouteCard[] = [
  { situation: 'How much should I set aside for taxes?', label: 'Self-Employed Tax Calculator', href: '/business/self-employed-tax-calculator/' },
  { situation: 'I need to pay quarterly taxes.', label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/' },
  { situation: 'I missed or underpaid a quarter.', label: 'Quarterly Tax Catch-Up', href: '/business/quarterly-tax-catch-up-calculator/' },
  { situation: 'My income is irregular.', label: 'Irregular Income Tax Reserve', href: '/business/irregular-income-tax-reserve-planner/' },
  { situation: 'I have W-2 and 1099 income.', label: 'Mixed W-2 + 1099 Tax Planner', href: '/business/mixed-w2-1099-tax-planner/' },
  { situation: 'Can I deduct this?', label: 'Dangerous Deduction Checker', href: '/business/dangerous-deduction-checker/' },
  { situation: 'What deductions should I review?', label: 'Self-Employed Deduction Finder', href: '/business/self-employed-deduction-finder/' },
  { situation: 'Is S-corp worth it?', label: 'LLC vs S-Corp', href: '/business/llc-vs-s-corp-calculator/' },
  { situation: 'How much could S-corp save?', label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/' },
  { situation: 'What should I pay myself?', label: 'Reasonable Salary Planner', href: '/business/reasonable-salary-planner/' },
  { situation: 'Are my records good enough?', label: 'Deduction Documentation Scorecard', href: '/business/deduction-documentation-scorecard/' },
];

export const taxTrackCards: TaxRouteCard[] = [
  { situation: 'Build My Tax Reserve', label: 'Check reserve health', href: '/business/tax-reserve-health-score/' },
  { situation: 'Catch Up on Quarterly Taxes', label: 'Estimate the gap', href: '/business/quarterly-tax-catch-up-calculator/' },
  { situation: 'Clean Up My Deductions', label: 'Score documentation', href: '/business/deduction-documentation-scorecard/' },
  { situation: 'Decide If S-Corp Is Worth It', label: 'Stress-test savings', href: '/business/s-corp-break-even-stress-test/' },
  { situation: 'Plan Owner Pay', label: 'Model salary range', href: '/business/reasonable-salary-planner/' },
  { situation: 'Prepare Questions for a CPA', label: 'Use the question list', href: '/business/tax/templates/questions-to-ask-cpa-after-s-corp-calculator/' },
];

export const taxGuidePages: TaxContentPage[] = [
  {
    slug: 'why-gross-revenue-is-not-take-home-pay',
    title: 'Why Gross Revenue Is Not Take-Home Pay | Kefiw',
    description: 'Understand why self-employed people feel richer than they are when taxes, expenses, reserves, and slow months are not separated.',
    h1: 'Why Gross Revenue Is Not Take-Home Pay',
    tagline: 'Revenue is not take-home pay.',
    promise: 'Show why self-employed people feel richer than they are when taxes, expenses, reserves, and slow months are not separated.',
    keywords: ['self employed gross revenue vs take home', 'freelance tax reserve mistake', 'business revenue not personal income'],
    primaryCalculator: '/business/self-employed-tax-calculator/',
    calculatorLinks: [
      { situation: 'Estimate reserve', label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
      { situation: 'Score reserve behavior', label: 'Tax Reserve Health', href: '/business/tax-reserve-health-score/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Gross revenue feels safe because it arrives before tax, expenses, slow months, and owner pay are separated.' },
      { heading: 'The better move', body: 'Move tax money before it becomes part of the operating-cash story. Then price, spend, and pay yourself from what remains.' },
    ],
  },
  {
    slug: 'how-much-to-set-aside-for-taxes-self-employed',
    title: 'How Much Should I Set Aside for Taxes as a Freelancer? | Kefiw',
    description: 'Plan self-employed tax reserve using net profit, withholding, estimated payments, and reserve behavior.',
    h1: 'How Much Should I Set Aside for Taxes?',
    tagline: 'Know what is not really yours yet.',
    promise: 'Turn self-employed income into a practical tax reserve habit.',
    keywords: ['how much should I set aside for taxes self employed', 'freelance tax reserve calculator', '1099 tax set aside calculator'],
    primaryCalculator: '/business/self-employed-tax-calculator/',
    calculatorLinks: [
      { situation: 'Run the estimate', label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
      { situation: 'Protect the cash', label: 'Weekly Checklist', href: '/business/tax/templates/weekly-tax-reserve-checklist/' },
    ],
    sections: [
      { heading: 'The reserve problem', body: 'A flat percentage is a useful habit, but it should be checked against net profit, self-employment tax, withholding, state assumptions, and payments already made.' },
      { heading: 'The better move', body: 'Use a recurring reserve transfer and revisit it after a large invoice, deduction change, or withholding update.' },
    ],
  },
  {
    slug: 'what-if-i-missed-quarterly-tax-payment',
    title: 'What If I Missed a Quarterly Tax Payment? | Kefiw',
    description: 'Estimate a catch-up plan and protect future tax cash after a missed or low estimated payment.',
    h1: 'What If I Missed a Quarterly Tax Payment?',
    tagline: 'Being behind is a problem. Guessing is worse.',
    promise: 'Help self-employed operators quantify the gap and rebuild the payment rhythm.',
    keywords: ['what if I missed quarterly tax payment', 'missed estimated tax payment freelancer', 'how to catch up on quarterly taxes'],
    primaryCalculator: '/business/quarterly-tax-catch-up-calculator/',
    calculatorLinks: [
      { situation: 'Estimate catch-up', label: 'Quarterly Catch-Up', href: '/business/quarterly-tax-catch-up-calculator/' },
      { situation: 'Rebuild rhythm', label: 'Quarterly Estimate', href: '/business/quarterly-tax-estimate-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'The missed payment is not only a penalty question. It is a cash-control warning that future income needs a reserve plan.' },
      { heading: 'The better move', body: 'Estimate the shortfall, protect future reserve immediately, and review uneven-income treatment if income arrived in spikes.' },
    ],
  },
  {
    slug: 'quarterly-taxes-irregular-income',
    title: 'Quarterly Taxes With Irregular Income | Kefiw',
    description: 'Build a tax reserve plan for uneven freelance, consulting, creator, or seasonal income.',
    h1: 'Quarterly Taxes With Irregular Income',
    tagline: 'Do not average this blindly.',
    promise: 'Show why high-income months need immediate tax reserve discipline.',
    keywords: ['quarterly tax calculator uneven income', 'irregular 1099 income quarterly taxes', 'annualized income quarterly tax calculator'],
    primaryCalculator: '/business/irregular-income-tax-reserve-planner/',
    calculatorLinks: [
      { situation: 'Plan uneven reserves', label: 'Irregular Income Planner', href: '/business/irregular-income-tax-reserve-planner/' },
      { situation: 'Estimate next payment', label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/' },
    ],
    sections: [
      { heading: 'The problem', body: 'Uneven income makes tax feel emotional because a strong month can hide tax obligations and weak months can tempt the owner to spend reserves.' },
      { heading: 'The better move', body: 'Reserve from the month income arrives, then check whether annualized-income review may be relevant.' },
    ],
  },
  {
    slug: 'w2-and-1099-tax-planning',
    title: 'W-2 and 1099 Tax Planning | Kefiw',
    description: 'Understand how W-2 withholding and self-employment income interact in one tax plan.',
    h1: 'W-2 and 1099 Tax Planning',
    tagline: 'Two income streams need one tax plan.',
    promise: 'Help mixed-income workers compare extra withholding and quarterly payments.',
    keywords: ['w2 and 1099 tax calculator', 'extra withholding vs quarterly taxes', 'mixed income tax planner'],
    primaryCalculator: '/business/mixed-w2-1099-tax-planner/',
    calculatorLinks: [
      { situation: 'Combine withholding and 1099 income', label: 'Mixed W-2 + 1099 Planner', href: '/business/mixed-w2-1099-tax-planner/' },
      { situation: 'Estimate the 1099 side', label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'People often ask which income is taxed. The practical question is whether withholding plus estimated payments covers the whole picture.' },
      { heading: 'The better move', body: 'Model extra withholding and quarterly payments side by side so cash flow, timing, and reserve behavior are visible.' },
    ],
  },
  {
    slug: 'risky-tax-deductions-self-employed',
    title: 'Risky Tax Deductions Self-Employed People Should Review | Kefiw',
    description: 'Review deductions that may need stronger records, business-use allocation, or professional review.',
    h1: 'Risky Tax Deductions to Review Carefully',
    tagline: 'Keep the deduction. Lose the panic.',
    promise: 'Help operators spot documentation and mixed-use issues before filing season.',
    keywords: ['risky tax deductions self employed', 'dangerous deductions self employed', 'business expense documentation checker'],
    primaryCalculator: '/business/dangerous-deduction-checker/',
    calculatorLinks: [
      { situation: 'Check caution signals', label: 'Dangerous Deduction Checker', href: '/business/dangerous-deduction-checker/' },
      { situation: 'Score records', label: 'Documentation Scorecard', href: '/business/deduction-documentation-scorecard/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Viral deduction advice can make a category sound simple while ignoring business purpose, mixed use, and records.' },
      { heading: 'The better move', body: 'Treat the tool as a documentation review, not permission to deduct. Stronger records reduce tax-season stress.' },
    ],
  },
  {
    slug: 'mixed-use-business-expenses',
    title: 'Mixed-Use Business Expenses: Phone, Internet, Vehicle, and Home Office | Kefiw',
    description: 'Understand why business and personal use often need allocation and records.',
    h1: 'Mixed-Use Business Expenses',
    tagline: 'Business use and personal use need different treatment.',
    promise: 'Explain why mixed-use expenses need allocation instead of guesswork.',
    keywords: ['mixed use business expense', 'business and personal expense allocation', 'business use percentage calculator'],
    primaryCalculator: '/business/deduction-documentation-scorecard/',
    calculatorLinks: [
      { situation: 'Score records', label: 'Documentation Scorecard', href: '/business/deduction-documentation-scorecard/' },
      { situation: 'Check caution', label: 'Dangerous Deduction Checker', href: '/business/dangerous-deduction-checker/' },
    ],
    sections: [
      { heading: 'The issue', body: 'Phone, internet, car, home office, travel, and equipment can have both business and personal use. The record should explain the split.' },
      { heading: 'The better move', body: 'Write the business-use percentage and the method while the expense is fresh.' },
    ],
  },
  {
    slug: 'how-to-document-business-expenses',
    title: 'How to Document Business Expenses Without Overcomplicating It | Kefiw',
    description: 'Capture the business reason, receipt, category, allocation, and project tie before memory fades.',
    h1: 'How to Document Business Expenses',
    tagline: 'The record matters as much as the expense.',
    promise: 'Turn receipts into records that explain the business story.',
    keywords: ['how to document business expenses', 'business expense receipt tracker', 'tax deduction records self employed'],
    primaryCalculator: '/business/deduction-documentation-scorecard/',
    calculatorLinks: [
      { situation: 'Score records', label: 'Documentation Scorecard', href: '/business/deduction-documentation-scorecard/' },
      { situation: 'Write a note', label: 'Documentation Note', href: '/business/tax/templates/business-expense-documentation-note-template/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A receipt without business purpose can still create tax-season memory work.' },
      { heading: 'The better move', body: 'Capture vendor, date, amount, category, business purpose, project tie, and business-use allocation as part of the transaction record.' },
    ],
  },
  {
    slug: 'is-s-corp-worth-it-at-80k-100k-150k',
    title: 'Is an S-Corp Worth It at $80k, $100k, or $150k? | Kefiw',
    description: 'Compare S-corp savings after payroll, filing, bookkeeping, state, and admin costs.',
    h1: 'Is an S-Corp Worth It at $80k, $100k, or $150k?',
    tagline: 'The savings number is not the whole decision.',
    promise: 'Stress-test S-corp thresholds instead of trusting one exciting screenshot.',
    keywords: ['is s corp worth it at 80k', 's corp worth it at 100k', 's corp worth it after payroll costs'],
    primaryCalculator: '/business/s-corp-break-even-stress-test/',
    calculatorLinks: [
      { situation: 'Stress-test threshold', label: 'S-Corp Break-Even', href: '/business/s-corp-break-even-stress-test/' },
      { situation: 'Model savings', label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'S-corp savings can look good before salary, payroll, filing, state costs, bookkeeping, and admin time are counted.' },
      { heading: 'The better move', body: 'Run lower-profit, higher-salary, and higher-admin scenarios before treating the entity change as worth it.' },
    ],
  },
  {
    slug: 's-corp-savings-after-payroll-costs',
    title: 'S-Corp Savings After Payroll Costs | Kefiw',
    description: 'Estimate possible S-corp savings after reasonable salary, payroll, filing, bookkeeping, and state/admin costs.',
    h1: 'S-Corp Savings After Payroll Costs',
    tagline: 'Savings are only savings after the admin is paid for.',
    promise: 'Show how payroll and admin drag can shrink the S-corp spread.',
    keywords: ['s corp savings after payroll costs', 's corp tax savings with reasonable salary', 's corp calculator with admin costs'],
    primaryCalculator: '/business/s-corp-tax-savings-calculator/',
    calculatorLinks: [
      { situation: 'Model spread', label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/' },
      { situation: 'Ask better questions', label: 'CPA Question List', href: '/business/tax/templates/questions-to-ask-cpa-after-s-corp-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Screenshots often show possible savings and hide payroll service, bookkeeping, tax filing, state/entity costs, and admin time.' },
      { heading: 'The better move', body: 'Subtract the boring costs first. If savings still matter, review the assumptions with a CPA.' },
    ],
  },
  {
    slug: 'reasonable-salary-s-corp-owner',
    title: 'Reasonable Salary Planner for S-Corp Owners | Kefiw',
    description: 'Plan an S-corp owner salary range using role, hours, skill, responsibility, comparable pay, and business economics.',
    h1: 'Reasonable Salary for S-Corp Owners',
    tagline: 'The salary should explain the work, not decorate the spreadsheet.',
    promise: 'Help owners model salary assumptions before trusting distribution math.',
    keywords: ['reasonable salary calculator s corp owner', 'reasonable salary solo consultant s corp', 's corp owner salary planning'],
    primaryCalculator: '/business/reasonable-salary-planner/',
    calculatorLinks: [
      { situation: 'Build salary range', label: 'Reasonable Salary Planner', href: '/business/reasonable-salary-planner/' },
      { situation: 'Stress-test savings', label: 'S-Corp Break-Even', href: '/business/s-corp-break-even-stress-test/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'A salary chosen only to maximize distributions can make the S-corp model fragile.' },
      { heading: 'The better move', body: 'Model role, time, skills, sales responsibility, comparable pay, and replacement cost before relying on savings.' },
    ],
  },
  {
    slug: 's-corp-not-worth-it-yet',
    title: 'S-Corp Not Worth It Yet Calculator and Guide | Kefiw',
    description: 'Recognize when S-corp complexity is too early because savings disappear under realistic assumptions.',
    h1: 'S-Corp Not Worth It Yet',
    tagline: 'Admitting too early is useful.',
    promise: 'Show when salary, payroll, state fees, and admin costs consume the savings.',
    keywords: ['s corp not worth it calculator', 'when s corp savings disappear', 's corp not worth it'],
    primaryCalculator: '/business/s-corp-break-even-stress-test/',
    calculatorLinks: [
      { situation: 'Stress-test the decision', label: 'S-Corp Break-Even', href: '/business/s-corp-break-even-stress-test/' },
      { situation: 'Check entity spread', label: 'LLC vs S-Corp', href: '/business/llc-vs-s-corp-calculator/' },
    ],
    sections: [
      { heading: 'The mistake', body: 'Owners often treat a weak S-corp result as failure. It may simply mean the structure is too early.' },
      { heading: 'The better move', body: 'Keep better books, stabilize profit, document owner pay assumptions, and revisit when the spread clears the admin threshold.' },
    ],
  },
];

export const taxTemplatePages: TaxContentPage[] = [
  {
    slug: 'weekly-tax-reserve-checklist',
    title: 'Weekly Tax Reserve Checklist for Self-Employed Operators | Kefiw',
    description: 'Move tax money before it starts looking spendable.',
    h1: 'Weekly Tax Reserve Checklist',
    tagline: 'Move the tax money before it starts looking spendable.',
    promise: 'Create a weekly routine for income, expenses, reserve transfer, next deadline, and unusual income notes.',
    keywords: ['weekly tax reserve checklist', 'self employed tax savings checklist', 'freelance tax reserve routine'],
    primaryCalculator: '/business/tax-reserve-health-score/',
    calculatorLinks: [{ situation: 'Check reserve health', label: 'Tax Reserve Health Score', href: '/business/tax-reserve-health-score/' }],
    sections: [
      {
        heading: 'Checklist',
        body: 'This week, record income received, business expenses paid, net business cash, tax reserve percentage, amount moved to tax account, next estimated-payment balance, unusual income notes, receipts captured, and delayed client payments.',
      },
      { heading: 'Template', body: 'Income received: $____. Business expenses paid: $____. Net business cash: $____. Tax reserve percentage: ____%. Amount moved to tax account: $____.' },
    ],
  },
  {
    slug: 'quarterly-tax-review-checklist',
    title: 'Quarterly Tax Review Checklist | Kefiw',
    description: 'End the quarter with numbers, not guessing.',
    h1: 'Quarterly Tax Review Checklist',
    tagline: 'A quarter should end with numbers, not guessing.',
    promise: 'Review income, expenses, payments, withholding, catch-up amount, deadline, and missing records.',
    keywords: ['quarterly tax review checklist', 'estimated tax checklist', 'quarterly tax routine'],
    primaryCalculator: '/business/quarterly-tax-estimate-calculator/',
    calculatorLinks: [{ situation: 'Estimate payment', label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/' }],
    sections: [
      { heading: 'Checklist', body: 'Review income by month, expenses by month, tax payments already made, withholding, current quarter estimate, catch-up amount, upcoming deadline, records missing, and major changes since last quarter.' },
      { heading: 'Decision', body: 'If income changed materially, do not copy last quarter. Re-estimate the payment or review annualized-income treatment when income is uneven.' },
    ],
  },
  {
    slug: 'business-expense-documentation-note-template',
    title: 'Business Expense Documentation Note Template | Kefiw',
    description: 'Write the business reason while you still remember it.',
    h1: 'Business Expense Documentation Note Template',
    tagline: 'Write the business reason while you still remember it.',
    promise: 'Capture vendor, amount, business purpose, project tie, allocation, and record location.',
    keywords: ['business expense documentation note', 'deduction documentation template', 'business purpose note template'],
    primaryCalculator: '/business/deduction-documentation-scorecard/',
    calculatorLinks: [{ situation: 'Score documentation', label: 'Deduction Documentation Scorecard', href: '/business/deduction-documentation-scorecard/' }],
    sections: [
      {
        heading: 'Template',
        body: 'Expense: ____. Date: ____. Vendor: ____. Amount: ____. Business purpose: ____. Client/project/workflow connected to: ____. Business-use percentage: ____. Personal-use portion, if any: ____. Receipt/invoice location: ____. Notes: ____.',
      },
    ],
  },
  {
    slug: 's-corp-readiness-checklist',
    title: 'S-Corp Readiness Checklist | Kefiw',
    description: 'Make sure the admin is worth the savings.',
    h1: 'S-Corp Readiness Checklist',
    tagline: 'Make sure the admin is worth the savings.',
    promise: 'Review profit stability, salary range, payroll, bookkeeping, filing cost, state costs, admin time, accounts, records, and CPA questions.',
    keywords: ['s corp readiness checklist', 's corp admin checklist', 'is s corp worth it checklist'],
    primaryCalculator: '/business/s-corp-break-even-stress-test/',
    calculatorLinks: [{ situation: 'Stress-test S-corp', label: 'S-Corp Break-Even', href: '/business/s-corp-break-even-stress-test/' }],
    sections: [
      { heading: 'Checklist', body: 'Confirm stable profit, reasonable salary range, payroll provider, bookkeeping readiness, tax filing cost, state/entity cost, admin time, separate business account, recordkeeping system, and professional review questions.' },
      { heading: 'Decision', body: 'If the savings disappear after realistic salary and admin costs, the S-corp may be a revisit-later decision.' },
    ],
  },
  {
    slug: 'questions-to-ask-cpa-after-s-corp-calculator',
    title: 'Questions to Ask a CPA After Running an S-Corp Calculator | Kefiw',
    description: 'Use the calculator to ask better S-corp questions.',
    h1: 'Questions to Ask a CPA After Running an S-Corp Calculator',
    tagline: 'Use the calculator to ask better questions.',
    promise: 'Turn calculator assumptions into a focused CPA conversation.',
    keywords: ['questions to ask cpa about s corp', 's corp cpa questions', 's corp reasonable salary questions'],
    primaryCalculator: '/business/s-corp-tax-savings-calculator/',
    calculatorLinks: [{ situation: 'Model S-corp spread', label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/' }],
    sections: [
      {
        heading: 'Questions',
        body: 'Ask what reasonable salary range they would model, what state/entity costs apply, what payroll setup and ongoing payroll cost, what bookkeeping would need to change, what S-corp filing would cost, how stable profit needs to be, what could make savings disappear, and what records to keep.',
      },
    ],
  },
];

export function taxGuideHref(page: TaxContentPage): string {
  return `/business/tax/guides/${page.slug}/`;
}

export function taxTemplateHref(page: TaxContentPage): string {
  return `/business/tax/templates/${page.slug}/`;
}

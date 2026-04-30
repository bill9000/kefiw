export interface HiringRouteCard {
  situation: string;
  href: string;
  label: string;
}

export interface HiringContentSection {
  heading: string;
  body: string;
  bullets?: string[];
}

export interface HiringContentPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  tagline: string;
  promise: string;
  keywords: string[];
  primaryCalculator?: string;
  calculatorLinks: HiringRouteCard[];
  sections: HiringContentSection[];
}

export const hiringSituationRoutes: HiringRouteCard[] = [
  { situation: 'Can I afford an employee?', label: 'Payroll Burden Calculator', href: '/business/payroll-burden-calculator/' },
  { situation: 'Should I hire or use a contractor?', label: 'Contractor vs Employee Cost', href: '/business/contractor-vs-employee-calculator/' },
  { situation: 'Should I automate this instead?', label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/' },
  { situation: 'How much revenue do I need before hiring?', label: 'Revenue per Employee', href: '/business/revenue-per-employee-calculator/' },
  { situation: 'What will the first 90 days cost?', label: 'First 90-Day Hire Cost', href: '/business/first-90-day-hire-cost-calculator/' },
  { situation: 'Is this actually a real role?', label: 'Role Clarity Scorecard', href: '/business/role-clarity-scorecard/' },
  { situation: 'How much time will managing this person take?', label: 'Management Burden', href: '/business/management-burden-calculator/' },
  { situation: 'Should I try a contractor first?', label: 'Contractor Trial', href: '/business/contractor-trial-calculator/' },
  { situation: 'What if revenue drops after hiring?', label: 'Hiring Stress Test', href: '/business/hiring-stress-test/' },
  { situation: 'What work should I delete before hiring?', label: 'Work Deletion', href: '/business/work-deletion-calculator/' },
];

export const hiringTrackCards: HiringRouteCard[] = [
  { situation: 'Hire My First Employee', label: 'Check readiness', href: '/business/hiring-readiness-score/' },
  { situation: 'Test With a Contractor', label: 'Design a trial', href: '/business/contractor-trial-calculator/' },
  { situation: 'Automate Before Hiring', label: 'Compare the workflow', href: '/business/hire-vs-automate-calculator/' },
  { situation: 'Build a Role From Founder Overwhelm', label: 'Clarify the role', href: '/business/role-clarity-scorecard/' },
  { situation: 'Stress-Test Payroll', label: 'Model a bad month', href: '/business/hiring-stress-test/' },
  { situation: 'Clean Up Work Before Hiring', label: 'Delete low-value work', href: '/business/work-deletion-calculator/' },
];

export const hiringGuidePages: HiringContentPage[] = [
  {
    slug: 'founder-overwhelm-is-not-a-job-description',
    title: 'Founder Overwhelm Is Not a Job Description | Kefiw',
    description: 'Separate true role demand from owner stress, bad process, unclear priorities, and work that should be deleted.',
    h1: 'Founder Overwhelm Is Not a Job Description',
    tagline: 'Being tired does not automatically mean you need an employee.',
    promise: 'Help owners separate true role demand from stress, bad process, unclear priorities, and work that should be deleted.',
    keywords: ['overwhelmed business owner hiring', 'should I hire someone or fix process', 'founder overwhelmed first hire', 'hiring because I am tired'],
    primaryCalculator: '/business/role-clarity-scorecard/',
    calculatorLinks: [
      { situation: 'Score the role', label: 'Role Clarity Scorecard', href: '/business/role-clarity-scorecard/' },
      { situation: 'Delete low-value work', label: 'Work Deletion', href: '/business/work-deletion-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'A tired owner can describe pain clearly without having a hire-ready role. The work still needs outcomes, ownership, boundaries, process, and success metrics.',
      },
      {
        heading: 'The better move',
        body: 'List recurring work, remove low-value tasks, document the process, then decide whether the remaining work needs a contractor, automation, or employee.',
      },
    ],
  },
  {
    slug: 'first-employee-cost-small-business',
    title: 'First Employee Cost for Small Businesses | Kefiw',
    description: 'See why the first employee adds payroll pressure, management responsibility, training time, and emotional weight.',
    h1: 'First Employee Cost for Small Businesses',
    tagline: 'Your first employee changes the business, not just the workload.',
    promise: 'Show why the first hire adds payroll pressure, management responsibility, training time, and emotional weight.',
    keywords: ['first employee cost small business', 'first hire small business', 'what to know before hiring first employee', 'first employee mistake'],
    primaryCalculator: '/business/payroll-burden-calculator/',
    calculatorLinks: [
      { situation: 'Model full cost', label: 'Payroll Burden', href: '/business/payroll-burden-calculator/' },
      { situation: 'Model ramp', label: 'First 90-Day Hire Cost', href: '/business/first-90-day-hire-cost-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Owners often price the first hire as salary. The business actually takes on payroll cadence, setup, management, quality control, training, and reserve pressure.',
      },
      {
        heading: 'The better move',
        body: 'Treat the first hire as a cash-flow and management event. Build the 90-day budget before making the offer.',
      },
    ],
  },
  {
    slug: 'what-if-revenue-drops-after-hiring',
    title: 'What If Revenue Drops After Hiring? | Kefiw',
    description: 'Stress-test a hire against slower revenue, client loss, payment delay, and payroll reserve.',
    h1: 'What If Revenue Drops After Hiring?',
    tagline: 'Payroll feels different in a bad month.',
    promise: 'Help owners decide whether to hire now, delay, contract first, or build reserve.',
    keywords: ['what if revenue drops after hiring', 'payroll stress test calculator', 'small business payroll reserve', 'can I afford to hire someone'],
    primaryCalculator: '/business/hiring-stress-test/',
    calculatorLinks: [
      { situation: 'Stress-test payroll', label: 'Hiring Stress Test', href: '/business/hiring-stress-test/' },
      { situation: 'Forecast revenue', label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'A hire can look affordable in a normal month and become painful when a client delays payment, a ramp slips, or one account leaves.',
      },
      {
        heading: 'The better move',
        body: 'Run the hire against a revenue drop before payroll starts. If the downside case is unsafe, delay or test with a contractor.',
      },
    ],
  },
  {
    slug: 'salary-is-only-the-first-line',
    title: 'Salary Is Only the First Line | Kefiw',
    description: 'Understand payroll burden, benefits, equipment, software, recruiting, ramp time, and manager time.',
    h1: 'Salary Is Only the First Line',
    tagline: 'A $60,000 employee does not cost $60,000.',
    promise: 'Explain payroll burden, benefits, equipment, software, recruiting, ramp time, and manager time.',
    keywords: ['salary is not full employee cost', 'how much does employee really cost', 'payroll burden explained', 'fully loaded employee cost'],
    primaryCalculator: '/business/payroll-burden-calculator/',
    calculatorLinks: [
      { situation: 'Find loaded cost', label: 'Payroll Burden', href: '/business/payroll-burden-calculator/' },
      { situation: 'Find ramp cost', label: 'First 90-Day Hire Cost', href: '/business/first-90-day-hire-cost-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Salary is the visible line. Payroll taxes, benefits, PTO, recruiting, tools, equipment, management, and ramp time create the actual commitment.',
      },
      {
        heading: 'The better move',
        body: 'Budget the fully loaded employee cost before deciding whether the role is affordable.',
      },
    ],
  },
  {
    slug: 'contractors-feel-expensive-bad-employees-cost-more',
    title: 'Contractors Feel Expensive, But Bad Employees Cost More | Kefiw',
    description: 'Compare contractor flexibility, specialization, management boundaries, cost tradeoffs, and classification caution.',
    h1: 'Contractors Feel Expensive, But Bad Employees Cost More',
    tagline: 'A contractor is not a cheaper employee with less paperwork.',
    promise: 'Explain flexibility, specialization, management boundaries, cost tradeoffs, and classification caution.',
    keywords: ['contractor vs employee mistake', 'contractor cheaper than employee', 'managing contractors small business', 'independent contractor vs employee small business'],
    primaryCalculator: '/business/contractor-vs-employee-calculator/',
    calculatorLinks: [
      { situation: 'Compare help types', label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/' },
      { situation: 'Test first', label: 'Contractor Trial', href: '/business/contractor-trial-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'A contractor can look expensive by the hour but preserve flexibility. An employee can look cheaper while adding commitment, management, ramp, and payroll pressure.',
      },
      {
        heading: 'The boundary',
        body: 'Classification is not a pricing choice. Cost comparisons should not be used to pretend an employee-like relationship is a contractor relationship.',
      },
    ],
  },
  {
    slug: 'should-i-hire-or-automate',
    title: 'Should I Hire or Automate? | Kefiw',
    description: 'Compare hiring, automation, simplification, delegation, contracting, and deletion before adding overhead.',
    h1: 'Should I Hire or Automate?',
    tagline: 'Do not start with software or a job post.',
    promise: 'Help owners decide whether work needs a person, tool, simpler process, contractor, or deletion.',
    keywords: ['should I hire or automate', 'hire vs automate calculator', 'should I hire a VA or use AI', 'automate before hiring'],
    primaryCalculator: '/business/hire-vs-automate-calculator/',
    calculatorLinks: [
      { situation: 'Compare paths', label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/' },
      { situation: 'Delete first', label: 'Work Deletion', href: '/business/work-deletion-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Automation is not magic, and hiring into a broken workflow can make the workflow more expensive.',
      },
      {
        heading: 'The better move',
        body: 'Ask whether the work should exist, whether it can be simplified, whether it needs judgment, and whether the need is recurring enough for payroll.',
      },
    ],
  },
  {
    slug: 'automation-is-not-a-strategy-if-process-is-broken',
    title: 'Automation Is Not a Strategy If the Process Is Broken | Kefiw',
    description: 'See why owners should simplify or delete work before automating it.',
    h1: 'Automation Is Not a Strategy If the Process Is Broken',
    tagline: 'Automation can make bad work permanent.',
    promise: 'Show why owners should simplify or delete work before automating it.',
    keywords: ['automation mistake small business', 'should I automate this task', 'automate before hiring', 'AI automation small business mistakes'],
    primaryCalculator: '/business/hire-vs-automate-calculator/',
    calculatorLinks: [
      { situation: 'Check automation', label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/' },
      { situation: 'Audit the task', label: 'Work Deletion', href: '/business/work-deletion-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'A tool can speed up a workflow that should have been deleted, reduced, batched, or redesigned.',
      },
      {
        heading: 'The better move',
        body: 'Simplify first, automate second, and count review time before calling the ROI real.',
      },
    ],
  },
  {
    slug: 'the-work-you-should-delete-before-hiring',
    title: 'The Work You Should Delete Before Hiring | Kefiw',
    description: 'Find low-value tasks that should be deleted, reduced, batched, or simplified before adding help.',
    h1: 'The Work You Should Delete Before Hiring',
    tagline: 'The cheapest task is the one you stop doing.',
    promise: 'Help owners avoid making low-value work permanent through hiring or automation.',
    keywords: ['what work should I delete before hiring', 'small business task audit', 'eliminate low value tasks', 'founder task cleanup'],
    primaryCalculator: '/business/work-deletion-calculator/',
    calculatorLinks: [
      { situation: 'Score a task', label: 'Work Deletion', href: '/business/work-deletion-calculator/' },
      { situation: 'Compare automation', label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Hiring or automating low-value work makes the business heavier. Deleting it makes the business lighter.',
      },
      {
        heading: 'The better move',
        body: 'Look for unused reports, duplicate data entry, stale meetings, unnecessary approvals, and tasks nobody uses.',
      },
    ],
  },
  {
    slug: 'how-much-revenue-before-hiring',
    title: 'How Much Revenue Do I Need Before Hiring? | Kefiw',
    description: 'Use revenue, margin, payroll, reserve, and concentration to test whether the business can carry another person.',
    h1: 'How Much Revenue Do I Need Before Hiring?',
    tagline: 'Revenue has to be repeatable enough for payroll.',
    promise: 'Estimate whether revenue, margin, and cash flow can support a new employee.',
    keywords: ['how much revenue before hiring', 'revenue needed for first employee', 'employee affordability calculator', 'revenue per employee for small teams'],
    primaryCalculator: '/business/revenue-per-employee-calculator/',
    calculatorLinks: [
      { situation: 'Check leverage', label: 'Revenue per Employee', href: '/business/revenue-per-employee-calculator/' },
      { situation: 'Check loaded cost', label: 'Payroll Burden', href: '/business/payroll-burden-calculator/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Revenue can be high enough in the headline and still fragile if margin, collection timing, concentration, or owner workload is weak.',
      },
      {
        heading: 'The better move',
        body: 'Test the hire against recurring revenue, gross margin, payroll reserve, and the owner bottleneck before adding headcount.',
      },
    ],
  },
  {
    slug: 'why-hiring-can-make-growth-feel-heavier',
    title: 'Why Hiring Can Make Growth Feel Heavier | Kefiw',
    description: 'Understand why more people can add coordination, review, management, and quality-control work before they add capacity.',
    h1: 'Why Hiring Can Make Growth Feel Heavier',
    tagline: 'More people can mean more coordination before more capacity.',
    promise: 'Show how hiring changes owner work before it reduces owner work.',
    keywords: ['why hiring can make growth feel heavier', 'hiring creates more work', 'owner time cost of hiring', 'small team management burden'],
    primaryCalculator: '/business/management-burden-calculator/',
    calculatorLinks: [
      { situation: 'Count management time', label: 'Management Burden', href: '/business/management-burden-calculator/' },
      { situation: 'Check readiness', label: 'Hiring Readiness Score', href: '/business/hiring-readiness-score/' },
    ],
    sections: [
      {
        heading: 'The mistake',
        body: 'Growth feels heavier when the owner adds people before roles, processes, standards, and decision rights are clear.',
      },
      {
        heading: 'The better move',
        body: 'Reduce ambiguity before adding headcount. A clear role is easier to manage than a person hired into chaos.',
      },
    ],
  },
];

export const hiringTemplatePages: HiringContentPage[] = [
  {
    slug: 'first-employee-role-definition-template',
    title: 'First Employee Role Definition Template | Kefiw',
    description: 'Turn owner stress into a real job with responsibilities, boundaries, metrics, and 30/60/90-day outcomes.',
    h1: 'First Employee Role Definition Template',
    tagline: 'Turn owner stress into a real job.',
    promise: 'Define why the role exists, what it owns, what it does not own, and how success will be measured.',
    keywords: ['first employee role definition template', 'first hire job description small business', 'role clarity checklist'],
    calculatorLinks: [
      { situation: 'Score the role', label: 'Role Clarity Scorecard', href: '/business/role-clarity-scorecard/' },
      { situation: 'Check readiness', label: 'Hiring Readiness Score', href: '/business/hiring-readiness-score/' },
    ],
    sections: [
      {
        heading: 'Template sections',
        body: 'Use this structure before writing the job post.',
        bullets: ['Role title', 'Why this role exists', 'Top 5 responsibilities', 'What this role owns', 'What this role does not own', 'Weekly recurring tasks', 'Tools used', 'Decisions they can make', 'Success metrics', 'First 30/60/90-day outcomes', 'Manager check-in rhythm'],
      },
      {
        heading: 'Example',
        body: 'This role exists to remove recurring operational work from the owner, not to absorb every task the owner dislikes. It owns scheduling, client follow-up, invoice reminders, and the weekly operations checklist. It does not own pricing decisions, client strategy, hiring decisions, or final quality approval.',
      },
    ],
  },
  {
    slug: 'contractor-trial-project-brief',
    title: 'Contractor Trial Project Brief Template | Kefiw',
    description: 'Test the work before building a role around it.',
    h1: 'Contractor Trial Project Brief Template',
    tagline: 'Test the work before you build a role around it.',
    promise: 'Create a paid, scoped trial with clear deliverables, timeline, definition of done, and review questions.',
    keywords: ['contractor trial project brief', 'contractor trial before hiring', 'trial project template'],
    calculatorLinks: [
      { situation: 'Cost the trial', label: 'Contractor Trial Calculator', href: '/business/contractor-trial-calculator/' },
      { situation: 'Compare help types', label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/' },
    ],
    sections: [
      {
        heading: 'Template sections',
        body: 'A contractor trial should answer a business question, not create permanent ambiguity.',
        bullets: ['Project goal', 'Deliverables', 'Deadline', 'Communication rhythm', 'Tools/access', 'Definition of done', 'Success criteria', 'Payment terms', 'What happens after trial', 'Review questions'],
      },
      {
        heading: 'Example',
        body: 'The goal of this trial is to test whether this work can be delegated cleanly, not to create an unpaid audition. Success means the deliverable is complete, the handoff is smooth, owner time drops, and the work repeats often enough to justify continued help.',
      },
    ],
  },
  {
    slug: 'hire-vs-automate-worksheet',
    title: 'Hire vs Automate Worksheet | Kefiw',
    description: 'Decide what kind of help the work actually needs.',
    h1: 'Hire vs Automate Worksheet',
    tagline: 'Decide what kind of help the work actually needs.',
    promise: 'Compare deletion, simplification, automation, delegation, contracting, and hiring for one workflow.',
    keywords: ['hire vs automate worksheet', 'delegate automate delete framework', 'automation before hiring worksheet'],
    calculatorLinks: [
      { situation: 'Run the calculator', label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/' },
      { situation: 'Audit deletion', label: 'Work Deletion', href: '/business/work-deletion-calculator/' },
    ],
    sections: [
      {
        heading: 'Worksheet prompts',
        body: 'Use one workflow at a time.',
        bullets: ['Task description', 'Why the task exists', 'Current hours', 'Error risk', 'Customer sensitivity', 'Human judgment required', 'Automation risk', 'Review time', 'Setup cost', 'Best option: delete, simplify, automate, delegate, contract, or hire'],
      },
    ],
  },
  {
    slug: '30-60-90-day-plan-template',
    title: '30/60/90-Day Plan Template for a Small Business Hire | Kefiw',
    description: 'Make ramp time visible before payroll starts.',
    h1: '30/60/90-Day Plan Template for a Small Business Hire',
    tagline: 'Make ramp time visible before payroll starts.',
    promise: 'Define what the hire should learn, own, and improve in the first three months.',
    keywords: ['30 60 90 day plan small business hire', 'new hire ramp plan template', 'first employee onboarding plan'],
    calculatorLinks: [
      { situation: 'Cost the ramp', label: 'First 90-Day Hire Cost', href: '/business/first-90-day-hire-cost-calculator/' },
      { situation: 'Check management load', label: 'Management Burden', href: '/business/management-burden-calculator/' },
    ],
    sections: [
      {
        heading: 'Plan sections',
        body: 'Use the plan before the offer, not after the first confusing week.',
        bullets: ['First 30 days: learn, observe, document', 'First 60 days: own recurring work', 'First 90 days: improve or expand responsibility', 'Training checkpoints', 'Quality standards', 'Communication rhythm', 'Success metrics', 'Owner responsibilities'],
      },
    ],
  },
  {
    slug: 'not-ready-to-hire-yet-memo',
    title: 'Not Ready to Hire Yet Memo | Kefiw',
    description: 'Use a decision memo when delaying the hire is the better business decision.',
    h1: 'Not Ready to Hire Yet Memo',
    tagline: 'A delayed hire can be a better business decision.',
    promise: 'Document why the business is not hiring yet and what must happen before revisiting the decision.',
    keywords: ['not ready to hire yet memo', 'delay hiring decision', 'not ready to hire first employee'],
    calculatorLinks: [
      { situation: 'Check readiness', label: 'Hiring Readiness Score', href: '/business/hiring-readiness-score/' },
      { situation: 'Clean up work', label: 'Work Deletion', href: '/business/work-deletion-calculator/' },
    ],
    sections: [
      {
        heading: 'Memo template',
        body: 'We are not hiring yet because the role is not clear enough, the process is not documented, revenue support is not stable, or the work may be better handled by simplification, automation, or a contractor trial.',
      },
      {
        heading: 'Before hiring, we will',
        body: 'Use this as the action list.',
        bullets: ['Document the recurring work', 'Delete or simplify low-value tasks', 'Test the role with a contractor or part-time support', 'Build a payroll reserve', 'Revisit the decision after a specific date'],
      },
    ],
  },
];

export function hiringGuideHref(page: Pick<HiringContentPage, 'slug'>): string {
  return `/business/hiring/guides/${page.slug}/`;
}

export function hiringTemplateHref(page: Pick<HiringContentPage, 'slug'>): string {
  return `/business/hiring/templates/${page.slug}/`;
}

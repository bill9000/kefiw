import type { VerticalCalculatorKind, VerticalCalculatorPage } from '~/data/vertical-calculators';

export type CalculatorDepthState = 'stable' | 'tight' | 'fragile' | 'not-ready';
export type CalculatorDepthValues = Record<string, number | string | boolean>;

export interface CalculatorDepthMetric {
  label: string;
  value: string;
  note?: string;
}

export interface CalculatorDepthResult {
  headline: string;
  metrics: CalculatorDepthMetric[];
  flags: string[];
  notes: string[];
}

export interface CalculatorStateSummary {
  state: CalculatorDepthState;
  label?: string;
  summary: string;
}

export interface CalculatorScenarioPreset {
  label: string;
  description: string;
  values: Partial<CalculatorDepthValues>;
}

export interface CalculatorAssumptionMode {
  id: 'conservative' | 'expected' | 'aggressive';
  label: string;
  description: string;
  values?: Partial<CalculatorDepthValues> | ((values: CalculatorDepthValues) => Partial<CalculatorDepthValues>);
}

export interface CalculatorDecisionMode {
  label: string;
  description: string;
}

export interface CalculatorSituationLink {
  label: string;
  href: string;
  note: string;
}

export interface CalculatorFaq {
  q: string;
  a: string;
}

export interface CalculatorOperatorExample {
  title: string;
  body: string;
  takeaway: string;
}

export interface CalculatorDepthContext {
  page: VerticalCalculatorPage;
  values: CalculatorDepthValues;
  result: CalculatorDepthResult;
}

export interface CalculatorDepthProfile {
  decisionModes: CalculatorDecisionMode[];
  state: (context: CalculatorDepthContext) => CalculatorStateSummary;
  verdict: string | ((context: CalculatorDepthContext & { state: CalculatorStateSummary }) => string);
  whatAdviceLeavesOut: string;
  sensitiveAssumptions: string[];
  commonTraps: string[];
  betterNextMoves: Partial<Record<CalculatorDepthState, string>> & { default: string };
  scenarioPresets?: CalculatorScenarioPreset[];
  assumptionModes?: CalculatorAssumptionMode[];
  realityCheckQuestions: string[];
  methodologyMiniBlock: string;
  doesNotDo: string[];
  situationLinks: CalculatorSituationLink[];
  faqs: CalculatorFaq[];
  operatorExamples?: CalculatorOperatorExample[];
}

type DepthOverride = Partial<Omit<CalculatorDepthProfile, 'state'>> & {
  state?: CalculatorDepthProfile['state'];
};

const SS_WAGE_BASE_2026 = 184_500;

function toNumber(values: CalculatorDepthValues, id: string): number {
  const value = values[id];
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') return Number(value) || 0;
  return value ? 1 : 0;
}

function isChecked(values: CalculatorDepthValues, id: string): boolean {
  return values[id] === true;
}

function roundCurrency(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value / 100) * 100;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function pctStep(values: CalculatorDepthValues, id: string, delta: number): number {
  return clamp(toNumber(values, id) + delta, 0, 100);
}

function scale(values: CalculatorDepthValues, id: string, factor: number): number {
  return roundCurrency(toNumber(values, id) * factor);
}

function sCorpSpread(values: CalculatorDepthValues): { grossSavings: number; netSavings: number; admin: number; profit: number; salary: number } {
  const profit = toNumber(values, 'profit');
  const salary = Math.min(profit, toNumber(values, 'salary'));
  const solePropSeBase = profit * 0.9235;
  const solePropPayrollTax = Math.min(solePropSeBase, SS_WAGE_BASE_2026) * 0.124 + solePropSeBase * 0.029;
  const salaryPayrollTax = Math.min(salary, SS_WAGE_BASE_2026) * 0.153;
  const admin =
    toNumber(values, 'payrollAdmin') +
    toNumber(values, 'payrollProviderCost') +
    toNumber(values, 'taxFilingCost') +
    toNumber(values, 'bookkeepingUpgrade') +
    toNumber(values, 'stateCorpCost') +
    toNumber(values, 'adminTimeHours') * toNumber(values, 'ownerHourlyValue') +
    toNumber(values, 'setupCost');
  const grossSavings = Math.max(0, solePropPayrollTax - salaryPayrollTax);
  return { grossSavings, netSavings: grossSavings - admin, admin, profit, salary };
}

function selfEmploymentReserve(values: CalculatorDepthValues): { netProfit: number; reserve: number; protectedCash: number; gap: number } {
  const revenue = toNumber(values, 'revenue') || toNumber(values, 'incomeYtd') + toNumber(values, 'expectedRemainingIncome');
  const expenses = toNumber(values, 'expenses') || toNumber(values, 'expensesYtd') + toNumber(values, 'expectedRemainingExpenses');
  const netProfit = Math.max(0, revenue - expenses);
  const seBase = netProfit * 0.9235;
  const remainingSsBase = Math.max(0, SS_WAGE_BASE_2026 - toNumber(values, 'w2Wages'));
  const seTax = Math.min(seBase, remainingSsBase) * 0.124 + seBase * 0.029;
  const incomeReserve = Math.max(0, netProfit - seTax / 2 - toNumber(values, 'retirement') - toNumber(values, 'healthInsurance')) * ((toNumber(values, 'federalRate') + toNumber(values, 'stateRate')) / 100);
  const reserve = seTax + incomeReserve;
  const protectedCash =
    toNumber(values, 'currentTaxReserve') +
    toNumber(values, 'estimatedPayments') +
    toNumber(values, 'federalEstimatedPaid') +
    toNumber(values, 'quarterlyPaymentsMade') +
    toNumber(values, 'w2Withholding') +
    toNumber(values, 'spouseW2Withholding');
  return { netProfit, reserve, protectedCash, gap: Math.max(0, reserve - protectedCash) };
}

function documentationScore(values: CalculatorDepthValues): number {
  const checks = [
    isChecked(values, 'hasReceipt'),
    isChecked(values, 'hasBankRecord'),
    isChecked(values, 'hasBusinessPurpose'),
    isChecked(values, 'hasProjectTie'),
    isChecked(values, 'hasDateVendorCategory') || toString(values, 'expenseCategory').length > 0,
    toNumber(values, 'businessUsePct') >= 80,
    !isChecked(values, 'mixedUseFlag') || toNumber(values, 'businessUsePct') > 0,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function toString(values: CalculatorDepthValues, id: string): string {
  const value = values[id];
  return typeof value === 'string' ? value : String(value ?? '');
}

function genericBusinessState(context: CalculatorDepthContext): CalculatorStateSummary {
  const negativeSignals = context.result.flags.filter((flag) => /erase|misses|not cover|negative|too low|not ready|does not|below/i.test(flag)).length;
  if (negativeSignals >= 2) {
    return { state: 'fragile', summary: 'The result depends on assumptions that need a second pass before acting.' };
  }
  if (negativeSignals === 1) {
    return { state: 'tight', summary: 'The result can work, but one assumption is carrying too much weight.' };
  }
  return { state: 'stable', summary: 'The result looks workable as a planning estimate, assuming the inputs are honest.' };
}

const commonDecisionModes: CalculatorDecisionMode[] = [
  { label: 'Calculate', description: 'Get the current planning number from the inputs.' },
  { label: 'Optimize', description: 'Look for the lever that would improve the decision.' },
  { label: 'What if', description: 'Stress the result with less convenient assumptions.' },
];

const genericBusinessDepth: CalculatorDepthProfile = {
  decisionModes: commonDecisionModes,
  state: genericBusinessState,
  verdict:
    'The number is useful only if the assumptions are real. Before acting, look for the hidden cost, fragile input, or workflow issue that would make the result fail.',
  whatAdviceLeavesOut:
    'Most business calculator pages stop at arithmetic. The harder part is deciding whether the number survives real-world friction: timing, owner attention, admin load, client behavior, software commitments, and cash pressure.',
  sensitiveAssumptions: ['Monthly revenue or volume', 'Owner time', 'Fixed costs', 'Tax or payroll reserve', 'Cash timing'],
  commonTraps: [
    'Treating the output as a prediction instead of a stress test.',
    'Ignoring owner time because it does not show up as an invoice.',
    'Using the optimistic case as the operating plan.',
  ],
  betterNextMoves: {
    stable: 'Save the expected case and test the conservative case before committing.',
    tight: 'Find the input that is doing the most work and make that assumption more conservative.',
    fragile: 'Delay the decision until the risky input is validated or the downside is smaller.',
    'not-ready': 'Fix the input problem before acting on the result.',
    default: 'Use the result to decide which assumption deserves the next check.',
  },
  realityCheckQuestions: [
    'Which input did you guess instead of measuring?',
    'What happens if revenue arrives later than expected?',
    'What owner time is missing from the model?',
    'What cost would become recurring if you say yes?',
    'What decision would you make if the conservative case were the real one?',
  ],
  methodologyMiniBlock:
    'This calculator turns visible inputs into a planning estimate, then treats the result as a decision signal. It is designed to expose the assumptions that make the decision work or fail, not to predict the future perfectly.',
  doesNotDo: [
    'It does not guarantee a business outcome.',
    'It does not replace tax, legal, payroll, accounting, compliance, or advisor review when those issues are material.',
    'It does not know your contracts, state rules, vendor terms, or books.',
    'It does help you find the assumption that needs the next check.',
  ],
  situationLinks: [
    { label: 'Business Hub', href: '/business/', note: 'Return to the full business decision library.' },
    { label: 'Start Freelancing Track', href: '/tracks/start-freelancing/', note: 'Use a guided path if the decision is part of going solo.' },
    { label: 'Break-Even Calculator', href: '/business/break-even-calculator/', note: 'Find the monthly floor behind the decision.' },
  ],
  faqs: [
    {
      q: 'Why does Kefiw show a state instead of only a number?',
      a: 'Because the same number can be healthy, tight, or fragile depending on which assumption created it. The state tells you how much trust to put in the result.',
    },
    {
      q: 'Should I use the conservative, expected, or aggressive case?',
      a: 'Use expected for discussion, conservative for commitments, and aggressive only when you can explain why the upside case is realistic.',
    },
    {
      q: 'What should I do if the result feels wrong?',
      a: 'Change the assumptions that move the result most. If one input changes the answer dramatically, that input needs better evidence.',
    },
  ],
};

const groupDepth: Record<string, DepthOverride> = {
  Tax: {
    whatAdviceLeavesOut:
      'Most tax planning advice focuses on the possible savings or the payment amount. The part people miss is cash timing, documentation, state rules, admin drag, and the difference between a planning reserve and an actual filing position.',
    sensitiveAssumptions: ['Net business profit', 'W-2 income or withholding', 'Filing status and tax reserve', 'State and local tax assumptions', 'Documentation and admin cost'],
    commonTraps: [
      'Treating business cash as take-home cash.',
      'Counting tax savings before admin costs and documentation risk.',
      'Assuming a federal estimate covers state or local obligations.',
    ],
    doesNotDo: [
      'It does not file taxes or determine a tax position.',
      'It does not determine reasonable salary, eligibility, deductions, penalties, or state treatment.',
      'It does not replace a CPA, enrolled agent, tax software, or official IRS forms.',
      'It does help identify the tax assumptions to verify before acting.',
    ],
    situationLinks: [
      { label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/', note: 'Check the reserve before cash feels spendable.' },
      { label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/', note: 'Turn the annual estimate into payment periods.' },
      { label: 'Dangerous Deduction Checker', href: '/business/dangerous-deduction-checker/', note: 'Review expenses that need stronger records.' },
    ],
  },
  Pricing: {
    whatAdviceLeavesOut:
      'Most pricing advice says to charge more. That is often true, but incomplete. The harder reasons people underprice are weak pipeline, unpaid admin, revision creep, discounts, unclear scope, and confusing gross revenue with actual take-home.',
    sensitiveAssumptions: ['Billable or delivery hours', 'Direct costs and overhead', 'Discounts and scope creep', 'Owner pay', 'Tax and profit reserve'],
    commonTraps: [
      'Treating every working hour as billable.',
      'Discounting revenue without checking profit damage.',
      'Forgetting revisions, sales calls, admin, and payment delays.',
    ],
    situationLinks: [
      { label: 'Minimum Viable Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/', note: 'Find the rate floor behind the offer.' },
      { label: 'Markup & Margin', href: '/business/markup-margin-calculator/', note: 'Check whether a price protects profit.' },
      { label: 'Profit Calculator', href: '/business/profit-calculator/', note: 'Separate owner pay, tax reserve, and retained profit.' },
    ],
  },
  Hiring: {
    whatAdviceLeavesOut:
      'Most hiring advice assumes the role is already clear. In small businesses, the role is often a pile of founder stress. Hiring into that pile can add payroll pressure, management work, onboarding, tools, and ambiguity.',
    sensitiveAssumptions: ['Recurring need', 'Loaded payroll or contractor cost', 'Ramp time', 'Manager time', 'Revenue stability'],
    commonTraps: [
      'Hiring before the role is real.',
      'Treating salary as the full cost.',
      'Ignoring the owner time required to manage the work.',
    ],
    situationLinks: [
      { label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/', note: 'Check whether the work needs a person, software, or deletion.' },
      { label: 'Payroll Burden', href: '/business/payroll-burden-calculator/', note: 'Model cost beyond salary.' },
      { label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/', note: 'Compare flexibility, cost, and commitment.' },
    ],
  },
  Revenue: {
    whatAdviceLeavesOut:
      'Most revenue advice treats the forecast like a target. Operators need to see the pipeline math underneath it: deal size, close rate, churn, collection delay, client concentration, and whether booked revenue becomes cash.',
    sensitiveAssumptions: ['Lead volume', 'Close rate', 'Average deal size', 'Churn or client loss', 'Collection delay'],
    commonTraps: [
      'Confusing booked revenue with collected cash.',
      'Replacing lost revenue instead of fixing the leak.',
      'Building a plan around one large client or one lucky month.',
    ],
    situationLinks: [
      { label: 'Sales Target', href: '/business/sales-target-calculator/', note: 'Translate the revenue gap into pipeline activity.' },
      { label: 'Churn Calculator', href: '/business/churn-calculator/', note: 'Find the leak before chasing more growth.' },
      { label: 'Break-Even Calculator', href: '/business/break-even-calculator/', note: 'Check the floor the forecast must clear.' },
    ],
  },
  Cloud: {
    whatAdviceLeavesOut:
      'Most software-spend advice focuses on the subscription price. The bigger issue is ownership: unused seats, duplicate workflows, annual renewals, AI/API review time, contract terms, and tools nobody is responsible for cleaning up.',
    sensitiveAssumptions: ['Seat count and usage', 'Renewal terms', 'Duplicate tools', 'AI/API or cloud usage', 'Review and maintenance time'],
    commonTraps: [
      'Counting only active subscriptions, not renewal commitments.',
      'Ignoring unused seats and duplicate workflows.',
      'Counting saved time before review time and adoption are real.',
    ],
    situationLinks: [
      { label: 'SaaS Cost', href: '/business/saas-cost-calculator/', note: 'Find the monthly stack cost.' },
      { label: 'Software ROI', href: '/business/software-roi-calculator/', note: 'Check whether a tool changes the workflow enough to pay for itself.' },
      { label: 'Cloud Cost', href: '/business/cloud-cost-calculator/', note: 'Stress-test usage, growth, and overrun assumptions.' },
    ],
  },
};

const freelanceModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Lower billable hours, higher expenses, higher tax reserve, and more scope creep.',
    values: (values) => ({
      billableHoursPerWeek: Math.max(1, Math.round(toNumber(values, 'billableHoursPerWeek') * 0.75)),
      businessExpenses: scale(values, 'businessExpenses', 1.2),
      taxReservePct: pctStep(values, 'taxReservePct', 5),
      discountPct: pctStep(values, 'discountPct', 5),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the inputs currently entered.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Higher utilization, lower expenses, and less unpaid scope creep.',
    values: (values) => ({
      billableHoursPerWeek: Math.max(1, Math.round(toNumber(values, 'billableHoursPerWeek') * 1.2)),
      businessExpenses: scale(values, 'businessExpenses', 0.9),
      taxReservePct: pctStep(values, 'taxReservePct', -3),
      discountPct: pctStep(values, 'discountPct', -5),
    }),
  },
];

const pricingRiskModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Higher scope risk, more discount pressure, lower demand confidence, and more non-billable work where available.',
    values: (values) => ({
      discountPct: pctStep(values, 'discountPct', 10),
      scopeRisk: pctStep(values, 'scopeRisk', 15),
      revisionRisk: pctStep(values, 'revisionRisk', 15),
      demandConfidence: pctStep(values, 'demandConfidence', -15),
      nonBillableHours: Math.round(toNumber(values, 'nonBillableHours') * 1.35),
      actualProjectHours: Math.round(toNumber(values, 'actualProjectHours') * 1.2),
      paymentDelayDays: Math.min(365, toNumber(values, 'paymentDelayDays') + 30),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current pricing assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Cleaner scope, stronger demand, less discount pressure, and fewer hidden hours where available.',
    values: (values) => ({
      discountPct: pctStep(values, 'discountPct', -5),
      scopeRisk: pctStep(values, 'scopeRisk', -15),
      revisionRisk: pctStep(values, 'revisionRisk', -15),
      demandConfidence: pctStep(values, 'demandConfidence', 15),
      nonBillableHours: Math.round(toNumber(values, 'nonBillableHours') * 0.8),
      actualProjectHours: Math.round(toNumber(values, 'actualProjectHours') * 0.9),
      paymentDelayDays: Math.max(0, toNumber(values, 'paymentDelayDays') - 15),
    }),
  },
];

const taxReserveModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Higher reserve rate, lower remaining expenses, weaker withholding, and more pressure from uneven income.',
    values: (values) => ({
      federalRate: pctStep(values, 'federalRate', 4),
      stateRate: pctStep(values, 'stateRate', 2),
      taxReservePct: pctStep(values, 'taxReservePct', 5),
      expectedRemainingIncome: scale(values, 'expectedRemainingIncome', 1.1),
      expectedRemainingExpenses: scale(values, 'expectedRemainingExpenses', 0.9),
      w2Withholding: scale(values, 'w2Withholding', 0.9),
      currentTaxReserve: scale(values, 'currentTaxReserve', 0.85),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current tax reserve assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Lower reserve rate, stronger withholding, and cleaner remaining-year income assumptions.',
    values: (values) => ({
      federalRate: pctStep(values, 'federalRate', -3),
      stateRate: pctStep(values, 'stateRate', -1),
      taxReservePct: pctStep(values, 'taxReservePct', -4),
      expectedRemainingIncome: scale(values, 'expectedRemainingIncome', 0.95),
      expectedRemainingExpenses: scale(values, 'expectedRemainingExpenses', 1.05),
      w2Withholding: scale(values, 'w2Withholding', 1.1),
      currentTaxReserve: scale(values, 'currentTaxReserve', 1.1),
    }),
  },
];

const deductionCautionModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Assumes weaker documentation, lower business-use allocation, and more review pressure.',
    values: (values) => ({
      businessUsePct: pctStep(values, 'businessUsePct', -20),
      hasBusinessPurpose: false,
      hasProjectTie: false,
      mixedUseFlag: true,
      unusuallyLargeAmount: true,
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current deduction documentation assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Assumes cleaner documentation and stronger business-use allocation.',
    values: (values) => ({
      businessUsePct: pctStep(values, 'businessUsePct', 10),
      hasReceipt: true,
      hasBankRecord: true,
      hasBusinessPurpose: true,
      hasProjectTie: true,
      mixedUseFlag: false,
      unusuallyLargeAmount: false,
    }),
  },
];

const sCorpModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Lower profit, higher salary, and higher admin/state cost.',
    values: (values) => ({
      profit: scale(values, 'profit', 0.85),
      salary: scale(values, 'salary', 1.15),
      payrollAdmin: scale(values, 'payrollAdmin', 1.25),
      payrollProviderCost: scale(values, 'payrollProviderCost', 1.25),
      taxFilingCost: scale(values, 'taxFilingCost', 1.25),
      bookkeepingUpgrade: scale(values, 'bookkeepingUpgrade', 1.25),
      stateCorpCost: scale(values, 'stateCorpCost', 1.25),
      adminTimeHours: Math.round(toNumber(values, 'adminTimeHours') * 1.25),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current S-corp assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Higher profit, lower admin cost, and a more favorable salary spread.',
    values: (values) => ({
      profit: scale(values, 'profit', 1.15),
      salary: scale(values, 'salary', 0.95),
      payrollAdmin: scale(values, 'payrollAdmin', 0.9),
      payrollProviderCost: scale(values, 'payrollProviderCost', 0.9),
      taxFilingCost: scale(values, 'taxFilingCost', 0.9),
      bookkeepingUpgrade: scale(values, 'bookkeepingUpgrade', 0.9),
      stateCorpCost: scale(values, 'stateCorpCost', 0.9),
      adminTimeHours: Math.round(toNumber(values, 'adminTimeHours') * 0.9),
    }),
  },
];

const payrollModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Higher burden, more overhead, and the same hours.',
    values: (values) => ({
      burdenPct: pctStep(values, 'burdenPct', 10),
      employeeOverhead: scale(values, 'employeeOverhead', 1.25),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current hiring inputs.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Lower burden and overhead, assuming the role ramps cleanly.',
    values: (values) => ({
      burdenPct: pctStep(values, 'burdenPct', -5),
      employeeOverhead: scale(values, 'employeeOverhead', 0.9),
    }),
  },
];

const hiringRiskModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Higher payroll load, slower ramp, lower revenue stability, and more manager time.',
    values: (values) => ({
      payrollTaxPct: pctStep(values, 'payrollTaxPct', 6),
      employerPayrollTaxPct: pctStep(values, 'employerPayrollTaxPct', 3),
      payrollReserve: scale(values, 'payrollReserve', 0.8),
      managerHoursWeek: Math.round(toNumber(values, 'managerHoursWeek') * 1.35),
      managerTimeOverrunHours: Math.round(toNumber(values, 'managerTimeOverrunHours') * 1.5),
      revenueStabilityScore: pctStep(values, 'revenueStabilityScore', -15),
      month1ProductivityPct: pctStep(values, 'month1ProductivityPct', -15),
      month2ProductivityPct: pctStep(values, 'month2ProductivityPct', -15),
      month3ProductivityPct: pctStep(values, 'month3ProductivityPct', -10),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current hiring assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Cleaner ramp, lower manager load, and stronger revenue stability.',
    values: (values) => ({
      payrollTaxPct: pctStep(values, 'payrollTaxPct', -3),
      employerPayrollTaxPct: pctStep(values, 'employerPayrollTaxPct', -1),
      managerHoursWeek: Math.max(0, Math.round(toNumber(values, 'managerHoursWeek') * 0.8)),
      revenueStabilityScore: pctStep(values, 'revenueStabilityScore', 10),
      month1ProductivityPct: pctStep(values, 'month1ProductivityPct', 10),
      month2ProductivityPct: pctStep(values, 'month2ProductivityPct', 10),
      month3ProductivityPct: pctStep(values, 'month3ProductivityPct', 10),
    }),
  },
];

const hireAutomateModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Automation removes less work, costs more to set up, and needs more review.',
    values: (values) => ({
      automationCoveragePct: pctStep(values, 'automationCoveragePct', -15),
      automationSetupCost: scale(values, 'automationSetupCost', 1.25),
      reviewHoursWeek: Math.round(toNumber(values, 'reviewHoursWeek') * 1.5),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current workflow assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Automation adoption is smoother and review work falls.',
    values: (values) => ({
      automationCoveragePct: pctStep(values, 'automationCoveragePct', 15),
      automationSetupCost: scale(values, 'automationSetupCost', 0.9),
      reviewHoursWeek: Math.max(0, Math.round(toNumber(values, 'reviewHoursWeek') * 0.75)),
    }),
  },
];

const revenueModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Fewer leads, lower close rate, smaller deals, higher churn, and slower collection.',
    values: (values) => ({
      newLeads: Math.round(toNumber(values, 'newLeads') * 0.75),
      qualifiedLeadPct: pctStep(values, 'qualifiedLeadPct', -10),
      closeRatePct: pctStep(values, 'closeRatePct', -5),
      averageDeal: scale(values, 'averageDeal', 0.9),
      churnPct: pctStep(values, 'churnPct', 3),
      largestClientRevenue: scale(values, 'largestClientRevenue', 1.15),
      revenueDropPct: pctStep(values, 'revenueDropPct', 10),
      collectionDelayDays: Math.min(180, toNumber(values, 'collectionDelayDays') + 30),
      paymentDelayDays: Math.min(180, toNumber(values, 'paymentDelayDays') + 30),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the forecast assumptions entered.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'More leads, better close rate, lower churn, and faster collection.',
    values: (values) => ({
      newLeads: Math.round(toNumber(values, 'newLeads') * 1.2),
      qualifiedLeadPct: pctStep(values, 'qualifiedLeadPct', 10),
      closeRatePct: pctStep(values, 'closeRatePct', 5),
      averageDeal: scale(values, 'averageDeal', 1.1),
      churnPct: pctStep(values, 'churnPct', -2),
      largestClientRevenue: scale(values, 'largestClientRevenue', 0.85),
      revenueDropPct: pctStep(values, 'revenueDropPct', -10),
      collectionDelayDays: Math.max(0, toNumber(values, 'collectionDelayDays') - 15),
      paymentDelayDays: Math.max(0, toNumber(values, 'paymentDelayDays') - 15),
    }),
  },
];

const saasModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'More unused seats, more duplicate spend, and a larger renewal increase.',
    values: (values) => ({
      unusedSeatPct: pctStep(values, 'unusedSeatPct', 10),
      duplicateToolsMonthly: scale(values, 'duplicateToolsMonthly', 1.25),
      priceIncreasePct: pctStep(values, 'priceIncreasePct', 10),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current software stack inputs.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Cleaner seat usage, fewer duplicates, and a smaller price increase.',
    values: (values) => ({
      unusedSeatPct: pctStep(values, 'unusedSeatPct', -10),
      duplicateToolsMonthly: scale(values, 'duplicateToolsMonthly', 0.75),
      priceIncreasePct: pctStep(values, 'priceIncreasePct', -5),
    }),
  },
];

const softwareRoiModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Less real adoption, lower time savings, more review, and higher cost.',
    values: (values) => ({
      hoursSavedWeek: Math.round(toNumber(values, 'hoursSavedWeek') * 0.75),
      adoptionPct: pctStep(values, 'adoptionPct', -15),
      reviewHoursWeek: Math.round(toNumber(values, 'reviewHoursWeek') * 1.5),
      monthlyCost: scale(values, 'monthlyCost', 1.15),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the current software ROI assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Better adoption, more saved hours, and less review work.',
    values: (values) => ({
      hoursSavedWeek: Math.round(toNumber(values, 'hoursSavedWeek') * 1.2),
      adoptionPct: pctStep(values, 'adoptionPct', 15),
      reviewHoursWeek: Math.max(0, Math.round(toNumber(values, 'reviewHoursWeek') * 0.75)),
      monthlyCost: scale(values, 'monthlyCost', 0.95),
    }),
  },
];

const cloudGrowthModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Higher growth, higher transfer/logging pressure, and less commitment coverage.',
    values: (values) => ({
      growthPct: pctStep(values, 'growthPct', 25),
      overrunPct: pctStep(values, 'overrunPct', 15),
      trafficGrowthPct: pctStep(values, 'trafficGrowthPct', 35),
      dataTransferGrowthPct: pctStep(values, 'dataTransferGrowthPct', 35),
      aiApiGrowthPct: pctStep(values, 'aiApiGrowthPct', 40),
      committedCoveragePct: pctStep(values, 'committedCoveragePct', -15),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the entered cloud growth assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Cleaner usage, lower overrun, and better commitment coverage.',
    values: (values) => ({
      growthPct: pctStep(values, 'growthPct', -10),
      overrunPct: pctStep(values, 'overrunPct', -10),
      trafficGrowthPct: pctStep(values, 'trafficGrowthPct', -20),
      dataTransferGrowthPct: pctStep(values, 'dataTransferGrowthPct', -20),
      aiApiGrowthPct: pctStep(values, 'aiApiGrowthPct', -25),
      committedCoveragePct: pctStep(values, 'committedCoveragePct', 10),
    }),
  },
];

const aiRoiModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Lower adoption, less saved time, more review, and higher error cost.',
    values: (values) => ({
      adoptionPct: pctStep(values, 'adoptionPct', -20),
      minutesSavedPerTask: Math.max(0, Math.round(toNumber(values, 'minutesSavedPerTask') * 0.7)),
      reviewMinutesPerTask: Math.round(toNumber(values, 'reviewMinutesPerTask') * 1.5),
      errorRiskMonthly: scale(values, 'errorRiskMonthly', 1.5),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the entered AI workflow assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Higher adoption, more saved time, and lower review drag.',
    values: (values) => ({
      adoptionPct: pctStep(values, 'adoptionPct', 15),
      minutesSavedPerTask: Math.round(toNumber(values, 'minutesSavedPerTask') * 1.2),
      reviewMinutesPerTask: Math.max(0, Math.round(toNumber(values, 'reviewMinutesPerTask') * 0.75)),
      errorRiskMonthly: scale(values, 'errorRiskMonthly', 0.75),
    }),
  },
];

const aiTokenModes: CalculatorAssumptionMode[] = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Longer prompts, longer outputs, more retries, and faster growth.',
    values: (values) => ({
      inputTokens: Math.round(toNumber(values, 'inputTokens') * 1.25),
      outputTokens: Math.round(toNumber(values, 'outputTokens') * 1.25),
      retryPct: pctStep(values, 'retryPct', 10),
      growthPct: pctStep(values, 'growthPct', 30),
    }),
  },
  { id: 'expected', label: 'Expected', description: 'Uses the entered token and request assumptions.' },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Shorter context, fewer retries, and better cache behavior.',
    values: (values) => ({
      inputTokens: Math.round(toNumber(values, 'inputTokens') * 0.8),
      outputTokens: Math.round(toNumber(values, 'outputTokens') * 0.85),
      retryPct: pctStep(values, 'retryPct', -5),
      cacheHitPct: pctStep(values, 'cacheHitPct', 15),
    }),
  },
];

const depthByKind: Partial<Record<VerticalCalculatorKind, DepthOverride>> = {
  'freelance-rate': {
    state: ({ values }) => {
      const billable = toNumber(values, 'billableHoursPerWeek');
      const taxReserve = toNumber(values, 'taxReservePct');
      const expenses = toNumber(values, 'businessExpenses');
      const takeHome = toNumber(values, 'targetTakeHome');
      if (billable < 10 || takeHome <= 0) {
        return { state: 'not-ready', summary: 'The model needs a realistic income target and enough billable capacity before the rate means much.' };
      }
      if (billable < 18 || expenses > takeHome * 0.4) {
        return { state: 'fragile', summary: 'A small drop in paid hours or a small rise in expenses can break the rate floor.' };
      }
      if (billable < 25 || taxReserve < 25) {
        return { state: 'tight', summary: 'The rate can work, but it depends on consistent billable hours and a disciplined tax reserve.' };
      }
      return { state: 'stable', summary: 'The rate supports taxes, expenses, time off, admin load, and a slow-month buffer.' };
    },
    verdict:
      'Your rate is not high because you are greedy. It is high because only part of your working time is billable. Lowering the rate makes the problem worse unless you increase paid hours, reduce unpaid admin, or package the work differently.',
    whatAdviceLeavesOut:
      'Most freelance pricing advice says to charge more. That is not wrong, but it skips the harder reason people undercharge: fear of losing clients, weak pipeline, unpaid admin time, revision creep, and confusing gross revenue with take-home pay.',
    sensitiveAssumptions: ['Billable hours per week', 'Desired take-home pay', 'Tax reserve', 'Business expenses', 'Unpaid admin, sales, and revision time'],
    commonTraps: [
      'Treating 40 working hours as 40 billable hours.',
      'Forgetting unpaid sales, admin, revisions, and client communication.',
      'Lowering the rate instead of fixing utilization or scope.',
    ],
    betterNextMoves: {
      stable: 'Turn the rate into package pricing, a retainer floor, or a proposal minimum.',
      tight: 'Reduce unpaid admin or increase billable utilization before discounting.',
      fragile: 'Stress-test the rate with fewer billable hours and a lost-client month.',
      'not-ready': 'Rework expenses, income goal, or pricing model before taking client work.',
      default: 'Find whether billable utilization or scope creep is the real pressure point.',
    },
    scenarioPresets: [
      {
        label: 'New freelancer leaving a job',
        description: 'Moderate income target, real tax reserve, lower utilization.',
        values: { targetTakeHome: 75000, businessExpenses: 12000, taxReservePct: 28, billableHoursPerWeek: 18, workWeeks: 46, profitReservePct: 10, discountPct: 8 },
      },
      {
        label: 'Senior consultant, 20 hrs/week',
        description: 'Higher take-home, lower billable capacity, strong reserve.',
        values: { targetTakeHome: 140000, businessExpenses: 26000, taxReservePct: 32, billableHoursPerWeek: 20, workWeeks: 44, profitReservePct: 12, discountPct: 5 },
      },
      {
        label: 'Creator with mixed income',
        description: 'Lower billable hours and meaningful platform/tool costs.',
        values: { targetTakeHome: 70000, businessExpenses: 22000, taxReservePct: 27, billableHoursPerWeek: 12, workWeeks: 48, profitReservePct: 12, discountPct: 10 },
      },
      {
        label: 'Agency subcontractor',
        description: 'More billable hours but less pricing control.',
        values: { targetTakeHome: 95000, businessExpenses: 14000, taxReservePct: 30, billableHoursPerWeek: 28, workWeeks: 46, profitReservePct: 8, discountPct: 12 },
      },
      {
        label: 'Fractional operator',
        description: 'High-value work, lower capacity, stronger margin requirement.',
        values: { targetTakeHome: 160000, businessExpenses: 30000, taxReservePct: 33, billableHoursPerWeek: 18, workWeeks: 44, profitReservePct: 15, discountPct: 5 },
      },
      {
        label: 'Project designer/developer',
        description: 'Protects against revision and sales drag.',
        values: { targetTakeHome: 105000, businessExpenses: 20000, taxReservePct: 30, billableHoursPerWeek: 24, workWeeks: 45, profitReservePct: 12, discountPct: 15 },
      },
    ],
    assumptionModes: freelanceModes,
    realityCheckQuestions: [
      'How many hours do you actually bill in a normal week?',
      'How much time do you lose to sales, admin, revisions, and client communication?',
      'What happens if one client leaves?',
      'How many unpaid weeks should the business survive?',
      'Are you pricing only the work, or the whole business around the work?',
    ],
    methodologyMiniBlock:
      'This calculator starts with desired take-home pay, grosses it up for tax reserve, adds business expenses and slow-month protection, then divides by actual billable hours. The output is a floor, not a positioning ceiling.',
    situationLinks: [
      { label: 'If the tax reserve felt high', href: '/business/self-employed-tax-calculator/', note: 'Check the tax set-aside separately.' },
      { label: 'If the rate felt too high', href: '/business/markup-margin-calculator/', note: 'Check scope, margin, and discount pressure.' },
      { label: 'If the business still feels fragile', href: '/business/revenue-forecast-calculator/', note: 'Stress-test client and pipeline assumptions.' },
      { label: 'Start Freelancing Track', href: '/tracks/start-freelancing/', note: 'Turn the rate into a broader readiness plan.' },
    ],
    faqs: [
      { q: 'Why does my freelance rate look so high?', a: 'Because a freelance rate pays for taxes, unpaid time, expenses, sales work, admin, slow months, and the time you cannot bill. A W-2 hourly comparison hides those costs.' },
      { q: 'Should I include non-billable time?', a: 'Yes. If sales calls, proposals, revisions, bookkeeping, and client communication are required to run the business, the billable rate has to fund them.' },
      { q: 'What if I only bill 20 hours per week?', a: 'Then the rate has to be materially higher than a 40-hour wage. Lowering the rate without improving utilization usually deepens the problem.' },
      { q: 'Should I charge hourly, project, or retainer?', a: 'Use the floor rate to protect yourself, then choose the pricing model that matches scope clarity, revision risk, and client value.' },
      { q: 'How do taxes affect my freelance rate?', a: 'Taxes reduce what turns into take-home pay, so the rate needs a reserve before you treat revenue as spendable cash.' },
    ],
    operatorExamples: [
      {
        title: 'Consultant with 22 billable hours',
        body: 'A consultant wants to take home $90,000, expects $18,000 of annual business expenses, reserves 28 percent for taxes, takes four weeks off, and bills 22 hours per week.',
        takeaway: 'The rate is not only paying for the hour. It is paying for the business that makes the hour possible.',
      },
    ],
  },
  'business-expense-budget': {
    state: ({ values }) => {
      const revenue = toNumber(values, 'monthlyRevenue');
      const fixed =
        toNumber(values, 'softwareSubscriptions') +
        toNumber(values, 'bookkeepingAccounting') +
        toNumber(values, 'insurance') +
        toNumber(values, 'legalAdmin') +
        toNumber(values, 'internetPhone') +
        toNumber(values, 'paymentProcessing') +
        toNumber(values, 'workspace') +
        toNumber(values, 'equipment') +
        toNumber(values, 'marketing') +
        toNumber(values, 'educationTraining');
      const owner = toNumber(values, 'ownerSalaryTarget') + toNumber(values, 'taxReserveMonthly') + toNumber(values, 'emergencyBuffer');
      const total = fixed + owner + toNumber(values, 'contractors') + toNumber(values, 'materialsTools') + toNumber(values, 'travelShipping');
      if (revenue > 0 && total > revenue * 0.9) return { state: 'not-ready', label: 'Fragile', summary: 'Costs are high enough that the business has little room after owner pay, taxes, and buffer.' };
      if (revenue > 0 && total > revenue * 0.7) return { state: 'fragile', label: 'Heavy', summary: 'Fixed and owner costs require consistent revenue to avoid cash pressure.' };
      if (fixed > revenue * 0.25 && revenue > 0) return { state: 'tight', label: 'Watchlist', summary: 'Costs are workable, but subscriptions or overhead need regular review.' };
      return { state: 'stable', label: 'Lean', summary: 'The cost base looks manageable relative to the modeled revenue.' };
    },
    verdict:
      'The cost of staying open is not only the obvious bills. Monthly software, banking fees, bookkeeping, owner time, tax reserve, and small tools become permanent overhead when nobody reviews them.',
    whatAdviceLeavesOut:
      'Most business-budget advice lists expenses. That is useful, but it misses the emotional part: small monthly costs become invisible. A $39 tool, a $99 tool, and a $249 platform do not feel like hiring someone, but together they create permanent overhead.',
    sensitiveAssumptions: ['Monthly software and fixed costs', 'Owner pay target', 'Tax reserve', 'Support/admin hours', 'Active clients or projects'],
    commonTraps: ['Counting only annual expenses and missing monthly commitments.', 'Ignoring owner admin time.', 'Letting subscription creep become normal overhead.'],
    betterNextMoves: {
      stable: 'Use the cost per billable hour to update your rate floor.',
      tight: 'Review subscriptions and recurring fees before adding new tools.',
      fragile: 'Cut or consolidate overhead before relying on higher volume.',
      'not-ready': 'Freeze new software and rebuild the budget before pricing more work.',
      default: 'Turn the budget into a pricing floor and break-even target.',
    },
    scenarioPresets: [
      { label: 'Solo consultant', description: 'Lean stack with owner pay and tax reserve.', values: { softwareSubscriptions: 450, bookkeepingAccounting: 250, workspace: 150, ownerSalaryTarget: 9000, taxReserveMonthly: 3200, activeClients: 5, monthlyRevenue: 30000 } },
      { label: 'Small agency', description: 'More contractors, tools, and delivery overhead.', values: { softwareSubscriptions: 1500, contractors: 8500, materialsTools: 900, ownerSalaryTarget: 12000, taxReserveMonthly: 6000, activeClients: 10, monthlyRevenue: 65000 } },
      { label: 'Creator/operator', description: 'Platform, marketing, and uneven revenue pressure.', values: { softwareSubscriptions: 800, marketing: 1200, educationTraining: 300, ownerSalaryTarget: 6500, taxReserveMonthly: 2200, activeClients: 3, monthlyRevenue: 18000 } },
    ],
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['Which monthly costs have no owner?', 'Which tools duplicate a workflow?', 'What cost grows when a new client is added?', 'What owner time is missing from the budget?', 'What breaks if revenue drops 20 percent?'],
    methodologyMiniBlock:
      'This calculator separates fixed operating cost, delivery/admin cost, owner cost, tax reserve, and buffer. The point is not perfect accounting. It is to expose the monthly cost floor that pricing has to carry.',
    situationLinks: [
      { label: 'Minimum Viable Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/', note: 'Turn overhead into a rate floor.' },
      { label: 'Break-Even Calculator', href: '/business/break-even-calculator/', note: 'See how many clients or projects carry the budget.' },
      { label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/', note: 'Audit software spend separately.' },
    ],
    faqs: [
      { q: 'What counts as a business expense for pricing?', a: 'Include cash expenses, software, contractors, insurance, admin, payment fees, owner pay, tax reserve, and the time needed to keep the business running.' },
      { q: 'Why does low overhead still hide bad pricing?', a: 'A business can look lean and still underprice if owner time, taxes, support, and slow months are not funded.' },
      { q: 'Should I cut expenses or raise prices?', a: 'Cut duplicate or low-value overhead first, but do not use expense cutting to avoid fixing a price that cannot carry the work.' },
    ],
  },
  'margin-pricing': {
    state: ({ values }) => {
      const price = toNumber(values, 'price') * (1 - toNumber(values, 'discountPct') / 100);
      const cost =
        toNumber(values, 'directCost') +
        toNumber(values, 'laborCost') +
        toNumber(values, 'contractorCost') +
        toNumber(values, 'toolCost') +
        toNumber(values, 'shippingFulfillment') +
        toNumber(values, 'overheadShare');
      const profit = price - cost;
      const margin = price > 0 ? profit / price : 0;
      const target = toNumber(values, 'targetMarginPct') / 100;
      if (profit <= 0) return { state: 'not-ready', label: 'Margin broken', summary: 'The tested price does not support cost and overhead.' };
      if (margin < target * 0.7) return { state: 'fragile', label: 'Discount-sensitive', summary: 'A small discount or cost increase removes too much profit.' };
      if (margin < target) return { state: 'tight', label: 'Thin margin', summary: 'The price works, but discounting is dangerous.' };
      return { state: 'stable', label: 'Healthy margin', summary: 'The price protects profit after cost, overhead, and fees.' };
    },
    verdict:
      'Revenue is not breathing room. A discount feels small because it is taken from price, but it usually comes out of profit first.',
    whatAdviceLeavesOut:
      'Most markup and margin tools explain the formula, but they do not explain the behavioral trap. Discounts feel small because they are taken from revenue, but they come out of profit.',
    sensitiveAssumptions: ['Direct cost', 'Labor and contractor cost', 'Overhead allocation', 'Payment fees', 'Discount percentage'],
    commonTraps: ['Mixing up markup and margin.', 'Discounting before checking profit dollars.', 'Leaving payment fees or overhead out of cost.'],
    betterNextMoves: {
      stable: 'Use the margin as a floor in proposals and discounts.',
      tight: 'Raise price or lower scope before offering a discount.',
      fragile: 'Build a discount rule and minimum safe price.',
      'not-ready': 'Reprice or remove cost before selling at this level.',
      default: 'Check whether discounts or cost increases are causing the leak.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['What cost did you leave out because it felt small?', 'What happens after a 10 or 20 percent discount?', 'Is markup being mistaken for margin?', 'What is the minimum profit dollar amount you need?', 'Do payment fees change by payment method?'],
    methodologyMiniBlock:
      'This calculator totals direct cost, labor, tools, payment fees, and overhead, then compares price, markup, margin, target margin, and discount damage.',
    situationLinks: [
      { label: 'Discount Damage', href: '/business/discount-damage-calculator/', note: 'Test a client discount directly.' },
      { label: 'Profit Calculator', href: '/business/profit-calculator/', note: 'See whether margin becomes retained profit.' },
      { label: 'Price Increase Planner', href: '/business/price-increase-planner/', note: 'Plan a margin repair.' },
    ],
    faqs: [
      { q: 'Why do discounts hurt margin more than revenue?', a: 'Because costs usually do not fall when price falls. The discount is absorbed by profit first.' },
      { q: 'What markup do I need to make profit?', a: 'Start with total cost, choose a target margin, then calculate price from margin instead of guessing a markup.' },
      { q: 'Should overhead be included in margin?', a: 'For pricing decisions, yes. A price that covers direct cost but not overhead still weakens the business.' },
    ],
  },
  'break-even': {
    state: ({ values }) => {
      const fixed = toNumber(values, 'fixedMonthly') + toNumber(values, 'ownerPay') + toNumber(values, 'cashReserve') + toNumber(values, 'targetMonthlyProfit');
      const margin = Math.max(0.05, 1 - toNumber(values, 'variableCostPct') / 100);
      const needed = fixed / margin;
      const expected = toNumber(values, 'expectedMonthlyRevenue');
      if (expected > 0 && needed > expected) return { state: 'not-ready', label: 'Overbuilt', summary: 'Fixed costs are too high for the current revenue assumption.' };
      if (expected > 0 && needed > expected * 0.9) return { state: 'fragile', label: 'Fragile', summary: 'A small revenue drop creates a loss.' };
      if (expected > 0 && needed > expected * 0.75) return { state: 'tight', label: 'Tight', summary: 'Break-even is close to expected revenue.' };
      return { state: 'stable', label: 'Flexible', summary: 'Break-even is comfortably below expected revenue.' };
    },
    verdict:
      'Break-even is not the goal. It is the warning light. If the business only works when every week goes perfectly, the model is too fragile.',
    whatAdviceLeavesOut:
      'Most break-even advice treats the number like a finish line. In a small business, break-even is where danger starts to fade, not where the business becomes healthy.',
    sensitiveAssumptions: ['Fixed costs', 'Owner pay', 'Variable cost', 'Average sale value', 'Expected revenue'],
    commonTraps: ['Treating break-even as success.', 'Forgetting owner pay.', 'Building a plan that requires full billable capacity every month.'],
    betterNextMoves: {
      stable: 'Use the gap above break-even to fund tax reserve, savings, and reinvestment.',
      tight: 'Lower fixed costs or raise average sale value before adding commitments.',
      fragile: 'Stress-test a 20 percent revenue drop and simplify the model.',
      'not-ready': 'Cut fixed cost, raise price, or rebuild the offer before scaling.',
      default: 'Use break-even as a warning light, not a target.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['How many clients cover owner pay?', 'What happens if revenue drops 20 percent?', 'Does break-even require exhausting billable capacity?', 'Which fixed costs can be reduced?', 'Is average sale value based on collected cash?'],
    methodologyMiniBlock:
      'This calculator divides the monthly cost floor by contribution margin, then translates the result into revenue, clients, units, and billable hours.',
    situationLinks: [
      { label: 'Profit Calculator', href: '/business/profit-calculator/', note: 'Move past survival into retained profit.' },
      { label: 'Minimum Viable Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/', note: 'Translate break-even into a rate floor.' },
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/', note: 'Test whether revenue can carry the floor.' },
    ],
    faqs: [
      { q: 'How many clients do I need to break even?', a: 'Divide the revenue floor by average collected client revenue, then check whether delivery capacity can support that count.' },
      { q: 'Should owner pay be in break-even?', a: 'Yes. A business that breaks even only because the owner is unpaid is not actually healthy.' },
      { q: 'Why is break-even not the goal?', a: 'Because break-even leaves little room for taxes, savings, reinvestment, bad months, or mistakes.' },
    ],
  },
  'profit-plan': {
    state: ({ values }) => {
      const revenue = toNumber(values, 'recurringRevenue') + toNumber(values, 'projectRevenue') + toNumber(values, 'oneTimeRevenue') || toNumber(values, 'revenue');
      const collected = Math.max(0, revenue - toNumber(values, 'lateUncollectedRevenue'));
      const direct = collected * toNumber(values, 'directCostPct') / 100 + toNumber(values, 'contractors') + toNumber(values, 'materials') + toNumber(values, 'supportLaborCost');
      const retained = collected - direct - toNumber(values, 'operatingExpenses') - toNumber(values, 'ownerPay') - toNumber(values, 'reinvestment') - toNumber(values, 'emergencyReserve') - toNumber(values, 'debtRepayment');
      if (retained < 0) return { state: 'not-ready', label: 'Leaking cash', summary: 'Revenue does not cover costs and owner needs.' };
      if (toNumber(values, 'ownerPay') <= 0) return { state: 'tight', label: 'Owner-funded', summary: 'The business survives because owner pay is missing or too low.' };
      if (retained < toNumber(values, 'retainedProfitGoal')) return { state: 'fragile', label: 'Busy but thin', summary: 'Revenue exists, but retained profit is weak.' };
      return { state: 'stable', label: 'Profitable', summary: 'The business keeps money after owner pay and costs.' };
    },
    verdict:
      'Profit is not revenue minus a few visible expenses. The business has to work after owner pay, tax reserve, reinvestment, debt, and cash buffer.',
    whatAdviceLeavesOut:
      'Most profit calculators treat profit like revenue minus expenses. For small operators, the harder question is whether the business still works after the owner is paid, taxes are reserved, and the business keeps money for future risk.',
    sensitiveAssumptions: ['Collected revenue', 'Delivery cost', 'Operating expenses', 'Owner pay', 'Tax reserve and retained profit goal'],
    commonTraps: ['Treating late invoices as cash.', 'Underpaying the owner to make profit look better.', 'Ignoring reinvestment and emergency reserves.'],
    betterNextMoves: {
      stable: 'Decide how retained profit will be split between buffer, reinvestment, and distributions.',
      tight: 'Set a realistic owner-pay floor before calling the business profitable.',
      fragile: 'Find whether pricing, delivery cost, or operating expense is leaking profit.',
      'not-ready': 'Pause growth spending and rebuild price, cost, or collection assumptions.',
      default: 'Separate revenue, cash, owner pay, tax reserve, and retained profit.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['Does revenue become collected cash?', 'Is owner pay real?', 'What cost grows with each client?', 'What profit remains after tax reserve?', 'Does growth improve profit or only workload?'],
    methodologyMiniBlock:
      'This calculator separates revenue streams, late cash, delivery cost, operating expense, owner pay, tax reserve, reinvestment, and retained profit.',
    situationLinks: [
      { label: 'Client Profitability', href: '/business/client-profitability-calculator/', note: 'Find which clients are carrying or draining profit.' },
      { label: 'Markup & Margin', href: '/business/markup-margin-calculator/', note: 'Repair gross profit before it reaches the P&L.' },
      { label: 'Break-Even Calculator', href: '/business/break-even-calculator/', note: 'Check the survival line.' },
    ],
    faqs: [
      { q: 'Why is my business busy but not profitable?', a: 'Revenue may be absorbed by delivery cost, unpaid owner time, discounts, support, late payment, overhead, and missing tax reserves.' },
      { q: 'Should owner pay count as an expense?', a: 'For planning, yes. Otherwise profit only exists because the owner is subsidizing the business.' },
      { q: 'What if revenue grows but profit does not?', a: 'Then the growth likely carries cost, complexity, discounting, or support burden that rises with revenue.' },
    ],
  },
  'pricing-confidence': {
    state: ({ values }) => {
      const price = toNumber(values, 'proposedPrice') * (1 - toNumber(values, 'discountPct') / 100);
      const cost = toNumber(values, 'estimatedDeliveryCost') + toNumber(values, 'businessExpensesAllocation');
      const margin = price > 0 ? (price - cost) / price : 0;
      const risk = toNumber(values, 'scopeRisk') + toNumber(values, 'paymentDelayRisk') + toNumber(values, 'clientConcentrationPct') + (100 - toNumber(values, 'demandConfidence'));
      const score = clamp(Math.round(margin * 100 + 45 - risk * 0.18), 0, 100);
      if (score < 50) return { state: 'not-ready', label: 'Underpriced', summary: 'The work likely costs more than it appears.' };
      if (score < 70) return { state: 'fragile', label: 'Fragile', summary: 'The price depends on optimistic assumptions.' };
      if (score < 85) return { state: 'tight', label: 'Workable', summary: 'The price can work if scope and delivery stay controlled.' };
      return { state: 'stable', label: 'Strong', summary: 'The price covers the work and the business around the work.' };
    },
    verdict:
      'Pricing confidence is not bravado. It is whether the price covers delivery, overhead, tax reserve, hidden time, and the risk that the project expands.',
    whatAdviceLeavesOut:
      'Most pricing advice treats confidence as a mindset problem. Sometimes it is a math problem: hidden hours, discounts, weak scope, late payment, and concentration risk can make a confident price still underpriced.',
    sensitiveAssumptions: ['Proposed price', 'Delivery cost', 'Non-billable hours', 'Scope risk', 'Demand confidence'],
    commonTraps: ['Calling a price strong before counting support.', 'Discounting without rescoping.', 'Ignoring client concentration because the current client feels safe.'],
    betterNextMoves: {
      stable: 'Protect scope so the strong price stays strong.',
      tight: 'Add revision limits and payment timing before quoting.',
      fragile: 'Raise price, reduce scope, or remove unpaid obligations.',
      'not-ready': 'Do not quote this as-is. Rebuild the offer or price floor.',
      default: 'Find the input that is making the score fragile.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['What hidden work is included?', 'What support is expected after delivery?', 'How late can payment arrive?', 'Does the client represent too much revenue?', 'Would this price survive one extra revision round?'],
    methodologyMiniBlock:
      'This calculator scores price strength by comparing price to cost, tax reserve, hidden hours, desired margin, discount damage, scope risk, payment delay, concentration, and demand confidence.',
    situationLinks: [
      { label: 'Scope Creep Cost', href: '/business/scope-creep-cost-calculator/', note: 'If unpaid work is the weak point.' },
      { label: 'Discount Damage', href: '/business/discount-damage-calculator/', note: 'If the discount is the weak point.' },
      { label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/', note: 'If negotiation pressure is the weak point.' },
    ],
    faqs: [
      { q: 'What is a pricing confidence score?', a: 'It is a planning score that tests whether price covers visible cost, hidden time, margin, tax reserve, and delivery risk.' },
      { q: 'Can a high price still be fragile?', a: 'Yes. A high price can still fail if scope is vague, payment is slow, support is unlimited, or the client concentration risk is too high.' },
      { q: 'What should I fix first?', a: 'Fix the input that moves the score most: hidden hours, discount, scope risk, or delivery cost.' },
    ],
  },
  'discount-damage': {
    state: ({ values }) => {
      const price = toNumber(values, 'originalPrice');
      const cost = toNumber(values, 'directCost') + toNumber(values, 'overheadAllocation') + price * toNumber(values, 'paymentFeesPct') / 100;
      const discounted = price * (1 - toNumber(values, 'discountPct') / 100);
      const profit = discounted - cost;
      const margin = discounted > 0 ? profit / discounted : 0;
      if (profit <= 0) return { state: 'not-ready', label: 'Do not discount', summary: 'The discount makes the work financially weak.' };
      if (margin < 0.15) return { state: 'fragile', label: 'Margin damage', summary: 'The discount removes too much profit.' };
      if (margin < 0.3) return { state: 'tight', label: 'Painful but possible', summary: 'The discount works only with clear volume or strategic value.' };
      return { state: 'stable', label: 'Safe discount', summary: 'Margin remains healthy after the discount.' };
    },
    verdict:
      'The client sees savings. You feel margin loss. Discount only after checking whether volume, scope reduction, or strategic value actually offsets the damage.',
    whatAdviceLeavesOut:
      'Most discount advice talks about closing the deal. It does not talk about what happens after the deal is closed: same work, lower profit, higher resentment, and often a client trained to question the price.',
    sensitiveAssumptions: ['Original price', 'Direct cost', 'Overhead allocation', 'Discount percentage', 'Extra sales expected'],
    commonTraps: ['Discounting full scope instead of reducing scope.', 'Assuming volume will appear.', 'Training clients to wait for a lower price.'],
    betterNextMoves: {
      stable: 'Document why this discount is allowed and when it ends.',
      tight: 'Offer a payment plan or smaller scope before reducing price.',
      fragile: 'Rescope the work or remove support before discounting.',
      'not-ready': 'Do not discount this scope. Change price, scope, or terms.',
      default: 'Compare discount against payment plan and scope reduction.',
    },
    scenarioPresets: [
      { label: '10 percent courtesy discount', description: 'Small discount on a healthy margin.', values: { originalPrice: 5000, directCost: 1500, overheadAllocation: 500, discountPct: 10, expectedExtraSales: 1, deliveryHoursPerSale: 25 } },
      { label: '20 percent close-the-deal discount', description: 'The classic margin-damage test.', values: { originalPrice: 5000, directCost: 1800, overheadAllocation: 650, discountPct: 20, expectedExtraSales: 1, deliveryHoursPerSale: 28 } },
      { label: 'Thin-margin offer', description: 'Discounting when cost is already high.', values: { originalPrice: 3000, directCost: 1900, overheadAllocation: 500, discountPct: 15, expectedExtraSales: 2, deliveryHoursPerSale: 20 } },
    ],
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['Does scope shrink with the discount?', 'How many extra sales are truly likely?', 'Will the client expect this price again?', 'What profit remains after cost?', 'Would a payment plan solve the same problem?'],
    methodologyMiniBlock:
      'This calculator compares profit before and after discount, then shows margin change, lost profit per sale, extra sales needed, and effective hourly profit.',
    situationLinks: [
      { label: 'Discount Refusal Script', href: '/business/pricing/templates/discount-refusal-script/', note: 'Say no by rescoping instead of defending.' },
      { label: 'Markup & Margin', href: '/business/markup-margin-calculator/', note: 'Check the full margin model.' },
      { label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/', note: 'Find the floor before negotiating.' },
    ],
    faqs: [
      { q: 'How much does a 10 percent discount reduce profit?', a: 'It depends on margin. If costs are fixed, the discount comes directly out of profit dollars.' },
      { q: 'Is a payment plan better than a discount?', a: 'Often yes, because a payment plan can address cash timing without permanently reducing the value of the work.' },
      { q: 'How do I say no to a discount?', a: 'A clean response is to reduce scope instead of reducing price for the same scope.' },
    ],
  },
  'scope-creep-cost': {
    state: ({ values }) => {
      const estimated = Math.max(1, toNumber(values, 'estimatedProjectHours'));
      const actual = toNumber(values, 'actualProjectHours') + toNumber(values, 'extraMeetings') + toNumber(values, 'extraRevisions') + toNumber(values, 'unpaidSupportTime') + toNumber(values, 'adminCommunicationTime');
      const overrun = Math.max(0, actual - estimated) / estimated;
      if (overrun > 0.45) return { state: 'not-ready', label: 'Broken scope', summary: 'The project should be repriced or restructured.' };
      if (overrun > 0.2) return { state: 'fragile', label: 'Creep damage', summary: 'Unpaid work significantly reduces profit.' };
      if (overrun > 0.05) return { state: 'tight', label: 'Watchlist', summary: 'Extra work is noticeable but manageable.' };
      return { state: 'stable', label: 'Controlled', summary: 'Extra work is minor and margin survives.' };
    },
    verdict:
      'Scope creep is not always caused by bad clients. Sometimes it comes from unclear deliverables, weak change-order language, over-helpfulness, or fear of making the client uncomfortable.',
    whatAdviceLeavesOut:
      'Most scope creep advice frames it as a client-boundary issue. The operational issue is that nobody counted the meetings, messages, revisions, and support that quietly changed the effective hourly rate.',
    sensitiveAssumptions: ['Estimated hours', 'Actual hours', 'Extra meetings', 'Revision hours', 'Target hourly rate'],
    commonTraps: ['Treating small asks as free because they are small.', 'Not counting meetings and messages.', 'Using project pricing without change-order language.'],
    betterNextMoves: {
      stable: 'Keep the scope language and revision count visible.',
      tight: 'Add a revision limit and change-order line before the next project.',
      fragile: 'Reprice the next project with a scope buffer and fewer included obligations.',
      'not-ready': 'Stop adding unpaid work. Rescope, reprice, or reset the project.',
      default: 'Convert unpaid work into a future scope buffer.',
    },
    scenarioPresets: [
      { label: 'Extra revision round', description: 'Small overrun from review loops.', values: { originalProjectPrice: 8000, estimatedProjectHours: 55, actualProjectHours: 60, extraRevisions: 8, desiredHourlyRate: 150 } },
      { label: 'Meeting-heavy client', description: 'Margin loss from coordination.', values: { originalProjectPrice: 9500, estimatedProjectHours: 60, actualProjectHours: 66, extraMeetings: 12, adminCommunicationTime: 8, desiredHourlyRate: 140 } },
      { label: 'Broken project scope', description: 'Overrun large enough to force repricing.', values: { originalProjectPrice: 12000, estimatedProjectHours: 70, actualProjectHours: 105, extraRevisions: 14, unpaidSupportTime: 10, desiredHourlyRate: 160 } },
    ],
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['What counts as out of scope?', 'How many revisions are included?', 'Are extra meetings billable?', 'What change-order language exists?', 'What is your effective hourly rate after support?'],
    methodologyMiniBlock:
      'This calculator compares estimated project hours with actual delivery, meeting, revision, support, and admin hours, then values the overrun at the target hourly rate.',
    situationLinks: [
      { label: 'Scope Creep Response Template', href: '/business/pricing/templates/scope-creep-response-template/', note: 'Use a practical response script.' },
      { label: 'Pricing Confidence Score', href: '/business/pricing-confidence-score-calculator/', note: 'See whether the new price is still strong.' },
      { label: 'Walk-Away Price', href: '/business/walk-away-price-calculator/', note: 'Find your future project floor.' },
    ],
    faqs: [
      { q: 'What counts as scope creep?', a: 'Extra deliverables, revisions, meetings, support, messages, urgency, or admin that were not included in the original price.' },
      { q: 'Should I charge for extra meetings?', a: 'If meetings are required to deliver the work and were not scoped, they should either be limited, swapped, or charged.' },
      { q: 'How do I stop scope creep politely?', a: 'Name the request, say it falls outside the priced scope, then offer a change price or a swap.' },
    ],
  },
  'walk-away-price': {
    state: ({ values }) => {
      const hours = toNumber(values, 'estimatedDeliveryHours') + toNumber(values, 'salesAdminHours') + toNumber(values, 'revisionBufferHours');
      const base = hours * toNumber(values, 'desiredEffectiveHourlyRate') + toNumber(values, 'directCosts') + toNumber(values, 'opportunityCost');
      const floor = base * (1 + toNumber(values, 'riskPremiumPct') / 100) / Math.max(0.1, 1 - toNumber(values, 'minimumMarginPct') / 100);
      const proposed = toNumber(values, 'clientProposedPrice');
      if (proposed >= floor) return { state: 'stable', label: 'Acceptable', summary: 'The price supports work and risk.' };
      if (proposed >= floor * 0.9) return { state: 'tight', label: 'Rescope', summary: 'The price could work if deliverables shrink.' };
      if (isChecked(values, 'strategicValue') && proposed >= floor * 0.75) return { state: 'fragile', label: 'Strategic only', summary: 'The price is low and needs a specific strategic reason.' };
      return { state: 'not-ready', label: 'Walk away', summary: 'The price does not support the work.' };
    },
    verdict:
      'A walk-away price is not arrogance. It protects against taking work that creates resentment, crowds out better opportunities, or trains the business to survive on bad deals.',
    whatAdviceLeavesOut:
      'Most negotiation advice focuses on confidence. The missing piece is the price floor: the number where the work stops making sense after time, risk, tax, opportunity cost, and margin.',
    sensitiveAssumptions: ['Delivery hours', 'Admin and sales hours', 'Revision buffer', 'Risk premium', 'Opportunity cost'],
    commonTraps: ['Accepting below floor without reducing scope.', 'Calling every low-price job strategic.', 'Forgetting opportunity cost when the calendar is limited.'],
    betterNextMoves: {
      stable: 'Accept only with scope and payment boundaries documented.',
      tight: 'Rescope the deliverables until the price supports the work.',
      fragile: 'Name the strategic reason and expiration before accepting below floor.',
      'not-ready': 'Decline or rebuild the offer around a much smaller scope.',
      default: 'Use the floor before negotiation starts.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['What work would this displace?', 'What scope can be removed?', 'Is the strategic reason specific?', 'What happens if revisions expand?', 'Would you take this price twice?'],
    methodologyMiniBlock:
      'This calculator values delivery, sales, admin, and revision time, adds direct cost and opportunity cost, then adjusts for risk, margin, and tax reserve.',
    situationLinks: [
      { label: 'Walk-Away Price Worksheet', href: '/business/pricing/templates/walk-away-price-worksheet/', note: 'Document the floor before negotiation.' },
      { label: 'Discount Damage', href: '/business/discount-damage-calculator/', note: 'Compare the discount alternative.' },
      { label: 'Pricing Model Comparison', href: '/business/pricing-model-comparison/', note: 'Change the structure instead of only changing price.' },
    ],
    faqs: [
      { q: 'What is a walk-away price?', a: 'It is the lowest price that still supports the work, risk, tax reserve, opportunity cost, and minimum margin.' },
      { q: 'Can I accept below my floor?', a: 'Only with a specific strategic reason, a smaller scope, and a clear reason not to repeat it.' },
      { q: 'How do I rescope instead of discounting?', a: 'Keep the price aligned with deliverables: remove support, reduce rounds, shorten timeline, or narrow outcomes.' },
    ],
  },
  'client-profitability': {
    state: ({ values }) => {
      const revenue = toNumber(values, 'clientRevenue');
      const hours = Math.max(1, toNumber(values, 'deliveryHours') + toNumber(values, 'supportHours') + toNumber(values, 'meetingHours') + toNumber(values, 'adminHours'));
      const cost = toNumber(values, 'contractorCost') + toNumber(values, 'softwareToolCost') + hours * toNumber(values, 'targetHourlyRate');
      const margin = revenue > 0 ? (revenue - cost) / revenue : 0;
      if (margin < 0) return { state: 'not-ready', label: 'Quietly costly', summary: 'The client takes more than they pay for.' };
      if (margin < 0.2) return { state: 'fragile', label: 'Low-margin', summary: 'The client may need price increase or scope change.' };
      if (margin < 0.35) return { state: 'tight', label: 'Good but heavy', summary: 'The client is profitable but requires attention.' };
      return { state: 'stable', label: 'Great client', summary: 'The client is profitable and operationally healthy.' };
    },
    verdict:
      'A client can be kind, recognizable, or good for the portfolio and still be bad for the business. Profitability is revenue minus attention, time, complexity, and delay.',
    whatAdviceLeavesOut:
      'Most client advice looks at revenue or relationship quality. Operators also need to count meetings, support, revisions, discounts, payment delay, and complexity.',
    sensitiveAssumptions: ['Client revenue', 'Delivery hours', 'Support and meeting hours', 'Contractor/tool cost', 'Payment delay'],
    commonTraps: ['Assuming the biggest client is the best client.', 'Ignoring support burden.', 'Keeping a low-margin retainer because it feels stable.'],
    betterNextMoves: {
      stable: 'Keep the client and protect the operating pattern.',
      tight: 'Set support boundaries before the client becomes heavy.',
      fragile: 'Raise price or reduce scope at renewal.',
      'not-ready': 'Plan a renegotiation or exit path before the client crowds out better work.',
      default: 'Rank clients by profit, not revenue alone.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['Which clients consume the most attention?', 'Does support have a boundary?', 'How late do they pay?', 'Is the client blocking better work?', 'Can the retainer be repriced or scoped tighter?'],
    methodologyMiniBlock:
      'This calculator subtracts hard cost, discount, payment-delay cost, target value of hours, and complexity pressure from client revenue.',
    situationLinks: [
      { label: 'Price Increase Planner', href: '/business/price-increase-planner/', note: 'Raise or segment low-margin clients.' },
      { label: 'Scope Creep Cost', href: '/business/scope-creep-cost-calculator/', note: 'If support and revisions are the leak.' },
      { label: 'Profit Calculator', href: '/business/profit-calculator/', note: 'See how client margin affects the whole business.' },
    ],
    faqs: [
      { q: 'How do I know if a client is profitable?', a: 'Subtract delivery time, meetings, support, admin, contractors, tools, discounts, and payment delay from client revenue.' },
      { q: 'Should I fire a low-margin client?', a: 'Not automatically. First try price increase, scope reduction, support boundaries, or a planned transition.' },
      { q: 'What if my biggest client is also hardest?', a: 'Model both concentration risk and profitability. Big revenue can still create fragile operations.' },
    ],
  },
  'pricing-model-comparison': {
    state: ({ values }) => {
      const uncertainty = toNumber(values, 'deliveryUncertainty');
      const scope = toNumber(values, 'scopeClarity');
      const repeatability = toNumber(values, 'repeatability');
      if (scope < 35 && uncertainty > 70) return { state: 'not-ready', label: 'Unclear work', summary: 'The work is too vague for a fixed model without discovery.' };
      if (uncertainty > 60 || toNumber(values, 'revisionRisk') > 60) return { state: 'fragile', label: 'Boundary risk', summary: 'The model needs stronger scope and change rules.' };
      if (repeatability > 70 || scope > 70) return { state: 'stable', label: 'Good fit', summary: 'The work has enough clarity to choose a model.' };
      return { state: 'tight', label: 'Hybrid likely', summary: 'Part of the work is clear and part still needs flexible pricing.' };
    },
    verdict:
      'Pricing model advice often treats hourly as beginner and value-based as advanced. Reality is messier. The model should match scope clarity, repeatability, risk, and client value.',
    whatAdviceLeavesOut:
      'Hourly can be smart when scope is uncertain. Project pricing can be dangerous when work is vague. Retainers can become unpaid availability if boundaries are weak.',
    sensitiveAssumptions: ['Scope clarity', 'Repeatability', 'Revision risk', 'Delivery uncertainty', 'Outcome value'],
    commonTraps: ['Using project pricing when scope is vague.', 'Selling a retainer as unlimited access.', 'Calling work value-based when the outcome value is not measurable.'],
    betterNextMoves: {
      stable: 'Build the proposal around the recommended model and its boundaries.',
      tight: 'Use a hybrid structure with discovery or variable support.',
      fragile: 'Define scope and revision rules before quoting fixed price.',
      'not-ready': 'Sell discovery or hourly exploration before packaging the work.',
      default: 'Choose the model that matches how the work behaves.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['Is the deliverable clear?', 'How repeatable is delivery?', 'What support is included?', 'Can outcome value be measured?', 'What work remains unknown?'],
    methodologyMiniBlock:
      'This tool scores hourly, project, retainer, subscription, value-based, and hybrid models against scope clarity, repeatability, urgency, outcome value, revision risk, uncertainty, support, and relationship length.',
    situationLinks: [
      { label: 'Minimum Viable Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/', note: 'Find the floor underneath any model.' },
      { label: 'Retainer Pricing Guide', href: '/business/pricing/guides/retainer-pricing-without-unlimited-access/', note: 'Avoid selling unlimited access.' },
      { label: 'Scope Creep Cost', href: '/business/scope-creep-cost-calculator/', note: 'Stress-test project pricing.' },
    ],
    faqs: [
      { q: 'Is hourly pricing bad?', a: 'No. Hourly can be the honest model when scope is exploratory or uncertain.' },
      { q: 'When is project pricing dangerous?', a: 'When deliverables, revision limits, support, or client decisions are unclear.' },
      { q: 'When does a retainer work?', a: 'When need is recurring, boundaries are explicit, and availability is not unlimited.' },
    ],
  },
  'price-increase-planner': {
    state: ({ values }) => {
      const increase = toNumber(values, 'currentPrice') > 0 ? (toNumber(values, 'proposedPrice') - toNumber(values, 'currentPrice')) / toNumber(values, 'currentPrice') : 0;
      const demand = toNumber(values, 'demandConfidence');
      const churn = toNumber(values, 'churnRiskPct');
      if (increase <= 0 || demand < 35) return { state: 'not-ready', label: 'Risky', summary: 'The increase may expose weak value, service, or demand.' };
      if (churn > 20 || demand < 55) return { state: 'fragile', label: 'Sensitive', summary: 'The increase may need segmentation or a phased rollout.' };
      if (demand < 75 || increase > 0.3) return { state: 'tight', label: 'Reasonable', summary: 'The increase can work with clear communication.' };
      return { state: 'stable', label: 'Strong case', summary: 'The increase is supported by costs, value, or demand.' };
    },
    verdict:
      'Price increases feel personal because the owner imagines the client reaction. But the business may already be paying the increase silently through lower margin, more work, higher costs, or resentment.',
    whatAdviceLeavesOut:
      'Most price-increase advice focuses on the email. The harder part is deciding who gets the increase, how much churn is tolerable, and whether the business has earned the new price with value or cost reality.',
    sensitiveAssumptions: ['Current price', 'Proposed price', 'Current margin', 'Churn risk', 'Demand confidence'],
    commonTraps: ['Overexplaining the increase.', 'Raising every client the same way.', 'Waiting until resentment forces a rushed message.'],
    betterNextMoves: {
      stable: 'Send a clear notice with scope and timing.',
      tight: 'Segment clients and give enough notice.',
      fragile: 'Phase the increase or start with low-margin clients.',
      'not-ready': 'Improve value proof, service, or demand before raising broadly.',
      default: 'Use margin pressure and churn break-even to plan the rollout.',
    },
    assumptionModes: pricingRiskModes,
    realityCheckQuestions: ['Which clients are low-margin?', 'What value changed since the old price?', 'How much churn can the increase survive?', 'Is renewal timing appropriate?', 'Should the increase be segmented?'],
    methodologyMiniBlock:
      'This calculator compares current and proposed price, margin pressure, cost increases, client count, churn risk, demand confidence, support burden, and renewal timing.',
    situationLinks: [
      { label: 'Price Increase Email Template', href: '/business/pricing/templates/price-increase-email-template/', note: 'Turn the math into a message.' },
      { label: 'Client Profitability', href: '/business/client-profitability-calculator/', note: 'Prioritize low-margin clients.' },
      { label: 'Discount Damage', href: '/business/discount-damage-calculator/', note: 'Compare discounts against price repair.' },
    ],
    faqs: [
      { q: 'How much should I raise my prices?', a: 'Start with margin pressure, cost increases, client profitability, demand confidence, and how much churn the increase can survive.' },
      { q: 'How do I tell clients?', a: 'Keep it simple: state the new price, effective date, scope, and transition period without overexplaining.' },
      { q: 'What if clients push back?', a: 'Offer scope reduction or phased timing before reversing the price increase.' },
    ],
  },
  'self-employment-tax': {
    state: ({ values }) => {
      const reserve = selfEmploymentReserve(values);
      if (reserve.netProfit <= 0 || reserve.reserve <= 0) return { state: 'not-ready', label: 'Guessing', summary: 'Inputs are too incomplete to trust the result.' };
      if (reserve.gap > reserve.reserve * 0.35) return { state: 'fragile', label: 'Under-reserved', summary: 'Current reserve may not cover the estimate.' };
      if (reserve.gap > reserve.reserve * 0.1 || isChecked(values, 'irregularIncome')) return { state: 'tight', label: 'Watchlist', summary: 'Reserve may work but depends on income and withholding assumptions.' };
      return { state: 'stable', label: 'Reserved', summary: 'Tax set-aside looks strong under current assumptions.' };
    },
    verdict:
      'Your business cash may look larger than it really is. This calculator separates estimated tax money from spendable money so you do not build pricing, payroll, or personal spending around cash that may already be committed.',
    whatAdviceLeavesOut:
      'Most self-employed tax advice explains the rate. That is useful, but the real problem is cash behavior. Tax money often sits in the same account as operating cash, client money, payroll money, and personal draw money.',
    sensitiveAssumptions: ['Net business profit', 'W-2 income or withholding', 'Federal income-tax reserve rate', 'State tax placeholder', 'Retirement, health insurance, and QBI assumptions'],
    commonTraps: ['Treating gross revenue like spendable money.', 'Saving tax cash in the same account as operating cash.', 'Assuming last quarter still fits after a large invoice.', 'Using a neat percentage without checking withholding.'],
    betterNextMoves: {
      stable: 'Keep tax cash separate and update the estimate after large income or deduction changes.',
      tight: 'Recheck after the next invoice, withholding change, or expense change.',
      fragile: 'Run the Tax Reserve Health Score and build a catch-up plan.',
      'not-ready': 'Enter year-to-date income, expenses, withholding, and reserve balance before acting.',
      default: 'Use this result to decide how much cash should stop looking spendable.',
    },
    scenarioPresets: [
      { label: 'New freelancer leaving W-2', description: 'Early income with withholding still in the picture.', values: { revenue: 70000, expenses: 12000, w2Wages: 45000, w2Withholding: 7000, currentTaxReserve: 9000, federalRate: 16, taxReservePct: 25 } },
      { label: 'Consultant with steady income', description: 'Higher profit and consistent reserve habit.', values: { revenue: 160000, expenses: 30000, currentTaxReserve: 28000, estimatedPayments: 12000, federalRate: 20, taxReservePct: 30 } },
      { label: 'Creator with uneven launch income', description: 'Large one-time income needs immediate reserve.', values: { revenue: 125000, expenses: 18000, currentTaxReserve: 12000, federalRate: 18, irregularIncome: true, oneTimeLargePayment: true } },
    ],
    assumptionModes: taxReserveModes,
    realityCheckQuestions: ['How much cash is in a separate tax account?', 'What changed since the last estimate?', 'Does W-2 withholding cover any of this?', 'What happens if a large invoice lands late?', 'Are you pricing with tax reserve included?'],
    methodologyMiniBlock:
      'This tool estimates net business profit, self-employment tax, income-tax reserve, state placeholder, payments already made, and cash still needing protection. It is built to expose reserve pressure, not file a return.',
    situationLinks: [
      { label: 'If the reserve gap felt high', href: '/business/tax-reserve-health-score/', note: 'Score whether tax cash is protected.' },
      { label: 'If payments are due soon', href: '/business/quarterly-tax-estimate-calculator/', note: 'Turn reserve into payment periods.' },
      { label: 'If deductions felt messy', href: '/business/dangerous-deduction-checker/', note: 'Review documentation before relying on expenses.' },
    ],
    faqs: [
      { q: 'How much should I set aside for taxes if I am self-employed?', a: 'Start with net profit, self-employment tax, income-tax reserve, withholding, state assumptions, and payments already made. A flat percentage is only a rough habit.' },
      { q: 'Why does self-employment tax feel high?', a: 'Self-employed people generally cover both Social Security and Medicare portions through self-employment tax, on top of income-tax planning.' },
      { q: 'Does W-2 withholding help cover 1099 income?', a: 'It can help the total tax picture, but the answer depends on household income, withholding timing, and total tax due.' },
      { q: 'Is gross revenue the same as taxable income?', a: 'No. Revenue is reduced by business expenses and other adjustments, but tax reserve still needs to be protected before cash feels available.' },
    ],
  },
  'quarterly-tax': {
    state: ({ values }) => {
      const annualTax = toNumber(values, 'annualTax');
      const paid = toNumber(values, 'withheld') + toNumber(values, 'q1Payment') + toNumber(values, 'q2Payment') + toNumber(values, 'q3Payment') + toNumber(values, 'q4Payment');
      const gap = Math.max(0, annualTax - paid);
      if (isChecked(values, 'annualizedIncomeMode') || isChecked(values, 'seasonalIncome')) return { state: 'fragile', label: 'Annualize/review', summary: 'Uneven income may need annualized-income treatment.' };
      if (gap > annualTax * 0.45) return { state: 'fragile', label: 'Catch-up needed', summary: 'Earlier payments may be too low.' };
      if (gap > annualTax * 0.2) return { state: 'tight', label: 'Needs adjustment', summary: 'Payment may need to increase or decrease based on updated income.' };
      return { state: 'stable', label: 'On track', summary: 'Payments and withholding appear aligned with assumptions.' };
    },
    verdict:
      'Quarterly taxes should be a rhythm, not a surprise. If income changed, update the estimate instead of carrying forward an old number.',
    whatAdviceLeavesOut:
      'Most quarterly tax advice makes it sound like the hard part is knowing the dates. The harder part is that self-employed income does not arrive evenly, and old estimates become stale fast.',
    sensitiveAssumptions: ['Current-year income', 'Expenses so far', 'Payments already made', 'W-2 withholding', 'Prior-year safe-harbor comparison'],
    commonTraps: ['Just dividing by four when income is uneven.', 'Forgetting W-2 withholding.', 'Ignoring a missed quarter until filing season.', 'Treating quarterly payments as optional admin.'],
    betterNextMoves: {
      stable: 'Calendar the next payment and repeat the review before the next deadline.',
      tight: 'Adjust the next payment and rerun after the next large invoice or expense change.',
      fragile: 'Use the catch-up calculator and consider annualized-income review if income was uneven.',
      'not-ready': 'Enter payment history and withholding before sending money.',
      default: 'Use the gap to decide whether the next payment needs a catch-up component.',
    },
    assumptionModes: taxReserveModes,
    realityCheckQuestions: ['Which quarter produced the income?', 'What payments have already cleared?', 'Does withholding cover part of the estimate?', 'Is income seasonal?', 'What deadline is next?'],
    methodologyMiniBlock:
      'This calculator compares expected annual tax against withholding and estimated payments, then shows the remaining payment rhythm, safe-harbor comparison, and uneven-income caution.',
    situationLinks: [
      { label: 'If you missed a quarter', href: '/business/quarterly-tax-catch-up-calculator/', note: 'Build a catch-up plan.' },
      { label: 'If income is uneven', href: '/business/irregular-income-tax-reserve-planner/', note: 'Plan reserve by income pattern.' },
      { label: 'If reserve cash is unclear', href: '/business/tax-reserve-health-score/', note: 'Check whether tax cash is protected.' },
    ],
    faqs: [
      { q: 'What happens if I miss a quarterly tax payment?', a: 'You may need a catch-up payment and may face penalty questions. The practical first step is estimating the shortfall and protecting future reserve.' },
      { q: 'Should I divide my tax estimate by four?', a: 'Only if income is even enough for that simplification. Uneven income may need annualized-income review.' },
      { q: 'Can W-2 withholding reduce quarterly payments?', a: 'Withholding can help cover the total tax picture, but the timing and amount need to be checked.' },
    ],
  },
  'tax-reserve-health': {
    state: ({ values }) => {
      const reserve = selfEmploymentReserve(values);
      const coverage = reserve.reserve > 0 ? reserve.protectedCash / reserve.reserve : 1;
      if (coverage < 0.5 || isChecked(values, 'reservesMixedWithOperatingCash')) return { state: 'not-ready', label: 'At risk', summary: 'Tax money is not clearly protected; a catch-up plan is needed.' };
      if (coverage < 0.7) return { state: 'fragile', label: 'Exposed', summary: 'Reserve may be too low if income continues or withholding is weak.' };
      if (coverage < 0.85 || isChecked(values, 'seasonalIncome')) return { state: 'tight', label: 'Watchlist', summary: 'Reserve may work, but assumptions need attention.' };
      return { state: 'stable', label: 'Protected', summary: 'Tax reserve appears strong based on entered assumptions.' };
    },
    verdict:
      'Tax reserve health is about behavior, not just tax math. Money that is mixed with operating cash can look available even when it is already spoken for.',
    whatAdviceLeavesOut:
      'Most tax calculators estimate the liability and stop. The operator problem is whether the cash is protected, separate, updated after income changes, and turned into a boring payment rhythm.',
    sensitiveAssumptions: ['Current reserve balance', 'Remaining income', 'W-2 withholding', 'Estimated payments made', 'Whether tax cash is separate'],
    commonTraps: ['Keeping tax cash in the operating account.', 'Saving based on gross deposits instead of net profit.', 'Ignoring state tax placeholders.', 'Letting a big month reset spending habits.'],
    betterNextMoves: {
      stable: 'Keep the reserve separate and revisit after large invoices.',
      tight: 'Increase weekly/monthly reserve or update withholding before the next deadline.',
      fragile: 'Run a quarterly catch-up estimate and separate the reserve from operating cash.',
      'not-ready': 'Stop treating reserve cash as available and build a catch-up plan.',
      default: 'Use the score to decide whether the tax account needs more cash or better separation.',
    },
    scenarioPresets: [
      { label: 'Protected consultant', description: 'Steady income, separate reserve, and payments made.', values: { incomeYtd: 80000, expectedRemainingIncome: 70000, expensesYtd: 18000, expectedRemainingExpenses: 16000, currentTaxReserve: 28000, federalEstimatedPaid: 9000, separateTaxAccount: true } },
      { label: 'Mixed operating cash', description: 'Reserve exists but sits in the same account.', values: { incomeYtd: 70000, expectedRemainingIncome: 50000, currentTaxReserve: 12000, reservesMixedWithOperatingCash: true, separateTaxAccount: false } },
      { label: 'Seasonal creator', description: 'High remaining income and uneven deposits.', values: { incomeYtd: 35000, expectedRemainingIncome: 90000, currentTaxReserve: 8000, seasonalIncome: true } },
    ],
    assumptionModes: taxReserveModes,
    realityCheckQuestions: ['Where is the tax reserve held?', 'What amount is already spoken for?', 'What payment is due next?', 'What happens after the next large invoice?', 'What state reserve assumption is missing?'],
    methodologyMiniBlock:
      'This score compares modeled tax reserve against protected cash, withholding, estimated payments, reserve habit, and whether money is mixed with operating cash.',
    situationLinks: [
      { label: 'If the gap is urgent', href: '/business/quarterly-tax-catch-up-calculator/', note: 'Build a catch-up plan.' },
      { label: 'If income is uneven', href: '/business/irregular-income-tax-reserve-planner/', note: 'Reserve from high months.' },
      { label: 'Weekly checklist', href: '/business/tax/templates/weekly-tax-reserve-checklist/', note: 'Turn reserve into a routine.' },
    ],
    faqs: [
      { q: 'Should tax money be in a separate account?', a: 'A separate account does not change tax law, but it makes tax cash less tempting to spend as operating money.' },
      { q: 'What if I am under-reserved?', a: 'Estimate the gap, protect future income immediately, and build a catch-up plan before filing season turns it into a larger shock.' },
      { q: 'Can I over-reserve?', a: 'Yes. Over-reserving may create cash pressure, so the goal is a realistic reserve with visible assumptions.' },
    ],
  },
  'quarterly-tax-catch-up': {
    state: ({ values }) => {
      const net = Math.max(0, toNumber(values, 'incomeDuringMissedPeriod') - toNumber(values, 'expensesDuringMissedPeriod'));
      const gap = Math.max(0, net * toNumber(values, 'taxReservePct') / 100 - toNumber(values, 'paymentMade'));
      if (isChecked(values, 'unevenIncome') && gap > toNumber(values, 'currentTaxReserve')) return { state: 'not-ready', label: 'Review needed', summary: 'Uneven income or a large gap needs closer review.' };
      if (gap > toNumber(values, 'currentTaxReserve') * 0.8) return { state: 'fragile', label: 'Underpayment risk', summary: 'Payments may be too low relative to income.' };
      if (gap > 2500) return { state: 'tight', label: 'Needs plan', summary: 'Catch-up is meaningful but workable.' };
      return { state: 'stable', label: 'Minor catch-up', summary: 'Gap appears manageable.' };
    },
    verdict:
      'Being behind is a problem, but guessing is worse. The next move is to quantify the missed-period gap, protect future income, and stop mixing tax cash into operating decisions.',
    whatAdviceLeavesOut:
      'The worst part of missing a quarterly payment is often the behavior that follows: ignoring the number, mixing tax money with operating cash, or waiting until filing season to discover the shortfall.',
    sensitiveAssumptions: ['Income during missed period', 'Expenses during missed period', 'Payment already made', 'Current tax reserve', 'Remaining income'],
    commonTraps: ['Ignoring the missed quarter.', 'Draining operating cash without a forward reserve plan.', 'Assuming penalties are the only issue.', 'Forgetting income timing.'],
    betterNextMoves: {
      stable: 'Make the catch-up payment if appropriate and calendar the next review.',
      tight: 'Break the gap into weekly catch-up amounts and protect future income immediately.',
      fragile: 'Run annualized-income or professional review before guessing at penalties.',
      'not-ready': 'Do not rely on this alone; gather records and review with a tax professional.',
      default: 'Use the catch-up amount to build the next payment rhythm.',
    },
    assumptionModes: taxReserveModes,
    realityCheckQuestions: ['Which period was underpaid?', 'Did income actually arrive in that period?', 'How much reserve is protected now?', 'What future income needs immediate reserve?', 'Is annualized-income review relevant?'],
    methodologyMiniBlock:
      'This calculator estimates the tax reserve associated with a missed or underpaid period, subtracts payments already made, and converts the gap into a forward catch-up rhythm.',
    situationLinks: [
      { label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/', note: 'Rebuild the remaining payment rhythm.' },
      { label: 'Tax Reserve Health Score', href: '/business/tax-reserve-health-score/', note: 'Check whether cash is protected.' },
      { label: 'Quarterly Tax Review Checklist', href: '/business/tax/templates/quarterly-tax-review-checklist/', note: 'Make the next quarter boring.' },
    ],
    faqs: [
      { q: 'Can I pay quarterly taxes late?', a: 'You can usually make a payment after a due date, but penalty treatment depends on the full facts. This tool only estimates the catch-up cash.' },
      { q: 'How do I catch up on estimated taxes?', a: 'Estimate the missed-period shortfall, make an informed payment, and increase future reserves so the same gap does not repeat.' },
      { q: 'What if income was uneven?', a: 'Uneven income may call for annualized-income review rather than equal quarterly assumptions.' },
    ],
  },
  'mixed-w2-1099-tax': {
    state: ({ values }) => {
      const reserve = selfEmploymentReserve(values);
      const coverage = reserve.reserve > 0 ? reserve.protectedCash / reserve.reserve : 1;
      if (coverage >= 1) return { state: 'stable', label: 'Covered by withholding', summary: 'W-2 withholding may cover much of the estimate.' };
      if (coverage >= 0.7) return { state: 'tight', label: 'Partial reserve needed', summary: '1099 income needs additional reserve.' };
      if (coverage >= 0.4) return { state: 'fragile', label: 'Quarterly payments likely', summary: 'Withholding may not be enough.' };
      return { state: 'not-ready', label: 'Review needed', summary: 'Inputs are too complex or under-covered to trust casually.' };
    },
    verdict:
      'Two income streams need one tax plan. The question is not which income is taxed; it is whether withholding plus estimated payments covers the whole household tax picture.',
    whatAdviceLeavesOut:
      'People with W-2 and 1099 income often overcomplicate the wrong part. The practical issue is whether withholding timing, self-employment tax, and quarterly payments are working together.',
    sensitiveAssumptions: ['W-2 withholding', '1099 net profit', 'Filing status', 'Extra withholding option', 'Quarterly payments made'],
    commonTraps: ['Assuming W-2 withholding only covers W-2 wages.', 'Forgetting self-employment tax on 1099 profit.', 'Overpaying out of fear without checking the total picture.', 'Ignoring spouse withholding.'],
    betterNextMoves: {
      stable: 'Confirm withholding timing and rerun after income changes.',
      tight: 'Choose between extra withholding and quarterly payments.',
      fragile: 'Build a quarterly payment target or adjust W-2 withholding.',
      'not-ready': 'Use tax software or a professional review before relying on a simple estimate.',
      default: 'Use the result to decide whether withholding or quarterly payments should carry the gap.',
    },
    assumptionModes: taxReserveModes,
    realityCheckQuestions: ['How much withholding has actually happened?', 'How much 1099 profit remains after expenses?', 'Could extra withholding solve the gap?', 'Will spouse income change the picture?', 'Is the side income seasonal?'],
    methodologyMiniBlock:
      'This planner combines W-2 withholding with self-employment profit, self-employment tax, income-tax reserve, existing payments, and extra withholding alternatives.',
    situationLinks: [
      { label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/', note: 'Model the 1099 side directly.' },
      { label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/', note: 'Turn the gap into payments.' },
      { label: 'W-2 and 1099 Guide', href: '/business/tax/guides/w2-and-1099-tax-planning/', note: 'Understand the mixed-income workflow.' },
    ],
    faqs: [
      { q: 'Does W-2 withholding help cover 1099 income?', a: 'It can, because the return is usually settled as one tax picture. The amount and timing still need to be checked.' },
      { q: 'Should I use extra withholding or quarterly payments?', a: 'Either can be part of a plan. The better choice depends on cash flow, timing, and how predictable the 1099 income is.' },
      { q: 'Why does my side income create tax even if I have a job?', a: 'Net self-employment income can create self-employment tax plus income-tax reserve needs.' },
    ],
  },
  'irregular-income-tax-reserve': {
    state: ({ values }) => {
      const highReserve = Math.max(0, toNumber(values, 'incomeHighMonth') - toNumber(values, 'monthlyExpensesNormal')) * toNumber(values, 'taxReservePct') / 100;
      const slowCash = toNumber(values, 'incomeSlowMonth') - toNumber(values, 'monthlyExpensesNormal');
      if (slowCash < 0 && highReserve > toNumber(values, 'minimumOperatingCash') * 0.25) return { state: 'not-ready', label: 'Annualize/review', summary: 'Uneven income may require deeper review.' };
      if (slowCash < 0) return { state: 'fragile', label: 'Slow-month strain', summary: 'Tax reserve may collide with operating cash.' };
      if (highReserve > toNumber(values, 'incomeNormalMonth') * 0.5) return { state: 'tight', label: 'High-month risk', summary: 'Big months need immediate reserve discipline.' };
      return { state: 'stable', label: 'Smooth reserve', summary: 'Reserves match uneven income reasonably well.' };
    },
    verdict:
      'Irregular income makes tax emotional because the business swings between abundance and scarcity. A large invoice can make the owner feel safe right before taxes claim a large part of it.',
    whatAdviceLeavesOut:
      'Most tax reserve advice assumes income arrives smoothly. Seasonal operators need reserve rules for the month cash arrives, not an average that looks tidy at year-end.',
    sensitiveAssumptions: ['High-income months', 'Slow months', 'Monthly expenses', 'Reserve percentage', 'Minimum operating cash'],
    commonTraps: ['Averaging income blindly.', 'Spending from a large invoice before reserving tax cash.', 'Letting slow months consume tax reserve.', 'Ignoring annualized-income questions.'],
    betterNextMoves: {
      stable: 'Use the schedule as a monthly reserve routine.',
      tight: 'Reserve immediately during high-income months and avoid averaging cash too casually.',
      fragile: 'Protect reserves before slow months and review operating cash floor.',
      'not-ready': 'Use professional review if uneven income may affect estimated-tax method.',
      default: 'Use the schedule to decide what cash is protected before it feels spendable.',
    },
    assumptionModes: taxReserveModes,
    realityCheckQuestions: ['Which months produce most income?', 'Which months are cash-negative?', 'When do quarterly deadlines land?', 'What reserve is untouchable?', 'Can operating cash survive slow months?'],
    methodologyMiniBlock:
      'This planner converts high, normal, and slow income months into annual reserve targets, high-month reserve actions, and slow-month cash warnings.',
    situationLinks: [
      { label: 'Tax Reserve Health Score', href: '/business/tax-reserve-health-score/', note: 'Check reserve protection.' },
      { label: 'Quarterly Tax Catch-Up', href: '/business/quarterly-tax-catch-up-calculator/', note: 'Recover from a missed payment.' },
      { label: 'Weekly Tax Reserve Checklist', href: '/business/tax/templates/weekly-tax-reserve-checklist/', note: 'Make reserve behavior routine.' },
    ],
    faqs: [
      { q: 'Should I save the same amount every month?', a: 'Not if income is highly uneven. High-income months may need larger immediate reserve transfers.' },
      { q: 'What is the annualized income method?', a: 'It is a way to account for uneven income timing on estimated-tax forms. This planner flags when review may be relevant; it does not complete the form.' },
      { q: 'What if slow months eat my tax reserve?', a: 'That is a cash-control warning. Reserve should be protected earlier, or operating costs need a separate runway plan.' },
    ],
  },
  'deduction-planner': {
    state: ({ values }) => {
      const score = documentationScore(values);
      if (toNumber(values, 'expenseAmount') > 0 && (score < 50 || isChecked(values, 'capitalizationQuestion'))) return { state: 'not-ready', label: 'Needs review', summary: 'Amount, category, or use pattern may need professional review.' };
      if (score < 60 || isChecked(values, 'luxuryPersonalOverlap')) return { state: 'fragile', label: 'Needs documentation', summary: 'Missing records make the expense harder to support.' };
      if (isChecked(values, 'mixedUseFlag') || toNumber(values, 'businessUsePct') < 90) return { state: 'tight', label: 'Needs allocation', summary: 'Business/personal use may need splitting.' };
      return { state: 'stable', label: 'Clean review', summary: 'Expense category appears straightforward if documented.' };
    },
    verdict:
      'A deduction is only useful if you can explain it. The goal is not to collect every possible expense. The goal is to build records that make the business story clear.',
    whatAdviceLeavesOut:
      'Most deduction lists make people feel like they are leaving money on the table. That can push people into overclaiming, guessing business use, or treating personal expenses like business expenses.',
    sensitiveAssumptions: ['Business purpose', 'Receipt or invoice', 'Business-use percentage', 'Mixed-use allocation', 'Capitalization or asset treatment'],
    commonTraps: ['Treating every business purchase like a clean write-off.', 'Forgetting business-purpose notes.', 'Claiming 100% business use without support.', 'Ignoring asset or improvement questions.'],
    betterNextMoves: {
      stable: 'Keep the records and connect the expense to the business purpose.',
      tight: 'Document allocation method before filing.',
      fragile: 'Improve receipts, business-purpose notes, and project ties before relying on the expense.',
      'not-ready': 'Bring the records to a professional before relying on the deduction.',
      default: 'Use the flags to improve documentation before tax season.',
    },
    scenarioPresets: [
      { label: 'Mixed phone and internet', description: 'Useful but needs allocation.', values: { expenseCategory: 'mixed-use', expenseAmount: 1800, businessUsePct: 70, mixedUseFlag: true, hasReceipt: true } },
      { label: 'Home office', description: 'Documentation and measurement matter.', values: { expenseCategory: 'home-office', expenseAmount: 1500, businessUsePct: 100, homeOfficeMeasurement: true, hasBusinessPurpose: true } },
      { label: 'Equipment purchase', description: 'Asset records and placed-in-service notes help.', values: { expenseCategory: 'equipment', expenseAmount: 6500, capitalizationQuestion: true, assetRecord: false } },
    ],
    assumptionModes: deductionCautionModes,
    realityCheckQuestions: ['Can you explain the business purpose calmly?', 'Is any personal use mixed in?', 'Do records show date, vendor, amount, and category?', 'Is this a long-term asset or improvement?', 'Would the expense make sense for this business?'],
    methodologyMiniBlock:
      'This tool reviews documentation, business-use allocation, ordinary/necessary framing, and caution signals. It flags records to strengthen; it does not approve deductions.',
    situationLinks: [
      { label: 'If the expense feels risky', href: '/business/dangerous-deduction-checker/', note: 'Review caution signals.' },
      { label: 'If records are weak', href: '/business/deduction-documentation-scorecard/', note: 'Score support before filing.' },
      { label: 'Documentation note template', href: '/business/tax/templates/business-expense-documentation-note-template/', note: 'Capture purpose while fresh.' },
    ],
    faqs: [
      { q: 'Can I deduct an expense that is partly personal?', a: 'Mixed-use expenses often require allocation and records. This tool flags that need; it does not determine deductibility.' },
      { q: 'What records should I keep?', a: 'Keep receipt or invoice, bank/card proof, date, vendor, amount, category, business purpose, and allocation method when needed.' },
      { q: 'What if I lost the receipt?', a: 'A missing receipt weakens support. Other records may help, but you should improve the documentation before relying on the expense.' },
    ],
  },
  'deduction-documentation': {
    state: ({ values }) => {
      const score = documentationScore(values);
      if (score >= 85) return { state: 'stable', label: 'Strong records', summary: 'Expense support looks strong from the entered records.' };
      if (score >= 70) return { state: 'tight', label: 'Mostly documented', summary: 'Records are mostly documented with a few cleanup items.' };
      if (score >= 50) return { state: 'fragile', label: 'Needs cleanup', summary: 'Documentation needs cleanup before relying on the category.' };
      return { state: 'not-ready', label: 'Weak support', summary: 'Record support is too weak to trust casually.' };
    },
    verdict:
      'A deduction does not become easier because you remember why it mattered. It becomes easier because the record explains the business purpose without reconstructing the year from scratch.',
    whatAdviceLeavesOut:
      'Most deduction advice focuses on categories. The record is what turns a category into a calmer filing conversation.',
    sensitiveAssumptions: ['Receipt/invoice', 'Business-purpose note', 'Project or workflow tie', 'Business-use percentage', 'Asset/mileage/home-office records'],
    commonTraps: ['Relying on memory.', 'Keeping receipts without business-purpose notes.', 'Skipping allocation on mixed-use expenses.', 'Waiting until filing season to reconstruct records.'],
    betterNextMoves: {
      stable: 'Keep the record attached to the transaction and repeat the process.',
      tight: 'Fill the missing notes before year-end.',
      fragile: 'Clean up business purpose, allocation, and category support.',
      'not-ready': 'Do not rely on memory; rebuild records before filing.',
      default: 'Use the missing-record list as the next cleanup checklist.',
    },
    assumptionModes: deductionCautionModes,
    realityCheckQuestions: ['Can the record stand without your memory?', 'Is business purpose written down?', 'Is mixed use allocated?', 'Is mileage or home office measured?', 'Is an asset record needed?'],
    methodologyMiniBlock:
      'This score checks the record layer: receipt, bank proof, business purpose, project tie, date/vendor/category, allocation, and special records for mileage, home office, or equipment.',
    situationLinks: [
      { label: 'Dangerous Deduction Checker', href: '/business/dangerous-deduction-checker/', note: 'Review caution signals.' },
      { label: 'Deduction Finder', href: '/business/self-employed-deduction-finder/', note: 'Find categories worth reviewing.' },
      { label: 'Documentation note', href: '/business/tax/templates/business-expense-documentation-note-template/', note: 'Write the business reason now.' },
    ],
    faqs: [
      { q: 'What makes deduction records strong?', a: 'Strong records connect the expense amount, date, vendor, category, payment proof, business purpose, and allocation when personal use exists.' },
      { q: 'Do I need a business-purpose note?', a: 'It is often the difference between a receipt pile and a record that explains the expense clearly.' },
      { q: 'How do I document business-use percentage?', a: 'Use a reasonable allocation method and keep the evidence that supports it, such as logs, measurements, or usage records.' },
    ],
  },
  's-corp': {
    state: ({ values }) => {
      const spread = sCorpSpread(values);
      if (spread.netSavings <= 0 || spread.admin >= spread.grossSavings * 0.9) {
        return { state: 'not-ready', summary: 'Admin, payroll, filing, or state costs are close to or greater than the modeled savings.' };
      }
      if (spread.salary < spread.profit * 0.45 || spread.netSavings < spread.admin * 1.25) {
        return { state: 'fragile', summary: 'Savings can disappear if reasonable salary, admin cost, or profit moves against the model.' };
      }
      if (spread.netSavings < 6000) {
        return { state: 'tight', summary: 'Savings exist, but they are modest enough to require careful admin and salary assumptions.' };
      }
      return { state: 'stable', summary: 'The modeled savings remain meaningful after admin and salary assumptions, but still need professional review.' };
    },
    verdict:
      'The S-corp may be worth modeling, but the savings are not clean enough to treat as automatic. The result depends heavily on reasonable salary, payroll cost, filing cost, state fees, admin time, and whether profit stays consistent.',
    whatAdviceLeavesOut:
      'Most S-corp content talks about savings. Less of it talks about payroll, bookkeeping, separate tax filing, reasonable salary documentation, state costs, late filings, and profit instability.',
    sensitiveAssumptions: ['Reasonable salary', 'Net profit', 'State/entity costs', 'Payroll and bookkeeping cost', 'Admin time'],
    commonTraps: [
      'Counting tax savings before payroll and filing costs.',
      'Using a salary assumption that is too low.',
      'Ignoring state fees and admin time.',
      'Assuming profit will stay stable every year.',
    ],
    betterNextMoves: {
      stable: 'Run the same model with a higher salary and higher admin cost, then review it with a CPA.',
      tight: 'Model whether the savings still matter after extra bookkeeping, payroll, and state costs.',
      fragile: 'Stress-test a profit drop and a salary increase before treating the election as worth it.',
      'not-ready': 'Do not treat the election as worth it yet. Improve profit stability or reduce admin drag first.',
      default: 'Use the spread to decide whether an S-corp discussion is worth professional review.',
    },
    scenarioPresets: [
      { label: 'Solo consultant at $80k profit', description: 'Often too early once admin drag is included.', values: { profit: 80000, salary: 60000, payrollAdmin: 3200, stateCorpCost: 800 } },
      { label: 'Consultant at $150k profit', description: 'Common review point with meaningful spread risk.', values: { profit: 150000, salary: 85000, payrollAdmin: 3600, stateCorpCost: 800 } },
      { label: 'Creator with uneven income', description: 'Profit is real but volatile.', values: { profit: 120000, salary: 70000, payrollAdmin: 4200, stateCorpCost: 1200 } },
      { label: 'Agency owner with contractors', description: 'Higher profit and more admin complexity.', values: { profit: 240000, salary: 120000, payrollAdmin: 5600, stateCorpCost: 1500 } },
      { label: 'Owner with W-2 spouse income', description: 'Focuses on entity spread, not household benefits.', values: { profit: 180000, salary: 100000, payrollAdmin: 3800, stateCorpCost: 800 } },
      { label: 'Technical founder reinvesting profit', description: 'Lower owner salary assumptions need extra scrutiny.', values: { profit: 140000, salary: 65000, payrollAdmin: 5000, stateCorpCost: 1200 } },
    ],
    assumptionModes: sCorpModes,
    realityCheckQuestions: [
      'Is profit stable enough to justify added admin?',
      'What salary assumption are you using, and why?',
      'What will payroll, bookkeeping, and tax prep cost?',
      'What state costs apply?',
      'Would the savings still matter if profit drops?',
    ],
    methodologyMiniBlock:
      'This calculator compares a sole-proprietor self-employment tax frame with an S-corp salary and distribution frame, then subtracts payroll, bookkeeping, filing, and state/entity costs. It is a screening model, not an election recommendation.',
    situationLinks: [
      { label: 'If salary felt uncertain', href: '/business/reasonable-salary-planner/', note: 'Stress the owner-pay assumption.' },
      { label: 'If savings looked small', href: '/business/self-employed-tax-calculator/', note: 'Compare against the basic self-employed reserve.' },
      { label: 'If entity choice is the question', href: '/business/llc-vs-s-corp-calculator/', note: 'Use the break-even version.' },
    ],
    faqs: [
      { q: 'Is an S-corp worth it at $80,000 income?', a: 'Often not automatically. At lower profit levels, payroll, tax prep, bookkeeping, state fees, and admin time can erase much of the spread.' },
      { q: 'What costs reduce S-corp savings?', a: 'Payroll service, bookkeeping, separate business return prep, state/franchise fees, registered agent or compliance costs, and the owner time needed to maintain the structure.' },
      { q: 'What happens if reasonable salary is higher?', a: 'A higher salary reduces the distribution amount and can shrink or erase the payroll-tax spread.' },
      { q: 'Can S-corp savings disappear?', a: 'Yes. Lower profit, higher salary, higher admin cost, or state costs can turn a good-looking estimate into a weak decision.' },
      { q: 'Is an S-corp worth it if income is irregular?', a: 'Irregular income makes the decision harder because fixed admin costs remain even when profit drops.' },
    ],
    operatorExamples: [
      {
        title: 'Consultant at $150k profit',
        body: 'A consultant models $150,000 of profit, $85,000 of salary, and $4,400 of payroll, filing, and state costs. The spread may be worth a CPA discussion, but it is not automatic.',
        takeaway: 'The decision is strongest when savings survive higher salary, higher admin cost, and a weaker profit year.',
      },
    ],
  },
  's-corp-break-even': {
    state: ({ values }) => {
      const spread = sCorpSpread(values);
      const lowProfit = toNumber(values, 'profitLow') || toNumber(values, 'profit') * 0.75;
      const highSalary = toNumber(values, 'salaryHigh') || toNumber(values, 'salary') * 1.2;
      const stressValues = { ...values, profit: lowProfit, salary: highSalary };
      const stress = sCorpSpread(stressValues);
      if (spread.netSavings <= 0) return { state: 'not-ready', label: 'Too early', summary: 'Savings do not clearly beat complexity.' };
      if (stress.netSavings <= 0) return { state: 'fragile', label: 'Watchlist', summary: 'Could be worth revisiting as profit stabilizes.' };
      if (spread.netSavings < 6000) return { state: 'tight', label: 'Review candidate', summary: 'Numbers may justify professional review but are not clearly strong.' };
      return { state: 'stable', label: 'Strong candidate', summary: 'Savings remain after conservative stress tests.' };
    },
    verdict:
      'The break-even point is not just a tax number. It is an administrative threshold. If the owner hates payroll, bookkeeping, compliance dates, or formal records, the savings need to be large enough to compensate for that reality.',
    whatAdviceLeavesOut:
      'Most S-corp break-even advice treats complexity like a small fixed fee. The owner still has to run payroll, keep books clean, file separately, meet state requirements, and support salary assumptions.',
    sensitiveAssumptions: ['Profit range', 'Salary range', 'Payroll and filing cost', 'State/entity fees', 'Admin time value'],
    commonTraps: ['Using expected profit only.', 'Ignoring setup cost.', 'Treating admin time as free.', 'Failing to test a higher salary.'],
    betterNextMoves: {
      stable: 'Take the stress-tested assumptions to a CPA for entity-specific review.',
      tight: 'Revisit when profit is more stable or admin costs are clearer.',
      fragile: 'Do not treat expected-case savings as enough; model lower profit and higher salary again.',
      'not-ready': 'Wait until savings clearly beat complexity and profit is stable enough.',
      default: 'Use the stress result to decide whether S-corp review is worth scheduling.',
    },
    assumptionModes: sCorpModes,
    realityCheckQuestions: ['What profit level makes the admin worth it?', 'Does the spread survive higher salary?', 'What state/entity costs apply?', 'How much admin time is realistic?', 'Would you still want the structure in a weak year?'],
    methodologyMiniBlock:
      'This stress test compares expected S-corp savings with lower-profit, higher-salary, higher-admin cases and shows whether the savings still justify complexity.',
    situationLinks: [
      { label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/', note: 'Model the expected spread.' },
      { label: 'Reasonable Salary Planner', href: '/business/reasonable-salary-planner/', note: 'Stress the salary assumption.' },
      { label: 'CPA question list', href: '/business/tax/templates/questions-to-ask-cpa-after-s-corp-calculator/', note: 'Turn the result into better questions.' },
    ],
    faqs: [
      { q: 'When is an S-corp not worth it yet?', a: 'When savings are small, profit is unstable, salary assumptions are weak, or payroll, filing, state, and admin costs consume the spread.' },
      { q: 'What profit threshold should I use?', a: 'Use a range, not one threshold. The better test is whether savings survive lower profit and higher salary assumptions.' },
      { q: 'Should setup cost count?', a: 'Yes. Setup and transition costs matter because they can delay or reduce the first-year benefit.' },
    ],
  },
  'reasonable-salary': {
    state: ({ values }) => {
      const salary = toNumber(values, 'salary');
      const low = toNumber(values, 'comparableSalaryLow');
      const mid = toNumber(values, 'comparableSalaryMidpoint');
      const high = toNumber(values, 'comparableSalaryHigh');
      if (salary < low * 0.85) return { state: 'not-ready', label: 'Weak assumption', summary: 'Salary appears chosen to maximize savings, not reflect work.' };
      if (salary < low || salary > high * 1.1) return { state: 'fragile', label: 'Savings-sensitive', summary: 'Salary changes materially affect S-corp savings.' };
      if (salary < mid * 0.9 || salary > mid * 1.1) return { state: 'tight', label: 'Needs support', summary: 'Salary assumption needs stronger comparable support.' };
      return { state: 'stable', label: 'Well-modeled', summary: 'Salary range is documented and sensitivity-tested.' };
    },
    verdict:
      'The salary assumption should explain the work you actually do, not just make the savings number look good. If a reasonable salary consumes most of the S-corp savings, the structure may not be worth the admin yet.',
    whatAdviceLeavesOut:
      'Reasonable salary is not just a tax technicality. It is a reality check on how much of the business depends on the owner services, skill, management, sales, and responsibility.',
    sensitiveAssumptions: ['Comparable pay', 'Owner hours', 'Revenue-producing time', 'Skill and responsibility', 'Replacement cost'],
    commonTraps: ['Choosing salary backward from the desired savings.', 'Ignoring sales and management work.', 'Using one comparable instead of a range.', 'Forgetting that low salary can make the model fragile.'],
    betterNextMoves: {
      stable: 'Save the comparable range and test S-corp savings at the expected salary.',
      tight: 'Gather stronger comparable support before relying on the spread.',
      fragile: 'Run S-corp savings with a higher salary before treating the result as meaningful.',
      'not-ready': 'Rebuild the salary assumption around role, hours, and comparables.',
      default: 'Use the salary range to ask better CPA questions.',
    },
    assumptionModes: sCorpModes,
    realityCheckQuestions: ['What would it cost to replace your role?', 'How much revenue depends on your services?', 'What comparable salary range supports the model?', 'How many hours do you work?', 'What happens if salary rises?'],
    methodologyMiniBlock:
      'This planner builds a salary planning range from comparable pay, replacement cost, owner hours, skill, responsibility, and business economics. It does not determine reasonable compensation.',
    situationLinks: [
      { label: 'S-Corp Savings', href: '/business/s-corp-tax-savings-calculator/', note: 'Use the range in the savings model.' },
      { label: 'S-Corp Break-Even', href: '/business/s-corp-break-even-stress-test/', note: 'See when complexity pays.' },
      { label: 'CPA question list', href: '/business/tax/templates/questions-to-ask-cpa-after-s-corp-calculator/', note: 'Ask better questions.' },
    ],
    faqs: [
      { q: 'What is reasonable salary?', a: 'It is a facts-and-circumstances compensation question. This planner creates a range and documentation prompts; it does not determine the salary.' },
      { q: 'Can S-corp salary be too low?', a: 'Yes. If salary does not reflect the owner work, the savings model can be fragile or misleading.' },
      { q: 'What should I ask a CPA?', a: 'Ask what comparable pay, role facts, state costs, payroll setup, and documentation would change the salary assumption.' },
    ],
  },
  'payroll-burden': {
    state: ({ values }) => {
      const salary = toNumber(values, 'hourlyWage') > 0 ? toNumber(values, 'hourlyWage') * toNumber(values, 'expectedHours') : toNumber(values, 'salary');
      const loaded = salary + salary * 0.25 + toNumber(values, 'healthInsurance') + toNumber(values, 'retirementMatch') + toNumber(values, 'equipment') + toNumber(values, 'softwareSeats') + toNumber(values, 'recruiting');
      const monthlyImpact = loaded / 12;
      const monthlyRevenue = Math.max(1, toNumber(values, 'monthlyRevenue'));
      const reserve = toNumber(values, 'payrollReserve');
      if (monthlyImpact > monthlyRevenue * 0.35 || reserve < monthlyImpact * 2) {
        return { state: 'not-ready', label: 'Not ready', summary: 'Payroll cost is too high relative to revenue, margin, or reserve.' };
      }
      if (monthlyImpact > monthlyRevenue * 0.25 || reserve < monthlyImpact * 3) {
        return { state: 'fragile', summary: 'A revenue dip or slow ramp could create payroll pressure quickly.' };
      }
      if (monthlyImpact > monthlyRevenue * 0.18 || toNumber(values, 'month3ProductivityPct') < 75) {
        return { state: 'tight', summary: 'The hire works only if revenue stays stable and ramp is short.' };
      }
      return { state: 'stable', label: 'Affordable', summary: 'Fully loaded cost appears supported by current revenue and reserve assumptions.' };
    },
    verdict:
      'This hire is not only a salary decision. The business also has to carry employer taxes, benefits, equipment, software, recruiting, training, management time, and the ramp period before full productivity.',
    whatAdviceLeavesOut:
      'Most employee-cost calculators add payroll taxes and stop. For small businesses, the early cost also includes recruiting, onboarding, equipment, software access, management time, mistakes, and the pressure of making payroll.',
    sensitiveAssumptions: ['Salary or hourly wage', 'Benefits and payroll taxes', 'Setup cost', 'Ramp-time productivity', 'Payroll reserve'],
    commonTraps: [
      'Treating salary as the full employee cost.',
      'Ignoring the first 90 days before full productivity.',
      'Forgetting manager time and rework.',
      'Assuming state payroll and workers comp are covered by a federal estimate.',
    ],
    betterNextMoves: {
      stable: 'Build a 90-day hiring budget and define the first outcomes.',
      tight: 'Try part-time, contractor, or phased start before committing fully.',
      fragile: 'Build payroll reserve and stress-test slower ramp before hiring.',
      'not-ready': 'Delay, contract, automate, or simplify the work before adding payroll.',
      default: 'Use the result to find whether salary, benefits, setup, or ramp creates the pressure.',
    },
    scenarioPresets: [
      { label: 'First admin hire', description: 'Moderate salary with heavy onboarding.', values: { salary: 58000, healthInsurance: 6800, equipment: 1800, recruiting: 2200, monthlyRevenue: 52000, payrollReserve: 22000 } },
      { label: 'First sales hire', description: 'Higher ramp and revenue uncertainty.', values: { salary: 72000, bonusCommission: 12000, recruiting: 6500, month1ProductivityPct: 25, month2ProductivityPct: 45, month3ProductivityPct: 65, monthlyRevenue: 70000 } },
      { label: 'First operations person', description: 'Management-heavy role with software access.', values: { salary: 68000, softwareSeats: 3000, managerOnboardingHours: 55, trainingHours: 60, monthlyRevenue: 62000 } },
    ],
    assumptionModes: hiringRiskModes,
    realityCheckQuestions: [
      'Can the business carry this person before they are fully productive?',
      'What happens if revenue drops after the offer is accepted?',
      'Who will train, review, and manage the person?',
      'Which costs are one-time setup and which become permanent overhead?',
      'How much payroll reserve is available before the first paycheck?',
    ],
    methodologyMiniBlock:
      'This calculator starts with pay, adds employer payroll taxes, benefits, setup costs, software, equipment, manager time, and ramp-time drag, then compares the result against revenue and payroll reserve.',
    doesNotDo: [
      'It does not run payroll or calculate every state/local requirement.',
      'It does not determine exempt status, wage compliance, benefits eligibility, or workers comp rates.',
      'It does not replace payroll, HR, legal, or accounting review.',
      'It does help expose the cost beyond salary before hiring.',
    ],
    situationLinks: [
      { label: 'First 90-Day Hire Cost', href: '/business/first-90-day-hire-cost-calculator/', note: 'Zoom in on ramp and onboarding cost.' },
      { label: 'Hiring Stress Test', href: '/business/hiring-stress-test/', note: 'See what happens if revenue drops after payroll starts.' },
      { label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/', note: 'Compare permanent payroll against flexible help.' },
    ],
    faqs: [
      { q: 'How much does an employee really cost beyond salary?', a: 'Include employer payroll taxes, benefits, PTO, equipment, software, recruiting, onboarding, training, manager time, insurance, and role-specific overhead.' },
      { q: 'What is payroll burden?', a: 'Payroll burden is the cost above base wage or salary that the employer carries, including payroll taxes, benefits, insurance, and employment overhead.' },
      { q: 'How much cash reserve should I have before hiring?', a: 'A common planning frame is at least several months of loaded payroll and ramp costs, but the right reserve depends on revenue stability, margin, and role criticality.' },
      { q: 'Why does the first employee feel so expensive?', a: 'The first employee adds payroll responsibility, management time, onboarding, systems, and emotional pressure in addition to the wage.' },
    ],
  },
  'contractor-employee': {
    state: ({ values }) => {
      const contractorCost = toNumber(values, 'contractorRate') * toNumber(values, 'hours');
      const wageCost = toNumber(values, 'employeeRate') * toNumber(values, 'hours');
      const employeeTotal = wageCost + wageCost * toNumber(values, 'burdenPct') / 100 + toNumber(values, 'employeeOverhead');
      if (toNumber(values, 'hours') < 500) {
        return { state: 'tight', label: 'Contract first', summary: 'The need is probably too variable or small to justify permanent overhead on cost alone.' };
      }
      if (employeeTotal > contractorCost * 1.5) {
        return { state: 'fragile', summary: 'The employee path adds enough cost that role clarity and revenue support need another pass.' };
      }
      if (toNumber(values, 'burdenPct') >= 40 || toNumber(values, 'employeeOverhead') > wageCost * 0.25) {
        return { state: 'tight', summary: 'The role can work, but burden, tools, and overhead are carrying real cost.' };
      }
      return { state: 'stable', summary: 'The cost comparison is workable if the classification, role, and management assumptions are sound.' };
    },
    verdict:
      'Salary or hourly rate is not the decision. The business also has to carry payroll taxes, benefits, equipment, software, training, management time, utilization risk, and the commitment created by the relationship.',
    whatAdviceLeavesOut:
      'Most contractor-vs-employee advice talks about cost or classification. The operational part is usually ignored. A contractor can look expensive by the hour but stay flexible. An employee can look cheaper by the hour but add payroll pressure and management load.',
    sensitiveAssumptions: ['Annual hours needed', 'Payroll burden and benefits', 'Employee overhead', 'Utilization stability', 'Management time'],
    commonTraps: [
      'Choosing the cheaper path while ignoring classification risk.',
      'Forgetting ramp time and manager load.',
      'Treating salary or hourly rate as the full cost.',
    ],
    betterNextMoves: {
      stable: 'Write the role scope and 90-day success measures before hiring or contracting.',
      tight: 'Test a contractor, fractional role, or smaller scope before committing.',
      fragile: 'Reduce ambiguity and build a payroll reserve before adding permanent overhead.',
      'not-ready': 'Delete, automate, or simplify the work before adding headcount.',
      default: 'Use the cost spread to decide whether you need flexibility, control, or recurring capacity.',
    },
    scenarioPresets: [
      { label: 'First admin hire', description: 'Broad support role with moderate wage and high management load.', values: { contractorRate: 55, employeeRate: 28, hours: 1600, burdenPct: 30, employeeOverhead: 7500 } },
      { label: 'First sales hire', description: 'Higher overhead and ramp risk.', values: { contractorRate: 95, employeeRate: 45, hours: 1800, burdenPct: 34, employeeOverhead: 18000 } },
      { label: 'First developer', description: 'High wage, high tool/equipment cost.', values: { contractorRate: 125, employeeRate: 70, hours: 1800, burdenPct: 32, employeeOverhead: 14000 } },
      { label: 'Contractor trial', description: 'Variable demand before the role is proven.', values: { contractorRate: 90, employeeRate: 48, hours: 600, burdenPct: 30, employeeOverhead: 6500 } },
    ],
    assumptionModes: payrollModes,
    realityCheckQuestions: [
      'Is this a real role or a pile of owner stress?',
      'Can the business carry the person for 90 days before full productivity?',
      'What work should be deleted before hiring?',
      'Who will manage the person?',
      'What breaks if revenue drops after the hire?',
    ],
    methodologyMiniBlock:
      'This calculator compares contractor cost with employee wage cost plus burden and overhead. It is a budgeting model. Classification, labor rules, state payroll, benefits, and worker control still need separate review.',
    faqs: [
      { q: 'Is a contractor cheaper than an employee?', a: 'Sometimes on total commitment, even when the hourly rate is higher. But cost does not determine worker classification.' },
      { q: 'What is payroll burden?', a: 'Payroll burden is the extra cost beyond wage or salary, such as employer taxes, benefits, insurance, PTO, equipment, software, and admin.' },
      { q: 'When should I test with a contractor first?', a: 'When the need is real but uncertain, temporary, poorly documented, or not yet enough to justify permanent payroll.' },
      { q: 'What if the employee looks cheaper?', a: 'Check utilization, management load, ramp time, and commitment. An employee is cheaper only if the business can use and support the role well.' },
    ],
    operatorExamples: [
      {
        title: 'First employee at $65k',
        body: 'A business wants to hire someone around $65,000. The salary is only the starting number. Payroll burden, benefits, recruiting, tools, training, and management time can make the first-year cost meaningfully higher.',
        takeaway: 'The first hire should be modeled as a cash-flow event, not just a salary decision.',
      },
    ],
  },
  'hire-automate': {
    state: ({ values }) => {
      const hours = toNumber(values, 'taskHoursWeek');
      const coverage = toNumber(values, 'automationCoveragePct') / 100;
      const review = toNumber(values, 'reviewHoursWeek');
      const ownerValue = hours * toNumber(values, 'ownerHourlyValue') * 4.33;
      const automationMonthly = toNumber(values, 'automationMonthlyCost') + review * toNumber(values, 'ownerHourlyValue') * 4.33 + toNumber(values, 'automationSetupCost') / 12;
      const netAutomation = ownerValue * coverage - automationMonthly;
      if (hours < 5 || coverage < 0.25) {
        return { state: 'not-ready', label: 'Delete/redesign', summary: 'The work may be too small, messy, or low-value to automate or hire for yet.' };
      }
      if (review > hours * 0.3) {
        return { state: 'fragile', label: 'Redesign', summary: 'Review work is high enough that automation may shift the work instead of removing it.' };
      }
      if (netAutomation > 0 && coverage >= 0.45) {
        return { state: 'stable', label: 'Automate first', summary: 'The task is repetitive enough and the modeled automation spread is positive.' };
      }
      if (toNumber(values, 'employeeMonthlyCost') > ownerValue) {
        return { state: 'tight', label: 'Contract first', summary: 'A full hire is heavy relative to this workflow. A contractor or smaller test may fit better.' };
      }
      return { state: 'tight', label: 'Role design needed', summary: 'The work is real, but the path depends on whether the role is broader than this one workflow.' };
    },
    verdict:
      'Most hiring advice assumes the role is clear. In small businesses, the role is often founder overwhelm in disguise. Do not buy software or hire a person until you know whether the work should be deleted, simplified, automated, contracted, or turned into a real role.',
    whatAdviceLeavesOut:
      'Most hire-vs-automate advice compares prices. The missing question is whether the workflow is stable enough to hand to a person or system. Automation can add review work, and hiring into a messy process can create more management work.',
    sensitiveAssumptions: ['Hours of work per week', 'Automation coverage', 'Review and exception time', 'Setup and maintenance cost', 'Owner or team hourly value'],
    commonTraps: [
      'Automating a process nobody has simplified.',
      'Counting saved time before review time.',
      'Hiring before the role is clear.',
      'Ignoring the owner time needed to manage either path.',
    ],
    betterNextMoves: {
      stable: 'Document the workflow and run a small automation test before committing to annual software.',
      tight: 'Test a contractor or smaller scope before deciding on a hire.',
      fragile: 'Redesign the process and reduce review work before buying tools.',
      'not-ready': 'Delete, simplify, or document the work before automating or hiring.',
      default: 'Pick the path that reduces operational load instead of adding another system to manage.',
    },
    scenarioPresets: [
      { label: 'First admin workflow', description: 'Repetitive admin with moderate review.', values: { taskHoursWeek: 15, ownerHourlyValue: 85, employeeMonthlyCost: 6500, contractorHourlyRate: 55, automationMonthlyCost: 450, automationSetupCost: 3500, automationCoveragePct: 55, reviewHoursWeek: 3 } },
      { label: 'First sales support', description: 'More judgment and follow-up risk.', values: { taskHoursWeek: 20, ownerHourlyValue: 110, employeeMonthlyCost: 8500, contractorHourlyRate: 90, automationMonthlyCost: 900, automationSetupCost: 6500, automationCoveragePct: 35, reviewHoursWeek: 7 } },
      { label: 'Operations person', description: 'Recurring work that may need judgment.', values: { taskHoursWeek: 28, ownerHourlyValue: 95, employeeMonthlyCost: 7600, contractorHourlyRate: 80, automationMonthlyCost: 700, automationSetupCost: 5000, automationCoveragePct: 35, reviewHoursWeek: 6 } },
      { label: 'Automation replacing repetitive admin', description: 'Clear workflow and high repeatability.', values: { taskHoursWeek: 18, ownerHourlyValue: 90, employeeMonthlyCost: 7200, contractorHourlyRate: 75, automationMonthlyCost: 650, automationSetupCost: 4500, automationCoveragePct: 70, reviewHoursWeek: 2 } },
    ],
    assumptionModes: hireAutomateModes,
    realityCheckQuestions: [
      'Is the task repetitive, judgment-heavy, or just annoying?',
      'What work should be deleted before hiring?',
      'How much review will automation add?',
      'Who will own the workflow after the change?',
      'What breaks if the software or person does not perform for 90 days?',
    ],
    methodologyMiniBlock:
      'This calculator compares human help against automation, including setup time, monthly tool cost, maintenance, review time, and adoption. It is not trying to prove automation is better. It is trying to show whether the work needs a person, a system, a contractor, or deletion.',
    situationLinks: [
      { label: 'If the hire looked expensive', href: '/business/payroll-burden-calculator/', note: 'Model salary plus the full load.' },
      { label: 'If automation looked promising', href: '/business/software-roi-calculator/', note: 'Check adoption, review time, and maintenance.' },
      { label: 'If the role is unclear', href: '/business/contractor-vs-employee-calculator/', note: 'Compare flexible help before permanent payroll.' },
    ],
    faqs: [
      { q: 'Should I hire or automate repetitive work?', a: 'Automate first only when the work is repetitive, documented, low-judgment, and review time stays low.' },
      { q: 'When is automation worse than hiring?', a: 'When it creates exceptions, review queues, maintenance, data cleanup, or customer risk that a person still has to manage.' },
      { q: 'What work should I delete before hiring?', a: 'Delete low-value reporting, duplicate data entry, unnecessary approvals, unused meetings, and tasks created by a broken process.' },
      { q: 'When should I test with a contractor first?', a: 'When demand is real but temporary, role scope is fuzzy, or you need to prove the workflow before committing to payroll.' },
    ],
  },
  'hiring-readiness': {
    state: ({ values }) => {
      const role = (toNumber(values, 'roleClarityScore') + toNumber(values, 'documentedProcessScore') + toNumber(values, 'successMetricsScore') + toNumber(values, 'planScore')) / 4;
      const cost = toNumber(values, 'salary') * (1 + toNumber(values, 'payrollTaxPct') / 100) + toNumber(values, 'benefitsMonthly') * 12 + toNumber(values, 'recruitingTraining');
      const support = toNumber(values, 'currentProfit') * 12 / Math.max(1, cost);
      const reserve = toNumber(values, 'payrollReserve') / Math.max(1, cost / 4);
      const score = clamp(role * 0.35 + toNumber(values, 'recurringNeedScore') * 0.2 + toNumber(values, 'revenueStabilityScore') * 0.2 + Math.min(100, support * 70) * 0.15 + Math.min(100, reserve * 60) * 0.1 - toNumber(values, 'clientConcentrationPct') * 0.2, 0, 100);
      if (score >= 85) return { state: 'stable', label: 'Ready', summary: 'The role, revenue, process, and management capacity look strong enough to proceed.' };
      if (score >= 70) return { state: 'tight', label: 'Almost ready', summary: 'Hiring may work, but one or two assumptions need tightening.' };
      if (score >= 50) return { state: 'fragile', summary: 'The hire depends on optimistic revenue, unclear role design, or weak process.' };
      return { state: 'not-ready', summary: 'The business should simplify, contract, automate, or build reserve before hiring.' };
    },
    verdict:
      'If this score is weak, the issue is probably not confidence. The business may need clearer role design, more recurring revenue, stronger reserve, or a contractor/automation test before payroll.',
    whatAdviceLeavesOut:
      'Most hiring advice assumes readiness is obvious. The harder question is whether revenue, role clarity, recurring need, management capacity, and process maturity are all strong enough at the same time.',
    sensitiveAssumptions: ['Revenue stability', 'Payroll reserve', 'Role clarity', 'Recurring need', 'Manager hours per week'],
    commonTraps: ['Hiring because the owner is tired.', 'Calling a pile of tasks a role.', 'Ignoring reserve and ramp time.', 'Skipping contractor or automation tests when the need is uncertain.'],
    betterNextMoves: {
      stable: 'Write the 30/60/90 plan, confirm reserve, and define success metrics before recruiting.',
      tight: 'Tighten the weakest input before making an offer.',
      fragile: 'Use a contractor trial, document the process, or build reserve before payroll.',
      'not-ready': 'Delete low-value work, simplify the process, or delay hiring.',
      default: 'Use the score to find whether revenue, role design, reserve, or management is the blocker.',
    },
    scenarioPresets: [
      { label: 'First admin hire', description: 'Recurring need, weak process documentation.', values: { salary: 58000, monthlyRevenue: 52000, currentProfit: 8500, roleClarityScore: 55, documentedProcessScore: 35 } },
      { label: 'First operations person', description: 'High recurring need with real management load.', values: { salary: 72000, monthlyRevenue: 70000, recurringNeedScore: 78, managerHoursWeek: 7, planScore: 55 } },
      { label: 'Contractor should come first', description: 'Unclear role and strong alternatives.', values: { roleClarityScore: 42, documentedProcessScore: 30, contractorOptionScore: 85, deletionOptionScore: 55 } },
    ],
    assumptionModes: hiringRiskModes,
    realityCheckQuestions: [
      'Is this a real role or owner stress in disguise?',
      'Can revenue carry the person for 90 days before full productivity?',
      'Which process will the person inherit on day one?',
      'What will success look like in 30, 60, and 90 days?',
      'What should be deleted, simplified, automated, or contracted first?',
    ],
    methodologyMiniBlock:
      'This score combines revenue support, role clarity, recurring need, payroll reserve, management capacity, and process maturity. It is designed to show whether the business is ready for payroll, not just whether salary looks affordable.',
    doesNotDo: [
      'It does not approve a hiring decision.',
      'It does not handle compliance, classification, wage, benefits, or state payroll rules.',
      'It does not replace HR, legal, payroll, or accounting review.',
      'It does help identify the weakest hiring assumption.',
    ],
    situationLinks: [
      { label: 'Role Clarity Scorecard', href: '/business/role-clarity-scorecard/', note: 'Turn the role into responsibilities and success measures.' },
      { label: 'First 90-Day Hire Cost', href: '/business/first-90-day-hire-cost-calculator/', note: 'Check ramp and onboarding cost.' },
      { label: 'Hiring Stress Test', href: '/business/hiring-stress-test/', note: 'Test the hire against a bad month.' },
    ],
    faqs: [
      { q: 'How do I know if I am ready to hire?', a: 'Look for stable revenue, real recurring need, a clear role, documented processes, management capacity, and payroll reserve.' },
      { q: 'What if I am overwhelmed but cannot afford an employee?', a: 'Delete low-value work, simplify processes, test a contractor, or automate a repetitive part before adding payroll.' },
      { q: 'Should I hire part-time first?', a: 'Part-time or contractor support can be useful when workload is real but role clarity, revenue support, or process maturity is not ready for full payroll.' },
      { q: 'What is a 30/60/90 plan?', a: 'It defines what the hire should learn, own, and improve across the first three months so ramp time is visible before payroll starts.' },
    ],
  },
  'first-90-day-hire': {
    state: ({ values }) => {
      const salary = toNumber(values, 'hourlyWage') > 0 ? toNumber(values, 'hourlyWage') * toNumber(values, 'hoursPerWeek') * 52 : toNumber(values, 'salary');
      const monthly = salary / 12;
      const first90 = monthly * 3 * (1 + toNumber(values, 'employerPayrollTaxPct') / 100) + toNumber(values, 'benefitsMonthly') * 3 + toNumber(values, 'recruitingCost') + toNumber(values, 'equipment') + toNumber(values, 'softwareMonthly') * 3 + (toNumber(values, 'onboardingHours') + toNumber(values, 'trainingHours')) * toNumber(values, 'managerHourlyValue') + toNumber(values, 'expectedMistakesRework') + toNumber(values, 'delayedRevenueImpact');
      const reserve = toNumber(values, 'payrollReserve');
      if (reserve >= first90) return { state: 'stable', label: 'Easy ramp', summary: 'The business can absorb the modeled first 90 days.' };
      if (reserve >= first90 * 0.75) return { state: 'tight', label: 'Manageable', summary: 'The hire works if ramp stays close to plan.' };
      if (reserve >= first90 * 0.45) return { state: 'fragile', label: 'Cash tight', summary: 'The hire needs reserve, a phased start, or slower commitment.' };
      return { state: 'not-ready', label: 'Too risky', summary: 'The business cannot comfortably carry the ramp period.' };
    },
    verdict:
      'A hire can be affordable after full productivity and still stressful during ramp. Model the first 90 days as a cash-flow event before you treat the annual cost as manageable.',
    whatAdviceLeavesOut:
      'Most hiring calculators focus on annual cost. Small businesses feel the hire hardest while the person is being paid, trained, reviewed, and corrected before full output.',
    sensitiveAssumptions: ['Salary or hourly wage', 'Month 1-3 productivity', 'Manager time', 'Recruiting and equipment', 'Payroll reserve'],
    commonTraps: ['Counting the hire at full productivity on day one.', 'Forgetting owner training and review time.', 'Ignoring mistakes and delayed revenue.', 'Having no reserve for the first payroll cycles.'],
    betterNextMoves: {
      stable: 'Turn the ramp into a written 30/60/90 plan.',
      tight: 'Protect reserve and reduce optional setup spend before start date.',
      fragile: 'Phase the start, reduce scope, or test with a contractor.',
      'not-ready': 'Delay the hire until reserve covers the modeled ramp.',
      default: 'Find whether payroll, setup, manager time, or productivity drag creates the cash pressure.',
    },
    assumptionModes: hiringRiskModes,
    realityCheckQuestions: ['Who trains the person?', 'What should they own by day 30?', 'What output is realistic by day 60?', 'What mistakes or rework should be expected?', 'Can cash carry the ramp if revenue slips?'],
    methodologyMiniBlock:
      'This calculator adds three months of wages, employer payroll load, benefits, recruiting, equipment, software, manager time, productivity gaps, and rework to make ramp cost visible.',
    doesNotDo: ['It does not guarantee performance.', 'It does not calculate every payroll, benefits, or employment-law obligation.', 'It does not replace HR/payroll review.', 'It does help budget ramp before payroll starts.'],
    situationLinks: [
      { label: '30/60/90-Day Plan Template', href: '/business/hiring/templates/30-60-90-day-plan-template/', note: 'Make ramp expectations explicit.' },
      { label: 'Payroll Burden', href: '/business/payroll-burden-calculator/', note: 'Model full-year loaded cost.' },
      { label: 'Hiring Stress Test', href: '/business/hiring-stress-test/', note: 'Check the hire against a bad month.' },
    ],
    faqs: [
      { q: 'What does the first 90 days of a hire really cost?', a: 'Wages, employer payroll load, benefits, recruiting, onboarding, equipment, software, manager time, productivity gaps, mistakes, and delayed revenue.' },
      { q: 'Why does hiring feel expensive before it feels helpful?', a: 'Because payroll starts immediately while productivity, process understanding, and independent ownership take time.' },
      { q: 'What if a new hire takes longer to ramp?', a: 'Increase manager time, lower productivity assumptions, and add reserve before deciding the hire is affordable.' },
    ],
  },
  'role-clarity': {
    state: ({ values }) => {
      const clarity = (toNumber(values, 'responsibilitiesScore') + toNumber(values, 'outcomesScore') + toNumber(values, 'recurringTasksScore') + toNumber(values, 'processDocsScore') + toNumber(values, 'decisionAuthorityScore') + toNumber(values, 'successMetricsScore') + toNumber(values, 'boundariesScore') + toNumber(values, 'planScore')) / 8;
      if (clarity >= 85) return { state: 'stable', label: 'Hire-ready role', summary: 'The role is clear enough to recruit against.' };
      if (clarity >= 70) return { state: 'tight', label: 'Mostly clear', summary: 'The role is close, but one or two areas need tightening.' };
      if (clarity >= 50) return { state: 'fragile', label: 'Needs design', summary: 'The role is probably too broad, unclear, or underdocumented.' };
      return { state: 'not-ready', label: 'Not a role yet', summary: 'This looks more like owner stress than a job description.' };
    },
    verdict:
      'A vague job does not become clear because someone accepts it. Before hiring, turn the pain into outcomes, responsibilities, boundaries, decision rights, and first-90-day success measures.',
    whatAdviceLeavesOut:
      'Small businesses often hire because the owner is tired, not because the role is clear. That is understandable, but a person cannot succeed inside unresolved process and unclear priorities.',
    sensitiveAssumptions: ['Responsibilities clarity', 'Process documentation', 'Decision authority', 'Success metrics', 'Role boundaries'],
    commonTraps: ['Writing "be proactive" instead of defining ownership.', 'Combining three jobs into one first hire.', 'Leaving final quality control undefined.', 'Skipping the 30/60/90 plan.'],
    betterNextMoves: {
      stable: 'Turn the role definition into a job post and 30/60/90 plan.',
      tight: 'Clarify the weakest responsibilities, boundaries, or metrics before recruiting.',
      fragile: 'Design the workflow and split the role before hiring.',
      'not-ready': 'Document the recurring work and delete low-value tasks first.',
      default: 'Make the role concrete enough for someone else to succeed.',
    },
    realityCheckQuestions: ['What does this role own?', 'What does this role not own?', 'What recurring work happens every week?', 'What decisions can the person make?', 'How will success be measured by day 90?'],
    methodologyMiniBlock:
      'This score looks at responsibilities, outcomes, recurring tasks, documentation, authority, success metrics, handoffs, boundaries, owner involvement, and role breadth.',
    doesNotDo: ['It does not create a legal job description.', 'It does not handle wage, exempt, or classification rules.', 'It does not replace HR review.', 'It does help separate a real role from founder overwhelm.'],
    situationLinks: [
      { label: 'First Employee Role Definition Template', href: '/business/hiring/templates/first-employee-role-definition-template/', note: 'Turn the score into a role document.' },
      { label: 'Contractor Trial Calculator', href: '/business/contractor-trial-calculator/', note: 'Test unclear work before payroll.' },
      { label: 'Work Deletion Calculator', href: '/business/work-deletion-calculator/', note: 'Remove work that should not become a job.' },
    ],
    faqs: [
      { q: 'How clear should a role be before hiring?', a: 'Clear enough to define responsibilities, outcomes, boundaries, decision authority, reporting, tools, and first-90-day expectations.' },
      { q: 'What if I just need someone to take things off my plate?', a: 'List the recurring tasks, delete low-value work, and turn the rest into outcomes before hiring.' },
      { q: 'Should I test with a contractor first?', a: 'Yes when the work is real but scope, process, or recurrence is still uncertain.' },
    ],
  },
  'management-burden': {
    state: ({ values }) => {
      const weekly = toNumber(values, 'weeklyCheckinHours') + toNumber(values, 'reviewHoursWeek') + toNumber(values, 'feedbackHoursWeek') + toNumber(values, 'meetingsHoursWeek') + toNumber(values, 'reworkHoursWeek') + toNumber(values, 'communicationHoursWeek');
      if (weekly <= 5 && toNumber(values, 'roleMaturityScore') >= 70) return { state: 'stable', label: 'Low burden', summary: 'The role can likely operate with light management.' };
      if (weekly <= 9) return { state: 'tight', label: 'Manageable', summary: 'The hire needs regular oversight but may not be disruptive.' };
      if (weekly <= 15) return { state: 'fragile', label: 'Heavy', summary: 'Management work may offset the capacity gained.' };
      return { state: 'not-ready', label: 'Unready', summary: 'Hiring may create more owner work than it removes.' };
    },
    verdict:
      'Hiring changes the work. The owner may stop doing the task but start training, reviewing, correcting, explaining, planning, and managing.',
    whatAdviceLeavesOut:
      'Most hiring math counts employee cost and ignores manager cost. Owner time is still cost, especially when it blocks sales, delivery, quality control, or strategic work.',
    sensitiveAssumptions: ['Review hours', 'Rework hours', 'Role maturity', 'Employee experience', 'Manager hourly value'],
    commonTraps: ['Assuming delegation is instant.', 'Ignoring review and rework.', 'Adding direct reports without management structure.', 'Forgetting documentation time.'],
    betterNextMoves: {
      stable: 'Set a check-in rhythm and protect standards.',
      tight: 'Document recurring work and reduce review loops.',
      fragile: 'Clarify role ownership before hiring or expanding responsibility.',
      'not-ready': 'Improve process, training, or management capacity before hiring.',
      default: 'Count manager time as part of the hire cost.',
    },
    realityCheckQuestions: ['How often will you review work?', 'What mistakes require owner correction?', 'Which decisions can they make alone?', 'How much time will training take?', 'Does managing this person replace the work you wanted to remove?'],
    methodologyMiniBlock:
      'This calculator turns check-ins, training, review, meetings, rework, communication, and documentation into monthly management hours and cost.',
    doesNotDo: ['It does not evaluate employee performance.', 'It does not replace management training or HR process.', 'It does not predict culture fit.', 'It does show owner capacity impact.'],
    situationLinks: [
      { label: 'Role Clarity Scorecard', href: '/business/role-clarity-scorecard/', note: 'Reduce burden by making ownership clearer.' },
      { label: 'First 90-Day Hire Cost', href: '/business/first-90-day-hire-cost-calculator/', note: 'Add manager time to ramp cost.' },
      { label: 'Hiring Readiness Score', href: '/business/hiring-readiness-score/', note: 'See whether management capacity supports payroll.' },
    ],
    faqs: [
      { q: 'How much time does managing an employee take?', a: 'It depends on role maturity, documentation, experience, quality standards, and review load. Count check-ins, feedback, rework, meetings, communication, and documentation.' },
      { q: 'Why does hiring sometimes create more work?', a: 'Because the task is replaced by teaching, reviewing, clarifying, correcting, and coordinating.' },
      { q: 'How do I reduce management burden?', a: 'Clarify ownership, document processes, set quality standards, define decisions, and avoid hiring into vague work.' },
    ],
  },
  'contractor-trial': {
    state: ({ values }) => {
      const scope = (toNumber(values, 'deliverablesClarityScore') + toNumber(values, 'successCriteriaScore') + toNumber(values, 'handoffClarityScore')) / 3;
      if (scope >= 75 && toNumber(values, 'sensitivityScore') < 60) return { state: 'stable', label: 'Good trial candidate', summary: 'The work can be tested cleanly.' };
      if (scope >= 55) return { state: 'tight', label: 'Needs clearer scope', summary: 'The trial may work after better deliverables and success criteria.' };
      if (toNumber(values, 'sensitivityScore') >= 70) return { state: 'fragile', label: 'Poor trial candidate', summary: 'The work may be too vague or sensitive for a clean trial.' };
      return { state: 'not-ready', label: 'Hire may be premature', summary: 'A trial should happen before payroll, but the trial itself needs design.' };
    },
    verdict:
      'A contractor trial is not just cheaper labor. It is an experiment to learn whether the work is recurring, clear, delegable, and valuable enough for continued help.',
    whatAdviceLeavesOut:
      'Most contractor advice treats the trial as a staffing shortcut. The real value is learning whether the owner can delegate the work and whether the business benefits from removing it from the owner plate.',
    sensitiveAssumptions: ['Trial length', 'Expected hours', 'Deliverables clarity', 'Owner management time', 'Success criteria'],
    commonTraps: ['Creating an unpaid audition.', 'Starting a trial with vague deliverables.', 'Testing work that is too sensitive to hand off.', 'Forgetting owner management time.'],
    betterNextMoves: {
      stable: 'Write the trial brief and define what happens after the trial.',
      tight: 'Clarify deliverables, deadline, and definition of done before starting.',
      fragile: 'Use a narrower or lower-risk trial first.',
      'not-ready': 'Design the work before paying a contractor or hiring.',
      default: 'Use the trial to learn whether this should become a role.',
    },
    realityCheckQuestions: ['What will be delivered?', 'What means done?', 'How much owner time will the trial need?', 'Will this work repeat?', 'What decision will the trial answer?'],
    methodologyMiniBlock:
      'This calculator adds contractor hours, owner management time, onboarding, and tool access, then scores whether the trial is clear enough to teach you something useful.',
    doesNotDo: ['It does not determine legal worker classification.', 'It does not make a contractor safe because the trial is short.', 'It does not replace contracts or compliance review.', 'It does help design a paid experiment.'],
    situationLinks: [
      { label: 'Contractor Trial Brief Template', href: '/business/hiring/templates/contractor-trial-project-brief/', note: 'Turn the trial into a usable brief.' },
      { label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/', note: 'Compare the longer-term paths.' },
      { label: 'Role Clarity Scorecard', href: '/business/role-clarity-scorecard/', note: 'Check whether the trial is role-ready.' },
    ],
    faqs: [
      { q: 'Should I hire a contractor first?', a: 'Often yes when demand is uncertain, role scope is unclear, or you need to test delegation before payroll.' },
      { q: 'What should a contractor trial include?', a: 'A goal, deliverables, deadline, access, communication rhythm, definition of done, payment terms, and review questions.' },
      { q: 'Can a trial replace worker classification review?', a: 'No. Classification depends on legal facts, control, independence, relationship, and applicable federal/state rules.' },
    ],
  },
  'work-deletion': {
    state: ({ values }) => {
      const lowValue = (100 - toNumber(values, 'customerValueScore')) + (100 - toNumber(values, 'revenueImpactScore')) + toNumber(values, 'duplicateProcessScore') + toNumber(values, 'oldHabitScore');
      if (lowValue > 250 && toNumber(values, 'riskIfStoppedScore') < 45) return { state: 'stable', label: 'Delete', summary: 'Low value, low risk, high time waste.' };
      if (lowValue > 210) return { state: 'tight', label: 'Reduce', summary: 'Some value exists, but the work appears overdone.' };
      if (isChecked(values, 'canBatch')) return { state: 'tight', label: 'Batch', summary: 'The task may be useful but too fragmented.' };
      if (isChecked(values, 'canSimplify')) return { state: 'fragile', label: 'Automate/delegate', summary: 'The work may be worth doing, but not manually by the owner.' };
      return { state: 'not-ready', label: 'Keep', summary: 'The work appears too valuable or risky to stop casually.' };
    },
    verdict:
      'The cheapest task is the one you stop doing. Before hiring or automating, ask whether the work still creates value or only preserves an old habit.',
    whatAdviceLeavesOut:
      'Owners often ask who can do this before asking whether it should still be done. Hiring or automating low-value work makes the business heavier.',
    sensitiveAssumptions: ['Hours per week', 'Customer value', 'Revenue impact', 'Risk if stopped', 'Duplicate process score'],
    commonTraps: ['Automating work that should be deleted.', 'Hiring for duplicate admin.', 'Keeping reports nobody uses.', 'Ignoring risk before stopping a control task.'],
    betterNextMoves: {
      stable: 'Stop the work with a small rollback plan.',
      tight: 'Reduce or batch the work before assigning it to someone.',
      fragile: 'Simplify and document before automation or delegation.',
      'not-ready': 'Keep the work until risk is understood.',
      default: 'Find the work that should disappear before adding people.',
    },
    realityCheckQuestions: ['Who uses this output?', 'What breaks if it stops?', 'Does it duplicate another process?', 'Is it an old habit?', 'Could it be batched or simplified?'],
    methodologyMiniBlock:
      'This calculator scores value, revenue impact, stopping risk, usage, duplication, habit, batching, simplification, and owner time to decide whether work should be deleted before hiring.',
    doesNotDo: ['It does not approve removal of compliance, safety, financial, or customer-critical controls.', 'It does not know all downstream users.', 'It does not replace process review.', 'It does help find low-value work.'],
    situationLinks: [
      { label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/', note: 'Compare deletion against tools and people.' },
      { label: 'Not Ready to Hire Yet Memo', href: '/business/hiring/templates/not-ready-to-hire-yet-memo/', note: 'Document the decision to clean up first.' },
      { label: 'Hire vs Automate Worksheet', href: '/business/hiring/templates/hire-vs-automate-worksheet/', note: 'Use the framework on one workflow.' },
    ],
    faqs: [
      { q: 'What work should I delete before hiring?', a: 'Low-value reports, duplicate data entry, unnecessary approvals, stale meetings, and tasks created by a broken process are common candidates.' },
      { q: 'When should I not delete work?', a: 'When stopping creates customer, compliance, financial, safety, security, or quality risk you have not reviewed.' },
      { q: 'Is automation better than deletion?', a: 'Only if the work still creates value. Automation can make bad work permanent.' },
    ],
  },
  'hiring-stress-test': {
    state: ({ values }) => {
      const monthlyCost = toNumber(values, 'plannedHireMonthlyCost') + toNumber(values, 'benefitsOverrun') + toNumber(values, 'managerTimeOverrunHours') * toNumber(values, 'managerHourlyValue');
      const reserveMonths = toNumber(values, 'payrollReserve') / Math.max(1, monthlyCost);
      const stressedRevenue = toNumber(values, 'currentMonthlyRevenue') * (1 - toNumber(values, 'revenueDropPct') / 100) - toNumber(values, 'clientLossRevenue');
      const afterHire = toNumber(values, 'currentProfit') - monthlyCost - (toNumber(values, 'currentMonthlyRevenue') - stressedRevenue);
      if (reserveMonths >= 6 && afterHire >= 0) return { state: 'stable', label: 'Resilient', summary: 'The business can absorb reasonable downside.' };
      if (reserveMonths >= 3) return { state: 'tight', label: 'Sensitive', summary: 'The hire works, but revenue drops hurt quickly.' };
      if (reserveMonths >= 1) return { state: 'fragile', summary: 'A small drop creates cash pressure.' };
      return { state: 'not-ready', label: 'Unsafe', summary: 'Hiring now could threaten operating stability.' };
    },
    verdict:
      'Payroll is not like a subscription you casually cancel. Once someone depends on the business for income, the cash-flow and emotional stakes change.',
    whatAdviceLeavesOut:
      'A hire can look affordable in a normal month and become painful in a bad month. Stress-testing revenue decline, client loss, payment delay, and ramp overrun matters before payroll starts.',
    sensitiveAssumptions: ['Revenue drop percentage', 'Client-loss scenario', 'Payroll reserve', 'Planned hire cost', 'Ramp and manager-time overrun'],
    commonTraps: ['Testing only the normal month.', 'Ignoring client concentration.', 'Forgetting delayed collections.', 'Assuming payroll can be reversed instantly.'],
    betterNextMoves: {
      stable: 'Proceed only after confirming role clarity and payroll setup.',
      tight: 'Build reserve or reduce the initial commitment.',
      fragile: 'Contract first or delay until revenue support improves.',
      'not-ready': 'Do not add payroll until reserve and revenue stability improve.',
      default: 'Use the downside case before making the offer.',
    },
    assumptionModes: hiringRiskModes,
    realityCheckQuestions: ['What happens if one large client leaves?', 'How long can reserve carry payroll?', 'What if collections slow?', 'What if ramp takes another month?', 'Can the business delay or phase the hire?'],
    methodologyMiniBlock:
      'This calculator subtracts revenue drop, client loss, payment-delay pressure, hire cost, benefit overrun, and manager-time overrun from current profit, then compares the result with payroll reserve.',
    doesNotDo: ['It does not model legal obligations around termination or wage payment.', 'It does not replace cash-flow forecasting.', 'It does not guarantee resilience.', 'It does help see downside before payroll starts.'],
    situationLinks: [
      { label: 'Payroll Burden', href: '/business/payroll-burden-calculator/', note: 'Confirm the monthly loaded cost.' },
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/', note: 'Stress-test the revenue side.' },
      { label: 'Not Ready to Hire Yet Memo', href: '/business/hiring/templates/not-ready-to-hire-yet-memo/', note: 'Document a delayed-hire decision.' },
    ],
    faqs: [
      { q: 'What if revenue drops after hiring?', a: 'Use payroll reserve, revenue concentration, collections, and ramp assumptions to decide whether to hire now, delay, contract first, or build reserve.' },
      { q: 'How much payroll reserve should a small business have?', a: 'It depends on margin and revenue stability, but the reserve should cover multiple months of loaded payroll and ramp risk, not just one paycheck.' },
      { q: 'When should I delay a hire?', a: 'Delay when a normal revenue dip would make payroll stressful, the role is unclear, or reserve does not cover ramp.' },
    ],
  },
  'revenue-per-employee': {
    state: ({ values }) => {
      const annualRevenue = toNumber(values, 'annualRevenue') || toNumber(values, 'monthlyRevenue') * 12;
      const peopleCost = toNumber(values, 'currentPayroll') + toNumber(values, 'plannedPayroll') + toNumber(values, 'benefits');
      const payrollShare = peopleCost / Math.max(1, annualRevenue);
      if (toNumber(values, 'founderWorkloadScore') >= 75) return { state: 'fragile', label: 'Founder bottleneck', summary: 'Revenue depends too heavily on owner capacity.' };
      if (payrollShare > 0.55) return { state: 'not-ready', label: 'Heavy team', summary: 'Payroll/headcount may be outpacing revenue.' };
      if (payrollShare > 0.4 || toNumber(values, 'clientConcentrationPct') > 35) return { state: 'tight', label: 'Watchlist', summary: 'Revenue supports the team, but new hires need caution.' };
      return { state: 'stable', label: 'Healthy leverage', summary: 'Revenue appears strong enough relative to headcount and margin.' };
    },
    verdict:
      'The question is not only whether revenue is high enough. It is whether revenue is repeatable enough to support people who need to be paid every cycle.',
    whatAdviceLeavesOut:
      'Revenue per employee is often treated like an enterprise benchmark. For small businesses, it also shows whether the owner becomes the manager, salesperson, quality-control person, and emergency solver for every new hire.',
    sensitiveAssumptions: ['Annual revenue', 'Headcount/FTE count', 'Payroll as percentage of revenue', 'Gross margin', 'Founder workload'],
    commonTraps: ['Using revenue per employee without margin.', 'Ignoring owner bottleneck.', 'Counting contractors inconsistently.', 'Forgetting client concentration.'],
    betterNextMoves: {
      stable: 'Define the next hire by bottleneck and margin impact.',
      tight: 'Stress-test payroll and client loss before hiring.',
      fragile: 'Remove founder bottlenecks before adding coordination load.',
      'not-ready': 'Improve margin, revenue stability, or process before more headcount.',
      default: 'Use revenue per employee as a pressure signal, not a universal benchmark.',
    },
    realityCheckQuestions: ['Is revenue repeatable?', 'What share of revenue goes to payroll?', 'Is the founder still the bottleneck?', 'What happens if the largest client leaves?', 'Which capacity bottleneck does the hire solve?'],
    methodologyMiniBlock:
      'This calculator divides revenue by headcount/FTE, compares people cost with revenue, estimates gross profit per person, and flags founder bottleneck and concentration pressure.',
    doesNotDo: ['It does not provide industry benchmarks as rules.', 'It does not decide compensation or staffing levels.', 'It does not replace bookkeeping or forecast review.', 'It does help test whether growth can carry the team.'],
    situationLinks: [
      { label: 'Payroll Burden', href: '/business/payroll-burden-calculator/', note: 'Model the next person cost.' },
      { label: 'Hiring Stress Test', href: '/business/hiring-stress-test/', note: 'Test revenue drop after hiring.' },
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/', note: 'Check if revenue support is real.' },
    ],
    faqs: [
      { q: 'How much revenue do I need before hiring?', a: 'Enough repeatable revenue and margin to cover loaded payroll, reserve, ramp time, and owner management load without making cash fragile.' },
      { q: 'What is payroll as a percentage of revenue?', a: 'It is people cost divided by revenue. The useful range depends on margin, business model, role mix, and growth stage.' },
      { q: 'Why can hiring make growth feel heavier?', a: 'More people can add coordination, review, management, systems, and quality-control work before they add capacity.' },
    ],
  },
  'revenue-forecast': {
    state: ({ values }) => {
      const current = toNumber(values, 'currentMonthlyRevenue');
      const newRevenue = toNumber(values, 'newLeads') * (toNumber(values, 'closeRatePct') / 100) * toNumber(values, 'averageDeal');
      const churn = current * toNumber(values, 'churnPct') / 100;
      const forecast = current + newRevenue - churn;
      const delay = toNumber(values, 'collectionDelayDays');
      if (forecast < current) {
        return { state: 'not-ready', summary: 'The forecast shrinks because new sales do not cover churn or lost revenue.' };
      }
      if (newRevenue < churn || delay >= 75) {
        return { state: 'fragile', summary: 'The plan is exposed to churn, client loss, or cash timing pressure.' };
      }
      if (delay >= 45 || toNumber(values, 'closeRatePct') > 35) {
        return { state: 'tight', summary: 'The forecast works, but it depends on collection timing or a strong close-rate assumption.' };
      }
      return { state: 'stable', summary: 'The forecast grows with visible pipeline, churn, and cash-timing assumptions.' };
    },
    verdict:
      'The forecast is useful only if it survives a less flattering case. If one client leaves, close rate slips, or collections slow down, the plan may feel very different from the headline number.',
    whatAdviceLeavesOut:
      'Most revenue advice turns a target into motivation. Operators need the mechanics: lead volume, close rate, average deal size, churn, client concentration, sales cycle, and whether booked revenue becomes collected cash.',
    sensitiveAssumptions: ['Average deal size', 'Close rate', 'Churn or client loss', 'Payment delay', 'Sales cycle length'],
    commonTraps: [
      'Confusing booked revenue with collected cash.',
      'Forecasting from the best recent month.',
      'Replacing lost revenue instead of fixing the leak.',
    ],
    betterNextMoves: {
      stable: 'Turn the forecast into a weekly sales and collection review.',
      tight: 'Stress-test the forecast with lower close rate and slower payment.',
      fragile: 'Model one large client leaving before committing to new costs.',
      'not-ready': 'Fix churn, pipeline quality, or collection before using this forecast to spend.',
      default: 'Find whether sales, retention, or cash timing is the bottleneck.',
    },
    scenarioPresets: [
      { label: 'Freelancer with three clients', description: 'Small pipeline and meaningful client-loss risk.', values: { currentMonthlyRevenue: 18000, newLeads: 10, closeRatePct: 20, averageDeal: 1800, churnPct: 10, collectionDelayDays: 30 } },
      { label: 'Agency project revenue', description: 'Higher deal size with collection delay.', values: { currentMonthlyRevenue: 65000, newLeads: 35, closeRatePct: 16, averageDeal: 6500, churnPct: 8, collectionDelayDays: 45 } },
      { label: 'SaaS with monthly churn', description: 'Recurring base with churn pressure.', values: { currentMonthlyRevenue: 42000, newLeads: 120, closeRatePct: 5, averageDeal: 450, churnPct: 6, collectionDelayDays: 10 } },
      { label: 'Subscription newsletter', description: 'Low deal value and low collection delay.', values: { currentMonthlyRevenue: 9000, newLeads: 400, closeRatePct: 3, averageDeal: 120, churnPct: 5, collectionDelayDays: 5 } },
      { label: 'Productized service', description: 'Repeatable offers with moderate churn.', values: { currentMonthlyRevenue: 32000, newLeads: 60, closeRatePct: 12, averageDeal: 2200, churnPct: 5, collectionDelayDays: 20 } },
      { label: 'One dominant client', description: 'Current revenue looks stable until one account leaves.', values: { currentMonthlyRevenue: 55000, newLeads: 22, closeRatePct: 14, averageDeal: 3500, churnPct: 18, collectionDelayDays: 35 } },
    ],
    assumptionModes: revenueModes,
    realityCheckQuestions: [
      'What happens if one large client leaves?',
      'Is close rate based on qualified leads or all leads?',
      'How long does cash actually take to arrive?',
      'What revenue is booked but not collected?',
      'Is churn a sales problem or a retention problem?',
    ],
    methodologyMiniBlock:
      'This tool starts with current revenue, then models new sales, churn, deal size, close rate, and collection delay. The goal is not a perfect forecast. The goal is to show which assumptions the revenue plan depends on.',
    faqs: [
      { q: 'Why does revenue feel good while cash feels tight?', a: 'Collection delay, upfront costs, late invoices, and churn replacement can make revenue look better than bank balance.' },
      { q: 'What close rate should I use?', a: 'Use a measured close rate from qualified leads. If you do not know it, run a conservative case before hiring or increasing fixed costs.' },
      { q: 'Should I forecast from my best month?', a: 'No. Use trailing average revenue and then model upside separately. Best-month planning usually overstates capacity.' },
      { q: 'How do I include client concentration?', a: 'Run a scenario where the largest client leaves or pays late. If the business breaks, the forecast is fragile.' },
    ],
  },
  'revenue-fragility': {
    state: ({ values }) => {
      const revenue = toNumber(values, 'currentMonthlyRevenue');
      const largestPct = revenue > 0 ? toNumber(values, 'largestClientRevenue') / revenue : 0;
      const top3Pct = revenue > 0 ? toNumber(values, 'top3ClientRevenue') / revenue : 0;
      const pipeline = toNumber(values, 'qualifiedLeads') * (toNumber(values, 'closeRatePct') / 100) * toNumber(values, 'averageDeal');
      const churn = revenue * toNumber(values, 'churnPct') / 100;
      const gap = churn + toNumber(values, 'largestClientRevenue') * 0.35 - pipeline;
      if (largestPct >= 0.45 || top3Pct >= 0.75 || gap > revenue * 0.2) return { state: 'not-ready', label: 'Exposed', summary: 'The plan depends too heavily on a few assumptions going right.' };
      if (largestPct >= 0.3 || top3Pct >= 0.6 || toNumber(values, 'collectionDelayDays') >= 60) return { state: 'fragile', label: 'Fragile', summary: 'Client concentration, payment timing, or replacement pipeline could break the plan.' };
      if (largestPct >= 0.2 || toNumber(values, 'churnPct') >= 6) return { state: 'tight', label: 'Watchlist', summary: 'The plan can work, but one or two assumptions need regular review.' };
      return { state: 'stable', label: 'Resilient', summary: 'Revenue looks diversified enough, supported by pipeline, and less timing-dependent.' };
    },
    verdict:
      'This score is not about pessimism. It shows whether revenue is diversified, supported by real pipeline, and collectable before the business builds fixed costs around it.',
    whatAdviceLeavesOut:
      'Most forecasting advice asks for a revenue goal. It rarely asks whether one client, one channel, one close-rate assumption, or one delayed payment can break the plan.',
    sensitiveAssumptions: ['Largest client revenue', 'Top-client concentration', 'Pipeline coverage', 'Monthly churn', 'Payment delay'],
    commonTraps: ['Treating recurring revenue as stable by default.', 'Spending against pipeline that has not been qualified.', 'Ignoring collection timing.'],
    betterNextMoves: {
      stable: 'Keep a monthly review of pipeline coverage, churn, and top-client dependency.',
      tight: 'Pick the weakest assumption and run a downside case before increasing fixed costs.',
      fragile: 'Build pipeline or reduce concentration before hiring or expanding spend.',
      'not-ready': 'Do not build around this forecast yet. Lower the fixed-cost base or rebuild the revenue plan.',
      default: 'Find the weakest assumption before acting on the forecast.',
    },
    scenarioPresets: [
      { label: 'Agency with one large client', description: 'Top-client dependency creates a fragile forecast.', values: { currentMonthlyRevenue: 65000, recurringRevenue: 42000, largestClientRevenue: 26000, top3ClientRevenue: 47000, activeClients: 9, qualifiedLeads: 12, closeRatePct: 18, averageDeal: 4200, churnPct: 7, collectionDelayDays: 45, operatingCosts: 43000 } },
      { label: 'Diversified service business', description: 'Smaller clients and stronger pipeline support the plan.', values: { currentMonthlyRevenue: 72000, recurringRevenue: 48000, largestClientRevenue: 9000, top3ClientRevenue: 24000, activeClients: 28, qualifiedLeads: 38, closeRatePct: 22, averageDeal: 3200, churnPct: 3, collectionDelayDays: 25, operatingCosts: 39000 } },
    ],
    assumptionModes: revenueModes,
    realityCheckQuestions: ['Which single assumption breaks the forecast first?', 'What happens if the largest client leaves?', 'Is pipeline qualified or just listed?', 'How long does cash take to arrive?', 'What fixed cost depends on this forecast?'],
    methodologyMiniBlock:
      'The score combines concentration, churn, pipeline coverage, payment timing, gross margin, and cost pressure. It is a planning diagnostic, not a prediction.',
    doesNotDo: ['It does not predict actual revenue.', 'It does not assign a valuation or credit score.', 'It does not replace bookkeeping, CRM data, or pipeline review.', 'It does expose which assumptions deserve stress testing.'],
    situationLinks: [
      { label: 'Client Concentration Risk', href: '/business/client-concentration-risk-calculator/', note: 'Stress-test the biggest relationship.' },
      { label: 'Sales Pipeline Reality Check', href: '/business/sales-pipeline-reality-check/', note: 'Find soft or stale pipeline.' },
      { label: 'Cash Runway', href: '/business/small-business-cash-runway-calculator/', note: 'Test whether cash can absorb the downside.' },
    ],
    faqs: [
      { q: 'What makes a revenue forecast fragile?', a: 'Concentration, weak pipeline, long payment delays, churn, low margin, and high fixed costs make a forecast fragile.' },
      { q: 'Is recurring revenue always stable?', a: 'No. Recurring billing is only stable when renewal, usage, value, payment, support, and scope assumptions hold.' },
      { q: 'Can I hire against a fragile forecast?', a: 'You can, but the hire should be stress-tested against client loss, delayed cash, and slower sales before payroll starts.' },
    ],
  },
  'sales-target': {
    state: ({ values }) => {
      const gap = Math.max(0, toNumber(values, 'revenueGoal') - Math.max(toNumber(values, 'currentRevenue'), toNumber(values, 'existingRecurringRevenue')));
      const deals = gap / Math.max(1, toNumber(values, 'averageDeal'));
      const proposals = deals / Math.max(0.01, toNumber(values, 'proposalClosePct') / 100);
      const calls = proposals / Math.max(0.01, toNumber(values, 'callToProposalPct') / 100);
      if (toNumber(values, 'salesCycleWeeks') > 8) return { state: 'not-ready', label: 'Timing problem', summary: 'The sales cycle is too long for the revenue date implied by the goal.' };
      if (deals > toNumber(values, 'deliveryCapacityDeals') || calls > toNumber(values, 'ownerCallsPerWeek') * 4) return { state: 'fragile', label: 'Unrealistic', summary: 'Required sales or delivery activity exceeds modeled capacity.' };
      if (gap > toNumber(values, 'currentRevenue') * 0.75) return { state: 'tight', label: 'Heavy lift', summary: 'The goal may be possible, but it requires strong execution and pipeline discipline.' };
      return { state: 'stable', label: 'Plausible', summary: 'Sales activity, close rate, and timing support the goal under the entered assumptions.' };
    },
    verdict: '"More sales" is not a plan. The plan is the number of qualified leads, calls, proposals, closes, and delivered deals required by the target.',
    whatAdviceLeavesOut:
      'Most sales-target advice starts with ambition. Operators need pipeline math, sales-cycle timing, and delivery capacity before a revenue goal is useful.',
    sensitiveAssumptions: ['Average deal size', 'Lead-to-call rate', 'Call-to-proposal rate', 'Proposal close rate', 'Sales cycle and delivery capacity'],
    commonTraps: ['Counting raw leads as qualified leads.', 'Ignoring sales-cycle timing.', 'Closing work the team cannot deliver.'],
    betterNextMoves: {
      stable: 'Turn the required leads, calls, and proposals into a weekly operating rhythm.',
      tight: 'Improve deal size or conversion before simply demanding more leads.',
      fragile: 'Fix capacity, narrow the offer, or reduce the target before adding sales pressure.',
      'not-ready': 'Move the deadline or use a longer-cycle forecast.',
      default: 'Find whether lead volume, conversion, deal size, or timing is the bottleneck.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['How many qualified leads are actually available?', 'Which funnel stage leaks most?', 'Can delivery handle the deals?', 'Will payment arrive by the deadline?', 'What close rate is measured, not guessed?'],
    methodologyMiniBlock:
      'The tool divides the revenue gap by average deal size, then backs into proposals, calls, and leads using funnel-stage rates and sales-cycle timing.',
    faqs: [
      { q: 'How many leads do I need to hit a revenue goal?', a: 'Divide the revenue gap by deal size, then work backward through proposal close rate, call-to-proposal rate, and lead-to-call rate.' },
      { q: 'What if my close rate drops?', a: 'The required leads and calls rise quickly. Run a conservative case before treating the target as realistic.' },
      { q: 'What if my sales cycle is long?', a: 'A realistic target may need to move later because deals that close after the deadline do not help the deadline.' },
    ],
  },
  'sales-pipeline-reality': {
    state: ({ values }) => {
      const quality =
        (toNumber(values, 'qualifiedDealPct') + toNumber(values, 'decisionMakerPct') + toNumber(values, 'budgetConfirmedPct') + toNumber(values, 'nextStepPct') + (100 - toNumber(values, 'staleDealPct'))) / 5;
      const realistic = toNumber(values, 'pipelineValue') * toNumber(values, 'closeProbabilityPct') / 100 * quality / 100;
      const coverage = realistic / Math.max(1, toNumber(values, 'revenueTarget'));
      if (quality < 45 || coverage < 0.5) return { state: 'not-ready', label: 'Fantasy pipeline', summary: 'The forecast depends on stale, vague, or unqualified deals.' };
      if (quality < 60 || coverage < 0.8) return { state: 'fragile', label: 'Thin pipeline', summary: 'Not enough qualified opportunities support the target.' };
      if (quality < 75 || coverage < 1) return { state: 'tight', label: 'Soft pipeline', summary: 'Pipeline exists, but some deals need validation.' };
      return { state: 'stable', label: 'Strong pipeline', summary: 'Deals are qualified, active, and stage-supported.' };
    },
    verdict:
      'Pipeline inflation is emotionally useful and financially dangerous. The business cannot spend a probability, especially when the next step is missing.',
    whatAdviceLeavesOut:
      'Most pipeline forecasts multiply deal value by probability and stop. That misses decision-maker access, budget, next action, staleness, and cash timing.',
    sensitiveAssumptions: ['Close probability', 'Decision-maker access', 'Budget confirmation', 'Next step scheduled', 'Stale deals and payment timing'],
    commonTraps: ['Marking every deal as likely.', 'Keeping quiet deals in the forecast.', 'Ignoring expected payment date.'],
    betterNextMoves: {
      stable: 'Use the pipeline review as a weekly forecast hygiene habit.',
      tight: 'Confirm next steps and decision-maker access on soft deals.',
      fragile: 'Rebuild the pipeline around qualified opportunities before spending against it.',
      'not-ready': 'Remove stale, vague, or no-next-step deals from the forecast.',
      default: 'Make the pipeline earn its place in the forecast.',
    },
    realityCheckQuestions: ['Which deals have no next step?', 'Which close dates keep moving?', 'Is budget confirmed?', 'Who is the decision-maker?', 'When would cash arrive?'],
    methodologyMiniBlock:
      'The tool starts with weighted pipeline, then discounts it for qualification, decision-maker access, budget confirmation, next steps, staleness, and payment timing.',
    faqs: [
      { q: 'What is weighted pipeline?', a: 'Weighted pipeline multiplies deal value by close probability. Kefiw adjusts that further for quality and timing.' },
      { q: 'Is a proposal the same as pipeline?', a: 'Not unless the deal has a real next step, qualified need, budget, timing, and decision process.' },
      { q: 'How much pipeline do I need?', a: 'Enough realistic pipeline to cover the revenue target after probability, quality, timing, and churn replacement are counted.' },
    ],
  },
  'client-concentration-risk': {
    state: ({ values }) => {
      const revenue = toNumber(values, 'totalMonthlyRevenue');
      const largestPct = revenue > 0 ? toNumber(values, 'largestClientRevenue') / revenue : 0;
      const top3Pct = revenue > 0 ? toNumber(values, 'top3ClientRevenue') / revenue : 0;
      if (largestPct >= 0.45) return { state: 'not-ready', label: 'Exposed', summary: 'The business is overly dependent on one relationship.' };
      if (largestPct >= 0.3 || top3Pct >= 0.65) return { state: 'fragile', label: 'Concentrated', summary: 'Client loss would materially damage revenue.' };
      if (largestPct >= 0.2 || top3Pct >= 0.45) return { state: 'tight', label: 'Watchlist', summary: 'One or a few clients matter more than they should.' };
      return { state: 'stable', label: 'Diversified', summary: 'No single client dominates revenue.' };
    },
    verdict:
      'A big client can feel like safety because the invoice is large. Concentration turns one relationship into a business model, so it should be visible before hiring or spending.',
    whatAdviceLeavesOut:
      'Most revenue advice celebrates the big account. It rarely asks whether losing it would force layoffs, debt, owner-pay cuts, or panic selling.',
    sensitiveAssumptions: ['Largest client revenue', 'Top-3 revenue share', 'Gross margin by client', 'Replacement months', 'Payment timing'],
    commonTraps: ['Confusing a great client with a diversified base.', 'Hiring against revenue that one relationship controls.', 'Ignoring owner dependency inside the account.'],
    betterNextMoves: {
      stable: 'Maintain account health and avoid letting any client become too dominant.',
      tight: 'Build replacement pipeline before the next renewal date.',
      fragile: 'Delay fixed-cost commitments until concentration is reduced or cash reserve is stronger.',
      'not-ready': 'Treat this as a concentration-risk project before adding payroll or debt.',
      default: 'Model the largest-client loss case before spending.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['What percent of revenue comes from one client?', 'How long would replacement take?', 'What profit disappears?', 'When is the renewal date?', 'How much owner time is tied to this client?'],
    methodologyMiniBlock:
      'The calculator compares largest-client, top-3, and top-5 revenue with total revenue, then estimates profit at risk and replacement sales needs.',
    faqs: [
      { q: 'How much client concentration is too much?', a: 'There is no universal cutoff, but risk rises when one client can materially change owner pay, payroll, hiring, or survival decisions.' },
      { q: 'Should I fire a big client?', a: 'Not automatically. The point is to see the risk, build replacement options, and avoid spending as if revenue is diversified.' },
      { q: 'What if my biggest client is also my best client?', a: 'That can be true. It is still concentration risk if the business cannot absorb losing or replacing the account.' },
    ],
  },
  'cash-runway': {
    state: ({ values }) => {
      const outflows = toNumber(values, 'monthlyOperatingCosts') + toNumber(values, 'ownerPay') + toNumber(values, 'payroll') + toNumber(values, 'contractors') + toNumber(values, 'taxReserve') + toNumber(values, 'debtPayments');
      const stressCollected = Math.max(0, toNumber(values, 'expectedCollectedCash') * (1 - toNumber(values, 'revenueDropPct') / 100) - toNumber(values, 'clientLossRevenue'));
      const burn = Math.max(0, outflows + toNumber(values, 'emergencyExpenses') - stressCollected);
      const runway = burn > 0 ? toNumber(values, 'cashBalance') / burn : 99;
      if (runway < 1.5) return { state: 'not-ready', label: 'Critical', summary: 'Cash runway is too short for current commitments.' };
      if (runway < 3) return { state: 'fragile', label: 'Tight', summary: 'A bad month could force difficult decisions.' };
      if (runway < 6) return { state: 'tight', label: 'Watchlist', summary: 'The business needs tighter collection or reserve discipline.' };
      return { state: 'stable', label: 'Comfortable', summary: 'Cash can absorb normal disruption under the entered scenario.' };
    },
    verdict:
      'The forecast may look fine while cash timing is the issue. Revenue promised next month does not pay this month payroll, tax reserve, contractors, or owner draw.',
    whatAdviceLeavesOut:
      'Revenue and cash are not the same. Invoices, deposits, collections, taxes, payroll, and owner pay do not move on the same schedule.',
    sensitiveAssumptions: ['Available cash', 'Collected cash', 'Monthly outflows', 'Revenue drop', 'Client loss and emergency spend'],
    commonTraps: ['Using booked revenue as cash.', 'Forgetting tax reserve.', 'Planning payroll around perfect invoice timing.'],
    betterNextMoves: {
      stable: 'Set a reserve target and review runway monthly.',
      tight: 'Tighten collections and delay optional spending.',
      fragile: 'Build cash reserve or reduce commitments before a bad month arrives.',
      'not-ready': 'Pause new fixed costs and create a cash preservation plan.',
      default: 'Separate booked revenue from collected cash.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['How many months can cash carry payroll?', 'What happens if revenue drops 20 percent?', 'What if one client leaves?', 'Which outflows are fixed?', 'Which cash is tax reserve, not spendable cash?'],
    methodologyMiniBlock:
      'Runway is modeled as available cash divided by monthly cash burn, then stress-tested against revenue drop, client loss, and emergency spending.',
    faqs: [
      { q: 'How do I calculate cash runway?', a: 'Subtract collected cash from monthly outflows to find burn, then divide available cash by burn.' },
      { q: 'What if my business is profitable but cash feels tight?', a: 'Payment delay, tax reserve, payroll timing, deposits, and growth spending can make profit and cash feel different.' },
      { q: 'When should I delay hiring or spending?', a: 'When stress-case runway is short enough that a late invoice or lost client would threaten payroll, taxes, or owner pay.' },
    ],
  },
  'payment-delay-impact': {
    state: ({ values }) => {
      const invoiceVolume = toNumber(values, 'invoiceAmount') * toNumber(values, 'invoicesPerMonth');
      const delayed = invoiceVolume * toNumber(values, 'lateInvoicePct') / 100 * (1 - toNumber(values, 'depositPct') / 100);
      const obligations = toNumber(values, 'operatingCosts') + toNumber(values, 'payroll') + toNumber(values, 'taxReserve');
      const exposure = delayed * ((toNumber(values, 'paymentTermsDays') + toNumber(values, 'averageDaysLate')) / 30) / Math.max(1, obligations);
      if (exposure >= 0.75) return { state: 'not-ready', label: 'Dangerous', summary: 'Payment delays threaten payroll, taxes, or owner pay.' };
      if (exposure >= 0.35) return { state: 'fragile', label: 'Cash strain', summary: 'Late payments materially affect operations.' };
      if (exposure >= 0.15) return { state: 'tight', label: 'Annoying but workable', summary: 'Delays create friction but not major risk.' };
      return { state: 'stable', label: 'Low impact', summary: 'Payment delay is manageable under the entered assumptions.' };
    },
    verdict:
      'Late payment is not just annoying. It forces the business to finance the client delay while payroll, tax reserve, owner pay, and vendors keep moving.',
    whatAdviceLeavesOut:
      'Most revenue planning assumes clients pay when expected. Payment timing can turn profitable work into a cash problem.',
    sensitiveAssumptions: ['Invoice amount', 'Percent paid late', 'Days late', 'Deposit percentage', 'Monthly obligations'],
    commonTraps: ['Treating net-30 as cash today.', 'Avoiding deposits because the conversation feels awkward.', 'Letting one late invoice threaten payroll.'],
    betterNextMoves: {
      stable: 'Keep terms clear and monitor late-payment percentage.',
      tight: 'Use reminders and deposits before delays become normal.',
      fragile: 'Shorten terms, raise deposits, and reduce concentration.',
      'not-ready': 'Do not finance more client delay without cash reserve or stronger terms.',
      default: 'Model payment terms before pricing or delivery.',
    },
    realityCheckQuestions: ['Which clients pay late?', 'Could a deposit reduce exposure?', 'Does one invoice affect payroll?', 'Are reminders automatic?', 'Is collection delay in the forecast?'],
    methodologyMiniBlock:
      'The tool estimates delayed cash, working-capital need, and obligations exposed using invoice volume, late-payment rate, deposit protection, terms, and days late.',
    faqs: [
      { q: 'Should I require a deposit?', a: 'If delayed payment creates cash strain, a deposit can reduce exposure before delivery begins.' },
      { q: 'How do late payments affect cash runway?', a: 'They move collected cash later while payroll, tax reserve, owner pay, and expenses still arrive on schedule.' },
      { q: 'Is net 30 bad?', a: 'Not always. It becomes risky when the business lacks reserve, has concentration, or clients routinely pay beyond terms.' },
    ],
  },
  churn: {
    state: ({ values }) => {
      const current = toNumber(values, 'currentRevenue');
      const lost = current * (toNumber(values, 'churnPct') + toNumber(values, 'paymentFailurePct')) / 100 + toNumber(values, 'contractionRevenue');
      const expansion = current * toNumber(values, 'expansionPct') / 100 + lost * toNumber(values, 'saveRatePct') / 100;
      const newRevenue = toNumber(values, 'newRevenue');
      if (lost > newRevenue + expansion) return { state: 'not-ready', label: 'Growth trap', summary: 'Churn is high enough that acquisition may be masking a retention problem.' };
      if (lost > newRevenue) return { state: 'fragile', label: 'Leaking', summary: 'New sales are partly replacing lost revenue instead of growing.' };
      if (lost > current * 0.05) return { state: 'tight', label: 'Watchlist', summary: 'Churn is visible and needs monitoring.' };
      return { state: 'stable', label: 'Controlled', summary: 'Churn is visible and replacement burden is manageable.' };
    },
    verdict:
      'You may not need more growth yet. You may need less leakage. If new sales are mostly replacing churn, the business is running faster to stand still.',
    whatAdviceLeavesOut:
      'Most churn advice is written for SaaS dashboards, but churn also affects agencies, consultants, memberships, newsletters, retainers, and productized services.',
    sensitiveAssumptions: ['Customer churn', 'Revenue churn', 'Payment failures', 'Expansion revenue', 'Save and win-back rate'],
    commonTraps: ['Treating churn as only a SaaS metric.', 'Letting expansion hide bad retention.', 'Calling replacement revenue growth.'],
    betterNextMoves: {
      stable: 'Track churn, expansion, and replacement revenue monthly.',
      tight: 'Segment churn by customer type, acquisition source, and usage.',
      fragile: 'Fix onboarding, fit, support, payment recovery, or value before pushing acquisition harder.',
      'not-ready': 'Treat retention as the growth project.',
      default: 'Find the leak before adding more leads.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['Who is leaving?', 'Is churn voluntary or payment failure?', 'What expansion hides the leak?', 'How much new revenue only replaces churn?', 'Is support burden driving cancellations?'],
    methodologyMiniBlock:
      'The tool separates customer/revenue churn, payment failure, contraction, expansion, new revenue, and replacement pressure.',
    faqs: [
      { q: 'What is revenue churn?', a: 'Revenue churn is lost revenue divided by starting revenue. It can differ from customer churn if larger or smaller accounts leave.' },
      { q: 'What is net revenue retention?', a: 'It is starting revenue minus churn and contraction plus expansion, divided by starting revenue.' },
      { q: 'Is churn only a SaaS metric?', a: 'No. Any recurring client, retainer, membership, subscription, or productized service can have churn.' },
    ],
  },
  'churn-replacement': {
    state: ({ values }) => {
      const current = toNumber(values, 'currentRecurringRevenue');
      const netLost = Math.max(0, current * (toNumber(values, 'churnPct') + toNumber(values, 'paymentFailurePct')) / 100 + toNumber(values, 'contractionRevenue') - toNumber(values, 'expansionRevenue'));
      const burden = netLost / Math.max(1, current);
      if (burden >= 0.12) return { state: 'not-ready', label: 'Retention problem', summary: 'Growth is unlikely until churn improves.' };
      if (burden >= 0.07) return { state: 'fragile', label: 'Replacement-heavy', summary: 'New sales are mostly backfilling churn.' };
      if (burden >= 0.03) return { state: 'tight', label: 'Watchlist', summary: 'Replacement revenue is noticeable.' };
      return { state: 'stable', label: 'Low replacement burden', summary: 'Churn is not dominating growth.' };
    },
    verdict:
      'The first new sales do not create growth. They replace what churn already took. Growth starts after replacement revenue.',
    whatAdviceLeavesOut:
      'Churn consumes the future. Every dollar of replacement revenue is a dollar the business had to earn again before it actually grew.',
    sensitiveAssumptions: ['Churn rate', 'Contraction revenue', 'Payment failures', 'Expansion revenue', 'Average new deal size and close rate'],
    commonTraps: ['Celebrating new sales without subtracting churn.', 'Ignoring payment-failure churn.', 'Trying to acquire around a retention problem.'],
    betterNextMoves: {
      stable: 'Keep churn visible while growing.',
      tight: 'Track replacement revenue separately from growth revenue.',
      fragile: 'Prioritize retention work before increasing acquisition spend.',
      'not-ready': 'Fix churn before treating new sales as growth.',
      default: 'Separate replacement revenue from growth revenue.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['How much new revenue replaces churn?', 'What churn can be prevented?', 'How many leads are needed just to stay even?', 'What expansion offsets churn?', 'Is payment failure recoverable?'],
    methodologyMiniBlock:
      'The calculator estimates gross lost revenue, subtracts recovered and expansion revenue, then turns net replacement need into deals and leads.',
    faqs: [
      { q: 'How much revenue do I need to replace churn?', a: 'Add churn, contraction, and payment failures, then subtract expansion, saves, and win-backs.' },
      { q: 'Are new sales always growth?', a: 'No. New sales are growth only after they replace churned and contracted revenue.' },
      { q: 'Should I fix retention or acquisition first?', a: 'If replacement burden is high, retention usually improves growth quality before more acquisition.' },
    ],
  },
  'subscription-pricing': {
    state: ({ values }) => {
      const mrr = toNumber(values, 'subscribers') * toNumber(values, 'monthlyPrice');
      const support = toNumber(values, 'subscribers') * toNumber(values, 'supportCostPerCustomer');
      const grossProfit = mrr * toNumber(values, 'grossMarginPct') / 100 - support - mrr * toNumber(values, 'paymentFeePct') / 100;
      const contribution = grossProfit / Math.max(1, toNumber(values, 'subscribers'));
      const payback = contribution > 0 ? toNumber(values, 'acquisitionCost') / contribution : 99;
      if (contribution <= 0) return { state: 'not-ready', label: 'Underpriced subscription', summary: 'Price does not support support, churn, fees, and delivery cost.' };
      if (toNumber(values, 'churnPct') >= 8 || payback > 18) return { state: 'fragile', label: 'Churn-sensitive', summary: 'The model depends heavily on retention or slow payback.' };
      if (support > mrr * 0.2) return { state: 'tight', label: 'Support-heavy', summary: 'Revenue may be recurring, but labor cost is high.' };
      return { state: 'stable', label: 'Healthy recurring model', summary: 'Price, margin, churn, and support cost appear workable.' };
    },
    verdict:
      'Recurring revenue is only stable when customers keep finding value. Monthly billing does not magically create retention.',
    whatAdviceLeavesOut:
      'Most subscription pricing advice talks about MRR. That misses churn, payment failure, support cost, annual discount drag, CAC payback, and whether recurring revenue is actually recurring labor.',
    sensitiveAssumptions: ['Monthly price', 'Churn', 'Support cost per customer', 'Payment fees', 'Customer acquisition cost'],
    commonTraps: ['Offering annual discounts that destroy margin.', 'Ignoring support labor.', 'Treating subscribers as stable without usage or retention proof.'],
    betterNextMoves: {
      stable: 'Track churn, support cost, and annual-plan discount impact monthly.',
      tight: 'Reduce support burden or raise price before scaling.',
      fragile: 'Improve retention or CAC payback before leaning into acquisition.',
      'not-ready': 'Reprice or simplify the subscription before selling more.',
      default: 'Price recurring revenue against churn, support, and payback.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['What if customers cancel after three months?', 'How much support can the price afford?', 'Does annual discount hide churn?', 'What is CAC payback?', 'What breaks if payment failures rise?'],
    methodologyMiniBlock:
      'The tool estimates MRR, ARR, contribution margin, churn, support cost, payment fees, CAC payback, break-even subscriber count, and customer lifetime value.',
    faqs: [
      { q: 'How do I price a subscription?', a: 'Start with customer value, then check contribution margin after support, payment fees, churn, acquisition cost, and fixed costs.' },
      { q: 'Should I offer annual plans?', a: 'Annual plans can improve cash timing, but the discount should not hide churn or destroy margin.' },
      { q: 'What if customers cancel after three months?', a: 'Short lifetime reduces LTV and can make CAC payback and support costs unsustainable.' },
    ],
  },
  'retainer-stability': {
    state: ({ values }) => {
      const monthly = toNumber(values, 'retainerAmount') * toNumber(values, 'numberOfRetainers');
      const largestPct = toNumber(values, 'largestRetainerRevenue') / Math.max(1, monthly);
      const risk = toNumber(values, 'renewalRiskPct') / 100;
      const overService = toNumber(values, 'overServicingHours') * toNumber(values, 'hourlyValue') / Math.max(1, monthly);
      if (largestPct >= 0.45 || overService >= 0.3) return { state: 'not-ready', label: 'Mispriced', summary: 'Retainers include too much unpaid availability or concentration.' };
      if (largestPct >= 0.3 || risk >= 0.35 || toNumber(values, 'scopeClarityPct') < 60) return { state: 'fragile', label: 'Fragile', summary: 'One or two retainers dominate revenue or scope is weak.' };
      if (risk >= 0.2 || overService >= 0.15) return { state: 'tight', label: 'Watchlist', summary: 'Retainers are useful but need renewal or scope review.' };
      return { state: 'stable', label: 'Stable', summary: 'Retainers are diversified, scoped, and renewal-aware.' };
    },
    verdict:
      'A retainer is recurring, but not necessarily stable. Renewal, scope, utilization, payment timing, and client concentration decide how safe it really is.',
    whatAdviceLeavesOut:
      'Retainers feel safer than projects, but they can hide over-servicing, unclear boundaries, renewal cliffs, and dependence on a few relationships.',
    sensitiveAssumptions: ['Retainer amount', 'Number of retainers', 'Largest retainer', 'Over-servicing hours', 'Scope clarity and renewal risk'],
    commonTraps: ['Selling unlimited availability.', 'Ignoring over-servicing.', 'Treating a renewal cliff as stable revenue.'],
    betterNextMoves: {
      stable: 'Review utilization and renewal dates before each quarter.',
      tight: 'Clarify scope and reduce over-servicing before renewal.',
      fragile: 'Diversify retainers or rebuild scope before relying on the revenue.',
      'not-ready': 'Reprice, rescope, or convert the retainer into defined work.',
      default: 'Check scope, utilization, renewal, and concentration.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['Which retainer dominates revenue?', 'How much unpaid availability is included?', 'When are renewals?', 'Is utilization healthy?', 'Is this really project work in disguise?'],
    methodologyMiniBlock:
      'The calculator scores retainer revenue using concentration, renewal risk, utilization, over-servicing cost, scope clarity, payment delay, and replacement time.',
    faqs: [
      { q: 'Is retainer revenue stable?', a: 'Only if renewal, scope, utilization, payment, and client dependency are controlled.' },
      { q: 'What is over-servicing?', a: 'It is work beyond the retainer economics, often caused by unclear scope, unlimited access, or weak boundaries.' },
      { q: 'What if one retainer cancels?', a: 'Run the client concentration and cash runway tools to see replacement time and cash impact.' },
    ],
  },
  'expansion-vs-new-sales': {
    state: ({ values }) => {
      const current = toNumber(values, 'currentRevenue');
      const expansion = current * toNumber(values, 'expansionOpportunityPct') / 100 * toNumber(values, 'upgradeRatePct') / 100;
      const price = current * toNumber(values, 'priceIncreasePct') / 100;
      const churn = current * toNumber(values, 'churnPct') / 100;
      if (churn > expansion + price) return { state: 'not-ready', label: 'Retention first', summary: 'Churn must improve before expansion matters.' };
      if (expansion + price > toNumber(values, 'newCustomerRevenue') * 0.75) return { state: 'stable', label: 'Expansion opportunity', summary: 'Existing customers can drive meaningful growth.' };
      if (price > expansion) return { state: 'tight', label: 'Pricing opportunity', summary: 'Price/value mismatch may be limiting growth.' };
      return { state: 'fragile', label: 'New sales driven', summary: 'Acquisition is the main growth lever, but cost and cycle need scrutiny.' };
    },
    verdict:
      'Not all growth has to come from new logos. Sometimes the next revenue lever is retention, expansion, packaging, win-backs, or price.',
    whatAdviceLeavesOut:
      'New customers are exciting, but existing customers may be cheaper to expand if value, packaging, and retention are healthy.',
    sensitiveAssumptions: ['Expansion opportunity', 'Upgrade rate', 'Price increase', 'Churn', 'Acquisition cost'],
    commonTraps: ['Ignoring existing customers.', 'Increasing price without retention context.', 'Spending on acquisition while churn leaks value.'],
    betterNextMoves: {
      stable: 'Build an expansion or packaging plan for existing customers.',
      tight: 'Test pricing and packaging before buying more leads.',
      fragile: 'Compare acquisition cost with expansion cost before choosing the growth lever.',
      'not-ready': 'Fix retention before expansion or acquisition.',
      default: 'Compare acquisition with expansion after churn replacement.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['Which customers could expand?', 'Is churn under control?', 'What does acquisition cost?', 'Can price move without trust damage?', 'What win-backs are realistic?'],
    methodologyMiniBlock:
      'The calculator compares net expansion, price increase, win-back revenue, churn loss, acquisition cost, and net new-sales value.',
    faqs: [
      { q: 'Is expansion revenue cheaper than new sales?', a: 'Often, but only if retention is healthy and the expansion offer creates real value.' },
      { q: 'What if churn is high?', a: 'Then retention usually comes first because new and expansion revenue may only replace what was lost.' },
      { q: 'Can price increases be a growth lever?', a: 'Yes, when value and trust support the change and churn risk is modeled.' },
    ],
  },
  'operating-leverage': {
    state: ({ values }) => {
      const revenue = toNumber(values, 'revenue');
      const profit = revenue - toNumber(values, 'fixedCosts') - revenue * toNumber(values, 'variableCostPct') / 100;
      const nextRevenue = revenue * (1 + toNumber(values, 'revenueGrowthPct') / 100);
      const nextFixed = toNumber(values, 'fixedCosts') * (1 + toNumber(values, 'fixedCostGrowthPct') / 100) + toNumber(values, 'requiredHireCost');
      const nextProfit = nextRevenue - nextFixed - nextRevenue * toNumber(values, 'variableCostPct') / 100 - toNumber(values, 'growthInvestment');
      if (nextProfit < profit) return { state: 'not-ready', label: 'Negative leverage', summary: 'Growth adds complexity or cost faster than profit.' };
      if (toNumber(values, 'capacityUtilizationPct') >= 90) return { state: 'fragile', label: 'Capacity constrained', summary: 'Growth requires new people or tools before profit improves.' };
      if (nextProfit - profit < (nextRevenue - revenue) * 0.15) return { state: 'tight', label: 'Neutral', summary: 'Growth helps, but costs rise alongside revenue.' };
      return { state: 'stable', label: 'Leverage improving', summary: 'Revenue growth improves profit faster than costs.' };
    },
    verdict:
      'Revenue growth is not automatically business improvement. If every new dollar requires more labor, tools, support, or owner attention, growth may make the business heavier.',
    whatAdviceLeavesOut:
      'Operating leverage sounds abstract, but operators feel it as the difference between growth that creates breathing room and growth that creates a bigger version of the same stress.',
    sensitiveAssumptions: ['Fixed costs', 'Variable costs', 'Growth investment', 'Required hires/tools', 'Capacity utilization'],
    commonTraps: ['Adding fixed costs before revenue arrives.', 'Ignoring delivery capacity.', 'Calling owner overtime profit.'],
    betterNextMoves: {
      stable: 'Protect the cost structure and monitor margin as revenue grows.',
      tight: 'Find which cost rises with revenue and redesign it.',
      fragile: 'Solve the capacity bottleneck before assuming growth improves profit.',
      'not-ready': 'Pause growth spend until the model creates profit, not only activity.',
      default: 'Test growth against fixed costs, variable costs, and capacity.',
    },
    assumptionModes: revenueModes,
    realityCheckQuestions: ['What cost rises before revenue arrives?', 'Does growth require a hire?', 'Is owner time the bottleneck?', 'Does margin improve?', 'Does cash timing support the plan?'],
    methodologyMiniBlock:
      'The calculator compares current profit with a growth scenario after variable costs, fixed-cost growth, required hires/tools, and upfront investment.',
    faqs: [
      { q: 'What is operating leverage?', a: 'It is the relationship between revenue growth and profit growth after fixed and variable costs.' },
      { q: 'How can revenue grow while profit stays flat?', a: 'Delivery cost, payroll, support, software, marketing, or owner time may rise nearly as fast as revenue.' },
      { q: 'What is negative operating leverage?', a: 'It means growth adds cost or complexity faster than it adds profit.' },
    ],
  },
  'saas-cost': {
    state: ({ values }) => {
      const base = toNumber(values, 'baseToolsMonthly');
      const seatSpend = toNumber(values, 'seats') * toNumber(values, 'pricePerSeat');
      const duplicate = toNumber(values, 'duplicateToolsMonthly');
      const monthly = base + seatSpend + duplicate;
      const unused = seatSpend * toNumber(values, 'unusedSeatPct') / 100;
      const wasteRatio = monthly > 0 ? (unused + duplicate) / monthly : 0;
      if (monthly <= 0) {
        return { state: 'not-ready', summary: 'Enter real software spend before using this as a stack audit.' };
      }
      if (wasteRatio >= 0.25 || unused + duplicate > 1500) {
        return { state: 'fragile', label: 'Waste likely', summary: 'Unused seats or duplicate tools are large enough to audit before renewals.' };
      }
      if (wasteRatio >= 0.1 || monthly > 5000) {
        return { state: 'tight', label: 'Watchlist', summary: 'Renewals, low-usage seats, or ownership need review before spend becomes permanent.' };
      }
      return { state: 'stable', label: 'Clean stack', summary: 'Spend looks manageable if tools have owners and renewal dates.' };
    },
    verdict:
      'The biggest issue may not be the tool price. It may be ownership. If nobody owns renewals, seat cleanup, duplicate tools, and usage review, software quietly becomes permanent overhead.',
    sensitiveAssumptions: ['Paid seats', 'Unused seat percentage', 'Duplicate tools', 'Annual price increases', 'Renewal and cancellation terms'],
    commonTraps: [
      'Counting only active subscriptions, not renewal commitments.',
      'Forgetting unused seats.',
      'Ignoring duplicate tools.',
      'Assuming every plan can be cancelled immediately.',
    ],
    betterNextMoves: {
      stable: 'Assign tool owners and renewal dates.',
      tight: 'Review unused seats before annual renewals.',
      fragile: 'Consolidate duplicate tools and freeze new subscriptions until ownership is clear.',
      'not-ready': 'Inventory tools, seats, owners, and renewal terms before buying more software.',
      default: 'Start with seat cleanup, duplicate workflows, and renewal dates.',
    },
    scenarioPresets: [
      { label: 'Solo operator stack', description: 'Small base stack with a few subscriptions.', values: { baseToolsMonthly: 450, seats: 1, pricePerSeat: 45, unusedSeatPct: 0, duplicateToolsMonthly: 80, priceIncreasePct: 10 } },
      { label: '5-person startup', description: 'Early stack with some seat waste.', values: { baseToolsMonthly: 950, seats: 22, pricePerSeat: 38, unusedSeatPct: 15, duplicateToolsMonthly: 250, priceIncreasePct: 12 } },
      { label: '20-person agency', description: 'Seat-heavy tools and duplicate workflow risk.', values: { baseToolsMonthly: 2600, seats: 85, pricePerSeat: 44, unusedSeatPct: 22, duplicateToolsMonthly: 700, priceIncreasePct: 10 } },
      { label: '50-seat team', description: 'Governance and renewal risk become material.', values: { baseToolsMonthly: 6200, seats: 240, pricePerSeat: 36, unusedSeatPct: 18, duplicateToolsMonthly: 1600, priceIncreasePct: 8 } },
      { label: 'AI-heavy product team', description: 'Higher tool cost and faster price creep.', values: { baseToolsMonthly: 4800, seats: 70, pricePerSeat: 65, unusedSeatPct: 20, duplicateToolsMonthly: 1300, priceIncreasePct: 18 } },
      { label: 'Renewal cleanup', description: 'Audit before annual billing locks in.', values: { baseToolsMonthly: 3200, seats: 120, pricePerSeat: 50, unusedSeatPct: 30, duplicateToolsMonthly: 900, priceIncreasePct: 15 } },
    ],
    assumptionModes: saasModes,
    realityCheckQuestions: [
      'Who owns each tool?',
      'When does each contract renew?',
      'Which seats are inactive?',
      'Which tools overlap?',
      'Which tools save time, and which tools add work?',
    ],
    methodologyMiniBlock:
      'This calculator adds base subscriptions, paid seats, unused-seat exposure, duplicate-tool spend, and renewal price increases. It is a spend audit frame, not a vendor contract model.',
    faqs: [
      { q: 'How do I calculate total SaaS spend?', a: 'Start with base subscriptions, add per-seat spend, then separate unused seats, duplicate tools, annual commitments, support tiers, and price increases.' },
      { q: 'Should I cancel duplicate tools?', a: 'Only after you identify the workflow owner and migration path. Duplicate tools are waste only when one can be removed without breaking work.' },
      { q: 'How do annual contracts change SaaS cost?', a: 'Annual contracts can lock in waste, limit cancellation, and create renewal deadlines. They should be reviewed before the auto-renewal window.' },
      { q: 'How do I know whether software is worth keeping?', a: 'A tool should have an owner, active users, a clear workflow, measurable value, and a renewal decision date.' },
    ],
  },
  'software-roi': {
    state: ({ values }) => {
      const grossHoursValue = toNumber(values, 'hoursSavedWeek') * toNumber(values, 'hourlyValue') * 4.33;
      const reviewCost = toNumber(values, 'reviewHoursWeek') * toNumber(values, 'hourlyValue') * 4.33;
      const adoptedValue = grossHoursValue * toNumber(values, 'adoptionPct') / 100;
      const monthlyCost = toNumber(values, 'monthlyCost') + reviewCost + toNumber(values, 'setupCost') / 12;
      const net = adoptedValue + toNumber(values, 'errorReductionMonthly') - monthlyCost;
      if (net < 0) {
        return { state: 'not-ready', summary: 'The tool does not pay back under the current adoption, review, and cost assumptions.' };
      }
      if (toNumber(values, 'adoptionPct') < 50 || reviewCost > adoptedValue * 0.4) {
        return { state: 'fragile', summary: 'ROI depends on adoption improving and review work staying under control.' };
      }
      if (net < monthlyCost * 0.5) {
        return { state: 'tight', summary: 'The tool may pay back, but the margin of safety is modest.' };
      }
      return { state: 'stable', summary: 'The tool appears to pay back if the workflow actually changes and old work disappears.' };
    },
    verdict:
      'Do not count saved time until the old work actually disappears. If the tool adds review, maintenance, prompt cleanup, exceptions, or vendor lock-in, the sales-demo ROI is not the real ROI.',
    whatAdviceLeavesOut:
      'Most software ROI advice counts time saved before adoption, review time, migration cost, maintenance, and workflow change. That is why tools can look profitable in demos and still make the business heavier.',
    sensitiveAssumptions: ['Hours saved before review', 'Review and maintenance hours', 'Adoption rate', 'Setup or migration cost', 'Error or rework reduction'],
    commonTraps: [
      'Counting saved time before adoption is real.',
      'Ignoring review and maintenance work.',
      'Keeping the old workflow while adding a new tool.',
      'Treating AI output as free of quality-control cost.',
    ],
    betterNextMoves: {
      stable: 'Pilot the tool against one workflow and remove the old work if the pilot succeeds.',
      tight: 'Demand a shorter contract, smaller rollout, or clearer success metric.',
      fragile: 'Reduce review time and adoption risk before signing an annual commitment.',
      'not-ready': 'Do not buy yet. Simplify the workflow or run a manual test first.',
      default: 'Measure the workflow, not the sales pitch.',
    },
    scenarioPresets: [
      { label: 'AI writing/review tool', description: 'Saves drafting time but adds review.', values: { monthlyCost: 180, setupCost: 800, hoursSavedWeek: 6, reviewHoursWeek: 3, hourlyValue: 85, adoptionPct: 70, errorReductionMonthly: 150 } },
      { label: 'Automation platform', description: 'Meaningful setup and maintenance.', values: { monthlyCost: 900, setupCost: 6500, hoursSavedWeek: 16, reviewHoursWeek: 4, hourlyValue: 95, adoptionPct: 60, errorReductionMonthly: 400 } },
      { label: 'CRM cleanup', description: 'Moderate saved time and lower lost follow-up.', values: { monthlyCost: 650, setupCost: 4500, hoursSavedWeek: 10, reviewHoursWeek: 2, hourlyValue: 90, adoptionPct: 65, errorReductionMonthly: 800 } },
      { label: 'Analytics tool', description: 'High insight value but adoption risk.', values: { monthlyCost: 1200, setupCost: 8000, hoursSavedWeek: 8, reviewHoursWeek: 3, hourlyValue: 110, adoptionPct: 45, errorReductionMonthly: 1000 } },
      { label: 'Support AI assistant', description: 'Large time savings, meaningful QA.', values: { monthlyCost: 1500, setupCost: 10000, hoursSavedWeek: 25, reviewHoursWeek: 8, hourlyValue: 70, adoptionPct: 65, errorReductionMonthly: 1200 } },
    ],
    assumptionModes: softwareRoiModes,
    realityCheckQuestions: [
      'What old work disappears if this tool works?',
      'Who reviews the output?',
      'What adoption rate is realistic after the first month?',
      'What happens if the tool creates more exceptions?',
      'Can you exit the contract if the workflow does not change?',
    ],
    methodologyMiniBlock:
      'This calculator values time saved, discounts that value by real adoption, subtracts review and maintenance time, adds setup cost, then compares the result to tool cost. ROI is not real until the workflow changes.',
    situationLinks: [
      { label: 'If this replaces human work', href: '/business/hire-vs-automate-calculator/', note: 'Compare automation against contractor or employee paths.' },
      { label: 'If this is one more subscription', href: '/business/saas-cost-calculator/', note: 'Add it to the full stack cost.' },
      { label: 'If the workflow is messy', href: '/business/cloud-exit-calculator/', note: 'Check exit and migration cost before lock-in.' },
    ],
    faqs: [
      { q: 'How do I calculate software ROI?', a: 'Value the time or errors the tool actually removes, discount by adoption, then subtract subscription, setup, review, and maintenance cost.' },
      { q: 'What if automation saves time but adds review work?', a: 'Review work must be subtracted. A tool that shifts work from doing to checking can still be useful, but the ROI is smaller.' },
      { q: 'Should I count AI output as saved time?', a: 'Only count the portion that survives review and replaces work you would otherwise do or pay for.' },
      { q: 'When is software ROI negative?', a: 'When adoption is low, setup is high, review work is heavy, or the old workflow remains alongside the new tool.' },
    ],
  },
  'software-spend-health': {
    state: ({ values }) => {
      const adoption = toNumber(values, 'adoptionPct');
      const ownerless = toNumber(values, 'ownerlessToolPct');
      const unused = toNumber(values, 'unusedSeatPct');
      const duplicates = toNumber(values, 'duplicateCategories');
      if (ownerless >= 35 || unused >= 35 || duplicates >= 6) return { state: 'not-ready', label: 'Stack sprawl', summary: 'Tools may be creating permanent overhead without clear value or ownership.' };
      if (ownerless >= 22 || unused >= 25 || duplicates >= 4) return { state: 'fragile', label: 'Leaky stack', summary: 'Waste, overlap, or weak ownership is likely.' };
      if (adoption < 70 || ownerless >= 12) return { state: 'tight', label: 'Watchlist', summary: 'Stack is mostly healthy but needs renewal or usage cleanup.' };
      return { state: 'stable', label: 'Healthy stack', summary: 'Tools look owned, used, and tied to real workflows.' };
    },
    verdict:
      'A healthy stack is not just a cheap stack. It is owned, used, renewal-aware, and tied to work the business actually needs.',
    whatAdviceLeavesOut:
      'Most SaaS cleanup advice starts with cancellation. The better first step is accountability: owner, workflow, data, renewal date, exit plan, and the reason the tool still earns its place.',
    sensitiveAssumptions: ['Active usage', 'Ownerless spend', 'Duplicate categories', 'Renewal windows', 'Usage-based charges'],
    commonTraps: ['Buying tools before assigning owners.', 'Treating small monthly tools as harmless.', 'Cleaning seats without reviewing contracts.'],
    betterNextMoves: {
      stable: 'Keep owner and renewal reviews on a fixed cadence.',
      tight: 'Review renewals, inactive seats, and ownerless tools before the next purchase.',
      fragile: 'Assign owners and consolidate duplicate categories before adding new software.',
      'not-ready': 'Freeze new tools until the stack has owners, renewal dates, and keep/cut decisions.',
      default: 'Turn the score into a software audit worksheet.',
    },
    assumptionModes: saasModes,
    realityCheckQuestions: ['Who owns each tool?', 'What renewal comes next?', 'Which tools overlap?', 'Which tools are usage-based?', 'Which tool would be hard to exit?'],
    methodologyMiniBlock:
      'This score combines stack cost, utilization, ownerless spend, duplicate categories, adoption, renewal pressure, and contract flexibility. It is a governance signal, not a contract review.',
    doesNotDo: ['It does not determine contract rights or licensing compliance.', 'It does not prove a tool should be cancelled.', 'It does not replace vendor-specific terms review.', 'It does help identify cleanup priorities.'],
    situationLinks: [
      { label: 'If seats look wasteful', href: '/business/seat-cost-calculator/', note: 'Audit inactive, admin, contractor, and committed seats.' },
      { label: 'If renewals are close', href: '/business/saas-renewal-risk-calculator/', note: 'Find action windows before auto-renewal.' },
      { label: 'If tools overlap', href: '/business/duplicate-tool-audit/', note: 'Check duplicate workflows and source-of-truth conflicts.' },
    ],
    faqs: [
      { q: 'What makes a software stack healthy?', a: 'Clear owners, active users, renewal dates, contract visibility, and tools tied to real workflows.' },
      { q: 'Should we cancel every low-usage tool?', a: 'No. Check contract terms, data needs, compliance needs, and workflow ownership before cancelling.' },
      { q: 'How often should we audit software spend?', a: 'At least before major renewals, budget cycles, hiring changes, or new-tool purchases.' },
    ],
  },
  'seat-cost': {
    state: ({ values }) => {
      const seats = toNumber(values, 'seats');
      const active = toNumber(values, 'activeSeats');
      const utilization = seats > 0 ? active / seats : 0;
      if (toString(values, 'contractRisk') === 'high' && utilization < 0.75) return { state: 'not-ready', label: 'Contract risk', summary: 'Waste exists but may not be immediately cancellable.' };
      if (utilization < 0.65) return { state: 'fragile', label: 'Waste likely', summary: 'Seat waste is meaningful relative to spend.' };
      if (utilization < 0.85) return { state: 'tight', label: 'Cleanup needed', summary: 'Some inactive or over-permissioned seats exist.' };
      return { state: 'stable', label: 'High utilization', summary: 'Seats appear actively used.' };
    },
    verdict:
      'The seat is inactive, but the cost is active. Review access before renewal, not after the contract locks in.',
    whatAdviceLeavesOut:
      'Unused seats are easy to understand but not always easy to remove. Annual contracts, minimum seats, true-up rules, and admin access needs can make cleanup more complicated than cancel what nobody uses.',
    sensitiveAssumptions: ['Active seats', 'Minimum seat commitment', 'True-down terms', 'Admin seats', 'Renewal timing'],
    commonTraps: ['Assuming unused seats are immediately cancellable.', 'Removing access before checking compliance or continuity needs.', 'Ignoring contractor and admin seats.'],
    betterNextMoves: {
      stable: 'Keep a seat review before every renewal.',
      tight: 'Clean up inactive, contractor, and over-permissioned seats before the next contract date.',
      fragile: 'Negotiate or reduce seats before renewal if the contract allows it.',
      'not-ready': 'Confirm true-down and cancellation rights before booking savings.',
      default: 'Use the result to build a renewal action list.',
    },
    assumptionModes: saasModes,
    realityCheckQuestions: ['Which seats are inactive?', 'Which seats are required for audit or admin continuity?', 'Can seats true down mid-term?', 'When is renewal?', 'Who approves access removal?'],
    methodologyMiniBlock:
      'This calculator compares purchased seats with active, admin, contractor, over-permissioned, and committed seats. It estimates exposure, not guaranteed savings.',
    faqs: [
      { q: 'Can I cancel unused seats immediately?', a: 'Only if the vendor terms allow it. Some contracts allow true-ups without easy true-downs.' },
      { q: 'Should admin seats count differently?', a: 'Yes. Admin or audit seats may be necessary even if they are not active daily.' },
      { q: 'What is healthy seat utilization?', a: 'It depends on the tool and contract, but low utilization should trigger renewal review.' },
    ],
  },
  'saas-renewal-risk': {
    state: ({ values }) => {
      const months = toNumber(values, 'renewalWindowMonths');
      const owner = toString(values, 'ownerAssigned');
      const active = toNumber(values, 'activeSeats');
      const seats = toNumber(values, 'seats');
      const unusedPct = seats > 0 ? ((seats - active) / seats) * 100 : 0;
      if (months <= 1 || owner === 'no') return { state: 'not-ready', label: 'Urgent', summary: 'Cancellation or negotiation window may close soon.' };
      if (months <= 3 || unusedPct >= 30) return { state: 'fragile', label: 'High risk', summary: 'Cost, usage, or ownership is unclear before renewal.' };
      if (months <= 6 || unusedPct >= 15) return { state: 'tight', label: 'Review soon', summary: 'Decision window is approaching.' };
      return { state: 'stable', label: 'Low risk', summary: 'Tool is owned and renewal timing is visible.' };
    },
    verdict:
      'SaaS waste often happens before the invoice. The expensive moment is the missed renewal window, not the month someone finally notices the tool is underused.',
    sensitiveAssumptions: ['Renewal date', 'Cancellation notice period', 'Active seats', 'Owner assignment', 'Price increase'],
    commonTraps: ['Waiting until the invoice arrives.', 'Missing cancellation notice dates.', 'Treating annual contracts like monthly subscriptions.'],
    betterNextMoves: {
      stable: 'Put the tool on the renewal calendar.',
      tight: 'Assign an owner and review usage before the notice deadline.',
      fragile: 'Start seat cleanup and vendor review now.',
      'not-ready': 'Escalate renewal ownership and contract review immediately.',
      default: 'Turn the renewal into a decision date with an owner.',
    },
    scenarioPresets: [
      { label: 'Annual renewal in 60 days', description: 'Usage and ownership need quick review.', values: { monthlyCost: 1800, renewalWindowMonths: 2, cancellationNoticeDays: 60, seats: 70, activeSeats: 46, priceIncreasePct: 12, ownerAssigned: 'partial' } },
      { label: 'Ownerless auto-renewal', description: 'Nobody clearly owns the decision.', values: { monthlyCost: 900, renewalWindowMonths: 1, cancellationNoticeDays: 30, seats: 35, activeSeats: 30, priceIncreasePct: 8, ownerAssigned: 'no' } },
    ],
    assumptionModes: saasModes,
    realityCheckQuestions: ['Who owns renewal?', 'What is the cancellation deadline?', 'What seats are inactive?', 'Can we downgrade?', 'What breaks if we leave?'],
    methodologyMiniBlock:
      'This tool combines cost, renewal timing, notice period, usage, price increase, switching effort, and ownership into a renewal risk signal.',
    faqs: [
      { q: 'What date matters besides the renewal date?', a: 'The cancellation notice deadline, negotiation window, price-increase notice, and owner approval date.' },
      { q: 'What is SaaS shelfware?', a: 'Paid software or seats that are not being meaningfully used.' },
      { q: 'How do annual contracts change the math?', a: 'They can lock in waste and move the real decision earlier than the invoice.' },
    ],
  },
  'duplicate-tool-audit': {
    state: ({ values }) => {
      const categories = toNumber(values, 'duplicateCategories');
      const conflicts = toNumber(values, 'sourceOfTruthConflicts');
      const overlap = toNumber(values, 'duplicateToolsMonthly');
      if (conflicts >= 3) return { state: 'not-ready', label: 'Workflow conflict', summary: 'Duplicate tools are creating process confusion.' };
      if (categories >= 4 || overlap >= 1500) return { state: 'fragile', label: 'Consolidation candidate', summary: 'One or more duplicates may be removed after workflow review.' };
      if (categories >= 1) return { state: 'tight', label: 'Benign overlap', summary: 'Some overlap may be justified by team needs.' };
      return { state: 'stable', label: 'Clean categories', summary: 'Minimal tool overlap.' };
    },
    verdict:
      'Duplicate tools are not only a cost problem. They create duplicate sources of truth, fragmented processes, unclear ownership, and arguments about where work really lives.',
    sensitiveAssumptions: ['Overlap cost', 'Source-of-truth conflicts', 'Consolidation labor', 'User adoption', 'Switching difficulty'],
    commonTraps: ['Cancelling a tool before moving data.', 'Keeping two sources of truth.', 'Letting team preference hide process confusion.'],
    betterNextMoves: {
      stable: 'Keep category ownership visible.',
      tight: 'Document why overlap is justified.',
      fragile: 'Choose consolidation candidates and estimate migration labor.',
      'not-ready': 'Resolve the source-of-truth conflict before renewing both tools.',
      default: 'Map duplicated workflows before cancelling anything.',
    },
    realityCheckQuestions: ['Which tool is the source of truth?', 'Who owns the workflow?', 'What data must move?', 'What team behavior changes?', 'What contract blocks consolidation?'],
    methodologyMiniBlock:
      'This tool combines duplicate category count, overlap cost, seat cost, source-of-truth conflicts, and consolidation labor to size the cleanup opportunity.',
    faqs: [
      { q: 'Are duplicate tools always bad?', a: 'No. They are a problem when they duplicate workflows, create conflicting data, or renew without a clear reason.' },
      { q: 'What should we consolidate first?', a: 'Start with categories where usage is low, ownership is weak, data is portable, and source-of-truth conflicts are high.' },
    ],
  },
  'software-stack-ownership': {
    state: ({ values }) => {
      const renewal = toNumber(values, 'renewalOwnerPct');
      const exit = toNumber(values, 'exitPlanPct');
      if (renewal < 40 || exit < 20) return { state: 'not-ready', label: 'Risky', summary: 'Tool controls data or workflow without clear ownership.' };
      if (renewal < 60 || exit < 40) return { state: 'fragile', label: 'Ownerless', summary: 'Tools may renew or drift without accountability.' };
      if (renewal < 80 || exit < 60) return { state: 'tight', label: 'Partly owned', summary: 'Ownership exists, but renewal/data/process gaps remain.' };
      return { state: 'stable', label: 'Owned', summary: 'Tool accountability is clear.' };
    },
    verdict:
      'A tool without an owner is not neutral. It can keep billing, hold important data, create access risk, and become part of a workflow nobody understands well enough to remove.',
    sensitiveAssumptions: ['Renewal owner coverage', 'Data owner coverage', 'Exit plan coverage', 'Review cadence', 'Closest renewal window'],
    commonTraps: ['Assigning only a technical owner.', 'Forgetting renewal ownership.', 'Letting data live in tools nobody can exit.'],
    betterNextMoves: {
      stable: 'Keep owner assignments current after headcount or workflow changes.',
      tight: 'Fill renewal, data, or exit-plan gaps before the next review.',
      fragile: 'Assign owners to the most expensive or data-sensitive tools first.',
      'not-ready': 'Create an owner list before buying or renewing more software.',
      default: 'Give every tool a person, purpose, renewal date, and exit plan.',
    },
    realityCheckQuestions: ['Who owns budget?', 'Who owns renewal?', 'Who owns data?', 'Who owns offboarding?', 'Who can decide to remove the tool?'],
    methodologyMiniBlock:
      'This score weights business, technical, renewal, data, and exit ownership, then adjusts for review cadence and renewal urgency.',
    faqs: [
      { q: 'Does every tool need multiple owners?', a: 'Not always multiple people, but every tool needs clear responsibility for budget, usage, data, renewal, and offboarding.' },
      { q: 'What is the first ownership gap to fix?', a: 'Renewal ownership. It prevents missed cancellation windows and accidental lock-in.' },
    ],
  },
  'cloud-cost': {
    state: ({ values }) => {
      const transfer = toNumber(values, 'dataTransferMonthly');
      const logging = toNumber(values, 'loggingMonthly');
      const ai = toNumber(values, 'aiApiMonthly');
      const base =
        toNumber(values, 'computeMonthly') +
        toNumber(values, 'storageMonthly') +
        transfer +
        toNumber(values, 'databaseMonthly') +
        logging +
        ai +
        toNumber(values, 'supportMonthly');
      if (base <= 0) return { state: 'not-ready', label: 'Architecture review', summary: 'Enter cloud cost categories before trusting the output.' };
      if (toNumber(values, 'growthPct') >= 75 || transfer + logging + ai > base * 0.35) return { state: 'fragile', label: 'Shock-prone', summary: 'Usage-based costs could spike quickly.' };
      if (toNumber(values, 'growthPct') >= 30 || transfer + logging + ai > base * 0.2) return { state: 'tight', label: 'Watchlist', summary: 'Growth, transfer, logging, or AI/API usage could raise the bill.' };
      return { state: 'stable', label: 'Predictable', summary: 'Costs are understandable and tied to usage.' };
    },
    verdict:
      'This bill is not just a finance number. It is a product behavior number. Customer usage, architecture, logging, storage retention, AI calls, and data transfer all show up as cloud cost.',
    sensitiveAssumptions: ['Compute usage', 'Storage growth', 'Data transfer', 'Logging/observability', 'AI/API usage'],
    commonTraps: ['Optimizing after the bill instead of before scale.', 'Ignoring data transfer and logging.', 'Counting cloud as fixed when product usage makes it variable.'],
    betterNextMoves: {
      stable: 'Track cost per customer, tenant, or transaction.',
      tight: 'Add alerts for transfer, logging, and AI/API growth.',
      fragile: 'Run a bill-shock scenario before scaling the feature.',
      'not-ready': 'Break the bill into service categories before making architecture decisions.',
      default: 'Turn the bill into product and engineering questions.',
    },
    assumptionModes: cloudGrowthModes,
    realityCheckQuestions: ['What cost grows with each user?', 'What cost grows with logs or retention?', 'Which data leaves the provider?', 'Which AI calls scale with usage?', 'What alerts would catch a spike?'],
    methodologyMiniBlock:
      'This calculator models compute, storage, transfer, database, logging, AI/API, support, environments, growth, overrun, commitments, and cost per customer. It is not a provider bill predictor.',
    faqs: [
      { q: 'Why did my cloud bill increase?', a: 'Usually because traffic, storage, logs, data transfer, AI/API usage, support, or architecture changed.' },
      { q: 'What cloud costs grow with users?', a: 'Compute, storage, database operations, logs, data transfer, API calls, and AI inference can all scale with usage.' },
      { q: 'When is cloud optimization better than exit?', a: 'When the issue is idle resources, commitments, logging, storage retention, or architecture inside the current provider.' },
    ],
  },
  'cloud-bill-shock': {
    state: ({ values }) => {
      const shockGrowth = toNumber(values, 'trafficGrowthPct') + toNumber(values, 'dataTransferGrowthPct') + toNumber(values, 'aiApiGrowthPct');
      const current = toNumber(values, 'currentMonthlyCloud');
      const revenue = Math.max(1, toNumber(values, 'monthlyRevenue'));
      if (current / revenue > 0.15 || shockGrowth > 275) return { state: 'not-ready', label: 'Margin danger', summary: 'Cloud cost growth could damage unit economics.' };
      if (shockGrowth > 180) return { state: 'fragile', label: 'Shock-prone', summary: 'Usage growth could create a large bill jump.' };
      if (shockGrowth > 100) return { state: 'tight', label: 'Watchlist', summary: 'One or two categories may spike.' };
      return { state: 'stable', label: 'Controlled', summary: 'Growth does not meaningfully threaten margin.' };
    },
    verdict:
      'A cloud bill shock is rarely one thing. It is often traffic, logging, storage retention, AI/API usage, data transfer, and missing alerts stacking into one invoice.',
    assumptionModes: cloudGrowthModes,
    sensitiveAssumptions: ['Traffic growth', 'Data transfer growth', 'Logging growth', 'AI/API growth', 'Incident spike case'],
    commonTraps: ['No budget alerts.', 'Logging everything forever.', 'Launching AI features without cost per action.', 'Forgetting data-heavy customer behavior.'],
    betterNextMoves: {
      stable: 'Add category-level monitoring and keep unit economics visible.',
      tight: 'Set alerts for the two fastest-growing categories.',
      fragile: 'Review architecture and usage limits before the next launch.',
      'not-ready': 'Pause scaling assumptions until cost drivers are measured.',
      default: 'Model the surprise before the invoice.',
    },
    realityCheckQuestions: ['What category would spike first?', 'What alert would catch it?', 'What is cost per customer after the spike?', 'Which feature causes the usage?', 'What can be capped?'],
    methodologyMiniBlock:
      'This simulator weights traffic, storage, transfer, logging, AI/API usage, and incident spikes against the current bill and revenue margin.',
    faqs: [
      { q: 'What if cloud usage doubles?', a: 'Run the categories separately. Doubling traffic may not double every service, but transfer, logging, database, and AI/API usage can move quickly.' },
      { q: 'How do logging and storage create surprise bills?', a: 'Retention, verbosity, replication, snapshots, and unbounded event volume can keep growing after the feature ships.' },
    ],
  },
  'cloud-unit-economics': {
    state: ({ values }) => {
      const cost = toNumber(values, 'monthlyCloudSpend') / Math.max(1, toNumber(values, 'customers'));
      const revenue = toNumber(values, 'revenuePerCustomer');
      if (revenue > 0 && cost > revenue * 0.25) return { state: 'not-ready', label: 'Pricing/architecture issue', summary: 'Product economics may need redesign.' };
      if (revenue > 0 && cost > revenue * 0.18) return { state: 'fragile', label: 'Margin drag', summary: 'Cost-to-serve is eating margin.' };
      if (revenue > 0 && cost > revenue * 0.1) return { state: 'tight', label: 'Watchlist', summary: 'Unit cost needs monitoring as usage grows.' };
      return { state: 'stable', label: 'Healthy unit cost', summary: 'Cost-to-serve supports margin.' };
    },
    verdict:
      'Cloud cost does not matter only in total. It matters per customer, per transaction, per tenant, or per AI action.',
    sensitiveAssumptions: ['Customer count', 'Transaction count', 'AI assists', 'Revenue per customer', 'Cost allocation'],
    commonTraps: ['Revenue grows while cost-to-serve grows faster.', 'Allocating all cloud cost evenly when workloads differ.', 'Ignoring AI cost per action.'],
    betterNextMoves: {
      stable: 'Track unit cost monthly and watch cohort differences.',
      tight: 'Add cost allocation by product, customer segment, or workflow.',
      fragile: 'Review pricing, architecture, or usage limits.',
      'not-ready': 'Do not scale a product path until cost-to-serve is understood.',
      default: 'Turn total cloud spend into unit economics.',
    },
    assumptionModes: cloudGrowthModes,
    realityCheckQuestions: ['What is the right unit?', 'Which customers are expensive to serve?', 'Does usage align with price?', 'What is cost per AI assist?', 'What happens as customers grow?'],
    methodologyMiniBlock:
      'This tool divides monthly cloud spend by customers, users, transactions, tenants, and AI assists, then compares cost per customer with revenue and margin.',
    faqs: [
      { q: 'Why calculate cloud cost per customer?', a: 'It shows whether growth is improving or weakening margin.' },
      { q: 'What unit should I use?', a: 'Use the unit closest to value: customer, tenant, transaction, case, API call, or AI action.' },
    ],
  },
  'cloud-commitment-risk': {
    state: ({ values }) => {
      const stability = toNumber(values, 'usageStabilityPct');
      const downsizing = toNumber(values, 'downsizingRiskPct');
      const proposed = toNumber(values, 'proposedCommitmentMonthly');
      const spend = toNumber(values, 'onDemandMonthlySpend');
      if (proposed > spend * 0.8 || stability < 45 || downsizing > 45) return { state: 'not-ready', label: 'Too variable', summary: 'Discount may become waste.' };
      if (proposed > spend * 0.6 || stability < 65 || downsizing > 30) return { state: 'fragile', label: 'Partial commitment', summary: 'Some usage is stable, but not all.' };
      if (toNumber(values, 'existingCommitmentsMonthly') > spend * 0.25) return { state: 'tight', label: 'Existing overlap', summary: 'Current commitments need review before buying more.' };
      return { state: 'stable', label: 'Good candidate', summary: 'Usage is stable enough to support commitment.' };
    },
    verdict:
      'Commitments feel like savings because the discount is visible. The risk is less visible: usage changes, architecture changes, regions change, workloads move, or the team overcommits to a pattern that stops being true.',
    sensitiveAssumptions: ['Usage stability', 'Proposed commitment size', 'Term length', 'Downsizing risk', 'Existing commitments'],
    commonTraps: ['Committing to unstable workloads.', 'Ignoring existing commitments.', 'Buying discounts because the rate looks attractive.'],
    betterNextMoves: {
      stable: 'Commit only the stable base load and keep alerts on utilization.',
      tight: 'Review existing commitments before adding more.',
      fragile: 'Use a smaller or shorter commitment.',
      'not-ready': 'Wait until usage stabilizes or architecture decisions settle.',
      default: 'Match commitments to measured base load.',
    },
    assumptionModes: cloudGrowthModes,
    realityCheckQuestions: ['Which workload is stable?', 'What happens if usage drops?', 'Can the commitment move regions or families?', 'What commitments already exist?', 'What architecture changes are planned?'],
    methodologyMiniBlock:
      'This calculator compares on-demand spend with proposed and existing commitments, discount rate, utilization, growth, downsizing risk, and term length.',
    faqs: [
      { q: 'When are cloud commitments worth it?', a: 'When usage is stable enough that utilization stays high across the term.' },
      { q: 'What is the commitment mistake?', a: 'Treating the discount as guaranteed savings while ignoring usage changes and underutilization.' },
    ],
  },
  'ai-tool-roi': {
    state: ({ values }) => {
      const saved = toNumber(values, 'minutesSavedPerTask');
      const review = toNumber(values, 'reviewMinutesPerTask');
      const adoption = toNumber(values, 'adoptionPct');
      if (toString(values, 'customerSensitivity') === 'high' && review < saved * 0.5) return { state: 'not-ready', label: 'Too risky', summary: 'Output risk is too high for the modeled review level.' };
      if (review >= saved || adoption < 35) return { state: 'fragile', label: 'AI theater', summary: 'Tool is interesting but not economically useful yet.' };
      if (review >= saved * 0.5 || adoption < 60) return { state: 'tight', label: 'Review drag', summary: 'Review or adoption consumes much of the savings.' };
      return { state: 'stable', label: 'Real ROI', summary: 'Tool changes workflow and saves net time/value.' };
    },
    verdict:
      'Most AI ROI advice counts the demo, not the workday. The real number includes prompting, reviewing, correcting, training, policy, security, and whether the team actually changes the workflow.',
    sensitiveAssumptions: ['Adoption rate', 'Review time', 'Correction/error cost', 'Task volume', 'Workflow redesign'],
    commonTraps: ['Counting saved time before review time.', 'Ignoring security review.', 'Keeping the old workflow and adding AI on top.', 'Treating model output as final.'],
    betterNextMoves: {
      stable: 'Pilot, measure actual review time, then remove old work if the pilot succeeds.',
      tight: 'Reduce review drag or improve adoption before scaling.',
      fragile: 'Keep the tool in test mode until workflow economics are real.',
      'not-ready': 'Do not scale until risk, review, and governance are clear.',
      default: 'Measure cost per successful task, not demo time saved.',
    },
    assumptionModes: aiRoiModes,
    realityCheckQuestions: ['What workflow changes?', 'Who reviews output?', 'What error is unacceptable?', 'What is adoption after novelty fades?', 'What data can the tool see?'],
    methodologyMiniBlock:
      'This calculator values AI-assisted tasks, subtracts review, correction, access, API, implementation, and risk costs, then discounts value by adoption.',
    faqs: [
      { q: 'Should I count review time?', a: 'Yes. Review and correction are part of the AI workflow cost.' },
      { q: 'What is adoption-adjusted ROI?', a: 'ROI after discounting for the share of users and tasks where the tool is actually used.' },
      { q: 'When is an AI subscription not worth it?', a: 'When review, errors, security work, or low adoption consume the savings.' },
    ],
  },
  'ai-token-cost': {
    state: ({ values }) => {
      const growth = toNumber(values, 'growthPct');
      const retry = toNumber(values, 'retryPct');
      const output = toNumber(values, 'outputTokens');
      const input = toNumber(values, 'inputTokens');
      if (growth >= 150 || retry >= 35) return { state: 'fragile', label: 'Scale risk', summary: 'Cost rises sharply with usage.' };
      if (growth >= 50 || retry >= 20 || output > input * 1.5) return { state: 'tight', label: 'Watchlist', summary: 'Usage, context, or output growth may raise cost.' };
      return { state: 'stable', label: 'Controlled', summary: 'Token/API cost scales predictably.' };
    },
    verdict:
      'AI cost is not only model price. It is prompt length, output length, retries, context, tool calls, cache behavior, review workflows, and whether the expensive model is being used for the right task.',
    sensitiveAssumptions: ['Input tokens', 'Output tokens', 'Requests per user', 'Retry rate', 'Cache hit rate'],
    commonTraps: ['Long context windows everywhere.', 'Retries hiding prompt failures.', 'Using expensive models for simple tasks.', 'Ignoring output length.'],
    betterNextMoves: {
      stable: 'Set budget alerts and track cost per request.',
      tight: 'Test shorter prompts, cached context, and lower-cost models.',
      fragile: 'Instrument usage before scaling the AI feature.',
      'not-ready': 'Choose a model and pricing page before quoting the feature.',
      default: 'Track cost per task, user, and successful outcome.',
    },
    assumptionModes: aiTokenModes,
    realityCheckQuestions: ['How long is context?', 'How long is output?', 'How often do retries happen?', 'Can prompts be cached?', 'Is this model overkill?'],
    methodologyMiniBlock:
      'This tool multiplies input and output tokens by request volume, users, retries, cache behavior, provider token price, and growth assumptions.',
    faqs: [
      { q: 'How do token costs scale?', a: 'By input length, output length, request volume, retries, and model price.' },
      { q: 'What is cost per AI task?', a: 'Total AI cost divided by the task or successful outcome the model supports.' },
    ],
  },
  'cloud-exit': {
    state: ({ values }) => {
      const current = toNumber(values, 'currentMonthlyCloud');
      const target = toNumber(values, 'targetMonthlyCost');
      const savings = current - target;
      const exitCost =
        toNumber(values, 'egressTb') * toNumber(values, 'egressPerTb') +
        toNumber(values, 'migrationHours') * toNumber(values, 'hourlyRate') +
        current * toNumber(values, 'dualRunMonths') +
        toNumber(values, 'refactorCost') +
        toNumber(values, 'commitmentRemaining') +
        toNumber(values, 'downtimeRiskCost') +
        toNumber(values, 'retrainingCost');
      const payback = savings > 0 ? exitCost / savings : Infinity;
      if (!Number.isFinite(payback) || payback > 30) return { state: 'not-ready', label: 'Too risky', summary: 'Migration risk or labor outweighs savings.' };
      if (toNumber(values, 'commitmentRemaining') > exitCost * 0.25) return { state: 'fragile', label: 'Contract-blocked', summary: 'Commitments or terms delay the decision.' };
      if (payback > 18) return { state: 'tight', label: 'Review candidate', summary: 'Exit may be worth deeper technical analysis.' };
      return { state: 'stable', label: 'Strong candidate', summary: 'Savings justify migration exploration.' };
    },
    verdict:
      'Cloud exit is not a cancellation button. It is an engineering project with financial consequences.',
    whatAdviceLeavesOut:
      'Most cloud-exit debates become ideological. Kefiw keeps it boring: what does it cost to move, what does it cost to stay, what risks appear during the move, and how long until savings become real?',
    sensitiveAssumptions: ['Migration labor', 'Data transfer policy', 'Dual-running time', 'Refactoring', 'Remaining commitments'],
    commonTraps: ['Ignoring parallel environments.', 'Treating data transfer relief as total exit cost relief.', 'Forgetting retraining and operating model changes.'],
    betterNextMoves: {
      stable: 'Write a cloud exit decision memo and run deeper technical review.',
      tight: 'Optimize current spend first and rerun payback.',
      fragile: 'Review commitments and contract timing before exit planning.',
      'not-ready': 'Do not treat exit as savings until migration labor and risk are visible.',
      default: 'Compare optimize-first, migrate, and stay-put scenarios.',
    },
    assumptionModes: cloudGrowthModes,
    realityCheckQuestions: ['What has to be refactored?', 'How long will parallel environments run?', 'What commitments remain?', 'Who runs the new environment?', 'What downtime risk is acceptable?'],
    methodologyMiniBlock:
      'This tool compares current and target run cost, then adds migration labor, data transfer, refactoring, dual-run, commitments, downtime risk, and retraining to estimate payback.',
    faqs: [
      { q: 'Are cloud egress fees gone?', a: 'No universal assumption is safe. Some providers have specific transfer-relief programs, but migration labor, contracts, refactoring, and downtime still matter.' },
      { q: 'When should I optimize before exiting?', a: 'When idle resources, commitments, logging, storage, or architecture changes can produce savings faster than migration.' },
    ],
  },
  'subscription-crossover': {
    state: ({ values }) => {
      const months = toNumber(values, 'expectedMonths');
      const lifetime = toNumber(values, 'lifetimePrice') + toNumber(values, 'lifetimeRiskCost');
      const monthly = toNumber(values, 'monthlyPrice');
      const crossover = monthly > 0 ? lifetime / monthly : Infinity;
      if (months < crossover * 0.75) return { state: 'stable', label: 'Subscription better', summary: 'Flexibility is worth more than commitment.' };
      if (months >= crossover && toNumber(values, 'lifetimeRiskCost') < lifetime * 0.25) return { state: 'tight', label: 'Lifetime may work', summary: 'Long usage and low vendor risk support commitment.' };
      if (toNumber(values, 'lifetimeRiskCost') > lifetime * 0.35) return { state: 'fragile', label: 'Lifetime trap', summary: 'The deal may create clutter or support/update risk.' };
      return { state: 'tight', label: 'Review terms', summary: 'Vendor restrictions matter more than price.' };
    },
    verdict:
      'Lifetime pricing is only cheaper if the tool stays useful long enough. A lifetime deal for a workflow you have not proven is not savings. It is prepaid clutter.',
    sensitiveAssumptions: ['Expected usage duration', 'Price increases', 'Lifetime restrictions', 'Support/update rights', 'Cancellation value'],
    commonTraps: ['Buying permanence for an unproven workflow.', 'Ignoring support and update exclusions.', 'Treating optionality as worthless.'],
    betterNextMoves: {
      stable: 'Stay monthly until the workflow is proven.',
      tight: 'Read lifetime restrictions before committing.',
      fragile: 'Avoid lifetime unless the workflow and vendor risk are clearer.',
      'not-ready': 'Do not buy until expected usage and exit risk are known.',
      default: 'Compare price with flexibility and vendor risk.',
    },
    realityCheckQuestions: ['Will the workflow still matter?', 'Are updates included?', 'Can data export cleanly?', 'What happens if support ends?', 'Would monthly cancellation be valuable?'],
    methodologyMiniBlock:
      'This calculator compares monthly, annual, and lifetime totals, then adjusts for expected usage, price increases, and lifetime risk.',
    faqs: [
      { q: 'Is lifetime software always cheaper?', a: 'Only if the tool stays useful long enough and the plan includes the support and updates you need.' },
      { q: 'When is monthly pricing better?', a: 'When the workflow is unproven, vendor risk is high, or the ability to cancel is valuable.' },
    ],
  },
};

const depthBySlug: Record<string, DepthOverride> = {
  'minimum-viable-freelance-rate-calculator': depthByKind['freelance-rate'] ?? {},
  's-corp-tax-savings-calculator': depthByKind['s-corp'] ?? {},
  'llc-vs-s-corp-calculator': depthByKind['s-corp'] ?? {},
  'reasonable-salary-planner': depthByKind['reasonable-salary'] ?? {},
  's-corp-break-even-stress-test': depthByKind['s-corp-break-even'] ?? {},
  'payroll-burden-calculator': depthByKind['payroll-burden'] ?? {},
  'contractor-vs-employee-calculator': depthByKind['contractor-employee'] ?? {},
  'hire-vs-automate-calculator': depthByKind['hire-automate'] ?? {},
  'revenue-forecast-calculator': depthByKind['revenue-forecast'] ?? {},
  'revenue-fragility-score': depthByKind['revenue-fragility'] ?? {},
  'sales-target-calculator': depthByKind['sales-target'] ?? {},
  'sales-pipeline-reality-check': depthByKind['sales-pipeline-reality'] ?? {},
  'client-concentration-risk-calculator': depthByKind['client-concentration-risk'] ?? {},
  'small-business-cash-runway-calculator': depthByKind['cash-runway'] ?? {},
  'payment-delay-impact-calculator': depthByKind['payment-delay-impact'] ?? {},
  'churn-calculator': depthByKind.churn ?? {},
  'churn-replacement-calculator': depthByKind['churn-replacement'] ?? {},
  'subscription-pricing-calculator': depthByKind['subscription-pricing'] ?? {},
  'retainer-stability-calculator': depthByKind['retainer-stability'] ?? {},
  'expansion-vs-new-sales-calculator': depthByKind['expansion-vs-new-sales'] ?? {},
  'operating-leverage-calculator': depthByKind['operating-leverage'] ?? {},
  'saas-cost-calculator': depthByKind['saas-cost'] ?? {},
  'software-spend-health-score': depthByKind['software-spend-health'] ?? {},
  'seat-cost-calculator': depthByKind['seat-cost'] ?? {},
  'saas-renewal-risk-calculator': depthByKind['saas-renewal-risk'] ?? {},
  'duplicate-tool-audit': depthByKind['duplicate-tool-audit'] ?? {},
  'software-stack-ownership-scorecard': depthByKind['software-stack-ownership'] ?? {},
  'software-roi-calculator': depthByKind['software-roi'] ?? {},
  'ai-tool-roi-calculator': depthByKind['ai-tool-roi'] ?? {},
  'ai-token-cost-calculator': depthByKind['ai-token-cost'] ?? {},
  'cloud-cost-calculator': depthByKind['cloud-cost'] ?? {},
  'cloud-bill-shock-simulator': depthByKind['cloud-bill-shock'] ?? {},
  'cloud-unit-economics-calculator': depthByKind['cloud-unit-economics'] ?? {},
  'cloud-commitment-risk-calculator': depthByKind['cloud-commitment-risk'] ?? {},
  'cloud-exit-calculator': depthByKind['cloud-exit'] ?? {},
  'subscription-vs-lifetime-crossover-calculator': depthByKind['subscription-crossover'] ?? {},
};

function mergeDepth(base: CalculatorDepthProfile, ...overrides: Array<DepthOverride | undefined>): CalculatorDepthProfile {
  return overrides.reduce<CalculatorDepthProfile>((acc, override) => {
    if (!override) return acc;
    return { ...acc, ...override };
  }, base);
}

export function getBusinessCalculatorDepth(page: VerticalCalculatorPage): CalculatorDepthProfile | null {
  if (page.area !== 'business') return null;
  return mergeDepth(genericBusinessDepth, groupDepth[page.group], depthByKind[page.kind], depthBySlug[page.slug]);
}

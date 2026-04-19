// Deterministic mortgage and loan math. No locale-dependent arithmetic.

export function monthlyPayment(loan: number, annualRatePct: number, termYears: number): number {
  const n = Math.max(1, Math.round(termYears * 12));
  if (loan <= 0) return 0;
  if (annualRatePct <= 0) return loan / n;
  const r = annualRatePct / 100 / 12;
  const pow = Math.pow(1 + r, n);
  return (loan * r * pow) / (pow - 1);
}

export interface LifetimeTotals {
  paymentPI: number;
  totalPI: number;
  totalInterest: number;
  months: number;
}

export function lifetimeTotals(loan: number, annualRatePct: number, termYears: number): LifetimeTotals {
  const months = Math.max(1, Math.round(termYears * 12));
  const paymentPI = monthlyPayment(loan, annualRatePct, termYears);
  const totalPI = paymentPI * months;
  return {
    paymentPI,
    totalPI,
    totalInterest: Math.max(0, totalPI - loan),
    months,
  };
}

export interface SimParams {
  loan: number;
  annualRatePct: number;
  termYears: number;
  extraMonthly?: number;
  oneTimeExtra?: number;
  oneTimeMonth?: number;       // 1-based absolute month
  annualExtra?: number;
  annualExtraMonth?: number;   // 1..12 calendar-style anchor (relative to start)
  maxMonths?: number;
}

export interface SimResult {
  months: number;
  totalInterest: number;
  totalPrincipal: number;
  totalPaid: number;
  endBalance: number;
  cappedOut: boolean;
}

export function simulatePayoff(params: SimParams): SimResult {
  const {
    loan,
    annualRatePct,
    termYears,
    extraMonthly = 0,
    oneTimeExtra = 0,
    oneTimeMonth = 1,
    annualExtra = 0,
    annualExtraMonth = 12,
    maxMonths,
  } = params;

  const schedMonths = Math.max(1, Math.round(termYears * 12));
  const cap = maxMonths ?? schedMonths + 24;
  const r = annualRatePct <= 0 ? 0 : annualRatePct / 100 / 12;
  const paymentPI = monthlyPayment(loan, annualRatePct, termYears);

  let balance = loan;
  let month = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;

  while (balance > 0.005 && month < cap) {
    month += 1;
    const interest = balance * r;
    const schedPrincipal = Math.max(0, paymentPI - interest);
    let extra = extraMonthly;
    if (oneTimeExtra > 0 && month === oneTimeMonth) extra += oneTimeExtra;
    if (annualExtra > 0 && ((month - annualExtraMonth) % 12 + 12) % 12 === 0) extra += annualExtra;
    const principalRaw = schedPrincipal + extra;
    const principal = Math.min(principalRaw, balance);
    totalInterest += interest;
    totalPrincipal += principal;
    balance -= principal;
  }

  return {
    months: month,
    totalInterest,
    totalPrincipal,
    totalPaid: totalInterest + totalPrincipal,
    endBalance: Math.max(0, balance),
    cappedOut: balance > 0.005,
  };
}

const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return USD.format(n);
}

export function formatMonthsAsYearsMonths(months: number): string {
  const m = Math.max(0, Math.round(months));
  const y = Math.floor(m / 12);
  const rem = m - y * 12;
  if (y === 0) return `${rem}m`;
  if (rem === 0) return `${y}y`;
  return `${y}y ${rem}m`;
}

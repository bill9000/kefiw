import { useMemo, useState } from 'react';
import { formatCurrency, formatMonthsAsYearsMonths } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

interface SimInput {
  target: number;
  current: number;
  monthly: number;
  annualGrowthPct: number;
}

interface SimOut {
  months: number;
  totalContributions: number;
  growthContribution: number;
  endBalance: number;
  cappedOut: boolean;
}

const MAX_MONTHS = 600;

function simulate({ target, current, monthly, annualGrowthPct }: SimInput): SimOut {
  if (current >= target) {
    return { months: 0, totalContributions: 0, growthContribution: 0, endBalance: current, cappedOut: false };
  }
  const r = annualGrowthPct <= 0 ? 0 : annualGrowthPct / 100 / 12;
  let balance = current;
  let months = 0;
  let totalContributions = 0;
  while (balance < target && months < MAX_MONTHS) {
    months += 1;
    balance *= 1 + r;
    balance += monthly;
    totalContributions += monthly;
  }
  const growthContribution = balance - current - totalContributions;
  return {
    months,
    totalContributions,
    growthContribution,
    endBalance: balance,
    cappedOut: balance < target,
  };
}

function goalDate(months: number): string {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + months, now.getDate());
  return d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

export default function SavingsGoalCalculator() {
  const [target, setTarget] = useState('20000');
  const [current, setCurrent] = useState('5000');
  const [monthly, setMonthly] = useState('500');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [growth, setGrowth] = useState('5');

  type ParseResult =
    | { kind: 'error'; error: string }
    | { kind: 'goal-reached'; target: number; current: number; monthly: number; growth: number }
    | { kind: 'ok'; target: number; current: number; monthly: number; growth: number };

  const parsed = useMemo<ParseResult>(() => {
    const t = parseFloat(target);
    const c = parseFloat(current) || 0;
    const m = parseFloat(monthly) || 0;
    const g = parseFloat(growth) || 0;
    if (!Number.isFinite(t) || t <= 0) return { kind: 'error', error: 'Enter a target amount.' };
    if (c < 0 || m < 0 || g < 0) return { kind: 'error', error: 'Amounts must be non-negative.' };
    if (c >= t) return { kind: 'goal-reached', target: t, current: c, monthly: m, growth: g };
    if (m === 0 && g === 0) return { kind: 'error', error: 'With no monthly contribution and no growth, you cannot reach the goal.' };
    return { kind: 'ok', target: t, current: c, monthly: m, growth: g };
  }, [target, current, monthly, growth]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field id="t" label="Target amount ($)" value={target} onChange={setTarget} />
          <Field id="c" label="Current savings ($)" value={current} onChange={setCurrent} />
          <Field id="m" label="Monthly contribution ($)" value={monthly} onChange={setMonthly} />
        </div>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
          onClick={() => setShowAdvanced((x) => !x)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide growth rate' : 'Add an annual growth rate →'}
        </button>
        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field id="g" label="Annual growth rate %" value={growth} onChange={setGrowth} step="0.1" />
            <p className="mt-6 text-xs text-slate-500">Contributions are applied at end of month, then monthly growth compounds.</p>
          </div>
        )}
      </div>

      {parsed.kind === 'error' && (
        <div className="card border-amber-200 bg-amber-50 text-sm text-amber-900">{parsed.error}</div>
      )}

      {parsed.kind === 'goal-reached' && (
        <div className="card border-emerald-200 bg-emerald-50 text-sm text-emerald-900">
          Goal already reached — your current savings ({formatCurrency(parsed.current)}) is at or above target ({formatCurrency(parsed.target)}).
        </div>
      )}

      {parsed.kind === 'ok' && (
        <Results target={parsed.target} current={parsed.current} monthly={parsed.monthly} growth={parsed.growth} />
      )}
    </div>
  );
}

interface ResultsProps { target: number; current: number; monthly: number; growth: number; }

function Results({ target, current, monthly, growth }: ResultsProps) {
  const current$sim = simulate({ target, current, monthly, annualGrowthPct: growth });

  if (current$sim.cappedOut) {
    return (
      <div className="card border-amber-200 bg-amber-50 text-sm text-amber-900">
        Goal not reached within 50 years at this contribution and growth. Try increasing monthly contribution, growth rate, or lowering the target.
      </div>
    );
  }

  const plus50 = simulate({ target, current, monthly: monthly + 50, annualGrowthPct: growth });
  const plus100 = simulate({ target, current, monthly: monthly + 100, annualGrowthPct: growth });
  const noGrowth = simulate({ target, current, monthly, annualGrowthPct: 0 });

  const growthShare = current$sim.endBalance > 0
    ? current$sim.growthContribution / (current$sim.endBalance - current)
    : 0;
  const currentHelps = target > 0 ? current / target : 0;

  const monthsSavedPlus50 = Math.max(0, current$sim.months - plus50.months);
  const monthsSavedPlus100 = Math.max(0, current$sim.months - plus100.months);

  const cards: MaybeCard[] = [
    {
      kind: 'summary',
      text: `${formatCurrency(target)} in ${formatMonthsAsYearsMonths(current$sim.months)} — target date around ${goalDate(current$sim.months)}.`,
    },
    {
      kind: 'stats',
      items: [
        { label: 'Months to goal', value: formatMonthsAsYearsMonths(current$sim.months) },
        { label: 'Goal date', value: goalDate(current$sim.months) },
        { label: 'Contributions', value: formatCurrency(current$sim.totalContributions) },
        ...(growth > 0 ? [
          { label: 'From growth', value: formatCurrency(current$sim.growthContribution) },
          { label: 'Growth share', value: `${(growthShare * 100).toFixed(1)}%` },
        ] : []),
        { label: 'Already saved', value: `${(currentHelps * 100).toFixed(1)}% of target` },
      ],
    },
    monthly > 0 ? {
      kind: 'takeaway',
      text: `Each extra $50/month moves your goal about ${formatMonthsAsYearsMonths(monthsSavedPlus50)} sooner.`,
    } : null,
    growth > 0 ? {
      kind: 'takeaway',
      text: `At ${growth}% annual growth, investment growth contributes about ${formatCurrency(current$sim.growthContribution)} to the final total.`,
    } : null,
    {
      kind: 'comparison',
      title: 'Speed up the plan',
      columns: [
        {
          title: 'Current',
          items: [
            `Months: ${formatMonthsAsYearsMonths(current$sim.months)}`,
            `Contrib: ${formatCurrency(current$sim.totalContributions)}`,
          ],
        },
        {
          title: '+$50/mo',
          items: [
            `Months: ${formatMonthsAsYearsMonths(plus50.months)}`,
            `Saved: ${formatMonthsAsYearsMonths(monthsSavedPlus50)}`,
          ],
        },
        {
          title: '+$100/mo',
          items: [
            `Months: ${formatMonthsAsYearsMonths(plus100.months)}`,
            `Saved: ${formatMonthsAsYearsMonths(monthsSavedPlus100)}`,
          ],
        },
      ],
    },
    growth > 0 ? {
      kind: 'comparison',
      title: 'Growth vs no growth',
      columns: [
        {
          title: `${growth}% growth`,
          items: [
            `Months: ${formatMonthsAsYearsMonths(current$sim.months)}`,
            `Contrib: ${formatCurrency(current$sim.totalContributions)}`,
            `Growth: ${formatCurrency(current$sim.growthContribution)}`,
          ],
        },
        {
          title: '0% growth',
          items: [
            `Months: ${formatMonthsAsYearsMonths(noGrowth.months)}`,
            `Contrib: ${formatCurrency(noGrowth.totalContributions)}`,
          ],
        },
      ],
    } : null,
    {
      kind: 'nextStep',
      actions: [
        { href: '/calculators/break-even-calculator/', label: 'Break-even Calculator' },
        { href: '/calculators/mortgage-calculator/', label: 'Mortgage Calculator' },
        { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
      ],
    },
  ];

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="card border-emerald-200 bg-emerald-50 text-center">
          <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Time to goal</div>
          <div className="mt-1 text-3xl font-bold text-emerald-900">{formatMonthsAsYearsMonths(current$sim.months)}</div>
          <div className="text-xs text-emerald-700">Goal date ~ {goalDate(current$sim.months)}</div>
        </div>
        <div className="card text-center">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">You contribute</div>
          <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(current$sim.totalContributions)}</div>
          {growth > 0 && (
            <div className="text-xs text-slate-500">Plus {formatCurrency(current$sim.growthContribution)} from growth</div>
          )}
        </div>
      </div>
      <OutcomeLayer cards={cards} />
    </>
  );
}

interface FieldProps { id: string; label: string; value: string; onChange: (v: string) => void; step?: string; }
function Field({ id, label, value, onChange, step }: FieldProps) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} type="number" inputMode="decimal" className="input" value={value} onChange={(e) => onChange(e.target.value)} step={step} />
    </div>
  );
}

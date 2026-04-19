import { useMemo, useState } from 'react';
import {
  simulatePayoff,
  formatCurrency,
  formatMonthsAsYearsMonths,
} from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

export default function MortgageExtraPaymentCalculator() {
  const [loan, setLoan] = useState('320000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('30');
  const [extraMonthly, setExtraMonthly] = useState('200');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [oneTimeExtra, setOneTimeExtra] = useState('0');
  const [oneTimeMonth, setOneTimeMonth] = useState('1');
  const [annualExtra, setAnnualExtra] = useState('0');
  const [annualExtraMonth, setAnnualExtraMonth] = useState('12');

  const parsed = useMemo(() => {
    const L = parseFloat(loan) || 0;
    const r = parseFloat(rate);
    const t = parseFloat(term);
    const ex = parseFloat(extraMonthly) || 0;
    const ote = parseFloat(oneTimeExtra) || 0;
    const otm = parseInt(oneTimeMonth, 10) || 1;
    const ae = parseFloat(annualExtra) || 0;
    const aem = parseInt(annualExtraMonth, 10) || 12;

    if (L <= 0) return { error: 'Enter a loan amount.' as const };
    if (!Number.isFinite(r) || r < 0) return { error: 'Enter a valid interest rate.' as const };
    if (!Number.isFinite(t) || t <= 0) return { error: 'Enter a loan term.' as const };
    if (ex < 0 || ote < 0 || ae < 0) return { error: 'Extra payments must be non-negative.' as const };

    return {
      loan: L,
      rate: r,
      term: t,
      extraMonthly: ex,
      oneTimeExtra: ote,
      oneTimeMonth: Math.max(1, otm),
      annualExtra: ae,
      annualExtraMonth: Math.min(12, Math.max(1, aem)),
    };
  }, [loan, rate, term, extraMonthly, oneTimeExtra, oneTimeMonth, annualExtra, annualExtraMonth]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="loan" label="Loan amount ($)" value={loan} onChange={setLoan} />
          <Field id="rate" label="Interest rate (%)" value={rate} onChange={setRate} step="0.01" />
          <Field id="term" label="Original term (years)" value={term} onChange={setTerm} step="1" />
          <Field id="extra" label="Extra monthly payment ($)" value={extraMonthly} onChange={setExtraMonthly} />
        </div>

        <button
          type="button"
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
          onClick={() => setShowAdvanced((x) => !x)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide advanced options' : 'Add one-time / annual extra payments →'}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field id="ote" label="One-time extra payment ($)" value={oneTimeExtra} onChange={setOneTimeExtra} />
            <Field id="otm" label="Applied on month #" value={oneTimeMonth} onChange={setOneTimeMonth} step="1" />
            <Field id="ae" label="Annual extra payment ($)" value={annualExtra} onChange={setAnnualExtra} />
            <Field id="aem" label="Applied each year at month (1–12)" value={annualExtraMonth} onChange={setAnnualExtraMonth} step="1" />
          </div>
        )}
      </div>

      {'error' in parsed ? (
        <div className="card border-amber-200 bg-amber-50 text-sm text-amber-900">{parsed.error}</div>
      ) : (
        <Results {...parsed} />
      )}
    </div>
  );
}

interface ResultsProps {
  loan: number;
  rate: number;
  term: number;
  extraMonthly: number;
  oneTimeExtra: number;
  oneTimeMonth: number;
  annualExtra: number;
  annualExtraMonth: number;
}

function Results(p: ResultsProps) {
  const baseline = simulatePayoff({ loan: p.loan, annualRatePct: p.rate, termYears: p.term });
  const withExtra = simulatePayoff({
    loan: p.loan,
    annualRatePct: p.rate,
    termYears: p.term,
    extraMonthly: p.extraMonthly,
    oneTimeExtra: p.oneTimeExtra,
    oneTimeMonth: p.oneTimeMonth,
    annualExtra: p.annualExtra,
    annualExtraMonth: p.annualExtraMonth,
  });

  const monthsSaved = Math.max(0, baseline.months - withExtra.months);
  const interestSaved = Math.max(0, baseline.totalInterest - withExtra.totalInterest);
  const payoffReductionPct = baseline.months > 0 ? monthsSaved / baseline.months : 0;
  const interestReductionPct = baseline.totalInterest > 0 ? interestSaved / baseline.totalInterest : 0;

  const cappedOut = withExtra.cappedOut || baseline.cappedOut;

  // Rule-of-thumb: what would +$100/month achieve?
  const plus100 = simulatePayoff({ loan: p.loan, annualRatePct: p.rate, termYears: p.term, extraMonthly: 100 });
  const plus100MonthsSaved = Math.max(0, baseline.months - plus100.months);
  const plus100InterestSaved = Math.max(0, baseline.totalInterest - plus100.totalInterest);

  const scenarios = [0, 100, 250, 500].map((amt) => {
    const s = simulatePayoff({ loan: p.loan, annualRatePct: p.rate, termYears: p.term, extraMonthly: amt });
    return {
      amt,
      months: s.months,
      interest: s.totalInterest,
      saved: Math.max(0, baseline.totalInterest - s.totalInterest),
      cappedOut: s.cappedOut,
    };
  });

  const cards: MaybeCard[] = [
    cappedOut ? {
      kind: 'summary',
      text: 'The loan does not pay off within the projected term with these inputs. Try a higher payment or a shorter term.',
    } : {
      kind: 'summary',
      text: `You save ${formatMonthsAsYearsMonths(monthsSaved)} and ${formatCurrency(interestSaved)} in interest — paying off in ${formatMonthsAsYearsMonths(withExtra.months)}.`,
    },
    {
      kind: 'stats',
      items: [
        { label: 'Months saved', value: formatMonthsAsYearsMonths(monthsSaved) },
        { label: 'Interest saved', value: formatCurrency(interestSaved) },
        { label: 'New payoff', value: formatMonthsAsYearsMonths(withExtra.months) },
        { label: 'New total paid', value: formatCurrency(withExtra.totalPaid) },
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'Payoff reduction', value: `${(payoffReductionPct * 100).toFixed(1)}%` },
        { label: 'Interest reduction', value: `${(interestReductionPct * 100).toFixed(1)}%` },
        { label: 'Baseline interest', value: formatCurrency(baseline.totalInterest) },
        { label: 'New interest', value: formatCurrency(withExtra.totalInterest) },
      ],
    },
    p.extraMonthly > 0 ? {
      kind: 'takeaway',
      text: `Your current extra payment saves about ${formatCurrency(interestSaved)} in interest and cuts about ${formatMonthsAsYearsMonths(monthsSaved)} off the loan.`,
    } : null,
    p.extraMonthly !== 100 ? {
      kind: 'takeaway',
      text: `An extra $100/month would pay this off about ${formatMonthsAsYearsMonths(plus100MonthsSaved)} sooner and save about ${formatCurrency(plus100InterestSaved)} in interest.`,
    } : null,
    {
      kind: 'comparison',
      title: 'Extra payment scenarios',
      columns: scenarios.map((s) => ({
        title: s.amt === 0 ? 'No extra' : `+$${s.amt}/mo`,
        items: [
          `Payoff: ${formatMonthsAsYearsMonths(s.months)}`,
          `Interest: ${formatCurrency(s.interest)}`,
          `Saved: ${formatCurrency(s.saved)}`,
        ],
      })),
    },
    {
      kind: 'nextStep',
      actions: [
        { href: '/calculators/mortgage-calculator/', label: 'Mortgage Calculator' },
        { href: '/calculators/break-even-calculator/', label: 'Break-even Calculator' },
        { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
      ],
    },
  ];

  return (
    <>
      {!cappedOut && (
        <div className="grid gap-2 sm:grid-cols-2">
          <HeroCard label="Months saved" value={formatMonthsAsYearsMonths(monthsSaved)} />
          <HeroCard label="Interest saved" value={formatCurrency(interestSaved)} />
        </div>
      )}
      <OutcomeLayer cards={cards} />
    </>
  );
}

function HeroCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card border-emerald-200 bg-emerald-50 text-center">
      <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">{label}</div>
      <div className="mt-1 text-3xl font-bold text-emerald-900">{value}</div>
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  step?: string;
}
function Field({ id, label, value, onChange, step }: FieldProps) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="decimal"
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
      />
    </div>
  );
}

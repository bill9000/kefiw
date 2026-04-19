import { useMemo, useState } from 'react';
import {
  monthlyPayment,
  lifetimeTotals,
  formatCurrency,
} from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type PriceMode = 'home-price' | 'loan-amount';
type DownMode = 'amount' | 'percent';

export default function MortgageCalculator() {
  const [priceMode, setPriceMode] = useState<PriceMode>('home-price');
  const [homePrice, setHomePrice] = useState('400000');
  const [downMode, setDownMode] = useState<DownMode>('percent');
  const [downAmount, setDownAmount] = useState('80000');
  const [downPercent, setDownPercent] = useState('20');
  const [loanDirect, setLoanDirect] = useState('320000');
  const [rate, setRate] = useState('6.5');
  const [term, setTerm] = useState('30');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [annualTax, setAnnualTax] = useState('0');
  const [annualInsurance, setAnnualInsurance] = useState('0');
  const [monthlyHOA, setMonthlyHOA] = useState('0');
  const [monthlyPMI, setMonthlyPMI] = useState('0');

  const parsed = useMemo(() => {
    const price = parseFloat(homePrice) || 0;
    const dAmt = parseFloat(downAmount) || 0;
    const dPct = parseFloat(downPercent) || 0;
    const direct = parseFloat(loanDirect) || 0;
    const r = parseFloat(rate);
    const t = parseFloat(term);
    const tax = parseFloat(annualTax) || 0;
    const ins = parseFloat(annualInsurance) || 0;
    const hoa = parseFloat(monthlyHOA) || 0;
    const pmi = parseFloat(monthlyPMI) || 0;

    if (!Number.isFinite(r) || r < 0) return { error: 'Enter a valid interest rate.' as const };
    if (!Number.isFinite(t) || t <= 0) return { error: 'Enter a valid loan term.' as const };

    let loan = 0;
    if (priceMode === 'home-price') {
      if (price <= 0) return { error: 'Enter a valid home price.' as const };
      const down = downMode === 'amount' ? dAmt : (price * dPct) / 100;
      if (down > price) return { error: 'Down payment cannot exceed the home price.' as const };
      loan = price - down;
    } else {
      if (direct <= 0) return { error: 'Enter a valid loan amount.' as const };
      loan = direct;
    }
    if (loan <= 0) return { error: 'Loan amount must be greater than zero.' as const };

    return { loan, rate: r, term: t, tax, ins, hoa, pmi };
  }, [priceMode, homePrice, downMode, downAmount, downPercent, loanDirect, rate, term, annualTax, annualInsurance, monthlyHOA, monthlyPMI]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-600">Start with:</span>
          <button
            type="button"
            onClick={() => setPriceMode('home-price')}
            className={priceMode === 'home-price' ? 'btn btn-primary' : 'btn-ghost'}
          >Home price</button>
          <button
            type="button"
            onClick={() => setPriceMode('loan-amount')}
            className={priceMode === 'loan-amount' ? 'btn btn-primary' : 'btn-ghost'}
          >Loan amount</button>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {priceMode === 'home-price' ? (
            <>
              <Field id="home-price" label="Home price ($)" value={homePrice} onChange={setHomePrice} />
              <div>
                <label className="label" htmlFor="dpmode">Down payment</label>
                <div className="flex gap-2">
                  <input
                    id="dpmode"
                    type="number"
                    inputMode="decimal"
                    className="input"
                    value={downMode === 'amount' ? downAmount : downPercent}
                    onChange={(e) => downMode === 'amount' ? setDownAmount(e.target.value) : setDownPercent(e.target.value)}
                  />
                  <select
                    aria-label="Down payment unit"
                    className="input max-w-[5rem]"
                    value={downMode}
                    onChange={(e) => setDownMode(e.target.value as DownMode)}
                  >
                    <option value="percent">%</option>
                    <option value="amount">$</option>
                  </select>
                </div>
              </div>
            </>
          ) : (
            <Field id="loan-amount" label="Loan amount ($)" value={loanDirect} onChange={setLoanDirect} />
          )}
          <Field id="rate" label="Interest rate (%)" value={rate} onChange={setRate} step="0.01" />
          <Field id="term" label="Loan term (years)" value={term} onChange={setTerm} step="1" />
        </div>

        <button
          type="button"
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
          onClick={() => setShowAdvanced((x) => !x)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide advanced options' : 'Add taxes, insurance, HOA, PMI →'}
        </button>

        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field id="tax" label="Property tax per year ($)" value={annualTax} onChange={setAnnualTax} />
            <Field id="ins" label="Homeowners insurance per year ($)" value={annualInsurance} onChange={setAnnualInsurance} />
            <Field id="hoa" label="HOA per month ($)" value={monthlyHOA} onChange={setMonthlyHOA} />
            <Field id="pmi" label="PMI per month ($)" value={monthlyPMI} onChange={setMonthlyPMI} />
          </div>
        )}
      </div>

      {'error' in parsed ? (
        <div className="card border-amber-200 bg-amber-50 text-sm text-amber-900">{parsed.error}</div>
      ) : (
        <Results
          loan={parsed.loan}
          rate={parsed.rate}
          term={parsed.term}
          annualTax={parsed.tax}
          annualInsurance={parsed.ins}
          monthlyHOA={parsed.hoa}
          monthlyPMI={parsed.pmi}
        />
      )}
    </div>
  );
}

interface ResultsProps {
  loan: number;
  rate: number;
  term: number;
  annualTax: number;
  annualInsurance: number;
  monthlyHOA: number;
  monthlyPMI: number;
}

function Results({ loan, rate, term, annualTax, annualInsurance, monthlyHOA, monthlyPMI }: ResultsProps) {
  const totals = lifetimeTotals(loan, rate, term);
  const paymentPI = totals.paymentPI;
  const monthlyTax = annualTax / 12;
  const monthlyIns = annualInsurance / 12;
  const nonLoanMonthly = monthlyTax + monthlyIns + monthlyHOA + monthlyPMI;
  const paymentTotal = paymentPI + nonLoanMonthly;
  const hasExtras = nonLoanMonthly > 0;
  const loanShare = paymentTotal > 0 ? paymentPI / paymentTotal : 1;
  const nonLoanShare = 1 - loanShare;

  const grandTotal = totals.totalPI + (monthlyTax + monthlyIns + monthlyHOA + monthlyPMI) * totals.months;

  const payRatePlus1 = monthlyPayment(loan, rate + 1, term);
  const deltaPerOnePct = payRatePlus1 - paymentPI;
  const deltaPer10k = monthlyPayment(loan + 10000, rate, term) - paymentPI;

  const totals15 = lifetimeTotals(loan, rate, 15);
  const totals30 = lifetimeTotals(loan, rate, 30);
  const interestDelta30minus15 = totals30.totalInterest - totals15.totalInterest;

  const ratesForSensitivity: number[] = [rate - 0.5, rate, rate + 0.5].filter((x) => x >= 0);
  const sensitivityCols = ratesForSensitivity.map((rr) => {
    const t = lifetimeTotals(loan, rr, term);
    return {
      title: `${rr.toFixed(2)}% rate`,
      items: [
        `P&I: ${formatCurrency(t.paymentPI)}`,
        `Interest: ${formatCurrency(t.totalInterest)}`,
      ],
    };
  });

  const shorterTerm = term > 15 ? 15 : term > 10 ? 10 : Math.max(5, Math.round(term / 2));
  const shorter = lifetimeTotals(loan, rate, shorterTerm);
  const plus10k = lifetimeTotals(loan + 10000, rate, term);

  const cards: MaybeCard[] = [
    {
      kind: 'summary',
      text: `${formatCurrency(paymentTotal)}/month ${hasExtras ? 'total housing payment' : '(principal & interest)'} — ${formatCurrency(totals.totalInterest)} in interest over ${term} years.`,
    },
    {
      kind: 'stats',
      items: [
        { label: 'Monthly total', value: formatCurrency(paymentTotal) },
        { label: 'Principal & interest', value: formatCurrency(paymentPI) },
        ...(monthlyTax > 0 ? [{ label: 'Tax/mo', value: formatCurrency(monthlyTax) }] : []),
        ...(monthlyIns > 0 ? [{ label: 'Insurance/mo', value: formatCurrency(monthlyIns) }] : []),
        ...(monthlyHOA > 0 ? [{ label: 'HOA/mo', value: formatCurrency(monthlyHOA) }] : []),
        ...(monthlyPMI > 0 ? [{ label: 'PMI/mo', value: formatCurrency(monthlyPMI) }] : []),
      ],
    },
    {
      kind: 'stats',
      items: [
        { label: 'Total interest', value: formatCurrency(totals.totalInterest) },
        { label: hasExtras ? 'Grand total paid' : 'Total paid', value: formatCurrency(grandTotal) },
        { label: 'P&I share', value: `${(loanShare * 100).toFixed(0)}%` },
        ...(hasExtras ? [{ label: 'Tax/ins/HOA share', value: `${(nonLoanShare * 100).toFixed(0)}%` }] : []),
      ],
    },
    {
      kind: 'takeaway',
      text: `Each 1% change in rate changes this payment by about ${formatCurrency(Math.abs(deltaPerOnePct))}/month.`,
    },
    {
      kind: 'takeaway',
      text: `Each extra $10,000 borrowed adds about ${formatCurrency(Math.abs(deltaPer10k))}/month.`,
    },
    {
      kind: 'takeaway',
      text: `A 15-year loan raises the monthly payment but saves about ${formatCurrency(interestDelta30minus15)} in total interest vs 30 years.`,
    },
    sensitivityCols.length >= 2 ? {
      kind: 'comparison',
      title: 'Rate sensitivity',
      columns: sensitivityCols,
    } : null,
    {
      kind: 'comparison',
      title: 'What changes the loan',
      columns: [
        {
          title: `Current (${term}y)`,
          items: [
            `P&I: ${formatCurrency(paymentPI)}`,
            `Interest: ${formatCurrency(totals.totalInterest)}`,
          ],
        },
        {
          title: `Shorter (${shorterTerm}y)`,
          items: [
            `P&I: ${formatCurrency(shorter.paymentPI)}`,
            `Interest: ${formatCurrency(shorter.totalInterest)}`,
          ],
        },
        {
          title: 'Loan +$10k',
          items: [
            `P&I: ${formatCurrency(plus10k.paymentPI)}`,
            `Interest: ${formatCurrency(plus10k.totalInterest)}`,
          ],
        },
      ],
    },
    {
      kind: 'nextStep',
      actions: [
        { href: '/calculators/mortgage-extra-payment-calculator/', label: 'Mortgage Extra Payment Calculator' },
        { href: '/calculators/break-even-calculator/', label: 'Break-even Calculator' },
        { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
      ],
    },
  ];

  return <OutcomeLayer cards={cards} />;
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

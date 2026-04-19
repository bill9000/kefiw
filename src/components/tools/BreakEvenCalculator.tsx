import { useMemo, useState } from 'react';
import { formatCurrency, formatMonthsAsYearsMonths } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'business' | 'decision';

export default function BreakEvenCalculator() {
  const [mode, setMode] = useState<Mode>('business');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setMode('business')} className={mode === 'business' ? 'btn btn-primary' : 'btn-ghost'}>Business (units)</button>
        <button type="button" onClick={() => setMode('decision')} className={mode === 'decision' ? 'btn btn-primary' : 'btn-ghost'}>Decision (months to pay back)</button>
      </div>

      {mode === 'business' ? <BusinessMode /> : <DecisionMode />}
    </div>
  );
}

function BusinessMode() {
  const [fixed, setFixed] = useState('5000');
  const [price, setPrice] = useState('25');
  const [variable, setVariable] = useState('10');

  const parsed = useMemo(() => {
    const f = parseFloat(fixed);
    const p = parseFloat(price);
    const v = parseFloat(variable);
    if (![f, p, v].every(Number.isFinite) || f < 0 || p < 0 || v < 0) return null;
    const margin = p - v;
    if (margin <= 0) return { invalid: true as const, f, p, v, margin };
    const units = f / margin;
    const revenue = units * p;
    return { invalid: false as const, f, p, v, margin, units, revenue };
  }, [fixed, price, variable]);

  return (
    <>
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field id="fc" label="Fixed costs ($)" value={fixed} onChange={setFixed} />
          <Field id="pp" label="Price per unit ($)" value={price} onChange={setPrice} />
          <Field id="vc" label="Variable cost per unit ($)" value={variable} onChange={setVariable} />
        </div>
      </div>

      {parsed?.invalid && (
        <div className="card border-rose-200 bg-rose-50 text-sm text-rose-800">
          Price per unit must exceed variable cost per unit for a break-even to exist.
        </div>
      )}

      {parsed && !parsed.invalid && (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Units to break even</div>
              <div className="mt-1 text-3xl font-bold text-emerald-900">{Math.ceil(parsed.units).toLocaleString()}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Revenue at break-even</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(parsed.revenue)}</div>
            </div>
          </div>

          {(() => {
            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `Break even at ${Math.ceil(parsed.units).toLocaleString()} units — ${formatCurrency(parsed.revenue)} in revenue.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Contribution margin', value: formatCurrency(parsed.margin) },
                  { label: 'Margin ratio', value: `${((parsed.margin / parsed.p) * 100).toFixed(1)}%` },
                  { label: 'Units to break even', value: Math.ceil(parsed.units).toLocaleString() },
                  { label: 'Revenue at BE', value: formatCurrency(parsed.revenue) },
                ],
              },
              {
                kind: 'takeaway',
                text: `Each unit contributes ${formatCurrency(parsed.margin)} toward fixed costs after covering variable cost.`,
              },
              {
                kind: 'comparison',
                title: 'Profit at volume',
                rows: [
                  { label: `At ${Math.ceil(parsed.units * 1.5).toLocaleString()} units`, value: formatCurrency(Math.ceil(parsed.units * 1.5) * parsed.margin - parsed.f) },
                  { label: `At ${Math.ceil(parsed.units * 2).toLocaleString()} units`, value: formatCurrency(Math.ceil(parsed.units * 2) * parsed.margin - parsed.f) },
                  { label: `At ${Math.ceil(parsed.units * 3).toLocaleString()} units`, value: formatCurrency(Math.ceil(parsed.units * 3) * parsed.margin - parsed.f) },
                ],
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/markup-calculator/', label: 'Markup Calculator' },
                  { href: '/calculators/margin-calculator/', label: 'Margin Calculator' },
                  { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
                ],
              },
            ];
            return <OutcomeLayer cards={cards} />;
          })()}
        </>
      )}
    </>
  );
}

type DecisionParse =
  | { kind: 'error'; error: string }
  | { kind: 'no-breakeven'; u: number; s: number; r: number; net: number }
  | { kind: 'ok'; u: number; s: number; r: number; net: number; months: number };

function DecisionMode() {
  const [upfront, setUpfront] = useState('1200');
  const [savings, setSavings] = useState('100');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recurring, setRecurring] = useState('0');

  const parsed = useMemo<DecisionParse>(() => {
    const u = parseFloat(upfront);
    const s = parseFloat(savings);
    const r = parseFloat(recurring) || 0;
    if (!Number.isFinite(u) || u < 0) return { kind: 'error', error: 'Enter an upfront cost.' };
    if (!Number.isFinite(s) || s < 0) return { kind: 'error', error: 'Enter monthly savings or gain.' };
    if (r < 0) return { kind: 'error', error: 'Recurring cost cannot be negative.' };
    const net = s - r;
    if (net <= 0) return { kind: 'no-breakeven', u, s, r, net };
    const months = u / net;
    return { kind: 'ok', u, s, r, net, months };
  }, [upfront, savings, recurring]);

  return (
    <>
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="uf" label="Upfront cost ($)" value={upfront} onChange={setUpfront} />
          <Field id="sv" label="Monthly savings or gain ($)" value={savings} onChange={setSavings} />
        </div>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
          onClick={() => setShowAdvanced((x) => !x)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide advanced' : 'Add recurring monthly cost →'}
        </button>
        {showAdvanced && (
          <div className="mt-3">
            <Field id="rc" label="Monthly ongoing cost ($)" value={recurring} onChange={setRecurring} />
          </div>
        )}
      </div>

      {parsed.kind === 'error' && (
        <div className="card border-amber-200 bg-amber-50 text-sm text-amber-900">{parsed.error}</div>
      )}

      {parsed.kind === 'no-breakeven' && (
        <div className="card border-rose-200 bg-rose-50 text-sm text-rose-800">
          No break-even: recurring costs ({formatCurrency(parsed.r)}/mo) meet or exceed monthly savings ({formatCurrency(parsed.s)}/mo). Net monthly benefit is {formatCurrency(parsed.net)}.
        </div>
      )}

      {parsed.kind === 'ok' && (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Break-even</div>
              <div className="mt-1 text-3xl font-bold text-emerald-900">{formatMonthsAsYearsMonths(parsed.months)}</div>
              <div className="text-xs text-emerald-700">{parsed.months.toFixed(1)} months</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Net monthly benefit</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(parsed.net)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Year-1 gain</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(parsed.net * 12 - parsed.u)}</div>
            </div>
          </div>

          {(() => {
            const perTen = 10;
            const monthsAtPlus10 = parsed.u / (parsed.net + perTen);
            const shaved = parsed.months - monthsAtPlus10;
            const scenarios = [10, 25, 50].map((add) => ({
              add,
              months: parsed.u / (parsed.net + add),
            }));

            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `Pays back in ${formatMonthsAsYearsMonths(parsed.months)} at ${formatCurrency(parsed.net)}/mo net benefit.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Upfront cost', value: formatCurrency(parsed.u) },
                  { label: 'Monthly savings', value: formatCurrency(parsed.s) },
                  ...(parsed.r > 0 ? [{ label: 'Recurring cost', value: formatCurrency(parsed.r) }] : []),
                  { label: 'Net monthly', value: formatCurrency(parsed.net) },
                  { label: 'Break-even', value: formatMonthsAsYearsMonths(parsed.months) },
                  { label: 'Year-2 gain', value: formatCurrency(parsed.net * 24 - parsed.u) },
                ],
              },
              {
                kind: 'takeaway',
                text: `Every extra $${perTen}/month shortens break-even by about ${shaved.toFixed(1)} months.`,
              },
              parsed.r > 0 ? {
                kind: 'takeaway' as const,
                text: `Recurring costs of ${formatCurrency(parsed.r)}/mo delay break-even — without them, payback would be ${formatMonthsAsYearsMonths(parsed.u / parsed.s)}.`,
              } : null,
              {
                kind: 'comparison',
                title: 'If savings were higher',
                columns: scenarios.map((sc) => ({
                  title: `+$${sc.add}/mo`,
                  items: [`Break-even: ${formatMonthsAsYearsMonths(sc.months)}`],
                })).concat([{
                  title: 'Current',
                  items: [`Break-even: ${formatMonthsAsYearsMonths(parsed.months)}`],
                }]),
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/savings-goal-calculator/', label: 'Savings Goal' },
                  { href: '/calculators/mortgage-extra-payment-calculator/', label: 'Mortgage Extra Payment' },
                ],
              },
            ];
            return <OutcomeLayer cards={cards} />;
          })()}
        </>
      )}
    </>
  );
}

interface FieldProps { id: string; label: string; value: string; onChange: (v: string) => void; }
function Field({ id, label, value, onChange }: FieldProps) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} type="number" inputMode="decimal" className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { formatCurrency } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type TipOn = 'pre-tax' | 'total';

export default function TipCalculator() {
  const [bill, setBill] = useState('50');
  const [tipPct, setTipPct] = useState('18');
  const [people, setPeople] = useState('2');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tax, setTax] = useState('0');
  const [tipOn, setTipOn] = useState<TipOn>('pre-tax');

  const r = useMemo(() => {
    const b = parseFloat(bill);
    const t = parseFloat(tipPct);
    const p = parseInt(people, 10);
    const tx = parseFloat(tax) || 0;
    if (!Number.isFinite(b) || b <= 0) return null;
    if (!Number.isFinite(t) || t < 0) return null;
    if (!Number.isFinite(p) || p < 1) return null;

    const base = tipOn === 'total' ? b + tx : b;
    const tip = base * (t / 100);
    const total = b + tx + tip;
    const perPerson = total / p;
    return { bill: b, tipPct: t, tip, total, perPerson, people: p, tax: tx, tipOn };
  }, [bill, tipPct, people, tax, tipOn]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field id="b" label="Bill ($)" value={bill} onChange={setBill} />
          <Field id="t" label="Tip %" value={tipPct} onChange={setTipPct} />
          <Field id="p" label="People" value={people} onChange={setPeople} step="1" />
        </div>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
          onClick={() => setShowAdvanced((x) => !x)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide advanced options' : 'Add tax or change tip base →'}
        </button>
        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field id="tx" label="Tax on the bill ($)" value={tax} onChange={setTax} />
            <div>
              <label className="label" htmlFor="tipon">Tip on</label>
              <select
                id="tipon"
                className="input"
                value={tipOn}
                onChange={(e) => setTipOn(e.target.value as TipOn)}
              >
                <option value="pre-tax">Pre-tax amount (default)</option>
                <option value="total">Total including tax</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {r && (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Tip</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(r.tip)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Total</div>
              <div className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(r.total)}</div>
            </div>
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Per person</div>
              <div className="mt-1 text-2xl font-bold text-emerald-900">{formatCurrency(r.perPerson)}</div>
            </div>
          </div>

          {(() => {
            const per1Pct = (r.tipOn === 'total' ? r.bill + r.tax : r.bill) / 100;
            const tipsBase = r.tipOn === 'total' ? r.bill + r.tax : r.bill;
            const scenarios = [15, 18, 20, 25];
            const peopleScenarios = [2, 3, 4, 5].filter((n) => n !== r.people);

            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `${formatCurrency(r.tip)} tip, ${formatCurrency(r.total)} total — ${formatCurrency(r.perPerson)} per person across ${r.people}.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Bill', value: formatCurrency(r.bill) },
                  ...(r.tax > 0 ? [{ label: 'Tax', value: formatCurrency(r.tax) }] : []),
                  { label: 'Tip', value: formatCurrency(r.tip) },
                  { label: 'Total', value: formatCurrency(r.total) },
                  { label: 'Per person', value: formatCurrency(r.perPerson) },
                  { label: 'Tip share', value: `${((r.tip / r.total) * 100).toFixed(1)}%` },
                ],
              },
              {
                kind: 'takeaway',
                text: `Each extra 1% tip adds ${formatCurrency(per1Pct)}.`,
              },
              {
                kind: 'takeaway',
                text: `A 15% tip here is ${formatCurrency(tipsBase * 0.15)}; 20% is ${formatCurrency(tipsBase * 0.20)}.`,
              },
              {
                kind: 'comparison',
                title: 'Compare tip levels',
                columns: scenarios.map((s) => ({
                  title: `${s}%${s === r.tipPct ? ' (current)' : ''}`,
                  items: [
                    `Tip: ${formatCurrency(tipsBase * (s / 100))}`,
                    `Total: ${formatCurrency(r.bill + r.tax + tipsBase * (s / 100))}`,
                    `Per person: ${formatCurrency((r.bill + r.tax + tipsBase * (s / 100)) / r.people)}`,
                  ],
                })),
              },
              peopleScenarios.length > 0 ? {
                kind: 'comparison',
                title: 'Split across different group sizes',
                columns: peopleScenarios.map((n) => ({
                  title: `${n} people`,
                  items: [
                    `Each pays: ${formatCurrency(r.total / n)}`,
                  ],
                })),
              } : null,
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/discount-calculator/', label: 'Discount Calculator' },
                  { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
                ],
              },
            ];
            return <OutcomeLayer cards={cards} />;
          })()}
        </>
      )}
    </div>
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

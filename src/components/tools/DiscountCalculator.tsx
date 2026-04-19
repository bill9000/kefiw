import { useMemo, useState } from 'react';
import { formatCurrency } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('49.99');
  const [pct, setPct] = useState('20');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [pct2, setPct2] = useState('0');
  const [taxPct, setTaxPct] = useState('0');

  const r = useMemo(() => {
    const p = parseFloat(price);
    const d1 = parseFloat(pct);
    const d2 = parseFloat(pct2) || 0;
    const tx = parseFloat(taxPct) || 0;
    if (!Number.isFinite(p) || p <= 0) return null;
    if (!Number.isFinite(d1) || d1 < 0 || d1 > 100) return null;
    if (d2 < 0 || d2 > 100 || tx < 0) return null;

    const afterFirst = p * (1 - d1 / 100);
    const afterSecond = afterFirst * (1 - d2 / 100);
    const stacked = d2 > 0;
    const discounted = stacked ? afterSecond : afterFirst;
    const totalSaved = p - discounted;
    const effectivePct = (totalSaved / p) * 100;
    const combinedPct = d1 + d2;
    const gap = combinedPct - effectivePct;
    const taxAmt = (discounted * tx) / 100;
    const finalWithTax = discounted + taxAmt;

    return { p, d1, d2, tx, stacked, afterFirst, discounted, totalSaved, effectivePct, combinedPct, gap, taxAmt, finalWithTax };
  }, [price, pct, pct2, taxPct]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="p" label="Original price ($)" value={price} onChange={setPrice} />
          <Field id="d" label="Discount %" value={pct} onChange={setPct} />
        </div>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
          onClick={() => setShowAdvanced((x) => !x)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide advanced options' : 'Stack a second discount or add tax →'}
        </button>
        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field id="d2" label="Second discount % (stacked)" value={pct2} onChange={setPct2} />
            <Field id="tx" label="Sales tax % (applied after discount)" value={taxPct} onChange={setTaxPct} />
          </div>
        )}
      </div>

      {r && (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Final price</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(r.tx > 0 ? r.finalWithTax : r.discounted)}</div>
              {r.tx > 0 && (
                <div className="mt-1 text-xs text-slate-500">{formatCurrency(r.discounted)} + {formatCurrency(r.taxAmt)} tax</div>
              )}
            </div>
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Effective discount</div>
              <div className="mt-1 text-3xl font-bold text-emerald-900">{r.effectivePct.toFixed(1)}%</div>
              <div className="mt-1 text-xs text-emerald-700">You save {formatCurrency(r.totalSaved)}</div>
            </div>
          </div>

          {(() => {
            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: r.stacked
                  ? `Stacked ${r.d1}% + ${r.d2}% = ${r.effectivePct.toFixed(1)}% off — not ${r.combinedPct}%. You pay ${formatCurrency(r.discounted)}.`
                  : `${r.d1}% off ${formatCurrency(r.p)} — save ${formatCurrency(r.totalSaved)}, pay ${formatCurrency(r.discounted)}.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Original', value: formatCurrency(r.p) },
                  { label: 'You save', value: formatCurrency(r.totalSaved) },
                  { label: 'You pay', value: formatCurrency(r.discounted) },
                  { label: 'Effective %', value: `${r.effectivePct.toFixed(1)}%` },
                  ...(r.tx > 0 ? [
                    { label: 'Tax', value: formatCurrency(r.taxAmt) },
                    { label: 'Final + tax', value: formatCurrency(r.finalWithTax) },
                  ] : []),
                ],
              },
              r.stacked ? {
                kind: 'takeaway',
                text: `Adding ${r.d1}% and ${r.d2}% looks like ${r.combinedPct}% off, but it's ${r.effectivePct.toFixed(1)}% — ${r.gap.toFixed(1)} percentage points less than the sum, because the second discount is taken on the already-reduced price.`,
              } : null,
              {
                kind: 'takeaway',
                text: `A 1% discount on this item is ${formatCurrency(r.p / 100)}. Each extra 10% off saves about ${formatCurrency(r.p / 10)} more.`,
              },
              r.tx > 0 ? {
                kind: 'takeaway',
                text: `Tax is ${formatCurrency(r.taxAmt)} on the discounted price, bringing the final to ${formatCurrency(r.finalWithTax)}.`,
              } : null,
              {
                kind: 'comparison',
                title: 'If the discount were…',
                columns: [10, 20, 30].filter((p) => p !== r.d1).slice(0, 3).map((p) => ({
                  title: `${p}% off`,
                  items: [
                    `Pay: ${formatCurrency(r.p * (1 - p / 100))}`,
                    `Save: ${formatCurrency(r.p * (p / 100))}`,
                  ],
                })).concat([{
                  title: `Current (${r.stacked ? r.effectivePct.toFixed(1) : r.d1}%)`,
                  items: [
                    `Pay: ${formatCurrency(r.discounted)}`,
                    `Save: ${formatCurrency(r.totalSaved)}`,
                  ],
                }]),
              },
              r.stacked ? {
                kind: 'comparison',
                title: 'Single vs stacked',
                columns: [
                  {
                    title: `Single ${r.d1}%`,
                    items: [
                      `Pay: ${formatCurrency(r.afterFirst)}`,
                      `Save: ${formatCurrency(r.p - r.afterFirst)}`,
                    ],
                  },
                  {
                    title: `Single ${r.combinedPct}%`,
                    items: [
                      `Pay: ${formatCurrency(r.p * (1 - r.combinedPct / 100))}`,
                      `Save: ${formatCurrency(r.p * (r.combinedPct / 100))}`,
                    ],
                  },
                  {
                    title: 'Stacked (actual)',
                    items: [
                      `Pay: ${formatCurrency(r.discounted)}`,
                      `Save: ${formatCurrency(r.totalSaved)}`,
                    ],
                  },
                ],
              } : null,
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/tip-calculator/', label: 'Tip Calculator' },
                  { href: '/calculators/markup-calculator/', label: 'Markup Calculator' },
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

interface FieldProps { id: string; label: string; value: string; onChange: (v: string) => void; }
function Field({ id, label, value, onChange }: FieldProps) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} type="number" inputMode="decimal" className="input" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

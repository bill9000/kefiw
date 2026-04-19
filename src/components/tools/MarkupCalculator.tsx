import { useMemo, useState } from 'react';
import { formatCurrency } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'fromCostPrice' | 'fromCostMarkup';

export default function MarkupCalculator() {
  const [mode, setMode] = useState<Mode>('fromCostPrice');
  const [cost, setCost] = useState('40');
  const [price, setPrice] = useState('60');
  const [markup, setMarkup] = useState('50');

  const r = useMemo(() => {
    const c = parseFloat(cost);
    if (!Number.isFinite(c) || c <= 0) return null;
    if (mode === 'fromCostPrice') {
      const p = parseFloat(price);
      if (!Number.isFinite(p) || p < 0) return null;
      const profit = p - c;
      const mk = (profit / c) * 100;
      const mg = p === 0 ? 0 : (profit / p) * 100;
      return { cost: c, price: p, profit, markup: mk, margin: mg };
    }
    const mk = parseFloat(markup);
    if (!Number.isFinite(mk)) return null;
    const p = c * (1 + mk / 100);
    const profit = p - c;
    const mg = p === 0 ? 0 : (profit / p) * 100;
    return { cost: c, price: p, profit, markup: mk, margin: mg };
  }, [mode, cost, price, markup]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode('fromCostPrice')} className={mode === 'fromCostPrice' ? 'btn btn-primary' : 'btn-ghost'}>Cost + Price</button>
          <button type="button" onClick={() => setMode('fromCostMarkup')} className={mode === 'fromCostMarkup' ? 'btn btn-primary' : 'btn-ghost'}>Cost + Markup %</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="c" label="Cost ($)" value={cost} onChange={setCost} />
          {mode === 'fromCostPrice' ? (
            <Field id="p" label="Selling price ($)" value={price} onChange={setPrice} />
          ) : (
            <Field id="mk" label="Markup %" value={markup} onChange={setMarkup} />
          )}
        </div>
      </div>

      {r && (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Markup</div>
              <div className="mt-1 text-3xl font-bold text-emerald-900">{r.markup.toFixed(1)}%</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Gross profit</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(r.profit)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{mode === 'fromCostPrice' ? 'Price' : 'Computed price'}</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(r.price)}</div>
            </div>
          </div>

          {(() => {
            const per1Pct = r.cost / 100;
            const per10Pct = r.cost / 10;
            const targets = [20, 30, 40];
            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `Cost ${formatCurrency(r.cost)} → price ${formatCurrency(r.price)} = ${r.markup.toFixed(1)}% markup, ${formatCurrency(r.profit)} profit.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Cost', value: formatCurrency(r.cost) },
                  { label: 'Price', value: formatCurrency(r.price) },
                  { label: 'Profit', value: formatCurrency(r.profit) },
                  { label: 'Markup', value: `${r.markup.toFixed(1)}%` },
                  { label: 'Margin', value: `${r.margin.toFixed(1)}%` },
                ],
              },
              {
                kind: 'takeaway',
                text: `Each extra 10% markup raises price by ${formatCurrency(per10Pct)} at this cost. A 1% markup is ${formatCurrency(per1Pct)}.`,
              },
              {
                kind: 'takeaway',
                text: `Markup uses cost as its base (${formatCurrency(r.cost)}); margin uses price as its base (${formatCurrency(r.price)}) — same profit, different denominator.`,
              },
              {
                kind: 'comparison',
                title: 'Prices at target markup',
                columns: targets.map((t) => ({
                  title: `${t}% markup${Math.round(r.markup) === t ? ' (current)' : ''}`,
                  items: [
                    `Price: ${formatCurrency(r.cost * (1 + t / 100))}`,
                    `Profit: ${formatCurrency(r.cost * (t / 100))}`,
                  ],
                })).concat([{
                  title: `Current (${r.markup.toFixed(1)}%)`,
                  items: [
                    `Price: ${formatCurrency(r.price)}`,
                    `Profit: ${formatCurrency(r.profit)}`,
                  ],
                }]),
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/margin-calculator/', label: 'Margin Calculator' },
                  { href: '/calculators/markup-margin-calculator/', label: 'Markup ↔ Margin Converter' },
                  { href: '/calculators/break-even-calculator/', label: 'Break-even Calculator' },
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

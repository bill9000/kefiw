import { useMemo, useState } from 'react';
import { formatCurrency } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'fromCostPrice' | 'fromCostMargin';

export default function MarginCalculator() {
  const [mode, setMode] = useState<Mode>('fromCostPrice');
  const [cost, setCost] = useState('40');
  const [price, setPrice] = useState('60');
  const [margin, setMargin] = useState('33.33');

  const r = useMemo(() => {
    const c = parseFloat(cost);
    if (!Number.isFinite(c) || c <= 0) return null;
    if (mode === 'fromCostPrice') {
      const p = parseFloat(price);
      if (!Number.isFinite(p) || p <= 0) return null;
      const profit = p - c;
      const mg = (profit / p) * 100;
      const mk = (profit / c) * 100;
      return { cost: c, price: p, profit, margin: mg, markup: mk };
    }
    const mg = parseFloat(margin);
    if (!Number.isFinite(mg) || mg >= 100) return null;
    const p = c / (1 - mg / 100);
    const profit = p - c;
    const mk = (profit / c) * 100;
    return { cost: c, price: p, profit, margin: mg, markup: mk };
  }, [mode, cost, price, margin]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode('fromCostPrice')} className={mode === 'fromCostPrice' ? 'btn btn-primary' : 'btn-ghost'}>Cost + Price</button>
          <button type="button" onClick={() => setMode('fromCostMargin')} className={mode === 'fromCostMargin' ? 'btn btn-primary' : 'btn-ghost'}>Cost + Target margin %</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="c" label="Cost ($)" value={cost} onChange={setCost} />
          {mode === 'fromCostPrice' ? (
            <Field id="p" label="Selling price ($)" value={price} onChange={setPrice} />
          ) : (
            <Field id="mg" label="Target margin %" value={margin} onChange={setMargin} />
          )}
        </div>
        {mode === 'fromCostMargin' && (
          <p className="mt-2 text-xs text-slate-500">Margin must be less than 100% — it can only approach 100% as cost approaches zero.</p>
        )}
      </div>

      {r && (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Margin</div>
              <div className="mt-1 text-3xl font-bold text-emerald-900">{r.margin.toFixed(1)}%</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Gross profit</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(r.profit)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{mode === 'fromCostPrice' ? 'Price' : 'Required price'}</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(r.price)}</div>
            </div>
          </div>

          {(() => {
            const targets = [20, 30, 40].filter((t) => Math.abs(t - r.margin) > 0.5);
            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `Price ${formatCurrency(r.price)} on ${formatCurrency(r.cost)} cost = ${r.margin.toFixed(1)}% margin (${r.markup.toFixed(1)}% markup) — ${formatCurrency(r.profit)} profit.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Cost', value: formatCurrency(r.cost) },
                  { label: 'Price', value: formatCurrency(r.price) },
                  { label: 'Profit', value: formatCurrency(r.profit) },
                  { label: 'Margin', value: `${r.margin.toFixed(1)}%` },
                  { label: 'Markup (equivalent)', value: `${r.markup.toFixed(1)}%` },
                ],
              },
              {
                kind: 'takeaway',
                text: `Same profit (${formatCurrency(r.profit)}), two lenses: ${r.margin.toFixed(1)}% margin when viewed against price, ${r.markup.toFixed(1)}% markup when viewed against cost.`,
              },
              {
                kind: 'takeaway',
                text: `To reach a 40% margin at this cost, price needs to be ${formatCurrency(r.cost / 0.6)}.`,
              },
              {
                kind: 'comparison',
                title: 'Price at target margin',
                columns: [
                  ...targets.map((t) => ({
                    title: `${t}% margin`,
                    items: [
                      `Price: ${formatCurrency(r.cost / (1 - t / 100))}`,
                      `Profit: ${formatCurrency(r.cost / (1 - t / 100) - r.cost)}`,
                    ],
                  })),
                  {
                    title: `Current (${r.margin.toFixed(1)}%)`,
                    items: [
                      `Price: ${formatCurrency(r.price)}`,
                      `Profit: ${formatCurrency(r.profit)}`,
                    ],
                  },
                ],
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/markup-calculator/', label: 'Markup Calculator' },
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

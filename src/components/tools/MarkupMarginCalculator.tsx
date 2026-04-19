import { useMemo, useState } from 'react';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'fromCostPrice' | 'fromCostMarkup' | 'fromCostMargin';

export default function MarkupMarginCalculator() {
  const [mode, setMode] = useState<Mode>('fromCostPrice');
  const [cost, setCost] = useState('40');
  const [price, setPrice] = useState('60');
  const [markup, setMarkup] = useState('50');
  const [margin, setMargin] = useState('33.33');

  const result = useMemo(() => {
    const c = parseFloat(cost);
    if (!Number.isFinite(c) || c <= 0) return null;

    if (mode === 'fromCostPrice') {
      const p = parseFloat(price);
      if (!Number.isFinite(p)) return null;
      const profit = p - c;
      const mk = (profit / c) * 100;
      const mg = p === 0 ? 0 : (profit / p) * 100;
      return { cost: c, price: p, profit, markup: mk, margin: mg };
    }
    if (mode === 'fromCostMarkup') {
      const mk = parseFloat(markup);
      if (!Number.isFinite(mk)) return null;
      const p = c * (1 + mk / 100);
      const profit = p - c;
      const mg = p === 0 ? 0 : (profit / p) * 100;
      return { cost: c, price: p, profit, markup: mk, margin: mg };
    }
    const mg = parseFloat(margin);
    if (!Number.isFinite(mg) || mg >= 100) return null;
    const p = c / (1 - mg / 100);
    const profit = p - c;
    const mk = (profit / c) * 100;
    return { cost: c, price: p, profit, markup: mk, margin: mg };
  }, [mode, cost, price, markup, margin]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Tab active={mode === 'fromCostPrice'} onClick={() => setMode('fromCostPrice')}>Cost + Price</Tab>
        <Tab active={mode === 'fromCostMarkup'} onClick={() => setMode('fromCostMarkup')}>Cost + Markup %</Tab>
        <Tab active={mode === 'fromCostMargin'} onClick={() => setMode('fromCostMargin')}>Cost + Margin %</Tab>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c">Cost</label>
          <input id="c" type="number" inputMode="decimal" className="input" value={cost} onChange={(e) => setCost(e.target.value)} />
        </div>
        {mode === 'fromCostPrice' && (
          <div>
            <label className="label" htmlFor="p">Selling price</label>
            <input id="p" type="number" inputMode="decimal" className="input" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        )}
        {mode === 'fromCostMarkup' && (
          <div>
            <label className="label" htmlFor="mk">Markup %</label>
            <input id="mk" type="number" inputMode="decimal" className="input" value={markup} onChange={(e) => setMarkup(e.target.value)} />
          </div>
        )}
        {mode === 'fromCostMargin' && (
          <div>
            <label className="label" htmlFor="mg">Margin %</label>
            <input id="mg" type="number" inputMode="decimal" className="input" value={margin} onChange={(e) => setMargin(e.target.value)} />
          </div>
        )}
      </div>

      {result && (
        <>
          <div className="card">
            <div className="text-sm text-slate-500">Selling price</div>
            <div className="text-3xl font-bold">{fmt(result.price)}</div>
            <div className="mt-1 text-sm text-slate-600">
              Profit {fmt(result.profit)} · Markup {fmt(result.markup)}% · Margin {fmt(result.margin)}%
            </div>
          </div>

          {(() => {
            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `${fmt(result.markup)}% markup equals ${fmt(result.margin)}% margin at a ${fmt(result.price)} price.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Cost', value: fmt(result.cost) },
                  { label: 'Price', value: fmt(result.price) },
                  { label: 'Profit', value: fmt(result.profit) },
                  { label: 'Markup', value: `${fmt(result.markup)}%` },
                  { label: 'Margin', value: `${fmt(result.margin)}%` },
                ],
              },
              {
                kind: 'comparison',
                title: 'Markup vs margin',
                rows: [
                  { label: 'Markup = profit / cost', value: `${fmt(result.markup)}%` },
                  { label: 'Margin = profit / price', value: `${fmt(result.margin)}%` },
                ],
              },
              {
                kind: 'takeaway',
                text: 'Markup is always higher than margin for the same price — margin divides by the larger number.',
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/break-even-calculator/', label: 'Break-even calculator' },
                  { href: '/calculators/discount-calculator/', label: 'Discount calculator' },
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

function Tab(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={props.onClick}
    className={`btn ${props.active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>{props.children}</button>;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '–';
  return parseFloat(n.toFixed(2)).toLocaleString();
}

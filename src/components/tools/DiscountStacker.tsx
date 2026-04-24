import { useMemo, useState } from 'react';
import { formatCurrency } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type CouponKind = 'percent' | 'amount';

interface Layer {
  label: string;
  before: number; // price going in
  discount: number; // amount subtracted (absolute $)
  after: number; // price coming out
  kind: 'percent' | 'amount';
  rate: string; // display: '20%' or '$10'
}

export default function DiscountStacker() {
  const [price, setPrice] = useState('120');
  const [salePct, setSalePct] = useState('20');
  const [couponKind, setCouponKind] = useState<CouponKind>('percent');
  const [couponValue, setCouponValue] = useState('10');
  const [extraPct, setExtraPct] = useState('0');
  const [seniorPct, setSeniorPct] = useState('0');
  const [taxPct, setTaxPct] = useState('0');
  const [cashbackPct, setCashbackPct] = useState('0');

  const result = useMemo(() => {
    const p = parseFloat(price);
    if (!Number.isFinite(p) || p <= 0) return null;

    const applyPercent = (val: number, raw: string, label: string): Layer => {
      const rate = Math.max(0, Math.min(100, parseFloat(raw) || 0));
      const cut = val * (rate / 100);
      return { label, before: val, discount: cut, after: val - cut, kind: 'percent', rate: `${rate}%` };
    };

    const applyCoupon = (val: number): Layer => {
      if (couponKind === 'amount') {
        const raw = Math.max(0, parseFloat(couponValue) || 0);
        const cut = Math.min(raw, val);
        return { label: 'Coupon', before: val, discount: cut, after: val - cut, kind: 'amount', rate: formatCurrency(cut) };
      }
      return applyPercent(val, couponValue, 'Coupon');
    };

    const layers: Layer[] = [];
    let running = p;

    const saleLayer = applyPercent(running, salePct, 'Sale');
    if (saleLayer.discount > 0) layers.push(saleLayer);
    running = saleLayer.after;

    const couponLayer = applyCoupon(running);
    if (couponLayer.discount > 0) layers.push(couponLayer);
    running = couponLayer.after;

    const extraLayer = applyPercent(running, extraPct, 'Extra');
    if (extraLayer.discount > 0) layers.push(extraLayer);
    running = extraLayer.after;

    const seniorLayer = applyPercent(running, seniorPct, 'Senior / Loyalty');
    if (seniorLayer.discount > 0) layers.push(seniorLayer);
    running = seniorLayer.after;

    const afterDiscounts = running;
    const tax = Math.max(0, parseFloat(taxPct) || 0);
    const taxAmt = afterDiscounts * (tax / 100);
    const afterTax = afterDiscounts + taxAmt;

    const cashback = Math.max(0, parseFloat(cashbackPct) || 0);
    const cashbackAmt = afterTax * (cashback / 100);
    const net = afterTax - cashbackAmt;

    const totalDiscount = p - afterDiscounts;
    const effectivePct = (totalDiscount / p) * 100;
    const sumOfLayers =
      (parseFloat(salePct) || 0) +
      (couponKind === 'percent' ? (parseFloat(couponValue) || 0) : 0) +
      (parseFloat(extraPct) || 0) +
      (parseFloat(seniorPct) || 0);

    return {
      p,
      layers,
      afterDiscounts,
      taxAmt,
      afterTax,
      cashbackAmt,
      net,
      totalDiscount,
      effectivePct,
      sumOfLayers,
      couponIsAmount: couponKind === 'amount',
      couponDollar: couponKind === 'amount' ? parseFloat(couponValue) || 0 : 0,
      taxPctNum: tax,
      cashbackPctNum: cashback,
    };
  }, [price, salePct, couponKind, couponValue, extraPct, seniorPct, taxPct, cashbackPct]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="price" label="Original price" value={price} onChange={setPrice} />
          <Field id="sale" label="Sale %" value={salePct} onChange={setSalePct} />
          <div>
            <label className="label" htmlFor="coupon">Coupon</label>
            <div className="flex gap-2">
              <select
                value={couponKind}
                onChange={(e) => setCouponKind(e.target.value as CouponKind)}
                className="input !w-auto"
                aria-label="Coupon type"
              >
                <option value="percent">%</option>
                <option value="amount">$</option>
              </select>
              <input
                id="coupon"
                type="number"
                inputMode="decimal"
                value={couponValue}
                onChange={(e) => setCouponValue(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <Field id="extra" label="Extra %" value={extraPct} onChange={setExtraPct} />
          <Field id="senior" label="Senior / Student / Loyalty %" value={seniorPct} onChange={setSeniorPct} />
          <Field id="tax" label="Sales tax % (post-discount)" value={taxPct} onChange={setTaxPct} />
          <Field id="cashback" label="Cashback % (post-tax rebate)" value={cashbackPct} onChange={setCashbackPct} />
        </div>
      </div>

      {result && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="card text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">You pay at checkout</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">{formatCurrency(result.afterTax)}</div>
            <div className="mt-1 text-xs text-slate-500">
              {formatCurrency(result.afterDiscounts)} + {formatCurrency(result.taxAmt)} tax
            </div>
          </div>
          <div className="card border-emerald-200 bg-emerald-50 text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Net cost after cashback</div>
            <div className="mt-1 text-3xl font-bold text-emerald-900">{formatCurrency(result.net)}</div>
            <div className="mt-1 text-xs text-emerald-700">
              {formatCurrency(result.cashbackAmt)} cashback · {result.effectivePct.toFixed(1)}% effective discount
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-md border border-slate-200">
          <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
            Step-by-step
          </div>
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-500">
              <tr>
                <th className="p-2">Step</th>
                <th className="p-2">Rate</th>
                <th className="p-2 text-right">Before</th>
                <th className="p-2 text-right">− saved</th>
                <th className="p-2 text-right">After</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-2">Original price</td>
                <td className="p-2 text-slate-500">—</td>
                <td className="p-2 text-right">—</td>
                <td className="p-2 text-right">—</td>
                <td className="p-2 text-right font-mono">{formatCurrency(result.p)}</td>
              </tr>
              {result.layers.map((l, i) => (
                <tr key={i}>
                  <td className="p-2 font-medium">{l.label}</td>
                  <td className="p-2 text-slate-600">{l.rate}</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(l.before)}</td>
                  <td className="p-2 text-right font-mono text-emerald-700">−{formatCurrency(l.discount)}</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(l.after)}</td>
                </tr>
              ))}
              {result.taxPctNum > 0 && (
                <tr>
                  <td className="p-2 font-medium">Tax</td>
                  <td className="p-2 text-slate-600">{result.taxPctNum}%</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(result.afterDiscounts)}</td>
                  <td className="p-2 text-right font-mono text-red-700">+{formatCurrency(result.taxAmt)}</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(result.afterTax)}</td>
                </tr>
              )}
              {result.cashbackPctNum > 0 && (
                <tr>
                  <td className="p-2 font-medium">Cashback</td>
                  <td className="p-2 text-slate-600">{result.cashbackPctNum}%</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(result.afterTax)}</td>
                  <td className="p-2 text-right font-mono text-emerald-700">−{formatCurrency(result.cashbackAmt)}</td>
                  <td className="p-2 text-right font-mono">{formatCurrency(result.net)}</td>
                </tr>
              )}
              <tr className="bg-slate-50 font-semibold">
                <td className="p-2">Net cost</td>
                <td className="p-2" />
                <td className="p-2" />
                <td className="p-2" />
                <td className="p-2 text-right font-mono">{formatCurrency(result.net)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {result && (() => {
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: `${result.layers.length} discount layer${result.layers.length === 1 ? '' : 's'} stacked → pay ${formatCurrency(result.afterTax)} at checkout, net ${formatCurrency(result.net)} after cashback. Effective ${result.effectivePct.toFixed(1)}% off.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Original', value: formatCurrency(result.p) },
              { label: 'After discounts', value: formatCurrency(result.afterDiscounts) },
              ...(result.taxPctNum > 0 ? [{ label: 'Checkout (with tax)', value: formatCurrency(result.afterTax) }] : []),
              ...(result.cashbackPctNum > 0 ? [{ label: 'Cashback earned', value: formatCurrency(result.cashbackAmt) }] : []),
              { label: 'Net cost', value: formatCurrency(result.net) },
              { label: 'You save', value: formatCurrency(result.p - result.net) },
              { label: 'Effective %', value: `${result.effectivePct.toFixed(1)}%` },
            ],
          },
          result.sumOfLayers > result.effectivePct + 0.1
            ? {
                kind: 'takeaway',
                text: `Your percent discounts add up to ${result.sumOfLayers.toFixed(1)}% on paper, but the effective discount is ${result.effectivePct.toFixed(1)}% — stacked percentages multiply the remaining price, so each subsequent discount takes a smaller cut.`,
              }
            : null,
          result.cashbackPctNum > 0
            ? {
                kind: 'takeaway',
                text: `Cashback is a rebate earned after payment, not a price cut at checkout. You still pay ${formatCurrency(result.afterTax)} at the register; ${formatCurrency(result.cashbackAmt)} comes back later.`,
              }
            : null,
          {
            kind: 'nextStep',
            actions: [
              { href: '/calculators/discount-calculator/', label: 'Simple Discount Calculator' },
              { href: '/calculators/tip-calculator/', label: 'Tip Calculator' },
              { href: '/calculators/percent-change-calculator/', label: 'Percent Change' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">How the stack works</p>
        <p className="mt-1 text-xs text-slate-600">
          Discounts apply in order. Each percent discount is taken on the price remaining after the previous step — this is why stacked percentages are always less than their sum. A dollar coupon is subtracted as a flat amount before the next percent discount. Tax is applied after all discounts. Cashback is a rebate on the post-tax total and does not reduce what you pay at the register.
        </p>
      </div>
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

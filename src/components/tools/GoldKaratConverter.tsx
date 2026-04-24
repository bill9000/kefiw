import { useMemo, useState } from 'react';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

const KARATS = [9, 10, 12, 14, 18, 20, 21, 22, 24];

export default function GoldKaratConverter() {
  const [mass, setMass] = useState<number>(10);
  const [fromKarat, setFromKarat] = useState<number>(24);
  const [toKarat, setToKarat] = useState<number>(22);

  const result = useMemo(() => {
    if (mass <= 0 || fromKarat <= 0 || toKarat <= 0) return null;
    const pureGoldG = mass * (fromKarat / 24);
    const targetMass = pureGoldG * (24 / toKarat);
    const alloyAdded = targetMass - mass;
    return { pureGoldG, targetMass, alloyAdded, fromPurity: fromKarat / 24, toPurity: toKarat / 24 };
  }, [mass, fromKarat, toKarat]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="mass">Weight (grams)</label>
          <input
            id="mass"
            type="number"
            min={0}
            step="0.01"
            value={mass}
            onChange={(e) => setMass(Math.max(0, Number(e.target.value) || 0))}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="from">From</label>
          <select id="from" value={fromKarat} onChange={(e) => setFromKarat(Number(e.target.value))} className="input">
            {KARATS.map((k) => (
              <option key={k} value={k}>{k}K{k === 24 ? ' (pure)' : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="to">To</label>
          <select id="to" value={toKarat} onChange={(e) => setToKarat(Number(e.target.value))} className="input">
            {KARATS.map((k) => (
              <option key={k} value={k}>{k}K{k === 24 ? ' (pure)' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {result && (
        <div className="card border-amber-200 bg-amber-50 p-4 text-center">
          <div className="text-xs font-medium uppercase tracking-wide text-amber-700">
            {mass} g of {fromKarat}K →
          </div>
          <div className="mt-1 text-3xl font-bold text-amber-900">
            {result.targetMass.toFixed(3)} g of {toKarat}K
          </div>
          <div className="text-xs text-amber-700">
            Same pure-gold content: {result.pureGoldG.toFixed(3)} g
          </div>
        </div>
      )}

      {result && (() => {
        const allKaratsFromSource = KARATS.map((k) => ({
          label: `${k}K`,
          value: `${(result.pureGoldG * 24 / k).toFixed(3)} g`,
        }));
        const directionText = fromKarat > toKarat
          ? `Down-karating: to make the alloy less pure, you keep the pure gold and add ${result.alloyAdded.toFixed(3)} g of alloy (copper, silver, zinc). The final piece weighs more than the starting ${mass} g.`
          : fromKarat < toKarat
            ? `Up-karating: to raise the purity, you remove ${Math.abs(result.alloyAdded).toFixed(3)} g of alloy. Practically this is done by refining — most people sell and re-buy instead.`
            : 'Same karat — no change in purity. The masses are equal.';
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: `${mass} g of ${fromKarat}K contains ${result.pureGoldG.toFixed(3)} g of pure gold. To match that pure-gold content in ${toKarat}K, you need ${result.targetMass.toFixed(3)} g.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Starting mass', value: `${mass} g ${fromKarat}K` },
              { label: 'Starting purity', value: `${(result.fromPurity * 100).toFixed(2)}%` },
              { label: 'Pure gold', value: `${result.pureGoldG.toFixed(3)} g` },
              { label: 'Target purity', value: `${(result.toPurity * 100).toFixed(2)}%` },
              { label: 'Target mass', value: `${result.targetMass.toFixed(3)} g` },
              { label: 'Mass Δ', value: `${result.alloyAdded >= 0 ? '+' : ''}${result.alloyAdded.toFixed(3)} g` },
            ],
          },
          {
            kind: 'comparison',
            title: `${result.pureGoldG.toFixed(3)} g pure gold, expressed at every karat`,
            rows: allKaratsFromSource,
          },
          { kind: 'takeaway', text: directionText },
          {
            kind: 'nextStep',
            actions: [
              { href: '/calculators/gold-value-calculator/', label: 'Gold value calculator' },
              { href: '/calculators/percent-of-calculator/', label: 'Percent of calculator' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">The math</p>
        <p className="mt-1 text-xs text-slate-600 font-mono">
          pure_gold = mass × (from_karat ÷ 24)<br />
          target_mass = pure_gold × (24 ÷ to_karat)
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Karat expresses the proportion of pure gold in 24 parts. 24K is 99.9%+ pure. 22K is 22/24 = 91.67% pure. 18K is 75%. 14K is 58.33%. 10K is 41.67%. The remainder is alloy metals (mostly copper, silver, zinc, nickel) added for hardness and color.
        </p>
      </div>
    </div>
  );
}

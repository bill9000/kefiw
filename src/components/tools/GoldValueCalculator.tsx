import { useMemo, useState } from 'react';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

// Mass-unit conversions into grams. User enters mass in their preferred unit.
const UNIT_TO_GRAMS: Record<string, number> = {
  g: 1,
  ozt: 31.1034768, // troy ounce
  dwt: 1.55517384, // pennyweight
  grain: 0.06479891,
};

const UNIT_LABEL: Record<string, string> = {
  g: 'grams',
  ozt: 'troy oz',
  dwt: 'pennyweight',
  grain: 'grains',
};

const KARATS = [9, 10, 12, 14, 18, 20, 21, 22, 24];

function formatMoney(n: number, currency: string): string {
  if (!isFinite(n)) return '—';
  return n.toLocaleString(undefined, { style: 'currency', currency, maximumFractionDigits: 2 });
}

function formatMass(g: number): string {
  if (!isFinite(g)) return '—';
  if (g >= 1) return g.toFixed(3) + ' g';
  return (g * 1000).toFixed(1) + ' mg';
}

export default function GoldValueCalculator() {
  const [mass, setMass] = useState<number>(10);
  const [unit, setUnit] = useState<string>('g');
  const [karat, setKarat] = useState<number>(22);
  const [spotPerGram, setSpotPerGram] = useState<number>(85);
  const [currency, setCurrency] = useState<string>('USD');

  const result = useMemo(() => {
    const grams = mass * (UNIT_TO_GRAMS[unit] ?? 1);
    const purity = karat / 24;
    const pureGoldG = grams * purity;
    const value = pureGoldG * spotPerGram;
    return { grams, purity, pureGoldG, value };
  }, [mass, unit, karat, spotPerGram]);

  const valid = mass > 0 && spotPerGram > 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="mass">Weight</label>
          <div className="flex gap-2">
            <input
              id="mass"
              type="number"
              min={0}
              step="0.01"
              value={mass}
              onChange={(e) => setMass(Math.max(0, Number(e.target.value) || 0))}
              className="input"
            />
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input !w-auto">
              {Object.entries(UNIT_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="label" htmlFor="karat">Karat</label>
          <select id="karat" value={karat} onChange={(e) => setKarat(Number(e.target.value))} className="input">
            {KARATS.map((k) => (
              <option key={k} value={k}>{k}K{k === 24 ? ' (pure)' : ''}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="spot">Spot price (per gram, pure gold)</label>
          <div className="flex gap-2">
            <input
              id="spot"
              type="number"
              min={0}
              step="0.01"
              value={spotPerGram}
              onChange={(e) => setSpotPerGram(Math.max(0, Number(e.target.value) || 0))}
              className="input"
            />
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="input !w-auto">
              {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR', 'JPY', 'CHF', 'AED', 'SGD'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Look up the current spot price per gram in your currency. The tool doesn&rsquo;t fetch live prices — you enter what you see.
          </p>
        </div>
      </div>

      {valid && (
        <div className="card border-amber-200 bg-amber-50 p-4 text-center">
          <div className="text-xs font-medium uppercase tracking-wide text-amber-700">Estimated value</div>
          <div className="mt-1 text-3xl font-bold text-amber-900">{formatMoney(result.value, currency)}</div>
          <div className="text-xs text-amber-700">
            {formatMass(result.pureGoldG)} pure gold · {result.grams.toFixed(3)} g {karat}K
          </div>
        </div>
      )}

      {valid && (() => {
        const altKarats = KARATS.filter((k) => k !== karat);
        const perKaratEquivMass = altKarats.map((k) => ({
          label: `${k}K`,
          value: `${(result.pureGoldG * 24 / k).toFixed(2)} g`,
        }));
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: `${result.grams.toFixed(3)} g of ${karat}K gold contains ${result.pureGoldG.toFixed(3)} g of pure gold — ${formatMoney(result.value, currency)} at ${formatMoney(spotPerGram, currency)}/g.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Weight', value: `${result.grams.toFixed(3)} g` },
              { label: 'Karat', value: `${karat}K` },
              { label: 'Purity', value: `${(result.purity * 100).toFixed(2)}%` },
              { label: 'Pure gold', value: formatMass(result.pureGoldG) },
              { label: 'Spot/g', value: formatMoney(spotPerGram, currency) },
              { label: 'Value', value: formatMoney(result.value, currency) },
            ],
          },
          {
            kind: 'comparison',
            title: 'Equivalent mass at other karats (same pure-gold content)',
            rows: perKaratEquivMass,
          },
          {
            kind: 'takeaway',
            text: karat === 24
              ? 'Pure 24K gold — every gram of the piece is gold.'
              : `A ${karat}K piece is ${(result.purity * 100).toFixed(1)}% gold by weight. The rest is alloy metals (copper, silver, zinc) that give the piece durability and color.`,
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/calculators/gold-karat-converter/', label: 'Karat converter' },
              { href: '/calculators/percent-of-calculator/', label: 'Percent of calculator' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-medium text-slate-900">How the value is calculated</p>
        <p className="mt-1 text-xs text-slate-600 font-mono">
          value = (weight_in_grams) × (karat ÷ 24) × (spot_price_per_gram)
        </p>
        <p className="mt-2 text-xs text-slate-600">
          Dealers typically pay less than spot because they take a margin. Retail jewelry prices include making charges, design, and markup — this tool estimates the melt value, not the retail or jewelry resale price.
        </p>
      </div>
    </div>
  );
}

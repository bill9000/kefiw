import { useMemo, useState } from "react";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const fmtPct = (n: number): string => `${(n * 100).toFixed(1)}%`;

// Cost-vs-Value style recoup percentages — set conservatively. Real recoup
// varies a lot by market and time-on-market; use these as sanity bands.
const RECOUP_BANDS = {
  selling_now: { low: 0.55, mid: 0.65, high: 0.75 },     // current sale
  selling_1yr: { low: 0.50, mid: 0.62, high: 0.72 },     // sale within 12 months
  selling_3yr: { low: 0.40, mid: 0.50, high: 0.60 },     // sale within 3 years (depreciation kicks in)
  selling_5yr: { low: 0.30, mid: 0.40, high: 0.50 },     // sale within 5+ years
  long_hold:   { low: 0.10, mid: 0.20, high: 0.30 },     // 10+ years (other factors dominate)
};

type SaleHorizon = keyof typeof RECOUP_BANDS;
const HORIZONS: Array<{ id: SaleHorizon; label: string }> = [
  { id: "selling_now", label: "Selling now (within 6 months)" },
  { id: "selling_1yr", label: "Selling in ~1 year" },
  { id: "selling_3yr", label: "Selling in 2–3 years" },
  { id: "selling_5yr", label: "Selling in 4–6 years" },
  { id: "long_hold",   label: "Long-hold (10+ years)" },
];

export default function RoofRoiCalculator(): JSX.Element {
  const [homeValue, setHomeValue] = useState<number>(425000);
  const [roofCost, setRoofCost] = useState<number>(14000);
  const [oldRoofYears, setOldRoofYears] = useState<number>(22);
  const [horizon, setHorizon] = useState<SaleHorizon>("selling_1yr");
  const [marketCondition, setMarketCondition] = useState<"buyer" | "balanced" | "seller">("balanced");

  const out = useMemo(() => {
    const band = RECOUP_BANDS[horizon];
    const marketAdj =
      marketCondition === "buyer"   ? -0.05 :
      marketCondition === "seller"  ? +0.05 :
                                       0.0;
    const recoupLow  = Math.max(0, band.low  + marketAdj);
    const recoupMid  = Math.max(0, band.mid  + marketAdj);
    const recoupHigh = Math.max(0, band.high + marketAdj);

    const upliftLow  = roofCost * recoupLow;
    const upliftMid  = roofCost * recoupMid;
    const upliftHigh = roofCost * recoupHigh;

    const netCostLow  = roofCost - upliftHigh;
    const netCostMid  = roofCost - upliftMid;
    const netCostHigh = roofCost - upliftLow;

    // Rough framing: in a buyer's eye, an aged roof becomes a price-cut request.
    // Estimate 1.5× the replacement cost as the typical buyer concession when the
    // roof is past its lifespan — they assume they'll pay more, AND want margin.
    const buyerConcessionEstimate = oldRoofYears > 20 ? roofCost * 1.5 : roofCost * 0.5;

    return {
      recoupLow, recoupMid, recoupHigh,
      upliftLow, upliftMid, upliftHigh,
      netCostLow, netCostMid, netCostHigh,
      buyerConcessionEstimate,
    };
  }, [roofCost, horizon, marketCondition, oldRoofYears]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Your situation</h3>

        <Field label="Estimated home value">
          <Money value={homeValue} set={setHomeValue} />
        </Field>

        <Field label="Roof replacement cost (your estimate)">
          <Money value={roofCost} set={setRoofCost} />
          <Hint>If you don't know, run the <a href="/homelab/roof-replacement-cost-calculator/" className="text-amber-700 hover:underline">main cost calculator</a> first.</Hint>
        </Field>

        <Field label="Current roof age (years)">
          <Num value={oldRoofYears} set={setOldRoofYears} min={0} max={60} step={1} />
          <Hint>An aged roof affects buyer concessions even if you choose not to replace.</Hint>
        </Field>

        <Field label="Sale horizon">
          <select value={horizon} onChange={(e) => setHorizon(e.target.value as SaleHorizon)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {HORIZONS.map((h) => <option key={h.id} value={h.id}>{h.label}</option>)}
          </select>
        </Field>

        <Field label="Market condition">
          <select value={marketCondition} onChange={(e) => setMarketCondition(e.target.value as "buyer" | "balanced" | "seller")} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            <option value="buyer">Buyer's market (concessions are common)</option>
            <option value="balanced">Balanced</option>
            <option value="seller">Seller's market (multiple offers)</option>
          </select>
        </Field>
      </section>

      <section aria-label="Output" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Estimated resale uplift</div>
        <div className="text-3xl font-bold tabular-nums text-slate-900">
          {fmtUSD(out.upliftLow)}–{fmtUSD(out.upliftHigh)}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          That's {fmtPct(out.recoupLow)}–{fmtPct(out.recoupHigh)} of the {fmtUSD(roofCost)} roof cost recouped.
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Net cost to you</div>
          <div className="mt-1 text-lg font-semibold text-slate-900 tabular-nums">
            {fmtUSD(Math.max(0, out.netCostLow))}–{fmtUSD(Math.max(0, out.netCostHigh))}
          </div>
          <div className="mt-1 text-xs text-slate-600">
            (Roof cost minus expected resale uplift, low–high range.)
          </div>
        </div>

        {oldRoofYears > 20 && (
          <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <div className="font-semibold">If you don't replace…</div>
            <p className="mt-1 text-xs">
              On a roof past 20 years, buyers and inspectors will flag it. Expected concession at sale (price reduction or credit at closing): roughly <strong>{fmtUSD(out.buyerConcessionEstimate)}</strong> — often more than the replacement cost itself, because buyers add a margin for unknowns. Replacing pre-listing usually beats negotiating against an aged roof.
            </p>
          </div>
        )}

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">How recoup % is set</summary>
          <div className="mt-2 space-y-1 text-xs text-slate-700">
            <p>
              Bands draw on Remodeling magazine's annual Cost vs Value report and observed Houston-market patterns. Roof replacements typically recoup 55–75% if sold within 12 months of the install; recoup decays each year as the roof "ages into" the home and stops looking new.
            </p>
            <p>
              Market-condition adjustment (±5%) reflects the fact that in a seller's market, buyers attribute more value to a recent roof; in a buyer's market they expect it as a baseline.
            </p>
            <p>
              Long-hold scenarios show low recoup because by year 10, the new roof has aged enough that buyers don't see it as new — but you've also enjoyed a decade of leak-free ownership.
            </p>
          </div>
        </details>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          ROI estimates ignore the value of <strong>not having a leak</strong> over your hold period. A new roof is partly insurance against interior damage; the cost of a single drywall + flooring repair from a leak can exceed $5,000 on its own.
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
  return (
    <div className="mt-3">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
function Hint({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="mt-1 text-[11px] text-slate-500">{children}</div>;
}
function Money({ value, set }: { value: number; set: (n: number) => void }): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-slate-500">$</span>
      <input
        type="number" inputMode="numeric" min={0} step={500}
        value={value}
        onChange={(e) => set(Number(e.target.value) || 0)}
        className="w-32 rounded border border-slate-300 px-2 py-1 text-sm"
      />
    </div>
  );
}
function Num({ value, set, min, max, step }: { value: number; set: (n: number) => void; min: number; max: number; step: number }): JSX.Element {
  return (
    <input
      type="number" inputMode="numeric" min={min} max={max} step={step}
      value={value}
      onChange={(e) => set(Number(e.target.value) || 0)}
      className="w-32 rounded border border-slate-300 px-2 py-1 text-sm"
    />
  );
}

import { useMemo, useState } from "react";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const SHEET_SQFT = 32; // 4' × 8'

interface DeckingType {
  id: string;
  label: string;
  pricePerSheetLow: number;
  pricePerSheetHigh: number;
  laborPerSheetLow: number;
  laborPerSheetHigh: number;
  note: string;
}

const DECKING_TYPES: DeckingType[] = [
  { id: "osb-7-16", label: "7/16″ OSB (most common)",      pricePerSheetLow: 22, pricePerSheetHigh: 38, laborPerSheetLow: 22, laborPerSheetHigh: 35, note: "Cheapest. Code-acceptable for most residential. Loses strength when wet — not ideal in humid attics." },
  { id: "osb-19-32", label: "19/32″ OSB (heavier)",        pricePerSheetLow: 28, pricePerSheetHigh: 45, laborPerSheetLow: 22, laborPerSheetHigh: 35, note: "More fastener-holding strength. Commonly required by code for high-wind regions." },
  { id: "ply-1-2",  label: "1/2″ plywood (CDX)",            pricePerSheetLow: 38, pricePerSheetHigh: 62, laborPerSheetLow: 22, laborPerSheetHigh: 35, note: "Better moisture tolerance than OSB. Slightly higher cost. Common upgrade in coastal markets." },
  { id: "ply-5-8",  label: "5/8″ plywood (CDX)",            pricePerSheetLow: 48, pricePerSheetHigh: 78, laborPerSheetLow: 25, laborPerSheetHigh: 38, note: "Highest strength and moisture tolerance. Required by some HVHZ codes (Florida)." },
];

export default function DeckingReplacementCalculator(): JSX.Element {
  const [roofSqft, setRoofSqft] = useState<number>(2400);
  const [replacePct, setReplacePct] = useState<number>(15);
  const [typeId, setTypeId] = useState<string>("osb-7-16");

  const deckType = DECKING_TYPES.find((d) => d.id === typeId) ?? DECKING_TYPES[0];

  const out = useMemo(() => {
    const replaceSqft = roofSqft * (replacePct / 100);
    const sheets = Math.ceil(replaceSqft / SHEET_SQFT);
    const matLow = sheets * deckType.pricePerSheetLow;
    const matHigh = sheets * deckType.pricePerSheetHigh;
    const labLow = sheets * deckType.laborPerSheetLow;
    const labHigh = sheets * deckType.laborPerSheetHigh;
    return {
      replaceSqft, sheets,
      matLow, matHigh, labLow, labHigh,
      totalLow: matLow + labLow,
      totalHigh: matHigh + labHigh,
    };
  }, [roofSqft, replacePct, deckType]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Decking inputs</h3>

        <Field label="Total roof surface (sqft)">
          <Num value={roofSqft} set={setRoofSqft} min={100} max={20000} step={50} />
        </Field>

        <Field label="Estimated replacement (% of roof)">
          <Num value={replacePct} set={setReplacePct} min={0} max={100} step={5} />
          <Hint>Most jobs replace 5–15% of decking once tear-off exposes rot. Older roofs (25+ years) or any leak history can push 25%+.</Hint>
        </Field>

        <Field label="Decking type">
          <select value={typeId} onChange={(e) => setTypeId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {DECKING_TYPES.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
          </select>
          <Hint>{deckType.note}</Hint>
        </Field>
      </section>

      <section aria-label="Result" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <Row label="Replacement area" value={`${Math.round(out.replaceSqft)} sqft`} />
          <Row label="4×8 sheets needed" value={`${out.sheets}`} bold />
          <Row label="Material cost" value={`${fmtUSD(out.matLow)}–${fmtUSD(out.matHigh)}`} />
          <Row label="Labor cost (replacement)" value={`${fmtUSD(out.labLow)}–${fmtUSD(out.labHigh)}`} />
          <Row label="Total replacement cost" value={`${fmtUSD(out.totalLow)}–${fmtUSD(out.totalHigh)}`} bold />
        </div>

        <div className="mt-4 rounded-md border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-900">
          <div className="text-xs font-semibold">The "decking surprise" line item</div>
          <p className="mt-1 text-xs">
            Most contractor bids quote a per-sheet replacement price assuming an unknown number of bad sheets. Get this <strong>itemized in writing</strong>. A bid that says "decking included" or quotes a flat decking allowance is hiding the variability — you can end up paying $1,000+ more (or, with an honest contractor, less) than expected.
          </p>
        </div>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">Signs you'll need more replacement</summary>
          <ul className="mt-2 list-disc pl-5 text-xs text-slate-700 space-y-1">
            <li><strong>Visible sag</strong> between rafters — soft spots underfoot during inspection.</li>
            <li><strong>Stains on the ceiling below</strong> — especially around chimneys, vents, valleys.</li>
            <li><strong>Multi-decade roof age</strong> — 30+ year asphalt, 50+ year metal, 60+ year tile.</li>
            <li><strong>Past leak repairs</strong> — caulk and patch over wet decking creates rot incubators.</li>
            <li><strong>No vapor barrier</strong> — moist Texas attics rot decking from below.</li>
          </ul>
        </details>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/roof-replacement-cost-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Replacement Cost Calculator</div>
            <div className="text-xs text-slate-600">The main calc bakes a decking-rot risk premium into the headline range.</div>
          </a>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }): JSX.Element {
  return <div className="mt-3"><label className="block text-sm font-medium text-slate-800">{label}</label><div className="mt-1">{children}</div></div>;
}
function Hint({ children }: { children: React.ReactNode }): JSX.Element {
  return <div className="mt-1 text-[11px] text-slate-500">{children}</div>;
}
function Num({ value, set, min, max, step }: { value: number; set: (n: number) => void; min: number; max: number; step: number }): JSX.Element {
  return <input type="number" inputMode="numeric" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value) || 0)} className="w-32 rounded border border-slate-300 px-2 py-1 text-sm" />;
}
function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }): JSX.Element {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-slate-200 py-1">
      <span className="text-slate-700">{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-slate-900" : "font-semibold text-slate-900"}`}>{value}</span>
    </div>
  );
}

import { useMemo, useState } from "react";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const ROLL_SQFT = 200;
const ROLL_PRICE_LOW = 110;
const ROLL_PRICE_HIGH = 175;

export default function IceWaterShieldCalculator(): JSX.Element {
  const [eaveLF, setEaveLF] = useState<number>(110);
  const [eaveCoverInches, setEaveCoverInches] = useState<number>(36); // 24" inside heated wall typical → ~36" total
  const [valleyLF, setValleyLF] = useState<number>(40);
  const [valleyCoverInches, setValleyCoverInches] = useState<number>(36);
  const [lowSlopeSqft, setLowSlopeSqft] = useState<number>(0);
  const [penetrations, setPenetrations] = useState<number>(6);
  const [penSqftEach, setPenSqftEach] = useState<number>(9); // 18" beyond on all sides ≈ 9 sqft per typical penetration
  const [wastePct, setWastePct] = useState<number>(10);

  const out = useMemo(() => {
    const eaveSqft = eaveLF * (eaveCoverInches / 12);
    const valleySqft = valleyLF * (valleyCoverInches / 12);
    const penSqft = penetrations * penSqftEach;
    const baseSqft = eaveSqft + valleySqft + lowSlopeSqft + penSqft;
    const totalSqft = baseSqft * (1 + wastePct / 100);
    const rolls = Math.ceil(totalSqft / ROLL_SQFT);
    const costLow = rolls * ROLL_PRICE_LOW;
    const costHigh = rolls * ROLL_PRICE_HIGH;
    return { eaveSqft, valleySqft, penSqft, baseSqft, totalSqft, rolls, costLow, costHigh };
  }, [eaveLF, eaveCoverInches, valleyLF, valleyCoverInches, lowSlopeSqft, penetrations, penSqftEach, wastePct]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Where I&amp;W shield goes</h3>

        <Field label="Eaves — total linear feet">
          <Num value={eaveLF} set={setEaveLF} min={0} max={1000} step={5} />
          <Hint>The bottom edge of every roof slope. Wraps the entire perimeter of the dripline.</Hint>
        </Field>

        <Field label="Eave coverage height (inches)">
          <Num value={eaveCoverInches} set={setEaveCoverInches} min={18} max={72} step={6} />
          <Hint>Code: at least 24″ <em>inside</em> the heated wall plane. With overhangs that's typically 36″ total height. Cold-climate code may require 48″+.</Hint>
        </Field>

        <Field label="Valleys — total linear feet">
          <Num value={valleyLF} set={setValleyLF} min={0} max={500} step={5} />
        </Field>

        <Field label="Valley coverage width (inches, total — split evenly each side)">
          <Num value={valleyCoverInches} set={setValleyCoverInches} min={24} max={72} step={6} />
        </Field>

        <Field label="Low-slope sections (sqft of any roof at &lt;4:12)">
          <Num value={lowSlopeSqft} set={setLowSlopeSqft} min={0} max={5000} step={50} />
          <Hint>Code requires full coverage over any low-slope area when shingles are used.</Hint>
        </Field>

        <Field label="Penetrations (skylights, chimneys, vent stacks, dormers)">
          <Num value={penetrations} set={setPenetrations} min={0} max={30} step={1} />
        </Field>

        <Field label="Sqft per penetration (18″ beyond on each side ≈ 9 sqft typical)">
          <Num value={penSqftEach} set={setPenSqftEach} min={4} max={50} step={1} />
        </Field>

        <Field label="Waste %">
          <Num value={wastePct} set={setWastePct} min={5} max={25} step={1} />
        </Field>
      </section>

      <section aria-label="Result" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <Row label="Eaves coverage" value={`${Math.round(out.eaveSqft)} sqft`} />
          <Row label="Valleys coverage" value={`${Math.round(out.valleySqft)} sqft`} />
          <Row label="Low-slope coverage" value={`${Math.round(lowSlopeSqft)} sqft`} />
          <Row label="Penetrations" value={`${Math.round(out.penSqft)} sqft`} />
          <Row label="Total with waste" value={`${Math.round(out.totalSqft)} sqft`} bold />
        </div>

        <div className="mt-4 rounded-md border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-900">
          <div className="text-xs uppercase tracking-[0.18em]">Rolls needed</div>
          <div className="text-3xl font-bold tabular-nums">{out.rolls}</div>
          <div className="mt-1 text-xs">
            ~{ROLL_SQFT} sqft per roll · material cost <strong>{fmtUSD(out.costLow)}–{fmtUSD(out.costHigh)}</strong>
          </div>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <strong>Why I&amp;W matters in the South.</strong> The "ice" part is misleading — Texas, Florida, and Gulf-coast roofs almost never see ice dams. But I&amp;W shield is also the best defense against <strong>wind-driven rain</strong>, the actual enemy in our markets. Eaves, valleys, and around penetrations are the three places where rain pushes uphill against the shingle pattern. I&amp;W seals around the nails and fasteners; standard underlayment doesn't.
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/underlayment-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Underlayment Calculator</div>
            <div className="text-xs text-slate-600">For the field underlayment that goes ON TOP of I&amp;W shield.</div>
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

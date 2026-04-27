import { useMemo, useState } from "react";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

interface UnderlaymentType {
  id: string;
  label: string;
  sqftPerRoll: number;
  pricePerRollLow: number;
  pricePerRollHigh: number;
  note: string;
}

const UNDERLAYMENTS: UnderlaymentType[] = [
  { id: "synthetic", label: "Synthetic underlayment (modern standard)", sqftPerRoll: 1000, pricePerRollLow: 90,  pricePerRollHigh: 160, note: "Tear-resistant, walkable, UV-stable for 90+ days. Adds 20–35 yr to the underlayment system." },
  { id: "felt15",    label: "15# felt (legacy)",                         sqftPerRoll: 432,  pricePerRollLow: 22,  pricePerRollHigh: 38,  note: "Cheap. Tears easily, degrades fast in heat. Acceptable to code in most jurisdictions but a value-engineering tell on a bid." },
  { id: "felt30",    label: "30# felt (slightly heavier)",               sqftPerRoll: 216,  pricePerRollLow: 30,  pricePerRollHigh: 50,  note: "Slightly more durable than 15#. Required by code under tile in some jurisdictions; not common otherwise." },
];

export default function UnderlaymentCalculator(): JSX.Element {
  const [roofSqft, setRoofSqft] = useState<number>(2400);
  const [overlapPct, setOverlapPct] = useState<number>(15);
  const [typeId, setTypeId] = useState<string>("synthetic");

  const type = UNDERLAYMENTS.find((u) => u.id === typeId) ?? UNDERLAYMENTS[0];

  const out = useMemo(() => {
    const effective = roofSqft * (1 + overlapPct / 100);
    const rolls = Math.ceil(effective / type.sqftPerRoll);
    const costLow = rolls * type.pricePerRollLow;
    const costHigh = rolls * type.pricePerRollHigh;
    return { effective, rolls, costLow, costHigh };
  }, [roofSqft, overlapPct, type]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Inputs</h3>

        <Field label="Roof surface (sqft)">
          <Num value={roofSqft} set={setRoofSqft} min={100} max={20000} step={50} />
          <Hint>Use the roof sqft, not home sqft. <a href="/homelab/roof-square-footage-calculator/" className="underline">Estimate it here</a>.</Hint>
        </Field>

        <Field label="Overlap allowance (%)">
          <Num value={overlapPct} set={setOverlapPct} min={5} max={30} step={1} />
          <Hint>Underlayment laps each course over the next. 15% is typical for synthetic; 18–20% for felt (more laps, narrower rolls).</Hint>
        </Field>

        <Field label="Underlayment type">
          <select value={typeId} onChange={(e) => setTypeId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {UNDERLAYMENTS.map((u) => <option key={u.id} value={u.id}>{u.label} · {u.sqftPerRoll} sqft/roll</option>)}
          </select>
          <Hint>{type.note}</Hint>
        </Field>
      </section>

      <section aria-label="Result" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <Row label="Effective area (with overlap)" value={`${Math.round(out.effective).toLocaleString()} sqft`} />
          <Row label="Rolls needed" value={`${out.rolls}`} bold />
          <Row label="Material cost range" value={`${fmtUSD(out.costLow)}–${fmtUSD(out.costHigh)}`} bold />
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700">
          <strong>Why synthetic is worth the upcharge.</strong> On a typical 2,400 sqft roof, synthetic costs $250–$450 vs $80–$200 for 15# felt. The synthetic upcharge is ~$200 — and synthetic adds an extra 15–20 years of failure-resistance, plus tearing protection during a partial tear-off and re-cover. Cost-of-failure math heavily favors synthetic.
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/ice-water-shield-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Ice & Water Shield Calculator</div>
            <div className="text-xs text-slate-600">For eaves, valleys, and low-slope sections — the membrane that goes UNDER the underlayment.</div>
          </a>
          <a href="/homelab/roof-replacement-cost-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Replacement Cost Calculator</div>
            <div className="text-xs text-slate-600">Underlayment is bundled into the material per-square cost on the main calc.</div>
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

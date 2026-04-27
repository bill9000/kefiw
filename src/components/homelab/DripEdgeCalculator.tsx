import { useMemo, useState } from "react";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const PIECE_LF = 10; // standard 10-foot drip edge piece
const PRICE_PER_PIECE_LOW = 11;
const PRICE_PER_PIECE_HIGH = 22;

export default function DripEdgeCalculator(): JSX.Element {
  const [eaveLF, setEaveLF] = useState<number>(110);
  const [rakeLF, setRakeLF] = useState<number>(120);
  const [overlapPct, setOverlapPct] = useState<number>(8);

  const out = useMemo(() => {
    const totalLF = (eaveLF + rakeLF) * (1 + overlapPct / 100);
    const pieces = Math.ceil(totalLF / PIECE_LF);
    const costLow = pieces * PRICE_PER_PIECE_LOW;
    const costHigh = pieces * PRICE_PER_PIECE_HIGH;
    return { totalLF, pieces, costLow, costHigh };
  }, [eaveLF, rakeLF, overlapPct]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Edge measurements</h3>

        <Field label="Eaves — total linear feet (bottom edges)">
          <Num value={eaveLF} set={setEaveLF} min={0} max={1000} step={5} />
          <Hint>Walk the perimeter of every roof slope's dripline. Add them up.</Hint>
        </Field>

        <Field label="Rakes — total linear feet (sloped side edges)">
          <Num value={rakeLF} set={setRakeLF} min={0} max={1000} step={5} />
          <Hint>The angled edges of gables and dormers. Measured along the slope, not horizontally.</Hint>
        </Field>

        <Field label="Overlap & cuts (%)">
          <Num value={overlapPct} set={setOverlapPct} min={5} max={20} step={1} />
          <Hint>Each piece overlaps the next by 1–2″. Plus mitre cuts at corners.</Hint>
        </Field>
      </section>

      <section aria-label="Result" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <Row label="Total drip edge needed" value={`${Math.round(out.totalLF)} LF`} />
          <Row label={`10-foot pieces`} value={`${out.pieces}`} bold />
          <Row label="Material cost range" value={`${fmtUSD(out.costLow)}–${fmtUSD(out.costHigh)}`} bold />
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700">
          <strong>Drip edge is now code in most jurisdictions.</strong> Pre-2012 IRC didn't require it; current code does at all eaves and rakes. If your bid doesn't itemize drip edge, ask why — it's a $250–$400 line item that some bids "forget" to keep their headline number low.
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <strong>Color and profile.</strong> Drip edge comes in mill-finish aluminum, white, brown, and color-matched options. Match it to your trim color, not your shingle — the drip edge is visible from the ground at the eave line.
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/ice-water-shield-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Ice & Water Shield Calculator</div>
            <div className="text-xs text-slate-600">I&amp;W shield goes UNDER drip edge at eaves. The order is: deck → drip edge at eave (under) → I&amp;W → underlayment → drip edge at rake (over).</div>
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

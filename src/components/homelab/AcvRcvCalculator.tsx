import { useMemo, useState } from "react";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const LIFESPAN_PRESETS: Array<{ id: string; label: string; years: number }> = [
  { id: "asphalt-3tab",  label: "Asphalt — 3-tab",                     years: 18 },
  { id: "asphalt-arch",  label: "Asphalt — architectural / dimensional", years: 28 },
  { id: "asphalt-lux",   label: "Asphalt — designer / luxury",         years: 35 },
  { id: "metal-exposed", label: "Metal — exposed fastener",            years: 38 },
  { id: "metal-ss",      label: "Metal — standing seam",                years: 50 },
  { id: "tile-concrete", label: "Tile — concrete",                      years: 45 },
  { id: "tile-clay",     label: "Tile — clay (Spanish / barrel)",      years: 60 },
];

export default function AcvRcvCalculator(): JSX.Element {
  const [rcv, setRcv] = useState<number>(18000);
  const [age, setAge] = useState<number>(15);
  const [lifespanId, setLifespanId] = useState<string>("asphalt-arch");
  const [depreciationCap, setDepreciationCap] = useState<number>(80);

  const lifespan = LIFESPAN_PRESETS.find((p) => p.id === lifespanId)?.years ?? 28;

  const out = useMemo(() => {
    const cap = Math.max(0, Math.min(100, depreciationCap)) / 100;
    const rawRatio = age / Math.max(1, lifespan);
    const cappedRatio = Math.min(cap, Math.max(0, rawRatio));
    const depreciation = rcv * cappedRatio;
    const acv = Math.max(0, rcv - depreciation);
    const gap = depreciation;
    return { depreciation, acv, gap, cappedRatio, rawRatio, cappedAt: rawRatio > cap };
  }, [rcv, age, lifespan, depreciationCap]);

  // Build a small table of "what if" by age (every 3 years up to lifespan) for the visual.
  const table = useMemo(() => {
    const rows: Array<{ ageY: number; pct: number; acvVal: number; gap: number }> = [];
    for (let a = 0; a <= Math.min(60, lifespan + 5); a += 3) {
      const r = Math.min(0.8, a / Math.max(1, lifespan));
      rows.push({ ageY: a, pct: r * 100, acvVal: rcv * (1 - r), gap: rcv * r });
    }
    return rows;
  }, [rcv, lifespan]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Inputs</h3>

        <Field label="Replacement Cost Value (RCV)">
          <Money value={rcv} set={setRcv} />
          <Hint>What it costs to install the same roof today — the adjuster's scope number.</Hint>
        </Field>

        <Field label="Roof age (years)">
          <Num value={age} set={setAge} min={0} max={80} step={1} />
        </Field>

        <Field label="Material lifespan reference">
          <select value={lifespanId} onChange={(e) => setLifespanId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {LIFESPAN_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label} · {p.years} yr</option>)}
          </select>
          <Hint>Most carriers use the manufacturer's expected life or an industry-standard table.</Hint>
        </Field>

        <Field label="Depreciation cap (%)">
          <Num value={depreciationCap} set={setDepreciationCap} min={0} max={100} step={5} />
          <Hint>Most carriers cap depreciation at 80% — even a fully end-of-life roof has some salvage value. Some policies cap at 70% or lower.</Hint>
        </Field>
      </section>

      <section aria-label="Output" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <Row label="RCV — Replacement Cost Value" value={fmtUSD(rcv)} bold />
          <Row label="Depreciation" value={`−${fmtUSD(out.depreciation)} (${(out.cappedRatio * 100).toFixed(0)}%)`} muted />
          <Row label="ACV — Actual Cash Value" value={fmtUSD(out.acv)} bold />
        </div>

        <div className="mt-4 rounded-md border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-900">
          <div className="text-xs uppercase tracking-[0.18em]">RCV vs ACV gap</div>
          <div className="text-3xl font-bold tabular-nums">{fmtUSD(out.gap)}</div>
          <div className="mt-1 text-xs">
            On an <strong>RCV policy</strong>, this is recoverable after work is complete. On an <strong>ACV policy</strong>, this is your out-of-pocket on top of the deductible.
          </div>
        </div>

        {out.cappedAt && (
          <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-600">
            Roof is past 100% of expected life ({Math.round(out.rawRatio * 100)}% raw); depreciation capped at {(depreciationCap)}%.
          </div>
        )}

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">Depreciation curve at this RCV</summary>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="text-left py-1">Roof age</th>
                <th className="text-right py-1">Depr %</th>
                <th className="text-right py-1">ACV</th>
                <th className="text-right py-1">Gap</th>
              </tr>
            </thead>
            <tbody>
              {table.map((r) => (
                <tr key={r.ageY} className={`border-b border-slate-100 ${age >= r.ageY && age < r.ageY + 3 ? "bg-amber-50" : ""}`}>
                  <td className="py-1">{r.ageY} yr</td>
                  <td className="text-right py-1 text-slate-600">{r.pct.toFixed(0)}%</td>
                  <td className="text-right py-1 tabular-nums">{fmtUSD(r.acvVal)}</td>
                  <td className="text-right py-1 tabular-nums text-amber-800">{fmtUSD(r.gap)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
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
      <input type="number" inputMode="numeric" min={0} step={500} value={value}
        onChange={(e) => set(Number(e.target.value) || 0)}
        className="w-32 rounded border border-slate-300 px-2 py-1 text-sm" />
    </div>
  );
}
function Num({ value, set, min, max, step }: { value: number; set: (n: number) => void; min: number; max: number; step: number }): JSX.Element {
  return (
    <input type="number" inputMode="numeric" min={min} max={max} step={step} value={value}
      onChange={(e) => set(Number(e.target.value) || 0)}
      className="w-32 rounded border border-slate-300 px-2 py-1 text-sm" />
  );
}
function Row({ label, value, bold, muted }: { label: string; value: string; bold?: boolean; muted?: boolean }): JSX.Element {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-slate-200 py-1">
      <span className={muted ? "text-slate-500" : "text-slate-700"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-slate-900" : muted ? "text-slate-500" : "font-semibold text-slate-900"}`}>{value}</span>
    </div>
  );
}

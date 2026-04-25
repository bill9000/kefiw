import { useMemo, useState } from "react";
import {
  PITCH_LABOR_MULT,
  roofAreaFromHomeSqft,
  type PitchBand,
} from "~/lib/homelab/roof-cost-engine";

type Mode = "home" | "footprint" | "ridge_eave";

const fmt = (n: number): string => Math.round(n).toLocaleString("en-US");

// Pitch geometry multiplier (how much MORE roof surface than the floor area).
// Driven by the same bands as the cost engine so estimates stay consistent.
const PITCH_MULT: Record<PitchBand, { mult: number; label: string; risePerFoot: number }> = {
  low:       { mult: 1.10, label: "Low (3:12 – 6:12)",       risePerFoot: 0.375 },
  medium:    { mult: 1.20, label: "Medium (7:12 – 9:12)",    risePerFoot: 0.667 },
  high:      { mult: 1.35, label: "Steep (10:12 – 12:12)",   risePerFoot: 0.917 },
  very_high: { mult: 1.55, label: "Very steep (>12:12)",     risePerFoot: 1.083 },
};

export default function RoofAreaCalculator(): JSX.Element {
  const [mode, setMode] = useState<Mode>("home");
  const [homeSqft, setHomeSqft] = useState<number>(2200);
  const [footprintSqft, setFootprintSqft] = useState<number>(1600);
  const [ridge, setRidge] = useState<number>(40);
  const [eave, setEave] = useState<number>(28);
  const [planes, setPlanes] = useState<number>(2);
  const [pitch, setPitch] = useState<PitchBand>("medium");
  const [complexityUplift, setComplexityUplift] = useState<number>(5);

  const baseRoofSqft = useMemo<number>(() => {
    if (mode === "home") return roofAreaFromHomeSqft(Math.max(0, homeSqft), pitch);
    if (mode === "footprint") return Math.max(0, footprintSqft) * PITCH_MULT[pitch].mult;
    // ridge × eave × planes is a per-roof-plane area (slope length × eave length)
    return Math.max(0, ridge) * Math.max(0, eave) * Math.max(1, planes);
  }, [mode, homeSqft, footprintSqft, ridge, eave, planes, pitch]);

  const finalRoofSqft = useMemo<number>(() => {
    return baseRoofSqft * (1 + Math.max(0, complexityUplift) / 100);
  }, [baseRoofSqft, complexityUplift]);

  const squares = finalRoofSqft / 100;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Measure roof area</h3>

        <div className="mb-3">
          <div className="text-sm font-medium text-slate-800">Input mode</div>
          <div className="mt-1 inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-sm">
            <ModeButton current={mode} value="home" set={setMode}>Home sqft</ModeButton>
            <ModeButton current={mode} value="footprint" set={setMode}>Footprint sqft</ModeButton>
            <ModeButton current={mode} value="ridge_eave" set={setMode}>Ridge × eave</ModeButton>
          </div>
        </div>

        {mode === "home" && (
          <Field label="Total home square footage (lived-in floor area)">
            <NumInput value={homeSqft} onChange={setHomeSqft} min={400} max={20000} step={50} />
            <Hint>Use this for typical 1- or 2-story homes. Estimate assumes the second floor is on top of the first.</Hint>
          </Field>
        )}

        {mode === "footprint" && (
          <Field label="Ground-floor footprint sqft (just the rectangle the roof covers)">
            <NumInput value={footprintSqft} onChange={setFootprintSqft} min={400} max={20000} step={50} />
            <Hint>Best for single-story homes or when you have a clean floor-plan footprint.</Hint>
          </Field>
        )}

        {mode === "ridge_eave" && (
          <>
            <Field label="Ridge length (ft) — the long top edge of one roof plane">
              <NumInput value={ridge} onChange={setRidge} min={4} max={200} step={1} />
            </Field>
            <Field label="Eave-to-ridge length (ft) — the slope length of that plane">
              <NumInput value={eave} onChange={setEave} min={4} max={120} step={1} />
            </Field>
            <Field label="Number of identical planes">
              <NumInput value={planes} onChange={setPlanes} min={1} max={20} step={1} />
              <Hint>A simple gable has 2 planes. A hip roof has 4. Pitch isn't applied — you measured slope directly.</Hint>
            </Field>
          </>
        )}

        {mode !== "ridge_eave" && (
          <Field label="Roof pitch">
            <select
              value={pitch}
              onChange={(e) => setPitch(e.target.value as PitchBand)}
              className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
            >
              {Object.entries(PITCH_MULT).map(([k, v]) => (
                <option key={k} value={k}>{v.label} · ×{v.mult.toFixed(2)} multiplier</option>
              ))}
            </select>
            <Hint>Steeper pitches put more shingle on the same footprint.</Hint>
          </Field>
        )}

        <Field label="Complexity uplift (% — for dormers, valleys, hips beyond what a simple gable adds)">
          <NumInput value={complexityUplift} onChange={setComplexityUplift} min={0} max={30} step={1} />
          <Hint>0% = clean rectangle. 5–10% = typical hip with one dormer. 15–25% = cut-up roof.</Hint>
        </Field>
      </section>

      <section aria-label="Result" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Estimated roof surface</div>
        <div className="text-3xl font-bold tabular-nums text-slate-900">{fmt(finalRoofSqft)} sqft</div>
        <div className="mt-1 text-sm text-slate-600">
          That's <strong className="text-slate-900">{squares.toFixed(2)} squares</strong> (1 square = 100 sqft).
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700">
          <strong>Sanity check:</strong> a contractor's drone or hand measurement will be more accurate.
          Use this number to ballpark a quote — anything more than 15% off the contractor's measurement is worth questioning.
        </div>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">Math behind the estimate</summary>
          <div className="mt-2 space-y-1 text-xs text-slate-700">
            {mode === "home" && (
              <p>Roof area ≈ home sqft × pitch multiplier. A multi-story home assumes its top story sits inside the lower story's footprint.</p>
            )}
            {mode === "footprint" && (
              <p>Roof area = footprint × pitch multiplier. For pitch X:12, multiplier = √(12² + X²) / 12.</p>
            )}
            {mode === "ridge_eave" && (
              <p>Roof area = ridge × slope-length × number of planes. Pitch is baked into the slope length you provided, so no multiplier is added.</p>
            )}
            <p>Complexity uplift adds extra surface for waste cuts at hips, valleys, dormers, and rake edges.</p>
          </div>
        </details>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/shingle-bundle-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Shingle Bundle Calculator</div>
            <div className="text-xs text-slate-600">Convert these {squares.toFixed(0)} squares into bundles to order.</div>
          </a>
          <a href="/homelab/roof-replacement-cost-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Replacement Cost Calculator</div>
            <div className="text-xs text-slate-600">Plug this area into the full cost calculator.</div>
          </a>
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

function NumInput({ value, onChange, min, max, step }: { value: number; onChange: (n: number) => void; min: number; max: number; step: number }): JSX.Element {
  return (
    <input
      type="number" inputMode="numeric" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="w-32 rounded border border-slate-300 px-2 py-1 text-sm"
    />
  );
}

function ModeButton({ current, value, set, children }: { current: Mode; value: Mode; set: (m: Mode) => void; children: React.ReactNode }): JSX.Element {
  return (
    <button
      type="button"
      onClick={() => set(value)}
      className={`rounded px-3 py-1 ${current === value ? "bg-white shadow text-slate-900" : "text-slate-600"}`}
    >
      {children}
    </button>
  );
}

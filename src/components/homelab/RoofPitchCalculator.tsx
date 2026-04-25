import { useMemo, useState } from "react";

type InputMode = "rise_run" | "degrees" | "ratio";

interface PitchOutputs {
  rise: number;          // inches per 12 inches of run
  degrees: number;       // angle from horizontal
  slopePct: number;      // rise / run × 100
  areaMultiplier: number; // sqrt(1 + (rise/12)^2)
  band: string;
  walkability: string;
  walkabilityColor: "green" | "amber" | "red";
}

function computeFromRise(rise: number): PitchOutputs {
  const r = Math.max(0, rise);
  const radians = Math.atan(r / 12);
  const degrees = (radians * 180) / Math.PI;
  const slopePct = (r / 12) * 100;
  const areaMultiplier = Math.sqrt(1 + Math.pow(r / 12, 2));
  return { rise: r, degrees, slopePct, areaMultiplier, ...classify(r, degrees) };
}

function computeFromDegrees(deg: number): PitchOutputs {
  const d = Math.max(0, Math.min(85, deg));
  const radians = (d * Math.PI) / 180;
  const rise = Math.tan(radians) * 12;
  return computeFromRise(rise);
}

function classify(rise: number, degrees: number): { band: string; walkability: string; walkabilityColor: "green" | "amber" | "red" } {
  if (rise < 2)        return { band: "Very low / nearly flat",   walkability: "Modified bitumen / TPO territory — not shingle.", walkabilityColor: "red" };
  if (rise < 4)        return { band: "Low slope",                walkability: "Walkable. Special underlayment usually required.", walkabilityColor: "green" };
  if (rise <= 6)       return { band: "Conventional low",         walkability: "Walkable. Standard install.",                       walkabilityColor: "green" };
  if (rise <= 9)       return { band: "Conventional medium",      walkability: "Walkable for an experienced crew.",                  walkabilityColor: "green" };
  if (rise <= 12)      return { band: "Steep",                    walkability: "Roof jacks / harness territory. Labor +30–50%.",     walkabilityColor: "amber" };
  if (rise <= 18)      return { band: "Very steep",               walkability: "Full fall-protection setup. Labor +60–100%.",       walkabilityColor: "red" };
  return                      { band: "Cathedral / mansard",     walkability: `${degrees.toFixed(0)}° — scaffold / staging required.`, walkabilityColor: "red" };
}

const COMMON_RATIOS: Array<{ rise: number; label: string }> = [
  { rise: 2,  label: "2:12" },
  { rise: 3,  label: "3:12" },
  { rise: 4,  label: "4:12" },
  { rise: 5,  label: "5:12" },
  { rise: 6,  label: "6:12 — standard ranch" },
  { rise: 7,  label: "7:12" },
  { rise: 8,  label: "8:12 — common 2-story" },
  { rise: 9,  label: "9:12" },
  { rise: 10, label: "10:12" },
  { rise: 12, label: "12:12 — 45°" },
  { rise: 15, label: "15:12" },
  { rise: 18, label: "18:12 — very steep" },
];

export default function RoofPitchCalculator(): JSX.Element {
  const [mode, setMode] = useState<InputMode>("rise_run");
  const [rise, setRise] = useState<number>(6);
  const [degrees, setDegrees] = useState<number>(26.57);
  const [presetRise, setPresetRise] = useState<number>(6);

  const out = useMemo<PitchOutputs>(() => {
    if (mode === "rise_run") return computeFromRise(rise);
    if (mode === "degrees") return computeFromDegrees(degrees);
    return computeFromRise(presetRise);
  }, [mode, rise, degrees, presetRise]);

  // SVG visual: small triangle showing the pitch.
  const visRun = 100;
  const visRise = (out.rise / 12) * visRun;
  const visMaxRise = 200;
  const clampedRise = Math.min(visMaxRise, visRise);

  const colorClass =
    out.walkabilityColor === "green" ? "border-emerald-300 bg-emerald-50 text-emerald-900"
    : out.walkabilityColor === "amber" ? "border-amber-300 bg-amber-50 text-amber-900"
    : "border-rose-300 bg-rose-50 text-rose-900";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Pitch input" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Enter your pitch</h3>

        <div className="mb-3 inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-sm">
          <ModeButton current={mode} value="rise_run" set={setMode}>Rise per 12&quot;</ModeButton>
          <ModeButton current={mode} value="degrees" set={setMode}>Degrees</ModeButton>
          <ModeButton current={mode} value="ratio" set={setMode}>Common ratio</ModeButton>
        </div>

        {mode === "rise_run" && (
          <Field label='Rise (inches per 12" of run)'>
            <input
              type="number" min={0} max={36} step={0.5}
              value={rise}
              onChange={(e) => setRise(Number(e.target.value) || 0)}
              className="w-32 rounded border border-slate-300 px-2 py-1 text-sm"
            />
            <Hint>Most US roofs sit between 4:12 and 9:12. A perfectly flat roof is 0:12; a 45° roof is 12:12.</Hint>
          </Field>
        )}

        {mode === "degrees" && (
          <Field label="Pitch angle (degrees from horizontal)">
            <input
              type="number" min={0} max={85} step={0.5}
              value={degrees}
              onChange={(e) => setDegrees(Number(e.target.value) || 0)}
              className="w-32 rounded border border-slate-300 px-2 py-1 text-sm"
            />
            <Hint>Roofers think in rise:run; architects often quote degrees. 26.57° = 6:12.</Hint>
          </Field>
        )}

        {mode === "ratio" && (
          <Field label="Pick a common ratio">
            <select
              value={presetRise}
              onChange={(e) => setPresetRise(Number(e.target.value))}
              className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
            >
              {COMMON_RATIOS.map((r) => (
                <option key={r.rise} value={r.rise}>{r.label}</option>
              ))}
            </select>
          </Field>
        )}

        <details className="mt-4 text-sm text-slate-700">
          <summary className="cursor-pointer font-medium">How to measure pitch yourself</summary>
          <div className="mt-2 space-y-2 text-xs text-slate-600">
            <p><strong>From the attic:</strong> hold a level horizontally against a rafter. Measure 12 inches along the level, then measure straight up to the underside of the rafter. That vertical measurement is your rise per 12.</p>
            <p><strong>Phone app:</strong> any "level" app on a smartphone laid flat against the roof surface reads the angle in degrees — switch this calculator to degrees mode.</p>
            <p><strong>From a photo:</strong> harder. A drone shot from a known angle is the only reliable photo method; ground photos distort foreshortening.</p>
          </div>
        </details>
      </section>

      <section aria-label="Pitch result" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <div className="flex items-baseline justify-between">
            <span className="text-slate-600">Rise per 12 inches</span>
            <span className="text-2xl font-bold tabular-nums text-slate-900">{out.rise.toFixed(1)} : 12</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-slate-600">Angle</span>
            <span className="text-lg font-semibold tabular-nums text-slate-900">{out.degrees.toFixed(1)}°</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-slate-600">Slope</span>
            <span className="text-lg font-semibold tabular-nums text-slate-900">{out.slopePct.toFixed(0)}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-slate-600">Area multiplier</span>
            <span className="text-lg font-semibold tabular-nums text-slate-900">×{out.areaMultiplier.toFixed(3)}</span>
          </div>
        </div>

        <div className="mt-4">
          <svg viewBox="0 0 220 220" width="100%" height={180} aria-label="Pitch visualization">
            <line x1={20} y1={200} x2={200} y2={200} stroke="#94a3b8" strokeWidth={2} />
            <line
              x1={20} y1={200}
              x2={20 + visRun}
              y2={200 - clampedRise}
              stroke="#0f172a" strokeWidth={3}
            />
            <line
              x1={20 + visRun} y1={200}
              x2={20 + visRun} y2={200 - clampedRise}
              stroke="#cbd5f5" strokeDasharray="4 3" strokeWidth={1.5}
            />
            <text x={20 + visRun + 4} y={200 - clampedRise / 2} fontSize={11} fill="#64748b">
              {out.rise.toFixed(0)}″
            </text>
            <text x={20 + visRun / 2 - 18} y={195} fontSize={11} fill="#64748b">
              12″ run
            </text>
            <path
              d={`M 20 200 L ${20 + visRun} 200 L ${20 + visRun} ${200 - clampedRise} Z`}
              fill="#fef3c7" fillOpacity={0.6}
            />
          </svg>
        </div>

        <div className={`mt-2 rounded-md border px-3 py-2 text-xs ${colorClass}`}>
          <div className="font-semibold">{out.band}</div>
          <div className="mt-0.5">{out.walkability}</div>
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/roof-square-footage-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Square Footage Calculator</div>
            <div className="text-xs text-slate-600">Apply this multiplier (×{out.areaMultiplier.toFixed(3)}) to your floor footprint.</div>
          </a>
          <a href="/homelab/roof-replacement-cost-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Replacement Cost Calculator</div>
            <div className="text-xs text-slate-600">See how this pitch changes labor cost.</div>
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

function ModeButton({ current, value, set, children }: { current: InputMode; value: InputMode; set: (m: InputMode) => void; children: React.ReactNode }): JSX.Element {
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

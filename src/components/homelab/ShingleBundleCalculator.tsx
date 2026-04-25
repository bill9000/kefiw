import { useMemo, useState } from "react";

const fmt = (n: number): string => Math.round(n).toLocaleString("en-US");

const PROFILE_PRESETS: Array<{ id: string; label: string; bundlesPerSquare: number; lfPerBundle: number }> = [
  { id: "3tab",         label: "3-tab asphalt (3 bundles/sq)",                bundlesPerSquare: 3, lfPerBundle: 70 },
  { id: "architectural",label: "Architectural / dimensional (3 bundles/sq)",  bundlesPerSquare: 3, lfPerBundle: 65 },
  { id: "designer",     label: "Designer / luxury (4 bundles/sq)",            bundlesPerSquare: 4, lfPerBundle: 55 },
];

export default function ShingleBundleCalculator(): JSX.Element {
  const [roofSqft, setRoofSqft] = useState<number>(2400);
  const [profileId, setProfileId] = useState<string>("architectural");
  const [wastePct, setWastePct] = useState<number>(10);
  const [hipsValleysLF, setHipsValleysLF] = useState<number>(80);
  const [ridgeLF, setRidgeLF] = useState<number>(50);
  const [eaveStarterLF, setEaveStarterLF] = useState<number>(110);

  const profile = PROFILE_PRESETS.find((p) => p.id === profileId) ?? PROFILE_PRESETS[1];

  const calc = useMemo(() => {
    const sq = Math.max(0, roofSqft) / 100;
    const baseBundles = sq * profile.bundlesPerSquare;
    const wastedBundles = baseBundles * (1 + Math.max(0, wastePct) / 100);
    const fieldBundles = Math.ceil(wastedBundles);

    // Ridge cap: cut from regular shingles or buy specialty. Approx 1 bundle covers 35 LF cap.
    const capLfNeeded = Math.max(0, hipsValleysLF) + Math.max(0, ridgeLF);
    const capBundles = Math.ceil(capLfNeeded / 35);

    // Starter strip: ~120 LF per bundle.
    const starterBundles = Math.ceil(Math.max(0, eaveStarterLF) / 120);

    const totalBundles = fieldBundles + capBundles + starterBundles;
    const squares = sq;
    return { sq, squares, fieldBundles, capBundles, starterBundles, totalBundles, capLfNeeded };
  }, [roofSqft, profile, wastePct, hipsValleysLF, ridgeLF, eaveStarterLF]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Bundle inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">How many bundles?</h3>

        <Field label="Total roof surface (sqft)">
          <Num value={roofSqft} set={setRoofSqft} min={100} max={20000} step={50} />
          <Hint>Use the roof sqft, not the home sqft. <a href="/homelab/roof-square-footage-calculator/" className="underline">Estimate it here</a> if you don't know.</Hint>
        </Field>

        <Field label="Shingle profile">
          <select value={profileId} onChange={(e) => setProfileId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {PROFILE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>
          <Hint>Most architectural shingles are 3 bundles per square. Heavy / luxury profiles can be 4–5.</Hint>
        </Field>

        <Field label="Waste factor (%)">
          <Num value={wastePct} set={setWastePct} min={0} max={30} step={1} />
          <Hint>10% is typical for a clean rectangle. 12–15% for a hip roof with valleys. 18–22% for a cut-up roof with multiple dormers.</Hint>
        </Field>

        <Field label="Hips + valleys (linear feet)">
          <Num value={hipsValleysLF} set={setHipsValleysLF} min={0} max={1000} step={5} />
          <Hint>Add the LF of every hip and valley. Each needs ridge cap and the cap shingle eats from this allowance.</Hint>
        </Field>

        <Field label="Ridge length (linear feet)">
          <Num value={ridgeLF} set={setRidgeLF} min={0} max={500} step={5} />
          <Hint>The horizontal top edges. Common gable: one ridge run. Hip: multiple shorter pieces.</Hint>
        </Field>

        <Field label="Eave starter strip (linear feet of perimeter eaves)">
          <Num value={eaveStarterLF} set={setEaveStarterLF} min={0} max={1000} step={5} />
          <Hint>Use the perimeter of the bottom edge — every eave needs a starter course.</Hint>
        </Field>
      </section>

      <section aria-label="Bundle output" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Total bundles needed</div>
        <div className="text-3xl font-bold tabular-nums text-slate-900">{calc.totalBundles}</div>
        <div className="mt-1 text-sm text-slate-600">
          {calc.squares.toFixed(2)} squares · {profile.bundlesPerSquare} bundles/sq · {wastePct}% waste
        </div>

        <div className="mt-4 grid gap-2 text-sm text-slate-700">
          <Row label="Field shingles" value={`${calc.fieldBundles} bundles`} />
          <Row label="Ridge cap (hips + ridge)" value={`${calc.capBundles} bundles · ${calc.capLfNeeded} LF`} />
          <Row label="Starter strip" value={`${calc.starterBundles} bundles · ${eaveStarterLF} LF eaves`} />
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700">
          <strong>Order an extra bundle or two.</strong> Ridge cap bundles are the most likely short. A leftover bundle is cheaper than a same-day yard run.
        </div>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">How this is calculated</summary>
          <div className="mt-2 space-y-1 text-xs text-slate-700">
            <p><strong>Field:</strong> ⌈(roof_sqft ÷ 100) × bundles_per_square × (1 + waste %)⌉</p>
            <p><strong>Ridge cap:</strong> ⌈(hips_LF + ridge_LF) ÷ 35 LF per bundle⌉</p>
            <p><strong>Starter:</strong> ⌈eave_LF ÷ 120 LF per bundle⌉</p>
          </div>
        </details>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/roof-replacement-cost-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Replacement Cost Calculator</div>
            <div className="text-xs text-slate-600">Get installed price including labor and tear-off.</div>
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
function Row({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-slate-200 py-1">
      <span className="text-slate-600">{label}</span>
      <span className="font-semibold text-slate-900">{value}</span>
    </div>
  );
}

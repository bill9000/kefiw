import { useMemo, useState } from "react";

type HailSize = "pea" | "marble" | "dime" | "nickel" | "quarter" | "halfdollar" | "golfball" | "tennisball" | "baseball";
type Material = "asphalt-3tab" | "asphalt-arch" | "asphalt-class4" | "metal" | "tile";
type Exposure = "open" | "partial" | "sheltered";
type Approval = "high" | "moderate" | "low" | "very_low";

interface Output {
  approval: Approval;
  scoreBreakdown: { label: string; value: number; note: string }[];
  whatAdjusterSees: string[];
  scopeLikely: string;
}

const HAIL_DIAMETERS: Record<HailSize, { label: string; in: number; severity: number }> = {
  pea:        { label: "Pea (1/4″)",            in: 0.25, severity: 0 },
  marble:     { label: "Marble (1/2″)",         in: 0.5,  severity: 1 },
  dime:       { label: "Dime (~3/4″)",          in: 0.7,  severity: 2 },
  nickel:     { label: "Nickel (~7/8″)",        in: 0.875,severity: 3 },
  quarter:    { label: "Quarter (1″)",          in: 1.0,  severity: 4 },
  halfdollar: { label: "Half-dollar (1.25″)",   in: 1.25, severity: 5 },
  golfball:   { label: "Golf ball (1.75″)",     in: 1.75, severity: 7 },
  tennisball: { label: "Tennis ball (2.5″)",    in: 2.5,  severity: 8 },
  baseball:   { label: "Baseball (2.75″+)",     in: 2.75, severity: 9 },
};

const MATERIAL_RESISTANCE: Record<Material, { label: string; resistance: number; note: string }> = {
  "asphalt-3tab":   { label: "Asphalt — 3-tab",                resistance: 1, note: "Lowest impact resistance. Granule loss and bruising at quarter-size+." },
  "asphalt-arch":   { label: "Asphalt — architectural",        resistance: 2, note: "Standard 3-tab + thicker mat. Bruising starts at quarter-to-half-dollar." },
  "asphalt-class4": { label: "Asphalt — Class 4 impact-rated", resistance: 4, note: "Engineered for hail. Often survives golf-ball events; cosmetic-only damage common." },
  metal:            { label: "Metal (any profile)",            resistance: 4, note: "Doesn't fail like asphalt — but dents are cosmetic and often NOT covered by claim." },
  tile:             { label: "Tile (concrete or clay)",        resistance: 3, note: "Shatters under direct large impact. Underside fractures common — requires walk-and-tap inspection." },
};

const EXPOSURE_NOTES: Record<Exposure, { label: string; modifier: number; note: string }> = {
  open:      { label: "Open (no large trees, exposed slopes)", modifier: 1.0,  note: "Full hail energy reaches the roof. Strongest claim case." },
  partial:   { label: "Partial cover (some trees / windbreaks)", modifier: 0.7, note: "Some slopes shielded; expect mixed damage pattern." },
  sheltered: { label: "Sheltered (mature canopy / lee side)",  modifier: 0.4,  note: "Limited direct impact. Adjusters may discount the claim." },
};

function evaluate(opts: {
  size: HailSize;
  ageYears: number;
  material: Material;
  exposure: Exposure;
}): Output {
  const hail = HAIL_DIAMETERS[opts.size];
  const matRes = MATERIAL_RESISTANCE[opts.material];
  const exp = EXPOSURE_NOTES[opts.exposure];

  // Severity score: hail severity × age factor × exposure modifier ÷ material resistance.
  const ageFactor = 1 + Math.min(1.5, opts.ageYears / 12); // older roofs damage easier
  const score = (hail.severity * ageFactor * exp.modifier) / matRes.resistance;

  let approval: Approval;
  if (score >= 4) approval = "high";
  else if (score >= 2) approval = "moderate";
  else if (score >= 1) approval = "low";
  else approval = "very_low";

  const scoreBreakdown = [
    { label: `Hail size — ${hail.label}`, value: hail.severity, note: `${hail.in}″ diameter; severity points scale with kinetic energy.` },
    { label: `Roof age (${opts.ageYears} yr) factor`, value: Number(ageFactor.toFixed(2)), note: "Older shingles bruise easier — granule layer is the protective layer." },
    { label: `Exposure — ${exp.label}`, value: exp.modifier, note: exp.note },
    { label: `Material — ${matRes.label}`, value: matRes.resistance, note: matRes.note },
  ];

  const whatAdjusterSees: string[] = [];
  if (opts.material.startsWith("asphalt")) {
    whatAdjusterSees.push("Granule loss exposing asphalt mat (look for dark spots vs surrounding texture)");
    whatAdjusterSees.push("Bruising — soft, spongy spots when pressed, often in random patterns");
    whatAdjusterSees.push("Mat fracture — visible cracks in the underlying asphalt (verified by lifting tabs)");
    whatAdjusterSees.push("Damaged metal flashing, gutters, downspouts (corroborating evidence)");
    if (hail.severity >= 4) whatAdjusterSees.push("Ridge cap shingles split or crushed — strong signal");
  } else if (opts.material === "metal") {
    whatAdjusterSees.push("Dents on the roof surface (chalk-line test for circular impacts)");
    whatAdjusterSees.push("Damaged metal flashing or gutter stops");
    whatAdjusterSees.push("Broken sealant at penetrations from impact vibration");
    whatAdjusterSees.push("⚠️ Many policies exclude cosmetic-only metal damage — read the cosmetic exclusion before assuming approval.");
  } else {
    whatAdjusterSees.push("Cracked or shattered tiles (visible from above and from attic)");
    whatAdjusterSees.push("Displaced ridge or hip tiles");
    whatAdjusterSees.push("Underlayment damage at impact points");
    whatAdjusterSees.push("Damaged flashing and skylights");
  }

  let scopeLikely: string;
  if (approval === "high") {
    scopeLikely = "Full replacement scope likely. Adjuster will write up tear-off, full re-roof, flashing replacement, and probably gutters/downspouts.";
  } else if (approval === "moderate") {
    scopeLikely = "Partial scope likely (specific slopes with documented damage). May escalate to full if granular evidence is severe across multiple slopes.";
  } else if (approval === "low") {
    scopeLikely = "Repair-only scope likely. Patch slopes with documented damage. Consider whether deductible is worth the claim.";
  } else {
    scopeLikely = "Claim may be denied or approved at near-deductible value. Consider whether to file at all — every claim affects future renewal pricing.";
  }

  return { approval, scoreBreakdown, whatAdjusterSees, scopeLikely };
}

export default function HailDamageEstimator(): JSX.Element {
  const [size, setSize] = useState<HailSize>("quarter");
  const [age, setAge] = useState<number>(12);
  const [material, setMaterial] = useState<Material>("asphalt-arch");
  const [exposure, setExposure] = useState<Exposure>("open");

  const out = useMemo(() => evaluate({ size, ageYears: age, material, exposure }), [size, age, material, exposure]);

  const verdictColor =
    out.approval === "high"     ? "border-emerald-500 bg-emerald-50 text-emerald-900"
  : out.approval === "moderate" ? "border-amber-500 bg-amber-50 text-amber-900"
  : out.approval === "low"      ? "border-orange-500 bg-orange-50 text-orange-900"
  :                                "border-rose-500 bg-rose-50 text-rose-900";

  const verdictLabel =
    out.approval === "high"     ? "HIGH likelihood of full-scope approval"
  : out.approval === "moderate" ? "MODERATE — partial scope likely"
  : out.approval === "low"      ? "LOW — repair-only likely"
  :                                "VERY LOW — may be denied or near-deductible";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">The storm and your roof</h3>

        <Field label="Hail size">
          <select value={size} onChange={(e) => setSize(e.target.value as HailSize)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {(Object.entries(HAIL_DIAMETERS) as [HailSize, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <Hint>Use the largest reported size from your area. NWS storm reports and weather radar archives are public.</Hint>
        </Field>

        <Field label="Roof age (years)">
          <Num value={age} set={setAge} min={0} max={60} step={1} />
        </Field>

        <Field label="Roof material">
          <select value={material} onChange={(e) => setMaterial(e.target.value as Material)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {(Object.entries(MATERIAL_RESISTANCE) as [Material, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Exposure">
          <select value={exposure} onChange={(e) => setExposure(e.target.value as Exposure)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {(Object.entries(EXPOSURE_NOTES) as [Exposure, { label: string }][]).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </Field>
      </section>

      <section aria-label="Verdict" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Likely claim outcome</div>
        <div className={`rounded-md border-2 ${verdictColor} px-4 py-3`}>
          <div className="text-base font-bold">{verdictLabel}</div>
        </div>

        <div className="mt-3 text-sm text-slate-700">{out.scopeLikely}</div>

        <div className="mt-4">
          <div className="text-sm font-semibold text-slate-900">What the adjuster will look for</div>
          <ul className="mt-1 list-disc pl-5 text-xs text-slate-700 space-y-0.5">
            {out.whatAdjusterSees.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">Score breakdown</summary>
          <div className="mt-2 space-y-2 text-xs text-slate-700">
            {out.scoreBreakdown.map((r, i) => (
              <div key={i} className="rounded border border-slate-200 bg-slate-50 px-2 py-1">
                <div className="flex items-baseline justify-between">
                  <span className="font-semibold text-slate-800">{r.label}</span>
                  <span className="tabular-nums">{r.value}</span>
                </div>
                <div className="text-[11px] text-slate-600">{r.note}</div>
              </div>
            ))}
          </div>
        </details>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700">
          <strong>Don't wait.</strong> Most carriers require claims within 12 months of the event. Some require notice within 30 days. File first; investigate later. <a href="/homelab/roof-insurance-deductible-calculator/" className="underline">Run the deductible math</a> to see what claim is worth pursuing.
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
    <input type="number" inputMode="numeric" min={min} max={max} step={step} value={value}
      onChange={(e) => set(Number(e.target.value) || 0)}
      className="w-32 rounded border border-slate-300 px-2 py-1 text-sm" />
  );
}

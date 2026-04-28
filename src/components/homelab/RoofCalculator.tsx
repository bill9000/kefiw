import { useMemo, useState } from "react";
import {
  estimateRoof,
  financingPayment,
  priceDrivers,
  roofAreaFromHomeSqft,
  MATERIALS,
  PITCH_LABOR_MULT,
  STORY_LABOR_MULT,
  COMPLEXITY_LABOR_MULT,
  PERMIT_PROFILES,
  WARRANTY_PREMIUM,
  DECKING_RISK_FACTOR,
  COST_ENGINE_UPDATED,
  type ComplexityBand,
  type DeckingRisk,
  type PitchBand,
  type RoofEstimate,
  type RoofInputs,
  type WarrantyLevel,
} from "~/lib/homelab/roof-cost-engine";

type AreaMode = "roof" | "home";
type SavingsStrategyId =
  | "baseline"
  | "roof_over"
  | "owner_materials"
  | "installer_only"
  | "selective_flashing"
  | "scope_trim";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtMoneyRange = (low: number, high: number): string =>
  `${fmtUSD(low)}–${fmtUSD(high)}`;

const fmtPerSqft = (n: number): string => `$${n.toFixed(2)}`;

interface Props {
  defaultPermitProfileId?: string; // city pages can preset
  defaultMaterialId?: string;      // material-specific pages can preset
  materialIds?: string[];          // restrict the material dropdown to these IDs
}

export default function RoofCalculator({
  defaultPermitProfileId = "houston_tx",
  defaultMaterialId = "asphalt-architectural",
  materialIds,
}: Props): JSX.Element {
  const allowedMaterials = materialIds && materialIds.length > 0
    ? MATERIALS.filter((m) => materialIds.includes(m.id))
    : MATERIALS;
  const [areaMode, setAreaMode] = useState<AreaMode>("home");
  const [areaInput, setAreaInput] = useState<number>(2200);
  const [materialId, setMaterialId] = useState<string>(
    allowedMaterials.find((m) => m.id === defaultMaterialId)?.id ?? allowedMaterials[0].id,
  );
  const [pitch, setPitch] = useState<PitchBand>("medium");
  const [stories, setStories] = useState<1 | 2 | 3>(1);
  const [complexity, setComplexity] = useState<ComplexityBand>("standard_hip");
  const [tearOffLayers, setTearOffLayers] = useState<0 | 1 | 2>(1);
  const [deckingRisk, setDeckingRisk] = useState<DeckingRisk>("medium");
  const [penetrations, setPenetrations] = useState<number>(6);
  const [permitProfileId, setPermitProfileId] = useState<string>(defaultPermitProfileId);
  const [warranty, setWarranty] = useState<WarrantyLevel>("extended");
  const [insurancePossible, setInsurancePossible] = useState<boolean>(false);
  const [savingsStrategy, setSavingsStrategy] = useState<SavingsStrategyId>("baseline");
  const [aprPct, setAprPct] = useState<number>(11.99);
  const [termMonths, setTermMonths] = useState<number>(120);

  const roofSqft = useMemo<number>(() => {
    if (areaMode === "roof") return Math.max(400, Math.round(areaInput));
    return Math.max(400, roofAreaFromHomeSqft(areaInput, pitch));
  }, [areaMode, areaInput, pitch]);

  const inputs: RoofInputs = {
    roofSqft, materialId, pitch, stories, complexity,
    tearOffLayers, deckingRisk, penetrations, permitProfileId, warranty, insurancePossible,
  };

  const est = useMemo(() => estimateRoof(inputs), [inputs]);
  const drivers = useMemo(() => priceDrivers(est), [est]);
  const fin = useMemo(
    () => financingPayment(est.total.typical, aprPct, termMonths),
    [est.total.typical, aprPct, termMonths],
  );
  const strategy = useMemo(
    () => roofSavingsStrategy(savingsStrategy, est, inputs),
    [savingsStrategy, est, inputs],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section aria-label="Roof inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Your roof</h3>

        <div className="mb-3">
          <label className="block text-sm font-medium text-slate-800">Area input</label>
          <div className="mt-1 inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-sm">
            <button type="button" onClick={() => setAreaMode("home")} className={`rounded px-3 py-1 ${areaMode === "home" ? "bg-white shadow text-slate-900" : "text-slate-600"}`}>Home sqft</button>
            <button type="button" onClick={() => setAreaMode("roof")} className={`rounded px-3 py-1 ${areaMode === "roof" ? "bg-white shadow text-slate-900" : "text-slate-600"}`}>Roof sqft</button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number" inputMode="numeric" min={400} max={20000} step={50}
              value={areaInput}
              onChange={(e) => setAreaInput(Number(e.target.value) || 0)}
              className="w-32 rounded border border-slate-300 px-2 py-1 text-sm"
            />
            <span className="text-xs text-slate-500">
              {areaMode === "home" ? `→ roof ≈ ${roofSqft.toLocaleString()} sqft` : `${roofSqft.toLocaleString()} sqft of roof surface`}
            </span>
          </div>
        </div>

        <Field label="Material">
          <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {allowedMaterials.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
        </Field>

        <Field label="Pitch">
          <select value={pitch} onChange={(e) => setPitch(e.target.value as PitchBand)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {Object.entries(PITCH_LABOR_MULT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>

        <Field label="Stories">
          <select value={stories} onChange={(e) => setStories(Number(e.target.value) as 1 | 2 | 3)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {Object.entries(STORY_LABOR_MULT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>

        <Field label="Roof complexity">
          <select value={complexity} onChange={(e) => setComplexity(e.target.value as ComplexityBand)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {Object.entries(COMPLEXITY_LABOR_MULT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>

        <Field label="Tear-off layers">
          <select value={tearOffLayers} onChange={(e) => setTearOffLayers(Number(e.target.value) as 0 | 1 | 2)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            <option value={0}>0 — new build / decking-only</option>
            <option value={1}>1 layer (most common)</option>
            <option value={2}>2 layers (older roof, double-up)</option>
          </select>
        </Field>

        <Field label="Decking-rot risk">
          <select value={deckingRisk} onChange={(e) => setDeckingRisk(e.target.value as DeckingRisk)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {Object.entries(DECKING_RISK_FACTOR).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>

        <Field label="Penetrations (vents, skylights, chimneys)">
          <input type="number" min={0} max={30} value={penetrations}
            onChange={(e) => setPenetrations(Math.max(0, Number(e.target.value) || 0))}
            className="w-24 rounded border border-slate-300 px-2 py-1 text-sm" />
        </Field>

        <Field label="Permit jurisdiction">
          <select value={permitProfileId} onChange={(e) => setPermitProfileId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {PERMIT_PROFILES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>

        <Field label="Workmanship warranty">
          <select value={warranty} onChange={(e) => setWarranty(e.target.value as WarrantyLevel)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {Object.entries(WARRANTY_PREMIUM).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </Field>

        <Field label="Cost-saving strategy to test">
          <select value={savingsStrategy} onChange={(e) => setSavingsStrategy(e.target.value as SavingsStrategyId)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            <option value="baseline">Baseline: full contractor scope</option>
            <option value="roof_over">Roof-over / no tear-off if allowed</option>
            <option value="owner_materials">Owner buys materials, roofer installs</option>
            <option value="installer_only">Installer-only labor scope</option>
            <option value="selective_flashing">Reuse serviceable flashing only</option>
            <option value="scope_trim">Trim upsells and vague bundled scope</option>
          </select>
          <p className="mt-1 text-xs text-slate-500">
            This does not recommend cheap work blindly. It shows what the shortcut may save and what it can break.
          </p>
        </Field>

        <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={insurancePossible} onChange={(e) => setInsurancePossible(e.target.checked)} />
          <span>Insurance claim is likely (hail/wind damage)</span>
        </label>

        <details className="mt-4 text-sm text-slate-700">
          <summary className="cursor-pointer font-medium">Financing assumptions</summary>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <label className="text-xs">
              APR %
              <input type="number" min={0} max={36} step={0.25} value={aprPct}
                onChange={(e) => setAprPct(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1" />
            </label>
            <label className="text-xs">
              Term (months)
              <select value={termMonths} onChange={(e) => setTermMonths(Number(e.target.value))} className="mt-1 w-full rounded border border-slate-300 px-2 py-1">
                <option value={60}>60 (5 yr)</option>
                <option value={84}>84 (7 yr)</option>
                <option value={120}>120 (10 yr)</option>
                <option value={180}>180 (15 yr)</option>
                <option value={240}>240 (20 yr)</option>
              </select>
            </label>
          </div>
        </details>
      </section>

      <section aria-label="Roof estimate" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Estimated total range</div>
        <div className="text-3xl font-bold tabular-nums text-slate-900">
          {fmtMoneyRange(est.total.low, est.total.high)}
        </div>
        <div className="mt-1 text-sm text-slate-600">
          Typical: <strong className="text-slate-900">{fmtUSD(est.total.typical)}</strong>
          {" · "}
          {fmtPerSqft(est.perSqft.low)}–{fmtPerSqft(est.perSqft.high)} per sqft
        </div>
        <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-slate-700">
          A precise bid still requires a roof measurement, decking inspection, and current local material availability.
          Use this range to compare quotes — anything well outside it deserves a question.
        </p>

        <div className={`mt-4 rounded-md border p-3 text-sm ${strategy.risk === "high" ? "border-red-200 bg-red-50" : strategy.risk === "medium" ? "border-amber-200 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Cost-saving reality check</div>
          <h4 className="mt-1 text-sm font-semibold text-slate-950">{strategy.title}</h4>
          <div className="mt-1 text-lg font-bold tabular-nums text-slate-950">{strategy.headline}</div>
          <p className="mt-1 text-xs text-slate-700">{strategy.verdict}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {strategy.details.map((detail) => <li key={detail}>{detail}</li>)}
          </ul>
          <div className="mt-2 text-xs font-semibold text-slate-900">Ask it this way</div>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-xs text-slate-700">
            {strategy.questions.map((question) => <li key={question}>{question}</li>)}
          </ul>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900">Material / labor split (typical)</h4>
          <SplitBar
            material={est.splits.materialPctTypical}
            labor={est.splits.laborPctTypical}
            overhead={est.splits.overheadPctTypical}
          />
          <ul className="mt-2 space-y-1 text-xs text-slate-700">
            <li>Material: {fmtMoneyRange(est.material.low, est.material.high)} · ${est.material.perSqLow}–${est.material.perSqHigh}/sq</li>
            <li>Labor: {fmtMoneyRange(est.labor.low, est.labor.high)}</li>
            <li>Tear-off: {fmtMoneyRange(est.tearOff.low, est.tearOff.high)}</li>
            <li>Decking surprise: {fmtMoneyRange(est.decking.low, est.decking.high)} <span className="text-slate-500">(plans for ~{est.decking.expectedSqftLow}–{est.decking.expectedSqftHigh} sqft replacement)</span></li>
            <li>Flashing & penetrations: {fmtMoneyRange(est.penetrations.low, est.penetrations.high)}</li>
            <li>Permit & dump: {fmtMoneyRange(est.permit.low, est.permit.high)}</li>
            <li>Warranty premium: {fmtMoneyRange(est.warrantyAdd.low, est.warrantyAdd.high)}</li>
          </ul>
        </div>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
          <h4 className="text-sm font-semibold text-slate-900">Financing estimate</h4>
          <div className="mt-1 text-sm text-slate-700">
            ~<strong className="text-slate-900">{fmtUSD(fin.monthly)}/mo</strong> at {aprPct.toFixed(2)}% APR, {termMonths} months
            <span className="text-slate-500"> · interest ≈ {fmtUSD(fin.totalInterest)}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Illustrative only. Real loan terms depend on credit, lender, and collateral type.
          </p>
        </div>

        {insurancePossible && (
          <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-slate-800">
            <div className="font-semibold text-blue-900">Insurance claim path</div>
            <p className="mt-1">
              If carrier approves, you typically pay only the deductible plus any betterment items
              (upgrades over like-kind-and-quality). Ask the adjuster about <strong>RCV vs ACV</strong>,
              <strong> code-upgrade coverage</strong>, and <strong>depreciation hold-back</strong> —
              those line items move the out-of-pocket more than the headline scope.
            </p>
          </div>
        )}

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900">What's driving the price</h4>
          <ol className="mt-1 space-y-1 text-xs text-slate-700">
            {drivers.slice(0, 5).map((d) => (
              <li key={d.key} className="flex gap-2">
                <span className="w-12 shrink-0 text-right tabular-nums text-slate-900">{Math.round(d.shareOfTotal * 100)}%</span>
                <span><strong>{d.label}</strong> — {d.note}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-900">Questions to ask each roofer</h4>
          <ul className="mt-1 list-disc pl-5 text-xs text-slate-700 space-y-0.5">
            <li>Is your bid for tear-off and disposal of {tearOffLayers} layer{tearOffLayers === 1 ? "" : "s"}?</li>
            <li>What's the per-sheet price for decking replacement if rot is found?</li>
            <li>Are starter strips, ridge cap, and ice/water shield itemized or bundled?</li>
            <li>What workmanship warranty is included, and is it transferable?</li>
            <li>Is the permit pulled in your name or mine? (Yours is the right answer.)</li>
            <li>Will you provide a certificate of insurance and current state contractor license?</li>
            <li>Is full-system manufacturer warranty offered (e.g., GAF Golden Pledge)?</li>
            <li>If I buy materials or use an installer-only scope, who owns shortages, returns, delivery damage, warranty registration, and code compliance?</li>
            <li>If you propose a roof-over, what code section allows it here and how did you verify the deck is sound?</li>
            <li>How many existing roof layers are there? If there are already two layers, tear-off is the real scope; do not create a third layer.</li>
            <li>Will you photograph tree-rub damage, trimmed branches, decking, flashing, pipe boots, chimney cap/flue details, and vent details before covering them?</li>
            <li>For a Class 3 or Class 4 impact roof, will you provide product-label photos and the carrier/TDI impact-resistant roofing form?</li>
            <li>For high-wind or FORTIFIED-style work, what nail pattern is included: six nails per shingle, 8d ring-shank deck nails at 6&quot; o.c., and tighter gable-end fastening if required?</li>
            {insurancePossible && <li>Will you bill the supplements you find directly to my carrier?</li>}
          </ul>
        </div>

        <div className="mt-3 text-[11px] text-slate-500">
          Cost data updated {COST_ENGINE_UPDATED}. See <a href="/homelab/methodology/" className="underline">methodology</a> for sources.
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

function SplitBar({ material, labor, overhead }: { material: number; labor: number; overhead: number }): JSX.Element {
  const rawM = Math.max(0, material);
  const rawL = Math.max(0, labor);
  const rawO = Math.max(0, overhead);
  const total = rawM + rawL + rawO || 1;
  const m = Math.min(1, rawM / total);
  const l = Math.min(1, rawL / total);
  const o = Math.min(1, rawO / total);
  return (
    <div className="mt-2">
      <div className="flex h-3 overflow-hidden rounded bg-slate-100" role="img" aria-label="Cost split">
        <div className="bg-amber-500" style={{ width: `${m * 100}%` }} title="Material" />
        <div className="bg-blue-500" style={{ width: `${l * 100}%` }} title="Labor" />
        <div className="bg-slate-400" style={{ width: `${o * 100}%` }} title="Tear-off, decking, permit, warranty" />
      </div>
      <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-slate-600">
        <span><span className="inline-block h-2 w-2 rounded-sm bg-amber-500 align-middle"></span> Material {Math.round(m * 100)}%</span>
        <span><span className="inline-block h-2 w-2 rounded-sm bg-blue-500 align-middle"></span> Labor {Math.round(l * 100)}%</span>
        <span><span className="inline-block h-2 w-2 rounded-sm bg-slate-400 align-middle"></span> Other {Math.round(o * 100)}%</span>
      </div>
    </div>
  );
}

interface RoofSavingsStrategy {
  title: string;
  headline: string;
  verdict: string;
  details: string[];
  questions: string[];
  risk: "low" | "medium" | "high";
}

const midRange = (low: number, high: number): number => (low + high) / 2;

function roofSavingsStrategy(id: SavingsStrategyId, est: RoofEstimate, inputs: RoofInputs): RoofSavingsStrategy {
  const materialMid = midRange(est.material.low, est.material.high);
  const tearOffMid = midRange(est.tearOff.low, est.tearOff.high);
  const deckingMid = midRange(est.decking.low, est.decking.high);
  const flashingMid = midRange(est.penetrations.low, est.penetrations.high);
  const warrantyMid = midRange(est.warrantyAdd.low, est.warrantyAdd.high);
  const roofOverPossible = inputs.tearOffLayers === 1 && inputs.deckingRisk !== "high";

  if (id === "roof_over") {
    const savingsLow = Math.max(0, tearOffMid * 0.75);
    const savingsHigh = Math.max(savingsLow, tearOffMid + deckingMid * 0.6);
    return {
      title: "Roof-over / no tear-off",
      headline: roofOverPossible ? `${fmtUSD(savingsLow)}-${fmtUSD(savingsHigh)} possible upfront savings` : "Usually not a good fit from these inputs",
      verdict: roofOverPossible
        ? "This can be a legitimate budget path only when local code allows it, there is exactly one existing layer, the old shingles lie flat, and the deck is sound."
        : "A roof-over is weak here because the existing layer count or decking risk points toward tear-off and inspection.",
      details: [
        "It saves tear-off and disposal now, but it hides decking rot and makes future tear-off more expensive.",
        "It can reduce curb quality, impact ratings, warranty options, and the ability to fix flashing correctly.",
        "It is not a repair for leaks, sagging, soft decking, uneven shingles, or bad ventilation.",
      ],
      questions: [
        "How many existing layers are on the roof, and does local code allow this exact roof-over?",
        "Where did you inspect down to the deck, and did you find rot, gaps, sagging, or soft spots?",
        "What warranty changes if this is installed over old shingles?",
      ],
      risk: roofOverPossible ? "medium" : "high",
    };
  }

  if (id === "owner_materials") {
    const savingsLow = materialMid * 0.05;
    const savingsHigh = materialMid * 0.12;
    return {
      title: "Owner buys materials",
      headline: `${fmtUSD(savingsLow)}-${fmtUSD(savingsHigh)} potential markup pressure`,
      verdict: "This can work when you know the exact material list and the installer agrees in writing, but it moves ordering mistakes onto you.",
      details: [
        "Materials are not just field shingles: starter, ridge cap, underlayment, ice/water, drip edge, nails, pipe boots, vents, valley metal, and waste matter.",
        "You own shortages, damaged bundles, color-lot mismatch, delivery timing, returns, and leftover material unless the contract says otherwise.",
        "Some roofers will not warranty labor normally when they did not supply the system.",
      ],
      questions: [
        "Give me the full material takeoff by SKU, quantity, waste factor, and delivery date.",
        "If materials run short, who pays the crew downtime and who orders the exact matching lot?",
        "Does owner-supplied material change workmanship or manufacturer warranty registration?",
      ],
      risk: "medium",
    };
  }

  if (id === "installer_only") {
    const savingsLow = materialMid * 0.08 + warrantyMid * 0.5;
    const savingsHigh = materialMid * 0.18 + warrantyMid;
    return {
      title: "Installer-only labor scope",
      headline: `${fmtUSD(savingsLow)}-${fmtUSD(savingsHigh)} possible bid reduction`,
      verdict: "This is the most aggressive savings path. It can save money, but only if insurance, permits, safety, cleanup, and warranty are explicit.",
      details: [
        "A crew is not the same thing as a licensed, insured roofing contractor responsible for the system.",
        "You need written scope for tear-off, dry-in, flashing, ventilation, cleanup, magnet sweep, dump fees, and weather protection.",
        "Do not become the uninsured general contractor by accident.",
      ],
      questions: [
        "Who pulls the permit, carries workers comp/liability, and signs the workmanship warranty?",
        "What happens if rain arrives with the roof open?",
        "Will I receive lien waivers from labor and material suppliers?",
      ],
      risk: "high",
    };
  }

  if (id === "selective_flashing") {
    const savingsLow = Math.max(150, flashingMid * 0.2);
    const savingsHigh = Math.max(savingsLow, flashingMid * 0.55);
    return {
      title: "Selective flashing reuse",
      headline: `${fmtUSD(savingsLow)}-${fmtUSD(savingsHigh)} possible scope movement`,
      verdict: "Do not blindly reuse all flashing, but do not blindly pay to tear apart good wall/counterflashing either.",
      details: [
        "Pipe boots, drip edge, rusty valley metal, and obviously damaged flashing are usually cheap enough to replace.",
        "Step flashing or counterflashing buried behind siding, stucco, brick, or stone can become a bigger project; reuse may be rational if it is sound and correctly lapped.",
        "The quote should separate replace, reuse, and repair-in-place flashing decisions.",
      ],
      questions: [
        "Which flashing pieces are being replaced, which are reused, and why?",
        "Are pipe boots, drip edge, valley metal, sidewall, headwall, chimney, and skylight flashing separately addressed?",
        "If old flashing leaks later, is it excluded from the workmanship warranty?",
      ],
      risk: "medium",
    };
  }

  if (id === "scope_trim") {
    const savingsLow = Math.max(250, warrantyMid * 0.35 + flashingMid * 0.15);
    const savingsHigh = Math.max(savingsLow, warrantyMid + Math.min(1800, flashingMid * 0.5));
    return {
      title: "Trim vague upsells",
      headline: `${fmtUSD(savingsLow)}-${fmtUSD(savingsHigh)} possible cleanup`,
      verdict: "The cleanest savings often comes from removing vague bundled extras, not weakening the water-management parts of the roof.",
      details: [
        "Push gutters, premium warranty, designer shingles, ventilation changes, decking allowances, and cosmetic upgrades into separate line items.",
        "Keep underlayment, starter, ridge cap, drip edge, correct nailing, and leak-prone flashing details in the base scope.",
        "A lower price is useful only if the remaining scope still produces a dry, insurable, permitted roof.",
      ],
      questions: [
        "What line items can be removed without changing code compliance or leak risk?",
        "What is required for the shingle warranty, and what is just a sales package?",
        "Can you quote base architectural shingles, Class 4 shingles, and premium shingles separately?",
      ],
      risk: "low",
    };
  }

  return {
    title: "Baseline full contractor scope",
    headline: "No shortcut selected",
    verdict: "Use the main estimate as the defensible comparison point, then test specific savings paths one at a time.",
    details: [
      "A complete roof quote should spell out tear-off, disposal, decking, dry-in, flashing, ventilation, permit, cleanup, and warranty.",
      "The cheapest bid is usually missing a scope line. The best bid makes tradeoffs visible.",
    ],
    questions: [
      "What exactly is included, excluded, and priced only as an allowance?",
      "What would you remove from the scope if I had to save money, and what would you refuse to remove?",
    ],
    risk: "low",
  };
}

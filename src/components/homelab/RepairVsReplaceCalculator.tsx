import { useMemo, useState } from "react";
import { MATERIALS } from "~/lib/homelab/roof-cost-engine";

type Verdict = "REPAIR" | "REPLACE" | "DEPENDS";
type LeakHistory = "none" | "occasional" | "frequent";
type DamageCause = "none" | "wear" | "storm_recent" | "storm_old";

interface Output {
  verdict: Verdict;
  reasons: string[];
  cautions: string[];
  ageRatio: number;
}

function evaluate(opts: {
  ageYears: number;
  lifespanLow: number;
  lifespanHigh: number;
  damagePctOfRoof: number;
  leak: LeakHistory;
  cause: DamageCause;
  saleHorizonYears: number;
  insurancePossible: boolean;
}): Output {
  const ageMid = (opts.lifespanLow + opts.lifespanHigh) / 2;
  const ageRatio = opts.ageYears / Math.max(1, ageMid);
  const reasons: string[] = [];
  const cautions: string[] = [];

  let replaceVotes = 0;
  let repairVotes = 0;

  // Age band
  if (ageRatio >= 0.85) {
    replaceVotes += 2;
    reasons.push(`Roof is at ${Math.round(ageRatio * 100)}% of expected lifespan — every repair dollar funds a fix that will retire soon anyway.`);
  } else if (ageRatio >= 0.65) {
    replaceVotes += 1;
    cautions.push(`Roof is at ${Math.round(ageRatio * 100)}% of expected lifespan — borderline. Insurance scope or planned sale tips this either way.`);
  } else {
    repairVotes += 1;
    reasons.push(`Roof has ${Math.round((1 - ageRatio) * 100)}% of expected life left — repair is generally the right move.`);
  }

  // Damage extent
  if (opts.damagePctOfRoof >= 30) {
    replaceVotes += 2;
    reasons.push(`${Math.round(opts.damagePctOfRoof)}% of the roof shows damage — color/lot matching across that much area is harder than just replacing.`);
  } else if (opts.damagePctOfRoof >= 15) {
    replaceVotes += 1;
    cautions.push(`${Math.round(opts.damagePctOfRoof)}% damage is in the gray zone — expect visible patch where new shingles meet old.`);
  } else if (opts.damagePctOfRoof > 0) {
    repairVotes += 1;
    reasons.push(`Damage is contained to ~${Math.round(opts.damagePctOfRoof)}% of the roof — patch repair is cost-effective.`);
  }

  // Leak history
  if (opts.leak === "frequent") {
    replaceVotes += 2;
    reasons.push(`Multiple leaks per year suggest the underlayment or decking is compromised, not just the surface shingles.`);
  } else if (opts.leak === "occasional") {
    cautions.push(`Past leaks raise the chance of hidden decking damage — get a tear-off estimate even if you decide to repair.`);
  }

  // Insurance angle
  if (opts.insurancePossible && opts.cause === "storm_recent") {
    replaceVotes += 2;
    reasons.push(`Storm damage with an active claim window — if the carrier approves a full replace, you pay only the deductible. That's almost always the right move over partial repair.`);
  }
  if (opts.cause === "storm_old") {
    cautions.push(`Old storm damage is hard to claim now — insurers typically require filing within 12 months of the event.`);
  }

  // Sale horizon
  if (opts.saleHorizonYears > 0 && opts.saleHorizonYears <= 1) {
    if (ageRatio >= 0.7) {
      replaceVotes += 1;
      reasons.push(`Selling within a year with an aged roof — buyers and inspectors will flag it. A new roof is one of the few high-ROI pre-sale upgrades.`);
    } else {
      repairVotes += 1;
      reasons.push(`Roof has plenty of life — repair, document the work, and let the buyer carry the eventual replacement.`);
    }
  } else if (opts.saleHorizonYears >= 5) {
    if (ageRatio >= 0.6) {
      cautions.push(`If you'll own this 5+ years and the roof is past 60% of life, a replace now buys decades of peace; a repair just defers it.`);
    }
  }

  // Resolve
  let verdict: Verdict;
  if (replaceVotes >= repairVotes + 2) verdict = "REPLACE";
  else if (repairVotes >= replaceVotes + 1) verdict = "REPAIR";
  else verdict = "DEPENDS";

  return { verdict, reasons, cautions, ageRatio };
}

export default function RepairVsReplaceCalculator(): JSX.Element {
  const [ageYears, setAgeYears] = useState<number>(18);
  const [materialId, setMaterialId] = useState<string>("asphalt-architectural");
  const [damagePct, setDamagePct] = useState<number>(10);
  const [leak, setLeak] = useState<LeakHistory>("occasional");
  const [cause, setCause] = useState<DamageCause>("storm_recent");
  const [saleHorizonYears, setSaleHorizonYears] = useState<number>(7);
  const [insurancePossible, setInsurancePossible] = useState<boolean>(true);

  const material = MATERIALS.find((m) => m.id === materialId) ?? MATERIALS[1];

  const out = useMemo(() => evaluate({
    ageYears,
    lifespanLow: material.lifespanLow,
    lifespanHigh: material.lifespanHigh,
    damagePctOfRoof: damagePct,
    leak,
    cause,
    saleHorizonYears,
    insurancePossible,
  }), [ageYears, material, damagePct, leak, cause, saleHorizonYears, insurancePossible]);

  const verdictColor =
    out.verdict === "REPLACE" ? "border-amber-500 bg-amber-50 text-amber-900"
    : out.verdict === "REPAIR" ? "border-emerald-500 bg-emerald-50 text-emerald-900"
    : "border-slate-400 bg-slate-50 text-slate-800";

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Tell us about the roof</h3>

        <Field label="Roof material">
          <select value={materialId} onChange={(e) => setMaterialId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {MATERIALS.map((m) => <option key={m.id} value={m.id}>{m.label} · {m.lifespanLow}–{m.lifespanHigh} yr</option>)}
          </select>
        </Field>

        <Field label={`Roof age (years) · expected life ${material.lifespanLow}–${material.lifespanHigh}`}>
          <Num value={ageYears} set={setAgeYears} min={0} max={80} step={1} />
        </Field>

        <Field label="Approximate share of roof showing damage (%)">
          <Num value={damagePct} set={setDamagePct} min={0} max={100} step={5} />
          <Hint>Eyeball estimate. 10% = a few patches; 30% = one full slope.</Hint>
        </Field>

        <Field label="Leak history">
          <select value={leak} onChange={(e) => setLeak(e.target.value as LeakHistory)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            <option value="none">None — no leaks ever</option>
            <option value="occasional">Occasional — 1–2 over the roof's life</option>
            <option value="frequent">Frequent — recurring, multiple per year</option>
          </select>
        </Field>

        <Field label="Cause of current damage">
          <select value={cause} onChange={(e) => setCause(e.target.value as DamageCause)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            <option value="none">No specific damage — just aging</option>
            <option value="wear">General wear (curling, granule loss)</option>
            <option value="storm_recent">Storm damage in the last 12 months</option>
            <option value="storm_old">Old storm damage (&gt;12 months ago)</option>
          </select>
        </Field>

        <Field label="Years until you sell (0 = not selling)">
          <Num value={saleHorizonYears} set={setSaleHorizonYears} min={0} max={30} step={1} />
        </Field>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={insurancePossible} onChange={(e) => setInsurancePossible(e.target.checked)} />
          <span>Insurance claim is plausible (deductible &lt; replacement cost)</span>
        </label>
      </section>

      <section aria-label="Verdict" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-500">Recommendation</div>
        <div className={`rounded-md border-2 ${verdictColor} px-4 py-3`}>
          <div className="text-3xl font-bold">{out.verdict}</div>
          {out.verdict === "DEPENDS" && (
            <div className="mt-1 text-sm">Reasons cut both ways. Read both lists below — the right answer depends on which factor you weight most.</div>
          )}
        </div>

        {out.reasons.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-slate-900">Why</div>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
              {out.reasons.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        )}

        {out.cautions.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-semibold text-slate-900">Cautions</div>
            <ul className="mt-1 list-disc pl-5 text-sm text-slate-700">
              {out.cautions.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
        )}

        <div className="mt-4 grid gap-2 text-sm">
          {out.verdict !== "REPAIR" && (
            <a href="/homelab/roof-replacement-cost-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
              <div className="font-medium text-slate-900">→ Roof Replacement Cost Calculator</div>
              <div className="text-xs text-slate-600">Price the replacement scope.</div>
            </a>
          )}
          <a href="/homelab/roof-square-footage-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Square Footage Calculator</div>
            <div className="text-xs text-slate-600">If you don't know the surface area yet.</div>
          </a>
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700">
          This is an opinion, not an inspection. A roofer on the roof — or an adjuster after a storm — sees things this calculator can't. Use the verdict to decide which call to make first.
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

import { useMemo, useState } from "react";

const fmtUSD = (n: number): string =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

type DeductibleMode = "flat" | "pct_dwelling";
type PolicyType = "rcv" | "acv";

interface Output {
  deductibleAmount: number;
  acvCheck: number;        // initial check from carrier (RCV minus depreciation minus deductible)
  rcvFinalCheck: number;   // released after work complete
  totalInsurancePay: number;
  outOfPocket: number;
  depreciationAmount: number;
  warning: string | null;
}

function evaluate(opts: {
  approvedScopeRCV: number;
  dwellingCoverage: number;
  deductibleMode: DeductibleMode;
  deductibleFlat: number;
  deductiblePct: number; // 1, 2, 5 etc
  policyType: PolicyType;
  roofAgeYears: number;
  expectedLifespan: number;
  nonCoveredScope: number;
}): Output {
  const dedAmount = opts.deductibleMode === "flat"
    ? Math.max(0, opts.deductibleFlat)
    : Math.max(0, opts.dwellingCoverage * (opts.deductiblePct / 100));

  // Depreciation: linear, capped at 80% to avoid zero-ACV pathological cases.
  const ageRatio = Math.min(0.8, Math.max(0, opts.roofAgeYears / Math.max(1, opts.expectedLifespan)));
  const depreciationAmount = opts.policyType === "acv"
    ? opts.approvedScopeRCV * ageRatio
    : opts.approvedScopeRCV * ageRatio; // both compute it; only RCV releases it later

  let acvCheck: number;
  let rcvFinalCheck: number;

  if (opts.policyType === "rcv") {
    // Carrier issues ACV initially, releases the recoverable depreciation after work.
    acvCheck = Math.max(0, opts.approvedScopeRCV - depreciationAmount - dedAmount);
    rcvFinalCheck = depreciationAmount; // released after work complete
  } else {
    // ACV policy never releases depreciation.
    acvCheck = Math.max(0, opts.approvedScopeRCV - depreciationAmount - dedAmount);
    rcvFinalCheck = 0;
  }

  const totalInsurancePay = acvCheck + rcvFinalCheck;
  const outOfPocket = dedAmount + Math.max(0, opts.nonCoveredScope) +
    (opts.policyType === "acv" ? depreciationAmount : 0);

  let warning: string | null = null;
  if (opts.policyType === "acv" && ageRatio > 0.5) {
    warning = "ACV policy + aged roof = significant depreciation gap. Many homeowners only learn this AFTER the claim is approved. Verify your declarations page before assuming RCV.";
  } else if (opts.deductibleMode === "pct_dwelling" && opts.deductiblePct >= 2) {
    warning = "Percentage deductibles (2%+ of dwelling coverage) can mean $5–$15K out-of-pocket — much higher than the flat deductible most homeowners assume.";
  }

  return {
    deductibleAmount: dedAmount,
    acvCheck,
    rcvFinalCheck,
    totalInsurancePay,
    outOfPocket,
    depreciationAmount,
    warning,
  };
}

const LIFESPAN_PRESETS: Array<{ id: string; label: string; years: number }> = [
  { id: "asphalt-arch",  label: "Asphalt — architectural (28 yr typical)", years: 28 },
  { id: "asphalt-3tab",  label: "Asphalt — 3-tab (18 yr typical)",         years: 18 },
  { id: "metal-ss",      label: "Metal — standing seam (50 yr)",            years: 50 },
  { id: "metal-exposed", label: "Metal — exposed fastener (38 yr)",         years: 38 },
  { id: "tile-clay",     label: "Tile — clay (60 yr)",                      years: 60 },
];

export default function InsuranceDeductibleCalculator(): JSX.Element {
  const [scope, setScope] = useState<number>(18000);
  const [dwelling, setDwelling] = useState<number>(425000);
  const [mode, setMode] = useState<DeductibleMode>("flat");
  const [flat, setFlat] = useState<number>(2500);
  const [pct, setPct] = useState<number>(2);
  const [policy, setPolicy] = useState<PolicyType>("rcv");
  const [age, setAge] = useState<number>(15);
  const [lifespanId, setLifespanId] = useState<string>("asphalt-arch");
  const [nonCovered, setNonCovered] = useState<number>(0);

  const lifespan = LIFESPAN_PRESETS.find((p) => p.id === lifespanId)?.years ?? 28;

  const out = useMemo(() => evaluate({
    approvedScopeRCV: scope,
    dwellingCoverage: dwelling,
    deductibleMode: mode,
    deductibleFlat: flat,
    deductiblePct: pct,
    policyType: policy,
    roofAgeYears: age,
    expectedLifespan: lifespan,
    nonCoveredScope: nonCovered,
  }), [scope, dwelling, mode, flat, pct, policy, age, lifespan, nonCovered]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Your claim</h3>

        <Field label="Approved scope (RCV) — what the adjuster wrote up">
          <Money value={scope} set={setScope} step={500} />
          <Hint>The full replacement-cost scope from the adjuster, before deductible or depreciation.</Hint>
        </Field>

        <Field label="Dwelling coverage on your declarations page (Coverage A)">
          <Money value={dwelling} set={setDwelling} step={5000} />
          <Hint>Only used if your deductible is a percentage of dwelling.</Hint>
        </Field>

        <Field label="Deductible type">
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-sm">
            <ModeBtn current={mode} value="flat" set={setMode}>Flat $</ModeBtn>
            <ModeBtn current={mode} value="pct_dwelling" set={setMode}>% of dwelling</ModeBtn>
          </div>
        </Field>

        {mode === "flat" ? (
          <Field label="Flat deductible amount">
            <Money value={flat} set={setFlat} step={250} />
            <Hint>Common values: $1,000 / $2,500 / $5,000.</Hint>
          </Field>
        ) : (
          <Field label="Percentage of dwelling coverage">
            <select value={pct} onChange={(e) => setPct(Number(e.target.value))} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
              <option value={1}>1% (lower-risk areas)</option>
              <option value={2}>2% (typical TX hail / FL wind zones)</option>
              <option value={3}>3%</option>
              <option value={5}>5% (high-risk coastal)</option>
            </select>
            <Hint>Computed deductible: <strong>{fmtUSD(out.deductibleAmount)}</strong>.</Hint>
          </Field>
        )}

        <Field label="Policy type">
          <select value={policy} onChange={(e) => setPolicy(e.target.value as PolicyType)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            <option value="rcv">RCV — Replacement Cost Value (recoverable)</option>
            <option value="acv">ACV — Actual Cash Value (depreciation NOT recovered)</option>
          </select>
          <Hint>Most modern policies are RCV. Older policies, secondary homes, and roofs over 15–20 years sometimes get switched to ACV at renewal.</Hint>
        </Field>

        <Field label="Roof age (years)">
          <Num value={age} set={setAge} min={0} max={80} step={1} />
        </Field>

        <Field label="Material lifespan reference">
          <select value={lifespanId} onChange={(e) => setLifespanId(e.target.value)} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            {LIFESPAN_PRESETS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </Field>

        <Field label="Non-covered scope (code upgrades, betterment, your choices)">
          <Money value={nonCovered} set={setNonCovered} step={250} />
          <Hint>Items insurance won't cover: upgrade from 3-tab to architectural, ice/water shield not in original scope, drip edge added by current code.</Hint>
        </Field>
      </section>

      <section aria-label="Output" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <Row label="Your deductible" value={fmtUSD(out.deductibleAmount)} />
          <Row label="Depreciation" value={fmtUSD(out.depreciationAmount)} muted />
          <Row label="Initial ACV check (received before work)" value={fmtUSD(out.acvCheck)} />
          {policy === "rcv" && (
            <Row label="Final RCV check (released after work complete)" value={fmtUSD(out.rcvFinalCheck)} accent />
          )}
          <Row label="Total insurance pays" value={fmtUSD(out.totalInsurancePay)} bold />
        </div>

        <div className="mt-4 rounded-md border-2 border-amber-500 bg-amber-50 px-4 py-3 text-amber-900">
          <div className="text-xs uppercase tracking-[0.18em]">Your out-of-pocket</div>
          <div className="text-3xl font-bold tabular-nums">{fmtUSD(out.outOfPocket)}</div>
          <div className="mt-1 text-xs">
            Deductible{nonCovered > 0 ? " + non-covered scope" : ""}{policy === "acv" && out.depreciationAmount > 0 ? " + depreciation (ACV policy)" : ""}.
          </div>
        </div>

        {out.warning && (
          <div className="mt-4 rounded-md border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900">
            <strong>Watch this:</strong> {out.warning}
          </div>
        )}

        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">How RCV claims actually flow</summary>
          <ol className="mt-2 list-decimal pl-5 text-xs text-slate-700 space-y-1">
            <li>Adjuster inspects, writes up the scope at RCV.</li>
            <li>Carrier issues the <strong>ACV check</strong> = scope − depreciation − deductible. This arrives within 30 days of approval.</li>
            <li>Roofer completes the work. Roofer (or you) sends the carrier proof: invoices, photos, certificate of completion.</li>
            <li>Carrier releases the <strong>recoverable depreciation</strong> as a second check. This is the difference between ACV and RCV.</li>
            <li>You pay the roofer the full RCV scope plus your deductible. The two carrier checks should cover everything except your deductible (and any non-covered scope).</li>
          </ol>
        </details>

        <details className="mt-2 text-sm">
          <summary className="cursor-pointer font-medium text-slate-800">Why ACV policies are tricky</summary>
          <p className="mt-2 text-xs text-slate-700">
            On an ACV policy, the depreciation never comes back. A 15-year-old roof depreciates ~50%, so a $20K scope pays $10K minus deductible — you'd cover the $10K gap yourself. Some carriers automatically convert to ACV at roof age 15 or 20; check your declarations page line item that says "Loss Settlement: Replacement Cost" or "Actual Cash Value."
          </p>
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
function Money({ value, set, step }: { value: number; set: (n: number) => void; step: number }): JSX.Element {
  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-slate-500">$</span>
      <input type="number" inputMode="numeric" min={0} step={step} value={value}
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
function ModeBtn({ current, value, set, children }: { current: DeductibleMode; value: DeductibleMode; set: (m: DeductibleMode) => void; children: React.ReactNode }): JSX.Element {
  return (
    <button type="button" onClick={() => set(value)}
      className={`rounded px-3 py-1 ${current === value ? "bg-white shadow text-slate-900" : "text-slate-600"}`}>
      {children}
    </button>
  );
}
function Row({ label, value, muted, bold, accent }: { label: string; value: string; muted?: boolean; bold?: boolean; accent?: boolean }): JSX.Element {
  return (
    <div className="flex items-baseline justify-between border-b border-dashed border-slate-200 py-1">
      <span className={muted ? "text-slate-500" : "text-slate-700"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-slate-900" : accent ? "font-semibold text-emerald-700" : muted ? "text-slate-500" : "font-semibold text-slate-900"}`}>
        {value}
      </span>
    </div>
  );
}

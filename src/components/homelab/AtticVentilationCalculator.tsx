import { useMemo, useState } from "react";

// Code: 1:300 of attic floor area when a vapor retarder is installed on the
// warm-in-winter side OR when intake/exhaust is balanced 50/50; 1:150 otherwise.
// Half goes to intake (low), half to exhaust (high).

const RIDGE_VENT_NFA_PER_LF = 18;   // sq.in. NFA per linear foot of ridge vent
const SOFFIT_VENT_NFA_PER_LF = 9;    // 8" continuous strip soffit, typical
const BOX_VENT_NFA = 60;             // typical 750-series box vent

export default function AtticVentilationCalculator(): JSX.Element {
  const [atticSqft, setAtticSqft] = useState<number>(2000);
  const [ratio, setRatio] = useState<"1to300" | "1to150">("1to300");
  const [ridgeLF, setRidgeLF] = useState<number>(40);
  const [soffitLF, setSoffitLF] = useState<number>(110);

  const out = useMemo(() => {
    const ratioDiv = ratio === "1to300" ? 300 : 150;
    const totalNfaSqft = atticSqft / ratioDiv;
    const totalNfaSqIn = totalNfaSqft * 144;
    const intakeNeeded = totalNfaSqIn * 0.5;
    const exhaustNeeded = totalNfaSqIn * 0.5;
    const ridgeNFA = ridgeLF * RIDGE_VENT_NFA_PER_LF;
    const soffitNFA = soffitLF * SOFFIT_VENT_NFA_PER_LF;
    const ridgeShortfall = exhaustNeeded - ridgeNFA;
    const soffitShortfall = intakeNeeded - soffitNFA;
    const boxVentsNeeded = ridgeShortfall > 0 ? Math.ceil(ridgeShortfall / BOX_VENT_NFA) : 0;
    return {
      totalNfaSqIn, intakeNeeded, exhaustNeeded,
      ridgeNFA, soffitNFA,
      ridgeShortfall, soffitShortfall,
      boxVentsNeeded,
      intakeOk: soffitShortfall <= 0,
      exhaustOk: ridgeShortfall <= 0,
    };
  }, [atticSqft, ratio, ridgeLF, soffitLF]);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section aria-label="Inputs" className="rounded-md border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-base font-semibold text-slate-900">Attic & current vents</h3>

        <Field label="Attic floor area (sqft)">
          <Num value={atticSqft} set={setAtticSqft} min={100} max={20000} step={50} />
          <Hint>Usually equals the home's footprint (not finished sqft).</Hint>
        </Field>

        <Field label="Ventilation ratio (code)">
          <select value={ratio} onChange={(e) => setRatio(e.target.value as "1to300" | "1to150")} className="w-full rounded border border-slate-300 px-2 py-1 text-sm">
            <option value="1to300">1:300 — vapor retarder OR balanced 50/50 intake/exhaust</option>
            <option value="1to150">1:150 — no vapor retarder + unbalanced ventilation</option>
          </select>
          <Hint>Most modern homes hit 1:300 because they have a vapor retarder and balance the ventilation. 1:150 doubles the required NFA.</Hint>
        </Field>

        <Field label="Ridge vent — linear feet of continuous ridge vent installed">
          <Num value={ridgeLF} set={setRidgeLF} min={0} max={500} step={1} />
          <Hint>Most efficient exhaust. ~18 sq.in. NFA per LF of ridge vent.</Hint>
        </Field>

        <Field label="Soffit vent — linear feet of continuous strip soffit">
          <Num value={soffitLF} set={setSoffitLF} min={0} max={1000} step={5} />
          <Hint>Most efficient intake. ~9 sq.in. NFA per LF of 8″ continuous strip.</Hint>
        </Field>
      </section>

      <section aria-label="Result" className="rounded-md border border-slate-200 bg-white p-4">
        <div className="grid gap-2 text-sm">
          <Row label="Total NFA required" value={`${Math.round(out.totalNfaSqIn)} sq.in.`} bold />
          <Row label="Intake required (lower)" value={`${Math.round(out.intakeNeeded)} sq.in.`} />
          <Row label="Exhaust required (upper)" value={`${Math.round(out.exhaustNeeded)} sq.in.`} />
          <div className="my-1 border-t border-dashed border-slate-200"></div>
          <Row label="Soffit NFA you have" value={`${Math.round(out.soffitNFA)} sq.in.`} />
          <Row label="Ridge vent NFA you have" value={`${Math.round(out.ridgeNFA)} sq.in.`} />
        </div>

        <div className="mt-4 grid gap-2">
          <Verdict ok={out.intakeOk} label="Intake (soffit)">
            {out.intakeOk
              ? `Sufficient — ${Math.round(out.soffitNFA)} of ${Math.round(out.intakeNeeded)} sq.in. needed.`
              : `Short by ${Math.round(out.soffitShortfall)} sq.in. Add ${Math.ceil(out.soffitShortfall / SOFFIT_VENT_NFA_PER_LF)} LF of soffit vent (or larger eave vents).`}
          </Verdict>
          <Verdict ok={out.exhaustOk} label="Exhaust (ridge / vents)">
            {out.exhaustOk
              ? `Sufficient — ${Math.round(out.ridgeNFA)} of ${Math.round(out.exhaustNeeded)} sq.in. needed.`
              : `Short by ${Math.round(out.ridgeShortfall)} sq.in. Add ${Math.ceil(out.ridgeShortfall / RIDGE_VENT_NFA_PER_LF)} LF of ridge vent OR ${out.boxVentsNeeded} box vents.`}
          </Verdict>
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-slate-700">
          <strong>Don't mix exhaust types.</strong> A ridge vent + box vents on the same roof can short-circuit airflow — the ridge vent pulls air from the closer box vent instead of the soffit. Use ridge vent OR box vents, not both. Soffit (intake) + ridge (exhaust) is the most efficient and universally accepted pairing.
        </div>

        <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          <strong>Why ventilation matters.</strong> Inadequate attic ventilation traps heat (above 150°F is common in Texas summers) and moisture. Heat shortens shingle life by 20–40%. Moisture rots decking and grows mold. A properly-vented attic in Houston runs 15–25°F cooler than an unvented one.
        </div>

        <div className="mt-4 grid gap-2 text-sm">
          <a href="/homelab/roof-replacement-cost-calculator/" className="block rounded-md border border-slate-200 bg-slate-50 p-3 hover:border-amber-500">
            <div className="font-medium text-slate-900">→ Roof Replacement Cost Calculator</div>
            <div className="text-xs text-slate-600">Add ridge vent or box vents to the scope before tear-off.</div>
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
function Verdict({ ok, label, children }: { ok: boolean; label: string; children: React.ReactNode }): JSX.Element {
  const cls = ok ? "border-emerald-300 bg-emerald-50 text-emerald-900" : "border-rose-300 bg-rose-50 text-rose-900";
  return (
    <div className={`rounded-md border ${cls} px-3 py-2 text-sm`}>
      <div className="font-semibold">{ok ? "✓" : "!"} {label}</div>
      <div className="mt-0.5 text-xs">{children}</div>
    </div>
  );
}

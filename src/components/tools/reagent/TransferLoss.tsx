import React, { useEffect, useMemo, useState } from 'react';
import { writeMetric, writeFlag } from '~/lib/kfw-bridge';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-syringe-waste-v1';

interface State {
  vialMass: string;
  bacVolume: string;
  vialCost: string;
  dosesPerVial: string;
  leakagePerDraw: string;
  criticalPct: string;
}
const DEFAULT_STATE: State = {
  vialMass: '5',
  bacVolume: '2',
  vialCost: '60',
  dosesPerVial: '8',
  leakagePerDraw: '0.02',
  criticalPct: '10',
};

export default function TransferLoss() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.vialMass, state.bacVolume, state.vialCost, state.dosesPerVial, state.leakagePerDraw, state.criticalPct]);

  const calc = useMemo(() => {
    const mass = Math.max(0, parseNum(state.vialMass));
    const vol = Math.max(0, parseNum(state.bacVolume));
    const cost = Math.max(0, parseNum(state.vialCost));
    const doses = Math.max(0, parseNum(state.dosesPerVial));
    const leakMl = Math.max(0, parseNum(state.leakagePerDraw));
    const critPct = Math.max(0, parseNum(state.criticalPct));

    if (vol <= 0) return { err: 'BAC volume must be greater than 0 mL' } as const;
    if (doses <= 0) return { err: 'Doses per vial must be greater than 0' } as const;

    const conc = mass / vol;
    const leakMg = leakMl * conc;
    const totalLeakMl = leakMl * doses;
    const totalLeakMg = leakMg * doses;
    const vialUsagePerYear = (365 / Math.max(1, doses)) * 1;
    const wastePctPerVial = vol > 0 ? (totalLeakMl / vol) * 100 : 0;
    const wastedCostPerVial = mass > 0 ? (totalLeakMg / mass) * cost : 0;
    const vialsPerYear = 365 / Math.max(1, doses);
    const annualWasteCost = wastedCostPerVial * vialsPerYear;
    const annualCost = cost * vialsPerYear;
    const annualWastePct = annualCost > 0 ? (annualWasteCost / annualCost) * 100 : 0;
    const critical = annualWastePct >= critPct;

    return {
      err: '',
      conc: round2(conc),
      leakMg: round2(leakMg),
      totalLeakMl: round2(totalLeakMl),
      totalLeakMg: round2(totalLeakMg),
      wastePctPerVial: round2(wastePctPerVial),
      wastedCostPerVial: round2(wastedCostPerVial),
      vialsPerYear: round2(vialsPerYear),
      annualWasteCost: round2(annualWasteCost),
      annualCost: round2(annualCost),
      annualWastePct: round2(annualWastePct),
      critPct,
      critical,
      vol,
      vialUsagePerYear,
    } as const;
  }, [state]);

  useEffect(() => {
    if (!hydrated || !verified || 'err' in calc && calc.err) return;
    if ('annualWastePct' in calc) {
      writeMetric('reagent_waste_pct', calc.annualWastePct);
      writeFlag('reagent_waste_critical', calc.critical);
    }
  }, [calc, verified, hydrated]);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>SDS-1 · Syringe Dead-Space · Waste Budget</div>
        <div style={{ fontSize: 11, color: DIM }}>Per-draw leakage × draws per vial × vials per year → annual $ loss</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Vial mass (mg)</div>
          <input inputMode="decimal" value={state.vialMass} onChange={(e) => setState({ ...state, vialMass: e.target.value })} style={inputStyle} />
          <div style={dimHint}>lyophilized powder</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>BAC water (mL)</div>
          <input inputMode="decimal" value={state.bacVolume} onChange={(e) => setState({ ...state, bacVolume: e.target.value })} style={inputStyle} />
          <div style={dimHint}>post-reconstitution</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Vial cost ($)</div>
          <input inputMode="decimal" value={state.vialCost} onChange={(e) => setState({ ...state, vialCost: e.target.value })} style={inputStyle} />
          <div style={dimHint}>landed cost</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Doses per vial</div>
          <input inputMode="decimal" value={state.dosesPerVial} onChange={(e) => setState({ ...state, dosesPerVial: e.target.value })} style={inputStyle} />
          <div style={dimHint}>draws before empty</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Leak per draw (mL)</div>
          <input inputMode="decimal" value={state.leakagePerDraw} onChange={(e) => setState({ ...state, leakagePerDraw: e.target.value })} style={inputStyle} />
          <div style={dimHint}>syringe dead-space · typ 0.02–0.07</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Critical threshold (%)</div>
          <input inputMode="decimal" value={state.criticalPct} onChange={(e) => setState({ ...state, criticalPct: e.target.value })} style={inputStyle} />
          <div style={dimHint}>annual waste budget · LED trips above this</div>
        </label>
      </div>

      {'err' in calc && calc.err && (
        <div style={{ ...panelStyle, borderColor: MAGENTA, marginBottom: '1rem' }}>
          <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ SYSTEM ERROR</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>{calc.err}</div>
        </div>
      )}

      {!('err' in calc && calc.err) && 'annualWastePct' in calc && (
        <>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0.5rem 0.75rem', background: verified ? 'rgba(34,211,238,0.1)' : '#1e293b', border: `1px solid ${verified ? CYAN : BORDER}`, borderRadius: 6, marginBottom: '0.75rem', cursor: 'pointer', fontSize: 11 }}>
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            <span style={{ color: verified ? CYAN : TEXT }}>
              {verified ? '✓ INPUTS VERIFIED — run waste audit' : 'Confirm mass, volume, cost, and dead-space before audit'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: calc.critical ? MAGENTA : CYAN, marginBottom: '0.75rem', display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Annual Waste</div>
                  <div style={{ fontSize: 28, color: calc.critical ? MAGENTA : CYAN, fontWeight: 700, lineHeight: 1.1 }}>${calc.annualWasteCost.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>of ${calc.annualCost.toFixed(2)} / yr</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Loss Ratio</div>
                  <div style={{ fontSize: 28, color: calc.critical ? MAGENTA : GOLD, fontWeight: 700, lineHeight: 1.1 }}>{calc.annualWastePct.toFixed(2)}%</div>
                  <div style={{ fontSize: 11, color: DIM }}>threshold {calc.critPct}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Per Vial</div>
                  <div style={{ fontSize: 18, color: TEXT, fontWeight: 700, lineHeight: 1.1 }}>{calc.totalLeakMl.toFixed(2)} mL</div>
                  <div style={{ fontSize: 11, color: DIM }}>{calc.totalLeakMg.toFixed(2)} mg · ${calc.wastedCostPerVial.toFixed(2)}</div>
                </div>
              </div>

              <svg width="100%" height={40} viewBox="0 0 400 40" aria-label="Waste vs budget" style={{ marginBottom: '0.75rem' }}>
                <rect x={10} y={12} width={380} height={16} fill="none" stroke={DIM} strokeWidth={1} />
                <rect x={10} y={12} width={Math.min(380, (calc.annualWastePct / Math.max(1, calc.critPct * 2)) * 380)} height={16} fill={calc.critical ? MAGENTA : CYAN} opacity={0.7} />
                <line x1={10 + (calc.critPct / Math.max(1, calc.critPct * 2)) * 380} y1={8} x2={10 + (calc.critPct / Math.max(1, calc.critPct * 2)) * 380} y2={32} stroke={GOLD} strokeWidth={2} strokeDasharray="3 2" />
                <text x={10 + (calc.critPct / Math.max(1, calc.critPct * 2)) * 380} y={6} fontSize={8} fill={GOLD} textAnchor="middle" fontFamily="inherit">{calc.critPct}%</text>
              </svg>

              {calc.critical && (
                <div style={{ ...panelStyle, borderColor: MAGENTA }}>
                  <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ CRITICAL LED · WASTE BUDGET EXCEEDED</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    Annual leakage is {calc.annualWastePct.toFixed(2)}% of vial spend — above {calc.critPct}% budget. Switch to low-dead-space insulin syringes (0.3 mL, 29–31 G) or reduce draw count.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Waste Audit</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Dead-space varies by syringe model; measure your own by weighing before/after draw. Research/compounding contexts only.
      </div>
    </div>
  );
}

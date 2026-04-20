import React, { useEffect, useMemo, useState } from 'react';
import { writeMetric, writeFlag } from '~/lib/kfw-bridge';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-sarcopenia-v1';

interface State {
  weightBeforeKg: string;
  weightAfterKg: string;
  leanBeforeKg: string;
  leanAfterKg: string;
  criticalPct: string;
}
const DEFAULT_STATE: State = {
  weightBeforeKg: '100', weightAfterKg: '92', leanBeforeKg: '60', leanAfterKg: '57', criticalPct: '25',
};

type Status = 'Nominal' | 'Guarded' | 'Critical';

export default function Sarcopenia() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.weightBeforeKg, state.weightAfterKg, state.leanBeforeKg, state.leanAfterKg, state.criticalPct]);

  const calc = useMemo(() => {
    const wBefore = Math.max(0, parseNum(state.weightBeforeKg));
    const wAfter = Math.max(0, parseNum(state.weightAfterKg));
    const lBefore = Math.max(0, parseNum(state.leanBeforeKg));
    const lAfter = Math.max(0, parseNum(state.leanAfterKg));
    const critPct = Math.max(0, parseNum(state.criticalPct));
    let err = '';
    if (wBefore <= 0 || wAfter <= 0) err = 'Body weights must be greater than 0 kg';
    else if (lBefore <= 0 || lAfter <= 0) err = 'Lean masses must be greater than 0 kg';
    else if (wAfter > wBefore) err = 'After-weight is greater than before — no loss recorded';
    else if (lBefore > wBefore || lAfter > wAfter) err = 'Lean mass exceeds total body weight';

    const deltaTotal = wBefore - wAfter;
    const deltaLean = lBefore - lAfter;
    const deltaFat = deltaTotal - deltaLean;
    const leanRatioPct = deltaTotal > 0 ? (deltaLean / deltaTotal) * 100 : 0;
    let status: Status = 'Nominal';
    if (leanRatioPct >= critPct) status = 'Critical';
    else if (leanRatioPct >= critPct * 0.7) status = 'Guarded';
    return {
      err,
      deltaTotal: round2(deltaTotal),
      deltaLean: round2(deltaLean),
      deltaFat: round2(deltaFat),
      leanRatioPct: round2(leanRatioPct),
      critPct,
      status,
    };
  }, [state]);

  useEffect(() => {
    if (!hydrated || !verified || calc.err) return;
    writeMetric('peptide_lean_ratio_pct', calc.leanRatioPct);
    writeFlag('peptide_sarcopenia_critical', calc.status === 'Critical');
  }, [calc, verified, hydrated]);

  const statusColor = calc.status === 'Critical' ? MAGENTA : calc.status === 'Guarded' ? GOLD : CYAN;
  const angleDeg = Math.max(0, Math.min(100, calc.leanRatioPct)) * 1.8 - 90;
  const rad = (angleDeg * Math.PI) / 180;
  const cx = 110, cy = 110, r = 80;
  const nx = cx + r * Math.sin(rad);
  const ny = cy - r * Math.cos(rad);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>SAR-1 · SARCOPENIA GUARD</div>
        <div style={{ fontSize: 11, color: DIM }}>Lean-mass share of total weight loss · wasting-risk gauge</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Weight before (kg)</div>
          <input inputMode="decimal" value={state.weightBeforeKg} onChange={(e) => setState({ ...state, weightBeforeKg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>baseline body weight</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Weight after (kg)</div>
          <input inputMode="decimal" value={state.weightAfterKg} onChange={(e) => setState({ ...state, weightAfterKg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>current body weight</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Lean before (kg)</div>
          <input inputMode="decimal" value={state.leanBeforeKg} onChange={(e) => setState({ ...state, leanBeforeKg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>DEXA / BIA baseline</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Lean after (kg)</div>
          <input inputMode="decimal" value={state.leanAfterKg} onChange={(e) => setState({ ...state, leanAfterKg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>DEXA / BIA follow-up</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Critical threshold (%)</div>
          <input inputMode="decimal" value={state.criticalPct} onChange={(e) => setState({ ...state, criticalPct: e.target.value })} style={inputStyle} />
          <div style={dimHint}>% of loss that is lean</div>
        </label>
      </div>

      {calc.err && (
        <div style={{ ...panelStyle, borderColor: MAGENTA, marginBottom: '1rem' }}>
          <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ SYSTEM ERROR</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>{calc.err}</div>
        </div>
      )}

      {!calc.err && (
        <>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0.5rem 0.75rem', background: verified ? 'rgba(34,211,238,0.1)' : '#1e293b', border: `1px solid ${verified ? CYAN : BORDER}`, borderRadius: 6, marginBottom: '0.75rem', cursor: 'pointer', fontSize: 11 }}>
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            <span style={{ color: verified ? CYAN : TEXT }}>
              {verified ? '✓ INPUTS VERIFIED — reveal wasting-risk status' : 'Confirm body + lean masses before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: statusColor, display: 'grid', gap: '0.75rem', gridTemplateColumns: '220px 1fr', alignItems: 'center' }}>
                <svg width={220} height={140} viewBox="0 0 220 140" aria-label="Sarcopenia risk gauge">
                  <path d={`M 30 110 A 80 80 0 0 1 190 110`} fill="none" stroke={CYAN} strokeWidth={10} opacity={0.35} />
                  <path d={`M 30 110 A 80 80 0 0 1 110 30`} fill="none" stroke={CYAN} strokeWidth={10} opacity={0.75} />
                  <path d={`M 110 30 A 80 80 0 0 1 150 41`} fill="none" stroke={GOLD} strokeWidth={10} opacity={0.85} />
                  <path d={`M 150 41 A 80 80 0 0 1 190 110`} fill="none" stroke={MAGENTA} strokeWidth={10} opacity={0.85} />
                  <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={statusColor} strokeWidth={3} strokeLinecap="round" />
                  <circle cx={cx} cy={cy} r={6} fill={statusColor} />
                  <text x={30} y={128} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">0%</text>
                  <text x={110} y={22} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">50%</text>
                  <text x={190} y={128} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">100%</text>
                  <text x={110} y={105} fontSize={22} fill={statusColor} textAnchor="middle" fontFamily="inherit" fontWeight={700}>{calc.leanRatioPct.toFixed(1)}%</text>
                  <text x={110} y={122} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">lean share</text>
                </svg>
                <div style={{ display: 'grid', gap: 4, fontSize: 11 }}>
                  <div><span style={{ color: DIM }}>Total loss:</span> <span style={{ color: TEXT }}>{calc.deltaTotal.toFixed(2)} kg</span></div>
                  <div><span style={{ color: DIM }}>Lean loss:</span> <span style={{ color: statusColor }}>{calc.deltaLean.toFixed(2)} kg ({calc.leanRatioPct.toFixed(1)}%)</span></div>
                  <div><span style={{ color: DIM }}>Fat loss:</span> <span style={{ color: GOLD }}>{calc.deltaFat.toFixed(2)} kg</span></div>
                  <div style={{ marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.1em', color: statusColor, fontWeight: 700 }}>Status: {calc.status}</div>
                </div>
              </div>

              {calc.status === 'Critical' && (
                <div style={{ ...panelStyle, borderColor: MAGENTA, marginTop: '0.75rem' }}>
                  <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ CRITICAL · MUSCLE WASTING RISK</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    Review protein intake + resistance training before continuing dose.
                  </div>
                </div>
              )}

              <div style={{ fontSize: 10, color: DIM, marginTop: '0.75rem', fontStyle: 'italic' }}>
                Pair with Metabolic Floor (BMR/TDEE) and Anabolic Trigger (protein bolus) to defend lean mass.
              </div>
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Wasting Risk</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Body composition changes require professional measurement (DEXA/BIA). Research/education only.
      </div>
    </div>
  );
}

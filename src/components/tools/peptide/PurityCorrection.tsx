import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-purity-v1';

interface State {
  labelMassMg: string;
  purityPct: string;
  targetDoseMg: string;
  bacVolumeMl: string;
}

const DEFAULT_STATE: State = {
  labelMassMg: '5',
  purityPct: '98.2',
  targetDoseMg: '0.25',
  bacVolumeMl: '2',
};

export default function PurityCorrection() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.labelMassMg, state.purityPct, state.targetDoseMg, state.bacVolumeMl]);

  const calc = useMemo(() => {
    const label = Math.max(0, parseNum(state.labelMassMg));
    const purity = Math.max(0, parseNum(state.purityPct));
    const target = Math.max(0, parseNum(state.targetDoseMg));
    const vol = Math.max(0, parseNum(state.bacVolumeMl));
    let err = '';
    if (label <= 0) err = 'Label mass must be greater than 0 mg.';
    else if (vol <= 0) err = 'BAC volume must be greater than 0 mL.';
    else if (target <= 0) err = 'Target dose must be greater than 0 mg.';
    else if (purity <= 0 || purity > 100) err = 'Purity must be between 0 and 100 %.';
    if (err) return { err, actualMass: 0, concAdj: 0, concNaive: 0, drawAdj: 0, drawNaive: 0, delta: 0 };

    const actualMass = label * (purity / 100);
    const concAdj = actualMass / vol;
    const concNaive = label / vol;
    const drawAdj = (target / concAdj) * 100;
    const drawNaive = (target / concNaive) * 100;
    const delta = drawAdj - drawNaive;

    return {
      err,
      actualMass: round2(actualMass),
      concAdj: round2(concAdj),
      concNaive: round2(concNaive),
      drawAdj: round2(drawAdj),
      drawNaive: round2(drawNaive),
      delta: round2(delta),
    };
  }, [state]);

  const purityFrac = Math.min(1, Math.max(0, parseNum(state.purityPct) / 100));

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>MPC-1 · Mass-Purity Correction</div>
        <div style={{ fontSize: 11, color: DIM }}>actual active mass from HPLC purity % — purity-corrected unit draw</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr 1fr 1fr 140px', alignItems: 'start', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Label mass (mg)</div>
          <input inputMode="decimal" value={state.labelMassMg} onChange={(e) => setState({ ...state, labelMassMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>vial claim</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Purity (%)</div>
          <input inputMode="decimal" value={state.purityPct} onChange={(e) => setState({ ...state, purityPct: e.target.value })} style={inputStyle} />
          <div style={dimHint}>HPLC certificate</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Target dose (mg)</div>
          <input inputMode="decimal" value={state.targetDoseMg} onChange={(e) => setState({ ...state, targetDoseMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>protocol dose</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>BAC volume (mL)</div>
          <input inputMode="decimal" value={state.bacVolumeMl} onChange={(e) => setState({ ...state, bacVolumeMl: e.target.value })} style={inputStyle} />
          <div style={dimHint}>reconstitution</div>
        </label>
        <svg width={120} height={120} viewBox="0 0 120 120" aria-label="Purity filter" style={{ justifySelf: 'center' }}>
          {/* funnel outline */}
          <polygon points="10,15 110,15 72,70 72,110 48,110 48,70" fill="none" stroke={DIM} strokeWidth={1.3} />
          {/* dirty input particles (GOLD) */}
          {[[20, 30], [40, 25], [60, 32], [80, 28], [100, 34], [30, 40], [70, 42], [90, 45]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={2.2} fill={GOLD} opacity={0.85} />
          ))}
          {/* filter mesh line */}
          <line x1={48} y1={70} x2={72} y2={70} stroke={MAGENTA} strokeWidth={1.3} strokeDasharray="2 2" />
          {/* output stream — width proportional to purity */}
          <rect
            x={60 - 10 * purityFrac}
            y={72}
            width={20 * purityFrac}
            height={36}
            fill={LIQUID}
            opacity={0.55}
          />
          {/* pure CYAN droplets exiting */}
          {[[60, 90], [58, 100], [62, 108]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={1.4} fill={CYAN} opacity={0.95} />
          ))}
          <text x={60} y={10} fontSize={8} fill={DIM} textAnchor="middle" fontFamily="inherit">label</text>
          <text x={60} y={118} fontSize={8} fill={CYAN} textAnchor="middle" fontFamily="inherit">{(purityFrac * 100).toFixed(1)}%</text>
        </svg>
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
              {verified ? '✓ INPUTS VERIFIED — reveal purity-corrected draw' : 'Confirm mass, purity, and volume before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: CYAN, display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Actual mass</div>
                  <div style={{ fontSize: 22, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.actualMass.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mg active</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Adjusted conc.</div>
                  <div style={{ fontSize: 22, color: GOLD, fontWeight: 700, lineHeight: 1.1 }}>{calc.concAdj.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mg / mL</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Draw to</div>
                  <div style={{ fontSize: 22, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.drawAdj.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>units (U-100)</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>vs naive</div>
                  <div style={{ fontSize: 22, color: MAGENTA, fontWeight: 700, lineHeight: 1.1 }}>{calc.drawNaive.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>{calc.delta >= 0 ? '+' : ''}{calc.delta.toFixed(2)} u delta</div>
                </div>
              </div>

              <div style={{ ...panelStyle, borderColor: GOLD, fontSize: 11, color: TEXT }}>
                <div style={{ color: GOLD, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>▸ NUDGE</div>
                Update PRC-1 concentration input to <span style={{ color: CYAN, fontWeight: 700 }}>{calc.concAdj.toFixed(2)} mg/mL</span> to match this purity-corrected value.
              </div>
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Purity Correction</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Purity correction assumes HPLC certificate accuracy; salt/counter-ion mass not deducted here. Research/compounding contexts only.
      </div>
    </div>
  );
}

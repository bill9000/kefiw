import React, { useEffect, useMemo, useState } from 'react';
import { writeMetric } from '~/lib/kfw-bridge';
import {
  BG, PANEL, BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-recon-v1';

interface State { vialMass: string; bacVolume: string; }
const DEFAULT_STATE: State = { vialMass: '5', bacVolume: '2' };

export default function ReagentRecon() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.vialMass, state.bacVolume]);

  const calc = useMemo(() => {
    const mass = Math.max(0, parseNum(state.vialMass));
    const vol = Math.max(0, parseNum(state.bacVolume));
    const err = vol <= 0 ? 'BAC volume must be greater than 0 mL' : '';
    const concMgMl = err ? 0 : mass / vol;
    return { mass, vol, err, concMgMl: round2(concMgMl), concMcgMl: round2(concMgMl * 1000) };
  }, [state]);

  useEffect(() => {
    if (!hydrated || !verified || calc.err) return;
    writeMetric('reagent_concentration_mg_ml', calc.concMgMl);
  }, [calc.concMgMl, calc.err, verified, hydrated]);

  const vialFillPct = Math.min(100, (calc.vol / 10) * 100);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>PRC-1 · Reagent Reconstitution</div>
        <div style={{ fontSize: 11, color: DIM }}>mg / mL concentration after BAC water addition</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 140px', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Vial mass (mg)</div>
          <input inputMode="decimal" value={state.vialMass} onChange={(e) => setState({ ...state, vialMass: e.target.value })} style={inputStyle} />
          <div style={dimHint}>lyophilized powder · label amount</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>BAC water (mL)</div>
          <input inputMode="decimal" value={state.bacVolume} onChange={(e) => setState({ ...state, bacVolume: e.target.value })} style={inputStyle} />
          <div style={dimHint}>bacteriostatic · 0.9% benzyl alcohol</div>
        </label>
        <svg width={120} height={140} viewBox="0 0 60 140" aria-label="Vial fill">
          <rect x={10} y={12} width={40} height={120} fill="none" stroke={DIM} strokeWidth={1.5} rx={4} />
          <rect x={22} y={4} width={16} height={8} fill={DIM} rx={1} />
          <rect x={12} y={14 + (120 - (vialFillPct / 100) * 120)} width={36} height={(vialFillPct / 100) * 120 - 2} fill={LIQUID} opacity={0.75} />
          <line x1={10} y1={14 + 120 * 0.75} x2={50} y2={14 + 120 * 0.75} stroke={DIM} strokeDasharray="2 2" strokeWidth={0.5} />
          <text x={52} y={14 + 120 * 0.75 + 3} fontSize={8} fill={DIM} fontFamily="inherit">2.5</text>
          <line x1={10} y1={14 + 120 * 0.5} x2={50} y2={14 + 120 * 0.5} stroke={DIM} strokeDasharray="2 2" strokeWidth={0.5} />
          <text x={52} y={14 + 120 * 0.5 + 3} fontSize={8} fill={DIM} fontFamily="inherit">5.0</text>
          <line x1={10} y1={14 + 120 * 0.25} x2={50} y2={14 + 120 * 0.25} stroke={DIM} strokeDasharray="2 2" strokeWidth={0.5} />
          <text x={52} y={14 + 120 * 0.25 + 3} fontSize={8} fill={DIM} fontFamily="inherit">7.5</text>
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
              {verified ? '✓ INPUTS VERIFIED — reveal concentration' : 'Confirm vial mass and BAC volume before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: CYAN, display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Concentration</div>
                <div style={{ fontSize: 28, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.concMgMl.toFixed(2)}</div>
                <div style={{ fontSize: 11, color: DIM }}>mg / mL</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Potency</div>
                <div style={{ fontSize: 28, color: GOLD, fontWeight: 700, lineHeight: 1.1 }}>{calc.concMcgMl.toFixed(0)}</div>
                <div style={{ fontSize: 11, color: DIM }}>μg / mL</div>
              </div>
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Concentration</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Verify every input before drawing. Research/compounding contexts only.
      </div>
    </div>
  );
}

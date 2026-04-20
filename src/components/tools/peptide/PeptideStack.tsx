import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-stack-v1';

interface State {
  massA: string;
  massB: string;
  nameA: string;
  nameB: string;
  bacVolumeMl: string;
}
const DEFAULT_STATE: State = { massA: '5', massB: '10', nameA: 'BPC-157', nameB: 'TB-500', bacVolumeMl: '3' };
const DRAWS: number[] = [5, 10, 15, 20, 25];

export default function PeptideStack() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.massA, state.massB, state.nameA, state.nameB, state.bacVolumeMl]);

  const calc = useMemo(() => {
    const mA = Math.max(0, parseNum(state.massA));
    const mB = Math.max(0, parseNum(state.massB));
    const vol = Math.max(0, parseNum(state.bacVolumeMl));
    const err = vol <= 0 ? 'BAC volume must be greater than 0 mL' : (mA <= 0 && mB <= 0 ? 'At least one peptide mass must be greater than 0 mg' : '');
    const concA = err ? 0 : mA / vol;
    const concB = err ? 0 : mB / vol;
    const rows = DRAWS.map((u) => ({
      units: u,
      mcgA: round2(concA * 1000 * u / 100),
      mcgB: round2(concB * 1000 * u / 100),
    }));
    return { mA, mB, vol, err, concA: round2(concA), concB: round2(concB), combined: round2(concA + concB), rows };
  }, [state]);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>STK-1 · MULTI-PEPTIDE STACK</div>
        <div style={{ fontSize: 11, color: DIM }}>Co-reconstitution of two peptides in a single vial · per-unit dual draw</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr)) 120px', alignItems: 'center', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Peptide A label</div>
          <input value={state.nameA} onChange={(e) => setState({ ...state, nameA: e.target.value })} style={inputStyle} />
          <div style={dimHint}>name · for reference only</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Mass A (mg)</div>
          <input inputMode="decimal" value={state.massA} onChange={(e) => setState({ ...state, massA: e.target.value })} style={inputStyle} />
          <div style={dimHint}>lyophilized powder in vial</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Peptide B label</div>
          <input value={state.nameB} onChange={(e) => setState({ ...state, nameB: e.target.value })} style={inputStyle} />
          <div style={dimHint}>name · for reference only</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Mass B (mg)</div>
          <input inputMode="decimal" value={state.massB} onChange={(e) => setState({ ...state, massB: e.target.value })} style={inputStyle} />
          <div style={dimHint}>lyophilized powder in vial</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>BAC water (mL)</div>
          <input inputMode="decimal" value={state.bacVolumeMl} onChange={(e) => setState({ ...state, bacVolumeMl: e.target.value })} style={inputStyle} />
          <div style={dimHint}>single BAC charge · shared volume</div>
        </label>
        <svg width={100} height={140} viewBox="0 0 80 140" aria-label="Dual-chamber vial">
          <rect x={16} y={12} width={48} height={120} fill="none" stroke={DIM} strokeWidth={1.5} rx={4} />
          <rect x={28} y={4} width={24} height={8} fill={DIM} rx={1} />
          <rect x={18} y={14} width={22} height={28} fill={CYAN} opacity={0.55} />
          <rect x={40} y={14} width={22} height={28} fill={GOLD} opacity={0.55} />
          <text x={29} y={30} fontSize={8} fill="#0b1120" fontFamily="inherit" textAnchor="middle" fontWeight={700}>A</text>
          <text x={51} y={30} fontSize={8} fill="#0b1120" fontFamily="inherit" textAnchor="middle" fontWeight={700}>B</text>
          <line x1={18} y1={44} x2={62} y2={44} stroke={DIM} strokeDasharray="2 2" strokeWidth={0.5} />
          <rect x={18} y={46} width={44} height={84} fill={LIQUID} opacity={0.6} />
          <text x={40} y={94} fontSize={9} fill={TEXT} fontFamily="inherit" textAnchor="middle" fontWeight={700}>A+B</text>
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
              {verified ? '✓ INPUTS VERIFIED — reveal stack draws' : 'Confirm both masses and BAC volume before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: CYAN }}>
              <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{state.nameA || 'A'}</div>
                  <div style={{ fontSize: 20, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.concA.toFixed(2)}</div>
                  <div style={{ fontSize: 10, color: DIM }}>mg / mL</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>{state.nameB || 'B'}</div>
                  <div style={{ fontSize: 20, color: GOLD, fontWeight: 700, lineHeight: 1.1 }}>{calc.concB.toFixed(2)}</div>
                  <div style={{ fontSize: 10, color: DIM }}>mg / mL</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Combined</div>
                  <div style={{ fontSize: 20, color: LIQUID, fontWeight: 700, lineHeight: 1.1 }}>{calc.combined.toFixed(2)}</div>
                  <div style={{ fontSize: 10, color: DIM }}>mg / mL (A+B)</div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    <th style={{ textAlign: 'left', padding: '4px 6px', borderBottom: `1px solid ${BORDER}` }}>Units</th>
                    <th style={{ textAlign: 'right', padding: '4px 6px', borderBottom: `1px solid ${BORDER}`, color: CYAN }}>{state.nameA || 'A'} (mcg)</th>
                    <th style={{ textAlign: 'right', padding: '4px 6px', borderBottom: `1px solid ${BORDER}`, color: GOLD }}>{state.nameB || 'B'} (mcg)</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.rows.map((r) => (
                    <tr key={r.units}>
                      <td style={{ padding: '4px 6px', color: TEXT }}>{r.units}u</td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', color: CYAN }}>{r.mcgA.toFixed(2)}</td>
                      <td style={{ padding: '4px 6px', textAlign: 'right', color: GOLD }}>{r.mcgB.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Stack Draws</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Co-reconstitution compatibility depends on peptide chemistry — verify stability before combining. Research/compounding contexts only.
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { readDashboard, subscribeDashboard } from '~/lib/kfw-bridge';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-mcg-per-unit-v1';

interface State { concMgMl: string; useBridge: boolean; }
const DEFAULT_STATE: State = { concMgMl: '2.5', useBridge: true };

export default function McgPerUnit() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);
  const [bridgeConc, setBridgeConc] = useState<number | undefined>(undefined);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.concMgMl, state.useBridge]);

  useEffect(() => {
    const sync = () => setBridgeConc(readDashboard().metrics.peptide_concentration_mg_ml);
    sync();
    return subscribeDashboard(sync);
  }, []);

  const calc = useMemo(() => {
    const conc = state.useBridge && bridgeConc !== undefined && bridgeConc > 0
      ? bridgeConc
      : Math.max(0, parseNum(state.concMgMl));
    const err = conc <= 0 ? 'Concentration must be greater than 0 mg/mL' : '';
    const mcgPerUnit = err ? 0 : (conc * 1000) / 100;
    const rows = err ? [] : [5, 10, 15, 20, 25, 50].map((u) => ({ units: u, mcg: round2(mcgPerUnit * u) }));
    return {
      conc, err,
      mcgPerUnit: round2(mcgPerUnit),
      rows,
      bridgeLive: state.useBridge && bridgeConc !== undefined && bridgeConc > 0,
    };
  }, [state, bridgeConc]);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>MCU-1 · mcg per Unit Lookup</div>
        <div style={{ fontSize: 11, color: DIM }}>Sliding-rule dose table · U-100 syringe tick → micrograms</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr', marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Concentration (mg/mL){calc.bridgeLive ? <span style={{ color: CYAN, marginLeft: 6 }}>· LIVE from PRC-1</span> : null}</div>
          <input
            inputMode="decimal"
            value={calc.bridgeLive ? String(bridgeConc ?? '') : state.concMgMl}
            disabled={calc.bridgeLive}
            onChange={(e) => setState({ ...state, concMgMl: e.target.value })}
            style={{ ...inputStyle, opacity: calc.bridgeLive ? 0.6 : 1 }}
          />
          <div style={dimHint}>reconstituted mg per mL</div>
        </label>
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: DIM, marginBottom: '1rem' }}>
        <input type="checkbox" checked={state.useBridge} onChange={(e) => setState({ ...state, useBridge: e.target.checked })} />
        <span>Auto-fill concentration from PRC-1 reconstitution (if available)</span>
      </label>

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
              {verified ? '✓ CONCENTRATION VERIFIED — reveal lookup table' : 'Confirm concentration before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: CYAN, marginBottom: '0.75rem', display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Per Unit Tick</div>
                  <div style={{ fontSize: 28, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.mcgPerUnit.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mcg · 1 unit on U-100</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Density</div>
                  <div style={{ fontSize: 28, color: GOLD, fontWeight: 700, lineHeight: 1.1 }}>{(calc.conc * 1000).toFixed(0)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mcg / mL</div>
                </div>
              </div>

              <div style={{ ...panelStyle }}>
                <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>Dose Lookup · Draw → mcg</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ color: DIM, borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px' }}>Units drawn</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px' }}>mcg delivered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.rows.map((r) => (
                      <tr key={r.units} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '6px 8px', color: TEXT }}>{r.units} u</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', color: CYAN, fontWeight: 700 }}>{r.mcg.toFixed(2)} mcg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>mcg per Unit</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. U-100 convention: 1 unit = 0.01 mL. Always verify concentration source before drawing. Research/compounding contexts only.
      </div>
    </div>
  );
}

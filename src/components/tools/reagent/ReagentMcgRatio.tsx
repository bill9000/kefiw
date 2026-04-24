import React, { useEffect, useMemo, useState } from 'react';
import { readDashboard, subscribeDashboard } from '~/lib/kfw-bridge';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-mcg-per-unit-v2';

type SyringeId = 'u100' | 'u40' | 'ins05' | 'ins03' | 'tb1' | 'custom';

interface SyringePreset {
  id: SyringeId;
  label: string;
  volumeMl: number;
  divisions: number;
  unitLabel: string;
}

const SYRINGE_PRESETS: readonly SyringePreset[] = [
  { id: 'u100', label: 'U-100 insulin (1 mL · 100 u)', volumeMl: 1.0, divisions: 100, unitLabel: 'units' },
  { id: 'ins05', label: '0.5 mL insulin (50 u, half-unit barrel)', volumeMl: 0.5, divisions: 50, unitLabel: 'units' },
  { id: 'ins03', label: '0.3 mL insulin (30 u)', volumeMl: 0.3, divisions: 30, unitLabel: 'units' },
  { id: 'u40', label: 'U-40 insulin (1 mL · 40 u)', volumeMl: 1.0, divisions: 40, unitLabel: 'units' },
  { id: 'tb1', label: 'Tuberculin 1 mL (100 × 0.01 mL marks)', volumeMl: 1.0, divisions: 100, unitLabel: '0.01 mL marks' },
  { id: 'custom', label: 'Custom syringe (enter W mL and Q divisions)', volumeMl: 1.0, divisions: 100, unitLabel: 'marks' },
];

interface State {
  concMgMl: string;
  useBridge: boolean;
  syringe: SyringeId;
  customVolMl: string;
  customDivs: string;
}
const DEFAULT_STATE: State = {
  concMgMl: '2.5',
  useBridge: true,
  syringe: 'u100',
  customVolMl: '1',
  customDivs: '100',
};

// Generate ~6 evenly-spaced row values that always include the syringe's max.
function buildRows(divisions: number): number[] {
  if (divisions <= 6) {
    return Array.from({ length: divisions }, (_, i) => i + 1);
  }
  const step = Math.max(1, Math.round(divisions / 6 / 5) * 5) || Math.max(1, Math.round(divisions / 6));
  const rows: number[] = [];
  for (let v = step; v < divisions; v += step) rows.push(v);
  rows.push(divisions);
  return rows;
}

export default function ReagentMcgRatio() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);
  const [bridgeConc, setBridgeConc] = useState<number | undefined>(undefined);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.concMgMl, state.useBridge, state.syringe, state.customVolMl, state.customDivs]);

  useEffect(() => {
    const sync = () => setBridgeConc(readDashboard().metrics.reagent_concentration_mg_ml);
    sync();
    return subscribeDashboard(sync);
  }, []);

  const syringe = useMemo<SyringePreset>(() => {
    const preset = SYRINGE_PRESETS.find((p) => p.id === state.syringe) ?? SYRINGE_PRESETS[0];
    if (preset.id !== 'custom') return preset;
    const customVol = Math.max(0.01, parseNum(state.customVolMl) || 1);
    const customDivs = Math.max(1, Math.round(parseNum(state.customDivs) || 100));
    return { ...preset, volumeMl: customVol, divisions: customDivs };
  }, [state.syringe, state.customVolMl, state.customDivs]);

  const calc = useMemo(() => {
    const conc = state.useBridge && bridgeConc !== undefined && bridgeConc > 0
      ? bridgeConc
      : Math.max(0, parseNum(state.concMgMl));
    const err = conc <= 0 ? 'Concentration must be greater than 0 mg/mL' : '';
    // Units per mL depends on the selected syringe.
    const unitsPerMl = syringe.volumeMl > 0 ? syringe.divisions / syringe.volumeMl : 100;
    const mcgPerUnit = err ? 0 : (conc * 1000) / unitsPerMl;
    const mlPerUnit = err ? 0 : 1 / unitsPerMl;
    const rowUnits = err ? [] : buildRows(syringe.divisions);
    const rows = rowUnits.map((u) => ({
      units: u,
      mcg: round2(mcgPerUnit * u),
      mg: round2(mcgPerUnit * u / 1000),
      ml: round2(mlPerUnit * u),
    }));
    return {
      conc, err,
      mcgPerUnit: round2(mcgPerUnit),
      unitsPerMl,
      rows,
      bridgeLive: state.useBridge && bridgeConc !== undefined && bridgeConc > 0,
    };
  }, [state, bridgeConc, syringe]);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>MCU-1 · mcg per Unit Lookup</div>
        <div style={{ fontSize: 11, color: DIM }}>Sliding-rule lookup table · syringe tick → micrograms, mg, and mL</div>
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

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 11, color: DIM, marginBottom: '0.75rem' }}>
        <input type="checkbox" checked={state.useBridge} onChange={(e) => setState({ ...state, useBridge: e.target.checked })} />
        <span>Auto-fill concentration from PRC-1 reconstitution (if available)</span>
      </label>

      <label style={{ ...labelStyle, marginBottom: state.syringe === 'custom' ? '0.5rem' : '1rem' }}>
        <div style={{ color: DIM, marginBottom: 4 }}>Syringe</div>
        <select
          value={state.syringe}
          onChange={(e) => setState({ ...state, syringe: e.target.value as SyringeId })}
          style={inputStyle}
        >
          {SYRINGE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>{p.label}</option>
          ))}
        </select>
        <div style={dimHint}>{calc.unitsPerMl.toFixed(1)} {syringe.unitLabel}/mL · full barrel {syringe.volumeMl} mL</div>
      </label>
      {state.syringe === 'custom' && (
        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem' }}>
          <label style={labelStyle}>
            <div style={{ color: DIM, marginBottom: 4 }}>Syringe volume W (mL)</div>
            <input inputMode="decimal" value={state.customVolMl} onChange={(e) => setState({ ...state, customVolMl: e.target.value })} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            <div style={{ color: DIM, marginBottom: 4 }}>Divisions Q (marks)</div>
            <input inputMode="numeric" value={state.customDivs} onChange={(e) => setState({ ...state, customDivs: e.target.value })} style={inputStyle} />
          </label>
        </div>
      )}

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
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Per Tick</div>
                  <div style={{ fontSize: 28, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.mcgPerUnit.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mcg · 1 {syringe.unitLabel === 'units' ? 'unit' : 'mark'} on this syringe</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Density</div>
                  <div style={{ fontSize: 28, color: GOLD, fontWeight: 700, lineHeight: 1.1 }}>{(calc.conc * 1000).toFixed(0)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mcg / mL</div>
                </div>
              </div>

              <div style={{ ...panelStyle }}>
                <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8 }}>
                  Lookup · Draw → mcg · mg · mL · {syringe.label}
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ color: DIM, borderBottom: `1px solid ${BORDER}` }}>
                      <th style={{ textAlign: 'left', padding: '6px 8px' }}>{syringe.unitLabel === 'units' ? 'Units' : 'Marks'} drawn</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px' }}>mcg</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px' }}>mg</th>
                      <th style={{ textAlign: 'right', padding: '6px 8px' }}>mL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.rows.map((r) => (
                      <tr key={r.units} style={{ borderBottom: `1px solid ${BORDER}` }}>
                        <td style={{ padding: '6px 8px', color: TEXT }}>
                          {r.units} {syringe.unitLabel === 'units' ? 'u' : ''}
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', color: CYAN, fontWeight: 700 }}>{r.mcg.toFixed(2)}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', color: TEXT }}>{r.mg.toFixed(3)}</td>
                        <td style={{ padding: '6px 8px', textAlign: 'right', color: GOLD }}>{r.ml.toFixed(3)}</td>
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
        Arithmetic only. Not medical advice. The mcg-per-tick figure scales with the syringe you select — U-100 is 1 unit = 0.01 mL, but a 0.5 mL 50-unit barrel, a tuberculin 1 mL (100 × 0.01 mL marks), or a custom W/Q syringe all reshape the table. Always verify concentration source and syringe type before drawing. Research/compounding contexts only.
      </div>
    </div>
  );
}

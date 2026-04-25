import React, { useEffect, useMemo, useState } from 'react';
import { readDashboard, subscribeDashboard, writeMetric } from '~/lib/kfw-bridge';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, RED, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-glp-units-v2';

type SyringeId = 'u100' | 'u40' | 'ins05' | 'ins03' | 'tb1' | 'custom';

interface SyringePreset {
  id: SyringeId;
  label: string;
  volumeMl: number;
  divisions: number; // total markings across the full barrel
  unitLabel: string; // "units" or "mL" etc.
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
  doseMg: string;
  concMgMl: string;
  useBridge: boolean;
  syringe: SyringeId;
  customVolMl: string;
  customDivs: string;
}
const DEFAULT_STATE: State = {
  doseMg: '0.25',
  concMgMl: '2.5',
  useBridge: true,
  syringe: 'u100',
  customVolMl: '1',
  customDivs: '100',
};

function roundHalfUnit(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 2) / 2;
}

export default function ReagentDispense() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);
  const [bridgeConc, setBridgeConc] = useState<number | undefined>(undefined);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.doseMg, state.concMgMl, state.useBridge]);

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

  // Step 2 owns syringe selection. Push it through the bridge so Step 3
  // (Lookup) can auto-fill from the same choice instead of asking again.
  // We push effective W and Q so custom syringes carry their numbers through.
  useEffect(() => {
    if (!hydrated) return;
    writeMetric('reagent_syringe_id', state.syringe);
    writeMetric('reagent_syringe_vol_ml', syringe.volumeMl);
    writeMetric('reagent_syringe_divs', syringe.divisions);
  }, [state.syringe, syringe.volumeMl, syringe.divisions, hydrated]);

  const calc = useMemo(() => {
    const dose = Math.max(0, parseNum(state.doseMg));
    const conc = state.useBridge && bridgeConc !== undefined && bridgeConc > 0
      ? bridgeConc
      : Math.max(0, parseNum(state.concMgMl));
    const err = conc <= 0 ? 'Concentration must be greater than 0 mg/mL' : '';
    const volMl = err ? 0 : dose / conc;
    // Units scale with the selected syringe: units per mL = divisions / volumeMl.
    const unitsPerMl = syringe.volumeMl > 0 ? syringe.divisions / syringe.volumeMl : 100;
    const unitsExact = volMl * unitsPerMl;
    const overCap = volMl > syringe.volumeMl;
    return {
      dose, conc, err,
      volMl: round2(volMl),
      unitsExact: round2(unitsExact),
      unitsDraw: roundHalfUnit(unitsExact),
      unitsPerMl,
      overCap,
      bridgeLive: state.useBridge && bridgeConc !== undefined && bridgeConc > 0,
    };
  }, [state, bridgeConc, syringe]);

  // Plunger fill percent is volume-based so the visual is syringe-agnostic.
  const plungerPct = syringe.volumeMl > 0 ? Math.min(100, (calc.volMl / syringe.volumeMl) * 100) : 0;

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>GDS-1 · Reagent Administration · Syringe Units</div>
        <div style={{ fontSize: 11, color: DIM }}>U-100 insulin-syringe unit draw from mg amount + concentration</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr', marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Target amount (mg)</div>
          <input inputMode="decimal" value={state.doseMg} onChange={(e) => setState({ ...state, doseMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>reagent-A 0.25 / 0.5 / 1.0 / 1.7 / 2.4 · reagent-B 2.5 / 5 / 7.5 / 10 / 12.5 / 15</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Concentration (mg/mL){calc.bridgeLive ? <span style={{ color: CYAN, marginLeft: 6 }}>· LIVE from PRC-1</span> : null}</div>
          <input
            inputMode="decimal"
            value={calc.bridgeLive ? String(bridgeConc ?? '') : state.concMgMl}
            disabled={calc.bridgeLive}
            onChange={(e) => setState({ ...state, concMgMl: e.target.value })}
            style={{ ...inputStyle, opacity: calc.bridgeLive ? 0.6 : 1 }}
          />
          <div style={dimHint}>post-reconstitution value · mg per mL</div>
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
              {verified ? '✓ INPUTS VERIFIED — reveal unit draw' : 'Confirm amount + concentration before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: calc.overCap ? MAGENTA : CYAN, marginBottom: '0.75rem', display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Draw to</div>
                  <div style={{ fontSize: 28, color: calc.overCap ? MAGENTA : CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.unitsDraw.toFixed(1)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>{syringe.unitLabel}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Exact</div>
                  <div style={{ fontSize: 20, color: TEXT, fontWeight: 700, lineHeight: 1.1 }}>{calc.unitsExact.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>{syringe.unitLabel} (pre-round)</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Volume</div>
                  <div style={{ fontSize: 20, color: GOLD, fontWeight: 700, lineHeight: 1.1 }}>{calc.volMl.toFixed(3)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mL</div>
                </div>
              </div>

              {(() => {
                // Scale tick marks to the selected syringe. We aim for ~10 labeled ticks max.
                const divs = syringe.divisions;
                const tickEvery = divs <= 50 ? 5 : 10;
                const labelEvery = divs <= 50 ? 10 : 25;
                const ticks: number[] = [];
                for (let i = 0; i <= divs; i += tickEvery) ticks.push(i);
                if (ticks[ticks.length - 1] !== divs) ticks.push(divs);
                return (
                  <svg width="100%" height={80} viewBox="0 0 400 80" aria-label={`${syringe.label} barrel`} style={{ marginBottom: '0.75rem' }}>
                    <rect x={20} y={20} width={340} height={40} fill="none" stroke={DIM} strokeWidth={1.5} rx={4} />
                    <rect x={20} y={20} width={(plungerPct / 100) * 340} height={40} fill={LIQUID} opacity={0.5} />
                    {ticks.map((u) => (
                      <g key={u}>
                        <line x1={20 + (u / divs) * 340} y1={20} x2={20 + (u / divs) * 340} y2={u % labelEvery === 0 ? 14 : 16} stroke={DIM} strokeWidth={1} />
                        {u % labelEvery === 0 && <text x={20 + (u / divs) * 340} y={10} fontSize={8} fill={DIM} textAnchor="middle" fontFamily="inherit">{u}</text>}
                      </g>
                    ))}
                    <line x1={20 + (plungerPct / 100) * 340} y1={14} x2={20 + (plungerPct / 100) * 340} y2={66} stroke={calc.overCap ? MAGENTA : RED} strokeWidth={2.5} />
                    <circle cx={20 + (plungerPct / 100) * 340} cy={40} r={4} fill={calc.overCap ? MAGENTA : RED} />
                    <text x={20 + (plungerPct / 100) * 340} y={76} fontSize={9} fill={calc.overCap ? MAGENTA : RED} textAnchor="middle" fontFamily="inherit" fontWeight={700}>
                      {calc.unitsDraw.toFixed(1)} {syringe.unitLabel === 'units' ? 'u' : ''}
                    </text>
                    <rect x={360} y={30} width={8} height={20} fill={DIM} />
                    <rect x={368} y={36} width={20} height={8} fill={DIM} />
                  </svg>
                );
              })()}

              {calc.overCap && (
                <div style={{ ...panelStyle, borderColor: MAGENTA }}>
                  <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ CRITICAL NUDGE</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    Volume ({calc.volMl.toFixed(3)} mL) exceeds the selected syringe capacity ({syringe.volumeMl} mL). Verify concentration — increase mg/mL, pick a larger syringe, or split into multiple administrations.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Syringe Units</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Units scale with the syringe you select — U-100 reads 100 units/mL, U-40 reads 40 units/mL, tuberculin 1 mL reads 100 × 0.01 mL marks. Always verify concentration, amount, and syringe type before drawing. Research/compounding contexts only.
      </div>
    </div>
  );
}

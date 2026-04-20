import React, { useEffect, useMemo, useState } from 'react';
import { readDashboard, subscribeDashboard } from '~/lib/kfw-bridge';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, RED, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-glp-units-v1';

interface State { doseMg: string; concMgMl: string; useBridge: boolean; }
const DEFAULT_STATE: State = { doseMg: '0.25', concMgMl: '2.5', useBridge: true };

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

  const calc = useMemo(() => {
    const dose = Math.max(0, parseNum(state.doseMg));
    const conc = state.useBridge && bridgeConc !== undefined && bridgeConc > 0
      ? bridgeConc
      : Math.max(0, parseNum(state.concMgMl));
    const err = conc <= 0 ? 'Concentration must be greater than 0 mg/mL' : '';
    const volMl = err ? 0 : dose / conc;
    const unitsU100 = volMl * 100;
    const overCap = unitsU100 > 100;
    return {
      dose, conc, err,
      volMl: round2(volMl),
      unitsExact: round2(unitsU100),
      unitsDraw: roundHalfUnit(unitsU100),
      overCap,
      bridgeLive: state.useBridge && bridgeConc !== undefined && bridgeConc > 0,
    };
  }, [state, bridgeConc]);

  const plungerPct = Math.min(100, (calc.unitsDraw / 100) * 100);

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
              {verified ? '✓ INPUTS VERIFIED — reveal unit draw' : 'Confirm amount + concentration before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: calc.overCap ? MAGENTA : CYAN, marginBottom: '0.75rem', display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Draw to</div>
                  <div style={{ fontSize: 28, color: calc.overCap ? MAGENTA : CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.unitsDraw.toFixed(1)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>units (U-100)</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Exact</div>
                  <div style={{ fontSize: 20, color: TEXT, fontWeight: 700, lineHeight: 1.1 }}>{calc.unitsExact.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>units (pre-round)</div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Volume</div>
                  <div style={{ fontSize: 20, color: GOLD, fontWeight: 700, lineHeight: 1.1 }}>{calc.volMl.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: DIM }}>mL</div>
                </div>
              </div>

              <svg width="100%" height={80} viewBox="0 0 400 80" aria-label="U-100 syringe barrel" style={{ marginBottom: '0.75rem' }}>
                <rect x={20} y={20} width={340} height={40} fill="none" stroke={DIM} strokeWidth={1.5} rx={4} />
                <rect x={20} y={20} width={(plungerPct / 100) * 340} height={40} fill={LIQUID} opacity={0.5} />
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((u) => (
                  <g key={u}>
                    <line x1={20 + (u / 100) * 340} y1={20} x2={20 + (u / 100) * 340} y2={u % 50 === 0 ? 14 : 16} stroke={DIM} strokeWidth={1} />
                    {u % 25 === 0 && <text x={20 + (u / 100) * 340} y={10} fontSize={8} fill={DIM} textAnchor="middle" fontFamily="inherit">{u}</text>}
                  </g>
                ))}
                <line x1={20 + (plungerPct / 100) * 340} y1={14} x2={20 + (plungerPct / 100) * 340} y2={66} stroke={calc.overCap ? MAGENTA : RED} strokeWidth={2.5} />
                <circle cx={20 + (plungerPct / 100) * 340} cy={40} r={4} fill={calc.overCap ? MAGENTA : RED} />
                <text x={20 + (plungerPct / 100) * 340} y={76} fontSize={9} fill={calc.overCap ? MAGENTA : RED} textAnchor="middle" fontFamily="inherit" fontWeight={700}>
                  {calc.unitsDraw.toFixed(1)}u
                </text>
                <rect x={360} y={30} width={8} height={20} fill={DIM} />
                <rect x={368} y={36} width={20} height={8} fill={DIM} />
              </svg>

              {calc.overCap && (
                <div style={{ ...panelStyle, borderColor: MAGENTA }}>
                  <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ CRITICAL NUDGE</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    Amount exceeds single U-100 syringe capacity ({calc.unitsExact.toFixed(2)} units needed). Verify concentration — increase mg/mL or split into two injections.
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
        Arithmetic only. Not medical advice. U-100 syringes read 100 units per 1 mL. Always verify concentration and amount before drawing. Research/compounding contexts only.
      </div>
    </div>
  );
}

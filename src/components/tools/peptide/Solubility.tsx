import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-solubility-v1';

type PeptideKey = 'BPC-157' | 'TB-500' | 'Semaglutide' | 'Tirzepatide' | 'Ipamorelin' | 'CJC-1295' | 'Retatrutide' | 'Custom';

const LIMITS: Record<Exclude<PeptideKey, 'Custom'>, number> = {
  'BPC-157': 10,
  'TB-500': 15,
  'Semaglutide': 20,
  'Tirzepatide': 20,
  'Ipamorelin': 15,
  'CJC-1295': 10,
  'Retatrutide': 20,
};

interface State {
  peptide: PeptideKey;
  massMg: string;
  bacVolumeMl: string;
  customLimitMgMl: string;
}
const DEFAULT_STATE: State = { peptide: 'Semaglutide', massMg: '5', bacVolumeMl: '2', customLimitMgMl: '20' };

export default function Solubility() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.peptide, state.massMg, state.bacVolumeMl, state.customLimitMgMl]);

  const calc = useMemo(() => {
    const mass = Math.max(0, parseNum(state.massMg));
    const vol = Math.max(0, parseNum(state.bacVolumeMl));
    const limit = state.peptide === 'Custom'
      ? Math.max(0, parseNum(state.customLimitMgMl))
      : LIMITS[state.peptide];

    let err = '';
    if (vol <= 0) err = 'BAC water volume must be greater than 0 mL';
    else if (limit <= 0) err = 'Solubility limit must be greater than 0 mg/mL';
    else if (mass <= 0) err = 'Peptide mass must be greater than 0 mg';

    const conc = err ? 0 : mass / vol;
    const pctOfLimit = err || limit <= 0 ? 0 : (conc / limit) * 100;

    let status: 'Stable' | 'Guarded' | 'Sludge Risk' = 'Stable';
    if (pctOfLimit > 95) status = 'Sludge Risk';
    else if (pctOfLimit > 75) status = 'Guarded';
    const statusColor = status === 'Stable' ? CYAN : status === 'Guarded' ? GOLD : MAGENTA;

    const minVolForFull = limit > 0 ? mass / limit : 0;

    return {
      mass, vol, limit, err,
      conc: round2(conc),
      pctOfLimit: round2(pctOfLimit),
      status, statusColor,
      minVolForFull: round2(minVolForFull),
    };
  }, [state]);

  const fillPct = Math.min(100, (calc.vol / 10) * 100);
  const over = calc.status === 'Sludge Risk';

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>SOL-1 · Solubility Limit</div>
        <div style={{ fontSize: 11, color: DIM }}>concentration vs peptide solubility ceiling · sludge-risk check</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: state.peptide === 'Custom' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Peptide</div>
          <select value={state.peptide} onChange={(e) => setState({ ...state, peptide: e.target.value as PeptideKey })} style={inputStyle}>
            {(Object.keys(LIMITS) as Array<Exclude<PeptideKey, 'Custom'>>).map((k) => (
              <option key={k} value={k}>{k} (~{LIMITS[k]} mg/mL)</option>
            ))}
            <option value="Custom">Custom</option>
          </select>
          <div style={dimHint}>approximate published solubility in BAC water</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Mass (mg)</div>
          <input inputMode="decimal" value={state.massMg} onChange={(e) => setState({ ...state, massMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>lyophilized label dose</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>BAC water (mL)</div>
          <input inputMode="decimal" value={state.bacVolumeMl} onChange={(e) => setState({ ...state, bacVolumeMl: e.target.value })} style={inputStyle} />
          <div style={dimHint}>diluent volume</div>
        </label>
        {state.peptide === 'Custom' && (
          <label style={labelStyle}>
            <div style={{ color: DIM, marginBottom: 4 }}>Custom limit (mg/mL)</div>
            <input inputMode="decimal" value={state.customLimitMgMl} onChange={(e) => setState({ ...state, customLimitMgMl: e.target.value })} style={inputStyle} />
            <div style={dimHint}>publisher-specified ceiling</div>
          </label>
        )}
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
              {verified ? '✓ INPUTS VERIFIED — reveal solubility status' : 'Confirm peptide + mass + BAC volume before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: calc.statusColor, display: 'grid', gap: '1rem', gridTemplateColumns: '60px 1fr', alignItems: 'center' }}>
                <svg width={60} height={140} viewBox="0 0 60 140" aria-label="Test tube">
                  <path d={`M 14 6 L 14 ${120} A 16 16 0 0 0 46 ${120} L 46 6 Z`} fill="none" stroke={DIM} strokeWidth={1.5} />
                  <rect x={11} y={2} width={38} height={6} fill={DIM} rx={1} />
                  <clipPath id="sol-tube-clip">
                    <path d={`M 14 6 L 14 ${120} A 16 16 0 0 0 46 ${120} L 46 6 Z`} />
                  </clipPath>
                  <g clipPath="url(#sol-tube-clip)">
                    <rect x={12} y={6 + (128 - (fillPct / 100) * 128)} width={36} height={(fillPct / 100) * 128} fill={LIQUID} opacity={0.65} />
                    {over && (
                      <g>
                        <circle cx={22} cy={124} r={2.2} fill={MAGENTA} />
                        <circle cx={30} cy={128} r={2.6} fill={MAGENTA} />
                        <circle cx={38} cy={123} r={1.8} fill={MAGENTA} />
                        <circle cx={26} cy={131} r={1.8} fill={MAGENTA} />
                        <circle cx={34} cy={134} r={2.2} fill={MAGENTA} />
                        <circle cx={20} cy={132} r={1.6} fill={MAGENTA} />
                      </g>
                    )}
                  </g>
                </svg>
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Concentration</div>
                      <div style={{ fontSize: 24, color: calc.statusColor, fontWeight: 700, lineHeight: 1.1 }}>{calc.conc.toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: DIM }}>mg / mL</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Limit</div>
                      <div style={{ fontSize: 24, color: TEXT, fontWeight: 700, lineHeight: 1.1 }}>{round2(calc.limit).toFixed(2)}</div>
                      <div style={{ fontSize: 11, color: DIM }}>mg / mL</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11 }}>
                    Usage: <span style={{ color: calc.statusColor, fontWeight: 700 }}>{calc.pctOfLimit.toFixed(1)}%</span> of limit ·
                    Status: <span style={{ color: calc.statusColor, fontWeight: 700 }}>{calc.status}</span>
                  </div>
                </div>
              </div>

              {over && (
                <div style={{ ...panelStyle, borderColor: MAGENTA, marginTop: '0.75rem' }}>
                  <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ SLUDGE RISK</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>
                    Increase BAC water to at least <span style={{ color: MAGENTA, fontWeight: 700 }}>{calc.minVolForFull.toFixed(2)} mL</span> for full dissolution of {round2(calc.mass).toFixed(2)} mg at the {round2(calc.limit).toFixed(2)} mg/mL ceiling.
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Solubility</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Solubility limits vary by batch, pH, and diluent — always observe the vial for clarity before injection. Research/compounding contexts only.
      </div>
    </div>
  );
}

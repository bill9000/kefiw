import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-salt-v1';

type SaltType = 'TFA' | 'Acetate' | 'Free-base' | 'Custom';
const SALT_PRESETS: Record<Exclude<SaltType, 'Custom'>, string> = {
  'TFA': '76',
  'Acetate': '89',
  'Free-base': '100',
};

interface State {
  labelMassMg: string;
  peptideContentPct: string;
  saltType: SaltType;
  bacVolumeMl: string;
  targetDoseMg: string;
}
const DEFAULT_STATE: State = {
  labelMassMg: '5', peptideContentPct: '76', saltType: 'TFA', bacVolumeMl: '2', targetDoseMg: '0.25',
};

export default function SaltCorrection() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.labelMassMg, state.peptideContentPct, state.saltType, state.bacVolumeMl, state.targetDoseMg]);

  const setSalt = (t: SaltType): void => {
    if (t === 'Custom') { setState({ ...state, saltType: t }); return; }
    setState({ ...state, saltType: t, peptideContentPct: SALT_PRESETS[t] });
  };

  const calc = useMemo(() => {
    const labelMass = Math.max(0, parseNum(state.labelMassMg));
    const pct = Math.max(0, parseNum(state.peptideContentPct));
    const vol = Math.max(0, parseNum(state.bacVolumeMl));
    const dose = Math.max(0, parseNum(state.targetDoseMg));
    let err = '';
    if (vol <= 0) err = 'BAC volume must be greater than 0 mL';
    else if (pct <= 0 || pct > 100) err = 'Reagent content must be between 1% and 100%';
    else if (labelMass <= 0) err = 'Labeled mass must be greater than 0 mg';
    else if (dose <= 0) err = 'Target amount must be greater than 0 mg';

    const actualMass = labelMass * (pct / 100);
    const concNaive = vol > 0 ? labelMass / vol : 0;
    const concAdj = vol > 0 ? actualMass / vol : 0;
    const naiveUnits = concNaive > 0 ? (dose / concNaive) * 100 : 0;
    const unitsToDraw = concAdj > 0 ? (dose / concAdj) * 100 : 0;
    const correctionFactor = pct > 0 ? 100 / pct : 0;
    const delta = unitsToDraw - naiveUnits;
    const lostMass = labelMass - actualMass;
    return {
      labelMass, pct, vol, dose, err,
      actualMass: round2(actualMass),
      concAdj: round2(concAdj),
      concNaive: round2(concNaive),
      naiveUnits: round2(naiveUnits),
      unitsToDraw: round2(unitsToDraw),
      correctionFactor: round2(correctionFactor),
      delta: round2(delta),
      lostMass: round2(lostMass),
    };
  }, [state]);

  const barMax = Math.max(calc.labelMass, 0.01);
  const labeledH = 100;
  const actualH = Math.max(2, (calc.actualMass / barMax) * 100);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>SALT-1 · TFA / ACETATE SALT FACTOR</div>
        <div style={{ fontSize: 11, color: DIM }}>Actual reagent content vs labeled mass · corrected draw units</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Labeled mass (mg)</div>
          <input inputMode="decimal" value={state.labelMassMg} onChange={(e) => setState({ ...state, labelMassMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>as printed on vial label</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>BAC water (mL)</div>
          <input inputMode="decimal" value={state.bacVolumeMl} onChange={(e) => setState({ ...state, bacVolumeMl: e.target.value })} style={inputStyle} />
          <div style={dimHint}>reconstitution volume</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Target amount (mg)</div>
          <input inputMode="decimal" value={state.targetDoseMg} onChange={(e) => setState({ ...state, targetDoseMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>per-administration amount</div>
        </label>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr', marginBottom: '1rem', alignItems: 'end' }}>
        <div>
          <div style={{ fontSize: 12, color: DIM, marginBottom: 4 }}>Salt form</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(['TFA', 'Acetate', 'Free-base', 'Custom'] as SaltType[]).map((t) => (
              <button key={t} type="button" onClick={() => setSalt(t)} style={{
                padding: '6px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
                background: state.saltType === t ? 'rgba(34,211,238,0.15)' : '#0b1120',
                border: `1px solid ${state.saltType === t ? CYAN : BORDER}`,
                color: state.saltType === t ? CYAN : TEXT, fontFamily: 'inherit',
              }}>{t}</button>
            ))}
          </div>
        </div>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Reagent content (%)</div>
          <input inputMode="decimal" value={state.peptideContentPct} onChange={(e) => setState({ ...state, peptideContentPct: e.target.value, saltType: 'Custom' })} style={inputStyle} />
          <div style={dimHint}>TFA ≈ 76% · Acetate ≈ 89% · Free-base = 100%</div>
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
              {verified ? '✓ INPUTS VERIFIED — reveal corrected draw' : 'Confirm salt form and target amount before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: CYAN, display: 'grid', gap: '0.75rem', gridTemplateColumns: '140px 1fr' }}>
              <svg width={140} height={140} viewBox="0 0 140 140" aria-label="Labeled vs actual mass">
                <g transform="translate(12, 20)">
                  <rect x={10} y={120 - labeledH} width={40} height={labeledH} fill={GOLD} opacity={0.85} />
                  <rect x={10} y={120 - labeledH} width={40} height={labeledH - actualH}
                    fill="none" stroke={MAGENTA} strokeWidth={1} strokeDasharray="3 2" />
                  <text x={30} y={134} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">Labeled</text>
                  <rect x={70} y={120 - actualH} width={40} height={actualH} fill={CYAN} opacity={0.85} />
                  <text x={90} y={134} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">Actual</text>
                  <text x={30} y={120 - labeledH - 4} fontSize={9} fill={GOLD} textAnchor="middle" fontFamily="inherit" fontWeight={700}>{calc.labelMass.toFixed(1)}</text>
                  <text x={90} y={120 - actualH - 4} fontSize={9} fill={CYAN} textAnchor="middle" fontFamily="inherit" fontWeight={700}>{calc.actualMass.toFixed(1)}</text>
                </g>
              </svg>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Corrected draw</div>
                  <div style={{ fontSize: 28, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{calc.unitsToDraw.toFixed(2)}u</div>
                  <div style={{ fontSize: 11, color: DIM }}>U-100 · factor ×{calc.correctionFactor.toFixed(2)}</div>
                </div>
                <div style={{ fontSize: 11, color: TEXT, lineHeight: 1.5 }}>
                  Labeled <span style={{ color: GOLD }}>{calc.labelMass.toFixed(2)} mg</span> → Actual <span style={{ color: CYAN }}>{calc.actualMass.toFixed(2)} mg</span>
                  <span style={{ color: DIM }}> ({calc.lostMass.toFixed(2)} mg salt)</span>
                  <br />Naive draw: <span style={{ color: DIM }}>{calc.naiveUnits.toFixed(2)}u</span> · delta <span style={{ color: MAGENTA }}>{calc.delta >= 0 ? '+' : ''}{calc.delta.toFixed(2)}u</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Corrected Draw</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Reagent content % varies by vendor and lot — use the CoA figure when available. Research/compounding contexts only.
      </div>
    </div>
  );
}

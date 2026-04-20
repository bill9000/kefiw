import React, { useEffect, useMemo, useState } from 'react';
import { writeMetric, writeFlag } from '~/lib/kfw-bridge';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-degradation-v1';

type TempKey = 'fridge-4c' | 'room-22c' | 'warm-30c' | 'hot-37c';

interface State {
  hoursAtTemp: string;
  temp: TempKey;
  reconstituted: boolean;
}
const DEFAULT_STATE: State = { hoursAtTemp: '24', temp: 'room-22c', reconstituted: true };

const TEMP_META: Record<TempKey, { label: string; degC: number; lossRate: number; color: string; mercuryPct: number }> = {
  'fridge-4c': { label: 'Fridge 4°C', degC: 4, lossRate: 0.0002, color: CYAN, mercuryPct: 20 },
  'room-22c':  { label: 'Room 22°C', degC: 22, lossRate: 0.002,  color: GOLD, mercuryPct: 48 },
  'warm-30c':  { label: 'Warm 30°C', degC: 30, lossRate: 0.008,  color: '#fb923c', mercuryPct: 66 },
  'hot-37c':   { label: 'Hot 37°C',  degC: 37, lossRate: 0.025,  color: MAGENTA, mercuryPct: 82 },
};

const FRIDGE_RATE = TEMP_META['fridge-4c'].lossRate;

export default function VectorDecay() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.hoursAtTemp, state.temp, state.reconstituted]);

  const calc = useMemo(() => {
    const hours = Math.max(0, parseNum(state.hoursAtTemp));
    const meta = TEMP_META[state.temp];
    const baseRate = meta.lossRate;
    const effectiveRate = state.reconstituted ? baseRate : baseRate / 10;
    const err = hours <= 0 ? 'Hours at temperature must be greater than 0' : '';
    const potencyPct = err ? 0 : 100 * Math.exp(-effectiveRate * hours);
    const fridgeEquivHours = err ? 0 : hours * (effectiveRate / FRIDGE_RATE);
    const fridgeEquivDays = fridgeEquivHours / 24;
    let status: 'Stable' | 'Guarded' | 'Critical' = 'Stable';
    if (potencyPct < 85) status = 'Critical';
    else if (potencyPct < 95) status = 'Guarded';
    const statusColor = status === 'Stable' ? CYAN : status === 'Guarded' ? GOLD : MAGENTA;
    return { hours, meta, effectiveRate, err, potencyPct: round2(potencyPct), fridgeEquivDays: round2(fridgeEquivDays), status, statusColor };
  }, [state]);

  const curvePath = useMemo(() => {
    const W = 160, H = 160, PAD = 12;
    const tMax = Math.max(calc.hours, 24);
    const rate = calc.effectiveRate;
    const pts: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tMax;
      const p = 100 * Math.exp(-rate * t);
      const x = PAD + (i / steps) * (W - PAD * 2);
      const y = PAD + (1 - p / 100) * (H - PAD * 2);
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, [calc]);

  useEffect(() => {
    if (!hydrated || !verified || calc.err) return;
    writeMetric('reagent_potency_pct', calc.potencyPct);
    writeFlag('reagent_decay_critical', calc.status === 'Critical');
  }, [calc, verified, hydrated]);

  const markerX = useMemo(() => {
    const W = 160, PAD = 12;
    const tMax = Math.max(calc.hours, 24);
    return PAD + (calc.hours / tMax) * (W - PAD * 2);
  }, [calc]);
  const markerY = useMemo(() => {
    const H = 160, PAD = 12;
    return PAD + (1 - calc.potencyPct / 100) * (H - PAD * 2);
  }, [calc]);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>DEG-1 · Temperature Decay / Shelf-Life</div>
        <div style={{ fontSize: 11, color: DIM }}>Arrhenius-simplified potency retention vs storage temperature</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr', marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Hours at temperature</div>
          <input inputMode="decimal" value={state.hoursAtTemp} onChange={(e) => setState({ ...state, hoursAtTemp: e.target.value })} style={inputStyle} />
          <div style={dimHint}>elapsed duration · cumulative exposure</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Form</div>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 11, padding: '0.5rem 0.75rem', background: '#0b1120', border: `1px solid ${BORDER}`, borderRadius: 6 }}>
            <input type="checkbox" checked={state.reconstituted} onChange={(e) => setState({ ...state, reconstituted: e.target.checked })} />
            <span>{state.reconstituted ? 'Reconstituted (liquid)' : 'Lyophilized (powder, 10× slower)'}</span>
          </label>
          <div style={dimHint}>lyophilized decays ~10× slower than reconstituted</div>
        </label>
      </div>

      <div style={{ display: 'grid', gap: 6, gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1rem' }}>
        {(Object.keys(TEMP_META) as TempKey[]).map((k) => {
          const m = TEMP_META[k];
          const active = state.temp === k;
          return (
            <label key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '0.5rem', background: active ? 'rgba(34,211,238,0.1)' : '#0b1120', border: `1px solid ${active ? CYAN : BORDER}`, borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>
              <input type="radio" name="deg-temp" checked={active} onChange={() => setState({ ...state, temp: k })} style={{ display: 'none' }} />
              <span style={{ color: m.color, fontWeight: 700 }}>{m.degC}°C</span>
              <span style={{ color: DIM, fontSize: 10 }}>{m.label.split(' ')[0]}</span>
            </label>
          );
        })}
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
              {verified ? '✓ INPUTS VERIFIED — reveal decay model' : 'Confirm hours and temperature before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: calc.statusColor, display: 'grid', gap: '1rem', gridTemplateColumns: '40px 160px 1fr', alignItems: 'center' }}>
              <svg width={40} height={160} viewBox="0 0 40 160" aria-label="Thermometer">
                <rect x={14} y={8} width={12} height={120} fill="none" stroke={DIM} strokeWidth={1.2} rx={6} />
                <circle cx={20} cy={138} r={10} fill="none" stroke={DIM} strokeWidth={1.2} />
                <rect x={16} y={8 + (120 - (calc.meta.mercuryPct / 100) * 120)} width={8} height={(calc.meta.mercuryPct / 100) * 120} fill={calc.meta.color} opacity={0.85} rx={3} />
                <circle cx={20} cy={138} r={7} fill={calc.meta.color} />
                <text x={20} y={156} fontSize={8} fill={calc.meta.color} textAnchor="middle" fontFamily="inherit" fontWeight={700}>{calc.meta.degC}°</text>
              </svg>
              <svg width={160} height={160} viewBox="0 0 160 160" aria-label="Potency decay curve">
                <rect x={0.5} y={0.5} width={159} height={159} fill="none" stroke={BORDER} strokeWidth={1} rx={4} />
                <line x1={12} y1={12 + (136 * 0.05)} x2={148} y2={12 + (136 * 0.05)} stroke={CYAN} strokeDasharray="2 2" strokeWidth={0.5} opacity={0.6} />
                <line x1={12} y1={12 + (136 * 0.15)} x2={148} y2={12 + (136 * 0.15)} stroke={GOLD} strokeDasharray="2 2" strokeWidth={0.5} opacity={0.6} />
                <path d={curvePath} fill="none" stroke={calc.statusColor} strokeWidth={2} />
                <circle cx={markerX} cy={markerY} r={4} fill={calc.statusColor} />
                <text x={8} y={18} fontSize={8} fill={DIM} fontFamily="inherit">100%</text>
                <text x={8} y={152} fontSize={8} fill={DIM} fontFamily="inherit">0%</text>
                <text x={148} y={152} fontSize={8} fill={DIM} textAnchor="end" fontFamily="inherit">t</text>
              </svg>
              <div>
                <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Retained potency</div>
                <div style={{ fontSize: 28, color: calc.statusColor, fontWeight: 700, lineHeight: 1.1 }}>{calc.potencyPct.toFixed(2)}%</div>
                <div style={{ fontSize: 11, color: DIM, marginTop: 6 }}>Equivalent fridge-days: <span style={{ color: TEXT }}>{calc.fridgeEquivDays.toFixed(2)}</span></div>
                <div style={{ fontSize: 11, color: DIM }}>Status: <span style={{ color: calc.statusColor, fontWeight: 700 }}>{calc.status}</span></div>
              </div>
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Decay</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Decay rates are simplified approximations; consult manufacturer stability data before using. Research/compounding contexts only.
      </div>
    </div>
  );
}

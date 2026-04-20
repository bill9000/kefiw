import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const STORAGE = 'impairment-coeff-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const RED = '#ef4444';

type Gender = 'male' | 'female';
type Units = 'metric' | 'imperial';

interface State { gender: Gender; units: Units; weight: string; drinks: string; gramsPerDrink: string; hoursElapsed: string; }
const DEFAULT_STATE: State = { gender: 'male', units: 'imperial', weight: '180', drinks: '3', gramsPerDrink: '14', hoursElapsed: '1.5' };

const R_CONST: Record<Gender, number> = { male: 0.68, female: 0.55 };
const BETA = 0.015;

function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

export default function ImpairmentBac() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const weightLbs = Math.max(0, parseNum(state.weight));
    const weightKg = state.units === 'imperial' ? weightLbs * 0.453592 : weightLbs;
    const weightG = weightKg * 1000;
    const drinks = Math.max(0, parseNum(state.drinks));
    const gramsPerDrink = Math.max(0, parseNum(state.gramsPerDrink));
    const alcoholG = drinks * gramsPerDrink;
    const hours = Math.max(0, parseNum(state.hoursElapsed));
    const r = R_CONST[state.gender];
    const rawBac = weightG > 0 ? (alcoholG / (weightG * r)) * 100 : 0;
    const bac = Math.max(0, rawBac - BETA * hours);
    const hoursToZero = bac / BETA;
    return { bac, hoursToZero, alcoholG };
  }, [state]);

  const gaugeColor = calc.bac >= 0.08 ? RED : calc.bac >= 0.04 ? GOLD : CYAN;
  const gaugePct = Math.min(100, (calc.bac / 0.20) * 100);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <AlertTriangle size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Impairment Coefficient · Widmark</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Gender</div>
          <select value={state.gender} onChange={(e) => setState({ ...state, gender: e.target.value as Gender })} style={input}>
            <option value="male">Male · r=0.68</option><option value="female">Female · r=0.55</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="imperial">Imperial · lb</option><option value="metric">Metric · kg</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Weight ({state.units === 'imperial' ? 'lb' : 'kg'})</div>
          <input inputMode="decimal" value={state.weight} onChange={(e) => setState({ ...state, weight: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Drinks consumed</div>
          <input inputMode="decimal" value={state.drinks} onChange={(e) => setState({ ...state, drinks: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Grams alcohol / drink</div>
          <input inputMode="decimal" value={state.gramsPerDrink} onChange={(e) => setState({ ...state, gramsPerDrink: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Hours since first drink</div>
          <input inputMode="decimal" value={state.hoursElapsed} onChange={(e) => setState({ ...state, hoursElapsed: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: gaugeColor }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>System Shutdown Gauge</div>
        <div style={{ height: 24, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}`, position: 'relative' }}>
          <div style={{ width: `${gaugePct}%`, height: '100%', background: `linear-gradient(90deg, ${CYAN}, ${GOLD}, ${RED})` }} />
          <div style={{ position: 'absolute', left: `${(0.08 / 0.20) * 100}%`, top: 0, bottom: 0, width: 2, background: RED }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 4 }}>
          <span>0.00</span><span>0.04 caution</span><span style={{ color: RED }}>0.08 legal limit</span><span>0.20</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <div style={{ ...panel, borderColor: gaugeColor }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Estimated BAC</div>
          <div style={{ fontSize: 28, color: gaugeColor, fontWeight: 700 }}>{calc.bac.toFixed(3)}</div>
          <div style={{ fontSize: 10, color: DIM }}>%BAC</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Clear to operate in</div>
          <div style={{ fontSize: 20, color: CYAN, fontWeight: 700 }}>{calc.hoursToZero.toFixed(1)}h</div>
          <div style={{ fontSize: 10, color: DIM }}>to 0.00% BAC</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Alcohol consumed</div>
          <div style={{ fontSize: 20, color: TEXT, fontWeight: 700 }}>{calc.alcoholG.toFixed(0)} g</div>
          <div style={{ fontSize: 10, color: DIM }}>Σ ethanol</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Widmark: BAC = (A / (W·r)) × 100 − β·t · β = 0.015/hr. HARD-CODED ESTIMATE ONLY — not evidence in any legal proceeding.
      </div>
    </div>
  );
}

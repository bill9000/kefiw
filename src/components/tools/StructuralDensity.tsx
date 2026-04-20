import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'structural-density-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GREEN = '#4ade80'; const GOLD = '#facc15'; const MAGENTA = '#f472b6';

type Gender = 'male' | 'female';
type Units = 'in' | 'cm';

interface State { gender: Gender; units: Units; height: string; neck: string; waist: string; hip: string; }
const DEFAULT_STATE: State = { gender: 'male', units: 'in', height: '70', neck: '15', waist: '34', hip: '40' };

function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function classify(bf: number, gender: Gender): { label: string; color: string } {
  if (gender === 'male') {
    if (bf < 6) return { label: 'Essential', color: CYAN };
    if (bf < 14) return { label: 'Athlete', color: GREEN };
    if (bf < 18) return { label: 'Fit', color: GREEN };
    if (bf < 25) return { label: 'Acceptable', color: GOLD };
    return { label: 'Obese', color: MAGENTA };
  }
  if (bf < 14) return { label: 'Essential', color: CYAN };
  if (bf < 21) return { label: 'Athlete', color: GREEN };
  if (bf < 25) return { label: 'Fit', color: GREEN };
  if (bf < 32) return { label: 'Acceptable', color: GOLD };
  return { label: 'Obese', color: MAGENTA };
}

export default function StructuralDensity() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const bf = useMemo(() => {
    const h = parseNum(state.height);
    const neck = parseNum(state.neck);
    const waist = parseNum(state.waist);
    const hip = parseNum(state.hip);
    const toIn = state.units === 'cm' ? (x: number) => x / 2.54 : (x: number) => x;
    const heightIn = toIn(h), neckIn = toIn(neck), waistIn = toIn(waist), hipIn = toIn(hip);
    if (heightIn <= 0) return 0;
    if (state.gender === 'male') {
      const d = waistIn - neckIn;
      if (d <= 0) return 0;
      return 495 / (1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(heightIn)) - 450;
    }
    const d = waistIn + hipIn - neckIn;
    if (d <= 0) return 0;
    return 495 / (1.29579 - 0.35004 * Math.log10(d) + 0.22100 * Math.log10(heightIn)) - 450;
  }, [state]);

  const cls = classify(bf, state.gender);
  const barPct = Math.min(100, Math.max(0, (bf / 50) * 100));

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Structural Density · US Navy Circumference</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Gender</div>
          <select value={state.gender} onChange={(e) => setState({ ...state, gender: e.target.value as Gender })} style={input}>
            <option value="male">Male</option><option value="female">Female</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="in">Inches</option><option value="cm">cm</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Height</div>
          <input inputMode="decimal" value={state.height} onChange={(e) => setState({ ...state, height: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Neck</div>
          <input inputMode="decimal" value={state.neck} onChange={(e) => setState({ ...state, neck: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Waist</div>
          <input inputMode="decimal" value={state.waist} onChange={(e) => setState({ ...state, waist: e.target.value })} style={input} /></label>
        {state.gender === 'female' && (
          <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Hip</div>
            <input inputMode="decimal" value={state.hip} onChange={(e) => setState({ ...state, hip: e.target.value })} style={input} /></label>
        )}
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Load-to-Chassis Ratio</div>
        <div style={{ height: 18, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          <div style={{ width: `${barPct}%`, height: '100%', background: `linear-gradient(90deg, ${CYAN}, ${GREEN}, ${GOLD}, ${MAGENTA})` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 4 }}>
          <span>0%</span><span>10%</span><span>20%</span><span>30%</span><span>40%</span><span>50%</span>
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: cls.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Structural Density</div>
        <div style={{ fontSize: 28, color: cls.color, fontWeight: 700 }}>{bf.toFixed(1)}% Fat</div>
        <div style={{ fontSize: 12, color: TEXT, marginTop: 4 }}>Classification: <span style={{ color: cls.color, fontWeight: 600 }}>{cls.label}</span></div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Formula: US Navy circumference method · accuracy ±3-4% vs DEXA. Measure at natural waist (narrowest point) and neck (just below larynx). Women add hip (widest point).
      </div>
    </div>
  );
}

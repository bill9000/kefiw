import React, { useEffect, useMemo, useState } from 'react';
import { Zap } from 'lucide-react';

const STORAGE = 'strength-efficiency-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80';

type Gender = 'male' | 'female';
type Units = 'lb' | 'kg';

interface State { gender: Gender; units: Units; bodyweight: string; lifted: string; }
const DEFAULT_STATE: State = { gender: 'male', units: 'lb', bodyweight: '180', lifted: '315' };

function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// Wilks 2020 coefficients
const WILKS_M = { a: -0.0000001291, b: 0.00001093, c: -0.0003916, d: 0.0009054, e: -47.46178, f: 600.27 };
const WILKS_F = { a: -0.0000002888, b: 0.00002619, c: -0.0007818, d: -0.0002882, e: -13.73179, f: 594.31 };

function wilksCoeff(bwKg: number, gender: Gender): number {
  const c = gender === 'male' ? WILKS_M : WILKS_F;
  const x = bwKg;
  const denom = c.a * Math.pow(x, 5) + c.b * Math.pow(x, 4) + c.c * Math.pow(x, 3) + c.d * Math.pow(x, 2) + c.e * x + c.f;
  return denom !== 0 ? 500 / denom : 0;
}

function rank(wilks: number): { label: string; color: string } {
  if (wilks >= 400) return { label: 'Elite', color: GOLD };
  if (wilks >= 300) return { label: 'Advanced', color: CYAN };
  if (wilks >= 200) return { label: 'Intermediate', color: GREEN };
  return { label: 'System Standard', color: DIM };
}

export default function StrengthEfficiency() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const bwRaw = Math.max(0, parseNum(state.bodyweight));
    const liftedRaw = Math.max(0, parseNum(state.lifted));
    const bwKg = state.units === 'lb' ? bwRaw * 0.453592 : bwRaw;
    const liftedKg = state.units === 'lb' ? liftedRaw * 0.453592 : liftedRaw;
    const coeff = wilksCoeff(bwKg, state.gender);
    const wilks = liftedKg * coeff;
    const ratio = bwRaw > 0 ? liftedRaw / bwRaw : 0;
    return { wilks, ratio, bwKg, liftedKg };
  }, [state]);

  const r = rank(calc.wilks);
  const barPct = Math.min(100, (calc.wilks / 500) * 100);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Zap size={18} color={GOLD} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Strength-to-Weight Efficiency · Wilks 2020</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Gender</div>
          <select value={state.gender} onChange={(e) => setState({ ...state, gender: e.target.value as Gender })} style={input}>
            <option value="male">Male</option><option value="female">Female</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="lb">lb</option><option value="kg">kg</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Bodyweight</div>
          <input inputMode="decimal" value={state.bodyweight} onChange={(e) => setState({ ...state, bodyweight: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Total lifted</div>
          <input inputMode="decimal" value={state.lifted} onChange={(e) => setState({ ...state, lifted: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Power Density</div>
        <div style={{ height: 20, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}`, position: 'relative' }}>
          <div style={{ width: `${barPct}%`, height: '100%', background: `linear-gradient(90deg, ${DIM}, ${GREEN}, ${CYAN}, ${GOLD})` }} />
          <div style={{ position: 'absolute', left: `${(200 / 500) * 100}%`, top: 0, bottom: 0, width: 1, background: GREEN }} />
          <div style={{ position: 'absolute', left: `${(300 / 500) * 100}%`, top: 0, bottom: 0, width: 1, background: CYAN }} />
          <div style={{ position: 'absolute', left: `${(400 / 500) * 100}%`, top: 0, bottom: 0, width: 1, background: GOLD }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 4 }}>
          <span>0</span><span>200 Intermediate</span><span>300 Advanced</span><span>400 Elite</span><span>500</span>
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: r.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Wilks Coefficient</div>
        <div style={{ fontSize: 36, color: r.color, fontWeight: 700 }}>{calc.wilks.toFixed(1)}</div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Rank: <span style={{ color: r.color, fontWeight: 700 }}>{r.label}</span></div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Lift:Bodyweight</div>
          <div style={{ fontSize: 18, color: CYAN, fontWeight: 600 }}>{calc.ratio.toFixed(2)}×</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Lifted (kg)</div>
          <div style={{ fontSize: 18, color: TEXT, fontWeight: 600 }}>{calc.liftedKg.toFixed(1)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Bodyweight (kg)</div>
          <div style={{ fontSize: 18, color: TEXT, fontWeight: 600 }}>{calc.bwKg.toFixed(1)}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Wilks 2020 polynomial: coefficient × total_kg. Normalizes load against bodyweight for cross-chassis comparison. Input total (powerlifting) or single-lift 1RM — interpretation is relative.
      </div>
    </div>
  );
}

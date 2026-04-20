import React, { useEffect, useMemo, useState } from 'react';
import { Zap } from 'lucide-react';

const STORAGE = 'metabolic-floor-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GREEN = '#4ade80';
const COLOR_GOLD = '#facc15';

type Gender = 'male' | 'female';
type Activity = 'sedentary' | 'light' | 'moderate' | 'active' | 'very';
type Units = 'metric' | 'imperial';

interface State {
  units: Units;
  gender: Gender;
  weight: string;
  height: string;
  age: string;
  activity: Activity;
}

const DEFAULT_STATE: State = {
  units: 'metric',
  gender: 'male',
  weight: '75',
  height: '175',
  age: '30',
  activity: 'moderate',
};

const ACTIVITY_MULT: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very: 1.9,
};

const ACTIVITY_LABEL: Record<Activity, string> = {
  sedentary: 'Sedentary — desk, no exercise',
  light: 'Light — 1–3 days/wk',
  moderate: 'Moderate — 3–5 days/wk',
  active: 'Active — 6–7 days/wk',
  very: 'Very active — physical job',
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function MetabolicFloor() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const weightRaw = Math.max(0, parseNum(state.weight));
    const heightRaw = Math.max(0, parseNum(state.height));
    const age = Math.max(0, Math.min(120, parseNum(state.age)));
    const weightKg = state.units === 'metric' ? weightRaw : weightRaw * 0.453592;
    const heightCm = state.units === 'metric' ? heightRaw : heightRaw * 2.54;
    const bmr = state.gender === 'male'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    const tdee = bmr * ACTIVITY_MULT[state.activity];
    const active = tdee - bmr;
    const cutZone = tdee - 500; // 1 lb/wk deficit anchor
    const bulkZone = tdee + 300;
    return {
      bmr: Math.max(0, bmr),
      tdee: Math.max(0, tdee),
      active: Math.max(0, active),
      cutZone: Math.max(0, cutZone),
      bulkZone: Math.max(0, bulkZone),
      weightKg,
      heightCm,
    };
  }, [state]);

  const maxMeter = Math.max(3000, calc.tdee * 1.05);
  const bmrPct = (calc.bmr / maxMeter) * 100;
  const tdeePct = (calc.tdee / maxMeter) * 100;

  const shell: React.CSSProperties = {
    background: COLOR_BG,
    color: COLOR_TEXT,
    padding: '1.5rem',
    borderRadius: 12,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    border: `1px solid ${COLOR_BORDER}`,
  };

  const panel: React.CSSProperties = {
    background: COLOR_PANEL,
    border: `1px solid ${COLOR_BORDER}`,
    padding: '1rem',
    borderRadius: 8,
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: 6,
    border: `1px solid ${COLOR_BORDER}`,
    background: '#0b1120',
    color: COLOR_TEXT,
    fontFamily: 'inherit',
  };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <Zap size={18} color={COLOR_CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM }}>
          Metabolic Floor · Mifflin-St Jeor
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={inputStyle}>
            <option value="metric">Metric (kg · cm)</option>
            <option value="imperial">Imperial (lb · in)</option>
          </select>
        </label>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Gender</div>
          <select value={state.gender} onChange={(e) => setState({ ...state, gender: e.target.value as Gender })} style={inputStyle}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Weight ({state.units === 'metric' ? 'kg' : 'lb'})</div>
          <input inputMode="decimal" value={state.weight} onChange={(e) => setState({ ...state, weight: e.target.value })} style={inputStyle} />
        </label>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Height ({state.units === 'metric' ? 'cm' : 'in'})</div>
          <input inputMode="decimal" value={state.height} onChange={(e) => setState({ ...state, height: e.target.value })} style={inputStyle} />
        </label>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Age</div>
          <input inputMode="numeric" value={state.age} onChange={(e) => setState({ ...state, age: e.target.value })} style={inputStyle} />
        </label>
        <label style={{ fontSize: 12, gridColumn: 'span 2' }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Activity Level</div>
          <select value={state.activity} onChange={(e) => setState({ ...state, activity: e.target.value as Activity })} style={inputStyle}>
            {(Object.keys(ACTIVITY_LABEL) as Activity[]).map((a) => (
              <option key={a} value={a}>{ACTIVITY_LABEL[a]}</option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM, marginBottom: 12 }}>Power Consumption</div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLOR_DIM, marginBottom: 4 }}>
            <span>Standby Power · BMR</span>
            <span style={{ color: COLOR_CYAN, fontWeight: 600 }}>{Math.round(calc.bmr).toLocaleString()} kcal/day</span>
          </div>
          <div style={{ height: 14, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${COLOR_BORDER}` }}>
            <div style={{ width: `${Math.min(100, bmrPct)}%`, height: '100%', background: `linear-gradient(90deg, ${COLOR_CYAN}, ${COLOR_CYAN}cc)` }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: COLOR_DIM, marginBottom: 4 }}>
            <span>Active Load · TDEE</span>
            <span style={{ color: COLOR_MAGENTA, fontWeight: 600 }}>{Math.round(calc.tdee).toLocaleString()} kcal/day</span>
          </div>
          <div style={{ height: 14, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${COLOR_BORDER}` }}>
            <div style={{ width: `${Math.min(100, tdeePct)}%`, height: '100%', background: `linear-gradient(90deg, ${COLOR_CYAN}, ${COLOR_MAGENTA})` }} />
          </div>
          <div style={{ fontSize: 10, color: COLOR_DIM, marginTop: 4 }}>
            Active component: {Math.round(calc.active).toLocaleString()} kcal/day ({Math.round((calc.active / calc.tdee) * 100) || 0}% of TDEE)
          </div>
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: COLOR_CYAN }}>
        <div style={{ fontSize: 11, color: COLOR_DIM, marginBottom: 4 }}>Maintenance requirement</div>
        <div style={{ fontSize: 24, color: COLOR_CYAN, fontWeight: 700, letterSpacing: '0.05em' }}>
          {Math.round(calc.tdee).toLocaleString()} kcal/day
        </div>
        <div style={{ fontSize: 11, color: COLOR_TEXT, marginTop: 2 }}>
          Your system requires {Math.round(calc.tdee).toLocaleString()} kcal/day to maintain current mass.
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={{ ...panel, padding: '0.75rem' }}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Cut zone · −500</div>
          <div style={{ fontSize: 16, color: COLOR_GOLD, fontWeight: 600 }}>{Math.round(calc.cutZone).toLocaleString()} kcal</div>
          <div style={{ fontSize: 10, color: COLOR_DIM }}>≈ 1 lb/wk deficit</div>
        </div>
        <div style={{ ...panel, padding: '0.75rem' }}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Maintain</div>
          <div style={{ fontSize: 16, color: COLOR_GREEN, fontWeight: 600 }}>{Math.round(calc.tdee).toLocaleString()} kcal</div>
          <div style={{ fontSize: 10, color: COLOR_DIM }}>current mass</div>
        </div>
        <div style={{ ...panel, padding: '0.75rem' }}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Bulk zone · +300</div>
          <div style={{ fontSize: 16, color: COLOR_MAGENTA, fontWeight: 600 }}>{Math.round(calc.bulkZone).toLocaleString()} kcal</div>
          <div style={{ fontSize: 10, color: COLOR_DIM }}>lean gain target</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: 10, color: COLOR_DIM, borderTop: `1px dashed ${COLOR_BORDER}`, paddingTop: 10 }}>
        Formula: Mifflin-St Jeor (1990). BMR = 10·kg + 6.25·cm − 5·age {state.gender === 'male' ? '+ 5' : '− 161'} · TDEE = BMR × activity multiplier.
      </div>
    </div>
  );
}

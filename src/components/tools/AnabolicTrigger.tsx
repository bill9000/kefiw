import React, { useEffect, useMemo, useState } from 'react';
import { Zap } from 'lucide-react';

const STORAGE = 'anabolic-trigger-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6';

type Units = 'lb' | 'kg';
type Training = 'sedentary' | 'recreational' | 'serious';

interface State { units: Units; weight: string; meals: string; training: Training; }
const DEFAULT_STATE: State = { units: 'lb', weight: '180', meals: '4', training: 'serious' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// g/kg per meal to max MPS
const TRAINING: Record<Training, { perMeal: number; daily: number; label: string }> = {
  sedentary: { perMeal: 0.25, daily: 1.0, label: 'Sedentary · baseline' },
  recreational: { perMeal: 0.30, daily: 1.6, label: 'Recreational · regular lifting' },
  serious: { perMeal: 0.40, daily: 2.0, label: 'Serious · chronic resistance' },
};

export default function AnabolicTrigger() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const w = Math.max(0, parseNum(state.weight));
    const weightKg = state.units === 'lb' ? w * 0.453592 : w;
    const meals = Math.max(1, Math.min(8, parseNum(state.meals)));
    const t = TRAINING[state.training];
    const perMealG = weightKg * t.perMeal;
    const dailyG = weightKg * t.daily;
    const viaMeals = perMealG * meals;
    const delta = viaMeals - dailyG;
    return { perMealG, dailyG, meals, viaMeals, delta, weightKg };
  }, [state]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  const deltaColor = calc.delta >= 0 ? GREEN : MAGENTA;

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Zap size={18} color={GOLD} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Anabolic Trigger · MPS Bolus</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="lb">lb</option><option value="kg">kg</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Weight</div>
          <input inputMode="decimal" value={state.weight} onChange={(e) => setState({ ...state, weight: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Meals / day</div>
          <input inputMode="numeric" value={state.meals} onChange={(e) => setState({ ...state, meals: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Training state</div>
          <select value={state.training} onChange={(e) => setState({ ...state, training: e.target.value as Training })} style={input}>
            {Object.entries(TRAINING).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: GOLD }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Per-Meal Protein Bolus</div>
        <div style={{ fontSize: 36, color: GOLD, fontWeight: 700 }}>{calc.perMealG.toFixed(0)} g</div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>Muscle protein synthesis saturates at this dose per feeding window</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '1rem' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Daily target (min)</div>
          <div style={{ fontSize: 22, color: CYAN, fontWeight: 700 }}>{calc.dailyG.toFixed(0)} g</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total via {calc.meals} meals</div>
          <div style={{ fontSize: 22, color: TEXT, fontWeight: 700 }}>{calc.viaMeals.toFixed(0)} g</div>
        </div>
        <div style={{ ...panel, borderColor: deltaColor }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Surplus / deficit</div>
          <div style={{ fontSize: 22, color: deltaColor, fontWeight: 700 }}>{calc.delta >= 0 ? '+' : ''}{calc.delta.toFixed(0)} g</div>
          <div style={{ fontSize: 10, color: DIM }}>{calc.delta >= 0 ? 'Above floor' : 'Add a meal or increase dose'}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Per-bolus target: 0.25–0.40 g/kg leucine-rich protein. Daily floor 1.0–2.0 g/kg by training stimulus. Doses above 0.40 g/kg per meal do not further activate MPS (Morton 2018).
      </div>
    </div>
  );
}

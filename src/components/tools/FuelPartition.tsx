import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'fuel-partition-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const MAGENTA = '#f472b6';

type Units = 'lb' | 'kg';
type Goal = 'cut' | 'maintain' | 'bulk';

interface State { units: Units; weight: string; goal: Goal; kcalOverride: string; }
const DEFAULT_STATE: State = { units: 'lb', weight: '180', goal: 'maintain', kcalOverride: '' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// Target: protein fixed per kg, fat fixed per kg, carbs fill the remainder
const GOALS: Record<Goal, { kcal: number; proteinPerKg: number; fatPerKg: number; label: string }> = {
  cut: { kcal: 13, proteinPerKg: 2.2, fatPerKg: 0.8, label: 'Cut · deficit' },
  maintain: { kcal: 15, proteinPerKg: 1.8, fatPerKg: 1.0, label: 'Maintain' },
  bulk: { kcal: 17, proteinPerKg: 2.0, fatPerKg: 1.2, label: 'Bulk · surplus' },
};

export default function FuelPartition() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const w = Math.max(0, parseNum(state.weight));
    const weightKg = state.units === 'lb' ? w * 0.453592 : w;
    const weightLb = state.units === 'lb' ? w : w * 2.20462;
    const goal = GOALS[state.goal];
    const defaultKcal = weightLb * goal.kcal;
    const override = parseNum(state.kcalOverride);
    const kcal = override > 0 ? override : defaultKcal;
    const proteinG = weightKg * goal.proteinPerKg;
    const fatG = weightKg * goal.fatPerKg;
    const proteinKcal = proteinG * 4;
    const fatKcal = fatG * 9;
    const carbKcal = Math.max(0, kcal - proteinKcal - fatKcal);
    const carbG = carbKcal / 4;
    const total = proteinKcal + fatKcal + carbKcal;
    return { kcal, proteinG, fatG, carbG, proteinKcal, fatKcal, carbKcal, total, weightKg };
  }, [state]);

  const pctP = calc.total > 0 ? (calc.proteinKcal / calc.total) * 100 : 0;
  const pctF = calc.total > 0 ? (calc.fatKcal / calc.total) * 100 : 0;
  const pctC = calc.total > 0 ? (calc.carbKcal / calc.total) * 100 : 0;

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Fuel Partitioning · Macronutrient Split</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="lb">lb</option><option value="kg">kg</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Weight</div>
          <input inputMode="decimal" value={state.weight} onChange={(e) => setState({ ...state, weight: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Goal</div>
          <select value={state.goal} onChange={(e) => setState({ ...state, goal: e.target.value as Goal })} style={input}>
            {Object.entries(GOALS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Custom kcal (optional)</div>
          <input inputMode="decimal" placeholder="auto" value={state.kcalOverride} onChange={(e) => setState({ ...state, kcalOverride: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: GOLD }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Daily Intake Target</div>
        <div style={{ fontSize: 32, color: GOLD, fontWeight: 700 }}>{calc.kcal.toFixed(0)} kcal</div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Fuel Split</div>
        <div style={{ display: 'flex', height: 24, borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          <div style={{ width: `${pctP}%`, background: MAGENTA }} title="Protein" />
          <div style={{ width: `${pctF}%`, background: GOLD }} title="Fat" />
          <div style={{ width: `${pctC}%`, background: CYAN }} title="Carbs" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginTop: 6 }}>
          <span style={{ color: MAGENTA }}>■ Protein {pctP.toFixed(0)}%</span>
          <span style={{ color: GOLD }}>■ Fat {pctF.toFixed(0)}%</span>
          <span style={{ color: CYAN }}>■ Carbs {pctC.toFixed(0)}%</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={{ ...panel, borderColor: MAGENTA }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Protein</div>
          <div style={{ fontSize: 22, color: MAGENTA, fontWeight: 700 }}>{calc.proteinG.toFixed(0)} g</div>
          <div style={{ fontSize: 10, color: DIM }}>{calc.proteinKcal.toFixed(0)} kcal</div>
        </div>
        <div style={{ ...panel, borderColor: GOLD }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Fat</div>
          <div style={{ fontSize: 22, color: GOLD, fontWeight: 700 }}>{calc.fatG.toFixed(0)} g</div>
          <div style={{ fontSize: 10, color: DIM }}>{calc.fatKcal.toFixed(0)} kcal</div>
        </div>
        <div style={{ ...panel, borderColor: CYAN }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Carbs</div>
          <div style={{ fontSize: 22, color: CYAN, fontWeight: 700 }}>{calc.carbG.toFixed(0)} g</div>
          <div style={{ fontSize: 10, color: DIM }}>{calc.carbKcal.toFixed(0)} kcal</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Protein anchored first (2.0–2.2 g/kg), fat floor second (0.8–1.2 g/kg), carbs fill remainder. 4·9·4 kcal/g. Pairs with Kinetic Expenditure for deficit sizing and Metabolic Floor for TDEE anchor.
      </div>
    </div>
  );
}

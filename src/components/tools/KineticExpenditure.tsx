import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'kinetic-expenditure-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80';

type Units = 'lb' | 'kg';

interface State { units: Units; weight: string; activity: string; minutes: string; }

// MET values from Compendium of Physical Activities (Ainsworth 2011)
const ACTIVITIES: Record<string, { met: number; label: string }> = {
  walk_slow: { met: 2.8, label: 'Walking · 2.5 mph' },
  walk_brisk: { met: 4.3, label: 'Walking · 3.5 mph' },
  jog: { met: 7.0, label: 'Jogging · 5 mph' },
  run: { met: 9.8, label: 'Running · 6 mph' },
  run_fast: { met: 11.8, label: 'Running · 7.5 mph' },
  cycle_light: { met: 6.8, label: 'Cycling · 12–14 mph' },
  cycle_vig: { met: 10.0, label: 'Cycling · 16–19 mph' },
  swim: { met: 8.0, label: 'Swimming · moderate' },
  rowing: { met: 7.0, label: 'Rowing · moderate' },
  weights: { met: 6.0, label: 'Weight training · vigorous' },
  yoga: { met: 2.5, label: 'Yoga · Hatha' },
  hiit: { met: 8.5, label: 'HIIT · circuit' },
  hike: { met: 6.0, label: 'Hiking · cross-country' },
  desk: { met: 1.5, label: 'Desk work · seated' },
  sleep: { met: 0.95, label: 'Sleep' },
};

const DEFAULT_STATE: State = { units: 'lb', weight: '180', activity: 'run', minutes: '30' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

export default function KineticExpenditure() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const w = Math.max(0, parseNum(state.weight));
    const weightKg = state.units === 'lb' ? w * 0.453592 : w;
    const min = Math.max(0, parseNum(state.minutes));
    const met = ACTIVITIES[state.activity]?.met ?? 1;
    const kcal = (met * 3.5 * weightKg) / 200 * min;
    const kcalHour = (met * 3.5 * weightKg) / 200 * 60;
    const bigMacs = kcal / 563;
    const oreos = kcal / 53;
    return { kcal, kcalHour, bigMacs, oreos, met, weightKg };
  }, [state]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Kinetic Expenditure · MET</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="lb">lb</option><option value="kg">kg</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Weight</div>
          <input inputMode="decimal" value={state.weight} onChange={(e) => setState({ ...state, weight: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Activity</div>
          <select value={state.activity} onChange={(e) => setState({ ...state, activity: e.target.value })} style={input}>
            {Object.entries(ACTIVITIES).map(([k, v]) => <option key={k} value={k}>{v.label} · {v.met} MET</option>)}
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Duration (min)</div>
          <input inputMode="decimal" value={state.minutes} onChange={(e) => setState({ ...state, minutes: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: GOLD }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Session Expenditure</div>
        <div style={{ fontSize: 36, color: GOLD, fontWeight: 700 }}>{calc.kcal.toFixed(0)} kcal</div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{calc.met} MET · {calc.kcalHour.toFixed(0)} kcal/h sustained</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Big Mac equivalents</div>
          <div style={{ fontSize: 20, color: CYAN, fontWeight: 700 }}>{calc.bigMacs.toFixed(2)}</div>
          <div style={{ fontSize: 10, color: DIM }}>@ 563 kcal each</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Oreo equivalents</div>
          <div style={{ fontSize: 20, color: GREEN, fontWeight: 700 }}>{calc.oreos.toFixed(1)}</div>
          <div style={{ fontSize: 10, color: DIM }}>@ 53 kcal each</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Mass converted</div>
          <div style={{ fontSize: 20, color: TEXT, fontWeight: 700 }}>{calc.weightKg.toFixed(1)} kg</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Formula: kcal = MET × 3.5 × weight_kg / 200 × minutes. MET values from Compendium of Physical Activities (Ainsworth 2011). Real expenditure varies ±15% by efficiency.
      </div>
    </div>
  );
}

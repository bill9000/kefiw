import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'insulation-logic-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6';

type Units = 'F' | 'C';
type Activity = 'rest' | 'light' | 'moderate' | 'heavy';

interface State { units: Units; airTemp: string; activity: Activity; }
const DEFAULT_STATE: State = { units: 'F', airTemp: '40', activity: 'moderate' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// Metabolic rate (met units, 1 met = 58.2 W/m²)
const ACT: Record<Activity, { met: number; label: string }> = {
  rest: { met: 1.0, label: 'Resting · 1.0 met' },
  light: { met: 1.6, label: 'Light walk · 1.6 met' },
  moderate: { met: 2.5, label: 'Brisk hike · 2.5 met' },
  heavy: { met: 4.0, label: 'Running · 4.0 met' },
};

// Garments (approximate clo)
const GARMENTS = [
  { name: 'T-shirt', clo: 0.09 },
  { name: 'Long-sleeve shirt', clo: 0.25 },
  { name: 'Lightweight pants', clo: 0.20 },
  { name: 'Thick trousers', clo: 0.35 },
  { name: 'Sweater', clo: 0.28 },
  { name: 'Fleece mid-layer', clo: 0.55 },
  { name: 'Down jacket', clo: 0.90 },
  { name: 'Parka / shell', clo: 1.20 },
  { name: 'Thermal base layer', clo: 0.20 },
  { name: 'Wool socks', clo: 0.06 },
];

export default function InsulationLogic() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const tempC = state.units === 'F' ? (parseNum(state.airTemp) - 32) * 5 / 9 : parseNum(state.airTemp);
    const met = ACT[state.activity].met;
    // Empirical: Clo ≈ (33 − Ta) / (8 × met) for steady-state comfort
    // Simplified ISO 7730 form
    const requiredClo = Math.max(0, (33 - tempC) / (8 * met));
    const burnRate = Math.max(0, met * 58.2 * 1.8); // watts for ~1.8 m² adult
    return { tempC, requiredClo, burnRate };
  }, [state]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  // Suggested stack = greedy pack of garments until required clo met
  const stack: { name: string; clo: number }[] = [];
  let remaining = calc.requiredClo;
  const sorted = [...GARMENTS].sort((a, b) => b.clo - a.clo);
  for (const g of sorted) {
    if (remaining <= 0) break;
    if (g.clo <= remaining * 1.5) { stack.push(g); remaining -= g.clo; }
  }
  if (stack.length === 0 && calc.requiredClo > 0) stack.push({ name: 'T-shirt', clo: 0.09 });
  const stackClo = stack.reduce((s, g) => s + g.clo, 0);

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Insulation Logic · Clo Units</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="F">°F</option><option value="C">°C</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Air temperature</div>
          <input inputMode="decimal" value={state.airTemp} onChange={(e) => setState({ ...state, airTemp: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Activity</div>
          <select value={state.activity} onChange={(e) => setState({ ...state, activity: e.target.value as Activity })} style={input}>
            {Object.entries(ACT).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: CYAN }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Required Insulation</div>
        <div style={{ fontSize: 36, color: CYAN, fontWeight: 700 }}>{calc.requiredClo.toFixed(2)} clo</div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>at {calc.tempC.toFixed(1)} °C · {ACT[state.activity].label}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <div style={{ ...panel, borderColor: GOLD }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Metabolic burn</div>
          <div style={{ fontSize: 22, color: GOLD, fontWeight: 700 }}>{calc.burnRate.toFixed(0)} W</div>
          <div style={{ fontSize: 10, color: DIM }}>≈ {(calc.burnRate * 0.86).toFixed(0)} kcal/h heat out</div>
        </div>
        <div style={{ ...panel, borderColor: MAGENTA }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Under-clo penalty</div>
          <div style={{ fontSize: 13, color: TEXT }}>Cold body diverts fuel from muscle → thermogenesis. Dress for the delta to preserve bio-fuel.</div>
        </div>
      </div>

      <div style={panel}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Suggested Stack · {stackClo.toFixed(2)} clo</div>
        <div style={{ display: 'grid', gap: 4 }}>
          {stack.length === 0 ? (
            <div style={{ fontSize: 12, color: GREEN }}>No insulation required — ambient at thermoneutral zone for this activity.</div>
          ) : stack.map((g) => (
            <div key={g.name} style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: 10, fontSize: 12, padding: '3px 0' }}>
              <span style={{ color: TEXT }}>· {g.name}</span>
              <span style={{ color: CYAN, fontWeight: 600 }}>{g.clo.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Clo = (33 − Ta °C) / (8 × met). 1 clo ≈ business suit. Higher activity → lower clo needed (body generates heat). Pairs with Kinetic Expenditure — undressed in cold = bio-fuel diverted to heat.
      </div>
    </div>
  );
}

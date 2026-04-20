import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'ion-balance-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6';

type Intensity = 'moderate' | 'hard' | 'extreme';

interface State { durationHr: string; intensity: Intensity; sweatRate: string; }
const DEFAULT_STATE: State = { durationHr: '2', intensity: 'hard', sweatRate: '1.0' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// mg of ion per liter of sweat (ACSM / Maughan)
const ION_PER_L = { sodium: 800, potassium: 200, chloride: 1000, magnesium: 20 };

const INTENSITY: Record<Intensity, { label: string; factor: number }> = {
  moderate: { label: 'Moderate · steady', factor: 1.0 },
  hard: { label: 'Hard · race pace', factor: 1.3 },
  extreme: { label: 'Extreme · heat + vert', factor: 1.7 },
};

export default function IonBalance() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const hrs = Math.max(0, parseNum(state.durationHr));
    const rate = Math.max(0, parseNum(state.sweatRate));
    const factor = INTENSITY[state.intensity].factor;
    const litersLost = rate * hrs * factor;
    return {
      litersLost,
      sodium: litersLost * ION_PER_L.sodium,
      potassium: litersLost * ION_PER_L.potassium,
      chloride: litersLost * ION_PER_L.chloride,
      magnesium: litersLost * ION_PER_L.magnesium,
      oz: litersLost * 33.814,
    };
  }, [state]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Ion Balance · Electrolyte Loss</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Duration (h)</div>
          <input inputMode="decimal" value={state.durationHr} onChange={(e) => setState({ ...state, durationHr: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Intensity</div>
          <select value={state.intensity} onChange={(e) => setState({ ...state, intensity: e.target.value as Intensity })} style={input}>
            {Object.entries(INTENSITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Sweat rate (L/h)</div>
          <input inputMode="decimal" value={state.sweatRate} onChange={(e) => setState({ ...state, sweatRate: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: CYAN }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Fluid Lost</div>
        <div style={{ fontSize: 32, color: CYAN, fontWeight: 700 }}>{calc.litersLost.toFixed(2)} L</div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>≈ {calc.oz.toFixed(0)} oz · replace 125–150% to restore balance</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Sodium (Na⁺)</div>
          <div style={{ fontSize: 22, color: GOLD, fontWeight: 700 }}>{calc.sodium.toFixed(0)} mg</div>
          <div style={{ fontSize: 10, color: DIM }}>800 mg/L sweat</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Potassium (K⁺)</div>
          <div style={{ fontSize: 22, color: MAGENTA, fontWeight: 700 }}>{calc.potassium.toFixed(0)} mg</div>
          <div style={{ fontSize: 10, color: DIM }}>200 mg/L sweat</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Chloride (Cl⁻)</div>
          <div style={{ fontSize: 22, color: CYAN, fontWeight: 700 }}>{calc.chloride.toFixed(0)} mg</div>
          <div style={{ fontSize: 10, color: DIM }}>1000 mg/L sweat</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Magnesium (Mg²⁺)</div>
          <div style={{ fontSize: 22, color: GREEN, fontWeight: 700 }}>{calc.magnesium.toFixed(0)} mg</div>
          <div style={{ fontSize: 10, color: DIM }}>20 mg/L sweat</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Loss = sweat_rate × hours × intensity. Sweat ion concentration varies 2-3× by individual genetics. Heavy salt-sweaters can lose 1500+ mg Na⁺/L. Hyponatremia risk above 4h without Na⁺ replacement.
      </div>
    </div>
  );
}

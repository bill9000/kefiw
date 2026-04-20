import React, { useEffect, useMemo, useState } from 'react';
import { Zap } from 'lucide-react';

const STORAGE = 'max-load-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80';

interface State { weight: string; reps: string; unit: 'lb' | 'kg'; }
const DEFAULT_STATE: State = { weight: '225', reps: '5', unit: 'lb' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

export default function MaxLoadCapacity() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const w = Math.max(0, parseNum(state.weight));
    const reps = Math.max(1, Math.min(10, parseNum(state.reps)));
    const oneRm = w * 36 / (37 - reps);
    // Training recs as percentages of 1RM
    return {
      oneRm,
      hypertrophy: oneRm * 0.75,
      strength: oneRm * 0.85,
      recovery: oneRm * 0.60,
      validReps: reps <= 10,
      reps,
    };
  }, [state]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  const stressPct = Math.min(100, (calc.reps / 10) * 100);

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Zap size={18} color={GOLD} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Max Load Capacity · Brzycki 1RM</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Weight lifted</div>
          <input inputMode="decimal" value={state.weight} onChange={(e) => setState({ ...state, weight: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Reps completed (≤10)</div>
          <input inputMode="numeric" value={state.reps} onChange={(e) => setState({ ...state, reps: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Unit</div>
          <select value={state.unit} onChange={(e) => setState({ ...state, unit: e.target.value as 'lb' | 'kg' })} style={input}>
            <option value="lb">lb</option><option value="kg">kg</option>
          </select></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Load Stress Indicator</div>
        <div style={{ height: 18, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          <div style={{ width: `${stressPct}%`, height: '100%', background: `linear-gradient(90deg, ${GOLD}, ${CYAN})`, animation: calc.reps >= 8 ? 'mlc-pulse 1.4s ease-in-out infinite' : 'none' }} />
        </div>
        <style>{`@keyframes mlc-pulse { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }`}</style>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 4 }}>
          <span>1 rep</span><span>5 reps · strength zone</span><span>10 reps · upper bound</span>
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: GOLD }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Estimated Structural Limit (1RM)</div>
        <div style={{ fontSize: 32, color: GOLD, fontWeight: 700 }}>{calc.oneRm.toFixed(1)} {state.unit}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Recovery · 60%</div>
          <div style={{ fontSize: 18, color: GREEN, fontWeight: 600 }}>{calc.recovery.toFixed(1)} {state.unit}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Hypertrophy · 75%</div>
          <div style={{ fontSize: 18, color: CYAN, fontWeight: 600 }}>{calc.hypertrophy.toFixed(1)} {state.unit}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Strength · 85%</div>
          <div style={{ fontSize: 18, color: GOLD, fontWeight: 600 }}>{calc.strength.toFixed(1)} {state.unit}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Brzycki: 1RM = weight × 36 / (37 − reps). Validated 1–10 reps. Accuracy degrades past 10 reps; testing actual 1RM above 85% carries chassis-damage risk.
      </div>
    </div>
  );
}

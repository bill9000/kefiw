import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'hydraulic-integrity-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const MAGENTA = '#f472b6';

interface State { weightLbs: string; activityMin: string; currentOz: string; }
const DEFAULT_STATE: State = { weightLbs: '180', activityMin: '30', currentOz: '32' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

export default function HydraulicIntegrity() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const w = Math.max(0, parseNum(state.weightLbs));
    const a = Math.max(0, parseNum(state.activityMin));
    const curr = Math.max(0, parseNum(state.currentOz));
    const required = w * 0.5 + a * 0.4;
    const pct = required > 0 ? Math.min(100, (curr / required) * 100) : 0;
    return { required, curr, pct };
  }, [state]);

  const pressureColor = calc.pct >= 100 ? CYAN : calc.pct >= 70 ? GOLD : MAGENTA;
  const pressureLabel = calc.pct >= 100 ? 'Stable' : calc.pct >= 70 ? 'Guarded' : 'Low';

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  // Coolant tank SVG
  const tankW = 100, tankH = 240;
  const fillHeight = (calc.pct / 100) * tankH;

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Hydraulic Integrity · Coolant Load</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Weight (lbs)</div>
          <input inputMode="decimal" value={state.weightLbs} onChange={(e) => setState({ ...state, weightLbs: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Activity today (min)</div>
          <input inputMode="decimal" value={state.activityMin} onChange={(e) => setState({ ...state, activityMin: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Current intake (oz)</div>
          <input inputMode="decimal" value={state.currentOz} onChange={(e) => setState({ ...state, currentOz: e.target.value })} style={input} /></label>
      </div>

      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'auto 1fr', alignItems: 'center', marginBottom: '1rem' }}>
        <div style={panel}>
          <svg width={tankW} height={tankH + 20} style={{ display: 'block' }}>
            <rect x={10} y={10} width={tankW - 20} height={tankH} fill="#0b1120" stroke={BORDER} strokeWidth={2} />
            <rect x={10} y={10 + (tankH - fillHeight)} width={tankW - 20} height={fillHeight} fill={pressureColor} opacity={0.7} />
            <line x1={10} x2={tankW - 10} y1={10 + tankH * 0.25} y2={10 + tankH * 0.25} stroke={DIM} strokeDasharray="3 2" />
            <line x1={10} x2={tankW - 10} y1={10 + tankH * 0.5} y2={10 + tankH * 0.5} stroke={DIM} strokeDasharray="3 2" />
            <line x1={10} x2={tankW - 10} y1={10 + tankH * 0.75} y2={10 + tankH * 0.75} stroke={DIM} strokeDasharray="3 2" />
            <text x={tankW / 2} y={tankH + 18} textAnchor="middle" fontSize={11} fill={DIM} fontFamily="inherit">{Math.round(calc.pct)}%</text>
          </svg>
        </div>

        <div style={{ ...panel, borderColor: pressureColor }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Daily Hydraulic Requirement</div>
          <div style={{ fontSize: 28, color: CYAN, fontWeight: 700 }}>{calc.required.toFixed(0)} oz</div>
          <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>= {(calc.required / 33.814).toFixed(2)} L · {(calc.required * 29.574).toFixed(0)} mL</div>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 12 }}>Current System Pressure</div>
          <div style={{ fontSize: 20, color: pressureColor, fontWeight: 700 }}>{pressureLabel}</div>
          <div style={{ fontSize: 11, color: DIM }}>{calc.curr.toFixed(0)} / {calc.required.toFixed(0)} oz · deficit {Math.max(0, calc.required - calc.curr).toFixed(0)} oz</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Formula: Coolant = (weight_lbs × 0.5) + (activity_min × 0.4) oz · Anchor adjusts for body mass and metabolic load.
      </div>
    </div>
  );
}

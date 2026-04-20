import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'metabolic-incline-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

type Units = 'in' | 'cm';

interface State { units: Units; waist: string; height: string; }
const DEFAULT_STATE: State = { units: 'in', waist: '34', height: '70' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function classify(whtr: number): { label: string; color: string; risk: string } {
  if (whtr < 0.4) return { label: 'Underweight zone', color: CYAN, risk: 'Below metabolic norm' };
  if (whtr < 0.5) return { label: 'Low risk', color: GREEN, risk: 'Central adiposity within tolerance' };
  if (whtr < 0.57) return { label: 'Elevated risk', color: GOLD, risk: 'Visceral load trending up' };
  if (whtr < 0.63) return { label: 'High risk', color: MAGENTA, risk: 'Metabolic strain probable' };
  return { label: 'Critical', color: RED, risk: 'Acute cardiometabolic risk' };
}

export default function MetabolicIncline() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const w = Math.max(0, parseNum(state.waist));
    const h = Math.max(0, parseNum(state.height));
    const whtr = h > 0 ? w / h : 0;
    return { whtr, w, h };
  }, [state]);

  const cls = classify(calc.whtr);
  const gaugePct = Math.min(100, (calc.whtr / 0.8) * 100);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Metabolic Incline · Waist-to-Height</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="in">Inches</option><option value="cm">cm</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Waist circumference</div>
          <input inputMode="decimal" value={state.waist} onChange={(e) => setState({ ...state, waist: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Height</div>
          <input inputMode="decimal" value={state.height} onChange={(e) => setState({ ...state, height: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Metabolic Incline Gauge</div>
        <div style={{ height: 24, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}`, position: 'relative' }}>
          <div style={{ width: `${gaugePct}%`, height: '100%', background: `linear-gradient(90deg, ${CYAN}, ${GREEN}, ${GOLD}, ${MAGENTA}, ${RED})` }} />
          <div style={{ position: 'absolute', left: `${(0.5 / 0.8) * 100}%`, top: 0, bottom: 0, width: 2, background: GOLD }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 4 }}>
          <span>0.40</span><span style={{ color: GOLD }}>0.50 threshold</span><span>0.60</span><span>0.80</span>
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: cls.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>WHtR</div>
        <div style={{ fontSize: 36, color: cls.color, fontWeight: 700 }}>{calc.whtr.toFixed(3)}</div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Status: <span style={{ color: cls.color, fontWeight: 700 }}>{cls.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{cls.risk}</div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Rule-of-thumb: "Keep your waist under half your height." WHtR = waist / height. Validated across sexes and ethnicities. Better predictor of visceral fat / CV risk than BMI (Ashwell 2012).
      </div>
    </div>
  );
}

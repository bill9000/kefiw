import React, { useEffect, useMemo, useState } from 'react';
import { BatteryLow, BatteryMedium, BatteryFull, BatteryWarning } from 'lucide-react';
import { writeField } from '~/lib/session-context';
import { writeMetric, writeFlag } from '~/lib/kfw-bridge';

const STORAGE = 'decision-fatigue-v1';
const PIPELINE_KEY = 'willpower_remaining';
const PIPELINE_SOURCE = 'decision-fatigue';
const PIPELINE_LABEL = 'Decision Fatigue';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { trivial: string; moderate: string; heavy: string; }
const DEFAULT_STATE: State = { trivial: '10', moderate: '4', heavy: '1' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

const W_TRIVIAL = 1;
const W_MODERATE = 5;
const W_HEAVY = 10;

function battery(willpower: number): { icon: React.ReactNode; color: string; label: string; note: string } {
  if (willpower >= 75) return { icon: <BatteryFull size={42} color={GREEN} />, color: GREEN, label: 'Full_Charge', note: 'Reserves intact · decisions still crisp' };
  if (willpower >= 45) return { icon: <BatteryMedium size={42} color={GOLD} />, color: GOLD, label: 'Drawing_Down', note: 'Moderate drain · avoid stacking more heavy calls' };
  if (willpower >= 15) return { icon: <BatteryLow size={42} color={MAGENTA} />, color: MAGENTA, label: 'Low_Reserve', note: 'Defer non-critical choices · you are in decision debt' };
  return { icon: <BatteryWarning size={42} color={RED} />, color: RED, label: 'Depleted', note: 'Shutdown imminent · you will default to the easy/wrong option' };
}

export default function DecisionFatigue() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const t = Math.max(0, parseNum(state.trivial));
    const m = Math.max(0, parseNum(state.moderate));
    const h = Math.max(0, parseNum(state.heavy));
    const drain = t * W_TRIVIAL + m * W_MODERATE + h * W_HEAVY;
    const willpower = Math.max(0, 100 - drain);
    return { t, m, h, drain, willpower, trivialDrain: t * W_TRIVIAL, moderateDrain: m * W_MODERATE, heavyDrain: h * W_HEAVY };
  }, [state]);

  const bat = battery(calc.willpower);

  useEffect(() => {
    if (!hydrated) return;
    writeField(PIPELINE_KEY, calc.willpower, PIPELINE_SOURCE, PIPELINE_LABEL);
    const load = calc.willpower >= 75 ? 'low' : calc.willpower >= 45 ? 'nominal' : 'high';
    writeMetric('cognitive_load', load);
    writeMetric('willpower_pct', Math.round(calc.willpower));
    writeFlag('decision_fatigue', calc.willpower < 45);
  }, [calc.willpower, hydrated]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        {bat.icon}
        <div>
          <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Decision Fatigue · Willpower Battery</div>
          <div style={{ fontSize: 11, color: DIM }}>Every choice draws from the same finite reserve</div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Trivial decisions</div>
          <input inputMode="numeric" value={state.trivial} onChange={(e) => setState({ ...state, trivial: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>what to eat, what to wear · weight ×{W_TRIVIAL}</div></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Moderate decisions</div>
          <input inputMode="numeric" value={state.moderate} onChange={(e) => setState({ ...state, moderate: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>work problems · weight ×{W_MODERATE}</div></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Heavy decisions</div>
          <input inputMode="numeric" value={state.heavy} onChange={(e) => setState({ ...state, heavy: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>conflict, strategy · weight ×{W_HEAVY}</div></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: bat.color }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Battery Level</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width={120} height={60} viewBox="0 0 120 60">
            <rect x={2} y={12} width={100} height={36} fill="none" stroke={DIM} strokeWidth={2} rx={4} />
            <rect x={102} y={22} width={8} height={16} fill={DIM} rx={1} />
            <rect x={6} y={16} width={(calc.willpower / 100) * 92} height={28} fill={bat.color} rx={2}>
              {calc.willpower < 20 && <animate attributeName="opacity" values="1;0.35;1" dur="0.9s" repeatCount="indefinite" />}
            </rect>
          </svg>
          <div>
            <div style={{ fontSize: 32, color: bat.color, fontWeight: 700, lineHeight: 1 }}>{calc.willpower.toFixed(0)}%</div>
            <div style={{ fontSize: 12, color: bat.color, fontWeight: 700, marginTop: 4 }}>{bat.label}</div>
          </div>
        </div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 8 }}>{bat.note}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Trivial drain</div>
          <div style={{ fontSize: 18, color: CYAN, fontWeight: 700 }}>−{calc.trivialDrain}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Moderate drain</div>
          <div style={{ fontSize: 18, color: GOLD, fontWeight: 700 }}>−{calc.moderateDrain}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Heavy drain</div>
          <div style={{ fontSize: 18, color: MAGENTA, fontWeight: 700 }}>−{calc.heavyDrain}</div>
        </div>
        <div style={{ ...panel, borderColor: bat.color }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total load</div>
          <div style={{ fontSize: 18, color: bat.color, fontWeight: 700 }}>−{calc.drain}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Willpower = 100 − Σ(count × weight). Batch trivial choices (outfits, meals) to protect capacity for heavy ones. When the battery drops below 20%, you stop deciding and start defaulting — which is how most bad decisions slip through.
      </div>
    </div>
  );
}

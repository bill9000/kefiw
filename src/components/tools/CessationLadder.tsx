import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'cessation-ladder-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GREEN = '#4ade80';

interface State { hoursSince: string; }
const DEFAULT_STATE: State = { hoursSince: '24' };
const COTININE_HALF_LIFE = 16;

function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

export default function CessationLadder() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const hours = Math.max(0, parseNum(state.hoursSince));
    const remaining = Math.pow(0.5, hours / COTININE_HALF_LIFE);
    const cleared = 1 - remaining;
    const hoursTo95 = COTININE_HALF_LIFE * Math.log2(1 / 0.05);
    const hoursTo99 = COTININE_HALF_LIFE * Math.log2(1 / 0.01);
    const hoursToBaseline = Math.max(0, hoursTo95 - hours);
    const daysToBaseline = hoursToBaseline / 24;
    return { hours, remaining, cleared, hoursTo95, hoursTo99, hoursToBaseline, daysToBaseline };
  }, [state]);

  const milestones = [
    { h: 0.2, label: '12 min', note: 'Heart rate begins normalising' },
    { h: 8, label: '8 h', note: 'CO levels halved' },
    { h: 24, label: '24 h', note: 'Nicotine 99.9% cleared (t½=2h)' },
    { h: 48, label: '48 h', note: 'Cotinine ~87% cleared' },
    { h: 72, label: '72 h', note: 'Cotinine ~95% cleared' },
    { h: 14 * 24, label: '14 d', note: 'Withdrawal symptoms resolve' },
  ];

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Cessation Decay Ladder · Cotinine t½ 16h</div>
      </div>

      <label style={{ fontSize: 12, display: 'block', marginBottom: '1rem' }}>
        <div style={{ color: DIM, marginBottom: 4 }}>Hours since last cigarette</div>
        <input inputMode="decimal" value={state.hoursSince} onChange={(e) => setState({ ...state, hoursSince: e.target.value })} style={input} />
      </label>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: CYAN }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Detox Progress</div>
        <div style={{ height: 24, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          <div style={{ width: `${calc.cleared * 100}%`, height: '100%', background: `linear-gradient(90deg, ${CYAN}, ${GREEN})` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 6 }}>
          <span>0% clear</span>
          <span style={{ color: CYAN, fontWeight: 700, fontSize: 13 }}>{(calc.cleared * 100).toFixed(1)}% clear</span>
          <span>100% baseline</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Remaining metabolites</div>
          <div style={{ fontSize: 24, color: CYAN, fontWeight: 700 }}>{(calc.remaining * 100).toFixed(2)}%</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Baseline recovery in</div>
          <div style={{ fontSize: 24, color: GREEN, fontWeight: 700 }}>{calc.daysToBaseline.toFixed(1)}d</div>
          <div style={{ fontSize: 10, color: DIM }}>to 95% cleared</div>
        </div>
      </div>

      <div style={{ ...panel }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>System Milestones</div>
        <div style={{ display: 'grid', gap: 4 }}>
          {milestones.map((m) => {
            const passed = calc.hours >= m.h;
            return (
              <div key={m.label} style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 10, fontSize: 12, padding: '3px 0', opacity: passed ? 1 : 0.4 }}>
                <span style={{ color: passed ? GREEN : DIM, fontWeight: 600 }}>{passed ? '✓ ' : '· '}{m.label}</span>
                <span style={{ color: passed ? TEXT : DIM }}>{m.note}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Nicotine t½ ≈ 2h · Cotinine (metabolite) t½ ≈ 16h · Baseline = 0.5^(t/16). Milestones from CDC smoking-cessation timeline.
      </div>
    </div>
  );
}

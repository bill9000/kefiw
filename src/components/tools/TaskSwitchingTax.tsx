import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';
import { writeField } from '~/lib/session-context';

const STORAGE = 'task-switching-tax-v1';
const PIPELINE_KEY = 'effective_work_hours';
const PIPELINE_SOURCE = 'task-switching-tax';
const PIPELINE_LABEL = 'Task Switching Tax';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { tasks: string; hoursPerDay: string; }
const DEFAULT_STATE: State = { tasks: '4', hoursPerDay: '8' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function cpuColor(usage: number): string {
  if (usage >= 70) return RED;
  if (usage >= 45) return MAGENTA;
  if (usage >= 25) return GOLD;
  return GREEN;
}

interface TaskSwitchingTaxProps {
  namespace?: string;
}

export default function TaskSwitchingTax({ namespace }: TaskSwitchingTaxProps = {}) {
  const storageKey = namespace ? `${STORAGE}__${namespace}` : STORAGE;
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(storageKey); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, [storageKey]);
  useEffect(() => { if (hydrated) localStorage.setItem(storageKey, JSON.stringify(state)); }, [state, hydrated, storageKey]);

  const calc = useMemo(() => {
    const n = Math.max(1, Math.min(20, parseNum(state.tasks)));
    const hours = Math.max(0, parseNum(state.hoursPerDay));
    const retention = Math.pow(0.80, n - 1);
    const lossFraction = 1 - retention;
    const hoursLost = hours * lossFraction;
    const effective = hours * retention;
    return { n, hours, retention, lossFraction, hoursLost, effective, overheadPct: lossFraction * 100 };
  }, [state]);

  const col = cpuColor(calc.overheadPct);

  useEffect(() => {
    // Only the unnamespaced (default) instance writes to the shared session
    // pipeline. Triad/matrix instances stay isolated to their namespace.
    if (!hydrated || namespace) return;
    writeField(PIPELINE_KEY, calc.effective, PIPELINE_SOURCE, PIPELINE_LABEL);
  }, [calc.effective, hydrated, namespace]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Task Switching Tax · Context Overhead</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Concurrent tasks / projects</div>
          <input inputMode="numeric" value={state.tasks} onChange={(e) => setState({ ...state, tasks: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>n = distinct contexts you jump between</div></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Workday hours</div>
          <input inputMode="decimal" value={state.hoursPerDay} onChange={(e) => setState({ ...state, hoursPerDay: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>CPU Usage · System Overhead</div>
        <div style={{ display: 'flex', height: 28, borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}` }}>
          <div style={{ width: `${(1 - calc.lossFraction) * 100}%`, background: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#0b1120', fontWeight: 700 }}>
            {calc.effective > 0 && `USER ${((1 - calc.lossFraction) * 100).toFixed(0)}%`}
          </div>
          <div style={{ width: `${calc.lossFraction * 100}%`, background: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#0b1120', fontWeight: 700 }}>
            {calc.lossFraction > 0.1 && `OVERHEAD ${(calc.lossFraction * 100).toFixed(0)}%`}
          </div>
        </div>
        <div style={{ fontSize: 10, color: DIM, marginTop: 6, textAlign: 'center' }}>Each additional task costs ~20% of remaining capacity · n={calc.n}</div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: col }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Effective Throughput</div>
        <div style={{ fontSize: 36, color: col, fontWeight: 700 }}>{(calc.retention * 100).toFixed(1)}%</div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Switching tax: <span style={{ color: MAGENTA, fontWeight: 700 }}>{calc.hoursLost.toFixed(1)} h</span> of your day lost to The Gap</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Usable hours</div>
          <div style={{ fontSize: 20, color: GREEN, fontWeight: 700 }}>{calc.effective.toFixed(2)} h</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Burned in context-swap</div>
          <div style={{ fontSize: 20, color: col, fontWeight: 700 }}>{calc.hoursLost.toFixed(2)} h</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Retention factor</div>
          <div style={{ fontSize: 20, color: CYAN, fontWeight: 700 }}>0.8^{calc.n - 1}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Loss = 1 − 0.80^(n−1). Each additional concurrent context costs 20% of remaining capacity. Single-tasking (n=1) = 100%. At n=5, only 41% of your hours survive context-switching overhead.
      </div>
    </div>
  );
}

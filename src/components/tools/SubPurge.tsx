import React, { useEffect, useMemo, useState } from 'react';
import { Droplet, Plus, X } from 'lucide-react';
import { writeField } from '~/lib/session-context';

const STORAGE = 'sub-purge-v1';
const PIPELINE_KEY = 'monthly_savings_recoverable';
const PIPELINE_SOURCE = 'leak-detection';
const PIPELINE_LABEL = 'Subscription Purge';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface Sub { name: string; monthly: string; }
interface State { subs: Sub[]; }
const DEFAULT_STATE: State = {
  subs: [
    { name: 'Streaming A', monthly: '15' },
    { name: 'Streaming B', monthly: '13' },
    { name: 'Cloud storage', monthly: '10' },
    { name: 'Fitness app', monthly: '12' },
    { name: 'News', monthly: '8' },
  ],
};
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function verdict(monthly: number): { color: string; label: string; note: string } {
  if (monthly < 25) return { color: GREEN, label: 'Minimal_Leak', note: 'Spending is lean · keep monitoring' };
  if (monthly < 75) return { color: CYAN, label: 'Moderate_Drain', note: 'A few leaks · quick cleanup recovers real cash' };
  if (monthly < 150) return { color: GOLD, label: 'Serious_Leak', note: 'Monthly bleed is significant · audit each line' };
  if (monthly < 300) return { color: MAGENTA, label: 'Hull_Breach', note: 'Subscription creep has taken over · kill the bottom half now' };
  return { color: RED, label: 'Taking_On_Water', note: 'You are funding a fleet of services for someone else' };
}

export default function SubPurge() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    const monthly = state.subs.reduce((a, s) => a + Math.max(0, parseNum(s.monthly)), 0);
    writeField(PIPELINE_KEY, monthly, PIPELINE_SOURCE, PIPELINE_LABEL);
  }, [state, hydrated]);

  const calc = useMemo(() => {
    const lines = state.subs.map((s) => ({ name: s.name, amount: Math.max(0, parseNum(s.monthly)) }));
    const monthly = lines.reduce((a, b) => a + b.amount, 0);
    const annual = monthly * 12;
    const fiveYear = monthly * 60;
    const tenYear = monthly * 120;
    return { lines, monthly, annual, fiveYear, tenYear, count: lines.filter((l) => l.amount > 0).length };
  }, [state]);

  const v = verdict(calc.monthly);

  const addSub = () => setState({ subs: [...state.subs, { name: '', monthly: '' }] });
  const removeSub = (i: number) => setState({ subs: state.subs.filter((_, idx) => idx !== i) });
  const updateSub = (i: number, key: keyof Sub, val: string) => {
    const next = state.subs.slice();
    next[i] = { ...next[i], [key]: val };
    setState({ subs: next });
  };

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.4rem 0.6rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit', fontSize: 12 };
  const btn: React.CSSProperties = { background: '#0b1120', border: `1px solid ${BORDER}`, color: TEXT, padding: '0.35rem 0.6rem', borderRadius: 6, fontFamily: 'inherit', fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 };

  const leakCount = Math.min(5, Math.ceil(calc.monthly / 30));

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Droplet size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Subscription Purge · Leak Detection</div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Active Drains</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {state.subs.map((s, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 32px', gap: 6, alignItems: 'center' }}>
              <input placeholder="Name" value={s.name} onChange={(e) => updateSub(i, 'name', e.target.value)} style={input} />
              <input inputMode="decimal" placeholder="$/mo" value={s.monthly} onChange={(e) => updateSub(i, 'monthly', e.target.value)} style={input} />
              <button onClick={() => removeSub(i)} style={{ ...btn, justifyContent: 'center', padding: '0.35rem' }} aria-label="Remove">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addSub} style={{ ...btn, marginTop: 8 }}>
          <Plus size={12} /> Add line
        </button>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Sinking Ship · Hull Leaks</div>
        <svg width="100%" height={120} viewBox="0 0 400 120" style={{ display: 'block' }}>
          <line x1={0} y1={70} x2={400} y2={70} stroke={CYAN} strokeWidth={1} opacity={0.4} />
          <path d="M 80 60 L 320 60 L 300 100 L 100 100 Z" fill="#1e293b" stroke={DIM} strokeWidth={1.5} />
          <rect x={180} y={30} width={4} height={30} fill={DIM} />
          <path d="M 184 30 L 220 42 L 184 52 Z" fill={v.color} opacity={0.8} />
          {Array.from({ length: leakCount }).map((_, i) => {
            const x = 110 + i * 40;
            return (
              <g key={i}>
                <circle cx={x} cy={85} r={3} fill={v.color}>
                  <animate attributeName="cy" values="85;115;85" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="1;0;1" dur={`${1.2 + i * 0.15}s`} repeatCount="indefinite" />
                </circle>
              </g>
            );
          })}
        </svg>
        <div style={{ fontSize: 10, color: DIM, textAlign: 'center', marginTop: 4 }}>
          {leakCount} visible leak{leakCount === 1 ? '' : 's'} · each represents ~$30/mo of drain
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: v.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Monthly Bleed</div>
        <div style={{ fontSize: 36, color: v.color, fontWeight: 700 }}>${calc.monthly.toFixed(2)}</div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Verdict: <span style={{ color: v.color, fontWeight: 700 }}>{v.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{v.note}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Annual cost</div>
          <div style={{ fontSize: 20, color: GOLD, fontWeight: 700 }}>${calc.annual.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>5-year cost</div>
          <div style={{ fontSize: 20, color: MAGENTA, fontWeight: 700 }}>${calc.fiveYear.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>10-year cost</div>
          <div style={{ fontSize: 20, color: RED, fontWeight: 700 }}>${calc.tenYear.toFixed(0)}</div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: CYAN, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        → Pipe this monthly recovery into the <a href="/finance/runway-zero/" style={{ color: CYAN, textDecoration: 'underline' }}>Runway Zero</a> calculator — every $50/mo cut extends your bankruptcy date by weeks.
      </div>
      <div style={{ fontSize: 10, color: DIM, paddingTop: 6 }}>
        Monthly bleed = Σ(line_monthly). Lifetime = monthly × 12 × years. Subscriptions compound silently — the 10-year column is why.
      </div>
    </div>
  );
}

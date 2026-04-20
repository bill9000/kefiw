import React, { useEffect, useMemo, useState } from 'react';
import { Scale } from 'lucide-react';

const STORAGE = 'social-utility-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { support: string; positive: string; conflict: string; drain: string; }
const DEFAULT_STATE: State = { support: '5', positive: '6', conflict: '3', drain: '2' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function verdict(ratio: number): { color: string; label: string; note: string } {
  if (ratio >= 3) return { color: GREEN, label: 'Net_Positive', note: 'High-yield connection · invest in this relationship' };
  if (ratio >= 1.5) return { color: CYAN, label: 'Healthy_Surplus', note: 'Solid ROI · normal friction within tolerance' };
  if (ratio >= 1) return { color: GOLD, label: 'Break_Even', note: 'Neutral · you get back roughly what you put in' };
  if (ratio >= 0.5) return { color: MAGENTA, label: 'Net_Drain', note: 'Costs exceed returns · audit the frequency of contact' };
  return { color: RED, label: 'Parasitic', note: 'The relationship is a sink · consider distance or a hard conversation' };
}

export default function SocialUtility() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const support = Math.max(0, Math.min(10, parseNum(state.support)));
    const positive = Math.max(0, Math.min(10, parseNum(state.positive)));
    const conflict = Math.max(0, Math.min(10, parseNum(state.conflict)));
    const drain = Math.max(0, Math.min(10, parseNum(state.drain)));
    const credit = support + positive;
    const debit = conflict + drain;
    const ratio = debit > 0 ? credit / debit : credit > 0 ? 99 : 0;
    const net = credit - debit;
    return { support, positive, conflict, drain, credit, debit, ratio, net };
  }, [state]);

  const v = verdict(calc.ratio);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  const tilt = Math.max(-20, Math.min(20, (calc.debit - calc.credit) * 1.5));

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Scale size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Social Utility · Balance of Connection</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Support given (0–10)</div>
          <input inputMode="numeric" value={state.support} onChange={(e) => setState({ ...state, support: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>shows up when you need them</div></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Positive energy (0–10)</div>
          <input inputMode="numeric" value={state.positive} onChange={(e) => setState({ ...state, positive: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>fun, inspiration, growth</div></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Conflict cost (0–10)</div>
          <input inputMode="numeric" value={state.conflict} onChange={(e) => setState({ ...state, conflict: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>drama, arguments, tension</div></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Energy drain (0–10)</div>
          <input inputMode="numeric" value={state.drain} onChange={(e) => setState({ ...state, drain: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>venting, needs, emotional labor</div></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Connection Balance</div>
        <svg width="100%" height={140} viewBox="0 0 400 140" style={{ display: 'block' }}>
          <line x1={200} y1={30} x2={200} y2={130} stroke={DIM} strokeWidth={2} />
          <polygon points="190,130 210,130 200,120" fill={DIM} />
          <g transform={`translate(200 70) rotate(${tilt})`}>
            <line x1={-130} y1={0} x2={130} y2={0} stroke={v.color} strokeWidth={3} />
            <g transform="translate(-110 0)">
              <line x1={0} y1={0} x2={0} y2={25} stroke={v.color} strokeWidth={1.5} />
              <rect x={-35} y={25} width={70} height={30} fill="#0b1120" stroke={GREEN} strokeWidth={1.5} rx={3} />
              <text x={0} y={45} fontSize={11} fill={GREEN} fontFamily="inherit" textAnchor="middle" fontWeight={700}>+{calc.credit.toFixed(0)}</text>
            </g>
            <g transform="translate(110 0)">
              <line x1={0} y1={0} x2={0} y2={25} stroke={v.color} strokeWidth={1.5} />
              <rect x={-35} y={25} width={70} height={30} fill="#0b1120" stroke={MAGENTA} strokeWidth={1.5} rx={3} />
              <text x={0} y={45} fontSize={11} fill={MAGENTA} fontFamily="inherit" textAnchor="middle" fontWeight={700}>−{calc.debit.toFixed(0)}</text>
            </g>
          </g>
          <text x={40} y={20} fontSize={10} fill={DIM} fontFamily="inherit">SUPPORT + POSITIVE</text>
          <text x={360} y={20} fontSize={10} fill={DIM} fontFamily="inherit" textAnchor="end">CONFLICT + DRAIN</text>
        </svg>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: v.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Utility Ratio</div>
        <div style={{ fontSize: 36, color: v.color, fontWeight: 700 }}>
          {calc.ratio >= 99 ? '∞' : calc.ratio.toFixed(2)}
        </div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Verdict: <span style={{ color: v.color, fontWeight: 700 }}>{v.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{v.note}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Credit side</div>
          <div style={{ fontSize: 20, color: GREEN, fontWeight: 700 }}>+{calc.credit.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Debit side</div>
          <div style={{ fontSize: 20, color: MAGENTA, fontWeight: 700 }}>−{calc.debit.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Net</div>
          <div style={{ fontSize: 20, color: calc.net >= 0 ? GREEN : RED, fontWeight: 700 }}>
            {calc.net >= 0 ? '+' : ''}{calc.net.toFixed(0)}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Utility = (support + positive) / (conflict + drain). Not every relationship needs to be ≥1 — but the set of all relationships in your life must be, or you run at a deficit.
      </div>
      <div style={{ fontSize: 10, color: GOLD, paddingTop: 6 }}>
        Note: this is a signal, not a sentence. Use it to flag patterns worth addressing, not to grade specific people.
      </div>
    </div>
  );
}

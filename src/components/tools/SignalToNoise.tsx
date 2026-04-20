import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'signal-to-noise-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const SLUDGE = '#78716c';

interface State { minutesConsumed: string; actionableInsights: string; }
const DEFAULT_STATE: State = { minutesConsumed: '120', actionableInsights: '2' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function status(pct: number): { label: string; color: string; note: string } {
  if (pct < 10) return { label: 'Distraction_Loop', color: MAGENTA, note: 'Throughput pipe clogged · information is not producing action' };
  if (pct < 40) return { label: 'Information_Gathering', color: GOLD, note: 'Some signal · most intake is passive research' };
  return { label: 'Action_Ready', color: GREEN, note: 'Input is converting to decisions — efficient throughput' };
}

export default function SignalToNoise() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const mins = Math.max(0, parseNum(state.minutesConsumed));
    const insights = Math.max(0, parseNum(state.actionableInsights));
    const efficiency = mins > 0 ? Math.min(100, (insights / (mins * 0.1)) * 100) : 0;
    const wasteMin = Math.max(0, mins - insights * 10);
    return { mins, insights, efficiency, wasteMin };
  }, [state]);

  const st = status(calc.efficiency);
  const pipeFill = Math.min(100, calc.efficiency);
  const sludge = Math.max(0, 100 - pipeFill);
  const clogged = calc.efficiency < 10;

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Signal-to-Noise Ratio · Content Throughput</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Minutes consumed today</div>
          <input inputMode="decimal" value={state.minutesConsumed} onChange={(e) => setState({ ...state, minutesConsumed: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Actionable insights gained</div>
          <input inputMode="numeric" value={state.actionableInsights} onChange={(e) => setState({ ...state, actionableInsights: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>An insight = data that changed a decision</div></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Throughput Pipe</div>
        <svg width="100%" height={80} viewBox="0 0 400 80" style={{ display: 'block' }}>
          <rect x={2} y={24} width={396} height={32} fill="#0b1120" stroke={BORDER} strokeWidth={2} rx={4} />
          <rect x={4} y={26} width={(pipeFill / 100) * 392} height={28} fill={st.color} opacity={0.85}>
            {!clogged && <animate attributeName="opacity" values="0.65;1;0.65" dur="1.8s" repeatCount="indefinite" />}
          </rect>
          <rect x={4 + (pipeFill / 100) * 392} y={26} width={(sludge / 100) * 392} height={28} fill={SLUDGE} opacity={0.6}>
            {clogged && <animate attributeName="opacity" values="0.4;0.75;0.4" dur="2.2s" repeatCount="indefinite" />}
          </rect>
          <line x1={4} y1={26} x2={4} y2={54} stroke={DIM} strokeWidth={1} />
          <line x1={396} y1={26} x2={396} y2={54} stroke={DIM} strokeWidth={1} />
          <text x={8} y={20} fontSize={10} fill={DIM} fontFamily="inherit">INPUT</text>
          <text x={360} y={20} fontSize={10} fill={DIM} fontFamily="inherit">ACTION</text>
          <text x={200} y={72} fontSize={11} fill={st.color} fontFamily="inherit" textAnchor="middle" fontWeight={700}>{clogged ? 'CLOGGED' : 'FLOWING'}</text>
        </svg>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: st.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Signal Efficiency</div>
        <div style={{ fontSize: 36, color: st.color, fontWeight: 700 }}>{calc.efficiency.toFixed(1)}%</div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Status: <span style={{ color: st.color, fontWeight: 700 }}>{st.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{st.note}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Input volume</div>
          <div style={{ fontSize: 20, color: CYAN, fontWeight: 700 }}>{calc.mins.toFixed(0)} min</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Insights converted</div>
          <div style={{ fontSize: 20, color: GOLD, fontWeight: 700 }}>{calc.insights}</div>
        </div>
        <div style={{ ...panel, borderColor: MAGENTA }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Digital waste</div>
          <div style={{ fontSize: 20, color: MAGENTA, fontWeight: 700 }}>{calc.wasteMin.toFixed(0)} min</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Efficiency = (insights / (minutes × 0.1)) × 100. Baseline assumes 6 min per actionable insight — below that pace you're consuming, not deciding.
      </div>
    </div>
  );
}

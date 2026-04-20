import React, { useEffect, useMemo, useState } from 'react';
import { Zap, Activity } from 'lucide-react';

const STORAGE = 'time-to-human-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GOLD = '#facc15';
const COLOR_GREEN = '#4ade80';
const COLOR_RED = '#ef4444';

interface State { energy: string; transit: string; cost: string; connection: string; }
const DEFAULT_STATE: State = { energy: '6', transit: '25', cost: '15', connection: '7' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export default function TimeToHuman() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const energy = Math.max(1, Math.min(10, parseNum(state.energy)));
    const transit = Math.max(0, parseNum(state.transit));
    const cost = Math.max(0, parseNum(state.cost));
    const connection = Math.max(1, Math.min(10, parseNum(state.connection)));
    const energyTax = (11 - energy) * 5;
    const denominator = transit + cost + energyTax;
    const score = denominator > 0 ? (connection * 10) / denominator : 0;
    return { energy, transit, cost, connection, energyTax, denominator, score, go: score >= 1 };
  }, [state]);

  const batteryPct = Math.round(calc.energy * 10);
  const batteryColor = batteryPct > 60 ? COLOR_GREEN : batteryPct > 30 ? COLOR_GOLD : COLOR_RED;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>TIME_TO_HUMAN</div>
            <div style={subtitle}>Social ROI — is this outing worth leaving the house for?</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Energy (1-10)" value={state.energy} onChange={(v) => setState({ ...state, energy: v })} />
        <InputCell label="Transit (min)" value={state.transit} onChange={(v) => setState({ ...state, transit: v })} />
        <InputCell label="Cost" value={state.cost} onChange={(v) => setState({ ...state, cost: v })} prefix="$" />
        <InputCell label="Connection (1-10)" value={state.connection} onChange={(v) => setState({ ...state, connection: v })} />
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 8 }}>SOCIAL BATTERY</div>
          <svg viewBox="0 0 200 100" width="100%" height="100">
            <rect x="5" y="20" width="170" height="60" rx="6" fill="none" stroke={COLOR_BORDER} strokeWidth="2" />
            <rect x="175" y="38" width="12" height="24" rx="2" fill={COLOR_BORDER} />
            <rect x="10" y="25" width={160 * (batteryPct / 100)} height="50" fill={batteryColor} opacity="0.8" style={{ transition: 'width 320ms ease, fill 320ms ease' }} />
            <text x="90" y="58" textAnchor="middle" fill={COLOR_TEXT} fontSize="20" fontWeight="700" fontFamily="inherit">{batteryPct}%</text>
          </svg>
        </div>
        <div style={{ textAlign: 'center', borderLeft: `1px solid ${COLOR_BORDER}`, paddingLeft: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>VIBE SCORE</div>
          <div style={{ fontSize: 42, fontWeight: 700, color: calc.go ? COLOR_GREEN : COLOR_MAGENTA, transition: 'color 240ms ease' }}>{calc.score.toFixed(2)}</div>
          <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: '.12em', color: calc.go ? COLOR_GREEN : COLOR_MAGENTA }}>{calc.go ? '▶ GO' : '● STAY'}</div>
          <div style={{ fontSize: 11, color: COLOR_DIM, marginTop: 6 }}>
            {calc.go ? 'The ROI on this connection is high — push through.' : 'Your battery is too low; protect your peace today.'}
          </div>
        </div>
      </div>

      <div style={{ ...panel, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 6 }}>BREAKDOWN</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
          <Metric label="Energy Tax" value={`${calc.energyTax}`} color={COLOR_MAGENTA} />
          <Metric label="Total Cost Unit" value={`${calc.denominator.toFixed(0)}`} color={COLOR_DIM} />
          <Metric label="Connection × 10" value={`${calc.connection * 10}`} color={COLOR_GOLD} />
        </div>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Score = (connection × 10) ÷ (transit + cost + energy_tax). Energy tax = (11 − energy) × 5. Score ≥ 1.0 → GO. Low energy amplifies transit and cost penalties.
      </div>
    </div>
  );
}

function InputCell({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, marginBottom: 4 }}>{label}</div>
      {prefix ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ color: COLOR_DIM, fontSize: 13 }}>{prefix}</span>
          <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
        </div>
      ) : (
        <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      )}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Activity size={12} color={color} />{label}
      </div>
      <div style={{ fontSize: 16, color, fontWeight: 700, marginTop: 2 }}>{value}</div>
    </div>
  );
}

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 4, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 14, outline: 'none' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

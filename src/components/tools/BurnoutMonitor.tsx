import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'burnout-monitor-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_GREEN = '#4ade80';
const COLOR_GOLD = '#facc15';
const COLOR_ORANGE = '#f59e0b';
const COLOR_RED = '#ef4444';

interface State { sleepHours: string; extraWorkHours: string; hourlyRate: string; }
const DEFAULT_STATE: State = { sleepHours: '6', extraWorkHours: '2', hourlyRate: '30' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

// Cognitive output multiplier. Research-ish: <5h catastrophic (0.6), 5-7h degraded, 7-9h optimal.
function cogMultiplier(sleep: number): number {
  if (sleep >= 8) return 1.0;
  if (sleep >= 7) return 0.95;
  if (sleep >= 6) return 0.85;
  if (sleep >= 5) return 0.72;
  if (sleep >= 4) return 0.6;
  if (sleep >= 3) return 0.48;
  return 0.35;
}

function cogColor(m: number): string {
  if (m >= 0.9) return COLOR_GREEN;
  if (m >= 0.75) return COLOR_GOLD;
  if (m >= 0.55) return COLOR_ORANGE;
  return COLOR_RED;
}

export default function BurnoutMonitor() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const sleepHours = Math.max(0, Math.min(12, parseNum(state.sleepHours)));
    const extraWorkHours = Math.max(0, parseNum(state.extraWorkHours));
    const hourlyRate = Math.max(0, parseNum(state.hourlyRate));
    const multiplier = cogMultiplier(sleepHours);
    const effectiveRate = hourlyRate * multiplier;
    const grossTonight = extraWorkHours * hourlyRate;
    const effectiveTomorrowLoss = extraWorkHours * hourlyRate * (1 - multiplier);
    const netValue = grossTonight - effectiveTomorrowLoss;
    const blurPx = Math.round((1 - multiplier) * 8);
    return { sleepHours, extraWorkHours, hourlyRate, multiplier, effectiveRate, grossTonight, effectiveTomorrowLoss, netValue, blurPx };
  }, [state]);

  const color = cogColor(calc.multiplier);

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>BURNOUT_MONITOR</div>
            <div style={subtitle}>Sleep vs Hustle — effective rate after cognitive decay</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Sleep tonight (hrs)" value={state.sleepHours} onChange={(v) => setState({ ...state, sleepHours: v })} />
        <InputCell label="Extra work tonight (hrs)" value={state.extraWorkHours} onChange={(v) => setState({ ...state, extraWorkHours: v })} />
        <InputCell label="Hourly rate" value={state.hourlyRate} onChange={(v) => setState({ ...state, hourlyRate: v })} prefix="$" />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>COGNITIVE OUTPUT</div>
          <div style={{ fontSize: 48, fontWeight: 700, color, transition: 'color 240ms ease', filter: `blur(${calc.blurPx}px)` }}>
            {(calc.multiplier * 100).toFixed(0)}%
          </div>
          <div style={{ fontSize: 11, color: COLOR_DIM, marginTop: 4 }}>fog intensity tracks sleep loss</div>
        </div>
        <div style={{ textAlign: 'center', borderLeft: `1px solid ${COLOR_BORDER}`, paddingLeft: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>EFFECTIVE RATE</div>
          <div style={{ fontSize: 36, fontWeight: 700, color }}>{formatCurrency(calc.effectiveRate)}/hr</div>
          <div style={{ fontSize: 11, color: COLOR_DIM, marginTop: 4 }}>was {formatCurrency(calc.hourlyRate)}/hr at full capacity</div>
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>COGNITIVE FOG</div>
        <svg viewBox="0 0 400 80" width="100%" height="80">
          <defs>
            <linearGradient id="fogGrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={COLOR_GREEN} />
              <stop offset="50%" stopColor={COLOR_GOLD} />
              <stop offset="100%" stopColor={COLOR_RED} />
            </linearGradient>
          </defs>
          <rect x="10" y="30" width="380" height="20" rx="4" fill="url(#fogGrad)" opacity="0.4" />
          <rect x="10" y="30" width={380 * calc.multiplier} height="20" rx="4" fill="url(#fogGrad)" style={{ transition: 'width 320ms ease' }} />
          {[0, 4, 6, 8, 10].map((h, i) => (
            <g key={i}>
              <line x1={10 + (h / 10) * 380} y1="30" x2={10 + (h / 10) * 380} y2="54" stroke={COLOR_BORDER} strokeWidth="1" />
              <text x={10 + (h / 10) * 380} y="70" textAnchor="middle" fill={COLOR_DIM} fontSize="10" fontFamily="inherit">{h}h</text>
            </g>
          ))}
          <circle cx={10 + (calc.sleepHours / 10) * 380} cy="40" r="6" fill={color} stroke={COLOR_BG} strokeWidth="2" style={{ transition: 'cx 320ms ease' }} />
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Gross tonight" value={formatCurrency(calc.grossTonight)} color={COLOR_TEXT} />
        <Metric label="Tomorrow loss" value={`−${formatCurrency(calc.effectiveTomorrowLoss)}`} color={COLOR_RED} />
        <Metric label="Net value" value={formatCurrency(calc.netValue)} color={calc.netValue >= 0 ? COLOR_GREEN : COLOR_RED} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Cognitive output by sleep: ≥8h = 100%, 7h = 95%, 6h = 85%, 5h = 72%, 4h = 60%, 3h = 48%, &lt;3h = 35%. Extra-work value = hours × rate. Tomorrow loss = hours × rate × (1 − multiplier). Net = gross − tomorrow loss.
      </div>
    </div>
  );
}

function InputCell({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {prefix && <span style={{ color: COLOR_DIM, fontSize: 13 }}>{prefix}</span>}
        <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, display: 'flex', alignItems: 'center', gap: 4 }}>
        <Activity size={12} color={color} />{label}
      </div>
      <div style={{ fontSize: 18, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
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

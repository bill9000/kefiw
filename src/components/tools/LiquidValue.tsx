import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'liquid-value-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_GOLD = '#facc15';
const COLOR_GREEN = '#4ade80';
const COLOR_RED = '#ef4444';
const COLOR_ORANGE = '#f59e0b';

interface State { resale: string; replacement: string; lateFee: string; }
const DEFAULT_STATE: State = { resale: '120', replacement: '300', lateFee: '50' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function LiquidValue() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const resale = Math.max(0, parseNum(state.resale));
    const replacement = Math.max(0, parseNum(state.replacement));
    const lateFee = Math.max(0, parseNum(state.lateFee));
    const penalty = replacement - resale;
    const netSaved = lateFee - penalty;
    const penaltyRatio = lateFee > 0 ? penalty / lateFee : penalty > 0 ? Infinity : 0;
    const highPenalty = penalty > lateFee;
    return { resale, replacement, lateFee, penalty, netSaved, penaltyRatio, highPenalty };
  }, [state]);

  const color = !calc.highPenalty ? COLOR_GREEN : calc.penaltyRatio < 3 ? COLOR_ORANGE : COLOR_RED;
  const verdict = calc.highPenalty ? 'HIGH PENALTY' : 'DEFENSIBLE';
  // meter: 0 → 4x
  const meterMax = 4;
  const meterPct = Math.min(100, (Math.min(calc.penaltyRatio, meterMax) / meterMax) * 100);

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>LIQUID_VALUE</div>
            <div style={subtitle}>Sell asset today vs eat late fee — equity loss math</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Resale value today" value={state.resale} onChange={(v) => setState({ ...state, resale: v })} prefix="$" />
        <InputCell label="Replacement cost later" value={state.replacement} onChange={(v) => setState({ ...state, replacement: v })} prefix="$" />
        <InputCell label="Late fee avoided" value={state.lateFee} onChange={(v) => setState({ ...state, lateFee: v })} prefix="$" />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>REPLACEMENT PENALTY</div>
        <div style={{ fontSize: 44, fontWeight: 700, color }}>{formatCurrency(calc.penalty)}</div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.12em', color, marginTop: 2 }}>{verdict}</div>
        <div style={{ fontSize: 12, color: COLOR_DIM, marginTop: 6 }}>
          Net of late fee: <span style={{ color: calc.netSaved >= 0 ? COLOR_GREEN : COLOR_RED, fontWeight: 700 }}>{formatCurrency(calc.netSaved)}</span>
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>LOSS OF EQUITY METER</div>
        <svg viewBox="0 0 400 80" width="100%" height="80">
          <defs>
            <linearGradient id="lvGrad" x1="0" x2="1">
              <stop offset="0%" stopColor={COLOR_GREEN} />
              <stop offset="30%" stopColor={COLOR_GOLD} />
              <stop offset="70%" stopColor={COLOR_ORANGE} />
              <stop offset="100%" stopColor={COLOR_RED} />
            </linearGradient>
          </defs>
          <rect x="10" y="26" width="380" height="26" rx="4" fill="url(#lvGrad)" opacity="0.3" />
          <rect x="10" y="26" width={380 * (meterPct / 100)} height="26" rx="4" fill="url(#lvGrad)" style={{ transition: 'width 320ms ease' }} />
          {[0, 1, 2, 3, 4].map((r) => (
            <g key={r}>
              <line x1={10 + (r / meterMax) * 380} y1="52" x2={10 + (r / meterMax) * 380} y2="60" stroke={COLOR_DIM} strokeWidth="1" />
              <text x={10 + (r / meterMax) * 380} y="74" textAnchor="middle" fill={COLOR_DIM} fontSize="10" fontFamily="inherit">{r}×</text>
            </g>
          ))}
          <circle cx={10 + (meterPct / 100) * 380} cy="39" r="6" fill={color} stroke={COLOR_BG} strokeWidth="2" style={{ transition: 'cx 320ms ease' }} />
        </svg>
        <div style={{ textAlign: 'center', fontSize: 11, color: COLOR_DIM, marginTop: 4 }}>
          Penalty / Fee ratio: <span style={{ color, fontWeight: 700 }}>{calc.penaltyRatio === Infinity ? '∞' : `${calc.penaltyRatio.toFixed(2)}×`}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="You get today" value={formatCurrency(calc.resale)} color={COLOR_GREEN} />
        <Metric label="You pay later" value={formatCurrency(calc.replacement)} color={COLOR_ORANGE} />
        <Metric label="Fee avoided" value={formatCurrency(calc.lateFee)} color={COLOR_GOLD} />
        <Metric label="Net outcome" value={formatCurrency(calc.netSaved)} color={calc.netSaved >= 0 ? COLOR_GREEN : COLOR_RED} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Penalty = replacement − resale. Net = late fee − penalty. If penalty &gt; late fee, selling is a loss trade. Ratio &lt; 1× is defensible; ≥1× is a high-penalty liquidation — only justified by Tier-1 survival needs.
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
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM }}>{label}</div>
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

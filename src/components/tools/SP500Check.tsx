import React, { useEffect, useMemo, useState } from 'react';
import { TrendingUp, AlertTriangle, Activity } from 'lucide-react';

const STORAGE = 'sp500-check-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_GOLD = '#facc15';
const COLOR_MAGENTA = '#f472b6';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';

interface State {
  principal: string;
  years: string;
  returnPct: string;
}
const DEFAULT_STATE: State = { principal: '10000', years: '20', returnPct: '7' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function SP500Check() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const principal = parseNum(state.principal);
  const years = Math.max(1, Math.min(50, parseNum(state.years)));
  const r = parseNum(state.returnPct) / 100;

  const points = useMemo(() => {
    const out: { year: number; value: number }[] = [];
    for (let y = 0; y <= years; y++) {
      out.push({ year: y, value: principal * Math.pow(1 + r, y) });
    }
    return out;
  }, [principal, years, r]);

  const futureValue = points[points.length - 1].value;
  const multiple = principal > 0 ? futureValue / principal : 0;
  const highCostWarning = multiple > 5;

  // Milestones
  const ten = principal * Math.pow(1 + r, 10);
  const twenty = principal * Math.pow(1 + r, 20);
  const thirty = principal * Math.pow(1 + r, 30);

  const W = 560, H = 220, P = 30;
  const yMax = futureValue * 1.08 || 1;
  const px = (yr: number) => P + (yr / years) * (W - P * 2);
  const py = (v: number) => H - P - (v / yMax) * (H - P * 2);
  const line = points.map((p) => `${px(p.year)},${py(p.value)}`).join(' ');

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={22} color={COLOR_GOLD} />
          <div>
            <div style={title}>SP500_REALITY_CHECK</div>
            <div style={subtitle}>Opportunity cost — what this purchase would be if left in the market</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Purchase / Investment" prefix="$" value={state.principal} onChange={(v) => setState((s) => ({ ...s, principal: v }))} />
        <InputCell label="Time Horizon (Years)" value={state.years} onChange={(v) => setState((s) => ({ ...s, years: v }))} />
        <InputCell label="Expected Return %" value={state.returnPct} onChange={(v) => setState((s) => ({ ...s, returnPct: v }))} />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, borderColor: highCostWarning ? COLOR_DANGER : COLOR_GOLD, boxShadow: `0 0 24px ${highCostWarning ? COLOR_DANGER : COLOR_GOLD}22` }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>FUTURE VALUE — {years} YEARS @ {(r * 100).toFixed(0)}%</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: COLOR_GOLD }}>{formatCurrency(futureValue)}</span>
          <span style={{ fontSize: 16, color: COLOR_DIM }}>{multiple.toFixed(1)}× the original</span>
        </div>
        {highCostWarning && (
          <div style={{ marginTop: 10, padding: '8px 12px', border: `1px solid ${COLOR_DANGER}`, borderRadius: 6, background: 'rgba(239,68,68,0.08)', color: COLOR_DANGER, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} /> High opportunity cost — {multiple.toFixed(1)}× the spend. Your investment must beat this to be rational.
          </div>
        )}
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: COLOR_DIM }}>
          <span style={{ letterSpacing: '.16em' }}>COMPOUND GROWTH</span>
          <div style={{ display: 'flex', gap: 12 }}>
            <span><span style={{ color: COLOR_GOLD }}>—</span> Investment</span>
            <span><span style={{ color: COLOR_MAGENTA }}>●</span> Current Spend</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          <polyline points={line} fill="none" stroke={COLOR_GOLD} strokeWidth={2} />
          <circle cx={px(0)} cy={py(principal)} r={6} fill={COLOR_MAGENTA} />
          <text x={px(0) + 10} y={py(principal) + 4} fill={COLOR_MAGENTA} fontSize={10} fontFamily="monospace">NOW · {formatCurrency(principal)}</text>
          <circle cx={px(years)} cy={py(futureValue)} r={5} fill={COLOR_GOLD} />
          <text x={px(years) - 10} y={py(futureValue) - 8} fill={COLOR_GOLD} fontSize={10} fontFamily="monospace" textAnchor="end">Y{years} · {formatCurrency(futureValue)}</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="+10 yrs" value={formatCurrency(ten)} color={COLOR_GOLD} />
        <Metric label="+20 yrs" value={formatCurrency(twenty)} color={COLOR_GOLD} />
        <Metric label="+30 yrs" value={formatCurrency(thirty)} color={COLOR_GOLD} />
        <Metric label="Opportunity Cost" value={formatCurrency(futureValue - principal)} color={COLOR_WARN} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Future value = principal × (1 + return)^years. Default 7% reflects long-run S&P 500 real returns; raise to 15–20% for venture or leveraged business investments. If your proposed spend cannot beat the future-value multiple over the same horizon, it is underperforming the market-neutral alternative.
      </div>
    </div>
  );
}

function InputCell({ label, prefix, value, onChange }: { label: string; prefix?: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ ...panel, padding: 12 }}>
      <label style={{ fontSize: 10, letterSpacing: '.16em', color: COLOR_DIM, display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {prefix && <span style={{ color: COLOR_DIM, fontSize: 14 }}>{prefix}</span>}
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
const inputsGrid: React.CSSProperties = { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 14 };
const inputStyle: React.CSSProperties = { flex: 1, background: 'transparent', border: 'none', borderBottom: `1px solid ${COLOR_BORDER}`, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 18, fontWeight: 600, outline: 'none', padding: '2px 0', minWidth: 0 };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

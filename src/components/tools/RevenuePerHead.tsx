import React, { useEffect, useMemo, useState } from 'react';
import { Users, TrendingUp, Activity } from 'lucide-react';

const STORAGE = 'revenue-per-head-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_GOLD = '#facc15';
const COLOR_DANGER = '#ef4444';
const COLOR_OK = '#4ade80';

interface State {
  currentRevenue: string;
  currentEmployees: string;
  projectedRevenue: string;
  hireSalary: string;
  managementTaxPct: string;
  rampMonths: string;
}
const DEFAULT_STATE: State = {
  currentRevenue: '1200000',
  currentEmployees: '5',
  projectedRevenue: '1600000',
  hireSalary: '95000',
  managementTaxPct: '15',
  rampMonths: '3',
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function RevenuePerHead() {
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

  const curRev = parseNum(state.currentRevenue);
  const curEmp = Math.max(1, parseNum(state.currentEmployees));
  const projRev = parseNum(state.projectedRevenue);
  const salary = parseNum(state.hireSalary);
  const mgmtTax = parseNum(state.managementTaxPct) / 100;
  const ramp = Math.max(0, parseNum(state.rampMonths));

  const { current, projected, delta, verdict, color } = useMemo(() => {
    const curRPH = curRev / curEmp;
    const loadedCost = salary * (1 + mgmtTax);
    // Ramp penalty: fractional year lost to partial productivity
    const rampPenaltyYears = ramp / 12 * 0.5;
    const effectiveAddedValue = projRev - curRev - rampPenaltyYears * loadedCost;
    const projRPH = (curRev + effectiveAddedValue) / (curEmp + 1);
    const d = projRPH - curRPH;
    let v: string;
    let c: string;
    if (d > 0) { v = 'HIRE'; c = COLOR_OK; }
    else if (d > -0.05 * curRPH) { v = 'MARGINAL'; c = COLOR_GOLD; }
    else { v = 'BLOAT'; c = COLOR_DANGER; }
    return { current: curRPH, projected: projRPH, delta: d, verdict: v, color: c };
  }, [curRev, curEmp, projRev, salary, mgmtTax, ramp]);

  // Trend line: RPH at sizes n-2 ... n+2 assuming linear revenue scale at current RPH
  const headSeries = useMemo(() => {
    const out: { heads: number; rph: number }[] = [];
    for (let h = Math.max(1, curEmp - 2); h <= curEmp + 3; h++) {
      let rev: number;
      if (h <= curEmp) rev = (curRev / curEmp) * h;
      else rev = curRev + (projRev - curRev) * (h - curEmp); // linear extension
      out.push({ heads: h, rph: rev / h });
    }
    return out;
  }, [curRev, curEmp, projRev]);

  const W = 560, H = 200, P = 28;
  const yMax = Math.max(...headSeries.map((s) => s.rph)) * 1.08;
  const yMin = Math.min(...headSeries.map((s) => s.rph)) * 0.92;
  const hMin = headSeries[0].heads;
  const hMax = headSeries[headSeries.length - 1].heads;
  const px = (h: number) => P + ((h - hMin) / Math.max(1, hMax - hMin)) * (W - P * 2);
  const py = (v: number) => H - P - ((v - yMin) / Math.max(1, yMax - yMin)) * (H - P * 2);
  const line = headSeries.map((s) => `${px(s.heads)},${py(s.rph)}`).join(' ');

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>REVENUE_PER_HEAD</div>
            <div style={subtitle}>Does the next hire raise profit-per-employee or add bloat?</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Current Revenue / Yr" prefix="$" value={state.currentRevenue} onChange={(v) => setState((s) => ({ ...s, currentRevenue: v }))} />
        <InputCell label="Current Employees" value={state.currentEmployees} onChange={(v) => setState((s) => ({ ...s, currentEmployees: v }))} />
        <InputCell label="Projected Revenue / Yr" prefix="$" value={state.projectedRevenue} onChange={(v) => setState((s) => ({ ...s, projectedRevenue: v }))} />
        <InputCell label="Hire Salary / Yr" prefix="$" value={state.hireSalary} onChange={(v) => setState((s) => ({ ...s, hireSalary: v }))} />
        <InputCell label="Management Tax %" value={state.managementTaxPct} onChange={(v) => setState((s) => ({ ...s, managementTaxPct: v }))} />
        <InputCell label="Ramp-Up Months" value={state.rampMonths} onChange={(v) => setState((s) => ({ ...s, rampMonths: v }))} />
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: color }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>VERDICT</div>
        <div style={{ fontSize: 36, fontWeight: 800, color, letterSpacing: '.02em' }}>{verdict}</div>
        <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>
          RPH {delta >= 0 ? 'rises' : 'falls'} by <span style={{ color, fontWeight: 700 }}>{formatCurrency(Math.abs(delta))}</span> per head after the hire.
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 8 }}>RPH vs HEADCOUNT</div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          <polyline points={line} fill="none" stroke={COLOR_CYAN} strokeWidth={2} />
          {headSeries.map((s) => (
            <circle key={s.heads} cx={px(s.heads)} cy={py(s.rph)} r={s.heads === curEmp ? 6 : 3}
              fill={s.heads === curEmp ? COLOR_GOLD : s.heads === curEmp + 1 ? color : COLOR_CYAN} />
          ))}
          {headSeries.map((s) => (
            <text key={`lbl${s.heads}`} x={px(s.heads)} y={H - 8} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="middle">{s.heads}</text>
          ))}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Current RPH" value={formatCurrency(current)} color={COLOR_GOLD} />
        <Metric label="Projected RPH" value={formatCurrency(projected)} color={color} />
        <Metric label="Loaded Cost" value={formatCurrency(salary * (1 + mgmtTax))} color={COLOR_TEXT} />
        <Metric label="Ramp Penalty" value={formatCurrency((ramp / 12 * 0.5) * salary * (1 + mgmtTax))} color={COLOR_DANGER} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        RPH = revenue ÷ employees. Loaded cost = salary × (1 + management tax %). Ramp penalty assumes 50% productivity during the ramp window. A hire that raises RPH is real leverage; one that falls under 5% below current RPH is margin bloat unless load or specialization justifies it.
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
void TrendingUp;

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputsGrid: React.CSSProperties = { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 14 };
const inputStyle: React.CSSProperties = { flex: 1, background: 'transparent', border: 'none', borderBottom: `1px solid ${COLOR_BORDER}`, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 18, fontWeight: 600, outline: 'none', padding: '2px 0', minWidth: 0 };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

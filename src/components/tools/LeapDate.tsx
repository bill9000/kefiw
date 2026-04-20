import React, { useEffect, useMemo, useState } from 'react';
import { Rocket, TrendingUp } from 'lucide-react';

const STORAGE = 'leap-date-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_SALARY = '#f472b6';
const COLOR_HUSTLE = '#22d3ee';
const COLOR_LEAP = '#facc15';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';

interface State {
  netSalary: string;
  benefitsValue: string;
  hustleCurrent: string;
  hustleExpenses: string;
  hustleGrowth: string;
  safetyMultiplier: string;
  useSafety: boolean;
}

const DEFAULT_STATE: State = {
  netSalary: '6500',
  benefitsValue: '800',
  hustleCurrent: '2200',
  hustleExpenses: '300',
  hustleGrowth: '6',
  safetyMultiplier: '1.25',
  useSafety: true,
};

const SELF_EMPLOYMENT_TAX = 0.25;
const MAX_MONTHS = 120;

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
function monthsToDate(months: number): string {
  if (!Number.isFinite(months) || months <= 0) return '—';
  const d = new Date();
  d.setMonth(d.getMonth() + Math.floor(months));
  d.setDate(d.getDate() + Math.round((months - Math.floor(months)) * 30));
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

interface Step { month: number; salary: number; hustle: number; }

export default function LeapDate() {
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

  const netSalary = parseNum(state.netSalary);
  const benefits = parseNum(state.benefitsValue);
  const hustleCurrent = parseNum(state.hustleCurrent);
  const hustleExpenses = parseNum(state.hustleExpenses);
  const growthPct = parseNum(state.hustleGrowth) / 100;
  const safetyMul = Math.max(1, parseNum(state.safetyMultiplier));

  const totalComp = netSalary + benefits;
  const target = state.useSafety ? totalComp * safetyMul : totalComp;

  const { steps, leapMonth } = useMemo(() => {
    const out: Step[] = [];
    const monthlyGrowth = Math.pow(1 + growthPct, 1 / 12);
    let rev = hustleCurrent;
    let leap: number | null = null;
    for (let m = 0; m <= MAX_MONTHS; m++) {
      const net = (rev - hustleExpenses) * (1 - SELF_EMPLOYMENT_TAX);
      out.push({ month: m, salary: totalComp, hustle: net });
      if (leap === null && net >= target) leap = m;
      rev *= monthlyGrowth;
    }
    return { steps: out, leapMonth: leap };
  }, [hustleCurrent, hustleExpenses, growthPct, totalComp, target]);

  // Chart geometry
  const W = 560, H = 200, P = 24;
  const yMax = Math.max(...steps.map((s) => Math.max(s.salary, s.hustle, target))) * 1.1 || 1;
  const px = (m: number) => P + (m / MAX_MONTHS) * (W - P * 2);
  const py = (v: number) => H - P - (v / yMax) * (H - P * 2);
  const salaryLine = steps.map((s) => `${px(s.month)},${py(s.salary)}`).join(' ');
  const hustleLine = steps.map((s) => `${px(s.month)},${py(s.hustle)}`).join(' ');
  const targetLine = `${P},${py(target)} ${W - P},${py(target)}`;

  const todayHustleNet = (hustleCurrent - hustleExpenses) * (1 - SELF_EMPLOYMENT_TAX);
  const gapToTarget = target - todayHustleNet;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Rocket size={22} color={COLOR_LEAP} />
          <div>
            <div style={title}>THE_LEAP</div>
            <div style={subtitle}>Side-hustle to full-time — exact date of sustainable replacement</div>
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: COLOR_DIM, cursor: 'pointer' }}>
          <input type="checkbox" checked={state.useSafety} onChange={(e) => setState((s) => ({ ...s, useSafety: e.target.checked }))} />
          SAFETY_BUFFER
        </label>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Net Salary / Month" prefix="$" value={state.netSalary} onChange={(v) => setState((s) => ({ ...s, netSalary: v }))} />
        <InputCell label="Benefits Value / Month" prefix="$" value={state.benefitsValue} onChange={(v) => setState((s) => ({ ...s, benefitsValue: v }))} />
        <InputCell label="Hustle Revenue Now" prefix="$" value={state.hustleCurrent} onChange={(v) => setState((s) => ({ ...s, hustleCurrent: v }))} />
        <InputCell label="Hustle Expenses / Month" prefix="$" value={state.hustleExpenses} onChange={(v) => setState((s) => ({ ...s, hustleExpenses: v }))} />
        <InputCell label="Annual Growth %" value={state.hustleGrowth} onChange={(v) => setState((s) => ({ ...s, hustleGrowth: v }))} />
        {state.useSafety && <InputCell label="Safety Multiplier" value={state.safetyMultiplier} onChange={(v) => setState((s) => ({ ...s, safetyMultiplier: v }))} />}
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>LEAP TRAJECTORY</span>
          <div style={{ display: 'flex', gap: 14, fontSize: 10, color: COLOR_DIM }}>
            <span><span style={{ color: COLOR_SALARY }}>—</span> Current Total Comp</span>
            <span><span style={{ color: COLOR_HUSTLE }}>—</span> Hustle Net After Tax</span>
            {state.useSafety && <span><span style={{ color: COLOR_LEAP }}>- -</span> Safety Target</span>}
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          <polyline points={salaryLine} fill="none" stroke={COLOR_SALARY} strokeWidth={2} />
          <polyline points={hustleLine} fill="none" stroke={COLOR_HUSTLE} strokeWidth={2} />
          {state.useSafety && <polyline points={targetLine} fill="none" stroke={COLOR_LEAP} strokeWidth={1} strokeDasharray="4 4" />}
          {leapMonth !== null && (
            <>
              <line x1={px(leapMonth)} y1={P} x2={px(leapMonth)} y2={H - P} stroke={COLOR_LEAP} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(leapMonth)} cy={py(steps[leapMonth].hustle)} r={5} fill={COLOR_LEAP} />
              <text x={px(leapMonth) + 6} y={P + 10} fill={COLOR_LEAP} fontSize={10} fontFamily="monospace">LEAP</text>
            </>
          )}
        </svg>
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: leapMonth !== null ? COLOR_LEAP : COLOR_WARN }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>LEAP DATE</div>
        {leapMonth !== null ? (
          <>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: COLOR_LEAP }}>{monthsToDate(leapMonth)}</span>
              <span style={{ fontSize: 14, color: COLOR_DIM }}>({leapMonth} mo from now)</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: COLOR_DIM, lineHeight: 1.5 }}>
              At {Math.round(growthPct * 100)}%/yr growth, hustle net clears {formatCurrency(target)}/mo — {state.useSafety ? `${safetyMul.toFixed(2)}× your current total comp` : 'matching your current total comp'}.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLOR_WARN }}>No Leap Within {Math.floor(MAX_MONTHS / 12)} Years</div>
            <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>Current gap: <span style={{ color: COLOR_DANGER }}>{formatCurrency(gapToTarget)}/mo</span>. Raise revenue, cut expenses, or accelerate growth.</div>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Total Comp Target" value={formatCurrency(target)} color={COLOR_SALARY} />
        <Metric label="Hustle Net Today" value={formatCurrency(todayHustleNet)} color={COLOR_HUSTLE} />
        <Metric label="Monthly Gap" value={gapToTarget > 0 ? formatCurrency(gapToTarget) : 'CLEARED'} color={gapToTarget > 0 ? COLOR_WARN : COLOR_LEAP} />
        <Metric label="SE Tax Drag" value={formatCurrency((hustleCurrent - hustleExpenses) * SELF_EMPLOYMENT_TAX)} color={COLOR_DANGER} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Hustle net = (Revenue − Expenses) × 0.75 (25% self-employment tax reserve). Total comp target = Net Salary + Benefits Value, multiplied by the safety buffer when enabled. The Leap Date is the first month hustle net clears that target, compounding monthly at the annual growth rate.
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
        <TrendingUp size={12} color={color} />{label}
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

import React, { useEffect, useMemo, useState } from 'react';
import { Cloud, Server, Activity } from 'lucide-react';

const STORAGE = 'cloud-exit-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CLOUD = '#f472b6';
const COLOR_SELF = '#22d3ee';
const COLOR_CROSS = '#facc15';
const COLOR_WARN = '#f59e0b';

interface State {
  cloudMonthly: string;
  dataEgress: string;
  hardwareCost: string;
  depreciationMonths: string;
  electricityMonthly: string;
  maintHoursMonthly: string;
  ownerRate: string;
  uptimeRiskPct: string;
}

const DEFAULT_STATE: State = {
  cloudMonthly: '2000',
  dataEgress: '250',
  hardwareCost: '8000',
  depreciationMonths: '36',
  electricityMonthly: '70',
  maintHoursMonthly: '3',
  ownerRate: '125',
  uptimeRiskPct: '3',
};

const MAX_MONTHS = 60;

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

interface Step { month: number; cloud: number; self: number; }

export default function CloudExit() {
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

  const cloudMonthly = parseNum(state.cloudMonthly) + parseNum(state.dataEgress);
  const hwCost = parseNum(state.hardwareCost);
  const depMonths = Math.max(1, parseNum(state.depreciationMonths));
  const electricity = parseNum(state.electricityMonthly);
  const maintHours = parseNum(state.maintHoursMonthly);
  const ownerRate = parseNum(state.ownerRate);
  const uptimeRisk = parseNum(state.uptimeRiskPct) / 100;

  const selfMonthlyBase = hwCost / depMonths + electricity + maintHours * ownerRate;
  const selfMonthlyWithRisk = selfMonthlyBase + cloudMonthly * uptimeRisk;

  const { steps, crossoverMonth } = useMemo(() => {
    const out: Step[] = [];
    let cross: number | null = null;
    let cloudCum = 0;
    let selfCum = hwCost; // upfront purchase
    for (let m = 0; m <= MAX_MONTHS; m++) {
      if (m > 0) {
        cloudCum += cloudMonthly;
        selfCum += electricity + maintHours * ownerRate + cloudMonthly * uptimeRisk;
      }
      out.push({ month: m, cloud: cloudCum, self: selfCum });
      if (cross === null && m > 0 && cloudCum >= selfCum) cross = m;
    }
    return { steps: out, crossoverMonth: cross };
  }, [cloudMonthly, hwCost, electricity, maintHours, ownerRate, uptimeRisk]);

  const W = 560, H = 200, P = 24;
  const yMax = Math.max(...steps.map((s) => Math.max(s.cloud, s.self))) * 1.08 || 1;
  const px = (m: number) => P + (m / MAX_MONTHS) * (W - P * 2);
  const py = (v: number) => H - P - (v / yMax) * (H - P * 2);
  const cloudLine = steps.map((s) => `${px(s.month)},${py(s.cloud)}`).join(' ');
  const selfLine = steps.map((s) => `${px(s.month)},${py(s.self)}`).join(' ');

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Cloud size={22} color={COLOR_CLOUD} />
          <span style={{ color: COLOR_DIM }}>/</span>
          <Server size={22} color={COLOR_SELF} />
          <div>
            <div style={title}>CLOUD_EXIT</div>
            <div style={subtitle}>Managed vs self-hosted — crossover month for running your own rack</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Cloud Monthly" prefix="$" value={state.cloudMonthly} onChange={(v) => setState((s) => ({ ...s, cloudMonthly: v }))} />
        <InputCell label="Data Egress / Month" prefix="$" value={state.dataEgress} onChange={(v) => setState((s) => ({ ...s, dataEgress: v }))} />
        <InputCell label="Hardware One-Time" prefix="$" value={state.hardwareCost} onChange={(v) => setState((s) => ({ ...s, hardwareCost: v }))} />
        <InputCell label="Depreciation Months" value={state.depreciationMonths} onChange={(v) => setState((s) => ({ ...s, depreciationMonths: v }))} />
        <InputCell label="Electricity / Month" prefix="$" value={state.electricityMonthly} onChange={(v) => setState((s) => ({ ...s, electricityMonthly: v }))} />
        <InputCell label="Maint Hours / Month" value={state.maintHoursMonthly} onChange={(v) => setState((s) => ({ ...s, maintHoursMonthly: v }))} />
        <InputCell label="Your Hourly Rate" prefix="$" value={state.ownerRate} onChange={(v) => setState((s) => ({ ...s, ownerRate: v }))} />
        <InputCell label="Uptime Risk %" value={state.uptimeRiskPct} onChange={(v) => setState((s) => ({ ...s, uptimeRiskPct: v }))} />
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, color: COLOR_DIM }}>
          <span style={{ letterSpacing: '.16em' }}>CUMULATIVE COST — {MAX_MONTHS} MONTHS</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <span><span style={{ color: COLOR_CLOUD }}>—</span> Cloud</span>
            <span><span style={{ color: COLOR_SELF }}>—</span> Self-Hosted</span>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          <polyline points={cloudLine} fill="none" stroke={COLOR_CLOUD} strokeWidth={2} />
          <polyline points={selfLine} fill="none" stroke={COLOR_SELF} strokeWidth={2} />
          {crossoverMonth !== null && (
            <>
              <line x1={px(crossoverMonth)} y1={P} x2={px(crossoverMonth)} y2={H - P} stroke={COLOR_CROSS} strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={px(crossoverMonth)} cy={py(steps[crossoverMonth].cloud)} r={5} fill={COLOR_CROSS} />
              <text x={px(crossoverMonth) + 6} y={P + 10} fill={COLOR_CROSS} fontSize={10} fontFamily="monospace">CROSSOVER</text>
            </>
          )}
        </svg>
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: crossoverMonth !== null ? COLOR_CROSS : COLOR_WARN }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>VERDICT</div>
        {crossoverMonth !== null ? (
          <>
            <div style={{ fontSize: 32, fontWeight: 800, color: COLOR_CROSS }}>Month {crossoverMonth} — Self-Host Wins</div>
            <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>
              Past {crossoverMonth === 12 ? 'a year' : `${crossoverMonth} months`}, cumulative cloud cost overtakes the rack + running expenses.
              Monthly delta after break-even: <span style={{ color: COLOR_SELF, fontWeight: 700 }}>{formatCurrency(cloudMonthly - selfMonthlyWithRisk)}</span>.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 24, fontWeight: 800, color: COLOR_WARN }}>Stay on Cloud</div>
            <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>Self-hosted never catches up in {MAX_MONTHS} months — uptime risk or maintenance hours dominate.</div>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Cloud / Month" value={formatCurrency(cloudMonthly)} color={COLOR_CLOUD} />
        <Metric label="Self / Month (run rate)" value={formatCurrency(selfMonthlyWithRisk)} color={COLOR_SELF} />
        <Metric label="HW Amortized" value={formatCurrency(hwCost / depMonths)} color={COLOR_TEXT} />
        <Metric label="Uptime Risk Cost" value={formatCurrency(cloudMonthly * uptimeRisk)} color={COLOR_WARN} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Self-hosted monthly = (hardware ÷ depreciation months) + electricity + (maint hours × your rate) + (cloud × uptime risk %). Cumulative cost includes hardware upfront at month 0. Data egress is added to cloud monthly — often the silent killer on streaming or ML workloads. Uptime risk captures the expected downtime cost of self-hosting as a fraction of what cloud buys you.
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

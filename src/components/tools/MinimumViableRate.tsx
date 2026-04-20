import React, { useEffect, useMemo, useState } from 'react';
import { Briefcase, Activity, AlertTriangle } from 'lucide-react';
import { writeField } from '~/lib/session-context';

const STORAGE = 'minimum-viable-rate-v1';
const PIPELINE_RATE_KEY = 'target_hourly_rate';
const PIPELINE_NEED_KEY = 'target_monthly_need';
const PIPELINE_SOURCE = 'minimum-viable-rate';
const PIPELINE_LABEL = 'Minimum Viable Rate';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_LIVING = '#f59e0b';
const COLOR_TARGET = '#4ade80';
const COLOR_DANGER = '#ef4444';

interface State {
  targetSalary: string;
  benefitsValue: string;
  businessOverhead: string;
  billableWeeks: string;
  billableHoursPerWeek: string;
  utilizationPct: string;
  livingWageAnnual: string;
}
const DEFAULT_STATE: State = {
  targetSalary: '120000',
  benefitsValue: '18000',
  businessOverhead: '9000',
  billableWeeks: '47',
  billableHoursPerWeek: '40',
  utilizationPct: '60',
  livingWageAnnual: '55000',
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function MinimumViableRate() {
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

  const salary = parseNum(state.targetSalary);
  const benefits = parseNum(state.benefitsValue);
  const overhead = parseNum(state.businessOverhead);
  const weeks = parseNum(state.billableWeeks);
  const hoursPerWeek = parseNum(state.billableHoursPerWeek);
  const utilization = parseNum(state.utilizationPct) / 100;
  const living = parseNum(state.livingWageAnnual);

  const { targetRate, livingRate, effectiveHours } = useMemo(() => {
    const totalNeed = salary + benefits + overhead;
    const effHours = Math.max(1, weeks * hoursPerWeek * utilization);
    return {
      targetRate: totalNeed / effHours,
      livingRate: (living * 1.25) / effHours, // +25% for SE tax + benefits approximation
      effectiveHours: effHours,
    };
  }, [salary, benefits, overhead, weeks, hoursPerWeek, utilization, living]);

  useEffect(() => {
    if (!hydrated) return;
    writeField(PIPELINE_RATE_KEY, targetRate, PIPELINE_SOURCE, PIPELINE_LABEL);
    const monthlyNeed = (salary + benefits + overhead) / 12;
    writeField(PIPELINE_NEED_KEY, monthlyNeed, PIPELINE_SOURCE, PIPELINE_LABEL);
  }, [targetRate, salary, benefits, overhead, hydrated]);

  const max = Math.max(targetRate, livingRate, 1);
  const targetPct = (targetRate / max) * 100;
  const livingPct = (livingRate / max) * 100;

  const underpricedWarning = targetRate < livingRate;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Briefcase size={22} color={COLOR_TARGET} />
          <div>
            <div style={title}>MINIMUM_VIABLE_RATE</div>
            <div style={subtitle}>Freelancer reality check — rate that matches a corporate salary after invisible costs</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Target Annual Salary" prefix="$" value={state.targetSalary} onChange={(v) => setState((s) => ({ ...s, targetSalary: v }))} />
        <InputCell label="Benefits Value / Year" prefix="$" value={state.benefitsValue} onChange={(v) => setState((s) => ({ ...s, benefitsValue: v }))} />
        <InputCell label="Business Overhead / Year" prefix="$" value={state.businessOverhead} onChange={(v) => setState((s) => ({ ...s, businessOverhead: v }))} />
        <InputCell label="Billable Weeks / Year" value={state.billableWeeks} onChange={(v) => setState((s) => ({ ...s, billableWeeks: v }))} />
        <InputCell label="Hours / Week" value={state.billableHoursPerWeek} onChange={(v) => setState((s) => ({ ...s, billableHoursPerWeek: v }))} />
        <InputCell label="Utilization %" value={state.utilizationPct} onChange={(v) => setState((s) => ({ ...s, utilizationPct: v }))} />
        <InputCell label="Living Wage / Year" prefix="$" value={state.livingWageAnnual} onChange={(v) => setState((s) => ({ ...s, livingWageAnnual: v }))} />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, borderColor: COLOR_TARGET, boxShadow: `0 0 24px ${COLOR_TARGET}22` }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>MINIMUM VIABLE RATE</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: COLOR_TARGET, letterSpacing: '.02em' }}>
          {formatCurrency(targetRate)}<span style={{ fontSize: 20, color: COLOR_DIM, fontWeight: 600 }}>/hr</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>
          Based on {Math.round(effectiveHours)} effective billable hours/year ({Math.round(utilization * 100)}% utilization).
        </div>
        {underpricedWarning && (
          <div style={{ marginTop: 10, padding: '8px 12px', border: `1px solid ${COLOR_DANGER}`, borderRadius: 6, background: 'rgba(239,68,68,0.08)', color: COLOR_DANGER, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} /> Your target undercuts the living-wage rate — add overhead or raise the salary.
          </div>
        )}
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>WAGE COMPARISON</div>
        <BarRow label="Living Rate" value={livingRate} pct={livingPct} color={COLOR_LIVING} />
        <div style={{ height: 10 }} />
        <BarRow label="Target Rate" value={targetRate} pct={targetPct} color={COLOR_TARGET} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Annual Need" value={formatCurrency(salary + benefits + overhead)} color={COLOR_TARGET} />
        <Metric label="Eff. Billable Hours" value={`${Math.round(effectiveHours)}/yr`} color={COLOR_TEXT} />
        <Metric label="Living Rate" value={`${formatCurrency(livingRate)}/hr`} color={COLOR_LIVING} />
        <Metric label="Overhead Share" value={salary > 0 ? `${Math.round(((benefits + overhead) / (salary + benefits + overhead)) * 100)}%` : '—'} color={COLOR_DIM} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        MVR = (salary + benefits + overhead) ÷ (weeks × hours × utilization). Utilization captures non-billable time (admin, sales, sick days) — at 60%, 40 weekly hours becomes 24 billable. Benefits value should reflect health insurance, 401k, paid time off. Overhead covers tools, accounting, equipment.
      </div>
    </div>
  );
}

function BarRow({ label, value, pct, color }: { label: string; value: number; pct: number; color: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: COLOR_TEXT, letterSpacing: '.12em', fontWeight: 700 }}>{label}</span>
        <span style={{ color }}>{formatCurrency(value)}/hr</span>
      </div>
      <div style={{ height: 18, background: COLOR_BORDER, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 240ms ease' }} />
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

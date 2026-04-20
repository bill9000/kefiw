import React, { useEffect, useMemo, useState } from 'react';
import { Shield, AlertTriangle, Activity } from 'lucide-react';

const STORAGE = 'shock-survival-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_OK = '#4ade80';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';

interface State {
  savings: string;
  payment: string;
  shock: string;
}

const DEFAULT_STATE: State = { savings: '18000', payment: '1400', shock: '3500' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function statusFor(months: number): { color: string; label: string } {
  if (months <= 0) return { color: COLOR_DANGER, label: 'UNDERWATER' };
  if (months < 3) return { color: COLOR_DANGER, label: 'CRITICAL' };
  if (months < 6) return { color: COLOR_WARN, label: 'GUARDED' };
  if (months < 12) return { color: COLOR_OK, label: 'STABLE' };
  return { color: COLOR_OK, label: 'FORTIFIED' };
}

export default function ShockSurvival() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setState({ ...DEFAULT_STATE, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE, JSON.stringify(state));
  }, [state, hydrated]);

  const savings = parseNum(state.savings);
  const payment = parseNum(state.payment);
  const shock = parseNum(state.shock);

  const { months, remaining, status } = useMemo(() => {
    const rem = savings - shock;
    if (payment <= 0) return { months: Infinity, remaining: rem, status: statusFor(Infinity) };
    const m = rem / payment;
    return { months: m, remaining: rem, status: statusFor(m) };
  }, [savings, payment, shock]);

  const display = Number.isFinite(months) ? Math.max(months, 0) : 0;
  const gaugePct = Math.min(Math.max(display / 12, 0), 1);
  const isCritical = months < 3;

  // Gauge arc
  const R = 72;
  const CX = 96, CY = 96;
  const START_A = Math.PI * 0.85;
  const END_A = Math.PI * 2.15;
  const totalA = END_A - START_A;
  const polarX = (a: number) => CX + R * Math.cos(a);
  const polarY = (a: number) => CY + R * Math.sin(a);
  const endA = START_A + totalA * gaugePct;
  const arcStart = `${polarX(START_A)},${polarY(START_A)}`;
  const arcEndBg = `${polarX(END_A)},${polarY(END_A)}`;
  const arcEndFg = `${polarX(endA)},${polarY(endA)}`;
  const sweepBg = `M ${arcStart} A ${R} ${R} 0 1 1 ${arcEndBg}`;
  const sweepFg = `M ${arcStart} A ${R} ${R} 0 ${gaugePct > 0.5 ? 1 : 0} 1 ${arcEndFg}`;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={22} color={COLOR_OK} />
          <div>
            <div style={title}>SHOCK_SURVIVAL</div>
            <div style={subtitle}>Loan buffer — months debt service holds after a shock expense</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Total Savings" prefix="$" value={state.savings} onChange={(v) => setState((s) => ({ ...s, savings: v }))} />
        <InputCell label="Monthly Loan Payment" prefix="$" value={state.payment} onChange={(v) => setState((s) => ({ ...s, payment: v }))} />
        <InputCell label="Shock Expense" prefix="$" value={state.shock} onChange={(v) => setState((s) => ({ ...s, shock: v }))} />
      </div>

      {/* Hero — Survival Months + Gauge */}
      <div style={{ ...panel, padding: 20, borderColor: status.color, boxShadow: `0 0 24px ${status.color}22`, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          <svg viewBox="0 0 192 192" style={{ width: 160, height: 160, flexShrink: 0 }}>
            <path d={sweepBg} fill="none" stroke={COLOR_BORDER} strokeWidth={10} strokeLinecap="round" />
            {display > 0 && (
              <path d={sweepFg} fill="none" stroke={status.color} strokeWidth={10} strokeLinecap="round" />
            )}
            {[0, 3, 6, 9, 12].map((tick) => {
              const a = START_A + totalA * (tick / 12);
              const x1 = CX + (R - 14) * Math.cos(a);
              const y1 = CY + (R - 14) * Math.sin(a);
              const x2 = CX + (R + 2) * Math.cos(a);
              const y2 = CY + (R + 2) * Math.sin(a);
              return <line key={tick} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR_DIM} strokeWidth={1} />;
            })}
            <text x={CX} y={CY - 2} fill={COLOR_TEXT} fontSize={34} fontFamily="monospace" fontWeight={700} textAnchor="middle">
              {display === Infinity ? '∞' : display.toFixed(1)}
            </text>
            <text x={CX} y={CY + 18} fill={COLOR_DIM} fontSize={10} fontFamily="monospace" letterSpacing="2" textAnchor="middle">MONTHS</text>
            <text x={CX - R - 4} y={CY + 34} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">0</text>
            <text x={CX + R + 4} y={CY + 34} fill={COLOR_DIM} fontSize={9} fontFamily="monospace">12+</text>
          </svg>

          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 4 }}>SURVIVAL WINDOW</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: status.color, letterSpacing: '.02em' }}>{status.label}</div>
            {isCritical && (
              <div style={{ marginTop: 10, padding: '8px 12px', border: `1px solid ${COLOR_DANGER}`, borderRadius: 6, background: 'rgba(239,68,68,0.08)', color: COLOR_DANGER, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} />
                <span>Under 3 months of buffer — high default risk.</span>
              </div>
            )}
            <div style={{ marginTop: 12, fontSize: 12, color: COLOR_DIM, lineHeight: 1.5 }}>
              After the shock you retain <span style={{ color: COLOR_TEXT, fontWeight: 700 }}>{formatCurrency(Math.max(remaining, 0))}</span>
              {remaining < 0 && <span style={{ color: COLOR_DANGER }}> (deficit of {formatCurrency(Math.abs(remaining))})</span>}.
              {payment > 0 && remaining > 0 && (
                <> Covers {display.toFixed(1)} months of the {formatCurrency(payment)} payment.</>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        <Metric label="Post-Shock" value={formatCurrency(Math.max(remaining, 0))} color={remaining < 0 ? COLOR_DANGER : COLOR_TEXT} />
        <Metric label="Annual Debt Service" value={formatCurrency(payment * 12)} color={COLOR_WARN} />
        <Metric label="Shock vs Savings" value={savings > 0 ? `${Math.round((shock / savings) * 100)}%` : '—'} color={COLOR_DANGER} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Survival = (Savings − Shock) ÷ Monthly Loan Payment. Captures the number of months fixed debt holds after a one-time unexpected expense. Under 3 months triggers a critical warning state. Inputs persist locally.
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
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${COLOR_BORDER}`,
            color: COLOR_TEXT,
            fontFamily: 'inherit',
            fontSize: 18,
            fontWeight: 600,
            outline: 'none',
            padding: '2px 0',
            minWidth: 0,
          }}
        />
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
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Flame, TrendingDown, Zap, Radio } from 'lucide-react';
import { useSessionField } from '~/lib/use-session-field';
import { writeMetric, writeFlag } from '~/lib/kfw-bridge';

const STORAGE = 'runway-zero-v1';
const PIPELINE_KEY_SAVINGS = 'monthly_savings_recoverable';
const PIPELINE_KEY_GIG = 'side_hustle_monthly_net';
const PIPELINE_KEY_RELOCATION = 'relocation_monthly_gain';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_ACCENT = '#22d3ee';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';
const COLOR_OK = '#4ade80';

interface State {
  cash: string;
  burn: string;
  revenue: string;
  crisis: boolean;
}

const DEFAULT_STATE: State = { cash: '250000', burn: '65000', revenue: '22000', crisis: false };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function monthsToDate(months: number): string {
  if (!Number.isFinite(months) || months < 0) return '—';
  const d = new Date();
  const whole = Math.floor(months);
  const frac = months - whole;
  d.setMonth(d.getMonth() + whole);
  d.setDate(d.getDate() + Math.round(frac * 30));
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function monthsToCountdown(months: number): { m: number; d: number } {
  if (!Number.isFinite(months) || months < 0) return { m: 0, d: 0 };
  const m = Math.floor(months);
  const d = Math.round((months - m) * 30);
  return { m, d };
}

interface RunwayZeroProps {
  namespace?: string;
  burnMultiplier?: number;
  revenueMultiplier?: number;
}

export default function RunwayZero({
  namespace,
  burnMultiplier = 1,
  revenueMultiplier = 1,
}: RunwayZeroProps = {}) {
  const storageKey = namespace ? `${STORAGE}__${namespace}` : STORAGE;
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw);
        setState({ ...DEFAULT_STATE, ...s });
      }
    } catch {}
    setHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, hydrated, storageKey]);

  const pipelineSavings = useSessionField(PIPELINE_KEY_SAVINGS);
  const pipelineGig = useSessionField(PIPELINE_KEY_GIG);
  const pipelineRelocation = useSessionField(PIPELINE_KEY_RELOCATION);
  const pipelineBoost =
    (pipelineSavings?.value ?? 0) +
    (pipelineGig?.value ?? 0) +
    Math.max(0, pipelineRelocation?.value ?? 0);

  const cash = parseNum(state.cash);
  const burn = parseNum(state.burn) * burnMultiplier;
  const rawRev = state.crisis ? 0 : parseNum(state.revenue) * revenueMultiplier;
  const rev = state.crisis ? 0 : rawRev + pipelineBoost;
  const netBurn = burn - rev;
  const multiplierActive = burnMultiplier !== 1 || revenueMultiplier !== 1;

  const result = useMemo(() => {
    if (cash <= 0) return { kind: 'zero' as const };
    if (netBurn <= 0) return { kind: 'profitable' as const };
    const months = cash / netBurn;
    return { kind: 'burning' as const, months };
  }, [cash, netBurn]);

  useEffect(() => {
    if (!hydrated) return;
    if (result.kind === 'burning') {
      writeMetric('runway_months', Number(result.months.toFixed(2)));
      writeFlag('critical_runway', result.months < 3);
    } else if (result.kind === 'profitable') {
      writeMetric('runway_months', 999);
      writeFlag('critical_runway', false);
    } else {
      writeMetric('runway_months', 0);
      writeFlag('critical_runway', true);
    }
  }, [result, hydrated]);

  const chartPoints = useMemo(() => {
    const horizon = result.kind === 'burning' ? Math.max(result.months * 1.15, 3) : 24;
    const steps = 48;
    const pts: { t: number; v: number }[] = [];
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * horizon;
      const v = Math.max(0, cash - netBurn * t);
      pts.push({ t, v });
    }
    return { pts, horizon, maxV: cash };
  }, [cash, netBurn, result]);

  const W = 520, H = 180, PAD = 28;
  const { pts, horizon, maxV } = chartPoints;
  const xScale = (t: number) => PAD + (t / horizon) * (W - 2 * PAD);
  const yScale = (v: number) => H - PAD - (v / Math.max(maxV, 1)) * (H - 2 * PAD);
  const polyPts = pts.map((p) => `${xScale(p.t).toFixed(1)},${yScale(p.v).toFixed(1)}`).join(' ');
  const zeroCrossT = result.kind === 'burning' ? result.months : null;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Flame size={22} color={COLOR_DANGER} />
          <div>
            <div style={title}>RUNWAY_ZERO</div>
            <div style={subtitle}>Cash exhaustion forecast — months until bankrupt</div>
          </div>
        </div>
        <button
          onClick={() => setState((s) => ({ ...s, crisis: !s.crisis }))}
          style={{
            ...crisisBtn,
            borderColor: state.crisis ? COLOR_DANGER : COLOR_BORDER,
            color: state.crisis ? COLOR_DANGER : COLOR_DIM,
            background: state.crisis ? 'rgba(239,68,68,0.08)' : 'transparent',
          }}
        >
          <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
          CRISIS {state.crisis ? 'ON' : 'OFF'}
        </button>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Cash Balance" prefix="$" value={state.cash} onChange={(v) => setState((s) => ({ ...s, cash: v }))} />
        <InputCell label="Monthly Burn" prefix="$" value={state.burn} onChange={(v) => setState((s) => ({ ...s, burn: v }))} />
        <InputCell
          label={pipelineBoost > 0 ? 'Monthly Revenue (base)' : 'Monthly Revenue'}
          prefix="$"
          value={state.revenue}
          onChange={(v) => setState((s) => ({ ...s, revenue: v }))}
          disabled={state.crisis}
        />
      </div>

      {multiplierActive && (
        <div
          style={{
            ...panel,
            padding: 10,
            marginBottom: 10,
            borderColor: COLOR_WARN,
            background: 'rgba(245,158,11,0.05)',
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            fontSize: 11,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: COLOR_WARN,
          }}
        >
          <span>Stress multipliers active</span>
          {burnMultiplier !== 1 && <span>burn × {burnMultiplier.toFixed(2)}</span>}
          {revenueMultiplier !== 1 && <span>revenue × {revenueMultiplier.toFixed(2)}</span>}
        </div>
      )}

      {pipelineBoost > 0 && !state.crisis && (
        <div
          style={{
            ...panel,
            padding: 12,
            marginBottom: 14,
            borderColor: COLOR_ACCENT,
            background: 'rgba(34, 211, 238, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Radio size={12} color={COLOR_ACCENT} />
            <span style={{ fontSize: 10, letterSpacing: '.18em', color: COLOR_DIM, textTransform: 'uppercase' }}>
              Pipeline Boost · Live Variables
            </span>
          </div>
          <div style={{ display: 'grid', gap: 4 }}>
            {pipelineSavings && pipelineSavings.value > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLOR_TEXT }}>
                <span style={{ color: COLOR_DIM }}>from {pipelineSavings.sourceLabel}</span>
                <span style={{ color: COLOR_ACCENT, fontWeight: 700 }}>+{formatCurrency(pipelineSavings.value)}/mo</span>
              </div>
            )}
            {pipelineGig && pipelineGig.value > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLOR_TEXT }}>
                <span style={{ color: COLOR_DIM }}>from {pipelineGig.sourceLabel}</span>
                <span style={{ color: COLOR_ACCENT, fontWeight: 700 }}>+{formatCurrency(pipelineGig.value)}/mo</span>
              </div>
            )}
            {pipelineRelocation && pipelineRelocation.value > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLOR_TEXT }}>
                <span style={{ color: COLOR_DIM }}>from {pipelineRelocation.sourceLabel}</span>
                <span style={{ color: COLOR_ACCENT, fontWeight: 700 }}>+{formatCurrency(pipelineRelocation.value)}/mo</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: COLOR_TEXT, borderTop: `1px dashed ${COLOR_BORDER}`, paddingTop: 4, marginTop: 2 }}>
              <span style={{ color: COLOR_DIM }}>Effective monthly revenue</span>
              <span style={{ color: COLOR_ACCENT, fontWeight: 700 }}>{formatCurrency(rev)}</span>
            </div>
          </div>
        </div>
      )}

      <div style={resultPanel(result.kind === 'burning' ? (result.months < 6 ? COLOR_DANGER : result.months < 12 ? COLOR_WARN : COLOR_ACCENT) : COLOR_OK)}>
        {result.kind === 'burning' && (
          <>
            <div style={resultLabel}>ZERO DATE</div>
            <div style={resultValue}>{monthsToDate(result.months)}</div>
            <div style={resultSub}>
              {(() => {
                const c = monthsToCountdown(result.months);
                return `${c.m} month${c.m === 1 ? '' : 's'}${c.d ? ` · ${c.d} day${c.d === 1 ? '' : 's'}` : ''} remaining`;
              })()}
            </div>
          </>
        )}
        {result.kind === 'profitable' && (
          <>
            <div style={resultLabel}>STATUS</div>
            <div style={{ ...resultValue, color: COLOR_OK }}>INDEFINITE</div>
            <div style={resultSub}>Revenue meets or exceeds burn. No runway zero.</div>
          </>
        )}
        {result.kind === 'zero' && (
          <>
            <div style={resultLabel}>STATUS</div>
            <div style={{ ...resultValue, color: COLOR_DANGER }}>BANKRUPT</div>
            <div style={resultSub}>No cash on hand.</div>
          </>
        )}
      </div>

      {/* Chart */}
      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: COLOR_DIM }}>CASH BALANCE OVER TIME</div>
          <div style={{ fontSize: 11, color: COLOR_DIM }}>horizon: {horizon.toFixed(1)}mo</div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {/* Grid lines */}
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={PAD} x2={W - PAD} y1={PAD + f * (H - 2 * PAD)} y2={PAD + f * (H - 2 * PAD)} stroke={COLOR_BORDER} strokeWidth={0.5} strokeDasharray="2 3" />
          ))}
          {/* Axes */}
          <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke={COLOR_BORDER} strokeWidth={1} />
          <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke={COLOR_BORDER} strokeWidth={1} />
          {/* Line */}
          <polyline points={polyPts} fill="none" stroke={COLOR_ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          {/* Zero crossing marker */}
          {zeroCrossT !== null && zeroCrossT <= horizon && (
            <>
              <line x1={xScale(zeroCrossT)} x2={xScale(zeroCrossT)} y1={PAD} y2={H - PAD} stroke={COLOR_DANGER} strokeWidth={1.2} strokeDasharray="4 3" />
              <circle cx={xScale(zeroCrossT)} cy={yScale(0)} r={4} fill={COLOR_DANGER} />
              <text x={xScale(zeroCrossT) + 6} y={PAD + 10} fill={COLOR_DANGER} fontSize={10} fontFamily="monospace">ZERO</text>
            </>
          )}
          {/* Labels */}
          <text x={PAD - 4} y={PAD + 4} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">{formatCurrency(maxV)}</text>
          <text x={PAD - 4} y={H - PAD + 4} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">$0</text>
          <text x={W - PAD} y={H - PAD + 16} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">{horizon.toFixed(1)}mo</text>
          <text x={PAD} y={H - PAD + 16} fill={COLOR_DIM} fontSize={9} fontFamily="monospace">now</text>
        </svg>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        <Metric label="Net Burn" value={formatCurrency(Math.max(netBurn, 0))} icon={<TrendingDown size={12} />} color={COLOR_WARN} />
        <Metric label="Revenue (effective)" value={formatCurrency(rev)} icon={<Zap size={12} />} color={COLOR_ACCENT} />
        <Metric label="Burn Multiple" value={rev > 0 ? (burn / rev).toFixed(2) + '×' : '∞'} icon={<Flame size={12} />} color={COLOR_DANGER} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Runway = Cash ÷ (Burn − Revenue). The Zero Date is projected from today using 30-day months. Crisis mode zeroes revenue to model the worst-case shock. Inputs persist locally.
      </div>
    </div>
  );
}

function InputCell({ label, prefix, value, onChange, disabled }: { label: string; prefix?: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div style={{ ...panel, padding: 12 }}>
      <label style={{ fontSize: 10, letterSpacing: '.16em', color: COLOR_DIM, display: 'block', marginBottom: 6 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        {prefix && <span style={{ color: COLOR_DIM, fontSize: 14 }}>{prefix}</span>}
        <input
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            borderBottom: `1px solid ${COLOR_BORDER}`,
            color: disabled ? COLOR_DIM : COLOR_TEXT,
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

function Metric({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color }}>{icon}</span>{label}
      </div>
      <div style={{ fontSize: 18, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

const wrap: React.CSSProperties = {
  padding: 24,
  background: COLOR_BG,
  color: COLOR_TEXT,
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  minHeight: '100%',
};
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputsGrid: React.CSSProperties = { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 14 };
const crisisBtn: React.CSSProperties = { padding: '6px 12px', border: '1px solid', borderRadius: 6, fontFamily: 'inherit', fontSize: 11, letterSpacing: '.12em', cursor: 'pointer', fontWeight: 700, background: 'transparent' };
const resultPanel = (color: string): React.CSSProperties => ({ ...panel, padding: 18, textAlign: 'center', borderColor: color, boxShadow: `0 0 20px ${color}22`, marginBottom: 14 });
const resultLabel: React.CSSProperties = { fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 };
const resultValue: React.CSSProperties = { fontSize: 34, fontWeight: 800, letterSpacing: '.04em', color: COLOR_TEXT };
const resultSub: React.CSSProperties = { fontSize: 13, color: COLOR_DIM, marginTop: 6 };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

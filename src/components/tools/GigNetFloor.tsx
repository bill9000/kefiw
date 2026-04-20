import React, { useEffect, useMemo, useState } from 'react';
import { Car, AlertTriangle, Activity } from 'lucide-react';
import { writeField } from '~/lib/session-context';

const STORAGE = 'gig-net-floor-v1';
const PIPELINE_KEY = 'side_hustle_monthly_net';
const PIPELINE_SOURCE = 'gig-net-floor';
const PIPELINE_LABEL = 'Gig-Net Floor';
const WEEKS_PER_MONTH = 4.33;
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_OK = '#4ade80';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';

const IRS_RATE = 0.67;
const FED_MIN = 7.25;

interface State {
  grossPay: string;
  miles: string;
  hours: string;
  gasPrice: string;
  stateMinWage: string;
  shiftsPerWeek: string;
}
const DEFAULT_STATE: State = { grossPay: '140', miles: '95', hours: '6', gasPrice: '3.50', stateMinWage: '15', shiftsPerWeek: '4' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function GigNetFloor() {
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

  const gross = parseNum(state.grossPay);
  const miles = parseNum(state.miles);
  const hours = Math.max(0.01, parseNum(state.hours));
  const gas = parseNum(state.gasPrice);
  const stateMin = parseNum(state.stateMinWage);
  const shifts = Math.max(0, parseNum(state.shiftsPerWeek));

  const { opCost, realProfit, realHourly, grossHourly, status, color, monthlyNet } = useMemo(() => {
    const op = miles * IRS_RATE;
    const profit = gross - op;
    const real = profit / hours;
    const grossHr = gross / hours;
    const threshold = Math.max(FED_MIN, stateMin);
    const monthly = Math.max(0, profit) * shifts * WEEKS_PER_MONTH;
    let s: string;
    let c: string;
    if (real < FED_MIN) { s = 'LOSING MONEY'; c = COLOR_DANGER; }
    else if (real < threshold) { s = 'BELOW LOCAL MIN'; c = COLOR_WARN; }
    else { s = 'ABOVE FLOOR'; c = COLOR_OK; }
    return { opCost: op, realProfit: profit, realHourly: real, grossHourly: grossHr, status: s, color: c, monthlyNet: monthly };
  }, [gross, miles, hours, stateMin, shifts]);

  useEffect(() => {
    if (!hydrated) return;
    writeField(PIPELINE_KEY, monthlyNet, PIPELINE_SOURCE, PIPELINE_LABEL);
  }, [monthlyNet, hydrated]);

  const threshold = Math.max(FED_MIN, stateMin);
  const dialMax = Math.max(threshold * 2, grossHourly * 1.1, 30);
  const dialPct = Math.max(0, Math.min(1, realHourly / dialMax));

  // Half-circle dial geometry
  const R = 90, CX = 110, CY = 110;
  const START_A = Math.PI;
  const END_A = 2 * Math.PI;
  const totalA = END_A - START_A;
  const polarX = (a: number) => CX + R * Math.cos(a);
  const polarY = (a: number) => CY + R * Math.sin(a);
  const endA = START_A + totalA * dialPct;
  const sweep = `M ${polarX(START_A)},${polarY(START_A)} A ${R} ${R} 0 0 1 ${polarX(END_A)},${polarY(END_A)}`;
  const sweepFg = `M ${polarX(START_A)},${polarY(START_A)} A ${R} ${R} 0 0 1 ${polarX(endA)},${polarY(endA)}`;
  const thresholdA = START_A + totalA * Math.min(1, threshold / dialMax);
  const thrX1 = CX + (R - 14) * Math.cos(thresholdA);
  const thrY1 = CY + (R - 14) * Math.sin(thresholdA);
  const thrX2 = CX + (R + 2) * Math.cos(thresholdA);
  const thrY2 = CY + (R + 2) * Math.sin(thresholdA);

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Car size={22} color={color} />
          <div>
            <div style={title}>GIG_NET_FLOOR</div>
            <div style={subtitle}>Real hourly after gas + mileage depreciation (IRS standard)</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Gross Pay (Shift)" prefix="$" value={state.grossPay} onChange={(v) => setState((s) => ({ ...s, grossPay: v }))} />
        <InputCell label="Miles Driven" value={state.miles} onChange={(v) => setState((s) => ({ ...s, miles: v }))} />
        <InputCell label="Hours Worked" value={state.hours} onChange={(v) => setState((s) => ({ ...s, hours: v }))} />
        <InputCell label="Gas $/Gallon" prefix="$" value={state.gasPrice} onChange={(v) => setState((s) => ({ ...s, gasPrice: v }))} />
        <InputCell label="Local Min Wage" prefix="$" value={state.stateMinWage} onChange={(v) => setState((s) => ({ ...s, stateMinWage: v }))} />
        <InputCell label="Shifts / Week" value={state.shiftsPerWeek} onChange={(v) => setState((s) => ({ ...s, shiftsPerWeek: v }))} />
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: color, boxShadow: `0 0 24px ${color}22` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <svg viewBox="0 0 220 140" style={{ width: 220, height: 140, flexShrink: 0 }}>
            <path d={sweep} fill="none" stroke={COLOR_BORDER} strokeWidth={12} strokeLinecap="round" />
            <path d={sweepFg} fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
            <line x1={thrX1} y1={thrY1} x2={thrX2} y2={thrY2} stroke={COLOR_TEXT} strokeWidth={2} />
            <text x={thrX2} y={thrY2 - 4} fill={COLOR_TEXT} fontSize={9} fontFamily="monospace" textAnchor="middle">MIN</text>
            <text x={CX} y={CY - 8} fill={COLOR_TEXT} fontSize={26} fontFamily="monospace" fontWeight={700} textAnchor="middle">{formatCurrency(realHourly)}</text>
            <text x={CX} y={CY + 8} fill={COLOR_DIM} fontSize={10} fontFamily="monospace" letterSpacing="2" textAnchor="middle">REAL/HR</text>
          </svg>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 4 }}>TRUE EARNINGS</div>
            <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: '.02em' }}>{status}</div>
            {realHourly < threshold && (
              <div style={{ marginTop: 10, padding: '8px 12px', border: `1px solid ${color}`, borderRadius: 6, background: 'rgba(239,68,68,0.08)', color, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertTriangle size={14} /> Net is below the minimum wage floor ({formatCurrency(threshold)}/hr). You are trading car equity for app cash.
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Gross / hr" value={`${formatCurrency(grossHourly)}/hr`} color={COLOR_TEXT} />
        <Metric label="Operating Cost" value={formatCurrency(opCost)} color={COLOR_WARN} />
        <Metric label="Real Profit / shift" value={formatCurrency(realProfit)} color={realProfit > 0 ? COLOR_OK : COLOR_DANGER} />
        <Metric label="Monthly Net" value={formatCurrency(monthlyNet)} color={monthlyNet > 0 ? COLOR_OK : COLOR_DIM} />
        <Metric label="Gas Used (est.)" value={formatCurrency((miles / 25) * gas)} color={COLOR_DIM} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Operating cost = miles × $0.67 (2024 IRS standard mileage rate, capturing gas + maintenance + depreciation). Real hourly = (gross − operating cost) ÷ hours. The IRS rate is conservative for high-mileage vehicles but represents long-run true cost — not just gas. Gas price is shown for sanity-check only; it is already inside the IRS figure.
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

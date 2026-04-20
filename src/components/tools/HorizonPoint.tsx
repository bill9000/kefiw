import React, { useEffect, useMemo, useState } from 'react';
import { Home, TrendingUp, Target } from 'lucide-react';

const STORAGE = 'horizon-point-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_RENT = '#f472b6';
const COLOR_OWN = '#22d3ee';
const COLOR_HORIZON = '#facc15';
const COLOR_WARN = '#f59e0b';

interface State {
  rent: string;
  price: string;
  downPct: string;
  rate: string;
  maintPct: string;
  appreciationPct: string;
  termYears: string;
}

const DEFAULT_STATE: State = {
  rent: '2200',
  price: '450000',
  downPct: '20',
  rate: '6.5',
  maintPct: '1',
  appreciationPct: '3',
  termYears: '30',
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$%\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `${n < 0 ? '-' : ''}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${n < 0 ? '-' : ''}$${(abs / 1_000).toFixed(1)}K`;
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

interface MonthStep {
  month: number;
  rentCum: number;
  ownCum: number;
  principalPaid: number;
  interestPaid: number;
  equity: number;
  homeValue: number;
}

function simulate(s: State, months: number): MonthStep[] {
  const price = parseNum(s.price);
  const downPct = parseNum(s.downPct) / 100;
  const ratePct = parseNum(s.rate) / 100;
  const term = Math.max(1, parseNum(s.termYears));
  const maintPct = parseNum(s.maintPct) / 100;
  const apprPct = parseNum(s.appreciationPct) / 100;
  const rent = parseNum(s.rent);

  const down = price * downPct;
  const principal0 = price - down;
  const r = ratePct / 12;
  const n = term * 12;
  const pmt = r > 0 ? (principal0 * r) / (1 - Math.pow(1 + r, -n)) : principal0 / n;

  const closingCosts = price * 0.03;
  const annualTax = price * 0.0125;

  let balance = principal0;
  let rentCum = 0;
  let ownCum = down + closingCosts;
  let principalPaid = 0;
  let interestPaid = 0;

  const out: MonthStep[] = [];
  for (let m = 1; m <= months; m++) {
    rentCum += rent;
    const interest = balance * r;
    const principal = Math.min(pmt - interest, balance);
    balance = Math.max(0, balance - principal);
    principalPaid += principal;
    interestPaid += interest;
    const monthlyTax = annualTax / 12;
    const monthlyMaint = (price * maintPct) / 12;
    ownCum += interest + monthlyTax + monthlyMaint;
    const homeValue = price * Math.pow(1 + apprPct, m / 12);
    const equity = homeValue - balance;
    out.push({ month: m, rentCum, ownCum, principalPaid, interestPaid, equity, homeValue });
  }
  return out;
}

function findHorizon(steps: MonthStep[]): number | null {
  for (const s of steps) {
    const ownNetCost = s.ownCum - s.equity;
    if (s.rentCum >= ownNetCost) return s.month;
  }
  return null;
}

export default function HorizonPoint() {
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

  const horizonMonths = 30 * 12;
  const steps = useMemo(() => simulate(state, horizonMonths), [state]);
  const horizon = useMemo(() => findHorizon(steps), [steps]);
  const final = steps[steps.length - 1];

  const W = 560, H = 220, PAD_L = 42, PAD_R = 16, PAD_T = 16, PAD_B = 28;
  const maxY = useMemo(() => {
    if (!steps.length) return 1;
    return Math.max(...steps.map((s) => Math.max(s.rentCum, s.ownCum - s.equity)));
  }, [steps]);
  const xScale = (m: number) => PAD_L + (m / horizonMonths) * (W - PAD_L - PAD_R);
  const yScale = (v: number) => H - PAD_B - (v / Math.max(maxY, 1)) * (H - PAD_T - PAD_B);

  const rentPath = steps.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s.month).toFixed(1)} ${yScale(s.rentCum).toFixed(1)}`).join(' ');
  const ownPath = steps.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s.month).toFixed(1)} ${yScale(Math.max(0, s.ownCum - s.equity)).toFixed(1)}`).join(' ');

  const horizonYears = horizon ? horizon / 12 : null;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Home size={22} color={COLOR_OWN} />
          <div>
            <div style={title}>HORIZON_POINT</div>
            <div style={subtitle}>Buy vs rent — the exact break-even horizon</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <Slider label="Monthly Rent" prefix="$" value={state.rent} min={500} max={8000} step={50} onChange={(v) => setState((s) => ({ ...s, rent: v }))} />
        <Slider label="Home Price" prefix="$" value={state.price} min={100000} max={2000000} step={5000} onChange={(v) => setState((s) => ({ ...s, price: v }))} />
        <Slider label="Down Payment" suffix="%" value={state.downPct} min={3} max={50} step={1} onChange={(v) => setState((s) => ({ ...s, downPct: v }))} />
        <Slider label="Interest Rate" suffix="%" value={state.rate} min={1} max={12} step={0.125} onChange={(v) => setState((s) => ({ ...s, rate: v }))} />
        <Slider label="Annual Maintenance" suffix="%" value={state.maintPct} min={0} max={4} step={0.25} onChange={(v) => setState((s) => ({ ...s, maintPct: v }))} />
        <Slider label="Appreciation" suffix="%" value={state.appreciationPct} min={0} max={8} step={0.25} onChange={(v) => setState((s) => ({ ...s, appreciationPct: v }))} />
      </div>

      {/* Verdict */}
      <div style={{ ...panel, padding: 18, textAlign: 'center', borderColor: horizon ? COLOR_HORIZON : COLOR_WARN, boxShadow: `0 0 24px ${(horizon ? COLOR_HORIZON : COLOR_WARN)}22`, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>HORIZON POINT</div>
        {horizon !== null && horizonYears !== null ? (
          <>
            <div style={{ fontSize: 34, fontWeight: 800, color: COLOR_HORIZON }}>
              Year {horizonYears.toFixed(1)}
            </div>
            <div style={{ fontSize: 13, color: COLOR_DIM, marginTop: 6 }}>
              Buy if you'll hold the property longer than {Math.ceil(horizonYears)} year{Math.ceil(horizonYears) === 1 ? '' : 's'} — otherwise rent.
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 28, fontWeight: 800, color: COLOR_WARN }}>No Break-Even</div>
            <div style={{ fontSize: 13, color: COLOR_DIM, marginTop: 6 }}>
              Renting stays cheaper across the 30-year horizon at these inputs.
            </div>
          </>
        )}
      </div>

      {/* Chart */}
      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: COLOR_DIM }}>CUMULATIVE NET COST</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            <LegendDot color={COLOR_RENT} label="Rent (sunk)" />
            <LegendDot color={COLOR_OWN} label="Own (net of equity)" />
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={PAD_L} x2={W - PAD_R} y1={PAD_T + f * (H - PAD_T - PAD_B)} y2={PAD_T + f * (H - PAD_T - PAD_B)} stroke={COLOR_BORDER} strokeWidth={0.5} strokeDasharray="2 3" />
          ))}
          {[5, 10, 15, 20, 25].map((y) => {
            const x = xScale(y * 12);
            return (
              <g key={y}>
                <line x1={x} x2={x} y1={PAD_T} y2={H - PAD_B} stroke={COLOR_BORDER} strokeWidth={0.5} strokeDasharray="2 3" />
                <text x={x} y={H - PAD_B + 14} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="middle">{y}y</text>
              </g>
            );
          })}
          <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke={COLOR_BORDER} strokeWidth={1} />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke={COLOR_BORDER} strokeWidth={1} />
          <path d={rentPath} fill="none" stroke={COLOR_RENT} strokeWidth={2} />
          <path d={ownPath} fill="none" stroke={COLOR_OWN} strokeWidth={2} />
          {horizon !== null && (
            <g>
              <line x1={xScale(horizon)} x2={xScale(horizon)} y1={PAD_T} y2={H - PAD_B} stroke={COLOR_HORIZON} strokeWidth={1.2} strokeDasharray="4 3" />
              <circle cx={xScale(horizon)} cy={yScale(steps[horizon - 1].rentCum)} r={4} fill={COLOR_HORIZON} />
              <text x={xScale(horizon) + 6} y={PAD_T + 10} fill={COLOR_HORIZON} fontSize={10} fontFamily="monospace">HORIZON</text>
            </g>
          )}
          <text x={PAD_L - 4} y={PAD_T + 4} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">{formatCurrency(maxY)}</text>
          <text x={PAD_L - 4} y={H - PAD_B + 4} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">$0</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="30y Rent Total" value={formatCurrency(final?.rentCum ?? 0)} color={COLOR_RENT} icon={<TrendingUp size={12} />} />
        <Metric label="30y Interest" value={formatCurrency(final?.interestPaid ?? 0)} color={COLOR_OWN} icon={<TrendingUp size={12} />} />
        <Metric label="Final Equity" value={formatCurrency(final?.equity ?? 0)} color={COLOR_HORIZON} icon={<Target size={12} />} />
        <Metric label="Final Home Value" value={formatCurrency(final?.homeValue ?? 0)} color={COLOR_OWN} icon={<Home size={12} />} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Monthly simulation over 30 years. Ownership costs include interest, property tax (assumed 1.25%/yr of price), annual maintenance, plus down payment and 3% closing. Renting is pure sunk cost. The horizon is the first month cumulative rent exceeds net-of-equity ownership cost.
      </div>
    </div>
  );
}

function Slider({ label, prefix, suffix, value, min, max, step, onChange }: { label: string; prefix?: string; suffix?: string; value: string; min: number; max: number; step: number; onChange: (v: string) => void }) {
  return (
    <div style={{ ...panel, padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <label style={{ fontSize: 10, letterSpacing: '.16em', color: COLOR_DIM }}>{label}</label>
        <span style={{ fontSize: 14, fontWeight: 700, color: COLOR_TEXT }}>
          {prefix}{value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', accentColor: COLOR_OWN }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: COLOR_DIM }}>
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: COLOR_DIM }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
}

function Metric({ label, value, color, icon }: { label: string; value: string; color: string; icon: React.ReactNode }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color }}>{icon}</span>{label}
      </div>
      <div style={{ fontSize: 16, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputsGrid: React.CSSProperties = { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: 14 };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

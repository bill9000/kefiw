import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Activity } from 'lucide-react';

const STORAGE = 'trap-detector-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_GREEN = '#4ade80';
const COLOR_GOLD = '#facc15';
const COLOR_ORANGE = '#f59e0b';
const COLOR_RED = '#ef4444';

interface State { amount: string; fee: string; interestPct: string; days: string; }
const DEFAULT_STATE: State = { amount: '100', fee: '15', interestPct: '0', days: '14' };

const CC_APR = 29;

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}
function aprColor(apr: number): string {
  if (apr <= 30) return COLOR_GREEN;
  if (apr <= 80) return COLOR_GOLD;
  if (apr <= 200) return COLOR_ORANGE;
  return COLOR_RED;
}
function aprBand(apr: number): string {
  if (apr <= 30) return 'FAIR';
  if (apr <= 80) return 'HIGH';
  if (apr <= 200) return 'PREDATORY';
  return 'EXTORTIONATE';
}

export default function TrapDetector() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const amount = Math.max(0.01, parseNum(state.amount));
    const fee = Math.max(0, parseNum(state.fee));
    const interestPct = Math.max(0, parseNum(state.interestPct));
    const days = Math.max(1, parseNum(state.days));
    const interestDollars = amount * (interestPct / 100) * (days / 365);
    const totalCost = fee + interestDollars;
    const apr = (totalCost / amount) * (365 / days) * 100;
    const costPerDay = totalCost / days;
    const multiplierVsCC = apr / CC_APR;
    return { amount, fee, interestPct, days, interestDollars, totalCost, apr, costPerDay, multiplierVsCC };
  }, [state]);

  const color = aprColor(calc.apr);
  const band = aprBand(calc.apr);

  const heatCells = 20;
  const cellsFilled = Math.min(heatCells, Math.round((calc.apr / 500) * heatCells));

  const trapDepth = Math.min(100, (calc.apr / 400) * 100);

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={22} color={COLOR_RED} />
          <div>
            <div style={title}>TRAP_DETECTOR</div>
            <div style={subtitle}>True APR of payday loans, pawn deals, and cash advances</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Loan Amount" value={state.amount} onChange={(v) => setState({ ...state, amount: v })} prefix="$" />
        <InputCell label="Fee" value={state.fee} onChange={(v) => setState({ ...state, fee: v })} prefix="$" />
        <InputCell label="Interest Rate" value={state.interestPct} onChange={(v) => setState({ ...state, interestPct: v })} suffix="%" />
        <InputCell label="Days to Repay" value={state.days} onChange={(v) => setState({ ...state, days: v })} />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>TRUE APR</div>
        <div style={{ fontSize: 56, fontWeight: 700, color, transition: 'color 240ms ease' }}>{calc.apr.toFixed(0)}%</div>
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '.14em', color }}>{band}</div>
        <div style={{ fontSize: 12, color: COLOR_DIM, marginTop: 8 }}>
          Costs <span style={{ color: COLOR_TEXT, fontWeight: 700 }}>{formatCurrency(calc.costPerDay)}</span> per day ·
          <span style={{ color }}> {calc.multiplierVsCC.toFixed(1)}× credit-card APR</span>
        </div>
      </div>

      <div style={{ ...panel, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>PREDATORY HEAT</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${heatCells}, 1fr)`, gap: 3 }}>
          {Array.from({ length: heatCells }).map((_, i) => {
            const active = i < cellsFilled;
            const intensity = i / heatCells;
            const cellColor = intensity < 0.2 ? COLOR_GREEN : intensity < 0.5 ? COLOR_GOLD : intensity < 0.75 ? COLOR_ORANGE : COLOR_RED;
            return <div key={i} style={{ height: 18, background: active ? cellColor : COLOR_BG, border: `1px solid ${active ? cellColor : COLOR_BORDER}`, borderRadius: 2, transition: 'background 200ms ease' }} />;
          })}
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>DEBT TRAP DEPTH</div>
        <svg viewBox="0 0 300 140" width="100%" height="140">
          <line x1="0" y1="20" x2="300" y2="20" stroke={COLOR_BORDER} strokeWidth="1" strokeDasharray="4,4" />
          <text x="10" y="15" fill={COLOR_DIM} fontSize="10" fontFamily="inherit">GROUND</text>
          <rect x="110" y="20" width="80" height={trapDepth} fill={color} opacity="0.3" style={{ transition: 'height 320ms ease' }} />
          <rect x="110" y={20 + trapDepth - 4} width="80" height="4" fill={color} />
          <circle cx="150" cy={28 + trapDepth * 0.5} r="8" fill={color} />
          <text x="150" y={130} textAnchor="middle" fill={color} fontSize="13" fontWeight="700" fontFamily="inherit">{trapDepth.toFixed(0)}% DEEP</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Total Cost" value={formatCurrency(calc.totalCost)} color={color} />
        <Metric label="Cost / Day" value={formatCurrency(calc.costPerDay)} color={COLOR_TEXT} />
        <Metric label="vs CC APR (29%)" value={`${calc.multiplierVsCC.toFixed(1)}×`} color={color} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        APR = (total cost ÷ principal) × (365 ÷ days) × 100. A $15 fee on $100 for 14 days = 391% APR. Credit-card baseline = 29%. Heatmap bands: ≤30% fair, ≤80% high, ≤200% predatory, &gt;200% extortionate.
      </div>
    </div>
  );
}

function InputCell({ label, value, onChange, prefix, suffix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {prefix && <span style={{ color: COLOR_DIM, fontSize: 13 }}>{prefix}</span>}
        <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
        {suffix && <span style={{ color: COLOR_DIM, fontSize: 13 }}>{suffix}</span>}
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
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 4, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 14, outline: 'none' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

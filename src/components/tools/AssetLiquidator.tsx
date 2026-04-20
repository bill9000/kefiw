import React, { useEffect, useMemo, useState } from 'react';
import { Car, Activity } from 'lucide-react';

const STORAGE = 'asset-liquid-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GOLD = '#facc15';
const COLOR_GREEN = '#4ade80';
const COLOR_RED = '#ef4444';

const IRS_RATE = 0.67;

interface State { grossPay: string; miles: string; hours: string; }
const DEFAULT_STATE: State = { grossPay: '220', miles: '180', hours: '8' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

// Dial gauge — returns a polar arc path
function dialArc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const toRad = (d: number) => (d - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export default function AssetLiquidator() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const grossPay = Math.max(0, parseNum(state.grossPay));
    const miles = Math.max(0, parseNum(state.miles));
    const hours = Math.max(0.01, parseNum(state.hours));
    const trueCost = miles * IRS_RATE;
    const realProfit = grossPay - trueCost;
    const realHourly = realProfit / hours;
    const dollarPerMile = miles > 0 ? grossPay / miles : 0;
    const netImpactPct = grossPay > 0 ? (realProfit / grossPay) * 100 : 0;
    return { grossPay, miles, hours, trueCost, realProfit, realHourly, dollarPerMile, netImpactPct };
  }, [state]);

  const earningsPct = Math.min(100, calc.grossPay > 0 ? 100 : 0);
  const impactPct = Math.max(-100, Math.min(100, calc.netImpactPct));
  const impactColor = impactPct < 0 ? COLOR_RED : impactPct < 30 ? COLOR_MAGENTA : impactPct < 60 ? COLOR_GOLD : COLOR_GREEN;

  // Dial sweep -90 to 90 deg (semicircle)
  const earnSweep = -90 + (earningsPct / 100) * 180;
  const impactSweep = -90 + ((impactPct + 100) / 200) * 180;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Car size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>ASSET_LIQUIDATOR</div>
            <div style={subtitle}>Gig income minus true vehicle cost (IRS ${IRS_RATE}/mi)</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Gross pay" value={state.grossPay} onChange={(v) => setState({ ...state, grossPay: v })} prefix="$" />
        <InputCell label="Miles driven" value={state.miles} onChange={(v) => setState({ ...state, miles: v })} />
        <InputCell label="Hours worked" value={state.hours} onChange={(v) => setState({ ...state, hours: v })} />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 6 }}>APP EARNINGS</div>
          <svg viewBox="0 0 200 120" width="100%" height="120">
            <path d={dialArc(100, 100, 70, -90, 90)} fill="none" stroke={COLOR_BORDER} strokeWidth="10" strokeLinecap="round" />
            <path d={dialArc(100, 100, 70, -90, earnSweep)} fill="none" stroke={COLOR_CYAN} strokeWidth="10" strokeLinecap="round" style={{ transition: 'stroke-dasharray 320ms ease' }} />
            <text x="100" y="85" textAnchor="middle" fill={COLOR_CYAN} fontSize="22" fontWeight="700" fontFamily="inherit">{formatCurrency(calc.grossPay)}</text>
            <text x="100" y="100" textAnchor="middle" fill={COLOR_DIM} fontSize="10" fontFamily="inherit">{formatCurrency(calc.dollarPerMile)}/mi</text>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 6 }}>NET WORTH IMPACT</div>
          <svg viewBox="0 0 200 120" width="100%" height="120">
            <path d={dialArc(100, 100, 70, -90, 90)} fill="none" stroke={COLOR_BORDER} strokeWidth="10" strokeLinecap="round" />
            <path d={dialArc(100, 100, 70, -90, impactSweep)} fill="none" stroke={impactColor} strokeWidth="10" strokeLinecap="round" style={{ transition: 'stroke 240ms ease' }} />
            <text x="100" y="85" textAnchor="middle" fill={impactColor} fontSize="22" fontWeight="700" fontFamily="inherit">{impactPct.toFixed(0)}%</text>
            <text x="100" y="100" textAnchor="middle" fill={COLOR_DIM} fontSize="10" fontFamily="inherit">net / gross ratio</text>
          </svg>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="True vehicle cost" value={`−${formatCurrency(calc.trueCost)}`} color={COLOR_MAGENTA} />
        <Metric label="Real profit" value={formatCurrency(calc.realProfit)} color={calc.realProfit >= 0 ? COLOR_GREEN : COLOR_RED} />
        <Metric label="Real hourly" value={`${formatCurrency(calc.realHourly)}/hr`} color={calc.realHourly >= 15 ? COLOR_GREEN : calc.realHourly >= 7.25 ? COLOR_GOLD : COLOR_RED} />
        <Metric label="$ per mile" value={formatCurrency(calc.dollarPerMile)} color={COLOR_CYAN} />
      </div>

      {calc.realProfit < 0 && (
        <div style={{ ...panel, padding: 12, marginBottom: 14, border: `1.5px solid ${COLOR_RED}`, background: `${COLOR_RED}15` }}>
          <div style={{ fontSize: 12, color: COLOR_RED, fontWeight: 700, letterSpacing: '.08em' }}>▼ NET NEGATIVE</div>
          <div style={{ fontSize: 11, color: COLOR_DIM, marginTop: 4 }}>Today you sold more car equity than you took in. You are liquidating your asset one mile at a time for less than its value.</div>
        </div>
      )}

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Real profit = gross pay − (miles × IRS rate ${IRS_RATE}). The IRS standard mileage rate anchors the full cost: fuel, depreciation, insurance, repairs, tires. Real hourly = real profit ÷ hours worked. Many gig drivers mistake gross for income — this separates revenue from asset cannibalization.
      </div>
    </div>
  );
}

function InputCell({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {prefix && <span style={{ color: COLOR_DIM, fontSize: 13 }}>{prefix}</span>}
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
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 4, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 14, outline: 'none' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

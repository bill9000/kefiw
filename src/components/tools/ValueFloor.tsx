import React, { useEffect, useMemo, useState } from 'react';
import { Scale, Wrench, Activity } from 'lucide-react';

const STORAGE = 'value-floor-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_DIY = '#22d3ee';
const COLOR_OUT = '#f472b6';
const COLOR_OK = '#4ade80';

interface State {
  hourlyRate: string;
  hoursRequired: string;
  partsCost: string;
  proQuote: string;
}
const DEFAULT_STATE: State = { hourlyRate: '125', hoursRequired: '4', partsCost: '60', proQuote: '300' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function ValueFloor() {
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

  const rate = parseNum(state.hourlyRate);
  const hours = parseNum(state.hoursRequired);
  const parts = parseNum(state.partsCost);
  const quote = parseNum(state.proQuote);

  const { diyCost, verdict, winner, gap } = useMemo(() => {
    const diy = rate * hours + parts;
    if (diy === quote) return { diyCost: diy, verdict: 'BREAK_EVEN', winner: 'even' as const, gap: 0 };
    const win: 'diy' | 'out' = diy < quote ? 'diy' : 'out';
    return { diyCost: diy, verdict: win === 'diy' ? 'DIY' : 'DELEGATE', winner: win, gap: Math.abs(diy - quote) };
  }, [rate, hours, parts, quote]);

  // Balance scale tilt — positive tilt → DIY side lower (cheaper)
  const max = Math.max(diyCost, quote, 1);
  const diff = (diyCost - quote) / max;
  const tilt = Math.max(-1, Math.min(1, diff)) * 14; // degrees

  const winnerColor = winner === 'diy' ? COLOR_DIY : winner === 'out' ? COLOR_OUT : COLOR_OK;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scale size={22} color={winnerColor} />
          <div>
            <div style={title}>VALUE_FLOOR</div>
            <div style={subtitle}>Outsource vs DIY — when your time is worth more than the quote</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Your Hourly Rate" prefix="$" value={state.hourlyRate} onChange={(v) => setState((s) => ({ ...s, hourlyRate: v }))} />
        <InputCell label="Hours Required" value={state.hoursRequired} onChange={(v) => setState((s) => ({ ...s, hoursRequired: v }))} />
        <InputCell label="Parts / Materials" prefix="$" value={state.partsCost} onChange={(v) => setState((s) => ({ ...s, partsCost: v }))} />
        <InputCell label="Professional Quote" prefix="$" value={state.proQuote} onChange={(v) => setState((s) => ({ ...s, proQuote: v }))} />
      </div>

      {/* Decision Diamond */}
      <div style={{ ...panel, padding: 22, marginBottom: 14, borderColor: winnerColor, boxShadow: `0 0 24px ${winnerColor}22`, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 10 }}>DECISION</div>
        <svg viewBox="0 0 320 160" style={{ width: '100%', maxWidth: 360, height: 'auto', margin: '0 auto' }}>
          {/* Stand */}
          <line x1={160} y1={60} x2={160} y2={130} stroke={COLOR_BORDER} strokeWidth={3} />
          <rect x={138} y={130} width={44} height={6} fill={COLOR_BORDER} />
          {/* Beam */}
          <g transform={`rotate(${tilt} 160 60)`} style={{ transition: 'transform 320ms ease' }}>
            <line x1={40} y1={60} x2={280} y2={60} stroke={COLOR_TEXT} strokeWidth={3} strokeLinecap="round" />
            {/* DIY pan */}
            <line x1={80} y1={60} x2={80} y2={90} stroke={COLOR_DIM} strokeWidth={1.5} />
            <ellipse cx={80} cy={92} rx={40} ry={8} fill={COLOR_PANEL} stroke={COLOR_DIY} strokeWidth={2} />
            <text x={80} y={110} fill={COLOR_DIY} fontSize={11} fontFamily="monospace" fontWeight={700} textAnchor="middle">DIY</text>
            <text x={80} y={124} fill={COLOR_TEXT} fontSize={12} fontFamily="monospace" fontWeight={700} textAnchor="middle">{formatCurrency(diyCost)}</text>
            {/* Outsource pan */}
            <line x1={240} y1={60} x2={240} y2={90} stroke={COLOR_DIM} strokeWidth={1.5} />
            <ellipse cx={240} cy={92} rx={40} ry={8} fill={COLOR_PANEL} stroke={COLOR_OUT} strokeWidth={2} />
            <text x={240} y={110} fill={COLOR_OUT} fontSize={11} fontFamily="monospace" fontWeight={700} textAnchor="middle">HIRE</text>
            <text x={240} y={124} fill={COLOR_TEXT} fontSize={12} fontFamily="monospace" fontWeight={700} textAnchor="middle">{formatCurrency(quote)}</text>
          </g>
          {/* Pivot */}
          <circle cx={160} cy={60} r={5} fill={winnerColor} />
        </svg>
        <div style={{ marginTop: 10, fontSize: 34, fontWeight: 800, color: winnerColor, letterSpacing: '.04em' }}>{verdict}</div>
        <div style={{ marginTop: 4, fontSize: 12, color: COLOR_DIM }}>
          {winner === 'diy' && <>Doing it saves <span style={{ color: COLOR_OK, fontWeight: 700 }}>{formatCurrency(gap)}</span> at your hourly rate.</>}
          {winner === 'out' && <>Delegating saves <span style={{ color: COLOR_OK, fontWeight: 700 }}>{formatCurrency(gap)}</span> of your time-equivalent.</>}
          {winner === 'even' && <>Break-even — either choice is neutral on cost.</>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Labor at Rate" value={formatCurrency(rate * hours)} color={COLOR_DIY} />
        <Metric label="Parts" value={formatCurrency(parts)} color={COLOR_TEXT} />
        <Metric label="Total DIY" value={formatCurrency(diyCost)} color={COLOR_DIY} />
        <Metric label="Pro Quote" value={formatCurrency(quote)} color={COLOR_OUT} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        DIY cost = (your hourly rate × hours required) + parts. If that sum exceeds the professional quote, delegate. The hourly rate should be what you earn at your most productive — not minimum wage. Skill gaps that extend hours are captured in the hour estimate.
        <br /><br />
        <Wrench size={10} /> Most people undervalue their time for "saving money" tasks. The floor makes the tradeoff explicit.
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

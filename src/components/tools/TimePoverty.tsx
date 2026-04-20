import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'time-poverty-v1';
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

const SLEEP_HOURS = 8;
const PREP_HOURS = 2;

interface State { hourlyRate: string; shiftHours: string; transitHours: string; transitCost: string; }
const DEFAULT_STATE: State = { hourlyRate: '18', shiftHours: '8', transitHours: '2.5', transitCost: '12' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function TimePoverty() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const hourlyRate = Math.max(0, parseNum(state.hourlyRate));
    const shiftHours = Math.max(0.01, parseNum(state.shiftHours));
    const transitHours = Math.max(0, parseNum(state.transitHours));
    const transitCost = Math.max(0, parseNum(state.transitCost));
    const gross = hourlyRate * shiftHours;
    const netEarnings = gross - transitCost;
    const totalHours = shiftHours + transitHours;
    const realWage = totalHours > 0 ? netEarnings / totalHours : 0;
    const discretionary = 24 - shiftHours - transitHours - SLEEP_HOURS - PREP_HOURS;
    const wageLossPct = hourlyRate > 0 ? ((hourlyRate - realWage) / hourlyRate) * 100 : 0;
    return { hourlyRate, shiftHours, transitHours, transitCost, gross, netEarnings, realWage, discretionary, wageLossPct };
  }, [state]);

  const color = calc.realWage >= calc.hourlyRate * 0.85 ? COLOR_GREEN : calc.realWage >= calc.hourlyRate * 0.65 ? COLOR_GOLD : COLOR_RED;
  const dayWidth = 600;
  const hourW = dayWidth / 24;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>TIME_POVERTY</div>
            <div style={subtitle}>Real hourly wage after transit time and cost</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Hourly rate" value={state.hourlyRate} onChange={(v) => setState({ ...state, hourlyRate: v })} prefix="$" />
        <InputCell label="Shift hours" value={state.shiftHours} onChange={(v) => setState({ ...state, shiftHours: v })} />
        <InputCell label="Transit hours (RT)" value={state.transitHours} onChange={(v) => setState({ ...state, transitHours: v })} />
        <InputCell label="Transit cost" value={state.transitCost} onChange={(v) => setState({ ...state, transitCost: v })} prefix="$" />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>EFFECTIVE HOURLY WAGE</div>
        <div style={{ fontSize: 48, fontWeight: 700, color }}>{formatCurrency(calc.realWage)}/hr</div>
        <div style={{ fontSize: 12, color: COLOR_DIM, marginTop: 4 }}>
          posted <span style={{ color: COLOR_TEXT, fontWeight: 700 }}>{formatCurrency(calc.hourlyRate)}/hr</span> · leak <span style={{ color }}>{calc.wageLossPct.toFixed(1)}%</span>
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>24-HOUR DAY · TIME LEAK</div>
        <svg viewBox={`0 0 ${dayWidth} 70`} width="100%" height="70">
          {(() => {
            let x = 0;
            const segs: JSX.Element[] = [];
            const addSeg = (h: number, color: string, label: string, key: string) => {
              const w = h * hourW;
              segs.push(
                <g key={key}>
                  <rect x={x} y="14" width={Math.max(0, w)} height="26" fill={color} opacity="0.75" />
                  {w > 40 && <text x={x + w / 2} y="32" textAnchor="middle" fill={COLOR_BG} fontSize="11" fontWeight="700" fontFamily="inherit">{label}</text>}
                </g>
              );
              x += w;
            };
            addSeg(calc.shiftHours, COLOR_CYAN, `WORK ${calc.shiftHours}h`, 'w');
            addSeg(calc.transitHours, COLOR_MAGENTA, `TRANSIT ${calc.transitHours}h`, 't');
            addSeg(SLEEP_HOURS, COLOR_GOLD, `SLEEP ${SLEEP_HOURS}h`, 's');
            addSeg(PREP_HOURS, COLOR_DIM, `PREP ${PREP_HOURS}h`, 'p');
            addSeg(Math.max(0, calc.discretionary), COLOR_GREEN, `FREE ${calc.discretionary.toFixed(1)}h`, 'f');
            return segs;
          })()}
          {Array.from({ length: 25 }).map((_, i) => (
            <g key={i}>
              {i % 4 === 0 && <line x1={i * hourW} y1="40" x2={i * hourW} y2="46" stroke={COLOR_DIM} strokeWidth="1" />}
              {i % 4 === 0 && <text x={i * hourW} y="58" textAnchor="middle" fill={COLOR_DIM} fontSize="9" fontFamily="inherit">{i}h</text>}
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Gross pay" value={formatCurrency(calc.gross)} color={COLOR_TEXT} />
        <Metric label="Transit cost" value={`−${formatCurrency(calc.transitCost)}`} color={COLOR_MAGENTA} />
        <Metric label="Net take-home" value={formatCurrency(calc.netEarnings)} color={color} />
        <Metric label="Free hours" value={`${calc.discretionary.toFixed(1)}h`} color={calc.discretionary >= 4 ? COLOR_GREEN : COLOR_RED} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Real wage = (hourly × shift − transit cost) ÷ (shift + transit hours). Day budget assumes {SLEEP_HOURS}h sleep + {PREP_HOURS}h prep; remaining hours are discretionary. Transit time is uncompensated labor — spreading earnings over those hours reveals the true rate.
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
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM }}>{label}</div>
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

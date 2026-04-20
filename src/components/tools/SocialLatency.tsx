import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'social-latency-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GOLD = '#facc15';
const COLOR_GREEN = '#4ade80';

interface State { energy: string; money: string; intensity: string; }
const DEFAULT_STATE: State = { energy: '40', money: '25', intensity: '7' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = (deg - 90) * (Math.PI / 180);
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}
function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [x1, y1] = polar(cx, cy, r, startDeg);
  const [x2, y2] = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

export default function SocialLatency() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const energy = Math.max(0, parseNum(state.energy));
    const money = Math.max(0, parseNum(state.money));
    const intensity = Math.max(0, Math.min(10, parseNum(state.intensity)));
    const denom = energy + money;
    const roi = denom > 0 ? (intensity * 10) / denom : 0;
    const uplink = roi >= 1;
    return { energy, money, intensity, denom, roi, uplink };
  }, [state]);

  const gaugeVal = Math.min(100, calc.roi * 50);
  const sweep = -135 + (gaugeVal / 100) * 270;
  const color = calc.uplink ? COLOR_GREEN : calc.roi >= 0.6 ? COLOR_GOLD : COLOR_MAGENTA;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>SOCIAL_LATENCY</div>
            <div style={subtitle}>Connection ROI — numerical only</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Energy expenditure" value={state.energy} onChange={(v) => setState({ ...state, energy: v })} />
        <InputCell label="Financial outlay" value={state.money} onChange={(v) => setState({ ...state, money: v })} prefix="$" />
        <InputCell label="Connection intensity (1-10)" value={state.intensity} onChange={(v) => setState({ ...state, intensity: v })} />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 6 }}>NEURAL SYNCHRONY</div>
        <svg viewBox="0 0 260 180" width="100%" height="180">
          <path d={arcPath(130, 130, 90, -135, 135)} fill="none" stroke={COLOR_BORDER} strokeWidth="10" strokeLinecap="round" />
          <path d={arcPath(130, 130, 90, -135, sweep)} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" style={{ transition: 'stroke 240ms ease' }} />
          {[-135, -90, -45, 0, 45, 90, 135].map((d, i) => {
            const [x1, y1] = polar(130, 130, 70, d);
            const [x2, y2] = polar(130, 130, 78, d);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLOR_DIM} strokeWidth="1" />;
          })}
          <text x="130" y="115" textAnchor="middle" fill={color} fontSize="38" fontWeight="700" fontFamily="inherit">{calc.roi.toFixed(2)}</text>
          <text x="130" y="140" textAnchor="middle" fill={COLOR_DIM} fontSize="10" fontFamily="inherit">ROI</text>
          <text x="130" y="168" textAnchor="middle" fill={color} fontSize="14" fontWeight="700" letterSpacing="0.12em" fontFamily="inherit">{calc.uplink ? 'UPLINK' : 'STANDBY'}</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Denominator" value={`${calc.denom.toFixed(0)}`} color={COLOR_DIM} />
        <Metric label="Intensity × 10" value={`${(calc.intensity * 10).toFixed(0)}`} color={COLOR_GOLD} />
        <Metric label="ROI" value={calc.roi.toFixed(2)} color={color} />
        <Metric label="State" value={calc.uplink ? 'UPLINK' : 'STANDBY'} color={color} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        ROI = (intensity × 10) ÷ (energy + money). ROI ≥ 1.0 = UPLINK. Below that = STANDBY. Neural synchrony gauge sweeps the full arc proportional to ROI. No advice layer — read the number.
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

import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'vimes-utility-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GREEN = '#4ade80';
const COLOR_RED = '#ef4444';

const HORIZON_MONTHS = 60;

interface State { cheapPrice: string; cheapLife: string; qualityPrice: string; qualityLife: string; }
const DEFAULT_STATE: State = { cheapPrice: '30', cheapLife: '4', qualityPrice: '180', qualityLife: '60' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function VimesUtility() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const cheapPrice = Math.max(0.01, parseNum(state.cheapPrice));
    const cheapLife = Math.max(0.1, parseNum(state.cheapLife));
    const qualityPrice = Math.max(0.01, parseNum(state.qualityPrice));
    const qualityLife = Math.max(0.1, parseNum(state.qualityLife));
    const cheapPerDay = cheapPrice / (cheapLife * 30);
    const qualityPerDay = qualityPrice / (qualityLife * 30);
    const cheapReplacements = Math.ceil(HORIZON_MONTHS / cheapLife);
    const cheapTotal = cheapReplacements * cheapPrice;
    const qualityReplacements = Math.max(1, Math.ceil(HORIZON_MONTHS / qualityLife));
    const qualityTotal = qualityReplacements * qualityPrice;
    const gap = cheapTotal - qualityTotal;
    return { cheapPrice, cheapLife, qualityPrice, qualityLife, cheapPerDay, qualityPerDay, cheapReplacements, cheapTotal, qualityReplacements, qualityTotal, gap };
  }, [state]);

  const gapColor = calc.gap > 0 ? COLOR_RED : COLOR_GREEN;
  const totalWidth = 600;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>VIMES_UTILITY</div>
            <div style={subtitle}>Boots Theory — cost per day over a 5-year horizon</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Cheap price" value={state.cheapPrice} onChange={(v) => setState({ ...state, cheapPrice: v })} prefix="$" />
        <InputCell label="Cheap lifespan (mo)" value={state.cheapLife} onChange={(v) => setState({ ...state, cheapLife: v })} />
        <InputCell label="Quality price" value={state.qualityPrice} onChange={(v) => setState({ ...state, qualityPrice: v })} prefix="$" />
        <InputCell label="Quality lifespan (mo)" value={state.qualityLife} onChange={(v) => setState({ ...state, qualityLife: v })} />
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>WEAR & TEAR · 60 MO</div>
        <svg viewBox={`0 0 ${totalWidth} 120`} width="100%" height="120">
          <text x="0" y="18" fill={COLOR_MAGENTA} fontSize="11" fontWeight="700" fontFamily="inherit">CHEAP × {calc.cheapReplacements}</text>
          {Array.from({ length: calc.cheapReplacements }).map((_, i) => {
            const widthPct = (Math.min(calc.cheapLife, HORIZON_MONTHS - i * calc.cheapLife) / HORIZON_MONTHS) * totalWidth;
            const startX = (i * calc.cheapLife / HORIZON_MONTHS) * totalWidth;
            if (widthPct <= 0) return null;
            return (
              <g key={`c${i}`}>
                <rect x={startX + 1} y="26" width={Math.max(2, widthPct - 2)} height="20" fill={COLOR_MAGENTA} opacity="0.7" rx="2" />
                {i < calc.cheapReplacements - 1 && startX + widthPct < totalWidth && <text x={startX + widthPct - 4} y="40" fill={COLOR_BG} fontSize="12" fontFamily="inherit">✕</text>}
              </g>
            );
          })}
          <text x="0" y="72" fill={COLOR_GREEN} fontSize="11" fontWeight="700" fontFamily="inherit">QUALITY × {calc.qualityReplacements}</text>
          {Array.from({ length: calc.qualityReplacements }).map((_, i) => {
            const widthPct = (Math.min(calc.qualityLife, HORIZON_MONTHS - i * calc.qualityLife) / HORIZON_MONTHS) * totalWidth;
            const startX = (i * calc.qualityLife / HORIZON_MONTHS) * totalWidth;
            if (widthPct <= 0) return null;
            return <rect key={`q${i}`} x={startX + 1} y="80" width={Math.max(2, widthPct - 2)} height="20" fill={COLOR_GREEN} opacity="0.7" rx="2" />;
          })}
          {[0, 12, 24, 36, 48, 60].map((m) => (
            <g key={m}>
              <line x1={(m / HORIZON_MONTHS) * totalWidth} y1="108" x2={(m / HORIZON_MONTHS) * totalWidth} y2="112" stroke={COLOR_DIM} strokeWidth="1" />
              <text x={(m / HORIZON_MONTHS) * totalWidth} y="120" textAnchor={m === 0 ? 'start' : m === 60 ? 'end' : 'middle'} fill={COLOR_DIM} fontSize="10" fontFamily="inherit">{m}mo</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Cheap / day" value={formatCurrency(calc.cheapPerDay)} color={COLOR_MAGENTA} />
        <Metric label="Quality / day" value={formatCurrency(calc.qualityPerDay)} color={COLOR_GREEN} />
        <Metric label="5-yr cheap total" value={formatCurrency(calc.cheapTotal)} color={COLOR_MAGENTA} />
        <Metric label="5-yr quality total" value={formatCurrency(calc.qualityTotal)} color={COLOR_GREEN} />
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>INJUSTICE GAP · 5 YEAR</div>
        <div style={{ fontSize: 38, fontWeight: 700, color: gapColor, marginTop: 4 }}>{calc.gap >= 0 ? '+' : ''}{formatCurrency(calc.gap)}</div>
        <div style={{ fontSize: 11, color: COLOR_DIM, marginTop: 4 }}>{calc.gap > 0 ? 'Cheap option costs more over the horizon' : 'Cheap option is actually cheaper here'}</div>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Cost per day = price ÷ (lifespan months × 30). Over 60 months, cheap item is bought ⌈60 ÷ life⌉ times. Injustice gap = cheap total − quality total. Timeline shows each cheap break as an ✕, quality as one continuous bar (or more if life &lt; 60mo).
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

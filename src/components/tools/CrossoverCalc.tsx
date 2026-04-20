import React, { useEffect, useMemo, useState } from 'react';
import { Repeat, ShoppingBag, TrendingUp } from 'lucide-react';

const STORAGE = 'crossover-calc-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_SUB = '#f472b6';
const COLOR_LIFE = '#22d3ee';
const COLOR_CROSS = '#facc15';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';

interface State {
  monthly: string;
  lifetime: string;
  includeOpportunity: boolean;
  returnPct: string;
}

const DEFAULT_STATE: State = { monthly: '12', lifetime: '299', includeOpportunity: false, returnPct: '5' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$%\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function CrossoverCalc() {
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

  const monthly = parseNum(state.monthly);
  const lifetime = parseNum(state.lifetime);
  const returnPct = parseNum(state.returnPct) / 100;
  const monthlyReturn = Math.pow(1 + returnPct, 1 / 12) - 1;

  const crossoverMonth = useMemo(() => {
    if (monthly <= 0 || lifetime <= 0) return null;
    if (!state.includeOpportunity) return lifetime / monthly;
    // Solve: m * monthly >= lifetime * (1+r)^(m/12)
    // Numerical: iterate months
    for (let m = 1; m <= 600; m++) {
      const subTotal = m * monthly;
      const lifetimeGrown = lifetime * Math.pow(1 + monthlyReturn, m);
      if (subTotal >= lifetimeGrown) return m;
    }
    return null;
  }, [monthly, lifetime, state.includeOpportunity, monthlyReturn]);

  const horizonMonths = Math.min(crossoverMonth ? Math.ceil(crossoverMonth * 1.4) : 60, 240);
  const steps = useMemo(() => {
    const out: { month: number; sub: number; life: number }[] = [];
    for (let m = 0; m <= horizonMonths; m++) {
      const sub = m * monthly;
      const life = state.includeOpportunity ? lifetime * Math.pow(1 + monthlyReturn, m) : lifetime;
      out.push({ month: m, sub, life });
    }
    return out;
  }, [monthly, lifetime, state.includeOpportunity, monthlyReturn, horizonMonths]);

  const W = 560, H = 200, PAD_L = 42, PAD_R = 16, PAD_T = 14, PAD_B = 26;
  const maxY = Math.max(...steps.map((s) => Math.max(s.sub, s.life)), 1);
  const xScale = (m: number) => PAD_L + (m / horizonMonths) * (W - PAD_L - PAD_R);
  const yScale = (v: number) => H - PAD_B - (v / maxY) * (H - PAD_T - PAD_B);
  const subPath = steps.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s.month).toFixed(1)} ${yScale(s.sub).toFixed(1)}`).join(' ');
  const lifePath = steps.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s.month).toFixed(1)} ${yScale(s.life).toFixed(1)}`).join(' ');

  const crossYears = crossoverMonth ? crossoverMonth / 12 : null;
  const verdict = (() => {
    if (crossoverMonth === null) return { text: 'NO CROSSOVER', color: COLOR_DANGER };
    if (crossoverMonth < 12) return { text: `Buy if using > ${Math.ceil(crossoverMonth)} months`, color: COLOR_CROSS };
    if (crossoverMonth < 36) return { text: `Buy if using > ${crossYears!.toFixed(1)} years`, color: COLOR_CROSS };
    if (crossoverMonth < 120) return { text: `Buy only if using > ${crossYears!.toFixed(1)} years`, color: COLOR_WARN };
    return { text: 'Subscription wins — lifetime price too high', color: COLOR_DANGER };
  })();

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Repeat size={22} color={COLOR_SUB} />
          <div>
            <div style={title}>THE_CROSSOVER</div>
            <div style={subtitle}>Subscription vs lifetime — the month the sub becomes a loss</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Monthly Subscription" prefix="$" value={state.monthly} onChange={(v) => setState((s) => ({ ...s, monthly: v }))} />
        <InputCell label="Lifetime Price" prefix="$" value={state.lifetime} onChange={(v) => setState((s) => ({ ...s, lifetime: v }))} />
      </div>

      <div style={{ ...panel, padding: 14, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>OPPORTUNITY COST</div>
          <div style={{ fontSize: 12, color: COLOR_TEXT, marginTop: 4 }}>Model the lifetime sum as if invested at {state.returnPct}% annually.</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="number"
            step="0.25" min="0" max="20"
            value={state.returnPct}
            onChange={(e) => setState((s) => ({ ...s, returnPct: e.target.value }))}
            disabled={!state.includeOpportunity}
            style={{
              width: 70, background: 'transparent',
              border: `1px solid ${COLOR_BORDER}`,
              color: state.includeOpportunity ? COLOR_TEXT : COLOR_DIM,
              padding: '4px 6px', borderRadius: 4,
              fontFamily: 'inherit', fontSize: 14, textAlign: 'right',
            }}
          />
          <span style={{ color: COLOR_DIM, fontSize: 12 }}>%/yr</span>
          <button
            onClick={() => setState((s) => ({ ...s, includeOpportunity: !s.includeOpportunity }))}
            style={{
              padding: '6px 12px',
              border: `1px solid ${state.includeOpportunity ? COLOR_LIFE : COLOR_BORDER}`,
              color: state.includeOpportunity ? COLOR_LIFE : COLOR_DIM,
              background: state.includeOpportunity ? 'rgba(34,211,238,0.08)' : 'transparent',
              borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, letterSpacing: '.12em', fontWeight: 700,
            }}
          >
            {state.includeOpportunity ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Verdict */}
      <div style={{ ...panel, padding: 18, textAlign: 'center', borderColor: verdict.color, boxShadow: `0 0 24px ${verdict.color}22`, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>VERDICT</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: verdict.color }}>{verdict.text}</div>
        {crossoverMonth !== null && (
          <div style={{ fontSize: 13, color: COLOR_DIM, marginTop: 6 }}>
            Crossover at month {Math.ceil(crossoverMonth)} — subscription cost equals the {state.includeOpportunity ? 'invested ' : ''}lifetime purchase.
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ fontSize: 11, letterSpacing: '.14em', color: COLOR_DIM }}>CUMULATIVE COST</div>
          <div style={{ display: 'flex', gap: 12, fontSize: 11 }}>
            <LegendDot color={COLOR_SUB} label="Subscription" />
            <LegendDot color={COLOR_LIFE} label={state.includeOpportunity ? 'Lifetime (opportunity-adj)' : 'Lifetime'} />
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
          {[0.25, 0.5, 0.75].map((f) => (
            <line key={f} x1={PAD_L} x2={W - PAD_R} y1={PAD_T + f * (H - PAD_T - PAD_B)} y2={PAD_T + f * (H - PAD_T - PAD_B)} stroke={COLOR_BORDER} strokeWidth={0.5} strokeDasharray="2 3" />
          ))}
          <line x1={PAD_L} y1={H - PAD_B} x2={W - PAD_R} y2={H - PAD_B} stroke={COLOR_BORDER} strokeWidth={1} />
          <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={H - PAD_B} stroke={COLOR_BORDER} strokeWidth={1} />
          <path d={subPath} fill="none" stroke={COLOR_SUB} strokeWidth={2} />
          <path d={lifePath} fill="none" stroke={COLOR_LIFE} strokeWidth={2} />
          {crossoverMonth !== null && crossoverMonth <= horizonMonths && (
            <g>
              <line x1={xScale(crossoverMonth)} x2={xScale(crossoverMonth)} y1={PAD_T} y2={H - PAD_B} stroke={COLOR_CROSS} strokeWidth={1.2} strokeDasharray="4 3" />
              <circle cx={xScale(crossoverMonth)} cy={yScale(crossoverMonth * monthly)} r={4} fill={COLOR_CROSS} />
              <text x={xScale(crossoverMonth) + 6} y={PAD_T + 10} fill={COLOR_CROSS} fontSize={10} fontFamily="monospace">CROSSOVER</text>
            </g>
          )}
          {[12, 24, 36, 60, 120].filter((m) => m <= horizonMonths).map((m) => (
            <text key={m} x={xScale(m)} y={H - PAD_B + 14} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="middle">{m / 12}y</text>
          ))}
          <text x={PAD_L - 4} y={PAD_T + 4} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">{formatCurrency(maxY)}</text>
          <text x={PAD_L - 4} y={H - PAD_B + 4} fill={COLOR_DIM} fontSize={9} fontFamily="monospace" textAnchor="end">$0</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        <Metric label="1 Year Sub" value={formatCurrency(monthly * 12)} color={COLOR_SUB} icon={<Repeat size={12} />} />
        <Metric label="5 Year Sub" value={formatCurrency(monthly * 60)} color={COLOR_SUB} icon={<TrendingUp size={12} />} />
        <Metric label="Lifetime Price" value={formatCurrency(lifetime)} color={COLOR_LIFE} icon={<ShoppingBag size={12} />} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Crossover = Lifetime ÷ Monthly — the month cumulative subscription cost overtakes the one-time purchase. Enable Opportunity Cost to compound the lifetime sum at your chosen annual return; the crossover then solves against the grown alternative.
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
      <div style={{ fontSize: 18, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputsGrid: React.CSSProperties = { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 14 };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

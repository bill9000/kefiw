import React, { useEffect, useMemo, useState } from 'react';
import { Scale, Activity, AlertTriangle } from 'lucide-react';
import { writeField } from '~/lib/session-context';

const STORAGE = 'break-even-calculator-v1';
const PIPELINE_MONTHS_KEY = 'break_even_months';
const PIPELINE_UNITS_KEY = 'break_even_units';
const PIPELINE_SOURCE = 'break-even-calculator';
const PIPELINE_LABEL = 'Break-Even Calculator';

const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_OK = '#4ade80';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';
const COLOR_ACCENT = '#22d3ee';

type Mode = 'business' | 'decision';

interface State {
  mode: Mode;
  fixed: string;
  price: string;
  variable: string;
  upfront: string;
  savings: string;
  recurring: string;
}

const DEFAULT_STATE: State = {
  mode: 'business',
  fixed: '5000',
  price: '25',
  variable: '10',
  upfront: '1200',
  savings: '100',
  recurring: '0',
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
function formatMonths(months: number): string {
  if (!Number.isFinite(months) || months < 0) return '—';
  const y = Math.floor(months / 12);
  const m = Math.round(months - y * 12);
  if (y === 0) return `${m}mo`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}mo`;
}

export default function BreakEvenCalculator() {
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
    if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state));
  }, [state, hydrated]);

  const businessResult = useMemo(() => {
    const f = parseNum(state.fixed);
    const p = parseNum(state.price);
    const v = parseNum(state.variable);
    const margin = p - v;
    if (margin <= 0) return { invalid: true as const, f, p, v, margin };
    const units = f / margin;
    return { invalid: false as const, f, p, v, margin, units, revenue: units * p };
  }, [state.fixed, state.price, state.variable]);

  const decisionResult = useMemo(() => {
    const u = parseNum(state.upfront);
    const s = parseNum(state.savings);
    const r = parseNum(state.recurring);
    const net = s - r;
    if (net <= 0) return { invalid: true as const, u, s, r, net };
    return { invalid: false as const, u, s, r, net, months: u / net };
  }, [state.upfront, state.savings, state.recurring]);

  useEffect(() => {
    if (!hydrated) return;
    if (state.mode === 'business' && !businessResult.invalid) {
      writeField(PIPELINE_UNITS_KEY, businessResult.units, PIPELINE_SOURCE, PIPELINE_LABEL);
    }
    if (state.mode === 'decision' && !decisionResult.invalid) {
      writeField(PIPELINE_MONTHS_KEY, decisionResult.months, PIPELINE_SOURCE, PIPELINE_LABEL);
    }
  }, [state.mode, businessResult, decisionResult, hydrated]);

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Scale size={22} color={COLOR_ACCENT} />
          <div>
            <div style={title}>BREAK_EVEN</div>
            <div style={subtitle}>Units to clear fixed cost, or months to recover upfront outlay</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <ModeBtn active={state.mode === 'business'} onClick={() => setState((s) => ({ ...s, mode: 'business' }))}>
            BUSINESS
          </ModeBtn>
          <ModeBtn active={state.mode === 'decision'} onClick={() => setState((s) => ({ ...s, mode: 'decision' }))}>
            DECISION
          </ModeBtn>
        </div>
      </div>

      {state.mode === 'business' ? (
        <>
          <div style={inputsGrid}>
            <InputCell label="Fixed Costs" prefix="$" value={state.fixed} onChange={(v) => setState((s) => ({ ...s, fixed: v }))} />
            <InputCell label="Price / Unit" prefix="$" value={state.price} onChange={(v) => setState((s) => ({ ...s, price: v }))} />
            <InputCell label="Variable Cost / Unit" prefix="$" value={state.variable} onChange={(v) => setState((s) => ({ ...s, variable: v }))} />
          </div>

          {businessResult.invalid ? (
            <Warning>
              Price per unit must exceed variable cost per unit. Contribution margin is {formatCurrency(businessResult.margin)} — no break-even exists.
            </Warning>
          ) : (
            <>
              <div style={resultPanel(COLOR_OK)}>
                <div style={resultLabel}>UNITS TO BREAK EVEN</div>
                <div style={{ ...resultValue, color: COLOR_OK }}>
                  {Math.ceil(businessResult.units).toLocaleString()}
                  <span style={{ fontSize: 18, color: COLOR_DIM, fontWeight: 600, marginLeft: 8 }}>units</span>
                </div>
                <div style={resultSub}>Revenue at break-even: {formatCurrency(businessResult.revenue)}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
                <Metric label="Contribution Margin" value={formatCurrency(businessResult.margin)} color={COLOR_OK} />
                <Metric label="Margin Ratio" value={`${((businessResult.margin / businessResult.p) * 100).toFixed(1)}%`} color={COLOR_ACCENT} />
                <Metric label="Profit @ 1.5× BE" value={formatCurrency(Math.ceil(businessResult.units * 1.5) * businessResult.margin - businessResult.f)} color={COLOR_OK} />
                <Metric label="Profit @ 2× BE" value={formatCurrency(Math.ceil(businessResult.units * 2) * businessResult.margin - businessResult.f)} color={COLOR_OK} />
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div style={inputsGrid}>
            <InputCell label="Upfront Cost" prefix="$" value={state.upfront} onChange={(v) => setState((s) => ({ ...s, upfront: v }))} />
            <InputCell label="Monthly Savings / Gain" prefix="$" value={state.savings} onChange={(v) => setState((s) => ({ ...s, savings: v }))} />
            <InputCell label="Monthly Recurring Cost" prefix="$" value={state.recurring} onChange={(v) => setState((s) => ({ ...s, recurring: v }))} />
          </div>

          {decisionResult.invalid ? (
            <Warning>
              Recurring costs ({formatCurrency(decisionResult.r)}/mo) meet or exceed monthly savings ({formatCurrency(decisionResult.s)}/mo). Net {formatCurrency(decisionResult.net)}/mo — no break-even.
            </Warning>
          ) : (
            <>
              <div style={resultPanel(COLOR_OK)}>
                <div style={resultLabel}>MONTHS TO PAYBACK</div>
                <div style={{ ...resultValue, color: COLOR_OK }}>
                  {formatMonths(decisionResult.months)}
                  <span style={{ fontSize: 18, color: COLOR_DIM, fontWeight: 600, marginLeft: 8 }}>
                    · {decisionResult.months.toFixed(1)} mo
                  </span>
                </div>
                <div style={resultSub}>Net monthly benefit: {formatCurrency(decisionResult.net)}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
                <Metric label="Net Monthly" value={formatCurrency(decisionResult.net)} color={COLOR_OK} />
                <Metric label="Year-1 Gain" value={formatCurrency(decisionResult.net * 12 - decisionResult.u)} color={decisionResult.net * 12 - decisionResult.u > 0 ? COLOR_OK : COLOR_WARN} />
                <Metric label="Year-2 Gain" value={formatCurrency(decisionResult.net * 24 - decisionResult.u)} color={COLOR_OK} />
                <Metric label="@ +$10/mo net" value={formatMonths(decisionResult.u / (decisionResult.net + 10))} color={COLOR_ACCENT} />
              </div>
            </>
          )}
        </>
      )}

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        {state.mode === 'business'
          ? 'Units to break even = Fixed ÷ (Price − Variable). Contribution margin is the per-unit dollar flow into fixed-cost recovery. Above break-even, every unit contributes pure profit; below, every unit widens the loss.'
          : 'Months to payback = Upfront ÷ (Monthly Savings − Monthly Recurring). Net monthly benefit is what actually flows into recovery after ongoing costs. A positive decision requires positive net — otherwise you accelerate the loss.'}
      </div>
    </div>
  );
}

function ModeBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        border: `1px solid ${active ? COLOR_ACCENT : COLOR_BORDER}`,
        background: active ? `${COLOR_ACCENT}11` : 'transparent',
        color: active ? COLOR_ACCENT : COLOR_DIM,
        borderRadius: 6,
        fontSize: 11,
        letterSpacing: '.12em',
        fontFamily: 'inherit',
        fontWeight: 700,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
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
        <Activity size={12} color={color} />
        {label}
      </div>
      <div style={{ fontSize: 18, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        ...panel,
        padding: 12,
        marginBottom: 14,
        borderColor: COLOR_DANGER,
        background: 'rgba(239,68,68,0.08)',
        color: COLOR_DANGER,
        fontSize: 12,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <AlertTriangle size={14} /> {children}
    </div>
  );
}

const wrap: React.CSSProperties = {
  padding: 24,
  background: COLOR_BG,
  color: COLOR_TEXT,
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  minHeight: '100%',
  borderRadius: 12,
  border: `1px solid ${COLOR_BORDER}`,
};
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputsGrid: React.CSSProperties = { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 14 };
const inputStyle: React.CSSProperties = { flex: 1, background: 'transparent', border: 'none', borderBottom: `1px solid ${COLOR_BORDER}`, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 18, fontWeight: 600, outline: 'none', padding: '2px 0', minWidth: 0 };
const resultPanel = (color: string): React.CSSProperties => ({ ...panel, padding: 18, textAlign: 'center', borderColor: color, boxShadow: `0 0 20px ${color}22`, marginBottom: 14 });
const resultLabel: React.CSSProperties = { fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 };
const resultValue: React.CSSProperties = { fontSize: 40, fontWeight: 800, letterSpacing: '.02em', color: COLOR_TEXT };
const resultSub: React.CSSProperties = { fontSize: 13, color: COLOR_DIM, marginTop: 6 };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

import React, { useEffect, useMemo, useState } from 'react';
import { Zap, AlertTriangle, Activity } from 'lucide-react';

const STORAGE = 'tech-debt-interest-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_OK = '#4ade80';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';

interface State {
  initialFixHours: string;
  growthPctMonthly: string;
  months: string;
  codeVelocity: string;
}
const DEFAULT_STATE: State = { initialFixHours: '6', growthPctMonthly: '8', months: '18', codeVelocity: '5' };

const MAX_MONTHS = 36;
const HEAT_BANDS = [
  { max: 10, color: '#334155' },
  { max: 25, color: COLOR_OK },
  { max: 60, color: COLOR_WARN },
  { max: Infinity, color: COLOR_DANGER },
];

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function bandColor(hours: number): string {
  return HEAT_BANDS.find((b) => hours < b.max)!.color;
}

export default function TechDebtInterest() {
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

  const initial = parseNum(state.initialFixHours);
  const growthBase = parseNum(state.growthPctMonthly) / 100;
  const velocity = Math.max(1, parseNum(state.codeVelocity)); // features per month on top
  const months = Math.max(1, Math.min(MAX_MONTHS, parseNum(state.months)));
  const effectiveGrowth = growthBase * (1 + velocity / 10);

  const cells = useMemo(() => {
    const out: { month: number; hours: number }[] = [];
    for (let m = 0; m <= months; m++) {
      out.push({ month: m, hours: initial * Math.pow(1 + effectiveGrowth, m) });
    }
    return out;
  }, [initial, effectiveGrowth, months]);

  const payoffHours = cells[cells.length - 1].hours;
  const multiple = initial > 0 ? payoffHours / initial : 0;
  const debtDate = new Date();
  debtDate.setMonth(debtDate.getMonth() + months);

  // Heat map grid — 12 cols, up to 3 rows
  const cols = Math.min(12, Math.max(1, months));
  const heatCells = cells.slice(0, months);

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={22} color={COLOR_WARN} />
          <div>
            <div style={title}>TECH_DEBT_INTEREST</div>
            <div style={subtitle}>Quantifies the compounding cost of shipping a hack now</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Initial Fix Hours" value={state.initialFixHours} onChange={(v) => setState((s) => ({ ...s, initialFixHours: v }))} />
        <InputCell label="Monthly Growth %" value={state.growthPctMonthly} onChange={(v) => setState((s) => ({ ...s, growthPctMonthly: v }))} />
        <InputCell label="Code Velocity (feats/mo)" value={state.codeVelocity} onChange={(v) => setState((s) => ({ ...s, codeVelocity: v }))} />
        <InputCell label="Wait Months" value={state.months} onChange={(v) => setState((s) => ({ ...s, months: v }))} />
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: bandColor(payoffHours) }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>DEBT PAYOFF AT MONTH {months}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: bandColor(payoffHours) }}>{payoffHours.toFixed(1)} hrs</span>
          <span style={{ fontSize: 16, color: COLOR_DIM }}>{multiple.toFixed(1)}× the original {initial}hr fix</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>
          Debt date: <span style={{ color: COLOR_TEXT, fontWeight: 700 }}>{debtDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>.
          Effective compounding rate {(effectiveGrowth * 100).toFixed(1)}%/mo (includes velocity multiplier).
        </div>
        {multiple > 4 && (
          <div style={{ marginTop: 10, padding: '8px 12px', border: `1px solid ${COLOR_DANGER}`, borderRadius: 6, background: 'rgba(239,68,68,0.08)', color: COLOR_DANGER, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={14} /> Payoff exceeds 4× original fix. Schedule repayment before more features build on top.
          </div>
        )}
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>MAINTENANCE BURDEN HEATMAP</div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 4 }}>
          {heatCells.map((c) => {
            const bg = bandColor(c.hours);
            return (
              <div key={c.month} title={`M${c.month + 1}: ${c.hours.toFixed(1)}h`}
                   style={{ background: bg, aspectRatio: '1', borderRadius: 3, padding: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 36 }}>
                <span style={{ fontSize: 9, color: COLOR_BG, fontWeight: 700 }}>M{c.month + 1}</span>
                <span style={{ fontSize: 10, color: COLOR_BG, fontWeight: 700, textAlign: 'right' }}>{c.hours.toFixed(0)}h</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, display: 'flex', gap: 10, fontSize: 10, color: COLOR_DIM }}>
          <span><span style={{ background: '#334155', display: 'inline-block', width: 10, height: 10, marginRight: 4 }} />&lt;10h</span>
          <span><span style={{ background: COLOR_OK, display: 'inline-block', width: 10, height: 10, marginRight: 4 }} />10–25h</span>
          <span><span style={{ background: COLOR_WARN, display: 'inline-block', width: 10, height: 10, marginRight: 4 }} />25–60h</span>
          <span><span style={{ background: COLOR_DANGER, display: 'inline-block', width: 10, height: 10, marginRight: 4 }} />60h+</span>
        </div>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Payoff hours = initial fix × (1 + effective growth)^months. Effective growth = base monthly growth × (1 + velocity/10) — each new feature built on top compounds the tangle. Interest accelerates when multiple features hit the same hack; isolated shortcuts decay slower.
      </div>
    </div>
  );
}

function InputCell({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ ...panel, padding: 12 }}>
      <label style={{ fontSize: 10, letterSpacing: '.16em', color: COLOR_DIM, display: 'block', marginBottom: 6 }}>{label}</label>
      <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </div>
  );
}
// Metric helper not used here — kept layout lean with heatmap
// eslint-disable-next-line @typescript-eslint/no-unused-vars
void Activity;

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputsGrid: React.CSSProperties = { display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', marginBottom: 14 };
const inputStyle: React.CSSProperties = { width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${COLOR_BORDER}`, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 18, fontWeight: 600, outline: 'none', padding: '2px 0' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

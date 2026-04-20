import React, { useEffect, useMemo, useState } from 'react';
import { Target, Activity } from 'lucide-react';

const STORAGE = 'vice-to-value-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_GOAL = '#4ade80';
const COLOR_VICE = '#f472b6';
const COLOR_GOLD = '#facc15';

interface State {
  viceCost: string;
  frequencyPerWeek: string;
  goalName: string;
  goalCost: string;
  daysAbstained: string;
}
const DEFAULT_STATE: State = {
  viceCost: '12',
  frequencyPerWeek: '5',
  goalName: 'Work boots',
  goalCost: '180',
  daysAbstained: '14',
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function ViceToValue() {
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

  const cost = parseNum(state.viceCost);
  const freq = parseNum(state.frequencyPerWeek);
  const goalCost = parseNum(state.goalCost);
  const daysAb = parseNum(state.daysAbstained);

  const dailyAvg = (cost * freq) / 7;
  const weeklyAvg = cost * freq;
  const monthlyAvg = weeklyAvg * 4.33;
  const yearlyAvg = weeklyAvg * 52;

  const saved = dailyAvg * daysAb;
  const daysToGoal = dailyAvg > 0 ? goalCost / dailyAvg : Infinity;
  const remaining = Math.max(0, goalCost - saved);
  const daysRemaining = dailyAvg > 0 ? remaining / dailyAvg : Infinity;
  const pct = goalCost > 0 ? Math.min(1, saved / goalCost) : 0;
  const achieved = saved >= goalCost;

  const goalDate = useMemo(() => {
    if (!Number.isFinite(daysRemaining)) return '—';
    const d = new Date();
    d.setDate(d.getDate() + Math.ceil(daysRemaining));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }, [daysRemaining]);

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={22} color={COLOR_GOAL} />
          <div>
            <div style={title}>VICE_TO_VALUE</div>
            <div style={subtitle}>Turn the cost of a habit into the price of something you actually need</div>
          </div>
        </div>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Cost per Vice" prefix="$" value={state.viceCost} onChange={(v) => setState((s) => ({ ...s, viceCost: v }))} />
        <InputCell label="Times per Week" value={state.frequencyPerWeek} onChange={(v) => setState((s) => ({ ...s, frequencyPerWeek: v }))} />
        <TextCell label="Goal" value={state.goalName} onChange={(v) => setState((s) => ({ ...s, goalName: v }))} />
        <InputCell label="Goal Cost" prefix="$" value={state.goalCost} onChange={(v) => setState((s) => ({ ...s, goalCost: v }))} />
        <InputCell label="Days Abstained" value={state.daysAbstained} onChange={(v) => setState((s) => ({ ...s, daysAbstained: v }))} />
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: achieved ? COLOR_GOAL : COLOR_GOLD }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM }}>PROGRESS TO GOAL</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLOR_TEXT, marginTop: 4 }}>{state.goalName || 'Goal'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: achieved ? COLOR_GOAL : COLOR_GOLD }}>
              {Math.round(pct * 100)}%
            </div>
            <div style={{ fontSize: 11, color: COLOR_DIM }}>{formatCurrency(saved)} of {formatCurrency(goalCost)}</div>
          </div>
        </div>
        <div style={{ height: 18, background: COLOR_BORDER, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ width: `${pct * 100}%`, height: '100%', background: achieved ? COLOR_GOAL : COLOR_GOLD, transition: 'width 320ms ease' }} />
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: COLOR_DIM }}>
          {achieved ? (
            <span style={{ color: COLOR_GOAL, fontWeight: 700 }}>Goal reached — cash equivalent to {state.goalName} has been saved.</span>
          ) : (
            <>At this abstinence rate, you reach the goal in <span style={{ color: COLOR_TEXT, fontWeight: 700 }}>{Number.isFinite(daysRemaining) ? `${Math.ceil(daysRemaining)} more days` : '—'}</span> ({goalDate}).</>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Daily Cost" value={formatCurrency(dailyAvg)} color={COLOR_VICE} />
        <Metric label="Weekly Cost" value={formatCurrency(weeklyAvg)} color={COLOR_VICE} />
        <Metric label="Monthly Cost" value={formatCurrency(monthlyAvg)} color={COLOR_VICE} />
        <Metric label="Annual Cost" value={formatCurrency(yearlyAvg)} color={COLOR_VICE} />
      </div>

      <div style={{ ...panel, padding: 14, marginBottom: 14, borderColor: COLOR_GOLD }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 4 }}>DAYS TO GOAL (FRESH START)</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 32, fontWeight: 800, color: COLOR_GOLD }}>
            {Number.isFinite(daysToGoal) ? Math.ceil(daysToGoal) : '∞'}
          </span>
          <span style={{ fontSize: 14, color: COLOR_DIM }}>days of abstinence to fund {state.goalName || 'the goal'}.</span>
        </div>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Daily vice cost = (cost per occurrence × frequency per week) ÷ 7. Saved = daily cost × days abstained. The tool is arithmetic, not judgment — it just converts abstinence into usable progress toward a named thing. Replacement framing beats willpower: a habit is easier to trade than to quit.
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
function TextCell({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ ...panel, padding: 12 }}>
      <label style={{ fontSize: 10, letterSpacing: '.16em', color: COLOR_DIM, display: 'block', marginBottom: 6 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
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
const inputStyle: React.CSSProperties = { flex: 1, width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${COLOR_BORDER}`, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 18, fontWeight: 600, outline: 'none', padding: '2px 0', minWidth: 0 };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

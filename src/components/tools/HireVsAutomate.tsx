import React, { useEffect, useMemo, useState } from 'react';
import { Users, Cpu, Activity } from 'lucide-react';

const STORAGE = 'hire-vs-automate-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_HUMAN = '#f472b6';
const COLOR_BOT = '#22d3ee';
const COLOR_WINNER = '#4ade80';
const COLOR_WARN = '#f59e0b';

interface State {
  hourlyWage: string;
  hoursPerMonth: string;
  toolMonthly: string;
  setupHours: string;
  tasksPerMonth: string;
  managerOverhead: boolean;
  overheadPct: string;
}

const DEFAULT_STATE: State = {
  hourlyWage: '25',
  hoursPerMonth: '40',
  toolMonthly: '180',
  setupHours: '10',
  tasksPerMonth: '200',
  managerOverhead: true,
  overheadPct: '18',
};

const SETUP_AMORTIZE_MONTHS = 12;

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function HireVsAutomate() {
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

  const wage = parseNum(state.hourlyWage);
  const hours = parseNum(state.hoursPerMonth);
  const tool = parseNum(state.toolMonthly);
  const setup = parseNum(state.setupHours);
  const tasks = parseNum(state.tasksPerMonth);
  const overhead = parseNum(state.overheadPct) / 100;

  const { humanCost, botCost, verdict, winner, savings } = useMemo(() => {
    const overheadMul = state.managerOverhead ? 1 + overhead : 1;
    const human = wage * hours * overheadMul;
    const amortizedSetup = (setup * wage) / SETUP_AMORTIZE_MONTHS;
    const bot = tool + amortizedSetup;
    if (human === bot) return { humanCost: human, botCost: bot, verdict: 'EVEN', winner: 'even' as const, savings: 0 };
    const win: 'human' | 'bot' = human < bot ? 'human' : 'bot';
    return {
      humanCost: human,
      botCost: bot,
      verdict: win === 'human' ? 'HIRE A HUMAN' : 'AUTOMATE',
      winner: win,
      savings: Math.abs(human - bot),
    };
  }, [wage, hours, tool, setup, state.managerOverhead, overhead]);

  const costPerTaskHuman = tasks > 0 ? humanCost / tasks : 0;
  const costPerTaskBot = tasks > 0 ? botCost / tasks : 0;
  const maxBar = Math.max(humanCost, botCost, 1);
  const humanPct = (humanCost / maxBar) * 100;
  const botPct = (botCost / maxBar) * 100;

  const winnerColor = winner === 'human' ? COLOR_HUMAN : winner === 'bot' ? COLOR_BOT : COLOR_WARN;

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Users size={22} color={COLOR_HUMAN} />
          <span style={{ color: COLOR_DIM }}>/</span>
          <Cpu size={22} color={COLOR_BOT} />
          <div>
            <div style={title}>HIRE_VS_AUTOMATE</div>
            <div style={subtitle}>Labor replacement — human assistant vs SaaS/automation stack</div>
          </div>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: COLOR_DIM, cursor: 'pointer' }}>
          <input type="checkbox" checked={state.managerOverhead} onChange={(e) => setState((s) => ({ ...s, managerOverhead: e.target.checked }))} />
          MANAGER_OVERHEAD
        </label>
      </div>

      <div style={inputsGrid}>
        <InputCell label="Hourly Wage" prefix="$" value={state.hourlyWage} onChange={(v) => setState((s) => ({ ...s, hourlyWage: v }))} />
        <InputCell label="Hours / Month" value={state.hoursPerMonth} onChange={(v) => setState((s) => ({ ...s, hoursPerMonth: v }))} />
        <InputCell label="Tool Stack / Month" prefix="$" value={state.toolMonthly} onChange={(v) => setState((s) => ({ ...s, toolMonthly: v }))} />
        <InputCell label="Setup Hours (one-time)" value={state.setupHours} onChange={(v) => setState((s) => ({ ...s, setupHours: v }))} />
        <InputCell label="Tasks / Month" value={state.tasksPerMonth} onChange={(v) => setState((s) => ({ ...s, tasksPerMonth: v }))} />
        {state.managerOverhead && <InputCell label="Overhead %" value={state.overheadPct} onChange={(v) => setState((s) => ({ ...s, overheadPct: v }))} />}
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: winnerColor, boxShadow: `0 0 24px ${winnerColor}22` }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>VERDICT</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: winnerColor, letterSpacing: '.02em' }}>{verdict}</div>
        <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>
          Saves <span style={{ color: COLOR_WINNER, fontWeight: 700 }}>{formatCurrency(savings)}/mo</span> vs the alternative.
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>EFFICIENCY BAR — Monthly Cost</div>
        <BarRow label="Human" value={humanCost} pct={humanPct} color={COLOR_HUMAN} sub={`${formatCurrency(costPerTaskHuman)}/task`} />
        <div style={{ height: 10 }} />
        <BarRow label="Automation" value={botCost} pct={botPct} color={COLOR_BOT} sub={`${formatCurrency(costPerTaskBot)}/task`} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Human Monthly" value={formatCurrency(humanCost)} color={COLOR_HUMAN} />
        <Metric label="Bot Monthly" value={formatCurrency(botCost)} color={COLOR_BOT} />
        <Metric label="Amortized Setup" value={formatCurrency((setup * wage) / SETUP_AMORTIZE_MONTHS)} color={COLOR_WARN} />
        <Metric label="Overhead Load" value={state.managerOverhead ? `${Math.round(overhead * 100)}%` : 'off'} color={COLOR_DIM} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Human cost = wage × hours × (1 + overhead %). Automation cost = tool subscriptions + (setup hours × wage ÷ 12). Setup amortizes over one year — short-tenure tasks favor humans; long-running pipelines favor tools. Manager overhead adds a silent drag to humans for meetings, reviews, and rework.
      </div>
    </div>
  );
}

function BarRow({ label, value, pct, color, sub }: { label: string; value: number; pct: number; color: string; sub: string }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
        <span style={{ color: COLOR_TEXT, letterSpacing: '.12em', fontWeight: 700 }}>{label}</span>
        <span style={{ color: COLOR_DIM }}>{sub}</span>
      </div>
      <div style={{ height: 18, background: COLOR_BORDER, borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 240ms ease' }} />
        <span style={{ position: 'absolute', right: 8, top: 1, fontSize: 11, color: COLOR_TEXT, fontWeight: 700 }}>
          ${Math.round(value).toLocaleString()}
        </span>
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

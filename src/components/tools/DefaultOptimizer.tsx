import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Plus, Trash2, Shield } from 'lucide-react';

const STORAGE = 'default-optimizer-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_RED = '#ef4444';
const COLOR_ORANGE = '#f59e0b';
const COLOR_GOLD = '#facc15';
const COLOR_GREEN = '#4ade80';

const TIERS = [
  { v: 1, label: 'Life Support', note: 'Housing · Electric · Water', color: COLOR_RED },
  { v: 2, label: 'Asset Retention', note: 'Car · Vehicle loan', color: COLOR_ORANGE },
  { v: 3, label: 'Connectivity', note: 'Internet · Phone', color: COLOR_GOLD },
  { v: 4, label: 'Unsecured', note: 'Credit cards · Consumer debt', color: COLOR_GREEN },
];

interface Bill { id: string; name: string; amount: string; tier: number; paid: boolean; }
interface State { bills: Bill[]; cashAvailable: string; }
const DEFAULT_STATE: State = {
  cashAvailable: '600',
  bills: [
    { id: 'b1', name: 'Rent', amount: '1200', tier: 1, paid: false },
    { id: 'b2', name: 'Electric', amount: '180', tier: 1, paid: false },
    { id: 'b3', name: 'Car payment', amount: '420', tier: 2, paid: false },
    { id: 'b4', name: 'Internet', amount: '80', tier: 3, paid: false },
    { id: 'b5', name: 'Credit card min', amount: '95', tier: 4, paid: false },
  ],
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}
function newId(): string { return `b${Math.random().toString(36).slice(2, 8)}`; }

export default function DefaultOptimizer() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) { const loaded = JSON.parse(raw) as State; if (loaded.bills && loaded.bills.length) setState(loaded); }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const ranked = useMemo(() => [...state.bills].sort((a, b) => a.tier - b.tier || parseNum(b.amount) - parseNum(a.amount)), [state.bills]);

  const { plan, leftover, tier1Unpaid, systemCritical } = useMemo(() => {
    const cash = parseNum(state.cashAvailable);
    let rem = cash;
    const plan: Record<string, boolean> = {};
    for (const r of ranked) {
      const amt = parseNum(r.amount);
      if (rem >= amt && amt > 0) { plan[r.id] = true; rem -= amt; }
      else plan[r.id] = false;
    }
    const tier1Unpaid = ranked.some((r) => r.tier === 1 && !plan[r.id] && parseNum(r.amount) > 0);
    return { plan, leftover: rem, tier1Unpaid, systemCritical: tier1Unpaid };
  }, [ranked, state.cashAvailable]);

  function update(id: string, patch: Partial<Bill>) {
    setState((s) => ({ ...s, bills: s.bills.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  }
  function add() { setState((s) => ({ ...s, bills: [...s.bills, { id: newId(), name: 'New bill', amount: '0', tier: 4, paid: false }] })); }
  function remove(id: string) { setState((s) => ({ ...s, bills: s.bills.filter((b) => b.id !== id) })); }

  return (
    <div style={{ ...wrap, animation: systemCritical ? 'sysCrit 1.6s ease-in-out infinite' : undefined }}>
      <style>{`@keyframes sysCrit { 0%, 100% { background: ${COLOR_BG}; } 50% { background: ${COLOR_RED}14; } }`}</style>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={22} color={systemCritical ? COLOR_RED : COLOR_ORANGE} />
          <div>
            <div style={title}>DEFAULT_OPTIMIZER</div>
            <div style={subtitle}>Pay the critical tiers first — unsecured can wait</div>
          </div>
        </div>
        <button onClick={add} style={{ ...btnStyle, border: `1px solid ${COLOR_ORANGE}`, color: COLOR_ORANGE }}><Plus size={14} /> ADD_BILL</button>
      </div>

      {systemCritical && (
        <div style={{ ...panel, padding: 12, marginBottom: 14, border: `2px solid ${COLOR_RED}`, background: `${COLOR_RED}22`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={20} color={COLOR_RED} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLOR_RED, letterSpacing: '.08em' }}>SYSTEM CRITICAL</div>
            <div style={{ fontSize: 11, color: COLOR_DIM }}>Tier 1 life-support bill unfunded. Raise cash or cut lower tiers.</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Cash available" value={state.cashAvailable} onChange={(v) => setState({ ...state, cashAvailable: v })} prefix="$" />
        <Metric label="Total owed" value={formatCurrency(ranked.reduce((s, r) => s + parseNum(r.amount), 0))} color={COLOR_TEXT} />
        <Metric label="Leftover" value={formatCurrency(leftover)} color={leftover >= 0 ? COLOR_GREEN : COLOR_RED} />
        <Metric label="Tier 1 status" value={tier1Unpaid ? 'UNFUNDED' : 'COVERED'} color={tier1Unpaid ? COLOR_RED : COLOR_GREEN} />
      </div>

      <div style={{ ...panel, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 8, padding: '0 4px' }}>BILLS</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {state.bills.map((b) => (
            <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.6fr auto', gap: 6, alignItems: 'center' }}>
              <input value={b.name} onChange={(e) => update(b.id, { name: e.target.value })} placeholder="Name" style={rowInputStyle} />
              <div style={prefixWrap}><span style={prefixLabel}>$</span><input inputMode="decimal" value={b.amount} onChange={(e) => update(b.id, { amount: e.target.value })} style={{ ...rowInputStyle, border: 'none' }} /></div>
              <select value={b.tier} onChange={(e) => update(b.id, { tier: parseInt(e.target.value) })} style={selectStyle}>
                {TIERS.map((t) => <option key={t.v} value={t.v}>T{t.v} · {t.label}</option>)}
              </select>
              <button onClick={() => remove(b.id)} title="Remove" style={iconBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panel, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>LIQUIDATION STACK</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {ranked.map((r, i) => {
            const tierDef = TIERS.find((t) => t.v === r.tier) || TIERS[3];
            const pay = plan[r.id];
            return (
              <div key={r.id} style={{
                display: 'grid', gridTemplateColumns: '30px 60px 1fr 100px 70px', gap: 10, alignItems: 'center',
                padding: '8px 12px', background: COLOR_BG, border: `1.5px solid ${pay ? tierDef.color : COLOR_BORDER}`, borderRadius: 6,
                opacity: pay ? 1 : 0.55,
              }}>
                <div style={{ fontSize: 11, color: COLOR_DIM }}>#{i + 1}</div>
                <div style={{ fontSize: 10, color: tierDef.color, fontWeight: 700, letterSpacing: '.08em' }}>T{tierDef.v}</div>
                <div>
                  <div style={{ fontSize: 13, color: COLOR_TEXT, fontWeight: 700 }}>{r.name}</div>
                  <div style={{ fontSize: 10, color: COLOR_DIM }}>{tierDef.note}</div>
                </div>
                <div style={{ fontSize: 14, color: COLOR_TEXT, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(parseNum(r.amount))}</div>
                <div style={{ fontSize: 10, color: pay ? COLOR_GREEN : COLOR_RED, fontWeight: 700, letterSpacing: '.08em', textAlign: 'right' }}>{pay ? '▶ PAY' : '◌ SKIP'}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Sort by tier (1 = life support, 4 = unsecured), then by amount descending. Greedy-fill from cash available. Unpaid tier-1 bills trigger System Critical. Strategic default on tier-4 is often the mathematically correct choice when cash can't cover everything.
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
const rowInputStyle: React.CSSProperties = { padding: '8px 10px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 13, outline: 'none', width: '100%', minWidth: 0 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 4, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 14, outline: 'none' };
const prefixWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 8, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, background: COLOR_BG };
const prefixLabel: React.CSSProperties = { color: COLOR_DIM, fontSize: 11 };
const selectStyle: React.CSSProperties = { padding: '8px 10px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 12, outline: 'none' };
const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', background: 'transparent', borderRadius: 6, fontFamily: 'inherit', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer' };
const iconBtnStyle: React.CSSProperties = { padding: 8, border: `1px solid ${COLOR_BORDER}`, background: 'transparent', color: COLOR_DIM, borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

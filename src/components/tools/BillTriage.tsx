import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Plus, Trash2, Activity } from 'lucide-react';

const STORAGE = 'bill-triage-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CRIT = '#ef4444';
const COLOR_HIGH = '#f59e0b';
const COLOR_MED = '#facc15';
const COLOR_LOW = '#4ade80';

// Essential levels — match spec: 1 lowest (credit card), 4 highest (water/electric)
const ESSENTIAL_LEVELS = [
  { v: 1, label: 'Credit Card' },
  { v: 2, label: 'Internet' },
  { v: 3, label: 'Car / Rent' },
  { v: 4, label: 'Water / Electric' },
];

interface Bill {
  id: string;
  name: string;
  amount: string;
  dueDate: string;
  lateFee: string;
  essential: number;
}
interface State { bills: Bill[]; }

const DEFAULT_STATE: State = {
  bills: [
    { id: 'b1', name: 'Electric', amount: '180', dueDate: '', lateFee: '25', essential: 4 },
    { id: 'b2', name: 'Car Payment', amount: '420', dueDate: '', lateFee: '40', essential: 3 },
    { id: 'b3', name: 'Internet', amount: '80', dueDate: '', lateFee: '10', essential: 2 },
    { id: 'b4', name: 'Credit Card', amount: '250', dueDate: '', lateFee: '35', essential: 1 },
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

function bandColor(score: number): string {
  if (score >= 50) return COLOR_CRIT;
  if (score >= 35) return COLOR_HIGH;
  if (score >= 20) return COLOR_MED;
  return COLOR_LOW;
}
function bandLabel(score: number): string {
  if (score >= 50) return 'MUST PAY';
  if (score >= 35) return 'HIGH';
  if (score >= 20) return 'MEDIUM';
  return 'CAN WAIT';
}

export default function BillTriage() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const loaded = JSON.parse(raw) as State;
        if (loaded.bills && loaded.bills.length > 0) setState(loaded);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const ranked = useMemo(() => {
    const scored = state.bills.map((b) => {
      const amt = parseNum(b.amount);
      const late = parseNum(b.lateFee);
      const essScore = b.essential * 10;
      const lateScore = amt > 0 ? (late / amt) * 100 : 0;
      const score = essScore + lateScore;
      return { ...b, amount: amt, lateFee: late, score };
    });
    return scored.sort((a, b) => b.score - a.score);
  }, [state.bills]);

  const totalOwed = ranked.reduce((sum, r) => sum + r.amount, 0);
  const totalLateIfAllSkipped = ranked.reduce((sum, r) => sum + r.lateFee, 0);

  function updateBill(id: string, patch: Partial<Bill>) {
    setState((s) => ({ bills: s.bills.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  }
  function addBill() {
    setState((s) => ({ bills: [...s.bills, { id: newId(), name: 'New bill', amount: '0', dueDate: '', lateFee: '0', essential: 2 }] }));
  }
  function removeBill(id: string) {
    setState((s) => ({ bills: s.bills.filter((b) => b.id !== id) }));
  }

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={22} color={COLOR_CRIT} />
          <div>
            <div style={title}>BILL_TRIAGE</div>
            <div style={subtitle}>Rank bills by essentiality + late-fee pain — pay the right ones first</div>
          </div>
        </div>
        <button onClick={addBill} style={btnStyle}><Plus size={14} /> ADD_BILL</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Total Owed" value={formatCurrency(totalOwed)} color={COLOR_TEXT} />
        <Metric label="Bills Tracked" value={`${ranked.length}`} color={COLOR_DIM} />
        <Metric label="Fees if All Skipped" value={formatCurrency(totalLateIfAllSkipped)} color={COLOR_CRIT} />
      </div>

      <div style={{ ...panel, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 8, padding: '0 6px' }}>BILLS</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {state.bills.map((b) => (
            <div key={b.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.2fr auto', gap: 6, alignItems: 'center' }}>
              <input value={b.name} onChange={(e) => updateBill(b.id, { name: e.target.value })} placeholder="Name" style={rowInputStyle} />
              <div style={prefixWrap}>
                <span style={prefixLabel}>$</span>
                <input inputMode="decimal" value={b.amount} onChange={(e) => updateBill(b.id, { amount: e.target.value })} placeholder="Amount" style={{ ...rowInputStyle, border: 'none' }} />
              </div>
              <div style={prefixWrap}>
                <span style={prefixLabel}>fee $</span>
                <input inputMode="decimal" value={b.lateFee} onChange={(e) => updateBill(b.id, { lateFee: e.target.value })} placeholder="Late fee" style={{ ...rowInputStyle, border: 'none' }} />
              </div>
              <select value={b.essential} onChange={(e) => updateBill(b.id, { essential: parseInt(e.target.value) })} style={selectStyle}>
                {ESSENTIAL_LEVELS.map((lvl) => <option key={lvl.v} value={lvl.v}>{lvl.v} · {lvl.label}</option>)}
              </select>
              <button onClick={() => removeBill(b.id)} title="Remove" style={iconBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panel, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>TRIAGE STACK</div>
        <div style={{ display: 'grid', gap: 8 }}>
          {ranked.map((r, idx) => {
            const color = bandColor(r.score);
            const label = bandLabel(r.score);
            const isTop = idx === 0;
            return (
              <div key={r.id} style={{
                padding: '10px 14px',
                border: `2px solid ${color}`,
                borderRadius: 6,
                background: COLOR_BG,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 10,
                animation: isTop && r.score >= 50 ? 'pulse 1.8s ease-in-out infinite' : undefined,
              }}>
                <div>
                  <div style={{ fontSize: 12, color, letterSpacing: '.12em', fontWeight: 700 }}>#{idx + 1} · {label}</div>
                  <div style={{ fontSize: 16, color: COLOR_TEXT, fontWeight: 700, marginTop: 2 }}>{r.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 18, color: COLOR_TEXT, fontWeight: 700 }}>{formatCurrency(r.amount)}</div>
                  <div style={{ fontSize: 10, color: COLOR_DIM }}>late +{formatCurrency(r.lateFee)} · score {r.score.toFixed(0)}</div>
                </div>
              </div>
            );
          })}
        </div>
        <style>{`@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 ${COLOR_CRIT}66; } 50% { box-shadow: 0 0 16px 4px ${COLOR_CRIT}66; } }`}</style>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Score = (essential level × 10) + (late fee ÷ amount × 100). Essential level: 1 credit card, 2 internet, 3 car/rent, 4 water/electric. Higher essential level = higher service-cutoff pain. High late-fee-ratio bills also rise — a $25 fee on a $60 bill is brutal on a relative basis.
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
const rowInputStyle: React.CSSProperties = { padding: '8px 10px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 13, outline: 'none', minWidth: 0, width: '100%' };
const prefixWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 8, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, background: COLOR_BG };
const prefixLabel: React.CSSProperties = { color: COLOR_DIM, fontSize: 11 };
const selectStyle: React.CSSProperties = { padding: '8px 10px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 12, outline: 'none' };
const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: `1px solid ${COLOR_CRIT}`, background: 'transparent', color: COLOR_CRIT, borderRadius: 6, fontFamily: 'inherit', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer' };
const iconBtnStyle: React.CSSProperties = { padding: 8, border: `1px solid ${COLOR_BORDER}`, background: 'transparent', color: COLOR_DIM, borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

import React, { useEffect, useMemo, useState } from 'react';
import { Utensils, Plus, Trash2, Activity } from 'lucide-react';

const STORAGE = 'calorie-optimizer-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_BEST = '#4ade80';
const COLOR_WARN = '#f59e0b';
const COLOR_DANGER = '#ef4444';
const COLOR_ACCENT = '#22d3ee';

interface Item { id: string; name: string; price: string; calories: string; }
interface State { items: Item[]; }

const DEFAULT_STATE: State = {
  items: [
    { id: 'i1', name: 'Bag of rice (5lb)', price: '6.50', calories: '8000' },
    { id: 'i2', name: 'Dozen eggs', price: '4.20', calories: '840' },
    { id: 'i3', name: 'Fast food combo', price: '12.00', calories: '1100' },
    { id: 'i4', name: 'Peanut butter (40oz)', price: '7.80', calories: '6400' },
  ],
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function newId(): string { return `i${Math.random().toString(36).slice(2, 8)}`; }

export default function CalorieOptimizer() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const loaded = JSON.parse(raw) as State;
        if (loaded.items && loaded.items.length > 0) setState(loaded);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const rows = useMemo(() => state.items.map((it) => {
    const price = parseNum(it.price);
    const calories = parseNum(it.calories);
    const cpd = price > 0 ? calories / price : 0;
    return { ...it, price, calories, cpd };
  }), [state.items]);

  const maxCpd = Math.max(...rows.map((r) => r.cpd), 1);
  const bestRow = rows.reduce((a, b) => (b.cpd > a.cpd ? b : a), rows[0]);
  const sorted = [...rows].sort((a, b) => b.cpd - a.cpd);

  function updateItem(id: string, patch: Partial<Item>) {
    setState((s) => ({ items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));
  }
  function addItem() {
    setState((s) => ({ items: [...s.items, { id: newId(), name: 'New item', price: '0', calories: '0' }] }));
  }
  function removeItem(id: string) {
    setState((s) => ({ items: s.items.filter((it) => it.id !== id) }));
  }

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Utensils size={22} color={COLOR_BEST} />
          <div>
            <div style={title}>CALORIE_PER_DOLLAR</div>
            <div style={subtitle}>Most calories per cent — survival math when the budget is fixed</div>
          </div>
        </div>
        <button onClick={addItem} style={btnStyle}><Plus size={14} /> ADD_ITEM</button>
      </div>

      <div style={{ ...panel, padding: 18, marginBottom: 14, borderColor: COLOR_BEST, boxShadow: `0 0 24px ${COLOR_BEST}22` }}>
        <div style={{ fontSize: 11, letterSpacing: '.18em', color: COLOR_DIM, marginBottom: 6 }}>BEST FUEL EFFICIENCY</div>
        <div style={{ fontSize: 32, fontWeight: 800, color: COLOR_BEST }}>{bestRow?.name || '—'}</div>
        <div style={{ marginTop: 6, fontSize: 12, color: COLOR_DIM }}>
          {bestRow?.cpd.toFixed(0) || 0} cal/$ — <span style={{ color: COLOR_TEXT }}>{bestRow?.calories.toLocaleString() || 0} cal</span> for ${bestRow?.price.toFixed(2) || '0.00'}.
        </div>
      </div>

      <div style={{ ...panel, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 8, padding: '0 6px' }}>ITEMS</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {state.items.map((it) => (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 6, alignItems: 'center' }}>
              <input value={it.name} onChange={(e) => updateItem(it.id, { name: e.target.value })} placeholder="Item name" style={rowInputStyle} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 8, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, background: COLOR_BG }}>
                <span style={{ color: COLOR_DIM, fontSize: 12 }}>$</span>
                <input inputMode="decimal" value={it.price} onChange={(e) => updateItem(it.id, { price: e.target.value })} placeholder="0.00" style={{ ...rowInputStyle, border: 'none' }} />
              </div>
              <input inputMode="decimal" value={it.calories} onChange={(e) => updateItem(it.id, { calories: e.target.value })} placeholder="calories" style={rowInputStyle} />
              <button onClick={() => removeItem(it.id)} title="Remove" style={iconBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>FUEL EFFICIENCY — CAL / $</div>
        {sorted.map((r, idx) => {
          const pct = (r.cpd / maxCpd) * 100;
          const color = idx === 0 ? COLOR_BEST : idx === sorted.length - 1 ? COLOR_DANGER : COLOR_ACCENT;
          return (
            <div key={r.id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                <span style={{ color: COLOR_TEXT }}>{r.name}</span>
                <span style={{ color }}>{r.cpd.toFixed(0)} cal/$</span>
              </div>
              <div style={{ height: 14, background: COLOR_BORDER, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, transition: 'width 240ms ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Calories per dollar = calories ÷ price. The tool ranks any list by fuel efficiency — brutal math for the budget floor. It makes no claim about nutrition or health; 2,000 calories of rice is not the same as 2,000 calories of spinach. Use as a survival-window tool, not a meal planner.
      </div>
    </div>
  );
}

void Activity; void COLOR_WARN;

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const rowInputStyle: React.CSSProperties = { padding: '8px 10px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 13, outline: 'none', minWidth: 0 };
const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: `1px solid ${COLOR_BEST}`, background: 'transparent', color: COLOR_BEST, borderRadius: 6, fontFamily: 'inherit', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer' };
const iconBtnStyle: React.CSSProperties = { padding: 8, border: `1px solid ${COLOR_BORDER}`, background: 'transparent', color: COLOR_DIM, borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

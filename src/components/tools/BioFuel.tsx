import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Plus, Trash2 } from 'lucide-react';
import { writeMetric, writeFlag } from '~/lib/kfw-bridge';

const STORAGE = 'bio-fuel-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_GREEN = '#4ade80';
const COLOR_GOLD = '#facc15';
const COLOR_MAGENTA = '#f472b6';

const DAILY_BASELINE = 2000;

interface Item { id: string; name: string; price: string; kcal: string; protein: string; }
interface State { items: Item[]; budget: string; }
const DEFAULT_STATE: State = {
  budget: '40',
  items: [
    { id: 'i1', name: 'Rice (5lb)', price: '6', kcal: '8000', protein: '140' },
    { id: 'i2', name: 'Black beans (2lb)', price: '4', kcal: '3200', protein: '220' },
    { id: 'i3', name: 'Peanut butter (jar)', price: '5', kcal: '4200', protein: '160' },
    { id: 'i4', name: 'Frozen pizza', price: '6', kcal: '1800', protein: '60' },
    { id: 'i5', name: 'Ready-meal bowl', price: '8', kcal: '700', protein: '30' },
  ],
};

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}
function newId(): string { return `i${Math.random().toString(36).slice(2, 8)}`; }

export default function BioFuel() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) { const loaded = JSON.parse(raw) as State; if (loaded.items && loaded.items.length) setState(loaded); }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const ranked = useMemo(() => {
    return state.items
      .map((it) => {
        const price = parseNum(it.price);
        const kcal = parseNum(it.kcal);
        const protein = parseNum(it.protein);
        const perDollar = price > 0 ? kcal / price : 0;
        const days = kcal / DAILY_BASELINE;
        const proteinPerDollar = price > 0 ? protein / price : 0;
        return { ...it, priceN: price, kcalN: kcal, proteinN: protein, perDollar, days, proteinPerDollar };
      })
      .sort((a, b) => b.perDollar - a.perDollar);
  }, [state.items]);

  const maxPerDollar = ranked.length > 0 ? Math.max(1, ranked[0].perDollar) : 1;
  const budgetN = parseNum(state.budget);
  const totalCost = ranked.reduce((s, r) => s + r.priceN, 0);
  const totalKcal = ranked.reduce((s, r) => s + r.kcalN, 0);
  const daysOfUptime = totalKcal / DAILY_BASELINE;
  const avgPerDollar = totalCost > 0 ? totalKcal / totalCost : 0;
  const efficiency = Math.min(100, Math.round(avgPerDollar / 10));

  useEffect(() => {
    if (!hydrated) return;
    writeMetric('survival_efficiency', efficiency);
    writeFlag('low_bio_fuel', efficiency < 40);
  }, [efficiency, hydrated]);

  function update(id: string, patch: Partial<Item>) {
    setState((s) => ({ ...s, items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) }));
  }
  function add() { setState((s) => ({ ...s, items: [...s.items, { id: newId(), name: 'New item', price: '0', kcal: '0', protein: '0' }] })); }
  function remove(id: string) { setState((s) => ({ ...s, items: s.items.filter((i) => i.id !== id) })); }

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_GREEN} />
          <div>
            <div style={title}>BIO_FUEL</div>
            <div style={subtitle}>Kilocalories per dollar — rank food by thermodynamic return</div>
          </div>
        </div>
        <button onClick={add} style={btnStyle}><Plus size={14} /> ADD_ITEM</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Total spend" value={formatCurrency(totalCost)} color={COLOR_TEXT} />
        <Metric label="Total kcal" value={totalKcal.toLocaleString()} color={COLOR_GOLD} />
        <Metric label="Days of uptime" value={daysOfUptime.toFixed(1)} color={COLOR_GREEN} sub={`at ${DAILY_BASELINE} kcal/day`} />
        <Metric label="Weekly budget" value={formatCurrency(budgetN)} color={COLOR_DIM} />
      </div>

      <div style={{ ...panel, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 8, padding: '0 4px' }}>FOOD ITEMS</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {state.items.map((it) => (
            <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr auto', gap: 6, alignItems: 'center' }}>
              <input value={it.name} onChange={(e) => update(it.id, { name: e.target.value })} placeholder="Item" style={rowInputStyle} />
              <div style={prefixWrap}><span style={prefixLabel}>$</span><input inputMode="decimal" value={it.price} onChange={(e) => update(it.id, { price: e.target.value })} style={{ ...rowInputStyle, border: 'none' }} /></div>
              <div style={prefixWrap}><span style={prefixLabel}>kcal</span><input inputMode="decimal" value={it.kcal} onChange={(e) => update(it.id, { kcal: e.target.value })} style={{ ...rowInputStyle, border: 'none' }} /></div>
              <div style={prefixWrap}><span style={prefixLabel}>prot</span><input inputMode="decimal" value={it.protein} onChange={(e) => update(it.id, { protein: e.target.value })} style={{ ...rowInputStyle, border: 'none' }} /></div>
              <button onClick={() => remove(it.id)} title="Remove" style={iconBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panel, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>EFFICIENCY PILLAR · kcal per $1</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 180 }}>
          {ranked.map((r) => {
            const h = Math.max(6, (r.perDollar / maxPerDollar) * 170);
            const efficient = r.perDollar >= 400;
            const barColor = efficient ? COLOR_GREEN : r.perDollar >= 150 ? COLOR_GOLD : COLOR_MAGENTA;
            return (
              <div key={r.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: barColor, fontWeight: 700 }}>{Math.round(r.perDollar)}</div>
                <div style={{ width: '100%', height: h, background: barColor, opacity: efficient ? 1 : 0.6, borderRadius: '4px 4px 0 0', animation: efficient ? 'biopulse 2s ease-in-out infinite' : undefined, transition: 'height 320ms ease' }} />
                <div style={{ fontSize: 10, color: COLOR_DIM, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>{r.name}</div>
              </div>
            );
          })}
        </div>
        <style>{`@keyframes biopulse { 0%, 100% { box-shadow: 0 0 0 0 ${COLOR_GREEN}66; } 50% { box-shadow: 0 0 12px 2px ${COLOR_GREEN}aa; } }`}</style>
      </div>

      <div style={{ ...panel, padding: 10, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 6 }}>PER-ITEM BREAKDOWN</div>
        <div style={{ display: 'grid', gap: 4 }}>
          {ranked.map((r, i) => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '30px 1.6fr repeat(3, 1fr)', gap: 8, fontSize: 12, padding: '4px 6px', background: i === 0 ? `${COLOR_GREEN}11` : 'transparent', borderRadius: 4 }}>
              <div style={{ color: COLOR_DIM }}>#{i + 1}</div>
              <div style={{ color: COLOR_TEXT }}>{r.name}</div>
              <div style={{ color: COLOR_GOLD, textAlign: 'right' }}>{Math.round(r.perDollar)} kcal/$</div>
              <div style={{ color: COLOR_DIM, textAlign: 'right' }}>{r.days.toFixed(1)} days</div>
              <div style={{ color: COLOR_DIM, textAlign: 'right' }}>{r.proteinPerDollar.toFixed(1)} g prot/$</div>
            </div>
          ))}
        </div>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        kcal/$ = total calories ÷ price. Days of uptime = total kcal ÷ 2,000 (daily baseline). Pillars ≥400 kcal/$ pulse green (staple); ≥150 amber; below that magenta (luxury fuel). Budget helps size the weekly run.
      </div>
    </div>
  );
}

function Metric({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM }}>{label}</div>
      <div style={{ fontSize: 18, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: COLOR_DIM, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const rowInputStyle: React.CSSProperties = { padding: '8px 10px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 13, outline: 'none', width: '100%', minWidth: 0 };
const prefixWrap: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 8, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, background: COLOR_BG };
const prefixLabel: React.CSSProperties = { color: COLOR_DIM, fontSize: 11 };
const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: `1px solid ${COLOR_GREEN}`, background: 'transparent', color: COLOR_GREEN, borderRadius: 6, fontFamily: 'inherit', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer' };
const iconBtnStyle: React.CSSProperties = { padding: 8, border: `1px solid ${COLOR_BORDER}`, background: 'transparent', color: COLOR_DIM, borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

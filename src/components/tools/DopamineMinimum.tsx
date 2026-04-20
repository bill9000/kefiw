import React, { useEffect, useMemo, useState } from 'react';
import { Target, Plus, Trash2 } from 'lucide-react';

const STORAGE = 'dopamine-minimum-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_GOLD = '#facc15';

interface Task { id: string; name: string; visibility: number; effort: number; }
interface State { tasks: Task[]; }

const DEFAULT_STATE: State = {
  tasks: [
    { id: 't1', name: 'Brush teeth', visibility: 6, effort: 1 },
    { id: 't2', name: 'Make the bed', visibility: 8, effort: 2 },
    { id: 't3', name: 'Shower', visibility: 9, effort: 4 },
    { id: 't4', name: 'Clean whole kitchen', visibility: 9, effort: 9 },
    { id: 't5', name: 'Answer one email', visibility: 4, effort: 2 },
  ],
};

function newId(): string { return `t${Math.random().toString(36).slice(2, 8)}`; }

export default function DopamineMinimum() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) { const loaded = JSON.parse(raw) as State; if (loaded.tasks && loaded.tasks.length) setState(loaded); }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const { ranked, top } = useMemo(() => {
    const ranked = state.tasks
      .map((t) => ({ ...t, momentum: t.effort > 0 ? t.visibility / t.effort : t.visibility * 10 }))
      .sort((a, b) => b.momentum - a.momentum);
    return { ranked, top: ranked[0] };
  }, [state.tasks]);

  function update(id: string, patch: Partial<Task>) {
    setState((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }
  function add() { setState((s) => ({ tasks: [...s.tasks, { id: newId(), name: 'New task', visibility: 5, effort: 5 }] })); }
  function remove(id: string) { setState((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })); }

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Target size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>DOPAMINE_MIN</div>
            <div style={subtitle}>Pick ONE task — highest visibility ÷ effort ratio wins</div>
          </div>
        </div>
        <button onClick={add} style={btnStyle}><Plus size={14} /> ADD_TASK</button>
      </div>

      {top && (
        <div style={{ ...panel, padding: 32, marginBottom: 14, textAlign: 'center', border: `2px solid ${COLOR_GOLD}`, boxShadow: `0 0 32px ${COLOR_GOLD}33`, animation: 'dmpulse 2.4s ease-in-out infinite' }}>
          <div style={{ fontSize: 11, letterSpacing: '.2em', color: COLOR_DIM, marginBottom: 10 }}>THE ONE TASK</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: COLOR_GOLD, letterSpacing: '.04em' }}>{top.name.toUpperCase()}</div>
          <div style={{ fontSize: 12, color: COLOR_DIM, marginTop: 10 }}>
            Momentum <span style={{ color: COLOR_GOLD }}>{top.momentum.toFixed(2)}</span> · visibility {top.visibility}/10 · effort {top.effort}/10
          </div>
        </div>
      )}

      <style>{`@keyframes dmpulse { 0%, 100% { box-shadow: 0 0 20px ${COLOR_GOLD}33; } 50% { box-shadow: 0 0 48px ${COLOR_GOLD}66; } }`}</style>

      <div style={{ ...panel, padding: 12, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 8, padding: '0 4px' }}>TASKS</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {state.tasks.map((t) => (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr auto', gap: 6, alignItems: 'center' }}>
              <input value={t.name} onChange={(e) => update(t.id, { name: e.target.value })} placeholder="Task" style={rowInputStyle} />
              <label style={sliderWrap}>
                <span style={sliderLabel}>VIS {t.visibility}</span>
                <input type="range" min="1" max="10" value={t.visibility} onChange={(e) => update(t.id, { visibility: parseInt(e.target.value) })} style={{ width: '100%' }} />
              </label>
              <label style={sliderWrap}>
                <span style={sliderLabel}>EFF {t.effort}</span>
                <input type="range" min="1" max="10" value={t.effort} onChange={(e) => update(t.id, { effort: parseInt(e.target.value) })} style={{ width: '100%' }} />
              </label>
              <button onClick={() => remove(t.id)} title="Remove" style={iconBtnStyle}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panel, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>RANK</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {ranked.map((r, i) => {
            const isTop = i === 0;
            return (
              <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '30px 1fr 80px', alignItems: 'center', gap: 10, padding: '6px 10px', background: COLOR_BG, border: `1px solid ${isTop ? COLOR_GOLD : COLOR_BORDER}`, borderRadius: 6 }}>
                <div style={{ fontSize: 12, color: isTop ? COLOR_GOLD : COLOR_DIM, fontWeight: 700 }}>#{i + 1}</div>
                <div style={{ fontSize: 13, color: isTop ? COLOR_GOLD : COLOR_TEXT }}>{r.name}</div>
                <div style={{ textAlign: 'right', fontSize: 14, color: isTop ? COLOR_GOLD : COLOR_DIM, fontWeight: 700 }}>{r.momentum.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Momentum = visibility ÷ effort. High visibility + low effort = best momentum. A made bed scores higher than a deep-cleaned kitchen when the effort gap is huge. One task only — don't look at the rest.
      </div>
    </div>
  );
}

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const rowInputStyle: React.CSSProperties = { padding: '8px 10px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 6, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 13, outline: 'none', width: '100%' };
const sliderWrap: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 2 };
const sliderLabel: React.CSSProperties = { fontSize: 10, color: COLOR_DIM, letterSpacing: '.08em' };
const btnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', border: `1px solid ${COLOR_CYAN}`, background: 'transparent', color: COLOR_CYAN, borderRadius: 6, fontFamily: 'inherit', fontSize: 11, letterSpacing: '.08em', cursor: 'pointer' };
const iconBtnStyle: React.CSSProperties = { padding: 8, border: `1px solid ${COLOR_BORDER}`, background: 'transparent', color: COLOR_DIM, borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

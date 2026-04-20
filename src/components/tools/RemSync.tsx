import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';

const STORAGE = 'rem-sync-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GREEN = '#4ade80';
const COLOR_GOLD = '#facc15';

const CYCLE_MIN = 90;
const SLEEP_LATENCY = 14;

type Mode = 'wake-at' | 'sleep-at-clock' | 'sleep-now';

interface State {
  mode: Mode;
  wakeClock: string;
  sleepClock: string;
  latency: string;
}

const DEFAULT_STATE: State = { mode: 'wake-at', wakeClock: '07:00', sleepClock: '23:00', latency: String(SLEEP_LATENCY) };

function parseClock(hhmm: string): { h: number; m: number } {
  const match = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!match) return { h: 7, m: 0 };
  return { h: Math.min(23, Math.max(0, parseInt(match[1], 10))), m: Math.min(59, Math.max(0, parseInt(match[2], 10))) };
}

function addMinutes(h: number, m: number, delta: number): { h: number; m: number } {
  let total = h * 60 + m + delta;
  total = ((total % 1440) + 1440) % 1440;
  return { h: Math.floor(total / 60), m: total % 60 };
}

function formatClock({ h, m }: { h: number; m: number }): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export default function RemSync() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [nowClock, setNowClock] = useState<string>('');

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as State) }); } catch {}
    setHydrated(true);
    const d = new Date();
    setNowClock(formatClock({ h: d.getHours(), m: d.getMinutes() }));
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const latencyMin = Math.max(0, Math.min(60, parseInt(state.latency, 10) || 0));

  const cycles = useMemo(() => {
    // Returns cycle windows: for wake-at mode, these are bedtimes;
    // for sleep modes, these are wake times.
    const list: Array<{ n: number; hours: number; label: string; time: string; optimal: boolean }> = [];
    if (state.mode === 'wake-at') {
      const wake = parseClock(state.wakeClock);
      for (let n = 3; n <= 7; n++) {
        const delta = -(CYCLE_MIN * n + latencyMin);
        const t = addMinutes(wake.h, wake.m, delta);
        list.push({
          n,
          hours: (CYCLE_MIN * n) / 60,
          label: `${n} cycles`,
          time: formatClock(t),
          optimal: n === 5 || n === 6,
        });
      }
    } else {
      const sleepClock = state.mode === 'sleep-now' ? nowClock : state.sleepClock;
      const sleep = parseClock(sleepClock || '23:00');
      for (let n = 3; n <= 7; n++) {
        const delta = CYCLE_MIN * n + latencyMin;
        const t = addMinutes(sleep.h, sleep.m, delta);
        list.push({
          n,
          hours: (CYCLE_MIN * n) / 60,
          label: `${n} cycles`,
          time: formatClock(t),
          optimal: n === 5 || n === 6,
        });
      }
    }
    return list;
  }, [state, latencyMin, nowClock]);

  const shell: React.CSSProperties = { background: COLOR_BG, color: COLOR_TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${COLOR_BORDER}` };
  const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, padding: '1rem', borderRadius: 8 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${COLOR_BORDER}`, background: '#0b1120', color: COLOR_TEXT, fontFamily: 'inherit' };

  const isWakeMode = state.mode === 'wake-at';
  const timingLabel = isWakeMode ? 'To wake at' : 'Initiating shutdown at';
  const cycleRailLabel = isWakeMode ? 'Initiate shutdown at' : 'Refreshed wake window';

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <Clock size={18} color={COLOR_CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM }}>
          REM-Sync · 90-min Cycle Timing
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Mode</div>
          <select value={state.mode} onChange={(e) => setState({ ...state, mode: e.target.value as Mode })} style={inputStyle}>
            <option value="wake-at">I want to wake at…</option>
            <option value="sleep-at-clock">I'm going to bed at…</option>
            <option value="sleep-now">I'm going to bed now</option>
          </select>
        </label>
        {state.mode === 'wake-at' && (
          <label style={{ fontSize: 12 }}>
            <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Wake time</div>
            <input value={state.wakeClock} onChange={(e) => setState({ ...state, wakeClock: e.target.value })} style={inputStyle} />
          </label>
        )}
        {state.mode === 'sleep-at-clock' && (
          <label style={{ fontSize: 12 }}>
            <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Sleep start</div>
            <input value={state.sleepClock} onChange={(e) => setState({ ...state, sleepClock: e.target.value })} style={inputStyle} />
          </label>
        )}
        {state.mode === 'sleep-now' && (
          <div style={{ fontSize: 12 }}>
            <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Reference: now</div>
            <div style={{ ...inputStyle, color: COLOR_CYAN }}>{nowClock || '--:--'}</div>
          </div>
        )}
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Sleep-onset latency (min)</div>
          <input inputMode="numeric" value={state.latency} onChange={(e) => setState({ ...state, latency: e.target.value })} style={inputStyle} />
        </label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM, marginBottom: 8 }}>{cycleRailLabel}</div>
        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
          {cycles.map((c) => (
            <div
              key={c.n}
              style={{
                background: c.optimal ? '#0b3a44' : '#0b1120',
                border: `1px solid ${c.optimal ? COLOR_CYAN : COLOR_BORDER}`,
                padding: '0.75rem 0.5rem',
                borderRadius: 8,
                textAlign: 'center',
                boxShadow: c.optimal ? `0 0 18px ${COLOR_CYAN}55` : 'none',
              }}
            >
              <div style={{ fontSize: 10, color: COLOR_DIM, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}</div>
              <div style={{ fontSize: 22, color: c.optimal ? COLOR_CYAN : COLOR_TEXT, fontWeight: 700 }}>{c.time}</div>
              <div style={{ fontSize: 10, color: COLOR_DIM, marginTop: 2 }}>{formatDuration(c.n * CYCLE_MIN)} {isWakeMode ? 'before wake' : 'after sleep'}</div>
              {c.optimal && (
                <div style={{ fontSize: 9, color: COLOR_CYAN, marginTop: 4, letterSpacing: '0.1em' }}>OPTIMAL</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: COLOR_CYAN }}>
        <div style={{ fontSize: 10, color: COLOR_DIM, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Verdict</div>
        {isWakeMode ? (
          <div style={{ fontSize: 13, color: COLOR_TEXT, marginTop: 4 }}>
            {timingLabel} <span style={{ color: COLOR_CYAN, fontWeight: 700 }}>{parseClock(state.wakeClock) && state.wakeClock}</span>, initiate shutdown at {' '}
            <span style={{ color: COLOR_CYAN, fontWeight: 700 }}>{cycles.find((c) => c.n === 5)?.time}</span> (5 cycles) or {' '}
            <span style={{ color: COLOR_CYAN, fontWeight: 700 }}>{cycles.find((c) => c.n === 6)?.time}</span> (6 cycles).
          </div>
        ) : (
          <div style={{ fontSize: 13, color: COLOR_TEXT, marginTop: 4 }}>
            {timingLabel} <span style={{ color: COLOR_CYAN, fontWeight: 700 }}>{state.mode === 'sleep-now' ? nowClock : state.sleepClock}</span>, optimal wake at {' '}
            <span style={{ color: COLOR_CYAN, fontWeight: 700 }}>{cycles.find((c) => c.n === 5)?.time}</span> (5 cycles) or {' '}
            <span style={{ color: COLOR_CYAN, fontWeight: 700 }}>{cycles.find((c) => c.n === 6)?.time}</span> (6 cycles).
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={{ ...panel, padding: '0.75rem' }}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Cycle length</div>
          <div style={{ fontSize: 16, color: COLOR_CYAN, fontWeight: 600 }}>{CYCLE_MIN} min</div>
        </div>
        <div style={{ ...panel, padding: '0.75rem' }}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Sleep latency</div>
          <div style={{ fontSize: 16, color: COLOR_GOLD, fontWeight: 600 }}>{latencyMin} min</div>
        </div>
        <div style={{ ...panel, padding: '0.75rem' }}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Optimal span</div>
          <div style={{ fontSize: 16, color: COLOR_GREEN, fontWeight: 600 }}>7.5–9h</div>
        </div>
        <div style={{ ...panel, padding: '0.75rem' }}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Minimum viable</div>
          <div style={{ fontSize: 16, color: COLOR_MAGENTA, fontWeight: 600 }}>4.5h · 3 cycles</div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', fontSize: 10, color: COLOR_DIM, borderTop: `1px dashed ${COLOR_BORDER}`, paddingTop: 10 }}>
        Formula: Wake = Sleep + (90 min × n) + latency · reversing gives bedtime for a target wake. Individual cycle length varies 70–120 min.
      </div>
    </div>
  );
}

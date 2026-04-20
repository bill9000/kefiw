import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'substance-decay-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GOLD = '#facc15';
const COLOR_RED = '#ef4444';

type Substance = 'caffeine' | 'alcohol';

interface Profile {
  halfLifeHours: number;
  unit: string;
  jitterThreshold: number;
  sleepThreshold: number;
  defaultDose: string;
  note: string;
}

const PROFILES: Record<Substance, Profile> = {
  caffeine: {
    halfLifeHours: 5,
    unit: 'mg',
    jitterThreshold: 100,
    sleepThreshold: 50,
    defaultDose: '200',
    note: 'Typical half-life 5h (3–9h range). One espresso ≈ 80 mg; drip coffee ≈ 95–165 mg; energy drink ≈ 160 mg.',
  },
  alcohol: {
    halfLifeHours: 1.5,
    unit: 'units',
    jitterThreshold: 2,
    sleepThreshold: 1,
    defaultDose: '3',
    note: 'Alcohol clears linearly in reality, but 1.5h half-life approximation holds for standard BAC drop. 1 unit ≈ 14 g alcohol (one standard drink).',
  },
};

interface State {
  substance: Substance;
  dose: string;
  hoursAgo: string;
  bedtimeClock: string;
}

const DEFAULT_STATE: State = { substance: 'caffeine', dose: '200', hoursAgo: '2', bedtimeClock: '23:00' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

function hoursFromClock(hhmm: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm);
  if (!m) return 23;
  return Math.min(23.99, Math.max(0, parseInt(m[1], 10) + parseInt(m[2], 10) / 60));
}

function remaining(dose: number, hoursElapsed: number, halfLife: number): number {
  if (halfLife <= 0) return 0;
  return dose * Math.pow(0.5, hoursElapsed / halfLife);
}

function hoursUntilLevel(dose: number, target: number, halfLife: number): number {
  if (dose <= 0 || target <= 0 || dose <= target) return 0;
  return halfLife * Math.log2(dose / target);
}

function formatClock(hoursFromNow: number): string {
  const now = new Date();
  const t = new Date(now.getTime() + hoursFromNow * 3600 * 1000);
  const hh = String(t.getHours()).padStart(2, '0');
  const mm = String(t.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

export default function SubstanceDecay() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const profile = PROFILES[state.substance];

  const calc = useMemo(() => {
    const dose = Math.max(0, parseNum(state.dose));
    const hoursAgo = Math.max(0, parseNum(state.hoursAgo));
    const currentLevel = remaining(dose, hoursAgo, profile.halfLifeHours);
    const hoursTo95 = hoursUntilLevel(dose, dose * 0.05, profile.halfLifeHours) - hoursAgo;
    const hoursToSleepSafe = hoursUntilLevel(dose, profile.sleepThreshold, profile.halfLifeHours) - hoursAgo;
    const hoursToJitterSafe = hoursUntilLevel(dose, profile.jitterThreshold, profile.halfLifeHours) - hoursAgo;
    return {
      dose,
      hoursAgo,
      currentLevel,
      hoursTo95: Math.max(0, hoursTo95),
      hoursToSleepSafe: Math.max(0, hoursToSleepSafe),
      hoursToJitterSafe: Math.max(0, hoursToJitterSafe),
    };
  }, [state, profile]);

  const bedtimeHoursFromNow = useMemo(() => {
    const nowHours = new Date().getHours() + new Date().getMinutes() / 60;
    const bedHours = hoursFromClock(state.bedtimeClock);
    let diff = bedHours - nowHours;
    if (diff < 0) diff += 24;
    return diff;
  }, [state.bedtimeClock]);

  const atBedtimeLevel = remaining(calc.dose, calc.hoursAgo + bedtimeHoursFromNow, profile.halfLifeHours);

  // Chart data: 0 to 24h from ingestion
  const chartHours = 24;
  const samples = useMemo(() => {
    const arr: Array<{ t: number; level: number }> = [];
    for (let t = 0; t <= chartHours; t += 0.5) {
      arr.push({ t, level: remaining(calc.dose, t, profile.halfLifeHours) });
    }
    return arr;
  }, [calc.dose, profile]);

  const W = 640, H = 200, PAD = 30;
  const maxY = Math.max(calc.dose, profile.jitterThreshold) * 1.1;
  const xScale = (t: number) => PAD + ((W - PAD * 2) * t) / chartHours;
  const yScale = (v: number) => H - PAD - ((H - PAD * 2) * v) / maxY;

  const linePath = samples.map((s, i) => `${i === 0 ? 'M' : 'L'} ${xScale(s.t).toFixed(1)} ${yScale(s.level).toFixed(1)}`).join(' ');
  const areaPath = linePath + ` L ${xScale(chartHours).toFixed(1)} ${yScale(0).toFixed(1)} L ${xScale(0).toFixed(1)} ${yScale(0).toFixed(1)} Z`;
  const nowX = xScale(calc.hoursAgo);

  const shell: React.CSSProperties = {
    background: COLOR_BG,
    color: COLOR_TEXT,
    padding: '1.5rem',
    borderRadius: 12,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    border: `1px solid ${COLOR_BORDER}`,
  };
  const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, padding: '1rem', borderRadius: 8 };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${COLOR_BORDER}`, background: '#0b1120', color: COLOR_TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <Activity size={18} color={COLOR_CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM }}>
          Substance Decay · Pharmacokinetic Half-life
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Substance</div>
          <select
            value={state.substance}
            onChange={(e) => {
              const sub = e.target.value as Substance;
              setState({ ...state, substance: sub, dose: PROFILES[sub].defaultDose });
            }}
            style={inputStyle}
          >
            <option value="caffeine">Caffeine · t½ 5h</option>
            <option value="alcohol">Alcohol · t½ 1.5h</option>
          </select>
        </label>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Dose ({profile.unit})</div>
          <input inputMode="decimal" value={state.dose} onChange={(e) => setState({ ...state, dose: e.target.value })} style={inputStyle} />
        </label>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Hours since ingestion</div>
          <input inputMode="decimal" value={state.hoursAgo} onChange={(e) => setState({ ...state, hoursAgo: e.target.value })} style={inputStyle} />
        </label>
        <label style={{ fontSize: 12 }}>
          <div style={{ color: COLOR_DIM, marginBottom: 4 }}>Bedtime (HH:MM)</div>
          <input value={state.bedtimeClock} onChange={(e) => setState({ ...state, bedtimeClock: e.target.value })} style={inputStyle} />
        </label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM, marginBottom: 8 }}>Decay Curve · 24h window</div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="decayGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLOR_CYAN} stopOpacity={0.5} />
              <stop offset="100%" stopColor={COLOR_CYAN} stopOpacity={0.02} />
            </linearGradient>
          </defs>

          {/* Jitter threshold */}
          {profile.jitterThreshold <= maxY && (
            <>
              <line x1={PAD} x2={W - PAD} y1={yScale(profile.jitterThreshold)} y2={yScale(profile.jitterThreshold)} stroke={COLOR_RED} strokeDasharray="4 3" strokeWidth={1} />
              <text x={W - PAD - 4} y={yScale(profile.jitterThreshold) - 4} fill={COLOR_RED} fontSize={10} textAnchor="end">Jitter threshold · {profile.jitterThreshold} {profile.unit}</text>
            </>
          )}
          {/* Sleep interference */}
          {profile.sleepThreshold <= maxY && (
            <>
              <line x1={PAD} x2={W - PAD} y1={yScale(profile.sleepThreshold)} y2={yScale(profile.sleepThreshold)} stroke={COLOR_GOLD} strokeDasharray="4 3" strokeWidth={1} />
              <text x={W - PAD - 4} y={yScale(profile.sleepThreshold) - 4} fill={COLOR_GOLD} fontSize={10} textAnchor="end">Sleep interference · {profile.sleepThreshold} {profile.unit}</text>
            </>
          )}

          <path d={areaPath} fill="url(#decayGrad)" />
          <path d={linePath} stroke={COLOR_CYAN} strokeWidth={2} fill="none" />

          {/* Now marker */}
          <line x1={nowX} x2={nowX} y1={PAD} y2={H - PAD} stroke={COLOR_MAGENTA} strokeDasharray="2 2" strokeWidth={1} />
          <circle cx={nowX} cy={yScale(calc.currentLevel)} r={4} fill={COLOR_MAGENTA} />
          <text x={nowX} y={PAD - 6} fill={COLOR_MAGENTA} fontSize={10} textAnchor="middle">NOW</text>

          {/* Axes */}
          <line x1={PAD} x2={W - PAD} y1={H - PAD} y2={H - PAD} stroke={COLOR_BORDER} />
          {[0, 4, 8, 12, 16, 20, 24].map((h) => (
            <g key={h}>
              <line x1={xScale(h)} x2={xScale(h)} y1={H - PAD} y2={H - PAD + 4} stroke={COLOR_BORDER} />
              <text x={xScale(h)} y={H - PAD + 14} fill={COLOR_DIM} fontSize={10} textAnchor="middle">{h}h</text>
            </g>
          ))}
        </svg>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Current level</div>
          <div style={{ fontSize: 20, color: COLOR_MAGENTA, fontWeight: 700 }}>{calc.currentLevel.toFixed(1)} {profile.unit}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Level at bedtime</div>
          <div style={{ fontSize: 20, color: atBedtimeLevel > profile.sleepThreshold ? COLOR_RED : COLOR_CYAN, fontWeight: 700 }}>
            {atBedtimeLevel.toFixed(1)} {profile.unit}
          </div>
          <div style={{ fontSize: 10, color: COLOR_DIM }}>in {bedtimeHoursFromNow.toFixed(1)}h</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>95% clear in</div>
          <div style={{ fontSize: 20, color: COLOR_CYAN, fontWeight: 700 }}>{calc.hoursTo95.toFixed(1)}h</div>
          <div style={{ fontSize: 10, color: COLOR_DIM }}>@ {formatClock(calc.hoursTo95)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: COLOR_DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Sleep-safe at</div>
          <div style={{ fontSize: 20, color: COLOR_GOLD, fontWeight: 700 }}>{formatClock(calc.hoursToSleepSafe)}</div>
          <div style={{ fontSize: 10, color: COLOR_DIM }}>(+{calc.hoursToSleepSafe.toFixed(1)}h)</div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: COLOR_DIM, borderTop: `1px dashed ${COLOR_BORDER}`, paddingTop: 10 }}>
        {profile.note}
      </div>
      <div style={{ fontSize: 10, color: COLOR_DIM, marginTop: 6 }}>
        N(t) = N₀ × 0.5^(t / h) · where h = {profile.halfLifeHours}h · stored purely as numeric inputs.
      </div>
    </div>
  );
}

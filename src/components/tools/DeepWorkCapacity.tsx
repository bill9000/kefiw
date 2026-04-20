import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { writeField } from '~/lib/session-context';

const STORAGE = 'deep-work-capacity-v1';
const PIPELINE_KEY = 'focus_quality_pct';
const PIPELINE_SOURCE = 'deep-work-capacity';
const PIPELINE_LABEL = 'Focus Horizon';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { minutes: string; }
const DEFAULT_STATE: State = { minutes: '45' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function band(quality: number): { color: string; label: string; note: string } {
  if (quality >= 70) return { color: GREEN, label: 'Peak_Focus', note: 'Flow state online · preserve this window at all costs' };
  if (quality >= 40) return { color: CYAN, label: 'Sustained_Focus', note: 'Good signal · attention still resolving detail' };
  if (quality >= 15) return { color: GOLD, label: 'Decaying_Focus', note: 'Diminishing returns · a break will restore more than pushing through' };
  if (quality >= 3) return { color: MAGENTA, label: 'Residual_Focus', note: 'Almost flat · you are grinding on fumes' };
  return { color: RED, label: 'Focus_Collapse', note: 'Brain offline · further work = typos, bugs, and rework' };
}

export default function DeepWorkCapacity() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const m = Math.max(0, parseNum(state.minutes));
    const quality = Math.max(0, 100 * Math.exp(-0.01 * m));
    const horizonMin = quality > 0 ? Math.max(0, -Math.log(0.15) / 0.01 - m) : 0;
    return { m, quality, horizonMin };
  }, [state]);

  const b = band(calc.quality);

  useEffect(() => {
    if (!hydrated) return;
    writeField(PIPELINE_KEY, calc.quality, PIPELINE_SOURCE, PIPELINE_LABEL);
  }, [calc.quality, hydrated]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  const curvePoints = useMemo(() => {
    const pts: string[] = [];
    for (let x = 0; x <= 240; x += 4) {
      const y = 100 * Math.exp(-0.01 * x);
      const px = 10 + (x / 240) * 380;
      const py = 90 - (y / 100) * 80;
      pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const markerX = 10 + (Math.min(240, calc.m) / 240) * 380;
  const markerY = 90 - (calc.quality / 100) * 80;

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Clock size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Deep Work Capacity · Focus Horizon</div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Minutes of focused work so far</div>
          <input inputMode="numeric" value={state.minutes} onChange={(e) => setState({ ...state, minutes: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>Continuous, no distractions. Each break resets the clock.</div></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Focus Decay Curve · e^(−0.01·min)</div>
        <svg width="100%" height={110} viewBox="0 0 400 110" style={{ display: 'block' }}>
          <line x1={10} y1={90} x2={390} y2={90} stroke={BORDER} strokeWidth={1} />
          <line x1={10} y1={10} x2={10} y2={90} stroke={BORDER} strokeWidth={1} />
          <polyline fill="none" stroke={b.color} strokeWidth={2} points={curvePoints} />
          <line x1={markerX} y1={10} x2={markerX} y2={90} stroke={b.color} strokeDasharray="2 3" strokeWidth={1} opacity={0.6} />
          <circle cx={markerX} cy={markerY} r={4} fill={b.color}>
            <animate attributeName="r" values="4;6;4" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <text x={10} y={105} fontSize={9} fill={DIM} fontFamily="inherit">0m</text>
          <text x={190} y={105} fontSize={9} fill={DIM} fontFamily="inherit" textAnchor="middle">120m</text>
          <text x={390} y={105} fontSize={9} fill={DIM} fontFamily="inherit" textAnchor="end">240m</text>
        </svg>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: b.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Focus Quality</div>
        <div style={{ fontSize: 36, color: b.color, fontWeight: 700 }}>{calc.quality.toFixed(1)}%</div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Status: <span style={{ color: b.color, fontWeight: 700 }}>{b.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{b.note}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Time spent</div>
          <div style={{ fontSize: 20, color: CYAN, fontWeight: 700 }}>{calc.m.toFixed(0)} min</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Horizon left (to 15%)</div>
          <div style={{ fontSize: 20, color: GOLD, fontWeight: 700 }}>{calc.horizonMin.toFixed(0)} min</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Decay constant</div>
          <div style={{ fontSize: 20, color: MAGENTA, fontWeight: 700 }}>λ = 0.01/min</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Focus Quality = 100 × e^(−0.01 × min), floor at 0. Half-life ≈ 69 min — after that every unit of additional time delivers half the output. Break and recover; don't push into the flat tail.
      </div>
    </div>
  );
}

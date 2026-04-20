import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'heart-rate-zones-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { age: string; restingHR: string; }
const DEFAULT_STATE: State = { age: '35', restingHR: '62' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

const ZONES = [
  { name: 'Z1 · Warm-up', lo: 0.5, hi: 0.6, color: GREEN, desc: 'Active recovery, fat oxidation' },
  { name: 'Z2 · Aerobic', lo: 0.6, hi: 0.7, color: CYAN, desc: 'Endurance base, mitochondrial density' },
  { name: 'Z3 · Tempo', lo: 0.7, hi: 0.8, color: GOLD, desc: 'Lactate threshold edge' },
  { name: 'Z4 · Threshold', lo: 0.8, hi: 0.9, color: MAGENTA, desc: 'VO₂max development' },
  { name: 'Z5 · Redline', lo: 0.9, hi: 1.0, color: RED, desc: 'Anaerobic · ≤ 2 min sustainable' },
];

export default function HeartRateZones() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const age = Math.max(1, Math.min(120, parseNum(state.age)));
    const rhr = Math.max(30, Math.min(120, parseNum(state.restingHR)));
    const hrMax = 220 - age;
    const hrr = Math.max(0, hrMax - rhr);
    const zones = ZONES.map((z) => ({
      ...z,
      bpmLo: Math.round(hrr * z.lo + rhr),
      bpmHi: Math.round(hrr * z.hi + rhr),
    }));
    return { hrMax, hrr, rhr, zones };
  }, [state]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Activity size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Operational Heart Rate Zones · Karvonen</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Age (years)</div>
          <input inputMode="numeric" value={state.age} onChange={(e) => setState({ ...state, age: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Resting HR (bpm)</div>
          <input inputMode="numeric" value={state.restingHR} onChange={(e) => setState({ ...state, restingHR: e.target.value })} style={input} /></label>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>HR Max (220 − age)</div>
          <div style={{ fontSize: 22, color: CYAN, fontWeight: 700 }}>{calc.hrMax} bpm</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Reserve (HRR)</div>
          <div style={{ fontSize: 22, color: GOLD, fontWeight: 700 }}>{calc.hrr} bpm</div>
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 10 }}>Operational Zones</div>
        <div style={{ display: 'grid', gap: 6 }}>
          {calc.zones.map((z) => (
            <div key={z.name} style={{ display: 'grid', gridTemplateColumns: '130px 120px 1fr', gap: 10, fontSize: 12, alignItems: 'center', padding: '6px 8px', background: '#0b1120', borderRadius: 4, borderLeft: `3px solid ${z.color}` }}>
              <span style={{ color: z.color, fontWeight: 600 }}>{z.name}</span>
              <span style={{ color: TEXT, fontWeight: 700 }}>{z.bpmLo}–{z.bpmHi} bpm</span>
              <span style={{ color: DIM }}>{z.desc}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Karvonen: zone_bpm = (HRmax − HRrest) × intensity% + HRrest. HRmax (220−age) is population estimate; lab test (VO₂max) is more accurate.
      </div>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const STORAGE = 'co2-cognitive-tax-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { ppm: string; }
const DEFAULT_STATE: State = { ppm: '1000' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// Satish 2012 / Allen 2016 — basic cognitive decline per ppm CO2 above 600
// Use piecewise: 600=0%, 1000=15%, 1400=50%, 2500=75%, 4000=dangerous
function cognitiveDecline(ppm: number): number {
  if (ppm <= 600) return 0;
  if (ppm <= 1000) return ((ppm - 600) / 400) * 15;
  if (ppm <= 1400) return 15 + ((ppm - 1000) / 400) * 35;
  if (ppm <= 2500) return 50 + ((ppm - 1400) / 1100) * 25;
  if (ppm <= 4000) return 75 + ((ppm - 2500) / 1500) * 20;
  return Math.min(99, 95 + ((ppm - 4000) / 1000) * 4);
}

function status(ppm: number): { label: string; color: string; action: string } {
  if (ppm < 800) return { label: 'Nominal', color: GREEN, action: 'Background operation · cognitive baseline' };
  if (ppm < 1200) return { label: 'Elevated', color: GOLD, action: 'Subclinical decision-making impairment' };
  if (ppm < 2000) return { label: 'High', color: MAGENTA, action: 'Ventilate · open window or vacate' };
  if (ppm < 5000) return { label: 'Critical', color: RED, action: 'OSHA 8-h ceiling breached · evacuate' };
  return { label: 'Shutdown', color: RED, action: 'Hypoxia risk · leave immediately' };
}

export default function Co2CognitiveTax() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const ppm = Math.max(0, parseNum(state.ppm));
    const decline = cognitiveDecline(ppm);
    return { ppm, decline };
  }, [state]);

  const st = status(calc.ppm);
  const gaugePct = Math.min(100, (calc.ppm / 5000) * 100);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <AlertTriangle size={18} color={MAGENTA} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>CO₂ Cognitive Tax · Indoor Air</div>
      </div>

      <label style={{ fontSize: 12, display: 'block', marginBottom: '1rem' }}>
        <div style={{ color: DIM, marginBottom: 4 }}>Indoor CO₂ (ppm) — outdoor ≈ 420</div>
        <input inputMode="decimal" value={state.ppm} onChange={(e) => setState({ ppm: e.target.value })} style={input} />
      </label>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Atmospheric Load</div>
        <div style={{ height: 24, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}`, position: 'relative' }}>
          <div style={{ width: `${gaugePct}%`, height: '100%', background: `linear-gradient(90deg, ${GREEN}, ${GOLD}, ${MAGENTA}, ${RED})` }} />
          <div style={{ position: 'absolute', left: `${(1000 / 5000) * 100}%`, top: 0, bottom: 0, width: 1, background: GOLD }} />
          <div style={{ position: 'absolute', left: `${(2000 / 5000) * 100}%`, top: 0, bottom: 0, width: 1, background: MAGENTA }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 4 }}>
          <span>0</span><span style={{ color: GOLD }}>1000</span><span style={{ color: MAGENTA }}>2000</span><span>5000 OSHA</span>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: '1rem' }}>
        <div style={{ ...panel, borderColor: st.color }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Status</div>
          <div style={{ fontSize: 24, color: st.color, fontWeight: 700 }}>{st.label}</div>
          <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{st.action}</div>
        </div>
        <div style={{ ...panel, borderColor: MAGENTA }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Cognitive decline</div>
          <div style={{ fontSize: 32, color: MAGENTA, fontWeight: 700 }}>−{calc.decline.toFixed(0)}%</div>
          <div style={{ fontSize: 10, color: DIM }}>vs 600 ppm baseline</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        Satish 2012 / Allen 2016: CO₂ at 1400 ppm halves strategic decision-making performance. ASHRAE indoor target: ≤ 1000 ppm. Standard office/bedroom builds at occupancy: 1200–2500 ppm without mechanical ventilation.
      </div>
    </div>
  );
}

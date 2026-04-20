import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const STORAGE = 'thermal-failure-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444'; const ORANGE = '#f59e0b';

type Units = 'F' | 'C';

interface State { units: Units; wetBulb: string; globeBulb: string; dryBulb: string; sun: boolean; }
const DEFAULT_STATE: State = { units: 'F', wetBulb: '75', globeBulb: '85', dryBulb: '88', sun: true };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// WBGT thresholds in °C (ACGIH, for moderate workload)
// <27 low, 27-30 moderate, 30-32 high, 32-35 extreme, >35 fatal
function classifyC(wbgtC: number): { label: string; color: string; action: string } {
  if (wbgtC < 27) return { label: 'Nominal', color: GREEN, action: 'Standard load tolerated' };
  if (wbgtC < 30) return { label: 'Moderate', color: GOLD, action: 'Reduce sustained exertion · hydrate' };
  if (wbgtC < 32) return { label: 'High', color: ORANGE, action: 'Work/rest cycle 45:15 · monitor vitals' };
  if (wbgtC < 35) return { label: 'Extreme', color: MAGENTA, action: 'Critical — 15:45 cycle · vulnerable populations shelter' };
  return { label: 'Fatal Risk', color: RED, action: 'Thermal shutdown — cease outdoor operation' };
}

export default function ThermalFailure() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const toC = (x: number) => state.units === 'F' ? (x - 32) * 5 / 9 : x;
    const wb = toC(parseNum(state.wetBulb));
    const gb = toC(parseNum(state.globeBulb));
    const db = toC(parseNum(state.dryBulb));
    const wbgtC = state.sun ? 0.7 * wb + 0.2 * gb + 0.1 * db : 0.7 * wb + 0.3 * db;
    const wbgtF = wbgtC * 9 / 5 + 32;
    return { wbgtC, wbgtF };
  }, [state]);

  const cls = classifyC(calc.wbgtC);
  const gaugePct = Math.min(100, Math.max(0, ((calc.wbgtC - 20) / 20) * 100));

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <AlertTriangle size={18} color={MAGENTA} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Thermal Failure · WBGT</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Units</div>
          <select value={state.units} onChange={(e) => setState({ ...state, units: e.target.value as Units })} style={input}>
            <option value="F">°F</option><option value="C">°C</option>
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Wet-bulb °{state.units}</div>
          <input inputMode="decimal" value={state.wetBulb} onChange={(e) => setState({ ...state, wetBulb: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Globe °{state.units}</div>
          <input inputMode="decimal" value={state.globeBulb} onChange={(e) => setState({ ...state, globeBulb: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Dry-bulb °{state.units}</div>
          <input inputMode="decimal" value={state.dryBulb} onChange={(e) => setState({ ...state, dryBulb: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Direct sun</div>
          <select value={state.sun ? 'y' : 'n'} onChange={(e) => setState({ ...state, sun: e.target.value === 'y' })} style={input}>
            <option value="y">Yes · outdoor</option><option value="n">No · shaded/indoor</option>
          </select></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Heat Stress Index</div>
        <div style={{ height: 24, background: '#0b1120', borderRadius: 4, overflow: 'hidden', border: `1px solid ${BORDER}`, position: 'relative' }}>
          <div style={{ width: `${gaugePct}%`, height: '100%', background: `linear-gradient(90deg, ${GREEN}, ${GOLD}, ${ORANGE}, ${MAGENTA}, ${RED})` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: DIM, marginTop: 4 }}>
          <span>20 °C</span><span>27</span><span>30</span><span>32</span><span style={{ color: RED }}>35+ fatal</span>
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: cls.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>WBGT</div>
        <div style={{ fontSize: 36, color: cls.color, fontWeight: 700 }}>{calc.wbgtC.toFixed(1)} °C</div>
        <div style={{ fontSize: 13, color: DIM, marginTop: 2 }}>= {calc.wbgtF.toFixed(1)} °F</div>
        <div style={{ fontSize: 14, color: TEXT, marginTop: 8 }}>Status: <span style={{ color: cls.color, fontWeight: 700 }}>{cls.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{cls.action}</div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10 }}>
        WBGT (outdoor) = 0.7·Tw + 0.2·Tg + 0.1·Td · WBGT (indoor) = 0.7·Tw + 0.3·Td. Thresholds per ACGIH TLV for moderate workload. Wet-bulb &gt; 35 °C = fundamental limit of human thermoregulation.
      </div>
    </div>
  );
}

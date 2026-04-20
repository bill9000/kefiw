import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

const STORAGE = 'uv-exposure-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444'; const ORANGE = '#f59e0b';

type Skin = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';

interface State { uvIndex: string; skin: Skin; spf: string; }
const DEFAULT_STATE: State = { uvIndex: '7', skin: 'II', spf: '30' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

// MED = Minimum Erythemal Dose (J/m²) per Fitzpatrick type
const MED: Record<Skin, { j: number; label: string }> = {
  I: { j: 200, label: 'I · Always burns, never tans' },
  II: { j: 250, label: 'II · Burns easily, tans minimally' },
  III: { j: 350, label: 'III · Burns moderately, tans gradually' },
  IV: { j: 450, label: 'IV · Burns minimally, tans well' },
  V: { j: 600, label: 'V · Rarely burns, tans darkly' },
  VI: { j: 1000, label: 'VI · Never burns, deeply pigmented' },
};

export default function UvExposure() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const ui = Math.max(0, parseNum(state.uvIndex));
    const spf = Math.max(1, parseNum(state.spf) || 1);
    const med = MED[state.skin].j;
    // UV Index 1 ≈ 25 mW/m² erythemally-weighted. Minutes to MED = MED_J / (UI × 25 × 60 / 1000) = MED / (UI × 1.5)
    const minUnprotected = ui > 0 ? med / (ui * 1.5) : Infinity;
    const minProtected = minUnprotected * spf;
    return { minUnprotected, minProtected, med, ui };
  }, [state]);

  const risk = calc.ui >= 8 ? { label: 'Extreme', color: RED } : calc.ui >= 6 ? { label: 'High', color: ORANGE } : calc.ui >= 3 ? { label: 'Moderate', color: GOLD } : { label: 'Low', color: GREEN };

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  const fmt = (m: number) => isFinite(m) ? (m >= 120 ? `${(m / 60).toFixed(1)} h` : `${m.toFixed(0)} min`) : '∞';

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <AlertTriangle size={18} color={GOLD} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>UV Exposure Delta · Fitzpatrick MED</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>UV Index (0–11+)</div>
          <input inputMode="decimal" value={state.uvIndex} onChange={(e) => setState({ ...state, uvIndex: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Skin type</div>
          <select value={state.skin} onChange={(e) => setState({ ...state, skin: e.target.value as Skin })} style={input}>
            {Object.entries(MED).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>SPF applied</div>
          <input inputMode="decimal" value={state.spf} onChange={(e) => setState({ ...state, spf: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: risk.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Risk Level · UV {calc.ui}</div>
        <div style={{ fontSize: 28, color: risk.color, fontWeight: 700 }}>{risk.label}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div style={{ ...panel, borderColor: MAGENTA }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Unprotected burn time</div>
          <div style={{ fontSize: 24, color: MAGENTA, fontWeight: 700 }}>{fmt(calc.minUnprotected)}</div>
          <div style={{ fontSize: 10, color: DIM }}>to 1 MED (erythema onset)</div>
        </div>
        <div style={{ ...panel, borderColor: CYAN }}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Protected burn time</div>
          <div style={{ fontSize: 24, color: CYAN, fontWeight: 700 }}>{fmt(calc.minProtected)}</div>
          <div style={{ fontSize: 10, color: DIM }}>w/ SPF (ideal application)</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Burn time = MED / (UVI × 1.5) min. SPF multiplier assumes ideal 2 mg/cm² coverage — real-world application typically delivers ¼ to ½ of labeled SPF. Re-apply every 2h or after swim/sweat.
      </div>
    </div>
  );
}

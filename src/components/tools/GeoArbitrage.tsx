import React, { useEffect, useMemo, useState } from 'react';
import { Plane } from 'lucide-react';
import { writeField } from '~/lib/session-context';

const STORAGE = 'geo-arbitrage-v1';
const PIPELINE_KEY = 'relocation_monthly_gain';
const PIPELINE_SOURCE = 'geo-arbitrage';
const PIPELINE_LABEL = 'Geo Arbitrage';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { incomeHere: string; costHere: string; incomeThere: string; costThere: string; moveCost: string; }
const DEFAULT_STATE: State = { incomeHere: '6000', costHere: '4500', incomeThere: '5500', costThere: '2800', moveCost: '6000' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function verdict(months: number, monthlyGain: number): { color: string; label: string; note: string } {
  if (monthlyGain <= 0) return { color: RED, label: 'Negative_Arbitrage', note: 'The destination costs more than it pays · the move loses money' };
  if (months <= 6) return { color: GREEN, label: 'Fast_Payback', note: 'Break-even inside 6 months — strong migration signal' };
  if (months <= 18) return { color: CYAN, label: 'Reasonable_Payback', note: 'Recovers within 1.5 years · viable if you plan to stay' };
  if (months <= 36) return { color: GOLD, label: 'Slow_Payback', note: 'Long horizon · only worth it for multi-year commitment' };
  return { color: MAGENTA, label: 'Marginal_Gain', note: 'Move cost dominates · geo alone will not rescue the math' };
}

interface GeoArbitrageProps {
  namespace?: string;
  lockedFields?: Partial<State>;
  onLockedChange?: (key: keyof State, value: string) => void;
}

export default function GeoArbitrage({ namespace, lockedFields, onLockedChange }: GeoArbitrageProps = {}) {
  const storageKey = namespace ? `${STORAGE}__${namespace}` : STORAGE;
  const pipelineKey = namespace ? `${PIPELINE_KEY}__${namespace}` : PIPELINE_KEY;
  const pipelineLabel = namespace ? `${PIPELINE_LABEL} · ${namespace.toUpperCase()}` : PIPELINE_LABEL;

  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(storageKey); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, [storageKey]);
  useEffect(() => { if (hydrated) localStorage.setItem(storageKey, JSON.stringify(state)); }, [state, hydrated, storageKey]);

  const lockedSig = JSON.stringify(lockedFields ?? {});
  const effState: State = useMemo(() => ({ ...state, ...(lockedFields ?? {}) }), [state, lockedSig]);

  const setField = (key: keyof State, value: string) => {
    if (lockedFields && key in lockedFields && onLockedChange) {
      onLockedChange(key, value);
    } else {
      setState((s) => ({ ...s, [key]: value }));
    }
  };
  const isLocked = (key: keyof State) => !!lockedFields && key in lockedFields;

  const calc = useMemo(() => {
    const iH = Math.max(0, parseNum(effState.incomeHere));
    const cH = Math.max(0, parseNum(effState.costHere));
    const iT = Math.max(0, parseNum(effState.incomeThere));
    const cT = Math.max(0, parseNum(effState.costThere));
    const mv = Math.max(0, parseNum(effState.moveCost));
    const surplusHere = iH - cH;
    const surplusThere = iT - cT;
    const monthlyGain = surplusThere - surplusHere;
    const breakEvenMonths = monthlyGain > 0 ? mv / monthlyGain : Infinity;
    const fiveYear = monthlyGain * 60 - mv;
    return { surplusHere, surplusThere, monthlyGain, breakEvenMonths, fiveYear, moveCost: mv };
  }, [effState]);

  const v = verdict(calc.breakEvenMonths, calc.monthlyGain);

  useEffect(() => {
    if (!hydrated) return;
    writeField(pipelineKey, calc.monthlyGain, PIPELINE_SOURCE, pipelineLabel);
  }, [calc.monthlyGain, hydrated, pipelineKey, pipelineLabel]);

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  const horizonMonths = 36;
  const planeX = calc.breakEvenMonths === Infinity ? 370 : Math.min(370, 20 + (Math.min(calc.breakEvenMonths, horizonMonths) / horizonMonths) * 350);

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Plane size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Geographic Arbitrage · Migration Horizon</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        {(['incomeHere','costHere','incomeThere','costThere','moveCost'] as const).map((k) => {
          const labels: Record<typeof k, string> = { incomeHere: 'Income · here', costHere: 'Cost · here', incomeThere: 'Income · there', costThere: 'Cost · there', moveCost: 'One-time move cost' };
          const locked = isLocked(k);
          return (
            <label key={k} style={{ fontSize: 12 }}>
              <div style={{ color: locked ? GOLD : DIM, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                {labels[k]}{locked && <span style={{ fontSize: 9, letterSpacing: '.12em', color: GOLD }}>🔒 LOCKED</span>}
              </div>
              <input
                inputMode="decimal"
                value={effState[k]}
                onChange={(e) => setField(k, e.target.value)}
                style={{ ...input, borderColor: locked ? GOLD : BORDER }}
              />
            </label>
          );
        })}
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Migration Horizon · Break-even Point</div>
        <svg width="100%" height={70} viewBox="0 0 400 70" style={{ display: 'block' }}>
          <line x1={20} y1={45} x2={380} y2={45} stroke={BORDER} strokeWidth={1.5} />
          {[0, 6, 12, 18, 24, 30, 36].map((m) => {
            const x = 20 + (m / horizonMonths) * 350;
            return (
              <g key={m}>
                <line x1={x} y1={42} x2={x} y2={48} stroke={DIM} strokeWidth={1} />
                <text x={x} y={60} fontSize={9} fill={DIM} fontFamily="inherit" textAnchor="middle">{m}m</text>
              </g>
            );
          })}
          <g transform={`translate(${planeX - 10}, 20)`}>
            <circle cx={10} cy={10} r={9} fill={v.color} opacity={0.25} />
            <path d="M1 10 L18 10 M13 5 L18 10 L13 15" stroke={v.color} strokeWidth={1.8} fill="none" />
          </g>
        </svg>
        <div style={{ fontSize: 10, color: DIM, marginTop: 4, textAlign: 'center' }}>
          {calc.breakEvenMonths === Infinity ? 'No break-even on this route' : `Break-even at month ${calc.breakEvenMonths.toFixed(1)}`}
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: v.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Monthly Gain After Move</div>
        <div style={{ fontSize: 36, color: v.color, fontWeight: 700 }}>${calc.monthlyGain.toFixed(0)}</div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Verdict: <span style={{ color: v.color, fontWeight: 700 }}>{v.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{v.note}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Surplus · here</div>
          <div style={{ fontSize: 18, color: calc.surplusHere >= 0 ? CYAN : RED, fontWeight: 700 }}>${calc.surplusHere.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Surplus · there</div>
          <div style={{ fontSize: 18, color: calc.surplusThere >= 0 ? GREEN : RED, fontWeight: 700 }}>${calc.surplusThere.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>5-year net</div>
          <div style={{ fontSize: 18, color: calc.fiveYear >= 0 ? GREEN : MAGENTA, fontWeight: 700 }}>${calc.fiveYear.toFixed(0)}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Monthly gain = (income − cost)<sub>there</sub> − (income − cost)<sub>here</sub>. Break-even = move cost / monthly gain. If you won't stay past break-even, the move is a bet against yourself.
      </div>
    </div>
  );
}

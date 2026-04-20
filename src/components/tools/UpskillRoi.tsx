import React, { useEffect, useMemo, useState } from 'react';
import { GraduationCap } from 'lucide-react';

const STORAGE = 'upskill-roi-v1';
const BG = '#0b1120'; const PANEL = '#0f172a'; const BORDER = '#1e293b';
const TEXT = '#e2e8f0'; const DIM = '#64748b';
const CYAN = '#22d3ee'; const GOLD = '#facc15'; const GREEN = '#4ade80'; const MAGENTA = '#f472b6'; const RED = '#ef4444';

interface State { courseCost: string; studyHours: string; hourlyWage: string; monthlyLift: string; }
const DEFAULT_STATE: State = { courseCost: '1500', studyHours: '120', hourlyWage: '35', monthlyLift: '400' };
function parseNum(s: string): number { const n = parseFloat(s.replace(/[,\s]/g, '')); return Number.isFinite(n) ? n : 0; }

function verdict(months: number): { color: string; label: string; note: string } {
  if (months <= 6) return { color: GREEN, label: 'Alpha_Bet', note: 'Recovers inside 6 months · invest aggressively' };
  if (months <= 18) return { color: CYAN, label: 'Solid_Investment', note: 'Payback within 1.5 years · standard ROI' };
  if (months <= 36) return { color: GOLD, label: 'Long_Arc', note: '~3 years to recover · only if the skill holds value' };
  if (months <= 72) return { color: MAGENTA, label: 'Slow_Drip', note: 'Six-year payback · marginal unless strategic' };
  return { color: RED, label: 'Negative_ROI', note: 'Lift too small to justify · find a cheaper path or higher-paying target' };
}

export default function UpskillRoi() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {} setHydrated(true); }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const course = Math.max(0, parseNum(state.courseCost));
    const hours = Math.max(0, parseNum(state.studyHours));
    const wage = Math.max(0, parseNum(state.hourlyWage));
    const lift = Math.max(0, parseNum(state.monthlyLift));
    const opportunityCost = hours * wage;
    const totalInvestment = course + opportunityCost;
    const paybackMonths = lift > 0 ? totalInvestment / lift : Infinity;
    const oneYearReturn = lift * 12 - totalInvestment;
    const threeYearReturn = lift * 36 - totalInvestment;
    return { course, hours, wage, lift, opportunityCost, totalInvestment, paybackMonths, oneYearReturn, threeYearReturn };
  }, [state]);

  const v = verdict(calc.paybackMonths);
  const progressPct = calc.paybackMonths === Infinity ? 0 : Math.max(0, Math.min(100, (24 / calc.paybackMonths) * 100));

  const shell: React.CSSProperties = { background: BG, color: TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${BORDER}` };
  const panel: React.CSSProperties = { background: PANEL, border: `1px solid ${BORDER}`, padding: '1rem', borderRadius: 8 };
  const input: React.CSSProperties = { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: `1px solid ${BORDER}`, background: '#0b1120', color: TEXT, fontFamily: 'inherit' };

  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <GraduationCap size={18} color={CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>Upskill ROI · Investment Recovery</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Course / tuition cost</div>
          <input inputMode="decimal" value={state.courseCost} onChange={(e) => setState({ ...state, courseCost: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Study hours total</div>
          <input inputMode="numeric" value={state.studyHours} onChange={(e) => setState({ ...state, studyHours: e.target.value })} style={input} /></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Your hourly wage</div>
          <input inputMode="decimal" value={state.hourlyWage} onChange={(e) => setState({ ...state, hourlyWage: e.target.value })} style={input} />
          <div style={{ fontSize: 10, color: DIM, marginTop: 3 }}>for opportunity cost</div></label>
        <label style={{ fontSize: 12 }}><div style={{ color: DIM, marginBottom: 4 }}>Monthly salary lift</div>
          <input inputMode="decimal" value={state.monthlyLift} onChange={(e) => setState({ ...state, monthlyLift: e.target.value })} style={input} /></label>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM, marginBottom: 8 }}>Recovery Progress · 24-month reference</div>
        <div style={{ height: 26, background: '#0b1120', borderRadius: 4, border: `1px solid ${BORDER}`, overflow: 'hidden', position: 'relative' }}>
          <div style={{ width: `${progressPct}%`, height: '100%', background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8, fontSize: 11, color: '#0b1120', fontWeight: 700 }}>
            {progressPct > 15 && `${progressPct.toFixed(0)}%`}
          </div>
        </div>
        <div style={{ fontSize: 10, color: DIM, marginTop: 4, textAlign: 'center' }}>
          {calc.paybackMonths === Infinity ? 'No recovery on current lift' : `Payback at month ${calc.paybackMonths.toFixed(1)}`}
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem', borderColor: v.color }}>
        <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Payback Window</div>
        <div style={{ fontSize: 36, color: v.color, fontWeight: 700 }}>
          {calc.paybackMonths === Infinity ? '∞' : `${calc.paybackMonths.toFixed(1)} mo`}
        </div>
        <div style={{ fontSize: 13, color: TEXT, marginTop: 4 }}>Verdict: <span style={{ color: v.color, fontWeight: 700 }}>{v.label}</span></div>
        <div style={{ fontSize: 11, color: DIM, marginTop: 2 }}>{v.note}</div>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Opportunity cost</div>
          <div style={{ fontSize: 18, color: MAGENTA, fontWeight: 700 }}>${calc.opportunityCost.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total investment</div>
          <div style={{ fontSize: 18, color: GOLD, fontWeight: 700 }}>${calc.totalInvestment.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>1-year net</div>
          <div style={{ fontSize: 18, color: calc.oneYearReturn >= 0 ? GREEN : RED, fontWeight: 700 }}>${calc.oneYearReturn.toFixed(0)}</div>
        </div>
        <div style={panel}>
          <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>3-year net</div>
          <div style={{ fontSize: 18, color: calc.threeYearReturn >= 0 ? GREEN : RED, fontWeight: 700 }}>${calc.threeYearReturn.toFixed(0)}</div>
        </div>
      </div>

      <div style={{ fontSize: 10, color: DIM, borderTop: `1px dashed ${BORDER}`, paddingTop: 10, marginTop: 12 }}>
        Payback = (course + study_hours × hourly_wage) / monthly_lift. Opportunity cost is the wage you could have earned instead — most "free" courses are not free.
      </div>
    </div>
  );
}

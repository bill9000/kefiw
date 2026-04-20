import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-titration-v1';

interface State {
  startDoseMg: string;
  incrementMg: string;
  stepWeeks: string;
  totalWeeks: string;
  startDate: string;
}

function todayISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function daysBetween(aISO: string, bISO: string): number {
  const a = new Date(aISO + 'T00:00:00').getTime();
  const b = new Date(bISO + 'T00:00:00').getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  return Math.floor((b - a) / 86400000);
}

const DEFAULT_STATE: State = {
  startDoseMg: '0.25',
  incrementMg: '0.25',
  stepWeeks: '4',
  totalWeeks: '20',
  startDate: todayISO(),
};

interface StageRow { week: number; dose: number; startDate: string; }

export default function Titration() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.startDoseMg, state.incrementMg, state.stepWeeks, state.totalWeeks, state.startDate]);

  const calc = useMemo(() => {
    const startDose = Math.max(0, parseNum(state.startDoseMg));
    const inc = Math.max(0, parseNum(state.incrementMg));
    const stepW = Math.max(1, Math.floor(parseNum(state.stepWeeks)));
    const totalW = Math.max(1, Math.floor(parseNum(state.totalWeeks)));
    const start = state.startDate;
    let err = '';
    if (!start || daysBetween('1970-01-01', start) === 0 && start !== '1970-01-01') err = 'Enter a valid start date (YYYY-MM-DD).';
    if (!err && startDose <= 0) err = 'Start dose must be greater than 0 mg.';
    if (!err && totalW < stepW) err = 'Total weeks must be >= step length.';
    if (err) return { err, schedule: [] as StageRow[], totalMass: 0, currentStage: null as StageRow | null, nextStage: null as StageRow | null, maxDose: 0 };

    const schedule: StageRow[] = [];
    let dose = startDose;
    for (let w = 0; w < totalW; w += stepW) {
      schedule.push({ week: w + 1, dose, startDate: addDays(start, w * 7) });
      dose = dose + inc;
    }
    // total mass = sum over stages of dose * stepWeeks (weekly injection assumption)
    const totalMass = schedule.reduce((acc, s, i) => {
      const nextW = i + 1 < schedule.length ? schedule[i + 1].week - 1 : totalW;
      const weeksInStage = Math.max(0, nextW - (s.week - 1));
      return acc + s.dose * weeksInStage;
    }, 0);

    const today = todayISO();
    const daysIn = Math.max(0, daysBetween(start, today));
    const weekIdx = Math.floor(daysIn / 7);
    let currentStage: StageRow | null = null;
    let nextStage: StageRow | null = null;
    for (let i = 0; i < schedule.length; i++) {
      const weekStart = schedule[i].week - 1;
      const weekEnd = i + 1 < schedule.length ? schedule[i + 1].week - 2 : totalW - 1;
      if (weekIdx >= weekStart && weekIdx <= weekEnd) {
        currentStage = schedule[i];
        nextStage = i + 1 < schedule.length ? schedule[i + 1] : null;
        break;
      }
    }
    if (!currentStage && weekIdx < 0) currentStage = schedule[0];
    const maxDose = schedule.reduce((m, s) => Math.max(m, s.dose), 0);

    return { err, schedule, totalMass: round2(totalMass), currentStage, nextStage, maxDose };
  }, [state]);

  const currentWeekNum = useMemo(() => {
    if (calc.err) return 0;
    const daysIn = Math.max(0, daysBetween(state.startDate, todayISO()));
    return Math.floor(daysIn / 7) + 1;
  }, [state.startDate, calc.err]);

  // SVG staircase dimensions
  const SVG_W = 400;
  const SVG_H = 160;
  const padL = 30;
  const padR = 10;
  const padT = 10;
  const padB = 20;
  const totalW = Math.max(1, Math.floor(parseNum(state.totalWeeks)));
  const xScale = (w: number) => padL + (w / totalW) * (SVG_W - padL - padR);
  const yScale = (d: number) => padT + (SVG_H - padT - padB) * (1 - (calc.maxDose > 0 ? d / calc.maxDose : 0));

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>TES-1 · Titration Roadmap</div>
        <div style={{ fontSize: 11, color: DIM }}>weekly dose escalation schedule and cycle-mass forecast</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Start dose (mg)</div>
          <input inputMode="decimal" value={state.startDoseMg} onChange={(e) => setState({ ...state, startDoseMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>week 1 dose</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Increment (mg)</div>
          <input inputMode="decimal" value={state.incrementMg} onChange={(e) => setState({ ...state, incrementMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>per step-up</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Step (weeks)</div>
          <input inputMode="decimal" value={state.stepWeeks} onChange={(e) => setState({ ...state, stepWeeks: e.target.value })} style={inputStyle} />
          <div style={dimHint}>weeks per stage</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Total (weeks)</div>
          <input inputMode="decimal" value={state.totalWeeks} onChange={(e) => setState({ ...state, totalWeeks: e.target.value })} style={inputStyle} />
          <div style={dimHint}>full cycle length</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Start date</div>
          <input type="date" value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} style={inputStyle} />
          <div style={dimHint}>week 1 anchor</div>
        </label>
      </div>

      {calc.err && (
        <div style={{ ...panelStyle, borderColor: MAGENTA, marginBottom: '1rem' }}>
          <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ SYSTEM ERROR</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>{calc.err}</div>
        </div>
      )}

      {!calc.err && (
        <>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0.5rem 0.75rem', background: verified ? 'rgba(34,211,238,0.1)' : '#1e293b', border: `1px solid ${verified ? CYAN : BORDER}`, borderRadius: 6, marginBottom: '0.75rem', cursor: 'pointer', fontSize: 11 }}>
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            <span style={{ color: verified ? CYAN : TEXT }}>
              {verified ? '✓ INPUTS VERIFIED — reveal roadmap' : 'Confirm dose schedule before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: CYAN, marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Current Stage</div>
                <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}>
                  Week <span style={{ color: CYAN, fontWeight: 700 }}>{currentWeekNum}</span>
                  {' · '}Dose <span style={{ color: CYAN, fontWeight: 700 }}>{calc.currentStage ? calc.currentStage.dose.toFixed(2) : '—'}</span> mg
                  {' · '}Next escalation: <span style={{ color: GOLD, fontWeight: 700 }}>{calc.nextStage ? calc.nextStage.startDate : 'cycle end'}</span>
                  {' · '}Total cycle mass: <span style={{ color: GOLD, fontWeight: 700 }}>{calc.totalMass.toFixed(2)}</span> mg
                </div>
              </div>

              <svg width="100%" height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} aria-label="Titration staircase" style={{ marginBottom: '0.75rem' }}>
                <line x1={padL} y1={SVG_H - padB} x2={SVG_W - padR} y2={SVG_H - padB} stroke={DIM} strokeWidth={1} />
                <line x1={padL} y1={padT} x2={padL} y2={SVG_H - padB} stroke={DIM} strokeWidth={1} />
                {calc.schedule.map((s, i) => {
                  const wStart = s.week - 1;
                  const wEnd = i + 1 < calc.schedule.length ? calc.schedule[i + 1].week - 1 : totalW;
                  const x0 = xScale(wStart);
                  const x1 = xScale(wEnd);
                  const y = yScale(s.dose);
                  const h = SVG_H - padB - y;
                  const active = calc.currentStage && calc.currentStage.week === s.week;
                  return (
                    <g key={i}>
                      <rect x={x0} y={y} width={x1 - x0} height={h} fill={active ? CYAN : LIQUID} opacity={active ? 0.6 : 0.25} stroke={active ? CYAN : DIM} strokeWidth={1} />
                      <text x={(x0 + x1) / 2} y={y - 3} fontSize={9} fill={active ? CYAN : DIM} textAnchor="middle" fontFamily="inherit">{s.dose.toFixed(2)}</text>
                    </g>
                  );
                })}
                <text x={padL - 4} y={padT + 6} fontSize={8} fill={DIM} textAnchor="end" fontFamily="inherit">mg</text>
                <text x={SVG_W - padR} y={SVG_H - 4} fontSize={8} fill={DIM} textAnchor="end" fontFamily="inherit">week {totalW}</text>
                {currentWeekNum > 0 && currentWeekNum <= totalW && (
                  <line x1={xScale(currentWeekNum - 1)} y1={padT} x2={xScale(currentWeekNum - 1)} y2={SVG_H - padB} stroke={GOLD} strokeWidth={1} strokeDasharray="3 2" />
                )}
              </svg>

              <div style={{ ...panelStyle, fontSize: 11 }}>
                <div style={{ color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: 10, marginBottom: 6 }}>Stage Schedule</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 6 }}>
                  {calc.schedule.map((s, i) => (
                    <div key={i} style={{ padding: '4px 8px', background: calc.currentStage && calc.currentStage.week === s.week ? 'rgba(34,211,238,0.15)' : 'transparent', border: `1px solid ${calc.currentStage && calc.currentStage.week === s.week ? CYAN : BORDER}`, borderRadius: 4 }}>
                      <div style={{ color: DIM, fontSize: 9 }}>Week {s.week}</div>
                      <div style={{ color: TEXT, fontWeight: 700 }}>{s.dose.toFixed(2)} mg</div>
                      <div style={{ color: DIM, fontSize: 9 }}>{s.startDate}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Titration Roadmap</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Escalation cadence must be set with your prescriber. Research/compounding contexts only.
      </div>
    </div>
  );
}

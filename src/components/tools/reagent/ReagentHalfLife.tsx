import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-half-life-v1';

interface State {
  doseMg: string;
  halfLifeDays: string;
  injectionIntervalDays: string;
  numDoses: string;
}

const DEFAULT_STATE: State = {
  doseMg: '2.5',
  halfLifeDays: '5',
  injectionIntervalDays: '7',
  numDoses: '6',
};

interface Point { t: number; c: number; }

export default function ReagentHalfLife() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.doseMg, state.halfLifeDays, state.injectionIntervalDays, state.numDoses]);

  const calc = useMemo(() => {
    const dose = Math.max(0, parseNum(state.doseMg));
    const hl = Math.max(0, parseNum(state.halfLifeDays));
    const interval = Math.max(0, parseNum(state.injectionIntervalDays));
    const n = Math.max(1, Math.floor(parseNum(state.numDoses)));
    let err = '';
    if (dose <= 0) err = 'Dose must be greater than 0 mg.';
    else if (hl <= 0) err = 'Half-life must be greater than 0 days.';
    else if (interval <= 0) err = 'Injection interval must be greater than 0 days.';
    if (err) return { err, points: [] as Point[], steadyStateDay: 0, currentC: 0, peakC: 0, tMax: 0 };

    const tMax = Math.ceil(n * interval + 2 * hl);
    const points: Point[] = [];
    for (let t = 0; t <= tMax; t++) {
      let c = 0;
      for (let i = 0; i < n; i++) {
        const iT = i * interval;
        if (iT <= t) c += dose * Math.pow(0.5, (t - iT) / hl);
      }
      points.push({ t, c });
    }
    const peakC = points.reduce((m, p) => Math.max(m, p.c), 0);
    // Steady-state: 4.3 half-lives after first dose — only meaningful if accumulation happens (interval <= 3*halfLife is a loose heuristic)
    const steadyStateDay = 4.3 * hl;
    // Current "today" anchor = day 0 (just-dosed) — pick middle of cycle for "current"
    const currentC = points[0]?.c ?? 0;

    return { err, points, steadyStateDay: round2(steadyStateDay), currentC: round2(currentC), peakC: round2(peakC), tMax };
  }, [state]);

  // SVG waveform
  const SVG_W = 400;
  const SVG_H = 180;
  const padL = 32;
  const padR = 8;
  const padT = 10;
  const padB = 22;
  const xScale = (t: number) => padL + (calc.tMax > 0 ? (t / calc.tMax) * (SVG_W - padL - padR) : 0);
  const yScale = (c: number) => padT + (SVG_H - padT - padB) * (1 - (calc.peakC > 0 ? c / calc.peakC : 0));

  const polyline = calc.points.map((p) => `${xScale(p.t)},${yScale(p.c)}`).join(' ');

  const interval = Math.max(0, parseNum(state.injectionIntervalDays));
  const n = Math.max(1, Math.floor(parseNum(state.numDoses)));
  const injectionDays: number[] = [];
  for (let i = 0; i < n; i++) injectionDays.push(i * interval);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>HDS-1 · Half-Life Decay</div>
        <div style={{ fontSize: 11, color: DIM }}>plasma stacking curve from repeat dosing</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '1rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Dose (mg)</div>
          <input inputMode="decimal" value={state.doseMg} onChange={(e) => setState({ ...state, doseMg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>per injection</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Half-life (days)</div>
          <input inputMode="decimal" value={state.halfLifeDays} onChange={(e) => setState({ ...state, halfLifeDays: e.target.value })} style={inputStyle} />
          <div style={dimHint}>t½ elimination</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Interval (days)</div>
          <input inputMode="decimal" value={state.injectionIntervalDays} onChange={(e) => setState({ ...state, injectionIntervalDays: e.target.value })} style={inputStyle} />
          <div style={dimHint}>between injections</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Doses</div>
          <input inputMode="decimal" value={state.numDoses} onChange={(e) => setState({ ...state, numDoses: e.target.value })} style={inputStyle} />
          <div style={dimHint}>cycle length</div>
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
              {verified ? '✓ INPUTS VERIFIED — reveal decay curve' : 'Confirm dose + half-life before display'}
            </span>
          </label>

          {verified ? (
            <>
              <div style={{ ...panelStyle, borderColor: CYAN, marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 4 }}>Plasma Stacking</div>
                <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.6 }}>
                  Estimated steady state in <span style={{ color: GOLD, fontWeight: 700 }}>{calc.steadyStateDay.toFixed(2)}</span> days
                  {' · '}Current blood level: <span style={{ color: CYAN, fontWeight: 700 }}>{calc.currentC.toFixed(2)}</span> mg
                  {' · '}Peak during cycle: <span style={{ color: MAGENTA, fontWeight: 700 }}>{calc.peakC.toFixed(2)}</span> mg
                </div>
              </div>

              <svg width="100%" height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} aria-label="Plasma decay waveform" style={{ marginBottom: '0.75rem' }}>
                {/* steady-state shading */}
                {calc.steadyStateDay < calc.tMax && (
                  <rect
                    x={xScale(calc.steadyStateDay)}
                    y={padT}
                    width={Math.max(0, xScale(calc.tMax) - xScale(calc.steadyStateDay))}
                    height={SVG_H - padT - padB}
                    fill={GOLD}
                    opacity={0.1}
                  />
                )}
                {/* axes */}
                <line x1={padL} y1={SVG_H - padB} x2={SVG_W - padR} y2={SVG_H - padB} stroke={DIM} strokeWidth={1} />
                <line x1={padL} y1={padT} x2={padL} y2={SVG_H - padB} stroke={DIM} strokeWidth={1} />
                {/* injection marks */}
                {injectionDays.map((d, i) => (
                  <line key={i} x1={xScale(d)} y1={padT} x2={xScale(d)} y2={SVG_H - padB} stroke={LIQUID} strokeWidth={0.8} strokeDasharray="2 3" opacity={0.5} />
                ))}
                {/* curve */}
                <polyline points={polyline} fill="none" stroke={CYAN} strokeWidth={2} />
                {/* steady-state marker */}
                {calc.steadyStateDay < calc.tMax && (
                  <>
                    <line x1={xScale(calc.steadyStateDay)} y1={padT} x2={xScale(calc.steadyStateDay)} y2={SVG_H - padB} stroke={GOLD} strokeWidth={1} strokeDasharray="4 2" />
                    <text x={xScale(calc.steadyStateDay) + 3} y={padT + 9} fontSize={9} fill={GOLD} fontFamily="inherit">SS≈4.3·t½</text>
                  </>
                )}
                {/* y-axis ticks */}
                <text x={padL - 4} y={yScale(calc.peakC) + 3} fontSize={8} fill={DIM} textAnchor="end" fontFamily="inherit">{calc.peakC.toFixed(1)}</text>
                <text x={padL - 4} y={SVG_H - padB + 3} fontSize={8} fill={DIM} textAnchor="end" fontFamily="inherit">0</text>
                <text x={padL - 4} y={padT + 6} fontSize={8} fill={DIM} textAnchor="end" fontFamily="inherit">mg</text>
                <text x={SVG_W - padR} y={SVG_H - 4} fontSize={8} fill={DIM} textAnchor="end" fontFamily="inherit">day {calc.tMax}</text>
              </svg>
            </>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Decay Curve</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Linear single-compartment first-order decay model; real PK varies with absorption, distribution, and clearance. Research/compounding contexts only.
      </div>
    </div>
  );
}

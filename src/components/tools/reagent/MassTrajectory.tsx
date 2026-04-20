import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-trajectory-v1';

type Med = 'reagent-A' | 'reagent-B';

const CURVES: Record<Med, Array<[number, number]>> = {
  'reagent-A': [[0, 0], [4, 2], [8, 4], [16, 7], [28, 11], [40, 13], [52, 14], [68, 15]],
  'reagent-B': [[0, 0], [4, 2.5], [8, 5], [16, 9], [28, 14], [40, 17], [52, 19], [72, 20]],
};

interface State {
  startWeightKg: string;
  currentWeightKg: string;
  weeksElapsed: string;
  medication: Med;
}
const DEFAULT_STATE: State = {
  startWeightKg: '100', currentWeightKg: '92', weeksElapsed: '12', medication: 'reagent-A',
};

type Status = 'Ahead' | 'On-track' | 'Behind';

function interp(curve: Array<[number, number]>, x: number): number {
  if (x <= curve[0][0]) return curve[0][1];
  const last = curve[curve.length - 1];
  if (x >= last[0]) return last[1];
  for (let i = 0; i < curve.length - 1; i++) {
    const [x0, y0] = curve[i];
    const [x1, y1] = curve[i + 1];
    if (x >= x0 && x <= x1) {
      const t = (x - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return 0;
}

export default function MassTrajectory() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE);
      if (r) {
        const parsed = JSON.parse(r) as Partial<State>;
        const next = { ...DEFAULT_STATE, ...parsed };
        if (!CURVES[next.medication]) next.medication = DEFAULT_STATE.medication;
        setState(next);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.startWeightKg, state.currentWeightKg, state.weeksElapsed, state.medication]);

  const calc = useMemo(() => {
    const sw = Math.max(0, parseNum(state.startWeightKg));
    const cw = Math.max(0, parseNum(state.currentWeightKg));
    const weeks = Math.max(0, parseNum(state.weeksElapsed));
    const curve = CURVES[state.medication];
    let err = '';
    if (sw <= 0) err = 'Start weight must be greater than 0 kg';
    else if (cw <= 0) err = 'Current weight must be greater than 0 kg';
    else if (weeks < 0) err = 'Weeks elapsed cannot be negative';
    else if (cw > sw) err = 'Current weight is greater than start — no loss recorded';

    const actualLossPct = sw > 0 ? ((sw - cw) / sw) * 100 : 0;
    const expectedLossPct = interp(curve, weeks);
    const delta = actualLossPct - expectedLossPct;
    let status: Status = 'On-track';
    if (delta >= 2) status = 'Ahead';
    else if (delta <= -2) status = 'Behind';
    return {
      err,
      weeks,
      actualLossPct: round2(actualLossPct),
      expectedLossPct: round2(expectedLossPct),
      delta: round2(delta),
      status,
      curve,
    };
  }, [state]);

  const statusColor = calc.status === 'Ahead' ? CYAN : calc.status === 'On-track' ? GOLD : MAGENTA;
  const W = 400, H = 180, padL = 40, padR = 20, padT = 14, padB = 28;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const maxWeek = calc.curve[calc.curve.length - 1][0];
  const maxY = Math.max(calc.curve[calc.curve.length - 1][1] + 4, Math.max(calc.actualLossPct, calc.expectedLossPct) + 4);
  const xScale = (wk: number): number => padL + (wk / maxWeek) * innerW;
  const yScale = (pct: number): number => padT + innerH - (pct / maxY) * innerH;
  const path = calc.curve.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${xScale(x).toFixed(1)} ${yScale(y).toFixed(1)}`).join(' ');
  const userX = xScale(Math.min(maxWeek, calc.weeks));
  const userY = yScale(calc.actualLossPct);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>TRJ-1 · WEIGHT LOSS TRAJECTORY</div>
        <div style={{ fontSize: 11, color: DIM }}>Actual progress vs clinical-trial curve · reagent-A / reagent-B</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Start weight (kg)</div>
          <input inputMode="decimal" value={state.startWeightKg} onChange={(e) => setState({ ...state, startWeightKg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>day 0 · baseline</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Current weight (kg)</div>
          <input inputMode="decimal" value={state.currentWeightKg} onChange={(e) => setState({ ...state, currentWeightKg: e.target.value })} style={inputStyle} />
          <div style={dimHint}>latest recorded weight</div>
        </label>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Weeks elapsed</div>
          <input inputMode="decimal" value={state.weeksElapsed} onChange={(e) => setState({ ...state, weeksElapsed: e.target.value })} style={inputStyle} />
          <div style={dimHint}>since first injection</div>
        </label>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: 12, color: DIM, marginBottom: 4 }}>Medication</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['reagent-A', 'reagent-B'] as Med[]).map((m) => (
            <button key={m} type="button" onClick={() => setState({ ...state, medication: m })} style={{
              padding: '6px 12px', fontSize: 11, borderRadius: 6, cursor: 'pointer',
              background: state.medication === m ? 'rgba(34,211,238,0.15)' : '#0b1120',
              border: `1px solid ${state.medication === m ? CYAN : BORDER}`,
              color: state.medication === m ? CYAN : TEXT, fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>{m}</button>
          ))}
        </div>
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
              {verified ? '✓ INPUTS VERIFIED — reveal trajectory' : 'Confirm weights + weeks before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: statusColor }}>
              <svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} aria-label="Weight loss trajectory chart">
                <line x1={padL} y1={padT + innerH} x2={padL + innerW} y2={padT + innerH} stroke={DIM} strokeWidth={1} />
                <line x1={padL} y1={padT} x2={padL} y2={padT + innerH} stroke={DIM} strokeWidth={1} />
                {[0, 5, 10, 15, 20].filter((p) => p <= maxY).map((p) => (
                  <g key={p}>
                    <line x1={padL} y1={yScale(p)} x2={padL + innerW} y2={yScale(p)} stroke={BORDER} strokeDasharray="2 3" strokeWidth={0.5} />
                    <text x={padL - 6} y={yScale(p) + 3} fontSize={9} fill={DIM} textAnchor="end" fontFamily="inherit">{p}%</text>
                  </g>
                ))}
                {[0, Math.round(maxWeek / 4), Math.round(maxWeek / 2), Math.round(maxWeek * 3 / 4), maxWeek].map((w) => (
                  <text key={w} x={xScale(w)} y={padT + innerH + 14} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">w{w}</text>
                ))}
                <path d={path} fill="none" stroke={DIM} strokeWidth={1.5} strokeDasharray="4 3" />
                <text x={padL + innerW - 4} y={yScale(calc.curve[calc.curve.length - 1][1]) - 4} fontSize={9} fill={DIM} textAnchor="end" fontFamily="inherit">clinical</text>
                <circle cx={userX} cy={userY} r={6} fill={statusColor} />
                <circle cx={userX} cy={userY} r={10} fill="none" stroke={statusColor} strokeWidth={1.5} opacity={0.5} />
                <text x={userX} y={userY - 12} fontSize={10} fill={statusColor} textAnchor="middle" fontFamily="inherit" fontWeight={700}>you</text>
              </svg>

              <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(4, 1fr)', marginTop: '0.5rem', fontSize: 11 }}>
                <div>
                  <div style={{ fontSize: 9, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Week</div>
                  <div style={{ fontSize: 18, color: TEXT, fontWeight: 700 }}>{calc.weeks.toFixed(0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actual</div>
                  <div style={{ fontSize: 18, color: statusColor, fontWeight: 700 }}>{calc.actualLossPct.toFixed(2)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expected</div>
                  <div style={{ fontSize: 18, color: GOLD, fontWeight: 700 }}>{calc.expectedLossPct.toFixed(2)}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Delta</div>
                  <div style={{ fontSize: 18, color: statusColor, fontWeight: 700 }}>{calc.delta >= 0 ? '+' : ''}{calc.delta.toFixed(2)}%</div>
                </div>
              </div>
              <div style={{ marginTop: 6, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: statusColor, fontWeight: 700 }}>Status: {calc.status}</div>
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Trajectory</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Clinical curves approximate STEP (reagent-A) and SURMOUNT (reagent-B) trial averages — individual response varies widely. Research/education only.
      </div>
    </div>
  );
}

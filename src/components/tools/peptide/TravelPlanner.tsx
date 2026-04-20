import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-travel-v1';

interface Row {
  name: string;
  doseMg: string;
  intervalDays: string;
  concMgMl: string;
}

interface State {
  tripDays: string;
  rows: [Row, Row, Row];
}

const DEFAULT_STATE: State = {
  tripDays: '14',
  rows: [
    { name: 'Reagent-A', doseMg: '0.5',  intervalDays: '7', concMgMl: '2.5' },
    { name: 'Reagent-B', doseMg: '0.25', intervalDays: '1', concMgMl: '5' },
    { name: '',          doseMg: '0',    intervalDays: '0', concMgMl: '0' },
  ],
};

interface RowCalc {
  index: number;
  row: Row;
  active: boolean;
  dosesNeeded: number;
  totalMg: number;
  totalVolMl: number;
  syringesNeeded: number;
}

export default function TravelPlanner() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE);
      if (r) {
        const parsed = JSON.parse(r) as Partial<State>;
        const rows = parsed.rows && parsed.rows.length === 3 ? parsed.rows as [Row, Row, Row] : DEFAULT_STATE.rows;
        setState({ tripDays: parsed.tripDays ?? DEFAULT_STATE.tripDays, rows });
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state]);

  const updateRow = (i: 0 | 1 | 2, patch: Partial<Row>) => {
    const rows = state.rows.slice() as [Row, Row, Row];
    rows[i] = { ...rows[i], ...patch };
    setState({ ...state, rows });
  };

  const { calcs, agg, err } = useMemo(() => {
    const days = Math.max(0, parseNum(state.tripDays));
    let err = '';
    if (days <= 0) err = 'Trip days must be greater than 0';

    const calcs: RowCalc[] = state.rows.map((row, i) => {
      const dose = Math.max(0, parseNum(row.doseMg));
      const interval = Math.max(0, parseNum(row.intervalDays));
      const conc = Math.max(0, parseNum(row.concMgMl));
      const active = dose > 0 && interval > 0;
      if (!active) return { index: i, row, active, dosesNeeded: 0, totalMg: 0, totalVolMl: 0, syringesNeeded: 0 };
      if (conc <= 0) {
        if (!err) err = `Row ${i + 1} (${row.name || 'unnamed'}): concentration must be > 0 mg/mL`;
        return { index: i, row, active, dosesNeeded: 0, totalMg: 0, totalVolMl: 0, syringesNeeded: 0 };
      }
      const dosesNeeded = Math.ceil(days / interval);
      const totalMg = dosesNeeded * dose;
      const totalVolMl = totalMg / conc;
      const syringesNeeded = dosesNeeded + 2;
      return { index: i, row, active, dosesNeeded, totalMg, totalVolMl, syringesNeeded };
    });

    const activeCalcs = calcs.filter((c) => c.active);
    if (!err && activeCalcs.length === 0) err = 'Add at least one reagent with amount > 0 and interval > 0';

    const totalBacMl = activeCalcs.reduce((s, c) => s + c.totalVolMl, 0);
    const totalSyringes = activeCalcs.reduce((s, c) => s + c.syringesNeeded, 0) + 4;
    const alcoholSwabs = totalSyringes * 2;
    const sharpsContainer: 'small' | 'large' = totalSyringes > 20 ? 'large' : 'small';

    return {
      calcs,
      agg: {
        days,
        totalBacMl: round2(totalBacMl),
        totalSyringes,
        alcoholSwabs,
        sharpsContainer,
        vialCount: activeCalcs.length,
      },
      err,
    };
  }, [state]);

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>TRA-1 · Travel Logistics</div>
        <div style={{ fontSize: 11, color: DIM }}>packing manifest · draws, vials, syringes, swabs, sharps</div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Trip length (days)</div>
          <input inputMode="decimal" value={state.tripDays} onChange={(e) => setState({ ...state, tripDays: e.target.value })} style={{ ...inputStyle, maxWidth: 160 }} />
          <div style={dimHint}>total days away · round up for safety</div>
        </label>
      </div>

      <div style={{ display: 'grid', gap: 6, marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 0.9fr', gap: 6, fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <div>Reagent</div><div>Amount (mg)</div><div>Interval (d)</div><div>Conc (mg/mL)</div>
        </div>
        {state.rows.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 0.9fr', gap: 6 }}>
            <input value={row.name} onChange={(e) => updateRow(i as 0 | 1 | 2, { name: e.target.value })} placeholder={`row ${i + 1}`} style={inputStyle} />
            <input inputMode="decimal" value={row.doseMg} onChange={(e) => updateRow(i as 0 | 1 | 2, { doseMg: e.target.value })} style={inputStyle} />
            <input inputMode="decimal" value={row.intervalDays} onChange={(e) => updateRow(i as 0 | 1 | 2, { intervalDays: e.target.value })} style={inputStyle} />
            <input inputMode="decimal" value={row.concMgMl} onChange={(e) => updateRow(i as 0 | 1 | 2, { concMgMl: e.target.value })} style={inputStyle} />
          </div>
        ))}
      </div>

      {err && (
        <div style={{ ...panelStyle, borderColor: MAGENTA, marginBottom: '1rem' }}>
          <div style={{ color: MAGENTA, fontSize: 12, fontWeight: 700 }}>▸ SYSTEM ERROR</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>{err}</div>
        </div>
      )}

      {!err && (
        <>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '0.5rem 0.75rem', background: verified ? 'rgba(34,211,238,0.1)' : '#1e293b', border: `1px solid ${verified ? CYAN : BORDER}`, borderRadius: 6, marginBottom: '0.75rem', cursor: 'pointer', fontSize: 11 }}>
            <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
            <span style={{ color: verified ? CYAN : TEXT }}>
              {verified ? '✓ INPUTS VERIFIED — reveal packing manifest' : 'Confirm trip + reagent rows before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: CYAN }}>
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <svg width={220} height={140} viewBox="0 0 220 140" aria-label="Suitcase">
                  <rect x={10} y={26} width={200} height={104} rx={8} fill="none" stroke={DIM} strokeWidth={1.5} />
                  <rect x={88} y={10} width={44} height={20} rx={4} fill="none" stroke={DIM} strokeWidth={1.5} />
                  <line x1={10} y1={40} x2={210} y2={40} stroke={DIM} strokeDasharray="3 3" strokeWidth={0.8} />
                  {/* vials */}
                  {Array.from({ length: Math.min(agg.vialCount, 3) }).map((_, k) => (
                    <g key={`v-${k}`} transform={`translate(${24 + k * 26}, 56)`}>
                      <rect x={0} y={4} width={16} height={40} rx={2} fill={LIQUID} opacity={0.6} stroke={DIM} strokeWidth={0.8} />
                      <rect x={3} y={0} width={10} height={4} fill={DIM} />
                    </g>
                  ))}
                  {/* syringe */}
                  <g transform="translate(110, 62)">
                    <rect x={0} y={8} width={50} height={10} rx={2} fill="none" stroke={DIM} strokeWidth={1} />
                    <rect x={0} y={8} width={Math.min(50, agg.totalSyringes * 2)} height={10} fill={CYAN} opacity={0.5} />
                    <line x1={50} y1={13} x2={66} y2={13} stroke={DIM} strokeWidth={1.2} />
                    <rect x={-8} y={6} width={8} height={14} fill={DIM} />
                  </g>
                  {/* swab */}
                  <g transform="translate(114, 92)">
                    <rect x={0} y={0} width={18} height={18} rx={3} fill="none" stroke={GOLD} strokeWidth={1.2} />
                    <text x={9} y={12} fontSize={9} fill={GOLD} textAnchor="middle" fontFamily="inherit">S</text>
                  </g>
                  {/* badges */}
                  <g transform="translate(160, 56)">
                    <circle cx={0} cy={0} r={12} fill={CYAN} opacity={0.2} stroke={CYAN} strokeWidth={1} />
                    <text x={0} y={3} fontSize={10} fill={CYAN} textAnchor="middle" fontFamily="inherit" fontWeight={700}>{agg.totalSyringes}</text>
                  </g>
                  <g transform="translate(160, 86)">
                    <circle cx={0} cy={0} r={12} fill={GOLD} opacity={0.2} stroke={GOLD} strokeWidth={1} />
                    <text x={0} y={3} fontSize={10} fill={GOLD} textAnchor="middle" fontFamily="inherit" fontWeight={700}>{agg.alcoholSwabs}</text>
                  </g>
                  <g transform="translate(160, 116)">
                    <text x={0} y={0} fontSize={9} fill={DIM} textAnchor="middle" fontFamily="inherit">syringes · swabs</text>
                  </g>
                </svg>

                <div>
                  <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Trip</div>
                  <div style={{ fontSize: 22, color: CYAN, fontWeight: 700, lineHeight: 1.1 }}>{round2(agg.days).toFixed(0)} days</div>
                  <div style={{ fontSize: 11, color: DIM, marginTop: 6 }}>
                    Sharps container: <span style={{ color: agg.sharpsContainer === 'large' ? GOLD : CYAN, fontWeight: 700 }}>{agg.sharpsContainer}</span>
                  </div>
                  <div style={{ fontSize: 11, color: DIM }}>
                    Total BAC water: <span style={{ color: TEXT }}>{agg.totalBacMl.toFixed(2)} mL</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.9fr 0.9fr 0.9fr', gap: 6, fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0 4px' }}>
                <div>Reagent</div><div>Draws</div><div>Total mg</div><div>Total mL</div><div>Syringes</div>
              </div>
              {calcs.map((c, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.9fr 0.9fr 0.9fr', gap: 6, fontSize: 11, padding: '4px 0', borderTop: `1px dashed ${BORDER}`, opacity: c.active ? 1 : 0.4 }}>
                  <div style={{ color: c.active ? TEXT : DIM, fontWeight: 700 }}>{c.row.name || `row ${i + 1}`}</div>
                  <div>{c.active ? c.dosesNeeded : '—'}</div>
                  <div>{c.active ? round2(c.totalMg).toFixed(2) : '—'}</div>
                  <div>{c.active ? round2(c.totalVolMl).toFixed(2) : '—'}</div>
                  <div>{c.active ? c.syringesNeeded : '—'}</div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.7fr 0.9fr 0.9fr 0.9fr', gap: 6, fontSize: 11, padding: '6px 0 0', borderTop: `1px solid ${CYAN}`, marginTop: 4 }}>
                <div style={{ color: CYAN, fontWeight: 700 }}>TOTALS (+ spare)</div>
                <div>—</div>
                <div>—</div>
                <div style={{ color: CYAN, fontWeight: 700 }}>{agg.totalBacMl.toFixed(2)}</div>
                <div style={{ color: CYAN, fontWeight: 700 }}>{agg.totalSyringes}</div>
              </div>
              <div style={{ fontSize: 11, color: DIM, marginTop: 6 }}>
                Alcohol swabs: <span style={{ color: GOLD, fontWeight: 700 }}>{agg.alcoholSwabs}</span> · Sharps: <span style={{ color: TEXT }}>{agg.sharpsContainer}</span>
              </div>

              <div style={{ marginTop: '0.75rem', padding: '0.5rem 0.75rem', background: 'rgba(250,204,21,0.08)', border: `1px solid ${GOLD}`, borderRadius: 6, fontSize: 11, color: TEXT }}>
                Declare all medications at customs. Carry in original vial + Rx if prescription. TSA requires sharps in a container.
              </div>
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Packing Manifest</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Travel regulations vary by country and airline — verify before departure. Research/compounding contexts only.
      </div>
    </div>
  );
}

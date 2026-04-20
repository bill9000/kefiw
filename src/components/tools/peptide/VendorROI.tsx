import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-vendor-roi-v1';

interface Row {
  name: string;
  massMg: string;
  pricePerVial: string;
  shipping: string;
  bulkQty: string;
}

interface State {
  rows: [Row, Row, Row];
  doseTargetMcg: string;
}

const DEFAULT_STATE: State = {
  rows: [
    { name: 'Vendor A', massMg: '2',  pricePerVial: '60',  shipping: '15', bulkQty: '1' },
    { name: 'Vendor B', massMg: '5',  pricePerVial: '120', shipping: '15', bulkQty: '1' },
    { name: 'Vendor C', massMg: '10', pricePerVial: '220', shipping: '20', bulkQty: '3' },
  ],
  doseTargetMcg: '250',
};

interface Calc {
  index: number;
  row: Row;
  totalMg: number;
  totalCost: number;
  costPerMcg: number;
  costPerDose: number;
  valid: boolean;
}

export default function VendorROI() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    try {
      const r = localStorage.getItem(STORAGE);
      if (r) {
        const parsed = JSON.parse(r) as Partial<State>;
        const rows = parsed.rows && parsed.rows.length === 3 ? parsed.rows as [Row, Row, Row] : DEFAULT_STATE.rows;
        setState({ rows, doseTargetMcg: parsed.doseTargetMcg ?? DEFAULT_STATE.doseTargetMcg });
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

  const { calcs, err, dose, winner, loser, maxLen } = useMemo(() => {
    const dose = Math.max(0, parseNum(state.doseTargetMcg));
    let err = '';
    if (dose <= 0) err = 'Target dose (mcg) must be greater than 0';

    const raw: Calc[] = state.rows.map((row, i) => {
      const mass = Math.max(0, parseNum(row.massMg));
      const price = Math.max(0, parseNum(row.pricePerVial));
      const ship = Math.max(0, parseNum(row.shipping));
      const qty = Math.max(1, parseNum(row.bulkQty));
      const valid = mass > 0 && price > 0 && qty > 0;
      const totalMg = mass * qty;
      const totalCost = price * qty + ship;
      const costPerMcg = valid ? totalCost / (totalMg * 1000) : 0;
      const costPerDose = costPerMcg * dose;
      return { index: i, row, totalMg, totalCost, costPerMcg, costPerDose, valid };
    });

    const active = raw.filter((c) => c.valid);
    if (!err && active.length < 2) err = 'At least two vendors must have mass, price, and quantity > 0';

    const sorted = [...active].sort((a, b) => a.costPerDose - b.costPerDose);
    const winner = sorted[0];
    const loser = sorted[sorted.length - 1];
    const maxLen = Math.max(...active.map((c) => c.costPerDose), 0.0001);
    return { calcs: raw, err, dose, winner, loser, maxLen };
  }, [state]);

  const barWidth = (c: Calc): number => {
    if (!c.valid || maxLen <= 0) return 0;
    const invNorm = 1 - (c.costPerDose / maxLen);
    const minBar = 0.15;
    return Math.max(minBar, minBar + (1 - minBar) * invNorm);
  };

  const colorFor = (c: Calc): string => {
    if (!winner || !loser) return TEXT;
    if (c.index === winner.index) return CYAN;
    if (c.index === loser.index && winner.index !== loser.index) return MAGENTA;
    return GOLD;
  };

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>ROI-1 · Vendor Cost per Effective Dose</div>
        <div style={{ fontSize: 11, color: DIM }}>normalize vendors by $/mcg and by $/dose-at-target</div>
      </div>

      <div style={{ marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Target dose (mcg)</div>
          <input inputMode="decimal" value={state.doseTargetMcg} onChange={(e) => setState({ ...state, doseTargetMcg: e.target.value })} style={{ ...inputStyle, maxWidth: 160 }} />
          <div style={dimHint}>single-injection dose for cost-per-dose comparison</div>
        </label>
      </div>

      <div style={{ display: 'grid', gap: 6, marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 0.8fr 0.7fr', gap: 6, fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          <div>Vendor</div><div>mass (mg)</div><div>$ per vial</div><div>$ ship</div><div>qty</div>
        </div>
        {state.rows.map((row, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 0.8fr 0.7fr', gap: 6 }}>
            <input value={row.name} onChange={(e) => updateRow(i as 0 | 1 | 2, { name: e.target.value })} style={inputStyle} />
            <input inputMode="decimal" value={row.massMg} onChange={(e) => updateRow(i as 0 | 1 | 2, { massMg: e.target.value })} style={inputStyle} />
            <input inputMode="decimal" value={row.pricePerVial} onChange={(e) => updateRow(i as 0 | 1 | 2, { pricePerVial: e.target.value })} style={inputStyle} />
            <input inputMode="decimal" value={row.shipping} onChange={(e) => updateRow(i as 0 | 1 | 2, { shipping: e.target.value })} style={inputStyle} />
            <input inputMode="decimal" value={row.bulkQty} onChange={(e) => updateRow(i as 0 | 1 | 2, { bulkQty: e.target.value })} style={inputStyle} />
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
              {verified ? '✓ INPUTS VERIFIED — reveal vendor ranking' : 'Confirm vendor rows + target dose before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: CYAN }}>
              <svg width="100%" height={120} viewBox="0 0 400 120" aria-label="Vendor cost bar chart" style={{ marginBottom: '0.75rem' }}>
                {calcs.map((c, i) => {
                  const y = 10 + i * 36;
                  const w = barWidth(c) * 280;
                  const col = colorFor(c);
                  return (
                    <g key={i}>
                      <text x={4} y={y + 14} fontSize={10} fill={DIM} fontFamily="inherit">{c.row.name || `row ${i + 1}`}</text>
                      <rect x={90} y={y} width={280} height={22} fill="none" stroke={BORDER} strokeWidth={0.8} rx={2} />
                      <rect x={90} y={y} width={c.valid ? w : 0} height={22} fill={col} opacity={0.75} rx={2} />
                      <text x={378} y={y + 14} fontSize={10} fill={col} textAnchor="end" fontFamily="inherit" fontWeight={700}>
                        {c.valid ? `$${round2(c.costPerDose).toFixed(2)}/dose` : '—'}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 0.9fr 1.1fr', gap: 6, fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 0 4px' }}>
                <div>Vendor</div><div>Total mg</div><div>Total $</div><div>$ / mcg</div><div>$ / dose</div>
              </div>
              {calcs.map((c, i) => {
                const col = colorFor(c);
                return (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr 0.9fr 0.9fr 1.1fr', gap: 6, fontSize: 11, padding: '4px 0', borderTop: `1px dashed ${BORDER}` }}>
                    <div style={{ color: col, fontWeight: 700 }}>{c.row.name || `row ${i + 1}`}</div>
                    <div>{c.valid ? round2(c.totalMg).toFixed(2) : '—'}</div>
                    <div>{c.valid ? `$${round2(c.totalCost).toFixed(2)}` : '—'}</div>
                    <div>{c.valid ? `$${c.costPerMcg.toFixed(4)}` : '—'}</div>
                    <div style={{ color: col, fontWeight: 700 }}>{c.valid ? `$${round2(c.costPerDose).toFixed(2)}` : '—'}</div>
                  </div>
                );
              })}

              {winner && loser && (
                <div style={{ marginTop: '0.75rem', fontSize: 11, color: TEXT }}>
                  Best: <span style={{ color: CYAN, fontWeight: 700 }}>{winner.row.name}</span> · $
                  {round2(winner.costPerDose).toFixed(2)} per {round2(dose).toFixed(0)} mcg dose · saves $
                  {round2(loser.costPerDose - winner.costPerDose).toFixed(2)} vs worst per dose
                </div>
              )}
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Vendor Ranking</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Vendor quality, purity, and legitimacy are not modeled — cost alone is not a basis for sourcing decisions. Research/compounding contexts only.
      </div>
    </div>
  );
}

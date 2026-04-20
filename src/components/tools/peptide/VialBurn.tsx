import React, { useEffect, useMemo, useState } from 'react';
import {
  BORDER, TEXT, DIM, CYAN, GOLD, MAGENTA, LIQUID,
  shellStyle, panelStyle, inputStyle, labelStyle, dimHint, parseNum, round2, disclaimerStyle,
} from './_shared';

const STORAGE = 'peptide-vial-burn-v1';

interface State {
  totalMassMg: string;
  doseMg: string;
  injectionIntervalDays: string;
  leadTimeDays: string;
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
  totalMassMg: '10',
  doseMg: '0.25',
  injectionIntervalDays: '7',
  leadTimeDays: '14',
  startDate: todayISO(),
};

type Status = 'Nominal' | 'Guarded' | 'Critical';

export default function VialBurn() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    try { const r = localStorage.getItem(STORAGE); if (r) setState({ ...DEFAULT_STATE, ...(JSON.parse(r) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);
  useEffect(() => { setVerified(false); }, [state.totalMassMg, state.doseMg, state.injectionIntervalDays, state.leadTimeDays, state.startDate]);

  const calc = useMemo(() => {
    const mass = Math.max(0, parseNum(state.totalMassMg));
    const dose = Math.max(0, parseNum(state.doseMg));
    const interval = Math.max(0, parseNum(state.injectionIntervalDays));
    const lead = Math.max(0, parseNum(state.leadTimeDays));
    let err = '';
    if (dose <= 0) err = 'Dose must be greater than 0 mg.';
    else if (interval <= 0) err = 'Injection interval must be greater than 0 days.';
    else if (mass <= 0) err = 'Total mass must be greater than 0 mg.';
    else if (!state.startDate) err = 'Enter a valid start date.';
    if (err) return { err, dosesRemaining: 0, daysRemaining: 0, emptyDate: '', reorderDate: '', status: 'Nominal' as Status, elapsedDays: 0 };

    const dosesRemaining = Math.floor(mass / dose);
    const daysRemaining = dosesRemaining * interval;
    const emptyDate = addDays(state.startDate, daysRemaining);
    const reorderDate = addDays(emptyDate, -lead);
    const today = todayISO();
    const elapsedDays = Math.max(0, daysBetween(state.startDate, today));
    const daysLeftFromToday = Math.max(0, daysRemaining - elapsedDays);

    let status: Status = 'Nominal';
    if (daysLeftFromToday < lead) status = 'Critical';
    else if (daysLeftFromToday < 2 * lead) status = 'Guarded';

    return { err, dosesRemaining, daysRemaining, emptyDate, reorderDate, status, elapsedDays };
  }, [state]);

  const statusColor = calc.status === 'Critical' ? MAGENTA : calc.status === 'Guarded' ? GOLD : CYAN;
  const fillFrac = calc.daysRemaining > 0 ? Math.min(1, Math.max(0, calc.elapsedDays / calc.daysRemaining)) : 0;

  // Sandglass geometry
  const SG_W = 60;
  const SG_H = 140;

  return (
    <div style={shellStyle}>
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: DIM }}>INV-1 · Inventory Burn-Rate</div>
        <div style={{ fontSize: 11, color: DIM }}>depletion date and reorder lead-time forecast</div>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr 1fr 120px', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={labelStyle}>
            <div style={{ color: DIM, marginBottom: 4 }}>Total mass (mg)</div>
            <input inputMode="decimal" value={state.totalMassMg} onChange={(e) => setState({ ...state, totalMassMg: e.target.value })} style={inputStyle} />
            <div style={dimHint}>stock on hand</div>
          </label>
          <label style={labelStyle}>
            <div style={{ color: DIM, marginBottom: 4 }}>Dose (mg)</div>
            <input inputMode="decimal" value={state.doseMg} onChange={(e) => setState({ ...state, doseMg: e.target.value })} style={inputStyle} />
            <div style={dimHint}>per injection</div>
          </label>
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label style={labelStyle}>
            <div style={{ color: DIM, marginBottom: 4 }}>Interval (days)</div>
            <input inputMode="decimal" value={state.injectionIntervalDays} onChange={(e) => setState({ ...state, injectionIntervalDays: e.target.value })} style={inputStyle} />
            <div style={dimHint}>between injections</div>
          </label>
          <label style={labelStyle}>
            <div style={{ color: DIM, marginBottom: 4 }}>Lead time (days)</div>
            <input inputMode="decimal" value={state.leadTimeDays} onChange={(e) => setState({ ...state, leadTimeDays: e.target.value })} style={inputStyle} />
            <div style={dimHint}>reorder-to-delivery</div>
          </label>
        </div>
        <label style={labelStyle}>
          <div style={{ color: DIM, marginBottom: 4 }}>Start date</div>
          <input type="date" value={state.startDate} onChange={(e) => setState({ ...state, startDate: e.target.value })} style={inputStyle} />
          <div style={dimHint}>stock-open anchor</div>
        </label>
        <svg width={SG_W * 2} height={SG_H} viewBox={`0 0 ${SG_W} ${SG_H}`} aria-label="Sandglass depletion" style={{ justifySelf: 'center' }}>
          <defs>
            <clipPath id="topBulb">
              <polygon points="6,10 54,10 30,68" />
            </clipPath>
            <clipPath id="botBulb">
              <polygon points="30,72 54,130 6,130" />
            </clipPath>
          </defs>
          <rect x={2} y={6} width={56} height={4} fill={DIM} />
          <rect x={2} y={130} width={56} height={4} fill={DIM} />
          <polygon points="6,10 54,10 30,68" fill="none" stroke={DIM} strokeWidth={1.2} />
          <polygon points="30,72 54,130 6,130" fill="none" stroke={DIM} strokeWidth={1.2} />
          {/* top bulb liquid — shrinks as time passes */}
          <rect x={0} y={10 + 58 * fillFrac} width={SG_W} height={58 * (1 - fillFrac)} fill={LIQUID} opacity={0.6} clipPath="url(#topBulb)" />
          {/* bottom bulb liquid — grows as time passes */}
          <rect x={0} y={130 - 58 * fillFrac} width={SG_W} height={58 * fillFrac} fill={LIQUID} opacity={0.6} clipPath="url(#botBulb)" />
          <line x1={28} y1={68} x2={32} y2={68} stroke={DIM} strokeWidth={0.8} />
          <line x1={28} y1={72} x2={32} y2={72} stroke={DIM} strokeWidth={0.8} />
          {fillFrac > 0 && fillFrac < 1 && (
            <line x1={30} y1={68} x2={30} y2={72} stroke={LIQUID} strokeWidth={1.5} />
          )}
        </svg>
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
              {verified ? '✓ INPUTS VERIFIED — reveal burn-rate' : 'Confirm stock + dose cadence before display'}
            </span>
          </label>

          {verified ? (
            <div style={{ ...panelStyle, borderColor: statusColor }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Depletion Forecast</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <div style={{ fontSize: 9, color: DIM }}>System depletion</div>
                  <div style={{ fontSize: 18, color: TEXT, fontWeight: 700 }}>{calc.emptyDate || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: DIM }}>Days remaining</div>
                  <div style={{ fontSize: 18, color: CYAN, fontWeight: 700 }}>{round2(Math.max(0, calc.daysRemaining - calc.elapsedDays)).toFixed(0)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: DIM }}>Order by</div>
                  <div style={{ fontSize: 18, color: GOLD, fontWeight: 700 }}>{calc.reorderDate || '—'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: DIM }}>Status</div>
                  <div style={{ fontSize: 18, color: statusColor, fontWeight: 700 }}>{calc.status}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: DIM, marginTop: 8 }}>
                {calc.dosesRemaining} doses · {calc.daysRemaining} days from start · {calc.elapsedDays} days elapsed
              </div>
            </div>
          ) : (
            <div style={{ ...panelStyle, opacity: 0.4 }}>
              <div style={{ fontSize: 10, color: DIM, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Burn-Rate</div>
              <div style={{ fontSize: 28, color: DIM, fontWeight: 700, lineHeight: 1.1 }}>— . —</div>
              <div style={{ fontSize: 11, color: DIM }}>Awaiting verification</div>
            </div>
          )}
        </>
      )}

      <div style={disclaimerStyle()}>
        Arithmetic only. Not medical advice. Inventory forecast assumes constant dose + interval. Research/compounding contexts only.
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { formatCurrency } from '~/lib/finance';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

function parseHM(s: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const h = parseInt(m[1], 10); const mi = parseInt(m[2], 10);
  if (h < 0 || h > 23 || mi < 0 || mi > 59) return null;
  return h * 60 + mi;
}

function fmtHM(totalMin: number): string {
  const sign = totalMin < 0 ? '-' : '';
  const abs = Math.abs(totalMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${h}:${m.toString().padStart(2, '0')}`;
}

export default function HoursCalculator() {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:30');
  const [breakMin, setBreakMin] = useState('30');

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [rate, setRate] = useState('');
  const [otThreshold, setOtThreshold] = useState('8');
  const [otMultiplier, setOtMultiplier] = useState('1.5');

  const r = useMemo(() => {
    const s = parseHM(start); const e = parseHM(end);
    const br = parseFloat(breakMin);
    if (s === null || e === null || !Number.isFinite(br) || br < 0) return null;
    let diff = e - s;
    const overnight = diff < 0;
    if (overnight) diff += 24 * 60;
    const worked = diff - br;
    if (worked <= 0) return null;
    return { gross: diff, breakMin: br, worked, overnight };
  }, [start, end, breakMin]);

  const pay = useMemo(() => {
    if (!r) return null;
    const rt = parseFloat(rate);
    if (!Number.isFinite(rt) || rt < 0) return null;
    const thr = parseFloat(otThreshold);
    const mult = parseFloat(otMultiplier);
    const hours = r.worked / 60;
    const threshold = Number.isFinite(thr) && thr > 0 ? thr : Infinity;
    const multiplier = Number.isFinite(mult) && mult >= 1 ? mult : 1.5;
    const regularHours = Math.min(hours, threshold);
    const overtimeHours = Math.max(0, hours - threshold);
    const regularPay = regularHours * rt;
    const overtimePay = overtimeHours * rt * multiplier;
    return {
      rate: rt,
      hours,
      threshold,
      multiplier,
      regularHours,
      overtimeHours,
      regularPay,
      overtimePay,
      totalPay: regularPay + overtimePay,
      otRate: rt * multiplier,
    };
  }, [r, rate, otThreshold, otMultiplier]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="s">Work started</label>
            <input id="s" type="time" className="input" value={start} onChange={(e) => setStart(e.target.value)} aria-describedby="s-help" />
            <p id="s-help" className="mt-1 text-xs text-slate-500">Use the clock time when paid work began.</p>
          </div>
          <div>
            <label className="label" htmlFor="e">Work ended</label>
            <input id="e" type="time" className="input" value={end} onChange={(e) => setEnd(e.target.value)} aria-describedby="e-help" />
            <p id="e-help" className="mt-1 text-xs text-slate-500">If this is earlier than the start time, the calculator treats it as an overnight shift.</p>
          </div>
          <div>
            <label className="label" htmlFor="b">Unpaid break (min)</label>
            <input id="b" type="number" inputMode="numeric" className="input" value={breakMin} onChange={(e) => setBreakMin(e.target.value)} aria-describedby="b-help" />
            <p id="b-help" className="mt-1 text-xs text-slate-500">Enter minutes not counted as work, such as 30 for lunch.</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 text-xs font-medium text-brand-700 hover:underline"
          onClick={() => setShowAdvanced((x) => !x)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? 'Hide pay estimate' : 'Optional: estimate pay from an hourly rate ->'}
        </button>
        {showAdvanced && (
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label" htmlFor="rate">Hourly rate ($)</label>
              <input id="rate" type="number" inputMode="decimal" className="input" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 25" aria-describedby="rate-help" />
              <p id="rate-help" className="mt-1 text-xs text-slate-500">Use your regular hourly pay before overtime.</p>
            </div>
            <div>
              <label className="label" htmlFor="ot">Overtime starts after (hours)</label>
              <input id="ot" type="number" inputMode="decimal" className="input" value={otThreshold} onChange={(e) => setOtThreshold(e.target.value)} aria-describedby="ot-help" />
              <p id="ot-help" className="mt-1 text-xs text-slate-500">Use 8 if overtime begins after 8 worked hours in one day.</p>
            </div>
            <div>
              <label className="label" htmlFor="otm">Overtime pay rate</label>
              <input id="otm" type="number" inputMode="decimal" className="input" value={otMultiplier} onChange={(e) => setOtMultiplier(e.target.value)} step="0.1" aria-describedby="otm-help" />
              <p id="otm-help" className="mt-1 text-xs text-slate-500">1.5 means time-and-a-half. 2 means double time.</p>
            </div>
          </div>
        )}
      </div>

      {!r && (
        <div className="card border-amber-200 bg-amber-50 text-sm text-amber-900">
          Enter valid start/end times and a break that leaves positive worked time.
        </div>
      )}

      {r && (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Worked</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{fmtHM(r.worked)}</div>
              <div className="text-xs text-slate-500">{(r.worked / 60).toFixed(2)} hours</div>
            </div>
            {pay && (
              <>
                <div className="card text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Regular pay</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(pay.regularPay)}</div>
                  <div className="text-xs text-slate-500">{pay.regularHours.toFixed(2)}h @ {formatCurrency(pay.rate)}</div>
                </div>
                <div className="card border-emerald-200 bg-emerald-50 text-center">
                  <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Total pay</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-900">{formatCurrency(pay.totalPay)}</div>
                  {pay.overtimeHours > 0 && (
                    <div className="text-xs text-emerald-700">Incl. {formatCurrency(pay.overtimePay)} overtime</div>
                  )}
                </div>
              </>
            )}
          </div>

          {(() => {
            const hours = r.worked / 60;
            const scenarios = [7, 8, 9].map((h) => {
              const wMin = h * 60;
              let scenarioPay = null;
              if (pay) {
                const reg = Math.min(h, pay.threshold);
                const ot = Math.max(0, h - pay.threshold);
                scenarioPay = reg * pay.rate + ot * pay.rate * pay.multiplier;
              }
              return { h, wMin, scenarioPay };
            });
            const scenarios2: Array<{ title: string; items: string[] }> = scenarios.map((sc) => ({
              title: `${sc.h}h worked`,
              items: [
                `Time: ${fmtHM(sc.wMin)}`,
                ...(sc.scenarioPay !== null ? [`Pay: ${formatCurrency(sc.scenarioPay)}`] : []),
              ],
            }));
            scenarios2.push({
              title: `Current (${hours.toFixed(2)}h)`,
              items: [
                `Time: ${fmtHM(r.worked)}`,
                ...(pay ? [`Pay: ${formatCurrency(pay.totalPay)}`] : []),
              ],
            });

            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `${fmtHM(r.worked)} worked — ${(r.worked / 60).toFixed(2)} hours${r.overnight ? ' (overnight shift)' : ''} after a ${r.breakMin}-minute break.${pay ? ` Pay: ${formatCurrency(pay.totalPay)}.` : ''}`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Gross', value: fmtHM(r.gross) },
                  { label: 'Break', value: `${r.breakMin}m` },
                  { label: 'Worked', value: fmtHM(r.worked) },
                  { label: 'Decimal hrs', value: (r.worked / 60).toFixed(2) },
                  ...(pay ? [
                    { label: 'Regular hrs', value: pay.regularHours.toFixed(2) },
                    { label: 'Overtime hrs', value: pay.overtimeHours.toFixed(2) },
                    { label: 'Regular pay', value: formatCurrency(pay.regularPay) },
                    { label: 'Overtime pay', value: formatCurrency(pay.overtimePay) },
                  ] : []),
                ],
              },
              pay ? {
                kind: 'takeaway' as const,
                text: pay.overtimeHours > 0
                  ? `Each extra hour past ${pay.threshold}h/day pays ${formatCurrency(pay.otRate)} (${pay.multiplier}× ${formatCurrency(pay.rate)}).`
                  : `Each extra hour adds ${formatCurrency(pay.rate)} until the ${pay.threshold}h/day overtime line — after that it's ${formatCurrency(pay.otRate)}.`,
              } : null,
              pay ? {
                kind: 'takeaway' as const,
                text: `Crossing the daily overtime threshold raises your effective hourly value from ${formatCurrency(pay.rate)} to ${formatCurrency(pay.otRate)}.`,
              } : null,
              pay ? {
                kind: 'comparison' as const,
                title: 'Pay at different shift lengths',
                columns: scenarios2,
              } : null,
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/date-difference-calculator/', label: 'Date Difference' },
                  { href: '/converters/time-converter/', label: 'Time Converter' },
                ],
              },
            ];
            return <OutcomeLayer cards={cards} />;
          })()}
        </>
      )}
    </div>
  );
}

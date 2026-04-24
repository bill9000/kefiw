import { useEffect, useMemo, useState } from 'react';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

// ISO-date formatter that plays well with <input type="date"> round-trips.
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function daysInYear(y: number): number {
  return isLeap(y) ? 366 : 365;
}

function startOfYear(y: number): Date {
  return new Date(y, 0, 1);
}
function endOfYear(y: number): Date {
  return new Date(y, 11, 31, 23, 59, 59);
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export default function DaysLeftInYear() {
  const todayIso = toISODate(new Date());
  const [dateStr, setDateStr] = useState(todayIso);
  const [nowIso, setNowIso] = useState(todayIso);

  // Refresh "today" daily in case the tab stays open across midnight.
  useEffect(() => {
    const t = setInterval(() => setNowIso(toISODate(new Date())), 60 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const r = useMemo(() => {
    const d = new Date(dateStr + 'T12:00:00');
    if (Number.isNaN(d.getTime())) return null;
    const y = d.getFullYear();
    const total = daysInYear(y);
    const elapsed = daysBetween(startOfYear(y), d) + 1; // count today as elapsed
    const remaining = total - elapsed;
    const pctElapsed = (elapsed / total) * 100;
    const today = new Date(nowIso + 'T12:00:00');
    const isToday = toISODate(d) === toISODate(today);
    const weeksLeft = remaining / 7;
    const monthsLeft = (12 - (d.getMonth() + (d.getDate() / new Date(y, d.getMonth() + 1, 0).getDate())));
    return { y, total, elapsed, remaining, pctElapsed, isToday, weeksLeft, monthsLeft, leap: isLeap(y) };
  }, [dateStr, nowIso]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="d">As of</label>
          <input
            id="d"
            type="date"
            className="input"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setDateStr(nowIso)}
            className="btn bg-slate-100 text-slate-900 hover:bg-slate-200"
            disabled={dateStr === nowIso}
          >
            Today
          </button>
        </div>
      </div>

      {r && (
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="card border-emerald-200 bg-emerald-50 p-4 text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              Days left in {r.y}
            </div>
            <div className="mt-1 text-4xl font-bold text-emerald-900">{r.remaining}</div>
            <div className="mt-1 text-xs text-emerald-700">
              of {r.total} total{r.leap ? ' (leap year)' : ''}
            </div>
          </div>
          <div className="card p-4 text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Elapsed</div>
            <div className="mt-1 text-4xl font-bold text-slate-900">{r.elapsed}</div>
            <div className="mt-1 text-xs text-slate-500">
              {r.pctElapsed.toFixed(1)}% of the year
            </div>
          </div>
        </div>
      )}

      {r && (
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <div className="mb-2 flex justify-between text-xs text-slate-600">
            <span>Jan 1</span>
            <span className="font-semibold text-slate-900">{r.pctElapsed.toFixed(1)}%</span>
            <span>Dec 31</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(100, r.pctElapsed)}%` }}
            />
          </div>
        </div>
      )}

      {r && (() => {
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: r.isToday
              ? `${r.remaining} day${r.remaining === 1 ? '' : 's'} left in ${r.y} — ${r.pctElapsed.toFixed(1)}% of the year has elapsed.`
              : `As of ${dateStr}, ${r.remaining} day${r.remaining === 1 ? '' : 's'} remain in ${r.y}.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Year', value: String(r.y) },
              { label: 'Total days', value: String(r.total) },
              { label: 'Elapsed', value: String(r.elapsed) },
              { label: 'Remaining', value: String(r.remaining) },
              { label: 'Weeks left', value: r.weeksLeft.toFixed(1) },
              { label: 'Leap year?', value: r.leap ? 'Yes' : 'No' },
            ],
          },
          {
            kind: 'takeaway',
            text: r.remaining === 0
              ? `It's the last day of ${r.y} — tomorrow is ${r.y + 1}.`
              : r.remaining === 1
                ? `One day left in ${r.y}.`
                : `${Math.round(r.remaining / 7)} full weeks and ${r.remaining % 7} extra day${r.remaining % 7 === 1 ? '' : 's'} before ${r.y + 1} begins.`,
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/calculators/date-difference-calculator/', label: 'Date Difference Calculator' },
              { href: '/calculators/age-calculator/', label: 'Age Calculator' },
              { href: '/calculators/hours-calculator/', label: 'Hours Calculator' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        A leap year adds February 29, so total days are 366 instead of 365. Leap years happen every 4 years — except century years unless they divide by 400 (2000 was a leap year; 1900 was not).
      </div>
    </div>
  );
}

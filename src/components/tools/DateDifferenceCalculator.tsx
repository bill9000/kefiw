import { useMemo, useState } from 'react';
import { diffDates, todayISO } from '~/lib/dates';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

export default function DateDifferenceCalculator() {
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState(todayISO());
  const r = useMemo(() => diffDates(from, to), [from, to]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="a">From</label>
          <input id="a" type="date" className="input" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="b">To</label>
          <input id="b" type="date" className="input" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>
      {r && (
        <div className="space-y-3">
          <div className="card">
            <div className="text-sm text-slate-500">Difference</div>
            <div className="text-3xl font-bold">{r.years}y {r.months}m {r.days}d</div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Days" value={r.totalDays.toLocaleString()} />
            <Stat label="Weeks" value={r.totalWeeks.toFixed(1)} />
            <Stat label="Hours" value={r.totalHours.toLocaleString()} />
            <Stat label="Minutes" value={r.totalMinutes.toLocaleString()} />
          </div>
          {(() => {
            const days = Math.abs(r.totalDays);
            const weeks = Math.floor(days / 7);
            const leftover = days - weeks * 7;
            const reversed = r.totalDays < 0;
            const cards: MaybeCard[] = [
              { kind: 'summary', text: `${r.years} year${r.years === 1 ? '' : 's'}, ${r.months} month${r.months === 1 ? '' : 's'}, ${r.days} day${r.days === 1 ? '' : 's'}.` },
              {
                kind: 'stats',
                items: [
                  { label: 'Total days', value: days.toLocaleString() },
                  { label: 'Total weeks', value: r.totalWeeks.toFixed(1) },
                  { label: 'Total hours', value: r.totalHours.toLocaleString() },
                  { label: 'Total minutes', value: r.totalMinutes.toLocaleString() },
                ],
              },
              { kind: 'takeaway', text: `${days.toLocaleString()} day${days === 1 ? '' : 's'} = ${weeks} week${weeks === 1 ? '' : 's'} and ${leftover} day${leftover === 1 ? '' : 's'}${reversed ? ' (From is after To — swap to reverse).' : '.'}` },
              { kind: 'nextStep', actions: [{ href: '/calculators/age-calculator/', label: 'Age Calculator' }, { href: '/calculators/hours-calculator/', label: 'Hours Calculator' }] },
            ];
            return <OutcomeLayer cards={cards} />;
          })()}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="card text-center"><div className="text-xl font-semibold">{value}</div><div className="text-xs text-slate-500">{label}</div></div>;
}

import { useMemo, useState } from 'react';
import { diffDates, todayISO } from '~/lib/dates';

export default function AgeCalculator() {
  const [birth, setBirth] = useState('1990-01-15');
  const [target, setTarget] = useState(todayISO());

  const r = useMemo(() => diffDates(birth, target), [birth, target]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="b">Birthdate</label>
          <input id="b" type="date" className="input" value={birth} onChange={(e) => setBirth(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="t">As of</label>
          <input id="t" type="date" className="input" value={target} onChange={(e) => setTarget(e.target.value)} />
        </div>
      </div>
      {r && (
        <div className="space-y-3">
          <div className="card">
            <div className="text-sm text-slate-500">Age</div>
            <div className="text-3xl font-bold">{r.years} years, {r.months} months, {r.days} days</div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Total days" value={r.totalDays.toLocaleString()} />
            <Stat label="Total weeks" value={r.totalWeeks.toFixed(1)} />
            <Stat label="Total hours" value={r.totalHours.toLocaleString()} />
            <Stat label="Total minutes" value={r.totalMinutes.toLocaleString()} />
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="card text-center"><div className="text-xl font-semibold">{value}</div><div className="text-xs text-slate-500">{label}</div></div>;
}

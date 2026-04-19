import { useEffect, useMemo, useState } from 'react';
import { diffDates, nowLocalMinute } from '~/lib/dates';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

export default function AgeCalculator() {
  const [birth, setBirth] = useState('1990-01-15');
  const [target, setTarget] = useState(nowLocalMinute());
  const [userEditedTarget, setUserEditedTarget] = useState(false);

  useEffect(() => {
    if (userEditedTarget) return;
    const tick = () => setTarget(nowLocalMinute());
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, [userEditedTarget]);

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
          <input id="t" type="datetime-local" className="input" value={target}
            onChange={(e) => { setTarget(e.target.value); setUserEditedTarget(true); }} />
        </div>
      </div>
      {r && (
        <div className="space-y-3">
          <div className="card">
            <div className="text-sm text-slate-500">Age</div>
            <div className="text-3xl font-bold">
              {r.years} years, {r.months} months, {r.days} days
            </div>
            <div className="mt-1 text-sm text-slate-600">
              {r.hours} hours, {r.minutes} minutes
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Total days" value={r.totalDays.toLocaleString()} />
            <Stat label="Total weeks" value={r.totalWeeks.toFixed(1)} />
            <Stat label="Total hours" value={r.totalHours.toLocaleString()} />
            <Stat label="Total minutes" value={r.totalMinutes.toLocaleString()} />
          </div>
          {(() => {
            const birthDate = new Date(`${birth}T00:00`);
            if (isNaN(birthDate.getTime())) return null;
            const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            const weekdayBorn = weekdays[birthDate.getDay()];
            const now = new Date(target);
            const nextBd = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
            if (nextBd.getTime() <= now.getTime()) nextBd.setFullYear(now.getFullYear() + 1);
            const daysUntil = Math.ceil((nextBd.getTime() - now.getTime()) / 86400000);
            const totalMonths = r.years * 12 + r.months;
            const milestones = [18, 21, 25, 30, 40, 50, 60, 65, 70, 80, 90, 100];
            const nextMilestone = milestones.find((m) => m > r.years);
            const cards: MaybeCard[] = [
              { kind: 'summary', text: `${r.years} years, ${r.months} months, ${r.days} days old.` },
              {
                kind: 'stats',
                items: [
                  { label: 'Total months', value: totalMonths.toLocaleString() },
                  { label: 'Total weeks', value: r.totalWeeks.toFixed(1) },
                  { label: 'Total days', value: r.totalDays.toLocaleString() },
                  { label: 'Next birthday', value: `${daysUntil} day${daysUntil === 1 ? '' : 's'}` },
                  { label: 'Weekday born', value: weekdayBorn },
                  ...(nextMilestone ? [{ label: `Turns ${nextMilestone} in`, value: `${nextMilestone - r.years} year${nextMilestone - r.years === 1 ? '' : 's'}` }] : []),
                ],
              },
              nextMilestone ? {
                kind: 'takeaway' as const,
                text: `Next milestone: ${nextMilestone} in ${nextMilestone - r.years} year${nextMilestone - r.years === 1 ? '' : 's'}.`,
              } : null,
              { kind: 'nextStep', actions: [{ href: '/calculators/date-difference-calculator/', label: 'Compare any two dates' }] },
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

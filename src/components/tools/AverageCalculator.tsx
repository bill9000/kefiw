import { useMemo, useState } from 'react';
import { parseNumbers, numStats, fmt } from '~/lib/stats';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

function modeOf(values: number[]): { modes: number[]; freq: number } {
  const freq = new Map<number, number>();
  for (const v of values) freq.set(v, (freq.get(v) ?? 0) + 1);
  let max = 0;
  for (const f of freq.values()) if (f > max) max = f;
  if (max <= 1) return { modes: [], freq: max };
  const modes: number[] = [];
  for (const [v, f] of freq) if (f === max) modes.push(v);
  modes.sort((a, b) => a - b);
  return { modes, freq: max };
}

function meanWithout(values: number[], drop: number): number {
  const idx = values.indexOf(drop);
  if (idx < 0 || values.length < 2) return NaN;
  const rest = [...values.slice(0, idx), ...values.slice(idx + 1)];
  return rest.reduce((a, b) => a + b, 0) / rest.length;
}

export default function AverageCalculator() {
  const [raw, setRaw] = useState('10, 20, 30, 40, 50');
  const values = useMemo(() => parseNumbers(raw), [raw]);
  const s = useMemo(() => numStats(values), [values]);
  const m = useMemo(() => modeOf(values), [values]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="vals">Numbers</label>
        <textarea
          id="vals"
          className="input h-32 font-mono"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="Separate with commas, spaces, or new lines…"
        />
      </div>
      {s && (
        <>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Average (mean)</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{fmt(s.mean)}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Count</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{s.count}</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Sum</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{fmt(s.sum)}</div>
            </div>
          </div>

          {(() => {
            const skew = s.mean > s.median ? 'higher' : s.mean < s.median ? 'lower' : 'matches';
            const modeText = m.modes.length === 0
              ? 'No mode (all values unique)'
              : m.modes.length > 3
                ? `${m.modes.length} tied modes (each appears ${m.freq}×)`
                : `${m.modes.map((v) => fmt(v)).join(', ')} (appears ${m.freq}×)`;
            const withoutMax = meanWithout(values, s.max);
            const withoutMin = meanWithout(values, s.min);

            const cards: MaybeCard[] = [
              { kind: 'summary', text: `Mean of ${s.count} value${s.count === 1 ? '' : 's'} is ${fmt(s.mean)}.` },
              {
                kind: 'stats',
                items: [
                  { label: 'Mean', value: fmt(s.mean) },
                  { label: 'Median', value: fmt(s.median) },
                  { label: 'Mode', value: modeText },
                  { label: 'Min', value: fmt(s.min) },
                  { label: 'Max', value: fmt(s.max) },
                  { label: 'Range', value: fmt(s.range) },
                  { label: 'Std dev', value: fmt(s.stdDev) },
                  { label: 'Variance', value: fmt(s.variance) },
                ],
              },
              s.count > 1 ? {
                kind: 'takeaway' as const,
                text: skew === 'matches'
                  ? 'Mean matches the median — symmetric distribution.'
                  : `Mean is ${skew} than the median — distribution skews ${skew}.`,
              } : null,
              s.count > 1 ? {
                kind: 'takeaway' as const,
                text: `Each +1 on one value changes the mean by ${fmt(1 / s.count)} (1/${s.count}). Spread min→max is ${fmt(s.range)}.`,
              } : null,
              s.count > 2 && Number.isFinite(withoutMax) && Number.isFinite(withoutMin) ? {
                kind: 'comparison' as const,
                title: 'Remove an outlier',
                columns: [
                  { title: 'Current', items: [`Mean: ${fmt(s.mean)}`, `Count: ${s.count}`] },
                  { title: `Drop max (${fmt(s.max)})`, items: [`Mean: ${fmt(withoutMax)}`, `Count: ${s.count - 1}`] },
                  { title: `Drop min (${fmt(s.min)})`, items: [`Mean: ${fmt(withoutMin)}`, `Count: ${s.count - 1}`] },
                ],
              } : null,
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
                  { href: '/calculators/ratio-calculator/', label: 'Ratio Calculator' },
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

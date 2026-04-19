import { useMemo, useState } from 'react';
import { gcd } from '~/lib/outcomes';
import { fmt } from '~/lib/stats';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'simplify' | 'solve';

export default function RatioCalculator() {
  const [mode, setMode] = useState<Mode>('simplify');
  const [a, setA] = useState('16');
  const [b, setB] = useState('9');
  const [c, setC] = useState('32');
  const [d, setD] = useState('');

  const r = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (!Number.isFinite(x) || !Number.isFinite(y) || x === 0 || y === 0) return null;
    const xi = Math.round(x); const yi = Math.round(y);
    const isInt = xi === x && yi === y;
    const simple = isInt
      ? { a: xi / gcd(xi, yi), b: yi / gcd(xi, yi) }
      : { a: x, b: y };
    return { a: x, b: y, simpleA: simple.a, simpleB: simple.b, decimal: x / y, integer: isInt };
  }, [a, b]);

  const solved = useMemo(() => {
    if (mode !== 'solve' || !r) return null;
    const cv = parseFloat(c);
    const dv = parseFloat(d);
    const aKnown = Number.isFinite(cv);
    const bKnown = Number.isFinite(dv);
    if (aKnown && !bKnown) return { a: cv, b: cv * (r.b / r.a), solvedFor: 'b' as const };
    if (!aKnown && bKnown) return { a: dv * (r.a / r.b), b: dv, solvedFor: 'a' as const };
    if (aKnown && bKnown) return { a: cv, b: dv, solvedFor: null };
    return null;
  }, [mode, r, c, d]);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="mb-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setMode('simplify')} className={mode === 'simplify' ? 'btn btn-primary' : 'btn-ghost'}>Simplify</button>
          <button type="button" onClick={() => setMode('solve')} className={mode === 'solve' ? 'btn btn-primary' : 'btn-ghost'}>Solve missing value</button>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div>
            <label className="label" htmlFor="a">A</label>
            <input id="a" type="number" inputMode="decimal" className="input" value={a} onChange={(e) => setA(e.target.value)} />
          </div>
          <div className="text-center text-2xl font-bold text-slate-400">:</div>
          <div>
            <label className="label" htmlFor="b">B</label>
            <input id="b" type="number" inputMode="decimal" className="input" value={b} onChange={(e) => setB(e.target.value)} />
          </div>
        </div>

        {mode === 'solve' && (
          <>
            <div className="mt-3 text-center text-sm text-slate-500">equals</div>
            <div className="mt-2 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
              <div>
                <label className="label" htmlFor="c">C</label>
                <input id="c" type="number" inputMode="decimal" className="input" value={c} onChange={(e) => setC(e.target.value)} placeholder="leave empty to solve" />
              </div>
              <div className="text-center text-2xl font-bold text-slate-400">:</div>
              <div>
                <label className="label" htmlFor="d">D</label>
                <input id="d" type="number" inputMode="decimal" className="input" value={d} onChange={(e) => setD(e.target.value)} placeholder="leave empty to solve" />
              </div>
            </div>
            <p className="mt-2 text-xs text-slate-500">Leave one of C/D empty — we'll solve it using A:B.</p>
          </>
        )}
      </div>

      {r && (
        <>
          <div className="card text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Simplified</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">{fmt(r.simpleA)} : {fmt(r.simpleB)}</div>
          </div>

          {mode === 'solve' && solved && (
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">
                {solved.solvedFor === 'b' ? 'Solved B' : solved.solvedFor === 'a' ? 'Solved A' : 'Equivalent?'}
              </div>
              <div className="mt-1 text-2xl font-bold text-emerald-900">{fmt(solved.a)} : {fmt(solved.b)}</div>
            </div>
          )}

          {(() => {
            const simplified = r.integer && (r.simpleA !== r.a || r.simpleB !== r.b);
            const scaleFactor = mode === 'solve' && solved ? solved.a / r.a : null;
            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: simplified
                  ? `${r.a} : ${r.b} simplifies to ${r.simpleA} : ${r.simpleB}.`
                  : `${fmt(r.a)} : ${fmt(r.b)} is already in simplest form.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Simplified', value: `${fmt(r.simpleA)}:${fmt(r.simpleB)}` },
                  { label: 'A ÷ B', value: fmt(r.decimal) },
                  { label: 'B ÷ A', value: fmt(r.b / r.a) },
                  { label: 'As %', value: `${fmt(r.decimal * 100)}%` },
                ],
              },
              scaleFactor !== null ? {
                kind: 'takeaway' as const,
                text: `Scale factor: both sides multiplied by ${fmt(scaleFactor)} to get ${fmt(solved!.a)} : ${fmt(solved!.b)}.`,
              } : null,
              {
                kind: 'takeaway',
                text: `As a decimal: ${fmt(r.decimal)}. As a percentage: ${fmt(r.decimal * 100)}%.`,
              },
              {
                kind: 'comparison',
                title: 'Equivalent ratios',
                columns: [2, 5, 10].map((k) => ({
                  title: `×${k}`,
                  items: [`${fmt(r.simpleA * k)} : ${fmt(r.simpleB * k)}`],
                })),
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/fraction-calculator/', label: 'Fraction Calculator' },
                  { href: '/calculators/percentage-calculator/', label: 'Percentage Calculator' },
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

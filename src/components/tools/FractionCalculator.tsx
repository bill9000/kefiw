import { useMemo, useState } from 'react';
import { gcd } from '~/lib/outcomes';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Op = 'add' | 'sub' | 'mul' | 'div';

interface Frac { n: number; d: number }

function simplify(f: Frac): Frac {
  if (f.d === 0) return f;
  const sign = (f.n < 0) !== (f.d < 0) ? -1 : 1;
  const n = Math.abs(f.n); const d = Math.abs(f.d);
  const g = gcd(n, d);
  return { n: sign * (n / g), d: d / g };
}

function applyRaw(a: Frac, b: Frac, op: Op): Frac {
  switch (op) {
    case 'add': return { n: a.n * b.d + b.n * a.d, d: a.d * b.d };
    case 'sub': return { n: a.n * b.d - b.n * a.d, d: a.d * b.d };
    case 'mul': return { n: a.n * b.n, d: a.d * b.d };
    case 'div': return { n: a.n * b.d, d: a.d * b.n };
  }
}

function asMixed(f: Frac): string {
  if (f.d === 0) return '—';
  if (Math.abs(f.n) < Math.abs(f.d)) return `${f.n}/${f.d}`;
  const whole = Math.trunc(f.n / f.d);
  const rem = f.n - whole * f.d;
  if (rem === 0) return String(whole);
  return `${whole} ${Math.abs(rem)}/${f.d}`;
}

function fmtDec(n: number): string {
  return parseFloat(n.toFixed(6)).toString();
}

export default function FractionCalculator() {
  const [an, setAn] = useState('1'); const [ad, setAd] = useState('2');
  const [bn, setBn] = useState('1'); const [bd, setBd] = useState('3');
  const [op, setOp] = useState<Op>('add');

  const r = useMemo(() => {
    const a: Frac = { n: parseInt(an, 10), d: parseInt(ad, 10) };
    const b: Frac = { n: parseInt(bn, 10), d: parseInt(bd, 10) };
    if (![a.n, a.d, b.n, b.d].every(Number.isFinite)) return { error: 'Enter whole numbers for both fractions.' as const };
    if (a.d === 0 || b.d === 0) return { error: 'Denominators cannot be zero.' as const };
    if (op === 'div' && b.n === 0) return { error: 'Cannot divide by a fraction equal to zero.' as const };
    const raw = applyRaw(a, b, op);
    const result = simplify(raw);
    return { a, b, raw, result, decimal: result.n / result.d };
  }, [an, ad, bn, bd, op]);

  const OPS: { id: Op; label: string }[] = [
    { id: 'add', label: '+' }, { id: 'sub', label: '−' }, { id: 'mul', label: '×' }, { id: 'div', label: '÷' },
  ];

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
          <FracInput nId="an" dId="ad" n={an} d={ad} setN={setAn} setD={setAd} />
          <div className="flex justify-center gap-1">
            {OPS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOp(o.id)}
                className={`btn ${op === o.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <FracInput nId="bn" dId="bd" n={bn} d={bd} setN={setBn} setD={setBd} />
        </div>
      </div>

      {'error' in r ? (
        <div className="card border-amber-200 bg-amber-50 text-sm text-amber-900">{r.error}</div>
      ) : (
        <>
          <div className="card text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Result (simplified)</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">{r.result.n}/{r.result.d}</div>
            <div className="mt-1 text-sm text-slate-600">Mixed: {asMixed(r.result)} · Decimal: {fmtDec(r.decimal)}</div>
          </div>

          {(() => {
            const opLabel = OPS.find((o) => o.id === op)?.label ?? '';
            const aDec = r.a.n / r.a.d;
            const bDec = r.b.n / r.b.d;
            const sameDenom = r.a.d === r.b.d;
            const isImproper = Math.abs(r.result.n) >= Math.abs(r.result.d) && r.result.d !== 1;
            const needsSimplify = r.raw.n !== r.result.n || r.raw.d !== r.result.d;

            const cards: MaybeCard[] = [
              { kind: 'summary', text: `${r.a.n}/${r.a.d} ${opLabel} ${r.b.n}/${r.b.d} = ${r.result.n}/${r.result.d}.` },
              {
                kind: 'stats',
                items: [
                  { label: 'Fraction', value: `${r.result.n}/${r.result.d}` },
                  { label: 'Mixed', value: asMixed(r.result) },
                  { label: 'Decimal', value: fmtDec(r.decimal) },
                  { label: 'Percentage', value: `${(r.decimal * 100).toFixed(2)}%` },
                ],
              },
              sameDenom && (op === 'add' || op === 'sub') ? {
                kind: 'takeaway' as const,
                text: `Denominators match (${r.a.d}) — numerators combine directly: ${r.a.n} ${opLabel} ${r.b.n} = ${op === 'add' ? r.a.n + r.b.n : r.a.n - r.b.n}.`,
              } : null,
              isImproper ? {
                kind: 'takeaway' as const,
                text: `Improper fraction — as a mixed number it's ${asMixed(r.result)}.`,
              } : null,
              {
                kind: 'comparison',
                title: 'Form comparisons',
                rows: [
                  { label: 'Unsimplified', value: `${r.raw.n}/${r.raw.d}` },
                  { label: 'Simplified', value: `${r.result.n}/${r.result.d}` },
                  { label: 'Decimal', value: fmtDec(r.decimal) },
                  { label: `${r.a.n}/${r.a.d} as decimal`, value: fmtDec(aDec) },
                  { label: `${r.b.n}/${r.b.d} as decimal`, value: fmtDec(bDec) },
                ].filter((row) => needsSimplify || !row.label.startsWith('Unsimplified')),
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/calculators/ratio-calculator/', label: 'Ratio Calculator' },
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

function FracInput({ nId, dId, n, d, setN, setD }: { nId: string; dId: string; n: string; d: string; setN: (v: string) => void; setD: (v: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <input id={nId} type="number" inputMode="numeric" className="input text-center" value={n} onChange={(e) => setN(e.target.value)} />
      <div className="h-px w-full bg-slate-300" />
      <input id={dId} type="number" inputMode="numeric" className="input text-center" value={d} onChange={(e) => setD(e.target.value)} />
    </div>
  );
}

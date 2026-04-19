import { useMemo, useState } from 'react';
import OutcomeLayer, { type OutcomeCard } from './outcome/OutcomeLayer';

type Mode = 'of' | 'isWhat' | 'change';

interface PercentageCalculatorProps {
  lockedMode?: Mode;
}

export default function PercentageCalculator({ lockedMode }: PercentageCalculatorProps = {}) {
  const [mode, setMode] = useState<Mode>(lockedMode ?? 'of');
  const defaultsFor = (m: Mode): [string, string] => {
    if (m === 'of') return ['15', '80'];
    if (m === 'isWhat') return ['20', '50'];
    return ['100', '125'];
  };
  const [aInit, bInit] = defaultsFor(lockedMode ?? 'of');
  const [a, setA] = useState(aInit);
  const [b, setB] = useState(bInit);

  const result = useMemo(() => {
    const x = parseFloat(a); const y = parseFloat(b);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return '–';
    switch (mode) {
      case 'of': return `${fmt((x / 100) * y)}`;
      case 'isWhat': return y === 0 ? '–' : `${fmt((x / y) * 100)}%`;
      case 'change': return x === 0 ? '–' : `${fmt(((y - x) / x) * 100)}%`;
    }
  }, [mode, a, b]);

  return (
    <div className="space-y-4">
      {!lockedMode && (
        <div className="flex flex-wrap gap-2">
          <Tab active={mode==='of'} onClick={() => setMode('of')}>What is X% of Y?</Tab>
          <Tab active={mode==='isWhat'} onClick={() => setMode('isWhat')}>X is what % of Y?</Tab>
          <Tab active={mode==='change'} onClick={() => setMode('change')}>% change X → Y</Tab>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="a">{mode === 'of' ? 'Percent' : mode === 'isWhat' ? 'Part' : 'From'}</label>
          <input id="a" type="number" inputMode="decimal" className="input" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="b">{mode === 'of' ? 'Of' : mode === 'isWhat' ? 'Whole' : 'To'}</label>
          <input id="b" type="number" inputMode="decimal" className="input" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
      </div>
      <div className="card">
        <div className="text-sm text-slate-500">Result</div>
        <div className="text-3xl font-bold">{result}</div>
      </div>
      {(() => {
        const x = parseFloat(a); const y = parseFloat(b);
        if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
        let cards: OutcomeCard[] = [];
        if (mode === 'of') {
          const val = (x / 100) * y;
          cards = [
            { kind: 'summary', text: `${x}% of ${y} is ${fmt(val)}.` },
            {
              kind: 'stats',
              items: [
                { label: '10% of ' + fmt(y), value: fmt(y / 10) },
                { label: '1% of ' + fmt(y), value: fmt(y / 100) },
                { label: '50% of ' + fmt(y), value: fmt(y / 2) },
                { label: '25% of ' + fmt(y), value: fmt(y / 4) },
              ],
            },
            { kind: 'takeaway', text: `Quick math: 10% = ${fmt(y / 10)}, 1% = ${fmt(y / 100)}.` },
            {
              kind: 'comparison',
              title: 'Reverse interpretation',
              rows: [
                { label: `${fmt(val)} is what % of ${y}?`, value: `${fmt(x)}%` },
                { label: `What % change ${y} → ${fmt(val)}?`, value: y === 0 ? '–' : `${fmt(((val - y) / y) * 100)}%` },
              ],
            },
          ];
        } else if (mode === 'isWhat') {
          if (y === 0) return null;
          const pct = (x / y) * 100;
          cards = [
            { kind: 'summary', text: `${x} is ${fmt(pct)}% of ${y}.` },
            {
              kind: 'stats',
              items: [
                { label: 'Percent', value: `${fmt(pct)}%` },
                { label: 'Remainder', value: fmt(y - x) },
                { label: 'Remainder %', value: `${fmt(100 - pct)}%` },
              ],
            },
            { kind: 'takeaway', text: `Remainder: ${fmt(y - x)} (${fmt(100 - pct)}%).` },
          ];
        } else {
          if (x === 0) return null;
          const delta = y - x;
          const pct = (delta / x) * 100;
          cards = [
            { kind: 'summary', text: `${fmt(Math.abs(pct))}% ${delta >= 0 ? 'increase' : 'decrease'} from ${x} to ${y}.` },
            {
              kind: 'stats',
              items: [
                { label: 'Change', value: `${delta >= 0 ? '+' : ''}${fmt(delta)}` },
                { label: 'Percent', value: `${fmt(pct)}%` },
                { label: 'Ratio', value: fmt(y / x) },
              ],
            },
            { kind: 'takeaway', text: `Difference: ${delta >= 0 ? '+' : ''}${fmt(delta)}.` },
          ];
        }
        cards.push({
          kind: 'nextStep',
          actions: [
            { href: '/calculators/discount-calculator/', label: 'Discount Calculator' },
            { href: '/calculators/tip-calculator/', label: 'Tip Calculator' },
          ],
        });
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

function Tab(props: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" onClick={props.onClick}
    className={`btn ${props.active ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>{props.children}</button>;
}

function fmt(n: number): string {
  if (!Number.isFinite(n)) return '–';
  return parseFloat(n.toFixed(6)).toString();
}

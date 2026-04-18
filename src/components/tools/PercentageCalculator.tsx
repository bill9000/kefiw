import { useMemo, useState } from 'react';

type Mode = 'of' | 'isWhat' | 'change';

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('of');
  const [a, setA] = useState('15');
  const [b, setB] = useState('80');

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
      <div className="flex flex-wrap gap-2">
        <Tab active={mode==='of'} onClick={() => setMode('of')}>What is X% of Y?</Tab>
        <Tab active={mode==='isWhat'} onClick={() => setMode('isWhat')}>X is what % of Y?</Tab>
        <Tab active={mode==='change'} onClick={() => setMode('change')}>% change X → Y</Tab>
      </div>
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

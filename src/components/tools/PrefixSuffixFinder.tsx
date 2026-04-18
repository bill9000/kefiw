import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import ResultList from './ResultList';

type Mode = 'startsWith' | 'endsWith' | 'contains';
interface Props {
  mode: Mode;
  label: string;
  placeholder: string;
}

export default function PrefixSuffixFinder({ mode, label, placeholder }: Props) {
  const { send } = useWordWorker();
  const [q, setQ] = useState('');
  const [minLen, setMinLen] = useState(3);
  const [maxLen, setMaxLen] = useState(15);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = q.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!v) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const key = mode === 'startsWith' ? 'prefix' : mode === 'endsWith' ? 'suffix' : 'sub';
      const { results } = await send<{ results: string[] }>(mode, { [key]: v, minLen, maxLen });
      setResults(results);
      setLoading(false);
    }, 130);
    return () => clearTimeout(t);
  }, [q, minLen, maxLen, mode, send]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <label className="label" htmlFor="q">{label}</label>
          <input id="q" className="input font-mono" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} autoFocus />
        </div>
        <div>
          <label className="label" htmlFor="min">Min</label>
          <select id="min" className="input" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))}>
            {[2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="max">Max</label>
          <select id="max" className="input" value={maxLen} onChange={(e) => setMaxLen(Number(e.target.value))}>
            {[5,6,7,8,9,10,12,15].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <ResultList words={results.slice(0, 500)} loading={loading} />
      {results.length > 500 && <div className="text-xs text-slate-500">Showing first 500 of {results.length.toLocaleString()}.</div>}
    </div>
  );
}

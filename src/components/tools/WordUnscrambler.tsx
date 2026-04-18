import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import ResultList from './ResultList';

export default function WordUnscrambler() {
  const { send } = useWordWorker();
  const [letters, setLetters] = useState('');
  const [minLen, setMinLen] = useState(2);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = letters.trim();
    if (!v) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const { results } = await send<{ results: string[] }>('unscramble', { letters: v, minLen });
      setResults(results);
      setLoading(false);
    }, 120);
    return () => clearTimeout(t);
  }, [letters, minLen, send]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <label className="label" htmlFor="letters">Letters (use ? for blanks)</label>
          <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. TIENGL" autoFocus />
        </div>
        <div>
          <label className="label" htmlFor="min">Min length</label>
          <select id="min" className="input" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))}>
            {[2,3,4,5,6,7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button type="button" onClick={() => setLetters('')} className="btn-ghost w-full sm:w-auto" disabled={!letters}>Reset</button>
        </div>
      </div>
      <ResultList words={results} loading={loading} group="length" emptyLabel="Type some letters to begin." />
    </div>
  );
}

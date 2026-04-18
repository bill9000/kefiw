import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import ResultList from './ResultList';

export default function WordFinder() {
  const { send } = useWordWorker();
  const [letters, setLetters] = useState('');
  const [minLen, setMinLen] = useState(2);
  const [maxLen, setMaxLen] = useState(15);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = letters.replace(/\s/g, '');
    if (!v) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const { results } = await send<{ results: string[] }>('unscramble', { letters: v, minLen, maxLen });
      setResults(results);
      setLoading(false);
    }, 120);
    return () => clearTimeout(t);
  }, [letters, minLen, maxLen, send]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <label className="label" htmlFor="letters">Letters (use ? for blanks)</label>
          <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. RSTLNE?" autoFocus />
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
      <ResultList words={results} loading={loading} group="length" emptyLabel="Type some letters to see words you can make." />
    </div>
  );
}

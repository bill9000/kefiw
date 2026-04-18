import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import ResultList from './ResultList';

export default function AnagramSolver() {
  const { send } = useWordWorker();
  const [letters, setLetters] = useState('');
  const [exact, setExact] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = letters.replace(/\s/g, '');
    if (!v) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const { results } = await send<{ results: string[] }>('anagrams', { letters: v, exact });
      setResults(results);
      setLoading(false);
    }, 100);
    return () => clearTimeout(t);
  }, [letters, exact, send]);

  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor="letters">Word or letters</label>
        <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. listen" autoFocus />
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`btn ${exact ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900'}`} onClick={() => setExact(true)}>All letters</button>
        <button type="button" className={`btn ${!exact ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900'}`} onClick={() => setExact(false)}>Any letters</button>
        <button type="button" className="btn-ghost ml-auto" onClick={() => setLetters('')} disabled={!letters}>Reset</button>
      </div>
      <ResultList words={results} loading={loading} group="length" emptyLabel="Enter a word to see its anagrams." />
    </div>
  );
}

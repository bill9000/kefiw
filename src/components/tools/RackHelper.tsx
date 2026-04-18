import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import CopyButton from '../CopyButton';

interface Props { valueSet: 'scrabble' | 'wwf'; }

export default function RackHelper({ valueSet }: Props) {
  const { send } = useWordWorker();
  const [rack, setRack] = useState('');
  const [strict, setStrict] = useState(false);
  const [results, setResults] = useState<Array<{ word: string; score: number }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const v = rack.trim().toLowerCase().replace(/[^a-z?]/g, '').slice(0, 9);
    if (!v) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const { results } = await send<{ results: Array<{ word: string; score: number }> }>('rack', { rack: v, valueSet, limit: 300, strict });
      setResults(results);
      setLoading(false);
    }, 140);
    return () => clearTimeout(t);
  }, [rack, valueSet, strict, send]);

  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor="rack">Your tiles (use ? for blanks)</label>
        <div className="flex gap-2">
          <input id="rack" className="input font-mono uppercase tracking-widest"
            value={rack} onChange={(e) => setRack(e.target.value.toUpperCase())}
            placeholder="e.g. RSTLNE?" maxLength={9} autoFocus />
          <button type="button" onClick={() => setRack('')} className="btn-ghost shrink-0" disabled={!rack}>Reset</button>
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          checked={strict} onChange={(e) => setStrict(e.target.checked)} />
        <span>Strict mode <span className="text-slate-500">— only show common tournament-safe words (ENABLE list)</span></span>
      </label>
      {loading && <div className="text-sm text-slate-500">Solving…</div>}
      {!loading && results.length === 0 && <div className="text-sm text-slate-500">Enter your tiles to see playable words.</div>}
      {results.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-slate-600">{results.length} plays found</div>
            <CopyButton value={results.map((r) => `${r.word} (${r.score})`).join('\n')} label="Copy all" />
          </div>
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full min-w-[20rem] text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr><th className="p-2">Word</th><th className="p-2">Length</th><th className="p-2 text-right">Score</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => (
                  <tr key={r.word} className="hover:bg-slate-50">
                    <td className="p-2 font-mono">{r.word}</td>
                    <td className="p-2 text-slate-600">{r.word.length}</td>
                    <td className="p-2 text-right font-semibold">{r.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

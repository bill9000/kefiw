import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import ResultList from './ResultList';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';
import { wordStats, alphaFirstLast, countByLengthTopN } from '~/lib/outcomes';

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
      <div>
        <label className="label" htmlFor="q">{label}</label>
        <input id="q" className="input font-mono" value={q} onChange={(e) => setQ(e.target.value)} placeholder={placeholder} autoFocus />
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
        <label className="flex items-center gap-1.5">
          Min
          <select className="input !w-auto" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))}>
            {[2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-1.5">
          Max
          <select className="input !w-auto" value={maxLen} onChange={(e) => setMaxLen(Number(e.target.value))}>
            {[5,6,7,8,9,10,12,15].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      </div>
      <ResultList words={results.slice(0, 500)} loading={loading} />
      {results.length > 500 && <div className="text-xs text-slate-500">Showing first 500 of {results.length.toLocaleString()}.</div>}
      {!loading && results.length > 0 && (() => {
        const stats = wordStats(results);
        const verb = mode === 'startsWith' ? 'start with' : mode === 'endsWith' ? 'end with' : 'contain';
        const query = q.trim().toUpperCase();
        const { first, last } = alphaFirstLast(results, 5);
        const topLengths = countByLengthTopN(stats.byLength, 4);
        const nextActions =
          mode === 'startsWith'
            ? [
                { href: '/word-tools/words-ending-with/', label: 'Words ending with' },
                { href: '/word-tools/words-containing/', label: 'Words containing' },
              ]
            : mode === 'endsWith'
              ? [
                  { href: '/word-tools/words-starting-with/', label: 'Words starting with' },
                  { href: '/word-tools/words-containing/', label: 'Words containing' },
                ]
              : [
                  { href: '/word-tools/words-starting-with/', label: 'Words starting with' },
                  { href: '/word-tools/words-ending-with/', label: 'Words ending with' },
                ];
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `${results.length.toLocaleString()} word${results.length === 1 ? '' : 's'} ${verb} "${query}".` },
          {
            kind: 'stats',
            items: [
              { label: 'Results', value: results.length.toLocaleString() },
              { label: 'Shortest', value: stats.shortest ? `${stats.shortest} (${stats.shortest.length})` : '–' },
              { label: 'Longest', value: stats.longest ? `${stats.longest} (${stats.longest.length})` : '–' },
              { label: 'Top length', value: stats.mostCommonLength ? `${stats.mostCommonLength} letters` : '–' },
            ],
          },
          first.length > 0 && last.length > 0 && results.length > 5
            ? {
                kind: 'comparison' as const,
                title: 'Alphabetical range',
                columns: [
                  { title: 'First 5 (A→Z)', items: first },
                  { title: 'Last 5 (Z→A)', items: last },
                ],
              }
            : null,
          topLengths.length > 1
            ? {
                kind: 'comparison' as const,
                title: 'Count by length',
                rows: topLengths.map((r) => ({ label: `${r.len} letters`, value: r.count.toLocaleString() })),
              }
            : null,
          stats.mostCommonLength
            ? { kind: 'takeaway' as const, text: `Most common length: ${stats.mostCommonLength} letters. Longest: ${stats.longest} (${stats.longest?.length}).` }
            : null,
          { kind: 'nextStep', actions: [...nextActions, { href: '/word-tools/word-unscrambler/', label: 'Word Unscrambler' }] },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

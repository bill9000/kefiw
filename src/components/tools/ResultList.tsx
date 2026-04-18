import CopyButton from '../CopyButton';
import { SCRABBLE_VALUES, WWF_VALUES, wordScore } from '~/lib/dict';

interface Props {
  words: string[];
  loading?: boolean;
  emptyLabel?: string;
  loadingLabel?: string;
  group?: 'length';
  tool?: string;
  scores?: boolean;
}

export default function ResultList({ words, loading, emptyLabel = 'No matches yet.', loadingLabel = 'Searching…', group, tool, scores }: Props) {
  if (loading) return <div className="p-4 text-sm text-slate-500">{loadingLabel}</div>;
  if (!words.length) return <div className="p-4 text-sm text-slate-500">{emptyLabel}</div>;

  if (scores) {
    const rows = words.map((w) => ({
      word: w,
      length: w.length,
      scrabble: wordScore(w, SCRABBLE_VALUES),
      wwf: wordScore(w, WWF_VALUES),
    }));
    const copyValue = rows.map((r) => `${r.word} (S${r.scrabble}/W${r.wwf})`).join('\n');
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">{rows.length.toLocaleString()} results</div>
          <CopyButton value={copyValue} label="Copy all" tool={tool} />
        </div>
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full min-w-[22rem] text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-2">Word</th>
                <th className="p-2">Len</th>
                <th className="p-2 text-right">Scrabble</th>
                <th className="p-2 text-right">WWF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.word} className="hover:bg-slate-50">
                  <td className="p-2 font-mono">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard?.writeText(r.word)}
                      className="hover:text-brand-700"
                    >
                      {r.word}
                    </button>
                  </td>
                  <td className="p-2 text-slate-600">{r.length}</td>
                  <td className="p-2 text-right font-semibold">{r.scrabble}</td>
                  <td className="p-2 text-right font-semibold">{r.wwf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const byLen: Record<number, string[]> = {};
  if (group === 'length') {
    for (const w of words) {
      (byLen[w.length] ??= []).push(w);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">{words.length.toLocaleString()} results</div>
        <CopyButton value={words.join('\n')} label="Copy all" tool={tool} />
      </div>
      {group === 'length' ? (
        Object.keys(byLen)
          .map(Number).sort((a, b) => b - a)
          .map((len) => (
            <div key={len}>
              <div className="mb-1 text-sm font-medium text-slate-500">{len}-letter words</div>
              <div className="flex flex-wrap gap-1">
                {byLen[len].map((w) => <Chip key={w} word={w} />)}
              </div>
            </div>
          ))
      ) : (
        <div className="flex flex-wrap gap-1">
          {words.map((w) => <Chip key={w} word={w} />)}
        </div>
      )}
    </div>
  );
}

function Chip({ word }: { word: string }) {
  return (
    <button type="button" onClick={() => navigator.clipboard?.writeText(word)}
      className="chip hover:bg-brand-100">
      {word}
    </button>
  );
}

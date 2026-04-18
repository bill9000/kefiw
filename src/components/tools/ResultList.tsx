import CopyButton from '../CopyButton';

interface Props {
  words: string[];
  loading?: boolean;
  emptyLabel?: string;
  loadingLabel?: string;
  group?: 'length';
}

export default function ResultList({ words, loading, emptyLabel = 'No matches yet.', loadingLabel = 'Searching…', group }: Props) {
  if (loading) return <div className="p-4 text-sm text-slate-500">{loadingLabel}</div>;
  if (!words.length) return <div className="p-4 text-sm text-slate-500">{emptyLabel}</div>;

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
        <CopyButton value={words.join('\n')} label="Copy all" />
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

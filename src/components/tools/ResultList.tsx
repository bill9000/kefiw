import CopyButton from '../CopyButton';
import { SCRABBLE_VALUES, WWF_VALUES, wordScore, wordScoreWithBlanks } from '~/lib/dict';

interface Props {
  words: string[];
  loading?: boolean;
  emptyLabel?: string;
  loadingLabel?: string;
  group?: 'length';
  tool?: string;
  scores?: boolean;
  // When provided, per-word Scrabble / WWF scores use real-game blank scoring
  // (blanks = 0) and the UI marks blank positions in each result.
  rack?: string;
}

function renderWordWithBlanks(word: string, blankPositions: number[]) {
  if (!blankPositions.length) return word;
  const set = new Set(blankPositions);
  return (
    <span>
      {Array.from(word).map((ch, i) =>
        set.has(i) ? (
          <span
            key={i}
            className="text-slate-500 lowercase underline decoration-dotted decoration-slate-400"
            title="Blank tile — scores 0"
          >
            {ch.toLowerCase()}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  );
}

function formatWordForCopy(word: string, blankPositions: number[]): string {
  if (!blankPositions.length) return word;
  const set = new Set(blankPositions);
  return Array.from(word).map((ch, i) => (set.has(i) ? ch.toLowerCase() : ch)).join('');
}

export default function ResultList({ words, loading, emptyLabel = 'No matches yet.', loadingLabel = 'Searching…', group, tool, scores, rack }: Props) {
  if (loading) return <div className="p-4 text-sm text-slate-500">{loadingLabel}</div>;
  if (!words.length) return <div className="p-4 text-sm text-slate-500">{emptyLabel}</div>;

  const rackHasBlanks = !!rack && rack.includes('?');

  if (scores) {
    const rows = words.map((w) => {
      if (rackHasBlanks) {
        const s = wordScoreWithBlanks(w, rack, SCRABBLE_VALUES);
        const f = wordScoreWithBlanks(w, rack, WWF_VALUES);
        return { word: w, length: w.length, scrabble: s.score, wwf: f.score, blankPositions: s.blankPositions };
      }
      return { word: w, length: w.length, scrabble: wordScore(w, SCRABBLE_VALUES), wwf: wordScore(w, WWF_VALUES), blankPositions: [] as number[] };
    });
    const copyValue = rows
      .map((r) => `${formatWordForCopy(r.word, r.blankPositions)} (S${r.scrabble}/W${r.wwf})`)
      .join('\n');
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">{rows.length.toLocaleString()} results</div>
          <CopyButton value={copyValue} label="Copy all" tool={tool} />
        </div>
        <div className="overflow-x-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
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
                      onClick={() => navigator.clipboard?.writeText(formatWordForCopy(r.word, r.blankPositions))}
                      className="hover:text-brand-700"
                    >
                      {renderWordWithBlanks(r.word, r.blankPositions)}
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

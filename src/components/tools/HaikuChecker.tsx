import { useMemo, useState } from 'react';
import { countSyllables } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

const TARGET = [5, 7, 5] as const;

export default function HaikuChecker() {
  const [text, setText] = useState('An old silent pond\nA frog jumps into the pond\nSplash! Silence again');

  const r = useMemo(() => {
    const rawLines = text.split('\n');
    const lines = rawLines.map((l) => {
      const words = l.split(/\s+/).filter(Boolean);
      const count = words.reduce((s, w) => s + countSyllables(w), 0);
      return { text: l, words, count };
    });
    const nonEmpty = lines.filter((l) => l.words.length > 0);
    const total = nonEmpty.reduce((s, l) => s + l.count, 0);
    const isHaiku = nonEmpty.length === 3
      && nonEmpty[0].count === 5 && nonEmpty[1].count === 7 && nonEmpty[2].count === 5;
    return { lines, nonEmpty, total, isHaiku };
  }, [text]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="in">Haiku (3 lines)</label>
        <textarea id="in" className="input h-32 font-serif" value={text} onChange={(e) => setText(e.target.value)} placeholder="Line 1 (5 syllables)&#10;Line 2 (7 syllables)&#10;Line 3 (5 syllables)" />
      </div>
      <div className="space-y-2">
        {r.nonEmpty.map((l, i) => {
          const target = TARGET[i];
          const ok = target !== undefined && l.count === target;
          const over = target !== undefined && l.count > target;
          return (
            <div key={i} className={`rounded border px-3 py-2 text-sm ${
              target === undefined ? 'border-amber-200 bg-amber-50' :
              ok ? 'border-green-200 bg-green-50' :
              'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-serif">{l.text || <em className="text-slate-400">empty</em>}</span>
                <span className="font-mono text-xs">
                  {l.count}{target !== undefined && ` / ${target}`}
                  {target !== undefined && (ok ? ' ✓' : over ? ' (over)' : ' (under)')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {r.nonEmpty.length > 0 && (() => {
        const current = [r.nonEmpty[0]?.count ?? 0, r.nonEmpty[1]?.count ?? 0, r.nonEmpty[2]?.count ?? 0];
        const perLineRows = r.nonEmpty.slice(0, 3).map((l, i) => {
          const target = TARGET[i];
          const delta = target !== undefined ? l.count - target : 0;
          return {
            label: `Line ${i + 1}`,
            value: target !== undefined
              ? `${l.count}/${target}${delta === 0 ? ' ✓' : delta > 0 ? ` (+${delta})` : ` (${delta})`}`
              : String(l.count),
          };
        });
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: r.isHaiku
              ? `Valid haiku — 5-7-5 across 3 lines (${r.total} syllables).`
              : `Not yet a 5-7-5 haiku. ${r.nonEmpty.length} line${r.nonEmpty.length === 1 ? '' : 's'}, ${r.total} syllables total.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Lines', value: String(r.nonEmpty.length) },
              { label: 'Syllables', value: String(r.total) },
              { label: 'Pattern', value: `${current[0]}-${current[1]}-${current[2]}` },
              { label: 'Target', value: '5-7-5' },
            ],
          },
          perLineRows.length > 0
            ? { kind: 'comparison' as const, title: 'Per line', rows: perLineRows }
            : null,
          {
            kind: 'takeaway',
            text: r.isHaiku
              ? 'Traditional Japanese haiku also suggest a seasonal word (kigo) and a juxtaposition (kireji).'
              : r.nonEmpty.length !== 3
                ? `Aim for exactly 3 non-empty lines (currently ${r.nonEmpty.length}).`
                : `Target 5-7-5. Current: ${current[0]}-${current[1]}-${current[2]}.`,
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/syllable-counter/', label: 'Syllable Counter' },
              { href: '/word-tools/rhyme-finder/', label: 'Rhyme Finder' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

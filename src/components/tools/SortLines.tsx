import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { sortLines } from '~/lib/text';
import type { SortMode } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type ExtendedSortMode = SortMode | 'natural-asc' | 'natural-desc';

const MODES: { id: ExtendedSortMode; label: string }[] = [
  { id: 'alpha-asc', label: 'A → Z' },
  { id: 'alpha-desc', label: 'Z → A' },
  { id: 'natural-asc', label: 'Natural ↑' },
  { id: 'natural-desc', label: 'Natural ↓' },
  { id: 'length-asc', label: 'Length ↑' },
  { id: 'length-desc', label: 'Length ↓' },
  { id: 'numeric-asc', label: 'Numeric ↑' },
  { id: 'numeric-desc', label: 'Numeric ↓' },
];

// Natural sort uses Intl.Collator with `numeric: true` so 'item2' comes before
// 'item10'. Standard across modern browsers.
function naturalSort(lines: string[], caseSensitive: boolean, desc: boolean): string[] {
  const coll = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: caseSensitive ? 'case' : 'base',
  });
  const sorted = [...lines].sort((a, b) => coll.compare(a, b));
  return desc ? sorted.reverse() : sorted;
}

export default function SortLines() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<ExtendedSortMode>('alpha-asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const out = useMemo(() => {
    const preLines = text.split('\n');
    const filtered = removeEmpty ? preLines.filter((l) => l.trim() !== '') : preLines;
    if (mode === 'natural-asc' || mode === 'natural-desc') {
      return naturalSort(filtered, caseSensitive, mode === 'natural-desc').join('\n');
    }
    return sortLines(filtered.join('\n'), mode as SortMode, caseSensitive);
  }, [text, mode, caseSensitive, removeEmpty]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`btn ${mode===m.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={removeEmpty} onChange={(e) => setRemoveEmpty(e.target.checked)} />
          Remove empty lines
        </label>
      </div>
      <div>
        <label className="label" htmlFor="in">Input</label>
        <textarea id="in" className="input h-48 font-mono" value={text} onChange={(e) => setText(e.target.value)} placeholder="One line per item…" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="out">Output</label>
          <CopyButton value={out} />
        </div>
        <textarea id="out" readOnly className="input h-48 bg-slate-50 font-mono" value={out} />
      </div>
      {text.length > 0 && (() => {
        const sortedLines = out.split('\n').filter((l) => l.trim());
        const lines = sortedLines.length;
        const label = MODES.find((m) => m.id === mode)?.label ?? mode;
        const seen = new Set<string>();
        for (const l of sortedLines) seen.add(caseSensitive ? l : l.toLowerCase());
        const duplicates = lines - seen.size;
        const first = sortedLines.slice(0, 3);
        const last = sortedLines.slice(Math.max(0, lines - 3));
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Sorted ${lines.toLocaleString()} line${lines === 1 ? '' : 's'} (${label}).` },
          {
            kind: 'stats',
            items: [
              { label: 'Lines', value: lines.toLocaleString() },
              { label: 'Unique', value: seen.size.toLocaleString() },
              { label: 'Duplicates', value: duplicates.toLocaleString() },
              { label: 'Case', value: caseSensitive ? 'Sensitive' : 'Insensitive' },
            ],
          },
          lines > 3
            ? {
                kind: 'comparison' as const,
                title: 'After sort',
                columns: [
                  { title: 'First 3', items: first },
                  { title: 'Last 3', items: last.reverse() },
                ],
              }
            : null,
          duplicates > 0
            ? { kind: 'takeaway' as const, text: `${duplicates} duplicate${duplicates === 1 ? '' : 's'} remain — use Remove Duplicate Lines to dedupe.` }
            : { kind: 'takeaway' as const, text: caseSensitive ? 'Case-sensitive comparison.' : 'Case-insensitive comparison — toggle above to change.' },
          {
            kind: 'nextStep',
            actions: [
              { href: '/text-tools/remove-duplicate-lines/', label: 'Remove Duplicate Lines' },
              { href: '/text-tools/reverse-text/', label: 'Reverse Text' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

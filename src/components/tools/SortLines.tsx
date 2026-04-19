import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { sortLines } from '~/lib/text';
import type { SortMode } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

const MODES: { id: SortMode; label: string }[] = [
  { id: 'alpha-asc', label: 'A → Z' },
  { id: 'alpha-desc', label: 'Z → A' },
  { id: 'length-asc', label: 'Length ↑' },
  { id: 'length-desc', label: 'Length ↓' },
  { id: 'numeric-asc', label: 'Numeric ↑' },
  { id: 'numeric-desc', label: 'Numeric ↓' },
];

export default function SortLines() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<SortMode>('alpha-asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const out = useMemo(() => sortLines(text, mode, caseSensitive), [text, mode, caseSensitive]);

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
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
        Case-sensitive
      </label>
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

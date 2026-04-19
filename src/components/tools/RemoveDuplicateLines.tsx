import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { removeDuplicateLines } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

export default function RemoveDuplicateLines() {
  const [text, setText] = useState('');
  const [preserveOrder, setPreserveOrder] = useState(true);
  const out = useMemo(() => removeDuplicateLines(text, preserveOrder), [text, preserveOrder]);
  const inCount = text ? text.split('\n').length : 0;
  const outCount = out ? out.split('\n').length : 0;
  const removed = Math.max(0, inCount - outCount);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={preserveOrder} onChange={(e) => setPreserveOrder(e.target.checked)} />
          Preserve original order
        </label>
        <span className="text-xs text-slate-500">{inCount} in → {outCount} out</span>
      </div>
      <div>
        <label className="label" htmlFor="in">Input</label>
        <textarea id="in" className="input h-48 font-mono" value={text} onChange={(e) => setText(e.target.value)} placeholder="One entry per line…" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="out">Output</label>
          <CopyButton value={out} />
        </div>
        <textarea id="out" readOnly className="input h-48 bg-slate-50 font-mono" value={out} />
      </div>
      {inCount > 0 && (() => {
        const uniquePct = Math.round((outCount / inCount) * 100);
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: removed === 0
              ? `No duplicates found in ${inCount.toLocaleString()} line${inCount === 1 ? '' : 's'}.`
              : `Removed ${removed.toLocaleString()} duplicate${removed === 1 ? '' : 's'} from ${inCount.toLocaleString()} line${inCount === 1 ? '' : 's'}.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Input', value: inCount.toLocaleString() },
              { label: 'Output', value: outCount.toLocaleString() },
              { label: 'Removed', value: removed.toLocaleString() },
              { label: 'Unique rate', value: `${uniquePct}%` },
            ],
          },
          { kind: 'takeaway', text: preserveOrder ? 'Kept the first occurrence and dropped later duplicates.' : 'Sorted uniques — toggle above to preserve original order.' },
          {
            kind: 'nextStep',
            actions: [
              { href: '/text-tools/sort-lines/', label: 'Sort Lines' },
              { href: '/word-tools/word-counter/', label: 'Word Counter' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

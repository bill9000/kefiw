import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { removeDuplicateLines } from '~/lib/text';

export default function RemoveDuplicateLines() {
  const [text, setText] = useState('');
  const [preserveOrder, setPreserveOrder] = useState(true);
  const out = useMemo(() => removeDuplicateLines(text, preserveOrder), [text, preserveOrder]);
  const inCount = text ? text.split('\n').length : 0;
  const outCount = out ? out.split('\n').length : 0;

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
    </div>
  );
}

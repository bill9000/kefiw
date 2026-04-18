import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { reverseChars, reverseWords, reverseLines } from '~/lib/text';

type Mode = 'chars' | 'words' | 'lines';

export default function ReverseText() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('chars');
  const out = useMemo(() => {
    switch (mode) {
      case 'chars': return reverseChars(text);
      case 'words': return reverseWords(text);
      case 'lines': return reverseLines(text);
    }
  }, [text, mode]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(['chars','words','lines'] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`btn ${mode===m ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
            {m === 'chars' ? 'Characters' : m === 'words' ? 'Words' : 'Lines'}
          </button>
        ))}
      </div>
      <div>
        <label className="label" htmlFor="in">Input</label>
        <textarea id="in" className="input h-36" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text…" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="out">Output</label>
          <CopyButton value={out} />
        </div>
        <textarea id="out" readOnly className="input h-36 bg-slate-50" value={out} />
      </div>
    </div>
  );
}

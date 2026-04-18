import { useMemo, useState } from 'react';
import { letterFrequency } from '~/lib/text';

export default function LetterCounter() {
  const [text, setText] = useState('');
  const data = useMemo(() => {
    const freq = letterFrequency(text);
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return {
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, '').length,
      letters: entries.filter(([k]) => /[a-z]/.test(k)).reduce((s, [, n]) => s + n, 0),
      digits: entries.filter(([k]) => /[0-9]/.test(k)).reduce((s, [, n]) => s + n, 0),
      entries,
    };
  }, [text]);
  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor="in">Text</label>
        <textarea id="in" className="input h-36" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text…" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="card text-center"><div className="text-xl font-semibold">{data.chars}</div><div className="text-xs text-slate-500">Characters</div></div>
        <div className="card text-center"><div className="text-xl font-semibold">{data.charsNoSpace}</div><div className="text-xs text-slate-500">No spaces</div></div>
        <div className="card text-center"><div className="text-xl font-semibold">{data.letters}</div><div className="text-xs text-slate-500">Letters</div></div>
        <div className="card text-center"><div className="text-xl font-semibold">{data.digits}</div><div className="text-xs text-slate-500">Digits</div></div>
      </div>
      {data.entries.length > 0 && (
        <div>
          <div className="label">Frequency</div>
          <div className="flex flex-wrap gap-2">
            {data.entries.map(([k, n]) => (
              <span key={k} className="chip"><code>{k}</code> × {n}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

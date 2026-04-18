import { useMemo, useState } from 'react';
import { countSyllables } from '~/lib/text';

export default function SyllableCounter() {
  const [text, setText] = useState('');
  const result = useMemo(() => {
    const words = text.split(/\s+/).filter(Boolean);
    const perWord = words.map((w) => ({ word: w, count: countSyllables(w) }));
    const total = perWord.reduce((s, x) => s + x.count, 0);
    return { words: perWord, total };
  }, [text]);

  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor="in">Text</label>
        <textarea id="in" className="input h-36" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a word, sentence, or paragraph…" />
      </div>
      <div className="card">
        <div className="text-sm text-slate-500">Total syllables</div>
        <div className="text-3xl font-bold">{result.total}</div>
      </div>
      {result.words.length > 0 && (
        <div>
          <div className="label">Per word</div>
          <div className="flex flex-wrap gap-2">
            {result.words.map((w, i) => (
              <span key={i} className="chip"><strong>{w.word}</strong> — {w.count}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

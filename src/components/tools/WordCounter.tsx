import { useMemo, useState } from 'react';
import { countWords, countSentences, countParagraphs, readingTimeMinutes } from '~/lib/text';

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const words = countWords(text);
    return {
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, '').length,
      words,
      sentences: countSentences(text),
      paragraphs: countParagraphs(text),
      reading: readingTimeMinutes(words),
    };
  }, [text]);

  const readingLabel = stats.reading < 1 ? `${Math.max(1, Math.round(stats.reading * 60))} sec` : `${stats.reading.toFixed(1)} min`;

  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor="in">Text</label>
        <textarea id="in" className="input h-48" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type any text…" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.chars} />
        <Stat label="No spaces" value={stats.charsNoSpace} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading time" value={readingLabel} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

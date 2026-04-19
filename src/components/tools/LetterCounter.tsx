import { useMemo, useState } from 'react';
import { letterFrequency } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

const VOWELS = new Set(['a','e','i','o','u']);

export default function LetterCounter() {
  const [text, setText] = useState('');
  const data = useMemo(() => {
    const freq = letterFrequency(text);
    const entries = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    const letters = entries.filter(([k]) => /[a-z]/.test(k));
    const digits = entries.filter(([k]) => /[0-9]/.test(k));
    const vowels = letters.filter(([k]) => VOWELS.has(k)).reduce((s, [, n]) => s + n, 0);
    const letterTotal = letters.reduce((s, [, n]) => s + n, 0);
    const punct = text.replace(/[a-zA-Z0-9\s]/g, '').length;
    return {
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, '').length,
      letters: letterTotal,
      digits: digits.reduce((s, [, n]) => s + n, 0),
      vowels,
      consonants: letterTotal - vowels,
      punct,
      topLetter: letters[0]?.[0] ?? null,
      topCount: letters[0]?.[1] ?? 0,
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
      {data.letters > 0 && (() => {
        const vowelPct = Math.round((data.vowels / data.letters) * 100);
        const topThree = data.entries.filter(([k]) => /[a-z]/.test(k)).slice(0, 3)
          .map(([k, n]) => ({ label: k.toUpperCase(), value: String(n) }));
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `${data.letters} letter${data.letters === 1 ? '' : 's'}${data.digits ? `, ${data.digits} digit${data.digits === 1 ? '' : 's'}` : ''}${data.punct ? `, ${data.punct} punctuation` : ''}.` },
          {
            kind: 'stats',
            items: [
              { label: 'Vowels', value: String(data.vowels) },
              { label: 'Consonants', value: String(data.consonants) },
              { label: 'Digits', value: String(data.digits) },
              { label: 'Punct.', value: String(data.punct) },
            ],
          },
          topThree.length > 1
            ? { kind: 'comparison' as const, title: 'Top letters', rows: topThree }
            : null,
          { kind: 'takeaway', text: `Vowels: ${data.vowels} (${vowelPct}%). Most common letter: ${data.topLetter?.toUpperCase()} × ${data.topCount}.` },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/word-counter/', label: 'Word Counter' },
              { href: '/text-tools/case-converter/', label: 'Case Converter' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

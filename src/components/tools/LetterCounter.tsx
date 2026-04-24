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
    // ASCII vs Unicode breakdown — code points ≥128 are non-ASCII.
    let ascii = 0, nonAscii = 0;
    for (const ch of text) {
      if ((ch.codePointAt(0) ?? 0) >= 128) nonAscii++;
      else ascii++;
    }
    // Grapheme count (Intl.Segmenter when available — emoji ZWJ-joined = 1).
    let graphemes = Array.from(text).length;
    try {
      const I = Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (s: string) => Iterable<unknown> } };
      if (I.Segmenter) {
        const seg = new I.Segmenter(undefined, { granularity: 'grapheme' });
        graphemes = 0;
        for (const _ of seg.segment(text)) graphemes++;
      }
    } catch { /* ignore */ }
    return {
      chars: text.length,
      charsNoSpace: text.replace(/\s/g, '').length,
      letters: letterTotal,
      digits: digits.reduce((s, [, n]) => s + n, 0),
      vowels,
      consonants: letterTotal - vowels,
      punct,
      ascii,
      nonAscii,
      graphemes,
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
      {data.chars > 0 && (
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="card">
            <div className="text-lg font-semibold text-slate-900">{data.graphemes}</div>
            <div className="text-xs text-slate-500">Graphemes (user-visible)</div>
          </div>
          <div className="card">
            <div className="text-lg font-semibold text-slate-900">{data.ascii}</div>
            <div className="text-xs text-slate-500">ASCII</div>
          </div>
          <div className={`card ${data.nonAscii > 0 ? '' : 'opacity-60'}`}>
            <div className="text-lg font-semibold text-slate-900">{data.nonAscii}</div>
            <div className="text-xs text-slate-500">Unicode (non-ASCII)</div>
          </div>
        </div>
      )}
      {/* Top-10 letter bar chart — hand-rolled SVG so we don't pull a chart lib. */}
      {data.entries.filter(([k]) => /[a-z]/.test(k)).length > 0 && (() => {
        const letters = data.entries.filter(([k]) => /[a-z]/.test(k)).slice(0, 10);
        const max = letters[0]?.[1] ?? 1;
        const W = 320;
        const H = 140;
        const barW = (W - 20) / letters.length - 2;
        return (
          <div>
            <div className="label">Top letters</div>
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Top 10 letters by frequency" className="block w-full max-w-md">
              {letters.map(([k, n], i) => {
                const h = (n / max) * (H - 30);
                const x = 10 + i * (barW + 2);
                const y = H - 20 - h;
                return (
                  <g key={k}>
                    <rect x={x} y={y} width={barW} height={h} className="fill-brand-500" rx="2" />
                    <text x={x + barW / 2} y={y - 2} textAnchor="middle" className="fill-slate-600" fontSize="8">{n}</text>
                    <text x={x + barW / 2} y={H - 6} textAnchor="middle" className="fill-slate-700" fontSize="10" fontWeight="600">{k.toUpperCase()}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        );
      })()}
      {data.entries.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <div className="label">Frequency</div>
            <button
              type="button"
              onClick={() => {
                const lines = data.entries.map(([k, n]) => {
                  const pct = data.chars > 0 ? ((n / data.chars) * 100).toFixed(1) : '0.0';
                  return `${k}\t${n}\t${pct}%`;
                });
                void navigator.clipboard?.writeText(`char\tcount\tpercent\n${lines.join('\n')}`);
              }}
              className="text-xs text-brand-700 hover:underline"
              aria-label="Copy frequency table"
            >
              Copy table
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.entries.map(([k, n]) => {
              const pct = data.chars > 0 ? ((n / data.chars) * 100).toFixed(1) : '0.0';
              return (
                <span key={k} className="chip" title={`${pct}% of ${data.chars} chars`}>
                  <code>{k}</code> × {n}
                  <span className="ml-1 text-xs text-slate-500">{pct}%</span>
                </span>
              );
            })}
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

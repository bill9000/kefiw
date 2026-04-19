import { useMemo, useState } from 'react';
import { countSyllables } from '~/lib/text';
import { useToolSetting } from './useToolSettings';
import ModeSwitch from './ModeSwitch';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'quick' | 'extended';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'quick', label: 'Quick' },
  { value: 'extended', label: 'Extended' },
];

export default function SyllableCounter() {
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.syllables', 'quick');
  const [text, setText] = useState('');
  const result = useMemo(() => {
    const words = text.split(/\s+/).filter(Boolean);
    const perWord = words.map((w) => ({ word: w, count: countSyllables(w) }));
    const total = perWord.reduce((s, x) => s + x.count, 0);
    return { words: perWord, total };
  }, [text]);

  return (
    <div className="space-y-4">
      <ModeSwitch
        id="syllables-mode"
        tool="syllables"
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Quick mode gives instant estimates. Extended uses more data when available."
      />
      <div>
        <label className="label" htmlFor="in">Text</label>
        <textarea id="in" className="input h-36" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a word, sentence, or paragraph…" />
      </div>
      <div className="card">
        <div className="text-sm text-slate-500">Total syllables</div>
        <div className="text-3xl font-bold">{result.total}</div>
      </div>
      {result.words.length > 0 && (() => {
        const avg = result.total / result.words.length;
        const longest = result.words.reduce((a, b) => b.count > a.count ? b : a);
        const shortest = result.words.reduce((a, b) => b.count < a.count ? b : a);
        const lines = text.split('\n');
        const nonEmpty = lines.filter((l) => l.trim());
        const isHaiku = result.total === 17 && nonEmpty.length === 3;
        const perLine = nonEmpty.length > 1
          ? nonEmpty.map((l, i) => ({
              label: `Line ${i + 1}`,
              value: String(l.split(/\s+/).filter(Boolean).reduce((s, w) => s + countSyllables(w), 0)),
            }))
          : null;
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `${result.total} syllable${result.total === 1 ? '' : 's'} across ${result.words.length} word${result.words.length === 1 ? '' : 's'}.` },
          {
            kind: 'stats',
            items: [
              { label: 'Words', value: String(result.words.length) },
              { label: 'Syllables', value: String(result.total) },
              { label: 'Avg/word', value: avg.toFixed(1) },
              { label: 'Longest', value: `${longest.word} (${longest.count})` },
              { label: 'Shortest', value: `${shortest.word} (${shortest.count})` },
            ],
          },
          perLine && { kind: 'comparison' as const, title: 'Syllables by line', rows: perLine },
          isHaiku
            ? { kind: 'takeaway' as const, text: 'Three lines at 17 syllables — try the Haiku Checker to verify 5-7-5.' }
            : nonEmpty.length > 1
              ? { kind: 'takeaway' as const, text: `${nonEmpty.length} lines averaging ${(result.total / nonEmpty.length).toFixed(1)} syllables each.` }
              : null,
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/rhyme-finder/', label: 'Rhyme Finder' },
              { href: '/word-tools/haiku-checker/', label: 'Haiku Checker' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
      {mode === 'extended' && result.words.length > 0 && (
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

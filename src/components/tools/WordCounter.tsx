import { useMemo, useState } from 'react';
import { textStats, formatReadTime } from '~/lib/outcomes';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

export default function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => textStats(text), [text]);

  const readingLabel = stats.readMinutes < 1
    ? `${Math.max(1, Math.round(stats.readMinutes * 60))} sec`
    : `${stats.readMinutes.toFixed(1)} min`;
  const speakingLabel = stats.speakMinutes < 1
    ? `${Math.max(1, Math.round(stats.speakMinutes * 60))} sec`
    : `${stats.speakMinutes.toFixed(1)} min`;

  return (
    <div className="space-y-3">
      <div>
        <label className="label" htmlFor="in">Text</label>
        <textarea id="in" className="input h-48" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste or type any text…" />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Words" value={stats.words} />
        <Stat label="Characters" value={stats.characters} />
        <Stat label="No spaces" value={stats.charactersNoSpaces} />
        <Stat label="Sentences" value={stats.sentences} />
        <Stat label="Paragraphs" value={stats.paragraphs} />
        <Stat label="Reading time" value={readingLabel} />
      </div>
      {stats.words > 0 && (() => {
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `${stats.words.toLocaleString()} word${stats.words === 1 ? '' : 's'}, ${formatReadTime(stats.readMinutes)} to read.` },
          {
            kind: 'stats',
            items: [
              { label: 'Characters', value: stats.characters.toLocaleString() },
              { label: 'No spaces', value: stats.charactersNoSpaces.toLocaleString() },
              { label: 'Sentences', value: String(stats.sentences) },
              { label: 'Paragraphs', value: String(stats.paragraphs) },
              { label: 'Avg word length', value: stats.avgWordLength.toFixed(1) },
              { label: 'Avg words/sentence', value: stats.avgWordsPerSentence.toFixed(1) },
              ...(stats.longestWord ? [{ label: 'Longest word', value: `${stats.longestWord} (${stats.longestWord.length})` }] : []),
            ],
          },
          { kind: 'takeaway', text: `Reading: ${readingLabel} · Speaking aloud: ${speakingLabel}.` },
          stats.sentences > 0 && stats.avgWordsPerSentence > 20
            ? { kind: 'takeaway' as const, text: `Average sentence length is ${stats.avgWordsPerSentence.toFixed(1)} words — consider shorter sentences for readability.` }
            : null,
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/syllable-counter/', label: 'Count syllables' },
              { href: '/calculators/reading-time-calculator/', label: 'Reading Time Calculator' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
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

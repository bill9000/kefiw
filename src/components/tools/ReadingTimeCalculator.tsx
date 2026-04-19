import { useMemo, useState } from 'react';
import { countWords } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

function fmtMin(min: number): string {
  if (min < 1) {
    const s = Math.max(1, Math.round(min * 60));
    return `${s} sec`;
  }
  const m = Math.floor(min);
  const s = Math.round((min - m) * 60);
  if (m >= 60) {
    const h = Math.floor(m / 60); const rm = m % 60;
    return `${h}h ${rm}m`;
  }
  return s ? `${m}m ${s}s` : `${m} min`;
}

function countChars(s: string): number {
  return s.length;
}

function countParagraphs(s: string): number {
  const parts = s.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return parts.length;
}

export default function ReadingTimeCalculator() {
  const [text, setText] = useState('');
  const [readWpm, setReadWpm] = useState(200);
  const [speakWpm, setSpeakWpm] = useState(130);

  const stats = useMemo(() => {
    const words = countWords(text);
    return {
      words,
      chars: countChars(text),
      paragraphs: countParagraphs(text),
      readMin: words / readWpm,
      speakMin: words / speakWpm,
    };
  }, [text, readWpm, speakWpm]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="in">Text</label>
        <textarea
          id="in"
          className="input h-48"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your article, email, or script…"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="rwpm">Reading pace (WPM): <span className="font-mono">{readWpm}</span></label>
          <input id="rwpm" type="range" min={100} max={500} step={10} value={readWpm} onChange={(e) => setReadWpm(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-slate-500"><span>125 (slow)</span><span>200 (avg)</span><span>300 (fast)</span></div>
        </div>
        <div>
          <label className="label" htmlFor="swpm">Speaking pace (WPM): <span className="font-mono">{speakWpm}</span></label>
          <input id="swpm" type="range" min={90} max={200} step={5} value={speakWpm} onChange={(e) => setSpeakWpm(Number(e.target.value))} className="w-full" />
          <div className="flex justify-between text-xs text-slate-500"><span>90 (slow)</span><span>130 (avg)</span><span>180 (fast)</span></div>
        </div>
      </div>

      {stats.words > 0 && (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="card border-emerald-200 bg-emerald-50 text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-emerald-700">Estimated reading</div>
              <div className="mt-1 text-3xl font-bold text-emerald-900">{fmtMin(stats.readMin)}</div>
              <div className="text-xs text-emerald-700">at {readWpm} WPM</div>
            </div>
            <div className="card text-center">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Estimated speaking</div>
              <div className="mt-1 text-3xl font-bold text-slate-900">{fmtMin(stats.speakMin)}</div>
              <div className="text-xs text-slate-500">at {speakWpm} WPM</div>
            </div>
          </div>

          {(() => {
            const cards: MaybeCard[] = [
              {
                kind: 'summary',
                text: `${stats.words.toLocaleString()} word${stats.words === 1 ? '' : 's'} — estimated ${fmtMin(stats.readMin)} to read, ${fmtMin(stats.speakMin)} to speak aloud.`,
              },
              {
                kind: 'stats',
                items: [
                  { label: 'Words', value: stats.words.toLocaleString() },
                  { label: 'Characters', value: stats.chars.toLocaleString() },
                  { label: 'Paragraphs', value: String(stats.paragraphs) },
                  { label: 'Read', value: fmtMin(stats.readMin) },
                  { label: 'Speak', value: fmtMin(stats.speakMin) },
                ],
              },
              {
                kind: 'takeaway',
                text: `Every 200 words is about 1 minute of reading at the default pace. Speaking out loud typically takes 1.5× as long as silent reading.`,
              },
              {
                kind: 'comparison',
                title: 'At different reading paces',
                columns: [
                  { title: 'Slow (125 WPM)', items: [`Read: ${fmtMin(stats.words / 125)}`] },
                  { title: 'Average (200 WPM)', items: [`Read: ${fmtMin(stats.words / 200)}`] },
                  { title: 'Fast (300 WPM)', items: [`Read: ${fmtMin(stats.words / 300)}`] },
                ],
              },
              {
                kind: 'nextStep',
                actions: [
                  { href: '/word-tools/word-counter/', label: 'Word Counter' },
                  { href: '/word-tools/syllable-counter/', label: 'Syllable Counter' },
                ],
              },
            ];
            return <OutcomeLayer cards={cards} />;
          })()}
        </>
      )}
    </div>
  );
}

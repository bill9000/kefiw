import { useEffect, useMemo, useState } from 'react';
import { countWords } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

interface PacePreset {
  id: string;
  label: string;
  readWpm: number;
  speakWpm: number;
  hint: string;
}

// Context-specific pace presets. The values come from published pace ranges
// for each format — blog posts skim fast; narration slows for cadence;
// classrooms slow further so every word lands.
const PACE_PRESETS: PacePreset[] = [
  { id: 'blog',       label: 'Blog post',   readWpm: 238, speakWpm: 140, hint: 'Silent skim; average adult web reader.' },
  { id: 'speech',     label: 'Speech',      readWpm: 200, speakWpm: 130, hint: 'Presentation pace; comfortable for a live audience.' },
  { id: 'narration',  label: 'Narration',   readWpm: 200, speakWpm: 155, hint: 'Audiobook / podcast pace; clear delivery.' },
  { id: 'classroom',  label: 'Classroom',   readWpm: 180, speakWpm: 110, hint: 'Slower for comprehension and note-taking.' },
];

const STORAGE_KEY = 'kefiw.reading-time.v1';

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
  const [pauseSec, setPauseSec] = useState(0);
  const [targetMin, setTargetMin] = useState<number>(0);

  // Persist slider preferences so returning users don't re-tune.
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const v = JSON.parse(raw) as { readWpm?: number; speakWpm?: number; pauseSec?: number };
      if (typeof v.readWpm === 'number') setReadWpm(v.readWpm);
      if (typeof v.speakWpm === 'number') setSpeakWpm(v.speakWpm);
      if (typeof v.pauseSec === 'number') setPauseSec(v.pauseSec);
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ readWpm, speakWpm, pauseSec }));
    } catch { /* quota or private mode — ignore */ }
  }, [readWpm, speakWpm, pauseSec]);

  const stats = useMemo(() => {
    const words = countWords(text);
    const paragraphs = countParagraphs(text);
    const pauseMin = (pauseSec * paragraphs) / 60;
    return {
      words,
      chars: countChars(text),
      paragraphs,
      readMin: words / readWpm + pauseMin,
      speakMin: words / speakWpm + pauseMin,
    };
  }, [text, readWpm, speakWpm, pauseSec]);

  // Reverse calc: given a target duration in minutes, how many words?
  const reverseTargetWords = targetMin > 0 ? Math.round(targetMin * speakWpm) : 0;

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

      <div>
        <div className="label">Context preset</div>
        <div className="flex flex-wrap gap-2">
          {PACE_PRESETS.map((p) => {
            const active = readWpm === p.readWpm && speakWpm === p.speakWpm;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => { setReadWpm(p.readWpm); setSpeakWpm(p.speakWpm); }}
                className={`rounded-md border px-3 py-1 text-sm transition ${
                  active
                    ? 'border-brand-600 bg-brand-50 text-brand-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
                title={p.hint}
                aria-pressed={active}
              >
                {p.label}
              </button>
            );
          })}
        </div>
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

      <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="min-w-[8rem] text-slate-700">Pause per paragraph</span>
          <input
            type="number"
            min={0}
            max={10}
            step={0.5}
            value={pauseSec}
            onChange={(e) => setPauseSec(Math.max(0, Math.min(10, Number(e.target.value) || 0)))}
            className="input w-20"
          />
          <span className="text-xs text-slate-500">sec</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="min-w-[8rem] text-slate-700">Target duration</span>
          <input
            type="number"
            min={0}
            step={0.5}
            value={targetMin || ''}
            placeholder="0"
            onChange={(e) => setTargetMin(Math.max(0, Number(e.target.value) || 0))}
            className="input w-20"
          />
          <span className="text-xs text-slate-500">min → {reverseTargetWords || '—'} words</span>
        </label>
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

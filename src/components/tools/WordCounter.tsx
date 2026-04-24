import { useMemo, useState } from 'react';
import { textStats, formatReadTime } from '~/lib/outcomes';
import { useToolSetting } from './useToolSettings';
import CopyButton from '../CopyButton';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

// Default reading and speaking rates. These are the same defaults textStats() uses
// (238 wpm read / 150 wpm speak), exposed in the UI so users see what we're assuming.
const DEFAULT_READ_WPM = 238;
const DEFAULT_SPEAK_WPM = 150;

interface PlatformPreset {
  id: string;
  label: string;
  unit: 'chars' | 'words';
  target: number;
  note: string;
}

const PLATFORM_PRESETS: readonly PlatformPreset[] = [
  { id: 'meta', label: 'Meta description', unit: 'chars', target: 155, note: 'Google typically truncates meta descriptions past ~155 characters.' },
  { id: 'title', label: 'Title tag', unit: 'chars', target: 60, note: 'Title tags get truncated in SERPs past roughly 60 characters.' },
  { id: 'tweet', label: 'Tweet / X post', unit: 'chars', target: 280, note: 'X (formerly Twitter) limits posts to 280 characters for free accounts.' },
  { id: 'headline', label: 'Headline', unit: 'chars', target: 70, note: 'Most news and blog headlines stay under 70 characters for scannability.' },
  { id: 'fb', label: 'Facebook post', unit: 'chars', target: 400, note: 'Facebook posts get cut with a "See more" link past roughly 400 characters.' },
  { id: 'ig', label: 'Instagram caption', unit: 'chars', target: 125, note: 'First ~125 characters of an Instagram caption show before the fold.' },
  { id: 'abstract', label: 'Abstract', unit: 'words', target: 250, note: 'Academic abstracts typically run 150–250 words.' },
];

type ScriptUnit = 'min' | 'sec';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [readWpm, setReadWpm] = useState<number>(DEFAULT_READ_WPM);
  const [speakWpm, setSpeakWpm] = useState<number>(DEFAULT_SPEAK_WPM);
  const [showAdv, setShowAdv] = useState(false);
  const [presetId, setPresetId] = useState<string | null>(null);
  const [scriptMode, setScriptMode] = useToolSetting<'off' | 'on'>('kefiw.mode.wordcount-script', 'off');
  const [scriptDuration, setScriptDuration] = useState<number>(2);
  const [scriptUnit, setScriptUnit] = useState<ScriptUnit>('min');

  const stats = useMemo(() => textStats(text), [text]);

  // Recompute reading/speaking times with user-adjusted WPM so the UI reflects
  // the actual sliders, not the hardcoded textStats defaults.
  const readMinutes = readWpm > 0 ? stats.words / readWpm : 0;
  const speakMinutes = speakWpm > 0 ? stats.words / speakWpm : 0;

  const readingLabel = readMinutes < 1
    ? `${Math.max(stats.words > 0 ? 1 : 0, Math.round(readMinutes * 60))} sec`
    : `${readMinutes.toFixed(1)} min`;
  const speakingLabel = speakMinutes < 1
    ? `${Math.max(stats.words > 0 ? 1 : 0, Math.round(speakMinutes * 60))} sec`
    : `${speakMinutes.toFixed(1)} min`;

  const preset = PLATFORM_PRESETS.find((p) => p.id === presetId) ?? null;
  const presetActual = preset
    ? (preset.unit === 'chars' ? stats.characters : stats.words)
    : 0;
  const presetRemaining = preset ? preset.target - presetActual : 0;

  // Script mode: target-duration → target-word-count at current speaking rate.
  const scriptMinutes = scriptUnit === 'sec' ? scriptDuration / 60 : scriptDuration;
  const scriptTargetWords = Math.max(0, Math.round(scriptMinutes * speakWpm));
  const scriptDelta = stats.words - scriptTargetWords;

  const statsText = buildStatsExport({
    text,
    stats,
    readWpm,
    speakWpm,
    readingLabel,
    speakingLabel,
  });

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

      <div className="rounded-md border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setShowAdv((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-slate-800"
          aria-expanded={showAdv}
        >
          <span>Reading &amp; speaking rate — currently {readWpm} / {speakWpm} wpm</span>
          <span className="text-slate-400">{showAdv ? '−' : '+'}</span>
        </button>
        {showAdv && (
          <div className="space-y-3 border-t border-slate-200 px-3 py-3">
            <p className="text-xs text-slate-500">
              The defaults ({DEFAULT_READ_WPM} reading / {DEFAULT_SPEAK_WPM} speaking wpm) come from published averages for adult English readers and podcast-paced speech. Adjust to match your audience or your own delivery.
            </p>
            <RateSlider
              id="read-wpm"
              label="Reading speed"
              value={readWpm}
              onChange={setReadWpm}
              min={100}
              max={400}
              defaultValue={DEFAULT_READ_WPM}
              hint="Silent reading. 200–250 wpm is typical; technical material is slower."
            />
            <RateSlider
              id="speak-wpm"
              label="Speaking speed"
              value={speakWpm}
              onChange={setSpeakWpm}
              min={80}
              max={250}
              defaultValue={DEFAULT_SPEAK_WPM}
              hint="Aloud. 130–150 wpm for presentations; news anchors run ~160 wpm; auctioneers 250+."
            />
          </div>
        )}
      </div>

      <div>
        <div className="label">Platform target (optional)</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setPresetId(null)}
            className={`rounded-md border px-3 py-1 text-sm transition ${
              presetId === null
                ? 'border-brand-600 bg-brand-50 text-brand-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
            aria-pressed={presetId === null}
          >
            None
          </button>
          {PLATFORM_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetId(p.id)}
              className={`rounded-md border px-3 py-1 text-sm transition ${
                presetId === p.id
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              aria-pressed={presetId === p.id}
            >
              {p.label} ({p.target} {p.unit === 'chars' ? 'ch' : 'w'})
            </button>
          ))}
        </div>
        {preset && (
          <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800">{preset.label}:</span>{' '}
                <span className="font-mono">
                  {presetActual} / {preset.target} {preset.unit}
                </span>
              </div>
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                presetRemaining < 0
                  ? 'bg-red-100 text-red-800'
                  : presetRemaining === 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
              }`}>
                {presetRemaining < 0
                  ? `${-presetRemaining} over`
                  : presetRemaining === 0
                    ? 'exact'
                    : `${presetRemaining} left`}
              </span>
            </div>
            <div className="mt-1 text-xs text-slate-600">{preset.note}</div>
          </div>
        )}
      </div>

      <div className="rounded-md border border-slate-200 bg-white">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-sm font-semibold text-slate-800">Script mode</div>
          <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-600">
            <input
              type="checkbox"
              checked={scriptMode === 'on'}
              onChange={(e) => setScriptMode(e.target.checked ? 'on' : 'off')}
            />
            Hit a target duration
          </label>
        </div>
        {scriptMode === 'on' && (
          <div className="space-y-2 border-t border-slate-200 px-3 py-3 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="script-dur" className="text-slate-700">Target duration</label>
              <input
                id="script-dur"
                type="number"
                min={0}
                step={scriptUnit === 'sec' ? 5 : 0.25}
                value={scriptDuration}
                onChange={(e) => setScriptDuration(Math.max(0, Number(e.target.value) || 0))}
                className="input w-24"
              />
              <select
                value={scriptUnit}
                onChange={(e) => setScriptUnit(e.target.value as ScriptUnit)}
                className="input w-24"
                aria-label="Duration unit"
              >
                <option value="min">minutes</option>
                <option value="sec">seconds</option>
              </select>
              <span className="text-xs text-slate-500">at {speakWpm} wpm → target {scriptTargetWords} words</span>
            </div>
            {stats.words > 0 && scriptTargetWords > 0 && (
              <div className={`rounded-md p-2 text-sm ${
                Math.abs(scriptDelta) <= Math.max(5, scriptTargetWords * 0.05)
                  ? 'bg-emerald-50 text-emerald-800'
                  : scriptDelta > 0
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-blue-50 text-blue-800'
              }`}>
                {Math.abs(scriptDelta) <= Math.max(5, scriptTargetWords * 0.05)
                  ? `On target — you have ${stats.words} words, aiming for ~${scriptTargetWords}.`
                  : scriptDelta > 0
                    ? `Cut roughly ${scriptDelta} word${scriptDelta === 1 ? '' : 's'} to fit ${formatDuration(scriptMinutes)} at ${speakWpm} wpm.`
                    : `Add roughly ${-scriptDelta} word${scriptDelta === -1 ? '' : 's'} to fill ${formatDuration(scriptMinutes)} at ${speakWpm} wpm.`}
              </div>
            )}
          </div>
        )}
      </div>

      {stats.words > 0 && (
        <div className="flex justify-end">
          <CopyButton value={statsText} label="Copy stats" tool="word-counter" />
        </div>
      )}

      {stats.words > 0 && (() => {
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `${stats.words.toLocaleString()} word${stats.words === 1 ? '' : 's'}, ${formatReadTime(readMinutes)} to read at ${readWpm} wpm.` },
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
          { kind: 'takeaway', text: `Reading (${readWpm} wpm): ${readingLabel} · Speaking (${speakWpm} wpm): ${speakingLabel}.` },
          stats.sentences > 0 && stats.avgWordsPerSentence > 20
            ? { kind: 'takeaway' as const, text: `Average sentence length is ${stats.avgWordsPerSentence.toFixed(1)} words — consider shorter sentences for readability.` }
            : null,
          preset
            ? {
                kind: 'takeaway' as const,
                text: presetRemaining < 0
                  ? `${preset.label}: ${-presetRemaining} ${preset.unit} over the ${preset.target} limit.`
                  : presetRemaining === 0
                    ? `${preset.label}: exactly on the ${preset.target} ${preset.unit} mark.`
                    : `${preset.label}: ${presetRemaining} ${preset.unit} under the ${preset.target} limit.`,
              }
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

function formatDuration(minutes: number): string {
  if (minutes < 1) {
    const s = Math.round(minutes * 60);
    return `${s} sec`;
  }
  if (Math.abs(minutes - Math.round(minutes)) < 0.05) {
    const m = Math.round(minutes);
    return `${m} min`;
  }
  return `${minutes.toFixed(1)} min`;
}

function buildStatsExport(args: {
  text: string;
  stats: ReturnType<typeof textStats>;
  readWpm: number;
  speakWpm: number;
  readingLabel: string;
  speakingLabel: string;
}): string {
  const { stats, readWpm, speakWpm, readingLabel, speakingLabel } = args;
  const lines = [
    'Word Counter — kefiw',
    '',
    `Words:                ${stats.words.toLocaleString()}`,
    `Characters:           ${stats.characters.toLocaleString()}`,
    `Characters (no sp):   ${stats.charactersNoSpaces.toLocaleString()}`,
    `Sentences:            ${stats.sentences}`,
    `Paragraphs:           ${stats.paragraphs}`,
    `Lines:                ${stats.lines}`,
    `Avg word length:      ${stats.avgWordLength.toFixed(1)}`,
    `Avg words/sentence:   ${stats.avgWordsPerSentence.toFixed(1)}`,
  ];
  if (stats.longestWord) {
    lines.push(`Longest word:         ${stats.longestWord} (${stats.longestWord.length} ch)`);
  }
  lines.push('');
  lines.push(`Reading time:         ${readingLabel} at ${readWpm} wpm`);
  lines.push(`Speaking time:        ${speakingLabel} at ${speakWpm} wpm`);
  return lines.join('\n');
}

function RateSlider({
  id,
  label,
  value,
  onChange,
  min,
  max,
  defaultValue,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  defaultValue: number;
  hint: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-medium text-slate-700">{label}</label>
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-900">{value} wpm</span>
          {value !== defaultValue && (
            <button
              type="button"
              onClick={() => onChange(defaultValue)}
              className="text-xs text-brand-700 hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
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

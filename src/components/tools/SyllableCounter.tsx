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

// Exception dictionary — edge cases where the vowel-group heuristic is known to miscount.
// Entries use the most common spoken count. The preset comparison still uses these as-is;
// users can bump individual words up or down with the manual override.
const SYLLABLE_EXCEPTIONS: Record<string, number> = {
  every: 2,
  fire: 1,
  poem: 2,
  family: 3,
  business: 2,
  chocolate: 2,
  different: 2,
  interesting: 3,
  camera: 2,
  memory: 2,
  hour: 1,
  our: 1,
  being: 2,
  idea: 3,
  science: 2,
  quiet: 2,
  diary: 3,
  vehicle: 3,
  average: 3,
  general: 3,
};

function countSyllablesSmart(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (SYLLABLE_EXCEPTIONS[w] !== undefined) return SYLLABLE_EXCEPTIONS[w];
  return countSyllables(w);
}

type PresetId = 'none' | 'haiku' | 'tanka' | 'limerick' | 'hymn';

interface Preset {
  id: PresetId;
  label: string;
  pattern: number[] | null;
  note: string;
}

const PRESETS: readonly Preset[] = [
  { id: 'none', label: 'None', pattern: null, note: '' },
  { id: 'haiku', label: 'Haiku', pattern: [5, 7, 5], note: 'Three lines: 5, 7, 5.' },
  { id: 'tanka', label: 'Tanka', pattern: [5, 7, 5, 7, 7], note: 'Five lines: 5, 7, 5, 7, 7.' },
  { id: 'limerick', label: 'Limerick', pattern: [8, 8, 5, 5, 8], note: 'Five lines, AABBA rhyme: roughly 8, 8, 5, 5, 8.' },
  { id: 'hymn', label: 'Common meter', pattern: [8, 6, 8, 6], note: 'Ballad / hymn: 8, 6, 8, 6.' },
];

export default function SyllableCounter() {
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.syllables', 'quick');
  const [presetId, setPresetId] = useToolSetting<PresetId>('kefiw.preset.syllables', 'none');
  const [text, setText] = useState('');
  const [overrides, setOverrides] = useState<Record<string, number>>({});

  const preset = PRESETS.find((p) => p.id === presetId) ?? PRESETS[0];

  function countWord(word: string): number {
    const key = word.toLowerCase().replace(/[^a-z]/g, '');
    if (key && overrides[key] !== undefined) return overrides[key];
    return countSyllablesSmart(word);
  }

  function bumpOverride(word: string, delta: number): void {
    const key = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!key) return;
    setOverrides((prev) => {
      const current = prev[key] ?? countSyllablesSmart(word);
      const next = Math.max(0, current + delta);
      return { ...prev, [key]: next };
    });
  }

  function clearOverride(word: string): void {
    const key = word.toLowerCase().replace(/[^a-z]/g, '');
    setOverrides((prev) => {
      if (prev[key] === undefined) return prev;
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }

  const result = useMemo(() => {
    const words = text.split(/\s+/).filter(Boolean);
    const perWord = words.map((w) => ({ word: w, count: countWord(w) }));
    const total = perWord.reduce((s, x) => s + x.count, 0);
    return { words: perWord, total };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, overrides]);

  const lines = text.split('\n');
  const nonEmpty = lines.filter((l) => l.trim());
  const lineCounts = nonEmpty.map((l) =>
    l.split(/\s+/).filter(Boolean).reduce((s, w) => s + countWord(w), 0),
  );

  const presetCheck = preset.pattern
    ? preset.pattern.map((target, i) => {
        const actual = lineCounts[i];
        if (actual === undefined) return { line: i + 1, target, actual: null as number | null, status: 'missing' as const };
        return {
          line: i + 1,
          target,
          actual,
          status: (actual === target ? 'ok' : actual < target ? 'under' : 'over') as 'ok' | 'under' | 'over',
        };
      })
    : null;
  const presetPasses = presetCheck?.every((r) => r.status === 'ok' && nonEmpty.length === preset.pattern!.length) ?? false;

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
        <label className="label" htmlFor="preset">Form preset</label>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetId(p.id)}
              className={`rounded-md border px-3 py-1 text-sm transition ${
                preset.id === p.id
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              aria-pressed={preset.id === p.id}
            >
              {p.label}
            </button>
          ))}
        </div>
        {preset.note && <div className="mt-1 text-xs text-slate-500">{preset.note}</div>}
      </div>
      <div>
        <label className="label" htmlFor="in">Text</label>
        <textarea id="in" className="input h-36" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a word, sentence, or paragraph…" />
      </div>
      <div className="card">
        <div className="text-sm text-slate-500">Total syllables</div>
        <div className="text-3xl font-bold">{result.total}</div>
      </div>
      {presetCheck && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-800">
              {preset.label} target: {preset.pattern!.join('-')}
            </div>
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                presetPasses ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {presetPasses ? 'Pattern met' : 'Not yet'}
            </span>
          </div>
          <ul className="space-y-1 text-sm">
            {presetCheck.map((r) => (
              <li key={r.line} className="flex items-center gap-3">
                <span className="w-14 text-slate-500">Line {r.line}</span>
                <span className="font-mono">
                  {r.actual ?? '—'} / {r.target}
                </span>
                <span
                  className={`text-xs ${
                    r.status === 'ok'
                      ? 'text-emerald-700'
                      : r.status === 'missing'
                        ? 'text-slate-500'
                        : 'text-amber-700'
                  }`}
                >
                  {r.status === 'ok'
                    ? 'on target'
                    : r.status === 'missing'
                      ? 'missing line'
                      : r.status === 'over'
                        ? `${(r.actual ?? 0) - r.target} over`
                        : `${r.target - (r.actual ?? 0)} under`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {result.words.length > 0 && (() => {
        const avg = result.total / result.words.length;
        const longest = result.words.reduce((a, b) => b.count > a.count ? b : a);
        const shortest = result.words.reduce((a, b) => b.count < a.count ? b : a);
        const isHaiku = result.total === 17 && nonEmpty.length === 3 && preset.id === 'none';
        const perLine = nonEmpty.length > 1
          ? nonEmpty.map((l, i) => ({
              label: `Line ${i + 1}`,
              value: String(lineCounts[i] ?? 0),
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
          perLine && !presetCheck ? { kind: 'comparison' as const, title: 'Syllables by line', rows: perLine } : null,
          isHaiku
            ? { kind: 'takeaway' as const, text: 'Three lines at 17 syllables — try the Haiku Checker to verify 5-7-5.' }
            : nonEmpty.length > 1 && !presetCheck
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
          <div className="label flex items-center justify-between">
            <span>Per word (click − or + to override)</span>
            {Object.keys(overrides).length > 0 && (
              <button
                type="button"
                onClick={() => setOverrides({})}
                className="text-xs font-normal text-brand-700 hover:underline"
              >
                Reset overrides
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {result.words.map((w, i) => {
              const key = w.word.toLowerCase().replace(/[^a-z]/g, '');
              const isOverridden = key && overrides[key] !== undefined;
              return (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                    isOverridden
                      ? 'border-brand-300 bg-brand-50 text-brand-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <strong>{w.word}</strong>
                  <button
                    type="button"
                    onClick={() => bumpOverride(w.word, -1)}
                    className="rounded px-1 text-slate-500 hover:bg-slate-100"
                    aria-label={`Decrease count for ${w.word}`}
                  >
                    −
                  </button>
                  <span className="font-mono">{w.count}</span>
                  <button
                    type="button"
                    onClick={() => bumpOverride(w.word, +1)}
                    className="rounded px-1 text-slate-500 hover:bg-slate-100"
                    aria-label={`Increase count for ${w.word}`}
                  >
                    +
                  </button>
                  {isOverridden && (
                    <button
                      type="button"
                      onClick={() => clearOverride(w.word)}
                      className="ml-1 rounded text-slate-400 hover:text-slate-600"
                      title="Reset this word"
                      aria-label={`Reset override for ${w.word}`}
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

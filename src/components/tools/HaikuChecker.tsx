import { useMemo, useState } from 'react';
import { countSyllables } from '~/lib/text';
import { useToolSetting } from './useToolSettings';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type FormId = 'haiku' | 'tanka';

interface FormSpec {
  id: FormId;
  label: string;
  pattern: readonly number[];
  placeholder: string;
  note: string;
}

const FORMS: readonly FormSpec[] = [
  {
    id: 'haiku',
    label: 'Haiku (5-7-5)',
    pattern: [5, 7, 5],
    placeholder: 'Line 1 (5 syllables)\nLine 2 (7 syllables)\nLine 3 (5 syllables)',
    note: 'Three lines: 5, 7, 5.',
  },
  {
    id: 'tanka',
    label: 'Tanka (5-7-5-7-7)',
    pattern: [5, 7, 5, 7, 7],
    placeholder: 'Line 1 (5)\nLine 2 (7)\nLine 3 (5)\nLine 4 (7)\nLine 5 (7)',
    note: 'Five lines: 5, 7, 5, 7, 7. Adds two seven-syllable closing lines to the haiku frame.',
  },
];

// Kigo (seasonal word) prompt library. These are suggestions for inspiration only —
// the tool does NOT attempt to detect kigo in the poem. See content_guidance.claim_forbidden.
const KIGO_LIBRARY: readonly { season: string; examples: string[] }[] = [
  { season: 'Spring', examples: ['cherry blossom', 'thaw', 'first rain', 'nesting', 'new moon', 'robin', 'warm wind'] },
  { season: 'Summer', examples: ['cicada', 'heat lightning', 'sunflower', 'firefly', 'open window', 'sweat', 'long day'] },
  { season: 'Autumn', examples: ['falling leaves', 'harvest moon', 'first frost', 'migration', 'chestnut', 'pumpkin', 'short day'] },
  { season: 'Winter', examples: ['snow', 'bare branch', 'breath cloud', 'thin ice', 'long night', 'scarf', 'wool glove'] },
];

export default function HaikuChecker() {
  const [formId, setFormId] = useToolSetting<FormId>('kefiw.form.haiku', 'haiku');
  const [text, setText] = useState('An old silent pond\nA frog jumps into the pond\nSplash! Silence again');
  const [showKigo, setShowKigo] = useState(false);
  const [showCraft, setShowCraft] = useState(false);

  const form = FORMS.find((f) => f.id === formId) ?? FORMS[0];
  const TARGET = form.pattern;

  const r = useMemo(() => {
    const rawLines = text.split('\n');
    const lines = rawLines.map((l) => {
      const words = l.split(/\s+/).filter(Boolean);
      const count = words.reduce((s, w) => s + countSyllables(w), 0);
      return { text: l, words, count };
    });
    const nonEmpty = lines.filter((l) => l.words.length > 0);
    const total = nonEmpty.reduce((s, l) => s + l.count, 0);
    const valid = nonEmpty.length === TARGET.length
      && TARGET.every((t, i) => nonEmpty[i]?.count === t);
    return { lines, nonEmpty, total, valid };
  }, [text, TARGET]);

  const patternLabel = TARGET.join('-');

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Form</label>
        <div className="flex flex-wrap gap-2">
          {FORMS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFormId(f.id)}
              className={`rounded-md border px-3 py-1 text-sm transition ${
                form.id === f.id
                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
              aria-pressed={form.id === f.id}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="mt-1 text-xs text-slate-500">{form.note}</div>
      </div>
      <div>
        <label className="label" htmlFor="in">Poem ({TARGET.length} lines)</label>
        <textarea
          id="in"
          className="input h-40 font-serif"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={form.placeholder}
        />
      </div>
      <div className="space-y-2">
        {r.nonEmpty.map((l, i) => {
          const target = TARGET[i];
          const ok = target !== undefined && l.count === target;
          const over = target !== undefined && l.count > target;
          return (
            <div key={i} className={`rounded border px-3 py-2 text-sm ${
              target === undefined ? 'border-amber-200 bg-amber-50' :
              ok ? 'border-green-200 bg-green-50' :
              'border-red-200 bg-red-50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-serif">{l.text || <em className="text-slate-400">empty</em>}</span>
                <span className="font-mono text-xs">
                  {l.count}{target !== undefined && ` / ${target}`}
                  {target !== undefined && (ok ? ' ✓' : over ? ' (over)' : ' (under)')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {r.nonEmpty.length > 0 && (() => {
        const currentPattern = r.nonEmpty.slice(0, TARGET.length).map((l) => l.count).join('-');
        const perLineRows = r.nonEmpty.slice(0, TARGET.length).map((l, i) => {
          const target = TARGET[i];
          const delta = target !== undefined ? l.count - target : 0;
          return {
            label: `Line ${i + 1}`,
            value: target !== undefined
              ? `${l.count}/${target}${delta === 0 ? ' ✓' : delta > 0 ? ` (+${delta})` : ` (${delta})`}`
              : String(l.count),
          };
        });
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: r.valid
              ? `Valid ${form.id} — ${patternLabel} across ${TARGET.length} lines (${r.total} syllables).`
              : `Not yet a ${patternLabel} ${form.id}. ${r.nonEmpty.length} line${r.nonEmpty.length === 1 ? '' : 's'}, ${r.total} syllables total.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Lines', value: String(r.nonEmpty.length) },
              { label: 'Syllables', value: String(r.total) },
              { label: 'Pattern', value: currentPattern },
              { label: 'Target', value: patternLabel },
            ],
          },
          perLineRows.length > 0
            ? { kind: 'comparison' as const, title: 'Per line', rows: perLineRows }
            : null,
          {
            kind: 'takeaway',
            text: r.valid
              ? 'Structure is solid. Now read aloud for image, contrast, and cut — the count is the frame, not the poem.'
              : r.nonEmpty.length !== TARGET.length
                ? `Aim for exactly ${TARGET.length} non-empty lines (currently ${r.nonEmpty.length}).`
                : `Target ${patternLabel}. Current: ${currentPattern}.`,
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/syllable-counter/', label: 'Syllable Counter' },
              { href: '/word-tools/rhyme-finder/', label: 'Rhyme Finder' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}

      <div className="rounded-md border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setShowCraft((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-slate-800"
          aria-expanded={showCraft}
        >
          <span>Craft checklist — after the count works</span>
          <span className="text-slate-400">{showCraft ? '−' : '+'}</span>
        </button>
        {showCraft && (
          <ul className="space-y-2 border-t border-slate-200 px-3 py-3 text-sm text-slate-700">
            <li>
              <strong className="text-slate-900">Image.</strong> Can a reader see or hear the scene without explanation? A concrete noun (leaf, cup, bus, rain) usually lands harder than a feeling word.
            </li>
            <li>
              <strong className="text-slate-900">Season.</strong> Does one image hint at time of year? Traditional haiku uses a kigo; modern English haiku often uses implicit season cues.
            </li>
            <li>
              <strong className="text-slate-900">Contrast.</strong> Are there two parts in conversation — small and large, still and moving, indoor and outdoor?
            </li>
            <li>
              <strong className="text-slate-900">Cut.</strong> Is there a turn between the first image and the second? Punctuation, a line break, or a shift of focus can do the work.
            </li>
            <li>
              <strong className="text-slate-900">Compression.</strong> Can any word go without losing the image? Filler to reach the count usually weakens the poem.
            </li>
          </ul>
        )}
      </div>

      <div className="rounded-md border border-slate-200 bg-white">
        <button
          type="button"
          onClick={() => setShowKigo((v) => !v)}
          className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-slate-800"
          aria-expanded={showKigo}
        >
          <span>Kigo prompts — seasonal words for inspiration</span>
          <span className="text-slate-400">{showKigo ? '−' : '+'}</span>
        </button>
        {showKigo && (
          <div className="space-y-3 border-t border-slate-200 px-3 py-3">
            <p className="text-xs text-slate-500">
              The tool does not detect seasonal words automatically. These are prompts only — pick one that fits your scene, then draft a line around it.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {KIGO_LIBRARY.map((g) => (
                <div key={g.season}>
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{g.season}</div>
                  <div className="flex flex-wrap gap-1">
                    {g.examples.map((k) => (
                      <span key={k} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { sortLines } from '~/lib/text';
import type { SortMode } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type ExtendedSortMode = SortMode | 'natural-asc' | 'natural-desc';

const MODES: { id: ExtendedSortMode; label: string }[] = [
  { id: 'alpha-asc', label: 'A → Z' },
  { id: 'alpha-desc', label: 'Z → A' },
  { id: 'natural-asc', label: 'Natural ↑' },
  { id: 'natural-desc', label: 'Natural ↓' },
  { id: 'length-asc', label: 'Length ↑' },
  { id: 'length-desc', label: 'Length ↓' },
  { id: 'numeric-asc', label: 'Numeric ↑' },
  { id: 'numeric-desc', label: 'Numeric ↓' },
];

// Locale options surfaced on-page so the user sees which rules are being used.
// Browser default lets Intl.Collator pick from the user's preferred locales.
const LOCALES: { id: string; label: string }[] = [
  { id: 'auto', label: 'Browser default' },
  { id: 'en', label: 'English (en)' },
  { id: 'en-US', label: 'English — US (en-US)' },
  { id: 'de', label: 'German (de)' },
  { id: 'es', label: 'Spanish (es)' },
  { id: 'fr', label: 'French (fr)' },
  { id: 'ja', label: 'Japanese (ja)' },
  { id: 'sv', label: 'Swedish (sv)' },
];

// Natural sort uses Intl.Collator with `numeric: true` so 'item2' comes before
// 'item10'. Locale controls collation rules (German sharp-s, Swedish å/ä/ö, etc.).
function naturalSort(lines: string[], locale: string, caseSensitive: boolean, desc: boolean): string[] {
  const coll = new Intl.Collator(locale === 'auto' ? undefined : locale, {
    numeric: true,
    sensitivity: caseSensitive ? 'case' : 'base',
  });
  const sorted = [...lines].sort((a, b) => coll.compare(a, b));
  return desc ? sorted.reverse() : sorted;
}

export default function SortLines() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<ExtendedSortMode>('alpha-asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [dedupe, setDedupe] = useState(false);
  const [locale, setLocale] = useState<string>('auto');
  const out = useMemo(() => {
    const preLines = text.split('\n');
    const filtered = removeEmpty ? preLines.filter((l) => l.trim() !== '') : preLines;
    const sorted = (mode === 'natural-asc' || mode === 'natural-desc')
      ? naturalSort(filtered, locale, caseSensitive, mode === 'natural-desc').join('\n')
      : sortLines(filtered.join('\n'), mode as SortMode, caseSensitive);
    if (!dedupe) return sorted;
    // Dedupe post-sort: collapse adjacent equals (respecting case-sensitivity).
    const sortedLines = sorted.split('\n');
    const key = (s: string): string => caseSensitive ? s : s.toLowerCase();
    const seen = new Set<string>();
    const uniq: string[] = [];
    for (const l of sortedLines) {
      const k = key(l);
      if (!seen.has(k)) { seen.add(k); uniq.push(l); }
    }
    return uniq.join('\n');
  }, [text, mode, caseSensitive, removeEmpty, dedupe, locale]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`btn ${mode===m.id ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} />
          Case-sensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={removeEmpty} onChange={(e) => setRemoveEmpty(e.target.checked)} />
          Remove empty lines
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} />
          Sort and dedupe (combined)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-slate-700">Locale</span>
          <select value={locale} onChange={(e) => setLocale(e.target.value)} className="input !w-auto text-sm">
            {LOCALES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
          </select>
        </label>
      </div>
      <div>
        <label className="label" htmlFor="in">Input</label>
        <textarea id="in" className="input h-48 font-mono" value={text} onChange={(e) => setText(e.target.value)} placeholder="One line per item…" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="out">Output</label>
          <CopyButton value={out} />
        </div>
        <textarea id="out" readOnly className="input h-48 bg-slate-50 font-mono" value={out} />
      </div>
      {/*
        Before/after preview: first 3 input lines vs first 3 output lines.
        Makes the effect of the current sort visible without scrolling.
      */}
      {text.length > 0 && (() => {
        const inLines = text.split('\n').slice(0, 3);
        const outLines = out.split('\n').slice(0, 3);
        return (
          <div className="grid gap-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs sm:grid-cols-2">
            <div>
              <div className="mb-1 font-semibold uppercase tracking-wide text-slate-500">First 3 before</div>
              <ol className="space-y-0.5 font-mono">
                {inLines.map((l, i) => <li key={i} className="truncate text-slate-700">{i + 1}. {l || <span className="italic text-slate-400">(empty)</span>}</li>)}
              </ol>
            </div>
            <div>
              <div className="mb-1 font-semibold uppercase tracking-wide text-slate-500">First 3 after</div>
              <ol className="space-y-0.5 font-mono">
                {outLines.map((l, i) => <li key={i} className="truncate text-slate-900">{i + 1}. {l || <span className="italic text-slate-400">(empty)</span>}</li>)}
              </ol>
            </div>
          </div>
        );
      })()}
      {text.length > 0 && (() => {
        const sortedLines = out.split('\n').filter((l) => l.trim());
        const lines = sortedLines.length;
        const label = MODES.find((m) => m.id === mode)?.label ?? mode;
        const seen = new Set<string>();
        for (const l of sortedLines) seen.add(caseSensitive ? l : l.toLowerCase());
        const duplicates = lines - seen.size;
        const first = sortedLines.slice(0, 3);
        const last = sortedLines.slice(Math.max(0, lines - 3));
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Sorted ${lines.toLocaleString()} line${lines === 1 ? '' : 's'} (${label}).` },
          {
            kind: 'stats',
            items: [
              { label: 'Lines', value: lines.toLocaleString() },
              { label: 'Unique', value: seen.size.toLocaleString() },
              { label: 'Duplicates', value: duplicates.toLocaleString() },
              { label: 'Case', value: caseSensitive ? 'Sensitive' : 'Insensitive' },
            ],
          },
          lines > 3
            ? {
                kind: 'comparison' as const,
                title: 'After sort',
                columns: [
                  { title: 'First 3', items: first },
                  { title: 'Last 3', items: last.reverse() },
                ],
              }
            : null,
          duplicates > 0
            ? { kind: 'takeaway' as const, text: `${duplicates} duplicate${duplicates === 1 ? '' : 's'} remain — use Remove Duplicate Lines to dedupe.` }
            : { kind: 'takeaway' as const, text: caseSensitive ? 'Case-sensitive comparison.' : 'Case-insensitive comparison — toggle above to change.' },
          {
            kind: 'nextStep',
            actions: [
              { href: '/text-tools/remove-duplicate-lines/', label: 'Remove Duplicate Lines' },
              { href: '/text-tools/reverse-text/', label: 'Reverse Text' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

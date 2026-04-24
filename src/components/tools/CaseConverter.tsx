import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { toTitleCase, toSentenceCase, toCamelCase, toSnakeCase, toKebabCase, toConstantCase } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode =
  | 'upper' | 'lower' | 'title' | 'sentence'
  | 'camel' | 'snake' | 'kebab' | 'constant'
  | 'title-ap' | 'title-chicago' | 'title-apa' | 'title-mla'
  | 'preset-tag' | 'preset-filename' | 'preset-heading';
const MODES: { id: Mode; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'title-ap', label: 'AP Title' },
  { id: 'title-chicago', label: 'Chicago Title' },
  { id: 'title-apa', label: 'APA Title' },
  { id: 'title-mla', label: 'MLA Title' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'constant', label: 'CONSTANT_CASE' },
];

// Shared small-word sets per style guide. Union of articles, short prepositions,
// short conjunctions. AP caps words ≥4 letters; Chicago/APA/MLA use list-based
// small-word rules instead. First and last words always capitalize.
const SMALL_CHICAGO = new Set(['a','an','and','as','at','but','by','for','in','nor','of','on','or','the','to','up','yet']);
const SMALL_APA = new Set(['a','an','and','as','at','by','for','in','of','on','or','the','to','up']);
const SMALL_MLA = new Set(['a','an','and','as','at','but','by','for','in','nor','of','on','or','the','to','up','yet']);

function isAcronym(word: string): boolean {
  // Treat ALL-CAPS of 2+ chars as an acronym and preserve it.
  return word.length >= 2 && word === word.toUpperCase() && /[A-Z]/.test(word);
}

// Unicode-aware tokenizer: split on anything that isn't a letter, mark, or
// number. Handles café, naïve, Zoë, etc. without shredding accented letters.
function splitUnicodeTokens(text: string): string[] {
  return text.split(/([^\p{L}\p{M}\p{N}']+)/u);
}

// Output presets — compose the existing modes into common developer workflows.
function presetTag(text: string): string {
  // tags are lowercase, hyphen-separated, stripped of non-word chars
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, '')
    .trim()
    .replace(/[\s-]+/g, '-');
}

function presetFilename(text: string): string {
  // filenames: lowercase, underscores, no chars that break on Windows/Linux
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s._-]+/gu, '')
    .trim()
    .replace(/[\s]+/g, '_')
    .replace(/_+/g, '_');
}

function presetHeading(text: string): string {
  // headings: Chicago-style title case, trimmed, single spaces
  return styleGuideTitle(text.trim().replace(/\s+/g, ' '), 'chicago');
}

// Visual diff: char-by-char. Returns tuples of (kind, char).
type DiffSegment = { same: boolean; char: string };
function charDiff(input: string, output: string): DiffSegment[] {
  // Character-level diff — align by index. Good enough for case changes
  // where length often matches; when lengths diverge (snake/kebab add
  // joiners), we just mark the tail as changed.
  const segs: DiffSegment[] = [];
  const max = Math.max(input.length, output.length);
  for (let i = 0; i < max; i++) {
    const a = input[i] ?? '';
    const b = output[i] ?? '';
    if (a === b) segs.push({ same: true, char: b });
    else if (b) segs.push({ same: false, char: b });
  }
  return segs;
}

function capFirst(word: string): string {
  if (!word) return word;
  if (isAcronym(word)) return word;
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

function styleGuideTitle(text: string, style: 'ap' | 'chicago' | 'apa' | 'mla'): string {
  const tokens = splitUnicodeTokens(text);
  return tokens.map((tok, idx) => {
    if (/^[^\p{L}\p{M}\p{N}']+$/u.test(tok)) return tok;
    // First word = first non-delimiter token; last word = last non-delimiter token.
    const isFirst = tokens.findIndex((t) => !/^[^\p{L}\p{M}\p{N}']+$/u.test(t)) === idx;
    const lastContentIdx = (() => {
      for (let i = tokens.length - 1; i >= 0; i--) if (!/^[^\p{L}\p{M}\p{N}']+$/u.test(tokens[i])) return i;
      return -1;
    })();
    const isLast = idx === lastContentIdx;
    const lower = tok.toLowerCase().replace(/[^\p{L}']/gu, '');
    if (isAcronym(tok)) return tok;
    if (isFirst || isLast) return capFirst(tok);
    if (style === 'ap') {
      // AP: capitalize principal words, all words ≥4 letters.
      if (lower.length >= 4) return capFirst(tok);
      const principals = new Set(['is','are','was','were','be','been','it','if']);
      return principals.has(lower) ? capFirst(tok) : tok.toLowerCase();
    }
    const small =
      style === 'chicago' ? SMALL_CHICAGO :
      style === 'apa' ? SMALL_APA :
      SMALL_MLA;
    return small.has(lower) ? tok.toLowerCase() : capFirst(tok);
  }).join('');
}

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('title');
  const [showDiff, setShowDiff] = useState(false);
  const out = useMemo(() => {
    switch (mode) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title': return toTitleCase(text);
      case 'title-ap': return styleGuideTitle(text, 'ap');
      case 'title-chicago': return styleGuideTitle(text, 'chicago');
      case 'title-apa': return styleGuideTitle(text, 'apa');
      case 'title-mla': return styleGuideTitle(text, 'mla');
      case 'preset-tag': return presetTag(text);
      case 'preset-filename': return presetFilename(text);
      case 'preset-heading': return presetHeading(text);
      case 'sentence': return toSentenceCase(text);
      case 'camel': return toCamelCase(text);
      case 'snake': return toSnakeCase(text);
      case 'kebab': return toKebabCase(text);
      case 'constant': return toConstantCase(text);
    }
  }, [text, mode]);

  const diffSegs = useMemo(() => charDiff(text, out), [text, out]);

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
      {/* Quick presets — common developer workflows */}
      <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Presets</span>
        <button onClick={() => setMode('preset-tag')}
          className={`btn ${mode==='preset-tag' ? 'bg-brand-600 text-white' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
          Tag · lowercase-kebab
        </button>
        <button onClick={() => setMode('preset-filename')}
          className={`btn ${mode==='preset-filename' ? 'bg-brand-600 text-white' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
          Filename · lower_snake
        </button>
        <button onClick={() => setMode('preset-heading')}
          className={`btn ${mode==='preset-heading' ? 'bg-brand-600 text-white' : 'bg-white text-slate-900 hover:bg-slate-100'}`}>
          Heading · Title Case
        </button>
        <label className="ml-auto flex cursor-pointer items-center gap-1.5 text-xs text-slate-600">
          <input type="checkbox" checked={showDiff} onChange={(e) => setShowDiff(e.target.checked)} />
          Show diff
        </label>
      </div>
      <div>
        <label className="label" htmlFor="in">Input</label>
        <textarea id="in" className="input h-36" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text…" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="out">Output</label>
          <CopyButton value={out} />
        </div>
        <textarea id="out" readOnly className="input h-36 bg-slate-50" value={out} />
      </div>
      {showDiff && text.length > 0 && (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Visual diff — yellow = changed, plain = same
          </div>
          <div className="font-mono whitespace-pre-wrap break-words text-slate-900">
            {diffSegs.map((seg, i) =>
              seg.same
                ? <span key={i}>{seg.char}</span>
                : <span key={i} className="rounded bg-amber-100 px-[1px] text-amber-900">{seg.char}</span>
            )}
          </div>
        </div>
      )}
      {text.length > 0 && (() => {
        const label = MODES.find((m) => m.id === mode)?.label ?? mode;
        const delta = out.length - text.length;
        const words = (text.match(/\b[\w'-]+\b/g) ?? []).length;
        const lines = text.split('\n').length;
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Converted ${text.length.toLocaleString()} character${text.length === 1 ? '' : 's'} to ${label}.` },
          {
            kind: 'stats',
            items: [
              { label: 'Characters', value: text.length.toLocaleString() },
              { label: 'Words', value: words.toLocaleString() },
              { label: 'Lines', value: lines.toLocaleString() },
              { label: 'Δ length', value: `${delta > 0 ? '+' : ''}${delta}` },
            ],
          },
          {
            kind: 'takeaway',
            text: delta === 0
              ? 'Same length — no joiners added or removed.'
              : `Output is ${Math.abs(delta)} character${Math.abs(delta) === 1 ? '' : 's'} ${delta > 0 ? 'longer' : 'shorter'}.`,
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/text-tools/reverse-text/', label: 'Reverse Text' },
              { href: '/word-tools/word-counter/', label: 'Word Counter' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

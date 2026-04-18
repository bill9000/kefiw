import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { toTitleCase, toSentenceCase, toCamelCase, toSnakeCase, toKebabCase, toConstantCase } from '~/lib/text';

type Mode = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab' | 'constant';
const MODES: { id: Mode; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'camel', label: 'camelCase' },
  { id: 'snake', label: 'snake_case' },
  { id: 'kebab', label: 'kebab-case' },
  { id: 'constant', label: 'CONSTANT_CASE' },
];

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('title');
  const out = useMemo(() => {
    switch (mode) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title': return toTitleCase(text);
      case 'sentence': return toSentenceCase(text);
      case 'camel': return toCamelCase(text);
      case 'snake': return toSnakeCase(text);
      case 'kebab': return toKebabCase(text);
      case 'constant': return toConstantCase(text);
    }
  }, [text, mode]);

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
    </div>
  );
}

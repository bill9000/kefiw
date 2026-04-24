import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { reverseChars, reverseWords, reverseLines } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'chars' | 'words' | 'each-word' | 'lines' | 'mirror';

// Upside-down / mirror glyph table. Intentionally English-only — mirroring
// is novelty/display text, not a linguistic operation.
const MIRROR: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
  j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: 'ᗺ', C: 'Ɔ', D: 'p', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I',
  J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ',
  S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '.': '˙', ',': "'", "'": ',', '"': ',,', '?': '¿', '!': '¡',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
  '<': '>', '>': '<', '&': '⅋', '_': '‾', '3': 'Ɛ', '4': 'ᔭ',
  '6': '9', '7': 'ㄥ', '9': '6',
};

// Mirror + reverse so the result reads bottom-up, flipped. Classic flip-text.
function mirrorFlip(s: string): string {
  const mapped: string[] = [];
  for (const ch of s) mapped.push(MIRROR[ch] ?? ch);
  return mapped.reverse().join('');
}

// Grapheme-safe character reversal using Intl.Segmenter so emoji ZWJ and
// combining marks don't get shredded. Falls back to the lib helper.
function reverseCharsSafe(s: string): string {
  try {
    const I = Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment: (t: string) => Iterable<{ segment: string }> } };
    if (I.Segmenter) {
      const seg = new I.Segmenter(undefined, { granularity: 'grapheme' });
      const units: string[] = [];
      for (const g of seg.segment(s)) units.push(g.segment);
      return units.reverse().join('');
    }
  } catch { /* ignore */ }
  return reverseChars(s);
}

// Reverse each word in place ("hello world" -> "olleh dlrow").
function reverseEachWord(s: string): string {
  return s.split(/(\s+)/).map((tok) => (/^\s+$/.test(tok) ? tok : reverseCharsSafe(tok))).join('');
}

export default function ReverseText() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<Mode>('chars');
  const [normalizeCRLF, setNormalizeCRLF] = useState(true);
  const [palindromeLoose, setPalindromeLoose] = useState(true);
  // Normalize line endings before every mode so sort/dedupe friendly output.
  const source = useMemo(() => (normalizeCRLF ? text.replace(/\r\n?/g, '\n') : text), [text, normalizeCRLF]);
  const out = useMemo(() => {
    switch (mode) {
      case 'chars': return reverseCharsSafe(source);
      case 'words': return reverseWords(source);
      case 'each-word': return reverseEachWord(source);
      case 'lines': return reverseLines(source);
      case 'mirror': return mirrorFlip(source);
    }
  }, [source, mode]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(['chars','words','each-word','lines','mirror'] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`btn ${mode===m ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
            {m === 'chars' ? 'Characters' : m === 'words' ? 'Word order' : m === 'each-word' ? 'Reverse each word' : m === 'lines' ? 'Lines' : 'Mirror (upside-down)'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={normalizeCRLF} onChange={(e) => setNormalizeCRLF(e.target.checked)} />
          Normalize CRLF → LF
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={palindromeLoose} onChange={(e) => setPalindromeLoose(e.target.checked)} />
          Palindrome check ignores case &amp; punctuation
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
      {text.length > 0 && (() => {
        const normalize = (v: string): string => palindromeLoose
          ? v.replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
          : v.replace(/\s+/g, '');
        const isPalindrome = mode === 'chars' && normalize(source) === normalize(out) && normalize(source).length > 1;
        const what = mode === 'chars' ? 'characters' : mode === 'words' ? 'words' : 'lines';
        const chars = text.length;
        const words = text.match(/\b[\w'-]+\b/g)?.length ?? 0;
        const lines = text.split('\n').filter((l) => l.trim()).length;
        const count = mode === 'chars' ? chars : mode === 'words' ? words : lines;
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Reversed ${count.toLocaleString()} ${what}.` },
          {
            kind: 'stats',
            items: [
              { label: 'Characters', value: chars.toLocaleString() },
              { label: 'Words', value: words.toLocaleString() },
              { label: 'Lines', value: lines.toLocaleString() },
              { label: 'Mode', value: what },
            ],
          },
          isPalindrome
            ? { kind: 'takeaway' as const, text: 'Palindrome — reads the same forwards and backwards.' }
            : null,
          {
            kind: 'nextStep',
            actions: [
              { href: '/text-tools/case-converter/', label: 'Case Converter' },
              { href: '/text-tools/sort-lines/', label: 'Sort Lines' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

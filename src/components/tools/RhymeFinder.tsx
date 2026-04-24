import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import { countSyllables } from '~/lib/text';
import CopyButton from '../CopyButton';
import ModeSwitch from './ModeSwitch';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

type Mode = 'quick' | 'extended';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'quick', label: 'Quick' },
  { value: 'extended', label: 'Extended' },
];

// Spellings that commonly diverge in pronunciation across the English word list.
// When the query ends in one of these, spelling-based matches are likely eye rhymes.
const EYE_RHYME_PATTERNS: readonly { suffix: string; note: string }[] = [
  { suffix: 'ough', note: 'through, rough, though, cough, and bough all share -ough but sound different.' },
  { suffix: 'ove', note: 'love and move share -ove but the vowel sound differs.' },
  { suffix: 'ear', note: 'bear, hear, and heart share -ear but can sound different.' },
  { suffix: 'ose', note: 'lose, rose, and whose share -ose but can sound different.' },
  { suffix: 'ood', note: 'good, food, and blood all share -ood but split into three vowel sounds.' },
  { suffix: 'ead', note: 'head, bead, and read share -ead but can sound different.' },
];

function detectEyeRhymeRisk(word: string): { suffix: string; note: string } | null {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length < 4) return null;
  for (const p of EYE_RHYME_PATTERNS) {
    if (w.endsWith(p.suffix)) return p;
  }
  return null;
}

export default function RhymeFinder() {
  const { send } = useWordWorker();
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.rhymes', 'quick');
  const [word, setWord] = useState('');
  const [data, setData] = useState<{ perfect: string[]; near: string[] }>({ perfect: [], near: [] });
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');
  const loadedOnce = useRef(false);

  useEffect(() => {
    const v = word.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!v) { setData({ perfect: [], near: [] }); setPhase('idle'); return; }
    const firstTime = !loadedOnce.current;
    setPhase(firstTime ? 'loading' : 'searching');
    const t = setTimeout(async () => {
      const t0 = performance.now();
      if (firstTime) {
        await send('ready', { dictSource: 'full' });
        loadedOnce.current = true;
        track('dict_loaded', { source: 'full', ms: Math.round(performance.now() - t0) });
        setPhase('searching');
      }
      const res = await send<{ perfect: string[]; near: string[] }>('rhymes', { word: v, dictSource: 'full' });
      setData(res);
      setPhase('idle');
    }, 160);
    return () => clearTimeout(t);
  }, [word, send]);

  return (
    <div className="space-y-4">
      <ModeSwitch
        id="rhymes-mode"
        tool="rhymes"
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Quick mode gives instant estimates. Extended uses more data when available."
      />
      <div>
        <label className="label" htmlFor="w">Word</label>
        <input id="w" className="input font-mono" value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. time" autoFocus />
      </div>
      {(() => {
        const risk = detectEyeRhymeRisk(word);
        if (!risk) return null;
        return (
          <div role="status" className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-slate-800">
            <div className="font-semibold text-amber-800">Eye-rhyme risk: -{risk.suffix}</div>
            <div className="mt-1 text-slate-700">{risk.note} Spelling-based results below may not rhyme when spoken — read candidates aloud.</div>
          </div>
        );
      })()}
      {phase !== 'idle' && <div className="text-sm text-slate-500">{phase === 'loading' ? 'Loading word list…' : 'Searching rhymes…'}</div>}
      {phase === 'idle' && (data.perfect.length > 0 || data.near.length > 0) && (() => {
        const allShown = mode === 'extended' ? [...data.perfect, ...data.near] : data.perfect;
        const total = allShown.length;
        const shortest = allShown.reduce<string | null>((a, b) => (!a || b.length < a.length ? b : a), null);
        const longest = allShown.reduce<string | null>((a, b) => (!a || b.length > a.length ? b : a), null);
        const strongest = data.perfect.length > 0 ? 'Perfect' : 'Near';
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Found ${total.toLocaleString()} rhyme${total === 1 ? '' : 's'} for "${word.toLowerCase()}".` },
          {
            kind: 'stats',
            items: [
              { label: 'Mode', value: mode === 'quick' ? 'Quick' : 'Extended' },
              { label: 'Perfect', value: data.perfect.length.toLocaleString() },
              ...(mode === 'extended' ? [{ label: 'Near', value: data.near.length.toLocaleString() }] : []),
              ...(shortest ? [{ label: 'Shortest', value: shortest }] : []),
              ...(longest ? [{ label: 'Longest', value: longest }] : []),
            ],
          },
          { kind: 'takeaway', text: `Strongest bucket: ${strongest} rhymes.` },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/syllable-counter/', label: 'Syllable Counter' },
              { href: '/word-tools/haiku-checker/', label: 'Haiku Checker' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
      {phase === 'idle' && (data.perfect.length > 0 || data.near.length > 0) && (
        <>
          <RhymeBlock title="Perfect rhymes" words={data.perfect} />
          {mode === 'extended' && <RhymeBlock title="Near rhymes" words={data.near} />}
        </>
      )}
      <p className="text-xs text-slate-500">Rhymes are computed by trailing-letter match. For a full phonetic dictionary, a CMU-style engine is planned.</p>
    </div>
  );
}

function RhymeBlock({ title, words }: { title: string; words: string[] }) {
  if (!words.length) return null;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <div className="text-sm font-medium text-slate-700">{title} ({words.length})</div>
        <CopyButton value={words.join('\n')} label="Copy" tool="rhymes" />
      </div>
      <div className="flex flex-wrap gap-1">
        {words.map((w) => {
          const syl = countSyllables(w);
          return (
            <span key={w} className="chip" title={`${syl} syllable${syl === 1 ? '' : 's'}`}>
              {w}<span className="ml-1 text-xs text-slate-500">·{syl}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

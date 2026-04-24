import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolBool, useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import ResultList from './ResultList';
import ModeSwitch from './ModeSwitch';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';
import { wordStats, countByLengthTopN } from '~/lib/outcomes';

type Mode = 'fast' | 'full';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'fast', label: 'Game list' },
  { value: 'full', label: 'Full list' },
];

export default function AnagramSolver() {
  const { send } = useWordWorker();
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.anagram', 'fast');
  const [showScores, setShowScores] = useToolBool('kefiw.scores.anagram', true);
  const [letters, setLetters] = useState('');
  const [exact, setExact] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [fellBack, setFellBack] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');
  const loadedSources = useRef(new Set<string>());

  useEffect(() => {
    const v = letters.replace(/\s/g, '');
    if (!v) { setResults([]); setFellBack(false); setPhase('idle'); return; }
    const firstTime = !loadedSources.current.has(mode);
    setPhase(firstTime ? 'loading' : 'searching');
    const t = setTimeout(async () => {
      const t0 = performance.now();
      if (firstTime) {
        await send('ready', { dictSource: mode });
        loadedSources.current.add(mode);
        track('dict_loaded', { source: mode, ms: Math.round(performance.now() - t0) });
        setPhase('searching');
      }
      const { results } = await send<{ results: string[] }>('anagrams', { letters: v, exact, dictSource: mode });
      const filtered = results.filter((w) => w.length >= 3);
      if (filtered.length > 0) {
        setResults(filtered);
        setFellBack(false);
      } else {
        setResults(results);
        setFellBack(results.length > 0);
      }
      setPhase('idle');
    }, 100);
    return () => clearTimeout(t);
  }, [letters, exact, mode, send]);

  return (
    <div className="space-y-4">
      <ModeSwitch
        id="anagram-mode"
        tool="anagram"
        label="Word list"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Game list: a compact public-domain word list commonly used for casual Scrabble and Words With Friends play. Full list: a broader English dictionary including archaic, technical, and proper-noun words."
      />
      <div>
        <label className="label" htmlFor="letters">Word or letters</label>
        <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. listen" autoFocus />
      </div>
      {/*
        Sorted-letter key helps spot anagram equivalence at a glance:
        LISTEN, SILENT, ENLIST, TINSEL, INLETS all sort to EILNST.
      */}
      {letters.replace(/\s/g, '').length > 0 && (() => {
        const clean = letters.replace(/\s/g, '').toUpperCase();
        const key = clean.split('').filter((c) => /[A-Z?]/.test(c)).sort().join('');
        const counts: Record<string, number> = {};
        for (const c of clean) counts[c] = (counts[c] ?? 0) + 1;
        const summary = Object.entries(counts).sort().map(([k, n]) => `${k}×${n}`).join(' ');
        return (
          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
            <span className="font-semibold text-slate-500">Sorted key:</span>{' '}
            <span className="font-mono">{key || '—'}</span>
            {summary && <span className="ml-3 text-slate-500">({summary})</span>}
          </div>
        );
      })()}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`btn ${exact ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900'}`} onClick={() => setExact(true)}>All letters</button>
        <button type="button" className={`btn ${!exact ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-900'}`} onClick={() => setExact(false)}>Any letters</button>
        <button type="button" className="btn-ghost ml-auto" onClick={() => setLetters('')} disabled={!letters}>Reset</button>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          checked={showScores} onChange={(e) => setShowScores(e.target.checked)} />
        <span>Show Scrabble + WWF scores</span>
      </label>
      {fellBack && phase === 'idle' && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
          No 3+ letter matches — showing 2-letter words instead.
        </p>
      )}
      {phase === 'idle' && results.length > 0 && (() => {
        const s = wordStats(results);
        const byLen = countByLengthTopN(s.byLength, 4);
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Found ${s.count.toLocaleString()} ${exact ? 'anagram' : 'match'}${s.count === 1 ? '' : 'es'}.` },
          {
            kind: 'stats',
            items: [
              ...(s.longest ? [{ label: 'Longest', value: s.longest.toUpperCase() }] : []),
              ...(s.shortest ? [{ label: 'Shortest', value: s.shortest.toUpperCase() }] : []),
              ...(s.bestScrabble ? [{ label: 'Best Scrabble', value: `${s.bestScrabble.word.toUpperCase()} (${s.bestScrabble.score})` }] : []),
              ...(s.bestWwf ? [{ label: 'Best WWF', value: `${s.bestWwf.word.toUpperCase()} (${s.bestWwf.score})` }] : []),
            ],
          },
          byLen.length > 0 && {
            kind: 'comparison' as const,
            title: 'Count by length',
            rows: byLen.map((b) => ({ label: `${b.len} letters`, value: b.count.toLocaleString() })),
          },
          s.bestScrabble && { kind: 'takeaway' as const, text: `Best scoring anagram: ${s.bestScrabble.word.toUpperCase()} at ${s.bestScrabble.score} Scrabble points.` },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/word-unscrambler/', label: 'Unscrambler (grouped)' },
              { href: '/word-tools/scrabble-helper/', label: 'Scrabble Helper' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
      <ResultList
        words={results}
        loading={phase !== 'idle'}
        group={showScores ? undefined : 'length'}
        scores={showScores}
        tool="anagram"
        loadingLabel={phase === 'loading' ? 'Loading word list…' : 'Searching…'}
        emptyLabel="Enter a word to see its anagrams."
      />
    </div>
  );
}

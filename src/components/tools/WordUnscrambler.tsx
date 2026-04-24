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

export default function WordUnscrambler() {
  const { send } = useWordWorker();
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.unscrambler', 'fast');
  const [showScores, setShowScores] = useToolBool('kefiw.scores.unscrambler', true);
  const [letters, setLetters] = useState('');
  const [minLen, setMinLen] = useState(3);
  const [results, setResults] = useState<string[]>([]);
  const [fellBack, setFellBack] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');
  const loadedSources = useRef(new Set<string>());

  useEffect(() => {
    const v = letters.trim();
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
      const { results } = await send<{ results: string[] }>('unscramble', { letters: v, minLen, dictSource: mode });
      if (results.length === 0 && minLen > 2) {
        const fallback = await send<{ results: string[] }>('unscramble', { letters: v, minLen: 2, dictSource: mode });
        setResults(fallback.results);
        setFellBack(fallback.results.length > 0);
      } else {
        setResults(results);
        setFellBack(false);
      }
      setPhase('idle');
    }, 120);
    return () => clearTimeout(t);
  }, [letters, minLen, mode, send]);

  return (
    <div className="space-y-4">
      <ModeSwitch
        id="unscrambler-mode"
        tool="unscrambler"
        label="Word list"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Game list: a compact public-domain word list commonly used for casual Scrabble and Words With Friends play. Full list: a broader English dictionary including archaic, technical, and proper-noun words."
      />
      <div>
        <label className="label" htmlFor="letters">Letters (use ? for blanks)</label>
        <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. TIENGL" autoFocus />
      </div>
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="label" htmlFor="min">Min length</label>
          <select id="min" className="input !w-auto" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))}>
            {[2,3,4,5,6,7].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <button type="button" onClick={() => setLetters('')} className="btn-ghost ml-auto" disabled={!letters}>Reset</button>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          checked={showScores} onChange={(e) => setShowScores(e.target.checked)} />
        <span>Show Scrabble + WWF scores</span>
      </label>
      {fellBack && phase === 'idle' && (
        <p className="rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
          No words found at {minLen}+ letters — showing 2-letter matches instead.
        </p>
      )}
      {phase === 'idle' && results.length > 0 && (() => {
        const s = wordStats(results);
        const byLen = countByLengthTopN(s.byLength, 4);
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Found ${s.count.toLocaleString()} word${s.count === 1 ? '' : 's'} from your letters.` },
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
          s.bestShort && { kind: 'takeaway' as const, text: `Best short play (≤4 letters): ${s.bestShort.word.toUpperCase()} for ${s.bestShort.score} Scrabble points.` },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/scrabble-helper/', label: 'Scrabble Helper' },
              { href: '/word-tools/words-with-friends-helper/', label: 'WWF Helper' },
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
        rack={letters}
        tool="unscrambler"
        loadingLabel={phase === 'loading' ? 'Loading word list…' : 'Searching…'}
        emptyLabel="Type some letters to begin."
      />
    </div>
  );
}

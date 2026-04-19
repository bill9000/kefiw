import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolBool, useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import ResultList from './ResultList';
import ModeSwitch from './ModeSwitch';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';
import { wordStats, countByLengthTopN } from '~/lib/outcomes';

type Mode = 'fast' | 'full';
type SearchBy = 'letters' | 'pattern';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'fast', label: 'Game list' },
  { value: 'full', label: 'Full list' },
];

const SEARCH_BY_OPTIONS: readonly { value: SearchBy; label: string }[] = [
  { value: 'letters', label: 'Letters' },
  { value: 'pattern', label: 'Pattern' },
];

interface WordFinderProps {
  lockedLength?: number;
}

export default function WordFinder({ lockedLength }: WordFinderProps = {}) {
  const { send } = useWordWorker();
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.word-finder', 'fast');
  const defaultSearchBy: SearchBy = lockedLength ? 'pattern' : 'letters';
  const [searchBy, setSearchBy] = useToolSetting<SearchBy>(
    lockedLength ? `kefiw.word-finder-${lockedLength}.searchBy` : 'kefiw.word-finder.searchBy',
    defaultSearchBy,
  );
  const [showScores, setShowScores] = useToolBool('kefiw.scores.word-finder', true);
  const [letters, setLetters] = useState(lockedLength ? '?'.repeat(lockedLength) : '');
  const [minLen, setMinLen] = useState(lockedLength ?? 2);
  const [maxLen, setMaxLen] = useState(lockedLength ?? 15);
  const [results, setResults] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');
  const loadedSources = useRef(new Set<string>());

  useEffect(() => {
    const v = letters.replace(/\s/g, '');
    if (!v) { setResults([]); setPhase('idle'); return; }
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
      if (searchBy === 'pattern') {
        const { results } = await send<{ results: string[] }>('pattern', { pattern: v, dictSource: mode });
        setResults(results);
      } else {
        const { results } = await send<{ results: string[] }>('unscramble', { letters: v, minLen, maxLen, dictSource: mode });
        setResults(results);
      }
      setPhase('idle');
    }, 120);
    return () => clearTimeout(t);
  }, [letters, minLen, maxLen, mode, searchBy, send]);

  return (
    <div className="space-y-4">
      <ModeSwitch
        id="word-finder-mode"
        tool="word-finder"
        label="Word list"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Game list: a compact public-domain word list commonly used for casual Scrabble and Words With Friends play. Full list: a broader English dictionary including archaic, technical, and proper-noun words."
      />
      <ModeSwitch
        id="word-finder-search-by"
        tool="word-finder-search-by"
        label="Search by"
        options={SEARCH_BY_OPTIONS}
        value={searchBy}
        onChange={setSearchBy}
        hint={searchBy === 'pattern'
          ? 'Pattern mode: type a fixed-length word shape using ? for any letter (e.g. c?t matches cat, cot, cut).'
          : 'Letters mode: find every word you can spell from the letters you have. Use ? as a blank tile.'}
      />
      {searchBy === 'pattern' ? (
        <div>
          <label className="label" htmlFor="letters">
            {lockedLength ? `${lockedLength}-letter pattern (use ? for any letter)` : 'Pattern (use ? for any letter)'}
          </label>
          <input
            id="letters"
            className="input font-mono"
            value={letters}
            onChange={(e) => {
              const v = e.target.value;
              setLetters(lockedLength ? v.slice(0, lockedLength) : v);
            }}
            placeholder={lockedLength ? '?'.repeat(lockedLength) : 'e.g. c?t'}
            maxLength={lockedLength}
            autoFocus
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="label" htmlFor="letters">
              {lockedLength ? `Letters (${lockedLength}-letter words only)` : 'Letters (use ? for blanks)'}
            </label>
            <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder={lockedLength ? 'e.g. RSTLN' : 'e.g. RSTLNE?'} autoFocus />
          </div>
          {!lockedLength && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-600">
              <label className="flex items-center gap-1.5">
                Min
                <select className="input !w-auto" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))}>
                  {[2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-1.5">
                Max
                <select className="input !w-auto" value={maxLen} onChange={(e) => setMaxLen(Number(e.target.value))}>
                  {[5,6,7,8,9,10,12,15].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </label>
            </div>
          )}
        </div>
      )}
      <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
          checked={showScores} onChange={(e) => setShowScores(e.target.checked)} />
        <span>Show Scrabble + WWF scores</span>
      </label>
      {phase === 'idle' && results.length > 0 && (() => {
        const s = wordStats(results);
        const byLen = countByLengthTopN(s.byLength, 4);
        const wildcards = searchBy === 'pattern' ? (letters.match(/\?/g)?.length ?? 0) : 0;
        const fixed = searchBy === 'pattern' ? letters.length - wildcards : 0;
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Found ${s.count.toLocaleString()} match${s.count === 1 ? '' : 'es'}${searchBy === 'pattern' ? ` for ${letters.toLowerCase()}` : ''}.` },
          {
            kind: 'stats',
            items: [
              { label: 'Mode', value: searchBy === 'pattern' ? 'Pattern' : 'Letters' },
              ...(s.longest ? [{ label: 'Longest', value: s.longest.toUpperCase() }] : []),
              ...(s.shortest ? [{ label: 'Shortest', value: s.shortest.toUpperCase() }] : []),
              ...(s.bestScrabble ? [{ label: 'Best Scrabble', value: `${s.bestScrabble.word.toUpperCase()} (${s.bestScrabble.score})` }] : []),
              ...(s.bestWwf ? [{ label: 'Best WWF', value: `${s.bestWwf.word.toUpperCase()} (${s.bestWwf.score})` }] : []),
              ...(searchBy === 'pattern' ? [
                { label: 'Wildcards', value: String(wildcards) },
                { label: 'Fixed chars', value: String(fixed) },
              ] : []),
            ],
          },
          byLen.length > 0 && {
            kind: 'comparison' as const,
            title: 'Count by length',
            rows: byLen.map((b) => ({ label: `${b.len} letters`, value: b.count.toLocaleString() })),
          },
          s.mostCommonLength ? { kind: 'takeaway' as const, text: `Most results are ${s.mostCommonLength}-letter words.` } : null,
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/words-starting-with/', label: 'Starting with' },
              { href: '/word-tools/words-ending-with/', label: 'Ending with' },
              { href: '/word-tools/words-containing/', label: 'Containing' },
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
        tool="word-finder"
        loadingLabel={phase === 'loading' ? 'Loading word list…' : 'Searching…'}
        emptyLabel="Type some letters to see words you can make."
      />
    </div>
  );
}

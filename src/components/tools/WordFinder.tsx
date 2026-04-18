import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolBool, useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import ResultList from './ResultList';
import DictToggle from './DictToggle';
import ModeSwitch from './ModeSwitch';

type Mode = 'fast' | 'full';
type SearchBy = 'letters' | 'pattern';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'fast', label: 'Fast' },
  { value: 'full', label: 'Full word list' },
];

const SEARCH_BY_OPTIONS: readonly { value: SearchBy; label: string }[] = [
  { value: 'letters', label: 'Letters' },
  { value: 'pattern', label: 'Pattern' },
];

export default function WordFinder() {
  const { send } = useWordWorker();
  const [dictEnabled, setDictEnabled] = useToolBool('kefiw.word-tools.dict-enabled', true);
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.word-finder', 'fast');
  const [searchBy, setSearchBy] = useToolSetting<SearchBy>('kefiw.word-finder.searchBy', 'letters');
  const [showScores, setShowScores] = useToolBool('kefiw.scores.word-finder', true);
  const [letters, setLetters] = useState('');
  const [minLen, setMinLen] = useState(2);
  const [maxLen, setMaxLen] = useState(15);
  const [results, setResults] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');
  const loadedSources = useRef(new Set<string>());

  useEffect(() => {
    if (!dictEnabled) { setResults([]); setPhase('idle'); return; }
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
  }, [letters, minLen, maxLen, mode, searchBy, dictEnabled, send]);

  return (
    <div className="space-y-4">
      <DictToggle enabled={dictEnabled} onChange={setDictEnabled} />
      <ModeSwitch
        id="word-finder-mode"
        tool="word-finder"
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Fast mode searches a smaller list for quicker results. Full word list checks more words and may take longer on first use."
      />
      {!dictEnabled ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Dictionary is off — enable it above to search.
        </div>
      ) : (
        <>
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
              <label className="label" htmlFor="letters">Pattern (use ? for any letter)</label>
              <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. c?t" autoFocus />
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
              <div>
                <label className="label" htmlFor="letters">Letters (use ? for blanks)</label>
                <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. RSTLNE?" autoFocus />
              </div>
              <div>
                <label className="label" htmlFor="min">Min</label>
                <select id="min" className="input" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))}>
                  {[2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="max">Max</label>
                <select id="max" className="input" value={maxLen} onChange={(e) => setMaxLen(Number(e.target.value))}>
                  {[5,6,7,8,9,10,12,15].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              checked={showScores} onChange={(e) => setShowScores(e.target.checked)} />
            <span>Show Scrabble + WWF scores</span>
          </label>
          <ResultList
            words={results}
            loading={phase !== 'idle'}
            group={showScores ? undefined : 'length'}
            scores={showScores}
            tool="word-finder"
            loadingLabel={phase === 'loading' ? 'Loading word list…' : 'Searching…'}
            emptyLabel="Type some letters to see words you can make."
          />
        </>
      )}
    </div>
  );
}

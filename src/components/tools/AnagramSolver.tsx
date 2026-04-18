import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolBool, useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import ResultList from './ResultList';
import DictToggle from './DictToggle';
import ModeSwitch from './ModeSwitch';

type Mode = 'fast' | 'full';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'fast', label: 'Fast' },
  { value: 'full', label: 'Full word list' },
];

export default function AnagramSolver() {
  const { send } = useWordWorker();
  const [dictEnabled, setDictEnabled] = useToolBool('kefiw.word-tools.dict-enabled', true);
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.anagram', 'fast');
  const [showScores, setShowScores] = useToolBool('kefiw.scores.anagram', true);
  const [letters, setLetters] = useState('');
  const [exact, setExact] = useState(true);
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
      const { results } = await send<{ results: string[] }>('anagrams', { letters: v, exact, dictSource: mode });
      setResults(results);
      setPhase('idle');
    }, 100);
    return () => clearTimeout(t);
  }, [letters, exact, mode, dictEnabled, send]);

  return (
    <div className="space-y-4">
      <DictToggle enabled={dictEnabled} onChange={setDictEnabled} />
      <ModeSwitch
        id="anagram-mode"
        tool="anagram"
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
          <div>
            <label className="label" htmlFor="letters">Word or letters</label>
            <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. listen" autoFocus />
          </div>
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
          <ResultList
            words={results}
            loading={phase !== 'idle'}
            group={showScores ? undefined : 'length'}
            scores={showScores}
            tool="anagram"
            loadingLabel={phase === 'loading' ? 'Loading word list…' : 'Searching…'}
            emptyLabel="Enter a word to see its anagrams."
          />
        </>
      )}
    </div>
  );
}

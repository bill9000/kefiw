import { useEffect, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolBool, useToolSetting } from './useToolSettings';
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
  const [letters, setLetters] = useState('');
  const [exact, setExact] = useState(true);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [everLoaded, setEverLoaded] = useState(false);

  useEffect(() => {
    if (!dictEnabled) { setResults([]); setLoading(false); return; }
    const v = letters.replace(/\s/g, '');
    if (!v) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const { results } = await send<{ results: string[] }>('anagrams', { letters: v, exact, dictSource: mode });
      setResults(results);
      setLoading(false);
      setEverLoaded(true);
    }, 100);
    return () => clearTimeout(t);
  }, [letters, exact, mode, dictEnabled, send]);

  return (
    <div className="space-y-4">
      <DictToggle enabled={dictEnabled} onChange={setDictEnabled} />
      <ModeSwitch
        id="anagram-mode"
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Fast uses a ~173k-word list. Full word list uses all ~370k words for rarer matches."
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
          <ResultList
            words={results}
            loading={loading}
            group="length"
            loadingLabel={!everLoaded ? 'Loading word list…' : 'Searching…'}
            emptyLabel="Enter a word to see its anagrams."
          />
        </>
      )}
    </div>
  );
}

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

export default function WordUnscrambler() {
  const { send } = useWordWorker();
  const [dictEnabled, setDictEnabled] = useToolBool('kefiw.word-tools.dict-enabled', true);
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.unscrambler', 'fast');
  const [letters, setLetters] = useState('');
  const [minLen, setMinLen] = useState(2);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [everLoaded, setEverLoaded] = useState(false);

  useEffect(() => {
    if (!dictEnabled) { setResults([]); setLoading(false); return; }
    const v = letters.trim();
    if (!v) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const { results } = await send<{ results: string[] }>('unscramble', { letters: v, minLen, dictSource: mode });
      setResults(results);
      setLoading(false);
      setEverLoaded(true);
    }, 120);
    return () => clearTimeout(t);
  }, [letters, minLen, mode, dictEnabled, send]);

  return (
    <div className="space-y-4">
      <DictToggle enabled={dictEnabled} onChange={setDictEnabled} />
      <ModeSwitch
        id="unscrambler-mode"
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Fast searches a ~173k-word list. Full word list searches all ~370k words."
      />
      {!dictEnabled ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Dictionary is off — enable it above to search.
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div>
              <label className="label" htmlFor="letters">Letters (use ? for blanks)</label>
              <input id="letters" className="input font-mono" value={letters} onChange={(e) => setLetters(e.target.value)} placeholder="e.g. TIENGL" autoFocus />
            </div>
            <div>
              <label className="label" htmlFor="min">Min length</label>
              <select id="min" className="input" value={minLen} onChange={(e) => setMinLen(Number(e.target.value))}>
                {[2,3,4,5,6,7].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button type="button" onClick={() => setLetters('')} className="btn-ghost w-full sm:w-auto" disabled={!letters}>Reset</button>
            </div>
          </div>
          <ResultList
            words={results}
            loading={loading}
            group="length"
            loadingLabel={!everLoaded ? 'Loading word list…' : 'Searching…'}
            emptyLabel="Type some letters to begin."
          />
        </>
      )}
    </div>
  );
}

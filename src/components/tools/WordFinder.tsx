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

export default function WordFinder() {
  const { send } = useWordWorker();
  const [dictEnabled, setDictEnabled] = useToolBool('kefiw.word-tools.dict-enabled', true);
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.word-finder', 'fast');
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
      const { results } = await send<{ results: string[] }>('unscramble', { letters: v, minLen, maxLen, dictSource: mode });
      setResults(results);
      setPhase('idle');
    }, 120);
    return () => clearTimeout(t);
  }, [letters, minLen, maxLen, mode, dictEnabled, send]);

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
          <ResultList
            words={results}
            loading={phase !== 'idle'}
            group="length"
            tool="word-finder"
            loadingLabel={phase === 'loading' ? 'Loading word list…' : 'Searching…'}
            emptyLabel="Type some letters to see words you can make."
          />
        </>
      )}
    </div>
  );
}

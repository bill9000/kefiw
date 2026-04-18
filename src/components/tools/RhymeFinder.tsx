import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolBool, useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import CopyButton from '../CopyButton';
import DictToggle from './DictToggle';
import ModeSwitch from './ModeSwitch';

type Mode = 'quick' | 'extended';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'quick', label: 'Quick' },
  { value: 'extended', label: 'Extended' },
];

export default function RhymeFinder() {
  const { send } = useWordWorker();
  const [dictEnabled, setDictEnabled] = useToolBool('kefiw.word-tools.dict-enabled', true);
  const [mode, setMode] = useToolSetting<Mode>('kefiw.mode.rhymes', 'quick');
  const [word, setWord] = useState('');
  const [data, setData] = useState<{ perfect: string[]; near: string[] }>({ perfect: [], near: [] });
  const [loading, setLoading] = useState(false);
  const [everLoaded, setEverLoaded] = useState(false);
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (!dictEnabled) { setData({ perfect: [], near: [] }); setLoading(false); return; }
    const v = word.trim().toLowerCase().replace(/[^a-z]/g, '');
    if (!v) { setData({ perfect: [], near: [] }); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const t0 = performance.now();
      const res = await send<{ perfect: string[]; near: string[] }>('rhymes', { word: v, dictSource: 'full' });
      if (!loadedOnce.current) {
        loadedOnce.current = true;
        track('dict_loaded', { source: 'full', ms: Math.round(performance.now() - t0) });
      }
      setData(res);
      setLoading(false);
      setEverLoaded(true);
    }, 160);
    return () => clearTimeout(t);
  }, [word, dictEnabled, send]);

  return (
    <div className="space-y-4">
      <DictToggle enabled={dictEnabled} onChange={setDictEnabled} />
      <ModeSwitch
        id="rhymes-mode"
        tool="rhymes"
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Quick mode gives instant estimates. Extended uses more data when available."
      />
      {!dictEnabled ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Dictionary is off — enable it above to search.
        </div>
      ) : (
        <>
          <div>
            <label className="label" htmlFor="w">Word</label>
            <input id="w" className="input font-mono" value={word} onChange={(e) => setWord(e.target.value)} placeholder="e.g. time" autoFocus />
          </div>
          {loading && <div className="text-sm text-slate-500">{everLoaded ? 'Searching rhymes…' : 'Loading word list…'}</div>}
          {!loading && (data.perfect.length > 0 || data.near.length > 0) && (
            <>
              <RhymeBlock title="Perfect rhymes" words={data.perfect} />
              {mode === 'extended' && <RhymeBlock title="Near rhymes" words={data.near} />}
            </>
          )}
          <p className="text-xs text-slate-500">Rhymes are computed by trailing-letter match. For a full phonetic dictionary, a CMU-style engine is planned.</p>
        </>
      )}
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
        {words.map((w) => <span key={w} className="chip">{w}</span>)}
      </div>
    </div>
  );
}

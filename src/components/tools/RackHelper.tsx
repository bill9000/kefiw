import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolBool, useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import CopyButton from '../CopyButton';
import DictToggle from './DictToggle';
import ModeSwitch from './ModeSwitch';

interface Props { valueSet: 'scrabble' | 'wwf'; }

type Mode = 'basic' | 'scored';

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'scored', label: 'Scored' },
];

export default function RackHelper({ valueSet }: Props) {
  const { send } = useWordWorker();
  const storageKey = valueSet === 'wwf' ? 'kefiw.mode.wwf' : 'kefiw.mode.scrabble';
  const [dictEnabled, setDictEnabled] = useToolBool('kefiw.word-tools.dict-enabled', true);
  const [mode, setMode] = useToolSetting<Mode>(storageKey, 'scored');
  const [rack, setRack] = useState('');
  const [boardLetter, setBoardLetter] = useState('');
  const [results, setResults] = useState<Array<{ word: string; score: number }>>([]);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');
  const loadedOnce = useRef(false);

  useEffect(() => {
    if (!dictEnabled) { setResults([]); setPhase('idle'); return; }
    const v = rack.trim().toLowerCase().replace(/[^a-z?]/g, '').slice(0, 9);
    const bl = boardLetter.trim().toLowerCase().replace(/[^a-z]/g, '').slice(0, 1);
    if (!v) { setResults([]); setPhase('idle'); return; }
    const firstTime = !loadedOnce.current;
    setPhase(firstTime ? 'loading' : 'searching');
    const t = setTimeout(async () => {
      const t0 = performance.now();
      if (firstTime) {
        await send('ready', { dictSource: 'fast' });
        loadedOnce.current = true;
        track('dict_loaded', { source: 'fast', ms: Math.round(performance.now() - t0) });
        setPhase('searching');
      }
      const { results } = await send<{ results: Array<{ word: string; score: number }> }>('rack', { rack: v, valueSet, limit: 300, dictSource: 'fast', boardLetter: bl });
      setResults(results);
      setPhase('idle');
    }, 140);
    return () => clearTimeout(t);
  }, [rack, boardLetter, valueSet, dictEnabled, send]);

  const displayed = mode === 'basic'
    ? [...results].sort((a, b) => a.word.localeCompare(b.word))
    : results;

  return (
    <div className="space-y-4">
      <DictToggle enabled={dictEnabled} onChange={setDictEnabled} />
      <ModeSwitch
        id={`${valueSet}-mode`}
        tool={valueSet}
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Basic shows playable results. Scored ranks them by points."
      />
      {!dictEnabled ? (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Dictionary is off — enable it above to search.
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div>
              <label className="label" htmlFor="rack">Your tiles (use ? for blanks)</label>
              <input id="rack" className="input font-mono uppercase tracking-widest"
                value={rack} onChange={(e) => setRack(e.target.value.toUpperCase())}
                placeholder="e.g. RSTLNE?" maxLength={9} autoFocus />
            </div>
            <div>
              <label className="label" htmlFor="board-letter">Plays through</label>
              <input id="board-letter" className="input font-mono uppercase tracking-widest w-16 text-center"
                value={boardLetter} onChange={(e) => setBoardLetter(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1))}
                placeholder="—" maxLength={1} />
            </div>
            <div className="flex items-end">
              <button type="button" onClick={() => { setRack(''); setBoardLetter(''); }} className="btn-ghost w-full sm:w-auto" disabled={!rack && !boardLetter}>Reset</button>
            </div>
          </div>
          <p className="-mt-2 text-xs text-slate-500">Optional: enter a single board letter your word must play through. Leave blank to find any rack play.</p>
          {phase !== 'idle' && <div className="text-sm text-slate-500">{phase === 'loading' ? 'Loading word list…' : 'Searching…'}</div>}
          {phase === 'idle' && displayed.length === 0 && <div className="text-sm text-slate-500">Enter your tiles to see playable words.</div>}
          {phase === 'idle' && displayed.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-sm text-slate-600">{displayed.length} plays found</div>
                <CopyButton
                  value={displayed.map((r) => mode === 'scored' ? `${r.word} (${r.score})` : r.word).join('\n')}
                  label="Copy all"
                  tool={valueSet}
                />
              </div>
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="w-full min-w-[20rem] text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-2">Word</th>
                      <th className="p-2">Length</th>
                      {mode === 'scored' && <th className="p-2 text-right">Score</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayed.map((r) => (
                      <tr key={r.word} className="hover:bg-slate-50">
                        <td className="p-2 font-mono">{r.word}</td>
                        <td className="p-2 text-slate-600">{r.word.length}</td>
                        {mode === 'scored' && <td className="p-2 text-right font-semibold">{r.score}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

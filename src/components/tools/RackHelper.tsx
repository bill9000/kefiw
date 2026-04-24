import { useEffect, useRef, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import { useToolSetting } from './useToolSettings';
import { track } from '~/lib/analytics';
import CopyButton from '../CopyButton';
import ModeSwitch from './ModeSwitch';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

interface Props { valueSet: 'scrabble' | 'wwf'; }

type Mode = 'basic' | 'scored';

// Render a word with blank-tile positions shown differently (lowercase, muted,
// dotted underline) so users can see which letter was produced by a `?` blank.
function renderWordWithBlanks(word: string, blankPositions?: number[]) {
  if (!blankPositions || blankPositions.length === 0) return word;
  const set = new Set(blankPositions);
  return (
    <span>
      {Array.from(word).map((ch, i) =>
        set.has(i) ? (
          <span
            key={i}
            className="text-slate-500 lowercase underline decoration-dotted decoration-slate-400"
            title="Blank tile — scores 0"
          >
            {ch.toLowerCase()}
          </span>
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  );
}

// Produce a text representation of the word with blank-position lowercased for copy output.
function formatWordForCopy(word: string, blankPositions?: number[]): string {
  if (!blankPositions || blankPositions.length === 0) return word;
  const set = new Set(blankPositions);
  return Array.from(word)
    .map((ch, i) => (set.has(i) ? ch.toLowerCase() : ch))
    .join('');
}

const MODE_OPTIONS: readonly { value: Mode; label: string }[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'scored', label: 'Scored' },
];

export default function RackHelper({ valueSet }: Props) {
  const { send } = useWordWorker();
  const storageKey = valueSet === 'wwf' ? 'kefiw.mode.wwf' : 'kefiw.mode.scrabble';
  const [mode, setMode] = useToolSetting<Mode>(storageKey, 'scored');
  const [rack, setRack] = useState('');
  const [boardLetter, setBoardLetter] = useState('');
  const [results, setResults] = useState<Array<{ word: string; score: number; blankPositions?: number[] }>>([]);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');
  const loadedOnce = useRef(false);

  useEffect(() => {
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
      const { results } = await send<{ results: Array<{ word: string; score: number; blankPositions?: number[] }> }>('rack', { rack: v, valueSet, limit: 300, dictSource: 'fast', boardLetter: bl });
      setResults(results);
      setPhase('idle');
    }, 140);
    return () => clearTimeout(t);
  }, [rack, boardLetter, valueSet, send]);

  const displayed = mode === 'basic'
    ? [...results].sort((a, b) => a.word.localeCompare(b.word))
    : results;

  return (
    <div className="space-y-4">
      <ModeSwitch
        id={`${valueSet}-mode`}
        tool={valueSet}
        label="Mode"
        options={MODE_OPTIONS}
        value={mode}
        onChange={setMode}
        hint="Basic shows playable results. Scored ranks them by points."
      />
      <div className="space-y-3">
        <div>
          <label className="label" htmlFor="rack">Your tiles (use ? for blanks)</label>
          <input id="rack" className="input font-mono uppercase tracking-widest"
            value={rack} onChange={(e) => setRack(e.target.value.toUpperCase())}
            placeholder="e.g. RSTLNE?" maxLength={9} autoFocus />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Plays through
            <input id="board-letter" className="input font-mono uppercase tracking-widest !w-14 text-center"
              value={boardLetter} onChange={(e) => setBoardLetter(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1))}
              placeholder="—" maxLength={1} />
          </label>
          <button type="button" onClick={() => { setRack(''); setBoardLetter(''); }} className="btn-ghost ml-auto" disabled={!rack && !boardLetter}>Reset</button>
        </div>
      </div>
      <p className="-mt-2 text-xs text-slate-500">Optional: enter a single board letter your word must play through. Leave blank to find any rack play.</p>
      {phase !== 'idle' && <div className="text-sm text-slate-500">{phase === 'loading' ? 'Loading word list…' : 'Searching…'}</div>}
      {phase === 'idle' && displayed.length === 0 && <div className="text-sm text-slate-500">Enter your tiles to see playable words.</div>}
      {phase === 'idle' && displayed.length > 0 && (() => {
        const sorted = [...displayed].sort((a, b) => b.score - a.score);
        const best = sorted[0];
        const second = sorted[1];
        const gap = second ? best.score - second.score : null;
        const bingoThreshold = valueSet === 'wwf' ? 35 : 50;
        const bingos = displayed.filter((r) => r.word.length === 7).length;
        const bestShort = displayed.filter((r) => r.word.length <= 4).reduce<typeof best | null>((a, b) => (!a || b.score > a.score ? b : a), null);
        const bestLong = displayed.filter((r) => r.word.length >= 5).reduce<typeof best | null>((a, b) => (!a || b.score > a.score ? b : a), null);
        const bl = boardLetter.trim().toUpperCase();
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `Best play: ${best.word.toUpperCase()} for ${best.score} pts.` },
          {
            kind: 'stats',
            items: [
              { label: 'Plays', value: String(displayed.length) },
              ...(second ? [{ label: 'Second best', value: `${second.word.toUpperCase()} (${second.score})` }] : []),
              ...(gap !== null ? [{ label: 'Score gap', value: `${gap}` }] : []),
              { label: 'Bingos', value: String(bingos) },
              ...(bestShort ? [{ label: 'Best short (≤4)', value: `${bestShort.word.toUpperCase()} (${bestShort.score})` }] : []),
              ...(bestLong ? [{ label: 'Best long (≥5)', value: `${bestLong.word.toUpperCase()} (${bestLong.score})` }] : []),
            ],
          },
          bingos > 0 && { kind: 'takeaway' as const, text: `${bingos} bingo candidate${bingos === 1 ? '' : 's'} (+${bingoThreshold} using all 7 tiles).` },
          bl ? { kind: 'takeaway' as const, text: `Plays must contain the board letter "${bl}".` } : null,
          {
            kind: 'nextStep',
            actions: [
              valueSet === 'wwf'
                ? { href: '/word-tools/scrabble-helper/', label: 'Scrabble Helper' }
                : { href: '/word-tools/words-with-friends-helper/', label: 'WWF Helper' },
              { href: '/word-tools/word-unscrambler/', label: 'Unscrambler' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
      {phase === 'idle' && displayed.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm text-slate-600">{displayed.length} plays found</div>
            <CopyButton
              value={displayed
                .map((r) => {
                  const w = formatWordForCopy(r.word, r.blankPositions);
                  return mode === 'scored' ? `${w} (${r.score})` : w;
                })
                .join('\n')}
              label="Copy all"
              tool={valueSet}
            />
          </div>
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
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
                    <td className="p-2 font-mono">{renderWordWithBlanks(r.word, r.blankPositions)}</td>
                    <td className="p-2 text-slate-600">{r.word.length}</td>
                    {mode === 'scored' && <td className="p-2 text-right font-semibold">{r.score}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

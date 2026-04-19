import { useEffect, useMemo, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import ResultList from './ResultList';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';
import { wordStats } from '~/lib/outcomes';

type Slot = { letter: string; kind: 'green' | 'yellow' | 'empty' };

function emptySlots(): Slot[] {
  return Array.from({ length: 5 }, () => ({ letter: '', kind: 'empty' as const }));
}

export default function WordleSolver() {
  const { send } = useWordWorker();
  const [slots, setSlots] = useState<Slot[]>(emptySlots);
  const [excluded, setExcluded] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');

  const greenPattern = useMemo(() => {
    return slots.map((s) => (s.kind === 'green' && s.letter ? s.letter.toLowerCase() : '?')).join('');
  }, [slots]);

  const yellowReqs = useMemo(() => {
    return slots
      .map((s, i) => (s.kind === 'yellow' && s.letter ? { letter: s.letter.toLowerCase(), notAt: i } : null))
      .filter((x): x is { letter: string; notAt: number } => x !== null);
  }, [slots]);

  const excludedSet = useMemo(() => {
    const greens = new Set(slots.filter((s) => s.kind === 'green').map((s) => s.letter.toLowerCase()));
    const yellows = new Set(slots.filter((s) => s.kind === 'yellow').map((s) => s.letter.toLowerCase()));
    return excluded
      .toLowerCase()
      .replace(/[^a-z]/g, '')
      .split('')
      .filter((c) => !greens.has(c) && !yellows.has(c));
  }, [excluded, slots]);

  useEffect(() => {
    setPhase('loading');
    (async () => {
      const { results: pat } = await send<{ results: string[] }>('pattern', {
        pattern: greenPattern,
        dictSource: 'fast',
      });
      const excludedArr = excludedSet;
      const filtered = pat.filter((w) => {
        for (const { letter, notAt } of yellowReqs) {
          if (!w.includes(letter)) return false;
          if (w[notAt] === letter) return false;
        }
        for (const ex of excludedArr) {
          if (w.includes(ex)) return false;
        }
        return true;
      });
      setResults(filtered);
      setPhase('idle');
    })();
  }, [greenPattern, yellowReqs, excludedSet, send]);

  function updateSlot(i: number, updater: (s: Slot) => Slot) {
    setSlots((cur) => cur.map((s, idx) => (idx === i ? updater(s) : s)));
  }

  function cycleSlot(i: number) {
    updateSlot(i, (s) => {
      if (!s.letter) return s;
      const next: Record<Slot['kind'], Slot['kind']> = { empty: 'green', green: 'yellow', yellow: 'empty' };
      return { ...s, kind: next[s.kind] };
    });
  }

  function setLetter(i: number, letter: string) {
    const clean = letter.toLowerCase().replace(/[^a-z]/g, '').slice(-1);
    updateSlot(i, (s) => ({ letter: clean, kind: clean ? (s.kind === 'empty' ? 'green' : s.kind) : 'empty' }));
  }

  function reset() {
    setSlots(emptySlots());
    setExcluded('');
  }

  const slotStyle = (kind: Slot['kind']) => {
    if (kind === 'green') return 'bg-emerald-500 text-white border-emerald-600';
    if (kind === 'yellow') return 'bg-amber-400 text-slate-900 border-amber-500';
    return 'bg-white text-slate-900 border-slate-300';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Guessed row (tap to cycle: empty → green → yellow → empty)</label>
        <div className="flex gap-2">
          {slots.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <input
                type="text"
                maxLength={1}
                value={s.letter.toUpperCase()}
                onChange={(e) => setLetter(i, e.target.value)}
                className={`h-14 w-14 rounded-md border-2 text-center font-mono text-2xl font-bold uppercase transition ${slotStyle(s.kind)}`}
                aria-label={`Letter ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => cycleSlot(i)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                {s.kind === 'green' ? 'in place' : s.kind === 'yellow' ? 'wrong spot' : 'not set'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="excluded">Gray letters (wrong letters)</label>
        <input
          id="excluded"
          className="input font-mono"
          value={excluded}
          onChange={(e) => setExcluded(e.target.value)}
          placeholder="e.g. AEIO"
        />
        <p className="mt-1 text-xs text-slate-500">Letters known to be not in the word. Green and yellow letters are auto-excluded from this.</p>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={reset} className="btn-ghost">Reset</button>
      </div>

      {phase === 'idle' && results.length > 0 && (() => {
        const s = wordStats(results);
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `${results.length.toLocaleString()} candidate${results.length === 1 ? '' : 's'} match your constraints.` },
          {
            kind: 'stats',
            items: [
              { label: 'Candidates', value: results.length.toLocaleString() },
              ...(s.bestScrabble ? [{ label: 'Highest scoring', value: `${s.bestScrabble.word.toUpperCase()} (${s.bestScrabble.score})` }] : []),
              { label: 'Greens', value: String(slots.filter((x) => x.kind === 'green').length) },
              { label: 'Yellows', value: String(slots.filter((x) => x.kind === 'yellow').length) },
            ],
          },
          results.length === 1
            ? { kind: 'takeaway' as const, text: `Only one word fits — play "${results[0].toUpperCase()}".` }
            : results.length <= 5
              ? { kind: 'takeaway' as const, text: `Fewer than 6 candidates — pick a word that tests letters you have not ruled in or out.` }
              : { kind: 'takeaway' as const, text: `Many candidates — guess a word that eliminates common letters like A, E, S, R, T, L.` },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/5-letter-word-finder/', label: '5-Letter Finder' },
              { href: '/word-tools/anagram-solver/', label: 'Anagram Solver' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}

      <ResultList
        words={results}
        loading={phase !== 'idle'}
        scores={false}
        tool="wordle-solver"
        loadingLabel="Searching…"
        emptyLabel="Enter greens, yellows, and grays above to narrow candidates."
      />
    </div>
  );
}

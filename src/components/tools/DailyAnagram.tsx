import { useEffect, useMemo, useState } from 'react';
import { DAILY_5, DAILY_6, DAILY_7, daySeedUTC, pickDaily, scrambleWord } from '~/lib/daily-words';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

interface DailyAnagramProps {
  length?: 5 | 6 | 7;
  storageNamespace?: string;
  variantLabel?: string;
}

interface DailyState {
  date: string;
  solved: boolean;
  attempts: number;
  hintsUsed: number;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export default function DailyAnagram({ length = 5, storageNamespace = 'daily-anagram', variantLabel = 'Daily Anagram' }: DailyAnagramProps = {}) {
  const pool = length === 5 ? DAILY_5 : length === 6 ? DAILY_6 : DAILY_7;
  const seed = daySeedUTC();
  const answer = useMemo(() => pickDaily(pool, seed + length).toUpperCase(), [pool, seed, length]);
  const scrambled = useMemo(() => scrambleWord(answer, seed + length * 7), [answer, seed, length]);

  const storageKey = `kefiw.${storageNamespace}.${length}.${todayKey()}`;
  const [guess, setGuess] = useState('');
  const [state, setState] = useState<DailyState>({ date: todayKey(), solved: false, attempts: 0, hintsUsed: 0 });
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try { setState(JSON.parse(raw) as DailyState); } catch {}
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
    }
  }, [state, storageKey]);

  const submit = () => {
    if (state.solved) return;
    const g = guess.trim().toUpperCase();
    if (g.length !== length) return;
    setState((prev) => {
      const solved = g === answer;
      return { ...prev, attempts: prev.attempts + 1, solved };
    });
  };

  const hintLetter = state.hintsUsed < answer.length ? answer[state.hintsUsed] : null;

  return (
    <div className="space-y-4">
      <div className="card text-center">
        <div className="text-sm text-slate-500">Today's puzzle · {variantLabel}</div>
        <div className="mt-2 text-4xl font-bold tracking-widest">
          {scrambled.split('').map((c, i) => (
            <span key={i} className="mx-1 inline-block rounded bg-slate-100 px-2 py-1">{c}</span>
          ))}
        </div>
        <div className="mt-2 text-xs text-slate-500">Unscramble to form a valid English word.</div>
      </div>

      {!state.solved && (
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            maxLength={length}
            className="input text-center text-xl uppercase tracking-widest"
            value={guess}
            onChange={(e) => setGuess(e.target.value.replace(/[^A-Za-z]/g, ''))}
            onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
            placeholder={'?'.repeat(length)}
            autoFocus
          />
          <button className="btn btn-primary" onClick={submit} disabled={guess.trim().length !== length}>Guess</button>
        </div>
      )}

      {state.solved && (
        <div className="card border-emerald-200 bg-emerald-50 text-center">
          <div className="text-sm text-emerald-700">Solved</div>
          <div className="text-2xl font-bold text-emerald-900">{answer}</div>
          <div className="text-xs text-emerald-700">In {state.attempts} attempt{state.attempts === 1 ? '' : 's'}. Come back tomorrow for a new puzzle.</div>
        </div>
      )}

      {!state.solved && state.attempts > 0 && (
        <div className="card text-sm text-slate-600">
          <span className="font-semibold">Not quite.</span> {state.attempts} attempt{state.attempts === 1 ? '' : 's'} so far.
        </div>
      )}

      {!state.solved && (
        <div className="flex flex-wrap gap-2">
          <button
            className="btn-ghost"
            onClick={() => {
              setShowHint(true);
              setState((p) => ({ ...p, hintsUsed: Math.min(p.hintsUsed + 1, answer.length) }));
            }}
          >Reveal a letter</button>
          {showHint && hintLetter && (
            <span className="rounded bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
              Position {state.hintsUsed}: {answer.slice(0, state.hintsUsed)}
            </span>
          )}
        </div>
      )}

      {(() => {
        const cards: MaybeCard[] = [
          state.solved ? {
            kind: 'summary' as const,
            text: `You solved today's ${length}-letter anagram in ${state.attempts} attempt${state.attempts === 1 ? '' : 's'}.`,
          } : null,
          {
            kind: 'stats',
            items: [
              { label: 'Letters', value: String(length) },
              { label: 'Attempts', value: String(state.attempts) },
              { label: 'Hints used', value: String(state.hintsUsed) },
              { label: 'Date', value: todayKey() },
            ],
          },
          {
            kind: 'takeaway',
            text: 'Start with the vowels — locating them narrows word shapes fast. Then try common suffixes like -ING, -TION, -ER.',
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/word-unscrambler/', label: 'Word unscrambler' },
              { href: '/word-tools/anagram-solver/', label: 'Anagram solver' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

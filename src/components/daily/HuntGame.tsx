import { useEffect, useMemo, useState } from 'react';
import { getDailyDate, getDayOfYear } from '~/lib/daily-day';
import { getHuntWord } from '~/data/daily-hunt-words';
import { loadDict } from '~/lib/daily-dict';
import {
  getProgress,
  saveProgress,
  recordResult,
  type HuntProgress,
} from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';

const MAX_GUESSES = 6;
const WORD_LEN = 5;

type LetterState = 'correct' | 'present' | 'absent' | 'empty' | 'tbd';

function scoreGuess(guess: string, target: string): LetterState[] {
  const result: LetterState[] = new Array(WORD_LEN).fill('absent');
  const remaining: Record<string, number> = {};
  for (let i = 0; i < WORD_LEN; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct';
    } else {
      remaining[target[i]] = (remaining[target[i]] ?? 0) + 1;
    }
  }
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === 'correct') continue;
    const ch = guess[i];
    if ((remaining[ch] ?? 0) > 0) {
      result[i] = 'present';
      remaining[ch]--;
    }
  }
  return result;
}

export default function HuntGame() {
  const [dailyDate, setDailyDate] = useState('');
  const [target, setTarget] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [dict, setDict] = useState<Set<string> | null>(null);
  const [dictError, setDictError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const word = getHuntWord(getDayOfYear(d));
    setTarget(word);
    const saved = getProgress<HuntProgress>(d, 'hunt');
    if (saved) {
      setGuesses(saved.guesses);
      setFinished(saved.finished);
    }
    loadDict()
      .then((s) => setDict(s))
      .catch((e) => setDictError(String(e)));
  }, []);

  const solved = guesses.some((g) => g === target);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (finished) return;
      if (e.key === 'Enter') {
        submit();
      } else if (e.key === 'Backspace') {
        setCurrent((c) => c.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && current.length < WORD_LEN) {
        setCurrent((c) => (c + e.key.toUpperCase()).slice(0, WORD_LEN));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function submit() {
    if (current.length !== WORD_LEN) {
      setMessage(`Need ${WORD_LEN} letters`);
      return;
    }
    if (dict && !dict.has(current)) {
      setMessage('Not in dictionary');
      return;
    }
    const next = [...guesses, current];
    const won = current === target;
    const done = won || next.length >= MAX_GUESSES;
    setGuesses(next);
    setCurrent('');
    setMessage(won ? 'Solved!' : done ? `The word was ${target}` : null);
    const progress: HuntProgress = { guesses: next, finished: done };
    saveProgress(dailyDate, 'hunt', progress);
    if (done) {
      setFinished(true);
      const result = {
        gameId: 'hunt' as const,
        guesses: next.length,
        solved: won,
      };
      recordResult(dailyDate, result);
      void submitDailyScore(dailyDate, result);
    }
  }

  function letterStates(): Record<string, LetterState> {
    const map: Record<string, LetterState> = {};
    for (const guess of guesses) {
      const states = scoreGuess(guess, target);
      for (let i = 0; i < WORD_LEN; i++) {
        const ch = guess[i];
        const s = states[i];
        const prev = map[ch];
        if (s === 'correct') map[ch] = 'correct';
        else if (s === 'present' && prev !== 'correct') map[ch] = 'present';
        else if (!prev) map[ch] = s;
      }
    }
    return map;
  }

  const keyStates = useMemo(() => letterStates(), [guesses, target]);
  const rows = Array.from({ length: MAX_GUESSES });

  function press(k: string) {
    if (finished) return;
    if (k === 'Enter') submit();
    else if (k === 'Back') setCurrent((c) => c.slice(0, -1));
    else if (current.length < WORD_LEN) setCurrent((c) => (c + k).slice(0, WORD_LEN));
  }

  return (
    <div className="mx-auto max-w-md">
      {dictError && (
        <div className="mb-3 rounded border border-rose-300 bg-rose-50 p-2 text-xs text-rose-800">
          Dictionary failed to load. Guesses still work but aren't validated.
        </div>
      )}
      {message && (
        <div className="mb-3 rounded border border-slate-300 bg-slate-50 p-2 text-center text-sm text-slate-800">
          {message}
        </div>
      )}
      <div className="grid grid-rows-6 gap-1.5" aria-label="Guess grid">
        {rows.map((_, r) => {
          const guess = guesses[r];
          const isCurrent = r === guesses.length && !finished;
          const letters = guess
            ? guess.split('')
            : isCurrent
            ? (current + '     ').slice(0, WORD_LEN).split('')
            : ['', '', '', '', ''];
          const states = guess ? scoreGuess(guess, target) : new Array(WORD_LEN).fill('empty');
          return (
            <div key={r} className="grid grid-cols-5 gap-1.5">
              {letters.map((ch, i) => {
                const trimmed = ch.trim();
                const state = states[i];
                const cls =
                  state === 'correct'
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : state === 'present'
                    ? 'bg-amber-400 text-white border-amber-500'
                    : state === 'absent'
                    ? 'bg-slate-500 text-white border-slate-600'
                    : trimmed
                    ? 'bg-white border-slate-400'
                    : 'bg-white border-slate-200';
                return (
                  <div
                    key={i}
                    className={`flex aspect-square items-center justify-center rounded border-2 text-2xl font-bold ${cls}`}
                  >
                    {trimmed}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-5 space-y-1.5">
        {['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'].map((row, ri) => (
          <div key={ri} className="flex justify-center gap-1">
            {ri === 2 && (
              <button
                onClick={() => press('Enter')}
                className="rounded bg-slate-700 px-2 py-3 text-xs font-semibold text-white"
              >
                ENTER
              </button>
            )}
            {row.split('').map((k) => {
              const s = keyStates[k];
              const cls =
                s === 'correct'
                  ? 'bg-emerald-600 text-white'
                  : s === 'present'
                  ? 'bg-amber-400 text-white'
                  : s === 'absent'
                  ? 'bg-slate-400 text-white'
                  : 'bg-slate-200 text-slate-900';
              return (
                <button
                  key={k}
                  onClick={() => press(k)}
                  className={`min-w-[2rem] flex-1 rounded py-3 text-sm font-semibold ${cls}`}
                >
                  {k}
                </button>
              );
            })}
            {ri === 2 && (
              <button
                onClick={() => press('Back')}
                className="rounded bg-slate-700 px-2 py-3 text-xs font-semibold text-white"
              >
                ◀
              </button>
            )}
          </div>
        ))}
      </div>

      {finished && (
        <div className="mt-4 rounded border border-slate-300 bg-white p-3 text-center text-sm">
          <div className="font-semibold text-slate-900">
            {solved ? `Solved in ${guesses.length} / ${MAX_GUESSES}` : `Answer: ${target}`}
          </div>
          <a href="/daily/" className="mt-2 inline-block text-xs text-brand-700 hover:underline">
            ← Back to Daily
          </a>
        </div>
      )}
    </div>
  );
}

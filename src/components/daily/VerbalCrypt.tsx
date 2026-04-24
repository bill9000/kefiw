// Daily Cryptogram — decode a seeded substitution cipher. User clicks a
// cipher letter and types its plaintext; the mapping applies everywhere.
// Accuracy = correct letter mappings / total distinct letters in plaintext.

import { useEffect, useMemo, useRef, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import { getVerbalPuzzle, verbalScore, type CryptPuzzle } from '~/lib/daily-verbal-puzzles';
import { getProgress, saveProgress, recordResult, type VerbalProgress } from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';
import type { VerbalResult } from '~/lib/daily-scoring';

const GAME_ID = 'verbal-crypt' as const;

interface CryptState {
  // cipher letter -> guessed plaintext letter
  guess: Record<string, string>;
}

export default function VerbalCrypt(): JSX.Element {
  const [dailyDate, setDailyDate] = useState('');
  const [puzzle, setPuzzle] = useState<CryptPuzzle | null>(null);
  const [state, setState] = useState<CryptState>({ guess: {} });
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startRef = useRef<number>(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const p = getVerbalPuzzle(d, GAME_ID) as CryptPuzzle | null;
    setPuzzle(p);
    const saved = getProgress<VerbalProgress>(d, GAME_ID);
    if (saved) {
      const s = saved.state as unknown as CryptState;
      if (s?.guess) setState(s);
      if (saved.finishedAt) setFinished(true);
      startRef.current = saved.startedAt;
    } else {
      startRef.current = Date.now();
      saveProgress(d, GAME_ID, {
        startedAt: startRef.current,
        finished: false,
        state: { guess: {} },
      });
    }
  }, []);

  useEffect(() => {
    if (finished) return;
    const t = window.setInterval(() => {
      if (startRef.current) setElapsedSec(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => window.clearInterval(t);
  }, [finished]);

  // Build the inverse mapping the user is guessing toward: cipher→plain
  const inverseKey = useMemo(() => {
    if (!puzzle) return {};
    const inv: Record<string, string> = {};
    Object.entries(puzzle.mapping).forEach(([plain, cipher]) => {
      inv[cipher] = plain;
    });
    return inv;
  }, [puzzle]);

  // Distinct cipher letters appearing in the ciphertext
  const distinctCipherLetters = useMemo(() => {
    if (!puzzle) return [];
    const seen = new Set<string>();
    for (const ch of puzzle.ciphertext) {
      if (/[A-Z]/.test(ch)) seen.add(ch);
    }
    return Array.from(seen).sort();
  }, [puzzle]);

  const accuracy = useMemo(() => {
    if (!distinctCipherLetters.length) return 0;
    const correct = distinctCipherLetters.filter((c) => state.guess[c] === inverseKey[c]).length;
    return correct / distinctCipherLetters.length;
  }, [distinctCipherLetters, state.guess, inverseKey]);

  function persist(nextState: CryptState, markFinished = false): void {
    saveProgress(dailyDate, GAME_ID, {
      startedAt: startRef.current,
      finished: markFinished,
      finishedAt: markFinished ? Date.now() : undefined,
      state: nextState as unknown as Record<string, unknown>,
    });
  }

  function assign(cipherLetter: string, plainLetter: string): void {
    const next: CryptState = { guess: { ...state.guess, [cipherLetter]: plainLetter } };
    setState(next);
    persist(next);
    setSelected(null);
  }

  function clearMapping(cipherLetter: string): void {
    const next: CryptState = { guess: { ...state.guess } };
    delete next.guess[cipherLetter];
    setState(next);
    persist(next);
  }

  function finish(): void {
    if (!puzzle) return;
    const timeUsed = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const score = verbalScore(accuracy, timeUsed, puzzle.baselineSec);
    const result: VerbalResult = {
      gameId: GAME_ID,
      score,
      accuracy,
      timeSec: timeUsed,
      finished: true,
    };
    setFinished(true);
    setSubmitted(true);
    persist(state, true);
    recordResult(dailyDate, result);
    void submitDailyScore(dailyDate, result);
  }

  if (!puzzle) {
    return <div className="py-8 text-center text-slate-500">Loading today&rsquo;s Cryptogram…</div>;
  }

  const mappedCount = Object.keys(state.guess).length;
  const correctCount = distinctCipherLetters.filter((c) => state.guess[c] === inverseKey[c]).length;

  return (
    <div className="mx-auto max-w-2xl">
      {!finished ? (
        <>
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              Mapped <strong>{mappedCount}</strong> / {distinctCipherLetters.length}
              {' · '}
              correct <strong>{correctCount}</strong>
            </span>
            <span className="font-mono">{elapsedSec}s</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 break-words text-center font-mono text-lg leading-relaxed text-slate-900">
              {puzzle.ciphertext.split('').map((ch, i) => {
                if (!/[A-Z]/.test(ch)) return <span key={i}>{ch}</span>;
                const guessed = state.guess[ch];
                const isSel = selected === ch;
                return (
                  <span
                    key={i}
                    onClick={() => setSelected(ch)}
                    className={`inline-block cursor-pointer px-0.5 ${
                      isSel ? 'rounded bg-brand-100' : ''
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-[0.2em] text-slate-400">{ch}</span>
                    <span className={`block text-xl font-bold ${guessed ? 'text-slate-900' : 'text-slate-300'}`}>
                      {guessed ?? '·'}
                    </span>
                  </span>
                );
              })}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {selected
                  ? `Assign plaintext for cipher letter ${selected}`
                  : 'Tap a cipher letter above, then pick its plaintext below.'}
              </div>
              <div className="grid grid-cols-9 gap-1 sm:grid-cols-13">
                {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                  <button
                    key={letter}
                    type="button"
                    disabled={!selected}
                    onClick={() => selected && assign(selected, letter)}
                    className="rounded border border-slate-200 bg-white px-1 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {letter}
                  </button>
                ))}
              </div>
              {selected && state.guess[selected] && (
                <button
                  type="button"
                  onClick={() => clearMapping(selected)}
                  className="mt-2 text-xs text-rose-700 hover:underline"
                >
                  Clear {selected} → {state.guess[selected]}
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={finish}
              className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Submit — score me
            </button>
          </div>
        </>
      ) : (
        <SummaryCard
          title="Cryptogram"
          accuracy={accuracy}
          plaintext={puzzle.plaintext}
          author={puzzle.author}
          timeSec={elapsedSec || Math.floor((Date.now() - startRef.current) / 1000)}
          baselineSec={puzzle.baselineSec}
          submitted={submitted}
        />
      )}
    </div>
  );
}

function SummaryCard({
  title,
  accuracy,
  plaintext,
  author,
  timeSec,
  baselineSec,
  submitted,
}: {
  title: string;
  accuracy: number;
  plaintext: string;
  author: string;
  timeSec: number;
  baselineSec: number;
  submitted: boolean;
}): JSX.Element {
  const score = verbalScore(accuracy, timeSec, baselineSec);
  return (
    <div className="mx-auto max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">{title} — done for today</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-brand-700">{score}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Score / 1500</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{Math.round(accuracy * 100)}%</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Letters correct</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{timeSec}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Time · baseline {baselineSec}s</div>
        </div>
      </div>
      <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
        <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Answer</div>
        <p className="mt-1 font-serif italic">&ldquo;{plaintext}&rdquo;</p>
        <p className="mt-1 text-xs text-slate-600">— {author}</p>
      </div>
      <p className="mt-4 text-sm text-slate-600">
        {score >= 450 ? 'Cleared — counts toward your Kefiw Verbal pipeline streak.' : 'Need 450 points to clear.'}
        {submitted && ' Submitted to the leaderboard.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <a href="/daily/verbal/" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Back to Kefiw Verbal
        </a>
        <a href="/daily/leaderboard/" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          Today&rsquo;s leaderboard →
        </a>
      </div>
    </div>
  );
}

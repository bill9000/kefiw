// Daily Word Twist — find as many real words as possible from 7 seeded letters.
// Scoring: accuracy = (unique valid words found / total possible) × 1000, ×
// time multiplier. See lib/daily-verbal-puzzles.ts for the shared formula.

import { useEffect, useMemo, useRef, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import { getVerbalPuzzle, verbalScore, type TwistPuzzle } from '~/lib/daily-verbal-puzzles';
import { loadDict, hasWord } from '~/lib/daily-dict';
import { getProgress, saveProgress, recordResult, type VerbalProgress } from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';
import type { VerbalResult } from '~/lib/daily-scoring';

const GAME_ID = 'verbal-twist' as const;
const MIN_LEN = 3;

interface TwistState {
  found: string[];
  attemptedAt: number[]; // timestamps for anti-grind
}

function canFormFromLetters(word: string, letters: string): boolean {
  const bag: Record<string, number> = {};
  for (const ch of letters.toUpperCase()) bag[ch] = (bag[ch] ?? 0) + 1;
  for (const ch of word.toUpperCase()) {
    if (!bag[ch]) return false;
    bag[ch]--;
  }
  return true;
}

function validWordsForLetters(dict: Set<string>, letters: string): string[] {
  const LETTER_SET = letters.toUpperCase();
  const out: string[] = [];
  for (const w of dict) {
    if (w.length < MIN_LEN) continue;
    if (w.length > LETTER_SET.length) continue;
    if (canFormFromLetters(w, LETTER_SET)) out.push(w);
  }
  return out;
}

export default function VerbalTwist(): JSX.Element {
  const [dailyDate, setDailyDate] = useState('');
  const [puzzle, setPuzzle] = useState<TwistPuzzle | null>(null);
  const [dict, setDict] = useState<Set<string> | null>(null);
  const [validWords, setValidWords] = useState<string[]>([]);
  const [state, setState] = useState<TwistState>({ found: [], attemptedAt: [] });
  const [input, setInput] = useState('');
  const [flash, setFlash] = useState<{ kind: 'ok' | 'no' | 'dupe'; text: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startRef = useRef<number>(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const p = getVerbalPuzzle(d, GAME_ID) as TwistPuzzle | null;
    setPuzzle(p);
    const saved = getProgress<VerbalProgress>(d, GAME_ID);
    if (saved) {
      const s = saved.state as unknown as TwistState;
      if (s?.found) setState(s);
      if (saved.finishedAt) setFinished(true);
      startRef.current = saved.startedAt;
    } else {
      startRef.current = Date.now();
      saveProgress(d, GAME_ID, {
        startedAt: startRef.current,
        finished: false,
        state: { found: [], attemptedAt: [] },
      });
    }
    loadDict().then(setDict).catch(() => setDict(new Set()));
  }, []);

  useEffect(() => {
    if (!dict || !puzzle) return;
    setValidWords(validWordsForLetters(dict, puzzle.letters));
  }, [dict, puzzle]);

  useEffect(() => {
    if (finished) return;
    const t = window.setInterval(() => {
      if (startRef.current) setElapsedSec(Math.floor((Date.now() - startRef.current) / 1000));
    }, 500);
    return () => window.clearInterval(t);
  }, [finished]);

  const accuracy = useMemo(() => {
    if (!validWords.length) return 0;
    const valid = new Set(validWords);
    const hits = state.found.filter((w) => valid.has(w)).length;
    return hits / validWords.length;
  }, [state.found, validWords]);

  function persist(nextState: TwistState, markFinished = false): void {
    const store: VerbalProgress = {
      startedAt: startRef.current,
      finished: markFinished,
      finishedAt: markFinished ? Date.now() : undefined,
      state: nextState as unknown as Record<string, unknown>,
    };
    saveProgress(dailyDate, GAME_ID, store);
  }

  function submitWord(e: React.FormEvent): void {
    e.preventDefault();
    if (finished || !puzzle || !dict) return;
    const w = input.trim().toUpperCase();
    setInput('');
    if (w.length < MIN_LEN) {
      flashMsg('no', `Too short (min ${MIN_LEN} letters)`);
      return;
    }
    if (!canFormFromLetters(w, puzzle.letters)) {
      flashMsg('no', 'Letters not in the set');
      return;
    }
    if (state.found.includes(w)) {
      flashMsg('dupe', 'Already found');
      return;
    }
    if (!hasWord(dict, w)) {
      flashMsg('no', 'Not in dictionary');
      return;
    }
    const next: TwistState = { found: [...state.found, w], attemptedAt: [...state.attemptedAt, Date.now()] };
    setState(next);
    persist(next);
    flashMsg('ok', `+${w} (${w.length} letters)`);
  }

  function flashMsg(kind: 'ok' | 'no' | 'dupe', text: string): void {
    setFlash({ kind, text });
    window.setTimeout(() => setFlash(null), 1400);
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
    return <div className="py-8 text-center text-slate-500">Loading today&rsquo;s Word Twist…</div>;
  }

  return (
    <div className="mx-auto max-w-xl">
      {!finished ? (
        <>
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              Found <strong>{state.found.length}</strong>
              {validWords.length > 0 && ` / ${validWords.length}`}
            </span>
            <span className="font-mono">{elapsedSec}s</span>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap justify-center gap-2">
              {puzzle.letters.split('').map((ch, i) => (
                <span
                  key={i}
                  className="flex h-12 w-12 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-xl font-bold text-slate-900 shadow-sm"
                >
                  {ch}
                </span>
              ))}
            </div>

            <form onSubmit={submitWord} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                placeholder="Type a word…"
                autoFocus
                className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-base uppercase tracking-wide focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
              <button
                type="submit"
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Submit
              </button>
            </form>

            {flash && (
              <div
                className={`mt-3 rounded-md px-3 py-2 text-center text-sm ${
                  flash.kind === 'ok'
                    ? 'bg-emerald-50 text-emerald-800'
                    : flash.kind === 'dupe'
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-rose-50 text-rose-800'
                }`}
                role="status"
                aria-live="polite"
              >
                {flash.text}
              </div>
            )}

            <p className="mt-3 text-center text-xs text-slate-500">
              {MIN_LEN}+ letters. Each letter can be used only once per word.
            </p>
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Your finds</div>
            {state.found.length === 0 ? (
              <div className="text-sm text-slate-400">No words yet — start typing.</div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {state.found
                  .slice()
                  .sort((a, b) => b.length - a.length || a.localeCompare(b))
                  .map((w) => (
                    <span key={w} className="rounded bg-white px-2 py-1 text-xs font-mono text-slate-700 shadow-sm">
                      {w}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={finish}
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              I&rsquo;m done — score me
            </button>
          </div>
        </>
      ) : (
        <SummaryCard
          title="Word Twist"
          accuracy={accuracy}
          foundCount={state.found.length}
          totalPossible={validWords.length}
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
  foundCount,
  totalPossible,
  timeSec,
  baselineSec,
  submitted,
}: {
  title: string;
  accuracy: number;
  foundCount: number;
  totalPossible: number;
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
          <div className="text-2xl font-bold text-slate-900">
            {foundCount}
            {totalPossible > 0 ? ` / ${totalPossible}` : ''}
          </div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Words</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{timeSec}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Time · baseline {baselineSec}s</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-600">
        {score >= 450
          ? 'Cleared — counts toward your Kefiw Verbal pipeline streak.'
          : 'Need 450 points to clear for the pipeline streak.'}
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

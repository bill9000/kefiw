// Daily Link Grid — group 16 tiles into 4 hidden categories. Four mistakes
// ends the run. Accuracy = categoriesFound / 4; score applies the standard
// soft time penalty from verbal-puzzles.

import { useEffect, useMemo, useRef, useState } from 'react';
import { getDailyDate } from '~/lib/daily-day';
import { getVerbalPuzzle, verbalScore, type LinkPuzzle } from '~/lib/daily-verbal-puzzles';
import { getProgress, saveProgress, recordResult, type VerbalProgress } from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';
import type { VerbalResult } from '~/lib/daily-scoring';

const GAME_ID = 'verbal-link' as const;
const MAX_MISTAKES = 4;

interface LinkState {
  selected: string[];              // tile labels currently selected
  solvedKeys: string[];            // categoryKeys solved
  mistakes: number;
}

const LEVEL_COLOR: Record<number, string> = {
  1: 'bg-blue-100 text-blue-900 border-blue-300',
  2: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  3: 'bg-purple-100 text-purple-900 border-purple-300',
  4: 'bg-amber-100 text-amber-900 border-amber-300',
};

export default function VerbalLink(): JSX.Element {
  const [dailyDate, setDailyDate] = useState('');
  const [puzzle, setPuzzle] = useState<LinkPuzzle | null>(null);
  const [state, setState] = useState<LinkState>({ selected: [], solvedKeys: [], mistakes: 0 });
  const [flash, setFlash] = useState<{ kind: 'ok' | 'no' | 'near'; text: string } | null>(null);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const startRef = useRef<number>(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const p = getVerbalPuzzle(d, GAME_ID) as LinkPuzzle | null;
    setPuzzle(p);
    const saved = getProgress<VerbalProgress>(d, GAME_ID);
    if (saved) {
      const s = saved.state as unknown as LinkState;
      if (s) setState(s);
      if (saved.finishedAt) setFinished(true);
      startRef.current = saved.startedAt;
    } else {
      startRef.current = Date.now();
      saveProgress(d, GAME_ID, {
        startedAt: startRef.current,
        finished: false,
        state: { selected: [], solvedKeys: [], mistakes: 0 },
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

  const accuracy = useMemo(() => {
    if (!puzzle) return 0;
    return state.solvedKeys.length / puzzle.categories.length;
  }, [state.solvedKeys, puzzle]);

  function persist(nextState: LinkState, markFinished = false): void {
    saveProgress(dailyDate, GAME_ID, {
      startedAt: startRef.current,
      finished: markFinished,
      finishedAt: markFinished ? Date.now() : undefined,
      state: nextState as unknown as Record<string, unknown>,
    });
  }

  function flashMsg(kind: 'ok' | 'no' | 'near', text: string): void {
    setFlash({ kind, text });
    window.setTimeout(() => setFlash(null), 1400);
  }

  function toggleTile(label: string): void {
    if (!puzzle || finished) return;
    if (state.solvedKeys.some((k) => isInSolved(label, k))) return;
    if (state.selected.includes(label)) {
      setState({ ...state, selected: state.selected.filter((l) => l !== label) });
      return;
    }
    if (state.selected.length >= 4) return;
    setState({ ...state, selected: [...state.selected, label] });
  }

  function isInSolved(label: string, key: string): boolean {
    if (!puzzle) return false;
    const cat = puzzle.categories.find((c) => c.key === key);
    return !!cat && cat.items.includes(label);
  }

  function submitGuess(): void {
    if (!puzzle || state.selected.length !== 4 || finished) return;
    // Check if all four belong to the same category
    const hits = puzzle.categories.map((cat) => ({
      key: cat.key,
      matches: state.selected.filter((l) => cat.items.includes(l)).length,
    }));
    const perfect = hits.find((h) => h.matches === 4);
    if (perfect) {
      const nextSolved = [...state.solvedKeys, perfect.key];
      const solvedAll = nextSolved.length === puzzle.categories.length;
      const next: LinkState = { selected: [], solvedKeys: nextSolved, mistakes: state.mistakes };
      setState(next);
      persist(next, solvedAll);
      flashMsg('ok', 'Group found');
      if (solvedAll) {
        finalize(next, true);
      }
      return;
    }
    const nearMiss = hits.some((h) => h.matches === 3);
    const nextMistakes = state.mistakes + 1;
    const outOfLives = nextMistakes >= MAX_MISTAKES;
    const next: LinkState = { selected: [], solvedKeys: state.solvedKeys, mistakes: nextMistakes };
    setState(next);
    persist(next, outOfLives);
    flashMsg(nearMiss ? 'near' : 'no', nearMiss ? 'One away…' : 'Not a group');
    if (outOfLives) finalize(next, false);
  }

  function finalize(finalState: LinkState, solvedAll: boolean): void {
    if (!puzzle) return;
    const timeUsed = Math.max(1, Math.round((Date.now() - startRef.current) / 1000));
    const accFrac = finalState.solvedKeys.length / puzzle.categories.length;
    const score = verbalScore(accFrac, timeUsed, puzzle.baselineSec);
    const result: VerbalResult = {
      gameId: GAME_ID,
      score,
      accuracy: accFrac,
      timeSec: timeUsed,
      finished: true,
    };
    setFinished(true);
    setSubmitted(true);
    persist(finalState, true);
    recordResult(dailyDate, result);
    void submitDailyScore(dailyDate, result);
    void solvedAll;
  }

  function giveUp(): void {
    finalize(state, false);
  }

  if (!puzzle) {
    return <div className="py-8 text-center text-slate-500">Loading today&rsquo;s Link Grid…</div>;
  }

  const remainingTiles = puzzle.tiles.filter(
    (t) => !state.solvedKeys.some((k) => isInSolved(t.label, k))
  );
  const livesLeft = MAX_MISTAKES - state.mistakes;

  return (
    <div className="mx-auto max-w-2xl">
      {!finished ? (
        <>
          <div className="mb-3 flex items-center justify-between text-sm text-slate-600">
            <span>
              Groups <strong>{state.solvedKeys.length}</strong> / {puzzle.categories.length} · Lives <strong className={livesLeft <= 1 ? 'text-rose-600' : ''}>{livesLeft}</strong>
            </span>
            <span className="font-mono">{elapsedSec}s</span>
          </div>

          {/* Solved groups */}
          <div className="mb-3 space-y-2">
            {state.solvedKeys.map((key) => {
              const cat = puzzle.categories.find((c) => c.key === key)!;
              return (
                <div key={key} className={`rounded-md border p-2 text-center ${LEVEL_COLOR[cat.level]}`}>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em]">{cat.name}</div>
                  <div className="mt-0.5 text-sm font-semibold">{cat.items.join(' · ')}</div>
                </div>
              );
            })}
          </div>

          {/* Remaining tile grid */}
          <div className="grid grid-cols-4 gap-2">
            {remainingTiles.map((t) => {
              const sel = state.selected.includes(t.label);
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => toggleTile(t.label)}
                  className={`rounded-md border px-2 py-4 text-sm font-semibold transition ${
                    sel
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-slate-300 bg-white text-slate-900 hover:border-brand-400 hover:bg-brand-50'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {flash && (
            <div
              className={`mt-3 rounded-md px-3 py-2 text-center text-sm ${
                flash.kind === 'ok'
                  ? 'bg-emerald-50 text-emerald-800'
                  : flash.kind === 'near'
                  ? 'bg-amber-50 text-amber-800'
                  : 'bg-rose-50 text-rose-800'
              }`}
              role="status"
              aria-live="polite"
            >
              {flash.text}
            </div>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              disabled={state.selected.length !== 4}
              onClick={submitGuess}
              className="rounded-md bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Submit group ({state.selected.length}/4)
            </button>
            <button
              type="button"
              onClick={() => setState({ ...state, selected: [] })}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={giveUp}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 hover:bg-slate-50"
            >
              Give up
            </button>
          </div>
        </>
      ) : (
        <SummaryCard
          title="Link Grid"
          accuracy={accuracy}
          groups={state.solvedKeys.length}
          totalGroups={puzzle.categories.length}
          mistakes={state.mistakes}
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
  groups,
  totalGroups,
  mistakes,
  timeSec,
  baselineSec,
  submitted,
}: {
  title: string;
  accuracy: number;
  groups: number;
  totalGroups: number;
  mistakes: number;
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
          <div className="text-2xl font-bold text-slate-900">{groups} / {totalGroups}</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Groups · {mistakes} misses</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="text-2xl font-bold text-slate-900">{timeSec}s</div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Time · baseline {baselineSec}s</div>
        </div>
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

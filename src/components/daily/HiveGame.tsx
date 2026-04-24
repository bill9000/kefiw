import { useEffect, useMemo, useState } from 'react';
import { getDailyDate, getDayOfYear } from '~/lib/daily-day';
import { getHiveSet } from '~/data/daily-hive-sets';
import { loadDict } from '~/lib/daily-dict';
import {
  allValidWords,
  isValidHiveWord,
  isPangram,
  maxPoints,
  tierForScore,
  wordPoints,
  TIER_LABELS,
  type HiveTier,
} from '~/lib/daily-hive-score';
import {
  getProgress,
  saveProgress,
  recordResult,
  type HiveProgress,
} from '~/lib/daily-state';
import { submitDailyScore } from '~/lib/daily-submit';

export default function HiveGame() {
  const [dailyDate, setDailyDate] = useState('');
  const [set, setSet] = useState<ReturnType<typeof getHiveSet> | null>(null);
  const [dict, setDict] = useState<Set<string> | null>(null);
  const [dictError, setDictError] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [maxPts, setMaxPts] = useState(0);

  useEffect(() => {
    const d = getDailyDate();
    setDailyDate(d);
    const s = getHiveSet(getDayOfYear(d));
    setSet(s);
    const saved = getProgress<HiveProgress>(d, 'hive');
    if (saved) setFoundWords(saved.foundWords);
    loadDict()
      .then((dictionary) => {
        setDict(dictionary);
        setMaxPts(maxPoints(s, dictionary));
      })
      .catch((e) => setDictError(String(e)));
  }, []);

  const points = useMemo(() => {
    if (!set) return 0;
    return foundWords.reduce((sum, w) => sum + wordPoints(w, set), 0);
  }, [foundWords, set]);

  const tier: HiveTier = useMemo(() => {
    return maxPts > 0 ? tierForScore(points, maxPts) : 'beginner';
  }, [points, maxPts]);

  const [lastSubmittedTier, setLastSubmittedTier] = useState<HiveTier | ''>('');
  useEffect(() => {
    if (!set || !dailyDate) return;
    const finished = tier === 'queenBee';
    const progress: HiveProgress = { foundWords, points, finished };
    saveProgress(dailyDate, 'hive', progress);
    const result = {
      gameId: 'hive' as const,
      points,
      maxPoints: maxPts,
      tier,
    };
    recordResult(dailyDate, result);
    if (tier !== lastSubmittedTier) {
      setLastSubmittedTier(tier);
      void submitDailyScore(dailyDate, result);
    }
  }, [foundWords, set, dailyDate, points, tier, maxPts, lastSubmittedTier]);

  function submit() {
    if (!set || !dict) return;
    const w = input.trim().toUpperCase();
    if (!w) return;
    setInput('');
    if (foundWords.includes(w)) {
      setMessage('Already found');
      return;
    }
    if (!isValidHiveWord(w, set, dict)) {
      if (w.length < 4) setMessage('Too short');
      else if (!w.includes(set.center)) setMessage('Missing center letter');
      else {
        const allowed = new Set([set.center, ...set.outer]);
        const bad = [...w].some((ch) => !allowed.has(ch));
        setMessage(bad ? 'Uses illegal letter' : 'Not in dictionary');
      }
      return;
    }
    setMessage(
      isPangram(w, set)
        ? `PANGRAM! +${wordPoints(w, set)}`
        : `+${wordPoints(w, set)} pts`
    );
    setFoundWords((fw) => [...fw, w].sort());
  }

  function press(letter: string) {
    setInput((s) => s + letter);
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submit();
  }

  function shuffle() {
    if (!set) return;
    const next = [...set.outer];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setSet({ ...set, outer: next as HiveSetOuter });
  }

  if (!set) {
    return <div className="mx-auto max-w-md rounded border border-slate-200 p-4 text-sm text-slate-500">Loading…</div>;
  }

  const hexPositions = [
    { top: '0%', left: '50%' },
    { top: '25%', left: '100%' },
    { top: '75%', left: '100%' },
    { top: '100%', left: '50%' },
    { top: '75%', left: '0%' },
    { top: '25%', left: '0%' },
  ];

  return (
    <div className="mx-auto max-w-lg space-y-5">
      {dictError && (
        <div className="rounded border border-rose-300 bg-rose-50 p-2 text-xs text-rose-800">
          Dictionary failed to load: {dictError}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Tier</div>
            <div className="text-xl font-bold text-brand-700">{TIER_LABELS[tier]}</div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wide text-slate-500">Points</div>
            <div className="text-xl font-bold">
              {points}
              <span className="text-sm font-normal text-slate-500"> / {maxPts || '…'}</span>
            </div>
          </div>
        </div>
        <div className="mt-2 h-2 rounded bg-slate-100">
          <div
            className="h-full rounded bg-brand-500 transition-all"
            style={{ width: `${maxPts > 0 ? Math.min(100, (points / maxPts) * 100) : 0}%` }}
          />
        </div>
      </div>

      {message && (
        <div className="rounded border border-slate-300 bg-slate-50 p-2 text-center text-sm text-slate-800">
          {message}
        </div>
      )}

      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
          onKeyDown={onKey}
          className="w-full rounded border-2 border-slate-300 p-3 text-center text-2xl font-bold tracking-widest focus:border-brand-500 focus:outline-none"
          placeholder="type a word…"
          autoCapitalize="characters"
        />
      </div>

      <div className="relative mx-auto" style={{ width: 260, height: 280 }}>
        <button
          onClick={() => press(set.center)}
          className="absolute flex h-20 w-20 items-center justify-center rounded-lg border-2 border-amber-500 bg-amber-300 text-2xl font-bold text-amber-900 hover:bg-amber-400"
          style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          {set.center}
        </button>
        {set.outer.map((letter, i) => (
          <button
            key={i}
            onClick={() => press(letter)}
            className="absolute flex h-20 w-20 items-center justify-center rounded-lg border-2 border-slate-300 bg-slate-100 text-2xl font-bold text-slate-800 hover:bg-slate-200"
            style={{
              top: hexPositions[i].top,
              left: hexPositions[i].left,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setInput((s) => s.slice(0, -1))}
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Delete
        </button>
        <button
          onClick={shuffle}
          className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          Shuffle
        </button>
        <button
          onClick={submit}
          className="rounded bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Enter
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 p-3">
        <div className="mb-2 text-xs uppercase tracking-wide text-slate-500">
          Found ({foundWords.length})
        </div>
        {foundWords.length === 0 ? (
          <div className="text-sm text-slate-500">Nothing yet. Min 4 letters, must use the center.</div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {foundWords.map((w) => (
              <span
                key={w}
                className={
                  isPangram(w, set)
                    ? 'rounded bg-amber-100 px-2 py-0.5 text-sm font-semibold text-amber-900'
                    : 'rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-800'
                }
              >
                {w}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <a href="/daily/" className="text-xs text-brand-700 hover:underline">← Back to Daily</a>
      </div>
    </div>
  );
}

type HiveSetOuter = [string, string, string, string, string, string];

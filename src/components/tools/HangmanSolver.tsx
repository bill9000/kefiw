import { useEffect, useMemo, useState } from 'react';
import { useWordWorker } from './useWordWorker';
import ResultList from './ResultList';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';
import { wordStats } from '~/lib/outcomes';

export default function HangmanSolver() {
  const { send } = useWordWorker();
  const [pattern, setPattern] = useState('');
  const [excluded, setExcluded] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [phase, setPhase] = useState<'idle' | 'loading' | 'searching'>('idle');

  const cleanPattern = useMemo(
    () => pattern.toLowerCase().replace(/[^a-z?_-]/g, '').replace(/[_-]/g, '?'),
    [pattern],
  );

  const excludedLetters = useMemo(
    () => Array.from(new Set(excluded.toLowerCase().replace(/[^a-z]/g, '').split(''))),
    [excluded],
  );

  const likelyLetterTips = useMemo(() => {
    if (results.length === 0) return null;
    const revealedSet = new Set(cleanPattern.replace(/\?/g, '').split(''));
    const blankCount = (cleanPattern.match(/\?/g) ?? []).length;
    if (blankCount === 0) return null;
    const freq: Record<string, number> = {};
    for (const w of results) {
      for (const c of new Set(w)) {
        if (!revealedSet.has(c) && !excludedLetters.includes(c)) {
          freq[c] = (freq[c] ?? 0) + 1;
        }
      }
    }
    const top = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([letter, count]) => ({
        letter: letter.toUpperCase(),
        count,
        pct: Math.round((count / results.length) * 100),
      }));
    return top;
  }, [results, cleanPattern, excludedLetters]);

  useEffect(() => {
    if (!cleanPattern || cleanPattern.length < 2) {
      setResults([]);
      return;
    }
    setPhase('loading');
    (async () => {
      const { results: pat } = await send<{ results: string[] }>('pattern', {
        pattern: cleanPattern,
        dictSource: 'fast',
      });
      const filtered = pat.filter((w) => {
        for (const ex of excludedLetters) {
          if (w.includes(ex)) return false;
        }
        return true;
      });
      setResults(filtered);
      setPhase('idle');
    })();
  }, [cleanPattern, excludedLetters, send]);

  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="pat">Known pattern (use _ or ? for unknown letters)</label>
        <input
          id="pat"
          className="input font-mono"
          value={pattern}
          onChange={(e) => setPattern(e.target.value)}
          placeholder="e.g. _A_P_Y"
          autoFocus
        />
        <p className="mt-1 text-xs text-slate-500">
          Type letters you already know; use _ or ? for blanks. Length equals the total word length.
        </p>
      </div>

      <div>
        <label className="label" htmlFor="excluded">Wrong letters (already guessed and missed)</label>
        <input
          id="excluded"
          className="input font-mono"
          value={excluded}
          onChange={(e) => setExcluded(e.target.value)}
          placeholder="e.g. EIOS"
        />
      </div>

      {phase === 'idle' && results.length > 0 && (() => {
        const s = wordStats(results);
        const cards: MaybeCard[] = [
          { kind: 'summary', text: `${results.length.toLocaleString()} candidate${results.length === 1 ? '' : 's'} match "${cleanPattern.toUpperCase()}".` },
          likelyLetterTips && likelyLetterTips.length > 0
            ? {
                kind: 'comparison' as const,
                title: 'Best next guess (letter frequency in candidates)',
                rows: likelyLetterTips.map((t) => ({
                  label: t.letter,
                  value: `${t.pct}% · in ${t.count.toLocaleString()} words`,
                })),
              }
            : null,
          {
            kind: 'stats',
            items: [
              { label: 'Candidates', value: results.length.toLocaleString() },
              { label: 'Pattern length', value: String(cleanPattern.length) },
              { label: 'Wrong letters', value: String(excludedLetters.length) },
              ...(s.bestScrabble ? [{ label: 'Highest scoring', value: `${s.bestScrabble.word.toUpperCase()} (${s.bestScrabble.score})` }] : []),
            ],
          },
          results.length === 1
            ? { kind: 'takeaway' as const, text: `Only one word fits — guess "${results[0].toUpperCase()}".` }
            : likelyLetterTips && likelyLetterTips.length > 0
              ? { kind: 'takeaway' as const, text: `Guess ${likelyLetterTips[0].letter} — it appears in ${likelyLetterTips[0].pct}% of remaining candidates.` }
              : null,
          {
            kind: 'nextStep',
            actions: [
              { href: '/word-tools/word-finder/', label: 'Word Finder' },
              { href: '/word-tools/wordle-solver/', label: 'Wordle Solver' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}

      <ResultList
        words={results}
        loading={phase !== 'idle'}
        scores={false}
        tool="hangman-solver"
        loadingLabel="Searching…"
        emptyLabel="Enter a pattern and wrong letters above."
      />
    </div>
  );
}

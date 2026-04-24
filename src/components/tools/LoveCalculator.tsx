import { useMemo, useState } from 'react';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

// Deterministic, honest-fun compatibility score.
// We combine three transparent signals, each weighted equally:
//   1. Shared letter ratio — how many unique letters overlap.
//   2. Vowel balance — how close the two names' vowel/consonant ratios are.
//   3. "LOVES" count — the classic schoolyard tally (matches per letter in "LOVES").
// The aim is a reproducible number you can rationalise — not real prediction.
function loveScore(a: string, b: string): { score: number; parts: { label: string; value: number }[] } {
  const na = a.toLowerCase().replace(/[^a-z]/g, '');
  const nb = b.toLowerCase().replace(/[^a-z]/g, '');
  if (!na || !nb) return { score: 0, parts: [] };

  // 1. Shared unique letters
  const setA = new Set(na);
  const setB = new Set(nb);
  let shared = 0;
  for (const c of setA) if (setB.has(c)) shared++;
  const union = new Set([...setA, ...setB]).size;
  const sharedRatio = union ? shared / union : 0;

  // 2. Vowel balance
  const vowels = 'aeiou';
  const vowelRatio = (s: string) => {
    let v = 0;
    for (const c of s) if (vowels.includes(c)) v++;
    return s.length ? v / s.length : 0;
  };
  const vA = vowelRatio(na);
  const vB = vowelRatio(nb);
  const vowelBalance = 1 - Math.abs(vA - vB); // 1 when identical ratios, 0 when max divergent

  // 3. LOVES schoolyard tally — count of each LOVES letter summed across both names
  const lovesCount = (s: string) => {
    let n = 0;
    for (const c of s) if ('loves'.includes(c)) n++;
    return n;
  };
  const lovesRaw = lovesCount(na) + lovesCount(nb);
  const lovesNorm = Math.min(1, lovesRaw / 12); // cap at 12 for normalization

  const raw = (sharedRatio + vowelBalance + lovesNorm) / 3;
  // Smooth the curve so results cluster toward the middle (more fun).
  const smooth = 0.1 + raw * 0.8; // keep results between 10 and 90
  return {
    score: Math.round(smooth * 100),
    parts: [
      { label: 'Shared letters', value: Math.round(sharedRatio * 100) },
      { label: 'Vowel harmony', value: Math.round(vowelBalance * 100) },
      { label: '"LOVES" tally', value: Math.round(lovesNorm * 100) },
    ],
  };
}

function scoreVerdict(score: number): { headline: string; blurb: string; tone: 'red' | 'amber' | 'teal' | 'emerald' } {
  if (score >= 85) return { headline: 'Cosmic combo', blurb: 'Letters line up, vowels hum in harmony, and the LOVES tally is on your side. Get the matching pajamas.', tone: 'emerald' };
  if (score >= 70) return { headline: 'Real chemistry', blurb: 'Strong letter overlap and balanced vowel energy — this one has legs.', tone: 'teal' };
  if (score >= 50) return { headline: 'Slow simmer', blurb: 'There is compatibility here, but it asks for patience. Share a playlist and see what happens.', tone: 'teal' };
  if (score >= 35) return { headline: 'Worth a coffee', blurb: 'Mixed signals. Try a low-stakes hang before writing wedding vows.', tone: 'amber' };
  if (score >= 20) return { headline: 'Complicated', blurb: 'The letters are fighting each other. Maybe just friends? Or an enemies-to-lovers arc.', tone: 'amber' };
  return { headline: 'Opposite energies', blurb: 'Your names share almost nothing. Which is exciting… or a warning. Flip a coin.', tone: 'red' };
}

export default function LoveCalculator() {
  const [a, setA] = useState('Alex');
  const [b, setB] = useState('Sam');

  const r = useMemo(() => loveScore(a, b), [a, b]);
  const verdict = useMemo(() => scoreVerdict(r.score), [r.score]);
  const valid = a.trim().length > 0 && b.trim().length > 0;

  const toneClass = {
    red: 'border-red-200 bg-red-50 text-red-900',
    amber: 'border-amber-200 bg-amber-50 text-amber-900',
    teal: 'border-teal-200 bg-teal-50 text-teal-900',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  }[verdict.tone];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="a">Your name</label>
          <input id="a" className="input" value={a} onChange={(e) => setA(e.target.value)} placeholder="e.g. Alex" />
        </div>
        <div>
          <label className="label" htmlFor="b">Their name</label>
          <input id="b" className="input" value={b} onChange={(e) => setB(e.target.value)} placeholder="e.g. Sam" />
        </div>
      </div>

      <div className="rounded-md border border-pink-200 bg-pink-50 px-3 py-2 text-xs text-pink-900">
        <strong>Just for fun.</strong> This is a novelty calculator. It looks at letters and vowels — it does not know the humans attached to them.
      </div>

      {valid && (
        <div className={`card text-center ${toneClass}`}>
          <div className="text-xs font-medium uppercase tracking-wide opacity-70">{a} + {b}</div>
          <div className="mt-1 flex items-center justify-center gap-2 text-5xl font-bold">
            {r.score}
            <span className="text-3xl">%</span>
          </div>
          <div className="mt-2 text-lg font-semibold">{verdict.headline}</div>
          <div className="mt-1 text-sm">{verdict.blurb}</div>
        </div>
      )}

      {valid && (() => {
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: `${a} + ${b} = ${r.score}% compatibility (novelty score).`,
          },
          {
            kind: 'comparison',
            title: 'How the score was built',
            rows: r.parts.map((p) => ({ label: p.label, value: `${p.value}%` })),
          },
          {
            kind: 'takeaway',
            text: 'The formula is deterministic — same names always give the same number. Swap the names, try nicknames, try full legal names — the tool is a conversation starter, not a verdict.',
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/games/flames-calculator/', label: 'FLAMES Calculator' },
              { href: '/games/how-long-will-we-last/', label: 'How Long Will We Last?' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

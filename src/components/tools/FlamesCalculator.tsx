import { useMemo, useState } from 'react';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

// Classic schoolyard FLAMES: write both names, cross out shared letters
// (each match eliminates one letter from each name), count remaining,
// then use the count to cycle through F-L-A-M-E-S and the last letter standing wins.
const FLAMES = [
  { letter: 'F', label: 'Friends', blurb: 'Built for the long haul as friends. Safe, reliable, easy.' },
  { letter: 'L', label: 'Lovers', blurb: 'Romance is on the cards. Dates, flowers, shared playlists.' },
  { letter: 'A', label: 'Affectionate', blurb: 'Warm, loving connection — somewhere between friendship and romance.' },
  { letter: 'M', label: 'Marriage', blurb: 'Wedding bells in the distance. Start picking registry items.' },
  { letter: 'E', label: 'Enemies', blurb: 'Energy is strong but combustible. Read the room.' },
  { letter: 'S', label: 'Siblings', blurb: 'Play-fight, bicker, defend each other. Platonic but fierce.' },
];

function runFlames(a: string, b: string): { remaining: number; index: number; verdict: typeof FLAMES[number] | null; crossedA: boolean[]; crossedB: boolean[] } {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '').split('');
  const arrA = clean(a);
  const arrB = clean(b);
  const crossedA = arrA.map(() => false);
  const crossedB = arrB.map(() => false);

  for (let i = 0; i < arrA.length; i++) {
    if (crossedA[i]) continue;
    const j = arrB.findIndex((c, idx) => !crossedB[idx] && c === arrA[i]);
    if (j !== -1) {
      crossedA[i] = true;
      crossedB[j] = true;
    }
  }

  const remaining = crossedA.filter((x) => !x).length + crossedB.filter((x) => !x).length;
  if (remaining === 0) {
    return { remaining: 0, index: -1, verdict: null, crossedA, crossedB };
  }

  // Cycle through FLAMES, removing letters until one remains.
  const letters = FLAMES.map((f, i) => i);
  let ptr = 0;
  while (letters.length > 1) {
    ptr = (ptr + remaining - 1) % letters.length;
    letters.splice(ptr, 1);
  }
  const index = letters[0];
  return { remaining, index, verdict: FLAMES[index], crossedA, crossedB };
}

function renderCrossed(s: string, mask: boolean[]): JSX.Element {
  const letters = s.toLowerCase().replace(/[^a-z]/g, '').split('');
  let mi = 0;
  return (
    <span className="font-mono tracking-wide">
      {s.split('').map((ch, i) => {
        const isLetter = /[a-zA-Z]/.test(ch);
        if (!isLetter) return <span key={i}>{ch}</span>;
        const crossed = mask[mi];
        mi += 1;
        return (
          <span
            key={i}
            className={crossed ? 'text-slate-300 line-through decoration-slate-400' : 'text-slate-900'}
          >
            {ch.toUpperCase()}
          </span>
        );
      })}
    </span>
  );
}

export default function FlamesCalculator() {
  const [a, setA] = useState('Alex');
  const [b, setB] = useState('Sam');

  const r = useMemo(() => runFlames(a, b), [a, b]);
  const valid = a.trim().length > 0 && b.trim().length > 0;

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

      {valid && (
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Cross out shared letters</div>
          <div className="mt-2 space-y-1 text-lg">
            <div>{renderCrossed(a, r.crossedA)}</div>
            <div>{renderCrossed(b, r.crossedB)}</div>
          </div>
          <div className="mt-3 text-xs text-slate-600">
            Letters remaining: <span className="font-mono font-semibold text-slate-900">{r.remaining}</span>
          </div>
        </div>
      )}

      {valid && r.verdict && (
        <div className="card border-pink-200 bg-pink-50 p-4 text-center">
          <div className="flex justify-center gap-1 text-2xl font-bold font-mono text-pink-900">
            {FLAMES.map((f, i) => (
              <span
                key={f.letter}
                className={i === r.index ? 'rounded-md bg-pink-600 px-2 py-1 text-white' : 'opacity-40'}
              >
                {f.letter}
              </span>
            ))}
          </div>
          <div className="mt-3 text-2xl font-bold text-pink-900">{r.verdict.label}</div>
          <div className="mt-1 text-sm text-pink-800">{r.verdict.blurb}</div>
        </div>
      )}

      {valid && r.remaining === 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Every letter canceled out — in classic FLAMES, that sometimes means a perfect match and sometimes means the game has no answer. Call it a tie.
        </div>
      )}

      <div className="rounded-md border border-pink-200 bg-pink-50 px-3 py-2 text-xs text-pink-900">
        <strong>Just for fun.</strong> FLAMES is a 1970s playground game. It looks at letter overlap — it does not predict relationships.
      </div>

      {valid && r.verdict && (() => {
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: `${a} + ${b} → ${r.verdict.label} (${r.remaining} letters remain, cycled through FLAMES).`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Letters remaining', value: String(r.remaining) },
              { label: 'Result', value: r.verdict.label },
              { label: 'FLAMES letter', value: r.verdict.letter },
            ],
          },
          {
            kind: 'takeaway',
            text: 'FLAMES is deterministic — shuffle the names, try nicknames, try full legal names. Every input produces one answer.',
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/games/love-calculator/', label: 'Love Calculator' },
              { href: '/games/how-long-will-we-last/', label: 'How Long Will We Last?' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

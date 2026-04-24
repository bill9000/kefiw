import { useMemo, useState } from 'react';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

// Weighted multi-factor fun predictor. Each signal contributes to a composite
// score 0-100; the score maps to a "years together" estimate on a sliding scale.
// Every factor is transparent — the user can see which answers pushed the needle.

type Answer = number; // -2, -1, 0, 1, 2

interface Question {
  id: string;
  q: string;
  choices: { label: string; value: Answer }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'known',
    q: 'How long have you known each other?',
    choices: [
      { label: 'Under 3 months', value: -1 },
      { label: '3\u20136 months', value: 0 },
      { label: '6\u201312 months', value: 1 },
      { label: 'Over a year', value: 2 },
    ],
  },
  {
    id: 'values',
    q: 'How aligned are your core values (family, money, kids)?',
    choices: [
      { label: 'Not really', value: -2 },
      { label: 'Some overlap', value: 0 },
      { label: 'Mostly aligned', value: 1 },
      { label: 'Fully aligned', value: 2 },
    ],
  },
  {
    id: 'conflict',
    q: 'How do you handle conflict?',
    choices: [
      { label: 'Silent treatment', value: -2 },
      { label: 'Blow up, then cool off', value: -1 },
      { label: 'Talk when calm', value: 1 },
      { label: 'Honest, no grudges', value: 2 },
    ],
  },
  {
    id: 'laugh',
    q: 'Do you laugh together daily?',
    choices: [
      { label: 'Rarely', value: -2 },
      { label: 'Sometimes', value: 0 },
      { label: 'Most days', value: 1 },
      { label: 'Every day', value: 2 },
    ],
  },
  {
    id: 'distance',
    q: 'Do you live in the same city?',
    choices: [
      { label: 'No, different country', value: -2 },
      { label: 'Different city, same country', value: -1 },
      { label: 'Same city, different places', value: 1 },
      { label: 'Living together', value: 2 },
    ],
  },
  {
    id: 'future',
    q: 'How often do you talk about the future?',
    choices: [
      { label: 'Never', value: -2 },
      { label: 'Occasionally', value: 0 },
      { label: 'Often', value: 1 },
      { label: 'We plan together', value: 2 },
    ],
  },
  {
    id: 'family',
    q: 'Does each of your families approve?',
    choices: [
      { label: 'Both strongly oppose', value: -2 },
      { label: 'Mixed on both sides', value: -1 },
      { label: 'Mostly supportive', value: 1 },
      { label: 'Both families love it', value: 2 },
    ],
  },
  {
    id: 'trust',
    q: 'How is the trust level?',
    choices: [
      { label: 'Shaky', value: -2 },
      { label: 'Working on it', value: -1 },
      { label: 'Pretty solid', value: 1 },
      { label: 'Unshakeable', value: 2 },
    ],
  },
];

function verdict(years: number): { headline: string; blurb: string; tone: 'red' | 'amber' | 'teal' | 'emerald' } {
  if (years >= 40) return { headline: 'Lifetime partners', blurb: 'Every signal points up. Decades of shared grocery runs and inside jokes ahead.', tone: 'emerald' };
  if (years >= 20) return { headline: 'Long haul', blurb: 'Built to last. You will see each other through milestones and knee surgery.', tone: 'emerald' };
  if (years >= 10) return { headline: 'A real chapter', blurb: 'At least a decade together if you keep doing what you\u2019re doing.', tone: 'teal' };
  if (years >= 5) return { headline: 'Solid arc', blurb: 'Five-plus years is a real arc. Strong fundamentals.', tone: 'teal' };
  if (years >= 2) return { headline: 'Meaningful stretch', blurb: 'A few years together if nothing external shakes loose.', tone: 'amber' };
  if (years >= 1) return { headline: 'A good year', blurb: 'Probably about a year. Use the signals to address the weakest spot.', tone: 'amber' };
  return { headline: 'Short arc', blurb: 'The signals are fragile. Does not mean it ends tomorrow \u2014 it means the weak spots need attention.', tone: 'red' };
}

export default function HowLongWillWeLast() {
  const [a, setA] = useState('Alex');
  const [b, setB] = useState('Sam');
  const [answers, setAnswers] = useState<Record<string, Answer | undefined>>({});

  const result = useMemo(() => {
    const vals = QUESTIONS.map((q) => answers[q.id]).filter((v): v is Answer => v !== undefined);
    if (vals.length === 0) return null;
    const answered = vals.length;
    const maxPerQ = 2;
    const minPerQ = -2;
    const total = vals.reduce((s, v) => s + v, 0);
    // Normalize sum into 0..1 range.
    const norm = (total - minPerQ * answered) / ((maxPerQ - minPerQ) * answered);
    const score = Math.round(norm * 100);
    // Map 0-100 to a 0-50 year range with a soft S-curve.
    const years = Math.round(50 * Math.pow(norm, 1.3) * 10) / 10;
    return { score, years, answered, breakdown: QUESTIONS.map((q) => ({ id: q.id, q: q.q, v: answers[q.id] })) };
  }, [answers]);

  const done = result && result.answered === QUESTIONS.length;
  const v = result ? verdict(result.years) : null;

  const toneClass = v
    ? {
        red: 'border-red-200 bg-red-50 text-red-900',
        amber: 'border-amber-200 bg-amber-50 text-amber-900',
        teal: 'border-teal-200 bg-teal-50 text-teal-900',
        emerald: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      }[v.tone]
    : '';

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="a">Your name</label>
          <input id="a" className="input" value={a} onChange={(e) => setA(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="b">Their name</label>
          <input id="b" className="input" value={b} onChange={(e) => setB(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((q) => (
          <div key={q.id} className="rounded-md border border-slate-200 bg-white p-3">
            <div className="text-sm font-medium text-slate-900">{q.q}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {q.choices.map((c) => {
                const selected = answers[q.id] === c.value;
                return (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setAnswers((s) => ({ ...s, [q.id]: c.value }))}
                    className={`rounded-md border px-3 py-1 text-sm transition ${
                      selected
                        ? 'border-brand-600 bg-brand-50 text-brand-800'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                    aria-pressed={selected}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{result?.answered ?? 0} / {QUESTIONS.length} answered</span>
        {result && result.answered > 0 && (
          <button type="button" onClick={() => setAnswers({})} className="text-brand-700 hover:underline">
            Reset answers
          </button>
        )}
      </div>

      {done && v && result && (
        <div className={`card text-center p-5 ${toneClass}`}>
          <div className="text-xs font-medium uppercase tracking-wide opacity-70">{a} + {b}</div>
          <div className="mt-1 text-5xl font-bold">
            {result.years < 1 ? `${Math.round(result.years * 12)} months` : `${result.years} years`}
          </div>
          <div className="mt-2 text-lg font-semibold">{v.headline}</div>
          <div className="mt-1 text-sm">{v.blurb}</div>
          <div className="mt-3 text-xs opacity-70">Composite score: {result.score} / 100</div>
        </div>
      )}

      <div className="rounded-md border border-pink-200 bg-pink-50 px-3 py-2 text-xs text-pink-900">
        <strong>Just for fun.</strong> This is a conversation starter, not a prediction. Real relationships depend on things a quiz can\u2019t measure \u2014 small daily kindnesses, timing, and how you both handle the bad days.
      </div>

      {done && result && v && (() => {
        const weakest = result.breakdown
          .filter((b) => b.v !== undefined && b.v <= 0)
          .sort((a, b) => (a.v ?? 0) - (b.v ?? 0))
          .slice(0, 3);
        const strongest = result.breakdown
          .filter((b) => b.v !== undefined && b.v >= 1)
          .sort((a, b) => (b.v ?? 0) - (a.v ?? 0))
          .slice(0, 3);
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: `${a} + ${b} \u2192 ${v.headline} (${result.years < 1 ? `${Math.round(result.years * 12)} months` : `${result.years} years`} estimate based on 8 signals).`,
          },
          strongest.length > 0
            ? {
                kind: 'comparison' as const,
                title: 'Strongest signals',
                rows: strongest.map((s) => ({ label: s.q, value: '+' + (s.v ?? 0) })),
              }
            : null,
          weakest.length > 0
            ? {
                kind: 'comparison' as const,
                title: 'Weakest signals (where the work is)',
                rows: weakest.map((s) => ({ label: s.q, value: String(s.v ?? 0) })),
              }
            : null,
          {
            kind: 'takeaway',
            text: 'The prediction is deterministic from your answers. Change one answer, watch the years move. Use the result as a map of what to talk about together \u2014 not as a forecast.',
          },
          {
            kind: 'nextStep',
            actions: [
              { href: '/games/love-calculator/', label: 'Love Calculator' },
              { href: '/games/flames-calculator/', label: 'FLAMES Calculator' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

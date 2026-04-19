import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, RefreshCw, Radio, Trophy, Flame, Snowflake } from 'lucide-react';

const STORAGE_KEY = 'vibecontext-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';
const WIN = 1000;

const TERMINAL_GREEN = '#22c55e';
const TERMINAL_GLOW = '#4ade80';

type Level = {
  id: string;
  targetWord: string;
  hint: string;
  proximityMap: Record<string, number>;
};

// A hand-curated "warmth" map for target COFFEE — 200+ entries spread 1–999.
const LEVEL: Level = {
  id: 'coffee-v1',
  targetWord: 'coffee',
  hint: 'Ritual fuel — beans go in, the day starts.',
  proximityMap: {
    espresso: 975, latte: 955, cappuccino: 945, americano: 930, mocha: 935,
    macchiato: 930, cortado: 905, ristretto: 895, frappuccino: 870, frappe: 860,
    flatwhite: 870, java: 960, joe: 920, cuppa: 880, barista: 880,
    brew: 915, brewed: 890, brewing: 870, roast: 910, roasted: 895, roasty: 730,
    grounds: 875, bean: 925, beans: 920, caffeine: 955, caffeinated: 870,
    decaffeinated: 830, decaf: 870, arabica: 920, robusta: 880, crema: 850,
    grind: 840, grinder: 825, grinding: 800, ground: 790,
    cafe: 920, coffeeshop: 945, coffeehouse: 930, starbucks: 835, dunkin: 785,
    nespresso: 800, illy: 755, lavazza: 745, peets: 720, folgers: 625, maxwell: 475,
    mug: 785, cup: 685, cups: 675, kettle: 640, percolator: 780, chemex: 800,
    aeropress: 800, frenchpress: 810, french: 565, press: 515, keurig: 755, moka: 790,
    pod: 755, pods: 745, filter: 760, dripped: 780, drip: 790, pour: 560, poured: 525,
    pourover: 835, tumbler: 540, thermos: 585, carafe: 620, travelmug: 735,
    steam: 700, steamed: 740, steaming: 720, foam: 720, foamed: 700, froth: 685,
    frothed: 665, steamer: 655, wand: 450, crema2: 0,
    iced: 715, icedcoffee: 880, coldbrew: 900, cold: 560, hot: 565, warm: 510,
    temperature: 465, thermal: 420,
    bitter: 720, strong: 640, dark: 620, medium: 480, light: 365, smooth: 520,
    rich: 535, robust: 640, bold: 605, aroma: 785, aromatic: 720, fragrant: 650,
    flavor: 560, taste: 505, sweet: 455, acidic: 520, acidity: 540, balance: 420,
    notes: 470, tasting: 525, cupping: 710, mouthfeel: 585, finish: 425, body: 480,
    caramel: 545, vanilla: 535, hazelnut: 610, chocolate: 585, cocoa: 515, cacao: 500,
    milk: 610, cream: 625, creamer: 665, creamy: 560, sugar: 525, syrup: 485,
    sweetener: 465, honey: 395, stevia: 405,
    donut: 525, donuts: 515, pastry: 535, croissant: 545, muffin: 465, scone: 465,
    bagel: 425, biscuit: 405, sandwich: 285, toast: 425, cookies: 365,
    breakfast: 660, brunch: 565, morning: 725, dawn: 435, afternoon: 415, evening: 325,
    midnight: 365, wake: 625, awake: 615, sleepy: 435, tired: 435, jolt: 625, buzz: 625,
    energy: 585, energetic: 545, alert: 455, focus: 405, focused: 385, productive: 355,
    addiction: 525, addicted: 515, dependence: 395, routine: 435, ritual: 495, habit: 455,
    order: 405, menu: 325, counter: 325, shop: 445, store: 325, stand: 285, kiosk: 385,
    drivethru: 445, refill: 495, togo: 425, takeaway: 385, server: 245, waiter: 225,
    waitress: 225, customer: 235, tip: 265, receipt: 225,
    tea: 515, chai: 565, hotchocolate: 475, chocolatemilk: 405, drink: 565,
    beverage: 545, liquid: 385, fluid: 345, water: 335, juice: 275, soda: 235,
    soft: 185, alcohol: 205, wine: 165, beer: 155, cocktail: 185, smoothie: 305,
    plant: 285, seed: 345, tree: 275, tropical: 315, equator: 305, ethiopia: 560,
    colombia: 545, brazil: 535, kenya: 495, vietnam: 425, honduras: 385, guatemala: 405,
    yemen: 425, indonesia: 405, sumatra: 425,
    farm: 365, harvest: 395, crop: 325, cherry: 445, picking: 285, production: 265,
    trade: 245, export: 235, fair: 225, organic: 435, ethical: 315,
    roaster: 785, roastery: 745, roastmaster: 705, blend: 585, blended: 565,
    singleorigin: 725, origin: 385, varietal: 415, batch: 385, microlot: 625,
    cappuccinos: 940, lattes: 950, mochas: 930, espressos: 970,
    break: 365, coffeebreak: 845, kitchen: 465, office: 285, desk: 285, laptop: 145,
    meeting: 205, work: 285, workday: 385, monday: 325, friday: 225,
    cozy: 495, comfort: 445, relax: 305, calm: 285, peaceful: 245,
    alarm: 485, clock: 325, snooze: 385, bedroom: 185, bed: 125, pillow: 115,
    dream: 125, sleep: 265, night: 215, nap: 280,
    coffin: 95, copper: 95, cough: 65, cover: 55, copy: 45, cozy2: 0,
    color: 35, corps: 55, cooker: 95, cooked: 65, cone: 55, corn: 45, confess: 35,
    keyboard: 25, mouse: 18, rocket: 15, planet: 12, star: 15, phone: 35,
    truck: 20, car: 20, bicycle: 15, highway: 12, forest: 60, river: 30,
    mountain: 40, ocean: 25, book: 80, novel: 60, music: 120, movie: 90,
    love: 140, peace: 80, war: 20, sun: 80, moon: 60, sky: 45, cloud: 120,
    rain: 180, snow: 60, winter: 180, summer: 120, fire: 220, flame: 200,
    smoke: 180, ember: 220, brown: 320, black: 480, blackcoffee: 850,
  },
};

// strip the intentional sentinel zeros (used to avoid dup-key authoring issues)
Object.keys(LEVEL.proximityMap).forEach((k) => { if (LEVEL.proximityMap[k] === 0) delete LEVEL.proximityMap[k]; });

type Guess = { word: string; score: number; cold: boolean };

function rankOf(score: number): { label: string; color: string; Icon?: typeof Flame } {
  if (score >= WIN) return { label: 'SIGNAL LOCKED', color: '#fcd34d', Icon: Flame };
  if (score >= 900) return { label: 'Scorching', color: '#ef4444', Icon: Flame };
  if (score >= 750) return { label: 'Hot', color: '#f97316', Icon: Flame };
  if (score >= 500) return { label: 'Warm', color: '#eab308' };
  if (score >= 300) return { label: 'Cool', color: '#22c55e' };
  if (score >= 100) return { label: 'Cold', color: '#38bdf8', Icon: Snowflake };
  return { label: 'Frozen', color: '#64748b', Icon: Snowflake };
}

function coldHashScore(word: string): number {
  let h = 0;
  for (let i = 0; i < word.length; i++) h = ((h * 31) + word.charCodeAt(i)) >>> 0;
  return 1 + (h % 12);
}

export default function VibeContext() {
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [error, setError] = useState('');
  const [dict, setDict] = useState<Set<string> | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // load dictionary
  useEffect(() => {
    let cancelled = false;
    fetch('/data/enable.txt')
      .then((r) => r.text())
      .then((t) => {
        if (cancelled) return;
        const s = new Set(t.split('\n').map((w) => w.trim().toLowerCase()).filter(Boolean));
        setDict(s);
      })
      .catch(() => { /* fallback: treat guesses outside map as cold */ });
    return () => { cancelled = true; };
  }, []);

  // load stats
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setTotalWins(d.totalWins ?? 0);
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalWins })); } catch {}
  }, [totalWins, hydrated]);

  const sortedHistory = useMemo(() => [...guesses].sort((a, b) => b.score - a.score), [guesses]);

  function submit() {
    if (won) return;
    const w = guess.trim().toLowerCase();
    if (!w) return;
    if (!/^[a-z]+$/.test(w)) { flash('Alphabetic only'); return; }
    if (w.length < 2) { flash('Too short'); return; }
    if (guesses.some((g) => g.word === w)) { flash('Already tried'); return; }

    let score: number;
    let cold = false;
    if (w === LEVEL.targetWord) {
      score = WIN;
    } else if (LEVEL.proximityMap[w] != null) {
      score = LEVEL.proximityMap[w];
    } else if (dict && dict.has(w)) {
      score = coldHashScore(w);
      cold = true;
    } else if (!dict) {
      // dictionary still loading — accept as cold
      score = coldHashScore(w);
      cold = true;
    } else {
      flash('Not a recognized word');
      return;
    }

    const g: Guess = { word: w, score, cold };
    setGuesses((prev) => [g, ...prev]);
    setBest((b) => Math.max(b, score));
    setGuess('');
    if (score >= WIN) {
      setWon(true);
      setTotalWins((n) => n + 1);
    }
  }

  function flash(msg: string) {
    setError(msg);
    window.setTimeout(() => setError(''), 1400);
  }

  function reset() {
    setGuess(''); setGuesses([]); setError(''); setWon(false); setBest(0);
    inputRef.current?.focus();
  }

  useEffect(() => { inputRef.current?.focus(); }, []);

  const bestRank = rankOf(best);
  const bestPct = Math.min(100, (best / WIN) * 100);

  return (
    <div style={{ fontFamily: FONT_STACK, background: '#020617' }} className="w-full max-w-2xl mx-auto px-4 pb-16">
      <style>{`
        @keyframes vx-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        @keyframes vx-scan {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(300%) }
        }
      `}</style>

      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Radio size={18} style={{ color: TERMINAL_GREEN }} />
          <span className="tracking-[0.25em] text-sm uppercase" style={{ color: TERMINAL_GREEN }}>vibecontext</span>
          <span style={{ color: TERMINAL_GLOW, animation: 'vx-blink 1s steps(2) infinite' }}>▌</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(34,197,94,0.8)' }}>
          <Trophy size={13} /> locked {totalWins}
        </div>
      </header>

      <div className="rounded-md border p-4 md:p-5" style={{ borderColor: 'rgba(34,197,94,0.35)' }}>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'rgba(34,197,94,0.7)' }}>
          // target acquired — send guesses
        </div>
        <div className="text-sm mb-3" style={{ color: TERMINAL_GLOW }}>{LEVEL.hint}</div>

        {/* signal meter */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] uppercase tracking-widest mb-1" style={{ color: bestRank.color }}>
            <span className="flex items-center gap-1">
              {bestRank.Icon ? <bestRank.Icon size={12} /> : null}
              signal · {bestRank.label}
            </span>
            <span>{best}/1000</span>
          </div>
          <div className="relative h-2 rounded-sm overflow-hidden" style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <motion.div
              className="h-full"
              style={{ background: `linear-gradient(90deg, #0ea5e9, ${bestRank.color})`, boxShadow: `0 0 10px ${bestRank.color}` }}
              animate={{ width: `${bestPct}%` }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            />
            <div
              className="absolute inset-y-0 w-12 opacity-30"
              style={{
                background: `linear-gradient(90deg, transparent, ${TERMINAL_GLOW}, transparent)`,
                animation: 'vx-scan 2.4s linear infinite',
              }}
            />
          </div>
        </div>

        {/* input row */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs tracking-widest"
              style={{ color: 'rgba(34,197,94,0.6)' }}
            >&gt;</span>
            <input
              ref={inputRef}
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              disabled={won}
              placeholder="type a guess and hit enter"
              className="w-full pl-7 pr-3 py-2 rounded-sm text-sm bg-transparent outline-none"
              style={{
                border: `1px solid rgba(34,197,94,0.35)`,
                color: TERMINAL_GLOW,
                caretColor: TERMINAL_GREEN,
                fontFamily: FONT_STACK,
              }}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={submit}
            disabled={won}
            className="px-3 py-2 rounded-sm text-xs uppercase tracking-widest flex items-center gap-1"
            style={{
              border: `1px solid ${TERMINAL_GREEN}`,
              color: TERMINAL_GREEN,
              background: 'rgba(34,197,94,0.08)',
              opacity: won ? 0.4 : 1,
            }}
          >
            <Send size={13} /> send
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="px-3 py-2 rounded-sm text-xs uppercase tracking-widest flex items-center gap-1"
            style={{
              border: `1px solid rgba(148,163,184,0.4)`,
              color: 'rgba(148,163,184,0.85)',
            }}
          >
            <RefreshCw size={13} /> reset
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-xs uppercase tracking-wider"
              style={{ color: '#f87171' }}
            >
              ✘ {error}
            </motion.div>
          )}
          {won && (
            <motion.div
              key="won"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-center py-2 rounded-sm"
              style={{ background: 'rgba(252,211,77,0.08)', border: '1px solid rgba(252,211,77,0.5)', color: '#fcd34d' }}
            >
              ✓ signal locked in {guesses.length} — target was <strong>{LEVEL.targetWord.toUpperCase()}</strong>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* history */}
      {guesses.length > 0 && (
        <div className="mt-4 rounded-md border" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
          <div className="grid grid-cols-[2.5rem_1fr_3.5rem_1fr] gap-2 px-3 py-2 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(34,197,94,0.5)', borderBottom: '1px solid rgba(34,197,94,0.15)' }}>
            <span>#</span><span>guess</span><span>score</span><span>warmth</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {sortedHistory.map((g, i) => {
              const r = rankOf(g.score);
              const pct = Math.min(100, (g.score / WIN) * 100);
              const isLatest = guesses[0] && guesses[0].word === g.word;
              return (
                <motion.div
                  key={g.word}
                  initial={isLatest ? { backgroundColor: 'rgba(34,197,94,0.18)' } : false}
                  animate={{ backgroundColor: 'rgba(0,0,0,0)' }}
                  transition={{ duration: 1.2 }}
                  className="grid grid-cols-[2.5rem_1fr_3.5rem_1fr] gap-2 px-3 py-1.5 text-xs items-center"
                  style={{ color: r.color, borderTop: i === 0 ? undefined : '1px solid rgba(34,197,94,0.08)' }}
                >
                  <span style={{ color: 'rgba(148,163,184,0.6)' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ color: g.cold ? 'rgba(148,163,184,0.85)' : r.color }}>{g.word}</span>
                  <span>{g.score}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-sm" style={{ background: 'rgba(148,163,184,0.15)' }}>
                      <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: r.color, boxShadow: `0 0 6px ${r.color}` }} />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest" style={{ minWidth: '4.5rem', textAlign: 'right' }}>{r.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 text-[10px] uppercase tracking-widest" style={{ color: 'rgba(148,163,184,0.5)' }}>
        guesses: {guesses.length} · best: {best} · corpus: {dict ? `${dict.size.toLocaleString()} words` : 'loading…'}
      </div>
    </div>
  );
}

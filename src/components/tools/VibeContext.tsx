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

const LEVELS: Level[] = [
  {
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
      frothed: 665, steamer: 655, wand: 450,
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
      coffin: 95, copper: 95, cough: 65, cover: 55, copy: 45,
      color: 35, corps: 55, cooker: 95, cooked: 65, cone: 55, corn: 45, confess: 35,
      keyboard: 25, mouse: 18, rocket: 15, planet: 12, star: 15, phone: 35,
      truck: 20, car: 20, bicycle: 15, highway: 12, forest: 60, river: 30,
      mountain: 40, ocean: 25, book: 80, novel: 60, music: 120, movie: 90,
      love: 140, peace: 80, war: 20, sun: 80, moon: 60, sky: 45, cloud: 120,
      rain: 180, snow: 60, winter: 180, summer: 120, fire: 220, flame: 200,
      smoke: 180, ember: 220, brown: 320, black: 480, blackcoffee: 850,
    },
  },
  {
    id: 'ocean-v1',
    targetWord: 'ocean',
    hint: 'Blue planet\'s largest commons — salt, tide, and depth.',
    proximityMap: {
      sea: 970, seas: 945, pacific: 945, atlantic: 945, indian: 830, arctic: 865,
      southern: 700, mediterranean: 735, caribbean: 715,
      wave: 895, waves: 885, tide: 880, tides: 870, tidal: 835, current: 790,
      currents: 780, swell: 780, surf: 820, surfing: 740, riptide: 755,
      beach: 835, shore: 870, shoreline: 825, coast: 875, coastal: 820, coastline: 840,
      sand: 745, sandy: 680, pebble: 435, rocky: 385, cliff: 520, cove: 635, bay: 745, bays: 690,
      gulf: 805, strait: 745, channel: 545, reef: 815, reefs: 795, lagoon: 725,
      harbor: 695, harbour: 685, port: 595, marina: 585, pier: 545, dock: 520, jetty: 540,
      salt: 770, saltwater: 850, saline: 730, salinity: 775, brine: 670, briny: 665,
      deep: 770, depth: 785, abyss: 780, abyssal: 775, trench: 820, marianas: 815,
      seafloor: 815, seabed: 805, bathymetry: 715, pelagic: 740, benthic: 680,
      fish: 735, fishing: 665, fisherman: 615, trawler: 595, trawl: 545, net: 365,
      marine: 875, maritime: 810, nautical: 795, aquatic: 725, subaquatic: 700,
      shark: 785, sharks: 775, whale: 860, whales: 850, dolphin: 805, dolphins: 795,
      orca: 770, octopus: 735, squid: 715, jellyfish: 705, turtle: 715, seal: 715,
      seahorse: 680, crab: 615, lobster: 595, shrimp: 525, krill: 675, plankton: 750,
      coral: 820, anemone: 715, kelp: 745, seaweed: 785, algae: 635, phytoplankton: 730,
      boat: 645, ship: 745, vessel: 665, shipwreck: 745, yacht: 585, sailboat: 625,
      sail: 595, sailor: 615, sailing: 625, navy: 545, submarine: 745, submersible: 735,
      scuba: 705, snorkel: 685, diving: 735, diver: 705,
      water: 795, waters: 785, aqua: 660, h2o: 545, wet: 425, moist: 325,
      liquid: 535, fluid: 475,
      storm: 635, hurricane: 780, typhoon: 770, cyclone: 740, tsunami: 810, tropical: 620,
      equator: 605, global: 485, climate: 540, elnino: 705, lanina: 695,
      blue: 545, deepblue: 765, turquoise: 565, aquamarine: 635, navyblue: 445,
      horizon: 695, sunset: 445, sunrise: 435, mist: 385, fog: 405,
      island: 725, islands: 715, isle: 665, archipelago: 755, atoll: 775, peninsula: 625,
      cape: 585, bermuda: 525, hawaii: 615, maldives: 605, polynesia: 615,
      lake: 455, lakes: 435, river: 385, rivers: 375, pond: 285, stream: 305,
      creek: 265, brook: 185, puddle: 95, pool: 225, swamp: 235, marsh: 265,
      earth: 535, planet: 475, world: 425, globe: 495, hemisphere: 545,
      explorer: 525, voyage: 615, expedition: 535, cousteau: 705, magellan: 595,
      pollution: 565, plastic: 455, oil: 385, spill: 415,
      salty: 665, fishy: 445, breeze: 605, seabreeze: 795, seagull: 775, gull: 665, albatross: 615,
      pearl: 475, oyster: 565, mussel: 435, clam: 445, starfish: 635,
      deepsea: 855, seascape: 775, oceanic: 915, oceanography: 895, oceanographer: 880,
      desert: 85, forest: 115, mountain: 165, sky: 245, cloud: 205, space: 165, star: 65,
      moon: 135, sun: 125, garden: 45, city: 45, building: 25, car: 20, computer: 15,
      phone: 15, music: 55, book: 65, chair: 15, table: 15,
    },
  },
  {
    id: 'music-v1',
    targetWord: 'music',
    hint: 'Structured sound — notes in time.',
    proximityMap: {
      song: 895, songs: 875, melody: 905, melodic: 870, harmony: 885, rhythm: 880,
      rhythmic: 815, beat: 820, tune: 880, tunes: 855, sound: 765, sounds: 725,
      track: 795, tracks: 775, album: 855, albums: 825, record: 725, records: 700,
      vinyl: 715, cd: 625, cassette: 615, mixtape: 715, single: 635, ep: 555, lp: 595,
      note: 770, notes: 730, chord: 855, chords: 825, scale: 725, key: 615, tempo: 835,
      bpm: 755, pitch: 765, octave: 805, tonal: 715, tonality: 705, atonal: 625,
      bar: 465, measure: 555, riff: 815, hook: 745, chorus: 805, verse: 755, bridge: 615,
      sing: 805, singing: 785, singer: 795, sang: 705, voice: 755, vocal: 810, vocals: 800,
      vocalist: 770, soprano: 685, alto: 625, tenor: 645, baritone: 615, bass: 745, choir: 735,
      band: 860, bands: 830, group: 535, ensemble: 755, orchestra: 865, symphony: 810,
      conductor: 745, concert: 825, concerts: 795, gig: 735, tour: 675, festival: 735,
      stage: 645, venue: 605, audience: 565, crowd: 485, fan: 495, fans: 485,
      instrument: 895, instruments: 880, guitar: 830, guitars: 810, guitarist: 795,
      bassist: 755, drums: 825, drum: 815, drummer: 800, piano: 835, pianist: 795,
      keyboard: 745, synth: 755, synthesizer: 745, violin: 805, violinist: 755,
      cello: 775, viola: 725, harp: 695, flute: 765, clarinet: 745, saxophone: 785,
      trumpet: 765, trombone: 715, horn: 625, oboe: 685, bassoon: 655,
      amplifier: 655, amp: 625, pedal: 505, strings: 715, fret: 565, pick: 355, bow: 315,
      rock: 765, pop: 775, jazz: 830, blues: 815, classical: 865, folk: 745, country: 685,
      hiphop: 765, rap: 735, reggae: 725, metal: 695, punk: 685, electronic: 755,
      techno: 705, house: 445, edm: 715, ambient: 675, soul: 725, gospel: 705, funk: 725,
      disco: 705, indie: 665, alternative: 625, opera: 795, musical: 905,
      composer: 835, composition: 815, composing: 795, arranger: 745, arrangement: 735,
      score: 645, scoring: 615, sheet: 615, sheetmusic: 815, lyric: 815, lyrics: 825,
      lyricist: 785, poet: 515, verse2: 0,
      play: 675, playing: 665, player: 555, performed: 685, performer: 725, performance: 745,
      rehearsal: 625, practice: 535, recording: 755, studio: 745, mixing: 665, mastering: 635,
      producer: 715, production: 625,
      listen: 665, listening: 655, listener: 615, hearing: 555, hear: 545, heard: 515,
      loud: 455, quiet: 335, soft: 305, volume: 505, stereo: 575, mono: 465,
      earphone: 525, earphones: 515, headphone: 535, headphones: 525, speaker: 565, speakers: 555,
      bluetooth: 385, spotify: 685, apple: 325, pandora: 555, soundcloud: 635, tidal: 525,
      youtube: 475, radio: 625, podcast: 415, streaming: 525,
      dance: 645, dancer: 585, dancing: 615, ballet: 625, choreography: 565,
      emotion: 515, mood: 525, feeling: 485, vibe: 575, groove: 745, swing: 605,
      art: 585, artist: 665, creative: 525, creativity: 485,
      quiet2: 0, silent: 225, silence: 235,
      film: 225, movie: 215, tv: 115, show: 255, book: 95, novel: 55, poem: 315, poetry: 385,
      computer: 45, phone: 85, kitchen: 15, food: 15, car: 35, travel: 45, sport: 55,
      forest: 15, mountain: 25, ocean: 55, river: 15, sky: 25, moon: 85, sun: 55,
      love: 345, war: 85, peace: 165, history: 145,
    },
  },
];

// strip the intentional sentinel zeros (used to avoid dup-key authoring issues)
for (const lvl of LEVELS) {
  Object.keys(lvl.proximityMap).forEach((k) => { if (lvl.proximityMap[k] === 0) delete lvl.proximityMap[k]; });
}

function pickLevel(excludeId?: string): Level {
  const pool = excludeId ? LEVELS.filter((l) => l.id !== excludeId) : LEVELS;
  const src = pool.length > 0 ? pool : LEVELS;
  return src[Math.floor(Math.random() * src.length)];
}

type Guess = { word: string; score: number; cold: boolean };

function rankOf(score: number): { label: string; color: string; Icon?: typeof Flame } {
  if (score >= WIN) return { label: 'SIGNAL LOCKED', color: '#fcd34d', Icon: Flame };
  if (score >= 900) return { label: 'Scorching', color: '#ef4444', Icon: Flame };
  if (score >= 750) return { label: 'Hot', color: '#f97316', Icon: Flame };
  if (score >= 500) return { label: 'Warm', color: '#eab308' };
  if (score >= 300) return { label: 'Cool', color: '#22c55e' };
  if (score >= 100) return { label: 'Cold', color: '#38bdf8', Icon: Snowflake };
  return { label: 'Frozen', color: '#94a3b8', Icon: Snowflake };
}

function coldHashScore(word: string): number {
  let h = 0;
  for (let i = 0; i < word.length; i++) h = ((h * 31) + word.charCodeAt(i)) >>> 0;
  return 1 + (h % 12);
}

export default function VibeContext() {
  const [level, setLevel] = useState<Level>(() => LEVELS[0]);
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [error, setError] = useState('');
  const [dict, setDict] = useState<Set<string> | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLevel(pickLevel()); }, []);

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
    if (w === level.targetWord) {
      score = WIN;
    } else if (level.proximityMap[w] != null) {
      score = level.proximityMap[w];
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
    setLevel((cur) => pickLevel(cur.id));
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
        <div className="text-sm mb-3" style={{ color: TERMINAL_GLOW }}>{level.hint}</div>

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
              ✓ signal locked in {guesses.length} — target was <strong>{level.targetWord.toUpperCase()}</strong>
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

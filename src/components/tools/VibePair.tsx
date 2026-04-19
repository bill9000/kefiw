import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Plus, Trophy, RefreshCw,
  Lightbulb, Home, Snowflake, User, Flame, Truck, Star, Fish,
  Sun, Flower2, Book, Briefcase, Eye, Circle, Dog, Coffee, Cake,
  Cat, Moon, Footprints, Printer, Rocket, Ship, Bird,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Puzzle = {
  iconLeft: LucideIcon;
  iconRight: LucideIcon;
  labelLeft: string;
  labelRight: string;
  answer: string;
};

const PUZZLES: Puzzle[] = [
  { iconLeft: Lightbulb,  iconRight: Home,       labelLeft: 'LIGHT',  labelRight: 'HOUSE',  answer: 'LIGHTHOUSE' },
  { iconLeft: Snowflake,  iconRight: User,       labelLeft: 'SNOW',   labelRight: 'MAN',    answer: 'SNOWMAN' },
  { iconLeft: Flame,      iconRight: Truck,      labelLeft: 'FIRE',   labelRight: 'TRUCK',  answer: 'FIRETRUCK' },
  { iconLeft: Star,       iconRight: Fish,       labelLeft: 'STAR',   labelRight: 'FISH',   answer: 'STARFISH' },
  { iconLeft: Sun,        iconRight: Flower2,    labelLeft: 'SUN',    labelRight: 'FLOWER', answer: 'SUNFLOWER' },
  { iconLeft: Book,       iconRight: Briefcase,  labelLeft: 'BOOK',   labelRight: 'CASE',   answer: 'BOOKCASE' },
  { iconLeft: Eye,        iconRight: Circle,     labelLeft: 'EYE',    labelRight: 'BALL',   answer: 'EYEBALL' },
  { iconLeft: Dog,        iconRight: Home,       labelLeft: 'DOG',    labelRight: 'HOUSE',  answer: 'DOGHOUSE' },
  { iconLeft: Coffee,     iconRight: Cake,       labelLeft: 'CUP',    labelRight: 'CAKE',   answer: 'CUPCAKE' },
  { iconLeft: Cat,        iconRight: Fish,       labelLeft: 'CAT',    labelRight: 'FISH',   answer: 'CATFISH' },
  { iconLeft: Moon,       iconRight: Lightbulb,  labelLeft: 'MOON',   labelRight: 'LIGHT',  answer: 'MOONLIGHT' },
  { iconLeft: Footprints, iconRight: Printer,    labelLeft: 'FOOT',   labelRight: 'PRINT',  answer: 'FOOTPRINT' },
  { iconLeft: Bird,       iconRight: Home,       labelLeft: 'BIRD',   labelRight: 'HOUSE',  answer: 'BIRDHOUSE' },
  { iconLeft: Rocket,     iconRight: Ship,       labelLeft: 'ROCKET', labelRight: 'SHIP',   answer: 'ROCKETSHIP' },
];

const STORAGE_KEY = 'vibepair-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';
const HINT_COST = 25;
const WIN_REWARD = 30;
const INITIAL_VIBES = 50;

type Tile = { id: string; ch: string };

function rand() { return Math.random().toString(36).slice(2, 9); }
function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildBank(answer: string): Tile[] {
  const target = Math.max(12, Math.min(14, answer.length + 4));
  const noiseCount = target - answer.length;
  const answerTiles: Tile[] = answer.split('').map((ch) => ({ id: `a-${rand()}`, ch }));
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const answerLetterSet = new Set(answer.split(''));
  const noise: Tile[] = [];
  while (noise.length < noiseCount) {
    const ch = alphabet[Math.floor(Math.random() * alphabet.length)];
    if (answerLetterSet.has(ch) && Math.random() < 0.7) continue;
    noise.push({ id: `n-${rand()}`, ch });
  }
  return shuffleArr([...answerTiles, ...noise]);
}

export default function VibePair() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx];

  const [bank, setBank] = useState<Tile[]>(() => buildBank(PUZZLES[0].answer));
  const [slots, setSlots] = useState<Array<Tile | null>>(() => Array(PUZZLES[0].answer.length).fill(null));
  const [solved, setSolved] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [flashErr, setFlashErr] = useState(false);
  const [vibePoints, setVibePoints] = useState(INITIAL_VIBES);
  const [synapses, setSynapses] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string; kind: 'info' | 'miss' | 'win' } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setSynapses(s.synapses ?? 0);
        setVibePoints(typeof s.vibePoints === 'number' ? s.vibePoints : INITIAL_VIBES);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ synapses, vibePoints }));
    } catch {}
  }, [synapses, vibePoints, hydrated]);

  // Answer validation
  useEffect(() => {
    if (solved) return;
    if (slots.every((s) => s !== null)) {
      const attempt = slots.map((s) => s!.ch).join('');
      if (attempt === puzzle.answer) {
        setSolved(true);
        setCelebrate(true);
        setSynapses((n) => n + 1);
        setVibePoints((p) => p + WIN_REWARD);
        flashToast(`SYNAPSE SYNCED · ${puzzle.answer} · +${WIN_REWARD}`, 'win', 1600);
        setTimeout(() => {
          setCelebrate(false);
          nextPuzzle();
        }, 1800);
      } else {
        setFlashErr(true);
        flashToast('Pattern mismatch', 'miss', 800);
        setTimeout(() => setFlashErr(false), 500);
      }
    }
  }, [slots, puzzle, solved]);

  function flashToast(text: string, kind: 'info' | 'miss' | 'win', ms = 1200) {
    const id = Date.now() + Math.random();
    setToast({ id, text, kind });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), ms);
  }

  function resetPuzzle(i: number) {
    const p = PUZZLES[i];
    setBank(buildBank(p.answer));
    setSlots(Array(p.answer.length).fill(null));
    setSolved(false);
    setCelebrate(false);
    setFlashErr(false);
  }

  function nextPuzzle() {
    const next = (puzzleIdx + 1) % PUZZLES.length;
    setPuzzleIdx(next);
    resetPuzzle(next);
  }

  function restart() {
    resetPuzzle(puzzleIdx);
  }

  function placeLetter(tile: Tile) {
    if (solved) return;
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx < 0) return;
    setBank((b) => b.filter((t) => t.id !== tile.id));
    setSlots((s) => {
      const n = [...s];
      n[emptyIdx] = tile;
      return n;
    });
  }

  function unplaceLetter(slotIdx: number) {
    if (solved) return;
    const tile = slots[slotIdx];
    if (!tile) return;
    setSlots((s) => {
      const n = [...s];
      n[slotIdx] = null;
      return n;
    });
    setBank((b) => [...b, tile]);
  }

  function neuralHint() {
    if (solved) return;
    if (vibePoints < HINT_COST) {
      flashToast(`Need ${HINT_COST} vibe points`, 'miss');
      return;
    }
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx < 0) {
      // All filled but not solved — swap a wrong letter
      const wrongIdx = slots.findIndex((s, i) => s && s.ch !== puzzle.answer[i]);
      if (wrongIdx < 0) return;
      const wrong = slots[wrongIdx]!;
      setSlots((s) => {
        const n = [...s];
        n[wrongIdx] = null;
        return n;
      });
      setBank((b) => [...b, wrong]);
      setVibePoints((p) => p - HINT_COST);
      flashToast(`−${HINT_COST} · cleared slot ${wrongIdx + 1}`, 'info');
      return;
    }
    const expected = puzzle.answer[emptyIdx];
    const tileInBank = bank.find((t) => t.ch === expected);
    if (tileInBank) {
      setBank((b) => b.filter((t) => t.id !== tileInBank.id));
      setSlots((s) => {
        const n = [...s];
        n[emptyIdx] = tileInBank;
        return n;
      });
      setVibePoints((p) => p - HINT_COST);
      flashToast(`−${HINT_COST} · neural hint`, 'info');
      return;
    }
    // Letter exists only in slots — move it
    const misplacedIdx = slots.findIndex((s, i) => s && s.ch === expected && i !== emptyIdx);
    if (misplacedIdx >= 0) {
      const misplaced = slots[misplacedIdx]!;
      setSlots((s) => {
        const n = [...s];
        n[emptyIdx] = misplaced;
        n[misplacedIdx] = null;
        return n;
      });
      setVibePoints((p) => p - HINT_COST);
      flashToast(`−${HINT_COST} · rerouted`, 'info');
    }
  }

  const LIcon = puzzle.iconLeft;
  const RIcon = puzzle.iconRight;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-cyan-500/20"
      style={{ background: '#0f172a', color: '#e2e8f0', minHeight: 820, fontFamily: FONT_STACK }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(34,211,238,0.06) 0px, rgba(34,211,238,0.06) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-pink-400" />
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">VibePair</span>
          <span className="ml-2 text-[11px] tracking-[0.25em] text-slate-500">
            // LEVEL {puzzleIdx + 1}/{PUZZLES.length}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="text-cyan-300/70">
            VIBE <span className="tabular-nums text-cyan-200">{vibePoints}</span>
          </div>
          <div className="text-pink-300/70">
            SYNAPSES <span className="tabular-nums text-pink-200">{synapses}</span>
          </div>
        </div>
      </div>

      {/* Icon rebus */}
      <div className="relative flex flex-col items-center justify-center gap-3 px-4 pb-3 md:flex-row md:gap-6">
        <motion.div
          key={`L-${puzzleIdx}`}
          initial={{ opacity: 0, scale: 0.9, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="relative flex h-40 w-40 flex-col items-center justify-center rounded-xl border-2 border-cyan-400 bg-slate-950/60 sm:h-44 sm:w-44"
          style={{
            boxShadow:
              '0 0 18px rgba(34,211,238,0.55), inset 0 0 28px rgba(34,211,238,0.18)',
          }}
        >
          <LIcon size={72} strokeWidth={1.5} className="text-cyan-300" />
          <div className="mt-1 text-[10px] uppercase tracking-[0.4em] text-cyan-300/70">
            {puzzle.labelLeft}
          </div>
        </motion.div>

        <motion.div
          key={`plus-${puzzleIdx}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring' }}
          className="text-2xl font-black text-slate-500"
        >
          <Plus size={28} className="text-fuchsia-400" />
        </motion.div>

        <motion.div
          key={`R-${puzzleIdx}`}
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.08 }}
          className="relative flex h-40 w-40 flex-col items-center justify-center rounded-xl border-2 border-pink-400 bg-slate-950/60 sm:h-44 sm:w-44"
          style={{
            boxShadow:
              '0 0 18px rgba(236,72,153,0.55), inset 0 0 28px rgba(236,72,153,0.18)',
          }}
        >
          <RIcon size={72} strokeWidth={1.5} className="text-pink-300" />
          <div className="mt-1 text-[10px] uppercase tracking-[0.4em] text-pink-300/70">
            {puzzle.labelRight}
          </div>
        </motion.div>
      </div>

      {/* Slots */}
      <div className="relative flex justify-center px-4 py-4">
        <div
          className={`flex flex-wrap justify-center gap-1.5 rounded-lg border px-4 py-3 transition-colors ${
            flashErr ? 'border-rose-500 shadow-[0_0_16px_rgba(239,68,68,0.55)]' : 'border-cyan-500/30 bg-slate-950/40'
          }`}
        >
          {slots.map((tile, i) => (
            <button
              key={i}
              onClick={() => tile && unplaceLetter(i)}
              disabled={!tile || solved}
              className="flex h-11 w-9 items-center justify-center rounded-md border border-cyan-400/50 bg-slate-900/60 text-xl font-bold uppercase tracking-[0.05em] text-cyan-100 transition-colors hover:border-cyan-300 sm:h-12 sm:w-10 sm:text-2xl"
              style={
                tile
                  ? { boxShadow: '0 0 12px rgba(34,211,238,0.45), inset 0 0 6px rgba(34,211,238,0.25)' }
                  : { boxShadow: 'inset 0 0 10px rgba(2,6,23,0.8)' }
              }
            >
              <AnimatePresence mode="popLayout">
                {tile && (
                  <motion.span
                    key={tile.id}
                    layoutId={tile.id}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    className="pointer-events-none"
                  >
                    {tile.ch}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </div>
      </div>

      {/* Hint control */}
      <div className="relative flex items-center justify-center gap-2 px-4 pb-3">
        <button
          onClick={neuralHint}
          disabled={solved || vibePoints < HINT_COST}
          className="flex items-center gap-1.5 rounded border border-fuchsia-400/60 bg-fuchsia-500/10 px-3 py-1.5 text-xs uppercase tracking-widest text-fuchsia-100 hover:bg-fuchsia-500/20 disabled:opacity-40"
          style={
            !solved && vibePoints >= HINT_COST
              ? { boxShadow: '0 0 12px rgba(236,72,153,0.45)' }
              : undefined
          }
        >
          <Zap size={14} /> Neural Hint · −{HINT_COST}
        </button>
        <button
          onClick={restart}
          disabled={solved}
          className="flex items-center gap-1.5 rounded border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-xs uppercase tracking-widest text-slate-200 hover:border-cyan-400 hover:text-cyan-200 disabled:opacity-40"
        >
          <RefreshCw size={14} /> Reset
        </button>
      </div>

      {/* Bank */}
      <div className="relative flex justify-center px-4 pb-4">
        <div className="flex max-w-md flex-wrap justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] p-3 backdrop-blur-sm">
          {bank.length === 0 && (
            <div className="px-6 py-2 text-[11px] uppercase tracking-[0.3em] text-slate-500">
              // bank empty
            </div>
          )}
          {bank.map((tile) => (
            <motion.button
              key={tile.id}
              layoutId={tile.id}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              onClick={() => placeLetter(tile)}
              disabled={solved}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-white/25 bg-white/[0.06] text-xl font-bold uppercase tracking-[0.05em] text-white backdrop-blur transition-colors hover:border-cyan-300 hover:bg-cyan-500/15 sm:h-12 sm:w-12 sm:text-2xl"
              style={{
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.08), 0 2px 8px rgba(0,0,0,0.4)',
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {tile.ch}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Toast */}
      <div className="relative flex min-h-[34px] justify-center py-2">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`rounded border px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                toast.kind === 'win'
                  ? 'border-cyan-300 bg-cyan-500/10 text-cyan-100 shadow-[0_0_14px_rgba(34,211,238,0.55)]'
                  : toast.kind === 'miss'
                  ? 'border-rose-400/60 bg-rose-500/10 text-rose-100'
                  : 'border-fuchsia-400/50 bg-fuchsia-500/10 text-fuchsia-100'
              }`}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration overlay */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.15, 1], opacity: [0, 1, 1] }}
              exit={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="rounded-lg border-2 border-cyan-300 bg-slate-950/80 px-8 py-5 text-center"
              style={{ boxShadow: '0 0 32px rgba(34,211,238,0.7)' }}
            >
              <Trophy size={34} className="mx-auto mb-1 text-cyan-300" />
              <div className="text-[10px] uppercase tracking-[0.4em] text-cyan-400">Vibe Synced</div>
              <div
                className="text-4xl font-black tracking-[0.08em]"
                style={{
                  color: '#a5f3fc',
                  textShadow: '0 0 14px #22d3ee, 0 0 28px #22d3ee',
                  fontFamily: FONT_STACK,
                }}
              >
                {puzzle.answer}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

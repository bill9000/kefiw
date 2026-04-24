import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Eraser, Send, Trophy, X } from 'lucide-react';

type Level = 1 | 2 | 3 | 4;
type Category = { key: string; name: string; level: Level; items: string[] };
type Puzzle = { id: string; title: string; categories: Category[] };

const LEVEL_META: Record<Level, { name: string; color: string; bg: string; border: string; text: string; glow: string }> = {
  1: { name: 'PROTOCOL',    color: '#3b82f6', bg: 'bg-blue-500/25',   border: 'border-blue-400',   text: 'text-blue-100',   glow: '0 0 18px rgba(59,130,246,0.55)'  },
  2: { name: 'LOGIC',       color: '#22c55e', bg: 'bg-green-500/25',  border: 'border-green-400',  text: 'text-green-100',  glow: '0 0 18px rgba(34,197,94,0.55)'   },
  3: { name: 'ENCRYPTION',  color: '#a855f7', bg: 'bg-purple-500/25', border: 'border-purple-400', text: 'text-purple-100', glow: '0 0 18px rgba(168,85,247,0.55)'  },
  4: { name: 'SOURCE CODE', color: '#eab308', bg: 'bg-yellow-500/25', border: 'border-yellow-400', text: 'text-yellow-100', glow: '0 0 18px rgba(234,179,8,0.55)'   },
};

const PUZZLES: Puzzle[] = [
  {
    id: 'ai-stack',
    title: 'AI Stack',
    categories: [
      { key: 'llms',   name: 'LLM Chatbots',    level: 1, items: ['GPT', 'CLAUDE', 'LLAMA', 'GEMINI'] },
      { key: 'fw',     name: 'JS Frameworks',   level: 2, items: ['REACT', 'VUE', 'SVELTE', 'ANGULAR'] },
      { key: 'cloud',  name: 'Cloud Platforms', level: 3, items: ['AWS', 'AZURE', 'VERCEL', 'HEROKU'] },
      { key: 'snakes', name: 'Snakes',          level: 4, items: ['PYTHON', 'COBRA', 'VIPER', 'MAMBA'] },
    ],
  },
  {
    id: 'terminal',
    title: 'Terminal World',
    categories: [
      { key: 'cmd',    name: 'Terminal Commands', level: 1, items: ['LS', 'CD', 'GREP', 'SUDO'] },
      { key: 'distro', name: 'Linux Distros',     level: 2, items: ['UBUNTU', 'FEDORA', 'ARCH', 'DEBIAN'] },
      { key: 'editor', name: 'Text Editors',      level: 3, items: ['VIM', 'EMACS', 'NANO', 'ATOM'] },
      { key: 'db',     name: 'Databases',         level: 4, items: ['POSTGRES', 'REDIS', 'MONGO', 'MYSQL'] },
    ],
  },
  {
    id: 'crypto',
    title: 'Secure Channel',
    categories: [
      { key: 'hash',   name: 'Hash Algorithms',   level: 1, items: ['SHA256', 'MD5', 'BLAKE', 'BCRYPT'] },
      { key: 'proto',  name: 'Network Protocols', level: 2, items: ['HTTP', 'SSH', 'FTP', 'DNS'] },
      { key: 'cipher', name: 'Ciphers',           level: 3, items: ['AES', 'RSA', 'DES', 'ECDSA'] },
      { key: 'ports',  name: 'Famous Ports',      level: 4, items: ['80', '443', '22', '21'] },
    ],
  },
];

const STORAGE_KEY = 'vibelink-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

type Tile = { id: string; label: string; categoryKey: string; level: Level };
type Stats = { wins: number; losses: number; streak: number; best: number };

function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildTiles(puzzle: Puzzle): Tile[] {
  return shuffleArr(
    puzzle.categories.flatMap((cat) =>
      cat.items.map((label) => ({
        id: `${cat.key}-${label}`,
        label,
        categoryKey: cat.key,
        level: cat.level,
      }))
    )
  );
}

type Toast = { id: number; text: string; kind: 'info' | 'miss' | 'win' };

export default function VibeLink() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = PUZZLES[puzzleIdx];
  const [tiles, setTiles] = useState<Tile[]>(() => buildTiles(puzzle));
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [solvedCats, setSolvedCats] = useState<Category[]>([]);
  const [lives, setLives] = useState(4);
  const [flickerIdx, setFlickerIdx] = useState<number | null>(null);
  const [shakeIds, setShakeIds] = useState<Set<string>>(() => new Set());
  const [toast, setToast] = useState<Toast | null>(null);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [stats, setStats] = useState<Stats>({ wins: 0, losses: 0, streak: 0, best: 0 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setStats({
          wins: s.wins ?? 0,
          losses: s.losses ?? 0,
          streak: s.streak ?? 0,
          best: s.best ?? 0,
        });
      }
    } catch {}
  }, []);

  function persistStats(s: Stats) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    } catch {}
  }

  function flashToast(text: string, kind: Toast['kind'], ms = 1400) {
    const id = Date.now() + Math.random();
    setToast({ id, text, kind });
    setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, ms);
  }

  function resetPuzzle(p: Puzzle) {
    setTiles(buildTiles(p));
    setSelected(new Set());
    setSolvedCats([]);
    setLives(4);
    setFlickerIdx(null);
    setShakeIds(new Set());
    setWon(false);
    setLost(false);
  }

  function nextPuzzle() {
    const next = (puzzleIdx + 1) % PUZZLES.length;
    setPuzzleIdx(next);
    resetPuzzle(PUZZLES[next]);
  }

  function restart() {
    resetPuzzle(puzzle);
  }

  function toggleTile(id: string) {
    if (won || lost) return;
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else if (n.size < 4) n.add(id);
      return n;
    });
  }

  function deselectAll() {
    setSelected(new Set());
  }

  function shuffleTiles() {
    setTiles((ts) => shuffleArr(ts));
    setSelected(new Set());
  }

  function submit() {
    if (selected.size !== 4 || won || lost) return;
    const chosen = tiles.filter((t) => selected.has(t.id));
    const counts: Record<string, number> = {};
    for (const t of chosen) counts[t.categoryKey] = (counts[t.categoryKey] ?? 0) + 1;
    const keys = Object.keys(counts);
    if (keys.length === 1) {
      // correct
      const cat = puzzle.categories.find((c) => c.key === chosen[0].categoryKey)!;
      const newSolved = [...solvedCats, cat];
      setSolvedCats(newSolved);
      setTiles((ts) => ts.filter((t) => !selected.has(t.id)));
      setSelected(new Set());
      flashToast(`SYNC ACQUIRED — ${cat.name}`, 'info');
      if (newSolved.length === 4) {
        setWon(true);
        setStats((s) => {
          const nextStreak = s.streak + 1;
          const next: Stats = {
            wins: s.wins + 1,
            losses: s.losses,
            streak: nextStreak,
            best: Math.max(s.best, nextStreak),
          };
          persistStats(next);
          return next;
        });
        setTimeout(() => flashToast('ALL GROUPS SYNCED', 'win', 1800), 600);
      }
      return;
    }
    // miss
    const maxCount = Math.max(...Object.values(counts));
    const oneAway = maxCount === 3;
    const nextLives = lives - 1;
    setLives(nextLives);
    setFlickerIdx(nextLives);
    setTimeout(() => setFlickerIdx(null), 700);
    const ids = new Set(selected);
    setShakeIds(ids);
    setTimeout(() => setShakeIds(new Set()), 550);
    flashToast(oneAway ? 'One away…' : 'No sync.', 'miss');
    if (nextLives <= 0) {
      setLost(true);
      // Auto-reveal remaining groups
      setTimeout(() => {
        setSolvedCats((solved) => {
          const solvedKeys = new Set(solved.map((c) => c.key));
          const remaining = puzzle.categories.filter((c) => !solvedKeys.has(c.key));
          return [...solved, ...remaining];
        });
        setTiles([]);
        setSelected(new Set());
      }, 500);
      setStats((s) => {
        const next: Stats = { ...s, losses: s.losses + 1, streak: 0 };
        persistStats(next);
        return next;
      });
    }
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-cyan-500/20"
      style={{ background: '#020617', color: '#e2e8f0', minHeight: 760, fontFamily: FONT_STACK }}
    >
      <style>{`
        @keyframes vl-battery-flicker {
          0%,100% { opacity: 1; }
          10% { opacity: 0.1; }
          20% { opacity: 0.9; }
          35% { opacity: 0.05; }
          50% { opacity: 0.6; }
          70% { opacity: 0.1; }
          85% { opacity: 0.3; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(148,163,184,0.08) 0px, rgba(148,163,184,0.08) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <span className="text-xs uppercase tracking-[0.3em] text-cyan-400/80">VibeLink</span>
          <span className="ml-2 text-xs tracking-[0.25em] text-slate-300">// {puzzle.title}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="text-slate-300">
            WINS <span className="tabular-nums text-cyan-200">{stats.wins}</span>
          </div>
          <div className="text-slate-300">
            STREAK <span className="tabular-nums text-cyan-200">{stats.streak}</span>
          </div>
          <div className="text-slate-300">
            BEST <span className="tabular-nums text-cyan-200">{stats.best}</span>
          </div>
        </div>
      </div>

      {/* Lives */}
      <div className="relative flex items-center justify-center gap-2 pb-3">
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-300">POWER CELLS</span>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3].map((i) => {
            const spent = i >= lives;
            const flickering = flickerIdx === i;
            const alive = !spent || flickering;
            return (
              <div
                key={i}
                className={`relative h-3 w-9 rounded-sm transition-colors ${
                  alive ? 'bg-cyan-400' : 'bg-slate-700'
                }`}
                style={{
                  boxShadow: alive ? '0 0 10px #22d3ee, 0 0 3px #a5f3fc' : 'none',
                  animation: flickering ? 'vl-battery-flicker 0.7s steps(8, end) 1' : 'none',
                }}
              >
                <div
                  className="absolute right-[-3px] top-1/2 h-2 w-[3px] -translate-y-1/2 rounded-sm"
                  style={{ background: alive ? '#22d3ee' : '#334155' }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="relative px-4">
        <div className="mx-auto max-w-lg">
          <div className="grid grid-cols-4 gap-2">
            <AnimatePresence initial={false}>
              {solvedCats.map((cat) => {
                const meta = LEVEL_META[cat.level];
                return (
                  <motion.div
                    key={`solved-${cat.key}`}
                    layout
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                    className={`col-span-4 flex flex-col items-center justify-center rounded border ${meta.border} ${meta.bg} ${meta.text} py-3 text-center`}
                    style={{
                      boxShadow: meta.glow,
                      fontFamily: FONT_STACK,
                    }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.4em] opacity-80">
                      LEVEL {cat.level} · {LEVEL_META[cat.level].name}
                    </div>
                    <div className="text-sm font-bold uppercase tracking-[0.25em]">{cat.name}</div>
                    <div className="mt-1 text-xs tracking-[0.3em] opacity-90">
                      {cat.items.join(' · ')}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {tiles.map((t) => {
                const isSel = selected.has(t.id);
                const isShaking = shakeIds.has(t.id);
                return (
                  <motion.button
                    key={t.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isShaking
                        ? { opacity: 1, scale: 1, x: [0, -8, 8, -6, 6, -3, 3, 0] }
                        : { opacity: 1, scale: 1, x: 0 }
                    }
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={
                      isShaking
                        ? { duration: 0.5 }
                        : { type: 'spring', stiffness: 300, damping: 24 }
                    }
                    onClick={() => toggleTile(t.id)}
                    disabled={won || lost}
                    className={`aspect-[1.3/1] rounded border text-xs font-bold uppercase tracking-[0.15em] transition-colors sm:text-sm ${
                      isSel
                        ? 'border-cyan-300 bg-cyan-500/20 text-cyan-50'
                        : 'border-slate-700 bg-slate-800 text-slate-100 hover:border-cyan-500/60 hover:bg-slate-700/80'
                    }`}
                    style={{
                      fontFamily: FONT_STACK,
                      boxShadow: isSel
                        ? '0 0 18px rgba(34,211,238,0.65), inset 0 0 12px rgba(34,211,238,0.25)'
                        : 'inset 0 0 8px rgba(15,23,42,0.8)',
                    }}
                  >
                    {t.label}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="relative flex min-h-[36px] justify-center py-3">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`rounded border px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                toast.kind === 'win'
                  ? 'border-yellow-300 bg-yellow-500/10 text-yellow-100 shadow-[0_0_14px_rgba(234,179,8,0.5)]'
                  : toast.kind === 'miss'
                  ? 'border-rose-400/70 bg-rose-500/10 text-rose-100'
                  : 'border-cyan-400/60 bg-cyan-500/10 text-cyan-100 shadow-[0_0_12px_rgba(34,211,238,0.4)]'
              }`}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="relative flex flex-wrap items-center justify-center gap-2 px-4 pb-4">
        <button
          onClick={shuffleTiles}
          disabled={won || lost || tiles.length === 0}
          className="flex items-center gap-1.5 rounded border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-xs uppercase tracking-widest text-slate-200 hover:border-cyan-400 hover:text-cyan-200 disabled:opacity-40"
        >
          <Shuffle size={14} /> Shuffle
        </button>
        <button
          onClick={deselectAll}
          disabled={selected.size === 0 || won || lost}
          className="flex items-center gap-1.5 rounded border border-slate-600 bg-slate-900/80 px-3 py-1.5 text-xs uppercase tracking-widest text-slate-200 hover:border-cyan-400 hover:text-cyan-200 disabled:opacity-40"
        >
          <Eraser size={14} /> Deselect
        </button>
        <button
          onClick={submit}
          disabled={selected.size !== 4 || won || lost}
          className="flex items-center gap-1.5 rounded border border-cyan-400 bg-cyan-500/15 px-3 py-1.5 text-xs uppercase tracking-widest text-cyan-100 hover:bg-cyan-500/25 disabled:opacity-40"
          style={
            selected.size === 4 && !won && !lost
              ? { boxShadow: '0 0 18px rgba(34,211,238,0.6)' }
              : undefined
          }
        >
          <Send size={14} /> Submit
        </button>
      </div>

      {/* Legend */}
      <div className="relative flex flex-wrap items-center justify-center gap-2 px-4 pb-5 text-[10px] uppercase tracking-[0.25em] text-slate-300">
        {([1, 2, 3, 4] as Level[]).map((lv) => {
          const m = LEVEL_META[lv];
          return (
            <span key={lv} className="flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-sm"
                style={{ background: m.color, boxShadow: `0 0 6px ${m.color}` }}
              />
              <span className="text-slate-300">L{lv} {m.name}</span>
            </span>
          );
        })}
      </div>

      {/* Win / Lose modal */}
      <AnimatePresence>
        {(won || lost) && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`mx-4 w-full max-w-sm rounded-lg border p-6 text-center ${
                won
                  ? 'border-cyan-300 bg-slate-900 shadow-[0_0_30px_rgba(34,211,238,0.6)]'
                  : 'border-rose-400/70 bg-slate-900 shadow-[0_0_30px_rgba(239,68,68,0.45)]'
              }`}
            >
              {won ? (
                <Trophy size={36} className="mx-auto mb-2 text-cyan-300" />
              ) : (
                <X size={36} className="mx-auto mb-2 text-rose-400" />
              )}
              <div className={`mb-1 text-xs uppercase tracking-[0.3em] ${won ? 'text-cyan-300' : 'text-rose-300'}`}>
                {won ? 'All Groups Synced' : 'Power Depleted'}
              </div>
              <div className={`mb-1 text-xl font-bold ${won ? 'text-cyan-100' : 'text-rose-100'}`}>
                {puzzle.title}
              </div>
              <div className="mb-4 text-[11px] uppercase tracking-[0.25em] text-slate-300">
                {won
                  ? `Streak: ${stats.streak} · Best: ${stats.best}`
                  : `Streak reset · Total wins: ${stats.wins}`}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={restart}
                  className="flex-1 rounded border border-slate-500 bg-slate-800 px-3 py-2 text-xs uppercase tracking-[0.3em] text-slate-200 hover:border-slate-400"
                >
                  Retry
                </button>
                <button
                  onClick={nextPuzzle}
                  className={`flex-1 rounded border px-3 py-2 text-xs uppercase tracking-[0.3em] ${
                    won
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-100 hover:bg-cyan-500/25'
                      : 'border-rose-400 bg-rose-500/15 text-rose-100 hover:bg-rose-500/25'
                  }`}
                >
                  Next →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

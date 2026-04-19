import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Eraser, Send, Shuffle, Zap, Trophy } from 'lucide-react';

type Tile = { id: string; ch: string };

const BINGO_SEEDS = [
  'RETAINS',
  'PAINTER',
  'THUNDER',
  'OUTLINE',
  'GLISTEN',
  'CAPITOL',
  'NUCLEAR',
  'GRANITE',
  'STEWARD',
  'BEDROCK',
];

const ROUND_SECONDS = 120;
const MIN_LEN = 3;
const STORAGE_KEY = 'vibetwist-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

function buildBag(letters: string) {
  const b: Record<string, number> = {};
  for (const c of letters) b[c] = (b[c] ?? 0) + 1;
  return b;
}
function canForm(word: string, bag: Record<string, number>) {
  const b: Record<string, number> = { ...bag };
  for (const c of word) {
    if (!b[c]) return false;
    b[c]--;
  }
  return true;
}
function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function wordScore(len: number) {
  return len * len * 10;
}
function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

type Stats = { bestLevel: number; bestScore: number };

export default function VibeTwist() {
  const [dict, setDict] = useState<Set<string> | null>(null);
  const [dictError, setDictError] = useState<string | null>(null);

  const [level, setLevel] = useState(1); // 1-based
  const seed = BINGO_SEEDS[(level - 1) % BINGO_SEEDS.length];
  const [tiles, setTiles] = useState<Tile[]>(() =>
    shuffleArr(BINGO_SEEDS[0].split('').map((ch, i) => ({ id: `t0-${i}`, ch })))
  );
  const [inputIds, setInputIds] = useState<string[]>([]);
  const [foundWords, setFoundWords] = useState<Set<string>>(() => new Set());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bingoBurst, setBingoBurst] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string; kind: 'info' | 'miss' | 'win' } | null>(null);
  const [flashErr, setFlashErr] = useState(false);
  const [stats, setStats] = useState<Stats>({ bestLevel: 1, bestScore: 0 });

  const tileById = useMemo(() => {
    const m = new Map<string, Tile>();
    for (const t of tiles) m.set(t.id, t);
    return m;
  }, [tiles]);

  const currentInput = inputIds.map((id) => tileById.get(id)?.ch ?? '').join('');
  const usedIds = new Set(inputIds);

  const subWords = useMemo(() => {
    if (!dict) return null;
    const bag = buildBag(seed);
    const list: string[] = [];
    for (const w of dict) {
      if (w.length < MIN_LEN || w.length > seed.length) continue;
      if (canForm(w, bag)) list.push(w);
    }
    list.sort((a, b) => (a.length !== b.length ? a.length - b.length : a.localeCompare(b)));
    return list;
  }, [dict, seed]);

  const subByLen = useMemo(() => {
    const map: Record<number, string[]> = {};
    if (!subWords) return map;
    for (const w of subWords) {
      (map[w.length] = map[w.length] ?? []).push(w);
    }
    return map;
  }, [subWords]);

  // Hydrate stats
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setStats({
          bestLevel: s.bestLevel ?? 1,
          bestScore: s.bestScore ?? 0,
        });
      }
    } catch {}
  }, []);

  // Fetch dictionary once
  useEffect(() => {
    let aborted = false;
    fetch('/data/enable.txt')
      .then((r) => r.text())
      .then((text) => {
        if (aborted) return;
        const set = new Set<string>();
        for (const line of text.split(/\r?\n/)) {
          const w = line.trim().toUpperCase();
          if (w) set.add(w);
        }
        setDict(set);
      })
      .catch((e) => {
        if (!aborted) setDictError(String(e));
      });
    return () => {
      aborted = true;
    };
  }, []);

  // Timer
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(id);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Detect time out
  useEffect(() => {
    if (timeLeft === 0 && running) {
      setRunning(false);
      setGameOver(true);
      setStats((s) => {
        const next: Stats = {
          bestLevel: Math.max(s.bestLevel, level),
          bestScore: Math.max(s.bestScore, score),
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    }
  }, [timeLeft, running, level, score]);

  // Keyboard input
  useEffect(() => {
    if (!running || gameOver) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setInputIds((ids) => ids.slice(0, -1));
      } else if (e.key === 'Escape') {
        setInputIds([]);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        pushLetter(e.key.toUpperCase());
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function pushLetter(ch: string) {
    setInputIds((ids) => {
      if (ids.length >= tiles.length) return ids;
      const used = new Set(ids);
      for (const t of tiles) {
        if (used.has(t.id)) continue;
        if (t.ch === ch) return [...ids, t.id];
      }
      return ids;
    });
  }

  function flashToast(text: string, kind: 'info' | 'miss' | 'win', ms = 1200) {
    const id = Date.now() + Math.random();
    setToast({ id, text, kind });
    setTimeout(() => {
      setToast((t) => (t && t.id === id ? null : t));
    }, ms);
  }

  function beginRound(newLevel: number) {
    const s = BINGO_SEEDS[(newLevel - 1) % BINGO_SEEDS.length];
    const prefix = `t${newLevel}`;
    setTiles(shuffleArr(s.split('').map((ch, i) => ({ id: `${prefix}-${i}`, ch }))));
    setInputIds([]);
    setFoundWords(new Set());
    setTimeLeft(ROUND_SECONDS);
    setRunning(true);
    setGameOver(false);
    setBingoBurst(false);
  }

  function startGame() {
    setLevel(1);
    setScore(0);
    beginRound(1);
  }

  function submit() {
    if (!dict || !running || gameOver) return;
    const word = currentInput;
    if (word.length < MIN_LEN) {
      flashErrFor(`Need ${MIN_LEN}+ letters`);
      return;
    }
    if (!dict.has(word)) {
      flashErrFor(`${word} — not in lexicon`);
      return;
    }
    if (foundWords.has(word)) {
      flashErrFor(`${word} — already found`);
      return;
    }
    const bag = buildBag(seed);
    if (!canForm(word, bag)) {
      flashErrFor(`${word} — bad letters`);
      return;
    }
    const points = wordScore(word.length);
    setFoundWords((f) => {
      const n = new Set(f);
      n.add(word);
      return n;
    });
    setScore((s) => s + points);
    setInputIds([]);
    if (word.length === seed.length) {
      // BINGO
      setBingoBurst(true);
      setRunning(false);
      flashToast(`BINGO +${points}`, 'win', 1800);
      setStats((s) => {
        const next: Stats = {
          bestLevel: Math.max(s.bestLevel, level + 1),
          bestScore: Math.max(s.bestScore, score + points),
        };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
        return next;
      });
      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        beginRound(nextLevel);
      }, 1800);
    } else {
      flashToast(`+${points} ${word}`, 'info');
    }
  }

  function flashErrFor(text: string) {
    flashToast(text, 'miss');
    setFlashErr(true);
    setTimeout(() => setFlashErr(false), 350);
  }

  function twist() {
    if (gameOver) return;
    setTiles((ts) => {
      if (ts.length < 2) return ts;
      for (let k = 0; k < 6; k++) {
        const sh = shuffleArr(ts);
        if (sh.map((t) => t.ch).join('') !== ts.map((t) => t.ch).join('')) return sh;
      }
      return ts;
    });
    setInputIds([]);
  }

  function clearInput() {
    setInputIds([]);
  }

  function popInput() {
    setInputIds((ids) => ids.slice(0, -1));
  }

  // Pulse duration for timer (in seconds between pulses)
  const pulseDuration = timeLeft > 30 ? 0 : Math.max(0.18, timeLeft / 30);
  const timerDanger = timeLeft <= 30;

  const loading = !dict && !dictError;
  const progress = subWords && subWords.length > 0 ? foundWords.size / subWords.length : 0;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-orange-500/25"
      style={{ background: '#000000', color: '#fed7aa', minHeight: 820, fontFamily: FONT_STACK }}
    >
      <style>{`
        @keyframes vt-timer-pulse {
          0%, 100% { opacity: 1; transform: scale(1); text-shadow: 0 0 6px #ef4444, 0 0 12px #ef4444; }
          50%      { opacity: 0.55; transform: scale(0.98); text-shadow: 0 0 2px #ef4444; }
        }
        @keyframes vt-bingo {
          0%   { opacity: 0; transform: scale(0.6); }
          25%  { opacity: 1; transform: scale(1.15); }
          65%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.25); }
        }
        @keyframes vt-scan {
          0%,100% { background-position: 0 0; }
          50%     { background-position: 0 6px; }
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(249,115,22,0.06) 0px, rgba(249,115,22,0.06) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-orange-400" />
          <span className="text-xs uppercase tracking-[0.3em] text-orange-400/80">VibeTwist</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="text-orange-300/70">
            LEVEL <span className="tabular-nums text-orange-200">{level}</span>
          </div>
          <div className="text-orange-300/70">
            SCORE <span className="tabular-nums text-orange-200">{score}</span>
          </div>
          <div className="text-orange-300/70">
            BEST LV <span className="tabular-nums text-orange-200">{stats.bestLevel}</span>
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="relative flex items-center justify-center gap-4 pb-2">
        <div
          className="rounded border border-rose-500/40 bg-black/60 px-4 py-2 tabular-nums"
          style={{
            color: '#ef4444',
            fontSize: 34,
            letterSpacing: '0.2em',
            fontFamily: FONT_STACK,
            textShadow: '0 0 8px #ef4444',
            animation: timerDanger && running
              ? `vt-timer-pulse ${pulseDuration}s ease-in-out infinite`
              : undefined,
          }}
        >
          {fmtTime(timeLeft)}
        </div>
      </div>

      {/* Slot grid */}
      <div className="relative px-4 pb-3">
        <div className="mx-auto max-w-2xl rounded border border-orange-500/20 bg-black/40 p-3">
          <div className="mb-2 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.3em] text-orange-500/70">
            <span>// Word Slots</span>
            <span>
              FOUND {foundWords.size}/{subWords?.length ?? '—'} · {(progress * 100).toFixed(0)}%
            </span>
          </div>
          {loading && (
            <div className="p-4 text-center text-xs text-orange-300/60">LOADING LEXICON…</div>
          )}
          {dictError && (
            <div className="p-4 text-center text-xs text-rose-300/80">LEXICON UNAVAILABLE ({dictError})</div>
          )}
          {subWords && [3, 4, 5, 6, 7].map((len) => {
            const list = subByLen[len];
            if (!list || !list.length) return null;
            const foundHere = list.filter((w) => foundWords.has(w)).length;
            const isBingoRow = len === seed.length;
            return (
              <div key={len} className="mb-2">
                <div className={`mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] ${isBingoRow ? 'text-yellow-300' : 'text-orange-300/80'}`}>
                  <span className="w-6 text-right tabular-nums">{len}</span>
                  <span className="text-orange-500/60">|</span>
                  <span>{foundHere}/{list.length} {isBingoRow && '★ BINGO'}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {list.map((w) => {
                    const found = foundWords.has(w);
                    return (
                      <div
                        key={w}
                        className={`flex h-6 items-center justify-center rounded-sm border px-2 text-[11px] tracking-[0.2em] tabular-nums ${
                          found
                            ? isBingoRow
                              ? 'border-yellow-300 bg-yellow-500/15 text-yellow-100 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                              : 'border-orange-400 bg-orange-500/15 text-orange-100 shadow-[0_0_8px_rgba(249,115,22,0.45)]'
                            : isBingoRow
                            ? 'border-yellow-500/40 bg-yellow-900/20 text-yellow-700'
                            : 'border-orange-500/25 bg-neutral-950 text-orange-700/70'
                        }`}
                        style={{ minWidth: len * 10 + 14 }}
                      >
                        {found ? w : '•'.repeat(len)}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current input */}
      <div className="relative flex min-h-[68px] justify-center px-4 py-2">
        <div
          className={`flex h-[60px] min-w-[280px] items-center justify-center gap-1.5 rounded border bg-black/70 px-4 ${
            flashErr ? 'border-rose-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]' : 'border-orange-500/40'
          }`}
        >
          {inputIds.length === 0 ? (
            <span className="text-[11px] uppercase tracking-[0.35em] text-orange-500/50">
              {running ? 'Type or tap a tile…' : gameOver ? 'Round over' : 'Press Start'}
            </span>
          ) : (
            inputIds.map((id, i) => {
              const t = tileById.get(id);
              return (
                <motion.div
                  key={id + '-in-' + i}
                  layoutId={id + '-layout'}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-orange-400 bg-orange-500/15 text-lg font-bold text-orange-100"
                  style={{ boxShadow: '0 0 10px rgba(249,115,22,0.55), inset 0 0 6px rgba(249,115,22,0.35)' }}
                  onClick={() => setInputIds((ids) => ids.filter((x) => x !== id))}
                >
                  {t?.ch}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="relative flex flex-wrap items-center justify-center gap-2 px-4 pb-3">
        <button
          onClick={submit}
          disabled={!running || gameOver || inputIds.length < MIN_LEN}
          className="flex items-center gap-1.5 rounded border border-orange-400 bg-orange-500/15 px-3 py-1.5 text-xs uppercase tracking-widest text-orange-100 hover:bg-orange-500/25 disabled:opacity-40"
          style={
            running && !gameOver && inputIds.length >= MIN_LEN
              ? { boxShadow: '0 0 14px rgba(249,115,22,0.55)' }
              : undefined
          }
        >
          <Send size={14} /> Submit
        </button>
        <button
          onClick={popInput}
          disabled={!running || gameOver || inputIds.length === 0}
          className="flex items-center gap-1.5 rounded border border-neutral-600 bg-neutral-900 px-3 py-1.5 text-xs uppercase tracking-widest text-neutral-200 hover:border-orange-400 hover:text-orange-200 disabled:opacity-40"
        >
          ⌫ Back
        </button>
        <button
          onClick={clearInput}
          disabled={!running || gameOver || inputIds.length === 0}
          className="flex items-center gap-1.5 rounded border border-neutral-600 bg-neutral-900 px-3 py-1.5 text-xs uppercase tracking-widest text-neutral-200 hover:border-orange-400 hover:text-orange-200 disabled:opacity-40"
        >
          <Eraser size={14} /> Clear
        </button>
        <button
          onClick={twist}
          disabled={!running || gameOver}
          className="flex items-center gap-1.5 rounded border border-neutral-600 bg-neutral-900 px-3 py-1.5 text-xs uppercase tracking-widest text-neutral-200 hover:border-orange-400 hover:text-orange-200 disabled:opacity-40"
        >
          <Shuffle size={14} /> Twist
        </button>
      </div>

      {/* Tiles */}
      <div className="relative flex justify-center px-4 pb-4">
        <div className="flex flex-wrap justify-center gap-2">
          {tiles.map((t) => {
            const used = usedIds.has(t.id);
            return (
              <motion.button
                key={t.id}
                layout
                layoutId={t.id + '-layout'}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                onClick={() => {
                  if (used || !running || gameOver) return;
                  setInputIds((ids) => [...ids, t.id]);
                }}
                disabled={used || !running || gameOver}
                className={`flex h-14 w-14 items-center justify-center rounded-md border text-2xl font-black transition-colors sm:h-16 sm:w-16 sm:text-3xl ${
                  used
                    ? 'border-neutral-800 bg-neutral-950 text-neutral-700'
                    : 'border-orange-400 bg-gradient-to-b from-neutral-900 to-black text-orange-300'
                }`}
                style={{
                  fontFamily: FONT_STACK,
                  boxShadow: used
                    ? 'none'
                    : '0 0 14px rgba(249,115,22,0.55), inset 0 0 6px rgba(249,115,22,0.35), inset 0 -2px 0 rgba(0,0,0,0.6)',
                  textShadow: used ? 'none' : '0 0 8px rgba(249,115,22,0.7)',
                }}
              >
                {t.ch}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Toast */}
      <div className="relative flex min-h-[34px] justify-center pb-2">
        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`rounded border px-3 py-1 text-xs uppercase tracking-[0.3em] ${
                toast.kind === 'win'
                  ? 'border-yellow-300 bg-yellow-500/10 text-yellow-100 shadow-[0_0_14px_rgba(234,179,8,0.6)]'
                  : toast.kind === 'miss'
                  ? 'border-rose-400/60 bg-rose-500/10 text-rose-100'
                  : 'border-orange-400/60 bg-orange-500/10 text-orange-100 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
              }`}
            >
              {toast.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Start / Restart */}
      {!running && !gameOver && (
        <div className="relative flex justify-center pb-6">
          <button
            onClick={startGame}
            disabled={loading || !!dictError}
            className="rounded border border-orange-400 bg-orange-500/15 px-4 py-2 text-xs uppercase tracking-[0.35em] text-orange-100 hover:bg-orange-500/25 disabled:opacity-40"
            style={{ boxShadow: '0 0 16px rgba(249,115,22,0.55)' }}
          >
            ⚡ Start Run
          </button>
        </div>
      )}

      {/* Bingo burst */}
      <AnimatePresence>
        {bingoBurst && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="rounded-lg border-2 border-yellow-300 bg-black/70 px-8 py-5 text-center"
              style={{
                boxShadow: '0 0 40px rgba(234,179,8,0.75)',
                animation: 'vt-bingo 1.6s ease-out 1 forwards',
              }}
            >
              <div className="text-[10px] uppercase tracking-[0.4em] text-yellow-400">
                LEVEL CLEARED
              </div>
              <div
                className="text-5xl font-black tracking-[0.15em]"
                style={{
                  color: '#facc15',
                  textShadow: '0 0 16px #fde047, 0 0 32px #facc15',
                  fontFamily: FONT_STACK,
                }}
              >
                BINGO!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game over modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-4 w-full max-w-sm rounded-lg border border-rose-500/70 bg-black p-6 text-center shadow-[0_0_30px_rgba(239,68,68,0.45)]"
            >
              <Trophy size={36} className="mx-auto mb-2 text-orange-300" />
              <div className="mb-1 text-xs uppercase tracking-[0.3em] text-rose-400">Time Out</div>
              <div className="mb-1 text-2xl font-bold text-orange-100">Level {level}</div>
              <div className="mb-4 text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                Score {score} · Best Level {stats.bestLevel} · Best Score {stats.bestScore}
              </div>
              <button
                onClick={startGame}
                className="w-full rounded border border-orange-400 bg-orange-500/15 px-4 py-2 text-xs uppercase tracking-[0.3em] text-orange-100 hover:bg-orange-500/25"
              >
                <RefreshCw className="mr-2 inline" size={12} /> New Run
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

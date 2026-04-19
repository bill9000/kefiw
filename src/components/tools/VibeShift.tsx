import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Settings as SettingsIcon,
  Trophy,
  X,
} from 'lucide-react';

const STORAGE_KEY = 'vibeshift-stats-v1';
const TILE = 56;
const GAP = 8;
const STEP = TILE + GAP;
const VISIBLE_ROWS = 5;
const BOARD_H = STEP * VISIBLE_ROWS;
const BOARD_CENTER = BOARD_H / 2;

type Level = { name: string; columns: string[][]; words: string[] };

const LEVELS: Level[] = [
  {
    name: 'Ignition',
    columns: [['S'], ['H', 'T', 'M'], ['I', 'O'], ['N', 'L'], ['E']],
    words: ['SHINE', 'STONE', 'SMILE'],
  },
  {
    name: 'Voltage',
    columns: [['C', 'B'], ['R'], ['A'], ['N', 'I', 'T', 'K'], ['E']],
    words: ['CRANE', 'BRAIN', 'CRATE', 'BRAKE'],
  },
  {
    name: 'Chromatic',
    columns: [['S'], ['M', 'T', 'H', 'P'], ['A'], ['R'], ['T', 'D', 'K']],
    words: ['SMART', 'START', 'SHARD', 'SHARK', 'SPARK'],
  },
  {
    name: 'Deckshift',
    columns: [['P', 'B'], ['L', 'A', 'R'], ['A', 'I'], ['N', 'I'], ['T', 'N']],
    words: ['PLANT', 'PLAIT', 'PAINT', 'BRAIN'],
  },
];

function checkWord(word: string, levelWords: string[]): boolean {
  return levelWords.includes(word.toUpperCase());
}

type Stats = { levelsCompleted: number; currentLevel: number };

function loadStats(): Stats {
  if (typeof window === 'undefined') return { levelsCompleted: 0, currentLevel: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { levelsCompleted: 0, currentLevel: 0 };
    const p = JSON.parse(raw);
    return {
      levelsCompleted: Number(p.levelsCompleted) || 0,
      currentLevel: Number(p.currentLevel) || 0,
    };
  } catch {
    return { levelsCompleted: 0, currentLevel: 0 };
  }
}

function saveStats(s: Stats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    // ignore quota errors
  }
}

export default function VibeShift() {
  const [levelIdx, setLevelIdx] = useState(0);
  const [levelsCompleted, setLevelsCompleted] = useState(0);
  const [columnIndices, setColumnIndices] = useState<number[]>(() =>
    LEVELS[0].columns.map(() => 0),
  );
  const [usedPositions, setUsedPositions] = useState<Set<string>>(new Set());
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const [showWin, setShowWin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const level = LEVELS[levelIdx];

  useEffect(() => {
    const s = loadStats();
    const idx = Math.max(0, Math.min(s.currentLevel, LEVELS.length - 1));
    setLevelsCompleted(s.levelsCompleted);
    setLevelIdx(idx);
    setColumnIndices(LEVELS[idx].columns.map(() => 0));
    setUsedPositions(new Set());
    setFoundWords(new Set());
  }, []);

  const currentWord = useMemo(
    () => level.columns.map((col, i) => col[columnIndices[i] ?? 0] ?? '').join(''),
    [columnIndices, level],
  );

  const isValid = useMemo(
    () => checkWord(currentWord, level.words),
    [currentWord, level.words],
  );

  useEffect(() => {
    if (!isValid) return;
    setFoundWords((prev) => {
      if (prev.has(currentWord)) return prev;
      const next = new Set(prev);
      next.add(currentWord);
      return next;
    });
    setUsedPositions((prev) => {
      let changed = false;
      const next = new Set(prev);
      level.columns.forEach((_, c) => {
        const k = `${c}-${columnIndices[c]}`;
        if (!next.has(k)) {
          next.add(k);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [isValid, currentWord, columnIndices, level]);

  const totalTiles = useMemo(
    () => level.columns.reduce((s, c) => s + c.length, 0),
    [level],
  );

  useEffect(() => {
    if (showWin) return;
    if (usedPositions.size >= totalTiles && totalTiles > 0) {
      setShowWin(true);
      const newCount = levelsCompleted + 1;
      setLevelsCompleted(newCount);
      saveStats({
        levelsCompleted: newCount,
        currentLevel: Math.min(levelIdx + 1, LEVELS.length - 1),
      });
    }
  }, [usedPositions, totalTiles, showWin, levelsCompleted, levelIdx]);

  const setIndex = useCallback((col: number, idx: number) => {
    setColumnIndices((prev) => {
      if (prev[col] === idx) return prev;
      const next = [...prev];
      next[col] = idx;
      return next;
    });
  }, []);

  const resetLevel = useCallback(() => {
    setColumnIndices(level.columns.map(() => 0));
    setUsedPositions(new Set());
    setFoundWords(new Set());
    setShowWin(false);
  }, [level]);

  const advanceLevel = useCallback(() => {
    setShowWin(false);
    const isLast = levelIdx === LEVELS.length - 1;
    const next = isLast ? 0 : levelIdx + 1;
    setLevelIdx(next);
    setColumnIndices(LEVELS[next].columns.map(() => 0));
    setUsedPositions(new Set());
    setFoundWords(new Set());
  }, [levelIdx]);

  const jumpToLevel = useCallback(
    (idx: number) => {
      const i = Math.max(0, Math.min(idx, LEVELS.length - 1));
      setLevelIdx(i);
      setColumnIndices(LEVELS[i].columns.map(() => 0));
      setUsedPositions(new Set());
      setFoundWords(new Set());
      setShowWin(false);
      setShowSettings(false);
      saveStats({ levelsCompleted, currentLevel: i });
    },
    [levelsCompleted],
  );

  const resetAll = useCallback(() => {
    setLevelsCompleted(0);
    setLevelIdx(0);
    setColumnIndices(LEVELS[0].columns.map(() => 0));
    setUsedPositions(new Set());
    setFoundWords(new Set());
    setShowSettings(false);
    saveStats({ levelsCompleted: 0, currentLevel: 0 });
  }, []);

  return (
    <div
      className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-500/10 p-4 text-slate-100 shadow-[0_0_60px_rgba(34,211,238,0.08)] sm:p-6"
      style={{ background: '#0f172a' }}
    >
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-cyan-400/80">
            VibeShift
          </p>
          <h2 className="truncate text-lg font-bold">
            {level.name}{' '}
            <span className="font-normal text-slate-500">
              · {levelIdx + 1}/{LEVELS.length}
            </span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetLevel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-200"
            aria-label="Reset level"
            title="Reset level"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition hover:border-cyan-400/60 hover:text-cyan-200"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="mb-3 flex items-center justify-center">
        <div
          className={`rounded-full border px-4 py-1 font-mono text-sm tracking-[0.3em] transition ${
            isValid
              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.45)]'
              : 'border-slate-700 bg-slate-900 text-slate-500'
          }`}
        >
          {currentWord || '—'}
        </div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2"
          style={{ height: TILE }}
        >
          <div className="relative h-full rounded-xl">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/5 via-cyan-400/10 to-fuchsia-400/5 backdrop-blur-[2px]" />
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-3">
          {level.columns.map((letters, c) => (
            <Column
              key={c}
              colIdx={c}
              letters={letters}
              selectedIdx={columnIndices[c] ?? 0}
              onSelect={(i) => setIndex(c, i)}
              usedPositions={usedPositions}
              isValid={isValid}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        <Stat label="Words" value={`${foundWords.size}/${level.words.length}`} />
        <Stat label="Cleared" value={`${usedPositions.size}/${totalTiles}`} />
        <Stat label="Lifetime" value={String(levelsCompleted)} />
      </div>

      <p className="mt-3 text-center text-[11px] text-slate-500">
        Drag a column or tap a letter to bring it to the goal row.
      </p>

      <AnimatePresence>
        {showWin && (
          <WinModal
            key="win"
            onClose={() => setShowWin(false)}
            onNext={advanceLevel}
            levelName={level.name}
            levelsCompleted={levelsCompleted}
            isLastLevel={levelIdx === LEVELS.length - 1}
          />
        )}
        {showSettings && (
          <SettingsModal
            key="settings"
            onClose={() => setShowSettings(false)}
            onReset={resetAll}
            onJump={jumpToLevel}
            currentLevel={levelIdx}
            totalLevels={LEVELS.length}
            levelsCompleted={levelsCompleted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-0.5 font-mono text-sm font-bold text-cyan-200">{value}</div>
    </div>
  );
}

type ColumnProps = {
  colIdx: number;
  letters: string[];
  selectedIdx: number;
  onSelect: (idx: number) => void;
  usedPositions: Set<string>;
  isValid: boolean;
};

function Column({
  colIdx,
  letters,
  selectedIdx,
  onSelect,
  usedPositions,
  isValid,
}: ColumnProps) {
  const maxIdx = letters.length - 1;
  const baseY = BOARD_CENTER - (selectedIdx * STEP + TILE / 2);
  const canDrag = maxIdx > 0;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const delta = Math.round(-info.offset.y / STEP);
    if (!delta) return;
    const target = Math.max(0, Math.min(maxIdx, selectedIdx + delta));
    onSelect(target);
  };

  return (
    <div className="relative" style={{ height: BOARD_H, width: TILE + 4 }}>
      <div className="relative h-full overflow-hidden">
        <motion.div
          className={`absolute inset-x-0 flex flex-col items-center ${
            canDrag ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
          style={{ touchAction: 'none' }}
          animate={{ y: baseY }}
          drag={canDrag ? 'y' : false}
          dragConstraints={{
            top: BOARD_CENTER - maxIdx * STEP - TILE / 2 - 24,
            bottom: BOARD_CENTER - TILE / 2 + 24,
          }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          transition={{ type: 'spring', stiffness: 320, damping: 30 }}
        >
          {letters.map((letter, i) => {
            const used = usedPositions.has(`${colIdx}-${i}`);
            const active = i === selectedIdx;
            const glow = active && isValid;
            const tileCls = active
              ? glow
                ? 'border-cyan-300 bg-cyan-400/15 text-white shadow-[0_0_26px_rgba(34,211,238,0.7)]'
                : used
                  ? 'border-cyan-500/70 bg-cyan-500/10 text-white shadow-[0_0_16px_rgba(34,211,238,0.35)]'
                  : 'border-slate-400 bg-slate-700/60 text-white shadow-[0_0_14px_rgba(148,163,184,0.25)]'
              : used
                ? 'border-cyan-500/40 bg-cyan-500/5 text-cyan-300'
                : 'border-slate-700/60 bg-slate-800/40 text-slate-500';

            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelect(i)}
                className={`mb-2 flex items-center justify-center rounded-xl border font-mono text-xl font-bold transition-colors sm:text-2xl ${tileCls}`}
                style={{ width: TILE, height: TILE }}
              >
                {letter}
              </button>
            );
          })}
        </motion.div>
      </div>

      {canDrag && (
        <>
          <button
            type="button"
            onClick={() => onSelect(Math.max(0, selectedIdx - 1))}
            disabled={selectedIdx === 0}
            className="absolute left-1/2 top-1 z-20 -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900/80 p-0.5 text-slate-400 transition hover:text-cyan-300 disabled:opacity-20"
            aria-label="Scroll column up"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onSelect(Math.min(maxIdx, selectedIdx + 1))}
            disabled={selectedIdx === maxIdx}
            className="absolute bottom-1 left-1/2 z-20 -translate-x-1/2 rounded-full border border-slate-700 bg-slate-900/80 p-0.5 text-slate-400 transition hover:text-cyan-300 disabled:opacity-20"
            aria-label="Scroll column down"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}

function WinModal({
  onClose,
  onNext,
  levelName,
  levelsCompleted,
  isLastLevel,
}: {
  onClose: () => void;
  onNext: () => void;
  levelName: string;
  levelsCompleted: number;
  isLastLevel: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-slate-950/85 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-sm rounded-2xl border border-cyan-400/60 bg-slate-900 p-6 shadow-[0_0_48px_rgba(34,211,238,0.45)]"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300">
            <Trophy className="h-6 w-6" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400/80">Level cleared</p>
          <h3 className="mt-1 text-xl font-bold">{levelName}</h3>
          <p className="mt-2 text-sm text-slate-400">
            Lifetime levels:{' '}
            <span className="font-mono font-bold text-cyan-300">{levelsCompleted}</span>
          </p>
          <button
            onClick={onNext}
            className="mt-5 rounded-full border border-cyan-400 bg-cyan-500/10 px-6 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/20 hover:text-white"
          >
            {isLastLevel ? 'Replay from Level 1' : 'Next level →'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SettingsModal({
  onClose,
  onReset,
  onJump,
  currentLevel,
  totalLevels,
  levelsCompleted,
}: {
  onClose: () => void;
  onReset: () => void;
  onJump: (i: number) => void;
  currentLevel: number;
  totalLevels: number;
  levelsCompleted: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-slate-950/85 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <h3 className="mb-1 text-lg font-bold">Settings</h3>
        <p className="mb-4 text-xs text-slate-500">Lifetime levels: {levelsCompleted}</p>

        <div className="mb-5">
          <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Jump to level
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: totalLevels }, (_, i) => (
              <button
                key={i}
                onClick={() => onJump(i)}
                className={`rounded-lg border px-3 py-1 font-mono text-sm ${
                  i === currentLevel
                    ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200'
                    : 'border-slate-700 text-slate-300 hover:border-slate-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full rounded-lg border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
        >
          Reset all progress
        </button>
      </motion.div>
    </motion.div>
  );
}

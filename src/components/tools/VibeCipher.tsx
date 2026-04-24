import { useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw, Trophy, X, Share2 } from 'lucide-react';

// To swap in a larger word list later, pass `words` as a prop (string[]) — the component
// falls back to DEFAULT_WORDS when the prop is not supplied.
const DEFAULT_WORDS = [
  'apple','beach','brave','bread','brick','bring','brown','build','burst','cable',
  'chair','chart','cheap','check','chess','chief','child','clean','clear','click',
  'cloud','coach','coast','crisp','crowd','dance','depth','dream','drink','drive',
  'early','earth','empty','enjoy','enter','equal','event','exact','exist','faith',
  'fancy','field','final','first','flash','fleet','floor','focus','force','frame',
  'fresh','front','funny','giant','glass','globe','grace','grain','grand','grant',
  'great','green','group','guess','guest','happy','heart','heavy','horse','hotel',
  'house','human','ideal','image','input','judge','knife','known','large','later',
  'laugh','learn','level','light','limit','local','lucky','lunch','magic','major',
  'media','metal','might','minor','model','money','month','mouth','music','never',
];

const WORD_LEN = 5;
const MAX_ROWS = 6;
const STORAGE_KEY = 'vibecipher-stats-v1';

type LetterState = 'correct' | 'present' | 'absent';
type GameState = 'playing' | 'won' | 'lost';

interface Stats {
  wins: number;
  played: number;
  streak: number;
  bestStreak: number;
}

const DEFAULT_STATS: Stats = { wins: 0, played: 0, streak: 0, bestStreak: 0 };

function pickWord(list: string[]): string {
  return list[Math.floor(Math.random() * list.length)].toLowerCase();
}

function evaluateGuess(guess: string, secret: string): LetterState[] {
  const result: LetterState[] = Array(WORD_LEN).fill('absent');
  const secretChars = secret.split('');
  const guessChars = guess.split('');

  const remaining: Record<string, number> = {};
  for (let i = 0; i < WORD_LEN; i++) {
    if (guessChars[i] === secretChars[i]) {
      result[i] = 'correct';
    } else {
      remaining[secretChars[i]] = (remaining[secretChars[i]] ?? 0) + 1;
    }
  }
  for (let i = 0; i < WORD_LEN; i++) {
    if (result[i] === 'correct') continue;
    const ch = guessChars[i];
    if (remaining[ch] > 0) {
      result[i] = 'present';
      remaining[ch] -= 1;
    }
  }
  return result;
}

interface VibeCipherProps {
  words?: string[];
}

export default function VibeCipher({ words }: VibeCipherProps) {
  const dictionary = useMemo(
    () => (words && words.length > 0 ? words : DEFAULT_WORDS).map((w) => w.toLowerCase()),
    [words],
  );

  const [secret, setSecret] = useState(() => pickWord(dictionary));
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStats({ ...DEFAULT_STATS, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const persistStats = useCallback((next: Stats) => {
    setStats(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const resetGame = useCallback(() => {
    setSecret(pickWord(dictionary));
    setGuesses([]);
    setCurrent('');
    setGameState('playing');
    setShowModal(false);
    setMessage(null);
  }, [dictionary]);

  const flashShake = useCallback((msg?: string) => {
    setShake(true);
    if (msg) setMessage(msg);
    window.setTimeout(() => {
      setShake(false);
      setMessage(null);
    }, 900);
  }, []);

  const submitGuess = useCallback(() => {
    if (gameState !== 'playing') return;
    if (current.length !== WORD_LEN) {
      flashShake('Needs 5 letters');
      return;
    }
    const nextGuesses = [...guesses, current];
    const won = current === secret;
    const lost = !won && nextGuesses.length >= MAX_ROWS;
    setGuesses(nextGuesses);
    setCurrent('');
    if (won) {
      setGameState('won');
      const next: Stats = {
        wins: stats.wins + 1,
        played: stats.played + 1,
        streak: stats.streak + 1,
        bestStreak: Math.max(stats.bestStreak, stats.streak + 1),
      };
      persistStats(next);
      window.setTimeout(() => setShowModal(true), 1400);
    } else if (lost) {
      setGameState('lost');
      const next: Stats = {
        wins: stats.wins,
        played: stats.played + 1,
        streak: 0,
        bestStreak: stats.bestStreak,
      };
      persistStats(next);
      window.setTimeout(() => setShowModal(true), 1200);
    }
  }, [current, guesses, secret, gameState, stats, persistStats, flashShake]);

  const handleKey = useCallback(
    (key: string) => {
      if (gameState !== 'playing') return;
      if (key === 'Enter') {
        submitGuess();
      } else if (key === 'Backspace') {
        setCurrent((c) => c.slice(0, -1));
      } else if (/^[a-z]$/i.test(key) && current.length < WORD_LEN) {
        setCurrent((c) => (c + key).toLowerCase());
      }
    },
    [current, gameState, submitGuess],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (showModal) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter' || e.key === 'Backspace') {
        e.preventDefault();
        handleKey(e.key);
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKey(e.key.toLowerCase());
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKey, showModal]);

  const letterStatus = useMemo(() => {
    const map: Record<string, LetterState> = {};
    for (const g of guesses) {
      const result = evaluateGuess(g, secret);
      for (let i = 0; i < WORD_LEN; i++) {
        const ch = g[i];
        const next = result[i];
        const prev = map[ch];
        if (prev === 'correct') continue;
        if (prev === 'present' && next === 'absent') continue;
        map[ch] = next;
      }
    }
    return map;
  }, [guesses, secret]);

  const rows = useMemo(() => {
    const out: Array<{ kind: 'done'; letters: string[]; states: LetterState[] } | { kind: 'current'; letters: string[] } | { kind: 'empty' }> = [];
    for (let i = 0; i < MAX_ROWS; i++) {
      if (i < guesses.length) {
        const g = guesses[i];
        out.push({ kind: 'done', letters: g.split(''), states: evaluateGuess(g, secret) });
      } else if (i === guesses.length && gameState === 'playing') {
        const padded = (current + ' '.repeat(WORD_LEN)).slice(0, WORD_LEN).split('');
        out.push({ kind: 'current', letters: padded });
      } else {
        out.push({ kind: 'empty' });
      }
    }
    return out;
  }, [guesses, current, secret, gameState]);

  const tileClass = (state: LetterState | 'filled' | 'empty') => {
    const base = 'flex items-center justify-center rounded-md border text-xl font-bold uppercase transition-all duration-300 aspect-square w-full';
    if (state === 'correct') return `${base} border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.55)]`;
    if (state === 'present') return `${base} border-amber-400 bg-amber-500/15 text-amber-300 shadow-[0_0_18px_rgba(251,191,36,0.5)]`;
    if (state === 'absent') return `${base} border-slate-700 bg-slate-800/60 text-slate-300`;
    if (state === 'filled') return `${base} border-slate-500 bg-slate-800 text-slate-100 shadow-[0_0_8px_rgba(148,163,184,0.3)]`;
    return `${base} border-slate-800 bg-slate-900 text-slate-300`;
  };

  const keyClass = (ch: string) => {
    const state = letterStatus[ch];
    const base = 'flex items-center justify-center rounded-md font-semibold uppercase transition-all select-none cursor-pointer text-sm sm:text-base';
    const size = 'h-11 sm:h-12 px-1 sm:px-2 min-w-[1.9rem] sm:min-w-[2.2rem] flex-1';
    if (state === 'correct') return `${base} ${size} bg-emerald-500/30 text-emerald-200 border border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]`;
    if (state === 'present') return `${base} ${size} bg-amber-500/25 text-amber-200 border border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]`;
    if (state === 'absent') return `${base} ${size} bg-slate-800 text-slate-600 border border-slate-800`;
    return `${base} ${size} bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600`;
  };

  const winRate = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0f172a] p-4 text-slate-100 sm:p-6">
      <div className="mx-auto flex max-w-md flex-col gap-4">
        <header className="flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">VibeCipher</div>
            <div className="text-xs text-slate-300">Unlimited play · 5 letters · 6 tries</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Trophy className="h-4 w-4 text-amber-400" aria-hidden />
            <span className="font-mono">{stats.wins}</span>
            <button
              type="button"
              onClick={resetGame}
              aria-label="New game"
              className="ml-2 inline-flex items-center gap-1 rounded-md border border-emerald-500/50 bg-emerald-500/10 px-2 py-1 text-emerald-300 hover:bg-emerald-500/20"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden /> New
            </button>
          </div>
        </header>

        <div className={`relative grid grid-rows-6 gap-1.5 ${shake ? 'animate-vc-shake' : ''}`}>
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: WORD_LEN }).map((_, ci) => {
                if (row.kind === 'done') {
                  return (
                    <div key={ci} className={tileClass(row.states[ci])} style={{ animationDelay: `${ci * 80}ms` }}>
                      {row.letters[ci]}
                    </div>
                  );
                }
                if (row.kind === 'current') {
                  const ch = row.letters[ci]?.trim();
                  return (
                    <div key={ci} className={tileClass(ch ? 'filled' : 'empty')}>
                      {ch || ''}
                    </div>
                  );
                }
                return <div key={ci} className={tileClass('empty')} />;
              })}
            </div>
          ))}
          {message && (
            <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-md border border-amber-400 bg-slate-900/90 px-3 py-1 text-xs font-medium text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.4)]">
              {message}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          {['qwertyuiop', 'asdfghjkl', 'zxcvbnm'].map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1 sm:gap-1.5">
              {ri === 2 && (
                <button
                  type="button"
                  onClick={() => handleKey('Enter')}
                  className="flex h-11 items-center justify-center rounded-md border border-emerald-500/60 bg-emerald-600/20 px-2 text-xs font-bold uppercase text-emerald-200 sm:h-12 sm:px-3 sm:text-sm"
                  aria-label="Submit guess"
                >
                  Enter
                </button>
              )}
              {row.split('').map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => handleKey(ch)}
                  className={keyClass(ch)}
                  aria-label={`Key ${ch}`}
                >
                  {ch}
                </button>
              ))}
              {ri === 2 && (
                <button
                  type="button"
                  onClick={() => handleKey('Backspace')}
                  className="flex h-11 items-center justify-center rounded-md border border-slate-600 bg-slate-700 px-2 text-xs font-bold uppercase text-slate-200 sm:h-12 sm:px-3 sm:text-sm"
                  aria-label="Backspace"
                >
                  Del
                </button>
              )}
            </div>
          ))}
        </div>

        {gameState === 'lost' && !showModal && (
          <div className="rounded-md border border-rose-400/50 bg-rose-500/10 p-3 text-center text-sm text-rose-200">
            The word was <span className="font-mono font-bold uppercase text-rose-100">{secret}</span>.
            <button type="button" onClick={resetGame} className="ml-2 underline hover:text-rose-100">Try another?</button>
          </div>
        )}
      </div>

      {showModal && (
        <WinLossModal
          state={gameState}
          secret={secret}
          stats={stats}
          winRate={winRate}
          onClose={() => setShowModal(false)}
          onNewGame={resetGame}
        />
      )}
      {gameState === 'won' && <ConfettiBurst />}
    </div>
  );
}

interface ModalProps {
  state: GameState;
  secret: string;
  stats: Stats;
  winRate: number;
  onClose: () => void;
  onNewGame: () => void;
}

function WinLossModal({ state, secret, stats, winRate, onClose, onNewGame }: ModalProps) {
  const isWin = state === 'won';
  const shareText = `VibeCipher — ${isWin ? `solved ${secret.toUpperCase()}` : 'missed this round'} · ${stats.wins}W / ${stats.played}P · streak ${stats.streak}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'VibeCipher', text: shareText });
        return;
      } catch {
        /* fallthrough to clipboard */
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
    } catch {
      /* ignore */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-xl border border-emerald-500/40 bg-slate-900 p-6 text-slate-100 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 text-slate-300 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <div className={`text-xs font-bold uppercase tracking-[0.3em] ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isWin ? 'Access Granted' : 'Signal Lost'}
          </div>
          <div className="mt-2 text-2xl font-bold">
            {isWin ? 'You cracked it' : 'Not this round'}
          </div>
          <div className="mt-1 font-mono text-lg uppercase tracking-widest text-slate-300">{secret}</div>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">
          <Stat label="Wins" value={stats.wins} />
          <Stat label="Played" value={stats.played} />
          <Stat label="Streak" value={stats.streak} />
          <Stat label="Best" value={stats.bestStreak} />
        </div>
        <div className="mt-2 text-center text-xs text-slate-300">
          Win rate <span className="font-mono text-emerald-400">{winRate}%</span>
        </div>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            type="button"
            onClick={onNewGame}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-emerald-500/60 bg-emerald-600/30 px-3 py-2 text-sm font-bold uppercase tracking-wide text-emerald-100 hover:bg-emerald-600/50"
          >
            <RefreshCw className="h-4 w-4" /> New Game
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-slate-700 bg-slate-800/60 p-2">
      <div className="font-mono text-lg font-bold text-emerald-300">{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-slate-300">{label}</div>
    </div>
  );
}

function ConfettiBurst() {
  const pieces = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 28 + Math.random() * 0.3;
      const distance = 140 + Math.random() * 120;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const colors = ['#34d399', '#fbbf24', '#22d3ee', '#a855f7', '#f472b6'];
      return {
        dx,
        dy,
        color: colors[i % colors.length],
        delay: Math.random() * 120,
      };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/3 z-30 h-0 w-0">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute block h-2 w-2 rounded-sm animate-vc-burst"
          style={{
            backgroundColor: p.color,
            ['--vc-dx' as never]: `${p.dx}px`,
            ['--vc-dy' as never]: `${p.dy}px`,
            animationDelay: `${p.delay}ms`,
          }}
        />
      ))}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Delete, CornerDownLeft, RefreshCw, Terminal, Trophy } from 'lucide-react';

const STORAGE_KEY = 'vibecalc-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';
const LENGTH = 8;
const MAX_ATTEMPTS = 6;

// Colors
const TERM_GREEN = '#22c55e';
const CORRECT_BG = '#047857';       // deep emerald
const CORRECT_BORDER = '#10b981';
const MISPLACED_BG = '#b45309';     // electric gold base
const MISPLACED_BORDER = '#f59e0b';
const ABSENT_BG = '#1f2937';
const ABSENT_BORDER = '#374151';

type Feedback = 'correct' | 'misplaced' | 'absent';

type Stats = { streak: number; best: number; wins: number; losses: number };
const DEFAULT_STATS: Stats = { streak: 0, best: 0, wins: 0, losses: 0 };

function loadStats(): Stats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATS;
  }
}

function saveStats(s: Stats) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

// ---------- math engine ----------
type Token = { kind: 'num'; value: number } | { kind: 'op'; value: '+' | '-' | '*' | '/' };

function tokenize(s: string): Token[] | null {
  const out: Token[] = [];
  let buf = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= '0' && c <= '9') {
      buf += c;
    } else if (c === '+' || c === '-' || c === '*' || c === '/') {
      if (!buf) return null;
      if (buf.length > 1 && buf[0] === '0') return null; // no leading zeros
      out.push({ kind: 'num', value: parseInt(buf, 10) });
      out.push({ kind: 'op', value: c });
      buf = '';
    } else {
      return null;
    }
  }
  if (!buf) return null;
  if (buf.length > 1 && buf[0] === '0') return null;
  out.push({ kind: 'num', value: parseInt(buf, 10) });
  return out;
}

function evalTokens(tokens: Token[]): number | null {
  // Pass 1: resolve * and /
  const pass1: Token[] = [];
  for (const t of tokens) {
    const last = pass1[pass1.length - 1];
    const prev = pass1[pass1.length - 2];
    if (t.kind === 'num' && last && last.kind === 'op' && (last.value === '*' || last.value === '/') && prev && prev.kind === 'num') {
      const op = last.value;
      const a = prev.value;
      const b = t.value;
      let r: number;
      if (op === '*') r = a * b;
      else {
        if (b === 0) return null;
        if (a % b !== 0) return null;
        r = a / b;
      }
      pass1.pop(); pass1.pop();
      pass1.push({ kind: 'num', value: r });
    } else {
      pass1.push(t);
    }
  }
  // Pass 2: left-to-right + and -
  if (!pass1.length || pass1[0].kind !== 'num') return null;
  let acc = (pass1[0] as Extract<Token, { kind: 'num' }>).value;
  for (let i = 1; i < pass1.length; i += 2) {
    const op = pass1[i];
    const n = pass1[i + 1];
    if (!op || !n || op.kind !== 'op' || n.kind !== 'num') return null;
    if (op.value === '+') acc += n.value;
    else if (op.value === '-') acc -= n.value;
    else return null;
  }
  return acc;
}

function isValidEquation(guess: string): { ok: boolean; reason?: string } {
  if (guess.length !== LENGTH) return { ok: false, reason: `Need ${LENGTH} chars` };
  const eqCount = (guess.match(/=/g) || []).length;
  if (eqCount !== 1) return { ok: false, reason: 'Need exactly one =' };
  const [lhs, rhs] = guess.split('=');
  if (!lhs || !rhs) return { ok: false, reason: 'Missing side of =' };
  const lt = tokenize(lhs);
  const rt = tokenize(rhs);
  if (!lt || !rt) return { ok: false, reason: 'Malformed equation' };
  const lv = evalTokens(lt);
  const rv = evalTokens(rt);
  if (lv === null || rv === null) return { ok: false, reason: 'Bad arithmetic' };
  if (!Number.isFinite(lv) || !Number.isFinite(rv)) return { ok: false, reason: 'Bad arithmetic' };
  if (lv !== rv) return { ok: false, reason: 'Invalid math' };
  return { ok: true };
}

// ---------- equation pool ----------
function buildEquationPool(): string[] {
  const pool = new Set<string>();
  const push = (s: string) => { if (s.length === LENGTH && isValidEquation(s).ok) pool.add(s); };

  // AB + CD = EF  (8)
  for (let a = 10; a <= 99; a++) for (let b = 10; b <= 99; b++) {
    const s = a + b; if (s >= 10 && s <= 99) push(`${a}+${b}=${s}`);
  }
  // AB - CD = EF  (8)  — CD > 0 already
  for (let a = 10; a <= 99; a++) for (let b = 10; b <= 99; b++) {
    const d = a - b; if (d >= 10 && d <= 99) push(`${a}-${b}=${d}`);
  }
  // AB * C = DEF  (8)
  for (let a = 10; a <= 99; a++) for (let b = 2; b <= 9; b++) {
    const p = a * b; if (p >= 100 && p <= 999) push(`${a}*${b}=${p}`);
  }
  // A * BC = DEF  (8)
  for (let a = 2; a <= 9; a++) for (let b = 10; b <= 99; b++) {
    const p = a * b; if (p >= 100 && p <= 999) push(`${a}*${b}=${p}`);
  }
  // ABC / D = EF (8)
  for (let a = 100; a <= 999; a++) for (let b = 2; b <= 9; b++) {
    if (a % b !== 0) continue;
    const q = a / b; if (q >= 10 && q <= 99) push(`${a}/${b}=${q}`);
  }
  // X + Y + Z = WW (8)
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) for (let c = 1; c <= 9; c++) {
    const s = a + b + c; if (s >= 10 && s <= 99) push(`${a}+${b}+${c}=${s}`);
  }
  // X * Y + Z = WW (8) — order of ops
  for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) for (let c = 1; c <= 9; c++) {
    const v = a * b + c; if (v >= 10 && v <= 99) push(`${a}*${b}+${c}=${v}`);
  }
  return Array.from(pool);
}

// cache pool across New Game clicks within a session
let POOL_CACHE: string[] | null = null;
function samplePool(): string[] {
  if (POOL_CACHE) return POOL_CACHE;
  const full = buildEquationPool();
  // pick 50 random so the secret is chosen from the curated subset the spec asks for
  const shuffled = [...full].sort(() => Math.random() - 0.5).slice(0, 50);
  POOL_CACHE = shuffled;
  return POOL_CACHE;
}

function pickSecret(): string {
  const p = samplePool();
  return p[Math.floor(Math.random() * p.length)];
}

function scoreGuess(guess: string, target: string): Feedback[] {
  const r: Feedback[] = Array(LENGTH).fill('absent');
  const used = Array(LENGTH).fill(false);
  for (let i = 0; i < LENGTH; i++) {
    if (guess[i] === target[i]) { r[i] = 'correct'; used[i] = true; }
  }
  for (let i = 0; i < LENGTH; i++) {
    if (r[i] === 'correct') continue;
    for (let j = 0; j < LENGTH; j++) {
      if (!used[j] && guess[i] === target[j]) {
        r[i] = 'misplaced'; used[j] = true; break;
      }
    }
  }
  return r;
}

// ---------- component ----------
export default function VibeCalc() {
  const [secret, setSecret] = useState<string>(() => pickSecret());
  const [guesses, setGuesses] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Feedback[][]>([]);
  const [current, setCurrent] = useState<string>('');
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string>('');
  const [hydrated, setHydrated] = useState(false);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);

  useEffect(() => { setStats(loadStats()); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) saveStats(stats); }, [stats, hydrated]);

  // key state colors for the keypad
  const keyState: Record<string, Feedback> = useMemo(() => {
    const map: Record<string, Feedback> = {};
    guesses.forEach((g, gi) => {
      const f = feedback[gi] || [];
      for (let i = 0; i < g.length; i++) {
        const c = g[i]; const s = f[i];
        if (!c || !s) continue;
        const prev = map[c];
        if (s === 'correct') map[c] = 'correct';
        else if (s === 'misplaced' && prev !== 'correct') map[c] = 'misplaced';
        else if (s === 'absent' && !prev) map[c] = 'absent';
      }
    });
    return map;
  }, [guesses, feedback]);

  function onChar(ch: string) {
    if (status !== 'playing') return;
    if (current.length >= LENGTH) return;
    setCurrent(current + ch);
    setError('');
  }
  function onDelete() {
    if (status !== 'playing') return;
    setCurrent(current.slice(0, -1));
    setError('');
  }
  function triggerShake(msg: string) {
    setError(msg);
    setShake(true);
    window.setTimeout(() => setShake(false), 500);
  }
  function onEnter() {
    if (status !== 'playing') return;
    if (current.length !== LENGTH) { triggerShake(`Need ${LENGTH} characters`); return; }
    const v = isValidEquation(current);
    if (!v.ok) { triggerShake(v.reason || 'Invalid math'); return; }
    const fb = scoreGuess(current, secret);
    const nextGuesses = [...guesses, current];
    const nextFeedback = [...feedback, fb];
    setGuesses(nextGuesses);
    setFeedback(nextFeedback);
    setCurrent('');
    if (current === secret) {
      setStatus('won');
      setStats((s) => {
        const streak = s.streak + 1;
        return { ...s, streak, best: Math.max(s.best, streak), wins: s.wins + 1 };
      });
    } else if (nextGuesses.length >= MAX_ATTEMPTS) {
      setStatus('lost');
      setStats((s) => ({ ...s, streak: 0, losses: s.losses + 1 }));
    }
  }

  function newGame() {
    setSecret(pickSecret());
    setGuesses([]); setFeedback([]); setCurrent(''); setError(''); setStatus('playing');
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key;
      if (k === 'Enter') { e.preventDefault(); onEnter(); }
      else if (k === 'Backspace') { e.preventDefault(); onDelete(); }
      else if (/^[0-9]$/.test(k)) { e.preventDefault(); onChar(k); }
      else if (k === '+' || k === '-' || k === '*' || k === '/' || k === '=') {
        e.preventDefault(); onChar(k);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const rows: string[] = [];
  for (let r = 0; r < MAX_ATTEMPTS; r++) {
    if (r < guesses.length) rows.push(guesses[r]);
    else if (r === guesses.length && status === 'playing') rows.push(current.padEnd(LENGTH, ' '));
    else rows.push('        ');
  }

  const numKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const opKeys = ['+', '-', '*', '/', '='];

  const cellStyle = (s?: Feedback) => {
    if (s === 'correct') return { bg: CORRECT_BG, border: CORRECT_BORDER, color: '#ecfdf5' };
    if (s === 'misplaced') return { bg: MISPLACED_BG, border: MISPLACED_BORDER, color: '#fffbeb' };
    if (s === 'absent') return { bg: ABSENT_BG, border: ABSENT_BORDER, color: '#9ca3af' };
    return { bg: 'transparent', border: 'rgba(34,197,94,0.35)', color: TERM_GREEN };
  };

  return (
    <div style={{ fontFamily: FONT_STACK }} className="w-full max-w-xl mx-auto px-4 pb-16">
      <style>{`
        @keyframes vc-cursor { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
        @keyframes vc-scan { 0% { transform: translateY(-100%) } 100% { transform: translateY(100%) } }
      `}</style>

      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Terminal size={18} style={{ color: TERM_GREEN }} />
          <span className="tracking-[0.25em] text-sm uppercase" style={{ color: TERM_GREEN }}>vibecalc</span>
          <span style={{ color: TERM_GREEN, animation: 'vc-cursor 1s steps(2) infinite' }}>_</span>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'rgba(34,197,94,0.75)' }}>
          <span className="flex items-center gap-1"><Trophy size={14} /> streak {stats.streak}</span>
          <span>best {stats.best}</span>
        </div>
      </header>

      <div className="rounded-md border p-4 md:p-6" style={{ borderColor: 'rgba(34,197,94,0.35)', background: '#000' }}>
        <div className="text-[11px] uppercase tracking-widest mb-3" style={{ color: 'rgba(34,197,94,0.55)' }}>
          {status === 'won' && '// equation resolved'}
          {status === 'lost' && `// memory dumped: ${secret}`}
          {status === 'playing' && `// guess ${guesses.length + 1} of ${MAX_ATTEMPTS}`}
        </div>

        <div className="grid gap-2">
          {rows.map((rowStr, ri) => {
            const isActiveRow = ri === guesses.length && status === 'playing';
            const rowFb = feedback[ri];
            return (
              <motion.div
                key={ri}
                className="grid gap-1.5"
                style={{ gridTemplateColumns: `repeat(${LENGTH}, minmax(0, 1fr))` }}
                animate={isActiveRow && shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {Array.from({ length: LENGTH }).map((_, ci) => {
                  const ch = rowStr[ci] || '';
                  const fb = rowFb ? rowFb[ci] : undefined;
                  const style = cellStyle(fb);
                  const filled = ch !== ' ' && ch !== '';
                  return (
                    <motion.div
                      key={ci}
                      initial={rowFb ? { rotateX: 0 } : false}
                      animate={rowFb ? { rotateX: [0, 90, 0] } : { scale: isActiveRow && filled ? [1, 1.08, 1] : 1 }}
                      transition={rowFb ? { duration: 0.55, delay: ci * 0.08, ease: 'easeInOut' } : { duration: 0.15 }}
                      className="aspect-square flex items-center justify-center text-xl md:text-2xl font-bold rounded-sm select-none"
                      style={{
                        background: style.bg,
                        border: `1.5px solid ${style.border}`,
                        color: style.color,
                        boxShadow: fb === 'correct' ? '0 0 14px rgba(16,185,129,0.55)' :
                                   fb === 'misplaced' ? '0 0 14px rgba(245,158,11,0.45)' :
                                   filled && !fb ? '0 0 10px rgba(34,197,94,0.25)' : 'none',
                      }}
                    >
                      {filled ? ch : ''}
                    </motion.div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center text-xs tracking-wider uppercase"
              style={{ color: '#f87171' }}
            >
              ✘ {error}
            </motion.div>
          )}
          {status === 'won' && (
            <motion.div key="won" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-sm" style={{ color: TERM_GREEN }}>
              ✔ solved in {guesses.length} — streak {stats.streak}
            </motion.div>
          )}
          {status === 'lost' && (
            <motion.div key="lost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-sm" style={{ color: '#f87171' }}>
              ✘ answer was <span style={{ color: TERM_GREEN }}>{secret}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* keypad */}
      <div className="mt-4 flex flex-col gap-1.5">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(10, minmax(0, 1fr))' }}>
          {numKeys.map((k) => <Key key={k} label={k} onPress={() => onChar(k)} state={keyState[k]} />)}
        </div>
        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
          {opKeys.map((k) => <Key key={k} label={k} onPress={() => onChar(k)} state={keyState[k]} />)}
          <Key label="DEL" icon={<Delete size={16} />} onPress={onDelete} />
          <Key label="ENTER" icon={<CornerDownLeft size={16} />} onPress={onEnter} accent />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-widest" style={{ color: 'rgba(34,197,94,0.5)' }}>
          wins {stats.wins} · losses {stats.losses}
        </div>
        <button
          onClick={newGame}
          className="flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-widest rounded border"
          style={{ borderColor: TERM_GREEN, color: TERM_GREEN, background: 'rgba(34,197,94,0.06)' }}
        >
          <RefreshCw size={14} /> new game
        </button>
      </div>
    </div>
  );
}

function Key({
  label, onPress, state, icon, accent,
}: {
  label: string;
  onPress: () => void;
  state?: Feedback;
  icon?: React.ReactNode;
  accent?: boolean;
}) {
  let bg = 'rgba(34,197,94,0.08)';
  let border = 'rgba(34,197,94,0.4)';
  let color = TERM_GREEN;
  if (state === 'correct') { bg = CORRECT_BG; border = CORRECT_BORDER; color = '#ecfdf5'; }
  else if (state === 'misplaced') { bg = MISPLACED_BG; border = MISPLACED_BORDER; color = '#fffbeb'; }
  else if (state === 'absent') { bg = ABSENT_BG; border = ABSENT_BORDER; color = '#9ca3af'; }
  if (accent && !state) { bg = 'rgba(34,197,94,0.18)'; }

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -1 }}
      onClick={onPress}
      className="h-11 md:h-12 rounded-sm text-sm font-bold flex items-center justify-center gap-1.5 uppercase"
      style={{ background: bg, border: `1.5px solid ${border}`, color, fontFamily: FONT_STACK }}
    >
      {icon}
      {label.length > 1 ? <span className="text-[10px] tracking-widest">{label}</span> : label}
    </motion.button>
  );
}

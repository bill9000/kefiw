import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Zap, Trophy, Eraser, Lock } from 'lucide-react';

const STORAGE_KEY = 'vibecrypt-stats-v1';
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

const COLOR_BG = '#020617';
const COLOR_DIM = '#64748b';
const COLOR_GUESS = '#22c55e';
const COLOR_GUESS_GLOW = '#4ade80';
const COLOR_REVEAL = '#facc15';
const COLOR_SELECT = '#38bdf8';

type Quote = { text: string; author: string };

const QUOTES: Quote[] = [
  { text: 'The greatest danger to the future is apathy.', author: 'Jane Goodall' },
  { text: 'The measure of intelligence is the ability to change.', author: 'Albert Einstein' },
  { text: 'The best way to predict the future is to invent it.', author: 'Alan Kay' },
  { text: 'Any sufficiently advanced technology is indistinguishable from magic.', author: 'Arthur C. Clarke' },
  { text: 'The real problem is not whether machines think but whether men do.', author: 'B.F. Skinner' },
  { text: 'The science of today is the technology of tomorrow.', author: 'Edward Teller' },
  { text: 'Simplicity is the ultimate sophistication.', author: 'Leonardo da Vinci' },
  { text: 'I think therefore I am.', author: 'Rene Descartes' },
  { text: 'The unexamined life is not worth living.', author: 'Socrates' },
  { text: 'Knowledge itself is power.', author: 'Francis Bacon' },
  { text: 'The future is already here, it is just not evenly distributed.', author: 'William Gibson' },
  { text: 'Imagination is more important than knowledge.', author: 'Albert Einstein' },
  { text: 'Artificial intelligence is the new electricity.', author: 'Andrew Ng' },
  { text: 'First solve the problem, then write the code.', author: 'John Johnson' },
  { text: 'The only true wisdom is in knowing you know nothing.', author: 'Socrates' },
  { text: 'The mind is not a vessel to be filled but a fire to be kindled.', author: 'Plutarch' },
  { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  { text: 'The function of good software is to make the complex appear simple.', author: 'Grady Booch' },
  { text: 'We shape our tools and thereafter our tools shape us.', author: 'Marshall McLuhan' },
  { text: 'Software is a great combination between artistry and engineering.', author: 'Bill Gates' },
];

const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function makeCipherMaps(): { cipher: Map<string, string>; reverse: Map<string, string> } {
  const src = ALPHA.split('');
  let dst: string[];
  do {
    dst = [...src];
    for (let i = dst.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [dst[i], dst[j]] = [dst[j], dst[i]];
    }
  } while (src.some((s, i) => s === dst[i]));
  const cipher = new Map<string, string>();
  const reverse = new Map<string, string>();
  src.forEach((s, i) => { cipher.set(s, dst[i]); reverse.set(dst[i], s); });
  return { cipher, reverse };
}

export default function VibeCrypt() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [cipher, setCipher] = useState<Map<string, string>>(new Map());
  const [reverse, setReverse] = useState<Map<string, string>>(new Map());
  const [userGuess, setUserGuess] = useState<Map<string, string>>(new Map());
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<string | null>(null);
  const [flicker, setFlicker] = useState<string | null>(null);
  const [won, setWon] = useState(false);
  const [decryptions, setDecryptions] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  function newGame() {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const { cipher: c, reverse: r } = makeCipherMaps();
    setQuote(q);
    setCipher(c);
    setReverse(r);
    setUserGuess(new Map());
    setRevealed(new Set());
    setSelected(null);
    setWon(false);
    setFlicker(null);
  }

  useEffect(() => { newGame(); }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDecryptions(JSON.parse(raw).decryptions ?? 0);
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ decryptions })); } catch {}
  }, [decryptions, hydrated]);

  const encrypted = useMemo(() => {
    if (!quote || cipher.size === 0) return '';
    return quote.text.split('').map((ch) => {
      const u = ch.toUpperCase();
      if (/[A-Z]/.test(u)) {
        const enc = cipher.get(u);
        if (!enc) return ch;
        return ch === u ? enc : enc.toLowerCase();
      }
      return ch;
    }).join('');
  }, [quote, cipher]);

  // win detection
  useEffect(() => {
    if (!quote || won || reverse.size === 0) return;
    const present = new Set<string>();
    for (const ch of encrypted) {
      const u = ch.toUpperCase();
      if (/[A-Z]/.test(u)) present.add(u);
    }
    if (present.size === 0) return;
    for (const c of present) {
      if (userGuess.get(c) !== reverse.get(c)) return;
    }
    setWon(true);
    setDecryptions((n) => n + 1);
  }, [userGuess, reverse, quote, encrypted, won]);

  function assignGuess(ciphLetter: string, plainLetter: string) {
    if (revealed.has(ciphLetter) || won) return;
    setUserGuess((prev) => {
      const next = new Map(prev);
      // clear previous cipher that used this plain letter (non-revealed only)
      for (const [k, v] of next) {
        if (v === plainLetter && k !== ciphLetter && !revealed.has(k)) next.delete(k);
      }
      if (!plainLetter) next.delete(ciphLetter);
      else next.set(ciphLetter, plainLetter);
      return next;
    });
    setFlicker(ciphLetter);
    window.setTimeout(() => setFlicker(null), 420);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (!selected) return;
      if (e.key === 'Backspace' || e.key === 'Delete' || e.key === ' ') {
        e.preventDefault(); assignGuess(selected, ''); return;
      }
      if (e.key === 'Escape') { e.preventDefault(); setSelected(null); return; }
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        assignGuess(selected, e.key.toUpperCase());
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function bruteForce() {
    if (!quote || won || reverse.size === 0) return;
    const present = Array.from(new Set(encrypted.toUpperCase().replace(/[^A-Z]/g, '')));
    const unsolved = present.filter((c) => !revealed.has(c) && userGuess.get(c) !== reverse.get(c));
    if (!unsolved.length) return;
    const pick = unsolved[Math.floor(Math.random() * unsolved.length)];
    const plain = reverse.get(pick)!;
    setUserGuess((prev) => {
      const next = new Map(prev);
      for (const [k, v] of next) {
        if (v === plain && k !== pick && !revealed.has(k)) next.delete(k);
      }
      next.set(pick, plain);
      return next;
    });
    setRevealed((prev) => new Set([...prev, pick]));
    setFlicker(pick);
    window.setTimeout(() => setFlicker(null), 420);
  }

  function clearGuesses() {
    if (won) return;
    const next = new Map<string, string>();
    for (const r of revealed) {
      const plain = reverse.get(r);
      if (plain) next.set(r, plain);
    }
    setUserGuess(next);
  }

  const freq = useMemo(() => {
    const f = new Map<string, number>();
    for (const ch of encrypted) {
      const u = ch.toUpperCase();
      if (/[A-Z]/.test(u)) f.set(u, (f.get(u) || 0) + 1);
    }
    return Array.from(f.entries()).sort((a, b) => b[1] - a[1]);
  }, [encrypted]);
  const maxFreq = freq.length ? freq[0][1] : 1;

  const score = useMemo(() => {
    if (!quote || reverse.size === 0) return { typed: 0, brute: 0, total: 0, points: 0 };
    const present = new Set<string>();
    for (const ch of encrypted) {
      const u = ch.toUpperCase();
      if (/[A-Z]/.test(u)) present.add(u);
    }
    let typed = 0;
    let brute = 0;
    for (const c of present) {
      const correct = userGuess.get(c) === reverse.get(c);
      if (!correct) continue;
      if (revealed.has(c)) brute++;
      else typed++;
    }
    return { typed, brute, total: present.size, points: typed * 10 + brute * 2 };
  }, [quote, reverse, encrypted, userGuess, revealed]);

  // split message into tokens: words and separators
  const tokens = useMemo(() => {
    if (!encrypted) return [] as string[];
    return encrypted.split(/(\s+)/);
  }, [encrypted]);

  function renderCell(ch: string, key: string) {
    const u = ch.toUpperCase();
    if (!/[A-Z]/.test(u)) {
      return (
        <span key={key} className="inline-flex flex-col items-center" style={{ minWidth: '0.7em' }}>
          <span style={{ fontSize: '1.1em', color: COLOR_DIM, minHeight: '1.3em' }}>{ch}</span>
          <span style={{ fontSize: '0.7em', color: 'transparent', minHeight: '1em' }}>_</span>
        </span>
      );
    }
    const guess = userGuess.get(u);
    const isRevealed = revealed.has(u);
    const isSelected = selected === u;
    const isFlicker = flicker === u;
    const color = !guess ? COLOR_DIM : isRevealed ? COLOR_REVEAL : COLOR_GUESS_GLOW;
    const borderColor = isSelected ? COLOR_SELECT : 'rgba(100,116,139,0.35)';
    const bg = isSelected ? 'rgba(56,189,248,0.12)' : 'transparent';
    return (
      <motion.span
        key={key}
        onClick={() => setSelected(u)}
        animate={isFlicker ? { opacity: [1, 0.25, 1, 0.5, 1] } : { opacity: 1 }}
        transition={{ duration: 0.42 }}
        className="inline-flex flex-col items-center cursor-pointer"
        style={{
          padding: '0 0.1em',
          minWidth: '0.95em',
          borderBottom: `2px solid ${borderColor}`,
          background: bg,
          borderRadius: 2,
        }}
      >
        <span
          style={{
            fontSize: '1.1em',
            fontWeight: 700,
            color,
            textShadow: guess ? `0 0 8px ${color}` : undefined,
            minHeight: '1.3em',
            lineHeight: 1,
          }}
        >
          {guess || '\u00A0'}
        </span>
        <span style={{ fontSize: '0.7em', color: COLOR_DIM, opacity: 0.7 }}>{u}</span>
      </motion.span>
    );
  }

  return (
    <div style={{ fontFamily: FONT_STACK, background: COLOR_BG }} className="w-full max-w-2xl mx-auto px-4 pb-16">
      <style>{`
        @keyframes vc-blink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
      `}</style>

      <header className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Lock size={18} style={{ color: COLOR_GUESS }} />
          <span className="tracking-[0.25em] text-sm uppercase" style={{ color: COLOR_GUESS }}>vibecrypt</span>
          <span style={{ color: COLOR_GUESS_GLOW, animation: 'vc-blink 1s steps(2) infinite' }}>▌</span>
        </div>
        <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(34,197,94,0.8)' }}>
          <Trophy size={13} /> decryptions {decryptions}
        </div>
      </header>

      <div className="rounded-md border p-4 md:p-5" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'rgba(34,197,94,0.65)' }}>
          // signal captured — apply frequency analysis
        </div>
        <div className="text-xs mb-4" style={{ color: 'rgba(100,116,139,0.85)' }}>
          click a letter, type the plaintext you think it should be. the whole cipher updates.
        </div>

        <div
          className="flex flex-wrap items-end justify-start leading-none text-base md:text-lg"
          style={{ rowGap: '1.4em', columnGap: '0.25em' }}
        >
          {tokens.map((tok, ti) => {
            if (/^\s+$/.test(tok)) {
              return <span key={`sp-${ti}`} style={{ width: '0.6em', display: 'inline-block' }} />;
            }
            return (
              <span key={`w-${ti}`} className="inline-flex items-end">
                {tok.split('').map((ch, ci) => renderCell(ch, `${ti}-${ci}`))}
              </span>
            );
          })}
        </div>

        {quote && (
          <div className="mt-5 text-right text-[11px] uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.8)' }}>
            — {quote.author}
          </div>
        )}

        {won && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 text-center py-3 rounded-sm"
            style={{ background: 'rgba(34,197,94,0.1)', border: `1px solid ${COLOR_GUESS}`, color: COLOR_GUESS_GLOW }}
          >
            <div className="text-sm uppercase tracking-[0.25em]">✓ signal decrypted · score {score.points}</div>
            <div className="text-[11px] mt-1 tracking-widest uppercase" style={{ color: 'rgba(148,163,184,0.85)' }}>
              typed <span style={{ color: COLOR_GUESS_GLOW, fontWeight: 700 }}>{score.typed}</span>
              {' · '}brute <span style={{ color: COLOR_REVEAL, fontWeight: 700 }}>{score.brute}</span>
              {' · '}total {score.total}
              {' · '}typed ×10 · brute ×2
            </div>
            <div className="text-xs mt-1 italic" style={{ color: 'rgba(226,232,240,0.9)' }}>&ldquo;{quote?.text}&rdquo;</div>
          </motion.div>
        )}
      </div>

      {/* frequency chart */}
      <div className="mt-4 rounded-md border p-3" style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest mb-2" style={{ color: 'rgba(34,197,94,0.65)' }}>
          <span>data stream — letter frequency</span>
          <span style={{ color: 'rgba(100,116,139,0.8)' }}>in english: E · T · A · O · I · N</span>
        </div>
        <div className="flex gap-0.5 items-end h-20">
          {freq.map(([letter, count]) => {
            const h = (count / maxFreq) * 100;
            const guess = userGuess.get(letter);
            const color = guess ? (revealed.has(letter) ? COLOR_REVEAL : COLOR_GUESS_GLOW) : COLOR_DIM;
            const isSelected = selected === letter;
            return (
              <div
                key={letter}
                onClick={() => setSelected(letter)}
                className="flex-1 flex flex-col items-center justify-end cursor-pointer gap-0.5"
                style={{ minWidth: '1.2em' }}
              >
                <div className="text-[9px]" style={{ color }}>{count}</div>
                <div
                  style={{
                    width: '100%',
                    height: `${Math.max(8, h * 0.62)}%`,
                    background: color,
                    boxShadow: `0 0 6px ${color}66`,
                    opacity: guess ? 0.9 : 0.5,
                    outline: isSelected ? `1px solid ${COLOR_SELECT}` : 'none',
                  }}
                />
                <div className="text-[10px] font-bold" style={{ color: isSelected ? COLOR_SELECT : color }}>{letter}</div>
                {guess && <div className="text-[9px]" style={{ color }}>{guess}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* score strip */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="rounded-sm border px-3 py-1.5 text-center" style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.06)' }}>
          <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(148,163,184,0.7)' }}>typed</div>
          <div className="text-lg font-bold" style={{ color: COLOR_GUESS_GLOW }}>{score.typed}<span className="text-[11px] font-normal" style={{ color: 'rgba(148,163,184,0.6)' }}> / {score.total}</span></div>
        </div>
        <div className="rounded-sm border px-3 py-1.5 text-center" style={{ borderColor: 'rgba(250,204,21,0.3)', background: 'rgba(250,204,21,0.06)' }}>
          <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(148,163,184,0.7)' }}>brute</div>
          <div className="text-lg font-bold" style={{ color: COLOR_REVEAL }}>{score.brute}</div>
        </div>
        <div className="rounded-sm border px-3 py-1.5 text-center" style={{ borderColor: 'rgba(56,189,248,0.3)', background: 'rgba(56,189,248,0.06)' }}>
          <div className="text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(148,163,184,0.7)' }}>score</div>
          <div className="text-lg font-bold" style={{ color: COLOR_SELECT }}>{score.points}</div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 justify-between">
        <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(100,116,139,0.75)' }}>
          {selected
            ? <span>selected <span style={{ color: COLOR_SELECT }}>{selected}</span> — type a letter · esc to deselect</span>
            : 'click a letter to begin'}
        </div>
        <div className="flex gap-2">
          <button
            onClick={clearGuesses}
            disabled={won}
            className="px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest flex items-center gap-1"
            style={{ border: '1px solid rgba(148,163,184,0.4)', color: 'rgba(148,163,184,0.85)' }}
          >
            <Eraser size={12} /> clear
          </button>
          <button
            onClick={bruteForce}
            disabled={won}
            className="px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest flex items-center gap-1"
            style={{ border: `1px solid ${COLOR_REVEAL}`, color: COLOR_REVEAL, background: 'rgba(250,204,21,0.08)' }}
          >
            <Zap size={12} /> brute force
          </button>
          <button
            onClick={newGame}
            className="px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest flex items-center gap-1"
            style={{ border: `1px solid ${COLOR_GUESS}`, color: COLOR_GUESS }}
          >
            <RefreshCw size={12} /> new signal
          </button>
        </div>
      </div>
    </div>
  );
}

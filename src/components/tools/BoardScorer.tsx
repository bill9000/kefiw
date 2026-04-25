// Board Scorer — takes an existing 15×15 board state and a proposed play,
// computes the full turn score including premium squares (only new tiles get
// the bonus), cross-words, and the bingo bonus if all rack tiles are used.
//
// This is not a solver — it doesn't pick the best move for you. It's the
// "did I score that right?" tool: verify or double-check a play.

import { useMemo, useState } from 'react';
import type { BoardConfig, CellMod } from '~/data/board-config';

interface Props {
  config: BoardConfig;
}

type Direction = 'H' | 'V';

// Normalize a raw string into a 15-row × 15-col board. Each row's chars are
// letters or '.' (empty). Rows shorter than 15 get right-padded with '.';
// missing rows get padded too. Accepts space, '_', or '-' as alternate empties.
function parseBoard(raw: string): string[] {
  const rows = raw.split(/\r?\n/).slice(0, 15);
  const normalized: string[] = [];
  for (let r = 0; r < 15; r++) {
    const row = rows[r] ?? '';
    const chars: string[] = [];
    for (let c = 0; c < 15; c++) {
      const ch = (row[c] ?? '.').toLowerCase();
      if (/[a-z]/.test(ch)) chars.push(ch);
      else chars.push('.');
    }
    normalized.push(chars.join(''));
  }
  return normalized;
}

function boardToString(board: string[]): string {
  return board.join('\n');
}

function emptyBoard(): string[] {
  return Array(15).fill('.'.repeat(15));
}

function premiumAt(layout: string[], r: number, c: number): CellMod {
  if (r < 0 || r >= 15 || c < 0 || c >= 15) return '_';
  return layout[r][c] as CellMod;
}

function letterMultiplier(mod: CellMod): number {
  return mod === 'd' ? 2 : mod === 't' ? 3 : 1;
}

function wordMultiplier(mod: CellMod): number {
  return mod === '2' || mod === '*' ? 2 : mod === '3' ? 3 : 1;
}

interface ScoredWord {
  word: string;
  score: number;
  breakdown: string;
}

interface ScoreResult {
  valid: boolean;
  error?: string;
  mainWord: ScoredWord | null;
  crossWords: ScoredWord[];
  bingoBonus: number;
  total: number;
  newTiles: Array<{ row: number; col: number; letter: string }>;
  firstPlay: boolean;
  coversCenter: boolean;
}

// Compute the full score of placing `word` at (row, col) in `direction` onto
// the given board. Premiums only apply to tiles newly placed THIS turn.
function scorePlay(
  board: string[],
  layout: string[],
  values: Record<string, number>,
  bingoBonus: number,
  rackSize: number,
  word: string,
  row: number,
  col: number,
  direction: Direction,
): ScoreResult {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  const empty: ScoreResult = {
    valid: false, mainWord: null, crossWords: [], bingoBonus: 0, total: 0,
    newTiles: [], firstPlay: false, coversCenter: false,
  };
  if (!w) return { ...empty, error: 'Enter a word to place.' };
  if (row < 0 || row >= 15 || col < 0 || col >= 15) return { ...empty, error: 'Row and column must be 0–14.' };

  // Check the play fits on the board.
  const endR = direction === 'V' ? row + w.length - 1 : row;
  const endC = direction === 'H' ? col + w.length - 1 : col;
  if (endR >= 15 || endC >= 15) return { ...empty, error: 'Word runs off the board.' };

  // Walk the play. For each cell, either it must match an existing letter on
  // the board OR the cell must be empty (new tile placed).
  const newTiles: Array<{ row: number; col: number; letter: string }> = [];
  for (let i = 0; i < w.length; i++) {
    const r = direction === 'V' ? row + i : row;
    const c = direction === 'H' ? col + i : col;
    const existing = board[r][c];
    if (existing !== '.' && existing !== w[i]) {
      return { ...empty, error: `Conflict at (${r},${c}): board has "${existing.toUpperCase()}" but play expects "${w[i].toUpperCase()}".` };
    }
    if (existing === '.') newTiles.push({ row: r, col: c, letter: w[i] });
  }
  if (newTiles.length === 0) {
    return { ...empty, error: 'All letters already on board — nothing new placed.' };
  }

  // Board-emptiness check: if the board has no letters anywhere, this is the
  // first play and it must cover the center star (7,7).
  let boardEmpty = true;
  for (let r = 0; r < 15 && boardEmpty; r++)
    for (let c = 0; c < 15 && boardEmpty; c++)
      if (board[r][c] !== '.') boardEmpty = false;
  const coversCenter = newTiles.some((t) => t.row === 7 && t.col === 7);
  if (boardEmpty && !coversCenter) {
    return { ...empty, error: 'First play must cover the center star at (7,7).' };
  }

  // If board not empty, the play must connect — touch at least one existing
  // tile or use an existing tile. The presence of any cell on the play that
  // wasn't newly placed means we connected. Otherwise check neighbors of new
  // tiles.
  if (!boardEmpty) {
    const usedExisting = newTiles.length < w.length;
    const touches = newTiles.some((t) => {
      for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
        const nr = t.row + dr, nc = t.col + dc;
        if (nr >= 0 && nr < 15 && nc >= 0 && nc < 15 && board[nr][nc] !== '.') return true;
      }
      return false;
    });
    if (!usedExisting && !touches) {
      return { ...empty, error: 'Play must connect to an existing tile on the board.' };
    }
  }

  // Main-word score: walk the extended word (expanding through adjacent
  // existing tiles before/after the placed range).
  const mainExtended = extendWordAlong(board, row, col, direction, w);
  const mainScore = scoreExtendedWord(mainExtended, board, layout, values, newTiles);

  // Cross-words: for each new tile, check the perpendicular run through it.
  // If that run has length >= 2, it's a cross-word formed by this play.
  const crossWords: ScoredWord[] = [];
  const crossDir: Direction = direction === 'H' ? 'V' : 'H';
  for (const t of newTiles) {
    // Simulate placing the letter, then extend in the perpendicular axis.
    const boardWithLetter = placeLetter(board, t.row, t.col, t.letter);
    const run = extendWordAt(boardWithLetter, t.row, t.col, crossDir);
    if (run.word.length >= 2) {
      const s = scoreExtendedWord(run, boardWithLetter, layout, values, [t]);
      crossWords.push(s);
    }
  }

  const bonus = newTiles.length >= rackSize ? bingoBonus : 0;
  const total = (mainScore.score) + crossWords.reduce((s, cw) => s + cw.score, 0) + bonus;

  return {
    valid: true,
    mainWord: mainScore,
    crossWords,
    bingoBonus: bonus,
    total,
    newTiles,
    firstPlay: boardEmpty,
    coversCenter,
  };
}

function placeLetter(board: string[], r: number, c: number, letter: string): string[] {
  const out = board.slice();
  out[r] = out[r].slice(0, c) + letter + out[r].slice(c + 1);
  return out;
}

interface ExtendedWord {
  word: string;
  cells: Array<{ row: number; col: number; letter: string }>;
  direction: Direction;
}

// Extend along the primary direction, including letters already on the board
// on either end of the placed range.
function extendWordAlong(board: string[], row: number, col: number, direction: Direction, placedWord: string): ExtendedWord {
  let r = row, c = col;
  // Walk backward to find the true start.
  while (true) {
    const nr = direction === 'V' ? r - 1 : r;
    const nc = direction === 'H' ? c - 1 : c;
    if (nr < 0 || nc < 0 || board[nr][nc] === '.') break;
    r = nr; c = nc;
  }
  const cells: Array<{ row: number; col: number; letter: string }> = [];
  let rr = r, cc = c;
  const startR = row, startC = col;
  for (let i = 0; ; i++) {
    if (rr >= 15 || cc >= 15) break;
    const existing = board[rr][cc];
    let letter: string;
    if (existing !== '.') {
      letter = existing;
    } else {
      // Map to the placed word letter by offset from start
      const off = direction === 'V' ? rr - startR : cc - startC;
      if (off < 0 || off >= placedWord.length) break;
      letter = placedWord[off];
    }
    cells.push({ row: rr, col: cc, letter });
    if (direction === 'V') rr++; else cc++;
    // Stop when we pass the end of the placed word AND the next cell is empty.
    const placedEnd = direction === 'V' ? startR + placedWord.length : startC + placedWord.length;
    const cursor = direction === 'V' ? rr : cc;
    if (cursor >= placedEnd) {
      if (rr >= 15 || cc >= 15 || board[rr]?.[cc] === '.') break;
    }
  }
  return { word: cells.map((c) => c.letter).join(''), cells, direction };
}

// Extend a word at (r,c) in the given direction on the given board. Used for
// perpendicular cross-words. The letter at (r,c) must already be placed on
// the board passed in.
function extendWordAt(board: string[], r: number, c: number, direction: Direction): ExtendedWord {
  // Walk backward
  let sr = r, sc = c;
  while (true) {
    const nr = direction === 'V' ? sr - 1 : sr;
    const nc = direction === 'H' ? sc - 1 : sc;
    if (nr < 0 || nc < 0 || board[nr][nc] === '.') break;
    sr = nr; sc = nc;
  }
  const cells: Array<{ row: number; col: number; letter: string }> = [];
  let rr = sr, cc = sc;
  while (rr < 15 && cc < 15 && board[rr][cc] !== '.') {
    cells.push({ row: rr, col: cc, letter: board[rr][cc] });
    if (direction === 'V') rr++; else cc++;
  }
  return { word: cells.map((c) => c.letter).join(''), cells, direction };
}

function scoreExtendedWord(
  ext: ExtendedWord,
  _board: string[],
  layout: string[],
  values: Record<string, number>,
  newTiles: Array<{ row: number; col: number; letter: string }>,
): ScoredWord {
  let letterSum = 0;
  let wordMult = 1;
  const parts: string[] = [];
  const newSet = new Set(newTiles.map((t) => `${t.row},${t.col}`));
  for (const cell of ext.cells) {
    const isNew = newSet.has(`${cell.row},${cell.col}`);
    const mod = isNew ? premiumAt(layout, cell.row, cell.col) : '_';
    const letterVal = values[cell.letter] ?? 0;
    const lMult = letterMultiplier(mod);
    const wMult = wordMultiplier(mod);
    letterSum += letterVal * lMult;
    wordMult *= wMult;
    parts.push(`${cell.letter.toUpperCase()}=${letterVal}${lMult > 1 ? `×${lMult}` : ''}`);
  }
  const score = letterSum * wordMult;
  const breakdown = `${parts.join(' + ')}${wordMult > 1 ? ` then ×${wordMult}` : ''} = ${score}`;
  return { word: ext.word.toUpperCase(), score, breakdown };
}

export default function BoardScorer({ config }: Props): JSX.Element {
  const [boardText, setBoardText] = useState(boardToString(emptyBoard()));
  const [word, setWord] = useState('');
  const [row, setRow] = useState(7);
  const [col, setCol] = useState(7);
  const [direction, setDirection] = useState<Direction>('H');

  const board = useMemo(() => parseBoard(boardText), [boardText]);
  const result = useMemo(
    () => scorePlay(board, config.layout, config.values, config.bingoBonus, config.rackSize, word, row, col, direction),
    [board, config, word, row, col, direction],
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="label" htmlFor="board">Current board (15 rows × 15 chars, use . for empty)</label>
        <textarea
          id="board"
          className="input h-60 font-mono text-xs tracking-[0.2em]"
          value={boardText}
          onChange={(e) => setBoardText(e.target.value)}
          spellCheck={false}
        />
        <div className="mt-1 flex flex-wrap gap-2 text-xs">
          <button type="button" onClick={() => setBoardText(boardToString(emptyBoard()))} className="btn-ghost">Clear board</button>
          <span className="text-slate-500">Paste from your phone game or type letters where tiles already sit; everything else stays <code>.</code></span>
        </div>
      </div>

      {/* Visual preview of the parsed board with premium-square colors */}
      <div className="overflow-x-auto">
        <table className="border-collapse text-[10px] font-mono" aria-label={`${config.label} board preview`}>
          <tbody>
            {board.map((rowStr, r) => (
              <tr key={r}>
                {rowStr.split('').map((ch, c) => {
                  const mod = config.layout[r][c] as CellMod;
                  const bg =
                    ch !== '.' ? 'bg-slate-800 text-white' :
                    mod === '3' ? 'bg-rose-500 text-white' :
                    mod === '2' ? 'bg-pink-300' :
                    mod === '*' ? 'bg-pink-400 text-white' :
                    mod === 't' ? 'bg-blue-500 text-white' :
                    mod === 'd' ? 'bg-sky-200' :
                    'bg-slate-50';
                  return (
                    <td key={c} className={`h-6 w-6 border border-slate-200 text-center align-middle ${bg}`}>
                      {ch !== '.' ? ch.toUpperCase() : mod === '3' ? '3W' : mod === '2' ? '2W' : mod === '*' ? '★' : mod === 't' ? '3L' : mod === 'd' ? '2L' : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-slate-700">
          Your word
          <input className="input font-mono uppercase tracking-widest" value={word} onChange={(e) => setWord(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} placeholder="e.g. QUIET" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-700">
          Row (0–14)
          <input type="number" min={0} max={14} className="input" value={row} onChange={(e) => setRow(Math.max(0, Math.min(14, Number(e.target.value) || 0)))} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-700">
          Col (0–14)
          <input type="number" min={0} max={14} className="input" value={col} onChange={(e) => setCol(Math.max(0, Math.min(14, Number(e.target.value) || 0)))} />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-700">
          Direction
          <select className="input" value={direction} onChange={(e) => setDirection(e.target.value as Direction)}>
            <option value="H">Horizontal (→)</option>
            <option value="V">Vertical (↓)</option>
          </select>
        </label>
      </div>

      {result.error && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong>Can&rsquo;t score this play:</strong> {result.error}
        </div>
      )}

      {result.valid && result.mainWord && (
        <div className="space-y-3">
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Total for this turn</div>
            <div className="mt-1 text-4xl font-bold text-emerald-900">{result.total} <span className="text-xl font-normal text-emerald-700">points</span></div>
            {result.bingoBonus > 0 && (
              <div className="mt-1 text-sm text-emerald-800">Includes +{result.bingoBonus} bingo bonus (all {config.rackSize} tiles used).</div>
            )}
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Main word</div>
            <div className="mt-0.5 text-sm"><strong>{result.mainWord.word}</strong> · {result.mainWord.score} pts</div>
            <div className="mt-1 font-mono text-xs text-slate-600">{result.mainWord.breakdown}</div>
          </div>

          {result.crossWords.length > 0 && (
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cross-words formed ({result.crossWords.length})</div>
              <ul className="mt-1 space-y-1">
                {result.crossWords.map((cw, i) => (
                  <li key={i} className="text-sm">
                    <strong>{cw.word}</strong> · {cw.score} pts
                    <div className="font-mono text-xs text-slate-500">{cw.breakdown}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <strong>New tiles placed this turn ({result.newTiles.length}):</strong>{' '}
            {result.newTiles.map((t) => `${t.letter.toUpperCase()}@(${t.row},${t.col})`).join(' · ')}
            {result.firstPlay && <div className="mt-1">First play — center star (7,7) doubled the main word.</div>}
          </div>
        </div>
      )}

      <aside className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <strong>How this works:</strong> premium squares (DL, TL, DW, TW) only apply to tiles
        newly placed this turn — existing board tiles use their plain letter values even if
        they sit on a premium square. Cross-words (perpendicular words formed by your new
        tiles) score separately and are added to the total. Bingo bonus is +{config.bingoBonus}
        {' '}if all {config.rackSize} rack tiles are used. {config.label === 'WWF' && ' WWF\'s premium-square layout differs from Scrabble\'s — the grid above shows this game\'s layout.'}
      </aside>
    </div>
  );
}

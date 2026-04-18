export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
export type Board = number[]; // length 81, 0 = empty

const DIFFICULTY_CLUES: Record<Difficulty, number> = {
  easy: 40,
  medium: 32,
  hard: 28,
  expert: 24,
};

function rowIdx(r: number) { return Array.from({ length: 9 }, (_, c) => r * 9 + c); }
function colIdx(c: number) { return Array.from({ length: 9 }, (_, r) => r * 9 + c); }
function boxIdx(br: number, bc: number) {
  const cells: number[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) cells.push((br * 3 + r) * 9 + bc * 3 + c);
  return cells;
}

export function conflicts(b: Board, i: number): number[] {
  if (b[i] === 0) return [];
  const v = b[i];
  const r = Math.floor(i / 9), c = i % 9;
  const br = Math.floor(r / 3), bc = Math.floor(c / 3);
  const peers = new Set<number>([...rowIdx(r), ...colIdx(c), ...boxIdx(br, bc)]);
  peers.delete(i);
  const bad: number[] = [];
  for (const p of peers) if (b[p] === v) bad.push(p);
  return bad;
}

export function isValidPlacement(b: Board, i: number, v: number): boolean {
  const r = Math.floor(i / 9), c = i % 9;
  const br = Math.floor(r / 3), bc = Math.floor(c / 3);
  for (const p of [...rowIdx(r), ...colIdx(c), ...boxIdx(br, bc)]) if (p !== i && b[p] === v) return false;
  return true;
}

export function isComplete(b: Board): boolean {
  if (b.some((v) => v === 0)) return false;
  for (let i = 0; i < 81; i++) if (!isValidPlacement(b, i, b[i])) return false;
  return true;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function solve(b: Board, limit = 2): number {
  let count = 0;
  const go = () => {
    if (count >= limit) return;
    let idx = -1;
    for (let i = 0; i < 81; i++) if (b[i] === 0) { idx = i; break; }
    if (idx === -1) { count++; return; }
    for (let v = 1; v <= 9; v++) {
      if (isValidPlacement(b, idx, v)) {
        b[idx] = v;
        go();
        b[idx] = 0;
        if (count >= limit) return;
      }
    }
  };
  go();
  return count;
}

function fillFull(b: Board): boolean {
  let idx = -1;
  for (let i = 0; i < 81; i++) if (b[i] === 0) { idx = i; break; }
  if (idx === -1) return true;
  for (const v of shuffle([1,2,3,4,5,6,7,8,9])) {
    if (isValidPlacement(b, idx, v)) {
      b[idx] = v;
      if (fillFull(b)) return true;
      b[idx] = 0;
    }
  }
  return false;
}

export function generate(difficulty: Difficulty): { puzzle: Board; solution: Board } {
  const solution: Board = new Array(81).fill(0);
  fillFull(solution);
  const puzzle: Board = [...solution];
  const targetClues = DIFFICULTY_CLUES[difficulty];
  const order = shuffle(Array.from({ length: 81 }, (_, i) => i));
  let clues = 81;
  for (const i of order) {
    if (clues <= targetClues) break;
    const backup = puzzle[i];
    puzzle[i] = 0;
    const copy = [...puzzle];
    if (solve(copy, 2) === 1) {
      clues--;
    } else {
      puzzle[i] = backup;
    }
  }
  return { puzzle, solution };
}

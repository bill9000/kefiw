// Seeded visual-MCQ round generators for Kefiw Spatial pipeline.
//
// Each round returns a prompt + 4 choices, all SVG strings. Component renders
// them inline and the user taps the correct one. Scoring mirrors the Math
// pipeline: accuracy × speed multiplier, 10 rounds per game, max 1500.
//
// SVG strings are returned as raw markup (sanitized — no user input flows in).

import { rngFor, pickInt, shuffleInPlace } from './daily-rng';

export interface SpatialRound {
  promptSvg: string;
  choicesSvg: string[];
  correctIndex: number;
}

export const SPATIAL_ROUNDS_PER_GAME = 10;
export const SPATIAL_ROUND_TIME_SEC = 15;

// Shared SVG helpers --------------------------------------------------------

const CELL = 24;
const GRID = (n: number): number => n * CELL;

function rect(x: number, y: number, w: number, h: number, fill: string, stroke = '#cbd5e1'): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1" />`;
}

function text(x: number, y: number, s: string, opts: { size?: number; fill?: string; anchor?: string } = {}): string {
  const size = opts.size ?? 12;
  const fill = opts.fill ?? '#0f172a';
  const anchor = opts.anchor ?? 'middle';
  return `<text x="${x}" y="${y}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="${size}" fill="${fill}" text-anchor="${anchor}" dominant-baseline="central">${s}</text>`;
}

function svg(viewBox: string, inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">${inner}</svg>`;
}

// 1. Circuit Path -----------------------------------------------------------
// Show a 5×5 grid with a partial path drawn. One cell is missing to complete
// the path; user picks which of 4 candidate cells it is.

function circuitRound(rng: () => number): SpatialRound {
  const N = 5;
  // Path is a sequence of adjacent cells. Start at (0, midRow) end at (N-1, midRow).
  const path: Array<[number, number]> = [];
  let r = pickInt(rng, 1, N - 1);
  let c = 0;
  path.push([r, c]);
  while (c < N - 1) {
    const moves: Array<[number, number]> = [];
    if (c < N - 1) moves.push([0, 1]);
    if (r > 0 && rng() < 0.3) moves.push([-1, 0]);
    if (r < N - 1 && rng() < 0.3) moves.push([1, 0]);
    const [dr, dc] = moves[pickInt(rng, 0, moves.length)];
    r += dr; c += dc;
    path.push([r, c]);
  }
  // Remove one interior cell and ask user to identify it.
  const missingIdx = pickInt(rng, 1, path.length - 1);
  const missing = path[missingIdx];
  const shown = path.filter((_, i) => i !== missingIdx);
  // Candidates: missing cell + 3 nearby distractors not on the path
  const distractors: Array<[number, number]> = [];
  const pathSet = new Set(path.map(([rr, cc]) => `${rr},${cc}`));
  while (distractors.length < 3) {
    const dr = pickInt(rng, 0, N);
    const dc = pickInt(rng, 0, N);
    const k = `${dr},${dc}`;
    if (!pathSet.has(k) && !distractors.some(([a, b]) => a === dr && b === dc)) distractors.push([dr, dc]);
  }
  const choices = [missing, ...distractors];
  shuffleInPlace(choices, rng);
  const correctIndex = choices.findIndex(([rr, cc]) => rr === missing[0] && cc === missing[1]);

  const cells = (filled: Array<[number, number]>, label?: string): string => {
    const inner: string[] = [];
    for (let r2 = 0; r2 < N; r2++) {
      for (let c2 = 0; c2 < N; c2++) {
        const isFilled = filled.some(([fr, fc]) => fr === r2 && fc === c2);
        inner.push(rect(c2 * CELL, r2 * CELL, CELL, CELL, isFilled ? '#2666e1' : '#f8fafc'));
      }
    }
    if (label) inner.push(text(GRID(N) / 2, GRID(N) + 14, label, { size: 10, fill: '#64748b' }));
    return svg(`0 0 ${GRID(N)} ${label ? GRID(N) + 20 : GRID(N)}`, inner.join(''));
  };

  const promptSvg = cells(shown);
  const choicesSvg = choices.map(([cr, cc]) => cells([[cr, cc]]));
  return { promptSvg, choicesSvg, correctIndex };
}

// 2. Drop Stack -------------------------------------------------------------
// Four columns with random fill heights. User picks the shortest.

function dropRound(rng: () => number): SpatialRound {
  const COLS = 4;
  const MAX = 8;
  const heights: number[] = [];
  for (let i = 0; i < COLS; i++) heights.push(pickInt(rng, 1, MAX + 1));
  const minH = Math.min(...heights);
  // If tied, shift one up so there's a unique minimum.
  if (heights.filter((h) => h === minH).length > 1) {
    const ties = heights.map((h, i) => (h === minH ? i : -1)).filter((i) => i >= 0);
    const keep = ties[pickInt(rng, 0, ties.length)];
    for (const i of ties) if (i !== keep && heights[i] < MAX) heights[i] += 1;
  }
  const minIdx = heights.indexOf(Math.min(...heights));

  const renderStacks = (hs: number[]): string => {
    const w = COLS * (CELL + 4);
    const h = MAX * CELL + 4;
    const inner: string[] = [];
    for (let i = 0; i < COLS; i++) {
      const x = i * (CELL + 4);
      // Base line
      inner.push(rect(x, h - 1, CELL, 1, '#64748b', '#64748b'));
      for (let j = 0; j < hs[i]; j++) {
        inner.push(rect(x, h - (j + 1) * CELL - 1, CELL, CELL - 2, '#2666e1'));
      }
    }
    return svg(`0 0 ${w} ${h}`, inner.join(''));
  };

  const promptSvg = renderStacks(heights);
  // Choices: highlight each column, user picks which is shortest.
  const choicesSvg = Array.from({ length: COLS }, (_, target) => {
    const highlighted = heights.map((h, i) => (i === target ? h : h));
    const w = COLS * (CELL + 4);
    const h = MAX * CELL + 4;
    const inner: string[] = [];
    for (let i = 0; i < COLS; i++) {
      const x = i * (CELL + 4);
      inner.push(rect(x, h - 1, CELL, 1, '#64748b', '#64748b'));
      for (let j = 0; j < highlighted[i]; j++) {
        const fill = i === target ? '#dc2626' : '#cbd5e1';
        inner.push(rect(x, h - (j + 1) * CELL - 1, CELL, CELL - 2, fill));
      }
      inner.push(text(x + CELL / 2, h + 10, `${i + 1}`, { size: 9, fill: '#64748b' }));
    }
    return svg(`0 0 ${w} ${h + 14}`, inner.join(''));
  });

  return { promptSvg, choicesSvg, correctIndex: minIdx };
}

// 3. Tile Pair — mental rotation -------------------------------------------
// A shape at rotation 0°; choose which of 4 is the same shape rotated.

function pairRound(rng: () => number): SpatialRound {
  // Make an asymmetric L-like shape on a 3×3 grid. Pick cells that aren't
  // rotationally symmetric to self.
  const shapes = [
    [[0, 0], [0, 1], [1, 0], [2, 0]],           // L
    [[0, 0], [0, 1], [0, 2], [1, 2]],           // mirror L
    [[0, 0], [1, 0], [1, 1], [2, 1]],           // Z
    [[0, 1], [1, 0], [1, 1], [1, 2]],           // T
    [[0, 0], [0, 2], [1, 1], [2, 0]],           // X-ish
    [[0, 0], [0, 1], [1, 1], [2, 1], [2, 2]],   // snake
  ];
  const base = shapes[pickInt(rng, 0, shapes.length)];

  // Rotate a shape 90° N times around (1,1) center.
  function rotate(cells: number[][], times: number): number[][] {
    let out = cells.map(([r, c]) => [r, c]);
    for (let i = 0; i < times; i++) {
      out = out.map(([r, c]) => [c, 2 - r]);
    }
    return out;
  }
  function keyOf(cells: number[][]): string {
    return cells.map((p) => p.join(',')).sort().join('|');
  }

  const targetRot = pickInt(rng, 1, 4); // 90, 180, or 270
  const correct = rotate(base, targetRot);
  const correctKey = keyOf(correct);
  const baseKey = keyOf(base);

  // Distractors: other rotations of DIFFERENT shapes, filter out any that
  // accidentally match the correct key or the base key.
  const distractors: number[][][] = [];
  while (distractors.length < 3) {
    const s = shapes[pickInt(rng, 0, shapes.length)];
    const r = pickInt(rng, 0, 4);
    const candidate = rotate(s, r);
    const ck = keyOf(candidate);
    if (ck === correctKey || ck === baseKey) continue;
    if (distractors.some((d) => keyOf(d) === ck)) continue;
    distractors.push(candidate);
  }

  const choices = [correct, ...distractors];
  shuffleInPlace(choices, rng);
  const correctIndex = choices.findIndex((c) => keyOf(c) === correctKey);

  const renderShape = (cells: number[][]): string => {
    const inner: string[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const has = cells.some(([cr, cc]) => cr === r && cc === c);
        inner.push(rect(c * CELL, r * CELL, CELL, CELL, has ? '#2666e1' : '#f8fafc'));
      }
    }
    return svg(`0 0 ${3 * CELL} ${3 * CELL}`, inner.join(''));
  };

  return { promptSvg: renderShape(base), choicesSvg: choices.map(renderShape), correctIndex };
}

// 4. Hex Fit ----------------------------------------------------------------
// Target silhouette with one hex cell missing; choose the hex piece that fits.
// Simplified: rect grid pretending to be "hex positions" with numeric sizes.
// Show a 6-cell row with one gap having a specific "width"; pick the matching
// candidate.

function hexRound(rng: () => number): SpatialRound {
  // The gap has a specific size 1..4; distractors have different sizes.
  const target = pickInt(rng, 1, 5);
  const choicesSizes = [target];
  while (choicesSizes.length < 4) {
    const s = pickInt(rng, 1, 5);
    if (!choicesSizes.includes(s)) choicesSizes.push(s);
  }
  shuffleInPlace(choicesSizes, rng);
  const correctIndex = choicesSizes.indexOf(target);

  const renderRow = (beforeWidth: number, gap: number, afterWidth: number): string => {
    const total = beforeWidth + gap + afterWidth;
    const w = total * CELL + 4;
    const h = CELL + 4;
    const inner: string[] = [];
    let x = 0;
    for (let i = 0; i < beforeWidth; i++) {
      inner.push(rect(x, 0, CELL - 1, CELL, '#94a3b8'));
      x += CELL;
    }
    // Gap rendered as striped / muted
    for (let i = 0; i < gap; i++) {
      inner.push(rect(x, 0, CELL - 1, CELL, '#fef3c7', '#f59e0b'));
      x += CELL;
    }
    for (let i = 0; i < afterWidth; i++) {
      inner.push(rect(x, 0, CELL - 1, CELL, '#94a3b8'));
      x += CELL;
    }
    return svg(`0 0 ${w} ${h}`, inner.join(''));
  };

  const renderTile = (size: number): string => {
    const w = size * CELL + 4;
    const h = CELL + 4;
    const inner: string[] = [];
    for (let i = 0; i < size; i++) inner.push(rect(i * CELL, 0, CELL - 1, CELL, '#2666e1'));
    return svg(`0 0 ${w} ${h}`, inner.join(''));
  };

  const before = pickInt(rng, 1, 3);
  const after = pickInt(rng, 1, 3);
  return {
    promptSvg: renderRow(before, target, after),
    choicesSvg: choicesSizes.map(renderTile),
    correctIndex,
  };
}

// 5. Path Length ------------------------------------------------------------
// Four candidate paths drawn as polylines; user picks the shortest.

function pathRound(rng: () => number): SpatialRound {
  const N = 5;
  const makePath = (minLen: number, maxLen: number): Array<[number, number]> => {
    const len = pickInt(rng, minLen, maxLen + 1);
    const path: Array<[number, number]> = [[0, 0]];
    let r = 0, c = 0;
    for (let i = 0; i < len; i++) {
      const moves: Array<[number, number]> = [];
      if (r < N - 1) moves.push([1, 0]);
      if (c < N - 1) moves.push([0, 1]);
      if (r > 0 && rng() < 0.3) moves.push([-1, 0]);
      if (c > 0 && rng() < 0.3) moves.push([0, -1]);
      const [dr, dc] = moves[pickInt(rng, 0, moves.length)];
      r += dr; c += dc;
      path.push([r, c]);
    }
    return path;
  };

  // Generate 4 paths; pick the shortest (by distinct-cell count) as correct.
  const paths: Array<Array<[number, number]>> = [
    makePath(5, 8),
    makePath(7, 10),
    makePath(9, 12),
    makePath(11, 15),
  ];
  shuffleInPlace(paths, rng);
  const lengths = paths.map((p) => p.length);
  const minIdx = lengths.indexOf(Math.min(...lengths));

  const renderPath = (path: Array<[number, number]>, highlight: boolean): string => {
    const side = N * CELL;
    const inner: string[] = [];
    for (let r = 0; r < N; r++)
      for (let c = 0; c < N; c++)
        inner.push(rect(c * CELL, r * CELL, CELL, CELL, '#f8fafc'));
    const pts = path.map(([r, c]) => `${c * CELL + CELL / 2},${r * CELL + CELL / 2}`).join(' ');
    inner.push(`<polyline points="${pts}" fill="none" stroke="${highlight ? '#2666e1' : '#64748b'}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round" />`);
    // Start/end markers
    const [sr, sc] = path[0];
    const [er, ec] = path[path.length - 1];
    inner.push(`<circle cx="${sc * CELL + CELL / 2}" cy="${sr * CELL + CELL / 2}" r="5" fill="#10b981" />`);
    inner.push(`<circle cx="${ec * CELL + CELL / 2}" cy="${er * CELL + CELL / 2}" r="5" fill="#dc2626" />`);
    return svg(`0 0 ${side} ${side}`, inner.join(''));
  };

  // Prompt: show all four paths thumbnail-side-by-side (but small); choices highlight one each.
  const prompt = svg(`0 0 ${N * CELL} ${N * CELL}`, `<rect x="0" y="0" width="${N * CELL}" height="${N * CELL}" fill="#f8fafc" stroke="#cbd5e1" />${text(N * CELL / 2, N * CELL / 2, 'Which is shortest?', { size: 11, fill: '#475569' })}`);
  const choicesSvg = paths.map((p, i) => renderPath(p, i === minIdx));
  // For the user, choices shouldn't pre-highlight. Redraw without highlight.
  const neutralChoices = paths.map((p) => renderPath(p, false));
  void choicesSvg;
  return { promptSvg: prompt, choicesSvg: neutralChoices, correctIndex: minIdx };
}

// Dispatcher ----------------------------------------------------------------

const GENERATORS: Record<string, (rng: () => number) => SpatialRound> = {
  'spatial-circuit': circuitRound,
  'spatial-drop': dropRound,
  'spatial-pair': pairRound,
  'spatial-hex': hexRound,
  'spatial-path': pathRound,
};

export function generateSpatialRounds(dailyDate: string, gameId: string): SpatialRound[] {
  const gen = GENERATORS[gameId];
  if (!gen) return [];
  const rng = rngFor(dailyDate, gameId);
  const rounds: SpatialRound[] = [];
  for (let i = 0; i < SPATIAL_ROUNDS_PER_GAME; i++) rounds.push(gen(rng));
  return rounds;
}

// Scoring — same shape as Math pipeline: accuracy × speed multiplier.
// MCQ tap: correct = 100, wrong = 0 (no partial credit — there's one right answer).
// Speed multiplier: 1.0 + (timeRemaining / capSec) × 0.5, instant = ×1.5.
// Max per round: 150. Max session: 1500.

export function scoreSpatial(correct: boolean, timeUsedSec: number, capSec = SPATIAL_ROUND_TIME_SEC): number {
  if (!correct) return 0;
  if (timeUsedSec >= capSec) return 0;
  const remaining = Math.max(0, capSec - timeUsedSec);
  const mult = 1.0 + (remaining / capSec) * 0.5;
  return Math.round(100 * mult);
}

export const SPATIAL_CLEAR_THRESHOLD = 450; // 30% of max 1500

export function isSpatialCleared(totalScore: number, roundsCompleted: number): boolean {
  return roundsCompleted >= SPATIAL_ROUNDS_PER_GAME && totalScore >= SPATIAL_CLEAR_THRESHOLD;
}

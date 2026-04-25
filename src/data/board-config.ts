// 15×15 premium-square layouts for Scrabble and Words With Friends.
// Cell encoding:
//   _  = no premium
//   d  = double letter score (DL)
//   t  = triple letter score (TL)
//   2  = double word score (DW)
//   3  = triple word score (TW)
//   *  = center star — first play covers it; behaves as DW
//
// Layouts are hand-keyed from publicly documented board positions. WWF varies
// slightly across app versions; the layout here matches the long-standing
// classic 15×15 WWF board.

export type CellMod = '_' | 'd' | 't' | '2' | '3' | '*';

export const SCRABBLE_LAYOUT: string[] = [
  '3__d___3___d__3',
  '_2___t___t___2_',
  '__2___d_d___2__',
  'd__2___d___2__d',
  '____2_____2____',
  '_t___t___t___t_',
  '__d___d_d___d__',
  '3__d___*___d__3',
  '__d___d_d___d__',
  '_t___t___t___t_',
  '____2_____2____',
  'd__2___d___2__d',
  '__2___d_d___2__',
  '_2___t___t___2_',
  '3__d___3___d__3',
];

// WWF 15×15 — TW positions are at (3,0)/(0,3)/(0,11)/(3,14)/(11,0)/(14,3)/
// (14,11)/(11,14). DL/TL/DW are scattered in classic WWF style.
export const WWF_LAYOUT: string[] = [
  '___3_____3_____'.padEnd(15, '_').slice(0, 15),
  '__d___t_t___d__',
  '_d__d_____d__d_',
  '3__t___d___t__3',
  '_d__2_____2__d_',
  '__t___t_t___t__',
  '___d___2___d___',
  '____d_2_2_d____',
  '___d___2___d___',
  '__t___t_t___t__',
  '_d__2_____2__d_',
  '3__t___d___t__3',
  '_d__d_____d__d_',
  '__d___t_t___d__',
  '___3_____3_____'.padEnd(15, '_').slice(0, 15),
];

// Tile values for both systems (lowercase keys).
export const SCRABBLE_TILE_VALUES: Record<string, number> = {
  a: 1, e: 1, i: 1, o: 1, u: 1, l: 1, n: 1, s: 1, t: 1, r: 1,
  d: 2, g: 2,
  b: 3, c: 3, m: 3, p: 3,
  f: 4, h: 4, v: 4, w: 4, y: 4,
  k: 5,
  j: 8, x: 8,
  q: 10, z: 10,
};

export const WWF_TILE_VALUES: Record<string, number> = {
  a: 1, e: 1, i: 1, o: 1, t: 1, r: 1,
  d: 2, l: 2, n: 2, s: 2, u: 2,
  g: 3, h: 3, y: 3,
  b: 4, c: 4, f: 4, m: 4, p: 4, w: 4,
  k: 5, v: 5,
  x: 8,
  j: 10, q: 10, z: 10,
};

export const SCRABBLE_BINGO_BONUS = 50;
export const WWF_BINGO_BONUS = 35;

export interface BoardConfig {
  layout: string[];
  values: Record<string, number>;
  bingoBonus: number;
  rackSize: number;
  label: string;
}

export const SCRABBLE_CONFIG: BoardConfig = {
  layout: SCRABBLE_LAYOUT,
  values: SCRABBLE_TILE_VALUES,
  bingoBonus: SCRABBLE_BINGO_BONUS,
  rackSize: 7,
  label: 'Scrabble',
};

export const WWF_CONFIG: BoardConfig = {
  layout: WWF_LAYOUT,
  values: WWF_TILE_VALUES,
  bingoBonus: WWF_BINGO_BONUS,
  rackSize: 7,
  label: 'WWF',
};

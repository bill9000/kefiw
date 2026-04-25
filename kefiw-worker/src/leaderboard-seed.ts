// Seeded leaderboard population. Daily boards are generated deterministically
// per-hour-ET so all viewers see the same set, no DB writes needed. The
// handle pool is 1200 (40 prefixes × 30 suffixes); each hour adds 1–7 new
// entries with skill drawn uniformly from [0, 1] mapped to per-game score
// bands. Real cleared rows from D1 merge in honestly via score-sort.
//
// Tactic note: this is a launch-phase populator. Real users always sort
// where their actual score belongs — seeds never bump real entries.

// FNV-1a 32-bit (matches src/lib/daily-rng.ts so seed parity is preserved).
function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function rngFor(parts: (string | number)[]): () => number {
  return mulberry32(hashSeed(parts.join("::")));
}

// ---------------------------------------------------------------------------
// Handle pool: 40 × 30 = 1200 unique combinations
// ---------------------------------------------------------------------------

const PREFIXES: string[] = [
  "ana", "ben", "cara", "dan", "eli", "finn", "gus", "hana",
  "ivy", "jay", "kai", "lou", "max", "nia", "ola", "pia",
  "ray", "sage", "tess", "uma", "vic", "wren", "yves", "zoe",
  "pixel", "glitch", "echo", "drift", "rune", "mossy", "agate", "neon",
  "ember", "wisp", "signal", "comet", "atlas", "photo", "ozzy", "halo",
];

const SUFFIXES: string[] = [
  ".k", ".b", ".m", ".q", ".x", ".z", ".j", ".v",
  "_42", "_7", "_99", "_13", "_21", "_88", "_101", "_zero",
  "_rx", "_ng", "_io", "_hi", "99", "42", "7", "11",
  "21", "88", "0", "13", "x", "q",
];

const HANDLE_POOL: string[] = (() => {
  const out: string[] = [];
  for (const p of PREFIXES) for (const s of SUFFIXES) out.push(p + s);
  return out;
})();

function pickUniqueHandle(rng: () => number, used: Set<string>): string {
  // Try up to 30 picks; fall back to indexed name if all used (won't happen
  // at our scale but defensive against the pool exhausting).
  for (let attempt = 0; attempt < 30; attempt++) {
    const idx = Math.floor(rng() * HANDLE_POOL.length);
    const h = HANDLE_POOL[idx];
    if (!used.has(h)) {
      used.add(h);
      return h;
    }
  }
  return `anon_${Math.floor(rng() * 9999)}`;
}

// ---------------------------------------------------------------------------
// Per-game score bands. skill in [0, 1] uniform; mapping is monotonic in
// "competence" but the metric stored differs per game (Hunt = guesses lower
// is better, Sudoku = time_sec lower is better, others = points higher).
// ---------------------------------------------------------------------------

export interface SeededRow {
  handle: string;
  cleared: 1;
  guesses: number | null;
  points: number | null;
  tier: string | null;
  time_sec: number | null;
  submitted_at: number;
}

const HIVE_TIER_THRESHOLDS: Array<{ threshold: number; tier: string }> = [
  { threshold: 240, tier: "queen" },
  { threshold: 180, tier: "amazing" },
  { threshold: 120, tier: "great" },
  { threshold: 80, tier: "nice" },
  { threshold: 40, tier: "good" },
];

function tierForHivePoints(points: number): string | null {
  for (const t of HIVE_TIER_THRESHOLDS) if (points >= t.threshold) return t.tier;
  return null;
}

function rowForGameAndSkill(
  gameId: string,
  skill: number,
  rng: () => number,
  handle: string,
  submittedAt: number,
): SeededRow {
  const base: SeededRow = {
    handle, cleared: 1, guesses: null, points: null, tier: null, time_sec: null, submitted_at: submittedAt,
  };
  if (gameId === "hunt") {
    // skill 0 → 6 (failed: but we mark cleared=1 only if guesses<=6)
    // skill 1 → 2
    // Add small jitter so adjacent skills don't tie often.
    const guesses = Math.min(6, Math.max(2, Math.round(6 - skill * 4 + (rng() - 0.5) * 0.6)));
    return { ...base, guesses };
  }
  if (gameId === "hive") {
    // skill 0 → 30 pts, skill 1 → 280 pts
    const points = Math.max(30, Math.round(30 + skill * 250 + (rng() - 0.5) * 30));
    return { ...base, points, tier: tierForHivePoints(points) };
  }
  if (gameId === "sudoku") {
    // skill 0 → 1500 sec, skill 1 → 180 sec
    const time_sec = Math.max(120, Math.round(1500 - skill * 1320 + (rng() - 0.5) * 60));
    return { ...base, time_sec };
  }
  // Math / Verbal / Spatial pipelines: skill 0 → 200, skill 1 → 1450 (max 1500)
  const points = Math.min(1500, Math.max(0, Math.round(200 + skill * 1250 + (rng() - 0.5) * 80)));
  return { ...base, points };
}

// ---------------------------------------------------------------------------
// Build the seeded leaderboard for a single per-game board.
// Walks hours 0..hourET, each hour adding 1–7 entries with random skill.
// hourET is clamped to [0, 23]; if a date is in the past or somehow ahead,
// caller should still pass 23 to materialize the full day.
// ---------------------------------------------------------------------------

export function buildSeededRowsForGame(
  date: string,
  gameId: string,
  hourET: number,
  startEpochMs: number,
): SeededRow[] {
  const used = new Set<string>();
  const rows: SeededRow[] = [];
  const lastHour = Math.max(0, Math.min(23, Math.floor(hourET)));
  for (let h = 0; h <= lastHour; h++) {
    const rng = rngFor([date, gameId, h]);
    const n = 1 + Math.floor(rng() * 7); // 1..7
    for (let i = 0; i < n; i++) {
      const handle = pickUniqueHandle(rng, used);
      const skill = rng();
      // submitted_at: spread across the hour so ties resolve in believable order.
      const submittedAt = startEpochMs + h * 3_600_000 + Math.floor(rng() * 3_600_000);
      rows.push(rowForGameAndSkill(gameId, skill, rng, handle, submittedAt));
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Pipeline-level seed: each "ghost device" has a coherent skill profile and
// produces one row per pipeline game; aggregate sums those into a pipeline
// total. Skill drifts slightly per game so ghosts aren't perfectly consistent
// (some are better at math than verbal, etc.).
// ---------------------------------------------------------------------------

export interface SeededPipelineRow {
  handle: string;
  total_points: number;
  total_time_sec: number;
  games_cleared: number;
  submitted_at: number;
}

export function buildSeededPipelineRows(
  date: string,
  pipelineId: string,
  pipelineGames: string[],
  hourET: number,
  startEpochMs: number,
): SeededPipelineRow[] {
  const used = new Set<string>();
  const rows: SeededPipelineRow[] = [];
  const lastHour = Math.max(0, Math.min(23, Math.floor(hourET)));
  for (let h = 0; h <= lastHour; h++) {
    const rng = rngFor([date, pipelineId, "p", h]);
    const n = 1 + Math.floor(rng() * 7);
    for (let i = 0; i < n; i++) {
      const handle = pickUniqueHandle(rng, used);
      const baseSkill = rng();
      let totalPoints = 0;
      let totalTime = 0;
      for (const gid of pipelineGames) {
        // Per-game skill drifts ±0.15 around the ghost's base skill.
        const drift = (rng() - 0.5) * 0.3;
        const skill = Math.max(0, Math.min(1, baseSkill + drift));
        const r = rowForGameAndSkill(gid, skill, rng, handle, startEpochMs);
        totalPoints += r.points ?? 0;
        totalTime += r.time_sec ?? 0;
      }
      const submittedAt = startEpochMs + h * 3_600_000 + Math.floor(rng() * 3_600_000);
      rows.push({
        handle,
        total_points: totalPoints,
        total_time_sec: totalTime,
        games_cleared: pipelineGames.length,
        submitted_at: submittedAt,
      });
    }
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Helper: hour of the daily date in ET. The daily date rolls over at 4am ET
// so hour 0 of "2026-04-24" begins at 2026-04-24T04:00 ET.
// ---------------------------------------------------------------------------

export function hoursElapsedInET(dateStr: string, now: Date): number {
  // Format current ET as YYYY-MM-DD HH using Intl.DateTimeFormat.
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string): number => Number(parts.find((p) => p.type === type)?.value ?? 0);
  let y = get("year"), m = get("month"), d = get("day");
  let hourEt = get("hour"); if (hourEt === 24) hourEt = 0;
  const minuteEt = get("minute");
  // Roll backward if before 4am ET — the daily key is yesterday.
  if (hourEt < 4) {
    const dprev = new Date(Date.UTC(y, m - 1, d - 1));
    y = dprev.getUTCFullYear(); m = dprev.getUTCMonth() + 1; d = dprev.getUTCDate();
    hourEt += 24;
  }
  // If the date param doesn't match the current daily, return 23 (full day).
  const todayKey = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  if (dateStr !== todayKey) return 23;
  return Math.max(0, Math.min(23, hourEt - 4 + minuteEt / 60));
}

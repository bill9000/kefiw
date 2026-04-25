// kefiw-worker — unified endpoint for:
//   POST /telemetry     — ad impression / viewable / fill / unfill / modal events
//   POST /consent       — Klaro opt-in / opt-out events
//   GET  /gpp           — returns GPP string for current region
//   GET  /health        — liveness
//
// NEVER logs user-typed values, dataLabels, or computed results.
// See project_kefiw_monetization.md (Neutral Cut spec).

export interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  DAILY_HMAC_SECRET?: string;
}

// Server-side mirror of src/data/daily-pipelines.ts. Kept in sync by hand —
// the pipeline leaderboard endpoint trusts this list, not the client's claim.
// When you add or reshuffle a pipeline, update both files.
const PIPELINE_GAMES: Record<string, string[]> = {
  core: ["hunt", "hive", "sudoku"],
  math: ["math-percent", "math-discount", "math-convert", "math-tip", "math-timedelta"],
  verbal: ["verbal-crypt", "verbal-link", "verbal-shift", "verbal-crosser", "verbal-twist"],
  spatial: ["spatial-circuit", "spatial-drop", "spatial-pair", "spatial-hex", "spatial-path"],
};

async function hmacSha256Hex(secret: string, msg: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(msg));
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function computeIntegrity(secret: string, body: DailyScoreSubmit): Promise<string> {
  const canonical = [
    body.daily_date,
    body.game_id,
    body.device_hash,
    `cleared=${body.cleared ? 1 : 0}`,
    `guesses=${body.guesses ?? ""}`,
    `points=${body.points ?? ""}`,
    `tier=${body.tier ?? ""}`,
    `time_sec=${body.time_sec ?? ""}`,
  ].join("|");
  return hmacSha256Hex(secret, canonical);
}

function corsHeaders(origin: string | null, allowed: string): HeadersInit {
  const allowedList = allowed.split(",").map((s) => s.trim());
  const allow = origin && allowedList.includes(origin) ? origin : allowedList[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const origin = req.headers.get("Origin");
    const cors = corsHeaders(origin, env.ALLOWED_ORIGINS);

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/health") {
      return json({ ok: true, ts: Date.now() }, { headers: cors });
    }

    if (url.pathname === "/telemetry" && req.method === "POST") {
      const body = await req.json<TelemetryBatch>().catch(() => null);
      if (!body || !Array.isArray(body.events)) {
        return json({ error: "invalid_body" }, { status: 400, headers: cors });
      }
      const country = req.headers.get("CF-IPCountry") ?? "XX";
      const stmts = body.events.map((e) =>
        env.DB.prepare(
          "INSERT INTO events (session_id, tool_id, cluster_id, risk_tier, zone_id, event_type, ts, viewport_w, country) VALUES (?,?,?,?,?,?,?,?,?)"
        ).bind(
          scrubStr(body.session_id),
          scrubStr(e.tool_id),
          scrubStr(e.cluster_id),
          scrubStr(e.risk_tier),
          scrubStr(e.zone_id ?? null),
          scrubStr(e.event_type),
          e.ts ?? Date.now(),
          e.viewport_w ?? null,
          country
        )
      );
      await env.DB.batch(stmts);
      return json({ ok: true, inserted: stmts.length }, { headers: cors });
    }

    if (url.pathname === "/consent" && req.method === "POST") {
      const body = await req.json<ConsentEvent>().catch(() => null);
      if (!body) return json({ error: "invalid_body" }, { status: 400, headers: cors });
      const country = req.headers.get("CF-IPCountry") ?? "XX";
      await env.DB
        .prepare(
          "INSERT INTO consent (session_id, action, tcf_string, gpp_string, ts, country) VALUES (?,?,?,?,?,?)"
        )
        .bind(
          scrubStr(body.session_id),
          scrubStr(body.action),
          scrubStr(body.tcf_string ?? null),
          scrubStr(body.gpp_string ?? null),
          body.ts ?? Date.now(),
          country
        )
        .run();
      return json({ ok: true }, { headers: cors });
    }

    if (url.pathname === "/gpp" && req.method === "GET") {
      const country = req.headers.get("CF-IPCountry") ?? "XX";
      const region = geoRegion(country);
      return json({ region, gpp_sid: gppSid(region) }, { headers: cors });
    }

    if (url.pathname === "/daily/score" && req.method === "POST") {
      const body = await req.json<DailyScoreSubmit>().catch(() => null);
      if (!body || !isValidDailyScore(body)) {
        return json({ error: "invalid_body" }, { status: 400, headers: cors });
      }
      const country = req.headers.get("CF-IPCountry") ?? "XX";
      const integrity = env.DAILY_HMAC_SECRET
        ? await computeIntegrity(env.DAILY_HMAC_SECRET, body)
        : null;
      await env.DB
        .prepare(
          `INSERT INTO daily_scores
            (daily_date, game_id, device_hash, handle, cleared,
             guesses, points, tier, time_sec, integrity, submitted_at, country)
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
           ON CONFLICT(daily_date, game_id, device_hash) DO UPDATE SET
             handle=excluded.handle, cleared=excluded.cleared,
             guesses=excluded.guesses, points=excluded.points, tier=excluded.tier,
             time_sec=excluded.time_sec, integrity=excluded.integrity,
             submitted_at=excluded.submitted_at`
        )
        .bind(
          body.daily_date,
          body.game_id,
          body.device_hash,
          body.handle ?? null,
          body.cleared ? 1 : 0,
          body.guesses ?? null,
          body.points ?? null,
          body.tier ?? null,
          body.time_sec ?? null,
          integrity,
          Date.now(),
          country
        )
        .run();
      return json({ ok: true }, { headers: cors });
    }

    if (url.pathname === "/daily/run" && req.method === "POST") {
      const body = await req.json<DailyRunSubmit>().catch(() => null);
      if (!body || !body.daily_date || !body.pipeline_id || !body.device_hash) {
        return json({ error: "invalid_body" }, { status: 400, headers: cors });
      }
      const country = req.headers.get("CF-IPCountry") ?? "XX";
      await env.DB
        .prepare(
          `INSERT INTO daily_runs
            (daily_date, pipeline_id, device_hash, handle, cleared, streak_days, submitted_at, country)
           VALUES (?,?,?,?,?,?,?,?)
           ON CONFLICT(daily_date, pipeline_id, device_hash) DO UPDATE SET
             handle=excluded.handle, cleared=excluded.cleared,
             streak_days=excluded.streak_days, submitted_at=excluded.submitted_at`
        )
        .bind(
          body.daily_date,
          body.pipeline_id,
          body.device_hash,
          body.handle ?? null,
          body.cleared ? 1 : 0,
          body.streak_days ?? null,
          Date.now(),
          country
        )
        .run();
      return json({ ok: true }, { headers: cors });
    }

    if (url.pathname === "/daily/leaderboard" && req.method === "GET") {
      const dailyDate = url.searchParams.get("date") ?? "";
      const gameId = url.searchParams.get("game") ?? "";
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 50)));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dailyDate) || !/^[a-z0-9_-]{1,32}$/.test(gameId)) {
        return json({ error: "invalid_query" }, { status: 400, headers: cors });
      }
      const order = gameId === "hunt" || gameId === "sudoku" ? "ASC" : "DESC";
      const sortKey =
        gameId === "hunt" ? "guesses" :
        gameId === "hive" ? "points" :
        gameId === "sudoku" ? "time_sec" :
        gameId.startsWith("math-") ? "points" :
        gameId.startsWith("verbal-") ? "points" :
        gameId.startsWith("spatial-") ? "points" :
        "points";
      const { results } = await env.DB
        .prepare(
          `SELECT handle, cleared, guesses, points, tier, time_sec, submitted_at
           FROM daily_scores
           WHERE daily_date = ? AND game_id = ? AND cleared = 1
           ORDER BY ${sortKey} ${order}, submitted_at ASC
           LIMIT ?`
        )
        .bind(dailyDate, gameId, limit)
        .all();
      return json({ daily_date: dailyDate, game_id: gameId, results }, { headers: cors });
    }

    // Pipeline-level leaderboard: aggregates per-game scores across the pipeline's
    // games for a given day. Returns only devices that cleared every game in the
    // pipeline. Pipeline game set is server-side so clients can't forge.
    if (url.pathname === "/daily/leaderboard/pipeline" && req.method === "GET") {
      const dailyDate = url.searchParams.get("date") ?? "";
      const pipelineId = url.searchParams.get("pipeline") ?? "";
      const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 50)));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dailyDate) || !/^[a-z0-9_-]{1,32}$/.test(pipelineId)) {
        return json({ error: "invalid_query" }, { status: 400, headers: cors });
      }
      const pipelineGames = PIPELINE_GAMES[pipelineId];
      if (!pipelineGames) {
        return json({ error: "unknown_pipeline" }, { status: 404, headers: cors });
      }
      // For each device_hash that cleared every game in the pipeline on this day,
      // sum points (for point-based games) and time_sec (for time-based games).
      // SQL: aggregate with a JOIN, filter to devices with cleared count == pipeline.length.
      const placeholders = pipelineGames.map(() => "?").join(",");
      const { results } = await env.DB
        .prepare(
          `SELECT
             handle,
             MAX(submitted_at) AS submitted_at,
             SUM(CASE WHEN cleared = 1 THEN 1 ELSE 0 END) AS games_cleared,
             SUM(COALESCE(points, 0)) AS total_points,
             SUM(COALESCE(time_sec, 0)) AS total_time_sec
           FROM daily_scores
           WHERE daily_date = ?
             AND game_id IN (${placeholders})
           GROUP BY device_hash
           HAVING games_cleared = ?
           ORDER BY total_points DESC, total_time_sec ASC, submitted_at ASC
           LIMIT ?`
        )
        .bind(dailyDate, ...pipelineGames, pipelineGames.length, limit)
        .all();
      const rows = (results ?? []).map((r: any) => ({
        handle: r.handle,
        total_score: Number(r.total_points) || 0,
        total_time_sec: Number(r.total_time_sec) || 0,
        games_cleared: Number(r.games_cleared) || 0,
        submitted_at: Number(r.submitted_at) || 0,
      }));
      return json({ daily_date: dailyDate, pipeline_id: pipelineId, results: rows }, { headers: cors });
    }

    return json({ error: "not_found" }, { status: 404, headers: cors });
  },
};

interface DailyScoreSubmit {
  daily_date: string;
  game_id: string;
  device_hash: string;
  handle?: string | null;
  cleared: boolean;
  guesses?: number | null;
  points?: number | null;
  tier?: string | null;
  time_sec?: number | null;
}

interface DailyRunSubmit {
  daily_date: string;
  pipeline_id: string;
  device_hash: string;
  handle?: string | null;
  cleared: boolean;
  streak_days?: number | null;
}

const HIVE_TIERS = new Set([
  "beginner","goodStart","movingUp","good","solid","nice","great","amazing","genius","queenBee",
]);

function isValidDailyScore(body: DailyScoreSubmit): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(body.daily_date)) return false;
  if (!/^[a-z0-9_-]{1,32}$/.test(body.game_id)) return false;
  if (typeof body.device_hash !== "string" || body.device_hash.length < 8 || body.device_hash.length > 128) return false;
  if (typeof body.cleared !== "boolean") return false;
  if (body.handle !== null && body.handle !== undefined && body.handle.length > 32) return false;
  if (body.game_id === "hunt") {
    if (typeof body.guesses !== "number" || body.guesses < 1 || body.guesses > 6) return false;
  } else if (body.game_id === "hive") {
    if (typeof body.points !== "number" || body.points < 0 || body.points > 2000) return false;
    if (body.tier && !HIVE_TIERS.has(body.tier)) return false;
  } else if (body.game_id === "sudoku") {
    if (typeof body.time_sec !== "number" || body.time_sec < 1 || body.time_sec > 86400) return false;
  }
  return true;
}

interface TelemetryEvent {
  tool_id: string;
  cluster_id: string;
  risk_tier: "full" | "ltd" | "standard";
  zone_id?: string | null;
  event_type: string;
  ts?: number;
  viewport_w?: number | null;
}

interface TelemetryBatch {
  session_id: string;
  events: TelemetryEvent[];
}

interface ConsentEvent {
  session_id: string;
  action: "grant" | "deny" | "change" | "ltd_upgrade";
  tcf_string?: string | null;
  gpp_string?: string | null;
  ts?: number;
}

// Defense-in-depth — even if client misbehaves, never store blocklist words
const BLOCKLIST = /peptide|insulin|dosage|diabetes/i;
function scrubStr<T extends string | null>(v: T): T {
  if (typeof v !== "string") return v;
  return (BLOCKLIST.test(v) ? "[SCRUBBED]" : v) as T;
}

function geoRegion(cc: string): "EU" | "UK" | "US" | "ROW" {
  const EU = new Set([
    "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
    "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS",
    "LI","NO",
  ]);
  if (cc === "GB") return "UK";
  if (EU.has(cc)) return "EU";
  if (cc === "US") return "US";
  return "ROW";
}

function gppSid(region: "EU" | "UK" | "US" | "ROW"): number[] {
  // 2 = TCF EU v2, 6 = TCF CA v1, 7 = USP v1, 8 = USNat
  if (region === "EU") return [2];
  if (region === "UK") return [2];
  if (region === "US") return [7, 8];
  return [];
}

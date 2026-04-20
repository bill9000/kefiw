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

    return json({ error: "not_found" }, { status: 404, headers: cors });
  },
};

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

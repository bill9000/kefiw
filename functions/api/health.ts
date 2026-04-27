// kefiw.com/api/health — full-stack heartbeat.
//
// Aggregates three liveness signals into a single response:
//   - pages: this Function is running (always "ok" if you got a response at all)
//   - worker: kefiw-worker /health endpoint responded
//   - d1: the worker reports its D1 ping succeeded
//
// Used by uptime monitors, load-balancer health checks, and "is the site up?"
// curl tests. Cheap to run; safe to hit every minute.

interface Env {
  // No bindings required — Pages Functions can fetch the public worker URL.
}

const WORKER_URL = 'https://kefiw-worker.bill9000.workers.dev/health';
const WORKER_TIMEOUT_MS = 3000;

interface HealthResponse {
  ok: boolean;
  ts: number;
  components: {
    pages: 'ok';
    worker: 'ok' | 'timeout' | 'error' | 'down';
    d1?: 'ok' | 'unknown';
  };
  worker_latency_ms?: number;
  worker_response?: unknown;
  error?: string;
}

export const onRequestGet: PagesFunction<Env> = async () => {
  const started = Date.now();
  const result: HealthResponse = {
    ok: false,
    ts: started,
    components: { pages: 'ok', worker: 'down' },
  };

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), WORKER_TIMEOUT_MS);
    const res = await fetch(WORKER_URL, { signal: ctrl.signal });
    clearTimeout(timer);
    result.worker_latency_ms = Date.now() - started;

    if (!res.ok) {
      result.components.worker = 'error';
      result.error = `worker HTTP ${res.status}`;
      return Response.json(result, { status: 503 });
    }

    const body = (await res.json().catch(() => null)) as { ok?: boolean; d1?: string } | null;
    result.worker_response = body;
    if (body?.ok === true) {
      result.components.worker = 'ok';
      result.components.d1 = body.d1 === 'ok' ? 'ok' : 'unknown';
      result.ok = true;
    } else {
      result.components.worker = 'error';
      result.error = 'worker returned ok:false';
    }
  } catch (err) {
    const e = err as { name?: string; message?: string };
    result.components.worker = e.name === 'AbortError' ? 'timeout' : 'error';
    result.error = e.message ?? 'unknown error';
    result.worker_latency_ms = Date.now() - started;
  }

  return Response.json(result, { status: result.ok ? 200 : 503 });
};

// Allow HEAD as well for monitor probes that don't care about the body.
export const onRequestHead: PagesFunction<Env> = async (ctx) => {
  const r = await onRequestGet(ctx);
  return new Response(null, { status: r.status, headers: r.headers });
};

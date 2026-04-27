import { useCallback, useEffect, useRef, useState } from 'react';

// Hits the worker directly so this page works under `astro dev` too —
// no Pages Functions or wrangler proxy required.
const WORKER_HEALTH = 'https://kefiw-worker.bill9000.workers.dev/health';
const AUTO_REFRESH_MS = 30_000;
const FETCH_TIMEOUT_MS = 5_000;

type Verdict = 'ok' | 'degraded' | 'down' | 'checking';

interface ComponentStatus {
  label: string;
  state: 'ok' | 'error' | 'unknown';
  detail?: string;
}

interface Snapshot {
  verdict: Verdict;
  fetchedAt: number;
  workerLatencyMs?: number;
  components: ComponentStatus[];
  raw?: unknown;
  error?: string;
}

const INITIAL: Snapshot = {
  verdict: 'checking',
  fetchedAt: 0,
  components: [
    { label: 'Site (Cloudflare Pages)', state: 'unknown' },
    { label: 'API worker',              state: 'unknown' },
    { label: 'Database (D1)',           state: 'unknown' },
  ],
};

interface WorkerHealthBody {
  ok?: boolean;
  d1?: string;
  d1_latency_ms?: number;
  ts?: number;
}

async function probe(): Promise<Snapshot> {
  const start = Date.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(WORKER_HEALTH, { signal: ctrl.signal, cache: 'no-store' });
    clearTimeout(timer);
    const latency = Date.now() - start;
    let body: WorkerHealthBody | null = null;
    try { body = (await res.json()) as WorkerHealthBody; } catch {}
    const workerOk = res.ok && body?.ok === true;
    const d1State: ComponentStatus['state'] =
      body?.d1 === 'ok' ? 'ok'
      : body?.d1 === 'error' ? 'error'
      : 'unknown';

    const verdict: Verdict =
      workerOk && d1State !== 'error' ? (d1State === 'ok' ? 'ok' : 'degraded')
      : workerOk ? 'degraded'
      : 'down';

    return {
      verdict,
      fetchedAt: Date.now(),
      workerLatencyMs: latency,
      components: [
        { label: 'Site (Cloudflare Pages)', state: 'ok',
          detail: 'Reachable — you are reading this page.' },
        { label: 'API worker',              state: workerOk ? 'ok' : 'error',
          detail: workerOk ? `${latency} ms round-trip` : `HTTP ${res.status}` },
        { label: 'Database (D1)',           state: d1State,
          detail: body?.d1_latency_ms !== undefined ? `${body.d1_latency_ms} ms ping` : undefined },
      ],
      raw: body,
    };
  } catch (err) {
    clearTimeout(timer);
    const e = err as { name?: string; message?: string };
    const isTimeout = e.name === 'AbortError';
    return {
      verdict: 'down',
      fetchedAt: Date.now(),
      workerLatencyMs: Date.now() - start,
      components: [
        { label: 'Site (Cloudflare Pages)', state: 'ok',     detail: 'Reachable — you are reading this page.' },
        { label: 'API worker',              state: 'error',  detail: isTimeout ? 'Timeout (>5s)' : (e.message ?? 'unreachable') },
        { label: 'Database (D1)',           state: 'unknown', detail: 'Could not check (worker unreachable)' },
      ],
      error: e.message ?? 'unknown',
    };
  }
}

const STATE_COLOR: Record<ComponentStatus['state'], string> = {
  ok: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  error: 'border-rose-300 bg-rose-50 text-rose-900',
  unknown: 'border-slate-300 bg-slate-50 text-slate-700',
};
const STATE_DOT: Record<ComponentStatus['state'], string> = {
  ok: 'bg-emerald-500',
  error: 'bg-rose-500',
  unknown: 'bg-slate-400',
};

const VERDICT_HEADLINE: Record<Verdict, { color: string; label: string }> = {
  ok:        { color: 'border-emerald-500 bg-emerald-50 text-emerald-900', label: 'All systems operational' },
  degraded:  { color: 'border-amber-500 bg-amber-50 text-amber-900',         label: 'Partial degradation' },
  down:      { color: 'border-rose-500 bg-rose-50 text-rose-900',           label: 'Outage detected' },
  checking:  { color: 'border-slate-300 bg-slate-50 text-slate-700',         label: 'Checking…' },
};

function fmtAge(ts: number): string {
  if (!ts) return '—';
  const diff = Math.max(0, Date.now() - ts);
  if (diff < 5_000) return 'just now';
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return new Date(ts).toLocaleString();
}

export default function StatusBoard(): JSX.Element {
  const [snap, setSnap] = useState<Snapshot>(INITIAL);
  const [busy, setBusy] = useState(false);
  const [, force] = useState(0);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setBusy(true);
    const next = await probe();
    if (mounted.current) setSnap(next);
    setBusy(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    void refresh();
    const id = window.setInterval(() => { void refresh(); }, AUTO_REFRESH_MS);
    // Tick the "X seconds ago" label every second.
    const tick = window.setInterval(() => force((n) => (n + 1) & 0xffff), 1_000);
    return () => {
      mounted.current = false;
      window.clearInterval(id);
      window.clearInterval(tick);
    };
  }, [refresh]);

  const head = VERDICT_HEADLINE[snap.verdict];

  return (
    <div className="grid gap-4">
      <div className={`rounded-md border-2 px-4 py-4 ${head.color}`}>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em]">Status</div>
            <div className="mt-1 text-2xl font-bold">{head.label}</div>
          </div>
          <div className="text-xs">
            Last checked <strong>{fmtAge(snap.fetchedAt)}</strong> · auto-refresh every 30s
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        {snap.components.map((c) => (
          <div key={c.label} className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 ${STATE_COLOR[c.state]}`}>
            <div className="flex items-center gap-2">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${STATE_DOT[c.state]}`} />
              <span className="font-medium">{c.label}</span>
            </div>
            <div className="text-xs">
              {c.state === 'ok' && '✓ '}
              {c.state === 'error' && '! '}
              {c.detail ?? c.state}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <button
          type="button"
          onClick={() => { void refresh(); }}
          disabled={busy}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-slate-500 disabled:opacity-50"
        >
          {busy ? 'Checking…' : 'Refresh now'}
        </button>
        <a
          href="https://kefiw-worker.bill9000.workers.dev/health"
          rel="noopener"
          className="text-xs text-slate-600 underline hover:text-slate-900"
        >
          Raw worker /health JSON →
        </a>
      </div>

      <details className="text-xs text-slate-600">
        <summary className="cursor-pointer">Raw response from worker</summary>
        <pre className="mt-2 overflow-x-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100">{JSON.stringify(snap.raw ?? snap.error ?? null, null, 2)}</pre>
      </details>
    </div>
  );
}

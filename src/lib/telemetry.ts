// Client-side telemetry beacon → kefiw-worker → D1.
//
// Design rules (Neutral Cut / project_kefiw_monetization.md):
//   - NEVER send user-typed values, dataLabels, or computed results
//   - Only: event_type + tool_id + cluster_id + risk_tier + zone_id + timestamps
//   - Batch events, flush every 5s or on visibilitychange/pagehide via sendBeacon
//   - Session ID in first-party cookie, 30d TTL
//   - No-op if window.__KFW_TELEMETRY_DISABLED is true (for Klaro deny path)

import { resolveCluster, resolveToolId, type RiskTier } from './risk-tier';

const WORKER_URL = 'https://kefiw-worker.bill9000.workers.dev';
const COOKIE_NAME = 'kfw_sid';
const COOKIE_DAYS = 30;
const FLUSH_INTERVAL_MS = 5000;
const MAX_BATCH = 20;

export type EventType =
  | 'page_view'
  | 'impression'
  | 'viewable'
  | 'click'
  | 'fill'
  | 'unfill'
  | 'consent_grant'
  | 'consent_deny'
  | 'ltd_upgrade'
  | 'cls_shift'
  | 'tool_input'
  | 'tool_verify'
  | 'tool_reveal'
  | 'modal_open'
  | 'modal_dismiss'
  | 'ad_request';

export interface KfwEvent {
  event_type: EventType;
  tool_id?: string | null;
  cluster_id?: string;
  risk_tier?: RiskTier;
  zone_id?: string | null;
  viewport_w?: number | null;
  ts?: number;
}

interface BatchPayload {
  session_id: string;
  events: KfwEvent[];
}

let queue: KfwEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let sessionId: string | null = null;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function writeCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 86400 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function genSessionId(): string {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return 's_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getSessionId(): string {
  if (sessionId) return sessionId;
  let s = readCookie(COOKIE_NAME);
  if (!s) {
    s = genSessionId();
    writeCookie(COOKIE_NAME, s, COOKIE_DAYS);
  }
  sessionId = s;
  return s;
}

function isDisabled(): boolean {
  return typeof window !== 'undefined' &&
    (window as unknown as { __KFW_TELEMETRY_DISABLED?: boolean }).__KFW_TELEMETRY_DISABLED === true;
}

function hydrateContext(ev: KfwEvent): KfwEvent {
  if (typeof window === 'undefined') return ev;
  const path = window.location.pathname;
  const { cluster_id, risk_tier } = resolveCluster(path);
  return {
    ts: Date.now(),
    viewport_w: window.innerWidth,
    cluster_id,
    risk_tier,
    tool_id: ev.tool_id ?? resolveToolId(path),
    ...ev,
  };
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
}

async function flush(useBeacon = false): Promise<void> {
  if (queue.length === 0) return;
  const events = queue.splice(0, queue.length);
  const body: BatchPayload = { session_id: getSessionId(), events };
  const url = `${WORKER_URL}/telemetry`;
  const payload = JSON.stringify(body);

  if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
    return;
  }

  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    });
  } catch {
    /* swallow — never break the page for telemetry */
  }
}

export function track(event: KfwEvent): void {
  if (typeof window === 'undefined' || isDisabled()) return;
  queue.push(hydrateContext(event));
  if (queue.length >= MAX_BATCH) {
    void flush();
  } else {
    scheduleFlush();
  }
}

let initialized = false;

export function initTelemetry(): void {
  if (typeof window === 'undefined' || initialized) return;
  initialized = true;

  getSessionId();
  track({ event_type: 'page_view' });

  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush(true);
  });
  window.addEventListener('pagehide', () => { void flush(true); });
}

export function disableTelemetry(): void {
  (window as unknown as { __KFW_TELEMETRY_DISABLED?: boolean }).__KFW_TELEMETRY_DISABLED = true;
  queue = [];
}

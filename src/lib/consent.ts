// Consent state machine — drives first-party telemetry gating.
//
// Ad consent is handled by Google's certified CMP (AdSense Privacy & Messaging).
// This machine only governs our own Cloudflare Analytics + /worker/ telemetry.
//
// Three states:
//   'pending' — EU/UK default, telemetry off until user picks
//   'ltd'     — US/ROW default, telemetry on, ad personalization off
//   'full'    — telemetry on, ad personalization upgrade signal
//
// Public surface: window.__KFW_CONSENT + CustomEvent 'kfw:consent-change'.

import { track, disableTelemetry } from './telemetry';

export type ConsentState = 'pending' | 'ltd' | 'full';
export type Region = 'EU' | 'UK' | 'US' | 'ROW';

const STORAGE_KEY = 'kfw_consent';
const REGION_KEY = 'kfw_region';
const WORKER_URL = 'https://kefiw-worker.bill9000.workers.dev';

declare global {
  interface Window {
    __KFW_CONSENT?: ConsentState;
    __KFW_REGION?: Region;
  }
}

function read(): ConsentState | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'pending' || v === 'ltd' || v === 'full' ? v : null;
}

function write(state: ConsentState): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, state);
}

function readRegion(): Region | null {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(REGION_KEY);
  return v === 'EU' || v === 'UK' || v === 'US' || v === 'ROW' ? v : null;
}

function writeRegion(region: Region): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(REGION_KEY, region);
}

export function defaultForRegion(region: Region): ConsentState {
  // Hard-gate: EU/UK must affirmatively opt in → 'pending' until picked.
  // Soft-anchor: US/ROW start at 'full' (opt-out model); users can downgrade.
  return region === 'EU' || region === 'UK' ? 'pending' : 'full';
}

export async function resolveRegion(): Promise<Region> {
  const cached = readRegion();
  if (cached) return cached;
  try {
    const res = await fetch(`${WORKER_URL}/gpp`, { method: 'GET' });
    if (res.ok) {
      const body = (await res.json()) as { region?: Region };
      const region = body.region ?? 'ROW';
      writeRegion(region);
      return region;
    }
  } catch {
    /* offline / worker down — fall through */
  }
  writeRegion('ROW');
  return 'ROW';
}

export function getConsent(): ConsentState {
  if (typeof window === 'undefined') return 'ltd';
  return window.__KFW_CONSENT ?? read() ?? 'ltd';
}

export async function initConsent(): Promise<void> {
  if (typeof window === 'undefined') return;
  const stored = read();
  if (stored) {
    const region = readRegion() ?? 'ROW';
    window.__KFW_REGION = region;
    setConsent(stored, { silent: true });
    return;
  }
  const region = await resolveRegion();
  window.__KFW_REGION = region;
  const initial = defaultForRegion(region);
  setConsent(initial, { silent: true });
}

interface SetOpts {
  silent?: boolean;
}

export function setConsent(state: ConsentState, opts: SetOpts = {}): void {
  if (typeof window === 'undefined') return;
  const prev = window.__KFW_CONSENT;
  window.__KFW_CONSENT = state;
  write(state);

  if (opts.silent) {
    window.dispatchEvent(new CustomEvent('kfw:consent-change', { detail: { state, prev } }));
    return;
  }

  const action =
    state === 'full' ? 'grant' : state === 'ltd' ? (prev === 'full' ? 'deny' : 'ltd_upgrade') : 'change';

  track({
    event_type: state === 'full' ? 'consent_grant' : state === 'ltd' ? 'ltd_upgrade' : 'consent_deny',
  });

  void fetch(`${WORKER_URL}/consent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      session_id: getSessionFromCookie(),
      action,
      ts: Date.now(),
    }),
  }).catch(() => {
    /* swallow */
  });

  if (state === 'pending') {
    disableTelemetry();
  }

  window.dispatchEvent(new CustomEvent('kfw:consent-change', { detail: { state, prev } }));
}

function getSessionFromCookie(): string {
  if (typeof document === 'undefined') return 'anon';
  const m = document.cookie.match(/(?:^|; )kfw_sid=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : 'anon';
}

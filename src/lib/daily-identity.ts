// Device-hash identity for the Daily Kefiw leaderboard.
//
// - The leaderboard is not a real account system. A "player" is a random
//   opaque id stored in localStorage under kfw.daily.device_id.
//   Clearing storage = new identity.
// - device_hash sent to the worker is HMAC-like: sha256(device_id + salt).
//   The salt is a public constant — it only prevents trivially guessing
//   a device_id from the hash.
// - handle is user-chosen display text, 1–24 chars, a-z0-9_- only.
//   If left blank, the leaderboard shows "anon####" derived from the hash.

const DEVICE_KEY = 'kfw.daily.device_id';
const SALT = 'kefiw-daily-v1';

function randomId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getOrCreateDeviceId(): string {
  if (typeof localStorage === 'undefined') return '';
  let id = localStorage.getItem(DEVICE_KEY);
  if (!id) {
    id = randomId();
    try {
      localStorage.setItem(DEVICE_KEY, id);
    } catch {
      // Ignore quota/privacy-mode failures — the id just won't persist.
    }
  }
  return id;
}

export async function getDeviceHash(): Promise<string> {
  const id = getOrCreateDeviceId();
  if (!id) return '';
  const enc = new TextEncoder().encode(`${id}:${SALT}`);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

const HANDLE_RE = /^[a-z0-9_-]{1,24}$/;

export function validateHandle(raw: string): { ok: true; handle: string } | { ok: false; reason: string } {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return { ok: false, reason: 'Pick a handle' };
  if (!HANDLE_RE.test(trimmed)) return { ok: false, reason: 'a–z, 0–9, _ or -, 1–24 chars' };
  return { ok: true, handle: trimmed };
}

export function anonHandleFromHash(hash: string): string {
  if (!hash) return 'anon';
  return `anon${hash.slice(0, 4)}`;
}

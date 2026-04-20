const STORAGE_KEY = 'kfw-session-context';

export interface FieldValue {
  value: number;
  source: string;
  sourceLabel: string;
  updatedAt: number;
}

export type SessionContext = Record<string, FieldValue>;

type Listener = () => void;
const listeners = new Set<Listener>();

function readRaw(): SessionContext {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SessionContext) : {};
  } catch {
    return {};
  }
}

function writeRaw(ctx: SessionContext): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch {}
  listeners.forEach((fn) => fn());
}

export function readContext(): SessionContext {
  return readRaw();
}

export function writeField(key: string, value: number, source: string, sourceLabel: string): void {
  const ctx = readRaw();
  const existing = ctx[key];
  if (existing && existing.value === value && existing.source === source) return;
  ctx[key] = { value, source, sourceLabel, updatedAt: Date.now() };
  writeRaw(ctx);
}

export function clearField(key: string): void {
  const ctx = readRaw();
  if (!(key in ctx)) return;
  delete ctx[key];
  writeRaw(ctx);
}

export function clearAll(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  const handler = () => fn();
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handler);
  }
  return () => {
    listeners.delete(fn);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handler);
    }
  };
}

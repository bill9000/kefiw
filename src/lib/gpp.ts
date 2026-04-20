// GPP (Global Privacy Platform) CMP API stub — IAB GPP v1.
//
// Spec: https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform
//
// Registers __gppapi so US-state privacy signals (CCPA, CPRA, VCDPA, etc.)
// flow through a single unified API. GPP wraps TCF for EU/UK + USNAT for
// US + per-state sections.
//
// This is a STUB that emits correct API shapes with placeholder section
// strings. When real Klaro + IAB CMP registration lands, swap encodeUsnat()
// for the proper byte-packed section encoder — the API surface is stable.

import type { ConsentState, Region } from './consent';

type GppCommand =
  | 'ping'
  | 'addEventListener'
  | 'removeEventListener'
  | 'hasSection'
  | 'getSection'
  | 'getField'
  | 'getGPPData';

type SignalStatus = 'not ready' | 'ready';

interface PingReturn {
  gppVersion: '1.1';
  cmpStatus: 'stub' | 'loading' | 'loaded' | 'error';
  cmpDisplayStatus: 'hidden' | 'visible' | 'disabled';
  signalStatus: SignalStatus;
  supportedAPIs: string[];
  cmpId: number;
  sectionList: number[];
  applicableSections: number[];
  gppString: string;
  parsedSections: Record<string, unknown>;
}

type GppCallback = (data: unknown, success: boolean) => void;

declare global {
  interface Window {
    __gppapi?: (command: GppCommand, callback: GppCallback, parameter?: unknown) => void;
  }
}

// GPP section IDs per IAB GPP spec:
//   2  = tcfeuv2
//   7  = usnat   (US national)
//   8  = usca    (California)
//   9  = usva    (Virginia)
//  10 = usco    (Colorado)
//  11 = usut    (Utah)
//  12 = usct    (Connecticut)
const SECTION_TCFEU = 2;
const SECTION_USNAT = 7;
const PLACEHOLDER_CMP_ID = 0;

const listeners = new Map<number, GppCallback>();
let nextListenerId = 1;
let currentState: ConsentState = 'pending';
let currentRegion: Region = 'ROW';

function applicableSections(region: Region): number[] {
  if (region === 'EU' || region === 'UK') return [SECTION_TCFEU];
  if (region === 'US') return [SECTION_USNAT];
  return [];
}

function encodeUsnat(state: ConsentState): string {
  // Placeholder — real Klaro emits byte-packed base64url per USNAT v1 spec.
  // Sale/Share opt-out flag is the critical bit for CCPA/CPRA.
  const optedOut = state !== 'full';
  return optedOut ? 'USNAT-STUB-OPTOUT' : 'USNAT-STUB-OPTIN';
}

function encodeGppString(region: Region, state: ConsentState): string {
  const sections = applicableSections(region);
  if (sections.length === 0) return 'DBAA';
  if (sections.includes(SECTION_USNAT)) return `DBABL~${encodeUsnat(state)}`;
  return 'DBAA';
}

function buildPing(): PingReturn {
  return {
    gppVersion: '1.1',
    cmpStatus: 'loaded',
    cmpDisplayStatus: 'hidden',
    signalStatus: 'ready',
    supportedAPIs: ['tcfeuv2', 'usnat', 'usca', 'usva', 'usco', 'usut', 'usct'],
    cmpId: PLACEHOLDER_CMP_ID,
    sectionList: applicableSections(currentRegion),
    applicableSections: applicableSections(currentRegion),
    gppString: encodeGppString(currentRegion, currentState),
    parsedSections: {},
  };
}

function getSection(id: unknown): unknown {
  if (typeof id !== 'number') return null;
  if (id === SECTION_USNAT && currentRegion === 'US') {
    return { Version: 1, SaleOptOut: currentState !== 'full' ? 1 : 2 };
  }
  return null;
}

function invokeGppApi(command: GppCommand, callback: GppCallback, parameter?: unknown): void {
  switch (command) {
    case 'ping':
      callback(buildPing(), true);
      return;
    case 'getGPPData':
      callback(buildPing(), true);
      return;
    case 'addEventListener': {
      const id = nextListenerId++;
      listeners.set(id, callback);
      callback({ eventName: 'listenerRegistered', listenerId: id, data: true, pingData: buildPing() }, true);
      return;
    }
    case 'removeEventListener': {
      const id = typeof parameter === 'number' ? parameter : -1;
      const removed = listeners.delete(id);
      callback({ eventName: 'listenerRemoved', listenerId: id, data: removed, pingData: buildPing() }, removed);
      return;
    }
    case 'hasSection':
      callback(applicableSections(currentRegion).includes(typeof parameter === 'number' ? parameter : -1), true);
      return;
    case 'getSection':
      callback(getSection(parameter), true);
      return;
    case 'getField': {
      const field = typeof parameter === 'string' ? parameter : '';
      if (field === 'usnat.SaleOptOut') {
        callback(currentState !== 'full' ? 1 : 2, true);
        return;
      }
      callback(null, false);
      return;
    }
    default:
      callback(null, false);
  }
}

function fireSignalChange(): void {
  for (const [id, cb] of listeners) {
    cb({ eventName: 'signalStatus', listenerId: id, data: 'ready', pingData: buildPing() }, true);
    cb({ eventName: 'sectionChange', listenerId: id, data: applicableSections(currentRegion), pingData: buildPing() }, true);
  }
}

export function updateGpp(state: ConsentState, region: Region): void {
  currentState = state;
  currentRegion = region;
  fireSignalChange();
}

interface QueuedCall {
  command: GppCommand;
  callback: GppCallback;
  parameter?: unknown;
}

export function initGpp(state: ConsentState, region: Region): void {
  if (typeof window === 'undefined') return;
  currentState = state;
  currentRegion = region;

  const priorStub = window.__gppapi as (typeof window.__gppapi & { queue?: QueuedCall[] }) | undefined;
  const queued = priorStub && Array.isArray(priorStub.queue) ? priorStub.queue : [];

  window.__gppapi = invokeGppApi as typeof window.__gppapi;

  for (const q of queued) {
    try { invokeGppApi(q.command, q.callback, q.parameter); } catch { /* ignore */ }
  }

  fireSignalChange();
}

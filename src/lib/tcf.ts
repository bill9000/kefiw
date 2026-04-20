// TCF 2.2 CMP API stub — IAB TCF v2.2 shape without IAB registration yet.
//
// Spec: https://github.com/InteractiveAdvertisingBureau/GDPR-Transparency-and-Consent-Framework
//
// Registers __tcfapi (parent frame) + __tcfapiLocator iframe so in-page
// vendors (AdSense, analytics) can discover and query consent. Emits a
// TCData shape that AdSense understands; the tcString is a PLACEHOLDER
// (cmpId = 0) until the IAB CMP registration completes and real Klaro
// replaces this shim.
//
// After registration, set cmpId to the issued ID and swap emitTcString()
// for Klaro's encoded output — rest of the wiring stays.

import type { ConsentState, Region } from './consent';

type TcfCommand = 'ping' | 'getTCData' | 'addEventListener' | 'removeEventListener';
type EventStatus = 'tcloaded' | 'cmpuishown' | 'useractioncomplete';
type CmpStatus = 'stub' | 'loading' | 'loaded' | 'error';

interface PingReturn {
  cmpLoaded: boolean;
  cmpStatus: CmpStatus;
  displayStatus: 'visible' | 'hidden' | 'disabled';
  apiVersion: '2.2';
  cmpVersion: number;
  cmpId: number;
  gvlVersion?: number;
  tcfPolicyVersion: number;
}

interface TCData {
  tcString: string;
  tcfPolicyVersion: number;
  cmpId: number;
  cmpVersion: number;
  gdprApplies: boolean;
  eventStatus: EventStatus;
  cmpStatus: CmpStatus;
  listenerId?: number;
  isServiceSpecific: boolean;
  useNonStandardStacks: boolean;
  publisherCC: string;
  purposeOneTreatment: boolean;
  purpose: { consents: Record<number, boolean>; legitimateInterests: Record<number, boolean> };
  vendor: { consents: Record<number, boolean>; legitimateInterests: Record<number, boolean> };
  specialFeatureOptins: Record<number, boolean>;
  publisher: {
    consents: Record<number, boolean>;
    legitimateInterests: Record<number, boolean>;
    customPurpose: { consents: Record<number, boolean>; legitimateInterests: Record<number, boolean> };
    restrictions: Record<string, Record<number, number>>;
  };
}

type TcfCallback = (data: TCData | PingReturn | null, success: boolean) => void;

declare global {
  interface Window {
    __tcfapi?: (command: TcfCommand, version: number, callback: TcfCallback, parameter?: unknown) => void;
  }
}

// Purposes the site actually uses (AdSense). Enumerated by TCF GVL:
//   1 = Store and access information on a device
//   3 = Personalised ads profile
//   4 = Personalised ads
//   7 = Measure ad performance
//   9 = Market research
//  10 = Develop and improve products
const AD_PURPOSES = [1, 3, 4, 7, 9, 10];

// AdSense/Google Ads IAB vendor IDs (GVL v3):
//   755 = Google Advertising Products
const AD_VENDORS = [755];

const PLACEHOLDER_CMP_ID = 0;
const CMP_VERSION = 1;
const TCF_POLICY_VERSION = 4;
const PUBLISHER_CC = 'AA';

const listeners = new Map<number, TcfCallback>();
let nextListenerId = 1;
let currentState: ConsentState = 'pending';
let currentRegion: Region = 'ROW';
let cmpStatus: CmpStatus = 'stub';

function gdprAppliesFor(region: Region): boolean {
  return region === 'EU' || region === 'UK';
}

function emitTcString(state: ConsentState, region: Region): string {
  if (!gdprAppliesFor(region)) return '';
  // Placeholder until real Klaro + IAB cmpId lands — see README notes.
  // AdSense in GDPR regions will refuse to serve on an invalid string,
  // which is the correct hard-gate behavior before registration.
  return state === 'full' ? 'CP-STUB-PENDING-REGISTRATION' : 'CP-STUB-NO-CONSENT';
}

function purposeGrants(state: ConsentState): Record<number, boolean> {
  const full = state === 'full';
  return AD_PURPOSES.reduce<Record<number, boolean>>((acc, p) => {
    acc[p] = full;
    return acc;
  }, {});
}

function vendorGrants(state: ConsentState): Record<number, boolean> {
  const full = state === 'full';
  return AD_VENDORS.reduce<Record<number, boolean>>((acc, v) => {
    acc[v] = full;
    return acc;
  }, {});
}

function buildTCData(state: ConsentState, region: Region, eventStatus: EventStatus, listenerId?: number): TCData {
  const gdprApplies = gdprAppliesFor(region);
  return {
    tcString: emitTcString(state, region),
    tcfPolicyVersion: TCF_POLICY_VERSION,
    cmpId: PLACEHOLDER_CMP_ID,
    cmpVersion: CMP_VERSION,
    gdprApplies,
    eventStatus,
    cmpStatus: cmpStatus === 'stub' ? 'loaded' : cmpStatus,
    listenerId,
    isServiceSpecific: true,
    useNonStandardStacks: false,
    publisherCC: PUBLISHER_CC,
    purposeOneTreatment: false,
    purpose: {
      consents: purposeGrants(state),
      legitimateInterests: {},
    },
    vendor: {
      consents: vendorGrants(state),
      legitimateInterests: {},
    },
    specialFeatureOptins: {},
    publisher: {
      consents: purposeGrants(state),
      legitimateInterests: {},
      customPurpose: { consents: {}, legitimateInterests: {} },
      restrictions: {},
    },
  };
}

function buildPing(): PingReturn {
  return {
    cmpLoaded: cmpStatus === 'loaded',
    cmpStatus,
    displayStatus: 'hidden',
    apiVersion: '2.2',
    cmpVersion: CMP_VERSION,
    cmpId: PLACEHOLDER_CMP_ID,
    tcfPolicyVersion: TCF_POLICY_VERSION,
  };
}

function installLocator(): void {
  if (typeof window === 'undefined') return;
  if (window.frames['__tcfapiLocator' as never]) return;
  try {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'display:none;position:absolute;width:0;height:0;border:0';
    iframe.name = '__tcfapiLocator';
    (document.body ?? document.documentElement).appendChild(iframe);
  } catch {
    /* DOM not ready — ignore; initTcf re-tries on DOMContentLoaded */
  }
}

function handleMessage(evt: MessageEvent): void {
  const data = evt.data;
  const payload = typeof data === 'string' ? safeParse(data) : data;
  if (!payload || typeof payload !== 'object' || !('__tcfapiCall' in payload)) return;
  const call = (payload as { __tcfapiCall: { command: TcfCommand; callId: number; version: number; parameter?: unknown } }).__tcfapiCall;
  invokeTcfApi(call.command, call.version, (returnValue, success) => {
    const response = { __tcfapiReturn: { returnValue, success, callId: call.callId } };
    try {
      (evt.source as Window | null)?.postMessage(response, evt.origin as never);
    } catch {
      /* cross-origin post denied — ignore */
    }
  }, call.parameter);
}

function safeParse(raw: string): unknown {
  try { return JSON.parse(raw); } catch { return null; }
}

function invokeTcfApi(command: TcfCommand, _version: number, callback: TcfCallback, parameter?: unknown): void {
  switch (command) {
    case 'ping':
      callback(buildPing(), true);
      return;
    case 'getTCData':
      callback(buildTCData(currentState, currentRegion, 'tcloaded'), true);
      return;
    case 'addEventListener': {
      const id = nextListenerId++;
      listeners.set(id, callback);
      callback(buildTCData(currentState, currentRegion, 'tcloaded', id), true);
      return;
    }
    case 'removeEventListener': {
      const id = typeof parameter === 'number' ? parameter : -1;
      const existed = listeners.delete(id);
      callback(null, existed);
      return;
    }
    default:
      callback(null, false);
  }
}

function fireEvent(eventStatus: EventStatus): void {
  for (const [id, cb] of listeners) {
    cb(buildTCData(currentState, currentRegion, eventStatus, id), true);
  }
}

export function updateTcf(state: ConsentState, region: Region): void {
  currentState = state;
  currentRegion = region;
  fireEvent('useractioncomplete');
}

interface QueuedCall {
  command: TcfCommand;
  version: number;
  callback: TcfCallback;
  parameter?: unknown;
}

export function initTcf(state: ConsentState, region: Region): void {
  if (typeof window === 'undefined') return;
  currentState = state;
  currentRegion = region;
  cmpStatus = 'loaded';

  const priorStub = window.__tcfapi as (typeof window.__tcfapi & { queue?: QueuedCall[] }) | undefined;
  const queued = priorStub && Array.isArray(priorStub.queue) ? priorStub.queue : [];

  window.__tcfapi = invokeTcfApi as typeof window.__tcfapi;

  if (document.body) {
    installLocator();
  } else {
    document.addEventListener('DOMContentLoaded', installLocator, { once: true });
  }

  window.addEventListener('message', handleMessage);

  for (const q of queued) {
    try { invokeTcfApi(q.command, q.version, q.callback, q.parameter); } catch { /* ignore */ }
  }

  fireEvent('tcloaded');
}

const STORAGE_KEY = 'kfw-dashboard-v1';
const UPDATE_EVENT = 'kfw-update';
const HISTORY_MAX = 8;

export type SystemHealth = 'uncalibrated' | 'stable' | 'guarded' | 'critical';
export type CognitiveLoad = 'low' | 'nominal' | 'high';

export interface DashboardMetrics {
  runway_months?: number;
  survival_efficiency?: number;
  cognitive_load?: CognitiveLoad;
  willpower_pct?: number;
  // Peptide suite — Biological Vitals alongside Financial Runway.
  reagent_concentration_mg_ml?: number;
  reagent_waste_pct?: number;
  reagent_potency_pct?: number;      // DEG-1 retained potency after thermal exposure
  mass_loss_pct?: number;            // SAR-1 lean-mass loss ratio
  // Reagent pipeline syringe selection — flows from Step 2 (Dispense) into
  // Step 3 (Lookup) so the user only picks a syringe once.
  reagent_syringe_id?: string;       // 'u100' | 'u40' | 'ins05' | 'ins03' | 'tb1' | 'custom'
  reagent_syringe_vol_ml?: number;   // effective barrel volume (W)
  reagent_syringe_divs?: number;     // effective division count (Q)
}

export interface DashboardFlags {
  critical_runway?: boolean;
  decision_fatigue?: boolean;
  low_bio_fuel?: boolean;
  // Peptide suite — critical flags pulse the ULH-01 System Tray Magenta.
  reagent_waste_critical?: boolean;      // SDS-1: annual leakage > budget
  mass_retention_critical?: boolean;     // SAR-1: lean loss ratio >= 25%
  reagent_decay_critical?: boolean;      // DEG-1: retained potency < 85%
}

export interface DashboardState {
  last_update: string;
  metrics: DashboardMetrics;
  flags: DashboardFlags;
  history: string[];
}

const EMPTY: DashboardState = {
  last_update: '',
  metrics: {},
  flags: {},
  history: [],
};

function readRaw(): DashboardState {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<DashboardState>;
    return {
      last_update: parsed.last_update ?? '',
      metrics: parsed.metrics ?? {},
      flags: parsed.flags ?? {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return { ...EMPTY };
  }
}

function writeRaw(state: DashboardState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  } catch {}
}

export function readDashboard(): DashboardState {
  return readRaw();
}

export function writeMetric<K extends keyof DashboardMetrics>(key: K, value: DashboardMetrics[K]): void {
  const s = readRaw();
  if (s.metrics[key] === value) return;
  s.metrics[key] = value;
  s.last_update = new Date().toISOString();
  writeRaw(s);
}

export function writeFlag<K extends keyof DashboardFlags>(key: K, value: DashboardFlags[K]): void {
  const s = readRaw();
  if (s.flags[key] === value) return;
  s.flags[key] = value;
  s.last_update = new Date().toISOString();
  writeRaw(s);
}

export function addHistory(slug: string): void {
  if (!slug) return;
  const s = readRaw();
  const last = s.history[s.history.length - 1];
  if (last === slug) return;
  s.history = [...s.history, slug].slice(-HISTORY_MAX);
  writeRaw(s);
}

export function getSystemHealth(s: DashboardState = readRaw()): SystemHealth {
  const hasAny =
    s.metrics.runway_months !== undefined ||
    s.metrics.cognitive_load !== undefined ||
    s.metrics.survival_efficiency !== undefined;
  if (!hasAny) return 'uncalibrated';

  const critical =
    s.flags.critical_runway === true ||
    s.flags.reagent_waste_critical === true ||
    s.flags.mass_retention_critical === true ||
    s.flags.reagent_decay_critical === true ||
    (s.metrics.runway_months !== undefined && s.metrics.runway_months < 3) ||
    (s.metrics.survival_efficiency !== undefined && s.metrics.survival_efficiency < 30);
  if (critical) return 'critical';

  const guarded =
    (s.metrics.runway_months !== undefined && s.metrics.runway_months < 6) ||
    s.metrics.cognitive_load === 'high' ||
    (s.metrics.survival_efficiency !== undefined && s.metrics.survival_efficiency < 60) ||
    s.flags.decision_fatigue === true ||
    s.flags.low_bio_fuel === true;
  if (guarded) return 'guarded';

  return 'stable';
}

type Listener = () => void;

export function subscribeDashboard(fn: Listener): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => fn();
  window.addEventListener(UPDATE_EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(UPDATE_EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

export function clearDashboard(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
}

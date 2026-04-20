import { useEffect, useState } from 'react';
import {
  readDashboard,
  subscribeDashboard,
  addHistory,
  getSystemHealth,
  type DashboardState,
  type SystemHealth,
} from '~/lib/kfw-bridge';

const BG = '#09090b';
const BORDER = '#1e293b';
const DIM = '#64748b';
const TEXT = '#e2e8f0';
const CYAN = '#22d3ee';
const GOLD = '#facc15';
const MAGENTA = '#f472b6';
const GRAY = '#475569';

const LED_COLOR: Record<SystemHealth, string> = {
  uncalibrated: GRAY,
  stable: CYAN,
  guarded: GOLD,
  critical: MAGENTA,
};

const LED_LABEL: Record<SystemHealth, string> = {
  uncalibrated: 'UNCALIBRATED',
  stable: 'STABLE',
  guarded: 'GUARDED',
  critical: 'CRITICAL',
};

function pathCategory(path: string): string {
  if (path.startsWith('/word-tools/')) return 'word-tools';
  if (path.startsWith('/games/')) return 'games';
  if (path.startsWith('/calculators/')) return 'calculators';
  if (path.startsWith('/converters/')) return 'converters';
  if (path.startsWith('/health/')) return 'health';
  if (path.startsWith('/logic/')) return 'logic';
  if (path.startsWith('/finance/')) return 'finance';
  if (path.startsWith('/guides/')) return 'guides';
  return 'home';
}

function getNudge(path: string, s: DashboardState): string | null {
  const cat = pathCategory(path);
  const { runway_months, cognitive_load, survival_efficiency, peptide_potency_pct, peptide_lean_ratio_pct } = s.metrics;
  const { peptide_sarcopenia_critical, peptide_degradation_critical, peptide_waste_critical } = s.flags;

  if (peptide_sarcopenia_critical) {
    return `Sarcopenia CRITICAL: ${(peptide_lean_ratio_pct ?? 0).toFixed(1)}% lean loss — increase protein + resistance training before next dose.`;
  }
  if (peptide_degradation_critical) {
    return `Potency CRITICAL: ${(peptide_potency_pct ?? 0).toFixed(1)}% retained — discard reconstituted vial, replan inventory.`;
  }
  if (peptide_waste_critical) {
    return 'Waste budget EXCEEDED — switch to low-dead-space syringes or reduce draw count.';
  }

  if ((cat === 'word-tools' || cat === 'games') && runway_months !== undefined) {
    if (runway_months < 3) {
      return `Runway critical: ${runway_months.toFixed(1)}m. Pattern-solving won't pay rent — open Shock Survival.`;
    }
    if (runway_months < 6) {
      return `Pattern recognition high. Use the clarity to extend your ${runway_months.toFixed(1)}-month runway.`;
    }
  }

  if ((cat === 'health' || cat === 'games' || cat === 'word-tools') && cognitive_load === 'high') {
    return 'Cognitive load HIGH. Defer heavy decisions — fuel and sleep before strategy.';
  }

  if (cat === 'finance' && cognitive_load === 'high') {
    return 'Warning: deciding while depleted. Every choice now is 2× more likely to be a default.';
  }

  if (cat === 'health' && survival_efficiency !== undefined && survival_efficiency < 40) {
    return `Bio-fuel efficiency ${survival_efficiency.toFixed(0)}% — optimize staples before tuning macros.`;
  }

  if (s.history.length === 0) {
    return 'System uncalibrated. Run Runway Zero, Decision Fatigue, or Bio-Fuel to light up the LED.';
  }

  return null;
}

function metricCell(label: string, value: string, color: string = TEXT) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 4 }}>
      <span style={{ color: DIM }}>[{label}]</span>
      <span style={{ color, fontWeight: 700 }}>{value}</span>
    </span>
  );
}

export default function SystemTray() {
  const [state, setState] = useState<DashboardState | null>(null);
  const [path, setPath] = useState<string>('');

  useEffect(() => {
    setState(readDashboard());
    setPath(window.location.pathname);
    const slug = window.location.pathname.replace(/\/+$/, '').split('/').pop() ?? '';
    if (slug) addHistory(slug);
    const unsub = subscribeDashboard(() => setState(readDashboard()));
    return unsub;
  }, []);

  if (!state) {
    return (
      <div style={shell} aria-label="System tray">
        <div style={zoneA}>
          <span style={{ ...led, background: GRAY }} />
          <span style={{ color: DIM }}>[SYS]</span>
          <span style={{ color: DIM }}>INIT</span>
        </div>
      </div>
    );
  }

  const health = getSystemHealth(state);
  const ledColor = LED_COLOR[health];
  const ledLabel = LED_LABEL[health];
  const pulse = health !== 'uncalibrated';
  const nudge = getNudge(path, state);

  const r = state.metrics.runway_months;
  const cl = state.metrics.cognitive_load;
  const bio = state.metrics.survival_efficiency;
  const potency = state.metrics.peptide_potency_pct;
  const leanRatio = state.metrics.peptide_lean_ratio_pct;
  const wastePct = state.metrics.peptide_waste_pct;
  const peptideFlagCrit =
    state.flags.peptide_sarcopenia_critical ||
    state.flags.peptide_degradation_critical ||
    state.flags.peptide_waste_critical;
  const hasPeptide = potency !== undefined || leanRatio !== undefined || wastePct !== undefined || !!peptideFlagCrit;
  const peptideVal = peptideFlagCrit
    ? 'CRIT'
    : potency !== undefined && potency < 85
    ? `${potency.toFixed(0)}%`
    : leanRatio !== undefined && leanRatio >= 25
    ? `L${leanRatio.toFixed(0)}%`
    : wastePct !== undefined
    ? `W${wastePct.toFixed(0)}%`
    : potency !== undefined
    ? `${potency.toFixed(0)}%`
    : '—';
  const peptideColor = peptideFlagCrit
    ? MAGENTA
    : potency !== undefined && potency < 85
    ? MAGENTA
    : potency !== undefined && potency < 95
    ? GOLD
    : leanRatio !== undefined && leanRatio >= 25
    ? MAGENTA
    : CYAN;

  return (
    <div style={shell} aria-label="System tray">
      <div style={zoneA}>
        <span
          style={{
            ...led,
            background: ledColor,
            boxShadow: pulse ? `0 0 6px ${ledColor}, 0 0 12px ${ledColor}66` : undefined,
            animation: pulse ? 'kfwPulse 1.8s ease-in-out infinite' : undefined,
          }}
        />
        <span style={{ color: DIM }}>[SYS]</span>
        <span style={{ color: ledColor, fontWeight: 700 }}>{ledLabel}</span>
      </div>

      <div style={zoneB}>
        {nudge ? (
          <span style={{ color: DIM }}>
            <span style={{ color: ledColor }}>▸ </span>
            {nudge}
          </span>
        ) : (
          <span style={{ color: DIM }}>// standby</span>
        )}
      </div>

      <div style={zoneC}>
        {r !== undefined
          ? metricCell('R', `${r.toFixed(1)}m`, r < 3 ? MAGENTA : r < 6 ? GOLD : CYAN)
          : metricCell('R', '—', GRAY)}
        {cl !== undefined
          ? metricCell('C', cl.toUpperCase(), cl === 'high' ? MAGENTA : cl === 'nominal' ? GOLD : CYAN)
          : metricCell('C', '—', GRAY)}
        {bio !== undefined
          ? metricCell('B', `${bio.toFixed(0)}%`, bio < 40 ? MAGENTA : bio < 70 ? GOLD : CYAN)
          : metricCell('B', '—', GRAY)}
        {hasPeptide
          ? metricCell('P', peptideVal, peptideColor)
          : metricCell('P', '—', GRAY)}
      </div>

      <style>{`
        @keyframes kfwPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

const shell: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  height: 40,
  padding: '0 16px',
  background: BG,
  color: TEXT,
  borderBottom: `1px solid ${BORDER}`,
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 11,
  letterSpacing: '.04em',
  position: 'sticky',
  top: 0,
  zIndex: 40,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
};

const zoneA: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
};

const zoneB: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: 11,
};

const zoneC: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  flexShrink: 0,
};

const led: React.CSSProperties = {
  display: 'inline-block',
  width: 8,
  height: 8,
  borderRadius: '50%',
  transition: 'background 180ms ease',
};

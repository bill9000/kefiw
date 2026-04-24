// SystemTray — compact dashboard badge that lives in the site header.
//
// States:
//   idle    — no metrics stored, button is dim slate, no pulse. Optional:
//             hide entirely by not rendering children when this is true.
//   active  — at least one metric (or daily streak) is populated. Button
//             shows a small coloured status dot + pulse.
//   open    — user clicked the button. A dropdown panel appears below-right
//             with the full metric list + current-page nudge.

import { useEffect, useRef, useState } from 'react';
import {
  readDashboard,
  subscribeDashboard,
  addHistory,
  getSystemHealth,
  clearDashboard,
  type DashboardState,
  type SystemHealth,
} from '~/lib/kfw-bridge';
import { loadHistory } from '~/lib/daily-state';
import { getDailyDate } from '~/lib/daily-day';
import { pipelineStreak } from '~/lib/daily-scoring';

// Light-theme palette (matches the rest of the site chrome).
const BG = '#ffffff';
const SUBTLE_BG = '#f8fafc';
const BORDER = '#e2e8f0';
const STRONG_BORDER = '#cbd5e1';
const TEXT = '#0f172a';
const TEXT_2 = '#334155';
const DIM = '#64748b';
const CYAN = '#0891b2';
const GOLD = '#a16207';
const MAGENTA = '#c026d3';
const GRAY = '#94a3b8';
const SYS_FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

const emptyLinkStyle: React.CSSProperties = {
  color: '#2666e1',  // brand blue
  textDecoration: 'none',
  fontSize: 13,
  fontWeight: 500,
};

const LED_COLOR: Record<SystemHealth, string> = {
  uncalibrated: GRAY,
  stable: CYAN,
  guarded: GOLD,
  critical: MAGENTA,
};
const LED_LABEL: Record<SystemHealth, string> = {
  uncalibrated: 'Not calibrated',
  stable: 'Stable',
  guarded: 'Watch',
  critical: 'Critical',
};

function pathCategory(path: string): string {
  if (path.startsWith('/daily/')) return 'daily';
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
  const { runway_months, cognitive_load, survival_efficiency, reagent_potency_pct, mass_loss_pct } = s.metrics;
  const { mass_retention_critical, reagent_decay_critical, reagent_waste_critical } = s.flags;

  if (mass_retention_critical) {
    return `Sarcopenia critical: ${(mass_loss_pct ?? 0).toFixed(1)}% lean loss — increase protein + resistance training before next dose.`;
  }
  if (reagent_decay_critical) {
    return `Potency critical: ${(reagent_potency_pct ?? 0).toFixed(1)}% retained — discard reconstituted vial, replan inventory.`;
  }
  if (reagent_waste_critical) {
    return 'Waste budget exceeded — switch to low-dead-space syringes or reduce draw count.';
  }
  if ((cat === 'word-tools' || cat === 'games') && runway_months !== undefined) {
    if (runway_months < 3) {
      return `Runway critical: ${runway_months.toFixed(1)} mo. Pattern-solving won’t pay rent — open Shock Survival.`;
    }
    if (runway_months < 6) {
      return `Pattern recognition high. Use the clarity to extend your ${runway_months.toFixed(1)}-month runway.`;
    }
  }
  if ((cat === 'health' || cat === 'games' || cat === 'word-tools') && cognitive_load === 'high') {
    return 'Cognitive load high. Defer heavy decisions — fuel and sleep before strategy.';
  }
  if (cat === 'finance' && cognitive_load === 'high') {
    return 'Warning: deciding while depleted. Every choice now is 2× more likely to be a default.';
  }
  if (cat === 'health' && survival_efficiency !== undefined && survival_efficiency < 40) {
    return `Bio-fuel efficiency ${survival_efficiency.toFixed(0)}% — optimize staples before tuning macros.`;
  }
  return null;
}

interface MetricRow {
  label: string;
  value: string;
  color: string;
  help: string;
}

export default function SystemTray(): JSX.Element | null {
  const [state, setState] = useState<DashboardState | null>(null);
  const [path, setPath] = useState<string>('');
  const [dailyStreak, setDailyStreak] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setState(readDashboard());
    setPath(window.location.pathname);
    const slug = window.location.pathname.replace(/\/+$/, '').split('/').pop() ?? '';
    if (slug) addHistory(slug);
    const refreshStreak = () => {
      try {
        const today = getDailyDate();
        setDailyStreak(pipelineStreak(loadHistory(), 'core', today));
      } catch {
        setDailyStreak(0);
      }
    };
    refreshStreak();
    const unsub = subscribeDashboard(() => setState(readDashboard()));
    const id = setInterval(refreshStreak, 5000);
    return () => {
      unsub();
      clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent): void => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [open]);

  if (!state) return null;

  const r = state.metrics.runway_months;
  const cl = state.metrics.cognitive_load;
  const bio = state.metrics.survival_efficiency;
  const potency = state.metrics.reagent_potency_pct;
  const leanRatio = state.metrics.mass_loss_pct;
  const wastePct = state.metrics.reagent_waste_pct;
  const peptideFlagCrit =
    state.flags.mass_retention_critical ||
    state.flags.reagent_decay_critical ||
    state.flags.reagent_waste_critical;

  const hasPeptide =
    potency !== undefined || leanRatio !== undefined || wastePct !== undefined || !!peptideFlagCrit;
  const peptideVal = peptideFlagCrit
    ? 'critical'
    : potency !== undefined && potency < 85
    ? `${potency.toFixed(0)}%`
    : leanRatio !== undefined && leanRatio >= 25
    ? `lean ${leanRatio.toFixed(0)}%`
    : wastePct !== undefined
    ? `waste ${wastePct.toFixed(0)}%`
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

  const hasAnyMetric =
    r !== undefined ||
    cl !== undefined ||
    bio !== undefined ||
    hasPeptide ||
    dailyStreak > 0;

  const health = getSystemHealth(state);
  const ledColor = hasAnyMetric ? LED_COLOR[health] : GRAY;
  const ledLabel = hasAnyMetric ? LED_LABEL[health] : 'Empty';
  // Only pulse when there's something to draw the eye to. Empty state = calm.
  const pulse = hasAnyMetric && health !== 'uncalibrated';
  const nudge = getNudge(path, state);

  const rows: MetricRow[] = [];
  if (r !== undefined) {
    rows.push({
      label: 'Runway',
      value: `${r.toFixed(1)} mo`,
      color: r < 3 ? MAGENTA : r < 6 ? GOLD : CYAN,
      help: 'Months of financial runway — from Runway Zero.',
    });
  }
  if (cl !== undefined) {
    rows.push({
      label: 'Mind',
      value: cl,
      color: cl === 'high' ? MAGENTA : cl === 'nominal' ? GOLD : CYAN,
      help: 'Cognitive load — from Decision Fatigue tools.',
    });
  }
  if (bio !== undefined) {
    rows.push({
      label: 'Body',
      value: `${bio.toFixed(0)}%`,
      color: bio < 40 ? MAGENTA : bio < 70 ? GOLD : CYAN,
      help: 'Bio-fuel / survival efficiency — from health calculators.',
    });
  }
  if (hasPeptide) {
    rows.push({
      label: 'Prep',
      value: peptideVal,
      color: peptideColor,
      help: 'Reagent prep status — potency, lean retention, or waste.',
    });
  }
  if (dailyStreak > 0) {
    rows.push({
      label: 'Streak',
      value: `${dailyStreak} day${dailyStreak === 1 ? '' : 's'}`,
      color: CYAN,
      help: 'Consecutive days with a completed daily challenge.',
    });
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Dashboard · ${ledLabel}${rows.length ? ' · ' + rows.length + ' metrics' : ''}`}
        aria-expanded={open}
        title={`Dashboard · ${ledLabel}`}
        style={{
          position: 'relative',
          width: 36,
          height: 36,
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: BG,
          border: `1px solid ${STRONG_BORDER}`,
          borderRadius: 8,
          cursor: 'pointer',
          color: TEXT_2,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1" />
          <rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1" />
          <rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1" />
          <rect x="9" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.5" rx="1" />
        </svg>
        <span
          style={{
            position: 'absolute',
            top: 3,
            right: 3,
            width: 9,
            height: 9,
            borderRadius: 9,
            background: ledColor,
            border: `1.5px solid ${BG}`,
            boxShadow: pulse ? `0 0 4px ${ledColor}` : undefined,
            animation: pulse ? 'kfwPulse 1.8s ease-in-out infinite' : undefined,
          }}
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Your dashboard"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            width: 'min(320px, calc(100vw - 16px))',
            background: BG,
            border: `1px solid ${STRONG_BORDER}`,
            borderRadius: 10,
            boxShadow: '0 16px 40px rgba(15, 23, 42, 0.15)',
            fontFamily: SYS_FONT,
            fontSize: 13,
            color: TEXT,
            zIndex: 50,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: SUBTLE_BG,
              borderBottom: `1px solid ${BORDER}`,
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: 8,
                background: ledColor,
                flexShrink: 0,
              }}
              aria-hidden="true"
            />
            <span style={{ flex: 1, fontWeight: 600 }}>Your dashboard</span>
            <span style={{ color: DIM, fontSize: 12 }}>{ledLabel}</span>
          </div>

          {nudge && (
            <div
              style={{
                padding: '10px 14px',
                background: '#fffbeb',
                borderBottom: `1px solid ${BORDER}`,
                color: '#92400e',
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: ledColor, fontWeight: 700 }}>▸ </span>
              {nudge}
            </div>
          )}

          {rows.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {rows.map((row) => (
                <li
                  key={row.label}
                  title={row.help}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: 12,
                    padding: '10px 14px',
                    borderBottom: `1px solid ${BORDER}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: DIM, fontSize: 12, letterSpacing: '.02em' }}>
                    {row.label}
                  </span>
                  <span style={{ color: row.color, fontWeight: 700, textAlign: 'right' }}>
                    {row.value}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div style={{ padding: '16px 14px', color: TEXT_2, fontSize: 13, lineHeight: 1.5 }}>
              <p style={{ margin: 0, marginBottom: 10, fontWeight: 600 }}>Your dashboard is empty.</p>
              <p style={{ margin: 0, marginBottom: 10, color: DIM, fontSize: 12 }}>
                It lights up when you run a calculator that writes a metric. Try one:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 6 }}>
                <li>
                  <a href="/finance/runway-zero/" style={emptyLinkStyle}>Runway Zero <span style={{ color: DIM }}>→ Runway months</span></a>
                </li>
                <li>
                  <a href="/health/metabolic-floor/" style={emptyLinkStyle}>Metabolic Floor <span style={{ color: DIM }}>→ Body %</span></a>
                </li>
                <li>
                  <a href="/daily/" style={emptyLinkStyle}>Daily challenges <span style={{ color: DIM }}>→ Streak</span></a>
                </li>
              </ul>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              padding: '8px 14px',
              background: SUBTLE_BG,
              color: DIM,
              fontSize: 11,
              lineHeight: 1.4,
            }}
          >
            <span style={{ flex: 1 }}>
              Values come from calculators you ran in this browser.
            </span>
            {rows.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.confirm('Clear all stored dashboard values?')) {
                    clearDashboard();
                  }
                }}
                style={{
                  background: '#ffffff',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  borderRadius: 4,
                  padding: '3px 10px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes kfwPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}

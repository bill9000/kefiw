// KFW-ANCHOR — privacy control pinned to the bottom of every page.
//
// Three visual states:
//   bar   — first visit / pending consent. Full label across the bottom.
//   fab   — after any interaction, collapses to a small bottom-right button
//           with a clear "Privacy" label and a status dot.
//   menu  — the FAB expands into a panel with sections. Privacy first;
//           space for future sections below.
//
// Copy is plain English, not cyberpunk-technical — the old brutalist frame
// was unreadable on mobile. The [KFW] stamp remains as branding.

import { useEffect, useRef, useState } from 'react';
import {
  getConsent,
  initConsent,
  setConsent,
  type ConsentState,
  type Region,
} from '~/lib/consent';

// Light palette — matches the site's day theme.
const BG = '#ffffff';
const SUBTLE_BG = '#f8fafc';      // slate-50 — menu header tint
const BORDER = '#e2e8f0';          // slate-200
const STRONG_BORDER = '#cbd5e1';   // slate-300
const TEXT = '#0f172a';            // slate-900 primary
const TEXT_2 = '#334155';          // slate-700 secondary
const DIM = '#64748b';             // slate-500 — readable labels
const BRAND = '#2666e1';           // theme blue
const BRAND_DARK = '#1d4ed8';      // on hover
const GREEN = '#15803d';           // contextual-only is a "protective" state
const AMBER = '#b45309';           // pending — needs action
const RED = '#b91c1c';             // revoke accent

const INTERACTED_KEY = 'kfw_anchor_interacted';
const SYS_FONT =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const MONO_FONT = '"JetBrains Mono", ui-monospace, monospace';

type View = 'bar' | 'fab' | 'menu';

function hasInteracted(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(INTERACTED_KEY) === '1';
}
function markInteracted(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(INTERACTED_KEY, '1');
}

// Nuclear reset — wipes every first-party storage surface Kefiw uses:
//   - cookies (clears every name on the current document)
//   - localStorage (dashboard bridge, tool-state persistence, consent, region, etc.)
//   - sessionStorage (short-lived tab state)
// Then reloads the page so a first-visit state rebuilds cleanly.
function clearAllSiteData(): void {
  if (typeof window === 'undefined') return;
  if (!window.confirm('Clear all Kefiw cookies, saved tool inputs, and settings on this device? This cannot be undone.')) return;
  try {
    document.cookie.split(';').forEach((c) => {
      const eq = c.indexOf('=');
      const name = (eq > -1 ? c.substring(0, eq) : c).trim();
      if (!name) return;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
  } catch { /* noop */ }
  try { localStorage.clear(); } catch { /* noop */ }
  try { sessionStorage.clear(); } catch { /* noop */ }
  window.location.reload();
}

function statusLabel(state: ConsentState): string {
  if (state === 'full') return 'Personalized ads on';
  if (state === 'ltd') return 'Contextual ads only';
  return 'Action required';
}
function statusColor(state: ConsentState): string {
  if (state === 'full') return BRAND;
  if (state === 'ltd') return GREEN;
  return AMBER;
}

function ShieldIcon({ size = 14, color = TEXT }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path
        d="M8 1.5 2.5 3.5V8c0 3 2.3 5.3 5.5 6.5 3.2-1.2 5.5-3.5 5.5-6.5V3.5L8 1.5Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="m5.5 8 2 2 3-4"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ConsentAnchor(): JSX.Element | null {
  const [state, setState] = useState<ConsentState>('ltd');
  const [region, setRegion] = useState<Region>('ROW');
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<View>('bar');
  // Menu sections are collapsed by default; clicking expands them.
  // `expanded` is a record so multiple sections can be open at once.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleSection = (id: string): void =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    void initConsent().then(() => {
      const currentState = getConsent();
      const currentRegion = (window.__KFW_REGION as Region) ?? 'ROW';
      setState(currentState);
      setRegion(currentRegion);
      const pending = currentState === 'pending';
      const interacted = hasInteracted();
      setView(pending || !interacted ? 'bar' : 'fab');
      setMounted(true);
    });
    const onChange = (e: Event): void => {
      const detail = (e as CustomEvent<{ state: ConsentState }>).detail;
      if (detail?.state) setState(detail.state);
    };
    window.addEventListener('kfw:consent-change', onChange);
    return () => window.removeEventListener('kfw:consent-change', onChange);
  }, []);

  useEffect(() => {
    if (view !== 'menu') return;
    const onClick = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setView('fab');
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [view]);

  if (!mounted) return null;

  const isHardGate = region === 'EU' || region === 'UK';
  const sColor = statusColor(state);

  const applyConsent = (next: ConsentState): void => {
    setConsent(next);
    markInteracted();
    window.setTimeout(() => setView('fab'), 900);
  };

  // -------------------------------------------------------------------------
  // BAR
  // -------------------------------------------------------------------------
  if (view === 'bar') {
    return (
      <div style={barShell} role="region" aria-label="Privacy anchor">
        <ShieldIcon color={sColor} />
        <span style={stamp} aria-hidden="true">KFW</span>
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', color: TEXT, fontWeight: 600 }}>
          Privacy: <span style={{ color: sColor }}>{statusLabel(state)}</span>
        </span>
        <span style={{ color: DIM, fontSize: 11 }} className="anchor-region">{region}</span>

        {state === 'pending' && (
          <>
            <button type="button" style={btnPrimary} onClick={() => applyConsent('full')}>
              Enable personalized
            </button>
            <button type="button" style={btnSecondary} onClick={() => applyConsent('ltd')}>
              Contextual only
            </button>
          </>
        )}
        {state === 'ltd' && (
          <button type="button" style={btnPrimary} onClick={() => applyConsent('full')}>
            Enable personalized
          </button>
        )}
        {state === 'full' && (
          <button type="button" style={btnDanger} onClick={() => applyConsent('ltd')}>
            Switch back to contextual
          </button>
        )}
        {state !== 'pending' && (
          <button
            type="button"
            style={btnGhost}
            onClick={() => { markInteracted(); setView('fab'); }}
            aria-label="Hide privacy bar"
          >
            Hide
          </button>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MENU
  // -------------------------------------------------------------------------
  if (view === 'menu') {
    const helpCopy =
      state === 'full'
        ? 'You allow Google to use anonymous signals (like the page you\u2019re on) to match ads to your interests. You can switch back to contextual-only anytime.'
        : state === 'ltd'
          ? 'Kefiw shows contextual ads only. Google doesn\u2019t use personal signals to choose what you see. You can turn on personalized ads if you prefer more relevant ones.'
          : 'Please pick how ads should work on Kefiw. This choice is saved on this device and can be changed anytime.';

    return (
      <div ref={menuRef} style={menuShell} role="dialog" aria-label="Kefiw menu" aria-modal="false">
        <div style={menuHeader}>
          <span style={{ ...stamp, borderColor: STRONG_BORDER }} aria-hidden="true">KFW</span>
          <span style={{ flex: 1, fontWeight: 600, color: TEXT }}>Menu</span>
          <button type="button" style={closeBtn} onClick={() => setView('fab')} aria-label="Close menu">
            ×
          </button>
        </div>

        {/* -- Privacy -------------------------------------------------- */}
        <CollapsibleSection
          id="privacy"
          open={!!expanded.privacy}
          onToggle={() => toggleSection('privacy')}
          title="Privacy"
          icon={<ShieldIcon size={12} color={sColor} />}
          subtitle={<span style={{ color: sColor }}>{statusLabel(state)}</span>}
        >
          <div style={{ ...row, marginBottom: 6 }}>
            <span style={{ color: DIM }}>Status</span>
            <span style={{ color: sColor, fontWeight: 600 }}>{statusLabel(state)}</span>
          </div>
          <div style={row}>
            <span style={{ color: DIM }}>Region</span>
            <span style={{ color: TEXT_2 }}>
              {region}{isHardGate ? ' · hard gate' : ''}
            </span>
          </div>
          <p style={helpText}>{helpCopy}</p>
          <div style={buttonRow}>
            {state === 'pending' && (
              <>
                <button type="button" style={btnPrimary} onClick={() => applyConsent('full')}>
                  Enable personalized ads
                </button>
                <button type="button" style={btnSecondary} onClick={() => applyConsent('ltd')}>
                  Keep contextual only
                </button>
              </>
            )}
            {state === 'ltd' && (
              <button type="button" style={btnPrimary} onClick={() => applyConsent('full')}>
                Enable personalized ads
              </button>
            )}
            {state === 'full' && (
              <button type="button" style={btnDanger} onClick={() => applyConsent('ltd')}>
                Switch back to contextual
              </button>
            )}
          </div>
          <ul style={linkList}>
            <li><a href="/privacy/" style={linkStyle}>Privacy policy</a></li>
            <li><a href="/privacy/legitimate-interest/" style={linkStyle}>Legitimate interest</a></li>
            <li><a href="/device-storage-disclosure.json" style={linkStyle}>What we store on your device</a></li>
            <li>
              <a href="https://adssettings.google.com/" rel="noopener" target="_blank" style={linkStyle}>
                Google ad settings <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>

          <div style={resetBlock}>
            <div style={{ fontSize: 11, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
              Reset everything stored on this device
            </div>
            <p style={{ fontSize: 11, color: DIM, margin: '0 0 8px 0', lineHeight: 1.45 }}>
              Wipes all Kefiw cookies, saved tool inputs, dashboard values, streak history, and
              your consent choice. A fresh visit will start over.
            </p>
            <button type="button" onClick={clearAllSiteData} style={btnDangerSmall}>
              Clear all site data
            </button>
          </div>
        </CollapsibleSection>

        {/* -- Pipelines ------------------------------------------------ */}
        <CollapsibleSection
          id="pipelines"
          open={!!expanded.pipelines}
          onToggle={() => toggleSection('pipelines')}
          title="Pipelines"
          subtitle="Multi-step workflows"
        >
          <p style={helpText}>Tools where each stage\u2019s output flows into the next.</p>
          <ul style={linkList}>
            <li><a href="/health/reagent-pipeline/" style={linkStyle}>Reagent Pipeline \u2014 reconstitute → dispense → lookup</a></li>
          </ul>
        </CollapsibleSection>

        {/* -- Chains --------------------------------------------------- */}
        <CollapsibleSection
          id="chains"
          open={!!expanded.chains}
          onToggle={() => toggleSection('chains')}
          title="Chains"
          subtitle="Deterministic engine"
        >
          <p style={helpText}>Chained calculators with shared session context.</p>
          <ul style={linkList}>
            <li><a href="/chains/" style={linkStyle}>Chains hub</a></li>
            <li><a href="/chains/survival-01/" style={linkStyle}>Survival-01 \u2014 financial floor</a></li>
            <li><a href="/chains/pivot-02/" style={linkStyle}>Pivot-02 \u2014 career change</a></li>
            <li><a href="/chains/move-03/" style={linkStyle}>Move-03 \u2014 relocation math</a></li>
            <li><a href="/chains/focus-04/" style={linkStyle}>Focus-04 \u2014 attention audit</a></li>
          </ul>
        </CollapsibleSection>

        {/* -- Scenarios ------------------------------------------------ */}
        <CollapsibleSection
          id="scenarios"
          open={!!expanded.scenarios}
          onToggle={() => toggleSection('scenarios')}
          title="Scenarios"
          subtitle="Baseline · Optimized · Crisis"
        >
          <p style={helpText}>Run one decision under three assumption sets in parallel.</p>
          <ul style={linkList}>
            <li><a href="/scenarios/" style={linkStyle}>Scenarios hub</a></li>
            <li><a href="/scenarios/stress-test-triad/" style={linkStyle}>Stress-Test Triad</a></li>
            <li><a href="/comparisons/dual-career-path/" style={linkStyle}>Dual-Career Path comparison</a></li>
          </ul>
        </CollapsibleSection>

        {/* -- Explore -------------------------------------------------- */}
        <CollapsibleSection
          id="explore"
          open={!!expanded.explore}
          onToggle={() => toggleSection('explore')}
          title="Explore"
          subtitle="Hubs and suites"
          last
        >
          <ul style={{ ...linkList, borderTop: 'none', paddingTop: 0 }}>
            <li><a href="/clusters/" style={linkStyle}>All clusters</a></li>
            <li><a href="/comparisons/" style={linkStyle}>All comparisons</a></li>
            <li><a href="/finance/" style={linkStyle}>Finance suite</a></li>
            <li><a href="/daily/" style={linkStyle}>Daily challenges</a></li>
          </ul>
        </CollapsibleSection>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // FAB — just a hamburger. A small status dot keeps the privacy-state visible
  // without the "Privacy" label taking over what is now a general system menu.
  // -------------------------------------------------------------------------
  return (
    <button
      type="button"
      style={fabStyle}
      onClick={() => setView('menu')}
      aria-label={`Open menu. Privacy: ${statusLabel(state)}.`}
      aria-expanded={false}
    >
      <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 3 }} aria-hidden="true">
        <span style={{ width: 16, height: 2, background: TEXT, borderRadius: 1 }} />
        <span style={{ width: 16, height: 2, background: TEXT, borderRadius: 1 }} />
        <span style={{ width: 16, height: 2, background: TEXT, borderRadius: 1 }} />
      </span>
      <span
        style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 8,
          height: 8,
          borderRadius: 8,
          background: sColor,
          border: '1px solid #ffffff',
        }}
        aria-hidden="true"
        title={`Privacy: ${statusLabel(state)}`}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// CollapsibleSection — one-line header that expands on click.
// Keyboard-accessible: it's a real <button> with aria-expanded.
// ---------------------------------------------------------------------------
interface CollapsibleSectionProps {
  id: string;
  title: string;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  last?: boolean;
}
function CollapsibleSection({ id, title, subtitle, icon, open, onToggle, children, last }: CollapsibleSectionProps) {
  return (
    <section style={{ ...sectionStyle, ...(last ? { borderBottom: 'none' } : null) }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`kfw-section-${id}`}
        style={sectionToggleBtn}
      >
        <span style={sectionToggleInner}>
          {icon}
          <span style={sectionTitleText}>{title}</span>
          {subtitle && <span style={sectionSubtitleText}>· {subtitle}</span>}
        </span>
        <span style={{ ...chevron, transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }} aria-hidden="true">
          ▸
        </span>
      </button>
      {open && (
        <div id={`kfw-section-${id}`} style={sectionBody}>
          {children}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

// First-visit bar sits above the sticky ad banner (bottom: 0, height: 60).
const barShell: React.CSSProperties = {
  position: 'fixed',
  bottom: 60,
  left: 0,
  right: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minHeight: 44,
  padding: '8px 14px',
  background: BG,
  color: TEXT,
  borderTop: `1px solid ${BORDER}`,
  borderBottom: `1px solid ${BORDER}`,
  fontFamily: SYS_FONT,
  fontSize: 13,
  flexWrap: 'wrap',
};

// Lifted above the 60px sticky ad banner (bottom: 0, height: 60). 76px = 60 + 16px gap.
const fabStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 76,
  right: 16,
  zIndex: 9999,
  width: 44,
  height: 44,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  background: BG,
  color: TEXT,
  border: `1px solid ${STRONG_BORDER}`,
  borderRadius: 12,
  cursor: 'pointer',
  fontFamily: SYS_FONT,
  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
};

// Anchored at the FAB's position so the menu opens from where the FAB was.
const menuShell: React.CSSProperties = {
  position: 'fixed',
  bottom: 76,
  right: 16,
  zIndex: 10000,
  width: 'min(380px, calc(100vw - 32px))',
  maxHeight: 'calc(100vh - 140px)',
  overflowY: 'auto',
  background: BG,
  color: TEXT,
  border: `1px solid ${STRONG_BORDER}`,
  borderRadius: 10,
  fontFamily: SYS_FONT,
  fontSize: 13,
  boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
};

const menuHeader: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '12px 14px',
  borderBottom: `1px solid ${BORDER}`,
  background: SUBTLE_BG,
  borderRadius: '10px 10px 0 0',
};

const stamp: React.CSSProperties = {
  display: 'inline-block',
  padding: '2px 6px',
  border: `1px solid ${BORDER}`,
  borderRadius: 3,
  fontFamily: MONO_FONT,
  fontSize: 10,
  letterSpacing: '.1em',
  color: DIM,
};

const closeBtn: React.CSSProperties = {
  background: 'transparent',
  border: `1px solid ${BORDER}`,
  color: TEXT_2,
  padding: '2px 10px',
  cursor: 'pointer',
  fontFamily: SYS_FONT,
  fontSize: 16,
  lineHeight: 1,
  borderRadius: 4,
};

const sectionStyle: React.CSSProperties = {
  padding: 0,
  borderBottom: `1px solid ${BORDER}`,
};

const sectionToggleBtn: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  width: '100%',
  padding: '12px 16px',
  background: 'transparent',
  border: 'none',
  color: TEXT,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: SYS_FONT,
};

const sectionToggleInner: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const sectionTitleText: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '.12em',
  textTransform: 'uppercase',
  color: TEXT,
  fontFamily: MONO_FONT,
};

const sectionSubtitleText: React.CSSProperties = {
  fontSize: 12,
  color: DIM,
  fontFamily: SYS_FONT,
  fontWeight: 400,
};

const chevron: React.CSSProperties = {
  color: DIM,
  fontSize: 11,
  transition: 'transform 150ms ease',
  display: 'inline-block',
};

const sectionBody: React.CSSProperties = {
  padding: '0 16px 14px 16px',
};

const row: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: 12,
  padding: '2px 0',
  fontSize: 13,
};

const helpText: React.CSSProperties = {
  marginTop: 10,
  marginBottom: 0,
  color: TEXT_2,
  fontSize: 12,
  lineHeight: 1.5,
};

const buttonRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginTop: 12,
  marginBottom: 12,
};

const linkList: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  borderTop: `1px solid ${BORDER}`,
  paddingTop: 10,
};

const linkStyle: React.CSSProperties = {
  color: BRAND,
  textDecoration: 'none',
  display: 'block',
  padding: '6px 0',
  fontSize: 13,
};

const baseBtn: React.CSSProperties = {
  padding: '7px 12px',
  fontFamily: SYS_FONT,
  fontSize: 12,
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: 6,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
};

const btnPrimary: React.CSSProperties = {
  ...baseBtn,
  background: BRAND,
  color: '#ffffff',
  border: `1px solid ${BRAND}`,
};

const btnSecondary: React.CSSProperties = {
  ...baseBtn,
  background: '#ffffff',
  color: TEXT,
  border: `1px solid ${STRONG_BORDER}`,
};

const btnDanger: React.CSSProperties = {
  ...baseBtn,
  background: '#ffffff',
  color: RED,
  border: `1px solid ${RED}`,
};

const btnGhost: React.CSSProperties = {
  ...baseBtn,
  background: 'transparent',
  color: DIM,
  border: `1px solid transparent`,
  fontWeight: 500,
};

const resetBlock: React.CSSProperties = {
  marginTop: 12,
  padding: 10,
  border: `1px solid ${BORDER}`,
  borderRadius: 6,
  background: SUBTLE_BG,
};

const btnDangerSmall: React.CSSProperties = {
  ...baseBtn,
  background: '#ffffff',
  color: RED,
  border: `1px solid #fecaca`,
  fontSize: 11,
  padding: '5px 10px',
};

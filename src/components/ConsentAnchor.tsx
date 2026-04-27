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
function isDisclosurePage(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  return path === '/privacy/' || path === '/terms/' || path === '/privacy/legitimate-interest/';
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
  const [compactBar, setCompactBar] = useState(false);
  const [stickyAdVisible, setStickyAdVisible] = useState(false);
  // Single-select accordion — only one section open at a time. Clicking the
  // open section collapses it, clicking any other replaces the open one.
  const [openSection, setOpenSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleSection = (id: string): void =>
    setOpenSection((prev) => (prev === id ? null : id));
  // Back-compat shim for the section props below that still read `expanded.<id>`.
  const expanded: Record<string, boolean> = openSection ? { [openSection]: true } : {};

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
    const update = (): void => setCompactBar(window.innerWidth < 560);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (view !== 'menu') return;
    const onClick = (e: MouseEvent): void => {
      const target = e.target as Element | null;
      if (target?.closest('[data-kfw-menu-trigger="true"]')) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setView('fab');
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [view]);

  useEffect(() => {
    const onOpenMenu = (): void => setView((current) => current === 'menu' ? 'fab' : 'menu');
    const onStickyVisibility = (e: Event): void => {
      const detail = (e as CustomEvent<{ visible?: boolean }>).detail;
      setStickyAdVisible(!!detail?.visible);
    };
    window.addEventListener('kfw:open-consent-menu', onOpenMenu);
    window.addEventListener('kfw:sticky-ad-visibility', onStickyVisibility);
    return () => {
      window.removeEventListener('kfw:open-consent-menu', onOpenMenu);
      window.removeEventListener('kfw:sticky-ad-visibility', onStickyVisibility);
    };
  }, []);

  if (!mounted) return null;

  const isHardGate = region === 'EU' || region === 'UK';
  const disclosurePage = isDisclosurePage();
  const sColor = statusColor(state);

  const applyConsent = (next: ConsentState): void => {
    setConsent(next);
    markInteracted();
    window.setTimeout(() => setView('fab'), 900);
  };
  // -------------------------------------------------------------------------
  // EU/UK HARD-GATE MODAL — affirmative opt-in required (GDPR / UK GDPR).
  // Shown instead of the compact bar when state is 'pending' and region is
  // EU/UK. Both choices are equally prominent; no dismiss, no pre-check.
  // -------------------------------------------------------------------------
  if (view === 'bar' && state === 'pending' && isHardGate && !disclosurePage) {
    return (
      <>
        <div style={modalBackdrop} aria-hidden="true" />
        <div style={modalShell} role="dialog" aria-modal="true" aria-labelledby="kfw-consent-title">
          <div style={modalBadgeRow}>
            <span style={{ ...stamp, borderColor: STRONG_BORDER }} aria-hidden="true">KFW</span>
            <span style={{ color: DIM, fontSize: 11, fontFamily: MONO_FONT }}>{region}</span>
          </div>
          <h2 id="kfw-consent-title" style={modalTitle}>
            How should ads work on Kefiw?
          </h2>
          <p style={modalBody}>
            Kefiw is free because we show ads. Before any ads load, please pick how they should be
            chosen for you. You can change this from the bottom-right menu any time.
          </p>
          <div style={modalOptions}>
            <button
              type="button"
              style={{ ...modalChoiceButton, ...modalChoicePersonalized }}
              onClick={() => applyConsent('full')}
              autoFocus
            >
              <div style={modalOptionTitle}>Personalized ads</div>
              <div style={modalOptionDesc}>
                Google uses anonymous signals (pages you visit, rough location) to show ads that
                match your interests. More relevant ads, typically more revenue for the site.
              </div>
            </button>
            <button
              type="button"
              style={{ ...modalChoiceButton, ...modalChoiceContextual }}
              onClick={() => applyConsent('ltd')}
            >
              <div style={modalOptionTitle}>Contextual ads only</div>
              <div style={modalOptionDesc}>
                Ads are chosen based on the page you&rsquo;re reading right now — never your history
                or profile. Less personalization, less data shared with Google.
              </div>
            </button>
          </div>
          <p style={modalFootnote}>
            Either choice keeps the site fully usable. No account needed. See our{' '}
            <a href="/privacy/" style={{ color: BRAND, textDecoration: 'underline' }}>
              privacy page
            </a>{' '}
            for details.
          </p>
        </div>
      </>
    );
  }

  // -------------------------------------------------------------------------
  // BAR
  // -------------------------------------------------------------------------
  if (view === 'bar') {
    return (
      <div
        style={{ ...barShell, ...(compactBar ? compactBarShell : null), ...(state !== 'pending' ? dismissibleBarShell : null) }}
        role="region"
        aria-label="Privacy anchor"
        onClick={() => {
          if (state === 'pending') return;
          markInteracted();
          setView('fab');
        }}
      >
        <div style={{ ...barStatusRow, ...(compactBar ? compactBarStatusRow : null) }}>
          <ShieldIcon color={sColor} />
          <span style={stamp} aria-hidden="true">KFW</span>
          <span style={barStatusText}>
            Privacy: <span style={{ color: sColor }}>{statusLabel(state)}</span>
          </span>
          <span style={{ color: DIM, fontSize: 11, flexShrink: 0 }} className="anchor-region">{region}</span>
        </div>

        <div style={{ ...barActionRow, ...(compactBar ? compactBarActionRow : null) }}>
          {state === 'pending' && (
            <>
              <button type="button" style={{ ...btnPrimary, ...(compactBar ? compactBarButton : null) }} onClick={(e) => { e.stopPropagation(); applyConsent('full'); }}>
                Enable personalized
              </button>
              <button type="button" style={{ ...btnSecondary, ...(compactBar ? compactBarButton : null) }} onClick={(e) => { e.stopPropagation(); applyConsent('ltd'); }}>
                Contextual only
              </button>
            </>
          )}
          {state !== 'pending' && (
            <span style={barMenuHint}>
              Change from the menu →
            </span>
          )}
          {state !== 'pending' && (
            <button
              type="button"
              style={barMenuButton}
              data-kfw-menu-trigger="true"
              onClick={(e) => {
                e.stopPropagation();
                setView((current) => current === 'menu' ? 'fab' : 'menu');
              }}
              aria-label={`Open menu. Privacy: ${statusLabel(state)}.`}
              aria-expanded={false}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 21,
                  lineHeight: 1,
                  transform: 'translateY(-1px)',
                }}
                aria-hidden="true"
              >
                🍔
              </span>
              <span
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
                  width: 8,
                  height: 8,
                  borderRadius: 8,
                  background: sColor,
                  border: '1px solid #ffffff',
                }}
                aria-hidden="true"
              />
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // MENU
  // -------------------------------------------------------------------------
  if (view === 'menu') {
    const helpCopy =
      state === 'full'
        ? 'You allow Google to use anonymous signals (like the page you\u2019re on) to match ads to your interests. You can use contextual-only ads anytime.'
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
                Use contextual ads only
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

        {/* -- Buyer-intent navigation ---------------------------------- */}
        <CollapsibleSection
          id="property"
          open={!!expanded.property}
          onToggle={() => toggleSection('property')}
          title="Property"
          subtitle="Improve · buy/sell · own"
        >
          <p style={helpText}>Owning, improving, buying, selling, investing, and insuring property.</p>
          <ul style={linkList}>
            <li><a href="/property/" style={linkStyle}>Property Lab</a></li>
            <li><a href="/homelab/" style={linkStyle}>Improve</a></li>
            <li><a href="/property/" style={linkStyle}>Estimate</a></li>
            <li><a href="/property/#sell" style={linkStyle}>Buy/Sell</a></li>
            <li><a href="/property/#own" style={linkStyle}>Own</a></li>
            <li><a href="/property/#invest" style={linkStyle}>Invest</a></li>
            <li><a href="/homelab/roof-insurance-deductible-calculator/" style={linkStyle}>Insure</a></li>
            <li><a href="/tracks/#property-tracks" style={linkStyle}>Property Tracks</a></li>
            <li><a href="/property/" style={linkStyle}>Property Guides</a></li>
            <li><a href="/property/#browse-by-state" style={linkStyle}>Browse by State</a></li>
            <li><a href="/property/#browse-by-city" style={linkStyle}>Browse by City</a></li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection
          id="business"
          open={!!expanded.business}
          onToggle={() => toggleSection('business')}
          title="Business"
          subtitle="Tax · pricing · hiring"
        >
          <p style={helpText}>Self-employed tax, pricing, hiring, revenue, and cloud cost calculators.</p>
          <ul style={linkList}>
            <li><a href="/business/" style={linkStyle}>Business Lab</a></li>
            <li><a href="/business/#tax" style={linkStyle}>Tax</a></li>
            <li><a href="/business/#pricing" style={linkStyle}>Pricing</a></li>
            <li><a href="/business/#hiring" style={linkStyle}>Hiring</a></li>
            <li><a href="/business/#revenue" style={linkStyle}>Revenue</a></li>
            <li><a href="/business/#cloud" style={linkStyle}>Cloud</a></li>
            <li><a href="/tracks/#business-tracks" style={linkStyle}>Business Tracks</a></li>
            <li><a href="/business/" style={linkStyle}>Business Guides</a></li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection
          id="care"
          open={!!expanded.care}
          onToggle={() => toggleSection('care')}
          title="Care"
          subtitle="Senior care · caregiving"
        >
          <p style={helpText}>Care-cost planning, Medicare, insurance, and wellbeing tools with nurse-review boundaries.</p>
          <ul style={linkList}>
            <li><a href="/care/" style={linkStyle}>Care Lab</a></li>
            <li><a href="/care/#senior-care" style={linkStyle}>Senior Care</a></li>
            <li><a href="/care/#caregiving" style={linkStyle}>Caregiving</a></li>
            <li><a href="/care/#medicare" style={linkStyle}>Medicare</a></li>
            <li><a href="/care/#insurance" style={linkStyle}>Insurance</a></li>
            <li><a href="/health/" style={linkStyle}>Wellbeing</a></li>
            <li><a href="/tracks/#care-tracks" style={linkStyle}>Care Tracks</a></li>
            <li><a href="/care/" style={linkStyle}>Care Guides</a></li>
            <li><a href="/health/" style={linkStyle}>Health Calculators</a></li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection
          id="tracks"
          open={!!expanded.tracks}
          onToggle={() => toggleSection('tracks')}
          title="Tracks"
          subtitle="Guided plans"
        >
          <p style={helpText}>Goal → calculators → checklist → guide → comparison → next-step recommendation.</p>
          <ul style={linkList}>
            <li><a href="/tracks/" style={linkStyle}>All Tracks</a></li>
            <li><a href="/tracks/#property-tracks" style={linkStyle}>Property Tracks</a></li>
            <li><a href="/tracks/#business-tracks" style={linkStyle}>Business Tracks</a></li>
            <li><a href="/tracks/#care-tracks" style={linkStyle}>Care Tracks</a></li>
            <li><a href="/tracks/#daily-tracks" style={linkStyle}>Daily Tracks</a></li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection
          id="tools"
          open={!!expanded.tools}
          onToggle={() => toggleSection('tools')}
          title="Tools"
          subtitle="All utility indexes"
        >
          <ul style={linkList}>
            <li><a href="/calculators/" style={linkStyle}>All Tools</a></li>
            <li><a href="/calculators/" style={linkStyle}>All Calculators</a></li>
            <li><a href="/property/" style={linkStyle}>Property Calculators</a></li>
            <li><a href="/business/" style={linkStyle}>Business Calculators</a></li>
            <li><a href="/care/" style={linkStyle}>Care Calculators</a></li>
            <li><a href="/finance/" style={linkStyle}>Finance Calculators</a></li>
            <li><a href="/health/" style={linkStyle}>Health Calculators</a></li>
            <li><a href="/word-tools/" style={linkStyle}>Word Tools</a></li>
            <li><a href="/converters/" style={linkStyle}>Converters</a></li>
            <li><a href="/logic/" style={linkStyle}>Math &amp; Logic</a></li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection
          id="play"
          open={!!expanded.play}
          onToggle={() => toggleSection('play')}
          title="Play"
          subtitle="Daily · Vibe · Sudoku"
        >
          <ul style={linkList}>
            <li><a href="/daily/" style={linkStyle}>Daily Challenges</a></li>
            <li><a href="/games/daily-word/" style={linkStyle}>Word Games</a></li>
            <li><a href="/games/sudoku/" style={linkStyle}>Sudoku</a></li>
            <li><a href="/logic/" style={linkStyle}>Logic Games</a></li>
            <li><a href="/games/vibecircuit/" style={linkStyle}>VibeCircuit</a></li>
            <li><a href="/games/vibematch/" style={linkStyle}>VibeMatch</a></li>
            <li><a href="/games/vibecrypt/" style={linkStyle}>VibeCrypt</a></li>
            <li><a href="/games/" style={linkStyle}>All Games</a></li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection
          id="guides"
          open={!!expanded.guides}
          onToggle={() => toggleSection('guides')}
          title="Guides"
          subtitle="Editorial + trust"
          last
        >
          <ul style={linkList}>
            <li><a href="/guides/" style={linkStyle}>All Guides</a></li>
            <li><a href="/property/" style={linkStyle}>Property Guides</a></li>
            <li><a href="/business/" style={linkStyle}>Business Guides</a></li>
            <li><a href="/care/" style={linkStyle}>Care Guides</a></li>
            <li><a href="/health/" style={linkStyle}>Health Guides</a></li>
            <li><a href="/guides/" style={linkStyle}>Game Guides</a></li>
            <li><a href="/about-the-reviewers/" style={linkStyle}>Review Board</a></li>
            <li><a href="/methodology/" style={linkStyle}>Calculator Methodology</a></li>
            <li><a href="/sources/" style={linkStyle}>Data Sources</a></li>
            <li><a href="/editorial-policy/" style={linkStyle}>Editorial Policy</a></li>
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
    stickyAdVisible ? null :
    <button
      type="button"
      style={fabStyle}
      data-kfw-menu-trigger="true"
      onClick={() => setView('menu')}
      aria-label={`Open menu. Privacy: ${statusLabel(state)}.`}
      aria-expanded={false}
    >
      <span
        style={{
          width: 28,
          height: 28,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 23,
          lineHeight: 1,
          transform: 'translateY(-1px)',
        }}
        aria-hidden="true"
      >
        🍔
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
};

const compactBarShell: React.CSSProperties = {
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 6,
  padding: '8px 10px',
};

const dismissibleBarShell: React.CSSProperties = {
  cursor: 'pointer',
};

const barStatusRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flex: '1 1 260px',
  minWidth: 0,
};

const compactBarStatusRow: React.CSSProperties = {
  flex: '1 1 100%',
  width: '100%',
};

const barStatusText: React.CSSProperties = {
  flex: 1,
  minWidth: 140,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: TEXT,
  fontWeight: 600,
};

const barActionRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 8,
  flexWrap: 'wrap',
};

const compactBarActionRow: React.CSSProperties = {
  justifyContent: 'flex-end',
  width: '100%',
};

const compactBarButton: React.CSSProperties = {
  flex: '1 1 auto',
};

const barMenuHint: React.CSSProperties = {
  color: TEXT_2,
  fontSize: 12,
  fontWeight: 600,
};

const barMenuButton: React.CSSProperties = {
  position: 'relative',
  width: 40,
  height: 36,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  background: BG,
  color: TEXT,
  border: `1px solid ${STRONG_BORDER}`,
  borderRadius: 8,
  cursor: 'pointer',
  fontFamily: SYS_FONT,
  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.10)',
  flex: '0 0 auto',
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

// ---------------------------------------------------------------------------
// EU/UK hard-gate modal — GDPR / UK GDPR affirmative opt-in.
// ~40vh prominent overlay; both buttons equal size/weight; no dismiss.
// ---------------------------------------------------------------------------

const modalBackdrop: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.55)',
  zIndex: 10000,
};

const modalShell: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10001,
  width: 'min(92vw, 560px)',
  minHeight: '40vh',
  maxHeight: '85vh',
  overflowY: 'auto',
  background: BG,
  color: TEXT,
  border: `1px solid ${STRONG_BORDER}`,
  borderRadius: 12,
  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.35)',
  padding: '22px 24px',
  fontFamily: SYS_FONT,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const modalBadgeRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
};

const modalTitle: React.CSSProperties = {
  margin: 0,
  fontSize: 20,
  fontWeight: 700,
  color: TEXT,
  lineHeight: 1.25,
};

const modalBody: React.CSSProperties = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.55,
  color: TEXT_2,
};

const modalOptions: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 10,
};

const modalChoiceButton: React.CSSProperties = {
  padding: 12,
  borderRadius: 8,
  background: '#ffffff',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: SYS_FONT,
  minHeight: 132,
};

const modalChoicePersonalized: React.CSSProperties = {
  border: '1px solid #86efac',
  boxShadow: 'inset 4px 0 0 #16a34a',
};

const modalChoiceContextual: React.CSSProperties = {
  border: '1px solid #fecaca',
  boxShadow: 'inset 4px 0 0 #dc2626',
};

const modalOptionTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: TEXT,
  marginBottom: 4,
};

const modalOptionDesc: React.CSSProperties = {
  fontSize: 12.5,
  lineHeight: 1.5,
  color: TEXT_2,
};

const modalFootnote: React.CSSProperties = {
  margin: 0,
  fontSize: 12,
  lineHeight: 1.5,
  color: DIM,
};

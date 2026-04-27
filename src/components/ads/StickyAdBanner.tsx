// StickyAdBanner — fixed-bottom anchor banner with a close X.
//
// - Sits 36px above the ConsentAnchor (which is at bottom: 0, height: 36)
// - Shows on every cluster, including /health/* (LTD mode forces
//   requestNonPersonalizedAds=1 there)
// - Close button stores a dismiss timestamp; banner re-appears after 60s
// - Ad consent is delegated to Google's CMP (AdSense Privacy & Messaging);
//   our first-party consent state only governs LTD vs FULL personalization.
// - Emits: ad_request, impression, viewable, fill, unfill, click, ad_close

import { useEffect, useRef, useState } from 'react';
import { track } from '~/lib/telemetry';
import { getConsent } from '~/lib/consent';
import { resolveCluster } from '~/lib/risk-tier';
import SystemTray from '~/components/SystemTray';

const PUBLISHER_ID = (import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID as string | undefined) ?? '';
const SLOT_ID = (import.meta.env.PUBLIC_ADSENSE_STICKY_SLOT as string | undefined) ?? '';
const DISMISS_KEY = 'kfw_sticky_closed_at';
const DISMISS_MS = 60_000;
const BANNER_HEIGHT = 60;
// Sticky now sits at the true bottom — the KFW anchor is a corner FAB, not
// a full-width bar, so there's no horizontal row to clear.
const ANCHOR_OFFSET = 0;

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      push?: (opts: Record<string, unknown>) => void;
      requestNonPersonalizedAds?: 0 | 1;
    };
    __KFW_STICKY_AD_VISIBLE?: boolean;
  }
}

function dismissedRecently(): boolean {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < DISMISS_MS;
  } catch {
    return false;
  }
}

function remainingMs(): number {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return 0;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return 0;
    const left = DISMISS_MS - (Date.now() - ts);
    return left > 0 ? left : 0;
  } catch {
    return 0;
  }
}

export default function StickyAdBanner(): JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [state, setState] = useState<'loading' | 'filled' | 'unfilled'>('loading');
  const insRef = useRef<HTMLModElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const viewableFiredRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (dismissedRecently()) {
      setVisible(false);
      const timeout = setTimeout(() => setVisible(true), remainingMs());
      return () => clearTimeout(timeout);
    }
  }, []);

  const consent = typeof window !== 'undefined' ? getConsent() : 'ltd';
  const routeLtd = typeof window !== 'undefined' ? resolveCluster(window.location.pathname).risk_tier === 'ltd' : false;
  const ltd = routeLtd || consent !== 'full';
  const devMode = !PUBLISHER_ID || !SLOT_ID;
  const bannerRendered = mounted && visible && !(state === 'unfilled' && !devMode);

  useEffect(() => {
    window.__KFW_STICKY_AD_VISIBLE = bannerRendered;
    window.dispatchEvent(new CustomEvent('kfw:sticky-ad-visibility', { detail: { visible: bannerRendered } }));
    return () => {
      window.__KFW_STICKY_AD_VISIBLE = false;
      window.dispatchEvent(new CustomEvent('kfw:sticky-ad-visibility', { detail: { visible: false } }));
    };
  }, [bannerRendered]);

  useEffect(() => {
    if (!mounted || !visible || devMode || typeof window === 'undefined') return;

    if (ltd && window.adsbygoogle) {
      window.adsbygoogle.requestNonPersonalizedAds = 1;
    }

    try {
      const ads = (window.adsbygoogle ?? []) as NonNullable<Window['adsbygoogle']>;
      window.adsbygoogle = ads;
      ads.push({} as Record<string, unknown>);
      track({ event_type: 'ad_request', zone_id: 'STICKY' });
    } catch {
      /* AdSense script not ready */
    }

    const ins = insRef.current;
    if (!ins) return;
    const fillCheck = setInterval(() => {
      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled') {
        setState('filled');
        track({ event_type: 'fill', zone_id: 'STICKY' });
        clearInterval(fillCheck);
      } else if (status === 'unfilled') {
        setState('unfilled');
        track({ event_type: 'unfill', zone_id: 'STICKY' });
        clearInterval(fillCheck);
      }
    }, 500);
    return () => clearInterval(fillCheck);
  }, [mounted, visible, devMode, ltd]);

  useEffect(() => {
    if (state !== 'filled' || viewableFiredRef.current) return;
    const shell = shellRef.current;
    if (!shell) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.6) {
            track({ event_type: 'impression', zone_id: 'STICKY' });
            setTimeout(() => {
              if (viewableFiredRef.current) return;
              viewableFiredRef.current = true;
              track({ event_type: 'viewable', zone_id: 'STICKY' });
            }, 30_000);
          }
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(shell);
    return () => observer.disconnect();
  }, [state]);

  if (!mounted || !visible) return null;
  if (state === 'unfilled' && !devMode) return null;

  const close = (): void => {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    track({ event_type: 'ad_close', zone_id: 'STICKY' });
    setVisible(false);
    setTimeout(() => setVisible(true), DISMISS_MS);
  };

  const shell: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: ANCHOR_OFFSET,
    zIndex: 9998,
    height: BANNER_HEIGHT,
    background: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1fr) 40px',
    boxShadow: '0 -2px 8px rgba(15, 23, 42, 0.06)',
  };

  const adPane: React.CSSProperties = {
    position: 'relative',
    minWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const controlRail: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    borderLeft: '1px solid #e2e8f0',
    background: '#f8fafc',
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 4,
    left: 8,
    fontSize: 9,
    color: '#94a3b8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    pointerEvents: 'none',
    zIndex: 1,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const closeBtn: React.CSSProperties = {
    // Floats above the banner's top-right corner so it isn't cramped against
    // the ad content. Use a circle with a soft shadow so it reads as a chip.
    position: 'absolute',
    top: -12,
    right: 6,
    width: 28,
    height: 28,
    padding: 0,
    lineHeight: 1,
    background: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    cursor: 'pointer',
    fontSize: 16,
    zIndex: 3,
    borderRadius: 999,
    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
  };

  const menuBtn: React.CSSProperties = {
    position: 'relative',
    width: 28,
    height: 28,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    background: '#ffffff',
    color: '#0f172a',
    border: '1px solid #cbd5e1',
    borderRadius: 6,
    cursor: 'pointer',
    boxShadow: '0 1px 4px rgba(15, 23, 42, 0.10)',
  };

  const devPlaceholder: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: 12,
    letterSpacing: '0.02em',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  return (
    <div ref={shellRef} style={shell} data-kfw-zone="STICKY" role="complementary" aria-label="Sticky advertisement">
      <div style={adPane}>
        <div style={labelStyle}>Advertisement</div>
        <button type="button" style={closeBtn} onClick={close} aria-label="Close advertisement">×</button>

        {devMode ? (
          <div style={devPlaceholder}>
            Ad placeholder · sticky · {BANNER_HEIGHT}px · {ltd ? 'contextual' : 'personalized'}
          </div>
        ) : (
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              height: BANNER_HEIGHT,
              visibility: state === 'filled' ? 'visible' : 'hidden',
            }}
            data-ad-client={PUBLISHER_ID}
            data-ad-slot={SLOT_ID}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        )}
      </div>
      <div style={controlRail} aria-label="Site controls">
        <SystemTray compact placement="above-right" />
        <button
          type="button"
          style={menuBtn}
          onClick={() => window.dispatchEvent(new CustomEvent('kfw:open-consent-menu'))}
          data-kfw-menu-trigger="true"
          aria-label="Open menu"
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
        </button>
      </div>
    </div>
  );
}

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

const PUBLISHER_ID = (import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID as string | undefined) ?? '';
const SLOT_ID = (import.meta.env.PUBLIC_ADSENSE_STICKY_SLOT as string | undefined) ?? '';
const DISMISS_KEY = 'kfw_sticky_closed_at';
const DISMISS_MS = 60_000;
const BANNER_HEIGHT = 60;
const ANCHOR_OFFSET = 36;

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      push?: (opts: Record<string, unknown>) => void;
      requestNonPersonalizedAds?: 0 | 1;
    };
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

  useEffect(() => {
    if (!mounted || !visible || devMode || typeof window === 'undefined') return;

    if (ltd && window.adsbygoogle) {
      window.adsbygoogle.requestNonPersonalizedAds = 1;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
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
    background: '#09090b',
    borderTop: '1px solid #27272a',
    borderBottom: '1px solid #27272a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 2,
    left: 6,
    fontSize: 9,
    color: '#64748b',
    letterSpacing: '0.08em',
    pointerEvents: 'none',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    zIndex: 1,
  };

  const closeBtn: React.CSSProperties = {
    position: 'absolute',
    top: -10,
    right: -6,
    width: 22,
    height: 22,
    padding: 0,
    lineHeight: 1,
    background: 'transparent',
    color: '#94a3b8',
    border: '1px solid #27272a',
    cursor: 'pointer',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    fontSize: 13,
    zIndex: 2,
    borderRadius: 2,
  };

  const devText: React.CSSProperties = {
    color: '#475569',
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  };

  return (
    <div ref={shellRef} style={shell} data-kfw-zone="STICKY" role="complementary" aria-label="Sticky advertisement">
      <div style={labelStyle}>[COMMERCIAL_DATA_FEED // KFW-ZONE-STICKY]</div>
      <button type="button" style={closeBtn} onClick={close} aria-label="Close advertisement">×</button>

      {devMode ? (
        <div style={devText}>[ DEV // {ltd ? 'LTD_MODE' : 'FULL_MODE'} // STICKY {BANNER_HEIGHT}px ]</div>
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
  );
}

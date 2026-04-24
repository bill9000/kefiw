// AdSlot — unified ad shell + serving logic (Neutral Cut spec).
//
// Contract (#177 CLS-proof + #168 AdProvider/HealthAdProvider):
//   - Fixed min-height per format — zero CLS
//   - 1px solid #27272a border, JetBrains Mono labels
//   - Route-based LTD mode: any /health/reagent-* path forces
//     requestNonPersonalizedAds=1 before first push
//   - 30s refresh floor (global)
//   - Viewability gate (60% for 30s) — only then refresh
//   - Fill / unfill → labeled shell state, ZincPlaceholder on unfill in LTD
//   - Emits telemetry: ad_request, impression, viewable, fill, unfill, click
//   - If no PUBLIC_ADSENSE_PUBLISHER_ID set, renders dev placeholder only

import { useEffect, useRef, useState } from 'react';
import { track } from '~/lib/telemetry';
import { getConsent } from '~/lib/consent';
import { resolveCluster } from '~/lib/risk-tier';
import FerrariCard from './FerrariCard';

type ZoneId = 'ALPHA' | 'GAMMA' | 'EPSILON' | 'ZETA' | 'DELTA';

interface Props {
  zoneId: ZoneId;
  slotId?: string;
  format?: 'auto' | 'rectangle' | 'banner' | 'multiplex';
  minHeight?: number;
  className?: string;
}

const PUBLISHER_ID = (import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID as string | undefined) ?? '';
const REFRESH_FLOOR_MS = 30_000;

const DEFAULT_MIN_HEIGHT: Record<ZoneId, number> = {
  ALPHA: 90,
  GAMMA: 50,
  EPSILON: 250,
  ZETA: 50,
  DELTA: 400,
};

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      push?: (opts: Record<string, unknown>) => void;
      requestNonPersonalizedAds?: 0 | 1;
    };
  }
}

function isLtdRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return resolveCluster(window.location.pathname).risk_tier === 'ltd';
}

export default function AdSlot({
  zoneId,
  slotId,
  format = 'auto',
  minHeight,
  className,
}: Props): JSX.Element {
  const [state, setState] = useState<'loading' | 'filled' | 'unfilled'>('loading');
  const [dismissedUntil, setDismissedUntil] = useState<number>(0);
  const [now, setNow] = useState<number>(() => Date.now());
  const dismissed = dismissedUntil > now;
  const secondsLeft = dismissed ? Math.ceil((dismissedUntil - now) / 1000) : 0;
  const lastRefreshRef = useRef<number>(0);
  const viewableFiredRef = useRef<boolean>(false);
  const insRef = useRef<HTMLModElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const height = minHeight ?? DEFAULT_MIN_HEIGHT[zoneId];
  const routeLtd = typeof window !== 'undefined' ? isLtdRoute() : false;
  const consent = typeof window !== 'undefined' ? getConsent() : 'ltd';
  const ltd = routeLtd || consent !== 'full';
  const devMode = !PUBLISHER_ID || !slotId;

  useEffect(() => {
    if (devMode || typeof window === 'undefined') return;

    if (ltd && window.adsbygoogle) {
      window.adsbygoogle.requestNonPersonalizedAds = 1;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      track({ event_type: 'ad_request', zone_id: zoneId });
      lastRefreshRef.current = Date.now();
    } catch {
      /* ignore — AdSense script not loaded yet */
    }

    const ins = insRef.current;
    if (!ins) return;

    const fillCheck = setInterval(() => {
      const status = ins.getAttribute('data-ad-status');
      if (status === 'filled') {
        setState('filled');
        track({ event_type: 'fill', zone_id: zoneId });
        clearInterval(fillCheck);
      } else if (status === 'unfilled') {
        setState('unfilled');
        track({ event_type: 'unfill', zone_id: zoneId });
        clearInterval(fillCheck);
      }
    }, 500);

    return () => clearInterval(fillCheck);
  }, [zoneId, devMode, ltd]);

  useEffect(() => {
    if (state !== 'filled' || viewableFiredRef.current) return;
    const shell = shellRef.current;
    if (!shell) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.6) {
            track({ event_type: 'impression', zone_id: zoneId });
            setTimeout(() => {
              if (viewableFiredRef.current) return;
              viewableFiredRef.current = true;
              track({ event_type: 'viewable', zone_id: zoneId });
            }, 30_000);
          }
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    observer.observe(shell);
    return () => observer.disconnect();
  }, [state, zoneId]);

  // Light-theme shell matching the sticky banner. Also breaks out of the page
  // container so each ad spans the full viewport width — the `width: 100vw`
  // + margin-left/right trick works regardless of the parent's padding.
  const shellStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: height,
    background: '#ffffff',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',
  };

  const closeBtnStyle: React.CSSProperties = {
    // Circle chip floating outside the banner's top-right corner — matches the
    // sticky banner close button.
    position: 'absolute',
    top: -12,
    right: 4,
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

  const close = (): void => {
    track({ event_type: 'ad_close', zone_id: zoneId });
    setDismissedUntil(Date.now() + REFRESH_FLOOR_MS);
  };

  useEffect(() => {
    if (!dismissed) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [dismissed]);

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 6,
    left: 12,
    fontSize: 10,
    color: '#94a3b8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    pointerEvents: 'none',
    zIndex: 1,
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  };

  const stateTextStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: 12,
    letterSpacing: '0.02em',
  };

  const dismissedStyle: React.CSSProperties = {
    position: 'relative',
    height: 24,
    background: '#f8fafc',
    borderTop: '1px solid #e2e8f0',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 11,
    color: '#94a3b8',
    width: '100vw',
    marginLeft: 'calc(50% - 50vw)',
    marginRight: 'calc(50% - 50vw)',
  };

  if (dismissed) {
    return (
      <div
        className={className}
        data-kfw-zone={zoneId}
        data-dismissed="true"
        style={dismissedStyle}
      >
        Advertisement returns in {secondsLeft}s
      </div>
    );
  }

  if (devMode) {
    return (
      <div ref={shellRef} style={shellStyle} className={className} data-kfw-zone={zoneId}>
        <div style={labelStyle}>Advertisement</div>
        <button type="button" style={closeBtnStyle} onClick={close} aria-label="Close advertisement">×</button>
        <div style={stateTextStyle}>
          Ad placeholder · {height}px · {ltd ? 'contextual' : 'personalized'}
        </div>
      </div>
    );
  }

  return (
    <div ref={shellRef} style={shellStyle} className={className} data-kfw-zone={zoneId}>
      <div style={labelStyle}>Advertisement</div>
      <button type="button" style={closeBtnStyle} onClick={close} aria-label="Close advertisement">×</button>

      {state === 'loading' && (
        <div style={stateTextStyle}>Loading…</div>
      )}

      {state === 'unfilled' && ltd && (
        <div style={stateTextStyle}>No ad available</div>
      )}

      {state === 'unfilled' && !ltd && (
        <FerrariCard zoneId={zoneId} minHeight={height} />
      )}

      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: height,
          visibility: state === 'filled' ? 'visible' : 'hidden',
        }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

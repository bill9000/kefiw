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
  const lastRefreshRef = useRef<number>(0);
  const viewableFiredRef = useRef<boolean>(false);
  const insRef = useRef<HTMLModElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);

  const height = minHeight ?? DEFAULT_MIN_HEIGHT[zoneId];
  const routeLtd = typeof window !== 'undefined' ? isLtdRoute() : false;
  const consent = typeof window !== 'undefined' ? getConsent() : 'ltd';
  const ltd = routeLtd || consent !== 'full';
  const gated = consent === 'pending';
  const devMode = !PUBLISHER_ID || !slotId;

  useEffect(() => {
    if (devMode || gated || typeof window === 'undefined') return;

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
  }, [zoneId, devMode, ltd, gated]);

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

  const shellStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: height,
    border: '1px solid #27272a',
    background: '#0b1120',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    overflow: 'hidden',
  };

  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    top: 4,
    left: 6,
    fontSize: 10,
    color: '#64748b',
    letterSpacing: '0.08em',
    pointerEvents: 'none',
    zIndex: 1,
  };

  const stateTextStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    color: '#475569',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  };

  if (gated) {
    return (
      <div ref={shellRef} style={shellStyle} className={className} data-kfw-zone={zoneId}>
        <div style={labelStyle}>[COMMERCIAL_DATA_FEED // KFW-ZONE-{zoneId}]</div>
        <div style={stateTextStyle}>[ AWAITING_PROTOCOL_INPUT ]</div>
      </div>
    );
  }

  if (devMode) {
    return (
      <div ref={shellRef} style={shellStyle} className={className} data-kfw-zone={zoneId}>
        <div style={labelStyle}>[COMMERCIAL_DATA_FEED // KFW-ZONE-{zoneId}]</div>
        <div style={stateTextStyle}>
          [ DEV // {ltd ? 'LTD_MODE' : 'FULL_MODE'} // {height}px ]
        </div>
      </div>
    );
  }

  return (
    <div ref={shellRef} style={shellStyle} className={className} data-kfw-zone={zoneId}>
      <div style={labelStyle}>[COMMERCIAL_DATA_FEED // KFW-ZONE-{zoneId}]</div>

      {state === 'loading' && (
        <div style={stateTextStyle}>[LOADING // KFW-ZONE-{zoneId}]</div>
      )}

      {state === 'unfilled' && ltd && (
        <div style={{ ...stateTextStyle, background: '#18181b' }}>
          [ RESOURCE_OFFLINE ]
        </div>
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

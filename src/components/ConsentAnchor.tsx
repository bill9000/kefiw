// Persistent Telemetry Bar — System Tray Consent Anchor (spec #171).
//
// Fixed-bottom, z-index 9999, zinc bg, JetBrains Mono.
// Default state: [PRIVACY_PROTOCOL: CONTEXTUAL_ONLY // TARGETING: DISABLED]
// Cyan CTA [ENABLE_FULL_PROTOCOL] flips session LTD → Full.
// Hard-gate regions (EU/UK) require explicit pick before any ads fill.

import { useEffect, useState } from 'react';
import {
  getConsent,
  initConsent,
  setConsent,
  type ConsentState,
  type Region,
} from '~/lib/consent';

const BG = '#09090b';
const BORDER = '#27272a';
const TEXT = '#e2e8f0';
const DIM = '#64748b';
const CYAN = '#22d3ee';
const GOLD = '#facc15';
const MAGENTA = '#f472b6';

export default function ConsentAnchor(): JSX.Element | null {
  const [state, setState] = useState<ConsentState>('ltd');
  const [region, setRegion] = useState<Region>('ROW');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    void initConsent().then(() => {
      setState(getConsent());
      setRegion((window.__KFW_REGION as Region) ?? 'ROW');
      setMounted(true);
    });

    const onChange = (e: Event): void => {
      const detail = (e as CustomEvent<{ state: ConsentState }>).detail;
      if (detail?.state) setState(detail.state);
    };
    window.addEventListener('kfw:consent-change', onChange);
    return () => window.removeEventListener('kfw:consent-change', onChange);
  }, []);

  if (!mounted) return null;

  const isHardGate = region === 'EU' || region === 'UK';
  const statusText =
    state === 'full'
      ? '[PRIVACY_PROTOCOL: FULL // TARGETING: ENABLED]'
      : state === 'ltd'
        ? '[PRIVACY_PROTOCOL: CONTEXTUAL_ONLY // TARGETING: DISABLED]'
        : '[PRIVACY_PROTOCOL: PENDING // AWAITING_OPERATOR_INPUT]';
  const statusColor = state === 'full' ? CYAN : state === 'ltd' ? DIM : GOLD;

  return (
    <div style={shell} role="region" aria-label="Privacy protocol anchor">
      <span style={{ color: DIM }}>[KFW-ANCHOR]</span>
      <span style={{ color: statusColor, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {statusText}
      </span>
      <span style={{ color: DIM, fontSize: 10 }}>{region}</span>

      {state === 'pending' && (
        <>
          <button
            type="button"
            style={btn(CYAN)}
            onClick={() => setConsent('full')}
          >
            [ENABLE_FULL_PROTOCOL]
          </button>
          <button
            type="button"
            style={btn(GOLD)}
            onClick={() => setConsent('ltd')}
          >
            [CONTEXTUAL_ONLY]
          </button>
        </>
      )}

      {state === 'ltd' && !isHardGate && (
        <button
          type="button"
          style={btn(CYAN)}
          onClick={() => setConsent('full')}
        >
          [ENABLE_FULL_PROTOCOL]
        </button>
      )}

      {state === 'ltd' && isHardGate && (
        <button
          type="button"
          style={btn(CYAN)}
          onClick={() => setConsent('full')}
        >
          [UPGRADE_TO_FULL]
        </button>
      )}

      {state === 'full' && (
        <button
          type="button"
          style={btn(MAGENTA)}
          onClick={() => setConsent('ltd')}
        >
          [REVOKE]
        </button>
      )}
    </div>
  );
}

const shell: React.CSSProperties = {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  height: 36,
  padding: '0 16px',
  background: BG,
  color: TEXT,
  borderTop: `1px solid ${BORDER}`,
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  fontSize: 11,
  letterSpacing: '.04em',
  whiteSpace: 'nowrap',
};

function btn(color: string): React.CSSProperties {
  return {
    background: 'transparent',
    border: `1px solid ${color}`,
    color,
    padding: '4px 10px',
    fontFamily: 'inherit',
    fontSize: 10,
    letterSpacing: '.08em',
    cursor: 'pointer',
    textTransform: 'uppercase',
  };
}

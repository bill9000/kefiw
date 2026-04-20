// Ferrari Card — first-party lead magnet shown when AdSense returns unfilled.
// Wired into AdSlot's unfill branch (#175/#176).
// Full signup form / API wiring lives in #176; this is the visual collapse.

import { track } from '~/lib/telemetry';

interface Props {
  zoneId: string;
  minHeight: number;
  cta?: string;
  headline?: string;
  href?: string;
}

export default function FerrariCard({
  zoneId,
  minHeight,
  cta = '[INITIATE_AIVIBE_PROTOCOL]',
  headline = 'AIVIBE // DECISION_CORE',
  href = '/aivibe/',
}: Props): JSX.Element {
  return (
    <a
      href={href}
      onClick={() => track({ event_type: 'click', zone_id: zoneId, tool_id: 'aivibe' })}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        background: '#09090b',
        color: '#e2e8f0',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        textDecoration: 'none',
        minHeight,
        padding: '12px 16px',
      }}
    >
      <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '.12em' }}>
        ▸ {headline}
      </div>
      <div style={{ fontSize: 13, color: '#22d3ee', letterSpacing: '.06em' }}>
        {cta}
      </div>
    </a>
  );
}

// Standalone unfill-state shell. Also used outside AdSlot (e.g. sandbox tests).
// Matches AdSlot unfill visual contract so layout stays stable on swap.

interface Props {
  zoneId?: string;
  minHeight?: number;
  label?: string;
}

export default function ZincPlaceholder({
  zoneId,
  minHeight = 90,
  label = '[ RESOURCE_OFFLINE ]',
}: Props): JSX.Element {
  return (
    <div
      style={{
        position: 'relative',
        minHeight,
        background: '#18181b',
        border: '1px solid #27272a',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      data-kfw-zone={zoneId}
    >
      {zoneId && (
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 6,
            fontSize: 10,
            color: '#64748b',
            letterSpacing: '0.08em',
          }}
        >
          [COMMERCIAL_DATA_FEED // KFW-ZONE-{zoneId}]
        </div>
      )}
      <div
        style={{
          fontSize: 11,
          color: '#475569',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
}

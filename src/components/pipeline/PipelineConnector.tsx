import { useSessionField } from '~/lib/use-session-field';

interface Props {
  fieldKey: string;
  label: string;
  unit?: string;
  format?: (n: number) => string;
}

const BG = '#0b1120';
const DIM = '#64748b';
const CYAN = '#22d3ee';
const GOLD = '#facc15';

export default function PipelineConnector({ fieldKey, label, unit = '', format }: Props) {
  const field = useSessionField(fieldKey);
  const active = !!field && Number.isFinite(field.value);
  const displayValue = field
    ? format
      ? format(field.value)
      : `${field.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}${unit}`
    : '—';
  const color = active ? CYAN : DIM;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '8px 0',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}
    >
      <svg width="340" height="120" viewBox="0 0 340 120" style={{ display: 'block', maxWidth: '100%' }}>
        <defs>
          <linearGradient id={`flow-${fieldKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <line x1={170} y1={0} x2={170} y2={35} stroke={color} strokeWidth={2} opacity={0.6} />
        <rect x={40} y={32} width={260} height={48} rx={6} fill={BG} stroke={color} strokeWidth={1.5} />
        <text x={170} y={50} fill={DIM} fontSize={9} letterSpacing="0.16em" fontFamily="inherit" textAnchor="middle">
          {label.toUpperCase()}
        </text>
        <text x={170} y={70} fill={color} fontSize={18} fontWeight={700} fontFamily="inherit" textAnchor="middle">
          {displayValue}
        </text>
        <line x1={170} y1={80} x2={170} y2={108} stroke={color} strokeWidth={2} opacity={0.6} />
        <polygon points="164,108 176,108 170,118" fill={color} opacity={0.8} />
        {active && (
          <>
            <circle cx={170} cy={15} r={3} fill={GOLD}>
              <animate attributeName="cy" values="0;30" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
            <circle cx={170} cy={95} r={3} fill={GOLD}>
              <animate attributeName="cy" values="82;114" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;1;0" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}

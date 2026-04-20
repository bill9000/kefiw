import { Radio } from 'lucide-react';

interface Props {
  sourceLabel: string;
  value?: string;
  compact?: boolean;
}

const CYAN = '#22d3ee';
const DIM = '#64748b';

export default function LiveVariableBadge({ sourceLabel, value, compact = false }: Props) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: compact ? '2px 6px' : '3px 8px',
        border: `1px solid ${CYAN}`,
        borderRadius: 4,
        background: 'rgba(34, 211, 238, 0.08)',
        fontSize: compact ? 9 : 10,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        color: CYAN,
      }}
    >
      <Radio size={compact ? 9 : 11}>
        <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
      </Radio>
      <span style={{ color: DIM }}>LIVE ·</span>
      <span style={{ color: CYAN, fontWeight: 700 }}>{sourceLabel}</span>
      {value !== undefined && <span style={{ color: CYAN }}>{value}</span>}
    </span>
  );
}

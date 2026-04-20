import { RotateCcw } from 'lucide-react';
import { clearAll } from '~/lib/session-context';

export default function PipelineReset() {
  const onClick = () => {
    if (confirm('Reset pipeline? This clears the session-context (live variables only — tool inputs are preserved).')) {
      clearAll();
    }
  };
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        background: '#0b1120',
        border: '1px solid #1e293b',
        borderRadius: 6,
        color: '#94a3b8',
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
        fontSize: 11,
        letterSpacing: '.1em',
        cursor: 'pointer',
      }}
    >
      <RotateCcw size={12} /> RESET_PIPELINE
    </button>
  );
}

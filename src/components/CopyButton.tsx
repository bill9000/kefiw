import { useState } from 'react';
import { track } from '~/lib/analytics';

interface Props { value: string; label?: string; className?: string; tool?: string; }

export default function CopyButton({ value, label = 'Copy', className = '', tool }: Props) {
  const [done, setDone] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(value);
      const count = value ? value.split(/\r?\n/).filter(Boolean).length : 0;
      track('copy_result', { tool: tool ?? 'unknown', count });
      setDone(true);
      setTimeout(() => setDone(false), 1200);
    } catch {
      /* noop */
    }
  };
  return (
    <button type="button" onClick={handle} className={`btn-ghost text-xs ${className}`}>
      {done ? 'Copied' : label}
    </button>
  );
}

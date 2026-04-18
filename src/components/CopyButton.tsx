import { useState } from 'react';

interface Props { value: string; label?: string; className?: string; }

export default function CopyButton({ value, label = 'Copy', className = '' }: Props) {
  const [done, setDone] = useState(false);
  const handle = async () => {
    try {
      await navigator.clipboard.writeText(value);
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

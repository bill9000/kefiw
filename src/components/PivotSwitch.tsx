import React, { useEffect, useState } from 'react';
import { readDashboard, subscribeDashboard, getSystemHealth, type SystemHealth } from '~/lib/kfw-bridge';

interface PivotTarget {
  href: string;
  label: string;
  note: string;
}

interface Props {
  critical: PivotTarget;
  stable: PivotTarget;
  fallback: PivotTarget;
}

const COLOR: Record<SystemHealth, { bg: string; border: string; accent: string; tag: string }> = {
  critical: { bg: '#3b0a1f', border: '#f472b6', accent: '#f472b6', tag: '▸ EMERGENCY' },
  guarded: { bg: '#2b1d06', border: '#facc15', accent: '#facc15', tag: '▸ GUARDED' },
  stable: { bg: '#07221f', border: '#22d3ee', accent: '#22d3ee', tag: '▸ GROWTH' },
  uncalibrated: { bg: '#0b1120', border: '#475569', accent: '#94a3b8', tag: '▸ READ NEXT' },
};

export default function PivotSwitch({ critical, stable, fallback }: Props) {
  const [health, setHealth] = useState<SystemHealth>('uncalibrated');

  useEffect(() => {
    const sync = () => setHealth(getSystemHealth(readDashboard()));
    sync();
    return subscribeDashboard(sync);
  }, []);

  const target =
    health === 'critical' ? critical :
    health === 'stable' ? stable :
    health === 'guarded' ? critical :
    fallback;
  const c = COLOR[health];

  const block: React.CSSProperties = {
    display: 'block',
    background: c.bg,
    border: `1px solid ${c.border}`,
    borderRadius: 8,
    padding: '1rem 1.25rem',
    textDecoration: 'none',
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    color: '#e2e8f0',
    marginTop: '1.5rem',
  };
  const tag: React.CSSProperties = {
    fontSize: 11,
    letterSpacing: '0.22em',
    color: c.accent,
    textTransform: 'uppercase',
    fontWeight: 700,
  };
  const label: React.CSSProperties = {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 700,
    color: c.accent,
  };
  const note: React.CSSProperties = {
    marginTop: 6,
    fontSize: 13,
    color: '#cbd5e1',
  };

  return (
    <a href={target.href} style={block} data-pivot-health={health}>
      <div style={tag}>{c.tag}</div>
      <div style={label}>{target.label} →</div>
      <div style={note}>{target.note}</div>
    </a>
  );
}

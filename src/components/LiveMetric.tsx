import React, { useEffect, useState } from 'react';
import { readDashboard, subscribeDashboard, type DashboardMetrics } from '~/lib/kfw-bridge';

type MetricKey = keyof DashboardMetrics;

interface Props {
  metric: MetricKey;
  fallback: string;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

function format(value: DashboardMetrics[MetricKey], decimals: number, prefix: string, suffix: string): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number') {
    return `${prefix}${value.toFixed(decimals)}${suffix}`;
  }
  return `${prefix}${String(value)}${suffix}`;
}

export default function LiveMetric({ metric, fallback, decimals = 1, suffix = '', prefix = '' }: Props) {
  const [value, setValue] = useState<DashboardMetrics[MetricKey] | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const sync = () => setValue(readDashboard().metrics[metric]);
    sync();
    setMounted(true);
    return subscribeDashboard(sync);
  }, [metric]);

  const hasValue = value !== undefined && value !== null;
  const text = hasValue ? format(value, decimals, prefix, suffix) : fallback;

  const style: React.CSSProperties = {
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    color: hasValue ? '#22d3ee' : '#64748b',
    fontWeight: 700,
    padding: '0 4px',
    borderBottom: hasValue ? '1px dashed #22d3ee' : '1px dashed #334155',
    animation: mounted && hasValue ? 'kfwLmFade 600ms ease-out' : undefined,
  };

  return (
    <>
      <style>{`@keyframes kfwLmFade { from { opacity: 0.3; } to { opacity: 1; } }`}</style>
      <span style={style} data-live-metric={metric} data-calibrated={hasValue ? '1' : '0'}>{text}</span>
    </>
  );
}

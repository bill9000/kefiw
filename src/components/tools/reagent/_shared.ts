import type { CSSProperties } from 'react';

export const BG = '#0b1120';
export const PANEL = '#0f172a';
export const BORDER = '#1e293b';
export const TEXT = '#e2e8f0';
export const DIM = '#64748b';
export const CYAN = '#22d3ee';
export const GOLD = '#facc15';
export const MAGENTA = '#f472b6';
export const RED = '#ef4444';
export const LIQUID = '#38bdf8';

export const shellStyle: CSSProperties = {
  background: BG,
  color: TEXT,
  padding: '1.5rem',
  borderRadius: 12,
  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
  border: `1px solid ${BORDER}`,
};

export const panelStyle: CSSProperties = {
  background: PANEL,
  border: `1px solid ${BORDER}`,
  padding: '1rem',
  borderRadius: 8,
};

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.75rem',
  borderRadius: 6,
  border: `1px solid ${BORDER}`,
  background: '#0b1120',
  color: TEXT,
  fontFamily: 'inherit',
};

export const labelStyle: CSSProperties = {
  fontSize: 12,
  display: 'block',
};

export const dimHint: CSSProperties = {
  fontSize: 10,
  color: DIM,
  marginTop: 3,
};

export function parseNum(s: string): number {
  const n = parseFloat((s ?? '').replace(/[,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

export function round2(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100) / 100;
}

export function disclaimerStyle(): CSSProperties {
  return {
    fontSize: 10,
    color: DIM,
    borderTop: `1px dashed ${BORDER}`,
    paddingTop: 10,
    marginTop: '1rem',
    fontStyle: 'italic',
  };
}

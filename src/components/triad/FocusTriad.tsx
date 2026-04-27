import { useEffect, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import TaskSwitchingTax from '~/components/tools/TaskSwitchingTax.tsx';

const BG = '#0b1120';
const PANEL = '#0f172a';
const BORDER = '#1e293b';
const TEXT = '#e2e8f0';
const DIM = '#64748b';
const CYAN = '#22d3ee';
const GOLD = '#facc15';
const GREEN = '#4ade80';
const RED = '#ef4444';

interface Pillar {
  namespace: string;
  label: string;
  caption: string;
  color: string;
  seed: { tasks: string; hoursPerDay: string };
}

export const FOCUS_TRIAD_PILLARS: Pillar[] = [
  {
    namespace: 'distracted',
    label: 'Distracted',
    caption: 'Modern knowledge-worker default — 8 contexts in flight.',
    color: RED,
    seed: { tasks: '8', hoursPerDay: '8' },
  },
  {
    namespace: 'typical',
    label: 'Typical',
    caption: 'Three projects, batched messaging, one strategic block.',
    color: GOLD,
    seed: { tasks: '3', hoursPerDay: '8' },
  },
  {
    namespace: 'deep',
    label: 'Deep',
    caption: 'Single-threaded. One project, one room, one window.',
    color: GREEN,
    seed: { tasks: '1', hoursPerDay: '8' },
  },
];

const STORAGE_PREFIX = 'task-switching-tax-v1';

export default function FocusTriad() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    FOCUS_TRIAD_PILLARS.forEach((p) => {
      const key = `${STORAGE_PREFIX}__${p.namespace}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(p.seed));
      }
    });
    setSeeded(true);
  }, []);

  if (!seeded) {
    return (
      <div
        style={{
          padding: 40,
          background: BG,
          color: DIM,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          textAlign: 'center',
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: 12,
        }}
      >
        seeding focus triad…
      </div>
    );
  }

  return (
    <div
      style={{
        background: BG,
        color: TEXT,
        padding: 20,
        borderRadius: 12,
        border: `1px solid ${BORDER}`,
        fontFamily: '"JetBrains Mono", ui-monospace, monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 16,
          paddingBottom: 12,
          borderBottom: `1px dashed ${BORDER}`,
        }}
      >
        <LayoutGrid size={18} color={CYAN} />
        <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: DIM }}>
          Focus Triad · Parallel Context-Switching Scenarios
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        {FOCUS_TRIAD_PILLARS.map((p) => (
          <div key={p.namespace}>
            <div
              style={{
                display: 'inline-block',
                padding: '4px 10px',
                background: PANEL,
                border: `1px solid ${p.color}`,
                borderRadius: 999,
                fontSize: 10,
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: p.color,
                marginBottom: 4,
              }}
            >
              {p.label}
            </div>
            <div style={{ fontSize: 11, color: DIM, marginBottom: 8 }}>{p.caption}</div>
            <TaskSwitchingTax namespace={p.namespace} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: DIM, lineHeight: 1.6 }}>
        Same retention math (0.80^(n−1)) across all three pillars. Each column owns its own state — change tasks or hours on one and only that column updates. Pre-seeded values are the starting point, not a lock.
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import MinimumViableRate from '~/components/tools/MinimumViableRate.tsx';

const BG = '#0b1120';
const PANEL = '#0f172a';
const BORDER = '#1e293b';
const TEXT = '#e2e8f0';
const DIM = '#64748b';
const CYAN = '#22d3ee';
const GOLD = '#facc15';
const GREEN = '#4ade80';
const RED = '#ef4444';

interface Seed {
  targetSalary: string;
  benefitsValue: string;
  businessOverhead: string;
  billableWeeks: string;
  billableHoursPerWeek: string;
  utilizationPct: string;
  livingWageAnnual: string;
}

interface Pillar {
  namespace: string;
  label: string;
  caption: string;
  color: string;
  seed: Seed;
}

// Pillars vary mainly on utilization and billable weeks — the levers most
// independents under-estimate. Salary, benefits, overhead, living wage stay
// constant across pillars so the comparison is "same person, different year."
export const RATE_TRIAD_PILLARS: Pillar[] = [
  {
    namespace: 'conservative',
    label: 'Conservative',
    caption: 'Slow pipeline, lots of admin / sales time. 45% utilization, 44 weeks.',
    color: RED,
    seed: {
      targetSalary: '120000',
      benefitsValue: '18000',
      businessOverhead: '9000',
      billableWeeks: '44',
      billableHoursPerWeek: '40',
      utilizationPct: '45',
      livingWageAnnual: '55000',
    },
  },
  {
    namespace: 'realistic',
    label: 'Realistic',
    caption: 'Steady pipeline, normal admin overhead. 60% utilization, 47 weeks.',
    color: GOLD,
    seed: {
      targetSalary: '120000',
      benefitsValue: '18000',
      businessOverhead: '9000',
      billableWeeks: '47',
      billableHoursPerWeek: '40',
      utilizationPct: '60',
      livingWageAnnual: '55000',
    },
  },
  {
    namespace: 'aggressive',
    label: 'Aggressive',
    caption: 'Booked solid, tight admin, take a real vacation. 75% utilization, 48 weeks.',
    color: GREEN,
    seed: {
      targetSalary: '120000',
      benefitsValue: '18000',
      businessOverhead: '9000',
      billableWeeks: '48',
      billableHoursPerWeek: '40',
      utilizationPct: '75',
      livingWageAnnual: '55000',
    },
  },
];

const STORAGE_PREFIX = 'minimum-viable-rate-v1';

export default function RateTriad() {
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    RATE_TRIAD_PILLARS.forEach((p) => {
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
        seeding rate triad…
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
          Rate Triad · Parallel Utilization Scenarios
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        }}
      >
        {RATE_TRIAD_PILLARS.map((p) => (
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
            <MinimumViableRate namespace={p.namespace} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: DIM, lineHeight: 1.6 }}>
        Same target need (salary + benefits + overhead) across all three pillars; only utilization and billable weeks vary. The hourly rate spread shows how much your annual income depends on assumptions you don't usually examine.
      </div>
    </div>
  );
}

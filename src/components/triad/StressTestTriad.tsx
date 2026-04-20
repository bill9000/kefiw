import { useEffect, useState } from 'react';
import { LayoutGrid, Sliders } from 'lucide-react';
import RunwayZero from '~/components/tools/RunwayZero.tsx';

const BG = '#0b1120';
const PANEL = '#0f172a';
const BORDER = '#1e293b';
const TEXT = '#e2e8f0';
const DIM = '#64748b';
const CYAN = '#22d3ee';
const GREEN = '#4ade80';
const RED = '#ef4444';

type ToolId = 'runway-zero';

interface Pillar {
  namespace: string;
  label: string;
  caption: string;
  color: string;
  seed: Record<string, unknown>;
}

interface Props {
  tool: ToolId;
  pillars: Pillar[];
  storagePrefix: string;
}

interface Multipliers {
  burn: number;
  revenue: number;
}
const UNIT: Multipliers = { burn: 1, revenue: 1 };

export default function StressTestTriad({ tool, pillars, storagePrefix }: Props) {
  const [seeded, setSeeded] = useState(false);
  const [master, setMaster] = useState<Multipliers>(UNIT);
  const [column, setColumn] = useState<Record<string, Multipliers>>(() => {
    const m: Record<string, Multipliers> = {};
    pillars.forEach((p) => { m[p.namespace] = UNIT; });
    return m;
  });

  useEffect(() => {
    pillars.forEach((p) => {
      const key = `${storagePrefix}__${p.namespace}`;
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify(p.seed));
      }
    });
    setSeeded(true);
  }, [pillars, storagePrefix]);

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
        seeding triad scenarios…
      </div>
    );
  }

  const setColumnMul = (ns: string, axis: keyof Multipliers, v: number) => {
    setColumn((prev) => ({ ...prev, [ns]: { ...prev[ns], [axis]: v } }));
  };
  const resetAll = () => {
    setMaster(UNIT);
    const next: Record<string, Multipliers> = {};
    pillars.forEach((p) => { next[p.namespace] = UNIT; });
    setColumn(next);
  };

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
          flexWrap: 'wrap',
        }}
      >
        <LayoutGrid size={18} color={CYAN} />
        <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: DIM }}>
          Stress-Test Triad · Parallel Scenarios
        </div>
        <button
          type="button"
          onClick={resetAll}
          style={{
            marginLeft: 'auto',
            padding: '4px 10px',
            border: `1px solid ${BORDER}`,
            background: 'transparent',
            color: DIM,
            borderRadius: 6,
            fontSize: 10,
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 700,
          }}
        >
          reset multipliers
        </button>
      </div>

      <MasterSliders master={master} onChange={setMaster} />

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}
      >
        {pillars.map((p) => {
          const col = column[p.namespace] ?? UNIT;
          const effBurn = master.burn * col.burn;
          const effRev = master.revenue * col.revenue;
          return (
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

              <ColumnSliders
                color={p.color}
                col={col}
                onChange={(axis, v) => setColumnMul(p.namespace, axis, v)}
                effBurn={effBurn}
                effRev={effRev}
              />

              {tool === 'runway-zero' && (
                <RunwayZero
                  namespace={p.namespace}
                  burnMultiplier={effBurn}
                  revenueMultiplier={effRev}
                />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, fontSize: 11, color: DIM, lineHeight: 1.6 }}>
        Master sliders apply to all three pillars. Per-column sliders apply on top, multiplicatively.
        Effective multiplier = master × column. Base inputs (cash, burn, revenue) remain untouched — only
        the calculation is stress-tested.
      </div>
    </div>
  );
}

function MasterSliders({ master, onChange }: { master: Multipliers; onChange: (m: Multipliers) => void }) {
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: 12,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
          fontSize: 10,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: DIM,
        }}
      >
        <Sliders size={12} color={CYAN} />
        Master Multipliers · Apply to all pillars
      </div>
      <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <SliderRow
          label="Burn × master"
          value={master.burn}
          min={0.5}
          max={2}
          step={0.05}
          color={RED}
          onChange={(v) => onChange({ ...master, burn: v })}
        />
        <SliderRow
          label="Revenue × master"
          value={master.revenue}
          min={0}
          max={2}
          step={0.05}
          color={GREEN}
          onChange={(v) => onChange({ ...master, revenue: v })}
        />
      </div>
    </div>
  );
}

function ColumnSliders({
  color,
  col,
  onChange,
  effBurn,
  effRev,
}: {
  color: string;
  col: Multipliers;
  onChange: (axis: keyof Multipliers, v: number) => void;
  effBurn: number;
  effRev: number;
}) {
  return (
    <div
      style={{
        background: PANEL,
        border: `1px solid ${BORDER}`,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          fontSize: 10,
          letterSpacing: '.18em',
          textTransform: 'uppercase',
          color: DIM,
          marginBottom: 6,
        }}
      >
        Column multipliers
      </div>
      <SliderRow
        label="Burn × col"
        value={col.burn}
        min={0.5}
        max={2}
        step={0.05}
        color={color}
        onChange={(v) => onChange('burn', v)}
      />
      <div style={{ height: 6 }} />
      <SliderRow
        label="Revenue × col"
        value={col.revenue}
        min={0}
        max={2}
        step={0.05}
        color={color}
        onChange={(v) => onChange('revenue', v)}
      />
      <div
        style={{
          marginTop: 8,
          fontSize: 10,
          color: DIM,
          borderTop: `1px dashed ${BORDER}`,
          paddingTop: 6,
        }}
      >
        Effective · burn × {effBurn.toFixed(2)} · revenue × {effRev.toFixed(2)}
      </div>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  color,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: 'block', fontSize: 11 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: DIM, marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value.toFixed(2)}×</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: color }}
      />
    </label>
  );
}

export const RUNWAY_TRIAD_PILLARS: Pillar[] = [
  {
    namespace: 'baseline',
    label: 'Baseline',
    caption: 'Current trajectory. No interventions, no shocks.',
    color: CYAN,
    seed: { cash: '250000', burn: '65000', revenue: '22000', crisis: false },
  },
  {
    namespace: 'optimized',
    label: 'Optimized',
    caption: 'Burn trimmed, revenue pushed, shocks absorbed.',
    color: GREEN,
    seed: { cash: '250000', burn: '48000', revenue: '32000', crisis: false },
  },
  {
    namespace: 'crisis',
    label: 'Crisis',
    caption: 'Revenue zeroed. Pure cash decay. How long do you survive?',
    color: RED,
    seed: { cash: '250000', burn: '65000', revenue: '22000', crisis: true },
  },
];

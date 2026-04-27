import { useEffect, useState } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown, Minus, Lock, Unlock } from 'lucide-react';
import GeoArbitrage from '~/components/tools/GeoArbitrage.tsx';
import MinimumViableRate from '~/components/tools/MinimumViableRate.tsx';
import GigNetFloor from '~/components/tools/GigNetFloor.tsx';
import { useSessionField } from '~/lib/use-session-field';

const BG = '#0b1120';
const PANEL = '#0f172a';
const BORDER = '#1e293b';
const TEXT = '#e2e8f0';
const DIM = '#64748b';
const CYAN = '#22d3ee';
const GREEN = '#4ade80';
const RED = '#ef4444';
const GOLD = '#facc15';

type ToolId = 'geo-arbitrage' | 'minimum-viable-rate' | 'gig-net-floor';

interface LockableField {
  key: string;
  label: string;
}

interface Seed {
  [k: string]: string;
}

interface ToolSeeds {
  a?: Seed;
  b?: Seed;
}

interface Props {
  tool: ToolId;
  fieldKey: string;
  labelA: string;
  labelB: string;
  deltaCaption?: string;
  format?: (n: number) => string;
  lockableFields?: LockableField[];
  // Initial values written into each column's localStorage on first visit.
  // After that the user owns the state — re-seeding only fills empty slots.
  seeds?: ToolSeeds;
}

const GEO_LOCKABLE: LockableField[] = [
  { key: 'incomeHere', label: 'Income · here' },
  { key: 'costHere', label: 'Cost · here' },
  { key: 'incomeThere', label: 'Income · there' },
  { key: 'costThere', label: 'Cost · there' },
  { key: 'moveCost', label: 'One-time move cost' },
];

const MVR_LOCKABLE: LockableField[] = [
  { key: 'targetSalary', label: 'Target salary' },
  { key: 'benefitsValue', label: 'Benefits value' },
  { key: 'businessOverhead', label: 'Overhead' },
  { key: 'livingWageAnnual', label: 'Living wage' },
];

const GIG_LOCKABLE: LockableField[] = [
  { key: 'gasPrice', label: 'Gas $/gal' },
  { key: 'stateMinWage', label: 'Local min wage' },
  { key: 'shiftsPerWeek', label: 'Shifts / week' },
];

const STORAGE_PREFIX_FOR_TOOL: Record<ToolId, string> = {
  'geo-arbitrage': 'geo-arbitrage-v1',
  'minimum-viable-rate': 'minimum-viable-rate-v1',
  'gig-net-floor': 'gig-net-floor-v1',
};

const DEFAULT_LOCKABLE_FOR_TOOL: Record<ToolId, LockableField[]> = {
  'geo-arbitrage': GEO_LOCKABLE,
  'minimum-viable-rate': MVR_LOCKABLE,
  'gig-net-floor': GIG_LOCKABLE,
};

const defaultMoneyFmt = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export default function ComparisonMatrix({
  tool,
  fieldKey,
  labelA,
  labelB,
  deltaCaption,
  format,
  lockableFields,
  seeds,
}: Props) {
  const fmt = format ?? defaultMoneyFmt;
  // Pre-seed namespaced localStorage on first visit. This is what makes
  // matrix pages "open with sensible defaults" instead of an empty form.
  useEffect(() => {
    if (!seeds || typeof window === 'undefined') return;
    const prefix = STORAGE_PREFIX_FOR_TOOL[tool];
    const writeIfEmpty = (ns: 'a' | 'b', payload: Seed | undefined) => {
      if (!payload) return;
      const key = `${prefix}__${ns}`;
      if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(payload));
    };
    writeIfEmpty('a', seeds.a);
    writeIfEmpty('b', seeds.b);
  }, [tool, seeds]);

  const a = useSessionField(`${fieldKey}__a`);
  const b = useSessionField(`${fieldKey}__b`);
  const valA = a?.value ?? 0;
  const valB = b?.value ?? 0;
  const delta = valB - valA;

  let deltaColor: string = DIM;
  let DeltaIcon = Minus;
  if (delta > 0.5) { deltaColor = GREEN; DeltaIcon = TrendingUp; }
  else if (delta < -0.5) { deltaColor = RED; DeltaIcon = TrendingDown; }

  const winner =
    delta > 0.5 ? labelB :
    delta < -0.5 ? labelA :
    'Parity';

  const fields = lockableFields ?? DEFAULT_LOCKABLE_FOR_TOOL[tool] ?? [];
  const [lockedValues, setLockedValues] = useState<Record<string, string>>({});

  const toggleLock = (k: string) => {
    setLockedValues((prev) => {
      if (k in prev) {
        const { [k]: _drop, ...rest } = prev;
        return rest;
      }
      const prefix = STORAGE_PREFIX_FOR_TOOL[tool];
      const seed = readField(`${prefix}__a`, k) ?? readField(`${prefix}__b`, k) ?? '';
      return { ...prev, [k]: seed };
    });
  };
  const updateLocked = (k: string, v: string) => {
    setLockedValues((prev) => (k in prev ? { ...prev, [k]: v } : prev));
  };
  const lockedCount = Object.keys(lockedValues).length;
  const allLocked = fields.length > 0 && lockedCount === fields.length;

  const toggleAll = () => {
    if (allLocked) {
      setLockedValues({});
    } else {
      const next: Record<string, string> = {};
      const prefix = STORAGE_PREFIX_FOR_TOOL[tool];
      fields.forEach((f) => {
        next[f.key] = lockedValues[f.key] ?? readField(`${prefix}__a`, f.key) ?? readField(`${prefix}__b`, f.key) ?? '';
      });
      setLockedValues(next);
    }
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
        <ArrowLeftRight size={18} color={CYAN} />
        <div style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: DIM }}>
          Comparison Matrix · Dual Scenario
        </div>
        {fields.length > 0 && (
          <button
            type="button"
            onClick={toggleAll}
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              border: `1px solid ${allLocked ? GOLD : BORDER}`,
              background: allLocked ? `${GOLD}11` : 'transparent',
              color: allLocked ? GOLD : DIM,
              borderRadius: 6,
              fontSize: 10,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontWeight: 700,
            }}
          >
            {allLocked ? <Lock size={12} /> : <Unlock size={12} />}
            {allLocked ? 'Unlock all' : 'Lock all'}
          </button>
        )}
      </div>

      {fields.length > 0 && (
        <div
          style={{
            marginBottom: 14,
            padding: 12,
            background: PANEL,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: '.18em', color: DIM, textTransform: 'uppercase', marginBottom: 8 }}>
            Lock Variables · {lockedCount}/{fields.length} synced
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {fields.map((f) => {
              const locked = f.key in lockedValues;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleLock(f.key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    border: `1px solid ${locked ? GOLD : BORDER}`,
                    background: locked ? `${GOLD}11` : 'transparent',
                    color: locked ? GOLD : DIM,
                    borderRadius: 999,
                    fontSize: 11,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {locked ? <Lock size={10} /> : <Unlock size={10} />}
                  {f.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 10, color: DIM, marginTop: 8 }}>
            Locked fields share one value across both scenarios — change in either column, change in both.
          </div>
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gap: 14,
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              fontSize: 10,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: CYAN,
              marginBottom: 8,
            }}
          >
            Scenario A · {labelA}
          </div>
          {tool === 'geo-arbitrage' && (
            <GeoArbitrage namespace="a" lockedFields={lockedValues} onLockedChange={updateLocked} />
          )}
          {tool === 'minimum-viable-rate' && <MinimumViableRate namespace="a" />}
          {tool === 'gig-net-floor' && <GigNetFloor namespace="a" />}
        </div>
        <div>
          <div
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 999,
              fontSize: 10,
              letterSpacing: '.18em',
              textTransform: 'uppercase',
              color: GOLD,
              marginBottom: 8,
            }}
          >
            Scenario B · {labelB}
          </div>
          {tool === 'geo-arbitrage' && (
            <GeoArbitrage namespace="b" lockedFields={lockedValues} onLockedChange={updateLocked} />
          )}
          {tool === 'minimum-viable-rate' && <MinimumViableRate namespace="b" />}
          {tool === 'gig-net-floor' && <GigNetFloor namespace="b" />}
        </div>
      </div>

      <div
        style={{
          background: PANEL,
          border: `1px solid ${deltaColor}`,
          borderRadius: 10,
          padding: 16,
          boxShadow: `0 0 24px ${deltaColor}22`,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: DIM,
            marginBottom: 8,
          }}
        >
          Delta Bar · {deltaCaption ?? 'Scenario B − Scenario A'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DeltaIcon size={28} color={deltaColor} />
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: deltaColor, letterSpacing: '.02em' }}>
                {delta >= 0 ? '+' : ''}
                {fmt(delta)}
              </div>
              <div style={{ fontSize: 11, color: DIM }}>
                A: {fmt(valA)} · B: {fmt(valB)}
              </div>
            </div>
          </div>
          <div
            style={{
              marginLeft: 'auto',
              fontSize: 12,
              color: TEXT,
              padding: '6px 12px',
              border: `1px solid ${deltaColor}`,
              borderRadius: 6,
              background: `${deltaColor}11`,
            }}
          >
            Winner: <span style={{ color: deltaColor, fontWeight: 700 }}>{winner}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function readField(storageKey: string, field: string): string | null {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const v = parsed[field];
    return typeof v === 'string' ? v : null;
  } catch {
    return null;
  }
}

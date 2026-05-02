export interface StatItem { label: string; value: string; }
export interface ComparisonRow { label: string; value: string; }
export interface ComparisonColumn { title: string; items: string[]; }
export interface NextStepAction { href: string; label: string; }

export type OutcomeCard =
  | { kind: 'summary'; text: string }
  | { kind: 'stats'; items: StatItem[] }
  | { kind: 'takeaway'; text: string }
  | { kind: 'comparison'; title?: string; rows?: ComparisonRow[]; columns?: ComparisonColumn[] }
  | { kind: 'nextStep'; actions: NextStepAction[] };

export type MaybeCard = OutcomeCard | false | null | undefined;

interface Props {
  cards: MaybeCard[];
}

const FRIENDLY_LABELS: Record<string, string> = {
  Gross: 'Before breaks',
  Break: 'Unpaid break',
  Worked: 'Time worked',
  'Decimal hrs': 'Decimal hours',
  'Regular hrs': 'Regular hours',
  'Overtime hrs': 'Overtime hours',
  Delta: 'Difference',
  'RPH delta': 'Revenue-per-employee change',
  Multiplier: 'Pay multiplier',
  Threshold: 'Starts after',
};

function friendlyLabel(label: string) {
  return FRIENDLY_LABELS[label] ?? label;
}

export default function OutcomeLayer({ cards }: Props) {
  const visible = cards.filter((c): c is OutcomeCard => Boolean(c));
  if (visible.length === 0) return null;
  return (
    <div className="space-y-2">
      {visible.map((c, i) => <Card key={i} card={c} />)}
    </div>
  );
}

function Card({ card }: { card: OutcomeCard }) {
  switch (card.kind) {
    case 'summary':
      return (
        <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-900">
          {card.text}
        </div>
      );
    case 'stats':
      if (card.items.length === 0) return null;
      return (
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {card.items.map((s) => (
            <div key={s.label} className="rounded border border-slate-200 bg-white px-3 py-2 text-center">
              <dt className="text-xs text-slate-500">{friendlyLabel(s.label)}</dt>
              <dd className="font-mono text-sm font-semibold text-slate-900">{s.value}</dd>
            </div>
          ))}
        </dl>
      );
    case 'takeaway':
      return (
        <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-600">
          {card.text}
        </div>
      );
    case 'comparison': {
      const hasRows = card.rows && card.rows.length > 0;
      const hasCols = card.columns && card.columns.length > 0;
      if (!hasRows && !hasCols) return null;
      return (
        <div className="rounded-md border border-slate-200 bg-white p-3 text-sm">
          {card.title && <div className="mb-2 text-xs font-medium text-slate-500">{card.title}</div>}
          {hasRows && (
            <dl className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {card.rows!.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-2">
                  <dt className="text-slate-600">{r.label}</dt>
                  <dd className="font-mono font-semibold text-slate-900">{r.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {hasCols && (
            <div className={`grid gap-3 ${card.columns!.length === 2 ? 'grid-cols-2' : card.columns!.length === 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
              {card.columns!.map((col) => (
                <div key={col.title}>
                  <div className="mb-1 text-xs font-medium text-slate-500">{col.title}</div>
                  <ul className="space-y-0.5 text-xs font-mono text-slate-800">
                    {col.items.map((it) => <li key={it}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    case 'nextStep':
      if (card.actions.length === 0) return null;
      return (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {card.actions.map((a) => (
            <a key={a.href + a.label} href={a.href} className="font-medium text-brand-700 hover:underline">
              {a.label} →
            </a>
          ))}
        </div>
      );
  }
}

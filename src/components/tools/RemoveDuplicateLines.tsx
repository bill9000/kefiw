import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { removeDuplicateLines } from '~/lib/text';
import OutcomeLayer, { type MaybeCard } from './outcome/OutcomeLayer';

// Local dedupe that layers on top of the lib's removeDuplicateLines. Handles
// case-insensitive matching, trim-whitespace matching, and keep-last mode.
// The lib helper keeps the first occurrence when order is preserved.
function dedupe(
  text: string,
  opts: { preserveOrder: boolean; caseInsensitive: boolean; trimMatch: boolean; keepLast: boolean; unicodeNorm: boolean }
): string {
  if (!text) return '';
  const lines = text.split('\n');
  const normalize = (s: string): string => {
    let v = opts.trimMatch ? s.trim() : s;
    if (opts.unicodeNorm) v = v.normalize('NFC');
    if (opts.caseInsensitive) v = v.toLowerCase();
    return v;
  };
  if (opts.preserveOrder) {
    if (opts.keepLast) {
      // Keep each line's last occurrence. Scan right-to-left to know which
      // index is the last, then reassemble in original order.
      const lastIdx = new Map<string, number>();
      lines.forEach((l, i) => lastIdx.set(normalize(l), i));
      const out: string[] = [];
      lines.forEach((l, i) => {
        if (lastIdx.get(normalize(l)) === i) out.push(l);
      });
      return out.join('\n');
    }
    // Default: keep first
    const seen = new Set<string>();
    const out: string[] = [];
    for (const l of lines) {
      const k = normalize(l);
      if (!seen.has(k)) {
        seen.add(k);
        out.push(l);
      }
    }
    return out.join('\n');
  }
  // Sorted unique, normalized but preserve original casing of first hit
  const firstSeen = new Map<string, string>();
  for (const l of lines) {
    const k = normalize(l);
    if (!firstSeen.has(k)) firstSeen.set(k, l);
  }
  return Array.from(firstSeen.values()).sort().join('\n');
}

export default function RemoveDuplicateLines() {
  const [text, setText] = useState('');
  const [preserveOrder, setPreserveOrder] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [trimMatch, setTrimMatch] = useState(false);
  const [keepLast, setKeepLast] = useState(false);
  const [unicodeNorm, setUnicodeNorm] = useState(false);
  const [showRemoved, setShowRemoved] = useState(false);
  const out = useMemo(() => {
    if (!caseInsensitive && !trimMatch && !keepLast && !unicodeNorm) {
      return removeDuplicateLines(text, preserveOrder);
    }
    return dedupe(text, { preserveOrder, caseInsensitive, trimMatch, keepLast, unicodeNorm });
  }, [text, preserveOrder, caseInsensitive, trimMatch, keepLast, unicodeNorm]);
  const inCount = text ? text.split('\n').length : 0;
  const outCount = out ? out.split('\n').length : 0;
  const removed = Math.max(0, inCount - outCount);

  // Build a report of which lines got dropped (which input indexes didn't
  // survive into the output) with their duplicate counts. Computed lazily so
  // it only runs when the panel is expanded.
  const removedReport = useMemo(() => {
    if (!showRemoved || !text) return [] as { line: string; occurrences: number; firstIndex: number }[];
    const norm = (s: string): string => {
      let v = trimMatch ? s.trim() : s;
      if (unicodeNorm) v = v.normalize('NFC');
      if (caseInsensitive) v = v.toLowerCase();
      return v;
    };
    const buckets = new Map<string, { line: string; occurrences: number; firstIndex: number }>();
    text.split('\n').forEach((l, i) => {
      const k = norm(l);
      const existing = buckets.get(k);
      if (existing) existing.occurrences += 1;
      else buckets.set(k, { line: l, occurrences: 1, firstIndex: i });
    });
    return Array.from(buckets.values())
      .filter((b) => b.occurrences > 1)
      .sort((a, b) => b.occurrences - a.occurrences)
      .slice(0, 25);
  }, [text, showRemoved, trimMatch, unicodeNorm, caseInsensitive]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={preserveOrder} onChange={(e) => setPreserveOrder(e.target.checked)} />
          Preserve original order
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} />
          Case-insensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={trimMatch} onChange={(e) => setTrimMatch(e.target.checked)} />
          Trim whitespace when comparing
        </label>
        <label className={`flex items-center gap-2 text-sm ${preserveOrder ? '' : 'opacity-50'}`}>
          <input type="checkbox" disabled={!preserveOrder} checked={keepLast} onChange={(e) => setKeepLast(e.target.checked)} />
          Keep last occurrence instead of first
        </label>
        <label className="flex items-center gap-2 text-sm" title="NFC normalize: treat 'café' (precomposed) and 'café' (combining acute) as equal.">
          <input type="checkbox" checked={unicodeNorm} onChange={(e) => setUnicodeNorm(e.target.checked)} />
          Unicode normalize (NFC) before matching
        </label>
        <span className="text-xs text-slate-500">{inCount} in → {outCount} out</span>
      </div>
      <div>
        <label className="label" htmlFor="in">Input</label>
        <textarea id="in" className="input h-48 font-mono" value={text} onChange={(e) => setText(e.target.value)} placeholder="One entry per line…" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="out">Output</label>
          <CopyButton value={out} />
        </div>
        <textarea id="out" readOnly className="input h-48 bg-slate-50 font-mono" value={out} />
      </div>
      {/* Expandable panel of removed duplicates with occurrence counts */}
      {removed > 0 && (
        <details
          open={showRemoved}
          onToggle={(e) => setShowRemoved((e.target as HTMLDetailsElement).open)}
          className="rounded-md border border-slate-200 bg-slate-50"
        >
          <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-slate-700">
            {removed} duplicate{removed === 1 ? '' : 's'} removed — show details
          </summary>
          <div className="border-t border-slate-200 px-3 py-2">
            {removedReport.length === 0 ? (
              <div className="text-xs text-slate-500">No repeated lines to list (try expanding again).</div>
            ) : (
              <ul className="space-y-1 text-xs font-mono text-slate-700">
                {removedReport.map((r, i) => (
                  <li key={i} className="flex items-baseline gap-2">
                    <span className="inline-block min-w-[3rem] rounded bg-white px-1.5 py-0.5 text-right font-semibold text-slate-600">
                      ×{r.occurrences}
                    </span>
                    <span className="truncate">{r.line || <span className="italic text-slate-400">(blank line)</span>}</span>
                    <span className="ml-auto text-[10px] text-slate-400">first @ line {r.firstIndex + 1}</span>
                  </li>
                ))}
              </ul>
            )}
            {removedReport.length === 25 && (
              <p className="mt-2 text-[11px] text-slate-500">Showing top 25 most-repeated.</p>
            )}
          </div>
        </details>
      )}
      {inCount > 0 && (() => {
        const uniquePct = Math.round((outCount / inCount) * 100);
        const cards: MaybeCard[] = [
          {
            kind: 'summary',
            text: removed === 0
              ? `No duplicates found in ${inCount.toLocaleString()} line${inCount === 1 ? '' : 's'}.`
              : `Removed ${removed.toLocaleString()} duplicate${removed === 1 ? '' : 's'} from ${inCount.toLocaleString()} line${inCount === 1 ? '' : 's'}.`,
          },
          {
            kind: 'stats',
            items: [
              { label: 'Input', value: inCount.toLocaleString() },
              { label: 'Output', value: outCount.toLocaleString() },
              { label: 'Removed', value: removed.toLocaleString() },
              { label: 'Unique rate', value: `${uniquePct}%` },
            ],
          },
          { kind: 'takeaway', text: preserveOrder ? 'Kept the first occurrence and dropped later duplicates.' : 'Sorted uniques — toggle above to preserve original order.' },
          {
            kind: 'nextStep',
            actions: [
              { href: '/text-tools/sort-lines/', label: 'Sort Lines' },
              { href: '/word-tools/word-counter/', label: 'Word Counter' },
            ],
          },
        ];
        return <OutcomeLayer cards={cards} />;
      })()}
    </div>
  );
}

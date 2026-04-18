import { useMemo, useState } from 'react';
import CopyButton from '../CopyButton';
import { convert, formatNum, type UnitGroup } from '~/lib/units';

interface Props {
  units: UnitGroup;
  defaultFrom: string;
  defaultTo: string;
  defaultValue?: number;
}

export default function GenericConverter({ units, defaultFrom, defaultTo, defaultValue = 1 }: Props) {
  const [raw, setRaw] = useState(String(defaultValue));
  const [fromId, setFromId] = useState(defaultFrom);
  const [toId, setToId] = useState(defaultTo);
  const [decimals, setDecimals] = useState(6);

  const entries = Object.values(units);
  const value = parseFloat(raw);
  const out = useMemo(() => {
    const from = units[fromId]; const to = units[toId];
    if (!from || !to || !Number.isFinite(value)) return '';
    return formatNum(convert(value, from, to), decimals);
  }, [units, value, fromId, toId, decimals]);

  const all = useMemo(() => {
    const from = units[fromId];
    if (!from || !Number.isFinite(value)) return [];
    return entries.map((u) => ({ id: u.id, label: u.label, val: formatNum(convert(value, from, u), decimals) }));
  }, [units, fromId, value, decimals, entries]);

  const swap = () => { setFromId(toId); setToId(fromId); };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label className="label" htmlFor="val">Value</label>
          <input id="val" type="number" inputMode="decimal" className="input" value={raw} onChange={(e) => setRaw(e.target.value)} />
          <select className="input mt-2" value={fromId} onChange={(e) => setFromId(e.target.value)}>
            {entries.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
        <button type="button" onClick={swap} className="btn-ghost self-end sm:self-center" aria-label="Swap units">⇄</button>
        <div>
          <label className="label" htmlFor="out">Result</label>
          <div className="flex gap-2">
            <input id="out" readOnly className="input bg-slate-50 font-mono" value={out} />
            <CopyButton value={out} />
          </div>
          <select className="input mt-2" value={toId} onChange={(e) => setToId(e.target.value)}>
            {entries.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-slate-600">
        <label>Decimals</label>
        <input type="range" min={0} max={10} value={decimals} onChange={(e) => setDecimals(Number(e.target.value))} />
        <span className="font-mono">{decimals}</span>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium text-slate-700">All conversions</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {all.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded border border-slate-200 bg-white px-3 py-2 text-sm">
              <span className="text-slate-600">{r.label}</span>
              <span className="font-mono font-medium">{r.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

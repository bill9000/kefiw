import { useEffect, useMemo, useState } from 'react';
import type { TrackProgressStep } from './TrackProgress';

interface Props {
  trackSlug: string;
  resultTitle: string;
  steps: TrackProgressStep[];
}

interface ScenarioState {
  baseEstimate: number;
  lowFactor: number;
  highFactor: number;
  contingencyPct: number;
  cashAvailable: number;
  monthsUntilDecision: number;
  monthlyCapacity: number;
}

const defaults: ScenarioState = {
  baseEstimate: 12000,
  lowFactor: 85,
  highFactor: 125,
  contingencyPct: 12,
  cashAvailable: 4000,
  monthsUntilDecision: 6,
  monthlyCapacity: 900,
};

function money(value: number): string {
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function storageKey(trackSlug: string): string {
  return `kfw_track_what_if:${trackSlug}`;
}

export default function TrackWhatIfPlanner({ trackSlug, resultTitle, steps }: Props): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<ScenarioState>(defaults);
  const key = useMemo(() => storageKey(trackSlug), [trackSlug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState({ ...defaults, ...(JSON.parse(raw) as Partial<ScenarioState>) });
    } catch {
      setState(defaults);
    } finally {
      setLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // Scenario persistence is optional.
    }
  }, [key, loaded, state]);

  const low = state.baseEstimate * state.lowFactor / 100;
  const high = state.baseEstimate * state.highFactor / 100;
  const conservative = high * (1 + state.contingencyPct / 100);
  const futureCash = state.cashAvailable + state.monthlyCapacity * state.monthsUntilDecision;
  const shortfall = conservative - futureCash;
  const requiredMonthly = Math.max(0, (conservative - state.cashAvailable) / Math.max(1, state.monthsUntilDecision));
  const isCovered = shortfall <= 0;

  const update = (id: keyof ScenarioState, value: number): void => {
    setState((current) => ({ ...current, [id]: Number.isFinite(value) ? value : 0 }));
  };

  return (
    <section className="mt-8 rounded-lg border border-indigo-200 bg-indigo-50 p-4" aria-label="Track what-if scenario planner">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">Linked what-if plan</div>
          <h2 className="mt-1 text-lg font-semibold text-slate-950">{resultTitle} Scenario</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-700">
            Enter one working estimate, then stress it with low/high ranges, contingency, cash on hand, and monthly capacity.
            Use the step links below to replace guesses with calculator results as you move through the track.
          </p>
        </div>
        <button
          type="button"
          className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100"
          onClick={() => setState(defaults)}
        >
          Reset scenario
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <label className="rounded-md border border-indigo-100 bg-white p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Base estimate</span>
          <span className="mt-2 flex items-center rounded-md border border-slate-300">
            <span className="pl-3 text-sm text-slate-500">$</span>
            <input className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none" type="number" value={state.baseEstimate} min={0} step={500} onChange={(event) => update('baseEstimate', Number(event.target.value))} />
          </span>
        </label>
        <label className="rounded-md border border-indigo-100 bg-white p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Low / high range</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" value={state.lowFactor} min={0} max={200} step={1} onChange={(event) => update('lowFactor', Number(event.target.value))} />
            <input className="rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" value={state.highFactor} min={0} max={300} step={1} onChange={(event) => update('highFactor', Number(event.target.value))} />
          </div>
        </label>
        <label className="rounded-md border border-indigo-100 bg-white p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contingency</span>
          <span className="mt-2 flex items-center rounded-md border border-slate-300">
            <input className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none" type="number" value={state.contingencyPct} min={0} max={100} step={1} onChange={(event) => update('contingencyPct', Number(event.target.value))} />
            <span className="pr-3 text-sm text-slate-500">%</span>
          </span>
        </label>
        <label className="rounded-md border border-indigo-100 bg-white p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Cash available</span>
          <span className="mt-2 flex items-center rounded-md border border-slate-300">
            <span className="pl-3 text-sm text-slate-500">$</span>
            <input className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none" type="number" value={state.cashAvailable} min={0} step={500} onChange={(event) => update('cashAvailable', Number(event.target.value))} />
          </span>
        </label>
        <label className="rounded-md border border-indigo-100 bg-white p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Months to act</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" value={state.monthsUntilDecision} min={1} max={120} step={1} onChange={(event) => update('monthsUntilDecision', Number(event.target.value))} />
        </label>
        <label className="rounded-md border border-indigo-100 bg-white p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly capacity</span>
          <span className="mt-2 flex items-center rounded-md border border-slate-300">
            <span className="pl-3 text-sm text-slate-500">$</span>
            <input className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none" type="number" value={state.monthlyCapacity} min={0} step={100} onChange={(event) => update('monthlyCapacity', Number(event.target.value))} />
          </span>
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-md border border-indigo-100 bg-white p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Range</div>
          <div className="mt-1 text-base font-semibold text-slate-950">{money(low)} - {money(high)}</div>
        </div>
        <div className="rounded-md border border-indigo-100 bg-white p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conservative target</div>
          <div className="mt-1 text-base font-semibold text-slate-950">{money(conservative)}</div>
        </div>
        <div className="rounded-md border border-indigo-100 bg-white p-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Future cash</div>
          <div className="mt-1 text-base font-semibold text-slate-950">{money(futureCash)}</div>
        </div>
        <div className={`rounded-md border p-3 ${isCovered ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{isCovered ? 'Buffer' : 'Shortfall'}</div>
          <div className="mt-1 text-base font-semibold text-slate-950">{money(Math.abs(shortfall))}</div>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700">
        Required monthly capacity for the conservative target: <strong>{money(requiredMonthly)}</strong>.
      </p>

      <div className="mt-4">
        <h3 className="text-sm font-semibold text-slate-900">Replace scenario guesses with these steps</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {steps.filter((step) => step.href).slice(0, 8).map((step) => (
            <a key={step.title} className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-indigo-800 no-underline ring-1 ring-inset ring-indigo-200 hover:bg-indigo-100" href={step.href}>
              {step.title}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useState } from 'react';

export interface TrackProgressStep {
  title: string;
  type: string;
  href?: string;
  description: string;
  whyNow?: string;
  resultToWatch?: string[];
  ifResultLooksBad?: string;
  checkpoint?: string;
  relatedGuide?: {
    title: string;
    href: string;
  };
  relatedTemplate?: {
    title: string;
    href: string;
  };
  carryForward?: string;
}

interface Props {
  trackSlug: string;
  steps: TrackProgressStep[];
}

interface SavedProgress {
  currentIndex: number;
  completed: number[];
  skipped: number[];
  savedAt?: string;
}

const defaultProgress: SavedProgress = {
  currentIndex: 0,
  completed: [],
  skipped: [],
};

function storageKey(trackSlug: string): string {
  return `kfw_track_progress:${trackSlug}`;
}

function uniqueSorted(values: number[]): number[] {
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

export default function TrackProgress({ trackSlug, steps }: Props): JSX.Element {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState<SavedProgress>(defaultProgress);
  const key = useMemo(() => storageKey(trackSlug), [trackSlug]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedProgress>;
        setProgress({
          currentIndex: Math.min(Math.max(parsed.currentIndex ?? 0, 0), Math.max(steps.length - 1, 0)),
          completed: uniqueSorted(parsed.completed ?? []),
          skipped: uniqueSorted(parsed.skipped ?? []),
          savedAt: parsed.savedAt,
        });
      }
    } catch {
      setProgress(defaultProgress);
    } finally {
      setLoaded(true);
    }
  }, [key, steps.length]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(progress));
    } catch {
      // Progress persistence is helpful, not required.
    }
  }, [key, loaded, progress]);

  const totalFinished = uniqueSorted([...progress.completed, ...progress.skipped]).length;
  const progressPercent = steps.length > 0 ? Math.round((totalFinished / steps.length) * 100) : 0;

  const markCurrent = (index: number): void => {
    setProgress((current) => ({
      ...current,
      currentIndex: index,
    }));
  };

  const saveProgress = (index: number): void => {
    setProgress((current) => ({
      ...current,
      currentIndex: index,
      savedAt: new Date().toISOString(),
    }));
  };

  const skipStep = (index: number): void => {
    setProgress((current) => ({
      ...current,
      skipped: uniqueSorted([...current.skipped, index]),
      completed: current.completed.filter((value) => value !== index),
      currentIndex: Math.min(index + 1, Math.max(steps.length - 1, 0)),
      savedAt: new Date().toISOString(),
    }));
  };

  const completeStep = (index: number): void => {
    setProgress((current) => ({
      ...current,
      completed: uniqueSorted([...current.completed, index]),
      skipped: current.skipped.filter((value) => value !== index),
      currentIndex: Math.min(index + 1, Math.max(steps.length - 1, 0)),
      savedAt: new Date().toISOString(),
    }));
  };

  const savedLabel = progress.savedAt
    ? `Saved ${new Date(progress.savedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`
    : 'Not saved yet';

  return (
    <section data-testid="track-progress" aria-label="Track progress" className="mt-5">
      <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Step-by-step calculators</h2>
          <p className="mt-1 text-sm text-slate-600">
            {totalFinished} of {steps.length} steps finished or skipped. {savedLabel}.
          </p>
        </div>
        <div className="min-w-[180px]">
          <div className="h-2 rounded-full bg-slate-200" aria-hidden="true">
            <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="mt-1 text-right text-xs font-semibold text-slate-600">{progressPercent}%</div>
        </div>
      </div>

      <ol className="space-y-3">
        {steps.map((step, index) => {
          const isCompleted = progress.completed.includes(index);
          const isSkipped = progress.skipped.includes(index);
          const isActive = progress.currentIndex === index && !isCompleted && !isSkipped;
          const status = isCompleted ? 'Done' : isSkipped ? 'Skipped' : isActive ? 'Current' : 'Pending';
          const statusClass = isCompleted
            ? 'bg-emerald-100 text-emerald-800'
            : isSkipped
              ? 'bg-amber-100 text-amber-800'
              : isActive
                ? 'bg-brand-100 text-brand-800'
                : 'bg-slate-100 text-slate-600';
          const stepHref = step.href ?? '#final-plan';

          return (
            <li
              key={`${step.title}-${index}`}
              data-testid={`track-step-${index}`}
              className={`rounded-lg border bg-white p-4 ${isActive ? 'border-brand-300 shadow-sm' : 'border-slate-200'}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-900 px-2 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusClass}`}>{status}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{step.description}</p>
                  <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {step.type}
                  </div>
                </div>
              </div>

              {(step.whyNow || step.resultToWatch?.length || step.checkpoint || step.ifResultLooksBad || step.carryForward) && (
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  {step.whyNow && (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Why this comes now</h4>
                      <p className="mt-1 text-sm text-slate-700">{step.whyNow}</p>
                    </div>
                  )}
                  {step.resultToWatch && step.resultToWatch.length > 0 && (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Result to watch</h4>
                      <ul className="mt-1 list-disc pl-4 text-sm text-slate-700">
                        {step.resultToWatch.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  )}
                  {(step.checkpoint || step.ifResultLooksBad) && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-amber-800">Decision checkpoint</h4>
                      {step.checkpoint && <p className="mt-1 text-sm text-amber-950">{step.checkpoint}</p>}
                      {step.ifResultLooksBad && <p className="mt-2 text-sm text-amber-950"><strong>If the result looks bad:</strong> {step.ifResultLooksBad}</p>}
                    </div>
                  )}
                </div>
              )}

              {(step.carryForward || step.relatedGuide || step.relatedTemplate) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                  {step.carryForward && (
                    <span className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 font-semibold text-emerald-900">
                      Carry forward: {step.carryForward}
                    </span>
                  )}
                  {step.relatedGuide && (
                    <a className="rounded-md bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 no-underline hover:bg-slate-200" href={step.relatedGuide.href}>
                      Guide: {step.relatedGuide.title}
                    </a>
                  )}
                  {step.relatedTemplate && (
                    <a className="rounded-md bg-slate-100 px-3 py-1.5 font-semibold text-slate-700 no-underline hover:bg-slate-200" href={step.relatedTemplate.href}>
                      Template: {step.relatedTemplate.title}
                    </a>
                  )}
                </div>
              )}

              <div className="mt-4 grid gap-2 sm:grid-cols-4">
                <a
                  href={stepHref}
                  className="btn-sm bg-brand-600 text-white no-underline hover:bg-brand-700"
                  onClick={() => markCurrent(index)}
                >
                  Start step
                </a>
                <button
                  type="button"
                  className="btn-sm bg-slate-100 text-slate-900 hover:bg-slate-200"
                  onClick={() => skipStep(index)}
                >
                  Skip step
                </button>
                <button
                  type="button"
                  className="btn-sm bg-white text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50"
                  onClick={() => saveProgress(index)}
                >
                  Save progress
                </button>
                <button
                  type="button"
                  className="btn-sm bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={() => completeStep(index)}
                >
                  Continue
                </button>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

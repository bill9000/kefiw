import { useEffect, useMemo, useState } from 'react';

type RiskValue = 'green' | 'yellow' | 'red';

interface CareArea {
  id: string;
  label: string;
}

interface SummaryState {
  person: string;
  livingSituation: string;
  mainConcerns: string;
  monthlyCost: number;
  caregiverHours: number;
  insuranceAssumptions: string;
  safetyRisks: string;
  taskOwners: string;
  backupCaregiver: string;
  missingDocuments: string;
  providerQuestions: string;
  nextSteps: string;
  guidesUsed: string;
  calculatorsUsed: string;
  reviewDays: number;
  risks: Record<string, RiskValue>;
}

interface PlaybookSummaryDraft {
  playbookId?: string;
  playbookTitle?: string;
  reviewDays?: number;
  situation?: {
    triggerEvent?: string;
    currentLocation?: string;
    primaryConcern?: string;
    urgencyLevel?: string;
  };
  safetyNotes?: string[];
  redFlags?: string[];
  documentedEvents?: Record<string, string>;
  recommendedNextSteps?: string[];
  recommendedTools?: Array<{ name: string; href: string; reason: string }>;
  questionsToAsk?: string[];
}

const careAreas: CareArea[] = [
  { id: 'bathing', label: 'Bathing and hygiene' },
  { id: 'toileting', label: 'Toileting and incontinence' },
  { id: 'meals', label: 'Meals and hydration' },
  { id: 'medication', label: 'Medication routine' },
  { id: 'mobility', label: 'Mobility and falls' },
  { id: 'memory', label: 'Memory and judgment' },
  { id: 'nighttime', label: 'Nighttime safety' },
  { id: 'supervision', label: 'Supervision coverage' },
  { id: 'workload', label: 'Caregiver capacity' },
  { id: 'money', label: 'Money and payment plan' },
];

const defaultRisks = careAreas.reduce<Record<string, RiskValue>>((acc, area) => {
  acc[area.id] = 'yellow';
  return acc;
}, {});

const defaultState: SummaryState = {
  person: '',
  livingSituation: '',
  mainConcerns: '',
  monthlyCost: 0,
  caregiverHours: 0,
  insuranceAssumptions: '',
  safetyRisks: '',
  taskOwners: '',
  backupCaregiver: '',
  missingDocuments: '',
  providerQuestions: '',
  nextSteps: '',
  guidesUsed: '',
  calculatorsUsed: '',
  reviewDays: 30,
  risks: defaultRisks,
};

const storageKey = 'kefiw:family-care-plan-summary';
const playbookDraftKey = 'kefiw:playbook-summary-draft';

function money(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '$0';
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function appendUniqueLines(existing: string, additions: string[]): string {
  const current = splitLines(existing);
  const seen = new Set(current.map((line) => line.toLowerCase()));
  const next = [...current];
  additions
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const key = line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        next.push(line);
      }
    });
  return next.join('\n');
}

function mergePlaybookDraft(state: SummaryState, draft: PlaybookSummaryDraft): SummaryState {
  const documentedEvents = draft.documentedEvents ?? {};
  const caregiverHours = Number(documentedEvents.caregiving_hours || documentedEvents.caregiver_hours || documentedEvents.unpaid_hours);
  const monthlyCost = Number(documentedEvents.current_cost || documentedEvents.support_cost || documentedEvents.current_monthly_cost || documentedEvents.monthly_care_cost);
  const annualCost = Number(documentedEvents.estimated_annual_cost);
  const monthlyFromAnnual = Number.isFinite(annualCost) && annualCost > 0 ? Math.round(annualCost / 12) : 0;
  return {
    ...state,
    livingSituation: state.livingSituation || draft.situation?.currentLocation || '',
    mainConcerns: appendUniqueLines(state.mainConcerns, [
      draft.playbookTitle ? `Playbook: ${draft.playbookTitle}` : '',
      draft.situation?.triggerEvent ? `Trigger: ${draft.situation.triggerEvent}` : '',
      draft.situation?.primaryConcern ? `Primary concern: ${draft.situation.primaryConcern}` : '',
    ]),
    monthlyCost: state.monthlyCost || (Number.isFinite(monthlyCost) && monthlyCost > 0 ? monthlyCost : monthlyFromAnnual),
    caregiverHours: state.caregiverHours || (Number.isFinite(caregiverHours) ? caregiverHours : 0),
    insuranceAssumptions: appendUniqueLines(state.insuranceAssumptions, [
      documentedEvents.current_coverage ? `Current coverage: ${documentedEvents.current_coverage}` : '',
      documentedEvents.irmaa_notes ? `IRMAA notes: ${documentedEvents.irmaa_notes}` : '',
      documentedEvents.policy_company ? `Policy company: ${documentedEvents.policy_company}` : '',
      documentedEvents.benefit_trigger ? `Benefit trigger: ${documentedEvents.benefit_trigger}` : '',
      documentedEvents.elimination_period ? `Elimination period: ${documentedEvents.elimination_period}` : '',
      documentedEvents.covered_settings ? `Covered settings: ${documentedEvents.covered_settings}` : '',
      documentedEvents.payment_sources ? `Payment sources: ${documentedEvents.payment_sources}` : '',
      documentedEvents.provider_medicaid_status ? `Medicaid/provider status: ${documentedEvents.provider_medicaid_status}` : '',
    ]),
    safetyRisks: appendUniqueLines(state.safetyRisks, [
      ...(draft.safetyNotes ?? []),
      ...(draft.redFlags ?? []).slice(0, 5),
      documentedEvents.driving_events ? `Driving events: ${documentedEvents.driving_events}` : '',
      documentedEvents.immediate_risk ? `Immediate road risk: ${documentedEvents.immediate_risk}` : '',
      documentedEvents.medical_or_memory_concerns ? `Medical or memory concerns: ${documentedEvents.medical_or_memory_concerns}` : '',
      documentedEvents.no_drive_threshold ? `No-drive threshold: ${documentedEvents.no_drive_threshold}` : '',
      documentedEvents.concern_facts ? `Facility concern facts: ${documentedEvents.concern_facts}` : '',
      documentedEvents.resident_impact ? `Resident impact: ${documentedEvents.resident_impact}` : '',
      documentedEvents.escalation_plan ? `Escalation plan: ${documentedEvents.escalation_plan}` : '',
    ]),
    taskOwners: appendUniqueLines(state.taskOwners, [
      documentedEvents.current_primary_caregiver ? `Primary caregiver: ${documentedEvents.current_primary_caregiver}` : '',
      documentedEvents.tasks_needing_owner ? `Tasks needing owner: ${documentedEvents.tasks_needing_owner}` : '',
      documentedEvents.specific_request ? `Specific request: ${documentedEvents.specific_request}` : '',
      documentedEvents.family_contributions ? `Family contributions: ${documentedEvents.family_contributions}` : '',
      documentedEvents.reimbursement_rule ? `Reimbursement rule: ${documentedEvents.reimbursement_rule}` : '',
      documentedEvents.spending_threshold ? `No-surprise threshold: ${documentedEvents.spending_threshold}` : '',
      documentedEvents.payment_sources ? `Payment sources: ${documentedEvents.payment_sources}` : '',
    ]),
    missingDocuments: appendUniqueLines(state.missingDocuments, [
      documentedEvents.documents_needed ? `Documents needed: ${documentedEvents.documents_needed}` : '',
      documentedEvents.open_questions ? `Open questions: ${documentedEvents.open_questions}` : '',
      documentedEvents.professional_review_items ? `Professional review items: ${documentedEvents.professional_review_items}` : '',
    ]),
    providerQuestions: appendUniqueLines(state.providerQuestions, [
      ...(draft.questionsToAsk ?? []),
      documentedEvents.requested_outcome ? `Requested outcome: ${documentedEvents.requested_outcome}` : '',
      documentedEvents.professional_review_items ? `Professional review items: ${documentedEvents.professional_review_items}` : '',
    ]),
    nextSteps: appendUniqueLines(state.nextSteps, draft.recommendedNextSteps ?? []),
    guidesUsed: appendUniqueLines(state.guidesUsed, draft.playbookTitle ? [draft.playbookTitle] : []),
    calculatorsUsed: appendUniqueLines(state.calculatorsUsed, (draft.recommendedTools ?? []).map((tool) => tool.name)),
    reviewDays: draft.reviewDays && state.reviewDays === defaultState.reviewDays ? draft.reviewDays : state.reviewDays,
  };
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
}): JSX.Element {
  return (
    <label className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        type={type}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        value={value}
        min={type === 'number' ? 0 : undefined}
        onChange={(event) => onChange(type === 'number' ? Number(event.target.value) : event.target.value)}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}): JSX.Element {
  return (
    <label className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <textarea
        className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function RiskBadge({ value }: { value: RiskValue }): JSX.Element {
  const classes =
    value === 'green'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
      : value === 'yellow'
        ? 'border-amber-200 bg-amber-50 text-amber-950'
        : 'border-rose-200 bg-rose-50 text-rose-950';
  const label = value === 'green' ? 'Green' : value === 'yellow' ? 'Yellow' : 'Red';
  return <span className={`rounded border px-2 py-1 text-xs font-semibold ${classes}`}>{label}</span>;
}

export default function FamilyCarePlanSummary(): JSX.Element {
  const [state, setState] = useState<SummaryState>(defaultState);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      let nextState = defaultState;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SummaryState>;
        nextState = { ...defaultState, ...parsed, risks: { ...defaultRisks, ...(parsed.risks ?? {}) } };
      }
      const draftRaw = window.localStorage.getItem(playbookDraftKey);
      if (draftRaw) {
        nextState = mergePlaybookDraft(nextState, JSON.parse(draftRaw) as PlaybookSummaryDraft);
      }
      setState(nextState);
    } catch {
      setState(defaultState);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Local persistence is helpful but not required.
    }
  }, [state]);

  const annualCost = state.monthlyCost * 12;
  const createdDate = useMemo(() => new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), []);
  const reviewDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + Math.max(1, state.reviewDays || 30));
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  }, [state.reviewDays]);
  const riskCounts = useMemo(() => {
    return careAreas.reduce(
      (acc, area) => {
        acc[state.risks[area.id]] += 1;
        return acc;
      },
      { green: 0, yellow: 0, red: 0 } as Record<RiskValue, number>,
    );
  }, [state.risks]);

  const update = <Key extends keyof SummaryState>(key: Key, value: SummaryState[Key]): void => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const updateRisk = (id: string, value: RiskValue): void => {
    setState((current) => ({ ...current, risks: { ...current.risks, [id]: value } }));
  };

  const summaryText = useMemo(() => {
    const redAreas = careAreas.filter((area) => state.risks[area.id] === 'red').map((area) => area.label).join(', ') || 'None listed';
    const yellowAreas = careAreas.filter((area) => state.risks[area.id] === 'yellow').map((area) => area.label).join(', ') || 'None listed';
    return [
      'Kefiw Family Care Plan Summary',
      `Date created: ${createdDate}`,
      `Review date: ${reviewDate}`,
      `Person needing care: ${state.person || 'Not entered'}`,
      `Current living situation: ${state.livingSituation || 'Not entered'}`,
      `Main concerns: ${state.mainConcerns || 'Not entered'}`,
      `Estimated monthly cost: ${money(state.monthlyCost)}`,
      `Estimated annual cost: ${money(annualCost)}`,
      `Estimated caregiver hours: ${state.caregiverHours || 0} per week`,
      `Red care needs: ${redAreas}`,
      `Yellow care needs: ${yellowAreas}`,
      `Top safety risks: ${state.safetyRisks || 'Not entered'}`,
      `Medicare / insurance assumptions: ${state.insuranceAssumptions || 'Not entered'}`,
      `Task owners: ${state.taskOwners || 'Not entered'}`,
      `Backup caregiver: ${state.backupCaregiver || 'Not entered'}`,
      `Documents missing: ${state.missingDocuments || 'Not entered'}`,
      `Questions to ask providers: ${state.providerQuestions || 'Not entered'}`,
      `Next 3 steps: ${state.nextSteps || 'Not entered'}`,
      `Guides used: ${state.guidesUsed || 'Not entered'}`,
      `Calculators used: ${state.calculatorsUsed || 'Not entered'}`,
    ].join('\n');
  }, [annualCost, createdDate, reviewDate, state]);

  const copySummary = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)]" aria-label="Family care plan summary builder">
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Build the summary</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Keep details practical. Use initials when possible, avoid account numbers, and share sensitive information only with appropriate people.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InputField label="Person needing care" value={state.person} onChange={(value) => update('person', String(value))} />
            <InputField label="Current living situation" value={state.livingSituation} onChange={(value) => update('livingSituation', String(value))} />
            <InputField label="Estimated monthly cost" value={state.monthlyCost} type="number" onChange={(value) => update('monthlyCost', Number(value))} />
            <InputField label="Estimated caregiver hours per week" value={state.caregiverHours} type="number" onChange={(value) => update('caregiverHours', Number(value))} />
          </div>
          <div className="mt-3 grid gap-3">
            <TextAreaField label="Main care concerns" value={state.mainConcerns} onChange={(value) => update('mainConcerns', value)} placeholder="Falls, medication, meals, memory, cost, caregiver workload..." />
            <TextAreaField label="Top safety risks" value={state.safetyRisks} onChange={(value) => update('safetyRisks', value)} placeholder="Nighttime bathroom trips, wandering, missed medication, unsafe transfers..." />
            <TextAreaField label="Medicare / insurance assumptions" value={state.insuranceAssumptions} onChange={(value) => update('insuranceAssumptions', value)} placeholder="What is assumed covered, not covered, pending, or unclear?" />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">Green / yellow / red care needs</h2>
          <p className="mt-1 text-sm text-slate-600">Green is stable. Yellow is fragile. Red is unsafe, uncovered, or unsustainable.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {careAreas.map((area) => (
              <label key={area.id} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-900">{area.label}</span>
                <select
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                  value={state.risks[area.id]}
                  onChange={(event) => updateRisk(area.id, event.target.value as RiskValue)}
                >
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="red">Red</option>
                </select>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-slate-900">Ownership and next steps</h2>
          <div className="mt-4 grid gap-3">
            <TextAreaField label="Family task owners" value={state.taskOwners} onChange={(value) => update('taskOwners', value)} placeholder="Medication refills - Ana. Appointments - Chris. Bills - Sam." />
            <InputField label="Backup caregiver" value={state.backupCaregiver} onChange={(value) => update('backupCaregiver', String(value))} />
            <TextAreaField label="Documents missing" value={state.missingDocuments} onChange={(value) => update('missingDocuments', value)} placeholder="Health care proxy, financial POA, HIPAA release, insurance cards..." />
            <TextAreaField label="Questions to ask providers" value={state.providerQuestions} onChange={(value) => update('providerQuestions', value)} />
            <TextAreaField label="Next 3 steps" value={state.nextSteps} onChange={(value) => update('nextSteps', value)} placeholder="1. Call clinician. 2. Run home care cost estimate. 3. Schedule family meeting." />
            <TextAreaField label="Guides used" value={state.guidesUsed} onChange={(value) => update('guidesUsed', value)} />
            <TextAreaField label="Calculators used" value={state.calculatorsUsed} onChange={(value) => update('calculatorsUsed', value)} />
            <InputField label="Review again in how many days?" value={state.reviewDays} type="number" onChange={(value) => update('reviewDays', Number(value))} />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-brand-200 bg-white p-4 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Family summary</div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Your Family Care Plan Summary</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400" onClick={() => window.print()}>
              Print
            </button>
            <button type="button" className="rounded-md bg-brand-700 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-800" onClick={copySummary}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="font-semibold text-slate-900">{state.person || 'Person needing care'}</div>
            <div className="mt-1 text-slate-700">{state.livingSituation || 'Current living situation not entered'}</div>
            <div className="mt-2 text-xs text-slate-500">Created {createdDate}. Review {reviewDate}.</div>
          </div>

          <dl className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-md border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly</dt>
              <dd className="mt-1 font-semibold text-slate-950">{money(state.monthlyCost)}</dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Annual</dt>
              <dd className="mt-1 font-semibold text-slate-950">{money(annualCost)}</dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hours</dt>
              <dd className="mt-1 font-semibold text-slate-950">{state.caregiverHours || 0}/week</dd>
            </div>
          </dl>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="font-semibold text-slate-900">Care risk count</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-900">Green {riskCounts.green}</span>
              <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-950">Yellow {riskCounts.yellow}</span>
              <span className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-950">Red {riskCounts.red}</span>
            </div>
            <div className="mt-3 grid gap-1">
              {careAreas.map((area) => (
                <div key={area.id} className="flex items-center justify-between gap-2 text-xs">
                  <span>{area.label}</span>
                  <RiskBadge value={state.risks[area.id]} />
                </div>
              ))}
            </div>
          </div>

          {[
            ['Main care concerns', splitLines(state.mainConcerns)],
            ['Top safety risks', splitLines(state.safetyRisks)],
            ['Medicare / insurance assumptions', splitLines(state.insuranceAssumptions)],
            ['Family task owners', splitLines(state.taskOwners)],
            ['Backup caregiver', splitLines(state.backupCaregiver)],
            ['Documents missing', splitLines(state.missingDocuments)],
            ['Questions to ask providers', splitLines(state.providerQuestions)],
            ['Next 3 steps', splitLines(state.nextSteps)],
            ['Guides used', splitLines(state.guidesUsed)],
            ['Calculators used', splitLines(state.calculatorsUsed)],
          ].map(([title, items]) => (
            <div key={String(title)} className="rounded-md border border-slate-200 p-3">
              <div className="font-semibold text-slate-900">{String(title)}</div>
              {Array.isArray(items) && items.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : (
                <p className="mt-1 text-slate-500">Not entered.</p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-xs leading-5 text-cyan-950">
          Kefiw summaries are educational planning aids. Confirm medical, legal, tax, financial, insurance, benefits, and emergency decisions with qualified sources.
        </p>
      </aside>
    </section>
  );
}

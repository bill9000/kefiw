import { useMemo, useState } from 'react';

interface Recommendation {
  title: string;
  why: string;
  steps: string[];
  calculator: { label: string; href: string };
  checklist: { label: string; href: string };
  playbook: { label: string; href: string };
  escalate: string;
}

type IntakeState = {
  role: string;
  trigger: string;
  location: string;
  concern: string;
  urgency: string;
  format: string;
};

const defaultState: IntakeState = {
  role: 'someone-else',
  trigger: 'fall',
  location: 'home-alone',
  concern: 'safety',
  urgency: 'today',
  format: 'path',
};

const triggers = [
  { value: 'fall', label: 'Fall or near-fall' },
  { value: 'hospital', label: 'Hospitalization or discharge' },
  { value: 'memory', label: 'Memory or dementia change' },
  { value: 'cost', label: 'Cost concern' },
  { value: 'burnout', label: 'Caregiver burnout' },
  { value: 'medicare', label: 'Medicare or insurance question' },
  { value: 'facility', label: 'Facility decision' },
];

const locations = [
  { value: 'home-alone', label: 'Home alone' },
  { value: 'home-family', label: 'Home with family' },
  { value: 'hospital', label: 'Hospital' },
  { value: 'rehab', label: 'Rehab' },
  { value: 'assisted-living', label: 'Assisted living' },
  { value: 'nursing-home', label: 'Nursing home' },
];

const concerns = [
  { value: 'safety', label: 'Safety' },
  { value: 'cost', label: 'Cost' },
  { value: 'workload', label: 'Caregiver workload' },
  { value: 'memory', label: 'Memory' },
  { value: 'medication', label: 'Medication' },
  { value: 'family', label: 'Family conflict' },
  { value: 'insurance', label: 'Insurance' },
];

function baseRecommendation(state: IntakeState): Recommendation {
  if (state.trigger === 'hospital' || state.location === 'hospital' || state.location === 'rehab') {
    return {
      title: 'Start with a discharge and first-night plan',
      why: 'Hospital and rehab transitions fail when medication changes, equipment, bathroom needs, follow-up, and coverage questions are unclear.',
      steps: [
        'Ask what must happen during the first night after discharge.',
        'Confirm medication changes, equipment delivery, follow-up appointments, and after-hours contact.',
        'Run a care-needs check before assuming home will work.',
        'Compare home care, rehab, or facility costs if recovery is incomplete.',
      ],
      calculator: { label: 'Care Needs Checklist', href: '/care/care-needs-checklist/' },
      checklist: { label: 'Care Needs Green / Yellow / Red Worksheet', href: '/care/guides/care-needs-green-yellow-red-worksheet/' },
      playbook: { label: 'Hospital Discharge Is Coming - What Should We Ask?', href: '/care/playbooks/hospital-discharge-coming/' },
      escalate: 'Escalate if toileting, transfers, medication, food, equipment, or supervision are not covered at the discharge destination.',
    };
  }

  if (state.trigger === 'memory' || state.concern === 'memory') {
    return {
      title: 'Start with dementia safety and supervision',
      why: 'Memory changes become care decisions when wandering, nighttime confusion, medication, stove safety, driving, or being alone becomes unreliable.',
      steps: [
        'Write down the last three safety events and when they happened.',
        'Identify uncovered supervision hours, especially evenings and overnight.',
        'Compare home supervision, adult day care, respite, assisted living, and memory care.',
        'Set a threshold for when home is no longer safe enough.',
      ],
      calculator: { label: 'Memory Care Cost Calculator', href: '/care/memory-care-cost-calculator/' },
      checklist: { label: 'Memory Care Evaluation Scorecard', href: '/care/guides/memory-care-evaluation-scorecard/' },
      playbook: { label: 'Dementia Safety Is Getting Worse', href: '/care/playbooks/dementia-safety-getting-worse/' },
      escalate: 'Escalate for wandering, exit-seeking, unsafe driving, sudden confusion, aggression, medication failure, or an exhausted caregiver who cannot keep watch.',
    };
  }

  if (state.trigger === 'cost' || state.concern === 'cost') {
    return {
      title: 'Start by comparing full cost and uncovered hours',
      why: 'The cheapest-looking plan can fail if it ignores supervision, supplies, medication support, transportation, respite, and unpaid family hours.',
      steps: [
        'Write the current monthly care cost and family hours per week.',
        'Run home care and senior care cost scenarios.',
        'Print a family budget worksheet before discussing who pays.',
        'Compare adult day care, respite, assisted living, memory care, and benefits screening.',
      ],
      calculator: { label: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/' },
      checklist: { label: 'Family Care Budget Worksheet', href: '/care/guides/family-care-budget-worksheet/' },
      playbook: { label: 'Senior Care Costs Are Becoming Unmanageable', href: '/care/playbooks/senior-care-costs-unmanageable/' },
      escalate: 'Escalate when cost cutting leaves unsafe gaps, one caregiver covers everything, or paid hours are rising faster than the family can sustain.',
    };
  }

  if (state.trigger === 'burnout' || state.concern === 'workload') {
    return {
      title: 'Start by counting the real caregiver workload',
      why: 'Burnout is often a sign that the plan depends on one person, not that the caregiver needs more encouragement.',
      steps: [
        'Track care hours for a week, including supervision and paperwork.',
        'Name the task that is unsafe or unsustainable.',
        'Ask family for task ownership, not general help.',
        'Add respite, adult day care, home care, or a facility comparison if workload is too large.',
      ],
      calculator: { label: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/' },
      checklist: { label: 'Caregiver Stress and Burnout Self-Check', href: '/care/guides/caregiver-stress-burnout-self-check/' },
      playbook: { label: 'Caregiver Is Burning Out', href: '/care/playbooks/caregiver-burning-out/' },
      escalate: 'Escalate immediately if the caregiver feels unsafe, has not slept for multiple nights, is making dangerous mistakes, or may harm themselves or someone else.',
    };
  }

  if (state.trigger === 'medicare' || state.concern === 'insurance') {
    return {
      title: 'Start with must-have coverage, then compare cost',
      why: 'Medicare and insurance decisions should verify doctors, drugs, pharmacies, hospitals, plan rules, and bad-year exposure before picking a plan.',
      steps: [
        'List must-have doctors, drugs, pharmacies, hospitals, travel needs, and budget limits.',
        'Compare plan fit before comparing premium.',
        'Check prior authorization, referrals, pharmacy pricing, and annual out-of-pocket risk.',
        'Confirm details with Medicare, SHIP, plan documents, or a qualified professional.',
      ],
      calculator: { label: 'Medicare Cost Planner', href: '/care/medicare-cost-planner/' },
      checklist: { label: 'Medicare Plan Comparison Worksheet', href: '/care/guides/medicare-plan-comparison-worksheet/' },
      playbook: { label: 'Medicare Open Enrollment Review', href: '/care/playbooks/medicare-open-enrollment-review/' },
      escalate: 'Escalate when a must-have doctor, drug, hospital, or pharmacy is not covered, or plan rules are too hard to manage safely.',
    };
  }

  if (state.trigger === 'facility' || state.location === 'assisted-living' || state.location === 'nursing-home') {
    return {
      title: 'Start with care fit, invoice clarity, and discharge rules',
      why: 'Facility choices should be compared by care needs, real monthly bill, family communication, safety process, and contract terms, not the lobby tour.',
      steps: [
        'List must-cover care needs before touring.',
        'Ask for a sample invoice, fee schedule, care-level explanation, discharge policy, and contract.',
        'Use the same scorecard for each facility.',
        'Ask who the family calls after admission if something changes.',
      ],
      calculator: { label: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/' },
      checklist: { label: 'Senior Care Decision Worksheet', href: '/care/guides/senior-care-decision-worksheet/' },
      playbook: { label: 'We Need to Choose a Facility This Week', href: '/care/playbooks/choose-care-facility-this-week/' },
      escalate: 'Escalate if pricing, medication fees, discharge rules, family payment language, or care limits are vague or only verbal.',
    };
  }

  return {
    title: 'Start with safety and recent events',
    why: 'A fall, near-fall, or safety concern should trigger a baseline check, documentation, home review, and care-needs reassessment.',
    steps: [
      'Ask what is normal for this person and what changed.',
      'Write down the date, time, location, symptoms, and what happened before the concern.',
      'Use urgency guidance if symptoms are new, severe, or confusing.',
      'Reassess care needs, home safety, and caregiver coverage this week.',
    ],
    calculator: { label: 'Care Urgency Check', href: '/health/medical-triage/' },
    checklist: { label: 'Fall and Near-Fall Log', href: '/care/guides/fall-near-fall-log/' },
    playbook: { label: 'My Parent Had a Fall - What Now?', href: '/care/playbooks/parent-had-a-fall/' },
    escalate: 'Escalate for head injury, new confusion, severe pain, new weakness, chest discomfort, shortness of breath, repeated falls, or inability to walk.',
  };
}

function adjustedRecommendation(state: IntakeState): Recommendation {
  const recommendation = baseRecommendation(state);
  if (state.concern === 'family') {
    return {
      ...recommendation,
      title: 'Start with task ownership before the family conversation',
      why: 'Family conflict becomes more workable when the discussion uses facts, task owners, backup owners, costs, and a review date.',
      calculator: { label: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/' },
      checklist: { label: 'Family Meeting Agenda and Notes Template', href: '/care/guides/family-care-meeting-agenda-template/' },
      playbook: { label: 'A Sibling Won\'t Help', href: '/care/playbooks/sibling-wont-help/' },
    };
  }
  if (state.urgency === 'emergency') {
    return {
      ...recommendation,
      title: 'Do not wait on a planning tool',
      why: 'If this may be an emergency, emergency care comes before calculators, guides, worksheets, or family meetings.',
      steps: ['Call emergency services now if someone may be in immediate danger.', ...recommendation.steps],
      escalate: 'Use emergency services for immediate danger, severe symptoms, sudden major change, or whenever you are unsure whether waiting is safe.',
    };
  }
  return recommendation;
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}): JSX.Element {
  return (
    <label className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <select
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function StartHereCareIntake(): JSX.Element {
  const [state, setState] = useState<IntakeState>(defaultState);
  const recommendation = useMemo(() => adjustedRecommendation(state), [state]);
  const update = (key: keyof IntakeState, value: string): void => {
    setState((current) => ({ ...current, [key]: value }));
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)]" aria-label="Care Start Here guided intake">
      <form className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Answer a few questions</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          This does not diagnose, triage clinically, or choose a plan. It routes you to the most useful next Kefiw resource.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Who are you planning for?"
            value={state.role}
            onChange={(value) => update('role', value)}
            options={[
              { value: 'someone-else', label: 'Someone else' },
              { value: 'myself', label: 'Myself' },
              { value: 'family', label: 'A family decision' },
            ]}
          />
          <SelectField label="What triggered this?" value={state.trigger} onChange={(value) => update('trigger', value)} options={triggers} />
          <SelectField label="Where is the person now?" value={state.location} onChange={(value) => update('location', value)} options={locations} />
          <SelectField label="Biggest concern" value={state.concern} onChange={(value) => update('concern', value)} options={concerns} />
          <SelectField
            label="How urgent does it feel?"
            value={state.urgency}
            onChange={(value) => update('urgency', value)}
            options={[
              { value: 'emergency', label: 'Emergency or immediate danger' },
              { value: 'today', label: 'Needs action today' },
              { value: 'week', label: 'Needs action this week' },
              { value: 'planning', label: 'Planning ahead' },
            ]}
          />
          <SelectField
            label="What do you want first?"
            value={state.format}
            onChange={(value) => update('format', value)}
            options={[
              { value: 'path', label: 'Recommended path' },
              { value: 'calculator', label: 'Calculator' },
              { value: 'worksheet', label: 'Checklist or worksheet' },
              { value: 'guide', label: 'Guide or playbook' },
              { value: 'track', label: 'Care track' },
            ]}
          />
        </div>
      </form>

      <aside className="rounded-lg border border-brand-200 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Recommended start</div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{recommendation.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">{recommendation.why}</p>

        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
          <h3 className="text-sm font-semibold text-slate-900">Path</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-6 text-slate-700">
            {recommendation.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="mt-4 grid gap-2">
          <a className="rounded-md bg-brand-700 px-3 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-800" href={recommendation.calculator.href}>
            Start with {recommendation.calculator.label}
          </a>
          <a className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400" href={recommendation.checklist.href}>
            Print {recommendation.checklist.label}
          </a>
          <a className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400" href={recommendation.playbook.href}>
            Open {recommendation.playbook.label}
          </a>
          <a className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400" href="/tracks/plan-senior-care/">
            Use Plan Senior Care Track
          </a>
        </div>

        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          <strong>When to escalate:</strong> {recommendation.escalate}
        </div>
      </aside>
    </section>
  );
}

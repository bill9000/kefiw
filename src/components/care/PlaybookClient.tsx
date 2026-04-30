import { useEffect, useMemo, useState } from 'react';
import type { CarePlaybook, DocumentationField, PlaybookAction, PlaybookQuestion, ToolRecommendation } from '~/data/care-playbooks';

type IntakeValue = string | string[] | boolean | number | '';
type IntakeState = Record<string, IntakeValue>;
type DocumentationState = Record<string, string>;
type ActionState = Record<string, boolean>;

const summaryDraftKey = 'kefiw:playbook-summary-draft';
const safetyOverrideTriggers = new Set([
  'immediate_danger',
  'missing_person',
  'suspected_abuse',
  'medical_emergency',
  'unsafe_to_be_alone_now',
  'caregiver_feels_unsafe',
  'severe_or_sudden_change',
  'missing_or_wandered',
  'immediate_safety_risk',
  'caregiver_at_risk',
  'immediate_road_risk',
]);

function formatValue(value: IntakeValue | string | undefined): string {
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not entered';
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  if (value === '' || value === undefined) return 'Not entered';
  return String(value);
}

function formatTag(value?: PlaybookAction['safetyTag']): string {
  if (!value) return 'Action';
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + Math.max(1, days));
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function emitPlaybookEvent(playbookId: string, eventName: string, detail: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent('kefiw:playbook-event', {
      detail: { playbookId, eventName, ...detail },
    }),
  );
}

function isSafetyOverrideTriggered(playbook: CarePlaybook, intake: IntakeState): boolean {
  return playbook.intakeQuestions.some((question) => {
    const value = intake[question.id];
    if (safetyOverrideTriggers.has(question.id) && value === true) return true;
    if (question.safetyCritical) {
      if (question.type === 'boolean' && value === true) return true;
      if (question.id === 'burnout_level' && value === 'Unsafe') return true;
      if (question.id === 'unsafe_alone' && (value === 'No' || value === 'Not sure')) return true;
    }
    if (question.id === 'can_move_normally' && value === 'No') return true;
    return false;
  });
}

function personalizedCallouts(playbook: CarePlaybook, intake: IntakeState): Array<{ title: string; body: string }> {
  const callouts: Array<{ title: string; body: string }> = [];
  if (playbook.id === 'hospital-discharge-coming') {
    const timing = intake.discharge_timing;
    const ready = intake.caregiver_ready;
    const concerns = Array.isArray(intake.first_night_concern) ? intake.first_night_concern : [];
    if ((timing === 'Today' || timing === 'Tomorrow') && (ready === 'No' || ready === 'Not sure')) {
      callouts.push({
        title: 'Ask for a safe discharge plan now',
        body:
          'Before discharge, ask what care is required, who will provide it, what equipment is needed, what medications changed, and who to call after hours.',
      });
    }
    if (intake.planned_destination === 'Home alone' && concerns.length >= 2) {
      callouts.push({
        title: 'Home alone may need a stronger first-night plan',
        body:
          'Review toileting, medication, meals, mobility, emergency contacts, and whether the person can safely be alone.',
      });
    }
  }
  if (playbook.id === 'choose-care-facility-this-week') {
    const facilityTypes = Array.isArray(intake.facility_type_needed) ? intake.facility_type_needed : [];
    if (facilityTypes.includes('Memory care')) {
      callouts.push({
        title: 'Use the memory care scorecard',
        body:
          'Memory care should be evaluated for dementia training, wandering prevention, behavior support, nighttime coverage, and family communication.',
      });
    }
    if (facilityTypes.includes('Nursing home')) {
      callouts.push({
        title: 'Use the nursing home visit scorecard',
        body:
          'Nursing home decisions should clarify staffing, dignity, care planning, Medicare or Medicaid questions, and discharge planning.',
      });
    }
    if (intake.has_sample_invoice === false) {
      callouts.push({
        title: 'Ask for a sample invoice',
        body: 'Do not compare facilities by base rate only. Ask for a written estimate based on actual care needs.',
      });
    }
    if (intake.contract_reviewed === false) {
      callouts.push({
        title: 'Review the contract before signing',
        body:
          'Look for fees, discharge rules, rate increases, refund policy, responsible-party language, and arbitration terms.',
      });
    }
  }
  if (playbook.id === 'caregiver-burning-out') {
    if (intake.sleep_disrupted === true) {
      callouts.push({ title: 'Sleep disruption needs a plan', body: 'Add overnight relief, a call rule, or Sleep Reset to the relief plan.' });
    }
    if (intake.backup_exists === false) {
      callouts.push({ title: 'No backup is a care-plan risk', body: 'Create a backup caregiver plan before the next crisis.' });
    }
    if (intake.weekly_hours_known === 'No') {
      callouts.push({ title: 'Count the hours first', body: 'Use the Caregiver Hours Calculator before asking family to divide work.' });
    }
  }
  if (playbook.id === 'dementia-safety-getting-worse') {
    const changes = Array.isArray(intake.main_change) ? intake.main_change : [];
    if (intake.missing_or_wandered === true) {
      callouts.push({
        title: 'Possible wandering or missing-person emergency',
        body:
          'If the person is missing or may have wandered away, call emergency services or the appropriate local emergency contact now. After safety is addressed, document what happened and update the safety plan.',
      });
    }
    if (intake.unsafe_alone === 'No' || intake.unsafe_alone === 'Not sure') {
      callouts.push({
        title: 'Create a supervision plan',
        body: 'If the person cannot be safely left alone, use the Care Needs Checklist to identify coverage gaps and who owns each block of time.',
      });
    }
    if (changes.includes('Wandering or trying to leave')) {
      callouts.push({
        title: 'Wandering needs a written response plan',
        body: 'Use the Dementia Wandering Guide and compare whether memory care or more supervision may now be needed.',
      });
    }
    if (intake.caregiver_capacity === 'No') {
      callouts.push({
        title: 'Caregiver capacity is part of safety',
        body: 'Use the Caregiver Hours Calculator and a burnout guide before relying on one person to hold the plan together.',
      });
    }
  }
  if (playbook.id === 'parent-refuses-help') {
    const refused = Array.isArray(intake.refused_help_type) ? intake.refused_help_type : [];
    if (intake.immediate_safety_risk === true || intake.caregiver_at_risk === true) {
      callouts.push({
        title: 'Safety may need to come before persuasion',
        body:
          'If refusal is creating immediate danger, harm, severe neglect, unsafe driving, wandering, or urgent medical risk, seek urgent professional or emergency support.',
      });
    }
    if (intake.memory_or_judgment_concern === true) {
      callouts.push({
        title: 'Memory or judgment changes need professional context',
        body: 'Use the Care Needs Checklist and ask a clinician or qualified professional what safety supports are appropriate.',
      });
    }
    if (refused.includes('Home care')) {
      callouts.push({
        title: 'Start with a small home care trial',
        body: 'Consider pricing one narrow support task before framing the decision as full home care.',
      });
    }
    if (refused.includes('Assisted living')) {
      callouts.push({
        title: 'Touring is not committing',
        body: 'A facility tour can gather options without deciding to move today.',
      });
    }
  }
  if (playbook.id === 'home-care-too-expensive') {
    const drivers = Array.isArray(intake.main_cost_driver) ? intake.main_cost_driver : [];
    const alternatives = Array.isArray(intake.alternatives_considered) ? intake.alternatives_considered : [];
    if (intake.current_home_care_hours === '41-80' || intake.current_home_care_hours === '80+') {
      callouts.push({
        title: 'Compare higher-support settings',
        body: 'When home care reaches this many hours, compare assisted living or memory care against the full home plan, including family workload.',
      });
    }
    if (drivers.includes('Dementia supervision')) {
      callouts.push({
        title: 'Dementia supervision can change the comparison',
        body: 'Use the Memory Care Cost Calculator and dementia safety playbook if supervision is driving the bill.',
      });
    }
    if (!alternatives.includes('Adult day care')) {
      callouts.push({
        title: 'Adult day care may be worth checking',
        body: 'Day programs can sometimes reduce paid home care hours while protecting caregiver capacity.',
      });
    }
    if (intake.family_hours_remaining === 'Yes, a lot') {
      callouts.push({
        title: 'Count unpaid family hours',
        body: 'Home care may look cheaper because family is still covering transportation, meals, appointments, nights, or emergencies.',
      });
    }
  }
  if (playbook.id === 'aging-in-place-feels-unsafe') {
    const unsafe = Array.isArray(intake.what_feels_unsafe) ? intake.what_feels_unsafe : [];
    if (intake.living_situation === 'Lives alone' && intake.can_call_for_help !== 'Yes') {
      callouts.push({
        title: 'Emergency access gap',
        body:
          'A person living alone needs a reliable way to call for help and a plan for someone to check the home if they do not respond.',
      });
    }
    if (unsafe.includes('Falls') || unsafe.includes('Bathroom safety')) {
      callouts.push({
        title: 'Start with the exact fall or bathroom risk',
        body: 'Use the Home Safety Checklist before making broad decisions about staying home.',
      });
    }
    if (unsafe.includes('Wandering')) {
      callouts.push({
        title: 'Wandering changes home safety',
        body: 'Use the Dementia Wandering Guide and compare whether memory care or more supervision may be needed.',
      });
    }
    if (intake.local_backup === false) {
      callouts.push({
        title: 'No local backup is a plan gap',
        body: 'Use an emergency plan for an older adult living alone and decide who can physically respond.',
      });
    }
  }
  if (playbook.id === 'senior-care-costs-unmanageable') {
    const settings = Array.isArray(intake.current_care_setting) ? intake.current_care_setting : [];
    const sources = Array.isArray(intake.payment_sources) ? intake.payment_sources : [];
    if (settings.includes('Home care')) {
      callouts.push({
        title: 'Home care costs need hours and workload',
        body: 'Use the Home Care Cost Calculator and compare paid hours, unpaid family hours, and uncovered hours.',
      });
    }
    if (settings.includes('Memory care')) {
      callouts.push({
        title: 'Memory care cost should include supervision',
        body: 'Compare housing, care-level fees, medication support, nighttime coverage, and family workload.',
      });
    }
    if (sources.includes('Long-term care insurance')) {
      callouts.push({
        title: 'Verify the insurance offset',
        body: 'Use the Long-Term Care Insurance Claim Starter before assuming a policy will cover the current setting or provider.',
      });
    }
    if (intake.runway === 'Less than 3 months' || intake.runway === '3-6 months') {
      callouts.push({
        title: 'Short private-pay runway',
        body: 'Prepare Medicaid, provider, and professional-review questions before the payment source changes.',
      });
    }
    if (intake.family_paying === true) {
      callouts.push({
        title: 'Family payment needs a written rule',
        body: 'Document what is shared, what is reimbursed, who approves expenses, and when the budget is reviewed.',
      });
    }
  }
  if (playbook.id === 'medicaid-may-be-needed') {
    if (intake.asset_transfers === 'Yes' || intake.asset_transfers === 'Not sure') {
      callouts.push({
        title: 'Do not move assets before advice',
        body: 'Possible gifts, retitling, caregiver payments, or large transfers should be reviewed with state-specific Medicaid guidance.',
      });
    }
    if (intake.wants_home_care === true) {
      callouts.push({
        title: 'Ask about HCBS options',
        body: 'If the goal is staying home, review Medicaid Home and Community-Based Services options in the person\'s state.',
      });
    }
    if (intake.documents_ready !== '' && intake.documents_ready !== 'Yes') {
      callouts.push({
        title: 'Start the document box',
        body: 'Gather bank statements, income records, insurance policies, care invoices, legal documents, and provider notes.',
      });
    }
    if (intake.private_pay_timeline === 'Less than 3 months' || intake.private_pay_timeline === '3-6 months') {
      callouts.push({
        title: 'Short private-pay runway',
        body: 'Applications, documents, and provider transitions can take time. Get state-specific guidance promptly.',
      });
    }
  }
  if (playbook.id === 'long-term-care-insurance-claim-starter') {
    const settings = Array.isArray(intake.care_setting) ? intake.care_setting : [];
    if (intake.policy_found !== '' && intake.policy_found !== 'Yes') {
      callouts.push({
        title: 'Find the full policy',
        body: 'A brochure or summary is not enough to confirm benefit triggers, elimination period rules, covered settings, or provider requirements.',
      });
    }
    if (intake.claim_started === false) {
      callouts.push({
        title: 'Request the claim packet',
        body: 'Ask for claim forms, current benefit summary, invoice requirements, provider requirements, and appeal steps.',
      });
    }
    if (intake.elimination_period_known !== '' && intake.elimination_period_known !== 'Yes') {
      callouts.push({
        title: 'Elimination period can create a cash gap',
        body: 'Confirm whether days are calendar days or service days and whether paid care must occur for days to count.',
      });
    }
    if (settings.includes('Home care')) {
      callouts.push({
        title: 'Check provider requirements before hiring',
        body: 'Some policies have rules about agencies, caregivers, invoices, and care documentation.',
      });
    }
  }
  if (playbook.id === 'medicare-open-enrollment-review') {
    if (intake.drug_check_done !== '' && intake.drug_check_done !== 'Yes') {
      callouts.push({
        title: 'Check prescriptions before premiums',
        body: 'Use the exact medication list, dose, pharmacy, formulary, tier, and plan rules before choosing by premium.',
      });
    }
    if (intake.doctor_check_done !== '' && intake.doctor_check_done !== 'Yes') {
      callouts.push({
        title: 'Verify doctors and hospitals',
        body: 'Do not assume doctors, specialists, hospitals, or recurring providers are in-network for the coming plan year.',
      });
    }
    if (intake.plan_rules_concern === true) {
      callouts.push({
        title: 'Plan rules can change manageability',
        body: 'Review prior authorization, referrals, network rules, travel coverage, and caregiver paperwork burden.',
      });
    }
    if (intake.income_change === true) {
      callouts.push({
        title: 'IRMAA may need Social Security review',
        body: 'If household income fell after a life-changing event, Social Security has a process to request a lower income-related adjustment.',
      });
    }
    if (intake.needs_unbiased_help === true) {
      callouts.push({
        title: 'Use SHIP for unbiased counseling',
        body: 'SHIP programs provide free personalized Medicare counseling and are not connected to insurance companies or health plans.',
      });
    }
  }
  if (playbook.id === 'sibling-wont-help') {
    if (intake.caregiver_hours_known !== '' && intake.caregiver_hours_known !== 'Yes') {
      callouts.push({
        title: 'Make the workload visible first',
        body: 'Use caregiver hours and a written task list before asking for help. Specific work is easier to assign than general stress.',
      });
    }
    if (intake.task_list_written === false) {
      callouts.push({
        title: 'Create task ownership before the meeting',
        body: 'A task without an owner usually becomes the primary caregiver\'s job by default.',
      });
    }
    if (intake.money_part_of_conflict === true) {
      callouts.push({
        title: 'Separate time from money',
        body: 'Use the Family Care Budget Calculator so money, unpaid care hours, decisions, and backup coverage can be discussed separately.',
      });
    }
    if (intake.care_plan_safety === 'No' || intake.care_plan_safety === 'Not sure') {
      callouts.push({
        title: 'Safety comes before fairness',
        body: 'If the current plan is unsafe, the family may need paid help, respite, professional guidance, or a care setting review even if siblings disagree.',
      });
    }
    if (intake.family_meeting_done === false) {
      callouts.push({
        title: 'Use a structured family meeting',
        body: 'Keep the conversation focused on current care needs, workload, costs, task owners, and the next review date.',
      });
    }
  }
  if (playbook.id === 'share-care-costs') {
    const largeDecisions = Array.isArray(intake.large_decision_pending) ? intake.large_decision_pending : [];
    if (intake.current_cost_known !== '' && intake.current_cost_known !== 'Yes') {
      callouts.push({
        title: 'Start with the full monthly cost',
        body: 'Use a care budget before asking family to contribute. Include supplies, transportation, medications, facility fees, respite, and emergency costs.',
      });
    }
    if (intake.receipts_tracked === false) {
      callouts.push({
        title: 'Receipts need a system',
        body: 'Track date, amount, purpose, payer, and reimbursement status before payment disagreements grow.',
      });
    }
    if (intake.unpaid_hours_tracked === false) {
      callouts.push({
        title: 'Unpaid hours count too',
        body: 'Family contributions may include time, transportation, paperwork, backup coverage, and overnight responsibility, not only dollars.',
      });
    }
    if (intake.authority_clear !== '' && intake.authority_clear !== 'Yes') {
      callouts.push({
        title: 'Payment authority may need confirmation',
        body: 'Before using someone\'s funds, reimbursing caregivers, or signing facility documents, confirm legal authority with appropriate professionals.',
      });
    }
    if (largeDecisions.includes('Medicaid planning')) {
      callouts.push({
        title: 'Medicaid planning needs professional review',
        body: 'Do not make asset, property, caregiver-payment, or reimbursement decisions without state-specific guidance.',
      });
    }
    if (largeDecisions.includes('Paying a family caregiver')) {
      callouts.push({
        title: 'Family caregiver payment should be documented',
        body: 'Use a professional-reviewed agreement and tax/legal guidance before informal family caregiver payments become a source of conflict.',
      });
    }
  }
  if (playbook.id === 'parent-should-not-be-driving') {
    const alternatives = Array.isArray(intake.transportation_alternatives) ? intake.transportation_alternatives : [];
    if (intake.immediate_road_risk === true) {
      callouts.push({
        title: 'Immediate driving safety concern',
        body: 'If driving creates immediate danger, prioritize public safety. Involve emergency, medical, licensing, or local professional resources as appropriate.',
      });
    }
    if (intake.dementia_involved === true) {
      callouts.push({
        title: 'Memory or judgment changes raise the stakes',
        body: 'Use the dementia safety playbook and ask a clinician what should be evaluated before relying on persuasion alone.',
      });
    }
    if (intake.recent_medical_change === true) {
      callouts.push({
        title: 'Ask whether medical changes affect driving',
        body: 'Vision, dizziness, mobility, cognition, hospitalization, and medication changes can all affect safe driving.',
      });
    }
    if (alternatives.includes('Not sure') || alternatives.includes('None')) {
      callouts.push({
        title: 'Build alternatives before the conversation',
        body: 'Driving often represents independence and routine. Replacement rides make the safety conversation more practical.',
      });
    }
    if (intake.doctor_involved === false) {
      callouts.push({
        title: 'A clinician can lower family conflict',
        body: 'Professional input can shift the conversation from family opinion to specific medical, vision, cognitive, or mobility concerns.',
      });
    }
  }
  if (playbook.id === 'document-facility-concern') {
    const concernTypes = Array.isArray(intake.concern_type) ? intake.concern_type : [];
    if (intake.immediate_danger === true) {
      callouts.push({
        title: 'Immediate safety concern',
        body: 'If the resident is in immediate danger or may be experiencing serious harm, call emergency services or the appropriate urgent reporting resource now.',
      });
    }
    if (concernTypes.includes('Possible abuse or neglect')) {
      callouts.push({
        title: 'Possible abuse or neglect needs the right route',
        body: 'Use Adult Protective Services or emergency services for immediate danger, and document facts without delaying urgent help.',
      });
    }
    if (concernTypes.includes('Resident rights') || concernTypes.includes('Discharge threat') || intake.resident_fears_retaliation === true) {
      callouts.push({
        title: 'Ombudsman support may fit',
        body: 'Resident rights, discharge concerns, unresolved facility issues, and fear of retaliation are common reasons to contact a Long-Term Care Ombudsman.',
      });
    }
    if (intake.facility_type === 'Nursing home' && intake.response_received !== '' && intake.response_received !== 'Yes') {
      callouts.push({
        title: 'Regulatory complaint path may apply',
        body: 'For unresolved quality concerns in regulated health facilities, use the who-to-call path and state survey agency information.',
      });
    }
    if (intake.documentation_exists === false) {
      callouts.push({
        title: 'Start a factual concern log',
        body: 'Dates, times, locations, resident impact, who was notified, and requested outcomes are more useful than general frustration.',
      });
    }
  }
  return callouts;
}

function CareSafetyOverride(): JSX.Element {
  return (
    <section className="rounded-lg border border-rose-300 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-rose-950">This may need urgent or emergency help.</h2>
      <p className="mt-2 text-sm leading-6 text-rose-950">
        This playbook cannot determine whether it is safe to wait. If someone may be in immediate danger, missing, seriously ill, injured, unsafe, or at risk of harm, call emergency services or the appropriate urgent support now.
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">
        After immediate safety is addressed, you can continue with documentation and care-plan updates below.
      </p>
    </section>
  );
}

function questionDefault(question: PlaybookQuestion): IntakeValue {
  if (question.type === 'multi_select') return [];
  if (question.type === 'boolean') return '';
  return '';
}

function QuestionInput({
  question,
  value,
  onChange,
}: {
  question: PlaybookQuestion;
  value: IntakeValue;
  onChange: (value: IntakeValue) => void;
}): JSX.Element {
  if (question.type === 'boolean') {
    return (
      <label className="block rounded-md border border-slate-200 bg-white p-3">
        <span className="text-sm font-semibold text-slate-900">{question.label}</span>
        <select
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          value={value === true ? 'true' : value === false ? 'false' : ''}
          onChange={(event) => {
            if (event.target.value === 'true') onChange(true);
            else if (event.target.value === 'false') onChange(false);
            else onChange('');
          }}
        >
          <option value="">Select</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
    );
  }

  if (question.type === 'multi_select') {
    const selected = Array.isArray(value) ? value : [];
    return (
      <fieldset className="rounded-md border border-slate-200 bg-white p-3">
        <legend className="text-sm font-semibold text-slate-900">{question.label}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(question.options ?? []).map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-brand-700"
                checked={selected.includes(option)}
                onChange={(event) => {
                  if (event.target.checked) onChange([...selected, option]);
                  else onChange(selected.filter((item) => item !== option));
                }}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  if (question.type === 'single_select') {
    return (
      <label className="block rounded-md border border-slate-200 bg-white p-3">
        <span className="text-sm font-semibold text-slate-900">{question.label}</span>
        <select
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select</option>
          {(question.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">{question.label}</span>
      <input
        type={question.type === 'number' ? 'number' : question.type === 'date' ? 'date' : 'text'}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        value={String(value)}
        min={question.type === 'number' ? 0 : undefined}
        onChange={(event) => onChange(question.type === 'number' ? Number(event.target.value) : event.target.value)}
      />
    </label>
  );
}

function DocumentationInput({
  field,
  value,
  onChange,
}: {
  field: DocumentationField;
  value: string;
  onChange: (value: string) => void;
}): JSX.Element {
  if (field.fieldType === 'textarea') {
    return (
      <label className="block rounded-md border border-slate-200 bg-white p-3">
        <span className="text-sm font-semibold text-slate-900">
          {field.label}
          {field.requiredForSummary ? <span className="ml-1 text-brand-700">(summary)</span> : null}
        </span>
        <textarea
          className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
          placeholder={field.placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    );
  }

  if (field.fieldType === 'select') {
    return (
      <label className="block rounded-md border border-slate-200 bg-white p-3">
        <span className="text-sm font-semibold text-slate-900">
          {field.label}
          {field.requiredForSummary ? <span className="ml-1 text-brand-700">(summary)</span> : null}
        </span>
        <select
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Select</option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">
        {field.label}
        {field.requiredForSummary ? <span className="ml-1 text-brand-700">(summary)</span> : null}
      </span>
      <input
        type={field.fieldType === 'date' ? 'date' : field.fieldType === 'time' ? 'time' : field.fieldType === 'number' ? 'number' : 'text'}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        placeholder={field.placeholder}
        min={field.fieldType === 'number' ? 0 : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ToolCard({ tool, playbookId }: { tool: ToolRecommendation; playbookId: string }): JSX.Element {
  return (
    <a
      className={`block rounded-md border p-3 text-slate-900 no-underline hover:border-brand-400 ${
        tool.primary ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'
      }`}
      href={tool.href}
      onClick={() => emitPlaybookEvent(playbookId, 'tool_clicked', { tool: tool.name, href: tool.href })}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-brand-700">{tool.primary ? 'Next best tool' : tool.type}</div>
      <div className="mt-1 text-sm font-semibold">{tool.name}</div>
      <p className="mt-1 text-xs leading-5 text-slate-600">{tool.reason}</p>
    </a>
  );
}

function SafetyThresholdBuilder({ playbook }: { playbook: CarePlaybook }): JSX.Element {
  const examples =
    playbook.category === 'cost-pressure'
      ? ['If home care exceeds 40 hours per week, we compare assisted living.', 'If monthly cost exceeds our limit, we review alternatives.']
      : playbook.category === 'care-refusal'
        ? ['If medication is missed twice in one week, we add medication support.', 'If there is another fall, we reassess living alone.']
        : playbook.category === 'aging-in-place'
          ? ['If Mom does not answer by 10 a.m., we start the no-answer rule.', 'If bathroom falls continue, we add support or compare settings.']
          : ['If wandering happens again, we compare memory care.', 'If the caregiver cannot sleep safely, we add overnight backup.'];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Safety threshold builder</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Create a rule for when the family will change the care plan.</p>
      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-900">
        If ______ happens, we will ______.
      </div>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
        {examples.map((example) => (
          <li key={example}>{example}</li>
        ))}
      </ul>
    </section>
  );
}

function SmallestAcceptableHelpSelector(): JSX.Element {
  const options = [
    'One home care visit per week',
    'Grocery delivery',
    'Medication packaging',
    'One bathroom safety change',
    'One facility tour',
    'One doctor appointment',
    'One respite block',
    'One driving alternative',
    'One family task owner',
  ];
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">Smallest acceptable help</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Choose the smallest support that reduces risk without forcing the whole decision today.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-700" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function CareSettingPressureMeter({ playbook, intake, docs }: { playbook: CarePlaybook; intake: IntakeState; docs: DocumentationState }): JSX.Element | null {
  if (playbook.category !== 'cost-pressure' && playbook.category !== 'aging-in-place') return null;
  const unsafeHome = Array.isArray(intake.what_feels_unsafe) ? intake.what_feels_unsafe : [];
  const costDrivers = Array.isArray(intake.main_cost_driver) ? intake.main_cost_driver : [];
  const hoursText = String(intake.current_home_care_hours ?? '');
  const paidHours = Number(docs.current_hours);
  const monthlyCost = Number(docs.current_cost || intake.current_monthly_cost);
  const score =
    (hoursText === '41-80' || hoursText === '80+' || paidHours >= 40 ? 2 : 0) +
    (costDrivers.includes('Overnight care') || unsafeHome.includes('Nighttime') ? 1 : 0) +
    (costDrivers.includes('Dementia supervision') || unsafeHome.includes('Wandering') ? 1 : 0) +
    (unsafeHome.includes('Falls') || unsafeHome.includes('Bathroom safety') ? 1 : 0) +
    (intake.family_hours_remaining === 'Yes, a lot' || unsafeHome.includes('Caregiver burnout') ? 1 : 0) +
    (intake.local_backup === false ? 1 : 0) +
    (Number.isFinite(monthlyCost) && monthlyCost > 0 ? 1 : 0);
  const label =
    score <= 1
      ? 'Home plan appears stable'
      : score <= 3
        ? 'Home plan appears fragile'
        : score <= 5
          ? 'Home plan may need stronger support'
          : 'Compare higher-support care settings';
  return (
    <section className="rounded-lg border border-brand-200 bg-brand-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">Care setting pressure meter</h2>
      <p className="mt-1 text-sm leading-6 text-slate-700">{label}</p>
      <p className="mt-2 text-xs leading-5 text-slate-600">
        This is a planning prompt, not a medical or financial determination. Use it to decide whether to compare home care, adult day care, respite, assisted living, memory care, or nursing home support.
      </p>
    </section>
  );
}

function toPlanningNumber(value: unknown): number {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? next : 0;
}

function formatMoney(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '$0';
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function SourceUpdateModule({ playbook }: { playbook: CarePlaybook }): JSX.Element | null {
  if (playbook.category === 'medicare-review') {
    const items = [
      {
        label: 'Open Enrollment',
        body: 'Medicare Open Enrollment runs October 15 through December 7, with accepted changes effective January 1.',
        href: 'https://www.medicare.gov/health-drug-plans/open-enrollment',
      },
      {
        label: '2026 Part B',
        body: 'CMS lists the 2026 standard Part B premium as $202.90 and the annual Part B deductible as $283.',
        href: 'https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles',
      },
      {
        label: '2026 Part D',
        body: 'Medicare lists a 2026 Part D deductible maximum of $615 and covered Part D out-of-pocket drug spending threshold of $2,100.',
        href: 'https://www.medicare.gov/health-drug-plans/part-d/basics/costs',
      },
      {
        label: 'IRMAA life events',
        body: 'Social Security explains that certain life-changing events that reduce household income may support an IRMAA reduction request.',
        href: 'https://www.ssa.gov/medicare/lower-irmaa',
      },
      {
        label: 'SHIP',
        body: 'Medicare describes SHIP counseling as free, personalized, and not connected to insurance companies or health plans.',
        href: 'https://www.medicare.gov/basics/your-medicare-rights/get-help-with-your-rights-protections',
      },
    ];
    return (
      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <h2 className="text-lg font-semibold text-cyan-950">Applies to 2026</h2>
        <p className="mt-1 text-sm leading-6 text-cyan-950">
          This playbook uses 2026 Medicare planning anchors and should be reviewed annually before Medicare Open Enrollment.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {items.map((item) => (
            <a key={item.label} className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href={item.href}>
              <div className="text-sm font-semibold">{item.label}</div>
              <p className="mt-1 text-xs leading-5">{item.body}</p>
            </a>
          ))}
        </div>
      </section>
    );
  }

  if (playbook.category === 'medicaid-planning' || playbook.category === 'family-care-costs') {
    return (
      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <h2 className="text-lg font-semibold text-cyan-950">Medicaid source anchors</h2>
        <p className="mt-1 text-sm leading-6 text-cyan-950">
          Medicaid long-term care rules are state-specific. Use this playbook to organize questions, not to determine eligibility.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://www.medicaid.gov/medicaid/long-term-services-supports">
            <div className="text-sm font-semibold">Long-term services and supports</div>
            <p className="mt-1 text-xs leading-5">Medicaid.gov describes Medicaid as the primary payer across the nation for long-term care services.</p>
          </a>
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://www.medicaid.gov/medicaid/home-community-based-services">
            <div className="text-sm font-semibold">Home and community-based services</div>
            <p className="mt-1 text-xs leading-5">Medicaid.gov says HCBS can support services in homes or communities rather than institutions or isolated settings.</p>
          </a>
        </div>
      </section>
    );
  }

  if (playbook.category === 'insurance-claim') {
    return (
      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <h2 className="text-lg font-semibold text-cyan-950">Long-term care insurance source anchor</h2>
        <p className="mt-1 text-sm leading-6 text-cyan-950">
          ACL explains that an elimination period is the amount of time that must pass after a benefit trigger occurs before long-term care insurance payments begin.
        </p>
        <a className="mt-3 inline-flex rounded-md border border-cyan-200 bg-white px-3 py-2 text-sm font-semibold text-cyan-950 no-underline hover:border-cyan-400" href="https://acl.gov/ltc/costs-and-who-pays/what-is-long-term-care-insurance/receiving-long-term-care-insurance-benefits">
          Review ACL elimination-period guidance
        </a>
      </section>
    );
  }

  if (playbook.category === 'driving-safety') {
    return (
      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <h2 className="text-lg font-semibold text-cyan-950">Driving safety source anchors</h2>
        <p className="mt-1 text-sm leading-6 text-cyan-950">
          This playbook frames driving as a safety and mobility planning issue. Age alone is not the issue; specific events, health changes, medications, vision, cognition, and transportation alternatives matter.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://www.nhtsa.gov/road-safety/older-drivers">
            <div className="text-sm font-semibold">NHTSA older drivers</div>
            <p className="mt-1 text-xs leading-5">NHTSA notes older-driver decisions should account for changes such as vision, physical fitness, and reflexes, not age alone.</p>
          </a>
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://medlineplus.gov/olderdrivers.html">
            <div className="text-sm font-semibold">MedlinePlus older drivers</div>
            <p className="mt-1 text-xs leading-5">MedlinePlus explains that physical and mental changes can make safe driving harder for older adults.</p>
          </a>
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://www.nia.nih.gov/health/safety/driving-safety-and-alzheimers-disease">
            <div className="text-sm font-semibold">NIA dementia driving</div>
            <p className="mt-1 text-xs leading-5">NIA has dedicated driving safety guidance for Alzheimer&apos;s disease and signs that driving may need to stop.</p>
          </a>
        </div>
      </section>
    );
  }

  if (playbook.category === 'facility-concern') {
    return (
      <section className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <h2 className="text-lg font-semibold text-cyan-950">Facility concern source anchors</h2>
        <p className="mt-1 text-sm leading-6 text-cyan-950">
          Facility concerns need calm documentation and the right escalation route. Immediate danger, suspected abuse, resident rights, quality complaints, and Medicare quality concerns may use different paths.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-3">
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://acl.gov/programs/Protecting-Rights-and-Preventing-Abuse/Long-term-Care-Ombudsman-Program">
            <div className="text-sm font-semibold">Long-Term Care Ombudsman</div>
            <p className="mt-1 text-xs leading-5">ACL describes ombudsman programs as helping resolve health, safety, welfare, and rights issues in long-term care facilities.</p>
          </a>
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://www.cms.gov/medicare/health-safety-standards/quality-safety-oversight-general-information/contact-information">
            <div className="text-sm font-semibold">State Survey Agencies</div>
            <p className="mt-1 text-xs leading-5">CMS says State Survey Agencies investigate health care facility quality complaints and provides state contact information.</p>
          </a>
          <a className="rounded-md border border-cyan-200 bg-white p-3 text-cyan-950 no-underline hover:border-cyan-400" href="https://www.medicare.gov/providers-services/file-a-complaint-grievance/quality-of-care">
            <div className="text-sm font-semibold">Medicare quality complaints</div>
            <p className="mt-1 text-xs leading-5">Medicare describes complaint routes for quality-of-care concerns, including BFCC-QIOs for Medicare quality complaints.</p>
          </a>
        </div>
      </section>
    );
  }

  return null;
}

function AnnualMedicareReviewChecklist(): JSX.Element {
  const items = [
    'Coverage type',
    'Doctors checked',
    'Hospitals checked',
    'Prescriptions checked',
    'Pharmacies checked',
    'Premium checked',
    'Deductible checked',
    'Out-of-pocket maximum checked',
    'Prior authorization checked',
    'IRMAA checked',
    'Travel checked',
    'Caregiver manageability checked',
  ];
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Annual Medicare review checklist</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Review the plan against real life, not just the premium.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-700" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
}

function PolicyGapCalculatorPrompt({ docs, intake }: { docs: DocumentationState; intake: IntakeState }): JSX.Element {
  const monthlyCareCost = toPlanningNumber(docs.current_monthly_care_cost || intake.current_monthly_care_cost);
  const monthlyBenefit = toPlanningNumber(docs.monthly_benefit);
  const monthlyGap = toPlanningNumber(docs.monthly_gap) || Math.max(0, monthlyCareCost - monthlyBenefit);
  const benefitDuration = monthlyBenefit > 0 ? 'Use the policy pool and benefit amount to estimate duration.' : 'Enter benefit amount to estimate duration.';
  return (
    <section className="rounded-lg border border-brand-200 bg-brand-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">Policy gap calculator prompt</h2>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-md border border-brand-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated monthly covered amount</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{formatMoney(monthlyBenefit)}</dd>
        </div>
        <div className="rounded-md border border-brand-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated monthly family gap</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{formatMoney(monthlyGap)}</dd>
        </div>
        <div className="rounded-md border border-brand-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated elimination-period cost</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">Confirm with insurer</dd>
        </div>
        <div className="rounded-md border border-brand-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated benefit duration</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{benefitDuration}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs leading-5 text-slate-600">
        This is a planning estimate. Confirm policy terms, covered settings, provider requirements, elimination period rules, and benefit calculations with the insurer or a qualified professional.
      </p>
    </section>
  );
}

function PrivatePayRunwayEstimator({ docs, intake }: { docs: DocumentationState; intake: IntakeState }): JSX.Element {
  const [availableFunds, setAvailableFunds] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [otherExpenses, setOtherExpenses] = useState(0);
  const monthlyCareCost = toPlanningNumber(docs.current_monthly_cost || docs.monthly_care_cost || intake.current_monthly_cost);
  const monthlyShortfall = Math.max(0, monthlyCareCost + otherExpenses - monthlyIncome);
  const runway = monthlyShortfall > 0 ? Math.floor(availableFunds / monthlyShortfall) : 0;
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">Private-pay runway estimator</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        This is only a budget runway estimate. It is not Medicaid eligibility and does not replace legal, tax, benefits, or financial advice.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Available funds</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} value={availableFunds} onChange={(event) => setAvailableFunds(Number(event.target.value))} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Monthly income for care</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} value={monthlyIncome} onChange={(event) => setMonthlyIncome(Number(event.target.value))} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Other monthly expenses</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="number" min={0} value={otherExpenses} onChange={(event) => setOtherExpenses(Number(event.target.value))} />
        </label>
      </div>
      <dl className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Monthly care cost</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{formatMoney(monthlyCareCost)}</dd>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated shortfall</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{formatMoney(monthlyShortfall)}</dd>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated runway</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{monthlyShortfall > 0 ? `${runway} months` : 'Add numbers'}</dd>
        </div>
      </dl>
      {monthlyShortfall > 0 && runway <= 6 ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
          Short runway prompt: review payment sources, provider Medicaid status, documents, and professional questions promptly.
        </p>
      ) : null}
    </section>
  );
}

function CostScenarioBuilder(): JSX.Element {
  const [scenarios, setScenarios] = useState([
    { label: 'Current plan', monthlyCost: 0, familyHours: 0, safetyRisks: '', paymentSources: '', professionalQuestions: '' },
    { label: 'Adjusted plan', monthlyCost: 0, familyHours: 0, safetyRisks: '', paymentSources: '', professionalQuestions: '' },
    { label: 'Alternative care setting', monthlyCost: 0, familyHours: 0, safetyRisks: '', paymentSources: '', professionalQuestions: '' },
  ]);
  const updateScenario = (index: number, key: keyof (typeof scenarios)[number], value: string | number): void => {
    setScenarios((current) => current.map((scenario, scenarioIndex) => (scenarioIndex === index ? { ...scenario, [key]: value } : scenario)));
  };
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Cost scenario builder</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Compare cost, family workload, safety risks, payment sources, and professional questions side by side.</p>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {scenarios.map((scenario, index) => (
          <div key={scenario.label} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <h3 className="text-sm font-semibold text-slate-950">{scenario.label}</h3>
            <label className="mt-2 block text-xs font-semibold text-slate-700">
              Monthly cost
              <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" type="number" min={0} value={scenario.monthlyCost} onChange={(event) => updateScenario(index, 'monthlyCost', Number(event.target.value))} />
            </label>
            <p className="mt-1 text-xs text-slate-600">Annual: {formatMoney(toPlanningNumber(scenario.monthlyCost) * 12)}</p>
            <label className="mt-2 block text-xs font-semibold text-slate-700">
              Family hours/week
              <input className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" type="number" min={0} value={scenario.familyHours} onChange={(event) => updateScenario(index, 'familyHours', Number(event.target.value))} />
            </label>
            <label className="mt-2 block text-xs font-semibold text-slate-700">
              Safety risks
              <textarea className="mt-1 min-h-16 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={scenario.safetyRisks} onChange={(event) => updateScenario(index, 'safetyRisks', event.target.value)} />
            </label>
            <label className="mt-2 block text-xs font-semibold text-slate-700">
              Payment sources
              <textarea className="mt-1 min-h-16 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={scenario.paymentSources} onChange={(event) => updateScenario(index, 'paymentSources', event.target.value)} />
            </label>
            <label className="mt-2 block text-xs font-semibold text-slate-700">
              Professional questions
              <textarea className="mt-1 min-h-16 w-full rounded-md border border-slate-300 px-2 py-1 text-sm" value={scenario.professionalQuestions} onChange={(event) => updateScenario(index, 'professionalQuestions', event.target.value)} />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}

type ConversationAudience = 'sibling' | 'parent' | 'caregiver' | 'facility' | 'doctor' | 'insurer' | 'agency';
type ConversationTone = 'calm' | 'firm' | 'urgent' | 'boundary-setting';

interface ConversationScriptGeneratorInput {
  person: ConversationAudience;
  issue: string;
  facts: string[];
  ask: string;
  boundary?: string;
  deadline?: string;
}

function generateConversationScript(input: ConversationScriptGeneratorInput): string {
  const facts = input.facts.map((fact) => fact.trim()).filter(Boolean);
  return [
    `I want to talk about ${input.issue || 'the care situation'}.`,
    '',
    'Here are the facts we need to work from:',
    ...(facts.length ? facts.map((fact) => `- ${fact}`) : ['- [fact 1]', '- [fact 2]', '- [fact 3]']),
    '',
    `I am asking for ${input.ask || '[specific request]'}.`,
    input.boundary ? `If that cannot happen, we need to ${input.boundary}.` : '',
    `Can we agree on ${input.deadline || '[deadline / next step]'}?`,
  ]
    .filter((line) => line !== '')
    .join('\n');
}

function ConversationBuilder({ playbook }: { playbook: CarePlaybook }): JSX.Element | null {
  const defaults: Record<string, { audience: ConversationAudience; tone: ConversationTone; goal: string; ask: string; deadline: string; facts: string[]; boundary?: string }> = {
    'family-conflict': {
      audience: 'sibling',
      tone: 'firm',
      goal: 'task ownership and backup coverage',
      ask: 'one specific recurring task owner, plus a backup plan if that person cannot do it',
      deadline: 'a family task split before the next care week starts',
      facts: ['The care tasks are recurring.', 'The current plan depends too much on one person.', 'Unassigned tasks still have to be covered.'],
      boundary: 'price paid help or reduce the plan to what is actually covered',
    },
    'shared-costs': {
      audience: 'sibling',
      tone: 'calm',
      goal: 'the shared care budget',
      ask: 'a clear contribution, reimbursement, or task-ownership rule',
      deadline: 'the next monthly budget review date',
      facts: ['The full monthly cost needs to be visible.', 'Unpaid care hours count too.', 'Receipts and reimbursement rules should be tracked.'],
      boundary: 'pause non-urgent spending decisions until the budget and authority are clear',
    },
    'driving-safety': {
      audience: 'parent',
      tone: 'firm',
      goal: 'driving safety and transportation alternatives',
      ask: 'a driving safety review and one replacement transportation option',
      deadline: 'a professional or family review before the next risky drive',
      facts: ['The concern is based on specific events, not age alone.', 'Driving supports independence and routine.', 'Transportation alternatives need to be built.'],
      boundary: 'pause or limit driving when immediate safety is at risk',
    },
    'facility-concern': {
      audience: 'facility',
      tone: 'firm',
      goal: 'a documented facility concern',
      ask: 'a written response that names who owns follow-up, what will happen next, and when the family will receive an update',
      deadline: 'a specific follow-up date',
      facts: ['The concern should be documented with dates and resident impact.', 'The requested outcome should be clear.', 'Escalation may be needed if the issue repeats or remains unresolved.'],
      boundary: 'use the appropriate ombudsman, APS, state agency, Medicare, or emergency route if safety or rights concerns continue',
    },
  };
  const defaultInput = defaults[playbook.category];
  if (!defaultInput) return null;
  const [audience, setAudience] = useState<ConversationAudience>(defaultInput.audience);
  const [tone, setTone] = useState<ConversationTone>(defaultInput.tone);
  const [goal, setGoal] = useState(defaultInput.goal);
  const [ask, setAsk] = useState(defaultInput.ask);
  const [deadline, setDeadline] = useState(defaultInput.deadline);
  const [boundary, setBoundary] = useState(defaultInput.boundary ?? '');
  const [facts, setFacts] = useState(defaultInput.facts);
  const [copied, setCopied] = useState(false);
  const script = generateConversationScript({ person: audience, issue: goal, facts, ask, boundary, deadline });
  const updateFact = (index: number, value: string): void => setFacts((current) => current.map((fact, factIndex) => (factIndex === index ? value : fact)));
  const copyScript = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Conversation builder</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Create a grounded, non-accusatory script using facts, a specific request, and a next step.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Audience</span>
          <select className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={audience} onChange={(event) => setAudience(event.target.value as ConversationAudience)}>
            {['sibling', 'parent', 'caregiver', 'facility', 'doctor', 'insurer', 'agency'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Tone</span>
          <select className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={tone} onChange={(event) => setTone(event.target.value as ConversationTone)}>
            {['calm', 'firm', 'urgent', 'boundary-setting'].map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
          <span className="text-sm font-semibold text-slate-900">Goal</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={goal} onChange={(event) => setGoal(event.target.value)} />
        </label>
        {facts.map((fact, index) => (
          <label key={index} className="block rounded-md border border-slate-200 bg-slate-50 p-3">
            <span className="text-sm font-semibold text-slate-900">Fact {index + 1}</span>
            <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={fact} onChange={(event) => updateFact(index, event.target.value)} />
          </label>
        ))}
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Specific request</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={ask} onChange={(event) => setAsk(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Boundary or backup plan</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={boundary} onChange={(event) => setBoundary(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
          <span className="text-sm font-semibold text-slate-900">Deadline or next step</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={deadline} onChange={(event) => setDeadline(event.target.value)} />
        </label>
      </div>
      <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">ConversationScriptGenerator output</p>
          <button type="button" className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 hover:border-brand-400" onClick={copyScript}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="mt-2 whitespace-pre-wrap text-xs leading-5 text-slate-700">{script}</pre>
      </div>
      <p className="mt-2 text-xs leading-5 text-slate-500">Tone selected: {tone}. Adjust the words before using this with family, providers, or facilities.</p>
    </section>
  );
}

function TaskOwnershipTable(): JSX.Element {
  const defaultRows = [
    'Medication refills',
    'Doctor appointments',
    'Transportation',
    'Groceries and meals',
    'Bathing or personal care support',
    'Bills and insurance',
    'Facility or agency calls',
    'Family updates',
    'Respite coverage',
    'Emergency backup',
    'Care budget tracking',
    'Legal / document follow-up',
  ].map((task) => ({ task, owner: '', backup: '', rhythm: '', dueDate: '', status: 'unassigned' as const }));
  const [rows, setRows] = useState(defaultRows);
  const updateRow = (index: number, key: keyof (typeof rows)[number], value: string): void => {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  };
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">Task ownership table</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">A task without an owner usually becomes the primary caregiver&apos;s job by default.</p>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {['Task', 'Owner', 'Backup', 'Rhythm', 'Due date', 'Status'].map((heading) => (
                <th key={heading} className="border-b border-slate-200 px-2 py-2 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.task} className="border-b border-slate-200 bg-white">
                <td className="min-w-44 px-2 py-2 font-semibold text-slate-900">{row.task}</td>
                <td className="min-w-32 px-2 py-2"><input className="w-full rounded border border-slate-300 px-2 py-1" value={row.owner} onChange={(event) => updateRow(index, 'owner', event.target.value)} /></td>
                <td className="min-w-32 px-2 py-2"><input className="w-full rounded border border-slate-300 px-2 py-1" value={row.backup} onChange={(event) => updateRow(index, 'backup', event.target.value)} /></td>
                <td className="min-w-32 px-2 py-2"><input className="w-full rounded border border-slate-300 px-2 py-1" value={row.rhythm} onChange={(event) => updateRow(index, 'rhythm', event.target.value)} /></td>
                <td className="min-w-32 px-2 py-2"><input className="w-full rounded border border-slate-300 px-2 py-1" type="date" value={row.dueDate} onChange={(event) => updateRow(index, 'dueDate', event.target.value)} /></td>
                <td className="min-w-32 px-2 py-2">
                  <select className="w-full rounded border border-slate-300 px-2 py-1" value={row.status} onChange={(event) => updateRow(index, 'status', event.target.value)}>
                    {['unassigned', 'assigned', 'fragile', 'covered'].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FairnessMap(): JSX.Element {
  const [rows, setRows] = useState([
    { person: 'Primary caregiver', moneyContribution: 0, timeContributionHours: 0, taskOwnership: '', adminOwnership: '', backupRole: '', constraints: '' },
    { person: 'Sibling 1', moneyContribution: 0, timeContributionHours: 0, taskOwnership: '', adminOwnership: '', backupRole: '', constraints: '' },
    { person: 'Sibling 2', moneyContribution: 0, timeContributionHours: 0, taskOwnership: '', adminOwnership: '', backupRole: '', constraints: '' },
  ]);
  const updateRow = (index: number, key: keyof (typeof rows)[number], value: string | number): void => {
    setRows((current) => current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)));
  };
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Fairness map</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Fair does not always mean equal. But it should be visible.</p>
      <div className="mt-3 grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="grid gap-2 sm:grid-cols-3">
              <label className="block text-xs font-semibold text-slate-700">
                Person
                <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" value={row.person} onChange={(event) => updateRow(index, 'person', event.target.value)} />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Money/month
                <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" type="number" min={0} value={row.moneyContribution} onChange={(event) => updateRow(index, 'moneyContribution', Number(event.target.value))} />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Hours/week
                <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" type="number" min={0} value={row.timeContributionHours} onChange={(event) => updateRow(index, 'timeContributionHours', Number(event.target.value))} />
              </label>
            </div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-slate-700">
                Task ownership
                <textarea className="mt-1 min-h-16 w-full rounded border border-slate-300 px-2 py-1 text-sm" value={row.taskOwnership} onChange={(event) => updateRow(index, 'taskOwnership', event.target.value)} />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Admin ownership
                <textarea className="mt-1 min-h-16 w-full rounded border border-slate-300 px-2 py-1 text-sm" value={row.adminOwnership} onChange={(event) => updateRow(index, 'adminOwnership', event.target.value)} />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Backup role
                <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" value={row.backupRole} onChange={(event) => updateRow(index, 'backupRole', event.target.value)} />
              </label>
              <label className="block text-xs font-semibold text-slate-700">
                Constraints
                <input className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm" value={row.constraints} onChange={(event) => updateRow(index, 'constraints', event.target.value)} />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DrivingEventLog(): JSX.Element {
  const [eventType, setEventType] = useState('got_lost');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [whatHappened, setWhatHappened] = useState('');
  const [injuryOrDamage, setInjuryOrDamage] = useState('');
  const [whoObserved, setWhoObserved] = useState('');
  const [followUpNeeded, setFollowUpNeeded] = useState('');
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">Driving event log</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Specific events are more useful than general concern.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Date</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Event type</span>
          <select className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={eventType} onChange={(event) => setEventType(event.target.value)}>
            {['got_lost', 'crash', 'near_miss', 'ticket', 'new_damage', 'confusion', 'unsafe_speed', 'family_felt_unsafe', 'other'].map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Location</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Who observed it?</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={whoObserved} onChange={(event) => setWhoObserved(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3 sm:col-span-2">
          <span className="text-sm font-semibold text-slate-900">What happened?</span>
          <textarea className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={whatHappened} onChange={(event) => setWhatHappened(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Injury or damage</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={injuryOrDamage} onChange={(event) => setInjuryOrDamage(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-white p-3">
          <span className="text-sm font-semibold text-slate-900">Follow-up needed</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={followUpNeeded} onChange={(event) => setFollowUpNeeded(event.target.value)} />
        </label>
      </div>
    </section>
  );
}

function FacilityConcernLog(): JSX.Element {
  const [facilityName, setFacilityName] = useState('');
  const [residentInitials, setResidentInitials] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [location, setLocation] = useState('');
  const [facts, setFacts] = useState('');
  const [residentImpact, setResidentImpact] = useState('');
  const [reportedTo, setReportedTo] = useState('');
  const [response, setResponse] = useState('');
  const [requestedOutcome, setRequestedOutcome] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [evidence, setEvidence] = useState('');
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Facility concern log</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Document facts, resident impact, response received, requested outcome, and follow-up.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Facility or agency name</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={facilityName} onChange={(event) => setFacilityName(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Resident initials</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={residentInitials} onChange={(event) => setResidentInitials(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Date and time</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={dateTime} onChange={(event) => setDateTime(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Location</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={location} onChange={(event) => setLocation(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
          <span className="text-sm font-semibold text-slate-900">Facts</span>
          <textarea className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={facts} onChange={(event) => setFacts(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Resident impact</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={residentImpact} onChange={(event) => setResidentImpact(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Evidence</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Photos, messages, invoices, care notes..." value={evidence} onChange={(event) => setEvidence(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Reported to</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={reportedTo} onChange={(event) => setReportedTo(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Response received</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={response} onChange={(event) => setResponse(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Requested outcome</span>
          <textarea className="mt-2 min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" value={requestedOutcome} onChange={(event) => setRequestedOutcome(event.target.value)} />
        </label>
        <label className="block rounded-md border border-slate-200 bg-slate-50 p-3">
          <span className="text-sm font-semibold text-slate-900">Follow-up date</span>
          <input className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="date" value={followUpDate} onChange={(event) => setFollowUpDate(event.target.value)} />
        </label>
      </div>
    </section>
  );
}

function EscalationPathSelector({ playbook }: { playbook: CarePlaybook }): JSX.Element | null {
  const paths =
    playbook.category === 'driving-safety'
      ? [
          { concern: 'Immediate public safety risk', firstContact: 'Emergency or local urgent resource', secondContact: 'Clinician', urgentContact: 'Emergency services', documentationNeeded: ['Specific driving event', 'Location', 'Who observed it', 'Injury or damage'] },
          { concern: 'Medical, medication, or vision concern', firstContact: 'Doctor or clinician', secondContact: 'Driving safety or occupational therapy specialist', urgentContact: 'Emergency care if symptoms are sudden or severe', documentationNeeded: ['Medication changes', 'Medical event', 'Driving event log'] },
          { concern: 'Dementia or judgment concern', firstContact: 'Doctor or geriatric clinician', secondContact: 'Local licensing resource if serious risk continues', urgentContact: 'Emergency help if the person is missing or unsafe now', documentationNeeded: ['Getting lost incidents', 'Confusion while driving', 'Family observations'] },
        ]
      : playbook.category === 'facility-concern'
        ? [
            { concern: 'Medication or care concern', firstContact: 'Nurse, unit manager, or agency supervisor', secondContact: 'Administrator or care director', urgentContact: 'Emergency services if urgent medical risk exists', documentationNeeded: ['Date/time', 'Medication or care facts', 'Resident impact', 'Requested outcome'] },
            { concern: 'Possible abuse or neglect', firstContact: 'Emergency services if immediate danger', secondContact: 'APS or appropriate reporting agency', urgentContact: 'Emergency services', documentationNeeded: ['Facts', 'Resident impact', 'People involved', 'Evidence', 'Who was notified'] },
            { concern: 'Discharge threat or rights concern', firstContact: 'Facility administrator', secondContact: 'Long-Term Care Ombudsman', urgentContact: 'Legal or emergency help if safety is at risk', documentationNeeded: ['Exact words used', 'Written notices', 'Dates', 'Requested outcome'] },
            { concern: 'Regulated facility quality complaint', firstContact: 'Facility leadership', secondContact: 'State Survey Agency or Medicare complaint route', urgentContact: 'Emergency services if immediate danger exists', documentationNeeded: ['Concern log', 'Response received', 'Pattern evidence', 'Follow-up dates'] },
          ]
        : [];
  const [selected, setSelected] = useState(paths[0]?.concern ?? '');
  if (!paths.length) return null;
  const path = paths.find((item) => item.concern === selected) ?? paths[0];
  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h2 className="text-lg font-semibold text-slate-950">Escalation path selector</h2>
      <p className="mt-1 text-sm leading-6 text-slate-600">Choose the concern type, then document the closest responsible contact and the next route if unresolved.</p>
      <label className="mt-3 block text-sm font-semibold text-slate-900">
        Concern
        <select className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" value={selected} onChange={(event) => setSelected(event.target.value)}>
          {paths.map((item) => <option key={item.concern} value={item.concern}>{item.concern}</option>)}
        </select>
      </label>
      <dl className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">First contact</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{path.firstContact}</dd>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Second contact</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{path.secondContact}</dd>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-3">
          <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Urgent contact</dt>
          <dd className="mt-1 text-sm font-semibold text-slate-950">{path.urgentContact}</dd>
        </div>
      </dl>
      <div className="mt-3 rounded-md border border-slate-200 bg-white p-3">
        <p className="text-sm font-semibold text-slate-950">Documentation needed</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
          {path.documentationNeeded.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  );
}

function ProfessionalQuestionBuilder({ playbook }: { playbook: CarePlaybook }): JSX.Element | null {
  const questionMap: Record<string, Array<{ audience: string; question: string; reason: string }>> = {
    'medicare-review': [
      { audience: 'Medicare/SHIP', question: 'Can you help verify doctors, drugs, pharmacies, total yearly cost, and plan rules?', reason: 'SHIP can provide free, unbiased Medicare counseling.' },
      { audience: 'Insurer', question: 'Can you confirm this doctor, hospital, drug, and pharmacy list for the coming plan year?', reason: 'Networks, formularies, and pharmacy pricing can change.' },
      { audience: 'Social Security', question: 'Does a life-changing event support an IRMAA reduction request?', reason: 'Income-related adjustments may change after qualifying events.' },
    ],
    'insurance-claim': [
      { audience: 'Insurer', question: 'What are the benefit trigger, elimination period, covered settings, provider requirements, invoice requirements, and appeal process?', reason: 'A claim can fail if policy requirements are misunderstood.' },
      { audience: 'Facility', question: 'Have your invoices and care notes met LTC insurance requirements for other families?', reason: 'Documentation must match insurer expectations.' },
      { audience: 'Elder law attorney', question: 'What should we do if the claim is denied or family payment responsibility is unclear?', reason: 'Disputes and authority issues may need legal review.' },
    ],
    'medicaid-planning': [
      { audience: 'Elder law attorney', question: 'What should we avoid doing before Medicaid planning is reviewed?', reason: 'Asset transfers or undocumented caregiver payments may create problems.' },
      { audience: 'Medicaid office', question: 'Which state program path applies to this care setting?', reason: 'Medicaid rules and program structures vary by state.' },
      { audience: 'Facility', question: 'Do you accept Medicaid or Medicaid pending, and what happens if private pay runs out?', reason: 'Provider participation affects care transitions.' },
    ],
    'family-care-costs': [
      { audience: 'Facility', question: 'Can you provide an itemized bill, fee schedule, sample invoice, and rate increase policy?', reason: 'Families should compare the real monthly bill, not only the base rate.' },
      { audience: 'Financial planner', question: 'What are the implications of withdrawals, selling assets, or family contributions?', reason: 'Care funding choices can affect taxes, cash flow, and family roles.' },
      { audience: 'Elder law attorney', question: 'When should Medicaid, authority documents, or provider payment responsibility be reviewed?', reason: 'Payment pressure can become a legal and benefits planning issue.' },
    ],
  };
  const questions = questionMap[playbook.category];
  if (!questions) return null;
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">Professional question builder</h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {questions.map((item) => (
          <div key={`${item.audience}-${item.question}`} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{item.audience}</div>
            <p className="mt-1 text-sm font-semibold leading-6 text-slate-950">{item.question}</p>
            <p className="mt-2 text-xs leading-5 text-slate-600">{item.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function financialDisclaimer(playbook: CarePlaybook): string {
  if (['family-conflict', 'shared-costs', 'driving-safety', 'facility-concern'].includes(playbook.category)) {
    return 'This playbook helps organize family care conversations and documentation. It does not replace medical, legal, financial, insurance, employment, or emergency advice. If someone is in immediate danger, may be unsafe on the road, may be experiencing abuse or neglect, or may need urgent medical help, contact the appropriate emergency or professional resource.';
  }
  if (playbook.disclaimerType !== 'financial-legal-insurance-medicare') {
    return 'Kefiw provides educational care-planning tools and guides. This playbook helps families organize decisions, estimate needs, prepare questions, and identify next steps. It does not replace medical, legal, tax, financial, insurance, Medicare, Medicaid, or emergency guidance. For urgent medical concerns or immediate danger, call emergency services.';
  }
  return 'Kefiw provides educational planning tools and guides. This playbook does not provide legal, tax, financial, Medicare enrollment, Medicaid planning, insurance, investment, or benefits advice. Costs, eligibility, coverage, premiums, formularies, networks, tax treatment, benefit rules, and state Medicaid rules can vary by person, plan, policy, state, provider, and year. Confirm details with Medicare, Social Security, SHIP, insurers, Medicaid, an elder law attorney, tax professional, licensed insurance professional, or qualified advisor as appropriate.';
}

export default function PlaybookClient({ playbook }: { playbook: CarePlaybook }): JSX.Element {
  const initialIntake = useMemo(
    () =>
      playbook.intakeQuestions.reduce<IntakeState>((acc, question) => {
        acc[question.id] = questionDefault(question);
        return acc;
      }, {}),
    [playbook.intakeQuestions],
  );
  const initialDocs = useMemo(
    () =>
      playbook.documentation.reduce<DocumentationState>((acc, field) => {
        acc[field.id] = '';
        return acc;
      }, {}),
    [playbook.documentation],
  );

  const [started, setStarted] = useState(false);
  const [intake, setIntake] = useState<IntakeState>(initialIntake);
  const [docs, setDocs] = useState<DocumentationState>(initialDocs);
  const [actions, setActions] = useState<ActionState>({});
  const [actionNotes, setActionNotes] = useState<Record<string, string>>({});
  const [reviewDays, setReviewDays] = useState(playbook.summaryOutput.defaultReviewDays);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedScript, setCopiedScript] = useState('');

  useEffect(() => {
    emitPlaybookEvent(playbook.id, 'playbook_viewed');
    if (playbook.safetyBanner) emitPlaybookEvent(playbook.id, 'safety_banner_viewed');
  }, [playbook.id, playbook.safetyBanner]);

  const safetyOverride = useMemo(() => isSafetyOverrideTriggered(playbook, intake), [intake, playbook]);
  const callouts = useMemo(() => personalizedCallouts(playbook, intake), [intake, playbook]);

  useEffect(() => {
    if (safetyOverride) emitPlaybookEvent(playbook.id, 'safety_override_triggered');
  }, [playbook.id, safetyOverride]);

  const allActions = useMemo(
    () => [...playbook.actionSections.now, ...(playbook.actionSections.next24Hours ?? []), ...playbook.actionSections.thisWeek],
    [playbook.actionSections],
  );

  const completedActions = allActions.filter((action) => actions[action.id]);
  const reviewDate = useMemo(() => addDays(reviewDays), [reviewDays]);
  const createdDate = useMemo(() => new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }), []);

  const summaryText = useMemo(() => {
    const intakeLines = playbook.intakeQuestions.map((question) => `${question.label}: ${formatValue(intake[question.id])}`);
    const docLines = playbook.documentation.map((field) => `${field.label}: ${docs[field.id] || 'Not entered'}`);
    const actionLines = completedActions.map((action) => `- ${action.title}`);
    const toolLines = playbook.recommendedTools.map((tool) => `- ${tool.name}: ${tool.reason}`);
    return [
      `Kefiw ${playbook.summaryOutput.title}`,
      `Date created: ${createdDate}`,
      `Suggested review date: ${reviewDate}`,
      '',
      'Situation intake',
      ...intakeLines,
      '',
      'Documentation',
      ...docLines,
      '',
      'Completed actions',
      actionLines.length ? actionLines.join('\n') : 'None checked yet',
      '',
      'Recommended next steps',
      ...playbook.summaryOutput.recommendedNextSteps.map((step) => `- ${step}`),
      '',
      'Questions to ask',
      ...playbook.summaryOutput.questionsToAsk.map((question) => `- ${question}`),
      '',
      'Recommended Kefiw tools',
      ...toolLines,
      '',
      'Family script',
      playbook.scripts[0]?.body ?? 'Not entered',
    ].join('\n');
  }, [completedActions, createdDate, docs, intake, playbook, reviewDate]);

  const startPlaybook = (): void => {
    setStarted(true);
    emitPlaybookEvent(playbook.id, 'playbook_started');
  };

  const updateIntake = (id: string, value: IntakeValue): void => {
    setIntake((current) => ({ ...current, [id]: value }));
  };

  const updateDoc = (id: string, value: string): void => {
    setDocs((current) => ({ ...current, [id]: value }));
  };

  const toggleAction = (action: PlaybookAction, checked: boolean): void => {
    setActions((current) => ({ ...current, [action.id]: checked }));
    emitPlaybookEvent(playbook.id, 'action_checked', { actionId: action.id, checked });
  };

  const copyText = async (text: string, id: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedScript(id);
      if (id.includes('script')) emitPlaybookEvent(playbook.id, 'clinician_call_script_copied', { script: id });
      window.setTimeout(() => setCopiedScript(''), 1600);
    } catch {
      setCopiedScript('');
    }
  };

  const copySummary = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopiedSummary(true);
      emitPlaybookEvent(playbook.id, 'summary_shared');
      window.setTimeout(() => setCopiedSummary(false), 1600);
    } catch {
      setCopiedSummary(false);
    }
  };

  const generateSummaryDraft = (): void => {
    const draft = {
      playbookId: playbook.id,
      playbookTitle: playbook.title,
      dateCreated: createdDate,
      situation: {
        triggerEvent: formatValue(
          intake.trigger_event ??
            intake.fall_or_near_fall ??
            intake.discharge_timing ??
            intake.burnout_level ??
            intake.main_issue ??
            intake.family_conflict_type ??
            intake.driving_concern ??
            intake.concern_type,
        ),
        currentLocation: formatValue(intake.current_location ?? intake.fall_location ?? intake.planned_destination ?? intake.current_care_setting ?? intake.facility_type),
        primaryConcern: formatValue(
          intake.main_risk ??
            intake.first_night_concern ??
            intake.main_burden ??
            intake.care_plan_safety ??
            intake.authority_clear ??
            intake.parent_response ??
            intake.response_received,
        ),
        urgencyLevel: playbook.safetyLevel,
      },
      safetyNotes: safetyOverride
        ? ['Safety override triggered. This playbook cannot determine whether it is safe to wait. Seek urgent or emergency help if unsure.']
        : [],
      redFlags: playbook.redFlags,
      documentedEvents: docs,
      completedActions: completedActions.map((action) => ({ id: action.id, title: action.title, completedAt: new Date().toISOString() })),
      recommendedNextSteps: playbook.summaryOutput.recommendedNextSteps,
      recommendedTools: playbook.recommendedTools.map((tool) => ({ name: tool.name, href: tool.href, reason: tool.reason })),
      questionsToAsk: playbook.summaryOutput.questionsToAsk,
      familyScript: playbook.scripts[0]?.body,
      reviewDays,
      reviewDate,
      summaryText,
    };
    try {
      window.localStorage.setItem(summaryDraftKey, JSON.stringify(draft));
    } catch {
      // Sharing the draft is optional; the on-page summary remains available.
    }
    emitPlaybookEvent(playbook.id, 'summary_generated');
    window.location.href = '/care/family-care-plan-summary/';
  };

  const renderActionList = (label: string, actionsForSection: PlaybookAction[]): JSX.Element => (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-lg font-semibold text-slate-950">{label}</h2>
      <div className="mt-4 space-y-3">
        {actionsForSection.map((action) => (
          <div key={action.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-700"
                  checked={Boolean(actions[action.id])}
                  onChange={(event) => toggleAction(action, event.target.checked)}
                />
                <span>
                  <span className="block text-sm font-semibold text-slate-950">{action.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-slate-700">{action.body}</span>
                  {action.whyItMatters ? <span className="mt-1 block text-xs leading-5 text-slate-600">Why it matters: {action.whyItMatters}</span> : null}
                </span>
              </label>
              <span className="w-fit rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                {formatTag(action.safetyTag)}
              </span>
            </div>
            {action.cta ? (
              <a
                className="mt-3 inline-flex rounded-md border border-brand-200 bg-white px-3 py-2 text-xs font-semibold text-brand-700 no-underline hover:border-brand-400"
                href={action.cta.href}
                onClick={() => emitPlaybookEvent(playbook.id, action.cta?.type === 'worksheet' ? 'worksheet_opened' : 'tool_clicked', { actionId: action.id, href: action.cta?.href })}
              >
                {action.cta.label}
              </a>
            ) : null}
            {action.completionType === 'note' ? (
              <textarea
                className="mt-3 min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
                placeholder="Add a note, owner, deadline, or decision."
                value={actionNotes[action.id] ?? ''}
                onChange={(event) => setActionNotes((current) => ({ ...current, [action.id]: event.target.value }))}
              />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{playbook.hero.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{playbook.hero.h1}</h1>
        <p className="mt-3 max-w-3xl text-lg leading-7 text-slate-700">{playbook.hero.subheading}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="rounded-md bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800" onClick={startPlaybook}>
            {started ? 'Playbook started' : playbook.hero.primaryCta}
          </button>
          <button type="button" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:border-brand-400" onClick={() => window.print()}>
            {playbook.hero.secondaryCta ?? 'Print checklist'}
          </button>
        </div>
        <p className="mt-3 text-xs text-slate-500">Use as a working checklist. Complete what is useful now and return when the situation changes.</p>
      </header>

      {playbook.safetyBanner ? (
        <section className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <h2 className="text-lg font-semibold text-rose-950">{playbook.safetyBanner.title}</h2>
          <p className="mt-2 text-sm leading-6 text-rose-950">{playbook.safetyBanner.body}</p>
          <p className="mt-2 text-sm font-semibold leading-6 text-rose-950">{playbook.safetyBanner.emergencyInstruction}</p>
        </section>
      ) : null}

      <SourceUpdateModule playbook={playbook} />

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)]">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-slate-950">Who this playbook is for</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
            {playbook.audience.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-950">Common triggers</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {playbook.triggerEvents.map((event) => (
              <span key={event} className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">
                {event}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-950">Quick situation intake</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">These answers personalize the callouts and summary. They do not block access to the playbook.</p>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {playbook.intakeQuestions.map((question) => (
            <QuestionInput key={question.id} question={question} value={intake[question.id]} onChange={(value) => updateIntake(question.id, value)} />
          ))}
        </div>
      </section>

      {safetyOverride ? <CareSafetyOverride /> : null}

      {callouts.length ? (
        <section className="grid gap-3 md:grid-cols-2">
          {callouts.map((callout) => (
            <div key={callout.title} className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h2 className="text-base font-semibold text-amber-950">{callout.title}</h2>
              <p className="mt-1 text-sm leading-6 text-amber-950">{callout.body}</p>
            </div>
          ))}
        </section>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.75fr)]">
        <div className="space-y-4">
          {renderActionList('What to do now', playbook.actionSections.now)}
          {playbook.actionSections.next24Hours ? renderActionList('What to do in the next 24 hours', playbook.actionSections.next24Hours) : null}
          {renderActionList('What to do this week', playbook.actionSections.thisWeek)}

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-semibold text-slate-950">What to document</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">These fields feed the shareable Family Care Plan Summary.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {playbook.documentation.map((field) => (
                <DocumentationInput key={field.id} field={field} value={docs[field.id]} onChange={(value) => updateDoc(field.id, value)} />
              ))}
            </div>
          </section>

          {['dementia', 'care-refusal', 'cost-pressure', 'aging-in-place'].includes(playbook.category) ? <SafetyThresholdBuilder playbook={playbook} /> : null}
          {playbook.category === 'care-refusal' ? <SmallestAcceptableHelpSelector /> : null}
          <CareSettingPressureMeter playbook={playbook} intake={intake} docs={docs} />
          {playbook.category === 'medicare-review' ? <AnnualMedicareReviewChecklist /> : null}
          {playbook.category === 'insurance-claim' ? <PolicyGapCalculatorPrompt docs={docs} intake={intake} /> : null}
          {['medicaid-planning', 'family-care-costs'].includes(playbook.category) ? <PrivatePayRunwayEstimator docs={docs} intake={intake} /> : null}
          {playbook.category === 'family-care-costs' ? <CostScenarioBuilder /> : null}
          <ProfessionalQuestionBuilder playbook={playbook} />
          {['family-conflict', 'shared-costs', 'driving-safety', 'facility-concern'].includes(playbook.category) ? <ConversationBuilder playbook={playbook} /> : null}
          {['family-conflict', 'shared-costs'].includes(playbook.category) ? <TaskOwnershipTable /> : null}
          {['family-conflict', 'shared-costs'].includes(playbook.category) ? <FairnessMap /> : null}
          {playbook.category === 'driving-safety' ? <DrivingEventLog /> : null}
          {playbook.category === 'facility-concern' ? <FacilityConcernLog /> : null}
          {['driving-safety', 'facility-concern'].includes(playbook.category) ? <EscalationPathSelector playbook={playbook} /> : null}

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-950">Who to call</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {playbook.whoToCall.map((contact) => (
                <div key={contact.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                  <h3 className="text-sm font-semibold text-slate-950">{contact.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Call when</p>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{contact.whenToCall}</p>
                  {contact.whatToSay ? (
                    <>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">What to say</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{contact.whatToSay}</p>
                    </>
                  ) : null}
                  {contact.whatToPrepare ? (
                    <>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">What to prepare</p>
                      <p className="mt-1 text-sm leading-6 text-slate-700">{contact.whatToPrepare}</p>
                    </>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <section className="rounded-lg border border-brand-200 bg-white p-4">
            <h2 className="text-lg font-semibold text-slate-950">Kefiw tools to use</h2>
            <div className="mt-3 grid gap-2">
              {playbook.recommendedTools.map((tool) => (
                <ToolCard key={tool.name} tool={tool} playbookId={playbook.id} />
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-lg font-semibold text-slate-950">Family scripts</h2>
            <div className="mt-3 space-y-3">
              {playbook.scripts.map((script, index) => (
                <div key={script.title} className="rounded-md border border-slate-200 bg-white p-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-slate-950">{script.title}</h3>
                    <button
                      type="button"
                      className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 hover:border-brand-400"
                      onClick={() => copyText(script.body, `script-${index}`)}
                    >
                      {copiedScript === `script-${index}` ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{script.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-rose-200 bg-rose-50 p-4">
            <h2 className="text-lg font-semibold text-rose-950">Red flags</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-rose-950">
              {playbook.redFlags.map((flag) => (
                <li key={flag}>{flag}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-950">Escalation triggers</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
            {playbook.escalationRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-slate-950">Set a suggested review date</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">{playbook.summaryOutput.reviewDateLabel}</p>
          <label className="mt-3 block text-sm font-semibold text-slate-900">
            Review again in days
            <input
              type="number"
              min={1}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900"
              value={reviewDays}
              onChange={(event) => {
                setReviewDays(Number(event.target.value));
                emitPlaybookEvent(playbook.id, 'review_date_set', { days: Number(event.target.value) });
              }}
            />
          </label>
          <p className="mt-2 text-sm text-slate-700">Suggested review date: <strong>{reviewDate}</strong></p>
        </div>
      </section>

      <section className="rounded-lg border border-brand-200 bg-brand-50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Generate care summary</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{playbook.summaryOutput.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              Send the intake, documentation, checked actions, recommended tools, questions, and review date to the Family Care Plan Summary.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400" onClick={copySummary}>
              {copiedSummary ? 'Copied' : 'Copy summary'}
            </button>
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400"
              onClick={() => {
                emitPlaybookEvent(playbook.id, 'summary_printed');
                window.print();
              }}
            >
              Print summary
            </button>
            <button type="button" className="rounded-md bg-brand-700 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-800" onClick={generateSummaryDraft}>
              Send to Family Summary
            </button>
          </div>
        </div>
        <div className="mt-4 rounded-md border border-brand-200 bg-white p-3">
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap text-xs leading-5 text-slate-700">{summaryText}</pre>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-950">You have a starting plan.</h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          You documented what happened, identified the next care steps, and selected tools to continue planning.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <a className="rounded-md border border-brand-200 bg-brand-50 p-3 text-sm font-semibold text-brand-800 no-underline hover:border-brand-400" href={playbook.recommendedTools[0]?.href}>
            Recommended next: {playbook.recommendedTools[0]?.name}
          </a>
          <a className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400" href={playbook.relatedGuides[0]?.href}>
            Related guide: {playbook.relatedGuides[0]?.label}
          </a>
          <button type="button" className="rounded-md border border-slate-300 bg-white p-3 text-left text-sm font-semibold text-slate-900 hover:border-brand-400" onClick={generateSummaryDraft}>
            Generate family summary
          </button>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-950">Related guides</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {playbook.relatedGuides.map((guide) => (
            <a
              key={guide.href}
              className="rounded-md border border-slate-200 bg-white p-3 text-slate-900 no-underline hover:border-brand-400"
              href={guide.href}
              onClick={() => emitPlaybookEvent(playbook.id, 'related_guide_clicked', { href: guide.href })}
            >
              <div className="text-sm font-semibold">{guide.label}</div>
              {guide.reason ? <p className="mt-1 text-xs leading-5 text-slate-600">{guide.reason}</p> : null}
            </a>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 text-sm leading-6 text-slate-700">
        <h2 className="text-lg font-semibold text-slate-950">Review and scope</h2>
        <p className="mt-2">
          Recommended reviewer type: {playbook.reviewerType.join(', ')}. Last reviewed: April 30, 2026. Next scheduled review: annual update cycle or sooner when guidance changes.
        </p>
        <p className="mt-2">
          {financialDisclaimer(playbook)}
        </p>
      </section>
    </div>
  );
}

export type CarePlaybookCategory =
  | 'safety'
  | 'hospital-transition'
  | 'facility-decision'
  | 'caregiver-support'
  | 'medicare'
  | 'insurance'
  | 'dementia'
  | 'care-refusal'
  | 'cost-pressure'
  | 'aging-in-place'
  | 'medicare-review'
  | 'insurance-claim'
  | 'medicaid-planning'
  | 'family-care-costs'
  | 'family-conflict'
  | 'shared-costs'
  | 'driving-safety'
  | 'facility-concern';

export type PlaybookQuestionType = 'single_select' | 'multi_select' | 'text' | 'boolean' | 'date' | 'number';

export type PlaybookRiskTag =
  | 'wandering'
  | 'unsafe_alone'
  | 'nighttime_risk'
  | 'medication_risk'
  | 'refusal_of_care'
  | 'caregiver_overload'
  | 'home_safety'
  | 'cost_pressure'
  | 'facility_comparison'
  | 'adult_day_care'
  | 'respite'
  | 'legal_authority'
  | 'annual_medicare_review'
  | 'part_d_drug_cost'
  | 'doctor_network'
  | 'hospital_network'
  | 'prior_authorization'
  | 'irmaa_risk'
  | 'medigap_timing'
  | 'ltc_policy_found'
  | 'ltc_claim_needed'
  | 'elimination_period'
  | 'benefit_gap'
  | 'medicaid_possible'
  | 'asset_transfer_risk'
  | 'hcbs_possible'
  | 'facility_cost_pressure'
  | 'family_payment_conflict'
  | 'private_pay_running_out'
  | 'professional_review_needed'
  | 'task_ownership_gap'
  | 'primary_caregiver_overloaded'
  | 'sibling_unavailable'
  | 'sibling_refuses'
  | 'money_conflict'
  | 'unequal_income'
  | 'unequal_distance'
  | 'family_payment_rule_needed'
  | 'driving_safety_concern'
  | 'dementia_driving_concern'
  | 'immediate_public_safety_risk'
  | 'facility_documentation_needed'
  | 'ombudsman_possible'
  | 'state_survey_possible'
  | 'aps_possible'
  | 'retaliation_fear'
  | 'legal_authority_unclear'
  | 'professional_review';

export interface RoutingRule {
  when: string;
  show: string;
}

export interface PlaybookQuestion {
  id: string;
  label: string;
  type: PlaybookQuestionType;
  options?: string[];
  required?: boolean;
  safetyCritical?: boolean;
  routingRules?: RoutingRule[];
}

export interface PlaybookActionCta {
  label: string;
  href: string;
  type: 'calculator' | 'guide' | 'worksheet' | 'track' | 'external' | 'internal';
}

export interface PlaybookAction {
  id: string;
  title: string;
  body: string;
  whyItMatters?: string;
  cta?: PlaybookActionCta;
  completionType: 'checkbox' | 'note' | 'tool_required' | 'optional';
  safetyTag?: 'emergency' | 'clinician' | 'document' | 'family' | 'cost' | 'care-plan';
  riskTags?: PlaybookRiskTag[];
}

export interface DocumentationField {
  id: string;
  label: string;
  placeholder?: string;
  fieldType: 'text' | 'textarea' | 'date' | 'time' | 'select' | 'multi_select' | 'number';
  options?: string[];
  requiredForSummary?: boolean;
}

export interface ContactRecommendation {
  id: string;
  title: string;
  whenToCall: string;
  whatToSay?: string;
  whatToPrepare?: string;
}

export interface ToolRecommendation {
  name: string;
  href: string;
  reason: string;
  type: 'calculator' | 'guide' | 'worksheet' | 'track' | 'tool';
  primary?: boolean;
}

export interface RelatedGuide {
  label: string;
  href: string;
  reason?: string;
}

export interface SummaryOutputConfig {
  title: string;
  includes: string[];
  recommendedNextSteps: string[];
  questionsToAsk: string[];
  defaultReviewDays: number;
  reviewDateLabel: string;
}

export interface CarePlaybook {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: CarePlaybookCategory;
  metaTitle: string;
  metaDescription: string;
  hero: {
    eyebrow: string;
    h1: string;
    subheading: string;
    primaryCta: string;
    secondaryCta?: string;
  };
  audience: string[];
  triggerEvents: string[];
  riskTags?: PlaybookRiskTag[];
  safetyLevel: 'routine' | 'prompt' | 'urgent' | 'emergency-aware';
  safetyBanner?: {
    title: string;
    body: string;
    emergencyInstruction?: string;
  };
  intakeQuestions: PlaybookQuestion[];
  actionSections: {
    now: PlaybookAction[];
    next24Hours?: PlaybookAction[];
    thisWeek: PlaybookAction[];
  };
  documentation: DocumentationField[];
  whoToCall: ContactRecommendation[];
  recommendedTools: ToolRecommendation[];
  scripts: {
    title: string;
    body: string;
  }[];
  redFlags: string[];
  escalationRules: string[];
  summaryOutput: SummaryOutputConfig;
  relatedGuides: RelatedGuide[];
  reviewerType: string[];
  disclaimerType: 'health' | 'legal-financial' | 'medicare' | 'insurance' | 'general-care' | 'mixed' | 'financial-legal-insurance-medicare';
  analyticsEvents: string[];
}

export const PLAYBOOK_CATEGORY_LABELS: Record<CarePlaybookCategory, string> = {
  safety: 'Safety and urgent moments',
  'hospital-transition': 'Hospital and care transitions',
  'facility-decision': 'Facility decisions',
  'caregiver-support': 'Caregiver support',
  medicare: 'Medicare and insurance',
  insurance: 'Medicare and insurance',
  dementia: 'Dementia safety',
  'care-refusal': 'Care refusal',
  'cost-pressure': 'Cost pressure',
  'aging-in-place': 'Aging in place safety',
  'medicare-review': 'Medicare review',
  'insurance-claim': 'Insurance claims',
  'medicaid-planning': 'Medicaid planning',
  'family-care-costs': 'Family care costs',
  'family-conflict': 'Family conflict and communication',
  'shared-costs': 'Shared care costs',
  'driving-safety': 'Driving safety',
  'facility-concern': 'Facility concerns',
};

const sharedAnalyticsEvents = [
  'playbook_viewed',
  'playbook_started',
  'safety_banner_viewed',
  'safety_override_triggered',
  'intake_completed',
  'action_checked',
  'tool_clicked',
  'worksheet_opened',
  'summary_generated',
  'summary_printed',
  'summary_shared',
  'review_date_set',
  'playbook_completed',
  'related_guide_clicked',
];

export const CARE_PLAYBOOKS: CarePlaybook[] = [
  {
    id: 'parent-had-a-fall',
    slug: 'parent-had-a-fall',
    title: 'My Parent Had a Fall - What Now?',
    shortTitle: 'Parent had a fall',
    category: 'safety',
    metaTitle: 'My Parent Had a Fall - What to Do Next',
    metaDescription:
      'Use this fall playbook to check immediate safety, document what happened, plan follow-up, reduce future fall risk, and decide whether the care plan needs to change.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'My Parent Had a Fall - What Now?',
      subheading:
        'Use this playbook to check immediate safety, document what happened, decide who to call, and update the care plan after a fall or near-fall.',
      primaryCta: 'Start fall playbook',
      secondaryCta: 'Open fall log',
    },
    audience: [
      'Family caregivers responding to a fall or near-fall.',
      'Long-distance family members who need a clear follow-up plan.',
      'Caregivers deciding whether home safety, supervision, or care needs changed.',
    ],
    triggerEvents: ['Fall', 'Near-fall', 'Bathroom fall', 'Nighttime fall', 'Repeated falls', 'New weakness after a fall'],
    safetyLevel: 'emergency-aware',
    safetyBanner: {
      title: 'Important safety note',
      body:
        'If the person is seriously injured, confused, unconscious, having trouble breathing, having chest pain, unable to move normally, bleeding heavily, showing stroke-like symptoms, or you are unsure whether this is an emergency, call emergency services now.',
      emergencyInstruction: 'This playbook does not diagnose injuries or replace medical care.',
    },
    intakeQuestions: [
      {
        id: 'fall_or_near_fall',
        label: 'Was this a fall or a near-fall?',
        type: 'single_select',
        options: ['Fall', 'Near-fall', 'Not sure'],
      },
      {
        id: 'immediate_danger',
        label: 'Is there immediate danger or serious injury?',
        type: 'boolean',
        safetyCritical: true,
      },
      {
        id: 'hit_head',
        label: 'Did they hit their head or have possible head, neck, or spine injury?',
        type: 'boolean',
        safetyCritical: true,
      },
      {
        id: 'confusion_after_fall',
        label: 'Are they newly confused, unusually sleepy, or not acting like themselves?',
        type: 'boolean',
        safetyCritical: true,
      },
      {
        id: 'can_move_normally',
        label: 'Can they move as they normally do?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
        routingRules: [{ when: 'No', show: 'This may need urgent medical attention.' }],
      },
      {
        id: 'fall_location',
        label: 'Where did it happen?',
        type: 'single_select',
        options: ['Bedroom', 'Bathroom', 'Kitchen', 'Stairs', 'Outside', 'Facility', 'Other'],
      },
      {
        id: 'fall_time',
        label: 'When did it happen?',
        type: 'single_select',
        options: ['Today', 'Yesterday', 'Within the past week', 'Earlier', 'Not sure'],
      },
      {
        id: 'repeat_falls',
        label: 'Has this happened before in the past 30 days?',
        type: 'boolean',
      },
    ],
    actionSections: {
      now: [
        {
          id: 'check-immediate-safety',
          title: 'Check immediate safety',
          body:
            'Do not rush the person up. Check for serious injury, new confusion, severe pain, trouble breathing, chest pain, head injury, or inability to move normally.',
          cta: { label: 'Use Care Urgency Check', href: '/health/medical-triage/', type: 'calculator' },
          completionType: 'checkbox',
          safetyTag: 'emergency',
        },
        {
          id: 'document-what-happened',
          title: 'Document what happened',
          body:
            'Write down the time, location, what they were doing, whether they hit their head, whether they seemed dizzy or confused, and whether medications recently changed.',
          cta: { label: 'Open Fall and Near-Fall Log', href: '/care/guides/fall-near-fall-log/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'document',
        },
        {
          id: 'notify-right-person',
          title: 'Notify the right person',
          body:
            'Depending on severity, contact emergency services, a doctor or nurse line, the facility, home care agency, or the primary caregiver.',
          completionType: 'note',
          safetyTag: 'family',
        },
      ],
      next24Hours: [
        {
          id: 'watch-for-changes',
          title: 'Watch for changes',
          body:
            'Watch for new pain, confusion, dizziness, weakness, sleepiness, trouble walking, headache, vomiting, or behavior changes.',
          completionType: 'checkbox',
          safetyTag: 'clinician',
        },
        {
          id: 'review-fall-environment',
          title: 'Review the fall environment',
          body:
            'Look at the exact location where the fall happened. Check lighting, rugs, bathroom setup, footwear, pets, clutter, stairs, mobility device access, and nighttime path.',
          cta: { label: 'Open Home Safety Checklist', href: '/care/guides/home-safety-checklist-older-adults/', type: 'guide' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
        },
        {
          id: 'check-medication-changes',
          title: 'Check medication changes',
          body:
            'If medications recently changed, or if dizziness, sleepiness, or confusion was involved, prepare a medication review question for a clinician or pharmacist.',
          cta: { label: 'Open Medication List Template', href: '/care/guides/medication-list-change-log-template/', type: 'worksheet' },
          completionType: 'optional',
          safetyTag: 'clinician',
        },
      ],
      thisWeek: [
        {
          id: 'reassess-care-needs',
          title: 'Reassess care needs',
          body:
            'A fall may mean the current care plan is too thin. Review mobility, bathroom safety, supervision, caregiver workload, and whether home care or facility support should change.',
          cta: { label: 'Start Care Needs Checklist', href: '/care/care-needs-checklist/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
        },
        {
          id: 'estimate-added-workload',
          title: 'Estimate added care workload',
          body:
            'If the fall means someone now needs more help with walking, bathing, toileting, transfers, or nighttime support, estimate the added caregiver hours.',
          cta: { label: 'Use Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
        },
        {
          id: 'create-escalation-rule',
          title: 'Create an escalation rule',
          body:
            'Write a rule for when the family will revisit the care plan, such as another fall in 30 days, repeated bathroom falls, or a nighttime fall.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'fall_date', label: 'Date of fall or near-fall', fieldType: 'date', requiredForSummary: true },
      { id: 'fall_time', label: 'Time', fieldType: 'time' },
      {
        id: 'fall_location',
        label: 'Location',
        fieldType: 'text',
        placeholder: 'Bathroom, bedroom, stairs, kitchen, outside...',
      },
      {
        id: 'fall_activity',
        label: 'What were they doing?',
        fieldType: 'textarea',
        placeholder: 'Walking to bathroom, getting out of bed, reaching for something...',
      },
      { id: 'injury_notes', label: 'Injury or symptoms noticed', fieldType: 'textarea' },
      {
        id: 'who_was_notified',
        label: 'Who was notified?',
        fieldType: 'textarea',
        placeholder: 'Doctor, family member, facility, home care agency...',
      },
      { id: 'follow_up_needed', label: 'Follow-up needed', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'emergency-services',
        title: 'Emergency services',
        whenToCall:
          'Call for serious injury, head injury, new confusion, severe pain, breathing trouble, chest pain, stroke-like symptoms, heavy bleeding, or immediate danger.',
        whatToPrepare: 'Location, what happened, current symptoms, medications, and whether they hit their head.',
      },
      {
        id: 'doctor-nurse-line',
        title: 'Doctor or nurse line',
        whenToCall:
          'Call when the fall does not appear immediately life-threatening, but there is pain, dizziness, new weakness, repeated falls, medication changes, or a meaningful change from baseline.',
        whatToSay:
          'Normally, they can ____. After the fall, they can/cannot ____. The fall happened at ____. They did/did not hit their head. We noticed ____. What level of care should we seek?',
      },
      {
        id: 'facility',
        title: 'Facility',
        whenToCall: 'Call when the person lives in assisted living, memory care, nursing home, or rehab.',
        whatToSay:
          'Can you document the fall, tell us what happened, explain what follow-up is planned, and update the care plan if fall risk has changed?',
      },
      {
        id: 'home-care-agency',
        title: 'Home care agency',
        whenToCall:
          'Call when a paid caregiver was present, should have been present, or the fall suggests the schedule needs adjustment.',
        whatToPrepare: 'Fall time, caregiver schedule, care plan tasks, and what support may need to change.',
      },
    ],
    recommendedTools: [
      { name: 'Care Urgency Check', href: '/health/medical-triage/', reason: 'Organize urgent versus prompt care questions.', type: 'tool', primary: true },
      { name: 'Fall and Near-Fall Log', href: '/care/guides/fall-near-fall-log/', reason: 'Document the event and find patterns.', type: 'worksheet' },
      { name: 'Home Safety Checklist', href: '/care/guides/home-safety-checklist-older-adults/', reason: 'Review the exact place the fall happened.', type: 'guide' },
      { name: 'Care Needs Checklist', href: '/care/care-needs-checklist/', reason: 'Reassess mobility, supervision, bathroom safety, and family workload.', type: 'calculator' },
      { name: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', reason: 'Estimate added care workload after the fall.', type: 'calculator' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are not tracking this fall to blame anyone. We need to understand what happened, what changed, and what support would make the next fall less likely.',
      },
      {
        title: 'Clinician call script',
        body:
          'Normally, they can ____. After the fall, they can/cannot ____. The fall happened at ____. They did/did not hit their head. We noticed ____. What level of care should we seek?',
      },
    ],
    redFlags: [
      'Repeated falls',
      'Falls at night',
      'Bathroom falls',
      'Head injury',
      'New confusion',
      'New weakness',
      'Dizziness',
      'Medication changes before fall',
      'Caregiver cannot safely help them up',
      'The person hides falls',
      'The home was not changed after a previous fall',
    ],
    escalationRules: [
      'If there is another fall in 30 days, reassess living alone.',
      'If bathroom falls continue, add bathroom support or paid care.',
      'If nighttime falls happen, create an overnight safety plan.',
    ],
    summaryOutput: {
      title: 'Fall Follow-Up Summary',
      includes: [
        'Fall date and location',
        'Immediate safety concerns',
        'Symptoms or injuries',
        'Who was contacted',
        'Follow-up plan',
        'Home safety issues found',
        'Care needs that may have changed',
        'Recommended next tools',
        'Family escalation rule',
        'Review date',
      ],
      recommendedNextSteps: [
        'Use Care Urgency Check if symptoms are new, severe, worsening, or uncertain.',
        'Fill out the Fall and Near-Fall Log.',
        'Review the fall location with the Home Safety Checklist.',
        'Start the Care Needs Checklist this week.',
        'Set a suggested review date in 7 days, or sooner if symptoms change.',
      ],
      questionsToAsk: [
        'Could medications, dizziness, weakness, or infection have contributed to the fall?',
        'What symptoms should trigger urgent or emergency help?',
        'Does the care plan need more supervision, mobility help, or bathroom support?',
      ],
      defaultReviewDays: 7,
      reviewDateLabel: '7 days, or sooner if symptoms change',
    },
    relatedGuides: [
      { label: 'Fall and Near-Fall Log', href: '/care/guides/fall-near-fall-log/', reason: 'Track the event and monthly patterns.' },
      { label: 'Fall Prevention Daily Routine', href: '/care/guides/fall-prevention-daily-routine/', reason: 'Build daily fall-risk checks.' },
      { label: 'Mobility, Transfers, and Walking Safety', href: '/care/guides/mobility-transfers-walking-safety/', reason: 'Review movement and transfer safety.' },
    ],
    reviewerType: ['Clinician', 'Physical therapist', 'Occupational therapist', 'Patient safety reviewer'],
    disclaimerType: 'health',
    analyticsEvents: [...sharedAnalyticsEvents, 'emergency_language_viewed', 'clinician_call_script_copied', 'documentation_log_started'],
  },
  {
    id: 'hospital-discharge-coming',
    slug: 'hospital-discharge-coming',
    title: 'Hospital Discharge Is Coming - What Should We Ask?',
    shortTitle: 'Hospital discharge',
    category: 'hospital-transition',
    metaTitle: 'Hospital Discharge Is Coming - Questions Families Should Ask',
    metaDescription:
      'Use this hospital discharge playbook to prepare for home, rehab, skilled nursing, medication changes, equipment, follow-up care, and family caregiving needs.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Hospital Discharge Is Coming - What Should We Ask?',
      subheading:
        'Use this playbook to prepare for discharge, understand care needs, clarify medication changes, plan the first night, and avoid unsafe transitions.',
      primaryCta: 'Start discharge playbook',
      secondaryCta: 'Print discharge questions',
    },
    audience: [
      'Families preparing for hospital, rehab, skilled nursing, or emergency department discharge.',
      'Caregivers who need to plan the first night and first week.',
      'Long-distance family members trying to clarify equipment, medication, and follow-up needs.',
    ],
    triggerEvents: ['Hospital discharge', 'Rehab discharge', 'Emergency department discharge', 'Medication changes', 'New equipment needs'],
    safetyLevel: 'urgent',
    safetyBanner: {
      title: 'Important discharge safety note',
      body:
        'If the person may be medically unstable, in immediate danger, or unsafe to leave the hospital without support, speak with the care team immediately.',
      emergencyInstruction: 'This playbook does not replace medical discharge planning.',
    },
    intakeQuestions: [
      {
        id: 'current_location',
        label: 'Where is the person now?',
        type: 'single_select',
        options: ['Hospital', 'Rehab', 'Skilled nursing facility', 'Emergency department', 'Other'],
      },
      {
        id: 'planned_destination',
        label: 'Where are they expected to go?',
        type: 'single_select',
        options: ['Home alone', 'Home with family', 'Home with home health', 'Short-term rehab', 'Nursing home', 'Assisted living', 'Not sure'],
      },
      {
        id: 'discharge_timing',
        label: 'When is discharge expected?',
        type: 'single_select',
        options: ['Today', 'Tomorrow', 'This week', 'Not scheduled yet', 'Not sure'],
      },
      {
        id: 'med_changes',
        label: 'Were medications changed?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'equipment_needed',
        label: 'Is equipment needed?',
        type: 'multi_select',
        options: ['Walker', 'Wheelchair', 'Oxygen', 'Hospital bed', 'Shower chair', 'Commode', 'Wound supplies', 'Not sure'],
      },
      {
        id: 'caregiver_ready',
        label: 'Is a caregiver ready and trained for the first night?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'first_night_concern',
        label: 'What is the biggest first-night concern?',
        type: 'multi_select',
        options: ['Falls', 'Medication', 'Toileting', 'Meals', 'Confusion', 'Pain', 'Breathing', 'Wound care', 'No caregiver coverage', 'Not sure'],
      },
    ],
    actionSections: {
      now: [
        {
          id: 'ask-first-night-question',
          title: 'Ask the first-night question',
          body: 'Ask the discharge team: "What exactly needs to happen during the first night after discharge?"',
          whyItMatters:
            'The first night often reveals missing equipment, unclear medications, unsafe bathroom needs, or caregiver training gaps.',
          completionType: 'checkbox',
          safetyTag: 'care-plan',
        },
        {
          id: 'confirm-medication-changes',
          title: 'Confirm medication changes',
          body:
            'Ask for a clear medication list that shows what is new, what changed, what stopped, and what to watch for.',
          cta: { label: 'Open Medication List and Change Log', href: '/care/guides/medication-list-change-log-template/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'clinician',
        },
        {
          id: 'confirm-equipment-before-arrival',
          title: 'Confirm equipment before arrival',
          body:
            'Ask what equipment is needed and whether it will be delivered before the person arrives home or transfers to the next setting.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
      next24Hours: [
        {
          id: 'complete-care-needs-review',
          title: 'Complete care needs review',
          body: 'Review mobility, toileting, bathing, meals, medication, memory, supervision, and caregiver workload.',
          cta: { label: 'Start Care Needs Checklist', href: '/care/care-needs-checklist/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
        },
        {
          id: 'assign-first-week-task-owners',
          title: 'Assign first-week task owners',
          body: 'Decide who owns medications, follow-up appointments, meals, transportation, home setup, and family updates.',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'ask-after-hours',
          title: 'Ask who to call after hours',
          body:
            'Before discharge, write down the phone number for questions after hours and what symptoms should trigger urgent help.',
          completionType: 'checkbox',
          safetyTag: 'clinician',
        },
      ],
      thisWeek: [
        {
          id: 'estimate-added-care-cost',
          title: 'Estimate added care cost',
          body:
            'If going home, estimate whether paid home care is needed. If going to rehab or nursing home, estimate short-term and possible long-term care costs if discharge home is delayed or unsafe.',
          cta: { label: 'Use Home Care Cost Calculator', href: '/care/home-care-cost-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
        },
        {
          id: 'create-72-hour-plan',
          title: 'Create a 72-hour plan',
          body:
            'Write what must happen during the first 72 hours: medications, meals, bathroom support, mobility, appointments, symptoms to watch, and backup caregiver.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
        {
          id: 'schedule-care-plan-review',
          title: 'Schedule care plan review',
          body:
            'Set a suggested review date within 7-14 days after discharge, or sooner if there is a fall, confusion, medication issue, or caregiver overload.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'discharge_date', label: 'Expected discharge date', fieldType: 'date', requiredForSummary: true },
      {
        id: 'destination',
        label: 'Discharge destination',
        fieldType: 'select',
        options: ['Home alone', 'Home with family', 'Home with home health', 'Short-term rehab', 'Nursing home', 'Assisted living', 'Not sure'],
        requiredForSummary: true,
      },
      {
        id: 'medication_changes',
        label: 'Medication changes',
        fieldType: 'textarea',
        placeholder: 'New, stopped, changed, unclear...',
      },
      { id: 'equipment_needed', label: 'Equipment needed', fieldType: 'textarea' },
      { id: 'first_night_plan', label: 'First-night plan', fieldType: 'textarea', requiredForSummary: true },
      { id: 'after_hours_number', label: 'After-hours contact', fieldType: 'text' },
      { id: 'follow_up_appointments', label: 'Follow-up appointments', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'case-manager',
        title: 'Hospital discharge planner or case manager',
        whenToCall: 'Call when discharge destination, equipment, home health, rehab, or coverage is unclear.',
        whatToSay:
          'We need a safe discharge plan. What care is required, what equipment is needed, what medications changed, and what would make home unsafe?',
      },
      {
        id: 'doctor-nurse',
        title: 'Doctor or nurse',
        whenToCall: 'Call when symptoms, medication changes, wound care, pain, or warning signs are unclear.',
        whatToPrepare: 'Medication list, new symptoms, equipment needs, and specific first-night concerns.',
      },
      {
        id: 'home-care-agency',
        title: 'Home care agency',
        whenToCall:
          'Call when the person needs help at home with bathing, toileting, transfers, meals, supervision, or caregiver relief.',
        whatToPrepare: 'Start date, schedule needs, tasks needed, mobility needs, and backup plan.',
      },
      {
        id: 'family-task-owners',
        title: 'Family task owners',
        whenToCall: 'Call when the plan depends on family support after discharge.',
        whatToPrepare: 'A short list of tasks, owners, backups, and the first 72-hour plan.',
      },
    ],
    recommendedTools: [
      { name: 'Care Needs Checklist', href: '/care/care-needs-checklist/', reason: 'Review what daily support discharge requires.', type: 'calculator', primary: true },
      { name: 'Medication List and Change Log', href: '/care/guides/medication-list-change-log-template/', reason: 'Track new, stopped, changed, and unclear medications.', type: 'worksheet' },
      { name: 'Home Care Cost Calculator', href: '/care/home-care-cost-calculator/', reason: 'Estimate paid help after discharge home.', type: 'calculator' },
      { name: 'Nursing Home Cost Calculator', href: '/care/nursing-home-cost-calculator/', reason: 'Estimate rehab or nursing home cost scenarios.', type: 'calculator' },
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Add new supplies, home care, transportation, and family support costs.', type: 'calculator' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are not refusing discharge. We are asking for a safe plan. We need to know what care is required, who will provide it, what equipment is needed, and who to call if the plan fails.',
      },
      {
        title: 'Discharge team script',
        body:
          'What exactly needs to happen during the first night after discharge, what medications changed, what equipment must be in place, and what symptoms should trigger urgent help?',
      },
    ],
    redFlags: [
      'Discharge today but no caregiver coverage',
      'Medication changes are unclear',
      'Equipment is not delivered',
      'The person cannot safely toilet or transfer',
      'No after-hours number',
      'No follow-up appointments',
      'Home health is assumed but not arranged',
      'Family is told to figure it out at home',
      'Caregiver has not been trained',
    ],
    escalationRules: [
      'If discharge is today or tomorrow and caregiver coverage is not ready, ask for a safe discharge plan now.',
      'If the person is expected to be home alone with multiple first-night risks, ask the team to reassess the plan.',
      'If equipment, medication instructions, or after-hours contact is missing, clarify before leaving.',
    ],
    summaryOutput: {
      title: 'Discharge Prep Summary',
      includes: [
        'Discharge date',
        'Destination',
        'Medication changes',
        'Equipment needed',
        'First-night plan',
        'Caregiver task owners',
        'After-hours number',
        'Follow-up appointments',
        'Main safety risks',
        'Estimated added care cost',
        'Review date',
      ],
      recommendedNextSteps: [
        'Ask the first-night question before discharge.',
        'Open the Medication Change Log.',
        'Start the Care Needs Checklist.',
        'Estimate home care or nursing home cost if added support may be needed.',
        'Generate a discharge prep summary for family and providers.',
      ],
      questionsToAsk: [
        'What care must happen during the first night?',
        'What medications are new, stopped, changed, or unclear?',
        'What equipment must be delivered before arrival?',
        'Who do we call after hours?',
        'What would make home unsafe?',
      ],
      defaultReviewDays: 7,
      reviewDateLabel: '3-7 days after discharge',
    },
    relatedGuides: [
      { label: 'Medication List and Change Log Template', href: '/care/guides/medication-list-change-log-template/', reason: 'Make medication changes visible.' },
      { label: 'Daily Care Routine Guide', href: '/care/guides/daily-care-routine-aging-parent/', reason: 'Build a routine after discharge.' },
      { label: 'Caregiver Daily Check-In Log', href: '/care/guides/caregiver-daily-check-in-log/', reason: 'Track first-week changes.' },
    ],
    reviewerType: ['Clinician', 'Nurse reviewer', 'Geriatric care manager', 'Patient safety reviewer'],
    disclaimerType: 'health',
    analyticsEvents: [...sharedAnalyticsEvents, 'clinician_call_script_copied', 'documentation_log_started'],
  },
  {
    id: 'choose-care-facility-this-week',
    slug: 'choose-care-facility-this-week',
    title: 'We Need to Choose a Facility This Week',
    shortTitle: 'Choose a facility',
    category: 'facility-decision',
    metaTitle: 'We Need to Choose a Care Facility This Week',
    metaDescription:
      'Use this facility decision playbook to compare assisted living, memory care, nursing homes, costs, red flags, contracts, and family questions under time pressure.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'We Need to Choose a Facility This Week',
      subheading:
        'Use this playbook to compare care fit, cost, safety, communication, red flags, and contract questions before making a rushed facility decision.',
      primaryCta: 'Start facility decision playbook',
      secondaryCta: 'Open facility comparison worksheet',
    },
    audience: [
      'Families comparing assisted living, memory care, nursing homes, or rehab under time pressure.',
      'Caregivers who need a repeatable tour and scorecard process.',
      'Decision-makers reviewing cost, contract, care fit, and red flags before signing.',
    ],
    triggerEvents: ['Fall', 'Hospital discharge', 'Caregiver burnout', 'Memory changes', 'Unsafe at home', 'Facility discharge', 'Cost pressure'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Facility decision safety note',
      body:
        'If the person is unsafe, medically unstable, or being discharged soon, involve the care team, discharge planner, or qualified professional.',
      emergencyInstruction:
        'This playbook helps organize the decision but does not replace medical, legal, financial, or professional care advice.',
    },
    intakeQuestions: [
      {
        id: 'facility_type_needed',
        label: 'What type of facility are you considering?',
        type: 'multi_select',
        options: ['Assisted living', 'Memory care', 'Nursing home', 'Short-term rehab', 'Not sure'],
      },
      {
        id: 'decision_deadline',
        label: 'When does the family need to decide?',
        type: 'single_select',
        options: ['Today', 'This week', 'This month', 'No deadline yet'],
      },
      {
        id: 'trigger_event',
        label: 'What triggered the decision?',
        type: 'multi_select',
        options: ['Fall', 'Hospital discharge', 'Caregiver burnout', 'Memory changes', 'Unsafe at home', 'Cost', 'Facility discharge', 'Other'],
      },
      {
        id: 'main_risk',
        label: 'What is the biggest risk right now?',
        type: 'multi_select',
        options: ['Falls', 'Wandering', 'Medication', 'Toileting', 'Transfers', 'Nighttime safety', 'No caregiver', 'Cost', 'Family conflict'],
      },
      {
        id: 'toured_facilities',
        label: 'How many places have you toured or contacted?',
        type: 'single_select',
        options: ['0', '1', '2', '3 or more'],
      },
      {
        id: 'has_sample_invoice',
        label: 'Do you have a sample invoice or written fee estimate?',
        type: 'boolean',
      },
      {
        id: 'contract_reviewed',
        label: 'Has anyone reviewed the contract or admission agreement?',
        type: 'boolean',
      },
    ],
    actionSections: {
      now: [
        {
          id: 'define-care-need-first',
          title: 'Define the care need first',
          body:
            'Before comparing buildings, write down the person\'s care needs: mobility, medication, toileting, bathing, memory, supervision, nighttime needs, and behavior concerns.',
          cta: { label: 'Start Care Needs Checklist', href: '/care/care-needs-checklist/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
        },
        {
          id: 'estimate-full-monthly-cost',
          title: 'Estimate the full monthly cost',
          body:
            'Compare base rate, care-level fees, medication management, supplies, transportation, move-in fees, and likely increases.',
          cta: { label: 'Use Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
        },
        {
          id: 'choose-scorecard',
          title: 'Choose the correct scorecard',
          body:
            'Use the assisted living, memory care, or nursing home scorecard that matches the facility type you are considering.',
          cta: { label: 'Open Senior Care Decision Worksheet', href: '/care/guides/senior-care-decision-worksheet/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'document',
        },
      ],
      next24Hours: [
        {
          id: 'ask-same-ten-questions',
          title: 'Ask the same 10 questions everywhere',
          body:
            'Ask what is included, what costs extra, what makes the bill increase, what care needs they cannot support, what happens after a fall, how medications are managed, what happens at night, how families are updated, what triggers discharge, and whether you can see a sample invoice.',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'check-red-flags',
          title: 'Check for red flags',
          body:
            'Review pricing, staffing, discharge rules, communication, resident dignity, and pressure tactics before deciding.',
          cta: { label: 'Open Memory Care Red Flags', href: '/care/guides/memory-care-red-flags/', type: 'guide' },
          completionType: 'optional',
          safetyTag: 'care-plan',
        },
        {
          id: 'review-contract-risks',
          title: 'Review contract risks',
          body:
            'Before signing, review fees, rate increases, refund rules, discharge policy, responsible-party language, and arbitration clauses.',
          cta: { label: 'Open Facility Contract Checklist', href: '/care/guides/facility-contract-checklist/', type: 'guide' },
          completionType: 'tool_required',
          safetyTag: 'document',
        },
      ],
      thisWeek: [
        {
          id: 'create-family-decision-table',
          title: 'Create a family decision table',
          body: 'Compare each facility by care fit, cost, red flags, family confidence, and future flexibility.',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'decide-placement-failure-reason',
          title: 'Decide what would make the placement fail',
          body:
            'Write the top reason this facility might not work: cost increase, care needs too high, dementia needs, poor communication, distance, discharge risk, or family distrust.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
        {
          id: 'set-30-day-review-rule',
          title: 'Set a 30-day review rule',
          body:
            'After move-in, review cost, care fit, family communication, resident adjustment, and whether promised services are happening.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'facilities_considered', label: 'Facilities considered', fieldType: 'textarea', requiredForSummary: true },
      { id: 'care_needs', label: 'Main care needs', fieldType: 'textarea' },
      { id: 'monthly_estimates', label: 'Monthly cost estimates', fieldType: 'textarea' },
      { id: 'red_flags_found', label: 'Red flags or concerns', fieldType: 'textarea' },
      { id: 'best_fit', label: 'Current best fit', fieldType: 'text' },
      { id: 'contract_questions', label: 'Contract questions', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'facility-admissions',
        title: 'Facility admissions contact',
        whenToCall: 'Call when comparing pricing, care levels, medication support, and discharge rules.',
        whatToSay: 'Can you provide a written fee estimate, sample invoice, care-level explanation, and discharge policy?',
      },
      {
        id: 'doctor-care-team',
        title: 'Doctor or care team',
        whenToCall: 'Call when care level, transfer safety, memory needs, or home safety is unclear.',
        whatToSay: 'What level of care does this person need now, and what needs would make home or assisted living unsafe?',
      },
      {
        id: 'elder-law-attorney',
        title: 'Elder law attorney',
        whenToCall:
          'Call when contract terms, responsible-party language, Medicaid, private pay, discharge, or financial responsibility is unclear.',
        whatToPrepare: 'Admission agreement, fee schedule, sample invoice, refund policy, discharge policy, and questions.',
      },
      {
        id: 'ombudsman',
        title: 'Long-Term Care Ombudsman',
        whenToCall: 'Call when there are resident rights concerns, discharge concerns, or unresolved long-term care facility issues.',
        whatToPrepare: 'Facility name, dates, written notices, concerns, and attempts to resolve them.',
      },
    ],
    recommendedTools: [
      { name: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', reason: 'Compare full cost, not base rate only.', type: 'calculator', primary: true },
      { name: 'Assisted Living Tour Scorecard', href: '/care/guides/assisted-living-tour-scorecard/', reason: 'Compare communities by care fit, fees, safety, and communication.', type: 'worksheet' },
      { name: 'Memory Care Evaluation Scorecard', href: '/care/guides/memory-care-evaluation-scorecard/', reason: 'Evaluate dementia-specific safety and support.', type: 'worksheet' },
      { name: 'Nursing Home Visit Scorecard', href: '/care/guides/nursing-home-visit-scorecard/', reason: 'Compare staffing, dignity, communication, and care planning.', type: 'worksheet' },
      { name: 'Facility Contract Checklist', href: '/care/guides/facility-contract-checklist/', reason: 'Review fees, discharge rules, and contract risk before signing.', type: 'guide' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'Let\'s not pick the place that gives us the most reassurance today. Let\'s pick the place that can support the actual care needs, explain the real cost, communicate clearly, and tell us honestly what they cannot handle.',
      },
      {
        title: 'Facility call script',
        body:
          'Can you provide a written fee estimate, sample invoice, care-level explanation, medication fee policy, discharge policy, and the three most common reasons bills increase?',
      },
    ],
    redFlags: [
      'Only base rate is discussed',
      'Sample invoice refused',
      'Discharge policy unclear',
      'Pressure to sign quickly',
      'Medication support vague',
      'Nighttime staffing unclear',
      'Staff dismiss concerns',
      'Residents seem unattended',
      'Contract does not match verbal promises',
      'Family cannot explain why this is the safest fit',
    ],
    escalationRules: [
      'If memory care is being considered, use the Memory Care Evaluation Scorecard and ask how wandering distress is prevented.',
      'If nursing home care is being considered, use the Nursing Home Visit Scorecard and clarify Medicare, Medicaid, and private-pay rules.',
      'If no sample invoice is available, do not compare by base rate only.',
      'If the contract has not been reviewed, pause and review fees, discharge rules, responsible-party language, and arbitration terms.',
    ],
    summaryOutput: {
      title: 'Facility Decision Summary',
      includes: [
        'Facilities considered',
        'Care needs summary',
        'Estimated monthly cost by facility',
        'Top red flags',
        'Questions still unanswered',
        'Recommended facility',
        'Reason for recommendation',
        'Contract items to review',
        'Move-in follow-up date',
        '30-day review rule',
      ],
      recommendedNextSteps: [
        'Start the Care Needs Checklist.',
        'Use the Senior Care Cost Calculator.',
        'Open the correct facility scorecard.',
        'Open the Facility Contract Checklist.',
        'Generate a Facility Decision Summary.',
      ],
      questionsToAsk: [
        'What is included in the base rate?',
        'What costs extra and what makes the bill increase?',
        'What care needs can you not support?',
        'What happens after a fall or medication issue?',
        'What would trigger discharge?',
        'Can we see a sample invoice?',
      ],
      defaultReviewDays: 30,
      reviewDateLabel: '30 days after move-in',
    },
    relatedGuides: [
      { label: 'Assisted Living Tour Scorecard', href: '/care/guides/assisted-living-tour-scorecard/', reason: 'Compare communities consistently.' },
      { label: 'Memory Care Evaluation Scorecard', href: '/care/guides/memory-care-evaluation-scorecard/', reason: 'Evaluate dementia support.' },
      { label: 'Nursing Home Visit Scorecard', href: '/care/guides/nursing-home-visit-scorecard/', reason: 'Compare nursing home visits.' },
    ],
    reviewerType: ['Senior care advisor', 'Geriatric care manager', 'Elder law attorney for contract-related sections'],
    disclaimerType: 'mixed',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'caregiver-burning-out',
    slug: 'caregiver-burning-out',
    title: 'Caregiver Is Burning Out',
    shortTitle: 'Caregiver burnout',
    category: 'caregiver-support',
    metaTitle: 'Caregiver Is Burning Out - What to Do Next',
    metaDescription:
      'Use this caregiver burnout playbook to reduce overload, track caregiving hours, ask family for help, add respite, and change the care plan before burnout becomes unsafe.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Caregiver Is Burning Out',
      subheading:
        'Use this playbook to identify what is unsustainable, track the workload, ask for specific help, add respite, and update the care plan.',
      primaryCta: 'Start burnout playbook',
      secondaryCta: 'Use Stress Check-In',
    },
    audience: [
      'Primary caregivers who feel the current plan is becoming unsustainable.',
      'Families who need to make workload visible before assigning tasks.',
      'Caregivers deciding whether respite, paid help, or a different setting is needed.',
    ],
    triggerEvents: ['Sleep disruption', 'No backup', 'Caregiver overload', 'Unsafe lifting', 'Family conflict', 'Rising care needs'],
    safetyLevel: 'emergency-aware',
    safetyBanner: {
      title: 'Caregiver safety note',
      body:
        'If the caregiver feels unsafe, is having thoughts of self-harm, is afraid they may harm someone else, or feels unable to continue safely, seek immediate support.',
      emergencyInstruction: 'In an emergency, call emergency services. In the U.S., call or text 988 for mental health crisis support.',
    },
    intakeQuestions: [
      {
        id: 'caregiver_role',
        label: 'Are you the primary caregiver?',
        type: 'single_select',
        options: ['Yes', 'No', 'Shared role', 'Not sure'],
      },
      {
        id: 'burnout_level',
        label: 'How does the current situation feel?',
        type: 'single_select',
        options: ['Manageable but stressful', 'Hard to sustain', 'Close to breaking', 'Unsafe'],
        safetyCritical: true,
      },
      {
        id: 'sleep_disrupted',
        label: 'Is caregiving disrupting sleep?',
        type: 'boolean',
      },
      {
        id: 'backup_exists',
        label: 'Is there reliable backup care?',
        type: 'boolean',
      },
      {
        id: 'main_burden',
        label: 'What feels heaviest?',
        type: 'multi_select',
        options: ['Time', 'Sleep', 'Money', 'Family conflict', 'Physical care', 'Memory/behavior', 'Appointments', 'Emergencies', 'Guilt', 'No backup'],
      },
      {
        id: 'weekly_hours_known',
        label: 'Do you know how many hours per week caregiving takes?',
        type: 'single_select',
        options: ['Yes', 'No', 'Roughly'],
      },
      {
        id: 'paid_help_used',
        label: 'Is paid help currently being used?',
        type: 'boolean',
      },
    ],
    actionSections: {
      now: [
        {
          id: 'name-unsustainable',
          title: 'Name what is unsafe or unsustainable',
          body:
            'Write the top three things that cannot continue as they are, such as no overnight backup, unsafe lifting, no respite, family not helping, or caregiver sleep loss.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
        {
          id: 'use-stress-check-in',
          title: 'Use Stress Check-In',
          body: 'Check whether stress is manageable, rising, severe, or unsafe.',
          cta: { label: 'Use Stress Check-In', href: '/logic/decision-fatigue/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'clinician',
        },
        {
          id: 'choose-relief-action',
          title: 'Choose one immediate relief action',
          body:
            'Ask one person to cover a specific block of time, cancel or delegate one non-urgent task, schedule respite, call a home care agency, use Mind Reset before a family conversation, or sleep before making a major decision if safe.',
          completionType: 'checkbox',
          safetyTag: 'family',
        },
      ],
      next24Hours: [
        {
          id: 'track-workload',
          title: 'Track the workload',
          body:
            'Estimate caregiving hours, including supervision, transportation, appointments, emotional support, paperwork, and nighttime care.',
          cta: { label: 'Use Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
        },
        {
          id: 'stop-share-support',
          title: 'Create the Stop / Share / Support list',
          body:
            'Stop tasks the caregiver cannot safely continue. Share tasks family can own. Support tasks that require paid help, respite, or professional support.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
        {
          id: 'ask-specific-owner',
          title: 'Ask for one specific task owner',
          body: 'Do not ask family to "help more." Ask one person to own one recurring task.',
          completionType: 'note',
          safetyTag: 'family',
        },
      ],
      thisWeek: [
        {
          id: 'add-respite-budget',
          title: 'Add respite to the care budget',
          body:
            'Respite is not optional if the care plan depends on one caregiver. Add respite, backup care, or paid support to the family care budget.',
          cta: { label: 'Use Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
        },
        {
          id: 'set-caregiver-boundary',
          title: 'Set a caregiver boundary',
          body:
            'Write one boundary that protects safety, such as no unsafe lifting, no sole overnight coverage, no missed work for every appointment, or no managing aggressive behavior alone.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
        {
          id: 'review-care-setting-fit',
          title: 'Review whether the care setting still fits',
          body:
            'If burnout is caused by rising care needs, compare home care, adult day care, assisted living, memory care, or nursing home support.',
          cta: { label: 'Start Plan Senior Care Track', href: '/tracks/plan-senior-care/', type: 'track' },
          completionType: 'optional',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'top_stressors', label: 'Top three stressors', fieldType: 'textarea', requiredForSummary: true },
      { id: 'unsafe_tasks', label: 'Tasks that cannot safely continue', fieldType: 'textarea' },
      { id: 'caregiving_hours', label: 'Estimated caregiving hours per week', fieldType: 'number' },
      { id: 'backup_gap', label: 'Backup care gap', fieldType: 'textarea' },
      { id: 'tasks_to_share', label: 'Tasks family can own', fieldType: 'textarea' },
      { id: 'support_needed', label: 'Paid or outside support needed', fieldType: 'textarea' },
      { id: 'boundary', label: 'Caregiver boundary', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'family-member',
        title: 'Family member',
        whenToCall: 'Call when a task can be assigned to a specific person.',
        whatToSay:
          'I need task ownership, not general encouragement. Can you own pharmacy refills every month, including ordering, pickup, and updating the medication list?',
      },
      {
        id: 'home-care-agency',
        title: 'Home care agency',
        whenToCall: 'Call when the caregiver needs relief with bathing, toileting, transfers, meals, supervision, or respite.',
        whatToPrepare: 'Tasks needed, schedule, mobility needs, dementia needs, start date, and budget range.',
      },
      {
        id: 'doctor-clinician',
        title: 'Doctor or clinician',
        whenToCall: 'Call when care needs are changing, behavior is worsening, sleep is severely disrupted, or caregiver health is declining.',
        whatToPrepare: 'Recent behavior changes, sleep disruption, unsafe tasks, and caregiver health concerns.',
      },
      {
        id: 'crisis-support',
        title: 'Crisis support',
        whenToCall: 'Call when the caregiver feels unsafe, hopeless, at risk of self-harm, or unable to continue safely.',
        whatToPrepare: 'Current location, immediate safety concern, whether anyone is in danger, and a support person if available.',
      },
    ],
    recommendedTools: [
      { name: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', reason: 'Make the full workload visible.', type: 'calculator', primary: true },
      { name: 'Stress Check-In', href: '/logic/decision-fatigue/', reason: 'Sort stress into manageable, rising, severe, or unsafe.', type: 'tool' },
      { name: 'Mind Reset', href: '/tracks/mind-reset/', reason: 'Use before a difficult family conversation.', type: 'track' },
      { name: 'Sleep Reset', href: '/tracks/sleep-reset/', reason: 'Create a sleep recovery plan when nights are disrupted.', type: 'track' },
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Add respite and paid support to the budget.', type: 'calculator' },
      { name: 'Respite Care Guide', href: '/care/guides/respite-care-guide/', reason: 'Understand respite options and planning questions.', type: 'guide' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'I am not asking everyone to do the same thing. I am asking us to make the workload visible and divide it honestly before the current plan becomes unsafe.',
      },
      {
        title: 'Boundary script',
        body:
          'I love you, and I am still here. But I cannot be the entire care plan anymore. We need backup, respite, paid help, or a different care setting.',
      },
      {
        title: 'Task ownership script',
        body:
          'Can you own pharmacy refills every month, including ordering, pickup, and updating the medication list, instead of being available only when there is a crisis?',
      },
    ],
    redFlags: [
      'Caregiver has no regular sleep',
      'Caregiver is the only backup',
      'Caregiver is missing work',
      'Caregiver is skipping their own medical care',
      'Caregiver feels resentful or numb',
      'Unsafe lifting or transfers continue',
      'No respite exists',
      'Family praises caregiver but does not relieve them',
      'Caregiver feels unsafe or hopeless',
    ],
    escalationRules: [
      'If the caregiver feels unsafe or at risk of self-harm or harming someone else, seek immediate support.',
      'If no backup exists, create a backup caregiver plan before the next crisis.',
      'If sleep is disrupted, use Sleep Reset and add overnight relief to the plan.',
      'If weekly hours are unknown, use the Caregiver Hours Calculator before the family meeting.',
    ],
    summaryOutput: {
      title: 'Caregiver Relief Plan',
      includes: [
        'Caregiver stressors',
        'Estimated weekly caregiving hours',
        'Unsafe or unsustainable tasks',
        'Backup gaps',
        'Tasks to share',
        'Paid support needed',
        'Caregiver boundary',
        'Recommended next tools',
        'Family conversation script',
        'Review date',
      ],
      recommendedNextSteps: [
        'Use Stress Check-In.',
        'Use the Caregiver Hours Calculator.',
        'Create a Stop / Share / Support list.',
        'Use the Family Care Budget Calculator.',
        'Generate a Caregiver Relief Plan.',
      ],
      questionsToAsk: [
        'Which tasks cannot safely continue?',
        'Which tasks can family members own recurring, end-to-end?',
        'What paid support or respite is needed this week?',
        'What boundary protects caregiver and care recipient safety?',
      ],
      defaultReviewDays: 7,
      reviewDateLabel: '7 days after relief plan',
    },
    relatedGuides: [
      { label: 'Caregiver Stress and Burnout Self-Check', href: '/care/guides/caregiver-stress-burnout-self-check/', reason: 'Identify overload patterns.' },
      { label: 'Caregiver Hours Tracking Sheet', href: '/care/guides/caregiver-hours-tracking-sheet/', reason: 'Track full workload for two weeks.' },
      { label: 'Family Meeting Agenda Template', href: '/care/guides/family-care-meeting-agenda-template/', reason: 'Turn workload into task ownership.' },
    ],
    reviewerType: ['Therapist', 'Clinician', 'Caregiver support specialist', 'Geriatric care manager'],
    disclaimerType: 'health',
    analyticsEvents: [...sharedAnalyticsEvents, 'emergency_language_viewed', 'documentation_log_started'],
  },
  {
    id: 'dementia-safety-getting-worse',
    slug: 'dementia-safety-getting-worse',
    title: 'Dementia Safety Is Getting Worse',
    shortTitle: 'Dementia safety',
    category: 'dementia',
    metaTitle: 'Dementia Safety Is Getting Worse - What Families Should Do Next',
    metaDescription:
      'Use this dementia safety playbook to identify wandering, nighttime confusion, medication risk, refusal of care, caregiver strain, and whether memory care or more support may be needed.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Dementia Safety Is Getting Worse',
      subheading:
        'Use this playbook to identify what has changed, reduce immediate safety risks, document patterns, and decide whether home care, memory care, or more support may be needed.',
      primaryCta: 'Start dementia safety playbook',
      secondaryCta: 'Open Care Needs Checklist',
    },
    audience: [
      'Families seeing new or worsening dementia-related safety risks.',
      'Caregivers trying to name whether wandering, nighttime risk, medication, or supervision has changed.',
      'Decision-makers comparing home support, adult day care, respite, assisted living, memory care, or nursing home-level support.',
    ],
    triggerEvents: ['Wandering', 'Getting lost', 'Nighttime confusion', 'Medication mistakes', 'Unsafe cooking', 'Caregiver cannot safely manage'],
    riskTags: ['wandering', 'unsafe_alone', 'nighttime_risk', 'medication_risk', 'caregiver_overload', 'facility_comparison'],
    safetyLevel: 'emergency-aware',
    safetyBanner: {
      title: 'Dementia safety note',
      body:
        'If the person is missing, may have wandered, is in immediate danger, is newly severely confused, is threatening harm, has been harmed, or cannot be kept safe right now, call emergency services or urgent professional help immediately.',
      emergencyInstruction: 'This playbook does not diagnose dementia, determine capacity, or replace medical or emergency care.',
    },
    intakeQuestions: [
      {
        id: 'main_change',
        label: 'What changed recently?',
        type: 'multi_select',
        options: [
          'Wandering or trying to leave',
          'Getting lost',
          'Nighttime confusion',
          'Medication mistakes',
          'Unsafe cooking or appliances',
          'Falls or near-falls',
          'Refusing care',
          'Aggression or fear',
          'Poor hygiene',
          'Missed meals',
          'Caregiver cannot safely manage',
          'Not sure',
        ],
      },
      { id: 'missing_or_wandered', label: 'Is the person missing or did they wander away?', type: 'boolean', safetyCritical: true },
      {
        id: 'unsafe_alone',
        label: 'Can the person be safely left alone right now?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
        safetyCritical: true,
      },
      { id: 'nighttime_risk', label: 'Is nighttime becoming unsafe?', type: 'boolean' },
      {
        id: 'caregiver_capacity',
        label: 'Can the current caregiver safely continue the current plan?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'current_setting',
        label: 'Where is the person living now?',
        type: 'single_select',
        options: ['Home alone', 'Home with spouse', 'Home with family', 'Home with paid care', 'Assisted living', 'Memory care', 'Nursing home', 'Other'],
      },
      {
        id: 'recent_events',
        label: 'What happened in the past 30 days?',
        type: 'multi_select',
        options: ['Fall', 'Wandering', 'Hospitalization', 'Medication error', 'Police/neighbors involved', 'Caregiver burnout', 'Missed meals', 'Unsafe driving', 'None', 'Not sure'],
      },
    ],
    actionSections: {
      now: [
        {
          id: 'name-specific-dementia-risk',
          title: 'Identify the specific safety risk',
          body:
            'Do not describe the problem only as "dementia is worse." Name the specific risk: wandering, medication mistakes, unsafe cooking, nighttime confusion, falls, refusal of care, aggression, or unsafe time alone.',
          completionType: 'note',
          safetyTag: 'care-plan',
          riskTags: ['wandering', 'unsafe_alone', 'medication_risk', 'nighttime_risk', 'refusal_of_care'],
        },
        {
          id: 'check-alone-safety',
          title: 'Check whether the person can be alone',
          body:
            'Ask whether the person can safely be alone for one hour, half a day, overnight, or not at all. Supervision needs are often underestimated.',
          cta: { label: 'Start Care Needs Checklist', href: '/care/care-needs-checklist/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
          riskTags: ['unsafe_alone'],
        },
        {
          id: 'reduce-immediate-dementia-risk',
          title: 'Reduce immediate risk',
          body:
            'For wandering risk, secure exits appropriately, prepare a recent photo, notify trusted local helpers, and create a response plan. For medication risk, remove old medications, update the medication list, and assign one medication owner. For nighttime risk, add lighting, remove trip hazards, plan bathroom support, and decide who is responsible overnight. For unsafe cooking, restrict unsafe appliance use, simplify meals, and consider meal delivery or supervised cooking.',
          completionType: 'checkbox',
          safetyTag: 'emergency',
          riskTags: ['wandering', 'medication_risk', 'nighttime_risk', 'home_safety'],
        },
      ],
      next24Hours: [
        {
          id: 'start-dementia-pattern-log',
          title: 'Start a dementia pattern log',
          body:
            'Track what happened, when it happened, what may have triggered it, what helped, and whether the caregiver could manage it safely. Include time of day, location, trigger, words used, safety risk, caregiver response, what helped, and what made it worse.',
          completionType: 'note',
          safetyTag: 'document',
          riskTags: ['professional_review'],
        },
        {
          id: 'review-home-dementia-lens',
          title: 'Review the home for dementia-specific safety',
          body:
            'Dementia can affect judgment, place orientation, behavior, balance, and sensory processing, so home safety should be reviewed through a dementia lens, not only a fall-prevention lens.',
          whyItMatters:
            'Source note: Alzheimer\'s Association notes that dementia may affect judgment, sense of time/place, behavior, physical ability, and senses.',
          cta: { label: 'Open Home Safety Checklist', href: '/care/guides/home-safety-checklist-older-adults/', type: 'guide' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
          riskTags: ['home_safety'],
        },
        {
          id: 'decide-current-care-enough',
          title: 'Decide whether current care is still enough',
          body:
            'If the person cannot be safely alone, has wandered, is unsafe at night, or needs repeated redirection, the current care plan may need more supervision, home care, adult day care, respite, assisted living, memory care, or nursing home-level support.',
          cta: { label: 'Start Plan Senior Care Track', href: '/tracks/plan-senior-care/', type: 'track' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
          riskTags: ['facility_comparison', 'adult_day_care', 'respite'],
        },
      ],
      thisWeek: [
        {
          id: 'compare-home-vs-memory-care',
          title: 'Compare home safety support vs. memory care',
          body:
            'Estimate what it would take to keep the person safely at home: paid care hours, family supervision, nighttime coverage, home safety changes, adult day care, respite, and backup care.',
          cta: { label: 'Use Memory Care Cost Calculator', href: '/care/memory-care-cost-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
          riskTags: ['facility_comparison', 'cost_pressure'],
        },
        {
          id: 'create-wandering-response-plan',
          title: 'Create a wandering response plan',
          body:
            'If wandering or exit-seeking has happened once, create a written response plan. Include who to call, recent photo, likely destinations, neighbors to notify, emergency contacts, and what to do first. Alzheimer\'s Association says wandering can happen at any stage of dementia and can be dangerous or life-threatening.',
          completionType: 'note',
          safetyTag: 'emergency',
          riskTags: ['wandering'],
        },
        {
          id: 'dementia-escalation-rule',
          title: 'Create a care escalation rule',
          body:
            'Write the condition that will trigger a stronger care plan, such as wandering happening again, unsafe nighttime confusion more than three nights per week, or the caregiver being unable to sleep because of safety concerns.',
          completionType: 'note',
          safetyTag: 'care-plan',
          riskTags: ['caregiver_overload', 'facility_comparison'],
        },
      ],
    },
    documentation: [
      { id: 'specific_risks', label: 'Specific dementia-related safety risks', fieldType: 'textarea', requiredForSummary: true },
      { id: 'unsafe_times', label: 'Most unsafe times of day', fieldType: 'textarea' },
      { id: 'wandering_details', label: 'Wandering or exit-seeking details', fieldType: 'textarea' },
      { id: 'nighttime_notes', label: 'Nighttime safety concerns', fieldType: 'textarea' },
      { id: 'caregiver_capacity_notes', label: 'Can the caregiver safely continue?', fieldType: 'textarea', requiredForSummary: true },
      { id: 'support_needed', label: 'Support needed', fieldType: 'textarea' },
      { id: 'escalation_rule', label: 'Family escalation rule', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'emergency-services',
        title: 'Emergency services',
        whenToCall: 'Call when the person is missing, has wandered away, is in immediate danger, is severely confused suddenly, or someone may be harmed.',
      },
      {
        id: 'doctor-clinician',
        title: 'Doctor or clinician',
        whenToCall: 'Call when confusion worsens suddenly, behavior changes quickly, falls increase, medication mistakes occur, or symptoms may reflect a medical change.',
        whatToSay:
          'Normally, they can ____. Recently, we noticed ____. The biggest safety concerns are ____. We need help deciding what level of supervision or care is appropriate.',
      },
      {
        id: 'dementia-care-specialist',
        title: 'Dementia care specialist or geriatric care manager',
        whenToCall: 'Call when the family needs help deciding whether home care, adult day care, memory care, or another setting is appropriate.',
      },
      {
        id: 'home-care-agency',
        title: 'Home care agency',
        whenToCall: 'Call when safety depends on supervision, bathing help, medication reminders, meals, or nighttime coverage.',
      },
    ],
    recommendedTools: [
      { name: 'Care Needs Checklist', href: '/care/care-needs-checklist/', reason: 'Identify supervision, medication, mobility, and daily-care gaps.', type: 'calculator', primary: true },
      { name: 'Home Safety Checklist', href: '/care/guides/home-safety-checklist-older-adults/', reason: 'Review the home through a dementia safety lens.', type: 'guide' },
      { name: 'Dementia Wandering Guide', href: '/care/guides/dementia-wandering-safety/', reason: 'Create a response plan for wandering or exit-seeking.', type: 'guide' },
      { name: 'Memory Care Cost Calculator', href: '/care/memory-care-cost-calculator/', reason: 'Compare higher-supervision care settings.', type: 'calculator' },
      { name: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', reason: 'Count supervision and nighttime worry as workload.', type: 'calculator' },
      { name: 'Plan Senior Care Track', href: '/tracks/plan-senior-care/', reason: 'Move from care needs to cost and care-setting decisions.', type: 'track' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'This is not about blaming the dementia or blaming the caregiver. We need to name the risks clearly and decide what support would make this safer.',
      },
      {
        title: 'Provider script',
        body:
          'Normally, they can ____. Recently, we noticed ____. The biggest safety concerns are ____. We need help deciding what level of supervision or care is appropriate.',
      },
    ],
    redFlags: [
      'Wandering or exit-seeking',
      'Getting lost',
      'Unsafe cooking',
      'Medication mistakes',
      'Nighttime confusion',
      'Falls or near-falls',
      'New aggression or fear',
      'Caregiver cannot sleep',
      'Person cannot safely be alone',
      'Family relies on luck or constant vigilance',
    ],
    escalationRules: [
      'If wandering happens again, compare memory care immediately.',
      'If nighttime confusion requires supervision more than three nights per week, add overnight support.',
      'If the caregiver cannot sleep because of safety concerns, reassess the care setting.',
    ],
    summaryOutput: {
      title: 'Dementia Safety Plan',
      includes: [
        'Main dementia safety risks',
        'Current living setting',
        'Unsafe times of day',
        'Wandering or nighttime risk notes',
        'Caregiver capacity',
        'Support needed',
        'Recommended tools',
        'Escalation rule',
        'Review date',
      ],
      recommendedNextSteps: [
        'Start the Care Needs Checklist.',
        'Open the Home Safety Checklist.',
        'Open the Dementia Wandering Guide if wandering or exit-seeking is involved.',
        'Use the Memory Care Cost Calculator if supervision needs are increasing.',
        'Generate a Dementia Safety Plan.',
      ],
      questionsToAsk: [
        'What changed from baseline in the past 30 days?',
        'Can the person safely be alone, and for how long?',
        'What level of supervision is appropriate now?',
        'What would trigger memory care or overnight support comparison?',
      ],
      defaultReviewDays: 7,
      reviewDateLabel: '7 days, or sooner if wandering, sudden confusion, fall, or caregiver safety concern occurs',
    },
    relatedGuides: [
      { label: 'Dementia Daily Routine Guide', href: '/care/guides/dementia-daily-routine/', reason: 'Build predictable routines around safety.' },
      { label: 'Dementia Wandering Guide', href: '/care/guides/dementia-wandering-safety/', reason: 'Plan for wandering response.' },
      { label: 'Memory Care Evaluation Scorecard', href: '/care/guides/memory-care-evaluation-scorecard/', reason: 'Evaluate memory care options.' },
    ],
    reviewerType: ['Dementia care specialist', 'Clinician', 'Geriatric care manager'],
    disclaimerType: 'health',
    analyticsEvents: [...sharedAnalyticsEvents, 'emergency_language_viewed', 'documentation_log_started'],
  },
  {
    id: 'parent-refuses-help',
    slug: 'parent-refuses-help',
    title: 'Parent Refuses Help',
    shortTitle: 'Parent refuses help',
    category: 'care-refusal',
    metaTitle: 'Parent Refuses Help - What Families Can Do Next',
    metaDescription:
      'Use this playbook when an aging parent refuses home care, bathing help, medication support, assisted living, driving limits, or other care support.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Parent Refuses Help',
      subheading:
        'Use this playbook to understand what the refusal may be protecting, choose a smaller first step, set safety limits, and prepare a calmer family conversation.',
      primaryCta: 'Start refusal playbook',
      secondaryCta: 'Open conversation script',
    },
    audience: [
      'Families whose parent, spouse, or loved one is refusing support.',
      'Caregivers trying to distinguish preference, concern, safety risk, and urgent risk.',
      'Families preparing a dignity-first conversation about help.',
    ],
    triggerEvents: ['Home care refusal', 'Medication help refusal', 'Bathing refusal', 'Driving limits refusal', 'Doctor visit refusal', 'Facility tour refusal'],
    riskTags: ['refusal_of_care', 'legal_authority', 'professional_review', 'caregiver_overload'],
    safetyLevel: 'emergency-aware',
    safetyBanner: {
      title: 'Care refusal safety note',
      body:
        'If refusal of help is creating immediate danger, severe neglect, unsafe driving, wandering, medical emergency risk, threats, abuse, or inability to meet basic needs, seek urgent professional help or emergency support.',
      emergencyInstruction: 'This playbook does not determine legal capacity or replace medical, legal, or emergency guidance.',
    },
    intakeQuestions: [
      {
        id: 'refused_help_type',
        label: 'What kind of help is being refused?',
        type: 'multi_select',
        options: ['Home care', 'Bathing or hygiene', 'Medication help', 'Meals', 'Transportation', 'Driving limits', 'Doctor visit', 'Assisted living', 'Memory care', 'Using walker/cane', 'Legal or financial help', 'Other'],
      },
      { id: 'immediate_safety_risk', label: 'Is the refusal creating immediate danger?', type: 'boolean', safetyCritical: true },
      { id: 'memory_or_judgment_concern', label: 'Are memory, confusion, or judgment concerns involved?', type: 'boolean' },
      {
        id: 'caregiver_at_risk',
        label: 'Is the caregiver being harmed, threatened, or pushed beyond safe limits?',
        type: 'boolean',
        safetyCritical: true,
      },
      {
        id: 'parent_goal',
        label: 'What does the parent seem to want most?',
        type: 'multi_select',
        options: ['Stay home', 'Keep privacy', 'Keep driving', 'Avoid cost', 'Avoid strangers', 'Avoid feeling old', 'Avoid burdening family', 'Keep control', 'Not sure'],
      },
      {
        id: 'family_tried',
        label: 'What has the family already tried?',
        type: 'multi_select',
        options: ['Direct conversation', 'Doctor visit', 'Home care trial', 'Family meeting', 'Touring a facility', 'Nothing yet', 'Not sure'],
      },
    ],
    actionSections: {
      now: [
        {
          id: 'name-refusal-specific',
          title: 'Name what is being refused',
          body:
            'Be specific. "Refuses help" is too broad. Name the actual refusal: bathing help, home care, medication support, driving limits, walker use, doctor visit, or facility tour.',
          completionType: 'note',
          safetyTag: 'document',
          riskTags: ['refusal_of_care'],
        },
        {
          id: 'identify-protected-need',
          title: 'Identify what the refusal may be protecting',
          body:
            'Refusal often protects dignity, privacy, control, identity, fear, money, routine, or independence. Understanding the fear helps you choose a smaller next step.',
          completionType: 'note',
          safetyTag: 'family',
          riskTags: ['refusal_of_care'],
        },
        {
          id: 'preference-vs-danger',
          title: 'Separate preference from danger',
          body: 'Some preferences can be respected. Some risks cannot be ignored. Mark the refusal as preference, concern, safety risk, or urgent risk.',
          completionType: 'note',
          safetyTag: 'care-plan',
          riskTags: ['professional_review'],
        },
      ],
      next24Hours: [
        {
          id: 'smallest-acceptable-help',
          title: 'Choose the smallest acceptable help',
          body:
            'Do not start with the biggest change. Choose the smallest support that reduces risk, such as laundry-only home care, grocery delivery, medication packaging, one facility tour, or one bathroom safety change.',
          completionType: 'note',
          safetyTag: 'family',
          riskTags: ['refusal_of_care'],
        },
        {
          id: 'prepare-dignity-script',
          title: 'Prepare a dignity-first script',
          body: 'Use language that protects independence instead of attacking it.',
          cta: { label: 'Open Talk to Parent About Needing Help', href: '/care/guides/talk-to-parent-about-needing-help/', type: 'guide' },
          completionType: 'optional',
          safetyTag: 'family',
        },
        {
          id: 'bring-neutral-person',
          title: 'Bring in a neutral person if needed',
          body:
            'If family conversations become defensive, consider a clinician, geriatric care manager, therapist, elder law attorney, or trusted family friend depending on the issue.',
          completionType: 'optional',
          safetyTag: 'clinician',
          riskTags: ['professional_review', 'legal_authority'],
        },
      ],
      thisWeek: [
        {
          id: 'use-trial-instead-verdict',
          title: 'Use a trial instead of a verdict',
          body:
            'Frame support as a short trial, not a permanent loss of control. Example: "Let\'s try two hours of help on Fridays for four weeks. Then we can talk about whether it helped."',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'create-refusal-threshold',
          title: 'Create a safety threshold',
          body:
            'Write down what would make the family revisit the decision even if the parent still resists, such as missed medication, another fall, or a driving safety incident.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
        {
          id: 'estimate-refusal-support-cost',
          title: 'Estimate what support would cost',
          body: 'If money is part of the refusal, compare the actual cost of small supports, home care, adult day care, or assisted living.',
          cta: { label: 'Use Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
          riskTags: ['cost_pressure'],
        },
      ],
    },
    documentation: [
      { id: 'refusal_type', label: 'What help is being refused?', fieldType: 'textarea', requiredForSummary: true },
      { id: 'likely_fear', label: 'What may the refusal be protecting?', fieldType: 'textarea' },
      { id: 'safety_level', label: 'Safety level', fieldType: 'select', options: ['Preference', 'Concern', 'Safety risk', 'Urgent risk'], requiredForSummary: true },
      { id: 'smallest_help', label: 'Smallest acceptable help to try', fieldType: 'textarea' },
      { id: 'trial_plan', label: 'Trial plan', fieldType: 'textarea' },
      { id: 'safety_threshold', label: 'Safety threshold', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'doctor-clinician',
        title: 'Doctor or clinician',
        whenToCall: 'Call when medication, memory, driving, falls, hygiene, nutrition, sudden confusion, or medical care refusal is involved.',
      },
      { id: 'geriatric-care-manager', title: 'Geriatric care manager', whenToCall: 'Call when the family needs a neutral assessment or help translating care needs into support options.' },
      {
        id: 'elder-law-attorney',
        title: 'Elder law attorney',
        whenToCall: 'Call when capacity, decision authority, guardianship, financial access, or legal documents are unclear.',
      },
      {
        id: 'emergency-aps',
        title: 'Emergency services or APS',
        whenToCall: 'Call when there is immediate danger, suspected abuse, severe neglect, exploitation, or self-neglect.',
      },
    ],
    recommendedTools: [
      { name: 'Care Needs Checklist', href: '/care/care-needs-checklist/', reason: 'Ground the conversation in actual support needs.', type: 'calculator', primary: true },
      { name: 'Mind Reset', href: '/tracks/mind-reset/', reason: 'Reset before a hard conversation.', type: 'track' },
      { name: 'Talk to Parent About Needing Help', href: '/care/guides/talk-to-parent-about-needing-help/', reason: 'Use dignity-first conversation scripts.', type: 'guide' },
      { name: 'Refusal of Care Guide', href: '/care/guides/refusal-of-care-resistance/', reason: 'Understand refusal as protection, fear, or safety risk.', type: 'guide' },
      { name: 'Home Care Cost Calculator', href: '/care/home-care-cost-calculator/', reason: 'Price the smallest support option.', type: 'calculator' },
      { name: 'Plan Senior Care Track', href: '/tracks/plan-senior-care/', reason: 'Move from refusal to a structured care plan.', type: 'track' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are not trying to take over. We are trying to protect the parts of your independence that matter most by adding the smallest support that makes things safer.',
      },
      {
        title: 'Parent script',
        body: 'Would you be willing to try this for four weeks, just as a test? You do not have to decide forever today.',
      },
    ],
    redFlags: [
      'Refusal creates immediate danger',
      'Medication errors repeat',
      'Unsafe driving continues',
      'Falls are hidden',
      'Severe hygiene or nutrition problems appear',
      'Dementia affects judgment',
      'Caregiver is being harmed',
      'Family waits for a crisis because conversations are hard',
      'Legal authority is unclear',
    ],
    escalationRules: [
      'If medication is missed twice in one week, add medication support.',
      'If there is another fall, reassess living alone.',
      'If driving creates a safety incident, involve the doctor and transportation alternatives.',
    ],
    summaryOutput: {
      title: 'Refusal Conversation Plan',
      includes: ['Type of help being refused', 'Likely reason for refusal', 'Safety level', 'Smallest support to try', 'Trial plan', 'Safety threshold', 'Who to involve', 'Family script', 'Review date'],
      recommendedNextSteps: [
        'Start the Care Needs Checklist.',
        'Open the conversation script.',
        'Use Mind Reset before discussion.',
        'Estimate the cost of the smallest support.',
        'Generate a Refusal Conversation Plan.',
      ],
      questionsToAsk: [
        'What is the refusal protecting?',
        'Is this a preference, concern, safety risk, or urgent risk?',
        'What smallest support reduces risk without forcing the whole decision today?',
        'What threshold would require a stronger plan?',
      ],
      defaultReviewDays: 14,
      reviewDateLabel: '14 days, or sooner if safety risk increases',
    },
    relatedGuides: [
      { label: 'Refusal of Care and Resistance Guide', href: '/care/guides/refusal-of-care-resistance/', reason: 'Respond to refusal without escalating conflict.' },
      { label: 'Talk to Parent About Needing Help', href: '/care/guides/talk-to-parent-about-needing-help/', reason: 'Prepare a calmer conversation.' },
      { label: 'Care Needs Green / Yellow / Red Worksheet', href: '/care/guides/care-needs-green-yellow-red-worksheet/', reason: 'Show what is stable, fragile, or unsafe.' },
    ],
    reviewerType: ['Geriatric care manager', 'Therapist', 'Clinician', 'Elder law attorney for authority notes'],
    disclaimerType: 'mixed',
    analyticsEvents: [...sharedAnalyticsEvents, 'emergency_language_viewed', 'documentation_log_started'],
  },
  {
    id: 'home-care-too-expensive',
    slug: 'home-care-too-expensive',
    title: 'Home Care Is Getting Too Expensive',
    shortTitle: 'Home care cost pressure',
    category: 'cost-pressure',
    metaTitle: 'Home Care Is Getting Too Expensive - What Families Can Do Next',
    metaDescription:
      'Use this playbook to compare home care hours, family workload, adult day care, respite, assisted living, and care-cost reduction options.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Home Care Is Getting Too Expensive',
      subheading:
        'Use this playbook to understand what is driving the cost, compare alternatives, reduce avoidable costs, and decide whether home care is still the best fit.',
      primaryCta: 'Start home care cost playbook',
      secondaryCta: 'Use Home Care Cost Calculator',
    },
    audience: [
      'Families whose paid home care bill is rising.',
      'Caregivers comparing home care hours, family workload, adult day care, respite, assisted living, or memory care.',
      'Decision-makers who need to define the home care tipping point.',
    ],
    triggerEvents: ['Rising home care hours', 'Overnight care', 'Weekend rates', 'Dementia supervision', 'Family unavailable', 'Monthly cost pressure'],
    riskTags: ['cost_pressure', 'caregiver_overload', 'facility_comparison', 'adult_day_care', 'respite'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Cost and safety note',
      body:
        'Cost reduction should not leave unsafe gaps in medication, meals, toileting, mobility, dementia supervision, or emergency response.',
      emergencyInstruction: 'This playbook provides planning support and does not replace financial, benefits, legal, medical, or care advice.',
    },
    intakeQuestions: [
      {
        id: 'current_home_care_hours',
        label: 'How many paid home care hours are used per week?',
        type: 'single_select',
        options: ['0-10', '11-20', '21-40', '41-80', '80+', 'Not sure'],
      },
      { id: 'current_monthly_cost', label: 'Approximate monthly home care cost', type: 'number' },
      { id: 'care_hours_increasing', label: 'Are care hours increasing?', type: 'boolean' },
      {
        id: 'main_cost_driver',
        label: 'What is driving the cost?',
        type: 'multi_select',
        options: ['More hours', 'Overnight care', 'Weekend/holiday rates', 'Dementia supervision', 'Bathing/toileting help', 'Transportation', 'Caregiver callouts', 'Agency minimum shifts', 'Family unavailable', 'Not sure'],
      },
      {
        id: 'family_hours_remaining',
        label: 'Is family still providing unpaid care?',
        type: 'single_select',
        options: ['Yes, a lot', 'Yes, some', 'No', 'Not sure'],
      },
      {
        id: 'alternatives_considered',
        label: 'What alternatives have you considered?',
        type: 'multi_select',
        options: ['Adult day care', 'Respite', 'Assisted living', 'Memory care', 'Private caregiver', 'Family task sharing', 'Medicaid/HCBS', 'Long-term care insurance', 'None yet'],
      },
    ],
    actionSections: {
      now: [
        {
          id: 'identify-home-care-cost-driver',
          title: 'Identify the cost driver',
          body:
            'Separate the hourly rate from the weekly schedule. The total bill usually rises because more hours, overnight care, weekend rates, or supervision needs increased.',
          cta: { label: 'Use Home Care Cost Calculator', href: '/care/home-care-cost-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['cost_pressure'],
        },
        {
          id: 'price-uncovered-hours',
          title: 'Price the uncovered hours',
          body: 'If paid home care covers 30 hours per week, there are still 138 hours uncovered. Decide who is responsible for those hours and whether they are safe.',
          completionType: 'note',
          safetyTag: 'care-plan',
          riskTags: ['unsafe_alone', 'caregiver_overload'],
        },
        {
          id: 'estimate-unpaid-family-care',
          title: 'Estimate unpaid family care',
          body:
            'Home care may look affordable only because family is still covering transportation, medication, appointments, meals, nights, or emergencies.',
          cta: { label: 'Use Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
          riskTags: ['caregiver_overload'],
        },
      ],
      next24Hours: [
        {
          id: 'build-three-cost-scenarios',
          title: 'Build three cost scenarios',
          body:
            'Compare the current schedule, a reduced schedule with targeted support, and a higher-support alternative such as home care plus adult day care or assisted living or memory care.',
          completionType: 'note',
          safetyTag: 'cost',
          riskTags: ['facility_comparison', 'adult_day_care'],
        },
        {
          id: 'ask-hours-right-problem',
          title: 'Ask whether hours are solving the right problem',
          body:
            'More home care hours may not fix the issue if the real problem is nighttime wandering, unsafe transfers, medication complexity, or caregiver burnout.',
          completionType: 'note',
          safetyTag: 'care-plan',
          riskTags: ['nighttime_risk', 'wandering', 'medication_risk'],
        },
        {
          id: 'check-payment-sources',
          title: 'Check payment sources',
          body: 'Review whether long-term care insurance, Medicaid HCBS, VA benefits, family contributions, or other supports may be relevant.',
          cta: { label: 'Open Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
        },
      ],
      thisWeek: [
        {
          id: 'compare-assisted-memory-care',
          title: 'Compare assisted living or memory care',
          body:
            'If home care hours are rising quickly, compare the full monthly cost of home care against assisted living or memory care, including family workload.',
          cta: { label: 'Use Assisted Living Cost Calculator', href: '/care/assisted-living-cost-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['facility_comparison'],
        },
        {
          id: 'explore-day-care-respite',
          title: 'Explore adult day care or respite',
          body: 'Adult day care or respite may reduce paid home care hours and protect caregiver capacity without requiring a full move.',
          cta: { label: 'Open Adult Day Care Guide', href: '/care/guides/adult-day-care-guide/', type: 'guide' },
          completionType: 'optional',
          safetyTag: 'care-plan',
          riskTags: ['adult_day_care', 'respite'],
        },
        {
          id: 'home-care-tipping-point',
          title: 'Decide the home care tipping point',
          body:
            'Write the point where the family will compare care settings again, such as home care exceeding 40 hours per week, overnight care more than twice a week, or monthly cost exceeding a set amount.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'current_hours', label: 'Current paid home care hours per week', fieldType: 'number', requiredForSummary: true },
      { id: 'current_cost', label: 'Current monthly home care cost', fieldType: 'number', requiredForSummary: true },
      { id: 'cost_drivers', label: 'Main cost drivers', fieldType: 'textarea' },
      { id: 'family_hours', label: 'Unpaid family care hours', fieldType: 'number' },
      { id: 'alternatives', label: 'Alternatives to compare', fieldType: 'textarea' },
      { id: 'tipping_point', label: 'Home care tipping point', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'home-care-agency',
        title: 'Home care agency',
        whenToCall: 'Call when the family needs a clear explanation of the bill, schedule, and backup coverage.',
        whatToSay:
          'Can you explain the current bill, minimum shifts, weekend rates, overnight rates, caregiver callout policy, and whether the schedule can be redesigned?',
      },
      {
        id: 'adult-day-care',
        title: 'Adult day care program',
        whenToCall: 'Call when daytime supervision, meals, activities, or caregiver relief may reduce home care hours.',
        whatToSay: 'What days, hours, transportation, supervision, dementia support, meals, and costs are available?',
      },
      {
        id: 'facility-community',
        title: 'Assisted living or memory care community',
        whenToCall: 'Call when home care hours are approaching facility-level cost or supervision needs are rising.',
        whatToSay: 'What would the expected monthly cost be for these care needs, including care-level fees and medication support?',
      },
      {
        id: 'elder-law-medicaid',
        title: 'Elder law attorney or Medicaid specialist',
        whenToCall: 'Call when care costs are becoming unsustainable and Medicaid, asset planning, caregiver payment, or legal authority may be relevant.',
      },
    ],
    recommendedTools: [
      { name: 'Home Care Cost Calculator', href: '/care/home-care-cost-calculator/', reason: 'Identify the cost driver and schedule impact.', type: 'calculator', primary: true },
      { name: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', reason: 'Add unpaid family hours to the comparison.', type: 'calculator' },
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Review payment sources and family contributions.', type: 'calculator' },
      { name: 'Assisted Living Cost Calculator', href: '/care/assisted-living-cost-calculator/', reason: 'Compare home care against facility-level monthly cost.', type: 'calculator' },
      { name: 'Memory Care Cost Calculator', href: '/care/memory-care-cost-calculator/', reason: 'Compare dementia supervision alternatives.', type: 'calculator' },
      { name: 'Adult Day Care Guide', href: '/care/guides/adult-day-care-guide/', reason: 'Explore a lower-cost daytime support option.', type: 'guide' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are not saying home care failed. We are saying the cost and workload have changed enough that we need to compare options again.',
      },
      {
        title: 'Provider script',
        body: 'We need to understand what is driving the home care bill and whether there is a safer or more sustainable schedule.',
      },
    ],
    redFlags: [
      'Home care hours keep rising',
      'Family still covers many uncovered hours',
      'Overnight supervision is needed',
      'Dementia safety risk is increasing',
      'Agency has no backup coverage',
      'Monthly cost is unaffordable',
      'Caregiver burnout continues despite paid care',
      'The family compares only dollars, not workload',
    ],
    escalationRules: [
      'If home care exceeds 40 hours per week, compare assisted living.',
      'If overnight care is needed more than twice a week, reassess memory care.',
      'If monthly cost exceeds the family limit, review alternatives.',
    ],
    summaryOutput: {
      title: 'Home Care Cost Review Summary',
      includes: [
        'Current home care schedule',
        'Monthly cost',
        'Main cost drivers',
        'Unpaid family hours',
        'Uncovered safety risks',
        'Alternative scenarios',
        'Payment sources to review',
        'Home care tipping point',
        'Recommended next tools',
      ],
      recommendedNextSteps: [
        'Use the Home Care Cost Calculator.',
        'Use the Caregiver Hours Calculator.',
        'Build the Family Care Budget.',
        'Compare assisted living or memory care if hours are rising.',
        'Generate a Home Care Cost Review Summary.',
      ],
      questionsToAsk: [
        'What is driving the bill: rate, hours, overtime, overnight coverage, minimum shifts, or supervision?',
        'What unpaid family hours remain?',
        'Which alternatives could reduce cost without leaving unsafe gaps?',
        'What is the home care tipping point?',
      ],
      defaultReviewDays: 30,
      reviewDateLabel: '30 days, or sooner if hours or monthly cost increases',
    },
    relatedGuides: [
      { label: 'Home Care Agency Comparison Sheet', href: '/care/guides/home-care-agency-comparison-sheet/', reason: 'Compare rates, minimums, and backup coverage.' },
      { label: 'Adult Day Care Guide', href: '/care/guides/adult-day-care-guide/', reason: 'Explore daytime support.' },
      { label: 'Home Care vs Assisted Living', href: '/care/guides/home-care-vs-assisted-living-vs-memory-care-vs-nursing-home/', reason: 'Compare care settings.' },
    ],
    reviewerType: ['Home care professional', 'Senior care advisor', 'Financial planner'],
    disclaimerType: 'legal-financial',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'aging-in-place-feels-unsafe',
    slug: 'aging-in-place-feels-unsafe',
    title: 'Aging in Place Is Starting to Feel Unsafe',
    shortTitle: 'Aging in place safety',
    category: 'aging-in-place',
    metaTitle: 'Aging in Place Is Starting to Feel Unsafe - What to Do Next',
    metaDescription:
      'Use this playbook to review home safety, emergency backup, meals, medication, mobility, supervision, and whether staying home still fits.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Aging in Place Is Starting to Feel Unsafe',
      subheading:
        'Use this playbook to identify what feels unsafe, strengthen the home plan, add support, and decide whether staying home still fits.',
      primaryCta: 'Start aging-in-place safety playbook',
      secondaryCta: 'Open Home Safety Checklist',
    },
    audience: [
      'Families worried that staying home is becoming fragile.',
      'Caregivers reviewing home safety, emergency access, meals, medication, mobility, supervision, and backup.',
      'Decision-makers comparing staying home with more support or moving to a higher-support care setting.',
    ],
    triggerEvents: ['Repeated falls', 'No-answer events', 'Missed medication', 'Unsafe cooking', 'No local backup', 'Nighttime risk', 'Caregiver worry'],
    riskTags: ['home_safety', 'unsafe_alone', 'medication_risk', 'nighttime_risk', 'caregiver_overload', 'facility_comparison'],
    safetyLevel: 'emergency-aware',
    safetyBanner: {
      title: 'Aging-in-place safety note',
      body:
        'If someone is in immediate danger, cannot safely be alone, has fallen with possible serious injury, is missing, has sudden confusion, or cannot meet basic needs, seek urgent or emergency help.',
      emergencyInstruction: 'This playbook helps organize home safety planning. It does not replace medical, emergency, legal, or professional care advice.',
    },
    intakeQuestions: [
      {
        id: 'living_situation',
        label: 'Current living situation',
        type: 'single_select',
        options: ['Lives alone', 'Lives with spouse', 'Lives with family', 'Lives with paid home care', 'Other'],
      },
      {
        id: 'what_feels_unsafe',
        label: 'What feels unsafe?',
        type: 'multi_select',
        options: ['Falls', 'Bathroom safety', 'Stairs', 'Medication', 'Meals', 'Driving', 'Wandering', 'Nighttime', 'No local backup', 'Home clutter', 'Unsafe cooking', 'Caregiver burnout', 'Not sure'],
      },
      {
        id: 'can_call_for_help',
        label: 'Can the person reliably call for help?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'someone_can_get_in',
        label: 'Can a trusted person get into the home in an emergency?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'recent_events',
        label: 'Recent events',
        type: 'multi_select',
        options: ['Fall', 'Near-fall', 'Missed medication', 'Missed meals', 'Hospitalization', 'Getting lost', 'Unsafe driving', 'Caregiver crisis', 'None', 'Not sure'],
      },
      { id: 'home_care_in_place', label: 'Is paid home care already in place?', type: 'boolean' },
      { id: 'local_backup', label: 'Is there a reliable local backup person?', type: 'boolean' },
    ],
    actionSections: {
      now: [
        {
          id: 'name-unsafe-home-pattern',
          title: 'Name the unsafe pattern',
          body:
            'Do not describe the situation only as "home feels unsafe." Name the pattern: falls, missed medication, unsafe cooking, no-answer events, nighttime wandering, poor meals, or caregiver overload.',
          completionType: 'note',
          safetyTag: 'document',
          riskTags: ['home_safety'],
        },
        {
          id: 'check-emergency-basics',
          title: 'Check the emergency basics',
          body:
            'Confirm whether the person can call for help, whether someone can get into the home, and whether emergency contacts are current.',
          cta: { label: 'Open Emergency Contact Plan', href: '/care/guides/emergency-contact-plan-aging-parent/', type: 'guide' },
          completionType: 'tool_required',
          safetyTag: 'emergency',
          riskTags: ['unsafe_alone'],
        },
        {
          id: 'fix-one-immediate-risk',
          title: 'Fix one immediate home risk',
          body:
            'Choose one risk that can be reduced quickly: lighting, rugs, bathroom supports, medication access, food access, phone access, or walker placement. NIA home safety guidance highlights improvements such as lighting, grab bars, and reducing fall hazards.',
          completionType: 'checkbox',
          safetyTag: 'care-plan',
          riskTags: ['home_safety'],
        },
      ],
      next24Hours: [
        {
          id: 'room-by-room-review',
          title: 'Complete room-by-room safety review',
          body: 'Review entryway, stairs, bedroom, bathroom, kitchen, living room, lighting, floors, medications, emergency contacts, and nighttime path.',
          cta: { label: 'Open Home Safety Checklist', href: '/care/guides/home-safety-checklist-older-adults/', type: 'guide' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
          riskTags: ['home_safety'],
        },
        {
          id: 'create-no-answer-rule',
          title: 'Create a no-answer rule',
          body:
            'If the person lives alone or spends long periods alone, create a written no-answer rule. Example: If Mom does not answer by 10 a.m., call again in 15 minutes. If no answer, call the neighbor. If safety cannot be confirmed within 30 minutes, call the appropriate local support or emergency service depending on concern level.',
          completionType: 'note',
          safetyTag: 'emergency',
          riskTags: ['unsafe_alone'],
        },
        {
          id: 'identify-uncovered-hours',
          title: 'Identify uncovered hours',
          body: 'List the hours when the person is alone and the risks during those hours.',
          cta: { label: 'Use Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
          riskTags: ['caregiver_overload'],
        },
      ],
      thisWeek: [
        {
          id: 'estimate-home-support-cost',
          title: 'Estimate home support cost',
          body:
            'Estimate what it would cost to make staying home safer: home care hours, adult day care, meal support, transportation, emergency alert, home modifications, respite, and backup coverage.',
          cta: { label: 'Use Home Care Cost Calculator', href: '/care/home-care-cost-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['cost_pressure'],
        },
        {
          id: 'compare-staying-home-moving',
          title: 'Compare staying home against moving support',
          body:
            'If home safety depends on constant family coverage, rising home care hours, or unsafe overnight risk, compare home care with assisted living, memory care, or nursing home-level support.',
          cta: { label: 'Start Plan Senior Care Track', href: '/tracks/plan-senior-care/', type: 'track' },
          completionType: 'optional',
          safetyTag: 'care-plan',
          riskTags: ['facility_comparison'],
        },
        {
          id: 'create-stay-home-condition',
          title: 'Create a stay-home condition',
          body:
            'Write what must be true for aging in place to remain realistic: medication reliability, bathroom safety, backup coverage, no ongoing nighttime wandering, and caregiver not being the only safety net.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'unsafe_patterns', label: 'Unsafe patterns noticed', fieldType: 'textarea', requiredForSummary: true },
      { id: 'emergency_access', label: 'Emergency access plan', fieldType: 'textarea' },
      { id: 'home_safety_fixes', label: 'Home safety fixes needed', fieldType: 'textarea' },
      { id: 'uncovered_hours', label: 'Uncovered hours or supervision gaps', fieldType: 'textarea' },
      { id: 'support_cost', label: 'Estimated added support cost', fieldType: 'number' },
      { id: 'stay_home_conditions', label: 'Conditions required for staying home', fieldType: 'textarea', requiredForSummary: true },
    ],
    whoToCall: [
      {
        id: 'primary-caregiver-backup',
        title: 'Primary caregiver or local backup',
        whenToCall: 'Call when the person lives alone, has no-answer episodes, or needs emergency access planning.',
      },
      {
        id: 'doctor-clinician',
        title: 'Doctor or clinician',
        whenToCall: 'Call when falls, sudden confusion, medication issues, weakness, dehydration, poor intake, or major change from baseline is involved.',
      },
      {
        id: 'ot-home-safety',
        title: 'Occupational therapist or home safety professional',
        whenToCall: 'Call when bathroom safety, transfers, stairs, mobility, or home modifications are needed.',
      },
      {
        id: 'home-care-agency',
        title: 'Home care agency',
        whenToCall: 'Call when the person needs help with bathing, meals, medication reminders, mobility, supervision, or respite.',
      },
    ],
    recommendedTools: [
      { name: 'Home Safety Checklist', href: '/care/guides/home-safety-checklist-older-adults/', reason: 'Review the home room by room.', type: 'guide', primary: true },
      { name: 'Emergency Contact Plan', href: '/care/guides/emergency-contact-plan-aging-parent/', reason: 'Clarify who can call, enter, and respond.', type: 'guide' },
      { name: 'Care Needs Checklist', href: '/care/care-needs-checklist/', reason: 'Identify care gaps behind the unsafe pattern.', type: 'calculator' },
      { name: 'Home Care Cost Calculator', href: '/care/home-care-cost-calculator/', reason: 'Estimate support needed to stay home.', type: 'calculator' },
      { name: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', reason: 'Identify uncovered hours and family load.', type: 'calculator' },
      { name: 'Plan Senior Care Track', href: '/tracks/plan-senior-care/', reason: 'Compare staying home with higher-support care settings.', type: 'track' },
    ],
    scripts: [
      {
        title: 'Family script',
        body: 'We are not saying home is impossible. We are saying home needs a stronger safety plan if it is going to keep working.',
      },
      {
        title: 'Parent script',
        body: 'The goal is to help you stay home safely, not to take over. Let\'s fix the parts of the home and routine that are making things risky.',
      },
    ],
    redFlags: [
      'Repeated falls',
      'Bathroom fear or bathroom falls',
      'Missed medications',
      'No-answer events',
      'Unsafe cooking',
      'Wandering or getting lost',
      'No local backup',
      'Caregiver cannot sleep from worry',
      'Emergency contacts are unclear',
      'Staying home depends on luck',
    ],
    escalationRules: [
      'Staying home works only if medication is reliable, bathroom safety is improved, and there is backup coverage.',
      'Staying home works only if nighttime wandering does not continue.',
      'Staying home works only if the caregiver is not the only safety net.',
    ],
    summaryOutput: {
      title: 'Aging-in-Place Safety Plan',
      includes: [
        'Unsafe home patterns',
        'Current living situation',
        'Emergency access plan',
        'Home safety fixes needed',
        'Uncovered hours',
        'Support cost estimate',
        'Stay-home conditions',
        'Alternative care settings to compare',
        'Review date',
      ],
      recommendedNextSteps: [
        'Open the Home Safety Checklist.',
        'Create an Emergency Contact Plan.',
        'Use the Care Needs Checklist.',
        'Estimate Home Care Cost.',
        'Generate an Aging-in-Place Safety Plan.',
      ],
      questionsToAsk: [
        'What unsafe pattern is repeating?',
        'Can the person reliably call for help?',
        'Can someone get into the home in an emergency?',
        'Which hours are uncovered or unsafe?',
        'What must be true for staying home to remain realistic?',
      ],
      defaultReviewDays: 14,
      reviewDateLabel: '14 days, or sooner after a fall, no-answer event, medication issue, or safety concern',
    },
    relatedGuides: [
      { label: 'Aging in Place Guide', href: '/care/guides/aging-in-place-guide/', reason: 'Review the whole stay-home plan.' },
      { label: 'Emergency Planning for an Older Adult Living Alone', href: '/care/guides/emergency-planning-older-adult-living-alone/', reason: 'Strengthen emergency response.' },
      { label: 'Home Safety Checklist', href: '/care/guides/home-safety-checklist-older-adults/', reason: 'Review immediate home risks.' },
    ],
    reviewerType: ['Occupational therapist', 'Geriatric care manager', 'Clinician'],
    disclaimerType: 'health',
    analyticsEvents: [...sharedAnalyticsEvents, 'emergency_language_viewed', 'documentation_log_started'],
  },
  {
    id: 'senior-care-costs-unmanageable',
    slug: 'senior-care-costs-unmanageable',
    title: 'Senior Care Costs Are Becoming Unmanageable',
    shortTitle: 'Care costs unmanageable',
    category: 'family-care-costs',
    metaTitle: 'Senior Care Costs Are Becoming Unmanageable - What Families Can Do Next',
    metaDescription:
      'Use this senior care cost pressure playbook to identify cost drivers, compare care scenarios, review payment sources, reduce avoidable costs, and create a family budget.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Senior Care Costs Are Becoming Unmanageable',
      subheading:
        'Use this playbook to identify what is driving care costs, compare safer alternatives, review payment sources, reduce avoidable costs, and create a family budget before crisis spending takes over.',
      primaryCta: 'Start cost pressure playbook',
      secondaryCta: 'Build family care budget',
    },
    audience: [
      'Families facing rising home care, facility, insurance, or out-of-pocket care costs.',
      'Adult children trying to compare safety, money, and caregiver workload.',
      'Families preparing for a budget, Medicaid, insurance, or benefits conversation.',
    ],
    triggerEvents: ['Monthly bill increase', 'Private pay running out', 'Family paying out of pocket', 'Facility fee increase', 'Home care hours rising'],
    riskTags: ['facility_cost_pressure', 'family_payment_conflict', 'private_pay_running_out', 'professional_review_needed'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Financial caution',
      body:
        'Do not make major financial, legal, insurance, Medicaid, tax, or property decisions based only on a calculator result. Use Kefiw to organize the facts, then confirm important decisions with qualified professionals.',
      emergencyInstruction: 'Reducing cost should not remove the support that is keeping someone safe.',
    },
    intakeQuestions: [
      {
        id: 'current_care_setting',
        label: 'What care setting is currently being paid for?',
        type: 'multi_select',
        options: ['Family care only', 'Home care', 'Adult day care', 'Assisted living', 'Memory care', 'Nursing home', 'Short-term rehab', 'Not sure'],
      },
      { id: 'current_monthly_cost', label: 'Current monthly care cost', type: 'number' },
      {
        id: 'cost_increase_reason',
        label: 'What is making costs rise?',
        type: 'multi_select',
        options: [
          'More care hours',
          'Facility rate increase',
          'Care-level fees',
          'Medication management',
          'Supplies',
          'Transportation',
          'Hospital/rehab transition',
          'Memory care needs',
          'Private pay',
          'Insurance gap',
          'Family conflict',
          'Not sure',
        ],
      },
      {
        id: 'payment_sources',
        label: 'Which payment sources are currently being used?',
        type: 'multi_select',
        options: ['Parent income', 'Savings', 'Family contributions', 'Long-term care insurance', 'Medicaid', 'VA benefits', 'Home equity', 'Credit/debt', 'Not sure'],
      },
      {
        id: 'runway',
        label: 'How long can the current payment plan continue?',
        type: 'single_select',
        options: ['Less than 3 months', '3-6 months', '6-12 months', 'More than 12 months', 'Not sure'],
      },
      { id: 'family_paying', label: 'Are family members paying out of pocket?', type: 'boolean' },
      {
        id: 'care_quality_risk',
        label: 'Would reducing cost create safety or care quality concerns?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      { id: 'professional_review_done', label: 'Has a financial, legal, insurance, or benefits professional reviewed the situation?', type: 'boolean' },
    ],
    actionSections: {
      now: [
        {
          id: 'identify-true-cost-driver',
          title: 'Identify the true cost driver',
          body:
            'Separate the cost increase into categories: care hours, facility base rate, care-level fees, supplies, medication management, transportation, insurance gap, or family payments.',
          completionType: 'note',
          safetyTag: 'cost',
          riskTags: ['facility_cost_pressure'],
        },
        {
          id: 'build-full-monthly-care-budget',
          title: 'Build the full monthly care budget',
          body:
            'Include paid care, supplies, transportation, premiums, medications, facility fees, unpaid family costs, emergency costs, and caregiver support.',
          cta: { label: 'Use Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['family_payment_conflict'],
        },
        {
          id: 'estimate-care-setting-cost',
          title: 'Estimate the care setting cost',
          body:
            'Use the calculator that matches the current or likely care setting so the family can compare current cost to alternatives.',
          cta: { label: 'Use Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['facility_comparison'],
        },
      ],
      next24Hours: [
        {
          id: 'review-payment-sources',
          title: 'Review payment sources',
          body:
            'List all payment sources and what each can actually pay for: income, savings, family contributions, long-term care insurance, Medicaid, VA benefits, home equity, or other sources.',
          completionType: 'note',
          safetyTag: 'cost',
          riskTags: ['benefit_gap'],
        },
        {
          id: 'check-cost-reduction-risk',
          title: 'Check whether cost reduction would create risk',
          body:
            'Do not reduce cost by removing the only thing keeping the person safe. Mark which costs protect safety, which protect caregiver capacity, and which may be negotiable.',
          completionType: 'note',
          safetyTag: 'care-plan',
          riskTags: ['professional_review_needed'],
        },
        {
          id: 'ask-itemized-pricing',
          title: 'Ask for itemized pricing',
          body:
            'If using a facility or agency, ask for an itemized bill, current fee schedule, sample invoice, care-level explanation, and rate increase policy.',
          completionType: 'checkbox',
          safetyTag: 'cost',
        },
      ],
      thisWeek: [
        {
          id: 'compare-three-cost-scenarios',
          title: 'Compare three scenarios',
          body:
            'Create three realistic scenarios: keep the current care plan, adjust the plan with targeted cost reduction, and compare a different care setting or payment source.',
          completionType: 'note',
          safetyTag: 'cost',
        },
        {
          id: 'review-insurance-benefits',
          title: 'Review insurance and benefits',
          body:
            'Check whether long-term care insurance, Medicaid, VA benefits, Medicare coverage limits, or local resources may affect the payment plan. Medicaid is often relevant when long-term care costs exceed private-pay capacity.',
          cta: { label: 'Open How Families Pay for Long-Term Care', href: '/care/guides/how-families-pay-for-long-term-care/', type: 'guide' },
          completionType: 'optional',
          safetyTag: 'cost',
          riskTags: ['medicaid_possible'],
        },
        {
          id: 'create-family-payment-rule',
          title: 'Create a family payment rule',
          body:
            'If family members are paying, write a clear rule for what is shared, what is reimbursed, who approves expenses, and when the budget is reviewed.',
          completionType: 'note',
          safetyTag: 'family',
          riskTags: ['family_payment_conflict'],
        },
      ],
    },
    documentation: [
      { id: 'current_care_setting', label: 'Current care setting', fieldType: 'textarea', requiredForSummary: true },
      { id: 'current_monthly_cost', label: 'Current monthly cost', fieldType: 'number', requiredForSummary: true },
      { id: 'cost_drivers', label: 'Main cost drivers', fieldType: 'textarea', requiredForSummary: true },
      { id: 'payment_sources', label: 'Payment sources', fieldType: 'textarea' },
      { id: 'private_pay_runway', label: 'How long current payment plan can continue', fieldType: 'text' },
      { id: 'scenario_a', label: 'Scenario A: current plan', fieldType: 'textarea' },
      { id: 'scenario_b', label: 'Scenario B: adjusted plan', fieldType: 'textarea' },
      { id: 'scenario_c', label: 'Scenario C: alternative setting or payment source', fieldType: 'textarea' },
      { id: 'family_payment_rule', label: 'Family payment or reimbursement rule', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'facility-or-agency',
        title: 'Facility or home care agency',
        whenToCall: 'Call when you need an itemized bill, current fee schedule, care-level explanation, sample invoice, or rate increase policy.',
        whatToSay:
          'Please help us understand the full monthly bill: base rate, care-level fees, medication support, supplies, transportation, rate increases, and what could change next month.',
      },
      {
        id: 'ltc-insurer',
        title: 'Long-term care insurer',
        whenToCall: 'Call when a policy exists but benefit amount, claim status, covered setting, or elimination period is unclear.',
      },
      {
        id: 'elder-law-medicaid',
        title: 'Elder law attorney or Medicaid specialist',
        whenToCall: 'Call when private pay may run out, Medicaid may be needed, asset transfers are being discussed, or facility payment responsibility is unclear.',
      },
      {
        id: 'financial-tax',
        title: 'Financial planner or tax professional',
        whenToCall: 'Call when the family is considering withdrawals, selling assets, paying caregivers, using HSA/FSA funds, or sharing costs.',
      },
    ],
    recommendedTools: [
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Build the full monthly care budget.', type: 'calculator', primary: true },
      { name: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', reason: 'Compare care-setting cost scenarios.', type: 'calculator' },
      { name: 'Care Cost Reduction Planner', href: '/care/care-cost-reduction-planner/', reason: 'Check safer ways to reduce cost pressure.', type: 'calculator' },
      { name: 'Long-Term Care Insurance Calculator', href: '/care/long-term-care-insurance-calculator/', reason: 'Estimate insurance offset and gaps if a policy exists.', type: 'calculator' },
      { name: 'Medicaid May Be Needed Playbook', href: '/care/playbooks/medicaid-may-be-needed/', reason: 'Prepare state-specific Medicaid questions if private pay is short.', type: 'guide' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are not trying to cut care blindly. We are trying to understand what is driving the cost, what protects safety, what can be adjusted, and what payment sources we need to review.',
      },
      {
        title: 'Provider script',
        body:
          'Please help us understand the full monthly bill: base rate, care-level fees, medication support, supplies, transportation, rate increases, and what could change next month.',
      },
    ],
    redFlags: [
      'Family compares only the base rate',
      'One person pays silently',
      'Care costs rise but no budget is updated',
      'Private pay is running out',
      'Long-term care insurance is assumed but not verified',
      'Medicaid is considered too late',
      'Family reduces safety-related care to save money',
      'Facility invoices are not itemized',
      'Caregiver support is cut even though burnout is high',
    ],
    escalationRules: [
      'If reducing cost creates unsafe care gaps, pause and get professional input.',
      'If private pay may run out within six months, prepare Medicaid and provider questions now.',
      'If family members are paying, set a written payment and reimbursement rule.',
    ],
    summaryOutput: {
      title: 'Senior Care Cost Pressure Summary',
      includes: [
        'Current care setting',
        'Current monthly cost',
        'Main cost drivers',
        'Payment sources',
        'Private-pay runway',
        'Cost scenarios',
        'Safety-sensitive costs',
        'Negotiable costs',
        'Family payment rule',
        'Professional review needs',
        'Recommended next tools',
        'Review date',
      ],
      recommendedNextSteps: [
        'Use the Family Care Budget Calculator.',
        'Use the calculator for the current care setting.',
        'Review payment sources.',
        'Compare three realistic scenarios.',
        'Generate a Senior Care Cost Pressure Summary.',
      ],
      questionsToAsk: [
        'What is driving the increase?',
        'Which costs protect safety or caregiver capacity?',
        'How long can the current payment plan continue?',
        'What payment sources need professional review?',
        'What family payment rule is needed?',
      ],
      defaultReviewDays: 30,
      reviewDateLabel: '30 days, or sooner if monthly cost increases or payment source changes',
    },
    relatedGuides: [
      { label: 'How Families Pay for Long-Term Care', href: '/care/guides/how-families-pay-for-long-term-care/', reason: 'Review payment source categories.' },
      { label: 'Family Care Budget Worksheet', href: '/care/guides/family-care-budget-worksheet/', reason: 'Print a meeting-ready budget.' },
      { label: 'Talk to Siblings About Sharing Care Costs', href: '/care/guides/talk-to-siblings-sharing-care-costs/', reason: 'Prepare the family conversation.' },
    ],
    reviewerType: ['Financial planner', 'Elder law attorney', 'Senior care advisor'],
    disclaimerType: 'financial-legal-insurance-medicare',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'medicaid-may-be-needed',
    slug: 'medicaid-may-be-needed',
    title: 'Medicaid May Be Needed',
    shortTitle: 'Medicaid may be needed',
    category: 'medicaid-planning',
    metaTitle: 'Medicaid May Be Needed - Long-Term Care Planning Playbook',
    metaDescription:
      'Use this Medicaid planning playbook to organize care costs, payment sources, documents, Medicaid questions, HCBS options, look-back concerns, and elder law next steps.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Medicaid May Be Needed',
      subheading:
        'Use this playbook to organize care costs, gather documents, identify Medicaid questions, avoid risky transfers, and prepare for state-specific professional guidance.',
      primaryCta: 'Start Medicaid planning playbook',
      secondaryCta: 'Open document checklist',
    },
    audience: [
      'Families worried private pay will run out.',
      'Families trying to understand Medicaid long-term care questions before taking action.',
      'Caregivers gathering documents for state-specific elder law or Medicaid guidance.',
    ],
    triggerEvents: ['Private pay running out', 'Nursing home cost pressure', 'Home care cost pressure', 'Possible HCBS need', 'Asset-transfer concern'],
    riskTags: ['medicaid_possible', 'asset_transfer_risk', 'hcbs_possible', 'private_pay_running_out', 'professional_review_needed'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Safety and legal boundary',
      body:
        'Do not transfer, gift, retitle, or move assets because of this playbook. Medicaid long-term care rules vary by state, and asset transfers may create eligibility problems.',
      emergencyInstruction: 'Consult a qualified elder law attorney or Medicaid specialist before taking financial or legal action.',
    },
    intakeQuestions: [
      {
        id: 'care_setting',
        label: 'What care setting is being used or considered?',
        type: 'multi_select',
        options: ['Home care', 'Adult day care', 'Assisted living', 'Memory care', 'Nursing home', 'Hospital discharge', 'Not sure'],
      },
      {
        id: 'monthly_cost_pressure',
        label: 'Are care costs becoming hard to sustain?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'private_pay_timeline',
        label: 'How long can private pay continue?',
        type: 'single_select',
        options: ['Less than 3 months', '3-6 months', '6-12 months', 'More than 12 months', 'Not sure'],
      },
      { id: 'state_known', label: 'Do you know the state where Medicaid would be applied for?', type: 'boolean' },
      {
        id: 'asset_transfers',
        label: 'Have there been gifts, transfers, retitling, or large asset changes in recent years?',
        type: 'single_select',
        options: ['Yes', 'No', 'Not sure'],
      },
      {
        id: 'documents_ready',
        label: 'Are financial and legal documents organized?',
        type: 'single_select',
        options: ['Yes', 'Partly', 'No', 'Not sure'],
      },
      { id: 'wants_home_care', label: 'Is the goal to stay at home if possible?', type: 'boolean' },
      { id: 'elder_law_contacted', label: 'Has an elder law attorney or Medicaid specialist been contacted?', type: 'boolean' },
    ],
    actionSections: {
      now: [
        {
          id: 'estimate-current-future-cost',
          title: 'Estimate current and future care cost',
          body: 'Write the current monthly care cost and what it may become if care needs increase.',
          cta: { label: 'Use Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
        },
        {
          id: 'build-private-pay-runway',
          title: 'Build a private-pay runway',
          body: 'Estimate how long current income and available funds can cover care before Medicaid or another payment source may be needed.',
          cta: { label: 'Use Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['private_pay_running_out'],
        },
        {
          id: 'stop-risky-asset-moves',
          title: 'Stop risky asset moves',
          body:
            'Do not make gifts, transfers, retitle property, pay family caregivers informally, or move assets before getting state-specific Medicaid advice.',
          completionType: 'checkbox',
          safetyTag: 'cost',
          riskTags: ['asset_transfer_risk'],
        },
      ],
      next24Hours: [
        {
          id: 'identify-state-program-path',
          title: 'Identify the state and program path',
          body:
            'Medicaid rules and long-term care options vary by state. Identify the state where the person lives and whether the care need is nursing facility care, home and community-based services, or another support.',
          completionType: 'note',
          safetyTag: 'document',
        },
        {
          id: 'gather-medicaid-document-box',
          title: 'Gather the Medicaid document box',
          body:
            'Start collecting bank statements, income records, insurance policies, property records, care invoices, medical records, legal documents, Social Security information, and long-term care insurance documents.',
          cta: { label: 'Open Document Storage Checklist', href: '/care/guides/document-storage-access-update-checklist/', type: 'guide' },
          completionType: 'tool_required',
          safetyTag: 'document',
        },
        {
          id: 'check-hcbs-fit',
          title: 'Check whether HCBS may fit',
          body: 'If the goal is to stay home, check whether Medicaid Home and Community-Based Services may be relevant in the person\'s state.',
          cta: { label: 'Open Medicaid HCBS Guide', href: '/care/guides/medicaid-home-community-based-services/', type: 'guide' },
          completionType: 'optional',
          safetyTag: 'care-plan',
          riskTags: ['hcbs_possible'],
        },
      ],
      thisWeek: [
        {
          id: 'contact-elder-law-medicaid',
          title: 'Contact an elder law attorney or Medicaid specialist',
          body:
            'Ask for state-specific guidance about eligibility, look-back rules, spousal protections, estate recovery, documents, provider participation, and application timing.',
          cta: { label: 'Open How to Choose an Elder Law Attorney', href: '/care/guides/how-to-choose-elder-law-attorney/', type: 'guide' },
          completionType: 'optional',
          safetyTag: 'cost',
          riskTags: ['professional_review_needed'],
        },
        {
          id: 'ask-provider-medicaid-participation',
          title: 'Ask providers about Medicaid participation',
          body:
            'If a facility or agency is involved, ask whether they accept Medicaid, whether Medicaid-pending status is accepted, what services are covered, and what happens if private pay runs out.',
          completionType: 'note',
          safetyTag: 'cost',
        },
        {
          id: 'create-medicaid-transition-plan',
          title: 'Create a transition plan',
          body:
            'If private pay may run out, write what has to happen before then: documents gathered, state guidance received, provider eligibility checked, application timing understood, and family payment plan updated.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'state', label: 'State for Medicaid planning', fieldType: 'text', requiredForSummary: true },
      { id: 'current_care_setting', label: 'Current or expected care setting', fieldType: 'textarea', requiredForSummary: true },
      { id: 'monthly_care_cost', label: 'Current monthly care cost', fieldType: 'number' },
      { id: 'private_pay_runway', label: 'Estimated private-pay runway', fieldType: 'text', requiredForSummary: true },
      { id: 'possible_transfers', label: 'Possible gifts, transfers, retitling, or asset changes', fieldType: 'textarea' },
      { id: 'documents_needed', label: 'Documents still needed', fieldType: 'textarea' },
      { id: 'provider_medicaid_status', label: 'Provider Medicaid participation notes', fieldType: 'textarea' },
      { id: 'professional_questions', label: 'Questions for elder law attorney or Medicaid specialist', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'elder-law-attorney',
        title: 'Elder law attorney',
        whenToCall: 'Call when Medicaid eligibility, asset transfers, home ownership, caregiver payment, spousal protections, estate recovery, or look-back questions are involved.',
        whatToSay:
          'We need state-specific Medicaid long-term care guidance. Care costs are $____ per month, private pay may last ____, and we need to understand eligibility, look-back issues, documents, and provider options.',
      },
      {
        id: 'state-medicaid-office',
        title: 'State Medicaid office',
        whenToCall: 'Call when the family needs official eligibility, application, program, or state-specific benefit information.',
      },
      {
        id: 'facility-or-home-care-provider',
        title: 'Facility or home care provider',
        whenToCall: 'Call when you need to know whether Medicaid is accepted, whether Medicaid-pending status is accepted, and what happens if payment source changes.',
      },
      {
        id: 'area-agency-aging',
        title: 'Area Agency on Aging or local aging resource',
        whenToCall: 'Call when the family needs local Medicaid, HCBS, caregiver support, transportation, meals, or benefits counseling.',
      },
    ],
    recommendedTools: [
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Estimate how long private pay can continue.', type: 'calculator', primary: true },
      { name: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', reason: 'Estimate current and future care cost.', type: 'calculator' },
      { name: 'Document Storage Checklist', href: '/care/guides/document-storage-access-update-checklist/', reason: 'Gather the Medicaid document box.', type: 'guide' },
      { name: 'Medicaid Look-Back Period Guide', href: '/care/guides/medicaid-look-back-period/', reason: 'Prepare asset-transfer questions.', type: 'guide' },
      { name: 'Medicaid HCBS Guide', href: '/care/guides/medicaid-home-community-based-services/', reason: 'Review home and community-based options.', type: 'guide' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are not making legal or financial moves yet. First we need to understand the care cost, how long private pay can continue, what Medicaid options exist in this state, and what documents we need.',
      },
      {
        title: 'Elder law script',
        body:
          'What should we avoid doing before Medicaid planning is reviewed, and what documents should we gather before an application or provider transition?',
      },
    ],
    redFlags: [
      'Private pay is running out but no plan exists',
      'Assets are being gifted or moved without advice',
      'Family assumes Medicaid rules are the same in every state',
      'Facility Medicaid status is unknown',
      'No one has gathered financial records',
      'Caregiver payment is informal and undocumented',
      'Medicaid is discussed only after funds are nearly gone',
      'Estate recovery and spousal rules are ignored',
    ],
    escalationRules: [
      'If private pay is under three months, gather documents and seek state-specific guidance promptly.',
      'If gifts, transfers, retitling, or caregiver payments occurred, do not move more money before professional review.',
      'If staying home is the goal, ask specifically about HCBS options in the person\'s state.',
    ],
    summaryOutput: {
      title: 'Medicaid Planning Prep Summary',
      includes: [
        'State',
        'Current care setting',
        'Monthly care cost',
        'Private-pay runway',
        'Possible transfer or look-back concerns',
        'Documents needed',
        'Provider Medicaid participation',
        'Questions for professional',
        'Recommended next steps',
        'Review date',
      ],
      recommendedNextSteps: [
        'Use the Senior Care Cost Calculator.',
        'Use the Family Care Budget Calculator.',
        'Open the Document Storage Checklist.',
        'Read the Medicaid Look-Back Guide.',
        'Generate a Medicaid Planning Prep Summary.',
      ],
      questionsToAsk: [
        'What state Medicaid program path might apply?',
        'What should we avoid before Medicaid planning is reviewed?',
        'What documents are still missing?',
        'Does the provider accept Medicaid or Medicaid pending?',
        'Could HCBS be relevant if the goal is to stay home?',
      ],
      defaultReviewDays: 14,
      reviewDateLabel: '14 days, or sooner if private-pay runway is under 3 months',
    },
    relatedGuides: [
      { label: 'Medicaid Long-Term Care Basics', href: '/care/guides/medicaid-long-term-care-basics/', reason: 'Understand the broad Medicaid boundary.' },
      { label: 'Medicaid HCBS Guide', href: '/care/guides/medicaid-home-community-based-services/', reason: 'Review home and community-based services.' },
      { label: 'Medicaid Look-Back Period Guide', href: '/care/guides/medicaid-look-back-period/', reason: 'Prepare transfer and documentation questions.' },
    ],
    reviewerType: ['Elder law attorney', 'Medicaid specialist'],
    disclaimerType: 'financial-legal-insurance-medicare',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'long-term-care-insurance-claim-starter',
    slug: 'long-term-care-insurance-claim-starter',
    title: 'Long-Term Care Insurance Claim Starter',
    shortTitle: 'LTC insurance claim starter',
    category: 'insurance-claim',
    metaTitle: 'Long-Term Care Insurance Claim Starter Playbook',
    metaDescription:
      'Use this long-term care insurance claim starter to review benefit triggers, elimination periods, covered care settings, provider requirements, documentation, and uncovered gaps.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Long-Term Care Insurance Claim Starter',
      subheading:
        'Use this playbook to organize the policy, request the claim packet, understand the elimination period, confirm covered care settings, and estimate the gap between benefits and actual care cost.',
      primaryCta: 'Start claim playbook',
      secondaryCta: 'Open policy review worksheet',
    },
    audience: [
      'Families who found a long-term care insurance policy.',
      'Caregivers preparing to start or track a claim.',
      'Families comparing policy benefits against actual care cost.',
    ],
    triggerEvents: ['Policy found', 'Claim needed', 'Home care or facility starting', 'Elimination period unclear', 'Benefit gap unclear'],
    riskTags: ['ltc_policy_found', 'ltc_claim_needed', 'elimination_period', 'benefit_gap', 'professional_review_needed'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Important notice',
      body:
        'A long-term care insurance policy does not guarantee an approved claim. Benefits depend on policy terms, benefit triggers, elimination period rules, provider requirements, documentation, and the insurer\'s claim process.',
      emergencyInstruction: 'Confirm policy terms with the insurer or a qualified professional before building the care plan around benefits.',
    },
    intakeQuestions: [
      {
        id: 'policy_found',
        label: 'Do you have the full policy document?',
        type: 'single_select',
        options: ['Yes', 'No', 'Only a brochure or summary', 'Not sure'],
      },
      { id: 'claim_started', label: 'Has a claim already been started?', type: 'boolean' },
      {
        id: 'care_setting',
        label: 'What care setting is being considered or used?',
        type: 'multi_select',
        options: ['Home care', 'Assisted living', 'Memory care', 'Nursing home', 'Adult day care', 'Respite', 'Not sure'],
      },
      { id: 'benefit_trigger_known', label: 'Do you know what triggers benefits?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      { id: 'elimination_period_known', label: 'Do you know the elimination period?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      { id: 'provider_requirements_known', label: 'Do you know which providers qualify under the policy?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      { id: 'current_monthly_care_cost', label: 'Current or expected monthly care cost', type: 'number' },
      { id: 'benefit_amount_known', label: 'Do you know the daily or monthly benefit amount?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
    ],
    actionSections: {
      now: [
        {
          id: 'find-full-policy',
          title: 'Find the full policy',
          body:
            'Do not rely on a brochure or sales summary. Find the full policy, benefit summary, riders, inflation protection details, and claim instructions.',
          completionType: 'checkbox',
          safetyTag: 'document',
          riskTags: ['ltc_policy_found'],
        },
        {
          id: 'request-claim-packet',
          title: 'Request the claim packet',
          body: 'Ask the insurer for the claim packet, current benefit summary, elimination period rules, provider requirements, invoice requirements, and appeal process.',
          completionType: 'checkbox',
          safetyTag: 'document',
          riskTags: ['ltc_claim_needed'],
        },
        {
          id: 'confirm-elimination-period',
          title: 'Confirm the elimination period',
          body:
            'Ask whether the elimination period is calendar days or service days, whether paid care must occur for days to count, and who pays during that period.',
          completionType: 'note',
          safetyTag: 'cost',
          riskTags: ['elimination_period'],
        },
      ],
      next24Hours: [
        {
          id: 'confirm-covered-settings',
          title: 'Confirm covered care settings',
          body: 'Do not assume the policy covers the care setting being used. Confirm whether home care, assisted living, memory care, nursing home, adult day care, or respite qualifies.',
          completionType: 'note',
          safetyTag: 'document',
        },
        {
          id: 'confirm-provider-requirements',
          title: 'Confirm provider requirements before hiring',
          body: 'Before hiring a caregiver, agency, or facility based on the policy, confirm whether the provider meets policy requirements.',
          completionType: 'checkbox',
          safetyTag: 'document',
        },
        {
          id: 'estimate-uncovered-gap',
          title: 'Estimate the uncovered gap',
          body: 'Compare the monthly care cost against the policy\'s daily or monthly benefit. The gap is the amount the family still needs to plan for.',
          cta: { label: 'Use Long-Term Care Insurance Calculator', href: '/care/long-term-care-insurance-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['benefit_gap'],
        },
      ],
      thisWeek: [
        {
          id: 'create-documentation-system',
          title: 'Create a documentation system',
          body: 'Set up a folder for claim forms, invoices, care notes, provider records, assessment documents, insurer calls, and benefit explanations.',
          completionType: 'checkbox',
          safetyTag: 'document',
        },
        {
          id: 'track-care-delivery',
          title: 'Track care needs and care delivery',
          body: 'Claims may require documentation showing care needs and services provided. Use care logs and invoices that match the insurer\'s requirements.',
          cta: { label: 'Open Daily Care Log Template', href: '/care/guides/daily-care-log-template/', type: 'worksheet' },
          completionType: 'optional',
          safetyTag: 'document',
        },
        {
          id: 'add-claim-timing-budget',
          title: 'Add claim timing to the family care budget',
          body: 'The family may need to pay during the elimination period or while the claim is pending. Add this timing gap to the care budget.',
          cta: { label: 'Use Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
        },
      ],
    },
    documentation: [
      { id: 'policy_company', label: 'Insurance company', fieldType: 'text', requiredForSummary: true },
      { id: 'policy_number', label: 'Policy number', fieldType: 'text' },
      { id: 'claim_contact', label: 'Claim contact', fieldType: 'text' },
      { id: 'benefit_trigger', label: 'Benefit trigger', fieldType: 'textarea' },
      { id: 'elimination_period', label: 'Elimination period details', fieldType: 'textarea', requiredForSummary: true },
      { id: 'covered_settings', label: 'Covered care settings', fieldType: 'textarea' },
      { id: 'provider_requirements', label: 'Provider requirements', fieldType: 'textarea' },
      { id: 'monthly_benefit', label: 'Monthly or daily benefit amount', fieldType: 'number' },
      { id: 'monthly_gap', label: 'Estimated uncovered monthly gap', fieldType: 'number' },
    ],
    whoToCall: [
      {
        id: 'ltc-insurer',
        title: 'Long-term care insurer',
        whenToCall: 'Call when you need the claim packet, current benefit summary, benefit trigger rules, elimination period rules, provider requirements, invoice requirements, and appeal process.',
        whatToSay:
          'Please confirm in writing the benefit trigger, elimination period, covered care settings, provider requirements, invoice requirements, and current benefit amount.',
      },
      {
        id: 'care-provider-facility',
        title: 'Care provider or facility',
        whenToCall: 'Call before hiring or admission to ask whether their invoices and care notes meet long-term care insurance requirements.',
      },
      {
        id: 'licensed-insurance-professional',
        title: 'Licensed insurance professional',
        whenToCall: 'Call when policy terms, benefit triggers, riders, covered settings, or claim strategy are unclear.',
      },
      {
        id: 'elder-law-attorney',
        title: 'Elder law attorney',
        whenToCall: 'Call when a claim is denied, family payment responsibility is unclear, Medicaid may become relevant, or authority is disputed.',
      },
    ],
    recommendedTools: [
      { name: 'Long-Term Care Insurance Calculator', href: '/care/long-term-care-insurance-calculator/', reason: 'Estimate covered amount, gap, and benefit duration.', type: 'calculator', primary: true },
      { name: 'LTC Policy Review Worksheet', href: '/care/guides/long-term-care-insurance-policy-review-worksheet/', reason: 'Review benefit trigger, elimination period, and covered settings.', type: 'worksheet' },
      { name: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', reason: 'Compare actual care cost with policy benefit.', type: 'calculator' },
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Budget for elimination period and claim timing gaps.', type: 'calculator' },
      { name: 'Daily Care Log Template', href: '/care/guides/daily-care-log-template/', reason: 'Document care delivery and changes.', type: 'worksheet' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'Before we build the care plan around this policy, we need to know exactly what triggers benefits, when payments start, which providers qualify, and what gap remains.',
      },
      {
        title: 'Insurer script',
        body:
          'Please confirm in writing the benefit trigger, elimination period, covered care settings, provider requirements, invoice requirements, and current benefit amount.',
      },
    ],
    redFlags: [
      'Only brochure is available',
      'Full policy is missing',
      'Elimination period is unclear',
      'Provider requirements are unknown',
      'Family hires care before confirming coverage',
      'Benefit is far below actual care cost',
      'Invoices do not include required details',
      'Claim is delayed but not tracked',
      'No one documents insurer calls',
    ],
    escalationRules: [
      'If the full policy is missing, request it before relying on benefits.',
      'If provider requirements are unclear, confirm them before hiring or admission.',
      'If a claim is denied or delayed without clarity, involve a qualified insurance professional or elder law attorney.',
    ],
    summaryOutput: {
      title: 'LTC Claim Starter Summary',
      includes: [
        'Policy company and contact',
        'Claim status',
        'Benefit trigger',
        'Elimination period',
        'Covered settings',
        'Provider requirements',
        'Care cost',
        'Policy benefit',
        'Uncovered gap',
        'Documentation checklist',
        'Next steps',
      ],
      recommendedNextSteps: [
        'Open the LTC Policy Review Worksheet.',
        'Request the claim packet.',
        'Use the LTC Insurance Calculator.',
        'Use the Family Care Budget Calculator.',
        'Generate an LTC Claim Starter Summary.',
      ],
      questionsToAsk: [
        'What triggers benefits under this policy?',
        'How is the elimination period counted?',
        'Which care settings and providers qualify?',
        'What invoice details are required?',
        'What gap remains after policy benefits?',
      ],
      defaultReviewDays: 7,
      reviewDateLabel: '7 days after requesting claim packet, then weekly until claim status is clear',
    },
    relatedGuides: [
      { label: 'Long-Term Care Insurance Policy Review Worksheet', href: '/care/guides/long-term-care-insurance-policy-review-worksheet/', reason: 'Review policy terms before claims.' },
      { label: 'How Families Pay for Long-Term Care', href: '/care/guides/how-families-pay-for-long-term-care/', reason: 'Compare benefit gaps with other payment sources.' },
      { label: 'Family Care Budget Worksheet', href: '/care/guides/family-care-budget-worksheet/', reason: 'Budget for claim timing and unpaid gaps.' },
    ],
    reviewerType: ['Licensed insurance professional', 'Elder law attorney for disputes'],
    disclaimerType: 'financial-legal-insurance-medicare',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'medicare-open-enrollment-review',
    slug: 'medicare-open-enrollment-review',
    title: 'Medicare Open Enrollment Review',
    shortTitle: 'Medicare review',
    category: 'medicare-review',
    metaTitle: 'Medicare Open Enrollment Review Playbook',
    metaDescription:
      'Use this Medicare Open Enrollment playbook to review doctors, prescriptions, pharmacies, premiums, Part D costs, Medicare Advantage networks, IRMAA, and plan changes.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'Medicare Open Enrollment Review',
      subheading:
        'Use this playbook to review Medicare coverage before Open Enrollment decisions: doctors, hospitals, prescriptions, pharmacies, premiums, IRMAA, prior authorization, and total yearly cost.',
      primaryCta: 'Start Medicare review',
      secondaryCta: 'Open Medicare comparison worksheet',
    },
    audience: [
      'People reviewing Medicare coverage before Open Enrollment.',
      'Family caregivers helping compare doctors, drugs, pharmacies, and total cost.',
      'Households with drug changes, provider changes, IRMAA notices, or plan-rule concerns.',
    ],
    triggerEvents: ['Open Enrollment', 'Premium changed', 'New medication', 'Doctor changed', 'IRMAA notice', 'Caregiver helping with review'],
    riskTags: ['annual_medicare_review', 'part_d_drug_cost', 'doctor_network', 'hospital_network', 'prior_authorization', 'irmaa_risk', 'medigap_timing'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Timing banner',
      body:
        'Medicare Open Enrollment runs October 15 through December 7. Changes made during this period are effective January 1 of the next year if the plan receives the request by December 7.',
      emergencyInstruction: 'This playbook does not recommend a plan or replace Medicare, SHIP, insurer, or licensed professional guidance.',
    },
    intakeQuestions: [
      {
        id: 'current_coverage_type',
        label: 'What coverage does the person currently have?',
        type: 'single_select',
        options: [
          'Original Medicare only',
          'Original Medicare + Part D',
          'Original Medicare + Medigap + Part D',
          'Medicare Advantage',
          'Medicare Advantage with drug coverage',
          'Not sure',
        ],
      },
      {
        id: 'review_reason',
        label: 'Why are you reviewing coverage?',
        type: 'multi_select',
        options: [
          'Open Enrollment',
          'Premium changed',
          'Drug cost changed',
          'Doctor changed',
          'Hospital changed',
          'New diagnosis',
          'New medication',
          'Considering Medicare Advantage',
          'Considering Original Medicare',
          'IRMAA notice',
          'Caregiver helping with review',
          'Not sure',
        ],
      },
      { id: 'doctor_check_done', label: 'Have current doctors and specialists been checked?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      { id: 'drug_check_done', label: 'Have prescriptions been checked against plan coverage?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      { id: 'pharmacy_check_done', label: 'Has preferred pharmacy pricing been checked?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      { id: 'plan_rules_concern', label: 'Are prior authorization, referrals, or network rules a concern?', type: 'boolean' },
      {
        id: 'income_change',
        label: 'Has income changed because of retirement, death of spouse, divorce, work stoppage, or another major life change?',
        type: 'boolean',
      },
      { id: 'needs_unbiased_help', label: 'Would unbiased Medicare counseling be useful?', type: 'boolean' },
    ],
    actionSections: {
      now: [
        {
          id: 'identify-current-coverage',
          title: 'Identify the current coverage',
          body:
            'Write down whether the person has Original Medicare, Medicare Advantage, Part D, Medigap, or a combination. Do not compare plans until the current setup is clear.',
          completionType: 'note',
          safetyTag: 'document',
          riskTags: ['annual_medicare_review'],
        },
        {
          id: 'update-provider-list',
          title: 'Update the doctor and hospital list',
          body: 'List the primary doctor, specialists, preferred hospitals, therapy providers, pharmacies, and any recurring care providers.',
          completionType: 'note',
          safetyTag: 'document',
          riskTags: ['doctor_network', 'hospital_network'],
        },
        {
          id: 'update-prescription-list',
          title: 'Update the prescription list',
          body: 'List each medication, dose, frequency, pharmacy, and whether the drug changed this year.',
          cta: { label: 'Open Medication List Template', href: '/care/guides/medication-list-change-log-template/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'document',
          riskTags: ['part_d_drug_cost'],
        },
      ],
      next24Hours: [
        {
          id: 'check-drug-coverage-pharmacy',
          title: 'Check drug coverage and pharmacy pricing',
          body:
            'Do not assume last year\'s drug plan still works. Check the exact medication list, dosage, plan formulary, drug tier, preferred pharmacy, prior authorization, step therapy, and quantity limits.',
          cta: { label: 'Use Part D Estimate', href: '/care/part-d-estimate/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
          riskTags: ['part_d_drug_cost', 'prior_authorization'],
        },
        {
          id: 'compare-total-yearly-cost',
          title: 'Compare total yearly cost',
          body: 'Compare premiums, deductibles, copays, coinsurance, drug costs, out-of-pocket maximums, and IRMAA risk. Do not compare plans by premium alone.',
          cta: { label: 'Use Medicare Cost Calculator', href: '/care/medicare-cost-planner/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
        },
        {
          id: 'check-irmaa-risk',
          title: 'Check IRMAA risk',
          body:
            'If income is higher or recently changed, check whether income-related premium adjustments could affect Part B or Part D costs.',
          cta: { label: 'Use Medicare IRMAA Calculator', href: '/care/medicare-irmaa-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
          riskTags: ['irmaa_risk'],
        },
      ],
      thisWeek: [
        {
          id: 'use-pass-fail-plan-screen',
          title: 'Use the pass/fail plan screen',
          body:
            'Before picking the best plan, eliminate plans that fail must-have needs: key doctors, important prescriptions, preferred hospital access, bad-year affordability, plan rules, travel needs, or caregiver manageability.',
          cta: { label: 'Open Medicare Plan Comparison Worksheet', href: '/care/guides/medicare-plan-comparison-worksheet/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'document',
        },
        {
          id: 'get-unbiased-help',
          title: 'Get unbiased help if the decision is unclear',
          body:
            'If the plan choice is confusing, use SHIP, Medicare, plan documents, or another qualified source before enrolling.',
          cta: { label: 'Find your local SHIP', href: 'https://www.shiphelp.org/', type: 'external' },
          completionType: 'optional',
          safetyTag: 'cost',
        },
        {
          id: 'save-annual-review-summary',
          title: 'Save the annual review summary',
          body: 'Save the plan reviewed, doctors checked, prescriptions checked, pharmacy checked, estimated annual cost, and open questions.',
          completionType: 'note',
          safetyTag: 'document',
        },
      ],
    },
    documentation: [
      { id: 'current_coverage', label: 'Current Medicare coverage', fieldType: 'textarea', requiredForSummary: true },
      { id: 'doctors_checked', label: 'Doctors and hospitals checked', fieldType: 'textarea' },
      { id: 'prescriptions_checked', label: 'Prescriptions checked', fieldType: 'textarea', requiredForSummary: true },
      { id: 'pharmacy_checked', label: 'Preferred pharmacies checked', fieldType: 'textarea' },
      { id: 'estimated_annual_cost', label: 'Estimated annual Medicare cost', fieldType: 'number' },
      { id: 'irmaa_notes', label: 'IRMAA notes', fieldType: 'textarea' },
      { id: 'open_questions', label: 'Open questions before enrollment', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'ship',
        title: 'SHIP',
        whenToCall: 'Call when the family wants free, unbiased Medicare counseling or needs help comparing options.',
        whatToSay:
          'We are reviewing Medicare coverage for Open Enrollment. We need help checking doctors, prescriptions, pharmacy costs, total yearly cost, and plan rules.',
      },
      {
        id: 'medicare-plan-insurer',
        title: 'Medicare plan or insurer',
        whenToCall: 'Call when provider network, drug formulary, prior authorization, pharmacy, or premium details are unclear.',
        whatToSay: 'Can you confirm whether these doctors, hospitals, prescriptions, and pharmacies are covered for the coming plan year?',
      },
      {
        id: 'social-security',
        title: 'Social Security',
        whenToCall: 'Call when IRMAA, Part B premium deductions, or income-related adjustment notices are involved.',
      },
      {
        id: 'licensed-medicare-professional',
        title: 'Licensed Medicare professional',
        whenToCall: 'Call when the user wants individualized plan guidance, enrollment help, or policy comparison.',
      },
    ],
    recommendedTools: [
      { name: 'Medicare Cost Calculator', href: '/care/medicare-cost-planner/', reason: 'Compare yearly Medicare-related cost exposure.', type: 'calculator', primary: true },
      { name: 'Part D Estimate', href: '/care/part-d-estimate/', reason: 'Estimate drug-plan cost pressure and penalty risk.', type: 'calculator' },
      { name: 'Medicare IRMAA Calculator', href: '/care/medicare-irmaa-calculator/', reason: 'Check income-related premium adjustment risk.', type: 'calculator' },
      { name: 'Part B Premium Calculator', href: '/care/part-b-premium-calculator/', reason: 'Separate Part B premium, deductible, and coinsurance exposure.', type: 'calculator' },
      { name: 'Medicare Plan Comparison Worksheet', href: '/care/guides/medicare-plan-comparison-worksheet/', reason: 'Use pass/fail checks before comparing cost.', type: 'worksheet' },
      { name: 'Medicare Plan Red Flags Guide', href: '/care/guides/medicare-plan-red-flags/', reason: 'Review common plan-comparison traps.', type: 'guide' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'Let\'s not stay with a plan just because it worked last year. We need to check doctors, drugs, pharmacies, total cost, and what changed.',
      },
      {
        title: 'Plan review script',
        body:
          'Please help us verify this plan against the actual doctor list, prescription list, preferred pharmacy, network rules, and worst-case yearly cost.',
      },
    ],
    redFlags: [
      'Premium is the only thing compared',
      'Drug list is not checked',
      'Pharmacy pricing is ignored',
      'Doctor network is assumed',
      'Hospital network is not checked',
      'Prior authorization is ignored',
      'IRMAA notice is ignored',
      'A plan ad drives the decision',
      'Family assumes Medicare covers long-term custodial care',
    ],
    escalationRules: [
      'If a must-have doctor, drug, hospital, or pharmacy is not covered, pause before enrollment.',
      'If IRMAA or income changed, check Social Security guidance before assuming the bill is final.',
      'If the decision is unclear, use Medicare, SHIP, plan documents, or a qualified professional before enrolling.',
    ],
    summaryOutput: {
      title: 'Medicare Review Summary',
      includes: [
        'Current coverage',
        'Plans reviewed',
        'Doctors and hospitals checked',
        'Prescriptions checked',
        'Pharmacy checked',
        'Estimated annual cost',
        'IRMAA risk',
        'Open questions',
        'Recommended next step',
        'Review date',
      ],
      recommendedNextSteps: [
        'Open the Medicare Plan Comparison Worksheet.',
        'Use Part D Estimate.',
        'Use Medicare Cost Calculator.',
        'Use Medicare IRMAA Calculator if needed.',
        'Generate a Medicare Review Summary.',
      ],
      questionsToAsk: [
        'Are current doctors and preferred hospitals covered for the coming plan year?',
        'Are all prescriptions covered at the preferred pharmacy?',
        'Which prior authorization, referral, or network rules apply?',
        'What is the estimated bad-year cost?',
        'Should SHIP, Medicare, or a licensed professional review this before enrollment?',
      ],
      defaultReviewDays: 30,
      reviewDateLabel: 'Before December 7, and again after plan confirmation',
    },
    relatedGuides: [
      { label: 'How to Compare Medicare Plans', href: '/care/guides/how-to-compare-medicare-plans/', reason: 'Review plan-comparison workflow.' },
      { label: 'Medicare Plan Red Flags', href: '/care/guides/medicare-plan-red-flags/', reason: 'Avoid common enrollment mistakes.' },
      { label: 'Medicare Plan Comparison Worksheet', href: '/care/guides/medicare-plan-comparison-worksheet/', reason: 'Print a pass/fail worksheet.' },
    ],
    reviewerType: ['Medicare specialist', 'Licensed insurance professional'],
    disclaimerType: 'financial-legal-insurance-medicare',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'sibling-wont-help',
    slug: 'sibling-wont-help',
    title: 'A Sibling Won\'t Help',
    shortTitle: 'Sibling won\'t help',
    category: 'family-conflict',
    metaTitle: 'A Sibling Won\'t Help - Family Caregiving Playbook',
    metaDescription:
      'Use this playbook when one sibling is carrying too much caregiving work and needs task ownership, family accountability, shared costs, or a clearer care plan.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'A Sibling Won\'t Help',
      subheading:
        'Use this playbook to make the caregiving workload visible, ask for specific task ownership, separate time from money, and reduce the chance that one person becomes the entire care plan.',
      primaryCta: 'Start sibling help playbook',
      secondaryCta: 'Calculate caregiver hours',
    },
    audience: [
      'Primary caregivers who need visible task ownership.',
      'Families where one person is carrying most of the care work.',
      'Caregivers preparing a calmer sibling conversation or family meeting.',
    ],
    triggerEvents: ['Sibling avoids tasks', 'Sibling gives advice but no support', 'No backup exists', 'Caregiver hours are invisible', 'Money and time conflict'],
    riskTags: ['task_ownership_gap', 'primary_caregiver_overloaded', 'sibling_unavailable', 'sibling_refuses', 'money_conflict'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Safety and scope',
      body:
        'This playbook helps with family communication and care task planning. If the current care plan is unsafe, the caregiver cannot continue safely, or the person receiving care is at risk, prioritize safety and professional support over family agreement.',
      emergencyInstruction: 'This playbook does not replace medical, legal, financial, employment, or emergency advice.',
    },
    intakeQuestions: [
      { id: 'primary_caregiver', label: 'Are you currently the primary caregiver?', type: 'single_select', options: ['Yes', 'No', 'Shared role', 'Not sure'] },
      {
        id: 'main_issue',
        label: 'What is the main issue?',
        type: 'multi_select',
        options: [
          'Sibling does not help with tasks',
          'Sibling does not contribute money',
          'Sibling gives advice but no support',
          'Sibling lives far away',
          'Sibling denies care needs',
          'Sibling controls money',
          'Sibling disagrees about facility or home care',
          'Sibling avoids conversations',
          'Not sure',
        ],
      },
      { id: 'caregiver_hours_known', label: 'Do you know how many hours per week caregiving takes?', type: 'single_select', options: ['Yes', 'No', 'Roughly'] },
      { id: 'task_list_written', label: 'Is there a written task list?', type: 'boolean' },
      { id: 'money_part_of_conflict', label: 'Is money part of the conflict?', type: 'boolean' },
      { id: 'care_plan_safety', label: 'Is the current care plan safe without more help?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      { id: 'family_meeting_done', label: 'Has the family had a structured care meeting?', type: 'boolean' },
    ],
    actionSections: {
      now: [
        {
          id: 'make-invisible-work-visible',
          title: 'Make the invisible work visible',
          body:
            'Before asking a sibling to help, list the work. Include personal care, transportation, meals, medication, supervision, paperwork, emotional support, bills, and family communication.',
          cta: { label: 'Use Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'family',
          riskTags: ['primary_caregiver_overloaded'],
        },
        {
          id: 'separate-four-lanes',
          title: 'Separate time, money, decisions, and backup',
          body:
            'Do not combine every problem into "you never help." Separate the issue into four lanes: time, money, decisions, and backup coverage.',
          completionType: 'note',
          safetyTag: 'family',
          riskTags: ['money_conflict'],
        },
        {
          id: 'choose-one-specific-request',
          title: 'Choose one specific request',
          body:
            'Do not ask for vague help. Choose one task the sibling can own: pharmacy refills, appointments, insurance calls, respite payment, weekly updates, or agency research.',
          completionType: 'note',
          safetyTag: 'family',
          riskTags: ['task_ownership_gap'],
        },
      ],
      next24Hours: [
        {
          id: 'build-task-ownership-table',
          title: 'Build a task ownership table',
          body:
            'Every recurring task should have an owner, backup, and rhythm. A task without an owner usually belongs to the primary caregiver by default.',
          cta: { label: 'Open Family Meeting Agenda Template', href: '/care/guides/family-care-meeting-agenda-template/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'family',
        },
        {
          id: 'prepare-calm-request-script',
          title: 'Prepare a calm request script',
          body: 'Use facts, not accusation. Ask for ownership, not general support.',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'price-paid-help-gap',
          title: 'Identify what must be paid for if family help is not available',
          body: 'If siblings cannot or will not provide time, estimate what paid help would cost for the uncovered tasks.',
          cta: { label: 'Use Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'cost',
        },
      ],
      thisWeek: [
        {
          id: 'hold-structured-family-meeting',
          title: 'Hold a structured family meeting',
          body:
            'Use a written agenda. Keep the meeting focused on current care needs, caregiver workload, cost, task ownership, and next steps.',
          completionType: 'checkbox',
          safetyTag: 'family',
        },
        {
          id: 'create-no-default-rule',
          title: 'Create a no-default rule',
          body: 'Decide that new tasks do not automatically go to the primary caregiver. Each new task must be assigned or paid for.',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'set-task-review-date',
          title: 'Set a review date',
          body: 'Review the task split in 14-30 days. If the plan still depends on one person, consider paid help or a care setting change.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'current_primary_caregiver', label: 'Current primary caregiver', fieldType: 'text', requiredForSummary: true },
      { id: 'main_family_issue', label: 'Main sibling or family issue', fieldType: 'textarea', requiredForSummary: true },
      { id: 'caregiver_hours', label: 'Estimated caregiving hours per week', fieldType: 'number' },
      { id: 'tasks_needing_owner', label: 'Tasks needing an owner', fieldType: 'textarea' },
      { id: 'specific_request', label: 'Specific request to sibling', fieldType: 'textarea', requiredForSummary: true },
      { id: 'paid_help_gap', label: 'Tasks that may require paid help', fieldType: 'textarea' },
      { id: 'review_date', label: 'Review date', fieldType: 'date' },
    ],
    whoToCall: [
      {
        id: 'sibling-family-member',
        title: 'Sibling or family member',
        whenToCall: 'Call when a task can be assigned clearly.',
        whatToSay: 'I need task ownership, not general encouragement. Can you own [specific task] every [rhythm], with [backup] if you cannot do it?',
      },
      {
        id: 'geriatric-care-manager',
        title: 'Geriatric care manager',
        whenToCall: 'Call when the family cannot agree on care needs, workload, safety, or next steps.',
      },
      {
        id: 'elder-law-attorney',
        title: 'Elder law attorney',
        whenToCall: 'Call when money, decision authority, power of attorney, reimbursement, or financial control is part of the conflict.',
      },
      {
        id: 'home-care-respite',
        title: 'Home care agency or respite provider',
        whenToCall: 'Call when family help is unavailable and the care task still must be covered.',
      },
    ],
    recommendedTools: [
      { name: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', reason: 'Make the workload visible before asking for help.', type: 'calculator', primary: true },
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Price paid help if tasks remain uncovered.', type: 'calculator' },
      { name: 'Family Meeting Agenda Template', href: '/care/guides/family-care-meeting-agenda-template/', reason: 'Structure the conversation around facts and owners.', type: 'worksheet' },
      { name: 'How to Ask Family for Caregiving Help', href: '/care/guides/how-to-ask-family-for-caregiving-help/', reason: 'Use practical task-owner scripts.', type: 'guide' },
      { name: 'Talk to Siblings About Sharing Care Costs', href: '/care/guides/talk-to-siblings-sharing-care-costs/', reason: 'Separate money from time and task ownership.', type: 'guide' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'I am not asking everyone to do the same thing. I am asking us to make the work visible and decide who owns which tasks so the plan does not depend on one person.',
      },
      {
        title: 'Firm boundary script',
        body: 'If no one can take this task, then we need to price paid help. It cannot keep defaulting to me without a plan.',
      },
    ],
    redFlags: [
      'One person is the default for every task',
      'Siblings give advice but do not own tasks',
      'No one knows the actual caregiving hours',
      'Family argues about fairness without seeing the workload',
      'Money and time are mixed together',
      'No backup exists',
      'Primary caregiver is burning out',
      'Care needs are minimized to avoid responsibility',
    ],
    escalationRules: [
      'If the current plan is unsafe, safety comes before family fairness.',
      'If no one can own a task, price paid help or change the care plan.',
      'If legal authority or money control is part of the conflict, get qualified professional guidance.',
    ],
    summaryOutput: {
      title: 'Family Task Ownership Summary',
      includes: [
        'Current caregiver role',
        'Estimated caregiving hours',
        'Main family issue',
        'Tasks needing owners',
        'Specific sibling requests',
        'Paid help gaps',
        'Family meeting agenda',
        'Boundary script',
        'Review date',
      ],
      recommendedNextSteps: [
        'Use Caregiver Hours Calculator.',
        'Build Task Ownership Table.',
        'Use Family Care Budget Calculator if needed.',
        'Open Family Meeting Agenda.',
        'Generate Family Task Ownership Summary.',
      ],
      questionsToAsk: [
        'Which tasks are currently defaulting to one person?',
        'What specific task can each sibling own?',
        'What needs paid help if family help is unavailable?',
        'What is the backup plan?',
        'When will the family review whether the split is working?',
      ],
      defaultReviewDays: 14,
      reviewDateLabel: '14 days after task ownership plan is created',
    },
    relatedGuides: [
      { label: 'Family Meeting Agenda Template', href: '/care/guides/family-care-meeting-agenda-template/', reason: 'Run a structured family meeting.' },
      { label: 'Caregiver Hours Tracking Sheet', href: '/care/guides/caregiver-hours-tracking-sheet/', reason: 'Track hidden work.' },
      { label: 'Talk to Siblings About Sharing Care Costs', href: '/care/guides/talk-to-siblings-sharing-care-costs/', reason: 'Prepare cost-sharing language.' },
    ],
    reviewerType: ['Therapist', 'Caregiver support specialist', 'Geriatric care manager'],
    disclaimerType: 'mixed',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'share-care-costs',
    slug: 'share-care-costs',
    title: 'We Need to Talk About Sharing Care Costs',
    shortTitle: 'Share care costs',
    category: 'shared-costs',
    metaTitle: 'We Need to Talk About Sharing Care Costs - Family Budget Playbook',
    metaDescription:
      'Use this playbook to prepare a family conversation about senior care costs, parent income, shared expenses, caregiver reimbursement, unpaid care, and family contribution rules.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'We Need to Talk About Sharing Care Costs',
      subheading:
        'Use this playbook to organize the care budget, separate money from unpaid caregiving, create family contribution rules, and prepare a calmer cost conversation.',
      primaryCta: 'Start care cost conversation',
      secondaryCta: 'Build family care budget',
    },
    audience: [
      'Families preparing a care budget conversation.',
      'Caregivers paying out of pocket or seeking reimbursement.',
      'Siblings dividing money, unpaid time, paperwork, and backup roles.',
    ],
    triggerEvents: ['One person pays silently', 'Facility cost increase', 'Reimbursement dispute', 'Parent funds unclear', 'Shared budget needed'],
    riskTags: ['money_conflict', 'unequal_income', 'unequal_distance', 'family_payment_rule_needed', 'legal_authority_unclear'],
    safetyLevel: 'prompt',
    safetyBanner: {
      title: 'Scope note',
      body:
        'This playbook helps families organize care costs and contribution conversations. It does not provide legal, tax, financial, Medicaid, insurance, or estate planning advice.',
      emergencyInstruction: 'Confirm major payment decisions with qualified professionals.',
    },
    intakeQuestions: [
      { id: 'current_cost_known', label: 'Does the family know the current monthly care cost?', type: 'single_select', options: ['Yes', 'No', 'Roughly'] },
      {
        id: 'who_pays_now',
        label: 'Who is paying now?',
        type: 'multi_select',
        options: ['Parent income', 'Parent savings', 'One sibling', 'Multiple siblings', 'Long-term care insurance', 'Medicaid', 'VA benefits', 'Credit/debt', 'Not sure'],
      },
      {
        id: 'family_conflict_type',
        label: 'What is causing the cost conflict?',
        type: 'multi_select',
        options: [
          'Unequal income',
          'Unequal time',
          'One person pays silently',
          'One person provides unpaid care',
          'Sibling refuses to contribute',
          'No one knows the numbers',
          'Parent funds are unclear',
          'Reimbursement dispute',
          'Facility cost increase',
          'Not sure',
        ],
      },
      { id: 'receipts_tracked', label: 'Are receipts and reimbursements tracked?', type: 'boolean' },
      { id: 'unpaid_hours_tracked', label: 'Are unpaid caregiving hours tracked?', type: 'boolean' },
      { id: 'authority_clear', label: 'Is it clear who has authority to pay bills or access funds?', type: 'single_select', options: ['Yes', 'No', 'Not sure'] },
      {
        id: 'large_decision_pending',
        label: 'Is a large care decision pending?',
        type: 'multi_select',
        options: ['Home care', 'Assisted living', 'Memory care', 'Nursing home', 'Selling property', 'Medicaid planning', 'Paying a family caregiver', 'No', 'Not sure'],
      },
    ],
    actionSections: {
      now: [
        {
          id: 'build-full-cost-picture',
          title: 'Build the full monthly cost picture',
          body: 'List the full monthly cost, including care, supplies, transportation, medication, insurance, facility fees, home care, respite, and emergency costs.',
          cta: { label: 'Use Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', type: 'calculator' },
          completionType: 'tool_required',
          safetyTag: 'cost',
        },
        {
          id: 'separate-money-from-time',
          title: 'Separate money from time',
          body: 'Family members may contribute in different ways. Separate money, unpaid care hours, paperwork, transportation, and backup coverage.',
          cta: { label: 'Use Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'family',
        },
        {
          id: 'identify-who-pays-today',
          title: 'Identify who pays today',
          body: 'Write down who currently pays each recurring cost. Include parent income, parent savings, family payments, insurance, benefits, and informal reimbursements.',
          completionType: 'note',
          safetyTag: 'cost',
        },
      ],
      next24Hours: [
        {
          id: 'create-contribution-table',
          title: 'Create a contribution table',
          body: 'Make contributions visible. Fair does not always mean equal, but it should be clear: money, hours, owned task, backup role, and reimbursement owed.',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'create-no-surprise-spending-rule',
          title: 'Create a no-surprise spending rule',
          body: 'Set a dollar threshold for expenses that need group notice or approval before payment, unless urgent for health or safety.',
          completionType: 'note',
          safetyTag: 'cost',
        },
        {
          id: 'start-receipt-reimbursement-tracking',
          title: 'Start receipt and reimbursement tracking',
          body: 'If family members are paying out of pocket, track receipts, purpose, date, amount, and reimbursement status.',
          cta: { label: 'Open Caregiver Reimbursement Tracker', href: '/care/guides/caregiver-reimbursement-expense-tracking/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'document',
        },
      ],
      thisWeek: [
        {
          id: 'hold-cost-conversation',
          title: 'Hold a cost conversation with facts',
          body: 'Use the budget, unpaid hours, receipts, and contribution table to discuss the care plan. Avoid opening with accusation.',
          completionType: 'checkbox',
          safetyTag: 'family',
        },
        {
          id: 'classify-expenses',
          title: 'Decide what is shared, reimbursed, or contributed',
          body: 'Classify expenses into shared care cost, reimbursable expense, personal contribution, parent-paid cost, or professional-review item.',
          completionType: 'note',
          safetyTag: 'cost',
        },
        {
          id: 'set-budget-review',
          title: 'Set the next budget review',
          body: 'Review the family care budget every month, or sooner after a facility rate increase, care-level change, new home care schedule, hospital discharge, or insurance change.',
          completionType: 'note',
          safetyTag: 'cost',
        },
      ],
    },
    documentation: [
      { id: 'monthly_care_cost', label: 'Current monthly care cost', fieldType: 'number', requiredForSummary: true },
      { id: 'payment_sources', label: 'Current payment sources', fieldType: 'textarea', requiredForSummary: true },
      { id: 'family_contributions', label: 'Family contributions', fieldType: 'textarea' },
      { id: 'unpaid_hours', label: 'Unpaid caregiving hours', fieldType: 'number' },
      { id: 'reimbursement_rule', label: 'Reimbursement rule', fieldType: 'textarea' },
      { id: 'spending_threshold', label: 'No-surprise spending threshold', fieldType: 'text' },
      { id: 'professional_review_items', label: 'Items needing professional review', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'sibling-family-group',
        title: 'Sibling or family group',
        whenToCall: 'Call when the family needs to agree on shared costs, reimbursement, task ownership, or monthly budget review.',
        whatToSay:
          'I want us to review the full cost picture before anyone reacts. This includes paid care, supplies, transportation, unpaid hours, and what each person can realistically contribute.',
      },
      { id: 'financial-planner', title: 'Financial planner', whenToCall: 'Call when considering withdrawals, selling assets, paying care from savings, or long-term financial tradeoffs.' },
      { id: 'elder-law-attorney', title: 'Elder law attorney', whenToCall: 'Call when power of attorney, Medicaid planning, caregiver payment, property, facility contract responsibility, or reimbursement is unclear.' },
      { id: 'tax-professional', title: 'Tax professional', whenToCall: 'Call when HSA/FSA use, caregiver payment, dependent care, deductions, or reimbursement tax treatment is unclear.' },
    ],
    recommendedTools: [
      { name: 'Family Care Budget Calculator', href: '/care/family-care-budget-calculator/', reason: 'Build the shared monthly cost picture.', type: 'calculator', primary: true },
      { name: 'Senior Care Cost Calculator', href: '/care/senior-care-cost-calculator/', reason: 'Compare care-setting cost pressure.', type: 'calculator' },
      { name: 'Caregiver Hours Calculator', href: '/care/caregiver-hours-calculator/', reason: 'Count unpaid time separately from money.', type: 'calculator' },
      { name: 'Caregiver Reimbursement Tracker', href: '/care/guides/caregiver-reimbursement-expense-tracking/', reason: 'Track receipts and reimbursement status.', type: 'worksheet' },
      { name: 'Family Care Budget Worksheet', href: '/care/guides/family-care-budget-worksheet/', reason: 'Bring numbers into the family meeting.', type: 'worksheet' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'I am not assuming everyone can contribute the same way. But we need to see the real cost and decide what each person can own - money, time, paperwork, or backup.',
      },
      {
        title: 'Boundary script',
        body: 'I can keep helping, but I cannot keep paying expenses without a budget, receipts, and a reimbursement plan.',
      },
    ],
    redFlags: [
      'One person pays silently',
      'One caregiver provides unpaid care silently',
      'No one knows current monthly cost',
      'Receipts are not tracked',
      'Family contributions are vague',
      'Parent funds are used without clear authority',
      'Large care decisions are made without budget review',
      'Medicaid or tax issues are ignored',
    ],
    escalationRules: [
      'If payment authority is unclear, confirm legal authority before using someone else\'s funds.',
      'If Medicaid planning or paying a family caregiver is involved, get qualified professional guidance.',
      'If expenses keep changing, review the budget monthly or sooner after major care changes.',
    ],
    summaryOutput: {
      title: 'Family Care Cost Summary',
      includes: [
        'Monthly care cost',
        'Payment sources',
        'Family contributions',
        'Unpaid care hours',
        'Reimbursement rule',
        'Spending approval threshold',
        'Professional questions',
        'Next budget review date',
        'Family conversation script',
      ],
      recommendedNextSteps: [
        'Use Family Care Budget Calculator.',
        'Use Caregiver Hours Calculator.',
        'Open Reimbursement Tracker.',
        'Build Contribution Table.',
        'Generate Family Care Cost Summary.',
      ],
      questionsToAsk: [
        'What is the full monthly care cost?',
        'Who pays now?',
        'What is money, what is unpaid time, and what is paperwork?',
        'What expenses need approval or reimbursement?',
        'Which items need legal, tax, financial, insurance, or Medicaid review?',
      ],
      defaultReviewDays: 30,
      reviewDateLabel: 'Monthly, or sooner after a major cost change',
    },
    relatedGuides: [
      { label: 'Talk to Siblings About Sharing Care Costs', href: '/care/guides/talk-to-siblings-sharing-care-costs/', reason: 'Use cost conversation scripts.' },
      { label: 'Family Care Budget Worksheet', href: '/care/guides/family-care-budget-worksheet/', reason: 'Print the shared budget.' },
      { label: 'Caregiver Reimbursement Expense Tracking', href: '/care/guides/caregiver-reimbursement-expense-tracking/', reason: 'Track receipts and reimbursements.' },
    ],
    reviewerType: ['Financial planner', 'Elder law attorney', 'Tax professional where relevant'],
    disclaimerType: 'financial-legal-insurance-medicare',
    analyticsEvents: [...sharedAnalyticsEvents, 'documentation_log_started'],
  },
  {
    id: 'parent-should-not-be-driving',
    slug: 'parent-should-not-be-driving',
    title: 'A Parent Should Not Be Driving',
    shortTitle: 'Parent driving safety',
    category: 'driving-safety',
    metaTitle: 'A Parent Should Not Be Driving - Safety Conversation Playbook',
    metaDescription:
      'Use this playbook to document driving safety concerns, prepare a calmer conversation, involve professionals, create transportation alternatives, and decide when urgent action is needed.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'A Parent Should Not Be Driving',
      subheading:
        'Use this playbook to document driving concerns, reduce immediate risk, prepare a respectful conversation, involve the right professionals, and build transportation alternatives.',
      primaryCta: 'Start driving safety playbook',
      secondaryCta: 'Build transportation plan',
    },
    audience: [
      'Families worried about an older adult\'s driving safety.',
      'Caregivers documenting specific driving events before a conversation.',
      'Families trying to protect mobility while reducing road risk.',
    ],
    triggerEvents: ['Got lost driving', 'Crash or near-miss', 'New dents', 'Confusion while driving', 'Medication or vision concern', 'Dementia concern'],
    riskTags: ['driving_safety_concern', 'dementia_driving_concern', 'immediate_public_safety_risk', 'legal_authority_unclear'],
    safetyLevel: 'emergency-aware',
    safetyBanner: {
      title: 'Driving safety note',
      body:
        'If there is immediate danger on the road, a recent serious crash, getting lost, severe confusion, unsafe driving after a medical event, or risk to the public, prioritize safety and contact the appropriate emergency, medical, or licensing resource.',
      emergencyInstruction: 'This playbook does not determine driving fitness, legal capacity, or license status.',
    },
    intakeQuestions: [
      {
        id: 'driving_concern',
        label: 'What driving concerns have happened?',
        type: 'multi_select',
        options: [
          'Got lost',
          'New dents or scratches',
          'Recent crash',
          'Near-miss',
          'Traffic tickets',
          'Confused while driving',
          'Drives too slowly or unpredictably',
          'Trouble parking',
          'Vision concern',
          'Medication concern',
          'Dementia or memory concern',
          'Family feels unsafe riding with them',
          'Not sure',
        ],
      },
      { id: 'immediate_road_risk', label: 'Is there immediate road safety risk?', type: 'boolean', safetyCritical: true },
      { id: 'dementia_involved', label: 'Are dementia, memory, or judgment concerns involved?', type: 'boolean' },
      { id: 'recent_medical_change', label: 'Was there a recent medical event or medication change?', type: 'boolean' },
      {
        id: 'parent_response',
        label: 'How does the parent respond to driving concerns?',
        type: 'single_select',
        options: ['Open to discussion', 'Defensive', 'Denies concerns', 'Angry', 'Afraid of losing independence', 'Not discussed yet'],
      },
      {
        id: 'transportation_alternatives',
        label: 'Are transportation alternatives available?',
        type: 'multi_select',
        options: ['Family rides', 'Friends/neighbors', 'Rideshare', 'Public transit', 'Senior transportation', 'Medical transport', 'Grocery delivery', 'Not sure', 'None'],
      },
      { id: 'doctor_involved', label: 'Has a doctor or professional been involved?', type: 'boolean' },
    ],
    actionSections: {
      now: [
        {
          id: 'document-driving-events',
          title: 'Document specific driving events',
          body:
            'Avoid vague statements like "Dad is a bad driver." Write specific events: got lost, hit curb, new dents, wrong lane, confusion, near-miss, ticket, crash, or family no longer feels safe riding with them.',
          completionType: 'note',
          safetyTag: 'document',
          riskTags: ['driving_safety_concern'],
        },
        {
          id: 'check-immediate-road-risk',
          title: 'Check immediate risk',
          body:
            'If driving creates immediate danger, do not wait for the perfect family conversation. Involve the appropriate emergency, medical, licensing, or professional resource.',
          completionType: 'checkbox',
          safetyTag: 'emergency',
          riskTags: ['immediate_public_safety_risk'],
        },
        {
          id: 'identify-what-driving-provides',
          title: 'Identify what driving provides',
          body:
            'Driving is not only transportation. It may represent independence, privacy, control, social connection, and dignity. The replacement plan should protect as much of that as possible.',
          completionType: 'note',
          safetyTag: 'family',
        },
      ],
      next24Hours: [
        {
          id: 'build-transportation-replacement-list',
          title: 'Build a transportation replacement list',
          body: 'List practical alternatives for appointments, groceries, pharmacy, social visits, religious services, errands, and emergencies.',
          cta: { label: 'Open Transportation and Appointment Planning Guide', href: '/care/guides/transportation-and-appointment-planning-for-caregivers/', type: 'guide' },
          completionType: 'tool_required',
          safetyTag: 'care-plan',
        },
        {
          id: 'prepare-respectful-driving-conversation',
          title: 'Prepare a respectful conversation',
          body:
            'Open with shared goals: safety, independence, dignity, and practical transportation. Do not begin by saying "you can never drive again" unless immediate danger requires urgent action.',
          completionType: 'note',
          safetyTag: 'family',
        },
        {
          id: 'ask-clinician-driving',
          title: 'Ask a clinician to weigh in',
          body: 'If vision, cognition, medication, dizziness, reaction time, recent hospitalization, or dementia is involved, ask a clinician what should be evaluated.',
          completionType: 'optional',
          safetyTag: 'clinician',
        },
      ],
      thisWeek: [
        {
          id: 'try-limited-driving-adjustment',
          title: 'Try a limited driving adjustment if appropriate',
          body:
            'If there is no immediate danger and a professional agrees, the first step may be limiting driving: no night driving, no highways, no bad weather, no long distances, or only familiar local routes.',
          completionType: 'note',
          safetyTag: 'care-plan',
        },
        {
          id: 'create-no-drive-threshold',
          title: 'Create a no-drive threshold',
          body: 'Write the event that means driving stops or professional evaluation is required: getting lost again, another crash, another near-miss, or ongoing judgment concerns.',
          completionType: 'note',
          safetyTag: 'emergency',
        },
        {
          id: 'replace-one-recurring-trip',
          title: 'Replace one recurring driving need',
          body: 'Choose one recurring trip and replace it first: pharmacy, groceries, doctor appointments, or social visit.',
          completionType: 'checkbox',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'driving_events', label: 'Specific driving concerns or events', fieldType: 'textarea', requiredForSummary: true },
      { id: 'immediate_risk', label: 'Immediate road safety risk?', fieldType: 'select', options: ['Yes', 'No', 'Not sure'], requiredForSummary: true },
      { id: 'medical_or_memory_concerns', label: 'Medical, medication, vision, or memory concerns', fieldType: 'textarea' },
      { id: 'transportation_alternatives', label: 'Transportation alternatives', fieldType: 'textarea', requiredForSummary: true },
      { id: 'conversation_plan', label: 'Conversation plan', fieldType: 'textarea' },
      { id: 'no_drive_threshold', label: 'No-drive or evaluation threshold', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'doctor-clinician',
        title: 'Doctor or clinician',
        whenToCall: 'Call when there are medical, medication, vision, cognitive, dizziness, mobility, or recent hospitalization concerns.',
        whatToSay:
          'We have noticed specific driving concerns: ____. Could a medical, medication, vision, cognitive, or mobility issue be affecting driving safety?',
      },
      { id: 'local-transportation', title: 'Local transportation resource', whenToCall: 'Call when the family needs alternatives before asking the parent to reduce or stop driving.' },
      { id: 'licensing-agency', title: 'Licensing agency or DMV-equivalent', whenToCall: 'Call when there is serious road safety concern, dementia-related risk, repeated incidents, or professional reporting is needed. Requirements vary by state.' },
      { id: 'geriatric-care-manager', title: 'Geriatric care manager', whenToCall: 'Call when the family needs a neutral person to help assess transportation, safety, and resistance.' },
    ],
    recommendedTools: [
      { name: 'Care Needs Checklist', href: '/care/care-needs-checklist/', reason: 'Ground the driving conversation in current care needs.', type: 'calculator', primary: true },
      { name: 'Transportation and Appointment Planning Guide', href: '/care/guides/transportation-and-appointment-planning-for-caregivers/', reason: 'Build alternatives before reducing driving.', type: 'guide' },
      { name: 'Talk to Parent About Needing More Help', href: '/care/guides/how-to-talk-to-a-parent-about-needing-more-help/', reason: 'Use dignity-preserving language.', type: 'guide' },
      { name: 'Dementia Safety Playbook', href: '/care/playbooks/dementia-safety-getting-worse/', reason: 'Use if memory or judgment concerns are involved.', type: 'guide' },
      { name: 'Mind Reset', href: '/tracks/mind-reset/', reason: 'Reset before a sensitive conversation.', type: 'track' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are not trying to take away your independence. We are trying to make sure you can still get where you need to go without risking your safety or someone else\'s.',
      },
      {
        title: 'Firm safety script',
        body:
          'Because there has been [specific event], we cannot ignore this. Until we get professional guidance, we need to pause or limit driving and use other transportation.',
      },
    ],
    redFlags: [
      'Getting lost',
      'Recent crash',
      'Near-misses',
      'New dents or scratches',
      'Confusion while driving',
      'Driving after medication changes',
      'Family feels unsafe riding along',
      'Dementia or judgment concerns',
      'Unsafe night or highway driving',
      'Parent refuses discussion despite serious incidents',
    ],
    escalationRules: [
      'If there is immediate road danger, prioritize public safety over the perfect conversation.',
      'If dementia, medication, vision, or medical changes are involved, ask a clinician what should be evaluated.',
      'If driving continues after serious incidents, identify the appropriate licensing or professional resource in the state.',
    ],
    summaryOutput: {
      title: 'Driving Safety Conversation Plan',
      includes: [
        'Specific driving events',
        'Immediate risk assessment',
        'Medical or memory concerns',
        'Transportation alternatives',
        'Conversation script',
        'Professional contacts',
        'No-drive threshold',
        'Next review date',
      ],
      recommendedNextSteps: [
        'Document driving events.',
        'Build transportation alternatives.',
        'Prepare conversation script.',
        'Ask clinician if needed.',
        'Generate Driving Safety Conversation Plan.',
      ],
      questionsToAsk: [
        'What specific driving events have happened?',
        'Is there immediate road safety risk?',
        'Could medical, medication, vision, or memory changes be involved?',
        'What transportation alternatives can replace the riskiest trips?',
        'What event triggers professional evaluation or no driving?',
      ],
      defaultReviewDays: 7,
      reviewDateLabel: '7 days, or sooner after any driving incident',
    },
    relatedGuides: [
      { label: 'Transportation and Appointment Planning for Caregivers', href: '/care/guides/transportation-and-appointment-planning-for-caregivers/', reason: 'Build replacement rides.' },
      { label: 'Talk to a Parent About Needing More Help', href: '/care/guides/how-to-talk-to-a-parent-about-needing-more-help/', reason: 'Use dignity-preserving language.' },
      { label: 'Find Local Senior Care Resources', href: '/care/guides/find-local-senior-care-resources/', reason: 'Find local transportation and aging resources.' },
    ],
    reviewerType: ['Clinician', 'Geriatric care manager', 'Driving safety or occupational therapy specialist'],
    disclaimerType: 'health',
    analyticsEvents: [...sharedAnalyticsEvents, 'emergency_language_viewed', 'documentation_log_started'],
  },
  {
    id: 'document-facility-concern',
    slug: 'document-facility-concern',
    title: 'We Need to Document a Facility Concern',
    shortTitle: 'Document facility concern',
    category: 'facility-concern',
    metaTitle: 'Document a Facility Concern - Care Complaint Playbook',
    metaDescription:
      'Use this playbook to document concerns about assisted living, memory care, nursing home, rehab, or home care; prepare a clear request; and decide when to escalate.',
    hero: {
      eyebrow: 'Care Playbook',
      h1: 'We Need to Document a Facility Concern',
      subheading:
        'Use this playbook to record what happened, ask for a clear response, track follow-up, and decide whether to involve the facility, ombudsman, state agency, APS, Medicare, or emergency services.',
      primaryCta: 'Start concern log',
      secondaryCta: 'Open who-to-call guide',
    },
    audience: [
      'Families documenting concerns in assisted living, memory care, nursing home, rehab, hospital, or home care.',
      'Caregivers preparing a factual request for follow-up.',
      'Families deciding whether an ombudsman, state agency, APS, Medicare, or emergency route may be needed.',
    ],
    triggerEvents: ['Facility concern', 'Repeated issue', 'Resident rights concern', 'Discharge threat', 'Possible abuse or neglect', 'No clear response'],
    riskTags: ['facility_documentation_needed', 'ombudsman_possible', 'state_survey_possible', 'aps_possible', 'retaliation_fear'],
    safetyLevel: 'emergency-aware',
    safetyBanner: {
      title: 'Safety and escalation note',
      body:
        'If the resident is in immediate danger, has a medical emergency, may be experiencing abuse, neglect, exploitation, serious injury, or active harm, call emergency services or the appropriate urgent reporting resource now.',
      emergencyInstruction: 'This playbook helps with documentation and escalation. It does not replace emergency help, medical care, legal advice, APS, ombudsman support, or regulatory complaint processes.',
    },
    intakeQuestions: [
      {
        id: 'facility_type',
        label: 'What setting is involved?',
        type: 'single_select',
        options: ['Assisted living', 'Memory care', 'Nursing home', 'Short-term rehab', 'Home care agency', 'Hospital', 'Other', 'Not sure'],
      },
      {
        id: 'concern_type',
        label: 'What type of concern is this?',
        type: 'multi_select',
        options: [
          'Fall or injury',
          'Medication concern',
          'Hygiene or personal care',
          'Meals or hydration',
          'Call light / response delay',
          'Staff communication',
          'Billing',
          'Discharge threat',
          'Resident rights',
          'Dignity or respect',
          'Wandering or safety',
          'Possible abuse or neglect',
          'Retaliation fear',
          'Other',
        ],
      },
      { id: 'immediate_danger', label: 'Is the resident in immediate danger?', type: 'boolean', safetyCritical: true },
      { id: 'repeated_issue', label: 'Has this issue happened more than once?', type: 'boolean' },
      { id: 'facility_notified', label: 'Has the facility or agency already been notified?', type: 'boolean' },
      { id: 'response_received', label: 'Was a clear response or plan provided?', type: 'single_select', options: ['Yes', 'No', 'Partly', 'Not applicable yet'] },
      { id: 'resident_fears_retaliation', label: 'Does the resident fear retaliation or feel unsafe speaking up?', type: 'boolean' },
      { id: 'documentation_exists', label: 'Do you already have notes, photos, messages, invoices, or dates?', type: 'boolean' },
    ],
    actionSections: {
      now: [
        {
          id: 'check-immediate-facility-safety',
          title: 'Check immediate safety',
          body:
            'If someone is in immediate danger, seriously injured, being harmed, or needs urgent medical care, call emergency services or the appropriate urgent reporting resource first.',
          completionType: 'checkbox',
          safetyTag: 'emergency',
        },
        {
          id: 'write-concern-as-facts',
          title: 'Write the concern as facts',
          body:
            'Write what happened using dates, times, locations, names, visible impact, and what was or was not done. Avoid exaggeration. Specific facts are stronger than general frustration.',
          cta: { label: 'Open Care Facility Complaint Log', href: '/care/guides/care-facility-complaint-log/', type: 'worksheet' },
          completionType: 'tool_required',
          safetyTag: 'document',
          riskTags: ['facility_documentation_needed'],
        },
        {
          id: 'name-requested-outcome',
          title: 'Name the outcome you want',
          body:
            'Do not only document what went wrong. Write what you are asking for: care plan update, explanation, medication review, billing correction, fall review, staff follow-up, or written response.',
          completionType: 'note',
          safetyTag: 'document',
        },
      ],
      next24Hours: [
        {
          id: 'contact-closest-responsible-person',
          title: 'Contact the closest responsible person',
          body:
            'Start with the person closest to the problem when safe and appropriate: nurse, unit manager, care director, agency supervisor, administrator, billing office, or social worker.',
          completionType: 'checkbox',
          safetyTag: 'family',
        },
        {
          id: 'ask-written-follow-up',
          title: 'Ask for a written follow-up',
          body: 'Ask who owns the response, what will happen next, and when you should expect an update.',
          completionType: 'note',
          safetyTag: 'document',
        },
        {
          id: 'decide-escalation-needed',
          title: 'Decide whether escalation is needed',
          body:
            'If the issue involves resident rights, discharge threats, repeated unresolved concerns, fear of retaliation, abuse, neglect, exploitation, or serious safety issues, use the who-to-call path.',
          cta: { label: 'Open Who to Call for a Senior Care Concern', href: '/care/guides/who-to-call-care-concern/', type: 'guide' },
          completionType: 'optional',
          safetyTag: 'emergency',
        },
      ],
      thisWeek: [
        {
          id: 'track-issue-repeats',
          title: 'Track whether the issue repeats',
          body: 'A pattern is harder to dismiss than a single concern. Track whether the same issue happens again, who was notified, and whether the promised fix occurred.',
          completionType: 'note',
          safetyTag: 'document',
        },
        {
          id: 'contact-ombudsman-or-agency',
          title: 'Contact ombudsman or agency if unresolved',
          body:
            'If the facility does not respond, the resident fears retaliation, rights are involved, or the concern is serious or repeated, contact the Long-Term Care Ombudsman or appropriate agency.',
          completionType: 'optional',
          safetyTag: 'emergency',
        },
        {
          id: 'update-care-plan-after-concern',
          title: 'Update the care plan',
          body: 'If the concern reveals a care need change - falls, medication, wandering, hygiene, meals, staffing, or supervision - update the care plan and family summary.',
          cta: { label: 'Start Care Needs Checklist', href: '/care/care-needs-checklist/', type: 'calculator' },
          completionType: 'optional',
          safetyTag: 'care-plan',
        },
      ],
    },
    documentation: [
      { id: 'facility_name', label: 'Facility or agency name', fieldType: 'text', requiredForSummary: true },
      { id: 'resident_name_or_initials', label: 'Resident name or initials', fieldType: 'text' },
      { id: 'concern_date_time', label: 'Date and time of concern', fieldType: 'text', requiredForSummary: true },
      { id: 'location', label: 'Location', fieldType: 'text' },
      { id: 'concern_facts', label: 'What happened?', fieldType: 'textarea', requiredForSummary: true },
      { id: 'resident_impact', label: 'Impact on resident', fieldType: 'textarea' },
      { id: 'people_involved', label: 'People involved or witnesses', fieldType: 'textarea' },
      { id: 'reported_to', label: 'Who was notified?', fieldType: 'textarea' },
      { id: 'response_received', label: 'Response received', fieldType: 'textarea' },
      { id: 'requested_outcome', label: 'Requested outcome', fieldType: 'textarea', requiredForSummary: true },
      { id: 'escalation_plan', label: 'Escalation plan', fieldType: 'textarea' },
    ],
    whoToCall: [
      {
        id: 'facility-agency-supervisor',
        title: 'Facility or agency supervisor',
        whenToCall: 'Call when the concern is non-emergency and should be addressed by the care team, administrator, unit manager, care director, or agency supervisor.',
        whatToSay:
          'We are documenting a concern from [date/time]. Here is what happened, how it affected the resident, and what we are asking to be reviewed.',
      },
      {
        id: 'ombudsman',
        title: 'Long-Term Care Ombudsman',
        whenToCall: 'Call when resident rights, quality of life, discharge concerns, unresolved facility issues, family communication problems, or fear of retaliation are involved.',
        whatToSay: 'We are trying to resolve a facility concern involving [issue]. The resident may need help understanding rights and getting the concern addressed.',
      },
      {
        id: 'state-survey-agency',
        title: 'State Survey Agency',
        whenToCall: 'Call when a nursing home or regulated health facility quality complaint needs regulatory review.',
      },
      {
        id: 'aps-emergency',
        title: 'APS or emergency services',
        whenToCall: 'Use APS for suspected abuse, neglect, self-neglect, exploitation, or vulnerable adult harm. Use emergency services for immediate danger, serious injury, active harm, or urgent medical concern.',
      },
    ],
    recommendedTools: [
      { name: 'Care Facility Complaint Log', href: '/care/guides/care-facility-complaint-log/', reason: 'Document facts, response, and requested outcome.', type: 'worksheet', primary: true },
      { name: 'Who to Call for a Senior Care Concern', href: '/care/guides/who-to-call-care-concern/', reason: 'Choose the right escalation path.', type: 'guide' },
      { name: 'Long-Term Care Ombudsman Guide', href: '/care/guides/long-term-care-ombudsman/', reason: 'Use when rights, quality of life, or unresolved concerns are involved.', type: 'guide' },
      { name: 'How to Report Concerns About a Care Facility', href: '/care/guides/report-care-facility-concerns/', reason: 'Prepare a complaint path if unresolved.', type: 'guide' },
      { name: 'Care Needs Checklist', href: '/care/care-needs-checklist/', reason: 'Update care needs if the concern reveals a care-plan gap.', type: 'calculator' },
    ],
    scripts: [
      {
        title: 'Family script',
        body:
          'We are documenting this so we can be accurate, not adversarial. Here are the facts, who was notified, what response we received, and what we are asking to be changed.',
      },
      {
        title: 'Facility script',
        body: 'We want to resolve this constructively. Please document our concern, tell us who owns follow-up, and provide a written update by [date].',
      },
    ],
    redFlags: [
      'Facility refuses to document the concern',
      'Same problem repeats',
      'Resident fears retaliation',
      'Discharge is threatened verbally',
      'Medication or injury concern is minimized',
      'Family receives only vague reassurance',
      'Staff blame the resident instead of reviewing care',
      'Concern involves abuse, neglect, exploitation, or immediate danger',
      'No written follow-up is provided',
    ],
    escalationRules: [
      'If there is immediate danger, active harm, or urgent medical concern, use emergency services or the urgent reporting resource first.',
      'If resident rights, discharge threats, or fear of retaliation are involved, consider the Long-Term Care Ombudsman.',
      'If a regulated health facility quality complaint needs review, use the State Survey Agency or appropriate complaint pathway.',
    ],
    summaryOutput: {
      title: 'Facility Concern Summary',
      includes: [
        'Facility or agency name',
        'Concern type',
        'Date/time/location',
        'Facts documented',
        'Resident impact',
        'Who was notified',
        'Response received',
        'Requested outcome',
        'Escalation path',
        'Follow-up date',
        'Related guides/tools',
      ],
      recommendedNextSteps: [
        'Open Care Facility Complaint Log.',
        'Write facts and requested outcome.',
        'Contact closest responsible person.',
        'Open Who-to-Call Guide if unresolved.',
        'Generate Facility Concern Summary.',
      ],
      questionsToAsk: [
        'What happened, when, where, and who observed it?',
        'What impact did this have on the resident?',
        'Who was notified and what response was received?',
        'What specific outcome is being requested?',
        'What escalation path applies if the concern continues?',
      ],
      defaultReviewDays: 7,
      reviewDateLabel: '3-7 days after facility notification, or sooner if safety risk continues',
    },
    relatedGuides: [
      { label: 'Care Facility Complaint Log', href: '/care/guides/care-facility-complaint-log/', reason: 'Use a structured concern log.' },
      { label: 'Long-Term Care Ombudsman', href: '/care/guides/long-term-care-ombudsman/', reason: 'Understand ombudsman support.' },
      { label: 'How to Report Concerns About a Care Facility', href: '/care/guides/report-care-facility-concerns/', reason: 'Choose the complaint route.' },
    ],
    reviewerType: ['Ombudsman-informed reviewer', 'Elder law attorney', 'Clinician for safety-related issues'],
    disclaimerType: 'mixed',
    analyticsEvents: [...sharedAnalyticsEvents, 'emergency_language_viewed', 'documentation_log_started'],
  },
];

export const CARE_PLAYBOOKS_BY_SLUG: Record<string, CarePlaybook> = CARE_PLAYBOOKS.reduce<Record<string, CarePlaybook>>(
  (acc, playbook) => {
    acc[playbook.slug] = playbook;
    return acc;
  },
  {},
);

export function carePlaybookHref(playbookOrSlug: CarePlaybook | string): string {
  const slug = typeof playbookOrSlug === 'string' ? playbookOrSlug : playbookOrSlug.slug;
  return `/care/playbooks/${slug}/`;
}

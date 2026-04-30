import { BUSINESS_TRACK_OVERRIDES, BUSINESS_TRACKS } from './business-tracks';

export type TrackCategory = 'home' | 'property' | 'business' | 'care' | 'daily';

export type TrackStepType = 'calculator' | 'checklist' | 'guide' | 'comparison' | 'result';

export interface TrackStep {
  title: string;
  type: TrackStepType;
  href?: string;
  description: string;
  whyNow?: string;
  resultToWatch?: string[];
  ifResultLooksBad?: string;
  checkpoint?: string;
  relatedGuide?: TrackGuide;
  relatedTemplate?: TrackGuide;
  carryForward?: string;
}

export interface TrackGuide {
  title: string;
  href: string;
}

export interface TrackScoreState {
  range: string;
  state: string;
  meaning: string;
}

export interface TrackScoreVerdict {
  state: string;
  verdict: string;
}

export interface TrackScore {
  title: string;
  inputs: string[];
  states: TrackScoreState[];
  verdicts: TrackScoreVerdict[];
  summaryOutputs: string[];
}

export interface TrackNextLink {
  label: string;
  href: string;
  reason: string;
}

export interface TrackMonetizationRecommendation {
  condition: string;
  recommendation: string;
}

export interface TrackFinalPlan {
  estimate: string;
  riskFlags: string[];
  nextQuestions: string[];
  checklist: string[];
  recommendedNextCalculators: TrackGuide[];
}

export interface TrackSafety {
  notice: string;
  crisisNotice?: string;
}

export interface Track {
  slug: string;
  title: string;
  h1?: string;
  tagline?: string;
  promise?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  resultTitle: string;
  category: TrackCategory;
  vertical: string;
  goal: string;
  description: string;
  whoThisIsFor?: string[];
  decisions?: string[];
  beforeYouStart?: string[];
  reviewedBy: string[];
  duration: string;
  monetization: string[];
  steps: TrackStep[];
  finalPlan: TrackFinalPlan;
  recommendedGuides: TrackGuide[];
  commonMistakes: string[];
  methodology: string[];
  whatMostAdviceLeavesOut?: string;
  trackScore?: TrackScore;
  trackTemplates?: TrackGuide[];
  nextTracks?: TrackNextLink[];
  monetizationRecommendations?: TrackMonetizationRecommendation[];
  relatedSlugs: string[];
  keywords: string[];
  safety?: TrackSafety;
}

export const TRACK_CATEGORY_ORDER: TrackCategory[] = ['home', 'property', 'business', 'care', 'daily'];

export const TRACK_CATEGORY_LABELS: Record<TrackCategory, string> = {
  home: 'Home Tracks',
  property: 'Property Tracks',
  business: 'Business Tracks',
  care: 'Care Tracks',
  daily: 'Daily Tracks',
};

export const TRACK_CATEGORY_DESCRIPTIONS: Record<TrackCategory, string> = {
  home: 'High-intent home improvement plans for roof, HVAC, and remodel decisions.',
  property: 'Real estate plans for sale proceeds, closing math, ownership, and investing.',
  business: 'Guided operating paths for freelancing, pricing, hiring, tax reserves, revenue, S-corp, and software spend decisions.',
  care: 'Family care budgets, senior care planning, Medicare cost framing, and caregiving workload.',
  daily: 'Retention-friendly wellbeing tracks for sleep, stress, focus, and routine resets.',
};

const BASE_TRACKS: Track[] = [
  {
    slug: 'replace-my-roof',
    title: 'Replace My Roof',
    resultTitle: 'Your Roof Replacement Plan',
    category: 'home',
    vertical: 'Home',
    goal: 'Build a defensible roof replacement plan before you compare quotes or insurance numbers.',
    description:
      'Work through roof size, pitch, replacement cost, repair-vs-replace logic, insurance deductible exposure, and contractor quote questions.',
    reviewedBy: [
      'Approved by remodeling contractor review for scope, bid language, and quote risk',
      'Approved by engineering review for measurement, pitch, and range math',
      'Approved by scientific review for range framing and uncertainty language',
    ],
    duration: '15-25 minutes',
    monetization: ['roofing leads', 'contractor quote partners', 'insurance content', 'financing partners', 'display ads'],
    steps: [
      {
        title: 'Roof Size Calculator',
        type: 'calculator',
        href: '/homelab/roof-square-footage-calculator/',
        description: 'Estimate roof surface area from footprint, pitch, or direct measurements.',
      },
      {
        title: 'Roof Pitch Calculator',
        type: 'calculator',
        href: '/homelab/roof-pitch-calculator/',
        description: 'Convert rise/run into pitch, degree angle, and area multiplier.',
      },
      {
        title: 'Roof Replacement Cost Calculator',
        type: 'calculator',
        href: '/homelab/roof-replacement-cost-calculator/',
        description: 'Create a low, typical, and high cost range, then test roof-over, material-supply, installer-only, flashing, and scope-trim options.',
      },
      {
        title: 'Save on Roof Cost Guide',
        type: 'guide',
        href: '/guides/save-on-roof-replacement-cost/',
        description: 'Separate real savings from shortcuts that hide rot, break warranty, or move liability onto the homeowner.',
      },
      {
        title: 'Repair vs Replace Calculator',
        type: 'comparison',
        href: '/homelab/roof-repair-vs-replacement-calculator/',
        description: 'Compare roof age, leaks, damage, sale horizon, and insurance context.',
      },
      {
        title: 'Insurance Deductible Calculator',
        type: 'calculator',
        href: '/homelab/roof-insurance-deductible-calculator/',
        description: 'Estimate out-of-pocket exposure for flat or percentage deductibles.',
      },
      {
        title: 'Contractor Quote Checklist',
        type: 'checklist',
        href: '/homelab/methodology/',
        description: 'Check tear-off, decking, underlayment, flashing, warranty, ventilation, and exclusions.',
      },
      {
        title: 'Final Roof Replacement Plan',
        type: 'result',
        description: 'Summarize scope, range, insurance exposure, bid questions, and repair/replace recommendation.',
      },
    ],
    finalPlan: {
      estimate: 'Roof size, pitch-adjusted surface area, replacement range, and likely out-of-pocket exposure.',
      riskFlags: [
        'missing tear-off scope',
        'unclear decking allowance',
        'percentage deductible shock',
        'low bid without ventilation scope',
        'insurance scope missing required roof-system items',
      ],
      nextQuestions: [
        'What is included in the tear-off?',
        'How is decking priced?',
        'Which warranty is labor-backed?',
        'What happens if code upgrades are needed?',
        'Does the insurance scope include drip edge, starter, ridge cap, pipe boots, flashing, vents, access labor, and detach/reset items?',
      ],
      checklist: [
        'roof area',
        'pitch',
        'material tier',
        'insurance deductible',
        'scope omissions',
        'proof photos',
        'quote exclusions',
        'repair/replace signal',
      ],
      recommendedNextCalculators: [
        { title: 'New Roof ROI', href: '/homelab/new-roof-roi-calculator/' },
        { title: 'ACV vs RCV', href: '/homelab/acv-vs-rcv-calculator/' },
      ],
    },
    recommendedGuides: [
      { title: 'Save on Roof Replacement Cost', href: '/guides/save-on-roof-replacement-cost/' },
      { title: 'Roof-over vs Tear-off', href: '/guides/roof-over-vs-tear-off/' },
      { title: 'Buying Roofing Materials Yourself', href: '/guides/buy-roofing-materials-yourself/' },
      { title: 'Roof Hail and Wind Insurance Discounts', href: '/guides/roof-hail-wind-insurance-discounts/' },
      { title: 'Property Improve Methodology', href: '/homelab/methodology/' },
      { title: 'About the Reviewers', href: '/about-the-reviewers/' },
    ],
    commonMistakes: ['comparing quotes with different scopes', 'treating roof-over as safe without deck inspection', 'forgetting deductible cash flow', 'ignoring roof pitch labor impact'],
    methodology: ['Range-based estimating', 'Pitch and area multipliers', 'Contractor-scope review', 'Insurance out-of-pocket framing'],
    relatedSlugs: ['replace-my-hvac', 'plan-my-remodel'],
    keywords: ['replace my roof', 'roof replacement plan', 'roof replacement cost calculator', 'roof insurance deductible'],
  },
  {
    slug: 'replace-my-hvac',
    title: 'Replace My HVAC',
    resultTitle: 'Your HVAC Plan',
    category: 'home',
    vertical: 'Home',
    goal: 'Estimate replacement scope, efficiency tradeoffs, and repair-vs-replace logic before taking HVAC bids.',
    description:
      'Use home size, replacement cost, AC vs heat pump tradeoffs, ductwork, repair signals, and energy savings to structure an HVAC decision.',
    reviewedBy: [
      'Approved by remodeling contractor review for replacement scope and quote checklist assumptions',
      'Approved by engineering review for load-estimate framing and energy math boundaries',
      'Approved by scientific review for energy-savings and payback boundaries',
    ],
    duration: '12-20 minutes',
    monetization: ['HVAC leads', 'energy-efficiency offers', 'financing', 'home warranty partners', 'display ads'],
    steps: [
      {
        title: 'Home Size / Load Estimate',
        type: 'calculator',
        href: '/property/hvac-load-estimate/',
        description: 'Start with square footage, equipment path, duct scope, access, efficiency, and rough capacity flags.',
      },
      {
        title: 'HVAC Diagnosis Live Matrix',
        type: 'checklist',
        href: '/property/hvac-diagnosis-live-matrix/',
        description: 'Map dead AC, gas heat, electric heat, thermostat, and board symptoms before accepting a replacement scope.',
      },
      {
        title: 'HVAC Replacement Cost',
        type: 'calculator',
        href: '/property/hvac-replacement-cost/',
        description: 'Create a system replacement range for AC, furnace, heat pump, or combined equipment.',
      },
      {
        title: 'AC vs Heat Pump',
        type: 'comparison',
        href: '/property/heat-pump-cost/',
        description: 'Compare AC-only, full HVAC, and heat-pump paths with rebate and backup-heat questions.',
      },
      {
        title: 'Ductwork Cost',
        type: 'calculator',
        href: '/property/ductwork-cost/',
        description: 'Estimate whether duct repairs or replacement should be part of the quote.',
      },
      {
        title: 'Repair vs Replace',
        type: 'comparison',
        href: '/property/hvac-repair-vs-replace/',
        description: 'Weigh system age, repair cost, comfort issues, and upcoming replacement likelihood.',
      },
      {
        title: 'Energy Savings',
        type: 'calculator',
        href: '/property/energy-savings-estimate/',
        description: 'Estimate payback from higher efficiency and behavior-sensitive energy assumptions.',
      },
      {
        title: 'Final HVAC Plan',
        type: 'result',
        description: 'Summarize equipment path, range, savings, quote questions, and next-step recommendation.',
      },
    ],
    finalPlan: {
      estimate: 'Replacement range, likely equipment path, ductwork exposure, and energy savings payback frame.',
      riskFlags: [
        'undersized or oversized system',
        'ductwork excluded from quote',
        'unclear warranty labor term',
        'efficiency upgrade without payback',
        'replacement quote without symptom-to-measurement proof',
      ],
      nextQuestions: [
        'Was a load calculation performed?',
        'Are ducts included?',
        'What rebates apply?',
        'What is the backup heat plan?',
        'Which cheaper causes were ruled out before replacement was quoted?',
      ],
      checklist: [
        'home size',
        'current system age',
        'observed symptoms',
        'recent service or thermostat changes',
        'test readings',
        'duct condition',
        'equipment path',
        'rebate notes',
      ],
      recommendedNextCalculators: [
        { title: 'Home Energy Savings', href: '/property/energy-savings-estimate/' },
        { title: 'AC Replacement Cost', href: '/property/ac-replacement-cost/' },
        { title: 'Furnace Replacement Cost', href: '/property/furnace-replacement-cost/' },
      ],
    },
    recommendedGuides: [
      { title: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
      { title: 'Methodology', href: '/methodology/' },
    ],
    commonMistakes: ['buying tonnage by square footage alone', 'leaving ducts out of the decision', 'treating rebate value as guaranteed'],
    methodology: ['Load-estimate guardrails', 'Cost-range comparison', 'Repair threshold framing', 'Energy payback assumptions'],
    relatedSlugs: ['replace-my-roof', 'plan-my-remodel'],
    keywords: ['replace my hvac', 'hvac replacement plan', 'hvac replacement cost', 'heat pump cost'],
  },
  {
    slug: 'plan-my-remodel',
    title: 'Plan My Remodel',
    resultTitle: 'Your Remodel Plan',
    category: 'home',
    vertical: 'Home',
    goal: 'Turn a remodel idea into budget, material, labor, ROI, and contractor-scope questions.',
    description:
      'Choose a project type, estimate kitchen, bathroom, basement, or flooring cost, then build a quote checklist and timing plan.',
    reviewedBy: [
      'Approved by remodeling contractor review for scope, sequencing, and quote assumptions',
      'Approved by engineering review for deterministic budget and ROI framing',
      'Approved by scientific review for ROI and uncertainty language',
    ],
    duration: '15-25 minutes',
    monetization: ['remodeling leads', 'contractor quote partners', 'financing partners', 'materials partners', 'display ads'],
    steps: [
      {
        title: 'Project Type',
        type: 'checklist',
        href: '/homelab/#remodel',
        description: 'Choose kitchen, bathroom, basement, flooring, painting, siding, deck, or patio scope.',
      },
      {
        title: 'Kitchen / Bathroom / Basement Cost',
        type: 'calculator',
        href: '/homelab/#remodel',
        description: 'Estimate the main project range with size, finish level, and complexity.',
      },
      {
        title: 'Material Budget',
        type: 'calculator',
        href: '/homelab/#remodel',
        description: 'Separate visible finish choices from structural and labor costs.',
      },
      {
        title: 'Labor Estimate',
        type: 'calculator',
        href: '/homelab/#remodel',
        description: 'Frame labor exposure by trade count, access, demolition, and project sequencing.',
      },
      {
        title: 'ROI Estimate',
        type: 'calculator',
        href: '/homelab/new-roof-roi-calculator/',
        description: 'Estimate resale sensitivity and payback framing for the remodel scope.',
      },
      {
        title: 'Timeline Planner',
        type: 'checklist',
        href: '/homelab/#remodel',
        description: 'Capture lead times, permit needs, and the order work should happen in.',
      },
      {
        title: 'Contractor Quote Checklist',
        type: 'checklist',
        href: '/homelab/methodology/',
        description: 'Verify allowances, exclusions, change-order rules, schedule, warranty, and payment terms.',
      },
      {
        title: 'Final Remodel Plan',
        type: 'result',
        description: 'Summarize budget range, finish choices, labor risk, schedule risk, and bid questions.',
      },
    ],
    finalPlan: {
      estimate: 'Project budget, allowance list, labor-risk notes, schedule notes, and ROI framing.',
      riskFlags: ['allowances too low', 'hidden demolition risk', 'permit uncertainty', 'unclear payment schedule'],
      nextQuestions: ['What is allowance vs fixed scope?', 'Who pulls permits?', 'How are change orders priced?', 'What is the realistic start date?'],
      checklist: ['project type', 'finish tier', 'labor trades', 'timeline', 'permits', 'quote exclusions'],
      recommendedNextCalculators: [
        { title: 'Break-Even Calculator', href: '/calculators/break-even-calculator/' },
        { title: 'Property Improve', href: '/homelab/' },
      ],
    },
    recommendedGuides: [
      { title: 'Property Improve Remodel Roadmap', href: '/homelab/#remodel' },
      { title: 'Advertising Disclosure', href: '/advertising-disclosure/' },
    ],
    commonMistakes: ['treating allowances as final prices', 'forgetting permit and inspection time', 'not separating must-have and nice-to-have scope'],
    methodology: ['Project-type intake', 'Allowance review', 'Labor and sequencing flags', 'ROI and resale boundary notes'],
    relatedSlugs: ['replace-my-roof', 'replace-my-hvac'],
    keywords: ['plan my remodel', 'remodel plan', 'kitchen remodel cost', 'bathroom remodel cost'],
  },
  {
    slug: 'sell-my-home',
    title: 'Sell My Home',
    resultTitle: 'Your Home Sale Estimate',
    category: 'property',
    vertical: 'Property',
    goal: 'Estimate what you may actually net from a sale after commission, closing costs, payoff, and prep.',
    description:
      'Move from home value input to seller proceeds, commission, closing costs, prep ROI, net sheet, and final selling plan.',
    reviewedBy: [
      'Approved by realtor review for selling workflow and net-sheet assumptions',
      'Approved by engineering review for proceeds, commission, and payoff math',
      'Approved by scientific review for range and local-market limitation language',
    ],
    duration: '12-20 minutes',
    monetization: ['agent leads', 'title and escrow partners', 'moving services', 'home prep services', 'mortgage and refinance ads'],
    steps: [
      {
        title: 'Home Value Estimate Input',
        type: 'calculator',
        href: '/property/seller-proceeds-calculator/',
        description: 'Start with your expected sale price or range.',
      },
      {
        title: 'Seller Proceeds',
        type: 'calculator',
        href: '/property/seller-proceeds-calculator/',
        description: 'Estimate cash out after payoff, commission, closing costs, and concessions.',
      },
      {
        title: 'Commission Calculator',
        type: 'calculator',
        href: '/property/commission-calculator/',
        description: 'Compare commission structures and the net effect of each percentage point.',
      },
      {
        title: 'Closing Cost Calculator',
        type: 'calculator',
        href: '/property/closing-cost-calculator/',
        description: 'Estimate seller-side closing costs, credits, taxes, and fees.',
      },
      {
        title: 'Title, Tax, and Association Line Items',
        type: 'calculator',
        href: '/property/title-company-cost-calculator/',
        description: 'Break out title company cost, tax proration, resale certificate, dues, and transfer fees.',
      },
      {
        title: 'Home Sale Prep ROI',
        type: 'comparison',
        href: '/property/home-sale-prep-roi-calculator/',
        description: 'Compare prep costs against likely sale-price or time-on-market improvement.',
      },
      {
        title: 'Net Sheet',
        type: 'guide',
        href: '/property/net-sheet-calculator/',
        description: 'Bring the pieces together into an offer-by-offer net sheet.',
      },
      {
        title: 'Final Selling Plan',
        type: 'result',
        description: 'Summarize net proceeds, prep budget, commission effect, and listing questions.',
      },
    ],
    finalPlan: {
      estimate: 'Sale price range, payoff, commission, closing costs, prep budget, and expected net proceeds.',
      riskFlags: ['prep spend without ROI', 'concession assumptions missing', 'payoff estimate stale', 'tax and escrow timing unclear', 'missing resale certificate or association transfer fee'],
      nextQuestions: ['What price range is realistic?', 'What concessions are likely?', 'What repairs matter most?', 'What is the latest payoff quote?', 'Which title, tax proration, resale, and HOA fees apply?'],
      checklist: ['sale price', 'mortgage payoff', 'commission', 'title company cost', 'tax proration', 'resale certificate', 'association dues', 'association transfer fee', 'prep budget', 'net sheet'],
      recommendedNextCalculators: [
        { title: 'Mortgage Calculator', href: '/calculators/mortgage-calculator/' },
        { title: 'Rent vs Buy / Hold Horizon', href: '/finance/horizon-point/' },
        { title: 'Cash to Close', href: '/property/cash-to-close-calculator/' },
      ],
    },
    recommendedGuides: [
      { title: 'Property Lab', href: '/property/' },
      { title: 'Editorial Policy', href: '/editorial-policy/' },
    ],
    commonMistakes: ['looking only at sale price', 'forgetting payoff timing', 'over-improving before listing'],
    methodology: ['Net proceeds model', 'Commission sensitivity', 'Closing-cost range framing', 'Prep ROI assumptions'],
    relatedSlugs: ['replace-my-roof', 'plan-my-remodel'],
    keywords: ['sell my home', 'home sale estimate', 'seller proceeds calculator', 'net sheet calculator'],
  },
  {
    slug: 'start-freelancing',
    title: 'Start Freelancing',
    resultTitle: 'Your Freelance Pricing Plan',
    category: 'business',
    vertical: 'Business',
    goal: 'Set a freelance rate and tax plan that can survive overhead, downtime, and quarterly payments.',
    description:
      'Build from rate math to self-employment tax, quarterly tax, break-even needs, expenses, entity questions, and a final freelance plan.',
    reviewedBy: [
      'Approved by engineering review for deterministic pricing, margin, and break-even math',
      'Approved by scientific review for assumption framing and uncertainty language',
      'Approved for publication as educational business planning, not tax advice',
    ],
    duration: '12-20 minutes',
    monetization: ['business banking', 'accounting software', 'tax software', 'formation services', 'invoicing tools'],
    steps: [
      {
        title: 'Freelance Rate Calculator',
        type: 'calculator',
        href: '/calculators/minimum-viable-rate/',
        description: 'Convert salary goals, billable hours, overhead, and profit buffer into a minimum rate.',
      },
      {
        title: 'Self-Employment Tax',
        type: 'calculator',
        href: '/business/self-employed-tax-calculator/',
        description: 'Frame the extra payroll-tax burden and assumptions that need confirmation.',
      },
      {
        title: 'Quarterly Tax',
        type: 'calculator',
        href: '/business/quarterly-tax-estimate-calculator/',
        description: 'Estimate quarterly set-aside logic from income, profit, and tax assumptions.',
      },
      {
        title: 'Break-Even',
        type: 'calculator',
        href: '/calculators/break-even-calculator/',
        description: 'Find the revenue floor needed to cover fixed costs and owner pay.',
      },
      {
        title: 'Business Expense Budget',
        type: 'checklist',
        href: '/business/business-expense-budget-calculator/',
        description: 'List software, insurance, hardware, training, admin costs, and deduction support.',
      },
      {
        title: 'LLC vs S-Corp',
        type: 'comparison',
        href: '/business/llc-vs-s-corp-calculator/',
        description: 'Compare when entity structure may matter and what requires a professional review.',
      },
      {
        title: 'Deduction Risk Check',
        type: 'checklist',
        href: '/business/dangerous-deduction-checker/',
        description: 'Flag home office, vehicle, meals, travel, family payroll, and mixed-use deductions that need stronger support.',
      },
      {
        title: 'Final Freelance Plan',
        type: 'result',
        description: 'Summarize minimum rate, target rate, tax set-aside, break-even, and entity questions.',
      },
    ],
    finalPlan: {
      estimate: 'Minimum viable rate, target rate, monthly revenue floor, tax set-aside, and expense budget.',
      riskFlags: ['too few billable hours', 'tax set-aside missing', 'underpriced revisions', 'software costs ignored', 'entity savings modeled without admin drag'],
      nextQuestions: [
        'How many hours are actually billable?',
        'What tax set-aside is safe?',
        'Which expenses are recurring?',
        'Which deductions need better records before relying on them?',
        'When should an entity be reviewed?',
      ],
      checklist: ['salary target', 'billable hours', 'overhead', 'tax set-aside', 'deduction records', 'expense budget', 'pricing floor'],
      recommendedNextCalculators: [
        { title: 'Markup and Margin', href: '/calculators/markup-margin-calculator/' },
        { title: 'Revenue per Employee', href: '/calculators/revenue-per-head/' },
        { title: 'Self-Employed Deduction Finder', href: '/business/self-employed-deduction-finder/' },
      ],
    },
    recommendedGuides: [
      { title: 'Business Lab', href: '/business/' },
      { title: 'Methodology', href: '/methodology/' },
    ],
    commonMistakes: ['pricing against salary without overhead', 'forgetting downtime', 'mixing gross revenue with take-home pay'],
    methodology: ['Billable-hours model', 'Overhead and margin framing', 'Tax assumption disclosure', 'Break-even sensitivity'],
    relatedSlugs: ['sell-my-home'],
    keywords: ['start freelancing', 'freelance rate calculator', 'self employment tax calculator', 'quarterly tax calculator'],
  },
  {
    slug: 'plan-senior-care',
    title: 'Plan Senior Care',
    resultTitle: 'Your Senior Care Budget',
    category: 'care',
    vertical: 'Care',
    goal: 'Turn care needs into monthly cost, hours, facility comparisons, and family-budget questions.',
    description:
      'Move through needs, home care, assisted living, nursing home, caregiver hours, Medicare cost, and a family care budget.',
    reviewedBy: [
      'Approved by registered nurse review for care-safety wording and boundary language',
      'Approved by engineering review for monthly-budget and scenario math',
      'Approved by scientific review for limitation and coverage framing',
    ],
    duration: '15-25 minutes',
    monetization: ['senior care leads', 'home care agencies', 'assisted living referrals', 'insurance', 'financial planning'],
    steps: [
      {
        title: 'Care Needs Checklist',
        type: 'checklist',
        href: '/care/care-needs-checklist/',
        description: 'List daily activities, supervision needs, transportation, medication support, and safety flags.',
      },
      {
        title: 'Home Care Cost',
        type: 'calculator',
        href: '/care/home-care-cost-calculator/',
        description: 'Estimate home-care cost by hours per week and local hourly assumptions.',
      },
      {
        title: 'Assisted Living Cost',
        type: 'calculator',
        href: '/care/assisted-living-cost-calculator/',
        description: 'Compare facility monthly cost, add-ons, and move-in expenses.',
      },
      {
        title: 'Nursing Home Cost',
        type: 'calculator',
        href: '/care/nursing-home-cost-calculator/',
        description: 'Frame higher-acuity cost scenarios and duration sensitivity.',
      },
      {
        title: 'Caregiver Hours',
        type: 'calculator',
        href: '/care/caregiver-hours-calculator/',
        description: 'Estimate family and paid-care workload across a week.',
      },
      {
        title: 'Medicare Cost',
        type: 'calculator',
        href: '/care/medicare-cost-planner/',
        description: 'Capture premiums, likely out-of-pocket items, and what Medicare does not cover.',
      },
      {
        title: 'Family Care Budget',
        type: 'calculator',
        href: '/care/family-care-budget-calculator/',
        description: 'Bring paid care, unpaid hours, transportation, supplies, and insurance together.',
      },
      {
        title: 'Care Cost Reduction and Foreign Caregiver Options',
        type: 'guide',
        href: '/care/care-cost-reduction-planner/',
        description: 'Compare cost-reduction paths, household employment duties, and lawful foreign-caregiver constraints.',
      },
      {
        title: 'Final Senior Care Plan',
        type: 'result',
        description: 'Summarize monthly budget, hours, care setting questions, and provider questions.',
      },
    ],
    finalPlan: {
      estimate: 'Monthly care budget, weekly hours, setting comparison, and funding or insurance questions.',
      riskFlags: ['care hours underestimated', 'facility add-ons missing', 'family burnout risk', 'Medicare coverage misunderstood'],
      nextQuestions: ['What level of help is needed daily?', 'What costs are recurring?', 'What does insurance cover?', 'Who is available for unpaid care?'],
      checklist: ['care needs', 'home care cost', 'facility cost', 'caregiver hours', 'Medicare assumptions', 'family budget'],
      recommendedNextCalculators: [
        { title: 'Care Cost Reduction Planner', href: '/care/care-cost-reduction-planner/' },
        { title: 'Foreign Caregiver Options', href: '/care/foreign-caregiver-options/' },
      ],
    },
    recommendedGuides: [
      { title: 'Registered Nurse Review', href: '/registered-nurse-review/' },
      { title: 'Health Disclaimer', href: '/health-disclaimer/' },
    ],
    commonMistakes: ['under-counting supervision hours', 'assuming Medicare covers long-term care', 'ignoring caregiver burnout'],
    methodology: ['Care-needs intake', 'Monthly scenario budgeting', 'RN-reviewed boundary language', 'Coverage and cost separation'],
    relatedSlugs: ['mind-reset', 'sleep-reset'],
    keywords: ['plan senior care', 'senior care cost calculator', 'assisted living cost', 'family care budget'],
  },
  {
    slug: 'mind-reset',
    title: 'Mind Reset',
    resultTitle: 'Your Mind Reset Plan',
    category: 'daily',
    vertical: 'Care',
    goal: 'Understand stress, sleep, habits, and routines without turning reflection into diagnosis.',
    description:
      'Use check-ins, sleep timing, mood patterns, burnout reflection, screen time, habit planning, and grounding to build a daily reset plan.',
    reviewedBy: [
      'Approved by registered nurse review for safety wording and escalation language',
      'Approved by scientific review for habit, sleep, and stress-claim discipline',
      'Approved by engineering review for progress-state and workflow behavior',
    ],
    duration: '8-15 minutes',
    monetization: ['light display ads', 'newsletter/community retention', 'wellbeing guides'],
    safety: {
      notice: 'This track is for education, reflection, and habit planning. It does not diagnose, treat, or replace professional care.',
      crisisNotice:
        'If you may hurt yourself or someone else, or you feel in immediate danger, call emergency services. In the U.S., call or text 988 for the Suicide & Crisis Lifeline.',
    },
    steps: [
      {
        title: 'Stress Check-In',
        type: 'checklist',
        href: '/logic/decision-fatigue/',
        description: 'Name current stress load, decision load, and near-term pressure.',
      },
      {
        title: 'Sleep Debt Calculator',
        type: 'calculator',
        href: '/health/rem-sync/',
        description: 'Estimate sleep timing and possible sleep debt signals.',
      },
      {
        title: 'Mood Pattern Tracker',
        type: 'checklist',
        href: '/care/',
        description: 'Reflect on time of day, triggers, routines, and repeatable patterns.',
      },
      {
        title: 'Burnout Check-In',
        type: 'checklist',
        href: '/logic/decision-fatigue/',
        description: 'Separate temporary fatigue from sustained overload signals.',
      },
      {
        title: 'Screen Time Reflection',
        type: 'guide',
        href: '/logic/task-switching/',
        description: 'Estimate switching load and late-day attention drains.',
      },
      {
        title: 'Habit Reset Planner',
        type: 'checklist',
        href: '/logic/focus-horizon/',
        description: 'Pick one low-friction routine change for the next day.',
      },
      {
        title: 'Breathing / Grounding Timer',
        type: 'guide',
        href: '/health/',
        description: 'Use a brief grounding step as a non-medical pause.',
      },
      {
        title: 'When to Seek Help Guide',
        type: 'guide',
        href: '/health-disclaimer/',
        description: 'Know when reflection is not enough and a professional or urgent resource is appropriate.',
      },
      {
        title: 'Final Mind Reset Plan',
        type: 'result',
        description: 'Summarize stress signals, sleep target, habit reset, and when to seek help.',
      },
    ],
    finalPlan: {
      estimate: 'Stress load notes, sleep target, mood-pattern notes, screen-time reflection, and one reset action.',
      riskFlags: ['urgent safety concerns', 'severe or worsening distress', 'sleep disruption affecting safety', 'daily functioning declining'],
      nextQuestions: ['What changed recently?', 'What support is available today?', 'What routine can be reduced?', 'Is urgent help needed?'],
      checklist: ['stress check-in', 'sleep notes', 'mood pattern', 'screen time reflection', 'habit reset', 'help-seeking boundary'],
      recommendedNextCalculators: [
        { title: 'Sleep Timing', href: '/health/rem-sync/' },
        { title: 'Decision Fatigue', href: '/logic/decision-fatigue/' },
      ],
    },
    recommendedGuides: [
      { title: 'Health Disclaimer', href: '/health-disclaimer/' },
      { title: 'Registered Nurse Review', href: '/registered-nurse-review/' },
    ],
    commonMistakes: ['treating a check-in as a diagnosis', 'ignoring immediate safety concerns', 'trying to overhaul every habit at once'],
    methodology: ['Reflection-first framing', 'No diagnosis language', 'Crisis escalation notice', 'Nurse and scientist review boundaries'],
    relatedSlugs: ['sleep-reset', 'plan-senior-care'],
    keywords: ['mind reset', 'stress check in', 'burnout check in', 'habit reset planner'],
  },
  {
    slug: 'sleep-reset',
    title: 'Sleep Reset',
    resultTitle: 'Your Sleep Reset Plan',
    category: 'daily',
    vertical: 'Care',
    goal: 'Use sleep timing, fatigue signals, screen habits, and focus planning to build a small reset plan.',
    description:
      'Pair sleep-cycle timing with decision load, focus windows, task switching, and habit planning without making medical claims.',
    reviewedBy: [
      'Approved by registered nurse review for safety wording and sleep-health boundaries',
      'Approved by scientific review for claim discipline around sleep and routine changes',
      'Approved by engineering review for progress-state and workflow behavior',
    ],
    duration: '8-12 minutes',
    monetization: ['light display ads', 'newsletter/community retention', 'wellbeing guides'],
    safety: {
      notice: 'This track is for education, reflection, and habit planning. It does not diagnose, treat, or replace professional care.',
    },
    steps: [
      {
        title: 'Sleep Cycle Timing',
        type: 'calculator',
        href: '/health/rem-sync/',
        description: 'Pick a realistic bedtime or wake time and see sleep-window options.',
      },
      {
        title: 'Sleep Debt Reflection',
        type: 'checklist',
        href: '/health/rem-sync/',
        description: 'Compare planned sleep with actual sleep and recurring shortfalls.',
      },
      {
        title: 'Decision Load Check',
        type: 'calculator',
        href: '/logic/decision-fatigue/',
        description: 'Estimate how many decisions are draining the day.',
      },
      {
        title: 'Focus Reset',
        type: 'calculator',
        href: '/logic/focus-horizon/',
        description: 'Set a smaller next-day focus block that matches available energy.',
      },
      {
        title: 'Task Switching Reflection',
        type: 'comparison',
        href: '/logic/task-switching/',
        description: 'Spot avoidable context switching that may push bedtime later.',
      },
      {
        title: 'Habit Reset Planner',
        type: 'checklist',
        href: '/care/',
        description: 'Choose one sleep-supporting routine change for the next day.',
      },
      {
        title: 'Final Sleep Reset Plan',
        type: 'result',
        description: 'Summarize sleep window, fatigue signals, focus plan, and habit reset.',
      },
    ],
    finalPlan: {
      estimate: 'Sleep timing target, sleep-debt notes, focus window, and one routine adjustment.',
      riskFlags: ['sleepiness while driving or operating equipment', 'persistent severe insomnia', 'routine change is too large', 'screen habit moved too late'],
      nextQuestions: ['What bedtime is realistic?', 'What needs to move earlier?', 'What decision can be removed tomorrow?', 'What needs professional advice?'],
      checklist: ['sleep window', 'actual sleep notes', 'decision load', 'focus block', 'task switching', 'one habit reset'],
      recommendedNextCalculators: [
        { title: 'Sleep Timing', href: '/health/rem-sync/' },
        { title: 'Focus Horizon', href: '/logic/focus-horizon/' },
      ],
    },
    recommendedGuides: [
      { title: 'Health Disclaimer', href: '/health-disclaimer/' },
      { title: 'Scientific Review', href: '/scientific-review/' },
    ],
    commonMistakes: ['setting an unrealistic bedtime', 'changing too many routines at once', 'using a sleep tool as medical advice'],
    methodology: ['Sleep-window calculation', 'Habit-planning boundaries', 'No diagnosis language', 'Safety wording for high-risk fatigue'],
    relatedSlugs: ['mind-reset', 'plan-senior-care'],
    keywords: ['sleep reset', 'sleep debt calculator', 'sleep cycle timing', 'focus reset'],
  },
];

export const TRACKS: Track[] = [
  ...BASE_TRACKS.map((track) => {
    const override = BUSINESS_TRACK_OVERRIDES[track.slug];
    return override ? { ...track, ...override } : track;
  }),
  ...BUSINESS_TRACKS,
];

export const TRACKS_BY_SLUG: Record<string, Track | undefined> = Object.fromEntries(
  TRACKS.map((track) => [track.slug, track])
);

export const TRACK_GROUPS = [
  {
    category: 'property' as TrackCategory,
    id: 'property-tracks',
    label: 'Property Tracks',
    description: 'Property improvement, sale, ownership, and real-estate decision tracks.',
    tracks: TRACKS.filter((track) => track.category === 'home' || track.category === 'property'),
  },
  ...TRACK_CATEGORY_ORDER
    .filter((category) => category !== 'home' && category !== 'property')
    .map((category) => ({
      category,
      id: `${category}-tracks`,
      label: TRACK_CATEGORY_LABELS[category],
      description: TRACK_CATEGORY_DESCRIPTIONS[category],
      tracks: TRACKS.filter((track) => track.category === category),
    })),
];

export function trackHref(track: Pick<Track, 'slug'> | string): string {
  const slug = typeof track === 'string' ? track : track.slug;
  return `/tracks/${slug}/`;
}

export type VerticalArea = 'property' | 'business' | 'care';

export type BusinessRiskProfile =
  | 'federal-tax'
  | 'deduction-risk'
  | 's-corp'
  | 'payroll'
  | 'worker-classification'
  | 'cloud-saas';

export type VerticalCalculatorKind =
  | 'hvac-load'
  | 'hvac-cost'
  | 'hvac-repair'
  | 'hvac-diagnosis'
  | 'energy-savings'
  | 'seller-net'
  | 'buyer-cash'
  | 'commission-cost'
  | 'seller-closing-cost'
  | 'title-company-cost'
  | 'tax-proration'
  | 'association-cost'
  | 'home-sale-prep'
  | 'self-employment-tax'
  | 'quarterly-tax'
  | 'deduction-planner'
  | 's-corp'
  | 'freelance-rate'
  | 'margin-pricing'
  | 'break-even'
  | 'profit-plan'
  | 'contractor-employee'
  | 'hire-automate'
  | 'revenue-forecast'
  | 'sales-target'
  | 'churn'
  | 'subscription-pricing'
  | 'operating-leverage'
  | 'saas-cost'
  | 'cloud-cost'
  | 'seat-cost'
  | 'software-roi'
  | 'subscription-crossover'
  | 'cloud-exit'
  | 'care-cost'
  | 'caregiver-hours'
  | 'medicare-cost'
  | 'foreign-caregiver'
  | 'care-savings';

export interface CalculatorOption {
  label: string;
  value: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'checkbox';
  defaultValue: number | string | boolean;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  options?: CalculatorOption[];
  help?: string;
}

export interface VerticalContentSection {
  title: string;
  body: string;
  bullets?: string[];
}

export interface VerticalSource {
  label: string;
  href: string;
}

export interface VerticalLink {
  label: string;
  href: string;
  note?: string;
}

export interface VerticalCalculatorPage {
  slug: string;
  area: VerticalArea;
  group: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  summary: string;
  tagline?: string;
  promise?: string;
  bestFor?: string;
  optimizerGuide?: VerticalLink;
  whatIfGuide?: VerticalLink;
  fieldGuide?: VerticalLink;
  seoTargets?: string[];
  monetizationFit?: string[];
  riskProfile?: BusinessRiskProfile;
  sourceCheckedAt?: string;
  sourceScope?: string;
  kind: VerticalCalculatorKind;
  fields: CalculatorField[];
  assumptions: string[];
  sections: VerticalContentSection[];
  related: VerticalLink[];
  sources: VerticalSource[];
  healthDisclaimer?: boolean;
}

const hvacLoadFields: CalculatorField[] = [
  { id: 'sqft', label: 'Conditioned square feet', type: 'number', defaultValue: 2200, min: 300, max: 12000, step: 50, suffix: 'sq ft' },
  { id: 'ceilingHeight', label: 'Typical ceiling height', type: 'number', defaultValue: 8, min: 7, max: 16, step: 0.5, suffix: 'ft' },
  {
    id: 'climate',
    label: 'Climate pressure',
    type: 'select',
    defaultValue: 'hot-humid',
    options: [
      { label: 'Hot / humid', value: 'hot-humid' },
      { label: 'Hot / dry', value: 'hot-dry' },
      { label: 'Mixed climate', value: 'mixed' },
      { label: 'Cold heating-heavy', value: 'cold' },
    ],
  },
  {
    id: 'insulation',
    label: 'Insulation and air sealing',
    type: 'select',
    defaultValue: 'average',
    options: [
      { label: 'Poor / leaky / older house', value: 'poor' },
      { label: 'Average', value: 'average' },
      { label: 'Good / recently improved', value: 'good' },
    ],
  },
  {
    id: 'windows',
    label: 'Window and glass load',
    type: 'select',
    defaultValue: 'average',
    options: [
      { label: 'Few / shaded / efficient', value: 'low' },
      { label: 'Average', value: 'average' },
      { label: 'Many / west-facing / old glass', value: 'high' },
    ],
  },
  {
    id: 'sunExposure',
    label: 'Sun exposure',
    type: 'select',
    defaultValue: 'average',
    options: [
      { label: 'Shaded / low exposure', value: 'low' },
      { label: 'Average', value: 'average' },
      { label: 'Strong afternoon sun', value: 'high' },
    ],
  },
  {
    id: 'ductCondition',
    label: 'Duct and return-air condition',
    type: 'select',
    defaultValue: 'unknown',
    options: [
      { label: 'Good / sealed / enough returns', value: 'good' },
      { label: 'Unknown', value: 'unknown' },
      { label: 'Leaky, crushed, hot attic, or weak returns', value: 'poor' },
      { label: 'No usable ducts', value: 'none' },
    ],
    help: 'Bad ducts can make the old tonnage look wrong even when the real problem is airflow.',
  },
  { id: 'currentTonnage', label: 'Current equipment size, if known', type: 'number', defaultValue: 4, min: 0, max: 12, step: 0.5, suffix: 'tons' },
  { id: 'hotColdRooms', label: 'Rooms with comfort complaints', type: 'number', defaultValue: 2, min: 0, max: 20, step: 1 },
  {
    id: 'projectPath',
    label: 'Likely project path',
    type: 'select',
    defaultValue: 'central',
    options: [
      { label: 'Central AC / HVAC replacement', value: 'central' },
      { label: 'Heat pump conversion', value: 'heat-pump' },
      { label: 'Add mini-splits to problem rooms', value: 'mini-split' },
      { label: 'Duct fixes before equipment', value: 'duct-first' },
    ],
  },
];

const hvacCostFields: CalculatorField[] = [
  { id: 'sqft', label: 'Conditioned square feet', type: 'number', defaultValue: 2200, min: 300, max: 12000, step: 50, suffix: 'sq ft' },
  {
    id: 'currentSystem',
    label: 'Best description of the current setup',
    type: 'select',
    defaultValue: 'gas-furnace-ac',
    options: [
      { label: 'Not sure', value: 'unknown' },
      { label: 'Gas furnace + split AC', value: 'gas-furnace-ac' },
      { label: 'Heat pump + air handler', value: 'heat-pump-air-handler' },
      { label: 'AC only with usable blower/furnace', value: 'ac-only-usable-blower' },
      { label: 'No usable ducts', value: 'no-ducts' },
      { label: 'Existing mini-splits', value: 'existing-mini-splits' },
    ],
    help: 'A rough answer is fine. The point is to avoid replacing good furnace/blower/duct parts just because cooling failed.',
  },
  {
    id: 'equipment',
    label: 'Scope you want to price',
    type: 'select',
    defaultValue: 'full',
    options: [
      { label: 'Full HVAC system', value: 'full' },
      { label: 'Central AC only', value: 'ac' },
      { label: 'Furnace only', value: 'furnace' },
      { label: 'Heat pump', value: 'heat-pump' },
      { label: 'Ductless mini-split', value: 'mini-split' },
    ],
  },
  {
    id: 'failureMode',
    label: 'What the homeowner sees',
    type: 'select',
    defaultValue: 'cooling-dead',
    options: [
      { label: 'AC seems dead / outdoor unit silent or humming', value: 'cooling-dead' },
      { label: 'Blows warm or weak cooling', value: 'cooling-warm' },
      { label: 'Ice on lines or system freezes up', value: 'iced' },
      { label: 'Breaker trips or unit shuts off', value: 'breaker-trips' },
      { label: 'Water safety / drain issue shut it down', value: 'float-switch' },
      { label: 'Heat does not work or furnace acts up', value: 'heating-problem' },
      { label: 'Some rooms are hot/cold or humidity is bad', value: 'comfort-duct' },
      { label: 'Old but still running', value: 'old-running' },
      { label: 'Tech says compressor failed', value: 'compressor-shorted' },
      { label: 'Tech says coil or refrigerant leak', value: 'coil-leak' },
    ],
    help: 'Use symptoms and what you were told. You do not need to know the failed part.',
  },
  {
    id: 'refrigerant',
    label: 'Refrigerant label or tech claim',
    type: 'select',
    defaultValue: 'unknown',
    options: [
      { label: 'Unknown / not checked', value: 'unknown' },
      { label: 'R-22 / old Freon', value: 'r22' },
      { label: 'R-410A', value: 'r410a' },
      { label: 'Newer A2L system', value: 'a2l' },
    ],
    help: 'If the contractor says "Freon is phased out," choose R-22 only if they identified it on the unit or paperwork.',
  },
  {
    id: 'coilAge',
    label: 'Cooling coil / AC age if known',
    type: 'number',
    defaultValue: 16,
    min: 0,
    max: 40,
    step: 1,
    suffix: 'yrs',
    help: 'A best guess is enough. If unknown, use the age of the outdoor AC or the last major replacement.',
  },
  {
    id: 'quotePath',
    label: 'What the quote or tech says',
    type: 'select',
    defaultValue: 'no-quote',
    options: [
      { label: 'No quote yet', value: 'no-quote' },
      { label: 'Full system replacement', value: 'full' },
      { label: 'Replace outdoor AC / condenser and coil', value: 'condenser-coil' },
      { label: 'Compressor or major repair', value: 'compressor' },
      { label: 'Cheap service repair: capacitor, contactor, drain, thermostat, sensor', value: 'service-repair' },
      { label: 'Add mini-splits', value: 'mini-split-addon' },
      { label: 'Ductwork-heavy proposal', value: 'duct-heavy' },
    ],
    help: 'This is about what you were told, not what is actually true yet.',
  },
  {
    id: 'furnaceAge',
    label: 'Furnace / blower age if known',
    type: 'number',
    defaultValue: 8,
    min: 0,
    max: 40,
    step: 1,
    suffix: 'yrs',
    help: 'If heat worked well last winter, the furnace/blower may still be useful even when cooling failed.',
  },
  {
    id: 'zones',
    label: 'Mini-split zones or heads',
    type: 'number',
    defaultValue: 4,
    min: 1,
    max: 12,
    step: 1,
    suffix: 'zones',
    help: 'Mini-splits are planned by room/zone and BTU, not by pretending one wall head cools the whole home.',
  },
  {
    id: 'efficiency',
    label: 'Efficiency tier',
    type: 'select',
    defaultValue: 'standard',
    options: [
      { label: 'Standard', value: 'standard' },
      { label: 'High efficiency', value: 'high' },
      { label: 'Premium / variable speed', value: 'premium' },
    ],
  },
  {
    id: 'ducts',
    label: 'Ductwork scope',
    type: 'select',
    defaultValue: 'minor',
    options: [
      { label: 'No duct work', value: 'none' },
      { label: 'Sealing or minor repair', value: 'minor' },
      { label: 'Partial replacement', value: 'partial' },
      { label: 'Full replacement', value: 'full' },
    ],
  },
  {
    id: 'complexity',
    label: 'Install complexity',
    type: 'select',
    defaultValue: 'normal',
    options: [
      { label: 'Easy access', value: 'easy' },
      { label: 'Typical', value: 'normal' },
      { label: 'Tight attic / difficult access', value: 'hard' },
    ],
  },
  { id: 'rebate', label: 'Expected rebates or credits', type: 'number', defaultValue: 0, min: 0, max: 20000, step: 100, prefix: '$' },
];

const sellerNetFields: CalculatorField[] = [
  { id: 'salePrice', label: 'Expected sale price', type: 'number', defaultValue: 450000, min: 10000, max: 10000000, step: 5000, prefix: '$' },
  { id: 'mortgage', label: 'Mortgage payoff', type: 'number', defaultValue: 285000, min: 0, max: 10000000, step: 5000, prefix: '$' },
  { id: 'commissionPct', label: 'Total commission', type: 'number', defaultValue: 5.5, min: 0, max: 10, step: 0.1, suffix: '%' },
  { id: 'sellerClosingPct', label: 'Other seller closing costs', type: 'number', defaultValue: 1.2, min: 0, max: 5, step: 0.1, suffix: '%' },
  { id: 'titleCompany', label: 'Title / escrow company costs', type: 'number', defaultValue: 1450, min: 0, max: 25000, step: 50, prefix: '$' },
  { id: 'taxProration', label: 'Property tax proration credit', type: 'number', defaultValue: 3200, min: 0, max: 100000, step: 50, prefix: '$' },
  { id: 'resaleCertificate', label: 'Resale certificate', type: 'number', defaultValue: 375, min: 0, max: 5000, step: 25, prefix: '$' },
  { id: 'hoaDues', label: 'Association dues owed at closing', type: 'number', defaultValue: 450, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'hoaTransfer', label: 'Association transfer fee', type: 'number', defaultValue: 275, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'repairs', label: 'Repairs / credits / prep', type: 'number', defaultValue: 5000, min: 0, max: 500000, step: 500, prefix: '$' },
  { id: 'concessions', label: 'Buyer concessions', type: 'number', defaultValue: 0, min: 0, max: 500000, step: 500, prefix: '$' },
];

const buyerCashFields: CalculatorField[] = [
  { id: 'purchasePrice', label: 'Purchase price', type: 'number', defaultValue: 450000, min: 10000, max: 10000000, step: 5000, prefix: '$' },
  { id: 'downPct', label: 'Down payment', type: 'number', defaultValue: 10, min: 0, max: 100, step: 0.5, suffix: '%' },
  { id: 'loanClosingPct', label: 'Loan and closing costs', type: 'number', defaultValue: 2.5, min: 0, max: 8, step: 0.1, suffix: '%' },
  { id: 'titleCompany', label: 'Title / escrow company costs', type: 'number', defaultValue: 1700, min: 0, max: 25000, step: 50, prefix: '$' },
  { id: 'prepaids', label: 'Prepaids and reserves', type: 'number', defaultValue: 4200, min: 0, max: 100000, step: 100, prefix: '$' },
  { id: 'taxProration', label: 'Tax proration / escrow setup', type: 'number', defaultValue: 2600, min: 0, max: 100000, step: 100, prefix: '$' },
  { id: 'resaleCertificate', label: 'Resale certificate / association docs', type: 'number', defaultValue: 375, min: 0, max: 5000, step: 25, prefix: '$' },
  { id: 'hoaDues', label: 'Association dues due at closing', type: 'number', defaultValue: 450, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'hoaTransfer', label: 'Association transfer fee', type: 'number', defaultValue: 275, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'inspections', label: 'Appraisal / inspection / survey', type: 'number', defaultValue: 1400, min: 0, max: 10000, step: 50, prefix: '$' },
];

const commissionFields: CalculatorField[] = [
  { id: 'salePrice', label: 'Expected sale price', type: 'number', defaultValue: 450000, min: 10000, max: 10000000, step: 5000, prefix: '$' },
  { id: 'commissionPct', label: 'Total commission', type: 'number', defaultValue: 5.5, min: 0, max: 10, step: 0.1, suffix: '%' },
  { id: 'listingSidePct', label: 'Listing-side share', type: 'number', defaultValue: 2.75, min: 0, max: 5, step: 0.1, suffix: '%' },
  { id: 'buyerBrokerPct', label: 'Buyer-broker concession', type: 'number', defaultValue: 2.75, min: 0, max: 5, step: 0.1, suffix: '%' },
  { id: 'flatAdminFee', label: 'Broker/admin fee', type: 'number', defaultValue: 495, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'negotiatedSavingsPct', label: 'Negotiated reduction to test', type: 'number', defaultValue: 0.5, min: 0, max: 5, step: 0.1, suffix: '%' },
];

const sellerClosingFields: CalculatorField[] = [
  { id: 'salePrice', label: 'Expected sale price', type: 'number', defaultValue: 450000, min: 10000, max: 10000000, step: 5000, prefix: '$' },
  { id: 'sellerClosingPct', label: 'Percent-based seller costs', type: 'number', defaultValue: 1.2, min: 0, max: 5, step: 0.1, suffix: '%' },
  { id: 'titleCompany', label: 'Title / escrow company costs', type: 'number', defaultValue: 1450, min: 0, max: 25000, step: 50, prefix: '$' },
  { id: 'taxProration', label: 'Property tax proration', type: 'number', defaultValue: 3200, min: 0, max: 100000, step: 50, prefix: '$' },
  { id: 'resaleCertificate', label: 'Resale certificate / condo docs', type: 'number', defaultValue: 375, min: 0, max: 5000, step: 25, prefix: '$' },
  { id: 'hoaDues', label: 'Association dues / assessment payoff', type: 'number', defaultValue: 450, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'hoaTransfer', label: 'Association transfer fee', type: 'number', defaultValue: 275, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'payoffDemand', label: 'Payoff / wire / courier / recording', type: 'number', defaultValue: 325, min: 0, max: 10000, step: 25, prefix: '$' },
];

const titleCompanyFields: CalculatorField[] = [
  { id: 'settlementFee', label: 'Settlement / escrow fee', type: 'number', defaultValue: 750, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'titlePolicy', label: 'Owner/lender title policy estimate', type: 'number', defaultValue: 1850, min: 0, max: 50000, step: 50, prefix: '$' },
  { id: 'documentPrep', label: 'Document prep / notary', type: 'number', defaultValue: 225, min: 0, max: 5000, step: 25, prefix: '$' },
  { id: 'recordingRelease', label: 'Recording / release fees', type: 'number', defaultValue: 180, min: 0, max: 5000, step: 10, prefix: '$' },
  { id: 'wireCourier', label: 'Wire, courier, e-recording add-ons', type: 'number', defaultValue: 95, min: 0, max: 3000, step: 5, prefix: '$' },
  { id: 'endorsements', label: 'Endorsements / survey / misc', type: 'number', defaultValue: 250, min: 0, max: 10000, step: 25, prefix: '$' },
];

const taxProrationFields: CalculatorField[] = [
  { id: 'annualTaxes', label: 'Annual property taxes', type: 'number', defaultValue: 8200, min: 0, max: 250000, step: 100, prefix: '$' },
  { id: 'sellerOwnedDays', label: 'Seller-owned days this tax year', type: 'number', defaultValue: 210, min: 0, max: 366, step: 1, suffix: 'days' },
  {
    id: 'taxCustom',
    label: 'Local proration custom',
    type: 'select',
    defaultValue: 'seller-credit',
    options: [
      { label: 'Seller gives buyer credit at closing', value: 'seller-credit' },
      { label: 'Buyer reimburses seller for prepaid taxes', value: 'buyer-credit' },
      { label: 'Unknown / use as reminder only', value: 'unknown' },
    ],
  },
  { id: 'taxEscrowBuffer', label: 'Escrow/timing buffer', type: 'number', defaultValue: 350, min: 0, max: 10000, step: 25, prefix: '$' },
];

const associationFields: CalculatorField[] = [
  { id: 'resaleCertificate', label: 'Resale certificate / condo package', type: 'number', defaultValue: 375, min: 0, max: 5000, step: 25, prefix: '$' },
  { id: 'hoaTransfer', label: 'Association transfer fee', type: 'number', defaultValue: 275, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'hoaDues', label: 'Dues owed / prepaid at closing', type: 'number', defaultValue: 450, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'specialAssessment', label: 'Special assessment / violation payoff', type: 'number', defaultValue: 0, min: 0, max: 100000, step: 50, prefix: '$' },
  { id: 'rushFee', label: 'Rush, estoppel, or questionnaire fee', type: 'number', defaultValue: 95, min: 0, max: 5000, step: 5, prefix: '$' },
];

const homeSalePrepFields: CalculatorField[] = [
  { id: 'salePrice', label: 'Expected sale price', type: 'number', defaultValue: 450000, min: 10000, max: 10000000, step: 5000, prefix: '$' },
  {
    id: 'marketTemperature',
    label: 'Market temperature',
    type: 'select',
    defaultValue: 'balanced',
    options: [
      { label: 'Seller-favorable / low inventory', value: 'hot' },
      { label: 'Balanced', value: 'balanced' },
      { label: 'Buyer-favorable / lots of choices', value: 'cold' },
    ],
    help: 'Cosmetic prep matters more when buyers have alternatives. In a hot market, over-prepping can waste money.',
  },
  {
    id: 'homeCondition',
    label: 'Current showing condition',
    type: 'select',
    defaultValue: 'average',
    options: [
      { label: 'Rough / distracting defects', value: 'rough' },
      { label: 'Average lived-in', value: 'average' },
      { label: 'Clean but dated', value: 'clean-dated' },
      { label: 'Already updated', value: 'updated' },
    ],
  },
  { id: 'daysToList', label: 'Days until listing', type: 'number', defaultValue: 30, min: 1, max: 365, step: 1, suffix: 'days' },
  { id: 'cleanDeclutterCost', label: 'Deep clean / declutter / junk haul', type: 'number', defaultValue: 1200, min: 0, max: 50000, step: 100, prefix: '$' },
  { id: 'paintTouchupCost', label: 'Paint touch-up or neutral rooms', type: 'number', defaultValue: 2500, min: 0, max: 100000, step: 100, prefix: '$' },
  { id: 'flooringRepairCost', label: 'Flooring repair / carpet replacement', type: 'number', defaultValue: 1800, min: 0, max: 100000, step: 100, prefix: '$' },
  { id: 'landscapeCurbCost', label: 'Curb appeal / landscape cleanup', type: 'number', defaultValue: 900, min: 0, max: 50000, step: 100, prefix: '$' },
  { id: 'stagingPhotoCost', label: 'Staging / photo prep / lighting', type: 'number', defaultValue: 1600, min: 0, max: 50000, step: 100, prefix: '$' },
  { id: 'fixturesHardwareCost', label: 'Cheap visible swaps: lights, pulls, faucets', type: 'number', defaultValue: 850, min: 0, max: 50000, step: 50, prefix: '$' },
  { id: 'kitchenBathRefreshCost', label: 'Kitchen/bath refresh or mini-remodel', type: 'number', defaultValue: 0, min: 0, max: 250000, step: 500, prefix: '$' },
  { id: 'knownRepairBlockers', label: 'Safety, lender, insurance, or inspection blockers', type: 'number', defaultValue: 3500, min: 0, max: 250000, step: 500, prefix: '$', help: 'Think active leak, missing handrail, bad HVAC, electrical issue, broken window, rotten exterior wood, or lender-required repair.' },
  { id: 'avoidedConcessions', label: 'Concessions you expect to avoid', type: 'number', defaultValue: 2500, min: 0, max: 250000, step: 500, prefix: '$' },
];

const seTaxFields: CalculatorField[] = [
  { id: 'revenue', label: 'Annual self-employed revenue', type: 'number', defaultValue: 120000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'expenses', label: 'Ordinary business expenses', type: 'number', defaultValue: 25000, min: 0, max: 10000000, step: 500, prefix: '$' },
  { id: 'w2Wages', label: 'Other W-2 wages this year', type: 'number', defaultValue: 0, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'federalRate', label: 'Federal income tax reserve', type: 'number', defaultValue: 18, min: 0, max: 50, step: 0.5, suffix: '%' },
  { id: 'stateRate', label: 'State/local tax reserve', type: 'number', defaultValue: 0, min: 0, max: 15, step: 0.25, suffix: '%' },
  { id: 'retirement', label: 'Retirement contribution estimate', type: 'number', defaultValue: 0, min: 0, max: 500000, step: 500, prefix: '$' },
  { id: 'healthInsurance', label: 'Self-employed health insurance', type: 'number', defaultValue: 0, min: 0, max: 100000, step: 500, prefix: '$' },
  { id: 'qbi', label: 'Estimate QBI deduction', type: 'checkbox', defaultValue: true, help: 'Rough estimate only. Phaseouts and specified-service rules can change the actual deduction.' },
];

const freelanceRateFields: CalculatorField[] = [
  { id: 'targetTakeHome', label: 'Desired annual take-home', type: 'number', defaultValue: 90000, min: 0, max: 5000000, step: 1000, prefix: '$' },
  { id: 'businessExpenses', label: 'Annual business expenses', type: 'number', defaultValue: 18000, min: 0, max: 1000000, step: 500, prefix: '$' },
  { id: 'taxReservePct', label: 'Tax reserve', type: 'number', defaultValue: 28, min: 0, max: 60, step: 1, suffix: '%' },
  { id: 'billableHoursPerWeek', label: 'Billable hours per week', type: 'number', defaultValue: 20, min: 1, max: 80, step: 1, suffix: 'hrs' },
  { id: 'workWeeks', label: 'Working weeks per year', type: 'number', defaultValue: 46, min: 1, max: 52, step: 1 },
  { id: 'profitReservePct', label: 'Profit / slow-month reserve', type: 'number', defaultValue: 10, min: 0, max: 50, step: 1, suffix: '%' },
  { id: 'discountPct', label: 'Discount or unpaid scope creep to protect against', type: 'number', defaultValue: 8, min: 0, max: 50, step: 1, suffix: '%' },
];

const marginPricingFields: CalculatorField[] = [
  { id: 'price', label: 'Current price', type: 'number', defaultValue: 1500, min: 0, max: 1000000, step: 50, prefix: '$' },
  { id: 'directCost', label: 'Direct cost / delivery cost', type: 'number', defaultValue: 650, min: 0, max: 1000000, step: 25, prefix: '$' },
  { id: 'overheadShare', label: 'Overhead share per sale/project', type: 'number', defaultValue: 250, min: 0, max: 1000000, step: 25, prefix: '$' },
  { id: 'discountPct', label: 'Discount to test', type: 'number', defaultValue: 10, min: 0, max: 90, step: 1, suffix: '%' },
  { id: 'targetMarginPct', label: 'Target gross margin', type: 'number', defaultValue: 35, min: 0, max: 95, step: 1, suffix: '%' },
];

const breakEvenFields: CalculatorField[] = [
  { id: 'fixedMonthly', label: 'Fixed monthly costs', type: 'number', defaultValue: 8500, min: 0, max: 5000000, step: 250, prefix: '$' },
  { id: 'ownerPay', label: 'Owner pay needed', type: 'number', defaultValue: 8000, min: 0, max: 5000000, step: 250, prefix: '$' },
  { id: 'averageSale', label: 'Average sale / client value', type: 'number', defaultValue: 2500, min: 1, max: 5000000, step: 100, prefix: '$' },
  { id: 'variableCostPct', label: 'Variable cost percentage', type: 'number', defaultValue: 28, min: 0, max: 95, step: 1, suffix: '%' },
  { id: 'cashReserve', label: 'Monthly cash reserve goal', type: 'number', defaultValue: 1500, min: 0, max: 5000000, step: 100, prefix: '$' },
];

const profitPlanFields: CalculatorField[] = [
  { id: 'revenue', label: 'Monthly revenue', type: 'number', defaultValue: 42000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'directCostPct', label: 'Direct cost percentage', type: 'number', defaultValue: 32, min: 0, max: 95, step: 1, suffix: '%' },
  { id: 'operatingExpenses', label: 'Operating expenses', type: 'number', defaultValue: 11000, min: 0, max: 10000000, step: 500, prefix: '$' },
  { id: 'ownerPay', label: 'Owner pay', type: 'number', defaultValue: 8500, min: 0, max: 10000000, step: 500, prefix: '$' },
  { id: 'taxReservePct', label: 'Tax reserve on profit', type: 'number', defaultValue: 25, min: 0, max: 60, step: 1, suffix: '%' },
  { id: 'retainedProfitGoal', label: 'Retained profit goal', type: 'number', defaultValue: 5000, min: 0, max: 10000000, step: 250, prefix: '$' },
];

const hireAutomateFields: CalculatorField[] = [
  { id: 'taskHoursWeek', label: 'Hours of work per week', type: 'number', defaultValue: 18, min: 0, max: 168, step: 1, suffix: 'hrs' },
  { id: 'ownerHourlyValue', label: 'Value of owner / team hour', type: 'number', defaultValue: 95, min: 0, max: 2000, step: 5, prefix: '$' },
  { id: 'employeeMonthlyCost', label: 'Employee monthly loaded cost', type: 'number', defaultValue: 7200, min: 0, max: 1000000, step: 250, prefix: '$' },
  { id: 'contractorHourlyRate', label: 'Contractor hourly rate', type: 'number', defaultValue: 85, min: 0, max: 2000, step: 5, prefix: '$' },
  { id: 'automationMonthlyCost', label: 'Automation / software monthly cost', type: 'number', defaultValue: 900, min: 0, max: 1000000, step: 50, prefix: '$' },
  { id: 'automationSetupCost', label: 'Automation setup cost', type: 'number', defaultValue: 6000, min: 0, max: 1000000, step: 250, prefix: '$' },
  { id: 'automationCoveragePct', label: 'Work automation can truly remove', type: 'number', defaultValue: 45, min: 0, max: 100, step: 5, suffix: '%' },
  { id: 'reviewHoursWeek', label: 'Review / babysitting hours after automation', type: 'number', defaultValue: 4, min: 0, max: 80, step: 1, suffix: 'hrs' },
];

const revenueForecastFields: CalculatorField[] = [
  { id: 'currentMonthlyRevenue', label: 'Current monthly revenue', type: 'number', defaultValue: 35000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'newLeads', label: 'New leads per month', type: 'number', defaultValue: 40, min: 0, max: 100000, step: 1 },
  { id: 'closeRatePct', label: 'Close rate', type: 'number', defaultValue: 18, min: 0, max: 100, step: 1, suffix: '%' },
  { id: 'averageDeal', label: 'Average new deal value', type: 'number', defaultValue: 2800, min: 0, max: 10000000, step: 100, prefix: '$' },
  { id: 'churnPct', label: 'Monthly lost revenue / churn', type: 'number', defaultValue: 6, min: 0, max: 100, step: 0.5, suffix: '%' },
  { id: 'collectionDelayDays', label: 'Collection delay', type: 'number', defaultValue: 30, min: 0, max: 180, step: 5, suffix: 'days' },
];

const salesTargetFields: CalculatorField[] = [
  { id: 'revenueGoal', label: 'Monthly revenue goal', type: 'number', defaultValue: 60000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'currentRevenue', label: 'Current monthly revenue', type: 'number', defaultValue: 35000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'averageDeal', label: 'Average deal value', type: 'number', defaultValue: 3000, min: 1, max: 10000000, step: 100, prefix: '$' },
  { id: 'leadToProposalPct', label: 'Lead to proposal rate', type: 'number', defaultValue: 35, min: 1, max: 100, step: 1, suffix: '%' },
  { id: 'proposalClosePct', label: 'Proposal close rate', type: 'number', defaultValue: 30, min: 1, max: 100, step: 1, suffix: '%' },
  { id: 'salesCycleWeeks', label: 'Sales cycle', type: 'number', defaultValue: 4, min: 0, max: 52, step: 1, suffix: 'weeks' },
];

const churnFields: CalculatorField[] = [
  { id: 'currentRevenue', label: 'Recurring monthly revenue', type: 'number', defaultValue: 50000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'churnPct', label: 'Monthly churn / lost revenue', type: 'number', defaultValue: 5, min: 0, max: 100, step: 0.5, suffix: '%' },
  { id: 'expansionPct', label: 'Expansion / upsell offset', type: 'number', defaultValue: 2, min: 0, max: 100, step: 0.5, suffix: '%' },
  { id: 'newRevenue', label: 'New monthly recurring revenue', type: 'number', defaultValue: 6500, min: 0, max: 10000000, step: 500, prefix: '$' },
  { id: 'averageCustomerRevenue', label: 'Average customer monthly revenue', type: 'number', defaultValue: 900, min: 1, max: 10000000, step: 50, prefix: '$' },
];

const subscriptionPricingFields: CalculatorField[] = [
  { id: 'subscribers', label: 'Subscribers / accounts', type: 'number', defaultValue: 250, min: 0, max: 10000000, step: 10 },
  { id: 'monthlyPrice', label: 'Monthly price', type: 'number', defaultValue: 39, min: 0, max: 100000, step: 1, prefix: '$' },
  { id: 'annualDiscountPct', label: 'Annual-plan discount', type: 'number', defaultValue: 15, min: 0, max: 80, step: 1, suffix: '%' },
  { id: 'grossMarginPct', label: 'Gross margin', type: 'number', defaultValue: 72, min: 0, max: 100, step: 1, suffix: '%' },
  { id: 'churnPct', label: 'Monthly churn', type: 'number', defaultValue: 4, min: 0, max: 100, step: 0.5, suffix: '%' },
  { id: 'acquisitionCost', label: 'Acquisition cost per customer', type: 'number', defaultValue: 180, min: 0, max: 100000, step: 10, prefix: '$' },
];

const operatingLeverageFields: CalculatorField[] = [
  { id: 'revenue', label: 'Current monthly revenue', type: 'number', defaultValue: 80000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'fixedCosts', label: 'Fixed monthly costs', type: 'number', defaultValue: 38000, min: 0, max: 10000000, step: 1000, prefix: '$' },
  { id: 'variableCostPct', label: 'Variable cost percentage', type: 'number', defaultValue: 35, min: 0, max: 95, step: 1, suffix: '%' },
  { id: 'revenueGrowthPct', label: 'Revenue growth scenario', type: 'number', defaultValue: 25, min: -90, max: 500, step: 1, suffix: '%' },
  { id: 'fixedCostGrowthPct', label: 'Fixed cost growth scenario', type: 'number', defaultValue: 8, min: -90, max: 500, step: 1, suffix: '%' },
];

const saasCostFields: CalculatorField[] = [
  { id: 'baseToolsMonthly', label: 'Base tool subscriptions per month', type: 'number', defaultValue: 2200, min: 0, max: 10000000, step: 100, prefix: '$' },
  { id: 'seats', label: 'Paid seats', type: 'number', defaultValue: 28, min: 0, max: 100000, step: 1 },
  { id: 'pricePerSeat', label: 'Average seat price', type: 'number', defaultValue: 42, min: 0, max: 10000, step: 1, prefix: '$' },
  { id: 'unusedSeatPct', label: 'Inactive / unnecessary seats', type: 'number', defaultValue: 22, min: 0, max: 100, step: 1, suffix: '%' },
  { id: 'duplicateToolsMonthly', label: 'Duplicate or overlapping tools per month', type: 'number', defaultValue: 450, min: 0, max: 1000000, step: 50, prefix: '$' },
  { id: 'priceIncreasePct', label: 'Annual price increase to test', type: 'number', defaultValue: 10, min: 0, max: 100, step: 1, suffix: '%' },
];

const cloudCostFields: CalculatorField[] = [
  { id: 'computeMonthly', label: 'Compute / app runtime per month', type: 'number', defaultValue: 1800, min: 0, max: 10000000, step: 100, prefix: '$' },
  { id: 'storageMonthly', label: 'Storage / database per month', type: 'number', defaultValue: 750, min: 0, max: 10000000, step: 50, prefix: '$' },
  { id: 'dataTransferMonthly', label: 'Data transfer / overages per month', type: 'number', defaultValue: 350, min: 0, max: 10000000, step: 50, prefix: '$' },
  { id: 'environments', label: 'Active environments', type: 'number', defaultValue: 3, min: 1, max: 100, step: 1 },
  { id: 'growthPct', label: 'Usage growth scenario', type: 'number', defaultValue: 25, min: -90, max: 500, step: 1, suffix: '%' },
  { id: 'overrunPct', label: 'Surprise overrun buffer', type: 'number', defaultValue: 15, min: 0, max: 200, step: 1, suffix: '%' },
];

const softwareRoiFields: CalculatorField[] = [
  { id: 'monthlyCost', label: 'Software monthly cost', type: 'number', defaultValue: 1200, min: 0, max: 10000000, step: 50, prefix: '$' },
  { id: 'setupCost', label: 'Setup / migration cost', type: 'number', defaultValue: 4500, min: 0, max: 10000000, step: 250, prefix: '$' },
  { id: 'hoursSavedWeek', label: 'Hours saved per week before review', type: 'number', defaultValue: 12, min: 0, max: 10000, step: 1, suffix: 'hrs' },
  { id: 'reviewHoursWeek', label: 'Review / maintenance hours per week', type: 'number', defaultValue: 3, min: 0, max: 10000, step: 1, suffix: 'hrs' },
  { id: 'hourlyValue', label: 'Value of saved hour', type: 'number', defaultValue: 85, min: 0, max: 5000, step: 5, prefix: '$' },
  { id: 'adoptionPct', label: 'Real adoption rate', type: 'number', defaultValue: 60, min: 0, max: 100, step: 5, suffix: '%' },
  { id: 'errorReductionMonthly', label: 'Error / rework reduction per month', type: 'number', defaultValue: 500, min: 0, max: 1000000, step: 50, prefix: '$' },
];

const subscriptionCrossoverFields: CalculatorField[] = [
  { id: 'monthlyPrice', label: 'Monthly subscription price', type: 'number', defaultValue: 29, min: 0, max: 100000, step: 1, prefix: '$' },
  { id: 'annualPrice', label: 'Annual plan price', type: 'number', defaultValue: 290, min: 0, max: 100000, step: 10, prefix: '$' },
  { id: 'lifetimePrice', label: 'Lifetime / one-time price', type: 'number', defaultValue: 699, min: 0, max: 1000000, step: 10, prefix: '$' },
  { id: 'expectedMonths', label: 'Expected usage duration', type: 'number', defaultValue: 30, min: 1, max: 240, step: 1, suffix: 'months' },
  { id: 'priceIncreasePct', label: 'Annual subscription price increase', type: 'number', defaultValue: 8, min: 0, max: 100, step: 1, suffix: '%' },
  { id: 'lifetimeRiskCost', label: 'Lifetime plan risk / upgrade cost', type: 'number', defaultValue: 150, min: 0, max: 1000000, step: 25, prefix: '$' },
];

const cloudExitFields: CalculatorField[] = [
  { id: 'currentMonthlyCloud', label: 'Current monthly cloud spend', type: 'number', defaultValue: 6500, min: 0, max: 10000000, step: 250, prefix: '$' },
  { id: 'targetMonthlyCost', label: 'Target monthly cost after exit', type: 'number', defaultValue: 4200, min: 0, max: 10000000, step: 250, prefix: '$' },
  { id: 'egressTb', label: 'Data to move', type: 'number', defaultValue: 8, min: 0, max: 1000000, step: 1, suffix: 'TB' },
  { id: 'egressPerTb', label: 'Data transfer cost per TB', type: 'number', defaultValue: 90, min: 0, max: 10000, step: 5, prefix: '$' },
  { id: 'migrationHours', label: 'Engineering / ops migration hours', type: 'number', defaultValue: 180, min: 0, max: 100000, step: 10, suffix: 'hrs' },
  { id: 'hourlyRate', label: 'Loaded engineering hourly cost', type: 'number', defaultValue: 125, min: 0, max: 2000, step: 5, prefix: '$' },
  { id: 'refactorCost', label: 'Refactor / tooling / contract cost', type: 'number', defaultValue: 14000, min: 0, max: 10000000, step: 500, prefix: '$' },
  { id: 'dualRunMonths', label: 'Dual-running months', type: 'number', defaultValue: 2, min: 0, max: 24, step: 1 },
];

const careCostFields: CalculatorField[] = [
  {
    id: 'careType',
    label: 'Care setting',
    type: 'select',
    defaultValue: 'home-care',
    options: [
      { label: 'Home care aide', value: 'home-care' },
      { label: 'Assisted living', value: 'assisted-living' },
      { label: 'Memory care', value: 'memory-care' },
      { label: 'Nursing home', value: 'nursing-home' },
      { label: 'Adult day care', value: 'adult-day' },
    ],
  },
  { id: 'hoursPerWeek', label: 'Home-care hours per week', type: 'number', defaultValue: 30, min: 0, max: 168, step: 1, suffix: 'hrs' },
  { id: 'hourlyRate', label: 'Home-care hourly rate', type: 'number', defaultValue: 32, min: 0, max: 200, step: 1, prefix: '$' },
  { id: 'facilityMonthly', label: 'Facility monthly base', type: 'number', defaultValue: 5400, min: 0, max: 50000, step: 100, prefix: '$' },
  { id: 'careLevelAddOn', label: 'Care-level add-on', type: 'number', defaultValue: 650, min: 0, max: 20000, step: 50, prefix: '$' },
  { id: 'supplies', label: 'Supplies, transport, extras', type: 'number', defaultValue: 350, min: 0, max: 10000, step: 25, prefix: '$' },
  { id: 'inflation', label: 'Annual cost increase', type: 'number', defaultValue: 3.5, min: 0, max: 12, step: 0.1, suffix: '%' },
];

const propertySources: VerticalSource[] = [
  { label: 'Homewyse unit-cost method', href: 'https://www.homewyse.com/services/index.html' },
  { label: 'Inch Calculator construction calculators', href: 'https://www.inchcalculator.com/construction-calculators/' },
  { label: 'DOE air conditioner maintenance', href: 'https://www.energy.gov/energysaver/maintaining-your-air-conditioner' },
  { label: 'EPA R-22 homeowner FAQ', href: 'https://www.epa.gov/ods-phaseout/homeowners-and-consumers-frequently-asked-questions' },
];

const taxSources: VerticalSource[] = [
  { label: 'IRS Topic 554, Self-employment tax', href: 'https://www.irs.gov/taxtopics/tc554' },
  { label: 'IRS Publication 334, Tax Guide for Small Business', href: 'https://www.irs.gov/publications/p334' },
  { label: 'IRS 2026 tax inflation adjustments', href: 'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill' },
  { label: 'IRS estimated taxes for small business', href: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' },
  { label: 'IRS Form 1040-ES estimated tax', href: 'https://www.irs.gov/f1040es' },
  { label: 'IRS Publication 505, Tax Withholding and Estimated Tax', href: 'https://www.irs.gov/publications/p505' },
  { label: 'IRS payment options and payment plans', href: 'https://www.irs.gov/payments' },
  { label: 'SSA 2026 taxable maximum', href: 'https://www.ssa.gov/faqs/en/questions/KA-02387.html' },
];

const deductionSources: VerticalSource[] = [
  { label: 'IRS guide to business expense resources', href: 'https://www.irs.gov/publications/p535' },
  { label: 'IRS Instructions for Schedule C', href: 'https://www.irs.gov/instructions/i1040sc' },
  { label: 'IRS 2026 mileage rate', href: 'https://www.irs.gov/newsroom/irs-sets-2026-business-standard-mileage-rate-at-725-cents-per-mile-up-25-cents' },
  { label: 'IRS simplified home office deduction', href: 'https://www.irs.gov/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction' },
  { label: 'IRS Topic 554, Self-employment tax', href: 'https://www.irs.gov/taxtopics/tc554' },
];

const sCorpSources: VerticalSource[] = [
  { label: 'IRS S corporation compensation and medical insurance issues', href: 'https://www.irs.gov/businesses/small-businesses-self-employed/s-corporation-compensation-and-medical-insurance-issues' },
  { label: 'IRS Publication 15, Employer’s Tax Guide', href: 'https://www.irs.gov/publications/p15' },
  { label: 'IRS Topic 554, Self-employment tax', href: 'https://www.irs.gov/taxtopics/tc554' },
  { label: 'SSA 2026 taxable maximum', href: 'https://www.ssa.gov/faqs/en/questions/KA-02387.html' },
];

const payrollSources: VerticalSource[] = [
  { label: 'IRS Publication 15, Employer’s Tax Guide', href: 'https://www.irs.gov/publications/p15' },
  { label: 'IRS Publication 15-A, Employer’s Supplemental Tax Guide', href: 'https://www.irs.gov/publications/p15a' },
  { label: 'SSA 2026 taxable maximum', href: 'https://www.ssa.gov/faqs/en/questions/KA-02387.html' },
  { label: 'IRS employment taxes', href: 'https://www.irs.gov/businesses/small-businesses-self-employed/employment-taxes' },
];

const businessPlanningSources: VerticalSource[] = [
  { label: 'Google SEO Starter Guide', href: 'https://developers.google.com/search/docs/fundamentals/seo-starter-guide' },
  { label: 'Google helpful, reliable, people-first content', href: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content' },
];

const hiringSources: VerticalSource[] = [
  { label: 'IRS Topic 762, Independent contractor vs. employee', href: 'https://www.irs.gov/taxtopics/tc762' },
  { label: 'IRS Instructions for Form SS-8', href: 'https://www.irs.gov/instructions/iss8' },
  { label: 'DOL 2026 independent contractor rulemaking', href: 'https://www.dol.gov/agencies/whd/flsa/misclassification/2026rulemaking' },
  { label: 'DOL 2026 rulemaking FAQ', href: 'https://www.dol.gov/agencies/whd/flsa/misclassification/2026rulemaking/faqs' },
];

const technologySpendSources: VerticalSource[] = [
  { label: 'State of FinOps 2026 report', href: 'https://data.finops.org/' },
  { label: 'FinOps Framework 2026 update', href: 'https://www.finops.org/insights/2026-finops-framework/' },
  { label: 'FinOps Licensing and SaaS capability', href: 'https://www.finops.org/framework/capabilities/licensing-saas/' },
  { label: 'FinOps for SaaS', href: 'https://www.finops.org/framework/scope/saas/' },
];

const cloudSources: VerticalSource[] = [
  { label: 'AWS pricing', href: 'https://aws.amazon.com/pricing/' },
  { label: 'AWS data transfer charges', href: 'https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html' },
  { label: 'AWS free data transfer out when moving outside AWS', href: 'https://aws.amazon.com/blogs/aws/free-data-transfer-out-to-internet-when-moving-out-of-aws/' },
  { label: 'Google Cloud pricing', href: 'https://cloud.google.com/products/pricing' },
  { label: 'Google Cloud cost estimates', href: 'https://docs.cloud.google.com/billing/docs/how-to/estimate-costs' },
  { label: 'Azure bandwidth pricing', href: 'https://azure.microsoft.com/pricing/details/data-transfers' },
  { label: 'FinOps Framework 2026 update', href: 'https://www.finops.org/insights/2026-finops-framework/' },
];

const careSources: VerticalSource[] = [
  { label: 'CMS 2026 Medicare Parts A and B premiums', href: 'https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles' },
  { label: 'Medicare nursing home coverage', href: 'https://www.medicare.gov/coverage/nursing-home-care' },
  { label: 'IRS Publication 926 household employer guide', href: 'https://www.irs.gov/publications/p926' },
  { label: 'DOL domestic service fact sheet', href: 'https://www.dol.gov/agencies/whd/fact-sheets/flsa-domestic-service' },
  { label: 'USCIS domestic workers Form I-9', href: 'https://www.uscis.gov/i-9-central/completing-form-i-9/domestic-workers' },
  { label: 'USCIS H-2B temporary non-agricultural workers', href: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-2b-temporary-non-agricultural-workers' },
  { label: 'DOL H-2B program', href: 'https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2b' },
];

const hvacSections: VerticalContentSection[] = [
  {
    title: 'What changes the estimate',
    body: 'HVAC quotes move because of the homeowner symptom, system history, what the technician can prove with readings, equipment path, whether the furnace/blower/air handler still has useful life, line-set condition, duct scope, electrical or gas work, access difficulty, warranty length, and whether the contractor performs a real load calculation instead of replacing like-for-like tonnage.',
    bullets: [
      'The homeowner should describe what happened: dead outdoor unit, humming, warm air, ice, breaker trips, water safety shutoff, weak heat, short cycling, rooms that never get comfortable, or a recent thermostat change.',
      'A same-size replacement can still be wrong if insulation, windows, additions, or usage changed.',
      'Duct leakage and undersized returns can make a new system feel bad even when the equipment is good.',
      'High-efficiency upgrades should be compared against realistic bill savings and rebate rules.',
      'If a contractor names a failed compressor, condenser, coil, board, heat exchanger, or refrigerant leak, ask what test reading or visible evidence proves it and what smaller scope was ruled out.',
    ],
  },
  {
    title: 'Options worth pricing before a full replacement',
    body: 'Ask for more than one scope after the symptom has been tied to evidence. A useful HVAC bid can compare a service repair, compressor repair, condenser-only or condenser-and-coil replacement, full system replacement, duct repair first, or keeping a gas furnace for heat while adding mini-splits for cooling and staged heat-pump coverage.',
    bullets: [
      'Compressor-only repair can make sense when the system is not old, refrigerant type is serviceable, and the rest of the equipment is clean.',
      'Condenser plus indoor coil can make sense when cooling failed but the furnace/blower is still solid.',
      'Keeping the gas furnace for heat and adding mini-splits can make sense when ducts cool poorly, only a few rooms matter, or you want staged electrification.',
      'Full replacement can still be right, but the contractor should explain why partial scopes fail on age, refrigerant, warranty, compatibility, safety, or labor economics.',
    ],
  },
  {
    title: 'Mini-split sanity check',
    body: 'A mini-split path should not be read as one generic "4 ton mini-split" on the wall. It usually means room-by-room load planning, indoor heads or ducted mini-split zones, line-set runs, condensate handling, electrical work, and possibly more than one outdoor unit. Ductwork allowance is not part of a ductless mini-split estimate; the cost pressure moves to zones, heads, line sets, and electrical.',
  },
  {
    title: 'R-22 and refrigerant scare tactics',
    body: 'Do not accept "your Freon is phased out" as the whole argument for full replacement. Existing R-22 systems can still be serviced with recovered, recycled, or reclaimed R-22, and many older systems can be converted to an approved retrofit refrigerant such as an R-407-family or R-438A-style replacement when the equipment condition justifies keeping it alive. That is real advice, not a sales brochure: a retrofit is not free and not always smart, but it can buy years when the compressor, coil, and airflow are still serviceable.',
    bullets: [
      'R-410A is not automatically an "upgrade" for the homeowner; it is often a regulation and availability transition path, and R-410A itself is being phased down in new equipment.',
      'If the indoor coil is 20+ years old, plan to replace it, especially when replacing the condenser. Old coils leak first and can make a partial job false economy.',
      'If the contractor says R-22 makes repair impossible, ask for the price of reclaimed R-22, the price of a retrofit refrigerant conversion, and the reason each option is rejected.',
      'Recovered R-22 has value in the service chain. Ask whether refrigerant recovery is credited, charged, or simply treated as disposal.',
    ],
  },
];

const hvacLoadSections: VerticalContentSection[] = [
  {
    title: 'This is a sizing sanity check, not replacement pricing',
    body: 'The point is to challenge bad tonnage logic before a bid turns into equipment shopping. A contractor should not size by square footage alone, and they should not blindly replace the old tonnage if insulation, windows, duct leakage, additions, or room usage changed.',
    bullets: [
      'A bigger system can short-cycle, miss humidity removal, and still leave rooms uncomfortable.',
      'A smaller system can be right after air sealing, insulation, window shading, or duct repair.',
      'Hot rooms may need duct balancing, return air, shading, or a mini-split zone rather than a bigger whole-house unit.',
    ],
  },
  {
    title: 'What to ask before accepting the tonnage',
    body: 'Ask whether the contractor performed Manual J or equivalent load work, inspected return air, looked at duct leakage, checked static pressure, and separated load problems from distribution problems. The answer should mention the house, not just the old nameplate.',
  },
];

const sellerSections: VerticalContentSection[] = [
  {
    title: 'Closing math that sellers miss',
    body: 'A seller net sheet should not stop at commission. Title company charges, escrow fees, tax proration, association resale certificates, association dues, transfer fees, payoff demand fees, repairs, credits, and concessions all change the usable proceeds.',
    bullets: [
      'Tax proration can be a credit or debit depending on local custom, closing date, and whether taxes are paid in arrears.',
      'Association fees vary widely. The safest calculator pattern is to expose each line item instead of hiding them in one percentage.',
      'A title-company quote should be used before signing final documents.',
    ],
  },
];

const homeSalePrepSections: VerticalContentSection[] = [
  {
    title: 'The prep work that usually matters',
    body: 'Pre-listing prep is not a remodel wish list. The first money should go to removing buyer doubt: clean smell, bright photos, obvious maintenance, clean entry, working basics, and defects that will become inspection leverage. A buyer rarely pays full retail for your last-minute remodel, but they will punish visible neglect.',
    bullets: [
      'Deep cleaning, decluttering, light repair, paint touch-up, landscaping cleanup, and photo/staging prep are usually the first-pass items.',
      'Known blockers such as active leaks, rotten exterior wood, broken HVAC, unsafe electrical, missing handrails, or lender-required repairs should be handled or priced as credits before cosmetic upgrades.',
      'Large kitchen, bath, flooring, or roof work before listing needs a realtor and contractor sanity check because timing, taste, permits, and change orders can destroy ROI.',
    ],
  },
  {
    title: 'When a credit beats doing the work',
    body: 'If the issue is expensive, taste-sensitive, or likely to expand after opening walls, pricing the home correctly or offering a credit can be cleaner than rushing work. Buyers do not always value your chosen counters, tile, flooring, or fixtures at your invoice cost. Do the work when it removes a sale blocker or makes the house photograph and show materially better.',
    bullets: [
      'Do not start a mini-remodel if you cannot finish, clean, photograph, and document it before launch.',
      'Do not hide known defects with cosmetic work. It can turn into disclosure, inspection, or trust trouble.',
      'Use receipts and before/after photos so the work supports the listing story instead of looking like a cover-up.',
    ],
  },
  {
    title: 'Quote questions before spending',
    body: 'Ask the agent and contractor to separate must-fix, show-better, negotiate-later, and skip categories. The point is not to make the house perfect. The point is to remove the objections that cost more in price cuts, days on market, failed inspection, or buyer concessions than they cost to fix.',
  },
];

const taxSections: VerticalContentSection[] = [
  {
    title: 'Deductions need a business reason and records',
    body: 'Self-employed deductions generally need to be ordinary, necessary, tied to the business, and supported by records. The dangerous deductions are usually not the biggest dollar amounts; they are the ones with weak business purpose, mixed personal use, or no contemporaneous documentation.',
    bullets: [
      'Home office: document exclusive and regular business use, square footage, and why the space is not personal.',
      'Vehicle: keep a mileage log or actual-expense records. The 2026 standard business mileage rate is 72.5 cents per mile.',
      'Meals and travel: keep business purpose, date, amount, location, and who was involved.',
      'Software, phone, internet, equipment: split personal and business use if mixed.',
    ],
  },
  {
    title: 'Danger flags',
    body: 'This tool should flag deductions that often need extra support: large home-office claims, 100 percent vehicle use, travel mixed with vacation, meals without business purpose, family payroll, hobby-like losses, and contractor payments without tax forms.',
  },
];

const businessMethodSections: VerticalContentSection[] = [
  {
    title: 'This is decision math, not a generic calculator',
    body: 'The useful output is not one perfect number. It is the spread between conservative, expected, and aggressive assumptions, plus the point where the decision stops being worth the drag.',
    bullets: [
      'Use realistic inputs for time, adoption, churn, admin, and slow months.',
      'A good result can still say "not worth it yet." That is a feature, not a failure.',
      'Run the calculator once with optimistic assumptions and once with the ugly-but-plausible case.',
    ],
  },
  {
    title: 'When the decision usually goes wrong',
    body: 'Operators usually get hurt by hidden costs: non-billable time, ramp time, management burden, unused seats, tax reserve, scope creep, collection delay, and software maintenance. Those costs are easy to ignore because they do not always arrive as one invoice.',
  },
];

const pricingSections: VerticalContentSection[] = [
  {
    title: 'Pricing is not just arithmetic',
    body: 'Rate and margin decisions fail when the calculator ignores non-billable time, owner energy, revision creep, discounts, sales time, taxes, and slow months. The lowest sustainable price should still leave enough room to do the work well.',
    bullets: [
      'If the rate feels high but take-home is low, the missing inputs are usually taxes, idle time, admin, sales, and unpaid scope creep.',
      'Discounts should be tested against margin, not revenue.',
      'Break-even is a warning light, not the goal.',
    ],
  },
  ...businessMethodSections,
];

const hiringSections: VerticalContentSection[] = [
  {
    title: 'Hiring is often an overwhelm response',
    body: 'Before adding permanent overhead, separate the real problem: capacity, process chaos, underpricing, poor clients, missing documentation, or founder avoidance. A hire can help capacity; it will not automatically fix a broken workflow.',
    bullets: [
      'Contractors can look expensive by the hour but cheaper when utilization is uncertain.',
      'Employees can look cheaper on wage rate but add payroll burden, benefits, management, equipment, and commitment.',
      'Automation should reduce operational load. If it creates a system to babysit, count the review work.',
    ],
  },
  ...businessMethodSections,
];

const revenueSections: VerticalContentSection[] = [
  {
    title: 'Revenue planning is where optimism gets expensive',
    body: 'A forecast should show the activity behind the target: leads, proposals, close rate, deal size, churn, collection delay, and replacement revenue. If those assumptions look fake, the revenue number is not a plan yet.',
    bullets: [
      'Booked revenue and collected cash are not the same thing.',
      'One large client leaving can erase several months of normal growth.',
      'More leads is lazy advice if close rate, deal size, retention, or delivery capacity is the actual bottleneck.',
    ],
  },
  ...businessMethodSections,
];

const techSpendSections: VerticalContentSection[] = [
  {
    title: 'Tools quietly become payroll',
    body: 'Software, SaaS seats, cloud usage, AI subscriptions, and temporary tools become part of the fixed cost structure when no one owns the cleanup. The calculator should show monthly pain, annual pain, unused spend, and what happens when prices rise.',
    bullets: [
      'Unused seats still get paid.',
      'A tool that saves time but creates review work may have weak or negative ROI.',
      'Cloud exit, migration, and lock-in costs should be modeled before the bill becomes a surprise.',
    ],
  },
  ...businessMethodSections,
];

const careSections: VerticalContentSection[] = [
  {
    title: 'Care-cost planning boundaries',
    body: 'Care planning should compare settings, family workload, public benefits, tax/payroll obligations, safety, and respite. It should not promise eligibility or replace medical, legal, immigration, tax, or benefits advice.',
    bullets: [
      'Medicare generally does not cover custodial nursing home care when custodial care is the only care needed.',
      'Hiring a household caregiver can create wage, overtime, Form I-9, payroll tax, and Schedule H obligations.',
      'Bringing a foreign caregiver is not a simple cost-saving shortcut. Lawful paths are limited and fact-specific.',
    ],
  },
];

export const VERTICAL_CALCULATORS: VerticalCalculatorPage[] = [
  {
    slug: 'hvac-load-estimate',
    area: 'property',
    group: 'Improve',
    title: 'HVAC Load Estimate Planner | Kefiw',
    h1: 'HVAC Load Estimate Planner',
    description: 'Estimate rough HVAC capacity pressure from square footage, climate, insulation, windows, sun exposure, duct condition, and comfort complaints before accepting a tonnage recommendation.',
    keywords: ['hvac load estimate', 'hvac size calculator', 'home size hvac estimate'],
    summary: 'Use this to challenge tonnage-by-square-foot and identify whether the problem is load, ducts, zoning, or comfort distribution.',
    kind: 'hvac-load',
    fields: hvacLoadFields,
    assumptions: ['Uses rough capacity pressure, not Manual J design.', 'A contractor should still perform a proper load calculation before equipment is selected.', 'Comfort complaints can be duct, return-air, solar-gain, humidity, or zoning problems rather than tonnage problems.'],
    sections: hvacLoadSections,
    related: [
      { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
      { label: 'HVAC Diagnosis Live Matrix', href: '/property/hvac-diagnosis-live-matrix/' },
      { label: 'Ductwork Cost', href: '/property/ductwork-cost/' },
      { label: 'Replace My HVAC Track', href: '/tracks/replace-my-hvac/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'hvac-replacement-cost',
    area: 'property',
    group: 'Improve',
    title: 'HVAC Replacement Cost Calculator | Kefiw',
    h1: 'HVAC Replacement Cost Calculator',
    description: 'Estimate full HVAC replacement cost with equipment type, efficiency, ductwork, complexity, and rebates.',
    keywords: ['hvac replacement cost calculator', 'replace hvac cost', 'new hvac system estimate'],
    summary: 'Build a low, typical, and high range before comparing HVAC bids.',
    kind: 'hvac-cost',
    fields: hvacCostFields,
    assumptions: ['Regional labor and brand differences can move actual bids.', 'Ductwork, access, warranty, and electrical/gas work should be broken out.'],
    sections: hvacSections,
    related: [
      { label: 'HVAC Diagnosis Live Matrix', href: '/property/hvac-diagnosis-live-matrix/' },
      { label: 'Ductwork Cost', href: '/property/ductwork-cost/' },
      { label: 'HVAC Repair vs Replace', href: '/property/hvac-repair-vs-replace/' },
      { label: 'HVAC Diagnosis Guide', href: '/guides/hvac-diagnosis-live-matrix/' },
      { label: 'AC Dead Does Not Always Mean Replace', href: '/guides/ac-dead-not-always-replacement/' },
      { label: 'Before You Replace Your HVAC', href: '/guides/hvac-full-replacement-alternatives/' },
      { label: 'Mini-Splits vs Central AC', href: '/guides/mini-splits-vs-central-ac/' },
      { label: 'Replace My HVAC Track', href: '/tracks/replace-my-hvac/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'ac-replacement-cost',
    area: 'property',
    group: 'Improve',
    title: 'AC Replacement Cost Calculator | Kefiw',
    h1: 'AC Replacement Cost Calculator',
    description: 'Estimate central AC replacement cost and see how efficiency, ductwork, access, and rebates change the range.',
    keywords: ['ac replacement cost calculator', 'central ac replacement cost', 'air conditioner replacement estimate'],
    summary: 'Use central AC as the selected equipment path and compare it with a full HVAC or heat-pump path.',
    kind: 'hvac-cost',
    fields: hvacCostFields.map((field) => field.id === 'equipment' ? { ...field, defaultValue: 'ac' } : field),
    assumptions: ['AC-only replacement may still require coil, line set, electrical, or thermostat work.', 'Duct problems can make a new AC underperform.'],
    sections: hvacSections,
    related: [
      { label: 'Heat Pump Cost', href: '/property/heat-pump-cost/' },
      { label: 'Energy Savings Estimate', href: '/property/energy-savings-estimate/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'furnace-replacement-cost',
    area: 'property',
    group: 'Improve',
    title: 'Furnace Replacement Cost Calculator | Kefiw',
    h1: 'Furnace Replacement Cost Calculator',
    description: 'Estimate furnace replacement cost with access, efficiency, ductwork, and complexity inputs.',
    keywords: ['furnace replacement cost calculator', 'new furnace cost', 'gas furnace replacement estimate'],
    summary: 'Furnace quotes should show equipment, venting, gas, electrical, duct transition, and warranty scope.',
    kind: 'hvac-cost',
    fields: hvacCostFields.map((field) => field.id === 'equipment' ? { ...field, defaultValue: 'furnace' } : field),
    assumptions: ['High-efficiency furnaces can add venting and condensate work.', 'A furnace-only quote may not solve duct or comfort issues.'],
    sections: hvacSections,
    related: [
      { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
      { label: 'HVAC Repair vs Replace', href: '/property/hvac-repair-vs-replace/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'heat-pump-cost',
    area: 'property',
    group: 'Improve',
    title: 'Heat Pump Cost Calculator | Kefiw',
    h1: 'Heat Pump Cost Calculator',
    description: 'Estimate heat pump replacement cost and compare rebate, backup heat, ductwork, and efficiency assumptions.',
    keywords: ['heat pump cost calculator', 'heat pump replacement cost', 'ac vs heat pump calculator'],
    summary: 'Heat pumps can be a comfort and efficiency upgrade, but backup heat, climate, and rebates matter.',
    kind: 'hvac-cost',
    fields: hvacCostFields.map((field) => field.id === 'equipment' ? { ...field, defaultValue: 'heat-pump' } : field),
    assumptions: ['Cold-climate performance and backup heat should be discussed with the installer.', 'Rebate eligibility can depend on equipment rating and local program rules.'],
    sections: hvacSections,
    related: [
      { label: 'Energy Savings Estimate', href: '/property/energy-savings-estimate/' },
      { label: 'AC Replacement Cost', href: '/property/ac-replacement-cost/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'ductwork-cost',
    area: 'property',
    group: 'Improve',
    title: 'Ductwork Cost Calculator | Kefiw',
    h1: 'Ductwork Cost Calculator',
    description: 'Estimate the ductwork part of an HVAC project and test sealing, partial replacement, or full replacement scenarios.',
    keywords: ['ductwork cost calculator', 'replace ductwork cost', 'duct repair cost estimate'],
    summary: 'Ductwork can be the hidden line item that decides whether a new HVAC system actually performs.',
    kind: 'hvac-cost',
    fields: hvacCostFields.map((field) => field.id === 'ducts' ? { ...field, defaultValue: 'full' } : field),
    assumptions: ['Calculator treats ductwork as part of the HVAC project range.', 'Ask for separate duct scope, insulation, sealing, and balancing language.'],
    sections: hvacSections,
    related: [
      { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
      { label: 'HVAC Load Estimate', href: '/property/hvac-load-estimate/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'hvac-repair-vs-replace',
    area: 'property',
    group: 'Improve',
    title: 'HVAC Repair vs Replace Calculator | Kefiw',
    h1: 'HVAC Repair vs Replace Calculator',
    description: 'Compare repair cost, system age, replacement cost, comfort issues, and energy penalty before deciding whether to repair or replace HVAC equipment.',
    keywords: ['hvac repair vs replace calculator', 'repair or replace hvac', 'replace ac or repair'],
    summary: 'The right answer changes when a repair is expensive, the system is old, comfort is poor, or energy waste is recurring.',
    kind: 'hvac-repair',
    fields: [
      { id: 'repairCost', label: 'Current repair quote', type: 'number', defaultValue: 1800, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'systemAge', label: 'System age', type: 'number', defaultValue: 13, min: 0, max: 40, step: 1, suffix: 'yrs' },
      { id: 'replacementCost', label: 'Replacement estimate', type: 'number', defaultValue: 11500, min: 1000, max: 100000, step: 500, prefix: '$' },
      { id: 'annualEnergyPenalty', label: 'Estimated annual energy penalty', type: 'number', defaultValue: 450, min: 0, max: 10000, step: 50, prefix: '$' },
      { id: 'comfortScore', label: 'Comfort problem severity', type: 'number', defaultValue: 6, min: 0, max: 10, step: 1, suffix: '/10' },
    ],
    assumptions: ['This is a decision frame, not a diagnosis.', 'A safety issue, cracked heat exchanger, or major refrigerant leak may override pure payback math.'],
    sections: hvacSections,
    related: [
      { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
      { label: 'Energy Savings Estimate', href: '/property/energy-savings-estimate/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'hvac-diagnosis-live-matrix',
    area: 'property',
    group: 'Improve',
    title: 'HVAC Diagnosis Live Matrix | Kefiw',
    h1: 'HVAC Diagnosis Live Matrix',
    description: 'Map HVAC symptoms to likely cheap fixes, safety stops, repair scopes, and replacement-level failures before accepting a sales quote.',
    keywords: ['hvac diagnosis matrix', 'heater not working', 'ac dead diagnostic checklist', 'furnace flame sensor', 'electric furnace sequencer', 'thermostat issue hvac'],
    summary: 'A dead AC, heater problem, weak heat, or furnace lockout is not automatically a system replacement. Start with what the homeowner saw, then make the quote show evidence.',
    kind: 'hvac-diagnosis',
    fields: [
        {
          id: 'problemMode',
          label: 'What you see at home',
        type: 'select',
        defaultValue: 'cooling-dead',
        options: [
          { label: 'Cooling: AC seems dead', value: 'cooling-dead' },
          { label: 'Cooling: warm air / weak cooling', value: 'cooling-warm' },
          { label: 'Heating: heater not working / type unknown', value: 'heating-unknown' },
          { label: 'Gas heat: furnace will not stay lit', value: 'gas-flame' },
          { label: 'Gas heat: no ignition / no heat', value: 'gas-no-ignition' },
          { label: 'Electric heat: strips not heating', value: 'electric-heat' },
          { label: 'Heat pump: outdoor unit or aux heat issue', value: 'heat-pump' },
          { label: 'Thermostat / control problem', value: 'thermostat-control' },
        ],
      },
      {
        id: 'thermostatCall',
        label: 'Thermostat call',
        type: 'select',
        defaultValue: 'calls-cool',
        options: [
          { label: 'Calls for cooling', value: 'calls-cool' },
          { label: 'Calls for heat', value: 'calls-heat' },
          { label: 'Blank / no power', value: 'blank' },
          { label: 'Short cycles / loses call', value: 'short-cycles' },
          { label: 'Unknown', value: 'unknown' },
        ],
      },
      {
        id: 'indoorBlower',
        label: 'Indoor blower behavior',
        type: 'select',
        defaultValue: 'runs',
        options: [
          { label: 'Blower runs', value: 'runs' },
          { label: 'Blower does not run', value: 'off' },
          { label: 'Runs then stops', value: 'stops' },
          { label: 'Unknown', value: 'unknown' },
        ],
      },
      {
        id: 'outdoorBehavior',
        label: 'Outdoor unit behavior, if cooling or heat pump',
        type: 'select',
        defaultValue: 'hums-no-fan',
        options: [
          { label: 'Silent / nothing happens', value: 'silent' },
          { label: 'Hums but fan does not spin', value: 'hums-no-fan' },
          { label: 'Fan runs but compressor does not', value: 'fan-only' },
          { label: 'Compressor runs but fan does not', value: 'compressor-only' },
          { label: 'Starts then shuts off', value: 'short-cycles' },
          { label: 'Breaker trips', value: 'breaker-trips' },
          { label: 'Runs but air is warm', value: 'warm-air' },
          { label: 'Ice on lines / coil', value: 'iced' },
        ],
      },
      {
        id: 'gasFurnacePattern',
        label: 'Gas furnace pattern',
        type: 'select',
        defaultValue: 'na',
        options: [
          { label: 'Burner lights then shuts off', value: 'lights-then-drops' },
          { label: 'Inducer runs, no ignition', value: 'inducer-no-ignition' },
          { label: 'Igniter glows, no flame', value: 'igniter-no-flame' },
          { label: 'No inducer / no sequence', value: 'no-sequence' },
          { label: 'Rollout/high limit trip or burning smell', value: 'safety-trip' },
          { label: 'Not a gas furnace / unknown', value: 'na' },
        ],
      },
      {
        id: 'electricHeatPattern',
        label: 'Electric heat / sequencer pattern',
        type: 'select',
        defaultValue: 'na',
        options: [
          { label: 'Blower runs but air is not hot', value: 'blower-no-heat' },
          { label: 'Some heat, not enough', value: 'partial-heat' },
          { label: 'Breaker trips when heat starts', value: 'breaker-heat' },
          { label: 'Outdoor heat pump runs, aux never helps', value: 'aux-no-help' },
          { label: 'Not electric heat / unknown', value: 'na' },
        ],
      },
      {
        id: 'breakerStatus',
        label: 'Breaker status',
        type: 'select',
        defaultValue: 'not-tripped',
        options: [
          { label: 'Not tripped', value: 'not-tripped' },
          { label: 'Tripped once', value: 'tripped-once' },
          { label: 'Trips immediately', value: 'trips-immediately' },
          { label: 'Unknown', value: 'unknown' },
        ],
      },
      {
        id: 'floatSwitch',
        label: 'Drain float switch / water safety',
        type: 'select',
        defaultValue: 'unknown',
        options: [
          { label: 'Dry / not tripped', value: 'dry' },
          { label: 'Wet or tripped', value: 'wet' },
          { label: 'Unknown / not checked', value: 'unknown' },
        ],
        help: 'A clogged condensate drain can shut the system off before anything expensive is broken.',
      },
      { id: 'boardQuoted', label: 'Technician quoted a control board', type: 'checkbox', defaultValue: false, help: 'Board replacement can be real, but it should not be the first guess before power, thermostat, safeties, sensors, relays, and wiring are checked.' },
      { id: 'flameSensorCleaned', label: 'Flame sensor already cleaned/tested', type: 'checkbox', defaultValue: false },
      { id: 'thermostatRecent', label: 'Thermostat was recently replaced or reprogrammed', type: 'checkbox', defaultValue: false },
      { id: 'filterDirty', label: 'Filter is dirty or airflow seems weak', type: 'checkbox', defaultValue: false },
      { id: 'capacitorAge', label: 'Capacitor age', type: 'number', defaultValue: 5, min: 0, max: 20, step: 1, suffix: 'yrs' },
      { id: 'systemAge', label: 'System age', type: 'number', defaultValue: 12, min: 0, max: 40, step: 1, suffix: 'yrs' },
      {
        id: 'contractorSays',
        label: 'What the contractor is saying',
        type: 'select',
        defaultValue: 'no-quote',
        options: [
          { label: 'No quote yet', value: 'no-quote' },
          { label: 'Replace full system', value: 'replace-system' },
          { label: 'Replace furnace / air handler', value: 'replace-heater' },
          { label: 'Bad compressor', value: 'bad-compressor' },
          { label: 'Bad control board', value: 'bad-board' },
          { label: 'Cracked heat exchanger', value: 'bad-heat-exchanger' },
          { label: 'Bad capacitor / contactor', value: 'capacitor-contactor' },
          { label: 'Low refrigerant / leak', value: 'low-refrigerant' },
        ],
      },
    ],
      assumptions: [
        'Use symptoms, recent history, and what the technician said. You do not need to know the failed part.',
        'Do not open electrical cabinets unless qualified. Capacitors can hold dangerous charge.',
        'Gas smell, carbon monoxide alarm, flame rollout, cracked heat exchanger, burning smell, melted wiring, or repeated breaker trips are stop conditions. Shut the system down and call qualified help.',
      'This is a homeowner pushback checklist, not a live electrical diagnostic procedure.',
      'Identify the heat type first: gas furnace, electric furnace or air handler heat strips, heat pump with auxiliary heat, boiler, or another setup.',
      'A breaker that trips immediately, burning smell, melted wire, or shorted compressor needs a qualified technician.',
    ],
    sections: [
      {
        title: 'Cheap failures can look like replacement-level failures',
        body: 'A failed capacitor, contactor, thermostat signal, drain float switch, dirty filter, iced coil, condenser fan motor, blower motor, flame sensor, limit switch, sequencer, heat strip relay, or thermostat wiring issue can make HVAC equipment look dead. Those are service-call problems before they are replacement problems.',
        bullets: [
          'Bad capacitor: outdoor unit may hum, fan may not spin, or compressor may fail to start.',
          'Bad contactor: outdoor unit may stay silent even when the thermostat calls for cooling.',
          'Blower or limit problem: the furnace or air handler may shut down, overheat, or never move enough air.',
          'Dirty flame sensor: gas burner may light briefly, then shut down because the board does not prove flame.',
          'Electric sequencer or relay failure: blower may run while heat strips fail to energize, or only some stages heat.',
          'Thermostat or low-voltage issue: the equipment may be fine but never receives the correct call.',
          'Float switch: a clogged condensate drain can shut the system off to prevent water damage.',
          'Dirty filter or iced coil: airflow problems can make the system shut down or blow warm air.',
        ],
      },
      {
        title: 'When replacement enters the conversation',
        body: 'Replacement becomes more serious when the compressor is confirmed electrically shorted or mechanically locked, the heat exchanger is unsafe, the coil is leaking and old, the refrigerant path is expensive, electric heat has repeated high-current failures, or the system has multiple failures near end of life.',
      },
    ],
    related: [
      { label: 'AC Dead Does Not Always Mean Replace', href: '/guides/ac-dead-not-always-replacement/' },
      { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
      { label: 'HVAC Repair vs Replace', href: '/property/hvac-repair-vs-replace/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'energy-savings-estimate',
    area: 'property',
    group: 'Improve',
    title: 'Home Energy Savings Estimate Calculator | Kefiw',
    h1: 'Home Energy Savings Estimate Calculator',
    description: 'Estimate annual energy savings, net upgrade cost, and payback from HVAC, insulation, solar, or efficiency improvements.',
    keywords: ['energy savings calculator', 'home energy savings estimate', 'hvac energy savings calculator'],
    summary: 'Use this to test whether an efficiency upgrade is a comfort decision, a payback decision, or both.',
    kind: 'energy-savings',
    fields: [
      { id: 'monthlyBill', label: 'Current monthly utility bill', type: 'number', defaultValue: 260, min: 0, max: 5000, step: 10, prefix: '$' },
      { id: 'savingsPct', label: 'Expected savings', type: 'number', defaultValue: 18, min: 0, max: 90, step: 1, suffix: '%' },
      { id: 'upgradeCost', label: 'Upgrade cost', type: 'number', defaultValue: 9500, min: 0, max: 200000, step: 500, prefix: '$' },
      { id: 'rebate', label: 'Rebates / credits', type: 'number', defaultValue: 1500, min: 0, max: 100000, step: 100, prefix: '$' },
    ],
    assumptions: ['Behavior, weather, utility rates, and equipment sizing can change actual savings.', 'Use bills, not guesses, when possible.'],
    sections: hvacSections,
    related: [
      { label: 'Heat Pump Cost', href: '/property/heat-pump-cost/' },
      { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'seller-proceeds-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Seller Proceeds Calculator | Kefiw',
    h1: 'Seller Proceeds Calculator',
    description: 'Estimate what you keep after payoff, commission, closing costs, title fees, prorations, association charges, repairs, and concessions.',
    keywords: ['seller proceeds calculator', 'home sale proceeds calculator', 'seller net calculator'],
    summary: 'Use this when you need the one-page answer: sale price minus every visible deduction.',
    kind: 'seller-net',
    fields: sellerNetFields,
    assumptions: ['Local custom and contract terms decide who pays many fees.', 'Use a title-company estimate before relying on final numbers.'],
    sections: sellerSections,
    related: [
      { label: 'Home Sale Prep ROI', href: '/property/home-sale-prep-roi-calculator/' },
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
      { label: 'Sell My Home Track', href: '/tracks/sell-my-home/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'net-sheet-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Seller Net Sheet Calculator | Kefiw',
    h1: 'Seller Net Sheet Calculator',
    description: 'Build a seller net sheet with payoff, commission, title charges, tax proration, association charges, repairs, concessions, and prep budget visible as separate lines.',
    keywords: ['seller net sheet calculator', 'net sheet calculator', 'home sale net sheet'],
    summary: 'Use this when you are comparing listing prices, offers, concessions, and repair credits.',
    kind: 'seller-net',
    fields: sellerNetFields,
    assumptions: ['A net sheet is a planning estimate until title, payoff, taxes, HOA, and contract terms are known.', 'Run multiple scenarios: list price, likely accepted price, and low offer.'],
    sections: sellerSections,
    related: [
      { label: 'Commission Calculator', href: '/property/commission-calculator/' },
      { label: 'Closing Cost Calculator', href: '/property/closing-cost-calculator/' },
      { label: 'Sell My Home Track', href: '/tracks/sell-my-home/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'commission-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Real Estate Commission Calculator | Kefiw',
    h1: 'Real Estate Commission Calculator',
    description: 'Calculate total commission, listing-side share, buyer-broker concession, admin fees, and what a negotiated reduction is actually worth.',
    keywords: ['real estate commission calculator', 'seller commission calculator', 'listing commission calculator'],
    summary: 'Commission is negotiable math, but the question is what service, exposure, and buyer-side incentive you are changing.',
    kind: 'commission-cost',
    fields: commissionFields,
    assumptions: ['Commission and buyer-broker concessions are contract terms and local-market strategy questions.', 'A lower rate is not automatically better if it weakens exposure, negotiation, or buyer traffic.'],
    sections: sellerSections,
    related: [
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
      { label: 'Seller Proceeds', href: '/property/seller-proceeds-calculator/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'closing-cost-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Seller Closing Cost Calculator | Kefiw',
    h1: 'Seller Closing Cost Calculator',
    description: 'Estimate seller-side closing costs with title company charges, tax proration, resale documents, dues, transfer fees, payoff fees, and recording costs separated.',
    keywords: ['seller closing cost calculator', 'home seller closing costs', 'closing cost estimate seller'],
    summary: 'This is the line-item cleanup page, not another generic percentage calculator.',
    kind: 'seller-closing-cost',
    fields: sellerClosingFields,
    assumptions: ['Who pays each line depends on contract, state, title practice, and local custom.', 'A title-company quote is the source of truth before closing.'],
    sections: sellerSections,
    related: [
      { label: 'Title Company Cost', href: '/property/title-company-cost-calculator/' },
      { label: 'Tax Proration', href: '/property/tax-proration-calculator/' },
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'title-company-cost-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Title Company Cost Calculator | Kefiw',
    h1: 'Title Company Cost Calculator',
    description: 'Estimate title, escrow, settlement, document, recording, wire, courier, endorsement, and closing-service charges as a separate line item.',
    keywords: ['title company cost calculator', 'title fees calculator', 'escrow fee calculator'],
    summary: 'Use this to stop title and escrow costs from hiding inside one vague closing-cost percentage.',
    kind: 'title-company-cost',
    fields: titleCompanyFields,
    assumptions: ['Title policy pricing and settlement charges vary by state, file type, title company, and contract.', 'Use this as a checklist before requesting a written fee sheet.'],
    sections: sellerSections,
    related: [
      { label: 'Closing Cost Calculator', href: '/property/closing-cost-calculator/' },
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'tax-proration-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Tax Proration Calculator | Kefiw',
    h1: 'Tax Proration Calculator',
    description: 'Estimate the closing credit or debit for property taxes based on annual taxes, seller-owned days, local custom, and escrow timing.',
    keywords: ['tax proration calculator', 'property tax proration', 'closing tax credit calculator'],
    summary: 'Tax proration is timing math. Get the direction right before treating it as seller proceeds.',
    kind: 'tax-proration',
    fields: taxProrationFields,
    assumptions: ['Some places tax in arrears, some contracts prorate differently, and escrow/tax bills can change the final figure.', 'Confirm with the title company and contract.'],
    sections: sellerSections,
    related: [
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
      { label: 'Closing Cost Calculator', href: '/property/closing-cost-calculator/' },
    ],
    sources: propertySources,
  },
  ...[
    ['resale-certificate-calculator', 'Resale Certificate Cost Calculator', 'Budget for resale certificates, condo questionnaires, association document packages, rush fees, and closing-period association charges.'],
    ['association-dues-calculator', 'Association Dues Closing Calculator', 'Estimate dues, prepaid/owed amounts, special assessments, violation payoff, and closing-period association charges.'],
    ['association-transfer-fee-calculator', 'Association Transfer Fee Calculator', 'Estimate HOA or condo transfer fees and show how they affect sale proceeds or cash to close.'],
  ].map(([slug, h1, description]): VerticalCalculatorPage => ({
    slug,
    area: 'property',
    group: 'Buy/Sell',
    title: `${h1} | Kefiw`,
    h1,
    description,
    keywords: [h1.toLowerCase(), 'hoa closing cost calculator', 'association transfer fee calculator'],
    summary: 'Association charges are small enough to get missed and big enough to irritate everyone at closing.',
    kind: 'association-cost',
    fields: associationFields,
    assumptions: ['Association fees depend on governing documents, management company rules, rush timing, and contract terms.', 'Request the management-company fee sheet early.'],
    sections: sellerSections,
    related: [
      { label: 'Closing Cost Calculator', href: '/property/closing-cost-calculator/' },
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
    ],
    sources: propertySources,
  })),
  {
    slug: 'cash-to-close-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Cash to Close Calculator | Kefiw',
    h1: 'Cash to Close Calculator',
    description: 'Estimate down payment, closing costs, title fees, prepaids, tax escrow, resale certificate, association dues, transfer fee, and inspection costs.',
    keywords: ['cash to close calculator', 'buyer closing cost calculator', 'down payment closing costs'],
    summary: 'Cash to close is not just the down payment. This exposes the line items buyers often miss.',
    kind: 'buyer-cash',
    fields: buyerCashFields,
    assumptions: ['Your lender disclosure and title-company quote are the source of truth.', 'Association and tax timing can move the estimate materially.'],
    sections: sellerSections,
    related: [
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
      { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'home-sale-prep-roi-calculator',
    area: 'property',
    group: 'Buy/Sell',
    title: 'Home Sale Prep ROI Calculator | Kefiw',
    h1: 'Home Sale Prep ROI Calculator',
    description: 'Decide which pre-listing repairs, cleaning, paint, staging, landscaping, and refresh work are worth doing before listing, and which should become a price adjustment or buyer credit.',
    keywords: ['home sale prep roi calculator', 'seller repair roi', 'pre listing repair calculator', 'pre listing repairs worth it'],
    summary: 'Sort prep into must-fix, quick-win, maybe, and skip/credit instead before spending money.',
    kind: 'home-sale-prep',
    fields: homeSalePrepFields,
    assumptions: [
      'This estimates buyer-perception value and concession risk, not a guaranteed sale-price increase.',
      'Safety, lender, insurance, and inspection blockers should be handled before cosmetic wish-list work.',
      'Local inventory, price point, buyer expectations, and agent strategy can change the right answer.',
    ],
    sections: homeSalePrepSections,
    related: [
      { label: 'Seller Proceeds', href: '/property/seller-proceeds-calculator/' },
      { label: 'Seller Net Sheet', href: '/property/net-sheet-calculator/' },
      { label: 'Plan My Remodel Track', href: '/tracks/plan-my-remodel/' },
      { label: 'Sell My Home Track', href: '/tracks/sell-my-home/' },
    ],
    sources: propertySources,
  },
  {
    slug: 'self-employed-tax-calculator',
    area: 'business',
    group: 'Tax',
    title: 'Self-Employed Tax Calculator: Estimate Tax Set-Asides | Kefiw',
    h1: 'Self-Employed Tax Calculator',
    description: 'Estimate self-employment tax, federal and state income tax reserve, rough QBI effect, and take-home cash before business cash gives you false confidence.',
    keywords: ['self employed tax set aside calculator', '1099 tax reserve calculator', 'freelance tax reserve calculator', 'self employed tax calculator irregular income'],
    summary: 'Know what to reserve before your business cash starts feeling richer than it really is.',
    tagline: 'Know what is not really yours yet.',
    promise: 'Estimate tax set-asides before business cash gives you false confidence.',
    bestFor: 'Freelancers, consultants, creators, and sole proprietors who need a tax reserve before pricing or spending.',
    seoTargets: ['how much should I set aside for taxes self employed', '1099 tax set aside calculator', 'self employed tax calculator irregular income'],
    monetizationFit: ['bookkeeping software', 'tax prep', 'business banking', 'CPA review'],
    riskProfile: 'federal-tax',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'U.S. federal self-employment tax, Social Security wage base, and federal income-tax planning defaults. State tax is only a user-entered reserve assumption.',
    kind: 'self-employment-tax',
    fields: seTaxFields,
    assumptions: ['Uses 92.35 percent net earnings framing, 12.4 percent Social Security up to the 2026 taxable maximum, and 2.9 percent Medicare.', 'Does not replace tax advice or full Form 1040-ES worksheets.'],
    sections: taxSections,
    related: [
      { label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/' },
      { label: 'Deduction Finder', href: '/business/self-employed-deduction-finder/' },
      { label: 'Start Freelancing Track', href: '/tracks/start-freelancing/' },
    ],
    sources: taxSources,
  },
  {
    slug: 'quarterly-tax-estimate-calculator',
    area: 'business',
    group: 'Tax',
    title: 'Quarterly Tax Estimate Calculator: Plan Payments Without Guessing | Kefiw',
    h1: 'Quarterly Tax Estimate Calculator',
    description: 'Estimate remaining quarterly tax payments from annual tax, withholding, payments already made, quarters left, and a reserve cushion.',
    keywords: ['quarterly tax calculator uneven income', 'quarterly tax catch up calculator', 'what if I missed quarterly taxes', 'how much to pay quarterly taxes if income changes'],
    summary: 'Turn quarterly taxes from a panic event into a recurring operating rhythm.',
    tagline: 'Make tax payments boring.',
    promise: 'Plan payments without guessing when income changes, a quarter is late, or cash is tight.',
    bestFor: 'Self-employed workers and small-business owners who need a catch-up plan or a boring recurring tax rhythm.',
    seoTargets: ['what if I missed a quarterly tax payment', 'quarterly tax calculator uneven income', 'quarterly tax catch up calculator'],
    monetizationFit: ['tax software', 'bookkeeping software', 'CPA review', 'business banking'],
    riskProfile: 'federal-tax',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'U.S. federal estimated-tax due dates, safe-harbor framing, Form 1040-ES, Publication 505, and uneven-income caveats.',
    kind: 'quarterly-tax',
    fields: [
      { id: 'annualTax', label: 'Estimated annual tax', type: 'number', defaultValue: 24500, min: 0, max: 5000000, step: 500, prefix: '$' },
      { id: 'withheld', label: 'Withholding and payments already made', type: 'number', defaultValue: 6000, min: 0, max: 5000000, step: 500, prefix: '$' },
      { id: 'quartersLeft', label: 'Payment periods left', type: 'number', defaultValue: 4, min: 1, max: 4, step: 1 },
      { id: 'cushionPct', label: 'Reserve cushion', type: 'number', defaultValue: 5, min: 0, max: 50, step: 1, suffix: '%' },
    ],
    assumptions: ['Estimated tax rules are pay-as-you-go and depend on prior-year safe harbor rules.', 'Use official Form 1040-ES or a tax professional before sending payments.'],
    sections: taxSections,
    related: [
      { label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
      { label: 'Dangerous Deduction Checker', href: '/business/dangerous-deduction-checker/' },
    ],
    sources: taxSources,
  },
  {
    slug: 'self-employed-deduction-finder',
    area: 'business',
    group: 'Tax',
    title: 'Self-Employed Deduction Finder: Expense Checklist Calculator | Kefiw',
    h1: 'Self-Employed Deduction Finder',
    description: 'Estimate common business deductions and flag the documentation needed to justify mileage, home office, software, phone, meals, travel, and equipment.',
    keywords: ['self employed deduction checklist calculator', 'business expense or personal expense checker', 'what can I deduct as a freelancer calculator'],
    summary: 'Find the expenses hiding in plain sight without pretending every expense is automatically safe.',
    tagline: 'Find the expenses hiding in plain sight.',
    promise: 'Review common deduction categories and the records needed to justify them.',
    bestFor: 'Freelancers, consultants, and small-business owners turning messy expenses into a record checklist.',
    seoTargets: ['self employed deduction checklist calculator', 'business expense or personal expense checker', 'what can I deduct as a freelancer calculator'],
    monetizationFit: ['receipt tracking', 'bookkeeping software', 'tax prep', 'accountant marketplace'],
    riskProfile: 'deduction-risk',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'IRS business-expense resource guide, Schedule C instructions, 2026 mileage rate, and simplified home-office guidance.',
    kind: 'deduction-planner',
    fields: [
      { id: 'businessMiles', label: 'Business miles', type: 'number', defaultValue: 3200, min: 0, max: 200000, step: 100, suffix: 'mi' },
      { id: 'homeOfficeSqft', label: 'Home office square feet', type: 'number', defaultValue: 120, min: 0, max: 3000, step: 10, suffix: 'sq ft' },
      { id: 'software', label: 'Software and subscriptions', type: 'number', defaultValue: 2400, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'phoneInternet', label: 'Phone and internet business portion', type: 'number', defaultValue: 1200, min: 0, max: 50000, step: 50, prefix: '$' },
      { id: 'meals', label: 'Business meals', type: 'number', defaultValue: 900, min: 0, max: 50000, step: 50, prefix: '$' },
      { id: 'travel', label: 'Business travel', type: 'number', defaultValue: 1800, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'equipment', label: 'Equipment and supplies', type: 'number', defaultValue: 3500, min: 0, max: 500000, step: 100, prefix: '$' },
    ],
    assumptions: ['Uses the 2026 standard business mileage rate for mileage estimates.', 'Deductibility depends on business purpose, substantiation, and tax facts.'],
    sections: taxSections,
    related: [
      { label: 'Dangerous Deduction Checker', href: '/business/dangerous-deduction-checker/' },
      { label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
    ],
    sources: deductionSources,
  },
  {
    slug: 'dangerous-deduction-checker',
    area: 'business',
    group: 'Tax',
    title: 'Dangerous Deduction Checker: Spot Risky Expenses | Kefiw',
    h1: 'Dangerous Deduction Checker',
    description: 'Spot expenses that need a second look before you rely on them: home office, vehicle, meals, travel, family payroll, contractors, hobby losses, and mixed-use assets.',
    keywords: ['dangerous deductions self employed', 'risky tax deductions', 'is this deduction too aggressive', 'home office deduction risk checker', 'mixed use expense calculator'],
    summary: 'Do not chase a deduction that creates more stress than savings.',
    tagline: 'Keep the deduction. Lose the panic.',
    promise: 'Check whether an expense looks clean, mixed-use, underdocumented, or worth professional review.',
    bestFor: 'Freelancers, creators, consultants, sole proprietors, and small-business owners with messy expenses.',
    seoTargets: ['dangerous deductions self employed', 'risky tax deductions', 'mixed use expense calculator', 'business expense or personal expense checker'],
    monetizationFit: ['bookkeeping software', 'receipt tracking', 'tax prep', 'accountant marketplace'],
    riskProfile: 'deduction-risk',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'IRS business-expense resource guide, Schedule C instructions, 2026 mileage rate, and simplified home-office guidance.',
    kind: 'deduction-planner',
    fields: [
      { id: 'businessMiles', label: 'Business miles without complete log', type: 'number', defaultValue: 5000, min: 0, max: 200000, step: 100, suffix: 'mi' },
      { id: 'homeOfficeSqft', label: 'Home office square feet claimed', type: 'number', defaultValue: 220, min: 0, max: 3000, step: 10, suffix: 'sq ft' },
      { id: 'software', label: 'Mixed-use software / phone / internet', type: 'number', defaultValue: 2500, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'phoneInternet', label: 'Family or related-party payments', type: 'number', defaultValue: 0, min: 0, max: 500000, step: 100, prefix: '$' },
      { id: 'meals', label: 'Meals and entertainment-like spend', type: 'number', defaultValue: 1800, min: 0, max: 50000, step: 50, prefix: '$' },
      { id: 'travel', label: 'Travel with personal days', type: 'number', defaultValue: 2500, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'equipment', label: 'Equipment used personally too', type: 'number', defaultValue: 4500, min: 0, max: 500000, step: 100, prefix: '$' },
    ],
    assumptions: ['This flags substantiation risk, not audit odds.', 'If a deduction is large, mixed-use, or unusual for the business, document the business purpose.'],
    sections: taxSections,
    related: [
      { label: 'Deduction Finder', href: '/business/self-employed-deduction-finder/' },
      { label: 'Quarterly Tax Estimate', href: '/business/quarterly-tax-estimate-calculator/' },
    ],
    sources: deductionSources,
  },
  {
    slug: 'business-expense-budget-calculator',
    area: 'business',
    group: 'Pricing',
    title: 'Business Expense Budget Calculator: Monthly Operating Cost | Kefiw',
    h1: 'Business Expense Budget Calculator',
    description: 'Turn software, insurance, travel, contractors, equipment, tax reserve, and owner pay into a monthly business expense budget.',
    keywords: ['small business monthly expense calculator', 'freelance business expense budget', 'consultant operating cost calculator', 'solo business budget calculator'],
    summary: 'Know the cost of staying open before profit disappears into tools, fees, and overhead.',
    tagline: 'Know the cost of staying open.',
    promise: 'Estimate recurring business expenses before profit disappears into tools, fees, and overhead.',
    bestFor: 'Solo operators, consultants, and small teams building a rate, break-even, or cash-reserve plan.',
    seoTargets: ['small business monthly expense calculator', 'freelance business expense budget', 'consultant operating cost calculator'],
    monetizationFit: ['business banking', 'bookkeeping software', 'expense management', 'budgeting tools'],
    kind: 'deduction-planner',
    fields: [
      { id: 'businessMiles', label: 'Business miles', type: 'number', defaultValue: 1200, min: 0, max: 200000, step: 100, suffix: 'mi' },
      { id: 'homeOfficeSqft', label: 'Home office square feet', type: 'number', defaultValue: 100, min: 0, max: 3000, step: 10, suffix: 'sq ft' },
      { id: 'software', label: 'Software and subscriptions', type: 'number', defaultValue: 6000, min: 0, max: 1000000, step: 100, prefix: '$' },
      { id: 'phoneInternet', label: 'Phone / internet / utilities', type: 'number', defaultValue: 2400, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'meals', label: 'Meals / client development', type: 'number', defaultValue: 1200, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'travel', label: 'Travel / conferences', type: 'number', defaultValue: 3000, min: 0, max: 500000, step: 100, prefix: '$' },
      { id: 'equipment', label: 'Equipment / insurance / professional fees', type: 'number', defaultValue: 8500, min: 0, max: 1000000, step: 100, prefix: '$' },
    ],
    assumptions: ['Budget output is annualized and should be reconciled to bank and card records.', 'Tax deductibility is separate from cash budgeting.'],
    sections: pricingSections,
    related: [
      { label: 'Freelance Rate', href: '/calculators/minimum-viable-rate/' },
      { label: 'Start Freelancing Track', href: '/tracks/start-freelancing/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'llc-vs-s-corp-calculator',
    area: 'business',
    group: 'Tax',
    title: 'LLC vs S-Corp Calculator: Break-Even After Admin Costs | Kefiw',
    h1: 'LLC vs S-Corp Calculator',
    description: 'Compare sole proprietor or LLC self-employment tax against an S-corp salary and distribution model, including payroll/admin cost.',
    keywords: ['is s corp worth it at 80k', 'llc vs s corp break even calculator', 's corp worth it after payroll costs', 'llc vs s corp calculator with admin costs'],
    summary: 'Do not form an entity around a fantasy spreadsheet.',
    tagline: 'Do not form an entity around a fantasy spreadsheet.',
    promise: 'Compare savings, admin, payroll, and flexibility before changing tax treatment.',
    bestFor: 'Profitable freelancers and small-business owners testing whether S-corp treatment survives admin drag.',
    seoTargets: ['is s corp worth it at 80k', 'llc vs s corp break even calculator', 's corp worth it after payroll costs'],
    monetizationFit: ['payroll software', 'tax prep', 'CPA review', 'entity formation services'],
    riskProfile: 's-corp',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'IRS S-corp reasonable-compensation guidance, federal payroll baseline, and Social Security wage base. State fees are user-entered assumptions.',
    kind: 's-corp',
    fields: [
      { id: 'profit', label: 'Business profit before owner pay', type: 'number', defaultValue: 160000, min: 0, max: 10000000, step: 1000, prefix: '$' },
      { id: 'salary', label: 'Reasonable salary estimate', type: 'number', defaultValue: 85000, min: 0, max: 10000000, step: 1000, prefix: '$' },
      { id: 'payrollAdmin', label: 'Payroll, bookkeeping, tax admin', type: 'number', defaultValue: 3200, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'stateCorpCost', label: 'State / franchise / filing cost', type: 'number', defaultValue: 800, min: 0, max: 100000, step: 100, prefix: '$' },
    ],
    assumptions: ['S-corp owners generally need a reasonable salary before distributions.', 'This is a planning estimate, not entity-selection advice.'],
    sections: taxSections,
    related: [
      { label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/' },
      { label: 'Reasonable Salary Planner', href: '/business/reasonable-salary-planner/' },
    ],
    sources: sCorpSources,
  },
  {
    slug: 's-corp-tax-savings-calculator',
    area: 'business',
    group: 'Tax',
    title: 'S-Corp Tax Savings Calculator: Savings After Payroll Cost | Kefiw',
    h1: 'S-Corp Tax Savings Calculator',
    description: 'Estimate possible payroll-tax savings from S-corp treatment after salary, payroll tax, admin cost, and state cost.',
    keywords: ['s corp savings after payroll cost', 's corp tax savings with reasonable salary', 's corp break even income calculator', 's corp savings not worth it'],
    summary: 'Savings are only savings after the admin is paid for.',
    tagline: 'Savings are only savings after the admin is paid for.',
    promise: 'Estimate possible S-corp savings after salary, payroll, bookkeeping, and state costs.',
    bestFor: 'Owners with enough profit to consider S-corp treatment but enough uncertainty to want a conservative spread.',
    seoTargets: ['s corp savings after payroll cost', 's corp tax savings with reasonable salary', 's corp break even income calculator'],
    monetizationFit: ['payroll software', 'tax prep', 'CPA review', 'bookkeeping software'],
    riskProfile: 's-corp',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'IRS S-corp reasonable-compensation guidance, federal payroll baseline, and Social Security wage base. State fees are user-entered assumptions.',
    kind: 's-corp',
    fields: [
      { id: 'profit', label: 'Business profit before owner pay', type: 'number', defaultValue: 180000, min: 0, max: 10000000, step: 1000, prefix: '$' },
      { id: 'salary', label: 'Reasonable salary estimate', type: 'number', defaultValue: 95000, min: 0, max: 10000000, step: 1000, prefix: '$' },
      { id: 'payrollAdmin', label: 'Payroll, bookkeeping, tax admin', type: 'number', defaultValue: 3600, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'stateCorpCost', label: 'State / franchise / filing cost', type: 'number', defaultValue: 800, min: 0, max: 100000, step: 100, prefix: '$' },
    ],
    assumptions: ['Savings can disappear if salary is understated, admin cost is high, or state taxes offset the benefit.', 'Reasonable salary is a facts-and-circumstances issue.'],
    sections: taxSections,
    related: [
      { label: 'LLC vs S-Corp', href: '/business/llc-vs-s-corp-calculator/' },
      { label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
    ],
    sources: sCorpSources,
  },
  {
    slug: 'reasonable-salary-planner',
    area: 'business',
    group: 'Tax',
    title: 'Reasonable Salary Planner: S-Corp Owner Pay | Kefiw',
    h1: 'Reasonable Salary Planner',
    description: 'Plan a reasonable salary discussion by comparing business profit, proposed salary, remaining distributions, and S-corp savings sensitivity.',
    keywords: ['reasonable salary calculator s corp owner', 'how much should I pay myself in an s corp', 'reasonable salary for solo s corp consultant', 's corp salary vs distribution calculator'],
    summary: 'Pay yourself like an operator, not a loophole.',
    tagline: 'Pay yourself like an operator, not a loophole.',
    promise: 'Build a practical owner salary assumption for S-corp planning.',
    bestFor: 'Solo S-corp owners and consultants who need a defensible salary assumption before trusting distribution math.',
    seoTargets: ['reasonable salary calculator s corp owner', 'how much should I pay myself in an s corp', 's corp salary vs distribution calculator'],
    monetizationFit: ['payroll software', 'CPA review', 'bookkeeping software'],
    riskProfile: 's-corp',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'IRS S-corp reasonable-compensation guidance and federal payroll baseline. This planner creates salary assumptions, not a legal salary determination.',
    kind: 's-corp',
    fields: [
      { id: 'profit', label: 'Business profit before owner pay', type: 'number', defaultValue: 150000, min: 0, max: 10000000, step: 1000, prefix: '$' },
      { id: 'salary', label: 'Proposed owner salary', type: 'number', defaultValue: 90000, min: 0, max: 10000000, step: 1000, prefix: '$' },
      { id: 'payrollAdmin', label: 'Payroll/admin cost', type: 'number', defaultValue: 3000, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'stateCorpCost', label: 'State/entity cost', type: 'number', defaultValue: 500, min: 0, max: 100000, step: 100, prefix: '$' },
    ],
    assumptions: ['Use market pay, role scope, hours, skill level, and business facts to support salary.', 'Do not use this as a substitute for CPA advice.'],
    sections: taxSections,
    related: [
      { label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/' },
      { label: 'Start Freelancing Track', href: '/tracks/start-freelancing/' },
    ],
    sources: sCorpSources,
  },
  {
    slug: 'contractor-vs-employee-calculator',
    area: 'business',
    group: 'Hiring',
    title: 'Contractor vs Employee Cost Calculator: Compare Real Cost of Help | Kefiw',
    h1: 'Contractor vs Employee Cost Calculator',
    description: 'Compare contractor cost against employee wage, payroll burden, benefits, equipment, management, and utilization.',
    keywords: ['contractor vs employee cost calculator small business', 'contractor rate vs employee salary calculator', 'freelancer vs employee cost', 'contractor vs employee hidden costs'],
    summary: 'Know whether you need capacity, commitment, flexibility, or control before you pay for it.',
    tagline: 'Choose the kind of help you actually need.',
    promise: 'Compare cost, flexibility, control, management burden, and commitment.',
    bestFor: 'Owners deciding whether the next helper should be contractor, employee, agency, or a smaller role.',
    seoTargets: ['contractor vs employee cost calculator small business', 'contractor rate vs employee salary calculator', 'contractor vs employee hidden costs'],
    monetizationFit: ['payroll providers', 'HR software', 'contract management', 'bookkeeping software'],
    riskProfile: 'worker-classification',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'IRS federal employment-tax classification framing, Form SS-8 process, and DOL 2026 FLSA rulemaking status. State classification rules are not modeled.',
    kind: 'contractor-employee',
    fields: [
      { id: 'contractorRate', label: 'Contractor hourly rate', type: 'number', defaultValue: 85, min: 0, max: 1000, step: 5, prefix: '$' },
      { id: 'employeeRate', label: 'Employee hourly wage', type: 'number', defaultValue: 52, min: 0, max: 1000, step: 1, prefix: '$' },
      { id: 'hours', label: 'Annual hours needed', type: 'number', defaultValue: 1200, min: 0, max: 4000, step: 50, suffix: 'hrs' },
      { id: 'burdenPct', label: 'Payroll burden and benefits', type: 'number', defaultValue: 28, min: 0, max: 100, step: 1, suffix: '%' },
      { id: 'employeeOverhead', label: 'Equipment, management, software', type: 'number', defaultValue: 8500, min: 0, max: 200000, step: 500, prefix: '$' },
    ],
    assumptions: ['Classification is legal and fact-specific. The cheaper option is not automatically compliant.', 'Use this for budgeting, not worker-classification advice.'],
    sections: hiringSections,
    related: [
      { label: 'Payroll Burden Calculator', href: '/business/payroll-burden-calculator/' },
      { label: 'Revenue per Employee', href: '/business/revenue-per-employee-calculator/' },
    ],
    sources: [...hiringSources, ...payrollSources],
  },
  {
    slug: 'payroll-burden-calculator',
    area: 'business',
    group: 'Hiring',
    title: 'Payroll Burden Calculator: True Cost of an Employee | Kefiw',
    h1: 'Payroll Burden Calculator',
    description: 'Estimate employee cost after payroll taxes, benefits, insurance, tools, software, management, and overhead.',
    keywords: ['payroll burden calculator small business', 'employee true cost calculator', 'salary plus payroll taxes calculator', 'first employee cost calculator'],
    summary: 'See the cost beyond salary before the first payroll run makes it real.',
    tagline: 'Salary is only the first line.',
    promise: 'Estimate the true cost of an employee beyond base pay.',
    bestFor: 'Owners budgeting a first employee, a replacement hire, or a role that may not carry itself yet.',
    seoTargets: ['payroll burden calculator small business', 'employee true cost calculator', 'first employee cost calculator'],
    monetizationFit: ['payroll providers', 'HR software', 'benefits brokers', 'bookkeeping software'],
    riskProfile: 'payroll',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: '2026 federal payroll-tax baseline from IRS Publication 15 and Publication 15-A. State payroll, insurance, benefits, workers comp, and local taxes are user-entered planning assumptions.',
    kind: 'contractor-employee',
    fields: [
      { id: 'contractorRate', label: 'Contractor comparison rate', type: 'number', defaultValue: 80, min: 0, max: 1000, step: 5, prefix: '$' },
      { id: 'employeeRate', label: 'Employee hourly wage', type: 'number', defaultValue: 50, min: 0, max: 1000, step: 1, prefix: '$' },
      { id: 'hours', label: 'Annual paid hours', type: 'number', defaultValue: 2080, min: 0, max: 4000, step: 40, suffix: 'hrs' },
      { id: 'burdenPct', label: 'Payroll burden and benefits', type: 'number', defaultValue: 30, min: 0, max: 100, step: 1, suffix: '%' },
      { id: 'employeeOverhead', label: 'Annual employee overhead', type: 'number', defaultValue: 9000, min: 0, max: 200000, step: 500, prefix: '$' },
    ],
    assumptions: ['Federal Social Security, Medicare, Additional Medicare, and FUTA rules are only part of payroll burden.', 'State payroll taxes, benefits, insurance, workers comp, PTO, equipment, software, recruiting, training, and management time vary by state and role.'],
    sections: hiringSections,
    related: [
      { label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/' },
      { label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/' },
    ],
    sources: payrollSources,
  },
  {
    slug: 'minimum-viable-freelance-rate-calculator',
    area: 'business',
    group: 'Pricing',
    title: 'Minimum Viable Freelance Rate Calculator: Price Work Without Underpaying Yourself | Kefiw',
    h1: 'Minimum Viable Freelance Rate Calculator',
    description: 'Find the lowest freelance or consulting rate that still covers taxes, expenses, non-billable time, slow months, and actual take-home needs.',
    keywords: ['minimum viable freelance rate calculator', 'freelance rate if I only bill 20 hours', 'freelance rate calculator take home pay', 'consultant rate after taxes and expenses'],
    summary: 'Find the lowest rate that still respects your time, taxes, expenses, and energy.',
    tagline: 'Charge enough to keep doing the work well.',
    promise: 'Find a rate that covers taxes, expenses, non-billable time, and actual take-home needs.',
    bestFor: 'Freelancers, consultants, and fractional workers whose hourly rate feels high but take-home still feels thin.',
    seoTargets: ['freelance rate if I only bill 20 hours', 'freelance rate calculator take home pay', 'minimum viable freelance rate calculator'],
    monetizationFit: ['invoicing tools', 'proposal software', 'business banking', 'bookkeeping software'],
    kind: 'freelance-rate',
    fields: freelanceRateFields,
    assumptions: ['Billable hours are the constraint. Admin, sales, rework, and downtime still need to be funded.', 'This is a pricing floor, not a brand-positioning ceiling.'],
    sections: pricingSections,
    related: [
      { label: 'Business Expense Budget', href: '/business/business-expense-budget-calculator/' },
      { label: 'Break-Even Calculator', href: '/business/break-even-calculator/' },
      { label: 'Start Freelancing Track', href: '/tracks/start-freelancing/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'markup-margin-calculator',
    area: 'business',
    group: 'Pricing',
    title: 'Markup & Margin Calculator: Stop Confusing Revenue With Profit | Kefiw',
    h1: 'Markup & Margin Calculator',
    description: 'Understand how price, direct cost, overhead, discounts, markup, and target margin interact before a busy business feels broke.',
    keywords: ['markup vs margin calculator for small business', 'price increase margin calculator', 'what markup do I need to make profit', 'margin calculator with overhead'],
    summary: 'See whether your price actually protects the business.',
    tagline: 'Revenue is not the same as breathing room.',
    promise: 'Understand how price, cost, markup, and margin interact.',
    bestFor: 'Service businesses, contractors, consultants, and small sellers testing discounts, cost creep, and margin targets.',
    seoTargets: ['markup vs margin calculator for small business', 'price increase margin calculator', 'margin calculator with overhead'],
    monetizationFit: ['pricing software', 'bookkeeping software', 'proposal tools'],
    kind: 'margin-pricing',
    fields: marginPricingFields,
    assumptions: ['Margin is calculated after direct cost and overhead share.', 'Discounts should be tested against profit dollars, not just close rate.'],
    sections: pricingSections,
    related: [
      { label: 'Profit Calculator', href: '/business/profit-calculator/' },
      { label: 'Break-Even Calculator', href: '/business/break-even-calculator/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'break-even-calculator',
    area: 'business',
    group: 'Pricing',
    title: 'Break-Even Calculator: Know How Much Work Keeps the Business Alive | Kefiw',
    h1: 'Break-Even Calculator',
    description: 'Calculate the revenue, clients, or units needed to cover fixed costs, owner pay, variable costs, and cash reserve.',
    keywords: ['break even calculator for service business', 'break even calculator for solo business', 'how many clients to break even', 'break even with monthly expenses calculator'],
    summary: 'Understand the point where the business stops bleeding and starts building.',
    tagline: 'Find the line between surviving and building.',
    promise: 'Calculate the revenue, clients, or units needed to cover costs.',
    bestFor: 'Owners deciding whether pricing, volume, fixed costs, or owner pay makes the model too fragile.',
    seoTargets: ['break even calculator for service business', 'how many clients to break even', 'break even with monthly expenses calculator'],
    monetizationFit: ['bookkeeping software', 'budgeting tools', 'business banking'],
    kind: 'break-even',
    fields: breakEvenFields,
    assumptions: ['Break-even is a floor. The business still needs tax reserve, working capital, and profit.', 'Average sale value should be collected cash, not wishful pipeline.'],
    sections: pricingSections,
    related: [
      { label: 'Minimum Viable Freelance Rate', href: '/business/minimum-viable-freelance-rate-calculator/' },
      { label: 'Sales Target Calculator', href: '/business/sales-target-calculator/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'profit-calculator',
    area: 'business',
    group: 'Pricing',
    title: 'Profit Calculator: Separate Owner Pay, Tax Reserve, and Retained Profit | Kefiw',
    h1: 'Profit Calculator',
    description: 'Separate revenue, direct costs, operating expenses, owner pay, tax reserve, and retained profit so the business can keep what it earns.',
    keywords: ['profit calculator after owner pay', 'small business profit calculator after taxes', 'consultant profit margin calculator', 'freelance profit calculator'],
    summary: 'See what the business keeps after the human and tax reality are represented.',
    tagline: 'See what the business keeps.',
    promise: 'Separate revenue, expenses, owner pay, taxes, and retained profit.',
    bestFor: 'Operators who need to know whether revenue is becoming durable profit or only more activity.',
    seoTargets: ['profit calculator after owner pay', 'small business profit calculator after taxes', 'consultant profit margin calculator'],
    monetizationFit: ['bookkeeping software', 'business banking', 'tax planning'],
    kind: 'profit-plan',
    fields: profitPlanFields,
    assumptions: ['Owner pay is treated as part of the plan, not whatever is left over.', 'Tax reserve is a planning estimate and may not match final tax liability.'],
    sections: pricingSections,
    related: [
      { label: 'Markup & Margin', href: '/business/markup-margin-calculator/' },
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'hire-vs-automate-calculator',
    area: 'business',
    group: 'Hiring',
    title: 'Hire vs Automate Calculator: Decide What Kind of Help You Actually Need | Kefiw',
    h1: 'Hire vs Automate Calculator',
    description: 'Compare people, automation, delegation, and deletion before adding overhead to a workflow that may need simplification first.',
    keywords: ['hire vs automate calculator', 'should I hire or automate', 'AI automation ROI calculator small business', 'automate before hiring calculator'],
    summary: 'Do not add a person to fix a process that should have been simplified first.',
    tagline: 'Do not hire your way around a broken process.',
    promise: 'Compare people, automation, delegation, and deletion before adding overhead.',
    bestFor: 'Owners deciding whether the next move is a person, a contractor, automation, documentation, or deleting low-value work.',
    seoTargets: ['hire vs automate calculator', 'should I hire or automate', 'automate before hiring calculator'],
    monetizationFit: ['automation tools', 'workflow software', 'AI tools', 'operations consultants'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'AI, SaaS, and technology-spend planning baseline from FinOps Foundation sources. Tool/vendor pricing remains user-entered and vendor-specific.',
    kind: 'hire-automate',
    fields: hireAutomateFields,
    assumptions: ['Automation coverage is the portion of work truly removed, not demo magic.', 'Review work, exceptions, and maintenance still count.'],
    sections: hiringSections,
    related: [
      { label: 'Payroll Burden', href: '/business/payroll-burden-calculator/' },
      { label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/' },
    ],
    sources: [...technologySpendSources, ...businessPlanningSources],
  },
  {
    slug: 'revenue-per-employee-calculator',
    area: 'business',
    group: 'Hiring',
    title: 'Revenue per Employee Calculator: Can Growth Carry the Team? | Kefiw',
    h1: 'Revenue per Employee Calculator',
    description: 'Estimate whether current or planned revenue can support headcount, loaded employee cost, overhead, and profit target.',
    keywords: ['revenue per employee calculator small business', 'how much revenue before hiring', 'revenue needed for first employee', 'employee affordability calculator'],
    summary: 'Make sure growth can carry the team before the hire becomes permanent pressure.',
    tagline: 'Make sure growth can carry the team.',
    promise: 'Estimate whether revenue supports current or planned headcount.',
    bestFor: 'Owners testing whether a first employee, next employee, or team expansion can carry itself.',
    seoTargets: ['how much revenue before hiring', 'revenue needed for first employee', 'employee affordability calculator'],
    monetizationFit: ['payroll providers', 'HR software', 'bookkeeping software'],
    riskProfile: 'payroll',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'Federal payroll baseline where payroll cost assumptions are used. Revenue-per-employee economics are business-planning estimates, not payroll advice.',
    kind: 'operating-leverage',
    fields: operatingLeverageFields,
    assumptions: ['This uses operating leverage as a headcount affordability frame.', 'Role-specific profitability and utilization still need separate review.'],
    sections: hiringSections,
    related: [
      { label: 'Payroll Burden', href: '/business/payroll-burden-calculator/' },
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/' },
    ],
    sources: [...payrollSources, ...businessPlanningSources],
  },
  {
    slug: 'revenue-forecast-calculator',
    area: 'business',
    group: 'Revenue',
    title: 'Revenue Forecast Calculator: Turn Hope Into a Testable Plan | Kefiw',
    h1: 'Revenue Forecast Calculator',
    description: 'Forecast revenue using leads, close rate, deal value, churn, and collection delay so the assumptions are visible.',
    keywords: ['small business revenue forecast calculator', 'consultant revenue forecast', 'freelance income forecast calculator', 'revenue forecast with churn'],
    summary: 'See what has to happen before you build your life around a revenue number.',
    tagline: 'Turn hope into a testable plan.',
    promise: 'Forecast revenue using assumptions you can actually inspect.',
    bestFor: 'Operators who need a forecast that shows leads, churn, and cash timing instead of one optimistic number.',
    seoTargets: ['small business revenue forecast calculator', 'revenue forecast with churn', 'freelance income forecast calculator'],
    monetizationFit: ['CRM tools', 'bookkeeping software', 'forecasting tools'],
    kind: 'revenue-forecast',
    fields: revenueForecastFields,
    assumptions: ['Forecast output is a stress test, not a promise.', 'Collection delay can make revenue grow while cash feels worse.'],
    sections: revenueSections,
    related: [
      { label: 'Sales Target', href: '/business/sales-target-calculator/' },
      { label: 'Churn Calculator', href: '/business/churn-calculator/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'sales-target-calculator',
    area: 'business',
    group: 'Revenue',
    title: 'Sales Target Calculator: Know the Activity Behind the Revenue Goal | Kefiw',
    h1: 'Sales Target Calculator',
    description: 'Convert a revenue gap into required deals, proposals, leads, close rates, and sales-cycle timing.',
    keywords: ['sales target calculator small business', 'how many leads to hit revenue goal', 'client target calculator', 'consulting sales target calculator'],
    summary: 'Turn "we need more sales" into the actual leads, proposals, and closes required.',
    tagline: 'Know the activity behind the goal.',
    promise: 'Convert revenue goals into leads, proposals, close rates, and deal sizes.',
    bestFor: 'Small teams and consultants who need to know whether the sales goal is physically plausible.',
    seoTargets: ['how many leads to hit revenue goal', 'sales target calculator small business', 'consulting sales target calculator'],
    monetizationFit: ['CRM tools', 'proposal software', 'sales automation'],
    kind: 'sales-target',
    fields: salesTargetFields,
    assumptions: ['Close rate and sales-cycle inputs usually drive the result more than motivation.', 'Lead counts should be qualified leads, not raw traffic.'],
    sections: revenueSections,
    related: [
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/' },
      { label: 'Break-Even Calculator', href: '/business/break-even-calculator/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'churn-calculator',
    area: 'business',
    group: 'Revenue',
    title: 'Churn Calculator: See How Much Revenue Is Quietly Leaking | Kefiw',
    h1: 'Churn Calculator',
    description: 'Estimate how lost customers, clients, retainers, or subscribers affect revenue after expansion and replacement sales.',
    keywords: ['churn calculator for small business', 'subscription churn what if calculator', 'client churn calculator', 'retainer churn calculator'],
    summary: 'Find the leak before you blame growth.',
    tagline: 'Find the leak before chasing more growth.',
    promise: 'Estimate how lost customers, clients, or subscribers affect revenue.',
    bestFor: 'Subscription businesses, agencies, consultants, and retainer-heavy operators watching revenue leak out the back door.',
    seoTargets: ['churn calculator for small business', 'retainer churn calculator', 'subscription churn what if calculator'],
    monetizationFit: ['CRM tools', 'customer success tools', 'analytics tools'],
    kind: 'churn',
    fields: churnFields,
    assumptions: ['Churn can be revenue churn or customer churn; this page focuses on revenue pressure.', 'Expansion can hide retention problems until good customers leave.'],
    sections: revenueSections,
    related: [
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/' },
      { label: 'Subscription Pricing', href: '/business/subscription-pricing-calculator/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'subscription-pricing-calculator',
    area: 'business',
    group: 'Revenue',
    title: 'Subscription Pricing Calculator: Price Recurring Revenue Without Guessing | Kefiw',
    h1: 'Subscription Pricing Calculator',
    description: 'Model monthly price, annual discount, churn, acquisition cost, gross margin, and payback for a subscription or retainer offer.',
    keywords: ['subscription pricing calculator', 'monthly vs annual pricing calculator', 'subscription break even calculator', 'pricing subscription service calculator'],
    summary: 'Price recurring revenue without pretending churn and acquisition cost do not exist.',
    tagline: 'Price recurring revenue without guessing.',
    promise: 'Model monthly, annual, churn, acquisition, and margin assumptions.',
    bestFor: 'Operators launching retainers, memberships, SaaS, subscriptions, or annual plans.',
    seoTargets: ['monthly vs annual pricing calculator', 'subscription break even calculator', 'pricing subscription service calculator'],
    monetizationFit: ['billing software', 'subscription analytics', 'CRM tools'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'Subscription economics are business-planning assumptions. Vendor pricing, cancellation terms, and billing rules need vendor-specific verification.',
    kind: 'subscription-pricing',
    fields: subscriptionPricingFields,
    assumptions: ['Annual discounts improve cash timing but can hide churn and support obligations.', 'Acquisition cost should include time, commissions, discounts, and ad spend when known.'],
    sections: revenueSections,
    related: [
      { label: 'Churn Calculator', href: '/business/churn-calculator/' },
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/' },
    ],
    sources: [...technologySpendSources, ...businessPlanningSources],
  },
  {
    slug: 'operating-leverage-calculator',
    area: 'business',
    group: 'Revenue',
    title: 'Operating Leverage Calculator: When Does Growth Become Profitable? | Kefiw',
    h1: 'Operating Leverage Calculator',
    description: 'See how fixed costs, variable costs, and revenue growth affect profit when the business gets bigger.',
    keywords: ['operating leverage calculator small business', 'fixed cost leverage calculator', 'revenue growth profit calculator', 'when does growth become profitable calculator'],
    summary: 'Growth should make the business lighter, not just bigger.',
    tagline: 'Growth should make the business lighter, not just bigger.',
    promise: 'See how fixed costs and revenue growth affect profit.',
    bestFor: 'Owners testing whether growth improves profit or just adds a heavier cost structure.',
    seoTargets: ['operating leverage calculator small business', 'revenue growth profit calculator', 'when does growth become profitable calculator'],
    monetizationFit: ['forecasting tools', 'bookkeeping software', 'financial planning'],
    kind: 'operating-leverage',
    fields: operatingLeverageFields,
    assumptions: ['Fixed costs only create leverage if they do not grow as fast as revenue.', 'Variable costs should include fulfillment, transaction, support, and contractor pressure.'],
    sections: revenueSections,
    related: [
      { label: 'Profit Calculator', href: '/business/profit-calculator/' },
      { label: 'Revenue Forecast', href: '/business/revenue-forecast-calculator/' },
    ],
    sources: businessPlanningSources,
  },
  {
    slug: 'saas-cost-calculator',
    area: 'business',
    group: 'Cloud',
    title: 'SaaS Cost Calculator: See What Your Software Stack Really Costs | Kefiw',
    h1: 'SaaS Cost Calculator',
    description: 'Estimate monthly and annual software spend across base subscriptions, seats, inactive users, duplicate tools, and price increases.',
    keywords: ['SaaS cost calculator for small business', 'software subscription cost calculator', 'monthly software stack calculator', 'SaaS spend audit calculator'],
    summary: 'Find the subscriptions that became invisible because they were "only monthly."',
    tagline: 'Your tools are part of payroll now.',
    promise: 'Estimate monthly and annual software spend across teams, roles, and seats.',
    bestFor: 'Small teams and technical operators cleaning up unused subscriptions, duplicate tools, and silent price increases.',
    seoTargets: ['SaaS cost calculator for small business', 'software subscription cost calculator', 'SaaS spend audit calculator'],
    monetizationFit: ['SaaS management tools', 'expense management', 'procurement software'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'FinOps SaaS and licensing baseline. Individual vendor pricing, cancellation terms, true-up/down rules, and renewal language are not verified here.',
    kind: 'saas-cost',
    fields: saasCostFields,
    assumptions: ['This is a spend audit frame, not a vendor procurement model.', 'Unused seats and duplicate tools are usually the first cleanup pass.'],
    sections: techSpendSections,
    related: [
      { label: 'Seat Cost Calculator', href: '/business/seat-cost-calculator/' },
      { label: 'Subscription vs Lifetime', href: '/business/subscription-vs-lifetime-crossover-calculator/' },
    ],
    sources: technologySpendSources,
  },
  {
    slug: 'cloud-cost-calculator',
    area: 'business',
    group: 'Cloud',
    title: 'Cloud Cost Calculator: Know What Scale Will Cost Before Scale Arrives | Kefiw',
    h1: 'Cloud Cost Calculator',
    description: 'Model cloud spend, usage growth, environments, data transfer, and overrun buffers before surprise bills become normal.',
    keywords: ['cloud cost calculator for startups', 'cloud bill what if calculator', 'cloud cost overrun calculator', 'cloud cost allocation calculator small team'],
    summary: 'Know what scale will cost before scale arrives.',
    tagline: 'Know what scale will cost before scale arrives.',
    promise: 'Model cloud spend, usage, overages, and growth assumptions.',
    bestFor: 'Startups and small technical teams that need a vendor-neutral cloud bill stress test.',
    seoTargets: ['cloud cost calculator for startups', 'cloud bill what if calculator', 'cloud cost overrun calculator'],
    monetizationFit: ['cloud cost tools', 'FinOps tools', 'observability tools'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'Major-provider pricing-model baseline for AWS, Google Cloud, and Azure. Provider/product-specific prices must be checked in the chosen provider calculator or pricing page.',
    kind: 'cloud-cost',
    fields: cloudCostFields,
    assumptions: ['Provider calculators are useful, but they are usually vendor-specific. This page is a neutral stress test.', 'Environments, overages, and data transfer can matter as much as base compute.'],
    sections: techSpendSections,
    related: [
      { label: 'Cloud Exit Calculator', href: '/business/cloud-exit-calculator/' },
      { label: 'Software ROI', href: '/business/software-roi-calculator/' },
    ],
    sources: cloudSources,
  },
  {
    slug: 'seat-cost-calculator',
    area: 'business',
    group: 'Cloud',
    title: 'Seat Cost Calculator: Unused SaaS Seats Still Get Paid | Kefiw',
    h1: 'Seat Cost Calculator',
    description: 'Find wasted software spend from inactive, unnecessary, or duplicate SaaS seats before renewals lock it in.',
    keywords: ['unused SaaS seats calculator', 'software seat cost calculator', 'per seat pricing calculator', 'SaaS seat audit calculator'],
    summary: 'Unused seats still get paid.',
    tagline: 'Unused seats still get paid.',
    promise: 'Find wasted software spend from inactive or unnecessary seats.',
    bestFor: 'Teams auditing seat-based tools before renewal, headcount changes, or budget cuts.',
    seoTargets: ['unused SaaS seats calculator', 'software seat cost calculator', 'SaaS seat audit calculator'],
    monetizationFit: ['SaaS management tools', 'identity management', 'expense management'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'FinOps SaaS and licensing baseline. Individual vendor pricing, cancellation terms, true-up/down rules, and renewal language are not verified here.',
    kind: 'seat-cost',
    fields: saasCostFields,
    assumptions: ['Seat cleanup should include inactive users, duplicate roles, and tools with overlapping workflows.', 'Do not remove seats required for compliance, audit, or continuity without review.'],
    sections: techSpendSections,
    related: [
      { label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/' },
      { label: 'Software ROI', href: '/business/software-roi-calculator/' },
    ],
    sources: technologySpendSources,
  },
  {
    slug: 'software-roi-calculator',
    area: 'business',
    group: 'Cloud',
    title: 'Software ROI Calculator: Measure the Tool, Not the Sales Pitch | Kefiw',
    h1: 'Software ROI Calculator',
    description: 'Estimate whether software saves time, reduces errors, shifts work, or creates another system to maintain.',
    keywords: ['software ROI calculator small business', 'AI tool ROI calculator', 'tech debt interest calculator', 'software saves time calculator'],
    summary: 'Know whether software saves time, shifts work, or creates another system to maintain.',
    tagline: 'Measure the tool, not the sales pitch.',
    promise: 'Estimate whether software saves time, adds work, or creates future maintenance cost.',
    bestFor: 'Operators deciding whether a tool or AI subscription actually changes the workflow enough to pay for itself.',
    seoTargets: ['software ROI calculator small business', 'AI tool ROI calculator', 'software saves time calculator'],
    monetizationFit: ['software marketplaces', 'automation tools', 'AI tools', 'SaaS management tools'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'AI, SaaS, and technology-spend planning baseline from FinOps Foundation sources. Tool/vendor pricing remains user-entered and vendor-specific.',
    kind: 'software-roi',
    fields: softwareRoiFields,
    assumptions: ['Time saved is discounted by real adoption and reduced by review work.', 'ROI is not real until the workflow changes.'],
    sections: techSpendSections,
    related: [
      { label: 'Hire vs Automate', href: '/business/hire-vs-automate-calculator/' },
      { label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/' },
    ],
    sources: technologySpendSources,
  },
  {
    slug: 'subscription-vs-lifetime-crossover-calculator',
    area: 'business',
    group: 'Cloud',
    title: 'Subscription vs Lifetime Crossover Calculator: Know When Monthly Costs More | Kefiw',
    h1: 'Subscription vs Lifetime Crossover Calculator',
    description: 'Compare monthly, annual, and lifetime software pricing with price increases, expected usage duration, and lifetime-plan risk.',
    keywords: ['subscription vs lifetime license calculator', 'monthly vs lifetime software cost', 'annual subscription vs one time purchase calculator'],
    summary: 'See when convenience turns into a long-term premium.',
    tagline: 'Know when monthly becomes more expensive than commitment.',
    promise: 'Compare subscriptions, annual plans, lifetime licenses, price increases, and usage duration.',
    bestFor: 'Operators and buyers choosing between monthly subscriptions, annual plans, and one-time software purchases.',
    seoTargets: ['subscription vs lifetime license calculator', 'monthly vs lifetime software cost', 'annual subscription vs one time purchase calculator'],
    monetizationFit: ['software marketplaces', 'SaaS reviews', 'budgeting tools'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'Partially verified business-planning baseline. Vendor-specific lifetime terms, support/update rights, cancellation terms, and price changes need separate verification.',
    kind: 'subscription-crossover',
    fields: subscriptionCrossoverFields,
    assumptions: ['A lifetime deal is only cheaper if the tool survives, gets updates, and stays useful.', 'Optionality has value when the workflow may change.'],
    sections: techSpendSections,
    related: [
      { label: 'SaaS Cost Calculator', href: '/business/saas-cost-calculator/' },
      { label: 'Software ROI', href: '/business/software-roi-calculator/' },
    ],
    sources: [...technologySpendSources, ...businessPlanningSources],
  },
  {
    slug: 'cloud-exit-calculator',
    area: 'business',
    group: 'Cloud',
    title: 'Cloud Exit Calculator: Leaving Has a Price Too | Kefiw',
    h1: 'Cloud Exit Calculator',
    description: 'Estimate migration, data transfer, refactoring, contract, dual-running, and engineering costs before leaving or repatriating cloud workloads.',
    keywords: ['cloud exit calculator', 'cloud migration exit cost', 'cloud repatriation calculator', 'cloud lock in cost calculator'],
    summary: 'Leaving has a price too.',
    tagline: 'Leaving has a price too.',
    promise: 'Estimate migration, data transfer, refactoring, contract, and dual-running costs.',
    bestFor: 'Technical teams comparing cloud optimization, migration, repatriation, or vendor lock-in costs.',
    seoTargets: ['cloud exit calculator', 'cloud migration exit cost', 'cloud repatriation calculator', 'cloud lock in cost calculator'],
    monetizationFit: ['cloud cost tools', 'FinOps tools', 'migration consultants', 'observability tools'],
    riskProfile: 'cloud-saas',
    sourceCheckedAt: 'April 28, 2026',
    sourceScope: 'Major-provider cloud pricing and data-transfer baseline. Transfer relief programs vary by provider, eligibility, approval process, and workload.',
    kind: 'cloud-exit',
    fields: cloudExitFields,
    assumptions: ['Exit cost should include dual-running, staff time, refactoring, data transfer, downtime risk, and lost platform features.', 'A cloud exit can be rational, but only after optimization and migration cost are both visible.'],
    sections: techSpendSections,
    related: [
      { label: 'Cloud Cost Calculator', href: '/business/cloud-cost-calculator/' },
      { label: 'Software ROI', href: '/business/software-roi-calculator/' },
    ],
    sources: cloudSources,
  },
  ...[
    ['care-needs-checklist', 'Care Needs Checklist', 'Translate bathing, dressing, medication, mobility, meals, supervision, and household support into a care workload estimate.', 'caregiver-hours'],
    ['caregiver-hours-calculator', 'Caregiver Hours Calculator', 'Estimate weekly caregiving hours from ADL, IADL, supervision, transport, and respite needs.', 'caregiver-hours'],
  ].map(([slug, h1, description, kind]): VerticalCalculatorPage => ({
    slug,
    area: 'care',
    group: 'Caregiving',
    title: `${h1} | Kefiw`,
    h1,
    description,
    keywords: [h1.toLowerCase(), 'caregiver hours calculator', 'care needs checklist'],
    summary: 'Estimate workload before choosing home care, family care, adult day care, or facility care.',
    kind: kind as VerticalCalculatorKind,
    fields: [
      { id: 'adl', label: 'ADL help needed', type: 'number', defaultValue: 3, min: 0, max: 6, step: 1, suffix: 'areas' },
      { id: 'iadl', label: 'IADL / household help needed', type: 'number', defaultValue: 4, min: 0, max: 8, step: 1, suffix: 'areas' },
      { id: 'supervision', label: 'Supervision level', type: 'number', defaultValue: 4, min: 0, max: 10, step: 1, suffix: '/10' },
      { id: 'medicalTasks', label: 'Medication / care tasks', type: 'number', defaultValue: 5, min: 0, max: 30, step: 1, suffix: 'per week' },
      { id: 'transportTrips', label: 'Transport / appointment trips', type: 'number', defaultValue: 2, min: 0, max: 20, step: 1, suffix: '/week' },
    ],
    assumptions: ['This is a workload planner, not a clinical assessment.', 'Escalate if safety, wandering, falls, medication errors, or caregiver burnout are present.'],
    sections: careSections,
    related: [
      { label: 'Family Care Budget', href: '/care/family-care-budget-calculator/' },
      { label: 'Plan Senior Care Track', href: '/tracks/plan-senior-care/' },
    ],
    sources: careSources,
    healthDisclaimer: true,
  })),
  ...[
    ['home-care-cost-calculator', 'Home Care Cost Calculator', 'Estimate monthly and annual home-care aide cost from hours, hourly rate, supplies, respite, and inflation.'],
    ['assisted-living-cost-calculator', 'Assisted Living Cost Calculator', 'Estimate assisted living base cost, care-level add-ons, extras, annual cost, and five-year exposure.'],
    ['nursing-home-cost-calculator', 'Nursing Home Cost Calculator', 'Estimate nursing home monthly cost, annual cost, and five-year exposure with inflation assumptions.'],
    ['memory-care-cost-calculator', 'Memory Care Cost Calculator', 'Estimate memory care base cost, care add-ons, supplies, and multi-year exposure.'],
    ['family-care-budget-calculator', 'Family Care Budget Calculator', 'Combine paid care, family workload, respite, supplies, transport, and benefits into a family care budget.'],
  ].map(([slug, h1, description]): VerticalCalculatorPage => ({
    slug,
    area: 'care',
    group: 'Senior Care',
    title: `${h1} | Kefiw`,
    h1,
    description,
    keywords: [h1.toLowerCase(), 'senior care cost calculator', 'care budget calculator'],
    summary: 'Use this to compare care settings and budget pressure before making calls.',
    kind: 'care-cost',
    fields: careCostFields,
    assumptions: ['Rates vary by city, care level, shift length, and agency/facility.', 'Medicare, Medicaid, VA, LTC insurance, and state programs can change out-of-pocket cost.'],
    sections: careSections,
    related: [
      { label: 'Caregiver Hours', href: '/care/caregiver-hours-calculator/' },
      { label: 'Care Cost Reduction Planner', href: '/care/care-cost-reduction-planner/' },
      { label: 'Plan Senior Care Track', href: '/tracks/plan-senior-care/' },
    ],
    sources: careSources,
    healthDisclaimer: true,
  })),
  {
    slug: 'medicare-cost-planner',
    area: 'care',
    group: 'Medicare',
    title: 'Medicare Cost Planner | Kefiw',
    h1: 'Medicare Cost Planner',
    description: 'Estimate monthly Medicare-related costs from Part B, Part D or Medicare Advantage, Medigap, dental, vision, drugs, and out-of-pocket medical spend.',
    keywords: ['medicare cost calculator', 'medicare part b premium calculator', 'medicare budget planner'],
    summary: 'Medicare cost planning should include premiums, deductibles, drugs, supplemental coverage, and uncovered care.',
    kind: 'medicare-cost',
    fields: [
      { id: 'partB', label: 'Part B monthly premium', type: 'number', defaultValue: 202.9, min: 0, max: 1000, step: 0.1, prefix: '$' },
      { id: 'partD', label: 'Part D / Medicare Advantage premium', type: 'number', defaultValue: 46.5, min: 0, max: 1000, step: 0.1, prefix: '$' },
      { id: 'medigap', label: 'Medigap / supplement premium', type: 'number', defaultValue: 160, min: 0, max: 1000, step: 1, prefix: '$' },
      { id: 'drugs', label: 'Monthly drug out-of-pocket', type: 'number', defaultValue: 85, min: 0, max: 5000, step: 5, prefix: '$' },
      { id: 'dentalVision', label: 'Dental, vision, hearing', type: 'number', defaultValue: 75, min: 0, max: 5000, step: 5, prefix: '$' },
      { id: 'medicalOop', label: 'Other monthly medical out-of-pocket', type: 'number', defaultValue: 125, min: 0, max: 10000, step: 5, prefix: '$' },
    ],
    assumptions: ['Uses CMS 2026 Part B standard premium as the default.', 'IRMAA, plan design, network, drugs, and state rules can change actual costs.'],
    sections: careSections,
    related: [
      { label: 'Family Care Budget', href: '/care/family-care-budget-calculator/' },
      { label: 'Care Cost Reduction Planner', href: '/care/care-cost-reduction-planner/' },
    ],
    sources: careSources,
    healthDisclaimer: true,
  },
  {
    slug: 'foreign-caregiver-options',
    area: 'care',
    group: 'Caregiving',
    title: 'Foreign Caregiver Options Planner | Kefiw',
    h1: 'Foreign Caregiver Options Planner',
    description: 'Understand the cost and compliance issues around household caregivers, employment eligibility, H-2B limits, domestic-worker rights, and lawful immigration paths.',
    keywords: ['foreign caregiver options', 'hire foreign caregiver', 'household caregiver visa'],
    summary: 'This is a compliance planner. It does not create a visa strategy or replace an immigration attorney.',
    kind: 'foreign-caregiver',
    fields: [
      { id: 'hourlyWage', label: 'Hourly wage', type: 'number', defaultValue: 22, min: 0, max: 200, step: 1, prefix: '$' },
      { id: 'hoursPerWeek', label: 'Hours per week', type: 'number', defaultValue: 40, min: 0, max: 168, step: 1, suffix: 'hrs' },
      { id: 'payrollTaxPct', label: 'Employer payroll/tax/admin load', type: 'number', defaultValue: 12, min: 0, max: 50, step: 1, suffix: '%' },
      { id: 'legalFees', label: 'Legal / immigration / placement cost', type: 'number', defaultValue: 6500, min: 0, max: 100000, step: 500, prefix: '$' },
      { id: 'travelSetup', label: 'Travel, housing setup, onboarding', type: 'number', defaultValue: 3500, min: 0, max: 100000, step: 500, prefix: '$' },
    ],
    assumptions: ['A U.S. household generally cannot treat a foreign caregiver as informal labor.', 'H-2B requires temporary need, labor certification, USCIS petitioning, caps, and wage protections.', 'B-1 domestic employee scenarios are limited and usually tied to accompanying a qualifying employer.'],
    sections: [
      ...careSections,
      {
        title: 'Lawful-path checklist',
        body: 'The practical workflow is to identify whether the worker is already authorized to work, complete required employment verification when required, understand household-employer tax rules, check wage and overtime rules, and speak with an immigration attorney before attempting any visa path.',
        bullets: [
          'Do not assume a visitor can work as a caregiver.',
          'Do not withhold passports, documents, wages, or mobility.',
          'Use written agreements, time records, payroll records, and state-law checks.',
        ],
      },
    ],
    related: [
      { label: 'Care Cost Reduction Planner', href: '/care/care-cost-reduction-planner/' },
      { label: 'Home Care Cost', href: '/care/home-care-cost-calculator/' },
    ],
    sources: careSources,
    healthDisclaimer: true,
  },
  {
    slug: 'care-cost-reduction-planner',
    area: 'care',
    group: 'Caregiving',
    title: 'Care Cost Reduction Planner | Kefiw',
    h1: 'Care Cost Reduction Planner',
    description: 'Compare ways to reduce care cost pressure: adult day care, respite, family shifts, benefits screening, equipment, safer home setup, and agency schedule design.',
    keywords: ['reduce senior care cost', 'care cost reduction calculator', 'minimize caregiver cost'],
    summary: 'Lower cost should not mean unsafe care. This planner separates cash savings from risk.',
    kind: 'care-savings',
    fields: [
      { id: 'currentMonthly', label: 'Current monthly care cost', type: 'number', defaultValue: 6200, min: 0, max: 100000, step: 100, prefix: '$' },
      { id: 'familyHours', label: 'Reliable family hours per week', type: 'number', defaultValue: 10, min: 0, max: 168, step: 1, suffix: 'hrs' },
      { id: 'replacementRate', label: 'Paid-care rate those hours replace', type: 'number', defaultValue: 30, min: 0, max: 200, step: 1, prefix: '$' },
      { id: 'benefitsMonthly', label: 'Benefits or insurance offset', type: 'number', defaultValue: 500, min: 0, max: 50000, step: 50, prefix: '$' },
      { id: 'adultDaySavings', label: 'Adult day / schedule redesign savings', type: 'number', defaultValue: 450, min: 0, max: 50000, step: 50, prefix: '$' },
      { id: 'respiteBudget', label: 'Respite kept in budget', type: 'number', defaultValue: 300, min: 0, max: 10000, step: 50, prefix: '$' },
    ],
    assumptions: ['Savings that create unsafe gaps are not savings.', 'Screen Medicaid, VA, local aging services, LTC insurance, and tax/payroll issues before changing care.'],
    sections: careSections,
    related: [
      { label: 'Foreign Caregiver Options', href: '/care/foreign-caregiver-options/' },
      { label: 'Caregiver Hours', href: '/care/caregiver-hours-calculator/' },
    ],
    sources: careSources,
    healthDisclaimer: true,
  },
];

export const VERTICAL_CALCULATORS_BY_AREA = VERTICAL_CALCULATORS.reduce<Record<VerticalArea, VerticalCalculatorPage[]>>(
  (acc, page) => {
    acc[page.area].push(page);
    return acc;
  },
  { property: [], business: [], care: [] },
);

export const VERTICAL_CALCULATORS_BY_SLUG = VERTICAL_CALCULATORS.reduce<Record<string, VerticalCalculatorPage>>((acc, page) => {
  acc[`${page.area}/${page.slug}`] = page;
  return acc;
}, {});

export function verticalCalculatorHref(page: Pick<VerticalCalculatorPage, 'area' | 'slug'>): string {
  return `/${page.area}/${page.slug}/`;
}

export function verticalLabel(area: VerticalArea): string {
  if (area === 'property') return 'Property';
  if (area === 'business') return 'Business';
  return 'Care';
}

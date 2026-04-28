import { useEffect, useRef, useState } from 'react';
import ToolSearch from './ToolSearch';
import SystemTray from './SystemTray';
import TodayMenu from './TodayMenu';
import AdSlot from './ads/AdSlot';

const AUTO_AD_MS = 3_000;
const RESTORE_IDLE_MS = 6_000;

interface NavLink {
  label: string;
  href: string;
  note?: string;
}

interface NavSection {
  label: string;
  href?: string;
  links: NavLink[];
}

interface NavGroup {
  label: string;
  href: string;
  kicker: string;
  review?: string;
  paths?: string[];
  sections: NavSection[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Property',
    href: '/property/',
    kicker: 'Improve, estimate, buy, sell, own, invest, and insure property',
    review: 'Approved by contractor, realtor, engineering, and scientific review for property decision workflows.',
    paths: ['/property/', '/homelab/'],
    sections: [
      {
        label: 'Property',
        href: '/property/',
        links: [
          { label: 'Property Overview', href: '/property/' },
          { label: 'Improve Calculators', href: '/homelab/' },
          { label: 'Property Tracks', href: '/tracks/#property-tracks' },
          { label: 'Property Guides', href: '/property/' },
        ],
      },
      {
        label: 'Improve',
        href: '/homelab/',
        links: [
          { label: 'Roof Replacement Cost', href: '/homelab/roof-replacement-cost-calculator/' },
          { label: 'Save on Roof Cost', href: '/guides/save-on-roof-replacement-cost/' },
          { label: 'Roof Hail/Wind Discounts', href: '/guides/roof-hail-wind-insurance-discounts/' },
          { label: 'Roof-over vs Tear-off', href: '/guides/roof-over-vs-tear-off/' },
          { label: 'Roof Repair Cost', href: '/homelab/roof-repair-vs-replacement-calculator/' },
          { label: 'Metal Roof Cost', href: '/homelab/metal-roof-cost-calculator/' },
          { label: 'Shingle Calculator', href: '/homelab/shingle-bundle-calculator/' },
          { label: 'Roof Pitch Calculator', href: '/homelab/roof-pitch-calculator/' },
          { label: 'Roof Insurance Claims', href: '/homelab/roof-insurance-deductible-calculator/' },
          { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
          { label: 'HVAC Diagnosis Matrix', href: '/property/hvac-diagnosis-live-matrix/' },
          { label: 'HVAC Replacement Alternatives', href: '/guides/hvac-full-replacement-alternatives/' },
          { label: 'AC Replacement Cost', href: '/property/ac-replacement-cost/' },
          { label: 'Furnace Replacement Cost', href: '/property/furnace-replacement-cost/' },
          { label: 'Heat Pump Cost', href: '/property/heat-pump-cost/' },
          { label: 'Ductwork Cost', href: '/property/ductwork-cost/' },
          { label: 'Mini-Splits vs Central AC', href: '/guides/mini-splits-vs-central-ac/' },
          { label: 'Remodeling Cost', href: '/homelab/#remodel' },
          { label: 'Kitchen Remodel Cost', href: '/homelab/#remodel' },
          { label: 'Bathroom Remodel Cost', href: '/homelab/#remodel' },
          { label: 'Window Replacement Cost', href: '/homelab/#windows' },
          { label: 'Energy Savings', href: '/property/energy-savings-estimate/' },
        ],
      },
      {
        label: 'Estimate',
        href: '/homelab/',
        links: [
          { label: 'All Property Calculators', href: '/property/' },
          { label: 'Repair vs Replace', href: '/homelab/roof-repair-vs-replacement-calculator/' },
          { label: 'Contractor Quote Checker', href: '/tracks/replace-my-roof/' },
          { label: 'Project Budget Planner', href: '/tracks/plan-my-remodel/' },
          { label: 'Monthly Payment Calculator', href: '/calculators/mortgage-calculator/' },
          { label: 'ROI Calculator', href: '/homelab/new-roof-roi-calculator/' },
        ],
      },
      {
        label: 'Buy/Sell',
        href: '/property/#sell',
        links: [
          { label: 'Seller Proceeds', href: '/property/seller-proceeds-calculator/' },
          { label: 'Closing Costs', href: '/property/closing-cost-calculator/' },
          { label: 'Commission', href: '/property/commission-calculator/' },
          { label: 'Net Sheet Calculator', href: '/property/net-sheet-calculator/' },
          { label: 'Cash to Close', href: '/property/cash-to-close-calculator/' },
          { label: 'Rent vs Buy', href: '/finance/horizon-point/' },
          { label: 'Mortgage Points', href: '/property/#buy' },
          { label: 'Buydown Calculator', href: '/property/#buy' },
          { label: 'Affordability', href: '/property/#buy' },
        ],
      },
      {
        label: 'Own',
        href: '/property/#own',
        links: [
          { label: 'Property Tax', href: '/property/#own' },
          { label: 'Escrow Calculator', href: '/property/#own' },
          { label: 'Refinance Break-Even', href: '/property/#own' },
          { label: 'Home Equity', href: '/property/#own' },
          { label: 'Maintenance Budget', href: '/property/#own' },
          { label: 'Utility Cost', href: '/homelab/#energy' },
          { label: 'Insurance Deductible', href: '/homelab/roof-insurance-deductible-calculator/' },
        ],
      },
      {
        label: 'Invest',
        href: '/property/#invest',
        links: [
          { label: 'Rental Property', href: '/property/#invest' },
          { label: 'Cap Rate', href: '/property/#invest' },
          { label: 'Cash Flow', href: '/property/#invest' },
          { label: 'BRRRR Calculator', href: '/property/#invest' },
          { label: 'Short-Term Rental', href: '/property/#invest' },
          { label: 'Vacancy Cost', href: '/property/#invest' },
          { label: 'Renovation ROI', href: '/homelab/new-roof-roi-calculator/' },
        ],
      },
      {
        label: 'Insure',
        href: '/homelab/roof-insurance-deductible-calculator/',
        links: [
          { label: 'Deductible Calculator', href: '/homelab/roof-insurance-deductible-calculator/' },
          { label: 'Claim Estimate', href: '/homelab/hail-damage-severity-estimator/' },
          { label: 'Repair vs Claim', href: '/homelab/roof-repair-vs-replacement-calculator/' },
          { label: 'Roof Claim Calculator', href: '/homelab/roof-insurance-deductible-calculator/' },
          { label: 'Storm Damage Checklist', href: '/homelab/hail-damage-severity-estimator/' },
        ],
      },
      {
        label: 'Property Tracks',
        href: '/tracks/#property-tracks',
        links: [
          { label: 'Replace My Roof', href: '/tracks/replace-my-roof/' },
          { label: 'Replace My HVAC', href: '/tracks/replace-my-hvac/' },
          { label: 'Plan My Remodel', href: '/tracks/plan-my-remodel/' },
          { label: 'Sell My Property', href: '/tracks/sell-my-home/' },
          { label: 'Buy a Property', href: '/property/#buy' },
          { label: 'Plan a Rental', href: '/property/#invest' },
        ],
      },
      {
        label: 'Property Guides',
        href: '/property/',
        links: [
          { label: 'Property Guides', href: '/property/' },
          { label: 'Improve Guides', href: '/homelab/' },
          { label: 'Review Board', href: '/about-the-reviewers/' },
          { label: 'Methodology', href: '/methodology/' },
        ],
      },
      {
        label: 'Browse by State',
        href: '/property/#browse-by-state',
        links: [
          { label: 'Browse by State', href: '/property/#browse-by-state' },
          { label: 'Improve Cost by State', href: '/homelab/' },
          { label: 'Property Cost by State', href: '/property/' },
        ],
      },
      {
        label: 'Browse by City',
        href: '/property/#browse-by-city',
        links: [
          { label: 'Browse by City', href: '/property/#browse-by-city' },
          { label: 'Improve Cost by City', href: '/homelab/' },
          { label: 'Property Cost by City', href: '/property/' },
        ],
      },
    ],
  },
  {
    label: 'Business',
    href: '/business/',
    kicker: 'Tax, pricing, hiring, revenue, and operating-cost calculators',
    review: 'Approved for educational business planning with explicit assumptions.',
    paths: ['/business/'],
    sections: [
      {
        label: 'Business Lab',
        href: '/business/',
        links: [
          { label: 'Business Lab', href: '/business/' },
          { label: 'Business Calculators', href: '/business/' },
          { label: 'Business Tracks', href: '/tracks/#business-tracks' },
          { label: 'Business Guides', href: '/business/' },
        ],
      },
      {
        label: 'Tax',
        href: '/business/#tax',
        links: [
          { label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
          { label: 'Quarterly Tax', href: '/business/quarterly-tax-estimate-calculator/' },
          { label: 'S-Corp Tax Savings', href: '/business/s-corp-tax-savings-calculator/' },
          { label: 'LLC vs S-Corp', href: '/business/llc-vs-s-corp-calculator/' },
          { label: 'Reasonable Salary', href: '/business/reasonable-salary-planner/' },
        ],
      },
      {
        label: 'Pricing',
        href: '/business/#pricing',
        links: [
          { label: 'Freelance Rate', href: '/calculators/minimum-viable-rate/' },
          { label: 'Consultant Rate', href: '/calculators/minimum-viable-rate/' },
          { label: 'Markup & Margin', href: '/calculators/markup-margin-calculator/' },
          { label: 'Break-Even', href: '/calculators/break-even-calculator/' },
          { label: 'Profit Calculator', href: '/calculators/margin-calculator/' },
        ],
      },
      {
        label: 'Hiring',
        href: '/business/#hiring',
        links: [
          { label: 'Hiring Cost', href: '/business/payroll-burden-calculator/' },
          { label: 'Contractor vs Employee', href: '/business/contractor-vs-employee-calculator/' },
          { label: 'Hire vs Automate', href: '/calculators/hire-vs-automate/' },
          { label: 'Revenue per Employee', href: '/calculators/revenue-per-head/' },
          { label: 'Payroll Burden', href: '/business/payroll-burden-calculator/' },
        ],
      },
      {
        label: 'Revenue',
        href: '/business/#revenue',
        links: [
          { label: 'Revenue Forecast', href: '/business/#revenue' },
          { label: 'Sales Target', href: '/business/#revenue' },
          { label: 'Churn Calculator', href: '/business/#revenue' },
          { label: 'Subscription Pricing', href: '/business/#revenue' },
        ],
      },
      {
        label: 'Cloud',
        href: '/business/#cloud',
        links: [
          { label: 'SaaS Cost', href: '/finance/crossover-calculator/' },
          { label: 'Cloud Cost', href: '/calculators/cloud-exit/' },
          { label: 'Seat Cost', href: '/finance/crossover-calculator/' },
          { label: 'Software ROI', href: '/calculators/tech-debt-interest/' },
        ],
      },
      {
        label: 'Business Tracks',
        href: '/tracks/#business-tracks',
        links: [
          { label: 'Start Freelancing', href: '/tracks/start-freelancing/' },
          { label: 'Price My Work', href: '/calculators/minimum-viable-rate/' },
          { label: 'Hire My First Employee', href: '/business/#hiring' },
        ],
      },
      {
        label: 'Business Guides',
        href: '/business/',
        links: [
          { label: 'Business Guides', href: '/business/' },
          { label: 'Business Methodology', href: '/methodology/' },
          { label: 'Editorial Policy', href: '/editorial-policy/' },
        ],
      },
    ],
  },
  {
    label: 'Care',
    href: '/care/',
    kicker: 'Family care costs, caregiving workload, Medicare, and insurance planning',
    review: 'Approved by registered nurse review for care-safety wording and boundaries.',
    paths: ['/care/', '/health/'],
    sections: [
      {
        label: 'Care Lab',
        href: '/care/',
        links: [
          { label: 'Care Lab', href: '/care/' },
          { label: 'Care Calculators', href: '/care/' },
          { label: 'Health Calculators', href: '/health/' },
          { label: 'Care Tracks', href: '/tracks/#care-tracks' },
        ],
      },
      {
        label: 'Senior Care',
        href: '/care/#senior-care',
        links: [
          { label: 'Senior Care Cost', href: '/care/family-care-budget-calculator/' },
          { label: 'Assisted Living Cost', href: '/care/assisted-living-cost-calculator/' },
          { label: 'Nursing Home Cost', href: '/care/nursing-home-cost-calculator/' },
          { label: 'Memory Care Cost', href: '/care/memory-care-cost-calculator/' },
          { label: 'Home Care Cost', href: '/care/home-care-cost-calculator/' },
        ],
      },
      {
        label: 'Caregiving',
        href: '/care/#caregiving',
        links: [
          { label: 'Caregiver Hours', href: '/care/caregiver-hours-calculator/' },
          { label: 'Family Care Budget', href: '/care/family-care-budget-calculator/' },
          { label: 'Care Cost Reduction', href: '/care/care-cost-reduction-planner/' },
          { label: 'Care Needs Checklist', href: '/care/care-needs-checklist/' },
        ],
      },
      {
        label: 'Medicare',
        href: '/care/#medicare',
        links: [
          { label: 'Medicare Cost', href: '/care/medicare-cost-planner/' },
          { label: 'Medicare IRMAA', href: '/care/medicare-cost-planner/' },
          { label: 'Part B Premiums', href: '/care/medicare-cost-planner/' },
          { label: 'Part D Estimate', href: '/care/medicare-cost-planner/' },
        ],
      },
      {
        label: 'Insurance',
        href: '/care/#insurance',
        links: [
          { label: 'HSA / FSA', href: '/health/' },
          { label: 'Health Insurance Cost', href: '/care/#insurance' },
          { label: 'Long-Term Care Insurance', href: '/care/#insurance' },
          { label: 'Health Calculators', href: '/health/' },
        ],
      },
      {
        label: 'Wellbeing',
        href: '/health/',
        links: [
          { label: 'Mind Reset', href: '/tracks/mind-reset/' },
          { label: 'Sleep Reset', href: '/tracks/sleep-reset/' },
          { label: 'Sleep Timing', href: '/health/rem-sync/' },
          { label: 'Stress Check-In', href: '/tracks/mind-reset/' },
          { label: 'Medical Triage', href: '/health/medical-triage/' },
        ],
      },
      {
        label: 'Care Tracks',
        href: '/tracks/#care-tracks',
        links: [
          { label: 'Plan Senior Care', href: '/tracks/plan-senior-care/' },
          { label: 'Mind Reset', href: '/tracks/mind-reset/' },
          { label: 'Sleep Reset', href: '/tracks/sleep-reset/' },
        ],
      },
      {
        label: 'Care Guides',
        href: '/care/',
        links: [
          { label: 'Care Guides', href: '/care/' },
          { label: 'Health Guides', href: '/health/' },
          { label: 'Health Disclaimer', href: '/health-disclaimer/' },
          { label: 'Review Board', href: '/about-the-reviewers/' },
        ],
      },
    ],
  },
  {
    label: 'Tracks',
    href: '/tracks/',
    kicker: 'Multi-step workflows, scenario tracks, comparisons, and curated decision paths',
    review: 'Approved as guided workflows that package related calculators into repeatable plans.',
    paths: ['/tracks/', '/chains/', '/scenarios/', '/comparisons/', '/clusters/'],
    sections: [
      {
        label: 'All Tracks',
        href: '/tracks/',
        links: [
          { label: 'All Tracks', href: '/tracks/' },
          { label: 'Chains', href: '/chains/' },
          { label: 'Scenarios', href: '/scenarios/' },
          { label: 'Comparisons', href: '/comparisons/' },
        ],
      },
      {
        label: 'Property Tracks',
        href: '/tracks/#property-tracks',
        links: [
          { label: 'Replace My Roof', href: '/tracks/replace-my-roof/' },
          { label: 'Replace My HVAC', href: '/tracks/replace-my-hvac/' },
          { label: 'Plan My Remodel', href: '/tracks/plan-my-remodel/' },
          { label: 'Sell My Property', href: '/tracks/sell-my-home/' },
        ],
      },
      {
        label: 'Business Tracks',
        href: '/tracks/#business-tracks',
        links: [
          { label: 'Start Freelancing', href: '/tracks/start-freelancing/' },
          { label: 'Price My Work', href: '/calculators/minimum-viable-rate/' },
          { label: 'Hire My First Employee', href: '/business/#hiring' },
        ],
      },
      {
        label: 'Care Tracks',
        href: '/tracks/#care-tracks',
        links: [
          { label: 'Plan Senior Care', href: '/tracks/plan-senior-care/' },
          { label: 'Mind Reset', href: '/tracks/mind-reset/' },
          { label: 'Sleep Reset', href: '/tracks/sleep-reset/' },
        ],
      },
      {
        label: 'Daily Tracks',
        href: '/tracks/#daily-tracks',
        links: [
          { label: 'Daily Challenges', href: '/daily/' },
          { label: 'Word Games', href: '/games/daily-word/' },
          { label: 'Vibe Games', href: '/games/' },
        ],
      },
    ],
  },
  {
    label: 'Tools',
    href: '/calculators/',
    kicker: 'Index for all calculators, converters, text tools, and deterministic utilities',
    paths: ['/calculators/', '/word-tools/', '/converters/', '/logic/', '/finance/'],
    sections: [
      {
        label: 'All Tools',
        href: '/calculators/',
        links: [
          { label: 'All Tools', href: '/calculators/' },
          { label: 'Tool Search', href: '/calculators/' },
        ],
      },
      {
        label: 'Calculators',
        href: '/calculators/',
        links: [
          { label: 'All Calculators', href: '/calculators/' },
          { label: 'Average Calculator', href: '/calculators/average-calculator/' },
          { label: 'Mortgage Calculator', href: '/calculators/mortgage-calculator/' },
        ],
      },
      {
        label: 'Property Calculators',
        href: '/property/',
        links: [
          { label: 'Property Calculators', href: '/property/' },
          { label: 'HVAC Replacement Cost', href: '/property/hvac-replacement-cost/' },
          { label: 'Seller Proceeds', href: '/property/seller-proceeds-calculator/' },
          { label: 'Cash to Close', href: '/property/cash-to-close-calculator/' },
          { label: 'Roof Replacement Cost', href: '/homelab/roof-replacement-cost-calculator/' },
        ],
      },
      {
        label: 'Business Calculators',
        href: '/business/',
        links: [
          { label: 'Business Calculators', href: '/business/' },
          { label: 'Self-Employed Tax', href: '/business/self-employed-tax-calculator/' },
          { label: 'Quarterly Tax', href: '/business/quarterly-tax-estimate-calculator/' },
          { label: 'Freelance Rate', href: '/calculators/minimum-viable-rate/' },
          { label: 'Break-Even', href: '/calculators/break-even-calculator/' },
        ],
      },
      {
        label: 'Care Calculators',
        href: '/care/',
        links: [
          { label: 'Care Calculators', href: '/care/' },
          { label: 'Home Care Cost', href: '/care/home-care-cost-calculator/' },
          { label: 'Caregiver Hours', href: '/care/caregiver-hours-calculator/' },
          { label: 'Medicare Cost Planner', href: '/care/medicare-cost-planner/' },
          { label: 'Health Calculators', href: '/health/' },
        ],
      },
      {
        label: 'Finance Calculators',
        href: '/finance/',
        links: [
          { label: 'Finance Calculators', href: '/finance/' },
          { label: 'Rent vs Buy', href: '/finance/horizon-point/' },
          { label: 'Crossover Calculator', href: '/finance/crossover-calculator/' },
        ],
      },
      {
        label: 'Health Calculators',
        href: '/health/',
        links: [
          { label: 'Health Calculators', href: '/health/' },
          { label: 'Medical Triage', href: '/health/medical-triage/' },
          { label: 'Hydration', href: '/health/hydraulic-integrity/' },
        ],
      },
      {
        label: 'Word Tools',
        href: '/word-tools/',
        links: [
          { label: 'Word Tools', href: '/word-tools/' },
          { label: 'Word Unscrambler', href: '/word-tools/word-unscrambler/' },
          { label: 'Word Counter', href: '/word-tools/word-counter/' },
        ],
      },
      {
        label: 'Converters',
        href: '/converters/',
        links: [
          { label: 'Converters', href: '/converters/' },
          { label: 'Length Converter', href: '/converters/length-converter/' },
        ],
      },
      {
        label: 'Math & Logic',
        href: '/logic/',
        links: [
          { label: 'Math & Logic', href: '/logic/' },
          { label: 'Logic Calculators', href: '/logic/' },
        ],
      },
    ],
  },
  {
    label: 'Play',
    href: '/games/',
    kicker: 'Daily retention, word games, Sudoku, and Vibe games',
    paths: ['/games/', '/daily/'],
    sections: [
      {
        label: 'Daily',
        href: '/daily/',
        links: [
          { label: 'Daily Challenges', href: '/daily/' },
          { label: 'Daily Word', href: '/games/daily-word/' },
        ],
      },
      {
        label: 'Word Games',
        href: '/games/daily-word/',
        links: [
          { label: 'Word Games', href: '/games/daily-word/' },
          { label: 'Daily Word', href: '/games/daily-word/' },
        ],
      },
      {
        label: 'Sudoku',
        href: '/games/sudoku/',
        links: [
          { label: 'Sudoku', href: '/games/sudoku/' },
          { label: 'All Games', href: '/games/' },
        ],
      },
      {
        label: 'Logic Games',
        href: '/games/',
        links: [
          { label: 'Logic Games', href: '/games/' },
          { label: 'VibeCircuit', href: '/games/vibecircuit/' },
        ],
      },
      {
        label: 'Vibe Games',
        href: '/games/',
        links: [
          { label: 'VibeCircuit', href: '/games/vibecircuit/' },
          { label: 'VibeMatch', href: '/games/vibematch/' },
          { label: 'VibeCrypt', href: '/games/vibecrypt/' },
          { label: 'VibeHex', href: '/games/vibehex/' },
          { label: 'VibePath', href: '/games/vibepath/' },
        ],
      },
      {
        label: 'All Games',
        href: '/games/',
        links: [
          { label: 'All Games', href: '/games/' },
          { label: 'Daily Challenges', href: '/daily/' },
        ],
      },
    ],
  },
  {
    label: 'Guides',
    href: '/guides/',
    kicker: 'Editorial support for calculators, games, home decisions, and care planning',
    paths: ['/guides/'],
    sections: [
      {
        label: 'All Guides',
        href: '/guides/',
        links: [
          { label: 'All Guides', href: '/guides/' },
          { label: 'Calculator Guides', href: '/guides/' },
        ],
      },
      {
        label: 'Property Guides',
        href: '/property/',
        links: [
          { label: 'Property Guides', href: '/property/' },
          { label: 'Improve Guides', href: '/homelab/' },
        ],
      },
      {
        label: 'Business Guides',
        href: '/business/',
        links: [
          { label: 'Business Guides', href: '/business/' },
          { label: 'Business Methodology', href: '/methodology/' },
        ],
      },
      {
        label: 'Care Guides',
        href: '/care/',
        links: [
          { label: 'Care Guides', href: '/care/' },
          { label: 'Care Methodology', href: '/methodology/' },
        ],
      },
      {
        label: 'Health Guides',
        href: '/health/',
        links: [
          { label: 'Health Guides', href: '/health/' },
          { label: 'Health Disclaimer', href: '/health-disclaimer/' },
        ],
      },
      {
        label: 'Game Guides',
        href: '/guides/',
        links: [
          { label: 'Game Guides', href: '/guides/' },
          { label: 'All Games', href: '/games/' },
        ],
      },
      {
        label: 'Review & Policy',
        links: [
          { label: 'Review Board', href: '/about-the-reviewers/' },
          { label: 'Calculator Methodology', href: '/methodology/' },
          { label: 'Data Sources', href: '/sources/' },
          { label: 'Editorial Policy', href: '/editorial-policy/' },
        ],
      },
    ],
  },
];

function shouldAutoCollapseHeader(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname;
  if (path === '/' || path === '/privacy/' || path === '/terms/' || path === '/privacy/legitimate-interest/') {
    return false;
  }
  return [
    '/word-tools/',
    '/converters/',
    '/calculators/',
    '/finance/',
    '/health/',
    '/logic/',
    '/games/',
    '/homelab/',
    '/property/',
    '/business/',
    '/care/',
    '/tracks/',
    '/chains/',
    '/scenarios/',
    '/comparisons/',
    '/clusters/',
    '/daily/',
    '/guides/',
  ].some((prefix) => path.startsWith(prefix));
}

function groupForPath(path: string): NavGroup | null {
  return NAV_GROUPS.find((group) => {
    const prefixes = group.paths ?? [group.href];
    return prefixes.some((prefix) => path.startsWith(prefix));
  }) ?? null;
}

function MegaMenuPanel({ group }: { group: NavGroup }): JSX.Element {
  return (
    <div className="absolute left-0 top-[calc(100%+0.75rem)] z-50 w-[min(64rem,calc(100vw-2rem))] rounded-lg border border-slate-200 bg-white p-4 text-left shadow-xl">
      <div className="mb-3 flex items-start justify-between gap-4 border-b border-slate-100 pb-3">
        <div>
          <a href={group.href} className="text-sm font-semibold text-slate-900 no-underline hover:text-brand-700">
            {group.label} hub →
          </a>
          <p className="mt-1 max-w-md text-xs leading-5 text-slate-600">{group.kicker}</p>
        </div>
        {group.review && (
          <div className="hidden max-w-[15rem] rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-[11px] leading-4 text-emerald-900 lg:block">
            {group.review}
          </div>
        )}
      </div>
      <div className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1 md:grid-cols-2 lg:grid-cols-4">
        {group.sections.map((section) => (
          <section key={section.label}>
            <a
              href={section.href ?? group.href}
              className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 no-underline hover:text-brand-700"
            >
              {section.label}
            </a>
            <ul className="mt-2 space-y-1.5">
              {section.links.map((link) => (
                <li key={`${section.label}-${link.label}`}>
                  <a href={link.href} className="block rounded px-2 py-1 text-sm text-slate-800 no-underline hover:bg-slate-50 hover:text-brand-700">
                    {link.label}
                    {link.note && <span className="ml-1 text-xs text-slate-500">{link.note}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function HeaderSwitcher(): JSX.Element {
  const [adMode, setAdMode] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenu, setMobileMenu] = useState<string | null>(null);
  const [currentMobileGroup, setCurrentMobileGroup] = useState<string | null>(null);
  const [isNarrow, setIsNarrow] = useState(false);
  const timerRef = useRef<number | null>(null);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const mobileSubmenuOpen = isNarrow && mobileMenu !== null;

  const clearTimer = (): void => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const scheduleAd = (delay: number): void => {
    clearTimer();
    if (mobileSubmenuOpen) return;
    timerRef.current = window.setTimeout(() => setAdMode(true), delay);
  };

  useEffect(() => {
    const active = shouldAutoCollapseHeader();
    setEnabled(active);
    if (active) scheduleAd(AUTO_AD_MS);
    const currentGroup = groupForPath(window.location.pathname);
    setCurrentMobileGroup(currentGroup?.label ?? null);
    return clearTimer;
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const syncNarrowState = (): void => setIsNarrow(media.matches);
    syncNarrowState();

    if (media.addEventListener) {
      media.addEventListener('change', syncNarrowState);
      return () => media.removeEventListener('change', syncNarrowState);
    }

    media.addListener(syncNarrowState);
    return () => media.removeListener(syncNarrowState);
  }, []);

  useEffect(() => {
    if (!enabled || !isNarrow) return;
    if (mobileMenu) {
      setAdMode(false);
      clearTimer();
      return;
    }
    scheduleAd(RESTORE_IDLE_MS);
  }, [enabled, isNarrow, mobileMenu]);

  useEffect(() => {
    if (!mobileSubmenuOpen) return;

    const closeIfOutsideMenu = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!mobileNavRef.current?.contains(target)) {
        setMobileMenu(null);
      }
    };

    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setMobileMenu(null);
    };

    document.addEventListener('pointerdown', closeIfOutsideMenu, true);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeIfOutsideMenu, true);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [mobileSubmenuOpen]);

  const restoreHeader = (): void => {
    setAdMode(false);
    if (mobileSubmenuOpen) {
      clearTimer();
      return;
    }
    scheduleAd(RESTORE_IDLE_MS);
  };

  const keepHeaderOpen = (): void => {
    if (!enabled || adMode) return;
    if (mobileSubmenuOpen) {
      clearTimer();
      return;
    }
    scheduleAd(RESTORE_IDLE_MS);
  };

  const activeGroup = NAV_GROUPS.find((group) => group.label === openMenu) ?? null;
  const activeMobileGroup = NAV_GROUPS.find((group) => group.label === mobileMenu) ?? null;

  if (enabled && adMode) {
    return (
      <header className="sticky top-0 z-40 grid grid-cols-[40px_minmax(0,1fr)] border-b border-slate-200 bg-white">
        <div className="flex min-h-16 flex-col items-center justify-center gap-1 border-r border-slate-200 bg-slate-50 px-1 py-1">
        <button
          type="button"
          onClick={restoreHeader}
            className="inline-flex h-7 w-7 items-center justify-center rounded bg-brand-600 text-sm font-bold text-white shadow-sm"
          aria-label="Show navigation"
        >
          K
        </button>
          <TodayMenu compact />
        </div>
        <div className="min-w-0 overflow-hidden">
          <AdSlot zoneId="GAMMA" minHeight={64} closeable={false} fullBleed={false} />
        </div>
      </header>
    );
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur"
      onPointerDown={keepHeaderOpen}
      onFocus={keepHeaderOpen}
      onKeyDown={keepHeaderOpen}
    >
      <div className="container-wide flex h-14 items-center gap-2">
        <a href="/" className="inline-flex h-7 w-7 flex-none items-center justify-center rounded bg-brand-600 text-sm font-bold text-white no-underline" aria-label="Kefiw home">K</a>
        <TodayMenu />

        <nav
          className="relative ml-3 hidden items-center gap-1 text-sm text-slate-700 lg:flex"
          aria-label="Primary"
          onMouseLeave={() => setOpenMenu(null)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setOpenMenu(null);
          }}
        >
          {NAV_GROUPS.map((group) => (
            <a
              key={group.label}
              href={group.href}
              className={`rounded px-2 py-1.5 font-medium no-underline hover:bg-slate-100 hover:text-brand-700 ${
                openMenu === group.label ? 'bg-slate-100 text-brand-700' : ''
              }`}
              onMouseEnter={() => setOpenMenu(group.label)}
              onFocus={() => setOpenMenu(group.label)}
            >
              {group.label}
            </a>
          ))}
          {activeGroup && <MegaMenuPanel group={activeGroup} />}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-full max-w-[12rem] sm:max-w-xs">
            <ToolSearch />
          </div>
          <SystemTray />
        </div>
      </div>
      <div ref={mobileNavRef} className="border-t border-brand-100 bg-brand-50/70 lg:hidden">
        <nav className={`container-wide scrollbar-none flex gap-2 overflow-x-auto pt-2 text-xs ${activeMobileGroup ? 'pb-0' : 'pb-2'}`} aria-label="Mobile categories">
          {NAV_GROUPS.map((group) => {
            const active = mobileMenu === group.label;
            const current = currentMobileGroup === group.label;
            return (
              <button
                key={group.label}
                type="button"
                aria-expanded={active}
                aria-controls="mobile-primary-submenu"
                onClick={() => setMobileMenu((current) => current === group.label ? null : group.label)}
                className={`relative whitespace-nowrap px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? 'z-10 rounded-t-xl rounded-b-none bg-brand-600 text-white shadow-sm ring-1 ring-brand-600'
                    : current
                      ? 'rounded-full bg-white text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50'
                      : 'rounded-full bg-white/80 text-slate-700 ring-1 ring-slate-200 hover:bg-white'
                }`}
              >
                {group.label}
              </button>
            );
          })}
        </nav>
        {activeMobileGroup && (
          <div
            id="mobile-primary-submenu"
            aria-label={`${activeMobileGroup.label} mobile menu`}
            className="-mt-px border-y border-brand-200 bg-brand-50 shadow-lg"
          >
            <div className="h-1 bg-brand-600/80" aria-hidden="true" />
            <div className="container-wide max-h-[58vh] overflow-y-auto py-3">
              <div className="mb-3 flex items-start justify-between gap-3 rounded-md border border-brand-200 bg-white/95 p-3 shadow-sm">
                <div>
                  <a href={activeMobileGroup.href} className="text-sm font-semibold text-brand-800 no-underline hover:text-brand-700">
                    {activeMobileGroup.label} hub
                  </a>
                  <p className="mt-1 text-xs leading-5 text-slate-700">{activeMobileGroup.kicker}</p>
                </div>
                <button
                  type="button"
                  aria-label="Close submenu"
                  onClick={() => setMobileMenu(null)}
                  className="inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-100 text-lg leading-none text-brand-800 hover:bg-brand-200"
                >
                  ×
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeMobileGroup.sections.map((section) => (
                  <section key={section.label} className="rounded-md border border-brand-100 bg-white p-3 shadow-sm">
                    <a
                      href={section.href ?? activeMobileGroup.href}
                      className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-700 no-underline hover:text-brand-800"
                    >
                      {section.label}
                    </a>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {section.links.map((link) => (
                        <a
                          key={`${section.label}-${link.label}`}
                          href={link.href}
                          className="rounded-full bg-brand-50/80 px-2.5 py-1.5 text-xs font-medium text-slate-800 no-underline ring-1 ring-inset ring-brand-100 hover:bg-white hover:text-brand-700 hover:ring-brand-300"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

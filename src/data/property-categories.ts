import {
  VERTICAL_CALCULATORS_BY_SLUG,
  verticalCalculatorHref,
  type VerticalCalculatorPage,
} from "~/data/vertical-calculators";

export interface PropertyCategoryCard {
  title: string;
  href: string;
  text: string;
  eyebrow?: string;
}

export interface PropertyCategorySection {
  title: string;
  body: string;
  bullets?: string[];
  cards?: PropertyCategoryCard[];
}

export interface PropertyCategoryPage {
  slug: string;
  label: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  primaryCta?: PropertyCategoryCard;
  secondaryCta?: PropertyCategoryCard;
  cards: PropertyCategoryCard[];
  sections: PropertyCategorySection[];
}

function propertyHref(slug: string): string {
  return `/property/${slug}/`;
}

function propertyTool(slug: string): VerticalCalculatorPage {
  const page = VERTICAL_CALCULATORS_BY_SLUG[`property/${slug}`];
  if (!page) throw new Error(`Missing property calculator page: ${slug}`);
  return page;
}

function toolCard(
  slug: string,
  text?: string,
  eyebrow = "Calculator",
): PropertyCategoryCard {
  const page = propertyTool(slug);
  return {
    title: page.h1,
    href: verticalCalculatorHref(page),
    text: text ?? page.summary,
    eyebrow,
  };
}

function linkCard(
  title: string,
  href: string,
  text: string,
  eyebrow = "Guide",
): PropertyCategoryCard {
  return { title, href, text, eyebrow };
}

export function propertyCategoryHref(slug: string): string {
  return propertyHref(slug);
}

const roofCards: PropertyCategoryCard[] = [
  linkCard(
    "Roof Replacement Cost Calculator",
    "/homelab/roof-replacement-cost-calculator/",
    "Build a low, typical, and high roof range, then test roof-over, materials, installer-only, flashing, and scope-trim strategies.",
    "Roof tool",
  ),
  linkCard(
    "Roof Repair vs Replacement Calculator",
    "/homelab/roof-repair-vs-replacement-calculator/",
    "Compare age, leaks, storm damage, sale horizon, and insurance pressure before replacing the whole roof.",
    "Decision",
  ),
  linkCard(
    "Roof Insurance Deductible Calculator",
    "/homelab/roof-insurance-deductible-calculator/",
    "Model deductible, ACV/RCV, depreciation holdback, code upgrades, and claim out-of-pocket cost.",
    "Insurance",
  ),
  linkCard(
    "Hail Damage Severity Estimator",
    "/homelab/hail-damage-severity-estimator/",
    "Check whether hail, wind, maintenance, and adjuster evidence support a strong claim conversation.",
    "Storm",
  ),
  linkCard(
    "Roof Claim Document Checklist",
    "/property/checklists/roof-claim-documents/",
    "Collect storm timeline, photos, policy documents, adjuster scope, contractor scope, deductible math, and supplement questions.",
    "Checklist",
  ),
  linkCard(
    "Roof Square Footage Calculator",
    "/homelab/roof-square-footage-calculator/",
    "Estimate roof surface area before comparing quote size, material quantities, and labor claims.",
    "Measurement",
  ),
  linkCard(
    "Shingle Bundle Calculator",
    "/homelab/shingle-bundle-calculator/",
    "Check field shingles, starter, ridge cap, waste, and owner-supplied material quantities.",
    "Materials",
  ),
];

export const PROPERTY_CATEGORIES: PropertyCategoryPage[] = [
  {
    slug: "roof",
    label: "Roof",
    title: "Roof Decisions: Cost, Storm Claims, Insurance, and Scope | Kefiw",
    h1: "Roof decisions",
    description:
      "Roof replacement, repair-vs-replace, storm claim, deductible, shingle quantity, pitch, and scope tools for homeowners comparing roof decisions.",
    keywords: [
      "roof calculator",
      "roof replacement cost",
      "roof insurance deductible",
      "hail damage estimator",
    ],
    intro:
      "Roof decisions go wrong when the quote hides scope, the insurance math hides cash exposure, or the homeowner compares bids that are not actually the same job.",
    primaryCta: roofCards[0],
    secondaryCta: linkCard(
      "Replace My Roof Track",
      "/tracks/replace-my-roof/",
      "Work through roof size, pitch, replacement cost, repair-vs-replace logic, insurance exposure, and quote questions.",
      "Track",
    ),
    cards: roofCards,
    sections: [
      {
        title: "What people forget",
        body: "The big number is only the headline. The risk is usually in layer count, decking allowance, flashing language, ventilation, roof edge details, deductible cash, and insurance scope omissions.",
        bullets: [
          "Compare tear-off, decking, underlayment, starter, ridge cap, drip edge, flashing, vents, cleanup, permit, and warranty as separate lines.",
          "Check ACV vs RCV and deductible cash before assuming an insurance check pays for the job.",
          "Collect product labels, photos, impact-rating forms, and wind documentation before final payment when discounts matter.",
        ],
      },
      {
        title: "What makes this decision go bad",
        body: "A roof decision fails when the homeowner buys the cheapest visible price while accepting hidden water-management, warranty, insurance, or deck-risk tradeoffs.",
        cards: [
          linkCard(
            "How to Save on Roof Replacement Cost",
            "/guides/save-on-roof-replacement-cost/",
            "Separate real savings from shortcuts that hide rot, break warranties, or move liability onto the homeowner.",
            "Mistake check",
          ),
          linkCard(
            "Roof-over vs Tear-off",
            "/guides/roof-over-vs-tear-off/",
            "Use roof-over only when code, layer count, deck condition, and warranty terms make it defensible.",
            "Scope check",
          ),
          linkCard(
            "Roof Hail and Wind Insurance Discounts",
            "/guides/roof-hail-wind-insurance-discounts/",
            "Know which forms, labels, nail patterns, and photos matter before the crew leaves.",
            "Paperwork",
          ),
        ],
      },
    ],
  },
  {
    slug: "hvac",
    label: "HVAC",
    title: "HVAC Decisions: Diagnosis, Replacement, Ducts, and Energy | Kefiw",
    h1: "HVAC decisions",
    description:
      "HVAC calculators and guides for diagnosis, replacement cost, AC, furnace, heat pump, ductwork, repair-vs-replace, and energy savings.",
    keywords: [
      "hvac replacement cost",
      "hvac diagnosis",
      "ac replacement cost",
      "ductwork cost",
    ],
    intro:
      "HVAC decisions get expensive when a symptom becomes a sales package before cheaper causes, duct problems, equipment path, and repair economics are tested.",
    primaryCta: toolCard(
      "hvac-diagnosis-live-matrix",
      "Start with symptoms, safety stops, cheaper fixes, and what the technician should prove before replacement.",
      "Start",
    ),
    secondaryCta: linkCard(
      "Replace My HVAC Track",
      "/tracks/replace-my-hvac/",
      "Move from load, symptoms, replacement paths, ducts, repair-vs-replace, and energy savings into one plan.",
      "Track",
    ),
    cards: [
      toolCard(
        "hvac-diagnosis-live-matrix",
        "Map AC, gas heat, electric heat, heat pump, thermostat, and board symptoms to useful questions.",
      ),
      toolCard(
        "hvac-replacement-cost",
        "Estimate full HVAC replacement range and compare equipment path, access, ducts, efficiency, and rebates.",
      ),
      toolCard(
        "hvac-repair-vs-replace",
        "Weigh age, repair cost, energy penalty, comfort problems, and replacement likelihood.",
      ),
      toolCard(
        "hvac-load-estimate",
        "Challenge tonnage-by-square-foot and identify load, duct, zoning, or comfort-distribution problems.",
      ),
      toolCard(
        "ductwork-cost",
        "Expose duct sealing, partial replacement, full replacement, insulation, and balancing costs.",
      ),
      toolCard(
        "energy-savings-estimate",
        "Test whether an efficiency upgrade is a payback decision, comfort decision, or both.",
      ),
      linkCard(
        "HVAC Quote Document Checklist",
        "/property/checklists/hvac-quote-documents/",
        "Collect diagnosis evidence, equipment models, duct assumptions, warranty terms, rebates, and financing details.",
        "Checklist",
      ),
      linkCard(
        "Quote Comparison Matrix",
        "/property/quote-comparison/",
        "Compare HVAC bids by scope, proof, terms, timeline, risk, and cash impact.",
        "Compare",
      ),
    ],
    sections: [
      {
        title: "Mistake prevention",
        body: "The key HVAC question is not only what the new system costs. It is whether replacement has been earned by measurements, safety evidence, compatibility, age, or repair economics.",
        bullets: [
          "Ask which cheaper causes were ruled out: capacitor, contactor, float switch, thermostat, filter, flame sensor, sequencer, airflow, or board output.",
          "Separate equipment replacement from duct, return-air, zoning, insulation, and comfort-design problems.",
          "Ask for at least one narrower repair or partial-replacement scope when the rest of the system may still be usable.",
        ],
      },
      {
        title: "What people like you usually do",
        body: "Owners with emergency no-cooling calls usually start with diagnosis. Owners with an aging but running system usually start with repair-vs-replace and energy payback. Owners with hot rooms usually start with load, duct, and mini-split comparisons.",
        cards: [
          linkCard(
            "Your AC Is Dead: Why That Does Not Always Mean Replacement",
            "/guides/ac-dead-not-always-replacement/",
            "Use this before turning a dead-looking AC into a full replacement quote.",
            "Guide",
          ),
          linkCard(
            "Before You Replace Your HVAC",
            "/guides/hvac-full-replacement-alternatives/",
            "Compare compressor, condenser/coil, furnace reuse, duct fixes, mini-splits, and full replacement.",
            "Guide",
          ),
          linkCard(
            "Mini-Splits vs Central AC",
            "/guides/mini-splits-vs-central-ac/",
            "Use mini-splits for zones, additions, bad ducts, and staged cooling when they actually fit.",
            "Guide",
          ),
        ],
      },
    ],
  },
  {
    slug: "sell",
    label: "Sell",
    title:
      "Home Selling Decisions: Proceeds, Prep ROI, Commission, and Net Sheet | Kefiw",
    h1: "Home selling decisions",
    description:
      "Seller calculators for proceeds, net sheets, commission, closing costs, prep ROI, title fees, tax proration, and association fees.",
    keywords: [
      "seller proceeds calculator",
      "home sale net sheet",
      "home sale prep roi",
      "real estate commission calculator",
    ],
    intro:
      "Selling decisions feel thin when the only answer is sale price. The useful answer is what you may actually keep, which line item can move, and which prep spend creates risk.",
    primaryCta: toolCard(
      "seller-proceeds-calculator",
      "Estimate the check after payoff, commission, closing costs, title, taxes, association charges, repairs, and concessions.",
      "Start",
    ),
    secondaryCta: linkCard(
      "Sell My Home Track",
      "/tracks/sell-my-home/",
      "Build a selling plan from sale price, proceeds, commission, closing costs, prep ROI, and offer net sheets.",
      "Track",
    ),
    cards: [
      toolCard(
        "seller-proceeds-calculator",
        "See the one-page answer: sale price minus every visible deduction.",
      ),
      toolCard(
        "net-sheet-calculator",
        "Compare listing prices, offers, concessions, repair credits, and payoff assumptions.",
      ),
      toolCard(
        "commission-calculator",
        "Calculate total commission, buyer-broker concessions, admin fees, and negotiated reductions.",
      ),
      toolCard(
        "closing-cost-calculator",
        "Separate seller closing costs from a vague percentage estimate.",
      ),
      toolCard(
        "home-sale-prep-roi-calculator",
        "Sort prep into must-fix, quick-win, maybe, and skip-or-credit.",
      ),
      linkCard(
        "Seller Net Sheet Document Checklist",
        "/property/checklists/seller-net-sheet-documents/",
        "Collect payoff, commission terms, concessions, title, tax, HOA, prep, and repair documents before trusting the net.",
        "Checklist",
      ),
      linkCard(
        "Property Option Comparison Matrix",
        "/property/option-comparison/",
        "Compare offers by net value, concessions, repairs, timing, paperwork, and risk.",
        "Compare",
      ),
    ],
    sections: [
      {
        title: "What sellers forget",
        body: "Net proceeds can be wrong even when the sale price is right. Payoff timing, concessions, prep spend, title fees, taxes, association costs, and repair credits all change the real check.",
        bullets: [
          "Run at least three net sheets: optimistic list price, realistic accepted price, and low-offer stress case.",
          "Do not spend on prep until it is sorted into safety, lender/insurance blocker, buyer perception, or cosmetic wish-list.",
          "Commission savings should be tested against exposure, service, buyer-side strategy, and negotiation value.",
        ],
      },
      {
        title: "What would make the decision go bad",
        body: "The sale plan fails when prep consumes cash without improving net proceeds, or when an offer looks strong until concessions, credits, and timing are visible.",
      },
    ],
  },
  {
    slug: "buy",
    label: "Buy",
    title:
      "Home Buying Decisions: Cash to Close, Mortgage, and Holding Horizon | Kefiw",
    h1: "Home buying decisions",
    description:
      "Buyer planning tools for cash to close, down payment, closing costs, title fees, mortgage payment, and rent-vs-buy horizon.",
    keywords: [
      "cash to close calculator",
      "buyer closing cost calculator",
      "mortgage calculator",
      "rent vs buy calculator",
    ],
    intro:
      "Buying decisions go bad when the payment looks affordable but cash to close, escrow setup, repairs, HOA fees, and hold horizon are not visible.",
    primaryCta: toolCard(
      "cash-to-close-calculator",
      "Estimate down payment, loan costs, title, prepaids, tax escrow, association costs, and inspections.",
      "Start",
    ),
    secondaryCta: linkCard(
      "Mortgage Calculator",
      "/calculators/mortgage-calculator/",
      "Check monthly payment, total cost, and what actually changes the payment.",
      "Calculator",
    ),
    cards: [
      toolCard(
        "cash-to-close-calculator",
        "Expose buyer cash requirements beyond the down payment.",
      ),
      linkCard(
        "Mortgage Calculator",
        "/calculators/mortgage-calculator/",
        "Estimate payment and total interest before comparing offers.",
        "Calculator",
      ),
      linkCard(
        "Mortgage Extra Payment Calculator",
        "/calculators/mortgage-extra-payment-calculator/",
        "Test payoff timeline and total interest impact from extra payments.",
        "Calculator",
      ),
      linkCard(
        "Rent vs Buy / Horizon Point",
        "/finance/horizon-point/",
        "Compare ownership horizon against renting and transaction costs.",
        "Decision",
      ),
      linkCard(
        "Buyer Cash to Close Document Checklist",
        "/property/checklists/buyer-cash-to-close-documents/",
        "Collect lender disclosures, title estimates, credits, escrow setup, tax, insurance, HOA, and reserve details.",
        "Checklist",
      ),
    ],
    sections: [
      {
        title: "What buyers forget",
        body: "Cash to close is not the payment. It is down payment, loan costs, title, prepaids, tax escrow, association costs, inspections, appraisal, and moving cash all landing at once.",
        bullets: [
          "Keep a repair and move-in reserve separate from closing cash.",
          "Stress-test HOA, tax, insurance, and rate assumptions before treating the payment as stable.",
          "Use a hold-horizon check if you may move before transaction costs have time to amortize.",
        ],
      },
    ],
  },
  {
    slug: "closing",
    label: "Closing",
    title:
      "Closing Cost Line Items: Title, Tax Proration, HOA, and Net Sheet | Kefiw",
    h1: "Closing line items",
    description:
      "Closing calculators for title company costs, tax proration, resale certificates, association dues, transfer fees, net sheets, and cash to close.",
    keywords: [
      "closing cost calculator",
      "title company cost calculator",
      "tax proration calculator",
      "hoa transfer fee calculator",
    ],
    intro:
      "Closing costs feel mysterious because small line items hide inside broad percentages. This section turns them into auditable lines.",
    primaryCta: toolCard(
      "closing-cost-calculator",
      "Estimate seller-side closing costs with title, taxes, resale docs, dues, transfer fees, payoff fees, and recording costs.",
      "Start",
    ),
    secondaryCta: toolCard(
      "title-company-cost-calculator",
      "Break title and escrow charges into settlement, policy, document, recording, wire, courier, and endorsement lines.",
      "Line item",
    ),
    cards: [
      toolCard(
        "closing-cost-calculator",
        "Use this to clean up seller closing-cost assumptions.",
      ),
      toolCard(
        "title-company-cost-calculator",
        "Stop title and escrow costs from hiding inside one percentage.",
      ),
      toolCard(
        "tax-proration-calculator",
        "Estimate the closing credit or debit from property tax timing.",
      ),
      toolCard(
        "resale-certificate-calculator",
        "Budget for resale certificates, condo questionnaires, association documents, and rush fees.",
      ),
      toolCard(
        "association-dues-calculator",
        "Estimate dues, prepaid/owed amounts, special assessments, and violation payoff.",
      ),
      toolCard(
        "association-transfer-fee-calculator",
        "Show how HOA or condo transfer fees affect seller proceeds or buyer cash to close.",
      ),
      linkCard(
        "HOA and Title Closing Checklist",
        "/property/checklists/hoa-title-closing-documents/",
        "Collect title fee sheets, tax proration, payoff timing, resale documents, association charges, and transfer fees.",
        "Checklist",
      ),
    ],
    sections: [
      {
        title: "What makes closing numbers fragile",
        body: "Closing estimates change when local custom, contract language, title company fees, tax timing, association rules, payoff dates, and lender disclosures move.",
        bullets: [
          "Ask the title company for the fee sheet before treating percentages as final.",
          "Separate seller credits from seller costs so the net sheet explains the real tradeoff.",
          "Get association fee schedules early; rush fees and document packages can surprise both sides.",
        ],
      },
    ],
  },
  {
    slug: "owner-costs",
    label: "Owner Costs",
    title:
      "Owner Cost Decisions: Repair, Replace, Save, Refinance, or Hold | Kefiw",
    h1: "Owner cost decisions",
    description:
      "Owner planning tools for mortgage costs, extra payments, roof and HVAC replacement, energy savings, savings goals, and repair-vs-replace choices.",
    keywords: [
      "home owner cost calculator",
      "repair vs replace calculator",
      "home energy savings calculator",
      "mortgage extra payment calculator",
    ],
    intro:
      "Owner decisions are usually about timing: spend now, patch, finance, wait, sell, or replace before the problem gets more expensive.",
    primaryCta: linkCard(
      "Property Decision Packet",
      "/property/decision-packet/",
      "Collect estimates, risks, documents, questions, quotes, and next steps into one printable packet.",
      "Output",
    ),
    secondaryCta: linkCard(
      "Property Start Here",
      "/property/start/",
      "Answer a few questions and get routed to the right calculator, guide, track, or packet.",
      "Start",
    ),
    cards: [
      linkCard(
        "Roof Repair vs Replacement",
        "/homelab/roof-repair-vs-replacement-calculator/",
        "Decide whether roof work is a patch, claim, full replacement, or sale-horizon problem.",
        "Roof",
      ),
      toolCard(
        "hvac-repair-vs-replace",
        "Compare HVAC repair economics before replacing equipment.",
      ),
      toolCard(
        "energy-savings-estimate",
        "Estimate annual savings, net upgrade cost, and payback.",
      ),
      linkCard(
        "Mortgage Extra Payment Calculator",
        "/calculators/mortgage-extra-payment-calculator/",
        "Test payoff speed and interest saved by extra payments.",
        "Mortgage",
      ),
      linkCard(
        "Savings Goal Calculator",
        "/calculators/savings-goal-calculator/",
        "See when you can fund a repair or upgrade without wrecking cash reserves.",
        "Cash",
      ),
      linkCard(
        "Contractor Signing Checklist",
        "/property/checklists/contractor-signing-checklist/",
        "Check scope, exclusions, payment schedule, warranty, change orders, hidden conditions, and completion proof before signing.",
        "Checklist",
      ),
      linkCard(
        "Quote Comparison Matrix",
        "/property/quote-comparison/",
        "Normalize repair, replacement, and improvement quotes before picking an option.",
        "Compare",
      ),
    ],
    sections: [
      {
        title: "Is this worth it yet?",
        body: "Owner cost decisions should compare timing, failure risk, energy waste, sale horizon, cash reserves, financing, and what happens if the repair waits.",
        bullets: [
          "A repair can be cheap and still wrong if it only delays an inevitable replacement by a few months.",
          "A replacement can be expensive and still right if safety, repeated failure, insurance, resale, or energy waste dominate.",
          "A financing decision should include monthly payment, total cost, emergency reserves, and whether the upgrade creates measurable value.",
        ],
      },
    ],
  },
  {
    slug: "invest",
    label: "Invest",
    title:
      "Rental and Investment Property Decisions: Cash Flow, Cap Rate, Reserves, and Due Diligence | Kefiw",
    h1: "Rental and investment property decisions",
    description:
      "Rental property planning tools for cash flow, cap rate, cash-on-cash return, DSCR, vacancy, repairs, capex, reserves, mortgage payment, and due diligence.",
    keywords: [
      "rental property calculator",
      "investment property cash flow",
      "cap rate calculator",
      "rental due diligence checklist",
    ],
    intro:
      "Investment property decisions go bad when rent is compared to the mortgage instead of being tested against vacancy, operating expenses, repairs, capex, debt, reserves, rules, and exit risk.",
    primaryCta: linkCard(
      "Rental Investor Planner",
      "/property/rental-investor-planner/",
      "Stress-test cash flow, cap rate, cash-on-cash return, DSCR, reserve target, vacancy, repairs, capex, management, and debt service.",
      "Planner",
    ),
    secondaryCta: linkCard(
      "Rental Due Diligence Checklist",
      "/property/checklists/rental-due-diligence-documents/",
      "Collect leases, rent evidence, expense bills, repairs, financing terms, reserves, rules, and exit assumptions.",
      "Checklist",
    ),
    cards: [
      linkCard(
        "Rental Investor Planner",
        "/property/rental-investor-planner/",
        "Model rent, vacancy, expenses, mortgage payment, reserves, cap rate, cash-on-cash return, and DSCR.",
        "Planner",
      ),
      linkCard(
        "Rental Due Diligence Checklist",
        "/property/checklists/rental-due-diligence-documents/",
        "Turn the deal into documents: leases, rent roll, tax bill, insurance, HOA rules, repair list, and reserve target.",
        "Checklist",
      ),
      linkCard(
        "Mortgage Calculator",
        "/calculators/mortgage-calculator/",
        "Estimate the payment assumption that feeds the rental model.",
        "Debt",
      ),
      linkCard(
        "Rent vs Buy / Horizon Point",
        "/finance/horizon-point/",
        "Check whether ownership duration and transaction costs create exit risk.",
        "Horizon",
      ),
      linkCard(
        "Property Decision Packet",
        "/property/decision-packet/",
        "Collect the deal thesis, documents, assumptions, risk flags, and next questions before acting.",
        "Output",
      ),
      linkCard(
        "Property Option Comparison Matrix",
        "/property/option-comparison/",
        "Compare rental, house-hack, wait, sell, or repair options by cash impact, proof, timing, and risk.",
        "Compare",
      ),
    ],
    sections: [
      {
        title: "What investors forget",
        body: "Small rental deals are usually broken by ordinary things: vacancy, tax reset, insurance, capex, turnover, management, weak lease proof, association limits, or no cash reserve after closing.",
        bullets: [
          "Use current leases and market-rent evidence before treating future rent as real.",
          "Hold back reserves for vacancy, turnover, repairs, deductible, taxes, insurance, and major systems.",
          "Check rental licensing, HOA caps, short-term rental rules, occupancy, parking, and local inspection requirements.",
        ],
      },
      {
        title: "What would make the deal go bad",
        body: "A rental that looks profitable on a pro forma can fail when the first repair, vacancy, reassessment, insurance increase, or rule conflict lands before the reserve is ready.",
        cards: [
          linkCard(
            "Rental Investor Planner",
            "/property/rental-investor-planner/",
            "Use conservative inputs and look at the risk flags before trusting the return.",
            "Stress test",
          ),
          linkCard(
            "Rental Due Diligence Checklist",
            "/property/checklists/rental-due-diligence-documents/",
            "Gather the documents that prove the income, expenses, rules, and repair assumptions.",
            "Evidence",
          ),
        ],
      },
    ],
  },
  {
    slug: "guides",
    label: "Guides",
    title: "Property Guides: Roof, HVAC, Selling, Buying, and Closing | Kefiw",
    h1: "Property guides",
    description:
      "Plain-English property guides for roof replacement, roof insurance, HVAC diagnosis, HVAC replacement, selling, buying, and closing costs.",
    keywords: [
      "property guides",
      "roof replacement guide",
      "hvac replacement guide",
      "home selling guide",
    ],
    intro:
      "Property guides answer the questions calculators cannot answer alone: what might I be forgetting, what would make this decision fail, and what should I ask before I sign?",
    primaryCta: linkCard(
      "Property Start Here",
      "/property/start/",
      "Route your situation to the best calculator, guide, track, or packet.",
      "Start",
    ),
    secondaryCta: linkCard(
      "Property Decision Packet",
      "/property/decision-packet/",
      "Build a printable summary of estimates, risks, documents, questions, and next steps.",
      "Output",
    ),
    cards: [
      linkCard(
        "Property Playbooks",
        "/property/playbooks/",
        "Use scenario plans for storm roof leaks, dead AC, low contractor bids, seller repairs, concessions, and cash-to-close surprises.",
        "Playbooks",
      ),
      linkCard(
        "Property Document Checklists",
        "/property/checklists/",
        "Collect the documents, proof, and questions that turn estimates into auditable decisions.",
        "Checklists",
      ),
      linkCard(
        "Quote Comparison Matrix",
        "/property/quote-comparison/",
        "Normalize contractor bids by scope, proof, warranty, timeline, cash exposure, and risk.",
        "Compare",
      ),
      linkCard(
        "Property Option Comparison Matrix",
        "/property/option-comparison/",
        "Compare seller offers, buyer closing versions, repair credits, and property options beyond headline price.",
        "Compare",
      ),
      linkCard(
        "How to Save on Roof Replacement Cost",
        "/guides/save-on-roof-replacement-cost/",
        "Reduce a roof quote by exposing scope tradeoffs instead of deleting water-management basics.",
        "Roof",
      ),
      linkCard(
        "Roof-over vs Tear-off",
        "/guides/roof-over-vs-tear-off/",
        "Know when roof-over is a budget tool and when it hides a bad deck.",
        "Roof",
      ),
      linkCard(
        "Roof Hail and Wind Insurance Discounts",
        "/guides/roof-hail-wind-insurance-discounts/",
        "Collect forms, labels, photos, nail documentation, and wind paperwork before final payment.",
        "Insurance",
      ),
      linkCard(
        "HVAC Diagnosis Live Matrix",
        "/guides/hvac-diagnosis-live-matrix/",
        "Start from symptoms and measurements before accepting a replacement quote.",
        "HVAC",
      ),
      linkCard(
        "Before You Replace Your HVAC",
        "/guides/hvac-full-replacement-alternatives/",
        "Price repair, partial replacement, duct fixes, mini-splits, and full replacement separately.",
        "HVAC",
      ),
      linkCard(
        "Mini-Splits vs Central AC",
        "/guides/mini-splits-vs-central-ac/",
        "Use ductless where zones and installation scope actually make sense.",
        "HVAC",
      ),
    ],
    sections: [
      {
        title: "How to use these guides",
        body: "Run the calculator for the number. Use the guide to challenge the number, find missing scope, spot bad assumptions, and prepare better questions.",
        bullets: [
          "For contractor decisions, compare written scopes before comparing prices.",
          "For closing decisions, separate line items before trusting a percentage.",
          "For selling and buying, test the decision under conservative assumptions before acting.",
        ],
      },
    ],
  },
];

export const PROPERTY_CATEGORIES_BY_SLUG = PROPERTY_CATEGORIES.reduce<
  Record<string, PropertyCategoryPage>
>((acc, category) => {
  acc[category.slug] = category;
  return acc;
}, {});

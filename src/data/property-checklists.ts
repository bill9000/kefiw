export interface PropertyChecklistLink {
  label: string;
  href: string;
  note?: string;
}

export interface PropertyChecklistItem {
  label: string;
  detail: string;
  required?: boolean;
  warning?: string;
}

export interface PropertyChecklistSection {
  title: string;
  why: string;
  items: PropertyChecklistItem[];
}

export interface PropertyChecklist {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  bestFor: string;
  trigger: string;
  warning?: string;
  sections: PropertyChecklistSection[];
  beforeYouAct: string[];
  relatedLinks: PropertyChecklistLink[];
  packetPrompt: string;
}

function link(
  label: string,
  href: string,
  note?: string,
): PropertyChecklistLink {
  return { label, href, note };
}

export const PROPERTY_CHECKLISTS: PropertyChecklist[] = [
  {
    slug: "roof-claim-documents",
    title: "Roof Claim Document Checklist | Kefiw",
    h1: "Roof claim document checklist",
    description:
      "Documents, photos, receipts, and questions to collect before a storm roof claim, roof replacement claim, or deductible conversation.",
    keywords: [
      "roof claim checklist",
      "roof insurance documents",
      "storm damage documents",
    ],
    bestFor:
      "Homeowners dealing with hail, wind, roof leaks, adjuster scopes, roof replacement claims, or deductible exposure.",
    trigger:
      "Use this before a contractor changes roof evidence, before the adjuster conversation, and before signing a roof replacement agreement.",
    warning:
      "If there is active water intrusion, electrical risk, unsafe roof access, or ceiling movement, use qualified emergency help first.",
    sections: [
      {
        title: "Event and damage proof",
        why: "A claim gets harder when the timeline, storm event, and before-repair condition are vague.",
        items: [
          {
            label: "Storm date, time, and type",
            detail:
              "Write down hail, wind, rain, tree impact, first leak observation, and whether neighboring properties had damage.",
            required: true,
          },
          {
            label: "Exterior photos",
            detail:
              "Capture roof slopes from the ground, missing shingles, lifted tabs, dents, gutters, downspouts, vents, flashing, fences, and soft metals.",
            required: true,
          },
          {
            label: "Interior photos",
            detail:
              "Photograph ceiling stains, walls, attic conditions, buckets, tarps, and where water entered.",
          },
          {
            label: "Temporary mitigation proof",
            detail:
              "Keep tarp invoices, emergency repair receipts, mitigation notes, and photos before and after mitigation.",
          },
        ],
      },
      {
        title: "Policy and estimate documents",
        why: "The number depends on deductible, ACV or RCV language, depreciation holdback, code upgrades, and scope lines.",
        items: [
          {
            label: "Insurance declarations page",
            detail:
              "Confirm deductible type, roof coverage terms, wind/hail deductible, replacement cost terms, and exclusions.",
            required: true,
          },
          {
            label: "Adjuster estimate or scope of loss",
            detail:
              "Compare roof squares, waste, starter, ridge cap, vents, flashing, drip edge, underlayment, decking, code items, detach/reset, and interior items.",
            required: true,
          },
          {
            label: "Contractor itemized scope",
            detail:
              "Ask the contractor to write included and excluded work rather than matching only the insurance total.",
            required: true,
          },
          {
            label: "Deductible and depreciation math",
            detail:
              "Use the roof insurance deductible calculator so out-of-pocket cash is visible before signing.",
            warning:
              "Do not rely on deductible waiver promises. Verify policy, contract, and local rules.",
          },
        ],
      },
      {
        title: "Questions before signing",
        why: "Roof claim problems usually show up in missing scope, cash timing, and warranty responsibility.",
        items: [
          {
            label: "What work is excluded?",
            detail:
              "Decking, flashing, vents, skylights, chimney work, gutters, interior repair, permits, disposal, and code upgrades should not be assumed.",
          },
          {
            label: "What happens if decking is bad?",
            detail:
              "Ask for the per-sheet price, approval process, photo proof, and whether insurance supplementing is expected.",
          },
          {
            label: "Who handles supplement evidence?",
            detail:
              "Clarify who submits photos and scope evidence, and what you are signing before funds are released.",
          },
        ],
      },
    ],
    beforeYouAct: [
      "Run the roof replacement, roof insurance deductible, and hail severity tools.",
      "Create a decision packet with storm timeline, photos, deductible exposure, and missing scope.",
      "Verify claim, contract, and payment terms with qualified professionals before signing.",
    ],
    relatedLinks: [
      link(
        "Roof Replacement Cost",
        "/homelab/roof-replacement-cost-calculator/",
      ),
      link(
        "Roof Insurance Deductible",
        "/homelab/roof-insurance-deductible-calculator/",
      ),
      link(
        "Roof Leak After Storm Playbook",
        "/property/playbooks/roof-leak-after-storm/",
      ),
      link("Decision Packet", "/property/decision-packet/"),
    ],
    packetPrompt:
      "Build a packet with the storm timeline, photo inventory, adjuster scope, contractor scope, deductible math, depreciation timing, exclusions, and supplement questions.",
  },
  {
    slug: "hvac-quote-documents",
    title: "HVAC Quote Document Checklist | Kefiw",
    h1: "HVAC quote document checklist",
    description:
      "What to collect before accepting an HVAC replacement quote, repair quote, duct scope, heat pump quote, or emergency AC replacement.",
    keywords: [
      "hvac quote checklist",
      "hvac replacement documents",
      "air conditioner quote questions",
    ],
    bestFor:
      "Owners comparing HVAC repair, replacement, ductwork, heat pump, furnace, AC, and energy upgrade options.",
    trigger:
      "Use this when a technician recommends replacement, a quote bundles several scopes together, or the system is failing under time pressure.",
    warning:
      "Do not open electrical cabinets unless qualified. Burning smell, gas smell, repeated breaker trips, or carbon monoxide concerns need qualified service.",
    sections: [
      {
        title: "Diagnosis evidence",
        why: "A replacement quote is stronger when it proves what failed and what cheaper causes were ruled out.",
        items: [
          {
            label: "Written symptom timeline",
            detail:
              "Note thermostat display, indoor blower behavior, outdoor unit behavior, ice, water, breakers, noises, smells, and recent service.",
            required: true,
          },
          {
            label: "Technician readings",
            detail:
              "Ask for capacitor, contactor, voltage, refrigerant, temperature split, static pressure, flame sensor, board input/output, or other relevant readings.",
          },
          {
            label: "Ruled-out cheaper causes",
            detail:
              "Get a written explanation for thermostat, float switch, filter, capacitor, contactor, drain, airflow, flame sensor, sequencer, and board checks where applicable.",
          },
        ],
      },
      {
        title: "Replacement quote details",
        why: "HVAC quotes often hide equipment compatibility, duct scope, electrical work, rebates, and warranty language.",
        items: [
          {
            label: "Equipment model numbers",
            detail:
              "Collect outdoor unit, indoor coil, furnace or air handler, heat pump, thermostat, and accessory model numbers.",
            required: true,
          },
          {
            label: "Load and sizing rationale",
            detail:
              "Ask whether sizing is based on Manual J, historical performance, duct limits, or a rule of thumb.",
            warning:
              "Bigger equipment can perform worse if ducts, humidity, or cycling are ignored.",
          },
          {
            label: "Duct and airflow scope",
            detail:
              "Clarify duct sealing, return-air work, filter cabinet, balancing, zoning, insulation, and whether ducts are excluded.",
          },
          {
            label: "Warranty and registration terms",
            detail:
              "Separate parts warranty, labor warranty, compressor warranty, heat exchanger warranty, and registration deadlines.",
          },
        ],
      },
      {
        title: "Money and timing",
        why: "Emergency timing can push owners into a bundled scope before repair, partial replacement, rebate, and financing options are visible.",
        items: [
          {
            label: "Repair path and partial replacement path",
            detail:
              "Ask for a repair quote and any reasonable partial replacement quote if the system is not a clear full replacement.",
          },
          {
            label: "Rebate assumptions",
            detail:
              "Confirm who files, what equipment qualifies, deadlines, and whether the quote assumes money you may not receive.",
          },
          {
            label: "Financing terms",
            detail:
              "Compare monthly payment, total repayment, promotional period, dealer fees, and cash price.",
          },
        ],
      },
    ],
    beforeYouAct: [
      "Run the HVAC diagnosis matrix before treating replacement as the only option.",
      "Compare repair, partial replacement, full replacement, ducts, and mini-split alternatives.",
      "Use the quote comparison matrix if multiple bids differ in scope.",
    ],
    relatedLinks: [
      link("HVAC Diagnosis Matrix", "/property/hvac-diagnosis-live-matrix/"),
      link("HVAC Replacement Cost", "/property/hvac-replacement-cost/"),
      link("HVAC Repair vs Replace", "/property/hvac-repair-vs-replace/"),
      link("Quote Comparison Matrix", "/property/quote-comparison/"),
    ],
    packetPrompt:
      "Build a packet with symptoms, technician evidence, ruled-out causes, quote options, duct assumptions, rebate assumptions, warranty terms, and open questions.",
  },
  {
    slug: "contractor-signing-checklist",
    title: "Contractor Signing Checklist | Kefiw",
    h1: "Contractor signing checklist",
    description:
      "Before signing a contractor quote, collect scope, exclusions, payment terms, warranty language, change-order rules, insurance proof, and project assumptions.",
    keywords: [
      "contractor contract checklist",
      "contractor quote checklist",
      "home improvement signing checklist",
    ],
    bestFor:
      "Owners signing roof, HVAC, remodel, repair, replacement, window, energy, or home improvement work.",
    trigger:
      "Use this when you like a quote but the scope, exclusions, warranty, payment schedule, or change-order rules are not yet clear.",
    sections: [
      {
        title: "Scope and exclusions",
        why: "The most expensive part of a low bid is often the missing line that turns into a change order.",
        items: [
          {
            label: "Itemized included work",
            detail:
              "List labor, materials, permits, access, protection, disposal, cleanup, testing, inspection, and final documentation.",
            required: true,
          },
          {
            label: "Excluded work",
            detail:
              "Ask the contractor to write what is not included, not just what is included.",
            required: true,
          },
          {
            label: "Hidden condition pricing",
            detail:
              "Document per-unit pricing for decking, rot, electrical, duct, plumbing, structural, access, or code surprises.",
          },
          {
            label: "Material grade and substitutions",
            detail:
              "Get brand, model, grade, color, efficiency, warranty class, and substitution approval language.",
          },
        ],
      },
      {
        title: "Money and responsibility",
        why: "Payment terms should match completion evidence, responsibility, and risk.",
        items: [
          {
            label: "Payment schedule",
            detail:
              "Tie deposits, draws, and final payment to milestones, inspections, delivery, or completion where appropriate.",
            required: true,
          },
          {
            label: "Change-order process",
            detail:
              "Require written approval before added work changes cost or timeline.",
            required: true,
          },
          {
            label: "Warranty terms",
            detail:
              "Separate manufacturer warranty, labor warranty, workmanship warranty, and exclusions.",
          },
          {
            label: "Insurance, licensing, and lien paperwork",
            detail:
              "Collect proof where applicable and ask what completion paperwork or lien waiver is available.",
          },
        ],
      },
      {
        title: "Timing and finish",
        why: "A clean scope still fails if timing, cleanup, access, and completion criteria are vague.",
        items: [
          {
            label: "Start date, duration, and delays",
            detail:
              "Write the expected timing and what happens if weather, materials, permits, or inspections delay the job.",
          },
          {
            label: "Access and protection plan",
            detail:
              "Clarify driveway, attic, roof, yard, pets, utilities, furniture, dust, landscaping, and neighbor impacts.",
          },
          {
            label: "Completion evidence",
            detail:
              "Ask for photos, test results, permit closure, warranty registration, manuals, receipts, or final walkthrough notes.",
          },
        ],
      },
    ],
    beforeYouAct: [
      "Normalize competing quotes in the quote comparison matrix.",
      "Put exclusions and open questions into a decision packet.",
      "Verify contractor credentials, contract terms, permit rules, and local legal requirements before signing.",
    ],
    relatedLinks: [
      link("Quote Comparison Matrix", "/property/quote-comparison/"),
      link(
        "Contractor Bid Too Cheap Playbook",
        "/property/playbooks/contractor-bid-too-cheap/",
      ),
      link("Property Decision Packet", "/property/decision-packet/"),
      link("Property Start Here", "/property/start/"),
    ],
    packetPrompt:
      "Build a packet with scope, exclusions, hidden-condition prices, payment schedule, warranty language, change-order rules, and signing threshold.",
  },
  {
    slug: "seller-net-sheet-documents",
    title: "Seller Net Sheet Document Checklist | Kefiw",
    h1: "Seller net sheet document checklist",
    description:
      "Documents and assumptions to collect before relying on seller proceeds, net sheet, commission, concessions, prep ROI, or closing cost estimates.",
    keywords: [
      "seller net sheet checklist",
      "seller proceeds documents",
      "home sale closing documents",
    ],
    bestFor:
      "Sellers comparing list price, offers, commission terms, repair credits, closing costs, payoff, taxes, and association costs.",
    trigger:
      "Use this before listing, before accepting an offer, or whenever a concession changes the seller net.",
    sections: [
      {
        title: "Price, payoff, and proceeds",
        why: "The seller's check can be wrong if payoff timing, concessions, credits, or prep costs are missing.",
        items: [
          {
            label: "Payoff estimate",
            detail:
              "Use current principal balance for planning, then get payoff timing when an offer is real.",
            required: true,
          },
          {
            label: "Estimated sale price and backup scenario",
            detail:
              "Run optimistic, realistic, and lower-offer net sheets rather than one headline price.",
          },
          {
            label: "Commission terms",
            detail:
              "Clarify listing-side commission, buyer-side concession strategy, minimum fees, admin fees, and negotiated changes.",
          },
          {
            label: "Seller credits and concessions",
            detail:
              "Separate closing cost help, rate buydowns, repair credits, commission concessions, and occupancy terms.",
          },
        ],
      },
      {
        title: "Closing and association line items",
        why: "Small title, tax, HOA, and document fees can distort a net sheet when they are hidden in a percentage.",
        items: [
          {
            label: "Title company fee estimate",
            detail:
              "Ask for settlement, policy, recording, courier, wire, endorsement, document, and escrow line items.",
          },
          {
            label: "Tax proration assumption",
            detail:
              "Check tax year, proration date, local custom, and whether the latest tax bill is being used.",
          },
          {
            label: "HOA or condo fee schedule",
            detail:
              "Collect resale certificate, transfer fee, statement fee, rush fee, unpaid dues, assessments, and violations.",
          },
        ],
      },
      {
        title: "Prep and repair decisions",
        why: "Prep spend should be tied to blocker removal, buyer perception, negotiation leverage, or net value.",
        items: [
          {
            label: "Repair estimates",
            detail:
              "Sort each repair into must-fix, likely negotiation item, buyer perception quick win, cosmetic maybe, or skip/credit.",
          },
          {
            label: "Receipts and disclosure notes",
            detail:
              "Keep work proof and note items that may need disclosure under local rules.",
          },
          {
            label: "Listing timing cost",
            detail:
              "Estimate carrying cost, market timing, and delay risk before approving prep that takes weeks.",
          },
        ],
      },
    ],
    beforeYouAct: [
      "Run seller proceeds, net sheet, commission, closing cost, and prep ROI calculators.",
      "Compare concession-heavy offers in the property option comparison matrix.",
      "Verify contract, title, tax, association, and brokerage assumptions with qualified professionals.",
    ],
    relatedLinks: [
      link("Seller Proceeds", "/property/seller-proceeds-calculator/"),
      link("Net Sheet Calculator", "/property/net-sheet-calculator/"),
      link("Option Comparison Matrix", "/property/option-comparison/"),
      link("Sell My Home Track", "/tracks/sell-my-home/"),
    ],
    packetPrompt:
      "Build a packet with payoff, three net sheets, commission terms, concessions, prep spend, repair choices, title fees, tax assumptions, and association charges.",
  },
  {
    slug: "buyer-cash-to-close-documents",
    title: "Buyer Cash to Close Document Checklist | Kefiw",
    h1: "Buyer cash to close document checklist",
    description:
      "Documents and line items buyers should collect before trusting cash to close, lender disclosures, title estimates, escrow setup, and HOA charges.",
    keywords: [
      "cash to close checklist",
      "buyer closing cost documents",
      "closing disclosure checklist",
    ],
    bestFor:
      "Buyers comparing down payment, lender costs, title charges, prepaids, escrow setup, taxes, insurance, credits, and association costs.",
    trigger:
      "Use this before wiring funds, after a loan estimate changes, or when cash to close jumps near closing.",
    warning:
      "Always verify wiring instructions directly through trusted channels. Do not rely on emailed wire changes without independent confirmation.",
    sections: [
      {
        title: "Lender and title documents",
        why: "Cash to close changes when lender fees, title fees, credits, escrow, and prepaids are mixed together.",
        items: [
          {
            label: "Loan estimate and closing disclosure",
            detail:
              "Compare versions and ask which exact line changed from the prior estimate.",
            required: true,
          },
          {
            label: "Title or escrow estimate",
            detail:
              "Collect settlement, lender policy, owner policy, recording, wire, courier, endorsement, document, and escrow lines.",
            required: true,
          },
          {
            label: "Seller credit and lender credit terms",
            detail:
              "Confirm credits appear in the right section and are not lost because of limits or contract wording.",
          },
        ],
      },
      {
        title: "Prepaids, escrow, and taxes",
        why: "Not every increase is a fee. Some increases are prepaid interest, insurance, tax escrow, or timing.",
        items: [
          {
            label: "Homeowners insurance invoice",
            detail:
              "Confirm premium, paid status, escrow treatment, and effective date.",
          },
          {
            label: "Property tax proration",
            detail:
              "Check latest tax bill, proration date, local custom, exemptions, and whether taxes are prepaid or escrowed.",
          },
          {
            label: "Escrow setup",
            detail: "Separate reserve deposits from actual closing fees.",
          },
          {
            label: "Prepaid interest",
            detail:
              "Closing date can change the number of prepaid interest days.",
          },
        ],
      },
      {
        title: "Post-closing reserve",
        why: "A purchase can close and still be fragile if repairs, move-in costs, and cash buffer disappear.",
        items: [
          {
            label: "Inspection and appraisal cash",
            detail:
              "Track what was already paid and what is still due outside the closing table.",
          },
          {
            label: "HOA or condo fees",
            detail:
              "Collect transfer, move-in, capital contribution, working capital, prepaid dues, and document fees.",
          },
          {
            label: "Repair and moving reserve",
            detail:
              "Do not let the closing number consume the cash needed for immediate repairs, moving, locks, utilities, and appliances.",
            warning:
              "If a cash-to-close jump drains the reserve, reassess the purchase before wiring.",
          },
        ],
      },
    ],
    beforeYouAct: [
      "Rebuild cash to close from line items instead of relying on a percentage.",
      "Compare old and new estimates line by line.",
      "Verify wire instructions, lender disclosures, title statements, and association amounts before closing.",
    ],
    relatedLinks: [
      link("Cash to Close", "/property/cash-to-close-calculator/"),
      link("Title Company Cost", "/property/title-company-cost-calculator/"),
      link("Tax Proration", "/property/tax-proration-calculator/"),
      link(
        "Cash to Close Jumped Playbook",
        "/property/playbooks/cash-to-close-jumped/",
      ),
    ],
    packetPrompt:
      "Build a packet with loan estimate, closing disclosure, title estimate, seller credits, escrow setup, prepaids, association charges, cash reserve, and changed lines.",
  },
  {
    slug: "hoa-title-closing-documents",
    title: "HOA and Title Closing Checklist | Kefiw",
    h1: "HOA and title closing checklist",
    description:
      "Title, escrow, tax proration, HOA, condo, resale certificate, transfer fee, and closing-line documents to collect before closing.",
    keywords: [
      "hoa closing checklist",
      "title company cost checklist",
      "resale certificate checklist",
    ],
    bestFor:
      "Buyers, sellers, and agents trying to make title, escrow, association, and tax line items auditable.",
    trigger:
      "Use this when a closing estimate has broad percentages, association documents are pending, or title charges changed.",
    sections: [
      {
        title: "Title and escrow fee lines",
        why: "Title costs are easier to challenge when each fee has its own line.",
        items: [
          {
            label: "Settlement or escrow fee",
            detail:
              "Confirm party responsible, local custom, and whether fee is flat or percentage-based.",
            required: true,
          },
          {
            label: "Title policy charges",
            detail:
              "Separate owner policy, lender policy, simultaneous issue, endorsements, and optional coverage.",
          },
          {
            label: "Recording, wire, courier, document, and notary fees",
            detail: "Look for duplicated or unclear pass-through charges.",
          },
        ],
      },
      {
        title: "Taxes and payoff timing",
        why: "Proration and payoff errors can move the net sheet or cash-to-close number late in the process.",
        items: [
          {
            label: "Tax bill and proration method",
            detail:
              "Check tax period, bill status, closing date, exemptions, and who receives the credit or debit.",
          },
          {
            label: "Payoff statement",
            detail:
              "For sellers, use a payoff quote with interest-through date, release fee, wire fee, and escrow balance handling.",
          },
          {
            label: "Municipal or transfer charges",
            detail:
              "Check transfer tax, local certificates, utility payoff, occupancy permits, and recording requirements where applicable.",
          },
        ],
      },
      {
        title: "Association documents",
        why: "HOA and condo fees can hit both sides through resale packages, transfer fees, dues, assessments, violations, and rush charges.",
        items: [
          {
            label: "Resale certificate or condo questionnaire",
            detail:
              "Confirm base fee, rush fee, update fee, lender questionnaire, and who pays.",
            required: true,
          },
          {
            label: "Transfer, capital, move-in, and working-capital fees",
            detail: "Separate one-time charges from prepaid dues.",
          },
          {
            label: "Dues, assessments, violations, and fines",
            detail:
              "Ask whether any unpaid amount, special assessment, violation, or architectural issue must be cleared before closing.",
          },
        ],
      },
    ],
    beforeYouAct: [
      "Run title company cost, tax proration, resale certificate, association dues, and transfer fee calculators.",
      "Ask the title company and association manager for current fee sheets.",
      "Verify contract responsibility for every fee before treating the estimate as final.",
    ],
    relatedLinks: [
      link("Title Company Cost", "/property/title-company-cost-calculator/"),
      link("Tax Proration", "/property/tax-proration-calculator/"),
      link("Resale Certificate", "/property/resale-certificate-calculator/"),
      link(
        "Association Transfer Fee",
        "/property/association-transfer-fee-calculator/",
      ),
    ],
    packetPrompt:
      "Build a packet with title fee sheet, tax proration, payoff timing, association documents, transfer fees, unpaid dues, assessments, and contract responsibility.",
  },
  {
    slug: "rental-due-diligence-documents",
    title: "Rental Property Due Diligence Checklist | Kefiw",
    h1: "Rental property due diligence checklist",
    description:
      "Documents and checks for rental property cash flow, cap rate, repair reserve, lease review, operating expenses, and investor risk.",
    keywords: [
      "rental property checklist",
      "rental due diligence documents",
      "investment property cash flow checklist",
    ],
    bestFor:
      "Small rental investors, house hackers, owner-landlords, and buyers stress-testing a rental property before closing.",
    trigger:
      "Use this before making an offer, during inspection, or whenever pro forma numbers look better than the evidence.",
    sections: [
      {
        title: "Income proof",
        why: "Rental math fails when market rent, current rent, concessions, vacancy, and lease terms are treated as the same number.",
        items: [
          {
            label: "Current leases and rent roll",
            detail:
              "Collect rent amount, deposits, lease end dates, concessions, late fees, utility responsibility, and renewal terms.",
            required: true,
          },
          {
            label: "Market rent evidence",
            detail:
              "Use comparable rentals, listing age, concessions, seasonality, and property condition before assuming an increase.",
          },
          {
            label: "Vacancy and collection assumption",
            detail: "Stress-test vacancy and bad-debt separately from rent.",
          },
        ],
      },
      {
        title: "Operating expenses",
        why: "Cash flow can disappear when taxes, insurance, repairs, capex, management, utilities, and HOA rules are understated.",
        items: [
          {
            label: "Tax, insurance, and HOA bills",
            detail:
              "Collect current bills and ask whether taxes or insurance will reset after purchase.",
            required: true,
          },
          {
            label: "Repairs and capital items",
            detail:
              "List roof, HVAC, water heater, sewer, electrical, plumbing, appliances, windows, exterior, and safety items.",
          },
          {
            label: "Management, turnover, and leasing costs",
            detail:
              "Include management fee, leasing fee, renewal fee, turnover work, cleaning, and vacancy carry.",
          },
        ],
      },
      {
        title: "Risk and exit",
        why: "A rental can look profitable and still be a bad fit if reserves, leverage, rules, or exit value are fragile.",
        items: [
          {
            label: "Cash reserve after close",
            detail:
              "Compare reserve against six months of debt service plus operating expenses.",
            warning:
              "A thin reserve can turn one vacancy or repair into a forced sale.",
          },
          {
            label: "Loan terms and DSCR",
            detail:
              "Record rate, payment, escrow, prepayment penalty, adjustable terms, and debt-service coverage.",
          },
          {
            label: "Local rules and association restrictions",
            detail:
              "Verify rental licensing, short-term rental rules, occupancy, parking, HOA rental caps, and inspection requirements.",
          },
          {
            label: "Exit assumptions",
            detail:
              "Stress-test sale costs, repair needs, rent growth, cap rate, and holding period.",
          },
        ],
      },
    ],
    beforeYouAct: [
      "Run the rental investor planner with conservative vacancy, repair, capex, and management assumptions.",
      "Build a decision packet with evidence for rent, expenses, repairs, reserve, financing, and rules.",
      "Verify legal, tax, financing, insurance, and local rental requirements with qualified professionals.",
    ],
    relatedLinks: [
      link("Rental Investor Planner", "/property/rental-investor-planner/"),
      link("Investment Property Hub", "/property/invest/"),
      link("Property Decision Packet", "/property/decision-packet/"),
      link("Mortgage Calculator", "/calculators/mortgage-calculator/"),
    ],
    packetPrompt:
      "Build a packet with rent evidence, current leases, expense bills, repair list, reserve target, financing terms, local rules, and exit assumptions.",
  },
];

export const PROPERTY_CHECKLISTS_BY_SLUG = PROPERTY_CHECKLISTS.reduce<
  Record<string, PropertyChecklist>
>((acc, checklist) => {
  acc[checklist.slug] = checklist;
  return acc;
}, {});

export function propertyChecklistHref(
  checklist: Pick<PropertyChecklist, "slug"> | string,
): string {
  const slug = typeof checklist === "string" ? checklist : checklist.slug;
  return `/property/checklists/${slug}/`;
}

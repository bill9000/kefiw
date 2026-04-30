export interface PropertyPlaybookLink {
  label: string;
  href: string;
  note?: string;
}

export interface PropertyPlaybookStep {
  title: string;
  body: string;
  ask?: string;
}

export interface PropertyPlaybook {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  trigger: string;
  bestFor: string;
  warning?: string;
  firstMove: string;
  mistakeChecks: string[];
  forgottenItems: string[];
  failureModes: string[];
  steps: PropertyPlaybookStep[];
  documents: string[];
  calculators: PropertyPlaybookLink[];
  guides: PropertyPlaybookLink[];
  packetPrompt: string;
}

export const PROPERTY_PLAYBOOKS: PropertyPlaybook[] = [
  {
    slug: "roof-leak-after-storm",
    title: "Roof Leak After a Storm Playbook | Kefiw",
    h1: "Roof leak after a storm",
    description:
      "What to document, what to ask, and which roof calculators to use after a storm leak, hail event, wind event, or sudden roof concern.",
    keywords: [
      "roof leak after storm",
      "storm roof damage checklist",
      "roof claim questions",
    ],
    trigger:
      "Water appeared, shingles lifted, hail hit, wind damaged the roof, or a contractor says the roof should be replaced.",
    bestFor:
      "Homeowners trying to decide between emergency repair, insurance claim, roof inspection, and full replacement.",
    warning:
      "If water is near electrical fixtures, ceilings are sagging, or active water intrusion is unsafe, use qualified emergency help first.",
    firstMove:
      "Document before anyone changes the evidence: photos, dates, storm history, leak location, ceiling stains, exterior damage, and temporary mitigation.",
    mistakeChecks: [
      "Do not sign a roof contract before understanding deductible, ACV/RCV, depreciation holdback, and claim scope.",
      "Do not let a contractor promise deductible waivers or vague claim handling.",
      "Do not compare roof bids unless tear-off, decking, underlayment, flashing, vents, edge metal, cleanup, and warranty are visible.",
    ],
    forgottenItems: [
      "Interior damage photos",
      "Tree rub and maintenance conditions",
      "Pipe boots, vents, chimney flashing, skylights, and old penetrations",
      "Temporary repair receipts and mitigation notes",
    ],
    failureModes: [
      "The insurance scope omits required roof-system items.",
      "A temporary repair hides evidence before documentation is complete.",
      "Deductible and depreciation create more out-of-pocket cost than expected.",
    ],
    steps: [
      {
        title: "Document the event",
        body: "Write the date, time, storm type, first leak observation, affected rooms, and anything changed since the storm.",
        ask: "What photos and receipts would I need if the scope is questioned later?",
      },
      {
        title: "Estimate the full job, not the first check",
        body: "Use replacement cost, repair-vs-replace, and deductible calculators to separate total scope from insurance cash timing.",
        ask: "Am I comparing total roof cost, claim payment, or out-of-pocket cash?",
      },
      {
        title: "Make the scope auditable",
        body: "List missing items before the adjuster or contractor conversation: drip edge, starter, ridge cap, flashing, vents, decking, code upgrades, detach/reset, and access labor.",
      },
    ],
    documents: [
      "Insurance declarations page",
      "Adjuster estimate / scope of loss",
      "Roof photos before repair",
      "Contractor itemized scope",
      "Temporary repair receipts",
    ],
    calculators: [
      {
        label: "Roof Replacement Cost",
        href: "/homelab/roof-replacement-cost-calculator/",
      },
      {
        label: "Roof Insurance Deductible",
        href: "/homelab/roof-insurance-deductible-calculator/",
      },
      {
        label: "Hail Damage Severity",
        href: "/homelab/hail-damage-severity-estimator/",
      },
    ],
    guides: [
      {
        label: "How to Save on Roof Replacement Cost",
        href: "/guides/save-on-roof-replacement-cost/",
      },
      {
        label: "Roof Hail and Wind Insurance Discounts",
        href: "/guides/roof-hail-wind-insurance-discounts/",
      },
    ],
    packetPrompt:
      "Create a packet with the storm timeline, photos, total range, deductible exposure, missing scope, and adjuster questions.",
  },
  {
    slug: "ac-dead-in-heat",
    title: "AC Dead in the Heat Playbook | Kefiw",
    h1: "AC dead in the heat",
    description:
      "What to ask before a dead AC becomes an automatic full HVAC replacement quote.",
    keywords: [
      "ac dead what to ask",
      "air conditioner replacement quote",
      "hvac diagnosis questions",
    ],
    trigger:
      "The AC is silent, humming, blowing warm air, icing, tripping, or a technician says replacement is needed.",
    bestFor:
      "Owners under time pressure who need cooling restored without accepting an unsupported replacement scope.",
    warning:
      "Do not open electrical cabinets unless qualified. Capacitors can hold dangerous charge. Burning smell or repeated breaker trips need qualified service.",
    firstMove:
      "Write down exactly what happened: thermostat display, indoor blower, outdoor unit behavior, ice, water/float switch, breaker behavior, and recent thermostat or service changes.",
    mistakeChecks: [
      'Do not let "dead AC" become the diagnosis.',
      'Do not accept "bad board" without the failed input or output named.',
      "Do not replace ducts, furnace, or blower without a written reason.",
    ],
    forgottenItems: [
      "Capacitor and contactor readings",
      "Drain float switch",
      "Dirty filter or iced coil",
      "Thermostat setup",
      "Duct and return-air condition",
    ],
    failureModes: [
      "Emergency timing reduces quote leverage.",
      "A cheap service repair is skipped because replacement is easier to sell.",
      "A new system still underperforms because airflow was the real issue.",
    ],
    steps: [
      {
        title: "Start with the symptom matrix",
        body: "Use the HVAC Diagnosis Live Matrix to convert what you saw into questions the technician should answer.",
      },
      {
        title: "Ask for the ruled-out list",
        body: "For a dead or weak AC, ask what readings rule out thermostat signal, float switch, capacitor, contactor, fan motor, filter, ice, airflow, and compressor start problems.",
      },
      {
        title: "Price more than one path",
        body: "If replacement is still recommended, ask for repair, partial replacement, full replacement, and duct/airflow scope as separate options.",
      },
    ],
    documents: [
      "Technician notes",
      "Test readings",
      "Quote with equipment model numbers",
      "Warranty terms",
      "Rebate assumptions",
    ],
    calculators: [
      {
        label: "HVAC Diagnosis Live Matrix",
        href: "/property/hvac-diagnosis-live-matrix/",
      },
      {
        label: "HVAC Replacement Cost",
        href: "/property/hvac-replacement-cost/",
      },
      {
        label: "HVAC Repair vs Replace",
        href: "/property/hvac-repair-vs-replace/",
      },
    ],
    guides: [
      {
        label: "Your AC Is Dead: Why That Does Not Always Mean Replacement",
        href: "/guides/ac-dead-not-always-replacement/",
      },
      {
        label: "Before You Replace Your HVAC",
        href: "/guides/hvac-full-replacement-alternatives/",
      },
    ],
    packetPrompt:
      "Create a packet with symptoms, failed readings, cheaper causes ruled out, replacement range, and quote questions.",
  },
  {
    slug: "contractor-bid-too-cheap",
    title: "Contractor Bid Too Cheap Playbook | Kefiw",
    h1: "Contractor bid looks too cheap",
    description:
      "How to compare a low contractor bid against scope, exclusions, warranty, timing, materials, and responsibility.",
    keywords: [
      "contractor bid too cheap",
      "compare contractor quotes",
      "home repair quote checklist",
    ],
    trigger:
      "One quote is far below the others, or a contractor gives a one-line price with little detail.",
    bestFor:
      "Owners comparing roof, HVAC, remodel, repair, or improvement quotes before signing.",
    firstMove:
      "Turn each quote into the same checklist before comparing price.",
    mistakeChecks: [
      "Do not treat a vague low bid as savings.",
      "Do not compare bids with different materials, warranty, access, permit, cleanup, or hidden-condition assumptions.",
      "Do not accept verbal scope additions without written terms.",
    ],
    forgottenItems: [
      "Permit",
      "Disposal",
      "Hidden damage allowance",
      "Material brand and grade",
      "Labor warranty",
      "Payment schedule",
      "Lien waiver",
    ],
    failureModes: [
      "Change orders erase the low price.",
      "The contractor excludes the line item that actually matters.",
      "Warranty or insurance responsibility is unclear when the job fails.",
    ],
    steps: [
      {
        title: "Normalize the scope",
        body: "Write the same scope headings for every bid: labor, materials, permit, access, hidden damage, cleanup, warranty, exclusions, and payment terms.",
      },
      {
        title: "Find the missing line",
        body: "Ask the low bidder to state exactly what is not included and what triggers a change order.",
      },
      {
        title: "Put the comparison in a packet",
        body: "Use the decision packet to list what differs between quotes and which question must be answered before signing.",
      },
    ],
    documents: [
      "Itemized quote",
      "License/insurance proof where applicable",
      "Warranty terms",
      "Payment schedule",
      "Change-order language",
    ],
    calculators: [
      { label: "Property Decision Packet", href: "/property/decision-packet/" },
      {
        label: "Roof Replacement Cost",
        href: "/homelab/roof-replacement-cost-calculator/",
      },
      {
        label: "HVAC Replacement Cost",
        href: "/property/hvac-replacement-cost/",
      },
    ],
    guides: [
      {
        label: "How to Save on Roof Replacement Cost",
        href: "/guides/save-on-roof-replacement-cost/",
      },
    ],
    packetPrompt:
      "Create a packet with bid differences, missing scope, excluded work, warranty terms, and the signing threshold.",
  },
  {
    slug: "selling-home-needs-repairs",
    title: "Selling a Home That Needs Repairs Playbook | Kefiw",
    h1: "Selling a home that needs repairs",
    description:
      "Decide what to fix, credit, disclose, price around, or leave alone before listing a home.",
    keywords: [
      "selling home needs repairs",
      "pre listing repairs worth it",
      "seller repair credit",
    ],
    trigger:
      "You are preparing to list and the house has visible repairs, dated finishes, inspection risk, or system issues.",
    bestFor:
      "Sellers deciding between pre-listing work, credits, pricing strategy, and as-is positioning.",
    firstMove:
      "Separate repairs into safety/lender blockers, inspection negotiation risks, buyer-perception quick wins, and cosmetic wish-list items.",
    mistakeChecks: [
      "Do not spend on cosmetic work before safety, lender, insurance, and inspection blockers are understood.",
      "Do not assume every dollar of prep returns at sale.",
      "Do not hide known issues that should be disclosed under local rules.",
    ],
    forgottenItems: [
      "Sale horizon",
      "Market temperature",
      "Buyer expectations by price point",
      "Contractor timing",
      "Cash needed before listing",
    ],
    failureModes: [
      "Prep delays the listing into a worse market window.",
      "Repairs reveal more work and burn cash.",
      "A buyer still asks for credits after the seller already paid for cosmetic work.",
    ],
    steps: [
      {
        title: "Run prep ROI before spending",
        body: "Use the prep ROI calculator to sort work by buyer impact, time pressure, and likely negotiation value.",
      },
      {
        title: "Model net proceeds with and without prep",
        body: "Compare expected sale price, prep cash, concessions, commission, closing costs, and payoff.",
      },
      {
        title: "Choose fix, credit, disclose, or price around",
        body: "Every repair should have a reason: removes a blocker, reduces buyer fear, improves net, or is better left as a credit.",
      },
    ],
    documents: [
      "Repair estimates",
      "Seller disclosure notes",
      "Agent pricing analysis",
      "Before/after photos",
      "Receipts",
    ],
    calculators: [
      {
        label: "Home Sale Prep ROI",
        href: "/property/home-sale-prep-roi-calculator/",
      },
      {
        label: "Seller Proceeds",
        href: "/property/seller-proceeds-calculator/",
      },
      { label: "Seller Net Sheet", href: "/property/net-sheet-calculator/" },
    ],
    guides: [{ label: "Sell My Home Track", href: "/tracks/sell-my-home/" }],
    packetPrompt:
      "Create a packet with repairs sorted by blocker, quick win, maybe, skip, credit, and net effect.",
  },
  {
    slug: "offer-has-concessions",
    title: "Offer Has Concessions Playbook | Kefiw",
    h1: "Offer has concessions",
    description:
      "How sellers can compare offer price, credits, repair requests, closing cost help, commission terms, and timing.",
    keywords: [
      "seller concessions offer",
      "compare home offers net sheet",
      "seller net sheet concessions",
    ],
    trigger:
      "An offer includes credits, repair requests, seller-paid closing costs, rate buydown, commission terms, or timing tradeoffs.",
    bestFor:
      "Sellers comparing offers that are not directly comparable by price alone.",
    firstMove:
      "Turn every offer into a net sheet before reacting to the headline price.",
    mistakeChecks: [
      "Do not compare offers by price before subtracting credits and concession terms.",
      "Do not ignore repair request timing and uncertainty.",
      "Do not forget that closing date can change taxes, payoff, carrying cost, and risk.",
    ],
    forgottenItems: [
      "Buyer financing risk",
      "Appraisal gap",
      "Inspection contingency",
      "Occupancy timing",
      "Repair credit vs repair completion",
    ],
    failureModes: [
      "The highest offer has the lowest net.",
      "A credit saves time but leaves a buyer defect unresolved.",
      "Timing creates carrying costs or overlap costs that were not priced.",
    ],
    steps: [
      {
        title: "Build a net sheet for each offer",
        body: "Use the same payoff, commission, tax, title, association, prep, repair, and concession assumptions for every offer.",
      },
      {
        title: "Separate money from risk",
        body: "A lower net with stronger financing or cleaner contingencies may be worth comparing against a higher-risk offer.",
      },
      {
        title: "Ask for the missing terms",
        body: "If the offer is unclear about credits, buyer broker terms, repairs, occupancy, or appraisal, clarify before ranking it.",
      },
    ],
    documents: [
      "Purchase contract",
      "Offer summary",
      "Net sheet",
      "Repair request",
      "Title estimate",
      "Payoff estimate",
    ],
    calculators: [
      { label: "Seller Net Sheet", href: "/property/net-sheet-calculator/" },
      {
        label: "Seller Proceeds",
        href: "/property/seller-proceeds-calculator/",
      },
      {
        label: "Commission Calculator",
        href: "/property/commission-calculator/",
      },
    ],
    guides: [{ label: "Sell My Home Track", href: "/tracks/sell-my-home/" }],
    packetPrompt:
      "Create a packet with each offer, net proceeds, concessions, contingencies, timing, and open questions.",
  },
  {
    slug: "cash-to-close-jumped",
    title: "Cash to Close Jumped Playbook | Kefiw",
    h1: "Cash to close jumped",
    description:
      "What buyers should check when cash to close is higher than expected before closing.",
    keywords: [
      "cash to close jumped",
      "closing disclosure higher than expected",
      "buyer closing costs surprise",
    ],
    trigger:
      "The lender disclosure, title estimate, or closing statement shows more cash needed than expected.",
    bestFor:
      "Buyers trying to understand a closing-cash surprise before wiring funds.",
    firstMove:
      "Identify which line moved: down payment, loan costs, title fees, prepaids, escrow, tax proration, association fees, credits, or inspection/appraisal costs.",
    mistakeChecks: [
      "Do not wire based on memory of an earlier estimate.",
      "Do not assume every increase is a fee; some cash-to-close changes are escrow, prepaids, or timing.",
      "Do not ignore seller credits or lender credits that should be visible.",
    ],
    forgottenItems: [
      "Tax escrow setup",
      "Homeowners insurance premium",
      "Interest prepaids",
      "Association transfer fees",
      "Inspection and appraisal cash already paid or still due",
    ],
    failureModes: [
      "The buyer drains repair reserve to close.",
      "A credit or fee is missing from the statement.",
      "The line is correct but was not planned early enough.",
    ],
    steps: [
      {
        title: "Rebuild cash to close from line items",
        body: "Use the cash-to-close calculator to separate down payment, loan costs, title, prepaids, taxes, association charges, and inspections.",
      },
      {
        title: "Compare estimate versions",
        body: "Ask which line changed from the previous loan estimate or title estimate and why.",
      },
      {
        title: "Protect post-closing reserve",
        body: "If the jump uses your repair reserve, decide whether the purchase still has enough cash buffer.",
      },
    ],
    documents: [
      "Loan estimate",
      "Closing disclosure",
      "Title estimate",
      "Seller credit terms",
      "HOA/condo fee schedule",
      "Insurance invoice",
    ],
    calculators: [
      { label: "Cash to Close", href: "/property/cash-to-close-calculator/" },
      {
        label: "Title Company Cost",
        href: "/property/title-company-cost-calculator/",
      },
      { label: "Tax Proration", href: "/property/tax-proration-calculator/" },
    ],
    guides: [
      { label: "Property Decision Packet", href: "/property/decision-packet/" },
    ],
    packetPrompt:
      "Create a packet with old estimate, new estimate, changed line, explanation needed, and cash reserve after closing.",
  },
];

export const PROPERTY_PLAYBOOKS_BY_SLUG = PROPERTY_PLAYBOOKS.reduce<
  Record<string, PropertyPlaybook>
>((acc, playbook) => {
  acc[playbook.slug] = playbook;
  return acc;
}, {});

export function propertyPlaybookHref(
  playbook: Pick<PropertyPlaybook, "slug"> | string,
): string {
  const slug = typeof playbook === "string" ? playbook : playbook.slug;
  return `/property/playbooks/${slug}/`;
}

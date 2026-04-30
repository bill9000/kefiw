import { useMemo, useState } from "react";

interface Recommendation {
  title: string;
  why: string;
  mistakeCheck: string[];
  whatPeopleForget: string[];
  whatCanGoBad: string[];
  nextSteps: string[];
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  guide: { label: string; href: string };
  track: { label: string; href: string };
}

type IntakeState = {
  role: string;
  trigger: string;
  timeline: string;
  concern: string;
  decisionStyle: string;
};

const defaultState: IntakeState = {
  role: "owner",
  trigger: "roof",
  timeline: "this-week",
  concern: "mistake",
  decisionStyle: "recommended-path",
};

const roles = [
  { value: "owner", label: "Owner" },
  { value: "seller", label: "Seller" },
  { value: "buyer", label: "Buyer" },
  { value: "landlord", label: "Landlord" },
  { value: "investor", label: "Investor" },
];

const triggers = [
  { value: "roof", label: "Roof, leak, or storm claim" },
  { value: "hvac", label: "AC, heat, or HVAC quote" },
  { value: "sell", label: "Selling or listing soon" },
  { value: "buy", label: "Buying or cash to close" },
  { value: "closing", label: "Closing costs or title estimate" },
  { value: "owner-costs", label: "Owner repair or upgrade cost" },
  { value: "quote", label: "Contractor quote comparison" },
];

const concerns = [
  { value: "mistake", label: "Am I making a mistake?" },
  { value: "forgetting", label: "What am I forgetting?" },
  { value: "go-bad", label: "What could make this go bad?" },
  { value: "worth-it", label: "Is this worth it yet?" },
  { value: "next", label: "What should I do next?" },
  { value: "paperwork", label: "What paperwork matters?" },
];

function baseRecommendation(state: IntakeState): Recommendation {
  if (state.trigger === "hvac") {
    return {
      title: "Start with symptoms before accepting the replacement story",
      why: "An HVAC quote should connect what you saw at home to measurements, cheaper causes ruled out, and a defensible scope.",
      mistakeCheck: [
        'Do not let "old system" replace a real diagnosis.',
        "Ask whether capacitor, contactor, float switch, thermostat, filter, flame sensor, sequencer, airflow, and board output were checked when relevant.",
        "Separate equipment failure from duct, return-air, zoning, insulation, or comfort-distribution problems.",
      ],
      whatPeopleForget: [
        "Ductwork can make a new system underperform.",
        "A working gas furnace or blower may not always need to be replaced with the AC.",
        "Rebates and efficiency claims need payback math, not just sales copy.",
      ],
      whatCanGoBad: [
        "The quote replaces good parts because the scope is easier to sell and warranty.",
        "The homeowner buys tonnage by square footage without load or duct context.",
        "A full replacement still leaves hot rooms because the real problem was airflow.",
      ],
      nextSteps: [
        "Run the diagnosis matrix from the symptom you saw.",
        "Ask the technician for the failed measurement and cheaper causes ruled out.",
        "Compare full replacement, partial replacement, repair, duct work, and mini-split options before signing.",
      ],
      primary: {
        label: "Open HVAC Diagnosis Matrix",
        href: "/property/hvac-diagnosis-live-matrix/",
      },
      secondary: {
        label: "Estimate HVAC Replacement",
        href: "/property/hvac-replacement-cost/",
      },
      guide: {
        label: "Before You Replace Your HVAC",
        href: "/guides/hvac-full-replacement-alternatives/",
      },
      track: {
        label: "Replace My HVAC Track",
        href: "/tracks/replace-my-hvac/",
      },
    };
  }

  if (state.trigger === "sell" || state.role === "seller") {
    return {
      title: "Start with the check you may actually keep",
      why: "A sale-price estimate is not enough. The seller decision is proceeds after payoff, commission, closing costs, prep, credits, and timing.",
      mistakeCheck: [
        "Do not judge offers by headline price before concessions, credits, and closing timing are visible.",
        "Do not spend on prep until it is sorted into must-fix, quick-win, maybe, or skip/credit.",
        "Do not treat a commission reduction as free money without considering exposure, buyer-side strategy, and negotiation support.",
      ],
      whatPeopleForget: [
        "Mortgage payoff can change between estimate and closing.",
        "Association, resale, transfer, tax proration, title, and payoff fees can get missed.",
        "Prep cash can reduce flexibility if the market does not reward it.",
      ],
      whatCanGoBad: [
        "A cosmetic project consumes cash but does not change buyer behavior.",
        "A strong-looking offer nets less after credits and concessions.",
        "The listing strategy depends on optimistic price assumptions.",
      ],
      nextSteps: [
        "Run seller proceeds for a realistic price, low offer, and optimistic price.",
        "Run prep ROI before spending on repairs.",
        "Build a decision packet with offer assumptions and questions for your agent or title company.",
      ],
      primary: {
        label: "Estimate Seller Proceeds",
        href: "/property/seller-proceeds-calculator/",
      },
      secondary: {
        label: "Run Prep ROI",
        href: "/property/home-sale-prep-roi-calculator/",
      },
      guide: {
        label: "Build a Property Decision Packet",
        href: "/property/decision-packet/",
      },
      track: { label: "Sell My Home Track", href: "/tracks/sell-my-home/" },
    };
  }

  if (state.trigger === "buy" || state.role === "buyer") {
    return {
      title: "Start with cash to close, then stress-test the payment",
      why: "Buying goes wrong when the monthly payment looks fine but cash to close, escrow, HOA, repairs, and hold horizon are not planned.",
      mistakeCheck: [
        "Do not confuse down payment with full cash to close.",
        "Do not use payment affordability without tax, insurance, HOA, repairs, and reserves.",
        "Do not ignore hold horizon if you may move before transaction costs amortize.",
      ],
      whatPeopleForget: [
        "Prepaids and escrow setup are real cash needs.",
        "Inspection, appraisal, survey, association, and move-in costs can arrive before the first normal month.",
        "A low payment can still be fragile if insurance, tax, or HOA jumps.",
      ],
      whatCanGoBad: [
        "Cash is too tight after closing to handle the first repair.",
        "The buyer accepts credits that do not solve the real defect.",
        "The property is sold too soon for transaction costs to make sense.",
      ],
      nextSteps: [
        "Run cash to close before treating the house as affordable.",
        "Run mortgage payment and hold-horizon checks.",
        "Save a repair reserve line in the decision packet.",
      ],
      primary: {
        label: "Estimate Cash to Close",
        href: "/property/cash-to-close-calculator/",
      },
      secondary: {
        label: "Mortgage Calculator",
        href: "/calculators/mortgage-calculator/",
      },
      guide: {
        label: "Build a Property Decision Packet",
        href: "/property/decision-packet/",
      },
      track: {
        label: "Rent vs Buy / Horizon Point",
        href: "/finance/horizon-point/",
      },
    };
  }

  if (state.trigger === "closing") {
    return {
      title: "Start by turning closing costs into line items",
      why: "Closing estimates become useful when title, tax, HOA, resale docs, transfer fees, credits, payoff, and prepaids stop hiding inside percentages.",
      mistakeCheck: [
        "Do not rely on a generic closing-cost percentage when title and association fees are available.",
        "Do not mix seller costs, seller credits, buyer costs, and tax timing in one mental bucket.",
        "Do not wait until the final statement to ask who pays each line.",
      ],
      whatPeopleForget: [
        "Tax proration direction depends on local custom and contract language.",
        "Association documents, transfer fees, rush fees, and dues can be separate line items.",
        "Payoff, wire, recording, and title add-ons should be visible.",
      ],
      whatCanGoBad: [
        "A net sheet is wrong because taxes or association charges were omitted.",
        "A buyer is surprised by prepaids and escrow setup.",
        "A contract term shifts a fee to the side that did not budget for it.",
      ],
      nextSteps: [
        "Run seller closing cost or cash to close depending on your side.",
        "Break out title, tax proration, and association charges.",
        "Ask the title company for a fee sheet and update the packet.",
      ],
      primary: {
        label: "Seller Closing Cost Calculator",
        href: "/property/closing-cost-calculator/",
      },
      secondary: {
        label: "Title Company Cost Calculator",
        href: "/property/title-company-cost-calculator/",
      },
      guide: {
        label: "Tax Proration Calculator",
        href: "/property/tax-proration-calculator/",
      },
      track: {
        label: "Seller Net Sheet",
        href: "/property/net-sheet-calculator/",
      },
    };
  }

  if (state.trigger === "owner-costs") {
    return {
      title: "Start with timing: patch, replace, finance, sell, or wait",
      why: "Owner cost decisions are rarely just price. The tradeoff is failure risk, timeline, cash reserve, resale horizon, and whether delay makes the problem worse.",
      mistakeCheck: [
        "Do not repair repeatedly without comparing the replacement horizon.",
        "Do not finance an upgrade without checking emergency reserves and total cost.",
        "Do not assume an efficiency upgrade pays back unless bill data supports it.",
      ],
      whatPeopleForget: [
        "A repair can be rational if it safely buys enough time.",
        "Replacement can be rational when repeated failure, safety, resale, or energy waste dominates.",
        "Sale horizon changes whether ROI or reliability matters more.",
      ],
      whatCanGoBad: [
        "The owner waits until emergency timing destroys quote leverage.",
        "The upgrade creates monthly debt but little real value.",
        "The repair hides a problem that appears during sale inspection.",
      ],
      nextSteps: [
        "Run repair-vs-replace for the affected system.",
        "Check savings, financing, or energy payback only after scope is clear.",
        "Use the decision packet to record the trigger for replacing instead of patching again.",
      ],
      primary: {
        label: "HVAC Repair vs Replace",
        href: "/property/hvac-repair-vs-replace/",
      },
      secondary: {
        label: "Roof Repair vs Replacement",
        href: "/homelab/roof-repair-vs-replacement-calculator/",
      },
      guide: { label: "Property Owner Costs", href: "/property/owner-costs/" },
      track: {
        label: "Property Decision Packet",
        href: "/property/decision-packet/",
      },
    };
  }

  return {
    title: "Start with scope, cash exposure, and proof",
    why: "A roof decision fails when the bid, insurance scope, and homeowner cash plan describe different jobs.",
    mistakeCheck: [
      "Do not compare roof quotes unless tear-off, decking, underlayment, flashing, ventilation, edge metal, cleanup, and warranty are visible.",
      "Do not assume insurance covers the job until ACV/RCV, deductible, depreciation holdback, and code upgrades are clear.",
      "Do not final-pay before paperwork for impact rating, wind documentation, warranty, and photos is collected.",
    ],
    whatPeopleForget: [
      "Decking surprises are found after tear-off, not while reading the quote.",
      "Tree rub, bad flashing, poor ventilation, and old penetrations can weaken a claim or new roof.",
      'Insurance discounts require documents, not just a contractor saying "Class 4."',
    ],
    whatCanGoBad: [
      "A low bid deletes the pieces that keep water out.",
      "The deductible or depreciation holdback creates cash stress.",
      "A claim supplement is handled badly or undocumented.",
    ],
    nextSteps: [
      "Run roof replacement cost and repair-vs-replace.",
      "Check deductible and ACV/RCV exposure before signing.",
      "Put every missing-scope question into the decision packet.",
    ],
    primary: {
      label: "Estimate Roof Replacement Cost",
      href: "/homelab/roof-replacement-cost-calculator/",
    },
    secondary: {
      label: "Check Roof Insurance Deductible",
      href: "/homelab/roof-insurance-deductible-calculator/",
    },
    guide: {
      label: "How to Save on Roof Replacement Cost",
      href: "/guides/save-on-roof-replacement-cost/",
    },
    track: { label: "Replace My Roof Track", href: "/tracks/replace-my-roof/" },
  };
}

function adjustedRecommendation(state: IntakeState): Recommendation {
  const recommendation = baseRecommendation(state);
  if (state.trigger === "quote") {
    return {
      ...recommendation,
      title: "Start by making the quotes comparable",
      why: "A cheap quote is not a deal until scope, exclusions, warranty, timing, materials, and proof are written down.",
      primary: {
        label: "Build a Property Decision Packet",
        href: "/property/decision-packet/",
      },
      secondary: recommendation.primary,
    };
  }
  if (state.concern === "paperwork") {
    return {
      ...recommendation,
      title: "Start with the paperwork that proves the decision",
      why: "Property decisions are expensive enough that verbal assumptions are not enough. Collect the documents that prove scope, price, coverage, and responsibility.",
      nextSteps: [
        "List the documents that would change the decision.",
        "Ask for the written quote, title estimate, insurance scope, product labels, warranty, or fee sheet before relying on the result.",
        "Put missing documents in the packet so they are not forgotten.",
      ],
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

function Checklist({
  title,
  items,
}: {
  title: string;
  items: string[];
}): JSX.Element {
  return (
    <section className="rounded-md border border-slate-200 bg-slate-50 p-3">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

export default function StartHerePropertyIntake(): JSX.Element {
  const [state, setState] = useState<IntakeState>(defaultState);
  const recommendation = useMemo(() => adjustedRecommendation(state), [state]);
  const update = (key: keyof IntakeState, value: string): void => {
    setState((current) => ({ ...current, [key]: value }));
  };

  return (
    <section
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)]"
      aria-label="Property Start Here guided intake"
    >
      <form className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Answer a few questions
        </h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          This routes you to the most useful calculator, guide, track, or
          packet. It does not replace a contractor, realtor, lender, title
          company, insurer, attorney, or tax professional.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <SelectField
            label="Your role"
            value={state.role}
            onChange={(value) => update("role", value)}
            options={roles}
          />
          <SelectField
            label="What triggered this?"
            value={state.trigger}
            onChange={(value) => update("trigger", value)}
            options={triggers}
          />
          <SelectField
            label="Timeline"
            value={state.timeline}
            onChange={(value) => update("timeline", value)}
            options={[
              { value: "today", label: "Today or emergency pressure" },
              { value: "this-week", label: "This week" },
              { value: "this-month", label: "This month" },
              { value: "planning", label: "Planning ahead" },
            ]}
          />
          <SelectField
            label="Main question"
            value={state.concern}
            onChange={(value) => update("concern", value)}
            options={concerns}
          />
          <SelectField
            label="What do you want first?"
            value={state.decisionStyle}
            onChange={(value) => update("decisionStyle", value)}
            options={[
              { value: "recommended-path", label: "Recommended path" },
              { value: "calculator", label: "Calculator" },
              { value: "mistake-check", label: "Mistake check" },
              { value: "packet", label: "Printable packet" },
            ]}
          />
        </div>

        {state.timeline === "today" && (
          <p className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
            If there is active fire, gas smell, carbon monoxide alarm,
            electrical burning smell, immediate structural danger, flooding, or
            immediate personal danger, use emergency services or qualified local
            help first.
          </p>
        )}
      </form>

      <aside className="rounded-lg border border-brand-200 bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
          Recommended start
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
          {recommendation.title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {recommendation.why}
        </p>

        <div className="mt-4 grid gap-3">
          <Checklist
            title="Mistake check"
            items={recommendation.mistakeCheck}
          />
          <Checklist
            title="What people forget"
            items={recommendation.whatPeopleForget}
          />
          <Checklist
            title="What could make it go bad"
            items={recommendation.whatCanGoBad}
          />
          <Checklist title="Next steps" items={recommendation.nextSteps} />
        </div>

        <div className="mt-4 grid gap-2">
          <a
            className="rounded-md bg-brand-700 px-3 py-2 text-sm font-semibold text-white no-underline hover:bg-brand-800"
            href={recommendation.primary.href}
          >
            {recommendation.primary.label}
          </a>
          <a
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400"
            href={recommendation.secondary.href}
          >
            {recommendation.secondary.label}
          </a>
          <a
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400"
            href={recommendation.guide.href}
          >
            {recommendation.guide.label}
          </a>
          <a
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400"
            href={recommendation.track.href}
          >
            {recommendation.track.label}
          </a>
          <a
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400"
            href="/property/decision-packet/"
          >
            Build Property Decision Packet
          </a>
        </div>
      </aside>
    </section>
  );
}

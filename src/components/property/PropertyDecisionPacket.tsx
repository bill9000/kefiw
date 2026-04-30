import { useEffect, useMemo, useState } from "react";

type RiskValue = "green" | "yellow" | "red";

interface RiskArea {
  id: string;
  label: string;
}

interface PacketState {
  projectName: string;
  propertyContext: string;
  decision: string;
  estimateLow: number;
  estimateTypical: number;
  estimateHigh: number;
  cashAvailable: number;
  timeline: string;
  quotes: string;
  quoteDifferences: string;
  missingScope: string;
  redFlags: string;
  missingDocuments: string;
  questions: string;
  nextSteps: string;
  calculatorsUsed: string;
  guidesUsed: string;
  reviewer: string;
  reviewDays: number;
  risks: Record<string, RiskValue>;
}

const riskAreas: RiskArea[] = [
  { id: "scope", label: "Scope is complete" },
  { id: "cash", label: "Cash exposure is known" },
  { id: "proof", label: "Proof / inspection is documented" },
  { id: "paperwork", label: "Paperwork is collected" },
  { id: "contract", label: "Contract terms are clear" },
  { id: "timeline", label: "Timeline is realistic" },
  {
    id: "insurance",
    label: "Insurance / title / lender assumptions are verified",
  },
  { id: "resale", label: "Hold or resale horizon is considered" },
  { id: "safety", label: "Safety or urgent risk is handled" },
  { id: "backup", label: "Backup plan exists if the decision fails" },
];

const defaultRisks = riskAreas.reduce<Record<string, RiskValue>>(
  (acc, area) => {
    acc[area.id] = "yellow";
    return acc;
  },
  {},
);

const defaultState: PacketState = {
  projectName: "",
  propertyContext: "",
  decision: "",
  estimateLow: 0,
  estimateTypical: 0,
  estimateHigh: 0,
  cashAvailable: 0,
  timeline: "",
  quotes: "",
  quoteDifferences: "",
  missingScope: "",
  redFlags: "",
  missingDocuments: "",
  questions: "",
  nextSteps: "",
  calculatorsUsed: "",
  guidesUsed: "",
  reviewer: "",
  reviewDays: 14,
  risks: defaultRisks,
};

const storageKey = "kefiw:property-decision-packet";

function money(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "$0";
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function splitLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number";
}): JSX.Element {
  return (
    <label className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        type={type}
        className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        value={value}
        min={type === "number" ? 0 : undefined}
        onChange={(event) =>
          onChange(
            type === "number" ? Number(event.target.value) : event.target.value,
          )
        }
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}): JSX.Element {
  return (
    <label className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <textarea
        className="mt-2 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function RiskBadge({ value }: { value: RiskValue }): JSX.Element {
  const classes =
    value === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : value === "yellow"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-rose-200 bg-rose-50 text-rose-950";
  const label =
    value === "green" ? "Green" : value === "yellow" ? "Yellow" : "Red";
  return (
    <span
      className={`rounded border px-2 py-1 text-xs font-semibold ${classes}`}
    >
      {label}
    </span>
  );
}

export default function PropertyDecisionPacket(): JSX.Element {
  const [state, setState] = useState<PacketState>(defaultState);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PacketState>;
        setState({
          ...defaultState,
          ...parsed,
          risks: { ...defaultRisks, ...(parsed.risks ?? {}) },
        });
      }
    } catch {
      setState(defaultState);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      // Local persistence is helpful but not required.
    }
  }, [state]);

  const createdDate = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    [],
  );
  const reviewDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + Math.max(1, state.reviewDays || 14));
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [state.reviewDays]);
  const riskCounts = useMemo(() => {
    return riskAreas.reduce(
      (acc, area) => {
        acc[state.risks[area.id]] += 1;
        return acc;
      },
      { green: 0, yellow: 0, red: 0 } as Record<RiskValue, number>,
    );
  }, [state.risks]);

  const update = <Key extends keyof PacketState>(
    key: Key,
    value: PacketState[Key],
  ): void => {
    setState((current) => ({ ...current, [key]: value }));
  };

  const updateRisk = (id: string, value: RiskValue): void => {
    setState((current) => ({
      ...current,
      risks: { ...current.risks, [id]: value },
    }));
  };

  const summaryText = useMemo(() => {
    const redAreas =
      riskAreas
        .filter((area) => state.risks[area.id] === "red")
        .map((area) => area.label)
        .join(", ") || "None listed";
    const yellowAreas =
      riskAreas
        .filter((area) => state.risks[area.id] === "yellow")
        .map((area) => area.label)
        .join(", ") || "None listed";
    return [
      "Kefiw Property Decision Packet",
      `Date created: ${createdDate}`,
      `Review date: ${reviewDate}`,
      `Project / decision: ${state.projectName || "Not entered"}`,
      `Property context: ${state.propertyContext || "Not entered"}`,
      `Decision being made: ${state.decision || "Not entered"}`,
      `Estimate range: ${money(state.estimateLow)} - ${money(state.estimateHigh)} (typical: ${money(state.estimateTypical)})`,
      `Cash available / reserve: ${money(state.cashAvailable)}`,
      `Timeline: ${state.timeline || "Not entered"}`,
      `Red risk areas: ${redAreas}`,
      `Yellow risk areas: ${yellowAreas}`,
      `Quotes / options compared: ${state.quotes || "Not entered"}`,
      `What differs between quotes: ${state.quoteDifferences || "Not entered"}`,
      `Missing scope or assumptions: ${state.missingScope || "Not entered"}`,
      `Red flags: ${state.redFlags || "Not entered"}`,
      `Missing documents: ${state.missingDocuments || "Not entered"}`,
      `Questions to ask: ${state.questions || "Not entered"}`,
      `Next steps: ${state.nextSteps || "Not entered"}`,
      `Calculators used: ${state.calculatorsUsed || "Not entered"}`,
      `Guides used: ${state.guidesUsed || "Not entered"}`,
      `Person / professional to verify with: ${state.reviewer || "Not entered"}`,
    ].join("\n");
  }, [createdDate, reviewDate, state]);

  const copySummary = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.95fr)]"
      aria-label="Property decision packet builder"
    >
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Build the packet
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use this after running calculators or reading guides. The goal is to
            make assumptions, missing items, and next questions visible before
            you sign, list, buy, claim, or spend.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <InputField
              label="Project or decision name"
              value={state.projectName}
              onChange={(value) => update("projectName", String(value))}
            />
            <InputField
              label="Property context"
              value={state.propertyContext}
              onChange={(value) => update("propertyContext", String(value))}
            />
            <InputField
              label="Low estimate"
              value={state.estimateLow}
              type="number"
              onChange={(value) => update("estimateLow", Number(value))}
            />
            <InputField
              label="Typical estimate"
              value={state.estimateTypical}
              type="number"
              onChange={(value) => update("estimateTypical", Number(value))}
            />
            <InputField
              label="High estimate"
              value={state.estimateHigh}
              type="number"
              onChange={(value) => update("estimateHigh", Number(value))}
            />
            <InputField
              label="Cash available / reserve"
              value={state.cashAvailable}
              type="number"
              onChange={(value) => update("cashAvailable", Number(value))}
            />
          </div>
          <div className="mt-3 grid gap-3">
            <TextAreaField
              label="Decision being made"
              value={state.decision}
              onChange={(value) => update("decision", value)}
              placeholder="Replace roof, repair HVAC, list at X, accept offer, buy property, challenge closing estimate..."
            />
            <TextAreaField
              label="Timeline"
              value={state.timeline}
              onChange={(value) => update("timeline", value)}
              placeholder="Emergency, before listing, before closing, before next storm season, before lease renewal..."
            />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Green / yellow / red risk check
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Green is handled. Yellow is fragile. Red is unknown, risky, or a
            blocker.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {riskAreas.map((area) => (
              <label
                key={area.id}
                className="flex items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 p-3"
              >
                <span className="text-sm font-semibold text-slate-900">
                  {area.label}
                </span>
                <select
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm"
                  value={state.risks[area.id]}
                  onChange={(event) =>
                    updateRisk(area.id, event.target.value as RiskValue)
                  }
                >
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="red">Red</option>
                </select>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Mistake prevention
          </h2>
          <div className="mt-4 grid gap-3">
            <TextAreaField
              label="Quotes or options compared"
              value={state.quotes}
              onChange={(value) => update("quotes", value)}
              placeholder="Bid A, bid B, repair path, replacement path, low offer, high offer..."
            />
            <TextAreaField
              label="What differs between the options?"
              value={state.quoteDifferences}
              onChange={(value) => update("quoteDifferences", value)}
              placeholder="Scope, warranty, title fees, concessions, deductibles, timeline, materials, exclusions..."
            />
            <TextAreaField
              label="Missing scope or assumptions"
              value={state.missingScope}
              onChange={(value) => update("missingScope", value)}
              placeholder="Decking allowance, ductwork, tax proration, title fees, HOA fees, repair credits, line set, permits..."
            />
            <TextAreaField
              label="Red flags"
              value={state.redFlags}
              onChange={(value) => update("redFlags", value)}
              placeholder="Verbal-only promise, one-line quote, vague warranty, missing proof, urgent pressure, too-good price..."
            />
            <TextAreaField
              label="Missing documents"
              value={state.missingDocuments}
              onChange={(value) => update("missingDocuments", value)}
              placeholder="Insurance scope, title fee sheet, contractor license/insurance, product labels, warranty, payoff, disclosure..."
            />
            <TextAreaField
              label="Questions to ask before deciding"
              value={state.questions}
              onChange={(value) => update("questions", value)}
            />
            <TextAreaField
              label="Next 3 steps"
              value={state.nextSteps}
              onChange={(value) => update("nextSteps", value)}
              placeholder="1. Ask for itemized scope. 2. Run deductible calculator. 3. Call title company."
            />
            <TextAreaField
              label="Calculators used"
              value={state.calculatorsUsed}
              onChange={(value) => update("calculatorsUsed", value)}
            />
            <TextAreaField
              label="Guides used"
              value={state.guidesUsed}
              onChange={(value) => update("guidesUsed", value)}
            />
            <InputField
              label="Who should verify this?"
              value={state.reviewer}
              onChange={(value) => update("reviewer", String(value))}
            />
            <InputField
              label="Review again in how many days?"
              value={state.reviewDays}
              type="number"
              onChange={(value) => update("reviewDays", Number(value))}
            />
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-brand-200 bg-white p-4 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Decision packet
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Your Property Decision Packet
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-900 hover:border-brand-400"
              onClick={() => window.print()}
            >
              Print
            </button>
            <button
              type="button"
              className="rounded-md bg-brand-700 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-800"
              onClick={copySummary}
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm">
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="font-semibold text-slate-900">
              {state.projectName || "Project or decision"}
            </div>
            <div className="mt-1 text-slate-700">
              {state.propertyContext || "Property context not entered"}
            </div>
            <div className="mt-2 text-xs text-slate-500">
              Created {createdDate}. Review {reviewDate}.
            </div>
          </div>

          <dl className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Typical
              </dt>
              <dd className="mt-1 font-semibold text-slate-950">
                {money(state.estimateTypical)}
              </dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Range
              </dt>
              <dd className="mt-1 font-semibold text-slate-950">
                {money(state.estimateLow)} - {money(state.estimateHigh)}
              </dd>
            </div>
            <div className="rounded-md border border-slate-200 p-3 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Cash available / reserve
              </dt>
              <dd className="mt-1 font-semibold text-slate-950">
                {money(state.cashAvailable)}
              </dd>
            </div>
          </dl>

          <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
            <div className="font-semibold text-slate-900">Risk count</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-900">
                Green {riskCounts.green}
              </span>
              <span className="rounded border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-950">
                Yellow {riskCounts.yellow}
              </span>
              <span className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-950">
                Red {riskCounts.red}
              </span>
            </div>
            <div className="mt-3 grid gap-1">
              {riskAreas.map((area) => (
                <div
                  key={area.id}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span>{area.label}</span>
                  <RiskBadge value={state.risks[area.id]} />
                </div>
              ))}
            </div>
          </div>

          {[
            ["Decision being made", splitLines(state.decision)],
            ["Timeline", splitLines(state.timeline)],
            ["Quotes or options compared", splitLines(state.quotes)],
            [
              "What differs between options",
              splitLines(state.quoteDifferences),
            ],
            ["Missing scope or assumptions", splitLines(state.missingScope)],
            ["Red flags", splitLines(state.redFlags)],
            ["Missing documents", splitLines(state.missingDocuments)],
            ["Questions to ask", splitLines(state.questions)],
            ["Next steps", splitLines(state.nextSteps)],
            ["Calculators used", splitLines(state.calculatorsUsed)],
            ["Guides used", splitLines(state.guidesUsed)],
            ["Who should verify this", splitLines(state.reviewer)],
          ].map(([title, items]) => (
            <div
              key={String(title)}
              className="rounded-md border border-slate-200 p-3"
            >
              <div className="font-semibold text-slate-900">
                {String(title)}
              </div>
              {Array.isArray(items) && items.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-1 text-slate-500">Not entered.</p>
              )}
            </div>
          ))}
        </div>

        <p className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-xs leading-5 text-cyan-950">
          Kefiw packets are educational planning aids. Confirm contract, title,
          insurance, tax, legal, lender, inspection, safety, and local pricing
          details with qualified sources.
        </p>
      </aside>
    </section>
  );
}

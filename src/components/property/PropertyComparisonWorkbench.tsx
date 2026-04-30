import { useEffect, useMemo, useState } from "react";

type Mode = "contractor" | "seller-offer" | "buyer-closing" | "repair-credit";

interface OptionState {
  name: string;
  amount: number;
  cashImpact: number;
  scopeClarity: number;
  proofDocs: number;
  terms: number;
  timeline: number;
  confidence: number;
  risk: number;
  includes: string;
  excludes: string;
  questions: string;
}

interface Props {
  defaultMode?: Mode;
}

const modeLabels: Record<Mode, string> = {
  contractor: "Contractor bids",
  "seller-offer": "Seller offers",
  "buyer-closing": "Buyer closing versions",
  "repair-credit": "Repair vs credit",
};

const amountLabels: Record<Mode, string> = {
  contractor: "Bid amount",
  "seller-offer": "Estimated net proceeds",
  "buyer-closing": "Cash to close",
  "repair-credit": "Cost or credit amount",
};

const lowerIsBetter: Record<Mode, boolean> = {
  contractor: true,
  "seller-offer": false,
  "buyer-closing": true,
  "repair-credit": true,
};

const defaultOptions: OptionState[] = [
  {
    name: "Option A",
    amount: 0,
    cashImpact: 0,
    scopeClarity: 3,
    proofDocs: 3,
    terms: 3,
    timeline: 3,
    confidence: 3,
    risk: 3,
    includes: "",
    excludes: "",
    questions: "",
  },
  {
    name: "Option B",
    amount: 0,
    cashImpact: 0,
    scopeClarity: 3,
    proofDocs: 3,
    terms: 3,
    timeline: 3,
    confidence: 3,
    risk: 3,
    includes: "",
    excludes: "",
    questions: "",
  },
  {
    name: "Option C",
    amount: 0,
    cashImpact: 0,
    scopeClarity: 3,
    proofDocs: 3,
    terms: 3,
    timeline: 3,
    confidence: 3,
    risk: 3,
    includes: "",
    excludes: "",
    questions: "",
  },
];

const storageKey = "kefiw:property-comparison-workbench";

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

function valueScore(
  mode: Mode,
  option: OptionState,
  options: OptionState[],
): number {
  const amounts = options
    .map((item) => item.amount)
    .filter((value) => Number.isFinite(value) && value > 0);
  if (!amounts.length || option.amount <= 0) return 10;
  if (lowerIsBetter[mode]) {
    const low = Math.min(...amounts);
    return Math.max(0, Math.min(20, (low / option.amount) * 20));
  }
  const high = Math.max(...amounts);
  return Math.max(0, Math.min(20, (option.amount / high) * 20));
}

function optionScore(
  mode: Mode,
  option: OptionState,
  options: OptionState[],
): number {
  const quality =
    option.scopeClarity +
    option.proofDocs +
    option.terms +
    option.timeline +
    option.confidence;
  const riskPenalty = option.risk * 2.5;
  const cashPenalty =
    option.cashImpact > 0 && lowerIsBetter[mode]
      ? Math.min(8, option.cashImpact / 5000)
      : 0;
  return Math.round(
    valueScore(mode, option, options) + quality * 3 - riskPenalty - cashPenalty,
  );
}

function InputField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
}): JSX.Element {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <input
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900"
        type={typeof value === "number" ? "number" : "text"}
        min={typeof value === "number" ? 0 : undefined}
        value={value}
        onChange={(event) =>
          onChange(
            typeof value === "number"
              ? Number(event.target.value)
              : event.target.value,
          )
        }
      />
    </label>
  );
}

function ScoreField({
  label,
  value,
  onChange,
  invert = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  invert?: boolean;
}): JSX.Element {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <select
        className="mt-1 w-full rounded-md border border-slate-300 px-2 py-2 text-sm"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {[1, 2, 3, 4, 5].map((score) => (
          <option key={score} value={score}>
            {score} -{" "}
            {invert
              ? score >= 4
                ? "high"
                : score === 3
                  ? "medium"
                  : "low"
              : score >= 4
                ? "strong"
                : score === 3
                  ? "ok"
                  : "weak"}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function PropertyComparisonWorkbench({
  defaultMode = "contractor",
}: Props): JSX.Element {
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [options, setOptions] = useState<OptionState[]>(defaultOptions);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          mode?: Mode;
          options?: OptionState[];
        };
        setMode(parsed.mode ?? defaultMode);
        setOptions(
          parsed.options?.length
            ? parsed.options
                .slice(0, 3)
                .map((item, index) => ({ ...defaultOptions[index], ...item }))
            : defaultOptions,
        );
      }
    } catch {
      setMode(defaultMode);
      setOptions(defaultOptions);
    }
  }, [defaultMode]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ mode, options }),
      );
    } catch {
      // Persistence is helpful but not required.
    }
  }, [mode, options]);

  const scored = useMemo(() => {
    return options
      .map((option, index) => ({
        option,
        index,
        score: optionScore(mode, option, options),
      }))
      .sort((a, b) => b.score - a.score);
  }, [mode, options]);

  const winner = scored[0];
  const summaryText = useMemo(() => {
    return [
      "Kefiw Property Comparison",
      `Mode: ${modeLabels[mode]}`,
      winner
        ? `Best score: ${winner.option.name} (${winner.score})`
        : "Best score: none",
      ...scored.map(({ option, score }) =>
        [
          `${option.name}: ${score}`,
          `${amountLabels[mode]}: ${money(option.amount)}`,
          `Cash impact: ${money(option.cashImpact)}`,
          `Includes: ${option.includes || "Not entered"}`,
          `Excludes: ${option.excludes || "Not entered"}`,
          `Questions: ${option.questions || "Not entered"}`,
        ].join("\n"),
      ),
    ].join("\n\n");
  }, [mode, scored, winner]);

  const updateOption = <Key extends keyof OptionState>(
    index: number,
    key: Key,
    value: OptionState[Key],
  ): void => {
    setOptions((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  };

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
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)]"
      aria-label="Property comparison workbench"
    >
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Normalize the options
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Price only matters after scope, proof, terms, timeline, and risk
                are comparable.
              </p>
            </div>
            <label className="block min-w-56">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Comparison type
              </span>
              <select
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                value={mode}
                onChange={(event) => setMode(event.target.value as Mode)}
              >
                {(Object.keys(modeLabels) as Mode[]).map((key) => (
                  <option key={key} value={key}>
                    {modeLabels[key]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {options.map((option, index) => (
          <section
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="grid gap-3 sm:grid-cols-3">
              <InputField
                label="Option name"
                value={option.name}
                onChange={(value) => updateOption(index, "name", String(value))}
              />
              <InputField
                label={amountLabels[mode]}
                value={option.amount}
                onChange={(value) =>
                  updateOption(index, "amount", Number(value))
                }
              />
              <InputField
                label="Extra cash impact"
                value={option.cashImpact}
                onChange={(value) =>
                  updateOption(index, "cashImpact", Number(value))
                }
              />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
              <ScoreField
                label="Scope clarity"
                value={option.scopeClarity}
                onChange={(value) => updateOption(index, "scopeClarity", value)}
              />
              <ScoreField
                label="Proof/docs"
                value={option.proofDocs}
                onChange={(value) => updateOption(index, "proofDocs", value)}
              />
              <ScoreField
                label="Terms"
                value={option.terms}
                onChange={(value) => updateOption(index, "terms", value)}
              />
              <ScoreField
                label="Timeline"
                value={option.timeline}
                onChange={(value) => updateOption(index, "timeline", value)}
              />
              <ScoreField
                label="Confidence"
                value={option.confidence}
                onChange={(value) => updateOption(index, "confidence", value)}
              />
              <ScoreField
                label="Risk"
                value={option.risk}
                onChange={(value) => updateOption(index, "risk", value)}
                invert
              />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Included
                </span>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={option.includes}
                  onChange={(event) =>
                    updateOption(index, "includes", event.target.value)
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Excluded or unclear
                </span>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={option.excludes}
                  onChange={(event) =>
                    updateOption(index, "excludes", event.target.value)
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Questions before deciding
                </span>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  value={option.questions}
                  onChange={(event) =>
                    updateOption(index, "questions", event.target.value)
                  }
                />
              </label>
            </div>
          </section>
        ))}
      </div>

      <aside className="h-fit rounded-lg border border-brand-200 bg-white p-4 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Comparison result
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              {winner ? winner.option.name : "No option"} leads
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

        <div className="mt-4 grid gap-3">
          {scored.map(({ option, score }) => (
            <section
              key={option.name}
              className="rounded-md border border-slate-200 bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">{option.name}</h3>
                <span className="rounded bg-brand-700 px-2 py-1 text-xs font-semibold text-white">
                  {score}
                </span>
              </div>
              <dl className="mt-2 grid gap-2 text-xs text-slate-600">
                <div className="flex justify-between gap-3">
                  <dt>{amountLabels[mode]}</dt>
                  <dd className="font-semibold text-slate-900">
                    {money(option.amount)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Cash impact</dt>
                  <dd className="font-semibold text-slate-900">
                    {money(option.cashImpact)}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Risk</dt>
                  <dd className="font-semibold text-slate-900">
                    {option.risk}/5
                  </dd>
                </div>
              </dl>
              {splitLines(option.excludes).length > 0 && (
                <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs leading-5 text-amber-950">
                  <strong>Unclear:</strong>{" "}
                  {splitLines(option.excludes).slice(0, 2).join("; ")}
                </div>
              )}
            </section>
          ))}
        </div>

        <p className="mt-4 rounded-md border border-cyan-200 bg-cyan-50 p-3 text-xs leading-5 text-cyan-950">
          This is a comparison aid. Verify contracts, title statements, loan
          disclosures, repair scopes, insurance documents, and local rules
          before acting.
        </p>
      </aside>
    </section>
  );
}

import { useEffect, useMemo, useState } from "react";

interface RentalInputs {
  purchasePrice: number;
  repairBudget: number;
  downPayment: number;
  closingCosts: number;
  monthlyRent: number;
  vacancyRate: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
  maintenanceRate: number;
  capexRate: number;
  managementRate: number;
  otherMonthly: number;
  mortgagePayment: number;
  cashReserveAfterClose: number;
}

interface NumberField {
  key: keyof RentalInputs;
  label: string;
  prefix?: string;
  suffix?: string;
  help?: string;
  min?: number;
  max?: number;
  step?: number;
}

const storageKey = "kefiw:property-rental-investor-planner";

const defaultInputs: RentalInputs = {
  purchasePrice: 325000,
  repairBudget: 12000,
  downPayment: 65000,
  closingCosts: 9000,
  monthlyRent: 2600,
  vacancyRate: 6,
  propertyTaxAnnual: 5200,
  insuranceAnnual: 1800,
  hoaMonthly: 0,
  maintenanceRate: 7,
  capexRate: 6,
  managementRate: 8,
  otherMonthly: 100,
  mortgagePayment: 1700,
  cashReserveAfterClose: 18000,
};

const fields: NumberField[] = [
  { key: "purchasePrice", label: "Purchase price", prefix: "$", step: 1000 },
  {
    key: "repairBudget",
    label: "Initial repair budget",
    prefix: "$",
    step: 500,
  },
  { key: "downPayment", label: "Down payment", prefix: "$", step: 1000 },
  { key: "closingCosts", label: "Closing costs", prefix: "$", step: 500 },
  { key: "monthlyRent", label: "Expected monthly rent", prefix: "$", step: 50 },
  {
    key: "vacancyRate",
    label: "Vacancy and credit loss",
    suffix: "%",
    max: 40,
    step: 0.5,
  },
  {
    key: "propertyTaxAnnual",
    label: "Annual property tax",
    prefix: "$",
    step: 100,
  },
  { key: "insuranceAnnual", label: "Annual insurance", prefix: "$", step: 100 },
  { key: "hoaMonthly", label: "Monthly HOA/condo fee", prefix: "$", step: 25 },
  {
    key: "maintenanceRate",
    label: "Maintenance reserve",
    suffix: "% of rent",
    max: 40,
    step: 0.5,
  },
  {
    key: "capexRate",
    label: "Capex reserve",
    suffix: "% of rent",
    max: 40,
    step: 0.5,
  },
  {
    key: "managementRate",
    label: "Management reserve",
    suffix: "% of rent",
    max: 40,
    step: 0.5,
  },
  {
    key: "otherMonthly",
    label: "Other monthly expenses",
    prefix: "$",
    step: 25,
  },
  {
    key: "mortgagePayment",
    label: "Monthly mortgage payment",
    prefix: "$",
    step: 50,
  },
  {
    key: "cashReserveAfterClose",
    label: "Cash reserve after close",
    prefix: "$",
    step: 500,
  },
];

function money(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function percent(value: number): string {
  if (!Number.isFinite(value)) return "0.0%";
  return `${value.toFixed(1)}%`;
}

function clamp(value: number, min = 0, max = Number.POSITIVE_INFINITY): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export default function RentalInvestorPlanner(): JSX.Element {
  const [inputs, setInputs] = useState<RentalInputs>(defaultInputs);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setInputs({ ...defaultInputs, ...JSON.parse(raw) });
    } catch {
      setInputs(defaultInputs);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(inputs));
    } catch {
      // Local storage is optional.
    }
  }, [inputs]);

  const result = useMemo(() => {
    const totalBasis = inputs.purchasePrice + inputs.repairBudget;
    const cashInvested =
      inputs.downPayment + inputs.closingCosts + inputs.repairBudget;
    const vacancyLoss = inputs.monthlyRent * (inputs.vacancyRate / 100);
    const effectiveIncome = inputs.monthlyRent - vacancyLoss;
    const taxMonthly = inputs.propertyTaxAnnual / 12;
    const insuranceMonthly = inputs.insuranceAnnual / 12;
    const maintenance = inputs.monthlyRent * (inputs.maintenanceRate / 100);
    const capex = inputs.monthlyRent * (inputs.capexRate / 100);
    const management = inputs.monthlyRent * (inputs.managementRate / 100);
    const operatingExpenses =
      taxMonthly +
      insuranceMonthly +
      inputs.hoaMonthly +
      maintenance +
      capex +
      management +
      inputs.otherMonthly;
    const noiMonthly = effectiveIncome - operatingExpenses;
    const cashFlowMonthly = noiMonthly - inputs.mortgagePayment;
    const noiAnnual = noiMonthly * 12;
    const cashFlowAnnual = cashFlowMonthly * 12;
    const capRate = totalBasis > 0 ? (noiAnnual / totalBasis) * 100 : 0;
    const cashOnCash =
      cashInvested > 0 ? (cashFlowAnnual / cashInvested) * 100 : 0;
    const dscr =
      inputs.mortgagePayment > 0 ? noiMonthly / inputs.mortgagePayment : 0;
    const reserveTarget = Math.max(
      0,
      (operatingExpenses + inputs.mortgagePayment) * 6,
    );
    const rentToBasis =
      totalBasis > 0 ? (inputs.monthlyRent / totalBasis) * 100 : 0;
    return {
      totalBasis,
      cashInvested,
      vacancyLoss,
      effectiveIncome,
      operatingExpenses,
      noiMonthly,
      noiAnnual,
      cashFlowMonthly,
      cashFlowAnnual,
      capRate,
      cashOnCash,
      dscr,
      reserveTarget,
      reserveGap: inputs.cashReserveAfterClose - reserveTarget,
      rentToBasis,
      maintenance,
      capex,
      management,
    };
  }, [inputs]);

  const flags = useMemo(() => {
    const items: {
      label: string;
      body: string;
      tone: "danger" | "warn" | "ok";
    }[] = [];
    if (result.cashFlowMonthly < 0) {
      items.push({
        label: "Negative cash flow",
        body: "The property needs owner cash every month before surprise repairs.",
        tone: "danger",
      });
    } else if (result.cashFlowMonthly < 150) {
      items.push({
        label: "Thin cash flow",
        body: "One maintenance miss, vacancy, or insurance change can erase the margin.",
        tone: "warn",
      });
    } else {
      items.push({
        label: "Cash flow cushion",
        body: "The monthly cash flow leaves some room before unexpected costs.",
        tone: "ok",
      });
    }

    if (result.dscr > 0 && result.dscr < 1.2) {
      items.push({
        label: "Low DSCR",
        body: "Debt service coverage is below a conservative comfort zone.",
        tone: "warn",
      });
    }

    if (inputs.maintenanceRate + inputs.capexRate < 10) {
      items.push({
        label: "Repair reserves look light",
        body: "Maintenance plus capex is under 10% of rent. Older properties may need more.",
        tone: "warn",
      });
    }

    if (result.reserveGap < 0) {
      items.push({
        label: "Reserve shortfall",
        body: `Cash reserve is ${money(Math.abs(result.reserveGap))} below a six-month target.`,
        tone: "danger",
      });
    }

    if (inputs.vacancyRate < 5) {
      items.push({
        label: "Vacancy assumption is tight",
        body: "Stress-test a slower lease-up, turnover, or tenant issue.",
        tone: "warn",
      });
    }

    if (items.length === 0) {
      items.push({
        label: "No major flags",
        body: "The model has no obvious planning red flags, but due diligence still matters.",
        tone: "ok",
      });
    }

    return items;
  }, [inputs, result]);

  const summaryText = useMemo(() => {
    return [
      "Kefiw Rental Investor Planner",
      `Purchase price: ${money(inputs.purchasePrice)}`,
      `Total basis: ${money(result.totalBasis)}`,
      `Monthly rent: ${money(inputs.monthlyRent)}`,
      `NOI: ${money(result.noiAnnual)} per year`,
      `Monthly cash flow: ${money(result.cashFlowMonthly)}`,
      `Cap rate: ${percent(result.capRate)}`,
      `Cash-on-cash return: ${percent(result.cashOnCash)}`,
      `DSCR: ${result.dscr.toFixed(2)}`,
      `Reserve target: ${money(result.reserveTarget)}`,
      `Reserve gap: ${money(result.reserveGap)}`,
      `Flags: ${flags.map((flag) => flag.label).join(", ")}`,
    ].join("\n");
  }, [flags, inputs, result]);

  const update = (key: keyof RentalInputs, value: number): void => {
    const field = fields.find((item) => item.key === key);
    setInputs((current) => ({
      ...current,
      [key]: clamp(
        value,
        field?.min ?? 0,
        field?.max ?? Number.POSITIVE_INFINITY,
      ),
    }));
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
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(21rem,0.85fr)]"
      aria-label="Rental investor planner"
    >
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Stress-test the deal
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Use conservative rent, vacancy, repairs, capex, management, debt,
            and reserve assumptions before treating a rental as profitable.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {fields.map((field) => (
            <label
              key={field.key}
              className="rounded-lg border border-slate-200 bg-white p-3"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {field.label}
              </span>
              <div className="mt-1 flex rounded-md border border-slate-300 bg-white">
                {field.prefix && (
                  <span className="border-r border-slate-200 px-3 py-2 text-sm text-slate-500">
                    {field.prefix}
                  </span>
                )}
                <input
                  className="min-w-0 flex-1 px-3 py-2 text-sm text-slate-900 outline-none"
                  type="number"
                  min={field.min ?? 0}
                  max={field.max}
                  step={field.step ?? 1}
                  value={inputs[field.key]}
                  onChange={(event) =>
                    update(field.key, Number(event.target.value))
                  }
                />
                {field.suffix && (
                  <span className="border-l border-slate-200 px-3 py-2 text-sm text-slate-500">
                    {field.suffix}
                  </span>
                )}
              </div>
              {field.help && (
                <span className="mt-1 block text-xs text-slate-500">
                  {field.help}
                </span>
              )}
            </label>
          ))}
        </section>
      </div>

      <aside className="h-fit rounded-lg border border-brand-200 bg-white p-4 lg:sticky lg:top-24">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
              Deal signal
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              {result.cashFlowMonthly >= 0
                ? money(result.cashFlowMonthly)
                : `-${money(Math.abs(result.cashFlowMonthly))}`}{" "}
              / month
            </h2>
            <p className="mt-1 text-xs text-slate-600">
              Estimated cash flow after vacancy, operating reserves, and debt
              service.
            </p>
          </div>
          <button
            type="button"
            className="rounded-md bg-brand-700 px-3 py-2 text-xs font-semibold text-white hover:bg-brand-800"
            onClick={copySummary}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <dl className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">NOI</dt>
            <dd className="font-semibold text-slate-950">
              {money(result.noiAnnual)} / year
            </dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">Cap rate</dt>
            <dd className="font-semibold text-slate-950">
              {percent(result.capRate)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">Cash-on-cash</dt>
            <dd className="font-semibold text-slate-950">
              {percent(result.cashOnCash)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">DSCR</dt>
            <dd className="font-semibold text-slate-950">
              {result.dscr.toFixed(2)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">Total cash invested</dt>
            <dd className="font-semibold text-slate-950">
              {money(result.cashInvested)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">Reserve target</dt>
            <dd className="font-semibold text-slate-950">
              {money(result.reserveTarget)}
            </dd>
          </div>
          <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
            <dt className="text-slate-600">Rent to basis</dt>
            <dd className="font-semibold text-slate-950">
              {percent(result.rentToBasis)}
            </dd>
          </div>
        </dl>

        <section className="mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
            Risk flags
          </h3>
          <div className="mt-2 grid gap-2">
            {flags.map((flag) => (
              <div
                key={flag.label}
                className={`rounded-md border p-3 text-xs leading-5 ${
                  flag.tone === "danger"
                    ? "border-rose-200 bg-rose-50 text-rose-950"
                    : flag.tone === "warn"
                      ? "border-amber-200 bg-amber-50 text-amber-950"
                      : "border-emerald-200 bg-emerald-50 text-emerald-950"
                }`}
              >
                <div className="font-semibold">{flag.label}</div>
                <div className="mt-1">{flag.body}</div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </section>
  );
}

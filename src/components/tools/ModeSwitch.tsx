interface Props<T extends string> {
  label?: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  hint?: string;
  id?: string;
}

export default function ModeSwitch<T extends string>({ label, options, value, onChange, hint, id }: Props<T>) {
  return (
    <div>
      {label && <div className="label" id={id ? `${id}-label` : undefined}>{label}</div>}
      <div
        role="tablist"
        aria-labelledby={id ? `${id}-label` : undefined}
        className="inline-flex w-full max-w-sm rounded-lg bg-slate-100 p-1 text-sm"
      >
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(opt.value)}
              className={`flex-1 min-h-[40px] rounded-md px-3 text-sm font-medium transition-colors ${
                active ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

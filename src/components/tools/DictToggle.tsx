import { track } from '~/lib/analytics';

interface Props {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

export default function DictToggle({ enabled, onChange }: Props) {
  const handle = (v: boolean) => {
    if (v !== enabled) track('dict_toggled', { enabled: v });
    onChange(v);
  };
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        checked={enabled}
        onChange={(e) => handle(e.target.checked)}
      />
      <span>
        <span className="font-medium text-slate-900">Enable word list</span>
        <span className="block text-xs text-slate-500">
          Loads the dictionary in your browser so tools can search offline. Turn off to skip the download.
        </span>
      </span>
    </label>
  );
}

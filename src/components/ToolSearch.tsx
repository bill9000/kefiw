import { useMemo, useState } from 'react';
import { TOOLS, toolHref } from '~/data/tools';

export default function ToolSearch() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return TOOLS.filter((t) => {
      const hay = [t.title, t.h1, t.description, ...t.keywords, t.slug].join(' ').toLowerCase();
      return hay.includes(needle);
    }).slice(0, 8);
  }, [q]);

  return (
    <div className="relative">
      <input
        type="search"
        value={q}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Search tools…"
        className="input h-9 text-sm"
        aria-label="Search tools"
      />
      {open && results.length > 0 && (
        <ul className="absolute right-0 z-40 mt-1 max-h-80 w-72 overflow-auto rounded-md border border-slate-200 bg-white text-sm shadow-lg">
          {results.map((t) => (
            <li key={t.id}>
              <a
                href={toolHref(t)}
                className="block px-3 py-2 text-slate-900 no-underline hover:bg-brand-50"
              >
                <div className="font-medium">{t.h1}</div>
                <div className="truncate text-xs text-slate-500">{t.description}</div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

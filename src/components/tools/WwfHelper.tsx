import { useState } from 'react';
import RackHelper from './RackHelper';
import BoardScorer from './BoardScorer';
import { WWF_CONFIG } from '~/data/board-config';

export default function WwfHelper() {
  const [mode, setMode] = useState<'rack' | 'board'>('rack');
  return (
    <div className="space-y-3">
      <aside
        aria-label="Words With Friends dictionary disclaimer"
        className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900"
      >
        <strong>Dictionary note:</strong> Kefiw uses the public-domain ENABLE word list, not
        Zynga&rsquo;s official Words With Friends dictionary. Tile values and bonus-square
        positions match WWF, but a small number of unusual plays may still be flagged as
        invalid by the app even when Kefiw accepts them — and vice versa. If WWF rejects a
        play, trust WWF.
      </aside>
      <div className="flex gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setMode('rack')}
          className={`border-b-2 px-3 py-2 text-sm font-semibold transition ${mode === 'rack' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
        >
          Rack helper
        </button>
        <button
          type="button"
          onClick={() => setMode('board')}
          className={`border-b-2 px-3 py-2 text-sm font-semibold transition ${mode === 'board' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
        >
          Board scorer
        </button>
      </div>
      {mode === 'rack' ? <RackHelper valueSet="wwf" /> : <BoardScorer config={WWF_CONFIG} />}
    </div>
  );
}

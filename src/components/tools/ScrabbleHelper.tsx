import { useState } from 'react';
import RackHelper from './RackHelper';
import BoardScorer from './BoardScorer';
import { SCRABBLE_CONFIG } from '~/data/board-config';

// Scrabble helper has two modes side-by-side:
//   - Rack: find plays from your tiles (existing behavior)
//   - Board scorer: score a specific play on a specific board position
// Both share the ENABLE public-domain word list (disclaimer below).
export default function ScrabbleHelper() {
  const [mode, setMode] = useState<'rack' | 'board'>('rack');
  return (
    <div className="space-y-3">
      <aside
        aria-label="Scrabble dictionary disclaimer"
        className="rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700"
      >
        <strong>Dictionary:</strong> Kefiw uses the public-domain ENABLE list. Tournaments typically
        use <span className="font-mono">TWL</span> (North America) or <span className="font-mono">SOWPODS / Collins</span> (international),
        which Kefiw cannot license. Validity matches ENABLE on the vast majority of plays, but for
        edge cases the tournament list is the final word — defer to the ruling in whichever list
        your table or league uses.
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
      {mode === 'rack' ? <RackHelper valueSet="scrabble" /> : <BoardScorer config={SCRABBLE_CONFIG} />}
    </div>
  );
}

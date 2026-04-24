import RackHelper from './RackHelper';

// Kefiw ships the public-domain ENABLE word list. Official tournament lists
// (TWL, SOWPODS / Collins, NWL) are proprietary and not licensed here —
// disclaimer surfaces this honestly on every scrabble-helper view.
export default function ScrabbleHelper() {
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
      <RackHelper valueSet="scrabble" />
    </div>
  );
}

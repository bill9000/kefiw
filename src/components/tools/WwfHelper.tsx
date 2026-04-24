import RackHelper from './RackHelper';

// WWF uses Zynga's proprietary word list which Kefiw cannot license; results
// come from the ENABLE public-domain list and some edge-case plays may differ
// from the actual WWF ruling. Disclaimer panel documented per support article.
export default function WwfHelper() {
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
      <RackHelper valueSet="wwf" />
    </div>
  );
}

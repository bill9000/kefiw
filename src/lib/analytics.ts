// Provider-agnostic analytics hook. No-ops when no provider is attached,
// so the site works fine without any tracking wired up.
//
// Fires events to:
//   - window.plausible(name, { props })          (Plausible)
//   - window.gtag('event', name, props)          (GA4)
//   - window.dataLayer.push({ event: name, ... }) (GTM / generic)
//
// Supported event names (keep these stable — used as analytics event IDs):
//   - 'mode_selected'      props: { tool, mode }
//   - 'dict_loaded'        props: { source, ms }
//   - 'copy_result'        props: { tool, count }

type Props = Record<string, string | number | boolean | undefined>;

type PlausibleFn = (event: string, options?: { props?: Props }) => void;
type GtagFn = (command: 'event', event: string, params?: Props) => void;

interface Win {
  plausible?: PlausibleFn;
  gtag?: GtagFn;
  dataLayer?: Array<Record<string, unknown>>;
}

export function track(event: string, props: Props = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as Win;
  try {
    w.plausible?.(event, { props });
    w.gtag?.('event', event, props);
    w.dataLayer?.push({ event, ...props });
  } catch {
    /* noop */
  }
}

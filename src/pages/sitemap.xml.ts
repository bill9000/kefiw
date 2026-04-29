import type { APIRoute } from 'astro';
import { TOOLS, CATEGORIES, toolHref } from '~/data/tools';
import { buildSeoPages } from '~/lib/seo-pages';
import {
  contentPagesBySection,
  contentHref,
  type ContentPageConfig,
} from '~/data/content-pages';
import { CLUSTERS, clusterHref } from '~/data/clusters';
import { DAILY_GAMES } from '~/data/daily-games';
import { TRACKS, trackHref } from '~/data/tracks';
import { VERTICAL_CALCULATORS, verticalCalculatorHref } from '~/data/vertical-calculators';

const STATIC_ROUTES = [
  '/',
  ...Object.values(CATEGORIES).map((c) => `/${c.slug}/`),
  '/guides/',
  '/about/',
  '/contact/',
  '/privacy/',
  '/terms/',
  '/trust/',
  '/about-the-reviewers/',
  '/methodology/',
  '/editorial-policy/',
  '/sources/',
  '/engineering-review/',
  '/scientific-review/',
  '/registered-nurse-review/',
  '/remodeling-contractor-review/',
  '/realtor-review/',
  '/health-disclaimer/',
  '/advertising-disclosure/',
  '/corrections/',
  '/daily/',
  '/daily/leaderboard/',
  ...DAILY_GAMES.map((g) => `/daily/${g.slug}/`),
  '/scenarios/',
  '/scenarios/stress-test-triad/',
  '/scenarios/focus-triad/',
  '/scenarios/rate-triad/',
  '/comparisons/',
  '/comparisons/dual-career-path/',
  '/comparisons/role-economics/',
  '/comparisons/platform-arbitrage/',
  '/homelab/',
  '/homelab/roof-replacement-cost-calculator/',
  '/homelab/roof-square-footage-calculator/',
  '/homelab/roof-pitch-calculator/',
  '/homelab/shingle-bundle-calculator/',
  '/homelab/roof-repair-vs-replacement-calculator/',
  '/homelab/asphalt-shingle-cost-calculator/',
  '/homelab/metal-roof-cost-calculator/',
  '/homelab/new-roof-roi-calculator/',
  '/homelab/roof-insurance-deductible-calculator/',
  '/homelab/acv-vs-rcv-calculator/',
  '/homelab/hail-damage-severity-estimator/',
  '/homelab/underlayment-calculator/',
  '/homelab/ice-water-shield-calculator/',
  '/homelab/drip-edge-calculator/',
  '/homelab/attic-ventilation-calculator/',
  '/homelab/decking-replacement-calculator/',
  '/homelab/houston-roof-replacement-cost/',
  '/homelab/dallas-roof-replacement-cost/',
  '/homelab/austin-roof-replacement-cost/',
  '/homelab/san-antonio-roof-replacement-cost/',
  '/homelab/atlanta-roof-replacement-cost/',
  '/homelab/methodology/',
  '/homelab/about/',
  '/property/',
  '/business/',
  '/care/',
  '/tracks/',
];

function publishedContent(section: 'word-tools' | 'guides' | 'calculators' | 'converters' | 'games'): ContentPageConfig[] {
  return contentPagesBySection(section).filter((c) => {
    // Drop any content page marked noindex — never submit a URL to the sitemap
    // that we also tell Google not to index. That produces Search Console warnings.
    if ((c as { noindex?: boolean }).noindex === true) return false;
    if (c.kind !== 'word-list') return true;
    const words = c.buildWords?.() ?? [];
    const min = c.minWords ?? 10;
    return words.length >= min;
  });
}

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://kefiw.com')).toString().replace(/\/$/, '');
  const { pages: seoPages } = buildSeoPages();
  const urls = [
    ...STATIC_ROUTES,
    ...TRACKS.map(trackHref),
    ...VERTICAL_CALCULATORS.map(verticalCalculatorHref),
    ...CLUSTERS.map(clusterHref),
    // Exclude noindex tools (reagent-* etc.) — same rationale as above.
    ...TOOLS.filter((t) => !t.comingSoon && !t.noindex).map(toolHref),
    ...seoPages.map((p) => `/word-tools/${p.slug}/`),
    ...publishedContent('word-tools').map(contentHref),
    ...publishedContent('guides').map(contentHref),
    ...publishedContent('calculators').map(contentHref),
    ...publishedContent('converters').map(contentHref),
    ...publishedContent('games').map(contentHref),
  ];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};

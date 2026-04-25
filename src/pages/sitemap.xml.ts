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

const STATIC_ROUTES = [
  '/',
  ...Object.values(CATEGORIES).map((c) => `/${c.slug}/`),
  '/guides/',
  '/about/',
  '/contact/',
  '/privacy/',
  '/terms/',
  '/daily/',
  '/daily/leaderboard/',
  ...DAILY_GAMES.map((g) => `/daily/${g.slug}/`),
  '/homelab/',
  '/homelab/roof-replacement-cost-calculator/',
  '/homelab/methodology/',
  '/homelab/about/',
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

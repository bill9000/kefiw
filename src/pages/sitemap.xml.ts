import type { APIRoute } from 'astro';
import { TOOLS, CATEGORIES, toolHref } from '~/data/tools';
import { buildSeoPages } from '~/lib/seo-pages';
import {
  contentPagesBySection,
  contentHref,
  type ContentPageConfig,
} from '~/data/content-pages';
import { CLUSTERS, clusterHref } from '~/data/clusters';

const STATIC_ROUTES = [
  '/',
  ...Object.values(CATEGORIES).map((c) => `/${c.slug}/`),
  '/guides/',
  '/about/',
  '/contact/',
  '/privacy/',
  '/terms/',
];

function publishedContent(section: 'word-tools' | 'guides' | 'calculators' | 'converters' | 'games'): ContentPageConfig[] {
  return contentPagesBySection(section).filter((c) => {
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
    ...TOOLS.filter((t) => !t.comingSoon).map(toolHref),
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

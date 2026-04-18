import type { APIRoute } from 'astro';
import { TOOLS, CATEGORIES, toolHref } from '~/data/tools';
import { buildSeoPages } from '~/lib/seo-pages';

const STATIC_ROUTES = [
  '/',
  ...Object.values(CATEGORIES).map((c) => `/${c.slug}/`),
  '/about/',
  '/contact/',
  '/privacy/',
  '/terms/',
];

export const GET: APIRoute = ({ site }) => {
  const base = (site ?? new URL('https://kefiw.com')).toString().replace(/\/$/, '');
  const { pages: seoPages } = buildSeoPages();
  const urls = [
    ...STATIC_ROUTES,
    ...TOOLS.filter((t) => !t.comingSoon).map(toolHref),
    ...seoPages.map((p) => `/word-tools/${p.slug}/`),
  ];
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u) => `  <url><loc>${base}${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};

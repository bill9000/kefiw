export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  if (url.hostname === 'www.kefiw.com') {
    url.hostname = 'kefiw.com';
    return Response.redirect(url.toString(), 301);
  }

  const path = url.pathname.toLowerCase();
  const wordListRedirects: Array<{ pattern: RegExp; target: string }> = [
    { pattern: /^\/word-tools\/\d+-letter-words-starting-with-[a-z]\/?$/, target: '/word-tools/words-starting-with/' },
    { pattern: /^\/word-tools\/\d+-letter-words-ending-with-[a-z]\/?$/, target: '/word-tools/words-ending-with/' },
    { pattern: /^\/word-tools\/\d+-letter-words-containing-[a-z]\/?$/, target: '/word-tools/words-containing/' },
    { pattern: /^\/word-tools\/words-ending-with-[a-z]+\/?$/, target: '/word-tools/words-ending-with/' },
    { pattern: /^\/word-tools\/words-containing-[a-z]+\/?$/, target: '/word-tools/words-containing/' },
  ];

  const wordListRedirect = wordListRedirects.find((rule) => rule.pattern.test(path));
  if (wordListRedirect) {
    url.pathname = wordListRedirect.target;
    url.search = '';
    return Response.redirect(url.toString(), 301);
  }

  const dailyRouteRedirects: Record<string, string> = {
    '/daily/percent/': '/daily/math/percent/',
    '/daily/discount/': '/daily/math/discount/',
    '/daily/convert/': '/daily/math/convert/',
    '/daily/tip/': '/daily/math/tip/',
    '/daily/timedelta/': '/daily/math/timedelta/',
    '/daily/crypt/': '/daily/verbal/crypt/',
    '/daily/link/': '/daily/verbal/link/',
    '/daily/shift/': '/daily/verbal/shift/',
    '/daily/crosser/': '/daily/verbal/crosser/',
    '/daily/twist/': '/daily/verbal/twist/',
    '/daily/circuit/': '/daily/spatial/circuit/',
    '/daily/drop/': '/daily/spatial/drop/',
    '/daily/pair/': '/daily/spatial/pair/',
    '/daily/hex/': '/daily/spatial/hex/',
    '/daily/path/': '/daily/spatial/path/',
  };

  const normalizedDailyPath = path.endsWith('/') ? path : `${path}/`;
  const dailyRouteRedirect = dailyRouteRedirects[normalizedDailyPath];
  if (dailyRouteRedirect) {
    url.pathname = dailyRouteRedirect;
    url.search = '';
    return Response.redirect(url.toString(), 301);
  }

  return next();
};

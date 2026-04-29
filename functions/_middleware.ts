export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url);

  if (url.hostname === 'www.kefiw.com') {
    url.hostname = 'kefiw.com';
    return Response.redirect(url.toString(), 301);
  }

  return next();
};

function json(body: unknown, init: ResponseInit = {}): Response {
  return Response.json(body, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...(init.headers ?? {}),
    },
  });
}

export const onRequestGet: PagesFunction = async () => {
  return json({ error: 'not_found' }, { status: 404 });
};

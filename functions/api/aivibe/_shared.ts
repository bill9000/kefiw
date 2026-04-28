export interface Env {
  AIVIBE_AI_API_TOKEN?: string;
  AIVIBE_BASE_URL?: string;
}

const DEFAULT_BASE_URL = 'https://aivibe.us';
const UPSTREAM_TIMEOUT_MS = 60000;

export function aivibeBaseUrl(env: Env) {
  return (env.AIVIBE_BASE_URL || DEFAULT_BASE_URL).replace(/\/+$/, '');
}

export function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      'Cache-Control': 'no-store',
      ...init.headers,
    },
  });
}

export async function proxyJson(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    const name = error instanceof Error ? error.name : '';
    const message = error instanceof Error ? error.message : 'AIvibe upstream request failed.';
    return json(
      {
        error: name === 'AbortError' ? 'AIvibe upstream request timed out.' : message,
      },
      { status: name === 'AbortError' ? 504 : 502 },
    );
  } finally {
    clearTimeout(timeout);
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json().catch(() => null)
    : { error: await response.text().catch(() => '') };

  return json(data, { status: response.status });
}

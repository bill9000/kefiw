import { aivibeBaseUrl, type Env, json, proxyJson } from './_shared';

const LEVELS = new Set(['minimum', 'low', 'medium', 'high', 'maximum']);

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.AIVIBE_AI_API_TOKEN) {
    return json({ error: 'AIVIBE_AI_API_TOKEN is not configured.' }, { status: 503 });
  }

  const input = await request.json().catch(() => null) as {
    prompt?: unknown;
    promptId?: unknown;
    promptParameters?: unknown;
    provider?: unknown;
    intelligenceLevel?: unknown;
    parameters?: {
      temperature?: unknown;
      maxTokens?: unknown;
    };
  } | null;

  const prompt = String(input?.prompt || '').trim();
  const promptId = String(input?.promptId || '').trim();
  const provider = String(input?.provider || '').trim();
  const intelligenceLevel = String(input?.intelligenceLevel || '').trim();
  const temperature = Number(input?.parameters?.temperature ?? 0.2);
  const maxTokens = Number(input?.parameters?.maxTokens ?? 300);

  if (!prompt && !promptId) return json({ error: 'Prompt or promptId is required.' }, { status: 400 });
  if (!provider) return json({ error: 'Provider is required.' }, { status: 400 });
  if (!LEVELS.has(intelligenceLevel)) return json({ error: 'Invalid intelligence level.' }, { status: 400 });

  const payload = {
    ...(promptId
      ? {
          promptId: promptId.slice(0, 200),
          promptParameters: input?.promptParameters && typeof input.promptParameters === 'object'
            ? input.promptParameters
            : {},
        }
      : { prompt: prompt.slice(0, 12000) }),
    provider,
    intelligenceLevel,
    parameters: {
      temperature: Number.isFinite(temperature) ? Math.min(2, Math.max(0, temperature)) : 0.2,
      maxTokens: Number.isFinite(maxTokens) ? Math.min(4000, Math.max(1, Math.round(maxTokens))) : 300,
    },
  };

  return proxyJson(`${aivibeBaseUrl(env)}/api/ai/run`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-ai-api-token': env.AIVIBE_AI_API_TOKEN,
    },
    body: JSON.stringify(payload),
  });
};

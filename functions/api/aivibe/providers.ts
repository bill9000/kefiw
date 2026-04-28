import { aivibeBaseUrl, type Env, proxyJson } from './_shared';

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  return proxyJson(`${aivibeBaseUrl(env)}/api/ai-pricing/providers`);
};

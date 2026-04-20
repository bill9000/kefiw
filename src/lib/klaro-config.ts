// Klaro CMP config — services + purposes declaration.
//
// This file is shaped to be consumed by the real Klaro library
// (https://github.com/kiprotect/klaro) once installed. Until then it's
// read by the in-house Persistent Telemetry Bar to determine which
// services to enable.
//
// To activate real Klaro: `pnpm add klaro` then import this config and
// call `klaro.setup(kefiwKlaroConfig)` from BaseLayout. The shape below
// matches Klaro v0.7+ expectations.

export interface KlaroService {
  name: string;
  title: string;
  purposes: string[];
  cookies?: Array<string | RegExp>;
  default?: boolean;
  required?: boolean;
  onAccept?: string;
  onDecline?: string;
}

export interface KlaroPurpose {
  name: string;
  title: string;
  description: string;
}

export interface KlaroConfig {
  version: number;
  elementID: string;
  mustConsent: boolean;
  acceptAll: boolean;
  hideDeclineAll: boolean;
  noAutoLoad: boolean;
  htmlTexts: boolean;
  embedded: boolean;
  lang: string;
  disablePoweredBy: boolean;
  translations: Record<string, Record<string, unknown>>;
  services: KlaroService[];
  purposes?: KlaroPurpose[];
}

export const kefiwPurposes: KlaroPurpose[] = [
  {
    name: 'analytics',
    title: 'Analytics',
    description: 'Aggregate page-view and performance counters. No personal identifiers.',
  },
  {
    name: 'advertising',
    title: 'Advertising',
    description: 'Contextual advertising on standard pages. On /health/* advertising is limited to non-personalized contextual only, regardless of this choice.',
  },
  {
    name: 'personalized-advertising',
    title: 'Personalized advertising',
    description: 'Uses cookies and device identifiers to measure ad effectiveness and serve ads aligned with your interests. Only applied outside /health/*.',
  },
];

export const kefiwServices: KlaroService[] = [
  {
    name: 'cloudflare-analytics',
    title: 'Cloudflare Web Analytics',
    purposes: ['analytics'],
    cookies: [],
    default: true,
    required: false,
  },
  {
    name: 'kfw-telemetry',
    title: 'Kefiw Telemetry',
    purposes: ['analytics'],
    cookies: [/^kfw_sid$/],
    default: true,
    required: false,
  },
  {
    name: 'google-adsense',
    title: 'Google AdSense (contextual)',
    purposes: ['advertising'],
    default: true,
    required: false,
  },
  {
    name: 'google-adsense-personalized',
    title: 'Google AdSense (personalized)',
    purposes: ['personalized-advertising'],
    default: false,
    required: false,
  },
];

export const kefiwKlaroConfig: KlaroConfig = {
  version: 1,
  elementID: 'klaro',
  mustConsent: false,
  acceptAll: true,
  hideDeclineAll: false,
  noAutoLoad: true,
  htmlTexts: true,
  embedded: false,
  lang: 'en',
  disablePoweredBy: true,
  translations: {
    en: {
      consentModal: {
        title: 'Privacy protocol',
        description: 'Kefiw uses contextual advertising and aggregate analytics by default. You can opt into personalized advertising for standard pages — /health/ pages always stay contextual-only.',
      },
      consentNotice: {
        changeDescription: 'Privacy preferences have changed. Please review.',
        description: 'This site uses cookies for analytics and contextual advertising.',
        learnMore: 'Review settings',
      },
      privacyPolicyUrl: '/privacy/',
    },
  },
  services: kefiwServices,
  purposes: kefiwPurposes,
};

export interface NewsReleaseFact {
  title: string;
  text: string;
}

export interface NewsRelease {
  label: string;
  date: string;
  accent: string;
  title: string;
  accentText: string;
  lead: string;
  copy: string[];
  href: string;
  cta: string;
  facts: NewsReleaseFact[];
}

export const NEWS_RELEASES: NewsRelease[] = [
  {
    label: 'Site Update',
    date: 'May 2026',
    accent: '#2563eb',
    title: 'Kefiw Reframes Tools Around Better Decisions',
    accentText: 'Better Decisions',
    lead: 'The homepage now puts calculators, converters, word helpers, and daily practice under one cognitive boost and planning system.',
    copy: [
      'Kefiw is not organized as a pile of isolated utilities. The site now groups lightweight tools around the moments where people need clearer numbers, cleaner options, and repeatable thinking practice.',
      'The shift makes property, business, care, tracks, and cognitive boost pages easier to scan without hiding the practical tools people came to use.',
    ],
    href: '/tracks/',
    cta: 'Explore tracks',
    facts: [
      { title: 'Focus', text: 'Decision support instead of tool dumping' },
      { title: 'Coverage', text: 'Property, business, care, and cognitive boost' },
      { title: 'Use', text: 'Start with a question, then move through related tools' },
    ],
  },
  {
    label: 'Daily Practice',
    date: 'May 2026',
    accent: '#0891b2',
    title: 'Daily Kefiw Adds Repeatable Thinking Practice',
    accentText: 'Daily Kefiw',
    lead: 'Daily word, math, verbal, and spatial drills now explain how to use the practice without treating scores as a diagnosis.',
    copy: [
      'The daily practice pages are written around habits: warm up, notice patterns, compare yesterday with today, and stop before the session turns into noise.',
      'That keeps the games in the cognitive boost lane, where they support attention, recall, language, number sense, and visual reasoning.',
    ],
    href: '/daily/',
    cta: 'Try Daily Kefiw',
    facts: [
      { title: 'Cadence', text: 'Short sessions refreshed daily' },
      { title: 'Modes', text: 'Word, math, verbal, spatial, and logic' },
      { title: 'Boundary', text: 'Practice routine, not medical measurement' },
    ],
  },
  {
    label: 'Quality Pass',
    date: 'May 2026',
    accent: '#16a34a',
    title: 'Kefiw Expands Thin Pages and Trust Guidance',
    accentText: 'Trust Guidance',
    lead: 'Recent updates added clearer explanations, stronger page context, and result-checking guidance across calculators and tools.',
    copy: [
      'Tool pages now include plain-language prompts that help users check whether a result is safe to use, whether inputs need review, and what next step makes sense.',
      'Business guides, templates, scenarios, converters, and daily pages also received more practical context so similar pages do not feel interchangeable.',
    ],
    href: '/methodology/',
    cta: 'Read methodology',
    facts: [
      { title: 'Clarity', text: 'More field and result context' },
      { title: 'Trust', text: 'Plain-language result checks' },
      { title: 'Depth', text: 'Expanded guide and template pages' },
    ],
  },
];

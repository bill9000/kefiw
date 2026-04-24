import type { ContentSection } from './content-pages';
import type { ToolCategory } from './tools';

export const REVIEW_LINKS = {
  hub: '/about-the-reviewers/',
  nurse: '/registered-nurse-review/',
  engineering: '/engineering-review/',
  science: '/scientific-review/',
  editorial: '/editorial-policy/',
  methodology: '/methodology/',
  sources: '/sources/',
  healthDisclaimer: '/health-disclaimer/',
} as const;

export interface ReviewLink {
  href: string;
  label: string;
}

export interface ReviewRole {
  label: string;
  href: string;
  note: string;
}

export interface ReviewPanelConfig {
  intro: string;
  builtBy: ReviewRole;
  reviewers: ReviewRole[];
  scope: string[];
  caution: string;
  links: ReviewLink[];
}

export type ReviewArea = ToolCategory | ContentSection | 'health-guide' | undefined;

// ENGINEERING_ROLE is used under "Built by" in the AuthorityPanel. The label
// reads as a team/group name there ("Built by Kefiw engineering"), not a
// review-lane name. The href still points at /engineering-review/ which
// explains the scope of engineering work.
const ENGINEERING_ROLE: ReviewRole = {
  label: 'Kefiw engineering',
  href: REVIEW_LINKS.engineering,
  note: 'Builds the tool: formula logic, browser behavior, unit handling, rounding, and implementation correctness.',
};

const SCIENCE_ROLE: ReviewRole = {
  label: 'Scientific review',
  href: REVIEW_LINKS.science,
  note: 'Reviews source quality, evidence framing, assumptions, and clear statement of limits.',
};

const NURSE_ROLE: ReviewRole = {
  label: 'Registered nurse review',
  href: REVIEW_LINKS.nurse,
  note: 'Engaged only on health-related pages. Reviews safety wording, escalation language, and red-flag copy. Non-health pages (word tools, calculators, games, guides) are not reviewed by a nurse.',
};

function sharedLinks(includeHealthDisclaimer = false): ReviewLink[] {
  const links: ReviewLink[] = [
    { href: REVIEW_LINKS.hub, label: 'About the reviewers' },
    { href: REVIEW_LINKS.editorial, label: 'Editorial policy' },
    { href: REVIEW_LINKS.methodology, label: 'Methodology' },
    { href: REVIEW_LINKS.sources, label: 'Sources' },
  ];
  if (includeHealthDisclaimer) {
    links.push({ href: REVIEW_LINKS.healthDisclaimer, label: 'Health disclaimer' });
  }
  return links;
}

function decisionMathConfig(): ReviewPanelConfig {
  return {
    intro: 'This page is built as a deterministic calculation or reference aid for planning, checking, and comparison work.',
    builtBy: ENGINEERING_ROLE,
    reviewers: [SCIENCE_ROLE],
    scope: [
      'formula choice and variable definitions',
      'input validation, unit conversions, and rounding behavior',
      'examples, assumptions, and explicit limitations',
    ],
    caution: 'Informational only. Use the result to understand the math, not as legal, financial, tax, medical, or professional advice.',
    links: sharedLinks(false),
  };
}

function playAndLanguageConfig(): ReviewPanelConfig {
  return {
    intro: 'This page is built to help with word search, puzzle logic, drafting, and pattern recognition without pretending to replace judgment or official rules.',
    builtBy: ENGINEERING_ROLE,
    reviewers: [SCIENCE_ROLE],
    scope: [
      'dictionary, search, or scoring logic used on the page',
      'game-rule explanations and strategy framing',
      'tool limits such as missing names, pronunciation gaps, or dictionary mismatches',
    ],
    caution: 'Use helpers to learn patterns, explore options, and save time. Final choices still depend on puzzle rules, pronunciation, board state, or your own writing goals.',
    links: sharedLinks(false),
  };
}

function healthConfig(): ReviewPanelConfig {
  return {
    intro: 'This page is built as an educational health math or workflow aid with explicit review on safety wording, methodology, and stated limitations.',
    builtBy: ENGINEERING_ROLE,
    reviewers: [SCIENCE_ROLE, NURSE_ROLE],
    scope: [
      'formula logic, thresholds, and input assumptions',
      'source quality, evidence framing, and limit statements',
      'health-safety wording, red-flag language, and escalation copy',
    ],
    caution: 'Educational only. This site does not diagnose, prescribe, or create a clinician-patient relationship. Do not rely on it for urgent or individualized medical decisions.',
    links: sharedLinks(true),
  };
}

export function reviewPanelForArea(area: ReviewArea): ReviewPanelConfig {
  switch (area) {
    case 'health':
    case 'health-guide':
      return healthConfig();
    case 'calculators':
    case 'converters':
    case 'finance':
    case 'logic':
      return decisionMathConfig();
    case 'games':
    case 'word-tools':
    case 'guides':
    default:
      return playAndLanguageConfig();
  }
}

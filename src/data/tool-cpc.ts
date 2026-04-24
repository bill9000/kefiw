// CPC map — US desktop AdSense estimates, generated 2026-04-20.
// Source + rationale: .seo-cache/tool-cpc-map.json
// Tiers: S $8-20 | A $3-8 | B $1.50-3 | C $0.60-1.50 | D $0.25-0.60 | E <$0.25 | R restricted (AdSense low / premium network high)
// Use for: routing weight in FollowUpTools, cluster page prioritization, RPM-weighted sitemap priority.

export type CpcTier = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'R';

export interface ToolCpc {
  cpc: number;
  tier: CpcTier;
}

export const TOOL_CPC: Record<string, ToolCpc> = {
  'word-unscrambler': { cpc: 0.50, tier: 'D' },
  'anagram-solver': { cpc: 0.40, tier: 'D' },
  'word-finder': { cpc: 0.45, tier: 'D' },
  '5-letter-word-finder': { cpc: 0.50, tier: 'D' },
  '6-letter-word-finder': { cpc: 0.35, tier: 'D' },
  '7-letter-word-finder': { cpc: 0.55, tier: 'D' },
  'wordle-solver': { cpc: 0.55, tier: 'D' },
  'hangman-solver': { cpc: 0.30, tier: 'D' },
  'crossword-solver': { cpc: 0.70, tier: 'C' },
  'pattern-solver': { cpc: 0.35, tier: 'D' },
  'words-starting-with': { cpc: 0.30, tier: 'D' },
  'words-ending-with': { cpc: 0.30, tier: 'D' },
  'words-containing': { cpc: 0.35, tier: 'D' },
  'scrabble-helper': { cpc: 1.20, tier: 'C' },
  'words-with-friends-helper': { cpc: 1.20, tier: 'C' },
  'rhyme-finder': { cpc: 0.45, tier: 'D' },
  'syllable-counter': { cpc: 0.25, tier: 'E' },
  'letter-counter': { cpc: 0.25, tier: 'E' },
  'word-counter': { cpc: 0.35, tier: 'D' },
  'reverse-text': { cpc: 0.15, tier: 'E' },
  'case-converter': { cpc: 0.40, tier: 'D' },
  'remove-duplicate-lines': { cpc: 0.35, tier: 'D' },
  'sort-lines': { cpc: 0.30, tier: 'D' },
  'haiku-checker': { cpc: 0.20, tier: 'E' },

  'length-converter': { cpc: 0.60, tier: 'C' },
  'weight-converter': { cpc: 0.80, tier: 'C' },
  'temperature-converter': { cpc: 0.45, tier: 'D' },
  'area-converter': { cpc: 0.95, tier: 'C' },
  'volume-converter': { cpc: 0.60, tier: 'C' },
  'speed-converter': { cpc: 0.40, tier: 'D' },
  'time-converter': { cpc: 0.35, tier: 'D' },

  'percentage-calculator': { cpc: 0.85, tier: 'C' },
  'age-calculator': { cpc: 0.35, tier: 'D' },
  'date-difference-calculator': { cpc: 0.45, tier: 'D' },
  'average-calculator': { cpc: 0.60, tier: 'C' },
  'discount-calculator': { cpc: 0.90, tier: 'C' },
  'tip-calculator': { cpc: 0.50, tier: 'D' },
  'hours-calculator': { cpc: 1.40, tier: 'C' },
  'reading-time-calculator': { cpc: 0.35, tier: 'D' },
  'ratio-calculator': { cpc: 0.55, tier: 'C' },
  'fraction-calculator': { cpc: 0.40, tier: 'D' },
  'percent-of-calculator': { cpc: 0.75, tier: 'C' },
  'percent-change-calculator': { cpc: 0.95, tier: 'C' },
  'age-on-date-calculator': { cpc: 0.35, tier: 'D' },

  'runway-zero': { cpc: 4.50, tier: 'A' },
  'shock-survival': { cpc: 3.80, tier: 'A' },
  'horizon-point': { cpc: 9.50, tier: 'S' },
  'crossover-calculator': { cpc: 2.20, tier: 'B' },

  'leap-date': { cpc: 3.20, tier: 'A' },
  'hire-vs-automate': { cpc: 3.50, tier: 'A' },
  'value-floor': { cpc: 2.00, tier: 'B' },
  'cloud-exit': { cpc: 4.20, tier: 'A' },
  'minimum-viable-rate': { cpc: 2.80, tier: 'B' },
  'sp500-check': { cpc: 5.20, tier: 'A' },
  'tech-debt-interest': { cpc: 2.00, tier: 'B' },
  'revenue-per-head': { cpc: 2.50, tier: 'B' },
  'calorie-optimizer': { cpc: 0.85, tier: 'C' },
  'gig-net-floor': { cpc: 2.70, tier: 'B' },
  'bill-triage': { cpc: 3.50, tier: 'A' },
  'vice-to-value': { cpc: 1.80, tier: 'B' },
  'time-to-human': { cpc: 0.60, tier: 'C' },
  'dopamine-minimum': { cpc: 1.60, tier: 'B' },
  'trap-detector': { cpc: 5.50, tier: 'A' },
  'burnout-monitor': { cpc: 1.60, tier: 'B' },
  'bio-fuel': { cpc: 0.80, tier: 'C' },
  'default-optimizer': { cpc: 4.20, tier: 'A' },
  'asset-liquidator': { cpc: 2.80, tier: 'B' },
  'social-latency': { cpc: 0.60, tier: 'C' },
  'vimes-utility': { cpc: 0.45, tier: 'D' },
  'time-poverty': { cpc: 1.10, tier: 'B' },
  'liquid-value': { cpc: 1.50, tier: 'B' },
  'stability-coefficient': { cpc: 1.50, tier: 'B' },
  'break-even-calculator': { cpc: 1.80, tier: 'B' },
  'markup-margin-calculator': { cpc: 1.50, tier: 'B' },
  'mortgage-calculator': { cpc: 12.00, tier: 'S' },
  'mortgage-extra-payment-calculator': { cpc: 10.00, tier: 'S' },
  'markup-calculator': { cpc: 1.40, tier: 'B' },
  'margin-calculator': { cpc: 1.50, tier: 'B' },
  'savings-goal-calculator': { cpc: 2.80, tier: 'B' },

  'vibematch': { cpc: 0.25, tier: 'E' },
  'vibecircuit': { cpc: 0.22, tier: 'E' },
  'vibecrypt': { cpc: 0.30, tier: 'D' },
  'vibehex': { cpc: 0.40, tier: 'D' },
  'vibecontext': { cpc: 0.25, tier: 'E' },
  'vibepath': { cpc: 0.30, tier: 'D' },
  'vibecalc': { cpc: 0.30, tier: 'D' },
  'vibepair': { cpc: 0.22, tier: 'E' },
  'vibetwist': { cpc: 0.40, tier: 'D' },
  'vibelink': { cpc: 0.30, tier: 'D' },
  'vibeglobe': { cpc: 0.25, tier: 'E' },
  'vibecrosser': { cpc: 0.45, tier: 'D' },
  'vibedrop': { cpc: 0.30, tier: 'D' },
  'vibeshift': { cpc: 0.25, tier: 'E' },
  'vibecipher': { cpc: 0.45, tier: 'D' },
  'sudoku': { cpc: 0.40, tier: 'D' },
  'daily-word': { cpc: 0.35, tier: 'D' },
  'daily-anagram': { cpc: 0.30, tier: 'D' },
  'daily-unscramble': { cpc: 0.35, tier: 'D' },
  'sudoku-easy': { cpc: 0.35, tier: 'D' },
  'sudoku-medium': { cpc: 0.38, tier: 'D' },
  'sudoku-hard': { cpc: 0.42, tier: 'D' },
  'sudoku-expert': { cpc: 0.45, tier: 'D' },

  'metabolic-floor': { cpc: 1.60, tier: 'B' },
  'substance-decay': { cpc: 1.20, tier: 'B' },
  'rem-sync': { cpc: 1.80, tier: 'B' },
  'medical-triage': { cpc: 4.50, tier: 'A' },
  'impairment-bac': { cpc: 3.60, tier: 'A' },
  'structural-density': { cpc: 1.80, tier: 'B' },
  'hydraulic-integrity': { cpc: 1.10, tier: 'B' },
  'cessation-ladder': { cpc: 3.80, tier: 'A' },
  'max-load-capacity': { cpc: 1.50, tier: 'B' },
  'strength-efficiency': { cpc: 1.20, tier: 'B' },
  'heart-rate-zones': { cpc: 2.00, tier: 'B' },
  'kinetic-expenditure': { cpc: 1.50, tier: 'B' },
  'fuel-partition': { cpc: 2.20, tier: 'B' },
  'metabolic-incline': { cpc: 1.80, tier: 'B' },
  'ion-balance': { cpc: 2.00, tier: 'B' },
  'anabolic-trigger': { cpc: 2.50, tier: 'B' },
  'uv-exposure': { cpc: 1.60, tier: 'B' },
  'co2-cognitive-tax': { cpc: 1.40, tier: 'B' },
  'thermal-failure': { cpc: 1.00, tier: 'B' },
  'insulation-logic': { cpc: 0.80, tier: 'C' },

  'signal-to-noise': { cpc: 0.90, tier: 'C' },
  'task-switching': { cpc: 1.60, tier: 'B' },
  'decision-fatigue': { cpc: 1.20, tier: 'B' },
  'focus-horizon': { cpc: 1.80, tier: 'B' },
  'geo-arbitrage': { cpc: 5.00, tier: 'A' },
  'upskill-payback': { cpc: 3.60, tier: 'A' },
  'leak-detection': { cpc: 3.20, tier: 'A' },
  'connection-check': { cpc: 1.60, tier: 'B' },

  'reagent-recon': { cpc: 0.50, tier: 'R' },
  'reagent-dispense': { cpc: 0.60, tier: 'R' },
  'reagent-mcg-ratio': { cpc: 0.45, tier: 'R' },
  'transfer-loss': { cpc: 0.50, tier: 'R' },
  'titrate-vector': { cpc: 0.80, tier: 'R' },
  'reagent-inventory': { cpc: 0.40, tier: 'R' },
  'reagent-half-life': { cpc: 0.55, tier: 'R' },
  'reagent-purity': { cpc: 0.40, tier: 'R' },
  'reagent-stack': { cpc: 0.40, tier: 'R' },
  'salt-correction': { cpc: 0.35, tier: 'R' },
  'mass-retention-guard': { cpc: 0.90, tier: 'C' },
  'mass-trajectory': { cpc: 1.80, tier: 'B' },
  'vector-decay': { cpc: 0.30, tier: 'R' },
  'vendor-yield': { cpc: 0.45, tier: 'R' },
  'solubility-limit': { cpc: 0.30, tier: 'R' },
  'travel-planner': { cpc: 0.80, tier: 'C' },
};

export const TIER_WEIGHT: Record<CpcTier, number> = {
  S: 10,
  A: 6,
  B: 3,
  C: 1.5,
  D: 0.8,
  E: 0.3,
  R: 0.5,
};

export function cpcFor(id: string): number {
  return TOOL_CPC[id]?.cpc ?? 0.4;
}

export function tierFor(id: string): CpcTier {
  return TOOL_CPC[id]?.tier ?? 'D';
}

export function routingScore(id: string): number {
  const entry = TOOL_CPC[id];
  if (!entry) return 0.4;
  return entry.cpc * TIER_WEIGHT[entry.tier];
}

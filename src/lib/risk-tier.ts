// Cluster ID + risk_tier resolver — single source of truth for AdProvider,
// telemetry beacon, and any policy-sensitive logic.
//
// Cluster IDs locked by user:
//   10 = Finance (TIER_FULL) — Cash Corridor
//   20 = Health  (TIER_LTD)  — Contextual Shield
// Others (30–80) are provisional — adjust when user confirms taxonomy.

export type RiskTier = 'full' | 'ltd' | 'standard';

export interface ClusterInfo {
  cluster_id: string;
  risk_tier: RiskTier;
}

const FINANCE_TOOLS = new Set([
  'runway-zero',
  'shock-survival',
  'horizon-point',
  'crossover-calculator',
]);

export function resolveCluster(pathname: string): ClusterInfo {
  const path = pathname.replace(/\/+$/, '');

  // /health/* — LTD shield (Neutral Cut will rename to /health/reagent-*)
  if (path.startsWith('/health/') || path === '/health') {
    return { cluster_id: '20', risk_tier: 'ltd' };
  }

  // /decisions/* — Finance Cash Corridor
  if (path.startsWith('/decisions/')) {
    return { cluster_id: '10', risk_tier: 'full' };
  }

  // Specific finance tools that live in /calculators/ or elsewhere
  const slug = path.split('/').pop() ?? '';
  if (FINANCE_TOOLS.has(slug)) {
    return { cluster_id: '10', risk_tier: 'full' };
  }

  if (path.startsWith('/word-tools/')) return { cluster_id: '30', risk_tier: 'standard' };
  if (path.startsWith('/games/'))      return { cluster_id: '40', risk_tier: 'standard' };
  if (path.startsWith('/logic/'))      return { cluster_id: '50', risk_tier: 'standard' };
  if (path.startsWith('/guides/'))     return { cluster_id: '60', risk_tier: 'standard' };
  if (path.startsWith('/calculators/')) return { cluster_id: '70', risk_tier: 'full' };
  if (path.startsWith('/converters/')) return { cluster_id: '80', risk_tier: 'standard' };

  return { cluster_id: '00', risk_tier: 'standard' };
}

export function resolveToolId(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '');
  const parts = path.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const [section, slug] = parts;
  const validSections = new Set([
    'word-tools', 'games', 'calculators', 'converters',
    'health', 'logic', 'guides', 'decisions',
  ]);
  if (!validSections.has(section)) return null;
  return slug ?? null;
}

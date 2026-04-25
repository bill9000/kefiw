// Roof replacement cost engine. Pure TS, no I/O. All numbers are pre-tax,
// pre-financing and reflect typical mid-2026 South-region pricing as set by
// Eurocraft (Texas-licensed general contractor). Tunable in one place — every
// homelab page imports from here so the methodology stays consistent.
//
// Honesty principles baked in:
//   - We return a low/typical/high RANGE, never a single fake-precise number.
//   - Adjusters are multiplicative on labor unless noted; material $/sq is
//     a flat range that already brackets brand and grade variation.
//   - Pitch, stories, complexity stack — a steep + cut-up + 2-story roof
//     gets all three multipliers.

export const COST_ENGINE_VERSION = "2026.04";
export const COST_ENGINE_UPDATED = "2026-04-24";

// ---------------------------------------------------------------------------
// Material catalog — cost per ROOFING SQUARE (100 sqft of roof surface).
// Material cost only; labor lives in LABOR_PER_SQ.
// ---------------------------------------------------------------------------

export interface MaterialBand {
  id: string;
  label: string;
  /** Cost per square of material delivered. */
  matLowPerSq: number;
  matHighPerSq: number;
  /** Labor band per square — tile and metal need specialized crews. */
  laborLowPerSq: number;
  laborHighPerSq: number;
  /** Typical lifespan range in years — used in ROI guidance. */
  lifespanLow: number;
  lifespanHigh: number;
  /** True if this material commonly carries an HVHZ / wind-rated install premium. */
  windRatedPremium?: boolean;
}

export const MATERIALS: MaterialBand[] = [
  {
    id: "asphalt-3tab",
    label: "Asphalt — 3-tab",
    matLowPerSq: 85, matHighPerSq: 115,
    laborLowPerSq: 140, laborHighPerSq: 200,
    lifespanLow: 15, lifespanHigh: 20,
  },
  {
    id: "asphalt-architectural",
    label: "Asphalt — architectural / dimensional",
    matLowPerSq: 130, matHighPerSq: 185,
    laborLowPerSq: 180, laborHighPerSq: 260,
    lifespanLow: 25, lifespanHigh: 30,
  },
  {
    id: "asphalt-designer",
    label: "Asphalt — designer / luxury",
    matLowPerSq: 280, matHighPerSq: 420,
    laborLowPerSq: 220, laborHighPerSq: 320,
    lifespanLow: 30, lifespanHigh: 40,
  },
  {
    id: "metal-exposed",
    label: "Metal — corrugated / exposed fastener",
    matLowPerSq: 380, matHighPerSq: 620,
    laborLowPerSq: 320, laborHighPerSq: 460,
    lifespanLow: 30, lifespanHigh: 45,
  },
  {
    id: "metal-standing-seam",
    label: "Metal — standing seam",
    matLowPerSq: 700, matHighPerSq: 1100,
    laborLowPerSq: 420, laborHighPerSq: 620,
    lifespanLow: 40, lifespanHigh: 60,
    windRatedPremium: true,
  },
  {
    id: "tile-concrete",
    label: "Tile — concrete",
    matLowPerSq: 300, matHighPerSq: 500,
    laborLowPerSq: 480, laborHighPerSq: 720,
    lifespanLow: 40, lifespanHigh: 50,
  },
  {
    id: "tile-clay",
    label: "Tile — clay (Spanish / barrel)",
    matLowPerSq: 700, matHighPerSq: 1100,
    laborLowPerSq: 540, laborHighPerSq: 820,
    lifespanLow: 50, lifespanHigh: 75,
  },
];

export const MATERIAL_BY_ID: Record<string, MaterialBand> =
  Object.fromEntries(MATERIALS.map((m) => [m.id, m]));

// ---------------------------------------------------------------------------
// Pitch & geometry multipliers — applied to labor only. Material does not
// scale with pitch (you still buy the same shingles); labor does because
// steep roofs need harnessing, slower install, more waste.
// ---------------------------------------------------------------------------

export type PitchBand = "low" | "medium" | "high" | "very_high";

export const PITCH_LABOR_MULT: Record<PitchBand, { low: number; high: number; label: string }> = {
  low:       { low: 1.00, high: 1.05, label: "Low (3:12 – 6:12)" },
  medium:    { low: 1.10, high: 1.20, label: "Medium (7:12 – 9:12)" },
  high:      { low: 1.30, high: 1.50, label: "Steep (10:12 – 12:12)" },
  very_high: { low: 1.55, high: 1.85, label: "Very steep (>12:12)" },
};

export const STORY_LABOR_MULT: Record<1 | 2 | 3, { low: number; high: number; label: string }> = {
  1: { low: 1.00, high: 1.00, label: "1 story" },
  2: { low: 1.08, high: 1.15, label: "2 stories" },
  3: { low: 1.18, high: 1.30, label: "3+ stories" },
};

export type ComplexityBand = "simple_gable" | "standard_hip" | "complex" | "cut_up";

export const COMPLEXITY_LABOR_MULT: Record<ComplexityBand, { low: number; high: number; label: string }> = {
  simple_gable: { low: 0.95, high: 1.00, label: "Simple gable (few cuts, no dormers)" },
  standard_hip: { low: 1.00, high: 1.05, label: "Standard hip (typical suburban)" },
  complex:      { low: 1.10, high: 1.20, label: "Complex (multiple gables, dormers, valleys)" },
  cut_up:       { low: 1.25, high: 1.40, label: "Cut-up (heavy dormers + many penetrations)" },
};

// ---------------------------------------------------------------------------
// Tear-off and decking. Tear-off is per existing layer; decking replacement
// is sheet-based and often only known after tear-off exposes rotten wood.
// We model it as a probability-weighted add-on so the high-end of the range
// reflects "decking surprise."
// ---------------------------------------------------------------------------

export interface TearOffPricing {
  /** $ per square per existing layer removed. */
  perLayerLow: number;
  perLayerHigh: number;
}
export const TEAR_OFF: TearOffPricing = { perLayerLow: 95, perLayerHigh: 150 };

export type DeckingRisk = "none" | "low" | "medium" | "high";
export const DECKING_RISK_FACTOR: Record<DeckingRisk, { share: number; label: string }> = {
  none:   { share: 0.00, label: "None expected (recent prior tear-off)" },
  low:    { share: 0.05, label: "Low (newer home, no leaks reported)" },
  medium: { share: 0.15, label: "Medium (older roof, minor stains)" },
  high:   { share: 0.30, label: "High (visible sag, prior leaks, or 25+ year roof)" },
};
/** Cost to replace decking, per square foot of replacement area. */
export const DECKING_REPLACE_PER_SQFT_LOW = 1.40;
export const DECKING_REPLACE_PER_SQFT_HIGH = 2.20;

// ---------------------------------------------------------------------------
// Permits, penetrations, regional cost-of-living modifier.
// ---------------------------------------------------------------------------

export interface PermitProfile {
  id: string;
  label: string;
  permitLow: number;
  permitHigh: number;
}
export const PERMIT_PROFILES: PermitProfile[] = [
  { id: "houston_tx",    label: "Houston / Harris Co. TX", permitLow: 250, permitHigh: 600 },
  { id: "dallas_tx",     label: "Dallas / DFW TX",         permitLow: 300, permitHigh: 700 },
  { id: "austin_tx",     label: "Austin TX",               permitLow: 400, permitHigh: 900 },
  { id: "san_antonio_tx",label: "San Antonio TX",          permitLow: 200, permitHigh: 500 },
  { id: "atlanta_ga",    label: "Atlanta GA",              permitLow: 250, permitHigh: 650 },
  { id: "tampa_fl",      label: "Tampa / Orlando FL",      permitLow: 350, permitHigh: 850 },
  { id: "miami_fl",      label: "Miami FL (HVHZ)",         permitLow: 600, permitHigh: 1500 },
  { id: "charlotte_nc",  label: "Charlotte NC",            permitLow: 250, permitHigh: 600 },
  { id: "nashville_tn",  label: "Nashville TN",            permitLow: 250, permitHigh: 600 },
  { id: "other_south",   label: "Other South / unsure",    permitLow: 250, permitHigh: 800 },
];

export const PENETRATION_COST = { low: 60, high: 140 };

/** Regional cost multiplier vs Houston baseline. Applied to total. */
export const REGION_MULT: Record<string, { low: number; high: number; label: string }> = {
  houston_tx:     { low: 0.98, high: 1.02, label: "Houston" },
  dallas_tx:      { low: 0.98, high: 1.04, label: "Dallas / DFW" },
  austin_tx:      { low: 1.05, high: 1.12, label: "Austin" },
  san_antonio_tx: { low: 0.93, high: 0.99, label: "San Antonio" },
  atlanta_ga:     { low: 0.95, high: 1.02, label: "Atlanta" },
  tampa_fl:       { low: 1.00, high: 1.10, label: "Tampa / Orlando" },
  miami_fl:       { low: 1.10, high: 1.25, label: "Miami (HVHZ)" },
  charlotte_nc:   { low: 0.95, high: 1.02, label: "Charlotte" },
  nashville_tn:   { low: 0.95, high: 1.02, label: "Nashville" },
  other_south:    { low: 0.95, high: 1.10, label: "Other South" },
};

// ---------------------------------------------------------------------------
// Warranty level — a workmanship-warranty premium. Some installers charge
// 5–15% more for an extended workmanship guarantee; we surface that as a
// configurable adder so the calculator doesn't hide it.
// ---------------------------------------------------------------------------

export type WarrantyLevel = "basic" | "extended" | "platinum";
export const WARRANTY_PREMIUM: Record<WarrantyLevel, { mult: number; label: string }> = {
  basic:    { mult: 1.00, label: "Basic — manufacturer + 1-2yr workmanship" },
  extended: { mult: 1.06, label: "Extended — 10yr workmanship" },
  platinum: { mult: 1.12, label: "Platinum — manufacturer-backed system warranty" },
};

// ---------------------------------------------------------------------------
// Inputs the calculator collects.
// ---------------------------------------------------------------------------

export interface RoofInputs {
  /** Roof surface area in square feet (NOT home footprint — see helpers below). */
  roofSqft: number;
  materialId: string;
  pitch: PitchBand;
  stories: 1 | 2 | 3;
  complexity: ComplexityBand;
  /** Number of existing roof layers to remove (0 = decking-only or new build). */
  tearOffLayers: 0 | 1 | 2;
  deckingRisk: DeckingRisk;
  penetrations: number;
  permitProfileId: string;
  warranty: WarrantyLevel;
  /** True if homeowner believes insurance may pay (changes scope guidance, not price). */
  insurancePossible: boolean;
}

export interface RoofEstimate {
  inputsEcho: RoofInputs;
  squares: number; // roof area / 100
  material: { low: number; high: number; perSqLow: number; perSqHigh: number };
  labor:    { low: number; high: number; perSqLow: number; perSqHigh: number };
  tearOff:  { low: number; high: number };
  decking:  { low: number; high: number; expectedSqftLow: number; expectedSqftHigh: number };
  penetrations: { low: number; high: number };
  permit:   { low: number; high: number };
  warrantyAdd: { low: number; high: number };
  /** Pre-region subtotal — sum of category lows / highs. */
  subtotal: { low: number; high: number };
  /** After regional multiplier. This is the headline range. */
  total: { low: number; typical: number; high: number };
  perSqft: { low: number; typical: number; high: number };
  splits: {
    materialPctTypical: number;
    laborPctTypical: number;
    overheadPctTypical: number;
  };
}

// Helper: typical roof area from home square footage. Roof area > floor area
// because of pitch and overhangs. Multiplier varies with pitch.
export function roofAreaFromHomeSqft(homeSqft: number, pitch: PitchBand): number {
  const factor =
    pitch === "low"        ? 1.10 :
    pitch === "medium"     ? 1.20 :
    pitch === "high"       ? 1.35 :
                             1.55;
  return Math.round(homeSqft * factor);
}

// Mid-point of two numbers.
const mid = (a: number, b: number): number => (a + b) / 2;

export function estimateRoof(input: RoofInputs): RoofEstimate {
  const mat = MATERIAL_BY_ID[input.materialId];
  if (!mat) throw new Error(`Unknown material: ${input.materialId}`);
  const region = REGION_MULT[input.permitProfileId] ?? REGION_MULT.other_south;
  const permit = PERMIT_PROFILES.find((p) => p.id === input.permitProfileId)
              ?? PERMIT_PROFILES.find((p) => p.id === "other_south")!;

  const sq = input.roofSqft / 100;

  // Material — flat $/sq, no pitch scaling.
  const materialLow  = mat.matLowPerSq * sq;
  const materialHigh = mat.matHighPerSq * sq;

  // Labor stack: pitch × stories × complexity.
  const pm = PITCH_LABOR_MULT[input.pitch];
  const sm = STORY_LABOR_MULT[input.stories];
  const cm = COMPLEXITY_LABOR_MULT[input.complexity];
  const laborMultLow  = pm.low  * sm.low  * cm.low;
  const laborMultHigh = pm.high * sm.high * cm.high;
  const laborLow  = mat.laborLowPerSq  * sq * laborMultLow;
  const laborHigh = mat.laborHighPerSq * sq * laborMultHigh;

  // Tear-off scales with layers and roof area.
  const tearOffLow  = TEAR_OFF.perLayerLow  * sq * input.tearOffLayers;
  const tearOffHigh = TEAR_OFF.perLayerHigh * sq * input.tearOffLayers;

  // Decking surprise: probabilistic share of roof area * replacement $/sqft.
  const drf = DECKING_RISK_FACTOR[input.deckingRisk];
  const expectedSqftLow  = Math.round(input.roofSqft * drf.share * 0.5);
  const expectedSqftHigh = Math.round(input.roofSqft * drf.share * 1.0);
  const deckingLow  = expectedSqftLow  * DECKING_REPLACE_PER_SQFT_LOW;
  const deckingHigh = expectedSqftHigh * DECKING_REPLACE_PER_SQFT_HIGH;

  // Penetrations — flat per count.
  const penLow  = input.penetrations * PENETRATION_COST.low;
  const penHigh = input.penetrations * PENETRATION_COST.high;

  // Permit — flat range.
  const permitLow  = permit.permitLow;
  const permitHigh = permit.permitHigh;

  // Warranty premium — multiplier applied to subtotal ex-permit.
  const wmult = WARRANTY_PREMIUM[input.warranty].mult;

  const preWarrantyLow  = materialLow  + laborLow  + tearOffLow  + deckingLow  + penLow;
  const preWarrantyHigh = materialHigh + laborHigh + tearOffHigh + deckingHigh + penHigh;
  const warrantyAddLow  = preWarrantyLow  * (wmult - 1);
  const warrantyAddHigh = preWarrantyHigh * (wmult - 1);

  const subtotalLow  = preWarrantyLow  + warrantyAddLow  + permitLow;
  const subtotalHigh = preWarrantyHigh + warrantyAddHigh + permitHigh;

  const totalLow  = subtotalLow  * region.low;
  const totalHigh = subtotalHigh * region.high;
  const totalTypical = mid(totalLow, totalHigh);

  const perSqftLow  = totalLow  / input.roofSqft;
  const perSqftHigh = totalHigh / input.roofSqft;

  // Splits at the typical midpoint for the visual breakdown.
  const matMid = mid(materialLow, materialHigh);
  const labMid = mid(laborLow,    laborHigh);
  const overheadMid = mid(tearOffLow + deckingLow + penLow + permitLow + warrantyAddLow,
                          tearOffHigh + deckingHigh + penHigh + permitHigh + warrantyAddHigh);
  const totalMid = matMid + labMid + overheadMid || 1;

  return {
    inputsEcho: input,
    squares: sq,
    material: { low: materialLow, high: materialHigh, perSqLow: mat.matLowPerSq, perSqHigh: mat.matHighPerSq },
    labor:    { low: laborLow,    high: laborHigh,    perSqLow: mat.laborLowPerSq * laborMultLow, perSqHigh: mat.laborHighPerSq * laborMultHigh },
    tearOff:  { low: tearOffLow, high: tearOffHigh },
    decking:  { low: deckingLow, high: deckingHigh, expectedSqftLow, expectedSqftHigh },
    penetrations: { low: penLow, high: penHigh },
    permit:   { low: permitLow, high: permitHigh },
    warrantyAdd: { low: warrantyAddLow, high: warrantyAddHigh },
    subtotal: { low: subtotalLow, high: subtotalHigh },
    total:    { low: totalLow, typical: totalTypical, high: totalHigh },
    perSqft:  { low: perSqftLow, typical: mid(perSqftLow, perSqftHigh), high: perSqftHigh },
    splits: {
      materialPctTypical: matMid / totalMid,
      laborPctTypical:    labMid / totalMid,
      overheadPctTypical: overheadMid / totalMid,
    },
  };
}

// ---------------------------------------------------------------------------
// Financing helper — simple amortized payment for a typical home-improvement
// loan. Not a quote; informational. APR ranges sourced from typical 2026
// unsecured home-improvement loan rates (8% prime → ~10% strong borrower,
// ~16% average, ~22% subprime). Caller supplies APR; we return monthly
// payment and total interest.
// ---------------------------------------------------------------------------

export interface FinancingOutput {
  monthly: number;
  totalInterest: number;
  totalPaid: number;
}

export function financingPayment(principal: number, aprPct: number, months: number): FinancingOutput {
  if (principal <= 0 || months <= 0) {
    return { monthly: 0, totalInterest: 0, totalPaid: 0 };
  }
  const r = aprPct / 100 / 12;
  const monthly = r === 0
    ? principal / months
    : (principal * r) / (1 - Math.pow(1 + r, -months));
  const totalPaid = monthly * months;
  return { monthly, totalInterest: totalPaid - principal, totalPaid };
}

// ---------------------------------------------------------------------------
// "What changes the price" narrative — selected and sorted by which inputs
// produced the largest deltas vs. a baseline. Useful for the explanation
// panel under the result.
// ---------------------------------------------------------------------------

export interface PriceDriver {
  key: string;
  label: string;
  shareOfTotal: number; // 0..1 of typical total
  note: string;
}

export function priceDrivers(est: RoofEstimate): PriceDriver[] {
  const t = est.total.typical || 1;
  const matMid = mid(est.material.low, est.material.high);
  const labMid = mid(est.labor.low, est.labor.high);
  const tearMid = mid(est.tearOff.low, est.tearOff.high);
  const deckMid = mid(est.decking.low, est.decking.high);
  const penMid = mid(est.penetrations.low, est.penetrations.high);
  const permitMid = mid(est.permit.low, est.permit.high);
  const warMid = mid(est.warrantyAdd.low, est.warrantyAdd.high);

  const drivers: PriceDriver[] = [
    { key: "material", label: "Material", shareOfTotal: matMid / t,
      note: "Asphalt is cheapest by sqft; metal and tile move the total significantly." },
    { key: "labor", label: "Labor", shareOfTotal: labMid / t,
      note: "Steeper pitch, more stories, and cut-up roofs raise labor more than material." },
    { key: "tearOff", label: "Tear-off", shareOfTotal: tearMid / t,
      note: "Each existing layer adds dump fees and labor to remove cleanly." },
    { key: "decking", label: "Decking surprise", shareOfTotal: deckMid / t,
      note: "Rotten decking is rarely seen until tear-off. Older roofs lift this risk." },
    { key: "penetrations", label: "Penetrations & flashing", shareOfTotal: penMid / t,
      note: "Each chimney, skylight, and pipe boot adds flashing labor and material." },
    { key: "permit", label: "Permit & dump fees", shareOfTotal: permitMid / t,
      note: "Jurisdiction-dependent; coastal HVHZ codes raise this materially." },
    { key: "warranty", label: "Warranty premium", shareOfTotal: warMid / t,
      note: "Extended workmanship and manufacturer-system warranties cost 5–15% more." },
  ];
  return drivers
    .filter((d) => d.shareOfTotal > 0.005)
    .sort((a, b) => b.shareOfTotal - a.shareOfTotal);
}

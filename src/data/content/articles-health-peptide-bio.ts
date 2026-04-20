import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_HEALTH_PEPTIDE_BIO: ContentPageConfig[] = [
  // ============================================================
  // 1. TITRATE VECTOR
  // ============================================================
  {
    id: 'art-rx-what-is-titrate-vector',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-titrate-vector',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Titrate Vector Calculates — Weekly Administration Step-Up | Kefiw',
    h1: 'What Titrate Vector Calculates',
    subhead: 'Linear weekly step-up schedule for GLP-1 titration — no guesswork, no drift.',
    outcomeLine: 'Titrate Vector answers one question: what administration am I supposed to draw this week?',
    description: 'Titrate Vector runs the linear step-up schedule for semaglutide and tirzepatide. Deterministic administration-by-week output, U-100 unit conversion, no drift.',
    keywords: ['GLP-1 titration schedule', 'semaglutide escalation', 'tirzepatide step-up', 'weekly reagent administration', 'titration calculator'],
    intro: 'Clinical titration is linear step-up, not vibes. Current concentration {{lm:conc}} feeds the unit math — if reconstitution drifts, so does every administration on the schedule.',
    keyPoints: [
      'Formula: current_dose = start_dose + floor(weeks_elapsed / step_weeks) × increment. Concentration {{lm:conc}} converts mg → U-100 units where 1 unit = 0.01 mL.',
      'Semaglutide standard: 0.25 → 0.5 → 1.0 → 1.7 → 2.4 mg, 4 weeks per step, 16-week ramp.',
      'Tirzepatide standard: 2.5 → 5 → 7.5 → 10 → 12.5 → 15 mg, 4 weeks per step, 20-week ramp.',
      'Skip a step if tolerance fails — hold current administration an extra 4 weeks, do not drop back.',
      'Unit conversion is load-bearing: dose_units = (dose_mg / concentration_mg_per_ml) / 0.01.',
    ],
    examples: [
      { title: 'Semaglutide week 5 @ 2 mg/mL', body: 'weeks_elapsed = 5, step_weeks = 4, increment = 0.25 mg. current_dose = 0.25 + floor(5/4) × 0.25 = 0.50 mg. At 2 mg/mL: 0.25 mL = 25 units. Concentration {{lm:conc}}.' },
      { title: 'Tirzepatide week 9 @ 5 mg/mL', body: 'current_dose = 2.5 + floor(9/4) × 2.5 = 7.5 mg. At 5 mg/mL: 1.5 mL = 150 units — split across two injections if pen capacity caps at 100 units.' },
      { title: 'Semaglutide hold week 13', body: 'GI tolerance failed at 1.0 mg. Hold 4 more weeks, then step to 1.7 mg at week 17. Schedule shifts 4 weeks right, endpoint unchanged.' },
    ],
    whenToUse: [
      { toolId: 'titrate-vector', note: 'Before every weekly injection — confirm the administration matches the calendar.' },
    ],
    relatedIds: ['titrate-vector', 'reagent-dispense', 'reagent-inventory'],
    faq: [
      { q: 'Why 4-week steps and not 2?', a: 'GI adaptation (nausea, gastroparesis signals) needs ~3 weeks to stabilize. 4 weeks is the clinical floor used in STEP and SURMOUNT trials. Faster steps correlate with drop-out.' },
      { q: 'What if I miss an administration?', a: 'If under 2 days late, inject and resume schedule. If 3+ days late, skip and restart the week counter from the last confirmed administration. Do not double up.' },
      { q: 'Does the schedule change for compounded vs brand?', a: 'No — mg is mg. Concentration may differ (compounded often 5 mg/mL vs brand 2.27 mg/mL pen), so the unit-volume changes but the mg target does not.' },
    ],
    thresholds: {
      cyan: 'On-schedule administration, tolerance stable, concentration verified — execute.',
      gold: 'Step pending next week or mild GI — hold pattern, log symptoms.',
      magenta: 'Missed administrations, concentration drift, or severe GI — recompute from last confirmed injection.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'current_dose_mg = start_dose + floor(weeks_elapsed / step_weeks) × increment\ndose_volume_ml = current_dose_mg / concentration_mg_per_ml\ndose_units_U100 = dose_volume_ml / 0.01  // 1 unit = 0.01 mL\nif current_dose_mg > target_dose_mg → clamp to target_dose_mg',
    },
    logicalGates: [
      'Confirm last injection date and administration. No guessing from memory.',
      'Count weeks_elapsed from protocol start, not calendar weeks.',
      'Apply step formula — floor, not round.',
      'Convert mg → mL → U-100 units using verified concentration {{lm:conc}}.',
      'If tolerance failed last step, hold not advance. Log the hold week.',
    ],
    liveMetrics: [
      { token: 'conc', metric: 'reagent_concentration_mg_ml', fallback: 'no concentration set', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-dispense', note: 'Unit math unclear. Lock the U-100 conversion before injecting.' },
      stable: { toolId: 'mass-trajectory', note: 'Schedule locked. Track actual loss against clinical curve.' },
      fallback: { toolId: 'reagent-inventory', note: 'Confirm vial runway covers the full ramp.' },
    },
  },

  // ============================================================
  // 2. REAGENT INVENTORY
  // ============================================================
  {
    id: 'art-rx-what-is-reagent-inventory',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-reagent-inventory',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Reagent Inventory Calculates — Administrations & Reorder Window | Kefiw',
    h1: 'What Reagent Inventory Calculates',
    subhead: 'Administrations remaining, empty date, and reorder trigger — no running out mid-titration.',
    outcomeLine: 'Reagent Inventory answers one question: when does this vial stack go empty, and when must I reorder?',
    description: 'Reagent Inventory forecasts administrations remaining, empty date, and reorder trigger based on vial mass, administration, interval, and vendor lead time. U-100 unit math baked in.',
    keywords: ['reagent vial tracking', 'GLP-1 reorder calculator', 'semaglutide inventory', 'reagent empty date', 'vendor lead time'],
    intro: 'Running out mid-titration is a protocol failure. Current waste rate {{lm:waste}} shrinks the buffer — every draw-down error moves the empty date left.',
    keyPoints: [
      'Formula: doses_remaining = floor(total_mg / dose_mg); days_remaining = doses_remaining × injection_interval_days. Waste {{lm:waste}} compounds the drain.',
      'Reorder trigger: empty_date − lead_time_days − safety_buffer. Default buffer 7 days.',
      'U-100 math: volume_remaining_mL × concentration_mg_mL = mass_remaining_mg. 1 unit = 0.01 mL.',
      'Count partial administrations honestly — dead-volume residue below the stopper does not make the next administration.',
      'Stack multiple reagents? Compute each separately; the stack empty_date = min(empty_date) across reagents.',
    ],
    examples: [
      { title: '10 mg vial, 0.5 mg weekly', body: 'doses_remaining = floor(10 / 0.5) = 20. days_remaining = 20 × 7 = 140. Lead time 14 days + 7 safety = reorder 21 days before empty. Waste {{lm:waste}}.' },
      { title: '5 mg vial, 2.5 mg weekly', body: 'doses_remaining = 2. days_remaining = 14. Order the replacement before drawing the first administration — no buffer.' },
      { title: 'Tirzepatide stack, 15 mg + 5 mg pen at 7.5 mg/wk', body: 'Combined 20 mg ÷ 7.5 = 2 full administrations + 5 mg residue. days_remaining = 14. Next vial must arrive day 7.' },
    ],
    whenToUse: [
      { toolId: 'reagent-inventory', note: 'Every week at injection — log remaining volume, confirm empty date.' },
    ],
    relatedIds: ['reagent-inventory', 'titrate-vector', 'vendor-yield'],
    faq: [
      { q: 'What about degraded potency — does the vial still count full?', a: 'No. Run Vector Decay first. If retained potency is 85%, effective mass = total_mg × 0.85. The empty date moves left accordingly.' },
      { q: 'How do I handle dead volume?', a: 'Subtract 0.02 mL per vial from usable volume. On 3 mL vials at 2 mg/mL, that is ~0.04 mg lost — one extra administration every ~25 vials.' },
    ],
    thresholds: {
      cyan: 'Empty date beyond reorder window + buffer — inventory healthy.',
      gold: 'Within lead-time window — order now, do not wait.',
      magenta: 'Inside safety buffer or past empty — titration interrupt imminent.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'doses_remaining = floor(total_mg / dose_mg)\ndays_remaining = doses_remaining × injection_interval_days\nempty_date = today + days_remaining\nreorder_date = empty_date − lead_time_days − safety_buffer_days\nvolume_remaining_mL × concentration_mg_mL = mass_remaining_mg  // U-100: 1 unit = 0.01 mL',
    },
    logicalGates: [
      'Measure volume_remaining by drawing to the next graduation — not by eyeball.',
      'Multiply by verified concentration to get mass_remaining_mg.',
      'Divide by dose_mg, floor — partial administration does not count.',
      'Compute empty_date and reorder_date. Log both.',
      'If reorder_date ≤ today, place the order before the next injection.',
    ],
    liveMetrics: [
      { token: 'waste', metric: 'reagent_waste_pct', fallback: 'no waste logged', decimals: 1, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'vendor-yield', note: 'Empty window close. Compare vendors on cost-per-administration before emergency reorder.' },
      stable: { toolId: 'titrate-vector', note: 'Inventory covers the ramp. Confirm next administration step.' },
      fallback: { toolId: 'travel-planner', note: 'Trip coming up? Pre-allocate vials for transit.' },
    },
  },

  // ============================================================
  // 3. VENDOR YIELD
  // ============================================================
  {
    id: 'art-rx-what-is-vendor-yield',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-vendor-yield',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Vendor Yield Calculates — Cost Per Microgram & Administration | Kefiw',
    h1: 'What Vendor Yield Calculates',
    subhead: 'Cost per microgram and cost per administration across vendors — price discipline for reagent purchasing.',
    outcomeLine: 'Vendor Yield answers one question: which vendor gives me the lowest cost-per-administration after shipping?',
    description: 'Vendor Yield computes cost per microgram ((price + shipping) / mass_mcg) and cost per administration. Ranks vendors ascending. U-100 unit math ready.',
    keywords: ['reagent vendor cost comparison', 'cost per administration reagent', 'semaglutide vendor ranking', 'tirzepatide price per mg', 'reagent shipping cost math'],
    intro: 'Sticker price lies. Current waste {{lm:waste}} means every $ per mg is already discounted — the vendor with the cheapest mg may deliver the most expensive effective administration.',
    keyPoints: [
      'Formula: cost_per_mcg = (price + shipping) / (mass_mg × 1000); cost_per_dose = cost_per_mcg × dose_mcg. Current waste {{lm:waste}} inflates effective cost.',
      'Rank vendors ascending by cost-per-administration. Shipping is not free — bake it in.',
      'Adjust for purity and reagent-content-factor: effective_mg = label_mg × purity × content_factor.',
      'U-100 administration conversion: dose_mcg = dose_mg × 1000; injection volume still follows 1 unit = 0.01 mL.',
      'Minimum-order discounts flatter cost-per-mg but bloat inventory. Run Reagent Inventory against the bulk empty_date before committing.',
    ],
    examples: [
      { title: '10 mg @ $80 + $12 ship vs 5 mg @ $45 + $8 ship', body: 'Vendor A: $92 / 10000 mcg = $0.0092/mcg. Vendor B: $53 / 5000 mcg = $0.0106/mcg. A wins by 13%.' },
      { title: 'Purity-corrected comparison', body: 'Vendor C 10 mg @ $70 + $10 ship, 92% purity = 9.2 effective mg. $80 / 9200 = $0.0087/mcg. Beats both A and B.' },
      { title: '500 mcg administration comparison', body: 'At $0.0087/mcg: cost_per_dose = 500 × $0.0087 = $4.35. At $0.0106/mcg: $5.30. Over a 16-week titration: ~$15 gap.' },
    ],
    whenToUse: [
      { toolId: 'vendor-yield', note: 'Before every reorder — vendors rotate prices weekly.' },
    ],
    relatedIds: ['vendor-yield', 'reagent-inventory', 'reagent-purity'],
    faq: [
      { q: 'Should I factor in test-kit cost?', a: 'Yes. Third-party testing ($15-30 per kit) is a fixed cost per vendor trial. Amortize over expected purchase volume — first order shows high cost, subsequent orders dilute it.' },
      { q: 'What about bacteriostatic water separately?', a: 'If bundled, include in total. If separate, add to shipping. A vendor cheaper on mg but missing BAC water may cost more once reconstitution supplies are priced in.' },
    ],
    thresholds: {
      cyan: 'Cost-per-administration in bottom tercile across 3+ verified vendors — procure.',
      gold: 'Middle tercile — acceptable if lead time or purity beats cheaper options.',
      magenta: 'Top tercile — only justified by test data or shipping speed emergency.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'cost_per_mcg = (price_usd + shipping_usd) / (mass_mg × 1000)\neffective_mass_mg = label_mg × purity_pct × content_factor_pct\ncost_per_effective_mcg = (price + shipping) / (effective_mass_mg × 1000)\ncost_per_dose_usd = cost_per_effective_mcg × dose_mcg\n// U-100 conversion unchanged: 1 unit = 0.01 mL',
    },
    logicalGates: [
      'Collect price, shipping, mass_mg, purity_pct for each vendor. No estimation.',
      'Compute cost_per_mcg — raw, then purity-corrected.',
      'Multiply by dose_mcg for cost-per-administration.',
      'Rank ascending. Apply tie-breaks: lead time, test history, payment friction.',
      'Verify empty_date from Reagent Inventory before bulk discount trigger.',
    ],
    liveMetrics: [
      { token: 'waste', metric: 'reagent_waste_pct', fallback: 'no waste logged', decimals: 1, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'transfer-loss', note: 'Cost-per-administration high? Waste may be the driver, not vendor price.' },
      stable: { toolId: 'reagent-inventory', note: 'Vendor ranked. Confirm reorder volume matches empty_date.' },
      fallback: { toolId: 'travel-planner', note: 'Travel incoming? Vendor choice may depend on shipping address.' },
    },
  },

  // ============================================================
  // 4. TRAVEL PLANNER
  // ============================================================
  {
    id: 'art-rx-what-is-travel-planner',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-travel-planner',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Travel Planner Calculates — Reagent Transit Load | Kefiw',
    h1: 'What Travel Planner Calculates',
    subhead: 'Administrations, total mass, and vial count for a trip — per-reagent and stack-aggregate.',
    outcomeLine: 'Travel Planner answers one question: how many vials and how much mass do I pack for N days away?',
    description: 'Travel Planner computes administrations, mass, and vial count per reagent and across the full stack for any trip length. U-100 volume math covers syringe packing.',
    keywords: ['reagent travel calculator', 'transit administration', 'reagent trip packing', 'reagent travel vials', 'reagent transit planner'],
    intro: 'Travel is where protocols break. Concentration {{lm:conc}} drives the vial count — underpack and the schedule collapses; overpack and customs questions multiply.',
    keyPoints: [
      'Formula per reagent: administrations = ceil(trip_days / interval_days); total_mg = administrations × administration_mg. Concentration {{lm:conc}} converts mg to mL for TSA liquid rules.',
      'Aggregate: stack_total_mg = sum(reagent_total_mg). Vial count = ceil(stack_total_mg / vial_mass_mg) per reagent, not summed.',
      'U-100 unit count: total_units = (total_mg / concentration_mg_mL) / 0.01. Pack syringes to match, plus 20% spares.',
      'Cold chain: 48-hour ambient window for reconstituted vials in most climates — plan refrigeration at destination.',
      'Customs: carry prescription or research-use paperwork; vials in original labeled packaging.',
    ],
    examples: [
      { title: '10-day trip, reagent-A 0.5 mg weekly', body: 'administrations = ceil(10/7) = 2. total_mg = 1 mg. At 2 mg/mL: 0.5 mL = 50 units across 2 injections. Single 5 mg vial covers it. Concentration {{lm:conc}}.' },
      { title: '21-day trip, stack: reagent-A 1 mg/wk + reagent-B 250 mcg/day', body: 'Reagent-A: administrations=3, mass=3 mg. Reagent-B: administrations=21, mass=5.25 mg. Two vials minimum — one per reagent.' },
      { title: '45-day trip, reagent-C 10 mg weekly', body: 'administrations = ceil(45/7) = 7. total_mg = 70 mg. Across 10 mg vials: 7 vials. At 5 mg/mL: 14 mL total, 1400 units.' },
    ],
    whenToUse: [
      { toolId: 'travel-planner', note: '7 days before departure — gives time to reorder if vial count short.' },
    ],
    relatedIds: ['travel-planner', 'reagent-inventory', 'solubility-limit'],
    faq: [
      { q: 'Do I reconstitute before travel or on arrival?', a: 'Lyophilized vials survive ambient transit better. Reconstitute on arrival unless the trip starts mid-administration cycle — then the current vial travels reconstituted in insulated cold pack.' },
      { q: 'What about flying with syringes?', a: 'U-100 insulin syringes are TSA-permitted with prescription labeling. Pack in carry-on; checked baggage freezes on long-haul.' },
    ],
    thresholds: {
      cyan: 'Vial count confirmed with 20% syringe buffer, cold chain planned — clear to pack.',
      gold: 'Tight on spares or cold chain uncertain — add one vial, add ice pack.',
      magenta: 'Insufficient vials, no cold chain at destination — delay trip or interrupt protocol.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'doses_per_peptide = ceil(trip_days / interval_days)\ntotal_mg_per_peptide = doses × dose_mg\nvials_per_peptide = ceil(total_mg / vial_mass_mg)\ntotal_volume_mL = total_mg / concentration_mg_mL\ntotal_units_U100 = total_volume_mL / 0.01  // 1 unit = 0.01 mL\nsyringe_count = ceil(doses × 1.2)  // 20% spare',
    },
    logicalGates: [
      'Confirm trip_days including travel days, not just destination days.',
      'Per reagent: compute administrations, mass, vial count separately.',
      'Sum vials across reagents — aggregate mass does not share vials.',
      'Verify U-100 unit count and pack syringes with 20% spares.',
      'Plan cold chain: insulated pack out, refrigeration confirmed at destination.',
    ],
    liveMetrics: [
      { token: 'conc', metric: 'reagent_concentration_mg_ml', fallback: 'no concentration set', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-inventory', note: 'Vial shortfall for trip. Reorder before departure window closes.' },
      stable: { toolId: 'solubility-limit', note: 'Concentration fine? Verify solubility at travel temperature.' },
      fallback: { toolId: 'reagent-stack', note: 'Multi-reagent travel — verify stack compatibility at new injection rhythm.' },
    },
  },

  // ============================================================
  // 5. REAGENT HALF-LIFE (HDS-1)
  // ============================================================
  {
    id: 'art-rx-what-is-reagent-half-life',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-reagent-half-life',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Reagent Half-Life Calculates — Exponential Decay & Steady State | Kefiw',
    h1: 'What Reagent Half-Life Calculates',
    subhead: 'Per-administration decay, stacked residuals, and steady-state plateau — deterministic PK math.',
    outcomeLine: 'Reagent Half-Life answers one question: how much active reagent is in circulation right now, given the injection history?',
    description: 'Reagent Half-Life runs N(t) = N0 × 0.5^(t/h) per administration, sums across prior injections, and resolves steady-state at ~4.3 half-lives. Client-side JS, 2-decimal precision.',
    keywords: ['reagent half-life calculator', 'semaglutide decay', 'tirzepatide steady state', 'reagent pharmacokinetics', 'exponential decay reagent'],
    intro: 'Single-administration math is easy; stacking is where intuition fails. Concentration {{lm:conc}} feeds the administration amount, but the residual curve is the real state variable.',
    keyPoints: [
      'Formula: N(t) = N₀ × 0.5^(t/h) per administration. Total circulating = sum across all prior administrations. Concentration {{lm:conc}} sets N₀ per injection.',
      'Steady state reached at ~4.3 half-lives when interval ≤ half-life. Semaglutide (h ≈ 165 hr / 7 days): steady state ~4 weeks.',
      'If interval > half-life, no steady state — each administration peaks then decays alone. Short-half-life reagents (BPC-157 ~4 hr) act this way on daily protocols.',
      'Client-side JS; 2-decimal precision. No server round-trip.',
      'Missed administration impact: residual from prior administrations covers ~1.5× the current interval before a true trough. Delay 2 weeks on semaglutide = real gap.',
    ],
    examples: [
      { title: 'Semaglutide week 4, 1 mg weekly, h = 7 days', body: 'N(t) per administration at t=7d = 0.50 mg. Administration 1 remnant at week 4 = 1 × 0.5^4 = 0.06 mg. Sum across 4 administrations ≈ 1.88 mg circulating — approaching steady state.' },
      { title: 'BPC-157 daily 250 mcg, h = 4 hr', body: 'N(t) at t=24h = 250 × 0.5^6 ≈ 3.9 mcg residual. Steady state = 4.3 × 4h = 17 hr, well within daily cycle. Effectively single-administration behavior.' },
      { title: 'Tirzepatide missed week 3, h = 120 hr / 5 days', body: 'Scheduled 5 mg. At 14 days post-last-administration: residual = 5 × 0.5^(14/5) = 0.72 mg. Less than 15% of administration — real gap.' },
    ],
    whenToUse: [
      { toolId: 'reagent-half-life', note: 'After any missed or delayed administration — confirm current residual before resuming schedule.' },
    ],
    relatedIds: ['reagent-half-life', 'reagent-stack', 'titrate-vector'],
    faq: [
      { q: 'Why 4.3 half-lives for steady state?', a: '2^4.3 ≈ 20, meaning residual from the first administration is ~5% — clinically negligible. 4-5 half-lives is the standard PK convention.' },
      { q: 'Does this model absorption or just elimination?', a: 'Elimination only. Absorption (Tmax ~1-3 days for semaglutide) is a separate curve. For weekly reagents the absorption tail blurs into the elimination start — the decay approximation is clinically adequate.' },
      { q: 'What half-life do I enter for tirzepatide?', a: 'Mean 116-120 hours (~5 days). Variance is person-dependent ±20%. If you have your own data, use it; otherwise 120 is the accepted midpoint.' },
    ],
    thresholds: {
      cyan: 'Residual curve at steady state, interval ≤ half-life — protocol predictable.',
      gold: 'Approaching steady state (weeks 2-3) or missed one administration — recompute before next injection.',
      magenta: 'Interval > half-life or 2+ missed administrations — residual insufficient, restart titration from last confirmed level.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'N(t) = N₀ × 0.5^(t / h)\ntotal_circulating = Σ Nᵢ × 0.5^((t − tᵢ) / h)  // sum across all prior doses\nsteady_state ≈ 4.3 × h  // when injection_interval ≤ h\n// client-side JS; 2-decimal precision',
    },
    logicalGates: [
      'Enter reagent half-life h (hours). Use 165h semaglutide, 120h tirzepatide, 4h BPC-157.',
      'Log every prior administration with timestamp — no approximations.',
      'Compute N(t) per administration, sum across administration history.',
      'Compare interval to h; if interval > h, single-administration behavior applies.',
      'If 2+ administrations missed, residual < 10% — treat as restart, not continuation.',
    ],
    liveMetrics: [
      { token: 'conc', metric: 'reagent_concentration_mg_ml', fallback: 'no concentration set', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'titrate-vector', note: 'Residual gap detected. Restart titration from last confirmed stable administration.' },
      stable: { toolId: 'reagent-dispense', note: 'PK stable. Confirm U-100 unit conversion for next administration.' },
      fallback: { toolId: 'mass-retention-guard', note: 'PK is fine; check whether body composition is tracking.' },
    },
  },

  // ============================================================
  // 6. MASS RETENTION GUARD (SAR-1)
  // ============================================================
  {
    id: 'art-rx-what-is-mass-retention-guard',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-mass-retention-guard',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Mass Retention Guard Calculates — Lean Mass Loss Ratio | Kefiw',
    h1: 'What Mass Retention Guard Calculates',
    subhead: 'Lean-mass-to-total-loss ratio — catches muscle bleeding before the scale celebrates it.',
    outcomeLine: 'Mass Retention Guard answers one question: of the weight I lost, how much was muscle I did not mean to lose?',
    description: 'Mass Retention Guard computes lean_ratio_pct = (lean_loss / total_loss) × 100 from DEXA or bioimpedance deltas. Critical >= 25% — triggers ULH-01 Magenta flag.',
    keywords: ['lean-mass loss GLP-1', 'lean mass loss reagent', 'muscle loss semaglutide', 'lean ratio calculator', 'tirzepatide muscle preservation'],
    intro: 'Scale weight drops; the composition underneath is where the story lives. Lean ratio {{lm:lean}} separates fat loss from muscle bleed — clinical GLP-1 trials report 25-40% lean loss as baseline.',
    keyPoints: [
      'Formula: lean_ratio_pct = ((lean_before − lean_after) / (weight_before − weight_after)) × 100. Current ratio {{lm:lean}}.',
      'Critical >= 25% — writes mass_retention_critical flag → ULH-01 Magenta pulse.',
      'Protein floor: 1.6-2.2 g/kg target body weight. Below 1.2 g/kg on GLP-1 and lean loss accelerates.',
      'Resistance training twice weekly minimum — hypertrophy stimulus preserves motor unit recruitment.',
      'DEXA > bioimpedance for accuracy; BIA acceptable if same device, same hydration state, same time of day.',
    ],
    examples: [
      { title: 'Healthy cut: −10 kg total, −1.5 kg lean', body: 'lean_ratio = (1.5 / 10) × 100 = 15%. Below clinical baseline — protocol working, protein and training adequate.' },
      { title: 'Alarm: −8 kg total, −2.4 kg lean', body: 'lean_ratio = 30%. Above critical threshold. Flag set, ULH-01 Magenta pulses. Increase protein, add resistance day, recheck in 4 weeks.' },
      { title: 'Plateau edge: −5 kg total, −1.25 kg lean', body: 'lean_ratio = 25%. Exact threshold. Flag fires; treat as critical until next measurement disproves.' },
    ],
    whenToUse: [
      { toolId: 'mass-retention-guard', note: 'Every 8 weeks during active titration — DEXA or calibrated BIA.' },
    ],
    relatedIds: ['mass-retention-guard', 'mass-trajectory', 'metabolic-floor'],
    faq: [
      { q: 'What if my lean measurement includes water shifts?', a: 'GLP-1 causes initial water loss — first 4 weeks artificially inflate lean drop. Baseline the measurement after week 4, not at start.' },
      { q: 'Is 15% lean loss okay?', a: 'Below 20% is acceptable on any cut, GLP-1 or not. Under 10% is excellent and usually indicates adequate protein + resistance training.' },
      { q: 'Can reagents like BPC-157 or retatrutide change the ratio?', a: 'Retatrutide trial data suggests better lean preservation than semaglutide; BPC-157 has no direct body-composition evidence. Do not assume protection without measurement.' },
    ],
    thresholds: {
      cyan: 'Lean ratio < 20% — fat-dominant loss, protocol stable.',
      gold: 'Lean ratio 20-24% — borderline, audit protein intake and training load.',
      magenta: 'Lean ratio >= 25% — critical, lean-mass loss flag set, adjust inputs before next titration step.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'total_loss_kg = weight_before_kg − weight_after_kg\nlean_loss_kg = lean_before_kg − lean_after_kg\nlean_ratio_pct = (lean_loss_kg / total_loss_kg) × 100\nif lean_ratio_pct >= 25 → mass_retention_critical = true  // ULH-01 Magenta\n// U-100 unchanged for dose unit conversions: 1 unit = 0.01 mL',
    },
    logicalGates: [
      'Confirm two measurements at least 8 weeks apart, same method, same conditions.',
      'Compute total_loss and lean_loss in kg. No mixed units.',
      'Divide lean_loss by total_loss, × 100.',
      'If ratio >= 25, write mass_retention_critical flag — ULH-01 pulses Magenta.',
      'Before next titration step: audit protein g/kg, resistance training frequency, deficit size.',
    ],
    liveMetrics: [
      { token: 'lean', metric: 'mass_loss_pct', fallback: 'no lean ratio set', decimals: 1, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'metabolic-floor', note: 'Lean mass bleeding — check the floor. Deficit may be below safe metabolic floor.' },
      stable: { toolId: 'mass-trajectory', note: 'Composition intact. Track actual loss against clinical curve.' },
      fallback: { toolId: 'fuel-partition', note: 'Audit macro split. Low protein is usually the upstream cause.' },
    },
  },

  // ============================================================
  // 7. MASS TRAJECTORY
  // ============================================================
  {
    id: 'art-rx-what-is-mass-trajectory',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-mass-trajectory',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Mass Trajectory Calculates — STEP & SURMOUNT Curves | Kefiw',
    h1: 'What Mass Trajectory Calculates',
    subhead: 'Your actual weight-loss curve vs STEP (semaglutide) and SURMOUNT (tirzepatide) clinical trial baselines.',
    outcomeLine: 'Mass Trajectory answers one question: am I tracking clinical expectation, ahead of it, or falling behind?',
    description: 'Mass Trajectory linearly interpolates STEP (sema 15% by w68) and SURMOUNT (tirz 20% by w72) curves. Delta_pct = actual − expected. Flags lag and runaway loss.',
    keywords: ['STEP trial weight loss', 'SURMOUNT trial curve', 'semaglutide expected loss', 'tirzepatide weight trajectory', 'GLP-1 weight curve comparison'],
    intro: 'Clinical trials are the baseline, not a promise. Lean ratio {{lm:lean}} governs whether loss is clean; trajectory governs whether it is on pace.',
    keyPoints: [
      'Formula: expected_loss_pct = linear_interp(clinical_curve, weeks_elapsed); delta = actual_loss_pct − expected_loss_pct. Lean ratio {{lm:lean}} pairs with trajectory.',
      'STEP (semaglutide 2.4 mg): 15% body-weight loss by week 68.',
      'SURMOUNT (tirzepatide 15 mg): 20% body-weight loss by week 72.',
      'Delta > +3% (ahead): audit deficit — runaway loss risks lean bleed.',
      'Delta < −3% (behind): audit adherence, titration, and protein. 25% of trial participants are non-responders.',
    ],
    examples: [
      { title: 'Semaglutide week 20, actual −6.2% from baseline', body: 'STEP curve at week 20 ≈ 6.4%. delta = −0.2% — on track. Continue protocol.' },
      { title: 'Tirzepatide week 36, actual −14.0%', body: 'SURMOUNT at w36 ≈ 13.0%. delta = +1.0% — slightly ahead, within tolerance.' },
      { title: 'Semaglutide week 40, actual −4.5%', body: 'STEP at w40 ≈ 11.2%. delta = −6.7% — material lag. Audit injection adherence and administration confirmation.' },
    ],
    whenToUse: [
      { toolId: 'mass-trajectory', note: 'Every 4 weeks — log weight, compute delta against trial curve.' },
    ],
    relatedIds: ['mass-trajectory', 'titrate-vector', 'mass-retention-guard'],
    faq: [
      { q: 'What if I started below BMI 30?', a: 'Trial populations were BMI 30+. Lower starting BMI typically loses less total percent — expect 60-80% of trial curve. Adjust expectations, do not abandon comparison.' },
      { q: 'Linear interpolation seems crude — why not nonlinear?', a: 'STEP and SURMOUNT curves are near-linear from week 8 to week 60. Pre-week-8 is steeper (titration ramp-in); post-week-60 is flattening (plateau). Linear is clinically adequate within the middle range.' },
    ],
    thresholds: {
      cyan: '|delta| within ±3% — tracking clinical expectation, protocol stable.',
      gold: 'delta between ±3% and ±6% — monitor closely, audit inputs.',
      magenta: '|delta| > 6% — material divergence, either runaway loss or non-response. Recompute inputs.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'expected_loss_pct = linear_interp(clinical_curve, weeks_elapsed)\n// STEP (sema 2.4 mg): 15% at week 68\n// SURMOUNT (tirz 15 mg): 20% at week 72\nactual_loss_pct = (weight_start_kg − weight_now_kg) / weight_start_kg × 100\ndelta_pct = actual_loss_pct − expected_loss_pct\n// U-100 dose unchanged: 1 unit = 0.01 mL',
    },
    logicalGates: [
      'Confirm weight_start from protocol day 0, not a later reweigh.',
      'Log weight_now same conditions: morning, post-void, pre-meal.',
      'Compute actual_loss_pct; linear_interp clinical curve at weeks_elapsed.',
      'Subtract → delta_pct. Classify into cyan/gold/magenta band.',
      'If magenta, run Mass Retention Guard and Titrate Vector before adjusting administration.',
    ],
    liveMetrics: [
      { token: 'lean', metric: 'mass_loss_pct', fallback: 'no lean ratio set', decimals: 1, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'mass-retention-guard', note: 'Runaway loss or non-response. Check composition before touching titration.' },
      stable: { toolId: 'titrate-vector', note: 'Trajectory clean. Confirm next step on schedule.' },
      fallback: { toolId: 'metabolic-floor', note: 'Lag detected? Deficit may be under-powered or over-powered.' },
    },
  },

  // ============================================================
  // 8. VECTOR DECAY (DEG-1)
  // ============================================================
  {
    id: 'art-rx-what-is-vector-decay',
    kind: 'guide',
    section: 'guides',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    slug: 'what-is-vector-decay',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Vector Decay Calculates — Arrhenius Thermal Decay | Kefiw',
    h1: 'What Vector Decay Calculates',
    subhead: 'Retained potency after thermal exposure — Arrhenius-style decay, lyophilized vs reconstituted rates.',
    outcomeLine: 'Vector Decay answers one question: after N hours at temperature X, how much active reagent survives?',
    description: 'Vector Decay runs simplified Arrhenius potency_pct = 100 × exp(−k × hours). Per-temperature rate constants. Reconstituted decays 10× faster. Critical < 85% potency.',
    keywords: ['reagent decay calculator', 'semaglutide thermal decay', 'reagent storage potency', 'reconstituted reagent shelf life', 'Arrhenius reagent'],
    intro: 'A vial above fridge temperature is losing potency every hour. Current retained potency {{lm:potency}} — below 85% means every downstream calc (inventory, titration, vendor yield) is wrong by the same margin.',
    keyPoints: [
      'Formula: potency_pct = 100 × exp(−k × hours). Current {{lm:potency}}. Client-side JS; 2-decimal precision.',
      'Rate constants (k per hour, lyophilized): Fridge 0.0002 | Room 0.002 | Warm 0.008 | Hot 0.025.',
      'Reconstituted = 10× faster decay — solvent accelerates hydrolysis and aggregation.',
      'Critical < 85% potency — writes vector_decay_critical flag → ULH-01 Magenta pulse.',
      'Cold chain logging: record timestamp in/out of fridge for every exposure. Cumulative hours drive the model.',
    ],
    examples: [
      { title: 'Lyophilized, 24h at room temperature', body: 'k = 0.002/hr. potency = 100 × exp(−0.002 × 24) = 95.31%. Acceptable — re-fridge, no action.' },
      { title: 'Reconstituted, 72h at fridge + 6h warm transit', body: 'k_fridge reconstituted = 0.002, k_warm reconstituted = 0.08. potency = 100 × exp(−(0.002×72 + 0.08×6)) = 100 × exp(−0.624) = 53.59%. Far below 85%. Flag fires.' },
      { title: 'Lyophilized, 48h hot car', body: 'k_hot = 0.025/hr. potency = 100 × exp(−0.025 × 48) = 30.12%. Discard — administration math on this vial is garbage.' },
    ],
    whenToUse: [
      { toolId: 'vector-decay', note: 'After any cold-chain break — transit, power outage, forgotten on counter.' },
    ],
    relatedIds: ['vector-decay', 'reagent-recon', 'reagent-inventory'],
    faq: [
      { q: 'Is this calibrated to semaglutide specifically?', a: 'The rate constants are a simplified mid-range applicable to most therapeutic reagents. Semaglutide-specific stability data from Novo Nordisk supports the lyophilized-fridge rate; reconstituted and elevated temps extrapolate Arrhenius behavior. Treat as an estimate, not FDA-grade.' },
      { q: 'Why 85% as the critical threshold?', a: 'Clinical PK tolerance is ±15% for administration-response consistency. Below 85% retained potency, the effective administration drifts outside the therapeutic band — titration math silently fails.' },
      { q: 'Does freezing protect better than fridge?', a: 'For lyophilized yes; for reconstituted no — freeze-thaw cycles aggregate reagent chains and destroy more potency than steady fridge storage. Never freeze reconstituted vials.' },
    ],
    thresholds: {
      cyan: 'Retained potency >= 95% — protocol math valid, no adjustment.',
      gold: '85-94% — usable but note the drift; consider mass adjustment for inventory.',
      magenta: 'Below 85% — critical, vector_decay_critical flag set, discard or discount vial.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'potency_pct = 100 × exp(−k × hours)\n// Lyophilized k/hr:  Fridge 0.0002 | Room 0.002 | Warm 0.008 | Hot 0.025\n// Reconstituted: multiply k by 10\ncumulative_exposure = Σ (kᵢ × hoursᵢ)  // across all temperature segments\nif potency_pct < 85 → vector_decay_critical = true  // ULH-01 Magenta\n// U-100 conversion unchanged: 1 unit = 0.01 mL (on effective_mass)\n// client-side JS; 2-decimal precision',
    },
    logicalGates: [
      'Log every temperature exposure segment with hours. No gaps.',
      'Select k per segment: lyophilized base × 10 if reconstituted.',
      'Sum k × hours across segments → cumulative exposure.',
      'Compute potency_pct = 100 × exp(−cumulative).',
      'If potency < 85, write vector_decay_critical flag — ULH-01 pulses Magenta. Discard or discount effective mass.',
    ],
    liveMetrics: [
      { token: 'potency', metric: 'reagent_potency_pct', fallback: 'no potency logged', decimals: 1, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-inventory', note: 'Potency shot — plan replacement. Empty date just moved left.' },
      stable: { toolId: 'reagent-recon', note: 'Vial intact. Verify reconstitution concentration for next draw.' },
      fallback: { toolId: 'travel-planner', note: 'Cold-chain risk ahead? Plan insulated transport.' },
    },
  },
];

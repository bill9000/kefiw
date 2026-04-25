import type { ContentPageConfig } from '../content-pages';

export const ARTICLES_HEALTH_PEPTIDE_PREP: ContentPageConfig[] = [
  // ============================================================
  // PRC-1 — REAGENT RECONSTITUTION
  // ============================================================
  {
    id: 'art-rx-what-is-reagent-recon',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-reagent-recon',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Reagent Reconstitution Calculates — mg/mL Concentration | Kefiw',
    h1: 'What Reagent Reconstitution Calculates',
    subhead: 'The working concentration of a lyophilized vial after bacteriostatic water is added.',
    outcomeLine: 'PRC-1 answers one question: after reconstitution, how many mg of reagent sit in every mL — and every U-100 unit?',
    description: 'PRC-1 reconstitutes a lyophilized vial: concentration = vial mass / BAC water volume. Converts to U-100 units per mg for insulin-syringe administration.',
    keywords: ['reagent reconstitution calculator', 'bac water ratio', 'mg per ml reagent', 'u-100 units per mg', 'lyophilized vial math'],
    intro: 'A vial labeled "5 mg" is not an administration — it is a mass sitting dry. Add water and the concentration depends entirely on how much. Current working concentration: {{lm:concentration}}. Every downstream calculation (units, μg, administration volume) fails if this number is wrong.',
    keyPoints: [
      'Formula: concentration_mg_ml = vial_mass_mg / bac_volume_ml. Working value: {{lm:concentration}}.',
      'U-100 relation: 1 unit = 0.01 mL. So units_per_mg = 100 / concentration_mg_ml.',
      'BAC water volume is the operator choice, not the vial label. 5 mg reagent + 2 mL water = 2.5 mg/mL; same vial + 5 mL water = 1 mg/mL.',
      'Precision matters to 2 decimals. 2.50 mg/mL vs 2.47 mg/mL is a 1.2% administration error that compounds across a vial.',
      'Pipe this concentration to Reagent Units (DSE-1) and MCG-per-Unit (CNV-1). Do not re-derive downstream.',
    ],
    examples: [
      { title: '5 mg reagent-A + 2 mL BAC', body: 'concentration = 5 / 2 = 2.50 mg/mL. units_per_mg = 100 / 2.50 = 40 units/mg. A 0.25 mg administration = 10 units on a U-100 syringe.' },
      { title: '10 mg reagent-C + 4 mL BAC', body: 'concentration = 10 / 4 = 2.50 mg/mL. Same ratio, larger total volume — 40 administrations of 0.25 mg instead of 20.' },
      { title: '5 mg reagent-E + 5 mL BAC', body: 'concentration = 1.00 mg/mL. 500 μg administration = 0.5 mL = 50 units. Clean decimal, low math risk.' },
    ],
    whenToUse: [
      { toolId: 'reagent-recon', note: 'Run immediately after adding BAC water to a new vial. Log concentration to the vial label.' },
    ],
    relatedIds: ['reagent-recon', 'reagent-dispense', 'reagent-μg-ratio'],
    faq: [
      { q: 'Does the reagent mass itself add volume?', a: 'No — lyophilized reagent mass is negligible relative to BAC volume at the scales used. Treat BAC volume as total solution volume.' },
      { q: 'What if the vendor vial is under-filled?', a: 'Vendor mass is assumed label-accurate. Run Reagent Purity (MPF-1) if you suspect under-fill — it reweights effective administration without re-reconstituting.' },
      { q: 'Can I re-dilute a reconstituted vial?', a: 'Yes, but track total volume carefully. Adding 1 mL to a 2 mL 2.5 mg/mL vial gives 5 mg / 3 mL = 1.67 mg/mL. Update the label.' },
    ],
    thresholds: {
      cyan: 'Concentration matches operator target within 2% — administration pipeline clean.',
      gold: 'Concentration within 5% of target — acceptable but re-verify BAC volume.',
      magenta: 'Concentration off by >5% or undefined — do not administer; reconstitute again.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'concentration_mg_ml = vial_mass_mg / bac_volume_ml\nunits_per_mg = 100 / concentration_mg_ml    // U-100: 1 unit = 0.01 mL\ndose_volume_ml = dose_mg / concentration_mg_ml\ndose_units = dose_volume_ml × 100\nprecision: 2 decimals',
    },
    logicalGates: [
      'Confirm vial mass from vendor COA. Do not trust eyeballed label alone.',
      'Measure BAC water volume with calibrated syringe, not vial lines.',
      'Compute concentration_mg_ml = vial_mass / bac_volume to 2 decimals.',
      'Derive units_per_mg = 100 / concentration. Record both numbers on the vial.',
      'Pipe concentration forward to DSE-1 and CNV-1. Never re-derive manually.',
    ],
    liveMetrics: [
      { token: 'concentration', metric: 'reagent_concentration_mg_ml', fallback: 'no recon yet', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'mass-retention-guard', note: 'Concentration anchored — pivot to lean-mass guardrails before titrating higher.' },
      stable: { toolId: 'reagent-dispense', note: 'Concentration locked. Convert target administration to U-100 units.' },
      fallback: { toolId: 'reagent-μg-ratio', note: 'Operator prefers μg thinking? Route to MCG-per-Unit for the conversion.' },
    },
  },

  // ============================================================
  // STK-1 — REAGENT STACK
  // ============================================================
  {
    id: 'art-rx-what-is-reagent-stack',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-reagent-stack',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Reagent Stack Calculates — Two-Compound Shared Vial | Kefiw',
    h1: 'What Reagent Stack Calculates',
    subhead: 'Combined concentration when two reagents share one BAC-water volume.',
    outcomeLine: 'STK-1 answers one question: for two reagents in one vial, what mg of each lands in every draw?',
    description: 'STK-1 computes concentration for two reagents reconstituted in a shared vial. Each draw delivers proportional mass of A and B based on individual mg/mL.',
    keywords: ['reagent stack calculator', 'dual reagent reconstitution', 'combined reagent vial', 'co-reconstitution math', 'stack concentration'],
    intro: 'Stacking two reagents in one vial halves your injection count but doubles the math surface. Current working concentration: {{lm:concentration}}. One draw now delivers two mass payloads; if either concentration is wrong, both administrations are wrong.',
    keyPoints: [
      'Formulas: concA = M₁ / V, concB = M₂ / V. One draw of V_draw delivers (V_draw × concA) mg of A and (V_draw × concB) mg of B.',
      'U-100 convention still applies: 1 unit = 0.01 mL. Total volume drives units, not individual mass.',
      'Shared vial means you cannot titrate A without also moving B. Lock the ratio before reconstituting. Working conc: {{lm:concentration}}.',
      'Sum of masses cannot exceed solubility maximum for the weaker solvent compound. Run SOL-1 first.',
      'Dead space in syringe wastes both reagents simultaneously. Log loss per draw on both sides.',
    ],
    examples: [
      { title: 'Reagent-E 5 mg + Reagent-F 5 mg / 5 mL BAC', body: 'concA = 1.00 mg/mL, concB = 1.00 mg/mL. 0.25 mL draw = 0.25 mg of each. 25 units on U-100.' },
      { title: 'Reagent-A 5 mg + Reagent-D 10 mg / 4 mL BAC', body: 'concA = 1.25 mg/mL, concB = 2.50 mg/mL. 0.20 mL draw = 0.25 mg A + 0.50 mg D. 20 units delivers the fixed stack ratio.' },
      { title: 'Reagent-G 2 mg + Reagent-H 5 mg / 3 mL BAC', body: 'concA = 0.67 mg/mL, concB = 1.67 mg/mL. 0.30 mL = 0.20 mg + 0.50 mg. 30 units, 2.5:1 mass ratio locked in.' },
    ],
    whenToUse: [
      { toolId: 'reagent-stack', note: 'Run before any dual-compound reconstitution. Confirm ratio is fixed and solubility limits are not exceeded.' },
    ],
    relatedIds: ['reagent-stack', 'reagent-recon', 'solubility-limit'],
    faq: [
      { q: 'Can I stack three reagents?', a: 'Math extends to N compounds: concN = MN / V. Practical limits are solubility sum and stability interactions, not the arithmetic.' },
      { q: 'What if I want to change the ratio mid-vial?', a: 'You cannot. Shared volume fixes the ratio. Either finish the vial or reconstitute separately. Plan the stack before adding BAC.' },
      { q: 'Does co-reconstitution affect reagent stability?', a: 'Some pairs degrade faster together (e.g. aggregation-prone compounds). The math is unaffected; shelf-life is. Treat stacked vials as shorter-lived.' },
    ],
    thresholds: {
      cyan: 'Both concentrations within target and sum under solubility limit — stack operational.',
      gold: 'Ratio or concentrations drift slightly — verify against COA before next draw.',
      magenta: 'Sum exceeds solubility or ratio unclear — discard and re-reconstitute separately.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'concA_mg_ml = massA_mg / bac_volume_ml\nconcB_mg_ml = massB_mg / bac_volume_ml\ndraw_A_mg = draw_volume_ml × concA\ndraw_B_mg = draw_volume_ml × concB\ndraw_units = draw_volume_ml × 100    // U-100: 1 unit = 0.01 mL',
    },
    logicalGates: [
      'Confirm both vendor COAs for mass A and mass B.',
      'Verify combined mass fits solubility maximum of the weaker compound (run SOL-1).',
      'Reconstitute both compounds in a single measured BAC volume.',
      'Compute concA and concB independently. Label vial with both numbers.',
      'For each draw, derive (draw_mg_A, draw_mg_B, draw_units) from draw_volume_ml.',
    ],
    liveMetrics: [
      { token: 'concentration', metric: 'reagent_concentration_mg_ml', fallback: 'no recon yet', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'transfer-loss', note: 'Stacking doubles the cost of dead space. Quantify leakage before committing to a stacked vial.' },
      stable: { toolId: 'reagent-dispense', note: 'Stack locked. Convert target draw to U-100 units for the insulin syringe.' },
      fallback: { toolId: 'solubility-limit', note: 'Solubility budget unclear — run SOL-1 before reconstituting the stack.' },
    },
  },

  // ============================================================
  // SCF-1 — SALT CORRECTION FACTOR
  // ============================================================
  {
    id: 'art-rx-what-is-salt-correction',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-salt-correction',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Salt Correction Calculates — TFA and Acetate Adjusted Mass | Kefiw',
    h1: 'What Salt Correction Calculates',
    subhead: 'Actual reagent mass after stripping counter-ion weight from the labeled vial mass.',
    outcomeLine: 'SCF-1 answers one question: of the "5 mg" on the label, how many mg are reagent and how many are salt?',
    description: 'SCF-1 applies the reagent content percentage to labeled mass. TFA salts typically 76%, acetate 89%. Actual mass drives concentration, not label.',
    keywords: ['tfa salt correction', 'acetate salt reagent', 'net reagent mass', 'reagent content percentage', 'salt-adjusted administration'],
    intro: 'Labeled vial mass is total weight — reagent plus counter-ion. TFA salt forms drop real reagent content to ~76%; acetate to ~89%. Current working concentration: {{lm:concentration}}. Skip this correction and every downstream administration is silently under-delivered.',
    keyPoints: [
      'Formula: actual_mass_mg = label_mass_mg × (reagent_content_pct / 100).',
      'TFA (trifluoroacetate) salt: typical content 76% — label 5 mg → actual 3.80 mg reagent.',
      'Acetate salt: typical content 89% — label 5 mg → actual 4.45 mg reagent.',
      'Free base (no salt): 100% — rare outside research-grade material. Verify on COA.',
      'Corrected mass feeds PRC-1 reconstitution. Using label mass overstates concentration and under-delivers the patient.',
    ],
    examples: [
      { title: '5 mg label, TFA salt (76%)', body: 'actual_mass = 5 × 0.76 = 3.80 mg. Reconstituted in 2 mL → 1.90 mg/mL (not 2.50). 0.25 mg "administration" is actually 0.19 mg.' },
      { title: '10 mg label, acetate salt (89%)', body: 'actual_mass = 10 × 0.89 = 8.90 mg. In 4 mL → 2.23 mg/mL. An 11% administration gap if uncorrected.' },
      { title: '5 mg label, free base (100%)', body: 'actual_mass = 5.00 mg. No correction needed — but confirm on COA. Vendors sometimes mislabel salt form.' },
    ],
    whenToUse: [
      { toolId: 'salt-correction', note: 'Run before PRC-1 on any vial whose COA lists a TFA or acetate salt form.' },
    ],
    relatedIds: ['salt-correction', 'reagent-recon', 'reagent-purity'],
    faq: [
      { q: 'Where do I find reagent content percentage?', a: 'Vendor COA, usually listed as "reagent content" or "net reagent". If absent, assume TFA 76% for research chemicals — better to under-deliver than over-deliver by a salt factor.' },
      { q: 'Does the salt form affect bioactivity?', a: 'Not at typical scales. The correction is purely mass accounting — the reagent molecule itself behaves identically once in solution.' },
      { q: 'What if COA shows 82% content?', a: 'Use the exact number: actual_mass = label × 0.82. Do not round to 76% or 89%. COA is authoritative.' },
    ],
    thresholds: {
      cyan: 'Reagent content ≥ 85% and matches COA — correction applied, ready for PRC-1.',
      gold: 'Content 70–85% — common TFA range, verify COA before reconstituting.',
      magenta: 'Content < 70% or unknown — do not administer; return vial or demand updated COA.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'actual_mass_mg = label_mass_mg × (peptide_content_pct / 100)\n// Feed actual_mass_mg into PRC-1 as vial_mass_mg.\n// U-100 relation still holds: 1 unit = 0.01 mL of reconstituted solution.\n// TFA salts ≈ 76%, Acetate ≈ 89%, Free base = 100%.',
    },
    logicalGates: [
      'Read COA for salt form and reagent content percentage.',
      'If content absent and salt is TFA, assume 76% as conservative default.',
      'Compute actual_mass = label_mass × (pct / 100) to 2 decimals.',
      'Substitute actual_mass into PRC-1 as the vial_mass_mg input.',
      'Log both label_mass and actual_mass on the vial; dispense from actual only.',
    ],
    liveMetrics: [
      { token: 'concentration', metric: 'reagent_concentration_mg_ml', fallback: 'no recon yet', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-recon', note: 'Mass corrected — immediately pipe actual_mass into PRC-1 for true concentration.' },
      stable: { toolId: 'reagent-dispense', note: 'Corrected concentration clean — convert administration to U-100 units.' },
      fallback: { toolId: 'reagent-purity', note: 'Purity also suspect? Stack MPF-1 on top of salt correction.' },
    },
  },

  // ============================================================
  // SOL-1 — SOLUBILITY LIMIT
  // ============================================================
  {
    id: 'art-rx-what-is-solubility-limit',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-solubility-limit',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Solubility Limit Calculates — Sludge Risk by mg/mL | Kefiw',
    h1: 'What Solubility Limit Calculates',
    subhead: 'Whether the planned concentration stays below the reagent\'s BAC-water solubility maximum.',
    outcomeLine: 'SOL-1 answers one question: will this reagent fully dissolve in this volume, or sludge at the bottom of the vial?',
    description: 'SOL-1 compares planned concentration against reagent-specific solubility maximum (reagent-A ~10, reagent-C ~20 mg/mL). Sludge means uneven administration.',
    keywords: ['reagent solubility limit', 'bac water solubility', 'reagent sludge', 'reagent solubility', 'reagent dissolution'],
    intro: 'Reagents dissolve up to a hard maximum — beyond that, solid sits in the vial and draws deliver unpredictable mass. Current working concentration: {{lm:concentration}}. SOL-1 catches the problem before reconstitution, not after you draw a clump.',
    keyPoints: [
      'Formula: concentration_mg_ml = mass / volume. Compare to reagent-specific maximum.',
      'Typical maxima: reagent-A ~10 mg/mL, reagent-B ~10, reagent-C ~20, reagent-D ~20, reagent-E ~20.',
      'If concentration > limit, reagent partially precipitates. Draws become lottery tickets on mass.',
      'Low volumes (< 1 mL BAC per 10 mg) run highest sludge risk. Scale BAC up first, potency check later.',
      'Once sludged, heating and gentle inversion sometimes recover the solution; precipitate that persists means discard.',
    ],
    examples: [
      { title: '10 mg reagent-A / 0.5 mL BAC', body: 'conc = 20 mg/mL vs limit ~10. Sludge risk HIGH. Double BAC to 1 mL → 10 mg/mL, right at limit.' },
      { title: '10 mg reagent-C / 1 mL BAC', body: 'conc = 10 mg/mL vs limit ~20. Well within margin. Full dissolution expected at room temp.' },
      { title: '20 mg reagent-D / 2 mL BAC', body: 'conc = 10 mg/mL vs limit ~20. Dissolves clean. Headroom available for a stacked compound if compatible.' },
    ],
    whenToUse: [
      { toolId: 'solubility-limit', note: 'Run before PRC-1 any time planned concentration approaches published maxima — especially with stacked vials.' },
    ],
    relatedIds: ['solubility-limit', 'reagent-recon', 'reagent-stack'],
    faq: [
      { q: 'Where do solubility maxima come from?', a: 'Vendor COA is primary source. Published literature secondary. If neither exists, start at 2 mg/mL and observe — most research reagents clear that bar easily.' },
      { q: 'Does BAC vs plain water matter?', a: 'BAC (0.9% benzyl alcohol) has marginally lower solubility ceiling than plain sterile water for some reagents. Use the BAC number when specified.' },
      { q: 'Can I add more BAC later if it sludges?', a: 'Yes — dilution works. Recompute concentration in PRC-1 and relabel the vial. Do not administer until fully dissolved.' },
    ],
    thresholds: {
      cyan: 'Concentration below 60% of solubility limit — full dissolution, stable draws.',
      gold: 'Concentration 60–90% of limit — monitor for sludge; use fresh BAC and gentle swirl.',
      magenta: 'Concentration ≥ 100% of limit — do not reconstitute; add more BAC first.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'concentration_mg_ml = mass_mg / bac_volume_ml\nlimit_mg_ml = peptide_solubility_max    // vendor COA or literature\nif concentration > limit → SLUDGE RISK → add BAC\nif concentration > 0.9 × limit → GUARDED\nelse → STABLE',
    },
    logicalGates: [
      'Look up reagent solubility maximum on vendor COA.',
      'Compute planned concentration = mass / BAC volume.',
      'Compare concentration to limit. Add BAC if concentration > limit.',
      'For stacks, sum both reagent concentrations against the weaker compound\'s limit.',
      'Re-verify with visual inspection: clear solution = pass; any cloudiness = fail.',
    ],
    liveMetrics: [
      { token: 'concentration', metric: 'reagent_concentration_mg_ml', fallback: 'no recon yet', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-recon', note: 'Add BAC to drop concentration below limit — then re-run PRC-1 with new volume.' },
      stable: { toolId: 'reagent-stack', note: 'Headroom available — you can add a second compound if compatibility allows.' },
      fallback: { toolId: 'reagent-purity', note: 'Concentration looks right but sludge appeared? Mass may be overstated — run MPF-1.' },
    },
  },

  // ============================================================
  // DSE-1 — REAGENT DISPENSE
  // ============================================================
  {
    id: 'art-rx-what-is-reagent-dispense',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-reagent-dispense',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Reagent Dispense Calculates — Administration mg to U-100 Units | Kefiw',
    h1: 'What Reagent Dispense Calculates',
    subhead: 'The U-100 insulin-syringe unit count that delivers a target mg administration at a given concentration.',
    outcomeLine: 'DSE-1 answers one question: how many units on the U-100 syringe deliver this mg administration at this concentration?',
    description: 'DSE-1 converts a mg administration to U-100 units via volume_ml = dose_mg / concentration_mg_ml, then units = volume × 100. Verifies against syringe capacity.',
    keywords: ['reagent administration units', 'u-100 insulin syringe conversion', 'mg to units reagent', 'reagent-A unit calculator', 'reagent-B administration'],
    intro: 'Reagent administrations are prescribed in mg but drawn in units. A U-100 syringe holds 100 units in 1 mL — period. Current working concentration: {{lm:conc}}. Get the conversion wrong and you either cap out the syringe mid-draw or deliver a fractional administration.',
    keyPoints: [
      'Formula: volume_ml = dose_mg / concentration_mg_ml, then units = volume_ml × 100.',
      'U-100 syringe capacity = 100 units = 1 mL. If computed units > 100, administration cannot fit in one draw.',
      'Concentration pipes from PRC-1. Do not re-derive. Working value: {{lm:conc}}.',
      'Round to whole units; U-100 syringes graduate by 1 unit (0.01 mL) — sub-unit precision is measurement noise.',
      'If administration exceeds syringe, your concentration is too low — reconstitute stronger, do not split draws.',
    ],
    examples: [
      { title: '0.25 mg reagent-A at 2.50 mg/mL', body: 'volume = 0.25 / 2.50 = 0.10 mL. units = 0.10 × 100 = 10 units. Fits easily on U-100.' },
      { title: '2.5 mg reagent-B at 5.00 mg/mL', body: 'volume = 2.5 / 5.00 = 0.50 mL. units = 50. Half-syringe draw.' },
      { title: '1.5 mg at 1.00 mg/mL — overflow case', body: 'volume = 1.50 mL = 150 units. Exceeds U-100 capacity. Reconstitute at 3.0 mg/mL instead → 50 units fits.' },
    ],
    whenToUse: [
      { toolId: 'reagent-dispense', note: 'Run after every PRC-1 reconstitution and whenever administration target changes.' },
    ],
    relatedIds: ['reagent-dispense', 'reagent-recon', 'reagent-μg-ratio'],
    faq: [
      { q: 'What about U-40 or U-500 syringes?', a: 'DSE-1 assumes U-100 convention (1 unit = 0.01 mL). Other syringe scales change the multiplier — do not use this tool with non-U-100 hardware.' },
      { q: 'Can I draw fractional units?', a: 'The smallest reliable graduation on a U-100 insulin syringe is 1 unit. Fractional draws are guesswork; adjust concentration or administration to land on whole units.' },
      { q: 'Why does the tool flag "exceeds syringe"?', a: 'Because splitting administrations across two draws doubles dead-space loss and multiplies measurement error. Reconstituting stronger is the correct fix.' },
    ],
    thresholds: {
      cyan: 'Administration lands at 5–80 units — clean draw, low error.',
      gold: 'Administration lands at 80–100 units or below 5 — near syringe limits or fractional-unit territory.',
      magenta: 'Administration exceeds 100 units — reconstitute stronger; split-draw is not an option.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'volume_ml = dose_mg / concentration_mg_ml\nunits = volume_ml × 100          // U-100: 1 unit = 0.01 mL\nif units > 100 → OVERFLOW → reconstitute stronger\nsyringe_capacity = 100 units = 1 mL',
    },
    logicalGates: [
      'Pull concentration_mg_ml from PRC-1 output. Do not re-measure.',
      'Compute volume_ml = dose_mg / concentration to 3 decimals.',
      'Multiply volume_ml × 100 to get units. Round to nearest whole unit.',
      'If units > 100, flag OVERFLOW and return operator to PRC-1 for stronger reconstitution.',
      'Record units on administration-log next to date and vial ID.',
    ],
    liveMetrics: [
      { token: 'conc', metric: 'reagent_concentration_mg_ml', fallback: 'no recon yet', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-recon', note: 'Administration exceeds syringe — reconstitute stronger. Return to PRC-1 with lower BAC volume.' },
      stable: { toolId: 'reagent-μg-ratio', note: 'Units computed clean. Cross-check with μg-per-unit for operator sanity.' },
      fallback: { toolId: 'titrate-vector', note: 'Units look right but administration target is unclear? Run TIT-1 to set the escalation schedule.' },
    },
  },

  // ============================================================
  // CNV-1 — REAGENT MCG RATIO
  // ============================================================
  {
    id: 'art-rx-what-is-reagent-μg-ratio',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-reagent-μg-ratio',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Reagent MCG Ratio Calculates — Concentration to Micrograms | Kefiw',
    h1: 'What Reagent MCG Ratio Calculates',
    subhead: 'The micrograms of reagent delivered by a single U-100 insulin-syringe unit.',
    outcomeLine: 'CNV-1 answers one question: at this concentration, how many μg of reagent are in each U-100 unit?',
    description: 'CNV-1 converts concentration to μg per unit: μg_per_unit = concentration × 10. U-100 convention means 1 unit = 0.01 mL.',
    keywords: ['μg per unit reagent', 'u-100 μg conversion', 'reagent administration in micrograms', 'insulin syringe μg', 'reagent unit conversion'],
    intro: 'Receptor-agonist administration thinks in mg; short-peptide healing reagents think in μg. Same U-100 syringe, different mental unit. Current working concentration: {{lm:concentration}}. CNV-1 converts once and locks the operator into a consistent scale.',
    keyPoints: [
      'Formula: μg_per_unit = (concentration_mg_ml × 1000) / 100 = concentration × 10.',
      'U-100 convention: 1 unit = 0.01 mL. 1 mg = 1000 μg. Clean decimal collapse.',
      'Working concentration {{lm:concentration}} drives the multiplier directly — no secondary lookup needed.',
      'Typical use: Reagent-E, Reagent-F, Reagent-G, Reagent-H, Reagent-I — administered in 100–500 μg ranges.',
      'Pipe output back to DSE-1 as a sanity check: target_μg ÷ μg_per_unit should match DSE-1 units output.',
    ],
    examples: [
      { title: 'Concentration 1.00 mg/mL', body: 'μg_per_unit = 1.00 × 10 = 10 μg/unit. 250 μg administration = 25 units. Clean decimal.' },
      { title: 'Concentration 2.50 mg/mL', body: 'μg_per_unit = 2.50 × 10 = 25 μg/unit. 500 μg administration = 20 units. Low draw volume, minimal waste.' },
      { title: 'Concentration 0.50 mg/mL', body: 'μg_per_unit = 0.50 × 10 = 5 μg/unit. 100 μg administration = 20 units. Dilute but still within U-100.' },
    ],
    whenToUse: [
      { toolId: 'reagent-μg-ratio', note: 'Run alongside PRC-1 for any reagent prescribed in μg rather than mg.' },
    ],
    relatedIds: ['reagent-μg-ratio', 'reagent-dispense', 'reagent-recon'],
    faq: [
      { q: 'Why multiply by 10?', a: 'Because (mg/mL × 1000 μg/mg) × (0.01 mL/unit) = mg/mL × 10. The 100 cancels from the 1000/100 collapse.' },
      { q: 'Does this work for any syringe?', a: 'Only U-100. Other scales (U-40, U-500) break the × 10 shortcut. This tool assumes U-100 throughout.' },
      { q: 'Should I think in μg or units when administering?', a: 'Whichever the reagent is prescribed in. CNV-1 lets you translate in either direction without recomputing from concentration each time.' },
    ],
    thresholds: {
      cyan: 'μg_per_unit lands 5–50 — typical short-peptide healing range, clean administration.',
      gold: 'μg_per_unit < 5 or > 50 — dilute or concentrated edge; verify draw volume.',
      magenta: 'μg_per_unit undefined or mismatched with DSE-1 output — stop; re-verify concentration.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'μg_per_unit = (concentration_mg_ml × 1000) / 100\n             = concentration_mg_ml × 10\n// U-100 convention: 1 unit = 0.01 mL, 1 mg = 1000 μg\n// Sanity check: target_μg ÷ μg_per_unit == DSE-1 units output',
    },
    logicalGates: [
      'Pull concentration_mg_ml from PRC-1. Do not re-derive.',
      'Multiply × 10 to get μg_per_unit.',
      'Cross-check against DSE-1: target_μg ÷ μg_per_unit should equal DSE-1 units.',
      'If cross-check fails, stop — concentration upstream is inconsistent.',
      'Record μg_per_unit on vial label next to mg/mL concentration.',
    ],
    liveMetrics: [
      { token: 'concentration', metric: 'reagent_concentration_mg_ml', fallback: 'no recon yet', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-dispense', note: 'μg_per_unit set — cross-verify against DSE-1 units output before administering.' },
      stable: { toolId: 'reagent-recon', note: 'μg clean — return to PRC-1 if concentration needs adjustment.' },
      fallback: { toolId: 'titrate-vector', note: 'Unit scale clear but schedule unclear? Run TIT-1 for the escalation path.' },
    },
  },

  // ============================================================
  // SDS-1 — TRANSFER LOSS / DEAD SPACE
  // ============================================================
  {
    id: 'art-rx-what-is-transfer-loss',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-transfer-loss',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Transfer Loss Calculates — Dead Space Leakage | Kefiw',
    h1: 'What Transfer Loss Calculates',
    subhead: 'The reagent mass lost per draw to syringe dead space and the annualized dollar cost.',
    outcomeLine: 'SDS-1 answers one question: how much reagent evaporates into dead space per draw, and what does it cost per year?',
    description: 'SDS-1 computes dead-space waste: waste_mg = dead_space_ml × concentration. Aggregates to annual vial cost and flags magenta when leakage exceeds budget.',
    keywords: ['syringe dead space waste', 'reagent leakage cost', 'insulin syringe hub waste', 'reagent vial economics', 'annual reagent cost'],
    intro: 'Every syringe has dead space — the volume in the hub and needle that never enters the body. Across a year of daily administrations that volume compounds into a second vial of lost reagent. Current annual waste: {{lm:waste}}. SDS-1 prices that leak.',
    keyPoints: [
      'Formula: waste_mg_per_draw = dead_space_ml × concentration_mg_ml.',
      'Annual waste: waste_mg_per_draw × draws_per_year. Convert to cost via $/mg from vial price.',
      'Low dead-space (LDS) insulin syringes cut hub loss by 60–80% vs standard. Measurable ROI at any daily administration.',
      'Current leak profile: {{lm:waste}}. Magenta trip when annual waste > 8% of vial budget.',
      'Higher concentration amplifies dead-space cost per draw. Same dead_space_ml × 5 mg/mL > × 1 mg/mL.',
    ],
    examples: [
      { title: 'Standard syringe, 0.07 mL dead space, 2.50 mg/mL, 52 draws/yr', body: 'waste_per_draw = 0.07 × 2.50 = 0.175 mg. Annual = 9.1 mg. At $40/mg, that is $364/yr — often a full vial.' },
      { title: 'LDS syringe, 0.02 mL dead space, 2.50 mg/mL, 52 draws/yr', body: 'waste = 0.02 × 2.50 = 0.05 mg/draw. Annual = 2.6 mg. At $40/mg → $104/yr. $260 saved for a $5 syringe upgrade.' },
      { title: 'Daily administration, 0.07 mL dead space, 5.00 mg/mL, 365 draws', body: 'waste = 0.35 mg/draw × 365 = 127.75 mg/yr. At $40/mg, $5,110 annual leak. Upgrade to LDS is non-optional.' },
    ],
    whenToUse: [
      { toolId: 'transfer-loss', note: 'Run before committing to a syringe supplier and after any concentration change from PRC-1.' },
    ],
    relatedIds: ['transfer-loss', 'reagent-dispense', 'reagent-recon'],
    faq: [
      { q: 'How do I measure dead space?', a: 'Vendor spec or weigh-in-water method: weigh syringe empty, full, and post-expulsion. Difference = dead space. Typical ranges: 0.07 mL standard, 0.02 mL LDS, 0.005 mL ultra-LDS.' },
      { q: 'What counts as "annual vial cost"?', a: 'Total $ spent on the reagent per year — vials purchased × price. SDS-1 compares total leak cost against this budget.' },
      { q: 'Is waste proportional to concentration?', a: 'Yes, linearly. Doubling concentration doubles mass lost per dead-space volume. High-concentration protocols pay the most attention to syringe choice.' },
    ],
    thresholds: {
      cyan: 'Annual waste under 3% of vial budget — dead space is noise.',
      gold: 'Annual waste 3–8% of vial budget — upgrade to LDS is pure ROI.',
      magenta: 'Annual waste > 8% of vial budget — replace syringe stack immediately; leak exceeds threshold.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'waste_mg_per_draw = dead_space_ml × concentration_mg_ml\nannual_waste_mg = waste_mg_per_draw × draws_per_year\ntotal_leak_cost = annual_waste_mg × price_per_mg\nannual_waste_pct = (total_leak_cost / annual_vial_cost) × 100\nif annual_waste_pct > 8 → MAGENTA TRIP',
    },
    logicalGates: [
      'Measure or look up syringe dead_space_ml (hub + needle).',
      'Pull concentration_mg_ml from PRC-1.',
      'Compute waste_mg_per_draw and multiply by annual draw count.',
      'Convert to annual dollar leak using vial price-per-mg.',
      'Compare to annual vial budget. If > 8%, route to LDS syringe upgrade.',
    ],
    liveMetrics: [
      { token: 'waste', metric: 'reagent_waste_pct', fallback: 'no waste logged', decimals: 1, suffix: '%' },
    ],
    pivotSwitch: {
      critical: { toolId: 'vendor-yield', note: 'Leak exceeds budget — compute vendor-yield on LDS syringe upgrade and alternate suppliers.' },
      stable: { toolId: 'reagent-dispense', note: 'Waste inside budget — return to DSE-1 for standard administration conversion.' },
      fallback: { toolId: 'reagent-inventory', note: 'Waste unclear because stock unclear? Run inventory first.' },
    },
  },

  // ============================================================
  // MPF-1 — REAGENT PURITY
  // ============================================================
  {
    id: 'art-rx-what-is-reagent-purity',
    kind: 'guide',
    section: 'guides',
    slug: 'what-is-reagent-purity',
    clusterId: 'reagent-protocol',
    pageType: 'support',
    guideCategory: 'Reagent Protocol',
    toneProfile: 'sop',
    title: 'What Reagent Purity Calculates — HPLC-Adjusted Administration | Kefiw',
    h1: 'What Reagent Purity Calculates',
    subhead: 'Effective reagent mass after discounting for HPLC purity percentage on the COA.',
    outcomeLine: 'MPF-1 answers one question: given HPLC purity on the COA, what fraction of the label mass is actually active reagent?',
    description: 'MPF-1 applies HPLC purity to label mass: effective_dose = label_dose × purity_pct. Nudges operator to update PRC-1 concentration with effective mass.',
    keywords: ['reagent hplc purity', 'mass purity filter', 'effective reagent administration', 'coa purity adjustment', 'reagent label accuracy'],
    intro: 'HPLC purity on a COA is not marketing — it is the fraction of label mass that is the target molecule. Current working concentration: {{lm:concentration}}. A 95%-pure vial delivers 95% of the administration you think; MPF-1 pushes that correction back into PRC-1 before it hits the patient.',
    keyPoints: [
      'Formula: effective_dose_mg = label_dose_mg × (purity_pct / 100).',
      'Research-grade reagents commonly list 97–99% HPLC. Under 95% should trigger re-verification or return.',
      'Purity is separate from salt correction — both can apply to the same vial. Run SCF-1 first, then MPF-1 on the salt-corrected mass.',
      'MPF-1 output becomes the vial_mass input to PRC-1. Working concentration {{lm:concentration}} should already reflect the filter.',
      'Vendor COAs with no HPLC trace are unverifiable. Treat as 90% until proven otherwise.',
    ],
    examples: [
      { title: '5 mg label, 98% HPLC', body: 'effective = 5 × 0.98 = 4.90 mg. A 2% haircut — small but compounds across a vial. Feed 4.90 mg to PRC-1.' },
      { title: '10 mg label, 94% HPLC', body: 'effective = 10 × 0.94 = 9.40 mg. 6% haircut triggers a gold-flag verification — request chromatogram.' },
      { title: '5 mg label, no HPLC data', body: 'Treat as 90%: effective = 4.50 mg. Demand COA with HPLC on next order or switch vendors.' },
    ],
    whenToUse: [
      { toolId: 'reagent-purity', note: 'Run after SCF-1 and before PRC-1 on any new vial whose COA lists HPLC purity.' },
    ],
    relatedIds: ['reagent-purity', 'reagent-recon', 'salt-correction'],
    faq: [
      { q: 'Is HPLC purity the same as reagent content?', a: 'No. Reagent content (SCF-1) strips counter-ion salt mass. HPLC purity strips other reagent impurities and truncated sequences. Apply both — they multiply.' },
      { q: 'What if COA shows 99.5% but the vial is cloudy?', a: 'Purity is not solubility. High purity can still sludge if reconstituted above SOL-1 limit. Run both checks.' },
      { q: 'How does this affect SDS-1 waste math?', a: 'Effective mass lowers the true per-mg cost but raises the % of active reagent lost to dead space. SDS-1 uses post-filter concentration automatically if PRC-1 was updated.' },
    ],
    thresholds: {
      cyan: 'HPLC ≥ 97% — effective administration close to label; minor correction.',
      gold: 'HPLC 90–97% — apply filter, log discrepancy, verify COA on next batch.',
      magenta: 'HPLC < 90% or absent — do not administer; return vial or flag vendor.',
    },
    formulaAnchor: {
      caption: 'Deterministic Formula',
      expression: 'effective_dose_mg = label_dose_mg × (purity_pct / 100)\n// Chain order: SCF-1 → MPF-1 → PRC-1\n// salt_adjusted = label × salt_pct/100\n// effective    = salt_adjusted × hplc_pct/100\n// Feed effective to PRC-1 as vial_mass_mg.',
    },
    logicalGates: [
      'Locate HPLC purity percentage on vendor COA.',
      'If salt-corrected mass exists from SCF-1, use that as input; otherwise use label_mass.',
      'Compute effective_dose = input × (purity_pct / 100).',
      'Pipe effective_dose into PRC-1 as vial_mass_mg. Relabel vial.',
      'If purity < 90% or absent, halt — do not administer; request chromatogram.',
    ],
    liveMetrics: [
      { token: 'concentration', metric: 'reagent_concentration_mg_ml', fallback: 'no recon yet', decimals: 2, suffix: ' mg/mL' },
    ],
    pivotSwitch: {
      critical: { toolId: 'reagent-recon', note: 'Effective mass computed — immediately feed into PRC-1 for true concentration.' },
      stable: { toolId: 'reagent-dispense', note: 'Purity clean — administration conversion via DSE-1 is trustworthy.' },
      fallback: { toolId: 'salt-correction', note: 'Purity adjusted but salt correction still pending? Run SCF-1 upstream.' },
    },
  },
];

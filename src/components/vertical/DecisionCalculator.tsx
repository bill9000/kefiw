import { useEffect, useMemo, useState } from 'react';
import type { CalculatorField, VerticalCalculatorKind, VerticalCalculatorPage } from '~/data/vertical-calculators';

interface Metric {
  label: string;
  value: string;
  note?: string;
}

interface DecisionOption {
  title: string;
  stance: string;
  details: string[];
  pushback: string;
}

interface Result {
  headline: string;
  metrics: Metric[];
  flags: string[];
  notes: string[];
  options?: DecisionOption[];
}

interface Props {
  page: VerticalCalculatorPage;
}

type Values = Record<string, number | string | boolean>;

const SS_WAGE_BASE_2026 = 184_500;
const BUSINESS_MILEAGE_RATE_2026 = 0.725;

function money(value: number): string {
  if (!Number.isFinite(value)) return '$0';
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

function numberLabel(value: number, suffix = ''): string {
  if (!Number.isFinite(value)) return `0${suffix}`;
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}`;
}

function pct(value: number): string {
  if (!Number.isFinite(value)) return '0%';
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
}

function toNumber(values: Values, id: string): number {
  const value = values[id];
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') return Number(value) || 0;
  return value ? 1 : 0;
}

function toStringValue(values: Values, id: string): string {
  const value = values[id];
  return typeof value === 'string' ? value : String(value ?? '');
}

function isChecked(values: Values, id: string): boolean {
  return values[id] === true;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function hvacLoadEstimate(values: Values): Result {
  const sqft = toNumber(values, 'sqft');
  const ceilingHeight = toNumber(values, 'ceilingHeight');
  const climate = toStringValue(values, 'climate');
  const insulation = toStringValue(values, 'insulation');
  const windows = toStringValue(values, 'windows');
  const sunExposure = toStringValue(values, 'sunExposure');
  const ductCondition = toStringValue(values, 'ductCondition');
  const currentTonnage = toNumber(values, 'currentTonnage');
  const hotColdRooms = toNumber(values, 'hotColdRooms');
  const projectPath = toStringValue(values, 'projectPath');

  const climateFactor = climate === 'hot-humid' ? 1.12 : climate === 'hot-dry' ? 1.08 : climate === 'cold' ? 0.92 : 1;
  const insulationFactor = insulation === 'poor' ? 1.18 : insulation === 'good' ? 0.86 : 1;
  const windowFactor = windows === 'high' ? 1.16 : windows === 'low' ? 0.92 : 1;
  const sunFactor = sunExposure === 'high' ? 1.1 : sunExposure === 'low' ? 0.94 : 1;
  const heightFactor = clamp(ceilingHeight / 8, 0.9, 1.35);
  const ductPenalty = ductCondition === 'poor' ? 0.25 : ductCondition === 'unknown' ? 0.1 : 0;
  const roughTons = clamp((sqft / 550) * climateFactor * insulationFactor * windowFactor * sunFactor * heightFactor, 1, 12);
  const lowTons = clamp(roughTons * 0.85, 1, 12);
  const highTons = clamp(roughTons * 1.15, 1, 12);
  const difference = currentTonnage > 0 ? currentTonnage - roughTons : 0;
  const comfortPressure = hotColdRooms + ductPenalty * 10;

  const options: DecisionOption[] = [
    {
      title: 'Manual J or equivalent load calculation',
      stance: 'Ask for this before equipment is selected.',
      details: [
        'Square footage only is not enough for sizing.',
        'The calculation should account for insulation, windows, orientation, air leakage, climate, occupancy, and room loads.',
      ],
      pushback: 'Ask: what inputs changed the tonnage recommendation, and can I see the room-by-room load summary?',
    },
    {
      title: 'Duct and return-air check',
      stance: ductCondition === 'poor' || hotColdRooms >= 2 ? 'Do this before buying bigger equipment.' : 'Still verify before excluding duct work.',
      details: [
        'Leaky attic ducts, crushed flex, weak returns, and high static pressure can mimic under-sizing.',
        'A bigger unit on bad ducts can short-cycle, run noisy, and still leave rooms uncomfortable.',
      ],
      pushback: 'Ask: what were static pressure, return sizing, duct leakage, and room airflow findings?',
    },
    {
      title: 'Right-size instead of same-size',
      stance: currentTonnage > 0 && Math.abs(difference) >= 0.75 ? 'The old nameplate deserves a challenge.' : 'The old size is not obviously wrong, but it still needs load support.',
      details: [
        `Current size input: ${currentTonnage > 0 ? numberLabel(currentTonnage, ' tons') : 'unknown'}.`,
        `Rough pressure range: ${numberLabel(lowTons, ' to ')}${numberLabel(highTons, ' tons')}.`,
        'Old equipment may have been oversized, undersized, or compensating for ducts and envelope problems.',
      ],
      pushback: 'Ask: why is this tonnage right for the current house, not just the old unit?',
    },
    {
      title: 'Zone or mini-split the problem rooms',
      stance: projectPath === 'mini-split' || hotColdRooms >= 3 ? 'Worth pricing as a targeted comfort fix.' : 'Only needed if room-by-room loads or ducts justify it.',
      details: [
        'Problem rooms often need targeted airflow, shading, insulation, or a ductless/ducted mini-split zone.',
        'This can be better than oversizing the whole house for two bad rooms.',
      ],
      pushback: 'Ask: which rooms are driving the load, and would zoning solve those rooms without oversizing the main system?',
    },
  ];

  return {
    headline: `${numberLabel(lowTons, ' to ')}${numberLabel(highTons, ' tons')} rough capacity pressure`,
    metrics: [
      { label: 'Midpoint pressure', value: numberLabel(roughTons, ' tons'), note: 'Sanity-check range only, not Manual J.' },
      { label: 'Rough BTU range', value: `${numberLabel(lowTons * 12, 'k to ')}${numberLabel(highTons * 12, 'k BTU/hr')}` },
      { label: 'Current size comparison', value: currentTonnage > 0 ? `${difference >= 0 ? '+' : ''}${numberLabel(difference, ' tons vs estimate')}` : 'Unknown' },
      { label: 'Comfort pressure', value: comfortPressure >= 5 ? 'High' : comfortPressure >= 2 ? 'Moderate' : 'Low' },
    ],
    flags: [
      currentTonnage > 0 && currentTonnage > highTons + 0.5 ? 'Current system may be oversized for the rough load. Oversizing can hurt humidity removal and comfort.' : 'No obvious oversizing signal from current tonnage alone.',
      currentTonnage > 0 && currentTonnage < lowTons - 0.5 ? 'Current system may be undersized or the house may have envelope/solar load pressure.' : 'No obvious undersizing signal from current tonnage alone.',
      ductCondition === 'poor' ? 'Duct condition is a major warning. Fixing ducts may beat buying more tonnage.' : ductCondition === 'none' ? 'No usable ducts means this is a room/zone design problem, not a central-tonnage shortcut.' : 'Duct condition is not the main warning from these inputs.',
      insulation === 'poor' || windows === 'high' || sunExposure === 'high' ? 'Envelope and solar gain are pushing load. Shading, air sealing, insulation, or window strategy may reduce equipment size.' : 'Envelope inputs are not strongly increasing load.',
      hotColdRooms >= 3 ? 'Multiple comfort-problem rooms suggest distribution/zoning work, not just equipment size.' : 'Room complaints are limited in this scenario.',
    ],
    notes: [
      'Use this page before the replacement-cost page. It decides what size/path deserves pricing.',
      'A quote that says only "replace with same tonnage" is weak unless it explains why the old size was right.',
    ],
    options,
  };
}

function hvacCost(values: Values): Result {
  const sqft = toNumber(values, 'sqft');
  const currentSystem = toStringValue(values, 'currentSystem');
  const equipment = toStringValue(values, 'equipment');
  const failureMode = toStringValue(values, 'failureMode');
  const refrigerant = toStringValue(values, 'refrigerant');
  const quotePath = toStringValue(values, 'quotePath');
  const furnaceAge = toNumber(values, 'furnaceAge');
  const coilAge = toNumber(values, 'coilAge');
  const zones = Math.max(1, toNumber(values, 'zones'));
  const efficiency = toStringValue(values, 'efficiency');
  const ducts = toStringValue(values, 'ducts');
  const complexity = toStringValue(values, 'complexity');
  const rebate = toNumber(values, 'rebate');
  const isMiniSplit = equipment === 'mini-split';

  const equipmentRates: Record<string, number> = {
    full: 9.25,
    ac: 5.75,
    furnace: 4.6,
    'heat-pump': 7.4,
    'mini-split': 7.9,
  };
  const efficiencyFactor = efficiency === 'premium' ? 1.33 : efficiency === 'high' ? 1.16 : 1;
  const complexityFactor = complexity === 'hard' ? 1.22 : complexity === 'easy' ? 0.92 : 1;
  const ductAdders: Record<string, number> = {
    none: 0,
    minor: Math.max(650, sqft * 0.8),
    partial: Math.max(2500, sqft * 2.4),
    full: Math.max(6500, sqft * 5.25),
  };
  const miniSplitZoneCost = zones * (efficiency === 'premium' ? 5200 : efficiency === 'high' ? 4300 : 3600);
  const miniSplitBase = Math.max(sqft * (equipmentRates[equipment] ?? equipmentRates.full), miniSplitZoneCost);
  const equipmentCost = (isMiniSplit ? miniSplitBase : sqft * (equipmentRates[equipment] ?? equipmentRates.full)) * efficiencyFactor * complexityFactor;
  const ductCost = isMiniSplit ? 0 : ductAdders[ducts] ?? 0;
  const lineSetZoneAllowance = isMiniSplit ? zones * (complexity === 'hard' ? 1450 : complexity === 'easy' ? 850 : 1100) : 0;
  const typical = Math.max(0, equipmentCost + ductCost + lineSetZoneAllowance - rebate);
  const low = typical * 0.82;
  const high = typical * 1.24;
  const roughTonnage = clamp(sqft / 550, 1, 12);
  const roughBtu = roughTonnage * 12000;

  const coolingSideSymptom = [
    'cooling-dead',
    'cooling-warm',
    'iced',
    'float-switch',
    'compressor-shorted',
    'condenser-failed',
    'coil-leak',
  ].includes(failureMode);
  const cheapServiceSymptom = ['cooling-dead', 'cooling-warm', 'iced', 'float-switch'].includes(failureMode) || quotePath === 'service-repair';
  const safetyOrHardStopSymptom = ['breaker-trips', 'heating-problem'].includes(failureMode);
  const partialCoolingViable =
    ['gas-furnace-ac', 'ac-only-usable-blower', 'unknown'].includes(currentSystem) &&
    coolingSideSymptom &&
    furnaceAge <= 14;
  const fullReplacementIsSuspect =
    quotePath === 'full' &&
    partialCoolingViable &&
    ducts !== 'full' &&
    failureMode !== 'blower-furnace';

  const options: DecisionOption[] = [
    {
      title: 'Start with cheap symptom checks',
      stance: cheapServiceSymptom ? 'Do this before accepting replacement as the only answer.' : 'Still ask what cheap causes were ruled out.',
      details: [
        'A dead or weak AC can be thermostat setup, drain float switch, capacitor, contactor, dirty filter, iced coil, condenser fan, or airflow before it is a full-system replacement.',
        'Homeowners usually know symptoms; the technician should provide readings, failed-part evidence, and repair-vs-replace choices.',
      ],
        pushback: 'Ask: what cheap causes did you rule out, what readings support your claim, and what is the repair price before replacement?',
    },
    {
      title: 'R-22 service or retrofit refrigerant',
      stance:
        refrigerant === 'r22'
          ? 'Do not let phaseout language force a full replacement by itself.'
          : 'Still ask what refrigerant transition issue is actually driving the quote.',
      details: [
        'Existing R-22 systems can still be serviced with recovered, recycled, or reclaimed R-22.',
        'Retrofit refrigerants can sometimes keep an R-22 system alive for several more years when the equipment is otherwise worth saving.',
        'R-410A is not automatically a homeowner upgrade; often it is just the next regulatory/equipment platform.',
      ],
      pushback: 'Ask: what is the reclaimed R-22 price, what retrofit refrigerant would you use, what capacity loss should I expect, and why is full replacement better?',
    },
    {
      title: 'Replace condenser and coil together',
      stance:
        coilAge >= 20 || failureMode === 'coil-leak'
          ? 'Strong candidate. Old coils leak first and can ruin a partial job.'
          : 'Only becomes a strong candidate after the tech proves the outdoor unit or coil is the real problem.',
      details: [
        'If the coil is 20+ years old, keeping it while replacing the condenser can be false economy.',
        'If the condenser is changed, the matching coil, metering device, and refrigerant plan should be explicit.',
      ],
      pushback: 'Ask: what is the coil age, is it leaking, is it compatible with the condenser/refrigerant, and what is the add-on price to replace it now?',
    },
    {
      title: 'Compressor-only repair',
      stance:
        failureMode === 'compressor-shorted'
          ? 'Price it, but make them justify labor, refrigerant, warranty, and age.'
          : 'Do not start here unless a technician has actually proved a compressor failure.',
      details: [
        'Can be rational when the system is not near end of life and the indoor coil, blower, controls, and refrigerant circuit are clean.',
        'Can be a bad deal when labor plus compressor cost approaches condenser or system replacement.',
      ],
      pushback: 'Ask: what is the installed compressor price, what warranty applies, and why is this worse than condenser-only replacement?',
    },
    {
      title: 'Condenser plus indoor coil only',
      stance: partialCoolingViable ? 'Strong counter-bid candidate.' : 'Possible, but compatibility and age may weaken it.',
      details: [
        'Keeps a usable gas furnace, blower, cabinet, and ducts when the cooling side failed.',
        'Useful when the contractor is quoting a full system mainly because the outdoor unit failed.',
      ],
      pushback: 'Ask: can you quote condenser + matching coil while reusing the furnace/blower, and what exactly prevents that?',
    },
    {
      title: 'Keep gas heat and add mini-splits for cooling',
      stance:
        currentSystem === 'gas-furnace-ac'
          ? 'Worth pricing when ducts are weak, only some rooms matter, or you want staged heat-pump coverage.'
          : 'Worth considering if zones matter more than whole-house ducted comfort.',
      details: [
        'This is not one wall unit for the whole house. It means zone/head planning by room load.',
        'Can reduce dependence on old ducts and lets the gas furnace remain backup heat.',
      ],
      pushback: 'Ask: what rooms actually need heads, what BTU per room, where do line sets drain, and what electrical work is included?',
    },
    {
      title: 'Full system replacement',
      stance: fullReplacementIsSuspect ? 'Do not accept this as the only option without a written reason.' : safetyOrHardStopSymptom ? 'May be valid, but the safety finding must be specific and documented.' : 'Can be correct when age, compatibility, safety, or multiple failures line up.',
      details: [
        'Best when furnace/air handler, coil, outdoor unit, controls, and ducts are all near end of life or incompatible.',
        'Overkill when one component failed and reusable parts still have useful life.',
      ],
      pushback: 'Ask: which parts are actually failed, what test readings prove it, which parts are reusable, and which replacements are being proposed mainly for warranty or sales simplicity?',
    },
  ];

  return {
    headline: `${money(low)} to ${money(high)} range`,
    metrics: [
      { label: 'Typical midpoint', value: money(typical), note: 'Before local quote differences and permit-specific items.' },
      isMiniSplit
        ? { label: 'Mini-split planning frame', value: `${numberLabel(zones)} zones / ${numberLabel(roughBtu / 1000, 'k BTU')} rough whole-home load`, note: 'Not one generic wall head. Size by room and line-set path.' }
        : { label: 'Rough capacity pressure', value: numberLabel(roughTonnage, ' tons'), note: 'Sanity check only; ask for a load calculation.' },
      isMiniSplit
        ? { label: 'Zone / line-set allowance', value: money(lineSetZoneAllowance), note: 'Ductwork allowance is excluded for ductless mini-split paths.' }
        : { label: 'Ductwork allowance', value: money(ductCost) },
      { label: 'Rebate/credit offset', value: money(rebate) },
      { label: 'Symptom/history input', value: failureMode.replace(/-/g, ' ') },
      { label: 'Furnace / blower age', value: numberLabel(furnaceAge, ' years') },
      { label: 'Cooling coil / AC age', value: numberLabel(coilAge, ' years') },
      { label: 'Refrigerant', value: refrigerant === 'r22' ? 'R-22 / old Freon' : refrigerant === 'r410a' ? 'R-410A' : refrigerant === 'a2l' ? 'Newer A2L' : 'Unknown' },
    ],
    flags: [
      refrigerant === 'r22'
        ? 'R-22 phaseout is a negotiation point, not an automatic replacement order. Ask for reclaimed R-22 and retrofit refrigerant pricing before accepting a full-system scare pitch.'
        : refrigerant === 'r410a'
          ? 'R-410A is not a magic upgrade story. New equipment is moving away from it too, so ask what platform and refrigerant you are actually buying.'
          : 'If refrigerant is unknown, identify it before deciding between repair, retrofit, or replacement.',
      coilAge >= 20
        ? 'The indoor coil is near or beyond normal service-life expectations. If the condenser is replaced, price coil replacement instead of pretending the old coil is free.'
        : 'Coil age alone does not force replacement, but leaks, rust, compatibility, and metering-device mismatch matter.',
      fullReplacementIsSuspect
        ? 'The full-replacement quote deserves pushback: the failure looks cooling-side specific and the furnace/blower may still be usable.'
        : quotePath === 'no-quote'
          ? 'No quote is entered yet. Use the result as a question list before the first contractor visit.'
          : 'Full replacement may be defensible, but ask for the symptom evidence, failed-part claim, and compatibility reason in writing.',
      isMiniSplit
        ? 'Mini-split path should be quoted by room/zone, head type, line-set length, drain routing, and electrical scope, not by ductwork.'
        : ducts === 'none'
          ? 'Confirm the contractor inspected duct leakage and return sizing before excluding duct work.'
          : 'Ask for duct scope, sealing, insulation, and balancing as separate line items.',
      failureMode === 'compressor-shorted'
        ? 'A tech-reported shorted compressor can justify replacement, but it can also justify a compressor or condenser-only comparison depending on age and refrigerant.'
        : cheapServiceSymptom
          ? 'The symptom you selected has cheap-failure possibilities. Make the technician document capacitor, contactor, thermostat, drain safety, airflow, and ice/refrigerant findings before sales scope.'
          : safetyOrHardStopSymptom
            ? 'Breaker trips, heat safety issues, gas smell, rollout, or electrical burning smells are stop conditions. Get qualified service and documentation.'
            : 'Symptoms and history should drive the next question. Do not let a vague comfort complaint automatically become a full equipment replacement.',
      efficiency !== 'standard' ? 'High-efficiency upgrades should be tested against bill savings, comfort, and rebate eligibility.' : 'Standard efficiency may be cheaper upfront but can leave savings on the table.',
      complexity === 'hard' ? 'Difficult access can change labor, warranty, and schedule risk.' : 'Access looks normal in this scenario; verify attic, closet, roof, or crawlspace constraints.',
    ],
    notes: [
      'Use this as a bid-comparison frame, not a final contractor quote.',
      'A proper load calculation matters more than replacing the old tonnage automatically.',
      'Tell each contractor you want at least one repair/partial-scope option and one full-scope option, with reasons why each is or is not viable.',
    ],
    options,
  };
}

function hvacRepair(values: Values): Result {
  const repairCost = toNumber(values, 'repairCost');
  const age = toNumber(values, 'systemAge');
  const replacementCost = Math.max(1, toNumber(values, 'replacementCost'));
  const energyPenalty = toNumber(values, 'annualEnergyPenalty');
  const comfortScore = toNumber(values, 'comfortScore');
  const repairRatio = repairCost / replacementCost;
  const threeYearRepairPath = repairCost + energyPenalty * 3;
  const replaceSignal = repairRatio >= 0.35 || (age >= 12 && repairRatio >= 0.2) || (age >= 15 && comfortScore >= 5);

  return {
    headline: replaceSignal ? 'Replacement deserves a serious bid' : 'Repair may still be reasonable',
    metrics: [
      { label: 'Repair as percent of replacement', value: pct(repairRatio * 100) },
      { label: '3-year repair path', value: money(threeYearRepairPath), note: 'Repair plus estimated energy penalty.' },
      { label: 'System age', value: numberLabel(age, ' years') },
      { label: 'Replacement estimate', value: money(replacementCost) },
    ],
    flags: [
      repairRatio >= 0.35 ? 'Repair quote is high relative to replacement.' : 'Repair quote is not extreme relative to replacement.',
      age >= 12 ? 'Age increases repeat-repair risk.' : 'Age alone does not force replacement.',
      comfortScore >= 6 ? 'Comfort complaints suggest the issue may be system design, ducts, or sizing, not just a failed part.' : 'Comfort severity is moderate in this scenario.',
    ],
    notes: ['Safety issues, refrigerant leaks, cracked heat exchangers, or unavailable parts can override pure math.'],
  };
}

function hvacDiagnosis(values: Values): Result {
  const problemMode = toStringValue(values, 'problemMode');
  const thermostatCall = toStringValue(values, 'thermostatCall');
  const indoorBlower = toStringValue(values, 'indoorBlower');
  const outdoorBehavior = toStringValue(values, 'outdoorBehavior');
  const gasPattern = toStringValue(values, 'gasFurnacePattern');
  const electricPattern = toStringValue(values, 'electricHeatPattern');
  const breakerStatus = toStringValue(values, 'breakerStatus');
  const floatSwitch = toStringValue(values, 'floatSwitch');
  const contractorSays = toStringValue(values, 'contractorSays');
  const systemAge = toNumber(values, 'systemAge');
  const capacitorAge = toNumber(values, 'capacitorAge');
  const boardQuoted = isChecked(values, 'boardQuoted') || contractorSays === 'bad-board';
  const flameSensorCleaned = isChecked(values, 'flameSensorCleaned');
  const thermostatRecent = isChecked(values, 'thermostatRecent');
  const filterDirty = isChecked(values, 'filterDirty');
  const usesOutdoorUnit = ['cooling-dead', 'cooling-warm', 'heat-pump'].includes(problemMode);

  const options: DecisionOption[] = [];
  const flags: string[] = [];
  const notes: string[] = [
    'Start from what the homeowner can actually know: what happened, what changed recently, what the thermostat/outdoor unit/blower did, and what the technician claimed.',
    'This is a homeowner matrix for asking better questions, not instructions to bypass safety switches or work inside energized equipment.',
    'If there is gas smell, carbon monoxide alarm, flame rollout, burning smell, melted wiring, or repeated breaker trips, stop using the system and call qualified help.',
  ];

  if (problemMode === 'heating-unknown') {
    options.push({
      title: 'Identify the heat type before buying a heater replacement',
      stance: 'The first question is what kind of heat failed, because gas, electric strip, heat pump, and boiler problems are different calls.',
      details: [
        'Gas furnaces have an ignition sequence with inducer, pressure switch, igniter, gas valve, flame proof, safeties, and blower delay.',
        'Electric furnaces and air handlers can lose sequencer, relay, heat-strip stage, blower, or thermostat auxiliary-heat calls.',
        'Heat pumps need outdoor heating and backup heat checked separately before calling the whole system bad.',
      ],
      pushback: 'Ask: what heat type do I have, what sequence failed, and which cheaper part was ruled out before quoting a furnace or air-handler replacement?',
    });
  }

  if (thermostatCall === 'blank' || thermostatRecent || problemMode === 'thermostat-control') {
    options.push({
      title: 'Thermostat / low-voltage control issue',
      stance: 'Check this before accepting equipment replacement.',
      details: [
        'A blank thermostat can be transformer, float switch, fuse, wiring, batteries, or thermostat setup.',
        'A recently changed thermostat can be misconfigured for heat pump, gas furnace, electric heat, or staging.',
      ],
      pushback: 'Ask: did you verify 24V power, thermostat setup, safeties, fuse, and call terminals before quoting equipment?',
    });
  }

  if (indoorBlower === 'off' || indoorBlower === 'stops') {
    options.push({
      title: 'Blower motor, capacitor, relay, or limit path',
      stance: 'No airflow or intermittent airflow can make both heating and cooling look worse than the equipment really is.',
      details: [
        'A weak blower, bad blower capacitor, relay issue, dirty wheel, dirty filter, or limit switch can shut the system down or make it overheat.',
        'Replacing the outdoor AC or furnace will not fix a duct, return-air, blower, or limit problem by itself.',
      ],
      pushback: 'Ask: did you test blower amperage, capacitor, relay output, static pressure, filter restriction, and limit trips before quoting replacement?',
    });
  }

  if (floatSwitch === 'wet') {
    options.push({
      title: 'Condensate drain / float switch shutdown',
      stance: 'This can make the system look dead while protecting the house from water damage.',
      details: ['A clogged drain can cut thermostat power or stop cooling.', 'Clearing the drain is not the same as replacing the HVAC system.'],
      pushback: 'Ask: did the float switch trip, is the drain clear, and did the system run normally after clearing it?',
    });
  }

  if (usesOutdoorUnit && (['hums-no-fan', 'fan-only', 'silent'].includes(outdoorBehavior) || capacitorAge >= 5)) {
    options.push({
      title: 'Capacitor, contactor, or condenser fan motor',
      stance: 'Cheap failures can make AC look dead or make a compressor look worse than it is.',
      details: [
        'A bad capacitor can cause humming, no fan spin, hard starting, or compressor start failure.',
        'A bad contactor can keep the outdoor unit silent even when the thermostat calls.',
        'A failed condenser fan can overheat the compressor and mimic larger trouble.',
      ],
      pushback: 'Ask: what were the capacitor microfarads, contactor voltage, amp draw, and fan motor findings?',
    });
  }

  if (filterDirty || (usesOutdoorUnit && outdoorBehavior === 'iced') || problemMode === 'cooling-warm') {
    options.push({
      title: 'Airflow, filter, ice, or dirty coil path',
      stance: 'Weak airflow can create warm air, freezing, short cycling, and comfort complaints without proving equipment is finished.',
      details: [
        'Dirty filters and coils reduce airflow and can freeze the evaporator coil.',
        'Duct restrictions and weak returns can make new equipment underperform too.',
      ],
      pushback: 'Ask: did you measure static pressure, inspect the indoor coil, check filter restriction, and thaw the system before judging refrigerant or compressor?',
    });
  }

  if (problemMode.startsWith('gas') || gasPattern !== 'na') {
    options.push({
      title: 'Gas furnace flame sensor / ignition sequence',
      stance:
        gasPattern === 'lights-then-drops' && !flameSensorCleaned
          ? 'A dirty flame sensor is a classic cheap failure before a replacement conversation.'
          : 'Sequence the furnace before replacing expensive parts.',
      details: [
        'Burner lights then shuts off often points to flame-sensing, grounding, or board proof-of-flame logic.',
        'Inducer/no ignition can point to pressure switch, venting, igniter, gas valve, or board sequence.',
        'A real heat-exchanger or rollout safety issue is different and should stop operation.',
      ],
      pushback: 'Ask: what step in the ignition sequence failed, and did you test/clean the flame sensor before quoting a board or furnace?',
    });
  }

  if (problemMode === 'electric-heat' || electricPattern !== 'na') {
    options.push({
      title: 'Electric heat sequencer / relay / heat strip path',
      stance: 'Electric heat can fail by stage. It is not automatically an air-handler replacement.',
      details: [
        'A sequencer or relay can leave the blower running while heat strips do not energize.',
        'Partial heat can mean one stage/element failed, not the whole system.',
        'Breaker trips under heat call are high-current safety events and need proper diagnosis.',
      ],
      pushback: 'Ask: which heat strip stages energized, what amperage was measured, and did the sequencer/relay fail?',
    });
  }

  if (problemMode === 'heat-pump') {
    options.push({
      title: 'Heat pump plus auxiliary heat split',
      stance: 'Separate the outdoor heat-pump problem from the backup heat problem.',
      details: [
        'A heat pump may run but not keep up in cold weather if auxiliary heat is not staging correctly.',
        'Thermostat setup can accidentally force expensive auxiliary heat or prevent it.',
      ],
      pushback: 'Ask: is the outdoor unit heating, is auxiliary heat staging, and is the thermostat configured correctly for heat pump operation?',
    });
  }

  if (boardQuoted) {
    options.push({
      title: 'Control board quote sanity check',
      stance: 'Board replacement can be real, but it should come after basic proof, not before it.',
      details: [
        'Boards get blamed when the tech has not isolated thermostat power, safeties, flame sensing, relays, motors, or wiring.',
        'A failed board should have a specific failed output/input, not just "the board is bad."',
      ],
      pushback: 'Ask: what voltage entered the board, what output failed, and what cheaper failed component was ruled out?',
    });
  }

  const outdoorStop = usesOutdoorUnit && outdoorBehavior === 'breaker-trips';
  if (breakerStatus === 'trips-immediately' || outdoorStop || gasPattern === 'safety-trip' || electricPattern === 'breaker-heat') {
    flags.push('Stop condition: repeated breaker trips, flame rollout/high-limit trips, burning smell, or melted wiring are not negotiation topics. Shut it down and get qualified service.');
  }

  if (contractorSays === 'replace-system' && systemAge < 15) {
    flags.push('Replacement quote on a system under 15 years old needs symptom history, named test evidence, and repair/partial-scope comparison.');
  }
  if (contractorSays === 'replace-heater' && systemAge < 15) {
    flags.push('Heater replacement on a system under 15 years old needs written evidence: cracked heat exchanger, repeated safety trip, unavailable part, or repair math that actually supports replacement.');
  }
  if (contractorSays === 'bad-compressor') {
    flags.push('Bad compressor should be specific: electrically shorted, mechanically locked, grounded, failed windings, or just not starting.');
  }
  if (contractorSays === 'bad-heat-exchanger') {
    flags.push('A documented cracked heat exchanger is a safety issue, but ask for evidence: combustion reading, camera/photo, failed pressure test, or written finding.');
  }
  if (systemAge >= 18) {
    flags.push('System age makes replacement more plausible, but age alone still does not explain the homeowner symptom.');
  }
  if (flags.length === 0) {
    flags.push('No immediate replacement-level proof from these inputs. Ask for diagnostics before sales scope.');
  }

  const cheapFixCount = options.filter((option) =>
    /Thermostat|Capacitor|float|flame sensor|sequencer|Airflow|Blower|heat type/.test(option.title),
  ).length;
  const replacementPressure =
    systemAge >= 18 || breakerStatus === 'trips-immediately' || outdoorStop || gasPattern === 'safety-trip' || contractorSays === 'bad-heat-exchanger'
      ? 'High'
      : ['replace-system', 'replace-heater'].includes(contractorSays)
        ? 'Medium'
        : 'Low';

  return {
    headline: cheapFixCount > 0 ? `${cheapFixCount} service-call paths before replacement` : 'Use symptoms to force real test evidence',
    metrics: [
      { label: 'Replacement pressure', value: replacementPressure },
      { label: 'Homeowner symptom', value: problemMode.replace(/-/g, ' ') },
      { label: 'System age', value: numberLabel(systemAge, ' years') },
      { label: 'Thermostat signal', value: thermostatCall.replace(/-/g, ' ') },
      { label: 'Indoor blower', value: indoorBlower.replace(/-/g, ' ') },
    ],
    flags,
    notes,
    options,
  };
}

function energySavings(values: Values): Result {
  const monthlyBill = toNumber(values, 'monthlyBill');
  const savingsPct = toNumber(values, 'savingsPct') / 100;
  const upgradeCost = toNumber(values, 'upgradeCost');
  const rebate = toNumber(values, 'rebate');
  const annualSavings = monthlyBill * 12 * savingsPct;
  const netCost = Math.max(0, upgradeCost - rebate);
  const payback = annualSavings > 0 ? netCost / annualSavings : Infinity;
  const netFirstYear = annualSavings + rebate - upgradeCost;

  return {
    headline: Number.isFinite(payback) ? `${numberLabel(payback, ' year')} simple payback` : 'No payback from the current assumptions',
    metrics: [
      { label: 'Annual savings', value: money(annualSavings) },
      { label: 'Net upgrade cost', value: money(netCost) },
      { label: 'First-year net', value: money(netFirstYear) },
      { label: 'Monthly savings', value: money(annualSavings / 12) },
    ],
    flags: [
      payback > 10 ? 'This looks more like a comfort/resilience decision than a fast-payback upgrade.' : 'The payback is within a range many owners will at least consider.',
      savingsPct > 0.3 ? 'Savings assumption is aggressive; verify with bills and contractor modeling.' : 'Savings assumption is moderate.',
    ],
    notes: ['Weather, rates, household behavior, and equipment sizing can change actual savings.'],
  };
}

function sellerNet(values: Values): Result {
  const salePrice = toNumber(values, 'salePrice');
  const mortgage = toNumber(values, 'mortgage');
  const commission = salePrice * toNumber(values, 'commissionPct') / 100;
  const otherClosing = salePrice * toNumber(values, 'sellerClosingPct') / 100;
  const lineItems =
    toNumber(values, 'titleCompany') +
    toNumber(values, 'taxProration') +
    toNumber(values, 'resaleCertificate') +
    toNumber(values, 'hoaDues') +
    toNumber(values, 'hoaTransfer') +
    toNumber(values, 'repairs') +
    toNumber(values, 'concessions');
  const totalCosts = mortgage + commission + otherClosing + lineItems;
  const net = salePrice - totalCosts;

  return {
    headline: `${money(net)} estimated seller proceeds`,
    metrics: [
      { label: 'Commission', value: money(commission) },
      { label: 'Other closing costs', value: money(otherClosing) },
      { label: 'Detailed line items', value: money(lineItems), note: 'Title, tax proration, resale certificate, HOA dues, transfer fee, repairs, concessions.' },
      { label: 'Total deductions from sale price', value: money(totalCosts) },
    ],
    flags: [
      toNumber(values, 'taxProration') > 0 ? 'Tax proration is visible; confirm whether local custom makes it a credit or debit.' : 'Tax proration is blank; this is a common closing surprise.',
      toNumber(values, 'resaleCertificate') + toNumber(values, 'hoaTransfer') > 0 ? 'Association document and transfer costs are included.' : 'If there is an HOA or condo association, add resale and transfer charges.',
      toNumber(values, 'repairs') + toNumber(values, 'concessions') > salePrice * 0.03 ? 'Repairs and concessions are material to proceeds.' : 'Repairs and concessions are not driving the estimate.',
    ],
    notes: ['Use a title-company estimate and payoff statement before treating this as final.'],
  };
}

function buyerCash(values: Values): Result {
  const price = toNumber(values, 'purchasePrice');
  const down = price * toNumber(values, 'downPct') / 100;
  const loanClosing = price * toNumber(values, 'loanClosingPct') / 100;
  const lineItems =
    toNumber(values, 'titleCompany') +
    toNumber(values, 'prepaids') +
    toNumber(values, 'taxProration') +
    toNumber(values, 'resaleCertificate') +
    toNumber(values, 'hoaDues') +
    toNumber(values, 'hoaTransfer') +
    toNumber(values, 'inspections');
  const cashToClose = down + loanClosing + lineItems;

  return {
    headline: `${money(cashToClose)} estimated cash to close`,
    metrics: [
      { label: 'Down payment', value: money(down) },
      { label: 'Loan and closing costs', value: money(loanClosing) },
      { label: 'Prepaids, title, tax, HOA, inspections', value: money(lineItems) },
      { label: 'Cash-to-close percent of price', value: pct((cashToClose / Math.max(1, price)) * 100) },
    ],
    flags: [
      toNumber(values, 'prepaids') > 0 ? 'Prepaids and escrow setup are included.' : 'Prepaids and escrow setup are missing.',
      toNumber(values, 'hoaDues') + toNumber(values, 'hoaTransfer') > 0 ? 'Association closing charges are included.' : 'If the property has an association, add dues, resale docs, and transfer fees.',
    ],
    notes: ['Your lender disclosure and title-company statement are the source of truth.'],
  };
}

function commissionCost(values: Values): Result {
  const salePrice = toNumber(values, 'salePrice');
  const commissionPct = toNumber(values, 'commissionPct');
  const listingSidePct = toNumber(values, 'listingSidePct');
  const buyerBrokerPct = toNumber(values, 'buyerBrokerPct');
  const adminFee = toNumber(values, 'flatAdminFee');
  const negotiatedReduction = toNumber(values, 'negotiatedSavingsPct');
  const totalCommission = salePrice * commissionPct / 100 + adminFee;
  const listingSide = salePrice * listingSidePct / 100;
  const buyerSide = salePrice * buyerBrokerPct / 100;
  const testedSavings = salePrice * negotiatedReduction / 100;

  return {
    headline: `${money(totalCommission)} commission exposure`,
    metrics: [
      { label: 'Total commission and admin fee', value: money(totalCommission) },
      { label: 'Listing-side share', value: money(listingSide) },
      { label: 'Buyer-side concession', value: money(buyerSide) },
      { label: 'Value of tested reduction', value: money(testedSavings), note: `${pct(negotiatedReduction)} of sale price.` },
    ],
    flags: [
      Math.abs(commissionPct - listingSidePct - buyerBrokerPct) > 0.2 ? 'The total commission does not match the listed side splits. Clarify the agreement before using the number.' : 'The commission split roughly matches the total input.',
      buyerBrokerPct <= 0 ? 'A zero buyer-broker concession may be strategic in some markets, but ask how buyer traffic and offer quality could change.' : 'Buyer-side compensation/concession is visible instead of hidden.',
      negotiatedReduction > 0 ? 'A lower commission should be compared against marketing, negotiation, availability, and pricing strategy, not treated as free savings.' : 'No negotiated reduction is being tested.',
    ],
    notes: ['Commission is a contract and market-strategy question. Put each side and any admin fees in writing.'],
  };
}

function sellerClosingCost(values: Values): Result {
  const salePrice = toNumber(values, 'salePrice');
  const percentCosts = salePrice * toNumber(values, 'sellerClosingPct') / 100;
  const title = toNumber(values, 'titleCompany');
  const tax = toNumber(values, 'taxProration');
  const association = toNumber(values, 'resaleCertificate') + toNumber(values, 'hoaDues') + toNumber(values, 'hoaTransfer');
  const payoffAdmin = toNumber(values, 'payoffDemand');
  const total = percentCosts + title + tax + association + payoffAdmin;

  return {
    headline: `${money(total)} seller closing-cost estimate`,
    metrics: [
      { label: 'Percent-based costs', value: money(percentCosts) },
      { label: 'Title / escrow company', value: money(title) },
      { label: 'Tax proration', value: money(tax) },
      { label: 'Association charges', value: money(association) },
      { label: 'Payoff / recording / wire admin', value: money(payoffAdmin) },
    ],
    flags: [
      tax > 0 ? 'Tax proration is represented. Confirm whether it is a seller debit or credit in your local contract.' : 'Tax proration is blank; this is one of the easiest closing surprises to miss.',
      association > 0 ? 'Association document, dues, and transfer costs are visible.' : 'If the property has an HOA or condo association, add resale docs, transfer fees, dues, and violation/assessment payoff.',
      title > 0 ? 'Title-company charges are separated from generic seller closing costs.' : 'Ask title for a written fee sheet instead of relying on a percentage.',
    ],
    notes: ['Use this as a checklist. Final numbers come from the contract, title company, payoff statement, tax office, and HOA/condo management company.'],
  };
}

function titleCompanyCost(values: Values): Result {
  const settlement = toNumber(values, 'settlementFee');
  const policy = toNumber(values, 'titlePolicy');
  const documentPrep = toNumber(values, 'documentPrep');
  const recording = toNumber(values, 'recordingRelease');
  const wireCourier = toNumber(values, 'wireCourier');
  const endorsements = toNumber(values, 'endorsements');
  const total = settlement + policy + documentPrep + recording + wireCourier + endorsements;

  return {
    headline: `${money(total)} title-company line-item estimate`,
    metrics: [
      { label: 'Settlement / escrow', value: money(settlement) },
      { label: 'Title policy estimate', value: money(policy) },
      { label: 'Document, recording, wire', value: money(documentPrep + recording + wireCourier) },
      { label: 'Endorsements / survey / misc', value: money(endorsements) },
    ],
    flags: [
      policy > total * 0.5 ? 'The title policy is the dominant line. Verify whether seller, buyer, or lender custom pays it in your contract.' : 'No single title line dominates this estimate.',
      wireCourier + documentPrep + recording > 600 ? 'Admin-style fees are material. Ask which are fixed, pass-through, or negotiable.' : 'Admin-style fees are not driving the total.',
      'Ask for the settlement statement early enough to challenge duplicate courier, wire, e-recording, or document-prep charges.',
    ],
    notes: ['Title and escrow fees vary by state, title company, policy type, loan type, contract, and local custom.'],
  };
}

function taxProration(values: Values): Result {
  const annualTaxes = toNumber(values, 'annualTaxes');
  const sellerOwnedDays = clamp(toNumber(values, 'sellerOwnedDays'), 0, 366);
  const dailyTax = annualTaxes / 365;
  const proration = dailyTax * sellerOwnedDays;
  const buffer = toNumber(values, 'taxEscrowBuffer');
  const custom = toStringValue(values, 'taxCustom');
  const totalWithBuffer = proration + buffer;

  return {
    headline: `${money(totalWithBuffer)} tax-proration planning number`,
    metrics: [
      { label: 'Daily tax rate', value: money(dailyTax) },
      { label: 'Seller-owned days', value: numberLabel(sellerOwnedDays, ' days') },
      { label: 'Calculated proration', value: money(proration) },
      { label: 'Timing buffer', value: money(buffer) },
    ],
    flags: [
      custom === 'seller-credit'
        ? 'Modeled as a seller credit/debit to the buyer. Confirm sign and local custom with title.'
        : custom === 'buyer-credit'
          ? 'Modeled as buyer reimbursement for prepaid taxes. Confirm sign and contract wording.'
          : 'Local custom is unknown. Treat this as a reminder line until title confirms direction.',
      sellerOwnedDays > 300 ? 'Late-year closings can create a large proration line.' : 'The proration line is not unusually late-year based on days owned.',
      annualTaxes <= 0 ? 'Annual taxes are blank; this calculator is not useful until the tax bill or estimate is entered.' : 'Annual tax input is present.',
    ],
    notes: ['Tax proration can be one of the most confusing seller net sheet lines because the math and the sign are separate questions.'],
  };
}

function associationCost(values: Values): Result {
  const resale = toNumber(values, 'resaleCertificate');
  const transfer = toNumber(values, 'hoaTransfer');
  const dues = toNumber(values, 'hoaDues');
  const assessment = toNumber(values, 'specialAssessment');
  const rush = toNumber(values, 'rushFee');
  const total = resale + transfer + dues + assessment + rush;

  return {
    headline: `${money(total)} association closing-charge estimate`,
    metrics: [
      { label: 'Resale / condo documents', value: money(resale) },
      { label: 'Transfer fee', value: money(transfer) },
      { label: 'Dues / assessment payoff', value: money(dues + assessment) },
      { label: 'Rush / questionnaire fees', value: money(rush) },
    ],
    flags: [
      assessment > 0 ? 'Special assessment or violation payoff is included. Confirm whether it must be cleared before closing.' : 'No special assessment or violation payoff is modeled.',
      resale + rush > 500 ? 'Document package and rush fees are material. Order early if the contract allows it.' : 'Document package fees are moderate in this scenario.',
      transfer > 0 ? 'Transfer fee is visible. Confirm whether buyer or seller pays it by contract/custom.' : 'Transfer fee is blank; some associations charge it separately from resale documents.',
    ],
    notes: ['Ask the HOA or condo management company for the current resale, estoppel, transfer, questionnaire, rush, dues, and assessment fee sheet.'],
  };
}

function homeSalePrep(values: Values): Result {
  const salePrice = toNumber(values, 'salePrice');
  const market = toStringValue(values, 'marketTemperature');
  const condition = toStringValue(values, 'homeCondition');
  const daysToList = toNumber(values, 'daysToList');
  const avoidedConcessions = toNumber(values, 'avoidedConcessions');
  const blockers = toNumber(values, 'knownRepairBlockers');
  const projectInputs = [
    { key: 'clean', title: 'Deep clean, declutter, junk haul', cost: toNumber(values, 'cleanDeclutterCost'), base: 2.4, capPct: 0.012, quick: true, must: condition === 'rough' },
    { key: 'paint', title: 'Paint touch-up / neutral rooms', cost: toNumber(values, 'paintTouchupCost'), base: 1.55, capPct: 0.018, quick: true, must: condition === 'rough' || condition === 'average' },
    { key: 'flooring', title: 'Flooring repair / carpet replacement', cost: toNumber(values, 'flooringRepairCost'), base: condition === 'rough' ? 1.45 : 1.05, capPct: 0.015, quick: false, must: condition === 'rough' },
    { key: 'curb', title: 'Curb appeal / landscape cleanup', cost: toNumber(values, 'landscapeCurbCost'), base: 1.35, capPct: 0.01, quick: true, must: false },
    { key: 'staging', title: 'Staging, lighting, photo prep', cost: toNumber(values, 'stagingPhotoCost'), base: 1.35, capPct: 0.012, quick: true, must: false },
    { key: 'fixtures', title: 'Visible low-cost swaps', cost: toNumber(values, 'fixturesHardwareCost'), base: 1.1, capPct: 0.007, quick: true, must: false },
    { key: 'kitchenBath', title: 'Kitchen/bath refresh or mini-remodel', cost: toNumber(values, 'kitchenBathRefreshCost'), base: condition === 'rough' ? 0.85 : 0.55, capPct: 0.02, quick: false, must: false },
  ];
  const marketFactor = market === 'cold' ? 1.18 : market === 'hot' ? 0.82 : 1;
  const conditionFactor = condition === 'rough' ? 1.25 : condition === 'average' ? 1 : condition === 'clean-dated' ? 0.78 : 0.55;
  const timeFactor = daysToList < 14 ? 0.72 : daysToList < 30 ? 0.9 : 1;
  const confidence = clamp(0.55 + (market === 'cold' ? 0.08 : market === 'hot' ? -0.06 : 0) + (condition === 'rough' ? 0.08 : condition === 'updated' ? -0.1 : 0) - (daysToList < 21 ? 0.08 : 0), 0.35, 0.82);
  const projects = projectInputs.map((project) => {
    const rawLift = Math.min(project.cost * project.base * marketFactor * conditionFactor * timeFactor, salePrice * project.capPct);
    const adjustedLift = project.cost > 0 ? rawLift * confidence : 0;
    const net = adjustedLift - project.cost;
    return { ...project, adjustedLift, net };
  });
  const prepCost = projects.reduce((sum, project) => sum + project.cost, 0) + blockers;
  const expectedLift = projects.reduce((sum, project) => sum + project.adjustedLift, 0);
  const blockerProtection = Math.min(blockers + avoidedConcessions, salePrice * 0.035);
  const expectedNet = expectedLift + blockerProtection - prepCost;
  const fastProjects = projects.filter((project) => project.quick && project.cost > 0);
  const badLargeRefresh = projects.find((project) => project.key === 'kitchenBath' && project.cost > salePrice * 0.015);

  const options: DecisionOption[] = projects
    .filter((project) => project.cost > 0)
    .map((project) => {
      const roi = project.cost > 0 ? project.adjustedLift / project.cost : 0;
      const stance =
        project.must || roi >= 1.15
          ? 'Do or strongly price this before listing.'
          : roi >= 0.75
            ? 'Maybe, but compare against a price adjustment or credit.'
            : 'Usually skip or credit unless a realtor says it blocks the sale.';
      return {
        title: project.title,
        stance,
        details: [
          `Modeled cost: ${money(project.cost)}.`,
          `Confidence-adjusted buyer value: ${money(project.adjustedLift)}.`,
          `Modeled net before inspection surprises: ${money(project.net)}.`,
        ],
        pushback:
          project.key === 'kitchenBath'
            ? 'Ask: will buyers pay for this exact taste, can it be finished before photos, and would a credit/list-price adjustment be cleaner?'
            : 'Ask: does this remove a visible objection, improve photos, reduce inspection leverage, or just make us feel better?',
      };
    });

  if (blockers > 0) {
    options.unshift({
      title: 'Safety, lender, insurance, or inspection blockers',
      stance: 'Handle first, disclose clearly, or price as a credit. Do not bury these under cosmetics.',
      details: [
        `Modeled blocker budget: ${money(blockers)}.`,
        'Examples: active leak, unsafe electrical, missing handrail, broken HVAC, rotten exterior wood, broken window, roof problem, or lender-required repair.',
        'These often protect the deal more than they raise headline price.',
      ],
      pushback: 'Ask the agent: will this fail lending, insurance, inspection, buyer confidence, or only become a normal negotiation item?',
    });
  }

  return {
    headline: expectedNet >= 0 ? `${money(expectedNet)} expected prep advantage` : `${money(Math.abs(expectedNet))} possible over-prep risk`,
    metrics: [
      { label: 'Total prep spend', value: money(prepCost), note: 'Includes blocker budget and selected prep projects.' },
      { label: 'Confidence-adjusted price lift', value: money(expectedLift), note: `${pct(confidence * 100)} confidence factor after market, condition, and timing.` },
      { label: 'Concession / deal-risk protection', value: money(blockerProtection) },
      { label: 'Expected net effect', value: money(expectedNet) },
    ],
    flags: [
      blockers > 0 ? 'Must-fix or must-disclose items should come before cosmetic prep. These are deal-risk items, not decorating choices.' : 'No blocker budget is modeled. Make sure there are no lender, insurance, safety, or inspection problems hiding under cosmetics.',
      daysToList < 21 ? 'Short timeline: prioritize cleaning, declutter, photos, curb appeal, touch-up, and obvious repair. Avoid projects that can miss listing day.' : 'There is enough time to compare bids and stage the work if scope stays controlled.',
      prepCost > salePrice * 0.03 ? 'Prep spend is above 3 percent of expected price. That deserves realtor/contractor signoff before spending.' : 'Prep spend is within a moderate band for this sale price.',
      badLargeRefresh ? 'Kitchen/bath refresh looks large relative to sale price. This is where sellers often buy retail and recover wholesale.' : 'No large kitchen/bath refresh risk is modeled.',
      market === 'hot' ? 'In a hot market, price and availability can beat perfection. Do not over-prep just because a checklist exists.' : market === 'cold' ? 'In a buyer-favorable market, visible neglect creates leverage. Prep can matter more, but only if targeted.' : 'Balanced market: prep should remove objections without chasing perfection.',
      fastProjects.length > 0 ? 'Quick-win items are present. These usually help photos and first-showing confidence more reliably than rushed remodels.' : 'No quick-win prep is modeled; make sure the listing will photograph cleanly.',
    ],
    notes: [
      'This is a seller decision tool, not an appraisal. The goal is to decide what to do, what to disclose, what to credit, and what to skip.',
      'Keep receipts and before/after photos so the work supports the listing narrative and buyer confidence.',
    ],
    options,
  };
}

function selfEmploymentTax(values: Values): Result {
  const revenue = toNumber(values, 'revenue');
  const expenses = toNumber(values, 'expenses');
  const w2Wages = toNumber(values, 'w2Wages');
  const netProfit = Math.max(0, revenue - expenses);
  const seBase = netProfit * 0.9235;
  const remainingSsBase = Math.max(0, SS_WAGE_BASE_2026 - w2Wages);
  const socialSecurityTax = Math.min(seBase, remainingSsBase) * 0.124;
  const medicareTax = seBase * 0.029;
  const seTax = socialSecurityTax + medicareTax;
  const halfSeDeduction = seTax / 2;
  const health = toNumber(values, 'healthInsurance');
  const retirement = toNumber(values, 'retirement');
  const qbiBase = Math.max(0, netProfit - halfSeDeduction - health - retirement);
  const qbiDeduction = isChecked(values, 'qbi') ? qbiBase * 0.2 : 0;
  const incomeTaxBase = Math.max(0, netProfit - halfSeDeduction - health - retirement - qbiDeduction);
  const incomeTaxReserve = incomeTaxBase * ((toNumber(values, 'federalRate') + toNumber(values, 'stateRate')) / 100);
  const totalTaxReserve = seTax + incomeTaxReserve;
  const takeHomeBeforePersonal = revenue - expenses - totalTaxReserve - retirement - health;

  return {
    headline: `${money(totalTaxReserve)} suggested tax reserve from entered assumptions`,
    metrics: [
      { label: 'Net business profit', value: money(netProfit) },
      { label: 'Estimated federal self-employment tax', value: money(seTax), note: 'Social Security plus Medicare estimate.' },
      { label: 'Rough QBI deduction', value: money(qbiDeduction) },
      { label: 'Estimated take-home before personal expenses', value: money(takeHomeBeforePersonal) },
    ],
    flags: [
      expenses / Math.max(1, revenue) > 0.5 ? 'Expenses are more than half of revenue; records and business purpose matter.' : 'Expense ratio is not unusually high in this scenario.',
      w2Wages >= SS_WAGE_BASE_2026 ? 'W-2 wages may already fill the Social Security wage base, reducing SE Social Security tax.' : 'Self-employment income may still be subject to Social Security tax up to the wage base.',
      qbiDeduction > 0 ? 'QBI is estimated roughly; phaseouts and specified-service rules can change it.' : 'QBI estimate is off or unavailable in this scenario.',
    ],
    notes: ['This is a planning reserve, not your tax bill. Use Form 1040-ES and current tax software or a tax professional before sending payments.'],
  };
}

function quarterlyTax(values: Values): Result {
  const annualTax = toNumber(values, 'annualTax');
  const withheld = toNumber(values, 'withheld');
  const quartersLeft = Math.max(1, toNumber(values, 'quartersLeft'));
  const cushionPct = toNumber(values, 'cushionPct') / 100;
  const remaining = Math.max(0, annualTax - withheld);
  const withCushion = remaining * (1 + cushionPct);
  const perQuarter = withCushion / quartersLeft;

  return {
    headline: `${money(perQuarter)} planning payment per remaining period`,
    metrics: [
      { label: 'Remaining estimated tax', value: money(remaining) },
      { label: 'Reserve with cushion', value: money(withCushion) },
      { label: 'Periods left', value: numberLabel(quartersLeft) },
      { label: 'Cushion', value: pct(cushionPct * 100) },
    ],
    flags: [
      withheld > annualTax ? 'You may already be over-reserved based on this estimate.' : 'You still have estimated tax to cover.',
      cushionPct > 0 ? 'Cushion reduces underpayment risk but can over-reserve cash.' : 'No cushion is included.',
      'Uneven-income users may need the annualized income installment method or Form 2210 instead of simply dividing by four.',
    ],
    notes: ['This estimates a planning payment for a federal estimated-tax deadline. It does not guarantee penalty avoidance.'],
  };
}

function deductionPlanner(values: Values): Result {
  const mileage = toNumber(values, 'businessMiles') * BUSINESS_MILEAGE_RATE_2026;
  const homeOffice = Math.min(toNumber(values, 'homeOfficeSqft'), 300) * 5;
  const software = toNumber(values, 'software');
  const phoneInternet = toNumber(values, 'phoneInternet');
  const meals = toNumber(values, 'meals') * 0.5;
  const travel = toNumber(values, 'travel');
  const equipment = toNumber(values, 'equipment');
  const total = mileage + homeOffice + software + phoneInternet + meals + travel + equipment;
  const flags = [
    toNumber(values, 'businessMiles') > 0 ? 'Mileage needs a log with date, destination, business purpose, and miles.' : 'No mileage deduction modeled.',
    toNumber(values, 'homeOfficeSqft') > 0 ? 'Home office needs regular and exclusive business use support.' : 'No home-office deduction modeled.',
    meals > 0 ? 'Meals need business purpose and records; entertainment-like spend is risky.' : 'No meal deduction modeled.',
    travel > 0 ? 'Travel mixed with personal days needs stronger allocation records.' : 'No travel deduction modeled.',
    equipment > 5000 ? 'Large equipment deductions should be tied to business use and placed-in-service records.' : 'Equipment deduction is moderate in this scenario.',
  ];

  return {
    headline: `${money(total)} rough expense documentation inventory`,
    metrics: [
      { label: 'Mileage estimate', value: money(mileage), note: 'Uses 2026 IRS business mileage rate.' },
      { label: 'Simplified home-office estimate', value: money(homeOffice), note: 'Simplified method-style cap used as a planning frame.' },
      { label: 'Meals after 50 percent haircut', value: money(meals) },
      { label: 'Other modeled deductions', value: money(software + phoneInternet + travel + equipment) },
    ],
    flags,
    notes: ['This is an inventory of possible deductions and documentation, not a filing position.'],
  };
}

function sCorp(values: Values): Result {
  const profit = toNumber(values, 'profit');
  const salary = Math.min(profit, toNumber(values, 'salary'));
  const distributions = Math.max(0, profit - salary);
  const solePropSeBase = profit * 0.9235;
  const solePropPayrollTax = Math.min(solePropSeBase, SS_WAGE_BASE_2026) * 0.124 + solePropSeBase * 0.029;
  const salaryPayrollTax = Math.min(salary, SS_WAGE_BASE_2026) * 0.153;
  const admin = toNumber(values, 'payrollAdmin') + toNumber(values, 'stateCorpCost');
  const grossSavings = Math.max(0, solePropPayrollTax - salaryPayrollTax);
  const netSavings = grossSavings - admin;

  return {
    headline: `${money(netSavings)} possible S-corp spread after admin assumptions`,
    metrics: [
      { label: 'Estimated sole-prop SE/payroll tax', value: money(solePropPayrollTax) },
      { label: 'Salary payroll tax estimate', value: money(salaryPayrollTax) },
      { label: 'Distribution before income tax', value: money(distributions) },
      { label: 'Admin and state/entity cost', value: money(admin) },
    ],
    flags: [
      salary < profit * 0.45 ? 'Salary is low relative to profit; reasonable-salary support is critical.' : 'Salary is not extremely low relative to profit in this scenario.',
      netSavings <= 0 ? 'Payroll, filing, state, and admin costs may erase the S-corp benefit.' : 'There may be a planning benefit worth reviewing with a CPA.',
    ],
    notes: ['This does not determine reasonable salary or a filing position. Income tax, QBI, retirement plan design, state rules, and reasonable salary can change the result.'],
  };
}

function contractorEmployee(values: Values): Result {
  const contractorCost = toNumber(values, 'contractorRate') * toNumber(values, 'hours');
  const wageCost = toNumber(values, 'employeeRate') * toNumber(values, 'hours');
  const burden = wageCost * toNumber(values, 'burdenPct') / 100;
  const employeeTotal = wageCost + burden + toNumber(values, 'employeeOverhead');
  const spread = employeeTotal - contractorCost;

  return {
    headline: spread > 0 ? `${money(Math.abs(spread))} cheaper as contractor on cost only` : `${money(Math.abs(spread))} cheaper as employee on cost only`,
    metrics: [
      { label: 'Contractor annual cost', value: money(contractorCost) },
      { label: 'Employee wage cost', value: money(wageCost) },
      { label: 'Payroll burden and benefits', value: money(burden) },
      { label: 'Employee total cost', value: money(employeeTotal) },
    ],
    flags: [
      'Worker classification depends on control, independence, and legal facts, not cost preference.',
      toNumber(values, 'hours') >= 1800 ? 'Full-time utilization may favor employee economics if classification is proper.' : 'Part-time or variable utilization may favor contractor economics.',
    ],
    notes: ['This is a cost and operating-tradeoff comparison, not a classification tool. State labor, unemployment, workers comp, and benefits rules can change the cost picture.'],
  };
}

function freelanceRate(values: Values): Result {
  const targetTakeHome = toNumber(values, 'targetTakeHome');
  const expenses = toNumber(values, 'businessExpenses');
  const taxReserve = toNumber(values, 'taxReservePct') / 100;
  const billableHours = Math.max(1, toNumber(values, 'billableHoursPerWeek') * toNumber(values, 'workWeeks'));
  const profitReserve = toNumber(values, 'profitReservePct') / 100;
  const discount = toNumber(values, 'discountPct') / 100;
  const preTaxNeed = targetTakeHome / Math.max(0.1, 1 - taxReserve);
  const revenueNeed = (preTaxNeed + expenses) * (1 + profitReserve);
  const protectedRevenue = revenueNeed / Math.max(0.1, 1 - discount);
  const hourly = protectedRevenue / billableHours;

  return {
    headline: `${money(hourly)} minimum hourly rate`,
    metrics: [
      { label: 'Annual revenue needed', value: money(protectedRevenue) },
      { label: 'Billable hours/year', value: numberLabel(billableHours, ' hrs') },
      { label: 'Monthly revenue target', value: money(protectedRevenue / 12) },
      { label: 'Tax reserve represented', value: money(protectedRevenue * taxReserve) },
    ],
    flags: [
      toNumber(values, 'billableHoursPerWeek') < 25 ? 'Low billable hours drive the rate up. That is normal, not greed.' : 'Billable hours are not unusually low in this scenario.',
      toNumber(values, 'discountPct') > 0 ? 'Discounts and unpaid scope creep are being protected in the floor rate.' : 'No discount/scope-creep protection is modeled.',
      hourly < 50 ? 'This may be too low for many professional services after sales, admin, taxes, and slow months.' : 'Rate floor includes the hidden time and reserve assumptions.',
    ],
    notes: ['This is the minimum viable floor. Positioning, scarcity, outcomes, and risk may justify more.'],
  };
}

function marginPricing(values: Values): Result {
  const price = toNumber(values, 'price');
  const directCost = toNumber(values, 'directCost');
  const overhead = toNumber(values, 'overheadShare');
  const discount = toNumber(values, 'discountPct') / 100;
  const targetMargin = toNumber(values, 'targetMarginPct') / 100;
  const discountedPrice = price * (1 - discount);
  const allCost = directCost + overhead;
  const grossProfit = discountedPrice - allCost;
  const margin = discountedPrice > 0 ? grossProfit / discountedPrice : 0;
  const markup = allCost > 0 ? grossProfit / allCost : 0;
  const targetPrice = allCost / Math.max(0.05, 1 - targetMargin);

  return {
    headline: `${pct(margin * 100)} margin after tested discount`,
    metrics: [
      { label: 'Discounted price', value: money(discountedPrice) },
      { label: 'Profit dollars after costs', value: money(grossProfit) },
      { label: 'Markup on total cost', value: pct(markup * 100) },
      { label: 'Price needed for target margin', value: money(targetPrice) },
    ],
    flags: [
      margin < targetMargin ? 'The tested price misses the target margin. Raise price, reduce cost, or stop discounting.' : 'The tested price clears the target margin.',
      discount > 0.15 ? 'Large discounts look harmless in revenue and painful in profit.' : 'Discount pressure is moderate in this scenario.',
    ],
    notes: ['Margin is the share of price kept after costs; markup is profit relative to cost. Mixing them causes bad pricing.'],
  };
}

function breakEven(values: Values): Result {
  const fixed = toNumber(values, 'fixedMonthly');
  const ownerPay = toNumber(values, 'ownerPay');
  const reserve = toNumber(values, 'cashReserve');
  const averageSale = Math.max(1, toNumber(values, 'averageSale'));
  const contributionMargin = Math.max(0.05, 1 - toNumber(values, 'variableCostPct') / 100);
  const monthlyNeed = fixed + ownerPay + reserve;
  const revenueNeeded = monthlyNeed / contributionMargin;
  const clientsNeeded = revenueNeeded / averageSale;

  return {
    headline: `${money(revenueNeeded)} monthly break-even revenue`,
    metrics: [
      { label: 'Clients / sales needed', value: numberLabel(clientsNeeded) },
      { label: 'Contribution margin', value: pct(contributionMargin * 100) },
      { label: 'Monthly cost floor', value: money(monthlyNeed) },
      { label: 'Annualized break-even revenue', value: money(revenueNeeded * 12) },
    ],
    flags: [
      clientsNeeded > 20 ? 'This model may require too many small customers unless fulfillment is very efficient.' : 'Client count looks operationally plausible if sales and delivery can support it.',
      ownerPay <= 0 ? 'Owner pay is missing. Break-even without the owner is not a healthy target.' : 'Owner pay is represented instead of treated as leftovers.',
    ],
    notes: ['Break-even is not the goal. It is the line where the business stops bleeding.'],
  };
}

function profitPlan(values: Values): Result {
  const revenue = toNumber(values, 'revenue');
  const directCost = revenue * toNumber(values, 'directCostPct') / 100;
  const operating = toNumber(values, 'operatingExpenses');
  const ownerPay = toNumber(values, 'ownerPay');
  const preTaxProfit = revenue - directCost - operating - ownerPay;
  const taxReserve = Math.max(0, preTaxProfit) * toNumber(values, 'taxReservePct') / 100;
  const retained = preTaxProfit - taxReserve;
  const goal = toNumber(values, 'retainedProfitGoal');

  return {
    headline: `${money(retained)} retained profit after modeled tax reserve`,
    metrics: [
      { label: 'Direct costs', value: money(directCost) },
      { label: 'Operating expenses', value: money(operating) },
      { label: 'Owner pay', value: money(ownerPay) },
      { label: 'Retained profit gap', value: money(retained - goal) },
    ],
    flags: [
      retained < goal ? 'The model misses the retained-profit goal. Price, cost, volume, or owner pay needs another pass.' : 'The model clears the retained-profit goal.',
      preTaxProfit < 0 ? 'The business is not covering direct cost, operating expenses, and owner pay under these inputs.' : 'Pre-tax profit is positive under these inputs.',
    ],
    notes: ['Tax reserve is simplified. Use actual books and tax guidance before distributing profit.'],
  };
}

function hireAutomate(values: Values): Result {
  const hours = toNumber(values, 'taskHoursWeek');
  const ownerValue = hours * toNumber(values, 'ownerHourlyValue') * 4.33;
  const employee = toNumber(values, 'employeeMonthlyCost');
  const contractor = hours * toNumber(values, 'contractorHourlyRate') * 4.33;
  const automationCoverage = toNumber(values, 'automationCoveragePct') / 100;
  const reviewCost = toNumber(values, 'reviewHoursWeek') * toNumber(values, 'ownerHourlyValue') * 4.33;
  const automationMonthly = toNumber(values, 'automationMonthlyCost') + reviewCost + toNumber(values, 'automationSetupCost') / 12;
  const valueRemoved = ownerValue * automationCoverage;
  const netAutomation = valueRemoved - automationMonthly;
  const best = Math.min(employee, contractor, automationMonthly);

  return {
    headline: netAutomation > 0 ? `${money(netAutomation)} monthly automation spread` : 'Automation does not pay back yet',
    metrics: [
      { label: 'Employee monthly cost', value: money(employee) },
      { label: 'Contractor monthly cost', value: money(contractor) },
      { label: 'Automation monthly equivalent', value: money(automationMonthly) },
      { label: 'Lowest modeled cash path', value: money(best) },
    ],
    flags: [
      automationCoverage < 0.4 ? 'Automation removes less than 40 percent of the work. Delete, simplify, or document the process before buying tools.' : 'Automation removes a material share of the work if the coverage estimate is honest.',
      toNumber(values, 'reviewHoursWeek') > hours * 0.25 ? 'Review/babysitting work is high. The tool may be shifting work instead of removing it.' : 'Review work is not dominating the automation path.',
      employee > ownerValue ? 'A full employee costs more than the monthly value of this task. Redesign the role or combine responsibilities.' : 'Employee cost is within range of the task value if the role is broader than this workflow.',
    ],
    notes: ['A person adds judgment and accountability. Automation removes repetitive work only when the workflow is already clear. AI ROI is not real until the workflow changes.'],
  };
}

function revenueForecast(values: Values): Result {
  const current = toNumber(values, 'currentMonthlyRevenue');
  const newRevenue = toNumber(values, 'newLeads') * (toNumber(values, 'closeRatePct') / 100) * toNumber(values, 'averageDeal');
  const churn = current * toNumber(values, 'churnPct') / 100;
  const forecast = current + newRevenue - churn;
  const delay = toNumber(values, 'collectionDelayDays');
  const delayedCash = forecast * Math.max(0, 1 - delay / 90);

  return {
    headline: `${money(forecast)} forecast monthly revenue`,
    metrics: [
      { label: 'New revenue from assumptions', value: money(newRevenue) },
      { label: 'Revenue lost to churn', value: money(churn) },
      { label: 'Cash-timing adjusted view', value: money(delayedCash), note: 'Simple delay stress test.' },
      { label: 'Net growth', value: money(forecast - current) },
    ],
    flags: [
      newRevenue < churn ? 'New sales do not cover churn. Growth work may be masking a retention leak.' : 'New sales cover modeled churn.',
      delay >= 45 ? 'Collection delay is long enough to make revenue feel better than cash.' : 'Collection delay is not extreme in this scenario.',
    ],
    notes: ['Forecasts are stress tests. Re-run with lower close rate and one client loss before trusting the plan.'],
  };
}

function salesTarget(values: Values): Result {
  const gap = Math.max(0, toNumber(values, 'revenueGoal') - toNumber(values, 'currentRevenue'));
  const deals = gap / Math.max(1, toNumber(values, 'averageDeal'));
  const proposals = deals / Math.max(0.01, toNumber(values, 'proposalClosePct') / 100);
  const leads = proposals / Math.max(0.01, toNumber(values, 'leadToProposalPct') / 100);
  const cycle = toNumber(values, 'salesCycleWeeks');

  return {
    headline: `${numberLabel(leads)} leads needed for the revenue gap`,
    metrics: [
      { label: 'Revenue gap', value: money(gap) },
      { label: 'Deals needed', value: numberLabel(deals) },
      { label: 'Proposals needed', value: numberLabel(proposals) },
      { label: 'Sales cycle', value: numberLabel(cycle, ' weeks') },
    ],
    flags: [
      leads > 100 ? 'Lead requirement is high. Improve deal size, close rate, retention, or timeline before demanding more activity.' : 'Lead requirement is not obviously impossible if the channel exists.',
      cycle > 6 ? 'Sales cycle is long. Revenue may arrive later than the monthly goal implies.' : 'Sales cycle is short enough to adjust within a quarter.',
    ],
    notes: ['More leads is not the answer if proposal rate, close rate, deal size, or sales-cycle timing is the bottleneck.'],
  };
}

function churn(values: Values): Result {
  const current = toNumber(values, 'currentRevenue');
  const lost = current * toNumber(values, 'churnPct') / 100;
  const expansion = current * toNumber(values, 'expansionPct') / 100;
  const newRevenue = toNumber(values, 'newRevenue');
  const net = current - lost + expansion + newRevenue;
  const customersLost = lost / Math.max(1, toNumber(values, 'averageCustomerRevenue'));

  return {
    headline: `${money(lost)} monthly revenue leak`,
    metrics: [
      { label: 'Customers / accounts to replace', value: numberLabel(customersLost) },
      { label: 'Expansion offset', value: money(expansion) },
      { label: 'New revenue after churn', value: money(net) },
      { label: 'Net revenue change', value: money(net - current) },
    ],
    flags: [
      lost > newRevenue ? 'Churn is larger than new recurring revenue. Retention may beat more acquisition.' : 'New recurring revenue covers churn in this scenario.',
      toNumber(values, 'churnPct') > 8 ? 'Monthly churn is high for many recurring models. Segment who is leaving and why.' : 'Churn is not extreme in this scenario.',
    ],
    notes: ['Churn is often a trust, fit, onboarding, or outcome problem before it is a pricing problem.'],
  };
}

function subscriptionPricing(values: Values): Result {
  const subscribers = toNumber(values, 'subscribers');
  const monthlyPrice = toNumber(values, 'monthlyPrice');
  const mrr = subscribers * monthlyPrice;
  const annualPrice = monthlyPrice * 12 * (1 - toNumber(values, 'annualDiscountPct') / 100);
  const grossProfit = mrr * toNumber(values, 'grossMarginPct') / 100;
  const churned = subscribers * toNumber(values, 'churnPct') / 100;
  const cac = toNumber(values, 'acquisitionCost');
  const paybackMonths = grossProfit > 0 && subscribers > 0 ? cac / (grossProfit / subscribers) : Infinity;

  return {
    headline: `${money(mrr)} monthly recurring revenue`,
    metrics: [
      { label: 'Annual plan price', value: money(annualPrice) },
      { label: 'Monthly gross profit', value: money(grossProfit) },
      { label: 'Subscribers lost/month', value: numberLabel(churned) },
      { label: 'CAC payback', value: Number.isFinite(paybackMonths) ? numberLabel(paybackMonths, ' months') : 'n/a' },
    ],
    flags: [
      paybackMonths > 12 ? 'Acquisition payback is slow under these assumptions.' : 'Acquisition payback is within a range many operators would inspect.',
      toNumber(values, 'annualDiscountPct') > 20 ? 'Large annual discounts improve cash now but reduce price flexibility later.' : 'Annual discount is moderate.',
    ],
    notes: ['Subscription pricing has to survive churn, support, acquisition cost, and gross margin, not just monthly appeal.'],
  };
}

function operatingLeverage(values: Values): Result {
  const revenue = toNumber(values, 'revenue');
  const fixed = toNumber(values, 'fixedCosts');
  const variable = revenue * toNumber(values, 'variableCostPct') / 100;
  const profit = revenue - fixed - variable;
  const nextRevenue = revenue * (1 + toNumber(values, 'revenueGrowthPct') / 100);
  const nextFixed = fixed * (1 + toNumber(values, 'fixedCostGrowthPct') / 100);
  const nextVariable = nextRevenue * toNumber(values, 'variableCostPct') / 100;
  const nextProfit = nextRevenue - nextFixed - nextVariable;

  return {
    headline: `${money(nextProfit - profit)} projected profit change`,
    metrics: [
      { label: 'Current monthly profit', value: money(profit) },
      { label: 'Scenario monthly profit', value: money(nextProfit) },
      { label: 'Current fixed cost share', value: pct((fixed / Math.max(1, revenue)) * 100) },
      { label: 'Scenario revenue', value: money(nextRevenue) },
    ],
    flags: [
      nextProfit <= profit ? 'Growth is not improving profit under these assumptions. Fixed or variable costs are rising too fast.' : 'Growth improves profit under these assumptions.',
      fixed / Math.max(1, revenue) > 0.5 ? 'Fixed costs are heavy. Revenue dips can hurt fast.' : 'Fixed cost share is not extreme in this scenario.',
    ],
    notes: ['Operating leverage is useful only when fixed costs stay controlled while revenue grows.'],
  };
}

function saasCost(values: Values): Result {
  const base = toNumber(values, 'baseToolsMonthly');
  const seats = toNumber(values, 'seats');
  const seatSpend = seats * toNumber(values, 'pricePerSeat');
  const duplicate = toNumber(values, 'duplicateToolsMonthly');
  const monthly = base + seatSpend + duplicate;
  const unused = seatSpend * toNumber(values, 'unusedSeatPct') / 100;
  const nextYear = monthly * 12 * (1 + toNumber(values, 'priceIncreasePct') / 100);

  return {
    headline: `${money(monthly)} monthly software stack`,
    metrics: [
      { label: 'Annual software spend', value: money(monthly * 12) },
      { label: 'Unused seat exposure', value: money(unused) },
      { label: 'Duplicate tool exposure', value: money(duplicate) },
      { label: 'Next-year price increase case', value: money(nextYear) },
    ],
    flags: [
      unused > 500 ? 'Unused seats are large enough to audit before renewal.' : 'Unused seat exposure is modest in this scenario.',
      duplicate > 0 ? 'Duplicate tool spend is visible. Decide which workflow owns the job.' : 'No duplicate-tool spend modeled.',
    ],
    notes: ['The first cleanup pass is usually seats, duplicate tools, annual renewals, and tools nobody owns. Do not assume every seat can be cancelled mid-term.'],
  };
}

function cloudCost(values: Values): Result {
  const base = toNumber(values, 'computeMonthly') + toNumber(values, 'storageMonthly') + toNumber(values, 'dataTransferMonthly');
  const envFactor = Math.max(1, toNumber(values, 'environments')) / 3;
  const grown = base * envFactor * (1 + toNumber(values, 'growthPct') / 100);
  const withOverrun = grown * (1 + toNumber(values, 'overrunPct') / 100);

  return {
    headline: `${money(withOverrun)} monthly cloud stress case`,
    metrics: [
      { label: 'Current monthly baseline', value: money(base) },
      { label: 'Environment-adjusted scenario', value: money(grown) },
      { label: 'Annual stress case', value: money(withOverrun * 12) },
      { label: 'Overrun buffer', value: money(withOverrun - grown) },
    ],
    flags: [
      toNumber(values, 'dataTransferMonthly') > base * 0.2 ? 'Data transfer is a meaningful part of the bill. Track egress and CDN behavior.' : 'Data transfer is not dominating the bill in this scenario.',
      toNumber(values, 'environments') > 3 ? 'Multiple environments can quietly multiply cost. Audit idle dev/staging workloads.' : 'Environment count is moderate.',
    ],
    notes: ['Provider calculators help, but this page is meant to expose growth, environments, region, data-transfer, commitment, and overrun pressure.'],
  };
}

function softwareRoi(values: Values): Result {
  const grossHoursValue = toNumber(values, 'hoursSavedWeek') * toNumber(values, 'hourlyValue') * 4.33;
  const reviewCost = toNumber(values, 'reviewHoursWeek') * toNumber(values, 'hourlyValue') * 4.33;
  const adoptedValue = grossHoursValue * toNumber(values, 'adoptionPct') / 100;
  const monthlyCost = toNumber(values, 'monthlyCost') + reviewCost + toNumber(values, 'setupCost') / 12;
  const benefit = adoptedValue + toNumber(values, 'errorReductionMonthly');
  const net = benefit - monthlyCost;

  return {
    headline: net >= 0 ? `${money(net)} monthly ROI after adoption` : `${money(Math.abs(net))} monthly shortfall`,
    metrics: [
      { label: 'Adoption-adjusted time value', value: money(adoptedValue) },
      { label: 'Review / maintenance cost', value: money(reviewCost) },
      { label: 'Monthly cost with setup', value: money(monthlyCost) },
      { label: 'Total modeled monthly benefit', value: money(benefit) },
    ],
    flags: [
      toNumber(values, 'adoptionPct') < 50 ? 'Adoption is low. The tool may have negative ROI even if the demo looked good.' : 'Adoption assumption is material enough to test.',
      reviewCost > adoptedValue * 0.4 ? 'Review work consumes much of the time savings. The workflow may not be redesigned enough.' : 'Review work is not consuming most of the modeled savings.',
    ],
    notes: ['ROI is not real until the workflow changes and the old work actually disappears. Adoption, review time, maintenance, and contract terms can erase demo math.'],
  };
}

function subscriptionCrossover(values: Values): Result {
  const months = Math.max(1, toNumber(values, 'expectedMonths'));
  const monthly = toNumber(values, 'monthlyPrice') * months;
  const annualYears = Math.ceil(months / 12);
  const annual = toNumber(values, 'annualPrice') * annualYears;
  const lifetime = toNumber(values, 'lifetimePrice') + toNumber(values, 'lifetimeRiskCost');
  const increase = toNumber(values, 'priceIncreasePct') / 100;
  const monthlyWithIncreases = Array.from({ length: months }).reduce<number>((sum, _, index) => sum + toNumber(values, 'monthlyPrice') * Math.pow(1 + increase, Math.floor(index / 12)), 0);
  const breakEvenMonths = toNumber(values, 'monthlyPrice') > 0 ? lifetime / toNumber(values, 'monthlyPrice') : Infinity;

  return {
    headline: `${numberLabel(breakEvenMonths, ' months')} lifetime crossover`,
    metrics: [
      { label: 'Monthly plan total', value: money(monthly) },
      { label: 'Monthly with increases', value: money(monthlyWithIncreases) },
      { label: 'Annual plan total', value: money(annual) },
      { label: 'Lifetime risk-adjusted total', value: money(lifetime) },
    ],
    flags: [
      lifetime < monthlyWithIncreases ? 'Lifetime looks cheaper over the expected use period if update/support risk is acceptable.' : 'Subscription preserves optionality under these assumptions.',
      months < breakEvenMonths ? 'Expected use is shorter than lifetime crossover. Monthly or annual may be cleaner.' : 'Expected use is long enough to consider commitment.',
    ],
    notes: ['Lifetime deals can be cheap or clutter. Price the risk that updates, support, renewal rights, cancellation terms, or workflow fit fades.'],
  };
}

function cloudExit(values: Values): Result {
  const current = toNumber(values, 'currentMonthlyCloud');
  const target = toNumber(values, 'targetMonthlyCost');
  const monthlySavings = current - target;
  const egress = toNumber(values, 'egressTb') * toNumber(values, 'egressPerTb');
  const labor = toNumber(values, 'migrationHours') * toNumber(values, 'hourlyRate');
  const dualRun = current * toNumber(values, 'dualRunMonths');
  const exitCost = egress + labor + dualRun + toNumber(values, 'refactorCost');
  const payback = monthlySavings > 0 ? exitCost / monthlySavings : Infinity;

  return {
    headline: Number.isFinite(payback) ? `${numberLabel(payback, ' months')} exit payback` : 'No payback if target cost is not lower',
    metrics: [
      { label: 'One-time exit cost', value: money(exitCost) },
      { label: 'Monthly savings after exit', value: money(monthlySavings) },
      { label: 'Migration labor', value: money(labor) },
      { label: 'Dual-running cost', value: money(dualRun) },
    ],
    flags: [
      !Number.isFinite(payback) || payback > 24 ? 'Exit economics are weak unless there are strategic, compliance, or reliability reasons.' : 'Exit economics are worth deeper technical review.',
      dualRun > 0 ? 'Dual-running cost is represented. Many migration estimates forget it.' : 'No dual-running period is modeled; verify that is realistic.',
    ],
    notes: ['Leaving cloud may include egress, refactor, dual-run, contracts, operational change, retraining, and lost platform features. Some providers offer transfer relief programs, but eligibility and process vary.'],
  };
}

function careCost(values: Values): Result {
  const careType = toStringValue(values, 'careType');
  const homeCareMonthly = toNumber(values, 'hoursPerWeek') * toNumber(values, 'hourlyRate') * 4.33;
  const facilityMonthly = toNumber(values, 'facilityMonthly') + toNumber(values, 'careLevelAddOn');
  const base = careType === 'home-care' ? homeCareMonthly : careType === 'adult-day' ? homeCareMonthly * 0.55 : facilityMonthly;
  const monthly = base + toNumber(values, 'supplies');
  const annual = monthly * 12;
  const inflation = toNumber(values, 'inflation') / 100;
  const fiveYear = Array.from({ length: 5 }).reduce<number>(
    (sum, _, index) => sum + annual * Math.pow(1 + inflation, index),
    0,
  );

  return {
    headline: `${money(monthly)} estimated monthly care cost`,
    metrics: [
      { label: 'Annual cost', value: money(annual) },
      { label: '5-year projected cost', value: money(fiveYear), note: 'Uses the annual increase assumption.' },
      { label: 'Home-care equivalent', value: money(homeCareMonthly) },
      { label: 'Facility path before extras', value: money(facilityMonthly) },
    ],
    flags: [
      monthly > 8000 ? 'This is a high monthly exposure; screen benefits, insurance, Medicaid, VA, and family workload options.' : 'Monthly exposure is material but not extreme in this scenario.',
      careType !== 'home-care' ? 'Facility base price may exclude medication management, memory care, incontinence, transport, and move-in fees.' : 'Home-care schedules need backup coverage and payroll/agency clarity.',
    ],
    notes: ['Care needs can change quickly. Re-run scenarios after hospitalizations, falls, cognitive changes, or caregiver burnout.'],
  };
}

function caregiverHours(values: Values): Result {
  const adl = toNumber(values, 'adl');
  const iadl = toNumber(values, 'iadl');
  const supervision = toNumber(values, 'supervision');
  const medicalTasks = toNumber(values, 'medicalTasks');
  const trips = toNumber(values, 'transportTrips');
  const weeklyHours = adl * 4.5 + iadl * 2.2 + supervision * 2.5 + medicalTasks * 0.35 + trips * 2.5;
  const monthlyHours = weeklyHours * 4.33;

  return {
    headline: `${numberLabel(weeklyHours, ' hours/week')} estimated workload`,
    metrics: [
      { label: 'Monthly hours', value: numberLabel(monthlyHours, ' hours') },
      { label: 'ADL pressure', value: numberLabel(adl, ' areas') },
      { label: 'Supervision severity', value: numberLabel(supervision, '/10') },
      { label: 'Transport time', value: numberLabel(trips * 2.5, ' hrs/week') },
    ],
    flags: [
      supervision >= 7 ? 'High supervision needs can make informal care unsafe without backup coverage.' : 'Supervision pressure is moderate in this scenario.',
      weeklyHours > 40 ? 'This is close to or above a full-time job. Budget respite and backup care.' : 'Workload may be shareable if family coverage is reliable.',
    ],
    notes: ['This is not a clinical acuity score; it is a family workload planner.'],
  };
}

function medicareCost(values: Values): Result {
  const monthly =
    toNumber(values, 'partB') +
    toNumber(values, 'partD') +
    toNumber(values, 'medigap') +
    toNumber(values, 'drugs') +
    toNumber(values, 'dentalVision') +
    toNumber(values, 'medicalOop');
  const annual = monthly * 12;

  return {
    headline: `${money(monthly)} estimated monthly Medicare budget`,
    metrics: [
      { label: 'Annual Medicare-related budget', value: money(annual) },
      { label: 'Part B premium input', value: money(toNumber(values, 'partB')) },
      { label: 'Plan/supplement premiums', value: money(toNumber(values, 'partD') + toNumber(values, 'medigap')) },
      { label: 'Out-of-pocket and uncovered items', value: money(toNumber(values, 'drugs') + toNumber(values, 'dentalVision') + toNumber(values, 'medicalOop')) },
    ],
    flags: [
      'Long-term custodial care usually needs a separate plan from Medicare premiums.',
      toNumber(values, 'partB') > 202.9 ? 'Part B is above the 2026 standard premium input; IRMAA or other billing may be involved.' : 'Part B uses the 2026 standard premium default or lower.',
    ],
    notes: ['Plan formularies, networks, IRMAA, Medigap pricing, and state rules change real costs.'],
  };
}

function foreignCaregiver(values: Values): Result {
  const wages = toNumber(values, 'hourlyWage') * toNumber(values, 'hoursPerWeek') * 52;
  const payroll = wages * toNumber(values, 'payrollTaxPct') / 100;
  const setup = toNumber(values, 'legalFees') + toNumber(values, 'travelSetup');
  const firstYear = wages + payroll + setup;
  const monthly = firstYear / 12;

  return {
    headline: `${money(firstYear)} first-year household-employer exposure`,
    metrics: [
      { label: 'Annual wages', value: money(wages) },
      { label: 'Payroll/tax/admin load', value: money(payroll) },
      { label: 'Legal, placement, travel, setup', value: money(setup) },
      { label: 'First-year monthly equivalent', value: money(monthly) },
    ],
    flags: [
      'A visitor generally cannot simply work as a caregiver in the United States.',
      'H-2B is temporary, capped, requires labor certification, and may not fit ongoing family care.',
      'Household employment can require Form I-9, wage/hour compliance, payroll records, W-2, and Schedule H.',
    ],
    notes: ['Speak with an immigration attorney and household payroll specialist before attempting this path.'],
  };
}

function careSavings(values: Values): Result {
  const current = toNumber(values, 'currentMonthly');
  const familyOffset = toNumber(values, 'familyHours') * toNumber(values, 'replacementRate') * 4.33;
  const offsets = familyOffset + toNumber(values, 'benefitsMonthly') + toNumber(values, 'adultDaySavings');
  const retainedRespite = toNumber(values, 'respiteBudget');
  const newMonthly = Math.max(0, current - offsets + retainedRespite);
  const savings = current - newMonthly;

  return {
    headline: `${money(savings)} estimated monthly pressure reduction`,
    metrics: [
      { label: 'New monthly estimate', value: money(newMonthly) },
      { label: 'Family-hour offset', value: money(familyOffset) },
      { label: 'Benefits and schedule offsets', value: money(toNumber(values, 'benefitsMonthly') + toNumber(values, 'adultDaySavings')) },
      { label: 'Respite preserved', value: money(retainedRespite) },
    ],
    flags: [
      toNumber(values, 'familyHours') > 20 ? 'Large family-hour commitments can create burnout risk; preserve respite and backup coverage.' : 'Family-hour commitment is moderate in this scenario.',
      retainedRespite <= 0 ? 'Removing all respite can reduce cash cost but raise safety and burnout risk.' : 'Respite is still represented in the plan.',
    ],
    notes: ['Do not reduce supervision, medication support, mobility help, or overnight safety below actual need.'],
  };
}

function calculate(kind: VerticalCalculatorKind, values: Values): Result {
  switch (kind) {
    case 'hvac-load':
      return hvacLoadEstimate(values);
    case 'hvac-cost':
      return hvacCost(values);
    case 'hvac-repair':
      return hvacRepair(values);
    case 'hvac-diagnosis':
      return hvacDiagnosis(values);
    case 'energy-savings':
      return energySavings(values);
    case 'seller-net':
      return sellerNet(values);
    case 'buyer-cash':
      return buyerCash(values);
    case 'commission-cost':
      return commissionCost(values);
    case 'seller-closing-cost':
      return sellerClosingCost(values);
    case 'title-company-cost':
      return titleCompanyCost(values);
    case 'tax-proration':
      return taxProration(values);
    case 'association-cost':
      return associationCost(values);
    case 'home-sale-prep':
      return homeSalePrep(values);
    case 'self-employment-tax':
      return selfEmploymentTax(values);
    case 'quarterly-tax':
      return quarterlyTax(values);
    case 'deduction-planner':
      return deductionPlanner(values);
    case 's-corp':
      return sCorp(values);
    case 'freelance-rate':
      return freelanceRate(values);
    case 'margin-pricing':
      return marginPricing(values);
    case 'break-even':
      return breakEven(values);
    case 'profit-plan':
      return profitPlan(values);
    case 'contractor-employee':
      return contractorEmployee(values);
    case 'hire-automate':
      return hireAutomate(values);
    case 'revenue-forecast':
      return revenueForecast(values);
    case 'sales-target':
      return salesTarget(values);
    case 'churn':
      return churn(values);
    case 'subscription-pricing':
      return subscriptionPricing(values);
    case 'operating-leverage':
      return operatingLeverage(values);
    case 'saas-cost':
    case 'seat-cost':
      return saasCost(values);
    case 'cloud-cost':
      return cloudCost(values);
    case 'software-roi':
      return softwareRoi(values);
    case 'subscription-crossover':
      return subscriptionCrossover(values);
    case 'cloud-exit':
      return cloudExit(values);
    case 'care-cost':
      return careCost(values);
    case 'caregiver-hours':
      return caregiverHours(values);
    case 'medicare-cost':
      return medicareCost(values);
    case 'foreign-caregiver':
      return foreignCaregiver(values);
    case 'care-savings':
      return careSavings(values);
    default:
      return {
        headline: 'Enter values to estimate',
        metrics: [],
        flags: [],
        notes: [],
      };
  }
}

function defaultValues(fields: CalculatorField[]): Values {
  return fields.reduce<Values>((acc, field) => {
    acc[field.id] = field.defaultValue;
    return acc;
  }, {});
}

function InputField({
  field,
  value,
  onChange,
}: {
  field: CalculatorField;
  value: number | string | boolean;
  onChange: (id: string, value: number | string | boolean) => void;
}): JSX.Element {
  const id = `field-${field.id}`;

  if (field.type === 'select') {
    return (
      <label htmlFor={id} className="block rounded-md border border-slate-200 bg-white p-3">
        <span className="text-sm font-semibold text-slate-900">{field.label}</span>
        <select
          id={id}
          className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          value={String(value)}
          onChange={(event) => onChange(field.id, event.target.value)}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {field.help && <span className="mt-1 block text-xs text-slate-500">{field.help}</span>}
      </label>
    );
  }

  if (field.type === 'checkbox') {
    return (
      <label htmlFor={id} className="flex gap-3 rounded-md border border-slate-200 bg-white p-3">
        <input
          id={id}
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-600"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.id, event.target.checked)}
        />
        <span>
          <span className="block text-sm font-semibold text-slate-900">{field.label}</span>
          {field.help && <span className="mt-1 block text-xs text-slate-500">{field.help}</span>}
        </span>
      </label>
    );
  }

  return (
    <label htmlFor={id} className="block rounded-md border border-slate-200 bg-white p-3">
      <span className="text-sm font-semibold text-slate-900">{field.label}</span>
      <span className="mt-2 flex items-center rounded-md border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-brand-200">
        {field.prefix && <span className="pl-3 text-sm text-slate-500">{field.prefix}</span>}
        <input
          id={id}
          type="number"
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm outline-none"
          value={Number(value)}
          min={field.min}
          max={field.max}
          step={field.step ?? 1}
          onChange={(event) => onChange(field.id, Number(event.target.value))}
        />
        {field.suffix && <span className="pr-3 text-sm text-slate-500">{field.suffix}</span>}
      </span>
      {field.help && <span className="mt-1 block text-xs text-slate-500">{field.help}</span>}
    </label>
  );
}

export default function DecisionCalculator({ page }: Props): JSX.Element {
  const storageKey = `kfw_vertical_calculator:${page.area}:${page.slug}`;
  const [values, setValues] = useState<Values>(() => defaultValues(page.fields));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        setValues({ ...defaultValues(page.fields), ...(JSON.parse(raw) as Values) });
      }
    } catch {
      setValues(defaultValues(page.fields));
    } finally {
      setLoaded(true);
    }
  }, [page.fields, storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(values));
    } catch {
      // Local persistence is helpful but not required.
    }
  }, [loaded, storageKey, values]);

  const result = useMemo(() => calculate(page.kind, values), [page.kind, values]);

  const update = (id: string, next: number | string | boolean): void => {
    setValues((current) => ({ ...current, [id]: next }));
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-slate-50 p-4" aria-label={`${page.h1} inputs and result`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Estimate inputs</h2>
            <button
              type="button"
              className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-100"
              onClick={() => setValues(defaultValues(page.fields))}
            >
              Reset
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.fields.map((field) => (
              <InputField key={field.id} field={field} value={values[field.id]} onChange={update} />
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-brand-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Result</div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{result.headline}</div>

          <dl className="mt-4 grid gap-3">
            {result.metrics.map((metric) => (
              <div key={metric.label} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-slate-950">{metric.value}</dd>
                {metric.note && <dd className="mt-1 text-xs text-slate-600">{metric.note}</dd>}
              </div>
            ))}
          </dl>

          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-950">Flags to check</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950">
              {result.flags.map((flag) => <li key={flag}>{flag}</li>)}
            </ul>
          </div>

          {result.options && result.options.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-slate-900">Options to ask for</h3>
              <div className="mt-2 space-y-2">
                {result.options.map((option) => (
                  <article key={option.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm font-semibold text-slate-950">{option.title}</div>
                    <div className="mt-1 text-sm font-medium text-brand-800">{option.stance}</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-slate-700">
                      {option.details.map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                    <div className="mt-2 rounded border border-slate-200 bg-white p-2 text-xs text-slate-700">
                      <strong>Pushback:</strong> {option.pushback}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {result.notes.length > 0 && (
            <div className="mt-4 text-xs text-slate-600">
              {result.notes.map((note) => <p key={note}>{note}</p>)}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

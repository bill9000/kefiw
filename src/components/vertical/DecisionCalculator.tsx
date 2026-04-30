import { useEffect, useMemo, useState } from 'react';
import type { CalculatorField, VerticalCalculatorKind, VerticalCalculatorPage } from '~/data/vertical-calculators';
import {
  getBusinessCalculatorDepth,
  type CalculatorDepthProfile,
  type CalculatorDepthState,
  type CalculatorStateSummary,
} from '~/data/business-calculator-depth';

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

const stateCopy: Record<CalculatorDepthState, { label: string; className: string }> = {
  stable: {
    label: 'Stable',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  },
  tight: {
    label: 'Tight',
    className: 'border-amber-200 bg-amber-50 text-amber-950',
  },
  fragile: {
    label: 'Fragile',
    className: 'border-orange-200 bg-orange-50 text-orange-950',
  },
  'not-ready': {
    label: 'Not ready',
    className: 'border-rose-200 bg-rose-50 text-rose-950',
  },
};

function stateLabel(state: CalculatorStateSummary): string {
  return state.label ?? stateCopy[state.state].label;
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

function estimateSelfEmploymentTax(netProfit: number, w2Wages = 0): { seBase: number; socialSecurityTax: number; medicareTax: number; total: number } {
  const seBase = Math.max(0, netProfit) * 0.9235;
  const remainingSsBase = Math.max(0, SS_WAGE_BASE_2026 - w2Wages);
  const socialSecurityTax = Math.min(seBase, remainingSsBase) * 0.124;
  const medicareTax = seBase * 0.029;
  return { seBase, socialSecurityTax, medicareTax, total: socialSecurityTax + medicareTax };
}

function estimatedTaxReserve(values: Values): {
  revenue: number;
  expenses: number;
  netProfit: number;
  seTax: number;
  incomeTaxReserve: number;
  stateReserve: number;
  totalReserve: number;
  paidOrWithheld: number;
  reserveGap: number;
} {
  const revenueInput = toNumber(values, 'revenue');
  const revenue = revenueInput > 0 ? revenueInput : toNumber(values, 'incomeYtd') + toNumber(values, 'expectedRemainingIncome');
  const expensesInput = toNumber(values, 'expenses');
  const expenses = expensesInput > 0 ? expensesInput : toNumber(values, 'expensesYtd') + toNumber(values, 'expectedRemainingExpenses');
  const netProfit = Math.max(0, revenue - expenses);
  const se = estimateSelfEmploymentTax(netProfit, toNumber(values, 'w2Wages'));
  const halfSeDeduction = se.total / 2;
  const health = toNumber(values, 'healthInsurance');
  const retirement = toNumber(values, 'retirement');
  const qbiBase = Math.max(0, netProfit - halfSeDeduction - health - retirement);
  const qbiDeduction = isChecked(values, 'qbi') ? qbiBase * 0.2 : 0;
  const incomeTaxBase = Math.max(0, netProfit - halfSeDeduction - health - retirement - qbiDeduction - toNumber(values, 'creditsDeductions'));
  const incomeTaxReserve = incomeTaxBase * (toNumber(values, 'federalRate') / 100);
  const stateReserve = incomeTaxBase * (toNumber(values, 'stateRate') / 100);
  const totalReserve = se.total + incomeTaxReserve + stateReserve;
  const paidOrWithheld =
    toNumber(values, 'w2Withholding') +
    toNumber(values, 'spouseW2Withholding') +
    toNumber(values, 'estimatedPayments') +
    toNumber(values, 'federalEstimatedPaid') +
    toNumber(values, 'quarterlyPaymentsMade');
  const currentReserve = toNumber(values, 'currentTaxReserve');
  return {
    revenue,
    expenses,
    netProfit,
    seTax: se.total,
    incomeTaxReserve,
    stateReserve,
    totalReserve,
    paidOrWithheld,
    reserveGap: Math.max(0, totalReserve - paidOrWithheld - currentReserve),
  };
}

function nextEstimatedTaxDeadline(period: number): string {
  if (period <= 1) return 'April 15';
  if (period === 2) return 'June 15';
  if (period === 3) return 'September 15';
  return 'January 15 of the following year';
}

function selfEmploymentTax(values: Values): Result {
  const reserve = estimatedTaxReserve(values);
  const monthlyReserveTarget = reserve.totalReserve / 12;
  const quarterlyReserveTarget = reserve.totalReserve / 4;
  const effectiveReservePct = reserve.netProfit > 0 ? reserve.totalReserve / reserve.netProfit * 100 : 0;
  const spendableBeforePersonal = reserve.revenue - reserve.expenses - reserve.totalReserve - toNumber(values, 'retirement') - toNumber(values, 'healthInsurance');

  return {
    headline: `${money(reserve.totalReserve)} estimated tax reserve from entered assumptions`,
    metrics: [
      { label: 'Net business profit', value: money(reserve.netProfit) },
      { label: 'Estimated self-employment tax', value: money(reserve.seTax), note: '92.35% net earnings frame, Social Security up to the 2026 wage base, and Medicare.' },
      { label: 'Estimated income-tax reserve', value: money(reserve.incomeTaxReserve + reserve.stateReserve) },
      { label: 'Amount not really yours yet', value: money(Math.max(0, reserve.totalReserve - reserve.paidOrWithheld)) },
      { label: 'Monthly reserve target', value: money(monthlyReserveTarget) },
      { label: 'Quarterly reserve target', value: money(quarterlyReserveTarget) },
      { label: 'Effective reserve rate', value: pct(effectiveReservePct) },
      { label: 'Spendable before personal expenses', value: money(spendableBeforePersonal) },
    ],
    flags: [
      reserve.expenses / Math.max(1, reserve.revenue) > 0.5 ? 'Expenses are more than half of revenue; records and business purpose matter.' : 'Expense ratio is not unusually high in this scenario.',
      toNumber(values, 'w2Wages') >= SS_WAGE_BASE_2026 ? 'W-2 wages may already fill the Social Security wage base, reducing self-employment Social Security tax.' : 'Self-employment income may still be subject to Social Security tax up to the wage base.',
      reserve.reserveGap > 0 ? `Current reserve and payments leave a planning gap of about ${money(reserve.reserveGap)}.` : 'Current reserve, withholding, and payments appear to cover the modeled reserve.',
      isChecked(values, 'irregularIncome') || isChecked(values, 'oneTimeLargePayment') ? 'Irregular or one-time income should be re-estimated when cash arrives, not only at year-end.' : 'Income timing is treated as reasonably even in this scenario.',
    ],
    notes: ['This is an educational planning reserve, not your tax bill. Use Form 1040-ES, current tax software, or a tax professional before sending payments.'],
  };
}

function quarterlyTax(values: Values): Result {
  const annualTax = toNumber(values, 'annualTax');
  const paymentsMade = toNumber(values, 'withheld') + toNumber(values, 'q1Payment') + toNumber(values, 'q2Payment') + toNumber(values, 'q3Payment') + toNumber(values, 'q4Payment');
  const quartersLeft = Math.max(1, toNumber(values, 'quartersLeft'));
  const cushionPct = toNumber(values, 'cushionPct') / 100;
  const remaining = Math.max(0, annualTax - paymentsMade);
  const withCushion = remaining * (1 + cushionPct);
  const perQuarter = withCushion / quartersLeft;
  const currentQuarter = Math.max(1, Math.min(4, Number(toStringValue(values, 'currentQuarter')) || 1));
  const safeHarborTarget = toNumber(values, 'priorYearTax') * (toNumber(values, 'safeHarborPct') / 100);
  const safeHarborGap = Math.max(0, safeHarborTarget - paymentsMade);
  const currentYearNet = Math.max(0, toNumber(values, 'incomeSoFar') + toNumber(values, 'expectedRemainingIncome') - toNumber(values, 'expensesSoFar') - toNumber(values, 'expectedRemainingExpenses'));

  return {
    headline: `${money(perQuarter)} planning payment per remaining period`,
    metrics: [
      { label: 'Expected current-year net income', value: money(currentYearNet) },
      { label: 'Total paid or withheld so far', value: money(paymentsMade) },
      { label: 'Remaining estimated tax', value: money(remaining) },
      { label: 'Safe-harbor gap to compare', value: money(safeHarborGap) },
      { label: 'Next deadline', value: nextEstimatedTaxDeadline(currentQuarter) },
      { label: 'Reserve with cushion', value: money(withCushion) },
    ],
    flags: [
      paymentsMade > annualTax ? 'You may already be over-reserved based on this estimate.' : 'You still have estimated tax to cover under the entered assumptions.',
      safeHarborGap > 0 ? 'Prior-year safe-harbor comparison still shows a gap. This does not guarantee penalty treatment; it is a planning check.' : 'Payments/withholding appear to meet the selected prior-year safe-harbor comparison.',
      isChecked(values, 'annualizedIncomeMode') || isChecked(values, 'seasonalIncome') ? 'Uneven-income users may need annualized-income treatment or Form 2210 instead of simply dividing by four.' : 'This estimate treats remaining payments as a normal catch-up rhythm.',
    ],
    notes: ['This estimates a planning payment for a federal estimated-tax deadline. It does not guarantee penalty avoidance.'],
  };
}

function taxReserveHealth(values: Values): Result {
  const reserve = estimatedTaxReserve(values);
  const currentReserve = toNumber(values, 'currentTaxReserve');
  const weeklyReserve = toNumber(values, 'weeklyReserveAmount');
  const remainingWeeks = 26;
  const projectedFutureReserve = weeklyReserve * remainingWeeks + Math.max(0, toNumber(values, 'expectedRemainingIncome') - toNumber(values, 'expectedRemainingExpenses')) * (toNumber(values, 'taxReservePct') / 100);
  const projectedReserveCoverage = currentReserve + projectedFutureReserve + reserve.paidOrWithheld;
  const gap = Math.max(0, reserve.totalReserve - projectedReserveCoverage);
  const coveragePct = reserve.totalReserve > 0 ? projectedReserveCoverage / reserve.totalReserve * 100 : 100;
  const scorePenalty = (gap / Math.max(1, reserve.totalReserve)) * 90 + (isChecked(values, 'reservesMixedWithOperatingCash') ? 15 : 0) + (!isChecked(values, 'separateTaxAccount') ? 10 : 0);
  const score = clamp(100 - scorePenalty, 0, 100);

  return {
    headline: `${numberLabel(score, '/100')} tax reserve health score`,
    metrics: [
      { label: 'Modeled total tax reserve', value: money(reserve.totalReserve) },
      { label: 'Current federal reserve gap', value: money(Math.max(0, reserve.totalReserve - currentReserve - reserve.paidOrWithheld)) },
      { label: 'Projected reserve coverage', value: pct(coveragePct) },
      { label: 'Next payment target', value: money(Math.max(0, (reserve.totalReserve - reserve.paidOrWithheld) / 4)) },
      { label: 'Monthly reserve target', value: money(Math.max(0, reserve.reserveGap / 6)) },
      { label: 'State reserve estimate', value: money(reserve.stateReserve) },
    ],
    flags: [
      gap > 0 ? `Projected reserves leave a gap of about ${money(gap)}.` : 'Projected reserves appear to cover the entered assumptions.',
      isChecked(values, 'reservesMixedWithOperatingCash') ? 'Tax money is mixed with operating cash, which can make it look spendable.' : 'Tax money is not flagged as mixed with operating cash.',
      isChecked(values, 'seasonalIncome') ? 'Seasonal income should be rechecked after high-income months.' : 'Income seasonality is not flagged in this scenario.',
    ],
    notes: ['The score is a planning signal. It does not determine tax due or penalty treatment.'],
  };
}

function quarterlyTaxCatchUp(values: Values): Result {
  const periodNet = Math.max(0, toNumber(values, 'incomeDuringMissedPeriod') - toNumber(values, 'expensesDuringMissedPeriod'));
  const periodTax = periodNet * (toNumber(values, 'taxReservePct') / 100);
  const catchUp = Math.max(0, periodTax - toNumber(values, 'paymentMade'));
  const reserveAfterCatchUp = toNumber(values, 'currentTaxReserve') - catchUp;
  const futureReserveTarget = Math.max(0, toNumber(values, 'expectedRemainingIncome') - toNumber(values, 'expectedRemainingExpenses')) * (toNumber(values, 'taxReservePct') / 100);
  const weeklyCatchUp = catchUp / Math.max(1, toNumber(values, 'weeksUntilNextDeadline'));
  const currentYearGap = Math.max(0, toNumber(values, 'currentYearTaxEstimate') - toNumber(values, 'w2Withholding') - toNumber(values, 'paymentMade') - toNumber(values, 'currentTaxReserve'));
  const missedQuarter = Math.max(1, Math.min(4, Number(toStringValue(values, 'missedQuarter')) || 1));

  return {
    headline: `${money(catchUp)} estimated catch-up amount for the missed period`,
    metrics: [
      { label: 'Missed-period net income', value: money(periodNet) },
      { label: 'Payment shortfall for missed period', value: money(catchUp) },
      { label: 'Reserve after catch-up', value: money(reserveAfterCatchUp) },
      { label: 'Weekly catch-up plan', value: money(weeklyCatchUp) },
      { label: 'Future reserve target', value: money(futureReserveTarget) },
      { label: 'Current-year gap check', value: money(currentYearGap) },
      { label: 'Next estimated-tax deadline', value: nextEstimatedTaxDeadline(Math.min(4, missedQuarter + 1)) },
    ],
    flags: [
      catchUp > toNumber(values, 'currentTaxReserve') ? 'The catch-up amount is larger than the current reserve. Build a forward plan instead of draining operating cash blindly.' : 'Current reserve can cover the catch-up amount under the entered assumptions.',
      isChecked(values, 'unevenIncome') ? 'Uneven income may make annualized-income review relevant.' : 'Income is treated as even enough for a simple catch-up estimate.',
      currentYearGap > catchUp * 1.5 ? 'The annual gap is larger than the missed-quarter problem. Rebuild the rest-of-year reserve, not just the missed payment.' : 'The catch-up estimate is the main pressure point from these inputs.',
    ],
    notes: ['Late or low estimated payments can still create penalty questions. This tool builds a catch-up plan; it does not determine penalties.'],
  };
}

function mixedW21099Tax(values: Values): Result {
  const reserve = estimatedTaxReserve(values);
  const totalWithholding = toNumber(values, 'w2Withholding') + toNumber(values, 'spouseW2Withholding') + toNumber(values, 'quarterlyPaymentsMade');
  const taxAfterWithholding = Math.max(0, reserve.totalReserve - totalWithholding);
  const extraWithholding = toNumber(values, 'extraWithholdingOption');
  const gapAfterExtraWithholding = Math.max(0, taxAfterWithholding - extraWithholding);
  const quarterlyTarget = gapAfterExtraWithholding / 4;

  return {
    headline: `${money(taxAfterWithholding)} 1099 reserve needed after entered withholding`,
    metrics: [
      { label: 'W-2 withholding counted', value: money(totalWithholding) },
      { label: 'Estimated self-employment tax', value: money(reserve.seTax) },
      { label: 'Estimated total federal reserve', value: money(reserve.totalReserve) },
      { label: 'Extra withholding alternative', value: money(extraWithholding) },
      { label: 'Quarterly payment target after extra withholding', value: money(quarterlyTarget) },
    ],
    flags: [
      taxAfterWithholding <= 0 ? 'Entered withholding may cover the modeled tax reserve.' : 'Self-employed income still needs additional reserve under these assumptions.',
      extraWithholding > 0 ? 'Extra W-2 withholding can be part of the plan, but confirm timing and paycheck impact.' : 'No extra withholding alternative is modeled.',
      reserve.netProfit > 0 ? 'The 1099 side still creates self-employment tax unless other facts change the filing treatment.' : 'No net self-employment profit is modeled.',
    ],
    notes: ['This combines withholding and self-employment reserve planning. It does not determine the household tax bill.'],
  };
}

function irregularIncomeTaxReserve(values: Values): Result {
  const highMonths = clamp(toNumber(values, 'highIncomeMonths'), 0, 12);
  const slowMonths = clamp(toNumber(values, 'slowMonths'), 0, 12 - highMonths);
  const normalMonths = Math.max(0, 12 - highMonths - slowMonths);
  const modeledIncome = highMonths * toNumber(values, 'incomeHighMonth') + normalMonths * toNumber(values, 'incomeNormalMonth') + slowMonths * toNumber(values, 'incomeSlowMonth');
  const annualIncome = Math.max(toNumber(values, 'expectedAnnualIncome'), modeledIncome);
  const annualExpenses = toNumber(values, 'monthlyExpensesNormal') * 12;
  const annualReserve = Math.max(0, annualIncome - annualExpenses) * (toNumber(values, 'taxReservePct') / 100);
  const highMonthReserve = Math.max(0, toNumber(values, 'incomeHighMonth') - toNumber(values, 'monthlyExpensesNormal')) * (toNumber(values, 'taxReservePct') / 100);
  const slowMonthAfterReserve = toNumber(values, 'incomeSlowMonth') - toNumber(values, 'monthlyExpensesNormal') - Math.max(0, toNumber(values, 'incomeSlowMonth') - toNumber(values, 'monthlyExpensesNormal')) * (toNumber(values, 'taxReservePct') / 100);
  const remainingReserve = Math.max(0, annualReserve - toNumber(values, 'priorPayments') - toNumber(values, 'withholding'));

  return {
    headline: `${money(remainingReserve)} remaining annual reserve target for uneven income`,
    metrics: [
      { label: 'Modeled annual income', value: money(annualIncome) },
      { label: 'Annual tax reserve target', value: money(annualReserve) },
      { label: 'Reserve needed in a high-income month', value: money(highMonthReserve) },
      { label: 'Slow-month cash after reserve', value: money(slowMonthAfterReserve) },
      { label: 'Operating cash floor', value: money(toNumber(values, 'minimumOperatingCash') + toNumber(values, 'emergencyBuffer')) },
      { label: 'Quarterly target average', value: money(remainingReserve / 4) },
    ],
    flags: [
      highMonthReserve > toNumber(values, 'incomeNormalMonth') * 0.5 ? 'High-income months need immediate reserve discipline; averaging blindly can under-protect tax cash.' : 'High-income-month reserve does not dominate the plan.',
      slowMonthAfterReserve < 0 ? 'Slow months may collide with operating cash if reserves are not built earlier.' : 'Slow months still appear cash-positive after reserve in this model.',
      'Uneven-income taxpayers may need annualized-income review rather than a simple divide-by-four payment pattern.',
    ],
    notes: ['This planner turns uneven income into a reserve schedule. It does not determine estimated-tax penalties or annualized-income eligibility.'],
  };
}

function deductionDocumentation(values: Values): Result {
  const checks = [
    isChecked(values, 'hasReceipt'),
    isChecked(values, 'hasBankRecord'),
    isChecked(values, 'hasBusinessPurpose'),
    isChecked(values, 'hasProjectTie'),
    isChecked(values, 'hasDateVendorCategory'),
    toNumber(values, 'businessUsePct') >= 80,
    !isChecked(values, 'mixedUseFlag') || toNumber(values, 'businessUsePct') > 0,
    isChecked(values, 'mileageLog') || toStringValue(values, 'expenseCategory') !== 'vehicle',
    isChecked(values, 'homeOfficeMeasurement') || toStringValue(values, 'expenseCategory') !== 'home-office',
    isChecked(values, 'assetRecord') || toStringValue(values, 'expenseCategory') !== 'equipment',
    isChecked(values, 'recurringRecord'),
  ];
  const score = Math.round(checks.filter(Boolean).length / checks.length * 100);
  const missing = [
    !isChecked(values, 'hasReceipt') ? 'receipt or invoice' : '',
    !isChecked(values, 'hasBankRecord') ? 'bank/card proof' : '',
    !isChecked(values, 'hasBusinessPurpose') ? 'business-purpose note' : '',
    !isChecked(values, 'hasProjectTie') ? 'client/project/workflow tie' : '',
    isChecked(values, 'mixedUseFlag') && toNumber(values, 'businessUsePct') >= 100 ? 'personal-use allocation check' : '',
  ].filter(Boolean);

  return {
    headline: `${numberLabel(score, '/100')} documentation score`,
    metrics: [
      { label: 'Expense amount reviewed', value: money(toNumber(values, 'expenseAmount')) },
      { label: 'Business-use percentage', value: pct(toNumber(values, 'businessUsePct')) },
      { label: 'Missing records', value: missing.length === 0 ? 'None flagged' : numberLabel(missing.length) },
      { label: 'Documentation state', value: score >= 85 ? 'Strong records' : score >= 70 ? 'Mostly documented' : score >= 50 ? 'Needs cleanup' : 'Weak support' },
    ],
    flags: [
      missing.length > 0 ? `Missing or weak support: ${missing.join(', ')}.` : 'Core documentation signals look present.',
      isChecked(values, 'mixedUseFlag') ? 'Mixed-use expenses need a clear allocation method before they become tax-season memory work.' : 'Expense is not flagged as mixed-use.',
      toNumber(values, 'expenseAmount') > 5000 ? 'Large expenses deserve stronger notes, asset records, and professional review if capitalization may apply.' : 'Expense amount is not unusually large in this model.',
    ],
    notes: ['This score reviews records. It does not approve a deduction or determine whether an expense is deductible.'],
  };
}

function deductionPlanner(values: Values): Result {
  if (toNumber(values, 'expenseAmount') > 0 || toStringValue(values, 'expenseCategory')) {
    const doc = deductionDocumentation(values);
    const riskSignals =
      (isChecked(values, 'unusuallyLargeAmount') ? 20 : 0) +
      (isChecked(values, 'luxuryPersonalOverlap') ? 20 : 0) +
      (isChecked(values, 'travelVacationOverlap') ? 15 : 0) +
      (isChecked(values, 'capitalizationQuestion') ? 15 : 0) +
      (toNumber(values, 'businessUsePct') < 80 ? 15 : 0) +
      (!isChecked(values, 'hasBusinessPurpose') ? 15 : 0);
    const caution = riskSignals >= 55 ? 'Review before relying' : riskSignals >= 35 ? 'High caution' : riskSignals >= 15 ? 'Medium caution' : 'Low caution';
    return {
      headline: `${caution} deduction caution rating`,
      metrics: [
        ...doc.metrics,
        { label: 'Caution score', value: numberLabel(clamp(riskSignals, 0, 100), '/100') },
        { label: 'Potential business-use amount', value: money(toNumber(values, 'expenseAmount') * toNumber(values, 'businessUsePct') / 100) },
      ],
      flags: [
        ...doc.flags,
        !isChecked(values, 'ordinaryForBusiness') || !isChecked(values, 'necessaryForBusiness') ? 'Ordinary/necessary framing is weak or uncertain.' : 'Ordinary/necessary framing is not flagged by these inputs.',
        isChecked(values, 'capitalizationQuestion') ? 'This may need capitalization or asset treatment review before relying on an immediate deduction.' : 'No capitalization review flag is turned on.',
      ],
      notes: ['This tool flags documentation and caution issues. It does not determine whether an expense is deductible.'],
    };
  }

  const mileage = toNumber(values, 'businessMiles') * BUSINESS_MILEAGE_RATE_2026;
  const homeOffice = Math.min(toNumber(values, 'homeOfficeSqft'), 300) * 5;
  const software = toNumber(values, 'software');
  const phoneInternet = toNumber(values, 'phoneInternet') * (toNumber(values, 'businessUsePct') > 0 ? toNumber(values, 'businessUsePct') / 100 : 1);
  const meals = toNumber(values, 'meals') * 0.5;
  const travel = toNumber(values, 'travel');
  const equipment = toNumber(values, 'equipment');
  const total = mileage + homeOffice + software + phoneInternet + meals + travel + equipment;
  const flags = [
    toNumber(values, 'businessMiles') > 0 ? 'Mileage needs a log with date, destination, business purpose, and miles.' : 'No mileage deduction modeled.',
    toNumber(values, 'homeOfficeSqft') > 0 ? 'Home office needs regular and exclusive business use support.' : 'No home-office deduction modeled.',
    isChecked(values, 'hasBusinessPurpose') ? 'Business purpose notes are captured for at least some expenses.' : 'Business purpose notes are missing or incomplete.',
    isChecked(values, 'mixedUseFlag') ? 'Mixed-use expenses need allocation instead of all-or-nothing treatment.' : 'Mixed-use expense pressure is not flagged.',
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

function sCorpAdminCost(values: Values): number {
  return (
    toNumber(values, 'payrollAdmin') +
    toNumber(values, 'payrollProviderCost') +
    toNumber(values, 'taxFilingCost') +
    toNumber(values, 'bookkeepingUpgrade') +
    toNumber(values, 'stateCorpCost') +
    toNumber(values, 'adminTimeHours') * toNumber(values, 'ownerHourlyValue')
  );
}

function sCorpSpreadFor(profit: number, salary: number, admin: number): { solePropPayrollTax: number; salaryPayrollTax: number; grossSavings: number; netSavings: number; distributions: number } {
  const cappedSalary = Math.min(Math.max(0, profit), Math.max(0, salary));
  const distributions = Math.max(0, profit - cappedSalary);
  const solePropSeBase = Math.max(0, profit) * 0.9235;
  const solePropPayrollTax = Math.min(solePropSeBase, SS_WAGE_BASE_2026) * 0.124 + solePropSeBase * 0.029;
  const salaryPayrollTax = Math.min(cappedSalary, SS_WAGE_BASE_2026) * 0.153;
  const grossSavings = Math.max(0, solePropPayrollTax - salaryPayrollTax);
  return { solePropPayrollTax, salaryPayrollTax, grossSavings, netSavings: grossSavings - admin, distributions };
}

function sCorp(values: Values): Result {
  const profit = toNumber(values, 'profit');
  const salary = Math.min(profit, toNumber(values, 'salary'));
  const admin = sCorpAdminCost(values);
  const spread = sCorpSpreadFor(profit, salary, admin);
  const higherSalary = salary * (1 + toNumber(values, 'salarySensitivityPct') / 100);
  const salarySensitivity = sCorpSpreadFor(profit, higherSalary, admin);
  const lowerProfit = profit * Math.max(0, 1 - (100 - toNumber(values, 'profitStabilityPct')) / 100);
  const lowerProfitSpread = sCorpSpreadFor(lowerProfit, Math.min(higherSalary, lowerProfit), admin);
  const breakEvenProfit = salary + admin / 0.1415;

  return {
    headline: `${money(spread.netSavings)} possible S-corp spread after admin assumptions`,
    metrics: [
      { label: 'Estimated sole-prop SE/payroll tax', value: money(spread.solePropPayrollTax) },
      { label: 'Salary payroll tax estimate', value: money(spread.salaryPayrollTax) },
      { label: 'Distribution before income tax', value: money(spread.distributions) },
      { label: 'Admin and state/entity drag', value: money(admin) },
      { label: 'Break-even profit rough point', value: money(breakEvenProfit) },
      { label: 'Net savings if salary rises', value: money(salarySensitivity.netSavings) },
      { label: 'Net savings in lower-profit stress case', value: money(lowerProfitSpread.netSavings) },
    ],
    flags: [
      salary < profit * 0.45 ? 'Salary is low relative to profit; reasonable-salary support is critical.' : 'Salary is not extremely low relative to profit in this scenario.',
      spread.netSavings <= 0 ? 'Payroll, filing, state, and admin costs may erase the S-corp benefit.' : 'There may be a planning benefit worth reviewing with a CPA.',
      salarySensitivity.netSavings <= 0 || lowerProfitSpread.netSavings <= 0 ? 'Savings are fragile under higher salary or lower profit assumptions.' : 'Savings survive the modeled sensitivity checks.',
    ],
    notes: ['This tool estimates possible savings after reasonable salary, payroll, filing, state, and admin assumptions. It does not determine a reasonable salary or tax election.'],
  };
}

function reasonableSalary(values: Values): Result {
  const low = toNumber(values, 'comparableSalaryLow');
  const mid = toNumber(values, 'comparableSalaryMidpoint');
  const high = toNumber(values, 'comparableSalaryHigh');
  const replacement = toNumber(values, 'replacementCostEstimate');
  const proposed = toNumber(values, 'salary');
  const responsibilityScore = (
    toNumber(values, 'technicalSkillScore') +
    toNumber(values, 'managementResponsibilityScore') +
    toNumber(values, 'salesResponsibilityScore') +
    toNumber(values, 'operationsResponsibilityScore') +
    toNumber(values, 'revenueProducingTimePct')
  ) / 5;
  const hoursFactor = clamp(toNumber(values, 'ownerHours') / 40, 0.25, 1.4);
  const expectedRangeMid = (mid * 0.55 + replacement * 0.45) * hoursFactor * (0.8 + responsibilityScore / 500);
  const conservative = Math.max(low * hoursFactor, expectedRangeMid * 0.82);
  const expected = expectedRangeMid;
  const aggressive = Math.min(high * hoursFactor * 1.15, expectedRangeMid * 1.22);
  const admin = sCorpAdminCost(values);
  const spread = sCorpSpreadFor(toNumber(values, 'profit'), proposed, admin);
  const expectedSpread = sCorpSpreadFor(toNumber(values, 'profit'), expected, admin);

  return {
    headline: `${money(conservative)} to ${money(aggressive)} planning salary range`,
    metrics: [
      { label: 'Conservative planning range', value: money(conservative) },
      { label: 'Expected planning range', value: money(expected) },
      { label: 'Aggressive planning range', value: money(aggressive) },
      { label: 'Proposed salary', value: money(proposed) },
      { label: 'Savings at proposed salary', value: money(spread.netSavings) },
      { label: 'Savings at expected salary', value: money(expectedSpread.netSavings) },
    ],
    flags: [
      proposed < conservative ? 'Proposed salary is below the planning range from entered comparables and role intensity.' : 'Proposed salary is not below the modeled planning range.',
      proposed > aggressive ? 'Proposed salary may consume most of the S-corp spread, which can be a useful not-worth-it signal.' : 'Proposed salary does not exceed the modeled high range.',
      responsibilityScore >= 70 ? 'Owner role looks skill-heavy or revenue-critical; salary support should be stronger.' : 'Owner role intensity is not maxed out in this model.',
    ],
    notes: ['This produces a planning range and documentation checklist. It does not determine reasonable compensation.'],
  };
}

function sCorpBreakEven(values: Values): Result {
  const admin = sCorpAdminCost(values) + toNumber(values, 'setupCost');
  const expectedSpread = sCorpSpreadFor(toNumber(values, 'profit'), toNumber(values, 'salary'), admin);
  const lowSpread = sCorpSpreadFor(toNumber(values, 'profitLow'), Math.min(toNumber(values, 'salaryHigh'), toNumber(values, 'profitLow')), admin);
  const volatilityProfit = toNumber(values, 'profit') * Math.max(0, 1 - toNumber(values, 'profitVolatilityPct') / 100);
  const volatileSpread = sCorpSpreadFor(volatilityProfit, Math.min(toNumber(values, 'salaryHigh'), volatilityProfit), admin);
  const breakEvenProfit = toNumber(values, 'salary') + admin / 0.1415;
  const netSavingsByProfit = [80_000, 100_000, 150_000, 200_000].map((profit) => `${money(profit)}: ${money(sCorpSpreadFor(profit, Math.min(toNumber(values, 'salary'), profit), admin).netSavings)}`);

  return {
    headline: `${money(breakEvenProfit)} rough profit threshold before complexity starts paying`,
    metrics: [
      { label: 'Expected net savings', value: money(expectedSpread.netSavings) },
      { label: 'Lower-profit stress savings', value: money(lowSpread.netSavings) },
      { label: 'Volatility stress savings', value: money(volatileSpread.netSavings) },
      { label: 'Admin and setup drag', value: money(admin) },
      { label: 'Salary sensitivity case', value: money(toNumber(values, 'salaryHigh')) },
      { label: 'Savings by profit level', value: netSavingsByProfit.join(' | ') },
    ],
    flags: [
      expectedSpread.netSavings <= 0 ? 'Expected case does not clearly beat complexity.' : 'Expected case shows possible savings after admin drag.',
      lowSpread.netSavings <= 0 || volatileSpread.netSavings <= 0 ? 'Savings disappear in at least one stress case.' : 'Savings survive the entered stress cases.',
      breakEvenProfit > toNumber(values, 'profit') ? 'The break-even profit level is above expected profit, so this may be too early.' : 'Expected profit is above the rough break-even threshold.',
    ],
    notes: ['This is an S-corp stress test, not an election recommendation. Bring the assumptions to a CPA if savings remain after conservative cases.'],
  };
}

function contractorEmployee(values: Values): Result {
  const hours = Math.max(1, toNumber(values, 'hours'));
  const managerValue = toNumber(values, 'managerHourlyValue');
  const contractorLabor = toNumber(values, 'projectRate') > 0 ? toNumber(values, 'projectRate') : toNumber(values, 'contractorRate') * hours;
  const contractorSupport = toNumber(values, 'revisionSupportHours') * toNumber(values, 'contractorRate');
  const contractorManagement = (toNumber(values, 'contractorManagementHours') + toNumber(values, 'contractorOnboardingHours')) * managerValue;
  const urgencyPremium = (contractorLabor + contractorSupport) * toNumber(values, 'urgencyPremiumPct') / 100;
  const contractorCost = contractorLabor + contractorSupport + contractorManagement + urgencyPremium + toNumber(values, 'contractorToolAccess');
  const employeePay = toNumber(values, 'employeeSalary') > 0 ? toNumber(values, 'employeeSalary') : toNumber(values, 'employeeRate') * Math.max(hours, toNumber(values, 'employeeHours'));
  const burden = employeePay * toNumber(values, 'burdenPct') / 100;
  const managerCost = toNumber(values, 'managerTimeHours') * managerValue;
  const rampCost = employeePay * toNumber(values, 'productivityRampPct') / 100;
  const employeeTotal = employeePay + burden + toNumber(values, 'employeeOverhead') + managerCost + rampCost;
  const spread = employeeTotal - contractorCost;
  const contractorMonthly = contractorCost / Math.max(1, toNumber(values, 'expectedDurationMonths'));
  const employeeMonthly = employeeTotal / 12;
  const breakEvenMonth = employeeMonthly < contractorMonthly ? toNumber(values, 'employeeOverhead') / Math.max(1, contractorMonthly - employeeMonthly) : Infinity;
  const flexibilityScore = clamp(
    100 - toNumber(values, 'expectedDurationMonths') * 4 + toNumber(values, 'specializedSkillScore') * 0.25 - toNumber(values, 'controlNeededScore') * 0.25,
    0,
    100,
  );
  const classificationSignals = [
    isChecked(values, 'controlsSchedule'),
    isChecked(values, 'controlsMethod'),
    isChecked(values, 'providesTools'),
    isChecked(values, 'coreWork'),
    isChecked(values, 'ongoingRelationship'),
    !isChecked(values, 'servesOtherClients'),
  ].filter(Boolean).length;
  const roleFit = (toNumber(values, 'recurringNeedScore') + toNumber(values, 'controlNeededScore') + toNumber(values, 'processDocumentationScore')) / 3;

  return {
    headline:
      roleFit >= 70 && employeeTotal <= contractorCost * 1.15
        ? 'Employee may fit better'
        : toNumber(values, 'expectedDurationMonths') <= 9 || flexibilityScore >= 65
          ? 'Contract first may fit better'
          : spread > 0
            ? `${money(Math.abs(spread))} cheaper as contractor on cost only`
            : `${money(Math.abs(spread))} cheaper as employee on cost only`,
    metrics: [
      { label: 'Contractor annual cost', value: money(contractorCost) },
      { label: 'Contractor monthly cost', value: money(contractorMonthly) },
      { label: 'Employee pay cost', value: money(employeePay) },
      { label: 'Payroll burden and benefits', value: money(burden) },
      { label: 'Employee first-year cost', value: money(employeeTotal) },
      { label: 'Employee monthly equivalent', value: money(employeeMonthly) },
      { label: 'Cost break-even month', value: Number.isFinite(breakEvenMonth) ? numberLabel(breakEvenMonth, ' mo') : 'No employee cash break-even' },
      { label: 'Flexibility score', value: numberLabel(flexibilityScore, '/100') },
      { label: 'Role fit score', value: numberLabel(roleFit, '/100') },
      { label: 'Classification caution signals', value: numberLabel(classificationSignals, '/6') },
    ],
    flags: [
      'Worker classification depends on control, independence, and legal facts, not cost preference.',
      classificationSignals >= 4 ? 'Several inputs look employee-like. Use this as a cost comparison only and review classification separately.' : 'Classification caution is still relevant even if fewer employee-like signals are selected.',
      hours >= 1800 && roleFit >= 65 ? 'Full-time recurring work may favor employee economics if classification and management capacity are sound.' : 'Part-time, variable, uncertain, or specialized work may favor contractor economics.',
      toNumber(values, 'processDocumentationScore') < 50 ? 'The process is not well documented. Either path can fail if the work is too messy to hand off.' : 'Process documentation is not the weakest signal in this model.',
    ],
    notes: ['This is a cost and operating-tradeoff comparison, not a classification tool. State labor, unemployment, workers comp, and benefits rules can change the cost picture.'],
  };
}

function payrollBurden(values: Values): Result {
  const hourlyWage = toNumber(values, 'hourlyWage');
  const basePay = hourlyWage > 0
    ? hourlyWage * toNumber(values, 'expectedHours') + hourlyWage * 1.5 * toNumber(values, 'overtimeHours')
    : toNumber(values, 'salary');
  const wages = basePay + toNumber(values, 'bonusCommission');
  const socialSecurity = Math.min(wages, SS_WAGE_BASE_2026) * toNumber(values, 'employerSocialSecurityPct') / 100;
  const medicare = wages * toNumber(values, 'employerMedicarePct') / 100;
  const employerTaxes = socialSecurity + medicare + toNumber(values, 'futa') + toNumber(values, 'stateUnemployment') + toNumber(values, 'stateLocalPayrollTax') + toNumber(values, 'workersComp');
  const benefits = toNumber(values, 'healthInsurance') + toNumber(values, 'retirementMatch') + toNumber(values, 'paidTimeOffCost') + toNumber(values, 'professionalDevelopment');
  const setup = toNumber(values, 'recruiting') + toNumber(values, 'backgroundCheck') + toNumber(values, 'onboarding') + toNumber(values, 'equipment') + toNumber(values, 'softwareSeats') + toNumber(values, 'workspace');
  const managerCost = (toNumber(values, 'managerOnboardingHours') + toNumber(values, 'trainingHours')) * toNumber(values, 'managerHourlyValue');
  const monthlyRunRate = (wages + employerTaxes + benefits) / 12;
  const productivityGap =
    monthlyRunRate * (1 - toNumber(values, 'month1ProductivityPct') / 100) +
    monthlyRunRate * (1 - toNumber(values, 'month2ProductivityPct') / 100) +
    monthlyRunRate * (1 - toNumber(values, 'month3ProductivityPct') / 100);
  const first90Cost = monthlyRunRate * 3 + setup + managerCost + productivityGap + toNumber(values, 'mistakeReworkCost');
  const firstYear = wages + employerTaxes + benefits + setup + managerCost + productivityGap + toNumber(values, 'mistakeReworkCost');
  const ongoingAnnual = wages + employerTaxes + benefits;
  const burdenPct = wages > 0 ? (firstYear - wages) / wages : 0;
  const monthlyRevenue = Math.max(1, toNumber(values, 'monthlyRevenue'));
  const grossMargin = Math.max(0.05, toNumber(values, 'grossMarginPct') / 100);
  const revenueRequired = ongoingAnnual / grossMargin;
  const monthlyCashImpact = firstYear / 12;
  const reserveGap = Math.max(0, first90Cost - toNumber(values, 'payrollReserve'));

  return {
    headline: `${money(firstYear)} first-year fully loaded cost`,
    metrics: [
      { label: 'Salary / wage base', value: money(wages) },
      { label: 'Federal/state payroll tax estimate', value: money(employerTaxes) },
      { label: 'Benefits and PTO cost', value: money(benefits) },
      { label: 'Setup cost', value: money(setup) },
      { label: 'First 90-day cost', value: money(first90Cost) },
      { label: 'Ongoing annual cost', value: money(ongoingAnnual) },
      { label: 'Monthly cash impact', value: money(monthlyCashImpact) },
      { label: 'Revenue required at gross margin', value: money(revenueRequired) },
      { label: 'Payroll burden percentage', value: pct(burdenPct * 100) },
      { label: 'Payroll reserve gap', value: money(reserveGap) },
    ],
    flags: [
      `Federal baseline uses 2026 Social Security wage base of ${money(SS_WAGE_BASE_2026)} with user-entered employer tax rates.`,
      first90Cost > toNumber(values, 'payrollReserve') ? 'Payroll reserve does not cover the modeled first 90 days.' : 'Payroll reserve covers the modeled first 90 days.',
      monthlyCashImpact > monthlyRevenue * 0.25 ? 'The hire consumes a large share of current monthly revenue. Stress-test a slow ramp or revenue dip.' : 'The monthly cash impact is not dominating revenue under these assumptions.',
      productivityGap > monthlyRunRate ? 'Ramp-time drag is meaningful. The hire may be affordable later but stressful early.' : 'Ramp-time drag is present but not the largest cost.',
    ],
    notes: ['Salary is only the first line. State payroll, benefits, PTO, insurance, workers comp, equipment, software, and management rules can change the cost.'],
  };
}

function freelanceRate(values: Values): Result {
  const targetTakeHome = toNumber(values, 'targetTakeHome');
  const minimumTakeHome = toNumber(values, 'minimumTakeHome');
  const savingsTarget = toNumber(values, 'savingsTarget');
  const retirement = toNumber(values, 'retirementContribution');
  const healthInsurance = toNumber(values, 'healthInsuranceReplacement');
  const expenses =
    toNumber(values, 'businessExpenses') +
    toNumber(values, 'softwareTools') +
    toNumber(values, 'contractorCosts') +
    healthInsurance;
  const taxReserve = toNumber(values, 'taxReservePct') / 100;
  const billableHoursPerWeek = toNumber(values, 'billableHoursPerWeek');
  const workingHoursPerWeek = Math.max(1, toNumber(values, 'workingHoursPerWeek') || billableHoursPerWeek);
  const workWeeks = Math.max(1, toNumber(values, 'workWeeks'));
  const billableHours = Math.max(1, billableHoursPerWeek * workWeeks);
  const totalWorkHours = Math.max(billableHours, workingHoursPerWeek * workWeeks);
  const profitReserve = toNumber(values, 'profitReservePct') / 100;
  const discount = toNumber(values, 'discountPct') / 100;
  const paymentFees = toNumber(values, 'paymentFeesPct') / 100;
  const currentHourlyRate = toNumber(values, 'currentHourlyRate');
  const projectPrice = toNumber(values, 'projectPrice');
  const projectHours = Math.max(1, toNumber(values, 'projectHours'));
  const incomeGoal = Math.max(targetTakeHome, minimumTakeHome);
  const ownerFuture = savingsTarget + retirement;
  const preTaxNeed = (incomeGoal + ownerFuture) / Math.max(0.1, 1 - taxReserve);
  const revenueNeed = (preTaxNeed + expenses) * (1 + profitReserve);
  const protectedRevenue = revenueNeed / Math.max(0.1, 1 - discount);
  const feeProtectedRevenue = protectedRevenue / Math.max(0.1, 1 - paymentFees);
  const hourly = feeProtectedRevenue / billableHours;
  const healthierHourly = hourly * 1.15;
  const effectiveHourly = projectPrice / projectHours;
  const utilization = billableHours / totalWorkHours;
  const dayRate = healthierHourly * 7;
  const projectFloor = hourly * Math.max(1, toNumber(values, 'projectHours'));
  const retainerFloor = feeProtectedRevenue / 12;
  const currentGap = currentHourlyRate > 0 ? currentHourlyRate - hourly : 0;

  return {
    headline: `${money(hourly)} minimum hourly rate`,
    metrics: [
      { label: 'Annual revenue target', value: money(feeProtectedRevenue) },
      { label: 'Billable hours/year', value: numberLabel(billableHours, ' hrs') },
      { label: 'Monthly revenue target', value: money(feeProtectedRevenue / 12) },
      { label: 'Healthier hourly rate', value: money(healthierHourly), note: 'Adds room above the minimum floor.' },
      { label: 'Day rate equivalent', value: money(dayRate) },
      { label: 'Project price floor', value: money(projectFloor), note: 'Uses the project-hour input.' },
      { label: 'Retainer floor', value: money(retainerFloor) },
      { label: 'Billable utilization', value: pct(utilization * 100) },
      { label: 'Effective hourly on test project', value: money(effectiveHourly) },
      { label: 'Current rate gap', value: money(currentGap), note: currentGap >= 0 ? 'Current rate clears the floor.' : 'Current rate is below the modeled floor.' },
    ],
    flags: [
      billableHoursPerWeek < 25 ? 'Low billable hours drive the rate up. That is normal, not greed.' : 'Billable hours are not unusually low in this scenario.',
      toNumber(values, 'discountPct') > 0 ? 'Discounts and unpaid scope creep are being protected in the floor rate.' : 'No discount/scope-creep protection is modeled.',
      hourly < 50 ? 'This may be too low for many professional services after sales, admin, taxes, and slow months.' : 'Rate floor includes the hidden time and reserve assumptions.',
      currentHourlyRate > 0 && currentHourlyRate < hourly ? 'The current rate does not support the modeled floor. Raise price, reduce scope, or improve utilization.' : 'The current rate is not below the modeled floor.',
    ],
    notes: ['This is the minimum viable floor. Positioning, scarcity, outcomes, and risk may justify more.'],
  };
}

function marginPricing(values: Values): Result {
  const price = toNumber(values, 'price');
  const directCost =
    toNumber(values, 'directCost') +
    toNumber(values, 'laborCost') +
    toNumber(values, 'contractorCost') +
    toNumber(values, 'toolCost') +
    toNumber(values, 'shippingFulfillment');
  const overhead = toNumber(values, 'overheadShare');
  const processingFeePct = toNumber(values, 'processingFeePct') / 100;
  const discount = toNumber(values, 'discountPct') / 100;
  const targetMargin = toNumber(values, 'targetMarginPct') / 100;
  const desiredMarkup = toNumber(values, 'desiredMarkupPct') / 100;
  const minimumProfit = toNumber(values, 'minimumProfit');
  const deliveryHours = Math.max(1, toNumber(values, 'deliveryHours'));
  const discountedPrice = price * (1 - discount);
  const allCost = directCost + overhead + discountedPrice * processingFeePct;
  const originalCost = directCost + overhead + price * processingFeePct;
  const originalProfit = price - originalCost;
  const grossProfit = discountedPrice - allCost;
  const margin = discountedPrice > 0 ? grossProfit / discountedPrice : 0;
  const markup = allCost > 0 ? grossProfit / allCost : 0;
  const targetPrice = allCost / Math.max(0.05, 1 - targetMargin);
  const targetMarkupPrice = allCost * (1 + desiredMarkup);
  const extraSalesNeeded = grossProfit > 0 ? originalProfit / grossProfit : Infinity;
  const minimumSafePrice = allCost + minimumProfit;
  const effectiveHourly = grossProfit / deliveryHours;

  return {
    headline: `${pct(margin * 100)} margin after tested discount`,
    metrics: [
      { label: 'Discounted price', value: money(discountedPrice) },
      { label: 'Profit dollars after costs', value: money(grossProfit) },
      { label: 'Markup on total cost', value: pct(markup * 100) },
      { label: 'Price needed for target margin', value: money(targetPrice) },
      { label: 'Price from desired markup', value: money(targetMarkupPrice) },
      { label: 'Minimum safe price', value: money(minimumSafePrice) },
      { label: 'Extra sales needed after discount', value: Number.isFinite(extraSalesNeeded) ? numberLabel(extraSalesNeeded) : 'Not recoverable' },
      { label: 'Effective hourly profit', value: money(effectiveHourly) },
    ],
    flags: [
      margin < targetMargin ? 'The tested price misses the target margin. Raise price, reduce cost, or stop discounting.' : 'The tested price clears the target margin.',
      discount > 0.15 ? 'Large discounts look harmless in revenue and painful in profit.' : 'Discount pressure is moderate in this scenario.',
      grossProfit < minimumProfit ? 'Profit after cost is below the minimum acceptable profit.' : 'Profit clears the minimum acceptable profit.',
    ],
    notes: ['Margin is the share of price kept after costs; markup is profit relative to cost. Mixing them causes bad pricing.'],
  };
}

function breakEven(values: Values): Result {
  const fixed = toNumber(values, 'fixedMonthly');
  const ownerPay = toNumber(values, 'ownerPay');
  const reserve = toNumber(values, 'cashReserve');
  const averageSale = Math.max(1, toNumber(values, 'averageSale'));
  const pricePerUnit = Math.max(1, toNumber(values, 'pricePerUnit') || averageSale);
  const variableCostPerUnit = toNumber(values, 'variableCostPerUnit');
  const contributionFromUnitCost = Math.max(0.05, (pricePerUnit - variableCostPerUnit) / pricePerUnit);
  const contributionFromPct = Math.max(0.05, 1 - toNumber(values, 'variableCostPct') / 100);
  const contributionMargin = variableCostPerUnit > 0 ? contributionFromUnitCost : contributionFromPct;
  const targetProfit = toNumber(values, 'targetMonthlyProfit');
  const expectedRevenue = toNumber(values, 'expectedMonthlyRevenue');
  const billableRate = Math.max(1, toNumber(values, 'billableRate'));
  const monthlyNeed = fixed + ownerPay + reserve + targetProfit;
  const revenueNeeded = monthlyNeed / contributionMargin;
  const clientsNeeded = revenueNeeded / averageSale;
  const unitsNeeded = revenueNeeded / pricePerUnit;
  const billableHoursNeeded = revenueNeeded / billableRate;
  const ownerPayBreakEven = (fixed + ownerPay) / contributionMargin;
  const safetyMargin = expectedRevenue > 0 ? (expectedRevenue - revenueNeeded) / expectedRevenue : 0;

  return {
    headline: `${money(revenueNeeded)} monthly break-even revenue`,
    metrics: [
      { label: 'Clients / sales needed', value: numberLabel(clientsNeeded) },
      { label: 'Units needed', value: numberLabel(unitsNeeded) },
      { label: 'Billable hours needed', value: numberLabel(billableHoursNeeded, ' hrs') },
      { label: 'Contribution margin', value: pct(contributionMargin * 100) },
      { label: 'Monthly cost floor', value: money(monthlyNeed) },
      { label: 'Owner-pay break-even', value: money(ownerPayBreakEven) },
      { label: 'Revenue safety margin', value: pct(safetyMargin * 100) },
      { label: 'Annualized break-even revenue', value: money(revenueNeeded * 12) },
    ],
    flags: [
      clientsNeeded > 20 ? 'This model may require too many small customers unless fulfillment is very efficient.' : 'Client count looks operationally plausible if sales and delivery can support it.',
      ownerPay <= 0 ? 'Owner pay is missing. Break-even without the owner is not a healthy target.' : 'Owner pay is represented instead of treated as leftovers.',
      safetyMargin < 0.1 ? 'Expected revenue is too close to break-even. A normal slow month could create a loss.' : 'Expected revenue has some room above break-even.',
      billableHoursNeeded > 160 ? 'The business only works if billable capacity stays very high. That is a stamina requirement, not a buffer.' : 'Billable-hour requirement is not obviously overbuilt.',
    ],
    notes: ['Break-even is not the goal. It is the line where the business stops bleeding.'],
  };
}

function profitPlan(values: Values): Result {
  const enteredRevenue = toNumber(values, 'revenue');
  const revenueParts = toNumber(values, 'recurringRevenue') + toNumber(values, 'projectRevenue') + toNumber(values, 'oneTimeRevenue');
  const revenue = revenueParts > 0 ? revenueParts : enteredRevenue;
  const collectedRevenue = Math.max(0, revenue - toNumber(values, 'lateUncollectedRevenue'));
  const directCost =
    collectedRevenue * toNumber(values, 'directCostPct') / 100 +
    toNumber(values, 'contractors') +
    toNumber(values, 'materials') +
    toNumber(values, 'supportLaborCost');
  const operating = toNumber(values, 'operatingExpenses');
  const ownerPay = toNumber(values, 'ownerPay');
  const futureCost = toNumber(values, 'reinvestment') + toNumber(values, 'emergencyReserve') + toNumber(values, 'debtRepayment');
  const grossProfit = collectedRevenue - directCost;
  const operatingProfit = grossProfit - operating;
  const preTaxProfit = operatingProfit - ownerPay - futureCost;
  const taxReserve = Math.max(0, preTaxProfit) * toNumber(values, 'taxReservePct') / 100;
  const retained = preTaxProfit - taxReserve;
  const goal = toNumber(values, 'retainedProfitGoal');
  const margin = collectedRevenue > 0 ? retained / collectedRevenue : 0;
  const revenueGrowthIllusion = revenue > 0 ? (revenue - collectedRevenue) / revenue : 0;

  return {
    headline: `${money(retained)} retained profit after modeled tax reserve`,
    metrics: [
      { label: 'Collected revenue', value: money(collectedRevenue) },
      { label: 'Gross profit', value: money(grossProfit) },
      { label: 'Operating profit', value: money(operatingProfit) },
      { label: 'Direct costs', value: money(directCost) },
      { label: 'Operating expenses', value: money(operating) },
      { label: 'Owner pay', value: money(ownerPay) },
      { label: 'Future reserves and debt', value: money(futureCost) },
      { label: 'Profit margin after owner pay', value: pct(margin * 100) },
      { label: 'Retained profit gap', value: money(retained - goal) },
      { label: 'Late/uncollected share', value: pct(revenueGrowthIllusion * 100) },
    ],
    flags: [
      retained < goal ? 'The model misses the retained-profit goal. Price, cost, volume, or owner pay needs another pass.' : 'The model clears the retained-profit goal.',
      preTaxProfit < 0 ? 'The business is not covering direct cost, operating expenses, and owner pay under these inputs.' : 'Pre-tax profit is positive under these inputs.',
      ownerPay <= 0 ? 'Owner pay is missing. Profit that depends on unpaid ownership is not durable.' : 'Owner compensation is represented before retained profit.',
      revenueGrowthIllusion > 0.1 ? 'A meaningful share of revenue is late or uncollected. Revenue growth may not be cash growth.' : 'Late/uncollected revenue is not dominating the model.',
    ],
    notes: ['Tax reserve is simplified. Use actual books and tax guidance before distributing profit.'],
  };
}

function businessExpenseBudget(values: Values): Result {
  const core =
    toNumber(values, 'softwareSubscriptions') +
    toNumber(values, 'bookkeepingAccounting') +
    toNumber(values, 'insurance') +
    toNumber(values, 'legalAdmin') +
    toNumber(values, 'internetPhone') +
    toNumber(values, 'paymentProcessing') +
    toNumber(values, 'workspace') +
    toNumber(values, 'equipment') +
    toNumber(values, 'marketing') +
    toNumber(values, 'educationTraining');
  const delivery =
    toNumber(values, 'contractors') +
    toNumber(values, 'materialsTools') +
    toNumber(values, 'travelShipping') +
    toNumber(values, 'supportHours') * toNumber(values, 'ownerHourlyValue');
  const ownerLayer = toNumber(values, 'ownerSalaryTarget') + toNumber(values, 'taxReserveMonthly') + toNumber(values, 'emergencyBuffer');
  const monthlyTotal = core + delivery + ownerLayer;
  const billableHoursMonth = Math.max(1, toNumber(values, 'billableHoursPerWeek') * 4.33);
  const activeClients = Math.max(1, toNumber(values, 'activeClients'));
  const monthlyProjects = Math.max(1, toNumber(values, 'monthlyProjects'));
  const revenue = toNumber(values, 'monthlyRevenue');
  const burden = revenue > 0 ? monthlyTotal / revenue : 0;

  return {
    headline: `${money(monthlyTotal)} monthly cost to stay open`,
    metrics: [
      { label: 'Monthly fixed cost', value: money(core) },
      { label: 'Monthly delivery/admin cost', value: money(delivery) },
      { label: 'Owner, tax, and buffer layer', value: money(ownerLayer) },
      { label: 'Annual operating cost', value: money(monthlyTotal * 12) },
      { label: 'Cost per billable hour', value: money(monthlyTotal / billableHoursMonth) },
      { label: 'Cost per active client', value: money(monthlyTotal / activeClients) },
      { label: 'Cost per project', value: money(monthlyTotal / monthlyProjects) },
      { label: 'Break-even before owner pay', value: money(core + delivery) },
      { label: 'Break-even after owner pay', value: money(monthlyTotal) },
      { label: 'Expense burden vs revenue', value: pct(burden * 100) },
    ],
    flags: [
      core > revenue * 0.25 && revenue > 0 ? 'Fixed costs are heavy relative to revenue. Subscriptions and overhead need ownership.' : 'Fixed costs are not dominating revenue in this model.',
      delivery > core ? 'Delivery/admin cost is larger than fixed overhead. Pricing should include work around the work.' : 'Delivery/admin cost is not larger than fixed overhead.',
      burden > 0.8 ? 'Expenses and owner needs consume most revenue. The model is fragile without higher price, volume, or lower overhead.' : 'Monthly revenue has room beyond the modeled cost floor.',
    ],
    notes: ['This is cash-budget math. Deductibility and tax treatment are separate questions.'],
  };
}

function pricingConfidence(values: Values): Result {
  const proposed = toNumber(values, 'proposedPrice');
  const discounted = proposed * (1 - toNumber(values, 'discountPct') / 100);
  const deliveryCost = toNumber(values, 'estimatedDeliveryCost');
  const overhead = toNumber(values, 'businessExpensesAllocation');
  const hours = Math.max(1, toNumber(values, 'estimatedHours') + toNumber(values, 'nonBillableHours'));
  const preTaxProfit = discounted - deliveryCost - overhead;
  const taxReserve = Math.max(0, preTaxProfit) * toNumber(values, 'taxReservePct') / 100;
  const profitAfterHiddenCosts = preTaxProfit - taxReserve;
  const margin = discounted > 0 ? profitAfterHiddenCosts / discounted : 0;
  const desiredMargin = toNumber(values, 'desiredMarginPct') / 100;
  const effectiveHourly = profitAfterHiddenCosts / hours;
  const discountDamage = proposed - discounted;
  const scopeExposure = (toNumber(values, 'scopeRisk') / 100) * hours * Math.max(50, effectiveHourly);
  const riskPenalty =
    toNumber(values, 'scopeRisk') * 0.18 +
    toNumber(values, 'paymentDelayRisk') * 0.12 +
    toNumber(values, 'clientConcentrationPct') * 0.12 +
    (100 - toNumber(values, 'demandConfidence')) * 0.18 +
    (isChecked(values, 'supportIncluded') ? 6 : 0);
  const marginScore = clamp((margin / Math.max(0.01, desiredMargin)) * 45, 0, 45);
  const profitScore = clamp((profitAfterHiddenCosts / Math.max(1, deliveryCost + overhead)) * 35, 0, 35);
  const score = clamp(Math.round(30 + marginScore + profitScore - riskPenalty), 0, 100);
  const riskAdjustedProfit = profitAfterHiddenCosts - scopeExposure;

  return {
    headline: `${score}/100 pricing confidence score`,
    metrics: [
      { label: 'Margin after hidden costs', value: pct(margin * 100) },
      { label: 'Effective hourly rate', value: money(effectiveHourly) },
      { label: 'Discount damage', value: money(discountDamage) },
      { label: 'Scope creep exposure', value: money(scopeExposure) },
      { label: 'Risk-adjusted profit', value: money(riskAdjustedProfit) },
      { label: 'Tax reserve represented', value: money(taxReserve) },
    ],
    flags: [
      score >= 85 ? 'The price covers the work and the business around the work.' : score >= 70 ? 'The price can work if scope and delivery stay controlled.' : score >= 50 ? 'The price depends on optimistic assumptions.' : 'The work likely costs more than it appears.',
      margin < desiredMargin ? 'Modeled margin is below the desired margin.' : 'Modeled margin clears the desired margin.',
      riskAdjustedProfit < 0 ? 'Scope and risk exposure can erase the profit.' : 'Risk-adjusted profit stays positive.',
    ],
    notes: ['The score is intentionally conservative when demand confidence is weak or scope risk is high.'],
  };
}

function discountDamage(values: Values): Result {
  const originalPrice = toNumber(values, 'originalPrice');
  const totalCost = toNumber(values, 'directCost') + toNumber(values, 'overheadAllocation') + originalPrice * toNumber(values, 'paymentFeesPct') / 100;
  const discountedPrice = originalPrice * (1 - toNumber(values, 'discountPct') / 100);
  const profitBefore = originalPrice - totalCost;
  const profitAfter = discountedPrice - totalCost;
  const marginBefore = originalPrice > 0 ? profitBefore / originalPrice : 0;
  const marginAfter = discountedPrice > 0 ? profitAfter / discountedPrice : 0;
  const extraSalesNeeded = profitAfter > 0 ? profitBefore / profitAfter : Infinity;
  const actualExtraProfit = profitAfter * toNumber(values, 'expectedExtraSales');
  const effectiveHourly = profitAfter / Math.max(1, toNumber(values, 'deliveryHoursPerSale'));

  return {
    headline: `${money(Math.max(0, profitBefore - profitAfter))} profit lost per discounted sale`,
    metrics: [
      { label: 'Discounted price', value: money(discountedPrice) },
      { label: 'Profit before discount', value: money(profitBefore) },
      { label: 'Profit after discount', value: money(profitAfter) },
      { label: 'Margin before / after', value: `${pct(marginBefore * 100)} / ${pct(marginAfter * 100)}` },
      { label: 'Extra sales needed to recover', value: Number.isFinite(extraSalesNeeded) ? numberLabel(extraSalesNeeded) : 'Not recoverable' },
      { label: 'Expected extra profit from added sales', value: money(actualExtraProfit) },
      { label: 'Effective hourly after discount', value: money(effectiveHourly) },
    ],
    flags: [
      profitAfter <= 0 ? 'Do not discount. The discounted work is at or below cost.' : marginAfter < 0.15 ? 'Discount creates major margin damage.' : marginAfter < 0.3 ? 'Discount is painful but possible only with clear volume or strategic value.' : 'Margin remains healthy after the discount.',
      profitAfter < toNumber(values, 'minimumAcceptableProfit') ? 'Profit after discount is below the minimum acceptable profit.' : 'Profit after discount clears the minimum acceptable profit.',
      Number.isFinite(extraSalesNeeded) && extraSalesNeeded > toNumber(values, 'expectedExtraSales') ? 'Expected extra sales do not recover the lost profit.' : 'Expected extra sales can recover the lost profit if they actually happen.',
    ],
    notes: ['Discounts reduce profit before they reduce effort. Same work, lower price, same delivery burden.'],
  };
}

function scopeCreepCost(values: Values): Result {
  const price = toNumber(values, 'originalProjectPrice');
  const estimatedHours = Math.max(1, toNumber(values, 'estimatedProjectHours'));
  const totalHours =
    toNumber(values, 'actualProjectHours') +
    toNumber(values, 'extraMeetings') +
    toNumber(values, 'extraRevisions') +
    toNumber(values, 'unpaidSupportTime') +
    toNumber(values, 'adminCommunicationTime');
  const unpaidHours = Math.max(0, totalHours - estimatedHours);
  const targetRate = toNumber(values, 'desiredHourlyRate');
  const contractorCost = toNumber(values, 'contractorCost');
  const marginBefore = (price - estimatedHours * targetRate - contractorCost) / Math.max(1, price);
  const marginAfter = (price - totalHours * targetRate - contractorCost) / Math.max(1, price);
  const creepCost = unpaidHours * targetRate;
  const revisedPrice = price + creepCost * (1 + toNumber(values, 'desiredMarginPct') / 100);
  const effectiveHourly = (price - contractorCost) / Math.max(1, totalHours);

  return {
    headline: `${money(creepCost)} scope creep cost`,
    metrics: [
      { label: 'Effective hourly rate', value: money(effectiveHourly) },
      { label: 'Unpaid hours', value: numberLabel(unpaidHours, ' hrs') },
      { label: 'Profit lost to scope creep', value: money(creepCost) },
      { label: 'Margin before / after', value: `${pct(marginBefore * 100)} / ${pct(marginAfter * 100)}` },
      { label: 'Revised price needed', value: money(revisedPrice) },
      { label: 'Future scope buffer', value: money(revisedPrice - price) },
    ],
    flags: [
      unpaidHours <= estimatedHours * 0.05 ? 'Scope is controlled. Extra work is minor.' : unpaidHours <= estimatedHours * 0.2 ? 'Extra work is noticeable. Tighten meeting, revision, and change-order boundaries.' : unpaidHours <= estimatedHours * 0.45 ? 'Scope creep significantly reduced profit.' : 'Scope is broken. Reprice, rescope, or restructure the project.',
      marginAfter < 0 ? 'The project is below the modeled cost of time and contractor expense.' : 'The project still has positive modeled margin.',
    ],
    notes: ['Scope creep is often an offer-design problem: unclear deliverables, weak revision limits, or fear of making the client uncomfortable.'],
  };
}

function walkAwayPrice(values: Values): Result {
  const hours = toNumber(values, 'estimatedDeliveryHours') + toNumber(values, 'salesAdminHours') + toNumber(values, 'revisionBufferHours');
  const laborValue = hours * toNumber(values, 'desiredEffectiveHourlyRate');
  const subtotal = laborValue + toNumber(values, 'directCosts') + toNumber(values, 'opportunityCost');
  const riskAdjusted = subtotal * (1 + toNumber(values, 'riskPremiumPct') / 100);
  const walkAway = riskAdjusted / Math.max(0.1, 1 - toNumber(values, 'minimumMarginPct') / 100) / Math.max(0.1, 1 - toNumber(values, 'taxReservePct') / 100);
  const healthy = walkAway * 1.15;
  const premium = walkAway * 1.35;
  const proposed = toNumber(values, 'clientProposedPrice');
  const effectiveAtProposed = (proposed - toNumber(values, 'directCosts')) / Math.max(1, hours);
  const strategic = isChecked(values, 'strategicValue');

  return {
    headline: `${money(walkAway)} walk-away price`,
    metrics: [
      { label: 'Minimum acceptable price', value: money(walkAway) },
      { label: 'Healthy price', value: money(healthy) },
      { label: 'Premium price', value: money(premium) },
      { label: 'Risk-adjusted price base', value: money(riskAdjusted) },
      { label: 'Effective hourly at client price', value: money(effectiveAtProposed) },
      { label: 'Gap from walk-away price', value: money(proposed - walkAway) },
    ],
    flags: [
      proposed >= walkAway ? 'Client price is acceptable if scope stays controlled.' : strategic && proposed >= walkAway * 0.85 ? 'Below floor. Strategic only, and only with explicit scope and reason.' : proposed >= walkAway * 0.85 ? 'Rescope before accepting. The price could work only if deliverables shrink.' : 'Walk away or materially rescope. The price does not support the work.',
      strategic ? 'Strategic value is marked, but it should have a specific reason and expiration.' : 'No strategic exception is modeled.',
    ],
    notes: ['A walk-away price protects the business from resentment, bad fit, and work that crowds out better opportunities.'],
  };
}

function clientProfitability(values: Values): Result {
  const revenue = toNumber(values, 'clientRevenue');
  const discountCost = revenue * toNumber(values, 'discountPct') / 100;
  const paymentDelayCost = revenue * (toNumber(values, 'paymentDelayDays') / 365) * 0.12;
  const hours = Math.max(1, toNumber(values, 'deliveryHours') + toNumber(values, 'supportHours') + toNumber(values, 'meetingHours') + toNumber(values, 'adminHours'));
  const hardCost = toNumber(values, 'contractorCost') + toNumber(values, 'softwareToolCost') + discountCost + paymentDelayCost;
  const attentionCost = hours * toNumber(values, 'targetHourlyRate') * (1 + toNumber(values, 'complexityScore') / 300);
  const profit = revenue - hardCost - attentionCost;
  const margin = revenue > 0 ? profit / revenue : 0;
  const effectiveHourly = (revenue - hardCost) / hours;

  return {
    headline: `${money(profit)} client profit after time and complexity`,
    metrics: [
      { label: 'Client profit', value: money(profit) },
      { label: 'Effective hourly rate', value: money(effectiveHourly) },
      { label: 'Margin by client', value: pct(margin * 100) },
      { label: 'Support burden', value: numberLabel(toNumber(values, 'supportHours') + toNumber(values, 'meetingHours'), ' hrs') },
      { label: 'Payment-delay cost', value: money(paymentDelayCost) },
      { label: 'Discount/concession cost', value: money(discountCost) },
    ],
    flags: [
      margin >= 0.35 ? 'Great client: profitable and operationally healthy.' : margin >= 0.2 ? 'Good but heavy: profitable, but needs attention.' : margin >= 0 ? 'Low-margin: raise price, reduce scope, or lower support load.' : 'Quietly costly: the client takes more than they pay for.',
      toNumber(values, 'complexityScore') > 60 ? 'Complexity is high. A kind client can still be operationally expensive.' : 'Complexity is not the dominant pressure in this model.',
    ],
    notes: ['Profitability is revenue minus attention, time, complexity, delay, and hard cost.'],
  };
}

function pricingModelComparison(values: Values): Result {
  const scope = toNumber(values, 'scopeClarity');
  const repeatability = toNumber(values, 'repeatability');
  const urgency = toNumber(values, 'clientUrgency');
  const value = toNumber(values, 'outcomeValue');
  const revisionRisk = toNumber(values, 'revisionRisk');
  const uncertainty = toNumber(values, 'deliveryUncertainty');
  const support = isChecked(values, 'supportIncluded');
  const relationship = toNumber(values, 'relationshipMonths');
  const expectedHours = Math.max(1, toNumber(values, 'expectedHours'));
  const hourlyFloor = toNumber(values, 'hourlyFloor');
  const marginFactor = 1 / Math.max(0.1, 1 - toNumber(values, 'desiredMarginPct') / 100);
  const type = toStringValue(values, 'typeOfWork');

  const scores = [
    { model: 'Hourly', score: 45 + uncertainty * 0.35 + revisionRisk * 0.2 - scope * 0.1, note: 'Best when scope is unclear or exploratory.' },
    { model: 'Project', score: 35 + scope * 0.4 + urgency * 0.1 - revisionRisk * 0.25 - uncertainty * 0.2, note: 'Best when the deliverable is clear and bounded.' },
    { model: 'Retainer', score: 30 + relationship * 2 + (support ? 18 : 0) + urgency * 0.1 - revisionRisk * 0.1, note: 'Best when need is recurring and capacity-based.' },
    { model: 'Subscription', score: 25 + repeatability * 0.55 + (support ? 10 : 0) - uncertainty * 0.15, note: 'Best when delivery is standardized and repeatable.' },
    { model: 'Value-based', score: 25 + value * 0.55 + scope * 0.15 - uncertainty * 0.2, note: 'Best when outcome value is high and measurable.' },
    { model: 'Hybrid', score: 40 + uncertainty * 0.15 + scope * 0.15 + repeatability * 0.15, note: 'Best when part of the work is known and part is not.' },
  ];
  if (type === 'repeatable') scores.find((item) => item.model === 'Subscription')!.score += 15;
  if (type === 'outcome') scores.find((item) => item.model === 'Value-based')!.score += 15;
  if (type === 'project') scores.find((item) => item.model === 'Project')!.score += 12;
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const best = sorted[0];
  const floor = expectedHours * hourlyFloor * marginFactor;

  return {
    headline: `${best.model} pricing is the best modeled fit`,
    metrics: [
      { label: 'Recommended price floor', value: money(floor) },
      { label: 'Best-fit score', value: numberLabel(best.score, '/100') },
      { label: 'Runner-up model', value: sorted[1]?.model ?? 'None' },
      { label: 'Risky model', value: sorted[sorted.length - 1]?.model ?? 'None' },
    ],
    flags: [
      best.note,
      revisionRisk > 60 ? 'Revision risk is high. Avoid fixed scope without change-order language.' : 'Revision risk is not the main pricing-model warning.',
      uncertainty > 60 ? 'Delivery uncertainty is high. Hourly or hybrid can be smarter than pretending scope is clear.' : 'Delivery uncertainty is manageable.',
    ],
    notes: ['Hourly is not automatically beginner and value-based is not automatically better. The model should fit the work.'],
    options: sorted.slice(0, 4).map((item) => ({
      title: item.model,
      stance: item.note,
      details: [`Modeled fit score: ${numberLabel(item.score, '/100')}.`, `Price floor before model-specific packaging: ${money(floor)}.`],
      pushback: item.model === best.model ? 'Use this model, then define scope boundaries before quoting.' : 'Use only if the scope or risk profile changes.',
    })),
  };
}

function priceIncreasePlanner(values: Values): Result {
  const current = toNumber(values, 'currentPrice');
  const proposed = toNumber(values, 'proposedPrice');
  const clients = Math.max(1, toNumber(values, 'clientCount'));
  const increasePct = current > 0 ? (proposed - current) / current : 0;
  const currentCost = current * (1 - toNumber(values, 'currentMarginPct') / 100);
  const adjustedCost = currentCost * (1 + toNumber(values, 'costIncreasePct') / 100);
  const newMargin = proposed > 0 ? (proposed - adjustedCost) / proposed : 0;
  const monthlyGain = (proposed - current) * clients;
  const clientsCanLose = proposed > 0 ? monthlyGain / proposed : 0;
  const churnBreakEvenPct = clientsCanLose / clients;
  const expectedChurnPct = toNumber(values, 'churnRiskPct') / 100;
  const expectedLostRevenue = proposed * clients * expectedChurnPct;
  const netAfterExpectedChurn = monthlyGain - expectedLostRevenue;
  const caseScore =
    45 +
    toNumber(values, 'valueAddedScore') * 0.18 +
    toNumber(values, 'supportBurdenScore') * 0.12 +
    toNumber(values, 'demandConfidence') * 0.18 -
    expectedChurnPct * 100 * 0.25 -
    (toNumber(values, 'daysUntilRenewal') < 14 ? 8 : 0);

  return {
    headline: `${pct(increasePct * 100)} planned price increase`,
    metrics: [
      { label: 'New margin', value: pct(newMargin * 100) },
      { label: 'Revenue impact before churn', value: money(monthlyGain) },
      { label: 'Clients you can afford to lose', value: numberLabel(clientsCanLose) },
      { label: 'Churn break-even', value: pct(churnBreakEvenPct * 100) },
      { label: 'Net after expected churn', value: money(netAfterExpectedChurn) },
      { label: 'Increase case score', value: numberLabel(clamp(caseScore, 0, 100), '/100') },
    ],
    flags: [
      caseScore >= 80 ? 'Strong case: the increase is supported by costs, value, or demand.' : caseScore >= 65 ? 'Reasonable case: the increase can work with clear communication.' : caseScore >= 50 ? 'Sensitive case: segment or phase the rollout.' : 'Risky case: the increase may expose weak value, service, or demand.',
      expectedChurnPct > churnBreakEvenPct ? 'Expected churn is above break-even. Segment the increase or improve the offer before rolling out.' : 'Expected churn is within the break-even tolerance.',
      toNumber(values, 'daysUntilRenewal') < 14 ? 'Timing is tight. Give clients enough notice before the new rate begins.' : 'Timing gives room for communication before renewal.',
    ],
    notes: ['A price increase feels personal because the owner imagines the reaction, but the business may already be paying the increase through lower margin.'],
  };
}

function hireAutomate(values: Values): Result {
  const hours = toNumber(values, 'taskHoursWeek');
  const ownerValue = hours * toNumber(values, 'ownerHourlyValue') * 4.33;
  const employee = toNumber(values, 'employeeMonthlyCost');
  const contractor = hours * toNumber(values, 'contractorHourlyRate') * 4.33;
  const automationCoverage = toNumber(values, 'automationCoveragePct') / 100;
  const adoption = toNumber(values, 'adoptionRatePct') / 100;
  const reviewCost = (toNumber(values, 'reviewHoursWeek') + toNumber(values, 'maintenanceHoursWeek')) * toNumber(values, 'ownerHourlyValue') * 4.33;
  const implementationCost = (toNumber(values, 'implementationHours') + toNumber(values, 'trainingHours')) * toNumber(values, 'ownerHourlyValue');
  const automationMonthly = toNumber(values, 'automationMonthlyCost') + reviewCost + (toNumber(values, 'automationSetupCost') + implementationCost) / 12;
  const valueRemoved = ownerValue * automationCoverage * adoption;
  const reviewTimeAdded = toNumber(values, 'reviewHoursWeek') + toNumber(values, 'maintenanceHoursWeek');
  const netTimeSaved = Math.max(0, hours * automationCoverage * adoption - reviewTimeAdded);
  const netAutomation = valueRemoved - automationMonthly;
  const paybackMonths = netAutomation > 0 ? (toNumber(values, 'automationSetupCost') + implementationCost) / netAutomation : Infinity;
  const best = Math.min(employee, contractor, automationMonthly);
  const processFragility = clamp((100 - toNumber(values, 'documentationScore')) * 0.35 + toNumber(values, 'badProcessScore') * 0.35 + toNumber(values, 'integrationComplexityScore') * 0.2 + toNumber(values, 'privacyCautionScore') * 0.1, 0, 100);
  const route =
    toNumber(values, 'taskValueScore') < 35 || toNumber(values, 'canDeletePct') >= 35
      ? 'delete'
      : processFragility >= 65
        ? 'simplify'
        : automationCoverage >= 0.55 && toNumber(values, 'repetitivenessScore') >= 65 && toNumber(values, 'judgmentScore') < 45
          ? 'automate'
          : hours < 25 || toNumber(values, 'adoptionRatePct') < 55
            ? 'contract'
            : 'hire';

  return {
    headline: `${route.charAt(0).toUpperCase()}${route.slice(1)} first`,
    metrics: [
      { label: 'Employee monthly cost', value: money(employee) },
      { label: 'Contractor monthly cost', value: money(contractor) },
      { label: 'Automation monthly equivalent', value: money(automationMonthly) },
      { label: 'Lowest modeled cash path', value: money(best) },
      { label: 'Time saved before review', value: numberLabel(hours * automationCoverage * adoption, ' hrs/wk') },
      { label: 'Review/maintenance time added', value: numberLabel(reviewTimeAdded, ' hrs/wk') },
      { label: 'Net time saved', value: numberLabel(netTimeSaved, ' hrs/wk') },
      { label: 'Automation payback period', value: Number.isFinite(paybackMonths) ? numberLabel(paybackMonths, ' mo') : 'No payback yet' },
      { label: 'Process fragility score', value: numberLabel(processFragility, '/100') },
    ],
    flags: [
      route === 'delete' ? 'The task may not need to exist. Delete or reduce it before finding a person or tool.' : 'The task appears to have enough value to inspect a replacement path.',
      processFragility >= 65 ? 'The process is too fragile for a clean handoff. Simplify and document before hiring or automating.' : 'Process fragility is not the main blocker under these inputs.',
      automationCoverage < 0.4 ? 'Automation removes less than 40 percent of the work. Delete, simplify, or document the process before buying tools.' : 'Automation removes a material share of the work if the coverage estimate is honest.',
      reviewTimeAdded > hours * 0.25 ? 'Review/babysitting work is high. The tool may be shifting work instead of removing it.' : 'Review work is not dominating the automation path.',
      employee > ownerValue ? 'A full employee costs more than the monthly value of this task. Redesign the role or combine responsibilities.' : 'Employee cost is within range of the task value if the role is broader than this workflow.',
    ],
    notes: ['A person adds judgment and accountability. Automation removes repetitive work only when the workflow is already clear. AI ROI is not real until the workflow changes.'],
  };
}

function revenuePerEmployee(values: Values): Result {
  const annualRevenue = toNumber(values, 'annualRevenue') || toNumber(values, 'monthlyRevenue') * 12;
  const headcount = Math.max(1, toNumber(values, 'currentEmployees') + toNumber(values, 'contractorsFte') + toNumber(values, 'plannedHires') + toNumber(values, 'partTimeFte') + (isChecked(values, 'ownerIncluded') ? 1 : 0));
  const peopleCost = toNumber(values, 'currentPayroll') + toNumber(values, 'plannedPayroll') + toNumber(values, 'benefits') + toNumber(values, 'recruitingTraining') + toNumber(values, 'softwareEquipmentPerPerson') * headcount;
  const rpe = annualRevenue / headcount;
  const payrollShare = peopleCost / Math.max(1, annualRevenue);
  const grossProfit = annualRevenue * toNumber(values, 'grossMarginPct') / 100;
  const grossProfitPerPerson = grossProfit / headcount;
  const revenueNeededForNextHire = toNumber(values, 'plannedPayroll') / Math.max(0.05, toNumber(values, 'grossMarginPct') / 100);
  const recurringRevenue = annualRevenue * toNumber(values, 'recurringRevenuePct') / 100;
  const operatingLeverage = clamp(toNumber(values, 'revenueStabilityScore') + toNumber(values, 'netMarginPct') - toNumber(values, 'clientConcentrationPct') * 0.4 - payrollShare * 40, 0, 100);

  return {
    headline: `${money(rpe)} revenue per person`,
    metrics: [
      { label: 'Revenue per employee/FTE', value: money(rpe) },
      { label: 'Payroll and people cost share', value: pct(payrollShare * 100) },
      { label: 'Gross profit per person', value: money(grossProfitPerPerson) },
      { label: 'Revenue needed for next hire', value: money(revenueNeededForNextHire) },
      { label: 'Revenue gap for planned hire', value: money(revenueNeededForNextHire - annualRevenue / 12) },
      { label: 'Recurring revenue represented', value: money(recurringRevenue) },
      { label: 'Operating leverage indicator', value: numberLabel(operatingLeverage, '/100') },
      { label: 'Founder workload pressure', value: numberLabel(toNumber(values, 'founderWorkloadScore'), '/100') },
    ],
    flags: [
      payrollShare > 0.45 ? 'Payroll and people cost may be outpacing revenue. Stress-test the next hire.' : 'People cost share is not dominating revenue under these inputs.',
      toNumber(values, 'clientConcentrationPct') > 35 ? 'Client concentration can make revenue per employee look healthier than cash risk really is.' : 'Client concentration is not the largest warning in this model.',
      toNumber(values, 'founderWorkloadScore') > 70 ? 'The founder may still be the bottleneck. More headcount can increase coordination before capacity improves.' : 'Founder workload pressure is not extreme in this scenario.',
    ],
    notes: ['Revenue per employee is a planning signal, not a universal benchmark. Margin, cash timing, client concentration, and owner workload change what is healthy.'],
  };
}

function hiringReadiness(values: Values): Result {
  const salary = toNumber(values, 'salary');
  const annualLoad = salary * (1 + toNumber(values, 'payrollTaxPct') / 100) + toNumber(values, 'benefitsMonthly') * 12 + toNumber(values, 'softwareSeatsMonthly') * 12 + toNumber(values, 'equipment') + toNumber(values, 'recruitingTraining') + toNumber(values, 'managerHoursWeek') * 52 * toNumber(values, 'managerHourlyValue');
  const first90Cost = annualLoad / 4 + salary / 4 * toNumber(values, 'productivityRampPct') / 100;
  const grossProfitMonthly = toNumber(values, 'monthlyRevenue') * toNumber(values, 'grossMarginPct') / 100;
  const revenueSupport = clamp((toNumber(values, 'currentProfit') * 12 / Math.max(1, annualLoad)) * 70 + toNumber(values, 'revenueStabilityScore') * 0.3 - toNumber(values, 'clientConcentrationPct') * 0.3, 0, 100);
  const roleClarity = (toNumber(values, 'roleClarityScore') + toNumber(values, 'documentedProcessScore') + toNumber(values, 'decisionAuthorityScore') + toNumber(values, 'successMetricsScore') + toNumber(values, 'planScore')) / 5;
  const needScore = (toNumber(values, 'recurringNeedScore') + toNumber(values, 'permanentNeedScore') + toNumber(values, 'predictabilityScore') + toNumber(values, 'judgmentScore')) / 4;
  const reserveScore = clamp(toNumber(values, 'payrollReserve') / Math.max(1, first90Cost) * 100, 0, 100);
  const managementScore = clamp(100 - toNumber(values, 'managerHoursWeek') * 7, 0, 100);
  const alternativePenalty = Math.max(toNumber(values, 'contractorOptionScore'), toNumber(values, 'automationOptionScore'), toNumber(values, 'deletionOptionScore')) * 0.18;
  const score = clamp(Math.round(revenueSupport * 0.28 + roleClarity * 0.24 + needScore * 0.2 + reserveScore * 0.16 + managementScore * 0.12 - alternativePenalty), 0, 100);
  const revenueRequired = annualLoad / Math.max(0.05, toNumber(values, 'grossMarginPct') / 100);
  const reserveGap = Math.max(0, first90Cost - toNumber(values, 'payrollReserve'));

  return {
    headline: `${numberLabel(score, '/100')} Hiring Readiness Score`,
    metrics: [
      { label: 'First-year fully loaded cost', value: money(annualLoad) },
      { label: 'First 90-day cost', value: money(first90Cost) },
      { label: 'Revenue required to support hire', value: money(revenueRequired) },
      { label: 'Payroll reserve gap', value: money(reserveGap) },
      { label: 'Role clarity score', value: numberLabel(roleClarity, '/100') },
      { label: 'Management capacity score', value: numberLabel(managementScore, '/100') },
      { label: 'Revenue support score', value: numberLabel(revenueSupport, '/100') },
      { label: 'Monthly gross profit after hire', value: money(grossProfitMonthly - annualLoad / 12) },
    ],
    flags: [
      score >= 85 ? 'Ready: the role, revenue, process, and management capacity look strong enough to proceed.' : score >= 70 ? 'Almost ready: one or two assumptions need tightening before payroll.' : score >= 50 ? 'Fragile: the hire depends on optimistic revenue, unclear role design, or weak process.' : 'Not ready: simplify, contract, automate, or build reserve before hiring.',
      roleClarity < 60 ? 'Role clarity is weak. This may be founder overwhelm, not a hire-ready job.' : 'Role clarity is not the main blocker in this model.',
      reserveGap > 0 ? 'The payroll reserve does not cover the modeled first 90 days.' : 'Payroll reserve covers the modeled ramp period.',
      alternativePenalty > 12 ? 'A contractor, automation, or deletion path is strong enough to test before payroll.' : 'Alternatives do not dominate the hire in this model.',
    ],
    notes: ['The score is a readiness screen. Use it to find the weakest assumption before recruiting, not to replace legal, payroll, or HR review.'],
  };
}

function first90DayHireCost(values: Values): Result {
  const salary = toNumber(values, 'hourlyWage') > 0 ? toNumber(values, 'hourlyWage') * toNumber(values, 'hoursPerWeek') * 52 : toNumber(values, 'salary');
  const monthlyPay = salary / 12;
  const payrollTaxes90 = monthlyPay * 3 * toNumber(values, 'employerPayrollTaxPct') / 100;
  const benefits90 = toNumber(values, 'benefitsMonthly') * 3;
  const managerCost = (toNumber(values, 'onboardingHours') + toNumber(values, 'trainingHours')) * toNumber(values, 'managerHourlyValue');
  const software90 = toNumber(values, 'softwareMonthly') * 3;
  const productivityGap =
    monthlyPay * (1 - toNumber(values, 'month1ProductivityPct') / 100) +
    monthlyPay * (1 - toNumber(values, 'month2ProductivityPct') / 100) +
    monthlyPay * (1 - toNumber(values, 'month3ProductivityPct') / 100);
  const setup = toNumber(values, 'recruitingCost') + toNumber(values, 'equipment') + managerCost + software90;
  const first30 = monthlyPay + monthlyPay * toNumber(values, 'employerPayrollTaxPct') / 100 + toNumber(values, 'benefitsMonthly') + toNumber(values, 'recruitingCost') + toNumber(values, 'equipment') + managerCost * 0.45;
  const first60 = first30 + monthlyPay * 1.08 + toNumber(values, 'benefitsMonthly') + managerCost * 0.3 + toNumber(values, 'softwareMonthly');
  const first90 = monthlyPay * 3 + payrollTaxes90 + benefits90 + setup + productivityGap + toNumber(values, 'expectedMistakesRework') + toNumber(values, 'delayedRevenueImpact');
  const reserveGap = Math.max(0, first90 - toNumber(values, 'payrollReserve'));

  return {
    headline: `${money(first90)} first 90-day hire cost`,
    metrics: [
      { label: 'First 30-day cost', value: money(first30) },
      { label: 'First 60-day cost', value: money(first60) },
      { label: 'First 90-day cost', value: money(first90) },
      { label: 'Productivity gap cost', value: money(productivityGap) },
      { label: 'Manager time cost', value: money(managerCost) },
      { label: 'Cash reserve needed', value: money(first90) },
      { label: 'Reserve gap', value: money(reserveGap) },
    ],
    flags: [
      reserveGap <= 0 ? 'Easy ramp: the business can absorb the modeled first 90 days.' : reserveGap < first90 * 0.25 ? 'Manageable: the hire works if ramp stays close to plan.' : reserveGap < first90 * 0.5 ? 'Cash tight: build reserve or phase the start.' : 'Too risky: the business cannot comfortably carry the ramp period.',
      productivityGap > monthlyPay ? 'Productivity drag is meaningful. The person is paid before they are fully productive.' : 'Productivity drag is present but not dominating the 90-day cost.',
      managerCost > monthlyPay ? 'Manager time is a major ramp cost. Calendar capacity matters before the first day.' : 'Manager time is not the largest modeled cost.',
    ],
    notes: ['Most hiring calculators focus on annual cost. Small businesses often feel the hire hardest in the first 90 days.'],
  };
}

function roleClarity(values: Values): Result {
  const clarity = (
    toNumber(values, 'responsibilitiesScore') +
    toNumber(values, 'outcomesScore') +
    toNumber(values, 'recurringTasksScore') +
    toNumber(values, 'processDocsScore') +
    toNumber(values, 'decisionAuthorityScore') +
    toNumber(values, 'successMetricsScore') +
    toNumber(values, 'reportingStructureScore') +
    toNumber(values, 'handoffScore') +
    toNumber(values, 'boundariesScore') +
    toNumber(values, 'planScore')
  ) / 10;
  const managementRisk = clamp(toNumber(values, 'ownerInvolvementHours') * 8 + toNumber(values, 'roleBreadthScore') * 0.45 + (100 - toNumber(values, 'processDocsScore')) * 0.35, 0, 100);
  const score = clamp(Math.round(clarity - managementRisk * 0.18), 0, 100);
  const missingPieces = [
    toNumber(values, 'processDocsScore') < 60 ? 'process documentation' : '',
    toNumber(values, 'boundariesScore') < 60 ? 'what the role does not own' : '',
    toNumber(values, 'planScore') < 60 ? '30/60/90 expectations' : '',
    toNumber(values, 'successMetricsScore') < 60 ? 'success metrics' : '',
  ].filter(Boolean);

  return {
    headline: `${numberLabel(score, '/100')} Role Clarity Score`,
    metrics: [
      { label: 'Role clarity score', value: numberLabel(score, '/100') },
      { label: 'Missing pieces', value: missingPieces.length ? missingPieces.join(', ') : 'None obvious' },
      { label: 'Process documentation gap', value: numberLabel(100 - toNumber(values, 'processDocsScore'), '/100') },
      { label: 'Management risk', value: numberLabel(managementRisk, '/100') },
      { label: 'Owner involvement', value: numberLabel(toNumber(values, 'ownerInvolvementHours'), ' hrs/wk') },
    ],
    flags: [
      score >= 85 ? 'Hire-ready role: the job is clear enough to recruit against.' : score >= 70 ? 'Mostly clear: tighten one or two missing pieces before recruiting.' : score >= 50 ? 'Needs design: the role is probably too broad or undocumented.' : 'Not a role yet: this looks like owner stress more than a job description.',
      toNumber(values, 'roleBreadthScore') > 65 ? 'The role may be too broad. Split admin, operations, customer work, and quality control before hiring one person to absorb everything.' : 'Role breadth is not the main warning.',
      missingPieces.length > 0 ? `Fix before hiring: ${missingPieces.join(', ')}.` : 'Responsibilities, process, boundaries, and success measures are represented.',
    ],
    notes: ['A person cannot succeed inside a job that is really unresolved process, unclear priorities, and founder overload.'],
  };
}

function managementBurden(values: Values): Result {
  const weeklyHours =
    toNumber(values, 'weeklyCheckinHours') +
    toNumber(values, 'reviewHoursWeek') +
    toNumber(values, 'feedbackHoursWeek') +
    toNumber(values, 'meetingsHoursWeek') +
    toNumber(values, 'reworkHoursWeek') +
    toNumber(values, 'communicationHoursWeek');
  const monthlyHours = weeklyHours * 4.33 + toNumber(values, 'trainingHoursMonth') + toNumber(values, 'documentationHoursMonth');
  const cost = monthlyHours * toNumber(values, 'managerHourlyValue');
  const totalCost = cost + toNumber(values, 'employeeMonthlyCost');
  const capacityImpact = monthlyHours / Math.max(1, 173);
  const readiness = clamp((toNumber(values, 'roleMaturityScore') + toNumber(values, 'employeeExperienceScore')) / 2 - capacityImpact * 120 - Math.max(0, toNumber(values, 'directReports') - 5) * 4, 0, 100);

  return {
    headline: `${numberLabel(monthlyHours, ' management hrs/mo')}`,
    metrics: [
      { label: 'Monthly management hours', value: numberLabel(monthlyHours, ' hrs') },
      { label: 'Management time cost', value: money(cost) },
      { label: 'Owner capacity impact', value: pct(capacityImpact * 100) },
      { label: 'Employee cost plus manager cost', value: money(totalCost) },
      { label: 'Delegation readiness', value: numberLabel(readiness, '/100') },
    ],
    flags: [
      readiness >= 75 ? 'Low burden: the role can likely operate with light management.' : readiness >= 55 ? 'Manageable: regular oversight is needed, but it may not be disruptive.' : readiness >= 35 ? 'Heavy: management work may offset much of the capacity gained.' : 'Unready: hiring may create more owner work than it removes.',
      toNumber(values, 'reworkHoursWeek') > 4 ? 'Rework is a major management load. Clarify quality standards before adding headcount.' : 'Rework is not the biggest management cost.',
      toNumber(values, 'directReports') > 6 ? 'Direct-report load is high for an owner-manager. Add structure before adding people.' : 'Direct-report count is not extreme in this model.',
    ],
    notes: ['Hiring does not remove work automatically. It often turns task work into training, reviewing, explaining, correcting, planning, and managing.'],
  };
}

function contractorTrial(values: Values): Result {
  const trialHours = toNumber(values, 'trialLengthWeeks') * toNumber(values, 'expectedHoursWeek');
  const contractorCost = trialHours * toNumber(values, 'contractorRate');
  const managementHours = toNumber(values, 'trialLengthWeeks') * toNumber(values, 'ownerManagementHoursWeek') + toNumber(values, 'onboardingHours');
  const managementCost = managementHours * toNumber(values, 'managerHourlyValue');
  const total = contractorCost + managementCost + toNumber(values, 'toolsSoftwareCost');
  const weekly = total / Math.max(1, toNumber(values, 'trialLengthWeeks'));
  const trialScore = clamp((toNumber(values, 'deliverablesClarityScore') + toNumber(values, 'successCriteriaScore') + toNumber(values, 'handoffClarityScore') + toNumber(values, 'workRecurrenceScore')) / 4 - toNumber(values, 'sensitivityScore') * 0.2, 0, 100);

  return {
    headline: `${money(total)} total contractor trial cost`,
    metrics: [
      { label: 'Trial cost', value: money(contractorCost) },
      { label: 'Trial management cost', value: money(managementCost) },
      { label: 'Total experiment cost', value: money(total) },
      { label: 'Weekly cost', value: money(weekly) },
      { label: 'Trial-to-hire readiness', value: numberLabel(trialScore, '/100') },
      { label: 'Hours tested', value: numberLabel(trialHours, ' hrs') },
    ],
    flags: [
      trialScore >= 75 ? 'Good trial candidate: the work can be tested cleanly.' : trialScore >= 55 ? 'Needs clearer scope: improve deliverables or success criteria before the trial.' : trialScore >= 35 ? 'Poor trial candidate: the work is too vague or sensitive for a clean test.' : 'Hire may be premature: define the work before payroll or a trial.',
      toNumber(values, 'workRecurrenceScore') < 50 ? 'The work may not repeat enough to justify a permanent role yet.' : 'Work recurrence is strong enough to learn from a trial.',
      managementCost > contractorCost * 0.4 ? 'Owner management time is high. The trial may teach you that delegation is the bottleneck.' : 'Management cost is not overwhelming the trial.',
    ],
    notes: ['A contractor trial is an experiment to learn whether the work is recurring, clear, delegable, and valuable enough for continued help.'],
  };
}

function workDeletion(values: Values): Result {
  const hours = toNumber(values, 'hoursWeek');
  const timeRecovered = hours * 4.33;
  const costAvoided = timeRecovered * toNumber(values, 'ownerHourlyValue');
  const lowValue = 100 - (toNumber(values, 'customerValueScore') + toNumber(values, 'revenueImpactScore') + toNumber(values, 'usageFrequencyScore')) / 3;
  const deletionCandidate = clamp(lowValue * 0.45 + toNumber(values, 'duplicateProcessScore') * 0.25 + toNumber(values, 'oldHabitScore') * 0.2 - toNumber(values, 'riskIfStoppedScore') * 0.35, 0, 100);
  const risk = toNumber(values, 'riskIfStoppedScore');
  const recommendation = deletionCandidate >= 70 && risk < 45 ? 'delete' : deletionCandidate >= 55 ? 'reduce' : isChecked(values, 'canBatch') ? 'batch' : isChecked(values, 'canSimplify') ? 'simplify' : 'keep';

  return {
    headline: `${recommendation.charAt(0).toUpperCase()}${recommendation.slice(1)} this work`,
    metrics: [
      { label: 'Deletion candidate score', value: numberLabel(deletionCandidate, '/100') },
      { label: 'Time recovered', value: numberLabel(timeRecovered, ' hrs/mo') },
      { label: 'Cost avoided', value: money(costAvoided) },
      { label: 'Risk level', value: numberLabel(risk, '/100') },
      { label: 'Recommendation', value: recommendation },
    ],
    flags: [
      recommendation === 'delete' ? 'Low value, low risk, high time waste. Deleting may be better than hiring or automating.' : recommendation === 'reduce' ? 'Some value exists, but the work appears overdone.' : recommendation === 'batch' ? 'The work may be useful but too fragmented. Batch it before hiring.' : recommendation === 'simplify' ? 'Simplify before delegating or automating.' : 'Keep: the work appears too valuable or risky to remove casually.',
      toNumber(values, 'duplicateProcessScore') > 60 ? 'Duplicate workflow is a strong signal. Consolidate before adding people.' : 'Duplication is not the strongest signal.',
      risk >= 70 ? 'Stopping this work carries high risk. Review customer, compliance, financial, or control impact before changing it.' : 'Risk is not the main blocker to reducing this work.',
    ],
    notes: ['Owners often ask who can do this before asking whether it should still be done. Hiring or automating low-value work makes the business heavier.'],
  };
}

function hiringStressTest(values: Values): Result {
  const revenueAfterDrop = toNumber(values, 'currentMonthlyRevenue') * (1 - toNumber(values, 'revenueDropPct') / 100) - toNumber(values, 'clientLossRevenue');
  const delayHit = revenueAfterDrop * Math.min(0.6, toNumber(values, 'paymentDelayDays') / 120);
  const managerOverrun = toNumber(values, 'managerTimeOverrunHours') * toNumber(values, 'managerHourlyValue');
  const hireCost = toNumber(values, 'plannedHireMonthlyCost') + toNumber(values, 'benefitsOverrun') + managerOverrun;
  const stressedProfit = toNumber(values, 'currentProfit') - (toNumber(values, 'currentMonthlyRevenue') - revenueAfterDrop) - hireCost - delayHit;
  const reserveDuration = toNumber(values, 'payrollReserve') / Math.max(1, hireCost + Math.max(0, -stressedProfit));
  const revenueDropTolerance = toNumber(values, 'currentMonthlyRevenue') > 0
    ? Math.max(0, (toNumber(values, 'currentProfit') - hireCost) / toNumber(values, 'currentMonthlyRevenue'))
    : 0;
  const breakEvenAfterHire = toNumber(values, 'breakEvenMonthlyRevenue') + hireCost;

  return {
    headline: `${money(stressedProfit)} stressed monthly cash impact`,
    metrics: [
      { label: 'Cash impact after hire', value: money(stressedProfit) },
      { label: 'Break-even revenue after hire', value: money(breakEvenAfterHire) },
      { label: 'Payroll reserve duration', value: numberLabel(reserveDuration, ' mo') },
      { label: 'Revenue drop tolerance', value: pct(revenueDropTolerance * 100) },
      { label: 'Client-loss exposure', value: money(toNumber(values, 'clientLossRevenue')) },
      { label: 'Stressed revenue', value: money(revenueAfterDrop) },
    ],
    flags: [
      reserveDuration >= 6 ? 'Resilient: the business can absorb reasonable downside.' : reserveDuration >= 3 ? 'Sensitive: the hire works, but revenue drops hurt quickly.' : reserveDuration >= 1 ? 'Fragile: a small drop creates cash pressure.' : 'Unsafe: hiring now could threaten operating stability.',
      stressedProfit < 0 ? 'The stress case turns monthly profit negative after payroll starts.' : 'The stress case remains cash-positive.',
      breakEvenAfterHire > revenueAfterDrop ? 'Stress-case revenue is below break-even after the hire.' : 'Stress-case revenue remains above break-even after the hire.',
    ],
    notes: ['A hire can look affordable in a normal month and become painful in a bad month. Payroll is a commitment decision, not just a cost line.'],
  };
}

function revenueForecast(values: Values): Result {
  const current = toNumber(values, 'currentMonthlyRevenue');
  const recurring = toNumber(values, 'recurringRevenue');
  const committed = Math.max(toNumber(values, 'committedRevenue'), recurring);
  const qualifiedLeads = toNumber(values, 'newLeads') * (toNumber(values, 'qualifiedLeadPct') / 100);
  const newRevenue = qualifiedLeads * (toNumber(values, 'closeRatePct') / 100) * toNumber(values, 'averageDeal');
  const churn = current * toNumber(values, 'churnPct') / 100;
  const clientLoss = toNumber(values, 'largestClientRevenue');
  const baseForecast = current + newRevenue - churn;
  const conservativeForecast = Math.max(0, current + newRevenue * 0.65 - churn * 1.35 - clientLoss * 0.5);
  const aggressiveForecast = Math.max(0, current + newRevenue * 1.2 - churn * 0.75);
  const forecast = Math.max(0, baseForecast);
  const delay = toNumber(values, 'collectionDelayDays');
  const uncollected = forecast * toNumber(values, 'uncollectedPct') / 100;
  const delayedCash = Math.max(0, forecast * Math.max(0.15, 1 - delay / 90) - uncollected);
  const committedCoverage = forecast > 0 ? (committed / forecast) * 100 : 0;
  const cycle = toNumber(values, 'salesCycleWeeks');

  return {
    headline: `${money(forecast)} forecast monthly revenue`,
    metrics: [
      { label: 'Conservative / expected / aggressive', value: `${money(conservativeForecast)} / ${money(forecast)} / ${money(aggressiveForecast)}` },
      { label: 'Qualified pipeline revenue', value: money(newRevenue), note: `${numberLabel(qualifiedLeads)} qualified leads modeled.` },
      { label: 'Revenue lost to churn', value: money(churn) },
      { label: 'Collected-cash view', value: money(delayedCash), note: 'Adjusted for payment delay and uncollected revenue.' },
      { label: 'Committed coverage', value: pct(committedCoverage), note: 'Committed/booked revenue as share of the expected forecast.' },
      { label: 'Net growth', value: money(forecast - current) },
    ],
    flags: [
      newRevenue < churn ? 'New sales do not cover churn. Growth work may be masking a retention leak.' : 'New sales cover modeled churn.',
      delay >= 45 ? 'Collection delay is long enough to make revenue feel better than cash.' : 'Collection delay is not extreme in this scenario.',
      clientLoss > current * 0.25 ? 'Largest-client exposure is high enough to run a client-loss scenario before spending against this forecast.' : 'Largest-client exposure is visible but not dominant in this scenario.',
      cycle >= 8 ? 'Sales cycle timing may push closed revenue past the month you are planning for.' : 'Sales-cycle timing is not the main issue in this scenario.',
    ],
    notes: ['This forecast is a planning scenario, not a promise. Separate expected revenue, committed revenue, invoiced revenue, and collected cash before acting on it.'],
  };
}

function revenueFragility(values: Values): Result {
  const revenue = toNumber(values, 'currentMonthlyRevenue');
  const recurring = toNumber(values, 'recurringRevenue');
  const largest = toNumber(values, 'largestClientRevenue');
  const top3 = toNumber(values, 'top3ClientRevenue');
  const pipeline = toNumber(values, 'qualifiedLeads') * (toNumber(values, 'closeRatePct') / 100) * toNumber(values, 'averageDeal');
  const churn = revenue * toNumber(values, 'churnPct') / 100;
  const grossProfit = revenue * toNumber(values, 'grossMarginPct') / 100;
  const operatingCosts = toNumber(values, 'operatingCosts');
  const largestPct = revenue > 0 ? (largest / revenue) * 100 : 0;
  const top3Pct = revenue > 0 ? (top3 / revenue) * 100 : 0;
  const pipelineCoverage = revenue > 0 ? (pipeline / Math.max(1, churn + largest * 0.35)) * 100 : 0;
  const delay = toNumber(values, 'collectionDelayDays');
  const costPressurePct = grossProfit > 0 ? (operatingCosts / grossProfit) * 100 : 100;
  const penalty =
    clamp(largestPct - 15, 0, 35) * 0.8 +
    clamp(top3Pct - 45, 0, 45) * 0.45 +
    clamp(toNumber(values, 'churnPct') - 3, 0, 25) * 1.2 +
    clamp(60 - pipelineCoverage, 0, 60) * 0.45 +
    clamp(delay - 30, 0, 120) * 0.18 +
    clamp(costPressurePct - 70, 0, 80) * 0.35;
  const score = Math.round(clamp(100 - penalty, 0, 100));
  const state = score >= 85 ? 'Resilient' : score >= 70 ? 'Watchlist' : score >= 50 ? 'Fragile' : 'Exposed';
  const revenueAtRisk = largest + churn + Math.max(0, operatingCosts - grossProfit);

  return {
    headline: `${numberLabel(score, '/100')} revenue fragility score`,
    metrics: [
      { label: 'Forecast confidence state', value: state },
      { label: 'Largest-client dependency', value: pct(largestPct) },
      { label: 'Top-3 client dependency', value: pct(top3Pct) },
      { label: 'Pipeline coverage ratio', value: pct(pipelineCoverage), note: 'Qualified pipeline versus churn plus client-loss pressure.' },
      { label: 'Revenue at risk estimate', value: money(revenueAtRisk) },
    ],
    flags: [
      largestPct >= 30 ? 'One client is large enough to distort confidence.' : 'Largest-client dependency is not the dominant issue.',
      pipelineCoverage < 75 ? 'Pipeline coverage is thin relative to the revenue at risk.' : 'Pipeline coverage has some support under these inputs.',
      costPressurePct >= 90 ? 'Operating costs leave little room for revenue volatility.' : 'Cost pressure is not extreme under these inputs.',
    ],
    notes: ['The useful question is not whether the plan can happen. It is which assumption breaks the plan first.'],
  };
}

function salesTarget(values: Values): Result {
  const goal = toNumber(values, 'revenueGoal');
  const current = Math.max(toNumber(values, 'currentRevenue'), toNumber(values, 'existingRecurringRevenue'));
  const gap = Math.max(0, goal - current);
  const deals = gap / Math.max(1, toNumber(values, 'averageDeal'));
  const proposals = deals / Math.max(0.01, toNumber(values, 'proposalClosePct') / 100);
  const calls = proposals / Math.max(0.01, toNumber(values, 'callToProposalPct') / 100);
  const leadToCallPct = toNumber(values, 'leadToCallPct') || toNumber(values, 'leadToProposalPct') || 1;
  const leads = calls / Math.max(0.01, leadToCallPct / 100);
  const cycle = toNumber(values, 'salesCycleWeeks');
  const callCapacity = toNumber(values, 'ownerCallsPerWeek') * 4;
  const capacityDeals = toNumber(values, 'deliveryCapacityDeals');

  return {
    headline: `${numberLabel(leads)} leads needed for the revenue gap`,
    metrics: [
      { label: 'Revenue gap', value: money(gap) },
      { label: 'Deals needed', value: numberLabel(deals) },
      { label: 'Calls needed', value: numberLabel(calls) },
      { label: 'Proposals needed', value: numberLabel(proposals) },
      { label: 'Sales cycle', value: numberLabel(cycle, ' weeks') },
      { label: 'Delivery capacity gap', value: numberLabel(Math.max(0, deals - capacityDeals), ' deals') },
    ],
    flags: [
      leads > 100 ? 'Lead requirement is high. Improve deal size, close rate, retention, or timeline before demanding more activity.' : 'Lead requirement is not obviously impossible if the channel exists.',
      cycle > 6 ? 'Sales cycle is long. Revenue may arrive later than the monthly goal implies.' : 'Sales cycle is short enough to adjust within a quarter.',
      calls > callCapacity ? 'Required calls exceed modeled sales capacity. The target may be a capacity problem, not a motivation problem.' : 'Sales call capacity appears able to support the target.',
      deals > capacityDeals ? 'Delivery capacity is lower than the deal count needed.' : 'Delivery capacity does not block the modeled deal count.',
    ],
    notes: ['More leads is not the answer if proposal rate, close rate, deal size, or sales-cycle timing is the bottleneck.'],
  };
}

function salesPipelineReality(values: Values): Result {
  const pipeline = toNumber(values, 'pipelineValue');
  const target = toNumber(values, 'revenueTarget');
  const weighted = pipeline * toNumber(values, 'closeProbabilityPct') / 100;
  const qualityFactor =
    (toNumber(values, 'qualifiedDealPct') +
      toNumber(values, 'decisionMakerPct') +
      toNumber(values, 'budgetConfirmedPct') +
      toNumber(values, 'nextStepPct') +
      (100 - toNumber(values, 'staleDealPct'))) /
    500;
  const realistic = weighted * clamp(qualityFactor, 0, 1);
  const score = Math.round(clamp(qualityFactor * 100 - clamp(toNumber(values, 'salesCycleDays') - 60, 0, 180) * 0.12 - clamp(toNumber(values, 'paymentDelayDays') - 30, 0, 150) * 0.08, 0, 100));
  const coverage = target > 0 ? (realistic / target) * 100 : 0;
  const state = score >= 85 && coverage >= 100 ? 'Strong pipeline' : score >= 70 ? 'Soft pipeline' : score >= 50 ? 'Thin pipeline' : 'Fantasy pipeline';

  return {
    headline: `${money(realistic)} realistic pipeline value`,
    metrics: [
      { label: 'Pipeline quality score', value: numberLabel(score, '/100') },
      { label: 'Weighted pipeline value', value: money(weighted) },
      { label: 'Target coverage', value: pct(coverage) },
      { label: 'Pipeline state', value: state },
      { label: 'Timing to cash', value: numberLabel(toNumber(values, 'salesCycleDays') + toNumber(values, 'paymentDelayDays'), ' days') },
    ],
    flags: [
      toNumber(values, 'nextStepPct') < 60 ? 'Too many deals lack a scheduled next step.' : 'Most deals have a next step scheduled.',
      toNumber(values, 'staleDealPct') > 25 ? 'Stale deals may be inflating the forecast.' : 'Stale-deal share is not dominant.',
      coverage < 100 ? 'Realistic pipeline does not cover the target yet.' : 'Realistic pipeline covers the target under these assumptions.',
    ],
    notes: ['A deal with no next step is not pipeline. It is hope with a company name attached.'],
  };
}

function clientConcentrationRisk(values: Values): Result {
  const revenue = toNumber(values, 'totalMonthlyRevenue');
  const largest = toNumber(values, 'largestClientRevenue');
  const top3 = toNumber(values, 'top3ClientRevenue');
  const top5 = toNumber(values, 'top5ClientRevenue');
  const grossMargin = toNumber(values, 'grossMarginPct') / 100;
  const largestPct = revenue > 0 ? (largest / revenue) * 100 : 0;
  const top3Pct = revenue > 0 ? (top3 / revenue) * 100 : 0;
  const top5Pct = revenue > 0 ? (top5 / revenue) * 100 : 0;
  const profitAtRisk = largest * grossMargin;
  const replacementMonths = toNumber(values, 'replacementMonths');
  const replacementTarget = replacementMonths > 0 ? largest / replacementMonths : largest;
  const state = largestPct >= 45 ? 'Exposed' : largestPct >= 30 || top3Pct >= 60 ? 'Concentrated' : largestPct >= 20 || top3Pct >= 45 ? 'Watchlist' : 'Diversified';

  return {
    headline: `${pct(largestPct)} of revenue from the largest client`,
    metrics: [
      { label: 'Concentration state', value: state },
      { label: 'Top-3 concentration', value: pct(top3Pct) },
      { label: 'Top-5 concentration', value: pct(top5Pct) },
      { label: 'Profit at risk', value: money(profitAtRisk) },
      { label: 'Replacement sales target', value: money(replacementTarget), note: 'Monthly new revenue needed over replacement window.' },
    ],
    flags: [
      largestPct >= 30 ? 'One client leaving would materially damage revenue.' : 'No single client dominates under these inputs.',
      replacementMonths >= 4 ? 'Replacement time is long enough to affect cash and hiring decisions.' : 'Replacement time is short in this scenario.',
      toNumber(values, 'ownerTimeHoursMonthly') >= 30 ? 'The largest client also consumes significant owner time.' : 'Owner-time dependency is not extreme.',
    ],
    notes: ['A great client can still be a concentration risk. Treat the relationship as valuable and visible before hiring or spending against it.'],
  };
}

function cashRunway(values: Values): Result {
  const cash = toNumber(values, 'cashBalance');
  const outflows =
    toNumber(values, 'monthlyOperatingCosts') +
    toNumber(values, 'ownerPay') +
    toNumber(values, 'payroll') +
    toNumber(values, 'contractors') +
    toNumber(values, 'taxReserve') +
    toNumber(values, 'debtPayments');
  const collected = toNumber(values, 'expectedCollectedCash');
  const burn = Math.max(0, outflows - collected);
  const runway = burn > 0 ? cash / burn : Infinity;
  const stressCollected = Math.max(0, collected * (1 - toNumber(values, 'revenueDropPct') / 100) - toNumber(values, 'clientLossRevenue'));
  const stressBurn = Math.max(0, outflows + toNumber(values, 'emergencyExpenses') - stressCollected);
  const stressRunway = stressBurn > 0 ? cash / stressBurn : Infinity;
  const minimumCash = outflows * 3;
  const state = stressRunway >= 6 ? 'Comfortable' : stressRunway >= 3 ? 'Watchlist' : stressRunway >= 1.5 ? 'Tight' : 'Critical';

  return {
    headline: `${Number.isFinite(stressRunway) ? numberLabel(stressRunway, ' months') : '12+ months'} stress-case runway`,
    metrics: [
      { label: 'Current monthly burn', value: money(burn) },
      { label: 'Base-case runway', value: Number.isFinite(runway) ? numberLabel(runway, ' months') : '12+ months' },
      { label: 'Stress-case monthly burn', value: money(stressBurn) },
      { label: 'Minimum 3-month cash target', value: money(minimumCash) },
      { label: 'Runway state', value: state },
    ],
    flags: [
      stressRunway < 3 ? 'A bad month could force difficult decisions.' : 'Stress-case runway is not immediately critical.',
      toNumber(values, 'payroll') > 0 && stressRunway < 4 ? 'Payroll makes the cash runway decision more sensitive.' : 'Payroll pressure is not the main risk in this scenario.',
      cash < minimumCash ? 'Cash is below the modeled three-month outflow target.' : 'Cash clears the modeled three-month outflow target.',
    ],
    notes: ['Revenue promised next month does not pay this month. Runway should use collected cash, not optimistic booked revenue.'],
  };
}

function paymentDelayImpact(values: Values): Result {
  const invoiceVolume = toNumber(values, 'invoiceAmount') * toNumber(values, 'invoicesPerMonth');
  const delayedGross = invoiceVolume * toNumber(values, 'lateInvoicePct') / 100;
  const delayedCash = delayedGross * (1 - toNumber(values, 'depositPct') / 100);
  const workingCapitalNeed = delayedCash * ((toNumber(values, 'paymentTermsDays') + toNumber(values, 'averageDaysLate')) / 30);
  const monthlyObligations = toNumber(values, 'operatingCosts') + toNumber(values, 'payroll') + toNumber(values, 'taxReserve');
  const obligationCoverage = monthlyObligations > 0 ? (workingCapitalNeed / monthlyObligations) * 100 : 0;
  const monthlyFloatCost = workingCapitalNeed * (toNumber(values, 'debtCostPct') / 100) / 12;
  const state = obligationCoverage >= 75 ? 'Dangerous' : obligationCoverage >= 35 ? 'Cash strain' : obligationCoverage >= 15 ? 'Annoying but workable' : 'Low impact';

  return {
    headline: `${money(workingCapitalNeed)} working-capital pressure`,
    metrics: [
      { label: 'Delayed cash amount', value: money(delayedCash) },
      { label: 'Monthly invoice volume', value: money(invoiceVolume) },
      { label: 'Obligation coverage at risk', value: pct(obligationCoverage) },
      { label: 'Estimated monthly float cost', value: money(monthlyFloatCost) },
      { label: 'Payment-delay state', value: state },
    ],
    flags: [
      obligationCoverage >= 35 ? 'Late payments materially affect operating commitments.' : 'Late payments create friction but not severe pressure under these inputs.',
      toNumber(values, 'depositPct') < 25 ? 'A stronger deposit could reduce the cash gap before delivery.' : 'Deposit protection reduces some delayed-cash exposure.',
      toNumber(values, 'averageDaysLate') >= 30 ? 'Clients paying 30+ days late can turn profitable work into a cash problem.' : 'Late-payment timing is moderate in this scenario.',
    ],
    notes: ['Late payment is customer-financed cash-flow risk. Shorter terms, deposits, reminders, and concentration control can matter as much as more revenue.'],
  };
}

function churn(values: Values): Result {
  const current = toNumber(values, 'currentRevenue');
  const voluntaryLost = current * toNumber(values, 'churnPct') / 100;
  const paymentFailureLost = current * toNumber(values, 'paymentFailurePct') / 100;
  const lost = voluntaryLost + paymentFailureLost + toNumber(values, 'contractionRevenue');
  const expansion = current * toNumber(values, 'expansionPct') / 100;
  const newRevenue = toNumber(values, 'newRevenue');
  const recovered = lost * toNumber(values, 'saveRatePct') / 100;
  const net = current - lost + recovered + expansion + newRevenue;
  const customersLost = lost / Math.max(1, toNumber(values, 'averageCustomerRevenue'));
  const nrr = current > 0 ? ((current - lost + recovered + expansion) / current) * 100 : 0;
  const replacementNeeded = Math.max(0, lost - expansion - recovered);

  return {
    headline: `${money(lost)} monthly revenue leak`,
    metrics: [
      { label: 'Customers / accounts to replace', value: numberLabel(customersLost) },
      { label: 'Expansion offset', value: money(expansion) },
      { label: 'Replacement revenue needed', value: money(replacementNeeded) },
      { label: 'Net revenue retention estimate', value: pct(nrr) },
      { label: 'New revenue after churn', value: money(net) },
      { label: 'Net revenue change', value: money(net - current) },
    ],
    flags: [
      lost > newRevenue ? 'Churn is larger than new recurring revenue. Retention may beat more acquisition.' : 'New recurring revenue covers churn in this scenario.',
      toNumber(values, 'churnPct') > 8 ? 'Monthly churn is high for many recurring models. Segment who is leaving and why.' : 'Churn is not extreme in this scenario.',
      replacementNeeded > newRevenue ? 'New sales are mostly replacing revenue already lost.' : 'New sales create some growth after replacement.',
    ],
    notes: ['Churn is often a trust, fit, onboarding, or outcome problem before it is a pricing problem.'],
  };
}

function churnReplacement(values: Values): Result {
  const current = toNumber(values, 'currentRecurringRevenue');
  const churnLoss = current * toNumber(values, 'churnPct') / 100;
  const paymentFailure = current * toNumber(values, 'paymentFailurePct') / 100;
  const grossLost = churnLoss + paymentFailure + toNumber(values, 'contractionRevenue');
  const recovered = grossLost * toNumber(values, 'winBackPct') / 100;
  const expansion = toNumber(values, 'expansionRevenue');
  const netLost = Math.max(0, grossLost - recovered - expansion);
  const dealsNeeded = netLost / Math.max(1, toNumber(values, 'averageNewDealSize'));
  const leadsNeeded = dealsNeeded / Math.max(0.01, toNumber(values, 'closeRatePct') / 100);
  const burdenPct = current > 0 ? (netLost / current) * 100 : 0;
  const state = burdenPct >= 12 ? 'Retention problem' : burdenPct >= 7 ? 'Replacement-heavy' : burdenPct >= 3 ? 'Watchlist' : 'Low replacement burden';

  return {
    headline: `${money(netLost)} net replacement revenue needed`,
    metrics: [
      { label: 'Gross lost revenue', value: money(grossLost) },
      { label: 'Recovered or expansion offset', value: money(recovered + expansion) },
      { label: 'Replacement deals needed', value: numberLabel(dealsNeeded) },
      { label: 'Leads needed to replace churn', value: numberLabel(leadsNeeded) },
      { label: 'Replacement burden', value: pct(burdenPct) },
    ],
    flags: [
      state === 'Retention problem' ? 'Growth is unlikely until churn improves.' : `Replacement state: ${state}.`,
      dealsNeeded > 0 ? 'The first new sales replace what churn already took.' : 'Expansion and recovery cover the modeled churn.',
    ],
    notes: ['Every dollar of replacement revenue is a dollar the business had to earn again before growth begins.'],
  };
}

function subscriptionPricing(values: Values): Result {
  const subscribers = toNumber(values, 'subscribers');
  const monthlyPrice = toNumber(values, 'monthlyPrice');
  const mrr = subscribers * monthlyPrice;
  const annualPrice = monthlyPrice * 12 * (1 - toNumber(values, 'annualDiscountPct') / 100);
  const paymentFees = mrr * toNumber(values, 'paymentFeePct') / 100;
  const supportCost = subscribers * toNumber(values, 'supportCostPerCustomer');
  const grossProfit = mrr * toNumber(values, 'grossMarginPct') / 100 - supportCost - paymentFees;
  const churned = subscribers * ((toNumber(values, 'churnPct') + toNumber(values, 'paymentFailurePct')) / 100);
  const cac = toNumber(values, 'acquisitionCost');
  const paybackMonths = grossProfit > 0 && subscribers > 0 ? cac / (grossProfit / subscribers) : Infinity;
  const contributionPerSubscriber = subscribers > 0 ? grossProfit / subscribers : 0;
  const breakEvenSubscribers = contributionPerSubscriber > 0 ? toNumber(values, 'fixedCosts') / contributionPerSubscriber : Infinity;
  const ltv = toNumber(values, 'churnPct') > 0 ? contributionPerSubscriber / (toNumber(values, 'churnPct') / 100) : contributionPerSubscriber * 24;

  return {
    headline: `${money(mrr)} monthly recurring revenue`,
    metrics: [
      { label: 'Annual plan price', value: money(annualPrice) },
      { label: 'Monthly contribution after support/fees', value: money(grossProfit) },
      { label: 'Contribution per subscriber', value: money(contributionPerSubscriber) },
      { label: 'Subscribers lost/month', value: numberLabel(churned) },
      { label: 'CAC payback', value: Number.isFinite(paybackMonths) ? numberLabel(paybackMonths, ' months') : 'n/a' },
      { label: 'Break-even subscribers', value: Number.isFinite(breakEvenSubscribers) ? numberLabel(breakEvenSubscribers) : 'n/a' },
      { label: 'Customer lifetime value estimate', value: money(ltv) },
    ],
    flags: [
      paybackMonths > 12 ? 'Acquisition payback is slow under these assumptions.' : 'Acquisition payback is within a range many operators would inspect.',
      toNumber(values, 'annualDiscountPct') > 20 ? 'Large annual discounts improve cash now but reduce price flexibility later.' : 'Annual discount is moderate.',
      supportCost > mrr * 0.2 ? 'Support cost is high enough that recurring revenue may be recurring labor.' : 'Support cost is not dominating the model.',
    ],
    notes: ['Subscription pricing has to survive churn, support, acquisition cost, and gross margin, not just monthly appeal.'],
  };
}

function retainerStability(values: Values): Result {
  const monthly = toNumber(values, 'retainerAmount') * toNumber(values, 'numberOfRetainers');
  const largestPct = monthly > 0 ? (toNumber(values, 'largestRetainerRevenue') / monthly) * 100 : 0;
  const overServiceCost = toNumber(values, 'overServicingHours') * toNumber(values, 'hourlyValue');
  const utilizationRisk = clamp(toNumber(values, 'utilizationPct') - 85, 0, 100) + clamp(55 - toNumber(values, 'utilizationPct'), 0, 55) * 0.4;
  const penalty =
    clamp(largestPct - 20, 0, 60) * 0.45 +
    toNumber(values, 'renewalRiskPct') * 0.35 +
    utilizationRisk * 0.35 +
    clamp(75 - toNumber(values, 'scopeClarityPct'), 0, 75) * 0.35 +
    clamp(toNumber(values, 'paymentDelayDays') - 30, 0, 120) * 0.15 +
    clamp(toNumber(values, 'replacementMonths') - 2, 0, 20) * 1.5;
  const score = Math.round(clamp(100 - penalty, 0, 100));
  const state = score >= 85 ? 'Stable' : score >= 70 ? 'Watchlist' : score >= 50 ? 'Fragile' : 'Mispriced';

  return {
    headline: `${numberLabel(score, '/100')} retainer stability score`,
    metrics: [
      { label: 'Monthly retainer revenue', value: money(monthly) },
      { label: 'Largest-retainer concentration', value: pct(largestPct) },
      { label: 'Over-servicing cost', value: money(overServiceCost) },
      { label: 'Renewal-risk revenue', value: money(monthly * toNumber(values, 'renewalRiskPct') / 100) },
      { label: 'Stability state', value: state },
    ],
    flags: [
      largestPct >= 30 ? 'One retainer dominates the recurring base.' : 'Retainer concentration is not extreme.',
      toNumber(values, 'scopeClarityPct') < 70 ? 'Scope clarity is weak enough to create unpaid availability.' : 'Scope clarity is workable.',
      overServiceCost > monthly * 0.15 ? 'Over-servicing is eating a meaningful share of retainer value.' : 'Over-servicing is visible but not dominant.',
    ],
    notes: ['A retainer that sells unlimited availability is recurring exposure, not stable recurring revenue.'],
  };
}

function expansionVsNewSales(values: Values): Result {
  const current = toNumber(values, 'currentRevenue');
  const expansionPotential = current * toNumber(values, 'expansionOpportunityPct') / 100 * toNumber(values, 'upgradeRatePct') / 100;
  const priceIncreaseRevenue = current * toNumber(values, 'priceIncreasePct') / 100;
  const winBack = toNumber(values, 'winBackRevenue');
  const churnLoss = current * toNumber(values, 'churnPct') / 100;
  const expansionCost = (expansionPotential + priceIncreaseRevenue + winBack) * toNumber(values, 'expansionCostPct') / 100;
  const netExpansion = Math.max(0, expansionPotential + priceIncreaseRevenue + winBack - expansionCost - churnLoss);
  const newSales = toNumber(values, 'newCustomerRevenue');
  const netNewSales = Math.max(0, newSales - toNumber(values, 'newCustomerCac'));
  const best = netExpansion >= netNewSales ? 'Expansion opportunity' : 'New sales driven';
  const state = churnLoss > expansionPotential + priceIncreaseRevenue ? 'Retention first' : priceIncreaseRevenue > expansionPotential && priceIncreaseRevenue > newSales * 0.5 ? 'Pricing opportunity' : best;

  return {
    headline: `${state} looks like the stronger lever`,
    metrics: [
      { label: 'Net expansion / pricing value', value: money(netExpansion) },
      { label: 'Net new-sales value', value: money(netNewSales) },
      { label: 'Churn to replace first', value: money(churnLoss) },
      { label: 'Expansion cost', value: money(expansionCost) },
      { label: 'Win-back revenue', value: money(winBack) },
    ],
    flags: [
      state === 'Retention first' ? 'Churn must improve before expansion or new sales will feel like growth.' : `Best modeled growth lever: ${state}.`,
      netExpansion > netNewSales ? 'Existing customers may be a cheaper growth path than new logos.' : 'Acquisition appears stronger after entered costs.',
    ],
    notes: ['Sometimes the next revenue lever is retention, expansion, packaging, or price, not another lead source.'],
  };
}

function operatingLeverage(values: Values): Result {
  const revenue = toNumber(values, 'revenue');
  const fixed = toNumber(values, 'fixedCosts');
  const variable = revenue * toNumber(values, 'variableCostPct') / 100;
  const profit = revenue - fixed - variable;
  const nextRevenue = revenue * (1 + toNumber(values, 'revenueGrowthPct') / 100);
  const nextFixed = fixed * (1 + toNumber(values, 'fixedCostGrowthPct') / 100) + toNumber(values, 'requiredHireCost');
  const nextVariable = nextRevenue * toNumber(values, 'variableCostPct') / 100;
  const nextProfitBeforeInvestment = nextRevenue - nextFixed - nextVariable;
  const nextProfit = nextProfitBeforeInvestment - toNumber(values, 'growthInvestment');
  const profitChange = nextProfit - profit;
  const revenueChange = nextRevenue - revenue;
  const leverageEffect = revenueChange !== 0 ? profitChange / revenueChange : 0;
  const capacity = toNumber(values, 'capacityUtilizationPct');

  return {
    headline: `${money(profitChange)} projected profit change`,
    metrics: [
      { label: 'Current monthly profit', value: money(profit) },
      { label: 'Scenario monthly profit', value: money(nextProfit) },
      { label: 'Scenario profit before upfront investment', value: money(nextProfitBeforeInvestment) },
      { label: 'Current fixed cost share', value: pct((fixed / Math.max(1, revenue)) * 100) },
      { label: 'Scenario revenue', value: money(nextRevenue) },
      { label: 'Operating leverage effect', value: Number.isFinite(leverageEffect) ? numberLabel(leverageEffect, 'x') : 'n/a' },
    ],
    flags: [
      nextProfit <= profit ? 'Growth is not improving profit under these assumptions. Fixed or variable costs are rising too fast.' : 'Growth improves profit under these assumptions.',
      fixed / Math.max(1, revenue) > 0.5 ? 'Fixed costs are heavy. Revenue dips can hurt fast.' : 'Fixed cost share is not extreme in this scenario.',
      capacity >= 85 ? 'Capacity is tight. Growth may require people or tools before profit improves.' : 'Capacity does not appear maxed out yet.',
      toNumber(values, 'growthInvestment') > Math.max(0, profitChange) ? 'Upfront growth investment consumes the modeled profit gain.' : 'Profit gain clears the upfront growth investment in this scenario.',
    ],
    notes: ['Fixed costs can create leverage after revenue arrives. Before revenue arrives, fixed costs create pressure.'],
  };
}

function saasCost(values: Values): Result {
  const base = toNumber(values, 'baseToolsMonthly');
  const seats = toNumber(values, 'seats');
  const seatSpend = seats * toNumber(values, 'pricePerSeat');
  const duplicate = toNumber(values, 'duplicateToolsMonthly');
  const usage = toNumber(values, 'usageBasedMonthly');
  const support = toNumber(values, 'supportTierMonthly');
  const monthly = base + seatSpend + duplicate + usage + support;
  const unused = seatSpend * toNumber(values, 'unusedSeatPct') / 100;
  const nextYear = monthly * 12 * (1 + toNumber(values, 'priceIncreasePct') / 100);
  const ownerless = monthly * toNumber(values, 'ownerlessToolPct') / 100;
  const annualLock = monthly * 12 * toNumber(values, 'annualContractPct') / 100;
  const renewalWindow = toNumber(values, 'renewalWindowMonths');

  return {
    headline: `${money(monthly)} monthly software stack`,
    metrics: [
      { label: 'Annual software spend', value: money(monthly * 12) },
      { label: 'Unused seat exposure', value: money(unused) },
      { label: 'Duplicate tool exposure', value: money(duplicate) },
      { label: 'Usage/support exposure', value: money(usage + support) },
      { label: 'Ownerless spend estimate', value: money(ownerless) },
      { label: 'Annual contract exposure', value: money(annualLock) },
      { label: 'Next-year price increase case', value: money(nextYear) },
    ],
    flags: [
      unused > 500 ? 'Unused seats are large enough to audit before renewal.' : 'Unused seat exposure is modest in this scenario.',
      duplicate > 0 ? 'Duplicate tool spend is visible. Decide which workflow owns the job.' : 'No duplicate-tool spend modeled.',
      ownerless > monthly * 0.15 ? 'Ownerless software spend is a governance problem before it is a procurement problem.' : 'Most spend appears to have some ownership signal.',
      renewalWindow <= 3 ? 'A renewal decision window is close. Review usage before auto-renewal, not after.' : 'Renewal timing is not immediately urgent in this scenario.',
    ],
    notes: ['The first cleanup pass is usually seats, duplicate tools, annual renewals, and tools nobody owns. Do not assume every seat can be cancelled mid-term.'],
  };
}

function seatCost(values: Values): Result {
  const seats = toNumber(values, 'seats');
  const active = toNumber(values, 'activeSeats');
  const price = toNumber(values, 'pricePerSeat');
  const inactiveSeats = Math.max(0, seats - active);
  const minimumSeats = toNumber(values, 'minimumSeats');
  const removableSeats = Math.max(0, seats - Math.max(active, minimumSeats));
  const monthly = seats * price;
  const inactiveCost = inactiveSeats * price;
  const removableCost = removableSeats * price;
  const overPermissionCost = toNumber(values, 'overPermissionedSeats') * price * 0.35;
  const contractorCost = toNumber(values, 'contractorSeats') * price;
  const annualLocked = monthly * 12 * toNumber(values, 'annualContractPct') / 100;
  const utilization = seats > 0 ? (active / seats) * 100 : 0;

  return {
    headline: `${pct(utilization)} seat utilization`,
    metrics: [
      { label: 'Monthly seat cost', value: money(monthly) },
      { label: 'Inactive-seat exposure', value: money(inactiveCost) },
      { label: 'Potentially removable seats', value: `${numberLabel(removableSeats)} seats`, note: money(removableCost) },
      { label: 'Contractor-seat exposure', value: money(contractorCost) },
      { label: 'Over-permission estimate', value: money(overPermissionCost) },
      { label: 'Annual locked exposure', value: money(annualLocked) },
    ],
    flags: [
      utilization < 70 ? 'Seat utilization is low enough to review before renewal.' : 'Seat utilization is not obviously weak from these inputs.',
      removableSeats < inactiveSeats ? 'Some inactive seats may be blocked by minimum-seat or contract assumptions.' : 'Most inactive seats look removable if the contract allows it.',
      toStringValue(values, 'contractRisk') === 'high' ? 'True-down limits may stop savings from showing up immediately.' : 'Contract flexibility is not modeled as the main blocker.',
    ],
    notes: ['The seat is inactive, but the cost is active. Review access before renewal and confirm true-up, true-down, and cancellation terms.'],
  };
}

function cloudCost(values: Values): Result {
  const compute = toNumber(values, 'computeMonthly');
  const storage = toNumber(values, 'storageMonthly');
  const transfer = toNumber(values, 'dataTransferMonthly');
  const database = toNumber(values, 'databaseMonthly');
  const logging = toNumber(values, 'loggingMonthly');
  const aiApi = toNumber(values, 'aiApiMonthly');
  const support = toNumber(values, 'supportMonthly');
  const base = compute + storage + transfer + database + logging + aiApi + support;
  const envFactor = Math.max(1, toNumber(values, 'environments')) / 3;
  const grown = base * envFactor * (1 + toNumber(values, 'growthPct') / 100);
  const withOverrun = grown * (1 + toNumber(values, 'overrunPct') / 100);
  const committedCoverage = withOverrun * toNumber(values, 'committedCoveragePct') / 100;
  const costPerCustomer = withOverrun / Math.max(1, toNumber(values, 'customers'));
  const marginAfterCloud = toNumber(values, 'grossMarginPct') - (withOverrun / Math.max(1, withOverrun + toNumber(values, 'customers') * 100)) * 100;

  return {
    headline: `${money(withOverrun)} monthly cloud stress case`,
    metrics: [
      { label: 'Current monthly baseline', value: money(base) },
      { label: 'Environment-adjusted scenario', value: money(grown) },
      { label: 'Annual stress case', value: money(withOverrun * 12) },
      { label: 'Overrun buffer', value: money(withOverrun - grown) },
      { label: 'Cost per customer', value: money(costPerCustomer) },
      { label: 'Spend covered by commitments', value: money(committedCoverage) },
      { label: 'Rough margin after cloud pressure', value: pct(marginAfterCloud) },
    ],
    flags: [
      transfer > base * 0.2 ? 'Data transfer is a meaningful part of the bill. Track egress and CDN behavior.' : 'Data transfer is not dominating the bill in this scenario.',
      toNumber(values, 'environments') > 3 ? 'Multiple environments can quietly multiply cost. Audit idle dev/staging workloads.' : 'Environment count is moderate.',
      logging + aiApi > base * 0.2 ? 'Logging, monitoring, or AI/API usage is material enough to track separately.' : 'Logging and AI/API usage are not dominating the baseline.',
    ],
    notes: ['Provider calculators help, but this page is meant to expose growth, environments, region, data-transfer, commitment, and overrun pressure.'],
  };
}

function softwareSpendHealth(values: Values): Result {
  const base = toNumber(values, 'baseToolsMonthly');
  const seatSpend = toNumber(values, 'seats') * toNumber(values, 'pricePerSeat');
  const duplicate = toNumber(values, 'duplicateToolsMonthly');
  const usage = toNumber(values, 'usageBasedMonthly');
  const support = toNumber(values, 'supportTierMonthly');
  const monthly = base + seatSpend + duplicate + usage + support;
  const unused = seatSpend * toNumber(values, 'unusedSeatPct') / 100;
  const ownerlessPct = toNumber(values, 'ownerlessToolPct');
  const duplicatePenalty = monthly > 0 ? (duplicate / monthly) * 100 : 0;
  const renewalPenalty = toNumber(values, 'renewalWindowMonths') <= 3 ? 10 : 0;
  const contractPenalty = toStringValue(values, 'contractRisk') === 'high' ? 12 : toStringValue(values, 'contractRisk') === 'medium' ? 5 : 0;
  const score = clamp(
    100 -
      toNumber(values, 'unusedSeatPct') * 0.35 -
      ownerlessPct * 0.35 -
      duplicatePenalty * 0.7 -
      Math.max(0, 70 - toNumber(values, 'adoptionPct')) * 0.4 -
      Math.max(0, toNumber(values, 'duplicateCategories') - 2) * 4 -
      renewalPenalty -
      contractPenalty,
    0,
    100,
  );
  const unusedAndOverlap = unused + duplicate;

  return {
    headline: `${numberLabel(score, '/100')} software spend health`,
    metrics: [
      { label: 'Monthly stack cost', value: money(monthly) },
      { label: 'Annual stack cost', value: money(monthly * 12) },
      { label: 'Unused + overlap waste', value: money(unusedAndOverlap) },
      { label: 'Ownerless spend share', value: pct(ownerlessPct) },
      { label: 'Duplicate categories', value: numberLabel(toNumber(values, 'duplicateCategories')) },
      { label: 'Average adoption', value: pct(toNumber(values, 'adoptionPct')) },
    ],
    flags: [
      score >= 85 ? 'Healthy stack: tools are owned, used, and tied to real workflows.' : score >= 70 ? 'Watchlist: renewal or usage cleanup should happen before buying more tools.' : score >= 50 ? 'Leaky stack: waste, overlap, or weak ownership is likely.' : 'Stack sprawl: software may be creating overhead without clear value.',
      ownerlessPct > 20 ? 'Ownerless tools are a priority. Assign renewal, budget, data, and workflow owners.' : 'Ownership is not the biggest modeled weakness.',
      unusedAndOverlap > monthly * 0.2 ? 'Unused seats and duplicate tools are large enough to audit now.' : 'Waste is present but not dominating the stack.',
    ],
    notes: ['A stack cleanup should produce owner assignments, renewal dates, cancellation windows, and keep/cut/consolidate decisions.'],
  };
}

function saasRenewalRisk(values: Values): Result {
  const monthly = toNumber(values, 'monthlyCost');
  const annual = monthly * 12;
  const monthsUntilRenewal = toNumber(values, 'renewalWindowMonths');
  const noticeDays = toNumber(values, 'cancellationNoticeDays');
  const active = toNumber(values, 'activeSeats');
  const seats = toNumber(values, 'seats');
  const unusedPct = seats > 0 ? Math.max(0, (seats - active) / seats) * 100 : 0;
  const owner = toStringValue(values, 'ownerAssigned');
  const increase = annual * toNumber(values, 'priceIncreasePct') / 100;
  const switchingCost = toNumber(values, 'switchingEffortHours') * 95;
  const riskScore = clamp(
    (monthsUntilRenewal <= 1 ? 35 : monthsUntilRenewal <= 3 ? 22 : 8) +
      (noticeDays >= 60 ? 15 : 5) +
      unusedPct * 0.35 +
      toNumber(values, 'priceIncreasePct') * 0.5 +
      toNumber(values, 'duplicateAlternatives') * 6 +
      (owner === 'no' ? 18 : owner === 'partial' ? 8 : 0),
    0,
    100,
  );

  return {
    headline: `${numberLabel(riskScore, '/100')} renewal risk`,
    metrics: [
      { label: 'Annual exposure', value: money(annual) },
      { label: 'Modeled renewal increase', value: money(increase) },
      { label: 'Unused-seat share', value: pct(unusedPct) },
      { label: 'Action window', value: `${numberLabel(monthsUntilRenewal)} months`, note: `${numberLabel(noticeDays)} days notice` },
      { label: 'Switching effort value', value: money(switchingCost) },
    ],
    flags: [
      riskScore >= 75 ? 'Urgent: cancellation or negotiation window may close soon.' : riskScore >= 55 ? 'High risk: cost, usage, or ownership is unclear before renewal.' : riskScore >= 35 ? 'Review soon: decision window is approaching.' : 'Low risk: tool is owned and renewal is understood.',
      owner === 'no' ? 'No renewal owner is assigned. Assign one before the vendor owns the timeline.' : 'There is at least some owner signal.',
      unusedPct > 20 ? 'Seat cleanup should happen before renewal negotiations.' : 'Unused seats are not the main renewal issue.',
    ],
    notes: ['The expensive moment is often the missed renewal window, not the month someone notices the invoice.'],
  };
}

function duplicateToolAudit(values: Values): Result {
  const overlap = toNumber(values, 'duplicateToolsMonthly');
  const duplicateSeatCost = toNumber(values, 'seats') * toNumber(values, 'pricePerSeat');
  const annualOverlap = (overlap + duplicateSeatCost) * 12;
  const consolidationLabor = toNumber(values, 'switchingEffortHours') * toNumber(values, 'hourlyValue');
  const netFirstYearOpportunity = annualOverlap - consolidationLabor;
  const categories = toNumber(values, 'duplicateCategories');
  const conflicts = toNumber(values, 'sourceOfTruthConflicts');

  return {
    headline: `${money(annualOverlap)} annual overlap exposure`,
    metrics: [
      { label: 'Monthly overlap cost', value: money(overlap + duplicateSeatCost) },
      { label: 'Duplicate categories', value: numberLabel(categories) },
      { label: 'Source-of-truth conflicts', value: numberLabel(conflicts) },
      { label: 'Consolidation labor estimate', value: money(consolidationLabor) },
      { label: 'First-year opportunity after labor', value: money(netFirstYearOpportunity) },
    ],
    flags: [
      categories >= 4 || annualOverlap > 12000 ? 'Consolidation candidates are material enough to review.' : 'Overlap exists, but it may be benign if teams have distinct workflows.',
      conflicts > 0 ? 'Duplicate tools may be creating source-of-truth confusion, not just cost.' : 'No source-of-truth conflict is modeled.',
      netFirstYearOpportunity < 0 ? 'Consolidation labor may outweigh first-year savings. Keep-both justification may be reasonable.' : 'The financial case can survive estimated consolidation labor.',
    ],
    notes: ['Two tools doing similar work can be acceptable. Two tools claiming to be the source of truth is usually a workflow problem.'],
  };
}

function softwareStackOwnership(values: Values): Result {
  const ownershipScore = clamp(
    toNumber(values, 'businessOwnerPct') * 0.18 +
      toNumber(values, 'technicalOwnerPct') * 0.16 +
      toNumber(values, 'renewalOwnerPct') * 0.22 +
      toNumber(values, 'dataOwnerPct') * 0.16 +
      toNumber(values, 'exitPlanPct') * 0.18 +
      (toNumber(values, 'reviewCadenceMonths') <= 6 ? 10 : 2) -
      (toNumber(values, 'renewalWindowMonths') <= 2 ? 8 : 0),
    0,
    100,
  );
  const toolCount = toNumber(values, 'toolCount');
  const ownerlessTools = toolCount * Math.max(0, 100 - toNumber(values, 'renewalOwnerPct')) / 100;

  return {
    headline: `${numberLabel(ownershipScore, '/100')} ownership score`,
    metrics: [
      { label: 'Tools reviewed', value: numberLabel(toolCount) },
      { label: 'Likely renewal-owner gaps', value: numberLabel(ownerlessTools) },
      { label: 'Business owner coverage', value: pct(toNumber(values, 'businessOwnerPct')) },
      { label: 'Data owner coverage', value: pct(toNumber(values, 'dataOwnerPct')) },
      { label: 'Exit plan coverage', value: pct(toNumber(values, 'exitPlanPct')) },
    ],
    flags: [
      ownershipScore >= 85 ? 'Owned: tools have clear accountability.' : ownershipScore >= 70 ? 'Partly owned: renewal, data, or exit gaps remain.' : ownershipScore >= 50 ? 'Ownerless drift is likely.' : 'Risky: tools may control data or workflow without clear ownership.',
      toNumber(values, 'exitPlanPct') < 40 ? 'Exit plans are weak. That makes cancellation and data migration harder later.' : 'Exit planning is not the weakest signal.',
      toNumber(values, 'renewalWindowMonths') <= 2 ? 'A renewal window is close. Ownership needs to be clarified now.' : 'No immediate renewal emergency is modeled.',
    ],
    notes: ['A tool without an owner is not neutral. It can keep billing, hold data, create access risk, and become hard to remove.'],
  };
}

function softwareRoi(values: Values): Result {
  const grossHoursValue = toNumber(values, 'hoursSavedWeek') * toNumber(values, 'hourlyValue') * 4.33;
  const reviewCost = toNumber(values, 'reviewHoursWeek') * toNumber(values, 'hourlyValue') * 4.33;
  const adminCost = toNumber(values, 'adminHoursWeek') * toNumber(values, 'hourlyValue') * 4.33;
  const adoptedValue = grossHoursValue * toNumber(values, 'adoptionPct') / 100;
  const monthlyCost = toNumber(values, 'monthlyCost') + reviewCost + adminCost + (toNumber(values, 'setupCost') + toNumber(values, 'trainingCost')) / 12;
  const benefit = adoptedValue + toNumber(values, 'errorReductionMonthly');
  const net = benefit - monthlyCost;

  return {
    headline: net >= 0 ? `${money(net)} monthly ROI after adoption` : `${money(Math.abs(net))} monthly shortfall`,
    metrics: [
      { label: 'Adoption-adjusted time value', value: money(adoptedValue) },
      { label: 'Review / maintenance cost', value: money(reviewCost) },
      { label: 'Admin / integration cost', value: money(adminCost) },
      { label: 'Monthly cost with setup', value: money(monthlyCost) },
      { label: 'Total modeled monthly benefit', value: money(benefit) },
      { label: 'Switching / lock-in cost', value: money(toNumber(values, 'switchingCost')) },
    ],
    flags: [
      toNumber(values, 'adoptionPct') < 50 ? 'Adoption is low. The tool may have negative ROI even if the demo looked good.' : 'Adoption assumption is material enough to test.',
      reviewCost > adoptedValue * 0.4 ? 'Review work consumes much of the time savings. The workflow may not be redesigned enough.' : 'Review work is not consuming most of the modeled savings.',
    ],
    notes: ['ROI is not real until the workflow changes and the old work actually disappears. Adoption, review time, maintenance, and contract terms can erase demo math.'],
  };
}

function aiToolRoi(values: Values): Result {
  const accessCost = toNumber(values, 'monthlyCost') + toNumber(values, 'perSeatCost') * toNumber(values, 'users') + toNumber(values, 'apiTokenCostMonthly');
  const tasksPerMonth = toNumber(values, 'tasksPerWeek') * 4.33;
  const grossHoursSaved = (tasksPerMonth * toNumber(values, 'minutesSavedPerTask')) / 60;
  const reviewHours = (tasksPerMonth * toNumber(values, 'reviewMinutesPerTask')) / 60;
  const adoptedGrossValue = grossHoursSaved * toNumber(values, 'hourlyValue') * toNumber(values, 'adoptionPct') / 100;
  const reviewCost = reviewHours * toNumber(values, 'hourlyValue');
  const monthlyCost = accessCost + reviewCost + toNumber(values, 'implementationCost') / 12 + toNumber(values, 'errorRiskMonthly');
  const net = adoptedGrossValue - monthlyCost;
  const costPerTask = monthlyCost / Math.max(1, tasksPerMonth);
  const sensitivity = toStringValue(values, 'customerSensitivity');

  return {
    headline: net >= 0 ? `${money(net)} monthly AI ROI after review` : `${money(Math.abs(net))} monthly AI shortfall`,
    metrics: [
      { label: 'Gross hours saved', value: numberLabel(grossHoursSaved, ' hrs/mo') },
      { label: 'Review hours added', value: numberLabel(reviewHours, ' hrs/mo') },
      { label: 'Adoption-adjusted value', value: money(adoptedGrossValue) },
      { label: 'Monthly AI cost incl. review', value: money(monthlyCost) },
      { label: 'Cost per AI-assisted task', value: money(costPerTask) },
    ],
    flags: [
      net > monthlyCost * 0.5 ? 'Real ROI: the tool appears to change workflow and save net value.' : net >= 0 ? 'Needs adoption: the tool can work, but value depends on behavior change.' : reviewCost > adoptedGrossValue * 0.6 ? 'Review drag: checking and correcting output consumes the savings.' : 'AI theater risk: interesting tool, weak economics under these assumptions.',
      sensitivity === 'high' ? 'Output sensitivity is high. Privacy, security, compliance, and human review may dominate the ROI story.' : 'Output sensitivity is not modeled as the main blocker.',
      toNumber(values, 'adoptionPct') < 50 ? 'Adoption is low enough to treat the rollout as an experiment, not a full-scale decision.' : 'Adoption is high enough to test with measured workflow data.',
    ],
    notes: ['AI ROI is not the demo. Count prompting, review, correction, security review, training, and whether the old workflow actually disappears.'],
  };
}

function aiTokenCost(values: Values): Result {
  const users = toNumber(values, 'users');
  const requests = users * toNumber(values, 'requestsPerUserMonth');
  const retryMultiplier = 1 + toNumber(values, 'retryPct') / 100;
  const cacheHit = toNumber(values, 'cacheHitPct') / 100;
  const inputCost = ((toNumber(values, 'inputTokens') * requests * retryMultiplier) / 1_000_000) * toNumber(values, 'inputCostPerMillion') * (1 - cacheHit * 0.9);
  const outputCost = ((toNumber(values, 'outputTokens') * requests * retryMultiplier) / 1_000_000) * toNumber(values, 'outputCostPerMillion');
  const monthly = inputCost + outputCost;
  const growthCase = monthly * (1 + toNumber(values, 'growthPct') / 100);
  const costPerRequest = monthly / Math.max(1, requests);
  const retryCost = monthly - monthly / retryMultiplier;

  return {
    headline: `${money(monthly)} monthly AI token/API cost`,
    metrics: [
      { label: 'Requests per month', value: numberLabel(requests) },
      { label: 'Cost per request', value: money(costPerRequest) },
      { label: 'Input-token cost', value: money(inputCost) },
      { label: 'Output-token cost', value: money(outputCost) },
      { label: 'Retry cost estimate', value: money(retryCost) },
      { label: 'Growth case', value: money(growthCase) },
    ],
    flags: [
      toNumber(values, 'outputTokens') > toNumber(values, 'inputTokens') ? 'Output length is a major cost driver. Summaries, limits, or structured output may matter.' : 'Input/context length is likely the larger token driver.',
      toNumber(values, 'retryPct') > 20 ? 'Retries are high enough to instrument failures and prompt quality.' : 'Retry rate is not the main cost issue in this scenario.',
      toNumber(values, 'growthPct') >= 100 ? 'Usage growth could turn a small prompt into a large monthly bill.' : 'Growth is material but not explosive in this scenario.',
    ],
    notes: ['Token cost is prompt length, output length, retries, context, tool calls, cache behavior, and model choice. Check current provider pricing before quoting.'],
  };
}

function cloudBillShock(values: Values): Result {
  const current = toNumber(values, 'currentMonthlyCloud');
  const weightedGrowth =
    toNumber(values, 'trafficGrowthPct') * 0.22 +
    toNumber(values, 'storageGrowthPct') * 0.16 +
    toNumber(values, 'dataTransferGrowthPct') * 0.2 +
    toNumber(values, 'loggingGrowthPct') * 0.16 +
    toNumber(values, 'aiApiGrowthPct') * 0.2;
  const expected = current * (1 + weightedGrowth / 100);
  const shock = expected * (1 + toNumber(values, 'incidentSpikePct') / 100);
  const revenue = Math.max(1, toNumber(values, 'monthlyRevenue'));
  const cloudShare = shock / revenue;
  const marginAfterShock = toNumber(values, 'grossMarginPct') - cloudShare * 100;

  return {
    headline: `${money(shock)} monthly shock scenario`,
    metrics: [
      { label: 'Current monthly bill', value: money(current) },
      { label: 'Expected growth bill', value: money(expected) },
      { label: 'Shock increase', value: money(shock - current) },
      { label: 'Cloud share of revenue', value: pct(cloudShare * 100) },
      { label: 'Margin after shock pressure', value: pct(marginAfterShock) },
    ],
    flags: [
      cloudShare > 0.18 ? 'Margin danger: cloud cost growth could damage unit economics.' : cloudShare > 0.1 ? 'Shock-prone: usage growth could create a large bill jump.' : 'Controlled: modeled growth does not dominate revenue.',
      toNumber(values, 'aiApiGrowthPct') > 100 ? 'AI/API usage is a major spike driver. Track cost per action or request.' : 'AI/API usage is not the only shock driver.',
      toNumber(values, 'dataTransferGrowthPct') > 75 ? 'Data transfer growth is high enough to review customer download, CDN, and architecture paths.' : 'Data transfer growth is not modeled as extreme.',
    ],
    notes: ['Cloud bill shock is often several decisions stacking: traffic, storage retention, logging, AI/API calls, data paths, and missing alerts.'],
  };
}

function cloudUnitEconomics(values: Values): Result {
  const spend = toNumber(values, 'monthlyCloudSpend');
  const customers = Math.max(1, toNumber(values, 'customers'));
  const users = Math.max(1, toNumber(values, 'users'));
  const transactions = Math.max(1, toNumber(values, 'transactions'));
  const tenants = Math.max(1, toNumber(values, 'tenants'));
  const aiAssists = Math.max(1, toNumber(values, 'aiAssists'));
  const costPerCustomer = spend / customers;
  const revenuePerCustomer = toNumber(values, 'revenuePerCustomer');
  const cloudMarginDrag = revenuePerCustomer > 0 ? (costPerCustomer / revenuePerCustomer) * 100 : 0;
  const marginAfterCloud = toNumber(values, 'targetGrossMarginPct') - cloudMarginDrag;

  return {
    headline: `${money(costPerCustomer)} cloud cost per customer`,
    metrics: [
      { label: 'Cost per user', value: money(spend / users) },
      { label: 'Cost per transaction/API call', value: money(spend / transactions) },
      { label: 'Cost per tenant', value: money(spend / tenants) },
      { label: 'Cost per AI assist/action', value: money(spend / aiAssists) },
      { label: 'Cloud share of revenue/customer', value: pct(cloudMarginDrag) },
      { label: 'Margin after cloud cost', value: pct(marginAfterCloud) },
    ],
    flags: [
      marginAfterCloud < 40 ? 'Pricing/architecture issue: product economics may need redesign.' : marginAfterCloud < 60 ? 'Margin drag: cost-to-serve needs monitoring as usage grows.' : 'Healthy unit cost: cost-to-serve supports margin under these inputs.',
      costPerCustomer > revenuePerCustomer * 0.2 && revenuePerCustomer > 0 ? 'Cloud cost per customer is taking a large share of customer revenue.' : 'Cloud cost per customer is not dominating revenue.',
    ],
    notes: ['Total cloud spend matters, but unit cost tells you whether growth improves or weakens the model.'],
  };
}

function cloudCommitmentRisk(values: Values): Result {
  const onDemand = toNumber(values, 'onDemandMonthlySpend');
  const proposed = toNumber(values, 'proposedCommitmentMonthly');
  const existing = toNumber(values, 'existingCommitmentsMonthly');
  const futureUsage = onDemand * (1 + toNumber(values, 'growthPct') / 100);
  const totalCommitment = proposed + existing;
  const coveredUsage = Math.min(futureUsage, totalCommitment);
  const grossSavings = coveredUsage * toNumber(values, 'commitmentDiscountPct') / 100;
  const unusedCommitment = Math.max(0, totalCommitment - futureUsage);
  const downside = unusedCommitment * (1 + toNumber(values, 'downsizingRiskPct') / 100);
  const netSavings = grossSavings - downside;
  const utilization = totalCommitment > 0 ? (Math.min(futureUsage, totalCommitment) / totalCommitment) * 100 : 0;
  const termValue = netSavings * toNumber(values, 'termMonths');

  return {
    headline: netSavings >= 0 ? `${money(netSavings)} modeled monthly net savings` : `${money(Math.abs(netSavings))} monthly commitment downside`,
    metrics: [
      { label: 'Commitment utilization', value: pct(utilization) },
      { label: 'Gross monthly savings', value: money(grossSavings) },
      { label: 'Unused commitment exposure', value: money(unusedCommitment) },
      { label: 'Downside-adjusted net', value: money(netSavings) },
      { label: 'Term value / downside', value: money(termValue) },
    ],
    flags: [
      utilization >= 90 && toNumber(values, 'usageStabilityPct') >= 75 ? 'Good candidate: usage appears stable enough to support commitment.' : utilization >= 75 ? 'Partial commitment: some usage is stable, but not all.' : 'Too variable: the discount may become underused obligation.',
      existing > 0 ? 'Existing commitments should be reviewed before buying more.' : 'No existing commitments were modeled.',
      toNumber(values, 'downsizingRiskPct') > 35 ? 'Downsizing or migration risk is high enough to wait or commit smaller.' : 'Downside risk is not modeled as extreme.',
    ],
    notes: ['A discount is only good if usage sticks. Commit stable workloads, not optimistic forecasts.'],
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
  const exitCost =
    egress +
    labor +
    dualRun +
    toNumber(values, 'refactorCost') +
    toNumber(values, 'commitmentRemaining') +
    toNumber(values, 'downtimeRiskCost') +
    toNumber(values, 'retrainingCost');
  const payback = monthlySavings > 0 ? exitCost / monthlySavings : Infinity;
  const optimizeFirstPayback = (current - toNumber(values, 'optimizationSavingsAvailable') - target) > 0 ? exitCost / (current - toNumber(values, 'optimizationSavingsAvailable') - target) : Infinity;

  return {
    headline: Number.isFinite(payback) ? `${numberLabel(payback, ' months')} exit payback` : 'No payback if target cost is not lower',
    metrics: [
      { label: 'One-time exit cost', value: money(exitCost) },
      { label: 'Monthly savings after exit', value: money(monthlySavings) },
      { label: 'Migration labor', value: money(labor) },
      { label: 'Dual-running cost', value: money(dualRun) },
      { label: 'Remaining commitments', value: money(toNumber(values, 'commitmentRemaining')) },
      { label: 'Payback after optimizing first', value: Number.isFinite(optimizeFirstPayback) ? numberLabel(optimizeFirstPayback, ' months') : 'No payback' },
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

function medicareIrmaa(values: Values): Result {
  const income = toNumber(values, 'modifiedAgi');
  const filingStatus = toStringValue(values, 'filingStatus');
  const basePartB = toNumber(values, 'basePartB');
  const basePartD = toNumber(values, 'basePartD');

  const brackets =
    filingStatus === 'joint'
      ? [
          { max: 218000, b: 0, d: 0 },
          { max: 274000, b: 81.2, d: 14.5 },
          { max: 342000, b: 202.9, d: 37.5 },
          { max: 410000, b: 324.6, d: 60.4 },
          { max: 750000, b: 446.3, d: 83.3 },
          { max: Infinity, b: 487, d: 91 },
        ]
      : filingStatus === 'mfs'
        ? [
            { max: 109000, b: 0, d: 0 },
            { max: 391000, b: 446.3, d: 83.3 },
            { max: Infinity, b: 487, d: 91 },
          ]
        : [
            { max: 109000, b: 0, d: 0 },
            { max: 137000, b: 81.2, d: 14.5 },
            { max: 171000, b: 202.9, d: 37.5 },
            { max: 205000, b: 324.6, d: 60.4 },
            { max: 500000, b: 446.3, d: 83.3 },
            { max: Infinity, b: 487, d: 91 },
          ];
  const bracket = brackets.find((item) => income <= item.max) ?? brackets[brackets.length - 1];
  const monthly = basePartB + basePartD + bracket.b + bracket.d;
  const nextThreshold = brackets.find((item) => item.max > income)?.max ?? Infinity;

  return {
    headline: `${money(monthly)} estimated monthly Medicare premium exposure`,
    metrics: [
      { label: 'Part B total', value: money(basePartB + bracket.b) },
      { label: 'Part B IRMAA add-on', value: money(bracket.b) },
      { label: 'Part D IRMAA add-on', value: money(bracket.d) },
      { label: 'Annual premium exposure', value: money(monthly * 12) },
    ],
    flags: [
      bracket.b > 0 || bracket.d > 0 ? 'Income-related monthly adjustment amounts are modeled. A two-year lookback and life-changing-event rules may matter.' : 'No IRMAA add-on is modeled at this income level.',
      Number.isFinite(nextThreshold) && nextThreshold - income <= 5000 ? 'This income is close to the next IRMAA threshold. Verify MAGI planning before year-end.' : 'This income is not close to the next modeled threshold.',
    ],
    notes: ['IRMAA depends on modified adjusted gross income from the tax year Medicare uses, filing status, and Social Security/Medicare determinations.'],
  };
}

function partBPremium(values: Values): Result {
  const premium = toNumber(values, 'standardPremium') + toNumber(values, 'irmaaMonthly');
  const deductible = toNumber(values, 'annualDeductible');
  const coveredServices = toNumber(values, 'coveredServices');
  const coinsurance = toNumber(values, 'coinsurancePct') / 100;
  const costShare = Math.min(coveredServices, deductible) + Math.max(0, coveredServices - deductible) * coinsurance;
  const annual = premium * 12 + costShare;

  return {
    headline: `${money(annual)} estimated annual Part B exposure`,
    metrics: [
      { label: 'Monthly premium', value: money(premium) },
      { label: 'Annual premium', value: money(premium * 12) },
      { label: 'Estimated deductible and coinsurance', value: money(costShare) },
      { label: 'Part B deductible input', value: money(deductible) },
    ],
    flags: [
      toNumber(values, 'irmaaMonthly') > 0 ? 'IRMAA is included. Check whether the income lookback year and filing status are still accurate.' : 'No IRMAA add-on is included.',
      'Original Medicare Part B does not work like a simple annual cap. Supplemental coverage can change out-of-pocket exposure.',
    ],
    notes: ['Use this to separate premium, deductible, and coinsurance planning. Actual billing and covered-service amounts can differ.'],
  };
}

function partDEstimate(values: Values): Result {
  const premium = toNumber(values, 'monthlyPremium');
  const drugOop = toNumber(values, 'drugOop');
  const deductible = toNumber(values, 'deductible');
  const base = toNumber(values, 'baseBeneficiaryPremium');
  const uncoveredMonths = toNumber(values, 'uncoveredMonths');
  const penalty = isChecked(values, 'extraHelp') ? 0 : Math.round(base * 0.01 * uncoveredMonths * 10) / 10;
  const monthly = premium + drugOop + penalty;
  const annual = monthly * 12 + deductible;

  return {
    headline: `${money(monthly)} estimated monthly Part D exposure`,
    metrics: [
      { label: 'Annual premium, drugs, deductible', value: money(annual) },
      { label: 'Monthly premium', value: money(premium) },
      { label: 'Drug out-of-pocket estimate', value: money(drugOop) },
      { label: 'Modeled late enrollment penalty', value: money(penalty) },
    ],
    flags: [
      uncoveredMonths > 0 && penalty > 0 ? 'A Part D late enrollment penalty is modeled. Confirm creditable coverage history and Extra Help status.' : 'No Part D late enrollment penalty is modeled.',
      drugOop > premium * 2 ? 'Drug costs dominate the estimate. Compare formularies, pharmacies, prior authorization, and preferred tiers before choosing a plan.' : 'Drug out-of-pocket cost is not dominating the estimate from the current inputs.',
    ],
    notes: ['Part D costs vary by plan, drug list, pharmacy, income, coverage stage, and Extra Help eligibility.'],
  };
}

function hsaFsa(values: Values): Result {
  const hsaLimit = toStringValue(values, 'coverage') === 'family' ? 8750 : 4400;
  const hsaCatchup = isChecked(values, 'age55Plus') ? 1000 : 0;
  const hsaAllowed = hsaLimit + hsaCatchup;
  const hsaContribution = Math.min(toNumber(values, 'hsaContribution'), hsaAllowed);
  const fsaAllowed = 3400;
  const fsaContribution = Math.min(toNumber(values, 'fsaContribution'), fsaAllowed);
  const expected = toNumber(values, 'expectedExpenses');
  const usable = Math.min(expected, hsaContribution + fsaContribution);
  const taxRate = (toNumber(values, 'marginalTaxPct') + toNumber(values, 'payrollTaxPct')) / 100;
  const taxSavings = usable * taxRate;

  return {
    headline: `${money(taxSavings)} estimated tax savings on planned eligible expenses`,
    metrics: [
      { label: 'HSA limit used', value: money(hsaAllowed) },
      { label: 'Eligible HSA contribution modeled', value: money(hsaContribution) },
      { label: 'Eligible FSA contribution modeled', value: money(fsaContribution) },
      { label: 'Modeled eligible expenses covered', value: money(usable) },
    ],
    flags: [
      toNumber(values, 'hsaContribution') > hsaAllowed ? 'Planned HSA contribution is above the 2026 modeled limit. Reduce or verify eligibility.' : 'HSA contribution is within the modeled 2026 limit.',
      hsaContribution > 0 && fsaContribution > 0 ? 'HSA and general-purpose health FSA coordination can be limited. Verify whether the FSA is compatible with HSA eligibility.' : 'No HSA/FSA coordination conflict is modeled from the current inputs.',
    ],
    notes: ['This is a planning model for eligible medical expenses and tax preference. Employer rules and eligibility can change the result.'],
  };
}

function healthInsuranceCost(values: Values): Result {
  const premiumAnnual = toNumber(values, 'monthlyPremium') * 12;
  const deductible = toNumber(values, 'deductible');
  const expectedCare = toNumber(values, 'expectedCare');
  const coinsurance = toNumber(values, 'coinsurancePct') / 100;
  const copays = toNumber(values, 'copays');
  const oopMax = toNumber(values, 'oopMax');
  const medicalShare = Math.min(oopMax, Math.min(expectedCare, deductible) + Math.max(0, expectedCare - deductible) * coinsurance + copays);
  const total = premiumAnnual + medicalShare;

  return {
    headline: `${money(total)} estimated annual health insurance cost`,
    metrics: [
      { label: 'Annual premiums', value: money(premiumAnnual) },
      { label: 'Estimated care cost share', value: money(medicalShare) },
      { label: 'Out-of-pocket maximum input', value: money(oopMax) },
      { label: 'Monthly equivalent', value: money(total / 12) },
    ],
    flags: [
      premiumAnnual > medicalShare ? 'Premiums dominate the estimate. A lower-premium plan may still be risky if care use rises.' : 'Out-of-pocket exposure dominates the estimate. Compare deductible, coinsurance, network, and drug coverage.',
      medicalShare >= oopMax * 0.9 ? 'This scenario is near the out-of-pocket maximum. Verify which costs count toward the limit.' : 'This scenario is below the modeled out-of-pocket maximum.',
    ],
    notes: ['Premiums, deductibles, copays, coinsurance, networks, covered services, and plan rules can change the actual result.'],
  };
}

function ltcInsurance(values: Values): Result {
  const futureCareMonthly = toNumber(values, 'careMonthly') * Math.pow(1 + toNumber(values, 'careInflationPct') / 100, toNumber(values, 'yearsUntilCare'));
  const monthlyBenefit = toNumber(values, 'dailyBenefit') * 30.42;
  const benefitMonths = toNumber(values, 'benefitYears') * 12;
  const eliminationCost = futureCareMonthly / 30.42 * toNumber(values, 'eliminationDays');
  const monthlyGap = Math.max(0, futureCareMonthly - monthlyBenefit);
  const covered = monthlyBenefit * benefitMonths;
  const uncoveredDuringBenefit = monthlyGap * benefitMonths + eliminationCost;
  const premiumAnnual = toNumber(values, 'monthlyPremium') * 12;

  return {
    headline: `${money(monthlyGap)} estimated monthly gap after policy benefit`,
    metrics: [
      { label: 'Future monthly care estimate', value: money(futureCareMonthly) },
      { label: 'Monthly policy benefit', value: money(monthlyBenefit) },
      { label: 'Benefit pool estimate', value: money(covered) },
      { label: 'Elimination-period exposure', value: money(eliminationCost) },
      { label: 'Uncovered during benefit period', value: money(uncoveredDuringBenefit) },
      { label: 'Annual premium', value: money(premiumAnnual) },
    ],
    flags: [
      monthlyGap > 0 ? 'The modeled benefit does not fully cover the future care cost. Budget the gap before assuming coverage solves the problem.' : 'The modeled benefit covers the future monthly care estimate during the benefit period.',
      toNumber(values, 'benefitYears') < 3 ? 'Short benefit duration can exhaust quickly if care lasts longer than expected.' : 'Benefit duration is modeled at three years or more.',
    ],
    notes: ['Policy language controls. Verify benefit triggers, elimination period, inflation protection, exclusions, premium changes, and tax treatment.'],
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
    case 'tax-reserve-health':
      return taxReserveHealth(values);
    case 'quarterly-tax-catch-up':
      return quarterlyTaxCatchUp(values);
    case 'mixed-w2-1099-tax':
      return mixedW21099Tax(values);
    case 'irregular-income-tax-reserve':
      return irregularIncomeTaxReserve(values);
    case 'deduction-planner':
      return deductionPlanner(values);
    case 'deduction-documentation':
      return deductionDocumentation(values);
    case 's-corp':
      return sCorp(values);
    case 's-corp-break-even':
      return sCorpBreakEven(values);
    case 'reasonable-salary':
      return reasonableSalary(values);
    case 'freelance-rate':
      return freelanceRate(values);
    case 'business-expense-budget':
      return businessExpenseBudget(values);
    case 'margin-pricing':
      return marginPricing(values);
    case 'break-even':
      return breakEven(values);
    case 'profit-plan':
      return profitPlan(values);
    case 'pricing-confidence':
      return pricingConfidence(values);
    case 'discount-damage':
      return discountDamage(values);
    case 'scope-creep-cost':
      return scopeCreepCost(values);
    case 'walk-away-price':
      return walkAwayPrice(values);
    case 'client-profitability':
      return clientProfitability(values);
    case 'pricing-model-comparison':
      return pricingModelComparison(values);
    case 'price-increase-planner':
      return priceIncreasePlanner(values);
    case 'contractor-employee':
      return contractorEmployee(values);
    case 'payroll-burden':
      return payrollBurden(values);
    case 'hire-automate':
      return hireAutomate(values);
    case 'hiring-readiness':
      return hiringReadiness(values);
    case 'first-90-day-hire':
      return first90DayHireCost(values);
    case 'role-clarity':
      return roleClarity(values);
    case 'management-burden':
      return managementBurden(values);
    case 'contractor-trial':
      return contractorTrial(values);
    case 'work-deletion':
      return workDeletion(values);
    case 'hiring-stress-test':
      return hiringStressTest(values);
    case 'revenue-per-employee':
      return revenuePerEmployee(values);
    case 'revenue-forecast':
      return revenueForecast(values);
    case 'revenue-fragility':
      return revenueFragility(values);
    case 'sales-target':
      return salesTarget(values);
    case 'sales-pipeline-reality':
      return salesPipelineReality(values);
    case 'client-concentration-risk':
      return clientConcentrationRisk(values);
    case 'cash-runway':
      return cashRunway(values);
    case 'payment-delay-impact':
      return paymentDelayImpact(values);
    case 'churn':
      return churn(values);
    case 'churn-replacement':
      return churnReplacement(values);
    case 'subscription-pricing':
      return subscriptionPricing(values);
    case 'retainer-stability':
      return retainerStability(values);
    case 'expansion-vs-new-sales':
      return expansionVsNewSales(values);
    case 'operating-leverage':
      return operatingLeverage(values);
    case 'saas-cost':
      return saasCost(values);
    case 'software-spend-health':
      return softwareSpendHealth(values);
    case 'saas-renewal-risk':
      return saasRenewalRisk(values);
    case 'duplicate-tool-audit':
      return duplicateToolAudit(values);
    case 'software-stack-ownership':
      return softwareStackOwnership(values);
    case 'seat-cost':
      return seatCost(values);
    case 'cloud-cost':
      return cloudCost(values);
    case 'software-roi':
      return softwareRoi(values);
    case 'ai-tool-roi':
      return aiToolRoi(values);
    case 'ai-token-cost':
      return aiTokenCost(values);
    case 'cloud-bill-shock':
      return cloudBillShock(values);
    case 'cloud-unit-economics':
      return cloudUnitEconomics(values);
    case 'cloud-commitment-risk':
      return cloudCommitmentRisk(values);
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
    case 'medicare-irmaa':
      return medicareIrmaa(values);
    case 'part-b-premium':
      return partBPremium(values);
    case 'part-d-estimate':
      return partDEstimate(values);
    case 'hsa-fsa':
      return hsaFsa(values);
    case 'health-insurance-cost':
      return healthInsuranceCost(values);
    case 'ltc-insurance':
      return ltcInsurance(values);
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

function careMicrocopy(page: VerticalCalculatorPage): string | null {
  if (page.area !== 'care') return null;
  const copy: Record<string, string> = {
    'caregiver-hours-calculator':
      'Count supervision time too. If your loved one cannot safely be left alone, that time is part of the workload even if you are not actively doing a task.',
    'care-needs-checklist':
      'Use green, yellow, and red thinking. A task can look covered while still being fragile if one person is stretching to keep it working.',
    'assisted-living-cost-calculator':
      'Base rent is only the starting point. Care-level fees, medication management, supplies, transportation, laundry, and move-in fees can change the real monthly bill.',
    'memory-care-cost-calculator':
      'Memory care cost is not only housing. It often reflects supervision, safety, dementia-trained support, behavior response, and nighttime coverage.',
    'home-care-cost-calculator':
      'Home care cost depends on hours, not just the hourly rate. Price the uncovered hours and the backup plan before deciding home is cheaper.',
    'nursing-home-cost-calculator':
      'Separate short-term skilled rehab from long-term custodial care. Coverage, daily rates, and family payment responsibility can change quickly.',
    'senior-care-cost-calculator':
      'Compare care settings by safety, backup coverage, and family workload, not only monthly price.',
    'family-care-budget-calculator':
      'A complete care budget includes paid care, supplies, transport, insurance assumptions, family contributions, and caregiver relief.',
    'medicare-cost-planner':
      'Medicare costs change by year, income, plan, doctors, drugs, pharmacy, and health needs. Use this as a planning estimate, then confirm with Medicare, SHIP, or a qualified professional.',
    'medicare-irmaa-calculator':
      'IRMAA depends on Medicare MAGI, filing status, lookback year, and possible life-changing event adjustments. Use this to prepare questions, not to determine billing.',
    'part-b-premium-calculator':
      'Part B cost is more than the premium. Deductible, coinsurance, supplements, Medicare Advantage rules, and other coverage can change exposure.',
    'part-d-estimate':
      'Part D cost depends on plan, drugs, pharmacy, deductible, coverage rules, late enrollment penalty, and Extra Help status.',
    'hsa-fsa-calculator':
      'HSA and FSA planning depends on eligibility, employer rules, qualified expenses, and tax treatment. Confirm before contributing or reimbursing.',
    'health-insurance-cost-calculator':
      'Premium is not the whole plan cost. Deductible, copays, coinsurance, networks, covered services, and out-of-pocket maximum all matter.',
    'long-term-care-insurance-calculator':
      'A policy estimate is only useful if the benefit trigger, elimination period, covered settings, provider rules, and claim documentation are understood.',
  };
  return copy[page.slug] ?? 'Use this estimate to organize the conversation, then confirm details with providers, insurers, Medicare, Medicaid, tax, legal, or qualified advisors as appropriate.';
}

function resolveVerdict(depth: CalculatorDepthProfile, page: VerticalCalculatorPage, values: Values, result: Result, state: CalculatorStateSummary): string {
  if (typeof depth.verdict === 'function') {
    return depth.verdict({ page, values, result, state });
  }
  return depth.verdict;
}

function mergeValues(base: Values, updates: Partial<Values>): Values {
  const merged: Values = { ...base };
  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) merged[key] = value;
  });
  return merged;
}

function resolveModeValues(values: Values, modeValues: NonNullable<CalculatorDepthProfile['assumptionModes']>[number]['values']): Values {
  if (!modeValues) return values;
  const nextValues = typeof modeValues === 'function' ? modeValues(values) : modeValues;
  return mergeValues(values, nextValues);
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
  const [activeDecisionMode, setActiveDecisionMode] = useState(0);
  const depth = useMemo(() => getBusinessCalculatorDepth(page), [page]);

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

  useEffect(() => {
    setActiveDecisionMode(0);
  }, [page.slug]);

  const result = useMemo(() => calculate(page.kind, values), [page.kind, values]);
  const resultState = useMemo(() => depth?.state({ page, values, result }) ?? null, [depth, page, result, values]);
  const verdict = useMemo(() => {
    if (!depth || !resultState) return null;
    return resolveVerdict(depth, page, values, result, resultState);
  }, [depth, page, result, resultState, values]);
  const assumptionModeResults = useMemo(() => {
    if (!depth?.assumptionModes) return [];
    return depth.assumptionModes.map((mode) => {
      const modeValues = mode.id === 'expected' ? values : resolveModeValues(values, mode.values);
      return { ...mode, result: calculate(page.kind, modeValues) };
    });
  }, [depth, page.kind, values]);
  const microcopy = careMicrocopy(page);
  const methodologyHref = page.area === 'care' ? `/care/methodology/${page.slug}/` : undefined;

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
          {microcopy && (
            <p className="mb-3 rounded-md border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm leading-6 text-cyan-950">
              {microcopy}
            </p>
          )}
          {depth && depth.decisionModes.length > 0 && (
            <div className="mb-3 rounded-md border border-slate-200 bg-white p-3">
              <h3 className="text-sm font-semibold text-slate-900">Decision mode</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {depth.decisionModes.map((mode, index) => (
                  <button
                    key={mode.label}
                    type="button"
                    className={`rounded-md border px-3 py-2 text-left text-xs font-semibold ${
                      activeDecisionMode === index
                        ? 'border-brand-300 bg-brand-50 text-brand-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-brand-200'
                    }`}
                    onClick={() => setActiveDecisionMode(index)}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600">
                {depth.decisionModes[Math.min(activeDecisionMode, depth.decisionModes.length - 1)]?.description}
              </p>
            </div>
          )}
          {depth?.scenarioPresets && depth.scenarioPresets.length > 0 && (
            <div className="mb-3 rounded-md border border-slate-200 bg-white p-3">
              <h3 className="text-sm font-semibold text-slate-900">Scenario presets</h3>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {depth.scenarioPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className="rounded-md border border-slate-200 bg-slate-50 p-2 text-left text-xs text-slate-700 hover:border-brand-300 hover:bg-white"
                    onClick={() => setValues(mergeValues(defaultValues(page.fields), preset.values))}
                  >
                    <span className="block font-semibold text-slate-950">{preset.label}</span>
                    <span className="mt-1 block leading-5">{preset.description}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {page.fields.map((field) => (
              <InputField key={field.id} field={field} value={values[field.id]} onChange={update} />
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-brand-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">Result</div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{result.headline}</div>
          {resultState && (
            <div className={`mt-3 rounded-md border p-3 ${stateCopy[resultState.state].className}`}>
              <div className="text-xs font-semibold uppercase tracking-wide">{stateLabel(resultState)}</div>
              <p className="mt-1 text-sm leading-6">{resultState.summary}</p>
            </div>
          )}
          {verdict && (
            <div className="mt-3 rounded-md border border-brand-200 bg-brand-50 p-3">
              <h3 className="text-sm font-semibold text-brand-950">Kefiw verdict</h3>
              <p className="mt-1 text-sm leading-6 text-slate-800">{verdict}</p>
            </div>
          )}

          <dl className="mt-4 grid gap-3">
            {result.metrics.map((metric) => (
              <div key={metric.label} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{metric.label}</dt>
                <dd className="mt-1 text-lg font-semibold text-slate-950">{metric.value}</dd>
                {metric.note && <dd className="mt-1 text-xs text-slate-600">{metric.note}</dd>}
              </div>
            ))}
          </dl>

          {assumptionModeResults.length > 0 && (
            <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
              <h3 className="text-sm font-semibold text-slate-900">Conservative / expected / aggressive</h3>
              <div className="mt-2 grid gap-2">
                {assumptionModeResults.map((mode) => (
                  <div key={mode.id} className="rounded-md border border-slate-200 bg-white p-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{mode.label}</div>
                      <div className="text-right text-sm font-semibold text-slate-950">{mode.result.headline}</div>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">{mode.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
            <h3 className="text-sm font-semibold text-amber-950">Flags to check</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-950">
              {result.flags.map((flag) => <li key={flag}>{flag}</li>)}
            </ul>
          </div>

          {depth && (
            <div className="mt-4 grid gap-3">
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <h3 className="text-sm font-semibold text-slate-900">Assumptions that move this result</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {depth.sensitiveAssumptions.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                <h3 className="text-sm font-semibold text-slate-900">Common traps with this result</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {depth.commonTraps.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div className="rounded-md border border-brand-200 bg-brand-50 p-3">
                <h3 className="text-sm font-semibold text-brand-950">Better next move</h3>
                <p className="mt-1 text-sm leading-6 text-slate-800">
                  {resultState ? depth.betterNextMoves[resultState.state] ?? depth.betterNextMoves.default : depth.betterNextMoves.default}
                </p>
              </div>
            </div>
          )}

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

          {page.worksheetLinks && page.worksheetLinks.length > 0 && (
            <div className="mt-4 rounded-md border border-brand-200 bg-brand-50 p-3">
              <h3 className="text-sm font-semibold text-brand-950">Worksheet to use next</h3>
              <div className="mt-2 grid gap-2">
                {page.worksheetLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-md border border-brand-200 bg-white p-2 text-sm font-semibold text-brand-800 no-underline hover:border-brand-400"
                  >
                    {item.label}
                    {item.note && <span className="mt-1 block text-xs font-normal text-slate-600">{item.note}</span>}
                  </a>
                ))}
              </div>
            </div>
          )}

          {page.area === 'care' && (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <a
                href={methodologyHref}
                className="rounded-md border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400"
              >
                How this estimate works
              </a>
              <a
                href="/care/family-care-plan-summary/"
                className="rounded-md border border-slate-300 bg-white p-2 text-sm font-semibold text-slate-900 no-underline hover:border-brand-400"
              >
                Add to family summary
              </a>
            </div>
          )}
        </aside>
      </div>

      {depth && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-950">What most advice leaves out</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{depth.whatAdviceLeavesOut}</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-950">How this calculator thinks</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{depth.methodologyMiniBlock}</p>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-950">Reality check questions</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {depth.realityCheckQuestions.map((question) => <li key={question}>{question}</li>)}
            </ul>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-950">What this tool does not do</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
              {depth.doesNotDo.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </section>

          {depth.operatorExamples && depth.operatorExamples.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
              <h3 className="text-base font-semibold text-slate-950">Operator examples</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {depth.operatorExamples.map((example) => (
                  <article key={example.title} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <h4 className="text-sm font-semibold text-slate-950">{example.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-700">{example.body}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-brand-800">Kefiw takeaway: {example.takeaway}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          {depth.situationLinks.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
              <h3 className="text-base font-semibold text-slate-950">Your next calculator depends on what felt uncomfortable</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {depth.situationLinks.map((link) => (
                  <a key={link.href} href={link.href} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-900 no-underline hover:border-brand-300 hover:bg-white">
                    <span className="block text-sm font-semibold">{link.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-600">{link.note}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {page.group === 'Pricing' && page.monetizationFit && page.monetizationFit.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
              <h3 className="text-base font-semibold text-slate-950">Tools that may help after you run the numbers</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {page.monetizationFit.map((fit) => (
                  <div key={fit} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="text-sm font-semibold capitalize text-slate-950">{fit}</div>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Use this category only if it reduces unpaid time, clarifies profit, protects scope, or improves collection.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {depth.faqs.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
              <h3 className="text-base font-semibold text-slate-950">Messy questions this calculator should answer</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {depth.faqs.map((faq) => (
                  <article key={faq.q} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <h4 className="text-sm font-semibold text-slate-950">{faq.q}</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{faq.a}</p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </section>
  );
}

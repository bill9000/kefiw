export interface Unit {
  id: string;
  label: string;
  toBase: (n: number) => number;
  fromBase: (n: number) => number;
}

export type UnitGroup = Record<string, Unit>;

const linear = (factor: number): Pick<Unit, 'toBase' | 'fromBase'> => ({
  toBase: (n) => n * factor,
  fromBase: (n) => n / factor,
});

// Length — base: meter
export const LENGTH: UnitGroup = {
  mm:   { id: 'mm',   label: 'Millimeter (mm)',   ...linear(0.001) },
  cm:   { id: 'cm',   label: 'Centimeter (cm)',   ...linear(0.01) },
  m:    { id: 'm',    label: 'Meter (m)',         ...linear(1) },
  km:   { id: 'km',   label: 'Kilometer (km)',    ...linear(1000) },
  in:   { id: 'in',   label: 'Inch (in)',         ...linear(0.0254) },
  ft:   { id: 'ft',   label: 'Foot (ft)',         ...linear(0.3048) },
  yd:   { id: 'yd',   label: 'Yard (yd)',         ...linear(0.9144) },
  mi:   { id: 'mi',   label: 'Mile (mi)',         ...linear(1609.344) },
  nmi:  { id: 'nmi',  label: 'Nautical mile',     ...linear(1852) },
};

// Weight — base: kilogram
export const WEIGHT: UnitGroup = {
  mg:   { id: 'mg',   label: 'Milligram (mg)',    ...linear(1e-6) },
  g:    { id: 'g',    label: 'Gram (g)',          ...linear(0.001) },
  kg:   { id: 'kg',   label: 'Kilogram (kg)',     ...linear(1) },
  t:    { id: 't',    label: 'Metric ton (t)',    ...linear(1000) },
  oz:   { id: 'oz',   label: 'Ounce (oz)',        ...linear(0.028349523125) },
  lb:   { id: 'lb',   label: 'Pound (lb)',        ...linear(0.45359237) },
  st:   { id: 'st',   label: 'Stone (st)',        ...linear(6.35029318) },
  'us-ton': { id: 'us-ton', label: 'US ton',      ...linear(907.18474) },
};

// Temperature — base: Celsius
export const TEMPERATURE: UnitGroup = {
  C: { id: 'C', label: 'Celsius (°C)',      toBase: (n) => n,               fromBase: (n) => n },
  F: { id: 'F', label: 'Fahrenheit (°F)',   toBase: (n) => (n - 32) * 5/9,  fromBase: (n) => n * 9/5 + 32 },
  K: { id: 'K', label: 'Kelvin (K)',        toBase: (n) => n - 273.15,       fromBase: (n) => n + 273.15 },
  R: { id: 'R', label: 'Rankine (°R)',      toBase: (n) => (n - 491.67) * 5/9, fromBase: (n) => (n + 273.15) * 9/5 },
};

// Area — base: square meter
export const AREA: UnitGroup = {
  mm2:  { id: 'mm2',  label: 'Square millimeter', ...linear(1e-6) },
  cm2:  { id: 'cm2',  label: 'Square centimeter', ...linear(1e-4) },
  m2:   { id: 'm2',   label: 'Square meter',      ...linear(1) },
  km2:  { id: 'km2',  label: 'Square kilometer',  ...linear(1e6) },
  in2:  { id: 'in2',  label: 'Square inch',       ...linear(0.00064516) },
  ft2:  { id: 'ft2',  label: 'Square foot',       ...linear(0.09290304) },
  yd2:  { id: 'yd2',  label: 'Square yard',       ...linear(0.83612736) },
  ac:   { id: 'ac',   label: 'Acre',              ...linear(4046.8564224) },
  ha:   { id: 'ha',   label: 'Hectare',           ...linear(10000) },
  mi2:  { id: 'mi2',  label: 'Square mile',       ...linear(2589988.110336) },
};

// Volume — base: liter
export const VOLUME: UnitGroup = {
  ml:      { id: 'ml',      label: 'Milliliter (ml)',   ...linear(0.001) },
  l:       { id: 'l',       label: 'Liter (l)',         ...linear(1) },
  m3:      { id: 'm3',      label: 'Cubic meter',       ...linear(1000) },
  tsp:     { id: 'tsp',     label: 'Teaspoon (US)',     ...linear(0.00492892) },
  tbsp:    { id: 'tbsp',    label: 'Tablespoon (US)',   ...linear(0.0147868) },
  'fl-oz': { id: 'fl-oz',   label: 'Fluid ounce (US)',  ...linear(0.0295735) },
  cup:     { id: 'cup',     label: 'Cup (US)',          ...linear(0.2365882) },
  pint:    { id: 'pint',    label: 'Pint (US)',         ...linear(0.4731764) },
  quart:   { id: 'quart',   label: 'Quart (US)',        ...linear(0.9463529) },
  gal:     { id: 'gal',     label: 'Gallon (US)',       ...linear(3.785411784) },
  'gal-uk':{ id: 'gal-uk',  label: 'Gallon (UK)',       ...linear(4.54609) },
};

// Speed — base: meters per second
export const SPEED: UnitGroup = {
  mps:  { id: 'mps',  label: 'm/s',    ...linear(1) },
  kph:  { id: 'kph',  label: 'km/h',   ...linear(1 / 3.6) },
  mph:  { id: 'mph',  label: 'mph',    ...linear(0.44704) },
  knot: { id: 'knot', label: 'Knots',  ...linear(0.514444) },
  fps:  { id: 'fps',  label: 'ft/s',   ...linear(0.3048) },
};

// Time — base: seconds
export const TIME: UnitGroup = {
  ms:   { id: 'ms',   label: 'Millisecond',  ...linear(0.001) },
  s:    { id: 's',    label: 'Second',       ...linear(1) },
  min:  { id: 'min',  label: 'Minute',       ...linear(60) },
  h:    { id: 'h',    label: 'Hour',         ...linear(3600) },
  day:  { id: 'day',  label: 'Day',          ...linear(86400) },
  week: { id: 'week', label: 'Week',         ...linear(604800) },
  month:{ id: 'month',label: 'Month (avg)',  ...linear(2629746) },
  year: { id: 'year', label: 'Year',         ...linear(31556952) },
};

export function convert(value: number, from: Unit, to: Unit): number {
  return to.fromBase(from.toBase(value));
}

export function formatNum(n: number, decimals = 6): string {
  if (!Number.isFinite(n)) return '–';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12 || abs < 1e-6) return n.toExponential(4);
  return parseFloat(n.toFixed(decimals)).toString();
}

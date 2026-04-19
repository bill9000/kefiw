export interface NumStats {
  count: number;
  sum: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
  stdDev: number;
  variance: number;
}

export function parseNumbers(raw: string): number[] {
  return raw
    .split(/[\s,;\n\t]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => parseFloat(s))
    .filter((n) => Number.isFinite(n));
}

export function numStats(values: number[]): NumStats | null {
  if (values.length === 0) return null;
  const n = values.length;
  const sum = values.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(n / 2);
  const median = n % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const min = sorted[0];
  const max = sorted[n - 1];
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const stdDev = Math.sqrt(variance);
  return { count: n, sum, mean, median, min, max, range: max - min, stdDev, variance };
}

export function fmt(n: number, decimals = 4): string {
  if (!Number.isFinite(n)) return '–';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1e12 || (abs > 0 && abs < 1e-6)) return n.toExponential(3);
  return parseFloat(n.toFixed(decimals)).toString();
}

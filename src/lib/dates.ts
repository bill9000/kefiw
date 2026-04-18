export interface DateDiff {
  years: number; months: number; days: number;
  totalDays: number; totalHours: number; totalMinutes: number; totalSeconds: number;
  totalWeeks: number;
}

export function diffDates(fromISO: string, toISO: string): DateDiff | null {
  const from = new Date(fromISO);
  const to = new Date(toISO);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
  const ms = to.getTime() - from.getTime();
  const sign = ms < 0 ? -1 : 1;
  const abs = Math.abs(ms);
  const totalSeconds = Math.floor(abs / 1000) * sign;
  const totalMinutes = Math.floor(abs / 60000) * sign;
  const totalHours = Math.floor(abs / 3600000) * sign;
  const totalDays = Math.floor(abs / 86400000) * sign;
  const totalWeeks = totalDays / 7;

  // Y/M/D components
  const a = sign >= 0 ? from : to;
  const b = sign >= 0 ? to : from;
  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months -= 1;
    const prev = new Date(b.getFullYear(), b.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years: years * sign, months: months * sign, days: days * sign, totalDays, totalHours, totalMinutes, totalSeconds, totalWeeks };
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function pad(n: number) { return String(n).padStart(2, '0'); }

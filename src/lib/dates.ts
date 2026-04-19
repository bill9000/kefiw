export interface DateDiff {
  years: number; months: number; days: number;
  hours: number; minutes: number;
  totalDays: number; totalHours: number; totalMinutes: number; totalSeconds: number;
  totalWeeks: number;
}

function parseLocal(s: string): Date {
  // Date-only (YYYY-MM-DD) → local midnight. datetime-local (YYYY-MM-DDTHH:mm[:ss]) → local.
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(`${s}T00:00`);
  return new Date(s);
}

function addMonthsClamped(d: Date, n: number): Date {
  const y = d.getFullYear();
  const total = d.getMonth() + n;
  const targetY = y + Math.floor(total / 12);
  const targetM = ((total % 12) + 12) % 12;
  const daysInTarget = new Date(targetY, targetM + 1, 0).getDate();
  const day = Math.min(d.getDate(), daysInTarget);
  return new Date(targetY, targetM, day, d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
}

export function diffDates(fromISO: string, toISO: string): DateDiff | null {
  const from = parseLocal(fromISO);
  const to = parseLocal(toISO);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
  const ms = to.getTime() - from.getTime();
  const sign = ms < 0 ? -1 : 1;
  const abs = Math.abs(ms);
  const totalSeconds = Math.floor(abs / 1000) * sign;
  const totalMinutes = Math.floor(abs / 60000) * sign;
  const totalHours = Math.floor(abs / 3600000) * sign;
  const totalDays = Math.floor(abs / 86400000) * sign;
  const totalWeeks = totalDays / 7;

  const a = sign >= 0 ? from : to;
  const b = sign >= 0 ? to : from;
  let years = b.getFullYear() - a.getFullYear();
  let anchor = addMonthsClamped(a, years * 12);
  if (anchor.getTime() > b.getTime()) {
    years -= 1;
    anchor = addMonthsClamped(a, years * 12);
  }
  let months = 0;
  while (true) {
    const next = addMonthsClamped(a, years * 12 + months + 1);
    if (next.getTime() > b.getTime()) break;
    anchor = next;
    months += 1;
  }
  const dayMs = 86400000;
  const days = Math.floor((b.getTime() - anchor.getTime()) / dayMs);
  const remainderMs = b.getTime() - anchor.getTime() - days * dayMs;
  const hours = Math.floor(remainderMs / 3600000);
  const minutes = Math.floor((remainderMs - hours * 3600000) / 60000);

  return {
    years: years * sign,
    months: months * sign,
    days: days * sign,
    hours: hours * sign,
    minutes: minutes * sign,
    totalDays, totalHours, totalMinutes, totalSeconds, totalWeeks,
  };
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function nowLocalMinute(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

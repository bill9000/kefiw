// Daily day-boundary helper. The Daily Kefiw day rolls over at 4:00 AM
// America/New_York (handles DST automatically). Everyone worldwide plays
// the same puzzle on the same daily key.
//
// - getDailyDate(now): ISO date string (YYYY-MM-DD) for the current daily key
// - getDayOfYear(dailyDate): 1..366, used to index curated word sets
// - getSecondsUntilRollover(now): countdown seconds to the next 4am ET rollover

const DAY_MS = 86_400_000;

interface ETParts {
  year: number;
  month: number;
  day: number;
  hour: number;
}

function getETParts(now: Date): ETParts {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (type: string): number => {
    const p = parts.find((x) => x.type === type);
    return p ? Number(p.value) : 0;
  };
  const hour = get('hour');
  return { year: get('year'), month: get('month'), day: get('day'), hour: hour === 24 ? 0 : hour };
}

export function getDailyDate(now: Date = new Date()): string {
  const { year, month, day, hour } = getETParts(now);
  let d = new Date(Date.UTC(year, month - 1, day));
  if (hour < 4) {
    d = new Date(d.getTime() - DAY_MS);
  }
  return d.toISOString().slice(0, 10);
}

export function getDayOfYear(dailyDate: string): number {
  const [y, m, d] = dailyDate.split('-').map(Number);
  const start = Date.UTC(y, 0, 0);
  const target = Date.UTC(y, m - 1, d);
  return Math.floor((target - start) / DAY_MS);
}

export function getSecondsUntilRollover(now: Date = new Date()): number {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const tParts = fmt.formatToParts(now);
  const getT = (type: string): number => {
    const p = tParts.find((x) => x.type === type);
    return p ? Number(p.value) : 0;
  };
  const rawHour = getT('hour');
  const h = rawHour === 24 ? 0 : rawHour;
  const secondsIntoDayET = h * 3600 + getT('minute') * 60 + getT('second');
  const fourAmSec = 4 * 3600;
  return secondsIntoDayET < fourAmSec
    ? fourAmSec - secondsIntoDayET
    : 24 * 3600 - secondsIntoDayET + fourAmSec;
}

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp, ArrowUpRight, ArrowRight, ArrowDownRight,
  ArrowDown, ArrowDownLeft, ArrowLeft, ArrowUpLeft,
  Target, Trophy, RefreshCw, Zap, Globe2,
} from 'lucide-react';

type Country = { iso: string; name: string; aliases: string[]; lat: number; lon: number };

const COUNTRIES: Country[] = [
  { iso: 'USA', name: 'United States',     aliases: ['usa', 'us', 'america', 'united states of america'], lat: 37.0902, lon: -95.7129 },
  { iso: 'CHN', name: 'China',             aliases: ['china', 'prc'], lat: 35.8617, lon: 104.1954 },
  { iso: 'IND', name: 'India',             aliases: ['india'], lat: 20.5937, lon: 78.9629 },
  { iso: 'RUS', name: 'Russia',            aliases: ['russia', 'russian federation'], lat: 61.5240, lon: 105.3188 },
  { iso: 'JPN', name: 'Japan',             aliases: ['japan'], lat: 36.2048, lon: 138.2529 },
  { iso: 'DEU', name: 'Germany',           aliases: ['germany', 'deutschland'], lat: 51.1657, lon: 10.4515 },
  { iso: 'GBR', name: 'United Kingdom',    aliases: ['uk', 'united kingdom', 'britain', 'great britain'], lat: 55.3781, lon: -3.4360 },
  { iso: 'FRA', name: 'France',            aliases: ['france'], lat: 46.2276, lon: 2.2137 },
  { iso: 'BRA', name: 'Brazil',            aliases: ['brazil', 'brasil'], lat: -14.2350, lon: -51.9253 },
  { iso: 'ITA', name: 'Italy',             aliases: ['italy'], lat: 41.8719, lon: 12.5674 },
  { iso: 'CAN', name: 'Canada',            aliases: ['canada'], lat: 56.1304, lon: -106.3468 },
  { iso: 'KOR', name: 'South Korea',       aliases: ['south korea', 'korea', 'republic of korea'], lat: 35.9078, lon: 127.7669 },
  { iso: 'AUS', name: 'Australia',         aliases: ['australia'], lat: -25.2744, lon: 133.7751 },
  { iso: 'ESP', name: 'Spain',             aliases: ['spain', 'españa', 'espana'], lat: 40.4637, lon: -3.7492 },
  { iso: 'MEX', name: 'Mexico',            aliases: ['mexico', 'méxico'], lat: 23.6345, lon: -102.5528 },
  { iso: 'IDN', name: 'Indonesia',         aliases: ['indonesia'], lat: -0.7893, lon: 113.9213 },
  { iso: 'TUR', name: 'Turkey',            aliases: ['turkey', 'türkiye', 'turkiye'], lat: 38.9637, lon: 35.2433 },
  { iso: 'NLD', name: 'Netherlands',       aliases: ['netherlands', 'holland'], lat: 52.1326, lon: 5.2913 },
  { iso: 'SAU', name: 'Saudi Arabia',      aliases: ['saudi arabia', 'saudi'], lat: 23.8859, lon: 45.0792 },
  { iso: 'CHE', name: 'Switzerland',       aliases: ['switzerland', 'schweiz'], lat: 46.8182, lon: 8.2275 },
  { iso: 'POL', name: 'Poland',            aliases: ['poland', 'polska'], lat: 51.9194, lon: 19.1451 },
  { iso: 'SWE', name: 'Sweden',            aliases: ['sweden', 'sverige'], lat: 60.1282, lon: 18.6435 },
  { iso: 'BEL', name: 'Belgium',           aliases: ['belgium'], lat: 50.5039, lon: 4.4699 },
  { iso: 'ARG', name: 'Argentina',         aliases: ['argentina'], lat: -38.4161, lon: -63.6167 },
  { iso: 'NOR', name: 'Norway',            aliases: ['norway', 'norge'], lat: 60.4720, lon: 8.4689 },
  { iso: 'AUT', name: 'Austria',           aliases: ['austria', 'österreich'], lat: 47.5162, lon: 14.5501 },
  { iso: 'IRL', name: 'Ireland',           aliases: ['ireland', 'eire'], lat: 53.1424, lon: -7.6921 },
  { iso: 'ISR', name: 'Israel',            aliases: ['israel'], lat: 31.0461, lon: 34.8516 },
  { iso: 'MYS', name: 'Malaysia',          aliases: ['malaysia'], lat: 4.2105, lon: 101.9758 },
  { iso: 'DNK', name: 'Denmark',           aliases: ['denmark', 'danmark'], lat: 56.2639, lon: 9.5018 },
  { iso: 'PHL', name: 'Philippines',       aliases: ['philippines', 'filipinas'], lat: 12.8797, lon: 121.7740 },
  { iso: 'FIN', name: 'Finland',           aliases: ['finland', 'suomi'], lat: 61.9241, lon: 25.7482 },
  { iso: 'CHL', name: 'Chile',             aliases: ['chile'], lat: -35.6751, lon: -71.5430 },
  { iso: 'EGY', name: 'Egypt',             aliases: ['egypt'], lat: 26.8206, lon: 30.8025 },
  { iso: 'ZAF', name: 'South Africa',      aliases: ['south africa'], lat: -30.5595, lon: 22.9375 },
  { iso: 'NZL', name: 'New Zealand',       aliases: ['new zealand', 'aotearoa'], lat: -40.9006, lon: 174.8860 },
  { iso: 'GRC', name: 'Greece',            aliases: ['greece', 'hellas'], lat: 39.0742, lon: 21.8243 },
  { iso: 'PRT', name: 'Portugal',          aliases: ['portugal'], lat: 39.3999, lon: -8.2245 },
  { iso: 'VNM', name: 'Vietnam',           aliases: ['vietnam', 'viet nam'], lat: 14.0583, lon: 108.2772 },
  { iso: 'THA', name: 'Thailand',          aliases: ['thailand'], lat: 15.8700, lon: 100.9925 },
  { iso: 'CZE', name: 'Czechia',           aliases: ['czechia', 'czech republic'], lat: 49.8175, lon: 15.4730 },
  { iso: 'ROU', name: 'Romania',           aliases: ['romania'], lat: 45.9432, lon: 24.9668 },
  { iso: 'COL', name: 'Colombia',          aliases: ['colombia'], lat: 4.5709, lon: -74.2973 },
  { iso: 'PER', name: 'Peru',              aliases: ['peru'], lat: -9.1900, lon: -75.0152 },
  { iso: 'IRN', name: 'Iran',              aliases: ['iran', 'persia'], lat: 32.4279, lon: 53.6880 },
  { iso: 'PAK', name: 'Pakistan',          aliases: ['pakistan'], lat: 30.3753, lon: 69.3451 },
  { iso: 'BGD', name: 'Bangladesh',        aliases: ['bangladesh'], lat: 23.6850, lon: 90.3563 },
  { iso: 'UKR', name: 'Ukraine',           aliases: ['ukraine'], lat: 48.3794, lon: 31.1656 },
  { iso: 'HUN', name: 'Hungary',           aliases: ['hungary', 'magyarorszag'], lat: 47.1625, lon: 19.5033 },
  { iso: 'ARE', name: 'United Arab Emirates', aliases: ['uae', 'united arab emirates', 'emirates'], lat: 23.4241, lon: 53.8478 },
  { iso: 'NGA', name: 'Nigeria',           aliases: ['nigeria'], lat: 9.0820, lon: 8.6753 },
  { iso: 'KEN', name: 'Kenya',             aliases: ['kenya'], lat: -0.0236, lon: 37.9062 },
];

const MAX_DIST = 20015; // km, half earth circumference
const STORAGE_KEY = 'vibeglobe-stats-v1';
const MAX_ATTEMPTS = 6;
const FONT_STACK = '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';
const GEO_URL = '/data/world-countries.geo.json';

function toRad(d: number) { return (d * Math.PI) / 180; }
function toDeg(r: number) { return (r * 180) / Math.PI; }

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function bearing(lat1: number, lon1: number, lat2: number, lon2: number) {
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

type Dir = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
function dirFromBearing(deg: number): Dir {
  const sectors: Dir[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return sectors[Math.round(deg / 45) % 8];
}

const DIR_ICON: Record<Dir, typeof ArrowUp> = {
  N: ArrowUp, NE: ArrowUpRight, E: ArrowRight, SE: ArrowDownRight,
  S: ArrowDown, SW: ArrowDownLeft, W: ArrowLeft, NW: ArrowUpLeft,
};

type Geom = { type: 'Polygon' | 'MultiPolygon'; coordinates: any };
type Feature = { id: string; properties: { name: string }; geometry: Geom };
type GeoData = { all: Feature[]; byIso: Map<string, Feature> };

function walkCoords(coords: any, visit: (lon: number, lat: number) => void) {
  if (typeof coords[0] === 'number') {
    visit(coords[0], coords[1]);
  } else {
    for (const c of coords) walkCoords(c, visit);
  }
}

function getBounds(geom: Geom) {
  let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity;
  walkCoords(geom.coordinates, (lon, lat) => {
    if (lon < minLon) minLon = lon;
    if (lon > maxLon) maxLon = lon;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  });
  return { minLon, maxLon, minLat, maxLat };
}

type Projection = (lon: number, lat: number) => [number, number];

function fitProjection(bounds: ReturnType<typeof getBounds>, w: number, h: number, pad = 12): Projection {
  const spanLon = bounds.maxLon - bounds.minLon || 1;
  const spanLat = bounds.maxLat - bounds.minLat || 1;
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const lonScale = Math.cos(toRad(centerLat));
  const effW = spanLon * lonScale;
  const scale = Math.min((w - 2 * pad) / effW, (h - 2 * pad) / spanLat);
  const offX = (w - effW * scale) / 2;
  const offY = (h - spanLat * scale) / 2;
  return (lon, lat) => [
    offX + (lon - bounds.minLon) * lonScale * scale,
    offY + (bounds.maxLat - lat) * scale,
  ];
}

function worldProjection(w: number, h: number): Projection {
  const minLon = -180, maxLon = 180, minLat = -60, maxLat = 85;
  const sx = w / (maxLon - minLon);
  const sy = h / (maxLat - minLat);
  return (lon, lat) => [(lon - minLon) * sx, (maxLat - lat) * sy];
}

function ringToPath(ring: number[][], projection: Projection) {
  let out = '';
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = projection(ring[i][0], ring[i][1]);
    out += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  }
  return out + 'Z';
}

function geometryToPath(geom: Geom, projection: Projection) {
  if (geom.type === 'Polygon') {
    return (geom.coordinates as number[][][]).map((r) => ringToPath(r, projection)).join('');
  }
  if (geom.type === 'MultiPolygon') {
    return (geom.coordinates as number[][][][])
      .map((poly) => poly.map((r) => ringToPath(r, projection)).join(''))
      .join('');
  }
  return '';
}

type Guess = { iso: string; name: string; dist: number; deg: number; proximity: number; correct: boolean };

export default function VibeGlobe() {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [target, setTarget] = useState<Country | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [input, setInput] = useState('');
  const [autoIdx, setAutoIdx] = useState(0);
  const [showAuto, setShowAuto] = useState(false);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [mastery, setMastery] = useState(0);
  const [glitch, setGlitch] = useState(false);
  const [flashErr, setFlashErr] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (typeof s.mastery === 'number') setMastery(s.mastery);
      }
    } catch {}

    let aborted = false;
    fetch(GEO_URL)
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed');
        return r.json();
      })
      .then((data: { features: Feature[] }) => {
        if (aborted) return;
        const byIso = new Map<string, Feature>();
        for (const f of data.features) byIso.set(f.id, f);
        setGeoData({ all: data.features, byIso });
        pickTarget(byIso);
      })
      .catch((e) => {
        if (!aborted) setLoadError(String(e));
      });
    return () => {
      aborted = true;
    };
  }, []);

  function pickTarget(byIso: Map<string, Feature>) {
    const available = COUNTRIES.filter((c) => byIso.has(c.iso));
    if (!available.length) {
      setLoadError('No matching countries');
      return;
    }
    const pick = available[Math.floor(Math.random() * available.length)];
    setTarget(pick);
    setGuesses([]);
    setWon(false);
    setLost(false);
    setInput('');
    setShowAuto(false);
    setGlitch(false);
  }

  function newGame() {
    if (geoData) pickTarget(geoData.byIso);
  }

  function findCountry(q: string): Country | null {
    const s = q.trim().toLowerCase();
    if (!s) return null;
    return (
      COUNTRIES.find((c) => c.name.toLowerCase() === s) ||
      COUNTRIES.find((c) => c.aliases.includes(s)) ||
      null
    );
  }

  const suggestions = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    const used = new Set(guesses.map((g) => g.iso));
    const starts: Country[] = [];
    const contains: Country[] = [];
    for (const c of COUNTRIES) {
      if (used.has(c.iso)) continue;
      const nameL = c.name.toLowerCase();
      if (nameL.startsWith(q) || c.aliases.some((a) => a.startsWith(q))) starts.push(c);
      else if (nameL.includes(q)) contains.push(c);
    }
    return [...starts, ...contains].slice(0, 6);
  }, [input, guesses]);

  function submit(countryOverride?: Country) {
    if (won || lost || !target) return;
    const country = countryOverride ?? findCountry(input) ?? suggestions[0];
    if (!country) {
      setFlashErr(true);
      setTimeout(() => setFlashErr(false), 400);
      return;
    }
    if (guesses.some((g) => g.iso === country.iso)) {
      setFlashErr(true);
      setTimeout(() => setFlashErr(false), 400);
      return;
    }
    const dist = haversine(country.lat, country.lon, target.lat, target.lon);
    const deg = bearing(country.lat, country.lon, target.lat, target.lon);
    const proximity = Math.max(0, Math.min(100, (1 - dist / MAX_DIST) * 100));
    const correct = country.iso === target.iso;
    const guess: Guess = { iso: country.iso, name: country.name, dist, deg, proximity, correct };
    const next = [...guesses, guess];
    setGuesses(next);
    setInput('');
    setShowAuto(false);
    if (correct) {
      setWon(true);
      setMastery((m) => {
        const n = m + 1;
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ mastery: n })); } catch {}
        return n;
      });
    } else {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 500);
      if (next.length >= MAX_ATTEMPTS) setLost(true);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setAutoIdx((i) => Math.min(suggestions.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setAutoIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length && showAuto) submit(suggestions[Math.min(autoIdx, suggestions.length - 1)]);
      else submit();
    } else if (e.key === 'Escape') {
      setShowAuto(false);
    }
  }

  const silhouettePath = useMemo(() => {
    if (!target || !geoData) return '';
    const f = geoData.byIso.get(target.iso);
    if (!f) return '';
    const bounds = getBounds(f.geometry);
    const proj = fitProjection(bounds, 300, 180, 16);
    return geometryToPath(f.geometry, proj);
  }, [target, geoData]);

  const worldData = useMemo(() => {
    if (!geoData) return { paths: [] as Array<{ id: string; d: string; fill: string; stroke: string }> };
    const proj = worldProjection(480, 220);
    const guessedIsos = new Set(guesses.map((g) => g.iso));
    return {
      paths: geoData.all.map((f) => {
        const isTarget = target && f.id === target.iso;
        const isGuessed = guessedIsos.has(f.id);
        const reveal = isTarget && (won || lost);
        let fill = 'rgba(100,116,139,0.20)';
        let stroke = 'rgba(163,230,53,0.12)';
        if (reveal) {
          fill = '#a3e635';
          stroke = '#ecfccb';
        } else if (isGuessed) {
          fill = '#ef4444';
          stroke = '#fecaca';
        }
        return { id: f.id, d: geometryToPath(f.geometry, proj), fill, stroke };
      }),
    };
  }, [geoData, guesses, target, won, lost]);

  const loading = !geoData && !loadError;
  const attemptsLeft = MAX_ATTEMPTS - guesses.length;

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border border-lime-500/20"
      style={{
        background: '#121212',
        color: '#e5e5e5',
        minHeight: 860,
        fontFamily: FONT_STACK,
      }}
    >
      <style>{`
        @keyframes vg-glitch {
          0%   { transform: translate(0); filter: hue-rotate(0deg) saturate(1); }
          15%  { transform: translate(-4px, 1px); filter: hue-rotate(45deg) saturate(1.4); }
          30%  { transform: translate(4px, -2px); filter: hue-rotate(-30deg) saturate(1.2); }
          45%  { transform: translate(-2px, 2px); filter: hue-rotate(60deg) saturate(1.5); }
          60%  { transform: translate(3px, -1px); filter: hue-rotate(-45deg) saturate(1.3); }
          75%  { transform: translate(-1px, 1px); filter: hue-rotate(20deg) saturate(1.1); }
          100% { transform: translate(0); filter: hue-rotate(0deg) saturate(1); }
        }
        .vg-glitch { animation: vg-glitch 0.5s steps(6, end); }
        .vg-scanlines::before {
          content: '';
          position: absolute; inset: 0;
          pointer-events: none;
          background-image: repeating-linear-gradient(0deg, rgba(163,230,53,0.05) 0, rgba(163,230,53,0.05) 1px, transparent 1px, transparent 3px);
        }
      `}</style>

      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(163,230,53,0.06) 0px, rgba(163,230,53,0.06) 1px, transparent 1px, transparent 3px)',
        }}
      />

      <div className="relative flex items-center justify-between px-5 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <Globe2 size={14} className="text-lime-400" />
          <span className="text-xs uppercase tracking-[0.3em] text-lime-400/80">VibeGlobe</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="text-lime-300/70">
            ATTEMPTS <span className="text-lime-200">{attemptsLeft}</span>/{MAX_ATTEMPTS}
          </div>
          <div className="text-lime-300/70">
            MASTERY <span className="tabular-nums text-lime-200">{mastery}</span>
          </div>
        </div>
      </div>

      {/* Silhouette panel */}
      <div className="relative flex justify-center px-4 py-4">
        <div
          className="relative flex items-center justify-center rounded border border-lime-500/30 bg-black/50"
          style={{ width: 320, height: 200 }}
        >
          <div className="absolute left-2 top-1 text-[10px] uppercase tracking-[0.35em] text-lime-500/60">
            Target silhouette
          </div>
          {loading && (
            <div className="text-xs text-lime-300/60">LOADING GEO-DATA…</div>
          )}
          {loadError && (
            <div className="px-3 text-center text-[11px] text-rose-300/80">
              GEO-DATA UNAVAILABLE<br />({loadError})
            </div>
          )}
          {!loading && !loadError && silhouettePath && (
            <svg
              width="300"
              height="180"
              viewBox="0 0 300 180"
              className={glitch ? 'vg-glitch' : ''}
              style={{ filter: 'drop-shadow(0 0 12px #a3e635) drop-shadow(0 0 24px #65a30d)' }}
            >
              <path
                d={silhouettePath}
                fill={won ? '#a3e635' : '#a3e635'}
                fillOpacity={won ? 0.95 : 0.85}
                stroke="#ecfccb"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <div className="absolute bottom-1 right-2 text-[10px] uppercase tracking-[0.35em] text-lime-500/60">
            {won ? `// ${target?.name}` : lost ? `// ${target?.name}` : '// UNKNOWN'}
          </div>
        </div>
      </div>

      {/* Input + autocomplete */}
      <div className="relative flex justify-center px-4 pt-1 pb-3">
        <div className="relative w-full max-w-md">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setShowAuto(true);
                setAutoIdx(0);
              }}
              onFocus={() => setShowAuto(true)}
              onBlur={() => setTimeout(() => setShowAuto(false), 120)}
              onKeyDown={onKeyDown}
              disabled={won || lost || loading || !!loadError}
              placeholder={won || lost ? 'Round complete — start a new game' : 'Enter country…'}
              className={`flex-1 rounded border bg-black/70 px-3 py-2 text-sm text-lime-100 placeholder:text-lime-500/40 focus:outline-none ${
                flashErr ? 'border-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.6)]' : 'border-lime-500/40 focus:border-lime-400'
              }`}
              style={{ fontFamily: FONT_STACK }}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              onClick={() => submit()}
              disabled={won || lost || loading || !!loadError}
              className="flex items-center gap-1 rounded border border-lime-500/40 bg-lime-500/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-lime-200 hover:border-lime-400 hover:bg-lime-500/20 disabled:opacity-40"
            >
              <Target size={14} /> Fire
            </button>
          </div>

          {showAuto && suggestions.length > 0 && !won && !lost && (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded border border-lime-500/30 bg-black/95 shadow-[0_0_20px_rgba(163,230,53,0.25)]">
              {suggestions.map((c, i) => (
                <button
                  key={c.iso}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    submit(c);
                  }}
                  onMouseEnter={() => setAutoIdx(i)}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-sm ${
                    i === autoIdx ? 'bg-lime-500/15 text-lime-100' : 'text-lime-300/80 hover:bg-lime-500/10'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] tracking-[0.3em] text-lime-500/60">{c.iso}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Guess rows */}
      <div className="relative flex flex-col gap-1 px-4 py-2">
        {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => {
          const g = guesses[i];
          if (!g) {
            return (
              <div
                key={i}
                className="flex h-9 items-center justify-between rounded border border-dashed border-lime-500/15 bg-black/30 px-3 text-[11px] uppercase tracking-[0.3em] text-lime-500/30"
              >
                <span>— slot {i + 1} —</span>
              </div>
            );
          }
          const dir = dirFromBearing(g.deg);
          const Icon = DIR_ICON[dir];
          const prox = g.proximity;
          const barColor = g.correct
            ? '#a3e635'
            : prox > 66
            ? '#bef264'
            : prox > 33
            ? '#facc15'
            : '#ef4444';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex h-9 items-center gap-3 rounded border px-3 text-xs ${
                g.correct
                  ? 'border-lime-400 bg-lime-500/15 text-lime-100 shadow-[0_0_14px_rgba(163,230,53,0.45)]'
                  : 'border-rose-500/40 bg-rose-500/5 text-rose-100'
              }`}
            >
              <div className="w-[120px] truncate uppercase tracking-[0.15em]">{g.name}</div>
              <div className="w-[88px] tabular-nums text-right text-[11px]">
                {g.correct ? '0 KM' : `${Math.round(g.dist).toLocaleString()} KM`}
              </div>
              <div className={`flex w-[22px] items-center justify-center ${g.correct ? 'text-lime-200' : 'text-rose-300'}`}>
                {g.correct ? <Zap size={14} /> : <Icon size={14} />}
              </div>
              <div className="relative flex-1 overflow-hidden rounded-sm border border-lime-500/10 bg-black/60">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${prox}%`,
                    background: `linear-gradient(90deg, ${barColor}00, ${barColor})`,
                    boxShadow: `0 0 8px ${barColor}`,
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-[10px] tabular-nums tracking-[0.2em] text-lime-100/80">
                  {prox.toFixed(0)}%
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* World map */}
      <div className="relative flex justify-center px-4 pt-2 pb-4">
        <div className="w-full max-w-[520px] rounded border border-lime-500/20 bg-black/40 p-2">
          <div className="mb-1 flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.3em] text-lime-500/60">
            <span>// Vibe map</span>
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-rose-500" />GUESSED
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-sm bg-lime-400 shadow-[0_0_6px_#a3e635]" />TARGET
              </span>
            </span>
          </div>
          <svg viewBox="0 0 480 220" width="100%" height="auto">
            <rect x="0" y="0" width="480" height="220" fill="#0a0a0a" />
            {worldData.paths.map((p) => (
              <path
                key={p.id}
                d={p.d}
                fill={p.fill}
                stroke={p.stroke}
                strokeWidth={0.4}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Controls */}
      <div className="relative flex items-center justify-center gap-3 pb-6">
        <button
          onClick={newGame}
          disabled={loading || !!loadError}
          className="flex items-center gap-1.5 rounded border border-lime-500/40 bg-black/70 px-3 py-1.5 text-xs uppercase tracking-widest text-lime-200 hover:border-lime-400 hover:shadow-[0_0_10px_rgba(163,230,53,0.4)] disabled:opacity-40"
        >
          <RefreshCw size={14} /> New Country
        </button>
      </div>

      {/* Win/Lose modal */}
      <AnimatePresence>
        {(won || lost) && target && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`mx-4 w-full max-w-sm rounded-lg border p-6 text-center ${
                won
                  ? 'border-lime-400 bg-black shadow-[0_0_30px_rgba(163,230,53,0.6)]'
                  : 'border-rose-500/70 bg-black shadow-[0_0_30px_rgba(239,68,68,0.5)]'
              }`}
            >
              {won ? (
                <Trophy size={36} className="mx-auto mb-2 text-lime-300" />
              ) : (
                <Target size={36} className="mx-auto mb-2 text-rose-400" />
              )}
              <div className={`mb-1 text-xs uppercase tracking-[0.3em] ${won ? 'text-lime-400' : 'text-rose-400'}`}>
                {won ? 'Target Acquired' : 'Mission Failed'}
              </div>
              <div className={`mb-1 text-2xl font-bold ${won ? 'text-lime-100' : 'text-rose-100'}`}>
                {target.name}
              </div>
              <div className="mb-4 text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                {won ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'attempt' : 'attempts'}` : `After ${MAX_ATTEMPTS} attempts`}
              </div>
              <button
                onClick={newGame}
                className={`w-full rounded border px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                  won
                    ? 'border-lime-400 bg-lime-500/10 text-lime-200 hover:bg-lime-500/20'
                    : 'border-rose-400 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20'
                }`}
              >
                Next Country →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

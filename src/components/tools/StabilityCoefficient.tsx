import React, { useEffect, useMemo, useState } from 'react';
import { Activity } from 'lucide-react';

const STORAGE = 'stability-coeff-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_CYAN = '#22d3ee';
const COLOR_MAGENTA = '#f472b6';
const COLOR_GOLD = '#facc15';
const COLOR_GREEN = '#4ade80';

interface State { rentRoommate: string; rentAlone: string; conflictEvents: string; monthlyIncome: string; }
const DEFAULT_STATE: State = { rentRoommate: '700', rentAlone: '1400', conflictEvents: '4', monthlyIncome: '3200' };

function parseNum(s: string): number {
  const n = parseFloat(s.replace(/[,$\s%]/g, ''));
  return Number.isFinite(n) ? n : 0;
}
function formatCurrency(n: number): string {
  if (!Number.isFinite(n)) return '$0';
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function StabilityCoefficient() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState(JSON.parse(raw) as State); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const calc = useMemo(() => {
    const rentRoommate = Math.max(0, parseNum(state.rentRoommate));
    const rentAlone = Math.max(0, parseNum(state.rentAlone));
    const conflictEvents = Math.max(0, parseNum(state.conflictEvents));
    const monthlyIncome = Math.max(0.01, parseNum(state.monthlyIncome));
    const premium = rentAlone - rentRoommate;
    const peacefulDays = Math.max(0, 30 - conflictEvents);
    const costPerPeacefulDay = peacefulDays > 0 ? premium / peacefulDays : premium;
    const conflictCostAvoided = conflictEvents * (premium / Math.max(1, conflictEvents));
    const laborPctForPeace = (premium / monthlyIncome) * 100;
    const daysOfLaborForPeace = (premium / (monthlyIncome / 30));
    return { rentRoommate, rentAlone, conflictEvents, monthlyIncome, premium, peacefulDays, costPerPeacefulDay, conflictCostAvoided, laborPctForPeace, daysOfLaborForPeace };
  }, [state]);

  const bandColor = calc.laborPctForPeace < 10 ? COLOR_GREEN : calc.laborPctForPeace < 20 ? COLOR_GOLD : COLOR_MAGENTA;
  const slideX = Math.min(100, Math.max(0, calc.laborPctForPeace * 2));

  return (
    <div style={wrap}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Activity size={22} color={COLOR_CYAN} />
          <div>
            <div style={title}>STABILITY_COEFFICIENT</div>
            <div style={subtitle}>Cost of solitude — rent premium for mental silence</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <InputCell label="Rent with roommate" value={state.rentRoommate} onChange={(v) => setState({ ...state, rentRoommate: v })} prefix="$" />
        <InputCell label="Rent alone" value={state.rentAlone} onChange={(v) => setState({ ...state, rentAlone: v })} prefix="$" />
        <InputCell label="Conflicts / month" value={state.conflictEvents} onChange={(v) => setState({ ...state, conflictEvents: v })} />
        <InputCell label="Monthly income" value={state.monthlyIncome} onChange={(v) => setState({ ...state, monthlyIncome: v })} prefix="$" />
      </div>

      <div style={{ ...panel, padding: 20, marginBottom: 14, textAlign: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM }}>SANITY PREMIUM / MONTH</div>
        <div style={{ fontSize: 44, fontWeight: 700, color: bandColor }}>{formatCurrency(calc.premium)}</div>
        <div style={{ fontSize: 12, color: COLOR_DIM, marginTop: 4 }}>
          = <span style={{ color: bandColor, fontWeight: 700 }}>{calc.laborPctForPeace.toFixed(1)}%</span> of labor · {calc.daysOfLaborForPeace.toFixed(1)} days/month working for silence
        </div>
      </div>

      <div style={{ ...panel, padding: 16, marginBottom: 14 }}>
        <div style={{ fontSize: 11, letterSpacing: '.16em', color: COLOR_DIM, marginBottom: 10 }}>PEACE ← → CAPITAL</div>
        <svg viewBox="0 0 400 100" width="100%" height="100">
          <defs>
            <linearGradient id="scGrad" x1="0" x2="1">
              <stop offset="0%" stopColor={COLOR_GREEN} />
              <stop offset="50%" stopColor={COLOR_GOLD} />
              <stop offset="100%" stopColor={COLOR_MAGENTA} />
            </linearGradient>
          </defs>
          <rect x="10" y="38" width="380" height="12" rx="6" fill="url(#scGrad)" opacity="0.4" />
          <rect x="10" y="38" width={380 * (slideX / 100)} height="12" rx="6" fill="url(#scGrad)" style={{ transition: 'width 320ms ease' }} />
          <circle cx={10 + (slideX / 100) * 380} cy="44" r="12" fill={bandColor} stroke={COLOR_BG} strokeWidth="3" style={{ transition: 'cx 320ms ease' }} />
          <text x="10" y="78" fill={COLOR_GREEN} fontSize="11" fontWeight="700" fontFamily="inherit">CHEAP PEACE</text>
          <text x="390" y="78" textAnchor="end" fill={COLOR_MAGENTA} fontSize="11" fontWeight="700" fontFamily="inherit">EXPENSIVE PEACE</text>
          <text x="200" y="26" textAnchor="middle" fill={bandColor} fontSize="18" fontWeight="700" fontFamily="inherit">{calc.laborPctForPeace.toFixed(1)}%</text>
          <text x="200" y="96" textAnchor="middle" fill={COLOR_DIM} fontSize="10" fontFamily="inherit">10% green · 20% amber · more = magenta</text>
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 14 }}>
        <Metric label="Peaceful days (est)" value={`${calc.peacefulDays}/30`} color={COLOR_GREEN} />
        <Metric label="Cost / peaceful day" value={formatCurrency(calc.costPerPeacefulDay)} color={COLOR_GOLD} />
        <Metric label="Annual premium" value={formatCurrency(calc.premium * 12)} color={COLOR_MAGENTA} />
        <Metric label="Labor days / month" value={calc.daysOfLaborForPeace.toFixed(1)} color={bandColor} />
      </div>

      <div style={brief}>
        <div style={briefHeader}>▸ METHODOLOGY</div>
        Premium = rent alone − rent with roommate. Peaceful days = 30 − monthly conflicts (roommate scenario). Cost per peaceful day = premium ÷ peaceful days. Labor % = premium ÷ monthly income × 100. Under 10% green, under 20% amber, above = magenta.
      </div>
    </div>
  );
}

function InputCell({ label, value, onChange, prefix }: { label: string; value: string; onChange: (v: string) => void; prefix?: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {prefix && <span style={{ color: COLOR_DIM, fontSize: 13 }}>{prefix}</span>}
        <input inputMode="decimal" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
      </div>
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ ...panel, padding: 10 }}>
      <div style={{ fontSize: 10, letterSpacing: '.14em', color: COLOR_DIM }}>{label}</div>
      <div style={{ fontSize: 18, color, fontWeight: 700, marginTop: 4 }}>{value}</div>
    </div>
  );
}

const wrap: React.CSSProperties = { padding: 24, background: COLOR_BG, color: COLOR_TEXT, fontFamily: '"JetBrains Mono", ui-monospace, monospace', minHeight: '100%' };
const header: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 };
const title: React.CSSProperties = { fontSize: 18, fontWeight: 700, letterSpacing: '.08em' };
const subtitle: React.CSSProperties = { fontSize: 12, color: COLOR_DIM };
const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, borderRadius: 8 };
const inputStyle: React.CSSProperties = { width: '100%', padding: '6px 8px', background: COLOR_BG, border: `1px solid ${COLOR_BORDER}`, borderRadius: 4, color: COLOR_TEXT, fontFamily: 'inherit', fontSize: 14, outline: 'none' };
const brief: React.CSSProperties = { fontSize: 11, color: COLOR_DIM, lineHeight: 1.6 };
const briefHeader: React.CSSProperties = { color: COLOR_TEXT, fontWeight: 700, letterSpacing: '.08em', marginBottom: 4 };

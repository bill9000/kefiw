import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Shield } from 'lucide-react';

const STORAGE = 'medical-triage-v1';
const COLOR_BG = '#0b1120';
const COLOR_PANEL = '#0f172a';
const COLOR_BORDER = '#1e293b';
const COLOR_TEXT = '#e2e8f0';
const COLOR_DIM = '#64748b';
const COLOR_GREEN = '#4ade80';
const COLOR_GOLD = '#facc15';
const COLOR_RED = '#ef4444';
const COLOR_CYAN = '#22d3ee';

type SymptomId =
  | 'chest-pain'
  | 'breathing'
  | 'head-injury'
  | 'abdominal-pain'
  | 'fever'
  | 'bleeding'
  | 'trauma'
  | 'gastro'
  | 'general';

interface Symptom {
  id: SymptomId;
  label: string;
}

const SYMPTOMS: Symptom[] = [
  { id: 'chest-pain', label: 'Chest pain' },
  { id: 'breathing', label: 'Breathing difficulty' },
  { id: 'head-injury', label: 'Head injury' },
  { id: 'abdominal-pain', label: 'Abdominal pain' },
  { id: 'fever', label: 'Fever' },
  { id: 'bleeding', label: 'Bleeding' },
  { id: 'trauma', label: 'Injury / trauma' },
  { id: 'gastro', label: 'Vomiting / diarrhea' },
  { id: 'general', label: 'General illness' },
];

interface Flag {
  id: string;
  label: string;
  tier: 1 | 2;
}

// Red flags — tier 1 = immediate ER, tier 2 = urgent care
const UNIVERSAL_FLAGS: Flag[] = [
  { id: 'unresponsive', label: 'Unconscious, unresponsive, or cannot be woken', tier: 1 },
  { id: 'stroke-signs', label: 'Face drooping, arm weakness, or slurred speech (FAST)', tier: 1 },
  { id: 'uncontrolled-bleeding', label: 'Uncontrolled bleeding (direct pressure for 10 min not stopping it)', tier: 1 },
  { id: 'blue-lips', label: 'Blue lips, fingertips, or skin (cyanosis)', tier: 1 },
  { id: 'confusion-new', label: 'New confusion or disorientation', tier: 1 },
  { id: 'suicidal', label: 'Active thoughts of self-harm or suicide', tier: 1 },
];

const SYMPTOM_FLAGS: Record<SymptomId, Flag[]> = {
  'chest-pain': [
    { id: 'radiating', label: 'Pain radiating to jaw, arm, neck, or back', tier: 1 },
    { id: 'sweating', label: 'Accompanied by sweating, nausea, or shortness of breath', tier: 1 },
    { id: 'tearing', label: 'Sudden "tearing" or "ripping" sensation', tier: 1 },
    { id: 'exertion', label: 'Triggered by exertion, relieved by rest', tier: 2 },
  ],
  breathing: [
    { id: 'severe-sob', label: 'Cannot speak a full sentence without gasping', tier: 1 },
    { id: 'wheezing-severe', label: 'Severe wheezing unresponsive to usual inhaler', tier: 1 },
    { id: 'leg-swelling', label: 'With sudden leg swelling or calf pain', tier: 1 },
    { id: 'mild-sob-exertion', label: 'Only during heavy exertion', tier: 2 },
  ],
  'head-injury': [
    { id: 'loss-consciousness', label: 'Loss of consciousness (any duration)', tier: 1 },
    { id: 'vomiting', label: 'Repeated vomiting after the injury', tier: 1 },
    { id: 'seizure', label: 'Seizure after the injury', tier: 1 },
    { id: 'worsening-headache', label: 'Headache that keeps worsening over hours', tier: 2 },
    { id: 'blood-thinner', label: 'Patient is on blood thinners', tier: 1 },
  ],
  'abdominal-pain': [
    { id: 'severe-sudden', label: 'Severe sudden-onset pain (sharpest ever felt)', tier: 1 },
    { id: 'rigid', label: 'Abdomen feels rigid or board-like to touch', tier: 1 },
    { id: 'blood-stool-vomit', label: 'Blood in stool or vomit', tier: 1 },
    { id: 'pregnant', label: 'Currently pregnant', tier: 1 },
    { id: 'persistent-mild', label: 'Dull and present >48h but not worsening', tier: 2 },
  ],
  fever: [
    { id: 'very-high', label: 'Temperature >104°F (40°C) not responding to medication', tier: 1 },
    { id: 'infant', label: 'Infant under 3 months with any fever', tier: 1 },
    { id: 'stiff-neck', label: 'With stiff neck, severe headache, or light sensitivity', tier: 1 },
    { id: 'immunocompromised', label: 'Immunocompromised or chemotherapy patient', tier: 1 },
    { id: 'persistent-3day', label: 'Fever >3 days with no improvement', tier: 2 },
  ],
  bleeding: [
    { id: 'spurting', label: 'Pulsing or spurting blood (arterial)', tier: 1 },
    { id: 'large-wound', label: 'Deep cut >½ inch or with visible fat/muscle/bone', tier: 1 },
    { id: 'embedded-object', label: 'Embedded object still in the wound', tier: 1 },
    { id: 'minor-oozing', label: 'Small, controlled with pressure in under 10 min', tier: 2 },
  ],
  trauma: [
    { id: 'suspected-fracture', label: 'Bone visibly deformed or limb unusable', tier: 1 },
    { id: 'fall-height', label: 'Fall >10 ft (adult) or >5 ft (child)', tier: 1 },
    { id: 'mva-high-speed', label: 'Motor vehicle crash with any impact', tier: 1 },
    { id: 'mild-sprain', label: 'Mild sprain or bruise, full range of motion', tier: 2 },
  ],
  gastro: [
    { id: 'dehydration-signs', label: 'Dark urine, dizziness, or not urinating >8 h', tier: 1 },
    { id: 'blood-present', label: 'Visible blood in vomit or stool', tier: 1 },
    { id: 'inability-hold-fluids', label: 'Cannot keep sips of water down for >24h', tier: 2 },
    { id: 'mild-24h', label: 'Under 24 h, able to sip fluids', tier: 2 },
  ],
  general: [
    { id: 'severe-pain', label: 'Pain rated 8+/10', tier: 2 },
    { id: 'lasting-week', label: 'Symptoms lasting >1 week with no improvement', tier: 2 },
  ],
};

interface State {
  symptom: SymptomId | '';
  selectedFlags: string[];
}

const DEFAULT_STATE: State = { symptom: '', selectedFlags: [] };

export default function MedicalTriage() {
  const [state, setState] = useState<State>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE); if (raw) setState({ ...DEFAULT_STATE, ...(JSON.parse(raw) as State) }); } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE, JSON.stringify(state)); }, [state, hydrated]);

  const symptomFlags: Flag[] = state.symptom ? SYMPTOM_FLAGS[state.symptom as SymptomId] ?? [] : [];
  const allFlags: Flag[] = [...UNIVERSAL_FLAGS, ...symptomFlags];

  const tier: 1 | 2 | 3 | 0 = useMemo(() => {
    if (!state.symptom) return 0;
    const selected = allFlags.filter((f) => state.selectedFlags.includes(f.id));
    if (selected.some((f) => f.tier === 1)) return 1;
    if (selected.some((f) => f.tier === 2)) return 2;
    return 3;
  }, [state, allFlags]);

  function toggleFlag(id: string) {
    setState((s) =>
      s.selectedFlags.includes(id)
        ? { ...s, selectedFlags: s.selectedFlags.filter((f) => f !== id) }
        : { ...s, selectedFlags: [...s.selectedFlags, id] },
    );
  }

  function reset() {
    setState(DEFAULT_STATE);
  }

  const tierMeta: Record<1 | 2 | 3, { label: string; color: string; action: string; sub: string; pulse: boolean }> = {
    1: {
      label: 'Level 1 · Immediate Emergency',
      color: COLOR_RED,
      action: 'Call emergency services (911 / 999 / 112) or go to the nearest ER now.',
      sub: 'Do not drive yourself if symptoms are severe.',
      pulse: true,
    },
    2: {
      label: 'Level 2 · Urgent Care',
      color: COLOR_GOLD,
      action: 'Seek urgent care or a same-day clinic appointment within 24 hours.',
      sub: 'Worsening symptoms → escalate to Level 1.',
      pulse: false,
    },
    3: {
      label: 'Level 3 · Home Maintenance',
      color: COLOR_GREEN,
      action: 'Home care and OTC treatment are reasonable starting points.',
      sub: 'Book routine appointment if symptoms persist beyond typical window.',
      pulse: false,
    },
  };

  const shell: React.CSSProperties = { background: COLOR_BG, color: COLOR_TEXT, padding: '1.5rem', borderRadius: 12, fontFamily: '"JetBrains Mono", ui-monospace, monospace', border: `1px solid ${COLOR_BORDER}` };
  const panel: React.CSSProperties = { background: COLOR_PANEL, border: `1px solid ${COLOR_BORDER}`, padding: '1rem', borderRadius: 8 };

  return (
    <div style={shell}>
      <style>{`@keyframes tri-pulse { 0%,100% { box-shadow: 0 0 0 0 ${COLOR_RED}77, 0 0 24px ${COLOR_RED}33 inset; } 50% { box-shadow: 0 0 0 6px ${COLOR_RED}00, 0 0 36px ${COLOR_RED}66 inset; } }`}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
        <Shield size={18} color={COLOR_CYAN} />
        <div style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM }}>
          Medical Triage · Red-Flag Logic
        </div>
      </div>

      <div style={{ background: '#1f1017', border: `1px solid ${COLOR_RED}55`, color: '#fca5a5', padding: '0.65rem 0.9rem', borderRadius: 6, fontSize: 11, marginBottom: '1rem', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <AlertTriangle size={14} style={{ flex: '0 0 auto', marginTop: 2 }} />
        <div>
          Not medical advice. Educational red-flag triage. If in doubt, call emergency services. If symptoms feel life-threatening, do not wait for this tool.
        </div>
      </div>

      <div style={{ ...panel, marginBottom: '1rem' }}>
        <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM, marginBottom: 8 }}>Step 1 · Primary symptom</div>
        <div style={{ display: 'grid', gap: '0.4rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
          {SYMPTOMS.map((s) => (
            <button
              key={s.id}
              onClick={() => setState({ symptom: s.id, selectedFlags: [] })}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                border: `1px solid ${state.symptom === s.id ? COLOR_CYAN : COLOR_BORDER}`,
                background: state.symptom === s.id ? '#0b3a44' : '#0b1120',
                color: state.symptom === s.id ? COLOR_CYAN : COLOR_TEXT,
                fontFamily: 'inherit',
                fontSize: 12,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {state.symptom && (
        <div style={{ ...panel, marginBottom: '1rem' }}>
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM, marginBottom: 8 }}>Step 2 · Red flags (check all that apply)</div>
          <div style={{ display: 'grid', gap: '0.3rem' }}>
            {allFlags.map((f) => {
              const on = state.selectedFlags.includes(f.id);
              return (
                <label
                  key={f.id}
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                    padding: '0.5rem 0.65rem',
                    border: `1px solid ${on ? (f.tier === 1 ? COLOR_RED : COLOR_GOLD) : COLOR_BORDER}`,
                    borderRadius: 6,
                    background: on ? (f.tier === 1 ? '#1f1017' : '#1f1a08') : '#0b1120',
                    cursor: 'pointer',
                    fontSize: 12,
                  }}
                >
                  <input type="checkbox" checked={on} onChange={() => toggleFlag(f.id)} style={{ marginTop: 2 }} />
                  <div>
                    <div style={{ color: on ? (f.tier === 1 ? COLOR_RED : COLOR_GOLD) : COLOR_TEXT }}>{f.label}</div>
                    <div style={{ fontSize: 10, color: COLOR_DIM, marginTop: 2 }}>{f.tier === 1 ? 'Tier 1 · ER marker' : 'Tier 2 · urgent-care marker'}</div>
                  </div>
                </label>
              );
            })}
          </div>
          <button
            onClick={reset}
            style={{
              marginTop: 10,
              padding: '0.35rem 0.75rem',
              borderRadius: 6,
              border: `1px solid ${COLOR_BORDER}`,
              background: 'transparent',
              color: COLOR_DIM,
              fontFamily: 'inherit',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      )}

      {state.symptom && tier > 0 && (
        <div
          style={{
            ...panel,
            borderColor: tierMeta[tier as 1 | 2 | 3].color,
            animation: tierMeta[tier as 1 | 2 | 3].pulse ? 'tri-pulse 1.4s ease-in-out infinite' : 'none',
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLOR_DIM, marginBottom: 6 }}>Verdict</div>
          <div style={{ fontSize: 18, color: tierMeta[tier as 1 | 2 | 3].color, fontWeight: 700, letterSpacing: '0.03em' }}>
            {tierMeta[tier as 1 | 2 | 3].label}
          </div>
          <div style={{ fontSize: 12, color: COLOR_TEXT, marginTop: 6 }}>{tierMeta[tier as 1 | 2 | 3].action}</div>
          <div style={{ fontSize: 11, color: COLOR_DIM, marginTop: 4 }}>{tierMeta[tier as 1 | 2 | 3].sub}</div>
        </div>
      )}
    </div>
  );
}

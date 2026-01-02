/**
 * VAULT — Body Map (ported from static PWA)
 * Click a body area to cycle intent: 0 → 1 → 2 → 3 → 0 (none/mild/moderate/severe)
 * Auto-selects the corresponding body system when intent > 0.
 *
 * @vault-feature VAULT-UI-WF-001 Interactive Body Map UI
 */
import type { BodySystemId, IntentLevel } from '../../types';
import { useClaimStore, useIntentLevels, useSelectedSystems } from '../../stores/claimStore';
import { getConditionById } from '../../data/bodySystems';
import type { SelectedCondition } from '../../types';

const PART_TO_SYSTEM: Record<string, BodySystemId> = {
  head: 'mental',
  l_eye: 'vision',
  r_eye: 'vision',
  l_ear: 'auditory',
  r_ear: 'auditory',
  neck: 'musculoskeletal',
  upper_back: 'musculoskeletal',
  lower_back: 'musculoskeletal',
  chest: 'respiratory',
  stomach: 'digestive',
  l_shoulder: 'musculoskeletal',
  r_shoulder: 'musculoskeletal',
  l_hip: 'musculoskeletal',
  r_hip: 'musculoskeletal',
  l_upper_arm: 'musculoskeletal',
  r_upper_arm: 'musculoskeletal',
  l_elbow: 'musculoskeletal',
  r_elbow: 'musculoskeletal',
  l_forearm: 'musculoskeletal',
  r_forearm: 'musculoskeletal',
  l_wrist: 'musculoskeletal',
  r_wrist: 'musculoskeletal',
  l_hand: 'musculoskeletal',
  r_hand: 'musculoskeletal',
  l_thigh: 'musculoskeletal',
  r_thigh: 'musculoskeletal',
  l_knee: 'musculoskeletal',
  r_knee: 'musculoskeletal',
  l_calf: 'musculoskeletal',
  r_calf: 'musculoskeletal',
  l_ankle: 'musculoskeletal',
  r_ankle: 'musculoskeletal',
  l_foot: 'musculoskeletal',
  r_foot: 'musculoskeletal'
};

// Default “bridge” from body-map intent → a representative condition to actually add.
// This ensures body-map interaction is reflected in the “Selected Conditions” list.
// Note: we keep this conservative (mostly musculoskeletal) to avoid surprising auto-adds.
const PART_TO_DEFAULT_CONDITION_ID: Partial<Record<keyof typeof PART_TO_SYSTEM, string>> = {
  neck: 'cervical',
  upper_back: 'thoracic',
  lower_back: 'lumbar',
  l_shoulder: 'shoulder',
  r_shoulder: 'shoulder',
  l_hip: 'hip',
  r_hip: 'hip',
  l_elbow: 'elbow',
  r_elbow: 'elbow',
  l_wrist: 'wrist',
  r_wrist: 'wrist',
  l_knee: 'knee',
  r_knee: 'knee',
  l_ankle: 'ankle',
  r_ankle: 'ankle',
  l_foot: 'plantar',
  r_foot: 'plantar'
};

function cycleIntent(level: IntentLevel | undefined): IntentLevel {
  const current = level ?? 0;
  return (((current + 1) % 4) as IntentLevel);
}

function intentClass(level: IntentLevel | undefined): string {
  if (!level) return '';
  return `intent-${level}`;
}

export default function BodyMap() {
  const intentLevels = useIntentLevels() || {};
  const selectedSystems = useSelectedSystems();
  const { setIntentLevel, selectSystems, addAudit, addCondition, data, showToast } = useClaimStore();

  const count = Object.values(intentLevels).filter(v => (v ?? 0) > 0).length;

  const togglePart = (partId: string) => {
    const next = cycleIntent(intentLevels[partId]);
    setIntentLevel(partId, next);

    const sysId = PART_TO_SYSTEM[partId];
    if (sysId && next > 0 && !selectedSystems.includes(sysId)) {
      selectSystems([...selectedSystems, sysId]);
    }

    // If the user selects an intent level (>0), add a reasonable default condition
    // so the selection appears in the Selected Conditions module.
    if (next > 0) {
      const defaultConditionId = PART_TO_DEFAULT_CONDITION_ID[partId as keyof typeof PART_TO_SYSTEM];
      if (defaultConditionId) {
        const already = data.selectedConditions?.some((c) => c.id === defaultConditionId);
        if (!already) {
          const found = getConditionById(defaultConditionId);
          if (found) {
            const selected: SelectedCondition = {
              ...found,
              system: found.system as SelectedCondition['system'],
              selectedRating: undefined,
              side: undefined,
              isBilateral: false,
              notes: ''
            };
            addCondition(selected);
            showToast(`Added: ${found.name}`, 'success');
            addAudit('Body Map → Condition', `${partId} -> ${found.id}`);
          }
        }
      }
    }

    addAudit('Body Map', `${partId}:${next}`);
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-slate-400">
            Interactive Body Map <span className="text-brass">({count} areas)</span>
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Click: <span className="text-intent-mild">1× Mild</span> →{' '}
            <span className="text-intent-moderate">2× Moderate</span> →{' '}
            <span className="text-intent-severe">3× Severe</span> → 4× Reset
          </p>
        </div>
      </div>

      <div className="body-map-container mt-4">
        <svg viewBox="0 0 200 470" xmlns="http://www.w3.org/2000/svg" aria-label="Interactive body map" className="w-full h-auto">
          <defs>
            <linearGradient id="skinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(200,212,224,0.08)" />
              <stop offset="100%" stopColor="rgba(200,212,224,0.02)" />
            </linearGradient>

            {/* Anatomy underlay (from human-anatomy-main) */}
            <linearGradient id="anatomyMainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(200,212,224,0.18)" />
              <stop offset="55%" stopColor="rgba(200,212,224,0.08)" />
              <stop offset="100%" stopColor="rgba(201,162,39,0.10)" />
            </linearGradient>
            <filter id="anatomyMainShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur" />
              <feOffset dx="0" dy="1" result="off" />
              <feColorMatrix
                in="off"
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0.35 0"
                result="shadow"
              />
              <feMerge>
                <feMergeNode in="shadow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Clean human silhouette underlay (single layer, non-interactive) */}
          <g className="human-silhouette" style={{ pointerEvents: 'none' }} opacity={0.35}>
            {/* Head */}
            <ellipse cx="100" cy="30" rx="22" ry="24" fill="url(#anatomyMainGrad)" stroke="rgba(200,212,224,0.25)" strokeWidth="0.8" />
            {/* Neck */}
            <rect x="90" y="52" width="20" height="16" rx="3" fill="url(#anatomyMainGrad)" stroke="rgba(200,212,224,0.25)" strokeWidth="0.8" />
            {/* Torso */}
            <path
              d="M60 68 L140 68 L148 80 L155 130 L140 170 L130 170 L122 185 L100 195 L78 185 L70 170 L60 170 L45 130 L52 80 Z"
              fill="url(#anatomyMainGrad)"
              stroke="rgba(200,212,224,0.25)"
              strokeWidth="0.8"
            />
            {/* Left arm */}
            <path
              d="M52 80 L42 85 L30 140 L20 200 L10 235 L20 240 L28 210 L38 155 L50 130 L60 100 Z"
              fill="url(#anatomyMainGrad)"
              stroke="rgba(200,212,224,0.25)"
              strokeWidth="0.8"
            />
            {/* Right arm */}
            <path
              d="M148 80 L158 85 L170 140 L180 200 L190 235 L180 240 L172 210 L162 155 L150 130 L140 100 Z"
              fill="url(#anatomyMainGrad)"
              stroke="rgba(200,212,224,0.25)"
              strokeWidth="0.8"
            />
            {/* Left leg */}
            <path
              d="M78 185 L65 198 L55 280 L52 300 L48 385 L40 420 L30 440 L55 445 L65 425 L72 390 L78 300 L88 205 Z"
              fill="url(#anatomyMainGrad)"
              stroke="rgba(200,212,224,0.25)"
              strokeWidth="0.8"
            />
            {/* Right leg */}
            <path
              d="M122 185 L135 198 L145 280 L148 300 L152 385 L160 420 L170 440 L145 445 L135 425 L128 390 L122 300 L112 205 Z"
              fill="url(#anatomyMainGrad)"
              stroke="rgba(200,212,224,0.25)"
              strokeWidth="0.8"
            />
            {/* Left foot */}
            <ellipse cx="48" cy="440" rx="18" ry="10" fill="url(#anatomyMainGrad)" stroke="rgba(200,212,224,0.25)" strokeWidth="0.8" />
            {/* Right foot */}
            <ellipse cx="152" cy="440" rx="18" ry="10" fill="url(#anatomyMainGrad)" stroke="rgba(200,212,224,0.25)" strokeWidth="0.8" />
          </g>

          <ellipse className={`body-part ${intentClass(intentLevels.head)}`} cx="100" cy="30" rx="20" ry="22" onClick={() => togglePart('head')} />
          <ellipse className={`body-part ${intentClass(intentLevels.l_ear)}`} cx="78" cy="30" rx="4" ry="7" onClick={() => togglePart('l_ear')} />
          <ellipse className={`body-part ${intentClass(intentLevels.r_ear)}`} cx="122" cy="30" rx="4" ry="7" onClick={() => togglePart('r_ear')} />
          <circle className={`body-part ${intentClass(intentLevels.l_eye)}`} cx="92" cy="26" r="4" onClick={() => togglePart('l_eye')} />
          <circle className={`body-part ${intentClass(intentLevels.r_eye)}`} cx="108" cy="26" r="4" onClick={() => togglePart('r_eye')} />

          <rect className={`body-part ${intentClass(intentLevels.neck)}`} x="92" y="52" width="16" height="14" rx="2" onClick={() => togglePart('neck')} />

          <path className={`body-part ${intentClass(intentLevels.upper_back)}`} d="M72,67 h56 l4,45 h-64 z" onClick={() => togglePart('upper_back')} />
          <path className={`body-part ${intentClass(intentLevels.lower_back)}`} d="M68,114 h64 l6,55 h-76 z" onClick={() => togglePart('lower_back')} />
          <ellipse className={`body-part ${intentClass(intentLevels.chest)}`} cx="100" cy="92" rx="22" ry="16" onClick={() => togglePart('chest')} />
          <ellipse className={`body-part ${intentClass(intentLevels.stomach)}`} cx="100" cy="145" rx="18" ry="14" onClick={() => togglePart('stomach')} />

          <ellipse className={`body-part ${intentClass(intentLevels.l_shoulder)}`} cx="55" cy="76" rx="11" ry="9" onClick={() => togglePart('l_shoulder')} />
          <ellipse className={`body-part ${intentClass(intentLevels.r_shoulder)}`} cx="145" cy="76" rx="11" ry="9" onClick={() => togglePart('r_shoulder')} />

          <path className={`body-part ${intentClass(intentLevels.l_upper_arm)}`} d="M44,85 L35,125 L47,130 L56,92 Z" onClick={() => togglePart('l_upper_arm')} />
          <path className={`body-part ${intentClass(intentLevels.r_upper_arm)}`} d="M156,85 L165,125 L153,130 L144,92 Z" onClick={() => togglePart('r_upper_arm')} />

          <circle className={`body-part ${intentClass(intentLevels.l_elbow)}`} cx="32" cy="140" r="7" onClick={() => togglePart('l_elbow')} />
          <circle className={`body-part ${intentClass(intentLevels.r_elbow)}`} cx="168" cy="140" r="7" onClick={() => togglePart('r_elbow')} />

          <path className={`body-part ${intentClass(intentLevels.l_forearm)}`} d="M25,148 L18,195 L32,200 L38,155 Z" onClick={() => togglePart('l_forearm')} />
          <path className={`body-part ${intentClass(intentLevels.r_forearm)}`} d="M175,148 L182,195 L168,200 L162,155 Z" onClick={() => togglePart('r_forearm')} />

          <ellipse className={`body-part ${intentClass(intentLevels.l_wrist)}`} cx="16" cy="210" rx="5" ry="7" onClick={() => togglePart('l_wrist')} />
          <ellipse className={`body-part ${intentClass(intentLevels.r_wrist)}`} cx="184" cy="210" rx="5" ry="7" onClick={() => togglePart('r_wrist')} />

          <ellipse className={`body-part ${intentClass(intentLevels.l_hand)}`} cx="14" cy="232" rx="9" ry="12" onClick={() => togglePart('l_hand')} />
          <ellipse className={`body-part ${intentClass(intentLevels.r_hand)}`} cx="186" cy="232" rx="9" ry="12" onClick={() => togglePart('r_hand')} />

          <ellipse className={`body-part ${intentClass(intentLevels.l_hip)}`} cx="78" cy="185" rx="12" ry="10" onClick={() => togglePart('l_hip')} />
          <ellipse className={`body-part ${intentClass(intentLevels.r_hip)}`} cx="122" cy="185" rx="12" ry="10" onClick={() => togglePart('r_hip')} />

          <path className={`body-part ${intentClass(intentLevels.l_thigh)}`} d="M65,198 L55,280 L78,285 L88,205 Z" onClick={() => togglePart('l_thigh')} />
          <path className={`body-part ${intentClass(intentLevels.r_thigh)}`} d="M135,198 L145,280 L122,285 L112,205 Z" onClick={() => togglePart('r_thigh')} />

          <circle className={`body-part ${intentClass(intentLevels.l_knee)}`} cx="66" cy="300" r="10" onClick={() => togglePart('l_knee')} />
          <circle className={`body-part ${intentClass(intentLevels.r_knee)}`} cx="134" cy="300" r="10" onClick={() => togglePart('r_knee')} />

          <path className={`body-part ${intentClass(intentLevels.l_calf)}`} d="M56,312 L48,385 L72,390 L78,318 Z" onClick={() => togglePart('l_calf')} />
          <path className={`body-part ${intentClass(intentLevels.r_calf)}`} d="M144,312 L152,385 L128,390 L122,318 Z" onClick={() => togglePart('r_calf')} />

          <ellipse className={`body-part ${intentClass(intentLevels.l_ankle)}`} cx="58" cy="402" rx="7" ry="9" onClick={() => togglePart('l_ankle')} />
          <ellipse className={`body-part ${intentClass(intentLevels.r_ankle)}`} cx="142" cy="402" rx="7" ry="9" onClick={() => togglePart('r_ankle')} />

          <ellipse className={`body-part ${intentClass(intentLevels.l_foot)}`} cx="48" cy="430" rx="16" ry="9" onClick={() => togglePart('l_foot')} />
          <ellipse className={`body-part ${intentClass(intentLevels.r_foot)}`} cx="152" cy="430" rx="16" ry="9" onClick={() => togglePart('r_foot')} />
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="intent-dot intent-dot-1" /> <span>Mild</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="intent-dot intent-dot-2" /> <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="intent-dot intent-dot-3" /> <span>Severe</span>
        </div>
      </div>
    </div>
  );
}



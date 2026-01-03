/**
 * VAULT DEM Engine — Phase 4: Entitlement Assurance
 * Pre-certification validation with human-in-the-loop certification
 *
 * @vault-feature ASR-001 Entitlement Assurance Engine
 * @vault-patent PATENT-entitlement-assurance-system
 *
 * This component implements the Decision Support Interface specified in:
 * docs/ASR-001-entitlement-assurance-spec.md Section 6.1
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  FileText,
  Lightbulb,
  Lock,
  PenLine,
  ShieldCheck,
  TrendingUp,
  Upload,
  XCircle
} from 'lucide-react';
import { GlassCard } from '../LiquidGlass/GlassCard';
import { useClaimStore, useConditions, useIdentity } from '../../stores/claimStore';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES (from ASR-001 spec)
// ═══════════════════════════════════════════════════════════════════════════════

interface ClaimReadinessScore {
  overall: number;           // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  components: {
    evidence: number;
    nexus: number;
    forms: number;
    compliance: number;
  };
  criticalGapCount: number;
  optimizationCount: number;
  verifiedCount: number;
}

interface AssuranceFinding {
  id: string;
  type: 'critical_gap' | 'optimization' | 'verified';
  conditionName: string;
  title: string;
  description: string;
  impact?: string;
  regulation?: string;
  sources?: string[];
  actions?: {
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    handler: () => void;
  }[];
}

interface CertificationState {
  reviewed: boolean;
  certified: boolean;
  understood: boolean;
  representative: boolean;
  penalties: boolean;
  signature: string;
  signedAt?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════════════

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const expandCollapse = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA (will be replaced by actual validation engine)
// ═══════════════════════════════════════════════════════════════════════════════

const MOCK_SCORE: ClaimReadinessScore = {
  overall: 78,
  grade: 'C',
  components: {
    evidence: 82,
    nexus: 65,
    forms: 100,
    compliance: 85
  },
  criticalGapCount: 3,
  optimizationCount: 2,
  verifiedCount: 5
};

const MOCK_CRITICAL_GAPS: AssuranceFinding[] = [
  {
    id: 'gap-1',
    type: 'critical_gap',
    conditionName: 'PTSD',
    title: 'No service treatment record documentation found',
    description: 'Claims without STR documentation have 60% higher denial rate.',
    regulation: '38 CFR § 3.304(f)',
    sources: [
      'STRs_Complete.pdf (no mention of PTSD/mental health)',
      'BlueButton_2024.pdf (civilian treatment only)'
    ]
  },
  {
    id: 'gap-2',
    type: 'critical_gap',
    conditionName: 'Tinnitus',
    title: 'No audiogram in uploaded evidence',
    description: 'Audiometric testing is typically required for tinnitus claims.',
    regulation: '38 CFR § 4.85'
  },
  {
    id: 'gap-3',
    type: 'critical_gap',
    conditionName: 'Sleep Apnea',
    title: 'Missing nexus to service',
    description: 'No documentation linking sleep apnea onset to service period.',
    regulation: '38 CFR § 3.303'
  }
];

const MOCK_OPTIMIZATIONS: AssuranceFinding[] = [
  {
    id: 'opt-1',
    type: 'optimization',
    conditionName: 'Lumbar Strain',
    title: 'Evidence supports MODERATE (you selected MILD)',
    description: 'Medical evidence shows limited ROM that qualifies for higher rating.',
    impact: 'Combined rating: 62% → 66% (+$147/month)',
    regulation: '38 CFR § 4.71a DC 5237',
    sources: ['Dr_Smith_Ortho.pdf, Page 3: "Limited ROM: 45° flexion"']
  },
  {
    id: 'opt-2',
    type: 'optimization',
    conditionName: 'Bilateral Knees',
    title: 'Bilateral factor not applied',
    description: 'Both knees claimed but bilateral factor bonus not calculated.',
    impact: '+1.9% to combined rating (~$27/month)',
    regulation: '38 CFR § 4.26'
  }
];

const MOCK_VERIFIED: AssuranceFinding[] = [
  {
    id: 'ver-1',
    type: 'verified',
    conditionName: 'Hearing Loss (Bilateral)',
    title: 'DBQ complete, audiogram attached',
    description: 'All required documentation present.'
  },
  {
    id: 'ver-2',
    type: 'verified',
    conditionName: 'Migraine Headaches',
    title: 'STR dated 2019-03-15, C&P exam scheduled',
    description: 'Evidence chain complete.'
  },
  {
    id: 'ver-3',
    type: 'verified',
    conditionName: 'Left Knee Strain',
    title: 'MRI + orthopedic consult documented',
    description: 'Strong evidence package.'
  },
  {
    id: 'ver-4',
    type: 'verified',
    conditionName: 'Right Knee Strain',
    title: 'MRI + orthopedic consult documented',
    description: 'Strong evidence package.'
  },
  {
    id: 'ver-5',
    type: 'verified',
    conditionName: 'Hypertension',
    title: 'Diagnosis + medication history documented',
    description: 'Complete medical record.'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function ScoreGauge({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const gradeColor = {
    A: 'text-emerald-400',
    B: 'text-blue-400',
    C: 'text-amber-400',
    D: 'text-orange-400',
    F: 'text-red-400'
  }[grade] || 'text-slate-400';

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-slate-800/50"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#d4af37" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-100">{score}%</span>
        <span className={`text-sm font-semibold ${gradeColor}`}>Grade: {grade}</span>
      </div>
    </div>
  );
}

function ComponentScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-medium">{score}%</span>
      </div>
      <div className="h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full bg-gradient-to-r from-brass/80 to-brass rounded-full"
        />
      </div>
    </div>
  );
}

interface FindingsSectionProps {
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  count: number;
  findings: AssuranceFinding[];
  defaultExpanded?: boolean;
}

function FindingsSection({
  title,
  icon,
  iconColor,
  count,
  findings,
  defaultExpanded = false
}: FindingsSectionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <GlassCard variant="regular" size="md" padding="none" className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={iconColor}>{icon}</span>
          <span className="font-medium text-slate-200">{title}</span>
          <span className="text-sm text-slate-500">({count})</span>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={expandCollapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="border-t border-slate-800/50 p-4 space-y-4">
              {findings.map((finding) => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}

function FindingCard({ finding }: { finding: AssuranceFinding }) {
  const [expanded, setExpanded] = useState(false);

  const iconMap = {
    critical_gap: <AlertTriangle className="w-5 h-5 text-red-400" />,
    optimization: <Lightbulb className="w-5 h-5 text-amber-400" />,
    verified: <CheckCircle className="w-5 h-5 text-emerald-400" />
  };

  return (
    <div className="bg-slate-900/30 rounded-lg border border-slate-800/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        {iconMap[finding.type]}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-200">{finding.conditionName}</span>
            <span className="text-slate-500">—</span>
            <span className="text-sm text-slate-400 truncate">{finding.title}</span>
          </div>
        </div>
        <ChevronRight
          className={`w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            variants={expandCollapse}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pl-12 space-y-3">
              <p className="text-sm text-slate-400">{finding.description}</p>

              {finding.sources && finding.sources.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sources checked:</p>
                  <ul className="text-xs text-slate-400 space-y-0.5">
                    {finding.sources.map((source, i) => (
                      <li key={i}>• {source}</li>
                    ))}
                  </ul>
                </div>
              )}

              {finding.regulation && (
                <p className="text-xs text-slate-500">
                  Regulatory requirement: <span className="text-brass">{finding.regulation}</span>
                </p>
              )}

              {finding.impact && (
                <p className="text-sm text-emerald-400 font-medium">
                  Impact: {finding.impact}
                </p>
              )}

              {finding.type !== 'verified' && (
                <div className="flex gap-2 pt-2">
                  {finding.type === 'critical_gap' && (
                    <>
                      <button className="btn-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30">
                        <Upload className="w-3.5 h-3.5 mr-1.5" />
                        Upload Evidence
                      </button>
                      <button className="btn-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300">
                        <PenLine className="w-3.5 h-3.5 mr-1.5" />
                        Add Lay Statement
                      </button>
                      <button className="btn-sm bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30">
                        <XCircle className="w-3.5 h-3.5 mr-1.5" />
                        Remove Condition
                      </button>
                    </>
                  )}
                  {finding.type === 'optimization' && (
                    <>
                      <button className="btn-sm bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                        Accept Upgrade
                      </button>
                      <button className="btn-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300">
                        Keep Current
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CertificationPortal({
  state,
  onChange,
  onCertify
}: {
  state: CertificationState;
  onChange: (field: keyof CertificationState, value: boolean | string) => void;
  onCertify: () => void;
}) {
  const allChecked =
    state.reviewed && state.certified && state.understood && state.representative && state.penalties;
  const canCertify = allChecked && state.signature.trim().length > 0;

  const identity = useIdentity();

  return (
    <GlassCard variant="regular" size="lg" padding="lg" className="border-brass/20">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-6 h-6 text-brass" />
        <h3 className="text-xl font-serif text-slate-100">Certification Portal</h3>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-slate-400 text-sm">
          Please review and acknowledge each statement before certifying:
        </p>

        {[
          {
            key: 'reviewed' as const,
            label:
              'I have reviewed all conditions, severity levels, and evidence correlations presented in this Assurance review.'
          },
          {
            key: 'certified' as const,
            label:
              'I certify that the information provided is true and complete to the best of my knowledge and belief.'
          },
          {
            key: 'understood' as const,
            label:
              'I understand that this tool assists with claim preparation but does not guarantee VA approval of any claimed condition.'
          },
          {
            key: 'representative' as const,
            label:
              'I acknowledge that I may request help from a VA-accredited representative (VSO, attorney, or claims agent) at any time.'
          },
          {
            key: 'penalties' as const,
            label:
              'I understand that willfully providing false information may result in penalties under 18 U.S.C. § 1001.'
          }
        ].map(({ key, label }) => (
          <label key={key} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={state[key] as boolean}
              onChange={(e) => onChange(key, e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-slate-600 text-brass focus:ring-brass bg-slate-800"
            />
            <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
              {label}
            </span>
          </label>
        ))}
      </div>

      <div className="border-t border-slate-800/50 pt-6">
        <p className="text-sm text-slate-400 mb-4">
          By typing your name below, you are electronically signing this certification under the
          Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001).
        </p>

        <div className="form-group mb-6">
          <label className="label">Full Legal Name</label>
          <input
            type="text"
            className="input"
            placeholder={identity.name || 'Type your full legal name'}
            value={state.signature}
            onChange={(e) => onChange('signature', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5" />
            <span>Your data remains on your device. Nothing is transmitted.</span>
          </div>

          <button
            onClick={onCertify}
            disabled={!canCertify}
            className="btn-tactical btn-tactical-advance disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Certify & Continue</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function PhaseAssurance() {
  const { addAudit, showToast } = useClaimStore();
  const selectedConditions = useConditions();

  // Certification state
  const [certification, setCertification] = useState<CertificationState>({
    reviewed: false,
    certified: false,
    understood: false,
    representative: false,
    penalties: false,
    signature: ''
  });

  // Mock score (will be replaced by actual calculation)
  const score = useMemo(() => MOCK_SCORE, []);

  const handleCertificationChange = (field: keyof CertificationState, value: boolean | string) => {
    setCertification((prev) => ({ ...prev, [field]: value }));
  };

  const handleCertify = () => {
    const timestamp = new Date().toISOString();
    setCertification((prev) => ({ ...prev, signedAt: timestamp }));
    addAudit('Claim Certified', `Signed by: ${certification.signature} at ${timestamp}`);
    showToast('Claim certified successfully. Proceeding to final review.', 'success');
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <div className="mb-8">
        <span className="eyebrow">Phase 4</span>
        <h2 className="text-3xl font-serif text-slate-50 mt-2">Entitlement Assurance</h2>
        <p className="text-slate-400 mt-2">
          Pre-certification validation with evidence gap detection and optimization recommendations.
        </p>
      </div>

      {/* Privacy Notice */}
      <GlassCard variant="clear" size="sm" padding="md" className="border-emerald-500/20">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-emerald-400 font-medium">100% Private & Offline</p>
            <p className="text-slate-400 mt-1">
              All validation runs locally. No data is transmitted to external servers.
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Claim Readiness Score */}
      <GlassCard variant="regular" size="lg" padding="lg" className="border-brass/20">
        <div className="flex items-start gap-8">
          <ScoreGauge score={score.overall} grade={score.grade} />

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-serif text-slate-100">Claim Readiness Score</h3>
              <p className="text-sm text-slate-400 mt-1">
                {score.criticalGapCount} critical issues • {score.optimizationCount} optimization
                opportunities • {score.verifiedCount} verified complete
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ComponentScoreBar label="Evidence" score={score.components.evidence} />
              <ComponentScoreBar label="Nexus" score={score.components.nexus} />
              <ComponentScoreBar label="Forms" score={score.components.forms} />
              <ComponentScoreBar label="Compliance" score={score.components.compliance} />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Findings Sections */}
      <div className="space-y-4">
        <FindingsSection
          title="Critical Gaps — Must Resolve"
          icon={<AlertTriangle className="w-5 h-5" />}
          iconColor="text-red-400"
          count={MOCK_CRITICAL_GAPS.length}
          findings={MOCK_CRITICAL_GAPS}
          defaultExpanded={true}
        />

        <FindingsSection
          title="Optimization Opportunities"
          icon={<TrendingUp className="w-5 h-5" />}
          iconColor="text-amber-400"
          count={MOCK_OPTIMIZATIONS.length}
          findings={MOCK_OPTIMIZATIONS}
        />

        <FindingsSection
          title="Verified Complete"
          icon={<CheckCircle className="w-5 h-5" />}
          iconColor="text-emerald-400"
          count={MOCK_VERIFIED.length}
          findings={MOCK_VERIFIED}
        />
      </div>

      {/* Certification Portal */}
      <div className="pt-8 border-t border-slate-800/50">
        <CertificationPortal
          state={certification}
          onChange={handleCertificationChange}
          onCertify={handleCertify}
        />
      </div>

      {/* Dev Info */}
      {selectedConditions.length === 0 && (
        <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-amber-400 mt-0.5" />
            <div className="text-sm">
              <p className="text-amber-300 font-medium">Development Mode</p>
              <p className="text-amber-200/70 mt-1">
                No conditions selected. Displaying mock data for UI development.
                In production, this will analyze your actual claim data.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAMED EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export { PhaseAssurance };

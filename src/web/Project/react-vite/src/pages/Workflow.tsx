/**
 * VAULT DEM Engine — Claim Workflow
 * Multi-phase claim building process
 */

import { useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useClaimStore } from '../stores/claimStore';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { VAULT_WEB_FEATURE_REGISTRY } from '@mosa/Core/Registry';
import type { VaultWorkflowPhaseKey } from '@mosa/Core/Registry';
import type { WorkflowPhase } from '../types';

// Phase Components
import PhaseMission from '../components/Workflow/PhaseMission';
import PhaseIdentity from '../components/Workflow/PhaseIdentity';
import PhaseConditions from '../components/Workflow/PhaseConditions';
import PhaseNarrative from '../components/Workflow/PhaseNarrative';
import PhaseReview from '../components/Workflow/PhaseReview';

const PHASE_COMPONENTS: Record<VaultWorkflowPhaseKey, React.ComponentType> = {
  mission: PhaseMission,
  identity: PhaseIdentity,
  conditions: PhaseConditions,
  narrative: PhaseNarrative,
  review: PhaseReview
};

const PHASES = VAULT_WEB_FEATURE_REGISTRY.workflowPhases.map((p) => ({
  id: p.id,
  path: p.path,
  name: p.name,
  component: PHASE_COMPONENTS[p.key]
}));

export default function Workflow() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPhase, setPhase, canProceed, nextPhase, prevPhase, reset, data, showToast } = useClaimStore();

  const blockingReason = useMemo(() => {
    switch (currentPhase) {
      case 0:
        return data.mission ? null : 'Select a mission to continue.';
      case 1:
        return data.identity.name?.trim() ? null : 'Enter your full legal name to continue.';
      case 2:
        return data.selectedConditions.length > 0 ? null : 'Add at least one condition to continue.';
      default:
        return null;
    }
  }, [currentPhase, data.mission, data.identity.name, data.selectedConditions.length]);

  // Sync URL with phase
  useEffect(() => {
    // Normalize: drop trailing slashes so `/claim/mission/` works.
    const normalized = location.pathname.replace(/\/+$/, '');
    const last = normalized.split('/').pop() || '';

    // Visiting `/claim` should behave like `/claim/mission`.
    const phaseKey = last === 'claim' ? 'mission' : last;
    const phase = PHASES.find((p) => p.path === phaseKey);

    if (!phase) {
      // If URL is malformed, snap back to Mission (safe default).
      if (normalized.startsWith('/claim')) {
        setPhase(0 as WorkflowPhase);
        navigate('/claim/mission', { replace: true });
      }
      return;
    }

    if (phase.id !== currentPhase) {
      setPhase(phase.id as WorkflowPhase);
    }
  }, [location.pathname, currentPhase, setPhase, navigate]);

  // Navigate when phase changes
  useEffect(() => {
    const phase = PHASES[currentPhase];
    if (phase) {
      navigate(`/claim/${phase.path}`, { replace: true });
    }
  }, [currentPhase, navigate]);

  const handleNext = () => {
    if (!canProceed()) {
      if (blockingReason) showToast(blockingReason, 'warning');
      return;
    }
    // Advance phase and navigate explicitly
    nextPhase();
    const nextPhaseIndex = currentPhase + 1;
    const next = PHASES[nextPhaseIndex];
    if (next) {
      navigate(`/claim/${next.path}`);
    }
  };

  const handlePrev = () => {
    prevPhase();
  };

  const handleReset = () => {
    if (window.confirm('Start over? This will clear your current claim progress.')) {
      reset();
      navigate('/claim/mission');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-wide">
        {/* Progress Bar — Glass Surface */}
        <div className="mb-8 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-400 font-medium tracking-wide">
              Phase {currentPhase + 1} of {PHASES.length}
            </span>
            <button
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-300 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          </div>
          
          {/* Progress Steps — Liquid Glass */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-900/40">
            {PHASES.map((phase, i) => (
              <div key={phase.id} className="flex-1 flex items-center">
                <div
                  className={clsx(
                    'h-2 rounded-full flex-1 transition-all duration-500',
                    i <= currentPhase 
                      ? 'bg-gradient-to-r from-brass/90 to-brass shadow-[0_0_12px_rgba(201,162,39,0.35)]' 
                      : 'bg-slate-800/70'
                  )}
                />
                {i < PHASES.length - 1 && (
                  <div className="w-1.5" />
                )}
              </div>
            ))}
          </div>
          
          {/* Phase Labels */}
          <div className="flex justify-between mt-3 px-1">
            {PHASES.map((phase, i) => (
              <button
                key={phase.id}
                onClick={() => i <= currentPhase && setPhase(i as WorkflowPhase)}
                disabled={i > currentPhase}
                className={clsx(
                  'text-xs transition-all duration-200',
                  i === currentPhase
                    ? 'text-brass font-semibold'
                    : i < currentPhase
                    ? 'text-slate-400 hover:text-brass cursor-pointer'
                    : 'text-slate-600/70 cursor-not-allowed'
                )}
              >
                {phase.name}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Content */}
        <div className="min-h-[500px]">
          <Routes>
            <Route index element={<Navigate to="mission" replace />} />
            {PHASES.map((phase) => (
              <Route
                key={phase.id}
                path={phase.path}
                element={<phase.component />}
              />
            ))}
          </Routes>
        </div>

        {/* Navigation Buttons — Military-Themed Tactical */}
        <div className="mt-12 flex justify-between items-center pt-8 border-t border-slate-800/50">
          <button
            onClick={handlePrev}
            disabled={currentPhase === 0}
            className="btn-tactical btn-tactical-retreat"
            aria-label="Previous phase"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="hidden sm:block text-sm text-slate-500 font-medium tracking-wide">
            {PHASES[currentPhase]?.name}
          </div>

          {currentPhase < PHASES.length - 1 ? (
            <div className="text-right">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="btn-tactical btn-tactical-advance"
                aria-label="Continue to next phase"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {!canProceed() && blockingReason && (
                <div className="mt-2 text-xs text-warning">
                  {blockingReason}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/results')}
              className="btn-tactical btn-tactical-advance"
              aria-label="View final results"
            >
              <span>View Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



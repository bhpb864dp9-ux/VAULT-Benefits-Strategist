/**
 * VAULT DEM Engine — Phase: Mission Selection
 * Choose claim type
 */

import { useClaimStore, useMission } from '../../stores/claimStore';
import { 
  FileText, TrendingUp, Link2, RefreshCw, 
  Scale, Clock, CheckCircle, Info
} from 'lucide-react';
import clsx from 'clsx';
import type { MissionType } from '../../types';
import { VA_CLAIM_PROCESS_STEPS, VA_WAIT_TIME_ESTIMATES, formatRangeDays } from '../../lib/vaProcess';

const MISSIONS: {
  type: MissionType;
  icon: React.ElementType;
  title: string;
  description: string;
  timeline: string;
}[] = [
  { type: 'INITIAL', icon: FileText, title: 'Initial Claim', description: 'First time filing for VA disability compensation. No existing rating.', timeline: '90-180 days typical' },
  { type: 'INCREASE', icon: TrendingUp, title: 'Increased Rating', description: 'Your condition has worsened since last rating decision.', timeline: '60-120 days typical' },
  { type: 'SECONDARY', icon: Link2, title: 'Secondary Condition', description: 'New condition caused or aggravated by service-connected disability.', timeline: '90-150 days typical' },
  { type: 'SUPPLEMENTAL', icon: RefreshCw, title: 'Supplemental Claim', description: 'New and relevant evidence for a previously denied claim.', timeline: '60-90 days typical' },
  { type: 'HLR', icon: Scale, title: 'Higher-Level Review', description: 'Request senior reviewer examine existing evidence (no new evidence).', timeline: '60-90 days typical' },
  { type: 'BDD', icon: Clock, title: 'Benefits Delivery at Discharge', description: 'Filing 180-90 days before separation from service.', timeline: 'Rating at discharge' }
];

export default function PhaseMission() {
  const { setMission } = useClaimStore();
  const currentMission = useMission();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Phase 1</span>
        <h2 className="text-3xl font-serif text-slate-50 mt-2">Select Your Mission</h2>
        <p className="text-slate-400 mt-2">
          What type of claim are you filing? This determines which forms and evidence you'll need.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MISSIONS.map((mission) => {
          const Icon = mission.icon;
          const isSelected = currentMission === mission.type;

          return (
            <button
              key={mission.type}
              onClick={() => setMission(mission.type)}
              className={clsx('card card-interactive text-left relative', isSelected && 'card-selected')}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-5 h-5 text-brass" />
                </div>
              )}

              <div className={clsx(
                'w-10 h-10 mb-4 flex items-center justify-center border transition-colors',
                isSelected ? 'border-brass text-brass' : 'border-slate-700 text-slate-400'
              )}>
                <Icon className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-serif text-slate-100 mb-2">{mission.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{mission.description}</p>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {mission.timeline}
              </div>
            </button>
          );
        })}
      </div>

      {currentMission && (
        <div className="mt-8 space-y-4">
          <div className="card">
            <h4 className="text-sm font-medium text-brass uppercase tracking-wider mb-2">Mission Selected</h4>
            <p className="text-slate-300">
              {MISSIONS.find(m => m.type === currentMission)?.title}:{' '}
              <span className="text-slate-400">
                {MISSIONS.find(m => m.type === currentMission)?.description}
              </span>
            </p>
          </div>

          <div className="card">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-brass mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium tracking-widest uppercase text-brass">
                  Estimated VA Processing Time
                </p>
                <p className="text-slate-100 font-serif text-xl mt-2">
                  {VA_WAIT_TIME_ESTIMATES[currentMission].label}
                </p>
                <p className="text-slate-300 mt-2">
                  {formatRangeDays(VA_WAIT_TIME_ESTIMATES[currentMission].rangeDays)}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {VA_WAIT_TIME_ESTIMATES[currentMission].notes} Check status at{' '}
                  <a className="text-brass hover:underline" href="https://www.va.gov/claim-or-appeal-status/" target="_blank" rel="noreferrer">
                    VA.gov/claim-or-appeal-status
                  </a>
                  .
                </p>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-200">
                    See the claim process timeline (transparency)
                  </summary>
                  <div className="mt-4 space-y-3">
                    {VA_CLAIM_PROCESS_STEPS.map((step, i) => (
                      <div key={step.name} className="p-4 bg-slate-900/35 border border-slate-800/60 rounded-2xl">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-slate-100 font-medium">
                            {i + 1}. {step.name}
                          </span>
                          <span className="text-xs text-slate-400">{step.duration}</span>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">{step.description}</p>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



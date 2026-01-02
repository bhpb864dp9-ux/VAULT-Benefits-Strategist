/**
 * VAULT DEM Engine — Phase: Review & DEM Analysis
 * Final review with rating calculation and recommendations
 */

import { useConditions, useMission, useIdentity } from '../../stores/claimStore';
import { useVASRDCalculator } from '../../hooks';
import OCRIntake from '../Evidence/OCRIntake';
import { 
  CheckCircle, AlertCircle, TrendingUp, DollarSign, 
  FileText, AlertTriangle, Award
} from 'lucide-react';
import clsx from 'clsx';

export default function PhaseReview() {
  const conditions = useConditions();
  const mission = useMission();
  const identity = useIdentity();
  const { combined, compensation, tdiu, smc, evidence, demScore, ratingRange } = useVASRDCalculator();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Phase 5</span>
        <h2 className="text-3xl font-serif text-slate-50 mt-2">DEM Analysis</h2>
        <p className="text-slate-400 mt-2">Review your claim package and see projected outcomes.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <OCRIntake />

          <div className="card text-center py-12">
            <span className="eyebrow">Projected Combined Rating</span>
            <div className="mt-4">
              <span className="text-7xl font-serif text-brass">{combined.combined}%</span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Range: {ratingRange.min}% — {ratingRange.max}%
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Exact value before rounding: {combined.exactValue.toFixed(2)}%
            </p>
          </div>

          <div className="card">
            <h3 className="text-lg font-serif text-slate-100 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-brass" />
              Monthly Compensation Estimate
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-800/50">
                <p className="text-sm text-slate-400 mb-1">Monthly (2026 rates)</p>
                <p className="text-3xl font-serif text-brass">
                  ${compensation.monthly.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-slate-800/50">
                <p className="text-sm text-slate-400 mb-1">Annual</p>
                <p className="text-3xl font-serif text-slate-100">
                  ${compensation.annual.toLocaleString()}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Based on {combined.combined}% rating with {compensation.colaRate * 100}% COLA ({compensation.colaYear}).
              Actual amounts depend on final VA rating and dependents.
            </p>
          </div>

          {(tdiu.eligible === true || tdiu.eligible === 'extrascheduler') && (
            <div className={clsx(
              'card',
              tdiu.eligible === true ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'
            )}>
              <h3 className="text-lg font-serif text-slate-100 mb-2 flex items-center gap-2">
                <TrendingUp className={clsx('w-5 h-5', tdiu.eligible === true ? 'text-success' : 'text-warning')} />
                TDIU Potential Detected
              </h3>
              <p className="text-sm text-slate-400 mb-4">{tdiu.explanation}</p>
              
              {tdiu.forms.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Required Forms:</p>
                  <div className="flex flex-wrap gap-2">
                    {tdiu.forms.map((form) => (
                      <span key={form} className="px-2 py-1 bg-slate-800 text-xs text-slate-300">
                        VA Form {form}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {smc.filter(s => s.eligible).length > 0 && (
            <div className="card bg-brass/5 border-brass/20">
              <h3 className="text-lg font-serif text-slate-100 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-brass" />
                Special Monthly Compensation (SMC)
              </h3>
              <div className="space-y-3">
                {smc.filter(s => s.eligible).map((item) => (
                  <div key={item.type} className="p-3 bg-slate-800/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-200">{item.type}</span>
                      <span className="text-brass font-bold">${item.amount.toFixed(2)}/mo</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {evidence.gaps.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-serif text-slate-100 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Evidence Gaps Detected
              </h3>
              
              <div className="space-y-4">
                {evidence.gaps.slice(0, 3).map((gap) => (
                  <div key={gap.conditionId} className="p-3 bg-slate-800/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-200">{gap.condition}</span>
                      <span className="text-xs text-warning">{gap.score}% complete</span>
                    </div>
                    <div className="space-y-1">
                      {gap.missing.slice(0, 2).map((item, i) => (
                        <p key={i} className="text-xs text-slate-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-error" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-4">
            <div className="card text-center">
              <span className="eyebrow">DEM Score</span>
              <div className="mt-4 relative inline-flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeDasharray={`${(demScore / 100) * 352} 352`}
                    className="text-brass"
                  />
                </svg>
                <span className="absolute text-3xl font-serif text-brass">{demScore}</span>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Claim optimization score based on rating potential, eligibility, and evidence strength
              </p>
            </div>

            <div className="card">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Claim Summary</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Mission:</span>
                  <span className="text-slate-200">{mission || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Veteran:</span>
                  <span className="text-slate-200">{identity.name || 'Not entered'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Conditions:</span>
                  <span className="text-brass">{conditions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Body Systems:</span>
                  <span className="text-slate-200">{new Set(conditions.map(c => c.system)).size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Evidence Score:</span>
                  <span className={clsx(
                    evidence.overallScore >= 70 ? 'text-success' :
                    evidence.overallScore >= 50 ? 'text-warning' : 'text-error'
                  )}>
                    {evidence.overallScore}%
                  </span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Forms to Generate</h4>
              <div className="space-y-2">
                {['21-526EZ', '21-4138'].map((form) => (
                  <div key={form} className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-brass" />
                    <span className="text-slate-300">VA Form {form}</span>
                    <CheckCircle className="w-4 h-4 text-success ml-auto" />
                  </div>
                ))}
                {tdiu.eligible && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-brass" />
                    <span className="text-slate-300">VA Form 21-8940</span>
                    <CheckCircle className="w-4 h-4 text-success ml-auto" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



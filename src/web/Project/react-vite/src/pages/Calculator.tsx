/**
 * VAULT DEM Engine — Standalone Calculator Page
 * VASRD-compliant combined rating calculator with severity-based ratings
 */

import { useState, useMemo, useCallback } from 'react';
import { calculateExactCombinedRating, calculateCompensation, COMPENSATION_RATES_2026 } from '../utils/vasrdCalculator';
import {
  CONDITION_RATING_SCHEDULES,
  SEVERITY_DISPLAY,
  type SeverityLevel,
  type ConditionRatingSchedule
} from '../data/vasrdRatings';
import { Plus, Minus, RotateCcw, Calculator as CalcIcon, DollarSign, Info, ChevronRight, Scale } from 'lucide-react';
import type { RatingInput } from '../types';

interface ConditionEntry {
  id: string;
  conditionId: string;
  severity: SeverityLevel;
  customName?: string;
}

// Group conditions by category for the selector
const CONDITION_CATEGORIES = CONDITION_RATING_SCHEDULES.reduce((acc, condition) => {
  if (!acc[condition.category]) {
    acc[condition.category] = [];
  }
  acc[condition.category].push(condition);
  return acc;
}, {} as Record<string, ConditionRatingSchedule[]>);

export default function Calculator() {
  const [conditions, setConditions] = useState<ConditionEntry[]>([
    { id: '1', conditionId: 'ptsd', severity: 'moderate' },
    { id: '2', conditionId: 'lumbar', severity: 'mild' }
  ]);
  const [hasDependents, setHasDependents] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Convert conditions to rating inputs for calculation
  const ratings = useMemo((): RatingInput[] => {
    return conditions.map(entry => {
      const schedule = CONDITION_RATING_SCHEDULES.find(c => c.id === entry.conditionId);
      const ratingCriteria = schedule?.ratings.find(r => r.level === entry.severity);
      return {
        id: entry.id,
        name: entry.customName || schedule?.name || 'Unknown',
        value: ratingCriteria?.rating ?? 0
      };
    });
  }, [conditions]);

  const result = useMemo(() => {
    return calculateExactCombinedRating(ratings.filter(r => r.value > 0));
  }, [ratings]);

  const compensation = useMemo(() => {
    return calculateCompensation(result.combined, { spouse: hasDependents });
  }, [result.combined, hasDependents]);

  const addCondition = () => {
    const newId = Date.now().toString();
    setConditions([...conditions, { id: newId, conditionId: 'ptsd', severity: 'mild' }]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const updateCondition = (id: string, conditionId: string) => {
    setConditions(conditions.map(c => c.id === id ? { ...c, conditionId, severity: 'mild' } : c));
  };

  const handleCycleSeverity = useCallback((id: string) => {
    setConditions(prev => prev.map(c => {
      if (c.id !== id) return c;
      const schedule = CONDITION_RATING_SCHEDULES.find(s => s.id === c.conditionId);
      const availableLevels = schedule?.ratings.map(r => r.level) || ['none', 'mild', 'moderate', 'severe', 'total'];
      const currentIndex = availableLevels.indexOf(c.severity);
      const nextIndex = (currentIndex + 1) % availableLevels.length;
      return { ...c, severity: availableLevels[nextIndex] };
    }));
  }, []);

  const reset = () => {
    setConditions([
      { id: '1', conditionId: 'ptsd', severity: 'moderate' },
      { id: '2', conditionId: 'lumbar', severity: 'mild' }
    ]);
  };

  // Get schedule and criteria for a condition entry
  const getConditionInfo = (entry: ConditionEntry) => {
    const schedule = CONDITION_RATING_SCHEDULES.find(c => c.id === entry.conditionId);
    const criteria = schedule?.ratings.find(r => r.level === entry.severity);
    return { schedule, criteria };
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow">VASRD Calculator</span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-50 mt-4 mb-4">
            Combined Rating Calculator
          </h1>
          <p className="text-lg text-slate-400">
            Exact VA disability math per 38 CFR § 4.25 and § 4.26.
            Add your ratings to see your combined percentage and compensation estimate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Left: Rating Inputs */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-serif text-slate-100">
                  Your Ratings
                </h2>
                <button onClick={reset} className="btn btn-ghost btn-sm">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>

              <div className="space-y-4">
                {conditions.map((entry, index) => {
                  const { schedule, criteria } = getConditionInfo(entry);
                  const severityInfo = SEVERITY_DISPLAY[entry.severity];
                  const rating = criteria?.rating ?? 0;

                  return (
                    <div
                      key={entry.id}
                      className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl"
                    >
                      {/* Header row: number, condition selector, severity badge, rating, remove */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <span className="text-sm text-slate-500 hidden sm:block w-6">#{index + 1}</span>

                        {/* Mobile header */}
                        <div className="flex items-center gap-3 sm:hidden">
                          <span className="text-sm text-slate-500">#{index + 1}</span>
                          <button
                            onClick={() => handleCycleSeverity(entry.id)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
                            style={{
                              backgroundColor: entry.severity === 'mild' ? 'rgba(34, 197, 94, 0.25)'
                                : entry.severity === 'moderate' ? 'rgba(245, 158, 11, 0.25)'
                                : entry.severity === 'severe' ? 'rgba(239, 68, 68, 0.25)'
                                : entry.severity === 'total' ? 'rgba(168, 85, 247, 0.25)'
                                : 'rgba(71, 85, 105, 0.5)',
                              color: entry.severity === 'mild' ? '#4ade80'
                                : entry.severity === 'moderate' ? '#fbbf24'
                                : entry.severity === 'severe' ? '#f87171'
                                : entry.severity === 'total' ? '#c084fc'
                                : '#94a3b8',
                            }}
                          >
                            {severityInfo.label}
                          </button>
                          <span className="text-lg font-medium text-brass ml-auto">{rating}%</span>
                          <button
                            onClick={() => removeCondition(entry.id)}
                            disabled={conditions.length === 1}
                            className="p-2 text-slate-500 hover:text-error disabled:opacity-30"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Condition selector */}
                        <select
                          className="flex-1 bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2 rounded-lg text-sm"
                          value={entry.conditionId}
                          onChange={(e) => updateCondition(entry.id, e.target.value)}
                        >
                          {Object.entries(CONDITION_CATEGORIES).map(([category, conds]) => (
                            <optgroup key={category} label={category}>
                              {conds.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </optgroup>
                          ))}
                        </select>

                        {/* Desktop: severity badge */}
                        <button
                          onClick={() => handleCycleSeverity(entry.id)}
                          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider cursor-pointer transition-all hover:scale-105"
                          style={{
                            backgroundColor: entry.severity === 'mild' ? 'rgba(34, 197, 94, 0.25)'
                              : entry.severity === 'moderate' ? 'rgba(245, 158, 11, 0.25)'
                              : entry.severity === 'severe' ? 'rgba(239, 68, 68, 0.25)'
                              : entry.severity === 'total' ? 'rgba(168, 85, 247, 0.25)'
                              : 'rgba(71, 85, 105, 0.5)',
                            color: entry.severity === 'mild' ? '#4ade80'
                              : entry.severity === 'moderate' ? '#fbbf24'
                              : entry.severity === 'severe' ? '#f87171'
                              : entry.severity === 'total' ? '#c084fc'
                              : '#94a3b8',
                          }}
                        >
                          {severityInfo.label}
                          <ChevronRight className="w-3 h-3" />
                        </button>

                        {/* Desktop: rating percentage */}
                        <span className="hidden sm:block text-lg font-medium text-brass w-16 text-right">{rating}%</span>

                        {/* Desktop: remove button */}
                        <button
                          onClick={() => removeCondition(entry.id)}
                          disabled={conditions.length === 1}
                          className="hidden sm:block p-2 text-slate-500 hover:text-error disabled:opacity-30"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Regulatory citation row */}
                      {schedule && criteria && (
                        <div className="mt-3 pt-3 border-t border-slate-700/50">
                          <div className="flex items-start gap-2">
                            <Scale className="w-3.5 h-3.5 text-brass flex-shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <span className="text-brass font-medium">{schedule.cfrSection}</span>
                              <span className="text-slate-500 mx-2">•</span>
                              <span className="text-slate-400">{criteria.description}</span>
                              <p className="text-slate-500 mt-1 leading-relaxed">{criteria.criteria}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addCondition}
                className="mt-4 w-full py-3 border border-dashed border-slate-700 text-slate-400 hover:border-brass hover:text-brass transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Condition
              </button>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-slate-600 text-brass focus:ring-brass bg-slate-800"
                    checked={hasDependents}
                    onChange={(e) => setHasDependents(e.target.checked)}
                  />
                  <span className="text-slate-300">Include spouse (adds to compensation at 30%+)</span>
                </label>
              </div>
            </div>

            {showBreakdown && result.steps.length > 0 && (
              <div className="card mt-6">
                <h3 className="text-lg font-serif text-slate-100 mb-4">Calculation Breakdown</h3>
                <div className="space-y-2 font-mono text-sm">
                  {result.steps.map((step, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-slate-800 last:border-0">
                      <span className="text-slate-400">{step.description}</span>
                      <span className="text-slate-200">{step.remainingEfficiency.toFixed(2)}% eff.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Results - Shows first on mobile */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="lg:sticky lg:top-32 space-y-4">
              <div className="card text-center">
                <CalcIcon className="w-8 h-8 mx-auto text-brass mb-4" />
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                  Combined Rating
                </p>
                <p className="text-6xl font-serif text-brass">
                  {result.combined}%
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Exact: {result.exactValue.toFixed(2)}%
                </p>
                
                {result.bilateralFactor > 0 && (
                  <p className="text-xs text-brass mt-2">
                    Includes {result.bilateralFactor}% bilateral factor
                  </p>
                )}

                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="mt-4 text-xs text-slate-500 hover:text-brass flex items-center gap-1 mx-auto"
                >
                  <Info className="w-3 h-3" />
                  {showBreakdown ? 'Hide' : 'Show'} calculation steps
                </button>
              </div>

              <div className="card text-center">
                <DollarSign className="w-8 h-8 mx-auto text-success mb-4" />
                <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                  Monthly Compensation
                </p>
                <p className="text-4xl font-serif text-success">
                  ${compensation.monthly.toLocaleString()}
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  ${compensation.annual.toLocaleString()}/year
                </p>
                <p className="text-xs text-slate-600 mt-4">
                  2026 rates with {(compensation.colaRate * 100).toFixed(1)}% COLA
                </p>
              </div>

              <div className="card">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                  2026 Rate Schedule
                </h4>
                <div className="space-y-1 text-xs">
                  {[10, 30, 50, 70, 100].map(rating => (
                    <div key={rating} className="flex justify-between">
                      <span className="text-slate-500">{rating}%</span>
                      <span className="text-slate-300">
                        ${COMPENSATION_RATES_2026.veteran[rating as keyof typeof COMPENSATION_RATES_2026.veteran].toLocaleString()}/mo
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Citation: Whole Person Theory */}
              <div className="glass-panel text-sm">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="w-5 h-5 text-brass flex-shrink-0 mt-0.5" />
                  <h4 className="font-medium text-slate-200">
                    Understanding "Whole Person" Theory
                  </h4>
                </div>
                <div className="text-slate-400 space-y-3">
                  <p>
                    The VA calculates combined ratings using the <strong className="text-slate-300">"whole person" 
                    theory</strong> — each disability rating represents the percentage of overall 
                    impairment, not additive percentages.
                  </p>
                  <p>
                    <em>Example:</em> A 50% rating + 30% rating = 65%, not 80%. The 30% is 
                    applied to the remaining 50% of "efficient" body (30% × 50 = 15), totaling 65%.
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60">
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-2">
                    Legal Authority
                  </p>
                  <ul className="text-xs text-slate-500 space-y-1.5">
                    <li>
                      <a 
                        href="https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.25" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brass hover:underline"
                      >
                        38 CFR § 4.25
                      </a>
                      {' '}— Combined Ratings Table
                    </li>
                    <li>
                      <a 
                        href="https://www.ecfr.gov/current/title-38/chapter-I/part-4/subpart-A/section-4.26" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brass hover:underline"
                      >
                        38 CFR § 4.26
                      </a>
                      {' '}— Bilateral Factor (10% additional)
                    </li>
                    <li>
                      <a 
                        href="https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title38-section1155" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-brass hover:underline"
                      >
                        38 U.S.C. § 1155
                      </a>
                      {' '}— Authority for Schedular Ratings
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



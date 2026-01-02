/**
 * VAULT DEM Engine — Standalone Calculator Page
 * Quick VASRD combined rating calculator
 */

import { useState, useMemo } from 'react';
import { calculateExactCombinedRating, calculateCompensation, COMPENSATION_RATES_2026 } from '../utils/vasrdCalculator';
import { Plus, Minus, RotateCcw, Calculator as CalcIcon, DollarSign, Info } from 'lucide-react';
import type { RatingInput } from '../types';

const RATING_OPTIONS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

export default function Calculator() {
  const [ratings, setRatings] = useState<RatingInput[]>([
    { id: '1', name: 'Condition 1', value: 50 },
    { id: '2', name: 'Condition 2', value: 30 }
  ]);
  const [hasDependents, setHasDependents] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const result = useMemo(() => {
    return calculateExactCombinedRating(ratings.filter(r => r.value > 0));
  }, [ratings]);

  const compensation = useMemo(() => {
    return calculateCompensation(result.combined, { spouse: hasDependents });
  }, [result.combined, hasDependents]);

  const addRating = () => {
    const newId = Date.now().toString();
    setRatings([...ratings, { id: newId, name: `Condition ${ratings.length + 1}`, value: 10 }]);
  };

  const removeRating = (id: string) => {
    if (ratings.length > 1) {
      setRatings(ratings.filter(r => r.id !== id));
    }
  };

  const updateRating = (id: string, value: number) => {
    setRatings(ratings.map(r => r.id === id ? { ...r, value } : r));
  };

  const updateName = (id: string, name: string) => {
    setRatings(ratings.map(r => r.id === id ? { ...r, name } : r));
  };

  const reset = () => {
    setRatings([
      { id: '1', name: 'Condition 1', value: 50 },
      { id: '2', name: 'Condition 2', value: 30 }
    ]);
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

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Left: Rating Inputs */}
          <div className="lg:col-span-2">
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
                {ratings.map((rating, index) => (
                  <div 
                    key={rating.id}
                    className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700"
                  >
                    <span className="text-sm text-slate-500 w-6">#{index + 1}</span>
                    
                    <input
                      type="text"
                      className="flex-1 bg-transparent border-0 border-b border-slate-700 text-slate-200 focus:border-brass focus:outline-none px-0 py-1"
                      value={rating.name}
                      onChange={(e) => updateName(rating.id, e.target.value)}
                      placeholder="Condition name"
                    />
                    
                    <select
                      className="bg-slate-700 border border-slate-600 text-slate-100 px-3 py-2"
                      value={rating.value}
                      onChange={(e) => updateRating(rating.id, Number(e.target.value))}
                    >
                      {RATING_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}%</option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeRating(rating.id)}
                      disabled={ratings.length === 1}
                      className="p-2 text-slate-500 hover:text-error disabled:opacity-30"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={addRating}
                className="mt-4 w-full py-3 border border-dashed border-slate-700 text-slate-400 hover:border-brass hover:text-brass transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Another Rating
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

          {/* Right: Results */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
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



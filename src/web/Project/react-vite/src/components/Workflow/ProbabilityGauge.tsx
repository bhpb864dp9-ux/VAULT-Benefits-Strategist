/**
 * VDIO Narrative Engine — Probability Gauge Component
 * Visual representation of claim approval probability.
 *
 * @vault-feature VDIO-PD-UI-001 Probability Visualization
 */
import { Gauge, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import type { ProbabilityResult } from '../../stores/narrativeStore';
import { getProbabilityColor, getProbabilityBgColor } from '../../lib/probabilityDetector';

interface ProbabilityGaugeProps {
  result: ProbabilityResult | null;
  showBreakdown?: boolean;
  compact?: boolean;
}

export default function ProbabilityGauge({ result, showBreakdown = true, compact = false }: ProbabilityGaugeProps) {
  if (!result) {
    return (
      <div className="glass-panel p-4">
        <div className="flex items-center gap-3 text-slate-400">
          <Gauge className="w-5 h-5" />
          <span>Probability analysis not yet run</span>
        </div>
      </div>
    );
  }
  
  const colorClass = getProbabilityColor(result.rating);
  const bgClass = getProbabilityBgColor(result.rating);
  
  // Calculate gauge arc (0-180 degrees)
  const rotation = (result.overall / 100) * 180;
  
  if (compact) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${bgClass}`}>
        <Gauge className={`w-4 h-4 ${colorClass}`} />
        <span className={`text-sm font-medium ${colorClass}`}>
          {result.overall}% {result.rating}
        </span>
      </div>
    );
  }
  
  return (
    <div className="glass-panel">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
            <Gauge className="w-5 h-5 text-brass" />
            Approval Probability
          </h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${bgClass} ${colorClass}`}>
            {result.rating}
          </div>
        </div>
        
        {/* Gauge Visual */}
        <div className="flex justify-center mb-4">
          <div className="relative w-48 h-24 overflow-hidden">
            {/* Background arc */}
            <div
              className="absolute w-48 h-48 rounded-full border-8 border-slate-700/50"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
              }}
            />
            
            {/* Colored arc based on score */}
            <div
              className={`absolute w-48 h-48 rounded-full border-8 transition-transform duration-1000 ${
                result.rating === 'High' ? 'border-emerald-500' :
                result.rating === 'Medium' ? 'border-amber-500' : 'border-red-500'
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)',
                transform: `rotate(${rotation - 180}deg)`,
                transformOrigin: 'center center',
              }}
            />
            
            {/* Center score */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <span className={`text-4xl font-bold ${colorClass}`}>{result.overall}</span>
              <span className="text-lg text-slate-400">%</span>
            </div>
          </div>
        </div>
        
        {/* Trend indicator */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {result.overall >= 70 ? (
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          ) : result.overall >= 45 ? (
            <Minus className="w-4 h-4 text-amber-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className="text-sm text-slate-400">
            {result.overall >= 70 ? 'Strong claim' :
             result.overall >= 45 ? 'Needs strengthening' :
             'Significant improvements needed'}
          </span>
        </div>
        
        {/* Explanation */}
        <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4">
          <p className="text-sm text-slate-300">{result.explanation}</p>
        </div>
        
        {/* Breakdown */}
        {showBreakdown && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Score Breakdown
            </h4>
            
            <div className="space-y-2">
              <BreakdownBar
                label="Evidence Strength"
                value={result.breakdown.evidenceScore}
                weight={30}
                positive
              />
              <BreakdownBar
                label="Citation Quality"
                value={result.breakdown.citationScore}
                weight={20}
                positive
              />
              <BreakdownBar
                label="Evidence Gaps"
                value={result.breakdown.gapPenalty}
                weight={15}
                positive={false}
              />
              <BreakdownBar
                label="Red Team Issues"
                value={result.breakdown.redTeamPenalty}
                weight={20}
                positive={false}
              />
              <BreakdownBar
                label="Historical Baseline"
                value={result.breakdown.historicalBaseline}
                weight={35}
                positive
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface BreakdownBarProps {
  label: string;
  value: number;
  weight: number;
  positive: boolean;
}

function BreakdownBar({ label, value, weight, positive }: BreakdownBarProps) {
  const barColor = positive
    ? value >= 70 ? 'bg-emerald-500' : value >= 40 ? 'bg-amber-500' : 'bg-red-500'
    : value <= 20 ? 'bg-emerald-500' : value <= 50 ? 'bg-amber-500' : 'bg-red-500';
  
  const displayValue = positive ? value : 100 - value;
  
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-slate-400">
          {label}
          <span className="text-slate-500 ml-1">({weight}%)</span>
        </span>
        <span className={`font-medium ${
          positive
            ? value >= 70 ? 'text-emerald-400' : value >= 40 ? 'text-amber-400' : 'text-red-400'
            : value <= 20 ? 'text-emerald-400' : value <= 50 ? 'text-amber-400' : 'text-red-400'
        }`}>
          {positive ? value : value}
          {!positive && value > 0 && ' penalty'}
        </span>
      </div>
      <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
          style={{ width: `${displayValue}%` }}
        />
      </div>
    </div>
  );
}

export { ProbabilityGauge };


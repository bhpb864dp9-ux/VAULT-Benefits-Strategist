/**
 * VDIO Narrative Engine — Red Team Alert Component
 * Displays contradictory evidence warnings in Phase 3.
 *
 * @vault-feature VDIO-RT-UI-001 Red Team Warnings Display
 */
import { useState } from 'react';
import { AlertTriangle, Shield, ChevronDown, ChevronUp, X, Lightbulb } from 'lucide-react';
import type { RedTeamFlag } from '../../stores/narrativeStore';
import { getRedTeamSummary } from '../../lib/redTeamProtocol';

interface RedTeamAlertProps {
  flags: RedTeamFlag[];
  onDismiss?: () => void;
  collapsible?: boolean;
}

export default function RedTeamAlert({ flags, onDismiss, collapsible = true }: RedTeamAlertProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  
  const visibleFlags = flags.filter(f => !dismissedIds.has(f.id));
  
  if (visibleFlags.length === 0) return null;
  
  const summary = getRedTeamSummary(visibleFlags);
  
  const dismissFlag = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };
  
  const getBorderColor = () => {
    if (summary.riskLevel === 'high') return 'border-red-500/50';
    if (summary.riskLevel === 'medium') return 'border-amber-500/50';
    return 'border-slate-600/50';
  };
  
  const getHeaderBg = () => {
    if (summary.riskLevel === 'high') return 'bg-red-500/10';
    if (summary.riskLevel === 'medium') return 'bg-amber-500/10';
    return 'bg-slate-700/30';
  };
  
  return (
    <div className={`rounded-xl border ${getBorderColor()} overflow-hidden backdrop-blur-sm`}>
      {/* Header */}
      <div
        className={`${getHeaderBg()} px-4 py-3 flex items-center justify-between cursor-pointer`}
        onClick={() => collapsible && setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <Shield className={`w-5 h-5 ${
            summary.riskLevel === 'high' ? 'text-red-400' :
            summary.riskLevel === 'medium' ? 'text-amber-400' : 'text-slate-400'
          }`} />
          <div>
            <h4 className="font-medium text-slate-200 flex items-center gap-2">
              Red Team Analysis
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                summary.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                summary.riskLevel === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-slate-600/50 text-slate-400'
              }`}>
                {summary.riskLevel.toUpperCase()}
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {summary.criticalCount} critical, {summary.warningCount} warning
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onDismiss && (
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(); }}
              className="p-1 hover:bg-slate-600/50 rounded"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          {collapsible && (
            expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
      
      {/* Content */}
      {(!collapsible || expanded) && (
        <div className="p-4 space-y-3 bg-slate-900/50">
          {visibleFlags.map((flag) => (
            <div
              key={flag.id}
              className={`p-3 rounded-lg border ${
                flag.severity === 'critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-amber-500/5 border-amber-500/30'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    flag.severity === 'critical' ? 'text-red-400' : 'text-amber-400'
                  }`} />
                  <div>
                    <p className={`text-sm font-medium ${
                      flag.severity === 'critical' ? 'text-red-400' : 'text-amber-400'
                    }`}>
                      "{flag.keyword}" detected
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {flag.source}, Page {flag.page}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissFlag(flag.id)}
                  className="p-1 hover:bg-slate-600/50 rounded text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              
              {/* Snippet */}
              <div className="mt-2 p-2 bg-slate-800/50 rounded text-xs text-slate-400 font-mono line-clamp-2">
                "{flag.snippet}"
              </div>
              
              {/* Mitigation */}
              <div className="mt-2 flex items-start gap-2">
                <Lightbulb className="w-3 h-3 mt-0.5 text-brass flex-shrink-0" />
                <p className="text-xs text-slate-300">
                  <span className="text-brass font-medium">Mitigation:</span> {flag.mitigation}
                </p>
              </div>
            </div>
          ))}
          
          {/* Summary */}
          <div className="pt-3 border-t border-slate-700/50">
            <p className="text-xs text-slate-400">
              Address these issues before submitting your claim to reduce the chance of denial.
              Critical issues require immediate attention; warnings should be addressed if possible.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export { RedTeamAlert };


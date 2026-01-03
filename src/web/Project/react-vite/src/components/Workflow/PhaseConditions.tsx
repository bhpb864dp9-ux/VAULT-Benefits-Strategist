/**
 * VAULT DEM Engine — Phase: Conditions Selection
 * Select body systems and conditions to claim
 */

import { useState, useMemo, useCallback } from 'react';
import { useClaimStore, useConditions, useIntentLevels } from '../../stores/claimStore';
import { BODY_SYSTEMS, searchConditions, getBestConditionMatch, getSystemById, getConditionById } from '../../data/bodySystems';
import BodyMap from '../Conditions/BodyMap';
import {
  Search, Plus, X, ChevronRight, Brain, Heart, Eye, Ear,
  Wind, Bone, Activity, Droplet, Shield, Circle, Smile,
  Zap, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import type { SelectedCondition, Condition, IntentLevel } from '../../types';
import { getBodyMapSuggestions } from '../../lib/bodyMapSuggestions';

const SYSTEM_ICONS: Record<string, React.ElementType> = {
  mental: Brain,
  cardiovascular: Heart,
  vision: Eye,
  auditory: Ear,
  respiratory: Wind,
  musculoskeletal: Bone,
  endocrine: Activity,
  genitourinary: Droplet,
  hematologic: Droplet,
  infectious: Shield,
  skin: Circle,
  dental: Smile,
  neurological: Zap,
  digestive: Circle,
  gynecological: Heart
};

// REL-019: Severity labels for display
const SEVERITY_LABELS: Record<IntentLevel, string> = {
  0: 'None',
  1: 'Mild',
  2: 'Moderate',
  3: 'Severe',
  4: 'Total'
};

export default function PhaseConditions() {
  const { addCondition, removeCondition, updateCondition } = useClaimStore();
  const selectedConditions = useConditions();
  const intentLevels = useIntentLevels() || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  // REL-019: Cycle severity level on condition cards (0-4: none, mild, moderate, severe, total)
  const cycleSeverity = useCallback((conditionId: string, currentSeverity?: IntentLevel) => {
    const current = currentSeverity ?? 0;
    const next = ((current + 1) % 5) as IntentLevel;
    updateCondition(conditionId, { severity: next });
  }, [updateCondition]);

  const searchResults = useMemo(() => {
    if (searchQuery.length < 2) return [];
    return searchConditions(searchQuery).slice(0, 10);
  }, [searchQuery]);

  const bestMatch = useMemo(() => {
    if (searchQuery.length < 2) return undefined;
    return getBestConditionMatch(searchQuery);
  }, [searchQuery]);

  const bodyMapSuggestions = useMemo(() => {
    const picked = new Set(selectedConditions.map((c) => c.id));
    const byPart = getBodyMapSuggestions(intentLevels);

    const flattened = byPart.flatMap((s) =>
      s.conditionIds.map((id) => ({ partId: s.partId, intent: s.intent, id }))
    );

    // De-dupe by condition id; keep highest intent.
    const bestById = new Map<string, { id: string; intent: number; partId: string }>();
    for (const x of flattened) {
      if (picked.has(x.id)) continue;
      const prev = bestById.get(x.id);
      if (!prev || x.intent > prev.intent) {
        bestById.set(x.id, { id: x.id, intent: x.intent, partId: x.partId });
      }
    }

    const list = [...bestById.values()]
      .map((x) => ({ ...x, c: getConditionById(x.id) }))
      .filter((x) => Boolean(x.c))
      .sort((a, b) => b.intent - a.intent || String(a.c?.name).localeCompare(String(b.c?.name)))
      .slice(0, 8);

    return list as Array<{ id: string; intent: number; partId: string; c: NonNullable<ReturnType<typeof getConditionById>> }>;
  }, [intentLevels, selectedConditions]);

  const handleAddCondition = (condition: Condition & { system: string }, initialSeverity: IntentLevel = 1) => {
    const selected: SelectedCondition = {
      ...condition,
      system: condition.system as SelectedCondition['system'],
      selectedRating: undefined,
      side: undefined,
      isBilateral: false,
      notes: '',
      severity: initialSeverity  // REL-019: Default to Mild when adding manually
    };
    addCondition(selected);
    setSearchQuery('');
  };

  const isConditionSelected = (conditionId: string) => {
    return selectedConditions.some(c => c.id === conditionId);
  };

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Phase 3</span>
        <h2 className="text-3xl font-serif text-slate-50 mt-2">Select Conditions</h2>
        <p className="text-slate-400 mt-2">
          Search for conditions or browse by body system. Select all that apply to your claim.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <BodyMap />

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              className="input pl-12"
              placeholder="Search conditions (e.g., PTSD, back pain, tinnitus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                const bm = bestMatch?.c;
                if (!bm) return;
                if (isConditionSelected(bm.id)) return;
                handleAddCondition(bm);
              }}
            />

            {bestMatch?.c && searchQuery.length >= 2 && !isConditionSelected(bestMatch.c.id) && (
              <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-brass/10 border border-brass/30 text-brass">
                    Suggested
                  </span>
                  <span className="text-slate-300">
                    {bestMatch.c.name}
                  </span>
                  <span className="text-slate-500">
                    ({getSystemById(bestMatch.c.system)?.name})
                  </span>
                </div>
                <span className="text-slate-500">Press Enter to add</span>
              </div>
            )}
            
            {searchResults.length > 0 && (
              <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 max-h-80 overflow-y-auto">
                {searchResults.map((result) => {
                  const isSelected = isConditionSelected(result.id);
                  const isBest = bestMatch?.c?.id === result.id;
                  return (
                    <button
                      key={result.id}
                      onClick={() => !isSelected && handleAddCondition(result)}
                      disabled={isSelected}
                      className={clsx(
                        'w-full px-4 py-3 text-left flex items-center justify-between',
                        'hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0',
                        isSelected && 'opacity-50 cursor-not-allowed bg-slate-800/50',
                        isBest && !isSelected && 'condition-ping'
                      )}
                    >
                      <div>
                        <div className="text-slate-100 font-medium">{result.name}</div>
                        <div className="text-xs text-slate-500">
                          {getSystemById(result.system)?.name} • DBQ: {result.dbq}
                        </div>
                      </div>
                      {isSelected ? (
                        <span className="text-xs text-brass">Added</span>
                      ) : (
                        <Plus className="w-4 h-4 text-brass" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">
              Browse by Body System
            </h3>
            
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BODY_SYSTEMS.map((system) => {
                const Icon = SYSTEM_ICONS[system.id] || Circle;
                const isExpanded = expandedSystem === system.id;
                const conditionCount = selectedConditions.filter(c => c.system === system.id).length;

                return (
                  <div key={system.id}>
                    <button
                      onClick={() => setExpandedSystem(isExpanded ? null : system.id)}
                      className={clsx(
                        'w-full p-3 text-left flex items-center gap-3 border transition-all',
                        isExpanded 
                          ? 'border-brass bg-brass/5' 
                          : 'border-slate-800 hover:border-slate-700'
                      )}
                    >
                      <Icon className={clsx('w-5 h-5', isExpanded ? 'text-brass' : 'text-slate-500')} />
                      <span className="text-sm text-slate-200 flex-1">{system.name}</span>
                      {conditionCount > 0 && (
                        <span className="px-2 py-0.5 bg-brass/20 text-brass text-xs rounded">
                          {conditionCount}
                        </span>
                      )}
                      <ChevronRight className={clsx('w-4 h-4 text-slate-500 transition-transform', isExpanded && 'rotate-90')} />
                    </button>

                    {isExpanded && (
                      <div className="mt-2 ml-4 space-y-1 max-h-60 overflow-y-auto">
                        {system.conditions.map((condition) => {
                          const isSelected = isConditionSelected(condition.id);
                          return (
                            <button
                              key={condition.id}
                              onClick={() => !isSelected && handleAddCondition({ ...condition, system: system.id })}
                              disabled={isSelected}
                              className={clsx(
                                'w-full px-3 py-2 text-left text-sm flex items-center justify-between',
                                'border border-slate-800 hover:border-slate-700 transition-colors',
                                isSelected && 'bg-brass/10 border-brass/30'
                              )}
                            >
                              <span className={isSelected ? 'text-brass' : 'text-slate-300'}>
                                {condition.name}
                              </span>
                              {isSelected ? (
                                <span className="text-xs text-brass">✓</span>
                              ) : (
                                <Plus className="w-3 h-3 text-slate-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32">
            <div className="glass-panel">
              {bodyMapSuggestions.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                      Suggested from Body Map
                    </h3>
                    <span className="text-xs text-slate-500">{bodyMapSuggestions.length} suggestions</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {bodyMapSuggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => handleAddCondition(s.c, s.intent as IntentLevel)}
                        className={clsx(
                          'w-full text-left p-3 border transition-all flex items-center justify-between gap-3',
                          'hover:border-brass/60 hover:bg-brass/5',
                          'border-slate-800 bg-slate-900/30'
                        )}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={clsx(
                                'inline-flex items-center gap-2 text-xs text-slate-400',
                                s.intent === 1 && 'text-intent-mild',
                                s.intent === 2 && 'text-intent-moderate',
                                s.intent === 3 && 'text-intent-severe'
                              )}
                            >
                              <span
                                className={clsx(
                                  'intent-dot',
                                  s.intent === 1 && 'intent-dot-1',
                                  s.intent === 2 && 'intent-dot-2',
                                  s.intent === 3 && 'intent-dot-3'
                                )}
                              />
                              {s.intent === 1 ? 'Mild' : s.intent === 2 ? 'Moderate' : 'Severe'}
                            </span>
                            <span className="text-xs text-slate-500 truncate">• {getSystemById(s.c.system)?.name}</span>
                          </div>
                          <div className="text-sm text-slate-100 font-medium truncate mt-1">{s.c.name}</div>
                          <div className="text-xs text-slate-500 truncate">DBQ: {s.c.dbq}</div>
                        </div>
                        <Plus className="w-4 h-4 text-brass flex-shrink-0" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-slate-800/80" />
                </div>
              )}

              <h3 className="text-lg font-serif text-slate-100 mb-4 flex items-center justify-between">
                Selected Conditions
                <span className="text-brass text-sm">({selectedConditions.length})</span>
              </h3>

              {selectedConditions.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  <AlertCircle className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                  No conditions selected yet.
                  <br />
                  Search or browse to add conditions.
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {selectedConditions.map((condition) => (
                    <div key={condition.id} className="group flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700/60 rounded-xl backdrop-blur-sm transition-colors hover:border-slate-600/70">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-slate-200">{condition.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{getSystemById(condition.system)?.name}</span>
                          {/* REL-019: Severity cycling badge */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cycleSeverity(condition.id, condition.severity);
                            }}
                            style={{
                              backgroundColor: condition.severity === 1 ? 'rgba(34, 197, 94, 0.25)'
                                : condition.severity === 2 ? 'rgba(245, 158, 11, 0.25)'
                                : condition.severity === 3 ? 'rgba(239, 68, 68, 0.25)'
                                : condition.severity === 4 ? 'rgba(168, 85, 247, 0.25)'
                                : 'rgba(71, 85, 105, 0.5)',
                              color: condition.severity === 1 ? '#4ade80'
                                : condition.severity === 2 ? '#fbbf24'
                                : condition.severity === 3 ? '#f87171'
                                : condition.severity === 4 ? '#c084fc'
                                : '#94a3b8',
                              borderColor: condition.severity === 1 ? 'rgba(34, 197, 94, 0.4)'
                                : condition.severity === 2 ? 'rgba(245, 158, 11, 0.4)'
                                : condition.severity === 3 ? 'rgba(239, 68, 68, 0.4)'
                                : condition.severity === 4 ? 'rgba(168, 85, 247, 0.4)'
                                : 'rgba(71, 85, 105, 0.6)'
                            }}
                            className={clsx(
                              'px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider transition-all border',
                              'hover:scale-105 active:scale-95'
                            )}
                            title="Click to cycle severity"
                          >
                            {SEVERITY_LABELS[condition.severity ?? 0]}
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCondition(condition.id)}
                        className="p-1 text-slate-500 hover:text-error transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Remove ${condition.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedConditions.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Body systems:</span>
                    <span className="text-slate-300">
                      {new Set(selectedConditions.map(c => c.system)).size}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Bilateral eligible:</span>
                    <span className="text-slate-300">
                      {selectedConditions.filter(c => c.bilateralEligible).length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



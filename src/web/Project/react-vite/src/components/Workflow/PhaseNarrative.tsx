/**
 * VAULT DEM Engine — Phase: Personal Narrative
 * Veteran's statement in support of claim
 * 
 * UX: The typing area should feel like high-end stationery on a glass desk
 */

import { useMemo, useState } from 'react';
import { useClaimStore, useNarrative, useConditions } from '../../stores/claimStore';
import { Lightbulb, Copy, CheckCircle, Sparkles, Plus } from 'lucide-react';
import { detectConditionsFromNarrative, suggestRelatedConditions } from '../../lib/narrativeIntel';
import type { Condition, SelectedCondition } from '../../types';

const NARRATIVE_PROMPTS = [
  { title: 'Service Connection', prompt: 'Describe when and how your condition(s) started during service. Include specific incidents, dates, and locations if known.' },
  { title: 'Current Symptoms', prompt: 'Explain how your condition affects you today. Include frequency, severity, and specific limitations.' },
  { title: 'Daily Impact', prompt: 'Describe how your condition impacts your daily life, work, relationships, and ability to function.' },
  { title: 'Treatment History', prompt: "List any treatments, medications, or therapies you have tried. Note what has or hasn't helped." }
];

export default function PhaseNarrative() {
  const { setNarrative, addCondition } = useClaimStore();
  const narrative = useNarrative();
  const conditions = useConditions();
  const [copied, setCopied] = useState(false);

  const selectedNames = useMemo(() => conditions.map((c) => c.name), [conditions]);

  const mindReader = useMemo(() => {
    const detections = detectConditionsFromNarrative(narrative, 10);
    const selectedIds = new Set(conditions.map((c) => c.id));
    return detections.filter((d) => !selectedIds.has(d.condition.id)).slice(0, 6);
  }, [narrative, conditions]);

  const patternSuggestions = useMemo(() => {
    const suggested = suggestRelatedConditions(selectedNames, 10);
    const selectedIds = new Set(conditions.map((c) => c.id));
    return suggested.filter((c) => !selectedIds.has(c.id)).slice(0, 6);
  }, [selectedNames, conditions]);

  const addSuggestedCondition = (condition: Condition & { system: string }) => {
    const selected: SelectedCondition = {
      ...condition,
      system: condition.system as SelectedCondition['system'],
      selectedRating: undefined,
      side: undefined,
      isBilateral: false,
      notes: ''
    };
    addCondition(selected);
  };

  const handleCopy = async () => {
    if (narrative) {
      await navigator.clipboard.writeText(narrative);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const insertPrompt = (prompt: string) => {
    const newText = narrative ? `${narrative}\n\n${prompt}\n` : `${prompt}\n`;
    setNarrative(newText);
  };

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Phase 4</span>
        <h2 className="text-3xl font-serif text-slate-50 mt-2">Your Statement</h2>
        <p className="text-slate-400 mt-2">
          Write a personal statement supporting your claim. This becomes part of VA Form 21-4138.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {conditions.length > 0 && (
            <div className="mb-4 glass-premium rounded-2xl p-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Addressing these conditions:</p>
              <div className="flex flex-wrap gap-2">
                {conditions.map((c) => (
                  <span key={c.id} className="px-2 py-1 bg-brass/10 text-brass text-xs rounded-full border border-brass/20">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4 glass-premium rounded-2xl p-5">
            <h3 className="text-lg font-serif text-slate-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brass" />
              Mind Reader
            </h3>

            {mindReader.length > 0 ? (
              <div className="mb-5">
                <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-3">Detected from your writing</p>
                <div className="space-y-2">
                  {mindReader.map((d) => (
                    <button
                      key={d.condition.id}
                      className="w-full text-left p-3 glass-premium-interactive rounded-xl flex items-start justify-between gap-3"
                      onClick={() => addSuggestedCondition(d.condition)}
                    >
                      <div>
                        <div className="text-sm text-slate-100 font-medium">{d.condition.name}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Matched: {d.matchedKeywords.slice(0, 3).join(', ')}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 text-xs text-brass">
                        <Plus className="w-4 h-4" />
                        Add
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-5 p-4 bg-slate-900/20 border border-slate-800/40 rounded-xl text-sm text-slate-400">
                Start typing your statement and VAULT will suggest likely conditions based on your wording (offline).
              </div>
            )}

            {patternSuggestions.length > 0 ? (
              <div>
                <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-3">
                  Pattern Predictor (commonly linked)
                </p>
                <div className="flex flex-wrap gap-2">
                  {patternSuggestions.map((c) => (
                    <button
                      key={c.id}
                      className="px-3 py-2 bg-brass/10 text-brass text-xs rounded-full border border-brass/20 hover:border-brass/40 transition-apple"
                      onClick={() => addSuggestedCondition(c)}
                    >
                      + {c.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-500">
                Add a few conditions first and VAULT will suggest common linked claims.
              </div>
            )}
          </div>

          {/* THE STATIONERY — High-end writing surface on glass */}
          <div className="relative glass-premium rounded-2xl p-1">
            <div className="stationery-surface rounded-xl overflow-hidden">
              <textarea
                className="stationery-textarea w-full min-h-[400px] text-base leading-relaxed resize-none"
                placeholder="I am writing to support my claim for disability compensation..."
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
              />
            </div>
            <div className="absolute bottom-5 right-5 text-xs text-slate-500/70 pointer-events-none">
              {narrative.length.toLocaleString()} characters
            </div>
          </div>

          {narrative && (
            <button onClick={handleCopy} className="mt-4 btn btn-ghost btn-sm">
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy to clipboard
                </>
              )}
            </button>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-4">
            <div className="glass-premium rounded-2xl p-5">
              <h3 className="text-lg font-serif text-slate-100 mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-brass" />
                Writing Prompts
              </h3>
              <div className="space-y-3">
                {NARRATIVE_PROMPTS.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => insertPrompt(item.prompt)}
                    className="w-full text-left p-3 glass-premium-interactive rounded-xl"
                  >
                    <div className="text-sm text-slate-200 font-medium mb-1">{item.title}</div>
                    <div className="text-xs text-slate-500 line-clamp-2">{item.prompt}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



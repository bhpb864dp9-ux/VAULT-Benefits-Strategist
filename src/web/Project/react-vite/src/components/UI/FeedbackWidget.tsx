/**
 * VAULT Feedback Mechanism
 * Captures user insights to populate Theme Builder
 * 
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

import { useState } from 'react';
import { 
  MessageSquare, 
  Lightbulb, 
  AlertCircle, 
  Sparkles,
  Send,
  ChevronDown,
  X
} from 'lucide-react';

type FeedbackType = 'idea' | 'problem' | 'confusion' | 'delight';

interface FeedbackData {
  type: FeedbackType;
  context: string;
  painPoint: string;
  desiredOutcome: string;
  feeling: string;
  area: string;
  urgency: number;
}

const FEEDBACK_TYPES = [
  { 
    id: 'idea' as FeedbackType, 
    label: 'Feature Idea', 
    icon: Lightbulb, 
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/10',
    borderColor: 'border-amber-400/30'
  },
  { 
    id: 'problem' as FeedbackType, 
    label: 'Something Broken', 
    icon: AlertCircle, 
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30'
  },
  { 
    id: 'confusion' as FeedbackType, 
    label: 'Confusing', 
    icon: MessageSquare, 
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30'
  },
  { 
    id: 'delight' as FeedbackType, 
    label: 'Love This', 
    icon: Sparkles, 
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-400/10',
    borderColor: 'border-emerald-400/30'
  },
];

const FEATURE_AREAS = [
  { id: 'claim-flow', label: 'Claim Workflow' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'evidence', label: 'Evidence & Documents' },
  { id: 'body-map', label: 'Body Map' },
  { id: 'results', label: 'Results & Export' },
  { id: 'general', label: 'General / Other' },
];

const URGENCY_LEVELS = [
  { value: 1, label: 'Nice to have', description: 'When you get to it' },
  { value: 3, label: 'Would help', description: 'Improves my experience' },
  { value: 5, label: 'Important', description: 'I need this soon' },
  { value: 8, label: 'Critical', description: 'Blocking my progress' },
];

const FEELING_SUGGESTIONS = [
  'confident', 'empowered', 'understood', 'relieved', 
  'capable', 'supported', 'informed', 'in control'
];

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<Partial<FeedbackData>>({});

  const handleTypeSelect = (type: FeedbackType) => {
    setFeedback({ ...feedback, type });
    setStep(2);
  };

  const handleSubmit = () => {
    console.log('Feedback submitted:', feedback);
    
    const existing = JSON.parse(localStorage.getItem('vault_feedback') || '[]');
    existing.push({
      ...feedback,
      timestamp: new Date().toISOString(),
      id: crypto.randomUUID()
    });
    localStorage.setItem('vault_feedback', JSON.stringify(existing));
    
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setStep(1);
      setFeedback({});
    }, 2000);
  };

  const selectedType = FEEDBACK_TYPES.find(t => t.id === feedback.type);

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 
                   bg-gradient-to-r from-amber-500 to-amber-600 
                   text-slate-950 font-medium rounded-full
                   shadow-lg shadow-amber-500/20
                   hover:shadow-xl hover:shadow-amber-500/30
                   hover:scale-105 transition-all duration-200"
        aria-label="Send feedback"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="hidden sm:inline">Feedback</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/50 
                          rounded-2xl shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  {submitted ? 'Thank You!' : 'Share Your Thoughts'}
                </h2>
                <p className="text-sm text-slate-400">
                  {submitted 
                    ? 'Your feedback helps us serve veterans better.' 
                    : 'Help us make VAULT better for veterans'}
                </p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-400/10 
                                  flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-slate-300">Feedback received!</p>
                </div>
              ) : (
                <>
                  {/* Step 1: Type Selection */}
                  {step === 1 && (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400 mb-4">What kind of feedback?</p>
                      <div className="grid grid-cols-2 gap-3">
                        {FEEDBACK_TYPES.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => handleTypeSelect(type.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl border 
                                       ${type.borderColor} ${type.bgColor}
                                       hover:scale-[1.02] transition-all duration-200`}
                          >
                            <type.icon className={`w-5 h-5 ${type.color}`} />
                            <span className="text-slate-200 font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Details */}
                  {step === 2 && (
                    <div className="space-y-5">
                      {selectedType && (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full 
                                        ${selectedType.bgColor} ${selectedType.borderColor} border`}>
                          <selectedType.icon className={`w-4 h-4 ${selectedType.color}`} />
                          <span className="text-sm text-slate-300">{selectedType.label}</span>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          What were you trying to do?
                        </label>
                        <textarea
                          value={feedback.context || ''}
                          onChange={(e) => setFeedback({ ...feedback, context: e.target.value })}
                          placeholder="I was trying to..."
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 
                                     rounded-xl text-slate-200 placeholder-slate-500
                                     focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                     resize-none"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          What got in your way?
                        </label>
                        <textarea
                          value={feedback.painPoint || ''}
                          onChange={(e) => setFeedback({ ...feedback, painPoint: e.target.value })}
                          placeholder="The challenge was..."
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 
                                     rounded-xl text-slate-200 placeholder-slate-500
                                     focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                     resize-none"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Which area?
                        </label>
                        <div className="relative">
                          <select
                            value={feedback.area || ''}
                            onChange={(e) => setFeedback({ ...feedback, area: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 
                                       rounded-xl text-slate-200 appearance-none cursor-pointer
                                       focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                          >
                            <option value="">Select area...</option>
                            {FEATURE_AREAS.map((area) => (
                              <option key={area.id} value={area.id}>{area.label}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <button
                        onClick={() => setStep(3)}
                        disabled={!feedback.context || !feedback.area}
                        className="w-full py-3 bg-amber-500 text-slate-950 font-medium rounded-xl
                                   hover:bg-amber-400 transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </div>
                  )}

                  {/* Step 3: Outcome & Feeling */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          What would success look like?
                        </label>
                        <textarea
                          value={feedback.desiredOutcome || ''}
                          onChange={(e) => setFeedback({ ...feedback, desiredOutcome: e.target.value })}
                          placeholder="I wish I could..."
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 
                                     rounded-xl text-slate-200 placeholder-slate-500
                                     focus:outline-none focus:ring-2 focus:ring-amber-500/50
                                     resize-none"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          How would that make you feel?
                        </label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {FEELING_SUGGESTIONS.map((feeling) => (
                            <button
                              key={feeling}
                              onClick={() => setFeedback({ ...feedback, feeling })}
                              className={`px-3 py-1.5 rounded-full text-sm border transition-all
                                         ${feedback.feeling === feeling 
                                           ? 'bg-amber-500/20 border-amber-500 text-amber-400' 
                                           : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'}`}
                            >
                              {feeling}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={feedback.feeling || ''}
                          onChange={(e) => setFeedback({ ...feedback, feeling: e.target.value })}
                          placeholder="Or type your own..."
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 
                                     rounded-xl text-slate-200 placeholder-slate-500
                                     focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          How important is this?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {URGENCY_LEVELS.map((level) => (
                            <button
                              key={level.value}
                              onClick={() => setFeedback({ ...feedback, urgency: level.value })}
                              className={`p-3 rounded-xl border text-left transition-all
                                         ${feedback.urgency === level.value 
                                           ? 'bg-amber-500/20 border-amber-500' 
                                           : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'}`}
                            >
                              <div className={`text-sm font-medium ${feedback.urgency === level.value ? 'text-amber-400' : 'text-slate-200'}`}>
                                {level.label}
                              </div>
                              <div className="text-xs text-slate-500">{level.description}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setStep(2)}
                          className="flex-1 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl
                                     hover:bg-slate-700 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={!feedback.desiredOutcome || !feedback.feeling || !feedback.urgency}
                          className="flex-1 py-3 bg-amber-500 text-slate-950 font-medium rounded-xl
                                     hover:bg-amber-400 transition-colors flex items-center justify-center gap-2
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-4 h-4" />
                          Submit
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Progress Dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`w-2 h-2 rounded-full transition-all
                                   ${step >= s ? 'bg-amber-500' : 'bg-slate-700'}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-700/50 bg-slate-800/30">
              <p className="text-xs text-slate-500 text-center">
                🔒 Stored locally on your device • Security by Absence™
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
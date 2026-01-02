/**
 * VDIO Narrative Engine — Lay Evidence Wizard
 * Triggered when medical evidence is missing (38 CFR 3.159)
 *
 * Guides the user through creating competent lay testimony
 * to substitute for or supplement missing medical records.
 *
 * @vault-feature VDIO-LEW-001 Lay Evidence Generation
 * @legal-authority 38 CFR 3.159 (Competent Lay Evidence)
 * @legal-authority M21-1 III.iv.3.A (Considering Lay Evidence)
 */
import { useState, useMemo } from 'react';
import { FileText, Users, ChevronRight, ChevronLeft, Check, AlertCircle, Scale } from 'lucide-react';
import { useNarrativeStore, type LayEvidenceEntry } from '../../stores/narrativeStore';
import type { GapResult } from '../../stores/narrativeStore';

interface LayEvidenceWizardProps {
  gap: GapResult;
  onComplete: (entry: LayEvidenceEntry) => void;
  onSkip?: () => void;
}

// Wizard steps
type WizardStep = 'intro' | 'witness' | 'observations' | 'timeline' | 'impact' | 'review';

const STEP_ORDER: WizardStep[] = ['intro', 'witness', 'observations', 'timeline', 'impact', 'review'];

// Prompts tailored to common condition types
const OBSERVATION_PROMPTS: Record<string, string[]> = {
  mental: [
    'Describe changes in mood, behavior, or personality you have observed.',
    'How has their sleep pattern changed?',
    'Have you noticed them avoiding certain situations or places?',
    'Describe any nightmares, flashbacks, or panic attacks you have witnessed.',
    'How do they handle stress compared to before their service?',
  ],
  musculoskeletal: [
    'Describe how their movement or mobility has changed.',
    'What activities can they no longer perform or have difficulty with?',
    'How often do you observe them in visible pain?',
    'Do they use any assistive devices (cane, brace, etc.)?',
    'How does the condition affect their ability to work or do household tasks?',
  ],
  respiratory: [
    'How has their breathing changed?',
    'Do they use a CPAP, inhaler, or supplemental oxygen?',
    'Describe any snoring, gasping, or breathing interruptions during sleep.',
    'How does their condition affect their physical activity level?',
  ],
  neurological: [
    'Describe any headaches, dizziness, or balance issues you have observed.',
    'Have you noticed changes in their memory or concentration?',
    'Describe any numbness, tingling, or weakness they experience.',
    'Have you witnessed any seizures or episodes?',
  ],
  auditory: [
    'How has their hearing changed?',
    'Do they have difficulty following conversations?',
    'Have they mentioned ringing or buzzing in their ears?',
    'How has this affected their daily life and communication?',
  ],
  default: [
    'Describe the symptoms you have personally observed.',
    'How often do these symptoms occur?',
    'How severe are the symptoms at their worst?',
    'How has this condition changed over time?',
    'What limitations does this condition cause in daily life?',
  ],
};

export default function LayEvidenceWizard({ gap, onComplete, onSkip }: LayEvidenceWizardProps) {
  const { addLayEvidence } = useNarrativeStore();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>('intro');
  const [witnessName, setWitnessName] = useState('');
  const [witnessRelation, setWitnessRelation] = useState('');
  const [observations, setObservations] = useState('');
  const [timeline, setTimeline] = useState('');
  const [impact, setImpact] = useState('');
  
  const stepIndex = STEP_ORDER.indexOf(currentStep);
  
  // Determine condition category for tailored prompts
  const conditionCategory = useMemo(() => {
    const id = gap.conditionId.toLowerCase();
    if (['ptsd', 'mdd', 'gad', 'bipolar', 'anxiety', 'depression', 'mst', 'insomnia'].some(k => id.includes(k))) {
      return 'mental';
    }
    if (['lumbar', 'cervical', 'knee', 'shoulder', 'back', 'hip', 'ankle', 'arthritis'].some(k => id.includes(k))) {
      return 'musculoskeletal';
    }
    if (['asthma', 'copd', 'sleep', 'apnea', 'respiratory', 'sinusitis'].some(k => id.includes(k))) {
      return 'respiratory';
    }
    if (['tbi', 'migraine', 'neuropathy', 'radiculopathy', 'vertigo', 'seizure'].some(k => id.includes(k))) {
      return 'neurological';
    }
    if (['tinnitus', 'hearing', 'auditory', 'menieres'].some(k => id.includes(k))) {
      return 'auditory';
    }
    return 'default';
  }, [gap.conditionId]);
  
  const prompts = OBSERVATION_PROMPTS[conditionCategory] || OBSERVATION_PROMPTS.default;
  
  const goNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  };
  
  const goBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
    }
  };
  
  const canProceed = (): boolean => {
    switch (currentStep) {
      case 'intro': return true;
      case 'witness': return witnessName.trim().length > 0 && witnessRelation.trim().length > 0;
      case 'observations': return observations.trim().length > 50;
      case 'timeline': return timeline.trim().length > 20;
      case 'impact': return impact.trim().length > 20;
      case 'review': return true;
      default: return false;
    }
  };
  
  const buildStatement = (): string => {
    return `LAY/WITNESS STATEMENT (VA Form 21-10210)

WITNESS INFORMATION
Witness Name: ${witnessName}
Relationship to Veteran: ${witnessRelation}

CONDITION ADDRESSED
${gap.conditionName}

PERSONAL OBSERVATIONS
${observations}

TIMELINE OF OBSERVATIONS
${timeline}

IMPACT ON DAILY LIFE
${impact}

DECLARATION
I declare under penalty of perjury that the foregoing is true and correct to the best of my knowledge and belief.

Signature: ___________________________
Date: ${new Date().toLocaleDateString()}
Printed Name: ${witnessName}

---
LEGAL AUTHORITY:
• 38 CFR § 3.159 - Lay evidence is competent to establish observable symptoms
• VBA Manual M21-1 III.iv.3.A - Lay evidence must be considered
`;
  };
  
  const handleComplete = () => {
    const entry: LayEvidenceEntry = {
      id: `lay_${gap.conditionId}_${Date.now().toString(36)}`,
      conditionId: gap.conditionId,
      witnessName,
      witnessRelation,
      statement: buildStatement(),
      createdAt: new Date().toISOString(),
    };
    
    addLayEvidence(entry);
    onComplete(entry);
  };
  
  return (
    <div className="glass-panel">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-500/10 rounded-xl">
          <Users className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-slate-200">Lay Evidence Wizard</h3>
          <p className="text-sm text-slate-400">
            Creating statement for: <span className="text-brass">{gap.conditionName}</span>
          </p>
        </div>
      </div>
      
      {/* Progress */}
      <div className="flex items-center gap-2 mb-6">
        {STEP_ORDER.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
              i < stepIndex ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
              i === stepIndex ? 'bg-brass/20 text-brass border border-brass/40' :
              'bg-slate-800/50 text-slate-500 border border-slate-700/50'
            }`}>
              {i < stepIndex ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            {i < STEP_ORDER.length - 1 && (
              <div className={`w-8 h-0.5 mx-1 ${i < stepIndex ? 'bg-emerald-500/40' : 'bg-slate-700/50'}`} />
            )}
          </div>
        ))}
      </div>
      
      {/* Step Content */}
      <div className="min-h-[300px]">
        {currentStep === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-amber-400">Evidence Gap Detected</h4>
                  <p className="text-sm text-slate-300 mt-1">
                    We found limited medical evidence for <strong>{gap.conditionName}</strong> in your uploaded documents.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-slate-300">
              Under <span className="text-brass font-medium">38 CFR § 3.159</span>, lay evidence from family members, 
              friends, or fellow service members is competent to establish:
            </p>
            
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                Observable symptoms (pain, behavior changes, limitations)
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                Timeline of when symptoms appeared
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                Impact on daily activities and work
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 mt-0.5" />
                Changes observed over time
              </li>
            </ul>
            
            <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Scale className="w-4 h-4 text-brass" />
                <span>This wizard will help you create a properly formatted lay statement.</span>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'witness' && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-200">Witness Information</h4>
            <p className="text-sm text-slate-400">
              Who is providing this statement? This can be a spouse, family member, friend, coworker, 
              or fellow service member who has observed your condition.
            </p>
            
            <div className="space-y-4">
              <div className="form-group">
                <label className="label">Witness Full Name</label>
                <input
                  className="input"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                />
              </div>
              
              <div className="form-group">
                <label className="label">Relationship to Veteran</label>
                <input
                  className="input"
                  value={witnessRelation}
                  onChange={(e) => setWitnessRelation(e.target.value)}
                  placeholder="e.g., Spouse, Friend, Former Squadmate"
                />
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'observations' && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-200">Observations</h4>
            <p className="text-sm text-slate-400">
              Describe what you have personally observed. Be specific about symptoms, behaviors, and changes.
            </p>
            
            <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Helpful Prompts</p>
              <ul className="text-sm text-slate-400 space-y-1">
                {prompts.slice(0, 4).map((prompt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-brass">•</span>
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="form-group">
              <label className="label">Your Observations</label>
              <textarea
                className="textarea min-h-[150px]"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="Describe what you have personally witnessed..."
              />
              <p className="text-xs text-slate-500 mt-1">
                {observations.length} characters (minimum 50 recommended)
              </p>
            </div>
          </div>
        )}
        
        {currentStep === 'timeline' && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-200">Timeline</h4>
            <p className="text-sm text-slate-400">
              When did you first notice these symptoms? How have they changed over time?
            </p>
            
            <div className="form-group">
              <label className="label">Timeline of Observations</label>
              <textarea
                className="textarea min-h-[120px]"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g., I first noticed changes in [year]. Over the past [time period], the symptoms have..."
              />
            </div>
          </div>
        )}
        
        {currentStep === 'impact' && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-200">Daily Life Impact</h4>
            <p className="text-sm text-slate-400">
              How has this condition affected their daily life, work, relationships, and activities?
            </p>
            
            <div className="form-group">
              <label className="label">Functional Impact</label>
              <textarea
                className="textarea min-h-[120px]"
                value={impact}
                onChange={(e) => setImpact(e.target.value)}
                placeholder="Describe how this condition affects their ability to work, maintain relationships, perform daily tasks..."
              />
            </div>
          </div>
        )}
        
        {currentStep === 'review' && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-slate-200">Review Statement</h4>
            <p className="text-sm text-slate-400">
              Review the statement below. This will be included in your evidence package.
            </p>
            
            <div className="p-4 bg-slate-900/50 border border-slate-700/50 rounded-xl max-h-[300px] overflow-y-auto">
              <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono">
                {buildStatement()}
              </pre>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Check className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-emerald-400">
                This statement cites proper legal authority and will strengthen your claim.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700/50">
        <div>
          {stepIndex > 0 && (
            <button className="btn btn-ghost" onClick={goBack}>
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
          {stepIndex === 0 && onSkip && (
            <button className="btn btn-ghost text-slate-500" onClick={onSkip}>
              Skip for now
            </button>
          )}
        </div>
        
        <div>
          {currentStep === 'review' ? (
            <button
              className="btn btn-primary"
              onClick={handleComplete}
            >
              <FileText className="w-4 h-4" />
              Save Statement
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={goNext}
              disabled={!canProceed()}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { LayEvidenceWizard };


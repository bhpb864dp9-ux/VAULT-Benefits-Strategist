/**
 * VDIO Narrative Engine — Exam Pre-Brief Card Component
 * Displays C&P exam preparation information for a condition.
 *
 * @vault-feature VDIO-EPB-UI-001 Exam Prep Display
 */
import { useState } from 'react';
import { ClipboardCheck, ChevronDown, ChevronUp, HelpCircle, Ruler, FileText, Lightbulb, Download } from 'lucide-react';
import type { ExamPreBrief } from '../../stores/narrativeStore';
import { formatExamPreBriefText } from '../../lib/examPreBrief';

interface ExamPreBriefCardProps {
  preBrief: ExamPreBrief;
  defaultExpanded?: boolean;
}

export default function ExamPreBriefCard({ preBrief, defaultExpanded = false }: ExamPreBriefCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  const handleDownload = () => {
    const text = formatExamPreBriefText(preBrief);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `C&P_Prep_${preBrief.conditionName.replace(/\s/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="glass-panel overflow-hidden">
      {/* Header */}
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-medium text-slate-200">{preBrief.conditionName}</h4>
            <p className="text-xs text-slate-400">{preBrief.dbqForm}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleDownload(); }}
            className="p-2 hover:bg-slate-700/50 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            title="Download Prep Sheet"
          >
            <Download className="w-4 h-4" />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>
      
      {/* Content */}
      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Key Questions */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-brass" />
              <h5 className="text-sm font-medium text-slate-300">Questions to Expect</h5>
            </div>
            <ul className="space-y-1">
              {preBrief.keyQuestions.map((q, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-brass mt-0.5">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </section>
          
          {/* Measurements */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="w-4 h-4 text-brass" />
              <h5 className="text-sm font-medium text-slate-300">Required Measurements</h5>
            </div>
            <ul className="space-y-1">
              {preBrief.measurementsNeeded.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                  <span className="text-emerald-400">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </section>
          
          {/* Documents to Mention */}
          {preBrief.documentsToMention.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-brass" />
                <h5 className="text-sm font-medium text-slate-300">Documents in Your File</h5>
              </div>
              <ul className="space-y-1">
                {preBrief.documentsToMention.map((d, i) => (
                  <li key={i} className="text-sm text-slate-400 pl-4">
                    {d}
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {/* Tips */}
          <section className="bg-brass/5 border border-brass/20 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-brass" />
              <h5 className="text-sm font-medium text-brass">Exam Tips</h5>
            </div>
            <ul className="space-y-1">
              {preBrief.tipsForVeteran.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-brass">★</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}

/**
 * List of all exam pre-briefs with bulk download
 */
interface ExamPreBriefListProps {
  preBriefs: ExamPreBrief[];
}

export function ExamPreBriefList({ preBriefs }: ExamPreBriefListProps) {
  const handleDownloadAll = () => {
    const text = preBriefs.map(formatExamPreBriefText).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `C&P_Exam_Package_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  if (preBriefs.length === 0) {
    return (
      <div className="glass-panel p-6 text-center">
        <ClipboardCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400">No conditions selected for exam preparation.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-200 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5 text-emerald-400" />
          C&P Exam Preparation
        </h3>
        <button
          onClick={handleDownloadAll}
          className="btn btn-ghost text-sm"
        >
          <Download className="w-4 h-4" />
          Download All
        </button>
      </div>
      
      <div className="space-y-3">
        {preBriefs.map((preBrief) => (
          <ExamPreBriefCard key={preBrief.conditionId} preBrief={preBrief} />
        ))}
      </div>
    </div>
  );
}

export { ExamPreBriefCard };


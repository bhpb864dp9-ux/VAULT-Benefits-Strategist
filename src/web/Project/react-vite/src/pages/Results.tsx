/**
 * VAULT DEM Engine — Results Page
 * Final results with form download
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useClaimStore, useConditions } from '../stores/claimStore';
import { useVASRDCalculator } from '../hooks';
import { generateAllForms, downloadForm } from '../lib/formGenerator';
import { 
  Download, FileText, CheckCircle, Printer, 
  ArrowLeft, Share2, AlertTriangle
} from 'lucide-react';
import type { GeneratedForm } from '../types';

export default function Results() {
  const { data } = useClaimStore();
  const conditions = useConditions();
  const { combined, compensation, tdiu, smc, demScore } = useVASRDCalculator();
  
  const [generating, setGenerating] = useState(false);
  const [generatedForms, setGeneratedForms] = useState<GeneratedForm[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateForms = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const forms = await generateAllForms(data);
      setGeneratedForms(forms);
    } catch (e) {
      setError('Failed to generate forms. Please try again.');
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadForm = (form: GeneratedForm) => {
    downloadForm(form);
  };

  const handleDownloadAll = () => {
    generatedForms.forEach(form => {
      setTimeout(() => downloadForm(form), 100);
    });
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-wide">
        {/* Back Link */}
        <Link 
          to="/claim/review" 
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-brass mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Review
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <span className="eyebrow">DEM Analysis Complete</span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-50 mt-4 mb-4">
            Your Claim Package
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Download your auto-filled VA forms and claim evidence checklist
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Rating Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Rating Card */}
            <div className="card bg-gradient-to-br from-slate-900 to-slate-950 border-brass/30">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <p className="text-sm text-slate-400 mb-2">Combined Rating</p>
                  <p className="text-5xl font-serif text-brass">{combined.combined}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">Monthly (Est.)</p>
                  <p className="text-5xl font-serif text-success">
                    ${compensation.monthly.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-2">DEM Score</p>
                  <p className="text-5xl font-serif text-slate-100">{demScore}</p>
                </div>
              </div>

              {/* TDIU / SMC Badges */}
              {(tdiu.eligible || smc.some(s => s.eligible)) && (
                <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-3 justify-center">
                  {tdiu.eligible && (
                    <span className="px-3 py-1 bg-success/20 text-success text-sm font-medium">
                      TDIU Eligible
                    </span>
                  )}
                  {smc.filter(s => s.eligible).map(s => (
                    <span key={s.type} className="px-3 py-1 bg-brass/20 text-brass text-sm font-medium">
                      {s.type} Eligible
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Conditions Summary */}
            <div className="card">
              <h3 className="text-lg font-serif text-slate-100 mb-4">
                Conditions Claimed ({conditions.length})
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {conditions.map(condition => (
                  <div 
                    key={condition.id}
                    className="flex items-center gap-3 p-3 bg-slate-800/50"
                  >
                    <CheckCircle className="w-4 h-4 text-brass flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-200">{condition.name}</p>
                      <p className="text-xs text-slate-500">DBQ: {condition.dbq}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Generation */}
            <div className="card">
              <h3 className="text-lg font-serif text-slate-100 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brass" />
                Generated Forms
              </h3>

              {generatedForms.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-6">
                    Click below to generate your pre-filled VA forms
                  </p>
                  <button
                    onClick={handleGenerateForms}
                    disabled={generating}
                    className="btn btn-primary"
                  >
                    {generating ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        Generate All Forms
                      </>
                    )}
                  </button>
                  
                  {error && (
                    <p className="mt-4 text-sm text-error flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {error}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {generatedForms.map(form => (
                    <div 
                      key={form.formId}
                      className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700"
                    >
                      <div>
                        <p className="text-slate-200 font-medium">VA Form {form.formId}</p>
                        <p className="text-xs text-slate-500">{form.formName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 ${
                          form.status === 'ready' ? 'bg-success/20 text-success' :
                          form.status === 'incomplete' ? 'bg-warning/20 text-warning' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {form.completionPercentage}% complete
                        </span>
                        <button
                          onClick={() => handleDownloadForm(form)}
                          className="btn btn-ghost btn-sm"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Download All */}
                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={handleDownloadAll}
                      className="btn btn-primary flex-1"
                    >
                      <Download className="w-4 h-4" />
                      Download All Forms
                    </button>
                    <button className="btn btn-ghost">
                      <Printer className="w-4 h-4" />
                      Print
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Next Steps */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              {/* Next Steps Card */}
              <div className="card">
                <h4 className="text-lg font-serif text-slate-100 mb-4">
                  Next Steps
                </h4>
                <ol className="space-y-4">
                  <NextStep number={1} title="Review Your Forms">
                    Check all generated forms for accuracy. Add any missing details.
                  </NextStep>
                  <NextStep number={2} title="Gather Evidence">
                    Collect medical records, DBQs, and buddy statements.
                  </NextStep>
                  <NextStep number={3} title="Consider Representation">
                    A VSO or attorney can help strengthen your claim.
                  </NextStep>
                  <NextStep number={4} title="Submit to VA">
                    File online at VA.gov or mail to your regional office.
                  </NextStep>
                </ol>
              </div>

              {/* Share */}
              <div className="card">
                <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                  Share VAULT
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  Help other veterans access free claim tools
                </p>
                <button className="btn btn-ghost btn-sm w-full">
                  <Share2 className="w-4 h-4" />
                  Share with a Veteran
                </button>
              </div>

              {/* Disclaimer */}
              <div className="text-xs text-slate-600 p-4 bg-slate-900/50 border border-slate-800">
                <p>
                  <strong className="text-slate-500">Disclaimer:</strong> This tool provides 
                  estimates only. Actual VA ratings depend on C&P examination results and 
                  VA adjudication. Not legal or medical advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NextStep({ 
  number, 
  title, 
  children 
}: { 
  number: number; 
  title: string; 
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3">
      <span className="w-6 h-6 flex items-center justify-center bg-brass/20 text-brass text-sm font-medium flex-shrink-0">
        {number}
      </span>
      <div>
        <p className="text-slate-200 font-medium text-sm">{title}</p>
        <p className="text-xs text-slate-500 mt-1">{children}</p>
      </div>
    </li>
  );
}



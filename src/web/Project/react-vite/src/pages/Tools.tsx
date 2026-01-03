/**
 * VAULT DEM Engine — Tools
 * Offline utilities to strengthen a claim (exports local files only).
 *
 * @vault-feature VAULT-F-DG-001 Buddy Statement Generator
 * @vault-feature VAULT-F-DG-002 Service Timeline Builder + Export
 * @vault-feature VAULT-F-LC-001 Legal Citation Machine
 * @vault-feature VAULT-F-DBQ-001 DBQ Template Library
 * @vault-feature VAULT-F-NX-001 Nexus Letter Template
 */
import { useMemo, useState } from 'react';
import { useBattleBuddy, useClaimStore, useConditions, useIdentity, useTimeline, useUploadedFiles } from '../stores/claimStore';
import { downloadTextFile } from '../lib/download';
import { buildBuddyStatementText, buildTimelineText, safeFilenamePart } from '../lib/artifacts';
import { FileText, CalendarClock, Plus, Trash2, Users, Scale, ClipboardList, FileSignature, ExternalLink, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import type { TimelineEvent, TimelineEventType } from '../types';
import CitationPanel from '../components/Tools/CitationPanel';
import { type EvidenceRecord, DBQ_TEMPLATES, NEXUS_LETTER_TEMPLATE, getDBQForCondition, VBA_POLICY, CFR_REGULATIONS } from '../lib/legalCitations';

// Helper to infer evidence type from file name/type
function inferEvidenceType(fileName: string, mimeType: string): EvidenceRecord['type'] {
  const lower = fileName.toLowerCase();
  if (lower.includes('blue') || lower.includes('button') || lower.includes('myhealthevet')) return 'blue_button';
  if (lower.includes('c-file') || lower.includes('cfile') || lower.includes('claims file')) return 'c_file';
  if (lower.includes('military') || lower.includes('str') || lower.includes('service treatment')) return 'military_medical';
  if (lower.includes('buddy') || lower.includes('lay statement')) return 'buddy_statement';
  if (lower.includes('nexus') || lower.includes('imo')) return 'nexus';
  if (lower.includes('dbq') || lower.includes('21-0960')) return 'dbq';
  if (mimeType.includes('pdf') || mimeType.includes('image')) return 'private_medical';
  return 'other';
}

const TIMELINE_TYPES: { id: TimelineEventType; label: string }[] = [
  { id: 'service', label: 'Service Event' },
  { id: 'medical', label: 'Medical' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'life', label: 'Life Impact' }
];

export default function Tools() {
  const identity = useIdentity();
  const conditions = useConditions();
  const battleBuddy = useBattleBuddy();
  const timeline = useTimeline();
  const uploadedFiles = useUploadedFiles();
  const { addTimelineEvent, removeTimelineEvent, clearTimeline, addAudit, showToast } = useClaimStore();

  // Buddy statement
  const [witnessName, setWitnessName] = useState(battleBuddy?.name || '');
  const [witnessRelation, setWitnessRelation] = useState(battleBuddy?.relation || '');
  const [observations, setObservations] = useState('');

  // UI State
  const [expandedDbq, setExpandedDbq] = useState<string | null>(null);
  const [showNexusTemplate, setShowNexusTemplate] = useState(false);

  const conditionList = useMemo(() => conditions.map(c => c.name), [conditions]);

  // Convert uploaded files to evidence records format for citations
  const evidenceRecords: EvidenceRecord[] = useMemo(() => 
    uploadedFiles.map(f => ({
      id: f.id,
      fileName: f.name,
      type: inferEvidenceType(f.name, f.type),
      uploadedAt: f.uploadedAt,
      processedAt: f.processed ? f.uploadedAt : undefined,
      extractedData: f.ocrResult ? {
        dates: f.ocrResult.dates,
        diagnoses: f.ocrResult.diagnoses,
        providers: f.ocrResult.providers,
        icd10Codes: f.ocrResult.icd10Codes
      } : undefined,
      linkedConditions: conditionList,
      linkedCitations: [],
      provenanceChain: [
        { timestamp: f.uploadedAt, event: 'uploaded', detail: `File uploaded: ${f.name}` },
        ...(f.processed ? [{ timestamp: f.uploadedAt, event: 'processed' as const, detail: 'OCR processing complete' }] : [])
      ]
    }))
  , [uploadedFiles, conditionList]);

  // Get recommended DBQs based on selected conditions
  const recommendedDbqs = useMemo(() => {
    const dbqs = new Set<string>();
    conditions.forEach(c => {
      const dbq = getDBQForCondition(c.id);
      if (dbq) dbqs.add(dbq.id);
    });
    return DBQ_TEMPLATES.filter(d => dbqs.has(d.id));
  }, [conditions]);

  const generateBuddyStatement = () => {
    const content = buildBuddyStatementText({
      veteranName: identity.name || 'Veteran',
      witnessName,
      witnessRelationship: witnessRelation,
      conditions: conditionList,
      observations,
      evidenceRecords,
      includeCitations: true
    });

    const veteranSafe = safeFilenamePart(identity.name || 'Veteran');
    const witnessSafe = safeFilenamePart(witnessName || 'Witness');
    downloadTextFile(`Buddy_Statement_${veteranSafe}_${witnessSafe}.txt`, content);

    addAudit('Buddy Statement Generated', `${witnessName || 'Witness'} with ${evidenceRecords.length} evidence records`);
    showToast('Buddy statement downloaded with legal citations', 'success');
  };

  // Timeline builder
  const [eventType, setEventType] = useState<TimelineEventType>('service');
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventNotes, setEventNotes] = useState('');

  const addEvent = () => {
    if (!eventTitle.trim()) {
      showToast('Add a title for the timeline event', 'warning');
      return;
    }
    const e: TimelineEvent = {
      id: `tl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
      type: eventType,
      date: eventDate || undefined,
      title: eventTitle.trim(),
      notes: eventNotes.trim() || undefined
    };
    addTimelineEvent(e);
    setEventTitle('');
    setEventNotes('');
    setEventDate('');
  };

  const exportTimeline = () => {
    const content = buildTimelineText({
      veteranName: identity.name || 'Veteran',
      events: timeline,
      conditions: conditionList,
      evidenceRecords,
      includeCitations: true
    });
    const veteranSafe = safeFilenamePart(identity.name || 'Veteran');
    downloadTextFile(`Service_Timeline_${veteranSafe}.txt`, content);
    addAudit('Timeline Exported', `${timeline.length} events with ${evidenceRecords.length} evidence records`);
    showToast('Timeline exported with legal citations', 'success');
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container-wide">
        <div className="mb-10">
          <span className="eyebrow">Tools</span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-50 mt-4">
            Claim Tools (Offline)
          </h1>
          <p className="text-slate-400 mt-3 max-w-2xl">
            These utilities generate files locally on your device. Nothing is uploaded.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buddy Statement */}
          <div className="card">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-brass mt-0.5" />
              <div className="flex-1">
                <h3 className="text-xl font-serif text-slate-100">Buddy Statement Generator</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Create a lay statement capturing observed symptoms and functional impact.
                </p>

                {battleBuddy?.enabled && (
                  <div className="mt-4 p-4 bg-brass/5 border border-brass/20 rounded-2xl flex items-start gap-2">
                    <Users className="w-4 h-4 text-brass mt-0.5" />
                    <p className="text-xs text-slate-300">
                      Battle Buddy Mode is on — we prefilled witness name/relationship if available.
                    </p>
                  </div>
                )}

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Witness Name</label>
                    <input className="input" value={witnessName} onChange={(e) => setWitnessName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="label">Relationship</label>
                    <input className="input" value={witnessRelation} onChange={(e) => setWitnessRelation(e.target.value)} />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="label">Observations</label>
                    <textarea className="textarea" value={observations} onChange={(e) => setObservations(e.target.value)} />
                    <p className="text-xs text-slate-500 mt-2">
                      Tip: include onset, frequency, worst-day severity, and impact on work/daily life.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="btn btn-primary" onClick={generateBuddyStatement}>
                    Download Statement
                  </button>
                  <button className="btn btn-ghost" onClick={() => setObservations('')}>
                    Clear
                  </button>
                </div>

                {/* Real-time Legal Citations for Buddy Statement */}
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <CitationPanel
                    conditions={conditionList}
                    evidenceRecords={evidenceRecords}
                    additionalCitations={[VBA_POLICY.find(c => c.id === 'M21-1-III.iv.3.A')!]}
                    title="Legal Authority for Lay Evidence"
                    compact
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Builder */}
          <div className="card">
            <div className="flex items-start gap-3">
              <CalendarClock className="w-5 h-5 text-brass mt-0.5" />
              <div className="flex-1">
                <h3 className="text-xl font-serif text-slate-100">Service Timeline Builder</h3>
                <p className="text-sm text-slate-400 mt-2">
                  Build a chronological chain from service events → onset → treatment → current severity.
                </p>

                <div className="mt-6 grid md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Type</label>
                    <select className="input" value={eventType} onChange={(e) => setEventType(e.target.value as TimelineEventType)}>
                      {TIMELINE_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Date (optional)</label>
                    <input className="input" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="label">Title</label>
                    <input className="input" value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="e.g., Knee injury during PT, Deployed to Iraq, MRI confirms…"/>
                  </div>
                  <div className="form-group md:col-span-2">
                    <label className="label">Notes (optional)</label>
                    <textarea className="textarea" value={eventNotes} onChange={(e) => setEventNotes(e.target.value)} />
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <button className="btn btn-primary" onClick={addEvent}>
                    <Plus className="w-4 h-4" />
                    Add Event
                  </button>
                  <button className="btn btn-ghost" onClick={exportTimeline} disabled={!timeline.length}>
                    Export Timeline
                  </button>
                  <button className="btn btn-ghost" onClick={clearTimeline} disabled={!timeline.length}>
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  {timeline.length === 0 ? (
                    <p className="text-sm text-slate-500">No events yet.</p>
                  ) : (
                    [...timeline]
                      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
                      .map((e) => (
                        <div key={e.id} className="p-4 bg-slate-900/35 border border-slate-800/60 rounded-2xl flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm text-slate-100 font-medium">
                              {(e.date || 'Unknown date')}{' '}
                              <span className="text-xs text-slate-500">• {e.type}</span>
                            </p>
                            <p className="text-slate-300 mt-1">{e.title}</p>
                            {e.notes && <p className="text-sm text-slate-400 mt-2">{e.notes}</p>}
                          </div>
                          <button className="btn btn-ghost btn-sm" onClick={() => removeTimelineEvent(e.id)} aria-label="Remove event">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                  )}
                </div>

                {/* Real-time Legal Citations for Timeline */}
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <CitationPanel
                    conditions={conditionList}
                    evidenceRecords={evidenceRecords}
                    additionalCitations={[CFR_REGULATIONS.find(c => c.id === 'CFR-3.303')!]}
                    title="Legal Authority for Service Connection"
                    compact
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            DBQ TEMPLATES SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardList className="w-6 h-6 text-brass" />
            <h2 className="text-2xl font-serif text-slate-100">DBQ Templates</h2>
          </div>
          <p className="text-slate-400 mb-6 max-w-3xl">
            Disability Benefits Questionnaires (DBQs) are standardized forms used to evaluate specific conditions.
            Based on your selected conditions, we recommend the following DBQs:
          </p>

          {recommendedDbqs.length > 0 && (
            <div className="mb-6 p-4 bg-brass/5 border border-brass/20 rounded-2xl">
              <div className="flex items-center gap-2 text-brass font-medium mb-2">
                <Scale className="w-4 h-4" />
                Recommended for Your Conditions
              </div>
              <div className="flex flex-wrap gap-2">
                {recommendedDbqs.map(dbq => (
                  <span key={dbq.id} className="px-3 py-1 bg-brass/10 text-brass text-sm rounded-full border border-brass/30">
                    {dbq.formNumber}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DBQ_TEMPLATES.map(dbq => (
              <div key={dbq.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-brass font-medium bg-brass/10 px-2 py-0.5 rounded-full">
                        {dbq.formNumber}
                      </span>
                      {recommendedDbqs.find(r => r.id === dbq.id) && (
                        <span className="text-xs text-emerald-400 font-medium">✓ Recommended</span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-slate-200">{dbq.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">Body System: {dbq.bodySystem}</p>
                  </div>
                  <button
                    onClick={() => setExpandedDbq(expandedDbq === dbq.id ? null : dbq.id)}
                    className="btn btn-ghost btn-sm"
                    aria-label={expandedDbq === dbq.id ? 'Collapse' : 'Expand'}
                  >
                    {expandedDbq === dbq.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {expandedDbq === dbq.id && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400 mb-3">{dbq.description}</p>
                    <div className="mb-3">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Key Fields</p>
                      <ul className="text-xs text-slate-400 space-y-1">
                        {dbq.keyFields.map((field, idx) => (
                          <li key={idx}>• {field}</li>
                        ))}
                      </ul>
                    </div>
                    <a
                      href={dbq.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm w-full"
                    >
                      <FileText className="w-4 h-4" />
                      Download DBQ Form
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            NEXUS LETTER TEMPLATE SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-6">
            <FileSignature className="w-6 h-6 text-brass" />
            <h2 className="text-2xl font-serif text-slate-100">Nexus Letter Template</h2>
          </div>
          <p className="text-slate-400 mb-6 max-w-3xl">
            A nexus letter is a medical opinion that connects your current condition to your military service.
            This template provides the structure required by the VA for nexus opinions.
          </p>

          <div className="card">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-brass" />
                  <h3 className="text-lg font-medium text-slate-200">{NEXUS_LETTER_TEMPLATE.title}</h3>
                </div>
                <p className="text-sm text-slate-400">
                  {NEXUS_LETTER_TEMPLATE.legalStandard}
                </p>
              </div>
              <button
                onClick={() => setShowNexusTemplate(!showNexusTemplate)}
                className="btn btn-ghost btn-sm"
                aria-label={showNexusTemplate ? 'Collapse' : 'Expand'}
              >
                {showNexusTemplate ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {showNexusTemplate && (
              <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-4">
                {NEXUS_LETTER_TEMPLATE.sections.map((section, idx) => (
                  <div key={idx} className="p-4 bg-slate-900/40 border border-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-brass bg-brass/10 rounded-full">
                        {idx + 1}
                      </span>
                      <h4 className="font-medium text-slate-200">{section.name}</h4>
                      {section.required && (
                        <span className="text-xs text-red-400 font-medium">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{section.description}</p>
                    <pre className="text-xs text-slate-500 bg-slate-950/50 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                      {section.placeholder}
                    </pre>
                  </div>
                ))}

                {/* Legal Citations for Nexus */}
                <div className="mt-6">
                  <CitationPanel
                    additionalCitations={NEXUS_LETTER_TEMPLATE.citations}
                    title="Legal Authority for Nexus Opinions"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            EVIDENCE RECORDS & PROVENANCE SECTION
            ═══════════════════════════════════════════════════════════════════ */}
        {evidenceRecords.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-brass" />
              <h2 className="text-2xl font-serif text-slate-100">Uploaded Evidence Records</h2>
            </div>
            <p className="text-slate-400 mb-6 max-w-3xl">
              These records have been processed and linked to your claim. Each record establishes provenance 
              for your evidence chain.
            </p>

            <div className="space-y-4">
              {evidenceRecords.map(record => (
                <div key={record.id} className="card">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brass/10 rounded-xl">
                      <FileText className="w-5 h-5 text-brass" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-slate-200">{record.fileName}</h4>
                        <span className="text-xs text-slate-500 bg-slate-800/50 px-2 py-0.5 rounded-full">
                          {record.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Uploaded: {new Date(record.uploadedAt).toLocaleString()}
                      </p>

                      {record.extractedData && (
                        <div className="mt-3 p-3 bg-slate-900/40 rounded-lg">
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Extracted Data (OCR)</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {record.extractedData.dates.length > 0 && (
                              <div>
                                <span className="text-slate-500">Dates:</span>{' '}
                                <span className="text-slate-300">{record.extractedData.dates.slice(0, 3).join(', ')}</span>
                              </div>
                            )}
                            {record.extractedData.diagnoses.length > 0 && (
                              <div>
                                <span className="text-slate-500">Diagnoses:</span>{' '}
                                <span className="text-slate-300">{record.extractedData.diagnoses.slice(0, 2).join(', ')}</span>
                              </div>
                            )}
                            {record.extractedData.providers.length > 0 && (
                              <div>
                                <span className="text-slate-500">Providers:</span>{' '}
                                <span className="text-slate-300">{record.extractedData.providers.slice(0, 2).join(', ')}</span>
                              </div>
                            )}
                            {record.extractedData.icd10Codes.length > 0 && (
                              <div>
                                <span className="text-slate-500">ICD-10:</span>{' '}
                                <span className="text-slate-300">{record.extractedData.icd10Codes.slice(0, 3).join(', ')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Provenance Chain */}
                      <div className="mt-3">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Provenance Chain</p>
                        <div className="flex items-center gap-2 text-xs">
                          {record.provenanceChain.map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <span className={`px-2 py-0.5 rounded-full ${
                                entry.event === 'uploaded' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                                entry.event === 'processed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                                'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                              }`}>
                                {entry.event}
                              </span>
                              {idx < record.provenanceChain.length - 1 && (
                                <span className="text-slate-600">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



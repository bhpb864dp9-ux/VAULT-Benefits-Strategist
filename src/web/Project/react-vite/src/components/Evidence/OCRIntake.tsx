/**
 * VAULT DEM Engine — OCR Evidence Intake (offline)
 * Upload documents -> run Tesseract -> store structured OCRResult in claim store.
 *
 * @vault-feature VAULT-F-EI-001 Evidence OCR Intake (On-Device)
 */
import { useMemo, useState } from 'react';
import { useClaimStore } from '../../stores/claimStore';
import type { OCRProgress, OCRResult, UploadedFile } from '../../types';
import { getOCRStatus, processDocument, validateFile, OCR_CONFIG } from '../../lib/ocrProcessor';
import { Upload, FileText, ShieldCheck, Loader2, Trash2, AlertTriangle, ChevronDown } from 'lucide-react';

function makeId(prefix = 'file') {
  return (
    (globalThis.crypto?.randomUUID?.() as string | undefined) ??
    `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
  );
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let v = bytes;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function OCRIntake() {
  const { data, addFile, updateFile, removeFile, addOCRResult, showToast } = useClaimStore();
  const uploadedFiles = data.uploadedFiles;
  const ocrResults = data.ocrResults;

  const status = useMemo(() => getOCRStatus(), []);
  const supported = status.supported;

  const [busy, setBusy] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [progress, setProgress] = useState<OCRProgress>({ status: 'idle', progress: 0, message: '' });
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const startOCR = async (files: File[]) => {
    if (!supported) {
      showToast('OCR is not supported in this browser/device.', 'error');
      return;
    }
    if (!files.length) return;

    setBusy(true);
    try {
      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
          showToast(validation.error || 'Unsupported file', 'warning');
          continue;
        }

        const fileId = makeId('evidence');
        const uf: UploadedFile = {
          id: fileId,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          uploadedAt: new Date().toISOString(),
          processed: false
        };
        addFile(uf);

        setActiveFile(file.name);
        setProgress({ status: 'recognizing', progress: 0, message: 'Starting OCR…' });

        let result: OCRResult | null = null;
        try {
          result = await processDocument(file, (p) => setProgress(p));
        } catch (err) {
          console.error('[OCRIntake] processDocument failed:', err);
          console.error('[OCRIntake] Error details:', {
            name: err instanceof Error ? err.name : 'unknown',
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined
          });
          showToast(`OCR failed for ${file.name}. Try an image file (PNG/JPG/WebP) if this was a PDF.`, 'error');
          continue;
        }

        addOCRResult(result);
        updateFile(fileId, { processed: true });
        showToast(`OCR complete: ${file.name}`, 'success');
      }
    } finally {
      setActiveFile(null);
      setBusy(false);
      setProgress({ status: 'idle', progress: 0, message: '' });
    }
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-success mt-0.5" />
          <div>
            <h3 className="text-lg font-serif text-slate-100">Evidence Intake (OCR)</h3>
            <p className="text-sm text-slate-400 mt-1">
              Upload evidence and extract text on-device. Nothing is uploaded.
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Supported: {OCR_CONFIG.supportedFormats.join(', ')} • Max size: {Math.round(OCR_CONFIG.maxFileSize / 1024 / 1024)}MB
            </p>
          </div>
        </div>

        <label className="btn btn-primary btn-sm">
          {busy ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing…
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Evidence
            </>
          )}
          <input
            type="file"
            multiple
            className="hidden"
            accept={OCR_CONFIG.supportedFormats.map((x) => `.${x}`).join(',')}
            disabled={busy}
            onChange={(e) => {
              const list = Array.from(e.target.files || []);
              e.currentTarget.value = '';
              void startOCR(list);
            }}
          />
        </label>
      </div>

      {!supported && (
        <div className="mt-4 p-4 bg-warning/5 border border-warning/20 rounded-2xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
          <div className="text-sm text-slate-300">
            OCR requires WebAssembly + Web Workers. Try a modern desktop browser.
          </div>
        </div>
      )}

      {busy && (
        <div className="mt-5 p-4 bg-slate-900/35 border border-slate-800/60 rounded-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-200">
              <span className="text-slate-400">Now processing:</span> {activeFile || '…'}
            </div>
            <div className="text-xs text-slate-500">{progress.progress}%</div>
          </div>
          <div className="progress-bar mt-3">
            <div className="progress-bar-fill" style={{ width: `${Math.max(0, Math.min(100, progress.progress))}%` }} />
          </div>
          <div className="mt-2 text-xs text-slate-500">{progress.message}</div>
        </div>
      )}

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-widest uppercase text-slate-400">Uploaded Evidence</p>
          <p className="text-xs text-slate-500">{uploadedFiles.length} file(s)</p>
        </div>

        {uploadedFiles.length === 0 ? (
          <div className="mt-3 text-sm text-slate-500">No files uploaded yet.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {uploadedFiles
              .slice()
              .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
              .map((f) => (
                <div key={f.id} className="p-3 bg-slate-900/35 border border-slate-800/60 rounded-2xl flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-brass flex-shrink-0" />
                      <span className="text-sm text-slate-200 truncate">{f.name}</span>
                      {f.processed && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-success/15 text-success border border-success/20">
                          OCR’d
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {formatBytes(f.size)} • {new Date(f.uploadedAt).toLocaleString()}
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeFile(f.id)} aria-label="Remove file">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium tracking-widest uppercase text-slate-400">OCR Results</p>
          <p className="text-xs text-slate-500">{ocrResults.length} result(s)</p>
        </div>

        {ocrResults.length === 0 ? (
          <div className="mt-3 text-sm text-slate-500">No OCR results yet.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {ocrResults
              .slice()
              .reverse()
              .slice(0, 6)
              .map((r, idx) => {
                const i = idx;
                const isOpen = !!expanded[i];
                return (
                  <div key={`${r.processingTime}_${idx}`} className="p-3 bg-slate-900/35 border border-slate-800/60 rounded-2xl">
                    <button
                      className="w-full flex items-center justify-between gap-4 text-left"
                      onClick={() => setExpanded((s) => ({ ...s, [i]: !s[i] }))}
                    >
                      <div className="text-sm text-slate-200">
                        Confidence: <span className="text-brass">{Math.round(r.confidence)}%</span> •{' '}
                        Diagnoses: <span className="text-slate-300">{r.diagnoses.length}</span> • ICD-10:{' '}
                        <span className="text-slate-300">{r.icd10Codes.length}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="mt-3 grid md:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-950/30 border border-slate-800/60 rounded-2xl">
                          <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-2">Diagnoses</p>
                          {r.diagnoses.length ? (
                            <ul className="text-sm text-slate-300 space-y-1">
                              {r.diagnoses.slice(0, 6).map((d) => (
                                <li key={d} className="truncate">- {d}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-sm text-slate-500">None detected</p>
                          )}
                        </div>
                        <div className="p-3 bg-slate-950/30 border border-slate-800/60 rounded-2xl">
                          <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-2">ICD-10 / Dates</p>
                          <div className="text-sm text-slate-300">
                            <div className="mb-2">
                              <span className="text-slate-500">ICD-10:</span>{' '}
                              {r.icd10Codes.slice(0, 6).join(', ') || '—'}
                            </div>
                            <div>
                              <span className="text-slate-500">Dates:</span> {r.dates.slice(0, 6).join(', ') || '—'}
                            </div>
                          </div>
                        </div>
                        <div className="md:col-span-2 p-3 bg-slate-950/30 border border-slate-800/60 rounded-2xl">
                          <p className="text-xs font-medium tracking-widest uppercase text-slate-400 mb-2">Extracted Text (preview)</p>
                          <pre className="text-xs text-slate-300 whitespace-pre-wrap max-h-40 overflow-auto">
{r.text.slice(0, 1500)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}



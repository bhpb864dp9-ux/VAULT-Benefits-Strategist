/**
 * VAULT DEM Engine — OCR Processor
 * Real Tesseract.js integration for client-side document processing
 *
 * PRIVACY: All processing happens locally on device. No data transmitted.
 */

import type { OCRResult, OCRProgress } from '../types';

export const OCR_CONFIG = {
  languages: ['eng'],
  confidenceThreshold: 0.6,
  maxFileSize: 50 * 1024 * 1024,
  supportedFormats: ['pdf', 'png', 'jpg', 'jpeg', 'tiff', 'bmp', 'webp'],
  patterns: {
    icd10: /\b[A-TV-Z]\d{2}(?:\.\d{1,4})?\b/g,
    dates: /\b(?:\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}|\d{4}[-\/]\d{1,2}[-\/]\d{1,2})\b/g,
    ratings: /\b\d{1,3}\s*%/g,
    dbq: /21-0960[A-Z]?-\d+/gi,
    ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
    phone: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g
  },
  diagnosisKeywords: [
    'diagnosis', 'diagnosed', 'assessment', 'impression', 'dx',
    'condition', 'disorder', 'disease', 'syndrome', 'finding'
  ],
  medicationKeywords: [
    'medication', 'prescription', 'rx', 'prescribed', 'take',
    'mg', 'mcg', 'ml', 'tablet', 'capsule', 'daily', 'twice'
  ]
};

type AnyWorker = {
  recognize: (file: File | Blob | string, options?: unknown, config?: unknown) => Promise<any>;
  terminate: () => Promise<void>;
};

let workerInstance: AnyWorker | null = null;
let workerReady = false;
let createWorkerFn: null | ((lang: string, oem?: number, opts?: any) => Promise<AnyWorker>) = null;

async function getCreateWorker(): Promise<(lang: string, oem?: number, opts?: any) => Promise<AnyWorker>> {
  if (createWorkerFn) return createWorkerFn;
  const mod: any = await import('tesseract.js');
  const cw = mod?.createWorker ?? mod?.default?.createWorker;
  if (!cw) throw new Error('Tesseract createWorker export not found');
  createWorkerFn = cw;
  return createWorkerFn!;
}

export async function initializeOCR(onProgress?: (progress: OCRProgress) => void): Promise<void> {
  if (workerReady && workerInstance) return;

  onProgress?.({ status: 'loading', progress: 0, message: 'Loading OCR engine...' });
  try {
    const createWorker = await getCreateWorker();
    workerInstance = await createWorker('eng', 1, {
      logger: (m: any) => {
        if (m.status === 'loading tesseract core') {
          onProgress?.({ status: 'loading', progress: 10, message: 'Loading Tesseract core...' });
        } else if (m.status === 'loading language traineddata') {
          onProgress?.({ status: 'loading', progress: 30, message: 'Loading language data...' });
        } else if (m.status === 'initializing api') {
          onProgress?.({ status: 'loading', progress: 60, message: 'Initializing OCR API...' });
        }
      }
    });
    workerReady = true;
    onProgress?.({ status: 'idle', progress: 100, message: 'OCR engine ready' });
  } catch (error) {
    onProgress?.({ status: 'error', progress: 0, message: 'Failed to initialize OCR engine' });
    throw error;
  }
}

export async function terminateOCR(): Promise<void> {
  if (workerInstance) {
    await workerInstance.terminate();
    workerInstance = null;
    workerReady = false;
  }
}

export async function processDocument(
  file: File | Blob | string,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  const startTime = Date.now();
  if (!workerReady || !workerInstance) {
    await initializeOCR(onProgress);
  }

  onProgress?.({ status: 'recognizing', progress: 0, message: 'Processing document...' });

  const result: any = await workerInstance!.recognize(file, {}, { blocks: true, hocr: false, tsv: false });
  const text = result.data.text;
  const confidence = result.data.confidence;

  onProgress?.({ status: 'recognizing', progress: 80, message: 'Extracting information...' });

  const diagnoses = extractDiagnoses(text);
  const dates = extractDates(text);
  const icd10Codes = extractICD10Codes(text);
  const medications = extractMedications(text);
  const providers = extractProviders(text);
  const processingTime = Date.now() - startTime;

  onProgress?.({ status: 'complete', progress: 100, message: `Processed in ${(processingTime / 1000).toFixed(1)}s` });

  return { text, confidence, diagnoses, dates, icd10Codes, medications, providers, processingTime };
}

function extractDiagnoses(text: string): string[] {
  const diagnoses: string[] = [];
  const lines = text.split('\n');
  lines.forEach((line) => {
    const lineLower = line.toLowerCase();
    const hasDiagnosisKeyword = OCR_CONFIG.diagnosisKeywords.some((keyword) => lineLower.includes(keyword));
    if (!hasDiagnosisKeyword) return;
    let diagnosisText = line;
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) diagnosisText = line.substring(colonIndex + 1).trim();
    diagnosisText = diagnosisText.replace(/^\d+\.\s*/, '').replace(/^[-•]\s*/, '').trim();
    if (diagnosisText.length > 3 && diagnosisText.length < 200) diagnoses.push(diagnosisText);
  });

  const icd10Matches = text.match(OCR_CONFIG.patterns.icd10);
  if (icd10Matches) {
    icd10Matches.forEach((code) => {
      const codeIndex = text.indexOf(code);
      if (codeIndex !== -1) {
        const nearbyText = text.substring(codeIndex, codeIndex + 100);
        const description = nearbyText.split(/[,.\n]/)[0]?.trim();
        if (description && !diagnoses.includes(description)) diagnoses.push(`${code}: ${description}`);
      }
    });
  }

  return [...new Set(diagnoses)];
}

function extractDates(text: string): string[] {
  const matches = text.match(OCR_CONFIG.patterns.dates) || [];
  return [...new Set(matches)];
}

function extractICD10Codes(text: string): string[] {
  const matches = text.match(OCR_CONFIG.patterns.icd10) || [];
  return [...new Set(matches.map(code => code.toUpperCase()))];
}

function extractMedications(text: string): string[] {
  const medications: string[] = [];
  const lines = text.split('\n');
  lines.forEach((line) => {
    const lineLower = line.toLowerCase();
    const hasMedicationKeyword = OCR_CONFIG.medicationKeywords.some((keyword) => lineLower.includes(keyword));
    if (!hasMedicationKeyword) return;
    const medPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(\d+\s*(?:mg|mcg|ml))/gi;
    const matches = line.match(medPattern);
    if (matches) medications.push(...matches);
  });
  return [...new Set(medications)];
}

function extractProviders(text: string): string[] {
  const providers: string[] = [];
  const drPattern = /Dr\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
  const mdPattern = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*M\.?D\.?/g;
  let match;
  while ((match = drPattern.exec(text)) !== null) {
    if (match[1]) providers.push(`Dr. ${match[1]}`);
  }
  while ((match = mdPattern.exec(text)) !== null) {
    if (match[1]) providers.push(`${match[1]}, MD`);
  }
  return [...new Set(providers)];
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (file.size > OCR_CONFIG.maxFileSize) {
    return { valid: false, error: `File too large. Maximum size is ${OCR_CONFIG.maxFileSize / 1024 / 1024}MB` };
  }
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !OCR_CONFIG.supportedFormats.includes(extension)) {
    return { valid: false, error: `Unsupported file type. Supported: ${OCR_CONFIG.supportedFormats.join(', ')}` };
  }
  return { valid: true };
}

export function isOCRSupported(): boolean {
  return typeof window !== 'undefined' && typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
}

export function getOCRStatus(): { supported: boolean; initialized: boolean; ready: boolean } {
  return { supported: isOCRSupported(), initialized: workerInstance !== null, ready: workerReady };
}

export default {
  initializeOCR,
  terminateOCR,
  processDocument,
  validateFile,
  isOCRSupported,
  getOCRStatus,
  OCR_CONFIG
};



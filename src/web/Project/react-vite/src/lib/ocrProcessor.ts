/**
 * VAULT DEM Engine — OCR Processor
 * Real Tesseract.js integration for client-side document processing
 *
 * REL-020: PDF support via pdfjs-dist rasterization
 *
 * PRIVACY: All processing happens locally on device. No data transmitted.
 */

import type { OCRResult, OCRProgress } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use CDN for reliable cross-bundler support
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

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
  console.log('[OCR] initializeOCR called');
  if (workerReady && workerInstance) {
    console.log('[OCR] Worker already ready, skipping init');
    return;
  }

  onProgress?.({ status: 'loading', progress: 0, message: 'Loading OCR engine...' });
  try {
    console.log('[OCR] Getting createWorker function...');
    const createWorker = await getCreateWorker();
    console.log('[OCR] Creating Tesseract worker...');
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
    console.log('[OCR] Tesseract worker created successfully');
    workerReady = true;
    onProgress?.({ status: 'idle', progress: 100, message: 'OCR engine ready' });
  } catch (error) {
    console.error('[OCR] Failed to initialize OCR engine:', error);
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

// ═══════════════════════════════════════════════════════════════════════════════
// PDF RASTERIZATION (REL-020)
// Convert PDF pages to images for Tesseract processing
// ═══════════════════════════════════════════════════════════════════════════════

const PDF_CONFIG = {
  maxPages: 20,      // Limit pages to prevent memory issues
  scale: 2.0,        // Higher scale = better OCR accuracy
  imageFormat: 'image/png' as const,
};

async function convertPdfToImages(
  file: File,
  onProgress?: (progress: OCRProgress) => void
): Promise<Blob[]> {
  console.log('[OCR-PDF] convertPdfToImages starting...');
  onProgress?.({ status: 'loading', progress: 5, message: 'Loading PDF...' });

  console.log('[OCR-PDF] Reading file as ArrayBuffer...');
  const arrayBuffer = await file.arrayBuffer();
  console.log('[OCR-PDF] ArrayBuffer size:', arrayBuffer.byteLength);

  console.log('[OCR-PDF] Loading PDF document...');
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  console.log('[OCR-PDF] PDF loaded, pages:', pdf.numPages);

  const numPages = Math.min(pdf.numPages, PDF_CONFIG.maxPages);
  const blobs: Blob[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    onProgress?.({
      status: 'loading',
      progress: 5 + Math.round((pageNum / numPages) * 20),
      message: `Rendering page ${pageNum}/${numPages}...`
    });

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: PDF_CONFIG.scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to create blob'))),
        PDF_CONFIG.imageFormat
      );
    });
    blobs.push(blob);
  }

  return blobs;
}

function isPdfFile(file: File | Blob | string): boolean {
  if (typeof file === 'string') {
    return file.toLowerCase().endsWith('.pdf');
  }
  if (file instanceof File) {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  }
  return false;
}

export async function processDocument(
  file: File | Blob | string,
  onProgress?: (progress: OCRProgress) => void
): Promise<OCRResult> {
  console.log('[OCR] processDocument called');
  const startTime = Date.now();

  // Initialize OCR engine if needed
  console.log('[OCR] Checking worker status:', { workerReady, hasWorkerInstance: !!workerInstance });
  if (!workerReady || !workerInstance) {
    console.log('[OCR] Initializing OCR engine...');
    await initializeOCR(onProgress);
    console.log('[OCR] OCR engine initialized');
  }

  // Handle PDF files - convert to images first (REL-020)
  if (file instanceof File) {
    console.log('[OCR] File info:', { name: file.name, type: file.type, size: file.size });
    console.log('[OCR] isPdfFile:', isPdfFile(file));
  }

  if (file instanceof File && isPdfFile(file)) {
    console.log('[OCR] Routing to PDF processor...');
    try {
      return await processPdfDocument(file, onProgress, startTime);
    } catch (pdfErr) {
      console.error('[OCR] PDF processing failed:', pdfErr);
      throw pdfErr;
    }
  }

  // Standard image processing
  onProgress?.({ status: 'recognizing', progress: 30, message: 'Processing document...' });

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

/**
 * Process multi-page PDF documents (REL-020)
 * Converts each page to an image, runs OCR, and merges results
 */
async function processPdfDocument(
  file: File,
  onProgress?: (progress: OCRProgress) => void,
  startTime?: number
): Promise<OCRResult> {
  const start = startTime ?? Date.now();
  console.log('[OCR-PDF] Starting PDF processing for:', file.name);

  // Convert PDF pages to images
  let pageImages: Blob[];
  try {
    pageImages = await convertPdfToImages(file, onProgress);
    console.log('[OCR-PDF] Converted', pageImages.length, 'pages to images');
  } catch (err) {
    console.error('[OCR-PDF] PDF conversion failed:', err);
    throw err;
  }

  if (pageImages.length === 0) {
    throw new Error('No pages found in PDF');
  }

  // Process each page
  const pageTexts: string[] = [];
  let totalConfidence = 0;
  const allDiagnoses: string[] = [];
  const allDates: string[] = [];
  const allIcd10Codes: string[] = [];
  const allMedications: string[] = [];
  const allProviders: string[] = [];

  for (let i = 0; i < pageImages.length; i++) {
    const progressBase = 25 + Math.round((i / pageImages.length) * 60);
    onProgress?.({
      status: 'recognizing',
      progress: progressBase,
      message: `OCR page ${i + 1}/${pageImages.length}...`
    });

    const result: any = await workerInstance!.recognize(
      pageImages[i],
      {},
      { blocks: true, hocr: false, tsv: false }
    );

    pageTexts.push(result.data.text);
    totalConfidence += result.data.confidence;

    // Extract data from this page
    allDiagnoses.push(...extractDiagnoses(result.data.text));
    allDates.push(...extractDates(result.data.text));
    allIcd10Codes.push(...extractICD10Codes(result.data.text));
    allMedications.push(...extractMedications(result.data.text));
    allProviders.push(...extractProviders(result.data.text));
  }

  onProgress?.({ status: 'recognizing', progress: 90, message: 'Merging results...' });

  // Merge all pages with page breaks
  const text = pageTexts.join('\n\n--- Page Break ---\n\n');
  const confidence = totalConfidence / pageImages.length;
  const processingTime = Date.now() - start;

  // Deduplicate extracted data
  const diagnoses = [...new Set(allDiagnoses)];
  const dates = [...new Set(allDates)];
  const icd10Codes = [...new Set(allIcd10Codes)];
  const medications = [...new Set(allMedications)];
  const providers = [...new Set(allProviders)];

  onProgress?.({
    status: 'complete',
    progress: 100,
    message: `Processed ${pageImages.length} pages in ${(processingTime / 1000).toFixed(1)}s`
  });

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



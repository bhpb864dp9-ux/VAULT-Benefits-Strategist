import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

export interface OCRResult {
  success: boolean;
  text: string;
  pages: number;
  confidence: number;
  error?: string;
  suggestion?: string;
}

export class OCRService {
  private worker: Tesseract.Worker | null = null;

  private async initializeWorker(): Promise<Tesseract.Worker> {
    if (this.worker) return this.worker;
    this.worker = await Tesseract.createWorker('eng');
    return this.worker;
  }

  private async convertPdfToImages(file: File): Promise<Blob[]> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const blobs: Blob[] = [];
    const maxPages = Math.min(pdf.numPages, 20);

    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;
      await page.render({ canvasContext: ctx, viewport }).promise;
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      blobs.push(blob);
    }
    return blobs;
  }

  async processDocument(file: File): Promise<OCRResult> {
    try {
      const worker = await this.initializeWorker();
      const isPDF = file.type === 'application/pdf';

      if (isPDF) {
        const pageBlobs = await this.convertPdfToImages(file);
        const results: string[] = [];
        for (const blob of pageBlobs) {
          const pageResult = await worker.recognize(blob);
          results.push(pageResult.data.text);
        }
        return { success: true, text: results.join('\n\n--- Page Break ---\n\n'), pages: pageBlobs.length, confidence: 90 };
      }

      const result = await worker.recognize(file);
      return { success: true, text: result.data.text, pages: 1, confidence: result.data.confidence };
    } catch (error) {
      return { success: false, text: '', pages: 0, confidence: 0, error: String(error), suggestion: 'Try a different file format.' };
    }
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }
}

export const ocrService = new OCRService();
export default OCRService;

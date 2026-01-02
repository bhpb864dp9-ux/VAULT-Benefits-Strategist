/**
 * VDIO Narrative Engine — OCR Schema & Index Builder
 * Strict adherence to the Phase 2 OCR specification
 *
 * All uploaded documents are parsed into this JSON structure for Phase 4 citations.
 *
 * @vault-feature VDIO-OCR-001 Structured OCR Index
 */
import type { OCRResult } from '../types';
import type { OCRIndexEntry } from '../stores/narrativeStore';
import { BODY_SYSTEMS } from '../data/bodySystems';

// ═══════════════════════════════════════════════════════════════════
// CONDITION KEYWORD MAP
// ═══════════════════════════════════════════════════════════════════

interface ConditionMatch {
  conditionId: string;
  conditionName: string;
  cfrSection: string;
  keywords: string[];
}

// Build a flat keyword map from body systems
const buildConditionKeywordMap = (): ConditionMatch[] => {
  const matches: ConditionMatch[] = [];
  
  for (const system of BODY_SYSTEMS) {
    for (const condition of system.conditions) {
      matches.push({
        conditionId: condition.id,
        conditionName: condition.name,
        cfrSection: system.cfrSection,
        keywords: [
          condition.name.toLowerCase(),
          condition.id.toLowerCase(),
          ...(condition.keywords || []).map(k => k.toLowerCase()),
          ...(condition.icd10 || []).map(code => code.toLowerCase()),
        ],
      });
    }
  }
  
  return matches;
};

const CONDITION_KEYWORD_MAP = buildConditionKeywordMap();

// ═══════════════════════════════════════════════════════════════════
// DATE EXTRACTION
// ═══════════════════════════════════════════════════════════════════

const DATE_PATTERNS = [
  /\b(\d{4})-(\d{2})-(\d{2})\b/g,                    // ISO: 2012-04-15
  /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g,              // US: 04/15/2012
  /\b(\d{1,2})-(\d{1,2})-(\d{4})\b/g,                // Alt: 04-15-2012
  /\b(\d{1,2})\/(\d{1,2})\/(\d{2})\b/g,              // Short: 04/15/12
  /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* (\d{1,2}),? (\d{4})\b/gi,
];

function extractDatesFromText(text: string): string[] {
  const dates: string[] = [];
  
  for (const pattern of DATE_PATTERNS) {
    const matches = text.matchAll(new RegExp(pattern));
    for (const match of matches) {
      // Normalize to YYYY-MM-DD format
      const dateStr = match[0];
      try {
        const parsed = new Date(dateStr);
        if (!isNaN(parsed.getTime())) {
          dates.push(parsed.toISOString().split('T')[0]);
        }
      } catch {
        // Keep original if parsing fails
        dates.push(dateStr);
      }
    }
  }
  
  return [...new Set(dates)];
}

// ═══════════════════════════════════════════════════════════════════
// CONDITION TAGGING
// ═══════════════════════════════════════════════════════════════════

interface TagResult {
  conditionId: string;
  conditionName: string;
  cfrSection: string;
  confidence: number;
}

function tagConditionsInText(text: string): TagResult[] {
  const lowered = text.toLowerCase();
  const results: TagResult[] = [];
  const seen = new Set<string>();
  
  for (const condition of CONDITION_KEYWORD_MAP) {
    let matchCount = 0;
    
    for (const keyword of condition.keywords) {
      if (lowered.includes(keyword)) {
        matchCount++;
      }
    }
    
    if (matchCount > 0 && !seen.has(condition.conditionId)) {
      seen.add(condition.conditionId);
      results.push({
        conditionId: condition.conditionId,
        conditionName: condition.conditionName,
        cfrSection: condition.cfrSection,
        confidence: Math.min(matchCount / condition.keywords.length, 1),
      });
    }
  }
  
  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence);
}

// ═══════════════════════════════════════════════════════════════════
// PAGE SPLITTING
// ═══════════════════════════════════════════════════════════════════

interface PageContent {
  pageNumber: number;
  text: string;
}

function splitIntoPages(text: string): PageContent[] {
  // Try to detect page breaks
  const pageBreakPatterns = [
    /\f/g,                           // Form feed
    /\n[-=]{20,}\n/g,                // Divider lines
    /\nPage \d+\n/gi,                // "Page X" markers
    /\n\d+\s*\/\s*\d+\n/g,           // "X / Y" page numbers
  ];
  
  let pages: string[] = [text];
  
  for (const pattern of pageBreakPatterns) {
    if (text.match(pattern)) {
      pages = text.split(pattern).filter(p => p.trim().length > 0);
      break;
    }
  }
  
  // If no page breaks found, split by approximate page length (~3000 chars)
  if (pages.length === 1 && text.length > 3000) {
    pages = [];
    const chunkSize = 3000;
    for (let i = 0; i < text.length; i += chunkSize) {
      pages.push(text.slice(i, i + chunkSize));
    }
  }
  
  return pages.map((content, index) => ({
    pageNumber: index + 1,
    text: content.trim(),
  }));
}

// ═══════════════════════════════════════════════════════════════════
// SNIPPET EXTRACTION
// ═══════════════════════════════════════════════════════════════════

function extractRelevantSnippets(
  text: string,
  keywords: string[],
  maxSnippetLength: number = 200
): string[] {
  const snippets: string[] = [];
  const lowered = text.toLowerCase();
  
  for (const keyword of keywords) {
    const index = lowered.indexOf(keyword.toLowerCase());
    if (index !== -1) {
      // Extract context around the keyword
      const start = Math.max(0, index - 50);
      const end = Math.min(text.length, index + keyword.length + 150);
      let snippet = text.slice(start, end).trim();
      
      // Clean up snippet
      if (start > 0) snippet = '...' + snippet;
      if (end < text.length) snippet = snippet + '...';
      
      if (snippet.length <= maxSnippetLength) {
        snippets.push(snippet);
      }
    }
  }
  
  return snippets;
}

// ═══════════════════════════════════════════════════════════════════
// MAIN INDEX BUILDER
// ═══════════════════════════════════════════════════════════════════

export interface BuildIndexOptions {
  source: string;           // Document identifier (e.g., "Service_Recs_Vol1")
  documentType: 'c_file' | 'blue_button' | 'service_records' | 'private_medical' | 'other';
}

export function buildOCRIndex(
  ocrResult: OCRResult,
  options: BuildIndexOptions
): OCRIndexEntry[] {
  const entries: OCRIndexEntry[] = [];
  const pages = splitIntoPages(ocrResult.text);
  
  for (const page of pages) {
    // Extract dates from this page
    const dates = extractDatesFromText(page.text);
    const primaryDate = dates[0] || new Date().toISOString().split('T')[0];
    
    // Tag conditions found on this page
    const taggedConditions = tagConditionsInText(page.text);
    
    if (taggedConditions.length === 0) {
      // Even if no conditions found, index the page for completeness
      entries.push({
        id: `${options.source}_p${page.pageNumber}_${Date.now().toString(36)}`,
        source: options.source,
        page: page.pageNumber.toString(),
        date: primaryDate,
        snippet: page.text.slice(0, 200) + (page.text.length > 200 ? '...' : ''),
        taggedCondition: '',
        relevantLaw: '',
        riskFlag: 'none',
      });
    } else {
      // Create an entry for each tagged condition on this page
      for (const tagged of taggedConditions) {
        const snippets = extractRelevantSnippets(
          page.text,
          CONDITION_KEYWORD_MAP.find(c => c.conditionId === tagged.conditionId)?.keywords || []
        );
        
        entries.push({
          id: `${options.source}_p${page.pageNumber}_${tagged.conditionId}_${Date.now().toString(36)}`,
          source: options.source,
          page: page.pageNumber.toString(),
          date: primaryDate,
          snippet: snippets[0] || page.text.slice(0, 200),
          taggedCondition: tagged.conditionId,
          relevantLaw: tagged.cfrSection,
          riskFlag: 'none',
        });
      }
    }
  }
  
  return entries;
}

// ═══════════════════════════════════════════════════════════════════
// INDEX FROM DIAGNOSES
// ═══════════════════════════════════════════════════════════════════

/**
 * Creates OCR index entries from extracted diagnoses in OCR results
 */
export function buildIndexFromDiagnoses(
  ocrResult: OCRResult,
  source: string
): OCRIndexEntry[] {
  const entries: OCRIndexEntry[] = [];
  
  for (let i = 0; i < ocrResult.diagnoses.length; i++) {
    const diagnosis = ocrResult.diagnoses[i];
    const taggedConditions = tagConditionsInText(diagnosis);
    const dates = ocrResult.dates;
    
    const primaryCondition = taggedConditions[0];
    
    entries.push({
      id: `${source}_diag_${i}_${Date.now().toString(36)}`,
      source,
      page: '—',
      date: dates[0] || new Date().toISOString().split('T')[0],
      snippet: diagnosis,
      taggedCondition: primaryCondition?.conditionId || '',
      relevantLaw: primaryCondition?.cfrSection || '',
      riskFlag: 'none',
    });
  }
  
  return entries;
}

// ═══════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════

/**
 * Search the OCR index for entries matching a condition
 */
export function searchIndexByCondition(
  index: OCRIndexEntry[],
  conditionId: string
): OCRIndexEntry[] {
  return index.filter(
    entry => entry.taggedCondition === conditionId ||
             entry.taggedCondition.toLowerCase().includes(conditionId.toLowerCase())
  );
}

/**
 * Get all unique conditions found in the index
 */
export function getIndexedConditions(index: OCRIndexEntry[]): string[] {
  const conditions = new Set<string>();
  for (const entry of index) {
    if (entry.taggedCondition) {
      conditions.add(entry.taggedCondition);
    }
  }
  return [...conditions];
}

/**
 * Format an index entry as a citation string
 */
export function formatIndexCitation(entry: OCRIndexEntry): string {
  const dateStr = entry.date ? ` on ${entry.date}` : '';
  const lawStr = entry.relevantLaw ? ` (${entry.relevantLaw})` : '';
  return `[${entry.source}, Page ${entry.page}${dateStr}]${lawStr}`;
}

export default {
  buildOCRIndex,
  buildIndexFromDiagnoses,
  searchIndexByCondition,
  getIndexedConditions,
  formatIndexCitation,
};


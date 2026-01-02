/**
 * VDIO Narrative Engine — Zero-Knowledge Session Store
 * Encrypted persistence to sessionStorage only (never localStorage)
 *
 * Privacy Model: Session-Only (Ephemeral)
 * - All OCR text, medical records, and drafts exist in RAM/Temp
 * - Encrypted before persisting to sessionStorage
 * - Purged upon Phase 5 completion
 *
 * @vault-feature VDIO-STORE-001 Encrypted Session State
 */
import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import CryptoJS from 'crypto-js';

// ═══════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════

export interface OCRIndexEntry {
  id: string;
  source: string;           // e.g., "Service_Recs_Vol1"
  page: string;             // e.g., "42"
  date: string;             // e.g., "2012-04-15"
  snippet: string;          // Extracted text
  taggedCondition: string;  // Auto-tagged condition ID
  relevantLaw: string;      // e.g., "38 CFR 4.87"
  riskFlag: 'none' | 'contradiction' | 'gap';
}

export interface GapResult {
  conditionId: string;
  conditionName: string;
  status: 'ready' | 'gap' | 'partial';
  evidenceFound: OCRIndexEntry[];
  evidenceMissing: string[];
  suggestedAction: 'proceed' | 'lay_evidence' | 'request_records';
}

export interface RedTeamFlag {
  id: string;
  source: string;
  page: string;
  snippet: string;
  keyword: string;
  severity: 'warning' | 'critical';
  mitigation: string;
}

export interface LayEvidenceEntry {
  id: string;
  conditionId: string;
  witnessName: string;
  witnessRelation: string;
  statement: string;
  createdAt: string;
}

export interface NarrativeBlock {
  conditionId: string;
  conditionName: string;
  argument: string;
  evidenceCitations: string[];
  lawCitations: string[];
}

export interface ProbabilityResult {
  overall: number;
  breakdown: {
    evidenceScore: number;
    citationScore: number;
    gapPenalty: number;
    redTeamPenalty: number;
    historicalBaseline: number;
  };
  rating: 'High' | 'Medium' | 'Low';
  explanation: string;
}

export interface ExamPreBrief {
  conditionId: string;
  conditionName: string;
  dbqForm: string;
  keyQuestions: string[];
  measurementsNeeded: string[];
  documentsToMention: string[];
  tipsForVeteran: string[];
}

interface NarrativeState {
  // Phase tracking
  narrativePhase: 1 | 2 | 3 | 4 | 5;
  claimType: 'new' | 'increase' | 'appeal' | 'supplemental' | null;

  // Phase 2: OCR Index
  ocrIndex: OCRIndexEntry[];
  documentsIngested: { id: string; name: string; type: string; processedAt: string }[];

  // Phase 3: Assessment
  gapAnalysis: GapResult[];
  redTeamFlags: RedTeamFlag[];
  layEvidence: LayEvidenceEntry[];

  // Phase 4: Narrative
  narrativeBlocks: NarrativeBlock[];
  narrativeDraft: string;
  qualityIssues: string[];

  // Phase 5: Output
  probabilityResult: ProbabilityResult | null;
  examPreBriefs: ExamPreBrief[];
  packageGenerated: boolean;

  // Metadata (retained after purge)
  sessionId: string;
  startedAt: string;
}

interface NarrativeActions {
  // Phase 1
  setClaimType: (type: NarrativeState['claimType']) => void;
  advancePhase: () => void;
  setPhase: (phase: NarrativeState['narrativePhase']) => void;

  // Phase 2
  addOCREntry: (entry: OCRIndexEntry) => void;
  addOCREntries: (entries: OCRIndexEntry[]) => void;
  addIngestedDocument: (doc: { id: string; name: string; type: string }) => void;
  clearOCRIndex: () => void;

  // Phase 3
  setGapAnalysis: (gaps: GapResult[]) => void;
  addRedTeamFlag: (flag: RedTeamFlag) => void;
  setRedTeamFlags: (flags: RedTeamFlag[]) => void;
  addLayEvidence: (entry: LayEvidenceEntry) => void;
  removeLayEvidence: (id: string) => void;

  // Phase 4
  setNarrativeBlocks: (blocks: NarrativeBlock[]) => void;
  updateNarrativeDraft: (draft: string) => void;
  setQualityIssues: (issues: string[]) => void;

  // Phase 5
  setProbabilityResult: (result: ProbabilityResult) => void;
  setExamPreBriefs: (briefs: ExamPreBrief[]) => void;
  markPackageGenerated: () => void;

  // Purge Protocol
  executePurgeProtocol: () => void;
  resetSession: () => void;
}

type NarrativeStore = NarrativeState & NarrativeActions;

// ═══════════════════════════════════════════════════════════════════
// ENCRYPTED STORAGE ENGINE
// ═══════════════════════════════════════════════════════════════════

// Generate a session-unique encryption key
// In production, this could be derived from a more secure source
const getEncryptionKey = (): string => {
  let key = sessionStorage.getItem('vdio-session-key');
  if (!key) {
    key = CryptoJS.lib.WordArray.random(32).toString();
    sessionStorage.setItem('vdio-session-key', key);
  }
  return key;
};

const encryptedSessionStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const encrypted = sessionStorage.getItem(name);
    if (!encrypted) return null;
    try {
      const key = getEncryptionKey();
      const bytes = CryptoJS.AES.decrypt(encrypted, key);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted || null;
    } catch {
      // If decryption fails, clear corrupted data
      sessionStorage.removeItem(name);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      const key = getEncryptionKey();
      const encrypted = CryptoJS.AES.encrypt(value, key).toString();
      sessionStorage.setItem(name, encrypted);
    } catch (e) {
      console.error('[VDIO] Encryption failed:', e);
    }
  },
  removeItem: (name: string): void => {
    sessionStorage.removeItem(name);
  },
};

// ═══════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════

const generateSessionId = (): string => {
  return `vdio_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
};

const createInitialState = (): NarrativeState => ({
  narrativePhase: 1,
  claimType: null,
  ocrIndex: [],
  documentsIngested: [],
  gapAnalysis: [],
  redTeamFlags: [],
  layEvidence: [],
  narrativeBlocks: [],
  narrativeDraft: '',
  qualityIssues: [],
  probabilityResult: null,
  examPreBriefs: [],
  packageGenerated: false,
  sessionId: generateSessionId(),
  startedAt: new Date().toISOString(),
});

// ═══════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════

export const useNarrativeStore = create<NarrativeStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      // ─────────────────────────────────────────────────────────────
      // Phase 1: Mission
      // ─────────────────────────────────────────────────────────────
      setClaimType: (type) => set({ claimType: type }),

      advancePhase: () => {
        const current = get().narrativePhase;
        if (current < 5) {
          set({ narrativePhase: (current + 1) as NarrativeState['narrativePhase'] });
        }
      },

      setPhase: (phase) => set({ narrativePhase: phase }),

      // ─────────────────────────────────────────────────────────────
      // Phase 2: Identity & Ingestion
      // ─────────────────────────────────────────────────────────────
      addOCREntry: (entry) =>
        set((state) => ({
          ocrIndex: [...state.ocrIndex, entry],
        })),

      addOCREntries: (entries) =>
        set((state) => ({
          ocrIndex: [...state.ocrIndex, ...entries],
        })),

      addIngestedDocument: (doc) =>
        set((state) => ({
          documentsIngested: [
            ...state.documentsIngested,
            { ...doc, processedAt: new Date().toISOString() },
          ],
        })),

      clearOCRIndex: () => set({ ocrIndex: [], documentsIngested: [] }),

      // ─────────────────────────────────────────────────────────────
      // Phase 3: Assessment
      // ─────────────────────────────────────────────────────────────
      setGapAnalysis: (gaps) => set({ gapAnalysis: gaps }),

      addRedTeamFlag: (flag) =>
        set((state) => ({
          redTeamFlags: [...state.redTeamFlags, flag],
        })),

      setRedTeamFlags: (flags) => set({ redTeamFlags: flags }),

      addLayEvidence: (entry) =>
        set((state) => ({
          layEvidence: [...state.layEvidence, entry],
        })),

      removeLayEvidence: (id) =>
        set((state) => ({
          layEvidence: state.layEvidence.filter((e) => e.id !== id),
        })),

      // ─────────────────────────────────────────────────────────────
      // Phase 4: Narrative Build
      // ─────────────────────────────────────────────────────────────
      setNarrativeBlocks: (blocks) => set({ narrativeBlocks: blocks }),

      updateNarrativeDraft: (draft) => set({ narrativeDraft: draft }),

      setQualityIssues: (issues) => set({ qualityIssues: issues }),

      // ─────────────────────────────────────────────────────────────
      // Phase 5: Output
      // ─────────────────────────────────────────────────────────────
      setProbabilityResult: (result) => set({ probabilityResult: result }),

      setExamPreBriefs: (briefs) => set({ examPreBriefs: briefs }),

      markPackageGenerated: () => set({ packageGenerated: true }),

      // ─────────────────────────────────────────────────────────────
      // Purge Protocol
      // ─────────────────────────────────────────────────────────────
      executePurgeProtocol: () => {
        const { sessionId, startedAt } = get();

        // 1. Clear all sensitive state
        set({
          ocrIndex: [],
          documentsIngested: [],
          gapAnalysis: [],
          redTeamFlags: [],
          layEvidence: [],
          narrativeBlocks: [],
          narrativeDraft: '',
          qualityIssues: [],
          probabilityResult: null,
          examPreBriefs: [],
        });

        // 2. Clear encrypted sessionStorage
        sessionStorage.removeItem('vdio-narrative-store');
        sessionStorage.removeItem('vdio-session-key');

        // 3. Retain only completion metadata (non-sensitive)
        try {
          const completions = JSON.parse(localStorage.getItem('vdio-completions') || '[]');
          completions.push({
            sessionId,
            startedAt,
            completedAt: new Date().toISOString(),
          });
          // Keep only last 10 completions
          localStorage.setItem(
            'vdio-completions',
            JSON.stringify(completions.slice(-10))
          );
        } catch {
          // Ignore errors in completion tracking
        }
      },

      resetSession: () => {
        // Clear everything and start fresh
        sessionStorage.removeItem('vdio-narrative-store');
        sessionStorage.removeItem('vdio-session-key');
        set(createInitialState());
      },
    }),
    {
      name: 'vdio-narrative-store',
      storage: createJSONStorage(() => encryptedSessionStorage),
      partialize: (state) => ({
        // Only persist these fields (exclude functions)
        narrativePhase: state.narrativePhase,
        claimType: state.claimType,
        ocrIndex: state.ocrIndex,
        documentsIngested: state.documentsIngested,
        gapAnalysis: state.gapAnalysis,
        redTeamFlags: state.redTeamFlags,
        layEvidence: state.layEvidence,
        narrativeBlocks: state.narrativeBlocks,
        narrativeDraft: state.narrativeDraft,
        qualityIssues: state.qualityIssues,
        probabilityResult: state.probabilityResult,
        examPreBriefs: state.examPreBriefs,
        packageGenerated: state.packageGenerated,
        sessionId: state.sessionId,
        startedAt: state.startedAt,
      }),
    }
  )
);

// ═══════════════════════════════════════════════════════════════════
// SELECTORS
// ═══════════════════════════════════════════════════════════════════

export const useNarrativePhase = () => useNarrativeStore((s) => s.narrativePhase);
export const useClaimType = () => useNarrativeStore((s) => s.claimType);
export const useOCRIndex = () => useNarrativeStore((s) => s.ocrIndex);
export const useGapAnalysis = () => useNarrativeStore((s) => s.gapAnalysis);
export const useRedTeamFlags = () => useNarrativeStore((s) => s.redTeamFlags);
export const useLayEvidence = () => useNarrativeStore((s) => s.layEvidence);
export const useNarrativeBlocks = () => useNarrativeStore((s) => s.narrativeBlocks);
export const useNarrativeDraft = () => useNarrativeStore((s) => s.narrativeDraft);
export const useProbabilityResult = () => useNarrativeStore((s) => s.probabilityResult);
export const useExamPreBriefs = () => useNarrativeStore((s) => s.examPreBriefs);

export default useNarrativeStore;


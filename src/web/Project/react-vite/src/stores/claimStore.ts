/**
 * VAULT DEM Engine — Claim Store
 * Zustand state management with localStorage persistence
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ClaimData,
  VeteranIdentity,
  SelectedCondition,
  MissionType,
  AuditEntry,
  POAInfo,
  Dependents,
  UploadedFile,
  OCRResult,
  WorkflowPhase,
  ToastMessage,
  BattleBuddyInfo,
  TimelineEvent,
  IntentLevel
} from '../types';

const MAX_WORKFLOW_PHASE = 4 as const;

const createInitialClaimData = (): ClaimData => ({
  id: generateId(),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  identity: { name: '' },
  mission: null,
  selectedConditions: [],
  narrative: '',
  auditTrail: [],
  poa: null,
  battleBuddy: { enabled: false },
  timeline: [],
  intentLevels: {},
  dependents: { spouse: false, children: 0 },
  uploadedFiles: [],
  ocrResults: []
});

function generateId(): string {
  return 'claim_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

interface ClaimStore {
  data: ClaimData;
  currentPhase: WorkflowPhase;
  selectedSystems: string[];
  isLoading: boolean;
  error: string | null;
  toasts: ToastMessage[];
  sidebarOpen: boolean;

  setPhase: (phase: WorkflowPhase) => void;
  nextPhase: () => void;
  prevPhase: () => void;
  canProceed: () => boolean;

  setIdentity: (identity: Partial<VeteranIdentity>) => void;
  clearIdentity: () => void;

  setMission: (mission: MissionType | null) => void;

  addCondition: (condition: SelectedCondition) => void;
  removeCondition: (conditionId: string) => void;
  updateCondition: (conditionId: string, updates: Partial<SelectedCondition>) => void;
  clearConditions: () => void;

  toggleSystem: (systemId: string) => void;
  selectSystems: (systemIds: string[]) => void;
  clearSystems: () => void;

  setNarrative: (narrative: string) => void;

  setPOA: (poa: POAInfo | null) => void;

  setBattleBuddy: (buddy: Partial<BattleBuddyInfo>) => void;
  clearBattleBuddy: () => void;

  addTimelineEvent: (event: TimelineEvent) => void;
  removeTimelineEvent: (id: string) => void;
  clearTimeline: () => void;

  setIntentLevel: (partId: string, level: IntentLevel) => void;
  clearIntentLevels: () => void;

  setDependents: (dependents: Partial<Dependents>) => void;

  addFile: (file: UploadedFile) => void;
  updateFile: (fileId: string, updates: Partial<UploadedFile>) => void;
  removeFile: (fileId: string) => void;
  addOCRResult: (result: OCRResult) => void;

  addAudit: (action: string, value: string) => void;
  getAuditTrail: () => AuditEntry[];

  showToast: (message: string, type?: ToastMessage['type'], duration?: number) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  reset: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;

  getConditionCount: () => number;
  getSystemCount: () => number;
  isClaimStarted: () => boolean;
}

export const useClaimStore = create<ClaimStore>()(
  persist(
    (set, get) => ({
      data: createInitialClaimData(),
      currentPhase: 0,
      selectedSystems: [],
      isLoading: false,
      error: null,
      toasts: [],
      sidebarOpen: false,

      setPhase: (phase) => {
        const clamped = (Math.max(0, Math.min(MAX_WORKFLOW_PHASE, phase)) as WorkflowPhase);
        set({ currentPhase: clamped });
        get().addAudit('Phase Changed', `Moved to phase ${clamped}`);
      },

      nextPhase: () => {
        const { currentPhase, canProceed } = get();
        if (canProceed() && currentPhase < MAX_WORKFLOW_PHASE) {
          const next = ((currentPhase + 1) as WorkflowPhase);
          set({ currentPhase: next });
          get().addAudit('Phase Advanced', `Moved to phase ${next}`);
        }
      },

      prevPhase: () => {
        const { currentPhase } = get();
        if (currentPhase > 0) {
          set({ currentPhase: (currentPhase - 1) as WorkflowPhase });
        }
      },

      canProceed: () => {
        const { currentPhase, data } = get();
        switch (currentPhase) {
          case 0:
            return data.mission !== null;
          case 1:
            return data.identity.name.trim().length > 0;
          case 2:
            return data.selectedConditions.length > 0;
          case 3:
            return true;
          case 4:
            return true;
          default:
            return true;
        }
      },

      setIdentity: (identity) => {
        set((state) => ({
          data: {
            ...state.data,
            identity: { ...state.data.identity, ...identity },
            updatedAt: new Date().toISOString()
          }
        }));

        if (identity.name) {
          get().addAudit('Identity Updated', `Name: ${identity.name}`);
        }
      },

      clearIdentity: () => {
        set((state) => ({
          data: {
            ...state.data,
            identity: { name: '' },
            updatedAt: new Date().toISOString()
          }
        }));
      },

      setMission: (mission) => {
        set((state) => ({
          data: {
            ...state.data,
            mission,
            updatedAt: new Date().toISOString()
          }
        }));

        if (mission) {
          get().addAudit('Mission Selected', mission);
          get().showToast(`Mission set: ${mission}`, 'success');
        }
      },

      addCondition: (condition) => {
        const { data } = get();
        if (data.selectedConditions.some(c => c.id === condition.id)) {
          get().showToast('Condition already added', 'warning');
          return;
        }

        set((state) => ({
          data: {
            ...state.data,
            selectedConditions: [...state.data.selectedConditions, condition],
            updatedAt: new Date().toISOString()
          }
        }));

        get().addAudit('Condition Added', condition.name);
        get().showToast(`Added: ${condition.name}`, 'success');
      },

      removeCondition: (conditionId) => {
        const { data } = get();
        const condition = data.selectedConditions.find(c => c.id === conditionId);

        set((state) => ({
          data: {
            ...state.data,
            selectedConditions: state.data.selectedConditions.filter(c => c.id !== conditionId),
            updatedAt: new Date().toISOString()
          }
        }));

        if (condition) {
          get().addAudit('Condition Removed', condition.name);
        }
      },

      updateCondition: (conditionId, updates) => {
        set((state) => ({
          data: {
            ...state.data,
            selectedConditions: state.data.selectedConditions.map(c =>
              c.id === conditionId ? { ...c, ...updates } : c
            ),
            updatedAt: new Date().toISOString()
          }
        }));
      },

      clearConditions: () => {
        set((state) => ({
          data: {
            ...state.data,
            selectedConditions: [],
            updatedAt: new Date().toISOString()
          },
          selectedSystems: []
        }));
        get().addAudit('Conditions Cleared', 'All conditions removed');
      },

      toggleSystem: (systemId) => {
        set((state) => ({
          selectedSystems: state.selectedSystems.includes(systemId)
            ? state.selectedSystems.filter(s => s !== systemId)
            : [...state.selectedSystems, systemId]
        }));
      },

      selectSystems: (systemIds) => {
        set({ selectedSystems: systemIds });
      },

      clearSystems: () => {
        set({ selectedSystems: [] });
      },

      setNarrative: (narrative) => {
        set((state) => ({
          data: {
            ...state.data,
            narrative,
            updatedAt: new Date().toISOString()
          }
        }));
      },

      setPOA: (poa) => {
        set((state) => ({
          data: {
            ...state.data,
            poa,
            updatedAt: new Date().toISOString()
          }
        }));

        if (poa) {
          get().addAudit('POA Set', poa.organizationName || poa.type);
        }
      },

      setBattleBuddy: (buddy) => {
        set((state) => ({
          data: {
            ...state.data,
            battleBuddy: { ...state.data.battleBuddy, ...buddy },
            updatedAt: new Date().toISOString()
          }
        }));

        if (buddy.enabled === true) {
          get().addAudit('Battle Buddy Mode', 'Enabled');
        } else if (buddy.enabled === false) {
          get().addAudit('Battle Buddy Mode', 'Disabled');
        }
      },

      clearBattleBuddy: () => {
        set((state) => ({
          data: {
            ...state.data,
            battleBuddy: { enabled: false },
            updatedAt: new Date().toISOString()
          }
        }));
        get().addAudit('Battle Buddy Mode', 'Cleared');
      },

      addTimelineEvent: (event) => {
        set((state) => ({
          data: {
            ...state.data,
            timeline: [...state.data.timeline, event],
            updatedAt: new Date().toISOString()
          }
        }));
        get().addAudit('Timeline Event Added', event.title);
      },

      removeTimelineEvent: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            timeline: state.data.timeline.filter(e => e.id !== id),
            updatedAt: new Date().toISOString()
          }
        }));
        get().addAudit('Timeline Event Removed', id);
      },

      clearTimeline: () => {
        set((state) => ({
          data: {
            ...state.data,
            timeline: [],
            updatedAt: new Date().toISOString()
          }
        }));
        get().addAudit('Timeline Cleared', 'All events removed');
      },

      setIntentLevel: (partId, level) => {
        set((state) => ({
          data: {
            ...state.data,
            intentLevels: { ...state.data.intentLevels, [partId]: level },
            updatedAt: new Date().toISOString()
          }
        }));
      },

      clearIntentLevels: () => {
        set((state) => ({
          data: {
            ...state.data,
            intentLevels: {},
            updatedAt: new Date().toISOString()
          }
        }));
        get().addAudit('Body Map Cleared', 'All intent selections cleared');
      },

      setDependents: (dependents) => {
        set((state) => ({
          data: {
            ...state.data,
            dependents: { ...state.data.dependents, ...dependents },
            updatedAt: new Date().toISOString()
          }
        }));
      },

      addFile: (file) => {
        set((state) => ({
          data: {
            ...state.data,
            uploadedFiles: [...state.data.uploadedFiles, file],
            updatedAt: new Date().toISOString()
          }
        }));
        get().addAudit('File Uploaded', file.name);
      },

      updateFile: (fileId, updates) => {
        set((state) => ({
          data: {
            ...state.data,
            uploadedFiles: state.data.uploadedFiles.map((f) =>
              f.id === fileId ? { ...f, ...updates } : f
            ),
            updatedAt: new Date().toISOString()
          }
        }));
      },

      removeFile: (fileId) => {
        set((state) => ({
          data: {
            ...state.data,
            uploadedFiles: state.data.uploadedFiles.filter(f => f.id !== fileId),
            updatedAt: new Date().toISOString()
          }
        }));
      },

      addOCRResult: (result) => {
        set((state) => ({
          data: {
            ...state.data,
            ocrResults: [...state.data.ocrResults, result],
            updatedAt: new Date().toISOString()
          }
        }));
        get().addAudit('OCR Processed', `${result.diagnoses.length} diagnoses found`);
      },

      addAudit: (action, value) => {
        const entry: AuditEntry = {
          id: generateId(),
          timestamp: new Date().toISOString(),
          action,
          value,
          phase: get().currentPhase
        };

        set((state) => ({
          data: {
            ...state.data,
            auditTrail: [...state.data.auditTrail, entry]
          }
        }));
      },

      getAuditTrail: () => get().data.auditTrail,

      showToast: (message, type = 'info', duration = 3000) => {
        const id = generateId();
        const toast: ToastMessage = { id, message, type, duration };

        set((state) => ({
          toasts: [...state.toasts, toast]
        }));

        if (duration > 0) {
          setTimeout(() => {
            get().dismissToast(id);
          }, duration);
        }
      },

      dismissToast: (id) => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      reset: () => {
        set({
          data: createInitialClaimData(),
          currentPhase: 0,
          selectedSystems: [],
          isLoading: false,
          error: null,
          toasts: []
        });
      },

      exportData: () => {
        const { data } = get();
        return JSON.stringify(data, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json) as ClaimData;
          set({ data });
          get().showToast('Data imported successfully', 'success');
          return true;
        } catch {
          get().showToast('Failed to import data', 'error');
          return false;
        }
      },

      getConditionCount: () => get().data.selectedConditions.length,
      getSystemCount: () => get().selectedSystems.length,
      isClaimStarted: () => {
        const { data } = get();
        return data.mission !== null || data.selectedConditions.length > 0;
      }
    }),
    {
      name: 'vault-dem-session-secure',
      storage: createJSONStorage(() => sessionStorage), // FIXED: Vanishes on tab close (Zero-Knowledge)
      version: 5, // Bumped to force clear old localStorage data
      migrate: (persisted: any) => {
        const next = { ...persisted };
        if (!next?.data) return next;

        if (!next.data.battleBuddy) {
          next.data.battleBuddy = { enabled: false };
        }
        if (!Array.isArray(next.data.timeline)) {
          next.data.timeline = [];
        }
        if (!next.data.intentLevels || typeof next.data.intentLevels !== 'object') {
          next.data.intentLevels = {};
        }
        if (next.data.poa === undefined) {
          next.data.poa = null;
        }
        if (!next.data.dependents) {
          next.data.dependents = { spouse: false, children: 0 };
        }
        if (!Array.isArray(next.data.auditTrail)) {
          next.data.auditTrail = [];
        }
        if (!Array.isArray(next.data.uploadedFiles)) {
          next.data.uploadedFiles = [];
        }
        if (!Array.isArray(next.data.ocrResults)) {
          next.data.ocrResults = [];
        }

        // Clamp persisted workflow phase to current registry range (0..4).
        // Older persisted states may have phases 5/6 from earlier iterations.
        if (typeof next.currentPhase === 'number') {
          next.currentPhase = Math.max(0, Math.min(MAX_WORKFLOW_PHASE, next.currentPhase));
        } else {
          next.currentPhase = 0;
        }
        return next;
      },
      partialize: (state) => ({
        data: state.data,
        currentPhase: state.currentPhase,
        selectedSystems: state.selectedSystems
      })
    }
  )
);

export const useIdentity = () => useClaimStore((s) => s.data.identity);
export const useMission = () => useClaimStore((s) => s.data.mission);
export const useConditions = () => useClaimStore((s) => s.data.selectedConditions);
export const useNarrative = () => useClaimStore((s) => s.data.narrative);
export const useCurrentPhase = () => useClaimStore((s) => s.currentPhase);
export const useToasts = () => useClaimStore((s) => s.toasts);
export const useSelectedSystems = () => useClaimStore((s) => s.selectedSystems);
export const useAuditTrail = () => useClaimStore((s) => s.data.auditTrail);
export const usePOA = () => useClaimStore((s) => s.data.poa);
export const useBattleBuddy = () => useClaimStore((s) => s.data.battleBuddy);
export const useTimeline = () => useClaimStore((s) => s.data.timeline);
export const useIntentLevels = () => useClaimStore((s) => s.data.intentLevels);
export const useUploadedFiles = () => useClaimStore((s) => s.data.uploadedFiles);
export const useOCRResults = () => useClaimStore((s) => s.data.ocrResults);

export default useClaimStore;



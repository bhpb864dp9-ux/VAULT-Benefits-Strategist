/**
 * VAULT DEM Engine — Claim Store
 * Zustand state management with sessionStorage persistence (Zero-Knowledge)
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  ClaimData, VeteranIdentity, SelectedCondition, MissionType, AuditEntry,
  POAInfo, Dependents, UploadedFile, OCRResult, WorkflowPhase, ToastMessage,
  BattleBuddyInfo, TimelineEvent, IntentLevel
} from '../types';

const MAX_WORKFLOW_PHASE = 4 as const;

const createInitialClaimData = (): ClaimData => ({
  id: 'claim_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9),
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
  setMission: (mission: MissionType | null) => void;
  addCondition: (condition: SelectedCondition) => void;
  removeCondition: (conditionId: string) => void;
  setNarrative: (narrative: string) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
  reset: () => void;
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

      setPhase: (phase) => set({ currentPhase: Math.max(0, Math.min(MAX_WORKFLOW_PHASE, phase)) as WorkflowPhase }),
      
      nextPhase: () => {
        const { currentPhase, canProceed } = get();
        if (canProceed() && currentPhase < MAX_WORKFLOW_PHASE) {
          set({ currentPhase: (currentPhase + 1) as WorkflowPhase });
        }
      },
      
      prevPhase: () => {
        const { currentPhase } = get();
        if (currentPhase > 0) set({ currentPhase: (currentPhase - 1) as WorkflowPhase });
      },

      canProceed: () => {
        const { currentPhase, data } = get();
        if (currentPhase === 0) return !!data.mission;
        if (currentPhase === 1) return data.identity.name.trim().length > 0;
        if (currentPhase === 2) return data.selectedConditions.length > 0;
        return true;
      },

      setIdentity: (identity) => set((s) => ({ data: { ...s.data, identity: { ...s.data.identity, ...identity } } })),
      setMission: (mission) => set((s) => ({ data: { ...s.data, mission } })),
      addCondition: (condition) => set((s) => ({ data: { ...s.data, selectedConditions: [...s.data.selectedConditions, condition] } })),
      removeCondition: (id) => set((s) => ({ data: { ...s.data, selectedConditions: s.data.selectedConditions.filter(c => c.id !== id) } })),
      setNarrative: (n) => set((s) => ({ data: { ...s.data, narrative: n } })),
      
      showToast: (message, type = 'info') => {
        const id = Date.now().toString();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().dismissToast(id), 3000);
      },
      
      dismissToast: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
      reset: () => set({ data: createInitialClaimData(), currentPhase: 0 }),
      isClaimStarted: () => { const { data } = get(); return !!data.mission || data.selectedConditions.length > 0; }
    }),
    {
      name: 'vault-dem-session-secure', 
      storage: createJSONStorage(() => sessionStorage), // <--- PRIVACY ENFORCED
      version: 5,
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

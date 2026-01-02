/**
 * ADH-MOSA — Feature Registry (Web)
 *
 * Single source of truth for:
 * - Top-level route metadata (Tabs)
 * - Workflow phase metadata (Features/SubFeatures)
 * - Implemented capabilities catalog (human-readable + machine-readable)
 *
 * IMPORTANT:
 * - This file is **framework-agnostic** (no React imports).
 * - React/Vite app should map these routes/phases to actual components locally.
 */

import capabilitiesJson from './capabilities.v1.json';

export type VaultWebRouteId =
  | 'home'
  | 'vbio'
  | 'calculator'
  | 'tools'
  | 'about'
  | 'claim'
  | 'results';

export type VaultWorkflowPhaseKey =
  | 'mission'
  | 'identity'
  | 'conditions'
  | 'narrative'
  | 'review';

export type VaultWebRoute = {
  id: VaultWebRouteId;
  label: string;
  path: string;
  showInHeaderNav?: boolean;
  order: number;
};

export type VaultWorkflowPhase = {
  id: number;
  key: VaultWorkflowPhaseKey;
  name: string;
  path: string;
  required: boolean;
};

export type VaultWebCapabilityKind = 'route' | 'workflow_phase' | 'subsystem' | 'tool' | 'component';

export type VaultWebCapability = {
  id: string;
  kind: VaultWebCapabilityKind;
  name: string;
  description: string;
  routeId?: VaultWebRouteId;
  workflowPhaseKey?: VaultWorkflowPhaseKey;
  routePath?: string;
  implementationPaths: string[];
};

// NOTE: React route/component wiring lives in the React/Vite project.

export const VAULT_WEB_ROUTES = [
  { id: 'home', label: 'Home', path: '/', showInHeaderNav: false, order: 0 },
  // VBIO is a deep link from Landing (not shown in top nav by default)
  { id: 'vbio', label: 'VBIO', path: '/vbio', showInHeaderNav: false, order: 5 },
  { id: 'calculator', label: 'Calculator', path: '/calculator', showInHeaderNav: true, order: 10 },
  { id: 'tools', label: 'Tools', path: '/tools', showInHeaderNav: true, order: 20 },
  { id: 'about', label: 'About', path: '/about', showInHeaderNav: true, order: 30 },
  { id: 'claim', label: 'Claim', path: '/claim', showInHeaderNav: false, order: 40 },
  { id: 'results', label: 'Results', path: '/results', showInHeaderNav: false, order: 50 }
] satisfies VaultWebRoute[];

export const VAULT_WORKFLOW_PHASES = [
  { id: 0, key: 'mission', name: 'Mission', path: 'mission', required: true },
  { id: 1, key: 'identity', name: 'Identity', path: 'identity', required: true },
  { id: 2, key: 'conditions', name: 'Conditions', path: 'conditions', required: true },
  { id: 3, key: 'narrative', name: 'Narrative', path: 'narrative', required: true },
  { id: 4, key: 'review', name: 'Review', path: 'review', required: true }
] satisfies VaultWorkflowPhase[];

export const VAULT_WEB_FEATURE_REGISTRY = {
  version: 1,
  routes: VAULT_WEB_ROUTES,
  workflowPhases: VAULT_WORKFLOW_PHASES
} as const;

export const VAULT_WEB_CAPABILITIES = (capabilitiesJson.capabilities || []) as VaultWebCapability[];

export function getHeaderNavRoutes() {
  return [...VAULT_WEB_FEATURE_REGISTRY.routes]
    .filter((r) => r.showInHeaderNav)
    .sort((a, b) => a.order - b.order);
}

export function getCapabilities() {
  return [...VAULT_WEB_CAPABILITIES];
}



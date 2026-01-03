/**
 * VAULT — Configuration Barrel Export
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

export {
  // Enums
  VaultTier,

  // Tier Definitions
  TIER_DEFINITIONS,
  getTierDefinition,
  getTierByName,
  getAnnualSavings,
  isFeatureAvailable,

  // Heroes & Hardship Program
  FREE_ACCESS_QUALIFICATIONS,
  checkFreeAccessEligibility,
  VALOR_AWARD_METADATA,

  // Types
  type TierDefinition,
  type FreeAccessQualification,
  type VeteranClaims,
} from './featureRegistry';

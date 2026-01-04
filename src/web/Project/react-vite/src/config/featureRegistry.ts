/**
 * VAULT — 1776 Heritage Pricing & Feature Registry
 *
 * "Every percent is earned. Some have already paid the full price."
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TIER DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * VAULT 1776 Heritage Pricing Tiers
 * All users must be authenticated (no anonymous tier)
 */
export enum VaultTier {
  AUTHENTICATED = 0,      // Free
  VETERAN = 1,            // $17.76/mo
  PROFESSIONAL = 2,       // $177.60/mo
  ENTERPRISE = 3,         // $1,776.00/mo
  GOVERNMENT = 4,         // $7,776.00/mo
}

export interface TierDefinition {
  tier: VaultTier;
  name: string;
  price: number;
  priceDisplay: string;
  annualPrice: number;
  annualDisplay: string;
  billing: 'free' | 'monthly' | 'annual' | 'contract';
  description: string;
  target: string;
  features: string[];
}

export const TIER_DEFINITIONS: TierDefinition[] = [
  {
    tier: VaultTier.AUTHENTICATED,
    name: 'Authenticated',
    price: 0,
    priceDisplay: 'Free',
    annualPrice: 0,
    annualDisplay: 'Free',
    billing: 'free',
    description: 'Basic access with account',
    target: 'All users',
    features: [
      'VA Rating Calculator (unlimited)',
      'Save & load estimates',
      'Interactive Body Map',
      'Document OCR (5/day)',
      'Educational content',
      'VASRD quick reference',
    ],
  },
  {
    tier: VaultTier.VETERAN,
    name: 'Veteran',
    price: 17.76,
    priceDisplay: '$17.76',
    annualPrice: 177.60,
    annualDisplay: '$177.60/yr',
    billing: 'monthly',
    description: 'Full claim development for verified veterans',
    target: 'Individual veterans',
    features: [
      'Everything in Authenticated',
      'Full 5-phase claim workflow',
      'Unlimited document OCR',
      'Evidence organization',
      'Narrative builder',
      'Entitlement Assurance',
      'PDF claim export',
      'Service-aware personalization',
      'Evidence gap detection',
      'Rating optimization',
    ],
  },
  {
    tier: VaultTier.PROFESSIONAL,
    name: 'Professional',
    price: 177.60,
    priceDisplay: '$177.60',
    annualPrice: 1776.00,
    annualDisplay: '$1,776/yr',
    billing: 'monthly',
    description: 'Tools for claims agents and VSOs',
    target: 'VSO / Accredited agents',
    features: [
      'Everything in Veteran',
      'Multi-client management (50)',
      'Batch document processing',
      '38 CFR citation integration',
      'VA Form 21-526EZ generator',
      'DBQ auto-population',
      'Analytics dashboard',
      'Priority support',
    ],
  },
  {
    tier: VaultTier.ENTERPRISE,
    name: 'Enterprise',
    price: 1776.00,
    priceDisplay: '$1,776',
    annualPrice: 17760.00,
    annualDisplay: '$17,760/yr',
    billing: 'monthly',
    description: 'Full platform for organizations',
    target: 'Law firms / Organizations',
    features: [
      'Everything in Professional',
      'Unlimited clients',
      'API access',
      'Audit logs',
      'Compliance reports',
      'BVA case law integration',
      'White label option',
      'Dedicated account manager',
      'SLA support (24/7)',
    ],
  },
  {
    tier: VaultTier.GOVERNMENT,
    name: 'Government',
    price: 7776.00,
    priceDisplay: '$7,776',
    annualPrice: 0,
    annualDisplay: 'Contract',
    billing: 'contract',
    description: 'Federal enterprise deployment',
    target: 'Federal / DoD',
    features: [
      'Everything in Enterprise',
      'On-premise deployment',
      'FedRAMP compliance path',
      'IL4/IL5 support',
      'CAC/PIV authentication',
      'Login.gov integration (coming soon)',
      'ITAR compliance',
      'Dedicated infrastructure',
      'Federal contract terms',
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// HEROES & HARDSHIP PROGRAM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Free Access Qualifications
 * "Some have already paid the full price."
 */
export interface FreeAccessQualification {
  id: string;
  name: string;
  category: 'valor' | 'hardship';
  description: string;
  verificationMethod: string;
  grantedTier: VaultTier;
}

export const FREE_ACCESS_QUALIFICATIONS: FreeAccessQualification[] = [
  // ─────────────────────────────────────────────────────────────────────────────
  // Valor Awards
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'medal-of-honor',
    name: 'Medal of Honor',
    category: 'valor',
    description: "Nation's highest military decoration",
    verificationMethod: 'ID.me military scope or DD-214',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'distinguished-service-cross',
    name: 'Distinguished Service Cross',
    category: 'valor',
    description: 'Army extraordinary heroism in combat',
    verificationMethod: 'ID.me military scope or DD-214',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'navy-cross',
    name: 'Navy Cross',
    category: 'valor',
    description: 'Navy/Marine Corps extraordinary heroism',
    verificationMethod: 'ID.me military scope or DD-214',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'air-force-cross',
    name: 'Air Force Cross',
    category: 'valor',
    description: 'Air Force extraordinary heroism',
    verificationMethod: 'ID.me military scope or DD-214',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'silver-star',
    name: 'Silver Star',
    category: 'valor',
    description: 'Gallantry in action against enemy',
    verificationMethod: 'ID.me military scope or DD-214',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'bronze-star-v',
    name: 'Bronze Star with "V" Device',
    category: 'valor',
    description: 'Valor in combat operations',
    verificationMethod: 'ID.me military scope or DD-214',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'purple-heart',
    name: 'Purple Heart',
    category: 'valor',
    description: 'Wounded or killed in combat',
    verificationMethod: 'ID.me military scope or DD-214',
    grantedTier: VaultTier.VETERAN,
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // Hardship Categories
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'homeless',
    name: 'Homeless Veteran',
    category: 'hardship',
    description: 'Currently experiencing homelessness',
    verificationMethod: 'Self-declaration or HUD-VASH enrollment',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: '100-pt',
    name: '100% P&T',
    category: 'hardship',
    description: 'Permanent & Total disability rating',
    verificationMethod: 'VA verification letter',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'tdiu',
    name: 'TDIU',
    category: 'hardship',
    description: 'Total Disability Individual Unemployability',
    verificationMethod: 'VA verification letter',
    grantedTier: VaultTier.VETERAN,
  },
  {
    id: 'gold-star',
    name: 'Gold Star Family',
    category: 'hardship',
    description: 'Surviving spouse or dependent of fallen service member',
    verificationMethod: 'DD-1300 or VA DIC letter',
    grantedTier: VaultTier.VETERAN,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ELIGIBILITY CHECKING
// ═══════════════════════════════════════════════════════════════════════════════

export interface VeteranClaims {
  isHomeless?: boolean;
  rating?: number;
  isPermanentTotal?: boolean;
  isTDIU?: boolean;
  isGoldStarFamily?: boolean;
  awards?: string[];
}

/**
 * Check if user qualifies for free access under Heroes & Hardship Program
 */
export function checkFreeAccessEligibility(
  claims: VeteranClaims
): FreeAccessQualification | null {
  // Check homeless status
  if (claims.isHomeless) {
    return FREE_ACCESS_QUALIFICATIONS.find(q => q.id === 'homeless') || null;
  }

  // Check 100% P&T
  if (claims.rating === 100 && claims.isPermanentTotal) {
    return FREE_ACCESS_QUALIFICATIONS.find(q => q.id === '100-pt') || null;
  }

  // Check TDIU
  if (claims.isTDIU) {
    return FREE_ACCESS_QUALIFICATIONS.find(q => q.id === 'tdiu') || null;
  }

  // Check Gold Star
  if (claims.isGoldStarFamily) {
    return FREE_ACCESS_QUALIFICATIONS.find(q => q.id === 'gold-star') || null;
  }

  // Check valor awards (priority order: highest honor first)
  const valorAwards = [
    'medal-of-honor',
    'distinguished-service-cross',
    'navy-cross',
    'air-force-cross',
    'silver-star',
    'bronze-star-v',
    'purple-heart',
  ];

  for (const awardId of valorAwards) {
    if (claims.awards?.includes(awardId)) {
      return FREE_ACCESS_QUALIFICATIONS.find(q => q.id === awardId) || null;
    }
  }

  return null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TIER HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get tier definition by tier enum
 */
export function getTierDefinition(tier: VaultTier): TierDefinition | undefined {
  return TIER_DEFINITIONS.find(t => t.tier === tier);
}

/**
 * Get tier by name
 */
export function getTierByName(name: string): TierDefinition | undefined {
  return TIER_DEFINITIONS.find(t => t.name.toLowerCase() === name.toLowerCase());
}

/**
 * Calculate annual savings percentage (always 17.76% for 1776 theme)
 */
export function getAnnualSavings(): number {
  return 17.76;
}

/**
 * Check if a feature is available at a given tier
 */
export function isFeatureAvailable(userTier: VaultTier, requiredTier: VaultTier): boolean {
  return userTier >= requiredTier;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VALOR AWARDS METADATA
// ═══════════════════════════════════════════════════════════════════════════════

export const VALOR_AWARD_METADATA = {
  'medal-of-honor': {
    fullName: 'Medal of Honor',
    abbreviation: 'MOH',
    precedence: 1,
    branches: ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force'],
  },
  'distinguished-service-cross': {
    fullName: 'Distinguished Service Cross',
    abbreviation: 'DSC',
    precedence: 2,
    branches: ['Army'],
  },
  'navy-cross': {
    fullName: 'Navy Cross',
    abbreviation: 'NC',
    precedence: 2,
    branches: ['Navy', 'Marine Corps'],
  },
  'air-force-cross': {
    fullName: 'Air Force Cross',
    abbreviation: 'AFC',
    precedence: 2,
    branches: ['Air Force', 'Space Force'],
  },
  'silver-star': {
    fullName: 'Silver Star',
    abbreviation: 'SS',
    precedence: 3,
    branches: ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force'],
  },
  'bronze-star-v': {
    fullName: 'Bronze Star Medal with "V" Device',
    abbreviation: 'BSM-V',
    precedence: 4,
    branches: ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force'],
  },
  'purple-heart': {
    fullName: 'Purple Heart',
    abbreviation: 'PH',
    precedence: 5,
    branches: ['Army', 'Navy', 'Air Force', 'Marine Corps', 'Coast Guard', 'Space Force'],
  },
} as const;

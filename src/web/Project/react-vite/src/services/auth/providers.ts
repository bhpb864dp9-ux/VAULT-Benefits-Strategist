/**
 * VAULT — OAuth 2.0 / OpenID Connect Provider Configurations
 * Supports: Apple, Google, ID.me, Login.gov
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Login.gov DISABLED: Requires backend private_key_jwt service for production
// Will be re-enabled post-MVP when backend infrastructure is available
export type AuthProvider = 'apple' | 'google' | 'idme';

// Keeping type for future use
export type AuthProviderFuture = 'apple' | 'google' | 'idme' | 'logingov';

export interface ProviderConfig {
  id: AuthProvider;
  name: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  responseType: string;
  authorizationEndpoint: string;
  tokenEndpoint: string;
  userInfoEndpoint?: string;
  usePKCE: boolean;
  codeChallengeMethod: 'S256' | 'plain';

  // Provider-specific
  responseMode?: string;       // Apple uses 'fragment'
  prompt?: string;             // Google uses 'select_account'
  acr_values?: string;         // Login.gov IAL
  requiredLOA?: number;        // ID.me LOA requirement
  verificationGroup?: string;  // ID.me veteran group
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════════════════════

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://vault-dem.pages.dev'; // Default for SSR
};

/**
 * Apple Sign In Configuration
 * https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_js/configuring_your_webpage_for_sign_in_with_apple
 */
export const appleConfig: ProviderConfig = {
  id: 'apple',
  name: 'Apple',
  clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'com.vault.webapp',
  redirectUri: `${getBaseUrl()}/auth/callback/apple`,
  scope: 'name email',
  responseType: 'code id_token',
  responseMode: 'fragment',
  authorizationEndpoint: 'https://appleid.apple.com/auth/authorize',
  tokenEndpoint: 'https://appleid.apple.com/auth/token',
  usePKCE: true,
  codeChallengeMethod: 'S256',
};

/**
 * Google Sign In Configuration
 * https://developers.google.com/identity/protocols/oauth2/web-server
 */
export const googleConfig: ProviderConfig = {
  id: 'google',
  name: 'Google',
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  redirectUri: `${getBaseUrl()}/auth/callback/google`,
  scope: 'openid email profile',
  responseType: 'code',
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
  usePKCE: true,
  codeChallengeMethod: 'S256',
  prompt: 'select_account',
};

/**
 * ID.me Configuration (Veteran Verification)
 * https://developers.id.me/documentation/identity
 */
export const idmeConfig: ProviderConfig = {
  id: 'idme',
  name: 'ID.me',
  clientId: import.meta.env.VITE_IDME_CLIENT_ID || '',
  redirectUri: `${getBaseUrl()}/auth/callback/idme`,
  scope: 'openid military',  // 'military' scope verifies veteran status
  responseType: 'code',
  authorizationEndpoint: 'https://api.id.me/oauth/authorize',
  tokenEndpoint: 'https://api.id.me/oauth/token',
  userInfoEndpoint: 'https://api.id.me/api/public/v3/attributes.json',
  usePKCE: true,
  codeChallengeMethod: 'S256',
  requiredLOA: 2,
  verificationGroup: 'veteran',
};

/**
 * Login.gov Configuration (Federal Identity)
 * https://developers.login.gov/oidc/
 *
 * DISABLED: Login.gov production requires private_key_jwt authentication
 * which needs a backend service. Deferred to post-MVP.
 *
 * Re-enable when backend JWT signing service is available.
 */
// export const logingovConfig: ProviderConfig = {
//   id: 'logingov',
//   name: 'Login.gov',
//   clientId: import.meta.env.VITE_LOGINGOV_CLIENT_ID || '',
//   redirectUri: `${getBaseUrl()}/auth/callback/logingov`,
//   scope: 'openid email profile',
//   responseType: 'code',
//   authorizationEndpoint: 'https://secure.login.gov/openid_connect/authorize',
//   tokenEndpoint: 'https://secure.login.gov/api/openid_connect/token',
//   userInfoEndpoint: 'https://secure.login.gov/api/openid_connect/userinfo',
//   usePKCE: true,
//   codeChallengeMethod: 'S256',
//   acr_values: 'http://idmanagement.gov/ns/assurance/ial/2',
// };

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const PROVIDER_CONFIGS: Record<AuthProvider, ProviderConfig> = {
  apple: appleConfig,
  google: googleConfig,
  idme: idmeConfig,
  // logingov: logingovConfig,  // DISABLED: Backend required
};

export function getProviderConfig(provider: AuthProvider): ProviderConfig {
  const config = PROVIDER_CONFIGS[provider];
  if (!config) {
    throw new Error(`Unknown auth provider: ${provider}`);
  }
  return config;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROVIDER DISPLAY INFO
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProviderDisplayInfo {
  id: AuthProvider;
  name: string;
  icon: string;
  description: string;
  badge?: string;
  available: boolean;
}

export const PROVIDER_DISPLAY: ProviderDisplayInfo[] = [
  {
    id: 'apple',
    name: 'Apple',
    icon: 'apple',
    description: 'Sign in with your Apple ID',
    available: true,
  },
  {
    id: 'google',
    name: 'Google',
    icon: 'google',
    description: 'Sign in with Google',
    available: true,
  },
  {
    id: 'idme',
    name: 'ID.me',
    icon: 'shield-check',
    description: 'Verify your veteran status',
    badge: 'Veteran Verified',
    available: true,
  },
  // Login.gov DISABLED: Requires backend private_key_jwt service
  // {
  //   id: 'logingov',
  //   name: 'Login.gov',
  //   icon: 'landmark',
  //   description: 'Federal identity verification',
  //   badge: 'Federal Standard',
  //   available: false,
  // },
];

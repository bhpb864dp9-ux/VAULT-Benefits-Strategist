/**
 * VAULT — PKCE (Proof Key for Code Exchange) Utilities
 * RFC 7636 compliant implementation for OAuth 2.0
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PKCE UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate cryptographically secure code verifier
 * Per RFC 7636: 43-128 characters, [A-Z] / [a-z] / [0-9] / "-" / "." / "_" / "~"
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Generate code challenge from verifier using SHA-256
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Generate random state parameter for CSRF protection
 */
export function generateState(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Generate nonce for replay protection (OIDC)
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

/**
 * Base64 URL encode (no padding, URL-safe characters)
 * Per RFC 4648 Section 5
 */
function base64UrlEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Base64 URL decode
 */
export function base64UrlDecode(str: string): Uint8Array {
  // Add padding if needed
  const padding = (4 - (str.length % 4)) % 4;
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    + '='.repeat(padding);

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export type PKCEState = {
  codeVerifier: string;
  state: string;
  nonce: string;
};

export async function generatePKCEState(): Promise<PKCEState & { codeChallenge: string }> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();
  const nonce = generateNonce();

  return {
    codeVerifier,
    codeChallenge,
    state,
    nonce,
  };
}

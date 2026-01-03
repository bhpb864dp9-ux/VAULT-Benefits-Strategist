/**
 * VAULT — Cryptographic Utilities for Auth Token Storage
 * Uses Web Crypto API for secure local storage encryption
 *
 * VAULT LLC — A Northstar|Insight Inc. Company
 * © 2026 All Rights Reserved
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const VAULT_KEY_NAME = 'vault_crypto_key';
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

// ═══════════════════════════════════════════════════════════════════════════════
// KEY MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get or create encryption key for this session
 * Key is stored in sessionStorage and regenerated each session
 */
async function getOrCreateKey(): Promise<CryptoKey> {
  // Check if key exists in memory
  const existingKeyData = sessionStorage.getItem(VAULT_KEY_NAME);

  if (existingKeyData) {
    const keyData = JSON.parse(existingKeyData);
    return await crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: ALGORITHM, length: KEY_LENGTH },
      true,
      ['encrypt', 'decrypt']
    );
  }

  // Generate new key
  const key = await crypto.subtle.generateKey(
    { name: ALGORITHM, length: KEY_LENGTH },
    true,
    ['encrypt', 'decrypt']
  );

  // Export and store key
  const exportedKey = await crypto.subtle.exportKey('jwk', key);
  sessionStorage.setItem(VAULT_KEY_NAME, JSON.stringify(exportedKey));

  return key;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENCRYPTION / DECRYPTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Encrypt a string value
 * Returns base64-encoded ciphertext with IV prepended
 */
export async function encryptToken(plaintext: string): Promise<string> {
  const key = await getOrCreateKey();
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate random IV (12 bytes for AES-GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt
  const ciphertext = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.length);

  // Encode to base64
  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a string value
 * Expects base64-encoded ciphertext with IV prepended
 */
export async function decryptToken(encrypted: string): Promise<string> {
  const key = await getOrCreateKey();

  // Decode from base64
  const combined = new Uint8Array(
    atob(encrypted).split('').map((c) => c.charCodeAt(0))
  );

  // Extract IV and ciphertext
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);

  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    ciphertext
  );

  // Decode to string
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

/**
 * Clear encryption key (logout)
 */
export function clearEncryptionKey(): void {
  sessionStorage.removeItem(VAULT_KEY_NAME);
}

// ═══════════════════════════════════════════════════════════════════════════════
// HASH UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate SHA-256 hash of data
 */
export async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate fingerprint for session validation
 */
export async function generateSessionFingerprint(): Promise<string> {
  const data = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    screen.width.toString(),
    screen.height.toString(),
  ].join('|');

  return sha256(data);
}

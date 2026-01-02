import { vi } from 'vitest';

// Robust localStorage polyfill (some Vitest envs may not provide a full implementation).
function createMemoryStorage() {
  let store: Record<string, string> = {};
  return {
    get length() {
      return Object.keys(store).length;
    },
    clear() {
      store = {};
    },
    getItem(key: string) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    key(index: number) {
      const keys = Object.keys(store);
      return keys[index] ?? null;
    },
    removeItem(key: string) {
      delete store[key];
    },
    setItem(key: string, value: string) {
      store[key] = String(value);
    }
  };
}

const ls: any = (globalThis as any).localStorage;
if (!ls || typeof ls.getItem !== 'function' || typeof ls.setItem !== 'function' || typeof ls.clear !== 'function') {
  (globalThis as any).localStorage = createMemoryStorage();
}

// JSDOM does not implement these URL helpers by default.
if (!('createObjectURL' in URL)) {
  // @ts-expect-error - define for tests
  URL.createObjectURL = vi.fn(() => 'blob:vitest-mock');
}
if (!('revokeObjectURL' in URL)) {
  // @ts-expect-error - define for tests
  URL.revokeObjectURL = vi.fn(() => undefined);
}

// Some UI libs check matchMedia; provide a lightweight stub.
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    value: () => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false
    }),
    writable: true
  });
}



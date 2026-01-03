/**
 * VAULT Vitest Configuration
 * Test runner configuration for 99% CI target
 *
 * Engineer: Alfred Hull
 * Project: VAULT LLC, a Northstar|Insight Inc. corporation
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        'vite.config.ts',
        'vitest.config.ts',
      ],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 55,
        lines: 60
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});

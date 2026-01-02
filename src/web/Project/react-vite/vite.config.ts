import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  base: '/VAULT-Benefits-Strategist/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'VAULT DEM Engine',
        short_name: 'VAULT',
        description:
          'Deterministic Entitlement Maximization for VA Disability Claims — FREE FOREVER for Veterans',
        theme_color: '#0a0f14',
        background_color: '#0a0f14',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['medical', 'utilities', 'productivity']
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,woff}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        // IMPORTANT: keep dev un-cached to avoid "stale UI" while iterating.
        // PWA should be validated via `npm run preview`/production builds instead.
        enabled: false,
        type: 'module'
      }
    })
  ],
  /**
   * @vault-feature VAULT-NF-PW-001 PWA Offline Caching & Installability
   */
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@types': path.resolve(__dirname, './src/types'),
      // ADH-MOSA shared (outside Vite root)
      '@mosa': path.resolve(__dirname, '../../Shared')
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-state': ['zustand'],
          'vendor-ocr': ['tesseract.js'],
          'vendor-pdf': ['pdf-lib', 'jszip', 'file-saver'],
          'vendor-ui': ['lucide-react', 'clsx']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    fs: {
      allow: [path.resolve(__dirname, '../..')]
    }
  },
  preview: {
    port: 4173,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand', 'lucide-react'],
    exclude: ['tesseract.js']
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    restoreMocks: true,
    clearMocks: true
  }
});
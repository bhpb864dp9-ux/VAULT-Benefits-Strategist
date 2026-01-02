/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0a0f14', 900: '#111820', 800: '#1c252f', 700: '#2d3a47',
          600: '#4a5a6a', 500: '#64748b', 400: '#8899aa', 300: '#b0bfcf',
          200: '#c8d4e0', 100: '#e8eef4', 50: '#f4f7fa'
        },
        brass: {
          DEFAULT: '#c9a227', light: '#d4b23d', dark: '#a88a1f',
          muted: 'rgba(201, 162, 39, 0.12)', glow: 'rgba(201, 162, 39, 0.3)'
        },
        intent: {
          mild: '#38bdf8', moderate: '#fbbf24', severe: '#fb7185',
          success: '#22c55e', invited: '#a78bfa'
        },
        success: { DEFAULT: '#22c55e', muted: 'rgba(34, 197, 94, 0.15)' },
        warning: { DEFAULT: '#f59e0b', muted: 'rgba(245, 158, 11, 0.15)' },
        error: { DEFAULT: '#ef4444', muted: 'rgba(239, 68, 68, 0.15)' }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif']
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)'
      },
      animation: {
        'glass-shimmer': 'shimmer 8s ease-in-out infinite',
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0a0f14', // Deepest Void
          900: '#111820',
          800: '#1c252f',
          700: '#2d3a47', // Structural Steel
          600: '#4a5a6a',
          500: '#64748b',
          400: '#8899aa',
          300: '#b0bfcf',
          200: '#c8d4e0',
          100: '#e8eef4',
          50: '#f4f7fa'   // Starlight
        },
        brass: {
          DEFAULT: '#c9a227', // The Medal
          light: '#d4b23d',
          dark: '#a88a1f',
          muted: 'rgba(201, 162, 39, 0.12)',
          glow: 'rgba(201, 162, 39, 0.3)'
        },
        intent: {
          mild: '#38bdf8',    // Air Force Blue
          moderate: '#fbbf24', // Caution
          severe: '#fb7185',   // Critical
          success: '#22c55e',
          invited: '#a78bfa'
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif']
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 1, 0.5, 1)', // The "Spring" feel
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)'
      },
      animation: {
        'glass-shimmer': 'shimmer 8s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' }
        }
      }
    }
  },
  plugins: []
};

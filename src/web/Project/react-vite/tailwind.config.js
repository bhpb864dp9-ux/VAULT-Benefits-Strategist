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
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif']
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
};

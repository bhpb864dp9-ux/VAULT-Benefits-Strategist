/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)'
      },
      colors: {
        brass: {
          DEFAULT: '#c9a227'
        },
        intent: {
          mild: '#38bdf8'
        }
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0a0f14',
          900: '#111820',
          800: '#1c252f',
          700: '#2d3a47',
          600: '#4a5a6a',
          500: '#64748b',
          400: '#8899aa',
          300: '#b0bfcf',
          200: '#c8d4e0',
          100: '#e8eef4',
          50: '#f4f7fa'
        },
        brass: {
          DEFAULT: '#c9a227',
          light: '#d4b23d',
          dark: '#a88a1f',
          muted: 'rgba(201, 162, 39, 0.12)',
          glow: 'rgba(201, 162, 39, 0.3)'
        },
        intent: {
          mild: '#38bdf8',
          moderate: '#fbbf24',
          severe: '#fb7185',
          success: '#22c55e',
          invited: '#a78bfa'
        },
        success: {
          DEFAULT: '#22c55e',
          dark: '#16a34a',
          light: '#4ade80',
          muted: 'rgba(34, 197, 94, 0.15)'
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24',
          muted: 'rgba(245, 158, 11, 0.15)'
        },
        error: {
          DEFAULT: '#ef4444',
          dark: '#dc2626',
          light: '#f87171',
          muted: 'rgba(239, 68, 68, 0.15)'
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.6s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        breath: 'breath 7s ease-in-out infinite',
        'flag-wave': 'flagWave 10s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        breath: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.003)' }
        },
        flagWave: {
          '0%, 100%': { transform: 'skewX(0deg) translateY(0px)' },
          '50%': { transform: 'skewX(-1deg) translateY(1px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)'
      }
    }
  },
  plugins: []
};



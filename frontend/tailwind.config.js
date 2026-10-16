/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          forest: '#166534',
          leaf: '#65A30D',
          cream: '#F8FAF0',
          gold: '#FACC15',
          charcoal: '#1F2937',
          deepMoss: '#0B3B22',
          mintMist: '#DCFCE7',
          clay: '#B45309',
          sky: '#38BDF8',
          rain: '#2563EB',
          soilBrown: '#78350F',
          alertCoral: '#EF4444',
          nightBg: '#08170e',
          nightCard: '#0f291a',
        }
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
        tamil: ['"Noto Sans Tamil"', 'sans-serif'],
        hindi: ['"Noto Sans Devanagari"', 'sans-serif'],
        hand: ['Caveat', 'cursive']
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

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
        space: {
          950: '#06070a', // Deep velvet obsidian
          900: '#0b0d13',
          850: '#11141d',
          800: '#181c28',
          750: '#202636',
          700: '#2a3247',
        },
        luxury: {
          gold: '#d4af37',
          goldLight: '#f5e6b8',
          champagne: '#e6d7c3',
          platinum: '#f8fafc',
          azure: '#38bdf8',
          emerald: '#10b981',
          rose: '#f43f5e',
        },
        cyber: {
          cyan: '#38bdf8', // softened from harsh neon to luxurious azure
          aqua: '#2dd4bf',
          lime: '#eab308', // refined gold/amber accent
          lime2: '#d4af37',
          orange: '#f97316',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
        'luxury-glow': '0 0 35px -5px rgba(212, 175, 55, 0.15), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'azure-glow': '0 0 35px -5px rgba(56, 189, 248, 0.15), 0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'spin-slow': 'spin 35s linear infinite',
        'spin-reverse-slow': 'spin-reverse 45s linear infinite',
        'float-gentle': 'floatGentle 8s ease-in-out infinite',
      },
      keyframes: {
        'spin-reverse': {
          from: { transform: 'rotate(360deg)' },
          to: { transform: 'rotate(0deg)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

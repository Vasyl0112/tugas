/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'space-dark': '#0d0d0d',
        'space-dark-mid': '#141d2b',
        'neon': '#00e0ff',
        'neon-green': '#00ffb7',
        'neon-purple': '#a370f7',
        'text-primary': '#ffffff',
        'text-secondary': 'rgba(255, 255, 255, 0.7)',
        'border': 'rgba(255, 255, 255, 0.1)',
      },
      fontFamily: {
        'sora': ['Sora', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 224, 255, 0.3)',
        'neon-hover': '0 0 30px rgba(0, 224, 255, 0.5)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        glow: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 }
        }
      },
    }
  },
  plugins: []
};
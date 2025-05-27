/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors
        'space-dark': '#0a0a0f',
        'space-dark-mid': '#1a1a2e',
        'space-dark-light': '#16213e',
        'primary': '#00d4aa',
        'secondary': '#6366f1',
        'text-primary': '#ffffff',
        'text-secondary': '#a0a0a0',
        'border': 'rgba(255, 255, 255, 0.1)',
        'snack-red': '#ff6b6b',
        'snack-teal': '#4ecdc4',
        'snack-yellow': '#ffe66d',
        'chart-gradient-1': '#00d4aa',
        'chart-gradient-2': '#6366f1',
        'chart-gradient-3': '#f093fb',
        
        // Light theme colors
        'light-bg': {
          'start': '#f8fafc',
          'mid': '#e2e8f0',
          'end': '#cbd5e1',
        },
        'light-primary': '#06b6d4',
        'light-secondary': '#6366f1',
        'light-text': {
          'primary': '#1e293b',
          'secondary': '#64748b',
        },
        'light-border': 'rgba(0, 0, 0, 0.06)',
        'light-snack': {
          '1': '#fbbf24',
          '2': '#fb7185',
          '3': '#34d399',
          '4': '#60a5fa',
        },
        'light-chart': {
          '1': '#06b6d4',
          '2': '#6366f1',
          '3': '#ec4899',
          '4': '#10b981',
        }
      },
      boxShadow: {
        // Dark theme shadows
        'glow': '0 0 15px rgba(0, 212, 170, 0.3)',
        'cosmic': '0 4px 20px -2px rgba(0, 212, 170, 0.2)',
        'float': '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        
        // Light theme shadows
        'light-glow': '0 0 15px rgba(6, 182, 212, 0.2)',
        'light': '0 4px 20px -2px rgba(0, 0, 0, 0.02)',
        'light-float': '0 8px 32px rgba(31, 38, 135, 0.1)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'slide': 'slide 20s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
};
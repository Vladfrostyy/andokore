/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A1A',
        secondary: '#666666',
        accent: '#F5F5F7',
        border: '#E5E5E5',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse-slow 3s infinite',
        'shake-slow': 'shake-intermittent 4s infinite',
        'glow': 'glow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        'shake-intermittent': {
          '0%, 90%': { transform: 'rotate(0deg)' },
          '92%': { transform: 'rotate(-1deg)' },
          '96%': { transform: 'rotate(1deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255,255,255,0)' },
          '50%': { boxShadow: '0 0 15px rgba(255,255,255,0.6)' },
        }
      }
    },
  },
  plugins: [],
}
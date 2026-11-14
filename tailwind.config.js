/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        accent: {
          DEFAULT: '#6C47FF',
          50: '#F3F0FF',
          100: '#E7E0FF',
          200: '#CFC2FF',
          400: '#8F72FF',
          500: '#6C47FF',
          600: '#5A35F0',
          700: '#4A28D1',
        },
        ink: {
          DEFAULT: '#0A0A0A',
          900: '#0A0A0A',
          800: '#161616',
          700: '#1F1F1F',
          600: '#2A2A2A',
        },
      },
      borderRadius: { '4xl': '2rem' },
      keyframes: {
        'pin-drop': {
          '0%': { transform: 'translateY(-40px) scale(.6)', opacity: 0 },
          '60%': { transform: 'translateY(4px) scale(1.06)', opacity: 1 },
          '80%': { transform: 'translateY(-2px) scale(.98)' },
          '100%': { transform: 'translateY(0) scale(1)' },
        },
        'fade-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'sheet-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'heart-pop': {
          '0%': { transform: 'scale(0)', opacity: 0 },
          '15%': { transform: 'scale(1.25)', opacity: 1 },
          '30%': { transform: 'scale(.95)', opacity: 1 },
          '45%': { transform: 'scale(1.05)', opacity: 1 },
          '80%': { transform: 'scale(1)', opacity: 1 },
          '100%': { transform: 'scale(1.3)', opacity: 0 },
        },
        'like-bump': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        'toast-in': {
          '0%': { transform: 'translate(-50%, 20px) scale(.95)', opacity: 0 },
          '100%': { transform: 'translate(-50%, 0) scale(1)', opacity: 1 },
        },
        bounce1: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        progress: { '0%': { width: '0%' }, '100%': { width: '100%' } },
      },
      animation: {
        'pin-drop': 'pin-drop .6s cubic-bezier(.34,1.56,.64,1) both',
        'fade-up': 'fade-up .35s ease-out backwards',
        'sheet-up': 'sheet-up .32s cubic-bezier(.22,1,.36,1) both',
        'fade-in': 'fade-in .2s ease-out both',
        'heart-pop': 'heart-pop .9s ease-out both',
        'like-bump': 'like-bump .35s ease-out',
        'toast-in': 'toast-in .25s cubic-bezier(.34,1.56,.64,1) both',
        bounce1: 'bounce1 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

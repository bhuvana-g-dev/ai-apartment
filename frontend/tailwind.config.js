/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // Page enter
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Card reveal
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Hero text
        'fade-down': {
          '0%':   { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Logo pop
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Shimmer for skeletons
        shimmer: {
          '0%':   { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        // Floating badge
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        // Pulse ring for compare indicator
        'ping-slow': {
          '0%':   { transform: 'scale(1)', opacity: '1' },
          '75%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        // Stagger children (used via delay utilities)
        'stagger-in': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up':    'fade-up 0.4s ease-out both',
        'fade-in':    'fade-in 0.3s ease-out both',
        'fade-down':  'fade-down 0.4s ease-out both',
        'slide-up':   'slide-up 0.35s ease-out both',
        'scale-in':   'scale-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'float':      'float 3s ease-in-out infinite',
        'ping-slow':  'ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'stagger-in': 'stagger-in 0.3s ease-out both',
        // Shimmer override for skeleton — replaces the default pulse
        'shimmer':    'shimmer 1.4s linear infinite',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.03em',
      },
      keyframes: {
        'fade-up':    { '0%': { opacity:'0', transform:'translateY(14px)' },  '100%': { opacity:'1', transform:'translateY(0)' } },
        'fade-down':  { '0%': { opacity:'0', transform:'translateY(-14px)' }, '100%': { opacity:'1', transform:'translateY(0)' } },
        'fade-in':    { '0%': { opacity:'0' },                                '100%': { opacity:'1' } },
        'slide-up':   { '0%': { opacity:'0', transform:'translateY(20px)' },  '100%': { opacity:'1', transform:'translateY(0)' } },
        'scale-in':   { '0%': { opacity:'0', transform:'scale(0.88)' },       '100%': { opacity:'1', transform:'scale(1)' } },
        'stagger-in': { '0%': { opacity:'0', transform:'translateY(10px)' },  '100%': { opacity:'1', transform:'translateY(0)' } },
        'drawer-in':  { '0%': { opacity:'0', transform:'translateY(-8px)' },  '100%': { opacity:'1', transform:'translateY(0)' } },
        'float':      { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-4px)' } },
        'ping-slow':  { '0%': { transform:'scale(1)', opacity:'1' }, '75%,100%': { transform:'scale(1.8)', opacity:'0' } },
        shimmer:      { '0%': { backgroundPosition:'200% 0' }, '100%': { backgroundPosition:'-200% 0' } },
      },
      animation: {
        'fade-up':    'fade-up    0.35s ease-out both',
        'fade-down':  'fade-down  0.35s ease-out both',
        'fade-in':    'fade-in    0.3s  ease-out both',
        'slide-up':   'slide-up   0.4s  ease-out both',
        'scale-in':   'scale-in   0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        'stagger-in': 'stagger-in 0.35s ease-out both',
        'drawer-in':  'drawer-in  0.2s  ease-out both',
        'float':      'float      3s    ease-in-out infinite',
        'ping-slow':  'ping-slow  1.5s  cubic-bezier(0,0,0.2,1) infinite',
        'shimmer':    'shimmer    1.4s  ease-in-out infinite',
      },
      transitionDuration: { '250': '250ms', '350': '350ms', '400': '400ms' },
      transitionProperty: {
        'lift': 'transform, box-shadow, opacity',
      },
    },
  },
  plugins: [],
}

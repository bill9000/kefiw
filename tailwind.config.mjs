/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f7ff',
          100: '#dbecff',
          200: '#bedbff',
          300: '#92c3ff',
          400: '#5ca2ff',
          500: '#3a83f4',
          600: '#2666e1',
          700: '#1f52c2',
          800: '#1e439a',
          900: '#1d3b7a',
        },
      },
      keyframes: {
        'vc-shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' },
        },
        'vc-flip': {
          '0%': { transform: 'rotateX(0)' },
          '50%': { transform: 'rotateX(-90deg)' },
          '100%': { transform: 'rotateX(0)' },
        },
        'vc-burst': {
          '0%': { transform: 'translate(0, 0) scale(0)', opacity: '1' },
          '100%': { transform: 'translate(var(--vc-dx), var(--vc-dy)) scale(1)', opacity: '0' },
        },
      },
      animation: {
        'vc-shake': 'vc-shake 0.4s ease-in-out',
        'vc-flip': 'vc-flip 0.5s ease-in-out',
        'vc-burst': 'vc-burst 900ms ease-out forwards',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      },
    },
  },
  plugins: [],
};

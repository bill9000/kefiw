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

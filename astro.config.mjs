import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://kefiw.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    tailwind({ applyBaseStyles: true }),
    react(),
  ],
  // Hide the floating Astro dev toolbar (the bottom-left "a" widget shown in `astro dev`).
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: 'auto',
    format: 'directory',
  },
  vite: {
    worker: {
      format: 'es',
    },
    server: {
      // Hostnames the Astro dev server accepts. Vite rejects everything else
      // with "Blocked request". Add tunnel/staging hosts here.
      allowedHosts: ['kefiw.aivibe.us'],
    },
  },
});

import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://nikola-lelekovic.netlify.app',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  i18n: {
    locales: ['en', 'sr'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: false, // EN at root, SR under /sr/
    },
  },
});

import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import sitemap from "@astrojs/sitemap";

export default defineConfig({
  // 1. AÑADE ESTA LÍNEA CON TU DOMINIO REAL (O EL PROVISIONAL)
  site: 'https://tuprimerhogar.es',

  integrations: [tailwind(), sitemap()]
});
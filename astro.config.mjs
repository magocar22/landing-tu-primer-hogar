import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

export default defineConfig({
  site: 'https://tph-frontend.vercel.app',
  output: 'server',

  integrations: [tailwind(), sitemap(), react()],

  image: {
    domains: ["localhost", "127.0.0.1"], 
  },

  // Usamos el adaptador de Vercel para desplegar en Vercel el prototipo
  adapter: vercel(),
});
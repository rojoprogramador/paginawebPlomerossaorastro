// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';

// https://astro.build/config
// En Astro 5, output:'static' es el default.
// Los endpoints con prerender=false se sirven en dev mediante el servidor Vite
// y en producción se necesita un adaptador (node, vercel, etc.)
export default defineConfig({
  site: 'https://www.plomerossaor.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),

  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  // Redirects 301 para preservar URLs del sitio anterior
  redirects: {
    // Antiguas URLs de servicio
    '/service':                                                          '/servicio-geofono-cali',
    '/contacts':                                                         '/contacto',
    '/blog':                                                             '/blog-plomeros-en-cali',

    // Destape — variantes del sitio anterior
    '/destapa-canerias':                                                 '/destape-de-canerias-cali',
    '/destape-de-canerias-sin-romper':                                   '/destape-de-canerias-cali',
    '/destapamos-canerias-sin-romper':                                   '/destape-de-canerias-cali',
    '/plomeros-destape-de-canerias-cali':                                '/destape-de-canerias-cali',

    // Páginas de servicios / landing del sitio anterior
    '/plomeros-cali-servicios-de-plomeria':                              '/plomeros-en-cali',
    '/plomeros-en-cali-expertos-en-soluciones-de-plomeria-a-tu-alcance': '/plomeros-en-cali',

    // Blog post con URL antigua de detección de fugas
    '/deteccion-de-fugas-de-agua-como-detectar-una-fuga-de-agua-en-casa':
      '/deteccion-de-fugas-de-agua-como-saber-si-en-mi-casa-tengo-una-fuga-de-agua',
  }
});
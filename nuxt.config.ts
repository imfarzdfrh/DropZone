// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  devtools: {
    enabled: true,
  },

  modules: ['@nuxt/eslint'],

  css: ['~/assets/css/main.css', '~/assets/css/store.css'],

  vite: {
    plugins: [tailwindcss()],
  },
});

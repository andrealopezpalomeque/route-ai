// https://nuxt.com/docs/api/configuration/nuxt-config
import Icons from 'unplugin-icons/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      geminiApiKey: '',
    },
  },

  pwa: {
    manifest: {
      name: 'RouteAI',
      short_name: 'RouteAI',
      description: 'Plan routes with natural language',
      theme_color: '#0a0a0f',
      background_color: '#0a0a0f',
      display: 'standalone',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: {
      navigateFallback: '/',
    },
  },

  vite: {
    plugins: [
      Icons({ autoInstall: false }),
    ],
  },
})

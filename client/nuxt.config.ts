// https://nuxt.com/docs/api/configuration/nuxt-config
import Icons from 'unplugin-icons/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'en', file: 'en.json', name: 'EN' },
      { code: 'es', file: 'es.json', name: 'ES' },
    ],
    defaultLocale: 'en',
    langDir: '../i18n/locales',
    strategy: 'no_prefix',
  },

  components: [
    { path: '~/components', pathPrefix: false },
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        {
          rel: 'apple-touch-icon',
          href: '/icon-192.png',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap',
        },
      ],
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: '',
    },
  },

  pwa: {
    manifest: {
      name: 'Route AI',
      short_name: 'Route AI',
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
      globPatterns: ['**/*.{html,js,css,json,webmanifest}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          },
        },
      ],
    },
  },

  vite: {
    plugins: [
      Icons({ autoInstall: false }),
    ],
  },
})

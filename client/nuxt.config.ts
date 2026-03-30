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
      title: 'Route AI — Plan routes with natural language',
      meta: [
        { name: 'description', content: 'Say where you need to go in plain words. AI extracts your stops, optimizes the order, and opens Google Maps with everything pre-filled.' },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://routeai.tech' },
        { property: 'og:title', content: 'Route AI — Say where. Go there.' },
        { property: 'og:description', content: 'Plan multi-stop routes with natural language. AI extracts your stops — Google Maps does the rest.' },
        { property: 'og:image', content: 'https://routeai.tech/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Route AI — Say where. Go there.' },
        { name: 'twitter:description', content: 'Plan multi-stop routes with natural language. AI extracts your stops — Google Maps does the rest.' },
        { name: 'twitter:image', content: 'https://routeai.tech/og-image.png' },
      ],
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

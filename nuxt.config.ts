import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-19',
  
  future: {
    compatibilityVersion: 4,
  },

  // Disable devtools in production
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  googleFonts: {
    families: {
      'JetBrains Mono': [400, 500, 600, 700],
    },
    display: 'swap',
  },

  // Runtime config - server-side only
  // Local dev: reads GEMINI_API_KEY from .env at startup
  // Production: docker-compose maps GEMINI_API_KEY → NUXT_GEMINI_API_KEY
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },

  app: {
    head: {
      title: 'Hangman - ASCII',
      meta: [
        { name: 'description', content: 'A grim ASCII hangman game with AI-powered hints' },
        // Theme color for all platforms
        { name: 'theme-color', content: '#000000' },
        { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#000000' },
        { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#000000' },
        // iOS Safari
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        // Microsoft
        { name: 'msapplication-TileColor', content: '#000000' },
        { name: 'msapplication-navbutton-color', content: '#000000' },
        // Viewport
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        // Color scheme
        { name: 'color-scheme', content: 'dark' },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  // Nitro server configuration
  nitro: {
    compressPublicAssets: true,
  },
})

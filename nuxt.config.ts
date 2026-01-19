import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-19',
  
  future: {
    compatibilityVersion: 4,
  },

  devtools: { enabled: true },

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

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
  },

  app: {
    head: {
      title: 'Hangman - ASCII Horror',
      meta: [
        { name: 'description', content: 'A grim ASCII hangman game' },
        { name: 'theme-color', content: '#0d0d0d' },
      ],
    },
  },
})

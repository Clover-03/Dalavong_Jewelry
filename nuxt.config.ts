// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  devServer: {
    port: 3333,
    host: 'localhost'
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    'vuetify-nuxt-module'
  ],
  css: [
    '@/assets/styles/main.css'
  ],
  vite: {
    server: {
      hmr: {
        port: 3333,
        host: 'localhost'
      }
    }
  },
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:4444',
        changeOrigin: true
      }
    },
    devErrorHandler: true
  }
})
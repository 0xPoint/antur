import { routeOffers } from './data/routes'

const appBaseUrl = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/$/, '')
const withAppBase = (path: string) => `${appBaseUrl}${path}`

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  experimental: {
    appManifest: false
  },
  modules: ['@nuxtjs/sitemap'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://antur-kamchatka.ru'
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#061827' },
        { property: 'og:locale', content: 'ru_RU' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://wa.me' },
        { rel: 'icon', type: 'image/x-icon', href: withAppBase('/favicon.ico') },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: withAppBase('/favicon-32x32.png') },
        { rel: 'apple-touch-icon', sizes: '180x180', href: withAppBase('/apple-touch-icon.png') }
      ]
    }
  },
  runtimeConfig: {
    paymentProviderSecret: '',
    resendApiKey: '',
    resendFromEmail: 'Antur <onboarding@resend.dev>',
    leadRecipientEmail: 'uhaubuhau894@gmail.com',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://antur-kamchatka.ru',
      businessPhone: '+79140253972',
      whatsappNumber: '79140253972'
    }
  },
  routeRules: {
    '/': { ssr: true },
    '/routes/**': { ssr: true },
    '/api/**': { cors: true }
  },
  nitro: {
    prerender: {
      routes: ['/', '/gallery', '/robots.txt', ...routeOffers.map((offer) => `/routes/${offer.slug}`)]
    }
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    excludeAppSources: true
  }
})

import { routeOffers } from './data/routes'
import { infoPages } from './data/info-pages'
import { seoLandingPages } from './data/seo-pages'

const appBaseUrl = (process.env.NUXT_APP_BASE_URL || '/').replace(/\/$/, '')
const withAppBase = (path: string) => `${appBaseUrl}${path}`

// Яндекс.Метрика. ID берётся из env, дефолт — боевой счётчик Антур.
const yandexMetrikaId = process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID || '110113081'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  experimental: {
    appManifest: false
  },
  modules: ['@nuxtjs/sitemap'],
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://anturkamchatka.ru'
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'ru' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'theme-color', content: '#061827' },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: withAppBase('/favicon.ico') },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: withAppBase('/favicon-32x32.png') },
        { rel: 'apple-touch-icon', sizes: '180x180', href: withAppBase('/apple-touch-icon.png') },
        { rel: 'alternate', type: 'text/plain', title: 'LLMs.txt', href: withAppBase('/llms.txt') }
      ],
      // Фолбэк Метрики для клиентов без JS (SSR-рендерится на всех страницах).
      noscript: yandexMetrikaId
        ? [{ innerHTML: `<div><img src="https://mc.yandex.ru/watch/${yandexMetrikaId}" style="position:absolute; left:-9999px;" alt="" /></div>` }]
        : []
    }
  },
  runtimeConfig: {
    paymentProviderSecret: '',
    resendApiKey: '',
    resendFromEmail: 'Antur <onboarding@resend.dev>',
    leadRecipientEmail: 'uhaubuhau894@gmail.com',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://anturkamchatka.ru',
      businessPhone: '+79140253972',
      whatsappNumber: '79140253972',
      yandexMetrikaId
    }
  },
  routeRules: {
    '/': { ssr: true },
    '/routes/**': { ssr: true },
    '/en/**': { ssr: true },
    '/zh/**': { ssr: true },
    '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/videos/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/api/**': { cors: true }
  },
  nitro: {
    prerender: {
      routes: [
        '/',
        '/en',
        '/zh',
        '/gallery',
        '/en/gallery',
        '/zh/gallery',
        '/privacy',
        '/en/privacy',
        '/zh/privacy',
        '/robots.txt',
        '/image-sitemap.xml',
        ...infoPages.map((page) => `/${page.slug}`),
        ...seoLandingPages.map((page) => `/${page.slug}`),
        ...routeOffers.flatMap((offer) => [
          `/routes/${offer.slug}`,
          `/en/routes/${offer.slug}`,
          `/zh/routes/${offer.slug}`
        ])
      ]
    }
  },
  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    excludeAppSources: true
  }
})

import { business, faq } from '~/data/site'
import {
  faqByLocale,
} from '~/data/i18n'
import {
  defaultLocale,
  getLocaleFromPath,
  locales,
  localizedBusiness,
  localizePath,
  stripLocaleFromPath,
  type LocaleCode
} from '~/data/i18n-base'

interface FaqSchemaItem {
  question: string
  answer: string
}

export const buildFaqSchema = (items: FaqSchemaItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
})

interface SeoInput {
  title: string
  description: string
  path?: string
  image?: string
  imageWidth?: number
  imageHeight?: number
  localized?: boolean
  preservePath?: boolean
  localizedPaths?: Partial<Record<LocaleCode, string>>
}

export function useAnturSeo(input: SeoInput) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const assetPath = useAssetPath()
  const route = useRoute()
  const locale = getLocaleFromPath(route.path)
  const path = input.path || '/'
  const hasExplicitLocalizedPaths = Boolean(input.localizedPaths)
  const hasLocalizedAlternates = hasExplicitLocalizedPaths || input.localized !== false
  const canonicalPath = input.preservePath
    ? path
    : input.localizedPaths
      ? input.localizedPaths[locale] || input.localizedPaths[defaultLocale] || path
      : hasLocalizedAlternates
        ? localizePath(path, locale)
        : stripLocaleFromPath(path)
  const url = new URL(assetPath(canonicalPath), siteUrl).toString()
  const image = new URL(assetPath(input.image || '/images/hero-kamchatka-boat.jpg'), siteUrl).toString()
  const localeMeta = locales.find((item) => item.code === locale) || locales[0]
  const businessText = localizedBusiness[locale]
  const alternateLinks = input.localizedPaths
    ? locales.flatMap((item) => {
        const localizedPath = input.localizedPaths?.[item.code]

        return localizedPath
          ? [{
              rel: 'alternate',
              hreflang: item.hreflang,
              href: new URL(assetPath(localizedPath), siteUrl).toString()
            }]
          : []
      })
    : hasLocalizedAlternates
      ? locales.map((item) => ({
        rel: 'alternate',
        hreflang: item.hreflang,
        href: new URL(assetPath(localizePath(path, item.code)), siteUrl).toString()
      }))
      : []

  useSeoMeta({
    title: input.title,
    description: input.description,
    robots: 'index, follow, max-image-preview:large',
    ogTitle: input.title,
    ogDescription: input.description,
    ogUrl: url,
    ogLocale: localeMeta.ogLocale,
    ogImage: image,
    ogImageWidth: input.imageWidth || (!input.image ? 2200 : undefined),
    ogImageHeight: input.imageHeight || (!input.image ? 1238 : undefined),
    ogSiteName: businessText.brand,
    twitterCard: 'summary_large_image',
    twitterTitle: input.title,
    twitterDescription: input.description,
    twitterImage: image
  })

  useHead({
    htmlAttrs: { lang: locale },
    link: [
      { rel: 'canonical', href: url },
      ...alternateLinks,
      ...(hasLocalizedAlternates
        ? [{
            rel: 'alternate',
            hreflang: 'x-default',
            href: new URL(assetPath(input.localizedPaths?.[defaultLocale] || localizePath(path, defaultLocale)), siteUrl).toString()
          }]
        : [])
    ]
  })

  return { siteUrl, url, image }
}

export function useBusinessSchema() {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const assetPath = useAssetPath()
  const route = useRoute()
  const locale = getLocaleFromPath(route.path)
  const businessText = localizedBusiness[locale]
  const businessUrl = new URL(assetPath(localizePath('/', locale)), siteUrl).toString()
  const logoUrl = new URL(assetPath('/images/antur-logo-mark.png'), siteUrl).toString()
  const imageUrl = new URL(assetPath('/images/hero-kamchatka-boat.jpg'), siteUrl).toString()

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': ['Organization', 'LocalBusiness', 'TravelAgency'],
          '@id': `${businessUrl}#organization`,
          name: businessText.brand,
          legalName: businessText.legalName,
          telephone: business.phone,
          url: businessUrl,
          logo: logoUrl,
          image: imageUrl,
          priceRange: '5 000 ₽ - 170 000 ₽',
          areaServed: locale === 'ru'
            ? ['Камчатка', 'Петропавловск-Камчатский', 'Авачинская бухта']
            : locale === 'zh'
              ? ['堪察加', '彼得罗巴甫洛夫斯克-堪察加', '阿瓦恰湾']
              : ['Kamchatka', 'Petropavlovsk-Kamchatsky', 'Avacha Bay'],
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 52.963069,
            longitude: 158.700983
          },
          hasMap: business.yandexHref,
          sameAs: [
            business.yandexHref,
            business.twoGisHref,
            business.maxHref,
            business.maxChannelHref
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: business.phone,
            contactType: locale === 'ru' ? 'Бронирование морских прогулок' : 'Booking',
            availableLanguage: ['ru', 'en', 'zh']
          },
          address: {
            '@type': 'PostalAddress',
            streetAddress: business.streetAddress,
            addressLocality: businessText.region,
            addressRegion: locale === 'ru' ? 'Камчатский край' : locale === 'zh' ? '堪察加边疆区' : 'Kamchatka Krai',
            addressCountry: 'RU'
          }
        })
      }
    ]
  })
}

export function useFaqSchema() {
  const route = useRoute()
  const locale = getLocaleFromPath(route.path)
  const localizedFaq = faqByLocale[locale] || faq

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify(buildFaqSchema(localizedFaq))
      }
    ]
  })
}

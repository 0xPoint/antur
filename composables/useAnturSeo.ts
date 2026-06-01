import { business, faq } from '~/data/site'

interface SeoInput {
  title: string
  description: string
  path?: string
  image?: string
}

export function useAnturSeo(input: SeoInput) {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const assetPath = useAssetPath()
  const path = input.path || '/'
  const url = new URL(assetPath(path), siteUrl).toString()
  const image = new URL(assetPath(input.image || '/images/og-image.jpg'), siteUrl).toString()

  useSeoMeta({
    title: input.title,
    description: input.description,
    ogTitle: input.title,
    ogDescription: input.description,
    ogUrl: url,
    ogImage: image,
    twitterCard: 'summary_large_image'
  })

  useHead({
    link: [{ rel: 'canonical', href: url }]
  })

  return { siteUrl, url, image }
}

export function useBusinessSchema() {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string
  const assetPath = useAssetPath()

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'TravelAgency',
          name: business.brand,
          legalName: business.legalName,
          telephone: '+79140253972',
          url: new URL(assetPath('/'), siteUrl).toString(),
          areaServed: ['Камчатка', 'Петропавловск-Камчатский', 'Авачинская бухта'],
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Петропавловск-Камчатский',
            addressRegion: 'Камчатский край',
            addressCountry: 'RU'
          }
        })
      }
    ]
  })
}

export function useFaqSchema() {
  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        })
      }
    ]
  })
}

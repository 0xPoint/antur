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
  const path = input.path || '/'
  const url = new URL(path, siteUrl).toString()
  const image = new URL(input.image || '/images/og-image.jpg', siteUrl).toString()

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
          url: siteUrl,
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

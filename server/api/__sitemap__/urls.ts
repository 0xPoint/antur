import { routeOffers } from '~/data/routes'

const today = new Date().toISOString().slice(0, 10)
const localePrefixes = ['', '/en', '/zh']
const weekly = 'weekly' as const

const localizedPath = (prefix: string, path: string) => {
  if (!prefix) {
    return path
  }

  return path === '/' ? prefix : `${prefix}${path}`
}

export default defineSitemapEventHandler(() => [
  ...localePrefixes.flatMap((prefix) => [
    {
      loc: localizedPath(prefix, '/'),
      _sitemap: 'pages',
      lastmod: today,
      changefreq: weekly,
      priority: prefix ? 0.9 as const : 1 as const
    },
    {
      loc: localizedPath(prefix, '/gallery'),
      _sitemap: 'pages',
      lastmod: today,
      changefreq: weekly,
      priority: 0.7 as const
    }
  ]),
  ...localePrefixes.flatMap((prefix) =>
    routeOffers.map((offer) => ({
      loc: localizedPath(prefix, `/routes/${offer.slug}`),
      _sitemap: 'routes',
      lastmod: today,
      changefreq: weekly,
      priority: offer.featured ? 0.9 as const : 0.8 as const
    }))
  )
])

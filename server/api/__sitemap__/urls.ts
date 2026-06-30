import { routeOffers } from '~/data/routes'
import { seoLandingPages } from '~/data/seo-pages'
import { tourPhotos } from '~/data/social-proof'

const localePrefixes = ['', '/en', '/zh']
const weekly = 'weekly' as const
const homeLastmod = '2026-06-29'
const privacyLastmod = '2026-06-01'
const latestPhotoDate = tourPhotos.reduce((latest, item) => item.date > latest ? item.date : latest, '2026-06-01')

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
      lastmod: homeLastmod,
      changefreq: weekly,
      priority: prefix ? 0.9 as const : 1 as const
    },
    {
      loc: localizedPath(prefix, '/gallery'),
      _sitemap: 'pages',
      lastmod: latestPhotoDate,
      changefreq: weekly,
      priority: 0.7 as const
    },
    {
      loc: localizedPath(prefix, '/privacy'),
      _sitemap: 'pages',
      lastmod: privacyLastmod,
      changefreq: 'yearly' as const,
      priority: 0.2 as const
    }
  ]),
  ...localePrefixes.flatMap((prefix) =>
    routeOffers.map((offer) => ({
      loc: localizedPath(prefix, `/routes/${offer.slug}`),
      _sitemap: 'routes',
      lastmod: offer.updatedAt || homeLastmod,
      changefreq: weekly,
      priority: offer.featured ? 0.9 as const : 0.8 as const
    }))
  ),
  ...seoLandingPages.map((page) => ({
    loc: `/${page.slug}`,
    _sitemap: 'pages',
    lastmod: page.updatedAt,
    changefreq: weekly,
    priority: 0.7 as const
  }))
])

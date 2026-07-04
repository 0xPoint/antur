import { getLocalizedRoutePath, routeOffers, type RouteLocaleCode } from '~/data/routes'
import { guideHubPage } from '~/data/guide-hub'
import { infoPages } from '~/data/info-pages'
import { seoLandingPages } from '~/data/seo-pages'
import { guidePages } from '~/data/guide-pages'
import { tourPhotos } from '~/data/social-proof'

const localePrefixes = ['', '/en', '/zh']
const weekly = 'weekly' as const
const homeLastmod = '2026-06-29'
const privacyLastmod = '2026-06-01'
const latestPhotoDate = tourPhotos.reduce((latest, item) => item.date > latest ? item.date : latest, '2026-06-01')
const routeLocales: RouteLocaleCode[] = ['ru', 'en', 'zh']

const localizedPath = (prefix: string, path: string) => {
  const normalizedPath = path === '/' ? '/' : `${path.replace(/\/+$/, '')}/`

  if (!prefix) {
    return normalizedPath
  }

  return normalizedPath === '/' ? `${prefix}/` : `${prefix}${normalizedPath}`
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
  ...routeOffers.flatMap((offer) => routeLocales.map((locale) => ({
    loc: getLocalizedRoutePath(offer.slug, locale),
    _sitemap: 'routes',
    lastmod: offer.updatedAt || homeLastmod,
    changefreq: weekly,
    priority: locale === 'ru'
      ? (offer.featured ? 0.9 as const : 0.8 as const)
      : 0.7 as const
  }))),
  {
    loc: guideHubPage.path,
    _sitemap: 'pages',
    lastmod: guideHubPage.updatedAt,
    changefreq: 'monthly' as const,
    priority: 0.6 as const
  },
  ...seoLandingPages.map((page) => ({
    loc: page.path,
    _sitemap: 'pages',
    lastmod: page.updatedAt,
    changefreq: weekly,
    priority: 0.7 as const
  })),
  ...infoPages.map((page) => ({
    loc: `/${page.slug}/`,
    _sitemap: 'pages',
    lastmod: page.updatedAt,
    changefreq: 'monthly' as const,
    priority: 0.6 as const
  })),
  ...guidePages.map((page) => ({
    loc: page.path,
    _sitemap: 'pages',
    lastmod: page.updatedAt,
    changefreq: 'monthly' as const,
    priority: 0.5 as const
  }))
])

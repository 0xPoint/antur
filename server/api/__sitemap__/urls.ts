import { getLocalizedRoutePath, routeOffers, type RouteLocaleCode } from '~/data/routes'
import { routeOffersByLocale } from '~/data/i18n'
import { guideHubPage } from '~/data/guide-hub'
import { infoPages } from '~/data/info-pages'
import { seoLandingPages } from '~/data/seo-pages'
import { guidePages } from '~/data/guide-pages'
import { boatCharterPage } from '~/data/boat-charter'
import { videoWatchPages } from '~/data/video-pages'
import { tourPhotos } from '~/data/social-proof'
import {
  getGalleryLastmod,
  getGuideHubLastmod,
  getGuideLastmod,
  getHomeLastmod,
  getRouteLastmod,
  getSeoLandingLastmod
} from '~/server/utils/content-lastmod'

const localePrefixes = ['', '/en', '/zh']
const weekly = 'weekly' as const
const homeLastmod = getHomeLastmod()
const privacyLastmod = '2026-06-01'
const latestPhotoDate = getGalleryLastmod()
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
  ...routeOffers.flatMap((offer) => routeLocales.map((locale) => {
    const localizedOffer = routeOffersByLocale[locale].find((item) => item.slug === offer.slug) || offer

    return {
      loc: getLocalizedRoutePath(offer.slug, locale),
      _sitemap: 'routes',
      lastmod: getRouteLastmod(localizedOffer),
      changefreq: weekly,
      priority: locale === 'ru'
        ? (offer.featured ? 0.9 as const : 0.8 as const)
        : 0.7 as const
    }
  })),
  {
    loc: boatCharterPage.path,
    _sitemap: 'pages',
    lastmod: boatCharterPage.updatedAt,
    changefreq: weekly,
    priority: 0.8 as const
  },
  ...videoWatchPages.map((page) => ({
    loc: page.path,
    _sitemap: 'pages',
    lastmod: tourPhotos.find((item) => item.id === page.mediaId)?.date || homeLastmod,
    changefreq: 'yearly' as const,
    priority: 0.6 as const
  })),
  {
    loc: guideHubPage.path,
    _sitemap: 'pages',
    lastmod: getGuideHubLastmod(),
    changefreq: 'monthly' as const,
    priority: 0.6 as const
  },
  ...seoLandingPages.map((page) => ({
    loc: page.path,
    _sitemap: 'pages',
    lastmod: getSeoLandingLastmod(page),
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
    lastmod: getGuideLastmod(page),
    changefreq: 'monthly' as const,
    priority: 0.5 as const
  }))
])

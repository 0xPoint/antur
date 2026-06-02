import { routeOffers } from '~/data/routes'

const today = new Date().toISOString().slice(0, 10)

export default defineSitemapEventHandler(() => [
  {
    loc: '/',
    _sitemap: 'pages',
    lastmod: today,
    changefreq: 'weekly',
    priority: 1
  },
  {
    loc: '/gallery',
    _sitemap: 'pages',
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.72
  },
  ...routeOffers.map((offer) => ({
    loc: `/routes/${offer.slug}`,
    _sitemap: 'routes',
    lastmod: today,
    changefreq: 'weekly',
    priority: offer.featured ? 0.92 : 0.86
  }))
])

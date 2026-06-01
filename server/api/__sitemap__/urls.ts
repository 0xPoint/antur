import { routeOffers } from '~/data/routes'

export default defineSitemapEventHandler(() => [
  { loc: '/', _sitemap: 'pages' },
  { loc: '/gallery', _sitemap: 'pages' },
  ...routeOffers.map((offer) => ({
    loc: `/routes/${offer.slug}`,
    _sitemap: 'routes'
  }))
])

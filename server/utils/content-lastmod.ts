import { editorialProfile } from '../../data/editorial'
import { guidePages, type GuidePage } from '../../data/guide-pages'
import type { SeoLandingPage } from '../../data/seo-pages'
import { routeOffers } from '../../data/routes'
import { reviews, tourPhotos } from '../../data/social-proof'
import type { RouteOffer, TourPhoto } from '../../types/content'
import { latestIsoDate } from '../../utils/iso-date'

const fallbackDate = '2026-06-01'

const routeSlugByMediaRoute: Record<string, string> = {
  'Авачинская бухта': 'avachinskaya-buhta',
  'Бухта Русская': 'buhta-russkaya',
  'Глубоководная рыбалка': 'glubokovodnaya-rybalka',
  'Морская рыбалка': 'rybalka',
  'Остров Старичков': 'ostrov-starichkov',
  'Прибрежная рыбалка': 'rybalka'
}

const mediaRouteSlug = (item: TourPhoto) => item.routeSlug || routeSlugByMediaRoute[item.route]

export const getGalleryLastmod = () => latestIsoDate(
  fallbackDate,
  ...tourPhotos.map((item) => item.date)
)

export const getRouteLastmod = (offer: RouteOffer) => latestIsoDate(
  fallbackDate,
  offer.updatedAt,
  ...reviews.filter((review) => review.routeSlug === offer.slug).map((review) => review.date),
  ...tourPhotos.filter((item) => mediaRouteSlug(item) === offer.slug).map((item) => item.date)
)

export const getSeoLandingLastmod = (page: SeoLandingPage) => latestIsoDate(
  page.updatedAt,
  ...routeOffers.filter((offer) => page.routeSlugs.includes(offer.slug)).map(getRouteLastmod),
  ...(page.photoIds || []).flatMap((id) => {
    const media = tourPhotos.find((item) => item.id === id)
    return media ? [media.date] : []
  })
)

export const getGuideLastmod = (page: GuidePage) => latestIsoDate(
  page.updatedAt,
  editorialProfile.updatedAt
)

export const getGuideHubLastmod = () => latestIsoDate(
  editorialProfile.updatedAt,
  ...guidePages.map(getGuideLastmod)
)

export const getHomeLastmod = () => latestIsoDate(
  fallbackDate,
  ...routeOffers.map(getRouteLastmod),
  ...reviews.map((review) => review.date),
  ...tourPhotos.map((item) => item.date)
)

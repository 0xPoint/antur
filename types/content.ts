export interface PriceOption {
  season: string
  format: string
  price: string
}

export interface RouteTimelineItem {
  title: string
  text: string
}

export interface RouteGalleryItem {
  src: string
  alt: string
  caption: string
}

export interface RouteFaqItem {
  question: string
  answer: string
}

export interface RouteOffer {
  slug: string
  path: string
  pathSlug?: string
  categoryTitle?: string
  categoryPath?: string
  relatedSlugs?: string[]
  title: string
  kicker: string
  duration: string
  price?: string
  updatedAt?: string
  seoTitle?: string
  seoDescription?: string
  description: string
  highlights: string[]
  priceOptions?: PriceOption[]
  audience?: string[]
  timeline?: RouteTimelineItem[]
  included?: string[]
  notIncluded?: string[]
  bring?: string[]
  weather?: string
  children?: string
  meetingPoint?: string
  routeFaq?: RouteFaqItem[]
  gallery?: RouteGalleryItem[]
  reviewIds?: string[]
  notes?: string[]
  image: string
  imageAlt: string
  pageImage?: string
  pageImageAlt?: string
  imageCredit?: {
    label: string
    url: string
  }
  featured?: boolean
}

export interface Review {
  id: string
  name: string
  route: string
  source?: string
  sourceUrl?: string
  routeSlug?: string
  date: string
  rating: number
  text: string
}

export interface TourPhoto {
  id: string
  src: string
  kind?: 'photo' | 'video'
  videoSrc?: string
  alt: string
  route: string
  routeSlug?: string
  caption?: string
  date: string
}

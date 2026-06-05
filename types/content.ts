export interface PriceOption {
  season: string
  format: string
  price: string
}

export interface RouteOffer {
  slug: string
  title: string
  kicker: string
  duration: string
  price?: string
  description: string
  highlights: string[]
  priceOptions?: PriceOption[]
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
  date: string
}

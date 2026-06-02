import {
  bookingTermsByLocale,
  defaultLocale,
  faqByLocale,
  getLocaleFromPath,
  localizedBusiness,
  locales,
  localizePath,
  reviewsByLocale,
  routeOffersByLocale,
  tourPhotosByLocale,
  ui,
  type LocaleCode
} from '~/data/i18n'

export const useLocaleContent = () => {
  const route = useRoute()
  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path))

  const localePath = (path: string, targetLocale = locale.value) => localizePath(path, targetLocale)

  return {
    locale,
    locales,
    localePath,
    text: computed(() => ui[locale.value]),
    businessText: computed(() => localizedBusiness[locale.value]),
    routeOffers: computed(() => routeOffersByLocale[locale.value]),
    faqItems: computed(() => faqByLocale[locale.value]),
    bookingTerms: computed(() => bookingTermsByLocale[locale.value]),
    reviews: computed(() => reviewsByLocale[locale.value]),
    tourPhotos: computed(() => tourPhotosByLocale[locale.value])
  }
}

export const useCurrentLocale = () => {
  const route = useRoute()
  return computed<LocaleCode>(() => getLocaleFromPath(route.path) || defaultLocale)
}

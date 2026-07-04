import {
  bookingTermsByLocale,
  faqByLocale,
  routeOffersByLocale
} from '~/data/i18n'
import { defaultLocale, getLocaleFromPath, type LocaleCode } from '~/data/i18n-base'

export const useRouteContent = () => {
  const route = useRoute()
  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path) || defaultLocale)

  return {
    routeOffers: computed(() => routeOffersByLocale[locale.value]),
    faqItems: computed(() => faqByLocale[locale.value]),
    bookingTerms: computed(() => bookingTermsByLocale[locale.value])
  }
}

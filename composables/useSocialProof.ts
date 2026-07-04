import {
  reviewsByLocale,
  tourPhotosByLocale
} from '~/data/i18n'
import { defaultLocale, getLocaleFromPath, type LocaleCode } from '~/data/i18n-base'

export const useSocialProof = () => {
  const route = useRoute()
  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path) || defaultLocale)

  return {
    reviews: computed(() => reviewsByLocale[locale.value]),
    tourPhotos: computed(() => tourPhotosByLocale[locale.value])
  }
}

import {
  defaultLocale,
  getLocaleFromPath,
  localizedBusiness,
  locales,
  localizePath,
  ui,
  type LocaleCode
} from '~/data/i18n-base'

export const useLocaleContent = () => {
  const route = useRoute()
  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path))

  const localePath = (path: string, targetLocale = locale.value) => localizePath(path, targetLocale)

  return {
    locale,
    locales,
    localePath,
    text: computed(() => ui[locale.value]),
    businessText: computed(() => localizedBusiness[locale.value])
  }
}

export const useCurrentLocale = () => {
  const route = useRoute()
  return computed<LocaleCode>(() => getLocaleFromPath(route.path) || defaultLocale)
}

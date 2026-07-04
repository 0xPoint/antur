import { privacyByLocale } from '~/data/privacy'
import { defaultLocale, getLocaleFromPath, type LocaleCode } from '~/data/i18n-base'

export const usePrivacyContent = () => {
  const route = useRoute()
  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path) || defaultLocale)

  return {
    privacy: computed(() => privacyByLocale[locale.value])
  }
}

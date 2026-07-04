import { privacyLinkLabels } from '~/data/privacy-meta'
import { defaultLocale, getLocaleFromPath, type LocaleCode } from '~/data/i18n-base'

export const usePrivacyLink = () => {
  const route = useRoute()
  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path) || defaultLocale)

  return computed(() => privacyLinkLabels[locale.value])
}

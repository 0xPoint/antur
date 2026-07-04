import { routeLinksByLocale } from '~/data/route-links'
import { defaultLocale, getLocaleFromPath, type LocaleCode } from '~/data/i18n-base'

export const useRouteLinks = () => {
  const route = useRoute()
  const locale = computed<LocaleCode>(() => getLocaleFromPath(route.path) || defaultLocale)
  const routeLinks = computed(() => routeLinksByLocale[locale.value])

  const routePathBySlug = (slug: string) =>
    routeLinks.value.find((item) => item.slug === slug)?.path

  return {
    routeLinks,
    routePathBySlug
  }
}

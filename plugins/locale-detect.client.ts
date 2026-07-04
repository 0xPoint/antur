import {
  defaultLocale,
  getLocaleFromPath,
  isLocaleCode,
  localizePath,
  stripLocaleFromPath
} from '~/data/i18n-base'
import type { LocaleCode } from '~/data/i18n-base'
import { ruOnlyPagePaths } from '~/data/ru-only-pages'

const storageKey = 'antur:locale'
const explicitChoiceKey = 'antur:locale-explicit'
const detectionKey = 'antur:locale-detected'

const detectLocale = (): LocaleCode => {
  const stored = window.localStorage.getItem(storageKey)

  if (isLocaleCode(stored)) {
    return stored
  }

  const languages = window.navigator.languages?.length
    ? window.navigator.languages
    : [window.navigator.language]
  const normalizedLanguages = languages.filter(Boolean).map((language) => language.toLowerCase())

  if (normalizedLanguages.some((language) => language.startsWith('zh'))) {
    return 'zh'
  }

  if (normalizedLanguages.some((language) => language.startsWith('ru'))) {
    return 'ru'
  }

  if (normalizedLanguages.some((language) => language.startsWith('en'))) {
    return 'en'
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone.toLowerCase()

  if (timezone.includes('shanghai') || timezone.includes('hong_kong') || timezone.includes('taipei')) {
    return 'zh'
  }

  if (timezone.includes('moscow') || timezone.includes('kamchatka') || timezone.includes('vladivostok')) {
    return 'ru'
  }

  return defaultLocale
}

export default defineNuxtPlugin(() => {
  const route = useRoute()

  if (getLocaleFromPath(route.path) !== defaultLocale) {
    window.localStorage.setItem(storageKey, getLocaleFromPath(route.path))
    return
  }

  if (ruOnlyPagePaths.has(stripLocaleFromPath(route.path))) {
    window.localStorage.setItem(storageKey, defaultLocale)
    return
  }

  const storedLocale = window.localStorage.getItem(storageKey)
  const hasExplicitChoice = window.localStorage.getItem(explicitChoiceKey) === '1'

  if (hasExplicitChoice && isLocaleCode(storedLocale) && storedLocale !== defaultLocale) {
    const targetPath = localizePath(route.fullPath, storedLocale)

    if (targetPath !== route.fullPath) {
      void navigateTo(targetPath, { replace: true })
      return
    }
  }

  if (window.sessionStorage.getItem(detectionKey)) {
    return
  }

  window.sessionStorage.setItem(detectionKey, '1')

  if (!isLocaleCode(storedLocale)) {
    window.localStorage.setItem(storageKey, detectLocale())
  }
})

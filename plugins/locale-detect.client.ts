import {
  defaultLocale,
  getLocaleFromPath,
  isLocaleCode,
  localizePath,
  stripLocaleFromPath,
  type LocaleCode
} from '~/data/i18n'
import { ruOnlyPagePaths } from '~/data/ru-only-pages'

const storageKey = 'antur:locale'
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

  if (window.sessionStorage.getItem(detectionKey)) {
    return
  }

  window.sessionStorage.setItem(detectionKey, '1')
  const detectedLocale = detectLocale()
  window.localStorage.setItem(storageKey, detectedLocale)

  if (detectedLocale === defaultLocale) {
    return
  }

  const targetPath = localizePath(route.fullPath, detectedLocale)

  if (targetPath !== route.fullPath) {
    void navigateTo(targetPath, { replace: true })
  }
})

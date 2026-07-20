<template>
  <nav class="language-switcher" :aria-label="text.language.label">
    <a
      v-for="item in locales"
      :key="item.code"
      class="language-link"
      :class="{ active: item.code === locale }"
      :href="targetHref(item.code)"
      :hreflang="item.hreflang"
      :aria-current="item.code === locale ? 'true' : undefined"
      :aria-label="item.code === locale ? `${item.shortLabel}, ${text.language.current}: ${item.label}` : `${item.shortLabel}, ${text.language.switchTo} ${item.label}`"
      @click="rememberLocale(item.code)"
    >
      {{ item.shortLabel }}
    </a>
  </nav>
</template>

<script setup lang="ts">
import { findRouteLinkByPath, getLocalizedRoutePathBySlug } from '~/data/route-links'
import { localeOnlyPageLocaleByPath } from '~/data/ru-only-pages'
import { stripLocaleFromPath } from '~/data/i18n-base'
import type { LocaleCode } from '~/data/i18n-base'

const route = useRoute()
const { locale, locales, localePath, text } = useLocaleContent()
const pageOnlyLocale = computed(() => localeOnlyPageLocaleByPath.get(stripLocaleFromPath(route.path)))
const currentRouteOffer = computed(() => {
  const routeSlug = String(route.params.slug || '')
  const cleanPath = stripLocaleFromPath(route.path)

  return findRouteLinkByPath(cleanPath, routeSlug)
})

const targetHref = (targetLocale: LocaleCode) => {
  if (currentRouteOffer.value) {
    return getLocalizedRoutePathBySlug(currentRouteOffer.value.slug, targetLocale)
  }

  if (pageOnlyLocale.value && targetLocale !== pageOnlyLocale.value) {
    return localePath('/', targetLocale)
  }

  return localePath(route.fullPath, targetLocale)
}

const rememberLocale = (targetLocale: LocaleCode) => {
  if (!import.meta.client) {
    return
  }

  window.localStorage.setItem('antur:locale', targetLocale)
  window.localStorage.setItem('antur:locale-explicit', '1')
}
</script>

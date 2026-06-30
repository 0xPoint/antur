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
import { ruOnlyPagePaths } from '~/data/ru-only-pages'
import { stripLocaleFromPath } from '~/data/i18n'
import type { LocaleCode } from '~/data/i18n'

const route = useRoute()
const { locale, locales, localePath, text } = useLocaleContent()
const isRuOnlyLanding = computed(() => ruOnlyPagePaths.has(stripLocaleFromPath(route.path)))

const targetHref = (targetLocale: LocaleCode) => {
  if (isRuOnlyLanding.value && targetLocale !== 'ru') {
    return localePath('/', targetLocale)
  }

  return localePath(route.fullPath, targetLocale)
}

const rememberLocale = (targetLocale: LocaleCode) => {
  if (!import.meta.client) {
    return
  }

  window.localStorage.setItem('antur:locale', targetLocale)
}
</script>

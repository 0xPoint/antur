<template>
  <nav class="language-switcher" :aria-label="text.language.label">
    <NuxtLink
      v-for="item in locales"
      :key="item.code"
      class="language-link"
      :class="{ active: item.code === locale }"
      :to="localePath(route.fullPath, item.code)"
      :hreflang="item.hreflang"
      :aria-current="item.code === locale ? 'true' : undefined"
      :aria-label="item.code === locale ? `${text.language.current}: ${item.label}` : `${text.language.switchTo} ${item.label}`"
      @click="rememberLocale(item.code)"
    >
      {{ item.shortLabel }}
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import type { LocaleCode } from '~/data/i18n'

const route = useRoute()
const { locale, locales, localePath, text } = useLocaleContent()

const rememberLocale = (targetLocale: LocaleCode) => {
  if (!import.meta.client) {
    return
  }

  window.localStorage.setItem('antur:locale', targetLocale)
}
</script>

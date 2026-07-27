<script setup lang="ts">
import type { NuxtError } from '#app'
import { getLocaleFromPath, localizePath, type LocaleCode } from '~/data/i18n-base'

const props = defineProps<{
  error: NuxtError & { url?: string }
}>()

const locale = getLocaleFromPath(props.error.url || '/')
const homePath = localizePath('/', locale)
const statusCode = computed(() => props.error.statusCode || 500)
const isNotFound = computed(() => statusCode.value === 404)

const messages: Record<LocaleCode, {
  eyebrow: string
  notFoundTitle: string
  errorTitle: string
  notFoundText: string
  errorText: string
  home: string
}> = {
  ru: {
    eyebrow: 'Антур · Камчатка',
    notFoundTitle: 'Такой страницы нет',
    errorTitle: 'Что-то пошло не так',
    notFoundText: 'Возможно, адрес изменился. Вернитесь на главную — там собраны актуальные маршруты, цены и способы связи.',
    errorText: 'Не удалось загрузить страницу. Попробуйте вернуться на главную и открыть нужный раздел ещё раз.',
    home: 'На главную'
  },
  en: {
    eyebrow: 'Antur · Kamchatka',
    notFoundTitle: 'Page not found',
    errorTitle: 'Something went wrong',
    notFoundText: 'The address may have changed. Return home for current routes, prices and contact options.',
    errorText: 'We could not load this page. Return home and try opening the section again.',
    home: 'Go home'
  },
  zh: {
    eyebrow: 'Antur · 堪察加',
    notFoundTitle: '找不到该页面',
    errorTitle: '页面出现问题',
    notFoundText: '页面地址可能已更改。请返回首页查看最新路线、价格和联系方式。',
    errorText: '暂时无法加载此页面。请返回首页后重试。',
    home: '返回首页'
  }
}

const text = messages[locale]
const title = computed(() => isNotFound.value ? text.notFoundTitle : text.errorTitle)
const description = computed(() => isNotFound.value ? text.notFoundText : text.errorText)

useSeoMeta({
  title: () => `${statusCode.value} — ${title.value} | Antur`,
  description: () => description.value,
  robots: 'noindex, nofollow'
})

useHead({
  htmlAttrs: { lang: locale }
})

const handleError = () => clearError({ redirect: homePath })
</script>

<template>
  <main class="error-page">
    <section class="error-card" aria-labelledby="error-title">
      <a class="error-brand" :href="homePath" :aria-label="text.home">
        <img src="/images/antur-logo-mark.png" width="72" height="56" alt="">
        <span>ANTUR</span>
      </a>
      <p class="eyebrow">{{ text.eyebrow }}</p>
      <p class="error-code" aria-hidden="true">{{ statusCode }}</p>
      <h1 id="error-title">{{ title }}</h1>
      <p class="error-description">{{ description }}</p>
      <button class="btn btn-primary" type="button" @click="handleError">
        {{ text.home }}
      </button>
    </section>
  </main>
</template>

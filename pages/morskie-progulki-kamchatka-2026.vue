<template>
  <SeoLandingPage :page="page" />
</template>

<script setup lang="ts">
import { seoLandingPages } from '~/data/seo-pages'

const page = seoLandingPages.find((item) => item.slug === 'morskie-progulki-kamchatka-2026')!
</script>

<template>
  <SeoLandingPage :page="page" />
</template>

<script setup lang="ts">
import { seoLandingPages } from '~/data/seo-pages'

const page = seoLandingPages.find((item) => item.slug === 'krabovoe-safari-kamchatka')!
</script>

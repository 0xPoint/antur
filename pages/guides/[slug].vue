<template>
  <GuidePage :page="page" />
</template>

<script setup lang="ts">
import { guidePages } from '~/data/guide-pages'

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
const page = guidePages.find((item) => item.slug === slug)

if (!page) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Guide page not found'
  })
}
</script>

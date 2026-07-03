<template>
  <RouteDetailPage />
</template>

<script setup lang="ts">
definePageMeta({
  alias: [
    '/en/routes/:slug',
    '/zh/routes/:slug'
  ]
})
</script>

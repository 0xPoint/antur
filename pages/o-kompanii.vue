<template>
  <InfoPage :page="page" />
</template>

<script setup lang="ts">
import { infoPages } from '~/data/info-pages'

const page = infoPages.find((item) => item.slug === 'o-kompanii')!
</script>

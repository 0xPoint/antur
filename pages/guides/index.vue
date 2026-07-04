<template>
  <GuideHubPage :page="page" />
</template>

<script setup lang="ts">
import { guideHubPage } from '~/data/guide-hub'

const page = guideHubPage
</script>

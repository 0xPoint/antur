<template>
  <NuxtLink class="route-card" :class="{ 'route-card-featured': offer.featured, 'route-card-warm': offer.slug === 'avachinskaya-buhta' }" :to="`/routes/${offer.slug}`">
    <img class="route-card-image" :src="cardImage" width="1080" height="720" loading="lazy" :alt="cardImageAlt">
    <div class="route-copy">
      <p class="route-kicker">{{ offer.kicker }}</p>
      <h3>{{ offer.title }}</h3>
      <p>{{ offer.description }}</p>
      <span class="card-link">Подробнее</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RouteOffer } from '~/types/content'

const props = defineProps<{
  offer: RouteOffer
}>()

const cardImage = computed(() => props.offer.pageImage || props.offer.image)
const cardImageAlt = computed(() => props.offer.pageImageAlt || props.offer.imageAlt)
</script>

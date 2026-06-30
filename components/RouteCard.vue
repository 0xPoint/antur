<template>
  <NuxtLink class="route-card" :class="{ 'route-card-featured': offer.featured, 'route-card-warm': offer.slug === 'avachinskaya-buhta' }" :to="localePath(`/routes/${offer.slug}`)">
    <OptimizedImage
      class="route-card-image"
      :src="cardImage"
      width="1080"
      height="720"
      :sizes="cardSizes"
      :widths="cardWidths"
      loading="lazy"
      fetchpriority="low"
      :alt="cardImageAlt"
    />
    <div class="route-copy">
      <p class="route-kicker">{{ offer.kicker }}</p>
      <h3>{{ offer.title }}</h3>
      <p>{{ offer.description }}</p>
      <span class="card-link">{{ text.home.details }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { RouteOffer } from '~/types/content'

const props = defineProps<{
  offer: RouteOffer
}>()

const { localePath, text } = useLocaleContent()
const cardImage = computed(() => props.offer.pageImage || props.offer.image)
const cardImageAlt = computed(() => props.offer.pageImageAlt || props.offer.imageAlt)
const cardSizes = computed(() =>
  props.offer.slug === 'avachinskaya-buhta'
    ? '(max-width: 960px) 92vw, 1180px'
    : '(max-width: 680px) 92vw, (max-width: 1100px) 44vw, 31vw'
)
const cardWidths = computed(() =>
  props.offer.slug === 'avachinskaya-buhta'
    ? [480, 720, 960, 1280, 1600, 1920]
    : [480, 720, 960]
)
</script>

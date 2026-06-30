<template>
  <section class="location-map-section" aria-labelledby="location-map-title">
    <div class="container location-map-grid">
      <div class="location-map-copy">
        <p class="eyebrow">{{ businessText.mapEyebrow }}</p>
        <h2 id="location-map-title">{{ businessText.mapTitle }}</h2>
        <p>{{ businessText.mapDescription }}</p>
        <a class="card-link dark-link" :href="business.twoGisHref" target="_blank" rel="noopener">{{ businessText.mapLink }}</a>
      </div>

      <div
        ref="mapRoot"
        class="location-map-preview"
        :class="{ 'map-loaded': mapLoaded, 'map-failed': mapFailed }"
        :aria-label="businessText.mapLabel"
      >
        <img
          class="map-fallback"
          :src="business.mapPreviewSrc"
          width="880"
          height="440"
          loading="lazy"
          :alt="businessText.mapAlt"
        >
        <iframe
          v-if="mapAttempted && !mapFailed"
          :src="business.twoGisWidgetSrc"
          :title="businessText.mapLabel"
          loading="lazy"
          allowfullscreen
          @load="handleMapLoad"
        />
        <span class="map-card">
          <span>2GIS</span>
          <strong>{{ businessText.mapCardTitle }}</strong>
          <small>{{ businessText.mapCardPlace }}</small>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

const { businessText } = useLocaleContent()
const mapRoot = ref<HTMLElement | null>(null)
const mapAttempted = ref(false)
const mapLoaded = ref(false)
const mapFailed = ref(false)
let mapTimeout: number | undefined

const loadMap = () => {
  if (mapAttempted.value || mapLoaded.value) {
    return
  }

  mapAttempted.value = true
  mapFailed.value = false
  mapTimeout = window.setTimeout(() => {
    if (!mapLoaded.value) {
      mapFailed.value = true
      mapAttempted.value = false
    }
  }, 8000)
}

const handleMapLoad = () => {
  mapLoaded.value = true
  mapFailed.value = false

  if (mapTimeout) {
    window.clearTimeout(mapTimeout)
  }
}

onMounted(() => {
  if (!mapRoot.value || !('IntersectionObserver' in window)) {
    loadMap()
    return
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) {
      return
    }

    loadMap()
    observer.disconnect()
  }, {
    rootMargin: '140px'
  })

  observer.observe(mapRoot.value)
})

onBeforeUnmount(() => {
  if (mapTimeout) {
    window.clearTimeout(mapTimeout)
  }
})
</script>

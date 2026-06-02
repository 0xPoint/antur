<template>
  <section class="location-map-section" aria-labelledby="location-map-title">
    <div class="container location-map-grid">
      <div class="location-map-copy">
        <p class="eyebrow">Точка сбора</p>
        <h2 id="location-map-title">Точка сбора на интерактивной карте</h2>
        <a class="card-link dark-link" :href="business.twoGisHref" target="_blank" rel="noopener">Открыть в 2GIS</a>
      </div>

      <div
        ref="mapRoot"
        class="location-map-preview"
        :class="{ 'map-loaded': mapLoaded, 'map-failed': mapFailed }"
        aria-label="Интерактивная карта точки сбора Антур"
      >
        <img
          class="map-fallback"
          :src="business.mapPreviewSrc"
          width="880"
          height="440"
          loading="lazy"
          alt="Карта Петропавловска-Камчатского с точкой сбора Антур"
        >
        <iframe
          v-if="mapAttempted && !mapFailed"
          :src="business.twoGisWidgetSrc"
          title="Точка сбора Антур в 2GIS"
          loading="lazy"
          allowfullscreen
          @load="handleMapLoad"
        />
        <span class="map-card">
          <span>2GIS</span>
          <strong>Точка сбора Антур</strong>
          <small>Петропавловск-Камчатский</small>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

const mapRoot = ref<HTMLElement | null>(null)
const mapAttempted = ref(false)
const mapLoaded = ref(false)
const mapFailed = ref(false)
let mapTimeout: ReturnType<typeof window.setTimeout> | undefined

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

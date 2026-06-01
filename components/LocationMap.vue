<template>
  <section class="location-map-section" aria-labelledby="location-map-title">
    <div class="container location-map-grid">
      <div class="location-map-copy">
        <p class="eyebrow">Точка сбора</p>
        <h2 id="location-map-title">Откройте маршрут в 2GIS перед выездом</h2>
        <p>Перед выходом уточним точное время встречи, парковку и посадку на катер. Карта помогает заранее построить маршрут по Петропавловску-Камчатскому.</p>
        <a class="card-link dark-link" :href="business.twoGisHref" target="_blank" rel="noopener">Открыть в 2GIS</a>
      </div>

      <div class="location-map-frame">
        <iframe
          title="Карта 2GIS с точкой сбора Антур"
          :src="twoGisWidgetSrc"
          width="100%"
          height="440"
          loading="lazy"
          allowfullscreen
          referrerpolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { business } from '~/data/site'

const twoGisWidgetSrc = `https://widgets.2gis.com/widget?type=firmsonmap&options=${encodeURIComponent(JSON.stringify({
  pos: {
    lat: 53.0249,
    lon: 158.6483,
    zoom: 16
  },
  opt: {
    city: 'p_kamchatskiy'
  },
  org: '70000001114347561'
}))}`
</script>

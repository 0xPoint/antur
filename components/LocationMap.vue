<template>
  <section class="location-map-section" aria-labelledby="location-map-title">
    <div class="container location-map-grid">
      <div class="location-map-copy">
        <p class="eyebrow">Точка сбора</p>
        <h2 id="location-map-title">Откройте маршрут в 2GIS перед выездом</h2>
        <p>Перед выходом уточним точное время встречи, парковку и посадку на катер. Карта помогает заранее построить маршрут по Петропавловску-Камчатскому.</p>
        <a class="card-link dark-link" :href="business.twoGisHref" target="_blank" rel="noopener">Открыть в 2GIS</a>
      </div>

      <a class="location-map-preview" :href="business.twoGisHref" target="_blank" rel="noopener" aria-label="Открыть точку сбора Антур в 2GIS">
        <img
          :src="business.mapPreviewSrc"
          width="880"
          height="440"
          loading="lazy"
          alt="Карта Петропавловска-Камчатского с точкой сбора Антур"
        >
        <span class="map-card">
          <span>2GIS</span>
          <strong>Точка сбора Антур</strong>
          <small>Петропавловск-Камчатский</small>
        </span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { business } from '~/data/site'
</script>

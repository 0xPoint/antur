<template>
  <section class="hero" aria-labelledby="hero-title">
    <picture class="hero-media">
      <source :srcset="assetPath('/images/hero-orca-breach-mobile.jpg')" media="(max-width: 680px)">
      <img :src="assetPath('/images/hero-orca-breach.jpg')" width="1920" height="1276" alt="Касатки выпрыгивают из воды">
    </picture>
    <div class="hero-overlay" />
    <div class="container hero-content">
      <p class="eyebrow">Петропавловск-Камчатский</p>
      <h1 id="hero-title">Морские прогулки и глубоководная рыбалка на Камчатке</h1>
      <p class="hero-lead">Выходы в Тихий океан на катере: рыбалка, крабовое сафари, Бухта Русская, остров Старичков и спокойный морской день с экипажем, который знает акваторию.</p>
      <div class="hero-cta">
        <ContactButton class="hero-contact" label="Забронировать выход" context="Бронирование из первого экрана" />
        <NuxtLink class="btn btn-hero-secondary" to="/#routes">Смотреть маршруты</NuxtLink>
        <span class="hero-cta-note">Ответим по датам, погоде и формату поездки</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const assetPath = useAssetPath()
</script>

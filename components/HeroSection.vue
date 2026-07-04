<template>
  <section class="hero" aria-labelledby="hero-title">
    <picture class="hero-media">
      <source
        type="image/webp"
        :srcset="webpSrcset('/images/hero-orca-breach-mobile.jpg', [480, 720])"
        media="(max-width: 680px)"
        sizes="100vw"
      >
      <source
        type="image/webp"
        :srcset="webpSrcset('/images/hero-orca-breach.jpg', [960, 1280, 1600, 1920])"
        media="(min-width: 681px)"
        sizes="100vw"
      >
      <source :srcset="assetPath('/images/hero-orca-breach-mobile.jpg')" media="(max-width: 680px)">
      <img
        :src="assetPath('/images/hero-orca-breach.jpg')"
        width="1920"
        height="1276"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        :alt="text.hero.imageAlt"
      >
    </picture>
    <div class="hero-overlay" />
    <div class="container hero-content">
      <p class="eyebrow">{{ text.hero.location }}</p>
      <h1 id="hero-title">{{ text.hero.title }}</h1>
      <p class="hero-lead">{{ text.hero.lead }}</p>
      <div class="hero-cta">
        <ContactButton class="hero-contact" :label="text.contact.bookTrip" :context="text.hero.context" />
        <NuxtLink class="btn btn-hero-secondary" :to="localePath('/#routes')">{{ text.hero.routes }}</NuxtLink>
        <span class="hero-cta-note">{{ text.hero.note }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { assetPath, webpSrcset } = useImageSources()
const { localePath, text } = useLocaleContent()

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: assetPath('/images/webp/hero-orca-breach-mobile-720.webp'),
      imagesrcset: webpSrcset('/images/hero-orca-breach-mobile.jpg', [480, 720]),
      imagesizes: '100vw',
      media: '(max-width: 680px)',
      type: 'image/webp',
      fetchpriority: 'high'
    },
    {
      rel: 'preload',
      as: 'image',
      href: assetPath('/images/webp/hero-orca-breach-1280.webp'),
      imagesrcset: webpSrcset('/images/hero-orca-breach.jpg', [960, 1280, 1600, 1920]),
      imagesizes: '100vw',
      media: '(min-width: 681px)',
      type: 'image/webp',
      fetchpriority: 'high'
    }
  ]
})
</script>

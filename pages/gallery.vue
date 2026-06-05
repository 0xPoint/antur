<template>
  <section class="section page-top gallery" aria-labelledby="gallery-page-title">
    <div class="container">
      <p class="eyebrow">{{ text.gallery.eyebrow }}</p>
      <h1 id="gallery-page-title">{{ text.gallery.title }}</h1>
      <p class="page-lead">{{ text.gallery.lead }}</p>
      <div class="gallery-list">
        <article v-for="photo in tourPhotos" :key="photo.id" class="photo-card" :class="{ 'video-card': photo.kind === 'video' }">
          <video
            v-if="photo.kind === 'video'"
            controls
            playsinline
            preload="metadata"
            :aria-label="photo.alt"
          >
            <source :src="assetPath(photo.videoSrc || photo.src)" type="video/mp4">
          </video>
          <OptimizedImage
            v-else
            :src="photo.src"
            width="900"
            height="900"
            sizes="(max-width: 760px) 92vw, (max-width: 1100px) 44vw, 31vw"
            :widths="[480, 720, 960]"
            loading="lazy"
            :alt="photo.alt"
          />
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  alias: ['/en/gallery', '/zh/gallery']
})

const assetPath = useAssetPath()
const { text, tourPhotos } = useLocaleContent()

useAnturSeo({
  title: text.value.gallery.seoTitle,
  description: text.value.gallery.seoDescription,
  path: '/gallery'
})
</script>

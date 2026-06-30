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
          <div class="photo-copy">
            <strong>{{ photo.caption || photo.alt }}</strong>
            <span>
              <NuxtLink v-if="getPhotoRouteSlug(photo)" :to="localePath(`/routes/${getPhotoRouteSlug(photo)}`)">{{ photo.route }}</NuxtLink>
              <template v-else>{{ photo.route }}</template>
              <template v-if="photo.date"> · <time :datetime="photo.date">{{ formatDate(photo.date) }}</time></template>
            </span>
          </div>
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
const { text, tourPhotos, localePath } = useLocaleContent()

useAnturSeo({
  title: text.value.gallery.seoTitle,
  description: text.value.gallery.seoDescription,
  path: '/gallery'
})

const routeKeywordSlugs = [
  { slug: 'buhta-russkaya', keywords: ['бухта русская', 'russkaya', '鲁斯卡亚'] },
  { slug: 'ostrov-starichkov', keywords: ['старичков', 'starichkov', '斯塔里奇科夫'] },
  { slug: 'avachinskaya-buhta', keywords: ['авачин', 'avacha', '阿瓦恰', 'три брата', 'three brothers', '三兄弟'] },
  { slug: 'glubokovodnaya-rybalka', keywords: ['глубок', 'deep-sea', '深海'] },
  { slug: 'rybalka', keywords: ['рыбал', 'fishing', '海钓'] }
]

const getPhotoRouteSlug = (photo: { routeSlug?: string, route: string }) => {
  if (photo.routeSlug) {
    return photo.routeSlug
  }

  const route = photo.route.toLowerCase()
  const match = routeKeywordSlugs.find((item) =>
    item.keywords.some((keyword) => route.includes(keyword.toLowerCase()))
  )

  return match?.slug
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat(text.value.gallery.dateLocale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(`${date}T00:00:00`))
</script>
